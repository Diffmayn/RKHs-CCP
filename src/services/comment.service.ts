import { Comment, PhotoOrder, Notification } from '../types';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

export class CommentService {
  private authService: AuthService;
  private notificationService: NotificationService;

  constructor(authService: AuthService, notificationService: NotificationService) {
    this.authService = authService;
    this.notificationService = notificationService;
  }

  // Add a comment to an order
  async addComment(orderId: string, message: string, mentions: string[] = []): Promise<Comment> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to comment');
    }

    const comment: Comment = {
      id: this.generateId(),
      orderId,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
      readBy: [currentUser.id], // Creator has already "read" their own comment
      mentions,
      attachments: []
    };

    // Get current orders and add comment
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    orders[orderIndex].comments = orders[orderIndex].comments || [];
    orders[orderIndex].comments.push(comment);
    orders[orderIndex].lastActivity = new Date().toISOString();
    orders[orderIndex].updatedAt = new Date().toISOString();

    // Update unread count for all users except the commenter
    this.updateUnreadCounts(orders[orderIndex]);

    // Save orders
    localStorage.setItem('photo_orders', JSON.stringify(orders));

    // Send notifications
    await this.sendCommentNotifications(orders[orderIndex], comment);

    return comment;
  }

  // Get comments for an order
  getComments(orderId: string): Comment[] {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    return order?.comments || [];
  }

  // Mark comments as read for current user
  markCommentsAsRead(orderId: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return;

    const order = orders[orderIndex];
    order.comments = order.comments || [];

    // Mark all comments as read by current user
    order.comments.forEach(comment => {
      if (!comment.readBy.includes(currentUser.id)) {
        comment.readBy.push(currentUser.id);
      }
    });

    // Update unread count
    this.updateUnreadCounts(order);

    localStorage.setItem('photo_orders', JSON.stringify(orders));
  }

  // Get unread comment count for an order for current user
  getUnreadCommentCount(orderId: string): number {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return 0;

    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order?.comments) return 0;

    return order.comments.filter(comment => 
      !comment.readBy.includes(currentUser.id)
    ).length;
  }

  // Get total unread comments across all orders for current user
  getTotalUnreadComments(): number {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return 0;

    const orders = this.getOrders();
    let totalUnread = 0;

    orders.forEach(order => {
      if (order.comments) {
        totalUnread += order.comments.filter(comment => 
          !comment.readBy.includes(currentUser.id)
        ).length;
      }
    });

    return totalUnread;
  }

  // Delete a comment (only by creator or admin)
  async deleteComment(commentId: string): Promise<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    const orders = this.getOrders();
    
    for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
      const order = orders[orderIndex];
      if (!order.comments) continue;

      const commentIndex = order.comments.findIndex(c => c.id === commentId);
      if (commentIndex === -1) continue;

      const comment = order.comments[commentIndex];
      
      // Check if user can delete (creator or admin)
      if (comment.userId !== currentUser.id && currentUser.role !== 'Admin') {
        return false;
      }

      // Remove comment
      order.comments.splice(commentIndex, 1);
      order.updatedAt = new Date().toISOString();
      
      // Update unread counts
      this.updateUnreadCounts(order);

      localStorage.setItem('photo_orders', JSON.stringify(orders));
      return true;
    }

    return false;
  }

  // Edit a comment (only by creator)
  async editComment(commentId: string, newMessage: string): Promise<boolean> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    const orders = this.getOrders();
    
    for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
      const order = orders[orderIndex];
      if (!order.comments) continue;

      const commentIndex = order.comments.findIndex(c => c.id === commentId);
      if (commentIndex === -1) continue;

      const comment = order.comments[commentIndex];
      
      // Check if user can edit (only creator)
      if (comment.userId !== currentUser.id) {
        return false;
      }

      // Update comment
      order.comments[commentIndex].message = newMessage.trim();
      order.updatedAt = new Date().toISOString();

      localStorage.setItem('photo_orders', JSON.stringify(orders));
      return true;
    }

    return false;
  }

  // Private helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getOrders(): PhotoOrder[] {
    const ordersJson = localStorage.getItem('photo_orders');
    return ordersJson ? JSON.parse(ordersJson) : [];
  }

  private updateUnreadCounts(order: PhotoOrder): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    order.unreadCommentCount = order.comments?.filter(comment => 
      !comment.readBy.includes(currentUser.id)
    ).length || 0;
  }

  private async sendCommentNotifications(order: PhotoOrder, comment: Comment): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Get all users involved in this order
    const involvedUserIds = new Set<string>();
    
    // Add order creator
    if (order.createdBy) involvedUserIds.add(order.createdBy);
    
    // Add assigned user
    if (order.assignedTo) involvedUserIds.add(order.assignedTo);
    
    // Add users who have commented before
    order.comments?.forEach(c => {
      if (c.userId !== currentUser.id) {
        involvedUserIds.add(c.userId);
      }
    });

    // Add mentioned users
    comment.mentions.forEach(userId => involvedUserIds.add(userId));

    // Remove the commenter from notifications
    involvedUserIds.delete(currentUser.id);

    // Send notifications to all involved users
    for (const userId of involvedUserIds) {
      const notification: Notification = {
        id: this.generateId(),
        userId,
        type: comment.mentions.includes(userId) ? 'mention' : 'comment',
        title: comment.mentions.includes(userId) 
          ? `You were mentioned in ${order.title}`
          : `New comment on ${order.title}`,
        message: `${currentUser.name}: ${comment.message.substring(0, 100)}${comment.message.length > 100 ? '...' : ''}`,
        orderId: order.id,
        commentId: comment.id,
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: `#order/${order.id}/comments`
      };

      await this.notificationService.addNotification(notification);
    }
  }
}
