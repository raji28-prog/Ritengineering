/**
 * RITW Dynamic Engineering College Portal & CMS Backend
 * Combines high-fidelity public site serving, REST APIs, and Secure Admin CMS
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./server/config');
const seedDatabase = require('./server/db/seed');
const seedPortalDatabase = require('./server/db/portal_seed');

// Initialize database and run migrations/seeds
seedDatabase();
seedPortalDatabase();

const app = express();

// Security & Parsing Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (non-intrusive)
app.use((req, res, next) => {
    if (req.url.startsWith('/api/')) {
        console.log(`[API ${req.method}] ${req.url} - ${req.ip}`);
    }
    next();
});

// ============================================================================
// API ROUTES
// ============================================================================
const authRouter = require('./server/routes/auth');
const pagesRouter = require('./server/routes/pages');
const navigationRouter = require('./server/routes/navigation');
const sectionsRouter = require('./server/routes/sections');
const customFieldsRouter = require('./server/routes/customFields');
const mediaRouter = require('./server/routes/media');
const announcementsRouter = require('./server/routes/announcements');
const settingsRouter = require('./server/routes/settings');
const enquiryRouter = require('./server/routes/enquiry');

// Mount Admin Auth & CMS APIs
app.use('/api/v1/admin/auth', authRouter);
app.use('/api/v1', pagesRouter);
app.use('/api/v1', navigationRouter);
app.use('/api/v1', sectionsRouter);
app.use('/api/v1', customFieldsRouter);
app.use('/api/v1', mediaRouter);
app.use('/api/v1', announcementsRouter);
app.use('/api/v1', settingsRouter);
app.use('/api/v1', enquiryRouter);

// Campus Portal Role-Based Routes
const portalAuthRouter = require('./server/routes/portalAuth');
const portalStudentRouter = require('./server/routes/portalStudent');
const portalParentRouter = require('./server/routes/portalParent');
const portalStaffRouter = require('./server/routes/portalStaff');
const portalCommonRouter = require('./server/routes/portalCommon');

app.use('/api/v1/portal/auth', portalAuthRouter);
app.use('/api/v1/portal/student', portalStudentRouter);
app.use('/api/v1/portal/parent', portalParentRouter);
app.use('/api/v1/portal/staff', portalStaffRouter);
app.use('/api/v1/portal/common', portalCommonRouter);

// System health check
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'UP',
        institution: 'RITW Engineering College',
        timestamp: new Date().toISOString(),
        version: '2.0.0-cms'
    });
});

// ============================================================================
// STATIC ASSETS & ADMIN CMS SERVING
// ============================================================================

// Options to allow serving files within paths containing hidden directory segments (e.g. .gemini worktrees)
const sendFileOpts = { dotfiles: 'allow' };

// Static file directories
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/css', express.static(path.join(__dirname, 'css'), sendFileOpts));
app.use('/js', express.static(path.join(__dirname, 'js'), sendFileOpts));
app.use('/images', express.static(path.join(__dirname, 'images'), sendFileOpts));
app.use('/img', express.static(path.join(__dirname, 'img'), sendFileOpts));
app.use('/PhotoGallery', express.static(path.join(__dirname, 'PhotoGallery')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/webfonts', express.static(path.join(__dirname, 'webfonts')));

// Admin Panel Static Serving
app.use('/admin', express.static(path.join(__dirname, 'admin'), sendFileOpts));

// Admin SPA Route Fallback (for /admin, /admin/login, /admin/dashboard, etc.)
app.get(['/admin', '/admin/*path'], (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'), sendFileOpts);
});

// Campus Portal Static Serving
app.use('/portal', express.static(path.join(__dirname, 'portal'), sendFileOpts));

// Campus Portal SPA Route Fallback (for /portal, /portal/login, /portal/student, /portal/parent, /portal/staff)
app.get(['/portal', '/portal/*path'], (req, res) => {
    res.sendFile(path.join(__dirname, 'portal', 'index.html'), sendFileOpts);
});

// Public Site Static Page Serving with clean URLs
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'), sendFileOpts);
});

app.get(['/about', '/about/*path'], (req, res) => {
    res.sendFile(path.join(__dirname, 'about', 'index.html'), sendFileOpts);
});

app.get(['/departments', '/departments/*path'], (req, res) => {
    res.sendFile(path.join(__dirname, 'departments', 'index.html'), sendFileOpts);
});

app.get(['/admissions', '/admissions/*path'], (req, res) => {
    res.sendFile(path.join(__dirname, 'admissions', 'index.html'), sendFileOpts);
});

app.get(['/placements', '/placements/*path'], (req, res) => {
    res.sendFile(path.join(__dirname, 'placements', 'index.html'), sendFileOpts);
});

app.get(['/contact', '/contact/*path'], (req, res) => {
    res.sendFile(path.join(__dirname, 'contact', 'index.html'), sendFileOpts);
});

app.get(['/announcements', '/announcements/*path'], (req, res) => {
    res.sendFile(path.join(__dirname, 'announcements', 'index.html'), sendFileOpts);
});


// Static fallback for other root files
app.use(express.static(__dirname, sendFileOpts));

// 404 Handler for APIs
app.all('/api/*path', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.originalUrl}`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[UNHANDLED SERVER ERROR]', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error. Please check server logs.'
    });
});

// Start Server
const server = app.listen(config.PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  RITW Dynamic College Portal & CMS Server Running!`);
    console.log(`  Public Site:   http://localhost:${config.PORT}`);
    console.log(`  Admin CMS:     http://localhost:${config.PORT}/admin/`);
    console.log(`  API Health:    http://localhost:${config.PORT}/api/v1/health`);
    console.log(`======================================================\n`);
});

module.exports = { app, server };
