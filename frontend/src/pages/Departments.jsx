import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './fieldsui-pages.css';

const DEPARTMENTS = [
  {
    id: 'cse',
    name: 'Computer Science and Engineering (CSE)',
    shortName: 'CSE',
    intake: '180 Seats',
    established: '2009',
    badge: 'NBA ACCREDITED',
    hod: {
      name: 'Dr. Archana Baburao Patil',
      degree: 'M.Tech, Ph.D.',
      designation: 'Head of the Department, CSE & Allied',
      email: 'cse.hod@rishimsengg.ac.in',
      phone: '+91-967-623-3050',
      image: '/images/Dr.ARCHANA BABURAO PATIL.jpg',
      message: 'Our mission is to empower women scholars with robust algorithmic fundamentals, hands-on full-stack development, and competitive coding acumen required to excel in global engineering organizations.'
    },
    about: 'The Department of Computer Science and Engineering is committed to preparing young women for the challenges and opportunities of the modern digital landscape. It offers a balanced mix of theory, practice, and innovation, supported by experienced doctoral faculty and high-performance computing laboratories.',
    targets: [
      'Strong foundation in computing, data structures, and algorithmic programming.',
      'Encouraging innovation, critical problem-solving skills, and competitive coding.',
      'Interdisciplinary learning with real-world industry relevance and corporate MoUs.',
      'Preparing students for higher education, tech entrepreneurship, and global research careers.',
      'Promoting engineering ethics, collaborative teamwork, and leadership.'
    ],
    futureApps: 'The department trains students for emerging domains like Artificial Intelligence, Cloud Engineering, Zero-Trust Cybersecurity, and Big Data Analytics, ensuring readiness for future industry needs.',
    outcomes: [
      'Technical expertise in computer science principles and software engineering lifecycle.',
      'Ability to design and evaluate solutions for complex engineering problems.',
      'Lifelong learning mindset to adapt continuously to evolving technologies.',
      'Effective communication, project management, and multidisciplinary teamwork.',
      'Uncompromising commitment to professional ethics and social responsibility.'
    ],
    trends: [
      'Generative AI & Large Language Model Workflows',
      'Cloud Architecture & Microservices (AWS / GCP)',
      'Cybersecurity, Ethical Hacking & Zero-Trust Architecture',
      'Full Stack Web Development & Mobile App Ecosystems',
      'Distributed Systems & Container Orchestration'
    ],
    careers: [
      'Software Development Engineer (SDE)',
      'Data Scientist & Analytics Engineer',
      'Cloud Solutions Architect',
      'Cybersecurity & Network Analyst',
      'AI/ML Research Specialist',
      'Tech Lead & Systems Architect'
    ],
    labs: [
      { name: 'Advanced AI & Deep Learning Lab', desc: 'Equipped with GPU computing clusters for deep neural networks, computer vision, and NLP research.', icon: 'fas fa-brain' },
      { name: 'Cloud Computing & Virtualization Lab', desc: 'Virtual server environments for container orchestration, Docker, Kubernetes, and AWS architecture testing.', icon: 'fas fa-cloud' },
      { name: 'Object-Oriented Programming & Data Structures Lab', desc: 'High-speed desktop workstations for C++, Java, Python, algorithms, and automated test-driven programming.', icon: 'fas fa-code' },
      { name: 'Web Technologies & Database Systems Lab', desc: 'Enterprise relational and NoSQL database suites (Oracle, PostgreSQL, MongoDB) with full-stack frameworks.', icon: 'fas fa-database' }
    ]
  },
  {
    id: 'aiml',
    name: 'CSE (Artificial Intelligence & Machine Learning)',
    shortName: 'CSE-AIML',
    intake: '180 Seats',
    established: '2020',
    badge: 'EMERGING TECH',
    hod: {
      name: 'Dr. Archana Baburao Patil',
      degree: 'M.Tech, Ph.D.',
      designation: 'Head of Department (CSE & Allied)',
      email: 'aiml.hod@rishimsengg.ac.in',
      phone: '+91-967-623-3050',
      image: '/images/Dr.ARCHANA BABURAO PATIL.jpg',
      message: 'Artificial Intelligence is revolutionizing every industrial vertical. We equip our students with mathematical rigor, neural network architectures, and MLOps pipelines.'
    },
    about: 'The Artificial Intelligence & Machine Learning branch empowers students with mathematical foundations, statistical learning, cognitive computing, and robotics to solve complex real-world automation challenges.',
    targets: [
      'Rigorous mastery of linear algebra, calculus, and probabilistic modeling.',
      'Hands-on proficiency in PyTorch, TensorFlow, Scikit-Learn, and OpenCV.',
      'Building scalable end-to-end Machine Learning pipelines and automated MLOps.',
      'Responsible AI development with fairness, explainability, and bias mitigation.'
    ],
    futureApps: 'Autonomous vehicle systems, intelligent healthcare diagnostics, predictive financial analytics, voice assistants, and enterprise generative AI solutions.',
    outcomes: [
      'Design predictive algorithms and deep neural networks for multifaceted data.',
      'Deploy and monitor production AI models with robust inference pipelines.',
      'Analyze ethics, privacy, and regulatory policies in automated decision-making.'
    ],
    trends: [
      'Large Language Models (LLMs) & Fine-Tuning',
      'Multimodal Generative Vision-Language Systems',
      'Edge AI & TinyML on Embedded Hardware',
      'Reinforcement Learning & Robotics Automation'
    ],
    careers: [
      'Machine Learning Engineer',
      'Computer Vision Specialist',
      'NLP Research Scientist',
      'AI Product Developer'
    ],
    labs: [
      { name: 'Cognitive Computing & Neural Systems Lab', desc: 'Dedicated GPU-accelerated computing nodes for model training and hyperparameter tuning.', icon: 'fas fa-microchip' },
      { name: 'Robotics & Computer Vision Center', desc: 'Sensor rigs, stereo cameras, and ROS simulation platforms for autonomous navigation.', icon: 'fas fa-robot' }
    ]
  },
  {
    id: 'ds',
    name: 'CSE (Data Science)',
    shortName: 'CSE-DS',
    intake: '60 Seats',
    established: '2021',
    badge: 'HIGH DEMAND',
    hod: {
      name: 'Dr. Archana Baburao Patil',
      degree: 'M.Tech, Ph.D.',
      designation: 'Head of Department (CSE & Allied)',
      email: 'ds.hod@rishimsengg.ac.in',
      phone: '+91-967-623-3050',
      image: '/images/Dr.ARCHANA BABURAO PATIL.jpg',
      message: 'Data is the core currency of modern business. Our Data Science curriculum trains students to extract actionable intelligence from massive distributed datasets.'
    },
    about: 'The Data Science program provides in-depth training in statistics, big data technologies, predictive analytics, data visualization, and data engineering architectures.',
    targets: [
      'Mastery of data collection, wrangling, feature engineering, and exploratory analysis.',
      'Proficiency in Hadoop, Apache Spark, Kafka, and cloud data warehouses (BigQuery/Snowflake).',
      'Translating raw datasets into actionable executive dashboards and predictive models.'
    ],
    futureApps: 'Healthcare informatics, algorithmic fintech trading, e-commerce recommendation engines, supply chain optimization, and national census analytics.',
    outcomes: [
      'Formulate statistical hypotheses and design robust analytical experiments.',
      'Build end-to-end distributed data pipelines with enterprise data lakes.',
      'Communicate complex analytical insights clearly to multidisciplinary teams.'
    ],
    trends: [
      'Real-Time Streaming Analytics & Event-Driven Architecture',
      'Data Mesh & Modern Cloud Data Warehousing',
      'Automated Machine Learning (AutoML) & Feature Stores',
      'Data Governance, Privacy (GDPR/DPDP) & Compliance'
    ],
    careers: [
      'Data Scientist',
      'Big Data Engineer',
      'Business Intelligence Architect',
      'Quantitative Analytics Specialist'
    ],
    labs: [
      { name: 'Big Data & Cloud Analytics Lab', desc: 'Apache Spark, Hadoop, and high-memory workstations for multi-terabyte data processing.', icon: 'fas fa-database' },
      { name: 'Statistical Computing & Visualization Center', desc: 'R, Python, Tableau, and PowerBI environments for statistical modeling and executive dashboarding.', icon: 'fas fa-chart-pie' }
    ]
  },
  {
    id: 'it',
    name: 'Information Technology (IT)',
    shortName: 'IT',
    intake: '60 Seats',
    established: '2009',
    badge: 'INDUSTRY READY',
    hod: {
      name: 'Dr. Archana Baburao Patil',
      degree: 'M.Tech, Ph.D.',
      designation: 'Head of Department (IT & Allied)',
      email: 'it.hod@rishimsengg.ac.in',
      phone: '+91-967-623-3050',
      image: '/images/Dr.ARCHANA BABURAO PATIL.jpg',
      message: 'Information Technology bridges software systems with enterprise business infrastructure, cybersecurity, and cloud network operations.'
    },
    about: 'The IT Department delivers practical skills in enterprise software solutions, secure network operations, mobile application frameworks, and information infrastructure.',
    targets: [
      'Mastering software architecture, client-server models, and full-stack development.',
      'Deploying secure computer networks, firewalls, and cryptographic protocols.',
      'Enterprise cloud administration and CI/CD automated pipeline engineering.'
    ],
    futureApps: 'Enterprise resource planning (ERP), fintech banking networks, e-governance portals, and secure cloud storage infrastructure.',
    outcomes: [
      'Design, configure, and maintain scalable enterprise IT systems.',
      'Mitigate information security vulnerabilities through proactive audits.',
      'Collaborate across cross-functional enterprise technical environments.'
    ],
    trends: [
      'DevSecOps & Infrastructure as Code (Terraform / Ansible)',
      'Hybrid Cloud Architecture & Kubernetes Orchestration',
      'API-First Microservices & Serverless Computing'
    ],
    careers: [
      'Full Stack Software Engineer',
      'DevOps & Cloud Systems Engineer',
      'IT Infrastructure Consultant',
      'Network Security Specialist'
    ],
    labs: [
      { name: 'Enterprise Systems & Networking Lab', desc: 'Managed Cisco switches, routers, and virtualized enterprise server clusters.', icon: 'fas fa-server' },
      { name: 'Full-Stack Application Development Lab', desc: 'Modern Node.js, React, Docker, and Spring Boot development environments.', icon: 'fas fa-laptop-code' }
    ]
  },
  {
    id: 'ece',
    name: 'Electronics & Communication Engineering (ECE)',
    shortName: 'ECE',
    intake: '60 Seats',
    established: '2009',
    badge: 'VLSI & IOT',
    hod: {
      name: 'Dr. Archana Baburao Patil',
      degree: 'M.Tech, Ph.D.',
      designation: 'Head of Department, ECE',
      email: 'ece.hod@rishimsengg.ac.in',
      phone: '+91-967-623-3050',
      image: '/images/Dr.ARCHANA BABURAO PATIL.jpg',
      message: 'ECE empowers students to design smart silicon chips, embedded IoT systems, and next-generation wireless communications.'
    },
    about: 'The ECE Department prepares women engineers for semiconductor design, embedded microcontrollers, 5G cellular systems, robotics, and smart IoT sensor networks.',
    targets: [
      'Solid foundations in analog & digital electronic circuit design and signals.',
      'Hands-on VLSI design using industry-standard Cadence / Mentor Graphics tools.',
      'Microcontroller programming (ARM, Arduino, ESP32, Raspberry Pi) for IoT.'
    ],
    futureApps: '5G/6G mobile communication networks, smart city IoT grids, electric vehicle embedded controllers, and biomedical instrumentation.',
    outcomes: [
      'Analyze and simulate complex electronic and communication circuits.',
      'Design embedded firmware and IoT architectures for smart edge hardware.',
      'Apply signal processing algorithms to speech, image, and radar systems.'
    ],
    trends: [
      'VLSI Semiconductor Chip Design & Physical Layout',
      '5G New Radio (NR) & Next-Gen Satellite Communications',
      'Internet of Things (IoT) & Smart Embedded Sensors'
    ],
    careers: [
      'VLSI Design Engineer',
      'Embedded Software Developer',
      'Telecom & RF Systems Engineer',
      'IoT Solutions Architect'
    ],
    labs: [
      { name: 'VLSI & Microelectronics CAD Lab', desc: 'High-end EDA software suites for ASIC design, FPGA synthesis, and physical layout verification.', icon: 'fas fa-microchip' },
      { name: 'Embedded Systems & IoT Innovation Center', desc: 'ARM Cortex boards, sensor arrays, oscilloscope stations, and wireless testing equipment.', icon: 'fas fa-wifi' }
    ]
  }
];

export default function Departments() {
  const location = useLocation();
  const [userSelectedDeptId, setUserSelectedDeptId] = useState(null);

  const hash = location.hash.replace('#', '');
  const isHashValid = ['aiml', 'ds', 'it', 'ece', 'cse'].includes(hash);

  useEffect(() => {
    if (isHashValid) {
      setUserSelectedDeptId(hash);
    }
  }, [hash, isHashValid]);

  const selectedDeptId = userSelectedDeptId || (isHashValid ? hash : 'cse');
  const activeDept = DEPARTMENTS.find((d) => d.id === selectedDeptId) || DEPARTMENTS[0];

  return (
    <div className="departments-page">
      {/* 1. Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Departments</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">{activeDept.shortName}</span>
          </div>
          <span className="page-badge">UGC AUTONOMOUS CURRICULA &bull; JNTUH AFFILIATED</span>
          <h1 className="page-title">Academic Departments &amp; Laboratories</h1>
          <p className="page-subtitle">
            Industry-aligned outcome-based curricula, doctoral faculty guidance, and state-of-the-art computing laboratories.
          </p>
        </div>
      </section>

      {/* 2. Department Selector Navigation Pills (VIT Style) */}
      <nav className="dept-tabs-nav" aria-label="Department selection">
        <div className="container dept-tabs-inner">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.id}
              type="button"
              className={`dept-tab-btn ${selectedDeptId === dept.id ? 'active' : ''}`}
              onClick={() => setUserSelectedDeptId(dept.id)}
            >
              <span className="tab-code">{dept.shortName}</span>
              <span className="tab-name">{dept.name.split(' (')[0]}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 3. Selected Department Detail Showcase */}
      <section className="dept-showcase-section">
        <div className="container">
          
          {/* Department Header Card */}
          <div className="dept-hero-card">
            <div className="dept-hero-info">
              <div className="dept-badge-row">
                <span className="dept-badge">{activeDept.badge}</span>
                <span className="dept-meta-pill">Established: {activeDept.established}</span>
                <span className="dept-meta-pill">Approved Seats: {activeDept.intake}</span>
              </div>
              <h2 className="dept-title">{activeDept.name}</h2>
              <p className="dept-about-text">{activeDept.about}</p>
              
              <div className="dept-quick-actions">
                <Link to="/admissions" className="btn-cta btn-cta-green">
                  <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                  <span>Apply for {activeDept.shortName} Admissions</span>
                </Link>
                <a href="#labs" className="btn-cta btn-cta-navy">
                  <i className="fas fa-flask" aria-hidden="true"></i>
                  <span>Explore Labs</span>
                </a>
              </div>
            </div>

            {/* HOD Profile Card */}
            <div className="dept-hod-card">
              <div className="hod-photo-frame">
                <img 
                  src={activeDept.hod.image} 
                  alt={activeDept.hod.name} 
                  className="hod-photo"
                  onError={(e) => { e.currentTarget.src = '/images/why_choose/faculty.png'; }}
                />
              </div>
              <h3 className="hod-name">{activeDept.hod.name}</h3>
              <div className="hod-degree">{activeDept.hod.degree}</div>
              <div className="hod-designation">{activeDept.hod.designation}</div>
              <p className="hod-message">"{activeDept.hod.message}"</p>
              
              <div className="hod-contact-info">
                <a href={`mailto:${activeDept.hod.email}`} className="hod-link">
                  <i className="fas fa-envelope" aria-hidden="true"></i>
                  <span>{activeDept.hod.email}</span>
                </a>
                <a href={`tel:${activeDept.hod.phone}`} className="hod-link">
                  <i className="fas fa-phone-alt" aria-hidden="true"></i>
                  <span>{activeDept.hod.phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Department Targets & Outcomes */}
          <div className="dept-split-grid">
            <div className="dept-card-box">
              <div className="card-box-header">
                <i className="fas fa-bullseye" aria-hidden="true"></i>
                <h3>Program Educational Targets</h3>
              </div>
              <ul className="bullet-list">
                {activeDept.targets.map((tgt, idx) => (
                  <li key={idx}>
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <span>{tgt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dept-card-box">
              <div className="card-box-header">
                <i className="fas fa-award" aria-hidden="true"></i>
                <h3>Program Outcomes &amp; Core Strengths</h3>
              </div>
              <ul className="bullet-list">
                {activeDept.outcomes.map((out, idx) => (
                  <li key={idx}>
                    <i className="fas fa-angle-right" aria-hidden="true"></i>
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Laboratories Section */}
          <div id="labs" className="dept-labs-section">
            <div className="section-header" style={{ marginBottom: '32px' }}>
              <span className="section-badge">PRACTICAL INFRASTRUCTURE</span>
              <h3 className="section-title">Department Specialized Laboratories</h3>
              <p className="section-subtitle">
                High-performance workstations, licensed enterprise software, and dedicated GPU computing nodes.
              </p>
            </div>

            <div className="labs-grid">
              {activeDept.labs.map((lab, idx) => (
                <div key={idx} className="lab-card">
                  <div className="lab-icon-box">
                    <i className={lab.icon} aria-hidden="true"></i>
                  </div>
                  <h4 className="lab-name">{lab.name}</h4>
                  <p className="lab-desc">{lab.desc}</p>
                </div>
              ))}
              <div id="library" className="lab-card" style={{ borderColor: 'var(--ritw-navy-light)' }}>
                <div className="lab-icon-box" style={{ background: 'var(--ritw-navy-soft)', color: 'var(--ritw-navy)' }}>
                  <i className="fas fa-book-reader" aria-hidden="true"></i>
                </div>
                <h4 className="lab-name">Departmental Digital Library &amp; E-Resources</h4>
                <p className="lab-desc">Access to IEEE Xplore, ACM Digital Library, Springer journals, and dedicated research terminal stations.</p>
              </div>
            </div>
          </div>

          {/* Industry Trends & Career Opportunities */}
          <div className="dept-split-grid" style={{ marginTop: '40px' }}>
            <div className="dept-card-box">
              <div className="card-box-header">
                <i className="fas fa-chart-line" aria-hidden="true"></i>
                <h3>Emerging Industry Domains</h3>
              </div>
              <div className="tags-cloud">
                {activeDept.trends.map((trend, idx) => (
                  <span key={idx} className="trend-tag">
                    <i className="fas fa-bolt" aria-hidden="true"></i>
                    <span>{trend}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="dept-card-box">
              <div className="card-box-header">
                <i className="fas fa-user-tie" aria-hidden="true"></i>
                <h3>Career Roles for Graduates</h3>
              </div>
              <div className="tags-cloud">
                {activeDept.careers.map((career, idx) => (
                  <span key={idx} className="career-tag">
                    <i className="fas fa-briefcase" aria-hidden="true"></i>
                    <span>{career}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Examination Cell Section (#coe / #exams) */}
      <section id="coe" className="exam-cell-section">
        <div className="container" id="exams">
          <div className="section-header">
            <span className="section-badge">AUTONOMOUS EVALUATION</span>
            <h2 className="section-title">Controller of Examinations (COE)</h2>
            <p className="section-subtitle">
              Conducting fair, transparent, and prompt autonomous semester end examinations, grade evaluations, and results publishing.
            </p>
          </div>

          <div className="exam-cell-grid">
            <div id="curriculum" className="exam-card">
              <i id="syllabus" className="fas fa-file-signature exam-icon" aria-hidden="true"></i>
              <h4>Autonomous Examination Regulations</h4>
              <p id="grading">Choice Based Credit System (CBCS), continuous internal evaluations (CIE), and transparent credit grading scales.</p>
              <span className="exam-status">Regulations R-26 In Effect</span>
            </div>
            <div id="exam-notifications" className="exam-card">
              <i className="fas fa-calendar-check exam-icon" aria-hidden="true"></i>
              <h4>Timetables &amp; Circulars</h4>
              <p>Regular and supplementary semester examination timetables, hall ticket distribution, and fee schedules.</p>
              <span className="exam-status">Published Digitally</span>
            </div>
            <div id="results" className="exam-card">
              <i className="fas fa-award exam-icon" aria-hidden="true"></i>
              <h4>Results &amp; Grade Cards</h4>
              <p>Instant semester SGPA / CGPA results portal with secure cryptographic verification and digital transcripts.</p>
              <span className="exam-status">Online Verification</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/examinations" className="btn-cta btn-cta-navy">
              <i className="fas fa-file-signature" aria-hidden="true"></i>
              <span>Access Dedicated Controller of Examinations Portal &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Innovation & Research Cell Section (#research / #rd) */}
      <section id="research" className="research-cell-section">
        <div className="container" id="rd">
          <div className="section-header">
            <span className="section-badge">INNOVATION &amp; PATENTS</span>
            <h2 className="section-title">Research &amp; Development (R&amp;D) Cell</h2>
            <p className="section-subtitle">
              Catalyzing faculty research, sponsored grants, student prototype hackathons, and published patents.
            </p>
          </div>

          <div className="research-metrics-grid">
            <div id="patents" className="research-stat-card">
              <div className="res-val">25+</div>
              <div className="res-title">Patents &amp; Intellectual Property</div>
              <p className="res-desc">Published and filed by faculty and student research teams in AI, IoT, and green computing.</p>
            </div>
            <div className="research-stat-card">
              <div className="res-val">120+</div>
              <div className="res-title">Refereed Scopus / IEEE Papers</div>
              <p className="res-desc">Peer-reviewed publications in international journals and global engineering symposia.</p>
            </div>
            <div id="projects" className="research-stat-card">
              <div className="res-val">15+</div>
              <div className="res-title">Student Startups &amp; Prototypes</div>
              <p className="res-desc">Incubated projects solving real-world healthcare, accessibility, and urban automation issues.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/research" className="btn-cta btn-cta-green">
              <i className="fas fa-atom" aria-hidden="true"></i>
              <span>Explore Official R&amp;D Policy, Patents &amp; Innovation Center &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
