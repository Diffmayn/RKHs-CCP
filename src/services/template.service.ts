/**
 * Order Template Service - Save and reuse common order configurations
 * 
 * Allows users to create, manage, and apply templates for
 * faster order creation with consistent settings.
 */

import type { PhotoOrder, ArticleNormalizationInput } from "../types";

export interface OrderTemplate {
	id: string;
	name: string;
	description?: string;
	category?: string;
	isDefault?: boolean;
	isShared?: boolean;
	createdBy: string;
	createdByName: string;
	createdAt: string;
	updatedAt: string;
	usageCount: number;
	lastUsedAt?: string;
	template: OrderTemplateData;
	tags?: string[];
}

export interface OrderTemplateData {
	// Order basics
	titlePrefix?: string;
	titleSuffix?: string;
	method?: string;
	priority?: "low" | "medium" | "high" | "urgent";
	
	// Categorization
	tacticType?: string;
	tactic?: string;
	purchaseGroup?: number;
	
	// Assignment
	defaultPhotographer?: string;
	defaultAssignee?: string;
	
	// Post-production
	postProduction?: {
		type?: string;
		genaiConfig?: {
			operation?: string;
		};
	};
	
	// Timeline
	dueDaysFromCreation?: number;
	
	// Default articles
	defaultArticles?: ArticleNormalizationInput[];
	
	// Tags
	defaultTags?: string[];
	
	// Custom fields
	customFields?: Record<string, unknown>;
	
	// Notes/instructions
	defaultNotes?: string;
	shootingInstructions?: string;
}

export interface TemplateServiceOptions {
	storage?: Storage;
	maxTemplates?: number;
}

const STORAGE_KEY = "order_templates";
const MAX_TEMPLATES = 100;

const generateId = (): string =>
	`tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export class TemplateService {
	private templates: Map<string, OrderTemplate> = new Map();
	private readonly storage: Storage | null;
	private readonly maxTemplates: number;

	constructor(options: TemplateServiceOptions = {}) {
		this.storage = options.storage ?? (typeof localStorage !== "undefined" ? localStorage : null);
		this.maxTemplates = options.maxTemplates ?? MAX_TEMPLATES;
		this.loadTemplates();
	}

	private loadTemplates(): void {
		if (!this.storage) return;

		try {
			const stored = this.storage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored) as OrderTemplate[];
				this.templates = new Map(parsed.map((t) => [t.id, t]));
			}
		} catch (error) {
			console.warn("[TemplateService] Failed to load templates:", error);
		}
	}

	private saveTemplates(): void {
		if (!this.storage) return;

		try {
			const templates = Array.from(this.templates.values());
			this.storage.setItem(STORAGE_KEY, JSON.stringify(templates));
		} catch (error) {
			console.warn("[TemplateService] Failed to save templates:", error);
		}
	}

	/**
	 * Create a new template
	 */
	createTemplate(
		name: string,
		template: OrderTemplateData,
		userId: string,
		userName: string,
		options?: {
			description?: string;
			category?: string;
			isShared?: boolean;
			tags?: string[];
		}
	): OrderTemplate | null {
		if (this.templates.size >= this.maxTemplates) {
			console.warn("[TemplateService] Maximum template limit reached");
			return null;
		}

		const now = new Date().toISOString();
		const newTemplate: OrderTemplate = {
			id: generateId(),
			name,
			description: options?.description,
			category: options?.category,
			isDefault: false,
			isShared: options?.isShared ?? false,
			createdBy: userId,
			createdByName: userName,
			createdAt: now,
			updatedAt: now,
			usageCount: 0,
			template,
			tags: options?.tags,
		};

		this.templates.set(newTemplate.id, newTemplate);
		this.saveTemplates();
		return newTemplate;
	}

	/**
	 * Create template from existing order
	 */
	createFromOrder(
		order: PhotoOrder,
		name: string,
		userId: string,
		userName: string,
		options?: {
			description?: string;
			category?: string;
			includeArticles?: boolean;
		}
	): OrderTemplate | null {
		const templateData: OrderTemplateData = {
			method: order.method,
			priority: order.priority as OrderTemplateData["priority"],
			tacticType: order.tacticType as string | undefined,
			tactic: order.tactic as string | undefined,
			purchaseGroup: order.purchaseGroup,
			postProduction: order.postProduction,
			defaultTags: order.tags,
		};

		if (options?.includeArticles && order.articles) {
			templateData.defaultArticles = order.articles;
		}

		return this.createTemplate(name, templateData, userId, userName, {
			description: options?.description ?? `Created from order ${order.orderNumber}`,
			category: options?.category,
		});
	}

	/**
	 * Update an existing template
	 */
	updateTemplate(
		templateId: string,
		updates: Partial<Omit<OrderTemplate, "id" | "createdBy" | "createdAt">>,
		userId: string
	): OrderTemplate | null {
		const template = this.templates.get(templateId);
		if (!template) return null;

		// Only owner can update (unless admin logic added later)
		if (template.createdBy !== userId) {
			console.warn("[TemplateService] User not authorized to update template");
			return null;
		}

		const updated: OrderTemplate = {
			...template,
			...updates,
			updatedAt: new Date().toISOString(),
		};

		this.templates.set(templateId, updated);
		this.saveTemplates();
		return updated;
	}

	/**
	 * Delete a template
	 */
	deleteTemplate(templateId: string, userId: string): boolean {
		const template = this.templates.get(templateId);
		if (!template) return false;

		if (template.createdBy !== userId) {
			console.warn("[TemplateService] User not authorized to delete template");
			return false;
		}

		this.templates.delete(templateId);
		this.saveTemplates();
		return true;
	}

	/**
	 * Apply a template to create order data
	 */
	applyTemplate(templateId: string): Partial<PhotoOrder> | null {
		const template = this.templates.get(templateId);
		if (!template) return null;

		// Update usage statistics
		template.usageCount++;
		template.lastUsedAt = new Date().toISOString();
		this.saveTemplates();

		const orderData: Partial<PhotoOrder> = {};

		if (template.template.method) {
			orderData.method = template.template.method;
		}
		if (template.template.priority) {
			orderData.priority = template.template.priority;
		}
		if (template.template.tacticType) {
			orderData.tacticType = template.template.tacticType;
		}
		if (template.template.tactic) {
			orderData.tactic = template.template.tactic;
		}
		if (template.template.purchaseGroup) {
			orderData.purchaseGroup = template.template.purchaseGroup;
		}
		if (template.template.postProduction) {
			orderData.postProduction = template.template.postProduction;
		}
		if (template.template.defaultPhotographer) {
			orderData.photographer = template.template.defaultPhotographer;
		}
		if (template.template.defaultAssignee) {
			orderData.assignedTo = template.template.defaultAssignee;
		}
		if (template.template.defaultArticles) {
			orderData.articles = [...template.template.defaultArticles];
		}
		if (template.template.defaultTags) {
			orderData.tags = [...template.template.defaultTags];
		}

		// Calculate deadline if dueDaysFromCreation is set
		if (template.template.dueDaysFromCreation) {
			const deadline = new Date();
			deadline.setDate(deadline.getDate() + template.template.dueDaysFromCreation);
			orderData.deadline = deadline.toISOString().split("T")[0];
		}

		// Generate title if prefix/suffix configured
		if (template.template.titlePrefix || template.template.titleSuffix) {
			const prefix = template.template.titlePrefix ?? "";
			const suffix = template.template.titleSuffix ?? "";
			orderData.title = `${prefix}${suffix}`.trim();
		}

		return orderData;
	}

	/**
	 * Get all templates
	 */
	getAllTemplates(): OrderTemplate[] {
		return Array.from(this.templates.values())
			.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
	}

	/**
	 * Get templates for a user (their own + shared)
	 */
	getTemplatesForUser(userId: string): OrderTemplate[] {
		return this.getAllTemplates().filter(
			(t) => t.createdBy === userId || t.isShared
		);
	}

	/**
	 * Get templates by category
	 */
	getTemplatesByCategory(category: string): OrderTemplate[] {
		return this.getAllTemplates().filter((t) => t.category === category);
	}

	/**
	 * Get popular templates (most used)
	 */
	getPopularTemplates(limit = 10): OrderTemplate[] {
		return this.getAllTemplates()
			.sort((a, b) => b.usageCount - a.usageCount)
			.slice(0, limit);
	}

	/**
	 * Get recently used templates
	 */
	getRecentlyUsedTemplates(userId: string, limit = 5): OrderTemplate[] {
		return this.getTemplatesForUser(userId)
			.filter((t) => t.lastUsedAt)
			.sort((a, b) => new Date(b.lastUsedAt!).getTime() - new Date(a.lastUsedAt!).getTime())
			.slice(0, limit);
	}

	/**
	 * Search templates
	 */
	searchTemplates(query: string, userId: string): OrderTemplate[] {
		const lowerQuery = query.toLowerCase();
		return this.getTemplatesForUser(userId).filter(
			(t) =>
				t.name.toLowerCase().includes(lowerQuery) ||
				t.description?.toLowerCase().includes(lowerQuery) ||
				t.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
		);
	}

	/**
	 * Get a template by ID
	 */
	getTemplate(templateId: string): OrderTemplate | null {
		return this.templates.get(templateId) ?? null;
	}

	/**
	 * Set default template for a user
	 */
	setDefaultTemplate(templateId: string, userId: string): boolean {
		const template = this.templates.get(templateId);
		if (!template) return false;

		// Clear other defaults for this user
		for (const t of this.templates.values()) {
			if (t.createdBy === userId && t.isDefault) {
				t.isDefault = false;
			}
		}

		template.isDefault = true;
		this.saveTemplates();
		return true;
	}

	/**
	 * Get default template for a user
	 */
	getDefaultTemplate(userId: string): OrderTemplate | null {
		for (const template of this.templates.values()) {
			if (template.createdBy === userId && template.isDefault) {
				return template;
			}
		}
		return null;
	}

	/**
	 * Duplicate a template
	 */
	duplicateTemplate(templateId: string, userId: string, userName: string, newName?: string): OrderTemplate | null {
		const original = this.templates.get(templateId);
		if (!original) return null;

		return this.createTemplate(
			newName ?? `${original.name} (Copy)`,
			{ ...original.template },
			userId,
			userName,
			{
				description: original.description,
				category: original.category,
				tags: original.tags ? [...original.tags] : undefined,
			}
		);
	}

	/**
	 * Get all categories
	 */
	getCategories(): string[] {
		const categories = new Set<string>();
		for (const template of this.templates.values()) {
			if (template.category) {
				categories.add(template.category);
			}
		}
		return Array.from(categories).sort();
	}

	/**
	 * Export templates
	 */
	exportTemplates(templateIds?: string[]): string {
		let templates = Array.from(this.templates.values());
		
		if (templateIds) {
			templates = templates.filter((t) => templateIds.includes(t.id));
		}

		return JSON.stringify(templates, null, 2);
	}

	/**
	 * Import templates
	 */
	importTemplates(jsonData: string, userId: string, userName: string): number {
		try {
			const imported = JSON.parse(jsonData) as OrderTemplate[];
			let count = 0;

			for (const template of imported) {
				if (this.templates.size >= this.maxTemplates) break;

				const newTemplate = this.createTemplate(
					template.name,
					template.template,
					userId,
					userName,
					{
						description: template.description,
						category: template.category,
						tags: template.tags,
					}
				);

				if (newTemplate) count++;
			}

			return count;
		} catch (error) {
			console.error("[TemplateService] Import failed:", error);
			return 0;
		}
	}
}

export const templateService = new TemplateService();

// Built-in starter templates
export const STARTER_TEMPLATES: OrderTemplateData[] = [
	{
		titlePrefix: "Product Shoot - ",
		method: "PS",
		priority: "medium",
		dueDaysFromCreation: 7,
		shootingInstructions: "White background, multiple angles, lifestyle context shots",
	},
	{
		titlePrefix: "Lifestyle Shoot - ",
		method: "LS",
		priority: "medium",
		dueDaysFromCreation: 10,
		shootingInstructions: "Natural lighting, lifestyle context, brand colors",
	},
	{
		titlePrefix: "Urgent - ",
		method: "PS",
		priority: "urgent",
		dueDaysFromCreation: 1,
		defaultNotes: "Rush order - priority handling required",
	},
	{
		titlePrefix: "Retouching - ",
		method: "RS",
		priority: "medium",
		dueDaysFromCreation: 3,
		postProduction: { type: "retouching" },
	},
];
