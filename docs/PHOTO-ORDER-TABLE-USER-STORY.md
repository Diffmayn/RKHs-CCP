# Photo Order Table - Business User Story

## Story Overview

**JIRA ID:** TBL-002-PHOTO-ORDER  
**Title:** Photo Order Details Display and Management Table  
**Type:** User Story  
**Epic:** Order Management System  
**Sprint:** Q1 2026  
**Status:** Active Development  
**Priority:** High  
**Assignee:** Product Team

---

## User Story Statement

**As a** photographer or production coordinator  
**I want to** view and manage a detailed table showing photo order details with article-level specifications  
**So that** I can efficiently organize my work, track deliverables, and manage photo assets with clear parent-child hierarchy

---

## Business Context

The Photo Order Table (PO) provides a detailed view of Photo Order type requests where custom photography is needed. Unlike Photo Service orders (PS) which are high-volume and SAP-driven, Photo Orders represent individual custom requests with specific article-level photography needs. The table shows a clear parent-child relationship where each order contains articles, and each article can have specific content types, shot types, and file deliverables. The table is optimized for photographers and production teams executing the actual photography work.

---

## Table Structure & Business Logic

### Section 1: Parent-Level Order Columns

#### Column: Order Number
**Type:** Text/Link  
**Width:** 140px  
**Business Purpose:** Unique order identifier  
**Business Rules:**
- Displayed as clickable link to full order details
- Format: "ORD-YYYY-XXXX" (e.g., "ORD-2025-001")
- Used for order tracking and reference
- Sortable and searchable

**Data Source:** `order.orderNumber`

---

#### Column: Title
**Type:** Text  
**Width:** 220px  
**Business Purpose:** Order name or description  
**Business Rules:**
- User-provided title from order creation
- Represents photography session or project
- Truncates long titles with ellipsis
- Full title visible in tooltip on hover
- Examples: "Spring Product Photography", "Premium Dog Food - Hero Shots"

**Data Source:** `order.title`

---

#### Column: Status
**Type:** Badge/Indicator  
**Width:** 120px  
**Business Purpose:** Current order workflow stage  
**Available Values:**
- New Request (blue)
- In Progress (orange)
- Photo Session (purple)
- Pending Approval (yellow)
- Samples Received (light blue)
- Complete (green)
- Delivered (gray)

**Business Rules:**
- Color-coded for visual scanning
- Shows order progression
- Triggers notifications when changing
- Drives urgency assessment
- Impacts photographer scheduling

**Data Source:** `order.status` / `order.photoStatus`

---

#### Column: Photographer
**Type:** Text/Badge  
**Width:** 140px  
**Business Purpose:** Assigned photographer or team  
**Business Rules:**
- Shows person assigned to execute photography
- May be empty if not yet assigned
- Links to photographer profile
- Used for workload visualization
- Optional field (can be unassigned)

**Data Source:** `order.photographer` / `order.assignedTo`

---

#### Column: Priority
**Type:** Badge  
**Width:** 100px  
**Business Purpose:** Urgency/importance level  
**Available Values:**
- Critical (red)
- High (orange)
- Medium (blue)
- Low (gray)

**Business Rules:**
- Set during order creation
- Influences scheduling
- May adjust during workflow
- Affects resource allocation
- Used for SLA tracking

**Data Source:** `order.priority`

---

#### Column: Cost Center
**Type:** Text  
**Width:** 150px  
**Business Purpose:** Department budget allocation  
**Business Rules:**
- Shows code and department name
- Example: "90500512 Bilka Marketing"
- Determines budget owner
- Used for financial reporting
- Required field

**Data Source:** `order.costCenter`

**Visibility Rule:** Shown only for Photo Order (PO) type

---

#### Column: Deadline
**Type:** Date  
**Width:** 110px  
**Business Purpose:** Required completion date  
**Business Rules:**
- Displays in ISO or localized format
- Highlighted if approaching or overdue
- Required for scheduling
- Drives SLA calculations
- Critical for timeline planning

**Data Source:** `order.deadline`

**Visibility Rule:** Shown only for Photo Order (PO) type

---

#### Column: Sample Delivery
**Type:** Date  
**Width:** 130px  
**Business Purpose:** Optional sample photo delivery date  
**Business Rules:**
- Precedes main deadline if provided
- Enables approval/feedback cycle
- Optional field (may be empty)
- Used for quality assurance workflow
- Impacts schedule planning

**Data Source:** `order.sampleDelivery`

**Visibility Rule:** Shown only for Photo Order (PO) type

---

#### Column: Brief Description
**Type:** Text (truncated)  
**Width:** Auto  
**Business Purpose:** Creative direction and instructions  
**Business Rules:**
- Truncates after 150 characters
- Full text visible in tooltip
- Guides photographer on style/approach
- Critical for consistent output
- Examples: "Product-focused, clean background", "Lifestyle context, natural lighting"

**Data Source:** `order.brief` / `order.description`

---

#### Column: Articles Count
**Type:** Counter  
**Width:** 100px  
**Business Purpose:** Number of products in order  
**Business Rules:**
- Shows how many articles must be photographed
- Example display: "3 articles"
- Used for complexity assessment
- Drives timeline estimates
- Required minimum: 1

**Data Source:** `order.articles.length`

---

### Section 2: Child-Level Article Row Columns

#### Child Row: Article Number
**Type:** Text/Link  
**Width:** Auto  
**Business Purpose:** Product identifier (EAN/GTIN/Internal)  
**Business Rules:**
- Industry-standard barcode/product code
- Example: "5901234567890" (EAN)
- Links to product information
- Used for inventory correlation
- Required field

**Data Source:** `article.articleNumber` / `article.ean`

---

#### Child Row: Article Name
**Type:** Text  
**Width:** Auto  
**Business Purpose:** Product name or description  
**Business Rules:**
- User-provided or product database name
- Photographer uses this for reference
- Appears in deliverables documentation
- Examples: "Premium Dog Food 2kg", "Organic Coffee 500g"
- Optional field

**Data Source:** `article.articleName` / `article.name`

---

#### Child Row: Content Type
**Type:** Badge  
**Width:** Auto  
**Business Purpose:** Type of content/format to deliver  
**Available Values:**
- Photo
- Video
- Lifestyle
- Hero Shot
- Detail Shot
- 360° View
- Lifestyle Scene
- Ingredient Shot

**Business Rules:**
- Specifies deliverable format for article
- Affects shooting requirements
- May require different equipment
- Optional field
- Drives photographer's shot list

**Data Source:** `article.contentType`

---

#### Child Row: DAM Shot Type
**Type:** Text/Badge  
**Width:** Auto  
**Business Purpose:** Digital Asset Mgmt shot classification  
**Available Values:**
- Hero
- Lifestyle
- Detail/Macro
- 360°/Full Rotation
- Ingredient
- Lifestyle Context
- Close-up Detail
- Packaging/Branding

**Business Rules:**
- Organizes photos in Digital Asset Management
- Guides camera setup and composition
- Used for asset library searching
- Visible only for Photo Order type
- Critical for photographers

**Data Source:** `article.shotType`

**Visibility Rule:** Shown only for Photo Order (PO) type

---

#### Child Row: Combined Photo
**Type:** Badge  
**Width:** Auto  
**Business Purpose:** Indicates article consolidated with others  
**Format:** Two-letter code (e.g., "CC", "MM", "PP", "VV")  
**Business Rules:**
- Shows which articles are photographed together
- Same code = same photo session/setup
- Reduces total number of photos needed
- Reduces photography time and cost
- Optional field

**Data Source:** `article.combinedPhoto`

**Visibility Rule:** Shown only for Photo Order (PO) type

---

#### Child Row: Photo Reference
**Type:** Link/Image  
**Width:** Auto  
**Business Purpose:** Example photo or style reference  
**Business Rules:**
- Links to reference image if available
- Guides photography style
- May be clickable to view full image
- Optional field
- Enhances photographer understanding

**Data Source:** `article.photoReference` / `order.photoRef`

**Visibility Rule:** Shown only for Photo Order (PO) type

---

#### Child Row: File Name
**Type:** Text  
**Width:** Auto  
**Business Purpose:** Name of uploaded photo file  
**Business Rules:**
- System-generated or photographer-provided
- Used for file organization
- May be empty if not yet uploaded
- Shows which files belong to which article
- Helpful for asset management

**Data Source:** `article.fileName`

**Visibility Rule:** Hidden for Photo Service orders (PS)

---

#### Child Row: Upload Time
**Type:** DateTime  
**Width:** Auto  
**Business Purpose:** When photo was uploaded  
**Business Rules:**
- ISO timestamp or localized format
- Shows upload completion
- Used for timeline tracking
- Optional field
- Empty if not yet uploaded

**Data Source:** `article.uploadedAt` / `article.uploadedTime`

**Visibility Rule:** Hidden for Photo Service orders (PS)

---

### Section 3: Row Styling & Visual Hierarchy

#### Parent Row Styling
**Background:** Light cream (rgba(245, 240, 235, 0.8))  
**Border:** 1px solid rgba(196, 139, 90, 0.3)  
**Text Color:** #4b3b2a (dark brown)  
**Font Weight:** 600 (semibold)  
**Padding:** 12px vertical, 10px horizontal  
**Min Height:** 56px

**Hover State:**
- Background: rgba(196, 139, 90, 0.08)
- Cursor: pointer
- Subtle shadow effect

**Status-Based Styling:**
- Background tint matches status color
- Critical status → red tint
- Complete status → green tint

---

#### Child Row Styling
**Background:** Indented panel, lighter shade (rgba(255, 255, 255, 0.8))  
**Border:** 1px solid rgba(196, 139, 90, 0.2), left border solid 3px  
**Text Color:** #6b5440 (lighter brown)  
**Font Size:** 11px (smaller than parent)  
**Padding:** 8px vertical, 10px horizontal  
**Left Indentation:** 20px

**Visual Indicators:**
- Different background shade shows nesting
- Left border color matches content type badge
- Alternating row backgrounds if multiple children
- Hover shows slight highlight

---

## Display Modes

### Mode 1: Photo Order Full View
**When Shown:** orderType = "PO" selected  
**Visible Columns:**
- Order Number, Title, Status
- Photographer, Priority
- Cost Center, Deadline, Sample Delivery
- Brief Description, Articles Count
- Child rows with full article details

**Hidden Columns:**
- Photo Group, Offer ID, Offer Name
- Event ID, Funding, Principle, Page

**Primary Users:** Photographers, Production Coordinators

---

### Mode 2: Photo Order Summary View
**When Shown:** Limited space or mobile view  
**Visible Columns:**
- Order Number, Title, Status
- Photographer, Priority
- Articles Count
- Child rows (collapsed by default)

**Hidden Columns:**
- All optional columns
- Child rows until expanded

**Primary Use Case:** Quick overview, status monitoring

---

### Mode 3: Photo Order Assignment View
**When Shown:** During photographer assignment workflow  
**Visible Columns:**
- Order Number, Title, Brief Description
- Photographer, Priority
- Deadline, Articles Count
- Child rows showing articles

**Purpose:** Helps assign/reassign photographers with full context

---

## Parent-Child Relationship & Hierarchy

### One-to-Many: Order Contains Articles
**Business Logic:**
- One order (parent) = one photography project
- Multiple articles per order = multiple products to photograph
- Each article has own specifications
- Sharing order-level properties (deadline, photographer, cost center)

**Display Logic:**
- Parent row shows order summary
- Child panel expands to show all articles
- Articles maintain reference to parent
- Editing article updates only that line item

**Data Structure:**
```
PhotoOrder (Parent)
├── Article 1 (Child)
│   ├── articleNumber: "5901234567890"
│   ├── articleName: "Premium Dog Food 2kg"
│   ├── contentType: "Photo"
│   ├── shotType: "Hero"
│   ├── combinedPhoto: "AA"
│   └── fileName: "dog-food-hero.jpg"
├── Article 2 (Child)
│   ├── articleNumber: "5901234567891"
│   ├── articleName: "Premium Dog Food 5kg"
│   ├── contentType: "Photo"
│   ├── shotType: "Lifestyle"
│   ├── combinedPhoto: "OF"
│   └── fileName: "dog-food-lifestyle.jpg"
└── Article 3 (Child)
```

---

## Interaction Functions

### Function 1: Expand/Collapse Order Articles
**When Triggered:** User clicks on order row or expand toggle icon  
**What Happens:**
1. System checks expansion state
2. If collapsed: displays child article panel below parent
3. If expanded: hides child article panel
4. Visual chevron/arrow rotates to show state
5. Expansion state maintained during session

**User Experience:**
- Single click toggles full details view
- Smooth animation during expand/collapse
- All articles visible at once when expanded
- Visual feedback shows current state

---

### Function 2: Filter by Status
**When Triggered:** User selects status from filter dropdown  
**What Happens:**
1. System filters orders matching selected status
2. Only matching parent rows display
3. Child article rows remain visible if parent visible
4. Filter pill shows active filter
5. Result count displays "X matching orders"

**Available Status Filters:**
- All Orders (default)
- New Request
- In Progress
- Photo Session
- Pending Approval
- Delivered
- Complete

---

### Function 3: Sort by Column
**When Triggered:** User clicks column header  
**What Happens:**
1. System toggles sort direction (ascending/descending)
2. Parent rows re-sort based on column value
3. Child rows stay with parent during sort
4. Sort indicator (arrow) shows direction
5. Sort state persists until changed

**Sortable Columns:**
- Order Number
- Title
- Status
- Photographer
- Priority
- Cost Center
- Deadline
- Article Count

---

### Function 4: Search Orders
**When Triggered:** User types in search field  
**What Happens:**
1. System searches multiple fields in real-time
2. Matching parent rows display
3. Matching child articles highlight within matches
4. "X results found" indicator updates
5. Search persists across sort/filter

**Searchable Fields:**
- Order Number
- Title
- Photographer
- Brief Description
- Article Number
- Article Name

**Search Type:** Case-insensitive, partial match supported

---

### Function 5: Bulk Assign Photographer
**When Triggered:** User selects multiple orders and clicks "Assign"  
**What Happens:**
1. User selects multiple parent rows via checkboxes
2. System shows "Assign to Photographer" button
3. User selects photographer from dropdown
4. System updates all selected orders
5. Table refreshes, confirmation shows success count

**User Experience:**
- Checkbox in first column enables selection
- Count indicator shows "X orders selected"
- Assignment dialog opens
- Success message confirms "X orders assigned"

---

### Function 6: View Article Details
**When Triggered:** User clicks on article row within expanded order  
**What Happens:**
1. System opens detailed article modal
2. Shows all article-level specifications
3. Displays uploaded file preview if available
4. Shows edit option for article fields
5. Allows adding comments/notes

**Displayed Information:**
- Article number and name
- Full content type and shot type
- Combined photo designation
- File information (size, upload time)
- Photo reference image
- Edit history

---

### Function 7: Upload File to Article
**When Triggered:** User clicks upload button on article row  
**What Happens:**
1. System opens file selection dialog
2. User selects photo file
3. File uploads and stores with article reference
4. Upload time recorded
5. File list updates showing new file

**Supported Formats:**
- JPG, PNG, TIFF (images)
- MP4, MOV (videos)
- PDF (documentation)
- Max 50MB per file

---

## Business Rules & Constraints

### Validation Rules

| Rule | Applies To | Business Reason |
|------|-----------|-----------------|
| Min 1 article per order | Parent | Cannot photograph nothing |
| Deadline must be future | Parent | Prevents past dates |
| Photographer must exist if assigned | Parent | Prevents invalid assignments |
| Article number required | Child | Must identify product |
| Upload must match article | Child | Prevents wrong file association |

### Data Presentation Rules

| Rule | Applies To | Purpose |
|------|-----------|---------|
| Show articles when expanded | Child | Full transparency |
| Sort by parent only | Parents | Maintain hierarchy |
| Search both levels | Both | Comprehensive results |
| Filter by parent status | Parents | Focused workload view |

---

## Column Visibility & Customization

### Default Visibility (Photo Order View)
- Always shown: Order Number, Title, Status, Photographer, Priority
- Usually shown: Cost Center, Deadline, Brief
- Optional: Sample Delivery
- Child columns: All shown when expanded

### User Customization
**Stored:** Browser localStorage  
**Key:** `tableColumnPreferences_photoOrder`  
**Options:**
- Hide/show optional columns
- Reorder columns via drag-and-drop
- Adjust column widths
- Reset to defaults

**Persisted Across:** Sessions, browser restarts

---

## Real-Time Synchronization

### Update Sources
- Status changes (photographer uploads photos)
- Assignment changes
- Photographer uploads files
- Priority or deadline changes
- Order completion notifications

### Sync Mechanism
- WebSocket for real-time updates (preferred)
- Polling fallback (every 30 seconds)
- Optimistic updates (immediate UI change)
- Reconciliation if sync fails

### User Notifications
- Toast notification for status change
- Row highlight when data changes
- "Refreshing..." indicator during sync
- Conflict resolution if data diverges

---

## Performance & Accessibility

### Performance Targets
- Initial table load: < 2 seconds
- Expand/collapse: < 500ms
- Search response: < 300ms
- Sort operation: < 1 second
- File upload: Visual progress for files > 5MB

### Performance Optimization
- Virtual scrolling for 1000+ rows
- Lazy load child articles
- Debounce search input
- Cache sort/filter results
- Pagination with "Load More" button

### Accessibility
- Semantic HTML table structure
- Keyboard navigation (arrow keys, tab)
- ARIA labels for all interactive elements
- Screen reader optimization
- High contrast support

---

## Success Metrics

### KPIs
- Page load time < 2 seconds
- User task completion > 95%
- Average time to find order < 30 seconds
- Expand/collapse feedback time < 500ms
- Search accuracy > 98%

### Business Outcomes
- Faster order management
- Reduced photographer confusion
- Better file organization
- Improved delivery timelines
- Enhanced quality consistency

---

## Related Components

### Connected User Interfaces
- Create Order Modal (creates orders displayed here)
- Order Detail Modal (full order view)
- Photo Upload Interface (uploads files)
- Photographer Assignment (assigns workers)
- Report Generator (exports table data)

### Integration Points
- Order Service (data source)
- File Service (uploads/downloads)
- Assignment Service (photographer assignment)
- Notification Service (status updates)
- Analytics Service (tracking usage)

---

## Out of Scope

This user story does NOT include:
- Advanced analytics/charting
- Custom report builder
- Multi-order photo batch operations
- AI-powered duplicate detection
- Advanced image recognition
- Predictive deadline warnings
- Third-party integrations

---

## Notes for Implementation

### Development Considerations
- Must handle 10,000+ orders efficiently
- Child rows should lazy-load on expand
- Real-time updates must not block UI
- Responsive design for tablets/mobile
- Proper keyboard navigation essential

### QA Test Scenarios
- Expand/collapse many orders rapidly
- Sort while order data updates in real-time
- Search for various field combinations
- Upload large files and verify progress
- Test with various photographer assignments
- Verify status updates propagate to table

---

**Sign-Off**

**Product Owner:** [To be assigned]  
**Business Analyst:** [To be assigned]  
**Development Lead:** [To be assigned]

**Created:** February 17, 2026  
**Last Updated:** February 17, 2026  
**Version:** 1.0.0

---

**End of Photo Order Table User Story**
