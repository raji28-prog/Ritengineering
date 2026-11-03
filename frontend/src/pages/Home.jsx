import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// 1. ORIGINAL FULL-WIDTH HERO SLIDER (6 Slides with Original Copy & Images)
const HERO_SLIDES = [
  {
    title: "Empowering Women in Engineering Excellence",
    subtitle: "Pioneering Technical Leadership in Hyderabad Since 2009",
    desc: "RITW nurtures innovation, leadership, and technical brilliance — shaping women engineers ready to create a smarter future.",
    badge: "UGC AUTONOMOUS • NAAC 'A' GRADE • NBA ACCREDITED",
    image: "/images/slider/RISHI_SLIDER_7.jpg",
    ctaText: "Admissions 2026–27",
    ctaLink: "/admissions",
    secondaryText: "About RITW",
    secondaryLink: "/about"
  },
  {
    title: "Innovate. Inspire. Impact.",
    subtitle: "Continuous 4-Year Campus Recruitment Training",
    desc: "Our students innovate through hands-on learning, research, and real-world industry exposure with tier-1 MNCs.",
    badge: "UGC AUTONOMOUS • NAAC 'A' GRADE • NBA ACCREDITED",
    image: "/images/slider/RISHI_SLIDER_2.jpg",
    ctaText: "Admissions 2026–27",
    ctaLink: "/admissions",
    secondaryText: "Contact Us",
    secondaryLink: "/contact"
  },
  {
    title: "A Campus that Transforms Dreams into Reality",
    subtitle: "World-Class Computing & Research Infrastructure",
    desc: "World-class infrastructure, expert doctoral faculty, and a vibrant learning environment opposite JNTU Metro.",
    badge: "UGC AUTONOMOUS • NAAC 'A' GRADE • NBA ACCREDITED",
    image: "/images/slider/RISHI_SLIDER_8.jpg",
    ctaText: "Admissions 2026–27",
    ctaLink: "/admissions",
    secondaryText: "About RITW",
    secondaryLink: "/about"
  },
  {
    title: "Where Ambitions Take Flight",
    subtitle: "Empowering Women in AI, ML & Emerging Tech",
    desc: "State-of-the-art facilities and a dynamic campus culture turn aspirations into high-impact engineering achievements.",
    badge: "UGC AUTONOMOUS • NAAC 'A' GRADE • NBA ACCREDITED",
    image: "/images/slider/RISHI_SLIDER_9.jpg",
    ctaText: "Admissions 2026–27",
    ctaLink: "/admissions",
    secondaryText: "Apply Now",
    secondaryLink: "/admissions"
  },
  {
    title: "Driven by Knowledge, Defined by Excellence",
    subtitle: "Industry-Aligned Autonomous R-26 Curricula",
    desc: "RITW's holistic approach blends academics with innovation, preparing women engineers to lead global enterprises.",
    badge: "UGC AUTONOMOUS • NAAC 'A' GRADE • NBA ACCREDITED",
    image: "/images/slider/RISHI_SLIDER_1.jpg",
    ctaText: "Admissions 2026–27",
    ctaLink: "/admissions",
    secondaryText: "Contact Us",
    secondaryLink: "/contact"
  },
  {
    title: "Creating Leaders, Building Futures",
    subtitle: "Comprehensive Mentorship & Global Exposure",
    desc: "Through mentorship, skill development, hackathons, and global exposure, RITW empowers every student to excel.",
    badge: "UGC AUTONOMOUS • NAAC 'A' GRADE • NBA ACCREDITED",
    image: "/images/slider/RISHI_SLIDER_4.jpg",
    ctaText: "Admissions 2026–27",
    ctaLink: "/admissions",
    secondaryText: "View Departments",
    secondaryLink: "/departments"
  }
];

// 2. FLOATING INSTITUTIONAL METRICS (VIT Style)
const FLOATING_STATS = [
  { icon: "fas fa-university", target: 10, suffix: " Years", title: "UGC Autonomous", sub: "Permanent Autonomy (2026–2036)" },
  { icon: "fas fa-award", textValue: "NAAC 'A'", title: "Grade Accredited", sub: "High institutional CGPA & benchmarks" },
  { icon: "fas fa-briefcase", target: 100, suffix: "%", title: "Placement CRT", sub: "Integrated 4-Year training with 50+ MNCs" },
  { icon: "fas fa-trophy", target: 7.5, isDecimal: true, suffix: " LPA", title: "Highest Package", sub: "Top tier salary in core software roles" }
];

// 3. WHY CHOOSE RITW - 12 STATISTICAL COUNTERS (From Original Site)
const WHY_CHOOSE_COUNTERS = [
  { icon: "fas fa-graduation-cap", target: 16, suffix: "", label: "Years of Academic Excellence" },
  { icon: "fas fa-chalkboard-teacher", target: 200, suffix: "+", label: "Faculty Members" },
  { icon: "fas fa-user-graduate", target: 1300, suffix: "+", label: "Students Enrolled" },
  { icon: "fas fa-flask", target: 5, suffix: "", label: "Sponsored Research Projects" },
  { icon: "fas fa-globe", target: 6, suffix: "", label: "International Partners" },
  { icon: "fas fa-lightbulb", target: 8, suffix: "", label: "Patents Published" },
  { icon: "fas fa-briefcase", target: 100, suffix: "%", label: "Placement Assistance (7.5 LPA)" },
  { icon: "fas fa-users", target: 6500, suffix: "+", label: "Alumni Network" },
  { icon: "fas fa-rocket", target: 10, suffix: "", label: "Startups Incubated" },
  { icon: "fas fa-book", target: 50, suffix: "+", label: "Annual Workshops" },
  { icon: "fas fa-microscope", target: 12, suffix: "", label: "Add-on Programs per Year" },
  { icon: "fas fa-handshake", target: 60, suffix: "+", label: "Cultural & Tech Events" }
];

// 4. WHY CHOOSE RITW - CAMPUS TILE SLIDER IMAGES
const WHY_CHOOSE_TILES = [
  { src: "/images/why_choose/1.webp", alt: "RITW Campus Infrastructure" },
  { src: "/images/why_choose/2.webp", alt: "AI & Computing Laboratories" },
  { src: "/images/why_choose/3.webp", alt: "Faculty Mentorship & Research" },
  { src: "/images/why_choose/4.webp", alt: "State-of-the-Art Central Library" },
  { src: "/images/why_choose/5.webp", alt: "Campus Placement Drives" },
  { src: "/images/why_choose/6.webp", alt: "Technical Hackathons & R&D" },
  { src: "/images/why_choose/7.webp", alt: "Cultural Celebrations & Fests" },
  { src: "/images/why_choose/8.webp", alt: "Student Sports & Fitness" },
  { src: "/images/why_choose/9.webp", alt: "Student Clubs & Communities" }
];

// 5. DEPARTMENTS DATA
const DEPARTMENTS_DATA = [
  {
    code: "CSE",
    name: "Computer Science & Engineering",
    seats: 180,
    badge: "NBA ACCREDITED",
    desc: "Core computing architecture, algorithms, distributed cloud systems, and enterprise software engineering.",
    icon: "fas fa-laptop-code",
    link: "/departments"
  },
  {
    code: "CSE-AIML",
    name: "CSE (Artificial Intelligence & ML)",
    seats: 180,
    badge: "HIGH DEMAND",
    desc: "Deep learning models, natural language processing, computer vision, and autonomous neural systems.",
    icon: "fas fa-brain",
    link: "/departments#aiml"
  },
  {
    code: "CSE-DS",
    name: "CSE (Data Science)",
    seats: 60,
    badge: "EMERGING TECH",
    desc: "Big data pipelines, statistical predictive modeling, business intelligence, and cloud analytics.",
    icon: "fas fa-database",
    link: "/departments#ds"
  },
  {
    code: "IT",
    name: "Information Technology",
    seats: 60,
    badge: "INDUSTRY READY",
    desc: "Full-stack web systems, cyber security protocols, DevOps automation, and enterprise cloud architecture.",
    icon: "fas fa-network-wired",
    link: "/departments#it"
  },
  {
    code: "ECE",
    name: "Electronics & Communication",
    seats: 60,
    badge: "VLSI & IOT",
    desc: "Embedded systems, VLSI microelectronics, 5G wireless communications, and IoT sensor arrays.",
    icon: "fas fa-microchip",
    link: "/departments#ece"
  }
];

// 6. NOTICES & UPCOMING EVENTS
const NOTICES = [
  { date: "15", month: "JUN", year: "2026", category: "Admissions", title: "TG EAPCET 2026 Convenor Quota Web Options Commencing — Enter College Code: RITW", link: "/admissions" },
  { date: "02", month: "JUN", year: "2026", category: "Examinations", title: "Autonomous B.Tech II & IV Year End Semester Examination Results Declared", link: "/departments#coe" },
  { date: "28", month: "MAY", year: "2026", category: "Placements", title: "Amazon & Capgemini Campus Placement Drive: 140+ Offers Received for Graduating Batch", link: "/placements" },
  { date: "18", month: "MAY", year: "2026", category: "R&D", title: "National Conference on Generative AI & Edge Computing Organized by CSE Department", link: "/departments#research" }
];

const UPCOMING_EVENTS = [
  { day: "24", month: "JUL", title: "Rishi Hackathon 2026: 24-Hour AI Prototype Buildathon", location: "AI & High Performance Lab", time: "09:30 AM" },
  { day: "12", month: "AUG", title: "Orientation Day & Induction Ceremony for B.Tech Batch 2026-30", location: "RITW Central Auditorium", time: "10:00 AM" },
  { day: "05", month: "SEP", title: "Annual Cultural & Technical Fest 'RISHI UTSAV 2026'", location: "College Main Grounds", time: "09:00 AM" }
];

// 7. TESTIMONIALS & RECRUITERS
const TESTIMONIALS = [
  {
    name: "Arshiya Anjum",
    role: "Software Development Engineer",
    company: "Placed at Capgemini",
    quote: "The outcome-based training and competitive coding challenges at RITW prepared me thoroughly for corporate technical interviews. The faculty's mentorship is unmatched.",
    image: "/images/testimonials/Arshiya Anjum.jpg"
  },
  {
    name: "Bharathula Venkata Lakshmi Sravani",
    role: "Cloud Associate Engineer",
    company: "Placed at Cognizant",
    quote: "RITW's autonomous curriculum gave us the exact tech stack required by tier-1 MNCs. The hands-on labs and Cisco certifications gave me an immense career edge.",
    image: "/images/testimonials/Bharathula Venkata Lakshmi Sravani.jpg"
  },
  {
    name: "Deekshitha Mandadi",
    role: "System Engineer",
    company: "Placed at TCS",
    quote: "From 2nd year onwards, the CRT trainers groomed our quantitative and verbal aptitude. Studying in an all-women's tech campus gave me tremendous confidence and leadership skills.",
    image: "/images/testimonials/Deekshitha Mandadi.jpg"
  },
  {
    name: "Vaishali Kaletle",
    role: "Software Engineer",
    company: "Placed at Wipro",
    quote: "The supportive hostel environment, round-the-clock lab access, and metro connectivity right at JNTU made my engineering journey at RITW smooth and rewarding.",
    image: "/images/testimonials/Vaishali Kaletle.jpg"
  }
];

const RECRUITERS = [
  { name: 'Amazon', logo: 'fab fa-amazon' },
  { name: 'Google Cloud', logo: 'fab fa-google' },
  { name: 'Capgemini', logo: 'fas fa-gem' },
  { name: 'TCS', logo: 'fas fa-building' },
  { name: 'Cognizant', logo: 'fas fa-laptop-code' },
  { name: 'Accenture', logo: 'fas fa-chart-line' },
  { name: 'Wipro', logo: 'fas fa-shield-alt' },
  { name: 'IBM', logo: 'fas fa-server' },
  { name: 'HCL Tech', logo: 'fas fa-code' },
  { name: 'Hexaware', logo: 'fas fa-robot' },
  { name: 'GlobalLogic', logo: 'fas fa-globe' },
  { name: 'Tech Mahindra', logo: 'fas fa-broadcast-tower' }
];

// 8. CAMPUS FACILITIES GALLERY
const GALLERY_ITEMS = [
  { title: "RITW Modern Academic Campus", cat: "campus", image: "/images/clg-infra-1-000.jpg" },
  { title: "Technical Coding Clubs & Labs", cat: "labs", image: "/images/tech-clubs.jpg" },
  { title: "Annual Cultural Festivities", cat: "culture", image: "/images/slider/Cultural.jpg" },
  { title: "Sports Complex & Athletic Grounds", cat: "sports", image: "/images/slider/Sports and Fitness.jpg" },
  { title: "Interactive Engineering Classrooms", cat: "campus", image: "/images/slider/Tech-Cult.jpg" },
  { title: "Student Research Hackathon Rigs", cat: "labs", image: "/images/slider/RISHI_SLIDER_4.jpg" }
];

// ============================================================================
// ANIMATED COUNTER COMPONENT (IntersectionObserver + Cubic Ease-Out)
// ============================================================================
function AnimatedCounter({ target, suffix = '', isDecimal = false, dur = 1400 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const t0 = performance.now();
            const ease = (t) => 1 - Math.pow(1 - t, 3);

            const tick = (now) => {
              const p = Math.min(1, (now - t0) / dur);
              const currentVal = target * ease(p);
              if (isDecimal) {
                setVal(parseFloat(currentVal.toFixed(1)));
              } else {
                setVal(Math.floor(currentVal));
              }
              if (p < 1) {
                requestAnimationFrame(tick);
              } else {
                setVal(target);
              }
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, dur, isDecimal]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

// ============================================================================
// CAMPUS TILE SLIDER COMPONENT (Auto-Scroll, Navigation, Lightbox Modal)
// ============================================================================
function TileSlider() {
  const [activeImgIdx, setActiveImgIdx] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const posRef = useRef(0);

  // Smooth continuous auto-scroll using requestAnimationFrame
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animId;
    const speed = 0.85;

    const scroll = () => {
      if (!isPaused && track) {
        posRef.current += speed;
        const halfWidth = track.scrollWidth / 2;
        if (posRef.current >= halfWidth) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animId = requestAnimationFrame(scroll);
    };

    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  // Keyboard navigation for image lightbox
  useEffect(() => {
    if (activeImgIdx === null) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setActiveImgIdx(null);
      if (e.key === 'ArrowRight') setActiveImgIdx((prev) => (prev + 1) % WHY_CHOOSE_TILES.length);
      if (e.key === 'ArrowLeft') setActiveImgIdx((prev) => (prev - 1 + WHY_CHOOSE_TILES.length) % WHY_CHOOSE_TILES.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeImgIdx]);

  const slideLeft = () => {
    posRef.current = Math.max(0, posRef.current - 320);
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
  };

  const slideRight = () => {
    const halfWidth = trackRef.current ? trackRef.current.scrollWidth / 2 : 1000;
    posRef.current = Math.min(halfWidth, posRef.current + 320);
    if (trackRef.current) trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
  };

  // Double the list for infinite seamless scrolling
  const duplicatedTiles = [...WHY_CHOOSE_TILES, ...WHY_CHOOSE_TILES];

  return (
    <>
      <div 
        className="tile-slider-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <button 
          type="button" 
          className="tile-ctrl-btn tile-ctrl-prev" 
          onClick={slideLeft}
          aria-label="Previous Campus Photo"
        >
          <i className="fas fa-chevron-left" aria-hidden="true"></i>
        </button>

        <div className="tile-slider-track" ref={trackRef}>
          {duplicatedTiles.map((tile, idx) => (
            <div 
              key={idx} 
              className="tile-item"
              onClick={() => setActiveImgIdx(idx % WHY_CHOOSE_TILES.length)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setActiveImgIdx(idx % WHY_CHOOSE_TILES.length)}
              aria-label={`View photo: ${tile.alt}`}
            >
              <img src={tile.src} alt={tile.alt} className="tile-img" loading="lazy" />
              <div className="tile-overlay">
                <span className="tile-tag">CAMPUS VIBES</span>
                <span className="tile-title">{tile.alt}</span>
              </div>
            </div>
          ))}
        </div>

        <button 
          type="button" 
          className="tile-ctrl-btn tile-ctrl-next" 
          onClick={slideRight}
          aria-label="Next Campus Photo"
        >
          <i className="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>

      {/* Lightbox Modal */}
      {activeImgIdx !== null && (
        <div className="tile-lightbox" onClick={() => setActiveImgIdx(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="lightbox-close" 
              onClick={() => setActiveImgIdx(null)}
              aria-label="Close Lightbox"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
            <button 
              type="button" 
              className="lightbox-nav prev"
              onClick={() => setActiveImgIdx((prev) => (prev - 1 + WHY_CHOOSE_TILES.length) % WHY_CHOOSE_TILES.length)}
              aria-label="Previous Image"
            >
              <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </button>
            <img 
              src={WHY_CHOOSE_TILES[activeImgIdx].src} 
              alt={WHY_CHOOSE_TILES[activeImgIdx].alt} 
              className="lightbox-img" 
            />
            <div className="lightbox-caption">{WHY_CHOOSE_TILES[activeImgIdx].alt}</div>
            <button 
              type="button" 
              className="lightbox-nav next"
              onClick={() => setActiveImgIdx((prev) => (prev + 1) % WHY_CHOOSE_TILES.length)}
              aria-label="Next Image"
            >
              <i className="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// MAIN HOME COMPONENT
// ============================================================================
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  // 1. Hero Slider Autoplay (4.5s with pause-on-hover)
  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHeroPaused]);

  // 2. Scroll Reveal Observer for page animations
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08 }
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const filteredGallery = galleryFilter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter((item) => item.cat === galleryFilter);

  return (
    <div className="home-page">
      
      {/* 1. RESTORED FULL-WIDTH HERO SLIDER WITH KEN BURNS ZOOM & CONTROLS */}
      <section 
        className="hero-slider-section" 
        aria-label="RITW Campus Highlights"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
      >
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`hero-slide ${isActive ? 'active' : ''}`}
            >
              {/* Cinematic Ambient Blurred Backdrop (Saveetha Reference) */}
              <div 
                className="hero-blur-backdrop" 
                style={{ backgroundImage: `url(${slide.image})` }} 
                aria-hidden="true" 
              />
              {/* Background image with Ken Burns slow zoom */}
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="ritw-hero-bg-img" 
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="hero-overlay"></div>
              
              <div className="container hero-content">
                <span className="hero-badge-pill">
                  <i className="fas fa-university" aria-hidden="true"></i>
                  <span>{slide.badge}</span>
                </span>
                <h1 className="hero-title">{slide.title}</h1>
                <div className="hero-subtitle">{slide.subtitle}</div>
                <p className="hero-text">{slide.desc}</p>
                
                <div className="hero-actions">
                  <Link to={slide.ctaLink} className="btn-cta btn-cta-green">
                    <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                    <span>{slide.ctaText}</span>
                    <i className="fas fa-arrow-right" aria-hidden="true" style={{ fontSize: '12px' }}></i>
                  </Link>
                  <Link to={slide.secondaryLink} className="btn-cta hero-btn-secondary">
                    <i className="fas fa-compass" aria-hidden="true"></i>
                    <span>{slide.secondaryText}</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Slide Navigation Arrows */}
        <button 
          type="button" 
          className="slider-arrow slider-arrow-left" 
          onClick={prevSlide} 
          aria-label="Previous Slide"
        >
          <i className="fas fa-chevron-left" aria-hidden="true"></i>
        </button>
        <button 
          type="button" 
          className="slider-arrow slider-arrow-right" 
          onClick={nextSlide} 
          aria-label="Next Slide"
        >
          <i className="fas fa-chevron-right" aria-hidden="true"></i>
        </button>

        {/* Slide Counter & Indicators */}
        <div className="slider-bottom-controls">
          <div className="slider-counter">
            <span className="current">0{currentSlide + 1}</span>
            <span className="sep"> / </span>
            <span className="total">0{HERO_SLIDES.length}</span>
          </div>
          <div className="slider-dots">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. FLOATING INSTITUTIONAL METRICS STRIP (With Animated Counters) */}
      <section className="stats-strip-wrapper">
        <div className="container">
          <div className="stats-strip-grid">
            {FLOATING_STATS.map((stat, idx) => (
              <div key={idx} className="stats-strip-card reveal">
                <div className="stats-strip-icon">
                  <i className={stat.icon} aria-hidden="true"></i>
                </div>
                <div className="stats-strip-body">
                  <div className="stats-strip-value">
                    {stat.textValue ? (
                      stat.textValue
                    ) : (
                      <AnimatedCounter 
                        target={stat.target} 
                        suffix={stat.suffix} 
                        isDecimal={stat.isDecimal} 
                      />
                    )}
                  </div>
                  <div className="stats-strip-title">{stat.title}</div>
                  <div className="stats-strip-sub">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT INSTITUTIONAL PROFILE */}
      <section className="about-overview-section reveal">
        <div className="container">
          <div className="about-overview-grid">
            
            {/* Left Column: Text & Accreditations */}
            <div className="about-overview-text">
              <span className="section-badge">INSTITUTIONAL PROFILE</span>
              <h2 className="section-title">
                Hyderabad's Premier Women's Engineering College Since 2009
              </h2>
              <p className="lead-paragraph">
                <strong>Rishi M.S Institute of Engineering &amp; Technology for Women (RITW)</strong> was founded in 2009 under the noble guidance of Bharat Ratna Smt. M.S. Subbulakshmi to provide transformative engineering education exclusively for women.
              </p>
              <p className="body-paragraph">
                Conferred with <strong>UGC Autonomous</strong> status and accredited with <strong>'A' Grade by NAAC</strong>, RITW is affiliated to Jawaharlal Nehru Technological University Hyderabad (JNTUH) and approved by AICTE. We offer high-impact engineering programs in CSE, AI &amp; ML, Data Science, IT, and ECE.
              </p>

              <div className="about-key-points">
                <div className="point-item">
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <span>100% Industry-Aligned Autonomous Syllabi</span>
                </div>
                <div className="point-item">
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <span>Right Opposite JNTU Metro Station (Red Line)</span>
                </div>
                <div className="point-item">
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <span>Cisco Networking Academy &amp; TASK Partner</span>
                </div>
                <div className="point-item">
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  <span>Strictly Ragging-Free Campus with 24/7 Security</span>
                </div>
              </div>

              <div className="about-cta-row">
                <Link to="/about" className="btn-cta btn-cta-navy">
                  <span>Explore College Profile</span>
                  <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </Link>
                <Link to="/admissions" className="btn-cta btn-cta-green">
                  <i className="fas fa-user-graduate" aria-hidden="true"></i>
                  <span>Admissions 2026–27</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Campus Image & Experience Card */}
            <div className="about-overview-media">
              <div className="media-frame">
                <img 
                  src="/images/clg-infra-1-000.jpg" 
                  alt="RITW Modern Campus Infrastructure" 
                  className="campus-main-img"
                  onError={(e) => { e.currentTarget.src = '/images/slider/RISHI_SLIDER_1.jpg'; }}
                />
              </div>
              <div className="experience-badge-card">
                <div className="exp-icon">
                  <i className="fas fa-award" aria-hidden="true"></i>
                </div>
                <div>
                  <div className="exp-num">16+ Years</div>
                  <div className="exp-label">Of Educational &amp; Research Excellence</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE RITW - TILE SLIDER & 12 STATISTICAL COUNTERS (RESTORED ORIGINAL ANIMATIONS) */}
      <section className="why-ritw-section reveal">
        <div className="container">
          <div className="why-ritw-header">
            <span className="section-badge">BENCHMARKS OF EXCELLENCE</span>
            <h2 className="section-title">Why Choose RISHI MS (RITW)?</h2>
            <p className="section-subtitle">
              Pioneering women's technical leadership with outcome-driven autonomous academics, cutting-edge AI laboratories, and 100% placement support.
            </p>
          </div>

          {/* Continuous Campus Life Photo Marquee */}
          <TileSlider />

          {/* 12 Animated Statistical Counters */}
          <div className="counters-grid reveal" style={{ marginTop: '40px' }}>
            {WHY_CHOOSE_COUNTERS.map((item, idx) => (
              <div key={idx} className="counter-card">
                <div className="counter-icon">
                  <i className={item.icon} aria-hidden="true"></i>
                </div>
                <div className="counter-val">
                  <AnimatedCounter target={item.target} suffix={item.suffix} />
                </div>
                <div className="counter-desc">{item.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ACADEMIC PROGRAMS & SPECIALIZATIONS (VIT Style Explorer) */}
      <section className="programs-section reveal">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">APPROVED DEGREE PROGRAMS</span>
            <h2 className="section-title">Undergraduate Engineering Disciplines</h2>
            <p className="section-subtitle">
              All B.Tech programs are approved by AICTE, New Delhi, and permanently affiliated to JNTUH under Autonomous regulations.
            </p>
          </div>

          <div className="programs-grid">
            {DEPARTMENTS_DATA.map((prog, idx) => (
              <div key={idx} className="program-card">
                <div className="program-card-header">
                  <div className="program-icon-box">
                    <i className={prog.icon} aria-hidden="true"></i>
                  </div>
                  <span className="program-badge">{prog.badge}</span>
                </div>
                <h3 className="program-title">{prog.name}</h3>
                <p className="program-desc">{prog.desc}</p>
                
                <div className="program-meta-row">
                  <div className="meta-item">
                    <span className="meta-label">Approved Intake:</span>
                    <strong className="meta-val">{prog.seats} Seats</strong>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Duration:</span>
                    <strong className="meta-val">4 Years</strong>
                  </div>
                </div>

                <div className="program-card-footer">
                  <Link to={prog.link} className="program-link">
                    <span>Curriculum &amp; Labs</span>
                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                  </Link>
                  <Link to="/admissions#enquiry-form" className="program-apply-btn">
                    Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VIT-STYLE NOTICE BOARD & UPCOMING EVENTS HUB */}
      <section className="notice-hub-section reveal">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">CAMPUS BULLETIN</span>
            <h2 className="section-title">Notices, Circulars &amp; Upcoming Events</h2>
            <p className="section-subtitle">Real-time official announcements, exam timetables, and academic calendars.</p>
          </div>

          <div className="notice-hub-grid">
            {/* Col 1: Official Announcements */}
            <div className="notice-column">
              <div className="notice-col-header">
                <i className="fas fa-bullhorn" aria-hidden="true"></i>
                <h3>Official Circulars</h3>
              </div>
              <div className="notice-list">
                {NOTICES.map((item, idx) => (
                  <Link key={idx} to={item.link} className="notice-card-item">
                    <div className="notice-date-box">
                      <span className="notice-day">{item.date}</span>
                      <span className="notice-month">{item.month}</span>
                    </div>
                    <div className="notice-info">
                      <span className="notice-category-badge">{item.category}</span>
                      <h4 className="notice-item-title">{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Col 2: Upcoming Events & Hackathons */}
            <div className="notice-column">
              <div className="notice-col-header">
                <i className="fas fa-calendar-alt" aria-hidden="true"></i>
                <h3>Upcoming Events</h3>
              </div>
              <div className="events-list">
                {UPCOMING_EVENTS.map((event, idx) => (
                  <div key={idx} className="event-card-item">
                    <div className="event-date-badge">
                      <span className="ev-day">{event.day}</span>
                      <span className="ev-month">{event.month}</span>
                    </div>
                    <div className="event-details">
                      <h4 className="event-title">{event.title}</h4>
                      <div className="event-meta">
                        <span><i className="fas fa-map-marker-alt" aria-hidden="true"></i> {event.location}</span>
                        <span><i className="fas fa-clock" aria-hidden="true"></i> {event.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 3: Quick Student & Parent Portals */}
            <div className="notice-column notice-portals-col">
              <div className="notice-col-header">
                <i className="fas fa-external-link-alt" aria-hidden="true"></i>
                <h3>Institutional Desks</h3>
              </div>
              <div className="portals-box-list">
                <Link to="/departments#coe" className="portal-action-tile">
                  <div className="portal-icon"><i className="fas fa-graduation-cap" aria-hidden="true"></i></div>
                  <div>
                    <div className="tile-title">Controller of Examinations</div>
                    <div className="tile-desc">Semester notifications &amp; Grade cards</div>
                  </div>
                </Link>
                <Link to="/admissions#fees" className="portal-action-tile">
                  <div className="portal-icon"><i className="fas fa-receipt" aria-hidden="true"></i></div>
                  <div>
                    <div className="tile-title">Fee Structure &amp; TS Epass</div>
                    <div className="tile-desc">Government fee reimbursement eligibility</div>
                  </div>
                </Link>
                <Link to="/placements" className="portal-action-tile">
                  <div className="portal-icon"><i className="fas fa-briefcase" aria-hidden="true"></i></div>
                  <div>
                    <div className="tile-title">Placement Track Record</div>
                    <div className="tile-desc">Tier-1 recruiters &amp; packages</div>
                  </div>
                </Link>
                <Link to="/about#wec" className="portal-action-tile">
                  <div className="portal-icon"><i className="fas fa-shield-alt" aria-hidden="true"></i></div>
                  <div>
                    <div className="tile-title">Women Protection Cell (WEC)</div>
                    <div className="tile-desc">24/7 dedicated security &amp; redressal</div>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. PLACEMENTS & RECRUITERS SHOWCASE */}
      <section className="placements-showcase-section reveal">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">CAREER SUCCESS</span>
            <h2 className="section-title">Industry Collaborators &amp; Recruiters</h2>
            <p className="section-subtitle">
              Graduating engineers at RITW receive continuous training in algorithms, cloud, and AI tools with placements up to 7.5 LPA.
            </p>
          </div>

          {/* Recruiter Logos Grid */}
          <div className="recruiters-grid">
            {RECRUITERS.map((rec, idx) => (
              <div key={idx} className="recruiter-chip">
                <i className={rec.logo} aria-hidden="true"></i>
                <span>{rec.name}</span>
              </div>
            ))}
          </div>

          {/* Student Success Testimonials */}
          <div className="testimonials-row">
            <h3 className="testimonials-heading">Placed Scholars Share Their Journey</h3>
            <div className="testimonials-grid">
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="testimonial-card">
                  <div className="testimonial-header">
                    <img 
                      src={t.image} 
                      alt={t.name} 
                      className="test-avatar" 
                      onError={(e) => { e.currentTarget.src = '/images/testimonials/Arshiya Anjum.jpg'; }}
                    />
                    <div>
                      <h4 className="test-name">{t.name}</h4>
                      <div className="test-company">{t.company}</div>
                      <div className="test-role">{t.role}</div>
                    </div>
                  </div>
                  <p className="test-quote">
                    <i className="fas fa-quote-left quote-icon" aria-hidden="true"></i>
                    {t.quote}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 8. CAMPUS INFRASTRUCTURE & LIFE GALLERY */}
      <section className="gallery-section reveal">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">CAMPUS LIFE &amp; FACILITIES</span>
            <h2 className="section-title">Experience the RITW Atmosphere</h2>
            <p className="section-subtitle">A modern, secure, and vibrant engineering campus designed for women leaders.</p>
          </div>

          {/* Filter Tabs */}
          <div className="gallery-filter-bar">
            <button 
              type="button" 
              className={`filter-btn ${galleryFilter === 'all' ? 'active' : ''}`}
              onClick={() => setGalleryFilter('all')}
            >
              All Facilities
            </button>
            <button 
              type="button" 
              className={`filter-btn ${galleryFilter === 'campus' ? 'active' : ''}`}
              onClick={() => setGalleryFilter('campus')}
            >
              Campus &amp; Classrooms
            </button>
            <button 
              type="button" 
              className={`filter-btn ${galleryFilter === 'labs' ? 'active' : ''}`}
              onClick={() => setGalleryFilter('labs')}
            >
              AI &amp; Computing Labs
            </button>
            <button 
              type="button" 
              className={`filter-btn ${galleryFilter === 'culture' ? 'active' : ''}`}
              onClick={() => setGalleryFilter('culture')}
            >
              Cultural Events
            </button>
            <button 
              type="button" 
              className={`filter-btn ${galleryFilter === 'sports' ? 'active' : ''}`}
              onClick={() => setGalleryFilter('sports')}
            >
              Sports &amp; Fitness
            </button>
          </div>

          {/* Gallery Grid */}
          <div className="gallery-grid">
            {filteredGallery.map((item, idx) => (
              <div key={idx} className="gallery-card">
                <img src={item.image} alt={item.title} className="gallery-img" />
                <div className="gallery-overlay">
                  <h4 className="gallery-title">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. LEADERSHIP DESK SPOTLIGHT */}
      <section className="leadership-section reveal">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">INSPIRATIONAL LEADERSHIP</span>
            <h2 className="section-title">Guiding Pillars of RITW</h2>
            <p className="section-subtitle">Dedicated governance ensuring academic excellence and student success.</p>
          </div>

          <div className="leadership-grid">
            {/* Founder Patron */}
            <div className="leader-card">
              <div className="leader-photo-wrap">
                <img 
                  src="/images/ms_subbu_lakshmi_rishi_college.webp" 
                  alt="Bharat Ratna Smt. M.S. Subbulakshmi" 
                  className="leader-photo"
                  onError={(e) => { e.currentTarget.src = '/images/Dr.ARCHANA BABURAO PATIL.jpg'; }}
                />
              </div>
              <div className="leader-badge">PATRON &amp; INSPIRATION</div>
              <h3 className="leader-name">Bharat Ratna (Late) Smt. M.S. Subbulakshmi</h3>
              <div className="leader-title">Legendary Classical Vocalist &amp; Humanitarian</div>
              <p className="leader-desc">
                Whose ideals of dedication, simplicity, and cultural integrity inspire the foundational ethos of Rishi MS Institute of Engineering &amp; Technology for Women.
              </p>
            </div>

            {/* Secretary */}
            <div className="leader-card">
              <div className="leader-photo-wrap">
                <img 
                  src="/images/Ms .Jayasree - SECRETARY - RITW.png" 
                  alt="Smt. M. Jayasree" 
                  className="leader-photo"
                  onError={(e) => { e.currentTarget.src = '/images/Dr.ARCHANA BABURAO PATIL.jpg'; }}
                />
              </div>
              <div className="leader-badge">SECRETARY &amp; CORRESPONDENT</div>
              <h3 className="leader-name">Smt. M. Jayasree</h3>
              <div className="leader-title">Institutional Visionary</div>
              <p className="leader-desc">
                Spearheading modern infrastructure, academic modernization, UGC Autonomous implementation, and comprehensive student welfare initiatives.
              </p>
            </div>

            {/* Principal */}
            <div className="leader-card">
              <div className="leader-photo-wrap">
                <img 
                  src="/images/Dr JEELANI.png" 
                  alt="Dr. Md. Jeelani" 
                  className="leader-photo"
                  onError={(e) => { e.currentTarget.src = '/images/Dr.ARCHANA BABURAO PATIL.jpg'; }}
                />
              </div>
              <div className="leader-badge">PRINCIPAL</div>
              <h3 className="leader-name">Dr. Md. Jeelani</h3>
              <div className="leader-title">M.Tech., Ph.D., Academic Administrator</div>
              <p className="leader-desc">
                Veteran engineering administrator driving outcome-based education, continuous research publications, and 100% placement training for young women engineers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. ADMISSIONS 2026-27 CALL TO ACTION STRIP */}
      <section className="cta-banner-section reveal">
        <div className="container cta-banner-inner">
          <div className="cta-banner-content">
            <span className="cta-tag">TG EAPCET CODE: RITW</span>
            <h2 className="cta-title">Begin Your Engineering Career at RITW</h2>
            <p className="cta-desc">
              Admissions are open for B.Tech in CSE, AI &amp; ML, Data Science, IT, and ECE. Choose <strong>RITW</strong> in your web options or contact our admissions desk for management quota guidance.
            </p>
            <div className="cta-actions">
              <Link to="/admissions" className="btn-cta btn-cta-green">
                <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                <span>Apply for Admissions 2026–27</span>
              </Link>
              <a 
                href="https://wa.me/919676233050?text=Hi%2C%20I%20want%20details%20about%20RITW%20Admissions%202026-27"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta cta-btn-wa"
              >
                <i className="fab fa-whatsapp" aria-hidden="true"></i>
                <span>Chat on WhatsApp</span>
              </a>
              <a href="tel:+919676233050" className="btn-cta cta-btn-outline">
                <i className="fas fa-phone-alt" aria-hidden="true"></i>
                <span>Call +91-967-623-3050</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
