# Create Order Modal - Image Annotation Guide

## Overview

This guide provides detailed instructions for annotating screenshots/wireframes of the Create Order Modal. Use this when adding supporting images to the user story document.

---

## Image 1: Modal Container & Header

### Screenshot Area
- Capture full modal from top edge to first form field
- Include modal borders and shadow
- Show it overlaying the application

### Annotations to Add

```
┌─────────────────────────────────────────────────┐
│                                                 │  ← Modal Container
│ ┌─────────────────────────────────────────────┐ │     (550px wide)
│ │ [LOGO] Create New Photo Order              │ │
│ │        Streamline new requests...               │
│ │                                          [×]  │  ← Close Button
│ │           (28×28px, Red)                       │
│ └─────────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘

ANNOTATIONS:
1. Label the modal ID: "newOrderRightModal"
2. Show z-index: "1000 (always on top)"
3. Indicate dimensions: "550px × 100vh"
4. Show background: "rgba(255, 250, 243, 0.97)"
5. Label border: "1px solid rgba(196, 139, 90, 0.25)"
6. Arrow to shadow: "box-shadow: 12px 0 40px rgba(75, 59, 42, 0.18)"
7. Label CCP Logo: "24×24px logo"
8. Title style: "18px, font-weight 600, #4b3b2a"
9. Subtitle style: "11px, 78% opacity"
10. Close button: "Red hover state: #dc2626"
```

---

## Image 2: Section 1 - Order Title Field

### Screenshot Area
- Single text input field at top of form
- Include label and placeholder

### Annotations to Add

```
LABEL (12px brown):
┌─────────────────────────────────────┐
│ Order Title                         │  ← Font-weight 600, #4b3b2a
└─────────────────────────────────────┘

INPUT FIELD:
┌─────────────────────────────────────┐
│ e.g., Premium Product Photography... │  ← Placeholder (light gray)
└─────────────────────────────────────┘
        ↑ Border: #ead7c2
        ↑ Focus border: #c48b5a
        ↑ Padding: 8px 12px
        ↑ Border-radius: 6px
        ↑ Font-size: 13px

ANNOTATIONS:
1. "Required field (✓ marked in form)"
2. "Min 3 characters validation"
3. "Max 255 characters"
4. "Initial focus on modal open"
5. "Transition: border-color 0.2s ease"
```

---

## Image 3: Section 2 - Business Details (2-Column Grid)

### Screenshot Area
- Show cost center (left) and purchase group (right) side-by-side
- Include both dropdowns with options if expanded

### Annotations to Add

```
┌─────────────────────────────┬─────────────────────────────┐
│ Cost Center   (Required)    │ Purchase Group (Required)   │
├─────────────────────────────┼─────────────────────────────┤
│ [Select cost center...  ▼]  │ [Select purchase group... ▼]│
│                             │                             │
│ Options:                    │ Options:                    │
│ - 90500512 Bilka Marketing  │ - 101 - Petfood            │
│ - 90200512 føtex marketing  │ - 102 - Coffee/Tea         │
│ - 90510512 BR               │ - 103 - Groceries          │
│ - etc...                    │ - etc...                    │
└─────────────────────────────┴─────────────────────────────┘

Grid Layout: 1fr 1fr (50% each)
Gap: 12px

ANNOTATIONS:
1. "grid-template-columns: 1fr 1fr"
2. "gap: 12px"
3. "Cost Center: 9 predefined options"
4. "Purchase Group: 6 predefined options"
5. "Both required fields"
6. "Border color: #ead7c2"
7. "Focus color: #c48b5a"
```

---

## Image 4: Section 3 - Production Method & Template

### Screenshot Area
- Show Production Method (left) and Template (right)
- Include "+ Template" button detail

### Annotations to Add

```
┌─────────────────────────────┬─────────────────────────────┐
│ Production (Required)       │ Template [+ Template]       │
├─────────────────────────────┼─────────────────────────────┤
│ [Select production...    ▼] │ [Select Template...     ▼]  │
│                             │                             │
│ Options:                    │ Standard Templates          │
│ - Photo Box                 │ - Two Image Packshot        │
│ - M&B                       │ - Lifestyle Hero            │
│ - GILS                      │ Custom Templates            │
│ - MERRILD                   │ - My Recipe Template        │
│                             │ - Product Series            │
└─────────────────────────────┴─────────────────────────────┘

Button: "+ Template"
Style: 10px font, #a66b38 background, white text
Position: Right of label
Action: Opens template builder modal

ANNOTATIONS:
1. "Production: 4 vendor options"
2. "Template: Auto-populated from system"
3. "+ Template button: 2px 6px padding"
4. "Button color: #a66b38"
5. "Button action: showOrderTemplateBuilderModal()"
6. "Change handler: handleTemplateChange()"
```

---

## Image 5: Section 4 - Dates

### Screenshot Area
- Show 2-column layout: Deadline (left) | Sample Delivery (right) side-by-side

### Annotations to Add

```
Row 1 (2-column):
┌─────────────────────────────┬─────────────────────────────┐
│ Deadline (Required)         │ Sample Delivery (Optional)  │
├─────────────────────────────┼─────────────────────────────┤
│ [📅 2025-03-15]             │ [📅 2025-03-10]             │
└─────────────────────────────┴─────────────────────────────┘

ANNOTATIONS:
1. "Deadline: type='date', required"
2. "Sample Delivery: type='date', optional"
3. "Both use HTML5 date picker"
4. "Grid: 1fr 1fr, gap 12px"
5. "Left column: Deadline (required)"
6. "Right column: Sample Delivery (optional)"
```

---

## Image 6: Section 5 - Description Fields

### Screenshot Area
- Show Brief Description textarea (larger)
- Show Activity field below

### Annotations to Add

```
┌─────────────────────────────────────────────────┐
│ Brief Description (Required)                    │
├─────────────────────────────────────────────────┤
│ Provide detailed instructions for the content   │
│ creation...                                      │
│                                                 │
│ [Long textarea (rows=2, resizable)]             │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Activity (Optional)                             │
├─────────────────────────────────────────────────┤
│ e.g., Summer Campaign                           │
│ [e.g., Summer Campaign]                         │
└─────────────────────────────────────────────────┘

ANNOTATIONS:
1. "Brief: type='textarea', required"
2. "Brief: rows=2, vertically resizable"
3. "Brief: Max 2000 characters (soft limit)"
4. "Brief: Photographer instructions"
5. "Activity: type='text', optional"
6. "Activity: Max 100 characters"
7. "Activity: Campaign tagging"
8. "Both: Full width"
```

---

## Image 7: Section 6 - Article Numbers (Main Content)

### Screenshot Area
- Show split 2-column layout with both textareas
- Include help tip text
- Show article configurator section below (if present)

### Annotations to Add

```
┌──────────────────────────────┬──────────────────────────────┐
│ Article Numbers (Required)   │ Article Names (Optional)     │
│ (EAN/GTIN) 📦               │                              │
├──────────────────────────────┼──────────────────────────────┤
│ Scan or enter article        │ Enter article names here     │
│ numbers here (one per line)  │ (one per line)               │
│                              │                              │
│ 5901234567890                │ Organic Coffee               │
│ 5901234567891                │ Green Tea                    │
│ 5901234567892                │ Herbal Mix                   │
│                              │                              │
└──────────────────────────────┴──────────────────────────────┘

Help Text (Below):
💡 Tip: You can scan barcodes directly into the left field.
   Match names on the right line-by-line.

Article Content Type Configurator (Below):
[Dynamic section for per-article configuration]

ANNOTATIONS:
1. "grid-template-columns: 1fr 1fr"
2. "gap: 12px between columns"
3. "Article Numbers: type='textarea', rows=5"
4. "Article Names: type='textarea', rows=5"
5. "Font-family: 'Courier New', monospace (barcode-like)"
6. "Article Numbers: Required (at least 1)"
7. "Article Names: Optional (line-by-line matching)"
8. "Help tip: Font-size 11px, #6b5440"
9. "event: oninput='handleNewOrderArticlesInput()'"
10. "Icon: 📦 next to Article Numbers label"
11. "Synced with newOrderArticleContentState"
```

---

## Image 8: Article Content Type Configurator

### Screenshot Area
- Show dynamic section that appears after articles added
- Display controls for contentType, combinedPhoto, shotType per article

### Annotations to Add

```
Article Content Type Configurator:
┌──────────────────────────────────────────────────────────┐
│ Article 1 - Organic Coffee (5901234567890)              │
├──────────────────────────────────────────────────────────┤
│ Content Type: [Photo ▼]  Combined: [☐]  Shot: [packshot] │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Article 2 - Green Tea (5901234567891)                   │
├──────────────────────────────────────────────────────────┤
│ Content Type: [Photo ▼]  Combined: [☐]  Shot: [lifestyle]│
└──────────────────────────────────────────────────────────┘

ANNOTATIONS:
1. "Container ID: articleContentTypeConfigurator"
2. "Generated dynamically after articles added"
3. "One section per article"
4. "Content Type: Photo|Video|etc."
5. "Combined Photo: Boolean (checkbox)"
6. "Shot Type: packshot|lifestyle|etc."
7. "Handler: handleArticleFieldChange(index, field, value)"
8. "Margin-top: 12px from articles section"
```

---

## Image 9: Form Buttons (Footer)

### Screenshot Area
- Show all three action buttons in footer
- Include button styling and hover states if possible

### Annotations to Add

```
Button Layout:
┌─────────────────────────────────────────────────┐
│  [Cancel]  [Save Draft]  [Submit Order]         │
└─────────────────────────────────────────────────┘

Button Specifications:

[Cancel Button]:
- Width: ~100px
- Height: 40px
- Background: #6b5440
- Text: white
- Font-weight: 500, 13px
- Hover: #4b3b2a, translateY(-1px)
- Box-shadow: 0 4px 12px rgba(107, 84, 64, 0.25)
- Type: button (onclick="closeNewOrderModal()")

[Save Draft Button]:
- Width: ~120px
- Height: 40px
- Background: rgba(107, 84, 64, 0.95) [Semi-transparent]
- Text: white
- Font-weight: 600, 13px
- Hover: translateY(-1px)
- Box-shadow: 0 4px 12px rgba(107, 84, 64, 0.3)
- Type: submit (onclick="setSubmissionAction('draft')")

[Submit Order Button]:
- Width: ~140px
- Height: 40px
- Background: Linear gradient 135deg (#c48b5a → #a66b38)
- Text: white
- Font-weight: 600, 13px
- Hover: translateY(-1px)
- Box-shadow: 0 4px 12px rgba(166, 107, 56, 0.35)
- Type: submit (onclick="setSubmissionAction('submit')")

Layout:
- display: flex
- gap: 10px
- justify-content: flex-end
- Margin-top: 16px
- All buttons: border-radius: 6px

ANNOTATIONS:
1. "Footer layout: flex, gap 10px"
2. "Justify-content: flex-end (buttons right-aligned)"
3. "Cancel: Secondary button style"
4. "Save Draft: Default submit (form action)"
5. "Submit Order: Primary action (gradient)"
6. "All buttons: Minimum 40px height (accessibility)"
7. "Transition: all 0.2s ease"
8. "Hover effect: translateY(-1px)"
```

---

## Image 10: Modal Animation & Interaction States

### Description
This can be a diagram or series of states rather than a screenshot

### Content

```
MODAL ANIMATION:

Closed State (Initial):
┌────────────────────────────────┐    ┌─────────────────┐
│                                │    │                 │
│  Application                   │    │ Modal (Hidden)  │
│                                │    │                 │
│                                │    │ translateX:     │
└────────────────────────────────┘    │ -100% (off-left)│
                                      └─────────────────┘

Animation (Duration: 0.3s):
Easing: cubic-bezier(0.4, 0, 0.2, 1)

Open State (After 10ms):
┌─────────────────┐┌──────────────────────────┐
│ Modal (Visible) ││  Application (Behind)    │
│ translateX: 0%  ││  Darkened/blurred         │
│ 550px wide      ││                          │
│ Full height     ││  (backdrop blur: 22px)   │
│                 ││                          │
│ [Form content]  ││                          │
│                 ││                          │
└─────────────────┘└──────────────────────────┘

Close Animation (Reverse):
Modal slides left, returns to translateX: -100%
Duration: 0.3s

ANNOTATIONS:
1. "Initial: translateX(-100%)"
2. "After 10ms: Start animation to translateX(0)"
3. "Duration: 0.3s ease-in-out"
4. "Easing: cubic-bezier(0.4, 0, 0.2, 1)"
5. "Close delay: 250ms for cleanup"
6. "Z-index: 1000 (always visible when open)"
```

---

## Image 11: Create Mode vs Edit Mode - Side by Side

### Screenshot Area
- Show left: Create mode header
- Show right: Edit mode header with different text

### Annotations to Add

```
CREATE MODE (Left):                 EDIT MODE (Right):
┌──────────────────────────┐       ┌──────────────────────────────┐
│ 📝 Create New Photo Order│       │ 📝 Edit Draft Photo Order    │
│ Streamline new requests  │       │ Draft order 100001 · Update  │
│ with warm CCP aesthetic  │       │ details before submitting.   │
└──────────────────────────┘       └──────────────────────────────┘

Form Button (Create):               Form Button (Edit):
[Save Draft]  [Submit Order]        [Update Draft]  [Submit Order]

Hidden Fields (Create):             Hidden Fields (Edit):
- submissionAction: "" (set by btn) - submissionAction: "" (set by btn)
- existingOrderNumber: ""           - existingOrderNumber: "100001"

ANNOTATIONS:
1. "isEditing = Boolean(orderToEdit && orderToEdit.orderNumber)"
2. "Create Mode: New form, empty fields, all templates available"
3. "Edit Mode: Pre-filled fields, preserves articleState"
4. "Edit Mode: Draft button says 'Update Draft', not 'Save Draft'"
5. "Edit Mode: ExistingOrderNumber = order.orderNumber"
6. "Subtitle in Edit: Shows current order number"
```

---

## Image 12: Form Validation & Error States

### Screenshot Area
- Show required field indicators
- Show validation error states

### Annotations to Add

```
REQUIRED FIELD INDICATOR:
┌─────────────────────────────────────────────────┐
│ Order Title ✓                                   │
│ (or can show as required="required" in HTML)    │
├─────────────────────────────────────────────────┤
│ [Input field...]                                │
└─────────────────────────────────────────────────┘

VALIDATION ERROR - Empty Article:
┌──────────────────────────────────────────────────────┐
│ ⚠️ Alert Box (Modal)                                 │
│                                                      │
│ Please add at least one article before creating      │
│ the order.                                           │
│                                                      │
│              [OK]                                    │
└──────────────────────────────────────────────────────┘

VALIDATION - Input Focus State:
Normal Border:        Focus Border:
#ead7c2 (light)      #c48b5a (primary)

┌──────────────┐      ┌──────────────┐
│ [Input...]   │  →   │ [Input...]   │
└──────────────┘      └──────────────┘

ANNOTATIONS:
1. "Required fields marked with ✓"
2. "Minimum validation: Real-time"
3. "Alert: Native JavaScript alert()"
4. "Form remains open on validation error"
5. "Field focus preserved for correction"
6. "Input border-color: CSS transition 0.2s"
7. "Normal state: #ead7c2"
8. "Focus state: #c48b5a"
```

---

## Image 13: Complete Form Flow Diagram

### Description
Optional flow diagram showing user journey

### Content

```
USER CLICKS "CREATE ORDER"
          ↓
   showNewOrderModal()
          ↓
   Modal renders (right-side)
          ↓
   USER FILLS FORM
   ├─ Title (required)
   ├─ Cost Center (required)
   ├─ Purchase Group (required)
   ├─ Production Method (required)
   ├─ (Optional) Template selection
   ├─ Deadline (required)
   ├─ (Optional) Budget
   ├─ (Optional) Sample Delivery
   ├─ Brief Description (required)
   ├─ (Optional) Activity
   └─ Articles (required, ≥1)
          ↓
   USER CLICKS "SUBMIT ORDER"
          ↓
   handleNewOrderSubmit() called
          ↓
   VALIDATION CHECKS:
   ├─ All required fields? ✓
   ├─ At least 1 article? ✓
   └─ Valid data types? ✓
          ↓
   ORDER OBJECT CREATED:
   ├─ Generate orderNumber
   ├─ Set status = "Submitted"
   ├─ Normalize articles
   └─ Add metadata
          ↓
   STORAGE:
   ├─ OrderStore.upsert()
   └─ localStorage sync
          ↓
   SUCCESS MESSAGE: "✅ Order created!"
          ↓
   MODAL CLOSES
          ↓
   Order visible in list
```

---

## Annotation Best Practices

### Font & Style for Annotations

- **Labels**: Arial/Helvetica, 11px, dark gray
- **Callouts**: Arrows or lines pointing to elements
- **Highlights**: Use light yellow/green background
- **Numbers**: Circled 1️⃣2️⃣3️⃣ for sequential steps

### Color Coding

- 🔴 **Red**: Critical elements, errors, close button
- 🟠 **Orange**: Primary actions, submit button
- 🟡 **Yellow**: Required fields, warnings
- 🟢 **Green**: Success states, confirmations
- 🔵 **Blue**: Information, helpful tips
- ⚫ **Black/Gray**: Standard labels, instructions

### Arrows & Connectors

```
Vertical arrow:        Diagonal arrow:        Double-ended:
    ↓                     ↘                       ↔
    ↓                     ↘                       ↔

Labeled arrow:         Dashed connection:
    ─→ Label              - - - - - - -
                         Connection
```

---

## Quick Reference: Element IDs & CSS Classes

Use these when creating numbered annotations:

```
Element IDs:
1. newOrderRightModal (main container)
2. newOrderForm (form element)
3. newOrderArticles (article numbers textarea)
4. newOrderArticleNames (article names textarea)
5. newOrderSubmissionAction (hidden input)
6. newOrderExistingOrderNumber (hidden input)
7. newOrderTemplateSelect (template dropdown)
8. articleContentTypeConfigurator (dynamic section)
9. manageOrderTemplatesBtn (template button)

CSS Classes:
- form-group (field wrapper)
- feature-form (form styling)
- btn-primary (primary button)
- btn-secondary (secondary button)
- feature-modal-header (modal header)
- feature-modal-body (modal body)
- feature-modal-footer (modal footer)
```

---

## File Recommendations

### Image Format
- **Format**: PNG or SVG (for crisp text and graphics)
- **Resolution**: 1920×1080 minimum (or proportional)
- **Compression**: Optimized for web (< 500KB per image)

### File Naming
```
01-Modal-Container-Header.png
02-Section-1-Order-Title.png
03-Section-2-Business-Details.png
04-Section-3-Production-Template.png
05-Section-4-Dates-Budget.png
06-Section-5-Description.png
07-Section-6-Articles.png
08-Article-Configurator.png
09-Form-Buttons-Footer.png
10-Modal-Animation-States.png
11-Create-vs-Edit-Modes.png
12-Validation-Error-States.png
13-Form-Flow-Diagram.png
```

---

**End of Annotation Guide**

**Created**: February 11, 2025
**For Use With**: CREATE-ORDER-MODAL-USER-STORY.md
