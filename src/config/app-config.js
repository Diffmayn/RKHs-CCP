/**
 * Application Configuration - Centralized Settings
 * Version: 1.1.0
 * 
 * This file contains all configuration constants used throughout the application.
 * Centralizing configuration makes the app easier to maintain and modify.
 */

// ============================================================================
// DEBUG & DEVELOPMENT
// ============================================================================

export const DEBUG = {
  enabled: typeof localStorage !== 'undefined' && localStorage.getItem('debugMode') === 'true',
  verbose: typeof localStorage !== 'undefined' && localStorage.getItem('verboseMode') === 'true',
  
  // Enable/disable debug functions globally
  allowDebugFunctions: false, // Set to false in production
  
  // Log levels
  logLevel: 'warn', // 'debug', 'info', 'warn', 'error', 'none'
};

// ============================================================================
// APPLICATION METADATA
// ============================================================================

export const APP = {
  name: "RKH's Photo Order Management System",
  version: '1.1.0',
  codename: 'Nano Banana',
  buildDate: '2026-01-05',
  author: 'RKH CCP Team',
};

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  
  // Local server
  localServer: {
    host: 'localhost',
    port: 8080,
    baseUrl: 'http://localhost:8080',
  },
  
  // WebSocket
  webSocket: {
    host: 'localhost',
    port: 8081,
    url: 'ws://localhost:8081',
    reconnectDelay: 5000,
    maxReconnectAttempts: 5,
  },
  
  // Runware API (Nano Banana)
  runware: {
    websocketEndpoint: 'wss://ws-api.runware.ai/v1',
    model: 'google:4@1',
    timeout: 60000, // 60 seconds for image generation
  },
  
  // Google Gemini
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.5-flash',
    maxTokens: 2048,
    temperature: 0.7,
  },
};

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const UI = {
  // Toast notifications
  toast: {
    duration: 5000, // 5 seconds
    position: 'top-right',
    maxVisible: 3,
  },
  
  // Loading states
  loading: {
    minDisplayTime: 300, // Minimum time to show loader (prevents flicker)
    defaultMessage: 'Loading...',
  },
  
  // Modals
  modal: {
    closeOnBackdropClick: true,
    closeOnEscape: true,
    animation: true,
  },
  
  // Tables
  table: {
    defaultPageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
    maxRowsBeforeVirtualization: 500,
  },
  
  // Forms
  form: {
    debounceDelay: 300, // 300ms for input validation
    autoSaveDelay: 2000, // 2 seconds for auto-save
  },
  
  // File uploads
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    allowedImageTypes: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    allowedDocumentTypes: ['.pdf', '.doc', '.docx', '.csv', '.xlsx'],
    maxFilesPerUpload: 10,
  },
  
  // Animations
  animation: {
    duration: 200, // milliseconds
    easing: 'ease-in-out',
  },
};

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION = {
  order: {
    minTitleLength: 3,
    maxTitleLength: 100,
    orderNumberPattern: /^ORD-\d{4}-\d{3}$/,
    imageRequestPattern: /^IR\d{6}$/,
  },
  
  article: {
    minNameLength: 2,
    maxNameLength: 200,
    eanPattern: /^\d{13}$/,
    articleNumberPattern: /^[A-Z]{3}-\d{4}$/,
  },
  
  user: {
    minPasswordLength: 8,
    maxPasswordLength: 128,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    usernamePattern: /^[a-zA-Z0-9_-]{3,20}$/,
  },
};

// ============================================================================
// BUSINESS LOGIC
// ============================================================================

export const BUSINESS = {
  // Order statuses
  orderStatuses: [
    'pending',
    'in-progress',
    'review',
    'approved',
    'completed',
    'cancelled',
  ],
  
  // Order types
  orderTypes: {
    PS: 'Product Shoot',
    LS: 'Lifestyle Shoot',
    RS: 'Retouching',
    PP: 'Post Production',
  },
  
  // Purchase groups (from order.service.ts)
  purchaseGroups: {
    100: 'Groceries',
    200: 'Fresh Products',
    300: 'Electronics',
    400: 'Home & Garden',
    500: 'Fashion',
    600: 'Health & Beauty',
    700: 'Sports & Leisure',
    800: 'Automotive',
    900: 'Baby & Kids',
  },
  
  // Priority levels
  priorities: ['low', 'medium', 'high', 'urgent'],
  
  // Due date calculations
  defaultDueInDays: 7,
  urgentDueInDays: 1,
};

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

export const KEYBOARD = {
  shortcuts: {
    newOrder: 'Ctrl+N',
    search: 'Ctrl+F',
    save: 'Ctrl+S',
    export: 'Ctrl+E',
    refresh: 'Ctrl+R',
    help: 'F1',
    settings: 'Ctrl+,',
    closeModal: 'Escape',
  },
};

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  aiContentGeneration: true,
  advancedSearch: true,
  bulkOperations: true,
  scannerIntegration: true,
  exportToSAP: true,
  realTimeSync: true,
  offlineMode: false, // Coming soon
  experimentalUI: false, // Beta features
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  network: {
    timeout: 'Request timed out. Please check your connection and try again.',
    offline: 'You appear to be offline. Please check your internet connection.',
    serverError: 'Server error occurred. Please try again later.',
  },
  
  validation: {
    required: 'This field is required',
    invalidFormat: 'Invalid format',
    tooShort: 'Value is too short',
    tooLong: 'Value is too long',
    invalidEmail: 'Please enter a valid email address',
    invalidDate: 'Please enter a valid date',
  },
  
  file: {
    tooLarge: 'File size exceeds maximum allowed',
    invalidType: 'File type not supported',
    uploadFailed: 'File upload failed. Please try again.',
  },
  
  auth: {
    invalidCredentials: 'Invalid username or password',
    sessionExpired: 'Your session has expired. Please log in again.',
    unauthorized: 'You do not have permission to perform this action.',
  },
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  order: {
    created: 'Order created successfully',
    updated: 'Order updated successfully',
    deleted: 'Order deleted successfully',
    exported: 'Order exported successfully',
  },
  
  file: {
    uploaded: 'File uploaded successfully',
    downloaded: 'File downloaded successfully',
  },
  
  general: {
    saved: 'Changes saved successfully',
    copied: 'Copied to clipboard',
  },
};

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  orders: 'photoOrders',
  ordersBackup: 'orders',
  user: 'current_user',
  theme: 'theme',
  settings: 'userSettings',
  debugMode: 'debugMode',
  verboseMode: 'verboseMode',
  
  // API keys (encrypted in real implementation)
  runwareApiKey: 'runwareApiKey',
  geminiApiKey: 'geminiApiKey',
  geminiProjectId: 'geminiProjectId',
  geminiLocation: 'geminiLocation',
};

// ============================================================================
// LOGGING CONFIGURATION
// ============================================================================

export const LOGGING = {
  // Component prefixes for structured logging
  prefixes: {
    app: '[App]',
    api: '[API]',
    auth: '[Auth]',
    order: '[Order]',
    ui: '[UI]',
    storage: '[Storage]',
    websocket: '[WebSocket]',
    ai: '[AI]',
  },
  
  // Should we log to console in production?
  consoleInProduction: false,
  
  // Should we send logs to remote server?
  remoteLogging: false,
  remoteEndpoint: null,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if debug mode is enabled
 */
export function isDebugMode() {
  return DEBUG.enabled;
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(featureName) {
  return FEATURES[featureName] === true;
}

/**
 * Get a configuration value by path
 * @example getConfig('API.timeout') => 30000
 */
export function getConfig(path) {
  const keys = path.split('.');
  let value = { API, UI, DEBUG, FEATURES, BUSINESS, VALIDATION };
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return null;
  }
  
  return value;
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  DEBUG,
  APP,
  API,
  UI,
  VALIDATION,
  BUSINESS,
  KEYBOARD,
  FEATURES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  LOGGING,
  isDebugMode,
  isFeatureEnabled,
  getConfig,
};
