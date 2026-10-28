/**
 * RITW CMS & Campus Portal - Authentication & Role Verification Middleware
 * Enforces role-based access control (RBAC) across Students, Parents, Staff, and Admins.
 */
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../db/database');

function authenticate(req, res, next) {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
    } else if (req.headers['x-access-token']) {
        token = req.headers['x-access-token'];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Verify user still exists in database and is active
        const user = db.prepare('SELECT id, username, email, role, is_active FROM users WHERE id = ?').get(decoded.id);

        if (!user || user.is_active !== 1) {
            return res.status(401).json({
                success: false,
                message: 'Account not found or inactive.'
            });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please log in again.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid authorization token.'
        });
    }
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access forbidden. Administrator privileges required.'
        });
    }
    next();
}

/**
 * Enforce one or more allowed roles (e.g. requireRole('student'), requireRole('parent'), etc.)
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        // 'admin' can access all portal roles for debugging/oversight if needed,
        // or strictly check if roles includes user role
        if (!roles.includes(req.user.role) && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: `Access denied. Authorized roles for this endpoint: [${roles.join(', ')}]. Your current role is: '${req.user.role}'.`
            });
        }

        next();
    };
}

/**
 * Middleware that loads the corresponding profile record for the user based on role
 */
function attachRoleProfile(req, res, next) {
    if (!req.user) return next();

    try {
        if (req.user.role === 'student') {
            const student = db.prepare('SELECT * FROM students WHERE user_id = ?').get(req.user.id);
            if (!student && req.user.role !== 'admin') {
                return res.status(404).json({
                    success: false,
                    message: 'Student record not found for this user account.'
                });
            }
            req.student = student;
        } else if (req.user.role === 'parent') {
            const parent = db.prepare('SELECT * FROM parents WHERE user_id = ?').get(req.user.id);
            if (!parent && req.user.role !== 'admin') {
                return res.status(404).json({
                    success: false,
                    message: 'Parent record not found for this user account.'
                });
            }
            req.parent = parent;
        } else if (req.user.role === 'staff') {
            const staff = db.prepare('SELECT * FROM staff WHERE user_id = ?').get(req.user.id);
            if (!staff && req.user.role !== 'admin') {
                return res.status(404).json({
                    success: false,
                    message: 'Staff record not found for this user account.'
                });
            }
            req.staff = staff;
        }
        next();
    } catch (err) {
        console.error('[ATTACH PROFILE ERROR]', err);
        return res.status(500).json({
            success: false,
            message: 'Error resolving user profile context.'
        });
    }
}

module.exports = {
    authenticate,
    requireAdmin,
    requireRole,
    attachRoleProfile
};
