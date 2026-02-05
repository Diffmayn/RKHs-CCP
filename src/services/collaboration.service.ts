/**
 * Real-time Collaboration Service - WebSocket-based live updates
 * 
 * Enables real-time synchronization between multiple users
 * editing orders simultaneously.
 */

export type CollaborationEventType =
	| "user_joined"
	| "user_left"
	| "order_locked"
	| "order_unlocked"
	| "order_updated"
	| "cursor_moved"
	| "selection_changed"
	| "comment_added"
	| "typing_started"
	| "typing_stopped"
	| "presence_update";

export interface CollaborationUser {
	id: string;
	name: string;
	avatar?: string;
	color: string;
	currentOrderId?: string;
	cursor?: { x: number; y: number };
	lastSeen: string;
	isTyping?: boolean;
}

export interface CollaborationEvent {
	type: CollaborationEventType;
	userId: string;
	userName: string;
	orderId?: string;
	data?: unknown;
	timestamp: string;
}

export interface OrderLock {
	orderId: string;
	userId: string;
	userName: string;
	lockedAt: string;
	expiresAt: string;
}

export interface CollaborationServiceOptions {
	wsUrl?: string;
	reconnectDelay?: number;
	maxReconnectAttempts?: number;
	lockTimeout?: number;
	presenceInterval?: number;
}

type EventListener = (event: CollaborationEvent) => void;
type UserListener = (users: CollaborationUser[]) => void;

const USER_COLORS = [
	"#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
	"#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

const generateColor = (userId: string): string => {
	let hash = 0;
	for (let i = 0; i < userId.length; i++) {
		hash = ((hash << 5) - hash) + userId.charCodeAt(i);
		hash |= 0;
	}
	return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
};

export class CollaborationService {
	private ws: WebSocket | null = null;
	private readonly wsUrl: string;
	private readonly reconnectDelay: number;
	private readonly maxReconnectAttempts: number;
	private readonly lockTimeout: number;
	private readonly presenceInterval: number;

	private reconnectAttempts = 0;
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	private presenceTimer: ReturnType<typeof setInterval> | null = null;
	private isConnected = false;

	private currentUser: CollaborationUser | null = null;
	private activeUsers: Map<string, CollaborationUser> = new Map();
	private orderLocks: Map<string, OrderLock> = new Map();
	private pendingMessages: CollaborationEvent[] = [];

	private eventListeners: Set<EventListener> = new Set();
	private userListeners: Set<UserListener> = new Set();

	constructor(options: CollaborationServiceOptions = {}) {
		this.wsUrl = options.wsUrl ?? "ws://localhost:8081";
		this.reconnectDelay = options.reconnectDelay ?? 3000;
		this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10;
		this.lockTimeout = options.lockTimeout ?? 5 * 60 * 1000; // 5 minutes
		this.presenceInterval = options.presenceInterval ?? 30000; // 30 seconds
	}

	/**
	 * Connect to collaboration server
	 */
	connect(userId: string, userName: string): void {
		if (this.ws?.readyState === WebSocket.OPEN) return;

		this.currentUser = {
			id: userId,
			name: userName,
			color: generateColor(userId),
			lastSeen: new Date().toISOString(),
		};

		try {
			this.ws = new WebSocket(this.wsUrl);

			this.ws.onopen = () => {
				console.log("[Collaboration] Connected to server");
				this.isConnected = true;
				this.reconnectAttempts = 0;
				
				// Send join event
				this.send({
					type: "user_joined",
					userId,
					userName,
					timestamp: new Date().toISOString(),
				});

				// Start presence updates
				this.startPresenceUpdates();

				// Send any pending messages
				while (this.pendingMessages.length > 0) {
					const msg = this.pendingMessages.shift()!;
					this.send(msg);
				}
			};

			this.ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data) as CollaborationEvent;
					this.handleEvent(data);
				} catch (error) {
					console.warn("[Collaboration] Failed to parse message:", error);
				}
			};

			this.ws.onclose = () => {
				console.log("[Collaboration] Disconnected");
				this.isConnected = false;
				this.stopPresenceUpdates();
				this.attemptReconnect();
			};

			this.ws.onerror = (error) => {
				console.error("[Collaboration] WebSocket error:", error);
			};
		} catch (error) {
			console.error("[Collaboration] Failed to connect:", error);
			this.attemptReconnect();
		}
	}

	/**
	 * Disconnect from collaboration server
	 */
	disconnect(): void {
		if (this.currentUser) {
			this.send({
				type: "user_left",
				userId: this.currentUser.id,
				userName: this.currentUser.name,
				timestamp: new Date().toISOString(),
			});
		}

		this.stopPresenceUpdates();
		
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}

		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}

		this.isConnected = false;
		this.activeUsers.clear();
		this.orderLocks.clear();
	}

	private attemptReconnect(): void {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			console.warn("[Collaboration] Max reconnect attempts reached");
			return;
		}

		this.reconnectAttempts++;
		const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);

		console.log(`[Collaboration] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

		this.reconnectTimer = setTimeout(() => {
			if (this.currentUser) {
				this.connect(this.currentUser.id, this.currentUser.name);
			}
		}, delay);
	}

	private startPresenceUpdates(): void {
		this.presenceTimer = setInterval(() => {
			if (this.currentUser) {
				this.send({
					type: "presence_update",
					userId: this.currentUser.id,
					userName: this.currentUser.name,
					data: {
						currentOrderId: this.currentUser.currentOrderId,
						cursor: this.currentUser.cursor,
					},
					timestamp: new Date().toISOString(),
				});
			}
		}, this.presenceInterval);
	}

	private stopPresenceUpdates(): void {
		if (this.presenceTimer) {
			clearInterval(this.presenceTimer);
			this.presenceTimer = null;
		}
	}

	private send(event: CollaborationEvent): void {
		if (this.ws?.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(event));
		} else {
			this.pendingMessages.push(event);
		}
	}

	private handleEvent(event: CollaborationEvent): void {
		switch (event.type) {
			case "user_joined":
				this.activeUsers.set(event.userId, {
					id: event.userId,
					name: event.userName,
					color: generateColor(event.userId),
					lastSeen: event.timestamp,
				});
				this.notifyUserListeners();
				break;

			case "user_left":
				this.activeUsers.delete(event.userId);
				// Release any locks held by this user
				for (const [orderId, lock] of this.orderLocks) {
					if (lock.userId === event.userId) {
						this.orderLocks.delete(orderId);
					}
				}
				this.notifyUserListeners();
				break;

			case "presence_update":
				const user = this.activeUsers.get(event.userId);
				if (user) {
					const data = event.data as { currentOrderId?: string; cursor?: { x: number; y: number } };
					user.lastSeen = event.timestamp;
					user.currentOrderId = data.currentOrderId;
					user.cursor = data.cursor;
					this.notifyUserListeners();
				}
				break;

			case "order_locked":
				const lockData = event.data as OrderLock;
				this.orderLocks.set(lockData.orderId, lockData);
				break;

			case "order_unlocked":
				if (event.orderId) {
					this.orderLocks.delete(event.orderId);
				}
				break;

			case "typing_started":
			case "typing_stopped":
				const typingUser = this.activeUsers.get(event.userId);
				if (typingUser) {
					typingUser.isTyping = event.type === "typing_started";
					this.notifyUserListeners();
				}
				break;
		}

		// Notify all event listeners
		for (const listener of this.eventListeners) {
			listener(event);
		}
	}

	private notifyUserListeners(): void {
		const users = Array.from(this.activeUsers.values());
		for (const listener of this.userListeners) {
			listener(users);
		}
	}

	// Public API

	/**
	 * Lock an order for editing
	 */
	lockOrder(orderId: string): boolean {
		if (!this.currentUser) return false;

		const existingLock = this.orderLocks.get(orderId);
		if (existingLock && existingLock.userId !== this.currentUser.id) {
			// Check if lock has expired
			if (new Date(existingLock.expiresAt) > new Date()) {
				return false; // Still locked by someone else
			}
		}

		const lock: OrderLock = {
			orderId,
			userId: this.currentUser.id,
			userName: this.currentUser.name,
			lockedAt: new Date().toISOString(),
			expiresAt: new Date(Date.now() + this.lockTimeout).toISOString(),
		};

		this.orderLocks.set(orderId, lock);

		this.send({
			type: "order_locked",
			userId: this.currentUser.id,
			userName: this.currentUser.name,
			orderId,
			data: lock,
			timestamp: new Date().toISOString(),
		});

		return true;
	}

	/**
	 * Unlock an order
	 */
	unlockOrder(orderId: string): void {
		if (!this.currentUser) return;

		const lock = this.orderLocks.get(orderId);
		if (lock?.userId === this.currentUser.id) {
			this.orderLocks.delete(orderId);

			this.send({
				type: "order_unlocked",
				userId: this.currentUser.id,
				userName: this.currentUser.name,
				orderId,
				timestamp: new Date().toISOString(),
			});
		}
	}

	/**
	 * Check if an order is locked
	 */
	isOrderLocked(orderId: string): OrderLock | null {
		const lock = this.orderLocks.get(orderId);
		if (!lock) return null;

		// Check expiration
		if (new Date(lock.expiresAt) <= new Date()) {
			this.orderLocks.delete(orderId);
			return null;
		}

		return lock;
	}

	/**
	 * Broadcast an order update
	 */
	broadcastOrderUpdate(orderId: string, changes: unknown): void {
		if (!this.currentUser) return;

		this.send({
			type: "order_updated",
			userId: this.currentUser.id,
			userName: this.currentUser.name,
			orderId,
			data: changes,
			timestamp: new Date().toISOString(),
		});
	}

	/**
	 * Broadcast cursor position
	 */
	updateCursor(x: number, y: number): void {
		if (!this.currentUser) return;

		this.currentUser.cursor = { x, y };

		this.send({
			type: "cursor_moved",
			userId: this.currentUser.id,
			userName: this.currentUser.name,
			data: { x, y },
			timestamp: new Date().toISOString(),
		});
	}

	/**
	 * Set current order being viewed/edited
	 */
	setCurrentOrder(orderId: string | undefined): void {
		if (this.currentUser) {
			this.currentUser.currentOrderId = orderId;
		}
	}

	/**
	 * Notify typing status
	 */
	setTyping(isTyping: boolean): void {
		if (!this.currentUser) return;

		this.send({
			type: isTyping ? "typing_started" : "typing_stopped",
			userId: this.currentUser.id,
			userName: this.currentUser.name,
			timestamp: new Date().toISOString(),
		});
	}

	/**
	 * Get all active users
	 */
	getActiveUsers(): CollaborationUser[] {
		return Array.from(this.activeUsers.values());
	}

	/**
	 * Get users viewing a specific order
	 */
	getUsersViewingOrder(orderId: string): CollaborationUser[] {
		return Array.from(this.activeUsers.values())
			.filter((user) => user.currentOrderId === orderId);
	}

	/**
	 * Subscribe to collaboration events
	 */
	onEvent(listener: EventListener): () => void {
		this.eventListeners.add(listener);
		return () => this.eventListeners.delete(listener);
	}

	/**
	 * Subscribe to user list changes
	 */
	onUsersChange(listener: UserListener): () => void {
		this.userListeners.add(listener);
		return () => this.userListeners.delete(listener);
	}

	/**
	 * Get connection status
	 */
	getStatus(): { connected: boolean; userCount: number } {
		return {
			connected: this.isConnected,
			userCount: this.activeUsers.size,
		};
	}
}

export const collaborationService = new CollaborationService();
