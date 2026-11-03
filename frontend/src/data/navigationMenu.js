export const NAVIGATION_MENU = [
  {
    title: "Home",
    path: "/",
    isInternal: true
  },
  {
    title: "About",
    path: "/about",
    isInternal: true,
    submenus: [
      {
        heading: "The Institution",
        icon: "fas fa-university",
        links: [
          { title: "About Our College 'RITW'", path: "/about", isInternal: true },
          { title: "Vision, Mission & Quality Policy", path: "/about#vision", isInternal: true },
          { title: "Objectives & Aspirations", path: "/about#objectives", isInternal: true },
          { title: "Institution Development Plan", path: "/about#idp", isInternal: true }
        ]
      },
      {
        heading: "Leadership",
        icon: "fas fa-user-tie",
        links: [
          { title: "Founder Smt. M.S. Subbulakshmi", path: "/about#founder", isInternal: true },
          { title: "Secretary Message", path: "/about#secretary", isInternal: true },
          { title: "Principal's Desk", path: "/about#principal", isInternal: true },
          { title: "Governing Body Members", path: "/governance#governing-body", isInternal: true }
        ]
      },
      {
        heading: "Accreditations",
        icon: "fas fa-certificate",
        links: [
          { title: "UGC Autonomous Status", path: "/accreditation#ugc", isInternal: true },
          { title: "NAAC 'A' Grade Accreditation", path: "/accreditation#naac", isInternal: true },
          { title: "NBA Accredited Programs", path: "/accreditation#nba", isInternal: true },
          { title: "AICTE Mandatory Disclosures", path: "/accreditation#aicte", isInternal: true }
        ]
      }
    ]
  },
  {
    title: "Academics",
    path: "/academics",
    isInternal: true,
    submenus: [
      {
        heading: "Academic Framework",
        icon: "fas fa-graduation-cap",
        links: [
          { title: "Autonomous Curriculum & Syllabi (R-26)", path: "/academics#curriculum", isInternal: true },
          { title: "University Academic Calendar", path: "/academics#calendar", isInternal: true },
          { title: "Institution Academic Calendar", path: "/academics#calendar", isInternal: true },
          { title: "Evaluation & Grading System", path: "/academics#grading", isInternal: true },
          { title: "CO'S and PO'S (Outcome-Based Education)", path: "/academics#pedagogy", isInternal: true }
        ]
      },
      {
        heading: "Examination Branch & COE",
        icon: "fas fa-clipboard-check",
        links: [
          { title: "About Exam Branch & COE Desk", path: "/examinations#coe", isInternal: true },
          { title: "Autonomous Results Portal", path: "/examinations#results", isInternal: true },
          { title: "Exam Time Table & Notifications", path: "/examinations#notifications", isInternal: true },
          { title: "Punishment for Malpractice Case", path: "/examinations#malpractice", isInternal: true },
          { title: "Download Applications & Forms", path: "/examinations#forms", isInternal: true }
        ]
      }
    ]
  },
  {
    title: "Departments",
    path: "/departments",
    isInternal: true,
    submenus: [
      {
        heading: "Computing & Software",
        icon: "fas fa-laptop-code",
        links: [
          { title: "Computer Science & Engineering (CSE)", path: "/departments", isInternal: true },
          { title: "Information Technology (IT)", path: "/departments#it", isInternal: true }
        ]
      },
      {
        heading: "AI & Data Science",
        icon: "fas fa-brain",
        links: [
          { title: "CSE (Artificial Intelligence & ML)", path: "/departments#aiml", isInternal: true },
          { title: "CSE (Data Science)", path: "/departments#ds", isInternal: true }
        ]
      },
      {
        heading: "Electronics & Hardware",
        icon: "fas fa-microchip",
        links: [
          { title: "Electronics & Communication (ECE)", path: "/departments#ece", isInternal: true },
          { title: "IoT & Embedded Systems Lab", path: "/departments#labs", isInternal: true }
        ]
      },
      {
        heading: "Centers & Labs",
        icon: "fas fa-server",
        links: [
          { title: "AI & High-Performance Computing Lab", path: "/departments#labs", isInternal: true },
          { title: "Cloud & Cybersecurity Center", path: "/departments#labs", isInternal: true },
          { title: "Central Library & Digital Assets", path: "/facilities#library", isInternal: true }
        ]
      }
    ]
  },
  {
    title: "Admissions",
    path: "/admissions",
    isInternal: true,
    submenus: [
      {
        heading: "Admissions 2026-27",
        icon: "fas fa-graduation-cap",
        links: [
          { title: "Intake & Eligibility Criteria", path: "/admissions", isInternal: true },
          { title: "TG EAPCET Convenor Quota (Code: RITW)", path: "/admissions#eapcet", isInternal: true },
          { title: "Management / NRI Quota Admissions", path: "/admissions#management", isInternal: true },
          { title: "Fee Structure & TS Epass Scholarships", path: "/admissions#fees", isInternal: true },
          { title: "Required Certificates Checklist", path: "/admissions#certificates", isInternal: true },
          { title: "Submit Admission Enquiry Online", path: "/admissions#enquiry-form", isInternal: true }
        ]
      }
    ]
  },
  {
    title: "Placements",
    path: "/placements",
    isInternal: true,
    submenus: [
      {
        heading: "Placement Cell",
        icon: "fas fa-briefcase",
        links: [
          { title: "About Placement Cell", path: "/placements", isInternal: true },
          { title: "Head of Training & Placements (TPO)", path: "/placements#tpo", isInternal: true },
          { title: "Placement Cell Infrastructure", path: "/placements#tpo", isInternal: true },
          { title: "Rankings and Highlights", path: "/placements", isInternal: true },
          { title: "Pre Placement Training (4-Year CRT)", path: "/placements#tpo", isInternal: true }
        ]
      },
      {
        heading: "Industry & COE",
        icon: "fas fa-handshake",
        links: [
          { title: "Center of Excellence - SAP Code Unnati", path: "/research#coe-labs", isInternal: true },
          { title: "Center of Excellence - Honeywell", path: "/research#coe-labs", isInternal: true },
          { title: "Incubation Cell & Startups", path: "/research#incubation", isInternal: true },
          { title: "MoU's and Partnership Programs", path: "/placements#mous", isInternal: true },
          { title: "Industrial Visits & Internships", path: "/academics#pedagogy", isInternal: true }
        ]
      },
      {
        heading: "Recruitment Drives",
        icon: "fas fa-chart-line",
        links: [
          { title: "Top Recruiters Grid", path: "/placements#recruiters", isInternal: true },
          { title: "Top Companies Visited & Highest Packages", path: "/placements", isInternal: true },
          { title: "2026 and Upcoming Placements", path: "/placements", isInternal: true },
          { title: "Placed Scholars Testimonials", path: "/placements#tpo", isInternal: true }
        ]
      }
    ]
  },
  {
    title: "Accreditation",
    path: "/accreditation",
    isInternal: true,
    submenus: [
      {
        heading: "UGC Autonomous",
        icon: "fas fa-university",
        links: [
          { title: "UGC Autonomous Status (2026–2036)", path: "/accreditation#ugc", isInternal: true },
          { title: "Autonomy Regulations & Advantages", path: "/accreditation#ugc", isInternal: true },
          { title: "Autonomous Academic Council", path: "/governance#academic-council", isInternal: true }
        ]
      },
      {
        heading: "NAAC & NBA",
        icon: "fas fa-award",
        links: [
          { title: "NAAC 'A' Grade Accreditation", path: "/accreditation#naac", isInternal: true },
          { title: "NAAC 7-Criteria Score Breakdown", path: "/accreditation#naac", isInternal: true },
          { title: "NBA Accredited B.Tech Programs", path: "/accreditation#nba", isInternal: true }
        ]
      },
      {
        heading: "Rankings & Disclosures",
        icon: "fas fa-file-contract",
        links: [
          { title: "NIRF Verified Data & Disclosures", path: "/accreditation#nirf", isInternal: true },
          { title: "IQAC Quality Cell & AQAR Reports", path: "/accreditation#iqac", isInternal: true },
          { title: "AICTE Mandatory Disclosures (EOA)", path: "/accreditation#aicte", isInternal: true }
        ]
      }
    ]
  },
  {
    title: "Campus Life",
    path: "/campus-life",
    isInternal: true,
    submenus: [
      {
        heading: "Student Experience",
        icon: "fas fa-users",
        links: [
          { title: "Student Experience Overview", path: "/campus-life#overview", isInternal: true },
          { title: "Annual Cultural Fest 'Rishi Utsav'", path: "/campus-life#cultural", isInternal: true },
          { title: "Campus Photo Gallery", path: "/campus-life#gallery", isInternal: true }
        ]
      },
      {
        heading: "Technical Clubs",
        icon: "fas fa-robot",
        links: [
          { title: "Google Developer Student Club (GDSC)", path: "/campus-life#clubs", isInternal: true },
          { title: "CodeRishi Competitive Programming", path: "/campus-life#clubs", isInternal: true },
          { title: "Robotics & IoT Innovation Hub", path: "/campus-life#clubs", isInternal: true }
        ]
      },
      {
        heading: "Community & Sports",
        icon: "fas fa-heartbeat",
        links: [
          { title: "NSS & Rural Village Outreach", path: "/campus-life#nss", isInternal: true },
          { title: "Women Empowerment Cell (WEC)", path: "/campus-life#wec", isInternal: true },
          { title: "Sports Complex & Gymnasium", path: "/campus-life#sports", isInternal: true }
        ]
      }
    ]
  },
  {
    title: "Governance",
    path: "/governance",
    isInternal: true,
    submenus: [
      {
        heading: "Administrative Councils",
        icon: "fas fa-balance-scale",
        links: [
          { title: "Governing Body Members", path: "/governance#governing-body", isInternal: true },
          { title: "Academic Council", path: "/governance#academic-council", isInternal: true },
          { title: "Board of Studies (BOS)", path: "/governance#bos", isInternal: true },
          { title: "Finance Committee", path: "/governance#finance", isInternal: true }
        ]
      },
      {
        heading: "Statutory Committees",
        icon: "fas fa-shield-alt",
        links: [
          { title: "Anti-Ragging Squad & Committee", path: "/governance#committees", isInternal: true },
          { title: "Internal Complaints Committee (ICC)", path: "/governance#committees", isInternal: true },
          { title: "Grievance Redressal Cell", path: "/governance#committees", isInternal: true },
          { title: "Institutional Organogram", path: "/governance#organogram", isInternal: true }
        ]
      }
    ]
  },
  {
    title: "Media & Connect",
    path: "/contact",
    isInternal: true,
    submenus: [
      {
        heading: "Connect with RITW",
        icon: "fas fa-map-marker-alt",
        links: [
          { title: "Contact Us & Campus Location", path: "/contact", isInternal: true },
          { title: "Opposite JNTU Metro Transit", path: "/facilities#transport", isInternal: true },
          { title: "Institute Bus Fleet Routes", path: "/facilities#transport", isInternal: true },
          { title: "Campus Photo Gallery", path: "/campus-life#gallery", isInternal: true }
        ]
      }
    ]
  }
];

export const COLLEGE_INFO = {
  name: "Rishi M.S Institute of Engineering & Technology for Women",
  shortName: "RITW",
  code: "RITW",
  eapcetCode: "RITW",
  phone: "+91-967-623-3050",
  secondaryPhone: "+91-9121214081",
  email: "info@rishimsengg.ac.in",
  admissionsEmail: "admissions@rishimsengg.ac.in",
  address: "Kukatpally, Near JNTU Metro, Hyderabad – 500 085",
  accreditations: [
    { title: "UGC Autonomous", badge: "UGC", class: "ugc", path: "/accreditation#ugc" },
    { title: "NAAC 'A' Grade", badge: "NAAC 'A'", class: "naac", path: "/accreditation#naac" },
    { title: "NBA Accredited", badge: "NBA", class: "nba", path: "/accreditation#nba" },
    { title: "NIRF Ranked", badge: "NIRF", class: "nirf", path: "/accreditation#nirf" }
  ]
};
