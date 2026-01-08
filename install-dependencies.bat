@echo off
echo =====================================
echo Installing Dependencies for v1.1.0
echo =====================================
echo.

echo Checking Node.js version...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)

echo Checking npm version...
npm --version
if errorlevel 1 (
    echo ERROR: npm not found! Please install npm first.
    pause
    exit /b 1
)

echo.
echo Starting npm install...
echo This may take 2-5 minutes...
echo.

npm install

if errorlevel 1 (
    echo.
    echo =====================================
    echo Installation Issues Detected
    echo =====================================
    echo.
    echo Common fixes:
    echo   • Corporate TLS: npm config set cafile "C:\path\to\cert.pem"
    echo   • Clean install: Delete node_modules and package-lock.json
    echo   • See MIGRATION-GUIDE-v1.1.0.md troubleshooting section
    echo.
    pause
    exit /b 1
)

echo.
echo =====================================
echo SUCCESS: Dependencies Installed!
echo =====================================
echo.
echo New tools available:
echo   • ESLint   - npm run lint
echo   • Prettier - npm run format
echo   • Jest     - npm test
echo.
echo Next steps:
echo   1. npm start           - Start the application
echo   2. npm run lint        - Check code quality
echo   3. Read START-HERE-v1.1.0.md for more info
echo.
pause
