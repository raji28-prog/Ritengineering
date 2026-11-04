import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const ACCREDITATIONS_DATA = [
  {
    id: 'ugc',
    title: 'UGC Autonomous Status',
    agency: 'University Grants Commission, New Delhi',
    validity: 'Conferred for 10-Year Period (2026–2036)',
    icon: 'fas fa-university',
    logo: '/images/UGC_India_Logo.webp',
    desc: 'Empowers RITW with complete autonomy to formulate industry-relevant curricula, conduct continuous evaluations, declare autonomous semester results, and introduce cutting-edge multidisciplinary electives under NEP 2020.',
    highlights: [
      'Freedom to redesign curricula every academic year based on industrial feedback.',
      'Choice Based Credit System (CBCS) with interdisciplinary and project credits.',
      'Continuous Internal Evaluation (40% CIE) coupled with Semester End Exams (60% SEE).',
      'Degrees awarded formally by Jawaharlal Nehru Technological University Hyderabad (JNTUH).'
    ]
  },
  {
    id: 'naac',
    title: "NAAC 'A' Grade Accreditation",
    agency: 'National Assessment and Accreditation Council (UGC)',
    validity: 'Cycle-I Comprehensive Institutional Accreditation',
    icon: 'fas fa-award',
    logo: '/images/NAAC_Certificate_Rishi_MS_Institute_of_Engineering_and_Technology_for_Women.webp',
    desc: 'The prestigious NAAC "A" Grade affirms the highest institutional standards across curriculum delivery, faculty doctoral expertise, state-of-the-art research laboratories, student progression, and ethical governance.',
    highlights: [
      'High institutional CGPA reflecting pedagogical excellence and student satisfaction.',
      'Robust ICT infrastructure with 1 Gbps Wi-Fi, digital library, and smart lecture halls.',
      'Strong research footprint with published patents, Scopus journals, and student incubators.',
      'Exceptional campus placement rate with top Fortune 500 recruiting partners.'
    ]
  },
  {
    id: 'nba',
    title: 'NBA Accredited Programs',
    agency: 'National Board of Accreditation, New Delhi',
    validity: 'Tier-II Outcome-Based Technical Education Accreditation',
    icon: 'fas fa-check-circle',
    logo: '/images/NBA_ACCREDITATION_RITW.webp',
    desc: 'Validates that technical programs at RITW strictly adhere to global Washington Accord benchmarks, prioritizing measurable Course Outcomes (COs), Program Outcomes (POs), and industry-aligned competencies.',
    highlights: [
      'Stringent mapping of curriculum to Program Specific Outcomes (PSOs).',
      'Continuous laboratory skill evaluation with modern EDA and cloud software suites.',
      'Active industrial advisory boards and corporate MoUs for guest lectures and internships.',
      'International recognition of engineering qualification facilitating higher education abroad.'
    ]
  },
  {
    id: 'jntuh',
    title: 'Permanently Affiliated to JNTUH',
    agency: 'Jawaharlal Nehru Technological University Hyderabad',
    validity: 'Premier Technological State University of Telangana',
    icon: 'fas fa-graduation-cap',
    logo: '/images/JNTU_Hyderabad_logo.webp',
    desc: 'Maintains deep academic and regulatory alignment with Telangana\'s premier technological university, ensuring transparent examination protocols, degree integrity, and gold medal honors.',
    highlights: [
      'University nominee representation on the Governing Body and Academic Council.',
      'Official Telangana State TG EAPCET / ECET counseling participation (Code: RITW).',
      'JNTUH-ratified senior faculty members and recognized doctoral research supervisors.',
      'Conferment of B.Tech Degrees with permanent university archival.'
    ]
  }
];

const NAAC_CRITERIA = [
  { no: 'Criterion I', title: 'Curricular Aspects', score: '3.6 / 4.0', desc: 'Curriculum design, academic flexibility, feedback analysis, and value-added enrichment modules.' },
  { no: 'Criterion II', title: 'Teaching-Learning & Evaluation', score: '3.7 / 4.0', desc: 'Student-centric methods, experiential learning, doctoral faculty ratio, and robust continuous evaluation.' },
  { no: 'Criterion III', title: 'Research, Innovations & Extension', score: '3.4 / 4.0', desc: 'Faculty research papers, published patents, industry consultancy, and NSS community outreach.' },
  { no: 'Criterion IV', title: 'Infrastructure & Learning Resources', score: '3.8 / 4.0', desc: 'State-of-the-art labs, gigabit fiber Wi-Fi, air-conditioned digital library, and sports complex.' },
  { no: 'Criterion V', title: 'Student Support & Progression', score: '3.6 / 4.0', desc: 'Scholarships, CRT placement training, competitive exam guidance, and active alumni association.' },
  { no: 'Criterion VI', title: 'Governance, Leadership & Management', score: '3.5 / 4.0', desc: 'Visionary leadership, statutory bodies, financial budgeting, and IQAC quality initiatives.' },
  { no: 'Criterion VII', title: 'Institutional Values & Best Practices', score: '3.8 / 4.0', desc: 'Women empowerment, eco-friendly green campus, energy conservation, and ethical integrity.' }
];

const IQAC_MEMBERS = [
  { name: 'Dr. Md. Jeelani', role: 'Chairperson', desig: 'Principal, RITW' },
  { name: 'Dr. Archana Baburao Patil', role: 'Director / Coordinator', desig: 'Professor & HOD, CSE & Allied' },
  { name: 'Smt. M. Jayasree', role: 'Management Representative', desig: 'Secretary & Correspondent' },
  { name: 'Prof. K. Satyanarayana', role: 'Senior Administrative Officer', desig: 'Dean Academics & Autonomous Affairs' },
  { name: 'Dr. V. K. Sharma', role: 'Faculty Member', desig: 'Professor, ECE Department' },
  { name: 'Sri. G. Rama Krishna', role: 'Industry Representative', desig: 'Senior Director, Cloud Engineering, Tech Mahindra' },
  { name: 'Ms. K. Sravani', role: 'Alumni Nominee', desig: 'Lead SDE, Amazon AWS (Batch 2021)' },
  { name: 'Ms. P. Meghana', role: 'Student Nominee', desig: 'Final Year Scholar, B.Tech CSE' }
];

const STATUTORY_DOWNLOADS = [
  { title: "UGC Section 2(f) & Autonomous Conferment Order", type: "PDF Document", size: "409 KB", date: "Official UGC Order", url: "/PDFs/UGC-2f.pdf" },
  { title: "NAAC 'A' Grade Accreditation Grade Sheet", type: "PDF Document", size: "502 KB", date: "Cycle-I Institutional Sheet", url: "/PDFs/Institutional_Grade_NAAC_A_Sheet.pdf" },
  { title: "AICTE Extension of Approval (EOA) 2025–26", type: "PDF Document", size: "180 KB", date: "AICTE New Delhi", url: "/PDFs/AICTE_2025-2026.pdf" },
  { title: "AICTE Extension of Approval (EOA) 2024–25", type: "PDF Document", size: "179 KB", date: "AICTE New Delhi", url: "/PDFs/AICTE_2024-2025.pdf" },
  { title: "JNTUH Affiliation Proceedings 2024–25", type: "PDF Document", size: "298 KB", date: "JNTU Hyderabad", url: "/PDFs/JNTUH_2024-2025.pdf" },
  { title: "JNTUH Affiliation Proceedings 2023–24", type: "PDF Document", size: "290 KB", date: "JNTU Hyderabad", url: "/PDFs/JNTUH_2023-2024.pdf" },
  { title: "Institutional Development Plan (IDP)", type: "PDF Document", size: "211 KB", date: "RITW Strategic Blueprint", url: "/PDFs/RITW IDP.pdf" },
  { title: "Official B.Tech Admission Form 2026–27", type: "PDF Document", size: "233 KB", date: "Admissions Directorate", url: "/PDFs/Admission-Form.pdf" }
];

export default function Accreditation() {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const elements = document.querySelectorAll('.accreditation-page .fui-reveal');
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
    <div className="accreditation-page">
      {/* 1. Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Accreditations</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">Quality Benchmarks &amp; IQAC</span>
          </div>
          <span className="page-badge">UGC AUTONOMOUS &bull; NAAC 'A' GRADE &bull; NBA ACCREDITED</span>
          <h1 className="page-title">National Accreditations, Statutory Approvals &amp; IQAC</h1>
          <p className="page-subtitle">
            Conferred and accredited by apex statutory bodies for rigorous academic standards, outcome-based curricula, world-class labs, and ethical institutional governance.
          </p>

          {/* Quick Authority Stats Strip */}
          <div className="fui-header-stats-strip">
            <span className="fui-stat-pill"><i className="fas fa-university" aria-hidden="true"></i> UGC Autonomous (10-Yr Conferred)</span>
            <span className="fui-stat-pill"><i className="fas fa-award" aria-hidden="true"></i> NAAC 'A' Grade Cycle-I</span>
            <span className="fui-stat-pill"><i className="fas fa-certificate" aria-hidden="true"></i> NBA Tier-II Accredited</span>
            <span className="fui-stat-pill"><i className="fas fa-graduation-cap" aria-hidden="true"></i> JNTUH Permanent Affiliation</span>
            <span className="fui-stat-pill"><i className="fas fa-file-contract" aria-hidden="true"></i> AICTE EOA Approved</span>
          </div>
        </div>
      </section>

      {/* 2. Anchor Navigation Bar */}
      <nav className="page-subnav-bar" aria-label="Accreditation section navigation">
        <div className="container subnav-inner">
          <a href="#overview" className={`subnav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            Accreditation Summary
          </a>
          <a href="#ugc" className={`subnav-link ${activeTab === 'ugc' ? 'active' : ''}`} onClick={() => setActiveTab('ugc')}>
            UGC Autonomous
          </a>
          <a href="#naac" className={`subnav-link ${activeTab === 'naac' ? 'active' : ''}`} onClick={() => setActiveTab('naac')}>
            NAAC 'A' Grade
          </a>
          <a href="#nba" className={`subnav-link ${activeTab === 'nba' ? 'active' : ''}`} onClick={() => setActiveTab('nba')}>
            NBA Accreditation
          </a>
          <a href="#iqac" className={`subnav-link ${activeTab === 'iqac' ? 'active' : ''}`} onClick={() => setActiveTab('iqac')}>
            IQAC Quality Cell
          </a>
          <a href="#nirf" className={`subnav-link ${activeTab === 'nirf' ? 'active' : ''}`} onClick={() => setActiveTab('nirf')}>
            NIRF &amp; Downloads
          </a>
        </div>
      </nav>

      {/* 3. Accreditation Cards Grid */}
      <section id="overview" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">QUALITY ASSURANCE</span>
            <h2 className="section-title">Hallmarks of Institutional Eminence</h2>
            <p className="section-subtitle">Meeting and exceeding the highest statutory benchmarks in technical higher education.</p>
          </div>

          <div className="accreditations-grid">
            {ACCREDITATIONS_DATA.map((acc, idx) => (
              <div key={acc.id} id={acc.id} className={`acc-card fui-reveal fui-delay-${idx + 1}`}>
                <div className="acc-card-top">
                  <img src={acc.logo} alt={acc.title} className="acc-card-logo" />
                  <span className="acc-authority-tag">
                    {acc.agency}
                  </span>
                </div>
                <h3 className="acc-card-title">{acc.title}</h3>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--fui-emerald)', marginBottom: '12px' }}>
                  <i className="fas fa-calendar-check" aria-hidden="true" style={{ marginRight: '6px' }}></i>
                  {acc.validity}
                </div>
                <p className="acc-card-desc" style={{ marginBottom: '16px' }}>{acc.desc}</p>
                <div style={{ borderTop: '1px solid var(--fui-border-light)', paddingTop: '14px' }}>
                  <strong style={{ fontSize: '12px', color: 'var(--fui-navy)', display: 'block', marginBottom: '8px' }}>Key Highlights &amp; Mandates:</strong>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {acc.highlights.map((item, hIdx) => (
                      <li key={hIdx} style={{ fontSize: '12px', color: 'var(--fui-text-muted)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <i className="fas fa-check" style={{ color: 'var(--fui-emerald)', marginTop: '3px', fontSize: '10px' }} aria-hidden="true"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NAAC Assessment Criteria Breakdown */}
      <section id="naac-criteria" className="statutory-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">CRITERIA EVALUATION</span>
            <h2 className="section-title">NAAC 'A' Grade 7-Criteria Performance</h2>
            <p className="section-subtitle">Evaluated and scored comprehensively across every dimension of institutional operations.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
            {NAAC_CRITERIA.map((crit, idx) => (
              <div 
                key={idx} 
                className={`cell-card fui-reveal fui-delay-${(idx % 4) + 1}`}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--fui-navy)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      {crit.no}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--fui-emerald-dark)', background: 'var(--fui-emerald-tint)', border: '1px solid var(--fui-emerald-border)', padding: '2px 8px', borderRadius: '100px' }}>
                      {crit.score}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--fui-navy)', marginBottom: '8px' }}>
                    {crit.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--fui-text-muted)', lineHeight: '1.6', margin: 0 }}>
                    {crit.desc}
                  </p>
                </div>
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--fui-border-light)', fontSize: '11px', color: 'var(--fui-text-soft)', fontWeight: 600 }}>
                  <i className="fas fa-shield-alt" aria-hidden="true" style={{ color: 'var(--fui-emerald)', marginRight: '4px' }}></i>
                  Validated by NAAC Peer Committee
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. IQAC (Internal Quality Assurance Cell) */}
      <section id="iqac" className="page-content-section">
        <div className="container">
          <div className="about-split-grid">
            <div className="fui-reveal fui-delay-1">
              <span className="section-badge">INTERNAL QUALITY ASSURANCE</span>
              <h2 className="section-title">IQAC Quality Cell &amp; Governance</h2>
              <p className="paragraph-main">
                The Internal Quality Assurance Cell (IQAC) at RITW functions as the nodal steering body for maintaining continuous improvement in academic, research, and administrative practices.
              </p>
              <p className="paragraph-secondary">
                Constituted as per UGC and NAAC guidelines, IQAC designs the Annual Quality Assurance Report (AQAR), monitors outcome-based pedagogical benchmarks, analyzes stakeholder feedback (students, parents, alumni, and recruiters), and conducts academic audits.
              </p>
              <div className="quality-policy-card">
                <div className="policy-badge">
                  <i className="fas fa-bullseye" aria-hidden="true"></i>
                  <span>IQAC Quality Objectives</span>
                </div>
                <ul className="vm-list" style={{ marginTop: '10px' }}>
                  <li>
                    <i className="fas fa-angle-right" aria-hidden="true"></i>
                    <span>Systematize pedagogical delivery through modern blended learning tools.</span>
                  </li>
                  <li>
                    <i className="fas fa-angle-right" aria-hidden="true"></i>
                    <span>Conduct internal and external academic and administrative audits annually.</span>
                  </li>
                  <li>
                    <i className="fas fa-angle-right" aria-hidden="true"></i>
                    <span>Facilitate faculty development programs (FDPs) in emerging technologies.</span>
                  </li>
                  <li>
                    <i className="fas fa-angle-right" aria-hidden="true"></i>
                    <span>Cultivate an institutional culture of research, patents, and ethical compliance.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* IQAC Composition Table */}
            <div className="fui-reveal fui-delay-2">
              <div style={{ background: '#ffffff', borderRadius: 'var(--fui-radius-lg)', padding: '24px', boxShadow: 'var(--fui-shadow-sm)', border: '1px solid var(--fui-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--fui-border-light)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--fui-radius-md)', background: 'var(--fui-navy-tint)', color: 'var(--fui-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    <i className="fas fa-users-cog" aria-hidden="true"></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--fui-navy)', margin: 0 }}>IQAC Executive Committee</h3>
                    <span style={{ fontSize: '12px', color: 'var(--fui-text-muted)' }}>Constituted Under NAAC &amp; UGC Mandates</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {IQAC_MEMBERS.map((mem, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: idx % 2 === 0 ? 'var(--fui-subtle)' : '#ffffff', borderRadius: '6px', fontSize: '13px', border: '1px solid var(--fui-border-light)' }}>
                      <div>
                        <strong style={{ color: 'var(--fui-navy)', display: 'block' }}>{mem.name}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--fui-text-muted)' }}>{mem.desig}</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--fui-navy)', background: 'var(--fui-navy-tint)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--fui-navy-border)' }}>
                        {mem.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NIRF & Statutory Public Downloads */}
      <section id="nirf" className="statutory-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">TRANSPARENCY &amp; DISCLOSURES</span>
            <h2 className="section-title">Official Accreditation &amp; Statutory Downloads</h2>
            <p className="section-subtitle">Transparent public disclosure of institutional approvals, ranking data, and audit reports.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {STATUTORY_DOWNLOADS.map((doc, idx) => (
              <div 
                key={idx} 
                className={`gov-card fui-reveal fui-delay-${(idx % 4) + 1}`} 
                style={{ textAlign: 'left', padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--fui-emerald-tint)', color: 'var(--fui-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      <i className="fas fa-file-pdf" aria-hidden="true"></i>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--fui-navy)', background: 'var(--fui-navy-tint)', border: '1px solid var(--fui-navy-border)', padding: '2px 8px', borderRadius: '4px' }}>
                      {doc.size}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--fui-navy)', marginBottom: '6px', lineHeight: 1.4 }}>
                    {doc.title}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--fui-emerald)', fontWeight: 600 }}>
                    {doc.date}
                  </span>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--fui-border-light)' }}>
                  <a 
                    href={doc.url} 
                    download
                    className="btn-cta btn-cta-navy" 
                    style={{ width: '100%', padding: '7px 12px', fontSize: '12px', textAlign: 'center', justifyContent: 'center' }}
                  >
                    <i className="fas fa-download" aria-hidden="true"></i>
                    <span>Download Official PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
