/**
 * AI Automation Service
 * 
 * Provides AI-powered features for photo order workflows:
 * - Brief Generator: Auto-generate photo briefs from order context
 * - Auto-Tagging: Suggest tags based on order content
 * - Quality Check: Validate orders and suggest improvements
 * - Smart Suggestions: Recommend similar orders, templates, etc.
 */

import type { PhotoOrder, NormalizedArticle } from "../types";

export interface BriefGeneratorOptions {
	orderType: string;
	articles: NormalizedArticle[];
	additionalContext?: string;
	tone?: "formal" | "casual" | "technical";
	includeDeliveryRequirements?: boolean;
	includeTechnicalSpecs?: boolean;
}

export interface GeneratedBrief {
	title: string;
	overview: string;
	objectives: string[];
	shotList: ShotListItem[];
	technicalRequirements: TechnicalRequirement[];
	deliverables: Deliverable[];
	timeline?: string;
	notes: string[];
}

export interface ShotListItem {
	id: string;
	articleRef?: string;
	shotType: string;
	description: string;
	angle?: string;
	lighting?: string;
	props?: string[];
	priority: "high" | "medium" | "low";
}

export interface TechnicalRequirement {
	category: string;
	requirement: string;
	value: string;
}

export interface Deliverable {
	type: string;
	format: string;
	resolution: string;
	quantity: number;
	notes?: string;
}

export interface TagSuggestion {
	tag: string;
	confidence: number;
	source: "content" | "similar" | "trending" | "category";
	reason: string;
}

export interface QualityCheckResult {
	score: number;
	maxScore: number;
	percentage: number;
	grade: "A" | "B" | "C" | "D" | "F";
	issues: QualityIssue[];
	suggestions: QualitySuggestion[];
	passed: boolean;
}

export interface QualityIssue {
	id: string;
	severity: "error" | "warning" | "info";
	field: string;
	message: string;
	autoFixable: boolean;
	fix?: () => Partial<PhotoOrder>;
}

export interface QualitySuggestion {
	id: string;
	category: string;
	title: string;
	description: string;
	impact: "high" | "medium" | "low";
	effort: "easy" | "moderate" | "complex";
}

export interface SimilarOrderMatch {
	order: PhotoOrder;
	similarity: number;
	matchedFields: string[];
	reason: string;
}

// Shot type definitions by order type
const SHOT_TYPES: Record<string, string[]> = {
	product: ["Hero Shot", "Detail Close-up", "Lifestyle Context", "360° View", "Scale Reference", "Packaging Shot"],
	fashion: ["Front Full", "Back Full", "Side Profile", "Detail/Texture", "Lifestyle", "Flat Lay"],
	food: ["Hero Plated", "Ingredient Spread", "Action Shot", "Overhead", "45° Angle", "Detail"],
	portrait: ["Headshot", "Half Body", "Full Body", "Environmental", "Action Pose", "Group"],
	event: ["Wide Establishing", "Speaker/Presenter", "Audience", "Networking", "Detail/Decor", "Candid"],
	interior: ["Wide Room", "Vignette", "Detail", "Architectural", "Natural Light", "Styled"],
	default: ["Primary", "Secondary", "Detail", "Context", "Alternative Angle"],
};

// Lighting suggestions by shot type
const LIGHTING_SUGGESTIONS: Record<string, string[]> = {
	product: ["Soft diffused", "High-key white", "Dramatic shadows", "Natural window light"],
	fashion: ["Beauty dish", "Soft box", "Natural outdoor", "Mixed ambient/flash"],
	food: ["Natural side light", "Backlit", "Soft overhead", "Dramatic moody"],
	portrait: ["Rembrandt", "Butterfly", "Loop", "Split", "Broad"],
	default: ["Natural", "Soft diffused", "Studio lighting"],
};

// Common quality checks
const QUALITY_RULES = [
	{
		id: "has-shoot-date",
		field: "shootDate",
		check: (order: PhotoOrder) => !!order.shootDate,
		message: "Shoot date is required",
		severity: "error" as const,
		weight: 10,
	},
	{
		id: "has-order-type",
		field: "orderType",
		check: (order: PhotoOrder) => !!order.orderType,
		message: "Order type must be specified",
		severity: "error" as const,
		weight: 10,
	},
	{
		id: "has-articles",
		field: "articles",
		check: (order: PhotoOrder) => (order.articles?.length ?? 0) > 0,
		message: "At least one article is required",
		severity: "error" as const,
		weight: 15,
	},
	{
		id: "has-owner",
		field: "orderOwner",
		check: (order: PhotoOrder) => !!order.orderOwner,
		message: "Order owner should be assigned",
		severity: "warning" as const,
		weight: 5,
	},
	{
		id: "future-date",
		field: "shootDate",
		check: (order: PhotoOrder) => {
			if (!order.shootDate) return true;
			return new Date(order.shootDate) >= new Date(new Date().toDateString());
		},
		message: "Shoot date should be in the future",
		severity: "warning" as const,
		weight: 5,
	},
	{
		id: "article-has-sku",
		field: "articles",
		check: (order: PhotoOrder) => {
			if (!order.articles?.length) return true;
			return order.articles.every((a) => a.sku || a.articleNumber);
		},
		message: "All articles should have a SKU or article number",
		severity: "warning" as const,
		weight: 8,
	},
	{
		id: "reasonable-article-count",
		field: "articles",
		check: (order: PhotoOrder) => (order.articles?.length ?? 0) <= 50,
		message: "Consider splitting orders with more than 50 articles",
		severity: "info" as const,
		weight: 3,
	},
	{
		id: "has-brief",
		field: "shootBrief",
		check: (order: PhotoOrder) => !!order.shootBrief && order.shootBrief.length > 20,
		message: "A detailed brief helps photographers deliver better results",
		severity: "info" as const,
		weight: 5,
	},
];

const generateId = (): string =>
	`${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

export class AIAutomationService {
	private orderHistory: PhotoOrder[] = [];
	private tagFrequency: Map<string, number> = new Map();

	/**
	 * Set historical orders for learning
	 */
	setOrderHistory(orders: PhotoOrder[]): void {
		this.orderHistory = orders;
		this.buildTagFrequency();
	}

	private buildTagFrequency(): void {
		this.tagFrequency.clear();
		for (const order of this.orderHistory) {
			for (const tag of order.tags ?? []) {
				this.tagFrequency.set(tag, (this.tagFrequency.get(tag) ?? 0) + 1);
			}
		}
	}

	/**
	 * Generate a photo brief from order context
	 */
	generateBrief(options: BriefGeneratorOptions): GeneratedBrief {
		const { orderType, articles, tone = "formal", additionalContext } = options;
		const shotTypes = SHOT_TYPES[orderType.toLowerCase()] ?? SHOT_TYPES.default;
		const lightingSuggestions = LIGHTING_SUGGESTIONS[orderType.toLowerCase()] ?? LIGHTING_SUGGESTIONS.default;

		// Generate title
		const title = this.generateBriefTitle(orderType, articles);

		// Generate overview
		const overview = this.generateOverview(orderType, articles, tone);

		// Generate objectives
		const objectives = this.generateObjectives(orderType, articles);

		// Generate shot list
		const shotList = this.generateShotList(articles, shotTypes, lightingSuggestions);

		// Generate technical requirements
		const technicalRequirements = this.generateTechnicalRequirements(orderType);

		// Generate deliverables
		const deliverables = this.generateDeliverables(orderType, articles);

		// Generate notes
		const notes: string[] = [];
		if (additionalContext) {
			notes.push(additionalContext);
		}
		notes.push(...this.generateNotes(orderType, articles));

		return {
			title,
			overview,
			objectives,
			shotList,
			technicalRequirements,
			deliverables,
			notes,
		};
	}

	private generateBriefTitle(orderType: string, articles: NormalizedArticle[]): string {
		const articleCount = articles.length;
		const category = articles[0]?.category ?? orderType;
		const date = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
		
		return `${category} Photo Shoot Brief - ${articleCount} Article${articleCount !== 1 ? "s" : ""} (${date})`;
	}

	private generateOverview(orderType: string, articles: NormalizedArticle[], tone: string): string {
		const articleCount = articles.length;
		const categories = [...new Set(articles.map((a) => a.category).filter(Boolean))];
		const categoryList = categories.length > 0 ? categories.join(", ") : orderType;

		const templates = {
			formal: `This photographic assignment encompasses ${articleCount} item${articleCount !== 1 ? "s" : ""} in the ${categoryList} category. The objective is to create high-quality imagery suitable for marketing and e-commerce applications.`,
			casual: `We need photos for ${articleCount} ${categoryList} item${articleCount !== 1 ? "s" : ""}! Let's make them look amazing for our customers.`,
			technical: `Assignment scope: ${articleCount} SKU${articleCount !== 1 ? "s" : ""} requiring product photography. Categories: ${categoryList}. Output: Multi-format deliverables per specification below.`,
		};

		return templates[tone as keyof typeof templates] ?? templates.formal;
	}

	private generateObjectives(orderType: string, articles: NormalizedArticle[]): string[] {
		const baseObjectives = [
			"Capture images that accurately represent product color, texture, and details",
			"Ensure consistent lighting and styling across all items",
			"Deliver files ready for web and print use",
		];

		const typeObjectives: Record<string, string[]> = {
			product: [
				"Highlight key product features and unique selling points",
				"Create lifestyle context shots showing product in use",
			],
			fashion: [
				"Show garment fit, drape, and movement",
				"Capture fabric texture and color accuracy",
				"Include styling details (buttons, zippers, pockets)",
			],
			food: [
				"Make dishes look appetizing and fresh",
				"Capture steam, texture, and color vibrancy",
				"Show portion size and presentation",
			],
		};

		return [
			...baseObjectives,
			...(typeObjectives[orderType.toLowerCase()] ?? []),
		];
	}

	private generateShotList(
		articles: NormalizedArticle[],
		shotTypes: string[],
		lightingSuggestions: string[]
	): ShotListItem[] {
		const shots: ShotListItem[] = [];

		for (const article of articles.slice(0, 20)) { // Limit to first 20
			const primaryShots = shotTypes.slice(0, 3);
			
			for (let i = 0; i < primaryShots.length; i++) {
				shots.push({
					id: generateId(),
					articleRef: article.sku ?? article.articleNumber,
					shotType: primaryShots[i],
					description: `${primaryShots[i]} of ${article.description ?? article.category ?? "item"}`,
					lighting: lightingSuggestions[i % lightingSuggestions.length],
					priority: i === 0 ? "high" : i === 1 ? "medium" : "low",
				});
			}
		}

		return shots;
	}

	private generateTechnicalRequirements(orderType: string): TechnicalRequirement[] {
		return [
			{ category: "Camera", requirement: "Minimum Resolution", value: "24 megapixels" },
			{ category: "Format", requirement: "File Type", value: "RAW + JPEG" },
			{ category: "Color", requirement: "Color Profile", value: "sRGB for web, Adobe RGB for print" },
			{ category: "Background", requirement: "Primary Background", value: orderType === "product" ? "Pure white (#FFFFFF)" : "Contextual" },
			{ category: "Lighting", requirement: "Color Temperature", value: "5500K daylight balanced" },
			{ category: "Post-Processing", requirement: "Retouching Level", value: "Basic cleanup and color correction" },
		];
	}

	private generateDeliverables(orderType: string, articles: NormalizedArticle[]): Deliverable[] {
		const articleCount = articles.length;

		return [
			{
				type: "Web Optimized",
				format: "JPEG",
				resolution: "2000x2000px",
				quantity: articleCount * 3,
				notes: "Compressed for web, sRGB",
			},
			{
				type: "Print Ready",
				format: "TIFF",
				resolution: "300 DPI, min 3000px",
				quantity: articleCount,
				notes: "Hero shots only, Adobe RGB",
			},
			{
				type: "Social Media",
				format: "JPEG",
				resolution: "1080x1080px",
				quantity: Math.ceil(articleCount / 2),
				notes: "Square crop for Instagram",
			},
			{
				type: "Thumbnails",
				format: "JPEG",
				resolution: "400x400px",
				quantity: articleCount * 3,
				notes: "Quick loading for catalogs",
			},
		];
	}

	private generateNotes(orderType: string, articles: NormalizedArticle[]): string[] {
		const notes: string[] = [];

		// Add type-specific notes
		const typeNotes: Record<string, string[]> = {
			product: [
				"Remove all tags and labels unless specified otherwise",
				"Steam/iron items to remove wrinkles before shooting",
			],
			fashion: [
				"Have steamer on set for garment touch-ups",
				"Coordinate with stylist for accessory pairing",
			],
			food: [
				"Prepare backup portions for key dishes",
				"Have ice on hand for cold beverages",
			],
		};

		notes.push(...(typeNotes[orderType.toLowerCase()] ?? []));

		// Add article-specific notes
		if (articles.length > 10) {
			notes.push(`Large order (${articles.length} items) - consider splitting into multiple sessions`);
		}

		return notes;
	}

	/**
	 * Auto-suggest tags for an order
	 */
	suggestTags(order: Partial<PhotoOrder>): TagSuggestion[] {
		const suggestions: TagSuggestion[] = [];
		const existingTags = new Set(order.tags ?? []);

		// Content-based suggestions
		const contentWords = this.extractContentWords(order);
		for (const word of contentWords) {
			if (!existingTags.has(word)) {
				suggestions.push({
					tag: word,
					confidence: 0.8,
					source: "content",
					reason: `Extracted from order content`,
				});
			}
		}

		// Category-based suggestions
		if (order.orderType) {
			const categoryTags = this.getCategoryTags(order.orderType);
			for (const tag of categoryTags) {
				if (!existingTags.has(tag)) {
					suggestions.push({
						tag,
						confidence: 0.7,
						source: "category",
						reason: `Common tag for ${order.orderType} orders`,
					});
				}
			}
		}

		// Trending tags from history
		const trendingTags = this.getTrendingTags(5);
		for (const tag of trendingTags) {
			if (!existingTags.has(tag) && !suggestions.find((s) => s.tag === tag)) {
				suggestions.push({
					tag,
					confidence: 0.6,
					source: "trending",
					reason: "Frequently used tag",
				});
			}
		}

		// Similar order suggestions
		const similarOrders = this.findSimilarOrders(order as PhotoOrder, 3);
		for (const match of similarOrders) {
			for (const tag of match.order.tags ?? []) {
				if (!existingTags.has(tag) && !suggestions.find((s) => s.tag === tag)) {
					suggestions.push({
						tag,
						confidence: match.similarity * 0.5,
						source: "similar",
						reason: `Used in similar order`,
					});
				}
			}
		}

		// Sort by confidence and limit
		return suggestions
			.sort((a, b) => b.confidence - a.confidence)
			.slice(0, 10);
	}

	private extractContentWords(order: Partial<PhotoOrder>): string[] {
		const words: string[] = [];
		
		// Extract from brief
		if (order.shootBrief) {
			const briefWords = order.shootBrief
				.toLowerCase()
				.split(/\W+/)
				.filter((w) => w.length > 3);
			words.push(...briefWords);
		}

		// Extract from articles
		for (const article of order.articles ?? []) {
			if (article.category) words.push(article.category.toLowerCase());
			if (article.description) {
				const descWords = article.description
					.toLowerCase()
					.split(/\W+/)
					.filter((w) => w.length > 3);
				words.push(...descWords);
			}
		}

		// Deduplicate and return most relevant
		return [...new Set(words)].slice(0, 5);
	}

	private getCategoryTags(orderType: string): string[] {
		const categoryTags: Record<string, string[]> = {
			product: ["product-photography", "e-commerce", "catalog", "white-background"],
			fashion: ["fashion", "apparel", "clothing", "lookbook", "model"],
			food: ["food-photography", "culinary", "menu", "recipe"],
			portrait: ["portrait", "headshot", "professional"],
			event: ["event", "corporate", "conference"],
		};

		return categoryTags[orderType.toLowerCase()] ?? [];
	}

	private getTrendingTags(limit: number): string[] {
		return [...this.tagFrequency.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, limit)
			.map(([tag]) => tag);
	}

	/**
	 * Quality check an order
	 */
	checkQuality(order: PhotoOrder): QualityCheckResult {
		const issues: QualityIssue[] = [];
		let score = 0;
		let maxScore = 0;

		// Run all quality rules
		for (const rule of QUALITY_RULES) {
			maxScore += rule.weight;
			const passed = rule.check(order);

			if (passed) {
				score += rule.weight;
			} else {
				issues.push({
					id: rule.id,
					severity: rule.severity,
					field: rule.field,
					message: rule.message,
					autoFixable: false,
				});
			}
		}

		// Calculate percentage and grade
		const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
		const grade = percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : "F";

		// Generate suggestions based on issues
		const suggestions = this.generateQualitySuggestions(order, issues);

		return {
			score,
			maxScore,
			percentage: Math.round(percentage),
			grade,
			issues,
			suggestions,
			passed: !issues.some((i) => i.severity === "error"),
		};
	}

	private generateQualitySuggestions(order: PhotoOrder, issues: QualityIssue[]): QualitySuggestion[] {
		const suggestions: QualitySuggestion[] = [];

		// Always suggest adding more detail if brief is short
		if (!order.shootBrief || order.shootBrief.length < 100) {
			suggestions.push({
				id: "detailed-brief",
				category: "Documentation",
				title: "Add Detailed Brief",
				description: "Include specific shot requirements, styling notes, and reference images",
				impact: "high",
				effort: "moderate",
			});
		}

		// Suggest template if articles are similar
		if ((order.articles?.length ?? 0) > 5) {
			const categories = new Set(order.articles?.map((a) => a.category).filter(Boolean));
			if (categories.size === 1) {
				suggestions.push({
					id: "use-template",
					category: "Efficiency",
					title: "Save as Template",
					description: "Create a template from this order for similar future shoots",
					impact: "medium",
					effort: "easy",
				});
			}
		}

		// Suggest review if high article count
		if ((order.articles?.length ?? 0) > 20) {
			suggestions.push({
				id: "peer-review",
				category: "Quality Assurance",
				title: "Request Peer Review",
				description: "Large orders benefit from a second set of eyes before submission",
				impact: "medium",
				effort: "easy",
			});
		}

		return suggestions;
	}

	/**
	 * Find similar orders
	 */
	findSimilarOrders(order: PhotoOrder, limit = 5): SimilarOrderMatch[] {
		const matches: SimilarOrderMatch[] = [];

		for (const historicOrder of this.orderHistory) {
			if (historicOrder.orderId === order.orderId) continue;

			const matchedFields: string[] = [];
			let similarity = 0;

			// Check order type
			if (historicOrder.orderType === order.orderType) {
				matchedFields.push("orderType");
				similarity += 0.3;
			}

			// Check article categories
			const currentCategories = new Set(order.articles?.map((a) => a.category).filter(Boolean));
			const historicCategories = new Set(historicOrder.articles?.map((a) => a.category).filter(Boolean));
			const categoryOverlap = [...currentCategories].filter((c) => historicCategories.has(c)).length;
			if (categoryOverlap > 0) {
				matchedFields.push("articleCategories");
				similarity += (categoryOverlap / Math.max(currentCategories.size, 1)) * 0.3;
			}

			// Check tags
			const currentTags = new Set(order.tags ?? []);
			const historicTags = new Set(historicOrder.tags ?? []);
			const tagOverlap = [...currentTags].filter((t) => historicTags.has(t)).length;
			if (tagOverlap > 0) {
				matchedFields.push("tags");
				similarity += (tagOverlap / Math.max(currentTags.size, 1)) * 0.2;
			}

			// Check owner
			if (historicOrder.orderOwner === order.orderOwner) {
				matchedFields.push("orderOwner");
				similarity += 0.1;
			}

			// Check article count similarity
			const currentCount = order.articles?.length ?? 0;
			const historicCount = historicOrder.articles?.length ?? 0;
			const countDiff = Math.abs(currentCount - historicCount);
			if (countDiff <= 5) {
				matchedFields.push("articleCount");
				similarity += 0.1 * (1 - countDiff / 5);
			}

			if (similarity > 0.2) {
				matches.push({
					order: historicOrder,
					similarity,
					matchedFields,
					reason: `Similar ${matchedFields.join(", ")}`,
				});
			}
		}

		return matches
			.sort((a, b) => b.similarity - a.similarity)
			.slice(0, limit);
	}

	/**
	 * Generate smart suggestions for an order
	 */
	getSmartSuggestions(order: PhotoOrder): string[] {
		const suggestions: string[] = [];

		// Similar order suggestions
		const similar = this.findSimilarOrders(order, 1);
		if (similar.length > 0 && similar[0].similarity > 0.5) {
			suggestions.push(`Consider referencing order ${similar[0].order.orderId} for similar styling`);
		}

		// Timing suggestions
		if (order.shootDate) {
			const shootDate = new Date(order.shootDate);
			const daysUntil = Math.ceil((shootDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
			
			if (daysUntil < 3) {
				suggestions.push("⚠️ Shoot date is very soon - ensure all materials are ready");
			} else if (daysUntil > 30) {
				suggestions.push("Consider setting a reminder to review details closer to shoot date");
			}
		}

		// Article-based suggestions
		if ((order.articles?.length ?? 0) > 10) {
			suggestions.push("Large order: Consider scheduling extra time for setup and transitions");
		}

		return suggestions;
	}
}

export const aiAutomationService = new AIAutomationService();
