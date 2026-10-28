/**
 * RITW CMS - Custom Fields Router
 * Supports dynamic user-defined fields (text, textarea, rich_text, image, url, date, number, boolean)
 */
const express = require('express');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const cache = require('../services/cache');

const router = express.Router();

const SUPPORTED_TYPES = ['text', 'textarea', 'rich_text', 'image', 'url', 'date', 'number', 'boolean'];

// Validate value matches expected field type
function validateFieldValue(fieldType, value) {
    if (value === null || value === undefined || value === '') return true;

    switch (fieldType) {
        case 'number':
            return !isNaN(Number(value));
        case 'boolean':
            return value === 'true' || value === 'false' || value === '1' || value === '0' || typeof value === 'boolean';
        case 'url':
            try {
                new URL(value);
                return true;
            } catch {
                return value.startsWith('/') || value.startsWith('#'); // Allow relative URLs
            }
        case 'date':
            return !isNaN(Date.parse(value));
        default:
            return true;
    }
}

// GET /api/v1/admin/custom-fields/definitions
router.get('/admin/custom-fields/definitions', authenticate, requireAdmin, (req, res) => {
    const { entity_type } = req.query;
    let query = 'SELECT * FROM custom_field_definitions';
    const params = [];

    if (entity_type) {
        query += ' WHERE entity_type = ?';
        params.push(entity_type);
    }
    query += ' ORDER BY sort_order ASC, id ASC';

    const definitions = db.prepare(query).all(...params);

    res.json({
        success: true,
        supported_types: SUPPORTED_TYPES,
        definitions: definitions.map(d => ({
            ...d,
            validation_rules: d.validation_rules ? JSON.parse(d.validation_rules) : {}
        }))
    });
});

// POST /api/v1/admin/custom-fields/definitions
router.post('/admin/custom-fields/definitions', authenticate, requireAdmin, (req, res) => {
    const { entity_type, field_name, field_key, field_type, validation_rules, sort_order } = req.body;

    if (!entity_type || !field_name || !field_key || !field_type) {
        return res.status(400).json({ success: false, message: 'Entity type, field name, field key, and field type are required.' });
    }

    if (!SUPPORTED_TYPES.includes(field_type)) {
        return res.status(400).json({ success: false, message: `Unsupported field type: ${field_type}. Allowed: ${SUPPORTED_TYPES.join(', ')}` });
    }

    const key = field_key.toLowerCase().trim().replace(/[^\w]/g, '_');

    const existing = db.prepare('SELECT id FROM custom_field_definitions WHERE field_key = ?').get(key);
    if (existing) {
        return res.status(400).json({ success: false, message: `Field key "${key}" is already in use.` });
    }

    const rulesStr = typeof validation_rules === 'object' ? JSON.stringify(validation_rules) : (validation_rules || null);

    const result = db.prepare(`
        INSERT INTO custom_field_definitions (entity_type, field_name, field_key, field_type, validation_rules, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
        entity_type,
        field_name.trim(),
        key,
        field_type,
        rulesStr,
        parseInt(sort_order || '0', 10)
    );

    res.status(201).json({
        success: true,
        message: 'Custom field definition created successfully',
        id: result.lastInsertRowid
    });
});

// DELETE /api/v1/admin/custom-fields/definitions/:id
router.delete('/admin/custom-fields/definitions/:id', authenticate, requireAdmin, (req, res) => {
    const defId = parseInt(req.params.id, 10);
    const def = db.prepare('SELECT id FROM custom_field_definitions WHERE id = ?').get(defId);

    if (!def) {
        return res.status(404).json({ success: false, message: 'Field definition not found' });
    }

    db.prepare('DELETE FROM custom_field_values WHERE field_definition_id = ?').run(defId);
    db.prepare('DELETE FROM custom_field_definitions WHERE id = ?').run(defId);

    cache.clear();

    res.json({
        success: true,
        message: 'Custom field definition and associated values removed.'
    });
});

// POST /api/v1/admin/custom-fields/values
router.post('/admin/custom-fields/values', authenticate, requireAdmin, (req, res) => {
    const { entity_type, entity_id, values } = req.body; // values: { field_definition_id or field_key: value }

    if (!entity_type || !entity_id || !values) {
        return res.status(400).json({ success: false, message: 'entity_type, entity_id, and values object are required.' });
    }

    const insertOrUpdate = db.prepare(`
        INSERT INTO custom_field_values (entity_type, entity_id, field_definition_id, field_value, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(entity_type, entity_id, field_definition_id)
        DO UPDATE SET field_value = excluded.field_value, updated_at = CURRENT_TIMESTAMP
    `);

    for (const [keyOrId, rawValue] of Object.entries(values)) {
        let def;
        if (!isNaN(Number(keyOrId))) {
            def = db.prepare('SELECT * FROM custom_field_definitions WHERE id = ?').get(Number(keyOrId));
        } else {
            def = db.prepare('SELECT * FROM custom_field_definitions WHERE field_key = ?').get(keyOrId);
        }

        if (def) {
            const valStr = typeof rawValue === 'boolean' ? (rawValue ? '1' : '0') : String(rawValue || '');
            if (!validateFieldValue(def.field_type, valStr)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid value for field "${def.field_name}". Expected ${def.field_type}.`
                });
            }
            insertOrUpdate.run(entity_type, parseInt(entity_id, 10), def.id, valStr);
        }
    }

    cache.clear();

    res.json({
        success: true,
        message: 'Custom field values saved successfully'
    });
});

module.exports = router;
