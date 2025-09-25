// Test Google Cloud Vertex AI API key authentication
async function testVertexAIAuth() {
  const apiKey = 'AQ.Ab8RN6L49YFh_xtDngaJ8ZcU39K_CAGNXyQytmiu-6lhMfobFg'; // Your AQ. prefixed access token
  const projectId = 'sg-sandbox-vertex-ai'; // Your Google Cloud project ID
  const location = 'us-central1'; // Default location

  try {
    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-1.5-flash-001:generateContent`;

    console.log('🔗 Testing Vertex AI connection...');
    console.log('Project:', projectId);
    console.log('Location:', location);
    console.log('URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, this is a test message for Vertex AI Gemini.'
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Vertex AI authentication successful!');
      console.log('Response:', result);
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Vertex AI authentication failed:', errorData);
      console.error('Status:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Vertex AI test error:', error);
    return false;
  }
}

// Run the test
testVertexAIAuth();