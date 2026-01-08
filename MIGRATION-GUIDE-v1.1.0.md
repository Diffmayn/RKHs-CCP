# 🔄 Migration Guide - v1.0.0 to v1.1.0

**Release Date**: January 5, 2026  
**Migration Difficulty**: ⭐ Easy  
**Estimated Time**: 5-10 minutes  
**Breaking Changes**: None ✅

---

## 📋 Pre-Migration Checklist

- [ ] Backup current installation (see `BACKUP-INSTRUCTIONS.md`)
- [ ] Note your current version: `npm run electron` → About dialog
- [ ] Close all running instances of the application
- [ ] Commit any local changes (if using Git)

---

## 🚀 Migration Steps

### Step 1: Backup (Recommended)
```bash
# Quick backup command
cd "C:\Users\248075\.vscode\cli"
Copy-Item "RKHs CCP" "RKHs CCP-BACKUP-v1.0.0" -Recurse -Exclude @('node_modules', 'dist')
```

### Step 2: Update Dependencies
```bash
cd "RKHs CCP"

# Install new development dependencies
npm install
```

**New dependencies installed**:
- eslint, prettier, jest (code quality tools)
- @typescript-eslint/* (TypeScript linting)
- @types/jest (TypeScript support for tests)

### Step 3: Verify Installation
```bash
# Check that new tools are available
npx eslint --version    # Should show v8.57.0 or higher
npx prettier --version  # Should show v3.x
npx jest --version      # Should show v29.x
```

### Step 4: Test the Application
```bash
# Start development server
npm start

# OR start packaged app
npm run electron
```

**Expected behavior**: Application should work exactly as before.

### Step 5: (Optional) Run Code Quality Checks
```bash
# Check code for issues
npm run lint

# Format code
npm run format

# Run tests
npm test
```

---

## 🔍 What Changed?

### Security (No Action Required)
- ✅ Server now only accepts localhost requests (more secure)
- ✅ Security headers added automatically
- ✅ Better error logging (helps with troubleshooting)

### Logging (Automatic)
- ✅ Production: ~90% fewer console messages (better performance)
- ✅ Development: Full logging still available
- ✅ Debug mode: Can be enabled in settings if needed

### Code Quality (For Developers)
- ✅ ESLint configured - run `npm run lint`
- ✅ Prettier configured - run `npm run format`
- ✅ Jest configured - run `npm test`

---

## 🎛️ New Features & Commands

### For Developers

#### Linting
```bash
# Check for code issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

#### Formatting
```bash
# Format all code files
npm run format
```

#### Testing
```bash
# Run tests once
npm test

# Watch mode (re-run on changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

### For Users

#### Debug Mode
Enable verbose logging when troubleshooting:

1. Open the application
2. Press `F12` to open DevTools (or Ctrl+Shift+I)
3. Go to Console tab
4. Type:
```javascript
localStorage.setItem('debugMode', 'true');
```
5. Reload the app (Ctrl+R)

You'll now see detailed logs prefixed with `[Component Name]`.

To disable:
```javascript
localStorage.setItem('debugMode', 'false');
```

---

## 🔧 Troubleshooting

### Issue: `npm install` fails with certificate error

**Cause**: Corporate TLS certificate not trusted

**Solution**:
```bash
# Option 1: Configure npm to trust your corporate certificate
npm config set cafile "C:\path\to\corporate-root.pem"

# Option 2: Temporarily bypass (not recommended)
npm config set strict-ssl false
npm install
npm config set strict-ssl true
```

### Issue: ESLint shows many warnings

**Cause**: New linting rules finding existing issues

**Solution**: This is normal. You can:
```bash
# Auto-fix many issues
npm run lint:fix

# Or ignore for now (doesn't affect functionality)
```

### Issue: Application won't start after update

**Cause**: Corrupted dependencies

**Solution**:
```bash
# Clean install
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

### Issue: Tests fail

**Cause**: Test infrastructure is new, some tests may need adjustment

**Solution**: This doesn't affect the application. Tests are optional and can be fixed later:
```bash
# Skip tests for now
npm start  # Runs app without tests
```

---

## ↩️ Rollback Procedure

If you need to revert to v1.0.0:

### Quick Rollback
```bash
# Stop the application

# Restore from backup
cd "C:\Users\248075\.vscode\cli"
Remove-Item "RKHs CCP" -Recurse -Force
Copy-Item "RKHs CCP-BACKUP-v1.0.0" "RKHs CCP" -Recurse

# Reinstall old dependencies
cd "RKHs CCP"
npm install
```

### Git Rollback (if using version control)
```bash
git checkout v1.0.0
npm install
```

---

## ✅ Post-Migration Verification

After migrating, verify these items:

- [ ] Application starts without errors
- [ ] Can log in successfully
- [ ] Can create and view orders
- [ ] Settings are preserved
- [ ] No unusual console errors (press F12 to check)
- [ ] (Optional) ESLint runs: `npm run lint`
- [ ] (Optional) Tests run: `npm test`

---

## 📞 Support

### Common Questions

**Q: Do I need to run the linting/testing commands?**  
A: No, they're optional development tools. The app works without them.

**Q: Will my data be lost?**  
A: No, all data is preserved. We only changed code, not data storage.

**Q: Can I skip this update?**  
A: You can, but v1.1.0 includes important security improvements.

**Q: How do I know the migration succeeded?**  
A: If the app starts and works normally, migration succeeded!

### Getting Help

- Check `IMPROVEMENTS-SUMMARY.md` for detailed changes
- See `VERSION-HISTORY.md` for version information
- Review `BACKUP-INSTRUCTIONS.md` for backup/restore
- Open an issue if you encounter problems

---

## 📊 Migration Checklist Summary

```
✅ Pre-Migration
  ├─ Backup created
  ├─ Current version noted
  └─ Application closed

✅ Migration
  ├─ Dependencies installed
  ├─ Installation verified
  ├─ Application tested
  └─ (Optional) Quality checks run

✅ Post-Migration
  ├─ Application starts
  ├─ Login works
  ├─ Orders accessible
  ├─ Settings preserved
  └─ No critical errors
```

---

**Status**: ✅ Ready for Migration  
**Confidence Level**: High (No breaking changes)  
**Recommended**: Yes (includes security fixes)

Happy migrating! 🎉
