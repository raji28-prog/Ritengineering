import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchModal({ isOpen, onClose, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [searchIndex, setSearchIndex] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Reset or initialize state during render when isOpen changes
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery(initialQuery || '');
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }

  useEffect(() => {
    fetch('/search.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.results) {
          setSearchIndex(data.results);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Pure derived results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchIndex
      .filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(q)) ||
          (item.snippet && item.snippet.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q))
      )
      .slice(0, 15);
  }, [query, searchIndex]);

  const handleKeyDownInList = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  const handleSelect = (item) => {
    onClose(false);
    let target = item.url || '/';
    // Clean relative path if needed
    if (target.startsWith('index.html')) target = '/';
    else if (target.startsWith('about/')) target = '/about';
    else if (target.startsWith('departments/')) target = '/departments';
    else if (target.startsWith('admissions/')) target = '/admissions';
    else if (target.startsWith('placements/')) target = '/placements';
    else if (target.startsWith('contact/')) target = '/contact';

    navigate(target);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={() => onClose(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Institutional Search Dialog"
    >
      <div className="search-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon-inside" aria-hidden="true"></i>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search RITW programs, syllabus, admissions, placements, faculty..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDownInList}
            aria-label="Search institutional database"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSelectedIndex(0); }}
              className="search-clear-btn"
              aria-label="Clear search query"
            >
              <i className="fas fa-times-circle" aria-hidden="true"></i>
            </button>
          )}
        </div>

        <div className="search-meta-bar">
          <span>{results.length > 0 ? `Found ${results.length} institutional results` : query ? 'No matching institutional pages' : 'Type keywords or explore programs'}</span>
          <div className="search-keyboard-hints">
            <span>Navigate <kbd>&uarr;</kbd> <kbd>&darr;</kbd></span>
            <span>Select <kbd>&crarr;</kbd></span>
            <span>Close <kbd>ESC</kbd></span>
          </div>
        </div>

        {results.length > 0 && (
          <ul className="search-results-list" role="listbox">
            {results.map((item, idx) => (
              <li key={idx} role="option" aria-selected={selectedIndex === idx}>
                <button
                  type="button"
                  className={`search-result-item ${selectedIndex === idx ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="search-result-header">
                    <span className="search-result-title">{item.title}</span>
                    {item.category && <span className="search-result-badge">{item.category}</span>}
                  </div>
                  <div className="search-result-snippet">{item.snippet}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
