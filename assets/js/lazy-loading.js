// DigitalMeld.ai Lazy Loading JavaScript
// Implements intersection observer for performance optimization

(function() {
  'use strict';

  // =============================================================================
  // LAZY LOADING CONFIGURATION
  // =============================================================================

  const config = {
    rootMargin: '50px 0px',
    threshold: 0.01
  };

  // =============================================================================
  // INTERSECTION OBSERVER SETUP
  // =============================================================================

  function createImageObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver support
      loadAllImages();
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    }, config);

    return imageObserver;
  }

  // =============================================================================
  // IMAGE LOADING FUNCTIONS
  // =============================================================================

  function loadImage(img) {
    // Handle responsive images with srcset
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
    }
    
    // Handle regular src
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }

    // Add loading class for fade-in effect
    img.classList.add('loading');

    // Handle load event
    img.addEventListener('load', function() {
      img.classList.remove('loading');
      img.classList.add('loaded');
    });

    // Handle error event
    img.addEventListener('error', function() {
      img.classList.remove('loading');
      img.classList.add('error');
      console.warn('Failed to load image:', img.dataset.src || img.dataset.srcset);
    });

    // Remove data attributes to prevent reprocessing
    delete img.dataset.src;
    delete img.dataset.srcset;
  }

  function loadAllImages() {
    // Fallback function for browsers without IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
    lazyImages.forEach(loadImage);
  }

  // =============================================================================
  // RESPONSIVE IMAGE UTILITIES
  // =============================================================================

  function generateResponsiveImageMarkup(baseName, alt, sizes = '100vw') {
    const extensions = ['webp', 'jpg', 'png'];
    const breakpoints = [320, 640, 768, 1024, 1280, 1536];
    
    let srcset = '';
    let fallbackSrc = '';
    
    // Generate srcset for different screen sizes
    breakpoints.forEach((width, index) => {
      const filename = `${baseName}-${width}w`;
      
      // Try WebP first, then fallback to JPG
      if (index === 0) {
        fallbackSrc = `/assets/images/${filename}.jpg`;
      }
      
      srcset += `/assets/images/${filename}.webp ${width}w, `;
      srcset += `/assets/images/${filename}.jpg ${width}w`;
      
      if (index < breakpoints.length - 1) {
        srcset += ', ';
      }
    });

    return {
      srcset: srcset,
      src: fallbackSrc,
      alt: alt,
      sizes: sizes
    };
  }

  // =============================================================================
  // PERFORMANCE MONITORING
  // =============================================================================

  function measureImagePerformance() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.initiatorType === 'img') {
          // Log image loading performance in development
          if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`Image loaded: ${entry.name} (${Math.round(entry.duration)}ms)`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  // =============================================================================
  // PRELOAD CRITICAL IMAGES
  // =============================================================================

  function preloadCriticalImages() {
    const criticalImages = [
      '/assets/images/rubicon-dashboard.jpg',
      '/assets/images/rubicon-safety-overview.jpg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // =============================================================================
  // WEBP SUPPORT DETECTION
  // =============================================================================

  function supportsWebP() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  async function init() {
    // Check WebP support and add class to html element
    const webpSupported = await supportsWebP();
    if (webpSupported) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }

    // Preload critical images
    preloadCriticalImages();

    // Set up lazy loading
    const imageObserver = createImageObserver();
    
    if (imageObserver) {
      // Observe all images with data-src or data-srcset
      const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    }

    // Start performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      measureImagePerformance();
    }
  }

  // =============================================================================
  // UTILITY FUNCTIONS FOR DYNAMIC CONTENT
  // =============================================================================

  // Function to be called when new images are added dynamically
  window.initLazyLoading = function(container = document) {
    const imageObserver = createImageObserver();
    if (imageObserver) {
      const newLazyImages = container.querySelectorAll('img[data-src], img[data-srcset]');
      newLazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();