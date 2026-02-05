/**
 * Context Menu Component
 * 
 * Provides right-click access to all application features including:
 * - Templates, Batch Upload, Analytics, Search
 * - Audit logs, Version history, Collaboration
 * - Security settings, Asset management, Integrations
 * - Keyboard shortcuts, Offline mode
 */

export interface ContextMenuItem {
	id: string;
	label: string;
	icon: string;
	shortcut?: string;
	action?: () => void;
	submenu?: ContextMenuItem[];
	separator?: boolean;
	disabled?: boolean;
}

export interface ContextMenuOptions {
	x: number;
	y: number;
	items: ContextMenuItem[];
	onClose?: () => void;
}

class ContextMenuController {
	private menuElement: HTMLElement | null = null;
	private overlay: HTMLElement | null = null;
	private activeSubmenu: HTMLElement | null = null;
	private onCloseCallback: (() => void) | null = null;

	/**
	 * Show context menu at position
	 */
	show(options: ContextMenuOptions): void {
		this.close();
		this.onCloseCallback = options.onClose ?? null;

		// Create overlay
		this.overlay = document.createElement("div");
		this.overlay.className = "context-menu-overlay";
		this.overlay.addEventListener("click", () => this.close());
		this.overlay.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			this.close();
		});
		document.body.appendChild(this.overlay);

		// Create menu
		this.menuElement = this.createMenu(options.items);
		this.menuElement.style.left = `${options.x}px`;
		this.menuElement.style.top = `${options.y}px`;
		document.body.appendChild(this.menuElement);

		// Adjust position if menu goes off-screen
		this.adjustPosition();

		// Add keyboard navigation
		this.menuElement.focus();
	}

	/**
	 * Close context menu
	 */
	close(): void {
		if (this.menuElement) {
			this.menuElement.remove();
			this.menuElement = null;
		}
		if (this.overlay) {
			this.overlay.remove();
			this.overlay = null;
		}
		if (this.activeSubmenu) {
			this.activeSubmenu.remove();
			this.activeSubmenu = null;
		}
		if (this.onCloseCallback) {
			this.onCloseCallback();
			this.onCloseCallback = null;
		}
	}

	private createMenu(items: ContextMenuItem[]): HTMLElement {
		const menu = document.createElement("div");
		menu.className = "context-menu";
		menu.setAttribute("role", "menu");
		menu.tabIndex = -1;

		for (const item of items) {
			if (item.separator) {
				const separator = document.createElement("div");
				separator.className = "context-menu-separator";
				menu.appendChild(separator);
				continue;
			}

			const menuItem = document.createElement("div");
			menuItem.className = `context-menu-item${item.disabled ? " disabled" : ""}`;
			menuItem.setAttribute("role", "menuitem");
			menuItem.dataset.id = item.id;

			// Icon
			const icon = document.createElement("span");
			icon.className = "context-menu-icon";
			icon.textContent = item.icon;
			menuItem.appendChild(icon);

			// Label
			const label = document.createElement("span");
			label.className = "context-menu-label";
			label.textContent = item.label;
			menuItem.appendChild(label);

			// Shortcut or submenu arrow
			if (item.submenu) {
				const arrow = document.createElement("span");
				arrow.className = "context-menu-arrow";
				arrow.textContent = "▶";
				menuItem.appendChild(arrow);

				menuItem.addEventListener("mouseenter", () => {
					this.showSubmenu(menuItem, item.submenu!);
				});
				menuItem.addEventListener("mouseleave", (e) => {
					const related = e.relatedTarget as HTMLElement;
					if (!this.activeSubmenu?.contains(related)) {
						this.hideSubmenu();
					}
				});
			} else if (item.shortcut) {
				const shortcut = document.createElement("span");
				shortcut.className = "context-menu-shortcut";
				shortcut.textContent = item.shortcut;
				menuItem.appendChild(shortcut);
			}

			// Click handler
			if (item.action && !item.disabled && !item.submenu) {
				menuItem.addEventListener("click", () => {
					item.action!();
					this.close();
				});
			}

			menu.appendChild(menuItem);
		}

		// Keyboard navigation
		menu.addEventListener("keydown", (e) => this.handleKeyDown(e, items));

		return menu;
	}

	private showSubmenu(parentItem: HTMLElement, items: ContextMenuItem[]): void {
		this.hideSubmenu();

		const rect = parentItem.getBoundingClientRect();
		const submenu = this.createMenu(items);
		submenu.className = "context-menu context-submenu";
		submenu.style.left = `${rect.right}px`;
		submenu.style.top = `${rect.top}px`;

		document.body.appendChild(submenu);
		this.activeSubmenu = submenu;

		// Adjust if off-screen
		const submenuRect = submenu.getBoundingClientRect();
		if (submenuRect.right > window.innerWidth) {
			submenu.style.left = `${rect.left - submenuRect.width}px`;
		}
		if (submenuRect.bottom > window.innerHeight) {
			submenu.style.top = `${window.innerHeight - submenuRect.height - 10}px`;
		}
	}

	private hideSubmenu(): void {
		if (this.activeSubmenu) {
			this.activeSubmenu.remove();
			this.activeSubmenu = null;
		}
	}

	private adjustPosition(): void {
		if (!this.menuElement) return;

		const rect = this.menuElement.getBoundingClientRect();
		
		if (rect.right > window.innerWidth) {
			this.menuElement.style.left = `${window.innerWidth - rect.width - 10}px`;
		}
		if (rect.bottom > window.innerHeight) {
			this.menuElement.style.top = `${window.innerHeight - rect.height - 10}px`;
		}
		if (rect.left < 0) {
			this.menuElement.style.left = "10px";
		}
		if (rect.top < 0) {
			this.menuElement.style.top = "10px";
		}
	}

	private handleKeyDown(e: KeyboardEvent, items: ContextMenuItem[]): void {
		switch (e.key) {
			case "Escape":
				this.close();
				break;
			case "ArrowDown":
				e.preventDefault();
				this.focusNext();
				break;
			case "ArrowUp":
				e.preventDefault();
				this.focusPrevious();
				break;
			case "Enter":
			case " ":
				e.preventDefault();
				const focused = this.menuElement?.querySelector(".context-menu-item:focus") as HTMLElement;
				focused?.click();
				break;
		}
	}

	private focusNext(): void {
		const items = this.menuElement?.querySelectorAll(".context-menu-item:not(.disabled)");
		if (!items) return;

		const current = document.activeElement;
		let index = Array.from(items).indexOf(current as Element);
		index = (index + 1) % items.length;
		(items[index] as HTMLElement).focus();
	}

	private focusPrevious(): void {
		const items = this.menuElement?.querySelectorAll(".context-menu-item:not(.disabled)");
		if (!items) return;

		const current = document.activeElement;
		let index = Array.from(items).indexOf(current as Element);
		index = index <= 0 ? items.length - 1 : index - 1;
		(items[index] as HTMLElement).focus();
	}
}

// Singleton instance
export const contextMenu = new ContextMenuController();

/**
 * Application Feature Menu Items
 */
export const createAppContextMenu = (): ContextMenuItem[] => [
	{
		id: "new-order",
		label: "New Order",
		icon: "📝",
		shortcut: "Ctrl+N",
		action: () => showFeaturePanel("new-order"),
	},
	{
		id: "separator-1",
		label: "",
		icon: "",
		separator: true,
	},
	{
		id: "templates",
		label: "Templates",
		icon: "📋",
		submenu: [
			{
				id: "browse-templates",
				label: "Browse Templates",
				icon: "📁",
				action: () => showFeaturePanel("templates"),
			},
			{
				id: "create-template",
				label: "Create Template",
				icon: "➕",
				action: () => showFeaturePanel("create-template"),
			},
			{
				id: "import-template",
				label: "Import Template",
				icon: "📥",
				action: () => showFeaturePanel("import-template"),
			},
		],
	},
	{
		id: "batch-upload",
		label: "Batch Upload",
		icon: "📤",
		shortcut: "Ctrl+U",
		action: () => showFeaturePanel("batch-upload"),
	},
	{
		id: "separator-2",
		label: "",
		icon: "",
		separator: true,
	},
	{
		id: "search",
		label: "Advanced Search",
		icon: "🔍",
		shortcut: "Ctrl+F",
		action: () => showFeaturePanel("advanced-search"),
	},
	{
		id: "analytics",
		label: "Analytics Dashboard",
		icon: "📊",
		action: () => showFeaturePanel("analytics"),
	},
	{
		id: "assets",
		label: "Asset Library",
		icon: "🖼️",
		action: () => showFeaturePanel("assets"),
	},
	{
		id: "separator-3",
		label: "",
		icon: "",
		separator: true,
	},
	{
		id: "tools",
		label: "Tools",
		icon: "🛠️",
		submenu: [
			{
				id: "image-annotation",
				label: "Image Annotation",
				icon: "✏️",
				action: () => showFeaturePanel("image-annotation"),
			},
			{
				id: "ai-brief",
				label: "AI Brief Generator",
				icon: "🤖",
				action: () => showFeaturePanel("ai-brief"),
			},
			{
				id: "quality-check",
				label: "Quality Check",
				icon: "✅",
				action: () => showFeaturePanel("quality-check"),
			},
			{
				id: "auto-tagging",
				label: "Auto Tagging",
				icon: "🏷️",
				action: () => showFeaturePanel("auto-tagging"),
			},
		],
	},
	{
		id: "integrations",
		label: "Integrations",
		icon: "🔗",
		submenu: [
			{
				id: "calendar-sync",
				label: "Calendar Sync",
				icon: "📅",
				action: () => showFeaturePanel("calendar"),
			},
			{
				id: "export-report",
				label: "Export Report",
				icon: "📑",
				action: () => showFeaturePanel("export-report"),
			},
			{
				id: "webhooks",
				label: "Webhooks",
				icon: "🪝",
				action: () => showFeaturePanel("webhooks"),
			},
			{
				id: "email-notifications",
				label: "Email Notifications",
				icon: "📧",
				action: () => showFeaturePanel("email-notifications"),
			},
		],
	},
	{
		id: "separator-4",
		label: "",
		icon: "",
		separator: true,
	},
	{
		id: "admin",
		label: "Administration",
		icon: "⚙️",
		submenu: [
			{
				id: "audit-log",
				label: "Audit Log",
				icon: "📜",
				action: () => showFeaturePanel("audit-log"),
			},
			{
				id: "version-history",
				label: "Version History",
				icon: "📚",
				action: () => showFeaturePanel("version-history"),
			},
			{
				id: "collaboration",
				label: "Collaboration",
				icon: "👥",
				action: () => showFeaturePanel("collaboration"),
			},
			{
				id: "security",
				label: "Security Settings",
				icon: "🔐",
				action: () => showFeaturePanel("security"),
			},
		],
	},
	{
		id: "separator-5",
		label: "",
		icon: "",
		separator: true,
	},
	{
		id: "offline-mode",
		label: "Offline Mode",
		icon: "📴",
		action: () => showFeaturePanel("offline-mode"),
	},
	{
		id: "keyboard-shortcuts",
		label: "Keyboard Shortcuts",
		icon: "⌨️",
		shortcut: "Ctrl+/",
		action: () => showFeaturePanel("keyboard-shortcuts"),
	},
	{
		id: "help",
		label: "Help & Documentation",
		icon: "❓",
		shortcut: "F1",
		action: () => showFeaturePanel("help"),
	},
];

/**
 * Show feature panel/modal
 */
function showFeaturePanel(featureId: string): void {
	// Create or get modal container
	let modal = document.getElementById("feature-modal");
	if (!modal) {
		modal = document.createElement("div");
		modal.id = "feature-modal";
		modal.className = "feature-modal";
		document.body.appendChild(modal);
	}

	// Get content for the feature
	const content = getFeatureContent(featureId);
	
	modal.innerHTML = `
		<div class="feature-modal-backdrop" onclick="this.parentElement.style.display='none'"></div>
		<div class="feature-modal-content">
			<div class="feature-modal-header">
				<h2>${content.title}</h2>
				<button class="feature-modal-close" onclick="this.closest('.feature-modal').style.display='none'">✕</button>
			</div>
			<div class="feature-modal-body">
				${content.body}
			</div>
			<div class="feature-modal-footer">
				${content.footer}
			</div>
		</div>
	`;
	
	modal.style.display = "flex";
}

interface FeatureContent {
	title: string;
	body: string;
	footer: string;
}

function getFeatureContent(featureId: string): FeatureContent {
	const features: Record<string, FeatureContent> = {
		"new-order": {
			title: "📝 Create New Order",
			body: `
				<form id="new-order-form" class="feature-form">
					<div class="form-group">
						<label>Order Title</label>
						<input type="text" name="title" placeholder="Enter order title..." required>
					</div>
					<div class="form-group">
						<label>Order Type</label>
						<select name="orderType">
							<option value="product">Product Photography</option>
							<option value="lifestyle">Lifestyle</option>
							<option value="campaign">Campaign</option>
							<option value="promo">Promotional</option>
						</select>
					</div>
					<div class="form-group">
						<label>Priority</label>
						<select name="priority">
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
							<option value="urgent">Urgent</option>
						</select>
					</div>
					<div class="form-group">
						<label>Description</label>
						<textarea name="description" rows="4" placeholder="Enter order description..."></textarea>
					</div>
				</form>
			`,
			footer: `<button class="btn-primary" onclick="alert('Order creation coming soon!')">Create Order</button>`,
		},
		"templates": {
			title: "📋 Order Templates",
			body: `
				<div class="template-grid">
					<div class="template-card" onclick="alert('Loading template...')">
						<div class="template-icon">📸</div>
						<h4>Product Photo Basic</h4>
						<p>Standard product photography setup</p>
						<span class="template-tag">Product</span>
					</div>
					<div class="template-card" onclick="alert('Loading template...')">
						<div class="template-icon">🎨</div>
						<h4>Lifestyle Campaign</h4>
						<p>Full lifestyle shoot with models</p>
						<span class="template-tag">Campaign</span>
					</div>
					<div class="template-card" onclick="alert('Loading template...')">
						<div class="template-icon">🎁</div>
						<h4>Promotional Bundle</h4>
						<p>Quick promo shot setup</p>
						<span class="template-tag">Promo</span>
					</div>
					<div class="template-card" onclick="alert('Loading template...')">
						<div class="template-icon">✨</div>
						<h4>Premium Product</h4>
						<p>High-end product showcase</p>
						<span class="template-tag">Premium</span>
					</div>
				</div>
			`,
			footer: `<button class="btn-secondary" onclick="alert('Create template coming soon!')">+ Create New Template</button>`,
		},
		"batch-upload": {
			title: "📤 Batch Upload",
			body: `
				<div class="upload-zone" id="upload-zone">
					<div class="upload-icon">📁</div>
					<h3>Drag & Drop Files Here</h3>
					<p>or click to browse</p>
					<p class="upload-hint">Supports: JPG, PNG, TIFF, RAW (Max 50MB each)</p>
					<input type="file" id="file-input" multiple accept="image/*" style="display:none">
				</div>
				<div class="upload-progress" id="upload-progress" style="display:none">
					<div class="progress-bar"><div class="progress-fill" style="width:0%"></div></div>
					<p class="progress-text">Uploading 0 of 0 files...</p>
				</div>
				<div class="upload-list" id="upload-list"></div>
			`,
			footer: `<button class="btn-primary" onclick="document.getElementById('file-input').click()">Select Files</button>`,
		},
		"advanced-search": {
			title: "🔍 Advanced Search",
			body: `
				<div class="search-form">
					<div class="search-row">
						<input type="text" placeholder="Search orders..." class="search-input-large">
						<button class="btn-primary">Search</button>
					</div>
					<div class="filter-chips">
						<span class="filter-chip active">All</span>
						<span class="filter-chip">Pending</span>
						<span class="filter-chip">In Progress</span>
						<span class="filter-chip">Completed</span>
						<span class="filter-chip">Archived</span>
					</div>
					<details class="advanced-filters">
						<summary>Advanced Filters</summary>
						<div class="filter-grid">
							<div class="filter-group">
								<label>Date Range</label>
								<input type="date"> to <input type="date">
							</div>
							<div class="filter-group">
								<label>Owner</label>
								<select><option>Any</option></select>
							</div>
							<div class="filter-group">
								<label>Type</label>
								<select><option>Any</option></select>
							</div>
							<div class="filter-group">
								<label>Priority</label>
								<select><option>Any</option></select>
							</div>
						</div>
					</details>
				</div>
				<div class="search-results">
					<p class="search-hint">Enter a search term to find orders</p>
				</div>
			`,
			footer: `<button class="btn-secondary" onclick="alert('Saved searches coming soon!')">Saved Searches</button>`,
		},
		"analytics": {
			title: "📊 Analytics Dashboard",
			body: `
				<div class="analytics-grid">
					<div class="kpi-card">
						<div class="kpi-value">127</div>
						<div class="kpi-label">Total Orders</div>
						<div class="kpi-trend positive">↑ 12%</div>
					</div>
					<div class="kpi-card">
						<div class="kpi-value">89</div>
						<div class="kpi-label">Completed</div>
						<div class="kpi-trend positive">↑ 8%</div>
					</div>
					<div class="kpi-card">
						<div class="kpi-value">23</div>
						<div class="kpi-label">In Progress</div>
						<div class="kpi-trend neutral">→ 0%</div>
					</div>
					<div class="kpi-card">
						<div class="kpi-value">5</div>
						<div class="kpi-label">Overdue</div>
						<div class="kpi-trend negative">↓ 3</div>
					</div>
				</div>
				<div class="chart-placeholder">
					<p>📈 Charts will be displayed here</p>
					<p class="chart-hint">Order trends, status distribution, completion rates</p>
				</div>
			`,
			footer: `<button class="btn-secondary" onclick="alert('Export coming soon!')">Export Report</button>`,
		},
		"assets": {
			title: "🖼️ Asset Library",
			body: `
				<div class="asset-toolbar">
					<input type="text" placeholder="Search assets..." class="asset-search">
					<select class="asset-filter">
						<option>All Types</option>
						<option>Images</option>
						<option>Videos</option>
						<option>Documents</option>
					</select>
					<button class="btn-secondary">Upload</button>
				</div>
				<div class="asset-grid">
					<div class="asset-card">
						<div class="asset-thumb">🖼️</div>
						<div class="asset-name">product-hero.jpg</div>
					</div>
					<div class="asset-card">
						<div class="asset-thumb">🖼️</div>
						<div class="asset-name">lifestyle-01.jpg</div>
					</div>
					<div class="asset-card">
						<div class="asset-thumb">🖼️</div>
						<div class="asset-name">campaign-banner.png</div>
					</div>
					<div class="asset-card">
						<div class="asset-thumb">🖼️</div>
						<div class="asset-name">promo-shot.jpg</div>
					</div>
				</div>
				<div class="storage-info">
					<div class="storage-bar"><div class="storage-fill" style="width:35%"></div></div>
					<p>1.75 GB of 5 GB used</p>
				</div>
			`,
			footer: `<button class="btn-primary">Upload Assets</button>`,
		},
		"image-annotation": {
			title: "✏️ Image Annotation",
			body: `
				<div class="annotation-workspace">
					<div class="annotation-toolbar">
						<button class="tool-btn active" title="Arrow">➡️</button>
						<button class="tool-btn" title="Rectangle">▢</button>
						<button class="tool-btn" title="Circle">○</button>
						<button class="tool-btn" title="Freehand">✏️</button>
						<button class="tool-btn" title="Text">T</button>
						<button class="tool-btn" title="Highlight">🖍️</button>
						<span class="tool-separator"></span>
						<input type="color" value="#ff0000" class="color-picker">
						<select class="stroke-width">
							<option>Thin</option>
							<option selected>Medium</option>
							<option>Thick</option>
						</select>
						<span class="tool-separator"></span>
						<button class="tool-btn" title="Undo">↩️</button>
						<button class="tool-btn" title="Redo">↪️</button>
					</div>
					<div class="annotation-canvas">
						<p>Select an image to annotate</p>
					</div>
				</div>
			`,
			footer: `<button class="btn-primary">Save Annotations</button> <button class="btn-secondary">Export</button>`,
		},
		"ai-brief": {
			title: "🤖 AI Brief Generator",
			body: `
				<form class="ai-form">
					<div class="form-group">
						<label>Order Type</label>
						<select name="orderType">
							<option>Product Photography</option>
							<option>Lifestyle</option>
							<option>Campaign</option>
						</select>
					</div>
					<div class="form-group">
						<label>Article Count</label>
						<input type="number" value="5" min="1" max="100">
					</div>
					<div class="form-group">
						<label>Style</label>
						<select>
							<option>Professional</option>
							<option>Casual</option>
							<option>Detailed</option>
						</select>
					</div>
					<button type="button" class="btn-primary" onclick="alert('AI generation coming soon!')">Generate Brief</button>
				</form>
				<div class="generated-brief">
					<h4>Generated Brief Preview</h4>
					<p class="brief-placeholder">Click "Generate Brief" to create an AI-powered brief...</p>
				</div>
			`,
			footer: `<button class="btn-secondary">Copy to Clipboard</button>`,
		},
		"quality-check": {
			title: "✅ Quality Check",
			body: `
				<div class="quality-results">
					<div class="quality-score">
						<div class="score-circle grade-a">A</div>
						<div class="score-details">
							<h3>Quality Score: 92/100</h3>
							<p>Excellent quality - ready for review</p>
						</div>
					</div>
					<div class="quality-checks">
						<div class="check-item passed">✓ All required fields complete</div>
						<div class="check-item passed">✓ Images meet resolution requirements</div>
						<div class="check-item passed">✓ Brief is detailed and clear</div>
						<div class="check-item warning">⚠ Consider adding more tags</div>
						<div class="check-item passed">✓ Deadline is reasonable</div>
					</div>
				</div>
			`,
			footer: `<button class="btn-primary">Run Quality Check</button>`,
		},
		"auto-tagging": {
			title: "🏷️ Auto Tagging",
			body: `
				<div class="tagging-section">
					<h4>Suggested Tags</h4>
					<div class="tag-suggestions">
						<span class="tag-chip" data-confidence="95">product <small>95%</small></span>
						<span class="tag-chip" data-confidence="88">lifestyle <small>88%</small></span>
						<span class="tag-chip" data-confidence="82">indoor <small>82%</small></span>
						<span class="tag-chip" data-confidence="75">fashion <small>75%</small></span>
						<span class="tag-chip" data-confidence="70">summer <small>70%</small></span>
					</div>
					<h4>Current Tags</h4>
					<div class="current-tags">
						<span class="tag-chip active">product ✕</span>
						<input type="text" placeholder="Add tag..." class="tag-input">
					</div>
				</div>
			`,
			footer: `<button class="btn-primary">Apply Suggested Tags</button>`,
		},
		"calendar": {
			title: "📅 Calendar Sync",
			body: `
				<div class="calendar-options">
					<div class="calendar-option" onclick="alert('Google Calendar sync coming soon!')">
						<div class="calendar-icon">📆</div>
						<h4>Google Calendar</h4>
						<p>Sync shoot dates to Google Calendar</p>
					</div>
					<div class="calendar-option" onclick="alert('Outlook sync coming soon!')">
						<div class="calendar-icon">📅</div>
						<h4>Outlook</h4>
						<p>Export to Microsoft Outlook</p>
					</div>
					<div class="calendar-option" onclick="alert('iCal export coming soon!')">
						<div class="calendar-icon">🗓️</div>
						<h4>iCal Export</h4>
						<p>Download .ics file</p>
					</div>
				</div>
			`,
			footer: `<button class="btn-secondary">Manage Connected Calendars</button>`,
		},
		"export-report": {
			title: "📑 Export Report",
			body: `
				<form class="export-form">
					<div class="form-group">
						<label>Report Type</label>
						<select>
							<option>Order Summary</option>
							<option>Status Report</option>
							<option>Performance Analytics</option>
							<option>Audit Log</option>
						</select>
					</div>
					<div class="form-group">
						<label>Date Range</label>
						<input type="date"> to <input type="date">
					</div>
					<div class="form-group">
						<label>Format</label>
						<div class="format-options">
							<label><input type="radio" name="format" value="csv" checked> CSV</label>
							<label><input type="radio" name="format" value="excel"> Excel</label>
							<label><input type="radio" name="format" value="pdf"> PDF</label>
							<label><input type="radio" name="format" value="html"> HTML</label>
						</div>
					</div>
				</form>
			`,
			footer: `<button class="btn-primary" onclick="alert('Export coming soon!')">Export Report</button>`,
		},
		"webhooks": {
			title: "🪝 Webhooks",
			body: `
				<div class="webhooks-list">
					<div class="webhook-item">
						<div class="webhook-status active"></div>
						<div class="webhook-info">
							<h4>Order Created</h4>
							<p>https://api.example.com/webhooks/orders</p>
						</div>
						<button class="btn-small">Edit</button>
					</div>
					<div class="webhook-item">
						<div class="webhook-status active"></div>
						<div class="webhook-info">
							<h4>Status Changed</h4>
							<p>https://api.example.com/webhooks/status</p>
						</div>
						<button class="btn-small">Edit</button>
					</div>
				</div>
			`,
			footer: `<button class="btn-primary" onclick="alert('Add webhook coming soon!')">+ Add Webhook</button>`,
		},
		"email-notifications": {
			title: "📧 Email Notifications",
			body: `
				<div class="notification-settings">
					<label class="notification-toggle">
						<input type="checkbox" checked>
						<span>Order assigned to me</span>
					</label>
					<label class="notification-toggle">
						<input type="checkbox" checked>
						<span>Order status changed</span>
					</label>
					<label class="notification-toggle">
						<input type="checkbox" checked>
						<span>Comments on my orders</span>
					</label>
					<label class="notification-toggle">
						<input type="checkbox">
						<span>Daily digest</span>
					</label>
					<label class="notification-toggle">
						<input type="checkbox">
						<span>Weekly summary</span>
					</label>
				</div>
			`,
			footer: `<button class="btn-primary">Save Settings</button>`,
		},
		"audit-log": {
			title: "📜 Audit Log",
			body: `
				<div class="audit-filters">
					<input type="text" placeholder="Search logs..." class="audit-search">
					<select><option>All Actions</option><option>Create</option><option>Update</option><option>Delete</option></select>
					<input type="date">
				</div>
				<div class="audit-list">
					<div class="audit-entry">
						<span class="audit-time">2 min ago</span>
						<span class="audit-action create">CREATE</span>
						<span class="audit-user">John Doe</span>
						<span class="audit-desc">Created order ORD-2024-001</span>
					</div>
					<div class="audit-entry">
						<span class="audit-time">15 min ago</span>
						<span class="audit-action update">UPDATE</span>
						<span class="audit-user">Jane Smith</span>
						<span class="audit-desc">Updated status to "In Progress"</span>
					</div>
					<div class="audit-entry">
						<span class="audit-time">1 hour ago</span>
						<span class="audit-action comment">COMMENT</span>
						<span class="audit-user">Bob Wilson</span>
						<span class="audit-desc">Added comment on ORD-2024-001</span>
					</div>
				</div>
			`,
			footer: `<button class="btn-secondary" onclick="alert('Export coming soon!')">Export Log</button>`,
		},
		"version-history": {
			title: "📚 Version History",
			body: `
				<div class="version-list">
					<div class="version-item current">
						<div class="version-badge">v3</div>
						<div class="version-info">
							<h4>Current Version</h4>
							<p>Modified by John Doe • 5 min ago</p>
							<p class="version-changes">Changed status, updated brief</p>
						</div>
						<button class="btn-small" disabled>Current</button>
					</div>
					<div class="version-item">
						<div class="version-badge">v2</div>
						<div class="version-info">
							<h4>Previous Version</h4>
							<p>Modified by Jane Smith • 2 hours ago</p>
							<p class="version-changes">Added 3 articles</p>
						</div>
						<button class="btn-small">Restore</button>
					</div>
					<div class="version-item">
						<div class="version-badge">v1</div>
						<div class="version-info">
							<h4>Initial Version</h4>
							<p>Created by Bob Wilson • 1 day ago</p>
							<p class="version-changes">Order created</p>
						</div>
						<button class="btn-small">Restore</button>
					</div>
				</div>
			`,
			footer: `<button class="btn-secondary">Compare Versions</button>`,
		},
		"collaboration": {
			title: "👥 Collaboration",
			body: `
				<div class="collab-section">
					<h4>Currently Online</h4>
					<div class="online-users">
						<div class="user-avatar" style="background:#4CAF50" title="John Doe">JD</div>
						<div class="user-avatar" style="background:#2196F3" title="Jane Smith">JS</div>
						<div class="user-avatar" style="background:#FF9800" title="Bob Wilson">BW</div>
					</div>
					<h4>Active Locks</h4>
					<div class="lock-list">
						<div class="lock-item">
							<span>🔒 ORD-2024-001</span>
							<span>Locked by John Doe</span>
							<button class="btn-small">Request Access</button>
						</div>
					</div>
					<h4>Recent Activity</h4>
					<div class="activity-feed">
						<p>👤 John Doe is editing ORD-2024-001</p>
						<p>💬 Jane Smith added a comment</p>
						<p>✅ Bob Wilson completed review</p>
					</div>
				</div>
			`,
			footer: `<button class="btn-secondary">Invite Collaborators</button>`,
		},
		"security": {
			title: "🔐 Security Settings",
			body: `
				<div class="security-settings">
					<div class="security-section">
						<h4>Password Policy</h4>
						<label><input type="checkbox" checked> Require minimum 8 characters</label>
						<label><input type="checkbox" checked> Require uppercase letters</label>
						<label><input type="checkbox" checked> Require numbers</label>
						<label><input type="checkbox"> Require special characters</label>
					</div>
					<div class="security-section">
						<h4>Session Settings</h4>
						<label>Session timeout: <select><option>30 minutes</option><option>1 hour</option><option>4 hours</option></select></label>
					</div>
					<div class="security-section">
						<h4>Active Sessions</h4>
						<div class="session-list">
							<div class="session-item current">
								<span>🖥️ Windows • Chrome • This device</span>
								<span class="session-active">Active now</span>
							</div>
							<div class="session-item">
								<span>📱 iOS • Safari</span>
								<span>2 hours ago</span>
								<button class="btn-small danger">Revoke</button>
							</div>
						</div>
					</div>
				</div>
			`,
			footer: `<button class="btn-primary">Save Settings</button>`,
		},
		"offline-mode": {
			title: "📴 Offline Mode",
			body: `
				<div class="offline-status">
					<div class="status-indicator online">
						<span class="status-dot"></span>
						<span>You are currently online</span>
					</div>
					<div class="sync-status">
						<h4>Sync Status</h4>
						<p>✅ All data synced</p>
						<p class="sync-time">Last synced: 2 minutes ago</p>
					</div>
					<div class="offline-data">
						<h4>Cached Data</h4>
						<p>📁 127 orders cached</p>
						<p>🖼️ 45 images cached</p>
						<p>💾 Total: 234 MB</p>
					</div>
					<div class="pending-changes">
						<h4>Pending Changes</h4>
						<p>No pending changes to sync</p>
					</div>
				</div>
			`,
			footer: `<button class="btn-secondary" onclick="alert('Syncing...')">Sync Now</button> <button class="btn-secondary">Clear Cache</button>`,
		},
		"keyboard-shortcuts": {
			title: "⌨️ Keyboard Shortcuts",
			body: `
				<div class="shortcuts-list">
					<div class="shortcut-category">
						<h4>Navigation</h4>
						<div class="shortcut-item"><kbd>G</kbd> then <kbd>H</kbd> <span>Go to Home</span></div>
						<div class="shortcut-item"><kbd>G</kbd> then <kbd>O</kbd> <span>Go to Orders</span></div>
						<div class="shortcut-item"><kbd>G</kbd> then <kbd>T</kbd> <span>Go to Templates</span></div>
						<div class="shortcut-item"><kbd>G</kbd> then <kbd>A</kbd> <span>Go to Analytics</span></div>
					</div>
					<div class="shortcut-category">
						<h4>Actions</h4>
						<div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>N</kbd> <span>New Order</span></div>
						<div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>S</kbd> <span>Save</span></div>
						<div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>F</kbd> <span>Search</span></div>
						<div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>U</kbd> <span>Upload</span></div>
					</div>
					<div class="shortcut-category">
						<h4>View</h4>
						<div class="shortcut-item"><kbd>Ctrl</kbd>+<kbd>/</kbd> <span>Show Shortcuts</span></div>
						<div class="shortcut-item"><kbd>Esc</kbd> <span>Close Modal</span></div>
						<div class="shortcut-item"><kbd>?</kbd> <span>Help</span></div>
					</div>
				</div>
			`,
			footer: `<button class="btn-secondary">Customize Shortcuts</button>`,
		},
		"help": {
			title: "❓ Help & Documentation",
			body: `
				<div class="help-sections">
					<div class="help-card" onclick="alert('Opening documentation...')">
						<span class="help-icon">📖</span>
						<h4>User Manual</h4>
						<p>Complete guide to using the application</p>
					</div>
					<div class="help-card" onclick="alert('Opening quick start...')">
						<span class="help-icon">🚀</span>
						<h4>Quick Start</h4>
						<p>Get started in 5 minutes</p>
					</div>
					<div class="help-card" onclick="alert('Opening FAQ...')">
						<span class="help-icon">💡</span>
						<h4>FAQ</h4>
						<p>Frequently asked questions</p>
					</div>
					<div class="help-card" onclick="alert('Opening support...')">
						<span class="help-icon">🎫</span>
						<h4>Contact Support</h4>
						<p>Get help from our team</p>
					</div>
				</div>
				<div class="app-info">
					<p>RKH's Content Creation Program v1.1.0</p>
					<p>© 2024-2026 RKH Photo Orders</p>
				</div>
			`,
			footer: `<button class="btn-secondary">Check for Updates</button>`,
		},
		"create-template": {
			title: "➕ Create Template",
			body: `<p>Template creation form will be displayed here.</p>`,
			footer: `<button class="btn-primary">Save Template</button>`,
		},
		"import-template": {
			title: "📥 Import Template",
			body: `<p>Drag & drop a template file or click to browse.</p>`,
			footer: `<button class="btn-primary">Import</button>`,
		},
	};

	return features[featureId] || {
		title: "Feature",
		body: `<p>This feature is coming soon!</p>`,
		footer: `<button class="btn-secondary" onclick="this.closest('.feature-modal').style.display='none'">Close</button>`,
	};
}

/**
 * Initialize context menu on the application
 */
export function initializeContextMenu(): void {
	document.addEventListener("contextmenu", (e) => {
		e.preventDefault();
		
		contextMenu.show({
			x: e.clientX,
			y: e.clientY,
			items: createAppContextMenu(),
		});
	});

	// Close on escape
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			contextMenu.close();
			const modal = document.getElementById("feature-modal");
			if (modal) modal.style.display = "none";
		}
	});
}
