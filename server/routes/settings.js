/**
 * RITW CMS - College Settings & Module Configuration Router
 */
const express = require('express');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const cache = require('../services/cache');

const router = express.Router();

// Public: GET /api/v1/public/settings/college
router.get('/public/settings/college', (req, res) => {
    const cacheKey = 'public_college_settings';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const rows = db.prepare('SELECT key, value, category FROM college_settings').all();
    const settings = {};

    rows.forEach(r => {
        try {
            settings[r.key] = JSON.parse(r.value);
        } catch {
            settings[r.key] = r.value;
        }
    });

    const responseData = { success: true, settings };
    cache.set(cacheKey, responseData);
    res.json(responseData);
});

// Admin: GET /api/v1/admin/settings
router.get('/admin/settings', authenticate, requireAdmin, (req, res) => {
    const rows = db.prepare('SELECT key, value, category, updated_at FROM college_settings').all();
    const settings = {};

    rows.forEach(r => {
        try {
            settings[r.key] = JSON.parse(r.value);
        } catch {
            settings[r.key] = r.value;
        }
    });

    res.json({ success: true, settings });
});

// Admin: PUT /api/v1/admin/settings/:category
router.put('/admin/settings/:category', authenticate, requireAdmin, (req, res) => {
    const category = req.params.category.toLowerCase().trim();
    const { value } = req.body;

    if (!value || typeof value !== 'object') {
        return res.status(400).json({ success: false, message: 'Settings value object is required.' });
    }

    const valueStr = JSON.stringify(value);

    db.prepare(`
        INSERT INTO college_settings (key, value, category, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
    `).run(category, valueStr, category);

    // Audit log
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    db.prepare(`
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address)
        VALUES (?, 'UPDATE_SETTINGS', 'settings', null, ?, ?)
    `).run(req.user.id, `Updated settings category: ${category}`, ip);

    cache.clear();

    res.json({
        success: true,
        message: `Settings for "${category}" updated successfully.`
    });
});

// Admin: GET /api/v1/admin/audit-logs
router.get('/admin/audit-logs', authenticate, requireAdmin, (req, res) => {
    const logs = db.prepare(`
        SELECT al.*, u.username
        FROM audit_logs al
        LEFT JOIN users u ON u.id = al.user_id
        ORDER BY al.id DESC
        LIMIT 100
    `).all();

    res.json({ success: true, logs });
});

module.exports = router;
