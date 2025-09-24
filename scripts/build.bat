@echo off
REM Windows build script for RKH's Photo Order Management System

echo.
echo 🚀 Building RKH's Photo Order Management System for Windows
echo ==========================================================

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ and try again.
    pause
    exit /b 1
)

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm and try again.
    pause
    exit /b 1
)

REM Get version from package.json
for /f "delims=" %%i in ('node -p "require('./package.json').version"') do set VERSION=%%i
echo 📦 Building version: %VERSION%

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build

REM Install dependencies
echo 📥 Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Create assets directory
if not exist assets mkdir assets

REM Build the application
echo 🔨 Building Windows application...
call npm run build:win
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

REM List build artifacts
echo 📁 Build artifacts:
dir dist /b

REM Generate checksums
echo 🔐 Generating checksums...
cd dist
for %%f in (*.exe *.msi) do (
    echo Checksumming: %%f
    certutil -hashfile "%%f" SHA256 > "%%f.sha256"
)
cd ..

REM Create portable version
if exist "dist\win-unpacked" (
    echo 📦 Creating portable version...
    powershell -Command "Compress-Archive -Path 'dist\win-unpacked\*' -DestinationPath 'dist\rkhs-photo-orders-v%VERSION%-portable.zip' -Force"
)

echo.
echo 🎉 Windows build completed successfully!
echo 📍 Build artifacts are in the 'dist' directory
echo.
echo 🏢 For Citrix deployment:
echo - Use the .msi installer for GPO deployment
echo - Configure Windows Firewall for ports 8080-8081
echo - Test with Citrix Receiver/Workspace app
echo.
echo 📚 For more deployment instructions, see README.md
echo.
pause
