// Configure Google Gemini API - Supports multiple authentication methods
// Priority: 1) geminiApiKey (AIzaSy), 2) geminiAccessToken (AQ./OAuth), 3) Direct values below

// Check localStorage for saved credentials
const GEMINI_API_KEY = window?.localStorage?.getItem('geminiApiKey') || ''; // AIzaSy... from Google AI Studio
const ACCESS_TOKEN = window?.localStorage?.getItem('geminiAccessToken') || ''; // AQ. or ya29... tokens
const PROJECT_ID = window?.localStorage?.getItem('geminiProjectId') || ''; // Only needed for Vertex AI
const LOCATION = window?.localStorage?.getItem('geminiLocation') || 'us-central1'; // Only needed for Vertex AI

// Determine which credential to use
const API_CREDENTIAL = GEMINI_API_KEY || ACCESS_TOKEN;

// Auto-configure if API key/token is available
if (API_CREDENTIAL) {
  console.log('🔧 Auto-configuring Google Gemini API with saved credentials.');
  
  const credentialType = API_CREDENTIAL.startsWith('AIzaSy') ? 'Google AI Studio API Key (AIzaSy)' :
                         API_CREDENTIAL.startsWith('AQ.') ? 'AI Studio Token (AQ.)' :
                         'OAuth Access Token';
  console.log('Credential type detected:', credentialType);
  
  if (window.configureGeminiAI) {
    // For AIzaSy keys, project ID is optional
    if (API_CREDENTIAL.startsWith('AIzaSy')) {
      window.configureGeminiAI(API_CREDENTIAL);
      console.log('✅ Configured with Google AI Studio API Key (no project ID required)');
    } else if (PROJECT_ID) {
      window.configureGeminiAI(API_CREDENTIAL, PROJECT_ID, LOCATION);
      console.log('✅ Configured with access token and project ID');
    } else {
      console.warn('⚠️  Access token found but no project ID. Attempting configuration anyway...');
      window.configureGeminiAI(API_CREDENTIAL);
    }
  } else {
    console.error('❌ configureGeminiAI function not found. Make sure fallback-bundle.js is loaded first.');
  }
} else {
  console.warn('⚠️  No Gemini API credentials detected in localStorage.');
  console.log('💡 To configure manually:');
  console.log('   1. For Google AI Studio: configureGeminiAI("AIzaSy...")');
  console.log('   2. For Vertex AI: configureGeminiAI("token", "project-id", "location")');
}