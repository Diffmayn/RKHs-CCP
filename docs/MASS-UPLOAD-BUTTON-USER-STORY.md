# Mass Upload Button - Business User Story

## Story Overview

**JIRA ID:** FTR-003-MASS-UPLOAD  
**Title:** Bulk Image Upload with Automatic Order Matching  
**Type:** User Story  
**Epic:** Order Management System  
**Sprint:** Q1 2026  
**Status:** Active Development  
**Priority:** High  
**Assignee:** Product Team

---

## User Story Statement

**As a** photographer or production coordinator  
**I want to** upload multiple photo files at once and have them automatically matched to photo orders by filename  
**So that** I can efficiently organize and attach deliverables to orders without manual file-by-file assignment, significantly reducing administrative time

---

## Business Context

The Mass Upload Button provides a streamlined interface for photographers and coordinators to upload multiple photo files at once. Rather than uploading files individually to each article in each order, the system intelligently matches filenames to article numbers/names, automatically associating files with the correct orders and articles. This reduces data entry time from hours to minutes when uploading hundreds of photo deliverables.

---

## Feature Overview & Business Logic

### Purpose & Value Proposition

**Problem Being Solved:**
- Photographers take hundreds of photos and need to upload them to orders
- Manual one-by-one upload is extremely time-consuming
- Difficult to track which file goes to which article
- Easy to assign photos to wrong orders/articles
- No progress visibility during long upload processes

**Solution Provided:**
- Upload 50+ files in single action
- Automatic filename-to-article matching
- Batch processing with progress tracking
- Smart conflict resolution
- Clear success/failure reporting

**Time Saved:**
- 500 photos: ~4 hours (manual) → ~15 minutes (mass upload) = 3.75 hour savings
- Actual time scales with number of photos

---

## User Interface Components

### Section 1: Mass Upload Button

#### Button Appearance
**Location:** Main toolbar/action bar  
**Label:** "📤 Mass Upload" or "Upload Multiple Files"  
**Icon:** Upload/document icon  
**Size:** Medium (14px text, 20px icon)  
**Style:** 
- Background: tan/brown (matches theme) or bright green for visibility
- Color: White text
- Hover: Darkened background, slight lift/shadow

**Visibility Rules:**
- Always visible in orders view
- Only enabled if user has "canUploadImages" permission
- Disabled if no photo orders exist (grayed out)

**Placement Options:**
- Primary location: Top toolbar near "Create Order" button
- Secondary location: Right-click context menu on order table
- Tertiary location: Bottom bulk action toolbar (if orders selected)

---

### Section 2: Modal Interface

#### Modal Structure
**Title:** "📤 Mass Upload Images"  
**Subtitle:** "Upload multiple images and auto-match them to orders by filename"  
**Size:** Responsive (min 720px wide on desktop, full width mobile)  
**Modal Type:** Overlay/modal dialog with backdrop

**Layout Sections:**
1. Upload Zone (top)
2. File List/Progress (middle)
3. Action Buttons (bottom)
4. Results Section (conditionally shown)

---

#### Section 1: Upload Zone
**Visual Style:**
- Dashed border box with light gray background
- Upload icon (48px, centered)
- Text: "Upload Images" with description
- File input (hidden, triggered by button/drop)

**User Interaction:**
- Click to browse files
- Drag & drop files directly into zone
- Multiple selection enabled

**File Constraints:**
- Accepts: JPG, PNG, TIFF, MP4, MOV
- Max per file: 50MB
- Max total: 500MB (or configurable)
- Min: 1 file

**Supported Formats:**
- Images: JPG, JPEG, PNG, TIFF, GIF, WEBP
- Video: MP4, MOV, AVI, MKV
- Documents: PDF, ZIP (for asset bundles)

---

#### Section 2: File List Display

**When Shown:** After files selected but before upload  

**Display Format:**
- Horizontal scrolling list or grid
- Each file shows:
  - Thumbnail (image preview if available)
  - Filename
  - File size
  - Status indicator (pending, uploading, complete, error)

**File Status States:**
- Pending: Gray, waiting to upload
- Uploading: Blue, progress bar filling
- Complete: Green checkmark, 100%
- Error: Red X, error message on hover
- Matched: Green badge, shows matched order number
- Unmatched: Orange badge, no matching order found

**Actions per File:**
- View thumbnail (click to enlarge)
- Remove from upload (X button)
- Manually assign to order (during review)

**Progress Indicators:**
- Overall upload progress bar (% complete)
- Individual file progress bars
- Files uploaded counter (e.g., "5 of 20 complete")
- Upload speed indicator (e.g., "2.3 MB/s")
- Time remaining estimate

---

#### Section 3: Matching Algorithm & Preview

**Before Upload - Matching Phase:**

**Matching Process:**
1. System analyzes each filename
2. Normalizes filename (remove extension, special chars)
3. Searches across all orders for matches in:
   - Article numbers (EAN/GTIN)
   - Article names
   - Order numbers
   - Image request IDs
4. Finds best match with confidence score

**Matching Rules:**
- Exact match: 100% confidence
- Partial match: 80-99% confidence
- No match: 0% confidence (unmatched)
- Multiple matches: Shows all candidates

**Filename Formats Supported:**
- `5901234567890.jpg` → Matches article number
- `Premium-Dog-Food.jpg` → Matches article name
- `ORD-2025-001_article1.jpg` → Matches order + article
- `IMG-123470.jpg` → Matches image request ID
- `dog-food-hero.jpg` → Fuzzy matches on name

**Normalization Examples:**
- `Premium_Dog_Food_2kg.jpg` → "premium dog food 2kg"
- `Organic-Coffee___500g.jpg` → "organic coffee 500g"
- `article_5901234567890.jpg` → "5901234567890"

**Display Format:**
If matching enabled before upload, show preview:
- Green rows: Matched, ready to upload
- Orange rows: Ambiguous, shows candidate orders
- Red rows: No match found, requires manual assignment

**User Options:**
- Accept automatic matches
- Reassign individual files
- Set confidence threshold (e.g., only upload 95%+ matches)
- Toggle between auto-match and manual assignment mode

---

### Section 3: Action Buttons

#### Button 1: Select Files
**Text:** "📁 Choose Files" or "Browse"  
**Action:** Opens file browser dialog  
**Trigger:** Click on upload area or this button  
**Result:** File input dialog with multiple selection enabled

---

#### Button 2: Match & Upload
**Text:** "📤 Match & Upload" or "Upload Matched Files"  
**Action:** Initiates upload process  
**Enabled When:**
- At least 1 file selected
- File validation passed
- User confirmed matches (if in manual mode)

**Behavior:**
1. Validates all filenames/formats
2. Runs matching algorithm
3. Shows matched vs unmatched breakdown
4. Option to proceed or cancel
5. Begins upload on all matched files
6. Skips unmatched files with warning

**Progress Feedback:**
- Real-time progress bar for each file
- Total upload progress
- Speed indicator
- Time remaining estimate
- Cancel button (stops new uploads, completes in-flight)

---

#### Button 3: Cancel/Close
**Text:** "Cancel" or "✕"  
**Action:** Closes modal without uploading  
**Behavior:**
- If upload in progress: Shows confirmation
- If upload complete: Closes modal directly
- Clears file selection

**Confirmation Dialog (if uploading):**
- "Are you sure? 5 files still uploading."
- "Cancel Upload" vs "Continue Uploading"

---

### Section 4: Results Section

**When Shown:** After upload completes  

**Results Summary:**
- ✅ X files successfully matched and uploaded
- ⚠️ Y files unmatched (not uploaded)
- ❌ Z files failed with errors

**Summary Format:**
```
📊 Upload Complete
✅ 18 matched to orders
⚠️ 2 unmatched (manual action required)
❌ 0 failed
```

**Results Table:**
| Filename | Status | Matched To | Action |
|----------|--------|-----------|--------|
| dog-food-hero.jpg | ✅ Complete | ORD-2025-001, Article 1 | View |
| organic-coffee.jpg | ✅ Complete | ORD-2025-002, Article 1 | View |
| mystery-photo.jpg | ⚠️ Unmatched | - | Assign |
| broken-file.jpg | ❌ Error | - | Delete |

**Actions in Results:**
- View: Opens order details where file was uploaded
- Assign: Opens manual assignment dialog for unmatched files
- Delete: Removes file from results
- Download: Downloads failed or unmatched files
- Retry: Re-uploads failed files

**Success Indicators:**
- Green checkmark for successful uploads
- Orange warning for unmatched
- Red X for failures
- File names with article/order references

---

## Interaction Flow & User Scenarios

### Scenario 1: Typical Mass Upload Workflow

**Starting Point:** User has 20 photos from photo shoot  
**File Format:** Filenames like "5901234567890.jpg", "5901234567891.jpg"

**Steps:**
1. User clicks "Mass Upload" button in toolbar
2. Modal opens with empty upload zone
3. User clicks upload area
4. File browser opens (multiselect enabled)
5. User selects all 20 image files
6. Files appear in upload zone as pending
7. System shows progress during upload
8. Files automatically match to articles
9. Progress updates per-file
10. Results show "✅ 20 matched, ⚠️ 0 unmatched"
11. User clicks "Close & Refresh Orders"
12. Modal closes, table refreshes showing uploaded files

**Time:** ~2-3 minutes for entire process

---

### Scenario 2: Mixed Matches with Manual Assignment

**Starting Point:** 15 photos with mixed naming conventions  
**Filenames:** Some match perfectly, others don't

**Steps:**
1. User opens Mass Upload modal
2. Selects 15 files
3. System analyzes and shows preview:
   - 12 files: Green (clearly matched)
   - 2 files: Orange (ambiguous, multiple candidates)
   - 1 file: Red (no match found)
4. User reviews orange matches, accepts/reassigns
5. User manually assigns red file to correct order
6. User clicks "Match & Upload"
7. Confirmation shows final matching
8. Upload begins
9. Results show all success
10. User closes modal

**Time:** ~4-5 minutes (includes manual assignment)

---

### Scenario 3: Video Files with Document Bundle

**Starting Point:** Mix of image files, video files, and PDF documentation  

**Steps:**
1. User selects 25 files (18 images, 5 MP4 videos, 2 PDFs)
2. System validates formats
3. Progress shows all files
4. Upload proceeds with progress per file
5. Different file types show different icons
6. Results categorize by type:
   - 18 images uploaded
   - 5 videos uploaded
   - 2 documents uploaded
7. All matched correctly
8. Success message shows file types processed

---

## Technical Processing Flow

### Phase 1: File Selection (Client-Side)
**What Happens:**
1. User selects files via browser dialog or drag-drop
2. System validates each file:
   - Checks file type (must be image/video/document)
   - Checks file size (max 50MB per file)
   - Checks filename not empty
3. Invalid files shown with warning
4. Valid files added to queue
5. File list displays with status indicators

**Validation Rules:**
- File type: must match whitelist
- File size: max 50MB
- Filename: required, not empty
- Total size: max 500MB batch limit

---

### Phase 2: Filename Analysis & Matching (Client/Server)
**What Happens:**
1. System normalizes each filename:
   - Removes file extension (.jpg, .mp4, etc.)
   - Lowercase all characters
   - Replace underscores/hyphens with spaces
   - Remove special characters except numbers

2. System searches order database:
   - Look for exact EAN/GTIN matches
   - Look for article name matches
   - Look for order number matches
   - Look for image request ID matches

3. Matching algorithm:
   - Exact match = 100% confidence (match immediately)
   - Partial match = 80-95% confidence (show with candidates)
   - No match = 0% confidence (flag as unmatched)

4. Results assigned to each file:
   - Match type (exact, partial, none)
   - Matched order number
   - Matched article
   - Confidence percentage
   - Alternative candidates (if partial)

**Matching Priority:**
1. Exact EAN match (highest priority)
2. Exact image request ID match
3. Exact order number match
4. Partial article name match
5. Fuzzy name match (lowest priority)

---

### Phase 3: User Confirmation & Review
**What Happens:**
1. If all exact matches: Automatically proceed
2. If partial/no matches: Show preview
3. User reviews matches:
   - Accepts green matches
   - Resolves orange matches
   - Manually assigns red matches
4. User confirms to proceed
5. System validates all assignments
6. Ready for upload

**User Options:**
- Accept all auto-matches
- Review each match individually
- Change confidence threshold
- Toggle "skip unmatched files"

---

### Phase 4: Upload Processing (Concurrent)
**What Happens:**
1. System initiates concurrent uploads (e.g., 3 at a time)
2. Each file:
   - Converts to base64 or blob
   - Chunks if very large (>10MB)
   - Uploads with progress events
   - Shows per-file progress bar
   - Retries on failure (up to 3 times)
3. Overall progress tracked:
   - Files completed: 5/20
   - Overall progress: %
   - Speed: MB/s
   - Time remaining: HH:MM:SS

4. Upload complete:
   - Each file assigned to article
   - File metadata stored (size, upload time, uploader)
   - Order status updated if all articles complete

**Concurrency:**
- Default: 3 concurrent uploads
- Maximum: 5 concurrent (configurable)
- Limits based on browser/network

**Retry Logic:**
- Failed file: Automatic retry after 1 second
- Max 3 retries
- After 3 failures: Mark as error, show in results

---

### Phase 5: Results & Reporting
**What Happens:**
1. After all uploads complete:
   - Calculate summary statistics
   - Count successful vs failed
   - Count matched vs unmatched
   - Generate detailed results list

2. Results displayed:
   - Summary counts
   - Per-file results
   - Error messages if applicable
   - Unmatched files highlighted

3. User options:
   - View uploaded photos in orders
   - Retry failed uploads
   - Manually assign unmatched files
   - Download failed/unmatched files
   - Close and refresh

---

## Business Rules & Validation

### Pre-Upload Validation

| Rule | Condition | Error Message |
|------|-----------|---------------|
| Min files | At least 1 file selected | "Select at least one file" |
| File type | Only image/video/document types | "File type not supported: .xyz" |
| File size | Each file < 50MB | "File too large: dog-food.jpg (75MB)" |
| Batch size | Total < 500MB | "Batch exceeds 500MB limit" |
| Filename | Not empty, has extension | "Invalid filename" |

### Matching Validation

| Rule | Applies To | Action |
|------|-----------|--------|
| Exact match | Files | Auto-match, proceed |
| Partial match | Files | Show candidate(s), require confirmation |
| No match | Files | Flag as unmatched, allow manual assign |
| Multiple matches | Files | Show all candidates, user selects |
| Ambiguous match | Files | Require manual confirmation |

### Upload Validation

| Rule | Applies To | Action |
|------|-----------|--------|
| Network error | In-flight uploads | Automatic retry (3x) |
| Timeout | Upload > 5 min | Fail and mark for retry |
| Corruption | File checksum mismatch | Reject, mark as error |
| Duplicate | Same file to same article | Skip, show warning |

---

## Column Visibility in Results

**Displayed in Results Table:**
- Filename (original name)
- Status (✅ complete, ⚠️ unmatched, ❌ error)
- Matched To (which order/article)
- File Size
- Upload Time
- Actions (view, assign, retry, delete)

**Hidden Unless Error:**
- Error Details (shown on error status)
- Retry Count
- Upload Duration

---

## Success Criteria & Metrics

### User Experience Metrics
- **Upload completion rate:** > 95% of selected files
- **Auto-match accuracy:** > 90% correct matches
- **Time per file:** < 30 seconds average
- **Modal responsiveness:** < 500ms for UI updates
- **Error recovery:** User successfully resolves 90% of unmatched files

### Business Metrics
- **Usage frequency:** > 50% of uploads via mass upload
- **Time saved:** Average 3 hours per 500 photos
- **User satisfaction:** > 4.5/5 rating
- **Support tickets:** < 5% of uploads require support
- **Manual reassignments:** < 10% of matched files

---

## Error Handling & Recovery

### Common Errors & Resolutions

**Error: "File too large (75MB)"**
- Cause: Single file exceeds 50MB limit
- Resolution: Compress/re-save file in smaller format
- User Action: Remove file, select smaller version

**Error: "Upload failed: Network error"**
- Cause: Network interruption during upload
- Resolution: Automatic retry 3x, then manual retry option
- User Action: Check network, click "Retry failed"

**Error: "File already uploaded for this article"**
- Cause: Duplicate upload to same article
- Resolution: Show original upload info
- User Action: Skip duplicate, delete new file

**Error: "No matching order found"**
- Cause: Filename doesn't match any existing article
- Resolution: Show unmatched list, allow manual assignment
- User Action: Assign file to correct order manually

**Error: "Ambiguous match - multiple candidates"**
- Cause: Filename matches multiple articles
- Resolution: Show all candidates, require selection
- User Action: Choose correct article from list

---

## Accessibility & Performance

### Accessibility Features
- Keyboard navigation (tab through controls)
- Screen reader support for progress updates
- Clear error messages for all failures
- High contrast upload zone
- Focus indicators on buttons
- ARIA live regions for status updates

### Performance Optimization
- Lazy-load file previews (don't render all at once)
- Chunk large files for upload
- Concurrent uploads (3-5 at a time)
- Cancel requests on modal close
- Debounce filename matching
- Cache order list for quick matching

**Target Performance:**
- Modal open: < 500ms
- File selection: Instant
- Matching algorithm: < 2 seconds for 100 files
- Per-file upload: < 1 minute for 5MB file
- Results display: Instant (< 100ms)

---

## Integration Points

### Services Used
- **File Service:** Upload and store files
- **Order Service:** Fetch orders for matching
- **Article Service:** Fetch articles for matching
- **Notification Service:** Send upload notifications
- **Analytics Service:** Track upload metrics

### Data Exchanged
- **Input:** File list, normalized filenames
- **Processing:** Order/article database
- **Output:** Upload results, file references
- **Notifications:** Upload complete, match status

---

## Related Features

### Upstream (What Leads to Mass Upload)
- Create Order modal (creates orders to upload to)
- Photo shoot completion (triggers need to upload)
- Order import (bulk orders from SAP)

### Downstream (What Uses Mass Upload Results)
- Photo Order table (shows uploaded files)
- File management (organizes uploaded files)
- Asset reporting (tracks deliverables)
- Quality assurance (reviews uploaded photos)

---

## Out of Scope

This user story does NOT include:
- Advanced image editing
- Batch image processing (resize, watermark, etc.)
- Metadata extraction and auto-tagging
- Facial recognition or content analysis
- Cloud storage integration (limited to app storage)
- Video transcoding or compression
- Collaborative upload (multiple users in session)
- Advanced scheduling for uploads

---

## Notes for Implementation

### Development Considerations
- Must handle files > 100MB with chunking
- Concurrent upload limits based on browser capability
- Filename matching must be case-insensitive
- Progress events must update UI smoothly
- Network errors must be handled gracefully
- Modal must work on mobile (smaller file list)

### QA Test Scenarios
- Drag and drop 50 files
- Upload mixed image/video/document files
- Network interruption during upload (simulate)
- Very long filenames (250+ characters)
- Special characters in filenames
- Upload same file twice (should show duplicate warning)
- Cancel while uploading (incomplete upload)
- Upload while orders are being created (race condition)
- Match ambiguous filename to correct article
- Mobile device with limited disk space

### Performance Testing
- Upload 100 files (should complete < 30 minutes)
- Upload 10 × 50MB files (should not crash)
- Network throttling to "slow 3G" (should still work)
- Concurrent uploads with network interruption

---

**Sign-Off**

**Product Owner:** [To be assigned]  
**Business Analyst:** [To be assigned]  
**Development Lead:** [To be assigned]

**Created:** February 17, 2026  
**Last Updated:** February 17, 2026  
**Version:** 1.0.0

---

**End of Mass Upload Button User Story**
