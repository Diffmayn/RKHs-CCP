# Create Order Modal - Comprehensive User Story

## Document Information
- **JIRA ID**: ORD-001-MODAL
- **Title**: Create New Photo Order Modal (Detailed Specification)
- **Type**: Technical Feature Specification
- **Status**: In Progress
- **Priority**: High
- **Base Story**: ORD-001: Create New Photo Order
- **Version**: 1.0.0
- **Date**: February 11, 2025
- **Last Updated**: February 11, 2025
- **Component**: Order Management → Create Order Modal

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [User Story](#user-story)
3. [Modal Structure & Layout](#modal-structure--layout)
4. [Field Specifications](#field-specifications)
5. [Field Validation & Logic](#field-validation--logic)
6. [Form Functions & Handlers](#form-functions--handlers)
7. [Data Mapping & Transformation](#data-mapping--transformation)
8. [State Management](#state-management)
9. [User Workflows](#user-workflows)
10. [Error Handling](#error-handling)
11. [Accessibility & UX](#accessibility--ux)
12. [Integration Points](#integration-points)

---

## Executive Summary

The **Create Order Modal** is a right-side panel interface that allows users to create new photo orders or edit existing draft orders. It presents a comprehensive form with 12+ input fields organized in a logical, user-friendly layout with warm, professional styling. The modal supports both "Save as Draft" and "Submit" workflows, integrates with the template system, and auto-generates order numbers.

**Key Features:**
- ✅ Right-side slide-in panel (550px wide)
- ✅ Professional warm aesthetic (CCP branding)
- ✅ Dual submission modes (Draft/Submit)
- ✅ Article/EAN scanning support
- ✅ Template integration
- ✅ Real-time validation
- ✅ Form hydration for editing
- ✅ Mobile-responsive design

---

## User Story

### Primary User Story

**JIRA ID**: `ORD-001-MODAL`

**Title**: Create New Photo Order with Modal Interface

**Type**: Story

**As a** content manager or photographer,  
**I want to** create a new photo order or edit an existing draft order using an intuitive modal interface,  
**So that** I can efficiently submit order requests with all necessary details and specifications.

### Acceptance Criteria

- [ ] **AC-001**: Modal opens as a right-side slide-in panel (550px width) when "Create Order" is clicked
- [ ] **AC-002**: Modal displays distinct title and subtitle based on create vs. edit mode
- [ ] **AC-003**: All 12+ form fields are clearly labeled with consistent styling
- [ ] **AC-004**: Form fields validate input in real-time with clear error messages
- [ ] **AC-005**: Template dropdown populates with both standard and custom templates
- [ ] **AC-006**: Article numbers can be scanned or manually entered with auto-formatting
- [ ] **AC-007**: "Save Draft" button saves order with "Not submitted" status
- [ ] **AC-008**: "Submit Order" button saves order with "Submitted" status
- [ ] **AC-009**: Order number is auto-generated sequentially from existing orders
- [ ] **AC-010**: Form accurately pre-fills all existing values when editing a draft
- [ ] **AC-011**: ESC key closes the modal with form preservation
- [ ] **AC-012**: Cancel button discards changes and returns to previous state
- [ ] **AC-013**: Success message displays order number after creation/update
- [ ] **AC-014**: Modal closes automatically after successful submission

### Acceptance Criteria Details

| ID | Criteria | Details | Priority |
|-------|----------|---------|----------|
| AC-001 | Modal Opening | Opens from left side with 0.3s ease-in-out animation | High |
| AC-002 | Mode Detection | "Create New Photo Order" vs "Edit Draft Photo Order" | High |
| AC-003 | Field Labeling | 12-point monospace labels with warm color scheme | High |
| AC-004 | Validation | Real-time, with required field indicators | High |
| AC-005 | Templates | Grouped (Standard vs Custom) with selection | Medium |
| AC-006 | Articles | Multi-line textarea with EAN/GTIN support | High |
| AC-007 | Draft Workflow | Status: "Not submitted", preserves form state | High |
| AC-008 | Submit Workflow | Status: "Submitted", photo status: "New Request" | High |
| AC-009 | Order Number | Sequential increment from max existing number | High |
| AC-010 | Form Hydration | All fields populate from existing order data | High |
| AC-011 | ESC Key | Removes listener, animates out, clears state | Medium |
| AC-012 | Cancel Button | No confirmation needed, direct close | High |
| AC-013 | Success Message | Modal alert with order number | High |
| AC-014 | Auto Close | Modal closes 300ms after success | High |

---

## Modal Structure & Layout

### Modal Container

#### Technical Specifications

```
Position:        Fixed, Full viewport coverage
Width:           550px
Height:          100vh (full viewport height)
Background:      rgba(255, 250, 243, 0.97) + backdrop blur
Border:          1px solid rgba(196, 139, 90, 0.25)
Box Shadow:      12px 0 40px rgba(75, 59, 42, 0.18)
Z-Index:         1000 (always on top)
Padding:         20px all sides
Overflow-Y:      Auto (scrollable content)
Transform:       translateX(-100% to 0%) animation
Transition:      0.3s cubic-bezier(0.4, 0, 0.2, 1)
ID:              newOrderRightModal
```

#### Color Palette

| Component | Color | RGB/Hex | Usage |
|-----------|-------|---------|-------|
| Background | Warm Cream | `rgba(255, 250, 243, 0.97)` | Main container |
| Border | Warm Brown | `rgba(196, 139, 90, 0.25)` | Dividers, borders |
| Form BG | Gradient Cream | Linear 135deg: `#fdf4e6` → `#f2e4d2` | Form container |
| Text Primary | Dark Brown | `#4b3b2a` | Labels, headings |
| Text Secondary | Light Brown | `rgba(107, 84, 64, 0.78)` | Subtitles, hints |
| Primary Button | Brown Gradient | `#c48b5a` → `#a66b38` | Submit, primary actions |
| Secondary Button | Dark Brown | `#6b5440` | Cancel, secondary actions |
| Error Red | Red | `#ef4444` → `#dc2626` (hover) | Close button, errors |
| Focus Border | Primary | `#c48b5a` | Input focus state |

### Modal Header

#### Structure

```
Header Container:
├─ Logo + Title Section
│  ├─ CCP Logo (24×24px)
│  ├─ Modal Title (18px, 600 weight)
│  └─ Modal Subtitle (11px, 78% opacity)
└─ Close Button
   └─ Red circle with × (28×28px)
```

#### Dynamic Text

**Create Mode:**
- Title: `"Create New Photo Order"`
- Subtitle: `"Streamline new requests with the warm CCP workspace aesthetic."`

**Edit Mode:**
- Title: `"Edit Draft Photo Order"`
- Subtitle: `"Draft order {ORDER_NUMBER} · Update details before submitting."`

---

## Field Specifications

### Overview

The modal contains 12 primary form fields organized into 5 logical sections:

1. **Order Title** (Text Input) - 1 field
2. **Business Details** (Selects) - 3 fields (Cost Center, Purchase Group, Production Method)
3. **Dates** (Mixed) - 2 fields (Deadline, Sample Delivery)
4. **Description & Activity** (Textareas) - 2 fields
5. **Articles** (Textareas) - 2 fields (EAN/GTIN + Names)

### Detailed Field Specifications

#### Section 1: Order Information

##### Field 1.1: Order Title

```
Field Name:              title
Field Type:              Text Input
Required:                Yes ✓
Placeholder:             "e.g., Premium Product Photography Session"
Max Length:              255 characters
Validation:              Minimum 3 characters
Input Type:              text
Style:                   Full width
Border Color:            #ead7c2 (focus: #c48b5a)
Font Size:               13px
Padding:                 8px 12px
Border Radius:           6px
Grid Position:           Full width (top)
```

**Mapping:**
- Form Field: `newOrderForm[name="title"]`
- Form Data Key: `title`
- Order Property: `newOrder.title`
- Database Field: `orders.title`
- Display: Used in order lists, search results, notifications

**Validation Logic:**
```javascript
if (!data.title || data.title.trim().length < 3) {
  errors.push('Title must be at least 3 characters');
}
```

---

#### Section 2: Business Details

##### Field 2.1: Cost Center (Select Dropdown)

```
Field Name:              costCenter
Field Type:              Select Dropdown
Required:                Yes ✓
Placeholder:             "Select cost center..."
Options:                 9 predefined cost centers
Input Type:              select
Style:                   50% width (grid: 1fr 1fr)
Border Color:            #ead7c2 (focus: #c48b5a)
Font Size:               13px
Padding:                 8px 12px
Border Radius:           6px
Grid Position:           Left column (2-column grid)
```

**Available Options:**

| Value | Label | Department |
|-------|-------|-----------|
| `90500512 Bilka Marketing` | 90500512 Bilka Marketing | Bilka |
| `90200512 føtex marketing` | 90200512 føtex marketing | Føtex |
| `90510512 BR` | 90510512 BR | BR |
| `90880220 Chilled, Meat & poultry` | 90880220 Chilled, Meat & poultry | Food |
| `90870390 Electronic & Garden` | 90870390 Electronic & Garden | Electronics |
| `90870330 Home & Leisure` | 90870330 Home & Leisure | Home |
| `90700572 Netto Marketing` | 90700572 Netto Marketing | Netto |
| `90880110 Product Data Governance` | 90880110 Product Data Governance | Governance |
| `90740310 Textile` | 90740310 Textile | Fashion |

**Mapping:**
- Form Field: `newOrderForm[name="costCenter"]`
- Form Data Key: `costCenter`
- Order Property: `newOrder.costCenter`
- Database Field: `orders.costCenter`
- Used In: Billing allocation, department filtering, analytics

**Validation Logic:**
```javascript
if (!data.costCenter || data.costCenter === '') {
  errors.push('Cost center is required');
}
```

---

##### Field 2.2: Purchase Group (Select Dropdown)

```
Field Name:              purchaseGroup
Field Type:              Select Dropdown
Required:                Yes ✓
Placeholder:             "Select purchase group..."
Options:                 6 predefined purchase groups
Input Type:              select
Style:                   50% width (grid: 1fr 1fr)
Border Color:            #ead7c2 (focus: #c48b5a)
Font Size:               13px
Padding:                 8px 12px
Border Radius:           6px
Grid Position:           Right column (2-column grid)
```

**Available Options:**

| Value | Label | Category |
|-------|-------|----------|
| `101` | 101 - Petfood | Groceries |
| `102` | 102 - Coffee/Tea | Beverages |
| `103` | 103 - Groceries | Staples |
| `104` | 104 - Confectionary | Sweets |
| `105` | 105 - Dry Food | Grains |
| `106` | 106 - Frozen | Frozen |

**Mapping:**
- Form Field: `newOrderForm[name="purchaseGroup"]`
- Form Data Key: `purchaseGroup`
- Order Property: `newOrder.purchaseGroup` (coerced to number)
- Database Field: `orders.purchaseGroup`
- Used In: Inventory management, purchase order routing, access control

**Validation Logic:**
```javascript
if (!data.purchaseGroup || data.purchaseGroup === '') {
  errors.push('Purchase group is required');
}

// Coerce to number for storage
newOrder.purchaseGroup = data.purchaseGroup 
  ? parseInt(data.purchaseGroup, 10) 
  : null;
```

---

##### Field 2.3: Production Method (Select Dropdown)

```
Field Name:              method
Field Type:              Select Dropdown
Required:                Yes ✓
Label:                   "Production"
Placeholder:             "Select production..."
Options:                 4 production methods
Input Type:              select
Style:                   50% width (grid: 1fr 1fr)
Border Color:            #ead7c2 (focus: #c48b5a)
Font Size:               13px
Padding:                 8px 12px
Border Radius:           6px
Grid Position:           Left column (2-column grid)
```

**Available Options:**

| Value | Label | Description |
|-------|-------|-------------|
| `Photo Box` | Photo Box | Photo Box production facility |
| `M&B` | M&B | M&B production partner |
| `GILS` | GILS | GILS photography studio |
| `MERRILD` | MERRILD | MERRILD production center |

**Mapping:**
- Form Field: `newOrderForm[name="method"]`
- Form Data Key: `method`
- Order Property: `newOrder.method`
- Database Field: `orders.method`
- Used In: Task routing, vendor selection, SLA tracking

**Validation Logic:**
```javascript
if (!data.method || data.method === '') {
  errors.push('Production method is required');
}
```

---

#### Section 3: Template Selection

##### Field 3.1: Order Template (Select Dropdown with Button)

```
Field Name:              template
Field Type:              Select Dropdown with Action Button
Required:                No
Label:                   "Template"
Action Button:           "+ Template" (brown button)
Button Position:         Right of label
Placeholder:             "Select Template..."
Input Type:              select
Style:                   50% width (grid: 1fr 1fr)
Border Color:            #ead7c2 (focus: #c48b5a)
Font Size:               13px
Padding:                 8px 12px
Border Radius:           6px
Grid Position:           Right column (2-column grid)
Button Action:           Opens template builder modal
Button ID:               manageOrderTemplatesBtn
```

**Dynamic Population:**
- Grouped into "Standard Templates" and "Custom Templates"
- Populated from: `BASE_ORDER_TEMPLATES` and `getCustomOrderTemplates()`
- Handler: `populateOrderTemplateOptions(selectEl)`
- Change Event: Triggers `handleTemplateChange()`

**Available Template Types:**
- Standard templates (predefined by system)
- Custom templates (user-created from previous orders)
- Template data includes: name, description, category, usage count, tags

**Mapping:**
- Form Field: `newOrderForm[name="template"]`
- Form Data Key: `template`
- Order Property: Not directly stored (used to hydrate form)
- Used In: Form auto-fill, quick order creation
- Handler Function: `handleTemplateChange()`

**Template Change Logic:**
```javascript
function handleTemplateChange() {
  // Sync current article state
  syncNewOrderArticleContentState();
  
  // Get selected template value
  const templateName = document.getElementById('newOrderTemplateSelect').value;
  
  // Load template data and hydrate form
  if (templateName) {
    const templateData = loadTemplate(templateName);
    hydrateNewOrderFormFromTemplate(templateData);
  }
}
```

**Button Handler:**
```javascript
manageTemplatesBtn.addEventListener('click', (event) => {
  event.preventDefault();
  window.showOrderTemplateBuilderModal();
});
```

---

#### Section 4: Dates

##### Field 4.1: Deadline (Date Input)

```
Field Name:              deadline
Field Type:              Date Input
Required:                Yes ✓
Input Type:              date
Min Date:                Today (implicit)
Max Date:                None
Style:                   50% width (grid: 1fr 1fr)
Border Color:            #ead7c2 (focus: #c48b5a)
Font Size:               13px
Padding:                 8px 12px
Border Radius:           6px
Grid Position:           Left column (2-column grid)
Date Format:             YYYY-MM-DD (HTML5 date picker)
```

**Mapping:**
- Form Field: `newOrderForm[name="deadline"]`
- Form Data Key: `deadline`
- Order Property: `newOrder.deadline`
- Database Field: `orders.deadline`
- Used In: SLA tracking, scheduling, notifications

**Validation Logic:**
```javascript
if (!data.deadline || data.deadline === '') {
  errors.push('Deadline is required');
}

// Ensure deadline is not in past (optional)
const deadlineDate = new Date(data.deadline);
if (deadlineDate < new Date()) {
  errors.push('Deadline cannot be in the past');
}
```

---

##### Field 4.2: Sample Delivery (Date Input)

```
Field Name:              sampleDelivery
Field Type:              Date Input
Required:                No
Input Type:              date
Min Date:                Today (implicit)
Max Date:                None
Style:                   50% width (grid: 1fr 1fr)
Border Color:            #ead7c2 (focus: #c48b5a)
Font Size:               13px
Padding:                 8px 12px
Border Radius:           6px
Grid Position:           Right column (2-column grid)
Date Format:             YYYY-MM-DD (HTML5 date picker)
```

**Mapping:**
- Form Field: `newOrderForm[name="sampleDelivery"]`
- Form Data Key: `sampleDelivery`
- Order Property: `newOrder.sampleDelivery` (empty string if not provided)
- Database Field: `orders.sampleDelivery`
- Used In: Logistics tracking, sample management, delivery scheduling

**Validation Logic:**
```javascript
// Optional field, no validation required
// Default to empty string if not provided
newOrder.sampleDelivery = data.sampleDelivery || '';
```

---

#### Section 5: Description & Instructions

##### Field 5.1: Brief Description (Textarea)

```
Field Name:              brief
Field Type:              Textarea
Required:                Yes ✓
Placeholder:             "Provide detailed instructions for the content creation..."
Rows:                    2 (expandable)
Max Length:              2000 characters (soft limit)
Resize:                  Vertical only
Style:                   Full width
Border Color:            #ead7c2 (focus: #c48b5a)
Font Size:               13px
Padding:                 8px 12px
Border Radius:           6px
Font Family:             System default (not monospace)
```

**Mapping:**
- Form Field: `newOrderForm[name="brief"]`
- Form Data Key: `brief`
- Order Property: `newOrder.brief`
- Database Field: `orders.brief` / `orders.shootBrief`
- Used In: Photographer instructions, creative direction, order context

**Validation Logic:**
```javascript
if (!data.brief || data.brief.trim().length === 0) {
  errors.push('Brief description is required');
}

// Optional length validation
if (data.brief.length > 2000) {
  errors.push('Brief description cannot exceed 2000 characters');
}
```

---

##### Field 5.2: Activity (Text Input)

```
Field Name:              activity
Field Type:              Text Input
Required:                No
Label:                   "Activity"
Placeholder:             "e.g., Summer Campaign"
Max Length:              100 characters
Input Type:              text
Autocomplete:            off
Style:                   Full width
Border Color:            #ead7c2 (focus: #c48b5a)
Font Size:               13px
Padding:                 8px 12px
Border Radius:           6px
```

**Mapping:**
- Form Field: `newOrderForm[name="activity"]`
- Form Data Key: `activity`
- Order Property: `newOrder.activity`
- Database Field: `orders.activity`
- Used In: Campaign tagging, analytics, reporting

**Validation Logic:**
```javascript
const activityInput = (formData.get('activity') || '').trim();

// Optional field
newOrder.activity = activityInput || '';

if (activityInput.length > 100) {
  errors.push('Activity cannot exceed 100 characters');
}
```

---

#### Section 6: Article Numbers (EAN/GTIN)

##### Field 6.1: Article Numbers - EAN/GTIN (Textarea)

```
Field Name:              articles
Field Type:              Textarea (Monospace)
Required:                Yes ✓
Label:                   "Article Numbers (EAN/GTIN)" + 📦 Icon
Placeholder:             "Scan or enter article numbers here (one per line)...
                         Example:
                         5901234567890
                         5901234567891"
Rows:                    5
Max Length:              Per line: 50+ characters
Resize:                  Vertical only
Style:                   50% width (grid: 1fr 1fr)
Border Color:            #ead7c2 (focus: #c48b5a)
Font Size:               13px
Padding:                 8px 12px
Border Radius:           6px
Font Family:             'Courier New', monospace (barcode-like)
Input Event:             oninput="handleNewOrderArticlesInput()"
Help Text:               "💡 Tip: You can scan barcodes directly into the left field. Match names on the right line-by-line."
```

**Mapping:**
- Form Field: `newOrderForm[name="articles"]`
- DOM Element ID: `newOrderArticles`
- Form Data Key: `articles`
- Order Property: `newOrder.articles` (array of normalized articles)
- Database Field: `orders.articles`
- Used In: Inventory linking, product tracking, article management

**Input Processing:**
```javascript
// Raw input from textarea
const rawArticlesValue = (formData.get('articles') || '').toString();

// Split into lines and normalize
let articleEntries = Array.isArray(newOrderArticleContentState)
  ? newOrderArticleContentState.map((entry, index) => {
      const base = buildArticlePayloadFromRaw(entry.raw, index);
      if (entry.articleName) {
          base.name = entry.articleName;
      }
      return {
        ...base,
        contentType: entry.contentType || DEFAULT_ARTICLE_CONTENT_TYPE,
        combinedPhoto: entry.combinedPhoto || '',
        shotType: entry.shotType || '',
        sourceLine: entry.raw
      };
    })
  : [];

// Fallback if state not available
if (!articleEntries.length && rawArticlesValue.trim()) {
  const fallbackLines = rawArticlesValue
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  articleEntries = fallbackLines.map((line, index) => {
    const base = buildArticlePayloadFromRaw(line, index);
    return {
      ...base,
      contentType: DEFAULT_ARTICLE_CONTENT_TYPE,
      combinedPhoto: '',
      shotType: '',
      sourceLine: line
    };
  });
}
```

**Validation Logic:**
```javascript
if (!articleEntries.length) {
  alert('⚠️ Please add at least one article before creating the order.');
  event.preventDefault();
  return;
}
```

**Article Normalization:**
```javascript
function buildArticlePayloadFromRaw(raw, index) {
  const fallbackName = `Article ${index + 1}`;
  let normalized = null;

  if (typeof createNormalizedArticle === 'function') {
    try {
      normalized = createNormalizedArticle(raw);
    } catch (error) {
      console.warn('[Orders] Unable to normalize article payload', raw, error);
    }
  }

  if (normalized) {
    return {
      name: normalized.name || fallbackName,
      ean: normalized.ean || '',
      articleNumber: normalized.articleNumber || '',
      variant: normalized.variant || '',
      quantity: normalized.quantity ?? '',
      status: normalized.status || '',
      notes: normalized.notes || '',
      combinedPhoto: normalized.combinedPhoto || '',
      fileName: normalized.fileName || ''
    };
  }

  const manual = parseArticleString(raw);
  return {
    name: manual.name || fallbackName,
    ean: manual.ean || '',
    articleNumber: manual.articleNumber || '',
    variant: '',
    quantity: '',
    status: '',
    notes: '',
    combinedPhoto: '',
    fileName: ''
  };
}
```

---

##### Field 6.2: Article Names - Optional (Textarea)

```
Field Name:              articleNames
Field Type:              Textarea (Monospace)
Required:                No
Label:                   "Article Names (Optional)"
Placeholder:             "Enter article names here (one per line)...
                         Example:
                         Organic Coffee
                         Green Tea"
Rows:                    5
Max Length:              Per line: 100 characters
Resize:                  Vertical only
Style:                   50% width (grid: 1fr 1fr)
Border Color:            #ead7c2 (focus: #c48b5a)
Font Size:               13px
Padding:                 8px 12px
Border Radius:           6px
Font Family:             'Courier New', monospace
Input Event:             oninput="handleNewOrderArticlesInput()"
```

**Mapping:**
- Form Field: `newOrderForm[name="articleNames"]`
- DOM Element ID: `newOrderArticleNames`
- Form Data Key: `articleNames`
- Article Property: Merged into `articles[i].name` (if provided)
- Database Field: `orders.articles[i].name`
- Used In: Display labeling, search results, order clarity

**Processing Logic:**
```javascript
// Names are synchronized with article list
const nameLines = [];

newOrderArticleContentState.forEach((article, index) => {
  const nameLine = resolveDraftArticleName(article, rawLine);
  nameLines.push(nameLine);
  
  // Merge name into article entry
  if (nameLine) {
    articleEntries[index].name = nameLine;
  }
});
```

**Synchronization:**
- Line count must match article numbers (1:1 mapping)
- Names are optional (empty lines allowed)
- Handled by `handleNewOrderArticlesInput()` function

---

### Article Content Type Configurator

##### Field 6.3: Article Content Type Configuration (Dynamic)

```
Container ID:            articleContentTypeConfigurator
Type:                    Dynamic HTML (Generated at runtime)
Visibility:              Shown after articles are added
Placement:               Below article textareas
Margin Top:              12px
```

**Dynamic Content:**
- Displays a section for each article
- Each article gets a content type selector
- Allows per-article configuration of:
  - Content Type (Photo, Video, etc.)
  - Combined Photo flag
  - Shot Type

---

## Field Validation & Logic

### Validation Strategy

#### Pre-Submission Validation

| Field | Type | Required | Validation Rule | Error Message |
|-------|------|----------|-----------------|----------------|
| Title | String | Yes | Min 3 chars | Title must be at least 3 characters |
| Cost Center | Select | Yes | Not empty | Cost center is required |
| Purchase Group | Select | Yes | Not empty | Purchase group is required |
| Method | Select | Yes | Not empty | Production method is required |
| Deadline | Date | Yes | Valid date | Deadline is required |
| Brief | String | Yes | Not empty | Brief description is required |
| Articles | Array | Yes | At least 1 | At least one article is required |
| Sample Delivery | Date | No | Valid date if provided | Invalid date |
| Activity | String | No | Max 100 chars | Activity cannot exceed 100 characters |

---

### Real-Time Input Handlers

#### handleNewOrderArticlesInput()

```javascript
function handleNewOrderArticlesInput() {
  // Sync article state from textareas to internal state
  syncNewOrderArticleContentState();
  
  // This function is called on:
  // - Article field input event
  // - Article name field input event
  // - Form initialization
  // - Template change
}
```

**Purpose:**
- Syncs textarea values to `newOrderArticleContentState`
- Prevents article list desynchronization
- Called frequently during user input

---

#### handleArticleFieldChange(index, field, value)

```javascript
function handleArticleFieldChange(index, field, value) {
  if (!newOrderArticleContentState[index]) {
    return;
  }

  const nextValue = (value || '').trim();
  
  if (field === 'contentType') {
     newOrderArticleContentState[index].contentType = 
       nextValue || DEFAULT_ARTICLE_CONTENT_TYPE;
  } else {
     newOrderArticleContentState[index][field] = nextValue;
  }
}
```

**Parameters:**
- `index`: Article number (0-based)
- `field`: Field name (contentType, combinedPhoto, shotType, etc.)
- `value`: New value from input

---

#### syncNewOrderArticleContentState()

```javascript
// Internal function (not exposed to window)
function syncNewOrderArticleContentState() {
  // 1. Get raw article input
  const articleField = document.getElementById('newOrderArticles');
  const nameField = document.getElementById('newOrderArticleNames');
  
  // 2. Parse lines
  const rawLines = articleField ? 
    articleField.value.split('\n').map(l => l.trim()) : [];
  const nameLines = nameField ? 
    nameField.value.split('\n').map(l => l.trim()) : [];
  
  // 3. Update internal state
  newOrderArticleContentState = rawLines
    .filter(Boolean)
    .map((raw, index) => ({
      raw,
      articleName: nameLines[index] || '',
      contentType: 
        (newOrderArticleContentState[index]?.contentType) || 
        DEFAULT_ARTICLE_CONTENT_TYPE,
      combinedPhoto: 
        (newOrderArticleContentState[index]?.combinedPhoto) || '',
      shotType: 
        (newOrderArticleContentState[index]?.shotType) || ''
    }));
}
```

---

## Form Functions & Handlers

### Core Functions

#### 1. showNewOrderModal(orderToEdit)

**Purpose:** Opens the create/edit order modal

**Parameters:**
- `orderToEdit` (optional): Existing order object to edit

**Flow:**
```
1. Check if modal already exists (toggle behavior)
   ├─ If yes: Close and return
2. Close any other open right-side modals
3. Create modal DOM element
4. Determine mode (create vs edit)
5. Generate title & subtitle based on mode
6. Render form HTML into modal
7. Populate template options
8. Set up event listeners
9. Hydrate form if editing
10. Initialize article state
11. Animate modal in
12. Focus first input field
```

**Code Location:** [fallback-bundle.js:11978-12203]

**Key Variables:**
- `isEditing`: Boolean flag for create vs edit mode
- `modalTitle`: Dynamic title text
- `modalSubtitle`: Dynamic subtitle text
- `draftButtonLabel`: "Save Draft" or "Update Draft"

---

#### 2. handleNewOrderSubmit(event)

**Purpose:** Process form submission (Draft or Submit)

**Parameters:**
- `event`: Form submission event

**Flow:**
```
1. Prevent default form submission
2. Get form data (FormData API)
3. Determine submission action (draft vs submit)
4. Parse existing order (if editing)
5. Process article entries
6. Validate required fields
7. Build complete order object
8. Generate order number (if new)
9. Set status & timestamps
10. Store order (via OrderStore or fallback)
11. Sync to localStorage
12. Show success message
13. Close modal
```

**Key Logic:**
```javascript
// Determine action
const submissionAction = String(formData.get('submissionAction') || 'draft').toLowerCase();
const isSubmitAction = submissionAction === 'submit';

// Set status based on action
const resolvedStatus = isSubmitAction ? 'Submitted' : 'Not submitted';
const resolvedPhotoStatus = isSubmitAction ? 'New Request' : 'Not submitted';

// Check for existing articles
if (!articleEntries.length) {
  alert('⚠️ Please add at least one article before creating the order.');
  return;
}

// Generate order number
const orderNumber = existingOrderNumber || window.generateNextOrderNumber();

// Create order object
const newOrder = {
  ...(existingOrder || {}),
  orderNumber,
  title: formData.get('title'),
  method: formData.get('method'),
  deadline: formData.get('deadline'),
  articles: articleEntries,
  status: resolvedStatus,
  costCenter: formData.get('costCenter'),
  purchaseGroup: formData.get('purchaseGroup'),
  // ... additional fields
};
```

**Code Location:** [fallback-bundle.js:12230-12400]

---

#### 3. closeNewOrderModal()

**Purpose:** Close the modal cleanly

**Flow:**
```
1. Get modal element by ID
2. Remove ESC key event listener (if attached)
3. Animate modal out (translateX -100%)
4. Remove from DOM after animation (250ms)
5. Clear form state
```

**Code Location:** [fallback-bundle.js:12211-12227]

---

#### 4. hydrateNewOrderFormFromOrder(order)

**Purpose:** Populate form fields from existing order (edit mode)

**Parameters:**
- `order`: Existing order object

**Fields Populated:**
- Title
- Cost Center
- Purchase Group
- Method
- Deadline
- Sample Delivery
- Brief
- Activity
- Articles (split into numbers and names)

**Code Location:** [fallback-bundle.js:11926-11975]

---

#### 5. populateOrderTemplateOptions(selectEl)

**Purpose:** Populate template dropdown from template system

**Parameters:**
- `selectEl`: Select element to populate

**Process:**
```
1. Get custom templates from storage
2. Create "Standard Templates" optgroup
3. Add BASE_ORDER_TEMPLATES options
4. If custom templates exist:
   ├─ Create "Custom Templates" optgroup
   └─ Add custom template options
```

**Code Location:** [fallback-bundle.js:11297-11320]

---

#### 6. handleTemplateChange()

**Purpose:** Process when user selects a template

**Flow:**
```
1. Sync current article state
2. Get selected template name
3. Load template data
4. Hydrate form from template
5. Update article list
```

**Code Location:** [fallback-bundle.js:11449]

---

### Helper Functions

#### buildArticlePayloadFromRaw(raw, index)

**Purpose:** Convert raw input string to article object

**Parameters:**
- `raw`: String input from textarea
- `index`: Article position (for fallback naming)

**Returns:** Normalized article object

**Logic:**
```javascript
1. Try to use createNormalizedArticle() if available
2. Fallback to parseArticleString()
3. Return article payload with:
   - name
   - ean
   - articleNumber
   - variant
   - quantity
   - status
   - notes
   - combinedPhoto
   - fileName
```

**Code Location:** [fallback-bundle.js:11390-11427]

---

#### window.generateNextOrderNumber()

**Purpose:** Generate sequential order number

**Logic:**
```javascript
1. Find max order number from existing orders
2. Increment by 1
3. Return as string
```

**Returns:** String (e.g., "100001")

**Code Location:** [fallback-bundle.js:5969-5983]

---

## Data Mapping & Transformation

### Form Data → Order Object Mapping

#### Complete Field Mapping Table

| Form Field | FormData Key | Order Property | Type | Notes |
|-----------|-----------|-----------|------|-------|
| Title Input | `title` | `order.title` | String | Required, user-facing name |
| Cost Center | `costCenter` | `order.costCenter` | String | Budget allocation |
| Purchase Group | `purchaseGroup` | `order.purchaseGroup` | Number | Coerced from string to int |
| Production Method | `method` | `order.method` | String | Vendor routing |
| Deadline | `deadline` | `order.deadline` | String | ISO date format |
| Sample Delivery | `sampleDelivery` | `order.sampleDelivery` | String | Optional, logistics tracking |
| Brief | `brief` | `order.brief` | String | Photographer instructions |
| Activity | `activity` | `order.activity` | String | Campaign tagging |
| Articles | `articles` | `order.articles` | Array | Article objects |
| Article Names | `articleNames` | `articles[i].name` | String | Optional naming |
| Submission Action | `submissionAction` | `order.status` | String | "draft" → "Not submitted", "submit" → "Submitted" |

---

### Order Object Structure (Post-Submission)

```javascript
const newOrder = {
  // Unique Identifiers
  orderNumber: "100001",                          // Auto-generated
  orderId: undefined,                             // Optional UUID
  
  // Basic Information
  title: "Premium Product Photography Session",   // Required
  description: undefined,                         // Optional description
  notes: undefined,                               // Optional notes
  brief: "Produce high-quality product photos",   // Required
  
  // Business Classification
  costCenter: "90500512 Bilka Marketing",          // Required
  purchaseGroup: 101,                             // Required (number)
  method: "Photo Box",                            // Required (vendor)
  activity: "Summer Campaign",                    // Optional
  
  // Scheduling
  deadline: "2025-03-15",                         // Required date
  sampleDelivery: "2025-03-10",                   // Optional date
  shootDate: undefined,                          // For scheduling
  
  // Status & Workflow
  status: "Submitted",                           // "Submitted" or "Not submitted"
  photoStatus: "New Request",                    // "New Request" or "Not submitted"
  orderType: "PO",                               // Purchase order type
  priority: undefined,                           // low|medium|high|urgent
  
  // Assignments & Metadata
  photographer: undefined,                       // Assigned photographer
  createdBy: "John Doe",                         // Current user name
  createdDate: "2/11/2025",                      // LocalizedDate
  createdAt: "2025-02-11T14:30:00.000Z",        // ISO timestamp
  updatedAt: "2025-02-11T14:30:00.000Z",        // Last update
  assignedTo: undefined,                         // Team member
  
  // Content & Articles
  articles: [                                    // Required array
    {
      name: "Organic Coffee",
      ean: "5901234567890",
      articleNumber: "ART-001",
      variant: "",
      quantity: "",
      status: "",
      notes: "",
      combinedPhoto: "",
      fileName: "",
      contentType: "Photo",
      shotType: "",
      sourceLine: "5901234567890"
    }
  ],
  
  // Production Configuration
  contentType: undefined,
  combinedPhoto: undefined,
  shotType: undefined,
  postProduction: undefined,
  
  // Communication & Tracking
  comments: [],                                  // Empty on creation
  commentCount: 0,                               // Number of comments
  deliverables: [                                // Default deliverables
    "Product Photos",
    "High-Resolution Images"
  ],
  
  // Media & Attachments
  images: [],                                    // Order images
  photoReference: null,                          // Optional reference photo
  
  // Additional Metadata
  tags: [],                                      // Optional tags
  eventId: undefined,                            // Event reference
  location: undefined,                           // Shoot location
  shootLocation: undefined,                      // Shoot location
  shootBrief: undefined,                         // Editing within brief
  
  // System Fields
  tacticType: undefined,
  tactic: undefined,
  purchaseGroups: [101],                        // User's available groups
  orderOwner: "John Doe",                       // Order creator/owner
};
```

---

### Transformation Functions

#### ParseArticleString(raw)

**Purpose:** Parse raw article input string

**Input:** "5901234567890" or "ART-001 Organic Coffee"

**Output:**
```javascript
{
  name: "Organic Coffee" or "Article 1",
  ean: "5901234567890" or "",
  articleNumber: "ART-001" or "",
  // ... other fields
}
```

---

## State Management

### Internal State Variables

#### newOrderArticleContentState

**Type:** Array of article objects

**Structure:**
```javascript
newOrderArticleContentState = [
  {
    raw: "5901234567890",              // Original input line
    articleName: "Organic Coffee",      // User-provided name
    contentType: "Photo",               // photo|video|etc
    combinedPhoto: false,               // Boolean flag
    shotType: "packshot"                // Shot classification
  },
  // ... more articles
];
```

**Purpose:**
- Maintains article state during form editing
- Synced with textarea inputs
- Preserves metadata (contentType, shotType, etc.)

**Reset Function:**
```javascript
function resetNewOrderArticleContentState() {
  newOrderArticleContentState = [];
}
```

---

### Modal Lifecycle

```
Modal Lifecycle:
┌─ showNewOrderModal() called
│  ├─ Check existing modal (toggle behavior)
│  ├─ Create DOM element
│  ├─ Render HTML
│  ├─ Populate options
│  ├─ Setup event listeners
│  └─ Animate in (translateX 0)
│
├─ User interaction (form filling)
│  ├─ Input/change events fired
│  ├─ handleNewOrderArticlesInput() called
│  ├─ syncNewOrderArticleContentState() updates state
│  └─ Form validation (real-time)
│
├─ User clicks "Save Draft" or "Submit Order"
│  ├─ Form validation
│  ├─ handleNewOrderSubmit() called
│  ├─ Order object created
│  ├─ Order stored (OrderStore or fallback)
│  ├─ localStorage synced
│  ├─ Success message shown
│  └─ closeNewOrderModal() called
│
└─ Modal closes
   ├─ Remove ESC listener
   ├─ Animate out (translateX -100%)
   ├─ Remove from DOM
   └─ State cleared
```

---

## User Workflows

### Workflow 1: Creating a New Order

```
START
  ↓
USER: Click "Create Order" button
  ↓
showNewOrderModal() triggered
  ↓
Modal opens (right-side slide-in)
  ↓
FORM DISPLAY:
- Title: "Create New Photo Order"
- All fields empty
- Templates dropdown populated
- First field focused (title)
  ↓
USER: Fill order title
  ├─ Minimum 3 characters
  ├─ Real-time validation
  └─ [OK]
  ↓
USER: Select Cost Center
  └─ [OK - Not empty]
  ↓
USER: Select Purchase Group
  └─ [OK - Not empty]
  ↓
USER: Select Production Method
  └─ [OK - Not empty]
  ↓
USER: (Optional) Select Template
  ├─ Form auto-fills with template data
  └─ [OK]
  ↓
USER: Select Deadline date
  └─ [OK - Valid date]
  ↓
USER: (Optional) Select Sample Delivery date
  └─ [OK]
  ↓
USER: Enter Brief Description
  ├─ Detailed instructions
  ├─ Required field
  └─ [OK]
  ↓
USER: (Optional) Enter Activity
  └─ [Campaign name, max 100 chars]
  ↓
USER: Enter Article Numbers (EAN/GTIN)
  ├─ One per line (monospace textarea)
  ├─ Auto-formatting
  ├─ At least 1 required
  └─ [OK]
  ↓
USER: (Optional) Enter Article Names
  ├─ One per line (must match article count)
  └─ [OK]
  ↓
USER: Review all fields
  ↓
USER: Click "Submit Order"
  ├─ submissionAction = "submit"
  └─ handleNewOrderSubmit() called
  ↓
VALIDATION:
  ├─ All required fields populated? ✓
  ├─ At least one article? ✓
  └─ No errors? ✓
  ↓
ORDER CREATION:
  ├─ Generate order number (auto-increment)
  ├─ Set status = "Submitted"
  ├─ Set photoStatus = "New Request"
  ├─ Normalize articles
  ├─ Add metadata (timestamps, creator, etc.)
  └─ ORDER OBJECT CREATED
  ↓
STORAGE:
  ├─ Store via OrderStore.upsert() OR
  ├─ Append to window.rkhOrders array
  └─ Sync to localStorage
  ↓
USER FEEDBACK:
  ├─ Alert: "✅ Order "Title" submitted!"
  ├─ Display: "Order Number: 100001"
  └─ Modal closes
  ↓
END - Order created with "Submitted" status
```

---

### Workflow 2: Editing an Existing Draft Order

```
START
  ↓
USER: Click Edit icon on draft order
  ↓
showNewOrderModal(existingOrder) triggered
  ↓
Modal opens (right-side slide-in)
  ↓
FORM DISPLAY:
- Title: "Edit Draft Photo Order"
- Subtitle: "Draft order {ORDER_NUMBER} · Update details..."
- All fields hydrated from existing order
- Button: "Update Draft" (instead of "Save Draft")
  ↓
hydrateNewOrderFormFromOrder(order) runs:
  ├─ title ← order.title
  ├─ costCenter ← order.costCenter
  ├─ purchaseGroup ← order.purchaseGroup
  ├─ method ← order.method
  ├─ deadline ← order.deadline
  ├─ sampleDelivery ← order.sampleDelivery
  ├─ brief ← order.brief
  ├─ activity ← order.activity
  ├─ articles textarea ← order.articles (formatted)
  ├─ articleNames textarea ← order.articles[i].name
  └─ newOrderArticleContentState ← populated
  ↓
USER: Modify field (e.g., deadline)
  ├─ Change date
  └─ Real-time validation
  ↓
USER: Modify articles (add/remove)
  ├─ Add new article number
  ├─ handleNewOrderArticlesInput() syncs
  └─ newOrderArticleContentState updates
  ↓
USER: Click "Update Draft"
  ├─ submissionAction = "draft"
  └─ handleNewOrderSubmit() called
  ↓
VALIDATION:
  ├─ All required fields still valid? ✓
  └─ At least one article? ✓
  ↓
ORDER UPDATE:
  ├─ Existing order found by orderNumber
  ├─ Merge updated fields into order
  ├─ Preserve: orderNumber, createdBy, createdAt, comments
  ├─ Update: status (remains "Not submitted")
  ├─ Set: updatedAt (current timestamp)
  └─ UPDATED ORDER OBJECT CREATED
  ↓
STORAGE:
  ├─ Store via OrderStore.upsert() (replaces) OR
  ├─ Find and replace in window.rkhOrders array
  └─ Sync to localStorage
  ↓
USER FEEDBACK:
  ├─ Alert: "✅ Order "Title" updated as draft!"
  ├─ Display: "Order Number: 100001"
  └─ Modal closes
  ↓
END - Order updated, still in draft status
```

---

### Workflow 3: ESC Key Press

```
START
  ↓
MODAL OPEN
  ↓
USER: Press ESC key
  ↓
ESC KEY HANDLER TRIGGERED:
  ├─ event.key === 'Escape'
  └─ closeNewOrderModal() called
  ↓
MODAL CLOSE PROCESS:
  ├─ Get modal element (ID: newOrderRightModal)
  ├─ Remove ESC key event listener from document
  ├─ Animate out: translateX(-100%)
  ├─ Wait 250ms for animation
  ├─ Remove modal from DOM
  ├─ Clear form state
  └─ Reset article state
  ↓
END - Modal closed, form state cleared
```

---

### Workflow 4: Template Selection

```
START - Modal open
  ↓
USER: Open Template dropdown
  ↓
DROPDOWN DISPLAY:
  ├─ Standard Templates (optgroup)
  │  ├─ "Two Image Packshot"
  │  ├─ "Lifestyle Hero"
  │  └─ ... etc
  ├─ Custom Templates (optgroup)
  │  ├─ "My Recipe Template"
  │  ├─ "Product Series"
  │  └─ ... user templates
  └─ Select option
  ↓
USER: Select "Two Image Packshot"
  ↓
CHANGE EVENT TRIGGERED:
  └─ handleTemplateChange() called
  ↓
TEMPLATE APPLICATION:
  ├─ Sync current article state
  ├─ Load template data from storage
  ├─ Hydrate form from template:
  │  ├─ title ← template.recipe
  │  ├─ costCenter ← template.costCenter
  │  ├─ method ← template.method
  │  ├─ articles ← template.articles (pre-filled)
  │  └─ ... all other fields
  ├─ Update article state
  └─ Display updates automatically
  ↓
USER: Can now modify template data
  ├─ Add/remove articles
  ├─ Change dates
  └─ Override any field
  ↓
END - Template merged, ready for submission
```

---

## Error Handling

### Error Types & Handling

#### Type 1: Validation Errors

**Trigger:** User clicks "Submit" or "Save Draft" with missing/invalid data

**Handler:**
```javascript
function handleNewOrderSubmit(event) {
  event.preventDefault();
  
  // Validate required fields
  if (!articleEntries.length) {
    alert('⚠️ Please add at least one article before creating the order.');
    return;  // Prevent submission
  }
  
  // Continue with submission only if valid
  // ...
}
```

**User Feedback:**
- Modal alert: `alert('⚠️ [Error message]')`
- Modal remains open for correction
- Form state preserved

---

#### Type 2: Storage Errors

**Trigger:** localStorage not available or quota exceeded

**Handler:**
```javascript
try {
  if (typeof localStorage !== 'undefined') {
    const snapshot = (typeof window.resolveOrdersSnapshot === 'function') 
      ? window.resolveOrdersSnapshot() 
      : window.rkhOrders;
    localStorage.setItem('photoOrders', JSON.stringify(snapshot));
  }
} catch (storageError) {
  console.warn('New order storage sync failed', storageError);
  // Order still created in-memory, but not persisted
}
```

**User Feedback:**
- Warning logged to console
- User doesn't see error (order created in-memory)
- Graceful fallback to memory storage

---

#### Type 3: Article Normalization Errors

**Trigger:** Article parsing fails

**Handler:**
```javascript
let normalized = null;
if (typeof createNormalizedArticle === 'function') {
  try {
    normalized = createNormalizedArticle(raw);
  } catch (error) {
    console.warn('[Orders] Unable to normalize article payload', raw, error);
    // Fallback to manual parsing
    normalized = null;
  }
}

// Fallback to manual parsing
if (!normalized) {
  const manual = parseArticleString(raw);
  // Use manual result
}
```

**User Feedback:**
- Neither - error silently falls back to manual parsing
- Article still processed correctly
- Error logged for debugging

---

## Accessibility & UX

### Keyboard Navigation

#### Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `Tab` | Move to next field | Standard form navigation |
| `Shift+Tab` | Move to previous field | Standard form navigation |
| `Escape` | Close modal | Modal open |
| `Enter` | Submit form | In button (with type="submit") |

#### Focus Management

- Initial focus: Title field (when modal opens)
- Focus trapped: Within modal when open
- Focus restoration: Returns to trigger element on close

---

### ARIA & Semantic HTML

```html
<!-- Form with proper semantic structure -->
<form id="newOrderForm" onsubmit="handleNewOrderSubmit(event)">
  <!-- Hidden inputs for state -->
  <input type="hidden" id="newOrderSubmissionAction" name="submissionAction">
  <input type="hidden" id="newOrderExistingOrderNumber" name="existingOrderNumber">
  
  <!-- Form fields with labels -->
  <div>
    <label for="titleInput">Order Title</label>
    <input id="titleInput" name="title" type="text" required>
  </div>
  
  <!-- Semantic button types -->
  <button type="button" onclick="closeNewOrderModal()">Cancel</button>
  <button type="submit">Save Draft</button>
  <button type="submit" onclick="setSubmissionAction('submit')">Submit Order</button>
</form>
```

---

### Color Contrast & Visual Hierarchy

#### Text Contrast Ratios

| Element | Foreground | Background | Ratio |
|---------|-----------|-----------|-------|
| Label | #4b3b2a | #fdf4e6 | 8.2:1 ✓ |
| Placeholder | #999 | #fff | 4.5:1 ✓ |
| Subtitle | rgba(107,84,64,0.78) | #f2e4d2 | 4.1:1 |
| Button text | #fff | #c48b5a | 5.3:1 ✓ |

---

### Responsive Design

#### Breakpoints

| Breakpoint | Width | Behavior |
|----------|-------|----------|
| Desktop | 550px+ | Full width modal (fixed) |
| Tablet | 480-550px | Modal width = screen - navigation |
| Mobile | <480px | Full screen modal (100vw) |

---

## Integration Points

### Dependencies

#### Internal Dependencies

- **OrderStore**: `window.__orderStoreInstance`
- **Auth System**: `authSystem.getCurrentUser()`
- **Template System**: `getCustomOrderTemplates()`, `BASE_ORDER_TEMPLATES`
- **Article Service**: `createNormalizedArticle()`, `parseArticleString()`
- **Order Utils**: `assignSalesOrgToOrder()`, `ensureOrderPhotoMetadata()`

#### External Integration

- **localStorage API**: For persistence
- **Date Input**.toLocaleDateString(): For date formatting
- **FormData API**: For form serialization

---

### Related Features

#### Features That Trigger Modal

1. **Create Order Button** (Sidebar/Dashboard)
2. **Edit Order** (Context menu on existing order)
3. **Scanner Integration** (Opens modal with pre-filled article)
4. **Template Quick Apply** (Opens modal with template data)

#### Features Triggered By Modal

1. **Order Store Update** (Persists order)
2. **Notifications** (Success/creation event)
3. **Analytics** (Tracks order creation)
4. **Audit Log** (Records order creation)

---

### API Mappings

#### Order Creation→ Storage

```
handleNewOrderSubmit()
  ↓
Build newOrder object
  ↓
OrderStore.upsert(newOrder)  ← Primary
  OR
window.rkhOrders.push(newOrder)  ← Fallback
  ↓
localStorage.setItem('photoOrders', JSON.stringify(orders))
```

#### Order Update → Storage

```
handleNewOrderSubmit()  [EDIT MODE]
  ↓
Find existing order by orderNumber
  ↓
Merge updated fields
  ↓
OrderStore.upsert(updatedOrder)  ← Replace existing
  OR
window.rkhOrders[index] = updatedOrder  ← Fallback
  ↓
localStorage.setItem('photoOrders', JSON.stringify(orders))
```

---

## Testing Checklist

### Functional Tests

- [ ] Modal opens when "Create Order" clicked
- [ ] Modal displays correct title for create vs edit
- [ ] All 12 form fields render correctly
- [ ] Form focus starts on title field
- [ ] Title field requires minimum 3 characters
- [ ] Articles field requires at least 1 entry
- [ ] "Save Draft" creates order with "Not submitted" status
- [ ] "Submit Order" creates order with "Submitted" status
- [ ] Order number auto-generates sequentially
- [ ] ESC key closes modal
- [ ] Cancel button closes modal
- [ ] Form data persists when editing draft
- [ ] Success message displays correct order number
- [ ] Modal closes after successful creation
- [ ] Articles parse and normalize correctly
- [ ] Template selection populates form
- [ ] Template button opens template builder
- [ ] Deadline field shows date picker
- [ ] Sample Delivery field optional
- [ ] Activity field has 100 char limit

### UX Tests

- [ ] Modal animation smooth (0.3s)
- [ ] Form fields have clear focus states
- [ ] Placeholder text helpful and clear
- [ ] Labels readable (12px, color contrast 8.2:1)
- [ ] Buttons easily clickable (28px minimum)
- [ ] Scrolling smooth on long forms
- [ ] Form layout responsive on tablet/mobile
- [ ] Color scheme consistent with CCP branding
- [ ] Error messages clear and actionable

### Integration Tests

- [ ] Order persists in OrderStore
- [ ] Order syncs to localStorage
- [ ] Order visible in orders list after creation
- [ ] Scanner integration pre-fills article field
- [ ] Template system integrates correctly
- [ ] Audit log records order creation
- [ ] Notifications sent on submission
- [ ] Real-time validation works on all fields

---

## Appendices

### Appendix A: Sample Order Output (JSON)

```json
{
  "orderNumber": "100001",
  "title": "Premium Product Photography Session",
  "costCenter": "90500512 Bilka Marketing",
  "purchaseGroup": 101,
  "method": "Photo Box",
  "deadline": "2025-03-15",
  "sampleDelivery": "2025-03-10",
  "brief": "Produce high-quality product photography for spring collection. Focus on macro detail shots and lifestyle contexts.",
  "activity": "Summer Campaign",
  "articles": [
    {
      "name": "Organic Coffee",
      "ean": "5901234567890",
      "articleNumber": "COFFEE-001",
      "variant": "",
      "quantity": "",
      "status": "",
      "notes": "",
      "combinedPhoto": "",
      "fileName": "",
      "contentType": "Photo",
      "shotType": "packshot",
      "sourceLine": "5901234567890"
    },
    {
      "name": "Green Tea",
      "ean": "5901234567891",
      "articleNumber": "TEA-001",
      "variant": "",
      "quantity": "",
      "status": "",
      "notes": "",
      "combinedPhoto": "",
      "fileName": "",
      "contentType": "Photo",
      "shotType": "lifestyle",
      "sourceLine": "5901234567891"
    }
  ],
  "status": "Submitted",
  "photoStatus": "New Request",
  "orderType": "PO",
  "createdBy": "John Doe",
  "createdDate": "2/11/2025",
  "createdAt": "2025-02-11T14:30:00.000Z",
  "updatedAt": "2025-02-11T14:30:00.000Z",
  "comments": [],
  "deliverables": [
    "Product Photos",
    "High-Resolution Images"
  ],
  "images": [],
  "tags": []
}
```

---

### Appendix B: Color Reference Guide

```
CCP Brand Colors:
├─ Primary Brown: #c48b5a (warm, inviting)
├─ Light Cream: #fdf4e6 (background)
├─ Medium Cream: #f2e4d2 (form background)
├─ Dark Brown: #4b3b2a (text)
├─ Border Brown: #ead7c2 (borders, inputs)
├─ Medium Brown: #6b5440 (secondary buttons)
├─ Light Brown: rgba(107,84,64,0.78) (subtitles)
├─ Error Red: #ef4444 (errors, close)
└─ Focus: #c48b5a (input focus states)
```

---

### Appendix C: Keywords for Image Annotations

When adding supporting images to this user story, annotate:

1. **Modal Header Section**
   - Logo placement (top-left)
   - Title and subtitle positioning
   - Close button (top-right)

2. **Form Section 1: Order Information**
   - Order Title field
   - Label styling (12px brown)
   - Placeholder text visibility

3. **Form Section 2: Business Details**
   - Cost Center dropdown (left column)
   - Purchase Group dropdown (right column)
   - Production Method dropdown
   - Two-column grid layout

4. **Form Section 3: Template & Dates**
   - Template dropdown with "+ Template" button
   - Deadline date picker
   - Sample Delivery date picker

5. **Form Section 4: Articles**
   - Article Numbers textarea (left, monospace)
   - Article Names textarea (right, monospace)
   - Help tip text ("💡 Tip: You can scan...")
   - Two-column layout

6. **Form Section 5: Actions**
   - Cancel button (left)
   - Save Draft button (center)
   - Submit Order button (right)
   - Button styling and hover states

7. **Modal Animation**
   - Closed state (off-screen left)
   - Open state (on-screen, animated)
   - Animation timing (0.3s cubic-bezier)

---

**End of Document**

**Version History:**
- v1.0.0 (Feb 11, 2025): Initial comprehensive specification

**Contributors:**
- Technical Documentation
- Product Specification
- UX Design Reference

**Last Reviewed:** February 11, 2025
