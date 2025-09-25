// Configure Google Gemini with AQ. access token
// Replace these values with your actual credentials

const AQ_ACCESS_TOKEN = 'AQ.Ab8RN6L49YFh_xtDngaJ8ZcU39K_CAGNXyQytmiu-6lhMfobFg'; // Your AQ. prefixed access token
const PROJECT_ID = 'sg-sandbox-vertex-ai'; // Your Google Cloud project ID
const LOCATION = 'us-central1'; // Default location

// Auto-configure if values are set
if (AQ_ACCESS_TOKEN !== 'AQ.your-actual-token-here' && PROJECT_ID !== 'your-project-id') {
  console.log('🔧 Auto-configuring Google Gemini API...');
  console.log('Access Token:', AQ_ACCESS_TOKEN.substring(0, 10) + '...');
  console.log('Project ID:', PROJECT_ID);
  console.log('Location:', LOCATION);

  // Configure the API
  if (window.configureGeminiAI) {
    window.configureGeminiAI(AQ_ACCESS_TOKEN, PROJECT_ID, LOCATION);
  } else {
    console.error('❌ configureGeminiAI function not found. Make sure fallback-bundle.js is loaded.');
  }
} else {
  console.log('⚠️  Please update the AQ_ACCESS_TOKEN and PROJECT_ID variables in this file');
  console.log('Example:');
  console.log('const AQ_ACCESS_TOKEN = "AQ.abc123...";');
  console.log('const PROJECT_ID = "my-project-123";');
}