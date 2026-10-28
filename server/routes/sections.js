/**
 * RITW CMS - Content Sections Router
 * Reusable sections (Hero sliders, Counters, Why RITW, Testimonials, Custom blocks)
 */
const express = require('express');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sanitizeBodyMiddleware } = require('../middleware/sanitize');
const cache = require('../services/cache');

const router = express.Router();

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// GET /api/v1/public/homepage
router.get('/public/homepage', (req, res) => {
    const cacheKey = 'public_homepage_content';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    // Get homepage record
    const homePage = db.prepare('SELECT id, title, meta_title, meta_description FROM pages WHERE slug = "home"').get();
    const pageId = homePage ? homePage.id : null;

    // Fetch all active sections for homepage
    const sections = db.prepare(`
        SELECT id, section_key, title, subtitle, content_html, image_url, button_text, button_url, section_type, sort_order, custom_data
        FROM content_sections
        WHERE (page_id = ? OR page_id IS NULL) AND is_visible = 1
        ORDER BY sort_order ASC, id ASC
    `).all(pageId);

    // Group sections by type for easy consumption by frontend sliders and grids
    const heroSlides = [];
    const counters = [];
    const whyRitw = [];
    const testimonials = [];
    const spotlight = [];
    const customSections = [];

    for (const s of sections) {
        const parsed = {
            ...s,
            custom_data: s.custom_data ? JSON.parse(s.custom_data) : {}
        };
        if (s.section_type === 'hero_slide') heroSlides.push(parsed);
        else if (s.section_type === 'counter') counters.push(parsed);
        else if (s.section_type === 'why_ritw') whyRitw.push(parsed);
        else if (s.section_type === 'testimonial') testimonials.push(parsed);
        else if (s.section_type === 'spotlight') spotlight.push(parsed);
        else customSections.push(parsed);
    }

    // Fetch active flash news
    const now = new Date().toISOString().split('T')[0];
    const announcements = db.prepare(`
        SELECT id, title, summary, link_url, badge_text, badge_color, is_flash
        FROM announcements_news
        WHERE status = 'published'
          AND (start_date IS NULL OR start_date <= ?)
          AND (end_date IS NULL OR end_date >= ?)
        ORDER BY sort_order ASC, id DESC
    `).all(now, now);

    // Fetch college settings
    const generalSettings = db.prepare('SELECT value FROM college_settings WHERE key = "general"').get();
    const contactSettings = db.prepare('SELECT value FROM college_settings WHERE key = "contact"').get();
    const socialSettings = db.prepare('SELECT value FROM college_settings WHERE key = "social"').get();
    const accreditations = db.prepare('SELECT value FROM college_settings WHERE key = "accreditations"').get();
    const features = db.prepare('SELECT value FROM college_settings WHERE key = "features"').get();

    const responseData = {
        success: true,
        homepage: {
            page: homePage,
            hero_slides: heroSlides,
            announcements,
            counters,
            why_ritw: whyRitw,
            testimonials,
            spotlight,
            custom_sections: customSections,
            college_info: generalSettings ? JSON.parse(generalSettings.value) : {},
            contact: contactSettings ? JSON.parse(contactSettings.value) : {},
            social: socialSettings ? JSON.parse(socialSettings.value) : {},
            accreditations: accreditations ? JSON.parse(accreditations.value) : [],
            features: features ? JSON.parse(features.value) : {}
        }
    };

    cache.set(cacheKey, responseData);
    res.json(responseData);
});

// ============================================================================
// ADMIN ROUTES (Protected)
// ============================================================================

// GET /api/v1/admin/sections
router.get('/admin/sections', authenticate, requireAdmin, (req, res) => {
    const { page_id, section_type } = req.query;

    let query = `
        SELECT cs.*, p.title as page_title
        FROM content_sections cs
        LEFT JOIN pages p ON p.id = cs.page_id
        WHERE 1=1
    `;
    const params = [];

    if (page_id !== undefined && page_id !== '') {
        query += ' AND cs.page_id = ?';
        params.push(parseInt(page_id, 10));
    }
    if (section_type) {
        query += ' AND cs.section_type = ?';
        params.push(section_type);
    }

    query += ' ORDER BY cs.sort_order ASC, cs.id ASC';

    const sections = db.prepare(query).all(...params);

    res.json({
        success: true,
        sections: sections.map(s => ({
            ...s,
            custom_data: s.custom_data ? JSON.parse(s.custom_data) : {}
        }))
    });
});

// POST /api/v1/admin/sections
router.post('/admin/sections', authenticate, requireAdmin, sanitizeBodyMiddleware, (req, res) => {
    const { page_id, section_key, title, subtitle, content_html, image_url, button_text, button_url, section_type, sort_order, is_visible, custom_data } = req.body;

    if (!section_key && !title) {
        return res.status(400).json({ success: false, message: 'Section title or key is required.' });
    }

    const key = section_key || `sec_${Date.now()}`;
    const order = parseInt(sort_order || '0', 10);
    const visible = is_visible !== undefined ? (is_visible ? 1 : 0) : 1;
    const customDataStr = typeof custom_data === 'object' ? JSON.stringify(custom_data) : (custom_data || null);

    const result = db.prepare(`
        INSERT INTO content_sections (page_id, section_key, title, subtitle, content_html, image_url, button_text, button_url, section_type, sort_order, is_visible, custom_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        page_id ? parseInt(page_id, 10) : null,
        key.trim(),
        title ? title.trim() : null,
        subtitle ? subtitle.trim() : null,
        content_html || null,
        image_url || null,
        button_text || null,
        button_url || null,
        section_type || 'standard',
        order,
        visible,
        customDataStr
    );

    cache.clear();

    res.status(201).json({
        success: true,
        message: 'Content section created successfully',
        id: result.lastInsertRowid
    });
});

// PUT /api/v1/admin/sections/:id
router.put('/admin/sections/:id', authenticate, requireAdmin, sanitizeBodyMiddleware, (req, res) => {
    const sectionId = parseInt(req.params.id, 10);
    const section = db.prepare('SELECT id FROM content_sections WHERE id = ?').get(sectionId);

    if (!section) {
        return res.status(404).json({ success: false, message: 'Content section not found' });
    }

    const { page_id, section_key, title, subtitle, content_html, image_url, button_text, button_url, section_type, sort_order, is_visible, custom_data } = req.body;

    const customDataStr = typeof custom_data === 'object' ? JSON.stringify(custom_data) : (custom_data || null);

    db.prepare(`
        UPDATE content_sections
        SET page_id = ?, section_key = ?, title = ?, subtitle = ?, content_html = ?, image_url = ?, button_text = ?, button_url = ?, section_type = ?, sort_order = ?, is_visible = ?, custom_data = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        page_id ? parseInt(page_id, 10) : null,
        section_key ? section_key.trim() : `sec_${sectionId}`,
        title ? title.trim() : null,
        subtitle ? subtitle.trim() : null,
        content_html || null,
        image_url || null,
        button_text || null,
        button_url || null,
        section_type || 'standard',
        parseInt(sort_order !== undefined ? sort_order : 0, 10),
        is_visible !== undefined ? (is_visible ? 1 : 0) : 1,
        customDataStr,
        sectionId
    );

    cache.clear();

    res.json({
        success: true,
        message: 'Content section updated successfully'
    });
});

// POST /api/v1/admin/sections/reorder
router.post('/admin/sections/reorder', authenticate, requireAdmin, (req, res) => {
    const { items } = req.body; // array of { id, sort_order }

    if (!Array.isArray(items)) {
        return res.status(400).json({ success: false, message: 'Array of items expected.' });
    }

    const stmt = db.prepare('UPDATE content_sections SET sort_order = ? WHERE id = ?');
    for (const item of items) {
        stmt.run(parseInt(item.sort_order, 10), parseInt(item.id, 10));
    }

    cache.clear();

    res.json({
        success: true,
        message: 'Sections reordered successfully'
    });
});

// DELETE /api/v1/admin/sections/:id
router.delete('/admin/sections/:id', authenticate, requireAdmin, (req, res) => {
    const sectionId = parseInt(req.params.id, 10);
    const section = db.prepare('SELECT id FROM content_sections WHERE id = ?').get(sectionId);

    if (!section) {
        return res.status(404).json({ success: false, message: 'Content section not found' });
    }

    db.prepare('DELETE FROM content_sections WHERE id = ?').run(sectionId);

    cache.clear();

    res.json({
        success: true,
        message: 'Content section deleted successfully'
    });
});

module.exports = router;
