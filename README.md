# RKH's Photo Order Management System# RKH's Photo Order Management System



**Modern AI-powered desktop application for professional photo order management with advanced image processing capabilities.**Modern Electron-based desktop application for managing professional photo orders, integrated with GPT-5 Codex (Preview) assistance and hardened for secure enterprise use.



![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)---

![License](https://img.shields.io/badge/license-MIT-green.svg)

![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)## 🔍 System Overview



---| Layer | Purpose | Key Files |

| --- | --- | --- |

## 📋 Table of Contents| Electron Main Process | Boots the desktop app, exposes secure IPC surface, serves local API/config | `src/main.ts`, `src/app.ts`, `src/preload.js` |

| Local Services | Express server endpoints, WebSocket relay, feature flag delivery | `server.js`, `src/services/**/*.ts` |

- [Overview](#-overview)| Renderer | Optimised SPA bundle with AI integrations and UI workflows | `fallback-bundle.js`, `index.html` |

- [Key Features](#-key-features)| Tooling | Build, packaging, Live Server helpers, documentation | `package.json`, `scripts/`, `Start-*.ps1/.bat` |

- [Technology Stack](#-technology-stack)

- [Quick Start](#-quick-start)Recent hardening changes removed embedded credentials, tightened IPC handlers, gated auto-updates in development, and enabled the GPT-5 Codex preview flag for all clients.

- [Development](#-development)

- [Architecture](#-architecture)---

- [Configuration](#-configuration)

- [API Reference](#-api-reference)## ✨ Feature Highlights

- [Troubleshooting](#-troubleshooting)

- [Enterprise Documentation](#-enterprise-documentation)- Order & sample lifecycle management with Kanban, calendar, and dashboard views

- [License](#-license)- SAP-friendly import/export flows plus barcode/QR integrations

- GPT-5 Codex (Preview) surfaced through `/api/config` for renderer tooling

---- Notification, comment, and auth services backed by the Electron main process

- Secure runtime configuration loader (`configure_gemini_aq.js`) keeps secrets out of the bundle

## 🎯 Overview

---

RKH's Photo Order Management System is a comprehensive Electron-based desktop application designed for professional photography businesses. It combines robust order management with cutting-edge AI-powered image processing using Google's Gemini Flash Image 2.5 (Nano Banana) via Runware API.

## 🧱 Prerequisites

### Core Capabilities

- **Node.js** ≥ 22.20.0 (current dev environment) and npm ≥ 10.9.3

- **Order Management**: Complete lifecycle tracking with multiple view modes (Kanban, Calendar, Dashboard)- **Visual Studio Code** with the following extensions:

- **AI Image Processing**: Advanced image editing, enhancement, and generation using Google Gemini    - Live Server (requires manual install or trusted internal `.vsix` due to corporate TLS)

- **PMR Integration**: Seamless connectivity with Photo Management Repository systems    - GitHub Copilot / GPT tooling (optional)

- **Enterprise-Ready**: Secure, scalable architecture suitable for professional deployment- Ability to trust your corporate TLS root certificate on the development machine. Without it, downloads from npm/Electron will fail with `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`.



---> ℹ️ Rather than disabling SSL globally, export your company’s root cert (often via browser or IT portal) and configure npm:

> ```powershell

## ✨ Key Features> npm.cmd config set cafile "C:\path\to\corporate-root.pem"

> ```

### Order Management> If you must proceed immediately, `npm.cmd config set strict-ssl false` bypasses validation but should be reverted once the CA is trusted.

- ✅ Multi-view order tracking (Kanban, Calendar, Dashboard)

- ✅ Sample lifecycle management---

- ✅ Barcode/QR code integration

- ✅ SAP-compatible import/export## 🚀 Setup & Development Workflow

- ✅ Real-time notifications and comments

```powershell

### AI-Powered Image Processing# 1. Install dependencies (requires trusted TLS)

- 🤖 **Runware API Integration** - Google Gemini Flash Image 2.5npm.cmd install

- 🎨 Advanced image editing and enhancement

- 🖼️ AI-generated imagery from text prompts# 2. Start the app in development mode (hot reload enabled)

- ⚡ WebSocket-based real-time processing

- 💾 Local image storage and management

# 3. Launch the packaged app without dev flags

### Security & Enterprise Featuresnpm.cmd start

- 🔐 Secure credential management```

- 🛡️ No hardcoded secrets in bundles

- 🔒 IPC channel security### Live Server (static bundle view)

- 📊 Audit logging and tracking

1. Install the *Live Server* extension (use a signed `.vsix` if marketplace access is blocked).

---2. Reload VS Code; ensure `C:\Users\<you>\.vscode\extensions\ritwickdey.liveserver-5.7.9\node_modules\debug\src\index.js` exists.

3. Run `Live Server: Open with Live Server` on `test-live-server.html` to validate the bundle without Electron.

## 🛠 Technology Stack

If the extension install is corrupted, copy the `debug@2.6.9` `src` folder from a trusted node_modules cache and reload VS Code.

| Component | Technology | Purpose |

|-----------|-----------|---------|---

| **Desktop Framework** | Electron 27+ | Cross-platform desktop application |

| **Runtime** | Node.js 20 LTS | JavaScript runtime environment |## 🧪 Testing & Quality Gates

| **Web Server** | Express | HTTP server for local API endpoints |

| **AI Integration** | Runware API | Google Gemini Flash Image 2.5 access |- **Install**: `npm.cmd install` (requires corporate CA trust)

| **Database** | SQLite | Local data persistence |- **Build (packaging smoke test)**: `npm.cmd run build`

| **UI Framework** | Vanilla JavaScript | Lightweight, fast rendering |- **Clean artifacts**: `npm.cmd run clean`

- **Electron rebuild** (native modules): `npm.cmd run rebuild`

---

> The current `test` script is a placeholder. Recommended follow-ups:

## 🚀 Quick Start> - Add integration tests for hardened IPC handlers (`src/preload.js` ↔ `src/main.ts`).

> - Create unit tests for express endpoints in `server.js`.

### Prerequisites

Document your build results in `VERSION-HISTORY.md` after successful packaging.

- **Node.js** ≥ 20.0.0 (LTS recommended)

- **npm** ≥ 10.0.0---

- **Windows 10/11** (primary platform)

## 📚 Documentation & References

### Installation

- `COMPREHENSIVE-USER-GUIDE.md` – end-user walkthrough

```powershell- `README-DESKTOP.md` – Electron distribution specifics

# Clone the repository- `README-MCP.md` & `setup-mcp.sh` – MCP server setup

git clone <repository-url>- `ENTERPRISE-REVIEW.md` – security review notes and follow-up items

cd "RKHs CCP"- `SYNTAX_ERROR_FIX.md` – JavaScript bundle hotfix history



# Install dependenciesUpdate these docs whenever security settings, AI integrations, or deployment processes change.

npm install

---

# Start the development server

npm start## 🛠 Troubleshooting

```

| Symptom | Likely Cause | Resolution |

### Access the Application| --- | --- | --- |

| `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` during `npm install` | Corporate TLS inspection | Import root CA and set `npm config set cafile <cert.pem>`; temporarily use `strict-ssl false` if blocked |

**Web Interface:**| `electron-builder` not found | `node_modules` missing | Re-run `npm.cmd install`; confirm `%PROJECT%\node_modules\.bin` exists |

```powershell| Live Server crashes on start | Missing `debug` dependency inside extension | Copy `debug@2.6.9` `src` folder from a trusted package and reload VS Code |

# Start the HTTP server| PowerShell blocks npm scripts | Execution policy set to `Restricted` | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (or call `npm.cmd` instead of `npm`) |

node server.js

See `readme-troubleshoot.md` for a longer list of operational fixes.

# Open browser to http://localhost:8080

```---



**Desktop App:**## 🔐 Security Notes

```powershell

# Start Electron application- No secrets live in the bundle; use secure runtime storage (environment variables, OS credential vault) and load them via `configure_gemini_aq.js`.

npm run electron- Auto-updater is gated in development (`canCheckForUpdates` flag).

```- Protocol handlers validate request origins before serving local files.

- Cross-window messaging limited to whitelisted channels in `src/preload.js`.

---

---

## 💻 Development

## 📄 License

### Project Structure

MIT © RKH's CCP

```

RKHs CCP/---

├── index.html              # Main application UI

├── fallback-bundle.js      # Application bundle (13K+ lines)Built with ❤️ for professional photo order management.

├── server.js               # HTTP server (port 8080)
├── configure_gemini_aq.js  # Gemini API configuration
├── package.json            # Dependencies and scripts
├── src/
│   ├── main.js            # Electron main process
│   ├── preload.js         # Electron preload script
│   └── config/
│       └── tactics.js     # PMR integration config
├── assets/                # Static assets
└── ENTERPRISE-PROPOSAL/   # Business documentation
```

### Available Commands

```powershell
# Start HTTP server on port 8080
node server.js

# Start Electron desktop app
npm run electron

# Install dependencies
npm install

# Clean build artifacts
npm run clean
```

### Configuration Files

- **`configure_gemini_aq.js`** - Gemini API settings (12 lines, optimized)
- **`src/config/tactics.js`** - PMR integration configuration
- **`package.json`** - Project dependencies and scripts

---

## 🏗 Architecture

### System Layers

```
┌─────────────────────────────────────┐
│   Browser UI (index.html)           │
├─────────────────────────────────────┤
│   Application Logic                 │
│   (fallback-bundle.js - 13K lines)  │
├─────────────────────────────────────┤
│   HTTP Server (server.js)           │
│   Port 8080, CORS enabled           │
├─────────────────────────────────────┤
│   Electron Main Process             │
│   (src/main.js, src/preload.js)     │
├─────────────────────────────────────┤
│   External Services                 │
│   - Runware API (WebSocket)         │
│   - Gemini AI (REST API)            │
│   - PMR System (Integration)        │
└─────────────────────────────────────┘
```

### Key Components

**Frontend (index.html + fallback-bundle.js)**
- Single-page application
- AI integration UI
- Order management interface
- WebSocket client for real-time updates

**Backend (server.js)**
- Static file serving
- CORS support for local development
- Security: Directory traversal protection
- MIME type handling

**Electron Layer (src/main.js)**
- Desktop application wrapper
- IPC communication
- System integration
- Security hardening

---

## ⚙ Configuration

### Runware API Setup

The application uses Google Gemini Flash Image 2.5 via Runware API:

```javascript
// Default configuration in fallback-bundle.js
{
  apiKey: '<your-api-key>',
  websocketEndpoint: 'wss://ws-api.runware.ai/v1',
  model: 'google:4@1'  // Nano Banana
}
```

**To configure:**
1. Obtain API key from Runware
2. Store in localStorage: `runwareApiKey`
3. Or use the setup modal in the application UI

### Gemini API Setup

Configure Google Gemini for advanced AI features:

```javascript
// Configuration in configure_gemini_aq.js
{
  apiKey: '<your-gemini-key>',
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  model: 'gemini-2.5-flash',
  maxTokens: 2048,
  temperature: 0.7
}
```

**Environment Variables:**
- `GEMINI_API_KEY` - Your Google AI Studio API key
- `RUNWARE_API_KEY` - Your Runware API key

---

## 📡 API Reference

### HTTP Server Endpoints

```
GET  /                     # Main application (index.html)
GET  /index.html           # Main application (explicit)
GET  /fallback-bundle.js   # Application bundle
GET  /configure_gemini_aq.js  # Gemini configuration
GET  /assets/*             # Static assets
```

### WebSocket Integration

**Runware WebSocket API:**
- Endpoint: `wss://ws-api.runware.ai/v1`
- Protocol: JSON-RPC
- Authentication: API key in connection parameters

**Key Operations:**
- Image generation from text prompts
- Image-to-image transformation
- Style transfer and enhancement
- Real-time processing status

### LocalStorage Keys

```javascript
// API Keys
'runwareApiKey'      // Runware API authentication
'geminiApiKey'       // Google Gemini API key
'geminiProjectId'    // GCP project ID (optional)
'geminiLocation'     // GCP region (default: us-central1)

// Application State
'orderData'          // Cached order information
'userPreferences'    // UI preferences and settings
```

---

## 🔧 Troubleshooting

### Common Issues

**WebSocket Timeout**
```
Problem: WebSocket connection times out after 5 seconds
Solution: Post-IIFE initialization block ensures promise resolution
Location: fallback-bundle.js line 13,780+
```

**Server Won't Start**
```powershell
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Kill process if needed
taskkill /PID <process-id> /F

# Restart server
node server.js
```

**Electron App Crashes**
```powershell
# Clear Electron cache
Remove-Item -Recurse -Force "$env:APPDATA\RKHs CCP"

# Reinstall dependencies
npm install

# Restart app
npm run electron
```

**Missing Dependencies**
```powershell
# Full clean reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Debug Mode

Enable verbose logging:
```javascript
// In browser console
localStorage.setItem('debugMode', 'true');
location.reload();
```

### Performance Issues

**Large Bundle Size (13K+ lines)**
- Current: Monolithic fallback-bundle.js
- Optimization in progress: Modularization and tree-shaking
- Workaround: Use production build for better performance

---

## 📚 Enterprise Documentation

For business stakeholders and enterprise architects, see the comprehensive proposal documentation:

```
ENTERPRISE-PROPOSAL/
├── 01-EXECUTIVE-SUMMARY.md          # Business overview
├── 02-TECHNICAL-ARCHITECTURE.md     # System design
├── 03-INTEGRATION-STRATEGY.md       # PMR & AI integration
├── 04-SECURITY-COMPLIANCE.md        # Security framework
├── 05-DEPLOYMENT-PLAN.md            # Rollout strategy
├── 06-COST-BENEFIT-ANALYSIS.md      # ROI analysis
├── 07-RISK-MITIGATION.md            # Risk management
└── 08-ROADMAP-FUTURE.md             # Product roadmap
```

**File Size:** 151KB total, professionally formatted
**Audience:** CTOs, Enterprise Architects, Business Leaders

---

## 🔐 Security

### Best Practices

- ✅ **No Hardcoded Secrets** - All credentials stored securely
- ✅ **Environment Variables** - Use `.env` for sensitive data
- ✅ **CORS Protection** - Server configured with appropriate headers
- ✅ **Input Validation** - All user inputs sanitized
- ✅ **Secure IPC** - Electron IPC channels whitelisted

### Known Security Measures

1. **Credential Management**: Runtime configuration loading
2. **Directory Traversal Protection**: Server validates file paths
3. **WebSocket Security**: WSS protocol with API key authentication
4. **Local Storage**: Sensitive data encrypted before storage

---

## 📄 License

**MIT License** © RKH's CCP

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.

---

## 🤝 Support

For technical support or feature requests:
- **Issues**: GitHub Issues (if repository is public)
- **Documentation**: See `ENTERPRISE-PROPOSAL/` folder
- **Contact**: [Your contact information]

---

## 🎯 Current Status

**Version:** 1.0.0  
**Status:** Production Ready  
**Last Updated:** 2025  
**Code Size:** ~636KB (optimized from 800KB+)  
**Architecture:** Streamlined (220+ files reduced to ~20 core files)

---

**Built with ❤️ for professional photography businesses**
