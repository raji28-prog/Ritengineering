import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COLLEGE_INFO } from '../data/navigationMenu';

export default function Topbar({ onOpenSearch }) {
  const [fontSize, setFontSize] = useState('normal');

  const adjustFontSize = (size) => {
    setFontSize(size);
    if (size === 'small') {
      document.documentElement.style.fontSize = '14px';
    } else if (size === 'large') {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  };

  return (
    <aside className="ritw-topbar" aria-label="Institutional Quick Bar">
      <div className="container-fluid ritw-topbar-container">
        <div className="ritw-topbar-inner">
          
          {/* LEFT: Stakeholder quick links (VIT Signature Pattern) + Contact Info */}
          <div className="ritw-topbar-left">
            <nav className="ritw-topbar-stakeholders" aria-label="Stakeholder Portals">
              <a href="/portal/" className="ritw-toplink" title="Student Portal Login">Students</a>
              <span className="ritw-topsep" aria-hidden="true">|</span>
              <a href="/portal/" className="ritw-toplink" title="Parent Portal Login">Parents</a>
              <span className="ritw-topsep" aria-hidden="true">|</span>
              <a href="/portal/" className="ritw-toplink" title="Faculty &amp; Staff Login">Faculty &amp; Staff</a>
              <span className="ritw-topsep" aria-hidden="true">|</span>
              <a 
                href="https://rishimsengg.ac.in/Functional Units/Alumni/Alumni Association.php" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ritw-toplink"
                title="Alumni Association Network"
              >
                Alumni
              </a>
              <span className="ritw-topsep" aria-hidden="true">|</span>
              <a 
                href="https://rishimsengg.ac.in/Careers.php" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ritw-toplink"
                title="Careers &amp; Faculty Openings"
              >
                Careers
              </a>
              <span className="ritw-topsep" aria-hidden="true">|</span>
              <Link to="/contact" className="ritw-toplink" title="Contact Us &amp; Location">Contact Us</Link>
            </nav>

            <div className="ritw-topbar-contacts">
              <a href={`mailto:${COLLEGE_INFO.email}`} className="ritw-topbar-item" title="Official Admissions Email">
                <span className="ritw-topbar-icon"><i className="fas fa-envelope" aria-hidden="true"></i></span>
                <span>{COLLEGE_INFO.email}</span>
              </a>
              <a href={`tel:${COLLEGE_INFO.phone}`} className="ritw-topbar-item" title="Admissions &amp; Campus Helpline">
                <span className="ritw-topbar-icon"><i className="fas fa-phone-alt" aria-hidden="true"></i></span>
                <span>{COLLEGE_INFO.phone}</span>
              </a>
              <span className="ritw-topbar-item ritw-topbar-addr" title="Campus Location Landmark">
                <span className="ritw-topbar-icon"><i className="fas fa-map-marker-alt" aria-hidden="true"></i></span>
                <span>{COLLEGE_INFO.address}</span>
              </span>
            </div>
          </div>

          {/* RIGHT: Accreditations, Social Links, Campus Portal, Search & Accessibility */}
          <div className="ritw-topbar-right">
            {/* Accreditation Badges */}
            <div className="ritw-topbar-badges" aria-label="National Accreditations">
              {COLLEGE_INFO.accreditations.map((acc, idx) => (
                <Link 
                  key={idx} 
                  to={acc.path || "/accreditation"} 
                  className={`ritw-tbadge ${acc.class}`} 
                  title={acc.title}
                >
                  {acc.badge}
                </Link>
              ))}
            </div>

            {/* Social Media Links */}
            <div className="ritw-topbar-social" aria-label="Official Social Media Channels">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="ritw-social-btn fb" aria-label="Facebook" title="Facebook">
                <i className="fab fa-facebook-f" aria-hidden="true"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ritw-social-btn ig" aria-label="Instagram" title="Instagram">
                <i className="fab fa-instagram" aria-hidden="true"></i>
              </a>
              <a href="https://wa.me/919676233050" target="_blank" rel="noopener noreferrer" className="ritw-social-btn wa" aria-label="WhatsApp" title="WhatsApp Admissions Helpline">
                <i className="fab fa-whatsapp" aria-hidden="true"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="ritw-social-btn yt" aria-label="YouTube" title="YouTube">
                <i className="fab fa-youtube" aria-hidden="true"></i>
              </a>
            </div>

            {/* Campus Portal Pill CTA */}
            <a href="/portal/" className="ritw-portal-pill" title="Campus Management Portal">
              <i className="fas fa-user-lock" aria-hidden="true"></i>
              <span>Campus Portal</span>
            </a>

            {/* Instant Search Trigger */}
            {onOpenSearch && (
              <button 
                type="button" 
                className="ritw-search-trigger" 
                onClick={onOpenSearch} 
                title="Search RITW (Ctrl + K)"
                aria-label="Instant Search"
              >
                <i className="fas fa-search" aria-hidden="true"></i>
              </button>
            )}

            {/* Accessibility Controls */}
            <div className="ritw-topbar-accessibility" aria-label="Text size controls">
              <button
                type="button"
                className={`btn-font-size ${fontSize === 'small' ? 'active' : ''}`}
                onClick={() => adjustFontSize('small')}
                title="Smaller font size"
                aria-label="Decrease font size"
              >
                A-
              </button>
              <button
                type="button"
                className={`btn-font-size ${fontSize === 'normal' ? 'active' : ''}`}
                onClick={() => adjustFontSize('normal')}
                title="Standard font size"
                aria-label="Default font size"
              >
                A
              </button>
              <button
                type="button"
                className={`btn-font-size ${fontSize === 'large' ? 'active' : ''}`}
                onClick={() => adjustFontSize('large')}
                title="Larger font size"
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
}
