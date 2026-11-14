import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const REGULATIONS = [
  {
    code: 'R-26 CBCS',
    title: 'Choice Based Credit System (CBCS)',
    desc: 'Structured under Autonomous guidelines enabling interdisciplinary open electives, project-based credits, and flexible learning pathways aligned with NEP 2020.',
    credits: '160 Credits for 4-Year B.Tech',
    icon: 'fas fa-book'
  },
  {
    code: 'CONTINUOUS CIE',
    title: 'Continuous Internal Evaluation',
    desc: '40% Continuous Internal Evaluation through objective mid-terms, coding assignments, lab vivas, and interactive seminar presentations.',
    credits: '40% Internal + 60% End Semester',
    icon: 'fas fa-tasks'
  },
  {
    code: 'OUTCOME BASED',
    title: 'Outcome-Based Education (OBE)',
    desc: 'Curriculum structured with clear Course Outcomes (COs), Program Outcomes (POs), and Program Specific Outcomes (PSOs) mapped directly to industry readiness.',
    credits: 'NBA Tier-II Aligned Metrics',
    icon: 'fas fa-graduation-cap'
  },
  {
    code: 'INTERNSHIPS',
    title: 'Mandatory Industry Internships',
    desc: 'Summer corporate internships at tech enterprises with academic credit allocation, industrial mentor evaluations, and prototype viva-voce.',
    credits: 'Minimum 6-8 Weeks Industrial Training',
    icon: 'fas fa-briefcase'
  }
];

const CALENDARS = [
  {
    year: 'B.Tech I Year (Batch 2026–30)',
    commence: '01 September 2026',
    mid1: '02 Nov – 07 Nov 2026',
    mid2: '04 Jan – 09 Jan 2027',
    prep: '11 Jan – 16 Jan 2027',
    exams: '18 Jan – 30 Jan 2027',
    badge: 'AUTONOMOUS'
  },
  {
    year: 'B.Tech II & III Year (Batches 2024 & 2025)',
    commence: '17 August 2026',
    mid1: '12 Oct – 17 Oct 2026',
    mid2: '14 Dec – 19 Dec 2026',
    prep: '21 Dec – 26 Dec 2026',
    exams: '28 Dec 2026 – 09 Jan 2027',
    badge: 'AUTONOMOUS'
  },
  {
    year: 'B.Tech IV Year (Graduating Batch 2023–27)',
    commence: '03 August 2026',
    mid1: '28 Sep – 03 Oct 2026',
    mid2: '30 Nov – 05 Dec 2026',
    prep: '07 Dec – 12 Dec 2026',
    exams: '14 Dec – 24 Dec 2026',
    badge: 'AUTONOMOUS'
  }
];

const GRADING_SCALE = [
  { grade: 'O', points: 10, marks: '90% and above', desc: 'Outstanding' },
  { grade: 'A+', points: 9, marks: '80% to 89%', desc: 'Excellent' },
  { grade: 'A', points: 8, marks: '70% to 79%', desc: 'Very Good' },
  { grade: 'B+', points: 7, marks: '60% to 69%', desc: 'Good' },
  { grade: 'B', points: 6, marks: '50% to 59%', desc: 'Above Average' },
  { grade: 'C', points: 5, marks: '40% to 49%', desc: 'Pass' },
  { grade: 'F', points: 0, marks: 'Below 40%', desc: 'Fail (Requires Re-appearance)' }
];

const PEDAGOGY_PILLARS = [
  { title: "Smart ICT-Enabled Classrooms", icon: "fas fa-chalkboard", desc: "Interactive digital displays, lecture capture systems, and multimedia audiovisual simulations for deep conceptual clarity." },
  { title: "Hands-on Computing Practicals", icon: "fas fa-laptop-code", desc: "1:1 computer ratio with licensed EDA software, Linux workstations, Python/TensorFlow suites, and GPU neural networks." },
  { title: "Collaborative Mini-Projects", icon: "fas fa-project-diagram", desc: "Every semester includes integrated laboratory mini-projects solving real community or industrial engineering problems." },
  { title: "Cisco & Corporate Certifications", icon: "fas fa-certificate", desc: "Integrated training for Cisco CCNA, AWS Cloud Practitioner, Google Cloud, and Oracle Java certifications." },
  { title: "Remedial Coaching for Slow Learners", icon: "fas fa-user-friends", desc: "Dedicated Saturday doubt-clearing sessions, peer mentoring, and bilingual tutorial explanations." },
  { title: "Research & Capstone Innovation", icon: "fas fa-lightbulb", desc: "Final-year capstone projects mentored by doctoral faculty with mandatory paper publication or patent filing." }
];

export default function Academics() {
  const [activeTab, setActiveTab] = useState('regulations');

  useEffect(() => {
    // Scroll reveal observer for modern smooth entrance animations
    const elements = document.querySelectorAll('.academics-page .fui-reveal');
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
    <div className="academics-page">
      {/* 1. Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Academics</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">Academic Framework</span>
          </div>
          <span className="page-badge">AUTONOMOUS REGULATIONS R-26 &bull; JNTUH AFFILIATED</span>
          <h1 className="page-title">Academics &amp; Autonomous Curricula</h1>
          <p className="page-subtitle">
            Industry-aligned Choice Based Credit System (CBCS), outcome-based pedagogy, continuous evaluation, and rigorous academic calendars designed to foster women leaders in engineering.
          </p>

          {/* Quick Authority Stats Strip */}
          <div className="fui-header-stats-strip">
            <span className="fui-stat-pill"><i className="fas fa-book-reader" aria-hidden="true"></i> R-26 CBCS Regulations</span>
            <span className="fui-stat-pill"><i className="fas fa-graduation-cap" aria-hidden="true"></i> 160 B.Tech Degree Credits</span>
            <span className="fui-stat-pill"><i className="fas fa-tasks" aria-hidden="true"></i> 40:60 CIE &amp; SEE Assessment</span>
            <span className="fui-stat-pill"><i className="fas fa-award" aria-hidden="true"></i> NBA Tier-II OBE Aligned</span>
            <span className="fui-stat-pill"><i className="fas fa-briefcase" aria-hidden="true"></i> Mandatory Industry Internships</span>
          </div>
        </div>
      </section>

      {/* 2. Subnav Bar */}
      <nav className="page-subnav-bar" aria-label="Academics sections">
        <div className="container subnav-inner">
          <a 
            href="#curriculum" 
            className={`subnav-link ${activeTab === 'regulations' ? 'active' : ''}`} 
            onClick={() => setActiveTab('regulations')}
          >
            Academic Regulations
          </a>
          <a 
            href="#calendar" 
            className={`subnav-link ${activeTab === 'calendar' ? 'active' : ''}`} 
            onClick={() => setActiveTab('calendar')}
          >
            Academic Calendars
          </a>
          <a 
            href="#grading" 
            className={`subnav-link ${activeTab === 'grading' ? 'active' : ''}`} 
            onClick={() => setActiveTab('grading')}
          >
            Grading &amp; Evaluation
          </a>
          <a 
            href="#pedagogy" 
            className={`subnav-link ${activeTab === 'pedagogy' ? 'active' : ''}`} 
            onClick={() => setActiveTab('pedagogy')}
          >
            Teaching Methodologies
          </a>
          <Link to="/departments" className="subnav-link" style={{ marginLeft: 'auto', color: 'var(--fui-emerald)' }}>
            <i className="fas fa-arrow-right" aria-hidden="true" style={{ marginRight: '6px' }}></i> View All Departments
          </Link>
        </div>
      </nav>

      {/* 3. Academic Regulations & Framework */}
      <section id="curriculum" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">AUTONOMOUS EXCELLENCE</span>
            <h2 className="section-title">Autonomous Regulations &amp; CBCS Framework</h2>
            <p className="section-subtitle">
              RITW's autonomous curriculum incorporates flexible choices, specialized electives in Artificial Intelligence, Cloud, Data Science, and VLSI microelectronics.
            </p>
          </div>

          <div className="cells-grid">
            {REGULATIONS.map((item, idx) => (
              <div key={idx} className={`cell-card fui-reveal fui-delay-${idx + 1}`}>
                <div className="cell-icon">
                  <i className={item.icon} aria-hidden="true"></i>
                </div>
                <div className="dept-badge" style={{ marginBottom: '10px', display: 'inline-block' }}>{item.code}</div>
                <h3 className="cell-title">{item.title}</h3>
                <p className="cell-desc" style={{ marginBottom: '14px' }}>{item.desc}</p>
                <div className="fui-credits-chip">
                  <i className="fas fa-check" aria-hidden="true"></i>
                  <span>{item.credits}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Academic Calendars */}
      <section id="calendar" className="statutory-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">ACADEMIC SCHEDULE 2026–27</span>
            <h2 className="section-title">Institutional Academic Calendars</h2>
            <p className="section-subtitle">
              Official semester schedules approved by the Academic Council in concurrence with JNTU Hyderabad.
            </p>
          </div>

          <div className="calendar-cards-grid">
            {CALENDARS.map((cal, idx) => (
              <div key={idx} className={`fui-calendar-card fui-reveal fui-delay-${idx + 1}`}>
                <div className="fui-cal-head">
                  <span className="section-badge" style={{ margin: 0 }}>{cal.badge}</span>
                  <i className="fas fa-calendar-alt" style={{ color: 'var(--fui-navy)', fontSize: '18px' }} aria-hidden="true"></i>
                </div>
                <h3 className="fui-cal-year">{cal.year}</h3>
                
                <div className="fui-cal-row">
                  <span className="fui-cal-label">Classwork Commencement:</span>
                  <span className="fui-cal-val">{cal.commence}</span>
                </div>
                <div className="fui-cal-row">
                  <span className="fui-cal-label">I Mid-Term Examinations:</span>
                  <span className="fui-cal-val">{cal.mid1}</span>
                </div>
                <div className="fui-cal-row">
                  <span className="fui-cal-label">II Mid-Term Examinations:</span>
                  <span className="fui-cal-val">{cal.mid2}</span>
                </div>
                <div className="fui-cal-row">
                  <span className="fui-cal-label">Practical Prep Holidays:</span>
                  <span className="fui-cal-val">{cal.prep}</span>
                </div>
                <div className="fui-cal-row">
                  <span className="fui-cal-label" style={{ color: 'var(--fui-navy)', fontWeight: '700' }}>Semester End Exams:</span>
                  <span className="fui-cal-val-highlight">{cal.exams}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Evaluation & Grading System */}
      <section id="grading" className="page-content-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">TRANSPARENT EVALUATION</span>
            <h2 className="section-title">10-Point Letter Grading Scale</h2>
            <p className="section-subtitle">
              Cumulative Grade Point Average (CGPA) and Semester Grade Point Average (SGPA) computation parameters under R-26 regulations.
            </p>
          </div>

          <div className="fui-table-wrap fui-reveal fui-delay-1">
            <table className="fui-grading-table">
              <thead>
                <tr>
                  <th>Letter Grade</th>
                  <th>Grade Points</th>
                  <th>Marks Percentage Range</th>
                  <th>Performance Description</th>
                </tr>
              </thead>
              <tbody>
                {GRADING_SCALE.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className={`fui-grade-badge ${row.points >= 8 ? 'grade-high' : 'grade-norm'}`}>
                        {row.grade}
                      </span>
                    </td>
                    <td style={{ fontWeight: '700' }}>{row.points}</td>
                    <td>{row.marks}</td>
                    <td style={{ color: 'var(--fui-text-muted)' }}>{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. Pedagogy & Teaching Methodologies */}
      <section id="pedagogy" className="statutory-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">LEARNING ECOSYSTEM</span>
            <h2 className="section-title">Teaching &amp; Learning Methodologies</h2>
            <p className="section-subtitle">
              Blended learning, experiential problem-solving, and continuous faculty mentoring empowering women technologists.
            </p>
          </div>

          <div className="cells-grid">
            {PEDAGOGY_PILLARS.map((item, idx) => (
              <div key={idx} className={`cell-card fui-reveal fui-delay-${(idx % 3) + 1}`}>
                <div className="cell-icon" style={{ background: 'var(--fui-navy-tint)', color: 'var(--fui-navy)' }}>
                  <i className={item.icon} aria-hidden="true"></i>
                </div>
                <h3 className="cell-title">{item.title}</h3>
                <p className="cell-desc">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Download Regulations & Syllabi Callout Box */}
          <div className="fui-download-box fui-reveal fui-delay-2">
            <div>
              <h3>Download Academic Regulations &amp; Syllabi</h3>
              <p>Official R-26 B.Tech CBCS regulation handbook for CSE, AI&amp;ML, DS, IT, and ECE programs.</p>
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/departments" className="btn-cta btn-cta-green">
                <i className="fas fa-laptop-code" aria-hidden="true"></i>
                <span>Explore Department Syllabi</span>
              </Link>
              <Link to="/contact" className="btn-cta hero-btn-secondary">
                <i className="fas fa-question-circle" aria-hidden="true"></i>
                <span>Academic Enquiry</span>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
