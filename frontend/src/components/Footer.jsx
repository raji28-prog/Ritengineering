import React from 'react';
import { Link } from 'react-router-dom';
import { COLLEGE_INFO } from '../data/navigationMenu';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      {/* Top Footer Banner */}
      <div className="footer-top-strip">
        <div className="container footer-strip-inner">
          <div className="strip-item">
            <i className="fas fa-university strip-icon" aria-hidden="true"></i>
            <div>
              <span className="strip-title">UGC Autonomous Institution</span>
              <span className="strip-sub">Conferred by University Grants Commission</span>
            </div>
          </div>
          <div className="strip-item">
            <i className="fas fa-award strip-icon" aria-hidden="true"></i>
            <div>
              <span className="strip-title">NAAC 'A' Grade Accredited</span>
              <span className="strip-sub">National Assessment and Accreditation Council</span>
            </div>
          </div>
          <div className="strip-item">
            <i className="fas fa-check-circle strip-icon" aria-hidden="true"></i>
            <div>
              <span className="strip-title">NBA Accredited Programs</span>
              <span className="strip-sub">Outcome-Based Technical Excellence</span>
            </div>
          </div>
          <div className="strip-item">
            <i className="fas fa-id-card strip-icon" aria-hidden="true"></i>
            <div>
              <span className="strip-title">TG EAPCET CODE: RITW</span>
              <span className="strip-sub">Official TSCHE Counseling Code</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer Grid */}
      <div className="container footer-grid">
        {/* Col 1: Institutional Identity & About */}
        <div className="footer-col footer-col-brand">
          <div className="footer-logo-wrap">
            <img src="/images/RITW-LOGO.png" alt="RITW" className="footer-logo" />
            <div className="footer-brand-title">
              {COLLEGE_INFO.name}
            </div>
          </div>
          <p className="footer-brand-sub">
            Established under the venerable memory of Bharat Ratna (Late) Smt. M.S. Subbulakshmi, RITW empowers aspiring women engineers in Hyderabad with cutting-edge technical expertise, doctoral mentorship, and global placement careers.
          </p>
          <div className="footer-badges-wrap" aria-label="National Accreditations">
            <span className="badge-pill badge-ugc" title="UGC Autonomous Conferred Status">
              <span className="badge-dot" aria-hidden="true"></span>
              UGC Autonomous
            </span>
            <span className="badge-pill badge-naac" title="NAAC 'A' Grade Accredited">
              <span className="badge-dot" aria-hidden="true"></span>
              NAAC 'A'
            </span>
            <span className="badge-pill badge-nba" title="NBA Accredited Technical Programs">
              <span className="badge-dot" aria-hidden="true"></span>
              NBA
            </span>
            <span className="badge-pill badge-nirf" title="NIRF Ranked Institution">
              <span className="badge-dot" aria-hidden="true"></span>
              NIRF Ranked
            </span>
          </div>
          <div className="footer-social-links" aria-label="Social media channels">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-circle social-fb" aria-label="Official Facebook Page" title="Facebook">
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-circle social-ig" aria-label="Official Instagram Page" title="Instagram">
              <i className="fab fa-instagram" aria-hidden="true"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-circle social-li" aria-label="Official LinkedIn Page" title="LinkedIn">
              <i className="fab fa-linkedin-in" aria-hidden="true"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-circle social-yt" aria-label="Official YouTube Channel" title="YouTube">
              <i className="fab fa-youtube" aria-hidden="true"></i>
            </a>
            <a href="https://wa.me/919676233050" target="_blank" rel="noopener noreferrer" className="social-circle social-wa" aria-label="Official WhatsApp Helpdesk" title="WhatsApp Helpline">
              <i className="fab fa-whatsapp" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        {/* Col 2: Academic Programs */}
        <div className="footer-col">
          <div className="footer-heading">Academic Departments</div>
          <ul className="footer-links">
            <li><Link to="/departments" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> Computer Science &amp; Engg (CSE)</Link></li>
            <li><Link to="/departments#aiml" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> CSE (Artificial Intelligence &amp; ML)</Link></li>
            <li><Link to="/departments#ds" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> CSE (Data Science)</Link></li>
            <li><Link to="/departments#it" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> Information Technology (IT)</Link></li>
            <li><Link to="/departments#ece" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> Electronics &amp; Communication (ECE)</Link></li>
            <li><Link to="/admissions" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> Lateral Entry (ECET) Admissions</Link></li>
            <li><Link to="/academics#curriculum" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> Autonomous Syllabi &amp; Regulations</Link></li>
          </ul>
        </div>

        {/* Col 3: Admissions & Placements */}
        <div className="footer-col">
          <div className="footer-heading">Admissions &amp; Careers</div>
          <ul className="footer-links">
            <li><Link to="/admissions" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> Admissions 2026–27 (Code: RITW)</Link></li>
            <li><Link to="/admissions#fees" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> Fee Structure &amp; TS Epass</Link></li>
            <li><Link to="/admissions#certificates" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> Required Certificates Checklist</Link></li>
            <li><Link to="/placements" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> 100% Placement Assistance</Link></li>
            <li><Link to="/placements#recruiters" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> Top Recruiters &amp; Corporate MoUs</Link></li>
            <li><Link to="/placements#tpo" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> Training &amp; Placement Cell Desk</Link></li>
            <li><Link to="/contact" className="footer-link"><i className="fas fa-chevron-right link-dot" aria-hidden="true"></i> Book a Campus Tour</Link></li>
          </ul>
        </div>

        {/* Col 4: Statutory Committees & Mandatory Cells */}
        <div className="footer-col">
          <div className="footer-heading">Statutory &amp; Quality Cells</div>
          <ul className="footer-links">
            <li><Link to="/governance#committees" className="footer-link"><i className="fas fa-shield-alt link-dot" aria-hidden="true"></i> Anti-Ragging Committee</Link></li>
            <li><Link to="/campus-life#wec" className="footer-link"><i className="fas fa-female link-dot" aria-hidden="true"></i> Women Empowerment Cell</Link></li>
            <li><Link to="/governance#committees" className="footer-link"><i className="fas fa-balance-scale link-dot" aria-hidden="true"></i> Internal Complaints Committee</Link></li>
            <li><Link to="/examinations#forms" className="footer-link"><i className="fas fa-hands-helping link-dot" aria-hidden="true"></i> Grievance Redressal Portal</Link></li>
            <li><Link to="/governance" className="footer-link"><i className="fas fa-users-cog link-dot" aria-hidden="true"></i> Governing Body &amp; Academic Council</Link></li>
            <li><Link to="/accreditation#aicte" className="footer-link"><i className="fas fa-file-contract link-dot" aria-hidden="true"></i> AICTE Mandatory Disclosures</Link></li>
            <li><Link to="/accreditation#nirf" className="footer-link"><i className="fas fa-chart-line link-dot" aria-hidden="true"></i> NIRF &amp; IQAC Reports</Link></li>
          </ul>
        </div>

        {/* Col 5: Campus Address & Transport */}
        <div className="footer-col footer-col-contact">
          <div className="footer-heading">Campus &amp; Transport</div>
          <div className="footer-contact-item">
            <i className="fas fa-map-marker-alt footer-icon" aria-hidden="true"></i>
            <div>
              <strong>RITW Hyderabad Campus</strong><br />
              {COLLEGE_INFO.address}
            </div>
          </div>
          <div className="footer-contact-item">
            <i className="fas fa-subway footer-icon metro-icon" aria-hidden="true"></i>
            <div>
              <strong>Metro Connectivity:</strong><br />
              Directly opposite JNTU College Metro Station (Hyderabad Metro Red Line).
            </div>
          </div>
          <div className="footer-contact-item">
            <i className="fas fa-phone-alt footer-icon" aria-hidden="true"></i>
            <div>
              <strong>Helpline:</strong><br />
              <a href={`tel:${COLLEGE_INFO.phone}`} className="footer-tel-link">{COLLEGE_INFO.phone}</a> / <a href={`tel:${COLLEGE_INFO.secondaryPhone}`} className="footer-tel-link">{COLLEGE_INFO.secondaryPhone}</a>
            </div>
          </div>
          <div className="footer-contact-item">
            <i className="fas fa-envelope footer-icon" aria-hidden="true"></i>
            <div>
              <strong>Admissions Email:</strong><br />
              <a href={`mailto:${COLLEGE_INFO.admissionsEmail}`} className="footer-tel-link">{COLLEGE_INFO.admissionsEmail}</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Affiliation Strip */}
      <div className="footer-bottom-wrapper">
        <div className="container footer-bottom">
          <div className="footer-copy">
            &copy; {CURRENT_YEAR} {COLLEGE_INFO.name}. All Rights Reserved.
          </div>
          <div className="footer-legal">
            <span>UGC Autonomous Institution &bull; Approved by AICTE &bull; Affiliated to JNTUH &bull; NAAC 'A' Grade</span>
          </div>
          <div className="footer-bottom-links">
            <Link to="/about" className="footer-sub-link">About</Link>
            <span className="dot">&bull;</span>
            <Link to="/academics" className="footer-sub-link">Academics</Link>
            <span className="dot">&bull;</span>
            <Link to="/departments" className="footer-sub-link">Departments</Link>
            <span className="dot">&bull;</span>
            <Link to="/admissions" className="footer-sub-link">Admissions</Link>
            <span className="dot">&bull;</span>
            <Link to="/examinations" className="footer-sub-link">Examinations</Link>
            <span className="dot">&bull;</span>
            <Link to="/placements" className="footer-sub-link">Placements</Link>
            <span className="dot">&bull;</span>
            <Link to="/research" className="footer-sub-link">Research</Link>
            <span className="dot">&bull;</span>
            <Link to="/campus-life" className="footer-sub-link">Campus Life</Link>
            <span className="dot">&bull;</span>
            <Link to="/facilities" className="footer-sub-link">Facilities</Link>
            <span className="dot">&bull;</span>
            <Link to="/contact" className="footer-sub-link">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
