/**
 * RITW Dynamic Navigation & Sreyas Two-Pane Mega-Menu Engine
 * Matches exact Sreyas interaction reference:
 * - Hamburger-to-X toggle on header
 * - Large rounded 2-pane popup panel below header
 * - Left categories vertical list with smooth hover & click switching
 * - Right dark navy multi-column card
 * - Keyboard (Esc), outside click dismissal, and mobile responsiveness
 * - Viewport-aware boundary clamping algorithm with 150ms hover-intent for primary nav
 * - Hero card carousel slider controller (6 widescreen slides, auto-advance, dots, arrows)
 * - Campus Announcements modal controller
 * - Scroll-Reveal IntersectionObserver engine
 */
(function() {
  'use strict';

  function initRITWNavigation() {
    var overlay = document.getElementById('ritwSreyasMegaOverlay');
    var toggleBtn = document.getElementById('ritwSreyasToggleBtn');
    var catButtons = document.querySelectorAll('.ritw-sreyas-cat-btn[data-target]');
    var panes = document.querySelectorAll('.ritw-sreyas-pane');

    if (!overlay || !toggleBtn) return;

    var modal = overlay.querySelector('.ritw-sreyas-modal');
    var closeBtn = document.getElementById('ritwSreyasCloseBtn');

    function openMenu() {
      overlay.classList.add('ritw-sreyas-active', 'is-open');
      overlay.setAttribute('aria-hidden', 'false');
      toggleBtn.classList.add('is-active', 'active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      // Focus first active category button
      var firstBtn = overlay.querySelector('.ritw-sreyas-cat-btn.active') || overlay.querySelector('.ritw-sreyas-cat-btn.is-active') || overlay.querySelector('.ritw-sreyas-cat-btn');
      if (firstBtn) {
        setTimeout(function() { firstBtn.focus(); }, 150);
      }
    }

    function closeMenu() {
      overlay.classList.remove('ritw-sreyas-active', 'is-open');
      overlay.setAttribute('aria-hidden', 'true');
      toggleBtn.classList.remove('is-active', 'active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggleBtn.focus();
    }

    // Toggle click on hamburger
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (overlay.classList.contains('ritw-sreyas-active') || overlay.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close button click
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeMenu();
      });
    }

    // Outside click dismiss
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeMenu();
      }
    });

    // Escape key dismiss
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && (overlay.classList.contains('ritw-sreyas-active') || overlay.classList.contains('is-open'))) {
        closeMenu();
      }
    });

    // Category Tab Switching (supports both click and smooth hover-intent)
    var hoverIntentTimer = null;

    function activateCategory(targetId, clickedBtn) {
      catButtons.forEach(function(b) {
        b.classList.remove('active', 'is-active');
        b.setAttribute('aria-selected', 'false');
      });
      panes.forEach(function(p) {
        p.classList.remove('active', 'is-active');
      });

      clickedBtn.classList.add('active', 'is-active');
      clickedBtn.setAttribute('aria-selected', 'true');

      var targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active', 'is-active');
      }
    }

    catButtons.forEach(function(btn) {
      var targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      btn.addEventListener('click', function(e) {
        e.preventDefault();
        activateCategory(targetId, btn);
      });

      btn.addEventListener('mouseenter', function() {
        if (hoverIntentTimer) clearTimeout(hoverIntentTimer);
        hoverIntentTimer = setTimeout(function() {
          activateCategory(targetId, btn);
        }, 120);
      });

      btn.addEventListener('mouseleave', function() {
        if (hoverIntentTimer) clearTimeout(hoverIntentTimer);
      });
    });

    // Keyboard Arrow Navigation inside category list
    var catList = overlay.querySelector('.ritw-sreyas-cat-list');
    if (catList) {
      catList.addEventListener('keydown', function(e) {
        var buttons = Array.from(catButtons);
        var idx = buttons.indexOf(document.activeElement);
        if (idx === -1) return;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          var nextIdx = (idx + 1) % buttons.length;
          buttons[nextIdx].focus();
          buttons[nextIdx].click();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var prevIdx = (idx - 1 + buttons.length) % buttons.length;
          buttons[prevIdx].focus();
          buttons[prevIdx].click();
        }
      });
    }

    // Kinetic viewport-aware boundary clamping for primary nav dropdowns
    var nav = document.querySelector('.ritw-primary-nav');
    if (nav) {
      var navItems = nav.querySelectorAll('.ritw-nav-item.ritw-has-dropdown');
      var activePanel = null;
      var activeTrigger = null;
      var hoverTimer = null;
      var gutter = 16;

      function clampPanel(panel, item) {
        panel.style.left = '';
        panel.style.right = '';
        panel.style.transform = '';

        var rect = panel.getBoundingClientRect();
        var itemRect = item.getBoundingClientRect();
        var vw = document.documentElement.clientWidth || window.innerWidth;

        var idealLeft = itemRect.left + (itemRect.width / 2) - (rect.width / 2);
        var minLeft = gutter;
        var maxLeft = vw - rect.width - gutter;

        var targetLeft = Math.max(minLeft, Math.min(idealLeft, maxLeft));
        var offsetFromItem = targetLeft - itemRect.left;
        panel.style.left = Math.round(offsetFromItem) + 'px';
      }

      function openPanel(item) {
        if (hoverTimer) clearTimeout(hoverTimer);
        var trigger = item.querySelector('.ritw-nav-link');
        var panel = item.querySelector('.ritw-mega-panel');
        if (!panel) return;

        if (activePanel && activePanel !== panel) {
          activePanel.parentElement.classList.remove('ritw-active');
        }

        item.classList.add('ritw-active');
        clampPanel(panel, item);
        activePanel = panel;
        activeTrigger = trigger;
      }

      function closeActivePanel() {
        if (activePanel) {
          activePanel.parentElement.classList.remove('ritw-active');
          activePanel = null;
          activeTrigger = null;
        }
      }

      navItems.forEach(function(item) {
        item.addEventListener('mouseenter', function() { openPanel(item); });
        item.addEventListener('mouseleave', function() {
          hoverTimer = setTimeout(closeActivePanel, 150);
        });
      });
    }
  }

  // Scroll-Reveal IntersectionObserver Engine
  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.ritw-reveal, .ritw-reveal-left, .ritw-reveal-right, .ritw-stagger-parent').forEach(function(el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    });

    document.querySelectorAll('.ritw-reveal, .ritw-reveal-left, .ritw-reveal-right, .ritw-stagger-parent').forEach(function(el) {
      observer.observe(el);
    });
  }

  // Hero Card Carousel Slider Controller (Widescreen 6-Slide Carousel)
  function initHeroCardSlider() {
    var slider = document.getElementById('heroCardSlider');
    if (!slider) return;

    var items = slider.querySelectorAll('.ritw-hero-slide-item');
    var dots = slider.querySelectorAll('.ritw-hero-carousel-dots button');
    var prevBtn = slider.querySelector('.carousel-control-prev');
    var nextBtn = slider.querySelector('.carousel-control-next');
    if (!items.length) return;

    var currentIndex = 0;
    var timer = null;
    var interval = 5000;

    function showSlide(index) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;

      items.forEach(function(item, idx) {
        if (idx === index) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      dots.forEach(function(dot, idx) {
        if (idx === index) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('active');
          dot.removeAttribute('aria-current');
        }
      });

      currentIndex = index;
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(nextSlide, interval);
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        prevSlide();
        startAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        nextSlide();
        startAutoplay();
      });
    }

    dots.forEach(function(dot, idx) {
      dot.addEventListener('click', function(e) {
        e.preventDefault();
        showSlide(idx);
        startAutoplay();
      });
    });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Touch Swipe Support
    var touchStartX = 0;
    var touchEndX = 0;
    slider.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    slider.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
      startAutoplay();
    }, { passive: true });

    showSlide(0);
    startAutoplay();
  }

  // Floating Announcements Tab Navigation (Direct Page Link)
  function initAnnouncementsModal() {
    // Floating announcements button now navigates directly to /announcements/
    var modal = document.getElementById('announcementsModal');
    if (!modal) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
      });
    }

    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', function(e) {
        closeModal();
        var annSection = document.getElementById('tab-announcements') || document.querySelector('.ritw-announcements-section');
        if (annSection) {
          setTimeout(function() {
            annSection.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      });
    }
  }

  // Initialize all controllers on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initRITWNavigation();
      initScrollReveal();
      initHeroCardSlider();
      initAnnouncementsModal();
    });
  } else {
    initRITWNavigation();
    initScrollReveal();
    initHeroCardSlider();
    initAnnouncementsModal();
  }
})();
