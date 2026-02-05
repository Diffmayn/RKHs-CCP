# Production Deployment Guide

This document outlines the deployment process for RKH's Photo Order Management System across different environments.

## 🚀 Quick Start

### Local Development
```bash
npm install
npm start
```

### Production Build
```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux

# All platforms
npm run build
```

## 🏢 Citrix Deployment

### Prerequisites
- Citrix Virtual Apps or Citrix Virtual Desktops
- Windows Server 2016+ or Windows 10+
- Network access to required ports (8080-8081)

### Installation Methods

#### 1. Published Application (Recommended)
```powershell
# Install via MSI on Citrix server
msiexec /i "RKHs-Photo-Order-Management-Setup-1.0.0.msi" /quiet

# Configure firewall rules
New-NetFirewallRule -DisplayName "RKH Photo Orders Server" -Direction Inbound -Protocol TCP -LocalPort 8080
New-NetFirewallRule -DisplayName "RKH Photo Orders WebSocket" -Direction Inbound -Protocol TCP -LocalPort 8081

# Publish application in Citrix Studio
# - Application path: C:\Program Files\RKH's Photo Order Management\RKH's Photo Order Management.exe
# - Command line arguments: --citrix-mode
# - Working directory: C:\Program Files\RKH's Photo Order Management
```

#### 2. Published Desktop
- Install on master image
- Ensure all users have access to the application shortcut
- Configure roaming profiles for user settings

### Citrix Optimization Settings

#### Registry Settings (Optional)
```reg
[HKEY_CURRENT_USER\Software\RKH's CCP\RKH's Photo Order Management]
"CitrixOptimized"="true"
"ReduceAnimations"="true"
"NetworkMode"="optimized"
"AutoSave"="true"
```

#### Group Policy Settings
- Enable "Disable visual effects" for better performance
- Configure "Client drive mapping" if file operations are needed
- Set "Session sharing" to allow multiple instances

## 🌐 Network Configuration

### Firewall Rules
```bash
# Windows (PowerShell)
New-NetFirewallRule -DisplayName "RKH Photo Orders" -Direction Inbound -Protocol TCP -LocalPort 8080,8081

# Linux (iptables)
iptables -A INPUT -p tcp --dport 8080:8081 -j ACCEPT

# macOS
# Use System Preferences > Security & Privacy > Firewall > Options
```

### Network Architecture
```
Internet
    ↓
[Firewall/Proxy]
    ↓
[Citrix NetScaler/Gateway] ← Users connect here
    ↓
[Citrix Virtual Apps Server]
    ↓
[RKH Photo Order App] ← Runs locally on server
    ↓
[Local Storage + Network APIs]
```

## 📦 Installation Packages

### Windows
- **MSI**: Enterprise deployment via Group Policy
- **EXE**: Standard installer with wizard
- **Portable**: Zip file for non-admin installs

### macOS
- **DMG**: Standard drag-and-drop installer
- **ZIP**: Portable archive

### Linux
- **AppImage**: Universal Linux binary
- **DEB**: Debian/Ubuntu packages
- **RPM**: Red Hat/CentOS packages

## 🔧 Configuration

### Environment Variables
```bash
# Optional configuration
RKHS_PORT=8080              # Local server port
RKHS_CITRIX_MODE=true       # Enable Citrix optimizations
RKHS_DEBUG=false            # Debug logging
RKHS_AUTO_UPDATE=true       # Enable auto-updates
```

### Configuration Files
```
User Data Location:
- Windows: %APPDATA%\rkhs-photo-orders\
- macOS: ~/Library/Application Support/rkhs-photo-orders/
- Linux: ~/.config/rkhs-photo-orders/

Files:
- config.json: Application settings
- user-preferences.json: User-specific settings
- cache/: Temporary files and images
- logs/: Application logs
```

## 🔄 Auto-Updates

### GitHub Releases (Default)
- Automatic checking on startup
- Background downloads
- User prompt for installation
- Rollback capability

### Enterprise Distribution
```javascript
// Disable auto-updates for enterprise
{
  "autoUpdater": {
    "enabled": false,
    "checkInterval": 0
  }
}
```

## 🛡️ Security

### Application Security
- Code signing (Windows: Authenticode, macOS: Apple Developer)
- Sandboxed execution
- Secure storage for sensitive data
- HTTPS-only external connections

### Network Security
- Local server runs on localhost by default
- Configurable CORS settings
- WebSocket connections with authentication
- File upload size limits

### Citrix Security
- Integration with Citrix security policies
- Clipboard isolation (configurable)
- File transfer restrictions
- Session recording compliance

## 📊 Monitoring & Logging

### Application Logs
```
Log Levels:
- ERROR: Critical issues
- WARN: Non-critical problems
- INFO: General operations
- DEBUG: Detailed debugging

Log Locations:
- Windows: %APPDATA%\rkhs-photo-orders\logs\
- macOS: ~/Library/Logs/rkhs-photo-orders/
- Linux: ~/.local/share/rkhs-photo-orders/logs/
```

### Performance Monitoring
- Memory usage tracking
- Network connectivity status
- Citrix environment detection
- Frame rate optimization

## 🚨 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check dependencies
node --version  # Should be 16+
npm --version   # Should be 8+

# Clear cache
rm -rf ~/.config/rkhs-photo-orders/cache/
```

#### Network Connectivity Issues
```bash
# Test local server
curl http://localhost:8080/api/health

# Check firewall
netstat -an | grep 8080
```

#### Citrix-Specific Issues
```bash
# Check Citrix environment variables
echo $SESSIONNAME
echo $CITRIX_CLIENT

# Verify published app settings
# - Ensure working directory is set correctly
# - Check command line arguments include --citrix-mode
```

### Support Channels
- GitHub Issues: https://github.com/Diffmayn/RKHs-CCP/issues
- Documentation: README.md and USER-MANUAL.md
- Enterprise Support: contact your IT administrator

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Test application on target environment
- [ ] Verify network connectivity requirements
- [ ] Configure firewall rules
- [ ] Set up user permissions
- [ ] Plan rollback strategy

### Deployment
- [ ] Install application using appropriate package
- [ ] Configure Citrix published app/desktop
- [ ] Test basic functionality
- [ ] Verify auto-update settings
- [ ] Document configuration

### Post-Deployment
- [ ] Monitor application logs
- [ ] Gather user feedback
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation updates

## 🔄 Version Management

### Semantic Versioning
- **Major** (1.x.x): Breaking changes
- **Minor** (x.1.x): New features
- **Patch** (x.x.1): Bug fixes

### Release Channels
- **Stable**: Production-ready releases
- **Beta**: Pre-release testing
- **Alpha**: Development builds

### Rollback Process
1. Stop application
2. Restore previous version
3. Verify functionality
4. Update configuration if needed
5. Restart application
