import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_ANNOUNCEMENTS = [
  {
    title: "B.Tech Admissions for 2026-27 Academic Year Commenced — TG EAPCET / TG ECET Code: RITW",
    badge: "ADMISSIONS 2026",
    link: "/admissions"
  },
  {
    title: "RITW Achieves Outstanding Placement Record with Top Recruiter Packages up to 7.5 LPA",
    badge: "PLACEMENTS",
    link: "/placements"
  },
  {
    title: "Google Cloud & Vertex AI Workshop Conducted for Engineering Scholars in AI/ML Labs",
    badge: "R&D WORKSHOP",
    link: "/departments#labs"
  },
  {
    title: "UGC Autonomous & NAAC 'A' Grade Accreditation Reaffirms Quality Standards",
    badge: "ACCREDITATION",
    link: "/about#naac"
  },
  {
    title: "Autonomous Semester End Examinations Notification & Schedule Published on Exam Portal",
    badge: "EXAM CELL",
    link: "/departments#coe"
  }
];

export default function AnnouncementsTicker({ announcements = DEFAULT_ANNOUNCEMENTS }) {
  const [isPaused, setIsPaused] = useState(false);
  const items = announcements && announcements.length > 0 ? announcements : DEFAULT_ANNOUNCEMENTS;

  return (
    <div 
      className="ticker-bar" 
      role="region" 
      aria-label="Flash Announcements Ticker"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="ticker-label">
        <span className="ticker-pulse-dot" aria-hidden="true"></span>
        <i className="fas fa-bullhorn" aria-hidden="true"></i>
        <span>FLASH NEWS</span>
      </div>

      <div className="ticker-content">
        <div className={`ticker-marquee ${isPaused ? 'paused' : ''}`}>
          {items.concat(items).map((item, idx) => (
            <span key={idx} className="ticker-item">
              <span className="ticker-badge">{item.badge || item.badge_text || "ANNOUNCEMENT"}</span>
              <Link to={item.link || item.link_url || "/admissions"} className="ticker-link">
                {item.title}
              </Link>
              <span className="ticker-divider" aria-hidden="true">&bull;</span>
            </span>
          ))}
        </div>
      </div>

      <div className="ticker-controls">
        <button
          type="button"
          className="btn-ticker-pause"
          onClick={() => setIsPaused(!isPaused)}
          title={isPaused ? "Resume announcements scroll" : "Pause announcements scroll"}
          aria-label={isPaused ? "Resume scroll" : "Pause scroll"}
        >
          <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`} aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}
