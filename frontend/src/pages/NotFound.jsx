import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container not-found-inner">
        <div className="not-found-icon-circle">
          <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
        </div>
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Institutional Page Not Found</h1>
        <p className="not-found-desc">
          The requested university webpage might have been updated, relocated under autonomous regulations, or is temporarily offline. Please use the navigation links below or search the institutional catalog.
        </p>

        <div className="not-found-quick-links">
          <Link to="/" className="btn-cta btn-cta-navy">
            <i className="fas fa-home" aria-hidden="true"></i>
            <span>Back to RITW Homepage</span>
          </Link>
          <Link to="/admissions" className="btn-cta btn-cta-green">
            <i className="fas fa-graduation-cap" aria-hidden="true"></i>
            <span>Admissions 2026–27</span>
          </Link>
          <Link to="/departments" className="btn-cta cta-btn-outline">
            <i className="fas fa-laptop-code" aria-hidden="true"></i>
            <span>Academic Departments</span>
          </Link>
          <Link to="/contact" className="btn-cta cta-btn-outline">
            <i className="fas fa-phone-alt" aria-hidden="true"></i>
            <span>Contact Helpdesk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
