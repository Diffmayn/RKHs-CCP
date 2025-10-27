/**
 * Application Constants Configuration
 * 
 * Central location for all configuration values, magic numbers, and constants
 * used throughout the application. This improves maintainability and makes
 * it easier to adjust settings without searching through the codebase.
 * 
 * @module config/constants
 */

/**
 * Server and Network Configuration
 */
const SERVER = {
  /** HTTP server port for local Express server */
  HTTP_PORT: 8080,
  
  /** WebSocket server port for real-time updates */
  WS_PORT: 8081,
  
  /** Server host binding (localhost for security) */
  HOST: '127.0.0.1',
  
  /** Maximum request timeout in milliseconds */
  REQUEST_TIMEOUT: 30000, // 30 seconds
  
  /** WebSocket ping interval to keep connections alive */
  WEBSOCKET_PING_INTERVAL: 30000, // 30 seconds
  
  /** Maximum WebSocket message size in bytes */
  MAX_WS_MESSAGE_SIZE: 1024 * 1024 // 1MB
};

/**
 * Security and Validation Limits
 */
const LIMITS = {
  /** Maximum size for stored settings (1MB) */
  MAX_SETTING_SIZE: 1024 * 1024,
  
  /** Maximum size for data exports (10MB) */
  MAX_EXPORT_SIZE: 10 * 1024 * 1024,
  
  /** Maximum length for setting keys */
  MAX_KEY_LENGTH: 256,
  
  /** Maximum file upload size (50MB) */
  MAX_FILE_UPLOAD_SIZE: 50 * 1024 * 1024,
  
  /** Maximum concurrent WebSocket connections */
  MAX_WS_CONNECTIONS: 100,
  
  /** Maximum IPC requests per second (rate limiting) */
  MAX_IPC_RATE: 100
};

/**
 * Timeout Configuration
 */
const TIMEOUTS = {
  /** Session timeout (8 hours in milliseconds) */
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000,
  
  /** Auto-logout warning time (5 minutes before timeout) */
  LOGOUT_WARNING: 5 * 60 * 1000,
  
  /** API request timeout */
  API_TIMEOUT: 30000,
  
  /** File operation timeout */
  FILE_OPERATION_TIMEOUT: 60000,
  
  /** Auto-update check interval (4 hours) */
  UPDATE_CHECK_INTERVAL: 4 * 60 * 60 * 1000,
  
  /** Toast notification display duration */
  TOAST_DURATION: 5000
};

/**
 * Application Paths
 */
const PATHS = {
  /** Assets directory */
  ASSETS: 'assets',
  
  /** Cache directory */
  CACHE: 'cache',
  
  /** Logs directory */
  LOGS: 'logs',
  
  /** Temporary files directory */
  TEMP: 'temp',
  
  /** User data directory */
  USER_DATA: 'userData'
};

/**
 * File Extensions and MIME Types
 */
const FILE_TYPES = {
  /** Allowed extensions for protocol handler */
  ALLOWED_PROTOCOL_EXTENSIONS: [
    '.html', '.htm',
    '.css',
    '.js', '.mjs',
    '.json',
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
    '.pdf',
    '.txt', '.md'
  ],
  
  /** Allowed extensions for file uploads */
  ALLOWED_UPLOAD_EXTENSIONS: [
    '.csv', '.json',
    '.png', '.jpg', '.jpeg', '.gif', '.webp'
  ],
  
  /** MIME type mappings */
  MIME_TYPES: {
    '.html': 'text/html',
    '.htm': 'text/html',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.xml': 'application/xml',
    '.csv': 'text/csv',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf'
  }
};

/**
 * Feature Flags
 */
const FEATURES = {
  /** Enable auto-update checks */
  AUTO_UPDATE_ENABLED: true,
  
  /** Enable WebSocket real-time updates */
  WEBSOCKET_ENABLED: true,
  
  /** Enable Citrix optimizations */
  CITRIX_OPTIMIZATIONS: true,
  
  /** Enable development tools in production */
  DEVTOOLS_ENABLED: false,
  
  /** Enable crash reporting */
  CRASH_REPORTING: false,
  
  /** Enable analytics */
  ANALYTICS_ENABLED: false
};

/**
 * API Configuration
 */
const API = {
  /** Runware API endpoint */
  RUNWARE_ENDPOINT: 'wss://ws-api.runware.ai/v1',
  
  /** Runware default model */
  RUNWARE_MODEL: 'google:4@1',
  
  /** Google Gemini default location */
  GEMINI_LOCATION: 'us-central1',
  
  /** API retry attempts */
  MAX_RETRIES: 3,
  
  /** API retry delay (exponential backoff) */
  RETRY_DELAY: 1000
};

/**
 * UI Configuration
 */
const UI = {
  /** Minimum window width */
  MIN_WINDOW_WIDTH: 1024,
  
  /** Minimum window height */
  MIN_WINDOW_HEIGHT: 768,
  
  /** Default window width */
  DEFAULT_WINDOW_WIDTH: 1280,
  
  /** Default window height */
  DEFAULT_WINDOW_HEIGHT: 900,
  
  /** Toast notification position */
  TOAST_POSITION: 'bottom-right',
  
  /** Animation duration for reduced motion */
  ANIMATION_DURATION: 200
};

/**
 * Logging Configuration
 */
const LOGGING = {
  /** Log level (error, warn, info, debug) */
  LEVEL: process.env.LOG_LEVEL || 'info',
  
  /** Maximum log file size (10MB) */
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  
  /** Maximum number of log files to keep */
  MAX_FILES: 5,
  
  /** Enable console logging in development */
  CONSOLE_ENABLED: process.env.NODE_ENV !== 'production'
};

/**
 * Security Configuration
 */
const SECURITY = {
  /** Content Security Policy directives */
  CSP: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'nonce-{NONCE}'"],
    styleSrc: ["'self'", "'nonce-{NONCE}'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.runware.ai", "wss://ws-api.runware.ai"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"]
  },
  
  /** Password validation rules */
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL: true,
  
  /** Session configuration */
  SESSION_COOKIE_SECURE: true,
  SESSION_COOKIE_HTTP_ONLY: true,
  SESSION_COOKIE_SAME_SITE: 'strict',
  
  /** Rate limiting */
  LOGIN_MAX_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  /** Token expiration */
  JWT_EXPIRATION: '8h',
  REFRESH_TOKEN_EXPIRATION: '7d'
};

/**
 * Development Configuration
 */
const DEV = {
  /** Enable detailed error messages */
  VERBOSE_ERRORS: process.env.NODE_ENV === 'development',
  
  /** Enable source maps */
  SOURCE_MAPS: true,
  
  /** Enable hot reload */
  HOT_RELOAD: process.env.NODE_ENV === 'development',
  
  /** Mock API responses */
  MOCK_API: false
};

/**
 * Environment Detection
 */
const ENV = {
  /** Check if running in development */
  isDevelopment: process.env.NODE_ENV === 'development',
  
  /** Check if running in production */
  isProduction: process.env.NODE_ENV === 'production',
  
  /** Check if running in test */
  isTest: process.env.NODE_ENV === 'test',
  
  /** Check if running as portable app */
  isPortable: process.env.PORTABLE_EXECUTABLE_DIR !== undefined,
  
  /** Check if running in CI/CD */
  isCI: process.env.CI === 'true'
};

// Export all configuration modules
module.exports = {
  SERVER,
  LIMITS,
  TIMEOUTS,
  PATHS,
  FILE_TYPES,
  FEATURES,
  API,
  UI,
  LOGGING,
  SECURITY,
  DEV,
  ENV
};

// Also export individual modules for selective imports
module.exports.default = module.exports;
