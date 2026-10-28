/**
 * RITW CMS - Announcements & Flash News Router
 */
const express = require('express');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sanitizeBodyMiddleware } = require('../middleware/sanitize');
const cache = require('../services/cache');

const router = express.Router();

// Public: GET /api/v1/public/announcements
router.get('/public/announcements', (req, res) => {
    const cacheKey = 'public_announcements';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const now = new Date().toISOString().split('T')[0];
    const items = db.prepare(`
        SELECT id, title, summary, link_url, badge_text, badge_color, is_flash, start_date, end_date
        FROM announcements_news
        WHERE status = 'published'
          AND (start_date IS NULL OR start_date <= ?)
          AND (end_date IS NULL OR end_date >= ?)
        ORDER BY sort_order ASC, id DESC
    `).all(now, now);

    const responseData = { success: true, announcements: items };
    cache.set(cacheKey, responseData);
    res.json(responseData);
});

// Admin: GET /api/v1/admin/announcements
router.get('/admin/announcements', authenticate, requireAdmin, (req, res) => {
    const items = db.prepare('SELECT * FROM announcements_news ORDER BY sort_order ASC, id DESC').all();
    res.json({ success: true, announcements: items });
});

// Admin: POST /api/v1/admin/announcements
router.post('/admin/announcements', authenticate, requireAdmin, sanitizeBodyMiddleware, (req, res) => {
    const { title, summary, link_url, badge_text, badge_color, is_flash, status, start_date, end_date, sort_order } = req.body;

    if (!title) {
        return res.status(400).json({ success: false, message: 'Announcement title is required.' });
    }

    const result = db.prepare(`
        INSERT INTO announcements_news (title, summary, link_url, badge_text, badge_color, is_flash, status, start_date, end_date, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        title.trim(),
        summary || null,
        link_url || null,
        badge_text || 'NEW',
        badge_color || '#159B62',
        is_flash !== undefined ? (is_flash ? 1 : 0) : 1,
        status || 'published',
        start_date || null,
        end_date || null,
        parseInt(sort_order || '0', 10)
    );

    cache.clear();

    res.status(201).json({
        success: true,
        message: 'Announcement published successfully',
        id: result.lastInsertRowid
    });
});

// Admin: PUT /api/v1/admin/announcements/:id
router.put('/admin/announcements/:id', authenticate, requireAdmin, sanitizeBodyMiddleware, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const existing = db.prepare('SELECT id FROM announcements_news WHERE id = ?').get(id);

    if (!existing) {
        return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    const { title, summary, link_url, badge_text, badge_color, is_flash, status, start_date, end_date, sort_order } = req.body;

    db.prepare(`
        UPDATE announcements_news
        SET title = ?, summary = ?, link_url = ?, badge_text = ?, badge_color = ?, is_flash = ?, status = ?, start_date = ?, end_date = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        title ? title.trim() : '',
        summary || null,
        link_url || null,
        badge_text || 'NEW',
        badge_color || '#159B62',
        is_flash !== undefined ? (is_flash ? 1 : 0) : 1,
        status || 'published',
        start_date || null,
        end_date || null,
        parseInt(sort_order !== undefined ? sort_order : 0, 10),
        id
    );

    cache.clear();

    res.json({
        success: true,
        message: 'Announcement updated successfully'
    });
});

// Admin: DELETE /api/v1/admin/announcements/:id
router.delete('/admin/announcements/:id', authenticate, requireAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.prepare('DELETE FROM announcements_news WHERE id = ?').run(id);

    cache.clear();

    res.json({
        success: true,
        message: 'Announcement deleted successfully'
    });
});

module.exports = router;
