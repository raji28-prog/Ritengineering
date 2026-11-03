import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const ENQUIRY_TYPES = [
  { id: 'Admissions Enquiry', label: '🎓 Admissions', showCourse: true, showSubject: false },
  { id: 'Course Information', label: '📚 Course Info', showCourse: true, showSubject: false },
  { id: 'Fee Structure', label: '💰 Fee Structure', showCourse: true, showSubject: false },
  { id: 'Scholarship', label: '🏆 Scholarship', showCourse: false, showSubject: true },
  { id: 'Grievance / Complaint', label: '⚠️ Grievance', showCourse: false, showSubject: true },
  { id: 'Careers / Job', label: '💼 Careers', showCourse: false, showSubject: true },
  { id: 'Alumni', label: '🎓 Alumni', showCourse: false, showSubject: true },
  { id: 'General Enquiry', label: '💬 General', showCourse: false, showSubject: true }
];

const CONTACT_TILES = [
  {
    title: 'General Administration',
    icon: 'fas fa-university',
    phone: '+91-955-085-2672',
    email: 'info@rishimsengg.ac.in',
    bg: 'var(--ritw-navy-soft)',
    color: 'var(--ritw-navy)',
    timing: 'Mon–Sat: 9:00 AM to 5:00 PM'
  },
  {
    title: 'Admissions Desk 1',
    icon: 'fas fa-user-graduate',
    phone: '+91-967-623-3050',
    email: 'admissions1@rishimsengg.ac.in',
    bg: 'var(--ritw-green-soft)',
    color: 'var(--ritw-green)',
    timing: 'TG EAPCET / ECET Counseling Desk'
  },
  {
    title: 'Admissions Desk 2',
    icon: 'fas fa-user-tie',
    phone: '+91-9121214081',
    email: 'admissions2@rishimsengg.ac.in',
    bg: 'var(--ritw-navy-soft)',
    color: 'var(--ritw-navy)',
    timing: 'Management & NRI Quota Desk'
  },
  {
    title: 'Placement & Corporate Desk',
    icon: 'fas fa-briefcase',
    phone: '040-2389-2878',
    email: 'lakshmikalam@rishimsengg.ac.in',
    bg: 'rgba(245, 158, 11, 0.1)',
    color: 'var(--ritw-gold)',
    timing: 'Corporate Recruiter Inquiries'
  },
  {
    title: 'WhatsApp Helpline',
    icon: 'fab fa-whatsapp',
    phone: '+91-967-623-3050',
    email: 'Chat Directly on WhatsApp',
    isWa: true,
    bg: '#dcfce7',
    color: '#15803d',
    timing: 'Instant Message Assistance'
  }
];

export default function Contact() {
  const [selectedType, setSelectedType] = useState(ENQUIRY_TYPES[0]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    course: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || formData.name.length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || !/^[6-9][0-9]{9}$/.test(formData.phone)) {
      setErrorMsg('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg('Please enter your query message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: '',
      course: '',
      subject: '',
      message: ''
    });
    setSubmitted(false);
    setErrorMsg('');
  };

  return (
    <div className="contact-page">
      {/* 1. Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Contact</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">Campus Helplines &amp; Location</span>
          </div>
          <span className="page-badge">CAMPUS CODE: RITW &bull; KUKATPALLY HYDERABAD</span>
          <h1 className="page-title">Contact RITW Institution</h1>
          <p className="page-subtitle">
            Our admissions officers, placement coordinators, and student welfare teams are here to guide you.
          </p>
        </div>
      </section>

      {/* 2. Institutional Helplines Grid */}
      <section className="contact-tiles-section">
        <div className="container">
          <div className="contact-tiles-grid">
            {CONTACT_TILES.map((tile, idx) => (
              <div key={idx} className="contact-card">
                <div className="contact-card-icon" style={{ background: tile.bg, color: tile.color }}>
                  <i className={tile.icon} aria-hidden="true"></i>
                </div>
                <h3 className="contact-card-title">{tile.title}</h3>
                <div className="contact-card-phone">
                  <a href={`tel:${tile.phone}`}>
                    <i className="fas fa-phone-alt" aria-hidden="true"></i>
                    <span>{tile.phone}</span>
                  </a>
                </div>
                <div className="contact-card-email">
                  {tile.isWa ? (
                    <a href="https://wa.me/919676233050" target="_blank" rel="noopener noreferrer" style={{ color: tile.color, fontWeight: 700 }}>
                      {tile.email}
                    </a>
                  ) : (
                    <a href={`mailto:${tile.email}`}>
                      {tile.email}
                    </a>
                  )}
                </div>
                <div className="contact-card-timing">{tile.timing}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Universal Interactive Contact Form (VIT Style) */}
      <section className="contact-form-section">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="contact-form-card">
            
            {/* Header with Type Selector Chips */}
            <div className="contact-form-header">
              <div className="form-header-title-row">
                <div className="form-header-icon">
                  <i className="fas fa-paper-plane" aria-hidden="true"></i>
                </div>
                <div>
                  <h3 className="form-header-title">Send Us a Direct Message</h3>
                  <p className="form-header-sub">
                    Admissions &bull; Grievances &bull; Course Info &bull; Placements &bull; General Enquiries
                  </p>
                </div>
              </div>

              {/* Category Chips */}
              <div className="category-chips-row" role="radiogroup" aria-label="Enquiry categories">
                {ENQUIRY_TYPES.map((type) => {
                  const isActive = selectedType.id === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setSelectedType(type)}
                      className={`category-chip ${isActive ? 'active' : ''}`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form / Success Screen */}
            {submitted ? (
              <div className="contact-success-screen">
                <div className="success-icon-circle">
                  <i className="fas fa-check" aria-hidden="true"></i>
                </div>
                <h4 className="success-heading">Message Dispatched Successfully!</h4>
                <p className="success-message">
                  Thank you, <strong>{formData.name}</strong>. Our institutional support team has logged your inquiry regarding <strong>{selectedType.id}</strong> and will connect with you at <strong>+91 {formData.phone}</strong> within 24 working hours.
                </p>
                <div className="success-actions">
                  <a
                    href="https://wa.me/919676233050"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cta cta-btn-wa"
                  >
                    <i className="fab fa-whatsapp" aria-hidden="true"></i>
                    <span>Connect on WhatsApp</span>
                  </a>
                  <button type="button" onClick={handleReset} className="btn-cta btn-cta-navy">
                    <i className="fas fa-redo" aria-hidden="true"></i>
                    <span>Send Another Message</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form-body" noValidate>
                {errorMsg && (
                  <div className="form-error-banner" role="alert">
                    <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="ct_name">
                      <i className="fas fa-user" aria-hidden="true"></i>
                      <span>Full Name <span className="req">*</span></span>
                    </label>
                    <input
                      id="ct_name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ct_phone">
                      <i className="fas fa-mobile-alt" aria-hidden="true"></i>
                      <span>Mobile Number <span className="req">*</span></span>
                    </label>
                    <div className="phone-input-wrap">
                      <span className="phone-prefix">+91</span>
                      <input
                        id="ct_phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile"
                        maxLength="10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="ct_email">
                      <i className="fas fa-envelope" aria-hidden="true"></i>
                      <span>Email Address <span className="opt">(Optional)</span></span>
                    </label>
                    <input
                      id="ct_email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@gmail.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ct_city">
                      <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                      <span>City / Town</span>
                    </label>
                    <input
                      id="ct_city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Hyderabad, Secunderabad"
                    />
                  </div>
                </div>

                {selectedType.showCourse && (
                  <div className="form-group">
                    <label htmlFor="ct_course">
                      <i className="fas fa-book-open" aria-hidden="true"></i>
                      <span>Program of Interest</span>
                    </label>
                    <select
                      id="ct_course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Degree Course --</option>
                      <option>B.Tech – Computer Science &amp; Engineering (CSE)</option>
                      <option>B.Tech – CSE (Artificial Intelligence &amp; ML)</option>
                      <option>B.Tech – CSE (Data Science)</option>
                      <option>B.Tech – Information Technology (IT)</option>
                      <option>B.Tech – Electronics &amp; Communication (ECE)</option>
                      <option>Lateral Entry – CSE / IT / ECE</option>
                    </select>
                  </div>
                )}

                {selectedType.showSubject && (
                  <div className="form-group">
                    <label htmlFor="ct_subject">
                      <i className="fas fa-tag" aria-hidden="true"></i>
                      <span>Query Subject</span>
                    </label>
                    <input
                      id="ct_subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief subject of your query"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="ct_message">
                    <i className="fas fa-comment-alt" aria-hidden="true"></i>
                    <span>Your Message <span className="req">*</span></span>
                  </label>
                  <textarea
                    id="ct_message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us how we can assist you..."
                    required
                  ></textarea>
                </div>

                <div className="form-submit-row">
                  <button type="submit" disabled={isSubmitting} className="btn-cta btn-cta-navy">
                    {isSubmitting ? (
                      <span><i className="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...</span>
                    ) : (
                      <span><i className="fas fa-paper-plane" aria-hidden="true"></i> Send Message</span>
                    )}
                  </button>
                  <a
                    href="https://wa.me/919676233050"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cta cta-btn-wa"
                  >
                    <i className="fab fa-whatsapp" aria-hidden="true"></i>
                    <span>WhatsApp Helpdesk</span>
                  </a>
                </div>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* 4. Campus Location & Google Maps Embed (VIT Reference) */}
      <section id="transport" className="campus-location-section">
        <div className="container">
          <div className="location-split-grid">
            
            {/* Transit Directions */}
            <div className="transit-info-card">
              <span className="section-badge">CAMPUS CONNECTIVITY</span>
              <h2 className="section-title">How to Reach RITW Campus</h2>
              <p className="paragraph-main">
                RITW is situated in Kukatpally right opposite the JNTU College Metro Station on the Hyderabad Red Line, providing safe, rapid, and stress-free transit for female students across Greater Hyderabad.
              </p>

              <div className="transit-directions-list">
                <div className="transit-item">
                  <div className="transit-icon metro-color"><i className="fas fa-subway" aria-hidden="true"></i></div>
                  <div>
                    <strong>Hyderabad Metro (Red Line):</strong>
                    <p>Get down at JNTU College Metro Station. The college campus is just a 2-minute walk from Gate 2.</p>
                  </div>
                </div>

                <div className="transit-item">
                  <div className="transit-icon bus-color"><i className="fas fa-bus" aria-hidden="true"></i></div>
                  <div>
                    <strong>TSRTC Public Transport:</strong>
                    <p>Connected via regular TSRTC bus routes passing through Kukatpally, JNTU, and Nizampet X Roads.</p>
                  </div>
                </div>

                <div className="transit-item">
                  <div className="transit-icon clock-color"><i className="fas fa-clock" aria-hidden="true"></i></div>
                  <div>
                    <strong>Campus Office Hours:</strong>
                    <p>Monday to Saturday: 9:00 AM to 5:00 PM (Closed on second Saturdays &amp; official holidays).</p>
                  </div>
                </div>
              </div>

              <div className="campus-full-address">
                <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                <div>
                  <strong>Official Postal Address:</strong><br />
                  Rishi M.S Institute of Engineering &amp; Technology for Women,<br />
                  Near JNTU Metro Station, Nizampet Road, Kukatpally, Hyderabad, Telangana – 500 085.
                </div>
              </div>
            </div>

            {/* Google Map Frame */}
            <div className="map-frame-box">
              <iframe
                title="RITW Campus Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.1464635476073!2d78.3882290747125!3d17.494793083411084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91f3d65b9d33%3A0x6b97f01524e9ec86!2sRishi%20MS%20Institute%20of%20Engineering%20and%20Technology%20for%20Women!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
