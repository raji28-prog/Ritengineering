import React, { useState, useEffect } from 'react';

export default function QuickEnquiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    course_interested: 'B.Tech Computer Science & Engineering (CSE)',
    message: ''
  });

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone) {
      alert('Please fill in your name and mobile phone number.');
      return;
    }
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      course_interested: 'B.Tech Computer Science & Engineering (CSE)',
      message: ''
    });
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Tab on right edge */}
      <button 
        type="button" 
        className="floating-enquiry-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Open Quick Admissions Enquiry"
        title="Quick Admissions Enquiry 2026-27"
      >
        <i className="fas fa-paper-plane" style={{ transform: 'rotate(90deg)' }} aria-hidden="true"></i>
        <span>ADMISSIONS 2026</span>
      </button>

      {/* Modal Dialog with backdrop blur */}
      {isOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-enquiry-title"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="modal-close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Close dialog"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="section-badge">TG EAPCET CODE: RITW</div>
              <h3 id="modal-enquiry-title" style={{ fontSize: '24px', color: 'var(--ritw-navy-dark)', marginTop: '4px' }}>
                Quick Admission Enquiry
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--ritw-text-muted)', marginTop: '4px' }}>
                B.Tech Admissions 2026–27 | Kukatpally, Near JNTU Metro
              </p>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--ritw-green-soft)', color: 'var(--ritw-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 16px' }}>
                  <i className="fas fa-check" aria-hidden="true"></i>
                </div>
                <h4 style={{ color: 'var(--ritw-navy-dark)', fontSize: '22px', marginBottom: '8px', fontWeight: 800 }}>
                  Enquiry Submitted Successfully!
                </h4>
                <p style={{ color: 'var(--ritw-text-muted)', fontSize: '14px', marginBottom: '20px', lineHeight: 1.6 }}>
                  Thank you, <strong>{formData.full_name}</strong>. Our admissions counselor will connect with you at <strong>{formData.phone}</strong> shortly with intake and fee details.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <a
                    href="https://wa.me/919676233050?text=Hi%2C%20I%20have%20submitted%20an%20enquiry%20for%20RITW%20Admissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cta btn-cta-green"
                  >
                    <i className="fab fa-whatsapp" aria-hidden="true"></i>
                    <span>Connect on WhatsApp</span>
                  </a>
                  <button type="button" className="btn-cta btn-cta-navy" onClick={resetForm}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ritw-text-main)', marginBottom: '5px' }}>
                    Candidate / Parent Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--ritw-border)', fontSize: '14px', outline: 'none', background: '#fafafa' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ritw-text-main)', marginBottom: '5px' }}>
                      Mobile Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile"
                      maxLength="10"
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--ritw-border)', fontSize: '14px', outline: 'none', background: '#fafafa' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ritw-text-main)', marginBottom: '5px' }}>
                      Email Address <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--ritw-border)', fontSize: '14px', outline: 'none', background: '#fafafa' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ritw-text-main)', marginBottom: '5px' }}>
                    Program of Interest <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="course_interested"
                    value={formData.course_interested}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--ritw-border)', fontSize: '14px', outline: 'none', background: '#fafafa' }}
                  >
                    <option value="B.Tech Computer Science & Engineering (CSE)">B.Tech Computer Science &amp; Engineering (CSE)</option>
                    <option value="B.Tech CSE (Artificial Intelligence & Machine Learning)">B.Tech CSE (Artificial Intelligence &amp; ML)</option>
                    <option value="B.Tech CSE (Data Science)">B.Tech CSE (Data Science)</option>
                    <option value="B.Tech Information Technology (IT)">B.Tech Information Technology (IT)</option>
                    <option value="B.Tech Electronics & Communication (ECE)">B.Tech Electronics &amp; Communication (ECE)</option>
                    <option value="Lateral Entry (ECET) - All Branches">Lateral Entry (ECET) - All Branches</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ritw-text-main)', marginBottom: '5px' }}>
                    Your Message / Query
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your TG EAPCET rank or admission questions..."
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--ritw-border)', fontSize: '14px', outline: 'none', resize: 'vertical', background: '#fafafa' }}
                  ></textarea>
                </div>

                <button type="submit" className="btn-cta btn-cta-navy" style={{ justifyContent: 'center', marginTop: '6px', padding: '12px' }}>
                  <i className="fas fa-paper-plane" aria-hidden="true"></i>
                  <span>Submit Admission Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
