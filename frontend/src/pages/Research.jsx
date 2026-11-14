import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const PATENTS_DATA = [
  {
    appNo: '202441058291 A',
    title: 'Digital Smart Stethoscope with Real-Time Acoustic AI Diagnostic Classification',
    inventors: 'CSE & ECE Research Wing, RITW',
    status: 'PUBLISHED',
    year: '2024',
    category: 'Biomedical AI & IoT'
  },
  {
    appNo: '202341062940 A',
    title: 'Autonomous Solar-Powered IoT Water Quality & Turbidity Monitoring Array',
    inventors: 'Dr. Archana B. Patil & Research Scholars',
    status: 'PUBLISHED',
    year: '2023',
    category: 'Environmental IoT'
  },
  {
    appNo: '202341018274 A',
    title: 'Zero-Trust Intrusion Prevention Protocol for Cloud Microservices Mesh',
    inventors: 'IT & CSE Cyber Security Lab',
    status: 'PUBLISHED',
    year: '2023',
    category: 'Cloud Cyber Security'
  },
  {
    appNo: '202241088492 A',
    title: 'Deep Residual Convolutional Architecture for Retinopathy Edge Detection',
    inventors: 'AI/ML High Performance Computing Cell',
    status: 'GRANTED',
    year: '2022',
    category: 'Computer Vision'
  }
];

const RESEARCH_STATS = [
  { icon: 'fas fa-lightbulb', val: '25+', label: 'Patents Published & Filed', sub: 'In Biomedical AI, IoT & Cyber Security' },
  { icon: 'fas fa-book', val: '120+', label: 'Scopus / IEEE Papers', sub: 'Indexed in Web of Science and Springer' },
  { icon: 'fas fa-flask', val: '5', label: 'Sponsored Projects', sub: 'Funded by AICTE, DST & State agencies' },
  { icon: 'fas fa-rocket', val: '15+', label: 'Incubated Startups', sub: 'By women student entrepreneurs at RITW' }
];

const RESEARCH_CENTERS = [
  {
    title: 'Center of Excellence in AI & Machine Learning',
    partner: 'Google Cloud & NVIDIA Rigs',
    desc: 'High-performance GPU cluster dedicated to deep learning models, natural language processing, computer vision, and predictive analytics.',
    icon: 'fas fa-brain'
  },
  {
    title: 'IoT & Embedded Systems Innovation Lab',
    partner: 'Honeywell & Cisco Networking Academy',
    desc: 'Equipped with ARM Cortex microcontrollers, sensor nodes, wireless transceivers, and spectrum analyzers for smart automation.',
    icon: 'fas fa-microchip'
  },
  {
    title: 'SAP Code Unnati Center of Excellence',
    partner: 'SAP India CSR Initiative',
    desc: 'Industry-sponsored advanced training and project incubation focusing on enterprise ERP, digital supply chain, and cloud architecture.',
    icon: 'fas fa-gem'
  },
  {
    title: 'Cybersecurity & Cloud Virtualization Rig',
    partner: 'VMware & RedHat Academy',
    desc: 'Dedicated network simulation laboratory for ethical hacking, penetration testing, zero-trust protocols, and distributed cloud computing.',
    icon: 'fas fa-shield-alt'
  }
];

const MOUS_LIST = [
  { partner: 'Cisco Networking Academy', field: 'Routing, Switching & Cyber Security Training' },
  { partner: 'Telangana Academy for Skill and Knowledge (TASK)', field: 'Government Technical Skilling & Employment Drives' },
  { partner: 'Amazon Web Services (AWS) Academy', field: 'Cloud Architect & SysOps Certification' },
  { partner: 'Datateach.AI Technologies', field: 'Industrial AI/ML Mentorship & Internships' },
  { partner: 'SAP Code Unnati', field: 'Enterprise Software & Youth Skilling Center' },
  { partner: 'Honeywell CSR Foundation', field: 'Center of Excellence in Advanced Engineering' },
  { partner: 'Oracle Academy', field: 'Relational Database Management & Java Systems' },
  { partner: 'ELEATION CAE Solutions', field: 'Simulation & Engineering Design Workflows' }
];

export default function Research() {
  const [activeTab, setActiveTab] = useState('policy');

  return (
    <div className="research-page">
      {/* 1. Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Research &amp; R&amp;D</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">Innovation Hub</span>
          </div>
          <span className="page-badge">INNOVATION, PATENTS &amp; RESEARCH EXCELLENCE</span>
          <h1 className="page-title">Research &amp; Development (R&amp;D) Cell</h1>
          <p className="page-subtitle">
            Cultivating an ecosystem of curiosity, scientific rigor, and technological breakthroughs with 25+ patents, Scopus-indexed faculty publications, and student startup incubation.
          </p>
        </div>
      </section>

      {/* 2. Subnav Bar */}
      <nav className="page-subnav-bar" aria-label="Research sections">
        <div className="container subnav-inner">
          <a href="#policy" className={`subnav-link ${activeTab === 'policy' ? 'active' : ''}`} onClick={() => setActiveTab('policy')}>
            R&amp;D Policy &amp; Ethics
          </a>
          <a href="#patents" className={`subnav-link ${activeTab === 'patents' ? 'active' : ''}`} onClick={() => setActiveTab('patents')}>
            Patents &amp; Intellectual Property
          </a>
          <a href="#centers" className={`subnav-link ${activeTab === 'centers' ? 'active' : ''}`} onClick={() => setActiveTab('centers')}>
            Centers of Excellence (CoE)
          </a>
          <a href="#mous" className={`subnav-link ${activeTab === 'mous' ? 'active' : ''}`} onClick={() => setActiveTab('mous')}>
            Corporate MoUs &amp; Tie-ups
          </a>
          <a href="#incubation" className={`subnav-link ${activeTab === 'incubation' ? 'active' : ''}`} onClick={() => setActiveTab('incubation')}>
            Incubation &amp; Startups
          </a>
        </div>
      </nav>

      {/* 3. Research Stats Banner */}
      <section className="stats-strip-wrapper" style={{ margin: 0, borderBottom: '1px solid var(--ritw-border)' }}>
        <div className="container">
          <div className="stats-strip-grid">
            {RESEARCH_STATS.map((stat, idx) => (
              <div key={idx} className="stats-strip-card reveal">
                <div className="stats-strip-icon">
                  <i className={stat.icon} aria-hidden="true"></i>
                </div>
                <div className="stats-strip-body">
                  <div className="stats-strip-value">{stat.val}</div>
                  <div className="stats-strip-title">{stat.label}</div>
                  <div className="stats-strip-sub">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. R&D Policy & Ethics */}
      <section id="policy" className="page-content-section" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="about-split-grid">
            <div>
              <span className="section-badge">INSTITUTIONAL RESEARCH VISION</span>
              <h2 className="section-title">Academic R&amp;D Policy &amp; Code of Ethics</h2>
              <p className="lead-paragraph">
                The Research &amp; Development Cell at RITW stimulates faculty and student innovation through financial incentives, seed grants, patent filing support, and international conference sponsorship.
              </p>
              <p className="body-paragraph">
                We maintain an unbending commitment to academic honesty, zero-tolerance on plagiarism (Turnitin verification &lt; 10%), transparent authorship protocols, and responsible AI innovation adhering to IEEE and ACM ethics codes.
              </p>

              <div className="about-key-points">
                <div className="point-item">
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <span>100% Institutional Reimbursement for Patent Filing Fees</span>
                </div>
                <div className="point-item">
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <span>Cash Awards for Scopus &amp; Web of Science Q1/Q2 Publications</span>
                </div>
                <div className="point-item">
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <span>Seed Funding up to &INR; 1,00,000 for Women Student Prototypes</span>
                </div>
              </div>
            </div>

            <div className="about-highlight-box">
              <h3 className="highlight-box-title">
                <i className="fas fa-microscope" aria-hidden="true"></i>
                <span>R&amp;D Steering Committee</span>
              </h3>
              <ul className="highlight-list">
                <li>
                  <div style={{ fontWeight: '800', color: 'var(--ritw-navy-dark)' }}>R&amp;D Cell Convener</div>
                  <div style={{ fontSize: '13px', color: 'var(--ritw-text-muted)' }}>Dr. Archana Baburao Patil, M.Tech, Ph.D.</div>
                  <div style={{ fontSize: '12px', color: 'var(--ritw-navy)' }}>research@rishimsengg.ac.in</div>
                </li>
                <li>
                  <div style={{ fontWeight: '800', color: 'var(--ritw-navy-dark)' }}>Academic Advisory Member (External)</div>
                  <div style={{ fontSize: '13px', color: 'var(--ritw-text-muted)' }}>Prof. S. Jeelani, University of Hyderabad</div>
                  <div style={{ fontSize: '12px', color: 'var(--ritw-green)' }}>Honorary Research Mentor</div>
                </li>
                <li>
                  <div style={{ fontWeight: '800', color: 'var(--ritw-navy-dark)' }}>Intellectual Property Rights (IPR) Cell</div>
                  <div style={{ fontSize: '13px', color: 'var(--ritw-text-muted)' }}>Patent Drafting &amp; Tech Transfer Desk</div>
                  <div style={{ fontSize: '12px', color: 'var(--ritw-navy)' }}>ipr@rishimsengg.ac.in</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Patents & Intellectual Property */}
      <section id="patents" className="statutory-section" style={{ background: '#f8fafc', padding: '60px 0' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <span className="section-badge">INVENTIONS &amp; INTELLECTUAL ASSETS</span>
            <h2 className="section-title">Published &amp; Granted Patents</h2>
            <p className="section-subtitle">
              Breakthrough innovations conceived and engineered in RITW laboratories with official Intellectual Property India publication numbers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {PATENTS_DATA.map((pat, idx) => (
              <div key={idx} className="cell-card reveal" style={{ background: '#ffffff', border: '1px solid var(--ritw-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="dept-badge" style={{ background: pat.status === 'GRANTED' ? 'var(--ritw-green-soft)' : 'rgba(245, 158, 11, 0.15)', color: pat.status === 'GRANTED' ? 'var(--ritw-green)' : 'var(--ritw-gold)' }}>
                    {pat.status} ({pat.year})
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>{pat.category}</span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--ritw-navy-dark)', marginBottom: '8px', lineHeight: 1.35 }}>
                  {pat.title}
                </h4>
                <div style={{ fontSize: '12.5px', color: 'var(--ritw-text-muted)', marginBottom: '6px' }}>
                  <strong>Application No:</strong> {pat.appNo}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--ritw-text-muted)' }}>
                  <strong>Inventors:</strong> {pat.inventors}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Centers of Excellence */}
      <section id="centers" className="page-content-section" style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <span className="section-badge">SPECIALIZED INFRASTRUCTURE</span>
            <h2 className="section-title">Centers of Excellence (CoE)</h2>
            <p className="section-subtitle">Corporate-partnered incubation labs providing enterprise tooling and industry exposure.</p>
          </div>

          <div className="cells-grid">
            {RESEARCH_CENTERS.map((coe, idx) => (
              <div key={idx} className="cell-card reveal">
                <div className="cell-icon" style={{ background: 'var(--ritw-navy-soft)', color: 'var(--ritw-navy)' }}>
                  <i className={coe.icon} aria-hidden="true"></i>
                </div>
                <div className="dept-badge" style={{ marginBottom: '6px', display: 'inline-block' }}>{coe.partner}</div>
                <h3 className="cell-title">{coe.title}</h3>
                <p className="cell-desc">{coe.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Corporate MoUs & Industry Tie-ups */}
      <section id="mous" className="statutory-section" style={{ background: '#f8fafc', padding: '60px 0' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <span className="section-badge">GLOBAL COLLABORATIONS</span>
            <h2 className="section-title">Corporate MoUs &amp; Academic Partnerships</h2>
            <p className="section-subtitle">Strategic alliances enabling faculty enablement, student internships, and live client project deliverables.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {MOUS_LIST.map((mou, idx) => (
              <div key={idx} className="reveal" style={{ background: '#ffffff', border: '1px solid var(--ritw-border)', borderRadius: 'var(--radius-md)', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.2s ease' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--ritw-green-soft)', color: 'var(--ritw-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  <i className="fas fa-handshake" aria-hidden="true"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--ritw-navy-dark)', margin: '0 0 3px' }}>{mou.partner}</h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--ritw-text-muted)', margin: 0 }}>{mou.field}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Rishi Incubation & Entrepreneurship Development Cell (EDC) */}
      <section id="incubation" className="page-content-section" style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ background: 'var(--ritw-navy-gradient)', color: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '44px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '36px', alignItems: 'center' }}>
            <div>
              <span className="section-badge" style={{ background: 'rgba(21, 155, 98, 0.3)', color: '#55efc4', borderColor: '#55efc4' }}>STARTUP INCUBATION</span>
              <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#ffffff', margin: '10px 0 14px' }}>
                Rishi Incubation Center &amp; EDC
              </h2>
              <p style={{ fontSize: '15.5px', opacity: 0.9, lineHeight: 1.65, marginBottom: '24px' }}>
                Fostering women innovators from ideation to prototype incubation. Supported with dedicated co-working space, high-speed gigabit Wi-Fi, legal IPR guidance, and angel seed funds.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn-cta btn-cta-green">
                  <i className="fas fa-lightbulb" aria-hidden="true"></i>
                  <span>Submit Startup Pitch</span>
                </Link>
                <Link to="/departments" className="btn-cta hero-btn-secondary">
                  <i className="fas fa-flask" aria-hidden="true"></i>
                  <span>Explore Labs</span>
                </Link>
              </div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', color: '#fef08a' }}>Incubation Fast Facts</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
                <li><i className="fas fa-check" style={{ color: '#55efc4', marginRight: '8px' }}></i> 15+ Student prototypes developed</li>
                <li><i className="fas fa-check" style={{ color: '#55efc4', marginRight: '8px' }}></i> Dedicated 24/7 AI Hackathon Rigs</li>
                <li><i className="fas fa-check" style={{ color: '#55efc4', marginRight: '8px' }}></i> Mentorship from Silicon Valley &amp; Hyderabad Tech Founders</li>
                <li><i className="fas fa-check" style={{ color: '#55efc4', marginRight: '8px' }}></i> Recognized under MSME and Startup Telangana</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

