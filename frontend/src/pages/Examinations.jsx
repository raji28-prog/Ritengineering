import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const EXAM_CIRCULARS = [
  {
    date: '28 OCT 2026',
    title: 'Autonomous B.Tech II & IV Year End Semester Regular/Supplementary Timetable Declared',
    category: 'TIMETABLE',
    status: 'ACTIVE'
  },
  {
    date: '15 OCT 2026',
    title: 'Notification for Recounting and Revaluation of B.Tech End Semester Examinations',
    category: 'REVALUATION',
    status: 'ACTIVE'
  },
  {
    date: '02 OCT 2026',
    title: 'Submission of Condonation Applications for Shortage of Attendance (Above 65%)',
    category: 'CONDONATION',
    status: 'CLOSED'
  },
  {
    date: '18 SEP 2026',
    title: 'Instructions for Hall Ticket Download and Biometric Verification Protocol',
    category: 'GUIDELINES',
    status: 'CIRCULAR'
  }
];

const DOWNLOAD_FORMS = [
  { title: "Application for Revaluation / Recounting", desc: "For re-verifying answer scripts within 15 days of result declaration.", icon: "fas fa-search-plus" },
  { title: "Application for Official Transcripts", desc: "For higher studies and foreign university credential evaluation.", icon: "fas fa-file-alt" },
  { title: "Application for Duplicate Marks Memo / CMM", desc: "Requires police FIR copy and affidavit in prescribed format.", icon: "fas fa-copy" },
  { title: "Application for Condonation of Attendance", desc: "Medical grounds verification for attendance between 65% and 75%.", icon: "fas fa-notes-medical" },
  { title: "Application for Migration / Transfer Certificate", desc: "For students passing out or transitioning under autonomous rules.", icon: "fas fa-plane-departure" },
  { title: "Grievance Redressal Form (Exam Cell)", desc: "Formal submission for evaluation, grading, or clerical discrepancies.", icon: "fas fa-exclamation-triangle" }
];

const MALPRACTICE_RULES = [
  {
    offense: "Possession of unauthorized material / mobile phone in exam hall",
    punishment: "Expulsion from the examination hall and cancellation of the performance in that subject."
  },
  {
    offense: "Copying or giving assistance to other candidates",
    punishment: "Cancellation of performance in all subjects of that examination semester."
  },
  {
    offense: "Impersonation in examination hall",
    punishment: "Rustication for a period of one academic year and police complaint filing."
  },
  {
    offense: "Misbehavior or threatening exam invigilators / hall superintendents",
    punishment: "Rustication for two years and debarment from taking university examinations."
  }
];

export default function Examinations() {
  const [activeTab, setActiveTab] = useState('coe');
  const [resultInput, setResultInput] = useState('');
  const [resultShown, setResultShown] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll('.examinations-page .fui-reveal');
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

  const handleResultSearch = (e) => {
    e.preventDefault();
    if (resultInput.trim()) {
      setResultShown(true);
    }
  };

  return (
    <div className="examinations-page">
      {/* 1. Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Examinations</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">Controller of Examinations</span>
          </div>
          <span className="page-badge">UGC AUTONOMOUS EXAMINATION DESK &bull; JNTUH AFFILIATED</span>
          <h1 className="page-title">Examination Branch &amp; COE</h1>
          <p className="page-subtitle">
            Ensuring high standards of integrity, transparency, and timely conduct of autonomous examinations, confidential paper setting, continuous evaluations, and prompt results publishing.
          </p>

          {/* Quick Authority Stats Strip */}
          <div className="fui-header-stats-strip">
            <span className="fui-stat-pill"><i className="fas fa-shield-alt" aria-hidden="true"></i> Controller of Examinations (COE) Desk</span>
            <span className="fui-stat-pill"><i className="fas fa-barcode" aria-hidden="true"></i> Barcoded Answer Scripts</span>
            <span className="fui-stat-pill"><i className="fas fa-chart-line" aria-hidden="true"></i> Online SGPA / CGPA Portal</span>
            <span className="fui-stat-pill"><i className="fas fa-balance-scale" aria-hidden="true"></i> Malpractice Enquiry Committee</span>
            <span className="fui-stat-pill"><i className="fas fa-university" aria-hidden="true"></i> JNTUH Results Alignment</span>
          </div>
        </div>
      </section>

      {/* 2. Subnav Bar */}
      <nav className="page-subnav-bar" aria-label="Examinations Navigation">
        <div className="container subnav-inner">
          <a 
            href="#coe" 
            className={`subnav-link ${activeTab === 'coe' ? 'active' : ''}`} 
            onClick={() => setActiveTab('coe')}
          >
            About Exam Cell &amp; COE
          </a>
          <a 
            href="#notifications" 
            className={`subnav-link ${activeTab === 'notifications' ? 'active' : ''}`} 
            onClick={() => setActiveTab('notifications')}
          >
            Timetables &amp; Circulars
          </a>
          <a 
            href="#results" 
            className={`subnav-link ${activeTab === 'results' ? 'active' : ''}`} 
            onClick={() => setActiveTab('results')}
          >
            Autonomous Results Portal
          </a>
          <a 
            href="#malpractice" 
            className={`subnav-link ${activeTab === 'malpractice' ? 'active' : ''}`} 
            onClick={() => setActiveTab('malpractice')}
          >
            Malpractice Guidelines
          </a>
          <a 
            href="#transcripts" 
            className={`subnav-link ${activeTab === 'transcripts' ? 'active' : ''}`} 
            onClick={() => setActiveTab('transcripts')}
          >
            Transcripts &amp; Forms
          </a>
        </div>
      </nav>

      {/* 3. About COE Desk */}
      <section id="coe" className="page-content-section">
        <div className="container">
          <div className="about-split-grid" style={{ alignItems: 'center' }}>
            <div className="fui-reveal fui-delay-1">
              <span className="section-badge">AUTONOMOUS ADMINISTRATION</span>
              <h2 className="section-title">Controller of Examinations (COE) Desk</h2>
              <p className="paragraph-main">
                The Examination Branch at <strong>Rishi M.S Institute of Engineering &amp; Technology for Women</strong> operates with utmost confidentiality, precision, and adherence to UGC Autonomous and JNTUH norms.
              </p>
              <p className="paragraph-secondary">
                The branch is responsible for continuous internal evaluations (CIE), question paper setting by external subject experts, centralized evaluation camps, moderation, computation of SGPA/CGPA on the 10-point scale, and timely distribution of digital marks memos.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--fui-navy)' }}>
                  <i className="fas fa-check-circle" style={{ color: 'var(--fui-emerald)' }} aria-hidden="true"></i>
                  <span>Double Evaluation &amp; Third Valuation Procedure</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--fui-navy)' }}>
                  <i className="fas fa-check-circle" style={{ color: 'var(--fui-emerald)' }} aria-hidden="true"></i>
                  <span>End-to-End Cryptographically Secured Barcode Answer Scripts</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--fui-navy)' }}>
                  <i className="fas fa-check-circle" style={{ color: 'var(--fui-emerald)' }} aria-hidden="true"></i>
                  <span>Online Results Declaration within 15–20 Days</span>
                </div>
              </div>
            </div>

            <div className="fui-reveal fui-delay-2">
              <div className="about-highlight-box">
                <h3 className="highlight-box-title">
                  <i className="fas fa-user-shield" aria-hidden="true"></i>
                  <span>COE Confidential Team</span>
                </h3>
                <ul className="highlight-list">
                  <li>
                    <i className="fas fa-user-tie" aria-hidden="true"></i>
                    <div>
                      <strong>Controller of Examinations (COE)</strong>
                      <span>Dr. Md. Jeelani, M.Tech., Ph.D.</span>
                      <div style={{ fontSize: '12px', color: 'var(--fui-navy)', marginTop: '2px' }}>coe@rishimsengg.ac.in</div>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-user-check" aria-hidden="true"></i>
                    <div>
                      <strong>Additional Controller of Examinations</strong>
                      <span>Assoc. Prof. V. K. Sharma (Evaluation &amp; Records)</span>
                      <div style={{ fontSize: '12px', color: 'var(--fui-navy)', marginTop: '2px' }}>ace1@rishimsengg.ac.in</div>
                    </div>
                  </li>
                  <li>
                    <i className="fas fa-phone-alt" aria-hidden="true"></i>
                    <div>
                      <strong>Examination Confidential Cell Helpline</strong>
                      <span>Room No: 104, Ground Floor, Admin Block</span>
                      <div style={{ fontSize: '12px', color: 'var(--fui-emerald-dark)', fontWeight: '700', marginTop: '2px' }}>+91-967-623-3050 (Ext: 104)</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Timetables & Notifications */}
      <section id="notifications" className="statutory-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">OFFICIAL CIRCULARS</span>
            <h2 className="section-title">Examination Schedules &amp; Notifications</h2>
            <p className="section-subtitle">Real-time notifications for autonomous examinations, fee payment deadlines, and hall tickets.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {EXAM_CIRCULARS.map((cir, idx) => (
              <div key={idx} className={`cell-card fui-reveal fui-delay-${idx + 1}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', padding: '18px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div style={{ background: 'var(--fui-navy-tint)', color: 'var(--fui-navy)', border: '1px solid var(--fui-navy-border)', padding: '8px 14px', borderRadius: '6px', textAlign: 'center', fontWeight: '800', fontSize: '12px', minWidth: '85px' }}>
                    {cir.date}
                  </div>
                  <div>
                    <span className="dept-badge" style={{ marginBottom: '4px', display: 'inline-block' }}>{cir.category}</span>
                    <h4 style={{ fontSize: '15.5px', fontWeight: '700', color: 'var(--fui-navy)', margin: 0 }}>{cir.title}</h4>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn-cta btn-cta-navy" style={{ padding: '7px 16px', fontSize: '12px' }} onClick={() => alert(`Downloading circular: ${cir.title}`)}>
                    <i className="fas fa-download" aria-hidden="true"></i> Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Online Autonomous Results Portal */}
      <section id="results" className="page-content-section">
        <div className="container">
          <div className="fui-results-search-card fui-reveal fui-delay-1">
            <div className="section-badge">AUTONOMOUS RESULT VERIFICATION</div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--fui-navy)', marginTop: '8px', marginBottom: '12px' }}>
              Online Examination Results Portal
            </h2>
            <p style={{ color: 'var(--fui-text-muted)', fontSize: '14.5px', marginBottom: '28px' }}>
              Enter your 10-digit Hall Ticket Number (e.g. 24RITW0501) to view semester SGPA, CGPA, and grade breakdowns.
            </p>

            <form onSubmit={handleResultSearch} style={{ display: 'flex', gap: '12px', maxWidth: '520px', margin: '0 auto 20px', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                value={resultInput}
                onChange={(e) => setResultInput(e.target.value)}
                placeholder="Enter 10-Digit Hall Ticket No" 
                className="search-input"
                style={{ flex: 1, minWidth: '220px', textTransform: 'uppercase' }}
                required
              />
              <button type="submit" className="btn-cta btn-cta-green">
                <i className="fas fa-search" aria-hidden="true"></i>
                <span>Get Result</span>
              </button>
            </form>

            {resultShown && (
              <div className="fui-result-display fui-reveal fui-revealed">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--fui-border)', paddingBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <strong style={{ color: 'var(--fui-navy)', fontSize: '16px' }}>Hall Ticket: {resultInput.toUpperCase()}</strong>
                    <div style={{ fontSize: '13px', color: 'var(--fui-text-muted)' }}>B.Tech Autonomous Semester Regular Examination</div>
                  </div>
                  <span className="section-badge" style={{ margin: 0 }}>RESULT: PASSED</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ background: 'var(--fui-subtle)', padding: '12px', borderRadius: '6px', border: '1px solid var(--fui-border)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--fui-text-muted)' }}>Semester SGPA</div>
                    <strong style={{ fontSize: '20px', color: 'var(--fui-navy)' }}>8.74</strong>
                  </div>
                  <div style={{ background: 'var(--fui-subtle)', padding: '12px', borderRadius: '6px', border: '1px solid var(--fui-border)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--fui-text-muted)' }}>Cumulative CGPA</div>
                    <strong style={{ fontSize: '20px', color: 'var(--fui-navy)' }}>8.65</strong>
                  </div>
                  <div style={{ background: 'var(--fui-subtle)', padding: '12px', borderRadius: '6px', border: '1px solid var(--fui-border)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--fui-text-muted)' }}>Total Credits Earned</div>
                    <strong style={{ fontSize: '20px', color: 'var(--fui-emerald)' }}>22 / 22</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button type="button" className="btn-cta btn-cta-navy" style={{ padding: '8px 18px', fontSize: '13px' }} onClick={() => alert('Digital provisional grade sheet downloaded.')}>
                    <i className="fas fa-file-download" aria-hidden="true"></i> Download Provisional Grade Memo
                  </button>
                </div>
              </div>
            )}

            <div style={{ fontSize: '12.5px', color: 'var(--fui-text-soft)', marginTop: '16px' }}>
              Affiliated to JNTUH &bull; For past university-managed results (prior to autonomy), visit <a href="https://jntuhresults.in/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fui-navy)', textDecoration: 'underline' }}>jntuhresults.in</a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Malpractice Guidelines */}
      <section id="malpractice" className="statutory-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge" style={{ background: 'var(--fui-emerald-tint)', color: 'var(--fui-emerald-dark)', borderColor: 'var(--fui-emerald-border)' }}>STATUTORY DISCIPLINE</span>
            <h2 className="section-title">Punishment for Malpractice Cases</h2>
            <p className="section-subtitle">Strict compliance guidelines enforced by the Malpractice Enquiry Committee (MEC) under JNTUH &amp; Autonomous rules.</p>
          </div>

          <div className="fui-table-wrap fui-reveal fui-delay-1">
            <table className="fui-data-table">
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Nature of Malpractice / Indiscipline</th>
                  <th>Punishment Awarded</th>
                </tr>
              </thead>
              <tbody>
                {MALPRACTICE_RULES.map((rule, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '600', color: 'var(--fui-navy)' }}>
                      <i className="fas fa-exclamation-circle" style={{ color: 'var(--fui-navy-light)', marginRight: '8px' }} aria-hidden="true"></i>
                      {rule.offense}
                    </td>
                    <td style={{ color: 'var(--fui-text-body)', fontWeight: '600' }}>{rule.punishment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. Download Applications & Transcripts */}
      <section id="transcripts" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">STUDENT DESK</span>
            <h2 className="section-title">Download Examination Applications &amp; Forms</h2>
            <p className="section-subtitle">Official downloadable forms for transcripts, duplicate memos, revaluations, and certificates.</p>
          </div>

          <div className="cells-grid">
            {DOWNLOAD_FORMS.map((form, idx) => (
              <div key={idx} className={`cell-card fui-reveal fui-delay-${(idx % 3) + 1}`}>
                <div className="cell-icon">
                  <i className={form.icon} aria-hidden="true"></i>
                </div>
                <h3 className="cell-title">{form.title}</h3>
                <p className="cell-desc" style={{ marginBottom: '14px' }}>{form.desc}</p>
                <button type="button" className="btn-cta btn-cta-navy" style={{ padding: '7px 14px', fontSize: '12px' }} onClick={() => alert(`Downloading form: ${form.title}`)}>
                  <i className="fas fa-file-pdf" aria-hidden="true"></i> Download Form
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
