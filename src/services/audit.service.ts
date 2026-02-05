/**
 * Audit Service - Comprehensive audit logging for compliance
 * 
 * Tracks all user actions with timestamps, user info, and details
 * for security, debugging, and regulatory compliance.
 */

export type AuditAction =
	| "login"
	| "logout"
	| "login_failed"
	| "order_create"
	| "order_update"
	| "order_delete"
	| "order_view"
	| "order_assign"
	| "order_status_change"
	| "image_upload"
	| "image_delete"
	| "comment_add"
	| "comment_edit"
	| "comment_delete"
	| "user_create"
	| "user_update"
	| "user_delete"
	| "permission_change"
	| "settings_change"
	| "export_data"
	| "import_data"
	| "template_create"
	| "template_update"
	| "template_delete"
	| "api_call"
	| "error";

export type AuditSeverity = "info" | "warning" | "error" | "critical";

export interface AuditEntry {
	id: string;
	timestamp: string;
	action: AuditAction;
	severity: AuditSeverity;
	userId: string | null;
	userName: string | null;
	userRole: string | null;
	ipAddress?: string;
	userAgent?: string;
	resourceType?: string;
	resourceId?: string;
	details: Record<string, unknown>;
	previousValue?: unknown;
	newValue?: unknown;
	success: boolean;
	errorMessage?: string;
	sessionId?: string;
	duration?: number;
}

export interface AuditFilter {
	startDate?: Date;
	endDate?: Date;
	actions?: AuditAction[];
	userId?: string;
	resourceType?: string;
	resourceId?: string;
	severity?: AuditSeverity[];
	success?: boolean;
}

export interface AuditServiceOptions {
	storage?: Storage;
	maxEntries?: number;
	persistToServer?: boolean;
	serverEndpoint?: string;
}

const STORAGE_KEY = "audit_log";
const MAX_ENTRIES = 10000;

const generateId = (): string =>
	`audit_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

const getSessionId = (): string => {
	if (typeof sessionStorage === "undefined") return "unknown";
	let sessionId = sessionStorage.getItem("audit_session_id");
	if (!sessionId) {
		sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
		sessionStorage.setItem("audit_session_id", sessionId);
	}
	return sessionId;
};

export class AuditService {
	private entries: AuditEntry[] = [];
	private readonly storage: Storage | null;
	private readonly maxEntries: number;
	private readonly persistToServer: boolean;
	private readonly serverEndpoint: string | null;
	private pendingSync: AuditEntry[] = [];

	constructor(options: AuditServiceOptions = {}) {
		this.storage = options.storage ?? (typeof localStorage !== "undefined" ? localStorage : null);
		this.maxEntries = options.maxEntries ?? MAX_ENTRIES;
		this.persistToServer = options.persistToServer ?? false;
		this.serverEndpoint = options.serverEndpoint ?? null;
		this.loadEntries();
	}

	private loadEntries(): void {
		if (!this.storage) return;
		try {
			const stored = this.storage.getItem(STORAGE_KEY);
			if (stored) {
				this.entries = JSON.parse(stored);
			}
		} catch (error) {
			console.warn("[AuditService] Failed to load audit log:", error);
		}
	}

	private saveEntries(): void {
		if (!this.storage) return;
		try {
			// Keep only recent entries to manage storage
			const toSave = this.entries.slice(-this.maxEntries);
			this.storage.setItem(STORAGE_KEY, JSON.stringify(toSave));
		} catch (error) {
			console.warn("[AuditService] Failed to save audit log:", error);
		}
	}

	private async syncToServer(entry: AuditEntry): Promise<void> {
		if (!this.persistToServer || !this.serverEndpoint) return;

		try {
			const response = await fetch(this.serverEndpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(entry),
			});

			if (!response.ok) {
				this.pendingSync.push(entry);
			}
		} catch {
			this.pendingSync.push(entry);
		}
	}

	log(
		action: AuditAction,
		options: {
			userId?: string | null;
			userName?: string | null;
			userRole?: string | null;
			resourceType?: string;
			resourceId?: string;
			details?: Record<string, unknown>;
			previousValue?: unknown;
			newValue?: unknown;
			success?: boolean;
			errorMessage?: string;
			severity?: AuditSeverity;
			duration?: number;
		} = {}
	): AuditEntry {
		const entry: AuditEntry = {
			id: generateId(),
			timestamp: new Date().toISOString(),
			action,
			severity: options.severity ?? this.getSeverityForAction(action, options.success ?? true),
			userId: options.userId ?? null,
			userName: options.userName ?? null,
			userRole: options.userRole ?? null,
			userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
			resourceType: options.resourceType,
			resourceId: options.resourceId,
			details: options.details ?? {},
			previousValue: options.previousValue,
			newValue: options.newValue,
			success: options.success ?? true,
			errorMessage: options.errorMessage,
			sessionId: getSessionId(),
			duration: options.duration,
		};

		this.entries.push(entry);

		// Trim if exceeding max
		if (this.entries.length > this.maxEntries) {
			this.entries = this.entries.slice(-this.maxEntries);
		}

		this.saveEntries();
		this.syncToServer(entry);

		// Log critical events to console
		if (entry.severity === "critical" || entry.severity === "error") {
			console.warn(`[Audit] ${entry.severity.toUpperCase()}: ${action}`, entry);
		}

		return entry;
	}

	private getSeverityForAction(action: AuditAction, success: boolean): AuditSeverity {
		if (!success) {
			if (action === "login_failed") return "warning";
			return "error";
		}

		const criticalActions: AuditAction[] = ["user_delete", "permission_change"];
		const warningActions: AuditAction[] = ["order_delete", "image_delete", "settings_change"];

		if (criticalActions.includes(action)) return "critical";
		if (warningActions.includes(action)) return "warning";
		return "info";
	}

	// Convenience methods
	logLogin(userId: string, userName: string, userRole: string): AuditEntry {
		return this.log("login", { userId, userName, userRole, details: { method: "password" } });
	}

	logLogout(userId: string, userName: string): AuditEntry {
		return this.log("logout", { userId, userName });
	}

	logLoginFailed(attemptedUsername: string, reason: string): AuditEntry {
		return this.log("login_failed", {
			details: { attemptedUsername, reason },
			success: false,
			errorMessage: reason,
		});
	}

	logOrderCreate(userId: string, userName: string, orderId: string, orderData: unknown): AuditEntry {
		return this.log("order_create", {
			userId,
			userName,
			resourceType: "order",
			resourceId: orderId,
			newValue: orderData,
		});
	}

	logOrderUpdate(
		userId: string,
		userName: string,
		orderId: string,
		previousValue: unknown,
		newValue: unknown
	): AuditEntry {
		return this.log("order_update", {
			userId,
			userName,
			resourceType: "order",
			resourceId: orderId,
			previousValue,
			newValue,
		});
	}

	logOrderDelete(userId: string, userName: string, orderId: string, orderData: unknown): AuditEntry {
		return this.log("order_delete", {
			userId,
			userName,
			resourceType: "order",
			resourceId: orderId,
			previousValue: orderData,
			severity: "warning",
		});
	}

	logImageUpload(userId: string, userName: string, orderId: string, imageInfo: unknown): AuditEntry {
		return this.log("image_upload", {
			userId,
			userName,
			resourceType: "image",
			resourceId: orderId,
			details: imageInfo as Record<string, unknown>,
		});
	}

	logError(error: Error, context?: Record<string, unknown>): AuditEntry {
		return this.log("error", {
			success: false,
			errorMessage: error.message,
			details: {
				stack: error.stack,
				...context,
			},
			severity: "error",
		});
	}

	// Query methods
	getEntries(filter?: AuditFilter): AuditEntry[] {
		let results = [...this.entries];

		if (filter) {
			if (filter.startDate) {
				results = results.filter((e) => new Date(e.timestamp) >= filter.startDate!);
			}
			if (filter.endDate) {
				results = results.filter((e) => new Date(e.timestamp) <= filter.endDate!);
			}
			if (filter.actions?.length) {
				results = results.filter((e) => filter.actions!.includes(e.action));
			}
			if (filter.userId) {
				results = results.filter((e) => e.userId === filter.userId);
			}
			if (filter.resourceType) {
				results = results.filter((e) => e.resourceType === filter.resourceType);
			}
			if (filter.resourceId) {
				results = results.filter((e) => e.resourceId === filter.resourceId);
			}
			if (filter.severity?.length) {
				results = results.filter((e) => filter.severity!.includes(e.severity));
			}
			if (filter.success !== undefined) {
				results = results.filter((e) => e.success === filter.success);
			}
		}

		return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
	}

	getRecentEntries(count = 100): AuditEntry[] {
		return this.entries.slice(-count).reverse();
	}

	getEntriesForResource(resourceType: string, resourceId: string): AuditEntry[] {
		return this.getEntries({ resourceType, resourceId });
	}

	getEntriesForUser(userId: string): AuditEntry[] {
		return this.getEntries({ userId });
	}

	getFailedLogins(hours = 24): AuditEntry[] {
		const since = new Date(Date.now() - hours * 60 * 60 * 1000);
		return this.getEntries({
			actions: ["login_failed"],
			startDate: since,
		});
	}

	// Statistics
	getStats(startDate?: Date, endDate?: Date): Record<string, number> {
		const entries = this.getEntries({ startDate, endDate });
		const stats: Record<string, number> = {};

		for (const entry of entries) {
			stats[entry.action] = (stats[entry.action] || 0) + 1;
		}

		return stats;
	}

	// Export for compliance
	exportToCsv(): string {
		const headers = [
			"ID",
			"Timestamp",
			"Action",
			"Severity",
			"User ID",
			"User Name",
			"Resource Type",
			"Resource ID",
			"Success",
			"Error Message",
		];

		const rows = this.entries.map((e) =>
			[
				e.id,
				e.timestamp,
				e.action,
				e.severity,
				e.userId ?? "",
				e.userName ?? "",
				e.resourceType ?? "",
				e.resourceId ?? "",
				e.success,
				e.errorMessage ?? "",
			].join(",")
		);

		return [headers.join(","), ...rows].join("\n");
	}

	exportToJson(): string {
		return JSON.stringify(this.entries, null, 2);
	}

	// Cleanup
	clearOldEntries(daysToKeep = 90): number {
		const cutoff = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
		const originalLength = this.entries.length;
		this.entries = this.entries.filter((e) => new Date(e.timestamp) >= cutoff);
		this.saveEntries();
		return originalLength - this.entries.length;
	}
}

export const auditService = new AuditService();
