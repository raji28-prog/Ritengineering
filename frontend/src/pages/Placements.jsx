import React from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const RECRUITERS = [
  { name: 'Amazon', category: 'Cloud & E-Commerce', logo: 'fab fa-amazon' },
  { name: 'Google Cloud', category: 'AI & Enterprise Systems', logo: 'fab fa-google' },
  { name: 'Capgemini', category: 'Digital Engineering Services', logo: 'fas fa-gem' },
  { name: 'Tata Consultancy Services', category: 'Global IT & Consulting', logo: 'fas fa-building' },
  { name: 'Cognizant', category: 'Digital Solutions', logo: 'fas fa-laptop-code' },
  { name: 'Accenture', category: 'Technology Consulting', logo: 'fas fa-chart-line' },
  { name: 'Wipro', category: 'Cloud & Cybersecurity', logo: 'fas fa-shield-alt' },
  { name: 'IBM', category: 'Cognitive Computing & Hybrid Cloud', logo: 'fas fa-server' },
  { name: 'HCL Technologies', category: 'Next-Gen IT Infrastructure', logo: 'fas fa-code' },
  { name: 'Hexaware', category: 'Automation & AI Platforms', logo: 'fas fa-robot' },
  { name: 'GlobalLogic', category: 'Digital Product Engineering', logo: 'fas fa-globe' },
  { name: 'Genpact', category: 'Analytics & Financial Tech', logo: 'fas fa-coins' },
  { name: 'Tech Mahindra', category: 'Telecom & Enterprise Software', logo: 'fas fa-broadcast-tower' },
  { name: 'Tata Motors', category: 'Automotive & IoT Hardware', logo: 'fas fa-car' },
  { name: 'Sutherland', category: 'Digital Transformation', logo: 'fas fa-users-cog' },
  { name: 'Vodafone Idea', category: 'Network Engineering', logo: 'fas fa-signal' },
  { name: 'ELEATION', category: 'Simulation & CAE Engineering', logo: 'fas fa-cogs' },
  { name: 'MS Square Technologies', category: 'Custom Enterprise Software', logo: 'fas fa-cubes' },
  { name: 'CAD DESK', category: 'Engineering Design Solutions', logo: 'fas fa-drafting-compass' },
  { name: 'QSpiders', category: 'Software Automation & Quality', logo: 'fas fa-bug' }
];

const PLACEMENT_STATS = [
  { value: '100%', label: 'Placement Assistance', desc: 'Guaranteed placement training and mock drives for all registered scholars' },
  { value: '7.5 LPA', label: 'Highest Package', desc: 'Top tier compensation secured in core software engineering profiles' },
  { value: '50+', label: 'Tier-1 Recruiters', desc: 'Global MNCs, technology consultancies, and product enterprises hiring from RITW' },
  { value: '100% Free', label: 'CRT Training', desc: 'Integrated campus recruitment training built into autonomous curricula' }
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
    title: "Advanced Technologies & Cisco Academy",
    focus: "Full-stack frameworks, AI/ML electives, Cisco CCNA networking, and mandatory summer corporate internships.",
    icon: "fas fa-network-wired"
  },
  {
    year: "Year 4",
    title: "Intensive CRT & On-Campus Drives",
    focus: "Company-specific aptitude bootcamps, mock technical/HR interviews, and direct recruitment assessments.",
    icon: "fas fa-user-check"
  }
];

const PLACED_SCHOLARS = [
  {
    name: "Arshiya Anjum",
    role: "Software Development Engineer",
    company: "Capgemini",
    image: "/images/testimonials/Arshiya Anjum.jpg"
  },
  {
    name: "Bharathula Venkata Lakshmi Sravani",
    role: "Cloud Associate",
    company: "Cognizant",
    image: "/images/testimonials/Bharathula Venkata Lakshmi Sravani.jpg"
  },
  {
    name: "Deekshitha Mandadi",
    role: "Systems Engineer",
    company: "TCS",
    image: "/images/testimonials/Deekshitha Mandadi.jpg"
  },
  {
    name: "Vaishali Kaletle",
    role: "Project Engineer",
    company: "Wipro",
    image: "/images/testimonials/Vaishali Kaletle.jpg"
  }
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

          <div className="placements-header-grid">
            <div>
              <span className="page-badge">100% PLACEMENT ASSISTANCE &bull; 7.5 LPA HIGHEST</span>
              <h1 className="page-title">Training &amp; Placement Cell</h1>
              <p className="page-subtitle">
                Connecting women engineering talent with leading global technology corporations through structured coding bootcamps, soft-skill mentorship, and corporate internships.
              </p>
            </div>
            <div className="placements-helpline-box">
              <span className="box-tag">TPO Helpline</span>
              <a href="tel:+914023892878" className="helpline-num">040-2389-2878</a>
              <span className="box-sub">Mon–Sat: 9:00 AM – 5:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Numerical Statistics Bar */}
      <section className="placements-stats-bar">
        <div className="container">
          <div className="stats-bar-grid">
            {PLACEMENT_STATS.map((stat, idx) => (
              <div key={idx} className="stat-bar-card">
                <div className="stat-bar-val">{stat.value}</div>
                <div className="stat-bar-label">{stat.label}</div>
                <p className="stat-bar-desc">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TPO Head & Corporate Relations Desk */}
      <section id="tpo" className="tpo-desk-section">
        <div className="container">
          <div className="tpo-split-grid">
            
            {/* Left: TPO Strategy & Partnerships */}
            <div className="tpo-content-card">
              <span className="section-badge">OUTCOME-DRIVEN TRAINING</span>
              <h2 className="section-title">Bridging Academics with Corporate Readiness</h2>
              <p className="lead-paragraph">
                At <strong>Rishi MS Institute of Engineering &amp; Technology for Women (RITW)</strong>, our Training and Placement Cell functions as a proactive career catalyst. We ensure that graduating scholars possess not just theoretical knowledge, but hands-on coding mastery, problem-solving speed, and executive communication presence.
              </p>
              <p className="body-paragraph">
                Our students actively engage in <strong>Global Hackathons, Live Industry Projects, and Cisco Certified Modules</strong>, ensuring continuous familiarity with the tech stacks demanded by Fortune 500 engineering enterprises.
              </p>

              {/* Cisco & TASK Collaboration Highlights */}
              <div id="mous" className="alliances-grid">
                <div className="alliance-box">
                  <div className="alliance-icon"><i className="fas fa-network-wired" aria-hidden="true"></i></div>
                  <div>
                    <h4 className="alliance-title">CISCO Networking Academy</h4>
                    <p className="alliance-desc">Institutional partner for CCNA certifications, routing protocols, cybersecurity foundations, and networking simulations.</p>
                  </div>
                </div>
                <div className="alliance-box">
                  <div className="alliance-icon"><i className="fas fa-handshake" aria-hidden="true"></i></div>
                  <div>
                    <h4 className="alliance-title">TASK Collaboration</h4>
                    <p className="alliance-desc">Partnered with Telangana Academy for Skill and Knowledge (TASK) to provide government-certified leadership and technical certifications.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: TPO Head Profile Card */}
            <div className="tpo-profile-card">
              <div className="tpo-photo-frame">
                <img 
                  src="/images/placements/laxmi-tulasi.jpg" 
                  alt="Mrs. Kalam Lakshmi Tulasi" 
                  className="tpo-photo"
                  onError={(e) => { e.currentTarget.src = '/images/why_choose/faculty.png'; }}
                />
              </div>
              <h3 className="tpo-name">Mrs. Kalam Lakshmi Tulasi</h3>
              <div className="tpo-designation">Training and Placement Head</div>
              
              <div className="tpo-contacts">
                <a href="tel:+914023892878" className="tpo-contact-row">
                  <i className="fas fa-phone-alt" aria-hidden="true"></i>
                  <span>+91-40-2389-2878</span>
                </a>
                <a href="mailto:lakshmikalam@rishimsengg.ac.in" className="tpo-contact-row">
                  <i className="fas fa-envelope" aria-hidden="true"></i>
                  <span>lakshmikalam@rishimsengg.ac.in</span>
                </a>
              </div>

              <div className="tpo-quote">
                "Our aim is to empower every young woman engineer with the analytical prowess and ethical leadership needed to lead global technical teams."
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. 4-Year Progressive Training Roadmap */}
      <section className="roadmap-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">STRUCTURED CURRICULUM</span>
            <h2 className="section-title">4-Year Integrated Employability Roadmap</h2>
            <p className="section-subtitle">
              Comprehensive skill-building embedded seamlessly into the autonomous academic calendar from day one.
            </p>
          </div>

          <div className="roadmap-grid">
            {TRAINING_ROADMAP.map((step, idx) => (
              <div key={idx} className="roadmap-card">
                <div className="roadmap-year-badge">{step.year}</div>
                <div className="roadmap-icon-circle">
                  <i className={step.icon} aria-hidden="true"></i>
                </div>
                <h3 className="roadmap-card-title">{step.title}</h3>
                <p className="roadmap-card-focus">{step.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Esteemed Recruiting Partners Grid */}
      <section id="recruiters" className="recruiting-partners-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">ESTEEMED RECRUITERS</span>
            <h2 className="section-title">Corporate Partners &amp; Visiting MNCs</h2>
            <p className="section-subtitle">
              Over 50 leading technology corporations trust RITW graduates for their software development and engineering teams.
            </p>
          </div>

          <div className="recruiters-full-grid">
            {RECRUITERS.map((rec, idx) => (
              <div key={idx} className="recruiter-full-card">
                <div className="rec-icon-wrap">
                  <i className={rec.logo} aria-hidden="true"></i>
                </div>
                <h4 className="rec-name">{rec.name}</h4>
                <span className="rec-category">{rec.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Placed Students Gallery */}
      <section className="placed-scholars-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">SUCCESS SPOTLIGHT</span>
            <h2 className="section-title">Placed Engineers Making Their Mark</h2>
            <p className="section-subtitle">A glimpse of recent graduates who secured premium packages with top tech recruiters.</p>
          </div>

          <div className="placed-scholars-grid">
            {PLACED_SCHOLARS.map((sch, idx) => (
              <div key={idx} className="scholar-card">
                <div className="scholar-photo-frame">
                  <img src={sch.image} alt={sch.name} className="scholar-photo" />
                </div>
                <h4 className="scholar-name">{sch.name}</h4>
                <div className="scholar-role">{sch.role}</div>
                <div className="scholar-company-badge">
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <span>Placed at {sch.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Corporate Invitation CTA Banner */}
      <section className="corporate-invite-strip">
        <div className="container corporate-invite-inner">
          <div>
            <h3 className="invite-title">Looking to Hire RITW Women Engineers?</h3>
            <p className="invite-desc">
              We warmly invite HR heads, talent acquisition leaders, and engineering managers to schedule on-campus or virtual recruitment drives. Our campus offers modern auditorium facilities, high-speed computer labs for coding assessments, and interview suites.
            </p>
          </div>
          <div className="invite-actions">
            <a href="mailto:lakshmikalam@rishimsengg.ac.in" className="btn-cta btn-cta-green">
              <i className="fas fa-envelope" aria-hidden="true"></i>
              <span>Email Placement Cell</span>
            </a>
            <a href="tel:+914023892878" className="btn-cta cta-btn-outline">
              <i className="fas fa-phone-alt" aria-hidden="true"></i>
              <span>Call 040-2389-2878</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
