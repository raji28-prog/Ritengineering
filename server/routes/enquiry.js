/**
 * RITW CMS - Admission Enquiry Router
 * Replaces offline mock with live database collection and admin inbox.
 */
const express = require('express');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sanitizeBodyMiddleware } = require('../middleware/sanitize');

const router = express.Router();

// Public: POST /api/v1/public/enquiry
router.post('/public/enquiry', sanitizeBodyMiddleware, (req, res) => {
    const { full_name, email, phone, course_interested, message } = req.body;

    if (!full_name || !email || !phone) {
        return res.status(400).json({
            success: false,
            message: 'Full name, email, and mobile phone number are required.'
        });
    }

    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    const result = db.prepare(`
        INSERT INTO admission_enquiries (full_name, email, phone, course_interested, message, status, ip_address)
        VALUES (?, ?, ?, ?, ?, 'new', ?)
    `).run(
        full_name.trim(),
        email.trim(),
        phone.trim(),
        course_interested ? course_interested.trim() : null,
        message ? message.trim() : null,
        ip
    );

    res.status(201).json({
        success: true,
        message: 'Thank you! Your admission enquiry has been submitted. Our admissions coordinator will contact you shortly.',
        enquiry_id: result.lastInsertRowid
    });
});

// Admin: GET /api/v1/admin/enquiries
router.get('/admin/enquiries', authenticate, requireAdmin, (req, res) => {
    const enquiries = db.prepare('SELECT * FROM admission_enquiries ORDER BY id DESC LIMIT 100').all();
    res.json({ success: true, enquiries });
});

// Admin: PUT /api/v1/admin/enquiries/:id/status
router.put('/admin/enquiries/:id/status', authenticate, requireAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!['new', 'contacted', 'closed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    db.prepare('UPDATE admission_enquiries SET status = ? WHERE id = ?').run(status, id);

    res.json({ success: true, message: 'Enquiry status updated' });
});

module.exports = router;
