import { User, UserRole } from '../types/index.js';

interface LoginCredentials {
  username: string;
  password: string;
}

export class AuthService {
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'current_user';

  // Test users with credentials
  private readonly testUsers: { [key: string]: { password: string; user: User } } = {
    'promo1': {
      password: 'promo123',
      user: {
        id: 'user-promo1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'Coordinator',
        department: 'Marketing',
        phone: '+1-555-0123'
      }
    },
    'photo1': {
      password: 'photo123',
      user: {
        id: 'user-photo1',
        name: 'Mike Rodriguez',
        email: 'mike.rodriguez@company.com',
        role: 'Photographer',
        department: 'Creative',
        phone: '+1-555-0124'
      }
    },
    'photo2': {
      password: 'photo123',
      user: {
        id: 'user-photo2',
        name: 'Emily Chen',
        email: 'emily.chen@company.com',
        role: 'Photographer',
        department: 'Creative',
        phone: '+1-555-0125'
      }
    },
    'marketing1': {
      password: 'marketing123',
      user: {
        id: 'user-marketing1',
        name: 'David Thompson',
        email: 'david.thompson@company.com',
        role: 'Manager',
        department: 'Marketing',
        phone: '+1-555-0126'
      }
    },
    'admin1': {
      password: 'admin123',
      user: {
        id: 'user-admin1',
        name: 'Jennifer Smith',
        email: 'jennifer.smith@company.com',
        role: 'Admin',
        department: 'IT',
        phone: '+1-555-0127'
      }
    }
  };

  constructor() {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEY);
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Failed to load current user:', error);
    }
  }

  private saveCurrentUser(): void {
    try {
      if (this.currentUser) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save current user:', error);
    }
  }

  async login(credentials: LoginCredentials): Promise<User | null> {
    const { username, password } = credentials;
    
    // Check test users
    const testUser = this.testUsers[username.toLowerCase()];
    if (testUser && testUser.password === password) {
      this.currentUser = testUser.user;
      this.saveCurrentUser();
      return testUser.user;
    }

    return null;
  }

  logout(): void {
    this.currentUser = null;
    this.saveCurrentUser();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }

  // Role-based permissions
  canViewAllOrders(): boolean {
    return this.hasAnyRole(['Admin', 'Manager']);
  }

  canCreateOrders(): boolean {
    return this.hasAnyRole(['Admin', 'Manager', 'Coordinator']);
  }

  canEditAllOrders(): boolean {
    return this.hasAnyRole(['Admin', 'Manager']);
  }

  canManageSamples(): boolean {
    return this.hasAnyRole(['Admin', 'Manager', 'Coordinator', 'Studio Assistant']);
  }

  canUploadImages(): boolean {
    return this.hasAnyRole(['Admin', 'Manager', 'Photographer']);
  }

  canViewOrder(order: any): boolean {
    if (!this.currentUser) return false;

    switch (this.currentUser.role) {
      case 'Admin':
      case 'Manager':
        return true; // Can view all orders
      
      case 'Coordinator':
        return order.createdBy === this.currentUser.id; // Can view own orders
      
      case 'Photographer':
        return order.assignedTo === this.currentUser.id; // Can view assigned orders
      
      default:
        return false;
    }
  }

  canEditOrder(order: any): boolean {
    if (!this.currentUser) return false;

    switch (this.currentUser.role) {
      case 'Admin':
      case 'Manager':
        return true; // Can edit all orders
      
      case 'Coordinator':
        return order.createdBy === this.currentUser.id; // Can edit own orders
      
      case 'Photographer':
        return order.assignedTo === this.currentUser.id; // Can edit assigned orders (status, images)
      
      default:
        return false;
    }
  }

  getAllUsers(): User[] {
    return Object.values(this.testUsers).map(u => u.user);
  }

  getUsersByRole(role: UserRole): User[] {
    return this.getAllUsers().filter(user => user.role === role);
  }

  getTestCredentials(): { [role: string]: LoginCredentials } {
    return {
      'Promo Coordinator': { username: 'promo1', password: 'promo123' },
      'Photographer': { username: 'photo1', password: 'photo123' },
      'Marketing Manager': { username: 'marketing1', password: 'marketing123' },
      'Admin': { username: 'admin1', password: 'admin123' }
    };
  }
}
