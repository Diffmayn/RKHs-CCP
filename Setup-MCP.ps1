# Chrome DevTools MCP Server Setup Script
# This script installs and configures the Chrome DevTools MCP server for use with AI assistants

param(
    [switch]$Force,
    [switch]$SkipChrome,
    [string]$ChromePath = ""
)

Write-Host "🔧 Setting up Chrome DevTools MCP Server..." -ForegroundColor Cyan
Write-Host "=" * 50

# Function to check if running as administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Function to find Chrome executable
function Find-ChromeExecutable {
    $possiblePaths = @(
        "C:\Program Files\Google\Chrome\Application\chrome.exe",
        "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
        "$env:PROGRAMFILES\Google\Chrome\Application\chrome.exe"
    )

    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            return $path
        }
    }
    return $null
}

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "❌ Node.js is required but not found!" -ForegroundColor Red
    Write-Host "   Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
    } else {
        throw "npm not found"
    }
} catch {
    Write-Host "❌ npm is required but not found!" -ForegroundColor Red
    exit 1
}

# Find Chrome executable
if (-not $SkipChrome) {
    Write-Host "🔍 Looking for Chrome installation..." -ForegroundColor Yellow
    
    if ($ChromePath -and (Test-Path $ChromePath)) {
        $chromeExe = $ChromePath
        Write-Host "✅ Using specified Chrome path: $chromeExe" -ForegroundColor Green
    } else {
        $chromeExe = Find-ChromeExecutable
        if ($chromeExe) {
            Write-Host "✅ Chrome found: $chromeExe" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Chrome not found in standard locations" -ForegroundColor Yellow
            Write-Host "   You can specify a custom path with -ChromePath parameter" -ForegroundColor Yellow
            Write-Host "   Or skip Chrome detection with -SkipChrome" -ForegroundColor Yellow
            $chromeExe = "chrome"  # Fallback to PATH
        }
    }
} else {
    Write-Host "⏭️  Skipping Chrome detection" -ForegroundColor Yellow
    $chromeExe = "chrome"
}

# Install MCP servers
Write-Host "`n📦 Installing MCP servers..." -ForegroundColor Cyan

$mcpServers = @(
    "@modelcontextprotocol/server-chrome-devtools",
    "@modelcontextprotocol/server-filesystem", 
    "@modelcontextprotocol/server-brave-search"
)

foreach ($server in $mcpServers) {
    Write-Host "   Installing $server..." -ForegroundColor Yellow
    try {
        $result = npm install -g $server 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ $server installed successfully" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Failed to install $server" -ForegroundColor Red
            Write-Host "      Error: $result" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ❌ Exception installing $server`: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Update MCP configuration
Write-Host "`n⚙️  Updating MCP configuration..." -ForegroundColor Cyan

$mcpConfig = @{
    mcpServers = @{
        "chrome-devtools" = @{
            command = "npx"
            args = @("@modelcontextprotocol/server-chrome-devtools")
            env = @{
                CHROME_EXECUTABLE_PATH = $chromeExe
            }
        }
        "filesystem" = @{
            command = "npx"
            args = @("@modelcontextprotocol/server-filesystem", $PWD.Path)
        }
        "brave-search" = @{
            command = "npx"
            args = @("@modelcontextprotocol/server-brave-search")
            env = @{
                BRAVE_API_KEY = ""
            }
        }
    }
} | ConvertTo-Json -Depth 4

$mcpConfig | Out-File -FilePath "mcp-server.json" -Encoding UTF8
Write-Host "✅ MCP configuration updated in mcp-server.json" -ForegroundColor Green

# Claude Desktop configuration
Write-Host "`n🤖 Setting up Claude Desktop integration..." -ForegroundColor Cyan

$claudeConfigPath = "$env:APPDATA\Claude\claude_desktop_config.json"
$claudeConfigDir = Split-Path $claudeConfigPath

if (-not (Test-Path $claudeConfigDir)) {
    Write-Host "📁 Creating Claude configuration directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $claudeConfigDir -Force | Out-Null
}

if (Test-Path $claudeConfigPath) {
    Write-Host "⚠️  Existing Claude configuration found" -ForegroundColor Yellow
    if (-not $Force) {
        $response = Read-Host "Do you want to backup and replace it? (y/N)"
        if ($response -ne 'y' -and $response -ne 'Y') {
            Write-Host "⏭️  Skipping Claude configuration update" -ForegroundColor Yellow
            Write-Host "   Manual configuration required. See README-MCP.md for details." -ForegroundColor Yellow
        } else {
            Copy-Item $claudeConfigPath "$claudeConfigPath.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            $mcpConfig | Out-File -FilePath $claudeConfigPath -Encoding UTF8
            Write-Host "✅ Claude Desktop configuration updated" -ForegroundColor Green
        }
    } else {
        Copy-Item $claudeConfigPath "$claudeConfigPath.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        $mcpConfig | Out-File -FilePath $claudeConfigPath -Encoding UTF8
        Write-Host "✅ Claude Desktop configuration updated (forced)" -ForegroundColor Green
    }
} else {
    $mcpConfig | Out-File -FilePath $claudeConfigPath -Encoding UTF8
    Write-Host "✅ Claude Desktop configuration created" -ForegroundColor Green
}

# Test MCP server
Write-Host "`n🧪 Testing MCP server..." -ForegroundColor Cyan

try {
    Write-Host "   Testing Chrome DevTools server..." -ForegroundColor Yellow
    $testResult = npx @modelcontextprotocol/server-chrome-devtools --help 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Chrome DevTools MCP server is working" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Chrome DevTools MCP server test failed" -ForegroundColor Yellow
        Write-Host "      This might be normal - the server may require a client connection" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠️  Could not test MCP server: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "=" * 50

Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   • MCP servers installed globally via npm" -ForegroundColor White
Write-Host "   • Configuration saved to mcp-server.json" -ForegroundColor White
Write-Host "   • Claude Desktop configuration updated" -ForegroundColor White
Write-Host "   • Chrome path configured: $chromeExe" -ForegroundColor White

Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Restart Claude Desktop if it's running" -ForegroundColor Yellow
Write-Host "   2. Start a new conversation in Claude" -ForegroundColor Yellow
Write-Host "   3. Test with: 'Open Chrome and navigate to localhost:8000'" -ForegroundColor Yellow
Write-Host "   4. See README-MCP.md for more examples" -ForegroundColor Yellow

if ($chromeExe -eq "chrome") {
    Write-Host "`n⚠️  Note: Chrome path not fully validated" -ForegroundColor Yellow
    Write-Host "   If Chrome doesn't work, re-run with -ChromePath parameter" -ForegroundColor Yellow
}

Write-Host "`n📖 Documentation:" -ForegroundColor Cyan
Write-Host "   • README-MCP.md - Full setup and usage guide" -ForegroundColor White  
Write-Host "   • mcp-server.json - Server configuration" -ForegroundColor White
Write-Host "   • Test with your RKH's Content Creation Program!" -ForegroundColor White