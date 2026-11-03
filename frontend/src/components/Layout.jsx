import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import AnnouncementsTicker from './AnnouncementsTicker';
import Footer from './Footer';
import QuickEnquiryModal from './QuickEnquiryModal';
import SearchModal from './SearchModal';

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Ctrl+K shortcut listener for search dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="ritw-app-layout">
      {/* 1. Global Sreyas-Style Sticky Rounded White Header & Two-Pane Mega Menu */}
      <Header />

      {/* 2. Flash News Announcements Ticker */}
      <AnnouncementsTicker />

      {/* 3. Active Page Content */}
      <main id="main-content">
        <Outlet />
      </main>

      {/* 4. Comprehensive Institutional Footer */}
      <Footer />

      {/* 5. Floating Quick Enquiry Modal */}
      <QuickEnquiryModal />

      {/* 6. Instant Search Dialog (Ctrl + K Accessible) */}
      <SearchModal 
        isOpen={searchOpen} 
        onClose={setSearchOpen}
      />
    </div>
  );
}
