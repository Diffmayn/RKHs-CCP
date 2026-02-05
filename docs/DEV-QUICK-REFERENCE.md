# 🛠️ Developer Quick Reference - RKH's CCP v1.1.0

**Last Updated**: January 5, 2026  
**Quick Start**: `npm install` → `npm start`

---

## 📦 Installation

```bash
# Clone and setup
cd "C:\Users\248075\.vscode\cli\RKHs CCP"
npm install

# First time setup - may need corporate CA cert
npm config set cafile "C:\path\to\corporate-root.pem"
```

---

## 🚀 Running the App

```bash
# Development mode (with DevTools)
npm start
# OR
npm run dev

# Production-like mode
npm run electron

# Web server only (no Electron)
node server.js
# Then open http://localhost:8080
```

---

## 🔍 Code Quality

### Linting
```bash
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues
npx eslint <file>         # Check single file
```

**Common ESLint Warnings**:
- `no-console` - Use console.warn/error instead of console.log
- `no-unused-vars` - Remove or prefix unused variables with `_`
- `prefer-const` - Use `const` for values that don't change

### Formatting
```bash
npm run format            # Format all files
npx prettier --write <file>  # Format single file
```

**Prettier Config**: `.prettierrc.json`
- Single quotes, semicolons
- 100 char line width, 2 spaces

---

## 🧪 Testing

```bash
npm test                  # Run all tests once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
npx jest <test-file>      # Run single test
```

**Writing Tests**: See `src/services/order.service.test.ts` for examples

**Test Structure**:
```typescript
import { functionName } from '../module';

describe('Module Name', () => {
  it('should do something', () => {
    expect(functionName()).toBe(expected);
  });
});
```

---

## 📁 Project Structure

```
RKHs CCP/
├── src/
│   ├── main.js              ← Electron main process (ACTIVE)
│   ├── main.ts.deprecated   ← Future migration target
│   ├── preload.js           ← Secure IPC bridge
│   ├── services/            ← Business logic
│   │   ├── order.service.ts
│   │   ├── auth.service.ts
│   │   └── *.test.ts        ← Unit tests
│   ├── renderer/            ← Frontend (TypeScript)
│   └── types/               ← TypeScript definitions
├── server.js                ← HTTP server (port 8080)
├── fallback-bundle.js       ← Legacy bundle (636KB)
├── index.html               ← Main HTML entry
├── package.json             ← Dependencies & scripts
├── tsconfig.json            ← TypeScript config
├── vite.config.ts           ← Vite bundler
├── .eslintrc.json           ← Linting rules
├── .prettierrc.json         ← Formatting rules
└── jest.config.js           ← Test config
```

---

## 🔧 Configuration Files

| File | Purpose | Docs |
|------|---------|------|
| `.eslintrc.json` | Code linting rules | [ESLint Docs](https://eslint.org) |
| `.prettierrc.json` | Code formatting | [Prettier Docs](https://prettier.io) |
| `jest.config.js` | Testing framework | [Jest Docs](https://jestjs.io) |
| `tsconfig.json` | TypeScript compiler | [TS Docs](https://typescriptlang.org) |
| `vite.config.ts` | Frontend bundler | [Vite Docs](https://vitejs.dev) |

---

## 🐛 Debugging

### Enable Debug Mode (App)
```javascript
// In browser console (F12)
localStorage.setItem('debugMode', 'true');
location.reload();
```

### Enable Dev Tools (Electron)
```javascript
// src/main.js - Line 214
if (this.isDev) {
  this.mainWindow.webContents.openDevTools();
}
```

### Server Debug
```bash
# Add console.logs to server.js
# Logs appear in terminal where you ran `node server.js`
```

### Electron Main Process Debug
```bash
# Logs appear in terminal where you ran `npm start`
```

---

## 🔐 Security Notes

### CORS Policy (server.js)
```javascript
// Only these origins allowed:
const allowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:5173',  // Vite dev server
  'http://127.0.0.1:5173'
];
```

### IPC Security (preload.js)
```javascript
// Use contextBridge API, never nodeIntegration
contextBridge.exposeInMainWorld('electronAPI', {
  // Safe exposed methods only
});
```

---

## 📊 Performance Tips

### Reduce Bundle Size
```bash
# Current: 636KB fallback-bundle.js
# TODO: Split with Vite (planned v1.2.0)
npm run renderer:build
```

### Conditional Logging
```javascript
// ✅ Good - Conditional
if (this.isDev) {
  console.log('[Component] Debug message');
}

// ❌ Bad - Always logs
console.log('Debug message');
```

---

## 🔄 Git Workflow

```bash
# Before making changes
git checkout -b feature/my-feature

# After changes
git add .
git commit -m "feat: description"
npm run lint           # Check code quality
npm test               # Run tests
git push origin feature/my-feature
```

**Commit Message Format**:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

---

## 🆘 Common Issues

### Issue: Port 8080 in use
```bash
# Find process
netstat -ano | findstr :8080

# Kill process (replace PID)
Stop-Process -Id <PID> -Force
```

### Issue: Electron won't start
```bash
# Clear cache
Remove-Item "$env:APPDATA\RKHs CCP" -Recurse -Force

# Rebuild native modules
npm run rebuild
```

### Issue: TypeScript errors
```bash
# Regenerate types
npx tsc --noEmit

# Check tsconfig.json
```

### Issue: npm install fails (Corporate TLS)
```bash
# Set CA certificate
npm config set cafile "C:\path\to\cert.pem"

# OR temporarily (not recommended)
npm config set strict-ssl false
```

---

## 📚 Documentation Links

- **User Guide**: `COMPREHENSIVE-USER-GUIDE.md`
- **API Reference**: `README.md` (API section)
- **Security**: `ENTERPRISE-REVIEW.md`
- **Deployment**: `DEPLOYMENT.md`
- **Troubleshooting**: `readme-troubleshoot.md`
- **Improvements**: `IMPROVEMENTS-SUMMARY.md`
- **Migration**: `MIGRATION-GUIDE-v1.1.0.md`
- **Backup**: `BACKUP-INSTRUCTIONS.md`

---

## 🎯 Quick Commands Cheat Sheet

```bash
# Development
npm start                 # Start dev mode
npm run dev               # Same as above
node server.js            # Web server only

# Building
npm run build            # Build Electron app
npm run renderer:build   # Build renderer only

# Quality
npm run lint             # Check code
npm run lint:fix         # Fix code issues
npm run format           # Format code
npm test                 # Run tests
npm run validate         # Lint + Test

# Maintenance
npm run clean            # Delete build artifacts
npm run rebuild          # Rebuild native modules
npm install              # Install dependencies
```

---

## 💡 Pro Tips

1. **Use the logger**: Import from `src/renderer/core/logger.ts`
2. **Test services**: Add `*.test.ts` files next to services
3. **Type safety**: Prefer TypeScript for new files
4. **Debug mode**: Enable in localStorage for troubleshooting
5. **Security first**: Always validate inputs, never trust client data

---

**Need Help?**
- Check documentation files above
- Review code comments
- Ask team members
- Create an issue

**Making Changes?**
1. Create a branch
2. Make changes
3. Run linting & tests
4. Create PR with description

---

*Happy coding! 🚀*
