import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const CLUBS = [
  {
    name: 'Google Developer Student Club (GDSC RITW)',
    category: 'TECHNICAL',
    icon: 'fab fa-google',
    color: '#4285F4',
    desc: 'Empowering women student developers to build mobile, web, and cloud solutions using Google technologies. Regular Android study jams, Flutter bootcamps, and Firebase workshops.'
  },
  {
    name: 'CodeRishi Competitive Programming Club',
    category: 'CODING',
    icon: 'fas fa-code',
    color: '#392F87',
    desc: 'Fostering competitive coding acumen on LeetCode, CodeChef, and HackerRank. Weekly peer coding contests, algorithmic problem walkthroughs, and mock technical interview rounds.'
  },
  {
    name: 'Robotics & IoT Innovation Hub',
    category: 'HARDWARE',
    icon: 'fas fa-robot',
    color: '#159B62',
    desc: 'Hands-on hardware lab for microcontrollers, Arduino, Raspberry Pi, sensor arrays, and drone prototyping. Students build smart agriculture and home automation prototypes.'
  },
  {
    name: 'Cisco Networking & Cyber Club',
    category: 'CYBERSECURITY',
    icon: 'fas fa-shield-alt',
    color: '#E11D48',
    desc: 'Focusing on network packet analysis, zero-trust security architecture, ethical hacking fundamentals, and Cisco CCNA certified training curricula.'
  },
  {
    name: 'AI & Data Science Research Chapter',
    category: 'DATA SCIENCE',
    icon: 'fas fa-brain',
    color: '#7C3AED',
    desc: 'Workshops on predictive modeling, computer vision, natural language processing, and Kaggle competitive submissions using Python and PyTorch.'
  },
  {
    name: 'Literary & Oratory Society',
    category: 'SOFT SKILLS',
    icon: 'fas fa-microphone-alt',
    color: '#D97706',
    desc: 'Cultivating debate, Model United Nations (MUN), public speaking, technical writing, and corporate presentation flair to ensure confident communication.'
  }
];

const NSS_ACTIVITIES = [
  {
    title: 'Rural Village Adoption & Digital Literacy',
    location: 'Medchal District Villages',
    desc: 'Scholars conduct computer literacy and basic internet banking awareness drives for rural women and school children.',
    icon: 'fas fa-laptop-house'
  },
  {
    title: 'Annual Mega Blood Donation Drive',
    location: 'Campus Auditorium in partnership with Indian Red Cross',
    desc: 'Over 250+ units donated annually by scholars and faculty to assist regional pediatric and emergency blood banks.',
    icon: 'fas fa-tint'
  },
  {
    title: 'Haritha Haram Environmental Plantation',
    location: 'Campus Grounds & Kukatpally Green Belt',
    desc: 'Mass sapling plantation and waste segregation campaigns promoting ecological conservation and plastic-free green zones.',
    icon: 'fas fa-seedling'
  },
  {
    title: 'Health & Hygiene Medical Camps',
    location: 'Local Communities & Primary Schools',
    desc: 'Distributing sanitary essentials, wellness kits, and organizing pediatric eye checkups with volunteer doctors.',
    icon: 'fas fa-heartbeat'
  }
];

const WEC_INITIATIVES = [
  {
    title: '"SHE POWER" Self-Defense Certification',
    desc: 'Comprehensive unarmed combat and self-defense training conducted by certified martial arts instructors to bolster personal security and self-assurance.',
    icon: 'fas fa-fist-raised'
  },
  {
    title: 'POSH Act & Legal Rights Awareness',
    desc: 'Annual workshops addressed by senior legal practitioners explaining constitutional rights, workplace equity, cyber safety, and institutional POSH safeguards.',
    icon: 'fas fa-balance-scale'
  },
  {
    title: 'Mental Wellbeing & Stress Resilience',
    desc: 'One-on-one professional counseling sessions and group mindfulness workshops helping scholars navigate academic rigors with emotional poise.',
    icon: 'fas fa-spa'
  },
  {
    title: 'Women in Tech Leadership Conclave',
    desc: 'Keynote panels featuring prominent women engineering directors and unicorn founders sharing leadership journeys and corporate career navigation.',
    icon: 'fas fa-user-graduate'
  }
];

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Annual Cultural Fest - Rishi Utsav',
    category: 'cultural',
    img: '/images/slider/Cultural.jpg',
    tag: 'Rishi Utsav Gala'
  },
  {
    id: 2,
    title: 'Technical Symposium & Hackathon',
    category: 'tech',
    img: '/images/slider/Tech-Cult.jpg',
    tag: 'Hackathon Arena'
  },
  {
    id: 3,
    title: 'Inter-Collegiate Sports & Athletic Meet',
    category: 'sports',
    img: '/images/slider/Sports and Fitness.jpg',
    tag: 'Sports Complex'
  },
  {
    id: 4,
    title: 'Modern High-Tech Computing Center',
    category: 'campus',
    img: '/images/tech-clubs.jpg',
    tag: 'AI Computing Lab'
  },
  {
    id: 5,
    title: 'Academic Block & Campus Quad',
    category: 'campus',
    img: '/images/clg-infra-1-000.jpg',
    tag: 'Kukatpally Campus'
  },
  {
    id: 6,
    title: 'Scholars Innovation & Student Clubs',
    category: 'tech',
    img: '/images/slider/RISHI_SLIDER_4.jpg',
    tag: 'GDSC & Club Hub'
  },
  {
    id: 7,
    title: 'Cultural Dance & Musical Performance',
    category: 'cultural',
    img: '/images/slider/RISHI_SLIDER_8.jpg',
    tag: 'Carnatic & Western Arts'
  },
  {
    id: 8,
    title: 'Annual Convocation & Graduation Ceremony',
    category: 'campus',
    img: '/images/slider/RISHI_SLIDER_1.jpg',
    tag: 'Autonomous Convocation'
  },
  {
    id: 9,
    title: 'Student Seminar & Technical Keynote',
    category: 'tech',
    img: '/images/slider/RISHI_SLIDER_7.jpg',
    tag: 'Seminar Hall'
  }
];

export default function CampusLife() {
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [lightboxImg, setLightboxImg] = useState(null);

  const filteredGallery = galleryFilter === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === galleryFilter);

  return (
    <div className="campus-life-page">
      {/* 1. Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Campus Life</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">Student Experience</span>
          </div>
          <span className="page-badge">VIBRANT STUDENT COMMUNITY &bull; KUKATPALLY CAMPUS</span>
          <h1 className="page-title">Life at RITW: Innovation, Culture &amp; Sisterhood</h1>
          <p className="page-subtitle">
            An empowering, secure ecosystem fostering intellectual curiosity, technical leadership, cultural celebration, and physical wellness.
          </p>
        </div>
      </section>

      {/* 2. Anchor Navigation Bar */}
      <nav className="page-subnav-bar" aria-label="Campus Life section navigation">
        <div className="container subnav-inner">
          <a href="#overview" className="subnav-link">Overview</a>
          <a href="#cultural" className="subnav-link">Rishi Utsav &amp; Culture</a>
          <a href="#clubs" className="subnav-link">Technical Clubs</a>
          <a href="#nss" className="subnav-link">NSS &amp; Outreach</a>
          <a href="#wec" className="subnav-link">Women Empowerment</a>
          <a href="#sports" className="subnav-link">Sports &amp; Fitness</a>
          <a href="#gallery" className="subnav-link">Photo Gallery</a>
        </div>
      </nav>

      {/* 3. Overview Section */}
      <section id="overview" className="page-content-section">
        <div className="container">
          <div className="about-split-grid">
            <div>
              <span className="section-badge">STUDENT LIFE AT RITW</span>
              <h2 className="section-title">Beyond Classrooms: Fostering Well-Rounded Women Engineers</h2>
              <p className="paragraph-main">
                At Rishi M.S Institute of Engineering &amp; Technology for Women, education extends far beyond textbooks and lecture halls. Life on campus is a balanced amalgamation of rigorous academic pursuits, technical club activities, vibrant cultural festivals, and community outreach.
              </p>
              <p className="paragraph-secondary">
                Located right opposite the JNTU College Metro Station in Kukatpally, our safe and self-contained campus gives women scholars the freedom to explore their creativity, voice their ideas, build startup prototypes, and build lifelong bonds of sisterhood.
              </p>
              <div className="about-highlight-box" style={{ marginTop: '24px' }}>
                <h3 className="highlight-box-title">
                  <i className="fas fa-gem" aria-hidden="true"></i>
                  <span>Campus Life Pillars</span>
                </h3>
                <ul className="highlight-list">
                  <li>
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <div>
                      <strong>Safe &amp; Inclusive Campus:</strong>
                      <span>24/7 high-definition CCTV surveillance, biometric security, and full-time faculty mentoring.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <div>
                      <strong>15+ Student-Led Clubs:</strong>
                      <span>From Google Developer Student Clubs to Robotics, Carnatic vocal music, and public speaking.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <div>
                      <strong>Annual Mega Fest 'Rishi Utsav':</strong>
                      <span>Multi-day extravaganza attracting thousands of participants from across South India.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <div>
                      <strong>Direct Metro Accessibility:</strong>
                      <span>Zero-hassle, secure daily commuting with JNTU Metro right across the campus gates.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(36, 28, 92, 0.12)', border: '1px solid #e2e8f0' }}>
                <img 
                  src="/images/slider/Cultural.jpg" 
                  alt="Campus Life at RITW" 
                  style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '24px', background: '#ffffff' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--ritw-navy)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    SISTERHOOD &amp; CELEBRATION
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', marginTop: '6px', marginBottom: '10px' }}>
                    Memories for a Lifetime
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
                    From celebrating Traditional Day with classical Carnatic tributes to pitching smart city prototypes in all-night hackathons, every day at RITW empowers students to lead with confidence.
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <a href="#gallery" className="btn-cta btn-cta-navy" style={{ padding: '8px 16px', fontSize: '13px' }}>
                      <i className="fas fa-camera" aria-hidden="true"></i>
                      <span>View Gallery</span>
                    </a>
                    <Link to="/contact" className="btn-cta btn-cta-green" style={{ padding: '8px 16px', fontSize: '13px' }}>
                      <i className="fas fa-map-marked-alt" aria-hidden="true"></i>
                      <span>Visit Campus</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Rishi Utsav & Cultural Fest */}
      <section id="cultural" className="vision-mission-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">ANNUAL CULTURAL GALA</span>
            <h2 className="section-title">Rishi Utsav: Celebrating Art, Heritage &amp; Youth</h2>
            <p className="section-subtitle">A multi-day national cultural festival uniting rhythm, creativity, fashion, and joy.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '30px' }}>
            <div className="vm-card vm-card-navy">
              <div className="vm-icon-box">
                <i className="fas fa-music" aria-hidden="true"></i>
              </div>
              <h3 className="vm-title">Music &amp; Classical Tribute</h3>
              <p className="vm-text">
                Dedicated to the timeless memory of Bharat Ratna Smt. M.S. Subbulakshmi, the fest opens with classical Carnatic concerts, fusion bands, solo vocal contests, and instrumental recitals.
              </p>
            </div>

            <div className="vm-card vm-card-green">
              <div className="vm-icon-box">
                <i className="fas fa-theater-masks" aria-hidden="true"></i>
              </div>
              <h3 className="vm-title">Dance, Drama &amp; Runway</h3>
              <p className="vm-text">
                High-energy group choreography competitions, classical Kuchipudi showcases, theatrical street plays on social empowerment, and glamorous ethnic couture fashion walks.
              </p>
            </div>

            <div className="vm-card vm-card-navy">
              <div className="vm-icon-box">
                <i className="fas fa-palette" aria-hidden="true"></i>
              </div>
              <h3 className="vm-title">Fine Arts &amp; Literary Contests</h3>
              <p className="vm-text">
                Mehendi design, Rangoli competitions, spot painting, pottery, creative writing, elocution, and spirited inter-collegiate debate championships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Technical Clubs & Hackathons */}
      <section id="clubs" className="page-content-section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">INNOVATION &amp; TECH ECOSYSTEM</span>
            <h2 className="section-title">Technical Clubs &amp; Hackathon Hubs</h2>
            <p className="section-subtitle">Student-driven engineering chapters building modern software, hardware, and AI innovations.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '30px' }}>
            {CLUBS.map((club, idx) => (
              <div 
                key={idx} 
                className="gov-card" 
                style={{ textAlign: 'left', padding: '24px', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div 
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '12px', 
                      background: `${club.color}15`, 
                      color: club.color, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '22px' 
                    }}
                  >
                    <i className={club.icon} aria-hidden="true"></i>
                  </div>
                  <span 
                    style={{ 
                      fontSize: '10px', 
                      fontWeight: 800, 
                      padding: '3px 8px', 
                      borderRadius: '100px', 
                      background: '#f1f5f9', 
                      color: '#475569', 
                      letterSpacing: '0.6px' 
                    }}
                  >
                    {club.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>
                  {club.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                  {club.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NSS & Community Outreach */}
      <section id="nss" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">SOCIAL IMPACT &amp; CIVIC SERVICE</span>
            <h2 className="section-title">National Service Scheme (NSS Cell)</h2>
            <p className="section-subtitle">Instilling empathy, community leadership, and social responsibility in our young engineers.</p>
          </div>

          <div className="cells-grid" style={{ marginTop: '30px' }}>
            {NSS_ACTIVITIES.map((act, idx) => (
              <div key={idx} className="cell-card">
                <div className="cell-icon">
                  <i className={act.icon} aria-hidden="true"></i>
                </div>
                <h3 className="cell-title">{act.title}</h3>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ritw-green)', marginBottom: '8px' }}>
                  <i className="fas fa-map-marker-alt" aria-hidden="true" style={{ marginRight: '4px' }}></i>
                  {act.location}
                </div>
                <p className="cell-desc">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Women Empowerment Cell */}
      <section id="wec" className="vision-mission-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">INDEPENDENCE &amp; LEADERSHIP</span>
            <h2 className="section-title">Women Empowerment Cell (WEC)</h2>
            <p className="section-subtitle">Championing dignity, physical safety, constitutional rights, and corporate leadership.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '30px' }}>
            {WEC_INITIATIVES.map((wec, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: '#ffffff', 
                  borderRadius: '14px', 
                  padding: '24px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s ease'
                }}
              >
                <div 
                  style={{ 
                    width: '46px', 
                    height: '46px', 
                    borderRadius: '10px', 
                    background: 'var(--ritw-navy-soft)', 
                    color: 'var(--ritw-navy)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '20px',
                    marginBottom: '16px' 
                  }}
                >
                  <i className={wec.icon} aria-hidden="true"></i>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  {wec.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                  {wec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Sports & Athletic Complex */}
      <section id="sports" className="page-content-section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="about-split-grid">
            <div>
              <span className="section-badge">PHYSICAL FITNESS &amp; SPORTS</span>
              <h2 className="section-title">Sports Complex &amp; Athletic Vigor</h2>
              <p className="paragraph-main">
                Physical endurance and sportsmanship are fundamental to academic success. RITW provides state-of-the-art sports facilities under the direction of qualified physical education directors.
              </p>
              <div className="quality-policy-card" style={{ marginTop: '16px' }}>
                <div className="policy-badge">
                  <i className="fas fa-trophy" aria-hidden="true"></i>
                  <span>Inter-Collegiate Champions</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--ritw-text-main)', marginTop: '8px', lineHeight: '1.6' }}>
                  Our scholars regularly bring home gold and silver trophies from JNTUH Central Zone athletic tournaments, state chess championships, and regional inter-engineering badminton cups.
                </p>
              </div>
              <ul className="highlight-list" style={{ marginTop: '20px' }}>
                <li>
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <div>
                    <strong>Indoor Sports Pavilion:</strong>
                    <span>Wooden-floor badminton courts, table tennis stations, carrom, and chess rooms.</span>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <div>
                    <strong>Outdoor Grounds:</strong>
                    <span>Standard volleyball courts, throwball grounds, basketball arena, and cricket nets.</span>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <div>
                    <strong>Gymnasium &amp; Yoga Center:</strong>
                    <span>Cardio equipment, treadmills, elliptical trainers, and early-morning yoga classes.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
                <img 
                  src="/images/slider/Sports and Fitness.jpg" 
                  alt="Sports & Fitness at RITW" 
                  style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Interactive Photo Gallery */}
      <section id="gallery" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">MEMORIES &amp; MOMENTS</span>
            <h2 className="section-title">Campus Photo Gallery</h2>
            <p className="section-subtitle">Glimpses into student life, fests, labs, and celebrations at RITW.</p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '30px' }}>
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'cultural', label: 'Rishi Utsav & Fests' },
              { id: 'tech', label: 'Hackathons & Labs' },
              { id: 'sports', label: 'Sports & Fitness' },
              { id: 'campus', label: 'Campus & Infrastructure' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setGalleryFilter(tab.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '100px',
                  border: galleryFilter === tab.id ? '2px solid var(--ritw-navy)' : '1px solid #e2e8f0',
                  background: galleryFilter === tab.id ? 'var(--ritw-navy)' : '#ffffff',
                  color: galleryFilter === tab.id ? '#ffffff' : '#475569',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Photos Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredGallery.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  background: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
                onClick={() => setLightboxImg(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 25px rgba(36,28,92,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = '/images/slider/Cultural.jpg'; }}
                  />
                  <span 
                    style={{ 
                      position: 'absolute', 
                      bottom: '10px', 
                      left: '10px', 
                      background: 'rgba(36, 28, 92, 0.85)', 
                      backdropFilter: 'blur(4px)', 
                      color: '#ffffff', 
                      fontSize: '10px', 
                      fontWeight: 800, 
                      padding: '3px 8px', 
                      borderRadius: '4px',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
                <div style={{ padding: '14px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--ritw-green)', fontWeight: 600 }}>
                    Click to view full image &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Modal */}
          {lightboxImg && (
            <div 
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.88)',
                backdropFilter: 'blur(8px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
              onClick={() => setLightboxImg(null)}
            >
              <div 
                style={{
                  maxWidth: '900px',
                  width: '100%',
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                  position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: 'none',
                    fontSize: '18px',
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    zIndex: 2
                  }}
                  onClick={() => setLightboxImg(null)}
                >
                  &times;
                </button>
                <img 
                  src={lightboxImg.img} 
                  alt={lightboxImg.title} 
                  style={{ width: '100%', maxHeight: '550px', objectFit: 'contain', background: '#000000', display: 'block' }}
                />
                <div style={{ padding: '18px 24px', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{lightboxImg.title}</h3>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{lightboxImg.tag}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setLightboxImg(null)}
                    className="btn-cta btn-cta-navy"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

