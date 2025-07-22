// DigitalMeld.ai Theme Management
// Handles theme switching between light and dark modes with persistence

(function() {
  'use strict';

  // =============================================================================
  // THEME MANAGEMENT
  // =============================================================================

  class ThemeManager {
    constructor() {
      this.html = document.documentElement;
      this.themeToggle = null;
      this.currentTheme = this.getStoredTheme() || 'dark';
      
      this.init();
    }

    init() {
      // Set initial theme
      this.setTheme(this.currentTheme);
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupToggle());
      } else {
        this.setupToggle();
      }
    }

    setupToggle() {
      this.themeToggle = document.querySelector('.theme-toggle');
      
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.updateToggleButton();
      }
    }

    getStoredTheme() {
      try {
        return localStorage.getItem('theme');
      } catch (e) {
        // localStorage might not be available
        return null;
      }
    }

    setStoredTheme(theme) {
      try {
        localStorage.setItem('theme', theme);
      } catch (e) {
        // localStorage might not be available
        console.warn('Could not save theme preference');
      }
    }

    setTheme(theme) {
      this.currentTheme = theme;
      this.html.setAttribute('data-theme', theme);
      this.setStoredTheme(theme);
      this.updateToggleButton();
      
      // Dispatch custom event for other components that might need to react
      const themeChangeEvent = new CustomEvent('themechange', {
        detail: { theme: theme }
      });
      document.dispatchEvent(themeChangeEvent);
    }

    toggleTheme() {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    }

    updateToggleButton() {
      if (!this.themeToggle) return;

      const isDark = this.currentTheme === 'dark';
      const lightIcon = this.themeToggle.querySelector('.theme-icon-light');
      const darkIcon = this.themeToggle.querySelector('.theme-icon-dark');
      
      // Update aria-label for accessibility
      this.themeToggle.setAttribute(
        'aria-label', 
        `Switch to ${isDark ? 'light' : 'dark'} mode`
      );
      
      this.themeToggle.setAttribute(
        'title', 
        `Switch to ${isDark ? 'light' : 'dark'} mode`
      );

      // Update icon visibility (handled by CSS, but we can add classes for animation)
      if (lightIcon && darkIcon) {
        if (isDark) {
          lightIcon.style.opacity = '0';
          darkIcon.style.opacity = '1';
        } else {
          lightIcon.style.opacity = '1';
          darkIcon.style.opacity = '0';
        }
      }
    }

    getCurrentTheme() {
      return this.currentTheme;
    }
  }

  // =============================================================================
  // SYSTEM THEME DETECTION
  // =============================================================================

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function watchSystemTheme(themeManager) {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const storedTheme = themeManager.getStoredTheme();
        if (!storedTheme) {
          const systemTheme = e.matches ? 'dark' : 'light';
          themeManager.setTheme(systemTheme);
        }
      });
    }
  }

  // =============================================================================
  // THEME TRANSITIONS
  // =============================================================================

  function enableThemeTransitions() {
    // Add smooth transitions for theme changes
    const style = document.createElement('style');
    style.textContent = `
      *,
      *::before,
      *::after {
        transition: background-color 0.3s ease-in-out, 
                    color 0.3s ease-in-out, 
                    border-color 0.3s ease-in-out,
                    box-shadow 0.3s ease-in-out !important;
      }
      
      /* Disable transitions during page load to prevent flash */
      .theme-transition-disabled *,
      .theme-transition-disabled *::before,
      .theme-transition-disabled *::after {
        transition: none !important;
      }
    `;
    document.head.appendChild(style);

    // Temporarily disable transitions during initial load
    document.body.classList.add('theme-transition-disabled');
    
    // Re-enable transitions after a short delay
    setTimeout(() => {
      document.body.classList.remove('theme-transition-disabled');
    }, 100);
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  // Initialize theme manager
  const themeManager = new ThemeManager();
  
  // Watch for system theme changes
  watchSystemTheme(themeManager);
  
  // Enable smooth theme transitions
  enableThemeTransitions();

  // Make theme manager globally available for debugging
  window.themeManager = themeManager;

  // =============================================================================
  // KEYBOARD SHORTCUTS
  // =============================================================================

  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Shift + T to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      themeManager.toggleTheme();
    }
  });

})();