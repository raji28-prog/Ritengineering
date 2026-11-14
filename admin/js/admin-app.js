/**
 * RITW Dynamic CMS - Admin Dashboard JavaScript Application
 * Provides complete SPA functionality for Pages, Navigation, Sections, Media, News, and Settings.
 */

// State
let authToken = localStorage.getItem('ritw_admin_token');
let currentUser = null;
let currentTab = 'dashboard';
let cachedData = {};

// Helper: API Request with Auth Header
async function apiRequest(endpoint, options = {}) {
    const headers = options.headers || {};
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const res = await fetch(endpoint, { credentials: 'same-origin', ...options, headers });
        const data = await res.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

        if (res.status === 401) {
            handleSessionExpired();
            throw new Error(data.message || 'Session expired');
        }

        if (!res.ok) {
            throw new Error(data.message || `Request failed with status ${res.status}`);
        }

        return data;
    } catch (err) {
        throw err;
    }
}

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'exclamation-circle' : 'info-circle');
    toast.innerHTML = `<i class="fas fa-${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 250);
    }, 4000);
}

// Modal Helper
function showModal(title, bodyHtml, footerButtonsHtml = '') {
    const container = document.getElementById('modalContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="modal-backdrop" onclick="if(event.target === this) closeModal()">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">${bodyHtml}</div>
                ${footerButtonsHtml ? `<div class="modal-footer">${footerButtonsHtml}</div>` : ''}
            </div>
        </div>
    `;
}

function closeModal() {
    const container = document.getElementById('modalContainer');
    if (container) container.innerHTML = '';
}

// ══════════════════════════════════════════════════════════════
// AUTHENTICATION & LOGIN SCREEN
// ══════════════════════════════════════════════════════════════
function togglePasswordVisibility() {
    const input = document.getElementById('loginPassword');
    const icon = document.getElementById('passwordToggleIcon');
    if (!input || !icon) return;

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('active');
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
}

async function checkAuthSession() {
    initRouter();

    if (!authToken) {
        showLoginScreen();
        return;
    }

    try {
        const res = await apiRequest('/api/v1/admin/auth/me');
        if (res.success && res.user) {
            currentUser = res.user;
            showDashboardScreen();
        } else {
            showLoginScreen();
        }
    } catch (err) {
        showLoginScreen();
    }
}

function showLoginScreen() {
    const loginView = document.getElementById('loginView');
    const dashboardView = document.getElementById('dashboardView');
    if (loginView) loginView.style.display = 'flex';
    if (dashboardView) dashboardView.style.display = 'none';
}

function showDashboardScreen() {
    const loginView = document.getElementById('loginView');
    const dashboardView = document.getElementById('dashboardView');
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'flex';

    if (currentUser) {
        const nameEl = document.getElementById('sidebarUsername');
        const avatarEl = document.getElementById('sidebarAvatar');
        if (nameEl) nameEl.textContent = currentUser.username;
        if (avatarEl) avatarEl.textContent = currentUser.username.charAt(0).toUpperCase();
    }

    // Route from initial hash or default to dashboard
    handleHashRouting();
}

async function handleLogin(e) {
    e.preventDefault();
    const alertBox = document.getElementById('loginAlert');
    const submitBtn = document.getElementById('loginBtn');
    alertBox.style.display = 'none';

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';

    try {
        const res = await fetch('/api/v1/admin/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (res.ok && data.success) {
            authToken = data.token;
            localStorage.setItem('ritw_admin_token', data.token);
            currentUser = data.user;
            showDashboardScreen();
            showToast('Welcome back, ' + currentUser.username);
        } else {
            alertBox.textContent = data.message || 'Login failed. Please verify your credentials.';
            alertBox.style.display = 'flex';
        }
    } catch (err) {
        alertBox.textContent = 'Server connection error. Please ensure the backend server is running.';
        alertBox.style.display = 'flex';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In to Admin Panel';
    }
}

async function handleLogout() {
    try {
        await apiRequest('/api/v1/admin/auth/logout', { method: 'POST' });
    } catch (e) {}

    authToken = null;
    localStorage.removeItem('ritw_admin_token');
    currentUser = null;
    closeMobileSidebar();
    showLoginScreen();
    showToast('Logged out securely');
}

function handleSessionExpired() {
    authToken = null;
    localStorage.removeItem('ritw_admin_token');
    currentUser = null;
    closeMobileSidebar();
    showLoginScreen();
    showToast('Your session has expired. Please sign in again.', 'error');
}

// ══════════════════════════════════════════════════════════════
// ROUTING & NAVIGATION
// ══════════════════════════════════════════════════════════════
const VALID_TABS = [
    'dashboard',
    'pages',
    'navigation',
    'media',
    'documents',
    'departments',
    'announcements',
    'admissions',
    'enquiries',
    'settings'
];

function initRouter() {
    window.addEventListener('hashchange', () => {
        if (authToken && currentUser) {
            handleHashRouting();
        }
    });
}

function handleHashRouting() {
    let hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!hash || !VALID_TABS.includes(hash)) {
        hash = 'dashboard';
    }
    navigateTo(hash, false);
}

function navigateTo(tabName, updateHash = true) {
    if (!VALID_TABS.includes(tabName)) {
        tabName = 'dashboard';
    }
    currentTab = tabName;

    if (updateHash) {
        window.location.hash = '#/' + tabName;
    }

    closeMobileSidebar();

    // Update active sidebar link
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === tabName) {
            link.classList.add('active');
        }
    });

    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => pane.style.display = 'none');

    // Show target tab pane
    const targetPane = document.getElementById(`tab-${tabName}`);
    if (targetPane) targetPane.style.display = 'block';

    // Update topbar title
    const titles = {
        dashboard: 'Dashboard Overview',
        pages: 'Page Manager',
        navigation: 'Navigation Manager & Mega-Menu',
        media: 'Media Asset Library',
        documents: 'Institutional Document Manager',
        departments: 'Academic Departments & Programs',
        announcements: 'Announcements & Events Ticker',
        admissions: 'Admissions 2026-27 & Placements',
        enquiries: 'Admission Enquiry Manager',
        settings: 'Institutional Website Settings'
    };
    const titleEl = document.getElementById('pageTitle');
    if (titleEl) titleEl.textContent = titles[tabName] || 'Admin Console';

    // Load data for active section
    if (tabName === 'dashboard') loadDashboardOverview();
    else if (tabName === 'pages') loadPages();
    else if (tabName === 'navigation') loadNavigation();
    else if (tabName === 'media') loadMedia();
    else if (tabName === 'documents') loadDocuments();
    else if (tabName === 'departments') loadDepartments();
    else if (tabName === 'announcements') loadAnnouncements();
    else if (tabName === 'admissions') loadAdmissionsPlacements();
    else if (tabName === 'enquiries') loadEnquiries();
    else if (tabName === 'settings') loadCollegeSettings();
}

// ══════════════════════════════════════════════════════════════
// 1. DASHBOARD OVERVIEW
// ══════════════════════════════════════════════════════════════
async function loadDashboardOverview() {
    try {
        const summaryRes = await apiRequest('/api/v1/admin/dashboard/summary');
        if (!summaryRes.success) return;

        const { stats, recent_logs, system_info } = summaryRes;

        const statPages = document.getElementById('statPages');
        const statMenuItems = document.getElementById('statMenuItems');
        const statNews = document.getElementById('statNews');
        const statEnquiries = document.getElementById('statEnquiries');
        const statMedia = document.getElementById('statMedia');
        const statDocuments = document.getElementById('statDocuments');

        if (statPages) statPages.textContent = stats.pages || 0;
        if (statMenuItems) statMenuItems.textContent = stats.navigation_items || 0;
        if (statNews) statNews.textContent = stats.announcements || 0;
        if (statEnquiries) statEnquiries.textContent = stats.enquiries || 0;
        if (statMedia) statMedia.textContent = stats.media_assets || 0;
        if (statDocuments) statDocuments.textContent = stats.documents || 7; // Statutory certificates count

        // Update sidebar badges
        const newsBadge = document.getElementById('sidebarNewsCount');
        if (newsBadge) {
            newsBadge.textContent = stats.announcements || 0;
            newsBadge.style.display = stats.announcements > 0 ? 'inline-block' : 'none';
        }

        const leadBadge = document.getElementById('sidebarLeadCount');
        if (leadBadge) {
            leadBadge.textContent = stats.new_enquiries || 0;
            leadBadge.style.display = stats.new_enquiries > 0 ? 'inline-block' : 'none';
        }

        // Render audit logs
        const logsBody = document.getElementById('auditLogsBody');
        if (logsBody) {
            if (recent_logs && recent_logs.length > 0) {
                logsBody.innerHTML = recent_logs.map(log => `
                    <tr>
                        <td>${new Date(log.created_at).toLocaleString()}</td>
                        <td><strong style="color:var(--primary);">${escapeHtml(log.action)}</strong></td>
                        <td>${escapeHtml(log.entity_type || '—')}</td>
                        <td>${escapeHtml(log.details || '—')}</td>
                        <td><code>${escapeHtml(log.ip_address || 'local')}</code></td>
                    </tr>
                `).join('');
            } else {
                logsBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #8E8EA6; padding: 20px;">No recent activity logs.</td></tr>';
            }
        }
    } catch (err) {
        console.error('Error loading dashboard summary:', err);
    }
}

// ══════════════════════════════════════════════════════════════
// HYBRID CMS - PAGES MANAGER & CONTENT EDITOR
// ══════════════════════════════════════════════════════════════

let currentEditingPage = null;
let currentEditorSections = [];
let currentEditorActiveTab = 'sections';
let currentMenuGroup = 'ALL';
let currentPageViewMode = 'cards';
let currentEditingSectionIndex = null;

// Helper: Extract clean readable text excerpt from section HTML
function cleanContentSnippet(html) {
    if (!html) return 'No preview text configured.';
    // If it contains paragraph tags, pick first paragraph
    const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    let raw = pMatch ? pMatch[1] : html;
    // Strip all HTML tags
    let text = raw.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    if (!text) {
        text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    if (text.length > 220) {
        return text.slice(0, 220) + '...';
    }
    return text || 'No preview text configured.';
}

// Helper: Extract filename from URL/path
function extractFileName(url) {
    if (!url) return '';
    try {
        const clean = url.split('?')[0].split('#')[0];
        const parts = clean.split('/');
        return parts[parts.length - 1] || url;
    } catch (e) {
        return url;
    }
}

async function loadPages() {
    try {
        if (!currentEditingPage) {
            const lv = document.getElementById('pagesListView');
            const ev = document.getElementById('pageEditorView');
            if (lv) lv.style.display = 'block';
            if (ev) ev.style.display = 'none';
        }
        const res = await apiRequest('/api/v1/admin/pages');
        cachedData.allPages = res.pages || [];
        filterPages();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function selectMenuGroup(group) {
    currentMenuGroup = group;
    // Update active tab button style
    document.querySelectorAll('.cms-menu-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-group') === group) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    filterPages();
}

function switchPageViewMode(mode) {
    currentPageViewMode = mode;
    const btnCards = document.getElementById('btnViewCards');
    const btnTable = document.getElementById('btnViewTable');
    const gridEl = document.getElementById('pagesCardGrid');
    const tableEl = document.getElementById('pagesTableView');

    if (mode === 'cards') {
        if (btnCards) btnCards.classList.add('active');
        if (btnTable) btnTable.classList.remove('active');
        if (gridEl) gridEl.style.display = 'grid';
        if (tableEl) tableEl.style.display = 'none';
    } else {
        if (btnCards) btnCards.classList.remove('active');
        if (btnTable) btnTable.classList.add('active');
        if (gridEl) gridEl.style.display = 'none';
        if (tableEl) tableEl.style.display = 'block';
    }
}

function filterPages() {
    const pages = cachedData.allPages || [];
    const search = (document.getElementById('pageSearchInput')?.value || '').toLowerCase().trim();
    const statusFilter = document.getElementById('pageStatusFilter')?.value || '';

    // Update total count
    const countAllEl = document.getElementById('countAllPages');
    if (countAllEl) countAllEl.textContent = pages.length;

    const filtered = pages.filter(p => {
        // Menu Group Filter
        if (currentMenuGroup !== 'ALL') {
            const pageGroup = (p.menu_group || 'About').toLowerCase();
            if (pageGroup !== currentMenuGroup.toLowerCase()) return false;
        }

        // Search Filter
        if (search) {
            const t = (p.title || '').toLowerCase();
            const s = (p.slug || '').toLowerCase();
            const u = (p.url || '').toLowerCase();
            if (!t.includes(search) && !s.includes(search) && !u.includes(search)) return false;
        }

        // Status Filter
        if (statusFilter && p.status !== statusFilter) return false;

        return true;
    });

    const pill = document.getElementById('pagesCountPill');
    if (pill) {
        const groupLabel = currentMenuGroup === 'ALL' ? 'All' : currentMenuGroup;
        pill.textContent = `Showing ${filtered.length} of ${pages.length} pages (${groupLabel})`;
    }

    renderPagesGrid(filtered);
    renderPagesTable(filtered);
}

function renderPagesGrid(pages) {
    const grid = document.getElementById('pagesCardGrid');
    if (!grid) return;

    if (pages.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #FFFFFF; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                <i class="fas fa-folder-open fa-2x" style="color: #94A3B8; margin-bottom: 12px;"></i>
                <h4 style="color: #334155; margin-bottom: 6px;">No Pages Found</h4>
                <p style="color: #64748B; font-size: 13px; margin: 0;">No website pages match the selected menu category or search filter.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = pages.map(page => {
        const publicUrl = page.url || (page.slug === 'home' ? '/' : `/${page.slug}/`);
        const isDraft = page.has_draft === 1 || page.status === 'draft';
        const menuGroup = page.menu_group || 'About';

        return `
            <div class="cms-page-card">
                <div class="cms-page-card-header">
                    <span class="cms-menu-pill"><i class="fas fa-bookmark" style="font-size:10px;"></i> ${escapeHtml(menuGroup)}</span>
                    ${isDraft ? `
                        <span class="badge badge-draft"><i class="fas fa-file-signature"></i> Draft Changes</span>
                    ` : (page.status === 'published' ? `
                        <span class="badge badge-published"><i class="fas fa-check-circle"></i> Published</span>
                    ` : `
                        <span class="badge badge-archived">${escapeHtml(page.status)}</span>
                    `)}
                </div>

                <div class="cms-page-card-body">
                    <h3 class="cms-page-card-title">${escapeHtml(page.title)}</h3>
                    
                    <div>
                        <a href="${publicUrl}" target="_blank" class="badge-url-pill" title="Open live public URL">
                            <code>${escapeHtml(publicUrl)}</code>
                            <i class="fas fa-external-link-alt" style="font-size: 10px;"></i>
                        </a>
                    </div>

                    <div class="cms-page-card-meta">
                        <span class="badge" style="background:#ECEAF7; color:var(--primary); font-weight:700;">
                            <i class="fas fa-layer-group"></i> ${page.section_count || 0} Sections
                        </span>
                        <span style="color:#16A34A; font-weight:600; font-size:12px; display:inline-flex; align-items:center; gap:4px;">
                            <i class="fas fa-check-circle"></i> File Verified
                        </span>
                    </div>
                </div>

                <div class="cms-page-card-footer">
                    <button type="button" class="btn btn-primary btn-sm" onclick="openPageEditor(${page.id})" title="Manage and edit page content sections">
                        <i class="fas fa-edit"></i> Manage Content
                    </button>
                    
                    <div style="display:flex; gap:4px; align-items:center;">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="openPageSettingsModal(${page.id})" title="Page Settings (Title, Slug, SEO)">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button type="button" class="btn btn-info btn-sm" onclick="openPagePreviewById(${page.id})" style="background:#2563EB; color:#fff; border-color:#2563EB;" title="Preview Page">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${isDraft ? `
                            <button type="button" class="btn btn-success btn-sm" onclick="quickPublishPage(${page.id}, '${escapeHtml(page.title)}')" title="Publish Live Now">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderPagesTable(pages) {
    const tbody = document.getElementById('pagesTableBody');
    if (!tbody) return;

    if (pages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--text-muted);">No pages found matching your search criteria.</td></tr>';
        return;
    }

    tbody.innerHTML = pages.map(page => {
        const publicUrl = page.url || (page.slug === 'home' ? '/' : `/${page.slug}/`);
        const isDraft = page.has_draft === 1 || page.status === 'draft';
        const menuGroup = page.menu_group || 'About';

        return `
            <tr>
                <td>
                    <div style="font-weight: 700; color: var(--text-main); font-size: 14px; margin-bottom: 3px;">
                        ${escapeHtml(page.title)}
                    </div>
                    <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                        <span class="cms-menu-pill" style="font-size:10px;">${escapeHtml(menuGroup)}</span>
                        <span class="badge" style="background:#F1F5F9; color:#475569; font-size:11px;">Template: ${escapeHtml(page.template || 'standard')}</span>
                        ${isDraft ? `<span class="badge-draft-warning"><i class="fas fa-edit"></i> Draft Changes</span>` : ''}
                    </div>
                </td>
                <td>
                    <a href="${publicUrl}" target="_blank" class="badge-url-pill" title="Open live public URL">
                        <code>${escapeHtml(publicUrl)}</code>
                        <i class="fas fa-external-link-alt" style="font-size: 10px;"></i>
                    </a>
                </td>
                <td>
                    ${isDraft ? `
                        <span class="badge badge-draft"><i class="fas fa-file-signature"></i> Draft</span>
                    ` : (page.status === 'published' ? `
                        <span class="badge badge-published"><i class="fas fa-check-circle"></i> Published</span>
                    ` : `
                        <span class="badge badge-archived">${escapeHtml(page.status)}</span>
                    `)}
                </td>
                <td>
                    <span class="badge" style="background:#ECEAF7; color:var(--primary); font-weight:700;">
                        ${page.section_count || 0} sections
                    </span>
                </td>
                <td>
                    <span style="color:#16A34A; font-weight:600; font-size:12px; display:inline-flex; align-items:center; gap:5px;">
                        <i class="fas fa-check-circle"></i> File Verified
                    </span>
                </td>
                <td>
                    <div style="display:flex; gap:6px; align-items:center;">
                        <button class="btn btn-primary btn-sm" onclick="openPageEditor(${page.id})" title="Manage Content Sections">
                            <i class="fas fa-edit"></i> Edit Content
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="openPageSettingsModal(${page.id})" title="Page Settings">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button class="btn btn-info btn-sm" onclick="openPagePreviewById(${page.id})" style="background:#2563EB; color:#fff; border-color:#2563EB;" title="Preview Draft">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${isDraft ? `
                            <button class="btn btn-success btn-sm" onclick="quickPublishPage(${page.id}, '${escapeHtml(page.title)}')" title="Publish Live Now">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        ` : ''}
                        ${page.slug !== 'home' ? `
                            <button class="btn btn-danger btn-sm" onclick="deletePage(${page.id}, '${escapeHtml(page.title)}')" title="Delete Page">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ══════════════════════════════════════════════════════════════
// CONTENT EDITOR (INLINE WORKSPACE)
// ══════════════════════════════════════════════════════════════

async function openPageEditor(pageId) {
    try {
        const res = await apiRequest(`/api/v1/admin/pages/${pageId}`);
        if (!res.success || !res.page) {
            throw new Error(res.message || 'Unable to load page details');
        }

        currentEditingPage = res.page;

        // Use draft sections if available, otherwise existing sections
        if (currentEditingPage.draft_data && Array.isArray(currentEditingPage.draft_data.sections)) {
            currentEditorSections = JSON.parse(JSON.stringify(currentEditingPage.draft_data.sections));
        } else {
            currentEditorSections = JSON.parse(JSON.stringify(currentEditingPage.sections || []));
        }

        // Set Editor Heading, Menu Pill & Badges
        const headingEl = document.getElementById('editorPageHeading');
        const menuPillEl = document.getElementById('editorMenuGroupBadge');
        const badgeEl = document.getElementById('editorStatusBadge');
        const urlLinkEl = document.getElementById('editorPublicUrlLink');
        const urlTextEl = document.getElementById('editorPublicUrlText');

        if (headingEl) headingEl.textContent = currentEditingPage.title;
        if (menuPillEl) menuPillEl.textContent = currentEditingPage.menu_group || 'About';

        const publicUrl = currentEditingPage.url || (currentEditingPage.slug === 'home' ? '/' : `/${currentEditingPage.slug}/`);
        if (urlLinkEl) urlLinkEl.href = publicUrl;
        if (urlTextEl) urlTextEl.textContent = publicUrl;

        if (badgeEl) {
            if (currentEditingPage.has_draft) {
                badgeEl.className = 'badge badge-draft';
                badgeEl.innerHTML = '<i class="fas fa-file-signature"></i> Draft (Unpublished Changes)';
            } else {
                badgeEl.className = 'badge badge-published';
                badgeEl.innerHTML = '<i class="fas fa-check-circle"></i> Published Live';
            }
        }

        // Render Section Cards
        renderEditorSections();

        // Toggle Views
        const listView = document.getElementById('pagesListView');
        const editorView = document.getElementById('pageEditorView');
        if (listView) listView.style.display = 'none';
        if (editorView) editorView.style.display = 'block';

        // Scroll to top of editor
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function closePageEditor() {
    const editorView = document.getElementById('pageEditorView');
    const listView = document.getElementById('pagesListView');
    if (editorView) editorView.style.display = 'none';
    if (listView) listView.style.display = 'block';
    currentEditingPage = null;
    currentEditorSections = [];
    loadPages();
}

function renderEditorSections() {
    const container = document.getElementById('editorSectionsContainer');
    const countBadge = document.getElementById('editorSecCountBadge');
    if (countBadge) countBadge.textContent = currentEditorSections.length;
    if (!container) return;

    if (currentEditorSections.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 48px 20px; background:#F8FAFC; border:2px dashed #CBD5E1; border-radius:var(--radius-md);">
                <i class="fas fa-layer-group fa-2x" style="color:#94A3B8; margin-bottom:12px;"></i>
                <h4 style="color:#334155; margin-bottom:6px;">No Content Sections Found</h4>
                <p style="color:#64748B; font-size:13px; max-width:420px; margin:0 auto 16px;">This page has no modular content sections yet. Click below to add your first structured section.</p>
                <button type="button" class="btn btn-success btn-sm" onclick="addNewSectionToEditor()"><i class="fas fa-plus"></i> Add First Section</button>
            </div>
        `;
        return;
    }

    container.innerHTML = currentEditorSections.map((sec, idx) => {
        const isVisible = sec.is_visible !== 0;
        const cardClass = isVisible ? 'cms-section-card' : 'cms-section-card is-hidden';
        const sectionTitle = sec.title || sec.section_key || `Section ${idx + 1}`;
        const sectionSnippet = cleanContentSnippet(sec.content_html);
        const imgName = extractFileName(sec.image_url);
        const docName = extractFileName(sec.document_url);

        return `
            <div class="${cardClass}" id="cmsSecCard_${idx}">
                <div class="cms-sec-header">
                    <div class="cms-sec-title-wrap">
                        <i class="fas fa-grip-vertical cms-sec-drag-handle" title="Section item"></i>
                        <span class="badge" style="background:#ECEAF7; color:var(--primary); font-size:11px; font-weight:700;">#${idx + 1}</span>
                        <span class="cms-sec-type-badge">${escapeHtml(sec.section_type || 'standard')}</span>
                        <span class="cms-sec-name" id="secHeadingPreview_${idx}">
                            ${escapeHtml(sectionTitle)}
                        </span>
                    </div>

                    <div class="cms-sec-controls">
                        <!-- Up / Down Reordering -->
                        <button type="button" class="btn btn-secondary btn-sm" onclick="moveSectionInEditor(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} title="Move Up">
                            <i class="fas fa-chevron-up"></i>
                        </button>
                        <button type="button" class="btn btn-secondary btn-sm" onclick="moveSectionInEditor(${idx}, 1)" ${idx === currentEditorSections.length - 1 ? 'disabled' : ''} title="Move Down">
                            <i class="fas fa-chevron-down"></i>
                        </button>

                        <!-- Visibility Toggle -->
                        <button type="button" class="btn-visibility-toggle ${isVisible ? 'is-visible' : 'is-hidden'}" onclick="toggleSectionVisibilityInEditor(${idx})" title="Toggle section visibility on live website">
                            <i class="fas fa-${isVisible ? 'eye' : 'eye-slash'}"></i>
                            <span>${isVisible ? 'Visible' : 'Hidden'}</span>
                        </button>

                        <!-- Edit Section Button -->
                        <button type="button" class="btn btn-primary btn-sm" onclick="openSectionEditModal(${idx})" title="Edit section content, media and links">
                            <i class="fas fa-pen"></i> Edit Section
                        </button>

                        <!-- Delete Section -->
                        <button type="button" class="btn btn-danger btn-sm" onclick="deleteSectionFromEditor(${idx})" title="Delete Section">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <div class="cms-sec-body">
                    <!-- Clean Content Preview Box -->
                    <div class="cms-sec-preview-box">
                        ${sec.subtitle ? `<div class="cms-sec-preview-subtitle"><i class="fas fa-tag"></i> ${escapeHtml(sec.subtitle)}</div>` : ''}
                        <p class="cms-sec-preview-text">${escapeHtml(sectionSnippet)}</p>
                    </div>

                    <!-- Attached Media & Assets Row (Image, PDF, Button) -->
                    ${(sec.image_url || sec.document_url || sec.button_text || sec.button_url) ? `
                        <div class="cms-sec-assets-row">
                            ${sec.image_url ? `
                                <div class="cms-asset-chip" title="${escapeHtml(sec.image_url)}">
                                    <img src="${escapeHtml(sec.image_url)}" class="cms-asset-thumb" alt="Section Image" onerror="this.src='/images/logo.png'">
                                    <div class="cms-asset-chip-info">
                                        <span class="cms-asset-chip-label"><i class="fas fa-image"></i> Section Image</span>
                                        <span class="cms-asset-chip-name">${escapeHtml(imgName)}</span>
                                    </div>
                                    <a href="${escapeHtml(sec.image_url)}" target="_blank" style="margin-left:auto; color:var(--primary); font-size:12px;"><i class="fas fa-external-link-alt"></i></a>
                                </div>
                            ` : ''}

                            ${sec.document_url ? `
                                <div class="cms-asset-chip" title="${escapeHtml(sec.document_url)}">
                                    <i class="fas fa-file-pdf fa-2x" style="color:#DC2626;"></i>
                                    <div class="cms-asset-chip-info">
                                        <span class="cms-asset-chip-label"><i class="fas fa-file-alt"></i> Attached Document</span>
                                        <span class="cms-asset-chip-name">${escapeHtml(docName)}</span>
                                    </div>
                                    <a href="${escapeHtml(sec.document_url)}" target="_blank" style="margin-left:auto; color:var(--primary); font-size:12px;"><i class="fas fa-download"></i></a>
                                </div>
                            ` : ''}

                            ${(sec.button_text || sec.button_url) ? `
                                <div class="cms-asset-chip" title="${escapeHtml(sec.button_url || '')}">
                                    <i class="fas fa-link fa-lg" style="color:var(--primary);"></i>
                                    <div class="cms-asset-chip-info">
                                        <span class="cms-asset-chip-label">Action Link</span>
                                        <span class="cms-asset-chip-name">${escapeHtml(sec.button_text || 'Button')} &rarr; <code>${escapeHtml(sec.button_url || '#')}</code></span>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>

                <div class="cms-sec-footer">
                    <span style="font-size:12px; color:var(--text-muted); font-family:monospace;">
                        ID: <strong>${escapeHtml(sec.section_key)}</strong>
                    </span>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="openSectionEditModal(${idx})">
                        <i class="fas fa-edit"></i> Edit Content &amp; Media
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateSectionField(index, field, value) {
    if (!currentEditorSections[index]) return;
    currentEditorSections[index][field] = value;
}

function addNewSectionToEditor() {
    const newIdx = currentEditorSections.length + 1;
    const newSec = {
        section_key: `sec_${Date.now()}_${newIdx}`,
        title: `New Section ${newIdx}`,
        subtitle: '',
        content_html: '<p>Enter section paragraph text here.</p>',
        image_url: '',
        document_url: '',
        button_text: '',
        button_url: '',
        section_type: 'standard',
        sort_order: newIdx,
        is_visible: 1
    };

    currentEditorSections.push(newSec);
    renderEditorSections();
    showToast('New section added to editor.');
    // Immediately open the editor modal for the new section
    openSectionEditModal(currentEditorSections.length - 1);
}

function deleteSectionFromEditor(index) {
    const sec = currentEditorSections[index];
    if (!confirm(`Are you sure you want to remove section "${sec.title || sec.section_key}"?`)) return;

    currentEditorSections.splice(index, 1);
    currentEditorSections.forEach((s, i) => s.sort_order = i + 1);
    renderEditorSections();
    showToast('Section removed.');
}

function moveSectionInEditor(index, direction) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= currentEditorSections.length) return;

    const temp = currentEditorSections[index];
    currentEditorSections[index] = currentEditorSections[targetIdx];
    currentEditorSections[targetIdx] = temp;

    currentEditorSections.forEach((s, i) => s.sort_order = i + 1);
    renderEditorSections();
}

function toggleSectionVisibilityInEditor(index) {
    const sec = currentEditorSections[index];
    sec.is_visible = sec.is_visible === 0 ? 1 : 0;
    renderEditorSections();
    showToast(`Section is now ${sec.is_visible ? 'Visible' : 'Hidden'}.`);
}

// ══════════════════════════════════════════════════════════════
// SECTION EDIT MODAL (STRUCTURED VISUAL CMS)
// ══════════════════════════════════════════════════════════════

function openSectionEditModal(index) {
    currentEditingSectionIndex = index;
    const sec = currentEditorSections[index];
    if (!sec) return;

    const container = document.getElementById('modalContainer');
    if (!container) return;

    const imgName = extractFileName(sec.image_url);
    const docName = extractFileName(sec.document_url);

    container.innerHTML = `
        <div class="modal-backdrop" onclick="if(event.target === this) closeModal()">
            <div class="modal-content" style="max-width: 760px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2><i class="fas fa-edit" style="color:var(--primary);"></i> Edit Section: ${escapeHtml(sec.title || sec.section_key)}</h2>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>

                <div class="modal-body" style="padding: 20px;">
                    <!-- Section Title & Subtitle -->
                    <div class="cms-field-row">
                        <div class="form-group">
                            <label><strong>Section Heading / Title *</strong></label>
                            <input type="text" id="modalSecTitle" class="form-control" value="${escapeHtml(sec.title || '')}" placeholder="e.g. Vision, Mission & Quality Policy">
                        </div>
                        <div class="form-group">
                            <label><strong>Subtitle / Tagline / Badge</strong></label>
                            <input type="text" id="modalSecSubtitle" class="form-control" value="${escapeHtml(sec.subtitle || '')}" placeholder="e.g. Foundational Legacy">
                        </div>
                    </div>

                    <!-- Type & Identifier -->
                    <div class="cms-field-row">
                        <div class="form-group">
                            <label><strong>Section Layout / Type</strong></label>
                            <select id="modalSecType" class="form-control">
                                <option value="standard" ${sec.section_type === 'standard' ? 'selected' : ''}>Standard Content Block</option>
                                <option value="hero" ${sec.section_type === 'hero' ? 'selected' : ''}>Hero Header Section</option>
                                <option value="overview" ${sec.section_type === 'overview' ? 'selected' : ''}>Institutional / Department Overview</option>
                                <option value="leadership" ${sec.section_type === 'leadership' ? 'selected' : ''}>Leadership Desk Message</option>
                                <option value="cards" ${sec.section_type === 'cards' ? 'selected' : ''}>Feature Cards Grid</option>
                                <option value="documents" ${sec.section_type === 'documents' ? 'selected' : ''}>Statutory Documents / PDF Downloads</option>
                                <option value="accreditation" ${sec.section_type === 'accreditation' ? 'selected' : ''}>Accreditation & Approvals</option>
                                <option value="table" ${sec.section_type === 'table' ? 'selected' : ''}>Data / Information Table</option>
                                <option value="custom" ${sec.section_type === 'custom' ? 'selected' : ''}>Custom HTML Section</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label><strong>Section Anchor / HTML ID</strong></label>
                            <input type="text" id="modalSecKey" class="form-control" value="${escapeHtml(sec.section_key || '')}" placeholder="e.g. vision-mission">
                        </div>
                    </div>

                    <!-- Rich Text Content Editor -->
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label><strong>Section Paragraphs / Content *</strong></label>
                        <div class="cms-rich-toolbar">
                            <button type="button" class="cms-toolbar-btn" onclick="applyRichFormat('bold')" title="Bold"><i class="fas fa-bold"></i></button>
                            <button type="button" class="cms-toolbar-btn" onclick="applyRichFormat('italic')" title="Italic"><i class="fas fa-italic"></i></button>
                            <button type="button" class="cms-toolbar-btn" onclick="applyRichFormat('h3')" title="Heading 3"><i class="fas fa-heading"></i> H3</button>
                            <button type="button" class="cms-toolbar-btn" onclick="applyRichFormat('list')" title="Bullet List"><i class="fas fa-list-ul"></i> List</button>
                            <button type="button" class="cms-toolbar-btn" onclick="applyRichFormat('link')" title="Insert Link"><i class="fas fa-link"></i> Link</button>
                            <button type="button" class="cms-toolbar-btn" onclick="applyRichFormat('clear')" title="Clear Formatting"><i class="fas fa-eraser"></i> Clear</button>
                        </div>
                        <textarea id="modalSecContent" class="form-control" rows="6" style="border-top-left-radius:0; border-top-right-radius:0; font-size:13px; font-family:inherit;" placeholder="Enter section body content...">${escapeHtml(sec.content_html || '')}</textarea>
                    </div>

                    <!-- Image Asset Box -->
                    <div class="card" style="margin-bottom: 16px; background: #F8FAFC; border: 1px solid #E2E8F0;">
                        <div class="card-body" style="padding: 14px 16px;">
                            <label style="font-weight:700; font-size:13px; color:var(--text-main); margin-bottom:8px; display:block;">
                                <i class="fas fa-image" style="color:var(--primary);"></i> Section Image / Photo
                            </label>
                            
                            <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap; margin-bottom:10px;">
                                <div id="modalImgPreviewWrap" style="width:64px; height:64px; border-radius:6px; border:1px solid #CBD5E1; background:#fff; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                                    ${sec.image_url ? `
                                        <img src="${escapeHtml(sec.image_url)}" id="modalImgPreview" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='/images/logo.png'">
                                    ` : `
                                        <i class="fas fa-image fa-2x" id="modalImgPreviewPlaceholder" style="color:#CBD5E1;"></i>
                                    `}
                                </div>
                                <div style="flex:1; min-width:240px;">
                                    <div style="display:flex; gap:8px;">
                                        <input type="text" id="modalSecImgUrl" class="form-control" value="${escapeHtml(sec.image_url || '')}" oninput="updateModalImgPreview(this.value)" placeholder="/images/... or https://...">
                                        <button type="button" class="btn btn-secondary btn-sm" onclick="triggerSectionUploadInModal('image')" title="Upload image from computer">
                                            <i class="fas fa-upload"></i> Upload
                                        </button>
                                        <button type="button" class="btn btn-danger btn-sm" onclick="clearModalAsset('image')" title="Remove image">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                    <div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">
                                        Current file: <span id="modalImgFileName">${imgName || 'None'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Attached Document / PDF Box -->
                    <div class="card" style="margin-bottom: 16px; background: #F8FAFC; border: 1px solid #E2E8F0;">
                        <div class="card-body" style="padding: 14px 16px;">
                            <label style="font-weight:700; font-size:13px; color:var(--text-main); margin-bottom:8px; display:block;">
                                <i class="fas fa-file-pdf" style="color:#DC2626;"></i> Attached Document / PDF File
                            </label>

                            <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap; margin-bottom:10px;">
                                <div style="width:48px; height:48px; border-radius:6px; background:#FEE2E2; display:flex; align-items:center; justify-content:center; color:#DC2626;">
                                    <i class="fas fa-file-pdf fa-2x"></i>
                                </div>
                                <div style="flex:1; min-width:240px;">
                                    <div style="display:flex; gap:8px;">
                                        <input type="text" id="modalSecDocUrl" class="form-control" value="${escapeHtml(sec.document_url || '')}" placeholder="/PDFs/... or https://...">
                                        <button type="button" class="btn btn-secondary btn-sm" onclick="triggerSectionUploadInModal('document')" title="Upload PDF document">
                                            <i class="fas fa-upload"></i> Upload
                                        </button>
                                        <button type="button" class="btn btn-danger btn-sm" onclick="clearModalAsset('document')" title="Remove document">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                    <div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">
                                        Current file: <span id="modalDocFileName">${docName || 'None'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Link / Button -->
                    <div class="cms-field-row">
                        <div class="form-group">
                            <label><strong>Action Button / Link Text</strong></label>
                            <input type="text" id="modalSecBtnText" class="form-control" value="${escapeHtml(sec.button_text || '')}" placeholder="e.g. Download Regulations PDF">
                        </div>
                        <div class="form-group">
                            <label><strong>Action Target URL</strong></label>
                            <input type="text" id="modalSecBtnUrl" class="form-control" value="${escapeHtml(sec.button_url || '')}" placeholder="e.g. /PDFs/... or https://...">
                        </div>
                    </div>

                    <!-- Visibility Toggle -->
                    <div class="form-group" style="margin-top: 14px;">
                        <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                            <input type="checkbox" id="modalSecVisible" ${sec.is_visible !== 0 ? 'checked' : ''} style="width:18px; height:18px;">
                            <span style="font-size:13.5px; font-weight:600; color:var(--text-main);">Visible on public website</span>
                        </label>
                        <p style="font-size:12px; color:var(--text-muted); margin:4px 0 0 26px;">Uncheck to hide this section from the live page without deleting its content.</p>
                    </div>

                </div>

                <div class="modal-footer" style="padding: 14px 20px; background:#F8FAFC; border-top:1px solid var(--border-color); display:flex; justify-content:flex-end; gap:10px;">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveSectionFromModal(${index})">
                        <i class="fas fa-check"></i> Save Section Changes
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateModalImgPreview(url) {
    const wrap = document.getElementById('modalImgPreviewWrap');
    const nameEl = document.getElementById('modalImgFileName');
    if (nameEl) nameEl.textContent = extractFileName(url) || 'None';
    if (!wrap) return;

    if (url) {
        wrap.innerHTML = `<img src="${escapeHtml(url)}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='/images/logo.png'">`;
    } else {
        wrap.innerHTML = `<i class="fas fa-image fa-2x" style="color:#CBD5E1;"></i>`;
    }
}

function clearModalAsset(type) {
    if (type === 'image') {
        const input = document.getElementById('modalSecImgUrl');
        if (input) input.value = '';
        updateModalImgPreview('');
    } else {
        const input = document.getElementById('modalSecDocUrl');
        if (input) input.value = '';
        const nameEl = document.getElementById('modalDocFileName');
        if (nameEl) nameEl.textContent = 'None';
    }
}

function applyRichFormat(format) {
    const textarea = document.getElementById('modalSecContent');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || 'text';
    let replacement = selected;

    if (format === 'bold') {
        replacement = `<strong>${selected}</strong>`;
    } else if (format === 'italic') {
        replacement = `<em>${selected}</em>`;
    } else if (format === 'h3') {
        replacement = `<h3>${selected}</h3>`;
    } else if (format === 'list') {
        const items = selected.split('\n').filter(l => l.trim()).map(l => `  <li>${l.trim()}</li>`).join('\n');
        replacement = `<ul>\n${items}\n</ul>`;
    } else if (format === 'link') {
        const url = prompt('Enter the link URL (e.g. /admissions/ or https://...):', 'https://');
        if (!url) return;
        replacement = `<a href="${url}" target="_blank">${selected}</a>`;
    } else if (format === 'clear') {
        replacement = selected.replace(/<[^>]+>/g, '');
    }

    textarea.setRangeText(replacement, start, end, 'select');
    textarea.focus();
}

function saveSectionFromModal(index) {
    const sec = currentEditorSections[index];
    if (!sec) return;

    sec.title = (document.getElementById('modalSecTitle')?.value || '').trim();
    sec.subtitle = (document.getElementById('modalSecSubtitle')?.value || '').trim();
    sec.section_type = document.getElementById('modalSecType')?.value || 'standard';
    sec.section_key = (document.getElementById('modalSecKey')?.value || sec.section_key).trim();
    sec.content_html = document.getElementById('modalSecContent')?.value || '';
    sec.image_url = (document.getElementById('modalSecImgUrl')?.value || '').trim();
    sec.document_url = (document.getElementById('modalSecDocUrl')?.value || '').trim();
    sec.button_text = (document.getElementById('modalSecBtnText')?.value || '').trim();
    sec.button_url = (document.getElementById('modalSecBtnUrl')?.value || '').trim();
    sec.is_visible = document.getElementById('modalSecVisible')?.checked ? 1 : 0;

    renderEditorSections();
    closeModal();
    showToast(`Section "${sec.title || sec.section_key}" updated! Remember to Save Draft or Publish Live.`);

    // Update status badge to show draft unsaved state
    const badgeEl = document.getElementById('editorStatusBadge');
    if (badgeEl) {
        badgeEl.className = 'badge badge-draft';
        badgeEl.innerHTML = '<i class="fas fa-edit"></i> Unsaved Draft Changes';
    }
}

function triggerSectionUploadInModal(type) {
    let input = document.getElementById('cmsModalHiddenFileInput');
    if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.id = 'cmsModalHiddenFileInput';
        input.style.display = 'none';
        input.onchange = handleModalFileUpload;
        document.body.appendChild(input);
    }
    input.dataset.uploadType = type;
    input.accept = type === 'image' ? 'image/*' : 'application/pdf';
    input.value = '';
    input.click();
}

async function handleModalFileUpload(e) {
    const file = e.target.files[0];
    const type = e.target.dataset.uploadType;
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', file.name);

    try {
        showToast(`Uploading ${file.name}...`, 'info');
        const res = await apiRequest('/api/v1/admin/media/upload', {
            method: 'POST',
            body: formData
        });

        if (res.success && res.media) {
            const url = res.media.url;
            if (type === 'image') {
                const input = document.getElementById('modalSecImgUrl');
                if (input) input.value = url;
                updateModalImgPreview(url);
            } else {
                const input = document.getElementById('modalSecDocUrl');
                if (input) input.value = url;
                const nameEl = document.getElementById('modalDocFileName');
                if (nameEl) nameEl.textContent = extractFileName(url);
            }
            showToast(`File uploaded successfully: ${file.name}`);
        }
    } catch (err) {
        showToast(`Upload failed: ${err.message}`, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// PAGE-LEVEL SETTINGS SEPARATELY MODAL
// ══════════════════════════════════════════════════════════════

function openPageSettingsFromEditor() {
    if (!currentEditingPage) return;
    openPageSettingsModal(currentEditingPage.id);
}

async function openPageSettingsModal(pageId) {
    let page = (cachedData.allPages || []).find(p => p.id === pageId);
    if (!page) {
        try {
            const res = await apiRequest(`/api/v1/admin/pages/${pageId}`);
            page = res.page;
        } catch (e) {
            showToast('Unable to load page settings', 'error');
            return;
        }
    }

    const container = document.getElementById('modalContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="modal-backdrop" onclick="if(event.target === this) closeModal()">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2><i class="fas fa-sliders-h" style="color:var(--primary);"></i> Page Settings: ${escapeHtml(page.title)}</h2>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <div class="form-group">
                        <label><strong>Page Title *</strong></label>
                        <input type="text" id="pageSetTitle" class="form-control" value="${escapeHtml(page.title || '')}" required>
                    </div>

                    <div class="cms-field-row">
                        <div class="form-group">
                            <label><strong>URL Slug *</strong></label>
                            <input type="text" id="pageSetSlug" class="form-control" value="${escapeHtml(page.slug || '')}" ${page.slug === 'home' ? 'readonly' : ''} required>
                        </div>
                        <div class="form-group">
                            <label><strong>Main Menu Category *</strong></label>
                            <select id="pageSetMenuGroup" class="form-control">
                                <option value="Home" ${page.menu_group === 'Home' ? 'selected' : ''}>Home</option>
                                <option value="About" ${page.menu_group === 'About' ? 'selected' : ''}>About</option>
                                <option value="Academics" ${page.menu_group === 'Academics' ? 'selected' : ''}>Academics</option>
                                <option value="Departments" ${page.menu_group === 'Departments' ? 'selected' : ''}>Departments</option>
                                <option value="Placements" ${page.menu_group === 'Placements' ? 'selected' : ''}>Placements</option>
                                <option value="Admissions" ${page.menu_group === 'Admissions' ? 'selected' : ''}>Admissions</option>
                                <option value="Contact" ${page.menu_group === 'Contact' ? 'selected' : ''}>Contact</option>
                            </select>
                        </div>
                    </div>

                    <div class="cms-field-row">
                        <div class="form-group">
                            <label><strong>Page Template</strong></label>
                            <select id="pageSetTemplate" class="form-control">
                                <option value="standard" ${page.template === 'standard' ? 'selected' : ''}>Standard Page</option>
                                <option value="homepage" ${page.template === 'homepage' ? 'selected' : ''}>Homepage</option>
                                <option value="about" ${page.template === 'about' ? 'selected' : ''}>About College</option>
                                <option value="department" ${page.template === 'department' ? 'selected' : ''}>Academic Department</option>
                                <option value="admissions" ${page.template === 'admissions' ? 'selected' : ''}>Admissions</option>
                                <option value="academics" ${page.template === 'academics' ? 'selected' : ''}>Academics</option>
                                <option value="placements" ${page.template === 'placements' ? 'selected' : ''}>Placements</option>
                                <option value="contact" ${page.template === 'contact' ? 'selected' : ''}>Contact Page</option>
                                <option value="announcements" ${page.template === 'announcements' ? 'selected' : ''}>Announcements</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label><strong>Sort Order Index</strong></label>
                            <input type="number" id="pageSetSortOrder" class="form-control" value="${page.sort_order || 0}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label><strong>Meta SEO Title</strong></label>
                        <input type="text" id="pageSetMetaTitle" class="form-control" value="${escapeHtml(page.meta_title || '')}" placeholder="Search engine result title">
                    </div>

                    <div class="form-group">
                        <label><strong>Meta SEO Description</strong></label>
                        <textarea id="pageSetMetaDesc" class="form-control" rows="3" placeholder="Summary for Google search and social snippets">${escapeHtml(page.meta_description || '')}</textarea>
                    </div>
                </div>

                <div class="modal-footer" style="padding: 14px 20px; background:#F8FAFC; border-top:1px solid var(--border-color); display:flex; justify-content:flex-end; gap:10px;">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="savePageSettings(${pageId})">
                        <i class="fas fa-save"></i> Save Page Settings
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function savePageSettings(pageId) {
    const title = (document.getElementById('pageSetTitle')?.value || '').trim();
    const slug = (document.getElementById('pageSetSlug')?.value || '').trim();
    const menu_group = document.getElementById('pageSetMenuGroup')?.value || 'About';
    const template = document.getElementById('pageSetTemplate')?.value || 'standard';
    const sort_order = parseInt(document.getElementById('pageSetSortOrder')?.value || '0', 10);
    const meta_title = (document.getElementById('pageSetMetaTitle')?.value || '').trim();
    const meta_description = (document.getElementById('pageSetMetaDesc')?.value || '').trim();

    if (!title) {
        showToast('Page title is required', 'error');
        return;
    }

    try {
        const res = await apiRequest(`/api/v1/admin/pages/${pageId}`, {
            method: 'PUT',
            body: JSON.stringify({
                title,
                slug,
                menu_group,
                template,
                sort_order,
                meta_title,
                meta_description
            })
        });

        if (res.success) {
            showToast('Page settings updated successfully.');
            closeModal();

            // If we are currently editing this page in workspace, update heading & menu pill
            if (currentEditingPage && currentEditingPage.id === pageId) {
                currentEditingPage.title = title;
                currentEditingPage.menu_group = menu_group;
                currentEditingPage.meta_title = meta_title;
                currentEditingPage.meta_description = meta_description;
                currentEditingPage.template = template;

                const headingEl = document.getElementById('editorPageHeading');
                const menuPillEl = document.getElementById('editorMenuGroupBadge');
                if (headingEl) headingEl.textContent = title;
                if (menuPillEl) menuPillEl.textContent = menu_group;
            }

            loadPages();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// DRAFT, PREVIEW & PUBLISH OPERATIONS
// ══════════════════════════════════════════════════════════════

function collectEditorPayload() {
    return {
        title: currentEditingPage.title,
        slug: currentEditingPage.slug,
        template: currentEditingPage.template || 'standard',
        meta_title: currentEditingPage.meta_title || '',
        meta_description: currentEditingPage.meta_description || '',
        sort_order: currentEditingPage.sort_order || 0,
        sections: currentEditorSections
    };
}

async function savePageDraft(showFeedback = true) {
    if (!currentEditingPage) return;
    const payload = collectEditorPayload();

    try {
        const res = await apiRequest(`/api/v1/admin/pages/${currentEditingPage.id}/save-draft`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.success) {
            currentEditingPage.has_draft = 1;
            const badgeEl = document.getElementById('editorStatusBadge');
            if (badgeEl) {
                badgeEl.className = 'badge badge-draft';
                badgeEl.innerHTML = '<i class="fas fa-file-signature"></i> Draft Saved (Unpublished)';
            }
            if (showFeedback) showToast('Draft saved successfully! Live public website remains unchanged.');
        }
    } catch (err) {
        showToast(`Failed to save draft: ${err.message}`, 'error');
    }
}

async function publishPageFromEditor() {
    if (!currentEditingPage) return;
    if (!confirm(`Are you ready to publish changes for "${currentEditingPage.title}" to the live public website?`)) return;

    const payload = collectEditorPayload();

    try {
        showToast('Publishing changes to public website...', 'info');
        const res = await apiRequest(`/api/v1/admin/pages/${currentEditingPage.id}/publish`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.success) {
            currentEditingPage.has_draft = 0;
            currentEditingPage.status = 'published';
            const badgeEl = document.getElementById('editorStatusBadge');
            if (badgeEl) {
                badgeEl.className = 'badge badge-published';
                badgeEl.innerHTML = '<i class="fas fa-check-circle"></i> Published Live';
            }
            showToast('Page published successfully! Public website is now updated with your changes.');
        }
    } catch (err) {
        showToast(`Publish failed: ${err.message}`, 'error');
    }
}

async function quickPublishPage(pageId, pageTitle) {
    if (!confirm(`Publish all saved draft changes for "${pageTitle}" to the public website now?`)) return;

    try {
        showToast('Publishing page...', 'info');
        const res = await apiRequest(`/api/v1/admin/pages/${pageId}/publish`, {
            method: 'POST',
            body: JSON.stringify({})
        });

        if (res.success) {
            showToast(`Page "${pageTitle}" published successfully!`);
            loadPages();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// INTERACTIVE PREVIEW MODAL
// ══════════════════════════════════════════════════════════════

async function openPagePreview() {
    if (!currentEditingPage) return;
    // Auto save draft first so preview renders latest edits
    await savePageDraft(false);
    showPreviewModal(currentEditingPage.id, currentEditingPage.title);
}

function openPagePreviewById(pageId) {
    const page = (cachedData.allPages || []).find(p => p.id === pageId);
    showPreviewModal(pageId, page ? page.title : 'Page');
}

function showPreviewModal(pageId, title) {
    const container = document.getElementById('modalContainer');
    if (!container) return;

    const previewUrl = `/api/v1/admin/pages/${pageId}/preview`;

    container.innerHTML = `
        <div class="modal-backdrop" onclick="if(event.target === this) closeModal()">
            <div class="modal-content cms-preview-dialog">
                <!-- PREVIEW TOPBAR -->
                <div class="cms-preview-header-bar">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="font-weight:700; font-size:14px;"><i class="fas fa-eye" style="color:var(--gold);"></i> Preview: ${escapeHtml(title)}</span>
                        <div class="cms-device-toggle">
                            <button type="button" class="cms-device-btn active" id="btnDeviceDesktop" onclick="setPreviewDevice('desktop')">
                                <i class="fas fa-desktop"></i> Desktop
                            </button>
                            <button type="button" class="cms-device-btn" id="btnDeviceTablet" onclick="setPreviewDevice('tablet')">
                                <i class="fas fa-tablet-alt"></i> Tablet
                            </button>
                            <button type="button" class="cms-device-btn" id="btnDeviceMobile" onclick="setPreviewDevice('mobile')">
                                <i class="fas fa-mobile-alt"></i> Mobile
                            </button>
                        </div>
                    </div>

                    <div style="display:flex; align-items:center; gap:10px;">
                        <a href="${previewUrl}" target="_blank" class="btn btn-secondary btn-sm" style="color:#fff; background:rgba(255,255,255,0.15); border:none;" title="Open preview in new tab">
                            <i class="fas fa-external-link-alt"></i> New Tab
                        </a>
                        <button type="button" class="btn btn-success btn-sm" onclick="closeModal(); quickPublishPage(${pageId}, '${escapeHtml(title)}');">
                            <i class="fas fa-paper-plane"></i> Publish Live
                        </button>
                        <button type="button" class="close-btn" onclick="closeModal()" style="color:#fff; font-size:24px; background:none; border:none; cursor:pointer;">&times;</button>
                    </div>
                </div>

                <!-- PREVIEW FRAME -->
                <div class="cms-preview-frame-wrap">
                    <iframe id="cmsPreviewIframe" src="${previewUrl}" class="cms-preview-frame"></iframe>
                </div>
            </div>
        </div>
    `;
}

function setPreviewDevice(device) {
    const iframe = document.getElementById('cmsPreviewIframe');
    const btnDesktop = document.getElementById('btnDeviceDesktop');
    const btnTablet = document.getElementById('btnDeviceTablet');
    const btnMobile = document.getElementById('btnDeviceMobile');
    if (!iframe) return;

    if (btnDesktop) btnDesktop.classList.toggle('active', device === 'desktop');
    if (btnTablet) btnTablet.classList.toggle('active', device === 'tablet');
    if (btnMobile) btnMobile.classList.toggle('active', device === 'mobile');

    iframe.className = 'cms-preview-frame';
    if (device === 'tablet') iframe.classList.add('device-tablet');
    if (device === 'mobile') iframe.classList.add('device-mobile');
}

function openCreatePageModal(page = null) {
    const isEdit = !!page;
    const title = isEdit ? 'Edit Page Details' : 'Create New Page';
    const formHtml = `
        <form id="pageForm" onsubmit="savePage(event, ${isEdit ? page.id : 'null'})">
            <div class="form-group">
                <label>Page Title *</label>
                <input type="text" id="pageTitleInput" class="form-control" value="${isEdit ? escapeHtml(page.title) : ''}" required>
            </div>
            <div class="form-group">
                <label>URL Slug (e.g. computer-science)</label>
                <input type="text" id="pageSlugInput" class="form-control" value="${isEdit ? escapeHtml(page.slug) : ''}" ${isEdit && page.slug === 'home' ? 'readonly' : ''} placeholder="Leave blank to auto-generate">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Publish Status</label>
                    <select id="pageStatusInput" class="form-control">
                        <option value="published" ${isEdit && page.status === 'published' ? 'selected' : ''}>Published</option>
                        <option value="draft" ${isEdit && page.status === 'draft' ? 'selected' : ''}>Draft (Hidden)</option>
                        <option value="archived" ${isEdit && page.status === 'archived' ? 'selected' : ''}>Archived</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Page Template</label>
                    <select id="pageTemplateInput" class="form-control">
                        <option value="standard" ${isEdit && page.template === 'standard' ? 'selected' : ''}>Standard</option>
                        <option value="homepage" ${isEdit && page.template === 'homepage' ? 'selected' : ''}>Homepage</option>
                        <option value="about" ${isEdit && page.template === 'about' ? 'selected' : ''}>About</option>
                        <option value="department" ${isEdit && page.template === 'department' ? 'selected' : ''}>Department</option>
                        <option value="admissions" ${isEdit && page.template === 'admissions' ? 'selected' : ''}>Admissions</option>
                        <option value="academics" ${isEdit && page.template === 'academics' ? 'selected' : ''}>Academics</option>
                        <option value="placements" ${isEdit && page.template === 'placements' ? 'selected' : ''}>Placements</option>
                        <option value="contact" ${isEdit && page.template === 'contact' ? 'selected' : ''}>Contact</option>
                        <option value="announcements" ${isEdit && page.template === 'announcements' ? 'selected' : ''}>Announcements</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Meta SEO Title</label>
                <input type="text" id="pageMetaTitle" class="form-control" value="${isEdit ? escapeHtml(page.meta_title || '') : ''}">
            </div>
            <div class="form-group">
                <label>Meta Description</label>
                <textarea id="pageMetaDesc" class="form-control" rows="2">${isEdit ? escapeHtml(page.meta_description || '') : ''}</textarea>
            </div>
            <div class="form-group">
                <label>Sort Order Index</label>
                <input type="number" id="pageSortOrder" class="form-control" value="${isEdit ? page.sort_order : '0'}">
            </div>
        </form>
    `;

    const footer = `
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('pageForm').requestSubmit()">Save Page</button>
    `;

    showModal(title, formHtml, footer);
}

async function savePage(e, id = null) {
    e.preventDefault();
    const payload = {
        title: document.getElementById('pageTitleInput').value.trim(),
        slug: document.getElementById('pageSlugInput').value.trim(),
        status: document.getElementById('pageStatusInput').value,
        template: document.getElementById('pageTemplateInput').value,
        meta_title: document.getElementById('pageMetaTitle').value.trim(),
        meta_description: document.getElementById('pageMetaDesc').value.trim(),
        sort_order: parseInt(document.getElementById('pageSortOrder').value || '0', 10)
    };

    try {
        const endpoint = id ? `/api/v1/admin/pages/${id}` : '/api/v1/admin/pages';
        const method = id ? 'PUT' : 'POST';
        const res = await apiRequest(endpoint, { method, body: JSON.stringify(payload) });

        if (res.success) {
            closeModal();
            showToast(res.message);
            loadPages();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deletePage(id, title) {
    if (!confirm(`Are you sure you want to delete page "${title}"? All associated content sections will also be removed.`)) return;

    try {
        const res = await apiRequest(`/api/v1/admin/pages/${id}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Page deleted');
            loadPages();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// NAVIGATION & MENUS
// ══════════════════════════════════════════════════════════════
async function loadNavigation() {
    try {
        const res = await apiRequest('/api/v1/admin/navigation');
        cachedData.navItems = res.items || [];
        const tbody = document.getElementById('navTableBody');

        if (cachedData.navItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No menu items.</td></tr>';
            return;
        }

        // Build item map for parent names
        const itemMap = new Map();
        cachedData.navItems.forEach(i => itemMap.set(i.id, i.title));

        tbody.innerHTML = cachedData.navItems.map(item => {
            const parentName = item.parent_id ? `↳ ${itemMap.get(item.parent_id) || 'Submenu'}` : 'Top Level Tab';
            const indent = item.parent_id ? 'padding-left: 28px;' : 'font-weight: 700;';
            return `
                <tr>
                    <td style="${indent}">
                        ${item.parent_id ? '└─ ' : ''}
                        <strong>${escapeHtml(item.title)}</strong>
                    </td>
                    <td><span style="font-size:12px; color:var(--text-muted);">${parentName}</span></td>
                    <td><code>${escapeHtml(item.url)}</code></td>
                    <td>
                        <button class="btn btn-sm ${item.is_visible ? 'btn-success' : 'btn-secondary'}" onclick="toggleNavVisibility(${item.id}, ${item.is_visible})" style="padding: 2px 8px; font-size: 11px;">
                            ${item.is_visible ? 'Visible' : 'Hidden'}
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="moveNavItem(${item.id}, -1)" title="Move Up"><i class="fas fa-arrow-up"></i></button>
                        <button class="btn btn-secondary btn-sm" onclick="moveNavItem(${item.id}, 1)" title="Move Down"><i class="fas fa-arrow-down"></i></button>
                    </td>
                    <td>
                        <button class="btn btn-secondary btn-sm" onclick="openCreateNavModal(${item.id})"><i class="fas fa-plus"></i> Sub</button>
                        <button class="btn btn-secondary btn-sm" onclick="editNavItem(${item.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="deleteNavItem(${item.id}, '${escapeHtml(item.title)}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openCreateNavModal(parentId = null, item = null) {
    const isEdit = !!item;
    const title = isEdit ? 'Edit Menu Item' : (parentId ? 'Add Submenu Item' : 'Add Top-Level Menu Tab');

    // Build parent options
    const parentOptions = cachedData.navItems ? cachedData.navItems.filter(i => !i.parent_id && (!isEdit || i.id !== item.id)).map(p => `
        <option value="${p.id}" ${(isEdit ? item.parent_id === p.id : parentId === p.id) ? 'selected' : ''}>${escapeHtml(p.title)}</option>
    `).join('') : '';

    const formHtml = `
        <form id="navForm" onsubmit="saveNavItem(event, ${isEdit ? item.id : 'null'})">
            <div class="form-group">
                <label>Menu Item Title *</label>
                <input type="text" id="navTitle" class="form-control" value="${isEdit ? escapeHtml(item.title) : ''}" required>
            </div>
            <div class="form-group">
                <label>Target URL / Route * (e.g. /about/ or /departments/)</label>
                <input type="text" id="navUrl" class="form-control" value="${isEdit ? escapeHtml(item.url) : '/'}" required>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Parent Menu</label>
                    <select id="navParentId" class="form-control">
                        <option value="">(None - Top Level Tab)</option>
                        ${parentOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Link Target</label>
                    <select id="navTarget" class="form-control">
                        <option value="_self" ${isEdit && item.target === '_self' ? 'selected' : ''}>Same Window (_self)</option>
                        <option value="_blank" ${isEdit && item.target === '_blank' ? 'selected' : ''}>New Tab (_blank)</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Visibility</label>
                <select id="navVisible" class="form-control">
                    <option value="1" ${!isEdit || item.is_visible ? 'selected' : ''}>Visible in Menu</option>
                    <option value="0" ${isEdit && !item.is_visible ? 'selected' : ''}>Hidden</option>
                </select>
            </div>
        </form>
    `;

    const footer = `
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('navForm').requestSubmit()">Save Item</button>
    `;

    showModal(title, formHtml, footer);
}

function editNavItem(id) {
    const item = cachedData.navItems.find(i => i.id === id);
    if (item) openCreateNavModal(null, item);
}

async function saveNavItem(e, id = null) {
    e.preventDefault();
    const payload = {
        title: document.getElementById('navTitle').value.trim(),
        url: document.getElementById('navUrl').value.trim(),
        parent_id: document.getElementById('navParentId').value || null,
        target: document.getElementById('navTarget').value,
        is_visible: document.getElementById('navVisible').value === '1'
    };

    try {
        const endpoint = id ? `/api/v1/admin/navigation/items/${id}` : '/api/v1/admin/navigation/items';
        const method = id ? 'PUT' : 'POST';
        const res = await apiRequest(endpoint, { method, body: JSON.stringify(payload) });

        if (res.success) {
            closeModal();
            showToast(res.message);
            loadNavigation();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function toggleNavVisibility(id, currentVisible) {
    try {
        const item = cachedData.navItems.find(i => i.id === id);
        if (!item) return;

        await apiRequest(`/api/v1/admin/navigation/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: item.title,
                url: item.url,
                parent_id: item.parent_id,
                target: item.target,
                is_visible: !currentVisible
            })
        });

        showToast(`Menu item ${!currentVisible ? 'visible' : 'hidden'}`);
        loadNavigation();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function moveNavItem(id, direction) {
    const items = [...cachedData.navItems];
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    // Swap sort orders
    const currentItem = items[index];
    const targetItem = items[targetIndex];

    const currentOrder = currentItem.sort_order;
    currentItem.sort_order = targetItem.sort_order;
    targetItem.sort_order = currentOrder;

    try {
        await apiRequest('/api/v1/admin/navigation/reorder', {
            method: 'POST',
            body: JSON.stringify({
                items: [
                    { id: currentItem.id, parent_id: currentItem.parent_id, sort_order: currentItem.sort_order },
                    { id: targetItem.id, parent_id: targetItem.parent_id, sort_order: targetItem.sort_order }
                ]
            })
        });
        loadNavigation();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteNavItem(id, title) {
    if (!confirm(`Delete menu item "${title}" and all nested sub-items?`)) return;

    try {
        const res = await apiRequest(`/api/v1/admin/navigation/items/${id}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Menu item deleted');
            loadNavigation();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// CONTENT SECTIONS (Hero, Why RITW, Counters, Testimonials)
// ══════════════════════════════════════════════════════════════
async function loadSections() {
    try {
        const filterType = document.getElementById('sectionFilterType')?.value || '';
        const endpoint = filterType ? `/api/v1/admin/sections?section_type=${filterType}` : '/api/v1/admin/sections';
        const res = await apiRequest(endpoint);
        cachedData.sections = res.sections || [];
        const tbody = document.getElementById('sectionsTableBody');

        if (cachedData.sections.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No sections found.</td></tr>';
            return;
        }

        tbody.innerHTML = cachedData.sections.map(s => `
            <tr>
                <td>
                    <strong>${escapeHtml(s.title || s.section_key)}</strong>
                    <div style="font-size: 11.5px; color: var(--text-muted);">${escapeHtml(s.subtitle || '')}</div>
                </td>
                <td><span class="badge" style="background:#E2E8F0; color:#1E1E2F;">${s.section_type}</span></td>
                <td>${s.page_title ? escapeHtml(s.page_title) : '<span style="color:var(--secondary);">Homepage</span>'}</td>
                <td>${s.button_url ? `<code>${escapeHtml(s.button_url)}</code>` : '—'}</td>
                <td>
                    <span class="badge ${s.is_visible ? 'badge-published' : 'badge-draft'}">
                        ${s.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="moveSection(${s.id}, -1)"><i class="fas fa-arrow-up"></i></button>
                    <button class="btn btn-secondary btn-sm" onclick="moveSection(${s.id}, 1)"><i class="fas fa-arrow-down"></i></button>
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="editSection(${s.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSection(${s.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openCreateSectionModal(sec = null) {
    const isEdit = !!sec;
    const title = isEdit ? 'Edit Content Section' : 'Add Content Section';

    const pagesOptions = cachedData.pages ? cachedData.pages.map(p => `
        <option value="${p.id}" ${isEdit && sec.page_id === p.id ? 'selected' : ''}>${escapeHtml(p.title)}</option>
    `).join('') : '';

    const formHtml = `
        <form id="sectionForm" onsubmit="saveSection(event, ${isEdit ? sec.id : 'null'})">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Section Type *</label>
                    <select id="secType" class="form-control" required>
                        <option value="hero_slide" ${isEdit && sec.section_type === 'hero_slide' ? 'selected' : ''}>Hero Slider</option>
                        <option value="why_ritw" ${isEdit && sec.section_type === 'why_ritw' ? 'selected' : ''}>Why RITW Card</option>
                        <option value="counter" ${isEdit && sec.section_type === 'counter' ? 'selected' : ''}>Stats Counter</option>
                        <option value="testimonial" ${isEdit && sec.section_type === 'testimonial' ? 'selected' : ''}>Testimonial</option>
                        <option value="spotlight" ${isEdit && sec.section_type === 'spotlight' ? 'selected' : ''}>Campus Spotlight</option>
                        <option value="standard" ${isEdit && sec.section_type === 'standard' ? 'selected' : ''}>Standard Block</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Target Page (Empty for Homepage)</label>
                    <select id="secPageId" class="form-control">
                        <option value="">Homepage (Global)</option>
                        ${pagesOptions}
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Section Title *</label>
                <input type="text" id="secTitle" class="form-control" value="${isEdit ? escapeHtml(sec.title || '') : ''}" required>
            </div>
            <div class="form-group">
                <label>Subtitle / Tagline</label>
                <input type="text" id="secSubtitle" class="form-control" value="${isEdit ? escapeHtml(sec.subtitle || '') : ''}">
            </div>
            <div class="form-group">
                <label>Content Text / HTML Description</label>
                <textarea id="secContent" class="form-control" rows="3">${isEdit ? escapeHtml(sec.content_html || '') : ''}</textarea>
            </div>
            <div class="form-group">
                <label>Image URL (or select from Media Library)</label>
                <input type="text" id="secImage" class="form-control" value="${isEdit ? escapeHtml(sec.image_url || '') : ''}">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Button Text</label>
                    <input type="text" id="secBtnText" class="form-control" value="${isEdit ? escapeHtml(sec.button_text || '') : ''}">
                </div>
                <div class="form-group">
                    <label>Button Link URL</label>
                    <input type="text" id="secBtnUrl" class="form-control" value="${isEdit ? escapeHtml(sec.button_url || '') : ''}">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Sort Order</label>
                    <input type="number" id="secOrder" class="form-control" value="${isEdit ? sec.sort_order : '0'}">
                </div>
                <div class="form-group">
                    <label>Visibility</label>
                    <select id="secVisible" class="form-control">
                        <option value="1" ${!isEdit || sec.is_visible ? 'selected' : ''}>Visible</option>
                        <option value="0" ${isEdit && !sec.is_visible ? 'selected' : ''}>Hidden</option>
                    </select>
                </div>
            </div>
        </form>
    `;

    const footer = `
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('sectionForm').requestSubmit()">Save Section</button>
    `;

    showModal(title, formHtml, footer);
}

function editSection(id) {
    const sec = cachedData.sections.find(s => s.id === id);
    if (sec) openCreateSectionModal(sec);
}

async function saveSection(e, id = null) {
    e.preventDefault();
    const payload = {
        section_type: document.getElementById('secType').value,
        page_id: document.getElementById('secPageId').value || null,
        title: document.getElementById('secTitle').value.trim(),
        subtitle: document.getElementById('secSubtitle').value.trim(),
        content_html: document.getElementById('secContent').value,
        image_url: document.getElementById('secImage').value.trim(),
        button_text: document.getElementById('secBtnText').value.trim(),
        button_url: document.getElementById('secBtnUrl').value.trim(),
        sort_order: parseInt(document.getElementById('secOrder').value || '0', 10),
        is_visible: document.getElementById('secVisible').value === '1'
    };

    try {
        const endpoint = id ? `/api/v1/admin/sections/${id}` : '/api/v1/admin/sections';
        const method = id ? 'PUT' : 'POST';
        const res = await apiRequest(endpoint, { method, body: JSON.stringify(payload) });

        if (res.success) {
            closeModal();
            showToast(res.message);
            loadSections();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function moveSection(id, direction) {
    const items = [...cachedData.sections];
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const current = items[index];
    const target = items[targetIndex];

    const temp = current.sort_order;
    current.sort_order = target.sort_order;
    target.sort_order = temp;

    try {
        await apiRequest('/api/v1/admin/sections/reorder', {
            method: 'POST',
            body: JSON.stringify({
                items: [
                    { id: current.id, sort_order: current.sort_order },
                    { id: target.id, sort_order: target.sort_order }
                ]
            })
        });
        loadSections();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteSection(id) {
    if (!confirm('Are you sure you want to delete this content section?')) return;

    try {
        const res = await apiRequest(`/api/v1/admin/sections/${id}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Section deleted');
            loadSections();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// CUSTOM FIELDS
// ══════════════════════════════════════════════════════════════
async function loadCustomFields() {
    try {
        const res = await apiRequest('/api/v1/admin/custom-fields/definitions');
        cachedData.customFields = res.definitions || [];
        const tbody = document.getElementById('customFieldsTableBody');

        if (cachedData.customFields.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No custom fields defined yet.</td></tr>';
            return;
        }

        tbody.innerHTML = cachedData.customFields.map(cf => `
            <tr>
                <td><strong>${escapeHtml(cf.field_name)}</strong></td>
                <td><code>${escapeHtml(cf.field_key)}</code></td>
                <td><span class="badge" style="background:#ECEAF7; color:var(--primary);">${cf.field_type}</span></td>
                <td><span class="badge" style="background:#E2E8F0; color:#1E1E2F;">${cf.entity_type}</span></td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomField(${cf.id}, '${escapeHtml(cf.field_name)}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openCreateCustomFieldModal() {
    const formHtml = `
        <form id="cfForm" onsubmit="saveCustomField(event)">
            <div class="form-group">
                <label>Field Display Name * (e.g. HOD Profile Image)</label>
                <input type="text" id="cfName" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Field Key * (e.g. hod_image)</label>
                <input type="text" id="cfKey" class="form-control" required placeholder="lowercase_with_underscores">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Data Type *</label>
                    <select id="cfType" class="form-control" required>
                        <option value="text">Single Line Text</option>
                        <option value="textarea">Multi-line Textarea</option>
                        <option value="rich_text">Rich Text HTML</option>
                        <option value="image">Image URL</option>
                        <option value="url">Web URL</option>
                        <option value="date">Calendar Date</option>
                        <option value="number">Numeric Value</option>
                        <option value="boolean">Boolean (True/False)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Attach To Entity</label>
                    <select id="cfEntity" class="form-control" required>
                        <option value="page">Page</option>
                        <option value="section">Section</option>
                    </select>
                </div>
            </div>
        </form>
    `;

    const footer = `
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('cfForm').requestSubmit()">Create Field Definition</button>
    `;

    showModal('Define New Custom Field', formHtml, footer);
}

async function saveCustomField(e) {
    e.preventDefault();
    const payload = {
        field_name: document.getElementById('cfName').value.trim(),
        field_key: document.getElementById('cfKey').value.trim(),
        field_type: document.getElementById('cfType').value,
        entity_type: document.getElementById('cfEntity').value
    };

    try {
        const res = await apiRequest('/api/v1/admin/custom-fields/definitions', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.success) {
            closeModal();
            showToast(res.message);
            loadCustomFields();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteCustomField(id, name) {
    if (!confirm(`Remove field definition "${name}"? Existing values stored under this key will be deleted.`)) return;

    try {
        const res = await apiRequest(`/api/v1/admin/custom-fields/definitions/${id}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Field definition removed');
            loadCustomFields();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// MEDIA LIBRARY
// ══════════════════════════════════════════════════════════════
async function loadMedia() {
    try {
        const search = document.getElementById('mediaSearchInput')?.value.trim() || '';
        const endpoint = search ? `/api/v1/admin/media?search=${encodeURIComponent(search)}` : '/api/v1/admin/media';
        const res = await apiRequest(endpoint);
        cachedData.media = res.items || [];
        const grid = document.getElementById('mediaGrid');

        if (cachedData.media.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 40px; color:var(--text-muted);">No media uploaded yet. Click upload above to add images or PDFs.</div>';
            return;
        }

        grid.innerHTML = cachedData.media.map(item => {
            const isImage = item.mime_type.startsWith('image/');
            const preview = isImage 
                ? `<img src="${item.public_url}" alt="${escapeHtml(item.alt_text || item.original_name)}" loading="lazy">`
                : `<i class="fas fa-file-pdf" style="font-size: 42px; color: #DC2626;"></i>`;

            return `
                <div class="media-item">
                    <div class="media-preview">${preview}</div>
                    <div class="media-details">
                        <div class="filename" title="${escapeHtml(item.original_name)}">${escapeHtml(item.original_name)}</div>
                        <div>${(item.file_size / 1024).toFixed(1)} KB</div>
                    </div>
                    <div style="padding: 6px 10px; display: flex; gap: 6px; border-top: 1px solid var(--border-color); background: #FAFAFC;">
                        <button class="btn btn-secondary btn-sm" onclick="copyMediaLink('${item.public_url}')" title="Copy URL" style="flex:1; padding: 4px;">
                            <i class="fas fa-link"></i> Copy
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteMedia(${item.id})" title="Delete" style="padding: 4px 8px;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', file.name);

    try {
        showToast('Uploading media asset...', 'info');
        const res = await apiRequest('/api/v1/admin/media/upload', {
            method: 'POST',
            body: formData
        });

        if (res.success) {
            showToast('Asset uploaded successfully');
            loadMedia();
        }
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        e.target.value = '';
    }
}

function copyMediaLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        showToast('Media public URL copied to clipboard!');
    }).catch(() => {
        prompt('Copy media URL:', url);
    });
}

async function deleteMedia(id) {
    if (!confirm('Permanently delete this media asset?')) return;

    try {
        const res = await apiRequest(`/api/v1/admin/media/${id}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Asset removed');
            loadMedia();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// DOCUMENT MANAGER (PDFs & STATUTORY CERTIFICATES)
// ══════════════════════════════════════════════════════════════
async function loadDocuments() {
    try {
        const search = document.getElementById('docSearchInput')?.value.trim() || '';
        const category = document.getElementById('docCategoryFilter')?.value || '';
        let queryParams = [];
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        if (category) queryParams.push(`category=${encodeURIComponent(category)}`);

        const endpoint = queryParams.length > 0 
            ? `/api/v1/admin/documents?${queryParams.join('&')}` 
            : '/api/v1/admin/documents';

        const res = await apiRequest(endpoint);
        cachedData.documents = res.documents || [];
        const tbody = document.getElementById('documentsTableBody');

        if (!tbody) return;

        if (cachedData.documents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color:var(--text-muted);">No documents found matching filters.</td></tr>';
            return;
        }

        tbody.innerHTML = cachedData.documents.map(doc => {
            const badgeClass = doc.is_statutory ? 'badge-statutory' : 'badge-doc';
            return `
                <tr>
                    <td>
                        <div style="font-weight:600; color:var(--text-main); display:flex; align-items:center; gap:8px;">
                            <i class="fas fa-file-pdf" style="color:#DC2626;"></i>
                            ${escapeHtml(doc.title)}
                        </div>
                    </td>
                    <td><span class="${badgeClass}">${escapeHtml(doc.category)}</span></td>
                    <td>${escapeHtml(doc.issuer || 'RITW College')}</td>
                    <td>${escapeHtml(doc.academic_year || 'Current')}</td>
                    <td><span class="badge" style="background:#ECFDF5; color:#065F46; font-size:11px;">${escapeHtml(doc.status || 'Active')}</span></td>
                    <td>
                        <a href="${escapeHtml(doc.file_url)}" target="_blank" class="btn btn-secondary btn-sm" style="padding:4px 8px;" title="View Document">
                            <i class="fas fa-external-link-alt"></i> View / Download
                        </a>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function handleDocUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
        showToast('Only PDF documents are supported for upload in Document Manager.', 'error');
        e.target.value = '';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''));

    try {
        showToast('Uploading institutional document...', 'info');
        const res = await apiRequest('/api/v1/admin/media/upload', {
            method: 'POST',
            body: formData
        });

        if (res.success) {
            showToast('Document uploaded successfully!');
            loadDocuments();
            loadDashboardOverview();
        }
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        e.target.value = '';
    }
}

// ══════════════════════════════════════════════════════════════
// DEPARTMENTS & ACADEMICS
// ══════════════════════════════════════════════════════════════
async function loadDepartments() {
    try {
        const res = await apiRequest('/api/v1/admin/departments');
        cachedData.departments = res.departments || [];
        const container = document.getElementById('departmentsGrid');

        if (!container) return;

        container.innerHTML = cachedData.departments.map(dept => `
            <div class="dept-card">
                <div class="dept-header">
                    <span class="dept-badge">${escapeHtml(dept.code)}</span>
                    <span class="badge" style="background:#ECFDF5; color:#065F46; font-size:11px;">${escapeHtml(dept.accreditation)}</span>
                </div>
                <div class="dept-title">${escapeHtml(dept.name)}</div>
                <div class="dept-meta">
                    <strong>Degree:</strong> ${escapeHtml(dept.degree)}<br>
                    <strong>Intake:</strong> ${dept.intake} Students / Year<br>
                    <strong>Head of Dept:</strong> ${escapeHtml(dept.hod)}<br>
                    <strong>Contact:</strong> <code>${escapeHtml(dept.email)}</code>
                </div>
                <div class="dept-labs">
                    <strong>Key Laboratories:</strong>
                    <ul>
                        ${dept.labs.map(lab => `<li>${escapeHtml(lab)}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// ADMISSIONS & PLACEMENTS
// ══════════════════════════════════════════════════════════════
async function loadAdmissionsPlacements() {
    try {
        const res = await apiRequest('/api/v1/admin/admissions-placements');
        if (!res.success) return;

        const { admissions, placements } = res;

        // Render Seat Matrix Table
        const matrixBody = document.getElementById('admissionsSeatMatrixBody');
        if (matrixBody && admissions.seat_matrix) {
            matrixBody.innerHTML = admissions.seat_matrix.map(row => {
                const convenor = Math.round(row.seats * 0.7);
                const management = row.seats - convenor;
                return `
                    <tr>
                        <td><strong>${escapeHtml(row.branch)}</strong></td>
                        <td><code>${escapeHtml(row.code)}</code></td>
                        <td><span class="badge" style="background:#ECEAF7; color:var(--primary); font-size:12px;">${row.seats} Seats</span></td>
                        <td>${convenor} Seats</td>
                        <td>${management} Seats</td>
                    </tr>
                `;
            }).join('');
        }

        // Render Recruiters Grid
        const recruitersGrid = document.getElementById('recruitersGrid');
        if (recruitersGrid && placements.top_recruiters) {
            recruitersGrid.innerHTML = placements.top_recruiters.map(rec => `
                <div style="background:#F8FAFC; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px; text-align:center;">
                    <div style="font-weight:700; color:var(--text-main); font-size:14px; margin-bottom:4px;">${escapeHtml(rec.name)}</div>
                    <div style="font-size:11.5px; color:var(--secondary); font-weight:600;">${escapeHtml(rec.type)}</div>
                    <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">${escapeHtml(rec.role)}</div>
                </div>
            `).join('');
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// ANNOUNCEMENTS & FLASH NEWS
// ══════════════════════════════════════════════════════════════
async function loadAnnouncements() {
    try {
        const res = await apiRequest('/api/v1/admin/announcements');
        cachedData.announcements = res.announcements || [];
        const tbody = document.getElementById('announcementsTableBody');

        if (cachedData.announcements.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No announcements published.</td></tr>';
            return;
        }

        tbody.innerHTML = cachedData.announcements.map(a => `
            <tr>
                <td><strong>${escapeHtml(a.title)}</strong></td>
                <td><span class="badge" style="background:${a.badge_color || '#159B62'}; color:#fff;">${escapeHtml(a.badge_text || 'NEW')}</span></td>
                <td><code>${escapeHtml(a.link_url || '—')}</code></td>
                <td><span style="font-size:12px; color:var(--text-muted);">${a.start_date || 'Immediate'} → ${a.end_date || 'Permanent'}</span></td>
                <td><span class="badge badge-${a.status}">${a.status}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="editAnnouncement(${a.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteAnnouncement(${a.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openCreateAnnouncementModal(ann = null) {
    const isEdit = !!ann;
    const title = isEdit ? 'Edit Announcement' : 'Post Announcement Notice';

    const formHtml = `
        <form id="annForm" onsubmit="saveAnnouncement(event, ${isEdit ? ann.id : 'null'})">
            <div class="form-group">
                <label>Announcement Title *</label>
                <input type="text" id="annTitle" class="form-control" value="${isEdit ? escapeHtml(ann.title) : ''}" required>
            </div>
            <div class="form-group">
                <label>Detailed Summary / Brief</label>
                <textarea id="annSummary" class="form-control" rows="2">${isEdit ? escapeHtml(ann.summary || '') : ''}</textarea>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Badge Text</label>
                    <input type="text" id="annBadgeText" class="form-control" value="${isEdit ? escapeHtml(ann.badge_text || 'NEW') : 'NEW'}">
                </div>
                <div class="form-group">
                    <label>Badge Color Hex</label>
                    <input type="text" id="annBadgeColor" class="form-control" value="${isEdit ? escapeHtml(ann.badge_color || '#159B62') : '#159B62'}">
                </div>
            </div>
            <div class="form-group">
                <label>Target URL Link (e.g. /admissions/ or /placements/)</label>
                <input type="text" id="annLink" class="form-control" value="${isEdit ? escapeHtml(ann.link_url || '') : ''}">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Schedule Start Date</label>
                    <input type="date" id="annStartDate" class="form-control" value="${isEdit ? (ann.start_date || '') : ''}">
                </div>
                <div class="form-group">
                    <label>Schedule End Date</label>
                    <input type="date" id="annEndDate" class="form-control" value="${isEdit ? (ann.end_date || '') : ''}">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Status</label>
                    <select id="annStatus" class="form-control">
                        <option value="published" ${isEdit && ann.status === 'published' ? 'selected' : ''}>Published</option>
                        <option value="draft" ${isEdit && ann.status === 'draft' ? 'selected' : ''}>Draft</option>
                        <option value="archived" ${isEdit && ann.status === 'archived' ? 'selected' : ''}>Archived</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Sort Order Index</label>
                    <input type="number" id="annOrder" class="form-control" value="${isEdit ? ann.sort_order : '0'}">
                </div>
            </div>
        </form>
    `;

    const footer = `
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('annForm').requestSubmit()">Publish Announcement</button>
    `;

    showModal(title, formHtml, footer);
}

function editAnnouncement(id) {
    const ann = cachedData.announcements.find(a => a.id === id);
    if (ann) openCreateAnnouncementModal(ann);
}

async function saveAnnouncement(e, id = null) {
    e.preventDefault();
    const payload = {
        title: document.getElementById('annTitle').value.trim(),
        summary: document.getElementById('annSummary').value.trim(),
        badge_text: document.getElementById('annBadgeText').value.trim(),
        badge_color: document.getElementById('annBadgeColor').value.trim(),
        link_url: document.getElementById('annLink').value.trim(),
        start_date: document.getElementById('annStartDate').value || null,
        end_date: document.getElementById('annEndDate').value || null,
        status: document.getElementById('annStatus').value,
        sort_order: parseInt(document.getElementById('annOrder').value || '0', 10)
    };

    try {
        const endpoint = id ? `/api/v1/admin/announcements/${id}` : '/api/v1/admin/announcements';
        const method = id ? 'PUT' : 'POST';
        const res = await apiRequest(endpoint, { method, body: JSON.stringify(payload) });

        if (res.success) {
            closeModal();
            showToast(res.message);
            loadAnnouncements();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteAnnouncement(id) {
    if (!confirm('Delete this announcement?')) return;

    try {
        const res = await apiRequest(`/api/v1/admin/announcements/${id}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Announcement deleted');
            loadAnnouncements();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// COLLEGE SETTINGS
// ══════════════════════════════════════════════════════════════
async function loadCollegeSettings() {
    try {
        const res = await apiRequest('/api/v1/admin/settings');
        const settings = res.settings || {};

        const contact = settings.contact || {};
        document.getElementById('settingPhonePrimary').value = contact.phone_primary || '';
        document.getElementById('settingPhoneSecondary').value = contact.phone_secondary || '';
        document.getElementById('settingEmailPrimary').value = contact.email_primary || '';
        document.getElementById('settingEmailAdmissions').value = contact.email_admissions || '';
        document.getElementById('settingAddress').value = contact.address || '';
        document.getElementById('settingMapLink').value = contact.google_map_embed || '';

        const social = settings.social || {};
        document.getElementById('settingFb').value = social.facebook || '';
        document.getElementById('settingIg').value = social.instagram || '';
        document.getElementById('settingWa').value = social.whatsapp || '';
        document.getElementById('settingYt').value = social.youtube || '';
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function saveCollegeSettings(e) {
    e.preventDefault();

    const contactPayload = {
        phone_primary: document.getElementById('settingPhonePrimary').value.trim(),
        phone_secondary: document.getElementById('settingPhoneSecondary').value.trim(),
        email_primary: document.getElementById('settingEmailPrimary').value.trim(),
        email_admissions: document.getElementById('settingEmailAdmissions').value.trim(),
        address: document.getElementById('settingAddress').value.trim(),
        google_map_embed: document.getElementById('settingMapLink').value.trim()
    };

    const socialPayload = {
        facebook: document.getElementById('settingFb').value.trim(),
        instagram: document.getElementById('settingIg').value.trim(),
        whatsapp: document.getElementById('settingWa').value.trim(),
        youtube: document.getElementById('settingYt').value.trim()
    };

    try {
        await Promise.all([
            apiRequest('/api/v1/admin/settings/contact', { method: 'PUT', body: JSON.stringify({ value: contactPayload }) }),
            apiRequest('/api/v1/admin/settings/social', { method: 'PUT', body: JSON.stringify({ value: socialPayload }) })
        ]);

        showToast('College settings saved successfully');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// ADMISSION LEADS / ENQUIRIES
// ══════════════════════════════════════════════════════════════
async function loadEnquiries() {
    try {
        const statusFilter = document.getElementById('enquiryStatusFilter')?.value || '';
        const res = await apiRequest('/api/v1/admin/enquiries');
        let enquiries = res.enquiries || [];
        const tbody = document.getElementById('enquiriesTableBody');

        if (!tbody) return;

        if (statusFilter) {
            enquiries = enquiries.filter(e => e.status === statusFilter);
        }

        if (enquiries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 24px; color:var(--text-muted);">No admission enquiries found.</td></tr>';
            return;
        }

        tbody.innerHTML = enquiries.map(e => {
            const cleanPhone = (e.phone || '').replace(/[^0-9]/g, '');
            const waUrl = cleanPhone ? `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(e.full_name)},%20thank%20you%20for%20contacting%20RITW%20Engineering%20College.` : '#';
            return `
                <tr>
                    <td><span style="font-size:12px; color:var(--text-muted);">${new Date(e.created_at).toLocaleDateString()}</span></td>
                    <td><strong>${escapeHtml(e.full_name)}</strong></td>
                    <td><a href="mailto:${escapeHtml(e.email)}" style="color:var(--primary); font-size:13px;">${escapeHtml(e.email)}</a></td>
                    <td><a href="tel:${escapeHtml(e.phone)}" style="font-weight:600; color:var(--text-main); font-size:13px;">${escapeHtml(e.phone)}</a></td>
                    <td><span class="badge" style="background:#ECEAF7; color:var(--primary); font-size:11px;">${escapeHtml(e.course_interested || 'General')}</span></td>
                    <td><span style="font-size:12px; color:var(--text-muted); max-width:200px; display:inline-block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(e.message || '—')}</span></td>
                    <td>
                        <select class="form-control" style="padding: 4px 8px; font-size: 11.5px; width: 105px;" onchange="updateEnquiryStatus(${e.id}, this.value)">
                            <option value="new" ${e.status === 'new' ? 'selected' : ''}>New</option>
                            <option value="contacted" ${e.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                            <option value="closed" ${e.status === 'closed' ? 'selected' : ''}>Closed</option>
                        </select>
                    </td>
                    <td>
                        ${cleanPhone ? `
                            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-success btn-sm" style="padding:4px 8px; font-size:11.5px;" title="Chat on WhatsApp">
                                <i class="fab fa-whatsapp"></i> Chat
                            </a>
                        ` : '—'}
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function updateEnquiryStatus(id, newStatus) {
    try {
        await apiRequest(`/api/v1/admin/enquiries/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });
        showToast('Status updated');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ══════════════════════════════════════════════════════════════
// SECURITY & PASSWORD UPDATE
// ══════════════════════════════════════════════════════════════
async function handleChangePassword(e) {
    e.preventDefault();
    const old_password = document.getElementById('oldPassword').value;
    const new_password = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmNewPassword').value;

    if (new_password !== confirm) {
        showToast('New passwords do not match.', 'error');
        return;
    }

    try {
        const res = await apiRequest('/api/v1/admin/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ old_password, new_password })
        });

        if (res.success) {
            showToast(res.message);
            document.getElementById('changePasswordForm').reset();
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// Quick Add Action
function showQuickAddModal() {
    const html = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <button class="btn btn-secondary" onclick="closeModal(); openCreatePageModal();" style="padding: 16px; flex-direction: column;">
                <i class="fas fa-file-alt" style="font-size: 22px; color: var(--primary); margin-bottom: 6px;"></i>
                New Page
            </button>
            <button class="btn btn-secondary" onclick="closeModal(); openCreateNavModal();" style="padding: 16px; flex-direction: column;">
                <i class="fas fa-sitemap" style="font-size: 22px; color: var(--secondary); margin-bottom: 6px;"></i>
                New Menu Item
            </button>
            <button class="btn btn-secondary" onclick="closeModal(); openCreateSectionModal();" style="padding: 16px; flex-direction: column;">
                <i class="fas fa-layer-group" style="font-size: 22px; color: var(--gold); margin-bottom: 6px;"></i>
                New Section
            </button>
            <button class="btn btn-secondary" onclick="closeModal(); openCreateAnnouncementModal();" style="padding: 16px; flex-direction: column;">
                <i class="fas fa-bullhorn" style="font-size: 22px; color: var(--info); margin-bottom: 6px;"></i>
                New Notice
            </button>
        </div>
    `;
    showModal('Select Quick Action', html);
}

// Security HTML escaper
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', checkAuthSession);
