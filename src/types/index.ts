export type UserRole =
	| "Promo Coordinator"
	| "Photographer"
	| "Photo Box"
	| "Agency"
	| "Marketing Manager"
	| "Admin";

export interface AuthFeatures {
	gpt5CodexPreview?: boolean;
	[flag: string]: unknown;
}

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	department?: string;
	purchaseGroups?: number[];
	features?: AuthFeatures;
}

export interface AuthUserRecord {
	password: string;
	user: AuthUser;
}

export interface StorageProvider {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
}

export interface AuthLogger {
	debug?: (...args: unknown[]) => void;
	info?: (...args: unknown[]) => void;
	warn?: (...args: unknown[]) => void;
	error?: (...args: unknown[]) => void;
}

export interface PostProductionGenAIConfig {
	operation?: string;
}

export interface PostProductionConfig {
	type?: string;
	genaiConfig?: PostProductionGenAIConfig;
	[key: string]: unknown;
}

export interface PhotoOrder {
	orderNumber: string;
	title: string;
	status: string;
	method?: string;
	postProduction?: PostProductionConfig;
	purchaseGroup?: number;
	eventId?: string;
	photographer?: string;
	priority?: "low" | "medium" | "high" | "urgent";
	deadline?: string;
	budget?: string;
	createdBy?: string;
	assignedTo?: string;
	// Additional fields for complete order management
	articles?: ArticleNormalizationInput[];
	createdAt?: string;
	updatedAt?: string;
	completedAt?: string;
	tacticType?: string;
	tactic?: string;
	images?: OrderImage[];
	commentCount?: number;
	tags?: string[];
	// Fields used by analytics and search services
	orderId?: string;
	orderOwner?: string;
	orderType?: string;
	shootDate?: string;
	shootBrief?: string;
	shootLocation?: string;
	description?: string;
	location?: string;
	notes?: string;
	[key: string]: unknown;
}

export interface OrderImage {
	id: string;
	url: string;
	thumbnailUrl?: string;
	filename: string;
	mimeType: string;
	size: number;
	width?: number;
	height?: number;
	uploadedAt: string;
	uploadedBy: string;
}

export type PhotoOrderWithAccess = PhotoOrder & {
	hasPurchaseGroupAccess?: boolean;
};

export interface ArticleNormalizationInput {
	name?: string;
	ean?: string;
	articleNumber?: string;
	variant?: string;
	quantity?: number | string;
	status?: string;
	notes?: string;
	combinedPhoto?: string;
	fileName?: string;
	contentType?: string;
	// Additional fields used by search/analytics
	sku?: string;
	description?: string;
	category?: string;
	[key: string]: unknown;
}

export interface NormalizedArticle {
	name: string;
	ean: string;
	articleNumber: string;
	variant: string;
	quantity: number | string | "";
	status: string;
	notes: string;
	combinedPhoto: string;
	fileName: string;
	contentType: string;
	displayText: string;
	raw: unknown;
	// Additional fields for search/analytics
	sku?: string;
	description?: string;
	category?: string;
}

// ============================================
// Audit Service Types
// ============================================
export type AuditAction =
	| "CREATE"
	| "UPDATE"
	| "DELETE"
	| "VIEW"
	| "EXPORT"
	| "IMPORT"
	| "LOGIN"
	| "LOGOUT"
	| "PERMISSION_CHANGE"
	| "STATUS_CHANGE"
	| "ASSIGNMENT"
	| "COMMENT"
	| "UPLOAD"
	| "DOWNLOAD"
	| "APPROVE"
	| "REJECT"
	| "ARCHIVE"
	| "RESTORE";

export type AuditSeverity = "info" | "warning" | "error" | "critical";

export interface AuditEntry {
	id: string;
	timestamp: string;
	userId: string;
	userName: string;
	userRole: UserRole;
	action: AuditAction;
	entityType: string;
	entityId: string;
	details: Record<string, unknown>;
	previousValue?: unknown;
	newValue?: unknown;
	ipAddress?: string;
	userAgent?: string;
	sessionId?: string;
	severity: AuditSeverity;
}

export interface AuditQueryOptions {
	userId?: string;
	action?: AuditAction | AuditAction[];
	entityType?: string;
	entityId?: string;
	startDate?: Date;
	endDate?: Date;
	severity?: AuditSeverity | AuditSeverity[];
	limit?: number;
	offset?: number;
}

// ============================================
// Version History Types
// ============================================
export interface OrderVersion {
	id: string;
	orderId: string;
	version: number;
	timestamp: string;
	userId: string;
	userName: string;
	changes: VersionChange[];
	snapshot: PhotoOrder;
	comment?: string;
}

export interface VersionChange {
	field: string;
	oldValue: unknown;
	newValue: unknown;
	type: "added" | "removed" | "modified";
}

export interface VersionComparison {
	version1: OrderVersion;
	version2: OrderVersion;
	differences: VersionChange[];
}

// ============================================
// Collaboration Types
// ============================================
export interface CollaborationUser {
	userId: string;
	userName: string;
	role: UserRole;
	color: string;
	cursor?: { x: number; y: number };
	lastActivity: number;
}

export interface OrderLock {
	orderId: string;
	userId: string;
	userName: string;
	lockedAt: number;
	expiresAt: number;
}

export type CollaborationEventType =
	| "user_joined"
	| "user_left"
	| "order_locked"
	| "order_unlocked"
	| "order_updated"
	| "cursor_moved"
	| "comment_added";

export interface CollaborationEvent {
	type: CollaborationEventType;
	userId: string;
	userName: string;
	orderId?: string;
	data?: unknown;
	timestamp: number;
}

// ============================================
// Template Types
// ============================================
export interface OrderTemplate {
	id: string;
	name: string;
	description: string;
	category: string;
	orderData: Partial<PhotoOrder>;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	usageCount: number;
	isPublic: boolean;
	tags: string[];
}

// ============================================
// Batch Upload Types
// ============================================
export type BatchUploadStatus =
	| "pending"
	| "uploading"
	| "processing"
	| "completed"
	| "error"
	| "cancelled";

export interface BatchUploadItem {
	id: string;
	file: File;
	status: BatchUploadStatus;
	progress: number;
	error?: string;
	result?: OrderImage;
	retryCount: number;
}

export interface BatchUploadProgress {
	total: number;
	completed: number;
	failed: number;
	inProgress: number;
	percentage: number;
}

// ============================================
// Image Annotation Types
// ============================================
export type AnnotationType =
	| "arrow"
	| "rectangle"
	| "circle"
	| "freehand"
	| "text"
	| "highlight";

export interface Annotation {
	id: string;
	type: AnnotationType;
	color: string;
	strokeWidth: number;
	opacity: number;
	points: { x: number; y: number }[];
	text?: string;
	fontSize?: number;
	createdBy: string;
	createdAt: string;
}

export interface AnnotationLayer {
	imageId: string;
	orderId: string;
	annotations: Annotation[];
	createdAt: string;
	updatedAt: string;
}

// ============================================
// Analytics Types
// ============================================
export interface OrderKPIs {
	totalOrders: number;
	completedOrders: number;
	pendingOrders: number;
	inProgressOrders: number;
	completionRate: number;
	avgCompletionTime: number;
	overdueOrders: number;
	ordersThisMonth: number;
	ordersTrend: number;
}

export interface TimeRange {
	label: string;
	startDate: Date;
	endDate: Date;
}

export interface ChartDataPoint {
	label: string;
	value: number;
	color?: string;
}

// ============================================
// AI Automation Types
// ============================================
export interface BriefGeneratorOptions {
	orderType: string;
	tacticType: string;
	articleCount: number;
	priority: string;
	includePostProduction: boolean;
	style?: "formal" | "casual" | "detailed";
}

export interface GeneratedBrief {
	title: string;
	description: string;
	shootingInstructions: string[];
	technicalRequirements: string[];
	postProductionNotes: string[];
	estimatedDuration: string;
	suggestedTags: string[];
}

export interface AutoTagResult {
	tag: string;
	confidence: number;
	source: "title" | "description" | "content" | "ml";
}

export interface QualityCheckResult {
	score: number;
	grade: "A" | "B" | "C" | "D" | "F";
	issues: QualityIssue[];
	suggestions: string[];
}

export interface QualityIssue {
	field: string;
	severity: "low" | "medium" | "high";
	message: string;
	suggestion?: string;
}

// ============================================
// Advanced Search Types
// ============================================
export type FilterOperator =
	| "equals"
	| "not_equals"
	| "contains"
	| "not_contains"
	| "starts_with"
	| "ends_with"
	| "greater_than"
	| "less_than"
	| "between"
	| "in"
	| "not_in"
	| "is_empty"
	| "is_not_empty";

export interface FilterCondition {
	field: string;
	operator: FilterOperator;
	value: unknown;
	caseSensitive?: boolean;
}

export interface FilterGroup {
	logic: "AND" | "OR";
	conditions: (FilterCondition | FilterGroup)[];
}

export interface SavedSearch {
	id: string;
	name: string;
	description?: string;
	filters: FilterGroup;
	sortBy?: string;
	sortDirection?: "asc" | "desc";
	createdBy: string;
	createdAt: string;
	isPublic: boolean;
	usageCount: number;
}

// ============================================
// Security Types
// ============================================
export interface PasswordHash {
	hash: string;
	salt: string;
	iterations: number;
	algorithm: string;
}

export interface Session {
	id: string;
	userId: string;
	token: string;
	createdAt: number;
	expiresAt: number;
	ipAddress?: string;
	userAgent?: string;
	isActive: boolean;
}

export interface Permission {
	resource: string;
	actions: ("create" | "read" | "update" | "delete" | "admin")[];
}

export interface RolePermissions {
	role: UserRole;
	permissions: Permission[];
}

// ============================================
// Asset Management Types
// ============================================
export interface Asset {
	id: string;
	filename: string;
	originalFilename: string;
	mimeType: string;
	size: number;
	width?: number;
	height?: number;
	url: string;
	thumbnailUrl?: string;
	hash: string;
	folder: string;
	tags: string[];
	metadata: Record<string, unknown>;
	uploadedBy: string;
	uploadedAt: string;
	lastUsedAt?: string;
	usageCount: number;
}

export interface AssetFolder {
	id: string;
	name: string;
	parentId?: string;
	path: string;
	assetCount: number;
	createdBy: string;
	createdAt: string;
}

export interface StorageQuota {
	used: number;
	total: number;
	percentage: number;
}

// ============================================
// Integration Types
// ============================================
export interface CalendarEvent {
	id: string;
	title: string;
	description?: string;
	startDate: Date;
	endDate: Date;
	location?: string;
	orderId?: string;
	attendees?: string[];
	reminders?: number[];
}

export interface WebhookConfig {
	id: string;
	url: string;
	events: string[];
	secret: string;
	isActive: boolean;
	createdAt: string;
	lastTriggeredAt?: string;
	failureCount: number;
}

export interface EmailTemplate {
	id: string;
	name: string;
	subject: string;
	htmlBody: string;
	textBody: string;
	variables: string[];
}

// ============================================
// Keyboard Shortcuts Types
// ============================================
export interface KeyboardShortcut {
	id: string;
	keys: string[];
	description: string;
	action: () => void;
	category: string;
	isChord?: boolean;
	chordSequence?: string[];
}

export interface ShortcutCategory {
	name: string;
	shortcuts: KeyboardShortcut[];
}

// ============================================
// Offline Support Types
// ============================================
export type SyncStatus = "pending" | "syncing" | "synced" | "error" | "conflict";

export interface SyncQueueItem {
	id: string;
	operation: "create" | "update" | "delete";
	entityType: string;
	entityId: string;
	data: unknown;
	timestamp: number;
	retryCount: number;
	status: SyncStatus;
	error?: string;
}

export interface ConflictResolution {
	id: string;
	localData: unknown;
	remoteData: unknown;
	resolvedData?: unknown;
	strategy: "local" | "remote" | "merge" | "manual";
	resolvedAt?: number;
	resolvedBy?: string;
}
