/**
 * Asset Management Service
 * 
 * Provides comprehensive asset/media library management:
 * - Asset library with metadata
 * - Duplicate detection
 * - Storage management and quotas
 * - Asset categorization and tagging
 * - Usage tracking
 */

export interface Asset {
	id: string;
	filename: string;
	originalFilename: string;
	mimeType: string;
	size: number;
	width?: number;
	height?: number;
	duration?: number; // For video/audio
	hash: string; // For duplicate detection
	thumbnailUrl?: string;
	url: string;
	folder: string;
	tags: string[];
	metadata: AssetMetadata;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	usageCount: number;
	lastUsed?: string;
}

export interface AssetMetadata {
	title?: string;
	description?: string;
	alt?: string;
	copyright?: string;
	license?: string;
	exif?: Record<string, unknown>;
	customFields?: Record<string, string>;
}

export interface AssetFolder {
	id: string;
	name: string;
	path: string;
	parentId?: string;
	assetCount: number;
	createdAt: string;
	createdBy: string;
}

export interface StorageQuota {
	used: number;
	limit: number;
	remaining: number;
	percentage: number;
}

export interface DuplicateMatch {
	asset: Asset;
	similarity: number;
	matchType: "exact" | "similar" | "resized";
}

export interface AssetSearchOptions {
	query?: string;
	folder?: string;
	tags?: string[];
	mimeTypes?: string[];
	minSize?: number;
	maxSize?: number;
	minDate?: string;
	maxDate?: string;
	sortBy?: "name" | "date" | "size" | "usage";
	sortDirection?: "asc" | "desc";
	limit?: number;
	offset?: number;
}

export interface AssetSearchResult {
	assets: Asset[];
	totalCount: number;
	hasMore: boolean;
}

export interface AssetUsage {
	orderId: string;
	orderName?: string;
	field: string;
	usedAt: string;
}

const generateId = (): string =>
	`asset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Supported file types
const SUPPORTED_TYPES: Record<string, string[]> = {
	image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/tiff", "image/bmp"],
	video: ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"],
	audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/aac"],
	document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};

// Default storage limit (5GB)
const DEFAULT_STORAGE_LIMIT = 5 * 1024 * 1024 * 1024;

export class AssetManagementService {
	private assets: Map<string, Asset> = new Map();
	private folders: Map<string, AssetFolder> = new Map();
	private usageMap: Map<string, AssetUsage[]> = new Map();
	private hashIndex: Map<string, string[]> = new Map(); // hash -> asset IDs
	private storageLimit: number = DEFAULT_STORAGE_LIMIT;
	private storageUsed: number = 0;

	private listeners = new Set<(event: AssetEvent) => void>();

	constructor() {
		this.initializeDefaultFolders();
	}

	private initializeDefaultFolders(): void {
		const defaultFolders = [
			{ id: "root", name: "All Assets", path: "/" },
			{ id: "products", name: "Products", path: "/products" },
			{ id: "lifestyle", name: "Lifestyle", path: "/lifestyle" },
			{ id: "campaigns", name: "Campaigns", path: "/campaigns" },
			{ id: "templates", name: "Templates", path: "/templates" },
			{ id: "archive", name: "Archive", path: "/archive" },
		];

		for (const folder of defaultFolders) {
			this.folders.set(folder.id, {
				...folder,
				assetCount: 0,
				createdAt: new Date().toISOString(),
				createdBy: "system",
			});
		}
	}

	/**
	 * Upload a new asset
	 */
	async uploadAsset(
		file: File,
		folder: string = "/",
		metadata: Partial<AssetMetadata> = {},
		userId: string
	): Promise<{ success: boolean; asset?: Asset; error?: string }> {
		// Check file type
		const category = this.getFileCategory(file.type);
		if (!category) {
			return { success: false, error: `Unsupported file type: ${file.type}` };
		}

		// Check storage quota
		if (this.storageUsed + file.size > this.storageLimit) {
			return { success: false, error: "Storage quota exceeded" };
		}

		// Calculate hash for duplicate detection
		const hash = await this.calculateHash(file);

		// Check for duplicates
		const duplicates = this.findDuplicatesByHash(hash);
		if (duplicates.length > 0) {
			return {
				success: false,
				error: `Duplicate file detected. Matches: ${duplicates[0].asset.filename}`,
			};
		}

		// Get image dimensions if applicable
		let dimensions: { width: number; height: number } | undefined;
		if (category === "image") {
			dimensions = await this.getImageDimensions(file);
		}

		// Create unique filename
		const ext = file.name.split(".").pop() ?? "";
		const filename = `${generateId()}.${ext}`;

		// Create data URL for storage (in production, upload to cloud storage)
		const url = await this.fileToDataUrl(file);
		const thumbnailUrl = category === "image" ? await this.generateThumbnail(file) : undefined;

		const asset: Asset = {
			id: generateId(),
			filename,
			originalFilename: file.name,
			mimeType: file.type,
			size: file.size,
			width: dimensions?.width,
			height: dimensions?.height,
			hash,
			thumbnailUrl,
			url,
			folder,
			tags: [],
			metadata: {
				title: file.name.replace(/\.[^/.]+$/, ""),
				...metadata,
			},
			createdBy: userId,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			usageCount: 0,
		};

		// Store asset
		this.assets.set(asset.id, asset);

		// Update hash index
		const hashAssets = this.hashIndex.get(hash) ?? [];
		hashAssets.push(asset.id);
		this.hashIndex.set(hash, hashAssets);

		// Update storage usage
		this.storageUsed += file.size;

		// Update folder count
		this.updateFolderCount(folder, 1);

		// Notify listeners
		this.emit({ type: "upload", asset });

		return { success: true, asset };
	}

	/**
	 * Get an asset by ID
	 */
	getAsset(assetId: string): Asset | undefined {
		return this.assets.get(assetId);
	}

	/**
	 * Update asset metadata
	 */
	updateAsset(assetId: string, updates: Partial<Asset>): Asset | undefined {
		const asset = this.assets.get(assetId);
		if (!asset) return undefined;

		const updatedAsset: Asset = {
			...asset,
			...updates,
			id: asset.id, // Prevent ID change
			updatedAt: new Date().toISOString(),
		};

		this.assets.set(assetId, updatedAsset);
		this.emit({ type: "update", asset: updatedAsset });

		return updatedAsset;
	}

	/**
	 * Delete an asset
	 */
	deleteAsset(assetId: string): boolean {
		const asset = this.assets.get(assetId);
		if (!asset) return false;

		// Check if asset is in use
		const usages = this.usageMap.get(assetId);
		if (usages && usages.length > 0) {
			console.warn(`Asset ${assetId} is in use by ${usages.length} orders`);
		}

		// Remove from storage
		this.assets.delete(assetId);

		// Update hash index
		const hashAssets = this.hashIndex.get(asset.hash);
		if (hashAssets) {
			const index = hashAssets.indexOf(assetId);
			if (index > -1) {
				hashAssets.splice(index, 1);
			}
		}

		// Update storage usage
		this.storageUsed -= asset.size;

		// Update folder count
		this.updateFolderCount(asset.folder, -1);

		// Clean up usage tracking
		this.usageMap.delete(assetId);

		this.emit({ type: "delete", asset });

		return true;
	}

	/**
	 * Move asset to folder
	 */
	moveAsset(assetId: string, targetFolder: string): boolean {
		const asset = this.assets.get(assetId);
		if (!asset) return false;

		const oldFolder = asset.folder;
		asset.folder = targetFolder;
		asset.updatedAt = new Date().toISOString();

		this.updateFolderCount(oldFolder, -1);
		this.updateFolderCount(targetFolder, 1);

		this.emit({ type: "move", asset });

		return true;
	}

	/**
	 * Search assets
	 */
	search(options: AssetSearchOptions = {}): AssetSearchResult {
		let results = [...this.assets.values()];

		// Text search
		if (options.query) {
			const query = options.query.toLowerCase();
			results = results.filter((asset) =>
				asset.filename.toLowerCase().includes(query) ||
				asset.originalFilename.toLowerCase().includes(query) ||
				asset.metadata.title?.toLowerCase().includes(query) ||
				asset.metadata.description?.toLowerCase().includes(query) ||
				asset.tags.some((tag) => tag.toLowerCase().includes(query))
			);
		}

		// Folder filter
		if (options.folder && options.folder !== "/") {
			results = results.filter((asset) =>
				asset.folder === options.folder || asset.folder.startsWith(options.folder + "/")
			);
		}

		// Tags filter
		if (options.tags && options.tags.length > 0) {
			results = results.filter((asset) =>
				options.tags!.every((tag) => asset.tags.includes(tag))
			);
		}

		// MIME type filter
		if (options.mimeTypes && options.mimeTypes.length > 0) {
			results = results.filter((asset) =>
				options.mimeTypes!.includes(asset.mimeType)
			);
		}

		// Size filters
		if (options.minSize !== undefined) {
			results = results.filter((asset) => asset.size >= options.minSize!);
		}
		if (options.maxSize !== undefined) {
			results = results.filter((asset) => asset.size <= options.maxSize!);
		}

		// Date filters
		if (options.minDate) {
			results = results.filter((asset) => asset.createdAt >= options.minDate!);
		}
		if (options.maxDate) {
			results = results.filter((asset) => asset.createdAt <= options.maxDate!);
		}

		// Sort
		const sortBy = options.sortBy ?? "date";
		const sortDir = options.sortDirection ?? "desc";
		results.sort((a, b) => {
			let comparison = 0;
			switch (sortBy) {
				case "name":
					comparison = a.filename.localeCompare(b.filename);
					break;
				case "date":
					comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
					break;
				case "size":
					comparison = a.size - b.size;
					break;
				case "usage":
					comparison = a.usageCount - b.usageCount;
					break;
			}
			return sortDir === "desc" ? -comparison : comparison;
		});

		const totalCount = results.length;

		// Pagination
		const offset = options.offset ?? 0;
		const limit = options.limit ?? 50;
		results = results.slice(offset, offset + limit);

		return {
			assets: results,
			totalCount,
			hasMore: offset + limit < totalCount,
		};
	}

	/**
	 * Find duplicates by hash
	 */
	findDuplicatesByHash(hash: string): DuplicateMatch[] {
		const assetIds = this.hashIndex.get(hash) ?? [];
		return assetIds
			.map((id) => this.assets.get(id))
			.filter((a): a is Asset => a !== undefined)
			.map((asset) => ({
				asset,
				similarity: 1,
				matchType: "exact" as const,
			}));
	}

	/**
	 * Find similar assets (by metadata/tags)
	 */
	findSimilarAssets(assetId: string, limit = 10): Asset[] {
		const asset = this.assets.get(assetId);
		if (!asset) return [];

		const candidates = [...this.assets.values()].filter((a) => a.id !== assetId);

		// Score by similarity
		const scored = candidates.map((candidate) => {
			let score = 0;

			// Same folder
			if (candidate.folder === asset.folder) score += 2;

			// Matching tags
			const matchingTags = candidate.tags.filter((t) => asset.tags.includes(t));
			score += matchingTags.length * 3;

			// Same MIME type
			if (candidate.mimeType === asset.mimeType) score += 1;

			// Similar size (within 20%)
			const sizeDiff = Math.abs(candidate.size - asset.size) / asset.size;
			if (sizeDiff < 0.2) score += 2;

			return { asset: candidate, score };
		});

		return scored
			.filter((s) => s.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, limit)
			.map((s) => s.asset);
	}

	/**
	 * Track asset usage
	 */
	trackUsage(assetId: string, orderId: string, field: string): void {
		const asset = this.assets.get(assetId);
		if (!asset) return;

		const usages = this.usageMap.get(assetId) ?? [];
		usages.push({
			orderId,
			field,
			usedAt: new Date().toISOString(),
		});
		this.usageMap.set(assetId, usages);

		asset.usageCount++;
		asset.lastUsed = new Date().toISOString();
	}

	/**
	 * Get asset usage
	 */
	getAssetUsage(assetId: string): AssetUsage[] {
		return this.usageMap.get(assetId) ?? [];
	}

	/**
	 * Get storage quota
	 */
	getStorageQuota(): StorageQuota {
		return {
			used: this.storageUsed,
			limit: this.storageLimit,
			remaining: this.storageLimit - this.storageUsed,
			percentage: Math.round((this.storageUsed / this.storageLimit) * 100),
		};
	}

	/**
	 * Set storage limit
	 */
	setStorageLimit(bytes: number): void {
		this.storageLimit = bytes;
	}

	/**
	 * Get folders
	 */
	getFolders(): AssetFolder[] {
		return [...this.folders.values()];
	}

	/**
	 * Create folder
	 */
	createFolder(name: string, parentPath: string, userId: string): AssetFolder {
		const path = parentPath === "/" ? `/${name}` : `${parentPath}/${name}`;
		const id = generateId();

		const folder: AssetFolder = {
			id,
			name,
			path,
			parentId: parentPath === "/" ? "root" : this.getFolderByPath(parentPath)?.id,
			assetCount: 0,
			createdAt: new Date().toISOString(),
			createdBy: userId,
		};

		this.folders.set(id, folder);
		return folder;
	}

	/**
	 * Delete folder
	 */
	deleteFolder(folderId: string): boolean {
		const folder = this.folders.get(folderId);
		if (!folder || folder.id === "root") return false;

		// Check for assets
		const assets = this.search({ folder: folder.path, limit: 1 });
		if (assets.totalCount > 0) {
			return false; // Folder not empty
		}

		// Check for subfolders
		const hasChildren = [...this.folders.values()].some((f) => f.parentId === folderId);
		if (hasChildren) {
			return false;
		}

		this.folders.delete(folderId);
		return true;
	}

	/**
	 * Get unused assets (not referenced anywhere)
	 */
	getUnusedAssets(olderThanDays = 30): Asset[] {
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

		return [...this.assets.values()].filter((asset) => {
			if (asset.usageCount > 0) return false;
			if (new Date(asset.createdAt) > cutoffDate) return false;
			return true;
		});
	}

	/**
	 * Get storage breakdown by folder
	 */
	getStorageBreakdown(): Record<string, number> {
		const breakdown: Record<string, number> = {};

		for (const asset of this.assets.values()) {
			const folder = asset.folder || "/";
			breakdown[folder] = (breakdown[folder] ?? 0) + asset.size;
		}

		return breakdown;
	}

	/**
	 * Subscribe to asset events
	 */
	onEvent(listener: (event: AssetEvent) => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	// Helper methods

	private emit(event: AssetEvent): void {
		for (const listener of this.listeners) {
			listener(event);
		}
	}

	private getFileCategory(mimeType: string): string | undefined {
		for (const [category, types] of Object.entries(SUPPORTED_TYPES)) {
			if (types.includes(mimeType)) return category;
		}
		return undefined;
	}

	private async calculateHash(file: File): Promise<string> {
		const buffer = await file.arrayBuffer();
		const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	}

	private async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				resolve({ width: img.naturalWidth, height: img.naturalHeight });
			};
			img.onerror = reject;
			img.src = URL.createObjectURL(file);
		});
	}

	private async fileToDataUrl(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	private async generateThumbnail(file: File, maxSize = 200): Promise<string> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				let width = img.naturalWidth;
				let height = img.naturalHeight;

				if (width > height) {
					if (width > maxSize) {
						height = (height * maxSize) / width;
						width = maxSize;
					}
				} else {
					if (height > maxSize) {
						width = (width * maxSize) / height;
						height = maxSize;
					}
				}

				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				ctx?.drawImage(img, 0, 0, width, height);
				resolve(canvas.toDataURL("image/jpeg", 0.7));
			};
			img.onerror = reject;
			img.src = URL.createObjectURL(file);
		});
	}

	private getFolderByPath(path: string): AssetFolder | undefined {
		return [...this.folders.values()].find((f) => f.path === path);
	}

	private updateFolderCount(folderPath: string, delta: number): void {
		const folder = this.getFolderByPath(folderPath);
		if (folder) {
			folder.assetCount += delta;
		}
	}

	/**
	 * Format bytes for display
	 */
	static formatBytes(bytes: number): string {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	}
}

export interface AssetEvent {
	type: "upload" | "update" | "delete" | "move";
	asset: Asset;
}

export const assetManagementService = new AssetManagementService();
