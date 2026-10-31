/**
 * RITW Dynamic Navigation & Mega-Menu Kinetic Engine
 * Inspired by Sreyas smooth pop-down transitions & fluid interaction dynamics.
 * Features: Viewport auto-clamping, 150ms hover-intent, ARIA management,
 * keyboard accessibility (Esc/Arrows), touch-tap toggling, resize/scroll synchronization.
 */
(function() {
  'use strict';

  function initRITWNavigation() {
    var nav = document.querySelector('.ritw-primary-nav');
    if (!nav) return;

    var navItems = nav.querySelectorAll('.ritw-nav-item.ritw-has-dropdown');
    var activePanel = null;
    var activeTrigger = null;
    var hoverTimer = null;
    var gutter = 16; // minimum pixels from browser edge

    // Viewport-aware boundary clamping algorithm
    function clampPanel(item, panel) {
      if (!panel || !item) return;
      var itemRect = item.getBoundingClientRect();
      var panelWidth = panel.offsetWidth;
      var viewportWidth = document.documentElement.clientWidth || window.innerWidth;

      // Desired center alignment with trigger
      var idealLeft = itemRect.left + (itemRect.width / 2) - (panelWidth / 2);

      // Clamp within viewport
      if (idealLeft + panelWidth > viewportWidth - gutter) {
        idealLeft = viewportWidth - panelWidth - gutter;
      }
      if (idealLeft < gutter) {
        idealLeft = gutter;
      }

      // Convert to relative offset from parent item
      var relativeLeft = idealLeft - itemRect.left;
      panel.style.left = Math.round(relativeLeft) + 'px';
    }

    // Open a mega-menu panel
    function openPanel(item) {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }

      var panel = item.querySelector('.ritw-mega-panel');
      var trigger = item.querySelector('.ritw-nav-link');
      if (!panel || !trigger) return;

      if (activePanel && activePanel !== panel) {
        closeActivePanel();
      }

      clampPanel(item, panel);
      panel.classList.add('ritw-panel-open');
      trigger.setAttribute('aria-expanded', 'true');
      activePanel = panel;
      activeTrigger = trigger;
    }

    // Close active mega-menu panel
    function closeActivePanel() {
      if (!activePanel) return;
      activePanel.classList.remove('ritw-panel-open');
      if (activeTrigger) {
        activeTrigger.setAttribute('aria-expanded', 'false');
      }
      activePanel = null;
      activeTrigger = null;
    }

    // Schedule delayed close with 150ms HoverIntent buffer
    function scheduleClose() {
      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function() {
        closeActivePanel();
      }, 150);
    }

    // Bind event handlers for desktop hover, focus, and touch
    navItems.forEach(function(item) {
      var trigger = item.querySelector('.ritw-nav-link');
      var panel = item.querySelector('.ritw-mega-panel');
      if (!trigger || !panel) return;

      // Mouse Events
      item.addEventListener('mouseenter', function() {
        openPanel(item);
      });

      item.addEventListener('mouseleave', function() {
        scheduleClose();
      });

      // Keyboard Focus-within
      item.addEventListener('focusin', function() {
        openPanel(item);
      });

      item.addEventListener('focusout', function(e) {
        if (!item.contains(e.relatedTarget)) {
          closeActivePanel();
        }
      });

      // Touch / Tap support
      trigger.addEventListener('click', function(e) {
        // If on touch device or small screen
        if (window.matchMedia('(hover: none)').matches || window.innerWidth < 992) {
          if (!panel.classList.contains('ritw-panel-open')) {
            e.preventDefault();
            openPanel(item);
          }
        }
      });
    });

    // Global keyboard navigation: Escape & Arrow keys
    document.addEventListener('keydown', function(e) {
      if (!activePanel) return;

      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        var triggerToFocus = activeTrigger;
        closeActivePanel();
        if (triggerToFocus) triggerToFocus.focus();
        return;
      }

      // Arrow navigation within open panel
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var links = Array.from(activePanel.querySelectorAll('a'));
        var currentIndex = links.indexOf(document.activeElement);
        if (currentIndex !== -1) {
          e.preventDefault();
          var nextIndex = e.key === 'ArrowDown'
            ? (currentIndex + 1) % links.length
            : (currentIndex - 1 + links.length) % links.length;
          links[nextIndex].focus();
        } else if (links.length > 0) {
          e.preventDefault();
          links[0].focus();
        }
      }
    });

    // Close when tapping outside
    document.addEventListener('click', function(e) {
      if (activePanel && !activePanel.contains(e.target) && !e.target.closest('.ritw-nav-item')) {
        closeActivePanel();
      }
    });

    // Window resize & scroll synchronization (re-clamp open panel smoothly)
    var ticking = false;
    function syncPosition() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          if (activePanel && activeTrigger) {
            var item = activeTrigger.closest('.ritw-nav-item');
            if (item) clampPanel(item, activePanel);
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('resize', syncPosition, { passive: true });
    window.addEventListener('scroll', syncPosition, { passive: true });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRITWNavigation);
  } else {
    initRITWNavigation();
  }
})();

