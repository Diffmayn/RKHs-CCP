// 📊 Performance Monitoring Script
// Add this to track your performance improvements
// Place at the end of your HTML body or in your main JS file

(function() {
  'use strict';
  
  // Performance metrics collector
  const performanceMetrics = {
    startTime: performance.now(),
    domReady: null,
    loadComplete: null,
    firstPaint: null,
    firstContentfulPaint: null,
    domQueries: 0,
    timerLeaks: 0,
    memoryUsage: null
  };
  
  // Track DOM queries (monkey patch for monitoring)
  const originalGetElementById = document.getElementById;
  const originalQuerySelector = document.querySelector;
  const originalQuerySelectorAll = document.querySelectorAll;
  
  document.getElementById = function(id) {
    performanceMetrics.domQueries++;
    return originalGetElementById.call(this, id);
  };
  
  document.querySelector = function(selector) {
    performanceMetrics.domQueries++;
    return originalQuerySelector.call(this, selector);
  };
  
  document.querySelectorAll = function(selector) {
    performanceMetrics.domQueries++;
    return originalQuerySelectorAll.call(this, selector);
  };
  
  // Track timer usage
  const originalSetTimeout = window.setTimeout;
  const originalSetInterval = window.setInterval;
  let activeTimers = 0;
  
  window.setTimeout = function(callback, delay) {
    activeTimers++;
    const timerId = originalSetTimeout.call(this, function() {
      activeTimers--;
      callback.apply(this, arguments);
    }, delay);
    return timerId;
  };
  
  window.setInterval = function(callback, delay) {
    activeTimers++;
    return originalSetInterval.call(this, callback, delay);
  };
  
  // Collect Paint Timing API data
  function collectPaintMetrics() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          performanceMetrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          performanceMetrics.firstContentfulPaint = entry.startTime;
        }
      });
    }
  }
  
  // Collect memory usage
  function collectMemoryMetrics() {
    if ('performance' in window && 'memory' in performance) {
      performanceMetrics.memoryUsage = {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
  }
  
  // DOM Ready tracking
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      performanceMetrics.domReady = performance.now() - performanceMetrics.startTime;
    });
  } else {
    performanceMetrics.domReady = performance.now() - performanceMetrics.startTime;
  }
  
  // Load Complete tracking  
  window.addEventListener('load', function() {
    performanceMetrics.loadComplete = performance.now() - performanceMetrics.startTime;
    collectPaintMetrics();
    collectMemoryMetrics();
    
    // Report metrics after a short delay
    setTimeout(() => {
      reportPerformanceMetrics();
    }, 1000);
  });
  
  // Performance reporting function
  function reportPerformanceMetrics() {
    performanceMetrics.timerLeaks = activeTimers;
    
    console.group('🚀 RKH\'s CCP Performance Report');
    console.log('📊 Load Performance:');
    console.log(`   DOM Ready: ${performanceMetrics.domReady?.toFixed(2)}ms`);
    console.log(`   Load Complete: ${performanceMetrics.loadComplete?.toFixed(2)}ms`);
    console.log(`   First Paint: ${performanceMetrics.firstPaint?.toFixed(2)}ms`);
    console.log(`   First Contentful Paint: ${performanceMetrics.firstContentfulPaint?.toFixed(2)}ms`);
    
    console.log('🔍 DOM Query Efficiency:');
    console.log(`   Total DOM Queries: ${performanceMetrics.domQueries}`);
    console.log(`   Queries per second: ${(performanceMetrics.domQueries / (performanceMetrics.loadComplete / 1000)).toFixed(2)}`);
    
    console.log('⏲️ Timer Management:');
    console.log(`   Active Timers: ${performanceMetrics.timerLeaks}`);
    console.log(`   Memory Leak Risk: ${performanceMetrics.timerLeaks > 10 ? 'HIGH' : performanceMetrics.timerLeaks > 5 ? 'MEDIUM' : 'LOW'}`);
    
    if (performanceMetrics.memoryUsage) {
      console.log('🧠 Memory Usage:');
      console.log(`   Used Heap: ${(performanceMetrics.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`   Total Heap: ${(performanceMetrics.memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`   Heap Limit: ${(performanceMetrics.memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
    }
    
    // Performance score calculation
    let score = 100;
    if (performanceMetrics.loadComplete > 3000) score -= 20; // Slow loading
    if (performanceMetrics.firstContentfulPaint > 1500) score -= 15; // Slow FCP
    if (performanceMetrics.domQueries > 100) score -= 10; // Too many queries
    if (performanceMetrics.timerLeaks > 10) score -= 15; // Timer leaks
    if (performanceMetrics.memoryUsage && performanceMetrics.memoryUsage.usedJSHeapSize > 50 * 1024 * 1024) score -= 10; // High memory
    
    console.log(`📈 Performance Score: ${Math.max(score, 0)}/100`);
    
    if (score >= 90) {
      console.log('🎉 Excellent performance! Your optimizations are working great!');
    } else if (score >= 70) {
      console.log('👍 Good performance with room for improvement.');
    } else {
      console.log('⚠️ Performance needs attention. Check the metrics above.');
    }
    
    console.groupEnd();
    
    // Store metrics for comparison
    window.performanceMetrics = performanceMetrics;
  }
  
  // Performance comparison function
  window.comparePerformance = function(baseline) {
    if (!baseline || !window.performanceMetrics) {
      console.log('❌ No performance data available for comparison');
      return;
    }
    
    console.group('📊 Performance Comparison');
    console.log(`Load Time: ${window.performanceMetrics.loadComplete?.toFixed(2)}ms vs ${baseline.loadComplete?.toFixed(2)}ms (${((baseline.loadComplete - window.performanceMetrics.loadComplete) / baseline.loadComplete * 100).toFixed(1)}% improvement)`);
    console.log(`DOM Queries: ${window.performanceMetrics.domQueries} vs ${baseline.domQueries} (${baseline.domQueries - window.performanceMetrics.domQueries} fewer queries)`);
    console.log(`Active Timers: ${window.performanceMetrics.timerLeaks} vs ${baseline.timerLeaks} (${baseline.timerLeaks - window.performanceMetrics.timerLeaks} fewer leaks)`);
    console.groupEnd();
  };
  
  // Expose for manual testing
  window.getPerformanceReport = reportPerformanceMetrics;
  
})();

// Usage Examples:
// getPerformanceReport() - Get current performance report
// comparePerformance(oldMetrics) - Compare with previous metrics
// performanceMetrics - Access raw performance data

console.log('🔧 Performance monitoring active. Use getPerformanceReport() to see metrics.');