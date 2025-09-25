import requests
import json

# Test the API key without AQ prefix
api_key = 'Ab8RN6L49YFh_xtDngaJ8ZcU39K_CAGNXyQytmiu-6lhMfobFg'
url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}'

print(f"Testing API key: {api_key}")
print(f"URL: {url}")
print(f"Key length: {len(api_key)}")

headers = {'Content-Type': 'application/json'}
data = {
    'contents': [{
        'parts': [{
            'text': 'Hello, test connection.'
        }]
    }]
}

try:
    response = requests.post(url, headers=headers, json=data, timeout=10)
    print(f'Status Code: {response.status_code}')
    if response.status_code == 200:
        print('✅ SUCCESS: This appears to be a valid Google Gemini API key!')
        result = response.json()
        print('Response preview:', json.dumps(result, indent=2)[:300] + '...')
    else:
        error = response.json()
        print('❌ FAILED: Not a valid Google Gemini API key')
        print('Error:', error.get('error', {}).get('message', 'Unknown error'))
except Exception as e:
    print(f'❌ ERROR: {e}')