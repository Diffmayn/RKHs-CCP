# Scanner Emulator Testing Guide

**Feature:** Right-Click Context Menu for Scanner Testing  
**Status:** ✅ Ready for Testing  
**Added:** October 24, 2025

---

## 🎯 Quick Start

### Step 1: Open the Application
1. Make sure server is running: `node server.js`
2. Open browser to: `http://localhost:8080`
3. Navigate to **Dashboard** or **Orders** view

### Step 2: Right-Click to Test
1. **Right-click anywhere** in Dashboard or Orders view
2. You'll see the **Scanner Testing** context menu

---

## 📋 Context Menu Options

### 🧪 Scanner Testing Menu

```
┌──────────────────────────────────────┐
│ 🧪 SCANNER TESTING                   │
├──────────────────────────────────────┤
│ 📦 Scan Existing Article         ▶  │ ← Hover for submenu
│ ❌ Scan Non-Existing Article     ▶  │ ← Hover for submenu
├──────────────────────────────────────┤
│ 🎲 Random Existing Article           │
│ 🔄 Clear Highlights                  │
└──────────────────────────────────────┘
```

---

## 📦 Scan Existing Article (Success Flow)

**How to Use:**
1. Right-click → **Scan Existing Article**
2. Hover over the menu item
3. Submenu appears with 10 articles

**Available Articles:**
```
5901234567890 - Premium Dog Food 2kg (ORD-2025-001)
2001234567892 - Espresso Beans 500g (ORD-2025-002)
4061234567890 - Wireless Bluetooth Speaker (ORD-2025-003)
8901234567891 - USB-C Cable (ORD-2025-003)
5901234567901 - Organic Baby Food Puree (ORD-2025-009)
5901234567903 - Gaming Laptop Pro X1 (ORD-2025-010)
5901234567905 - Winter Puffer Jacket (ORD-2025-011)
5901234567908 - Stand Mixer Pro (ORD-2025-012)
5901234567910 - Organic Face Serum (ORD-2025-013)
5901234567912 - Security Camera 4K (ORD-2025-014)
```

**What Happens:**
- ✅ Matching orders get **green pulsing outline**
- ✅ Badge shows "📦 Scanned: [code]"
- ✅ Auto-scrolls to first match
- ✅ Toast message: "Found X order(s)"
- ✅ Highlights clear after 10 seconds

---

## ❌ Scan Non-Existing Article (Not Found Flow)

**How to Use:**
1. Right-click → **Scan Non-Existing Article**
2. Hover over the menu item
3. Submenu appears with test codes

**Available Test Codes:**
```
9999999999999 - Test Non-Existing Article
1111111111111 - Random Code Test
0000000000000 - Zero Code Test
```

**What Happens:**
- ⚠️ Modal appears: "Article Not Found"
- ⚠️ Shows scanned code in large display
- ⚠️ Offers two buttons:
  - **Cancel** - Closes modal
  - **✓ Create New Order** - Opens order form with pre-filled code

---

## 🎲 Random Existing Article

**How to Use:**
1. Right-click → **Random Existing Article**
2. Click the option

**What Happens:**
- 🎲 Randomly selects one of the 10 existing articles
- 🎲 Automatically scans it
- 🎲 Shows results (same as manual scan)
- 🎲 Toast: "Randomly scanned: [article name]"

**Great for:**
- Quick testing
- Demonstrations
- Randomized workflow testing

---

## 🔄 Clear Highlights

**How to Use:**
1. Right-click → **Clear Highlights**
2. Click the option

**What Happens:**
- 🔄 Removes all green highlights
- 🔄 Removes all article badges
- 🔄 Clears visual indicators
- 🔄 Toast: "Highlights cleared"

**Use When:**
- You want to reset the view
- Testing multiple scans
- Highlights are stuck

---

## 🎬 Testing Scenarios

### Scenario 1: Find Existing Order
```
1. Right-click anywhere
2. Hover over "Scan Existing Article"
3. Click "5901234567890 - Premium Dog Food"
4. ✅ See ORD-2025-001 highlighted
5. ✅ Badge shows "📦 Scanned: 5901234567890"
6. ✅ Auto-scrolls to order
```

### Scenario 2: Article Not Found
```
1. Right-click anywhere
2. Hover over "Scan Non-Existing Article"
3. Click "9999999999999 - Test Non-Existing"
4. ⚠️ Modal appears with article code
5. Click "Create New Order"
6. ✅ Form opens with article pre-filled
7. Complete form and submit
```

### Scenario 3: Multiple Matches
```
1. Right-click anywhere
2. Hover over "Scan Existing Article"
3. Click "8901234567891 - USB-C Cable"
4. ✅ See ORD-2025-003 highlighted
5. Note: This article might be in multiple orders
```

### Scenario 4: Random Testing
```
1. Right-click anywhere
2. Click "Random Existing Article"
3. ✅ Random article is scanned
4. ✅ See highlighted results
5. Right-click again
6. Click "Clear Highlights"
7. ✅ View resets
8. Repeat for more tests
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **ESC** | Close context menu |
| **Right-Click** | Open context menu |
| **Click Outside** | Close context menu |

---

## 🎨 Visual Features

### Context Menu Design
- Modern rounded corners
- Smooth fade-in animation
- Hover effects on items
- Submenu flyout on hover
- Auto-positioning (stays on screen)

### Submenu Design
- Scrollable (max 400px height)
- Color-coded article info
- Three-line item display:
  - Line 1: EAN code (green, monospace)
  - Line 2: Article name (gray)
  - Line 3: Order number (light gray)

### Highlight Effects
- Green pulsing outline (#10b981)
- Animated badge with article code
- Smooth scroll to first match
- 10-second auto-clear

---

## 🔧 Developer Tools

### Console Testing
```javascript
// Manually trigger a scan
window.emulateScan('5901234567890');

// Clear all highlights
window.clearOrderHighlights();

// Search for articles
window.searchOrdersByArticle('5901234567890');

// Show not found modal
window.showArticleNotFoundModal('9999999999999');
```

### Debug Mode
```javascript
// Check scanner state
console.log('Scanner functions:', {
  processScan: typeof window.processScan,
  emulateScan: typeof window.emulateScan,
  clearOrderHighlights: typeof window.clearOrderHighlights
});
```

---

## 🐛 Troubleshooting

### Context Menu Doesn't Appear
- ✅ Make sure you're in Dashboard or Orders view
- ✅ Right-click on empty area (not on buttons)
- ✅ Check browser console for errors

### Submenu Not Showing
- ✅ Hover over menu item (don't click)
- ✅ Move mouse slowly to submenu
- ✅ Check if articles are loaded in demo data

### Highlights Not Working
- ✅ Verify order cards have article data
- ✅ Check EAN codes match format: `[EAN: 1234567890]`
- ✅ Look for console errors

### Modal Not Appearing
- ✅ Verify you selected a non-existing code
- ✅ Check if another modal is already open
- ✅ Try refreshing the page

---

## 📊 Expected Results

### Success Case (Existing Article)
```
Input:  5901234567890
Output: 
  ✅ Found 1 order(s) with article: 5901234567890
  ✅ ORD-2025-001 highlighted with green outline
  ✅ Badge shows "📦 Scanned: 5901234567890"
  ✅ Scrolled to order
  ✅ Auto-clears after 10 seconds
```

### Not Found Case (Non-Existing)
```
Input:  9999999999999
Output:
  ⚠️ Article Not Found modal appears
  ⚠️ Code displayed: 9999999999999
  ⚠️ Two buttons: Cancel / Create New Order
  
If "Create New Order" clicked:
  ✅ Form opens
  ✅ Article Code field: 9999999999999 (green highlight)
  ✅ Articles field: "Article 9999999999999 [EAN: 9999999999999]"
```

---

## 🎯 Testing Checklist

### Basic Functionality
- [ ] Context menu appears on right-click
- [ ] Menu positioned correctly (stays on screen)
- [ ] Submenu appears on hover
- [ ] Clicking article triggers scan
- [ ] Highlights appear on matching orders
- [ ] Not found modal appears for non-existing codes

### Visual Testing
- [ ] Menu animations smooth
- [ ] Hover effects working
- [ ] Colors correct (green for success, amber for warning)
- [ ] Fonts and spacing proper
- [ ] Submenu scrollable if needed
- [ ] Badge displays correctly

### Edge Cases
- [ ] Menu closes on ESC
- [ ] Menu closes on outside click
- [ ] Multiple scans work consecutively
- [ ] Random scan works properly
- [ ] Clear highlights works
- [ ] Works in both Dashboard and Orders view

### Integration
- [ ] Same behavior as real scanner
- [ ] Order creation from scan works
- [ ] Form pre-fill works
- [ ] Toast notifications appear
- [ ] Console logs show proper messages

---

## 💡 Pro Tips

### For Testing
1. **Use Random scan** for quick, varied testing
2. **Clear highlights** between tests for clean views
3. **Test both views** (Dashboard and Orders)
4. **Try edge cases** like rapid-fire scans

### For Demos
1. **Start with existing article** to show success flow
2. **Then show not found** to demonstrate order creation
3. **Use random scan** to add excitement
4. **Show clear highlights** to demonstrate control

### For Development
1. **Check console** for "[Scanner Test]" messages
2. **Use dev tools** to call functions directly
3. **Monitor performance** with browser DevTools
4. **Test on different screen sizes**

---

## 🚀 Next Steps

1. **Test thoroughly** with this guide
2. **Report any issues** you find
3. **Suggest improvements** based on usage
4. **Ready for Process 2** clarification

---

**Testing Status:** ✅ Ready  
**Last Updated:** October 24, 2025  
**Feature Version:** 1.0.0

**Happy Testing! 🎉**
