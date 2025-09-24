const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App controls
  getVersion: () => ipcRenderer.invoke('app-version'),
  quit: () => ipcRenderer.invoke('app-quit'),
  minimize: () => ipcRenderer.invoke('app-minimize'),
  maximize: () => ipcRenderer.invoke('app-maximize'),

  // Settings management
  getSetting: (key) => ipcRenderer.invoke('get-setting', key),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),

  // File operations
  saveFile: (options) => ipcRenderer.invoke('save-file', options),
  openFile: (options) => ipcRenderer.invoke('open-file', options),
  exportData: (data, filename) => ipcRenderer.invoke('export-data', data, filename),

  // Update controls
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  installUpdate: () => ipcRenderer.invoke('install-update'),

  // Network operations
  getNetworkStatus: () => ipcRenderer.invoke('get-network-status'),

  // Event listeners
  onAppInfo: (callback) => ipcRenderer.on('app-info', callback),
  onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback),

  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  // Platform detection
  platform: process.platform,
  isWindows: process.platform === 'win32',
  isMac: process.platform === 'darwin',
  isLinux: process.platform === 'linux'
});

// Enhanced window controls for Citrix compatibility
contextBridge.exposeInMainWorld('windowControls', {
  close: () => {
    if (window.confirm('Are you sure you want to close the application?')) {
      ipcRenderer.invoke('app-quit');
    }
  },
  minimize: () => ipcRenderer.invoke('app-minimize'),
  maximize: () => ipcRenderer.invoke('app-maximize'),
  
  // Citrix-specific window management
  focus: () => {
    // Request focus - important for Citrix environments
    window.focus();
    if (document.body) {
      document.body.focus();
    }
  },
  
  requestAttention: () => {
    // Flash window in taskbar (Windows) or bounce in dock (macOS)
    ipcRenderer.send('request-attention');
  }
});

// Network connectivity helpers
contextBridge.exposeInMainWorld('networkAPI', {
  // Check if application can connect to the internet
  checkConnectivity: async () => {
    try {
      const response = await fetch('https://api.github.com/repos/Diffmayn/RKHs-CCP', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // Local network discovery for Citrix environments
  discoverLocalServices: async () => {
    return ipcRenderer.invoke('discover-local-services');
  },

  // WebSocket connection for real-time updates
  connectWebSocket: (url) => {
    return new WebSocket(url);
  }
});

// Enhanced storage API for Citrix roaming profiles
contextBridge.exposeInMainWorld('storageAPI', {
  // Local storage that syncs with Electron store
  get: async (key) => {
    const electronValue = await ipcRenderer.invoke('get-setting', key);
    const localValue = localStorage.getItem(key);
    
    // Return Electron store value if available, otherwise local storage
    return electronValue !== undefined ? electronValue : 
           (localValue ? JSON.parse(localValue) : null);
  },

  set: async (key, value) => {
    // Save to both Electron store and local storage for redundancy
    await ipcRenderer.invoke('set-setting', key, value);
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  },

  remove: async (key) => {
    await ipcRenderer.invoke('set-setting', key, undefined);
    localStorage.removeItem(key);
    return true;
  },

  // Bulk operations
  getBulk: async (keys) => {
    const results = {};
    for (const key of keys) {
      results[key] = await storageAPI.get(key);
    }
    return results;
  },

  setBulk: async (data) => {
    for (const [key, value] of Object.entries(data)) {
      await storageAPI.set(key, value);
    }
    return true;
  }
});

// Security API for safe operations
contextBridge.exposeInMainWorld('securityAPI', {
  // Safe HTML sanitization
  sanitizeHTML: (html) => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },

  // Safe URL validation
  isValidURL: (url) => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },

  // Generate secure random IDs
  generateId: () => {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
});

// Citrix-specific APIs
contextBridge.exposeInMainWorld('citrixAPI', {
  // Detect if running in Citrix environment
  isInCitrix: () => {
    return !!(
      process.env.CITRIX_CLIENT ||
      process.env.SESSIONNAME ||
      navigator.userAgent.includes('Citrix') ||
      window.external?.IEVersion // Legacy IE detection in Citrix
    );
  },

  // Optimize performance for virtual environments
  optimizeForVirtual: () => {
    // Reduce animations and effects for better performance
    const style = document.createElement('style');
    style.textContent = `
      * {
        transition-duration: 0.1s !important;
        animation-duration: 0.1s !important;
      }
      .no-virtual-animations * {
        transition: none !important;
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  },

  // Handle Citrix clipboard integration
  clipboardAPI: {
    write: async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        // Fallback for Citrix environments
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      }
    },

    read: async () => {
      try {
        return await navigator.clipboard.readText();
      } catch (error) {
        // Not available in all Citrix environments
        return '';
      }
    }
  }
});

// Application lifecycle events
contextBridge.exposeInMainWorld('appLifecycle', {
  onReady: (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },

  onBeforeUnload: (callback) => {
    window.addEventListener('beforeunload', callback);
  },

  onVisibilityChange: (callback) => {
    document.addEventListener('visibilitychange', () => {
      callback(document.visibilityState);
    });
  },

  // Performance monitoring
  getPerformanceMetrics: () => {
    return {
      memory: performance.memory || {},
      timing: performance.timing,
      navigation: performance.navigation,
      isVirtual: !!(window.external?.IEVersion || process.env.SESSIONNAME)
    };
  }
});

console.log('Preload script initialized successfully');
