/**
 * Keyboard Shortcuts Service
 * 
 * Provides comprehensive keyboard navigation and shortcuts:
 * - Global shortcuts for common actions
 * - Context-aware shortcuts
 * - Customizable key bindings
 * - Accessibility support
 */

export interface KeyBinding {
	id: string;
	keys: string[]; // e.g., ["ctrl", "s"] or ["cmd", "shift", "p"]
	description: string;
	category: ShortcutCategory;
	action: () => void;
	enabled: boolean;
	allowInInput: boolean;
	global: boolean;
}

export type ShortcutCategory = 
	| "navigation"
	| "editing"
	| "view"
	| "orders"
	| "search"
	| "system"
	| "accessibility";

export interface ShortcutGroup {
	category: ShortcutCategory;
	label: string;
	shortcuts: KeyBinding[];
}

export interface KeyCombo {
	key: string;
	ctrl: boolean;
	alt: boolean;
	shift: boolean;
	meta: boolean;
}

export interface ShortcutMatch {
	binding: KeyBinding;
	exact: boolean;
}

// Modifier key detection
const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const MODIFIER_KEYS = new Set(["Control", "Alt", "Shift", "Meta"]);

const KEY_ALIASES: Record<string, string> = {
	"ctrl": "Control",
	"cmd": isMac ? "Meta" : "Control",
	"command": "Meta",
	"option": "Alt",
	"opt": "Alt",
	"esc": "Escape",
	"return": "Enter",
	"space": " ",
	"up": "ArrowUp",
	"down": "ArrowDown",
	"left": "ArrowLeft",
	"right": "ArrowRight",
	"del": "Delete",
	"backspace": "Backspace",
	"tab": "Tab",
};

const KEY_DISPLAY: Record<string, string> = {
	"Control": isMac ? "⌃" : "Ctrl",
	"Meta": isMac ? "⌘" : "Win",
	"Alt": isMac ? "⌥" : "Alt",
	"Shift": isMac ? "⇧" : "Shift",
	"Escape": "Esc",
	"Enter": "↵",
	"ArrowUp": "↑",
	"ArrowDown": "↓",
	"ArrowLeft": "←",
	"ArrowRight": "→",
	"Backspace": "⌫",
	"Delete": "⌦",
	"Tab": "⇥",
	" ": "Space",
};

export class KeyboardShortcutsService {
	private bindings: Map<string, KeyBinding> = new Map();
	private enabled = true;
	private activeContext: string | null = null;
	private pressedKeys: Set<string> = new Set();
	private chordBuffer: string[] = [];
	private chordTimeout: number | null = null;
	private helpModalCallback: (() => void) | null = null;
	private listeners = new Set<(event: ShortcutEvent) => void>();

	constructor() {
		this.initializeDefaultBindings();
		this.attachEventListeners();
	}

	/**
	 * Initialize default keyboard shortcuts
	 */
	private initializeDefaultBindings(): void {
		const defaults: Omit<KeyBinding, "action" | "enabled">[] = [
			// Navigation
			{ id: "nav-home", keys: ["g", "h"], description: "Go to Home", category: "navigation", allowInInput: false, global: true },
			{ id: "nav-orders", keys: ["g", "o"], description: "Go to Orders", category: "navigation", allowInInput: false, global: true },
			{ id: "nav-calendar", keys: ["g", "c"], description: "Go to Calendar", category: "navigation", allowInInput: false, global: true },
			{ id: "nav-assets", keys: ["g", "a"], description: "Go to Assets", category: "navigation", allowInInput: false, global: true },
			{ id: "nav-analytics", keys: ["g", "d"], description: "Go to Dashboard", category: "navigation", allowInInput: false, global: true },
			
			// Orders
			{ id: "order-new", keys: ["ctrl", "n"], description: "New Order", category: "orders", allowInInput: false, global: true },
			{ id: "order-save", keys: ["ctrl", "s"], description: "Save Order", category: "orders", allowInInput: true, global: false },
			{ id: "order-duplicate", keys: ["ctrl", "d"], description: "Duplicate Order", category: "orders", allowInInput: false, global: false },
			{ id: "order-delete", keys: ["ctrl", "backspace"], description: "Delete Order", category: "orders", allowInInput: false, global: false },
			{ id: "order-next", keys: ["j"], description: "Next Order", category: "orders", allowInInput: false, global: false },
			{ id: "order-prev", keys: ["k"], description: "Previous Order", category: "orders", allowInInput: false, global: false },
			{ id: "order-open", keys: ["enter"], description: "Open Selected Order", category: "orders", allowInInput: false, global: false },
			
			// Search
			{ id: "search-focus", keys: ["ctrl", "k"], description: "Focus Search", category: "search", allowInInput: true, global: true },
			{ id: "search-advanced", keys: ["ctrl", "shift", "f"], description: "Advanced Search", category: "search", allowInInput: false, global: true },
			{ id: "search-clear", keys: ["escape"], description: "Clear Search", category: "search", allowInInput: true, global: false },
			
			// Editing
			{ id: "edit-undo", keys: ["ctrl", "z"], description: "Undo", category: "editing", allowInInput: true, global: false },
			{ id: "edit-redo", keys: ["ctrl", "shift", "z"], description: "Redo", category: "editing", allowInInput: true, global: false },
			{ id: "edit-cut", keys: ["ctrl", "x"], description: "Cut", category: "editing", allowInInput: true, global: false },
			{ id: "edit-copy", keys: ["ctrl", "c"], description: "Copy", category: "editing", allowInInput: true, global: false },
			{ id: "edit-paste", keys: ["ctrl", "v"], description: "Paste", category: "editing", allowInInput: true, global: false },
			{ id: "edit-selectall", keys: ["ctrl", "a"], description: "Select All", category: "editing", allowInInput: true, global: false },
			
			// View
			{ id: "view-refresh", keys: ["ctrl", "r"], description: "Refresh", category: "view", allowInInput: false, global: true },
			{ id: "view-fullscreen", keys: ["f11"], description: "Toggle Fullscreen", category: "view", allowInInput: false, global: true },
			{ id: "view-sidebar", keys: ["ctrl", "b"], description: "Toggle Sidebar", category: "view", allowInInput: false, global: true },
			{ id: "view-zoom-in", keys: ["ctrl", "="], description: "Zoom In", category: "view", allowInInput: false, global: true },
			{ id: "view-zoom-out", keys: ["ctrl", "-"], description: "Zoom Out", category: "view", allowInInput: false, global: true },
			{ id: "view-zoom-reset", keys: ["ctrl", "0"], description: "Reset Zoom", category: "view", allowInInput: false, global: true },
			
			// System
			{ id: "help", keys: ["?"], description: "Show Help", category: "system", allowInInput: false, global: true },
			{ id: "shortcuts", keys: ["ctrl", "/"], description: "Show Shortcuts", category: "system", allowInInput: false, global: true },
			{ id: "settings", keys: ["ctrl", ","], description: "Open Settings", category: "system", allowInInput: false, global: true },
			{ id: "logout", keys: ["ctrl", "shift", "q"], description: "Log Out", category: "system", allowInInput: false, global: true },
			
			// Accessibility
			{ id: "a11y-skip-nav", keys: ["alt", "1"], description: "Skip to Navigation", category: "accessibility", allowInInput: true, global: true },
			{ id: "a11y-skip-content", keys: ["alt", "2"], description: "Skip to Content", category: "accessibility", allowInInput: true, global: true },
			{ id: "a11y-announce", keys: ["alt", "a"], description: "Announce Page", category: "accessibility", allowInInput: true, global: true },
		];

		for (const def of defaults) {
			this.bindings.set(def.id, {
				...def,
				action: () => {}, // Placeholder, to be set by consumers
				enabled: true,
			});
		}
	}

	/**
	 * Attach event listeners
	 */
	private attachEventListeners(): void {
		if (typeof window === "undefined") return;

		window.addEventListener("keydown", this.handleKeyDown.bind(this));
		window.addEventListener("keyup", this.handleKeyUp.bind(this));
		window.addEventListener("blur", this.handleBlur.bind(this));
	}

	/**
	 * Handle keydown event
	 */
	private handleKeyDown(event: KeyboardEvent): void {
		if (!this.enabled) return;

		// Track pressed keys
		this.pressedKeys.add(event.key);

		// Check if in input field
		const inInput = this.isInputElement(event.target as Element);

		// Build current key combo
		const combo: KeyCombo = {
			key: event.key,
			ctrl: event.ctrlKey,
			alt: event.altKey,
			shift: event.shiftKey,
			meta: event.metaKey,
		};

		// Handle chord sequences (like 'g h' for go to home)
		const isModifierOnly = MODIFIER_KEYS.has(event.key);
		if (!isModifierOnly && !combo.ctrl && !combo.alt && !combo.meta) {
			this.chordBuffer.push(event.key.toLowerCase());
			
			// Clear chord after timeout
			if (this.chordTimeout) {
				clearTimeout(this.chordTimeout);
			}
			this.chordTimeout = window.setTimeout(() => {
				this.chordBuffer = [];
			}, 500);

			// Check for chord matches
			const chordMatch = this.findChordMatch(this.chordBuffer, inInput);
			if (chordMatch) {
				event.preventDefault();
				this.executeBinding(chordMatch);
				this.chordBuffer = [];
				return;
			}
		}

		// Check for single key or modifier+key matches
		const match = this.findMatch(combo, inInput);
		if (match) {
			event.preventDefault();
			this.executeBinding(match);
		}
	}

	/**
	 * Handle keyup event
	 */
	private handleKeyUp(event: KeyboardEvent): void {
		this.pressedKeys.delete(event.key);
	}

	/**
	 * Handle blur event (reset state)
	 */
	private handleBlur(): void {
		this.pressedKeys.clear();
		this.chordBuffer = [];
	}

	/**
	 * Check if element is an input
	 */
	private isInputElement(element: Element): boolean {
		if (!element) return false;
		const tagName = element.tagName.toLowerCase();
		const isEditable = element.getAttribute("contenteditable") === "true";
		return tagName === "input" || tagName === "textarea" || tagName === "select" || isEditable;
	}

	/**
	 * Find matching binding for key combo
	 */
	private findMatch(combo: KeyCombo, inInput: boolean): KeyBinding | null {
		for (const binding of this.bindings.values()) {
			if (!binding.enabled) continue;
			if (inInput && !binding.allowInInput) continue;

			const keys = binding.keys;
			if (keys.length !== this.countModifiers(combo) + 1) continue;

			const normalizedKeys = keys.map((k) => this.normalizeKey(k));
			
			// Check if all keys match
			const hasCtrl = normalizedKeys.includes("Control");
			const hasAlt = normalizedKeys.includes("Alt");
			const hasShift = normalizedKeys.includes("Shift");
			const hasMeta = normalizedKeys.includes("Meta");
			const mainKey = normalizedKeys.find((k) => !MODIFIER_KEYS.has(k));

			if (
				combo.ctrl === hasCtrl &&
				combo.alt === hasAlt &&
				combo.shift === hasShift &&
				combo.meta === hasMeta &&
				mainKey && this.normalizeKey(combo.key) === mainKey
			) {
				return binding;
			}
		}

		return null;
	}

	/**
	 * Find matching chord sequence
	 */
	private findChordMatch(chord: string[], inInput: boolean): KeyBinding | null {
		for (const binding of this.bindings.values()) {
			if (!binding.enabled) continue;
			if (inInput && !binding.allowInInput) continue;

			const keys = binding.keys;
			// Only match non-modifier sequences
			if (keys.some((k) => MODIFIER_KEYS.has(this.normalizeKey(k)))) continue;
			
			if (keys.length !== chord.length) continue;
			
			const match = keys.every((k, i) => k.toLowerCase() === chord[i]);
			if (match) return binding;
		}

		return null;
	}

	/**
	 * Count modifier keys in combo
	 */
	private countModifiers(combo: KeyCombo): number {
		return [combo.ctrl, combo.alt, combo.shift, combo.meta].filter(Boolean).length;
	}

	/**
	 * Normalize key name
	 */
	private normalizeKey(key: string): string {
		const lower = key.toLowerCase();
		return KEY_ALIASES[lower] ?? key;
	}

	/**
	 * Execute a binding
	 */
	private executeBinding(binding: KeyBinding): void {
		binding.action();
		this.emit({ type: "executed", binding });
	}

	// Public API

	/**
	 * Register a shortcut action
	 */
	register(id: string, action: () => void): void {
		const binding = this.bindings.get(id);
		if (binding) {
			binding.action = action;
		}
	}

	/**
	 * Register a custom shortcut
	 */
	registerCustom(binding: Omit<KeyBinding, "enabled">): void {
		this.bindings.set(binding.id, { ...binding, enabled: true });
	}

	/**
	 * Unregister a shortcut
	 */
	unregister(id: string): boolean {
		return this.bindings.delete(id);
	}

	/**
	 * Enable/disable a shortcut
	 */
	setEnabled(id: string, enabled: boolean): void {
		const binding = this.bindings.get(id);
		if (binding) {
			binding.enabled = enabled;
		}
	}

	/**
	 * Update key binding
	 */
	updateBinding(id: string, keys: string[]): void {
		const binding = this.bindings.get(id);
		if (binding) {
			binding.keys = keys;
		}
	}

	/**
	 * Get all bindings grouped by category
	 */
	getGroups(): ShortcutGroup[] {
		const groups = new Map<ShortcutCategory, KeyBinding[]>();

		for (const binding of this.bindings.values()) {
			const list = groups.get(binding.category) ?? [];
			list.push(binding);
			groups.set(binding.category, list);
		}

		const categoryLabels: Record<ShortcutCategory, string> = {
			navigation: "Navigation",
			editing: "Editing",
			view: "View",
			orders: "Orders",
			search: "Search",
			system: "System",
			accessibility: "Accessibility",
		};

		return Array.from(groups.entries()).map(([category, shortcuts]) => ({
			category,
			label: categoryLabels[category],
			shortcuts,
		}));
	}

	/**
	 * Get display text for key combo
	 */
	formatKeys(keys: string[]): string {
		return keys
			.map((k) => {
				const normalized = this.normalizeKey(k);
				return KEY_DISPLAY[normalized] ?? k.toUpperCase();
			})
			.join(isMac ? "" : " + ");
	}

	/**
	 * Enable/disable all shortcuts
	 */
	setGlobalEnabled(enabled: boolean): void {
		this.enabled = enabled;
	}

	/**
	 * Set active context (for context-aware shortcuts)
	 */
	setContext(context: string | null): void {
		this.activeContext = context;
	}

	/**
	 * Show help modal
	 */
	showHelp(): void {
		if (this.helpModalCallback) {
			this.helpModalCallback();
		}
	}

	/**
	 * Register help modal callback
	 */
	onHelpRequested(callback: () => void): void {
		this.helpModalCallback = callback;
	}

	/**
	 * Subscribe to shortcut events
	 */
	onEvent(listener: (event: ShortcutEvent) => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	private emit(event: ShortcutEvent): void {
		for (const listener of this.listeners) {
			listener(event);
		}
	}

	/**
	 * Generate help HTML
	 */
	generateHelpHTML(): string {
		const groups = this.getGroups();
		
		let html = `<div class="shortcuts-help">
			<h2>Keyboard Shortcuts</h2>`;

		for (const group of groups) {
			html += `<div class="shortcut-group">
				<h3>${group.label}</h3>
				<table>
					<tbody>`;

			for (const shortcut of group.shortcuts) {
				if (!shortcut.enabled) continue;
				html += `<tr>
					<td class="shortcut-keys">${this.formatKeys(shortcut.keys)}</td>
					<td class="shortcut-desc">${shortcut.description}</td>
				</tr>`;
			}

			html += `</tbody></table></div>`;
		}

		html += `</div>`;
		return html;
	}

	/**
	 * Export bindings for persistence
	 */
	exportBindings(): Record<string, string[]> {
		const result: Record<string, string[]> = {};
		for (const [id, binding] of this.bindings) {
			result[id] = binding.keys;
		}
		return result;
	}

	/**
	 * Import bindings from persistence
	 */
	importBindings(bindings: Record<string, string[]>): void {
		for (const [id, keys] of Object.entries(bindings)) {
			this.updateBinding(id, keys);
		}
	}

	/**
	 * Reset to defaults
	 */
	resetToDefaults(): void {
		this.bindings.clear();
		this.initializeDefaultBindings();
	}

	/**
	 * Cleanup
	 */
	destroy(): void {
		if (typeof window === "undefined") return;

		window.removeEventListener("keydown", this.handleKeyDown.bind(this));
		window.removeEventListener("keyup", this.handleKeyUp.bind(this));
		window.removeEventListener("blur", this.handleBlur.bind(this));
	}
}

export interface ShortcutEvent {
	type: "executed";
	binding: KeyBinding;
}

export const keyboardShortcutsService = new KeyboardShortcutsService();
