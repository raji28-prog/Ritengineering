import React, { useState, useEffect } from 'react';

export default function VoiceAssistant({ isOpen, onClose, onSearchWithTranscript }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [supported] = useState(() => {
    return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  });

  // Reset state when closing during render
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setListening(false);
      setTranscript('');
    }
  }

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Synchronize with external SpeechRecognition system
  useEffect(() => {
    if (!supported || !isOpen) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join('');
      setTranscript(text);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch {
      // already started or blocked
    }

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, [isOpen, supported]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (transcript.trim() && onSearchWithTranscript) {
      onSearchWithTranscript(transcript);
    }
    onClose(false);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={() => onClose(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Voice Search Assistant"
    >
      <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={() => onClose(false)}
          aria-label="Close voice assistant"
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div className="section-badge">VOICE ASSISTANT</div>
          <h3 style={{ fontSize: '22px', color: 'var(--ritw-navy-dark)', marginTop: '8px' }}>
            "Hey Rishi" Voice Search
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--ritw-text-muted)' }}>
            Speak naturally (e.g. "Admissions 2026", "Placements", "CSE syllabus")
          </p>
        </div>

        {!supported ? (
          <div style={{ padding: '20px', background: '#fef2f2', color: '#991b1b', borderRadius: 'var(--radius-md)', fontSize: '13.5px' }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }} aria-hidden="true"></i>
            Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge for voice search.
          </div>
        ) : (
          <div>
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: listening ? 'var(--ritw-green)' : 'var(--ritw-navy)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                margin: '0 auto 20px',
                boxShadow: listening ? '0 0 0 12px rgba(21, 155, 98, 0.25)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <i className={`fas ${listening ? 'fa-microphone' : 'fa-microphone-slash'}`} aria-hidden="true"></i>
            </div>

            <div style={{ fontSize: '15px', fontWeight: 700, color: listening ? 'var(--ritw-green)' : 'var(--ritw-navy)', marginBottom: '12px' }}>
              {listening ? 'Listening... Speak now' : 'Processing audio...'}
            </div>

            <div
              style={{
                minHeight: '60px',
                padding: '12px 16px',
                background: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--ritw-border)',
                fontSize: '14.5px',
                color: transcript ? 'var(--ritw-text-main)' : 'var(--ritw-text-muted)',
                fontStyle: transcript ? 'normal' : 'italic',
                marginBottom: '20px'
              }}
            >
              {transcript || 'Say "Admissions 2026", "CSE Labs", "Placements"...'}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-cta btn-cta-green"
                onClick={handleApply}
                disabled={!transcript.trim()}
                style={{ opacity: transcript.trim() ? 1 : 0.6 }}
              >
                <i className="fas fa-search" aria-hidden="true"></i>
                <span>Search This Query</span>
              </button>
              <button
                type="button"
                className="btn-cta"
                onClick={() => onClose(false)}
                style={{ background: '#f1f5f9', color: 'var(--ritw-text-muted)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
