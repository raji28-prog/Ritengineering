import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_MENU, COLLEGE_INFO } from '../data/navigationMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('About');
  const location = useLocation();

  // Close menu automatically on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mega menu is open and handle ESC key
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  // Filter out 'Home' from categories list in mega-menu as it is a direct top-level link
  const menuCategories = NAVIGATION_MENU.filter((item) => item.title !== 'Home');
  const currentCategoryData =
    menuCategories.find((cat) => cat.title.toLowerCase() === activeCategory.toLowerCase()) ||
    menuCategories[0];

  return (
    <div className="ritw-sreyas-header-wrapper">
      <header className="ritw-sreyas-header-bar" role="banner">
        
        {/* 1. LEFT: Hamburger Menu Toggle Button */}
        <div className="ritw-sreyas-header-left">
          <button
            type="button"
            className={`ritw-sreyas-hamburger-btn ${isMenuOpen ? 'is-active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="ritw-sreyas-mega-overlay"
            aria-label={isMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            title={isMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
          >
            <span className="ritw-sreyas-bar-line"></span>
            <span className="ritw-sreyas-bar-line"></span>
          </button>
        </div>

        {/* 2. CENTRE: ONE Centered Branding Group (Emblem + Large RITW + Full Name below) exactly like Sreyas */}
        <div className="ritw-sreyas-header-center">
          <Link
            to="/"
            className="ritw-sreyas-brand-link"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Rishi M.S. Institute of Engineering & Technology for Women"
          >
            <img
              src="/images/ritw-emblem-logo.png"
              alt="RITW Emblem"
              className="ritw-sreyas-college-logo"
            />
            <div className="ritw-sreyas-brand-titles">
              <span className="ritw-sreyas-brand-acronym">RITW</span>
              <span className="ritw-sreyas-brand-fullname">
                RISHI M.S. INSTITUTE OF ENGINEERING &amp; TECHNOLOGY FOR WOMEN
              </span>
            </div>
          </Link>
        </div>

        {/* 3. RIGHT: Display ONLY Existing Accreditation and Recognition Logos */}
        <div className="ritw-sreyas-header-right">
          <div className="ritw-sreyas-accred-strip" aria-label="Official Institutional Accreditations">
            <Link
              to="/accreditation#ugc"
              className="ritw-accred-badge-item"
              title="UGC Autonomous Institution"
            >
              <img src="/images/UGC_India_Logo.webp" alt="UGC Autonomous" />
            </Link>
            <Link
              to="/accreditation#naac"
              className="ritw-accred-badge-item"
              title="NAAC 'A' Grade Accredited"
            >
              <img src="/images/NAAC-A.png" alt="NAAC A Grade" />
            </Link>
            <Link
              to="/accreditation#aicte"
              className="ritw-accred-badge-item"
              title="Approved by All India Council for Technical Education (AICTE)"
            >
              <img src="/images/All_India_Council_for_Technical_Education_logo.webp" alt="AICTE" />
            </Link>
            <Link
              to="/accreditation#jntuh"
              className="ritw-accred-badge-item"
              title="Affiliated to JNTU Hyderabad"
            >
              <img src="/images/JNTU_Hyderabad_logo.webp" alt="JNTU Hyderabad" />
            </Link>
            <Link
              to="/accreditation#nirf"
              className="ritw-accred-badge-item"
              title="National Institutional Ranking Framework (NIRF)"
            >
              <img src="/images/NIRF.webp" alt="NIRF Ranked" />
            </Link>
          </div>
        </div>

      </header>

      {/* SREYAS-STYLE TWO-PANE MEGA-MENU OVERLAY */}
      {isMenuOpen && (
        <div
          id="ritw-sreyas-mega-overlay"
          className="ritw-sreyas-overlay"
          onClick={() => setIsMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="University Mega Menu Navigation"
        >
          <div
            className="ritw-sreyas-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Body: 2-Pane Split */}
            <div className="ritw-sreyas-modal-body">
              
              {/* Left Sidebar: Categories Navigation */}
              <aside className="ritw-sreyas-sidebar" aria-label="Menu Categories">
                <ul className="ritw-sreyas-cat-nav-list" role="tablist">
                  {menuCategories.map((cat, idx) => {
                    const isActive = activeCategory.toLowerCase() === cat.title.toLowerCase();
                    return (
                      <li key={idx} className="ritw-sreyas-cat-item">
                        <button
                          type="button"
                          className={`ritw-sreyas-cat-btn ${isActive ? 'is-active' : ''}`}
                          onClick={() => setActiveCategory(cat.title)}
                          onMouseEnter={() => setActiveCategory(cat.title)}
                          role="tab"
                          aria-selected={isActive}
                        >
                          <span className="ritw-sreyas-cat-name">{cat.title}</span>
                          <i className="fas fa-chevron-right ritw-sreyas-cat-arrow" aria-hidden="true"></i>
                        </button>
                      </li>
                    );
                  })}

                  {/* Clean Portal link at the bottom of the list */}
                  <li className="ritw-sreyas-cat-item portal-item">
                    <a
                      href="/portal/"
                      className="ritw-sreyas-cat-btn portal-btn"
                      onClick={() => setIsMenuOpen(false)}
                      title="Campus Management Portal"
                    >
                      <span>
                        <i className="fas fa-user-circle" style={{ marginRight: '8px' }}></i>
                        Campus Portal
                      </span>
                      <i className="fas fa-external-link-alt ritw-sreyas-cat-arrow" aria-hidden="true"></i>
                    </a>
                  </li>
                </ul>
              </aside>

              {/* Right Content Card: Dark Navy Container with Active Category Submenus */}
              <main className="ritw-sreyas-content-card" role="tabpanel">
                <div className="ritw-sreyas-card-topbar">
                  <div className="ritw-sreyas-card-title-wrap">
                    <h2 className="ritw-sreyas-active-title">
                      {currentCategoryData.title}
                    </h2>
                    <div className="ritw-sreyas-title-accent"></div>
                  </div>

                  {currentCategoryData.path && (
                    <Link
                      to={currentCategoryData.path}
                      className="ritw-sreyas-category-view-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Visit {currentCategoryData.title} Main Page</span>
                      <i className="fas fa-arrow-right" aria-hidden="true"></i>
                    </Link>
                  )}
                </div>

                {/* Submenu Columns Grid */}
                <div
                  className={`ritw-sreyas-grid ritw-grid-cols-${
                    currentCategoryData.submenus ? Math.min(currentCategoryData.submenus.length, 4) : 1
                  }`}
                >
                  {currentCategoryData.submenus ? (
                    currentCategoryData.submenus.map((col, colIdx) => (
                      <div key={colIdx} className="ritw-sreyas-column">
                        <h3 className="ritw-sreyas-col-heading">
                          {col.icon && (
                            <i className={`${col.icon} ritw-sreyas-heading-icon`} aria-hidden="true"></i>
                          )}
                          <span>{col.heading}</span>
                        </h3>
                        <ul className="ritw-sreyas-link-list">
                          {col.links.map((link, lIdx) => (
                            <li key={lIdx}>
                              {link.isInternal ? (
                                <Link
                                  to={link.path}
                                  className="ritw-sreyas-menu-link"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span className="ritw-menu-arrow">&rarr;</span>
                                  <span className="ritw-menu-title">{link.title}</span>
                                </Link>
                              ) : (
                                <a
                                  href={link.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ritw-sreyas-menu-link"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <span className="ritw-menu-arrow">&rarr;</span>
                                  <span className="ritw-menu-title">{link.title}</span>
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div className="ritw-sreyas-column">
                      <Link
                        to={currentCategoryData.path}
                        className="ritw-sreyas-menu-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="ritw-menu-arrow">&rarr;</span>
                        <span className="ritw-menu-title">Go to {currentCategoryData.title}</span>
                      </Link>
                    </div>
                  )}
                </div>
              </main>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

