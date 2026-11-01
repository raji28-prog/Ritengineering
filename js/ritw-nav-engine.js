/**
 * RITW Dynamic Navigation & Sreyas Two-Pane Mega-Menu Engine
 * Matches exact Sreyas interaction reference:
 * - Hamburger-to-X toggle on header
 * - Large rounded 2-pane popup panel below header
 * - Left categories vertical list with smooth hover & click switching
 * - Right dark navy multi-column card
 * - Keyboard (Esc), outside click dismissal, and mobile responsiveness
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

    function updateModalPosition() {
      if (!modal) return;
      var header = document.querySelector('.ritw-sreyas-header-sticky-wrap') || 
                   document.querySelector('.ritw-sreyas-header-pill') || 
                   document.querySelector('.ritw-sticky-header') ||
                   document.querySelector('.ltn__header-area');
      
      var topPos = 76;
      if (header) {
        var rect = header.getBoundingClientRect();
        topPos = Math.max(Math.round(rect.bottom) + 8, 56);
      }
      modal.style.marginTop = topPos + 'px';
      modal.style.maxHeight = 'calc(100vh - ' + (topPos + 18) + 'px)';
    }

    // Update position on resize and scroll
    window.addEventListener('resize', updateModalPosition);
    window.addEventListener('scroll', function() {
      if (overlay.classList.contains('ritw-sreyas-active')) {
        updateModalPosition();
      }
    }, { passive: true });

    // Open/Close Sreyas Mega Panel
    function openSreyasMenu() {
      overlay.classList.add('ritw-sreyas-active');
      overlay.setAttribute('aria-hidden', 'false');
      toggleBtn.classList.add('is-active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      updateModalPosition();
    }

    function closeSreyasMenu() {
      overlay.classList.remove('ritw-sreyas-active');
      overlay.setAttribute('aria-hidden', 'true');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggleBtn.focus();
    }

    function toggleSreyasMenu() {
      if (overlay.classList.contains('ritw-sreyas-active')) {
        closeSreyasMenu();
      } else {
        openSreyasMenu();
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeSreyasMenu();
      });
    }

    // Mobile header toggle hook
    var mobileToggle = document.querySelector('.mobile-menu-toggle .ltn__utilize-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSreyasMenu();
      });
    }

    // Toggle button on header
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleSreyasMenu();
    });

    // Category Switching (Both Hover and Click)
    function activateCategory(targetId, btn) {
      catButtons.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      panes.forEach(function(pane) {
        if (pane.id === targetId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    }

    catButtons.forEach(function(btn) {
      var targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      // Mouseenter for instant desktop hover switching
      btn.addEventListener('mouseenter', function() {
        activateCategory(targetId, btn);
      });

      // Click for tap/touch & keyboard selection
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        activateCategory(targetId, btn);
      });
    });

    // Dismissal: Outside click (clicking the backdrop outside the modal)
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeSreyasMenu();
      }
    });

    // Dismissal: Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (overlay.classList.contains('ritw-sreyas-active')) {
          closeSreyasMenu();
        }
      }
    });

    // Optional URL param trigger for direct testing: ?sreyas_open=1 or ?sreyas_cat=departments
    try {
      var params = new URLSearchParams(window.location.search);
      if (params.has('sreyas_open')) {
        openSreyasMenu();
        var cat = params.get('sreyas_cat');
        if (cat) {
          var targetBtn = document.querySelector('.ritw-sreyas-cat-btn[data-target*="' + cat + '"]');
          if (targetBtn) {
            var tid = targetBtn.getAttribute('data-target');
            activateCategory(tid, targetBtn);
          }
        }
        var scrollTo = params.get('scroll_to');
        if (scrollTo) {
          var targetEl = document.querySelector('.' + scrollTo + '-section') || 
                         document.getElementById(scrollTo + '-section-wrap') || 
                         document.querySelector('.' + scrollTo + '-block') ||
                         document.getElementById(scrollTo);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
    var navItems = document.querySelectorAll('.ritw-primary-nav .ritw-nav-item.ritw-has-dropdown');
    navItems.forEach(function(item) {
      var trigger = item.querySelector('.ritw-nav-link');
      var panel = item.querySelector('.ritw-mega-panel');
      if (!trigger || !panel) return;

      item.addEventListener('mouseenter', function() {
        var navRect = item.getBoundingClientRect();
        var panelWidth = panel.offsetWidth;
        var vp = document.documentElement.clientWidth || window.innerWidth;
        var ideal = navRect.left + (navRect.width / 2) - (panelWidth / 2);
        if (ideal + panelWidth > vp - 16) ideal = vp - panelWidth - 16;
        if (ideal < 16) ideal = 16;
        panel.style.left = Math.round(ideal - navRect.left) + 'px';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRITWNavigation);
  } else {
    initRITWNavigation();
  }
})();


  // Scroll-Reveal IntersectionObserver Engine
  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.ritw-reveal, .ritw-reveal-left, .ritw-reveal-right, .ritw-stagger-parent').forEach(function(el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.ritw-reveal, .ritw-reveal-left, .ritw-reveal-right, .ritw-stagger-parent').forEach(function(el) {
      observer.observe(el);
    });
  }

  // Trigger init on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initScrollReveal();
      initHeroCardSlider();
      initAnnouncementsModal();
    });
  } else {
    initScrollReveal();
    initHeroCardSlider();
    initAnnouncementsModal();
  }

  // 3. Hero Card Carousel Slider Controller
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
      currentIndex = index;

      items.forEach(function(item, idx) {
        if (idx === currentIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      dots.forEach(function(dot, idx) {
        if (idx === currentIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('active');
          dot.removeAttribute('aria-current');
        }
      });
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

    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        prevSlide();
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

    // Touch swipe support for mobile/tablets
    var touchStartX = 0;
    var touchEndX = 0;
    slider.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    slider.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        nextSlide();
      } else if (touchEndX - touchStartX > 45) {
        prevSlide();
      }
      startAutoplay();
    }, { passive: true });

    // Initial slide
    showSlide(0);
    startAutoplay();
  }

  // 4. Floating Announcements Tab & Modal
  function initAnnouncementsModal() {
    var btn = document.getElementById('announcementsTabBtn');
    var modal = document.getElementById('announcementsModal');
    var closeBtn = document.getElementById('annModalClose');
    var viewAllBtn = document.getElementById('annViewAllBtn');
    if (!btn || !modal) return;

    function openModal() {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });

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
        var target = document.querySelector('#tab-announcements') || document.querySelector('.updates-box');
        if (target) {
          setTimeout(function() {
            target.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      });
    }
  }
