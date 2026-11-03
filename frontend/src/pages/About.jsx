import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const LEADERSHIP = [
  {
    id: "founder",
    role: "Patron & Guiding Light",
    name: "Bharat Ratna (Late) Smt. M.S. Subbulakshmi",
    title: "Legendary Carnatic Pioneer & Humanitarian (1916–2004)",
    desc: "First musician to receive the Bharat Ratna. Her life principles of discipline, cultural devotion, humility, and philanthropic service inspire RITW's foundational vision of women's education and technical empowerment.",
    image: "/images/ms_subbu_lakshmi_rishi_college.webp"
  },
  {
    id: "chairman",
    role: "Chairman",
    name: "Prof. S. Jeelani",
    title: "Director, Centre for Virtual Learning (UoH) & Academician",
    desc: "Renowned academician with over 30 years of experience in teaching, research, and administration. Former Director of the Centre for Virtual Learning at the University of Hyderabad. Author of 60+ research papers, 3 books, and recipient of the 'Best Citizen of India' award.",
    image: "/images/Dr JEELANI.png"
  },
  {
    id: "secretary",
    role: "Secretary & Correspondent",
    name: "Smt. M. Jayasree",
    title: "Institutional Visionary & Administrator",
    desc: "Founding member of Rishi Educational Institutions and champion of women's empowerment. Honored with the 'Vikas Ratan Gold Medal Award' by the International Integration Society, New Delhi, driving infrastructural growth and student welfare.",
    image: "/images/Ms .Jayasree - SECRETARY - RITW.png"
  },
  {
    id: "principal",
    role: "Principal & Member Secretary",
    name: "Dr. Md. Jeelani",
    title: "M.Tech., Ph.D., Academic Administrator",
    desc: "Veteran academician and administrator driving outcome-based learning, faculty research publications, patents, autonomous curriculum implementation, and placement alignment with Fortune 500 tech corporations.",
    image: "/images/Dr JEELANI.png"
  },
  {
    id: "director",
    role: "Director / Coordinator IQAC",
    name: "Dr. Archana Baburao Patil",
    title: "Professor & Head of Department, CSE & Allied Specializations",
    desc: "Leading outcome-based pedagogy, Tier-II NBA compliance, research publications, and faculty development across emerging computer science, artificial intelligence, and data science domains.",
    image: "/images/Dr.ARCHANA BABURAO PATIL.jpg"
  }
];

const ACCREDITATIONS = [
  {
    id: "autonomous",
    title: "UGC Autonomous Status",
    authority: "University Grants Commission, New Delhi",
    desc: "Conferred autonomous status by UGC & JNTUH, enabling flexible, industry-relevant curriculum design and continuous evaluation.",
    icon: "fas fa-university",
    logo: "/images/UGC_India_Logo.webp",
    link: "/accreditation#ugc"
  },
  {
    id: "naac",
    title: "NAAC 'A' Grade Accreditation",
    authority: "National Assessment and Accreditation Council",
    desc: "Accredited with prestigious 'A' Grade affirming exceptional standards in teaching methodology, research, and campus infrastructure.",
    icon: "fas fa-award",
    logo: "/images/NAAC-A.png",
    link: "/accreditation#naac"
  },
  {
    id: "nba",
    title: "NBA Accredited Programs",
    authority: "National Board of Accreditation, New Delhi",
    desc: "Certified for Tier-II Outcome-Based Education, ensuring international equivalence and quality assurance across technical programs.",
    icon: "fas fa-check-circle",
    logo: "/images/NBA_ACCREDITATION_RITW.webp",
    link: "/accreditation#nba"
  },
  {
    id: "jntuh",
    title: "Permanently Affiliated to JNTUH",
    authority: "Jawaharlal Nehru Technological University Hyderabad",
    desc: "Affiliated to Telangana's premier engineering university, maintaining academic rigour and transparent degree governance.",
    icon: "fas fa-graduation-cap",
    logo: "/images/JNTU_Hyderabad_logo.webp",
    link: "/accreditation#overview"
  }
];

const GOVERNANCE_BODIES = [
  {
    id: "governing-body",
    title: "Governing Council / Body",
    icon: "fas fa-balance-scale",
    desc: "Comprising eminent academicians, industrialists, and government nominees formulating institutional vision, budgets, and long-term policies."
  },
  {
    id: "academic-council",
    title: "Academic Council",
    icon: "fas fa-book-reader",
    desc: "Approving autonomous curricula, course structures, academic calendars, examination regulations, and pedagogical standards."
  },
  {
    id: "bos",
    title: "Board of Studies (BOS)",
    icon: "fas fa-chalkboard-teacher",
    desc: "Departmental expert panels aligning syllabi with emerging technologies, industrial expectations, and university guidelines."
  },
  {
    id: "finance",
    title: "Finance Committee",
    icon: "fas fa-coins",
    desc: "Ensuring optimal allocation of resources towards high-performance labs, student scholarships, and faculty research grants."
  }
];

const MANDATORY_CELLS = [
  { id: "anti-ragging", title: "Anti-Ragging Squad & Committee", icon: "fas fa-shield-alt", desc: "Zero-tolerance policy on ragging with 24/7 faculty patrols and instant complaint helplines." },
  { id: "wec", title: "Women Empowerment Cell (WEC)", icon: "fas fa-female", desc: "Dedicated student counseling, legal awareness workshops, self-defense classes, and health seminars." },
  { id: "icc", title: "Internal Complaints Committee (ICC)", icon: "fas fa-hands-helping", desc: "Statutory committee constituted in compliance with the POSH Act to maintain safe campus dignity." },
  { id: "grievance", title: "Grievance Redressal Cell", icon: "fas fa-clipboard-check", desc: "Online and offline grievance portal resolving student, parent, and faculty concerns promptly." },
  { id: "iqac", title: "Internal Quality Assurance Cell (IQAC)", icon: "fas fa-chart-line", desc: "Continuous monitoring of outcome-based teaching metrics, feedback audits, and accreditation records." },
  { id: "aicte", title: "AICTE Approvals & EOA", icon: "fas fa-file-contract", desc: "Year-on-year extension of approvals and mandatory disclosures available transparently for public inspection." }
];

const CAMPUS_FACILITIES = [
  { id: "library", title: "Central Library & Digital E-Resources", icon: "fas fa-book-reader", desc: "Over 25,000 technical volumes, IEEE Xplore, DELNET digital subscriptions, and 24/7 quiet air-conditioned reading halls." },
  { id: "infrastructure", title: "Smart Classrooms & Campus Wi-Fi", icon: "fas fa-wifi", desc: "High-speed gigabit optical fiber, interactive digital smartboards, audio-visual lecture recording, and campus-wide connectivity." },
  { id: "hostel", title: "Secure Women's Hostel & Hygienic Dining", icon: "fas fa-home", desc: "On-campus resident hostel with 24/7 CCTV surveillance, biometric security, nutritious dining, and solar hot water." },
  { id: "sports", title: "Sports Complex & Wellness Gymnasium", icon: "fas fa-dumbbell", desc: "Indoor badminton and table tennis courts, outdoor volleyball, basketball, yoga auditorium, and dedicated physical education trainers." },
  { id: "cultural", title: "Cultural & Technical Symposiums", icon: "fas fa-theater-masks", desc: "Annual cultural gala 'RISHI UTSAV', technical hackathons, coding contests, and dance/music club showcases." },
  { id: "clubs", title: "Technical & Innovation Clubs", icon: "fas fa-laptop-code", desc: "Google Developer Student Club (GDSC), Coding Cells, Robotics Club, and Cisco Certified Networking workshops." },
  { id: "nss", title: "NSS & Community Outreach", icon: "fas fa-hands-helping", desc: "Social welfare drives, blood donation camps, environmental tree plantation, and digital literacy initiatives in nearby villages." }
];

export default function About() {
  useEffect(() => {
    const elements = document.querySelectorAll('.about-page .fui-reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fui-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      elements.forEach(el => observer.observe(el));
      return () => observer.disconnect();
    } else {
      elements.forEach(el => el.classList.add('fui-revealed'));
    }
  }, []);

  return (
    <div className="about-page">
      {/* 1. Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>About Us</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">Institutional Profile</span>
          </div>
          <span className="page-badge">ESTABLISHED 2009 &bull; HYDERABAD</span>
          <h1 className="page-title">About Rishi M.S Institute of Engineering &amp; Technology for Women</h1>
          <p className="page-subtitle">
            An Autonomous institution conferring world-class technical education, research opportunities, and leadership skills for women engineers under JNTU Hyderabad.
          </p>

          {/* Quick Authority Stats Strip */}
          <div className="fui-header-stats-strip">
            <span className="fui-stat-pill"><i className="fas fa-check-circle" aria-hidden="true"></i> UGC Autonomous Status</span>
            <span className="fui-stat-pill"><i className="fas fa-medal" aria-hidden="true"></i> NAAC 'A' Grade</span>
            <span className="fui-stat-pill"><i className="fas fa-certificate" aria-hidden="true"></i> NBA Tier-II Accredited</span>
            <span className="fui-stat-pill"><i className="fas fa-university" aria-hidden="true"></i> JNTUH Affiliated</span>
            <span className="fui-stat-pill"><i className="fas fa-subway" aria-hidden="true"></i> Opposite JNTU Metro</span>
          </div>
        </div>
      </section>

      {/* 2. Anchor Navigation Bar */}
      <nav className="page-subnav-bar" aria-label="About section navigation">
        <div className="container subnav-inner">
          <a href="#profile" className="subnav-link">Institutional Profile</a>
          <a href="#theme" className="subnav-link">Logo &amp; Theme</a>
          <a href="#society" className="subnav-link">Rishi Group</a>
          <a href="#vision" className="subnav-link">Vision &amp; Mission</a>
          <a href="#leadership" className="subnav-link">Leadership Desk</a>
          <a href="#governance" className="subnav-link">Governance &amp; BOS</a>
          <a href="#accreditations" className="subnav-link">Accreditations</a>
          <a href="#facilities" className="subnav-link">Campus Facilities</a>
          <a href="#statutory" className="subnav-link">Statutory Cells</a>
        </div>
      </nav>

      {/* 3. Main Institutional Profile */}
      <section id="profile" className="page-content-section">
        <div className="container">
          <div className="about-split-grid">
            <div className="fui-reveal fui-delay-1">
              <span className="section-badge">OVERVIEW &amp; HERITAGE</span>
              <h2 className="section-title">Nurturing Women Tech Leaders with Purpose</h2>
              <p className="paragraph-main">
                Established in 2009 in Kukatpally, Hyderabad, <strong>Rishi M.S Institute of Engineering &amp; Technology for Women (RITW)</strong> is recognized as one of Telangana's foremost autonomous engineering institutions for women, founded in memory of the legendary singer <strong>Bharat Ratna M.S. Subbulakshmi</strong>.
              </p>
              <p className="paragraph-secondary">
                RITW is approved by the All India Council for Technical Education (AICTE), New Delhi, permanently affiliated to Jawaharlal Nehru Technological University Hyderabad (JNTUH), accredited with an <strong>'A' Grade by NAAC</strong>, and conferred <strong>UGC Autonomous</strong> status.
              </p>
              <p className="paragraph-secondary">
                Strategically located on a 5.2-acre lush green campus right opposite the JNTU College Metro Station on the Hyderabad Red Line, our campus offers a secure, easily accessible, and technologically stimulating academic environment with high-definition CCTV security, advanced computer labs, and comfortable residential hostels.
              </p>

              {/* Quality Policy Box */}
              <div className="quality-policy-card fui-reveal fui-delay-2">
                <div className="policy-badge">
                  <i className="fas fa-medal" aria-hidden="true"></i>
                  <span>Institutional Quality Policy</span>
                </div>
                <blockquote className="policy-quote">
                  "To impart quality technical education of highest standards to women scholars, develop creative thinking and analytical problem-solving abilities, and mold them into professionally competent, ethically grounded, and socially responsible global leaders."
                </blockquote>
              </div>

              {/* Objectives & IDP */}
              <div id="objectives" className="quality-policy-card fui-reveal fui-delay-3" style={{ marginTop: '20px' }}>
                <div id="idp" className="policy-badge" style={{ background: 'var(--fui-emerald-tint)', color: 'var(--fui-emerald-dark)', borderColor: 'var(--fui-emerald-border)' }}>
                  <i className="fas fa-bullseye" aria-hidden="true"></i>
                  <span>Objectives &amp; Institution Development Plan (IDP)</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--fui-text-body)', marginTop: '10px', lineHeight: '1.68' }}>
                  Our strategic development plan focuses on 100% Outcome-Based Education (OBE), scaling industry-sponsored AI/ML incubators, empowering scholars with global certifications (Cisco, AWS, Google Cloud), and cultivating entrepreneurial resilience in tech leadership.
                </p>
              </div>

              {/* Aspirations */}
              <div id="aspirations" className="quality-policy-card fui-reveal fui-delay-4" style={{ marginTop: '20px' }}>
                <div className="policy-badge" style={{ background: 'var(--fui-navy-tint)', color: 'var(--fui-navy)', borderColor: 'var(--fui-navy-border)' }}>
                  <i className="fas fa-rocket" aria-hidden="true"></i>
                  <span>Institutional Aspirations</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--fui-text-body)', marginTop: '10px', lineHeight: '1.68' }}>
                  To evolve into a center of global prominence for women's engineering education, pioneering transformative research, sustainable technologies, intellectual patents, and ethical leadership that empowers scholars to lead dynamic industrial landscapes.
                </p>
              </div>
            </div>

            {/* Right Side: Key Highlights Card */}
            <div className="fui-reveal fui-delay-2">
              <div className="about-highlight-box">
                <h3 className="highlight-box-title">
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <span>The RITW Distinction</span>
                </h3>
                <ul className="highlight-list">
                  <li>
                    <i className="fas fa-check" aria-hidden="true"></i>
                    <div>
                      <strong>UGC Autonomous Status:</strong>
                      <span>Adaptable curriculum incorporating emerging AI, cloud, and IoT trends.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check" aria-hidden="true"></i>
                    <div>
                      <strong>NAAC 'A' Grade Benchmark:</strong>
                      <span>Validated institutional CGPA for teaching-learning pedagogy and research.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check" aria-hidden="true"></i>
                    <div>
                      <strong>100% Placement Training:</strong>
                      <span>4-year progressive CRT training with packages up to 7.5 LPA.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check" aria-hidden="true"></i>
                    <div>
                      <strong>Strategic Metro Connectivity:</strong>
                      <span>2 minutes walk from JNTU Metro Station ensuring safe daily transit for scholars.</span>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-check" aria-hidden="true"></i>
                    <div>
                      <strong>Doctoral Faculty Mentorship:</strong>
                      <span>Senior academicians with research publications, patents, and project grants.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Logo, Flag, Color, Theme & Society Heritage */}
      <section id="theme" className="statutory-section">
        <div className="container" id="society">
          <div className="section-header">
            <span className="section-badge">HERITAGE &amp; EMBLEM</span>
            <h2 className="section-title">Logo, Flag, Color Theme &amp; Society Heritage</h2>
            <p className="section-subtitle">Founded under the aegis of Rishi UBR Educational Society, dedicated to academic discipline and women's empowerment.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div className="cell-card fui-reveal fui-delay-1">
              <div className="cell-icon">
                <i className="fas fa-flag" aria-hidden="true"></i>
              </div>
              <h3 className="cell-title">Emblem &amp; Institutional Flag</h3>
              <p className="cell-desc">
                The RITW emblem symbolizes women's technological ascendancy, disciplined scholarship, and cultural integrity. The flag proudly carries the deep navy of academic authority and the emerald green of growth, innovation, and ecological harmony.
              </p>
            </div>

            <div className="cell-card fui-reveal fui-delay-2">
              <div className="cell-icon" style={{ background: 'var(--fui-navy-tint)', color: 'var(--fui-navy)' }}>
                <i className="fas fa-palette" aria-hidden="true"></i>
              </div>
              <h3 className="cell-title">Color Palette &amp; Philosophy</h3>
              <p className="cell-desc">
                Inspired by the iconic college insignia: <strong>Deep Navy (#0B2545)</strong> represents foundational rigour, ethical leadership, and university governance; <strong>Emerald Green (#0D8A50)</strong> embodies technical vitality, creative renewal, and futuristic engineering.
              </p>
            </div>

            <div className="cell-card fui-reveal fui-delay-3">
              <div className="cell-icon">
                <i className="fas fa-university" aria-hidden="true"></i>
              </div>
              <h3 className="cell-title">Rishi Group of Institutions</h3>
              <p className="cell-desc">
                RITW is part of the Rishi UBR Educational Society, founded in 1990. The society's journey began with <strong>Rishi UBR Degree College for Women</strong> in 1991, commemorating <strong>Late Sri U.B. Raghavendra Rao Garu</strong>, retired IAS officer and former Secretary to the Chief Minister.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Vision & Mission Section */}
      <section id="vision" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">CORE PRINCIPLES</span>
            <h2 className="section-title">Our Vision &amp; Institutional Mission</h2>
            <p className="section-subtitle">Guiding our students toward technological mastery, ethical leadership, and innovation.</p>
          </div>

          <div className="vision-mission-grid">
            {/* Vision Card */}
            <div className="vm-card vm-card-navy fui-reveal fui-delay-1">
              <div className="vm-icon-box">
                <i className="fas fa-eye" aria-hidden="true"></i>
              </div>
              <h3 className="vm-title">Our Vision</h3>
              <p className="vm-text">
                To evolve into a center of international repute for women's engineering education, pioneering transformative research, sustainable technologies, and leadership skills that empower women to thrive in dynamic industrial and societal landscapes.
              </p>
            </div>

            {/* Mission Card */}
            <div className="vm-card vm-card-green fui-reveal fui-delay-2">
              <div className="vm-icon-box">
                <i className="fas fa-compass" aria-hidden="true"></i>
              </div>
              <h3 className="vm-title">Our Mission</h3>
              <ul className="vm-list">
                <li>
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                  <span>Deliver contemporary outcome-based curricula supported by state-of-the-art laboratory infrastructure.</span>
                </li>
                <li>
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                  <span>Foster an environment of ethical integrity, critical thinking, entrepreneurship, and continuous research.</span>
                </li>
                <li>
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                  <span>Establish deep corporate alliances and academic MoUs to guarantee 100% industry readiness and career placement.</span>
                </li>
                <li>
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                  <span>Nurture women engineers with social responsibility, environmental consciousness, and professional excellence.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Leadership Desk Section */}
      <section id="leadership" className="statutory-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">LEADERSHIP &amp; ADMINISTRATION</span>
            <h2 className="section-title">Leadership Inspiring Excellence</h2>
            <p className="section-subtitle">Committed to academic modernization, outcome-based research, and student welfare.</p>
          </div>

          <div className="leadership-cards-grid">
            {LEADERSHIP.map((lead, idx) => (
              <div 
                key={idx} 
                id={lead.id} 
                className={`leader-profile-card fui-reveal fui-delay-${(idx % 4) + 1}`}
              >
                <div className="leader-avatar-wrap">
                  <img 
                    src={lead.image} 
                    alt={lead.name} 
                    className="leader-avatar-img"
                    onError={(e) => { e.currentTarget.src = '/images/Dr.ARCHANA BABURAO PATIL.jpg'; }}
                  />
                </div>
                <div className="leader-info">
                  <div className="leader-role-tag">{lead.role}</div>
                  <h3 className="leader-full-name">{lead.name}</h3>
                  <div className="leader-designation">{lead.title}</div>
                  <p className="leader-quote-text">{lead.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Governance & Academic Councils */}
      <section id="governance" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">AUTONOMOUS GOVERNANCE</span>
            <h2 className="section-title">Statutory Administrative Councils</h2>
            <p className="section-subtitle">Ensuring transparent policy execution, curriculum reviews, and continuous academic quality.</p>
          </div>

          <div className="governance-grid">
            {GOVERNANCE_BODIES.map((gov, idx) => (
              <div 
                key={idx} 
                id={gov.id} 
                className={`gov-card fui-reveal fui-delay-${(idx % 4) + 1}`}
              >
                <div className="gov-icon-box">
                  <i className={gov.icon} aria-hidden="true"></i>
                </div>
                <h3 className="gov-title">{gov.title}</h3>
                <p className="gov-desc">{gov.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/governance" className="btn-cta btn-cta-navy">
              <i className="fas fa-balance-scale" aria-hidden="true"></i>
              <span>View Full Statutory Governance, Organogram &amp; BOS &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Accreditations & Approvals Matrix */}
      <section id="accreditations" className="statutory-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">CREDENTIALS &amp; APPROVALS</span>
            <h2 className="section-title">National Recognitions &amp; Certifications</h2>
            <p className="section-subtitle">Meeting the highest quality benchmarks established by government and regulatory bodies.</p>
          </div>

          <div className="accreditations-grid">
            {ACCREDITATIONS.map((acc, idx) => (
              <div 
                key={idx} 
                id={acc.id} 
                className={`acc-card fui-reveal fui-delay-${(idx % 4) + 1}`}
              >
                <div className="acc-card-top">
                  <img src={acc.logo} alt={acc.title} className="acc-card-logo" />
                  <span className="acc-authority-tag">{acc.authority}</span>
                </div>
                <h3 className="acc-card-title">{acc.title}</h3>
                <p className="acc-card-desc">{acc.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/accreditation" className="btn-cta btn-cta-green">
              <i className="fas fa-certificate" aria-hidden="true"></i>
              <span>View Detailed Accreditations, NAAC Criteria &amp; IQAC &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Campus Life & Facilities Section */}
      <section id="facilities" className="page-content-section">
        <div className="container" id="campus-life">
          <div className="section-header">
            <span className="section-badge">INFRASTRUCTURE &amp; CAMPUS LIFE</span>
            <h2 className="section-title">Campus Facilities &amp; Student Experience</h2>
            <p className="section-subtitle">A secure, vibrant, and well-equipped campus located right opposite JNTU College Metro Station.</p>
          </div>

          <div className="cells-grid">
            {CAMPUS_FACILITIES.map((fac, idx) => (
              <div key={fac.id} id={fac.id} className={`cell-card fui-reveal fui-delay-${(idx % 4) + 1}`}>
                <div className="cell-icon">
                  <i className={fac.icon} aria-hidden="true"></i>
                </div>
                <h3 className="cell-title">{fac.title}</h3>
                <p className="cell-desc">{fac.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
            <Link to="/facilities" className="btn-cta btn-cta-navy">
              <i className="fas fa-building" aria-hidden="true"></i>
              <span>Explore Detailed Facilities &amp; Metro Map &rarr;</span>
            </Link>
            <Link to="/campus-life" className="btn-cta btn-cta-green">
              <i className="fas fa-users" aria-hidden="true"></i>
              <span>Explore Student Life, Fests &amp; Clubs &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Statutory Cells & Student Welfare */}
      <section id="statutory" className="statutory-section">
        <div className="container" id="nirf">
          <div className="section-header">
            <span className="section-badge">STUDENT WELFARE &amp; SAFETY</span>
            <h2 className="section-title">Mandatory Committees &amp; Support Cells</h2>
            <p className="section-subtitle">Zero tolerance for misconduct, active grievance redressal, and dedicated student empowerment.</p>
          </div>

          <div className="cells-grid">
            {MANDATORY_CELLS.map((cell, idx) => (
              <div key={cell.id} id={cell.id} className={`cell-card fui-reveal fui-delay-${(idx % 4) + 1}`}>
                <div className="cell-icon">
                  <i className={cell.icon} aria-hidden="true"></i>
                </div>
                <h3 className="cell-title">{cell.title}</h3>
                <p className="cell-desc">{cell.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to="/governance#committees" className="btn-cta btn-cta-navy">
              <i className="fas fa-shield-alt" aria-hidden="true"></i>
              <span>View Statutory Committees &amp; Student Grievance Portals &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
