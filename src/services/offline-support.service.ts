/**
 * Offline Support Service
 * 
 * Provides offline-first functionality:
 * - Service Worker registration
 * - Local sync queue for offline changes
 * - Conflict resolution strategies
 * - Data persistence with IndexedDB
 * - Network status monitoring
 */

import type { PhotoOrder } from "../types";

// IndexedDB Database Configuration
const DB_NAME = "rkhPhotoOrdersOffline";
const DB_VERSION = 1;

// Store names
const STORES = {
	orders: "orders",
	syncQueue: "syncQueue",
	cache: "cache",
	metadata: "metadata",
} as const;

export interface SyncQueueItem {
	id: string;
	type: "create" | "update" | "delete";
	resource: "order" | "comment" | "asset";
	resourceId: string;
	data: unknown;
	timestamp: string;
	retries: number;
	status: "pending" | "syncing" | "failed" | "completed";
	error?: string;
}

export interface ConflictInfo {
	localVersion: unknown;
	remoteVersion: unknown;
	lastLocalUpdate: string;
	lastRemoteUpdate: string;
}

export type ConflictResolution = "local" | "remote" | "merge" | "manual";

export interface OfflineStatus {
	isOnline: boolean;
	isServiceWorkerActive: boolean;
	pendingSyncCount: number;
	lastSyncTime: string | null;
	storageUsed: number;
	storageQuota: number;
}

export interface SyncResult {
	success: boolean;
	synced: number;
	failed: number;
	conflicts: ConflictInfo[];
	errors: string[];
}

export interface CacheEntry {
	key: string;
	data: unknown;
	expiresAt: string;
	version: number;
}

const generateId = (): string =>
	`sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export class OfflineSupportService {
	private db: IDBDatabase | null = null;
	private isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
	private syncInProgress = false;
	private conflictResolver: ((conflict: ConflictInfo) => Promise<ConflictResolution>) | null = null;
	private listeners = new Set<(status: OfflineStatus) => void>();

	constructor() {
		this.initialize();
	}

	/**
	 * Initialize offline support
	 */
	private async initialize(): Promise<void> {
		if (typeof window === "undefined") return;

		// Setup network listeners
		window.addEventListener("online", this.handleOnline.bind(this));
		window.addEventListener("offline", this.handleOffline.bind(this));

		// Open IndexedDB
		await this.openDatabase();

		// Register Service Worker
		await this.registerServiceWorker();

		// Attempt initial sync if online
		if (this.isOnline) {
			this.sync();
		}
	}

	/**
	 * Open IndexedDB database
	 */
	private openDatabase(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (typeof indexedDB === "undefined") {
				console.warn("IndexedDB not available");
				resolve();
				return;
			}

			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = () => {
				console.error("Failed to open IndexedDB:", request.error);
				reject(request.error);
			};

			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				// Orders store
				if (!db.objectStoreNames.contains(STORES.orders)) {
					const ordersStore = db.createObjectStore(STORES.orders, { keyPath: "orderId" });
					ordersStore.createIndex("status", "status", { unique: false });
					ordersStore.createIndex("updatedAt", "updatedAt", { unique: false });
				}

				// Sync queue store
				if (!db.objectStoreNames.contains(STORES.syncQueue)) {
					const syncStore = db.createObjectStore(STORES.syncQueue, { keyPath: "id" });
					syncStore.createIndex("status", "status", { unique: false });
					syncStore.createIndex("timestamp", "timestamp", { unique: false });
				}

				// Cache store
				if (!db.objectStoreNames.contains(STORES.cache)) {
					const cacheStore = db.createObjectStore(STORES.cache, { keyPath: "key" });
					cacheStore.createIndex("expiresAt", "expiresAt", { unique: false });
				}

				// Metadata store
				if (!db.objectStoreNames.contains(STORES.metadata)) {
					db.createObjectStore(STORES.metadata, { keyPath: "key" });
				}
			};
		});
	}

	/**
	 * Register Service Worker
	 */
	private async registerServiceWorker(): Promise<void> {
		if (!("serviceWorker" in navigator)) {
			console.warn("Service Worker not supported");
			return;
		}

		try {
			const registration = await navigator.serviceWorker.register("/sw.js");
			console.log("Service Worker registered:", registration.scope);

			// Handle updates
			registration.addEventListener("updatefound", () => {
				const newWorker = registration.installing;
				if (newWorker) {
					newWorker.addEventListener("statechange", () => {
						if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
							// New content available
							this.emit();
						}
					});
				}
			});
		} catch (error) {
			console.warn("Service Worker registration failed:", error);
		}
	}

	/**
	 * Handle online event
	 */
	private handleOnline(): void {
		this.isOnline = true;
		this.emit();
		this.sync();
	}

	/**
	 * Handle offline event
	 */
	private handleOffline(): void {
		this.isOnline = false;
		this.emit();
	}

	// IndexedDB Operations

	/**
	 * Get item from store
	 */
	private get<T>(storeName: string, key: string): Promise<T | undefined> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				resolve(undefined);
				return;
			}

			const transaction = this.db.transaction(storeName, "readonly");
			const store = transaction.objectStore(storeName);
			const request = store.get(key);

			request.onsuccess = () => resolve(request.result as T | undefined);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Get all items from store
	 */
	private getAll<T>(storeName: string): Promise<T[]> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				resolve([]);
				return;
			}

			const transaction = this.db.transaction(storeName, "readonly");
			const store = transaction.objectStore(storeName);
			const request = store.getAll();

			request.onsuccess = () => resolve(request.result as T[]);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Put item in store
	 */
	private put<T>(storeName: string, item: T): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error("Database not initialized"));
				return;
			}

			const transaction = this.db.transaction(storeName, "readwrite");
			const store = transaction.objectStore(storeName);
			const request = store.put(item);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Delete item from store
	 */
	private delete(storeName: string, key: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.db) {
				reject(new Error("Database not initialized"));
				return;
			}

			const transaction = this.db.transaction(storeName, "readwrite");
			const store = transaction.objectStore(storeName);
			const request = store.delete(key);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	// Public API: Orders

	/**
	 * Save order locally
	 */
	async saveOrderLocally(order: PhotoOrder): Promise<void> {
		await this.put(STORES.orders, {
			...order,
			_localUpdatedAt: new Date().toISOString(),
		});
	}

	/**
	 * Get order from local storage
	 */
	async getLocalOrder(orderId: string): Promise<PhotoOrder | undefined> {
		return this.get<PhotoOrder>(STORES.orders, orderId);
	}

	/**
	 * Get all local orders
	 */
	async getAllLocalOrders(): Promise<PhotoOrder[]> {
		return this.getAll<PhotoOrder>(STORES.orders);
	}

	/**
	 * Delete local order
	 */
	async deleteLocalOrder(orderId: string): Promise<void> {
		await this.delete(STORES.orders, orderId);
	}

	// Public API: Sync Queue

	/**
	 * Queue a change for sync
	 */
	async queueChange(
		type: SyncQueueItem["type"],
		resource: SyncQueueItem["resource"],
		resourceId: string,
		data: unknown
	): Promise<string> {
		const item: SyncQueueItem = {
			id: generateId(),
			type,
			resource,
			resourceId,
			data,
			timestamp: new Date().toISOString(),
			retries: 0,
			status: "pending",
		};

		await this.put(STORES.syncQueue, item);
		this.emit();

		// Trigger sync if online
		if (this.isOnline) {
			this.sync();
		}

		return item.id;
	}

	/**
	 * Get pending sync items
	 */
	async getPendingSyncItems(): Promise<SyncQueueItem[]> {
		const all = await this.getAll<SyncQueueItem>(STORES.syncQueue);
		return all.filter((item) => item.status === "pending" || item.status === "failed");
	}

	/**
	 * Sync pending changes with server
	 */
	async sync(): Promise<SyncResult> {
		if (this.syncInProgress || !this.isOnline) {
			return {
				success: false,
				synced: 0,
				failed: 0,
				conflicts: [],
				errors: [this.syncInProgress ? "Sync already in progress" : "Offline"],
			};
		}

		this.syncInProgress = true;
		this.emit();

		const result: SyncResult = {
			success: true,
			synced: 0,
			failed: 0,
			conflicts: [],
			errors: [],
		};

		try {
			const pendingItems = await this.getPendingSyncItems();

			for (const item of pendingItems) {
				try {
					// Update status
					item.status = "syncing";
					await this.put(STORES.syncQueue, item);

					// Attempt to sync
					const syncResult = await this.syncItem(item);

					if (syncResult.success) {
						// Remove from queue
						await this.delete(STORES.syncQueue, item.id);
						result.synced++;
					} else if (syncResult.conflict) {
						// Handle conflict
						result.conflicts.push(syncResult.conflict);
						
						if (this.conflictResolver) {
							const resolution = await this.conflictResolver(syncResult.conflict);
							await this.resolveConflict(item, syncResult.conflict, resolution);
						} else {
							item.status = "failed";
							item.error = "Conflict requires manual resolution";
							await this.put(STORES.syncQueue, item);
						}
					} else {
						// Retry later
						item.status = "failed";
						item.retries++;
						item.error = syncResult.error;
						await this.put(STORES.syncQueue, item);
						result.failed++;
						result.errors.push(syncResult.error ?? "Unknown error");
					}
				} catch (error) {
					item.status = "failed";
					item.retries++;
					item.error = error instanceof Error ? error.message : "Unknown error";
					await this.put(STORES.syncQueue, item);
					result.failed++;
					result.errors.push(item.error);
				}
			}

			// Update last sync time
			await this.put(STORES.metadata, {
				key: "lastSyncTime",
				value: new Date().toISOString(),
			});

		} finally {
			this.syncInProgress = false;
			this.emit();
		}

		result.success = result.failed === 0;
		return result;
	}

	/**
	 * Sync a single item
	 */
	private async syncItem(item: SyncQueueItem): Promise<{
		success: boolean;
		error?: string;
		conflict?: ConflictInfo;
	}> {
		// In a real implementation, this would make API calls
		// For now, simulate with a delay
		await new Promise((resolve) => setTimeout(resolve, 100));

		// Simulate various outcomes
		const random = Math.random();
		
		if (random < 0.9) {
			// Success
			return { success: true };
		} else if (random < 0.95) {
			// Conflict
			return {
				success: false,
				conflict: {
					localVersion: item.data,
					remoteVersion: { ...item.data as object, _remote: true },
					lastLocalUpdate: item.timestamp,
					lastRemoteUpdate: new Date().toISOString(),
				},
			};
		} else {
			// Error
			return {
				success: false,
				error: "Network error - will retry",
			};
		}
	}

	/**
	 * Resolve a conflict
	 */
	private async resolveConflict(
		item: SyncQueueItem,
		conflict: ConflictInfo,
		resolution: ConflictResolution
	): Promise<void> {
		switch (resolution) {
			case "local":
				// Re-queue with local data
				item.status = "pending";
				item.retries = 0;
				await this.put(STORES.syncQueue, item);
				break;

			case "remote":
				// Accept remote, update local storage
				if (item.resource === "order") {
					await this.put(STORES.orders, conflict.remoteVersion as PhotoOrder);
				}
				await this.delete(STORES.syncQueue, item.id);
				break;

			case "merge":
				// Merge changes (simple strategy: local wins for non-conflicting fields)
				const merged = this.mergeData(conflict.localVersion, conflict.remoteVersion);
				item.data = merged;
				item.status = "pending";
				item.retries = 0;
				await this.put(STORES.syncQueue, item);
				break;

			case "manual":
				// Mark for manual resolution
				item.status = "failed";
				item.error = "Requires manual resolution";
				await this.put(STORES.syncQueue, item);
				break;
		}
	}

	/**
	 * Simple merge strategy
	 */
	private mergeData(local: unknown, remote: unknown): unknown {
		if (typeof local !== "object" || typeof remote !== "object") {
			return local; // Prefer local for non-objects
		}

		const merged = { ...(remote as object) };
		
		for (const [key, value] of Object.entries(local as object)) {
			if (key.startsWith("_")) continue; // Skip metadata
			(merged as Record<string, unknown>)[key] = value;
		}

		return merged;
	}

	/**
	 * Set conflict resolver
	 */
	setConflictResolver(resolver: (conflict: ConflictInfo) => Promise<ConflictResolution>): void {
		this.conflictResolver = resolver;
	}

	// Public API: Cache

	/**
	 * Cache data
	 */
	async cache(key: string, data: unknown, ttlSeconds: number = 3600): Promise<void> {
		const entry: CacheEntry = {
			key,
			data,
			expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
			version: Date.now(),
		};

		await this.put(STORES.cache, entry);
	}

	/**
	 * Get cached data
	 */
	async getCached<T>(key: string): Promise<T | undefined> {
		const entry = await this.get<CacheEntry>(STORES.cache, key);
		
		if (!entry) return undefined;

		// Check expiration
		if (new Date(entry.expiresAt) < new Date()) {
			await this.delete(STORES.cache, key);
			return undefined;
		}

		return entry.data as T;
	}

	/**
	 * Clear expired cache
	 */
	async clearExpiredCache(): Promise<number> {
		const all = await this.getAll<CacheEntry>(STORES.cache);
		const now = new Date();
		let cleared = 0;

		for (const entry of all) {
			if (new Date(entry.expiresAt) < now) {
				await this.delete(STORES.cache, entry.key);
				cleared++;
			}
		}

		return cleared;
	}

	// Public API: Status

	/**
	 * Get offline status
	 */
	async getStatus(): Promise<OfflineStatus> {
		const pendingItems = await this.getPendingSyncItems();
		const lastSyncMeta = await this.get<{ key: string; value: string }>(STORES.metadata, "lastSyncTime");

		let storageUsed = 0;
		let storageQuota = 0;

		if (navigator.storage?.estimate) {
			const estimate = await navigator.storage.estimate();
			storageUsed = estimate.usage ?? 0;
			storageQuota = estimate.quota ?? 0;
		}

		return {
			isOnline: this.isOnline,
			isServiceWorkerActive: !!navigator.serviceWorker?.controller,
			pendingSyncCount: pendingItems.length,
			lastSyncTime: lastSyncMeta?.value ?? null,
			storageUsed,
			storageQuota,
		};
	}

	/**
	 * Check if online
	 */
	isNetworkOnline(): boolean {
		return this.isOnline;
	}

	/**
	 * Subscribe to status changes
	 */
	onStatusChange(listener: (status: OfflineStatus) => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	private async emit(): Promise<void> {
		const status = await this.getStatus();
		for (const listener of this.listeners) {
			listener(status);
		}
	}

	/**
	 * Force sync now
	 */
	async forceSync(): Promise<SyncResult> {
		return this.sync();
	}

	/**
	 * Clear all offline data
	 */
	async clearAll(): Promise<void> {
		if (!this.db) return;

		const transaction = this.db.transaction(Object.values(STORES), "readwrite");
		
		for (const storeName of Object.values(STORES)) {
			transaction.objectStore(storeName).clear();
		}
	}

	/**
	 * Cleanup
	 */
	destroy(): void {
		if (typeof window === "undefined") return;

		window.removeEventListener("online", this.handleOnline.bind(this));
		window.removeEventListener("offline", this.handleOffline.bind(this));

		this.db?.close();
		this.db = null;
	}
}

export const offlineSupportService = new OfflineSupportService();

/**
 * Generate Service Worker code
 * This would typically be in a separate sw.js file
 */
export function generateServiceWorkerCode(): string {
	return `
// Photo Orders Service Worker
const CACHE_NAME = 'rkh-photo-orders-v1';
const STATIC_ASSETS = [
	'/',
	'/index.html',
	'/fallback-bundle.js',
	'/assets/CCP-Logo.png'
];

// Install event
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(STATIC_ASSETS);
		})
	);
});

// Activate event
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((name) => name !== CACHE_NAME)
					.map((name) => caches.delete(name))
			);
		})
	);
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
	// Skip non-GET requests
	if (event.request.method !== 'GET') return;

	// Skip API requests (handled by sync queue)
	if (event.request.url.includes('/api/')) return;

	event.respondWith(
		fetch(event.request)
			.then((response) => {
				// Clone and cache successful responses
				if (response.ok) {
					const clone = response.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, clone);
					});
				}
				return response;
			})
			.catch(() => {
				// Fallback to cache
				return caches.match(event.request).then((cached) => {
					return cached || new Response('Offline', { status: 503 });
				});
			})
	);
});

// Background sync
self.addEventListener('sync', (event) => {
	if (event.tag === 'sync-orders') {
		event.waitUntil(syncOrders());
	}
});

async function syncOrders() {
	// Notify the app to sync
	const clients = await self.clients.matchAll();
	clients.forEach((client) => {
		client.postMessage({ type: 'SYNC_REQUESTED' });
	});
}
`;
}
