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
    const { search, page, limit, type } = req.query;
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '50', 10);
    const offset = (pageNum - 1) * limitNum;

    let query = 'SELECT * FROM media_library';
    let countQuery = 'SELECT COUNT(*) as total FROM media_library';
    const conditions = [];
    const params = [];

    if (type === 'documents') {
        conditions.push("mime_type LIKE '%pdf%'");
    } else if (type === 'images') {
        conditions.push("mime_type NOT LIKE '%pdf%'");
    }

    if (search) {
        conditions.push('(original_name LIKE ? OR alt_text LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
        const whereClause = ' WHERE ' + conditions.join(' AND ');
        query += whereClause;
        countQuery += whereClause;
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    const countParams = [...params];
    params.push(limitNum, offset);

    const items = db.prepare(query).all(...params);
    const total = db.prepare(countQuery).get(...countParams)?.total || 0;

    res.json({
        success: true,
        items: items.map(item => ({
            ...item,
            public_url: `/uploads/media/${item.filename}`
        })),
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1
    });
});

// GET /api/v1/admin/documents
// Dedicated institutional document manager endpoint (statutory certificates, circulars, PDFs)
router.get('/admin/documents', authenticate, requireAdmin, (req, res) => {
    const { search, category } = req.query;

    // Standard institutional statutory and compliance documents
    const statutoryDocuments = [
        {
            id: 'stat-1',
            title: 'AICTE Approval Extension Order 2024-25',
            category: 'Statutory Approvals',
            file_type: 'PDF Document',
            issuer: 'All India Council for Technical Education (AICTE)',
            academic_year: '2024-25',
            file_url: 'https://rishimsengg.ac.in/about/AICTE_Approval.php',
            is_statutory: true,
            status: 'Verified & Active'
        },
        {
            id: 'stat-2',
            title: 'UGC Autonomous Conferment Certificate',
            category: 'Accreditations',
            file_type: 'PDF Document',
            issuer: 'University Grants Commission (UGC)',
            academic_year: 'Valid up to 2032',
            file_url: 'https://rishimsengg.ac.in/about/Autonomous_Certificate.php',
            is_statutory: true,
            status: 'Verified & Active'
        },
        {
            id: 'stat-3',
            title: "NAAC 'A' Grade Accreditation Certificate",
            category: 'Accreditations',
            file_type: 'PDF Document',
            issuer: 'National Assessment and Accreditation Council',
            academic_year: 'Cycle 1 Validated',
            file_url: 'https://rishimsengg.ac.in/about/NAAC_Certificate.php',
            is_statutory: true,
            status: 'Verified & Active'
        },
        {
            id: 'stat-4',
            title: 'JNTUH Permanent Affiliation Order',
            category: 'Statutory Approvals',
            file_type: 'PDF Document',
            issuer: 'Jawaharlal Nehru Technological University Hyderabad',
            academic_year: '2024-25',
            file_url: 'https://rishimsengg.ac.in/about/About_Rishi_College_Group_of_Institutions_php.html',
            is_statutory: true,
            status: 'Verified & Active'
        },
        {
            id: 'stat-5',
            title: 'Institutional Audit Statements (FY 2023-24 & 2024-25)',
            category: 'Financial Disclosures',
            file_type: 'PDF Document',
            issuer: 'Statutory Chartered Accountants',
            academic_year: '2023-24 / 2024-25',
            file_url: 'https://rishimsengg.ac.in/about/Audit_Statements.php',
            is_statutory: true,
            status: 'Public Disclosure'
        },
        {
            id: 'stat-6',
            title: 'Institutional Development Plan (IDP 2024-2029)',
            category: 'Institutional Governance',
            file_type: 'PDF Document',
            issuer: 'RITW Governing Body',
            academic_year: '2024-2029',
            file_url: 'https://rishimsengg.ac.in/about/Institution_Development_Plan.php',
            is_statutory: true,
            status: 'Adopted'
        },
        {
            id: 'stat-7',
            title: 'Ombudsperson & Grievance Redressal Mechanism Notification',
            category: 'Statutory Governance',
            file_type: 'PDF Document',
            issuer: 'RITW Grievance Redressal Committee',
            academic_year: '2024-25',
            file_url: 'https://rishimsengg.ac.in/about/Ombudsperson.php',
            is_statutory: true,
            status: 'Active'
        }
    ];

    // Also fetch any uploaded PDFs from media_library
    let dbPdfs = [];
    try {
        const rows = db.prepare("SELECT * FROM media_library WHERE mime_type LIKE '%pdf%' ORDER BY id DESC").all();
        dbPdfs = rows.map(r => ({
            id: `media-${r.id}`,
            title: r.alt_text || r.original_name,
            category: 'Uploaded Documents',
            file_type: 'PDF Document',
            issuer: 'Admin CMS',
            academic_year: new Date(r.created_at).getFullYear().toString(),
            file_url: `/uploads/media/${r.filename}`,
            is_statutory: false,
            status: 'Published'
        }));
    } catch (e) {}

    let allDocs = [...statutoryDocuments, ...dbPdfs];

    if (category) {
        allDocs = allDocs.filter(d => d.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (search) {
        const s = search.toLowerCase();
        allDocs = allDocs.filter(d => d.title.toLowerCase().includes(s) || d.issuer.toLowerCase().includes(s));
    }

    res.json({
        success: true,
        total: allDocs.length,
        documents: allDocs
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
