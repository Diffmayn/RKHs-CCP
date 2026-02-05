/**
 * Advanced Search & Filter Service
 * 
 * Provides comprehensive filtering capabilities:
 * - Multi-criteria filtering with AND/OR logic
 * - Date range filters
 * - Full-text search across all fields
 * - Saved search presets
 * - Smart filter suggestions
 */

import type { PhotoOrder, NormalizedArticle } from "../types";

export type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith" | "gt" | "gte" | "lt" | "lte" | "between" | "in" | "notIn" | "isEmpty" | "isNotEmpty";

export type LogicalOperator = "AND" | "OR";

export interface FilterCondition {
	id: string;
	field: string;
	operator: FilterOperator;
	value: unknown;
	secondaryValue?: unknown; // For "between" operator
}

export interface FilterGroup {
	id: string;
	conditions: FilterCondition[];
	logic: LogicalOperator;
}

export interface SearchQuery {
	id: string;
	name: string;
	description?: string;
	groups: FilterGroup[];
	groupLogic: LogicalOperator;
	fullTextQuery?: string;
	sortBy?: string;
	sortDirection?: "asc" | "desc";
	createdAt: string;
	updatedAt: string;
	isDefault?: boolean;
	isPinned?: boolean;
}

export interface SavedSearch {
	id: string;
	name: string;
	query: SearchQuery;
	createdBy: string;
	createdAt: string;
	lastUsed?: string;
	useCount: number;
	isShared: boolean;
}

export interface SearchResult<T> {
	items: T[];
	totalCount: number;
	filteredCount: number;
	query: SearchQuery;
	executionTimeMs: number;
	highlights?: Map<string, string[]>;
}

export interface QuickFilter {
	id: string;
	label: string;
	icon?: string;
	condition: FilterCondition;
	count?: number;
}

export interface SearchSuggestion {
	type: "field" | "value" | "operator" | "saved";
	text: string;
	description?: string;
	action: () => void;
}

// Searchable fields configuration
const SEARCHABLE_FIELDS: Record<string, { type: string; label: string; operators: FilterOperator[] }> = {
	orderId: { type: "string", label: "Order ID", operators: ["equals", "contains", "startsWith"] },
	orderOwner: { type: "string", label: "Order Owner", operators: ["equals", "contains", "in", "isEmpty"] },
	orderType: { type: "string", label: "Order Type", operators: ["equals", "in"] },
	status: { type: "string", label: "Status", operators: ["equals", "in", "notIn"] },
	shootDate: { type: "date", label: "Shoot Date", operators: ["equals", "gt", "gte", "lt", "lte", "between"] },
	createdAt: { type: "date", label: "Created Date", operators: ["gt", "gte", "lt", "lte", "between"] },
	updatedAt: { type: "date", label: "Updated Date", operators: ["gt", "gte", "lt", "lte", "between"] },
	shootBrief: { type: "string", label: "Brief", operators: ["contains", "isEmpty", "isNotEmpty"] },
	tags: { type: "array", label: "Tags", operators: ["contains", "in"] },
	"articles.length": { type: "number", label: "Article Count", operators: ["equals", "gt", "gte", "lt", "lte", "between"] },
	"articles.sku": { type: "string", label: "Article SKU", operators: ["equals", "contains", "in"] },
	"articles.category": { type: "string", label: "Article Category", operators: ["equals", "in"] },
};

const generateId = (): string =>
	`search_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

export class AdvancedSearchService {
	private savedSearches: Map<string, SavedSearch> = new Map();
	private recentSearches: SearchQuery[] = [];
	private storageKey = "rkhPhotoOrders_savedSearches";

	constructor() {
		this.loadSavedSearches();
	}

	/**
	 * Load saved searches from storage
	 */
	private loadSavedSearches(): void {
		try {
			const stored = localStorage.getItem(this.storageKey);
			if (stored) {
				const searches = JSON.parse(stored) as SavedSearch[];
				for (const search of searches) {
					this.savedSearches.set(search.id, search);
				}
			}
		} catch {
			console.warn("Failed to load saved searches");
		}
	}

	/**
	 * Persist saved searches
	 */
	private persistSavedSearches(): void {
		try {
			const searches = [...this.savedSearches.values()];
			localStorage.setItem(this.storageKey, JSON.stringify(searches));
		} catch {
			console.warn("Failed to persist saved searches");
		}
	}

	/**
	 * Get searchable fields configuration
	 */
	getSearchableFields(): typeof SEARCHABLE_FIELDS {
		return SEARCHABLE_FIELDS;
	}

	/**
	 * Create an empty search query
	 */
	createQuery(name = "New Search"): SearchQuery {
		return {
			id: generateId(),
			name,
			groups: [
				{
					id: generateId(),
					conditions: [],
					logic: "AND",
				},
			],
			groupLogic: "AND",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
	}

	/**
	 * Add a filter condition to a query
	 */
	addCondition(query: SearchQuery, groupId: string, condition: Omit<FilterCondition, "id">): SearchQuery {
		const group = query.groups.find((g) => g.id === groupId);
		if (!group) return query;

		group.conditions.push({
			...condition,
			id: generateId(),
		});

		query.updatedAt = new Date().toISOString();
		return { ...query };
	}

	/**
	 * Remove a filter condition
	 */
	removeCondition(query: SearchQuery, groupId: string, conditionId: string): SearchQuery {
		const group = query.groups.find((g) => g.id === groupId);
		if (!group) return query;

		group.conditions = group.conditions.filter((c) => c.id !== conditionId);
		query.updatedAt = new Date().toISOString();
		return { ...query };
	}

	/**
	 * Add a filter group
	 */
	addGroup(query: SearchQuery): SearchQuery {
		query.groups.push({
			id: generateId(),
			conditions: [],
			logic: "AND",
		});
		query.updatedAt = new Date().toISOString();
		return { ...query };
	}

	/**
	 * Execute search
	 */
	search(orders: PhotoOrder[], query: SearchQuery): SearchResult<PhotoOrder> {
		const startTime = performance.now();
		
		let results = [...orders];
		const highlights = new Map<string, string[]>();

		// Apply full-text search first
		if (query.fullTextQuery && query.fullTextQuery.trim()) {
			const searchTerms = query.fullTextQuery.toLowerCase().split(/\s+/);
			results = results.filter((order) => {
				const searchableText = this.getSearchableText(order).toLowerCase();
				return searchTerms.every((term) => searchableText.includes(term));
			});
		}

		// Apply filter groups
		if (query.groups.length > 0) {
			results = results.filter((order) => {
				const groupResults = query.groups.map((group) => this.evaluateGroup(order, group));
				
				if (query.groupLogic === "AND") {
					return groupResults.every((r) => r);
				} else {
					return groupResults.some((r) => r);
				}
			});
		}

		// Apply sorting
		if (query.sortBy) {
			results.sort((a, b) => {
				const aVal = this.getFieldValue(a, query.sortBy!);
				const bVal = this.getFieldValue(b, query.sortBy!);
				
				let comparison = 0;
				if (aVal === bVal) comparison = 0;
				else if (aVal === null || aVal === undefined) comparison = 1;
				else if (bVal === null || bVal === undefined) comparison = -1;
				else if (typeof aVal === "string" && typeof bVal === "string") {
					comparison = aVal.localeCompare(bVal);
				} else if (aVal < bVal) comparison = -1;
				else comparison = 1;

				return query.sortDirection === "desc" ? -comparison : comparison;
			});
		}

		const endTime = performance.now();

		return {
			items: results,
			totalCount: orders.length,
			filteredCount: results.length,
			query,
			executionTimeMs: Math.round(endTime - startTime),
			highlights,
		};
	}

	/**
	 * Get all searchable text from an order
	 */
	private getSearchableText(order: PhotoOrder): string {
		const parts: string[] = [
			order.orderId ?? "",
			order.orderOwner ?? "",
			order.orderType ?? "",
			order.status ?? "",
			order.shootBrief ?? "",
			...(order.tags ?? []),
		];

		// Add article info
		for (const article of order.articles ?? []) {
			parts.push(
				article.sku ?? "",
				article.articleNumber ?? "",
				article.description ?? "",
				article.category ?? ""
			);
		}

		return parts.join(" ");
	}

	/**
	 * Evaluate a filter group against an order
	 */
	private evaluateGroup(order: PhotoOrder, group: FilterGroup): boolean {
		if (group.conditions.length === 0) return true;

		const results = group.conditions.map((condition) => 
			this.evaluateCondition(order, condition)
		);

		if (group.logic === "AND") {
			return results.every((r) => r);
		} else {
			return results.some((r) => r);
		}
	}

	/**
	 * Evaluate a single filter condition
	 */
	private evaluateCondition(order: PhotoOrder, condition: FilterCondition): boolean {
		const fieldValue = this.getFieldValue(order, condition.field);
		const { operator, value, secondaryValue } = condition;

		switch (operator) {
			case "equals":
				return fieldValue === value;
			
			case "contains":
				if (Array.isArray(fieldValue)) {
					return fieldValue.some((v) => 
						String(v).toLowerCase().includes(String(value).toLowerCase())
					);
				}
				return String(fieldValue ?? "").toLowerCase().includes(String(value).toLowerCase());
			
			case "startsWith":
				return String(fieldValue ?? "").toLowerCase().startsWith(String(value).toLowerCase());
			
			case "endsWith":
				return String(fieldValue ?? "").toLowerCase().endsWith(String(value).toLowerCase());
			
			case "gt":
				return this.compareValues(fieldValue, value) > 0;
			
			case "gte":
				return this.compareValues(fieldValue, value) >= 0;
			
			case "lt":
				return this.compareValues(fieldValue, value) < 0;
			
			case "lte":
				return this.compareValues(fieldValue, value) <= 0;
			
			case "between":
				return this.compareValues(fieldValue, value) >= 0 && 
				       this.compareValues(fieldValue, secondaryValue) <= 0;
			
			case "in":
				if (!Array.isArray(value)) return false;
				if (Array.isArray(fieldValue)) {
					return (value as unknown[]).some((v) => fieldValue.includes(v));
				}
				return (value as unknown[]).includes(fieldValue);
			
			case "notIn":
				if (!Array.isArray(value)) return true;
				if (Array.isArray(fieldValue)) {
					return !(value as unknown[]).some((v) => fieldValue.includes(v));
				}
				return !(value as unknown[]).includes(fieldValue);
			
			case "isEmpty":
				return fieldValue === null || fieldValue === undefined || fieldValue === "" || 
				       (Array.isArray(fieldValue) && fieldValue.length === 0);
			
			case "isNotEmpty":
				return fieldValue !== null && fieldValue !== undefined && fieldValue !== "" &&
				       (!Array.isArray(fieldValue) || fieldValue.length > 0);
			
			default:
				return true;
		}
	}

	/**
	 * Get field value from order using dot notation
	 */
	private getFieldValue(order: PhotoOrder, field: string): unknown {
		// Handle special computed fields
		if (field === "articles.length") {
			return order.articles?.length ?? 0;
		}

		// Handle array field searches (e.g., articles.sku)
		if (field.startsWith("articles.")) {
			const articleField = field.replace("articles.", "") as keyof NormalizedArticle;
			return order.articles?.map((a) => a[articleField]).filter(Boolean) ?? [];
		}

		// Handle dot notation for nested fields
		const parts = field.split(".");
		let value: unknown = order;
		
		for (const part of parts) {
			if (value === null || value === undefined) return undefined;
			value = (value as Record<string, unknown>)[part];
		}

		return value;
	}

	/**
	 * Compare two values (handles dates, numbers, strings)
	 */
	private compareValues(a: unknown, b: unknown): number {
		// Handle dates
		if (a instanceof Date && b instanceof Date) {
			return a.getTime() - b.getTime();
		}
		if (typeof a === "string" && typeof b === "string") {
			const dateA = Date.parse(a);
			const dateB = Date.parse(b);
			if (!isNaN(dateA) && !isNaN(dateB)) {
				return dateA - dateB;
			}
		}

		// Handle numbers
		const numA = Number(a);
		const numB = Number(b);
		if (!isNaN(numA) && !isNaN(numB)) {
			return numA - numB;
		}

		// String comparison
		return String(a ?? "").localeCompare(String(b ?? ""));
	}

	/**
	 * Generate quick filters based on current data
	 */
	generateQuickFilters(orders: PhotoOrder[]): QuickFilter[] {
		const filters: QuickFilter[] = [];

		// Status filters
		const statusCounts: Record<string, number> = {};
		for (const order of orders) {
			const status = order.status ?? "unknown";
			statusCounts[status] = (statusCounts[status] ?? 0) + 1;
		}

		for (const [status, count] of Object.entries(statusCounts)) {
			filters.push({
				id: `status-${status}`,
				label: status.charAt(0).toUpperCase() + status.slice(1),
				condition: { id: generateId(), field: "status", operator: "equals", value: status },
				count,
			});
		}

		// Date-based filters
		const today = new Date();
		const todayStr = today.toISOString().split("T")[0];
		const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

		filters.push({
			id: "shoots-today",
			label: "Shoots Today",
			icon: "📅",
			condition: { id: generateId(), field: "shootDate", operator: "equals", value: todayStr },
			count: orders.filter((o) => o.shootDate === todayStr).length,
		});

		filters.push({
			id: "created-this-week",
			label: "Created This Week",
			icon: "🆕",
			condition: { id: generateId(), field: "createdAt", operator: "gte", value: weekAgo },
			count: orders.filter((o) => (o.createdAt ?? "") >= weekAgo).length,
		});

		// Type filters
		const typeCounts: Record<string, number> = {};
		for (const order of orders) {
			const type = order.orderType ?? "unknown";
			typeCounts[type] = (typeCounts[type] ?? 0) + 1;
		}

		for (const [type, count] of Object.entries(typeCounts)) {
			filters.push({
				id: `type-${type}`,
				label: type,
				condition: { id: generateId(), field: "orderType", operator: "equals", value: type },
				count,
			});
		}

		return filters;
	}

	/**
	 * Save a search
	 */
	saveSearch(query: SearchQuery, name: string, userId: string): SavedSearch {
		const saved: SavedSearch = {
			id: generateId(),
			name,
			query: { ...query, name },
			createdBy: userId,
			createdAt: new Date().toISOString(),
			useCount: 0,
			isShared: false,
		};

		this.savedSearches.set(saved.id, saved);
		this.persistSavedSearches();

		return saved;
	}

	/**
	 * Get all saved searches
	 */
	getSavedSearches(userId?: string): SavedSearch[] {
		const searches = [...this.savedSearches.values()];
		
		if (userId) {
			return searches.filter((s) => s.createdBy === userId || s.isShared);
		}
		
		return searches;
	}

	/**
	 * Delete a saved search
	 */
	deleteSavedSearch(searchId: string): boolean {
		const deleted = this.savedSearches.delete(searchId);
		if (deleted) {
			this.persistSavedSearches();
		}
		return deleted;
	}

	/**
	 * Record search usage
	 */
	recordSearchUsage(searchId: string): void {
		const search = this.savedSearches.get(searchId);
		if (search) {
			search.lastUsed = new Date().toISOString();
			search.useCount++;
			this.persistSavedSearches();
		}
	}

	/**
	 * Get recent searches
	 */
	getRecentSearches(): SearchQuery[] {
		return this.recentSearches.slice(0, 10);
	}

	/**
	 * Add to recent searches
	 */
	addToRecentSearches(query: SearchQuery): void {
		// Remove duplicate
		this.recentSearches = this.recentSearches.filter((q) => q.id !== query.id);
		
		// Add to front
		this.recentSearches.unshift(query);
		
		// Keep only last 10
		this.recentSearches = this.recentSearches.slice(0, 10);
	}

	/**
	 * Build a date range filter
	 */
	buildDateRangeFilter(field: string, start: Date, end: Date): FilterCondition {
		return {
			id: generateId(),
			field,
			operator: "between",
			value: start.toISOString(),
			secondaryValue: end.toISOString(),
		};
	}

	/**
	 * Build a quick filter for common scenarios
	 */
	buildQuickFilter(type: "myOrders" | "pending" | "thisWeek" | "overdue", userId?: string): SearchQuery {
		const query = this.createQuery(type);

		switch (type) {
			case "myOrders":
				if (userId) {
					this.addCondition(query, query.groups[0].id, {
						field: "orderOwner",
						operator: "equals",
						value: userId,
					});
				}
				break;

			case "pending":
				this.addCondition(query, query.groups[0].id, {
					field: "status",
					operator: "in",
					value: ["pending", "draft", "in-progress"],
				});
				break;

			case "thisWeek": {
				const now = new Date();
				const weekStart = new Date(now);
				weekStart.setDate(now.getDate() - now.getDay());
				weekStart.setHours(0, 0, 0, 0);
				
				const weekEnd = new Date(weekStart);
				weekEnd.setDate(weekStart.getDate() + 6);
				weekEnd.setHours(23, 59, 59, 999);

				this.addCondition(query, query.groups[0].id, {
					field: "shootDate",
					operator: "between",
					value: weekStart.toISOString(),
					secondaryValue: weekEnd.toISOString(),
				});
				break;
			}

			case "overdue": {
				const today = new Date();
				today.setHours(0, 0, 0, 0);

				this.addCondition(query, query.groups[0].id, {
					field: "shootDate",
					operator: "lt",
					value: today.toISOString(),
				});
				this.addCondition(query, query.groups[0].id, {
					field: "status",
					operator: "notIn",
					value: ["complete", "delivered", "cancelled"],
				});
				break;
			}
		}

		return query;
	}
}

export const advancedSearchService = new AdvancedSearchService();
