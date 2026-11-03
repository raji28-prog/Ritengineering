import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_MENU, COLLEGE_INFO } from '../data/navigationMenu';

export default function Navbar({ onOpenSearch, onOpenVoice }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileIndex, setExpandedMobileIndex] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  const navRef = useRef(null);
  const itemRefs = useRef([]);

  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setMobileOpen(false);
    setActiveDropdown(null);
  }

  // Handle ESC key and click outside to dismiss menus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    };
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (idx) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(idx);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  const toggleMobileAccordion = (idx) => {
    setExpandedMobileIndex(expandedMobileIndex === idx ? null : idx);
  };

  const isActive = (item) => {
    const currentPath = location.pathname.toLowerCase();
    const itemPath = item.path.split('#')[0].toLowerCase();
    if (item.path === '/' && currentPath === '/') return true;
    if (itemPath !== '/' && currentPath.startsWith(itemPath)) return true;

    const aliases = {
      'Governance': ['/governance'],
      'Academics': ['/academics'],
      'Examinations': ['/examinations', '/exams'],
      'Research & R&D': ['/research'],
      'Campus Life': ['/campus-life', '/campuslife'],
      'Facilities': ['/facilities'],
      'NAAC': ['/accreditation', '/accreditations'],
      'Contact Us': ['/contact']
    };

    if (aliases[item.title] && aliases[item.title].includes(currentPath)) {
      return true;
    }

    return false;
  };

  // Automatically calculate dropdown position inside browser viewport without clipping or overlapping
  const getDropdownPosition = (idx, colCount) => {
    if (typeof window === 'undefined') return {};
    const itemEl = itemRefs.current[idx];
    if (!itemEl) return {};

    const rect = itemEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const targetWidth = colCount === 1 ? 360 : colCount === 2 ? 680 : colCount === 3 ? 960 : 1160;
    const clampedWidth = Math.min(targetWidth, vw - 32);

    // If dropdown fits aligned to the left of the nav item without overflowing the right edge
    if (rect.left + clampedWidth <= vw - 16) {
      return {
        width: `${clampedWidth}px`,
        left: 0,
        right: 'auto'
      };
    }

    // If aligning to right of nav item fits inside left screen edge
    if (rect.right - clampedWidth >= 16) {
      return {
        width: `${clampedWidth}px`,
        right: 0,
        left: 'auto'
      };
    }

    // Otherwise, dynamically shift left so it fits inside the browser viewport
    const offsetLeft = Math.max(16 - rect.left, vw - 16 - rect.left - clampedWidth);
    return {
      width: `${clampedWidth}px`,
      left: `${offsetLeft}px`,
      right: 'auto'
    };
  };

  return (
    <>
      <nav ref={navRef} className="navbar-sticky" aria-label="Main University Navigation">
        <div className="container-fluid navbar-inner">
          
          {/* Primary Navigation Menu */}
          <div className="navbar-menu-col">
            <ul className="nav-links" role="menubar">
              {NAVIGATION_MENU.map((item, idx) => {
                const hasSub = item.submenus && item.submenus.length > 0;
                const isItemActive = isActive(item);
                const isOpen = activeDropdown === idx;
                
                // Automatic Viewport Positioning: prevents clipping or overlapping
                const colCount = hasSub ? item.submenus.length : 0;
                const dropdownStyle = isOpen ? getDropdownPosition(idx, colCount) : {};

                return (
                  <li
                    key={idx}
                    ref={(el) => (itemRefs.current[idx] = el)}
                    className={`nav-item ${hasSub ? 'has-dropdown' : ''}`}
                    onMouseEnter={() => hasSub && handleMouseEnter(idx)}
                    onMouseLeave={() => hasSub && handleMouseLeave()}
                    role="none"
                  >
                    <Link
                      to={item.path}
                      className={`nav-link ${isItemActive ? 'active' : ''}`}
                      role="menuitem"
                      aria-haspopup={hasSub ? 'true' : 'false'}
                      aria-expanded={hasSub ? (isOpen ? 'true' : 'false') : undefined}
                      onClick={() => {
                        if (hasSub) {
                          const nextOpen = isOpen ? null : idx;
                          setActiveDropdown(nextOpen);
                        }
                      }}
                    >
                      <span>{item.title}</span>
                      {hasSub && (
                        <i className={`fas fa-chevron-down nav-arrow ${isOpen ? 'rotate' : ''}`} aria-hidden="true"></i>
                      )}
                    </Link>

                    {/* Pop Short-Screen Dropdown (Popover Card with Animation) */}
                    {hasSub && (
                      <div 
                        className={`pop-short-dropdown ${isOpen ? 'show' : ''}`} 
                        style={dropdownStyle}
                        role="menu" 
                        aria-label={`${item.title} Submenu`}
                        onMouseEnter={() => handleMouseEnter(idx)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className={`pop-panel-grid pop-grid-${colCount}`}>
                          {item.submenus.map((col, cIdx) => (
                            <div key={cIdx} className="pop-panel-col">
                              <div className="pop-panel-heading">
                                <i className={`${col.icon} pop-heading-icon`} aria-hidden="true"></i>
                                <span>{col.heading}</span>
                              </div>
                              <ul className="pop-panel-links">
                                {col.links.map((link, lIdx) => (
                                  <li key={lIdx}>
                                    {link.isInternal ? (
                                      <Link
                                        to={link.path}
                                        onClick={() => setActiveDropdown(null)}
                                      >
                                        {link.title}
                                      </Link>
                                    ) : (
                                      <a
                                        href={link.path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setActiveDropdown(null)}
                                      >
                                        {link.title}
                                      </a>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Nav Right Utility Tools (Portal Button, Search, Mobile Hamburger) */}
          <div className="navbar-tools-col">
            {/* Green Portal Pill Button */}
            <a href="/portal/" className="ritw-portal-btn" title="Campus Management Portal">
              <i className="fas fa-user-circle" aria-hidden="true"></i>
              <span>Portal</span>
            </a>

            {/* Instant Search Trigger */}
            <button
              type="button"
              className="btn-nav-icon btn-search-trigger"
              onClick={onOpenSearch}
              title="Instant Search (Ctrl + K)"
              aria-label="Instant Search"
            >
              <i className="fas fa-search" aria-hidden="true"></i>
            </button>

            {/* Voice Assistant Trigger */}
            {onOpenVoice && (
              <button
                type="button"
                className="btn-nav-icon btn-voice-trigger"
                onClick={onOpenVoice}
                title="Voice Assistant Search"
                aria-label="Voice Search Assistant"
              >
                <i className="fas fa-microphone" aria-hidden="true"></i>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className={`mobile-toggle-btn ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Mobile Navigation"
              aria-expanded={mobileOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Off-Canvas Drawer */}
      {mobileOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-brand">
                <img src="/images/RITW-LOGO.png" alt="RITW" className="mobile-drawer-logo" />
                <div>
                  <div className="drawer-title">RITW HYDERABAD</div>
                  <div className="drawer-sub">UGC Autonomous &bull; NAAC 'A'</div>
                </div>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileOpen(false)}
                aria-label="Close Navigation"
              >
                <i className="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            {/* Quick Search inside Drawer */}
            <div className="drawer-search-bar" onClick={() => { setMobileOpen(false); onOpenSearch(); }}>
              <i className="fas fa-search" aria-hidden="true"></i>
              <span>Search RITW programs, syllabus, faculty...</span>
              <kbd>Ctrl+K</kbd>
            </div>

            {/* Accordion Menu Links */}
            <div className="mobile-drawer-body">
              <ul className="drawer-menu-list">
                {NAVIGATION_MENU.map((item, idx) => {
                  const hasSub = item.submenus && item.submenus.length > 0;
                  const isExpanded = expandedMobileIndex === idx;

                  return (
                    <li key={idx} className="drawer-menu-item">
                      <div className="drawer-item-row">
                        <Link
                          to={item.path}
                          className="drawer-item-link"
                          onClick={() => !hasSub && setMobileOpen(false)}
                        >
                          {item.title}
                        </Link>
                        {hasSub && (
                          <button
                            type="button"
                            className={`drawer-expand-btn ${isExpanded ? 'expanded' : ''}`}
                            onClick={() => toggleMobileAccordion(idx)}
                            aria-label={`Toggle ${item.title} submenu`}
                          >
                            <i className="fas fa-chevron-down" aria-hidden="true"></i>
                          </button>
                        )}
                      </div>

                      {hasSub && isExpanded && (
                        <div className="drawer-submenus">
                          {item.submenus.map((col, cIdx) => (
                            <div key={cIdx} className="drawer-sub-group">
                              <div className="drawer-sub-heading">
                                <i className={col.icon} aria-hidden="true"></i>
                                <span>{col.heading}</span>
                              </div>
                              <ul className="drawer-sub-links">
                                {col.links.map((link, lIdx) => (
                                  <li key={lIdx}>
                                    {link.isInternal ? (
                                      <Link
                                        to={link.path}
                                        className="drawer-sub-link"
                                        onClick={() => setMobileOpen(false)}
                                      >
                                        <i className="fas fa-chevron-right" aria-hidden="true"></i>
                                        <span>{link.title}</span>
                                      </Link>
                                    ) : (
                                      <a
                                        href={link.path}
                                        className="drawer-sub-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setMobileOpen(false)}
                                      >
                                        <i className="fas fa-external-link-alt" aria-hidden="true"></i>
                                        <span>{link.title}</span>
                                      </a>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Drawer Quick Actions */}
            <div className="mobile-drawer-footer">
              <div className="drawer-eapcet-pill">
                <span>TG EAPCET / ECET CODE:</span>
                <strong>{COLLEGE_INFO.eapcetCode}</strong>
              </div>
              <div className="drawer-actions-grid">
                <Link
                  to="/admissions"
                  className="btn-cta btn-cta-green"
                  style={{ justifyContent: 'center' }}
                  onClick={() => setMobileOpen(false)}
                >
                  <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                  <span>Admissions 2026-27</span>
                </Link>
                <a
                  href={`tel:${COLLEGE_INFO.phone}`}
                  className="btn-cta btn-cta-navy"
                  style={{ justifyContent: 'center' }}
                >
                  <i className="fas fa-phone-alt" aria-hidden="true"></i>
                  <span>Call Campus Helpline</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
