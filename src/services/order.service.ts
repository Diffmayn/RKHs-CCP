import type {
	ArticleNormalizationInput,
	NormalizedArticle,
	PhotoOrder,
} from "../types";

const sanitizeString = (value: unknown): string => {
	if (typeof value !== "string") return "";
	// Basic XSS prevention - strip potentially dangerous characters
	return value
		.trim()
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/javascript:/gi, "");
};

const coerceQuantity = (value: unknown): number | string | "" => {
	if (value === null || value === undefined || value === "") {
		return "";
	}

	if (typeof value === "number") {
		return Number.isNaN(value) ? "" : value;
	}

	const trimmed = sanitizeString(value);
	if (!trimmed) {
		return "";
	}

	const parsed = Number(trimmed);
	return Number.isNaN(parsed) ? trimmed : parsed;
};

const coerceArticleInput = (
	input: ArticleNormalizationInput
): Required<ArticleNormalizationInput> => ({
	name: sanitizeString(input.name),
	ean: sanitizeString(input.ean).replace(/\s+/g, ""),
	articleNumber: sanitizeString(input.articleNumber),
	variant: sanitizeString(input.variant),
	quantity: coerceQuantity(input.quantity),
	status: sanitizeString(input.status),
	notes: sanitizeString(input.notes),
	combinedPhoto: sanitizeString(input.combinedPhoto),
	fileName: sanitizeString(input.fileName),
	contentType: sanitizeString(input.contentType),
	sku: sanitizeString(input.sku),
	description: sanitizeString(input.description),
	category: sanitizeString(input.category),
});

export const PURCHASE_GROUPS: Record<number, string> = {
	100: "Groceries",
	200: "Fresh Products",
	300: "Electronics",
	400: "Home & Garden",
	500: "Fashion",
	600: "Health & Beauty",
	700: "Sports & Leisure",
	800: "Automotive",
	900: "Baby & Kids",
};

export const createNormalizedArticle = (
	payload: ArticleNormalizationInput | string
): NormalizedArticle | null => {
	if (payload === null || payload === undefined) {
		return null;
	}

	if (typeof payload === "string") {
		const text = payload.trim();
		if (!text) {
			return null;
		}

		const eanMatch = text.match(/\[EAN:\s*([^\]]+)\]/i);
		const articleMatch = text.match(/\[Article(?: Number)?:\s*([^\]]+)\]/i);

		const cleanName = text
			.replace(/\[EAN:[^\]]+\]/i, "")
			.replace(/\[Article(?: Number)?:[^\]]+\]/i, "")
			.replace(/\s{2,}/g, " ")
			.trim();

		return createNormalizedArticle({
			name: cleanName,
			ean: eanMatch ? eanMatch[1]?.trim() : "",
			articleNumber: articleMatch ? articleMatch[1]?.trim() : "",
			raw: text,
		} as ArticleNormalizationInput);
	}

	const normalized = coerceArticleInput(payload);
	const primaryLabel =
		normalized.name ||
		normalized.articleNumber ||
		normalized.ean ||
		"Article";

	const detailParts: string[] = [];
	if (normalized.articleNumber) detailParts.push(`Article ${normalized.articleNumber}`);
	if (normalized.ean) detailParts.push(`EAN ${normalized.ean}`);
	if (normalized.variant) detailParts.push(normalized.variant);
	if (normalized.quantity !== "") detailParts.push(`Qty ${normalized.quantity}`);
	if (normalized.contentType) detailParts.push(normalized.contentType);

	const displayText = detailParts.length
		? `${primaryLabel} (${detailParts.join(" • ")})`
		: primaryLabel;

	return {
		name: normalized.name,
		ean: normalized.ean,
		articleNumber: normalized.articleNumber,
		variant: normalized.variant,
		quantity: normalized.quantity,
		status: normalized.status,
		notes: normalized.notes,
		combinedPhoto: normalized.combinedPhoto,
		fileName: normalized.fileName,
		contentType: normalized.contentType,
		displayText,
		raw: payload,
	};
};

export const normalizeArticles = (articles: unknown): NormalizedArticle[] => {
	if (!articles) {
		return [];
	}

	const inputs = Array.isArray(articles) ? articles : [articles];

	return inputs
		.map((item) => {
			if (item && typeof item === "object" && !Array.isArray(item)) {
				const candidate = item as ArticleNormalizationInput;
				const name =
					(candidate.name ??
						candidate.articleName ??
						candidate.title ??
						candidate.description ??
						"") as string;

				const normalizedInput: ArticleNormalizationInput = {
					...candidate,
					name,
					ean:
						(candidate.ean ??
							(candidate as Record<string, unknown>).EAN ??
							(candidate as Record<string, unknown>).barcode ??
							(candidate as Record<string, unknown>).gtin ??
							"") as string,
					articleNumber:
						(candidate.articleNumber ??
							(candidate as Record<string, unknown>).articleNo ??
							(candidate as Record<string, unknown>).sku ??
							(candidate as Record<string, unknown>).id ??
							"") as string,
					variant: (candidate.variant ?? (candidate as Record<string, unknown>).variantName ?? "") as string,
					quantity: (candidate.quantity ?? (candidate as Record<string, unknown>).qty ?? "") as number | string,
					status: candidate.status,
					notes:
						(candidate.notes ??
							(candidate as Record<string, unknown>).comment ??
							(candidate as Record<string, unknown>).details ??
							"") as string,
					combinedPhoto: candidate.combinedPhoto,
					fileName: candidate.fileName,
					contentType: (candidate.contentType ?? (candidate as Record<string, unknown>).contentType ?? "") as string,
				};

				return createNormalizedArticle({ ...normalizedInput, raw: item } as ArticleNormalizationInput);
			}

			return createNormalizedArticle(item as string);
		})
		.filter((article): article is NormalizedArticle => Boolean(article));
};

export const getArticleTextList = (articles: unknown): string[] =>
	normalizeArticles(articles)
		.map((article) => article.displayText)
		.filter(Boolean);

export const formatArticlesAsPlainText = (articles: unknown): string => {
	const list = getArticleTextList(articles);
	return list.length ? list.join(", ") : "";
};

export const renderArticleChips = (articles: unknown, limit = 2): string => {
	const normalized = normalizeArticles(articles);

	if (!normalized.length) {
		return '<div style="margin-top:6px;font-size:12px;color:#9ca3af;">No articles linked</div>';
	}

	const chips = normalized
		.slice(0, limit)
		.map(
			(article) =>
				`<span style="display:inline-flex;align-items:center;padding:3px 10px;background:rgba(196, 139, 90, 0.12);color:#6b5440;border-radius:999px;font-size:11px;font-weight:600;">${
					article.name || article.articleNumber || article.ean || "Article"
				}</span>`
		)
		.join("");

	const extra =
		normalized.length > limit
			? `<span style="display:inline-flex;align-items:center;padding:3px 10px;background:rgba(196, 139, 90, 0.12);color:#a66b38;border-radius:999px;font-size:11px;font-weight:600;">+${
					normalized.length - limit
				} more</span>`
			: "";

	return `<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;">${chips}${extra}</div>`;
};

export const renderArticleCards = (articles: unknown): string => {
	const normalized = normalizeArticles(articles);

	if (!normalized.length) {
		return '<div style="padding:16px;background:rgba(255, 250, 243, 0.8);border:1px dashed rgba(196, 139, 90, 0.4);border-radius:12px;color:#6b5440;font-size:13px;">No article details available for this order.</div>';
	}

	const rows = normalized
		.map((article, index) => {
			const descriptor = article.name || article.displayText || `Article ${index + 1}`;
			const details: string[] = [];
			if (article.articleNumber) details.push(`#${article.articleNumber}`);
			if (article.ean) details.push(`EAN ${article.ean}`);
			if (article.variant) details.push(article.variant);
			if (article.quantity !== "") details.push(`Qty ${article.quantity}`);
			if (article.contentType) details.push(article.contentType);
			const baseText = [descriptor, ...details].join(" • ");
			const noteText = article.notes ? ` – ${article.notes}` : "";

			const background = index % 2 === 0 ? "transparent" : "rgba(253, 244, 230, 0.55)";
			const borderBottom = index < normalized.length - 1 ? "border-bottom:1px solid rgba(196, 139, 90, 0.18);" : "";

			const statusBadge = article.status
				? `<span style="margin-left:12px;background:rgba(127, 162, 132, 0.18);color:#54735d;border-radius:999px;padding:2px 8px;font-size:10px;font-weight:600;white-space:nowrap;">${article.status}</span>`
				: "";

			return `
				<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 12px;${borderBottom}background:${background};">
					<div style="font-size:11px;color:#4b3b2a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${baseText}${noteText}</div>
					${statusBadge}
				</div>
			`;
		})
		.join("");

	return `<div style="background:white;border:1px solid rgba(196, 139, 90, 0.25);border-radius:10px;overflow:hidden;">${rows}</div>`;
};

export interface OrderStoreListener {
	(orders: readonly PhotoOrder[]): void;
}

export class OrderStore {
	private orders: PhotoOrder[];

	private readonly listeners = new Set<OrderStoreListener>();

	private readonly maxOrders: number;

	constructor(initialOrders: PhotoOrder[] = [], maxOrders = 10000) {
		this.orders = [...initialOrders];
		this.maxOrders = maxOrders;
	}

	getAll(): PhotoOrder[] {
		return [...this.orders];
	}

	setAll(orders: PhotoOrder[]): void {
		this.orders = [...orders];
		this.emit();
	}

	upsert(order: PhotoOrder): boolean {
		if (!order?.orderNumber) {
			console.warn("[OrderStore] Cannot upsert order without orderNumber");
			return false;
		}

		const index = this.orders.findIndex((item) => item.orderNumber === order.orderNumber);

		if (index >= 0) {
			this.orders[index] = { ...this.orders[index], ...order };
		} else {
			if (this.orders.length >= this.maxOrders) {
				console.warn(`[OrderStore] Max orders limit (${this.maxOrders}) reached`);
				return false;
			}
			this.orders.push(order);
		}

		this.emit();
		return true;
	}

	patch(orderNumber: string, next: Partial<PhotoOrder>): PhotoOrder | null {
		const index = this.orders.findIndex((item) => item.orderNumber === orderNumber);

		if (index === -1) {
			return null;
		}

		this.orders[index] = { ...this.orders[index], ...next };
		this.emit();
		return this.orders[index];
	}

	remove(orderNumber: string): boolean {
		const initialLength = this.orders.length;
		this.orders = this.orders.filter((item) => item.orderNumber !== orderNumber);
		const changed = this.orders.length !== initialLength;
		if (changed) {
			this.emit();
		}
		return changed;
	}

	findByOrderNumber(orderNumber: string): PhotoOrder | null {
		return this.orders.find((item) => item.orderNumber === orderNumber) ?? null;
	}

	subscribe(listener: OrderStoreListener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	private emit() {
		for (const listener of this.listeners) {
			listener(this.getAll());
		}
	}
}

export const orderHelpers = {
	PURCHASE_GROUPS,
	createNormalizedArticle,
	normalizeArticles,
	getArticleTextList,
	formatArticlesAsPlainText,
	renderArticleChips,
	renderArticleCards,
};

export type { PhotoOrder } from "../types";
