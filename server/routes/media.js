/**
 * RITW CMS - Media Library Router
 * Validated file uploads (images & PDFs), directory safety, and file manager.
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directory exists
if (!fs.existsSync(config.UPLOAD_DIR)) {
    fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Sanitize filename and append unique timestamp
        const ext = path.extname(file.originalname).toLowerCase();
        const baseName = path.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '_');
        const uniqueName = `${baseName}_${Date.now()}${ext}`;
        cb(null, uniqueName);
    }
});

// File filter for strict whitelist
const fileFilter = (req, file, cb) => {
    if (config.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: Images (JPG, PNG, WebP, SVG, GIF) and PDF documents.`));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: config.MAX_FILE_SIZE },
    fileFilter
});

// GET /api/v1/admin/media
router.get('/admin/media', authenticate, requireAdmin, (req, res) => {
    const { search, page, limit } = req.query;
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '50', 10);
    const offset = (pageNum - 1) * limitNum;

    let query = 'SELECT * FROM media_library';
    let countQuery = 'SELECT COUNT(*) as total FROM media_library';
    const params = [];

    if (search) {
        query += ' WHERE original_name LIKE ? OR alt_text LIKE ?';
        countQuery += ' WHERE original_name LIKE ? OR alt_text LIKE ?';
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    const countParams = [...params];
    params.push(limitNum, offset);

    const items = db.prepare(query).all(...params);
    const total = db.prepare(countQuery).get(...countParams).total;

    res.json({
        success: true,
        items: items.map(item => ({
            ...item,
            public_url: `/uploads/media/${item.filename}`
        })),
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
    });
});

// POST /api/v1/admin/media/upload
router.post('/admin/media/upload', authenticate, requireAdmin, (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const altText = req.body.alt_text || req.file.originalname;
        const relativePath = `uploads/media/${req.file.filename}`;

        const result = db.prepare(`
            INSERT INTO media_library (filename, original_name, mime_type, file_size, file_path, alt_text)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            req.file.filename,
            req.file.originalname,
            req.file.mimetype,
            req.file.size,
            relativePath,
            altText
        );

        res.status(201).json({
            success: true,
            message: 'File uploaded successfully',
            media: {
                id: result.lastInsertRowid,
                filename: req.file.filename,
                original_name: req.file.originalname,
                url: `/${relativePath}`,
                size: req.file.size,
                mime_type: req.file.mimetype
            }
        });
    });
});

// DELETE /api/v1/admin/media/:id
router.delete('/admin/media/:id', authenticate, requireAdmin, (req, res) => {
    const mediaId = parseInt(req.params.id, 10);
    const media = db.prepare('SELECT * FROM media_library WHERE id = ?').get(mediaId);

    if (!media) {
        return res.status(404).json({ success: false, message: 'Media file not found' });
    }

    // Remove file from disk
    const fullPath = path.join(config.UPLOAD_DIR, media.filename);
    if (fs.existsSync(fullPath)) {
        try {
            fs.unlinkSync(fullPath);
        } catch (e) {
            console.error('Error deleting file:', e);
        }
    }

    db.prepare('DELETE FROM media_library WHERE id = ?').run(mediaId);

    res.json({
        success: true,
        message: 'Media file removed successfully'
    });
});

module.exports = router;
