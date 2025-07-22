// DigitalMeld.ai Accessibility Enhancements
// Keyboard navigation, ARIA management, and accessibility features

(function() {
  'use strict';

  // =============================================================================
  // KEYBOARD NAVIGATION MANAGEMENT
  // =============================================================================

  class KeyboardNavigation {
    constructor() {
      this.mobileMenuOpen = false;
      this.focusableElements = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      this.init();
    }

    init() {
      this.setupMobileMenuNavigation();
      this.setupSkipLinks();
      this.setupFocusManagement();
      this.setupEscapeKeyHandling();
      this.setupArrowKeyNavigation();
    }

    setupMobileMenuNavigation() {
      const mobileToggle = document.querySelector('.navbar-toggle');
      const mobileMenu = document.querySelector('.navbar-menu');
      const navLinks = document.querySelectorAll('.nav-link');

      if (!mobileToggle || !mobileMenu) return;

      mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });

      // Handle keyboard navigation in mobile menu
      mobileToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleMobileMenu();
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.mobileMenuOpen && !mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          this.closeMobileMenu();
        }
      });

      // Handle navigation within menu items
      navLinks.forEach((link, index) => {
        link.addEventListener('keydown', (e) => {
          if (!this.mobileMenuOpen) return;

          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault();
              this.focusNextMenuItem(index, navLinks);
              break;
            case 'ArrowUp':
              e.preventDefault();
              this.focusPreviousMenuItem(index, navLinks);
              break;
            case 'Home':
              e.preventDefault();
              navLinks[0].focus();
              break;
            case 'End':
              e.preventDefault();
              navLinks[navLinks.length - 1].focus();
              break;
          }
        });
      });
    }

    toggleMobileMenu() {
      const mobileToggle = document.querySelector('.navbar-toggle');
      const mobileMenu = document.querySelector('.navbar-menu');
      const navLinks = document.querySelectorAll('.nav-link');
      const themeToggle = document.querySelector('.theme-toggle');

      this.mobileMenuOpen = !this.mobileMenuOpen;

      // Update ARIA attributes
      mobileToggle.setAttribute('aria-expanded', this.mobileMenuOpen);
      mobileMenu.setAttribute('aria-hidden', !this.mobileMenuOpen);

      // Update classes
      mobileMenu.classList.toggle('is-active', this.mobileMenuOpen);

      // Manage tabindex for keyboard navigation
      const tabIndex = this.mobileMenuOpen ? '0' : '-1';
      navLinks.forEach(link => link.setAttribute('tabindex', tabIndex));
      if (themeToggle) themeToggle.setAttribute('tabindex', tabIndex);

      // Focus management
      if (this.mobileMenuOpen) {
        // Focus first menu item when opening
        setTimeout(() => {
          if (navLinks[0]) navLinks[0].focus();
        }, 100);
      } else {
        // Return focus to toggle button when closing
        mobileToggle.focus();
      }
    }

    closeMobileMenu() {
      if (!this.mobileMenuOpen) return;
      this.toggleMobileMenu();
    }

    focusNextMenuItem(currentIndex, navLinks) {
      const nextIndex = (currentIndex + 1) % navLinks.length;
      navLinks[nextIndex].focus();
    }

    focusPreviousMenuItem(currentIndex, navLinks) {
      const prevIndex = currentIndex === 0 ? navLinks.length - 1 : currentIndex - 1;
      navLinks[prevIndex].focus();
    }

    setupSkipLinks() {
      const skipLinks = document.querySelectorAll('a[href^="#"]');
      
      skipLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const targetId = link.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });
            
            // Set focus to target for screen readers
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
            
            // Remove tabindex after focus
            targetElement.addEventListener('blur', () => {
              targetElement.removeAttribute('tabindex');
            }, { once: true });
          }
        });
      });
    }

    setupFocusManagement() {
      // Trap focus in modals and overlays
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          this.handleTabNavigation(e);
        }
      });

      // Enhanced focus indicators
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-navigation');
        }
      });

      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
      });
    }

    handleTabNavigation(e) {
      if (!this.mobileMenuOpen) return;

      const mobileMenu = document.querySelector('.navbar-menu');
      const focusableElements = mobileMenu.querySelectorAll(this.focusableElements);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    setupEscapeKeyHandling() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.mobileMenuOpen) {
            this.closeMobileMenu();
          }
        }
      });
    }

    setupArrowKeyNavigation() {
      // Arrow key navigation for card grids
      const cardGrids = document.querySelectorAll('.product-grid, .features-grid, .how-it-works-grid');
      
      cardGrids.forEach(grid => {
        const cards = grid.querySelectorAll('.product-card, .feature-card, .how-it-works-card');
        
        cards.forEach((card, index) => {
          // Make cards focusable
          if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
          }

          card.addEventListener('keydown', (e) => {
            let targetIndex;
            const cols = this.getGridColumns(grid);
            
            switch (e.key) {
              case 'ArrowRight':
                e.preventDefault();
                targetIndex = (index + 1) % cards.length;
                break;
              case 'ArrowLeft':
                e.preventDefault();
                targetIndex = index === 0 ? cards.length - 1 : index - 1;
                break;
              case 'ArrowDown':
                e.preventDefault();
                targetIndex = (index + cols) % cards.length;
                break;
              case 'ArrowUp':
                e.preventDefault();
                targetIndex = index - cols < 0 ? index + cols * (Math.floor(cards.length / cols)) : index - cols;
                break;
              case 'Home':
                e.preventDefault();
                targetIndex = 0;
                break;
              case 'End':
                e.preventDefault();
                targetIndex = cards.length - 1;
                break;
            }

            if (targetIndex !== undefined && cards[targetIndex]) {
              cards[targetIndex].focus();
            }
          });
        });
      });
    }

    getGridColumns(grid) {
      const computedStyle = window.getComputedStyle(grid);
      const gridTemplateColumns = computedStyle.gridTemplateColumns;
      return gridTemplateColumns.split(' ').length;
    }
  }

  // =============================================================================
  // ARIA LIVE REGIONS AND ANNOUNCEMENTS
  // =============================================================================

  class AriaAnnouncements {
    constructor() {
      this.createLiveRegions();
      this.setupFormValidation();
      this.setupLoadingStates();
    }

    createLiveRegions() {
      // Create polite live region for non-urgent announcements
      const politeRegion = document.createElement('div');
      politeRegion.setAttribute('aria-live', 'polite');
      politeRegion.setAttribute('aria-atomic', 'true');
      politeRegion.className = 'sr-only';
      politeRegion.id = 'aria-live-polite';
      document.body.appendChild(politeRegion);

      // Create assertive live region for urgent announcements
      const assertiveRegion = document.createElement('div');
      assertiveRegion.setAttribute('aria-live', 'assertive');
      assertiveRegion.setAttribute('aria-atomic', 'true');
      assertiveRegion.className = 'sr-only';
      assertiveRegion.id = 'aria-live-assertive';
      document.body.appendChild(assertiveRegion);
    }

    announce(message, priority = 'polite') {
      const region = document.getElementById(`aria-live-${priority}`);
      if (region) {
        region.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
          region.textContent = '';
        }, 1000);
      }
    }

    setupFormValidation() {
      const forms = document.querySelectorAll('form');
      
      forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
          input.addEventListener('invalid', (e) => {
            const errorMessage = this.getValidationMessage(input);
            this.announce(`Error: ${errorMessage}`, 'assertive');
            
            // Update aria-invalid
            input.setAttribute('aria-invalid', 'true');
          });

          input.addEventListener('input', () => {
            if (input.checkValidity()) {
              input.setAttribute('aria-invalid', 'false');
            }
          });
        });

        form.addEventListener('submit', (e) => {
          const isValid = form.checkValidity();
          if (isValid) {
            this.announce('Form submitted successfully', 'polite');
          } else {
            this.announce('Please correct the errors in the form', 'assertive');
          }
        });
      });
    }

    getValidationMessage(input) {
      if (input.validity.valueMissing) {
        return `${this.getFieldLabel(input)} is required`;
      }
      if (input.validity.typeMismatch) {
        return `Please enter a valid ${input.type}`;
      }
      if (input.validity.patternMismatch) {
        return `${this.getFieldLabel(input)} format is invalid`;
      }
      return input.validationMessage;
    }

    getFieldLabel(input) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      return label ? label.textContent : input.name || 'Field';
    }

    setupLoadingStates() {
      // Monitor for dynamic content loading
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.classList && node.classList.contains('loading')) {
                  this.announce('Content is loading', 'polite');
                }
                if (node.classList && node.classList.contains('loaded')) {
                  this.announce('Content loaded', 'polite');
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // =============================================================================
  // THEME TOGGLE ACCESSIBILITY
  // =============================================================================

  class ThemeToggleAccessibility {
    constructor() {
      this.setupThemeToggle();
    }

    setupThemeToggle() {
      const themeToggle = document.querySelector('.theme-toggle');
      if (!themeToggle) return;

      // Update ARIA label based on current theme
      this.updateThemeToggleLabel();

      // Listen for theme changes
      const observer = new MutationObserver(() => {
        this.updateThemeToggleLabel();
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });

      // Announce theme changes
      themeToggle.addEventListener('click', () => {
        setTimeout(() => {
          const currentTheme = document.documentElement.getAttribute('data-theme');
          const announcement = `Switched to ${currentTheme} theme`;
          window.ariaAnnouncements?.announce(announcement, 'polite');
        }, 100);
      });
    }

    updateThemeToggleLabel() {
      const themeToggle = document.querySelector('.theme-toggle');
      if (!themeToggle) return;

      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
      themeToggle.setAttribute('aria-pressed', currentTheme === 'light' ? 'true' : 'false');
    }
  }

  // =============================================================================
  // COLOR CONTRAST AND VISUAL ACCESSIBILITY
  // =============================================================================

  class VisualAccessibility {
    constructor() {
      this.setupHighContrastMode();
      this.setupReducedMotion();
      this.setupFontSizeAdjustment();
    }

    setupHighContrastMode() {
      // Detect high contrast preference
      if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
      }

      // Listen for changes
      window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
        document.body.classList.toggle('high-contrast', e.matches);
      });
    }

    setupReducedMotion() {
      // Detect reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
      }

      // Listen for changes
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        document.body.classList.toggle('reduced-motion', e.matches);
      });
    }

    setupFontSizeAdjustment() {
      // Respect user's font size preferences
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const userFontSize = parseFloat(getComputedStyle(document.body).fontSize);
      
      if (userFontSize > rootFontSize * 1.2) {
        document.body.classList.add('large-text');
      }
    }
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Initialize all accessibility features
    window.keyboardNavigation = new KeyboardNavigation();
    window.ariaAnnouncements = new AriaAnnouncements();
    window.themeToggleAccessibility = new ThemeToggleAccessibility();
    window.visualAccessibility = new VisualAccessibility();

    // Announce page load completion
    setTimeout(() => {
      window.ariaAnnouncements?.announce('Page loaded successfully', 'polite');
    }, 1000);
  }

})();