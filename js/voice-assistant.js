/**
 * voice-assistant.js — RITW Voice Search Assistant
 * 
 * Standalone voice recognition module.
 * ONLY job: Populate search box and trigger search.
 * Does NOT contain any search logic.
 * 
 * Architecture:
 * - Wake word detection ("Hey Rishi")
 * - Continuous recognition with proper state management
 * - Speech synthesis with female voice preference
 * - 55-second timeout with automatic wake-word-only mode
 * - Visual indicator badge
 * 
 * Integration:
 * - Calls: window.ritwOpenSearch() to open modal
 * - Populates: document.getElementById('ritwSearchInput').value
 * - Triggers: input.dispatchEvent(new Event('input'))
 */

(function() {
    'use strict';

    // ══════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ══════════════════════════════════════════════════════════════════════

    var WAKE_WORD_VARIANTS = [
        'hey rishi',
        'hay rishi', 
        'hi rishi',
        'a rishi',
        'hey rishii',
        'hai rishi',
        'he rishi'
    ];

    var VOICE_TIMEOUT_MS = 55000; // 55 seconds

    // ══════════════════════════════════════════════════════════════════════
    // STATE
    // ══════════════════════════════════════════════════════════════════════

    var recognition = null;
    var synthesis = window.speechSynthesis;
    var isActive = false;           // true = full voice active, false = wake-word-only
    var isSpeaking = false;         // true = currently speaking (ignore recognition)
    var isRecognizing = false;      // true = recognition is running
    var voiceTimeout = null;
    var badge = null;
    var selectedVoice = null;

    // ══════════════════════════════════════════════════════════════════════
    // VOICE BADGE UI
    // ══════════════════════════════════════════════════════════════════════

    function createBadge() {
        badge = document.createElement('div');
        badge.id = 'ritwVoiceBadge';
        badge.className = 'ritw-voice-badge';
        badge.innerHTML = '<i class="fas fa-microphone"></i>';
        badge.title = '🎤 Voice Search - Say "Hey Rishi"';
        
        badge.addEventListener('click', function() {
            showNotification('Say "Hey Rishi" to activate voice search', false);
        });

        document.body.appendChild(badge);
        
        // Add styles
        if (!document.getElementById('ritwVoiceStyles')) {
            var style = document.createElement('style');
            style.id = 'ritwVoiceStyles';
            style.textContent = `
                .ritw-voice-badge {
                    position: fixed;
                    top: 100px;
                    right: 15px;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #842db8, #b844e8);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(132, 45, 184, 0.4);
                    cursor: pointer;
                    z-index: 99999;
                    transition: transform 0.2s, box-shadow 0.2s, background 0.3s;
                    font-size: 0.85rem;
                }
                .ritw-voice-badge:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 16px rgba(132, 45, 184, 0.6);
                }
                .ritw-voice-badge.state-timeout {
                    background: linear-gradient(135deg, #ff9800, #f57c00);
                }
                .ritw-voice-badge.state-listening {
                    background: linear-gradient(135deg, #ffd54f, #ffb300);
                    animation: voicePulse 1s infinite;
                }
                .ritw-voice-badge.state-speaking {
                    background: linear-gradient(135deg, #2196f3, #1976d2);
                }
                .ritw-voice-badge.state-error {
                    background: linear-gradient(135deg, #f44336, #d32f2f);
                }
                
                @keyframes voicePulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 2px 8px rgba(255, 193, 7, 0.4); }
                    50% { transform: scale(1.15); box-shadow: 0 4px 16px rgba(255, 193, 7, 0.8); }
                }
                
                .ritw-voice-notification {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    background: linear-gradient(135deg, #842db8, #b844e8);
                    color: #fff;
                    padding: 10px 16px;
                    border-radius: 8px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
                    font-size: 0.8rem;
                    z-index: 99998;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    animation: slideIn 0.3s ease;
                }
                .ritw-voice-notification.error {
                    background: linear-gradient(135deg, #f44336, #d32f2f);
                }
                
                @keyframes slideIn {
                    from { transform: translateX(-200px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(-200px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function setBadgeState(state) {
        if (!badge) return;
        
        badge.className = 'ritw-voice-badge';
        
        switch(state) {
            case 'active':
                badge.title = '🎤 Voice Active - Listening for "Hey Rishi"';
                break;
            case 'timeout':
                badge.classList.add('state-timeout');
                badge.title = '🎤 Say "Hey Rishi" to activate (timeout reached)';
                break;
            case 'listening':
                badge.classList.add('state-listening');
                badge.title = '🎤 Listening...';
                break;
            case 'speaking':
                badge.classList.add('state-speaking');
                badge.title = '🔊 Speaking...';
                break;
            case 'error':
                badge.classList.add('state-error');
                badge.title = '❌ Voice error';
                break;
        }
    }

    function showNotification(message, isError) {
        var notif = document.createElement('div');
        notif.className = 'ritw-voice-notification' + (isError ? ' error' : '');
        notif.innerHTML = '<i class="fas fa-' + (isError ? 'exclamation-circle' : 'microphone') + '"></i><span>' + message + '</span>';
        
        document.body.appendChild(notif);
        
        setTimeout(function() {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(function() {
                if (notif.parentNode) notif.parentNode.removeChild(notif);
            }, 300);
        }, 3000);
    }

    // ══════════════════════════════════════════════════════════════════════
    // SPEECH SYNTHESIS
    // ══════════════════════════════════════════════════════════════════════

    function selectFemaleVoice() {
        if (!synthesis) return;
        
        var voices = synthesis.getVoices();
        
        // Preferred female voices (in order of preference)
        var preferredVoices = [
            'Microsoft Zira',
            'Google US English',
            'Samantha',
            'Victoria',
            'Karen',
            'Microsoft Heera'
        ];
        
        // Try exact match first
        for (var i = 0; i < preferredVoices.length; i++) {
            var voice = voices.find(function(v) {
                return v.name === preferredVoices[i];
            });
            if (voice) {
                selectedVoice = voice;
                console.log('[VOICE] Selected voice:', voice.name);
                return;
            }
        }
        
        // Try female keyword match
        var femaleVoice = voices.find(function(v) {
            var name = v.name.toLowerCase();
            return name.includes('female') || name.includes('woman');
        });
        
        if (femaleVoice) {
            selectedVoice = femaleVoice;
            console.log('[VOICE] Selected voice:', femaleVoice.name);
            return;
        }
        
        // Fallback to first available voice
        if (voices.length > 0) {
            selectedVoice = voices[0];
            console.log('[VOICE] Using default voice:', voices[0].name);
        }
    }

    function speak(text, onComplete) {
        if (!synthesis) {
            if (onComplete) onComplete();
            return;
        }
        
        console.log('[VOICE] 🔊 Speaking:', text);
        
        // CRITICAL: Stop recognition BEFORE speaking
        stopRecognition();
        
        isSpeaking = true;
        setBadgeState('speaking');
        
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;  // Slightly faster for responsiveness
        utterance.pitch = 1.2;
        utterance.volume = 1.0;
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        utterance.onstart = function() {
            console.log('[VOICE] 🎵 Speech started');
        };
        
        utterance.onend = function() {
            console.log('[VOICE] ✅ Speech finished');
            isSpeaking = false;
            
            // Immediate restart (no delay needed - isSpeaking flag prevents self-hearing)
            if (onComplete) onComplete();
            startRecognition();
        };
        
        utterance.onerror = function(e) {
            console.error('[VOICE] Speech error:', e.error);
            isSpeaking = false;
            
            // Immediate restart on error too
            if (onComplete) onComplete();
            startRecognition();
        };
        
        // Speak immediately
        synthesis.speak(utterance);
    }

    // ══════════════════════════════════════════════════════════════════════
    // SPEECH RECOGNITION
    // ══════════════════════════════════════════════════════════════════════

    function initRecognition() {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.log('[VOICE] Speech recognition not supported');
            return false;
        }
        
        recognition = new SpeechRecognition();
        recognition.continuous = false;      // Stop after each phrase (better for multi-word)
        recognition.interimResults = true;   // See partial results
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 3;     // Get multiple interpretations
        
        recognition.onstart = function() {
            isRecognizing = true;
            console.log('[VOICE] 🎤 Recognition started');
            
            if (isActive && isModalOpen()) {
                setBadgeState('listening');
            }
        };
        
        recognition.onresult = function(event) {
            // Ignore if we're speaking
            if (isSpeaking) {
                console.log('[VOICE] 🚫 Ignoring - currently speaking');
                return;
            }
            
            var transcript = '';
            var isFinal = false;
            
            // Accumulate ALL results to capture complete phrases like "Director Desk"
            for (var i = 0; i < event.results.length; i++) {
                var result = event.results[i];
                var text = result[0].transcript.trim();
                
                if (text) {
                    if (transcript && !transcript.includes(text)) {
                        transcript += ' ' + text;
                    } else if (!transcript) {
                        transcript = text;
                    }
                }
                
                if (result.isFinal) {
                    isFinal = true;
                }
            }
            
            transcript = transcript.trim().toLowerCase();
            
            if (!transcript) return;
            
            // Only process final results
            if (!isFinal) {
                console.log('[VOICE] Interim:', transcript);
                return;
            }
            
            console.log('[VOICE] FINAL:', transcript);
            
            handleTranscript(transcript);
        };
        
        recognition.onend = function() {
            isRecognizing = false;
            console.log('[VOICE] Recognition ended');
            
            // ALWAYS restart (even after timeout - for wake word detection)
            setTimeout(function() {
                // Don't restart if we're speaking
                if (!isSpeaking) {
                    startRecognition();
                }
            }, 1000);
        };
        
        recognition.onerror = function(event) {
            console.error('[VOICE] Error:', event.error);
            
            if (event.error === 'aborted') {
                // Normal - happens during stop/start
                return;
            }
            
            if (event.error === 'no-speech') {
                // Normal - will auto-restart via onend
                return;
            }
            
            if (event.error === 'audio-capture') {
                setBadgeState('error');
                showNotification('Microphone access denied', true);
                isActive = false;
                return;
            }
            
            if (event.error === 'not-allowed') {
                setBadgeState('error');
                isActive = false;
                isRecognizing = false;
                return;
            }
        };
        
        return true;
    }

    function startRecognition() {
        if (!recognition || isRecognizing) return;
        
        try {
            recognition.start();
            setBadgeState(isActive ? 'active' : 'timeout');
        } catch(e) {
            // Already started
            console.log('[VOICE] Recognition already running');
        }
    }

    function stopRecognition() {
        if (!recognition || !isRecognizing) return;
        
        try {
            recognition.stop();
            console.log('[VOICE] 🛑 Recognition stopped');
        } catch(e) {
            // Already stopped
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // VOICE TIMEOUT
    // ══════════════════════════════════════════════════════════════════════

    function resetTimeout() {
        if (voiceTimeout) {
            clearTimeout(voiceTimeout);
        }
        
        voiceTimeout = setTimeout(function() {
            console.log('[VOICE] ⏱️ Timeout reached - entering wake-word-only mode');
            isActive = false;
            setBadgeState('timeout');
            showNotification('Voice timeout - say "Hey Rishi" to reactivate', false);
        }, VOICE_TIMEOUT_MS);
        
        console.log('[VOICE] Timer reset - will timeout in 55 seconds');
    }

    // ══════════════════════════════════════════════════════════════════════
    // TRANSCRIPT HANDLING
    // ══════════════════════════════════════════════════════════════════════

    function handleTranscript(transcript) {
        // Check for wake word
        var wakeWordDetected = false;
        
        for (var i = 0; i < WAKE_WORD_VARIANTS.length; i++) {
            if (transcript.includes(WAKE_WORD_VARIANTS[i])) {
                wakeWordDetected = true;
                console.log('[VOICE] ✅ Wake word detected:', WAKE_WORD_VARIANTS[i]);
                break;
            }
        }
        
        // Fuzzy match: any phrase with "rishi"
        if (!wakeWordDetected && transcript.includes('rishi')) {
            wakeWordDetected = true;
            console.log('[VOICE] ✅ Fuzzy wake word match');
        }
        
        if (wakeWordDetected) {
            handleWakeWord();
            return;
        }
        
        // If not active, ignore all commands
        if (!isActive) {
            console.log('[VOICE] Ignoring command - not active (say "Hey Rishi" first)');
            return;
        }
        
        // Only process commands if modal is open
        if (!isModalOpen()) {
            console.log('[VOICE] Ignoring command - modal not open');
            return;
        }
        
        // Check for result selection commands
        if (handleResultSelection(transcript)) {
            return;
        }
        
        // Default: treat as search query
        handleSearchQuery(transcript);
    }

    function handleWakeWord() {
        console.log('[VOICE] ========================================');
        console.log('[VOICE] 🎯 WAKE WORD ACTIVATED');
        console.log('[VOICE] ========================================');
        
        // Check if modal is already open OR if we're in a context with an active search box
        var modalAlreadyOpen = isModalOpen();
        var hasActiveSearchContext = false;
        
        // Check if Enquiries tab search is visible
        var enqSearch = document.getElementById('enqSearch');
        if (enqSearch && isElementVisible(enqSearch)) {
            hasActiveSearchContext = true;
            console.log('[VOICE] Active search context: Enquiries tab');
        }
        
        // Activate voice if not already active
        if (!isActive) {
            isActive = true;
            setBadgeState('active');
        }
        
        // Reset timeout
        resetTimeout();
        
        // Only open modal and speak if:
        // - Modal is NOT already open
        // - AND we don't have another active search context (like Enquiries tab)
        if (!modalAlreadyOpen && !hasActiveSearchContext) {
            // Open search modal FIRST
            if (typeof window.ritwOpenSearch === 'function') {
                window.ritwOpenSearch();
            } else {
                console.error('[VOICE] window.ritwOpenSearch not found');
            }
            
            // Speak greeting immediately
            setTimeout(function() {
                speak('Hello! How may I help you today?');
            }, 50);  // Minimal 50ms delay just for modal to appear
        } else {
            // Modal already open OR active search context exists
            // Just acknowledge and continue listening
            if (hasActiveSearchContext) {
                console.log('[VOICE] Active search context detected - ready to search, continuing to listen');
                // Brief acknowledgment
                speak('Ready to search');
            } else {
                console.log('[VOICE] Modal already open - timeout reset, continuing to listen');
            }
            // Don't reopen modal - just silently reset the timer
        }
    }

    function handleSearchQuery(query) {
        console.log('[VOICE] 🔍 Raw query:', query);
        
        // Strip common search command phrases
        var cleanQuery = query
            .replace(/^search\s+for\s+/i, '')
            .replace(/^find\s+/i, '')
            .replace(/^look\s+for\s+/i, '')
            .replace(/^show\s+me\s+/i, '')
            .replace(/^show\s+/i, '')
            .replace(/^get\s+/i, '')
            .replace(/^open\s+/i, '')
            .replace(/^go\s+to\s+/i, '')
            .trim();
        
        if (!cleanQuery) {
            speak('Please say what you want to search for');
            return;
        }
        
        console.log('[VOICE] 🔍 Clean query:', cleanQuery);
        
        // Check for active search inputs (priority: specific contexts first)
        var input = null;
        
        // 1. Check if Enquiries tab search is visible and active
        var enqSearch = document.getElementById('enqSearch');
        if (enqSearch && isElementVisible(enqSearch)) {
            input = enqSearch;
            console.log('[VOICE] Using Enquiries tab search');
        }
        
        // 2. Check main site search modal
        if (!input) {
            var ritwSearch = document.getElementById('ritwSearchInput');
            if (ritwSearch && isElementVisible(ritwSearch)) {
                input = ritwSearch;
                console.log('[VOICE] Using main site search');
            }
        }
        
        // 3. Fallback: open main search modal and use it
        if (!input) {
            console.log('[VOICE] No search box visible - opening main search modal');
            if (typeof window.ritwOpenSearch === 'function') {
                window.ritwOpenSearch();
                // Wait for modal to open
                setTimeout(function() {
                    var ritwSearch = document.getElementById('ritwSearchInput');
                    if (ritwSearch) {
                        ritwSearch.value = cleanQuery;
                        var evt = new Event('input', { bubbles: true, cancelable: true });
                        ritwSearch.dispatchEvent(evt);
                        console.log('[VOICE] ✅ Main search triggered');
                    }
                }, 100);
            }
            resetTimeout();
            return;
        }
        
        // Populate search box with cleaned query
        input.value = cleanQuery;
        
        // Trigger input event (same as keyboard typing)
        var event = new Event('input', {
            bubbles: true,
            cancelable: true
        });
        input.dispatchEvent(event);
        
        // DON'T speak confirmation - just trigger search and continue listening
        // This keeps the flow smooth for multiple consecutive searches
        console.log('[VOICE] ✅ Search triggered via input event - continuing to listen');
        
        // Reset timeout to keep voice active
        resetTimeout();
    }
    
    // Helper: Check if element is visible
    function isElementVisible(el) {
        if (!el) return false;
        var style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return false;
        }
        // Check if parent containers are visible
        var parent = el.parentElement;
        while (parent) {
            var parentStyle = window.getComputedStyle(parent);
            if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden') {
                return false;
            }
            parent = parent.parentElement;
        }
        return true;
    }

    function handleResultSelection(transcript) {
        var patterns = [
            { regex: /open\s+(?:the\s+)?(first|1st|one)/i, index: 0 },
            { regex: /open\s+(?:the\s+)?(second|2nd|two)/i, index: 1 },
            { regex: /open\s+(?:the\s+)?(third|3rd|three)/i, index: 2 },
            { regex: /open\s+(?:the\s+)?(fourth|4th|four)/i, index: 3 },
            { regex: /open\s+(?:the\s+)?(fifth|5th|five)/i, index: 4 },
            { regex: /open\s+(?:the\s+)?(sixth|6th|six)/i, index: 5 },
            { regex: /open\s+(?:the\s+)?(seventh|7th|seven)/i, index: 6 },
            { regex: /open\s+(?:the\s+)?(eighth|8th|eight)/i, index: 7 }
        ];
        
        for (var i = 0; i < patterns.length; i++) {
            if (patterns[i].regex.test(transcript)) {
                openResult(patterns[i].index);
                return true;
            }
        }
        
        return false;
    }

    function openResult(index) {
        var results = document.querySelectorAll('.rsm-item');
        
        if (results[index]) {
            console.log('[VOICE] Opening result', index + 1);
            speak('Opening result ' + (index + 1));
            
            // Stop voice completely before navigation
            isActive = false;
            stopRecognition();
            
            if (voiceTimeout) {
                clearTimeout(voiceTimeout);
            }
            
            setTimeout(function() {
                results[index].click();
            }, 800);
        } else {
            speak('No result found at position ' + (index + 1));
        }
    }

    // ══════════════════════════════════════════════════════════════════════
    // HELPERS
    // ══════════════════════════════════════════════════════════════════════

    function isModalOpen() {
        var modal = document.getElementById('ritwSearchModal');
        return modal && !modal.hasAttribute('hidden');
    }

    // ══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ══════════════════════════════════════════════════════════════════════

    function init() {
        console.log('[VOICE] 🎙️ Initializing voice assistant...');
        
        // Load voices for speech synthesis
        if (synthesis) {
            synthesis.onvoiceschanged = function() {
                selectFemaleVoice();
            };
            selectFemaleVoice();
        }
        
        // Initialize recognition
        if (!initRecognition()) {
            console.log('[VOICE] Voice recognition not available');
            return;
        }
        
        // Create UI badge
        createBadge();
        
        // Start listening after short delay
        setTimeout(function() {
            isActive = true;
            startRecognition();
            resetTimeout();
            
            console.log('[VOICE] ✅ Voice assistant ready');
            console.log('[VOICE] Say "Hey Rishi" to search');
            
            showNotification('Voice search ready - say "Hey Rishi" (55 sec timeout)', false);
        }, 1500);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose global API (if needed)
    window.ritwVoiceAssistant = {
        speak: speak,
        isActive: function() { return isActive; },
        isSpeaking: function() { return isSpeaking; }
    };

})();
