export interface Comment {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  readBy: string[]; // Array of user IDs who have read this comment
  mentions: string[]; // Array of user IDs mentioned in the comment
  attachments?: CommentAttachment[];
}

export interface CommentAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  orderId?: string;
  commentId?: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export type NotificationType = 
  | 'comment'
  | 'mention'
  | 'order_assigned'
  | 'order_status_changed'
  | 'sample_status_changed'
  | 'deadline_reminder'
  | 'overdue_alert';

export interface Article {
  id: string;
  name: string;
  description: string;
  sku?: string;
  category?: string;
  dimensions?: string;
  weight?: string;
  material?: string;
  color?: string;
  notes?: string;
}

export interface Sample {
  id: string;
  articleId: string;
  articleName: string;
  status: SampleStatus;
  location: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  transitHistory: SampleTransit[];
}

export interface SampleTransit {
  id: string;
  fromLocation: string;
  toLocation: string;
  transportMethod?: string;
  sentDate: string;
  expectedDate?: string;
  receivedDate?: string;
  handledBy: string;
  trackingNumber?: string;
  notes?: string;
}

export type SampleStatus = 
  | 'Created'
  | 'In Transit to Photographer'
  | 'At Photographer'
  | 'In Transit to Photo Box'
  | 'At Photo Box'
  | 'In Transit to Internal Studio'
  | 'At Internal Studio'
  | 'In Transit to External Studio'
  | 'At External Studio'
  | 'In Transit Back'
  | 'Returned'
  | 'Lost'
  | 'Damaged';

export type ContentCreationMethod = 
  | 'Photographer'
  | 'Photo Box'
  | 'Internal Studio'
  | 'External Studio';

export interface PhotoOrder {
  id: string;
  orderNumber: string;
  title: string;
  status: OrderStatus;
  contentCreationMethod: ContentCreationMethod;
  assignedTo?: string;
  briefing: string;
  articles: Article[];
  samples: Sample[];
  deadline: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  costCenter: string;
  budget?: number;
  deliverables: string[];
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  comments: Comment[];
  unreadCommentCount?: number; // For UI display
  lastActivity?: string; // For sorting by activity
}

export type OrderStatus = 
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Samples Requested'
  | 'Samples In Transit'
  | 'Ready for Production'
  | 'In Progress'
  | 'Review'
  | 'Revisions Needed'
  | 'Completed'
  | 'Delivered'
  | 'Cancelled'
  | 'On Hold';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  phone?: string;
}

export type UserRole = 
  | 'Admin'
  | 'Manager'
  | 'Coordinator'
  | 'Photographer'
  | 'Studio Assistant'
  | 'Client'
  | 'Viewer';

export interface FilterOptions {
  status?: OrderStatus[];
  contentCreationMethod?: ContentCreationMethod[];
  priority?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface SampleFilterOptions {
  status?: SampleStatus[];
  location?: string[];
  assignedTo?: string[];
  articleCategory?: string[];
}

export interface AppState {
  currentUser: User | null;
  orders: PhotoOrder[];
  samples: Sample[];
  isLoading: boolean;
  error: string | null;
  selectedOrder: PhotoOrder | null;
  selectedSample: Sample | null;
  filterOptions: FilterOptions;
  sampleFilterOptions: SampleFilterOptions;
}
