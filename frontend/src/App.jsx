import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Admissions from './pages/Admissions';
import Departments from './pages/Departments';
import Placements from './pages/Placements';
import Governance from './pages/Governance';
import Academics from './pages/Academics';
import Examinations from './pages/Examinations';
import Research from './pages/Research';
import CampusLife from './pages/CampusLife';
import Facilities from './pages/Facilities';
import Accreditation from './pages/Accreditation';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Handles automatic redirection from old/stale anchors to the new dedicated submenu routes
function LegacyRedirectHandler() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Normalize .html or /index.html paths
    const lowerPath = pathname.toLowerCase();
    if (lowerPath === '/index.html') {
      navigate('/' + (hash || ''), { replace: true });
      return;
    }
    if (lowerPath.endsWith('/index.html')) {
      const clean = lowerPath.replace(/\/index\.html$/, '') || '/';
      navigate(clean + (hash || ''), { replace: true });
      return;
    }
    if (lowerPath.endsWith('.html')) {
      const clean = lowerPath.replace(/\.html$/, '');
      navigate(clean + (hash || ''), { replace: true });
      return;
    }

    const legacyRedirects = {
      '/departments#coe': '/examinations#coe',
      '/departments#exams': '/examinations',
      '/departments#results': '/examinations#results',
      '/departments#exam-notifications': '/examinations#notifications',
      '/departments#curriculum': '/academics#curriculum',
      '/departments#syllabus': '/academics#curriculum',
      '/departments#grading': '/academics#grading',
      '/departments#research': '/research',
      '/departments#rd': '/research#rd',
      '/departments#patents': '/research#patents',
      '/departments#projects': '/research#incubation',
      '/about#governance': '/governance',
      '/about#governing-body': '/governance#governing-body',
      '/about#academic-council': '/governance#academic-council',
      '/about#bos': '/governance#bos',
      '/about#finance': '/governance#finance',
      '/about#autonomous': '/accreditation#ugc',
      '/about#naac': '/accreditation#naac',
      '/about#nba': '/accreditation#nba',
      '/about#aicte': '/accreditation#aicte',
      '/about#nirf': '/accreditation#nirf',
      '/about#campus-life': '/campus-life',
      '/about#cultural': '/campus-life#cultural',
      '/about#clubs': '/campus-life#clubs',
      '/about#nss': '/campus-life#nss',
      '/about#wec': '/campus-life#wec',
      '/about#facilities': '/facilities',
      '/about#hostel': '/facilities#hostel',
      '/about#infrastructure': '/facilities#classrooms',
      '/about#library': '/facilities#library',
      '/about#sports': '/facilities#sports'
    };

    const key = `${lowerPath}${hash ? hash.toLowerCase() : ''}`;
    if (legacyRedirects[key]) {
      navigate(legacyRedirects[key], { replace: true });
    }
  }, [pathname, hash, navigate]);

  return null;
}

// Helper component to handle smooth scroll to top or hash anchors on page changes
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // 1. Explicit hash takes first priority
    if (hash) {
      const elId = hash.replace('#', '');
      const element = document.getElementById(elId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 120);
        return;
      }
    }

    // 2. Normal top-of-page scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <LegacyRedirectHandler />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="departments" element={<Departments />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="placements" element={<Placements />} />
          <Route path="governance" element={<Governance />} />
          <Route path="academics" element={<Academics />} />
          <Route path="examinations" element={<Examinations />} />
          <Route path="coe" element={<Examinations />} />
          <Route path="exams" element={<Examinations />} />
          <Route path="research" element={<Research />} />
          <Route path="rd" element={<Research />} />
          <Route path="campus-life" element={<CampusLife />} />
          <Route path="campuslife" element={<CampusLife />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="infrastructure" element={<Facilities />} />
          <Route path="accreditation" element={<Accreditation />} />
          <Route path="accreditations" element={<Accreditation />} />
          <Route path="naac" element={<Accreditation />} />
          <Route path="nba" element={<Accreditation />} />
          <Route path="nirf" element={<Accreditation />} />
          <Route path="iqac" element={<Accreditation />} />
          <Route path="aicte" element={<Accreditation />} />
          <Route path="media" element={<CampusLife />} />
          <Route path="gallery" element={<CampusLife />} />
          <Route path="photogallery" element={<CampusLife />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
