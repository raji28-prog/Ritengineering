import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const GOVERNING_BODY = [
  { name: 'Prof. S. Jeelani', role: 'Chairman, Governing Body', desc: 'Renowned academician, former Director, Centre for Virtual Learning, University of Hyderabad. 30+ years in teaching, research, and institutional administration.' },
  { name: 'Smt. M. Jayasree', role: 'Secretary & Correspondent', desc: 'Founding member of Rishi Educational Institutions, social visionary, and Vikas Ratan Gold Medal Award recipient championing women\'s higher technical education.' },
  { name: 'Dr. Md. Jeelani', role: 'Principal & Member Secretary', desc: 'M.Tech., Ph.D., veteran academic administrator steering institutional autonomy, NAAC/NBA accreditations, and university curriculum governance.' },
  { name: 'Dr. G. K. Vishwanadh', role: 'JNTUH University Nominee', desc: 'Professor of Civil Engineering & UGC Autonomy Monitor, JNTU Hyderabad, overseeing regulatory and degree compliance.' },
  { name: 'AICTE Nominee (Ex-Officio)', role: 'Regional Officer, AICTE SCRO', desc: 'Nominated by AICTE New Delhi to review infrastructural, intake, and Tier-II pedagogical benchmarks.' },
  { name: 'State Government Nominee', role: 'Department of Technical Education, Telangana', desc: 'State representative ensuring adherence to convenor quotas, admissions rules, and TS Epass welfare schemes.' },
  { name: 'Sri. K. Satyanarayana', role: 'Industry Expert (IT Sector)', desc: 'Vice President & Head of Engineering, Tier-1 Software Enterprise, Hyderabad, aligning curriculum with industry hiring expectations.' },
  { name: 'Dr. Archana Baburao Patil', role: 'Senior Faculty Member', desc: 'Professor & Head of Department, CSE & Allied Specializations, representing institutional faculty interests.' }
];

const STATUTORY_COUNCILS = [
  {
    id: 'governing-body',
    title: 'Governing Body',
    desc: 'Apex statutory authority framing institutional policies, long-term development roadmaps, financial budgets, infrastructure expansion, and UGC compliance.',
    icon: 'fas fa-balance-scale',
    membersCount: '12 Members'
  },
  {
    id: 'academic-council',
    title: 'Academic Council',
    desc: 'Approving autonomous syllabi, course structures, credit allocation, academic calendars, semester examination rules, and admission regulations.',
    icon: 'fas fa-book-reader',
    membersCount: '18 Members'
  },
  {
    id: 'bos',
    title: 'Board of Studies (BOS)',
    desc: 'Departmental expert panels comprising senior professors, university subject nominees, and industry leaders revising curricula for CSE, AIML, DS, IT, and ECE.',
    icon: 'fas fa-chalkboard-teacher',
    membersCount: '5 Departmental Panels'
  },
  {
    id: 'finance',
    title: 'Finance Committee',
    desc: 'Scrutinizing annual budgets, audited balance sheets, capital allocation for high-performance computing clusters, faculty grants, and student fee structures.',
    icon: 'fas fa-coins',
    membersCount: '5 Members'
  }
];

const COMMITTEES = [
  { title: "Anti-Ragging Squad & Committee", icon: "fas fa-shield-alt", desc: "Enforcing zero-tolerance policy against ragging with 24/7 security surveillance and quick redressal teams.", head: "Dr. Md. Jeelani (Chairman)" },
  { title: "Internal Complaints Committee (ICC)", icon: "fas fa-female", desc: "Statutory committee constituted in compliance with the POSH Act ensuring a dignified and safe campus for women.", head: "Smt. M. Jayasree (Convener)" },
  { title: "Grievance Redressal Cell", icon: "fas fa-clipboard-check", desc: "Formal mechanism for redressal of student, parent, and faculty concerns with online tracking and swift resolution.", head: "Prof. V. K. Sharma (Officer)" },
  { title: "Internal Quality Assurance Cell (IQAC)", icon: "fas fa-chart-line", desc: "Continuous monitoring of outcome-based teaching standards, feedback audits, and accreditation benchmarks.", head: "Dr. Archana B. Patil (Director)" },
  { title: "SC / ST / OBC / Minority Cell", icon: "fas fa-hands-helping", desc: "Ensuring social equity, government scholarship disbursement guidance, and remedial mentoring for affirmative groups.", head: "Liaison Officer Desk" },
  { title: "Library & E-Learning Committee", icon: "fas fa-book-reader", desc: "Overseeing procurement of technical volumes, IEEE/DELNET digital databases, and 24/7 e-learning infrastructure.", head: "Chief Librarian & Team" }
];

export default function Governance() {
  const [activeTab, setActiveTab] = useState('councils');

  useEffect(() => {
    const elements = document.querySelectorAll('.governance-page .fui-reveal');
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
    <div className="governance-page">
      {/* 1. Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Governance</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">Statutory Councils &amp; Leadership</span>
          </div>
          <span className="page-badge">AUTONOMOUS GOVERNANCE &bull; STATUTORY COMMITTEES</span>
          <h1 className="page-title">Institutional Governance &amp; Administration</h1>
          <p className="page-subtitle">
            Ethical, transparent, and outcome-focused governance spearheaded by visionary academicians, university nominees, and industry leaders ensuring the highest educational standards.
          </p>

          {/* Quick Authority Stats Strip */}
          <div className="fui-header-stats-strip">
            <span className="fui-stat-pill"><i className="fas fa-balance-scale" aria-hidden="true"></i> Governing Body &amp; Council</span>
            <span className="fui-stat-pill"><i className="fas fa-book-reader" aria-hidden="true"></i> Academic Council</span>
            <span className="fui-stat-pill"><i className="fas fa-chalkboard-teacher" aria-hidden="true"></i> Board of Studies (BOS)</span>
            <span className="fui-stat-pill"><i className="fas fa-shield-alt" aria-hidden="true"></i> Statutory Grievance Squads</span>
            <span className="fui-stat-pill"><i className="fas fa-sitemap" aria-hidden="true"></i> Transparent Organogram</span>
          </div>
        </div>
      </section>

      {/* 2. Subnav Bar */}
      <nav className="page-subnav-bar" aria-label="Governance sections">
        <div className="container subnav-inner">
          <a 
            href="#councils" 
            className={`subnav-link ${activeTab === 'councils' ? 'active' : ''}`} 
            onClick={() => setActiveTab('councils')}
          >
            Statutory Councils
          </a>
          <a 
            href="#governing-body" 
            className={`subnav-link ${activeTab === 'governing-body' ? 'active' : ''}`} 
            onClick={() => setActiveTab('governing-body')}
          >
            Governing Body Members
          </a>
          <a 
            href="#committees" 
            className={`subnav-link ${activeTab === 'committees' ? 'active' : ''}`} 
            onClick={() => setActiveTab('committees')}
          >
            Mandatory Committees
          </a>
          <a 
            href="#organogram" 
            className={`subnav-link ${activeTab === 'organogram' ? 'active' : ''}`} 
            onClick={() => setActiveTab('organogram')}
          >
            Organogram &amp; Workflow
          </a>
          <a 
            href="#conduct" 
            className={`subnav-link ${activeTab === 'conduct' ? 'active' : ''}`} 
            onClick={() => setActiveTab('conduct')}
          >
            Code of Conduct
          </a>
        </div>
      </nav>

      {/* 3. Statutory Councils Grid */}
      <section id="councils" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">AUTONOMOUS COUNCILS</span>
            <h2 className="section-title">Autonomous Administrative Bodies</h2>
            <p className="section-subtitle">Constituted as per UGC Autonomous Regulations and JNTU Hyderabad Statutes.</p>
          </div>

          <div className="cells-grid">
            {STATUTORY_COUNCILS.map((c, idx) => (
              <div key={idx} id={c.id} className={`cell-card fui-reveal fui-delay-${idx + 1}`}>
                <div className="cell-icon">
                  <i className={c.icon} aria-hidden="true"></i>
                </div>
                <span className="dept-badge" style={{ marginBottom: '8px', display: 'inline-block' }}>{c.membersCount}</span>
                <h3 className="cell-title">{c.title}</h3>
                <p className="cell-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Governing Body Members Directory */}
      <section id="governing-body" className="statutory-section">
        <div className="container" id="governing-council">
          <div className="section-header">
            <span className="section-badge">LEADERSHIP DIRECTORY</span>
            <h2 className="section-title">Governing Body / Governing Council</h2>
            <p className="section-subtitle">Distinguished educators, university monitors, government representatives, and institutional founders.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {GOVERNING_BODY.map((member, idx) => (
              <div key={idx} className={`cell-card fui-reveal fui-delay-${(idx % 4) + 1}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'var(--fui-navy-tint)', color: 'var(--fui-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, border: '1px solid var(--fui-navy-border)' }}>
                    <i className="fas fa-user-tie" aria-hidden="true"></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--fui-navy)', margin: 0 }}>{member.name}</h4>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--fui-emerald)' }}>{member.role}</span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--fui-text-muted)', lineHeight: 1.6, margin: 0 }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Mandatory Committees */}
      <section id="committees" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">STATUTORY COMPLIANCE</span>
            <h2 className="section-title">Mandatory Committees &amp; Grievance Cells</h2>
            <p className="section-subtitle">Dedicated faculty-led squads ensuring safety, student dignity, and academic quality assurance.</p>
          </div>

          <div className="cells-grid">
            {COMMITTEES.map((cm, idx) => (
              <div key={idx} className={`cell-card fui-reveal fui-delay-${(idx % 3) + 1}`}>
                <div className="cell-icon">
                  <i className={cm.icon} aria-hidden="true"></i>
                </div>
                <h3 className="cell-title">{cm.title}</h3>
                <p className="cell-desc" style={{ marginBottom: '12px' }}>{cm.desc}</p>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--fui-navy)', background: 'var(--fui-subtle)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--fui-border)' }}>
                  <i className="fas fa-user-check" aria-hidden="true" style={{ marginRight: '6px', color: 'var(--fui-emerald)' }}></i>
                  {cm.head}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Organogram & Workflow */}
      <section id="organogram" className="statutory-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">ADMINISTRATIVE HIERARCHY</span>
            <h2 className="section-title">Institutional Organogram &amp; Workflow</h2>
            <p className="section-subtitle">Clear operational hierarchy ensuring accountable decision-making and academic responsiveness.</p>
          </div>

          <div className="fui-organogram-wrap fui-reveal fui-delay-1">
            <div className="fui-org-node-top">
              Governing Body (Chairman &amp; Secretary)
            </div>
            <div className="fui-org-connector"></div>
            <div className="fui-org-node-mid">
              Principal &amp; Member Secretary
            </div>
            <div className="fui-org-connector"></div>

            <div className="fui-org-grid">
              <div className="fui-org-card">
                <i className="fas fa-book-reader" aria-hidden="true"></i>
                <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--fui-navy)', marginBottom: '2px' }}>Academic Council &amp; HODs</div>
                <div style={{ fontSize: '12px', color: 'var(--fui-text-muted)' }}>Curriculum &amp; Instruction</div>
              </div>
              <div className="fui-org-card">
                <i className="fas fa-file-signature" style={{ color: 'var(--fui-emerald)' }} aria-hidden="true"></i>
                <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--fui-navy)', marginBottom: '2px' }}>Controller of Exams (COE)</div>
                <div style={{ fontSize: '12px', color: 'var(--fui-text-muted)' }}>Examinations &amp; Results</div>
              </div>
              <div className="fui-org-card">
                <i className="fas fa-atom" aria-hidden="true"></i>
                <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--fui-navy)', marginBottom: '2px' }}>R&amp;D &amp; Incubation Wing</div>
                <div style={{ fontSize: '12px', color: 'var(--fui-text-muted)' }}>Patents, Grants &amp; Startups</div>
              </div>
              <div className="fui-org-card">
                <i className="fas fa-briefcase" aria-hidden="true"></i>
                <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--fui-navy)', marginBottom: '2px' }}>Placement &amp; Corporate Cell</div>
                <div style={{ fontSize: '12px', color: 'var(--fui-text-muted)' }}>Training &amp; On-Campus Hiring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Code of Conduct & Student Handbook (Modern White Theme) */}
      <section id="conduct" className="page-content-section">
        <div className="container">
          <div className="fui-reveal fui-delay-2" style={{ background: '#ffffff', border: '1px solid var(--fui-border)', borderLeft: '4px solid var(--fui-emerald)', borderRadius: 'var(--fui-radius-xl)', padding: '36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', boxShadow: 'var(--fui-shadow-sm)' }}>
            <div>
              <span className="section-badge">PUBLIC POLICIES &amp; ETHICS</span>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--fui-navy)', margin: '8px 0 10px' }}>
                Institutional Code of Conduct &amp; Student Handbook
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--fui-text-muted)', maxWidth: '720px', margin: 0, lineHeight: 1.65 }}>
                Comprehensive code of ethics for students, teaching faculty, and administrative staff governing professional conduct, attendance norms, and laboratory discipline.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button type="button" className="btn-cta btn-cta-green" onClick={() => alert('Downloading Code of Conduct PDF')}>
                <i className="fas fa-download" aria-hidden="true"></i>
                <span>Download Code of Conduct</span>
              </button>
              <button type="button" className="btn-cta hero-btn-secondary" onClick={() => alert('Downloading Students Handbook PDF')}>
                <i className="fas fa-book" aria-hidden="true"></i>
                <span>Students Handbook</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
