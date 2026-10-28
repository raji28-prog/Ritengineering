/**
 * RITW Dynamic CMS - Database Seeder
 * Populates real institutional college data, menus, sections, and initial admin.
 */
const bcrypt = require('bcryptjs');
const db = require('./database');
const config = require('../config');

function seedDatabase(adminUser = null, adminPass = null) {
    console.log('[RITW CMS] Checking database seeding status...');

    // 1. Seed Initial Administrator
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    if (userCount === 0 || adminUser) {
        const username = adminUser || process.env.ADMIN_INITIAL_USER || 'admin';
        const password = adminPass || process.env.ADMIN_INITIAL_PASS || 'RitwAdmin@2026!';
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existing) {
            db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hash, existing.id);
            console.log(`[RITW CMS] Administrator password updated for user: "${username}".`);
        } else {
            db.prepare(`
                INSERT INTO users (username, email, password_hash, role, is_active)
                VALUES (?, ?, ?, 'admin', 1)
            `).run(username, `${username}@rishimsengg.ac.in`, hash);
            console.log(`[RITW CMS] Initial administrator created: "${username}".`);
        }
    }

    // 2. Seed College Settings
    const settingsCount = db.prepare('SELECT COUNT(*) as count FROM college_settings').get().count;
    if (settingsCount === 0) {
        const insertSetting = db.prepare(`INSERT OR REPLACE INTO college_settings (key, value, category) VALUES (?, ?, ?)`);

        insertSetting.run('general', JSON.stringify({
            college_name: 'Rishi M.S Institute of Engineering & Technology for Women',
            short_name: 'RITW',
            college_code: 'RITW',
            tagline: 'Best & Top Women\'s Engineering College in Hyderabad | UGC Autonomous | NAAC A | NBA | NIRF',
            founder: 'Smt. M.S. Subbulakshmi',
            secretary: 'Smt. M. Jayasree',
            principal: 'Dr. Md. Jeelani',
            est_year: '2009',
            affiliation: 'Affiliated to JNTUH, Approved by AICTE, UGC Autonomous'
        }), 'general');

        insertSetting.run('contact', JSON.stringify({
            email_primary: 'info@rishimsengg.ac.in',
            email_admissions: 'admissions@rishimsengg.ac.in',
            phone_primary: '+91-967-623-3050',
            phone_secondary: '+91-9121214081',
            whatsapp: '+919676233050',
            address: 'Near JNTU Metro, Nizampet Road, Kukatpally, Hyderabad, Telangana – 500 085',
            google_map_embed: 'https://maps.google.com/?q=Rishi+MS+Institute+of+Engineering+Technology+for+Women+Kukatpally+Hyderabad'
        }), 'contact');

        insertSetting.run('social', JSON.stringify({
            facebook: 'https://www.facebook.com/rishicollege',
            instagram: 'https://www.instagram.com/rishimsengg/',
            whatsapp: 'https://wa.me/919676233050',
            youtube: 'https://www.youtube.com/@rishimsengg',
            linkedin: 'https://www.linkedin.com/school/ritw-hyderabad/'
        }), 'social');

        insertSetting.run('accreditations', JSON.stringify([
            { name: 'UGC Autonomous', badge: 'UGC', color: '#d8b4fe' },
            { name: 'NAAC A Grade', badge: 'NAAC A', color: '#f3b90c' },
            { name: 'NBA Accredited', badge: 'NBA', color: '#4ade80' },
            { name: 'NIRF Recognized', badge: 'NIRF', color: '#ffffff' }
        ]), 'branding');

        insertSetting.run('features', JSON.stringify({
            voice_assistant: true,
            instant_search: true,
            enquiry_modal: true,
            announcements_ticker: true,
            campus_spotlight: true
        }), 'features');

        console.log('[RITW CMS] Default college settings seeded.');
    }

    // 3. Seed Core Pages
    const pagesCount = db.prepare('SELECT COUNT(*) as count FROM pages').get().count;
    if (pagesCount === 0) {
        const insertPage = db.prepare(`
            INSERT INTO pages (title, slug, meta_title, meta_description, status, template, sort_order)
            VALUES (?, ?, ?, ?, 'published', ?, ?)
        `);

        insertPage.run(
            'Home',
            'home',
            'Rishi M.S Institute of Engineering & Technology for Women | Best Women\'s College',
            'RITW is one of the best and top women\'s engineering colleges in Hyderabad. UGC Autonomous, NBA Accredited, NAAC A Accredited.',
            'homepage',
            1
        );
        insertPage.run(
            'About Our College RITW',
            'about',
            'About RITW | Vision, Mission & Leadership',
            'Learn about RITW history, vision, leadership, and state-of-the-art infrastructure for women engineers.',
            'about',
            2
        );
        insertPage.run(
            'Computer Science & Engineering',
            'departments',
            'Departments | CSE, AI/ML, Data Science & IT',
            'Explore high-demand engineering departments, expert faculty, modern labs, and research wings.',
            'department',
            3
        );
        insertPage.run(
            'Admissions 2026-27',
            'admissions',
            'Admissions 2026-27 | TG EAPCET Code: RITW',
            'Admissions guidelines, intake capacity, TG EAPCET convenor quota, and management quota criteria.',
            'admissions',
            4
        );
        insertPage.run(
            'Training & Placements',
            'placements',
            'Placements & Industry Tie-ups | 100% Assistance',
            'Our placement cell connects RITW graduates with Fortune 500 tech companies and multinational corporations.',
            'placements',
            5
        );
        insertPage.run(
            'Contact Us',
            'contact',
            'Contact RITW | Campus Location & Enquiry',
            'Visit our campus in Kukatpally, Hyderabad near JNTU Metro. Call or email for any enquiries.',
            'contact',
            6
        );

        console.log('[RITW CMS] Core pages seeded.');
    }

    // 4. Seed Announcements & Flash News
    const newsCount = db.prepare('SELECT COUNT(*) as count FROM announcements_news').get().count;
    if (newsCount === 0) {
        const insertNews = db.prepare(`
            INSERT INTO announcements_news (title, summary, link_url, badge_text, badge_color, is_flash, status, sort_order)
            VALUES (?, ?, ?, ?, ?, 1, 'published', ?)
        `);

        insertNews.run(
            'Admissions for the 2026-27 Academic Year Commenced — TG EAPCET / TG ECET Code: RITW',
            'Convenor and Management Quota admissions open for CSE, AI-ML, Data Science, and IT.',
            '/admissions/',
            'ADMISSIONS 2026',
            '#f3b90c',
            1
        );
        insertNews.run(
            'RITW Achieves Outstanding Placement Record with Top Recruiter Packages up to 7+ LPA',
            'Congratulations to M Satya Pranathi and our final year engineering cohorts placed at Xperte, Capgemini & TCS.',
            '/placements/',
            'PLACEMENTS',
            '#159B62',
            2
        );
        insertNews.run(
            'Google Workshop on Prompt Design in Vertex AI Skill Conducted for Engineering Scholars',
            'Intensive skill immersion workshop organized for 3rd and 4th year Computer Science students.',
            '/departments/',
            'TECH WORKSHOP',
            '#392F87',
            3
        );

        console.log('[RITW CMS] Announcements and flash news seeded.');
    }

    // 5. Seed Homepage Hero Sliders and Sections
    const sectionsCount = db.prepare('SELECT COUNT(*) as count FROM content_sections').get().count;
    if (sectionsCount === 0) {
        const homePage = db.prepare('SELECT id FROM pages WHERE slug = ?').get('home');
        const pageId = homePage ? homePage.id : null;

        const insertSection = db.prepare(`
            INSERT INTO content_sections (page_id, section_key, title, subtitle, content_html, image_url, button_text, button_url, section_type, sort_order, is_visible, custom_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `);

        // Hero slides
        insertSection.run(
            pageId,
            'hero_slide_1',
            'UGC Autonomous & NAAC \'A\' Grade Accredited',
            'Excellence in Women\'s Technical Education',
            '<p>Empowering the next generation of women technologists, researchers, and innovators in Hyderabad.</p>',
            'images/slider/1.jpg',
            'Explore Admissions',
            '/admissions/',
            'hero_slide',
            1,
            JSON.stringify({ badge: 'EAPCET CODE: RITW' })
        );

        insertSection.run(
            pageId,
            'hero_slide_2',
            '100% Placement Assistance with Global Tech Giants',
            'Industry-Aligned Career Training',
            '<p>Equipping students with modern skills in Vertex AI, Cloud Engineering, Cyber Security, and Software Architecture.</p>',
            'images/slider/2.jpg',
            'View Placement Records',
            '/placements/',
            'hero_slide',
            2,
            JSON.stringify({ badge: 'TOP RECRUITERS' })
        );

        insertSection.run(
            pageId,
            'hero_slide_3',
            'Cutting-Edge AI, ML & Data Science Laboratories',
            'Next-Gen Computing Infrastructure',
            '<p>High-performance computing workstations, high-speed campus Wi-Fi, and industry-sponsored innovation labs.</p>',
            'images/slider/3.jpg',
            'Discover Departments',
            '/departments/',
            'hero_slide',
            3,
            JSON.stringify({ badge: 'CSE & ALLIED' })
        );

        // Stats Counters
        insertSection.run(
            pageId,
            'counter_placements',
            '100%',
            'Placement Assistance',
            'Comprehensive campus recruitment training from 2nd year onwards.',
            null, null, null,
            'counter',
            1,
            JSON.stringify({ icon: 'fas fa-briefcase', value: '100%' })
        );

        insertSection.run(
            pageId,
            'counter_recruiters',
            '50+',
            'Top Recruiters',
            'Tier-1 IT and engineering companies recruiting annually from RITW.',
            null, null, null,
            'counter',
            2,
            JSON.stringify({ icon: 'fas fa-building', value: '50+' })
        );

        insertSection.run(
            pageId,
            'counter_mous',
            '15+',
            'Industry MoUs',
            'Active corporate collaborations with Redington CSR, Edubridge, Datateach AI.',
            null, null, null,
            'counter',
            3,
            JSON.stringify({ icon: 'fas fa-handshake', value: '15+' })
        );

        insertSection.run(
            pageId,
            'counter_startups',
            '25+',
            'Student Startups & Projects',
            'Student innovators building real-world software and hardware prototypes.',
            null, null, null,
            'counter',
            4,
            JSON.stringify({ icon: 'fas fa-rocket', value: '25+' })
        );

        // Why Choose RITW Cards
        insertSection.run(
            pageId,
            'why_autonomous',
            'UGC Autonomous Institution',
            'Industry Tailored Curriculum',
            '<p>Flexibility to update syllabus according to the latest technology trends and industrial demands.</p>',
            'images/why_choose/autonomous.png',
            'Read More',
            '/about/',
            'why_ritw',
            1,
            JSON.stringify({ icon: 'fas fa-university' })
        );

        insertSection.run(
            pageId,
            'why_location',
            'Prime Metro Location',
            'Kukatpally, Near JNTU',
            '<p>Convenient, safe transit directly accessible via JNTU Metro Station with dedicated college transport.</p>',
            'images/why_choose/location.png',
            'View Campus Map',
            '/contact/',
            'why_ritw',
            2,
            JSON.stringify({ icon: 'fas fa-subway' })
        );

        insertSection.run(
            pageId,
            'why_faculty',
            'Doctoral & Veteran Faculty',
            'Mentorship & Guidance',
            '<p>Highly qualified professors with research publications, patents, and dedicated student mentoring.</p>',
            'images/why_choose/faculty.png',
            'Faculty Profiles',
            '/departments/',
            'why_ritw',
            3,
            JSON.stringify({ icon: 'fas fa-chalkboard-teacher' })
        );

        console.log('[RITW CMS] Homepage content sections seeded.');
    }

    // 6. Seed Navigation Menus and Items
    const menuCount = db.prepare('SELECT COUNT(*) as count FROM navigation_menus').get().count;
    if (menuCount === 0) {
        const menuRes = db.prepare(`INSERT INTO navigation_menus (menu_key, title) VALUES ('main_header', 'Main Header Navigation')`).run();
        const menuId = menuRes.lastInsertRowid;

        const insertItem = db.prepare(`
            INSERT INTO navigation_items (menu_id, parent_id, title, url, route_type, target, sort_order, is_visible)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `);

        // Top level items
        const homeItem = insertItem.run(menuId, null, 'Home', '/', 'internal', '_self', 1);
        const aboutItem = insertItem.run(menuId, null, 'About', '/about/', 'internal', '_self', 2);
        const deptItem = insertItem.run(menuId, null, 'Departments', '/departments/', 'internal', '_self', 3);
        const admItem = insertItem.run(menuId, null, 'Admissions', '/admissions/', 'internal', '_self', 4);
        const placeItem = insertItem.run(menuId, null, 'Placements', '/placements/', 'internal', '_self', 5);
        const contactItem = insertItem.run(menuId, null, 'Contact', '/contact/', 'internal', '_self', 6);

        // Submenus under About
        insertItem.run(menuId, aboutItem.lastInsertRowid, 'About Our College RITW', '/about/', 'internal', '_self', 1);
        insertItem.run(menuId, aboutItem.lastInsertRowid, 'Vision, Mission & Quality Policy', '/about/#vision', 'internal', '_self', 2);
        insertItem.run(menuId, aboutItem.lastInsertRowid, 'Leadership & Founder', '/about/#leadership', 'internal', '_self', 3);
        insertItem.run(menuId, aboutItem.lastInsertRowid, 'Accreditations & Approvals', '/about/#accreditations', 'internal', '_self', 4);

        // Submenus under Departments
        insertItem.run(menuId, deptItem.lastInsertRowid, 'Computer Science & Engineering (CSE)', '/departments/', 'internal', '_self', 1);
        insertItem.run(menuId, deptItem.lastInsertRowid, 'CSE - Artificial Intelligence & ML', '/departments/#aiml', 'internal', '_self', 2);
        insertItem.run(menuId, deptItem.lastInsertRowid, 'CSE - Data Science', '/departments/#ds', 'internal', '_self', 3);
        insertItem.run(menuId, deptItem.lastInsertRowid, 'Information Technology (IT)', '/departments/#it', 'internal', '_self', 4);
        insertItem.run(menuId, deptItem.lastInsertRowid, 'Electronics & Communication (ECE)', '/departments/#ece', 'internal', '_self', 5);

        // Submenus under Admissions
        insertItem.run(menuId, admItem.lastInsertRowid, 'Admissions 2026-27 Intake', '/admissions/', 'internal', '_self', 1);
        insertItem.run(menuId, admItem.lastInsertRowid, 'TG EAPCET Convenor Quota', '/admissions/#eapcet', 'internal', '_self', 2);
        insertItem.run(menuId, admItem.lastInsertRowid, 'Management Quota Criteria', '/admissions/#management', 'internal', '_self', 3);
        insertItem.run(menuId, admItem.lastInsertRowid, 'Certificates Required', '/admissions/#certificates', 'internal', '_self', 4);

        // Submenus under Placements
        insertItem.run(menuId, placeItem.lastInsertRowid, 'Training & Placement Cell', '/placements/', 'internal', '_self', 1);
        insertItem.run(menuId, placeItem.lastInsertRowid, 'Top Recruiter Companies', '/placements/#recruiters', 'internal', '_self', 2);
        insertItem.run(menuId, placeItem.lastInsertRowid, 'Industry MoUs & Partnerships', '/placements/#mous', 'internal', '_self', 3);

        console.log('[RITW CMS] Navigation menu hierarchy seeded.');
    }

    // 7. Seed Custom Field Definitions
    const cfCount = db.prepare('SELECT COUNT(*) as count FROM custom_field_definitions').get().count;
    if (cfCount === 0) {
        const insertCF = db.prepare(`
            INSERT INTO custom_field_definitions (entity_type, field_name, field_key, field_type, validation_rules, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        insertCF.run('page', 'Brochure Download URL', 'brochure_url', 'url', JSON.stringify({ required: false }), 1);
        insertCF.run('page', 'Banner Video Embed', 'video_embed', 'url', JSON.stringify({ required: false }), 2);
        insertCF.run('section', 'Highlight Badge Text', 'badge_text', 'text', JSON.stringify({ max_length: 50 }), 1);
        insertCF.run('section', 'Accent Color Hex', 'accent_color', 'text', JSON.stringify({ pattern: '^#[0-9A-Fa-f]{6}$' }), 2);
        insertCF.run('section', 'Is Featured Section', 'is_featured', 'boolean', JSON.stringify({ default: false }), 3);

        console.log('[RITW CMS] Custom field definitions seeded.');
    }

    console.log('[RITW CMS] Seeding finished successfully.');
}

// Allow direct CLI invocation: node server/db/seed.js [username] [password]
if (require.main === module) {
    const user = process.argv[2] || null;
    const pass = process.argv[3] || null;
    seedDatabase(user, pass);
}

module.exports = seedDatabase;
