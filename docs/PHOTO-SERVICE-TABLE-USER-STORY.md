# Photo Service Table - Business User Story

## Story Overview

**JIRA ID:** TBL-001-PHOTO-SERVICE  
**Title:** Photo Service Orders Display and Management Table  
**Type:** User Story  
**Epic:** Order Management System  
**Sprint:** Q1 2026  
**Status:** Active Development  
**Priority:** High  
**Assignee:** Product Team

---

## User Story Statement

**As a** photo service coordinator or manager  
**I want to** view and interact with a comprehensive table displaying photo service orders with relevant business data and hierarchy  
**So that** I can efficiently track, monitor, and manage photo service orders with their associated product details and metadata

---

## Business Context

The Photo Service Table provides a centralized view for all Photo Service (PS) type orders in the system. Unlike Photo Orders (PO), Photo Service orders represent high-volume photography requests managed through SAP/PMR systems. The table displays parent-child hierarchies where orders contain multiple articles, each with specific photography requirements. The table's column structure adapts based on business needs, hiding/showing fields relevant to Photo Service operations versus Photo Orders.

---

## Table Structure & Business Logic

### Section 1: Parent-Level Order Columns

#### Column: Order Number
**Type:** Text/Link  
**Width:** 140px  
**Business Purpose:** Unique identifier for the order  
**Business Rules:**
- Displays as clickable link to order details
- Links to imageRequestId format (e.g., "IMG-2025-0001")
- Used for order tracking and reference
- Searchable and sortable field

**Data Source:** `order.orderNumber` / `order.imageRequestId`

---

#### Column: Title/Name
**Type:** Text  
**Width:** 220px  
**Business Purpose:** Order title or description  
**Business Rules:**
- Displays user-provided title or auto-generated description
- Truncates long titles with ellipsis
- Hover shows full title in tooltip
- Examples: "Premium Dog Food Hero Shot", "Spring Product Photography"

**Data Source:** `order.title` / `order.offerName`

---

#### Column: Status
**Type:** Badge/Indicator  
**Width:** 120px  
**Business Purpose:** Current order fulfillment status  
**Available Values:**
- New Request (blue badge)
- In Progress (yellow badge)
- Photo Session (orange badge)
- Pending Approval (purple badge)
- Samples Received (green badge)
- Complete (dark green badge)
- Delivered (gray badge)

**Business Rules:**
- Color-coded for quick visual identification
- Shows progression through workflow
- Drives urgency and priority assignment
- Triggers notifications at status changes

**Data Source:** `order.status` / `order.photoStatus`

---

#### Column: Photo Group
**Type:** Text  
**Width:** 100px  
**Business Purpose:** Product/category grouping for this order  
**Business Rules:**
- Displays group designation (e.g., "99", "01")
- Groups similar product types together
- Used for bulk processing and reporting
- Links to purchase group in many cases

**Data Source:** `order.group`

**Visibility Rule:** Shown only for Photo Service orders (order.orderType === 'PS')

---

#### Column: Offer ID
**Type:** Text  
**Width:** 120px  
**Business Purpose:** SAP/PMR offer identifier  
**Business Rules:**
- Alphanumeric identifier from source system
- Links to SAP business requirements
- Used for financial and inventory tracking
- Examples: "10763319", "10763327"

**Data Source:** `order.offerId`

**Visibility Rule:** Shown only for Photo Service orders

---

#### Column: Offer Name
**Type:** Text  
**Width:** 180px  
**Business Purpose:** Marketing-friendly offer name  
**Business Rules:**
- Descriptive name from SAP/PMR
- May differ from order title
- Used in communications and reports
- Truncates with overflow handling

**Data Source:** `order.offerName`

**Visibility Rule:** Shown only for Photo Service orders

---

#### Column: Event ID
**Type:** Text  
**Width:** 100px  
**Business Purpose:** Calendar/event reference for timing  
**Business Rules:**
- Format: Week/Year designation (e.g., "A4025052")
- Identifies promotion/campaign week
- Used for scheduling and SLA tracking
- Drives deadline calculations

**Data Source:** `order.eventId`

---

#### Column: Photographer
**Type:** Text  
**Width:** 140px  
**Business Purpose:** Assigned photographer or production team  
**Business Rules:**
- Name of assigned photographer
- May be empty if not yet assigned
- Shows team member responsible for execution
- Used for workload distribution

**Data Source:** `order.photographer`

---

#### Column: Priority
**Type:** Badge/Tag  
**Width:** 100px  
**Business Purpose:** Urgency level for execution  
**Available Values:**
- Prio 1 (Critical - red)
- Prio 2 (High - orange)
- Prio 3 (Normal - blue)
- Low (gray)

**Business Rules:**
- Derived from order.priority field
- Critical/High map to Prio 1
- Medium/Normal map to Prio 3
- Influences scheduling and resource allocation
- Updates SLA expectations

**Data Source:** `order.priority` → `order.prio`

**Derivation Logic:**
- "Critical" or "High" or "Urgent" → "Prio 1"
- "Medium" or "Normal" → "Prio 3"
- "Low" → "Low"

---

#### Column: Deadline
**Type:** Date  
**Width:** 110px  
**Business Purpose:** Required completion date  
**Business Rules:**
- Shows ISO date or localized format
- Highlighted if approaching/overdue
- Required field for all orders
- Critical for SLA tracking

**Data Source:** `order.deadline`

**Visibility Rule:** Hidden for Photo Service orders (PS)

---

#### Column: Sample Delivery
**Type:** Date  
**Width:** 130px  
**Business Purpose:** Optional sample delivery date  
**Business Rules:**
- Typically precedes main deadline
- Empty if not applicable
- Optional field
- Used for approval cycles

**Data Source:** `order.sampleDelivery`

**Visibility Rule:** Hidden for Photo Service orders (PS)

---

#### Column: Cost Center
**Type:** Text  
**Width:** 150px  
**Business Purpose:** Budget allocation and department  
**Business Rules:**
- Displays code + department name
- Examples: "90500512 Bilka Marketing"
- Determines budget ownership
- Used for financial reporting

**Data Source:** `order.costCenter`

**Visibility Rule:** Hidden for Photo Service orders (PS)

---

#### Column: Purchase Group
**Type:** Text  
**Width:** 120px  
**Business Purpose:** Product category classification  
**Available Values:**
- 101 - Petfood
- 102 - Coffee/Tea
- 103 - Groceries
- 104 - Confectionary
- 105 - Dry Food
- 106 - Frozen

**Business Rules:**
- Determines inventory routing
- Used for vendor selection
- Required for all orders
- Impacts photo requirements

**Data Source:** `order.purchaseGroup`

---

#### Column: Funding
**Type:** Text  
**Width:** 100px  
**Business Purpose:** Budget amount allocated  
**Business Rules:**
- Displays numeric budget value
- Formatted with currency symbol if applicable
- Used for cost tracking
- May affect quality standards

**Data Source:** `order.budget` / `order.funding`

---

#### Column: Principle
**Type:** Text  
**Width:** 100px  
**Business Purpose:** Photography type/approach  
**Available Values:**
- #P 2D (Two-dimensional product)
- #P 3D (Three-dimensional/360°)
- #P Lifestyle (Lifestyle context)
- #P Hero (Main/hero shots)
- #P Detail (Close-up detail shots)

**Business Rules:**
- Guides photographer on shot types
- Determines equipment and setup needs
- Influences timeline and cost
- Critical for visual consistency

**Data Source:** `order.principle`

---

### Section 2: Child-Level Article Row Columns

#### Child Row: Article Number
**Type:** Text  
**Width:** Auto  
**Business Purpose:** Product identifier (EAN/GTIN)  
**Business Rules:**
- Industry-standard code
- Normalizes various formats
- Links to product database
- Required for each article

**Data Source:** `article.articleNumber`

---

#### Child Row: Article Name
**Type:** Text  
**Width:** Auto  
**Business Purpose:** Friendly product name  
**Business Rules:**
- User-provided or auto-populated
- Displayed to photographers
- Used in communications
- Optional field

**Data Source:** `article.articleName` / `article.name`

---

#### Child Row: Photo Group
**Type:** Badge  
**Width:** Auto  
**Business Purpose:** Article's assigned photography group  
**Business Rules:**
- Single letter designation (e.g., "MM", "PP")
- Groups articles for combined shots
- Indicates consolidated photo approach
- Visible in Photo Service context

**Data Source:** `article.photoGroup`

---

#### Child Row: Combined Photo
**Type:** Badge  
**Width:** Auto  
**Business Purpose:** Consolidated shooting designation  
**Business Rules:**
- Two-letter code indicating combined approach
- Example combinations: "CC", "MM", "PP"
- Shows articles shot together
- Visible only for Photo Orders (PO)

**Data Source:** `article.combinedPhoto`

**Visibility Rule:** Shown only for Photo Order (PO) type orders

---

#### Child Row: Content Type
**Type:** Text  
**Width:** Auto  
**Business Purpose:** Type of content/photo  
**Available Values:**
- Photo
- Video
- Lifestyle
- Hero Shot
- Detail Shot
- 360° View
- Lifestyle Scene

**Business Rules:**
- Specifies deliverable format
- Affects shooting requirements
- Optional field
- Visible only for Photo Orders

**Data Source:** `article.contentType`

**Visibility Rule:** Shown only for Photo Order (PO) type orders

---

#### Child Row: DAM Shot Type
**Type:** Text  
**Width:** Auto  
**Business Purpose:** Shot type for Digital Asset Management  
**Available Values:**
- Hero
- Lifestyle
- Detail
- Macro
- 360°
- Lifestyle Scene
- Ingredient Shot

**Business Rules:**
- Categorizes photo for asset library
- Used for DAM organization
- Guides photographers on shot approach
- Visible only for Photo Orders

**Data Source:** `article.shotType`

**Visibility Rule:** Shown only for Photo Order (PO) type orders

---

#### Child Row: Photo Reference
**Type:** Link/Code  
**Width:** Auto  
**Business Purpose:** Reference image or example  
**Business Rules:**
- Links to example photo
- Guides photography style
- Optional but recommended
- Clickable to view reference

**Data Source:** `article.photoReference` / `order.photoReference`

**Visibility Rule:** Shown only for Photo Order (PO) type orders

---

#### Child Row: File Name
**Type:** Text  
**Width:** Auto  
**Business Purpose:** Uploaded file identifier  
**Business Rules:**
- System-generated or user-provided
- Used for file tracking
- Optional field
- Empty if not yet uploaded

**Data Source:** `article.fileName`

**Visibility Rule:** Hidden for Photo Service orders (PS)

---

#### Child Row: Upload Time
**Type:** DateTime  
**Width:** Auto  
**Business Purpose:** When file was uploaded  
**Business Rules:**
- ISO format or localized timestamp
- Shows upload completion
- Optional field
- Used for timeline tracking

**Data Source:** `article.uploadedAt` / `article.uploadedTime`

**Visibility Rule:** Hidden for Photo Service orders (PS)

---

### Section 3: Row Styling & Visual Hierarchy

#### Parent Row Styling
**Background:** Light cream/beige (rgba(245, 240, 235, 0.8))  
**Border:** 1px solid rgba(196, 139, 90, 0.3)  
**Text Color:** #4b3b2a (dark brown)  
**Font Weight:** 600 (bold)  
**Padding:** 12px vertical, 10px horizontal  
**Height:** 56px minimum

**Hover State:**
- Background: rgba(196, 139, 90, 0.08)
- Cursor: pointer
- Shadow: subtle drop shadow

**Status-Based Styling:**
- Override background based on status
- Critical statuses: enhanced visibility
- Color coding matches badge colors

---

#### Child Row Styling
**Background:** Nested panel with lighter shade (rgba(255, 255, 255, 0.8))  
**Border:** 1px solid rgba(196, 139, 90, 0.2)  
**Text Color:** #6b5440 (lighter brown)  
**Font Size:** 11px (smaller than parent)  
**Padding:** 8px vertical, 10px horizontal  
**Indentation:** 20px left margin to show nesting

**Spacing Rules:**
- Child rows display directly below parent
- No gap between parent and child panel
- Multiple children stack vertically
- Collapse/expand functionality optional

---

## Display Modes & Configuration

### Mode 1: Full Photo Service View
**Triggered When:** orderType filter selected = "PS"  
**Visible Columns:**
- Order Number, Title, Status, Photo Group
- Offer ID, Offer Name, Event ID
- Photographer, Priority, Purchase Group, Funding
- Principle, Child rows (Article details)

**Hidden Columns:**
- Cost Center, Deadline, Sample Delivery, Cancel button

**Business Purpose:** Focuses on SAP/PMR order management

---

### Mode 2: Full Photo Order View
**Triggered When:** orderType filter selected = "PO"  
**Visible Columns:**
- Order Number, Title, Status
- Photographer, Priority
- Cost Center, Deadline, Sample Delivery
- Child rows with: Article, Content Type, Shot Type, Photo Reference, File Name, Upload Time

**Hidden Columns:**
- Photo Group, Offer ID, Offer Name, Event ID
- Funding, Principle, Page number

**Business Purpose:** Focuses on custom photo order workflow

---

### Mode 3: Mixed/All Orders View
**Triggered When:** No filter or "All" selected  
**Display Logic:**
- Shows appropriate columns per row based on order type
- Dynamically hides/shows columns per row
- Parent-only view shows both PS and PO rows
- Child rows only display when expanded

**Business Purpose:** Single unified view of all orders

---

## Parent-Child Hierarchy & Relationships

### Relationship: Order → Articles
**Business Logic:**
- One order (parent) contains multiple articles (children)
- Each article has own properties (name, number, content type)
- Shared properties from order (cost center, deadline, budget)
- Each article can have different shot type or combined photo designation

**Display Logic:**
- Parent row shows collapsed state with article count
- Child panel shows all articles for expanded order
- Clicking parent toggles expansion
- Visual indentation shows nesting

**Data Structure:**
```
Order (Parent)
├── Article 1 (Child)
│   ├── articleNumber
│   ├── articleName
│   ├── photoGroup (PS)
│   ├── combinedPhoto (PO)
│   ├── contentType (PO)
│   ├── shotType (PO)
│   └── fileName (PO)
├── Article 2 (Child)
│   └── [...same properties]
└── Article N (Child)
```

---

## Interaction Functions

### Function 1: Expand/Collapse Order
**When Triggered:** User clicks on order row or expand icon  
**What Happens:**
1. System checks current expansion state
2. If collapsed: displays child article panel with all articles
3. If expanded: hides child article panel
4. Visual indicator (arrow/chevron) rotates to show state
5. Row height adjusts to accommodate children

**User Experience:**
- Smooth animation during expand/collapse
- Child articles immediately visible when expanded
- One-click toggle between summary and detail views
- Expansion state persists during session

---

### Function 2: Filter by Order Type
**When Triggered:** User selects "Photo Service" or "Photo Order" filter  
**What Happens:**
1. System filters orders by orderType (PS or PO)
2. Columns dynamically hide/show based on type
3. Table re-renders with appropriate layout
4. Child rows display with type-specific columns
5. Expansion states maintained where applicable

**Business Logic:**
- Photo Service rows show: offerID, offering name, event ID, principle
- Photo Order rows show: cost center, deadline, sample delivery
- Each type optimized for different workflow

---

### Function 3: Sort by Column
**When Triggered:** User clicks on column header  
**What Happens:**
1. System toggles sort direction (ascending/descending)
2. Parent rows re-sort based on column value
3. Child rows remain with their parent during sort
4. Visual indicator shows sort column and direction
5. Sort state persists until changed

**Sortable Columns:**
- Order Number (alphanumeric)
- Title (alphabetic)
- Status (custom order)
- Priority (importance-based)
- Photographer (alphabetic)
- Deadline (date-based)
- Event ID (alphanumeric)
- Offer ID (alphanumeric)

**Non-Sortable Columns:**
- Child row columns (inherit parent sort)

---

### Function 4: Search/Filter Orders
**When Triggered:** User enters search term in search field  
**What Happens:**
1. System searches across searchable fields
2. Filters both parent and child rows
3. Displays matching results
4. Highlights matches if applicable
5. Shows "X results" indicator

**Searchable Fields:**
- Order Number / Image Request ID
- Title / Offer Name
- Photographer name
- Article Number
- Article Name
- Offer ID

**Search Logic:**
- Case-insensitive matching
- Partial matches supported
- Multi-field search (OR logic)
- Real-time results as user types

---

### Function 5: Select Multiple Rows
**When Triggered:** User clicks checkbox or uses Shift+Click  
**What Happens:**
1. System tracks selected parent rows
2. Checkbox state updates visually
3. Bulk action buttons become enabled
4. Count indicator shows "X selected"
5. Selection persists until cleared

**Selection Logic:**
- Clicking parent selects entire order (children not separate)
- Shift+Click selects range
- Ctrl+Click toggles individual
- "Select All" button selects all visible orders

---

### Function 6: Bulk Actions on Selected Orders
**When Triggered:** User selects rows and clicks bulk action  
**What Happens:**
1. System identifies selected orders
2. Action applies to all selected parent orders
3. Progress indicator shows processing status
4. Confirmation shows results
5. Table refreshes with updated data

**Available Bulk Actions:**
- Assign to Photographer
- Change Priority
- Update Status
- Export Selected Orders
- Print Selected Orders
- Delete Multiple (with confirmation)

---

## Column Visibility Configuration

### User Preference Model
**Stored In:** Browser localStorage / User preferences  
**Key:** `tableColumnPreferences_photoService`  
**Structure:**
```json
{
  "visibleColumns": ["orderNumber", "title", "status", "photographer", ...],
  "columnWidths": {"orderNumber": 140, "title": 220, ...},
  "sortColumn": "status",
  "sortDirection": "asc"
}
```

### Column Customization
- Users can hide/show columns via settings menu
- Drag to reorder columns (optional)
- Reset to defaults option
- Preferences persist across sessions

---

## Business Rules & Constraints

### Display Rules

| Aspect | Rule | Reason |
|--------|------|--------|
| Max Rows per Page | 50-100 | Performance, readability |
| Expand All Limit | Max 20 expanded | Performance concern |
| Article Rows | Unlimited per order | Full transparency |
| Column Widths | Min 80px, Max 300px | Usability |
| Child Row Nesting | Single level only | No further nesting |

### Interaction Rules

| Rule | Applies To | Purpose |
|------|-----------|---------|
| Expand toggles one at a time | Orders | Sequential disclosure |
| Sort affects parents only | Parents | Maintains hierarchy |
| Search includes children | Both | Full-text coverage |
| Selection applies parent only | Parents | Bulk operations |
| Filters apply to both | Both | Comprehensive filtering |

---

## Data Synchronization

### Real-Time Updates
**Sources of Changes:**
- Order status updates
- Photo uploads
- Priority changes
- Assignment changes

**Update Mechanism:**
- WebSocket or polling for real-time sync
- Optimistic updates (update UI immediately)
- Reconciliation if sync fails
- "Refreshing..." indicator during update

**Refresh Triggers:**
- Periodic refresh (every 5-10 minutes)
- Manual refresh button
- Window focus event
- Order completion notifications

---

## Accessibility & Performance

### Accessibility Features
- Semantic HTML (table, thead, tbody)
- ARIA labels for column headers
- Keyboard navigation (arrow keys, tab)
- Screen reader optimization
- High contrast mode support

### Performance Optimization
- Virtual scrolling for large datasets (1000+ rows)
- Lazy loading of child rows
- Pagination with "Load More"
- Cached sort/filter results
- Debounced search input

---

## Success Metrics & Business Outcomes

### Key Performance Indicators
- Table load time < 2 seconds
- Child row expansion < 500ms
- Search completion < 300ms
- Sort completion < 1 second
- User task completion rate > 95%

### Business Value
- Faster order discovery and tracking
- Reduced time finding specific orders
- Better visibility into order details
- Improved decision-making with hierarchy view
- Increased operational efficiency

---

## Related Processes

### Upstream Processes
- Order creation via Create Order Modal
- Order import from SAP/PMR systems
- Photo assignment and scheduling

### Downstream Processes
- Individual order detail view
- Order editing and updates
- Mass upload operations
- Export and reporting

---

## Out of Scope

This user story does NOT include:
- Advanced filtering (multi-field, date ranges)
- Custom report generation
- Chart/graph visualizations
- Workflow automation
- Email notifications
- API integrations
- Advanced caching strategies

---

## Notes for Implementation

### Considerations for Development
- Table should handle 10,000+ orders efficiently
- Child rows should lazy-load when expanded
- Styling should match existing design system
- Responsive design for various screen sizes
- Proper keyboard navigation support

### Considerations for QA Testing
- Test expand/collapse with various order counts
- Verify column visibility toggling
- Test sorting with missing data
- Verify search across all fields
- Test bulk operations with edge cases
- Validate real-time sync functionality

---

**Sign-Off**

**Product Owner:** [To be assigned]  
**Business Analyst:** [To be assigned]  
**Development Lead:** [To be assigned]

**Created:** February 17, 2026  
**Last Updated:** February 17, 2026  
**Version:** 1.0.0

---

**End of Photo Service Table User Story**
