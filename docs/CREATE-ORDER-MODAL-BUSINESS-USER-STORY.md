# Create Order Modal - Business User Story

## Story Overview

**JIRA ID:** ORD-001-MODAL  
**Title:** Create and Manage Photo Orders Through Modal Interface  
**Type:** User Story  
**Epic:** Order Management System  
**Sprint:** Q1 2025  
**Status:** Ready for Development  
**Priority:** High  
**Assignee:** Product Team  

---

## User Story Statement

**As a** content manager or photographer  
**I want to** create new photo orders or update existing draft orders using a dedicated interface  
**So that** I can efficiently submit order requests with all required details and specifications, streamlining the photo production workflow

---

## Business Context

The Create Order Modal provides a centralized interface for users to initiate photo order requests. Whether creating a new order from scratch or continuing with a draft order, users need a clear, organized way to input order details, specify products, and choose delivery preferences. The modal supports two types of submissions—saving as draft for later completion or submitting for immediate processing.

---

## Acceptance Criteria

### AC-001: Modal Opens and Displays Correctly
- When a user clicks "Create Order", edits an existing draft, or copies an existing order, the modal appears as a right-side panel
- Modal title changes based on context:
  - **Create mode:** "Create New Photo Order"
  - **Edit mode:** "Edit Draft Photo Order" with order identifier
  - **Copy mode:** "Copy Photo Order" with order identifier being copied
- Modal closes cleanly when user clicks Close button, Cancel button, or presses ESC key

### AC-002: All Form Fields Are Present and Properly Labeled
- Modal displays all 12 required and optional form fields
- Each field has a clear label describing its purpose
- Required fields are visually indicated
- Fields are organized in logical groups by business function

### AC-003: User Can Input Order Title
- Field accepts text input for the order title
- Minimum 3 characters required
- Title represents the business name or order reference
- Error message displays if title is too short or missing

### AC-004: User Can Select Cost Center
- Dropdown provides 9 predefined department/cost center options
- Selection determines budget allocation and departmental ownership
- Cost center is required for financial tracking
- All departments should be selectable:
  - Bilka Marketing
  - Føtex Marketing
  - BR
  - Chilled, Meat & Poultry
  - Electronic & Garden
  - Home & Leisure
  - Netto Marketing
  - Product Data Governance
  - Textile

### AC-005: User Can Select Purchase Group
- Dropdown provides 6 predefined purchase group options
- Each group represents a product category
- Purchase group is required for inventory and vendor routing
- Available groups:
  - Petfood
  - Coffee/Tea
  - Groceries
  - Confectionary
  - Dry Food
  - Frozen

### AC-006: User Can Select Production Method
- Dropdown provides 4 production method options
- Selection determines which vendor/facility produces the photos
- Production method is required for task routing
- Available methods:
  - Photo Box
  - M&B
  - GILS
  - MERRILD

### AC-007: User Can Select Order Template
- Optional template dropdown provides both standard and custom templates
- Templates pre-fill form fields to speed up order creation
- A "+ Template" button allows users to create and manage custom templates
- Selecting a template populates relevant fields automatically

### AC-008: User Can Set Order Deadline
- Date picker allows selection of required delivery/completion date
- Deadline is required for all orders
- Users can select any future date
- Deadline drives SLA tracking and scheduling

### AC-009: User Can Set Sample Delivery Date (Optional)
- Optional date picker for when sample products should be delivered
- Separate from main deadline for logistics planning
- Helps with approval and feedback cycles

### AC-010: User Can Enter Brief Description
- Required textarea for detailed instructions about the photography
- Accommodates guidance on photography style, angles, content focus
- Instructions are communicated to photographers for proper execution

### AC-011: User Can Enter Activity/Campaign Name (Optional)
- Optional field to tag order with campaign or project name
- Enables grouping and filtering of related orders
- Supports analytics and reporting by campaign

### AC-012: User Can Specify Article Numbers
- Required textarea accepts article/product numbers (EAN, GTIN, internal codes)
- One article per line for clarity
- Field supports barcode scanning for quick data entry
- At least one article must be provided to create an order

### AC-013: User Can Add Article Names (Optional)
- Optional textarea to specify product names or descriptions
- One name per line, matching article numbers above
- Improves clarity and reduces confusion during order fulfillment

### AC-014: User Can Save Order as Draft
- "Save Draft" button preserves the order without final submission
- Draft orders retain "Not submitted" status
- Users can edit and update drafts before final submission
- Draft data persists in the system for later retrieval

### AC-015: User Can Submit Order for Processing
- "Submit Order" button sends order for immediate processing
- Submitted orders marked with "Submitted" status
- Photo production team receives notification
- Order number automatically generated for tracking

### AC-016: Order Numbers Are Auto-Generated
- System automatically assigns unique, sequential order numbers
- Each new order gets the next number in sequence
- Order numbers enable tracking and reference throughout the workflow

### AC-017: Form Validation Prevents Incomplete Orders
- System validates all required fields before allowing submission
- User receives clear error messages if required fields are missing
- Modal remains open so user can correct errors
- Only complete orders can be submitted

### AC-018: User Can Edit Existing Draft Orders
- Modal displays all existing values when editing a draft
- All fields auto-populate with current data
- User can modify any field
- "Update Draft" button saves changes without requiring resubmission

### AC-019: User Receives Confirmation After Order Creation
- Success message displays order number after creation
- Confirmation indicates whether order is draft or submitted
- Modal closes automatically after confirmation
- User can verify order in order list

### AC-020: Modal Preserves Form State During Editing
- All entered data persists if user needs to make multiple edits
- Articles remain visible and editable
- User can make incremental changes without losing data

### AC-021: User Can Copy Existing Photo Orders
- User can copy any existing photo order (draft or submitted status)
- Copy action opens Create Order modal in "Copy" mode
- Modal pre-fills with all data from source order EXCEPT:
  - Order Title: cleared and ready for new title input
  - Deadline: cleared and ready for new deadline
  - Sample Delivery Date: cleared and ready for new date
- The following fields auto-populate from source order:
  - Cost Center
  - Purchase Group
  - Production Method
  - Brief Description
  - Activity/Campaign Name
  - Article Numbers
  - Article Names
  - Order Template (if applicable)

### AC-022: Copied Orders Create New Order Records
- When submitting a copied order, system creates entirely new order record
- New order receives new unique order number (not same as source)
- New order has "Submitted" or "Not submitted" status based on user action
- Source order remains unchanged
- New order is independent and can be modified separately

---

## Field Specifications & Business Logic

### Section 1: Order Information

#### Field: Order Title
**Type:** Text Input  
**Required:** Yes  
**Business Purpose:** Unique identifier and business reference for the order  
**Business Rules:**
- Minimum 3 characters (prevents accidental submissions)
- Represents the photography session or product group
- Used in notifications and order lists for quick identification
- Examples: "Spring Product Photography", "Q1 Promotional Campaign"

**Validation Logic:**
- System checks that title is not empty
- System validates minimum character count
- System displays error if validation fails

---

### Section 2: Business Classification

#### Field: Cost Center
**Type:** Dropdown Selection  
**Required:** Yes  
**Business Purpose:** Assigns order to specific department for budget allocation and accountability  
**Available Options (9):**
- 90500512 Bilka Marketing
- 90200512 Føtex Marketing
- 90510512 BR
- 90880220 Chilled, Meat & Poultry
- 90870390 Electronic & Garden
- 90870330 Home & Leisure
- 90700572 Netto Marketing
- 90880110 Product Data Governance
- 90740310 Textile

**Business Rules:**
- Every order must be assigned to exactly one cost center
- Cost center determines budget allocation
- Used for departmental reporting and financial tracking
- Selection impacts order routing and approval workflows

**Validation Logic:**
- System requires selection from dropdown
- System rejects empty or null selections
- System displays error if no selection made

---

#### Field: Purchase Group
**Type:** Dropdown Selection  
**Required:** Yes  
**Business Purpose:** Categorizes order by product type for inventory management and vendor selection  
**Available Options (6):**
- 101 - Petfood
- 102 - Coffee/Tea
- 103 - Groceries
- 104 - Confectionary
- 105 - Dry Food
- 106 - Frozen

**Business Rules:**
- Every order must be associated with exactly one purchase group
- Purchase group determines inventory routing
- System uses this to pull related product data
- Impacts which vendors can fulfill the order

**Validation Logic:**
- System requires selection from dropdown
- System validates that selection is a valid purchase group
- System rejects null or missing selections

---

#### Field: Production Method
**Type:** Dropdown Selection  
**Required:** Yes  
**Business Purpose:** Designates which production vendor/facility will execute the photography  
**Available Options (4):**
- Photo Box
- M&B
- GILS
- MERRILD

**Business Rules:**
- Every order assigned to exactly one production method
- Production method determines task routing and SLA expectations
- Different vendors have different capabilities and timelines
- Affects cost and quality standards

**Validation Logic:**
- System requires selection from dropdown
- System validates vendor availability
- System rejects empty selections

---

### Section 3: Templates & Planning

#### Field: Order Template
**Type:** Dropdown Selection with Action Button  
**Required:** No  
**Business Purpose:** Accelerates order creation using pre-configured templates with standard settings  
**Template Types:**
- **Standard Templates:** System-provided templates for common order types
- **Custom Templates:** User-created templates based on previous successful orders

**Business Rules:**
- Templates are optional—users can create orders without templates
- Selecting a template auto-fills form with template data
- Users can override template values after selection
- Template button allows management of custom templates

**Validation Logic:**
- System validates that selected template exists
- System checks template data for completeness
- Template data merges with any user-entered data

**Template Application Logic:**
- When template selected, system retrieves template configuration
- System populates applicable form fields with template values
- User can then modify any fields as needed
- Template selection does not lock any fields

---

### Section 4: Scheduling & Delivery

#### Field: Deadline
**Type:** Date Selection  
**Required:** Yes  
**Business Purpose:** Specifies when completed photography must be delivered or finalized  
**Business Rules:**
- Every order must have a deadline
- Deadline drives production scheduling and SLA tracking
- Deadline should be realistic for selected production method
- Used for priority determination and resource allocation

**Validation Logic:**
- System requires valid date selection
- System validates that deadline exists
- System optionally checks that deadline is not in the past

**Process Impact:**
- Production team uses deadline for scheduling work
- SLA timers calculated from deadline
- Overdue orders trigger notifications

---

#### Field: Sample Delivery Date
**Type:** Date Selection  
**Required:** No  
**Business Purpose:** Specifies when sample products should be delivered for approval before final production  
**Business Rules:**
- Optional field for orders requiring sample review
- Sample delivery typically precedes main deadline
- Enables approval cycle before full production
- Supports quality control and feedback integration

**Validation Logic:**
- System accepts any valid date if provided
- No validation if field left empty

---

### Section 5: Instructions & Guidelines

#### Field: Brief Description
**Type:** Text Area  
**Required:** Yes  
**Business Purpose:** Detailed instructions and creative direction for the photography  
**Business Rules:**
- Every order must include executive brief
- Brief communicates photography style, focus areas, constraints
- Brief explains what final photos should convey
- Directly impacts photography quality and brand alignment

**Content Examples:**
- Photography style (product-focused, lifestyle, documentary)
- Specific angles or perspectives required
- Color scheme or branding guidelines
- Special handling or safety considerations

**Validation Logic:**
- System requires non-empty brief
- System validates that brief exists before allowing submission

---

#### Field: Activity/Campaign Name
**Type:** Text Input  
**Required:** No  
**Business Purpose:** Tags order as part of specific marketing campaign or project  
**Business Rules:**
- Optional field for campaign tracking
- Enables grouping of related orders
- Supports analytics and reporting by campaign
- Improves order context and searchability

**Validation Logic:**
- System accepts any text if provided
- Optional field—no validation required if empty

---

### Section 6: Product Specification

#### Field: Article Numbers (EAN/GTIN)
**Type:** Multi-Line Text Area  
**Required:** Yes  
**Business Purpose:** Specifies which products require photography  
**Business Rules:**
- At least one article number must be provided per order
- Accepts industry-standard codes: EAN, GTIN, internal article numbers
- One article per line for clarity
- Supports barcode scanning for rapid data entry

**Input Methods:**
- Manual typing of article codes
- Barcode scanning (reads code directly into field)
- Copy/paste from inventory systems

**Processing:**
- System normalizes and validates article codes
- System links articles to product database for enrichment
- System prevents duplicate article entries

**Validation Logic:**
- System requires at least one article
- System rejects submission if article field empty
- Error message: "At least one article is required"

---

#### Field: Article Names (Optional)
**Type:** Multi-Line Text Area  
**Required:** No  
**Business Purpose:** Provides clear product names/descriptions for articles  
**Business Rules:**
- Optional field for improved clarity
- One name per line (must match article count)
- Names line up 1:1 with article numbers above
- Reduces confusion if article codes are not self-explanatory

**Usage:**
- Photographers reference names while shooting
- Names appear in order documentation
- Improves searchability and reporting

**Validation Logic:**
- Optional field—no validation required
- System accepts any text if provided
- Systems allows blank lines if some products unnamed

---

## Form Functions & User Interactions

### Function 1: Open Modal
**When Triggered:** User clicks "Create Order" button or Edit option on existing draft  
**What Happens:**
1. Modal appears as slide-in panel from right side
2. Modal displays appropriate title and instructions based on context
3. All form fields display with clear labels and placeholders
4. Optional fields clearly marked as optional
5. First field (Title) receives focus for immediate input

**User Experience:**
- Smooth animation during modal opening
- All fields immediately visible and accessible
- Modal positioned to not block critical content
- User can easily see previous work while referencing modal

---

### Function 2: Populate Template
**When Triggered:** User selects option from Template dropdown  
**What Happens:**
1. System retrieves selected template configuration
2. System fills form fields with template values
3. Fields populate with standard information from template
4. User can immediately see what was auto-filled
5. User can modify or override any value

**User Experience:**
- Quick population saves significant data entry time
- Template values appear as guideline, not requirement
- User retains full control to customize further
- No values become locked or unchangeable

---

### Function 3: Save as Draft
**When Triggered:** User clicks "Save Draft" button and all required fields are valid  
**What Happens:**
1. System validates all required fields
2. System checks that at least one article is provided
3. System creates order record with "Draft" status
4. System preserves exact values user entered
5. System assigns unique order number
6. System stores order in persistent storage
7. System displays success message with order number
8. Modal closes automatically

**User Experience:**
- Clear confirmation that order was saved
- Order number provided for future reference
- User can immediately access order to edit or complete
- No data loss—everything saved exactly as entered

**Business Rules:**
- Draft orders remain in "Not submitted" status
- Drafts can be edited multiple times
- Drafts do not trigger production team notifications
- Draft orders preserved indefinitely until deleted

---

### Function 4: Submit Order
**When Triggered:** User clicks "Submit Order" button and all required fields are valid  
**What Happens:**
1. System validates all required fields
2. System checks that at least one article is provided
3. System creates order record with "Submitted" status
4. System assigns unique order number
5. System records submission timestamp
6. System records user who submitted order
7. System stores order in persistent storage
8. System notifies production team of new order
9. System displays success message with order number
10. Modal closes automatically

**User Experience:**
- Clear confirmation that order was submitted
- Order number provided for tracking and reference
- Immediate visibility that submission was successful
- Production team begins work on order

**Business Rules:**
- Submitted orders trigger workflow notifications
- Photo production team receives assignment
- Order appears in active work queue
- Photo status changes to "New Request"

---

### Function 5: Edit Existing Draft
**When Triggered:** User clicks Edit button on existing draft order  
**What Happens:**
1. System loads existing draft order
2. Modal opens in "Edit" mode with appropriate title
3. All form fields populate with existing values
4. System displays order number being edited
5. User can modify any field
6. User can add or remove articles
7. System maintains original order number

**User Experience:**
- No data re-entry required—all values pre-filled
- User can focus on what needs changing
- Clear indication of which order being edited
- Familiar form interface, just with existing data

**Validation:**
- All validations still apply
- Required fields still must be completed
- At least one article still required

---

### Function 6: Cancel Order Entry
**When Triggered:** User clicks "Cancel" button or presses ESC key  
**What Happens:**
1. System checks if form has data
2. If no data or confirm discard: Modal closes immediately
3. All unsaved data discarded
4. System returns to previous view

**User Experience:**
- Quick exit if user changes mind
- No complicated confirmation dialogs
- Data lost only if user intentionally cancels
- ESC key provides standard web behavior

---

### Function 7: Copy Existing Order
**When Triggered:** User clicks "Copy" button on any existing photo order (draft or submitted)  
**What Happens:**
1. System loads source order data
2. Modal opens in "Copy" mode with title "Copy Photo Order [Order Number]"
3. System populates fields with source order data EXCEPT:
   - Order Title: cleared (user must enter new title)
   - Deadline: cleared (user must specify new deadline)
   - Sample Delivery Date: cleared (user can optionally set new date)
4. These fields auto-populate from source order:
   - Cost Center (same department budget allocation)
   - Purchase Group (same product category)
   - Production Method (same vendor/facility)
   - Brief Description (same photography instructions)
   - Activity/Campaign Name (same campaign if applicable)
   - Article Numbers (same products to photograph)
   - Article Names (same product descriptions)
   - Order Template (if source order used template)
5. User reviews pre-filled data and makes any desired adjustments
6. User enters new Order Title
7. User enters new Deadline
8. User optionally enters new Sample Delivery Date
9. User clicks "Submit Order" or "Save Draft"
10. System validates all required fields
11. System creates NEW order record with all user-entered data
12. NEW order receives unique order number (different from source)
13. System displays success message with new order number
14. Modal closes

**User Experience:**
- Significant time savings when creating similar orders
- No manual re-entry of complex fields (cost center, articles, brief descriptions)
- Only customizes the time-sensitive and title fields
- Source order remains completely unchanged
- New order is independent and fully editable

**Business Rules:**
- Copy operation available for all existing orders (draft, submitted, completed)
- Copy creates entirely new order, not a duplicate reference
- Source order data is never modified by copy operation
- New order gets complete validation applied
- New order can be saved as draft or submitted immediately

---

## Data Requirements & Field Mappings

### Business Data Relationships

#### How Fields Connect to Business Processes

**Order Title + Cost Center + Purchase Group**
- Together these identify the order in financial systems
- Cost Center routes to correct budget
- Purchase Group determines product category
- Used for billing and expense tracking

**Production Method + Deadline**
- Production Method determines vendor and SLA
- Deadline sets completion expectation
- Together used for capacity planning and scheduling

**Articles + Brief Description**
- Articles specify what products need photos
- Brief explains how those products should be photographed
- Together form complete production specification

**Activity + Cost Center**
- Activity tags order for campaign tracking
- Cost Center tags order for budget tracking
- Together provide complete order context

#### Sample Complete Order

When user creates order with following inputs:

**User Enters:**
- Title: "Spring Product Photography"
- Cost Center: "Bilka Marketing"
- Purchase Group: "Groceries"
- Method: "Photo Box"
- Deadline: March 15, 2025
- Sample Delivery: March 10, 2025
- Brief: "Produce high-quality product photos showing packaging and contents"
- Activity: "Spring Campaign"
- Articles: "5901234567890, 5901234567891"
- Article Names: "Organic Coffee, Green Tea"

**System Creates Order Record Containing:**
- Order Number: 100001 (auto-generated)
- All user-entered values preserved exactly
- Status: "Submitted" (if submitted) or "Not submitted" (if draft)
- Assignment: Routed to Photo Box facility
- Photo Status: "New Request"
- Created Date/Time: Current timestamp
- Created By: Current user name
- Notifications: Sent to Photo Box production team

---

## Business Validation Rules

### Required Field Validation

| Field | Requirement | Business Reason | Error Handling |
|-------|-------------|-----------------|----------------|
| Order Title | Minimum 3 characters | Prevents accidental empty/minimal submissions | Error message displays, form stays open |
| Cost Center | Must select one | Every order needs budget allocation | Error message displays, form stays open |
| Purchase Group | Must select one | Determines product category and routing | Error message displays, form stays open |
| Production Method | Must select one | Determines vendor and SLA | Error message displays, form stays open |
| Deadline | Must specify date | Required for scheduling and SLA | Error message displays, form stays open |
| Brief Description | Cannot be empty | Photographers need clear direction | Error message displays, form stays open |
| Articles | At least one required | Order must specify what products to photograph | Error message displays, form stays open |

### Optional Fields
- Sample Delivery Date: Can be omitted if not needed
- Article Names: Can be omitted if article numbers are self-explanatory
- Activity/Campaign: Can be omitted if no campaign tagging needed
- Template: Can be omitted, user can enter data manually

---

## User Workflows

### Workflow 1: Quick Order Creation Using Template

**Business Scenario:** Manager needs to create order for routine product photography using established process

**Steps:**
1. User clicks "Create Order"
2. Modal opens in create mode
3. User selects from Template dropdown (e.g., "Monthly Product Photography")
4. System automatically fills: Cost Center, Purchase Group, Method, Brief
5. User enters: Title, Deadline, Articles
6. User optionally selects Sample Delivery date
7. User clicks "Submit Order"
8. System validates, creates order, notifies production team
9. Modal closes, success message displays
10. User can immediately see order in queue

**Time Saved:** ~5 minutes compared to manual entry

**Business Value:** Faster order creation, consistent data quality, reduced errors

---

### Workflow 2: Draft Order - Multi-Session Creation

**Business Scenario:** Manager starts order but needs to gather additional information; returns later to complete

**Steps:**
1. User clicks "Create Order"
2. Modal opens in create mode
3. User enters available information: Title, Cost Center, Purchase Group
4. User runs out of time or information
5. User clicks "Save Draft"
6. System stores everything, assigns order number, closes modal
7. **[Next day]** User clicks Edit on that draft
8. Modal reopens with all previous values pre-filled
9. User adds: Brief, Articles, completes Deadline
10. User clicks "Submit Order"
11. System validates, creates final order, notifies team

**Business Value:** Non-linear order creation, no data loss, flexible workflow

---

### Workflow 3: Order Modification Before Submission

**Business Scenario:** Manager submits order, realizes article needs to be added before production starts

**Steps:**
1. Manager finds draft order in list
2. Clicks Edit
3. Modal reopens showing current data
4. Manager adds additional article number and name
5. Manager clicks "Update Draft"
6. System saves changes
7. Modal closes
8. Order now contains all articles

**Business Value:** Flexibility to correct orders before production starts

---

### Workflow 4: Rapid Order Creation via Barcode Scanning

**Business Scenario:** Inventory manager has physical products and needs to create order quickly

**Steps:**
1. User clicks "Create Order"
2. Modal opens, user enters Title and selects Cost Center/Purchase Group
3. User switches to Article field
4. User scans product barcode using barcode scanner
5. Barcode automatically enters into Article field
6. User scans second product barcode
7. System parses both article numbers, normalizes them
8. User manually enters Article Names if desired
9. User selects Production Method and Deadline
10. User enters Brief describing photography requirements
11. User clicks "Submit Order"
12. Order created with all scanned articles

**Business Value:** Minimal data entry, fast processing, reduced errors

---

### Workflow 5: Copying Previous Orders for Similar Requests

**Business Scenario:** Manager created successful product photography order last month; now needs similar photos for same products but with end-of-month deadline

**Steps:**
1. Manager finds existing photo order in order list (e.g., Order #100045)
2. Manager clicks "Copy" button on that order
3. Modal opens in "Copy" mode: "Copy Photo Order #100045"
4. System pre-fills all fields from original order:
   - Cost Center: "Bilka Marketing" (pre-filled)
   - Purchase Group: "Groceries" (pre-filled)
   - Production Method: "Photo Box" (pre-filled)
   - Brief Description: "Produce high-quality product photos showing packaging and contents" (pre-filled)
   - Articles: "5901234567890, 5901234567891" (pre-filled)
   - Article Names: "Organic Coffee, Green Tea" (pre-filled)
   - Activity: "Spring Campaign" (pre-filled)
5. Cleared fields ready for new input:
   - Order Title: blank (ready for "Month-End Coffee Photography")
   - Deadline: blank (ready for new deadline)
   - Sample Delivery Date: blank (optional)
6. Manager enters: Title "Month-End Coffee Photography"
7. Manager enters: Deadline "February 28, 2025"
8. Manager reviews all pre-filled information (no changes needed)
9. Manager clicks "Submit Order"
10. System creates new order #100078 with all from copy source + new title/deadline
11. Modal closes, success message shows new order number
12. Original order #100045 remains unchanged in system

**Time Saved:** ~10 minutes compared to manual entry (no need to re-enter cost center, articles, descriptions, contact info, etc.)

**Business Value:** Accelerates creation of repeat orders, maintains consistency across similar orders, reduces data entry errors

---

## Business Rules & Constraints

### Submission Rules

**Draft Submission:**
- Can save as many drafts as needed
- Draft orders do NOT notify production team
- Drafts can be updated multiple times
- Drafts appear in user's queue

**Final Submission:**
- Can only submit once per order
- Final submission NOTIFIES production team
- Production team receives work assignment immediately
- Order appears in active work queue

### Article Rules

**Article Entry:**
- Zero articles: Cannot create/submit order
- One or more articles: Order is valid for submission
- Article normalization: System accepts various formats (EAN, GTIN, internal codes)
- Line matching: Article names must line up with article numbers (1:1)

### Field Modification Rules

**During Draft Phase:**
- Any field can be modified
- Changes saved independently
- No field modifications trigger notifications

**During Submitted Phase:**
- Order is locked from modal editing
- Cannot modify via Create Order modal
- Modifications only via dedicated Order Edit interface
- Large modifications may require order cancellation and recreation

### Data Persistence Rules

**Draft Orders:**
- Persisted until user submits or deletes
- Survive browser closing
- Survive application restart
- Can be edited months later

**Submitted Orders:**
- Persisted indefinitely
- Read-only via Create Order modal
- Changes tracked in audit log
- Cannot be deleted without admin

### Copy Rules

**Copy Availability:**
- Can copy any existing order regardless of status (draft, submitted, completed)
- Copy button available for all visible orders in lists and detail views
- Copy operation does not require special user permissions

**Copy Behavior:**
- Copy operation creates entirely new order record
- Source order is never modified by copy operation
- New order receives unique order number (sequential, independent of source)
- Copy preserves exact data from source EXCEPT:
  - Order Title: intentionally cleared (requires new title)
  - Deadline: intentionally cleared (requires new deadline)
  - Sample Delivery Date: intentionally cleared (optional for new order)
- All other field values (Cost Center, Purchase Group, Production Method, Articles, Brief, Activity, Template reference) are preserved exactly
- User can modify any field after copy modal opens
- New order has no link/relationship to source order (completely independent)

**Copy Processing:**
- Copied order goes through complete validation (all required fields must be re-entered/confirmed)
- Copied order can be saved as draft or submitted (both options available)
- System does not prevent copying the same order multiple times
- User can create multiple orders from single source order

---

## Success Metrics & Business Outcomes

### Key Performance Indicators

**Adoption:**
- % of orders created via modal vs. other methods
- Avg orders created per day
- Repeat usage rate (users creating multiple orders)

**Efficiency:**
- Average time from order creation to submission
- Ratio of draft saves to final submissions
- Template selection rate
- Copy feature usage rate (% of orders created via copy vs. other methods)
- Time saved per copied order vs. manual entry

**Data Quality:**
- Completeness of required fields
- Error rate during submission
- Article parsing accuracy

**User Satisfaction:**
- Support tickets related to Create Order modal
- Feature request volume
- User feedback sentiment

---

## Related Processes

### Upstream Processes
- Product catalog management (provides article information)
- Department budgeting (defines cost centers)
- Vendor management (determines available production methods)
- Template creation (for template selection)

### Downstream Processes
- Work assignment to production team
- Photography scheduling
- Progress tracking and delivery
- Quality assurance and approval
- Billing and financial reconciliation

---

## Out of Scope

This user story does NOT include:

- Advanced photo asset management
- Detailed invoice or billing creation
- Contract or licensing terms
- High-volume batch order import
- Integration with external ERP systems
- Approval workflows or authorization gates
- Dynamic vendor pricing or quoting
- Multi-language support

---

## Notes for Implementation Team

### Considerations for Development

- Modal should be non-blocking UI element that doesn't prevent other work
- Form data should auto-save periodically to prevent loss
- Article parsing should handle various input formats gracefully
- Template system should be easily maintained without code changes
- Order numbers must remain unique across system restarts
- Success messages should provide clear next steps

### Considerations for QA Testing

- Validate all business rules with boundary cases
- Test draft save/restore cycle thoroughly
- Test article normalization with real product data
- Verify all required field validations
- Test with various screen sizes and browsers
- Verify order data persists correctly

---

## Acceptance Criteria Summary

- [ ] Modal opens and closes properly in all scenarios (Create, Edit, Copy)
- [ ] All 12 form fields display and function correctly
- [ ] Required fields validate and prevent incomplete submissions
- [ ] Optional fields are clearly marked and can be skipped
- [ ] Draft orders save with "Not submitted" status
- [ ] Submitted orders save with "Submitted" status
- [ ] Order numbers auto-generate sequentially
- [ ] Form pre-fills correctly when editing drafts
- [ ] Form pre-fills correctly when copying orders (with title/deadline/sample cleared)
- [ ] Success messages display order number
- [ ] Templates populate form fields correctly
- [ ] Articles normalize properly from various input formats
- [ ] User can cancel at any time without data corruption
- [ ] Copy button available on all existing orders
- [ ] Copied orders create new independent order records
- [ ] Source orders remain unchanged when copied

---

## Sign-Off

**Product Owner:** [To be assigned]  
**Business Analyst:** [To be assigned]  
**Development Lead:** [To be assigned]  

**Created:** February 12, 2026  
**Last Updated:** February 12, 2026 (Updated with Copy Order Feature)  
**Version:** 1.0.1

---

**End of Business User Story**
