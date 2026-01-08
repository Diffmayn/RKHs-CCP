/**
 * Logging Utility - Conditional Logging System
 * Version: 1.1.0
 * 
 * Provides structured, conditional logging that can be enabled/disabled
 * without modifying code throughout the application.
 * 
 * Usage in fallback-bundle.js or other files:
 * 
 * // Instead of: console.log('Debug info')
 * // Use: if (Logger.isDebugMode()) console.log('[Component] Debug info')
 * 
 * // Or simply: Logger.debug('COMPONENT', 'Debug info')
 */

(function(global) {
  'use strict';

  // Check if debug mode is enabled
  const DEBUG_MODE = typeof localStorage !== 'undefined' && 
                     localStorage.getItem('debugMode') === 'true';

  const VERBOSE_MODE = typeof localStorage !== 'undefined' && 
                       localStorage.getItem('verboseMode') === 'true';

  // Simple logger that respects debug mode
  const Logger = {
    isDebugMode: () => DEBUG_MODE,
    isVerboseMode: () => VERBOSE_MODE,
    
    // Debug - only in debug mode
    debug: (component, message, ...args) => {
      if (DEBUG_MODE) {
        console.log(`[${component}]`, message, ...args);
      }
    },
    
    // Info - in debug or verbose mode
    info: (component, message, ...args) => {
      if (DEBUG_MODE || VERBOSE_MODE) {
        console.info(`[${component}]`, message, ...args);
      }
    },
    
    // Warn - always show
    warn: (component, message, ...args) => {
      console.warn(`[${component}]`, message, ...args);
    },
    
    // Error - always show
    error: (component, message, ...args) => {
      console.error(`[${component}]`, message, ...args);
    },
    
    // Enable debug mode
    enable: () => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('debugMode', 'true');
        console.log('%c🔧 Debug mode ENABLED - Reload page', 'color: green; font-weight: bold');
      }
    },
    
    // Disable debug mode
    disable: () => {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('debugMode');
        console.log('%c🔒 Debug mode DISABLED - Reload page', 'color: red; font-weight: bold');
      }
    },
  };

  // Expose globally
  global.Logger = Logger;
  
  if (DEBUG_MODE) {
    console.log('%c🚀 Debug Mode Active', 'color: #4a9eff; font-size: 14px; font-weight: bold');
  }

})(typeof window !== 'undefined' ? window : global);
