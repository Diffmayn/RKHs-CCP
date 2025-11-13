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
	priority?: string;
	deadline?: string;
	budget?: string;
	createdBy?: string;
	assignedTo?: string;
	[key: string]: unknown;
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
}
