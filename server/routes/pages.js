/**
 * RITW CMS - Pages Router
 * Public retrieval of published pages and Admin CRUD operations.
 */
const express = require('express');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sanitizeBodyMiddleware } = require('../middleware/sanitize');
const cache = require('../services/cache');

const router = express.Router();

function slugify(text) {
    return text.toString().toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// GET /api/v1/public/pages/:slug
router.get('/public/pages/:slug', (req, res) => {
    const slug = req.params.slug.toLowerCase().trim();
    const cacheKey = `public_page_${slug}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const page = db.prepare(`
        SELECT id, title, slug, meta_title, meta_description, template, published_at, updated_at
        FROM pages
        WHERE slug = ? AND status = 'published'
    `).get(slug);

    if (!page) {
        return res.status(404).json({
            success: false,
            message: `Page not found: ${slug}`
        });
    }

    // Fetch visible sections for this page
    const sections = db.prepare(`
        SELECT id, section_key, title, subtitle, content_html, image_url, button_text, button_url, section_type, sort_order, custom_data
        FROM content_sections
        WHERE page_id = ? AND is_visible = 1
        ORDER BY sort_order ASC
    `).all(page.id);

    // Fetch custom field values
    const customFields = db.prepare(`
        SELECT cfd.field_key, cfd.field_type, cfv.field_value
        FROM custom_field_values cfv
        JOIN custom_field_definitions cfd ON cfd.id = cfv.field_definition_id
        WHERE cfv.entity_type = 'page' AND cfv.entity_id = ?
    `).all(page.id);

    const customFieldMap = {};
    customFields.forEach(cf => {
        customFieldMap[cf.field_key] = cf.field_value;
    });

    const responseData = {
        success: true,
        page: {
            ...page,
            sections: sections.map(s => ({
                ...s,
                custom_data: s.custom_data ? JSON.parse(s.custom_data) : {}
            })),
            custom_fields: customFieldMap
        }
    };

    cache.set(cacheKey, responseData);
    res.json(responseData);
});

// ============================================================================
// ADMIN ROUTES (Protected)
// ============================================================================

// GET /api/v1/admin/pages
router.get('/admin/pages', authenticate, requireAdmin, (req, res) => {
    const pages = db.prepare(`
        SELECT p.*, COUNT(cs.id) as section_count
        FROM pages p
        LEFT JOIN content_sections cs ON cs.page_id = p.id
        GROUP BY p.id
        ORDER BY p.sort_order ASC, p.id ASC
    `).all();

    res.json({
        success: true,
        pages
    });
});

// GET /api/v1/admin/pages/:id
router.get('/admin/pages/:id', authenticate, requireAdmin, (req, res) => {
    const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id);
    if (!page) {
        return res.status(404).json({ success: false, message: 'Page not found' });
    }

    const sections = db.prepare('SELECT * FROM content_sections WHERE page_id = ? ORDER BY sort_order ASC').all(page.id);
    const customFields = db.prepare(`
        SELECT cfd.id as definition_id, cfd.field_name, cfd.field_key, cfd.field_type, cfv.field_value
        FROM custom_field_definitions cfd
        LEFT JOIN custom_field_values cfv ON cfv.field_definition_id = cfd.id AND cfv.entity_type = 'page' AND cfv.entity_id = ?
        WHERE cfd.entity_type = 'page'
        ORDER BY cfd.sort_order ASC
    `).all(page.id);

    res.json({
        success: true,
        page: {
            ...page,
            sections,
            custom_fields: customFields
        }
    });
});

// POST /api/v1/admin/pages
router.post('/admin/pages', authenticate, requireAdmin, sanitizeBodyMiddleware, (req, res) => {
    let { title, slug, meta_title, meta_description, status, template, sort_order } = req.body;

    if (!title) {
        return res.status(400).json({ success: false, message: 'Page title is required' });
    }

    slug = slug ? slugify(slug) : slugify(title);

    // Check slug uniqueness
    const existing = db.prepare('SELECT id FROM pages WHERE slug = ?').get(slug);
    if (existing) {
        return res.status(400).json({ success: false, message: `A page with URL slug "${slug}" already exists.` });
    }

    const validStatus = ['draft', 'published', 'archived'].includes(status) ? status : 'published';

    const result = db.prepare(`
        INSERT INTO pages (title, slug, meta_title, meta_description, status, template, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        title.trim(),
        slug,
        meta_title || title,
        meta_description || '',
        validStatus,
        template || 'standard',
        parseInt(sort_order || '0', 10)
    );

    cache.clear();

    res.status(201).json({
        success: true,
        message: 'Page created successfully',
        page_id: result.lastInsertRowid,
        slug
    });
});

// PUT /api/v1/admin/pages/:id
router.put('/admin/pages/:id', authenticate, requireAdmin, sanitizeBodyMiddleware, (req, res) => {
    const pageId = req.params.id;
    const page = db.prepare('SELECT id FROM pages WHERE id = ?').get(pageId);
    if (!page) {
        return res.status(404).json({ success: false, message: 'Page not found' });
    }

    let { title, slug, meta_title, meta_description, status, template, sort_order } = req.body;

    if (!title) {
        return res.status(400).json({ success: false, message: 'Page title is required' });
    }

    slug = slug ? slugify(slug) : slugify(title);

    // Check slug uniqueness for other pages
    const existing = db.prepare('SELECT id FROM pages WHERE slug = ? AND id != ?').get(slug, pageId);
    if (existing) {
        return res.status(400).json({ success: false, message: `Another page with URL slug "${slug}" already exists.` });
    }

    const validStatus = ['draft', 'published', 'archived'].includes(status) ? status : 'published';

    db.prepare(`
        UPDATE pages
        SET title = ?, slug = ?, meta_title = ?, meta_description = ?, status = ?, template = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        title.trim(),
        slug,
        meta_title || title,
        meta_description || '',
        validStatus,
        template || 'standard',
        parseInt(sort_order || '0', 10),
        pageId
    );

    cache.clear();

    res.json({
        success: true,
        message: 'Page updated successfully',
        slug
    });
});

// DELETE /api/v1/admin/pages/:id
router.delete('/admin/pages/:id', authenticate, requireAdmin, (req, res) => {
    const pageId = req.params.id;
    const page = db.prepare('SELECT id, slug FROM pages WHERE id = ?').get(pageId);
    if (!page) {
        return res.status(404).json({ success: false, message: 'Page not found' });
    }

    // Disallow deleting home page
    if (page.slug === 'home') {
        return res.status(400).json({ success: false, message: 'The primary homepage cannot be deleted.' });
    }

    db.prepare('DELETE FROM content_sections WHERE page_id = ?').run(pageId);
    db.prepare('DELETE FROM custom_field_values WHERE entity_type = "page" AND entity_id = ?').run(pageId);
    db.prepare('DELETE FROM pages WHERE id = ?').run(pageId);

    cache.clear();

    res.json({
        success: true,
        message: 'Page deleted successfully'
    });
});

module.exports = router;
