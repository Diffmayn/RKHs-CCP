/**
 * Loading Spinner Component
 * Version: 1.1.0
 * 
 * Simple, lightweight loading spinner with no dependencies
 * Usage: LoadingSpinner.show('Loading...') / LoadingSpinner.hide()
 */

(function(global) {
  'use strict';

  // CSS for the loading spinner
  const spinnerCSS = `
    #app-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .loading-container {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      text-align: center;
      min-width: 200px;
      max-width: 400px;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      margin: 0 auto 1rem;
      border: 4px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-message {
      color: #374151;
      font-size: 16px;
      font-weight: 500;
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .loading-submessage {
      color: #6b7280;
      font-size: 14px;
      margin-top: 0.5rem;
      font-family: system-ui, -apple-system, sans-serif;
    }
  `;

  // Inject CSS if not already present
  function injectStyles() {
    if (document.getElementById('loading-spinner-styles')) {
      return;
    }

    const styleTag = document.createElement('style');
    styleTag.id = 'loading-spinner-styles';
    styleTag.textContent = spinnerCSS;
    document.head.appendChild(styleTag);
  }

  // Loading state tracker
  let loadingCount = 0;
  let currentOverlay = null;
  let minDisplayTimer = null;

  // Create loading overlay
  function createOverlay(message, submessage) {
    const overlay = document.createElement('div');
    overlay.id = 'app-loading-overlay';
    
    const container = document.createElement('div');
    container.className = 'loading-container';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    
    const messageEl = document.createElement('p');
    messageEl.className = 'loading-message';
    messageEl.textContent = message || 'Loading...';
    
    container.appendChild(spinner);
    container.appendChild(messageEl);
    
    if (submessage) {
      const submessageEl = document.createElement('p');
      submessageEl.className = 'loading-submessage';
      submessageEl.textContent = submessage;
      container.appendChild(submessageEl);
    }
    
    overlay.appendChild(container);
    
    return overlay;
  }

  // Public API
  const LoadingSpinner = {
    show: function(message, submessage, minDisplay = 300) {
      loadingCount++;
      
      if (loadingCount === 1) {
        injectStyles();
        currentOverlay = createOverlay(message, submessage);
        document.body.appendChild(currentOverlay);
        
        if (minDisplay > 0) {
          minDisplayTimer = Date.now();
        }
        
        if (global.Logger) {
          global.Logger.debug('UI', 'Loading spinner shown:', message);
        }
      }
    },

    hide: function() {
      loadingCount = Math.max(0, loadingCount - 1);
      
      if (loadingCount === 0 && currentOverlay) {
        const elapsed = minDisplayTimer ? Date.now() - minDisplayTimer : 999;
        const delay = minDisplayTimer && elapsed < 300 ? 300 - elapsed : 0;
        
        setTimeout(() => {
          if (currentOverlay && currentOverlay.parentNode) {
            currentOverlay.parentNode.removeChild(currentOverlay);
          }
          currentOverlay = null;
          minDisplayTimer = null;
          
          if (global.Logger) {
            global.Logger.debug('UI', 'Loading spinner hidden');
          }
        }, delay);
      }
    },

    forceHide: function() {
      loadingCount = 0;
      if (currentOverlay && currentOverlay.parentNode) {
        currentOverlay.parentNode.removeChild(currentOverlay);
      }
      currentOverlay = null;
      minDisplayTimer = null;
    },

    updateMessage: function(message, submessage) {
      if (currentOverlay) {
        const messageEl = currentOverlay.querySelector('.loading-message');
        if (messageEl) {
          messageEl.textContent = message;
        }
        
        const submessageEl = currentOverlay.querySelector('.loading-submessage');
        if (submessageEl && submessage) {
          submessageEl.textContent = submessage;
        } else if (submessage && !submessageEl) {
          const newSubmessageEl = document.createElement('p');
          newSubmessageEl.className = 'loading-submessage';
          newSubmessageEl.textContent = submessage;
          currentOverlay.querySelector('.loading-container').appendChild(newSubmessageEl);
        }
      }
    },

    wrapAsync: async function(fn, message, submessage) {
      this.show(message, submessage);
      try {
        const result = await fn();
        this.hide();
        return result;
      } catch (error) {
        this.hide();
        throw error;
      }
    },

    isActive: function() {
      return loadingCount > 0;
    },
  };

  // Expose globally
  global.LoadingSpinner = LoadingSpinner;
  global.Loading = LoadingSpinner;

  if (global.Logger) {
    global.Logger.debug('UI', 'LoadingSpinner component initialized');
  }

})(typeof window !== 'undefined' ? window : global);
