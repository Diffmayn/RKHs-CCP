import requests
import json

# Test Vertex AI API key format
def test_vertex_ai_key(api_key):
    """
    Test if the provided API key works with Vertex AI endpoints
    """
    # Vertex AI endpoints use different authentication
    # They typically use OAuth2 or service account keys, not simple API keys

    # Try the Vertex AI prediction endpoint
    url = "https://us-central1-aiplatform.googleapis.com/v1/projects/YOUR_PROJECT/locations/us-central1/publishers/google/models/gemini-1.5-flash:predict"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "instances": [
            {
                "text": "Hello, test message"
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        print(f"Vertex AI Response Status: {response.status_code}")
        print(f"Response: {response.text[:500]}...")

        if response.status_code == 200:
            return True, "Valid Vertex AI key"
        elif response.status_code == 401:
            return False, "Invalid authentication - key may not be for Vertex AI"
        elif response.status_code == 403:
            return False, "Access forbidden - check project permissions"
        else:
            return False, f"Unexpected response: {response.status_code}"

    except Exception as e:
        return False, f"Error: {str(e)}"

# Test with your key
api_key = "AQ.Ab8RN6L49YFh_xtDngaJ8ZcU39K_CAGNXyQytmiu-6lhMfobFg"

print("Testing API key format...")
print(f"Key starts with: {api_key[:10]}...")
print(f"Key length: {len(api_key)}")

# Check if it looks like a standard Google API key
if api_key.startswith("AIza"):
    print("✅ Key format matches standard Google API key")
else:
    print("❌ Key format does NOT match standard Google API key (should start with 'AIza')")

# Check if it looks like an OAuth token
if api_key.startswith("ya29.") or "." in api_key:
    print("⚠️  Key format looks like an OAuth access token")
else:
    print("❓ Key format is unusual - may be custom or from different service")

# Test against Vertex AI
print("\nTesting against Vertex AI endpoint...")
is_valid, message = test_vertex_ai_key(api_key)
print(f"Result: {message}")

print("\n" + "="*50)
print("VERTEX AI SETUP GUIDE")
print("="*50)
print("To use Vertex AI with Gemini, you need:")
print("1. Google Cloud Project with Vertex AI enabled")
print("2. Proper authentication (API key OR service account)")
print("3. Correct endpoint URL")
print("\nFor API key authentication:")
print("- Go to https://console.cloud.google.com/apis/credentials")
print("- Create an API key")
print("- Enable Vertex AI API in your project")
print("- Use the key in format: AIza... (starts with AIza)")
print("\nFor service account authentication:")
print("- Create service account with Vertex AI permissions")
print("- Download JSON key file")
print("- Use google-auth library for authentication")