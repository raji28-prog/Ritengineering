import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const INFRA_STATS = [
  { icon: 'fas fa-book', val: '25,000+', label: 'Library Volumes', sub: 'Technical books & reference guides' },
  { icon: 'fas fa-wifi', val: '1 Gbps', label: 'Optical Fiber Backbone', sub: 'High-speed campus-wide secure Wi-Fi' },
  { icon: 'fas fa-video', val: '200+', label: 'CCTV Surveillance', sub: '24/7 monitored women security net' },
  { icon: 'fas fa-bolt', val: '100%', label: 'DG Power Backup', sub: 'Uninterrupted power for labs & exams' }
];

const BUS_ROUTES = [
  { routeNo: 'Route 1', from: 'Secunderabad Station', via: 'Paradise &bull; Begumpet &bull; Panjagutta &bull; Ameerpet &bull; Kukatpally', time: '7:30 AM' },
  { routeNo: 'Route 2', from: 'Dilsukhnagar', via: 'Koti &bull; Lakdikapul &bull; Khairatabad &bull; Erragadda &bull; KPHB', time: '7:15 AM' },
  { routeNo: 'Route 3', from: 'Mehdipatnam', via: 'Tolichowki &bull; Gachibowli &bull; Kondapur &bull; Hafeezpet &bull; JNTU', time: '7:40 AM' },
  { routeNo: 'Route 4', from: 'ECIL ‘X’ Roads', via: 'Malkajgiri &bull; Bowenpally &bull; Balanagar &bull; Moosapet &bull; Kukatpally', time: '7:20 AM' },
  { routeNo: 'Route 5', from: 'Uppal Ring Road', via: 'Tarnaka &bull; Habsiguda &bull; Alwal &bull; Suchitra &bull; Nizampet', time: '7:15 AM' },
  { routeNo: 'Route 6', from: 'Lingampally / BHEL', via: 'Chandanagar &bull; Madinaguda &bull; Miyapur ‘X’ Roads &bull; JNTU', time: '7:50 AM' }
];

const AMENITIES_LIST = [
  {
    title: 'Primary Health Center',
    icon: 'fas fa-heartbeat',
    desc: 'Equipped with emergency first-aid beds, vital monitoring equipment, essential medicines, and a dedicated visiting physician and nurse on-call 24/7.'
  },
  {
    title: 'RO Mineral Water Plant',
    icon: 'fas fa-faucet',
    desc: 'Central commercial reverse-osmosis purification plant supplying continuous hygienic, mineral-tested chilled drinking water across all academic and hostel floors.'
  },
  {
    title: '100% DG Power Backup',
    icon: 'fas fa-bolt',
    desc: 'Heavy-duty diesel generator backup system ensuring zero disruption to computer computing clusters, server rooms, smart classrooms, and laboratory exams.'
  },
  {
    title: 'Hygienic Campus Cafeteria',
    icon: 'fas fa-utensils',
    desc: 'Spacious food court serving freshly prepared nutritious breakfasts, south-Indian lunches, beverages, and healthy snacks maintained under strict sanitation.'
  },
  {
    title: 'On-Campus ATM Services',
    icon: 'fas fa-credit-card',
    desc: '24/7 nationalized bank ATM terminal located right by the main reception gate for secure cash withdrawals and banking convenience for students and parents.'
  },
  {
    title: 'Reprographic & Stationery Kiosk',
    icon: 'fas fa-print',
    desc: 'High-speed xerox, digital spiral binding, scanning, and university stationery counters providing immediate academic document printing services.'
  }
];

export default function Facilities() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="facilities-page">
      {/* 1. Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Campus</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">Facilities &amp; Infrastructure</span>
          </div>
          <span className="page-badge">OPPOSITE JNTU METRO &bull; KUKATPALLY HYDERABAD</span>
          <h1 className="page-title">World-Class Infrastructure &amp; Campus Amenities</h1>
          <p className="page-subtitle">
            Technologically advanced computing labs, high-speed optical fiber, comprehensive digital library, and safe residential hostels designed exclusively for women scholars.
          </p>
        </div>
      </section>

      {/* 2. Anchor Navigation Bar */}
      <nav className="page-subnav-bar" aria-label="Facilities section navigation">
        <div className="container subnav-inner">
          <a href="#overview" className="subnav-link">Infrastructure Overview</a>
          <a href="#library" className="subnav-link">Central Library</a>
          <a href="#classrooms" className="subnav-link">Smart Classrooms &amp; Wi-Fi</a>
          <a href="#hostel" className="subnav-link">Women's Hostel</a>
          <a href="#transport" className="subnav-link">Transport &amp; Metro</a>
          <a href="#amenities" className="subnav-link">Campus Amenities</a>
        </div>
      </nav>

      {/* 3. Overview Metrics */}
      <section id="overview" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">CAMPUS AT A GLANCE</span>
            <h2 className="section-title">Engineered for Academic Distinction &amp; Safety</h2>
            <p className="section-subtitle">A sprawling, modern urban campus built to nurture the next generation of women technologists.</p>
          </div>

          <div className="counters-grid" style={{ marginBottom: '40px' }}>
            {INFRA_STATS.map((stat, idx) => (
              <div key={idx} className="counter-card">
                <div className="counter-icon-wrap">
                  <i className={stat.icon} aria-hidden="true"></i>
                </div>
                <div className="counter-number">{stat.val}</div>
                <div className="counter-label">{stat.label}</div>
                <div className="counter-sub">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="about-split-grid">
            <div>
              <span className="section-badge">STRATEGIC LOCATION</span>
              <h2 className="section-title">Prime Urban Accessibility: Opposite JNTU Metro</h2>
              <p className="paragraph-main">
                Rishi M.S Institute of Engineering &amp; Technology for Women is uniquely situated right opposite the <strong>JNTU College Metro Station (Red Line)</strong> on Nizampet Road, Kukatpally, Hyderabad.
              </p>
              <p className="paragraph-secondary">
                Unlike suburban colleges requiring arduous commutes, RITW enables day scholars from any corner of Hyderabad—Secunderabad, Dilsukhnagar, Ameerpet, or Miyapur—to step off the metro platform and walk straight into our safe, guarded campus gates within two minutes.
              </p>
              <div className="about-highlight-box" style={{ marginTop: '20px' }}>
                <h3 className="highlight-box-title">
                  <i className="fas fa-shield-alt" aria-hidden="true"></i>
                  <span>Zero-Compromise Security Architecture</span>
                </h3>
                <ul className="highlight-list">
                  <li>
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <div>
                      <strong>24/7 CCTV Surveillance:</strong>
                      <span>Continuous recording across every corridor, entrance, laboratory, and campus perimeter.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <div>
                      <strong>Biometric Attendance Gateways:</strong>
                      <span>Smart RFID entry cards and biometric verification for all residents and day scholars.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <div>
                      <strong>Dedicated Women Wardens &amp; Security:</strong>
                      <span>Full-time resident wardens, security patrols, and immediate parental alert messaging.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(36,28,92,0.12)', border: '1px solid #e2e8f0' }}>
                <img 
                  src="/images/clg-infra-1-000.jpg" 
                  alt="RITW Campus Building" 
                  style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '24px', background: '#ffffff' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--ritw-green)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    KUKATPALLY EDUCATIONAL HUB
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginTop: '6px', marginBottom: '8px' }}>
                    Safe, Modern, Connected
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                    Surrounded by premier tech hubs and educational landmarks, RITW provides a peaceful, intellectually vibrant sanctuary within Hyderabad city.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Central Library & E-Resources */}
      <section id="library" className="vision-mission-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">KNOWLEDGE SANCTUARY</span>
            <h2 className="section-title">Central Library &amp; Digital E-Resources</h2>
            <p className="section-subtitle">Over 25,000 technical volumes, IEEE Xplore, DELNET, and automated circulation systems.</p>
          </div>

          <div className="about-split-grid" style={{ marginTop: '30px' }}>
            <div className="vm-card vm-card-navy" style={{ textAlign: 'left' }}>
              <div className="vm-icon-box">
                <i className="fas fa-book-reader" aria-hidden="true"></i>
              </div>
              <h3 className="vm-title">Print Collection &amp; Reading Halls</h3>
              <ul className="vm-list">
                <li>
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                  <span><strong>25,000+ Printed Volumes:</strong> Spanning Core CSE, AI/ML, Data Science, IT, and ECE engineering streams.</span>
                </li>
                <li>
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                  <span><strong>120+ Print Periodicals:</strong> Leading peer-reviewed national and international engineering journals and magazines.</span>
                </li>
                <li>
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                  <span><strong>Quiet Air-Conditioned Halls:</strong> Seating capacity for 200+ scholars with individual study cubicles and power outlets.</span>
                </li>
                <li>
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                  <span><strong>Automated Circulation:</strong> Fully barcoded book inventory managed via integrated KOHA LMS software.</span>
                </li>
              </ul>
            </div>

            <div className="vm-card vm-card-green" style={{ textAlign: 'left' }}>
              <div className="vm-icon-box">
                <i className="fas fa-laptop-code" aria-hidden="true"></i>
              </div>
              <h3 className="vm-title">Digital Library &amp; Online Portals</h3>
              <ul className="vm-list">
                <li>
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                  <span><strong>IEEE Xplore Digital Library:</strong> Unrestricted campus-wide IP access to thousands of IEEE journals and conference proceedings.</span>
                </li>
                <li>
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                  <span><strong>DELNET Inter-Library Network:</strong> Access to millions of inter-institutional bibliographic records and union catalogues.</span>
                </li>
                <li>
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                  <span><strong>NPTEL &amp; Swayam Video Kiosks:</strong> Dedicated high-speed terminals pre-loaded with IIT video lectures and course notes.</span>
                </li>
                <li>
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                  <span><strong>E-Question Bank &amp; Syllabi:</strong> Online digital archive of past JNTUH and Autonomous end-semester question papers.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Smart Classrooms & High-Speed Wi-Fi */}
      <section id="classrooms" className="page-content-section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">PEDAGOGICAL INFRASTRUCTURE</span>
            <h2 className="section-title">Smart ICT Classrooms &amp; Gigabit Fiber Wi-Fi</h2>
            <p className="section-subtitle">Empowering interactive, blended, and digitally enriched engineering instruction.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '30px' }}>
            <div className="gov-card" style={{ textAlign: 'left', padding: '24px' }}>
              <div className="gov-icon-box" style={{ background: 'var(--ritw-navy-soft)', color: 'var(--ritw-navy)' }}>
                <i className="fas fa-chalkboard" aria-hidden="true"></i>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>
                Interactive Digital Smartboards
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                Every classroom is outfitted with high-lumen digital projectors, interactive pen smartboards, and motorized screens for multimedia case study simulations and code walkthroughs.
              </p>
            </div>

            <div className="gov-card" style={{ textAlign: 'left', padding: '24px' }}>
              <div className="gov-icon-box" style={{ background: 'var(--ritw-green-soft)', color: 'var(--ritw-green-dark)' }}>
                <i className="fas fa-video" aria-hidden="true"></i>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>
                Lecture Capture System (LCS)
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                Automated audio-visual recording apparatus capturing doctoral lectures, allowing scholars to review complex algorithms and mathematical proofs on-demand on the student LMS.
              </p>
            </div>

            <div className="gov-card" style={{ textAlign: 'left', padding: '24px' }}>
              <div className="gov-icon-box" style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#d97706' }}>
                <i className="fas fa-wifi" aria-hidden="true"></i>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>
                1 Gbps Optical Fiber Backbone
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                Dedicated symmetric leased-line Internet with enterprise Aruba Wi-Fi 6 access points providing secure, high-throughput wireless access across academic blocks and hostels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Women's Residential Hostel */}
      <section id="hostel" className="page-content-section">
        <div className="container">
          <div className="about-split-grid">
            <div>
              <span className="section-badge">ON-CAMPUS LIVING</span>
              <h2 className="section-title">Safe, Homely Women's Residence</h2>
              <p className="paragraph-main">
                The RITW On-Campus Women's Hostel provides a secure, caring, and intellectually stimulating "home away from home" for outstation engineering scholars.
              </p>
              <p className="paragraph-secondary">
                Supervised by full-time resident lady wardens, our residence emphasizes safety, nutritional wellbeing, hygiene, and collaborative peer learning.
              </p>
              <div className="quality-policy-card" style={{ marginTop: '16px' }}>
                <div className="policy-badge">
                  <i className="fas fa-utensils" aria-hidden="true"></i>
                  <span>Hygienic Multi-Cuisine Dining</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--ritw-text-main)', marginTop: '8px', lineHeight: '1.6' }}>
                  A modern steam-cooking kitchen serves nutritious, balanced vegetarian and non-vegetarian menus designed by nutritionists, with unlimited RO drinking water and seasonal fruit.
                </p>
              </div>
              <ul className="highlight-list" style={{ marginTop: '20px' }}>
                <li>
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <div>
                    <strong>Well-Furnished Rooms:</strong>
                    <span>Spacious sharing rooms with individual study tables, wardrobes, ergonomic chairs, and beds.</span>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <div>
                    <strong>24/7 Hot Water &amp; Laundry:</strong>
                    <span>Eco-friendly solar water heating systems paired with commercial laundry washing facilities.</span>
                  </div>
                </li>
                <li>
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <div>
                    <strong>Quiet Night Study Halls:</strong>
                    <span>Air-conditioned communal study lounges with high-speed Wi-Fi open through midnight.</span>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <div className="about-highlight-box">
                <h3 className="highlight-box-title">
                  <i className="fas fa-user-shield" aria-hidden="true"></i>
                  <span>Hostel Discipline &amp; Welfare</span>
                </h3>
                <ul className="highlight-list">
                  <li>
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <div>
                      <strong>Biometric Outpass System:</strong>
                      <span>Real-time SMS alerts delivered to registered parents whenever a student checks in or out.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <div>
                      <strong>Round-the-Clock Security:</strong>
                      <span>Stationary women security guards at all floor lobbies and perimeter entry checkposts.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <div>
                      <strong>Resident Medical Doctor:</strong>
                      <span>First-aid clinic on premises with an emergency vehicle on standby 24 hours.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <div>
                      <strong>Indoor Recreation Lounge:</strong>
                      <span>Table tennis, carrom, satellite television lounge, and yoga terrace for unwinding.</span>
                    </div>
                  </li>
                </ul>
                <div style={{ marginTop: '20px' }}>
                  <Link to="/contact" className="btn-cta btn-cta-navy" style={{ width: '100%', textAlign: 'center' }}>
                    <i className="fas fa-envelope" aria-hidden="true"></i>
                    <span>Enquire for Hostel Admission</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Transport & Fleet */}
      <section id="transport" className="vision-mission-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">SAFE COMMUTING FLEET</span>
            <h2 className="section-title">Institute Bus Routes &amp; Metro Connectivity</h2>
            <p className="section-subtitle">Connecting all major residential clusters of the twin cities with speed and comfort.</p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 25px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', marginTop: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--ritw-navy-soft)', color: 'var(--ritw-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                <i className="fas fa-subway" aria-hidden="true"></i>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                  Hyderabad Metro Rail: JNTU College Station (Red Line)
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Directly opposite RITW campus. Seamless metro connections from LB Nagar, MGBS, Ameerpet, Miyapur, and Hitec City.
                </p>
              </div>
              <span className="badge-pill badge-ugc" style={{ padding: '6px 14px', fontSize: '12px' }}>
                2-MIN WALK FROM STATION
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ritw-navy)' }}>Route No</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ritw-navy)' }}>Starting Node</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ritw-navy)' }}>Key Boarding Stops Along Route</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ritw-navy)' }}>Departure</th>
                  </tr>
                </thead>
                <tbody>
                  {BUS_ROUTES.map((bus, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fcfcfd' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--ritw-green)' }}>{bus.routeNo}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>{bus.from}</td>
                      <td style={{ padding: '12px 16px', color: '#64748b' }} dangerouslySetInnerHTML={{ __html: bus.via }}></td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>{bus.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f1f5f9', borderRadius: '8px', fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-info-circle" style={{ color: 'var(--ritw-navy)' }}></i>
              <span>All institute buses are GPS-tracked with live location feeds available on the parent portal. Experienced drivers and female security escorts accompany every vehicle.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Campus Amenities & Safety */}
      <section id="amenities" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">SUPPORT &amp; CONVENIENCE</span>
            <h2 className="section-title">Comprehensive Campus Amenities</h2>
            <p className="section-subtitle">Ensuring scholars have every essential resource accessible right within the campus perimeter.</p>
          </div>

          <div className="cells-grid" style={{ marginTop: '30px' }}>
            {AMENITIES_LIST.map((amenity, idx) => (
              <div key={idx} className="cell-card">
                <div className="cell-icon">
                  <i className={amenity.icon} aria-hidden="true"></i>
                </div>
                <h3 className="cell-title">{amenity.title}</h3>
                <p className="cell-desc">{amenity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

