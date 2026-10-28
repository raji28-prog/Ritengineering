/**
 * RITW Campus Portal - Common Shared Routes
 * Shared features consistent across all roles (Notifications, Announcements, Profile settings)
 * with strict permission filtering.
 */
const express = require('express');
const db = require('../db/database');
const { authenticate, attachRoleProfile } = require('../middleware/auth');

const router = express.Router();

// All common routes require active authentication
router.use(authenticate, attachRoleProfile);

/**
 * GET /api/v1/portal/common/notifications
 * Returns notifications specifically belonging to the authenticated user
 */
router.get('/notifications', (req, res) => {
    const userId = req.user.id;

    const notifications = db.prepare(`
        SELECT id, title, message, type, is_read, created_at
        FROM user_notifications
        WHERE user_id = ?
        ORDER BY is_read ASC, created_at DESC
        LIMIT 30
    `).all(userId);

    const unreadCount = db.prepare(`
        SELECT COUNT(*) as c FROM user_notifications WHERE user_id = ? AND is_read = 0
    `).get(userId).c;

    res.json({
        success: true,
        unread_count: unreadCount,
        data: notifications
    });
});

/**
 * POST /api/v1/portal/common/notifications/mark-read
 * Marks a single notification or all user notifications as read
 */
router.post('/notifications/mark-read', (req, res) => {
    const userId = req.user.id;
    const { notification_id } = req.body;

    if (notification_id) {
        db.prepare(`
            UPDATE user_notifications SET is_read = 1 
            WHERE id = ? AND user_id = ?
        `).run(notification_id, userId);
    } else {
        db.prepare(`
            UPDATE user_notifications SET is_read = 1 
            WHERE user_id = ?
        `).run(userId);
    }

    res.json({
        success: true,
        message: 'Notifications marked as read.'
    });
});

/**
 * GET /api/v1/portal/common/announcements
 * Role-filtered announcements based on authenticated user's role
 */
router.get('/announcements', (req, res) => {
    const role = req.user.role; // 'student', 'parent', 'staff', or 'admin'

    let targetAudienceClause = "target_audience = 'all'";
    if (role === 'student') {
        targetAudienceClause = "target_audience IN ('all', 'students')";
    } else if (role === 'parent') {
        targetAudienceClause = "target_audience IN ('all', 'parents')";
    } else if (role === 'staff') {
        targetAudienceClause = "target_audience IN ('all', 'staff')";
    } else if (role === 'admin') {
        targetAudienceClause = "1=1"; // Admin can view all
    }

    const announcements = db.prepare(`
        SELECT id, title, content, category, target_audience, department, priority, posted_date, posted_by
        FROM portal_announcements
        WHERE ${targetAudienceClause}
        ORDER BY 
            CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END,
            posted_date DESC
    `).all();

    res.json({
        success: true,
        role,
        data: announcements
    });
});

/**
 * GET /api/v1/portal/common/profile
 * Get unified profile details
 */
router.get('/profile', (req, res) => {
    let profile = null;
    let roleTitle = 'Portal User';

    if (req.user.role === 'student') {
        profile = db.prepare('SELECT * FROM students WHERE user_id = ?').get(req.user.id);
        roleTitle = 'Student';
    } else if (req.user.role === 'parent') {
        profile = db.prepare('SELECT * FROM parents WHERE user_id = ?').get(req.user.id);
        roleTitle = 'Parent / Guardian';
    } else if (req.user.role === 'staff') {
        profile = db.prepare('SELECT * FROM staff WHERE user_id = ?').get(req.user.id);
        roleTitle = 'Faculty / Staff';
    } else if (req.user.role === 'admin') {
        roleTitle = 'System Administrator';
    }

    res.json({
        success: true,
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            roleTitle
        },
        profile
    });
});

/**
 * PUT /api/v1/portal/common/profile
 * Update editable profile contact fields
 */
router.put('/profile', (req, res) => {
    const { phone, address, occupation, office_room } = req.body;

    if (req.user.role === 'student') {
        if (phone || address) {
            db.prepare(`
                UPDATE students 
                SET phone = COALESCE(?, phone), address = COALESCE(?, address) 
                WHERE user_id = ?
            `).run(phone || null, address || null, req.user.id);
        }
    } else if (req.user.role === 'parent') {
        if (phone || address || occupation) {
            db.prepare(`
                UPDATE parents 
                SET phone = COALESCE(?, phone), address = COALESCE(?, address), occupation = COALESCE(?, occupation)
                WHERE user_id = ?
            `).run(phone || null, address || null, occupation || null, req.user.id);
        }
    } else if (req.user.role === 'staff') {
        if (phone || office_room) {
            db.prepare(`
                UPDATE staff 
                SET phone = COALESCE(?, phone), office_room = COALESCE(?, office_room)
                WHERE user_id = ?
            `).run(phone || null, office_room || null, req.user.id);
        }
    }

    res.json({
        success: true,
        message: 'Profile settings updated successfully.'
    });
});

module.exports = router;
