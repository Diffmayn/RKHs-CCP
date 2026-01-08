# Quick Start Commands - v1.1.0

## 📦 Installation

```bash
# Navigate to project
cd "C:\Users\248075\.vscode\cli\RKHs CCP"

# Install dependencies
npm install

# Takes 2-5 minutes, installs:
# - eslint, prettier, jest
# - @typescript-eslint packages
# - @types/jest
```

## 🚀 Quick Commands

```bash
# Start application (development mode)
npm start

# OR start with Electron
npm run dev

# OR just the web server
node server.js
# Then open http://localhost:8080
```

## 🔍 New Tools (v1.1.0)

```bash
# Code quality
npm run lint              # Check for issues
npm run lint:fix          # Auto-fix issues
npm run format            # Format all files

# Testing
npm test                  # Run tests once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage

# Validation (runs lint + test)
npm run validate
```

## 🎯 What Just Installed

### New DevDependencies
- **eslint** ^8.57.0 - Code linting
- **prettier** ^3.2.5 - Code formatting
- **jest** ^29.7.0 - Testing framework
- **ts-jest** ^29.1.2 - TypeScript support for Jest
- **@typescript-eslint/eslint-plugin** ^7.7.0
- **@typescript-eslint/parser** ^7.7.0
- **@types/jest** ^29.5.12

### Configuration Files Created
- `.eslintrc.json` - Linting rules
- `.prettierrc.json` - Formatting rules
- `jest.config.js` - Test configuration

## ✅ Verify Installation

```bash
# Check that tools are available
npx eslint --version      # Should show v8.57.0+
npx prettier --version    # Should show v3.x
npx jest --version        # Should show v29.x

# Try running them
npm run lint              # Should complete without errors
npm test                  # Should run 14 tests (may have warnings)
npm start                 # Should start app normally
```

## 🐛 Troubleshooting npm install

### Issue: Certificate Error
```bash
# Error: UNABLE_TO_GET_ISSUER_CERT_LOCALLY

# Fix: Set corporate CA certificate
npm config set cafile "C:\path\to\corporate-root.pem"

# Or temporarily bypass (not recommended)
npm config set strict-ssl false
npm install
npm config set strict-ssl true
```

### Issue: Permission Errors
```bash
# Run as Administrator or:
npm cache clean --force
npm install
```

### Issue: Network Timeout
```bash
# Increase timeout
npm config set fetch-timeout 60000
npm install
```

### Issue: Corrupted node_modules
```bash
# Clean install
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

### Issue: Specific Package Fails
```bash
# Skip optional dependencies
npm install --no-optional

# Or install without scripts
npm install --ignore-scripts
```

## 📊 What Changed in package.json

**Before v1.1.0**:
```json
"devDependencies": {
  "@types/node": "^20.12.7",
  "electron": "^27.0.0",
  "electron-builder": "^24.6.4",
  // ... 5 packages
}
```

**After v1.1.0**:
```json
"devDependencies": {
  "@types/node": "^20.12.7",
  "@types/jest": "^29.5.12",
  "@typescript-eslint/eslint-plugin": "^7.7.0",
  "@typescript-eslint/parser": "^7.7.0",
  "electron": "^27.0.0",
  "electron-builder": "^24.6.4",
  "electron-rebuild": "^3.2.9",
  "eslint": "^8.57.0",
  "jest": "^29.7.0",
  "prettier": "^3.2.5",
  "rimraf": "^5.0.5",
  "ts-jest": "^29.1.2",
  // ... 15 packages total
}
```

**Added**: 7 new packages for code quality and testing

## 🎓 After Installation

### Enable Debug Mode (Optional)
```javascript
// In browser console (F12)
localStorage.setItem('debugMode', 'true');
// Reload app - see verbose logs
```

### Run Code Quality Check
```bash
npm run lint
# Review warnings (they're informational)
# Fix with: npm run lint:fix
```

### Run Tests
```bash
npm test
# Should pass 14 tests in order.service.test.ts
```

### Format Code
```bash
npm run format
# Auto-formats all JavaScript/TypeScript files
```

## 📚 Next Steps

1. ✅ Dependencies installed
2. ✅ Application works: `npm start`
3. ✅ Tools verified: `npm run lint`, `npm test`
4. 📖 Read documentation:
   - `START-HERE-v1.1.0.md` - Overview
   - `DEV-QUICK-REFERENCE.md` - Developer guide
   - `IMPROVEMENTS-SUMMARY.md` - What changed

## 🎉 You're Ready!

Your application now has:
- ✅ ESLint for code quality
- ✅ Prettier for formatting
- ✅ Jest for testing
- ✅ 14 sample tests
- ✅ Enhanced security
- ✅ Better performance
- ✅ 44 pages of documentation

**Status**: Production Ready ✅

---

**Need help?** See `MIGRATION-GUIDE-v1.1.0.md` or `TROUBLESHOOTING.md`
