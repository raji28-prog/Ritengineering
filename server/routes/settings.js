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

// Admin: GET /api/v1/admin/dashboard/summary
// Comprehensive dashboard metrics, system health, and database telemetry
router.get('/admin/dashboard/summary', authenticate, requireAdmin, (req, res) => {
    try {
        const pagesCount = db.prepare('SELECT COUNT(*) as count FROM pages').get()?.count || 0;
        const navCount = db.prepare('SELECT COUNT(*) as count FROM navigation_items').get()?.count || 0;
        const announcementsCount = db.prepare("SELECT COUNT(*) as count FROM announcements_news WHERE status = 'published'").get()?.count || 0;
        const enquiriesCount = db.prepare('SELECT COUNT(*) as count FROM admission_enquiries').get()?.count || 0;
        const newEnquiriesCount = db.prepare("SELECT COUNT(*) as count FROM admission_enquiries WHERE status = 'new'").get()?.count || 0;
        const mediaCount = db.prepare("SELECT COUNT(*) as count FROM media_library WHERE mime_type NOT LIKE '%pdf%'").get()?.count || 0;
        const docsCount = db.prepare("SELECT COUNT(*) as count FROM media_library WHERE mime_type LIKE '%pdf%'").get()?.count || 0;

        const recentLogs = db.prepare(`
            SELECT al.*, u.username
            FROM audit_logs al
            LEFT JOIN users u ON u.id = al.user_id
            ORDER BY al.id DESC
            LIMIT 10
        `).all();

        const recentEnquiries = db.prepare(`
            SELECT id, full_name, email, phone, course_interested, status, created_at
            FROM admission_enquiries
            ORDER BY id DESC
            LIMIT 5
        `).all();

        const recentAnnouncements = db.prepare(`
            SELECT id, title, badge_text, badge_color, is_flash, status, created_at
            FROM announcements_news
            ORDER BY id DESC
            LIMIT 5
        `).all();

        res.json({
            success: true,
            stats: {
                pages: pagesCount,
                navigation_items: navCount,
                announcements: announcementsCount,
                enquiries: enquiriesCount,
                new_enquiries: newEnquiriesCount,
                media_assets: mediaCount,
                documents: docsCount,
                departments: 6
            },
            system_info: {
                status: 'HEALTHY',
                node_version: process.version,
                database_engine: 'Native SQLite 3 (WAL Concurrency)',
                database_file: 'ritw_cms.sqlite',
                uptime_seconds: Math.floor(process.uptime()),
                timestamp: new Date().toISOString(),
                institution: {
                    name: 'Rishi M.S Institute of Engineering & Technology for Women',
                    short_name: 'RITW',
                    eamcet_code: 'RITW',
                    affiliation: 'Affiliated to JNTUH, Approved by AICTE, UGC Autonomous',
                    accreditation: "NAAC 'A' Grade, NBA Accredited, NIRF Recognized"
                }
            },
            recent_logs: recentLogs,
            recent_enquiries: recentEnquiries,
            recent_announcements: recentAnnouncements
        });
    } catch (err) {
        console.error('[DASHBOARD SUMMARY ERROR]', err);
        res.status(500).json({ success: false, message: 'Failed to retrieve dashboard summary' });
    }
});

// Admin: GET /api/v1/admin/departments
// Comprehensive department records, intake capacity, and laboratory resources
router.get('/admin/departments', authenticate, requireAdmin, (req, res) => {
    const departments = [
        {
            id: 1,
            code: 'CSE',
            name: 'Computer Science & Engineering',
            degree: 'B.Tech (4 Years)',
            intake: 180,
            est_year: 2009,
            hod: 'Dr. Radhika Sharma, Ph.D.',
            email: 'hod.cse@rishimsengg.ac.in',
            labs: ['Advanced Computing Lab', 'Cloud & Virtualization Lab', 'Open Source Software Lab'],
            status: 'Active',
            accreditation: 'NBA Accredited'
        },
        {
            id: 2,
            code: 'CSM',
            name: 'CSE (Artificial Intelligence & Machine Learning)',
            degree: 'B.Tech (4 Years)',
            intake: 180,
            est_year: 2020,
            hod: 'Dr. V. Anitha, Ph.D.',
            email: 'hod.csm@rishimsengg.ac.in',
            labs: ['AI & Deep Learning Studio', 'Robotics & Computer Vision Lab', 'High Performance GPU Lab'],
            status: 'Active',
            accreditation: 'AICTE Approved'
        },
        {
            id: 3,
            code: 'CSD',
            name: 'CSE (Data Science)',
            degree: 'B.Tech (4 Years)',
            intake: 60,
            est_year: 2021,
            hod: 'Dr. K. Srinivas, Ph.D.',
            email: 'hod.csd@rishimsengg.ac.in',
            labs: ['Big Data Analytics Lab', 'Data Visualization Studio', 'Predictive Modeling Center'],
            status: 'Active',
            accreditation: 'AICTE Approved'
        },
        {
            id: 4,
            code: 'IT',
            name: 'Information Technology',
            degree: 'B.Tech (4 Years)',
            intake: 60,
            est_year: 2009,
            hod: 'Prof. M. Sangeetha, M.Tech',
            email: 'hod.it@rishimsengg.ac.in',
            labs: ['Web Technologies Lab', 'Network Security Lab', 'Mobile App Development Lab'],
            status: 'Active',
            accreditation: 'NBA Accredited'
        },
        {
            id: 5,
            code: 'ECE',
            name: 'Electronics & Communication Engineering',
            degree: 'B.Tech (4 Years)',
            intake: 60,
            est_year: 2009,
            hod: 'Dr. Suresh Kumar, Ph.D.',
            email: 'hod.ece@rishimsengg.ac.in',
            labs: ['VLSI & Embedded Systems Lab', 'DSP & IoT Center', 'Microwave & Communication Lab'],
            status: 'Active',
            accreditation: 'NBA Accredited'
        },
        {
            id: 6,
            code: 'H&S',
            name: 'Humanities & Sciences (Freshman Engineering)',
            degree: 'Foundational Curriculum',
            intake: 540,
            est_year: 2009,
            hod: 'Dr. Lakshmi Prasanna, Ph.D.',
            email: 'hod.hs@rishimsengg.ac.in',
            labs: ['English Language Communication Skills (ELCS) Lab', 'Engineering Physics Lab', 'Engineering Chemistry Lab'],
            status: 'Active',
            accreditation: 'Core Department'
        }
    ];

    res.json({
        success: true,
        total_departments: departments.length,
        total_intake: 540,
        departments
    });
});

// Admin: GET /api/v1/admin/admissions-placements
// Unified data for Admissions guidelines and Training & Placements metrics
router.get('/admin/admissions-placements', authenticate, requireAdmin, (req, res) => {
    res.json({
        success: true,
        admissions: {
            academic_year: '2026-27',
            counseling_code: 'RITW',
            institution_type: "Women's Engineering College (UGC Autonomous)",
            eligibility: 'Pass in 10+2 with Mathematics, Physics & Chemistry with qualified rank in TG EAPCET',
            total_intake: 540,
            quotas: [
                { quota: 'Category A (Convenor Quota)', percentage: '70%', criteria: 'Allotted through TG EAPCET Centralized Web Counseling' },
                { quota: 'Category B (Management / NRI Quota)', percentage: '30%', criteria: 'Merit in 10+2 (MPC) as per TGCHE statutory guidelines' },
                { quota: 'Lateral Entry (2nd Year B.Tech)', percentage: '10% supernumerary', criteria: 'Merit in TG ECET for Polytechnic Diploma holders' }
            ],
            seat_matrix: [
                { branch: 'Computer Science & Engineering (CSE)', code: 'CSE', seats: 180 },
                { branch: 'CSE - Artificial Intelligence & Machine Learning', code: 'CSM', seats: 180 },
                { branch: 'CSE - Data Science', code: 'CSD', seats: 60 },
                { branch: 'Information Technology', code: 'INF', seats: 60 },
                { branch: 'Electronics & Communication Engineering', code: 'ECE', seats: 60 }
            ]
        },
        placements: {
            placement_rate: '100% Assistance',
            highest_package: '18.5 LPA',
            average_package: '4.8 LPA',
            median_package: '4.2 LPA',
            partner_companies_count: '60+',
            top_recruiters: [
                { name: 'Accenture', type: 'MNC', role: 'Associate Software Engineer' },
                { name: 'Cognizant', type: 'MNC', role: 'Programmer Analyst Trainee' },
                { name: 'Capgemini', type: 'MNC', role: 'Software Analyst' },
                { name: 'Tata Consultancy Services (TCS)', type: 'MNC', role: 'Assistant System Engineer' },
                { name: 'Infosys', type: 'MNC', role: 'Systems Engineer' },
                { name: 'Wipro Technologies', type: 'MNC', role: 'Project Engineer' },
                { name: 'Virtusa', type: 'MNC', role: 'Associate Engineer' },
                { name: 'Tech Mahindra', type: 'MNC', role: 'Associate Software Developer' }
            ]
        }
    });
});

module.exports = router;
