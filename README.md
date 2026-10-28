# RITW Website Local Reconstruction
**Institution:** Rishi M.S Institute of Engineering & Technology for Women (RITW), Hyderabad  
**Affiliation & Accreditations:** UGC Autonomous | NAAC 'A' Grade | NBA Accredited | NIRF Ranked | Affiliated to JNTU Hyderabad | Approved by AICTE  
**College Code (EAPCET / ECET):** `RITW`  
**Reference Domain:** [https://www.rishimsengg.ac.in/](https://www.rishimsengg.ac.in/)  

---

## 1. Project Disclaimer & Scope Notice

> [!IMPORTANT]
> - **Reconstructed Public Frontend:** This project is an authorized local reconstruction of the publicly accessible frontend for Rishi M.S Institute of Engineering & Technology for Women.
> - **No Proprietary Claim:** This repository **does not claim to be the original WordPress or server-side PHP source code**. The original server-side code, MySQL databases, hosting control panels, and credentials were not provided and were not accessed.
> - **Security & Ethics:** No access restrictions or security controls (`robots.txt`, private directories, admin panels) were bypassed. All assets included were downloaded solely from publicly available HTTP endpoints.
> - **No React Migration Yet:** In accordance with migration engineering protocol, this Phase 2 delivers a verified standalone HTML5/CSS3/JavaScript reconstruction before any frontend framework migration is undertaken.

---

## 2. Reconstructed Pages & URL Directory

| Section | Local File Path | Key Content Reconstructed |
| :--- | :--- | :--- |
| **Homepage** | [`index.html`](index.html) | Brand Header, Topbar, Full 16-dropdown Navigation, Announcements Ticker, Hero Slider (6 slides), Autonomous Accreditations Banner, College Video introduction, Why Choose RITW tile slider (9 cards), Stats Counter, Life at RITW, Testimonial Slider, Footer. |
| **About Us** | [`about/index.html`](about/index.html) | Institutional Overview, Vision & Mission, Quality Policy, Leadership Profiles (Founder Smt. M.S. Subbulakshmi, Secretary Smt. M. Jayasree, Principal Dr. Md. Jeelani), Accreditations & Infrastructure summary. |
| **Departments** | [`departments/index.html`](departments/index.html) | Computer Science & Engineering (CSE) Department, Vision & Mission, HOD Profile (Dr. Archana Baburao Patil), Undergraduate Programs (CSE, CSE-AIML, CSE-DS), Lab facilities. |
| **Admissions** | [`admissions/index.html`](admissions/index.html) | 2026-27 Intake Breakdown per branch, Convenor Quota (TG EAPCET Code: RITW), Management Quota criteria, Fee structure guidelines, Required certificates checklist. |
| **Placements** | [`placements/index.html`](placements/index.html) | Training & Placement Cell message, TPO Profile (Mrs. Kalam Lakshmi Tulasi), 100% Placement assistance track record, Top Recruiters Grid (Capgemini, Infosys, TCS, Cognizant, Wipro, Amazon, Microsoft), MoUs. |
| **Contact Us** | [`contact/index.html`](contact/index.html) | Campus Address (Near JNTU Metro, Nizampet Road, Kukatpally, Hyderabad), Official Phone (+91 9121214081), Email (`info@rishimsengg.ac.in`), Interactive Campus Map embed, Feedback form. |

---

## 3. Directory Structure

```
Ritengineering/
├── index.html                           # Reconstructed Homepage
├── about/
│   └── index.html                       # About Us Page
├── departments/
│   └── index.html                       # CSE Department Page
├── admissions/
│   └── index.html                       # Admissions 2026-27 Page
├── placements/
│   └── index.html                       # Training & Placements Page
├── contact/
│   └── index.html                       # Contact Us Page
├── css/
│   ├── font-icons.css                   # FontAwesome 5 & Flaticon icon declarations
│   ├── plugins.css                      # Slick Slider, Owl Carousel, Bootstrap utilities
│   ├── style.css                        # Vicodin/RITW Primary theme stylesheet & color tokens
│   └── responsive.css                   # Mobile, tablet & desktop media queries
├── js/
│   ├── plugins.js                       # Slick, jQuery plugins, carousel scripts
│   ├── main.js                          # Navigation drawer, sticky header, animations
│   ├── voice-assistant.js               # Web Speech API Voice Search Assistant ("Hey Rishi")
│   ├── search-index.js                  # Client-side searchable dataset (347 site URLs & titles)
│   ├── search-local.js                  # Instant search modal logic (replaces remote PHP endpoint)
│   └── enquiry-local.js                 # Quick enquiry modal handler with transparent offline notice
├── fonts/                               # Flaticon, Icomoon, Lightcase font files
├── webfonts/                            # FontAwesome solid, regular, brands webfonts
├── images/                              # Official college logos, banners, portraits, accreditations
├── PhotoGallery/                        # Event photographs & cultural celebration banners
├── uploads/                             # Spotlight and achievement graphics
├── serve.js                             # Zero-dependency local static web server
└── README.md                            # Complete engineering documentation
```

---

## 4. How to Run Locally

### Option A: Using the Built-In Node Server (Recommended)
This repository includes a standalone, zero-dependency static server (`serve.js`):
```bash
# From inside the Ritengineering directory:
node serve.js 3000
```
Open your browser and navigate to:
**`http://localhost:3000`**

### Option B: Using `npx serve`
```bash
npx serve . -p 3000
```

### Option C: Direct File Browsing
You can double-click or open [`index.html`](index.html) directly in any modern browser (Chrome, Edge, Firefox, Safari). All stylesheets, fonts, and images use relative paths and render offline.

---

## 5. Local Interactive Features

1. **Instant Search (`Ctrl + K` or Search Icon):**
   - In production, searches sent an XHR to `search-live.php`.
   - In this reconstruction, search is powered by `js/search-index.js` indexing all **347 pages** from the college sitemap with instant categorization, highlighting, and direct navigation.
2. **Voice Search Assistant ("Hey Rishi"):**
   - Implemented via `js/voice-assistant.js` using the browser's native **Web Speech API**.
   - Listens for the wake word *"Hey Rishi"* and auto-fills the search input.
3. **Quick Enquiry Modal (Side Floating Button):**
   - Full admission enquiry dialog with interactive reason chips (Admissions, Fee Structure, Placements, Campus Tour, Hostel).
   - Validates input fields and displays a transparent offline disclosure.

---

## 6. Documented Backend Limitations & Unavailable Files

In accordance with Phase 2 instructions, no fake success states are shown:

1. **Admissions Enquiry Form (`includes/enquiry-handler.php`):**
   - **Status:** Requires server-side PHP runtime and MySQL database persistence.
   - **Local Behavior:** The form validates fields and displays an informative notification explaining that backend database storage is not connected in this local static reconstruction, directing inquiries to official contacts.
2. **Server-Side Search Scripts (`search-page.php`, `search-results.php`):**
   - **Status:** Original PHP search scripts run queries against server database tables.
   - **Local Solution:** Replaced with client-side indexing (`js/search-index.js`) providing instant live search over all 347 site pages.
3. **Restricted Server Directories:**
   - As declared in `robots.txt`, directories `/admin/`, `/config/`, `/DVV/`, `/tmp/`, `/submissions/`, and `/MSENGG_WP_BACKUP/` are protected server locations and are not present in this public frontend reconstruction.
4. **Official PDF Archives:**
   - Administrative circulars and newsletters in `/PDFs/` remain hyperlinked to their official document locations.
