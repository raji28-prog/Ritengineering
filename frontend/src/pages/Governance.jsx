import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './governance.css';

// 1. Authentic Governing Council / Governing Body (14 Members)
const GOVERNING_COUNCIL_MEMBERS = [
  { sno: 1, name: 'Dr. S Jeelani', role: 'Chairman', category: 'Academic Members', desc: 'Renowned academician, former Director, Centre for Virtual Learning, University of Hyderabad. 30+ years in teaching, research, and institutional administration.' },
  { sno: 2, name: 'Ms. M Rajasree', role: 'Secretary', category: 'Academic Members', desc: 'Founding member of Rishi Educational Institutions, social visionary, and Vikas Ratan Gold Medal Award recipient championing women\'s technical education.' },
  { sno: 3, name: 'Mrs. J Madhavi Latha', role: 'Director Member', category: 'Academic Members', desc: 'Senior academic administrator steering institutional policy formulation, quality accreditations, and long-term developmental roadmaps.' },
  { sno: 4, name: 'Mrs. Manjeera', role: 'Member', category: 'Academic Members', desc: 'Member of Governing Council contributing to institutional planning and student welfare administration.' },
  { sno: 5, name: 'Mr. L K Reddy', role: 'Member', category: 'Academic Members', desc: 'Distinguished administrator focusing on campus infrastructure expansion, physical resources, and campus safety.' },
  { sno: 6, name: 'Dr. Rammurthy OU', role: 'Member', category: 'Academic Members', desc: 'Senior academician and Osmania University faculty member advising on collegiate curriculum standards and university coordination.' },
  { sno: 7, name: 'Mr. L Madhu Sekhar', role: 'Member', category: 'Academic Members', desc: 'Member of Governing Council advising on operational efficiency and institutional strategic growth.' },
  { sno: 8, name: 'Mr. Gunti Vijay', role: 'Member', category: 'Academic Members', desc: 'Industry specialist guiding technology infrastructure, industry-academia connect, and student placement enablement.' },
  { sno: 9, name: 'Dr. Archana Patil', role: 'Member', category: 'Academic Members', desc: 'Professor & Head of Department, representing institutional faculty interests, pedagogical rigor, and NBA accreditation benchmarks.' },
  { sno: 10, name: 'Dr. Y Venkata Laxmi', role: 'Member', category: 'Academic Members', desc: 'Senior faculty member representing institutional academic governance and faculty welfare.' },
  { sno: 11, name: 'Mrs. K Laxmi Tulasi', role: 'Member', category: 'Academic Members', desc: 'Senior faculty member contributing to curriculum delivery standards and women student mentorship.' },
  { sno: 12, name: 'Dr. SK Altaf Hussain Basha', role: 'Member Secretary', category: 'Academic Members', desc: 'Associate Professor & Member Secretary steering statutory council meetings, documentation, and university compliance.' },
  { sno: 13, name: 'Shri Giri Babu', role: 'State Nominee', category: 'Nominees', desc: 'Department of Technical Education, Government of Telangana, ensuring statutory compliance, state admissions rules, and welfare schemes.' },
  { sno: 14, name: 'Dr. K Vijaya Kumar Reddy', role: 'JNTUH Nominee', category: 'Nominees', desc: 'Professor of Mechanical Engineering, JNTU Hyderabad, university statutory monitor ensuring university curriculum and degree regulations.' }
];

// 2. Authentic Academic Advisory Board (13 Members)
const ACADEMIC_ADVISORY_BOARD = [
  { sno: 1, name: 'Dr. RAMA NAGA KIRAN KUMAR KARASALA', designation: 'PROFESSOR & PRINCIPAL, CSE', role: 'Chairman, Academic Advisory Board' },
  { sno: 2, name: 'Dr. SK ALTAF HUSSAIN BASHA', designation: 'ASSOCIATE PROFESSOR, CSE', role: 'Member Secretary' },
  { sno: 3, name: 'Dr. KANDUNURI RAMA KRISHNA', designation: 'ASSOCIATE PROFESSOR, IT', role: 'Member (IT Division)' },
  { sno: 4, name: 'Dr. ANURADHA GUPTA', designation: 'ASSOCIATE PROFESSOR, PHYSICS', role: 'Member (Basic Sciences)' },
  { sno: 5, name: 'Dr. ARCHANA BABURAO PATIL', designation: 'ASSISTANT PROFESSOR, CSE', role: 'Member (CSE Division)' },
  { sno: 6, name: 'Dr. D LAKSHMI NARAYANA', designation: 'ASSISTANT PROFESSOR, ECE', role: 'Member (ECE Division)' },
  { sno: 7, name: 'Dr. VENKATA LAKSHMI YEDIDA', designation: 'ASSISTANT PROFESSOR, ECE', role: 'Member (ECE Division)' },
  { sno: 8, name: 'Dr. ASMA FATIMA', designation: 'ASSISTANT PROFESSOR, PHYSICS', role: 'Member (Sciences & Humanities)' },
  { sno: 9, name: 'Dr. PANDEY SHRADDHA', designation: 'ASSISTANT PROFESSOR, CHEMISTRY', role: 'Member (Sciences & Humanities)' },
  { sno: 10, name: 'Dr. BIRAGONI GOUD RADHIKA', designation: 'ASSISTANT PROFESSOR, MATHEMATICS', role: 'Member (Sciences & Humanities)' },
  { sno: 11, name: 'Dr. CHETHARASI SRAVANTHI', designation: 'ASSISTANT PROFESSOR, ENGLISH', role: 'Member (Sciences & Humanities)' },
  { sno: 12, name: 'Dr. GAJJALA SRINIVAS KUMAR', designation: 'ASSISTANT PROFESSOR, MECH – H&S', role: 'Member (Engineering Sciences)' },
  { sno: 13, name: 'Dr. V V SATYAVATHI YEDIDA', designation: 'ASSISTANT PROFESSOR, MECH – H&S', role: 'Member (Engineering Sciences)' }
];

// 3. Statutory Councils Overview
const STATUTORY_COUNCILS = [
  {
    id: 'governing-body',
    title: 'Governing Council / Governing Body',
    desc: 'Apex statutory authority framing institutional policies, long-term development roadmaps, capital budgets, faculty recruitment, infrastructure expansion, and UGC/AICTE compliance.',
    icon: 'fas fa-balance-scale',
    membersCount: '14 Members (Biannual Meeting)',
    tag: 'APEX STATUTORY BODY'
  },
  {
    id: 'academic-council',
    title: 'Academic Advisory Board & Council',
    desc: 'Highest academic authority reviewing and approving autonomous syllabi, course structures, credits, academic calendars, examination regulations, and pedagogical methodologies.',
    icon: 'fas fa-book-reader',
    membersCount: '13 Doctoral Faculty Members',
    tag: 'ACADEMIC STATUTORY BODY'
  },
  {
    id: 'bos',
    title: 'Board of Studies (BOS)',
    desc: 'Departmental curriculum expert panels comprising senior professors, university subject nominees, and industry leaders revising curricula for CSE, AIML, DS, IT, and ECE.',
    icon: 'fas fa-chalkboard-teacher',
    membersCount: '4 Departmental Panels',
    tag: 'CURRICULAR AUTHORITY'
  },
  {
    id: 'finance',
    title: 'Finance & Assistance Committee',
    desc: 'Scrutinizing annual budgets, audited balance sheets, capital allocations for advanced laboratories, faculty development grants, and student fee concessions.',
    icon: 'fas fa-coins',
    membersCount: 'Annual Audited Statements',
    tag: 'FINANCIAL SCRUTINY'
  }
];

// 4. Authentic RITW Mandatory Statutory & Operational Committees (All Official Entities)
const COMMITTEES_DATA = [
  {
    id: 'anti-ragging',
    category: 'statutory',
    title: 'Anti-Ragging Committee & Squad',
    icon: 'fas fa-shield-alt',
    head: 'Principal & Head of Squad',
    desc: 'Strict zero-tolerance policy against ragging in compliance with AICTE/UGC Regulations. 24/7 security surveillance, squad patrolling, confidential complaint box, and emergency helpline.',
    contact: 'Toll Free: 1800-180-5522 | Principal Office',
    tag: 'Statutory AICTE/UGC'
  },
  {
    id: 'icc',
    category: 'statutory',
    title: 'Internal Complaints Committee (ICC) / POSH',
    icon: 'fas fa-female',
    head: 'Senior Female Faculty (Presiding Officer)',
    desc: 'Statutory body constituted under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, ensuring a safe, dignified, and supportive campus for women.',
    contact: 'Confidential Email: icc@rishimsengg.ac.in',
    tag: 'Statutory POSH Act'
  },
  {
    id: 'grievance',
    category: 'statutory',
    title: 'Grievance Redressal Committee (GRC)',
    icon: 'fas fa-clipboard-check',
    head: 'Principal & Senior Faculty Panel',
    desc: 'Formal grievance resolution mechanism for students, faculty, and non-teaching staff. Provides time-bound hearings, online grievance ticketing, and fair dispute redressal.',
    contact: 'grievance@rishimsengg.ac.in',
    tag: 'UGC Regulated'
  },
  {
    id: 'sc-st',
    category: 'statutory',
    title: 'SC / ST Cell & Welfare Committee',
    icon: 'fas fa-hands-helping',
    head: 'Liaison Officer Desk',
    desc: 'Ensuring affirmative action, social equity, non-discrimination, and facilitation of state/central post-matric scholarships and book bank privileges for SC/ST students.',
    contact: 'Liaison Office, Main Admin Block',
    tag: 'Constitutional Mandate'
  },
  {
    id: 'obc-minority',
    category: 'statutory',
    title: 'OBC & Minority Cell',
    icon: 'fas fa-users',
    head: 'Senior Faculty Convener',
    desc: 'Facilitating financial welfare, pre-examination guidance, and educational inclusion for students belonging to Other Backward Classes and minority communities.',
    contact: 'Student Welfare Section',
    tag: 'Statutory Cell'
  },
  {
    id: 'iqac',
    category: 'academic',
    title: 'Internal Quality Assurance Cell (IQAC)',
    icon: 'fas fa-chart-line',
    head: 'Director & IQAC Coordinator',
    desc: 'Driving continuous quality enhancement across teaching-learning standards, outcome-based education (OBE), NAAC/NBA compliance, feedback analysis, and faculty research audits.',
    contact: 'iqac@rishimsengg.ac.in',
    tag: 'Quality Benchmark'
  },
  {
    id: 'rd',
    category: 'academic',
    title: 'Research & Development (R&D) Cell',
    icon: 'fas fa-atom',
    head: 'Dean R&D & Faculty Leads',
    desc: 'Promoting faculty and student research publications in SCI/Scopus journals, patent filings, research grants, collaborative research, and technology incubation.',
    contact: 'R&D Center, CSE/ECE Blocks',
    tag: 'Innovation & Patents'
  },
  {
    id: 'cac',
    category: 'academic',
    title: 'College Academic Committee (CAC)',
    icon: 'fas fa-graduation-cap',
    head: 'Principal & All Department HODs',
    desc: 'Monitoring semester course coverage, academic schedules, continuous internal evaluations (CIE), lab experiments, and remedial tutorial sessions.',
    contact: 'Academic Dean Office',
    tag: 'Academic Oversight'
  },
  {
    id: 'iiic',
    category: 'academic',
    title: 'Industry Institute Interaction Cell (IIIC)',
    icon: 'fas fa-handshake',
    head: 'Industry Liaison Officer',
    desc: 'Bridging the corporate gap through industry MoUs, student summer internships, guest lectures by tech leaders, industrial visits, and corporate sponsored projects.',
    contact: 'Placement & Industry Wing',
    tag: 'Corporate Bridge'
  },
  {
    id: 'placement',
    category: 'student',
    title: 'Student Training & Placement Cell',
    icon: 'fas fa-briefcase',
    head: 'Training & Placement Officer (TPO)',
    desc: 'Organizing campus placement drives, technical aptitude workshops, mock interviews, programming bootcamps, and career counseling for all engineering branches.',
    contact: 'placement@rishimsengg.ac.in',
    tag: 'Career Enablement'
  },
  {
    id: 'library',
    category: 'academic',
    title: 'Library & E-Learning Committee',
    icon: 'fas fa-book-reader',
    head: 'Chief Librarian & Advisory Panel',
    desc: 'Managing collection development of technical volumes, IEEE/DELNET subscriptions, digital repository access, and national digital library resources.',
    contact: 'Central Library Building',
    tag: 'Knowledge Resource'
  },
  {
    id: 'financial',
    category: 'statutory',
    title: 'Financial Assistance Committee',
    icon: 'fas fa-rupee-sign',
    head: 'Secretary & Finance Officer',
    desc: 'Scrutinizing merit-cum-means scholarship applications, fee payment installment requests, and institutional tuition fee waiver recommendations for deserving scholars.',
    contact: 'Finance & Accounts Office',
    tag: 'Scholarships'
  },
  {
    id: 'women-welfare',
    category: 'student',
    title: 'Women Welfare Committee',
    icon: 'fas fa-user-shield',
    head: 'Senior Women Faculty Coordinator',
    desc: 'Fostering empowerment through health awareness camps, self-defence workshops, hygiene facilities, leadership seminars, and career development sessions.',
    contact: 'Women Development Center',
    tag: 'Empowerment'
  },
  {
    id: 'attendance',
    category: 'academic',
    title: 'Attendance Monitoring Committee',
    icon: 'fas fa-user-clock',
    head: 'Senior Academic Faculty Team',
    desc: 'Monitoring student daily biometric/ERP attendance, issuing periodic shortage warnings to parents via SMS, and enforcing university minimum attendance thresholds.',
    contact: 'ERP & Attendance Desk',
    tag: 'Academic Rigor'
  },
  {
    id: 'timetable',
    category: 'academic',
    title: 'Time-Table Committee',
    icon: 'fas fa-calendar-alt',
    head: 'Institutional Time-Table In-Charge',
    desc: 'Formulating balanced semester academic master schedules, lab session distributions, seminar slots, and library hours aligned with JNTU curriculum norms.',
    contact: 'Dean Academics',
    tag: 'Operations'
  },
  {
    id: 'sdc',
    category: 'student',
    title: 'Skill Development Centre (SDC)',
    icon: 'fas fa-code',
    head: 'SDC Faculty Coordinator',
    desc: 'Providing specialized value-added certifications in full stack development, artificial intelligence, cloud computing, IoT, and cybersecurity.',
    contact: 'Innovation Lab Wing',
    tag: 'Certifications'
  },
  {
    id: 'maintenance',
    category: 'operations',
    title: 'Maintenance & Infrastructure Committee',
    icon: 'fas fa-tools',
    head: 'Campus Facilities Manager',
    desc: 'Overseeing continuous electrical power backup, high-speed campus Wi-Fi, pure RO drinking water plants, laboratory instrumentation, and building safety.',
    contact: 'Estate & Infrastructure Cell',
    tag: 'Facilities'
  },
  {
    id: 'canteen',
    category: 'operations',
    title: 'Canteen & Hygiene Committee',
    icon: 'fas fa-utensils',
    head: 'Canteen Advisory Committee',
    desc: 'Supervising hygienic food preparation, nutritious meal options, clean drinking water, cafeteria sanitation, and fair student pricing.',
    contact: 'Campus Cafeteria In-Charge',
    tag: 'Health & Nutrition'
  },
  {
    id: 'sports',
    category: 'student',
    title: 'Sports & Games Committee',
    icon: 'fas fa-running',
    head: 'Physical Director (PD)',
    desc: 'Coordinating inter-collegiate athletic tournaments, indoor sports arenas, annual sports day, yoga workshops, and university competition representation.',
    contact: 'Sports Pavilion & Gymnasium',
    tag: 'Physical Fitness'
  },
  {
    id: 'nss',
    category: 'student',
    title: 'NSS Cell (National Service Scheme)',
    icon: 'fas fa-heart',
    head: 'NSS Program Officer',
    desc: 'Conducting community service initiatives, blood donation camps, environmental Haritha Haram tree-planting drives, and rural village development programs.',
    contact: 'NSS Activity Office',
    tag: 'Social Service'
  },
  {
    id: 'cultural-eco',
    category: 'student',
    title: 'Cultural, Festivities & ECO Clubs',
    icon: 'fas fa-leaf',
    head: 'Student Activities Coordinator',
    desc: 'Organizing annual technical and cultural fests, national festival commemorations, green campus audits, and environmental awareness campaigns.',
    contact: 'Auditorium & Cultural Cell',
    tag: 'Campus Vibrancy'
  },
  {
    id: 'pr-media',
    category: 'operations',
    title: 'Public Relations & Media Committee',
    icon: 'fas fa-bullhorn',
    head: 'Media & Communications Officer',
    desc: 'Managing official institutional press releases, newsletter publications (The Rishi Times), media interactions, and digital social media communication.',
    contact: 'Media Bureau, Admin Block',
    tag: 'Communications'
  },
  {
    id: 'phc',
    category: 'operations',
    title: 'Primary Health Centre & Emergency Response',
    icon: 'fas fa-plus-square',
    head: 'Medical Officer & Campus Nurse',
    desc: 'Providing immediate medical attention, first aid treatment, health checkup camps, and round-the-clock emergency hospital transit arrangements.',
    contact: 'Health Centre, Ground Floor',
    tag: 'Medical Safety'
  }
];

// 5. Authentic Audit Statements (All 4 Verified Documents)
const AUDIT_STATEMENTS = [
  { year: '2024-2025', title: 'Audit Statement 2024-25', file: '/Statements/2024-2025.pdf', size: '1.3 MB', desc: 'Financial audit report for fiscal year 2024-25 certified by statutory chartered accountants.' },
  { year: '2023-2024', title: 'Audit Statement 2023-24', file: '/Statements/2023-2024.pdf', size: '1.2 MB', desc: 'Audited income and expenditure statement and balance sheet for academic year 2023-24.' },
  { year: '2022-2023', title: 'Audit Statement 2022-23', file: '/Statements/2022-2023.pdf', size: '1.8 MB', desc: 'Statutory financial balance sheet and statement of asset utilization for fiscal year 2022-23.' },
  { year: '2021-2022', title: 'Audit Statement 2021-22', file: '/Statements/2021-2022.pdf', size: '2.1 MB', desc: 'Certified audit statement and accounts report for academic year 2021-22.' }
];

export default function Governance() {
  const [activeTab, setActiveTab] = useState('councils');
  const [committeeFilter, setCommitteeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [councilViewMode, setCouncilViewMode] = useState('table'); // 'table' | 'cards'
  const [showOrgModal, setShowOrgModal] = useState(false);

  useEffect(() => {
    // Scroll reveal observer
    const elements = document.querySelectorAll('.gov-reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('gov-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

      elements.forEach(el => observer.observe(el));
      return () => observer.disconnect();
    } else {
      elements.forEach(el => el.classList.add('gov-revealed'));
    }
  }, []);

  // Filter committees
  const filteredCommittees = COMMITTEES_DATA.filter(item => {
    const matchesCategory = committeeFilter === 'all' || item.category === committeeFilter;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.head.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="governance-page">
      {/* 1. Header Banner */}
      <section className="governance-header-banner">
        <div className="container">
          <div className="governance-breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Governance</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">Statutory Leadership &amp; Administration</span>
          </div>

          <span className="governance-badge">UGC AUTONOMOUS &bull; STATUTORY COMMITTEES &bull; GOVERNING COUNCILS</span>
          <h1 className="governance-title">Institutional Governance &amp; Administration</h1>
          <p className="governance-subtitle">
            Ethical, transparent, and outcome-focused governance spearheaded by visionary academicians, university monitors, state nominees, and industry leaders ensuring the highest educational standards under UGC Autonomous regulations.
          </p>

          {/* Quick Authority Stats Strip */}
          <div className="governance-stats-strip">
            <span className="governance-stat-pill"><i className="fas fa-balance-scale" aria-hidden="true"></i> 14 Governing Council Members</span>
            <span className="governance-stat-pill"><i className="fas fa-book-reader" aria-hidden="true"></i> 13 Academic Advisory Board Members</span>
            <span className="governance-stat-pill"><i className="fas fa-shield-alt" aria-hidden="true"></i> 20+ Statutory &amp; Welfare Committees</span>
            <span className="governance-stat-pill"><i className="fas fa-sitemap" aria-hidden="true"></i> Institutional Organogram</span>
            <span className="governance-stat-pill"><i className="fas fa-user-tie" aria-hidden="true"></i> University Ombudsperson</span>
            <span className="governance-stat-pill"><i className="fas fa-file-invoice-dollar" aria-hidden="true"></i> 4 Published Annual Audits</span>
          </div>
        </div>
      </section>

      {/* 2. Sticky Subnav Bar */}
      <nav className="governance-subnav-bar" aria-label="Governance Navigation">
        <div className="container governance-subnav-inner">
          <a 
            href="#councils" 
            className={`governance-subnav-link ${activeTab === 'councils' ? 'active' : ''}`}
            onClick={() => setActiveTab('councils')}
          >
            <i className="fas fa-balance-scale" aria-hidden="true"></i> Statutory Councils
          </a>
          <a 
            href="#governing-body" 
            className={`governance-subnav-link ${activeTab === 'governing-body' ? 'active' : ''}`}
            onClick={() => setActiveTab('governing-body')}
          >
            <i className="fas fa-users" aria-hidden="true"></i> Governing Council
          </a>
          <a 
            href="#academic-council" 
            className={`governance-subnav-link ${activeTab === 'academic-council' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic-council')}
          >
            <i className="fas fa-graduation-cap" aria-hidden="true"></i> Academic Advisory Board
          </a>
          <a 
            href="#committees" 
            className={`governance-subnav-link ${activeTab === 'committees' ? 'active' : ''}`}
            onClick={() => setActiveTab('committees')}
          >
            <i className="fas fa-clipboard-list" aria-hidden="true"></i> Mandatory Committees
          </a>
          <a 
            href="#organogram" 
            className={`governance-subnav-link ${activeTab === 'organogram' ? 'active' : ''}`}
            onClick={() => setActiveTab('organogram')}
          >
            <i className="fas fa-sitemap" aria-hidden="true"></i> Organogram &amp; Workflow
          </a>
          <a 
            href="#ombudsperson" 
            className={`governance-subnav-link ${activeTab === 'ombudsperson' ? 'active' : ''}`}
            onClick={() => setActiveTab('ombudsperson')}
          >
            <i className="fas fa-user-shield" aria-hidden="true"></i> University Ombudsperson
          </a>
          <a 
            href="#idp" 
            className={`governance-subnav-link ${activeTab === 'idp' ? 'active' : ''}`}
            onClick={() => setActiveTab('idp')}
          >
            <i className="fas fa-file-contract" aria-hidden="true"></i> Strategic IDP
          </a>
          <a 
            href="#audit" 
            className={`governance-subnav-link ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <i className="fas fa-file-invoice" aria-hidden="true"></i> Financial Audits
          </a>
          <a 
            href="#conduct" 
            className={`governance-subnav-link ${activeTab === 'conduct' ? 'active' : ''}`}
            onClick={() => setActiveTab('conduct')}
          >
            <i className="fas fa-scroll" aria-hidden="true"></i> Code of Conduct
          </a>
        </div>
      </nav>

      {/* 3. Section: Autonomous Administrative Councils */}
      <section id="councils" className="gov-section">
        <div className="container">
          <div className="gov-section-header">
            <span className="gov-section-badge">AUTONOMOUS GOVERNANCE</span>
            <h2 className="gov-section-title">Autonomous Administrative Bodies</h2>
            <p className="gov-section-subtitle">Constituted under UGC Autonomous Regulations and JNTU Hyderabad Statutes to guide pedagogical excellence, regulatory compliance, and fiscal management.</p>
          </div>

          <div className="gov-councils-grid">
            {STATUTORY_COUNCILS.map((council, idx) => (
              <div key={idx} id={council.id} className="gov-council-card gov-reveal">
                <div className="gov-council-icon">
                  <i className={council.icon} aria-hidden="true"></i>
                </div>
                <span className="gov-council-badge">{council.tag}</span>
                <h3 className="gov-council-title">{council.title}</h3>
                <p className="gov-council-desc">{council.desc}</p>
                <div className="gov-council-meta">
                  <span><i className="fas fa-users-cog" aria-hidden="true"></i> {council.membersCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Section: Governing Council / Governing Body (14 Members) */}
      <section id="governing-body" className="gov-section gov-section-alt">
        <div className="container" id="governing-council">
          <div className="gov-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="gov-section-badge">APEX STATUTORY AUTHORITY</span>
              <h2 className="gov-section-title">Governing Council Members</h2>
              <p className="gov-section-subtitle">Official roster of 14 Academic Members, State Government Nominees, and JNTUH Nominees directing institutional progress.</p>
            </div>
            
            {/* View Mode Toggle */}
            <div style={{ display: 'inline-flex', background: '#ffffff', border: '1px solid var(--gov-border)', borderRadius: 'var(--gov-radius-full)', padding: '3px' }}>
              <button 
                type="button"
                className={`gov-filter-btn ${councilViewMode === 'table' ? 'active' : ''}`}
                onClick={() => setCouncilViewMode('table')}
                title="Table View"
              >
                <i className="fas fa-table" aria-hidden="true" style={{ marginRight: '6px' }}></i> Table View
              </button>
              <button 
                type="button"
                className={`gov-filter-btn ${councilViewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setCouncilViewMode('cards')}
                title="Card Directory View"
              >
                <i className="fas fa-th-large" aria-hidden="true" style={{ marginRight: '6px' }}></i> Cards View
              </button>
            </div>
          </div>

          {councilViewMode === 'table' ? (
            <div className="gov-table-wrap gov-reveal">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name of the Member</th>
                    <th>Designation &amp; Institutional Role</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="gov-table-category">
                    <td colSpan="4"><i className="fas fa-university" style={{ marginRight: '8px' }}></i> Academic Members</td>
                  </tr>
                  {GOVERNING_COUNCIL_MEMBERS.filter(m => m.category === 'Academic Members').map(m => (
                    <tr key={m.sno}>
                      <td>{m.sno}</td>
                      <td>
                        <strong style={{ color: 'var(--gov-navy)' }}>{m.name}</strong>
                      </td>
                      <td>
                        <span className={`gov-role-badge ${m.role.includes('Chairman') || m.role.includes('Secretary') ? 'emerald' : ''}`}>
                          {m.role}
                        </span>
                      </td>
                      <td style={{ color: 'var(--gov-text-muted)', fontSize: '13px' }}>{m.category}</td>
                    </tr>
                  ))}

                  <tr className="gov-table-category">
                    <td colSpan="4"><i className="fas fa-landmark" style={{ marginRight: '8px' }}></i> Statutory Nominees</td>
                  </tr>
                  {GOVERNING_COUNCIL_MEMBERS.filter(m => m.category === 'Nominees').map(m => (
                    <tr key={m.sno}>
                      <td>{m.sno}</td>
                      <td>
                        <strong style={{ color: 'var(--gov-navy)' }}>{m.name}</strong>
                      </td>
                      <td>
                        <span className="gov-role-badge emerald">{m.role}</span>
                      </td>
                      <td style={{ color: 'var(--gov-text-muted)', fontSize: '13px' }}>{m.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="gov-members-grid gov-reveal">
              {GOVERNING_COUNCIL_MEMBERS.map(m => (
                <div key={m.sno} className="gov-member-card">
                  <div className="gov-member-avatar">
                    <i className="fas fa-user-tie" aria-hidden="true"></i>
                  </div>
                  <div className="gov-member-info">
                    <h4 className="gov-member-name">{m.name}</h4>
                    <span className="gov-member-role">{m.role}</span>
                    <p className="gov-member-desc">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Section: Academic Advisory Board (13 Members) */}
      <section id="academic-council" className="gov-section">
        <div className="container" id="academic-board">
          <div className="gov-section-header">
            <span className="gov-section-badge">ACADEMIC EXCELLENCE</span>
            <h2 className="gov-section-title">Academic Advisory Board</h2>
            <p className="gov-section-subtitle">Distinguished senior professors, departmental chairs, and subject matter experts overseeing autonomous academic standards, outcome-based pedagogy, and university moderation.</p>
          </div>

          <div className="gov-table-wrap gov-reveal">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Faculty Name</th>
                  <th>Designation &amp; Department</th>
                  <th>Board Role</th>
                </tr>
              </thead>
              <tbody>
                {ACADEMIC_ADVISORY_BOARD.map(f => (
                  <tr key={f.sno}>
                    <td>{f.sno}</td>
                    <td>
                      <strong style={{ color: 'var(--gov-navy)' }}>{f.name}</strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', color: 'var(--gov-text-body)' }}>{f.designation}</span>
                    </td>
                    <td>
                      <span className={`gov-role-badge ${f.sno === 1 ? 'emerald' : ''}`}>
                        {f.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. Section: Mandatory Statutory Committees & Grievance Cells */}
      <section id="committees" className="gov-section gov-section-alt">
        <div className="container">
          <div className="gov-section-header">
            <span className="gov-section-badge">STATUTORY COMPLIANCE &amp; WELFARE</span>
            <h2 className="gov-section-title">Mandatory Committees &amp; Grievance Cells</h2>
            <p className="gov-section-subtitle">Dedicated statutory squads, grievance cells, academic bodies, and student development units operating with clear mandates and published convenors.</p>
          </div>

          {/* Filter Bar & Search */}
          <div className="gov-filter-bar">
            <div className="gov-filter-tabs">
              <button 
                type="button" 
                className={`gov-filter-btn ${committeeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCommitteeFilter('all')}
              >
                All Committees ({COMMITTEES_DATA.length})
              </button>
              <button 
                type="button" 
                className={`gov-filter-btn ${committeeFilter === 'statutory' ? 'active' : ''}`}
                onClick={() => setCommitteeFilter('statutory')}
              >
                Statutory &amp; Grievance (5)
              </button>
              <button 
                type="button" 
                className={`gov-filter-btn ${committeeFilter === 'academic' ? 'active' : ''}`}
                onClick={() => setCommitteeFilter('academic')}
              >
                Academic Operations (6)
              </button>
              <button 
                type="button" 
                className={`gov-filter-btn ${committeeFilter === 'student' ? 'active' : ''}`}
                onClick={() => setCommitteeFilter('student')}
              >
                Student Life &amp; Cells (7)
              </button>
              <button 
                type="button" 
                className={`gov-filter-btn ${committeeFilter === 'operations' ? 'active' : ''}`}
                onClick={() => setCommitteeFilter('operations')}
              >
                Campus Infrastructure &amp; Safety (4)
              </button>
            </div>

            <div className="gov-search-box">
              <i className="fas fa-search" aria-hidden="true"></i>
              <input 
                type="text" 
                placeholder="Search committee, role, or cell..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search Committees"
              />
            </div>
          </div>

          {/* Committees Grid */}
          <div className="gov-committees-grid">
            {filteredCommittees.map(item => (
              <div key={item.id} className="gov-committee-card gov-reveal">
                <div className="gov-committee-top">
                  <div className="gov-committee-icon">
                    <i className={item.icon} aria-hidden="true"></i>
                  </div>
                  <div>
                    <h3 className="gov-committee-title">{item.title}</h3>
                    <span className="gov-committee-tag">{item.tag}</span>
                  </div>
                </div>
                <p className="gov-committee-desc">{item.desc}</p>
                <div className="gov-committee-meta">
                  <span><i className="fas fa-user-check" aria-hidden="true"></i> {item.head}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredCommittees.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', background: '#ffffff', borderRadius: 'var(--gov-radius-lg)', border: '1px solid var(--gov-border)' }}>
              <i className="fas fa-search" style={{ fontSize: '32px', color: 'var(--gov-text-soft)', marginBottom: '12px' }}></i>
              <h4 style={{ color: 'var(--gov-navy)', margin: '0 0 6px' }}>No matching committees found</h4>
              <p style={{ color: 'var(--gov-text-muted)', margin: 0 }}>Try clearing your search query or switching categories.</p>
            </div>
          )}
        </div>
      </section>

      {/* 7. Section: Institutional Organogram & Administrative Workflow */}
      <section id="organogram" className="gov-section">
        <div className="container">
          <div className="gov-section-header text-center">
            <span className="gov-section-badge">ADMINISTRATIVE HIERARCHY</span>
            <h2 className="gov-section-title">Institutional Organogram &amp; Workflow</h2>
            <p className="gov-section-subtitle">Structured operational workflow establishing clear channels of decision-making, academic accountability, and administrative responsiveness.</p>
          </div>

          <div className="gov-organogram-box gov-reveal">
            <div className="gov-organogram-img-wrap">
              <img 
                src="/images/RISHI MS - Organizational Flow Chart.png" 
                alt="RISHI MS - Institutional Organizational Flow Chart" 
                loading="lazy"
                onClick={() => setShowOrgModal(true)}
                style={{ cursor: 'zoom-in' }}
                title="Click to view high-resolution full organogram"
              />
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="gov-btn gov-btn-primary" 
                onClick={() => setShowOrgModal(true)}
              >
                <i className="fas fa-search-plus" aria-hidden="true"></i> View Full-Resolution Organogram
              </button>
              <a 
                href="/images/RISHI MS - Organizational Flow Chart.png" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="gov-btn gov-btn-secondary"
              >
                <i className="fas fa-external-link-alt" aria-hidden="true"></i> Open in New Tab
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section: University Ombudsperson */}
      <section id="ombudsperson" className="gov-section gov-section-alt">
        <div className="container">
          <div className="gov-section-header">
            <span className="gov-section-badge">APEX STATUTORY GRIEVANCE MECHANISM</span>
            <h2 className="gov-section-title">University Ombudsperson</h2>
            <p className="gov-section-subtitle">Statutory appellate authority appointed under UGC (Redress of Grievances of Students) Regulations for independent investigation of student concerns.</p>
          </div>

          <div className="gov-ombudsperson-card gov-reveal">
            <img 
              src="/images/Dr.R.Sayanna.png" 
              alt="Dr. R. Sayanna — University Ombudsperson" 
              className="gov-ombudsperson-img"
              loading="lazy"
            />
            <div className="gov-ombudsperson-details">
              <h3 className="gov-ombudsperson-name">Dr. R. Sayanna</h3>
              <span className="gov-ombudsperson-title">University Ombudsperson, JNTU Hyderabad</span>
              <p className="gov-ombudsperson-bio">
                Former Vice-Chancellor, Kakatiya University, Warangal, Telangana State.<br />
                Former Professor &amp; Head, Department of Physics, Osmania University, Hyderabad.<br />
                Appointed by the affiliating university as the independent Ombudsperson to hear and resolve student appeals transparently.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <a href="mailto:ombudsperson@jntuh.ac.in" className="gov-ombudsperson-contact">
                  <i className="fas fa-envelope" aria-hidden="true" style={{ color: 'var(--gov-emerald)' }}></i>
                  <span>ombudsperson@jntuh.ac.in</span>
                </a>
                <a 
                  href="https://rishimsengg.ac.in/PDFs/713Ombudsperson.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="gov-btn gov-btn-secondary"
                  style={{ padding: '6px 16px', fontSize: '13px' }}
                >
                  <i className="fas fa-file-pdf" style={{ color: '#dc2626' }} aria-hidden="true"></i> Statutory Notification PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Section: Strategic Institutional Development Plan (IDP) */}
      <section id="idp" className="gov-section">
        <div className="container">
          <div className="gov-section-header">
            <span className="gov-section-badge">STRATEGIC ROADMAP</span>
            <h2 className="gov-section-title">Institution Development Plan (IDP)</h2>
            <p className="gov-section-subtitle">Strategic institutional blueprint for pedagogical excellence, doctoral research enrichment, industry-aligned laboratories, and holistic student empowerment.</p>
          </div>

          <div className="gov-reveal" style={{ background: '#ffffff', border: '1px solid var(--gov-border)', borderRadius: 'var(--gov-radius-xl)', padding: '36px', boxShadow: 'var(--gov-shadow-xs)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--gov-navy)', marginBottom: '14px' }}>
                  Strategic Objectives &amp; Long-Term Vision
                </h3>
                <p style={{ fontSize: '14.5px', color: 'var(--gov-text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>
                  The <strong>Institution Development Plan (IDP)</strong> of Rishi MS Institute of Engineering &amp; Technology for Women (RITW) outlines the strategic roadmap for academic excellence, infrastructure growth, research initiatives, and holistic student development. It reflects our commitment to quality technical education aligned with AICTE, JNTU-H, and UGC guidelines, while fostering innovation, entrepreneurship, and community engagement among women engineers.
                </p>
                <p style={{ fontSize: '14.5px', color: 'var(--gov-text-muted)', lineHeight: 1.7, margin: 0 }}>
                  The IDP serves as a guiding document for the institution's short-term and long-term goals, covering areas such as curriculum enhancement, faculty development, industry collaborations, infrastructure upgradation, and student welfare initiatives.
                </p>
              </div>

              <div style={{ background: 'var(--gov-subtle)', border: '1px solid var(--gov-border)', borderRadius: 'var(--gov-radius-lg)', padding: '24px', textAlign: 'center' }}>
                <i className="fas fa-file-pdf" style={{ fontSize: '54px', color: '#dc2626', marginBottom: '16px' }} aria-hidden="true"></i>
                <h4 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--gov-navy)', margin: '0 0 8px' }}>
                  Official IDP Document
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--gov-text-muted)', margin: '0 0 18px' }}>
                  Complete Institutional Development Plan (PDF &bull; 211 KB)
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <a 
                    href="/PDFs/RITW IDP.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="gov-btn gov-btn-emerald"
                  >
                    <i className="fas fa-download" aria-hidden="true"></i> Download IDP (PDF)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Section: Financial Accountability & Audit Statements */}
      <section id="audit" className="gov-section gov-section-alt">
        <div className="container">
          <div className="gov-section-header">
            <span className="gov-section-badge">FINANCIAL TRANSPARENCY</span>
            <h2 className="gov-section-title">Annual Audit Statements</h2>
            <p className="gov-section-subtitle">
              As part of our commitment to financial transparency and accountability, Rishi MS Institute of Engineering &amp; Technology for Women (RITW) publishes its Annual Audit Statements prepared by certified auditors in accordance with applicable accounting standards and regulatory requirements.
            </p>
          </div>

          <div className="gov-docs-grid gov-reveal">
            {AUDIT_STATEMENTS.map((audit, idx) => (
              <a 
                key={idx} 
                href={audit.file} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="gov-doc-card"
                title={`Download ${audit.title}`}
              >
                <div className="gov-doc-icon">
                  <i className="fas fa-file-pdf" aria-hidden="true"></i>
                </div>
                <div className="gov-doc-info">
                  <h4 className="gov-doc-title">{audit.title}</h4>
                  <span className="gov-doc-meta">
                    <i className="fas fa-check-circle" style={{ color: 'var(--gov-emerald)' }} aria-hidden="true"></i> Statutory Auditor Certified &bull; {audit.size}
                  </span>
                </div>
                <div className="gov-doc-arrow">
                  <i className="fas fa-arrow-down" aria-hidden="true"></i>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Section: Code of Conduct & Institutional Policies */}
      <section id="conduct" className="gov-section">
        <div className="container">
          <div className="gov-reveal" style={{ background: '#ffffff', border: '1px solid var(--gov-border)', borderLeft: '5px solid var(--gov-emerald)', borderRadius: 'var(--gov-radius-xl)', padding: '36px', boxShadow: 'var(--gov-shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ maxWidth: '780px' }}>
                <span className="gov-section-badge">ETHICS &amp; PUBLIC POLICIES</span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--gov-navy)', margin: '8px 0 10px' }}>
                  Institutional Code of Conduct &amp; Student Handbook
                </h2>
                <p style={{ fontSize: '14.5px', color: 'var(--gov-text-muted)', margin: 0, lineHeight: 1.65 }}>
                  Comprehensive code of ethics for students, teaching faculty, and administrative staff governing professional conduct, laboratory discipline, academic integrity, and campus decorum.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a 
                  href="https://rishimsengg.ac.in/Public_Documents/Code_of_Conduct.php" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="gov-btn gov-btn-emerald"
                >
                  <i className="fas fa-download" aria-hidden="true"></i> Code of Conduct
                </a>
                <a 
                  href="https://rishimsengg.ac.in/Public_Documents/Service_Rules.php" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="gov-btn gov-btn-secondary"
                >
                  <i className="fas fa-book" aria-hidden="true"></i> Service Rules
                </a>
                <a 
                  href="https://rishimsengg.ac.in/Public_Documents/Self-Disclosure.php" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="gov-btn gov-btn-secondary"
                >
                  <i className="fas fa-certificate" aria-hidden="true"></i> Self-Disclosure
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Resolution Organogram Lightbox Modal */}
      {showOrgModal && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(7, 23, 44, 0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setShowOrgModal(false)}
        >
          <div 
            style={{ background: '#ffffff', borderRadius: 'var(--gov-radius-lg)', maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', padding: '20px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--gov-border)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--gov-navy)', margin: 0 }}>
                RISHI MS - Institutional Organizational Flow Chart
              </h3>
              <button 
                type="button" 
                onClick={() => setShowOrgModal(false)}
                style={{ background: 'var(--gov-subtle)', border: '1px solid var(--gov-border)', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', color: 'var(--gov-navy)' }}
                title="Close"
              >
                &times;
              </button>
            </div>
            <img 
              src="/images/RISHI MS - Organizational Flow Chart.png" 
              alt="High-resolution Organogram" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
