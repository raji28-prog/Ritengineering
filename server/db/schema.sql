-- ============================================================================
-- RITW Dynamic CMS Database Schema (SQLite)
-- Institutional Portal & Content Management System
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active INTEGER NOT NULL DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    status TEXT NOT NULL DEFAULT 'published', -- 'draft', 'published', 'archived'
    template TEXT DEFAULT 'standard',
    sort_order INTEGER DEFAULT 0,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Content Sections table (reusable or page-specific content blocks)
CREATE TABLE IF NOT EXISTS content_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_id INTEGER, -- NULL indicates global or homepage section
    section_key TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    content_html TEXT,
    image_url TEXT,
    button_text TEXT,
    button_url TEXT,
    section_type TEXT NOT NULL DEFAULT 'standard', -- 'hero_slide', 'spotlight', 'why_ritw', 'counter', 'testimonial', 'announcement', 'custom'
    sort_order INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    custom_data TEXT, -- JSON string for arbitrary structured fields
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(page_id) REFERENCES pages(id) ON DELETE CASCADE
);

-- Navigation Menus (e.g. 'main_header', 'top_bar', 'footer_quick_links')
CREATE TABLE IF NOT EXISTS navigation_menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Navigation Items (supports unlimited nested submenus)
CREATE TABLE IF NOT EXISTS navigation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_id INTEGER NOT NULL,
    parent_id INTEGER, -- NULL for top-level, references navigation_items(id)
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    route_type TEXT DEFAULT 'internal', -- 'internal', 'external', 'anchor'
    target TEXT DEFAULT '_self',
    sort_order INTEGER DEFAULT 0,
    is_visible INTEGER DEFAULT 1,
    icon_class TEXT,
    badge_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(menu_id) REFERENCES navigation_menus(id) ON DELETE CASCADE,
    FOREIGN KEY(parent_id) REFERENCES navigation_items(id) ON DELETE CASCADE
);

-- Custom Fields Definitions
CREATE TABLE IF NOT EXISTS custom_field_definitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL, -- 'page', 'section', 'department'
    field_name TEXT NOT NULL,
    field_key TEXT UNIQUE NOT NULL,
    field_type TEXT NOT NULL, -- 'text', 'textarea', 'rich_text', 'image', 'url', 'date', 'number', 'boolean'
    validation_rules TEXT, -- JSON string with min, max, regex, required
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Custom Fields Values
CREATE TABLE IF NOT EXISTS custom_field_values (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,
    entity_id INTEGER NOT NULL,
    field_definition_id INTEGER NOT NULL,
    field_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(field_definition_id) REFERENCES custom_field_definitions(id) ON DELETE CASCADE,
    UNIQUE(entity_type, entity_id, field_definition_id)
);

-- Announcements & Flash News
CREATE TABLE IF NOT EXISTS announcements_news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT,
    link_url TEXT,
    badge_text TEXT DEFAULT 'NEW',
    badge_color TEXT DEFAULT '#159B62',
    is_flash INTEGER DEFAULT 1,
    status TEXT DEFAULT 'published', -- 'draft', 'published', 'archived'
    start_date DATE,
    end_date DATE,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Media Library
CREATE TABLE IF NOT EXISTS media_library (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    alt_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- College Settings (key-value store for site-wide settings)
CREATE TABLE IF NOT EXISTS college_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL, -- JSON formatted value
    category TEXT DEFAULT 'general', -- 'general', 'contact', 'social', 'branding', 'features'
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admission Enquiries (collected from the Quick Enquiry modal)
CREATE TABLE IF NOT EXISTS admission_enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    course_interested TEXT,
    message TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'closed'
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs (for security & change tracking)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id INTEGER,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_sections_page_id ON content_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_nav_items_menu ON navigation_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_nav_items_parent ON navigation_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_news_status ON announcements_news(status);
CREATE INDEX IF NOT EXISTS idx_cf_values_entity ON custom_field_values(entity_type, entity_id);
