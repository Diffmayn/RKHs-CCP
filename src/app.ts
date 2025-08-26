import { AuthService } from './services/auth.service.js';
import { OrderService } from './services/order.service.js';
import { NotificationService } from './services/notification.service.js';
import { CommentService } from './services/comment.service.js';
import { PhotoOrder, Sample, User, Article, ContentCreationMethod, OrderStatus, SampleStatus } from './types/index.js';

export class PhotoOrderApp {
  private authService: AuthService;
  private orderService: OrderService;
  private notificationService: NotificationService;
  private commentService: CommentService;
  private currentView: string = 'dashboard';
  private currentOrder: PhotoOrder | null = null;
  private currentSample: Sample | null = null;

  constructor() {
    this.authService = new AuthService();
    this.orderService = new OrderService();
    this.notificationService = new NotificationService();
    this.commentService = new CommentService(this.authService, this.notificationService);
  }

  async init(): Promise<void> {
    try {
      await this.orderService.ensureLoaded();
      this.render();
      this.bindEvents();
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.notificationService.error('Failed to initialize application');
    }
  }

  private render(): void {
    const app = document.getElementById('app');
    if (!app) return;

    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.renderLogin(app);
      return;
    }

    app.innerHTML = `
      <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="px-6 py-4 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <h1 class="text-2xl font-bold text-gray-900">📸 Photo Order Management</h1>
              <span class="text-sm text-gray-500">Enterprise Content Creation System</span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">Welcome, ${currentUser.name}</span>
              <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${currentUser.role}</span>
              <button id="logout-btn" class="text-sm text-gray-500 hover:text-gray-700">Logout</button>
            </div>
          </div>
        </header>

        <div class="flex-1 flex overflow-hidden">
          <!-- Sidebar -->
          <nav class="w-64 bg-white shadow-sm border-r border-gray-200">
            <div class="p-4 space-y-2">
              <button class="nav-btn w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 ${this.currentView === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}" data-view="dashboard">
                📊 Dashboard
              </button>
              <button class="nav-btn w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 ${this.currentView === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}" data-view="orders">
                📋 Photo Orders
              </button>
              <button class="nav-btn w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 ${this.currentView === 'samples' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}" data-view="samples">
                📦 Sample Management
              </button>
              ${this.authService.canCreateOrders() ? `
                <button class="nav-btn w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 ${this.currentView === 'create-order' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}" data-view="create-order">
                  ➕ Create Order
                </button>
              ` : ''}
            </div>
          </nav>

          <!-- Main Content -->
          <main class="flex-1 overflow-auto">
            <div id="main-content" class="h-full">
              ${this.renderMainContent()}
            </div>
          </main>
        </div>
      </div>
    `;
  }

  private renderLogin(container: HTMLElement): void {
    const testCredentials = this.authService.getTestCredentials();
    
    container.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; padding: 48px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); max-width: 420px; width: 100%;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="margin: 0 0 8px 0; font-size: 32px; font-weight: 700; color: #1f2937;">📸 Photo Order</h1>
            <p style="margin: 0; color: #6b7280; font-size: 16px;">Management System</p>
            <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 14px;">Role-based access control</p>
          </div>

          <form id="login-form" style="margin-bottom: 32px;">
            <div style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Username</label>
              <input type="text" id="username" required 
                style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; transition: border-color 0.15s;" 
                placeholder="Enter your username">
            </div>

            <div style="margin-bottom: 32px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Password</label>
              <input type="password" id="password" required 
                style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; transition: border-color 0.15s;" 
                placeholder="Enter your password">
            </div>

            <button type="submit" 
              style="width: 100%; background: #3b82f6; color: white; border: none; padding: 14px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.15s; margin-bottom: 16px;">
              Sign In
            </button>
          </form>

          <div id="login-error" style="margin-bottom: 24px; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; display: none;"></div>

          <div style="padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280; text-align: center; font-weight: 600;">Test Credentials - Click to use:</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px;">
              ${Object.entries(testCredentials).map(([role, creds]) => `
                <div style="background: #f9fafb; padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb; transition: all 0.15s;" 
                     onmouseover="this.style.background='#f3f4f6'; this.style.borderColor='#d1d5db';"
                     onmouseout="this.style.background='#f9fafb'; this.style.borderColor='#e5e7eb';"
                     onclick="document.getElementById('username').value='${creds.username}'; document.getElementById('password').value='${creds.password}';">
                  <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">${role}</div>
                  <div style="color: #6b7280; font-family: monospace;">${creds.username}</div>
                  <div style="color: #9ca3af; font-family: monospace;">••••••</div>
                </div>
              `).join('')}
            </div>
            <p style="margin: 16px 0 0 0; font-size: 11px; color: #9ca3af; text-align: center;">Each role has different permissions and access levels</p>
          </div>
        </div>
      </div>
    `;
  }

  private renderMainContent(): string {
    switch (this.currentView) {
      case 'dashboard':
        return this.renderDashboard();
      case 'orders':
        return this.renderOrdersList();
      case 'samples':
        return this.renderSamplesList();
      case 'create-order':
        return this.renderCreateOrder();
      case 'order-details':
        return this.renderOrderDetails();
      case 'sample-details':
        return this.renderSampleDetails();
      default:
        return this.renderDashboard();
    }
  }

  private renderDashboard(): string {
    return `
      <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
          <button id="refresh-dashboard" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            🔄 Refresh
          </button>
        </div>
        
        <div id="dashboard-stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Stats will be loaded here -->
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
            <div id="recent-orders">
              <!-- Recent orders will be loaded here -->
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Sample Activity</h3>
            <div id="sample-activity">
              <!-- Sample activity will be loaded here -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderOrdersList(): string {
    return `
      <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Photo Orders</h2>
          ${this.authService.canCreateOrders() ? `
            <button id="create-order-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              ➕ Create New Order
            </button>
          ` : ''}
        </div>

        <div class="bg-white rounded-lg shadow">
          <div class="p-4 border-b border-gray-200">
            <div class="flex flex-wrap gap-4 items-center">
              <input type="text" id="search-orders" placeholder="🔍 Search orders..." 
                     class="flex-1 min-w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <select id="filter-status" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Delivered">Delivered</option>
              </select>
              <select id="filter-method" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Methods</option>
                <option value="Photographer">Photographer</option>
                <option value="Photo Box">Photo Box</option>
                <option value="Internal Studio">Internal Studio</option>
                <option value="External Studio">External Studio</option>
              </select>
              <button id="export-orders" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                📊 Export CSV
              </button>
            </div>
          </div>
          
          <div id="orders-table" class="overflow-x-auto">
            <!-- Orders table will be loaded here -->
          </div>
        </div>
      </div>
    `;
  }

  private renderSamplesList(): string {
    return `
      <div class="p-6 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Sample Management</h2>
          ${this.authService.canManageSamples() ? `
            <button id="create-sample-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              ➕ Add Sample
            </button>
          ` : ''}
        </div>

        <div class="bg-white rounded-lg shadow">
          <div class="p-4 border-b border-gray-200">
            <div class="flex flex-wrap gap-4 items-center">
              <input type="text" id="search-samples" placeholder="🔍 Search samples..." 
                     class="flex-1 min-w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <select id="filter-sample-status" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">All Statuses</option>
                <option value="Created">Created</option>
                <option value="In Transit to Photographer">In Transit to Photographer</option>
                <option value="At Photographer">At Photographer</option>
                <option value="In Transit to Photo Box">In Transit to Photo Box</option>
                <option value="At Photo Box">At Photo Box</option>
                <option value="In Transit to Internal Studio">In Transit to Internal Studio</option>
                <option value="At Internal Studio">At Internal Studio</option>
                <option value="In Transit to External Studio">In Transit to External Studio</option>
                <option value="At External Studio">At External Studio</option>
                <option value="Returned">Returned</option>
              </select>
              <button id="export-samples" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                📊 Export CSV
              </button>
            </div>
          </div>
          
          <div id="samples-table" class="overflow-x-auto">
            <!-- Samples table will be loaded here -->
          </div>
        </div>
      </div>
    `;
  }

  private renderCreateOrder(): string {
    const users = this.authService.getAllUsers();
    const photographers = users.filter(u => u.role === 'Photographer');
    
    return `
      <div class="p-6 max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Create New Photo Order</h2>
          
          <form id="create-order-form" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="order-title" class="block text-sm font-medium text-gray-700 mb-1">Order Title *</label>
                <input type="text" id="order-title" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                       placeholder="e.g., Premium Product Photography Session">
              </div>
              
              <div>
                <label for="content-method" class="block text-sm font-medium text-gray-700 mb-1">Content Creation Method *</label>
                <select id="content-method" required 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select method...</option>
                  <option value="Photographer">Photographer</option>
                  <option value="Photo Box">Photo Box</option>
                  <option value="Internal Studio">Internal Studio</option>
                  <option value="External Studio">External Studio</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="assigned-to" class="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select id="assigned-to" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select person...</option>
                  ${users.map(user => `<option value="${user.name}">${user.name} - ${user.role}</option>`).join('')}
                </select>
              </div>
              
              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                <select id="priority" required 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="Low">Low</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label for="deadline" class="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                <input type="datetime-local" id="deadline" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="cost-center" class="block text-sm font-medium text-gray-700 mb-1">Cost Center *</label>
                <input type="text" id="cost-center" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                       placeholder="e.g., CC-101">
              </div>
              
              <div>
                <label for="budget" class="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <input type="number" id="budget" min="0" step="100" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                       placeholder="0">
              </div>
            </div>

            <!-- Briefing -->
            <div>
              <label for="briefing" class="block text-sm font-medium text-gray-700 mb-1">Detailed Brief *</label>
              <textarea id="briefing" required rows="6"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Provide detailed instructions for the content creation, including style, requirements, deliverables, etc."></textarea>
            </div>

            <!-- Articles Section -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Articles *</label>
              <div id="articles-section" class="space-y-4">
                <div class="article-item border border-gray-200 rounded-lg p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input type="text" class="article-name w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                             placeholder="Article name *" required>
                    </div>
                    <div>
                      <input type="text" class="article-sku w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                             placeholder="SKU">
                    </div>
                  </div>
                  <div class="mt-3">
                    <textarea class="article-description w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                              placeholder="Article description" rows="2"></textarea>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                    <input type="text" class="article-category w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                           placeholder="Category">
                    <input type="text" class="article-color w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                           placeholder="Color">
                    <input type="text" class="article-material w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                           placeholder="Material">
                  </div>
                </div>
              </div>
              <button type="button" id="add-article" class="mt-3 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                ➕ Add Another Article
              </button>
            </div>

            <!-- Deliverables -->
            <div>
              <label for="deliverables" class="block text-sm font-medium text-gray-700 mb-1">Deliverables</label>
              <input type="text" id="deliverables" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                     placeholder="e.g., Product Photos, Lifestyle Shots, Social Media Assets (comma-separated)">
            </div>

            <!-- Special Instructions -->
            <div>
              <label for="special-instructions" class="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
              <textarea id="special-instructions" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any special requirements or notes"></textarea>
            </div>

            <!-- Tags -->
            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input type="text" id="tags" 
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                     placeholder="e.g., product-launch, high-priority, e-commerce (comma-separated)">
            </div>

            <div class="flex justify-end space-x-4 pt-6">
              <button type="button" id="cancel-create" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Order
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  private renderOrderDetails(): string {
    if (!this.currentOrder) return '<div class="p-6">Order not found</div>';
    
    const order = this.currentOrder;
    const canEdit = this.authService.canEditAllOrders() || this.authService.getCurrentUser()?.name === order.createdBy;
    
    return `
      <div class="p-6 max-w-6xl mx-auto space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">${order.title}</h2>
            <p class="text-gray-600">${order.orderNumber}</p>
          </div>
          <div class="flex items-center space-x-3">
            ${canEdit ? `
              <button id="edit-order" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                ✏️ Edit Order
              </button>
            ` : ''}
            <button id="back-to-orders" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              ← Back to Orders
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Details -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Status:</span>
                  <span class="ml-2 px-2 py-1 rounded-full text-xs ${this.getStatusBadgeClass(order.status)}">${order.status}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Method:</span>
                  <span class="ml-2">${order.contentCreationMethod}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Priority:</span>
                  <span class="ml-2 px-2 py-1 rounded-full text-xs ${this.getPriorityBadgeClass(order.priority)}">${order.priority}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Assigned To:</span>
                  <span class="ml-2">${order.assignedTo || 'Unassigned'}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Deadline:</span>
                  <span class="ml-2">${new Date(order.deadline).toLocaleDateString()}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Budget:</span>
                  <span class="ml-2">${order.budget ? '$' + order.budget.toLocaleString() : 'Not set'}</span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Brief</h3>
              <div class="text-gray-700 whitespace-pre-wrap">${order.briefing}</div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Articles (${order.articles.length})</h3>
              <div class="space-y-4">
                ${order.articles.map(article => `
                  <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <h4 class="font-medium text-gray-900">${article.name}</h4>
                      ${article.sku ? `<span class="text-sm text-gray-500">${article.sku}</span>` : ''}
                    </div>
                    ${article.description ? `<p class="text-sm text-gray-600 mt-1">${article.description}</p>` : ''}
                    <div class="flex flex-wrap gap-2 mt-2">
                      ${article.category ? `<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">${article.category}</span>` : ''}
                      ${article.color ? `<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">${article.color}</span>` : ''}
                      ${article.material ? `<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">${article.material}</span>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div class="space-y-3">
                ${this.authService.canManageSamples() ? `
                  <button id="request-samples" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    📦 Request Samples
                  </button>
                ` : ''}
                ${canEdit ? `
                  <button id="update-status" class="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm">
                    🔄 Update Status
                  </button>
                ` : ''}
                <button id="view-samples" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  👀 View Samples
                </button>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Info</h3>
              <div class="space-y-2 text-sm">
                <div>
                  <span class="font-medium text-gray-700">Created:</span>
                  <div class="text-gray-600">${new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Updated:</span>
                  <div class="text-gray-600">${new Date(order.updatedAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Created By:</span>
                  <div class="text-gray-600">${order.createdBy}</div>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Cost Center:</span>
                  <div class="text-gray-600">${order.costCenter}</div>
                </div>
              </div>
            </div>

            ${order.tags.length > 0 ? `
              <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div class="flex flex-wrap gap-2">
                  ${order.tags.map(tag => `<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${tag}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  private async bindEvents(): Promise<void> {
    const app = document.getElementById('app');
    if (!app) return;

    // Delegation pattern for dynamic content
    app.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      
      if (target.id === 'logout-btn') {
        this.authService.logout();
        this.render();
        this.notificationService.success('Logged out successfully');
      }
      
      if (target.classList.contains('nav-btn')) {
        const view = target.getAttribute('data-view');
        if (view) {
          this.currentView = view;
          this.updateMainContent();
        }
      }
      
      if (target.id === 'create-order-btn') {
        this.currentView = 'create-order';
        this.updateMainContent();
      }
      
      if (target.id === 'refresh-dashboard') {
        await this.loadDashboardData();
      }
      
      if (target.id === 'export-orders') {
        await this.exportOrders();
      }
      
      if (target.id === 'export-samples') {
        await this.exportSamples();
      }
      
      if (target.id === 'add-article') {
        this.addArticleField();
      }
      
      if (target.id === 'cancel-create') {
        this.currentView = 'orders';
        this.updateMainContent();
      }
      
      if (target.id === 'back-to-orders') {
        this.currentView = 'orders';
        this.updateMainContent();
      }
    });

    // Form submissions
    app.addEventListener('submit', async (e) => {
      e.preventDefault();
      const target = e.target as HTMLFormElement;
      
      if (target.id === 'login-form') {
        await this.handleLogin(target);
      }
      
      if (target.id === 'create-order-form') {
        await this.handleCreateOrder(target);
      }
    });

    // Search and filter events
    app.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      
      if (target.id === 'search-orders') {
        this.filterOrders();
      }
      
      if (target.id === 'search-samples') {
        this.filterSamples();
      }
    });

    app.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      
      if (target.id === 'filter-status' || target.id === 'filter-method') {
        this.filterOrders();
      }
      
      if (target.id === 'filter-sample-status') {
        this.filterSamples();
      }
    });

    // Initial data load
    if (this.authService.isAuthenticated()) {
      await this.loadDashboardData();
      await this.loadOrdersTable();
      await this.loadSamplesTable();
    }
  }

  private updateMainContent(): void {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = this.renderMainContent();
      
      // Update navigation
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-50', 'text-blue-700');
        btn.classList.add('text-gray-700');
      });
      
      const activeBtn = document.querySelector(`[data-view="${this.currentView}"]`);
      if (activeBtn) {
        activeBtn.classList.add('bg-blue-50', 'text-blue-700');
        activeBtn.classList.remove('text-gray-700');
      }
    }
  }

  private async handleLogin(form: HTMLFormElement): Promise<void> {
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const errorDiv = document.getElementById('login-error');
    
    if (!username || !password) {
      this.showLoginError('Please enter both username and password');
      return;
    }
    
    try {
      const user = await this.authService.login({ username, password });
      if (user) {
        this.notificationService.success(`Welcome back, ${user.name}! Logged in as ${user.role}`);
        this.render();
      } else {
        this.showLoginError('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showLoginError('An error occurred during login. Please try again.');
    }
  }

  private showLoginError(message: string): void {
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = message;
      
      // Hide error after 5 seconds
      setTimeout(() => {
        errorDiv.style.display = 'none';
      }, 5000);
    }
  }

  private async handleCreateOrder(form: HTMLFormElement): Promise<void> {
    try {
      const formData = new FormData(form);
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.notificationService.error('You must be logged in to create orders');
        return;
      }

      // Collect articles
      const articles: Omit<Article, 'id'>[] = [];
      const articleItems = document.querySelectorAll('.article-item');
      
      articleItems.forEach(item => {
        const name = (item.querySelector('.article-name') as HTMLInputElement)?.value;
        const description = (item.querySelector('.article-description') as HTMLTextAreaElement)?.value;
        const sku = (item.querySelector('.article-sku') as HTMLInputElement)?.value;
        const category = (item.querySelector('.article-category') as HTMLInputElement)?.value;
        const color = (item.querySelector('.article-color') as HTMLInputElement)?.value;
        const material = (item.querySelector('.article-material') as HTMLInputElement)?.value;
        
        if (name) {
          articles.push({
            name,
            description: description || '',
            sku: sku || undefined,
            category: category || undefined,
            color: color || undefined,
            material: material || undefined
          });
        }
      });

      if (articles.length === 0) {
        this.notificationService.error('Please add at least one article');
        return;
      }

      // Parse deliverables and tags
      const deliverablesText = formData.get('deliverables') as string;
      const deliverables = deliverablesText ? deliverablesText.split(',').map(d => d.trim()).filter(d => d) : [];
      
      const tagsText = formData.get('tags') as string;
      const tags = tagsText ? tagsText.split(',').map(t => t.trim()).filter(t => t) : [];

      const orderData = {
        title: formData.get('title') as string,
        status: 'Draft' as OrderStatus,
        contentCreationMethod: formData.get('content-method') as ContentCreationMethod,
        assignedTo: formData.get('assigned-to') as string || undefined,
        briefing: formData.get('briefing') as string,
        articles: articles,
        samples: [],
        deadline: formData.get('deadline') as string,
        priority: formData.get('priority') as 'Low' | 'Medium' | 'High' | 'Urgent',
        costCenter: formData.get('cost-center') as string,
        budget: formData.get('budget') ? Number(formData.get('budget')) : undefined,
        deliverables: deliverables,
        specialInstructions: formData.get('special-instructions') as string || undefined,
        createdBy: currentUser.name,
        tags: tags
      };

      const newOrder = await this.orderService.createOrder(orderData);
      this.notificationService.success('Order created successfully!');
      this.currentView = 'orders';
      this.updateMainContent();
      await this.loadOrdersTable();
      
    } catch (error) {
      console.error('Failed to create order:', error);
      this.notificationService.error('Failed to create order');
    }
  }

  private addArticleField(): void {
    const articlesSection = document.getElementById('articles-section');
    if (!articlesSection) return;

    const articleItem = document.createElement('div');
    articleItem.className = 'article-item border border-gray-200 rounded-lg p-4';
    articleItem.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-medium text-gray-900">Article ${articlesSection.children.length + 1}</h4>
        <button type="button" class="remove-article text-red-600 hover:text-red-800">✕ Remove</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input type="text" class="article-name w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                 placeholder="Article name *" required>
        </div>
        <div>
          <input type="text" class="article-sku w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                 placeholder="SKU">
        </div>
      </div>
      <div class="mt-3">
        <textarea class="article-description w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Article description" rows="2"></textarea>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
        <input type="text" class="article-category w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
               placeholder="Category">
        <input type="text" class="article-color w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
               placeholder="Color">
        <input type="text" class="article-material w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
               placeholder="Material">
      </div>
    `;

    articlesSection.appendChild(articleItem);

    // Add remove functionality
    const removeBtn = articleItem.querySelector('.remove-article');
    removeBtn?.addEventListener('click', () => {
      articleItem.remove();
    });
  }

  private async loadDashboardData(): Promise<void> {
    try {
      const [orderStats, sampleStats, orders, samples] = await Promise.all([
        this.orderService.getOrderStatistics(),
        this.orderService.getSampleStatistics(),
        this.orderService.getAllOrders(),
        this.orderService.getAllSamples()
      ]);

      this.renderDashboardStats(orderStats, sampleStats);
      this.renderRecentOrders(orders.slice(0, 5));
      this.renderSampleActivity(samples.slice(0, 5));
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      this.notificationService.error('Failed to load dashboard data');
    }
  }

  private renderDashboardStats(orderStats: any, sampleStats: any): void {
    const container = document.getElementById('dashboard-stats');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <span class="text-2xl">📋</span>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Orders</p>
            <p class="text-2xl font-bold text-gray-900">${orderStats.total}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <span class="text-2xl">✅</span>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Completed</p>
            <p class="text-2xl font-bold text-gray-900">${orderStats.byStatus['Completed'] || 0}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <span class="text-2xl">⏳</span>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">In Progress</p>
            <p class="text-2xl font-bold text-gray-900">${orderStats.byStatus['In Progress'] || 0}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <span class="text-2xl">📦</span>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Samples</p>
            <p class="text-2xl font-bold text-gray-900">${sampleStats.total}</p>
          </div>
        </div>
      </div>
    `;
  }

  private renderRecentOrders(orders: PhotoOrder[]): void {
    const container = document.getElementById('recent-orders');
    if (!container) return;

    if (orders.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-sm">No orders found</p>';
      return;
    }

    container.innerHTML = `
      <div class="space-y-3">
        ${orders.map(order => `
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" 
               onclick="window.photoApp.viewOrder('${order.id}')">
            <div>
              <h4 class="font-medium text-gray-900">${order.title}</h4>
              <p class="text-sm text-gray-600">${order.orderNumber}</p>
            </div>
            <span class="px-2 py-1 rounded-full text-xs ${this.getStatusBadgeClass(order.status)}">${order.status}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  private renderSampleActivity(samples: Sample[]): void {
    const container = document.getElementById('sample-activity');
    if (!container) return;

    if (samples.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-sm">No sample activity found</p>';
      return;
    }

    container.innerHTML = `
      <div class="space-y-3">
        ${samples.map(sample => `
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 class="font-medium text-gray-900">${sample.articleName}</h4>
              <p class="text-sm text-gray-600">${sample.location}</p>
            </div>
            <span class="px-2 py-1 rounded-full text-xs ${this.getSampleStatusBadgeClass(sample.status)}">${sample.status}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  private async loadOrdersTable(): Promise<void> {
    try {
      const orders = await this.orderService.getAllOrders();
      this.renderOrdersTable(orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      this.notificationService.error('Failed to load orders');
    }
  }

  private renderOrdersTable(orders: PhotoOrder[]): void {
    const container = document.getElementById('orders-table');
    if (!container) return;

    if (orders.length === 0) {
      container.innerHTML = '<div class="p-8 text-center text-gray-500">No orders found</div>';
      return;
    }

    container.innerHTML = `
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          ${orders.map(order => `
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">${order.title}</div>
                  <div class="text-sm text-gray-500">${order.orderNumber}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded-full text-xs ${this.getStatusBadgeClass(order.status)}">${order.status}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.contentCreationMethod}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.assignedTo || 'Unassigned'}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${new Date(order.deadline).toLocaleDateString()}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.articles.length}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="window.photoApp.viewOrder('${order.id}')" class="text-blue-600 hover:text-blue-900">View</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  private async loadSamplesTable(): Promise<void> {
    try {
      const samples = await this.orderService.getAllSamples();
      this.renderSamplesTable(samples);
    } catch (error) {
      console.error('Failed to load samples:', error);
      this.notificationService.error('Failed to load samples');
    }
  }

  private renderSamplesTable(samples: Sample[]): void {
    const container = document.getElementById('samples-table');
    if (!container) return;

    if (samples.length === 0) {
      container.innerHTML = '<div class="p-8 text-center text-gray-500">No samples found</div>';
      return;
    }

    container.innerHTML = `
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          ${samples.map(sample => `
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${sample.articleName}</div>
                <div class="text-sm text-gray-500">${sample.id}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded-full text-xs ${this.getSampleStatusBadgeClass(sample.status)}">${sample.status}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sample.location}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sample.assignedTo || 'Unassigned'}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${new Date(sample.updatedAt).toLocaleDateString()}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="window.photoApp.viewSample('${sample.id}')" class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                ${this.authService.canManageSamples() ? `
                  <button onclick="window.photoApp.updateSampleStatus('${sample.id}')" class="text-green-600 hover:text-green-900">Update</button>
                ` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  private filterOrders(): void {
    // Implementation for filtering orders based on search and filter inputs
    // This would typically re-render the table with filtered results
  }

  private filterSamples(): void {
    // Implementation for filtering samples based on search and filter inputs
    // This would typically re-render the table with filtered results
  }

  private async exportOrders(): Promise<void> {
    try {
      const csv = await this.orderService.exportToCSV('orders');
      this.downloadCSV(csv, 'photo-orders.csv');
      this.notificationService.success('Orders exported successfully');
    } catch (error) {
      console.error('Failed to export orders:', error);
      this.notificationService.error('Failed to export orders');
    }
  }

  private async exportSamples(): Promise<void> {
    try {
      const csv = await this.orderService.exportToCSV('samples');
      this.downloadCSV(csv, 'photo-samples.csv');
      this.notificationService.success('Samples exported successfully');
    } catch (error) {
      console.error('Failed to export samples:', error);
      this.notificationService.error('Failed to export samples');
    }
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Public methods for global access
  async viewOrder(orderId: string): Promise<void> {
    try {
      const order = await this.orderService.getOrderById(orderId);
      if (order) {
        this.currentOrder = order;
        this.currentView = 'order-details';
        this.updateMainContent();
      } else {
        this.notificationService.error('Order not found');
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      this.notificationService.error('Failed to load order');
    }
  }

  async viewSample(sampleId: string): Promise<void> {
    try {
      const sample = await this.orderService.getSampleById(sampleId);
      if (sample) {
        this.currentSample = sample;
        this.currentView = 'sample-details';
        this.updateMainContent();
      } else {
        this.notificationService.error('Sample not found');
      }
    } catch (error) {
      console.error('Failed to load sample:', error);
      this.notificationService.error('Failed to load sample');
    }
  }

  async updateSampleStatus(sampleId: string): Promise<void> {
    // Implementation for updating sample status
    // This would show a modal with status options
    this.notificationService.info('Sample status update feature coming soon');
  }

  private getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Delivered': return 'bg-purple-100 text-purple-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  private getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  private getSampleStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Created': return 'bg-gray-100 text-gray-800';
      case 'At Photographer': return 'bg-blue-100 text-blue-800';
      case 'At Photo Box': return 'bg-purple-100 text-purple-800';
      case 'At Internal Studio': return 'bg-green-100 text-green-800';
      case 'At External Studio': return 'bg-yellow-100 text-yellow-800';
      case 'Returned': return 'bg-green-100 text-green-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      case 'Damaged': return 'bg-red-100 text-red-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  }
}
