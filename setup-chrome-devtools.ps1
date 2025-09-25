# Chrome DevTools VS Code Extension Setup
# This installs the Microsoft Edge Tools extension which works with Chrome too

Write-Host "🔧 Setting up Chrome DevTools in VS Code..." -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor White

# Install the Microsoft Edge Tools extension (works with Chrome)
Write-Host "`n📦 Installing Microsoft Edge Tools for VS Code..." -ForegroundColor Yellow
Write-Host "   (This extension works with Chrome too!)" -ForegroundColor Gray

try {
    # Install the extension using VS Code CLI
    $result = code --install-extension ms-edgedevtools.vscode-edge-devtools
    Write-Host "✅ Microsoft Edge Tools extension installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install extension automatically" -ForegroundColor Red
    Write-Host "   You can install it manually:" -ForegroundColor Yellow
    Write-Host "   1. Open VS Code" -ForegroundColor White
    Write-Host "   2. Go to Extensions (Ctrl+Shift+X)" -ForegroundColor White
    Write-Host "   3. Search for 'Microsoft Edge Tools'" -ForegroundColor White
    Write-Host "   4. Install the extension" -ForegroundColor White
}

# Optional: Install Chrome Extension Developer Tools
Write-Host "`n📦 Installing Chrome Extension Developer Tools..." -ForegroundColor Yellow

try {
    $result = code --install-extension aaravb.chrome-extension-developer-tools
    Write-Host "✅ Chrome Extension Developer Tools installed!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Chrome Extension Developer Tools installation failed" -ForegroundColor Yellow
    Write-Host "   This is optional - you can install manually if needed" -ForegroundColor Gray
}

Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor White

Write-Host "`n🚀 How to Use Chrome DevTools in VS Code:" -ForegroundColor Cyan
Write-Host "   1. Open your HTML file or start a local server" -ForegroundColor White
Write-Host "   2. Open Command Palette (Ctrl+Shift+P)" -ForegroundColor White
Write-Host "   3. Type 'Microsoft Edge Tools' and select:" -ForegroundColor White
Write-Host "      • 'Open Edge DevTools' or" -ForegroundColor White
Write-Host "      • 'Launch Project in Edge and open DevTools'" -ForegroundColor White
Write-Host "   4. DevTools will open as a panel inside VS Code!" -ForegroundColor White

Write-Host "`n📋 Perfect for your RKH's Content Creation Program:" -ForegroundColor Cyan
Write-Host "   • Debug your web interfaces directly in VS Code" -ForegroundColor White
Write-Host "   • Inspect DOM elements while editing code" -ForegroundColor White
Write-Host "   • Monitor network requests and responses" -ForegroundColor White
Write-Host "   • Test responsive designs" -ForegroundColor White
Write-Host "   • Debug JavaScript with breakpoints" -ForegroundColor White

Write-Host "`n💡 Pro Tip:" -ForegroundColor Yellow
Write-Host "   You can dock the DevTools panel anywhere in VS Code!" -ForegroundColor White
Write-Host "   Right-click the panel tab to move it around." -ForegroundColor White

Write-Host "`nReady to debug! 🐛✨" -ForegroundColor Green