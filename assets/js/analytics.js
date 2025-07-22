// DigitalMeld.ai Analytics and Conversion Tracking
// Lead generation and user engagement analytics

(function() {
  'use strict';

  // =============================================================================
  // ANALYTICS MANAGER
  // =============================================================================

  class AnalyticsManager {
    constructor() {
      this.isProduction = !this.isDevelopment();
      this.conversionGoals = {
        'contact_form_submit': { value: 10, category: 'lead_generation' },
        'demo_request': { value: 25, category: 'lead_generation' },
        'newsletter_signup': { value: 5, category: 'engagement' },
        'product_interest': { value: 15, category: 'product_engagement' },
        'download_resource': { value: 8, category: 'content_engagement' },
        'video_watch_complete': { value: 12, category: 'content_engagement' }
      };
      this.init();
    }

    init() {
      this.setupEventListeners();
      this.trackPageView();
      this.setupScrollTracking();
      this.setupTimeOnPageTracking();
      this.setupFormTracking();
      this.setupButtonTracking();
      this.setupErrorTracking();
    }

    // =============================================================================
    // PAGE TRACKING
    // =============================================================================

    trackPageView() {
      const pageData = {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        color_depth: screen.colorDepth,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      this.sendEvent('page_view', pageData);
      
      if (this.isDevelopment()) {
        console.log('📊 Page view tracked:', pageData);
      }
    }

    // =============================================================================
    // CONVERSION TRACKING
    // =============================================================================

    trackConversion(goalName, additionalData = {}) {
      const goal = this.conversionGoals[goalName];
      if (!goal) {
        console.warn(`Unknown conversion goal: ${goalName}`);
        return;
      }

      const conversionData = {
        event_category: goal.category,
        event_label: goalName,
        value: goal.value,
        currency: 'USD',
        timestamp: new Date().toISOString(),
        page_location: window.location.href,
        ...additionalData
      };

      this.sendEvent('conversion', conversionData);
      this.sendEvent(goalName, conversionData);

      if (this.isDevelopment()) {
        console.log('🎯 Conversion tracked:', goalName, conversionData);
      }
    }

    // =============================================================================
    // FORM TRACKING
    // =============================================================================

    setupFormTracking() {
      const forms = document.querySelectorAll('form');
      
      forms.forEach((form, index) => {
        const formName = form.name || form.id || `form_${index}`;
        
        // Track form start (first interaction)
        let formStarted = false;
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
          input.addEventListener('focus', () => {
            if (!formStarted) {
              formStarted = true;
              this.sendEvent('form_start', {
                event_category: 'engagement',
                event_label: formName,
                form_name: formName
              });
            }
          });
        });

        // Track form submission
        form.addEventListener('submit', (e) => {
          const formData = new FormData(form);
          const formFields = {};
          
          for (let [key, value] of formData.entries()) {
            // Don't track sensitive data
            if (!this.isSensitiveField(key)) {
              formFields[key] = typeof value === 'string' ? value.substring(0, 100) : 'file';
            }
          }

          this.sendEvent('form_submit', {
            event_category: 'engagement',
            event_label: formName,
            form_name: formName,
            form_fields: Object.keys(formFields).join(',')
          });

          // Track specific conversion based on form type
          if (formName.includes('contact')) {
            this.trackConversion('contact_form_submit', { form_name: formName });
          } else if (formName.includes('demo')) {
            this.trackConversion('demo_request', { form_name: formName });
          } else if (formName.includes('newsletter')) {
            this.trackConversion('newsletter_signup', { form_name: formName });
          }

          if (this.isDevelopment()) {
            console.log('📝 Form submitted:', formName, formFields);
          }
        });

        // Track form abandonment
        let formTouched = false;
        inputs.forEach(input => {
          input.addEventListener('input', () => {
            formTouched = true;
          });
        });

        window.addEventListener('beforeunload', () => {
          if (formTouched && formStarted) {
            this.sendEvent('form_abandon', {
              event_category: 'engagement',
              event_label: formName,
              form_name: formName
            });
          }
        });
      });
    }

    isSensitiveField(fieldName) {
      const sensitiveFields = ['password', 'ssn', 'credit', 'card', 'cvv', 'security'];
      return sensitiveFields.some(field => fieldName.toLowerCase().includes(field));
    }

    // =============================================================================
    // BUTTON AND LINK TRACKING
    // =============================================================================

    setupButtonTracking() {
      // Track CTA buttons
      const ctaButtons = document.querySelectorAll('[data-track="cta"], .cta-button, .btn-primary');
      ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const buttonText = button.textContent.trim();
          const buttonId = button.id || 'unknown';
          const section = this.getElementSection(button);

          this.sendEvent('cta_click', {
            event_category: 'engagement',
            event_label: buttonText,
            button_id: buttonId,
            button_text: buttonText,
            page_section: section
          });

          // Track specific conversions
          if (buttonText.toLowerCase().includes('demo')) {
            this.trackConversion('demo_request', { button_text: buttonText });
          } else if (buttonText.toLowerCase().includes('contact')) {
            this.trackConversion('contact_form_submit', { button_text: buttonText });
          }
        });
      });

      // Track navigation links
      const navLinks = document.querySelectorAll('nav a, .navigation a');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          this.sendEvent('navigation_click', {
            event_category: 'navigation',
            event_label: link.textContent.trim(),
            link_url: link.href,
            link_text: link.textContent.trim()
          });
        });
      });

      // Track external links
      const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="digitalmeld.ai"])');
      externalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          this.sendEvent('external_link_click', {
            event_category: 'engagement',
            event_label: link.href,
            link_url: link.href,
            link_text: link.textContent.trim()
          });
        });
      });

      // Track product interest buttons
      const productButtons = document.querySelectorAll('[data-product]');
      productButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const product = button.dataset.product;
          this.trackConversion('product_interest', { 
            product_name: product,
            button_text: button.textContent.trim()
          });
        });
      });
    }

    getElementSection(element) {
      const section = element.closest('section, .section, [data-section]');
      if (section) {
        return section.id || section.className || section.dataset.section || 'unknown';
      }
      return 'unknown';
    }

    // =============================================================================
    // SCROLL AND ENGAGEMENT TRACKING
    // =============================================================================

    setupScrollTracking() {
      let scrollDepths = [25, 50, 75, 90];
      let trackedDepths = new Set();
      let maxScroll = 0;

      const trackScrollDepth = () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );

        maxScroll = Math.max(maxScroll, scrollPercent);

        scrollDepths.forEach(depth => {
          if (scrollPercent >= depth && !trackedDepths.has(depth)) {
            trackedDepths.add(depth);
            this.sendEvent('scroll_depth', {
              event_category: 'engagement',
              event_label: `${depth}_percent`,
              scroll_depth: depth,
              page_height: document.body.scrollHeight,
              viewport_height: window.innerHeight
            });
          }
        });
      };

      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScrollDepth, 100);
      });

      // Track max scroll on page unload
      window.addEventListener('beforeunload', () => {
        if (maxScroll > 0) {
          this.sendEvent('max_scroll_depth', {
            event_category: 'engagement',
            event_label: `${maxScroll}_percent`,
            max_scroll_depth: maxScroll
          });
        }
      });
    }

    setupTimeOnPageTracking() {
      const startTime = Date.now();
      let engagementTime = 0;
      let isActive = true;

      // Track active time (when page is visible and user is engaged)
      const trackEngagement = () => {
        if (isActive && !document.hidden) {
          engagementTime += 1000; // Add 1 second
        }
      };

      const engagementInterval = setInterval(trackEngagement, 1000);

      // Track when user becomes active/inactive
      document.addEventListener('visibilitychange', () => {
        isActive = !document.hidden;
      });

      window.addEventListener('blur', () => { isActive = false; });
      window.addEventListener('focus', () => { isActive = true; });

      // Track milestones
      const milestones = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
      const trackedMilestones = new Set();

      setInterval(() => {
        const activeSeconds = Math.floor(engagementTime / 1000);
        
        milestones.forEach(milestone => {
          if (activeSeconds >= milestone && !trackedMilestones.has(milestone)) {
            trackedMilestones.add(milestone);
            this.sendEvent('engagement_milestone', {
              event_category: 'engagement',
              event_label: `${milestone}_seconds`,
              engagement_time: activeSeconds
            });
          }
        });
      }, 5000);

      // Send final engagement time on page unload
      window.addEventListener('beforeunload', () => {
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        const activeTime = Math.floor(engagementTime / 1000);

        this.sendEvent('page_engagement', {
          event_category: 'engagement',
          total_time: totalTime,
          active_time: activeTime,
          engagement_rate: totalTime > 0 ? Math.round((activeTime / totalTime) * 100) : 0
        });

        clearInterval(engagementInterval);
      });
    }

    // =============================================================================
    // ERROR TRACKING
    // =============================================================================

    setupErrorTracking() {
      // JavaScript errors
      window.addEventListener('error', (e) => {
        this.sendEvent('javascript_error', {
          event_category: 'error',
          error_message: e.message,
          error_filename: e.filename,
          error_line: e.lineno,
          error_column: e.colno,
          user_agent: navigator.userAgent
        });
      });

      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (e) => {
        this.sendEvent('promise_rejection', {
          event_category: 'error',
          error_message: e.reason?.message || 'Unhandled promise rejection',
          error_stack: e.reason?.stack
        });
      });

      // Resource loading errors
      document.addEventListener('error', (e) => {
        if (e.target !== window) {
          this.sendEvent('resource_error', {
            event_category: 'error',
            resource_url: e.target.src || e.target.href,
            resource_type: e.target.tagName.toLowerCase(),
            error_type: 'load_error'
          });
        }
      }, true);
    }

    // =============================================================================
    // EVENT SENDING
    // =============================================================================

    sendEvent(eventName, eventData = {}) {
      if (!this.isProduction) {
        console.log(`📊 Analytics Event: ${eventName}`, eventData);
        return;
      }

      // Send to Google Analytics 4
      if (window.gtag) {
        window.gtag('event', eventName, {
          ...eventData,
          send_to: 'default' // Send to default GA4 property
        });
      }

      // Send to Google Analytics Universal (if still configured)
      if (window.ga) {
        window.ga('send', 'event', {
          eventCategory: eventData.event_category || 'general',
          eventAction: eventName,
          eventLabel: eventData.event_label,
          eventValue: eventData.value
        });
      }

      // Send to other analytics platforms (add as needed)
      this.sendToCustomAnalytics(eventName, eventData);
    }

    sendToCustomAnalytics(eventName, eventData) {
      // Placeholder for custom analytics integrations
      // Examples: Mixpanel, Amplitude, Segment, etc.
      
      // Example: Send to a custom endpoint
      if (this.isProduction) {
        fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: eventName,
            data: eventData,
            timestamp: new Date().toISOString(),
            session_id: this.getSessionId()
          })
        }).catch(err => {
          console.warn('Failed to send custom analytics:', err);
        });
      }
    }

    // =============================================================================
    // UTILITY METHODS
    // =============================================================================

    getSessionId() {
      let sessionId = sessionStorage.getItem('analytics_session_id');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('analytics_session_id', sessionId);
      }
      return sessionId;
    }

    isDevelopment() {
      return window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ||
             window.location.hostname.includes('github.io') ||
             window.location.search.includes('debug=true');
    }

    setupEventListeners() {
      // Custom event listeners for manual tracking
      document.addEventListener('track-conversion', (e) => {
        this.trackConversion(e.detail.goal, e.detail.data);
      });

      document.addEventListener('track-event', (e) => {
        this.sendEvent(e.detail.event, e.detail.data);
      });
    }
  }

  // =============================================================================
  // GLOBAL ANALYTICS API
  // =============================================================================

  window.DigitalMeldAnalytics = {
    track: (eventName, eventData) => {
      if (window.analyticsManager) {
        window.analyticsManager.sendEvent(eventName, eventData);
      }
    },
    
    trackConversion: (goalName, additionalData) => {
      if (window.analyticsManager) {
        window.analyticsManager.trackConversion(goalName, additionalData);
      }
    },

    // Convenience methods for common events
    trackButtonClick: (buttonText, section) => {
      window.DigitalMeldAnalytics.track('button_click', {
        event_category: 'engagement',
        event_label: buttonText,
        page_section: section
      });
    },

    trackFormSubmit: (formName) => {
      window.DigitalMeldAnalytics.track('form_submit', {
        event_category: 'engagement',
        event_label: formName,
        form_name: formName
      });
    },

    trackProductInterest: (productName) => {
      window.DigitalMeldAnalytics.trackConversion('product_interest', {
        product_name: productName
      });
    }
  };

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  function init() {
    window.analyticsManager = new AnalyticsManager();
    
    // Make available for debugging
    if (window.analyticsManager.isDevelopment()) {
      window.analytics = window.analyticsManager;
      console.log('🔧 Analytics Manager initialized in development mode');
      console.log('Available methods:', Object.keys(window.DigitalMeldAnalytics));
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();