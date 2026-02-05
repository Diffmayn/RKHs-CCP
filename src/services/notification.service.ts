/**
 * Notification Service - Handles in-app and system notifications
 * 
 * Provides toast notifications, desktop notifications, and
 * a notification center for the photo order management system.
 */

export type NotificationType = "success" | "error" | "warning" | "info";
export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	priority: NotificationPriority;
	timestamp: string;
	read: boolean;
	actionUrl?: string;
	actionLabel?: string;
	orderId?: string;
	autoClose?: boolean;
	duration?: number;
}

export interface NotificationServiceOptions {
	defaultDuration?: number;
	maxNotifications?: number;
	enableDesktopNotifications?: boolean;
	storage?: Storage;
}

type NotificationListener = (notifications: Notification[]) => void;

const STORAGE_KEY = "app_notifications";
const DEFAULT_DURATION = 5000;
const MAX_NOTIFICATIONS = 100;

const generateId = (): string =>
	`notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export class NotificationService {
	private notifications: Notification[] = [];
	private readonly listeners = new Set<NotificationListener>();
	private readonly defaultDuration: number;
	private readonly maxNotifications: number;
	private readonly enableDesktop: boolean;
	private readonly storage: Storage | null;
	private toastContainer: HTMLElement | null = null;

	constructor(options: NotificationServiceOptions = {}) {
		this.defaultDuration = options.defaultDuration ?? DEFAULT_DURATION;
		this.maxNotifications = options.maxNotifications ?? MAX_NOTIFICATIONS;
		this.enableDesktop = options.enableDesktopNotifications ?? false;
		this.storage = options.storage ?? (typeof window !== "undefined" ? window.localStorage : null);
		
		this.loadNotifications();
		this.initToastContainer();
		
		if (this.enableDesktop) {
			this.requestDesktopPermission();
		}
	}

	private loadNotifications(): void {
		if (!this.storage) return;
		
		try {
			const stored = this.storage.getItem(STORAGE_KEY);
			if (stored) {
				this.notifications = JSON.parse(stored);
			}
		} catch (error) {
			console.warn("[NotificationService] Failed to load notifications:", error);
		}
	}

	private saveNotifications(): void {
		if (!this.storage) return;
		
		try {
			// Only persist unread notifications
			const toSave = this.notifications.filter((n) => !n.read).slice(0, 50);
			this.storage.setItem(STORAGE_KEY, JSON.stringify(toSave));
		} catch (error) {
			console.warn("[NotificationService] Failed to save notifications:", error);
		}
	}

	private initToastContainer(): void {
		if (typeof document === "undefined") return;
		
		this.toastContainer = document.getElementById("toast-container");
		if (!this.toastContainer) {
			this.toastContainer = document.createElement("div");
			this.toastContainer.id = "toast-container";
			this.toastContainer.style.cssText = `
				position: fixed;
				top: 20px;
				right: 20px;
				z-index: 10000;
				display: flex;
				flex-direction: column;
				gap: 10px;
				max-width: 400px;
			`;
			document.body.appendChild(this.toastContainer);
		}
	}

	private async requestDesktopPermission(): Promise<boolean> {
		if (typeof Notification === "undefined") return false;
		
		if (Notification.permission === "granted") return true;
		if (Notification.permission === "denied") return false;
		
		const permission = await Notification.requestPermission();
		return permission === "granted";
	}

	private emit(): void {
		const snapshot = [...this.notifications];
		for (const listener of this.listeners) {
			listener(snapshot);
		}
	}

	private getIconForType(type: NotificationType): string {
		const icons: Record<NotificationType, string> = {
			success: "✓",
			error: "✕",
			warning: "⚠",
			info: "ℹ",
		};
		return icons[type];
	}

	private getColorForType(type: NotificationType): { bg: string; text: string; border: string } {
		const colors: Record<NotificationType, { bg: string; text: string; border: string }> = {
			success: { bg: "#ecfdf5", text: "#065f46", border: "#34d399" },
			error: { bg: "#fef2f2", text: "#991b1b", border: "#f87171" },
			warning: { bg: "#fffbeb", text: "#92400e", border: "#fbbf24" },
			info: { bg: "#eff6ff", text: "#1e40af", border: "#60a5fa" },
		};
		return colors[type];
	}

	private showToast(notification: Notification): void {
		if (!this.toastContainer) return;

		const colors = this.getColorForType(notification.type);
		const icon = this.getIconForType(notification.type);

		const toast = document.createElement("div");
		toast.id = `toast-${notification.id}`;
		toast.style.cssText = `
			background: ${colors.bg};
			color: ${colors.text};
			border: 1px solid ${colors.border};
			border-radius: 12px;
			padding: 14px 18px;
			box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
			display: flex;
			align-items: flex-start;
			gap: 12px;
			animation: slideIn 0.3s ease-out;
			max-width: 100%;
			backdrop-filter: blur(10px);
		`;

		toast.innerHTML = `
			<span style="font-size: 18px; line-height: 1;">${icon}</span>
			<div style="flex: 1; min-width: 0;">
				<div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${notification.title}</div>
				<div style="font-size: 13px; opacity: 0.9; line-height: 1.4;">${notification.message}</div>
				${notification.actionLabel ? `
					<button style="
						margin-top: 8px;
						background: ${colors.text};
						color: white;
						border: none;
						padding: 6px 12px;
						border-radius: 6px;
						font-size: 12px;
						font-weight: 600;
						cursor: pointer;
					" onclick="window.location.href='${notification.actionUrl || "#"}'">
						${notification.actionLabel}
					</button>
				` : ""}
			</div>
			<button style="
				background: none;
				border: none;
				color: ${colors.text};
				opacity: 0.6;
				cursor: pointer;
				font-size: 18px;
				padding: 0;
				line-height: 1;
			" onclick="this.parentElement.remove()">×</button>
		`;

		this.toastContainer.appendChild(toast);

		if (notification.autoClose !== false) {
			const duration = notification.duration ?? this.defaultDuration;
			setTimeout(() => {
				toast.style.animation = "slideOut 0.3s ease-in forwards";
				setTimeout(() => toast.remove(), 300);
			}, duration);
		}
	}

	private showDesktopNotification(notification: Notification): void {
		if (!this.enableDesktop || typeof Notification === "undefined") return;
		if (Notification.permission !== "granted") return;

		new Notification(notification.title, {
			body: notification.message,
			icon: "/assets/icon.png",
			tag: notification.id,
		});
	}

	notify(
		type: NotificationType,
		title: string,
		message: string,
		options: Partial<Omit<Notification, "id" | "type" | "title" | "message" | "timestamp" | "read">> = {}
	): Notification {
		const notification: Notification = {
			id: generateId(),
			type,
			title,
			message,
			priority: options.priority ?? "normal",
			timestamp: new Date().toISOString(),
			read: false,
			...options,
		};

		this.notifications.unshift(notification);
		
		// Trim to max notifications
		if (this.notifications.length > this.maxNotifications) {
			this.notifications = this.notifications.slice(0, this.maxNotifications);
		}

		this.saveNotifications();
		this.emit();
		this.showToast(notification);
		
		if (notification.priority === "urgent" || notification.priority === "high") {
			this.showDesktopNotification(notification);
		}

		return notification;
	}

	success(title: string, message: string, options?: Partial<Omit<Notification, "id" | "type" | "title" | "message" | "timestamp" | "read">>): Notification {
		return this.notify("success", title, message, options);
	}

	error(title: string, message: string, options?: Partial<Omit<Notification, "id" | "type" | "title" | "message" | "timestamp" | "read">>): Notification {
		return this.notify("error", title, message, { ...options, priority: options?.priority ?? "high" });
	}

	warning(title: string, message: string, options?: Partial<Omit<Notification, "id" | "type" | "title" | "message" | "timestamp" | "read">>): Notification {
		return this.notify("warning", title, message, options);
	}

	info(title: string, message: string, options?: Partial<Omit<Notification, "id" | "type" | "title" | "message" | "timestamp" | "read">>): Notification {
		return this.notify("info", title, message, options);
	}

	markAsRead(notificationId: string): void {
		const notification = this.notifications.find((n) => n.id === notificationId);
		if (notification) {
			notification.read = true;
			this.saveNotifications();
			this.emit();
		}
	}

	markAllAsRead(): void {
		for (const notification of this.notifications) {
			notification.read = true;
		}
		this.saveNotifications();
		this.emit();
	}

	dismiss(notificationId: string): void {
		this.notifications = this.notifications.filter((n) => n.id !== notificationId);
		
		const toast = document.getElementById(`toast-${notificationId}`);
		if (toast) {
			toast.remove();
		}
		
		this.saveNotifications();
		this.emit();
	}

	clearAll(): void {
		this.notifications = [];
		this.saveNotifications();
		this.emit();
	}

	getAll(): Notification[] {
		return [...this.notifications];
	}

	getUnread(): Notification[] {
		return this.notifications.filter((n) => !n.read);
	}

	getUnreadCount(): number {
		return this.notifications.filter((n) => !n.read).length;
	}

	subscribe(listener: NotificationListener): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}
}

// Global CSS for toast animations
if (typeof document !== "undefined") {
	const style = document.createElement("style");
	style.textContent = `
		@keyframes slideIn {
			from {
				opacity: 0;
				transform: translateX(100%);
			}
			to {
				opacity: 1;
				transform: translateX(0);
			}
		}
		@keyframes slideOut {
			from {
				opacity: 1;
				transform: translateX(0);
			}
			to {
				opacity: 0;
				transform: translateX(100%);
			}
		}
	`;
	document.head.appendChild(style);
}

export const notificationService = new NotificationService();
