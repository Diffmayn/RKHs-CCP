/**
 * Services Index
 * 
 * Central export for all application services.
 * Import services from this file for a cleaner import experience.
 */

// Core Services
export { OrderStore, normalizeArticles, createNormalizedArticle } from "./order.service";
export { AuthService, authService } from "./auth.service";

// Infrastructure Services
export { AuditService, auditService } from "./audit.service";
export { VersionHistoryService, versionHistoryService } from "./version-history.service";
export { CollaborationService, collaborationService } from "./collaboration.service";
export { NotificationService, notificationService } from "./notification.service";

// Photo Workflow Services
export { TemplateService, templateService } from "./template.service";
export { BatchUploadService, batchUploadService } from "./batch-upload.service";
export { ImageAnnotationService, imageAnnotationService } from "./image-annotation.service";
export { ImageService, imageService } from "./image.service";

// Analytics & AI Services
export { AnalyticsService, analyticsService, TIME_RANGES } from "./analytics.service";
export { AIAutomationService, aiAutomationService } from "./ai-automation.service";

// Search & Filters
export { AdvancedSearchService, advancedSearchService } from "./advanced-search.service";

// Security Services
export { SecurityService, securityService } from "./security.service";

// Asset Management
export { AssetManagementService, assetManagementService } from "./asset-management.service";

// Integration Services
export {
	CalendarService,
	calendarService,
	ReportExportService,
	reportExportService,
	WebhookService,
	webhookService,
	EmailNotificationService,
	emailNotificationService,
} from "./integration.service";

// UI Services
export { KeyboardShortcutsService, keyboardShortcutsService } from "./keyboard-shortcuts.service";
export { CommentService, commentService } from "./comment.service";

// Offline Support
export { OfflineSupportService, offlineSupportService } from "./offline-support.service";

// Re-export types from the main types file
export type {
	// User & Auth types
	UserRole,
	AuthUser,
	AuthUserRecord,
	AuthFeatures,
	
	// Order types
	PhotoOrder,
	PhotoOrderWithAccess,
	OrderImage,
	ArticleNormalizationInput,
	NormalizedArticle,
	PostProductionConfig,
	PostProductionGenAIConfig,
	
	// Audit types
	AuditEntry,
	AuditAction,
	AuditSeverity,
	AuditQueryOptions,
	
	// Version history types
	OrderVersion,
	VersionChange,
	VersionComparison,
	
	// Collaboration types
	CollaborationUser,
	OrderLock,
	CollaborationEvent,
	CollaborationEventType,
	
	// Template types
	OrderTemplate,
	
	// Batch upload types
	BatchUploadItem,
	BatchUploadProgress,
	BatchUploadStatus,
	
	// Annotation types
	Annotation,
	AnnotationType,
	AnnotationLayer,
	
	// Analytics types
	OrderKPIs,
	TimeRange,
	ChartDataPoint,
	
	// AI types
	BriefGeneratorOptions,
	GeneratedBrief,
	AutoTagResult,
	QualityCheckResult,
	QualityIssue,
	
	// Search types
	FilterCondition,
	FilterGroup,
	FilterOperator,
	SavedSearch,
	
	// Security types
	PasswordHash,
	Session,
	Permission,
	RolePermissions,
	
	// Asset types
	Asset,
	AssetFolder,
	StorageQuota,
	
	// Integration types
	CalendarEvent,
	WebhookConfig,
	EmailTemplate,
	
	// Keyboard types
	KeyboardShortcut,
	ShortcutCategory,
	
	// Offline types
	SyncQueueItem,
	SyncStatus,
	ConflictResolution,
	
	// Storage types
	StorageProvider,
	AuthLogger,
} from "../types";
