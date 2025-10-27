# RKH's Photo Order Management System - Desktop Version

This directory contains everything needed to build and deploy the desktop version of RKH's Photo Order Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Git (for auto-updates)
- Windows: Visual Studio Build Tools (for native modules)
- macOS: Xcode Command Line Tools
- Linux: build-essential package

### Installation
```bash
# Clone the repository
git clone https://github.com/Diffmayn/RKHs-CCP.git
cd RKHs-CCP

# Install dependencies
npm install

# Start in development mode
npm start

# Or start with debugging
npm run dev
```

## 📦 Building

### Development Build
```bash
npm start
```

### Production Builds
```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:win     # Windows (x64, ia32)
npm run build:mac     # macOS (x64, arm64)
npm run build:linux   # Linux (x64)

# Build for all platforms
npm run build
```

### Citrix-Optimized Build
```bash
# Windows with Citrix optimizations
./scripts/build.bat
# or
bash scripts/build.sh citrix
```

## 🏢 Enterprise Deployment

### Windows (MSI/GPO)
```powershell
# Silent installation
msiexec /i "RKHs-Photo-Order-Management-Setup-1.0.0.msi" /quiet

# With custom install path
msiexec /i "RKHs-Photo-Order-Management-Setup-1.0.0.msi" /quiet INSTALLDIR="C:\Program Files\RKH Photo Orders"
```

### Citrix Virtual Apps
1. Install on master image using MSI package
2. Configure published application:
   - **Path**: `C:\Program Files\RKH's Photo Order Management\RKH's Photo Order Management.exe`
   - **Arguments**: `--citrix-mode`
   - **Working Directory**: `C:\Program Files\RKH's Photo Order Management`

### Group Policy Distribution
1. Copy MSI to SYSVOL
2. Create new GPO
3. Computer Configuration → Software Settings → Software Installation
4. Add package and configure deployment options

## 🔧 Configuration

### Application Settings
The application stores settings in platform-specific locations:

- **Windows**: `%APPDATA%\rkhs-photo-orders\`
- **macOS**: `~/Library/Application Support/rkhs-photo-orders/`
- **Linux**: `~/.config/rkhs-photo-orders/`

### Environment Variables
```bash
# Server configuration
RKHS_PORT=8080              # Local server port
RKHS_CITRIX_MODE=true       # Enable Citrix optimizations
RKHS_DEBUG=false            # Debug logging
RKHS_AUTO_UPDATE=true       # Enable auto-updates

# Network configuration
RKHS_ALLOW_REMOTE=false     # Allow remote connections
RKHS_CORS_ORIGIN=*          # CORS configuration
```

### Firewall Configuration
```bash
# Windows (PowerShell as Administrator)
New-NetFirewallRule -DisplayName "RKH Photo Orders Server" -Direction Inbound -Protocol TCP -LocalPort 8080
New-NetFirewallRule -DisplayName "RKH Photo Orders WebSocket" -Direction Inbound -Protocol TCP -LocalPort 8081

# Linux (iptables)
sudo iptables -A INPUT -p tcp --dport 8080:8081 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

## 🌐 Network Features

### Local Server Mode
- Built-in Express.js server for local hosting
- WebSocket support for real-time updates
- CORS configuration for cross-origin requests
- API endpoints for external integration

### Multi-User Support
- Shared network storage support
- User-specific settings and preferences
- Role-based access control
- Concurrent user sessions

## 🔄 Auto-Updates

### Automatic Updates (Default)
- Checks for updates on startup
- Downloads updates in background
- Prompts user for installation
- Automatic rollback on failure

### Enterprise Update Control
```json
{
  "autoUpdater": {
    "enabled": false,
    "checkInterval": 0,
    "allowPrerelease": false
  }
}
```

## 🛡️ Security Features

### Code Signing
- Windows: Authenticode signing
- macOS: Apple Developer signing and notarization
- Linux: GPG signatures

### Application Security
- Sandboxed execution environment
- Secure storage for sensitive data
- Content Security Policy enforcement
- Safe external link handling

### Network Security
- HTTPS-only external connections
- Configurable CORS policies
- Local-only server by default
- Request rate limiting

## 📊 Monitoring & Logging

### Application Logs
```
Log Locations:
- Windows: %APPDATA%\rkhs-photo-orders\logs\
- macOS: ~/Library/Logs/rkhs-photo-orders/
- Linux: ~/.local/share/rkhs-photo-orders/logs/

Log Files:
- main.log: Application events
- renderer.log: UI events  
- network.log: Network activity
- error.log: Error tracking
```

### Performance Monitoring
- Memory usage tracking
- CPU utilization monitoring
- Network connectivity status
- Frame rate optimization for Citrix

## 🚨 Troubleshooting

### Common Issues

#### Won't Start
```bash
# Check Node.js version
node --version

# Clear application cache
rm -rf ~/.config/rkhs-photo-orders/cache/

# Reset settings
rm ~/.config/rkhs-photo-orders/config.json
```

#### Network Issues
```bash
# Test local server
curl http://localhost:8080/api/health

# Check port availability
netstat -an | grep 8080

# Verify firewall rules
# Windows: Get-NetFirewallRule | Where-Object DisplayName -like "*RKH*"
# Linux: sudo iptables -L | grep 8080
```

#### Citrix Issues
- Verify `--citrix-mode` argument in published app
- Check working directory is set correctly
- Ensure proper user permissions
- Test with Citrix Receiver/Workspace app

### Support Resources
- **Documentation**: See DEPLOYMENT.md for detailed deployment guide
- **Issues**: https://github.com/Diffmayn/RKHs-CCP/issues
- **User Manual**: USER-MANUAL.md

## 📋 Feature Comparison

| Feature | Web Version | Desktop Version |
|---------|-------------|----------------|
| Offline Operation | ❌ | ✅ |
| Auto-Updates | ❌ | ✅ |
| File System Access | Limited | Full |
| Native Notifications | ❌ | ✅ |
| System Integration | ❌ | ✅ |
| Performance | Good | Excellent |
| Citrix Support | Limited | Full |
| Multi-User | Limited | Full |

## 🔄 Migration from Web Version

### Data Migration
1. Export data from web version (CSV/JSON)
2. Import into desktop version using File → Import
3. Verify all orders and settings transferred correctly

### Settings Migration
1. Export settings from browser localStorage
2. Import into desktop app configuration
3. Restart application to apply settings

## 📈 Roadmap

### Version 1.1
- [ ] Advanced reporting dashboard
- [ ] Integration with external DAM systems
- [ ] Multi-language support
- [ ] Mobile companion app

### Version 1.2
- [ ] Advanced workflow automation
- [ ] API for third-party integrations
- [ ] Enhanced Citrix optimization
- [ ] Cloud sync capabilities

## 🤝 Contributing

See the main README.md for contribution guidelines and development setup instructions.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
