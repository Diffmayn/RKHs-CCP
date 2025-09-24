# RKH's Photo Order Management System - Desktop Installation
# Creates desktop shortcuts and start menu entries

param(
    [switch]$Uninstall,
    [switch]$CitrixMode,
    [string]$InstallPath = $PWD
)

Write-Host "🚀 RKH's Photo Order Management System - Desktop Installation" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan

if ($Uninstall) {
    Write-Host "🗑️  Uninstalling desktop integration..." -ForegroundColor Yellow
    
    # Remove desktop shortcuts
    $DesktopPath = [Environment]::GetFolderPath("Desktop")
    $Shortcuts = @(
        "$DesktopPath\RKH's Photo Orders.lnk",
        "$DesktopPath\RKH's Photo Orders (Citrix).lnk"
    )
    
    foreach ($Shortcut in $Shortcuts) {
        if (Test-Path $Shortcut) {
            Remove-Item $Shortcut -Force
            Write-Host "✅ Removed: $(Split-Path $Shortcut -Leaf)" -ForegroundColor Green
        }
    }
    
    # Remove start menu folder
    $StartMenuPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\RKH's Photo Orders"
    if (Test-Path $StartMenuPath) {
        Remove-Item $StartMenuPath -Recurse -Force
        Write-Host "✅ Removed start menu entries" -ForegroundColor Green
    }
    
    Write-Host "🎉 Uninstallation completed!" -ForegroundColor Green
    return
}

Write-Host "📁 Installation path: $InstallPath" -ForegroundColor Green

# Verify application files exist
$RequiredFiles = @("Start-RKHPhotoOrders.bat", "Start-RKHPhotoOrders.ps1", "fallback-bundle.js", "index.html")
$MissingFiles = @()

foreach ($File in $RequiredFiles) {
    $FilePath = Join-Path $InstallPath $File
    if (-not (Test-Path $FilePath)) {
        $MissingFiles += $File
    }
}

if ($MissingFiles.Count -gt 0) {
    Write-Host "❌ Missing required files:" -ForegroundColor Red
    foreach ($File in $MissingFiles) {
        Write-Host "   - $File" -ForegroundColor Red
    }
    Write-Host "Please ensure all application files are present." -ForegroundColor Red
    return
}

Write-Host "✅ All required files found" -ForegroundColor Green

# Create desktop shortcuts
Write-Host "🖥️  Creating desktop shortcuts..." -ForegroundColor Green

$DesktopPath = [Environment]::GetFolderPath("Desktop")
$Shell = New-Object -ComObject WScript.Shell

# Main shortcut
$ShortcutPath = "$DesktopPath\RKH's Photo Orders.lnk"
$Shortcut = $Shell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-ExecutionPolicy Bypass -File `"$InstallPath\Start-RKHPhotoOrders.ps1`""
$Shortcut.WorkingDirectory = $InstallPath
$Shortcut.Description = "RKH's Photo Order Management System"
$Shortcut.IconLocation = "shell32.dll,264"  # Camera icon
$Shortcut.Save()
Write-Host "✅ Created: RKH's Photo Orders.lnk" -ForegroundColor Green

# Citrix-optimized shortcut
$CitrixShortcutPath = "$DesktopPath\RKH's Photo Orders (Citrix).lnk"
$CitrixShortcut = $Shell.CreateShortcut($CitrixShortcutPath)
$CitrixShortcut.TargetPath = "powershell.exe"
$CitrixShortcut.Arguments = "-ExecutionPolicy Bypass -File `"$InstallPath\Start-RKHPhotoOrders.ps1`" -CitrixMode"
$CitrixShortcut.WorkingDirectory = $InstallPath
$CitrixShortcut.Description = "RKH's Photo Order Management System (Citrix Optimized)"
$CitrixShortcut.IconLocation = "shell32.dll,264"
$CitrixShortcut.Save()
Write-Host "✅ Created: RKH's Photo Orders (Citrix).lnk" -ForegroundColor Green

# Create Start Menu folder and shortcuts
Write-Host "📋 Creating Start Menu entries..." -ForegroundColor Green

$StartMenuPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\RKH's Photo Orders"
if (-not (Test-Path $StartMenuPath)) {
    New-Item -ItemType Directory -Path $StartMenuPath -Force | Out-Null
}

# Start Menu - Main shortcut
$StartShortcutPath = "$StartMenuPath\RKH's Photo Orders.lnk"
$StartShortcut = $Shell.CreateShortcut($StartShortcutPath)
$StartShortcut.TargetPath = "powershell.exe"
$StartShortcut.Arguments = "-ExecutionPolicy Bypass -File `"$InstallPath\Start-RKHPhotoOrders.ps1`""
$StartShortcut.WorkingDirectory = $InstallPath
$StartShortcut.Description = "RKH's Photo Order Management System"
$StartShortcut.IconLocation = "shell32.dll,264"
$StartShortcut.Save()

# Start Menu - Citrix shortcut
$StartCitrixShortcutPath = "$StartMenuPath\RKH's Photo Orders (Citrix).lnk"
$StartCitrixShortcut = $Shell.CreateShortcut($StartCitrixShortcutPath)
$StartCitrixShortcut.TargetPath = "powershell.exe"
$StartCitrixShortcut.Arguments = "-ExecutionPolicy Bypass -File `"$InstallPath\Start-RKHPhotoOrders.ps1`" -CitrixMode"
$StartCitrixShortcut.WorkingDirectory = $InstallPath
$StartCitrixShortcut.Description = "RKH's Photo Order Management System (Citrix Optimized)"
$StartCitrixShortcut.IconLocation = "shell32.dll,264"
$StartCitrixShortcut.Save()

# Start Menu - Documentation shortcut
if (Test-Path "$InstallPath\USER-MANUAL.md") {
    $DocShortcutPath = "$StartMenuPath\User Manual.lnk"
    $DocShortcut = $Shell.CreateShortcut($DocShortcutPath)
    $DocShortcut.TargetPath = "$InstallPath\USER-MANUAL.md"
    $DocShortcut.WorkingDirectory = $InstallPath
    $DocShortcut.Description = "RKH's Photo Orders User Manual"
    $DocShortcut.Save()
}

# Start Menu - Uninstall shortcut
$UninstallShortcutPath = "$StartMenuPath\Uninstall Desktop Integration.lnk"
$UninstallShortcut = $Shell.CreateShortcut($UninstallShortcutPath)
$UninstallShortcut.TargetPath = "powershell.exe"
$UninstallShortcut.Arguments = "-ExecutionPolicy Bypass -File `"$InstallPath\Install-Desktop.ps1`" -Uninstall"
$UninstallShortcut.WorkingDirectory = $InstallPath
$UninstallShortcut.Description = "Remove RKH's Photo Orders desktop integration"
$UninstallShortcut.Save()

Write-Host "✅ Start Menu entries created" -ForegroundColor Green

# Register application for "Open With" and file associations (optional)
Write-Host "🔗 Registering application..." -ForegroundColor Green

try {
    # Register as an application
    $AppKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\App Paths\rkhs-photo-orders.exe"
    if (-not (Test-Path $AppKey)) {
        New-Item -Path $AppKey -Force | Out-Null
    }
    Set-ItemProperty -Path $AppKey -Name "(Default)" -Value "$InstallPath\Start-RKHPhotoOrders.bat"
    Set-ItemProperty -Path $AppKey -Name "Path" -Value $InstallPath
    
    Write-Host "✅ Application registered" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not register application in registry" -ForegroundColor Yellow
}

# Create version file
$VersionInfo = @{
    Version = "1.0.0"
    InstallDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    InstallPath = $InstallPath
    CitrixMode = $CitrixMode
} | ConvertTo-Json

$VersionInfo | Out-File -FilePath "$InstallPath\.version" -Encoding UTF8

Write-Host ""
Write-Host "🎉 Desktop integration installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 You can now launch the application from:" -ForegroundColor Cyan
Write-Host "   • Desktop shortcuts" -ForegroundColor White
Write-Host "   • Start Menu → RKH's Photo Orders" -ForegroundColor White
Write-Host "   • Or run directly: .\Start-RKHPhotoOrders.bat" -ForegroundColor White
Write-Host ""

if ($CitrixMode) {
    Write-Host "🏢 Citrix Integration Notes:" -ForegroundColor Yellow
    Write-Host "   • Use the 'Citrix' shortcut for optimized performance" -ForegroundColor White
    Write-Host "   • Configure published app with: Start-RKHPhotoOrders.bat --citrix" -ForegroundColor White
    Write-Host ""
}

Write-Host "📚 For more information, see the documentation files:" -ForegroundColor Cyan
Write-Host "   • README-DESKTOP.md - Desktop version guide" -ForegroundColor White
Write-Host "   • DEPLOYMENT.md - Enterprise deployment" -ForegroundColor White
Write-Host "   • USER-MANUAL.md - User documentation" -ForegroundColor White
Write-Host ""
Write-Host "🗑️  To uninstall: .\Install-Desktop.ps1 -Uninstall" -ForegroundColor Gray
