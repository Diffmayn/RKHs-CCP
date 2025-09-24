@echo off
setlocal enabledelayedexpansion

REM RKH's Photo Order Management System - Windows Batch Launcher
REM Simple launcher that works without Node.js dependencies

echo.
echo 🚀 RKH's Photo Order Management System
echo =====================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo 💡 Please install Python from https://python.org
    echo    Or ensure Python is added to your system PATH
    pause
    exit /b 1
)

REM Get current directory
set "APP_ROOT=%~dp0"
cd /d "%APP_ROOT%"

echo 📁 Application directory: %APP_ROOT%
echo.

REM Check if application files exist
if not exist "fallback-bundle.js" (
    echo ❌ Application bundle not found
    echo 💡 Please ensure fallback-bundle.js exists in the application directory
    pause
    exit /b 1
)

if not exist "index.html" (
    echo ❌ Main application file not found
    echo 💡 Please ensure index.html exists in the application directory
    pause
    exit /b 1
)

REM Configure settings
set "PORT=8080"
set "CITRIX_MODE=false"

REM Parse command line arguments
:parse_args
if "%1"=="" goto start_server
if /i "%1"=="--citrix" set "CITRIX_MODE=true"
if /i "%1"=="--port" (
    shift
    set "PORT=%1"
)
shift
goto parse_args

:start_server
REM Check if port is available
netstat -an | findstr ":%PORT% " >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  Port %PORT% is already in use
    echo 💡 Trying to find an alternative port...
    
    REM Try to find available port
    for /l %%i in (8081,1,8199) do (
        netstat -an | findstr ":%%i " >nul 2>&1
        if errorlevel 1 (
            set "PORT=%%i"
            echo ✅ Using port %%i instead
            goto port_found
        )
    )
    echo ❌ Could not find an available port
    pause
    exit /b 1
)

:port_found
REM Configure Windows Firewall (if possible)
echo 🛡️  Configuring Windows Firewall...
netsh advfirewall firewall add rule name="RKH Photo Orders Server" dir=in action=allow protocol=TCP localport=%PORT% >nul 2>&1
if errorlevel 0 (
    echo ✅ Firewall rule added for port %PORT%
) else (
    echo ⚠️  Could not configure firewall automatically
    echo 💡 You may need to manually allow port %PORT% through Windows Firewall
)

echo.
echo 🚀 Starting local server on port %PORT%...

REM Citrix optimizations
if "%CITRIX_MODE%"=="true" (
    echo 🏢 Citrix mode enabled - applying optimizations
    set "CITRIX_OPTS=--citrix-mode"
) else (
    set "CITRIX_OPTS="
)

REM Create a simple Python server script
echo Creating temporary server script...
(
echo import http.server
echo import socketserver
echo import webbrowser
echo import os
echo import sys
echo import time
echo import threading
echo.
echo PORT = %PORT%
echo.
echo class CustomHandler^(http.server.SimpleHTTPRequestHandler^):
echo     def end_headers^(self^):
echo         self.send_header^('Access-Control-Allow-Origin', '*'^)
echo         self.send_header^('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'^)
echo         self.send_header^('Access-Control-Allow-Headers', 'Content-Type'^)
echo         super^(^).end_headers^(^)
echo.
echo     def do_GET^(self^):
echo         if self.path == '/api/health':
echo             self.send_response^(200^)
echo             self.send_header^('Content-Type', 'application/json'^)
echo             self.end_headers^(^)
echo             response = '{"status":"healthy","version":"1.0.0","citrix":%CITRIX_MODE%}'
echo             self.wfile.write^(response.encode^(^)^)
echo             return
echo         super^(^).do_GET^(^)
echo.
echo def open_browser^(^):
echo     time.sleep^(2^)
echo     try:
echo         webbrowser.open^(f'http://localhost:{PORT}'^)
echo         print^(f'🌐 Opened http://localhost:{PORT} in browser'^)
echo     except:
echo         print^(f'💡 Please open http://localhost:{PORT} in your browser'^)
echo.
echo if __name__ == '__main__':
echo     try:
echo         os.chdir^(os.path.dirname^(os.path.abspath^(__file__^)^)^)
echo         
echo         with socketserver.TCPServer^(^('localhost', PORT^), CustomHandler^) as httpd:
echo             print^(f'🌐 Server running on http://localhost:{PORT}'^)
echo             print^('🛑 Press Ctrl+C to stop the server'^)
echo             
echo             # Auto-open browser
echo             browser_thread = threading.Thread^(target=open_browser^)
echo             browser_thread.daemon = True
echo             browser_thread.start^(^)
echo             
echo             httpd.serve_forever^(^)
echo             
echo     except KeyboardInterrupt:
echo         print^('\n🛑 Shutting down server...'^)
echo         sys.exit^(0^)
echo     except Exception as e:
echo         print^(f'❌ Error starting server: {e}'^)
echo         sys.exit^(1^)
) > temp_server.py

echo ✅ Server script created
echo.

REM Start the Python server
echo 🎉 Starting RKH's Photo Order Management System...
echo 🌐 URL: http://localhost:%PORT%
echo.

python temp_server.py

REM Cleanup
if exist temp_server.py del temp_server.py >nul 2>&1

echo.
echo 🧹 Cleanup completed
echo 👋 Thank you for using RKH's Photo Order Management System!
pause
