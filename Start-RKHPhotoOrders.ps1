param(
    [switch]$CitrixMode,
    [int]$Port = 8080,
    [switch]$Debug,
    [switch]$NoAutoUpdate
)

# RKH's Photo Order Management System - Desktop Launcher
# PowerShell version for Windows systems including Citrix

Write-Host "🚀 Starting RKH's Photo Order Management System" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check prerequisites
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Python not found. Some features may be limited." -ForegroundColor Yellow
}

# Get current directory
$AppRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $AppRoot

Write-Host "📁 Application directory: $AppRoot" -ForegroundColor Green

# Check if fallback-bundle.js exists
if (-not (Test-Path "fallback-bundle.js")) {
    Write-Host "❌ Application bundle not found. Please ensure fallback-bundle.js exists." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Configure environment
$env:RKHS_PORT = $Port
$env:RKHS_CITRIX_MODE = $CitrixMode
$env:RKHS_DEBUG = $Debug
$env:RKHS_AUTO_UPDATE = -not $NoAutoUpdate

# Citrix optimization settings
if ($CitrixMode) {
    Write-Host "🏢 Citrix mode enabled - applying optimizations" -ForegroundColor Yellow
    $env:RKHS_REDUCE_ANIMATIONS = "true"
    $env:RKHS_VIRTUAL_ENV = "true"
}

# Create temporary server script
$ServerScript = @"
const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = process.env.RKHS_PORT || $Port;
const isCitrix = process.env.RKHS_CITRIX_MODE === 'true';
const isDebug = process.env.RKHS_DEBUG === 'true';

// CORS for local access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Serve static files
app.use(express.static(__dirname));

// API endpoints
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        version: '1.0.0',
        citrix: isCitrix,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/system-info', (req, res) => {
    res.json({
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        citrixMode: isCitrix,
        debugMode: isDebug
    });
});

// Start server
const server = app.listen(port, 'localhost', () => {
    console.log(`🌐 Server running on http://localhost:`+port);
    console.log(`📱 Application ready`);
    
    // Auto-open browser
    const url = `http://localhost:`+port;
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    setTimeout(() => {
        exec(`start "" "`+url+`"`, (error) => {
            if (error && isDebug) {
                console.log('Could not auto-open browser:', error.message);
            }
        });
    }, 1000);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
"@

# Write server script to temp file
$TempServer = Join-Path $env:TEMP "rkhs-server.js"
$ServerScript | Out-File -FilePath $TempServer -Encoding UTF8

Write-Host "🔧 Configuring local server..." -ForegroundColor Green

# Check if port is available
$PortCheck = netstat -an | Select-String ":$Port "
if ($PortCheck) {
    Write-Host "⚠️  Port $Port is already in use. Trying to find alternative..." -ForegroundColor Yellow
    
    # Try to find an available port
    for ($TestPort = $Port + 1; $TestPort -lt $Port + 100; $TestPort++) {
        $TestCheck = netstat -an | Select-String ":$TestPort "
        if (-not $TestCheck) {
            $Port = $TestPort
            $env:RKHS_PORT = $Port
            Write-Host "✅ Using port $Port instead" -ForegroundColor Green
            break
        }
    }
}

# Configure Windows Firewall (if running as admin)
$IsAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($IsAdmin) {
    Write-Host "🛡️  Configuring Windows Firewall..." -ForegroundColor Green
    try {
        New-NetFirewallRule -DisplayName "RKH Photo Orders Server" -Direction Inbound -Protocol TCP -LocalPort $Port -Action Allow -ErrorAction SilentlyContinue | Out-Null
        Write-Host "✅ Firewall rule added for port $Port" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not configure firewall automatically" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Running without administrator privileges. Firewall configuration skipped." -ForegroundColor Yellow
}

# Start the server
Write-Host "🚀 Starting local server on port $Port..." -ForegroundColor Green

try {
    if (Get-Command node -ErrorAction SilentlyContinue) {
        # Start with Node.js for full features
        Write-Host "📦 Using Node.js server for full features" -ForegroundColor Green
        $NodeProcess = Start-Process -FilePath "node" -ArgumentList $TempServer -PassThru -WindowStyle Hidden
        
        # Wait a moment for server to start
        Start-Sleep -Seconds 2
        
        # Test server
        try {
            $TestResponse = Invoke-WebRequest -Uri "http://localhost:$Port/api/health" -UseBasicParsing -TimeoutSec 5
            if ($TestResponse.StatusCode -eq 200) {
                Write-Host "✅ Server is running successfully" -ForegroundColor Green
            }
        } catch {
            Write-Host "⚠️  Server may not have started properly" -ForegroundColor Yellow
        }
        
        # Auto-open browser
        Write-Host "🌐 Opening application in browser..." -ForegroundColor Green
        Start-Process "http://localhost:$Port"
        
        Write-Host ""
        Write-Host "🎉 RKH's Photo Order Management System is now running!" -ForegroundColor Green
        Write-Host "🌐 URL: http://localhost:$Port" -ForegroundColor Cyan
        Write-Host "🛑 Press Ctrl+C to stop the server" -ForegroundColor Yellow
        
        if ($CitrixMode) {
            Write-Host "🏢 Citrix mode active - optimized for virtual environments" -ForegroundColor Yellow
        }
        
        Write-Host ""
        
        # Keep script running until user stops
        try {
            Wait-Process -Id $NodeProcess.Id
        } catch {
            # Process ended or user interrupted
        }
        
    } else {
        # Fallback to Python HTTP server
        Write-Host "🐍 Using Python HTTP server (limited features)" -ForegroundColor Yellow
        python -m http.server $Port
    }
    
} catch {
    Write-Host "❌ Failed to start server: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Try running as administrator or check if port $Port is available" -ForegroundColor Yellow
} finally {
    # Cleanup
    if (Test-Path $TempServer) {
        Remove-Item $TempServer -Force -ErrorAction SilentlyContinue
    }
    
    Write-Host "🧹 Cleanup completed" -ForegroundColor Green
}

Write-Host ""
Write-Host "👋 Thank you for using RKH's Photo Order Management System!" -ForegroundColor Cyan
Read-Host "Press Enter to exit"
