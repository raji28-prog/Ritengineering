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
app.use('/PDFs', express.static(path.join(__dirname, 'PDFs'), sendFileOpts));
app.use('/Statements', express.static(path.join(__dirname, 'Statements'), sendFileOpts));

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

// ----------------------------------------------------------------------------
// REDESIGNED CONTENT PAGES & SUBMENU ROUTES
// ----------------------------------------------------------------------------

// 1. DEPARTMENTS - Specific department pages
app.get(['/departments/cse', '/departments/cse/', '/departments/cse.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'departments', 'cse.html'), sendFileOpts);
});
app.get(['/departments/it', '/departments/it/', '/departments/it.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'departments', 'it.html'), sendFileOpts);
});
app.get(['/departments/ece', '/departments/ece/', '/departments/ece.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'departments', 'ece.html'), sendFileOpts);
});
app.get(['/departments/hns', '/departments/hns/', '/departments/hns.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'departments', 'hns.html'), sendFileOpts);
});

// Legacy Departments PHP redirects
app.get(['/Departments/Computer*path', '/departments/Computer*path'], (req, res) => {
    res.redirect(301, '/departments/cse');
});
app.get(['/Departments/Information*path', '/departments/Information*path'], (req, res) => {
    res.redirect(301, '/departments/it');
});
app.get(['/Departments/Electronics*path', '/departments/Electronics*path'], (req, res) => {
    res.redirect(301, '/departments/ece');
});
app.get(['/Departments/Humanities*path', '/departments/Humanities*path'], (req, res) => {
    res.redirect(301, '/departments/hns');
});

// Main Departments portal
app.get(['/departments', '/departments/', '/departments/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'departments', 'index.html'), sendFileOpts);
});

// 2. ADMISSIONS - Direct submenu routes & legacy redirects
app.get('/admissions/process', (req, res) => res.redirect(302, '/admissions#process'));
app.get('/admissions/intake', (req, res) => res.redirect(302, '/admissions#intake'));
app.get(['/admissions/form', '/admissions/admission-form'], (req, res) => res.redirect(302, '/admissions#admission-form'));
app.get(['/admissions/fee-structure', '/admissions/fees'], (req, res) => res.redirect(302, '/admissions#fee-structure'));
app.get('/admissions/scholarships', (req, res) => res.redirect(302, '/admissions#scholarships'));
app.get('/admissions/enquiry', (req, res) => res.redirect(302, '/admissions#enquiry'));
app.get('/admissions/guidelines', (req, res) => res.redirect(302, '/admissions#guidelines'));
app.get('/admissions/certificates', (req, res) => res.redirect(302, '/admissions#certificates'));
app.get('/admissions/eapcet', (req, res) => res.redirect(302, '/admissions#eapcet'));
app.get('/admissions/management', (req, res) => res.redirect(302, '/admissions#management'));

// Legacy Admissions PHP redirects
app.get(['/admissions/:file.php', '/Admissions/:file.php', '/admissions-2026-27'], (req, res) => {
    const p = req.path.toLowerCase();
    if (p.includes('process') || p.includes('guidelines')) return res.redirect(301, '/admissions#process');
    if (p.includes('intake') || p.includes('courses')) return res.redirect(301, '/admissions#intake');
    if (p.includes('form')) return res.redirect(301, '/admissions#admission-form');
    if (p.includes('fee')) return res.redirect(301, '/admissions#fee-structure');
    if (p.includes('scholarship')) return res.redirect(301, '/admissions#scholarships');
    res.redirect(301, '/admissions');
});

app.get(['/admissions', '/admissions/', '/admissions/index.html', '/Admissions', '/Admissions/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'admissions', 'index.html'), sendFileOpts);
});

// 3. ACADEMICS - Direct submenu routes & legacy redirects
app.get('/academics/curriculum', (req, res) => res.redirect(302, '/academics#curriculum'));
app.get(['/academics/calendar', '/academics/university-calendar'], (req, res) => res.redirect(302, '/academics#university-calendar'));
app.get('/academics/institution-calendar', (req, res) => res.redirect(302, '/academics#institution-calendar'));
app.get(['/academics/results', '/academics/exam-results'], (req, res) => res.redirect(302, '/academics#results'));
app.get(['/academics/exam-branch', '/academics/coe'], (req, res) => res.redirect(302, '/academics#exam-branch'));
app.get('/academics/timetables', (req, res) => res.redirect(302, '/academics#timetables'));
app.get('/academics/copo', (req, res) => res.redirect(302, '/academics#copo'));
app.get('/academics/grading', (req, res) => res.redirect(302, '/academics#grading'));
app.get('/academics/pedagogy', (req, res) => res.redirect(302, '/academics#pedagogy'));
app.get('/academics/syllabi', (req, res) => res.redirect(302, '/academics#syllabi'));
app.get('/academics/committees', (req, res) => res.redirect(302, '/academics#committees'));
app.get('/academics/downloads', (req, res) => res.redirect(302, '/academics#downloads'));
app.get('/academics/malpractice', (req, res) => res.redirect(302, '/academics#malpractice'));

// Legacy Academics PHP redirects
app.get(['/Academics/:file.php', '/academics/:file.php'], (req, res) => {
    const p = req.path.toLowerCase();
    if (p.includes('calender') || p.includes('calendar')) return res.redirect(301, '/academics#university-calendar');
    if (p.includes('syllabus') || p.includes('curriculum')) return res.redirect(301, '/academics#curriculum');
    if (p.includes('exam') || p.includes('timetable') || p.includes('branch')) return res.redirect(301, '/academics#exam-branch');
    if (p.includes('result')) return res.redirect(301, '/academics#results');
    res.redirect(301, '/academics');
});

app.get(['/academics', '/academics/', '/academics/index.html', '/Academics', '/Academics/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'academics', 'index.html'), sendFileOpts);
});

// 4. PLACEMENTS - Direct submenu routes & legacy redirects
app.get(['/placements/cell', '/placements/about-cell'], (req, res) => res.redirect(302, '/placements#about-cell'));
app.get(['/placements/officer', '/placements/team'], (req, res) => res.redirect(302, '/placements#officer'));
app.get('/placements/infra', (req, res) => res.redirect(302, '/placements#infra'));
app.get('/placements/highlights', (req, res) => res.redirect(302, '/placements#highlights'));
app.get('/placements/training', (req, res) => res.redirect(302, '/placements#training'));
app.get('/placements/coe', (req, res) => res.redirect(302, '/placements#coe'));
app.get('/placements/companies', (req, res) => res.redirect(302, '/placements#companies'));
app.get('/placements/records', (req, res) => res.redirect(302, '/placements#records'));

// Legacy Placements PHP redirects
app.get(['/placements/:file.php', '/Placements/:file.php', '/placements/MOU*path'], (req, res) => {
    const p = req.path.toLowerCase();
    if (p.includes('officer') || p.includes('team')) return res.redirect(301, '/placements#officer');
    if (p.includes('infra')) return res.redirect(301, '/placements#infra');
    if (p.includes('training') || p.includes('internship') || p.includes('visit')) return res.redirect(301, '/placements#training');
    if (p.includes('companies')) return res.redirect(301, '/placements#companies');
    if (p.includes('highlights') || p.includes('records') || p.includes('drive')) return res.redirect(301, '/placements#records');
    if (p.includes('mou')) return res.redirect(301, '/placements#highlights');
    res.redirect(301, '/placements');
});

app.get(['/placements', '/placements/', '/placements/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'placements', 'index.html'), sendFileOpts);
});

// 5. ABOUT - Direct submenu routes & legacy redirects
app.get('/about/overview', (req, res) => res.redirect(302, '/about#ritw-college'));
app.get('/about/memorial', (req, res) => res.redirect(302, '/about#memorial'));
app.get('/about/logo-theme', (req, res) => res.redirect(302, '/about#logo-theme'));
app.get('/about/rishi-group', (req, res) => res.redirect(302, '/about#rishi-group'));
app.get('/about/vision-mission', (req, res) => res.redirect(302, '/about#vision-mission'));
app.get('/about/objectives', (req, res) => res.redirect(302, '/about#objectives'));
app.get('/about/aspirations', (req, res) => res.redirect(302, '/about#aspirations'));
app.get('/about/idp', (req, res) => res.redirect(302, '/about#idp'));
app.get('/about/leadership', (req, res) => res.redirect(302, '/about#leadership'));
app.get('/about/chairman', (req, res) => res.redirect(302, '/about#chairman'));
app.get('/about/secretary', (req, res) => res.redirect(302, '/about#secretary'));
app.get('/about/director', (req, res) => res.redirect(302, '/about#director'));
app.get('/about/principal', (req, res) => res.redirect(302, '/about#principal'));
app.get('/about/governing-council', (req, res) => res.redirect(302, '/governance#governing-body'));
app.get('/about/workflow', (req, res) => res.redirect(302, '/governance#organogram'));
app.get('/about/academic-board', (req, res) => res.redirect(302, '/governance#academic-council'));
app.get('/about/naac', (req, res) => res.redirect(302, '/about#naac'));
app.get('/about/nba', (req, res) => res.redirect(302, '/about#nba'));
app.get('/about/ugc', (req, res) => res.redirect(302, '/about#ugc'));
app.get('/about/aicte', (req, res) => res.redirect(302, '/about#aicte'));
app.get('/about/audit', (req, res) => res.redirect(302, '/governance#audit'));
app.get('/about/ombudsperson', (req, res) => res.redirect(302, '/governance#ombudsperson'));
app.get('/about/idp', (req, res) => res.redirect(302, '/governance#idp'));
app.get(['/about/code-of-conduct', '/Public_Documents/Code_of_Conduct.php'], (req, res) => res.redirect(302, '/about#code-of-conduct'));
app.get('/about/handbook', (req, res) => res.redirect(302, '/about#handbook'));

// Legacy About PHP redirects
app.get(['/about/:file.php', '/About/:file.php', '/About_Our_College_RITW.php'], (req, res) => {
    const p = req.path.toLowerCase();
    if (p.includes('chairman')) return res.redirect(301, '/about#chairman');
    if (p.includes('secretary')) return res.redirect(301, '/about#secretary');
    if (p.includes('director')) return res.redirect(301, '/about#director');
    if (p.includes('principal')) return res.redirect(301, '/about#principal');
    if (p.includes('governing')) return res.redirect(301, '/about#governing-council');
    if (p.includes('workflow')) return res.redirect(301, '/about#workflow');
    if (p.includes('vision') || p.includes('mission')) return res.redirect(301, '/about#vision-mission');
    if (p.includes('naac')) return res.redirect(301, '/about#naac');
    if (p.includes('autonomous')) return res.redirect(301, '/about#ugc');
    if (p.includes('aicte')) return res.redirect(301, '/about#aicte');
    if (p.includes('audit')) return res.redirect(301, '/about#audit');
    if (p.includes('ombudsperson')) return res.redirect(301, '/about#ombudsperson');
    res.redirect(301, '/about');
});

app.get(['/about', '/about/', '/about/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'about', 'index.html'), sendFileOpts);
});

// Legacy Committees & External redirects
app.use(['/committees', '/Committees'], (req, res) => {
    const p = (req.url || '').toLowerCase();
    if (p.includes('governing')) return res.redirect(301, '/governance#governing-body');
    if (p.includes('academic') || p.includes('college')) return res.redirect(301, '/governance#academic-council');
    if (p.includes('student') || p.includes('placement')) return res.redirect(301, '/placements#about-cell');
    if (p.includes('alumni')) return res.redirect(301, '/campus-life#alumni');
    if (p.includes('sports')) return res.redirect(301, '/campus-life#sports');
    if (p.includes('nss')) return res.redirect(301, '/campus-life#nss');
    if (p.includes('admission')) return res.redirect(301, '/admissions#enquiry');
    res.redirect(301, '/governance#committees');
});
app.get(['/Research*path', '/research*path'], (req, res) => res.redirect(301, '/academics#curriculum'));
app.get(['/NSS*path', '/nss*path'], (req, res) => res.redirect(301, '/about#why-choose'));

app.get(['/accreditation', '/accreditation/*path'], (req, res) => {
    res.sendFile(path.join(__dirname, 'accreditation', 'index.html'), sendFileOpts);
});

app.get(['/announcements', '/announcements/*path'], (req, res) => {
    res.sendFile(path.join(__dirname, 'announcements', 'index.html'), sendFileOpts);
});

app.get(['/contact', '/contact/*path'], (req, res) => {
    res.sendFile(path.join(__dirname, 'contact', 'index.html'), sendFileOpts);
});

// 6. CAMPUS LIFE & FACILITIES - Redesigned Section & Legacy Redirects
app.get(['/campus-life', '/campus-life/', '/campus-life/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'campus-life', 'index.html'), sendFileOpts);
});
app.get(['/facilities', '/facilities/', '/facilities/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'campus-life', 'index.html'), sendFileOpts);
});

// Legacy Facilities PHP redirects
app.get(['/facilities/:file.php', '/Facilities/:file.php'], (req, res) => {
    const p = req.path.toLowerCase();
    if (p.includes('infrastructure')) return res.redirect(301, '/campus-life#infrastructure');
    if (p.includes('central_library')) return res.redirect(301, '/campus-life#central-library');
    if (p.includes('conventional_library')) return res.redirect(301, '/campus-life#conventional-library');
    if (p.includes('digital_library')) return res.redirect(301, '/campus-life#digital-library');
    if (p.includes('e-class_rooms') || p.includes('class')) return res.redirect(301, '/campus-life#e-class-rooms');
    if (p.includes('aiml')) return res.redirect(301, '/campus-life#aiml-labs');
    if (p.includes('seminar') || p.includes('auditorium')) return res.redirect(301, '/campus-life#seminar-halls');
    if (p.includes('ieee')) return res.redirect(301, '/campus-life#ieee-kiosk');
    if (p.includes('nptel')) return res.redirect(301, '/campus-life#nptel-kiosk');
    if (p.includes('mhrd') || p.includes('task')) return res.redirect(301, '/campus-life#mhrd-kiosk');
    if (p.includes('discussion')) return res.redirect(301, '/campus-life#discussion-chambers');
    if (p.includes('remedial')) return res.redirect(301, '/campus-life#remedial-kiosk');
    if (p.includes('slow_learner')) return res.redirect(301, '/campus-life#slow-learners-kiosk');
    if (p.includes('transportation')) return res.redirect(301, '/campus-life#transport');
    if (p.includes('sports') || p.includes('gym')) return res.redirect(301, '/campus-life#sports');
    if (p.includes('ro_plant') || p.includes('pure')) return res.redirect(301, '/campus-life#ro-plant');
    if (p.includes('cafeteria') || p.includes('canteen')) return res.redirect(301, '/campus-life#cafeteria');
    if (p.includes('medical')) return res.redirect(301, '/campus-life#medical-safety');
    if (p.includes('power_backup')) return res.redirect(301, '/campus-life#power-backup');
    if (p.includes('water_harvesting')) return res.redirect(301, '/campus-life#water-harvesting');
    if (p.includes('social_welfare')) return res.redirect(301, '/campus-life#social-welfare');
    if (p.includes('vibrant') || p.includes('club')) return res.redirect(301, '/campus-life#clubs');
    res.redirect(301, '/campus-life');
});

// Legacy NSS & Clubs redirects
app.get(['/NSS/:file.php', '/nss/:file.php', '/NSS*path', '/nss*path'], (req, res) => {
    const p = req.path.toLowerCase();
    if (p.includes('coordinator')) return res.redirect(301, '/campus-life#nss-coordinator');
    if (p.includes('event')) return res.redirect(301, '/campus-life#nss-events');
    if (p.includes('gallery')) return res.redirect(301, '/campus-life#gallery');
    if (p.includes('ncc')) return res.redirect(301, '/campus-life#ncc');
    res.redirect(301, '/campus-life#nss');
});
app.get(['/EDC.php', '/edc.php'], (req, res) => res.redirect(301, '/campus-life#edc'));
app.get(['/PCS.php', '/pcs.php'], (req, res) => res.redirect(301, '/campus-life#accessibility'));
app.get(['/Functional%20Units/PhysicalEducation*path', '/Functional Units/PhysicalEducation*path'], (req, res) => res.redirect(301, '/campus-life#sports'));
app.get(['/Functional%20Units/Alumni*path', '/Functional Units/Alumni*path'], (req, res) => res.redirect(301, '/campus-life#alumni'));
app.get(['/Functional%20Units/RTI*path', '/Functional Units/RTI*path'], (req, res) => res.redirect(301, '/campus-life#rti'));

// 7. GOVERNANCE - Redesigned Section & Legacy Redirects
app.get(['/governance', '/governance/', '/governance/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'governance', 'index.html'), sendFileOpts);
});

// 8. MEDIA & CONNECT - Redesigned Section & Legacy Redirects
app.get(['/media', '/media/', '/media/index.html', '/media-connect', '/media-connect/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'media', 'index.html'), sendFileOpts);
});
app.get(['/gallery', '/gallery/', '/PhotoGallery', '/PhotoGallery/*path', '/gallery.php', '/gallery.html'], (req, res) => {
    res.redirect(301, '/media#gallery');
});
app.get(['/careers', '/careers/', '/careers.php', '/careers.html'], (req, res) => {
    res.redirect(301, '/media#careers');
});
app.get(['/the-rishi-times', '/rishi-times', '/newsletter', '/magazine'], (req, res) => {
    res.redirect(301, '/media#rishi-times');
});
app.get(['/press', '/press-releases', '/news'], (req, res) => {
    res.redirect(301, '/media#press');
});

// Defensive catch for malformed /href= navigation
app.get(['/href=', '/href=*path'], (req, res) => {
    res.redirect('/');
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

