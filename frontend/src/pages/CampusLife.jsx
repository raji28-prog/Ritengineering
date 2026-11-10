import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const NSS_EVENTS_2024_25 = [
  {
    "sno": "1",
    "date": "7/5/2025",
    "title": "Civil Defence Exercise & Rehearsal Mock Drill Awareness Program",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "10",
    "students": "180"
  },
  {
    "sno": "2",
    "date": "10/4/2025",
    "title": "Equal Asses to Education Competitions",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "9",
    "students": "58"
  },
  {
    "sno": "3",
    "date": "7/3/2025",
    "title": "Celebration of Womens Day",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "34",
    "students": "20"
  },
  {
    "sno": "4",
    "date": "28-01-2025",
    "title": "Celebration of Cancer Day",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "8",
    "students": "156"
  },
  {
    "sno": "5",
    "date": "28-01-2025",
    "title": "Awareness of Road Safety",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "7",
    "students": "189"
  },
  {
    "sno": "6",
    "date": "25-01-2025",
    "title": "Celebration of National Voter's Day",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "13",
    "students": "324"
  },
  {
    "sno": "7",
    "date": "3/1/2025",
    "title": "Celebration of Women Teacher's Day",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "13",
    "students": "254"
  },
  {
    "sno": "8",
    "date": "28-12-2025",
    "title": "Awareness Program on Cyber Security",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "7",
    "students": "186"
  },
  {
    "sno": "9",
    "date": "6/12/2025",
    "title": "Awareness Program on Cyber Security",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "4",
    "students": "234"
  },
  {
    "sno": "10",
    "date": "26-11-2025",
    "title": "National Constitution Day",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "8",
    "students": "432"
  },
  {
    "sno": "11",
    "date": "24-10-2025",
    "title": "Free Eye Camp",
    "agency": "Rishi NSS Club",
    "teachers": "23",
    "students": "348"
  },
  {
    "sno": "12",
    "date": "19-10-2025",
    "title": "Manavata Meet",
    "agency": "JNTUH University & TS",
    "teachers": "7",
    "students": "56"
  },
  {
    "sno": "13",
    "date": "5/10/2025",
    "title": "E-Waste Collections",
    "agency": "Rishi NSS Club",
    "teachers": "13",
    "students": "261"
  },
  {
    "sno": "14",
    "date": "24-09-2025",
    "title": "NSS Day Celebrations",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "8",
    "students": "210"
  },
  {
    "sno": "15",
    "date": "06-09-2024",
    "title": "Clay Ganesha Making Idol",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "12",
    "students": "322"
  },
  {
    "sno": "16",
    "date": "31-08-2024",
    "title": "NSS Awareness Program for 1st Year Students",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "10",
    "students": "298"
  },
  {
    "sno": "17",
    "date": "17-08-2024",
    "title": "Free Health Check-Up Medical Camp",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "5",
    "students": "278"
  },
  {
    "sno": "18",
    "date": "13-07-2024",
    "title": "CM Program in Education on Safe Touch, Traffic Awareness, Hidden Cameras & Drugs",
    "agency": "JNTUH University & TS",
    "teachers": "4",
    "students": "25"
  },
  {
    "sno": "19",
    "date": "04-07-2024",
    "title": "Planting Trees, Classroom Cleaning, Playground Cleaning",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "6",
    "students": "255"
  },
  {
    "sno": "20",
    "date": "24-06-2024 to 26-06-2024",
    "title": "Traffic Training Institute",
    "agency": "TS Gosha Mahal Traffic Training Institute, Begum Bazar",
    "teachers": "4",
    "students": "26"
  },
  {
    "sno": "21",
    "date": "21-06-2024",
    "title": "International Yoga Day",
    "agency": "Rishi MS Institute of Engg & Tech for Women Collaborating SAC",
    "teachers": "30",
    "students": "480"
  }
];
const NSS_EVENTS_2023_24 = [
  {
    "sno": "1",
    "date": "20-04-2024",
    "title": "Haritha Haraam",
    "agency": "Rishi MS Institute of Engg & Tech for Women",
    "teachers": "8",
    "students": "150"
  },
  {
    "sno": "2",
    "date": "19-03-2024",
    "title": "District Level Neighbourhood Youth Parliament - 2024",
    "agency": "JNTU University, Hyderabad",
    "teachers": "4",
    "students": "35"
  },
  {
    "sno": "3",
    "date": "28-11-2023",
    "title": "The Constitution of India Preamble",
    "agency": "Rishi MS Institute of Engg & Tech for Women",
    "teachers": "25",
    "students": "480"
  },
  {
    "sno": "4",
    "date": "12-10-2023",
    "title": "Meri Maati - Meri Desh",
    "agency": "Rishi MS Institute of Engg & Tech for Women",
    "teachers": "5",
    "students": "180"
  },
  {
    "sno": "5",
    "date": "24-09-2023",
    "title": "NSS Day Celebrations",
    "agency": "Rishi MS Institute of Engg & Tech for Women",
    "teachers": "12",
    "students": "130"
  },
  {
    "sno": "6",
    "date": "16-09-2023",
    "title": "Felicitation to Ex-Service Man",
    "agency": "Rishi MS Institute of Engg & Tech for Women",
    "teachers": "16",
    "students": "250"
  },
  {
    "sno": "7",
    "date": "09-09-2023",
    "title": "Haritha Haram",
    "agency": "Rishi MS Institute of Engg & Tech for Women, Collaborating ECO-Club",
    "teachers": "7",
    "students": "100"
  },
  {
    "sno": "8",
    "date": "02-09-2023",
    "title": "NSS Awareness Program",
    "agency": "Rishi MS Institute of Engg & Tech for Women, Collaborating SAC",
    "teachers": "10",
    "students": "250"
  },
  {
    "sno": "9",
    "date": "31-08-2023",
    "title": "Free Health Check-Up Camp",
    "agency": "Rishi MS Institute of Engg & Tech for Women, Collaborating SAC",
    "teachers": "27",
    "students": "120"
  },
  {
    "sno": "10",
    "date": "30-08-2023",
    "title": "Clay Ganesh (Awareness on Plastic)",
    "agency": "Rishi MS Institute of Engg & Tech for Women",
    "teachers": "20",
    "students": "250"
  },
  {
    "sno": "11",
    "date": "10-07-2023",
    "title": "NSS Awareness Program (Painting)",
    "agency": "Rishi MS Institute of Engg & Tech for Women, Collaborating SAC",
    "teachers": "6",
    "students": "45"
  },
  {
    "sno": "12",
    "date": "12-06-2023",
    "title": "International Day of Yoga 2023 – QUIZ 2.0",
    "agency": "Rishi MS Institute of Engg & Tech for Women, Collaborating Ministry of AYUSH",
    "teachers": "8",
    "students": "40"
  },
  {
    "sno": "13",
    "date": "03-06-2023",
    "title": "Narcotic Drugs & Adverse Effects",
    "agency": "JNTUH University & TSCHE",
    "teachers": "4",
    "students": "56"
  }
];
const NSS_EVENTS_2022_23 = [
  {
    "sno": "1",
    "date": "29-10-2022",
    "title": "ISKCON Elocution Competition",
    "agency": "Malla Reddy Engineering College",
    "teachers": "1",
    "students": "10"
  },
  {
    "sno": "2",
    "date": "19-10-2022",
    "title": "Clean India Campaign",
    "agency": "Indira Hills, Shamshiguda, Kukatpally — Organized by Rishi MS",
    "teachers": "6",
    "students": "41"
  },
  {
    "sno": "3",
    "date": "24-09-2022",
    "title": "NSS Day Celebrations",
    "agency": "Rishi MS Institute of Engineering & Technology for Women",
    "teachers": "12",
    "students": "130"
  },
  {
    "sno": "4",
    "date": "22-09-2022",
    "title": "Elocution Competition – Kill Cancer",
    "agency": "Rishi MS Institute of Engineering & Technology for Women",
    "teachers": "7",
    "students": "25"
  },
  {
    "sno": "5",
    "date": "05-09-2022",
    "title": "Cyber Security & Narcotic Drugs Awareness",
    "agency": "NSS Unit, JNTUH — University Level Competition (Golden Jubilee Celebrations)",
    "teachers": "4",
    "students": "30"
  },
  {
    "sno": "6",
    "date": "30-08-2022",
    "title": "Clay Ganesh (Awareness on Plastic)",
    "agency": "Rishi MS Institute of Engineering & Technology for Women",
    "teachers": "20",
    "students": "250"
  },
  {
    "sno": "7",
    "date": "23-06-2022",
    "title": "5K Run – Child for Save Bharathi",
    "agency": "Rishi MS Institute of Engineering & Technology for Women",
    "teachers": "6",
    "students": "100"
  }
];

const GALLERY_PHOTOS = [
  { id: 1, title: 'Academic Campus Quadrangle', cat: 'campus', img: '/images/campus-life/IMG20250725113923.webp', tag: 'Campus Quad' },
  { id: 2, title: 'Central Library Reading Hall', cat: 'learning', img: '/images/campus-life/IMG20250725114702.jpg', tag: 'Central Library' },
  { id: 3, title: 'Digital Library Research Terminals', cat: 'learning', img: '/images/campus-life/IMG20250725121031.webp', tag: 'Digital E-Resources' },
  { id: 4, title: 'Smart Interactive E-Classroom', cat: 'learning', img: '/images/campus-life/IMG20250725123326.jpg', tag: 'Smart Theatres' },
  { id: 5, title: 'IEEE Student Branch & Standards Kiosk', cat: 'learning', img: '/images/campus-life/IEEE.jpg', tag: 'IEEE Chapter' },
  { id: 6, title: 'NPTEL / SWAYAM Online Certification Kiosk', cat: 'learning', img: '/images/campus-life/NPTEL.jpg', tag: 'SWAYAM Node' },
  { id: 7, title: 'TASK & AICTE Skill Development Hub', cat: 'learning', img: '/images/campus-life/MHRD-AICTE-UGC-NSDC-TASK-Kiosk.jpg', tag: 'TASK Hub' },
  { id: 8, title: 'AIML & Advanced Data Science Laboratory', cat: 'learning', img: '/images/campus-life/IMG20250725121056.jpg', tag: 'AI Computing' },
  { id: 9, title: 'Women Safety & Cyber Conclave', cat: 'events', img: '/images/campus-life/13-6-23_women_cyberabad__2_.jpg', tag: 'Seminar Hall' },
  { id: 10, title: 'Coding Club Peer Hackathon Arena', cat: 'events', img: '/images/campus-life/0002.jpg', tag: 'Coding Chapter' },
  { id: 11, title: 'Robotics & Hardware Prototyping Exhibition', cat: 'events', img: '/images/campus-life/0003.jpg', tag: 'Hardware Hub' },
  { id: 12, title: 'Literature & Oratory Society Debate Forum', cat: 'events', img: '/images/campus-life/Litrature_Club.jpeg', tag: 'Oratory Society' },
  { id: 13, title: 'Horticulture & Eco Club Green Zone', cat: 'campus', img: '/images/campus-life/Horti_Culture_Club.jpeg', tag: 'Eco Club' },
  { id: 14, title: 'Annual Inter-Collegiate Sports Championship', cat: 'sports', img: '/images/slider/Sports and Fitness.jpg', tag: 'Sports Complex' },
  { id: 15, title: 'Annual Cultural Fest Rishi Utsav', cat: 'events', img: '/images/slider/Cultural.jpg', tag: 'Rishi Utsav' }
];

export default function CampusLife() {
  const [activeNssYear, setActiveNssYear] = useState('2024-25');
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [activeModalImg, setActiveModalImg] = useState(null);

  const filteredPhotos = galleryFilter === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter(item => item.cat === galleryFilter);

  const currentNssEvents = activeNssYear === '2024-25' 
    ? NSS_EVENTS_2024_25 
    : activeNssYear === '2023-24' 
      ? NSS_EVENTS_2023_24 
      : NSS_EVENTS_2022_23;

  return (
    <div className="campuslife-page">
      {/* 1. Breadcrumbs */}
      <div className="fui-breadcrumb-strip">
        <div className="container">
          <ul className="fui-breadcrumb-list">
            <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
            <li className="fui-breadcrumb-separator"><i className="fas fa-chevron-right"></i></li>
            <li><Link to="/campus-life">Campus Life</Link></li>
            <li className="fui-breadcrumb-separator"><i className="fas fa-chevron-right"></i></li>
            <li className="fui-breadcrumb-current">Campus Life &amp; Facilities</li>
          </ul>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="cl-hero" id="overview">
        <div className="container">
          <div className="fui-hero-badge-row">
            <span className="cl-badge cl-badge-navy"><i className="fas fa-university"></i> UGC Autonomous Institution (2026–2035)</span>
            <span className="cl-badge cl-badge-emerald"><i className="fas fa-award"></i> NAAC 'A' Grade Accredited</span>
            <span className="cl-badge cl-badge-navy"><i className="fas fa-check-circle"></i> NBA Accredited (CSE &amp; ECE)</span>
            <span className="cl-badge cl-badge-gold"><i className="fas fa-subway"></i> 300m Opp. JNTU Metro</span>
            <span className="cl-badge cl-badge-navy"><i className="fas fa-female"></i> Exclusively For Women</span>
          </div>
          <h1 className="cl-hero-title">Campus Life &amp; Infrastructure</h1>
          <p className="cl-hero-subtitle">
            At <strong>Rishi M.S Institute of Engineering &amp; Technology for Women (RITW)</strong>, education extends far beyond classrooms. Situated on a lush 5.2-acre campus opposite JNTU College Metro Station, Kukatpally, RITW provides a secure, inspiring, and technologically advanced ecosystem for women engineers. From industry-grade computing laboratories and smart e-classrooms to extensive sports grounds, vibrant student chapters, and community outreach, life at RITW empowers scholars to lead with innovation, confidence, and sisterhood.
          </p>

          <div className="cl-stats-grid">
            <div className="cl-stat-card">
              <div className="cl-stat-number">5.2 Acres</div>
              <div className="cl-stat-label">Lush Green Campus</div>
              <div className="cl-stat-sub">Opposite JNTU College, Kukatpally</div>
            </div>
            <div className="cl-stat-card">
              <div className="cl-stat-number">25,000+</div>
              <div className="cl-stat-label">Library Volumes</div>
              <div className="cl-stat-sub">Central, Conventional &amp; Digital</div>
            </div>
            <div className="cl-stat-card">
              <div className="cl-stat-number">1 Gbps</div>
              <div className="cl-stat-label">Optical Fiber Backbone</div>
              <div className="cl-stat-sub">High-Speed Campus-Wide Wi-Fi</div>
            </div>
            <div className="cl-stat-card">
              <div className="cl-stat-number">100%</div>
              <div className="cl-stat-label">DG Power Backup</div>
              <div className="cl-stat-sub">Uninterrupted Labs &amp; Exams</div>
            </div>
            <div className="cl-stat-card">
              <div className="cl-stat-number">15+</div>
              <div className="cl-stat-label">Student Chapters &amp; Clubs</div>
              <div className="cl-stat-sub">Technical, Cultural &amp; Social</div>
            </div>
            <div className="cl-stat-card">
              <div className="cl-stat-number">24/7</div>
              <div className="cl-stat-label">CCTV &amp; Women Security</div>
              <div className="cl-stat-sub">Safe, Guarded Sanctuary</div>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#infrastructure" className="fui-btn-emerald" style={{ padding: '11px 22px', fontSize: '0.92rem', textDecoration: 'none' }}>
              <i className="fas fa-building"></i> Explore Infrastructure
            </a>
            <a href="#libraries" className="fui-btn-navy" style={{ padding: '11px 22px', fontSize: '0.92rem', textDecoration: 'none' }}>
              <i className="fas fa-book-reader"></i> Central &amp; Digital Library
            </a>
            <a href="#clubs" className="fui-btn-outline" style={{ padding: '11px 20px', fontSize: '0.92rem', textDecoration: 'none' }}>
              <i className="fas fa-users"></i> Student Clubs &amp; NSS
            </a>
            <a href="#gallery" className="fui-btn-outline" style={{ padding: '11px 20px', fontSize: '0.92rem', textDecoration: 'none', borderColor: 'var(--cl-emerald)', color: 'var(--cl-emerald)' }}>
              <i className="fas fa-camera"></i> Campus Photo Gallery
            </a>
          </div>
        </div>
      </section>

      {/* 3. Sticky Subnav Bar */}
      <nav className="cl-subnav-sticky" aria-label="Campus Life Navigation">
        <div className="container">
          <div className="cl-subnav-scroll">
            <a href="#overview" className="cl-subnav-pill"><i className="fas fa-compass"></i> Overview</a>
            <a href="#infrastructure" className="cl-subnav-pill"><i className="fas fa-building"></i> Infrastructure</a>
            <a href="#libraries" className="cl-subnav-pill"><i className="fas fa-book"></i> Libraries</a>
            <a href="#classrooms-labs" className="cl-subnav-pill"><i className="fas fa-laptop-code"></i> E-Classrooms &amp; Labs</a>
            <a href="#kiosks" className="cl-subnav-pill"><i className="fas fa-desktop"></i> Academic Kiosks</a>
            <a href="#amenities" className="cl-subnav-pill"><i className="fas fa-coffee"></i> Student Amenities</a>
            <a href="#sports" className="cl-subnav-pill"><i className="fas fa-volleyball-ball"></i> Sports &amp; Gym</a>
            <a href="#transport" className="cl-subnav-pill"><i className="fas fa-subway"></i> Transport &amp; Metro</a>
            <a href="#clubs" className="cl-subnav-pill"><i className="fas fa-code-branch"></i> Student Clubs</a>
            <a href="#nss" className="cl-subnav-pill"><i className="fas fa-hands-helping"></i> NSS Cell</a>
            <a href="#nss-events" className="cl-subnav-pill"><i className="fas fa-calendar-alt"></i> NSS Events</a>
            <a href="#ncc" className="cl-subnav-pill"><i className="fas fa-shield-alt"></i> NCC Wing</a>
            <a href="#accessibility" className="cl-subnav-pill"><i className="fas fa-wheelchair"></i> Accessibility</a>
            <a href="#gallery" className="cl-subnav-pill"><i className="fas fa-images"></i> Photo Gallery</a>
          </div>
        </div>
      </nav>

      {/* 4. Infrastructure Section */}
      <section id="infrastructure" className="cl-section">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-landmark"></i> Physical Infrastructure</span>
            <h2 className="cl-section-title">Academic Excellence through State-of-the-Art Facilities</h2>
            <p className="cl-section-desc">
              At RITW, infrastructure is more than just physical buildings—it is the strong foundation that empowers students to dream big, learn with confidence, and perform at their best.
            </p>
          </div>

          <div className="cl-grid-2">
            <div className="cl-card cl-card-navy-top">
              <div className="cl-card-img-wrap">
                <img src="/images/campus-life/IMG20250725113923.webp" alt="RITW Campus Architecture" className="cl-card-img" />
                <span className="cl-card-tag">Kukatpally Campus</span>
              </div>
              <h3 className="cl-card-title">A Sustainable, Student-Centric Campus</h3>
              <p className="cl-card-desc">
                Spacious lecture halls, naturally lit corridors, well-ventilated classrooms, and eco-friendly landscaping ensure that learning remains comfortable and engaging throughout the day. Sustainability is at the core of RITW's infrastructure planning. From rainwater harvesting systems and solar energy integration to safe RO water plants, our campus promotes an eco-conscious lifestyle.
              </p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span><strong>5.2-Acre Green Campus:</strong> Calm, peaceful sanctuary right opposite JNTU Hyderabad.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Naturally Ventilated Theatres:</strong> Ergonomic seating, smart lighting and acoustic insulation.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Eco-Conscious Landscaping:</strong> Zero single-use plastic zone with tree-lined corridors.</span></li>
              </ul>
            </div>

            <div className="cl-card cl-card-emerald-top">
              <div className="cl-card-img-wrap">
                <img src="/images/campus-life/IMG20250725121031.webp" alt="Empowering Women Engineers" className="cl-card-img" />
                <span className="cl-card-tag">Academic Excellence</span>
              </div>
              <h3 className="cl-card-title">Empowering Women Engineers through World-Class Facilities</h3>
              <p className="cl-card-desc">
                Every department is equipped with specialized laboratories featuring industry-grade equipment, simulation tools, and software platforms that bridge the gap between classroom knowledge and practical expertise. High-speed internet connectivity, smart projectors, and audio-visual aids enhance the teaching-learning process.
              </p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span><strong>Industry-Grade Equipment:</strong> Texas Instruments, Cisco, Python, Xilinx, MATLAB &amp; Cadence suites.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Dedicated Computing Clusters:</strong> Modern Dell &amp; HP desktop workstations with gigabit switching.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Uncompromising Safety:</strong> 24/7 CCTV surveillance, biometric gateways, and resident faculty wardens.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Libraries Section */}
      <section id="libraries" className="cl-section cl-section-subtle">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-book-open"></i> Knowledge Repositories</span>
            <h2 className="cl-section-title">Central, Conventional &amp; Digital Libraries</h2>
            <p className="cl-section-desc">
              A center for learning and intellectual growth spanning extensive printed volumes, international e-journal subscriptions, and high-speed digital research terminals.
            </p>
          </div>

          <div className="cl-grid-3">
            <div className="cl-card cl-card-navy-top" id="central-library">
              <div className="cl-card-img-wrap">
                <img src="/images/campus-life/IMG20250725114702.jpg" alt="Central Library RITW" className="cl-card-img" />
                <span className="cl-card-tag">Central Knowledge Hub</span>
              </div>
              <h3 className="cl-card-title">Central Library</h3>
              <p className="cl-card-desc">
                The Central Library at RITW is a premier knowledge hub designed to cater to the diverse academic, research, and general reading needs of students and faculty. Spanning a vast, well-lit, and quiet area, the library offers a rich repository of printed volumes, national and international journals, periodicals, and e-learning resources.
              </p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span><strong>Web-Based OPAC:</strong> Fully computerized catalog for rapid book search.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Open-Access Shelving:</strong> Students can freely browse reference stacks.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>200+ Seating Capacity:</strong> Spacious, naturally illuminated reading halls.</span></li>
              </ul>
            </div>

            <div className="cl-card cl-card-emerald-top" id="conventional-library">
              <div className="cl-card-img-wrap">
                <img src="/images/campus-life/IMG20250725115215.jpg" alt="Conventional Library" className="cl-card-img" />
                <span className="cl-card-tag">Print Archives</span>
              </div>
              <h3 className="cl-card-title">Conventional Library</h3>
              <p className="cl-card-desc">
                A repository of wisdom and tradition, housing extensive print collections across Computer Science, Information Technology, Electronics &amp; Communication, and Humanities &amp; Sciences.
              </p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span><strong>Over 25,000+ Printed Books:</strong> Standard textbooks and reference guides.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Question Paper Bank:</strong> Previous years' JNTUH exam archives.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Dissertation Vault:</strong> Bound final-year B.Tech project thesis dissertations.</span></li>
              </ul>
            </div>

            <div className="cl-card cl-card-navy-top" id="digital-library">
              <div className="cl-card-img-wrap">
                <img src="/images/campus-life/IMG20250725122003.jpg" alt="Digital Library" className="cl-card-img" />
                <span className="cl-card-tag">Digital E-Resources</span>
              </div>
              <h3 className="cl-card-title">Digital Library</h3>
              <p className="cl-card-desc">
                Equipped with modern multimedia computing terminals connected to a high-speed dedicated 1 Gbps lease line, providing 24/7 access to world-class online databases, e-books, and video lectures.
              </p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span><strong>IEEE Xplore Access:</strong> Thousands of peer-reviewed journal papers.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>DELNET &amp; NDL:</strong> National Digital Library of India integration.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>NPTEL / SWAYAM Video Repository:</strong> Terabytes of IIT &amp; IISc recorded video courses.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Smart Classrooms & AIML Labs Section */}
      <section id="classrooms-labs" className="cl-section">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-microchip"></i> Smart Classrooms &amp; Advanced Laboratories</span>
            <h2 className="cl-section-title">Smart Learning &amp; AI-Driven Computing Centers</h2>
            <p className="cl-section-desc">
              Smart learning for the smart generation. Integrating interactive projection, digital podiums, and state-of-the-art computational laboratories.
            </p>
          </div>

          <div className="cl-grid-3">
            <div className="cl-card cl-card-navy-top" id="e-class-rooms">
              <div className="cl-card-img-wrap">
                <img src="/images/campus-life/IMG20250725123326.jpg" alt="E-Classrooms RITW" className="cl-card-img" />
                <span className="cl-card-tag">Interactive Theatres</span>
              </div>
              <h3 className="cl-card-title">E-Class Rooms</h3>
              <p className="cl-card-desc">
                RITW's e-classrooms integrate high-definition interactive projectors, audio-visual reinforcement systems, smart boards, and digital lecterns to dynamically illustrate complex engineering concepts.
              </p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span>Interactive Smart Boards with real-time digital whiteboarding.</span></li>
                <li><i className="fas fa-check-circle"></i> <span>Acoustic speech reinforcement with collar microphones and speakers.</span></li>
              </ul>
            </div>

            <div className="cl-card cl-card-emerald-top" id="aiml-labs">
              <div className="cl-card-img-wrap">
                <img src="/images/campus-life/IMG20250725121056.jpg" alt="AIML & Data Science Labs" className="cl-card-img" />
                <span className="cl-card-tag">Advanced Research Lab</span>
              </div>
              <h3 className="cl-card-title">AIML &amp; Data Science Labs</h3>
              <p className="cl-card-desc">
                Equipped with multi-core GPU computing workstations, high-speed switching, and industry-standard machine learning stacks for deep learning, generative AI, and computer vision projects.
              </p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span>Multi-core GPU systems with Python, TensorFlow, PyTorch &amp; OpenCV.</span></li>
                <li><i className="fas fa-check-circle"></i> <span>Incubation center for hackathon prototypes and sponsored research.</span></li>
              </ul>
            </div>

            <div className="cl-card cl-card-navy-top" id="seminar-halls">
              <div className="cl-card-img-wrap">
                <img src="/images/campus-life/13-6-23_women_cyberabad__2_.jpg" alt="Seminar Halls & Auditoriums" className="cl-card-img" />
                <span className="cl-card-tag">Acoustic Auditoriums</span>
              </div>
              <h3 className="cl-card-title">Seminar Halls &amp; Auditoriums</h3>
              <p className="cl-card-desc">
                Fully air-conditioned acoustically engineered auditoriums and seminar halls with surround sound, widescreen digital projection, motorized screens, and video conferencing capabilities.
              </p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span>500+ seat central auditorium and departmental seminar halls.</span></li>
                <li><i className="fas fa-check-circle"></i> <span>Hosts national IEEE symposiums, hackathons, and guest lectures.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Academic Kiosks Section */}
      <section id="kiosks" className="cl-section cl-section-subtle">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-desktop"></i> Self-Service &amp; Skill Development</span>
            <h2 className="cl-section-title">Academic Support Kiosks &amp; Learning Cells</h2>
            <p className="cl-section-desc">
              Connecting students to global technical standards, national certification platforms, and specialized remedial counseling.
            </p>
          </div>

          <div className="cl-grid-3">
            <div className="cl-card" id="ieee-kiosk">
              <div className="cl-card-img-wrap" style={{ height: '160px' }}>
                <img src="/images/campus-life/IEEE.jpg" alt="IEEE Kiosk" className="cl-card-img" />
                <span className="cl-card-tag">Global Standards</span>
              </div>
              <h3 className="cl-card-title">IEEE-Kiosk</h3>
              <p className="cl-card-desc">
                Dedicated terminal connecting scholars to the IEEE Student Branch, global design competitions, and women-in-engineering (WIE) chapters.
              </p>
            </div>

            <div className="cl-card" id="nptel-kiosk">
              <div className="cl-card-img-wrap" style={{ height: '160px' }}>
                <img src="/images/campus-life/NPTEL.jpg" alt="NPTEL Kiosk" className="cl-card-img" />
                <span className="cl-card-tag">SWAYAM / NPTEL</span>
              </div>
              <h3 className="cl-card-title">NPTEL-Kiosk</h3>
              <p className="cl-card-desc">
                Facilitating access to IIT/IISc video courses, NPTEL/SWAYAM certification registration, and university credit transfer guidance.
              </p>
            </div>

            <div className="cl-card" id="mhrd-kiosk">
              <div className="cl-card-img-wrap" style={{ height: '160px' }}>
                <img src="/images/campus-life/MHRD-AICTE-UGC-NSDC-TASK-Kiosk.jpg" alt="MHRD AICTE UGC TASK Kiosk" className="cl-card-img" />
                <span className="cl-card-tag">National Initiatives</span>
              </div>
              <h3 className="cl-card-title">MHRD-AICTE-TASK Kiosk</h3>
              <p className="cl-card-desc">
                Connecting students to TASK (Telangana Academy for Skill and Knowledge), AICTE internships, and national employability certifications.
              </p>
            </div>

            <div className="cl-card" id="discussion-chambers">
              <div className="cl-icon-box">
                <i className="fas fa-comments"></i>
              </div>
              <h3 className="cl-card-title">Discussion Chambers</h3>
              <p className="cl-card-desc">
                Sound-insulated spaces designed for collaborative brainstorming, peer code reviews, and hackathon project discussions.
              </p>
            </div>

            <div className="cl-card" id="remedial-kiosk">
              <div className="cl-icon-box cl-icon-box-emerald">
                <i className="fas fa-user-graduate"></i>
              </div>
              <h3 className="cl-card-title">Remedial Kiosk</h3>
              <p className="cl-card-desc">
                Personalized academic support to strengthen foundational concepts, problem-solving skills, and university exam preparation.
              </p>
            </div>

            <div className="cl-card" id="slow-learners-kiosk">
              <div className="cl-icon-box">
                <i className="fas fa-heart"></i>
              </div>
              <h3 className="cl-card-title">Slow Learner's Kiosk</h3>
              <p className="cl-card-desc">
                Customized pacing, simplified step-by-step tutorial modules, and supportive mentoring ensuring every scholar succeeds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Student Amenities Section */}
      <section id="amenities" className="cl-section">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-concierge-bell"></i> Campus Convenience</span>
            <h2 className="cl-section-title">Student Amenities &amp; Support Facilities</h2>
            <p className="cl-section-desc">
              Safe, comfortable, and hygienic utilities that enrich daily campus life and support scholar wellness.
            </p>
          </div>

          <div className="cl-grid-4">
            <div className="cl-card" id="ro-plant">
              <div className="cl-icon-box cl-icon-box-emerald">
                <i className="fas fa-tint"></i>
              </div>
              <h3 className="cl-card-title">Pure &amp; Safe RO Plant</h3>
              <p className="cl-card-desc">Commercial multi-stage Reverse Osmosis filtration supplying mineral-tested chilled drinking water across all floors.</p>
            </div>

            <div className="cl-card" id="cafeteria">
              <div className="cl-icon-box">
                <i className="fas fa-utensils"></i>
              </div>
              <h3 className="cl-card-title">Cafeteria &amp; Juice Center</h3>
              <p className="cl-card-desc">Nutritious south-Indian breakfasts, thali lunches, fresh fruit juices, and hygienic snacks under strict sanitation standards.</p>
            </div>

            <div className="cl-card" id="medical-safety">
              <div className="cl-icon-box cl-icon-box-emerald">
                <i className="fas fa-first-aid"></i>
              </div>
              <h3 className="cl-card-title">Medical &amp; Safety Center</h3>
              <p className="cl-card-desc">First-aid clinic with patient beds, emergency medicines, wheelchair support, and an on-call physician and nurse.</p>
            </div>

            <div className="cl-card" id="power-backup">
              <div className="cl-icon-box">
                <i className="fas fa-bolt"></i>
              </div>
              <h3 className="cl-card-title">100% DG Power Backup</h3>
              <p className="cl-card-desc">Heavy-duty generator backup ensuring uninterrupted power supply for computing labs, smart classrooms, and examinations.</p>
            </div>

            <div className="cl-card" id="water-harvesting">
              <div className="cl-icon-box cl-icon-box-emerald">
                <i className="fas fa-water"></i>
              </div>
              <h3 className="cl-card-title">Rainwater Harvesting</h3>
              <p className="cl-card-desc">Percolation pits and rooftop drainage shafts actively recharging groundwater tables and conserving water resources.</p>
            </div>

            <div className="cl-card" id="social-welfare">
              <div className="cl-icon-box">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <h3 className="cl-card-title">Social Welfare Services</h3>
              <p className="cl-card-desc">Assisting scholars with government scholarships (e-PASS, Post-Matric, NSP) and student insurance schemes.</p>
            </div>

            <div className="cl-card" id="transportation">
              <div className="cl-icon-box cl-icon-box-emerald">
                <i className="fas fa-bus"></i>
              </div>
              <h3 className="cl-card-title">Fleet Transportation</h3>
              <p className="cl-card-desc">Chartered buses serving prime transit routes across Hyderabad for faculty, day scholars, and campus visitors.</p>
            </div>

            <div className="cl-card" id="other-facilities">
              <div className="cl-icon-box">
                <i className="fas fa-shapes"></i>
              </div>
              <h3 className="cl-card-title">Special Support Centers</h3>
              <p className="cl-card-desc">Stationery store, reprographic kiosk, parent lounge, and 24/7 security control post maintaining campus safety.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Sports & Gymnasium Section */}
      <section id="sports" className="cl-section cl-section-subtle">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-trophy"></i> Health &amp; Athletics</span>
            <h2 className="cl-section-title">Department of Physical Education &amp; Sports Complex</h2>
            <p className="cl-section-desc">
              Established in 2016, the Department of Physical Education promotes physical fitness, sportsmanship, and mental endurance under certified physical directors.
            </p>
          </div>

          <div className="cl-grid-3">
            <div className="cl-card cl-card-navy-top">
              <div className="cl-icon-box">
                <i className="fas fa-running"></i>
              </div>
              <h3 className="cl-card-title">Outdoor Sports Grounds</h3>
              <p className="cl-card-desc">Dedicated courts maintained to university tournament standards for daily recreation and competitive tournaments.</p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span><strong>Volleyball &amp; Throwball:</strong> Full regulation playing courts.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Kho-Kho &amp; Kabaddi:</strong> Tournament-standard marked courts.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Box-Cricket &amp; Net Cricket:</strong> Safe cricket practice pitches.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Tenni-Koit &amp; Tug-of-War:</strong> Active recreation grounds.</span></li>
              </ul>
            </div>

            <div className="cl-card cl-card-emerald-top">
              <div className="cl-icon-box cl-icon-box-emerald">
                <i className="fas fa-chess"></i>
              </div>
              <h3 className="cl-card-title">Indoor Sports Pavilion</h3>
              <p className="cl-card-desc">A sports room where scholars hone focus, strategy, reflexes, and mind-body balance away from academic rigors.</p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span><strong>Table Tennis:</strong> Competition-grade tables and racquets.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Chess Arena:</strong> International boards and digital timers.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Carrom &amp; Yoga:</strong> Dedicated serene space with mats.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Judo &amp; Self-Defense:</strong> Martial arts training for personal safety.</span></li>
              </ul>
            </div>

            <div className="cl-card cl-card-navy-top" id="open-gym">
              <div className="cl-icon-box">
                <i className="fas fa-dumbbell"></i>
              </div>
              <h3 className="cl-card-title">Open Outdoor Gym</h3>
              <p className="cl-card-desc">Equipped with 10 weather-resistant outdoor fitness equipment stations designed for strength building and aerobic health.</p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span><strong>10 Modern Exercise Items:</strong> Air walkers, cross trainers, rowing benches, waist twisters.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Open-Air Wellness:</strong> Exercising in fresh morning and evening air surrounded by greenery.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Free &amp; Accessible:</strong> Open to all scholars throughout college hours.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Transport & Metro Section */}
      <section id="transport" className="cl-section">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-subway"></i> Strategic Urban Connectivity</span>
            <h2 className="cl-section-title">Transportation &amp; JNTU Metro Access</h2>
            <p className="cl-section-desc">
              Convenient, accessible, and eco-friendly commuting located just 300 meters from the JNTU College Metro Station on Nizampet Road, Kukatpally.
            </p>
          </div>

          <div className="cl-grid-2">
            <div className="cl-card cl-card-emerald-top">
              <div className="cl-icon-box cl-icon-box-emerald">
                <i className="fas fa-train"></i>
              </div>
              <h3 className="cl-card-title">Hyderabad Metro Rail — 300m Away</h3>
              <p className="cl-card-desc">
                RITW enables day scholars from any corner of Hyderabad—Secunderabad, Dilsukhnagar, Ameerpet, Hitec City, or Miyapur—to step off the metro platform and walk straight into our safe, guarded campus gates within two minutes.
              </p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span><strong>Direct Red Line Connectivity:</strong> JNTU College Metro Station right opposite.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Safe Walkway:</strong> Broad, well-lit, CCTV-monitored street access to campus.</span></li>
                <li><i className="fas fa-check-circle"></i> <span><strong>Punctual &amp; Stress-Free:</strong> Predictable travel times free from road traffic.</span></li>
              </ul>
            </div>

            <div className="cl-card cl-card-navy-top">
              <div className="cl-icon-box">
                <i className="fas fa-bus-alt"></i>
              </div>
              <h3 className="cl-card-title">Institutional Bus Corridors</h3>
              <p className="cl-card-desc">
                For faculty and students preferring chartered college bus transport, RITW operates comfortable buses covering prime residential zones:
              </p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span>Secunderabad • Begumpet • Ameerpet • Kukatpally</span></li>
                <li><i className="fas fa-check-circle"></i> <span>Dilsukhnagar • Koti • Khairatabad • KPHB</span></li>
                <li><i className="fas fa-check-circle"></i> <span>Mehdipatnam • Gachibowli • Kondapur • JNTU</span></li>
                <li><i className="fas fa-check-circle"></i> <span>ECIL • Bowenpally • Balanagar • Kukatpally</span></li>
                <li><i className="fas fa-check-circle"></i> <span>Uppal • Tarnaka • Alwal • Suchitra • Nizampet</span></li>
                <li><i className="fas fa-check-circle"></i> <span>Lingampally • Chandanagar • Miyapur • JNTU</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Student Clubs & EDC Section */}
      <section id="clubs" className="cl-section cl-section-subtle">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-users-cog"></i> Peer Learning &amp; Leadership</span>
            <h2 className="cl-section-title">Vibrant Student Clubs &amp; Entrepreneurship Cell</h2>
            <p className="cl-section-desc">
              Student-driven engineering chapters building modern software, hardware, and AI innovations.
            </p>
          </div>

          <div className="cl-grid-3">
            <div className="cl-card cl-card-navy-top" id="vibrant-student-clubs">
              <div className="cl-card-img-wrap" style={{ height: '180px' }}>
                <img src="/images/campus-life/0002.jpg" alt="CSE & IT Student Clubs" className="cl-card-img" />
                <span className="cl-card-tag">Computing Chapters</span>
              </div>
              <h3 className="cl-card-title">CSE &amp; IT Department Clubs</h3>
              <p className="cl-card-desc">Focusing on AI, Machine Learning, Data Science, Cybersecurity, Web &amp; App Development, and competitive coding sprints.</p>
            </div>

            <div className="cl-card cl-card-emerald-top">
              <div className="cl-card-img-wrap" style={{ height: '180px' }}>
                <img src="/images/campus-life/0003.jpg" alt="ECE Department Clubs" className="cl-card-img" />
                <span className="cl-card-tag">Electronics &amp; Hardware</span>
              </div>
              <h3 className="cl-card-title">ECE Department Clubs</h3>
              <p className="cl-card-desc">Exploring VLSI, Embedded Systems, IoT, Robotics, circuit design competitions, and drone prototyping.</p>
            </div>

            <div className="cl-card cl-card-navy-top">
              <div className="cl-card-img-wrap" style={{ height: '180px' }}>
                <img src="/images/campus-life/Litrature_Club.jpeg" alt="Literature and Oratory Club" className="cl-card-img" />
                <span className="cl-card-tag">Culture &amp; Communication</span>
              </div>
              <h3 className="cl-card-title">Literature, Eco &amp; Arts Clubs</h3>
              <p className="cl-card-desc">Model UN debates, public speaking, botanical conservation with Horticulture Club, and performing arts showcases.</p>
            </div>
          </div>

          <div className="cl-card cl-card-emerald-top" style={{ marginTop: '24px' }} id="edc">
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div className="cl-icon-box cl-icon-box-emerald" style={{ width: '56px', height: '56px', fontSize: '1.6rem' }}>
                <i className="fas fa-lightbulb"></i>
              </div>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h3 className="cl-card-title" style={{ fontSize: '1.35rem' }}>Entrepreneurship Development Cell (EDC)</h3>
                <p className="cl-card-desc">
                  Fostering innovation, startup incubations, and women tech entrepreneurs. The EDC at RITW creates an ecosystem encouraging creativity, business model generation, IP rights awareness, and partnerships with T-Hub and WE Hub.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. NSS Cell Section */}
      <section id="nss" className="cl-section">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-hands-helping"></i> Civic Service &amp; Empathy</span>
            <h2 className="cl-section-title">National Service Scheme (NSS Cell)</h2>
            <p className="cl-section-desc">
              "Not Me, But You" — A legacy of service, leadership, and social responsibility since 2009.
            </p>
          </div>

          <div className="cl-grid-2">
            <div className="cl-card cl-card-navy-top">
              <h3 className="cl-card-title">NSS at RITW: Aims &amp; Vision</h3>
              <p className="cl-card-desc">
                Promoting value-based education and social commitment through rural village adoption, mega blood donation drives with Indian Red Cross, Haritha Haram tree plantation, and healthcare awareness camps.
              </p>
              <ul className="cl-card-list">
                <li><i className="fas fa-check-circle"></i> <span>Digital literacy and hygiene awareness drives in adopted villages.</span></li>
                <li><i className="fas fa-check-circle"></i> <span>Over 250+ units of blood donated annually by scholars and faculty.</span></li>
                <li><i className="fas fa-check-circle"></i> <span>Swachh Bharat and environmental sustainability campaigns.</span></li>
              </ul>
            </div>

            <div className="cl-card cl-card-emerald-top" id="nss-coordinator">
              <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--cl-navy)', color: '#ffffff', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                  <i className="fas fa-user-tie"></i>
                </div>
                <div>
                  <span className="cl-badge cl-badge-emerald">NSS Programme Officer</span>
                  <h3 className="cl-card-title" style={{ margin: '4px 0 2px' }}>Mrs. G. Anisha</h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Assistant Professor &amp; NSS Coordinator</span>
                </div>
              </div>
              <p className="cl-card-desc">
                Leading RITW's NSS volunteer corps for over a decade in organizing community healthcare camps, blood drives, and state youth leadership conventions.
              </p>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px', marginTop: '10px', fontSize: '0.85rem' }}>
                <div><strong style={{ color: 'var(--cl-navy)' }}>Email:</strong> nss@ritw.ac.in &bull; <strong style={{ color: 'var(--cl-navy)' }}>Phone:</strong> +91-939-122-6038</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Statutory NSS Events Tables Section */}
      <section id="nss-events" className="cl-section cl-section-subtle">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-clipboard-list"></i> Statutory Activity Reports</span>
            <h2 className="cl-section-title">NSS Activities &amp; Events Repository</h2>
            <p className="cl-section-desc">
              Official records of all National Service Scheme events, awareness mock drills, and community initiatives conducted across academic years.
            </p>
          </div>

          <div className="cl-tab-strip">
            <button 
              type="button" 
              className={'cl-tab-btn ' + (activeNssYear === '2024-25' ? 'active' : '')}
              onClick={() => setActiveNssYear('2024-25')}
            >
              Academic Year 2024–2025
            </button>
            <button 
              type="button" 
              className={'cl-tab-btn ' + (activeNssYear === '2023-24' ? 'active' : '')}
              onClick={() => setActiveNssYear('2023-24')}
            >
              Academic Year 2023–2024
            </button>
            <button 
              type="button" 
              className={'cl-tab-btn ' + (activeNssYear === '2022-23' ? 'active' : '')}
              onClick={() => setActiveNssYear('2022-23')}
            >
              Academic Year 2022–2023
            </button>
          </div>

          <div className="cl-table-container">
            <div className="cl-table-responsive">
              <table className="cl-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>S.No</th>
                    <th style={{ width: '110px' }}>Date</th>
                    <th>Name of the Activity</th>
                    <th>Organizing Unit / Collaborating Agency</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>Teachers</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>Students</th>
                  </tr>
                </thead>
                <tbody>
                  {currentNssEvents.map((ev, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{ev.sno || idx + 1}</td>
                      <td style={{ fontWeight: '600', color: 'var(--cl-navy)' }}>{ev.date}</td>
                      <td style={{ fontWeight: '600' }}>{ev.title}</td>
                      <td>{ev.agency}</td>
                      <td style={{ textAlign: 'center' }}>{ev.teachers}</td>
                      <td style={{ textAlign: 'center' }}>{ev.students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 14. NCC Wing Section */}
      <section id="ncc" className="cl-section">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-medal"></i> Military Training &amp; Discipline</span>
            <h2 className="cl-section-title">National Cadet Corps (NCC Wing)</h2>
            <p className="cl-section-desc">
              "Unity &amp; Discipline" — Developing character, courage, and comradeship among young women through military training.
            </p>
          </div>

          <div className="cl-grid-2">
            <div className="cl-card cl-card-navy-top">
              <h3 className="cl-card-title">NCC: Shaping Courage &amp; Leadership</h3>
              <p className="cl-card-desc">
                Structured training including drill precision, weapon handling, annual combined training camps (CATC), obstacle navigation, and ceremonial parade salutes.
              </p>
            </div>

            <div className="cl-card cl-card-emerald-top">
              <h3 className="cl-card-title">'B' &amp; 'C' Certificate Armed Forces Benefits</h3>
              <p className="cl-card-desc">
                Cadets earning 'B' and 'C' certificates qualify for special preference quotas and direct entry to Service Selection Board (SSB) officer interviews for the Indian Army, Air Force, and Navy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 15. Barrier-Free Accessibility Section */}
      <section id="accessibility" className="cl-section cl-section-subtle">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-wheelchair"></i> Universal Inclusivity</span>
            <h2 className="cl-section-title">Barrier-Free Campus for Divyangjan</h2>
            <p className="cl-section-desc">
              Statutory accessibility features ensuring dignified, barrier-free mobility for differently-abled scholars.
            </p>
          </div>

          <div className="cl-grid-4">
            <div className="cl-card">
              <div className="cl-icon-box cl-icon-box-emerald"><i className="fas fa-road"></i></div>
              <h3 className="cl-card-title">Access Ramps</h3>
              <p className="cl-card-desc">Smooth non-slip ramps with handrails at all building portals.</p>
            </div>
            <div className="cl-card">
              <div className="cl-icon-box"><i className="fas fa-walking"></i></div>
              <h3 className="cl-card-title">Tactile Paving</h3>
              <p className="cl-card-desc">Tactile guide corridors assisting visually challenged scholars.</p>
            </div>
            <div className="cl-card">
              <div className="cl-icon-box cl-icon-box-emerald"><i className="fas fa-wheelchair"></i></div>
              <h3 className="cl-card-title">Wheelchairs &amp; Lifts</h3>
              <p className="cl-card-desc">Wheelchair station at reception and elevators for vertical transit.</p>
            </div>
            <div className="cl-card">
              <div className="cl-icon-box"><i className="fas fa-braille"></i></div>
              <h3 className="cl-card-title">Braille &amp; Washrooms</h3>
              <p className="cl-card-desc">Braille learning software and spacious accessible restrooms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 16. Photo Gallery Section */}
      <section id="gallery" className="cl-section">
        <div className="container">
          <div className="cl-section-header">
            <span className="cl-section-badge"><i className="fas fa-camera-retro"></i> Visual Showcase</span>
            <h2 className="cl-section-title">Life at RITW: Moments &amp; Memories</h2>
            <p className="cl-section-desc">
              Authentic glimpses of daily academic life, computing labs, sports championships, and cultural fests.
            </p>
          </div>

          <div className="cl-tab-strip">
            <button type="button" className={'cl-tab-btn ' + (galleryFilter === 'all' ? 'active' : '')} onClick={() => setGalleryFilter('all')}>All Moments</button>
            <button type="button" className={'cl-tab-btn ' + (galleryFilter === 'campus' ? 'active' : '')} onClick={() => setGalleryFilter('campus')}>Campus &amp; Infrastructure</button>
            <button type="button" className={'cl-tab-btn ' + (galleryFilter === 'learning' ? 'active' : '')} onClick={() => setGalleryFilter('learning')}>Libraries &amp; Classrooms</button>
            <button type="button" className={'cl-tab-btn ' + (galleryFilter === 'sports' ? 'active' : '')} onClick={() => setGalleryFilter('sports')}>Sports &amp; Fitness</button>
            <button type="button" className={'cl-tab-btn ' + (galleryFilter === 'events' ? 'active' : '')} onClick={() => setGalleryFilter('events')}>Clubs &amp; Events</button>
          </div>

          <div className="cl-gallery-grid">
            {filteredPhotos.map((item) => (
              <div key={item.id} className="cl-gallery-item" onClick={() => setActiveModalImg(item)}>
                <div className="cl-gallery-thumb-wrap">
                  <img src={item.img} alt={item.title} className="cl-gallery-thumb" />
                </div>
                <div className="cl-gallery-info">
                  <div className="cl-gallery-title">{item.title}</div>
                  <div className="cl-gallery-meta">{item.tag}</div>
                </div>
              </div>
            ))}
          </div>

          {activeModalImg && (
            <div className="cl-lightbox active" onClick={() => setActiveModalImg(null)}>
              <div className="cl-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="cl-lightbox-close" onClick={() => setActiveModalImg(null)}>&times;</button>
                <div className="cl-lightbox-img-wrap">
                  <img src={activeModalImg.img} alt={activeModalImg.title} className="cl-lightbox-img" />
                </div>
                <div className="cl-lightbox-body">
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cl-navy)', margin: 0 }}>{activeModalImg.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--cl-emerald)', fontWeight: 600 }}>RITW Campus Archive</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
