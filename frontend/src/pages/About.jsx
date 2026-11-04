import React from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

export default function About() {
  return (
    <div className="fui-page-wrapper">
      {/* 1. Breadcrumbs */}
      <div className="fui-breadcrumb-strip">
        <div className="fui-container">
          <ul className="fui-breadcrumb-list">
            <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
            <li className="fui-breadcrumb-separator"><i className="fas fa-chevron-right"></i></li>
            <li><Link to="/about">About</Link></li>
            <li className="fui-breadcrumb-separator"><i className="fas fa-chevron-right"></i></li>
            <li className="fui-breadcrumb-current">About Our College "RITW"</li>
          </ul>
        </div>
      </div>

      {/* 2. Hero Banner */}
      <section className="fui-hero-section" id="ritw-college">
        <div className="fui-container">
          <div className="fui-hero-badge-row">
            <span className="fui-badge fui-badge-navy"><i className="fas fa-university"></i> UGC Autonomous Institution</span>
            <span className="fui-badge fui-badge-emerald"><i className="fas fa-award"></i> NAAC 'A' Grade Accredited</span>
            <span className="fui-badge fui-badge-navy"><i className="fas fa-check-circle"></i> NBA Accredited (CSE &amp; ECE)</span>
            <span className="fui-badge fui-badge-gold"><i className="fas fa-female"></i> Exclusively For Women</span>
          </div>
          <h1 className="fui-hero-title">About Our College RITW</h1>
          <p className="fui-hero-subtitle">
            Established in 2009, <strong>Rishi MS Institute of Engineering and Technology for Women (RITW)</strong> is a leading institution dedicated exclusively to women's education in engineering and technology. Located on a 5.2-acre lush green campus opposite JNTU, Hyderabad, Telangana, RITW was founded in memory of the legendary singer <strong>Bharat Ratna M.S. Subbulakshmi</strong>.
          </p>

          <div className="fui-stats-grid">
            <div className="fui-stat-card">
              <div className="fui-stat-number">2009</div>
              <div className="fui-stat-label">Year Established</div>
            </div>
            <div className="fui-stat-card">
              <div className="fui-stat-number">5.2 Acres</div>
              <div className="fui-stat-label">Lush Green Campus (Opp. JNTU)</div>
            </div>
            <div className="fui-stat-card">
              <div className="fui-stat-number">NAAC 'A'</div>
              <div className="fui-stat-label">Accreditation (Score 3.12/4.0)</div>
            </div>
            <div className="fui-stat-card">
              <div className="fui-stat-number">NBA</div>
              <div className="fui-stat-label">Accredited (CSE &amp; ECE)</div>
            </div>
            <div className="fui-stat-card">
              <div className="fui-stat-number">NIRF</div>
              <div className="fui-stat-label">Recognized Institution</div>
            </div>
            <div className="fui-stat-card">
              <div className="fui-stat-number">Rishi UBR</div>
              <div className="fui-stat-label">Educational Society (Est. 1990)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sticky Subnav */}
      <nav className="fui-sticky-subnav" aria-label="About Page Sub Navigation">
        <div className="fui-container">
          <div className="fui-subnav-scroll">
            <a href="#ritw-college" className="fui-subnav-item active"><i className="fas fa-landmark"></i> Overview</a>
            <a href="#memorial" className="fui-subnav-item"><i className="fas fa-heart"></i> M.S. Memorial</a>
            <a href="#logo-theme" className="fui-subnav-item"><i className="fas fa-shield-alt"></i> Logo | Flag | Color | Theme</a>
            <a href="#rishi-group" className="fui-subnav-item"><i className="fas fa-sitemap"></i> Rishi Group</a>
            <a href="#vision-mission" className="fui-subnav-item"><i className="fas fa-compass"></i> Vision, Mission &amp; Quality</a>
            <a href="#objectives" className="fui-subnav-item"><i className="fas fa-bullseye"></i> Objectives</a>
            <a href="#aspirations" className="fui-subnav-item"><i className="fas fa-chart-line"></i> Aspirations</a>
            <a href="#idp" className="fui-subnav-item"><i className="fas fa-file-alt"></i> IDP (2024-29)</a>
            <a href="#leadership" className="fui-subnav-item"><i className="fas fa-users-cog"></i> Leadership Desks</a>
            <a href="#governing-council" className="fui-subnav-item"><i className="fas fa-balance-scale"></i> Governing Council</a>
            <a href="#workflow" className="fui-subnav-item"><i className="fas fa-network-wired"></i> Organisation Workflow</a>
            <a href="#academic-board" className="fui-subnav-item"><i className="fas fa-graduation-cap"></i> Academic Advisory Board</a>
            <a href="#naac" className="fui-subnav-item"><i className="fas fa-award"></i> NAAC Certificate</a>
            <a href="#audit" className="fui-subnav-item"><i className="fas fa-file-invoice-dollar"></i> Audit Statements</a>
            <a href="#ombudsperson" className="fui-subnav-item"><i className="fas fa-user-shield"></i> Ombudsperson</a>
            <a href="#why-choose" className="fui-subnav-item"><i className="fas fa-check-circle"></i> Why Choose RITW?</a>
            <a href="#contact-directory" className="fui-subnav-item"><i className="fas fa-phone-alt"></i> Contact Directory</a>
          </div>
        </div>
      </nav>

      {/* 4. Memorial Section */}
      <section className="fui-section" id="memorial">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Foundational Legacy</span>
            <h2 className="fui-section-title">In Revered Memory of Bharat Ratna M.S. Subbulakshmi</h2>
            <p className="fui-section-subtitle">A timeless symbol of dedication, humility, discipline, and excellence inspiring every student at RITW.</p>
          </div>

          <div className="fui-memorial-wrapper">
            <div className="row align-items-center">
              <div className="col-lg-4 text-center mb-4 mb-lg-0">
                <div className="fui-portrait-frame">
                  <img src="/images/ms_subbu_lakshmi_rishi_college.webp" alt="Bharat Ratna M.S. Subbulakshmi" className="fui-portrait-img" />
                </div>
                <div className="mt-3">
                  <strong style={{ color: '#0b2545', fontSize: '0.95rem' }}>Bharat Ratna Smt. M.S. Subbulakshmi</strong>
                  <div style={{ color: '#64748b', fontSize: '0.825rem' }}>(1916–2004) &bull; Cultural Icon &amp; Humanitarian</div>
                </div>
              </div>
              <div className="col-lg-8">
                <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#1e293b', marginBottom: '16px' }}>
                  RITW proudly carries the name of <strong>Bharat Ratna Smt. M.S. Subbulakshmi</strong>, one of India's most celebrated Carnatic vocalists and a timeless symbol of dedication, humility, discipline, and excellence.
                </p>
                <p style={{ fontSize: '0.975rem', lineHeight: '1.7', color: '#334155', marginBottom: '16px' }}>
                  She was the <strong>first musician to receive the Bharat Ratna</strong>, India's highest civilian honour. Through her music and humanitarian work, she inspired millions across the world and became an enduring icon of Indian culture and values.
                </p>
                <p style={{ fontSize: '0.975rem', lineHeight: '1.7', color: '#334155', marginBottom: '16px' }}>
                  Inspired by her extraordinary legacy, RITW is committed to empowering young women with quality education, strong ethical values, leadership, innovation, and a lifelong passion for learning. Every student who walks through our campus is encouraged to pursue excellence with the same grace, determination, and compassion that defined her remarkable life.
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.65', color: '#475569', marginBottom: '12px' }}>
                  The institute is approved by <strong>AICTE</strong>, recognized by the <strong>Government of Telangana</strong>, and affiliated with <strong>JNTUH</strong>. We are proud to be <strong>NAAC 'A' grade accredited</strong>, <strong>UGC Autonomous</strong>, <strong>NBA Accredited</strong>, and <strong>NIRF-listed</strong>, reflecting our commitment to quality education.
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.65', color: '#475569', margin: 0 }}>
                  Our goal is to make learning a purposeful experience, nurturing independence, discipline, critical thinking, and creativity. We offer an inclusive and diverse academic environment where students are empowered to become future-ready professionals and socially conscious leaders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Logo | Flag | Color | Theme */}
      <section className="fui-section fui-section-alt" id="logo-theme">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Visual Identity</span>
            <h2 className="fui-section-title">Logo | Flag | Color | Theme</h2>
            <p className="fui-section-subtitle">The official iconography and chromatic symbolism of Rishi MS Institute of Engineering and Technology for Women.</p>
          </div>

          <div className="row g-4 align-items-center mb-4">
            <div className="col-lg-6 text-center">
              <div className="fui-card" style={{ padding: '24px' }}>
                <img src="/images/HD LOGO-Green-Blue.png" alt="RITW Logo" style={{ maxHeight: '180px', width: 'auto', objectFit: 'contain', margin: '0 auto', display: 'block' }} />
                <div style={{ fontWeight: 700, color: '#0b2545', fontSize: '1rem', marginTop: '14px' }}>Official Institutional Logo</div>
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Woman rising gracefully from the pages of an open book</div>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="fui-card" style={{ padding: '24px' }}>
                <img src="/images/RISHI-MS_navy-blue-flag.png" alt="RITW Flag" style={{ maxHeight: '180px', width: 'auto', objectFit: 'contain', margin: '0 auto', display: 'block' }} />
                <div style={{ fontWeight: 700, color: '#0b2545', fontSize: '1rem', marginTop: '14px' }}>Official Institutional Flag</div>
                <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Navy Blue and Emerald Standard of RITW</div>
              </div>
            </div>
          </div>

          <div className="fui-card">
            <h3 className="fui-card-title"><i className="fas fa-feather-alt" style={{ color: '#0d8a50' }}></i> Logo Description &amp; Symbolism</h3>
            <p className="fui-card-body" style={{ fontSize: '1rem', lineHeight: '1.75' }}>
              The logo of <strong>Rishi MS Institute of Engineering and Technology for Women (RITW)</strong> is a visual expression of education as the foundation of women's empowerment. It portrays a woman rising gracefully from the pages of an open book, symbolizing knowledge as the force that uplifts and transforms. The flowing lines reflect growth, confidence, and determination, while the book represents the institute's strong academic base and commitment to learning.
            </p>
            <p className="fui-card-body" style={{ fontSize: '1rem', lineHeight: '1.75', marginTop: '10px' }}>
              Shades of purple and gold are used to signify wisdom, dignity, and excellence. Drawing inspiration from the ideals of <strong>Bharat Ratna M.S. Subbulakshmi Garu</strong>, the design mirrors RITW's vision of shaping women who combine intellect with integrity, and who lead with both courage and compassion in every sphere of life.
            </p>
          </div>
        </div>
      </section>

      {/* 6. About Rishi Group */}
      <section className="fui-section" id="rishi-group">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Sponsoring Trust</span>
            <h2 className="fui-section-title">About Rishi College Group of Institutions</h2>
            <p className="fui-section-subtitle">Rishi Group of Colleges – Empowering Future Women Leaders under Rishi UBR Educational Society (Est. 1990).</p>
          </div>

          <div className="fui-grid-2">
            <div className="fui-card">
              <h3 className="fui-card-title"><i className="fas fa-university" style={{ color: '#0d8a50' }}></i> A Beacon of Women's Education</h3>
              <p className="fui-card-body">
                <strong>Rishi MS Institute of Engineering and Technology for Women (RITW)</strong> stands as a beacon of excellence in women's education in the fields of engineering and technology. Established in 2009, RITW is a premier institution located in the lush green campus of 5.2 acres, opposite JNTU in Hyderabad, Telangana. The college, an integral part of the <strong>Rishi UBR Educational Society</strong>, is dedicated to creating an environment where women are encouraged to excel, innovate, and lead in the world of technology.
              </p>
            </div>

            <div className="fui-card">
              <h3 className="fui-card-title"><i className="fas fa-history" style={{ color: '#0b2545' }}></i> A Legacy of Excellence (Since 1990)</h3>
              <p className="fui-card-body">
                The foundation of the <strong>Rishi UBR Educational Society</strong> was laid in 1990 with the aim of empowering women through education. The society's journey began with the establishment of the <strong>Rishi UBR Degree College for Women in 1991</strong>, in memory of the revered <strong>Late Sri U.B. Raghavendra Rao Garu</strong>, a retired IAS officer and former Secretary to the Chief Minister of Andhra Pradesh.
              </p>
              <p className="fui-card-body" style={{ marginTop: '10px' }}>
                Over the years, the society expanded into technical education with the establishment of RITW in 2009. Approved by AICTE and affiliated with JNTUH, RITW has made a significant mark in women's engineering education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Vision, Mission & Quality Policy */}
      <section className="fui-section fui-section-alt" id="vision-mission">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Core Ideals</span>
            <h2 className="fui-section-title">Vision, Mission &amp; Quality Policy</h2>
            <p className="fui-section-subtitle">Exact official statements guiding pedagogical governance and student development at RITW.</p>
          </div>

          <div className="fui-grid-3">
            <div className="fui-card fui-card-emerald-accent">
              <div className="fui-card-title">
                <span className="fui-card-icon"><i className="fas fa-eye"></i></span>
                VISION
              </div>
              <div className="fui-card-body" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                "To be a center of excellence in producing women engineers and scientists who are professionally competent social leaders to face multi disciplinary global environment by imparting quality technical education, values and ethics through innovation methods of teaching and learning."
              </div>
            </div>

            <div className="fui-card fui-card-navy-accent">
              <div className="fui-card-title">
                <span className="fui-card-icon fui-card-icon-navy"><i className="fas fa-rocket"></i></span>
                MISSION
              </div>
              <div className="fui-card-body">
                <ul style={{ paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <li>To promote women technocrats capable enough to resolve the problems faced by the society using the knowledge imparted.</li>
                  <li>To prepare self-reliant women engineers for technological growth of the nation and society by laying strong theoretical foundation accompanied by wide practical training.</li>
                  <li>To equip the young women with creative thinking capabilities and empowering them towards innovation.</li>
                </ul>
              </div>
            </div>

            <div className="fui-card fui-card-emerald-accent">
              <div className="fui-card-title">
                <span className="fui-card-icon"><i className="fas fa-medal"></i></span>
                Quality Policy
              </div>
              <div className="fui-card-body">
                <ul style={{ paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <li>To continuously strive for excellence in education by adopting innovative pedagogical tools to constantly foster development of the institution by updating the resources of the institution.</li>
                  <li>To build partnerships with industry and other organizations to empower the students.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Objectives & Aspirations */}
      <section className="fui-section" id="objectives">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Strategic Direction</span>
            <h2 className="fui-section-title">Institutional Objectives</h2>
            <p className="fui-section-subtitle">Prescribed educational objectives delivering student-centred curricula and industry partnerships.</p>
          </div>

          <div className="fui-card mb-5">
            <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem', lineHeight: '1.7', color: '#1e293b' }}>
              <li>To deliver high‑calibre technical education to every student admitted at RITW, nurturing a smart campus culture, innovation, and holistic growth.</li>
              <li>To design and maintain student‑centred curricula that ensure every graduate emerges not only with technical competence, but also leadership, communication, business awareness, teamwork, and a deep sense of social accountability.</li>
              <li>To enhance our teaching‑learning environment through skilled faculty, state‑of‑the‑art labs, and immersive hands‑on work—raising campus placement rates and strengthening partnerships with industry and research organizations.</li>
              <li>To promote intellectual growth, critical thinking, and a research mindset among faculty and students, encouraging publications, patents, and collaborative projects.</li>
              <li>To uphold high standards of governance, transparent processes, and sustainable campus practices, fostering an inclusive community dedicated to nation‑building.</li>
            </ul>
          </div>

          <div id="aspirations">
            <div className="fui-section-header">
              <span className="fui-section-badge">Future Horizons</span>
              <h2 className="fui-section-title">Aspirations</h2>
              <p className="fui-section-subtitle">Long-term vision for technical accreditation, funded research, and global competitiveness.</p>
            </div>
            <div className="fui-grid-2">
              <div className="fui-card">
                <h4 className="fui-card-title"><i className="fas fa-stamp" style={{ color: '#0d8a50' }}></i> Program Accreditations</h4>
                <p className="fui-card-body">
                  To uphold and build upon our existing recognitions — NAAC accreditation and NIRF listing — by securing NBA accreditation for all qualifying engineering programs, aligning RITW with the highest technical education standards.
                </p>
              </div>
              <div className="fui-card">
                <h4 className="fui-card-title"><i className="fas fa-flask" style={{ color: '#0b2545' }}></i> Research &amp; Industry Ecosystem</h4>
                <p className="fui-card-body">
                  To grow a robust research ecosystem through more funded projects, patents, and publications, and by partnering with R&amp;D and industry organizations to address real‑life engineering challenges.
                </p>
              </div>
              <div className="fui-card">
                <h4 className="fui-card-title"><i className="fas fa-building" style={{ color: '#0d8a50' }}></i> Infrastructure Modernization</h4>
                <p className="fui-card-body">
                  To upgrade infrastructure—including labs, equipment, and technological tools—to support hands‑on, interdisciplinary learning and industry‑relevant training.
                </p>
              </div>
              <div className="fui-card">
                <h4 className="fui-card-title"><i className="fas fa-globe" style={{ color: '#0b2545' }}></i> Global Placement &amp; Innovation</h4>
                <p className="fui-card-body">
                  To build a global network of partners, industry leaders, and alumni, fostering opportunities for international exposure, innovation, and career success for all our students.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Institution Development Plan */}
      <section className="fui-section fui-section-alt" id="idp">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Strategic Masterplan</span>
            <h2 className="fui-section-title">Institution Development Plan (IDP)</h2>
            <p className="fui-section-subtitle">Roadmap for academic excellence, infrastructure growth, research initiatives, and holistic student development.</p>
          </div>

          <div className="fui-card">
            <p className="fui-card-body" style={{ fontSize: '1rem', lineHeight: '1.75', color: '#1e293b' }}>
              The <strong>Institution Development Plan (IDP)</strong> of Rishi MS Institute of Engineering &amp; Technology for Women (RITW) outlines the strategic roadmap for academic excellence, infrastructure growth, research initiatives, and holistic student development. It reflects our commitment to quality technical education aligned with AICTE, JNTU-H, and UGC guidelines, while fostering innovation, entrepreneurship, and community engagement among women engineers.
            </p>
            <p className="fui-card-body" style={{ fontSize: '1rem', lineHeight: '1.75', color: '#1e293b', marginTop: '10px' }}>
              The IDP serves as a guiding framework to enhance institutional capabilities, strengthen industry partnerships, and empower students to thrive in a competitive global landscape.
            </p>
            <div className="mt-4">
              <a href="/PDFs/RITW IDP.pdf" target="_blank" rel="noopener noreferrer" className="fui-btn fui-btn-emerald">
                <i className="fas fa-file-pdf"></i> Download IDP (PDF) [211 KB]
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Leadership Desks */}
      <section className="fui-section" id="leadership">
        <div className="fui-container">
          <div className="fui-section-header text-center">
            <span className="fui-section-badge">Leadership &amp; Administration</span>
            <h2 className="fui-section-title">Leadership Desk</h2>
            <p className="fui-section-subtitle">Executive leadership guiding academic direction, institutional growth, research, and women empowerment.</p>
          </div>

          {/* Chairman */}
          <div className="fui-card mb-4" id="chairman" style={{ padding: '32px' }}>
            <div className="row align-items-start">
              <div className="col-lg-3 text-center mb-4 mb-lg-0">
                <div className="fui-portrait-frame" style={{ maxWidth: '200px' }}>
                  <img src="/images/Dr JEELANI.png" alt="Prof. Dr. S. Jeelani" className="fui-portrait-img" />
                </div>
                <h4 style={{ color: '#0b2545', fontSize: '1.15rem', fontWeight: 800, marginTop: '14px', marginBottom: '2px' }}>Prof. Dr. S. Jeelani</h4>
                <div style={{ color: '#0d8a50', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Chairman, RITW</div>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>M.Sc., Ph.D., MBA</div>
              </div>
              <div className="col-lg-9">
                <h3 style={{ color: '#0b2545', fontSize: '1.35rem', fontWeight: 800, marginBottom: '12px' }}>Chairman's Desk</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#334155' }}>
                  <strong>Prof. Dr. S. Jeelani</strong> is a distinguished academician with over <strong>35 years of experience</strong> in teaching, research, and academic administration. He currently serves as the <strong>Professor cum Director at the Centre for Distance &amp; Virtual Learning, University of Hyderabad</strong>. His illustrious career spans roles such as <strong>Vice Chancellor of ICFAI University Raipur</strong>, <strong>Scientist at ISRO</strong>, and <strong>Controller of Examinations at MANUU</strong>. He has published <strong>70+ research papers</strong>, authored <strong>10 books</strong>, and delivered <strong>900+ guest lectures</strong>. Prof. Jeelani also holds three patents and has been part of several high-power committees and advisory boards at state and national levels.
                </p>

                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                      <strong style={{ color: '#0b2545', fontSize: '0.875rem', display: 'block', marginBottom: '6px' }}><i className="fas fa-briefcase" style={{ color: '#0d8a50' }}></i> Key Experience Highlights:</strong>
                      <ul style={{ fontSize: '0.825rem', color: '#475569', paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>Professor cum Director: CDVL, University of Hyderabad (2009 – Present)</li>
                        <li>Vice Chancellor (2018): ICFAI University Raipur, appointed by Governor of Chhattisgarh</li>
                        <li>Controller of Examinations: Maulana Azad National Urdu University (2007–2009)</li>
                        <li>Regional Head, UGC: Regional Office, Hyderabad (2003–2007)</li>
                        <li>Scientist NRSA (ISRO): Worked on 8 major ISRO remote sensing projects</li>
                        <li>Three research patents registered in soil detection and pharmacy sensors</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                      <strong style={{ color: '#0b2545', fontSize: '0.875rem', display: 'block', marginBottom: '6px' }}><i className="fas fa-medal" style={{ color: '#b45309' }}></i> Awards &amp; Honours:</strong>
                      <ul style={{ fontSize: '0.825rem', color: '#475569', paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>Fellow Member of Eudoxia Research University (New York, USA)</li>
                        <li>Awarded "Citation of Honour" by AP Skill Development Council</li>
                        <li>Best Citizens Award by International Society, New Delhi (2010)</li>
                        <li>Best Research Paper Award: Indian Botanical Conference (1987)</li>
                        <li>Research Associateship &amp; Pool Scientist Award from CSIR, New Delhi</li>
                        <li>Best Educationist Award from Montessori Educational Trust</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secretary */}
          <div className="fui-card mb-4" id="secretary" style={{ padding: '32px' }}>
            <div className="row align-items-start">
              <div className="col-lg-3 text-center mb-4 mb-lg-0">
                <div className="fui-portrait-frame" style={{ maxWidth: '200px' }}>
                  <img src="/images/Ms .Jayasree - SECRETARY - RITW.png" alt="Ms. Rajasree" className="fui-portrait-img" />
                </div>
                <h4 style={{ color: '#0b2545', fontSize: '1.15rem', fontWeight: 800, marginTop: '14px', marginBottom: '2px' }}>Ms. Rajasree</h4>
                <div style={{ color: '#0d8a50', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Founder Secretary, RITW</div>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Rishi Group of Institutions</div>
              </div>
              <div className="col-lg-9">
                <h3 style={{ color: '#0b2545', fontSize: '1.35rem', fontWeight: 800, marginBottom: '12px' }}>Secretary's Desk</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#334155' }}>
                  "It gives me great pride and satisfaction to be part of an institution that was founded with a strong vision — to empower women through quality education. At Rishi MS Institute of Engineering and Technology for Women, our mission goes beyond academics; we are committed to shaping young women into confident, capable professionals who can contribute meaningfully to society. With over <strong>35 years of administrative experience in the field of education</strong>, my journey began with managing two schools at the BHEL campus for over a decade. Since then, I have had the privilege of playing a key role in establishing and running degree, postgraduate, and technical institutions under the Rishi UBR Educational Society."
                </p>

                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                      <strong style={{ color: '#0b2545', fontSize: '0.875rem', display: 'block', marginBottom: '6px' }}><i className="fas fa-hand-holding-heart" style={{ color: '#0d8a50' }}></i> Social &amp; Cultural Leadership:</strong>
                      <ul style={{ fontSize: '0.825rem', color: '#475569', paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>Member of SAPNET and STSNET, contributing to programming for MANA-TV</li>
                        <li>Former Member of Bharatiya Vidya Bhavan School Committee (Jubilee Hills, 10+ yrs)</li>
                        <li>Member of Jiddu Krishnamurti Centre and Vice President of Shirdi Sai Baba Temple</li>
                        <li>Supporter and contributor to orphanages and welfare initiatives in Hyderabad</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                      <strong style={{ color: '#0b2545', fontSize: '0.875rem', display: 'block', marginBottom: '6px' }}><i className="fas fa-award" style={{ color: '#b45309' }}></i> Awards &amp; Recognitions:</strong>
                      <ul style={{ fontSize: '0.825rem', color: '#475569', paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>Vikas Ratan Gold Medal Award by International Integration and Growth Society</li>
                        <li>Bharatiya Naari Award for exemplary service to society (2021–22)</li>
                        <li>Recognized among India's 20 Pragmatic Women Leaders in Education by Academic Insights</li>
                        <li>Lifetime Achievement Award in Education by Bharat Excellence Awards (2022)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Director */}
          <div className="fui-card mb-4" id="director" style={{ padding: '32px' }}>
            <div className="row align-items-start">
              <div className="col-lg-3 text-center mb-4 mb-lg-0">
                <div className="fui-portrait-frame" style={{ maxWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', background: '#eef4fb' }}>
                  <i className="fas fa-user-tie" style={{ fontSize: '3.5rem', color: '#0b2545' }}></i>
                </div>
                <h4 style={{ color: '#0b2545', fontSize: '1.15rem', fontWeight: 800, marginTop: '14px', marginBottom: '2px' }}>Mrs. J. Madhavi Latha</h4>
                <div style={{ color: '#0d8a50', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Academic Director, RITW</div>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Rishi Group of Institutions</div>
              </div>
              <div className="col-lg-9">
                <h3 style={{ color: '#0b2545', fontSize: '1.35rem', fontWeight: 800, marginBottom: '12px' }}>Director's Desk</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#334155' }}>
                  <strong>Mrs. J. Madhavi Latha</strong> serves as the Academic Director of Rishi Group of Institutions, providing strategic academic leadership across all educational units. With an illustrious career spanning over <strong>33 years in higher education</strong>, she has been a driving force behind the institution's growth, academic strength, and commitment to women empowerment through engineering and technology.
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#334155' }}>
                  As Academic Director, Mrs. Madhavi Latha oversees academic policies, curriculum development, quality assurance, research initiatives, and industry collaborations. A notable achievement is the successful collaboration with <strong>T-HUB</strong> and <strong>Ground-Up Vikas</strong> through the <strong>"Startup Ayudh"</strong> program, bringing innovation platforms directly to students and ensuring young women gain exposure to entrepreneurship and idea incubation.
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#334155' }}>
                  Her dedication has earned her significant national recognition, including the <strong>Vidya Ratna Award</strong> from the Bharath Education Excellence Awards. A strong advocate for future-focused learning, she collaborates actively with AICTE, industry partners, and innovation-driven organisations to strengthen academic standards.
                </p>
              </div>
            </div>
          </div>

          {/* Principal */}
          <div className="fui-card" id="principal" style={{ padding: '32px' }}>
            <div className="row align-items-start">
              <div className="col-lg-3 text-center mb-4 mb-lg-0">
                <div className="fui-portrait-frame" style={{ maxWidth: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', background: '#ecfdf5' }}>
                  <i className="fas fa-user-graduate" style={{ fontSize: '3.5rem', color: '#0d8a50' }}></i>
                </div>
                <h4 style={{ color: '#0b2545', fontSize: '1.15rem', fontWeight: 800, marginTop: '14px', marginBottom: '2px' }}>Dr. SK Altaf Hussain Basha</h4>
                <div style={{ color: '#0d8a50', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Principal &amp; Professor</div>
                <div style={{ color: '#64748b', fontSize: '0.775rem' }}>M.Tech (CSE), Ph.D (CSE), Post-Doc (SIT, Singapore)<br />FIETE, AMIEI, LMCSI</div>
              </div>
              <div className="col-lg-9">
                <h3 style={{ color: '#0b2545', fontSize: '1.35rem', fontWeight: 800, marginBottom: '12px' }}>Principal's Desk</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#334155' }}>
                  <strong>Dr. SK Altaf Hussain Basha</strong>, currently working as Principal and Professor of Computer Science and Engineering at Rishi MS Institute of Engineering &amp; Technology for Women, completed his Ph.D. in CSE from Acharya Nagarjuna University, Guntur. He obtained his M.Tech from JNTU Hyderabad and completed a <strong>Post-Doctoral Research Fellowship from Singapore Institute of Technology (SIT), Singapore</strong>.
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#334155' }}>
                  With <strong>26 years of teaching experience</strong> and one year of industry experience, he has authored more than <strong>82 publications</strong> in reputed international and national journals, completed a UGC Minor Research Project, and holds 84 Google Scholar citations. He has published <strong>12 textbooks</strong>, <strong>16 book chapters</strong>, and holds <strong>14 patents</strong>.
                </p>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#334155' }}>
                  Dr. Basha is an active member of professional bodies including CSI, IFERP, IEI, IETE, IACSIT, CSTA, FSF, IAENG, EAI, SDIWC, TERA, and IEEE. His research interests encompass Data Mining, Artificial Intelligence, Data Science, Machine Learning, Neural Networks, and DBMS. Under his leadership, the institution continues to advance in curriculum innovation, faculty development, and student engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Governing Council */}
      <section className="fui-section fui-section-alt" id="governing-council">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Apex Authority</span>
            <h2 className="fui-section-title">Governing Council</h2>
            <p className="fui-section-subtitle">Official statutory Governing Council constituted as per UGC Autonomous and State Government mandates.</p>
          </div>

          <div className="fui-table-container">
            <table className="fui-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>S.No</th>
                  <th>Member Name</th>
                  <th>Designation &amp; Role in Council</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td><strong>Dr. S. Jeelani</strong></td><td>Chairman</td><td><span className="fui-badge fui-badge-navy">Academic Member</span></td></tr>
                <tr><td>2</td><td><strong>Ms. M. Rajasree</strong></td><td>Secretary</td><td><span className="fui-badge fui-badge-navy">Academic Member</span></td></tr>
                <tr><td>3</td><td><strong>Mrs. J. Madhavi Latha</strong></td><td>Director Member</td><td><span className="fui-badge fui-badge-navy">Academic Member</span></td></tr>
                <tr><td>4</td><td><strong>Mrs. Manjeera</strong></td><td>Member</td><td><span className="fui-badge fui-badge-navy">Academic Member</span></td></tr>
                <tr><td>5</td><td><strong>Mr. L. K. Reddy</strong></td><td>Member</td><td><span className="fui-badge fui-badge-navy">Academic Member</span></td></tr>
                <tr><td>6</td><td><strong>Dr. Rammurthy</strong></td><td>OU Member</td><td><span className="fui-badge fui-badge-navy">University Academician</span></td></tr>
                <tr><td>7</td><td><strong>Mr. L. Madhu Sekhar</strong></td><td>Member</td><td><span className="fui-badge fui-badge-navy">Academic Member</span></td></tr>
                <tr><td>8</td><td><strong>Mr. Gunti Vijay</strong></td><td>Member</td><td><span className="fui-badge fui-badge-navy">Academic Member</span></td></tr>
                <tr><td>9</td><td><strong>Dr. Archana Patil</strong></td><td>Member</td><td><span className="fui-badge fui-badge-navy">Academic Member</span></td></tr>
                <tr><td>10</td><td><strong>Dr. Y. Venkata Laxmi</strong></td><td>Member</td><td><span className="fui-badge fui-badge-navy">Academic Member</span></td></tr>
                <tr><td>11</td><td><strong>Mrs. K. Laxmi Tulasi</strong></td><td>Member</td><td><span className="fui-badge fui-badge-navy">Academic Member</span></td></tr>
                <tr><td>12</td><td><strong>Dr. SK Altaf Hussain Basha</strong></td><td>Member Secretary &bull; Principal</td><td><span className="fui-badge fui-badge-emerald">Member Secretary</span></td></tr>
                <tr style={{ background: '#f1f5f9' }}><td colSpan={4}><strong>Statutory Nominees</strong></td></tr>
                <tr><td>13</td><td><strong>Shri Giri Babu</strong></td><td>State Nominee</td><td><span className="fui-badge fui-badge-gold">Government of Telangana</span></td></tr>
                <tr><td>14</td><td><strong>Dr. K. Vijaya Kumar Reddy</strong></td><td>JNTUH Nominee</td><td><span className="fui-badge fui-badge-gold">Affiliating University</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 12. Organisation Workflow */}
      <section className="fui-section" id="workflow">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Institutional Architecture</span>
            <h2 className="fui-section-title">Organisation Workflow</h2>
            <p className="fui-section-subtitle">Official organizational flow chart detailing administrative, academic, and operational reporting lines.</p>
          </div>

          <div className="fui-card text-center" style={{ padding: '30px' }}>
            <img src="/images/RISHI MS - Organizational Flow Chart.png" alt="RISHI MS Organizational Flow Chart" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(11,37,69,0.06)' }} />
          </div>
        </div>
      </section>

      {/* 13. Academic Advisory Board */}
      <section className="fui-section fui-section-alt" id="academic-board">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Academic Direction</span>
            <h2 className="fui-section-title">Academic Advisory Board</h2>
            <p className="fui-section-subtitle">Official Advisory Board guiding curricular standards, educational policy, and interdisciplinary development.</p>
          </div>

          <div className="fui-table-container">
            <table className="fui-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>S.No</th>
                  <th>Member Name</th>
                  <th>Designation &amp; Department</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td><strong>Dr. RAMA NAGA KIRAN KUMAR KARASALA</strong></td><td>PROFESSOR &amp; PRINCIPAL, CSE</td></tr>
                <tr><td>2</td><td><strong>Dr. SK ALTAF HUSSAIN BASHA</strong></td><td>ASSOCIATE PROFESSOR, CSE</td></tr>
                <tr><td>3</td><td><strong>Dr. KANDUNURI RAMA KRISHNA</strong></td><td>ASSOCIATE PROFESSOR, IT</td></tr>
                <tr><td>4</td><td><strong>Dr. ANURADHA GUPTA</strong></td><td>ASSOCIATE PROFESSOR, PHYSICS</td></tr>
                <tr><td>5</td><td><strong>Dr. ARCHANA BABURAO PATIL</strong></td><td>ASSISTANT PROFESSOR, CSE</td></tr>
                <tr><td>6</td><td><strong>Dr. D. LAKSHMI NARAYANA</strong></td><td>ASSISTANT PROFESSOR, ECE</td></tr>
                <tr><td>7</td><td><strong>Dr. VENKATA LAKSHMI YEDIDA</strong></td><td>ASSISTANT PROFESSOR, ECE</td></tr>
                <tr><td>8</td><td><strong>Dr. ASMA FATIMA</strong></td><td>ASSISTANT PROFESSOR, PHYSICS</td></tr>
                <tr><td>9</td><td><strong>Dr. PANDEY SHRADDHA</strong></td><td>ASSISTANT PROFESSOR, CHEMISTRY</td></tr>
                <tr><td>10</td><td><strong>Dr. BIRAGONI GOUD RADHIKA</strong></td><td>ASSISTANT PROFESSOR, MATHEMATICS</td></tr>
                <tr><td>11</td><td><strong>Dr. CHETHARASI SRAVANTHI</strong></td><td>ASSISTANT PROFESSOR, ENGLISH</td></tr>
                <tr><td>12</td><td><strong>Dr. GAJJALA SRINIVAS KUMAR</strong></td><td>ASSISTANT PROFESSOR, MECH – H&amp;S</td></tr>
                <tr><td>13</td><td><strong>Dr. V. V. SATYAVATHI YEDIDA</strong></td><td>ASSISTANT PROFESSOR, MECH – H&amp;S</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 14. NAAC Certificate & Grade Sheet */}
      <section className="fui-section" id="naac">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Quality Certification</span>
            <h2 className="fui-section-title">NAAC Certificate &amp; Institutional Grade Sheet</h2>
            <p className="fui-section-subtitle">Accredited by the National Assessment and Accreditation Council (NAAC) with prestigious 'A' Grade.</p>
          </div>

          <div className="fui-card" style={{ padding: '32px' }}>
            <p className="fui-card-body" style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
              Rishi M.S Institute of Engineering and Technology for Women is proudly accredited by the <strong>National Assessment and Accreditation Council (NAAC)</strong>, recognizing our commitment to academic excellence, quality education, and institutional integrity.
            </p>

            <div className="row align-items-center g-4">
              <div className="col-lg-6 text-center">
                <img src="/images/NAAC_Certificate_Rishi_MS_Institute_of_Engineering_and_Technology_for_Women.webp" alt="NAAC Accreditation Certificate" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 6px 20px -2px rgba(11,37,69,0.1)' }} />
              </div>
              <div className="col-lg-6">
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                  <h4 style={{ color: '#0b2545', fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px' }}><i className="fas fa-file-pdf" style={{ color: '#dc2626', marginRight: '8px' }}></i> Official Grade Sheet</h4>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', marginBottom: '18px' }}>
                    Download the official NAAC Institutional Grade Sheet Cycle-1 detailing criteria-wise CGPA score (3.12/4.0) awarded by NAAC peer committee.
                  </p>
                  <a href="/PDFs/Institutional_Grade_NAAC_A_Sheet.pdf" target="_blank" rel="noopener noreferrer" className="fui-btn fui-btn-primary">
                    <i className="fas fa-download"></i> View NAAC Grade Sheet (PDF) [502 KB]
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15. Audit Statements */}
      <section className="fui-section fui-section-alt" id="audit">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Financial Accountability</span>
            <h2 className="fui-section-title">Audit Statements</h2>
            <p className="fui-section-subtitle">Annual Audit Statements prepared by certified statutory auditors in accordance with regulatory requirements.</p>
          </div>

          <div className="fui-card mb-4">
            <p className="fui-card-body" style={{ fontSize: '1rem', lineHeight: '1.75', color: '#1e293b', margin: 0 }}>
              As part of our commitment to financial transparency and accountability, <strong>Rishi MS Institute of Engineering &amp; Technology for Women (RITW)</strong> publishes its Annual Audit Statements prepared by certified auditors in accordance with applicable accounting standards and regulatory requirements. These statements provide a clear picture of the institution's financial health, income, expenditure, and asset utilisation — accessible to students, parents, and stakeholders.
            </p>
          </div>

          <div className="fui-grid-4">
            <a href="/Statements/2024-2025.pdf" target="_blank" rel="noopener noreferrer" className="fui-doc-card">
              <div className="fui-doc-left">
                <div className="fui-doc-icon"><i className="fas fa-file-pdf"></i></div>
                <div>
                  <div className="fui-doc-title">Audit Statement 2024-25</div>
                  <div className="fui-doc-meta">Full Certified Balance Sheet</div>
                </div>
              </div>
              <span className="fui-doc-btn">Download <i className="fas fa-download"></i></span>
            </a>

            <a href="/Statements/2023-2024.pdf" target="_blank" rel="noopener noreferrer" className="fui-doc-card">
              <div className="fui-doc-left">
                <div className="fui-doc-icon"><i className="fas fa-file-pdf"></i></div>
                <div>
                  <div className="fui-doc-title">Audit Statement 2023-24</div>
                  <div className="fui-doc-meta">Full Certified Balance Sheet</div>
                </div>
              </div>
              <span className="fui-doc-btn">Download <i className="fas fa-download"></i></span>
            </a>

            <a href="/Statements/2022-2023.pdf" target="_blank" rel="noopener noreferrer" className="fui-doc-card">
              <div className="fui-doc-left">
                <div className="fui-doc-icon"><i className="fas fa-file-pdf"></i></div>
                <div>
                  <div className="fui-doc-title">Audit Statement 2022-23</div>
                  <div className="fui-doc-meta">Full Certified Balance Sheet</div>
                </div>
              </div>
              <span className="fui-doc-btn">Download <i className="fas fa-download"></i></span>
            </a>

            <a href="/Statements/2021-2022.pdf" target="_blank" rel="noopener noreferrer" className="fui-doc-card">
              <div className="fui-doc-left">
                <div className="fui-doc-icon"><i className="fas fa-file-pdf"></i></div>
                <div>
                  <div className="fui-doc-title">Audit Statement 2021-22</div>
                  <div className="fui-doc-meta">Full Certified Balance Sheet</div>
                </div>
              </div>
              <span className="fui-doc-btn">Download <i className="fas fa-download"></i></span>
            </a>
          </div>
        </div>
      </section>

      {/* 16. Ombudsperson */}
      <section className="fui-section" id="ombudsperson">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Grievance Mechanism</span>
            <h2 className="fui-section-title">University Ombudsperson</h2>
            <p className="fui-section-subtitle">Independent Ombudsperson appointed pursuant to AICTE Redressal of Grievance of Students Regulations.</p>
          </div>

          <div className="fui-card" style={{ padding: '32px' }}>
            <div className="row align-items-center">
              <div className="col-lg-3 text-center mb-4 mb-lg-0">
                <div className="fui-portrait-frame" style={{ maxWidth: '180px' }}>
                  <img src="/images/Dr.R.Sayanna.png" alt="Dr. R. Sayanna" className="fui-portrait-img" />
                </div>
              </div>
              <div className="col-lg-9">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d8a50', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>University Ombudsperson</div>
                <h3 style={{ color: '#0b2545', fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Dr. R. Sayanna</h3>
                <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', marginBottom: '8px' }}>
                  <strong>Former Vice-Chancellor</strong>, Kakatiya University, Warangal, Telangana State<br />
                  <strong>Former Professor &amp; Head</strong>, Department of Physics, Osmania University, Hyderabad
                </p>
                <div style={{ marginTop: '14px' }}>
                  <a href="mailto:ombudsperson@jntuh.ac.in" className="fui-btn fui-btn-primary" style={{ fontSize: '0.875rem' }}>
                    <i className="fas fa-envelope"></i> Contact: ombudsperson@jntuh.ac.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 17. Why Choose RITW? */}
      <section className="fui-section fui-section-alt" id="why-choose">
        <div className="fui-container">
          <div className="fui-section-header text-center">
            <span className="fui-section-badge">Distinctive Edge</span>
            <h2 className="fui-section-title">Why Choose RITW?</h2>
            <p className="fui-section-subtitle">Dedicated to moulding independent, creative, and socially conscious women technology leaders.</p>
          </div>

          <div className="fui-card" style={{ padding: '32px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '1rem', color: '#1e293b' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <i className="fas fa-check-circle" style={{ color: '#0d8a50', fontSize: '1.25rem', marginTop: '2px' }}></i>
                <span><strong>Women-centric institution</strong> committed to technical excellence and empowerment</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <i className="fas fa-check-circle" style={{ color: '#0d8a50', fontSize: '1.25rem', marginTop: '2px' }}></i>
                <span><strong>Legacy of quality education</strong> under the Rishi UBR Educational Society</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <i className="fas fa-check-circle" style={{ color: '#0d8a50', fontSize: '1.25rem', marginTop: '2px' }}></i>
                <span>Accredited with <strong>NAAC 'A' grade</strong>, <strong>UGC Autonomous</strong>, <strong>NBA Accredited</strong> and listed under <strong>NIRF</strong></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <i className="fas fa-check-circle" style={{ color: '#0d8a50', fontSize: '1.25rem', marginTop: '2px' }}></i>
                <span><strong>Strategic location opposite JNTU-Hyderabad</strong> for academic collaboration and convenience</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <i className="fas fa-check-circle" style={{ color: '#0d8a50', fontSize: '1.25rem', marginTop: '2px' }}></i>
                <span>Focus on <strong>academic excellence, personal growth, and leadership development</strong></span>
              </li>
            </ul>
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <p style={{ fontSize: '1rem', lineHeight: '1.75', color: '#334155', margin: 0 }}>
                At RITW, we believe education should not only equip students with knowledge, but also with the confidence, independence, and creativity to thrive in the real world. Our graduates emerge as competent professionals and responsible leaders who contribute meaningfully to society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 18. Contact Directory */}
      <section className="fui-section" id="contact-directory">
        <div className="fui-container">
          <div className="fui-section-header">
            <span className="fui-section-badge">Reach Out</span>
            <h2 className="fui-section-title">Important Contacts &amp; Emails</h2>
            <p className="fui-section-subtitle">Official direct helplines and department communication channels at RITW.</p>
          </div>

          <div className="fui-grid-2">
            <div className="fui-card">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0b2545', marginBottom: '14px' }}><i className="fas fa-phone" style={{ color: '#0d8a50', marginRight: '8px' }}></i> Important Contact Numbers</h4>
              <div className="fui-table-container">
                <table className="fui-table">
                  <tbody>
                    <tr><td><strong>Enquiry</strong></td><td><a href="tel:+91-967-623-3050" style={{ color: '#0d8a50', fontWeight: 600 }}>+91-967-623-3050</a></td></tr>
                    <tr><td><strong>Admissions 1</strong></td><td><a href="tel:+91-967-623-3050" style={{ color: '#0d8a50', fontWeight: 600 }}>+91-967-623-3050</a></td></tr>
                    <tr><td><strong>Admissions 2</strong></td><td><a href="tel:+91-955-085-2672" style={{ color: '#0d8a50', fontWeight: 600 }}>+91-955-085-2672</a></td></tr>
                    <tr><td><strong>Placements</strong></td><td><a href="tel:+91-40-2389-2878" style={{ color: '#0d8a50', fontWeight: 600 }}>+91-40-2389-2878</a></td></tr>
                    <tr><td><strong>NSS</strong></td><td><a href="tel:+91-939-122-6038" style={{ color: '#0d8a50', fontWeight: 600 }}>+91-939-122-6038</a></td></tr>
                    <tr><td><strong>NCC</strong></td><td><a href="tel:+91-889-755-5695" style={{ color: '#0d8a50', fontWeight: 600 }}>+91-889-755-5695</a></td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="fui-card">
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0b2545', marginBottom: '14px' }}><i className="fas fa-envelope" style={{ color: '#0b2545', marginRight: '8px' }}></i> Important Email IDs</h4>
              <div className="fui-table-container">
                <table className="fui-table">
                  <tbody>
                    <tr><td><strong>CSE Dept</strong></td><td><a href="mailto:cse.hod@rishimsengg.ac.in" style={{ color: '#0b2545' }}>cse.hod@rishimsengg.ac.in</a></td></tr>
                    <tr><td><strong>IT Dept</strong></td><td><a href="mailto:it.hod@rishimsengg.ac.in" style={{ color: '#0b2545' }}>it.hod@rishimsengg.ac.in</a></td></tr>
                    <tr><td><strong>ECE Dept</strong></td><td><a href="mailto:ece.hod@rishimsengg.ac.in" style={{ color: '#0b2545' }}>ece.hod@rishimsengg.ac.in</a></td></tr>
                    <tr><td><strong>H&amp;S Dept</strong></td><td><a href="mailto:hns.hod@rishimsengg.ac.in" style={{ color: '#0b2545' }}>hns.hod@rishimsengg.ac.in</a></td></tr>
                    <tr><td><strong>Enquiry</strong></td><td><a href="mailto:info@rishimsengg.ac.in" style={{ color: '#0b2545' }}>info@rishimsengg.ac.in</a></td></tr>
                    <tr><td><strong>Director</strong></td><td><a href="mailto:director@rishimsengg.ac.in" style={{ color: '#0b2545' }}>director@rishimsengg.ac.in</a></td></tr>
                    <tr><td><strong>Principal</strong></td><td><a href="mailto:principal@rishimsengg.ac.in" style={{ color: '#0b2545' }}>principal@rishimsengg.ac.in</a></td></tr>
                    <tr><td><strong>HR Services</strong></td><td><a href="mailto:hr@rishimsengg.ac.in" style={{ color: '#0b2545' }}>hr@rishimsengg.ac.in</a></td></tr>
                    <tr><td><strong>Grievance Redressal</strong></td><td><a href="mailto:grievance@rishimsengg.ac.in" style={{ color: '#0b2545' }}>grievance@rishimsengg.ac.in</a></td></tr>
                    <tr><td><strong>Placements</strong></td><td><a href="mailto:placements@rishimsengg.ac.in" style={{ color: '#0b2545' }}>placements@rishimsengg.ac.in</a></td></tr>
                    <tr><td><strong>Placement Head</strong></td><td><a href="mailto:placements@rishi.org" style={{ color: '#0b2545' }}>placements@rishi.org</a></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
