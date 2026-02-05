/**
 * Tactic Type and Tactic Configuration
 * 
 * Defines the hierarchical relationship between Tactic Types and their subcategories (Tactics).
 * Used throughout the application for dropdowns, validation, and filtering.
 * 
 * @module config/tactics
 */

/**
 * Tactic Types - Main Categories
 * Each photo order can be associated with one tactic type
 */
const TACTIC_TYPES = [
  'Print',
  'Digital',
  'Point of Sale',
  'Outdoor',
  'In-Store',
  'Packaging',
  'Event',
  'Other'
];

/**
 * Tactic Mapping - Subcategories for each Tactic Type
 * When a user selects a Tactic Type, these are the available Tactic options
 */
const TACTIC_MAPPING = {
  'Print': [
    'Leaflet',
    'Flyer',
    'Catalog',
    'Magazine',
    'Poster',
    'Brochure',
    'Direct Mail',
    'Insert',
    'Newsletter'
  ],
  'Digital': [
    'Email',
    'Banner',
    'Social Media',
    'Web Banner',
    'Display Ad',
    'Video Ad',
    'Mobile App',
    'Website Content',
    'Blog Post'
  ],
  'Point of Sale': [
    'Shelf Talker',
    'Wobbler',
    'Shelf Strip',
    'Floor Graphic',
    'Window Cling',
    'Counter Card',
    'Hanging Sign',
    'Price Card'
  ],
  'Outdoor': [
    'Billboard',
    'Bus Shelter',
    'Transit Ad',
    'Street Furniture',
    'Vehicle Wrap',
    'Building Wrap',
    'Digital Billboard',
    'Kiosk'
  ],
  'In-Store': [
    'Endcap Display',
    'Gondola End',
    'Island Display',
    'Demo Station',
    'Floor Stand',
    'Wall Display',
    'Hanging Display',
    'Interactive Kiosk'
  ],
  'Packaging': [
    'Product Label',
    'Box Design',
    'Bag Design',
    'Wrapper',
    'Bottle Label',
    'Can Design',
    'Pouch Design',
    'Tag'
  ],
  'Event': [
    'Trade Show',
    'Pop-up Store',
    'Product Launch',
    'Sampling Event',
    'Conference',
    'Roadshow',
    'Activation',
    'Sponsorship'
  ],
  'Other': [
    'Custom',
    'Mixed Media',
    'Experimental',
    'Test Campaign'
  ]
};

/**
 * Event ID Format Configuration
 */
const EVENT_ID_CONFIG = {
  // Format: A + WeekNumber(2 digits) + Year(2 digits) + Counter(3 digits)
  // Example: A3225055 = Week 32, Year 2025, Counter 055
  pattern: /^A\d{2}\d{2}\d{3}$/,
  
  // Typical range of orders per event
  typicalOrdersPerEvent: {
    min: 50,
    max: 100,
    warningThreshold: 150
  },
  
  // Validation messages
  validation: {
    invalidFormat: 'Event ID must follow format: A + Week + Year + Counter (e.g., A3225055)',
    tooManyOrders: 'Warning: This event has more than 150 orders. Consider splitting.',
    missingEventId: 'Event ID is optional but recommended for integrated orders'
  },
  
  // Display formatting
  displayFormat: (eventId) => {
    if (!eventId) {return 'No Event';}
    
    // Extract components for readable display
    const week = eventId.substring(1, 3);
    const year = '20' + eventId.substring(3, 5);
    const counter = eventId.substring(5);
    
    return `${eventId} (Week ${week}, ${year})`;
  }
};

/**
 * Get tactics for a specific tactic type
 * @param {string} tacticType - The tactic type
 * @returns {string[]} Array of tactic options
 */
function getTacticsForType(tacticType) {
  return TACTIC_MAPPING[tacticType] || [];
}

/**
 * Validate Event ID format
 * @param {string} eventId - The event ID to validate
 * @returns {Object} Validation result with {valid: boolean, message: string}
 */
function validateEventId(eventId) {
  if (!eventId || eventId.trim() === '') {
    return { valid: true, message: '' }; // Event ID is optional
  }
  
  const trimmed = eventId.trim().toUpperCase();
  
  if (!EVENT_ID_CONFIG.pattern.test(trimmed)) {
    return { 
      valid: false, 
      message: EVENT_ID_CONFIG.validation.invalidFormat 
    };
  }
  
  return { valid: true, message: '' };
}

/**
 * Validate Tactic Type and Tactic combination
 * @param {string} tacticType - The tactic type
 * @param {string} tactic - The tactic
 * @returns {Object} Validation result
 */
function validateTacticCombination(tacticType, tactic) {
  // Both optional
  if (!tacticType && !tactic) {
    return { valid: true, message: '' };
  }
  
  // If tactic type is set, tactic should also be set
  if (tacticType && !tactic) {
    return { 
      valid: true, 
      warning: 'Consider selecting a specific tactic for better categorization' 
    };
  }
  
  // If tactic is set without tactic type
  if (!tacticType && tactic) {
    return { 
      valid: false, 
      message: 'Please select a Tactic Type first' 
    };
  }
  
  // Validate tactic belongs to tactic type
  const validTactics = getTacticsForType(tacticType);
  if (!validTactics.includes(tactic)) {
    return { 
      valid: false, 
      message: `"${tactic}" is not a valid tactic for "${tacticType}"` 
    };
  }
  
  return { valid: true, message: '' };
}

/**
 * Get tactic type color for UI display
 * @param {string} tacticType - The tactic type
 * @returns {string} CSS color code
 */
function getTacticTypeColor(tacticType) {
  const colorMap = {
    'Print': '#3b82f6',        // Blue
    'Digital': '#8b5cf6',      // Purple
    'Point of Sale': '#10b981', // Green
    'Outdoor': '#f59e0b',      // Orange
    'In-Store': '#ef4444',     // Red
    'Packaging': '#ec4899',    // Pink
    'Event': '#6366f1',        // Indigo
    'Other': '#6b7280'         // Gray
  };
  
  return colorMap[tacticType] || '#6b7280';
}

/**
 * Format tactic hierarchy for display
 * @param {string} tacticType - The tactic type
 * @param {string} tactic - The tactic
 * @returns {string} Formatted display string
 */
function formatTacticHierarchy(tacticType, tactic) {
  if (!tacticType && !tactic) {return 'No Tactic Assigned';}
  if (tacticType && !tactic) {return tacticType;}
  if (!tacticType && tactic) {return tactic;}
  return `${tacticType} → ${tactic}`;
}

/**
 * Check if order is integrated (from CPT or PMR)
 * Integrated orders have Event ID from external systems
 * @param {Object} order - The order object
 * @returns {boolean} True if order is integrated
 */
function isIntegratedOrder(order) {
  // Order is integrated if it has Event ID AND integration fields
  return !!(order.eventId && (order.offerId || order.imageRequestId));
}

/**
 * Get integration badge text
 * @param {Object} order - The order object
 * @returns {string} Badge text
 */
function getIntegrationBadge(order) {
  if (!order.eventId) {return null;}
  
  if (order.offerId) {return '🔗 CPT Integrated';}
  if (order.imageRequestId) {return '🔗 PMR Integrated';}
  
  return '📋 Event Assigned';
}

// Export all functions and constants
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TACTIC_TYPES,
    TACTIC_MAPPING,
    EVENT_ID_CONFIG,
    getTacticsForType,
    validateEventId,
    validateTacticCombination,
    getTacticTypeColor,
    formatTacticHierarchy,
    isIntegratedOrder,
    getIntegrationBadge
  };
}

// Also expose to window for browser usage
if (typeof window !== 'undefined') {
  window.TacticsConfig = {
    TACTIC_TYPES,
    TACTIC_MAPPING,
    EVENT_ID_CONFIG,
    getTacticsForType,
    validateEventId,
    validateTacticCombination,
    getTacticTypeColor,
    formatTacticHierarchy,
    isIntegratedOrder,
    getIntegrationBadge
  };
}
