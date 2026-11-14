import React from 'react';
import { Link } from 'react-router-dom';
import { COLLEGE_INFO } from '../data/navigationMenu';

export default function BrandHeader() {
  return (
    <header className="ritw-brand-header" role="banner">
      <div className="container-fluid ritw-brand-container">
        <div className="ritw-brand-wrap">
          
          {/* Left: University Emblem & Title Hierarchy */}
          <Link to="/" className="ritw-brand-left" aria-label="RITW Homepage">
            <img 
              src="/images/RITW-LOGO.png" 
              alt="RITW Official Crest" 
              className="ritw-brand-logo-img"
              onError={(e) => { 
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/logo/RITW-LOGO.png'; 
              }}
            />
            <div className="ritw-brand-titles">
              <h1 className="ritw-brand-title">
                RISHI M.S INSTITUTE OF ENGINEERING &amp; TECHNOLOGY FOR WOMEN
              </h1>
              <div className="ritw-brand-memory">
                <span>In memory of Bharat Ratna (Late) Smt. M.S. Subbulakshmi</span>
              </div>
              <div className="ritw-brand-sub">
                <span className="ritw-sub-badge"><i className="fas fa-check-circle" aria-hidden="true"></i> UGC Autonomous</span>
                <span className="ritw-sub-dot" aria-hidden="true">&bull;</span>
                <span>Approved by AICTE</span>
                <span className="ritw-sub-dot" aria-hidden="true">&bull;</span>
                <span>Affiliated to JNTU-H</span>
                <span className="ritw-sub-dot" aria-hidden="true">&bull;</span>
                <span className="ritw-sub-badge green"><i className="fas fa-award" aria-hidden="true"></i> NAAC 'A' Grade</span>
                <span className="ritw-sub-dot" aria-hidden="true">&bull;</span>
                <span className="ritw-sub-badge navy"><i className="fas fa-certificate" aria-hidden="true"></i> NBA Accredited</span>
              </div>
            </div>
          </Link>

          {/* Right: VIT-Style Institutional Accreditations, EAPCET Code & Action CTAs */}
          <div className="ritw-brand-right">
            
            {/* VIT-Style Prestige Ranking / Accreditation Badges */}
            <div className="ritw-prestige-badges" aria-label="University Accreditations and Rankings">
              <Link to="/accreditation#naac" className="ritw-prestige-card naac" title="National Assessment and Accreditation Council - 'A' Grade">
                <div className="ritw-prestige-card-top">NAAC</div>
                <div className="ritw-prestige-card-grade">'A' GRADE</div>
              </Link>
              <Link to="/accreditation#nba" className="ritw-prestige-card nba" title="National Board of Accreditation - Accredited Programs">
                <div className="ritw-prestige-card-top">NBA</div>
                <div className="ritw-prestige-card-grade">ACCREDITED</div>
              </Link>
              <Link to="/accreditation#ugc" className="ritw-prestige-card ugc" title="University Grants Commission - Autonomous Institution">
                <div className="ritw-prestige-card-top">UGC</div>
                <div className="ritw-prestige-card-grade">AUTONOMOUS</div>
              </Link>
              <Link to="/accreditation#nirf" className="ritw-prestige-card nirf" title="NIRF Ranked Institution">
                <div className="ritw-prestige-card-top">NIRF</div>
                <div className="ritw-prestige-card-grade">RANKED</div>
              </Link>
            </div>

            {/* TG EAPCET / ECET Code Badge */}
            <div className="ritw-code-badge" title="Use code RITW during TG EAPCET / ECET Web Options">
              <span className="ritw-code-label">TG EAPCET / ECET CODE</span>
              <span className="ritw-code-val">{COLLEGE_INFO.eapcetCode}</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="ritw-brand-actions">
              <Link to="/admissions" className="ritw-header-cta ritw-cta-admissions" title="Admissions 2026–27 Open">
                <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                <span>Admissions 2026–27</span>
              </Link>
              <a href="/portal/" className="ritw-header-cta ritw-cta-portal" title="Campus Management Portal">
                <i className="fas fa-user-shield" aria-hidden="true"></i>
                <span>Campus Portal</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
