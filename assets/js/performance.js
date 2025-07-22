// DigitalMeld.ai Performance Monitoring
// Core Web Vitals and performance metrics tracking

(function() {
  'use strict';

  // =============================================================================
  // CORE WEB VITALS MEASUREMENT
  // =============================================================================

  class PerformanceMonitor {
    constructor() {
      this.metrics = {};
      this.observers = [];
      this.init();
    }

    init() {
      this.measureCoreWebVitals();
      this.measureCustomMetrics();
      this.setupPerformanceObserver();
      this.reportMetrics();
    }

    measureCoreWebVitals() {
      // Largest Contentful Paint (LCP)
      this.measureLCP();
      
      // First Input Delay (FID)
      this.measureFID();
      
      // Cumulative Layout Shift (CLS)
      this.measureCLS();
      
      // First Contentful Paint (FCP)
      this.measureFCP();
      
      // Time to First Byte (TTFB)
      this.measureTTFB();
    }

    measureLCP() {
      if (!('PerformanceObserver' in window)) return;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.metrics.lcp = {
          value: lastEntry.startTime,
          rating: this.getRating(lastEntry.startTime, [2500, 4000]),
          element: lastEntry.element?.tagName || 'unknown'
        };
        
        this.logMetric('LCP', this.metrics.lcp);
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('LCP measurement not supported');
      }
    }

    measureFID() {
      if (!('PerformanceObserver' in window)) return;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = {
            value: entry.processingStart - entry.startTime,
            rating: this.getRating(entry.processingStart - entry.startTime, [100, 300]),
            eventType: entry.name
          };
          
          this.logMetric('FID', this.metrics.fid);
        });
      });

      try {
        observer.observe({ entryTypes: ['first-input'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('FID measurement not supported');
      }
    }

    measureCLS() {
      if (!('PerformanceObserver' in window)) return;

      let clsValue = 0;
      let sessionValue = 0;
      let sessionEntries = [];

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            if (sessionValue && 
                entry.startTime - lastSessionEntry.startTime < 1000 &&
                entry.startTime - firstSessionEntry.startTime < 5000) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }

            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              
              this.metrics.cls = {
                value: clsValue,
                rating: this.getRating(clsValue, [0.1, 0.25]),
                entries: sessionEntries.length
              };
              
              this.logMetric('CLS', this.metrics.cls);
            }
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('CLS measurement not supported');
      }
    }

    measureFCP() {
      if (!('PerformanceObserver' in window)) return;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = {
              value: entry.startTime,
              rating: this.getRating(entry.startTime, [1800, 3000])
            };
            
            this.logMetric('FCP', this.metrics.fcp);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['paint'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('FCP measurement not supported');
      }
    }

    measureTTFB() {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        
        this.metrics.ttfb = {
          value: ttfb,
          rating: this.getRating(ttfb, [800, 1800])
        };
        
        this.logMetric('TTFB', this.metrics.ttfb);
      }
    }

    measureCustomMetrics() {
      // Time to Interactive (TTI) approximation
      this.measureTTI();
      
      // Resource loading metrics
      this.measureResourceMetrics();
      
      // JavaScript execution time
      this.measureJSExecutionTime();
    }

    measureTTI() {
      // Simple TTI approximation based on main thread quiet periods
      if (!('PerformanceObserver' in window)) return;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let lastLongTask = 0;
        
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            lastLongTask = entry.startTime + entry.duration;
          }
        });

        // TTI is approximately when the last long task ended
        const tti = Math.max(lastLongTask, this.metrics.fcp?.value || 0);
        
        this.metrics.tti = {
          value: tti,
          rating: this.getRating(tti, [3800, 7300])
        };
        
        this.logMetric('TTI', this.metrics.tti);
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
        this.observers.push(observer);
      } catch (e) {
        console.warn('TTI measurement not supported');
      }
    }

    measureResourceMetrics() {
      const resources = performance.getEntriesByType('resource');
      const metrics = {
        totalResources: resources.length,
        totalSize: 0,
        slowResources: [],
        resourceTypes: {}
      };

      resources.forEach((resource) => {
        const duration = resource.responseEnd - resource.requestStart;
        
        // Track slow resources (>1s)
        if (duration > 1000) {
          metrics.slowResources.push({
            name: resource.name,
            duration: duration,
            size: resource.transferSize || 0
          });
        }

        // Track resource types
        const type = this.getResourceType(resource);
        metrics.resourceTypes[type] = (metrics.resourceTypes[type] || 0) + 1;
        
        // Estimate total size
        metrics.totalSize += resource.transferSize || 0;
      });

      this.metrics.resources = metrics;
      this.logMetric('Resources', metrics);
    }

    measureJSExecutionTime() {
      const scriptResources = performance.getEntriesByType('resource')
        .filter(resource => resource.name.includes('.js'));
      
      let totalJSTime = 0;
      scriptResources.forEach((script) => {
        totalJSTime += script.responseEnd - script.requestStart;
      });

      this.metrics.jsExecution = {
        totalTime: totalJSTime,
        scriptCount: scriptResources.length,
        rating: this.getRating(totalJSTime, [1000, 2000])
      };

      this.logMetric('JS Execution', this.metrics.jsExecution);
    }

    setupPerformanceObserver() {
      // Monitor for performance issues
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'measure') {
              console.log(`Custom metric: ${entry.name} = ${entry.duration}ms`);
            }
          });
        });

        try {
          observer.observe({ entryTypes: ['measure'] });
          this.observers.push(observer);
        } catch (e) {
          console.warn('Performance observer not fully supported');
        }
      }
    }

    getRating(value, thresholds) {
      if (value <= thresholds[0]) return 'good';
      if (value <= thresholds[1]) return 'needs-improvement';
      return 'poor';
    }

    getResourceType(resource) {
      const name = resource.name.toLowerCase();
      if (name.includes('.css')) return 'css';
      if (name.includes('.js')) return 'js';
      if (name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
      if (name.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
      return 'other';
    }

    logMetric(name, metric) {
      if (this.isDevelopment()) {
        console.group(`📊 ${name} Performance`);
        console.log(`Value: ${metric.value?.toFixed(2) || 'N/A'}ms`);
        console.log(`Rating: ${metric.rating || 'unknown'}`);
        if (metric.element) console.log(`Element: ${metric.element}`);
        if (metric.entries) console.log(`Layout shifts: ${metric.entries}`);
        console.groupEnd();
      }
    }

    reportMetrics() {
      // Wait for page load to complete before reporting
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.generateReport();
        }, 2000);
      });
    }

    generateReport() {
      const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        connection: this.getConnectionInfo(),
        metrics: this.metrics,
        recommendations: this.generateRecommendations()
      };

      if (this.isDevelopment()) {
        console.group('🚀 Performance Report');
        console.table(this.getMetricsSummary());
        console.log('Full report:', report);
        console.groupEnd();
      }

      // Send to analytics in production
      this.sendToAnalytics(report);
    }

    getConnectionInfo() {
      if ('connection' in navigator) {
        const conn = navigator.connection;
        return {
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt,
          saveData: conn.saveData
        };
      }
      return null;
    }

    getMetricsSummary() {
      return {
        'LCP (ms)': this.metrics.lcp?.value?.toFixed(2) || 'N/A',
        'FID (ms)': this.metrics.fid?.value?.toFixed(2) || 'N/A',
        'CLS': this.metrics.cls?.value?.toFixed(3) || 'N/A',
        'FCP (ms)': this.metrics.fcp?.value?.toFixed(2) || 'N/A',
        'TTFB (ms)': this.metrics.ttfb?.value?.toFixed(2) || 'N/A',
        'TTI (ms)': this.metrics.tti?.value?.toFixed(2) || 'N/A'
      };
    }

    generateRecommendations() {
      const recommendations = [];

      if (this.metrics.lcp?.rating === 'poor') {
        recommendations.push('Optimize largest contentful paint by compressing images and reducing server response time');
      }

      if (this.metrics.fid?.rating === 'poor') {
        recommendations.push('Reduce JavaScript execution time and break up long tasks');
      }

      if (this.metrics.cls?.rating === 'poor') {
        recommendations.push('Add size attributes to images and reserve space for dynamic content');
      }

      if (this.metrics.resources?.slowResources.length > 0) {
        recommendations.push(`Optimize ${this.metrics.resources.slowResources.length} slow-loading resources`);
      }

      return recommendations;
    }

    sendToAnalytics(report) {
      // In production, send to your analytics service
      if (!this.isDevelopment() && window.gtag) {
        // Send Core Web Vitals to Google Analytics
        window.gtag('event', 'core_web_vitals', {
          custom_map: {
            lcp: 'largest_contentful_paint',
            fid: 'first_input_delay',
            cls: 'cumulative_layout_shift'
          },
          lcp: this.metrics.lcp?.value,
          fid: this.metrics.fid?.value,
          cls: this.metrics.cls?.value
        });

        // Send performance metrics
        window.gtag('event', 'performance_metrics', {
          event_category: 'performance',
          fcp: this.metrics.fcp?.value,
          ttfb: this.metrics.ttfb?.value,
          tti: this.metrics.tti?.value,
          resource_count: this.metrics.resources?.totalResources,
          slow_resources: this.metrics.resources?.slowResources?.length || 0
        });

        // Send connection info if available
        if (report.connection) {
          window.gtag('event', 'connection_info', {
            event_category: 'performance',
            effective_type: report.connection.effectiveType,
            downlink: report.connection.downlink,
            rtt: report.connection.rtt,
            save_data: report.connection.saveData
          });
        }
      }
    }

    isDevelopment() {
      return window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ||
             window.location.hostname.includes('github.io');
    }

    cleanup() {
      this.observers.forEach(observer => observer.disconnect());
      this.observers = [];
    }
  }

  // =============================================================================
  // LIGHTHOUSE SCORE ESTIMATION
  // =============================================================================

  class LighthouseEstimator {
    constructor(performanceMonitor) {
      this.performanceMonitor = performanceMonitor;
    }

    estimateScore() {
      const metrics = this.performanceMonitor.metrics;
      
      // Simplified Lighthouse scoring algorithm
      const scores = {
        performance: this.calculatePerformanceScore(metrics),
        accessibility: this.estimateAccessibilityScore(),
        bestPractices: this.estimateBestPracticesScore(),
        seo: this.estimateSEOScore()
      };

      const overall = Math.round(
        (scores.performance * 0.4 + 
         scores.accessibility * 0.2 + 
         scores.bestPractices * 0.2 + 
         scores.seo * 0.2)
      );

      return { ...scores, overall };
    }

    calculatePerformanceScore(metrics) {
      // Simplified performance score calculation
      let score = 100;

      if (metrics.lcp?.value > 4000) score -= 20;
      else if (metrics.lcp?.value > 2500) score -= 10;

      if (metrics.fid?.value > 300) score -= 15;
      else if (metrics.fid?.value > 100) score -= 8;

      if (metrics.cls?.value > 0.25) score -= 15;
      else if (metrics.cls?.value > 0.1) score -= 8;

      if (metrics.fcp?.value > 3000) score -= 10;
      else if (metrics.fcp?.value > 1800) score -= 5;

      return Math.max(0, score);
    }

    estimateAccessibilityScore() {
      // Basic accessibility checks
      let score = 100;
      
      // Check for alt attributes on images
      const images = document.querySelectorAll('img');
      const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
      if (imagesWithoutAlt.length > 0) {
        score -= Math.min(20, imagesWithoutAlt.length * 5);
      }

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length === 0) score -= 10;

      // Check for form labels
      const inputs = document.querySelectorAll('input, select, textarea');
      const inputsWithoutLabels = Array.from(inputs).filter(input => {
        return !input.labels || input.labels.length === 0;
      });
      if (inputsWithoutLabels.length > 0) {
        score -= Math.min(15, inputsWithoutLabels.length * 3);
      }

      return Math.max(0, score);
    }

    estimateBestPracticesScore() {
      let score = 100;

      // Check for HTTPS
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        score -= 20;
      }

      // Check for service worker
      if (!('serviceWorker' in navigator)) {
        score -= 10;
      }

      // Check for console errors
      const originalError = console.error;
      let errorCount = 0;
      console.error = function(...args) {
        errorCount++;
        originalError.apply(console, args);
      };

      setTimeout(() => {
        if (errorCount > 0) {
          score -= Math.min(15, errorCount * 3);
        }
        console.error = originalError;
      }, 1000);

      return Math.max(0, score);
    }

    estimateSEOScore() {
      let score = 100;

      // Check for title tag
      if (!document.title || document.title.length < 10) {
        score -= 20;
      }

      // Check for meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription || metaDescription.content.length < 50) {
        score -= 15;
      }

      // Check for h1 tag
      const h1 = document.querySelector('h1');
      if (!h1) {
        score -= 10;
      }

      // Check for viewport meta tag
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        score -= 10;
      }

      return Math.max(0, score);
    }
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  let performanceMonitor;
  let lighthouseEstimator;

  function init() {
    performanceMonitor = new PerformanceMonitor();
    lighthouseEstimator = new LighthouseEstimator(performanceMonitor);

    // Generate Lighthouse estimate after metrics are collected
    setTimeout(() => {
      const scores = lighthouseEstimator.estimateScore();
      
      if (performanceMonitor.isDevelopment()) {
        console.group('💡 Lighthouse Score Estimate');
        console.table(scores);
        console.groupEnd();
      }
    }, 5000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (performanceMonitor) {
      performanceMonitor.cleanup();
    }
  });

  // Make available globally for debugging
  window.performanceMonitor = performanceMonitor;
  window.lighthouseEstimator = lighthouseEstimator;

})();