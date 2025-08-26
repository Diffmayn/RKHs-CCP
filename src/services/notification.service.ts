import { Notification } from '../types';

export class NotificationService {
  private container: HTMLElement | null = null;
  private notifications: Notification[] = [];

  constructor() {
    this.createContainer();
    this.loadNotifications();
  }

  private createContainer(): void {
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(this.container);
  }

  private loadNotifications(): void {
    const saved = localStorage.getItem('notifications');
    this.notifications = saved ? JSON.parse(saved) : [];
  }

  private saveNotifications(): void {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  // Add a persistent notification
  async addNotification(notification: Notification): Promise<void> {
    this.notifications.unshift(notification);
    this.saveNotifications();
    
    // Show as toast if user is currently active
    this.show(`💬 ${notification.title}`, 'info', 5000);
  }

  // Get notifications for a user
  getNotifications(userId: string): Notification[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  // Get unread notifications for a user
  getUnreadNotifications(userId: string): Notification[] {
    return this.notifications.filter(n => n.userId === userId && !n.isRead);
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveNotifications();
    }
  }

  // Mark all notifications as read for a user
  markAllAsRead(userId: string): void {
    this.notifications.forEach(n => {
      if (n.userId === userId) {
        n.isRead = true;
      }
    });
    this.saveNotifications();
  }

  // Delete notification
  deleteNotification(notificationId: string): void {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.saveNotifications();
    }
  }

  // Get unread count for a user
  getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.isRead).length;
  }

  // Show toast notification
  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 4000): void {
    if (!this.container) return;

    const notification = document.createElement('div');
    notification.className = `
      px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 
      max-w-sm opacity-0 translate-x-full
      ${this.getTypeClasses(type)}
    `;

    const icon = this.getTypeIcon(type);
    notification.innerHTML = `
      <div class="flex items-start">
        <span class="mr-2 text-lg">${icon}</span>
        <span class="text-sm font-medium">${message}</span>
        <button class="ml-auto text-lg leading-none hover:opacity-70" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    this.container.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove('opacity-0', 'translate-x-full');
    }, 10);

    // Auto remove
    setTimeout(() => {
      if (notification.parentElement) {
        notification.classList.add('opacity-0', 'translate-x-full');
        setTimeout(() => notification.remove(), 300);
      }
    }, duration);
  }

  private getTypeClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-black';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  }

  private getTypeIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }
}
