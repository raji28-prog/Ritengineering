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
        const res = await fetch(endpoint, { credentials: 'same-origin', ...options, credentials: 'same-origin', headers });
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
    document.getElementById('modalContainer').innerHTML = '';
}

// ══════════════════════════════════════════════════════════════
// AUTHENTICATION
// ══════════════════════════════════════════════════════════════
async function checkAuthSession() {
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
    document.getElementById('loginView').style.display = 'flex';
    document.getElementById('dashboardView').style.display = 'none';
}

function showDashboardScreen() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('dashboardView').style.display = 'flex';

    if (currentUser) {
        document.getElementById('sidebarUsername').textContent = currentUser.username;
        document.getElementById('sidebarAvatar').textContent = currentUser.username.charAt(0).toUpperCase();
    }

    switchTab('dashboard');
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
            alertBox.textContent = data.message || 'Login failed. Please check your credentials.';
            alertBox.style.display = 'flex';
        }
    } catch (err) {
        alertBox.textContent = 'Server connection error. Please ensure server is running.';
        alertBox.style.display = 'flex';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Secure Sign In';
    }
}

async function handleLogout() {
    try {
        await apiRequest('/api/v1/admin/auth/logout', { method: 'POST' });
    } catch (e) {}

    authToken = null;
    localStorage.removeItem('ritw_admin_token');
    currentUser = null;
    showLoginScreen();
    showToast('Logged out securely');
}

function handleSessionExpired() {
    authToken = null;
    localStorage.removeItem('ritw_admin_token');
    currentUser = null;
    showLoginScreen();
    showToast('Your session has expired. Please sign in again.', 'error');
}

// ══════════════════════════════════════════════════════════════
// TAB SWITCHING
// ══════════════════════════════════════════════════════════════
function switchTab(tabName) {
    currentTab = tabName;

    // Update sidebar active class
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(tabName)) {
            link.classList.add('active');
        }
    });

    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => pane.style.display = 'none');

    // Show target tab
    const targetPane = document.getElementById(`tab-${tabName}`);
    if (targetPane) targetPane.style.display = 'block';

    // Update topbar title
    const titles = {
        dashboard: 'Dashboard Overview',
        pages: 'Pages Management',
        navigation: 'Header Mega-Menu & Submenus',
        sections: 'Homepage & Reusable Sections',
        customFields: 'Custom Field Definitions',
        media: 'Media Asset Library',
        announcements: 'Flash News & Announcements',
        settings: 'College Settings & Features',
        enquiries: 'Student Admission Leads',
        security: 'Security & Change Password'
    };
    document.getElementById('pageTitle').textContent = titles[tabName] || 'Management Console';

    // Load data for active tab
    if (tabName === 'dashboard') loadDashboardOverview();
    else if (tabName === 'pages') loadPages();
    else if (tabName === 'navigation') loadNavigation();
    else if (tabName === 'sections') loadSections();
    else if (tabName === 'customFields') loadCustomFields();
    else if (tabName === 'media') loadMedia();
    else if (tabName === 'announcements') loadAnnouncements();
    else if (tabName === 'settings') loadCollegeSettings();
    else if (tabName === 'enquiries') loadEnquiries();
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD OVERVIEW
// ══════════════════════════════════════════════════════════════
async function loadDashboardOverview() {
    try {
        const [pagesRes, navRes, newsRes, enqRes, logsRes] = await Promise.all([
            apiRequest('/api/v1/admin/pages'),
            apiRequest('/api/v1/admin/navigation'),
            apiRequest('/api/v1/admin/announcements'),
            apiRequest('/api/v1/admin/enquiries'),
            apiRequest('/api/v1/admin/audit-logs')
        ]);

        document.getElementById('statPages').textContent = pagesRes.pages ? pagesRes.pages.length : 0;
        document.getElementById('statMenuItems').textContent = navRes.items ? navRes.items.length : 0;
        document.getElementById('statNews').textContent = newsRes.announcements ? newsRes.announcements.length : 0;
        document.getElementById('statEnquiries').textContent = enqRes.enquiries ? enqRes.enquiries.length : 0;

        // Render audit logs
        const logsBody = document.getElementById('auditLogsBody');
        if (logsRes.logs && logsRes.logs.length > 0) {
            logsBody.innerHTML = logsRes.logs.slice(0, 10).map(log => `
                <tr>
                    <td>${new Date(log.created_at).toLocaleString()}</td>
                    <td><strong>${log.action}</strong></td>
                    <td>${log.entity_type || '—'}</td>
                    <td>${log.details || '—'}</td>
                    <td><code>${log.ip_address}</code></td>
                </tr>
            `).join('');
        } else {
            logsBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #8E8EA6;">No recent activity logs.</td></tr>';
        }
    } catch (err) {
        console.error('Error loading dashboard stats:', err);
    }
}

// ══════════════════════════════════════════════════════════════
// PAGES MANAGER
// ══════════════════════════════════════════════════════════════
async function loadPages() {
    try {
        const res = await apiRequest('/api/v1/admin/pages');
        cachedData.pages = res.pages || [];
        const tbody = document.getElementById('pagesTableBody');

        if (cachedData.pages.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No pages found.</td></tr>';
            return;
        }

        tbody.innerHTML = cachedData.pages.map(page => `
            <tr>
                <td><strong>${escapeHtml(page.title)}</strong></td>
                <td><code>/${page.slug}/</code></td>
                <td><span class="badge badge-${page.status}">${page.status}</span></td>
                <td><span style="font-size:12px; color:var(--text-muted);">${page.template}</span></td>
                <td><span class="badge" style="background:#ECEAF7; color:var(--primary);">${page.section_count} sections</span></td>
                <td>${page.sort_order}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="editPage(${page.id})"><i class="fas fa-edit"></i> Edit</button>
                    ${page.slug !== 'home' ? `
                        <button class="btn btn-danger btn-sm" onclick="deletePage(${page.id}, '${escapeHtml(page.title)}')"><i class="fas fa-trash"></i></button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function openCreatePageModal(page = null) {
    const isEdit = !!page;
    const title = isEdit ? 'Edit Page' : 'Create New Page';
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
                        <option value="department" ${isEdit && page.template === 'department' ? 'selected' : ''}>Department</option>
                        <option value="admissions" ${isEdit && page.template === 'admissions' ? 'selected' : ''}>Admissions</option>
                        <option value="placements" ${isEdit && page.template === 'placements' ? 'selected' : ''}>Placements</option>
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

async function editPage(id) {
    try {
        const res = await apiRequest(`/api/v1/admin/pages/${id}`);
        if (res.success && res.page) {
            openCreatePageModal(res.page);
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
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
        const res = await apiRequest('/api/v1/admin/enquiries');
        const enquiries = res.enquiries || [];
        const tbody = document.getElementById('enquiriesTableBody');

        if (enquiries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No admission enquiries recorded yet.</td></tr>';
            return;
        }

        tbody.innerHTML = enquiries.map(e => `
            <tr>
                <td><span style="font-size:12px; color:var(--text-muted);">${new Date(e.created_at).toLocaleDateString()}</span></td>
                <td><strong>${escapeHtml(e.full_name)}</strong></td>
                <td><a href="mailto:${escapeHtml(e.email)}">${escapeHtml(e.email)}</a></td>
                <td><a href="tel:${escapeHtml(e.phone)}">${escapeHtml(e.phone)}</a></td>
                <td>${escapeHtml(e.course_interested || 'General')}</td>
                <td><span style="font-size:12.5px;">${escapeHtml(e.message || '—')}</span></td>
                <td>
                    <select class="form-control" style="padding: 4px 8px; font-size: 12px; width: 110px;" onchange="updateEnquiryStatus(${e.id}, this.value)">
                        <option value="new" ${e.status === 'new' ? 'selected' : ''}>New</option>
                        <option value="contacted" ${e.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="closed" ${e.status === 'closed' ? 'selected' : ''}>Closed</option>
                    </select>
                </td>
            </tr>
        `).join('');
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
