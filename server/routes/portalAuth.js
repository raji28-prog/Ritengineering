/**
 * RITW Campus Portal - Authentication Router
 * Unified and secure role-based login for Students, Parents, and Staff.
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db/database');
const { authenticate, attachRoleProfile } = require('../middleware/auth');
const loginRateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

/**
 * POST /api/v1/portal/auth/login
 * Body: { identifier, password, expectedRole? }
 */
router.post('/login', loginRateLimiter, (req, res) => {
    const { identifier, password, expectedRole } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({
            success: false,
            message: 'User ID / Roll No / Email and password are required.'
        });
    }

    const cleanIdentifier = identifier.trim();

    // Find user by username, email, roll_number, parent_code, or staff_code
    let user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(cleanIdentifier, cleanIdentifier);

    if (!user) {
        // Try looking up roll_number in students
        const st = db.prepare('SELECT user_id FROM students WHERE roll_number = ?').get(cleanIdentifier);
        if (st) {
            user = db.prepare('SELECT * FROM users WHERE id = ?').get(st.user_id);
        }
    }

    if (!user) {
        // Try looking up parent_code or phone in parents
        const par = db.prepare('SELECT user_id FROM parents WHERE parent_code = ? OR phone = ?').get(cleanIdentifier, cleanIdentifier);
        if (par) {
            user = db.prepare('SELECT * FROM users WHERE id = ?').get(par.user_id);
        }
    }

    if (!user) {
        // Try looking up staff_code in staff
        const stf = db.prepare('SELECT user_id FROM staff WHERE staff_code = ?').get(cleanIdentifier);
        if (stf) {
            user = db.prepare('SELECT * FROM users WHERE id = ?').get(stf.user_id);
        }
    }

    if (!user) {
        if (typeof req.recordFailedLogin === 'function') req.recordFailedLogin();
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials. User ID not found in institutional directory.'
        });
    }

    if (user.is_active !== 1) {
        return res.status(403).json({
            success: false,
            message: 'Your account is deactivated. Please contact the Academic Administration.'
        });
    }

    // Verify password
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
        if (typeof req.recordFailedLogin === 'function') req.recordFailedLogin();
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials. Please verify your password.'
        });
    }

    // Role check if expectedRole is passed
    if (expectedRole && expectedRole !== 'any') {
        if (user.role !== expectedRole && user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: `Account role mismatch. This account is registered as '${user.role.toUpperCase()}', but you selected the '${expectedRole.toUpperCase()}' login. Please switch to the correct tab.`,
                actualRole: user.role
            });
        }
    }

    if (typeof req.clearFailedLogin === 'function') req.clearFailedLogin();

    // Update last login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    // Fetch profile details based on role
    let profile = null;
    let displayName = user.username;

    if (user.role === 'student') {
        profile = db.prepare('SELECT * FROM students WHERE user_id = ?').get(user.id);
        if (profile) displayName = profile.full_name;
    } else if (user.role === 'parent') {
        profile = db.prepare('SELECT * FROM parents WHERE user_id = ?').get(user.id);
        if (profile) displayName = profile.full_name;
    } else if (user.role === 'staff') {
        profile = db.prepare('SELECT * FROM staff WHERE user_id = ?').get(user.id);
        if (profile) displayName = profile.full_name;
    }

    // Record audit log
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    try {
        db.prepare(`
            INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
            VALUES (?, 'PORTAL_LOGIN', 'user', ?, ?, ?)
        `).run(user.id, user.id, `User authenticated to Campus Portal with role: ${user.role}`, ip);
    } catch (e) {
        // Audit log fallback
    }

    // Issue JWT token
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
        success: true,
        message: `Welcome back, ${displayName}!`,
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            displayName,
            profile
        }
    });
});

/**
 * GET /api/v1/portal/auth/me
 */
router.get('/me', authenticate, attachRoleProfile, (req, res) => {
    let profile = null;
    let displayName = req.user.username;

    if (req.user.role === 'student') {
        profile = req.student || db.prepare('SELECT * FROM students WHERE user_id = ?').get(req.user.id);
        if (profile) displayName = profile.full_name;
    } else if (req.user.role === 'parent') {
        profile = req.parent || db.prepare('SELECT * FROM parents WHERE user_id = ?').get(req.user.id);
        if (profile) displayName = profile.full_name;
    } else if (req.user.role === 'staff') {
        profile = req.staff || db.prepare('SELECT * FROM staff WHERE user_id = ?').get(req.user.id);
        if (profile) displayName = profile.full_name;
    }

    res.json({
        success: true,
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            displayName,
            profile
        }
    });
});

/**
 * POST /api/v1/portal/auth/change-password
 */
router.post('/change-password', authenticate, (req, res) => {
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
        return res.status(400).json({
            success: false,
            message: 'Current password and new password are both required.'
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

    res.json({
        success: true,
        message: 'Password updated successfully. Please use your new password next time.'
    });
});

module.exports = router;
