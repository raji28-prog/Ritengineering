import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './fieldsui-pages.css';

const COURSES = [
  {
    code: 'CSE',
    name: 'B.Tech – Computer Science & Engineering',
    intake: 180,
    duration: '4 Years',
    badge: 'NBA ACCREDITED',
    eligibility: '10+2 / Intermediate with MPC (45% for general, 40% for reserved)',
    desc: 'Core computing, algorithms, distributed systems, full-stack software development, and cloud computing.'
  },
  {
    code: 'CSE-AIML',
    name: 'B.Tech – CSE (Artificial Intelligence & Machine Learning)',
    intake: 180,
    duration: '4 Years',
    badge: 'HIGH DEMAND',
    eligibility: '10+2 / Intermediate with MPC (45% for general, 40% for reserved)',
    desc: 'Deep learning, neural networks, computer vision, natural language processing, and MLOps on GPU clusters.'
  },
  {
    code: 'CSE-DS',
    name: 'B.Tech – CSE (Data Science)',
    intake: 60,
    duration: '4 Years',
    badge: 'EMERGING TECH',
    eligibility: '10+2 / Intermediate with MPC (45% for general, 40% for reserved)',
    desc: 'Big data analytics, data engineering, statistical predictive modeling, and business intelligence.'
  },
  {
    code: 'IT',
    name: 'B.Tech – Information Technology',
    intake: 60,
    duration: '4 Years',
    badge: 'INDUSTRY READY',
    eligibility: '10+2 / Intermediate with MPC (45% for general, 40% for reserved)',
    desc: 'Enterprise software architecture, cloud platforms, network security, and DevOps automation.'
  },
  {
    code: 'ECE',
    name: 'B.Tech – Electronics & Communication Engineering',
    intake: 60,
    duration: '4 Years',
    badge: 'HARDWARE & IOT',
    eligibility: '10+2 / Intermediate with MPC (45% for general, 40% for reserved)',
    desc: 'VLSI circuit design, embedded microcontrollers, 5G wireless communications, and IoT systems.'
  },
  {
    code: 'LATERAL',
    name: 'Lateral Entry (2nd Year Direct Admission)',
    intake: '10% Over & Above',
    duration: '3 Years',
    badge: 'FOR DIPLOMA HOLDERS',
    eligibility: '3-Year Polytechnic Diploma or B.Sc. Mathematics with qualifying rank in TG ECET',
    desc: 'Direct entry into the 3rd semester of B.Tech for diploma holders through TG ECET counseling.'
  }
];

const ADMISSION_STEPS = [
  {
    step: "01",
    title: "Appear for TG EAPCET / ECET",
    desc: "Eligible female candidates must appear for the Telangana State Engineering entrance exam conducted by TSCHE."
  },
  {
    step: "02",
    title: "Web Options Counseling (Code: RITW)",
    desc: "During online web counseling rounds, select 'RITW' as your priority college for CSE, AIML, DS, IT, or ECE branches."
  },
  {
    step: "03",
    title: "Provisional Seat Allotment",
    desc: "Download the official seat allotment letter from the TSCHE web counseling portal upon merit verification."
  },
  {
    step: "04",
    title: "Campus Reporting & Document Verification",
    desc: "Report to the RITW Kukatpally campus with original certificates, allotment order, and complete admission formalities."
  }
];

const CERTIFICATES = [
  "TG EAPCET / ECET 2026 Hall Ticket & Rank Card",
  "SSC (10th Standard) Original Marks Memo & Passing Certificate",
  "Intermediate (10+2) / Polytechnic Diploma Marks Memo",
  "Transfer Certificate (TC) & Study / Conduct Certificates (Class 6 to 12)",
  "Caste Certificate & Income Certificate (issued by MRO, for TS Epass fee reimbursement)",
  "Aadhaar Card copy of candidate and parent",
  "Equivalence Certificate (for students from CBSE / ICSE / Other State Boards)",
  "6 Passport-size color photographs"
];

export default function Admissions() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    course: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    if (!formData.city.trim()) {
      setErrorMsg('Please enter your city or hometown.');
      return;
    }
    if (!formData.course) {
      setErrorMsg('Please select a course of interest.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('Please accept the consent checkbox to allow our admissions team to assist you.');
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
      consent: false
    });
    setSubmitted(false);
    setErrorMsg('');
  };

  return (
    <div className="admissions-page">
      {/* 1. Header Banner */}
      <section className="page-header-banner">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span>Admissions</span>
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
            <span className="current">B.Tech 2026–27</span>
          </div>

          <div className="admissions-header-grid">
            <div>
              <span className="page-badge">TG EAPCET / ECET COUNSELING CODE: RITW</span>
              <h1 className="page-title">B.Tech Admissions 2026–27 Now Open</h1>
              <p className="page-subtitle">
                Join Hyderabad’s premier UGC Autonomous, NAAC ‘A’ Grade accredited engineering institute exclusively for women. Transforming passionate learners into industry-ready software leaders.
              </p>
              <div className="admissions-quick-btns">
                <a href="#enquiry-form" className="btn-cta btn-cta-green">
                  <i className="fas fa-paper-plane" aria-hidden="true"></i>
                  <span>Submit Admission Enquiry</span>
                </a>
                <a
                  href="https://wa.me/919676233050?text=Hi%2C%20I%20want%20details%20about%20RITW%20Admissions%202026-27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta cta-btn-wa"
                >
                  <i className="fab fa-whatsapp" aria-hidden="true"></i>
                  <span>WhatsApp Admissions Desk</span>
                </a>
              </div>
            </div>

            {/* Quick Summary Pill Box */}
            <div className="admissions-summary-box">
              <h3 className="summary-title">
                <i className="fas fa-info-circle" aria-hidden="true"></i>
                <span>Key Admission Highlights</span>
              </h3>
              <ul className="summary-list">
                <li>
                  <i className="fas fa-check" aria-hidden="true"></i>
                  <span><strong>Convenor Code:</strong> RITW (Affiliated to JNTUH)</span>
                </li>
                <li>
                  <i className="fas fa-check" aria-hidden="true"></i>
                  <span><strong>Accreditations:</strong> UGC Autonomous &bull; NAAC 'A' &bull; NBA</span>
                </li>
                <li>
                  <i className="fas fa-check" aria-hidden="true"></i>
                  <span><strong>Location:</strong> Right Opposite JNTU Metro Station (Red Line)</span>
                </li>
                <li>
                  <i className="fas fa-check" aria-hidden="true"></i>
                  <span><strong>Fee Reimbursement:</strong> 100% applicable for TS Epass eligible candidates</span>
                </li>
                <li>
                  <i className="fas fa-check" aria-hidden="true"></i>
                  <span><strong>Direct Helpline:</strong> +91-967-623-3050 / +91-955-085-2672</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Approved Intake Table (VIT Portal Style) */}
      <section className="courses-table-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">APPROVED SEATS &amp; INTAKE</span>
            <h2 className="section-title">Courses Offered (Academic Year 2026–27)</h2>
            <p className="section-subtitle">
              Approved by AICTE, New Delhi, and permanently affiliated to Jawaharlal Nehru Technological University Hyderabad.
            </p>
          </div>

          <div className="admissions-courses-grid">
            {COURSES.map((course, idx) => (
              <div key={idx} className="adm-course-card">
                <div className="adm-course-top">
                  <span className="adm-badge">{course.badge}</span>
                  <span className="adm-duration"><i className="fas fa-clock" aria-hidden="true"></i> {course.duration}</span>
                </div>
                <h3 className="adm-course-name">{course.name}</h3>
                <p className="adm-course-desc">{course.desc}</p>
                <div className="adm-eligibility">
                  <strong>Eligibility:</strong> {course.eligibility}
                </div>
                <div className="adm-course-footer">
                  <div className="adm-intake-box">
                    <span className="intake-label">Annual Intake:</span>
                    <strong className="intake-value">{course.intake} Seats</strong>
                  </div>
                  <a href="#enquiry-form" className="btn-cta btn-cta-navy adm-apply-link">
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Interactive Admissions Enquiry Form (VIT Style) */}
      <section id="enquiry-form" className="enquiry-form-section">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="enquiry-form-card">
            
            {/* Form Header */}
            <div className="enquiry-header">
              <div className="enquiry-icon-box">
                <i className="fas fa-file-signature" aria-hidden="true"></i>
              </div>
              <div>
                <h3 className="enquiry-title">Enquire for Admissions 2026–27</h3>
                <p className="enquiry-desc">
                  Fill in your details below. Our expert admissions counselors will reach out with seat availability, fee structures, and counseling guidance.
                </p>
              </div>
            </div>

            {/* Success Feedback Screen */}
            {submitted ? (
              <div className="enquiry-success-screen">
                <div className="success-icon-circle">
                  <i className="fas fa-check" aria-hidden="true"></i>
                </div>
                <h4 className="success-heading">Admission Enquiry Submitted!</h4>
                <p className="success-message">
                  Thank you, <strong>{formData.name}</strong>. Our admissions counselor will contact you at <strong>+91 {formData.phone}</strong> within 24 working hours.
                </p>
                <div className="success-actions">
                  <a
                    href="https://wa.me/919676233050?text=Hi%2C%20I%20have%20submitted%20an%20enquiry%20for%20RITW%20Admissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cta cta-btn-wa"
                  >
                    <i className="fab fa-whatsapp" aria-hidden="true"></i>
                    <span>Connect Immediately on WhatsApp</span>
                  </a>
                  <button type="button" onClick={handleReset} className="btn-cta btn-cta-navy">
                    <i className="fas fa-redo" aria-hidden="true"></i>
                    <span>Submit Another Enquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="enquiry-form-body" noValidate>
                {errorMsg && (
                  <div className="form-error-banner" role="alert">
                    <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="adm_name">
                      <i className="fas fa-user" aria-hidden="true"></i>
                      <span>Candidate / Parent Full Name <span className="req">*</span></span>
                    </label>
                    <input
                      id="adm_name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="adm_phone">
                      <i className="fas fa-mobile-alt" aria-hidden="true"></i>
                      <span>Mobile Number <span className="req">*</span></span>
                    </label>
                    <div className="phone-input-wrap">
                      <span className="phone-prefix">+91</span>
                      <input
                        id="adm_phone"
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
                    <label htmlFor="adm_email">
                      <i className="fas fa-envelope" aria-hidden="true"></i>
                      <span>Email Address <span className="opt">(Optional)</span></span>
                    </label>
                    <input
                      id="adm_email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="adm_city">
                      <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
                      <span>City / Town <span className="req">*</span></span>
                    </label>
                    <input
                      id="adm_city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Hyderabad, Nizamabad, Warangal"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="adm_course">
                    <i className="fas fa-book-open" aria-hidden="true"></i>
                    <span>Program of Interest <span className="req">*</span></span>
                  </label>
                  <select
                    id="adm_course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Degree Course --</option>
                    <optgroup label="B.Tech (Regular 4-Year)">
                      <option value="B.Tech CSE">B.Tech – Computer Science &amp; Engineering (CSE)</option>
                      <option value="B.Tech CSE-AIML">B.Tech – CSE (Artificial Intelligence &amp; ML)</option>
                      <option value="B.Tech CSE-DS">B.Tech – CSE (Data Science)</option>
                      <option value="B.Tech IT">B.Tech – Information Technology (IT)</option>
                      <option value="B.Tech ECE">B.Tech – Electronics &amp; Communication (ECE)</option>
                    </optgroup>
                    <optgroup label="Lateral Entry (2nd Year Direct for Diploma)">
                      <option value="Lateral Entry CSE">Lateral Entry – CSE</option>
                      <option value="Lateral Entry IT">Lateral Entry – IT</option>
                      <option value="Lateral Entry ECE">Lateral Entry – ECE</option>
                    </optgroup>
                  </select>
                </div>

                <div className="form-consent-box">
                  <input
                    type="checkbox"
                    id="adm_consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="adm_consent">
                    I agree to allow Rishi M.S Institute of Engineering &amp; Technology for Women (RITW) to contact me via phone, SMS, and WhatsApp regarding admissions. Information remains strictly confidential. <span className="req">*</span>
                  </label>
                </div>

                <div className="form-submit-row">
                  <button type="submit" disabled={isSubmitting} className="btn-cta btn-cta-navy">
                    {isSubmitting ? (
                      <span><i className="fas fa-spinner fa-spin" aria-hidden="true"></i> Submitting...</span>
                    ) : (
                      <span><i className="fas fa-paper-plane" aria-hidden="true"></i> Submit Admission Enquiry</span>
                    )}
                  </button>
                  <a
                    href="https://wa.me/919676233050?text=Hi%2C%20I%20want%20details%20about%20RITW%20Admissions%202026-27"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cta cta-btn-wa"
                  >
                    <i className="fab fa-whatsapp" aria-hidden="true"></i>
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* 4. Admission Process & Checklist Section */}
      <section id="eapcet" className="admissions-process-section">
        <div className="container">
          <div className="admission-split-grid">
            
            {/* Left: Step-by-Step Pathway */}
            <div>
              <span className="section-badge">TG EAPCET ADMISSION PATHWAY</span>
              <h2 className="section-title">Step-by-Step Counseling Process</h2>
              <div className="process-timeline">
                {ADMISSION_STEPS.map((item, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-num">{item.step}</div>
                    <div className="timeline-content">
                      <h4 className="timeline-title">{item.title}</h4>
                      <p className="timeline-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Academic Calendar Card */}
              <div id="calendar" className="quality-policy-card" style={{ marginTop: '24px', background: '#ffffff' }}>
                <div className="policy-badge" style={{ background: 'var(--ritw-navy-soft)', color: 'var(--ritw-navy-dark)', borderColor: 'var(--ritw-navy)' }}>
                  <i className="fas fa-calendar-alt" aria-hidden="true"></i>
                  <span>Autonomous Academic Calendar 2026–27</span>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--ritw-text-main)', marginTop: '10px', lineHeight: '1.6' }}>
                  Commencement of I Year B.Tech Classwork, Orientation Week, CIE Internal Examinations, and Autonomous Semester-End Theory/Practical schedules are published as per JNTUH Autonomous guidelines.
                </p>
              </div>
            </div>

            {/* Right: Required Certificates Checklist */}
            <div>
              <div id="certificates" className="certificates-checklist-card">
                <h3 className="checklist-title">
                  <i className="fas fa-clipboard-check" aria-hidden="true"></i>
                  <span>Original Certificates Checklist</span>
                </h3>
                <p className="checklist-sub">
                  Candidates must submit one set of original certificates and three sets of self-attested photocopies during reporting:
                </p>
                <ul className="certificates-list">
                  {CERTIFICATES.map((cert, idx) => (
                    <li key={idx}>
                      <i className="fas fa-file-alt" aria-hidden="true"></i>
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>

                <div id="fees" className="epass-info-box">
                  <i className="fas fa-hand-holding-usd" aria-hidden="true"></i>
                  <div>
                    <strong>Govt Fee Reimbursement &amp; Fee Structure (TS Epass):</strong>
                    <p>
                      Eligible SC, ST, BC, EBC, and Minority candidates admitted through TG EAPCET convenor quota can avail 100% government fee reimbursement as per Telangana state norms. Management and NRI quota fees are regulated as per AFRC guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Helpline Strip */}
      <section id="management" className="helpline-cta-strip">
        <div className="container helpline-inner">
          <div>
            <h3 className="helpline-title">Have Questions Regarding Management / NRI Quota Seats?</h3>
            <p className="helpline-desc">
              Contact our admissions counseling desk directly: <a href="tel:+919676233050">+91-967-623-3050</a> &bull; <a href="tel:+919550852672">+91-955-085-2672</a>
            </p>
          </div>
          <a
            href="https://wa.me/919676233050?text=Hi%2C%20I%20want%20details%20about%20RITW%20Admissions%202026-27"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta cta-btn-wa"
          >
            <i className="fab fa-whatsapp" aria-hidden="true"></i>
            <span>Chat with Counselor</span>
          </a>
        </div>
      </section>

    </div>
  );
}
