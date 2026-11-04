import React from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const RECRUITERS = [
  { name: 'Tata Consultancy Services', category: 'Global IT & Consulting', logo: '/images/companies/TCS.webp' },
  { name: 'Accenture', category: 'Technology Consulting', logo: '/images/companies/Accenture.webp' },
  { name: 'Amazon', category: 'Cloud & E-Commerce', logo: '/images/companies/Amazon.webp' },
  { name: 'Capgemini', category: 'Digital Engineering Services', logo: '/images/companies/CAPGEMINI.webp' },
  { name: 'Cognizant', category: 'Digital Solutions', logo: '/images/companies/Cognizant.webp' },
  { name: 'IBM', category: 'Cognitive Computing & Hybrid Cloud', logo: '/images/companies/IBM.webp' },
  { name: 'Wipro', category: 'Cloud & Cybersecurity', logo: '/images/companies/Wipro.webp' },
  { name: 'Genpact', category: 'Analytics & Financial Tech', logo: '/images/companies/GENPACT.webp' },
  { name: 'Hexaware', category: 'Automation & AI Platforms', logo: '/images/companies/Hexaware.webp' },
  { name: 'HCL Technologies', category: 'Next-Gen IT Infrastructure', logo: '/images/companies/HCL.webp' }
];

const PLACEMENT_STATS = [
  { value: '14.50 LPA', label: 'Highest Package', desc: 'Top tier compensation secured in core software engineering' },
  { value: '5.40 LPA', label: 'Average Package', desc: 'Consistent competitive median across all four branches' },
  { value: '92.5%', label: 'Placement Rate', desc: 'Verified on-campus clearances across visiting Fortune 500 MNCs' },
  { value: '75+', label: 'Hiring Partners', desc: 'Tier-1 technology enterprises, startups, and IT MNCs' }
];

const TRAINING_ROADMAP = [
  {
    year: "Year 1",
    title: "Foundations & Computational Thinking",
    focus: "C / Python programming, mathematical aptitude, communication skills, and verbal fluency.",
    icon: "fas fa-code"
  },
  {
    year: "Year 2",
    title: "Data Structures & Competitive Coding",
    focus: "Algorithmic complexity, object-oriented Java/C++, web development, and mini-project hackathons.",
    icon: "fas fa-layer-group"
  },
  {
    year: "Year 3",
    title: "Advanced Technologies & CoE",
    focus: "Full-stack frameworks, SAP Code Unnati, Honeywell IoT, and mandatory summer corporate internships.",
    icon: "fas fa-network-wired"
  },
  {
    year: "Year 4",
    title: "Intensive CRT & On-Campus Drives",
    focus: "Company-specific aptitude bootcamps, mock technical/HR interviews, and direct recruitment assessments.",
    icon: "fas fa-user-check"
  }
];

const PLACEMENT_INFRA = [
  { title: "Dedicated Placement Office", image: "/images/Placement_Office.jpg", desc: "Central administration hub with executive boardrooms and recruiter suites." },
  { title: "Interview & Conference Rooms", image: "/images/Interview_Rooms.jpg", desc: "Acoustically treated private panel rooms for technical and HR rounds." },
  { title: "Seminar Halls & Auditoriums", image: "/images/Seminar_Hall.jpeg", desc: "500+ capacity auditorium for pre-placement talks and orientation sessions." },
  { title: "Online Assessment Computer Labs", image: "/images/Labs_For_Placement.jpg", desc: "400+ high-end networked terminals with dedicated 1 Gbps lease line connectivity." },
  { title: "Virtual Interview Setup", image: "/images/Video_Conference.webp", desc: "Full HD video conferencing suites for hybrid and global hiring drives." },
  { title: "SAP & Honeywell CoE Labs", image: "/images/SAP_Center_of_Excellence.webp", desc: "Advanced cloud and embedded IoT innovation centers." }
];

export default function Placements() {
  return (
    <div className="placements-page">
      {/* 1. Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Placements</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">Training &amp; Corporate Relations</span>
          </div>

          <div className="placements-hero-content">
            <span className="page-badge"><i className="fas fa-trophy me-1"></i> INTERNSHALA SOUTHZONE RANK 5 &bull; HIGHEST: 14.50 LPA</span>
            <h1 className="page-title">Training &amp; Placement Cell</h1>
            <p className="page-subtitle">
              Empowering women engineers to excel in competitive global technology careers through continuous campus recruitment training, world-class Centers of Excellence, and strong corporate hiring alliances.
            </p>
            <div className="hero-actions">
              <a href="#companies" className="btn-cta btn-cta-green">
                <i className="fas fa-building" aria-hidden="true"></i>
                <span>Visiting Companies</span>
              </a>
              <a href="#officer" className="btn-cta btn-cta-navy">
                <i className="fas fa-user-tie" aria-hidden="true"></i>
                <span>Placement Team</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Stats Strip */}
      <section className="stats-section">
        <div className="container">
          <div className="placements-stats-grid">
            {PLACEMENT_STATS.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-val">{stat.value}</div>
                <div className="stat-lbl">{stat.label}</div>
                <p className="stat-desc">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Placement Officer Profile */}
      <section id="officer" className="officer-section">
        <div className="container">
          <div className="officer-card">
            <div className="officer-avatar-col">
              <img
                src="/images/laxmi-tulasi.webp"
                alt="Mrs. Kalam Lakshmi Tulasi"
                className="officer-avatar"
                onError={(e) => { e.target.src = '/images/laxmi-tulasi.jpg'; }}
              />
              <span className="officer-role-badge">Head – Training &amp; Placements</span>
            </div>
            <div className="officer-info-col">
              <span className="section-badge">LEADERSHIP MESSAGE</span>
              <h2 className="officer-name">Mrs. Kalam Lakshmi Tulasi</h2>
              <p className="officer-lead">
                "Our core mission at RITW is to bridge academic knowledge with industry-ready execution. Through comprehensive training, mentorship, and corporate alliances, we ensure our young women engineers graduate as confident leaders in technology."
              </p>
              <div className="officer-contact-row">
                <a href="mailto:placements@rishimsengg.ac.in" className="contact-link">
                  <i className="fas fa-envelope text-emerald me-1"></i> placements@rishimsengg.ac.in
                </a>
                <a href="tel:+919676233050" className="contact-link">
                  <i className="fas fa-phone-alt text-emerald me-1"></i> +91-967-623-3050
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Infrastructure Showcase */}
      <section className="infra-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">CAMPUS FACILITIES</span>
            <h2 className="section-title">Placement Cell Infrastructure</h2>
            <p className="section-subtitle">
              Purpose-built air-conditioned infrastructure enabling simultaneous multi-tier online testing, recruiter boardrooms, and panel interviews.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {PLACEMENT_INFRA.map((item, idx) => (
              <div key={idx} className="gov-card" style={{ padding: '0', overflow: 'hidden', textAlign: 'left' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fui-navy)', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--fui-text-muted)', lineHeight: '1.5', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 4-Year Integrated Employability Roadmap */}
      <section className="roadmap-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">STRUCTURED METHODOLOGY</span>
            <h2 className="section-title">4-Year Integrated Employability Roadmap</h2>
            <p className="section-subtitle">
              From foundational logic in Year 1 to company-specific crack sessions in Year 4.
            </p>
          </div>

          <div className="roadmap-grid">
            {TRAINING_ROADMAP.map((step, idx) => (
              <div key={idx} className="roadmap-card">
                <div className="roadmap-step-header">
                  <span className="roadmap-year-badge">{step.year}</span>
                  <i className={step.icon} aria-hidden="true"></i>
                </div>
                <h3 className="roadmap-step-title">{step.title}</h3>
                <p className="roadmap-step-desc">{step.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Corporate Partners & Recruiter Grid */}
      <section id="companies" className="recruiters-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">PROMINENT EMPLOYERS</span>
            <h2 className="section-title">Corporate Partners &amp; Visiting MNCs</h2>
            <p className="section-subtitle">
              Top global software enterprises and consulting firms that regularly hire talented RITW women engineers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', alignItems: 'center' }}>
            {RECRUITERS.map((rec, idx) => (
              <div key={idx} className="gov-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px' }}>
                <img src={rec.logo} alt={rec.name} style={{ maxHeight: '48px', maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
