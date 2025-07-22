// DigitalMeld.ai Navigation JavaScript
// Handles mobile menu toggle, smooth scrolling, and active states

(function() {
  'use strict';

  // =============================================================================
  // MOBILE MENU TOGGLE
  // =============================================================================

  function initMobileMenu() {
    const toggleButton = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');
    
    if (!toggleButton || !menu) return;

    // Handle both click and touch events for better mobile support
    function toggleMenu() {
      const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
      
      // Toggle aria-expanded attribute
      toggleButton.setAttribute('aria-expanded', !isExpanded);
      
      // Toggle menu visibility
      menu.classList.toggle('is-active');
      
      // Prevent body scroll when menu is open on mobile
      if (!isExpanded) {
        document.body.style.overflow = 'hidden';
        // Add slight delay to focus first menu item for better UX
        setTimeout(() => {
          const firstLink = menu.querySelector('.nav-link');
          if (firstLink) firstLink.focus();
        }, 100);
      } else {
        document.body.style.overflow = '';
      }
    }

    toggleButton.addEventListener('click', toggleMenu);
    
    // Add touch event for better mobile responsiveness
    toggleButton.addEventListener('touchend', function(e) {
      e.preventDefault();
      toggleMenu();
    });

    // Close menu when clicking on nav links (mobile)
    const navLinks = menu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth < 768) { // Mobile breakpoint
          menu.classList.remove('is-active');
          toggleButton.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', function(event) {
      if (window.innerWidth < 768 && 
          !toggleButton.contains(event.target) && 
          !menu.contains(event.target) &&
          menu.classList.contains('is-active')) {
        menu.classList.remove('is-active');
        toggleButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Handle window resize - close mobile menu if switching to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 768 && menu.classList.contains('is-active')) {
        menu.classList.remove('is-active');
        toggleButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // =============================================================================
  // SMOOTH SCROLLING
  // =============================================================================

  function initSmoothScrolling() {
    const smoothScrollLinks = document.querySelectorAll('[data-smooth-scroll]');
    
    smoothScrollLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only handle internal anchor links
        if (href.startsWith('#')) {
          e.preventDefault();
          
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            const headerHeight = document.querySelector('.site-header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20; // 20px extra padding
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // =============================================================================
  // ACTIVE NAVIGATION STATE
  // =============================================================================

  function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], main[id], div[id]');
    
    if (sections.length === 0) return;

    function updateActiveNavigation() {
      const scrollPosition = window.scrollY + 100; // Offset for header
      
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });

      // Update active states
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('is-active');
        
        if (href === `#${currentSection}` || 
            (currentSection === '' && href === '/') ||
            (window.location.pathname !== '/' && href === window.location.pathname)) {
          link.classList.add('is-active');
        }
      });
    }

    // Throttle scroll events for performance
    let ticking = false;
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(function() {
          updateActiveNavigation();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll);
    
    // Initial call to set active state on page load
    updateActiveNavigation();
  }

  // =============================================================================
  // HEADER BACKGROUND ON SCROLL
  // =============================================================================

  function initHeaderScrollEffect() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;
    function handleHeaderScroll() {
      if (!ticking) {
        requestAnimationFrame(function() {
          if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleHeaderScroll);
  }

  // =============================================================================
  // KEYBOARD NAVIGATION
  // =============================================================================

  function initKeyboardNavigation() {
    // Handle escape key to close mobile menu
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const menu = document.querySelector('.navbar-menu');
        const toggleButton = document.querySelector('.navbar-toggle');
        
        if (menu && menu.classList.contains('is-active')) {
          menu.classList.remove('is-active');
          toggleButton.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          toggleButton.focus(); // Return focus to toggle button
        }
      }
    });

    // Trap focus within mobile menu when open
    const menu = document.querySelector('.navbar-menu');
    if (!menu) return;

    const focusableElements = menu.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    menu.addEventListener('keydown', function(e) {
      if (e.key === 'Tab' && menu.classList.contains('is-active')) {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  function init() {
    initMobileMenu();
    initSmoothScrolling();
    initActiveNavigation();
    initHeaderScrollEffect();
    initKeyboardNavigation();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();