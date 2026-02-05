/**
 * Version History Service - Track changes with rollback capability
 * 
 * Maintains a complete history of order changes with the ability
 * to view diffs and restore previous versions.
 */

export interface VersionEntry<T = unknown> {
	id: string;
	version: number;
	timestamp: string;
	userId: string;
	userName: string;
	action: "create" | "update" | "restore";
	data: T;
	changes?: VersionChange[];
	comment?: string;
}

export interface VersionChange {
	field: string;
	previousValue: unknown;
	newValue: unknown;
	displayName?: string;
}

export interface VersionHistoryOptions {
	storage?: Storage;
	maxVersionsPerResource?: number;
}

const STORAGE_KEY_PREFIX = "version_history_";
const MAX_VERSIONS_DEFAULT = 50;

const generateId = (): string =>
	`ver_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const getChanges = (previous: Record<string, unknown>, current: Record<string, unknown>): VersionChange[] => {
	const changes: VersionChange[] = [];
	const allKeys = new Set([...Object.keys(previous), ...Object.keys(current)]);

	for (const key of allKeys) {
		const prevVal = previous[key];
		const currVal = current[key];

		// Skip internal fields
		if (key.startsWith("_") || key === "updatedAt") continue;

		// Compare values
		const prevStr = JSON.stringify(prevVal);
		const currStr = JSON.stringify(currVal);

		if (prevStr !== currStr) {
			changes.push({
				field: key,
				previousValue: prevVal,
				newValue: currVal,
				displayName: formatFieldName(key),
			});
		}
	}

	return changes;
};

const formatFieldName = (field: string): string => {
	return field
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (str) => str.toUpperCase())
		.trim();
};

export class VersionHistoryService {
	private readonly storage: Storage | null;
	private readonly maxVersions: number;
	private historyCache: Map<string, VersionEntry[]> = new Map();

	constructor(options: VersionHistoryOptions = {}) {
		this.storage = options.storage ?? (typeof localStorage !== "undefined" ? localStorage : null);
		this.maxVersions = options.maxVersionsPerResource ?? MAX_VERSIONS_DEFAULT;
	}

	private getStorageKey(resourceType: string, resourceId: string): string {
		return `${STORAGE_KEY_PREFIX}${resourceType}_${resourceId}`;
	}

	private loadHistory(resourceType: string, resourceId: string): VersionEntry[] {
		const cacheKey = `${resourceType}_${resourceId}`;
		
		if (this.historyCache.has(cacheKey)) {
			return this.historyCache.get(cacheKey)!;
		}

		if (!this.storage) return [];

		try {
			const key = this.getStorageKey(resourceType, resourceId);
			const stored = this.storage.getItem(key);
			const history = stored ? JSON.parse(stored) : [];
			this.historyCache.set(cacheKey, history);
			return history;
		} catch (error) {
			console.warn("[VersionHistory] Failed to load history:", error);
			return [];
		}
	}

	private saveHistory(resourceType: string, resourceId: string, history: VersionEntry[]): void {
		const cacheKey = `${resourceType}_${resourceId}`;
		this.historyCache.set(cacheKey, history);

		if (!this.storage) return;

		try {
			const key = this.getStorageKey(resourceType, resourceId);
			this.storage.setItem(key, JSON.stringify(history));
		} catch (error) {
			console.warn("[VersionHistory] Failed to save history:", error);
		}
	}

	/**
	 * Record a new version of a resource
	 */
	recordVersion<T extends Record<string, unknown>>(
		resourceType: string,
		resourceId: string,
		data: T,
		userId: string,
		userName: string,
		action: "create" | "update" | "restore" = "update",
		comment?: string
	): VersionEntry<T> {
		const history = this.loadHistory(resourceType, resourceId);
		const previousVersion = history[history.length - 1];
		const version = previousVersion ? previousVersion.version + 1 : 1;

		const entry: VersionEntry<T> = {
			id: generateId(),
			version,
			timestamp: new Date().toISOString(),
			userId,
			userName,
			action,
			data: deepClone(data),
			comment,
		};

		// Calculate changes if updating
		if (action === "update" && previousVersion) {
			entry.changes = getChanges(
				previousVersion.data as Record<string, unknown>,
				data
			);
		}

		history.push(entry);

		// Trim to max versions
		if (history.length > this.maxVersions) {
			history.splice(0, history.length - this.maxVersions);
		}

		this.saveHistory(resourceType, resourceId, history);
		return entry;
	}

	/**
	 * Get all versions of a resource
	 */
	getHistory(resourceType: string, resourceId: string): VersionEntry[] {
		return this.loadHistory(resourceType, resourceId).slice().reverse();
	}

	/**
	 * Get a specific version
	 */
	getVersion(resourceType: string, resourceId: string, version: number): VersionEntry | null {
		const history = this.loadHistory(resourceType, resourceId);
		return history.find((v) => v.version === version) ?? null;
	}

	/**
	 * Get the latest version
	 */
	getLatestVersion(resourceType: string, resourceId: string): VersionEntry | null {
		const history = this.loadHistory(resourceType, resourceId);
		return history[history.length - 1] ?? null;
	}

	/**
	 * Compare two versions
	 */
	compareVersions(
		resourceType: string,
		resourceId: string,
		version1: number,
		version2: number
	): VersionChange[] {
		const v1 = this.getVersion(resourceType, resourceId, version1);
		const v2 = this.getVersion(resourceType, resourceId, version2);

		if (!v1 || !v2) return [];

		return getChanges(
			v1.data as Record<string, unknown>,
			v2.data as Record<string, unknown>
		);
	}

	/**
	 * Restore to a previous version
	 */
	restoreVersion<T extends Record<string, unknown>>(
		resourceType: string,
		resourceId: string,
		version: number,
		userId: string,
		userName: string
	): VersionEntry<T> | null {
		const targetVersion = this.getVersion(resourceType, resourceId, version);
		if (!targetVersion) return null;

		return this.recordVersion(
			resourceType,
			resourceId,
			targetVersion.data as T,
			userId,
			userName,
			"restore",
			`Restored to version ${version}`
		);
	}

	/**
	 * Get version count for a resource
	 */
	getVersionCount(resourceType: string, resourceId: string): number {
		return this.loadHistory(resourceType, resourceId).length;
	}

	/**
	 * Delete all versions for a resource
	 */
	deleteHistory(resourceType: string, resourceId: string): void {
		const cacheKey = `${resourceType}_${resourceId}`;
		this.historyCache.delete(cacheKey);

		if (this.storage) {
			const key = this.getStorageKey(resourceType, resourceId);
			this.storage.removeItem(key);
		}
	}

	/**
	 * Get all resources with version history
	 */
	getAllTrackedResources(): Array<{ resourceType: string; resourceId: string; versionCount: number }> {
		if (!this.storage) return [];

		const resources: Array<{ resourceType: string; resourceId: string; versionCount: number }> = [];

		for (let i = 0; i < this.storage.length; i++) {
			const key = this.storage.key(i);
			if (key?.startsWith(STORAGE_KEY_PREFIX)) {
				const parts = key.replace(STORAGE_KEY_PREFIX, "").split("_");
				if (parts.length >= 2) {
					const resourceType = parts[0];
					const resourceId = parts.slice(1).join("_");
					const history = this.loadHistory(resourceType, resourceId);
					resources.push({
						resourceType,
						resourceId,
						versionCount: history.length,
					});
				}
			}
		}

		return resources;
	}

	/**
	 * Format changes for display
	 */
	formatChangesForDisplay(changes: VersionChange[]): string {
		if (!changes.length) return "No changes";

		return changes
			.map((change) => {
				const fieldName = change.displayName || change.field;
				const prevDisplay = this.formatValue(change.previousValue);
				const newDisplay = this.formatValue(change.newValue);
				return `${fieldName}: "${prevDisplay}" → "${newDisplay}"`;
			})
			.join("\n");
	}

	private formatValue(value: unknown): string {
		if (value === null || value === undefined) return "(empty)";
		if (typeof value === "object") return JSON.stringify(value).slice(0, 50);
		return String(value).slice(0, 50);
	}
}

export const versionHistoryService = new VersionHistoryService();
