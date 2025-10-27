# Test Vertex AI API with OAuth 2 access token (from gcloud)
# Requires: gcloud CLI authenticated and project set
try {
    $token = (& gcloud auth print-access-token).Trim()
} catch {
    Write-Host "❌ Could not get access token from gcloud. Ensure Google Cloud SDK is installed and you're logged in (gcloud auth login)." -ForegroundColor Red
    throw
}

if (-not $token) {
    Write-Host "❌ Empty access token. Run 'gcloud auth login' and 'gcloud config set project <PROJECT_ID>' first." -ForegroundColor Red
    exit 1
}
$projectId = "sg-sandbox-vertex-ai"
$location = "us-central1"
$model = "gemini-2.5-flash-image-preview"

$url = "https://$location-aiplatform.googleapis.com/v1/projects/$projectId/locations/$location/publishers/google/models/${model}:generateContent"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    contents = @(
        @{ text = "Hello, test message" }
    )
    generationConfig = @{
        temperature = 0.7
        maxOutputTokens = 100
    }
} | ConvertTo-Json -Depth 10

Write-Host "Testing Vertex AI API..."
Write-Host "URL: $url"
Write-Host "Using OAuth token: $($token.Substring(0,10))..."
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "✅ SUCCESS: $($response.StatusCode)"
    Write-Host "Response:" $response.Content
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Response.StatusCode)"
    Write-Host "Error:" $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error Details:" $errorContent
    }
}