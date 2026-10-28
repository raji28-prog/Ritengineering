/**
 * RITW CMS - Authentication Router
 * Protected endpoints, password verification, rate-limiting, and JWT generation.
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db/database');
const { authenticate } = require('../middleware/auth');
const loginRateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/v1/admin/auth/login
router.post('/login', loginRateLimiter, (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required.'
        });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim());

    if (!user) {
        req.recordFailedLogin();
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials. Please verify your user ID and password.'
        });
    }

    if (user.is_active !== 1) {
        return res.status(403).json({
            success: false,
            message: 'This account has been deactivated. Please contact the administrator.'
        });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
        req.recordFailedLogin();
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials. Please verify your user ID and password.'
        });
    }

    // Success: clear rate limiter history for this IP
    req.clearFailedLogin();

    // Update last login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    // Record audit log
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    db.prepare(`
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
        VALUES (?, 'LOGIN', 'user', ?, 'Successful admin authentication', ?)
    `).run(user.id, user.id, ip);

    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.json({
        success: true,
        message: 'Authentication successful.',
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
});

// GET /api/v1/admin/auth/me
router.get('/me', authenticate, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// POST /api/v1/admin/auth/change-password
router.post('/change-password', authenticate, (req, res) => {
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
        return res.status(400).json({
            success: false,
            message: 'Both current password and new password are required.'
        });
    }

    if (new_password.length < 8) {
        return res.status(400).json({
            success: false,
            message: 'New password must be at least 8 characters long.'
        });
    }

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
    const isMatch = bcrypt.compareSync(old_password, user.password_hash);

    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: 'Current password does not match.'
        });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(new_password, salt);

    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newHash, req.user.id);

    // Audit log
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    db.prepare(`
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
        VALUES (?, 'CHANGE_PASSWORD', 'user', ?, 'Admin password updated', ?)
    `).run(req.user.id, req.user.id, ip);

    res.json({
        success: true,
        message: 'Password updated successfully. Please use your new password on next login.'
    });
});

// POST /api/v1/admin/auth/logout
router.post('/logout', authenticate, (req, res) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    db.prepare(`
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
        VALUES (?, 'LOGOUT', 'user', ?, 'Admin logged out', ?)
    `).run(req.user.id, req.user.id, ip);

    res.json({
        success: true,
        message: 'Logged out successfully.'
    });
});

module.exports = router;
