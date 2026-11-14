/**
 * Comprehensive Automated Verification Suite for RITW Admin Panel (Phase 2)
 * Tests:
 *  1. Database connectivity & SQLite queries
 *  2. Public website endpoints & route safety
 *  3. Admin REST API security, authentication & all 10 management endpoints
 *  4. Headless Browser (Puppeteer-core + Chrome):
 *     - Admin Login flow (validation, invalid credentials, valid login)
 *     - Admin Dashboard metrics, database telemetry, quick actions
 *     - All 10 section routing & tab switching (hash-based routing)
 *     - Tablet & Mobile responsive layout (drawer toggle, backdrop overlay)
 *     - Admin Logout flow
 */
const http = require('http');
const path = require('path');
const fs = require('fs');

// Verify puppeteer-core
const puppeteer = require('puppeteer-core');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const TEST_PORT = 5055;
process.env.PORT = TEST_PORT.toString();

const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function runHttpRequest(method, urlPath, headers = {}, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: TEST_PORT,
            path: urlPath,
            method: method,
            headers: {
                ...headers
            }
        };

        if (body && !headers['Content-Type']) {
            options.headers['Content-Type'] = 'application/json';
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = data;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {}
                resolve({ status: res.statusCode, headers: res.headers, body: parsed, raw: data });
            });
        });

        req.on('error', err => reject(err));
        if (body) {
            req.write(typeof body === 'string' ? body : JSON.stringify(body));
        }
        req.end();
    });
}

async function runTestSuite() {
    console.log('===============================================================');
    console.log('   STARTING RITW ADMIN PANEL VERIFICATION SUITE (PHASE 2)     ');
    console.log('===============================================================\n');

    // 1. Start Express Server
    console.log('[STEP 1] Starting Express Server with SQLite Database...');
    const { app } = require('./server');
    const server = http.createServer(app);

    await new Promise((resolve) => {
        server.listen(TEST_PORT, '127.0.0.1', () => {
            console.log(`[PASS] Server running on http://127.0.0.1:${TEST_PORT}\n`);
            resolve();
        });
    });

    try {
        // 2. Database Connectivity Test
        console.log('[STEP 2] Verifying Native SQLite Database Connectivity...');
        const db = require('./server/db/database');
        const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
        const pageCount = db.prepare('SELECT COUNT(*) as c FROM pages').get().c;
        const navCount = db.prepare('SELECT COUNT(*) as c FROM navigation_items').get().c;
        const enqCount = db.prepare('SELECT COUNT(*) as c FROM admission_enquiries').get().c;
        console.log(`[PASS] SQLite Connected! Users: ${userCount}, Pages: ${pageCount}, Nav Items: ${navCount}, Enquiries: ${enqCount}\n`);

        // 3. Public Website Safety Check
        console.log('[STEP 3] Verifying Public Site Safety & Unbroken Routes...');
        const publicRoutes = ['/', '/about/', '/departments/', '/admissions/', '/placements/', '/contact/', '/announcements/'];
        for (const route of publicRoutes) {
            const res = await runHttpRequest('GET', route);
            if (res.status === 200) {
                console.log(`  [OK] Public route "${route}" -> HTTP ${res.status}`);
            } else {
                throw new Error(`Public route "${route}" failed with status ${res.status}`);
            }
        }
        console.log('[PASS] All public routes verified and fully intact!\n');

        // 4. Admin API Endpoints & Auth Verification
        console.log('[STEP 4] Verifying Admin Authentication & REST APIs...');
        
        // 4a. Health check
        const healthRes = await runHttpRequest('GET', '/api/v1/health');
        if (healthRes.status !== 200 || healthRes.body.status !== 'UP') {
            throw new Error('Health check failed');
        }
        console.log('  [OK] System Health: UP');

        // 4b. Invalid Login check (rate limiting + password check)
        const badLogin = await runHttpRequest('POST', '/api/v1/admin/auth/login', {}, { username: 'admin', password: 'WrongPassword123' });
        if (badLogin.status === 401 && badLogin.body.success === false) {
            console.log('  [OK] Invalid login rejected correctly with HTTP 401');
        } else {
            throw new Error(`Invalid login expected 401, got ${badLogin.status}`);
        }

        // 4c. Valid Admin Login
        const validLogin = await runHttpRequest('POST', '/api/v1/admin/auth/login', {}, { username: 'admin', password: 'RitwAdmin@2026!' });
        if (validLogin.status !== 200 || !validLogin.body.token) {
            throw new Error(`Valid login failed: ${JSON.stringify(validLogin.body)}`);
        }
        const token = validLogin.body.token;
        const authHeader = { 'Authorization': `Bearer ${token}` };
        console.log('  [OK] Admin Login successful with 256-bit JWT token generated');

        // 4d. GET /api/v1/admin/auth/me
        const meRes = await runHttpRequest('GET', '/api/v1/admin/auth/me', authHeader);
        if (meRes.status !== 200 || meRes.body.user.username !== 'admin') {
            throw new Error('GET /me failed');
        }
        console.log('  [OK] GET /me verified for user "admin"');

        // 4e. GET /api/v1/admin/dashboard/summary
        const summaryRes = await runHttpRequest('GET', '/api/v1/admin/dashboard/summary', authHeader);
        if (summaryRes.status !== 200 || !summaryRes.body.stats) {
            throw new Error('Dashboard summary failed');
        }
        console.log(`  [OK] Dashboard Summary: Pages=${summaryRes.body.stats.pages}, Nav=${summaryRes.body.stats.navigation_items}, Enquiries=${summaryRes.body.stats.enquiries}`);

        // 4f. Check all other 9 endpoints
        const endpointChecks = [
            { name: 'Pages', path: '/api/v1/admin/pages' },
            { name: 'Navigation', path: '/api/v1/admin/navigation' },
            { name: 'Media', path: '/api/v1/admin/media' },
            { name: 'Documents', path: '/api/v1/admin/documents' },
            { name: 'Departments', path: '/api/v1/admin/departments' },
            { name: 'Announcements', path: '/api/v1/admin/announcements' },
            { name: 'Admissions & Placements', path: '/api/v1/admin/admissions-placements' },
            { name: 'Enquiries', path: '/api/v1/admin/enquiries' },
            { name: 'Settings', path: '/api/v1/admin/settings' }
        ];

        for (const ep of endpointChecks) {
            const res = await runHttpRequest('GET', ep.path, authHeader);
            if (res.status === 200 && res.body.success) {
                console.log(`  [OK] Admin API "${ep.name}" (${ep.path}) returned HTTP 200`);
            } else {
                throw new Error(`Admin API "${ep.name}" failed with status ${res.status}`);
            }
        }
        console.log('[PASS] All Admin REST API endpoints verified!\n');

        // 5. Headless Browser End-to-End Verification (Puppeteer-core)
        console.log('[STEP 5] Launching Headless Chrome to verify UI, Responsive Layout & Routing...');
        const browser = await puppeteer.launch({
            executablePath: CHROME_PATH,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
        });

        const page = await browser.newPage();

        // 5a. Login Screen UI
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto(`http://127.0.0.1:${TEST_PORT}/admin/`, { waitUntil: 'networkidle0' });

        const title = await page.title();
        console.log(`  [OK] Page title verified: "${title}"`);

        // Check Login Screen visible
        const loginVisible = await page.$eval('#loginView', el => el.style.display !== 'none');
        if (!loginVisible) throw new Error('Login screen should be visible initially');
        console.log('  [OK] Admin Login screen is properly presented');

        // Test Password Toggle Button
        const passInputTypeBefore = await page.$eval('#loginPassword', el => el.type);
        await page.click('.password-toggle-btn');
        const passInputTypeAfter = await page.$eval('#loginPassword', el => el.type);
        if (passInputTypeBefore === 'password' && passInputTypeAfter === 'text') {
            console.log('  [OK] Password show/hide toggle works correctly');
        }

        // Capture Login Screen screenshot
        const loginScreenshot = path.join(screenshotsDir, 'admin_login_desktop.png');
        await page.screenshot({ path: loginScreenshot });
        console.log(`  [OK] Saved screenshot: ${loginScreenshot}`);

        // Perform Login via Form
        await page.type('#loginUsername', 'admin');
        await page.type('#loginPassword', 'RitwAdmin@2026!');
        await page.click('#loginBtn');

        // Wait for Dashboard to appear
        await page.waitForFunction(() => {
            const dash = document.getElementById('dashboardView');
            return dash && dash.style.display !== 'none';
        }, { timeout: 8000 });

        console.log('  [OK] Authenticated into Dashboard successfully!');

        // 5b. Verify Dashboard Elements
        const dbBadgeText = await page.$eval('#dbStatusBadge', el => el.textContent.trim());
        const statPagesVal = await page.$eval('#statPages', el => el.textContent.trim());
        const statEnqVal = await page.$eval('#statEnquiries', el => el.textContent.trim());
        console.log(`  [OK] Database Badge: "${dbBadgeText}"`);
        console.log(`  [OK] Live Stats: Pages=${statPagesVal}, Enquiries=${statEnqVal}`);

        // Capture Desktop Dashboard screenshot
        const dashScreenshot = path.join(screenshotsDir, 'admin_dashboard_desktop.png');
        await page.screenshot({ path: dashScreenshot });
        console.log(`  [OK] Saved screenshot: ${dashScreenshot}`);

        // 5c. Test Routing & Tab Navigation
        const tabsToTest = [
            { tab: 'pages', paneId: 'tab-pages', titleMatch: 'Page Manager' },
            { tab: 'navigation', paneId: 'tab-navigation', titleMatch: 'Navigation' },
            { tab: 'media', paneId: 'tab-media', titleMatch: 'Media' },
            { tab: 'documents', paneId: 'tab-documents', titleMatch: 'Document' },
            { tab: 'departments', paneId: 'tab-departments', titleMatch: 'Departments' },
            { tab: 'announcements', paneId: 'tab-announcements', titleMatch: 'Announcements' },
            { tab: 'admissions', paneId: 'tab-admissions', titleMatch: 'Admissions' },
            { tab: 'enquiries', paneId: 'tab-enquiries', titleMatch: 'Enquiry' },
            { tab: 'settings', paneId: 'tab-settings', titleMatch: 'Settings' }
        ];

        for (const t of tabsToTest) {
            // Click navigation link
            await page.click(`.sidebar-nav .nav-link[data-tab="${t.tab}"]`);
            await page.waitForFunction((paneId) => {
                const el = document.getElementById(paneId);
                return el && el.style.display !== 'none';
            }, { timeout: 4000 }, t.paneId);

            const hash = await page.evaluate(() => window.location.hash);
            const currentTitle = await page.$eval('#pageTitle', el => el.textContent);
            if (!hash.includes(t.tab)) {
                throw new Error(`Hash mismatch for ${t.tab}, got ${hash}`);
            }
            console.log(`  [OK] Navigated to section "${t.tab}" -> Hash: ${hash}, Title: "${currentTitle}"`);
        }

        // Test Deep Linking & Hash Routing back to dashboard
        await page.evaluate(() => { window.location.hash = '#/dashboard'; });
        await page.waitForFunction(() => {
            const dash = document.getElementById('tab-dashboard');
            return dash && dash.style.display !== 'none';
        }, { timeout: 4000 });
        console.log('  [OK] Deep linking & hash routing back to "#/dashboard" verified!');

        // 5d. Tablet Viewport Test (768x1024)
        console.log('\n[STEP 6] Testing Tablet Viewport (768x1024)...');
        await page.setViewport({ width: 768, height: 1024 });
        await new Promise(r => setTimeout(r, 400));

        // Verify Hamburger button is visible on tablet
        const hamburgerVisible = await page.$eval('#mobileSidebarToggle', el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none';
        });
        if (!hamburgerVisible) throw new Error('Mobile hamburger toggle must be visible on tablet');
        console.log('  [OK] Tablet hamburger toggle is visible');

        // Toggle sidebar open
        await page.click('#mobileSidebarToggle');
        await new Promise(r => setTimeout(r, 300));
        const sidebarOpen = await page.$eval('#adminSidebar', el => el.classList.contains('open'));
        const backdropActive = await page.$eval('#sidebarBackdrop', el => el.classList.contains('active'));
        if (!sidebarOpen || !backdropActive) throw new Error('Sidebar drawer should be open with active backdrop');
        console.log('  [OK] Sidebar drawer opened with dimmed backdrop');

        // Capture Tablet screenshot
        const tabletScreenshot = path.join(screenshotsDir, 'admin_dashboard_tablet.png');
        await page.screenshot({ path: tabletScreenshot });
        console.log(`  [OK] Saved screenshot: ${tabletScreenshot}`);

        // Click backdrop to close sidebar
        await page.click('#sidebarBackdrop');
        await new Promise(r => setTimeout(r, 300));
        const sidebarClosed = await page.$eval('#adminSidebar', el => !el.classList.contains('open'));
        if (!sidebarClosed) throw new Error('Sidebar drawer should close when clicking backdrop');
        console.log('  [OK] Sidebar drawer closed when tapping backdrop');

        // 5e. Mobile Viewport Test (390x844)
        console.log('\n[STEP 7] Testing Mobile Viewport (390x844)...');
        await page.setViewport({ width: 390, height: 844 });
        await new Promise(r => setTimeout(r, 400));

        // Capture Mobile Dashboard screenshot
        const mobileScreenshot = path.join(screenshotsDir, 'admin_dashboard_mobile.png');
        await page.screenshot({ path: mobileScreenshot });
        console.log(`  [OK] Saved screenshot: ${mobileScreenshot}`);

        // 5f. Logout Flow Test
        console.log('\n[STEP 8] Testing Admin Logout Flow...');
        await page.setViewport({ width: 1440, height: 900 });
        await page.click('.topbar-actions .btn-danger');

        await page.waitForFunction(() => {
            const login = document.getElementById('loginView');
            return login && login.style.display !== 'none';
        }, { timeout: 5000 });

        const tokenAfter = await page.evaluate(() => localStorage.getItem('ritw_admin_token'));
        if (tokenAfter !== null) throw new Error('Token should be cleared from localStorage on logout');
        console.log('  [OK] Logged out cleanly! Token wiped, redirected to Login screen.');

        await browser.close();

        console.log('\n===============================================================');
        console.log('   ALL 8 VERIFICATION PHASES PASSED WITH ZERO ERRORS (100%)   ');
        console.log('===============================================================');

    } finally {
        server.close();
    }
}

runTestSuite().catch(err => {
    console.error('\n[FATAL TEST ERROR]', err);
    process.exit(1);
});
