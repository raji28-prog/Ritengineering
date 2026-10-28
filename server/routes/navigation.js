/**
 * RITW CMS - Navigation Router
 * Manages menus, nested submenus, visual ordering, route binding, and visibility.
 */
const express = require('express');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const cache = require('../services/cache');

const router = express.Router();

// Helper to build nested tree from flat list
function buildMenuTree(items, parentId = null) {
    const branch = [];
    for (const item of items) {
        if (item.parent_id === parentId) {
            const children = buildMenuTree(items, item.id);
            branch.push({
                ...item,
                children
            });
        }
    }
    return branch;
}

// Helper to check if potentialParentId is a descendant of itemId (to prevent cycles)
function isDescendant(itemId, potentialParentId) {
    if (!potentialParentId) return false;
    if (itemId === potentialParentId) return true;

    const parent = db.prepare('SELECT parent_id FROM navigation_items WHERE id = ?').get(potentialParentId);
    if (!parent || !parent.parent_id) return false;
    return isDescendant(itemId, parent.parent_id);
}

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// GET /api/v1/public/navigation
router.get('/public/navigation', (req, res) => {
    const menuKey = req.query.menu_key || 'main_header';
    const cacheKey = `public_nav_${menuKey}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const menu = db.prepare('SELECT id, menu_key, title FROM navigation_menus WHERE menu_key = ?').get(menuKey);
    if (!menu) {
        return res.status(404).json({ success: false, message: 'Menu not found' });
    }

    const items = db.prepare(`
        SELECT id, parent_id, title, url, route_type, target, sort_order, icon_class, badge_text
        FROM navigation_items
        WHERE menu_id = ? AND is_visible = 1
        ORDER BY sort_order ASC, id ASC
    `).all(menu.id);

    const tree = buildMenuTree(items, null);

    const responseData = {
        success: true,
        menu_key: menu.menu_key,
        menu_title: menu.title,
        tree
    };

    cache.set(cacheKey, responseData);
    res.json(responseData);
});

// ============================================================================
// ADMIN ROUTES (Protected)
// ============================================================================

// GET /api/v1/admin/navigation
router.get('/admin/navigation', authenticate, requireAdmin, (req, res) => {
    const menuKey = req.query.menu_key || 'main_header';
    let menu = db.prepare('SELECT * FROM navigation_menus WHERE menu_key = ?').get(menuKey);

    if (!menu) {
        // Fallback to first menu
        menu = db.prepare('SELECT * FROM navigation_menus LIMIT 1').get();
    }

    if (!menu) {
        return res.json({ success: true, menus: [], items: [], tree: [] });
    }

    const menus = db.prepare('SELECT * FROM navigation_menus ORDER BY id ASC').all();
    const items = db.prepare(`
        SELECT * FROM navigation_items
        WHERE menu_id = ?
        ORDER BY sort_order ASC, id ASC
    `).all(menu.id);

    const tree = buildMenuTree(items, null);

    res.json({
        success: true,
        current_menu: menu,
        menus,
        items,
        tree
    });
});

// POST /api/v1/admin/navigation/items
router.post('/admin/navigation/items', authenticate, requireAdmin, (req, res) => {
    const { menu_id, parent_id, title, url, route_type, target, sort_order, is_visible, icon_class, badge_text } = req.body;

    if (!title || !url) {
        return res.status(400).json({ success: false, message: 'Title and URL are required.' });
    }

    const targetMenuId = menu_id || db.prepare('SELECT id FROM navigation_menus WHERE menu_key = "main_header"').get().id;

    // Determine default sort order if not provided
    let order = parseInt(sort_order, 10);
    if (isNaN(order)) {
        const last = db.prepare('SELECT MAX(sort_order) as max_order FROM navigation_items WHERE menu_id = ? AND (parent_id = ? OR (parent_id IS NULL AND ? IS NULL))')
            .get(targetMenuId, parent_id || null, parent_id || null);
        order = (last && last.max_order !== null) ? last.max_order + 1 : 1;
    }

    const result = db.prepare(`
        INSERT INTO navigation_items (menu_id, parent_id, title, url, route_type, target, sort_order, is_visible, icon_class, badge_text)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        targetMenuId,
        parent_id || null,
        title.trim(),
        url.trim(),
        route_type || 'internal',
        target || '_self',
        order,
        is_visible !== undefined ? (is_visible ? 1 : 0) : 1,
        icon_class || null,
        badge_text || null
    );

    cache.clear();

    res.status(201).json({
        success: true,
        message: 'Menu item created successfully',
        id: result.lastInsertRowid
    });
});

// PUT /api/v1/admin/navigation/items/:id
router.put('/admin/navigation/items/:id', authenticate, requireAdmin, (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const item = db.prepare('SELECT * FROM navigation_items WHERE id = ?').get(itemId);

    if (!item) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const { parent_id, title, url, route_type, target, sort_order, is_visible, icon_class, badge_text } = req.body;

    if (!title || !url) {
        return res.status(400).json({ success: false, message: 'Title and URL are required.' });
    }

    const newParentId = parent_id ? parseInt(parent_id, 10) : null;

    // Cycle Prevention Check
    if (newParentId) {
        if (newParentId === itemId) {
            return res.status(400).json({ success: false, message: 'An item cannot be its own parent.' });
        }
        if (isDescendant(itemId, newParentId)) {
            return res.status(400).json({ success: false, message: 'Cannot set parent to a child item (would cause circular hierarchy).' });
        }
    }

    db.prepare(`
        UPDATE navigation_items
        SET parent_id = ?, title = ?, url = ?, route_type = ?, target = ?, sort_order = ?, is_visible = ?, icon_class = ?, badge_text = ?
        WHERE id = ?
    `).run(
        newParentId,
        title.trim(),
        url.trim(),
        route_type || item.route_type,
        target || item.target,
        parseInt(sort_order !== undefined ? sort_order : item.sort_order, 10),
        is_visible !== undefined ? (is_visible ? 1 : 0) : item.is_visible,
        icon_class !== undefined ? icon_class : item.icon_class,
        badge_text !== undefined ? badge_text : item.badge_text,
        itemId
    );

    cache.clear();

    res.json({
        success: true,
        message: 'Menu item updated successfully'
    });
});

// POST /api/v1/admin/navigation/reorder
router.post('/admin/navigation/reorder', authenticate, requireAdmin, (req, res) => {
    const { items } = req.body; // array of { id, parent_id, sort_order }

    if (!Array.isArray(items)) {
        return res.status(400).json({ success: false, message: 'Invalid payload. Array of items expected.' });
    }

    const updateStmt = db.prepare('UPDATE navigation_items SET parent_id = ?, sort_order = ? WHERE id = ?');

    for (const item of items) {
        updateStmt.run(item.parent_id || null, parseInt(item.sort_order, 10), item.id);
    }

    cache.clear();

    res.json({
        success: true,
        message: 'Navigation hierarchy and ordering updated successfully'
    });
});

// DELETE /api/v1/admin/navigation/items/:id
router.delete('/admin/navigation/items/:id', authenticate, requireAdmin, (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const item = db.prepare('SELECT id FROM navigation_items WHERE id = ?').get(itemId);

    if (!item) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    // Delete item (foreign key CASCADE removes child items automatically)
    db.prepare('DELETE FROM navigation_items WHERE id = ?').run(itemId);

    cache.clear();

    res.json({
        success: true,
        message: 'Menu item and any sub-items deleted successfully'
    });
});

module.exports = router;
