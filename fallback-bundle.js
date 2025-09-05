// Enhanced Fallback Runtime with better UX
(function(){
  
  try {
    const root = document.getElementById('app');
    if(!root || window.__APP_STARTED__) {
      return;
    }

    // Mark fallback as active
    window.__FALLBACK_ACTIVE__ = true;

    // Hide loading screen and show app
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }

    // Mark fallback as active
    window.__FALLBACK_ACTIVE__ = true;

  // Authentication System
  class AuthSystem {
    constructor() {
      this.currentUser = null;
      this.testUsers = {
        'promo1': {
          password: 'promo123',
          user: {
            id: 'user-promo1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@company.com',
            role: 'Promo Coordinator',
            department: 'Marketing',
            purchaseGroups: [100, 200] // Groceries, Fresh Products
          }
        },
        'promo2': {
          password: 'promo123',
          user: {
            id: 'user-promo2',
            name: 'Lars Nielsen',
            email: 'lars.nielsen@company.com',
            role: 'Promo Coordinator',
            department: 'Marketing',
            purchaseGroups: [300, 400] // Electronics, Home & Garden
          }
        },
        'photo1': {
          password: 'photo123',
          user: {
            id: 'user-photo1',
            name: 'Mike Rodriguez',
            email: 'mike.rodriguez@company.com',
            role: 'Photographer',
            department: 'Creative'
          }
        },
        'photo2': {
          password: 'photo123',
          user: {
            id: 'user-photo2',
            name: 'Emily Chen',
            email: 'emily.chen@company.com',
            role: 'Photographer',
            department: 'Creative'
          }
        },
        'photobox1': {
          password: 'photobox123',
          user: {
            id: 'user-photobox1',
            name: 'Alex Turner',
            email: 'alex.turner@company.com',
            role: 'Photo Box',
            department: 'Creative'
          }
        },
        'marketing1': {
          password: 'marketing123',
          user: {
            id: 'user-marketing1',
            name: 'David Thompson',
            email: 'david.thompson@company.com',
            role: 'Marketing Manager',
            department: 'Marketing'
          }
        },
        'admin1': {
          password: 'admin123',
          user: {
            id: 'user-admin1',
            name: 'Jennifer Smith',
            email: 'jennifer.smith@company.com',
            role: 'Admin',
            department: 'IT'
          }
        }
      };
      
      this.loadSession();
    }

    loadSession() {
      const saved = localStorage.getItem('current_user');
      if (saved) {
        try {
          this.currentUser = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to load session:', e);
        }
      }
    }

    saveSession() {
      if (this.currentUser) {
        localStorage.setItem('current_user', JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem('current_user');
      }
    }

    login(username, password) {
      const testUser = this.testUsers[username.toLowerCase()];
      if (testUser && testUser.password === password) {
        this.currentUser = testUser.user;
        this.saveSession();
        return true;
      }
      return false;
    }

    logout() {
      this.currentUser = null;
      this.saveSession();
    }

    getCurrentUser() {
      return this.currentUser;
    }

    isAuthenticated() {
      return this.currentUser !== null;
    }

    canViewAllOrders() {
      return this.currentUser && ['Admin', 'Marketing Manager'].includes(this.currentUser.role);
    }

    canCreateOrders() {
      return this.currentUser && ['Admin', 'Marketing Manager', 'Promo Coordinator'].includes(this.currentUser.role);
    }

    canEditOrder(order) {
      if (!this.currentUser) return false;
      
      switch (this.currentUser.role) {
        case 'Admin':
        case 'Marketing Manager':
          return true;
        case 'Promo Coordinator':
          return order.createdBy === this.currentUser.id;
        case 'Photographer':
        case 'Photo Box':
          return order.assignedTo === this.currentUser.id;
        default:
          return false;
      }
    }

    canUploadImages() {
      return this.currentUser && ['Admin', 'Marketing Manager', 'Photographer', 'Photo Box'].includes(this.currentUser.role);
    }

    // Permission to manage order status and workflow
    canManageOrders() {
      return this.currentUser && ['Admin', 'Marketing Manager', 'Promo Coordinator'].includes(this.currentUser.role);
    }

    getFilteredOrders(allOrders) {
      if (!this.currentUser) return [];
      
      switch (this.currentUser.role) {
        case 'Admin':
        case 'Marketing Manager':
          return allOrders; // Can see all orders
        case 'Promo Coordinator':
          // Filter by purchase groups assigned to the promo coordinator
          if (this.currentUser.purchaseGroups && this.currentUser.purchaseGroups.length > 0) {
            return allOrders.filter(order => 
              order.purchaseGroup && this.currentUser.purchaseGroups.includes(order.purchaseGroup)
            );
          }
          // Fallback to old behavior if no purchase groups defined
          return allOrders.filter(order => order.createdBy === this.currentUser.id);
        case 'Photographer':
        case 'Photo Box':
          return allOrders.filter(order => order.assignedTo === this.currentUser.id);
        default:
          return [];
      }
    }

    getUserIdByName(name) {
      for (const username in this.testUsers) {
        if (this.testUsers[username].user.name === name) {
          return this.testUsers[username].user.id;
        }
      }
      return null;
    }
  }

  // Initialize auth and check login
  const authSystem = new AuthSystem();
  
  // Expose authSystem globally for access from other scopes
  window.authSystem = authSystem;

  // Show login screen if not authenticated
  function showLoginScreen() {
    root.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; padding: 48px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); max-width: 420px; width: 100%;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="margin: 0 0 8px 0; font-size: 32px; font-weight: 700; color: #1f2937;">📸 Photo Order</h1>
            <p style="margin: 0; color: #6b7280; font-size: 16px;">Management System</p>
            <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 14px;">Role-based access control</p>
          </div>

          <form id="loginForm" style="margin-bottom: 32px;">
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

          <div id="loginError" style="margin-bottom: 24px; padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; display: none;"></div>

          <div style="padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280; text-align: center; font-weight: 600;">Test Credentials - Click to use:</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px;">
              <div style="background: #f9fafb; padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb; transition: all 0.15s;" 
                   onclick="document.getElementById('username').value='promo1'; document.getElementById('password').value='promo123';">
                <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">📊 Promo Coordinator</div>
                <div style="color: #374151; font-weight: 500;">Sarah Johnson</div>
                <div style="color: #6b7280; font-family: monospace;">promo1</div>
                <div style="color: #059669; font-size: 10px; margin-top: 4px;">PG: 100 (Groceries), 200 (Fresh)</div>
              </div>
              <div style="background: #f9fafb; padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb; transition: all 0.15s;" 
                   onclick="document.getElementById('username').value='promo2'; document.getElementById('password').value='promo123';">
                <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">📊 Promo Coordinator</div>
                <div style="color: #374151; font-weight: 500;">Lars Nielsen</div>
                <div style="color: #6b7280; font-family: monospace;">promo2</div>
                <div style="color: #059669; font-size: 10px; margin-top: 4px;">PG: 300 (Electronics), 400 (Home&Garden)</div>
              </div>
              <div style="background: #f9fafb; padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb; transition: all 0.15s;" 
                   onclick="document.getElementById('username').value='photo1'; document.getElementById('password').value='photo123';">
                <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">📷 Photographer</div>
                <div style="color: #374151; font-weight: 500;">Mike Rodriguez</div>
                <div style="color: #6b7280; font-family: monospace;">photo1</div>
                <div style="color: #7c3aed; font-size: 10px; margin-top: 4px;">Studio & Location Photography</div>
              </div>
              <div style="background: #f9fafb; padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb; transition: all 0.15s;" 
                   onclick="document.getElementById('username').value='photobox1'; document.getElementById('password').value='photobox123';">
                <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">📦 Photo Box</div>
                <div style="color: #374151; font-weight: 500;">Alex Turner</div>
                <div style="color: #6b7280; font-family: monospace;">photobox1</div>
                <div style="color: #059669; font-size: 10px; margin-top: 4px;">Product Photography Specialist</div>
              </div>
              <div style="background: #f9fafb; padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb; transition: all 0.15s;" 
                   onclick="document.getElementById('username').value='marketing1'; document.getElementById('password').value='marketing123';">
                <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">🎯 Marketing Manager</div>
                <div style="color: #374151; font-weight: 500;">Manager Access</div>
                <div style="color: #6b7280; font-family: monospace;">marketing1</div>
                <div style="color: #2563eb; font-size: 10px; margin-top: 4px;">All Purchase Groups</div>
              </div>
              <div style="background: #f9fafb; padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid #e5e7eb; transition: all 0.15s;" 
                   onclick="document.getElementById('username').value='admin1'; document.getElementById('password').value='admin123';">
                <div style="font-weight: 600; color: #374151; margin-bottom: 4px;">Admin</div>
                <div style="color: #6b7280; font-family: monospace;">admin1</div>
                <div style="color: #9ca3af; font-family: monospace;">••••••</div>
              </div>
            </div>
            <p style="margin: 16px 0 0 0; font-size: 11px; color: #9ca3af; text-align: center;">Each role has different permissions and access levels</p>
          </div>
        </div>
      </div>
    `;

    // Setup login form handler
    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const errorDiv = document.getElementById('loginError');

      if (authSystem.login(username, password)) {
        const user = authSystem.getCurrentUser();
        showToast(`Welcome back, ${user.name}! Logged in as ${user.role}`, 'success');
        render(); // Show main app
      } else {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Invalid username or password. Please try again.';
        setTimeout(() => {
          errorDiv.style.display = 'none';
        }, 5000);
      }
    });
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      z-index: 1001;
      max-width: 300px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // Enhanced sample data with comprehensive features
  // SAP PMR Purchase Group Mappings
  const purchaseGroups = {
    100: 'Groceries',
    200: 'Fresh Products', 
    300: 'Electronics',
    400: 'Home & Garden',
    500: 'Fashion',
    600: 'Health & Beauty',
    700: 'Sports & Leisure',
    800: 'Automotive',
    900: 'Baby & Kids'
  };

  // SAP PMR Photo Status Options
  const photoStatuses = {
    'Archive': 'Archive - Existing Image',
    'New Shoot - Photographer': 'New Shoot - Photographer',
    'New Shoot - Photo Box': 'New Shoot - Photo Box'
  };

  // Function to import SAP PMR JSON data
  window.importSAPData = function(jsonData) {
    try {
      const sapData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      // Convert SAP data to our order format
      const newOrders = sapData.map(item => ({
        orderNumber: item.imageRequestId || `IMG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: `${item.articleName || 'Product Photography'}`,
        status: item.photoStatus === 'Archive' ? 'Completed' : 'New Request',
        method: item.photoStatus === 'New Shoot - Photo Box' ? 'Photo Box' : 'Photographer',
        photographer: 'Unassigned',
        deadline: getEventDeadline(item.eventId),
        costCenter: `PG-${item.purchaseGroup}`,
        priority: 'Medium',
        brief: `Photography for ${item.articleName} (Article: ${item.articleNumber}) as part of Event ${item.eventId}`,
        articles: [item.articleName],
        budget: 1500,
        deliverables: ['Product Photography'],
        
        // SAP PMR specific fields
        eventId: item.eventId,
        purchaseGroup: item.purchaseGroup,
        offerId: item.offerId,
        articleNumber: item.articleNumber,
        articleName: item.articleName,
        imageRequestId: item.imageRequestId,
        photoStatus: item.photoStatus,
        cloudinaryUrl: item.cloudinaryUrl || null,
        
        // Standard fields
        createdAt: new Date().toISOString(),
        createdBy: 'sap-import',
        assignedTo: null,
        samples: [],
        comments: [],
        uploadedContent: []
      }));
      
      // Add new orders to existing orders
      allOrders.push(...newOrders);
      
      // Refresh the current view
      if (window.currentView) {
        window.currentView();
      }
      
      return { success: true, imported: newOrders.length };
    } catch (error) {
      console.error('SAP Import Error:', error);
      return { success: false, error: error.message };
    }
  };

  // Helper function to calculate deadline based on event ID
  function getEventDeadline(eventId) {
    if (!eventId) return '2025-09-30';
    
    // Parse event ID format: A4025052 (A=Activity, 40=Week, 25=Year, 052=Format)
    const weekMatch = eventId.match(/\d(\d{2})\d{2}/);
    if (weekMatch) {
      const week = parseInt(weekMatch[1]);
      const year = 2025; // Assuming current year
      
      // Calculate date from week number (approximate)
      const startOfYear = new Date(year, 0, 1);
      const daysToAdd = (week - 1) * 7;
      const eventDate = new Date(startOfYear.setDate(startOfYear.getDate() + daysToAdd));
      
      // Set deadline 3 days before event
      eventDate.setDate(eventDate.getDate() - 3);
      return eventDate.toISOString().split('T')[0];
    }
    
    return '2025-09-30';
  }

  const allOrders = [
    {
      orderNumber:'ORD-2025-001', 
      title:'Premium Dog Food - Hero Shot', 
      status:'In Progress', 
      method:'Photographer',
      photographer:'Mike Rodriguez', 
      deadline:'2025-09-06', 
      costCenter:'PG-100',
      priority:'Critical',
      brief:'Create high-impact product photography for premium dog food line. Focus on hero shots, lifestyle images, and detail macro shots.',
      articles: ['Premium Dog Food 2kg [EAN: 5901234567890]'],
      budget: 5500,
      deliverables: ['Hero Product Shots', 'Lifestyle Photography', 'Detail Macro Shots'],
      
      // SAP PMR fields
      eventId: 'A4025052', // Week 40, 2025, Bilka format
      purchaseGroup: 100, // Groceries
      offerId: '10763319',
      articleNumber: 'ART-DOG-001',
      articleName: 'Premium Dog Food 2kg',
      imageRequestId: '123456',
      photoStatus: 'New Shoot - Photographer',
      cloudinaryUrl: null,
      
      // Creator and assignment fields
      createdBy: 'user-promo1', // Sarah Johnson (Groceries)
      createdAt: '2025-08-20T09:00:00Z',
      assignedTo: 'user-photo1', // Mike Rodriguez
      
      comments: [
        {
          id: 'c1',
          orderId: 'ORD-2025-001',
          userId: 'user1',
          userName: 'Sarah Miller',
          userRole: 'Promo Coordinator',
          message: 'Please ensure the lighting highlights the premium quality of the packaging. We want to emphasize the gold foil elements.',
          createdAt: '2025-08-25T09:30:00Z',
          isRead: false,
          readBy: ['user1']
        },
        {
          id: 'c2', 
          orderId: 'ORD-2025-001',
          userId: 'photographer1',
          userName: 'John Smith',
          userRole: 'Photographer',
          message: 'Understood! I\'ll use warm, directional lighting to bring out the metallic elements. Should we also include some lifestyle shots with dogs?',
          createdAt: '2025-08-25T14:15:00Z',
          isRead: false,
          readBy: ['photographer1']
        }
      ],
      uploadedContent: [
        {
          id: 'file_sample_001',
          name: 'Hero_Shot_Draft_v1.jpg',
          type: 'image/jpeg',
          size: 2456789,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhlcm8gU2hvdCBEcmFmdDwvdGV4dD48L3N2Zz4=',
          uploadedBy: 'John Smith',
          uploadedAt: '2025-08-25T16:45:00Z',
          uploadedByRole: 'Photographer'
        },
        {
          id: 'file_sample_002',
          name: 'Product_Details_Macro.jpg',
          type: 'image/jpeg',
          size: 3245678,
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1hY3JvIERldGFpbCBTaG90PC90ZXh0Pjwvc3ZnPg==',
          uploadedBy: 'John Smith',
          uploadedAt: '2025-08-26T08:30:00Z',
          uploadedByRole: 'Photographer'
        }
      ]
    },
    {
      orderNumber:'ORD-2025-002', 
      title:'Espresso Beans - E-commerce Photography', 
      status:'Samples Requested', 
      method:'Photo Box',
      photographer:'Emily Chen', 
      deadline:'2025-09-05', 
      costCenter:'PG-200',
      priority:'Medium',
      brief:'Automated photo box session for coffee product line. Consistent e-commerce shots with white background.',
      articles: ['Espresso Beans 500g [EAN: 2001234567892]'],
      budget: 2200,
      deliverables: ['E-commerce Product Photos', '360° Product Views'],
      
      // SAP PMR fields
      eventId: 'A4125053', // Week 41, 2025, Netto format
      purchaseGroup: 200, // Fresh Products
      offerId: '10763320',
      articleNumber: 'ART-COF-002',
      articleName: 'Espresso Beans 500g',
      imageRequestId: '123457',
      photoStatus: 'New Shoot - Photo Box',
      cloudinaryUrl: null,
      
      // Creator and assignment fields
      createdBy: 'user-promo1', // Sarah Johnson (Fresh Products)
      createdAt: '2025-08-21T10:30:00Z',
      assignedTo: 'user-photo2', // Emily Chen
      
      comments: [
        {
          id: 'c3',
          orderId: 'ORD-2025-002',
          userId: 'user2',
          userName: 'Mike Johnson',
          userRole: 'Marketing Manager',
          message: 'The samples are delayed by 2 days. Can we adjust the deadline accordingly?',
          createdAt: '2025-08-26T11:20:00Z',
          isRead: false,
          readBy: ['user2']
        }
      ]
    },
    {
      orderNumber:'ORD-2025-003', 
      title:'Wireless Speaker - Tech Photography', 
      status:'Draft', 
      method:'Photographer',
      photographer:'Mike Rodriguez', 
      deadline:'2025-09-15', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Professional studio photography for new tech product launch. High-end product photography and lifestyle shots for electronics catalog.',
      articles: ['Wireless Bluetooth Speaker [EAN: 4061234567890]', 'USB-C Cable [EAN: 8901234567891]'],
      budget: 8000,
      deliverables: ['Product Photography', 'Lifestyle Shots', 'Technical Details'],
      
      // SAP PMR fields
      eventId: 'A3825054', // Week 38, 2025, Føtex format
      purchaseGroup: 300, // Electronics
      offerId: '10763321',
      articleNumber: 'ART-ELEC-003',
      articleName: 'Wireless Bluetooth Speaker Premium',
      imageRequestId: '123458',
      photoStatus: 'New Shoot - Photographer',
      cloudinaryUrl: null,
      
      // Creator and assignment fields
      createdBy: 'user-promo2', // Lars Nielsen (Electronics)
      createdAt: '2025-08-22T14:15:00Z',
      assignedTo: 'user-photo1', // Mike Rodriguez
      
      comments: []
    },
    {
      orderNumber:'ORD-2025-004', 
      title:'Garden Tools - Product Showcase', 
      status:'Approved', 
      method:'Photographer',
      photographer:'Emily Chen', 
      deadline:'2025-09-07', 
      costCenter:'PG-400',
      priority:'Critical',
      brief:'Dynamic product shots of garden tools. Focus on durability, functionality, and outdoor lifestyle for spring catalog.',
      articles: ['Electric Hedge Trimmer', 'Garden Gloves Set'],
      budget: 6500,
      deliverables: ['Product Shots', 'Lifestyle Photography', 'Detail Shots'],
      
      // SAP PMR fields
      eventId: 'A3725055', // Week 37, 2025, Bilka format
      purchaseGroup: 400, // Home & Garden
      offerId: '10763322',
      articleNumber: 'ART-GARD-004',
      articleName: 'Electric Hedge Trimmer Pro',
      imageRequestId: '123459',
      photoStatus: 'New Shoot - Photographer',
      cloudinaryUrl: null,
      
      // Creator and assignment fields
      createdBy: 'user-promo2', // Lars Nielsen (Home & Garden)
      createdAt: '2025-08-23T11:20:00Z',
      assignedTo: 'user-photo2', // Emily Chen
      
      comments: []
    },
    // Additional orders to populate all Kanban status columns
    {
      orderNumber:'ORD-2025-005', 
      title:'Organic Pasta - Product Photography', 
      status:'Pending Approval', 
      method:'Photo Box',
      photographer:'Emily Chen', 
      deadline:'2025-09-04', 
      costCenter:'PG-100',
      priority:'Critical',
      brief:'Organic pasta product line photography for new health-focused marketing campaign. Clean, fresh styling.',
      articles: ['Organic Penne Pasta 500g', 'Organic Linguine 400g'],
      budget: 3200,
      deliverables: ['Product Shots', 'Lifestyle Photography'],
      
      // SAP PMR fields
      eventId: 'A3925056', // Week 39, 2025, Netto format
      purchaseGroup: 100, // Groceries
      offerId: '10763323',
      articleNumber: 'ART-PAST-005',
      articleName: 'Organic Penne Pasta Premium',
      imageRequestId: '123460',
      photoStatus: 'New Shoot - Photo Box',
      cloudinaryUrl: null,
      
      // Creator and assignment fields
      createdBy: 'user-promo1', // Sarah Johnson (Groceries)
      createdAt: '2025-08-24T08:45:00Z',
      assignedTo: 'user-photo2', // Emily Chen
      
      comments: []
    },
    {
      orderNumber:'ORD-2025-006', 
      title:'Fresh Dairy - E-commerce Photos', 
      status:'Review', 
      method:'Photo Box',
      photographer:'Mike Rodriguez', 
      deadline:'2025-08-28', 
      costCenter:'PG-200',
      priority:'Medium',
      brief:'Fresh dairy products for e-commerce catalog. Clean, appetizing shots with consistent lighting.',
      articles: ['Organic Milk 1L', 'Greek Yogurt 500g'],
      budget: 2800,
      deliverables: ['E-commerce Photos', 'Detail Shots'],
      
      // SAP PMR fields
      eventId: 'A3525057', // Week 35, 2025, Føtex format
      purchaseGroup: 200, // Fresh Products
      offerId: '10763324',
      articleNumber: 'ART-DAIRY-006',
      articleName: 'Organic Milk Premium 1L',
      imageRequestId: '123461',
      photoStatus: 'Archive',
      cloudinaryUrl: 'https://res.cloudinary.com/demo/image/upload/organic_milk.jpg',
      
      // Creator and assignment fields
      createdBy: 'user-promo1', // Sarah Johnson (Fresh Products)
      createdAt: '2025-08-25T09:30:00Z',
      assignedTo: 'user-photo1', // Mike Rodriguez
      
      comments: []
    },
    {
      orderNumber:'ORD-2025-007', 
      title:'Smart Home Devices - Tech Showcase', 
      status:'Complete', 
      method:'Photographer',
      photographer:'Mike Rodriguez', 
      deadline:'2025-09-02', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Smart home devices photography for holiday campaign preview. Modern, tech-focused styling.',
      articles: ['Smart Thermostat', 'Security Camera Set'],
      budget: 5200,
      deliverables: ['Product Shots', 'Lifestyle Integration'],
      
      // SAP PMR fields
      eventId: 'A4825058', // Week 48, 2025, Bilka format
      purchaseGroup: 300, // Electronics
      offerId: '10763325',
      articleNumber: 'ART-SMART-007',
      articleName: 'Smart Thermostat Pro',
      imageRequestId: '123462',
      photoStatus: 'Archive',
      cloudinaryUrl: 'https://res.cloudinary.com/demo/image/upload/smart_thermostat.jpg',
      
      // Creator and assignment fields
      createdBy: 'user-promo2', // Lars Nielsen (Electronics)
      createdAt: '2025-08-20T13:15:00Z',
      assignedTo: 'user-photo1', // Mike Rodriguez
      
      comments: []
    },
    {
      orderNumber:'ORD-2025-008', 
      title:'Patio Furniture - Seasonal Showcase', 
      status:'Delivered', 
      method:'Photographer',
      photographer:'Emily Chen', 
      deadline:'2025-08-20', 
      costCenter:'PG-400',
      priority:'Medium',
      brief:'Outdoor patio furniture for summer/fall transition catalog. Lifestyle shots with outdoor setting.',
      articles: ['Outdoor Dining Set', 'Cushion Covers'],
      budget: 7200,
      deliverables: ['Lifestyle Photos', 'Product Details'],
      
      // SAP PMR fields
      eventId: 'A3425059', // Week 34, 2025, Netto format
      purchaseGroup: 400, // Home & Garden
      offerId: '10763326',
      articleNumber: 'ART-PATIO-008',
      articleName: 'Outdoor Dining Set Premium',
      imageRequestId: '123463',
      photoStatus: 'Archive',
      cloudinaryUrl: 'https://res.cloudinary.com/demo/image/upload/patio_furniture.jpg',
      
      // Creator and assignment fields
      createdBy: 'user-promo2', // Lars Nielsen (Home & Garden)
      createdAt: '2025-08-19T16:30:00Z',
      assignedTo: 'user-photo2', // Emily Chen
      
      comments: []
    },
    
    // Additional 50 diverse orders showcasing all application features
    {
      orderNumber:'ORD-2025-009', 
      title:'Organic Baby Food - Product Launch', 
      status:'Draft', 
      method:'Photographer',
      photographer:'Sarah Johnson', 
      deadline:'2025-09-10', 
      costCenter:'PG-100',
      priority:'High',
      brief:'New organic baby food line launch. Need hero shots, ingredient close-ups, and lifestyle photography with babies.',
      articles: ['Organic Baby Food Puree [EAN: 5901234567901]', 'Baby Food Spoon Set [EAN: 5901234567902]'],
      budget: 8500,
      deliverables: ['Hero Product Shots', 'Ingredient Photography', 'Lifestyle with Babies'],
      eventId: 'A4125060', 
      purchaseGroup: 100,
      offerId: '10763327',
      articleNumber: 'ART-BABY-009',
      articleName: 'Organic Baby Food Variety Pack',
      imageRequestId: '123470',
      photoStatus: 'New',
      createdBy: 'user-promo1',
      createdAt: '2025-09-01T08:30:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-010', 
      title:'Gaming Laptop - Tech Showcase', 
      status:'Samples Requested', 
      method:'Photo Box',
      photographer:'Marcus Thompson', 
      deadline:'2025-09-08', 
      costCenter:'PG-300',
      priority:'Critical',
      brief:'High-end gaming laptop with RGB lighting. Need dramatic tech shots with special lighting effects.',
      articles: ['Gaming Laptop Pro X1 [EAN: 5901234567903]', 'Gaming Mouse [EAN: 5901234567904]'],
      budget: 12000,
      deliverables: ['Tech Hero Shots', 'RGB Lighting Effects', 'Detail Macro Shots'],
      eventId: 'A4225061', 
      purchaseGroup: 300,
      offerId: '10763328',
      articleNumber: 'ART-LAPTOP-010',
      articleName: 'Gaming Laptop Pro X1',
      imageRequestId: '123471',
      photoStatus: 'Samples Requested',
      createdBy: 'user-promo2',
      createdAt: '2025-09-02T10:15:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-011', 
      title:'Winter Jacket Collection', 
      status:'Pending Approval', 
      method:'Photographer',
      photographer:'Emily Chen', 
      deadline:'2025-09-12', 
      costCenter:'PG-200',
      priority:'Medium',
      brief:'Winter fashion collection for upcoming season. Need model shots and flat lay product photography.',
      articles: ['Winter Puffer Jacket [EAN: 5901234567905]', 'Wool Scarf [EAN: 5901234567906]', 'Winter Boots [EAN: 5901234567907]'],
      budget: 15000,
      deliverables: ['Model Photography', 'Flat Lay Styling', 'Detail Shots'],
      eventId: 'A4325062', 
      purchaseGroup: 200,
      offerId: '10763329',
      articleNumber: 'ART-JACKET-011',
      articleName: 'Winter Jacket Collection',
      imageRequestId: '123472',
      photoStatus: 'Pending',
      createdBy: 'user-promo1',
      createdAt: '2025-09-02T14:20:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-012', 
      title:'Kitchen Appliances - Modern Design', 
      status:'Approved', 
      method:'Photo Box',
      photographer:'David Kim', 
      deadline:'2025-09-15', 
      costCenter:'PG-400',
      priority:'Low',
      brief:'Modern kitchen appliance series. Clean, minimalist photography with lifestyle context.',
      articles: ['Stand Mixer Pro [EAN: 5901234567908]', 'Coffee Machine Deluxe [EAN: 5901234567909]'],
      budget: 9500,
      deliverables: ['Product Photography', 'Lifestyle Kitchen Scenes', 'Technical Detail Shots'],
      eventId: 'A4425063', 
      purchaseGroup: 400,
      offerId: '10763330',
      articleNumber: 'ART-KITCHEN-012',
      articleName: 'Kitchen Appliance Set',
      imageRequestId: '123473',
      photoStatus: 'Approved',
      createdBy: 'user-promo2',
      createdAt: '2025-09-02T16:45:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-013', 
      title:'Organic Skincare Line', 
      status:'Photo Session', 
      method:'Photographer',
      photographer:'Lisa Wang', 
      deadline:'2025-09-07', 
      costCenter:'PG-100',
      priority:'High',
      brief:'Luxury organic skincare products. Need elegant beauty photography with natural lighting.',
      articles: ['Organic Face Serum [EAN: 5901234567910]', 'Natural Moisturizer [EAN: 5901234567911]'],
      budget: 11000,
      deliverables: ['Beauty Product Shots', 'Ingredient Close-ups', 'Lifestyle Beauty'],
      eventId: 'A4525064', 
      purchaseGroup: 100,
      offerId: '10763331',
      articleNumber: 'ART-SKINCARE-013',
      articleName: 'Organic Skincare Collection',
      imageRequestId: '123474',
      photoStatus: 'In Progress',
      createdBy: 'user-promo1',
      createdAt: '2025-09-03T09:00:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-014', 
      title:'Smart Home Security System', 
      status:'Samples in Transit', 
      method:'Photo Box',
      photographer:'Alex Johnson', 
      deadline:'2025-09-20', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Smart home security cameras and sensors. Need tech shots showing installation and features.',
      articles: ['Security Camera 4K [EAN: 5901234567912]', 'Motion Sensor [EAN: 5901234567913]'],
      budget: 7500,
      deliverables: ['Tech Product Shots', 'Installation Demo', 'App Interface'],
      eventId: 'A4625065', 
      purchaseGroup: 300,
      offerId: '10763332',
      articleNumber: 'ART-SECURITY-014',
      articleName: 'Smart Security System',
      imageRequestId: '123475',
      photoStatus: 'Samples in Transit',
      createdBy: 'user-promo2',
      createdAt: '2025-09-03T11:30:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-015', 
      title:'Artisan Bread Collection', 
      status:'Complete', 
      method:'Photographer',
      photographer:'Maria Garcia', 
      deadline:'2025-08-30', 
      costCenter:'PG-100',
      priority:'Low',
      brief:'Artisan bakery products for autumn catalog. Warm, rustic food photography.',
      articles: ['Sourdough Loaf [EAN: 5901234567914]', 'Whole Grain Bread [EAN: 5901234567915]'],
      budget: 6000,
      deliverables: ['Food Photography', 'Lifestyle Bakery Scenes', 'Ingredient Shots'],
      eventId: 'A4725066', 
      purchaseGroup: 100,
      offerId: '10763333',
      articleNumber: 'ART-BREAD-015',
      articleName: 'Artisan Bread Selection',
      imageRequestId: '123476',
      photoStatus: 'Archive',
      createdBy: 'user-promo1',
      createdAt: '2025-08-25T13:45:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-016', 
      title:'Fitness Equipment - Home Gym', 
      status:'Review', 
      method:'Photographer',
      photographer:'James Wilson', 
      deadline:'2025-09-18', 
      costCenter:'PG-400',
      priority:'High',
      brief:'Home fitness equipment showcase. Action shots with models using equipment.',
      articles: ['Adjustable Dumbbells [EAN: 5901234567916]', 'Yoga Mat Pro [EAN: 5901234567917]'],
      budget: 13500,
      deliverables: ['Action Photography', 'Product Detail Shots', 'Home Gym Lifestyle'],
      eventId: 'A4825067', 
      purchaseGroup: 400,
      offerId: '10763334',
      articleNumber: 'ART-FITNESS-016',
      articleName: 'Home Fitness Set',
      imageRequestId: '123477',
      photoStatus: 'Review',
      createdBy: 'user-promo2',
      createdAt: '2025-09-03T15:20:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-017', 
      title:'Smartphone Accessories Bundle', 
      status:'New Request', 
      method:'Photo Box',
      photographer:'Not Assigned', 
      deadline:'2025-09-25', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Smartphone case, charger, and screen protector bundle. Clean tech photography.',
      articles: ['Phone Case Clear [EAN: 5901234567918]', 'Wireless Charger [EAN: 5901234567919]'],
      budget: 4500,
      deliverables: ['Tech Product Shots', 'Compatibility Demo', 'Lifestyle Tech'],
      eventId: 'A4925068', 
      purchaseGroup: 300,
      offerId: '10763335',
      articleNumber: 'ART-PHONE-017',
      articleName: 'Smartphone Accessory Bundle',
      imageRequestId: '123478',
      photoStatus: 'New',
      createdBy: 'user-promo1',
      createdAt: '2025-09-04T08:00:00Z',
      assignedTo: null,
      comments: []
    },
    {
      orderNumber:'ORD-2025-018', 
      title:'Luxury Watch Collection', 
      status:'Samples Received', 
      method:'Photographer',
      photographer:'Catherine Lee', 
      deadline:'2025-09-14', 
      costCenter:'PG-200',
      priority:'Critical',
      brief:'High-end luxury watches. Dramatic lighting with reflections and detail macro shots.',
      articles: ['Luxury Watch Gold [EAN: 5901234567920]', 'Watch Box Premium [EAN: 5901234567921]'],
      budget: 18000,
      deliverables: ['Luxury Product Photography', 'Macro Detail Shots', 'Lifestyle Luxury'],
      eventId: 'A5025069', 
      purchaseGroup: 200,
      offerId: '10763336',
      articleNumber: 'ART-WATCH-018',
      articleName: 'Luxury Watch Collection',
      imageRequestId: '123479',
      photoStatus: 'Samples Received',
      createdBy: 'user-promo2',
      createdAt: '2025-09-04T10:30:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-019', 
      title:'Garden Tool Set - Spring Collection', 
      status:'Processing', 
      method:'Photo Box',
      photographer:'Robert Chen', 
      deadline:'2025-09-11', 
      costCenter:'PG-400',
      priority:'Medium',
      brief:'Garden tools and equipment for spring gardening season. Outdoor lifestyle shots.',
      articles: ['Garden Spade [EAN: 5901234567922]', 'Pruning Shears [EAN: 5901234567923]'],
      budget: 7800,
      deliverables: ['Product Photography', 'Garden Lifestyle', 'Tool Detail Shots'],
      eventId: 'A5125070', 
      purchaseGroup: 400,
      offerId: '10763337',
      articleNumber: 'ART-GARDEN-019',
      articleName: 'Garden Tool Collection',
      imageRequestId: '123480',
      photoStatus: 'Processing',
      createdBy: 'user-promo1',
      createdAt: '2025-09-04T12:15:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-020', 
      title:'Gourmet Coffee Beans', 
      status:'Delivered', 
      method:'Photographer',
      photographer:'Ana Rodriguez', 
      deadline:'2025-08-28', 
      costCenter:'PG-100',
      priority:'Low',
      brief:'Premium coffee beans from different regions. Warm, appetizing food photography.',
      articles: ['Ethiopian Coffee Beans [EAN: 5901234567924]', 'Colombian Roast [EAN: 5901234567925]'],
      budget: 5500,
      deliverables: ['Food Photography', 'Lifestyle Coffee Scenes', 'Bean Close-ups'],
      eventId: 'A5225071', 
      purchaseGroup: 100,
      offerId: '10763338',
      articleNumber: 'ART-COFFEE-020',
      articleName: 'Gourmet Coffee Selection',
      imageRequestId: '123481',
      photoStatus: 'Archive',
      createdBy: 'user-promo2',
      createdAt: '2025-08-23T14:40:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-021', 
      title:'Children Toys - Educational Series', 
      status:'Draft', 
      method:'Photographer',
      photographer:'Sophie Turner', 
      deadline:'2025-09-22', 
      costCenter:'PG-200',
      priority:'High',
      brief:'Educational toys for children 3-8 years. Bright, playful photography with kids in action.',
      articles: ['Building Blocks Set [EAN: 5901234567926]', 'Learning Tablet Kids [EAN: 5901234567927]'],
      budget: 10500,
      deliverables: ['Toy Photography', 'Kids Playing Lifestyle', 'Educational Demo'],
      eventId: 'A5325072', 
      purchaseGroup: 200,
      offerId: '10763339',
      articleNumber: 'ART-TOYS-021',
      articleName: 'Educational Toy Set',
      imageRequestId: '123482',
      photoStatus: 'New',
      createdBy: 'user-promo1',
      createdAt: '2025-09-04T16:00:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-022', 
      title:'Wireless Headphones Premium', 
      status:'Urgent', 
      method:'Photo Box',
      photographer:'Michael Park', 
      deadline:'2025-09-05', 
      costCenter:'PG-300',
      priority:'Critical',
      brief:'High-end wireless headphones launch. Need dramatic tech shots with sound wave effects.',
      articles: ['Wireless Headphones Pro [EAN: 5901234567928]', 'Charging Case [EAN: 5901234567929]'],
      budget: 14000,
      deliverables: ['Tech Hero Shots', 'Feature Highlights', 'Lifestyle Music'],
      eventId: 'A5425073', 
      purchaseGroup: 300,
      offerId: '10763340',
      articleNumber: 'ART-HEADPHONES-022',
      articleName: 'Wireless Headphones Premium',
      imageRequestId: '123483',
      photoStatus: 'Urgent',
      createdBy: 'user-promo2',
      createdAt: '2025-09-04T18:30:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-023', 
      title:'Outdoor Camping Gear', 
      status:'Pending Approval', 
      method:'Photographer',
      photographer:'Tom Anderson', 
      deadline:'2025-09-28', 
      costCenter:'PG-400',
      priority:'Medium',
      brief:'Camping equipment for autumn outdoor adventures. Rugged outdoor lifestyle photography.',
      articles: ['Camping Tent 4-Person [EAN: 5901234567930]', 'Sleeping Bag Winter [EAN: 5901234567931]'],
      budget: 12500,
      deliverables: ['Outdoor Photography', 'Camping Lifestyle', 'Product Features'],
      eventId: 'A5525074', 
      purchaseGroup: 400,
      offerId: '10763341',
      articleNumber: 'ART-CAMPING-023',
      articleName: 'Camping Gear Set',
      imageRequestId: '123484',
      photoStatus: 'Pending',
      createdBy: 'user-promo1',
      createdAt: '2025-09-05T08:45:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-024', 
      title:'Artisan Chocolate Collection', 
      status:'Approved', 
      method:'Photographer',
      photographer:'Isabella Martinez', 
      deadline:'2025-09-16', 
      costCenter:'PG-100',
      priority:'High',
      brief:'Luxury artisan chocolates for holiday season. Elegant food photography with mood lighting.',
      articles: ['Dark Chocolate Truffles [EAN: 5901234567932]', 'Chocolate Gift Box [EAN: 5901234567933]'],
      budget: 8800,
      deliverables: ['Luxury Food Photography', 'Lifestyle Gifting', 'Chocolate Close-ups'],
      eventId: 'A5625075', 
      purchaseGroup: 100,
      offerId: '10763342',
      articleNumber: 'ART-CHOCOLATE-024',
      articleName: 'Artisan Chocolate Collection',
      imageRequestId: '123485',
      photoStatus: 'Approved',
      createdBy: 'user-promo2',
      createdAt: '2025-09-05T10:20:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-025', 
      title:'Smart TV 75 inch Ultra HD', 
      status:'Photo Session', 
      method:'Photo Box',
      photographer:'Kevin Wright', 
      deadline:'2025-09-13', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Large format smart TV with ultra-thin design. Modern living room lifestyle photography.',
      articles: ['Smart TV 75 inch [EAN: 5901234567934]', 'TV Mount Wall [EAN: 5901234567935]'],
      budget: 16000,
      deliverables: ['Tech Product Shots', 'Living Room Lifestyle', 'Screen Quality Demo'],
      eventId: 'A5725076', 
      purchaseGroup: 300,
      offerId: '10763343',
      articleNumber: 'ART-TV-025',
      articleName: 'Smart TV Ultra HD',
      imageRequestId: '123486',
      photoStatus: 'In Progress',
      createdBy: 'user-promo1',
      createdAt: '2025-09-05T12:00:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-026', 
      title:'Luxury Bedding Set', 
      status:'Samples Requested', 
      method:'Photographer',
      photographer:'Rachel Green', 
      deadline:'2025-09-19', 
      costCenter:'PG-200',
      priority:'Low',
      brief:'Premium bedding collection in natural fabrics. Cozy bedroom lifestyle photography.',
      articles: ['Silk Bedsheet Set [EAN: 5901234567936]', 'Down Pillows [EAN: 5901234567937]'],
      budget: 9200,
      deliverables: ['Lifestyle Bedroom', 'Fabric Close-ups', 'Comfort Demonstration'],
      eventId: 'A5825077', 
      purchaseGroup: 200,
      offerId: '10763344',
      articleNumber: 'ART-BEDDING-026',
      articleName: 'Luxury Bedding Collection',
      imageRequestId: '123487',
      photoStatus: 'Samples Requested',
      createdBy: 'user-promo2',
      createdAt: '2025-09-05T14:30:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-027', 
      title:'Electric Bike Urban Series', 
      status:'Complete', 
      method:'Photographer',
      photographer:'Daniel Foster', 
      deadline:'2025-08-25', 
      costCenter:'PG-400',
      priority:'High',
      brief:'Urban electric bikes for city commuting. Dynamic action shots in urban environment.',
      articles: ['E-Bike Urban Pro [EAN: 5901234567938]', 'Bike Helmet Smart [EAN: 5901234567939]'],
      budget: 17500,
      deliverables: ['Action Photography', 'Urban Lifestyle', 'Tech Feature Highlights'],
      eventId: 'A5925078', 
      purchaseGroup: 400,
      offerId: '10763345',
      articleNumber: 'ART-EBIKE-027',
      articleName: 'Electric Bike Urban',
      imageRequestId: '123488',
      photoStatus: 'Archive',
      createdBy: 'user-promo1',
      createdAt: '2025-08-20T16:15:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-028', 
      title:'Baby Monitor Smart Camera', 
      status:'Review', 
      method:'Photo Box',
      photographer:'Jennifer Liu', 
      deadline:'2025-09-17', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Smart baby monitoring system with app connectivity. Nursery lifestyle photography.',
      articles: ['Baby Monitor Camera [EAN: 5901234567940]', 'Monitor Base Station [EAN: 5901234567941]'],
      budget: 6700,
      deliverables: ['Tech Product Shots', 'Nursery Lifestyle', 'App Interface Demo'],
      eventId: 'A6025079', 
      purchaseGroup: 300,
      offerId: '10763346',
      articleNumber: 'ART-BABYMONITOR-028',
      articleName: 'Smart Baby Monitor',
      imageRequestId: '123489',
      photoStatus: 'Review',
      createdBy: 'user-promo2',
      createdAt: '2025-09-05T17:45:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-029', 
      title:'Gourmet Spice Collection', 
      status:'New Request', 
      method:'Photographer',
      photographer:'Not Assigned', 
      deadline:'2025-09-30', 
      costCenter:'PG-100',
      priority:'Low',
      brief:'International spice collection for cooking enthusiasts. Colorful food photography.',
      articles: ['Spice Set International [EAN: 5901234567942]', 'Spice Grinder [EAN: 5901234567943]'],
      budget: 4200,
      deliverables: ['Food Photography', 'Spice Close-ups', 'Cooking Lifestyle'],
      eventId: 'A6125080', 
      purchaseGroup: 100,
      offerId: '10763347',
      articleNumber: 'ART-SPICES-029',
      articleName: 'Gourmet Spice Collection',
      imageRequestId: '123490',
      photoStatus: 'New',
      createdBy: 'user-promo1',
      createdAt: '2025-09-06T09:00:00Z',
      assignedTo: null,
      comments: []
    },
    {
      orderNumber:'ORD-2025-030', 
      title:'Gaming Chair Pro Series', 
      status:'Samples in Transit', 
      method:'Photographer',
      photographer:'Chris Taylor', 
      deadline:'2025-09-21', 
      costCenter:'PG-200',
      priority:'High',
      brief:'Professional gaming chair with RGB lighting. Gaming setup lifestyle photography.',
      articles: ['Gaming Chair RGB [EAN: 5901234567944]', 'Chair Cushion Set [EAN: 5901234567945]'],
      budget: 11500,
      deliverables: ['Product Photography', 'Gaming Setup Lifestyle', 'Comfort Features'],
      eventId: 'A6225081', 
      purchaseGroup: 200,
      offerId: '10763348',
      articleNumber: 'ART-GAMECHAIR-030',
      articleName: 'Gaming Chair Pro',
      imageRequestId: '123491',
      photoStatus: 'Samples in Transit',
      createdBy: 'user-promo2',
      createdAt: '2025-09-06T11:30:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-031', 
      title:'Solar Panel Home Kit', 
      status:'Delivered', 
      method:'Photo Box',
      photographer:'Mark Davis', 
      deadline:'2025-08-22', 
      costCenter:'PG-400',
      priority:'Medium',
      brief:'Home solar panel installation kit. Clean energy lifestyle and technical photography.',
      articles: ['Solar Panel 300W [EAN: 5901234567946]', 'Inverter System [EAN: 5901234567947]'],
      budget: 13800,
      deliverables: ['Tech Product Shots', 'Installation Demo', 'Eco Lifestyle'],
      eventId: 'A6325082', 
      purchaseGroup: 400,
      offerId: '10763349',
      articleNumber: 'ART-SOLAR-031',
      articleName: 'Solar Panel Home Kit',
      imageRequestId: '123492',
      photoStatus: 'Archive',
      createdBy: 'user-promo1',
      createdAt: '2025-08-17T13:20:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-032', 
      title:'Artisan Cheese Selection', 
      status:'Processing', 
      method:'Photographer',
      photographer:'Emma Thompson', 
      deadline:'2025-09-15', 
      costCenter:'PG-100',
      priority:'Critical',
      brief:'Premium artisan cheese collection for gourmet food catalog. Rustic food photography.',
      articles: ['Artisan Cheese Wheel [EAN: 5901234567948]', 'Cheese Board Set [EAN: 5901234567949]'],
      budget: 7200,
      deliverables: ['Gourmet Food Photography', 'Cheese Board Styling', 'Lifestyle Dining'],
      eventId: 'A6425083', 
      purchaseGroup: 100,
      offerId: '10763350',
      articleNumber: 'ART-CHEESE-032',
      articleName: 'Artisan Cheese Collection',
      imageRequestId: '123493',
      photoStatus: 'Processing',
      createdBy: 'user-promo2',
      createdAt: '2025-09-06T15:45:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-033', 
      title:'Wireless Speaker Waterproof', 
      status:'Urgent', 
      method:'Photo Box',
      photographer:'Ryan Miller', 
      deadline:'2025-09-04', 
      costCenter:'PG-300',
      priority:'Critical',
      brief:'Waterproof bluetooth speaker for outdoor use. Action shots with water and outdoor scenes.',
      articles: ['Bluetooth Speaker Waterproof [EAN: 5901234567950]', 'Speaker Stand [EAN: 5901234567951]'],
      budget: 8900,
      deliverables: ['Tech Product Shots', 'Waterproof Demo', 'Outdoor Lifestyle'],
      eventId: 'A6525084', 
      purchaseGroup: 300,
      offerId: '10763351',
      articleNumber: 'ART-SPEAKER-033',
      articleName: 'Wireless Speaker Outdoor',
      imageRequestId: '123494',
      photoStatus: 'Urgent',
      createdBy: 'user-promo1',
      createdAt: '2025-09-02T17:00:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-034', 
      title:'Designer Handbag Collection', 
      status:'Samples Received', 
      method:'Photographer',
      photographer:'Victoria Stone', 
      deadline:'2025-09-24', 
      costCenter:'PG-200',
      priority:'High',
      brief:'Luxury designer handbags for fall fashion collection. Elegant fashion photography.',
      articles: ['Leather Handbag Designer [EAN: 5901234567952]', 'Wallet Matching [EAN: 5901234567953]'],
      budget: 19500,
      deliverables: ['Fashion Photography', 'Lifestyle Luxury', 'Detail Craftsmanship'],
      eventId: 'A6625085', 
      purchaseGroup: 200,
      offerId: '10763352',
      articleNumber: 'ART-HANDBAG-034',
      articleName: 'Designer Handbag Collection',
      imageRequestId: '123495',
      photoStatus: 'Samples Received',
      createdBy: 'user-promo2',
      createdAt: '2025-09-07T08:30:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-035', 
      title:'Power Tools Professional Set', 
      status:'Draft', 
      method:'Photo Box',
      photographer:'Steve Johnson', 
      deadline:'2025-09-26', 
      costCenter:'PG-400',
      priority:'Medium',
      brief:'Professional power tools for construction and DIY. Workshop lifestyle photography.',
      articles: ['Cordless Drill Pro [EAN: 5901234567954]', 'Tool Set Complete [EAN: 5901234567955]'],
      budget: 10800,
      deliverables: ['Product Photography', 'Workshop Lifestyle', 'Tool Features Demo'],
      eventId: 'A6725086', 
      purchaseGroup: 400,
      offerId: '10763353',
      articleNumber: 'ART-POWERTOOLS-035',
      articleName: 'Power Tools Pro Set',
      imageRequestId: '123496',
      photoStatus: 'New',
      createdBy: 'user-promo1',
      createdAt: '2025-09-07T10:15:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-036', 
      title:'Organic Wine Collection', 
      status:'Pending Approval', 
      method:'Photographer',
      photographer:'Anthony Clark', 
      deadline:'2025-09-29', 
      costCenter:'PG-100',
      priority:'Low',
      brief:'Organic and biodynamic wine selection. Elegant wine photography with lifestyle context.',
      articles: ['Organic Red Wine [EAN: 5901234567956]', 'Wine Glass Set Crystal [EAN: 5901234567957]'],
      budget: 12000,
      deliverables: ['Wine Photography', 'Lifestyle Dining', 'Bottle Detail Shots'],
      eventId: 'A6825087', 
      purchaseGroup: 100,
      offerId: '10763354',
      articleNumber: 'ART-WINE-036',
      articleName: 'Organic Wine Selection',
      imageRequestId: '123497',
      photoStatus: 'Pending',
      createdBy: 'user-promo2',
      createdAt: '2025-09-07T12:45:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-037', 
      title:'Robot Vacuum Smart Home', 
      status:'Approved', 
      method:'Photo Box',
      photographer:'Nancy Wilson', 
      deadline:'2025-09-23', 
      costCenter:'PG-300',
      priority:'High',
      brief:'Smart robot vacuum with app control. Modern home lifestyle photography.',
      articles: ['Robot Vacuum Smart [EAN: 5901234567958]', 'Charging Dock [EAN: 5901234567959]'],
      budget: 9800,
      deliverables: ['Tech Product Shots', 'Home Cleaning Demo', 'App Interface'],
      eventId: 'A6925088', 
      purchaseGroup: 300,
      offerId: '10763355',
      articleNumber: 'ART-ROBOTVAC-037',
      articleName: 'Robot Vacuum Smart',
      imageRequestId: '123498',
      photoStatus: 'Approved',
      createdBy: 'user-promo1',
      createdAt: '2025-09-07T14:20:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-038', 
      title:'Luxury Perfume Launch', 
      status:'Photo Session', 
      method:'Photographer',
      photographer:'Sophia Martinez', 
      deadline:'2025-09-12', 
      costCenter:'PG-200',
      priority:'Critical',
      brief:'High-end luxury perfume collection launch. Elegant beauty photography with dramatic lighting.',
      articles: ['Luxury Perfume 100ml [EAN: 5901234567960]', 'Perfume Gift Set [EAN: 5901234567961]'],
      budget: 22000,
      deliverables: ['Luxury Beauty Photography', 'Lifestyle Elegance', 'Bottle Art Shots'],
      eventId: 'A7025089', 
      purchaseGroup: 200,
      offerId: '10763356',
      articleNumber: 'ART-PERFUME-038',
      articleName: 'Luxury Perfume Collection',
      imageRequestId: '123499',
      photoStatus: 'In Progress',
      createdBy: 'user-promo2',
      createdAt: '2025-09-07T16:00:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-039', 
      title:'BBQ Grill Professional', 
      status:'Samples Requested', 
      method:'Photographer',
      photographer:'Jason Lee', 
      deadline:'2025-09-27', 
      costCenter:'PG-400',
      priority:'Medium',
      brief:'Professional outdoor BBQ grill with accessories. Outdoor cooking lifestyle photography.',
      articles: ['BBQ Grill Pro 6-Burner [EAN: 5901234567962]', 'Grill Tool Set [EAN: 5901234567963]'],
      budget: 14500,
      deliverables: ['Product Photography', 'Outdoor Cooking Lifestyle', 'Food Results'],
      eventId: 'A7125090', 
      purchaseGroup: 400,
      offerId: '10763357',
      articleNumber: 'ART-BBQ-039',
      articleName: 'BBQ Grill Professional',
      imageRequestId: '123500',
      photoStatus: 'Samples Requested',
      createdBy: 'user-promo1',
      createdAt: '2025-09-08T08:00:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-040', 
      title:'Gourmet Tea Collection', 
      status:'Complete', 
      method:'Photographer',
      photographer:'Helen Chang', 
      deadline:'2025-08-31', 
      costCenter:'PG-100',
      priority:'Low',
      brief:'Premium tea collection from around the world. Zen-like food photography with tea ceremony elements.',
      articles: ['Green Tea Premium [EAN: 5901234567964]', 'Tea Set Ceramic [EAN: 5901234567965]'],
      budget: 6500,
      deliverables: ['Food Photography', 'Tea Ceremony Lifestyle', 'Leaf Close-ups'],
      eventId: 'A7225091', 
      purchaseGroup: 100,
      offerId: '10763358',
      articleNumber: 'ART-TEA-040',
      articleName: 'Gourmet Tea Collection',
      imageRequestId: '123501',
      photoStatus: 'Archive',
      createdBy: 'user-promo2',
      createdAt: '2025-08-26T10:30:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-041', 
      title:'Mechanical Keyboard Gaming', 
      status:'Review', 
      method:'Photo Box',
      photographer:'Brian Kim', 
      deadline:'2025-09-18', 
      costCenter:'PG-300',
      priority:'High',
      brief:'High-end mechanical gaming keyboard with RGB. Gaming setup and tech photography.',
      articles: ['Mechanical Keyboard RGB [EAN: 5901234567966]', 'Keycap Set Custom [EAN: 5901234567967]'],
      budget: 7800,
      deliverables: ['Tech Product Shots', 'Gaming Setup Lifestyle', 'RGB Light Effects'],
      eventId: 'A7325092', 
      purchaseGroup: 300,
      offerId: '10763359',
      articleNumber: 'ART-KEYBOARD-041',
      articleName: 'Mechanical Keyboard Gaming',
      imageRequestId: '123502',
      photoStatus: 'Review',
      createdBy: 'user-promo1',
      createdAt: '2025-09-08T12:15:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-042', 
      title:'Luxury Skincare Anti-Aging', 
      status:'New Request', 
      method:'Photographer',
      photographer:'Not Assigned', 
      deadline:'2025-10-01', 
      costCenter:'PG-200',
      priority:'Medium',
      brief:'Anti-aging skincare line for mature skin. Elegant beauty photography with before/after concepts.',
      articles: ['Anti-Aging Serum [EAN: 5901234567968]', 'Night Cream Luxury [EAN: 5901234567969]'],
      budget: 16500,
      deliverables: ['Beauty Product Photography', 'Lifestyle Mature Beauty', 'Ingredient Close-ups'],
      eventId: 'A7425093', 
      purchaseGroup: 200,
      offerId: '10763360',
      articleNumber: 'ART-ANTIAGING-042',
      articleName: 'Anti-Aging Skincare Line',
      imageRequestId: '123503',
      photoStatus: 'New',
      createdBy: 'user-promo2',
      createdAt: '2025-09-08T14:45:00Z',
      assignedTo: null,
      comments: []
    },
    {
      orderNumber:'ORD-2025-043', 
      title:'Smart Doorbell Security', 
      status:'Samples in Transit', 
      method:'Photo Box',
      photographer:'Peter Wilson', 
      deadline:'2025-09-20', 
      costCenter:'PG-300',
      priority:'High',
      brief:'Smart video doorbell with motion detection. Home security and tech photography.',
      articles: ['Smart Doorbell Camera [EAN: 5901234567970]', 'Chime Indoor Unit [EAN: 5901234567971]'],
      budget: 8200,
      deliverables: ['Tech Product Shots', 'Home Security Demo', 'App Interface'],
      eventId: 'A7525094', 
      purchaseGroup: 300,
      offerId: '10763361',
      articleNumber: 'ART-DOORBELL-043',
      articleName: 'Smart Video Doorbell',
      imageRequestId: '123504',
      photoStatus: 'Samples in Transit',
      createdBy: 'user-promo1',
      createdAt: '2025-09-08T16:30:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-044', 
      title:'Outdoor Furniture Patio Set', 
      status:'Delivered', 
      method:'Photographer',
      photographer:'Lisa Rodriguez', 
      deadline:'2025-08-29', 
      costCenter:'PG-400',
      priority:'Low',
      brief:'Weather-resistant patio furniture set. Outdoor lifestyle photography with seasonal context.',
      articles: ['Patio Table Set [EAN: 5901234567972]', 'Outdoor Cushions [EAN: 5901234567973]'],
      budget: 11200,
      deliverables: ['Outdoor Lifestyle Photography', 'Product Detail Shots', 'Seasonal Styling'],
      eventId: 'A7625095', 
      purchaseGroup: 400,
      offerId: '10763362',
      articleNumber: 'ART-PATIO-044',
      articleName: 'Outdoor Patio Furniture',
      imageRequestId: '123505',
      photoStatus: 'Archive',
      createdBy: 'user-promo2',
      createdAt: '2025-08-24T18:00:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-045', 
      title:'Artisan Bread Making Kit', 
      status:'Processing', 
      method:'Photographer',
      photographer:'Carlos Garcia', 
      deadline:'2025-09-25', 
      costCenter:'PG-100',
      priority:'Medium',
      brief:'Complete bread making kit for home bakers. Food photography with process demonstration.',
      articles: ['Bread Making Kit [EAN: 5901234567974]', 'Sourdough Starter [EAN: 5901234567975]'],
      budget: 5800,
      deliverables: ['Food Photography', 'Baking Process Demo', 'Lifestyle Kitchen'],
      eventId: 'A7725096', 
      purchaseGroup: 100,
      offerId: '10763363',
      articleNumber: 'ART-BREADKIT-045',
      articleName: 'Artisan Bread Making Kit',
      imageRequestId: '123506',
      photoStatus: 'Processing',
      createdBy: 'user-promo1',
      createdAt: '2025-09-09T08:15:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-046', 
      title:'Electric Scooter Urban', 
      status:'Urgent', 
      method:'Photographer',
      photographer:'David Thompson', 
      deadline:'2025-09-06', 
      costCenter:'PG-400',
      priority:'Critical',
      brief:'Urban electric scooter for city commuting. Dynamic action shots in urban environment.',
      articles: ['Electric Scooter Pro [EAN: 5901234567976]', 'Scooter Helmet [EAN: 5901234567977]'],
      budget: 13200,
      deliverables: ['Action Photography', 'Urban Lifestyle', 'Tech Feature Highlights'],
      eventId: 'A7825097', 
      purchaseGroup: 400,
      offerId: '10763364',
      articleNumber: 'ART-ESCOOTER-046',
      articleName: 'Electric Scooter Urban',
      imageRequestId: '123507',
      photoStatus: 'Urgent',
      createdBy: 'user-promo2',
      createdAt: '2025-09-04T19:30:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-047', 
      title:'Designer Sunglasses Collection', 
      status:'Samples Received', 
      method:'Photographer',
      photographer:'Amanda Foster', 
      deadline:'2025-09-22', 
      costCenter:'PG-200',
      priority:'High',
      brief:'Luxury designer sunglasses for summer/fall transition. Fashion photography with lifestyle context.',
      articles: ['Designer Sunglasses Aviator [EAN: 5901234567978]', 'Sunglasses Case Leather [EAN: 5901234567979]'],
      budget: 15800,
      deliverables: ['Fashion Photography', 'Lifestyle Summer', 'Detail Craftsmanship'],
      eventId: 'A7925098', 
      purchaseGroup: 200,
      offerId: '10763365',
      articleNumber: 'ART-SUNGLASSES-047',
      articleName: 'Designer Sunglasses Collection',
      imageRequestId: '123508',
      photoStatus: 'Samples Received',
      createdBy: 'user-promo1',
      createdAt: '2025-09-09T10:45:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-048', 
      title:'Smart Home Thermostat', 
      status:'Approved', 
      method:'Photo Box',
      photographer:'Richard Davis', 
      deadline:'2025-09-28', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Smart thermostat with energy saving features. Modern home lifestyle and tech photography.',
      articles: ['Smart Thermostat WiFi [EAN: 5901234567980]', 'Temperature Sensor [EAN: 5901234567981]'],
      budget: 7400,
      deliverables: ['Tech Product Shots', 'Home Lifestyle', 'Energy Saving Demo'],
      eventId: 'A8025099', 
      purchaseGroup: 300,
      offerId: '10763366',
      articleNumber: 'ART-THERMOSTAT-048',
      articleName: 'Smart Home Thermostat',
      imageRequestId: '123509',
      photoStatus: 'Approved',
      createdBy: 'user-promo2',
      createdAt: '2025-09-09T12:30:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-049', 
      title:'Luxury Bath Towel Set', 
      status:'Draft', 
      method:'Photographer',
      photographer:'Grace Wilson', 
      deadline:'2025-10-02', 
      costCenter:'PG-200',
      priority:'Low',
      brief:'Premium cotton bath towel collection. Spa-like bathroom lifestyle photography.',
      articles: ['Bath Towel Luxury 100% Cotton [EAN: 5901234567982]', 'Towel Set Gift Box [EAN: 5901234567983]'],
      budget: 6800,
      deliverables: ['Lifestyle Bathroom', 'Texture Close-ups', 'Spa Styling'],
      eventId: 'A8125100', 
      purchaseGroup: 200,
      offerId: '10763367',
      articleNumber: 'ART-TOWELS-049',
      articleName: 'Luxury Bath Towel Set',
      imageRequestId: '123510',
      photoStatus: 'New',
      createdBy: 'user-promo1',
      createdAt: '2025-09-09T14:15:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-050', 
      title:'Professional Blender High-Speed', 
      status:'Pending Approval', 
      method:'Photo Box',
      photographer:'Michelle Lee', 
      deadline:'2025-09-30', 
      costCenter:'PG-400',
      priority:'High',
      brief:'High-performance blender for smoothies and food prep. Kitchen lifestyle with action shots.',
      articles: ['High-Speed Blender Pro [EAN: 5901234567984]', 'Blender Cup Set [EAN: 5901234567985]'],
      budget: 9600,
      deliverables: ['Product Photography', 'Kitchen Lifestyle', 'Action Blending Shots'],
      eventId: 'A8225101', 
      purchaseGroup: 400,
      offerId: '10763368',
      articleNumber: 'ART-BLENDER-050',
      articleName: 'Professional Blender',
      imageRequestId: '123511',
      photoStatus: 'Pending',
      createdBy: 'user-promo2',
      createdAt: '2025-09-09T16:00:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-051', 
      title:'Wireless Charging Pad Multi-Device', 
      status:'Photo Session', 
      method:'Photo Box',
      photographer:'Kevin Chang', 
      deadline:'2025-09-14', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Multi-device wireless charging station. Clean tech photography with device compatibility.',
      articles: ['Wireless Charging Pad 3-in-1 [EAN: 5901234567986]', 'USB-C Cable Fast [EAN: 5901234567987]'],
      budget: 5200,
      deliverables: ['Tech Product Shots', 'Device Compatibility Demo', 'Lifestyle Office'],
      eventId: 'A8325102', 
      purchaseGroup: 300,
      offerId: '10763369',
      articleNumber: 'ART-CHARGER-051',
      articleName: 'Wireless Charging Station',
      imageRequestId: '123512',
      photoStatus: 'In Progress',
      createdBy: 'user-promo1',
      createdAt: '2025-09-09T17:45:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-052', 
      title:'Artisan Ceramic Dinnerware', 
      status:'Complete', 
      method:'Photographer',
      photographer:'Diana Miller', 
      deadline:'2025-09-01', 
      costCenter:'PG-200',
      priority:'Low',
      brief:'Handcrafted ceramic dinnerware collection. Elegant table setting and lifestyle photography.',
      articles: ['Ceramic Dinner Plate Set [EAN: 5901234567988]', 'Ceramic Bowl Collection [EAN: 5901234567989]'],
      budget: 8400,
      deliverables: ['Lifestyle Table Setting', 'Product Detail Shots', 'Artisan Craftsmanship'],
      eventId: 'A8425103', 
      purchaseGroup: 200,
      offerId: '10763370',
      articleNumber: 'ART-DINNERWARE-052',
      articleName: 'Artisan Ceramic Collection',
      imageRequestId: '123513',
      photoStatus: 'Archive',
      createdBy: 'user-promo2',
      createdAt: '2025-08-27T09:30:00Z',
      assignedTo: 'user-photo1',
      comments: []
    },
    {
      orderNumber:'ORD-2025-053', 
      title:'Smart Water Bottle Hydration', 
      status:'Samples Requested', 
      method:'Photo Box',
      photographer:'Tyler Brown', 
      deadline:'2025-09-26', 
      costCenter:'PG-400',
      priority:'High',
      brief:'Smart water bottle with hydration tracking. Active lifestyle and tech photography.',
      articles: ['Smart Water Bottle 32oz [EAN: 5901234567990]', 'Bottle Cleaning Kit [EAN: 5901234567991]'],
      budget: 6200,
      deliverables: ['Tech Product Shots', 'Active Lifestyle', 'App Interface Demo'],
      eventId: 'A8525104', 
      purchaseGroup: 400,
      offerId: '10763371',
      articleNumber: 'ART-WATERBOTTLE-053',
      articleName: 'Smart Hydration Bottle',
      imageRequestId: '123514',
      photoStatus: 'Samples Requested',
      createdBy: 'user-promo1',
      createdAt: '2025-09-10T08:00:00Z',
      assignedTo: 'user-photo2',
      comments: []
    },
    {
      orderNumber:'ORD-2025-054', 
      title:'Luxury Watch Band Collection', 
      status:'Review', 
      method:'Photographer',
      photographer:'Olivia Garcia', 
      deadline:'2025-09-21', 
      costCenter:'PG-200',
      priority:'Medium',
      brief:'Premium watch bands in various materials. Luxury accessory photography with lifestyle context.',
      articles: ['Leather Watch Band [EAN: 5901234567992]', 'Metal Watch Band Titanium [EAN: 5901234567993]'],
      budget: 11800,
      deliverables: ['Luxury Accessory Photography', 'Material Close-ups', 'Lifestyle Elegance'],
      eventId: 'A8625105', 
      purchaseGroup: 200,
      offerId: '10763372',
      articleNumber: 'ART-WATCHBAND-054',
      articleName: 'Luxury Watch Band Collection',
      imageRequestId: '123515',
      photoStatus: 'Review',
      createdBy: 'user-promo2',
      createdAt: '2025-09-10T10:30:00Z',
      assignedTo: 'user-photo3',
      comments: []
    },
    {
      orderNumber:'ORD-2025-055', 
      title:'Electric Coffee Grinder Pro', 
      status:'New Request', 
      method:'Photo Box',
      photographer:'Not Assigned', 
      deadline:'2025-10-03', 
      costCenter:'PG-100',
      priority:'Low',
      brief:'Professional electric coffee grinder with precision settings. Coffee lifestyle photography.',
      articles: ['Electric Coffee Grinder [EAN: 5901234567994]', 'Coffee Bean Storage [EAN: 5901234567995]'],
      budget: 4800,
      deliverables: ['Product Photography', 'Coffee Lifestyle', 'Grinding Demo'],
      eventId: 'A8725106', 
      purchaseGroup: 100,
      offerId: '10763373',
      articleNumber: 'ART-GRINDER-055',
      articleName: 'Electric Coffee Grinder',
      imageRequestId: '123516',
      photoStatus: 'New',
      createdBy: 'user-promo1',
      createdAt: '2025-09-10T12:15:00Z',
      assignedTo: null,
      comments: []
    },
    {
      orderNumber:'ORD-2025-056', 
      title:'Ergonomic Office Chair Executive', 
      status:'Samples in Transit', 
      method:'Photographer',
      photographer:'Jonathan Smith', 
      deadline:'2025-09-24', 
      costCenter:'PG-200',
      priority:'High',
      brief:'Executive ergonomic office chair with premium materials. Office lifestyle photography.',
      articles: ['Office Chair Executive [EAN: 5901234567996]', 'Chair Mat Protective [EAN: 5901234567997]'],
      budget: 14200,
      deliverables: ['Product Photography', 'Office Lifestyle', 'Ergonomic Features'],
      eventId: 'A8825107', 
      purchaseGroup: 200,
      offerId: '10763374',
      articleNumber: 'ART-OFFICECHAIR-056',
      articleName: 'Ergonomic Executive Chair',
      imageRequestId: '123517',
      photoStatus: 'Samples in Transit',
      createdBy: 'user-promo2',
      createdAt: '2025-09-10T14:45:00Z',
      assignedTo: 'user-photo4',
      comments: []
    },
    {
      orderNumber:'ORD-2025-057', 
      title:'Air Purifier HEPA Advanced', 
      status:'Delivered', 
      method:'Photo Box',
      photographer:'Sandra Lee', 
      deadline:'2025-09-02', 
      costCenter:'PG-300',
      priority:'Medium',
      brief:'Advanced HEPA air purifier for home use. Clean lifestyle photography with air quality focus.',
      articles: ['Air Purifier HEPA [EAN: 5901234567998]', 'Replacement Filter Set [EAN: 5901234567999]'],
      budget: 10500,
      deliverables: ['Tech Product Shots', 'Home Lifestyle', 'Air Quality Demo'],
      eventId: 'A8925108', 
      purchaseGroup: 300,
      offerId: '10763375',
      articleNumber: 'ART-AIRPURIFIER-057',
      articleName: 'HEPA Air Purifier',
      imageRequestId: '123518',
      photoStatus: 'Archive',
      createdBy: 'user-promo1',
      createdAt: '2025-08-28T16:30:00Z',
      assignedTo: 'user-photo5',
      comments: []
    },
    {
      orderNumber:'ORD-2025-058', 
      title:'Gourmet Olive Oil Collection', 
      status:'Processing', 
      method:'Photographer',
      photographer:'Mario Rossi', 
      deadline:'2025-09-19', 
      costCenter:'PG-100',
      priority:'Critical',
      brief:'Premium extra virgin olive oils from Mediterranean regions. Gourmet food photography.',
      articles: ['Extra Virgin Olive Oil [EAN: 5901234568000]', 'Oil Tasting Set [EAN: 5901234568001]'],
      budget: 7600,
      deliverables: ['Gourmet Food Photography', 'Lifestyle Cooking', 'Oil Quality Demo'],
      eventId: 'A9025109', 
      purchaseGroup: 100,
      offerId: '10763376',
      articleNumber: 'ART-OLIVEOIL-058',
      articleName: 'Gourmet Olive Oil Collection',
      imageRequestId: '123519',
      photoStatus: 'Processing',
      createdBy: 'user-promo2',
      createdAt: '2025-09-10T18:00:00Z',
      assignedTo: 'user-photo1',
      comments: []
    }
  ];

  // Expose allOrders globally for access from other scopes
  window.allOrders = allOrders;

  // Update quick action badges with real counts
  function updateQuickActionBadges() {
    const allOrdersList = window.allOrders || [];
    const orders = window.authSystem ? window.authSystem.getFilteredOrders(allOrdersList) : allOrdersList;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Helper function to update badge with animation
    function updateBadgeWithAnimation(badge, newCount) {
      if (!badge) return;
      
      const oldCount = parseInt(badge.textContent) || 0;
      badge.textContent = newCount;
      badge.style.display = newCount > 0 ? 'flex' : 'none';
      
      // Add animation if value changed
      if (oldCount !== newCount && newCount > 0) {
        badge.classList.add('updated');
        setTimeout(() => badge.classList.remove('updated'), 600);
      }
    }
    
    // Count urgent orders (high priority)
    const urgentCount = orders.filter(o => o.priority === 'High' || o.priority === 'Critical').length;
    const urgentBadge = document.getElementById('urgentBadge');
    updateBadgeWithAnimation(urgentBadge, urgentCount);
    
    // Count samples in transit
    const samplesCount = orders.filter(o => 
      o.status === 'Samples Requested' || 
      o.status === 'Samples in Transit' ||
      o.status === 'Samples Received'
    ).length;
    const samplesBadge = document.getElementById('samplesBadge');
    updateBadgeWithAnimation(samplesBadge, samplesCount);
    
    // Count overdue orders
    const overdueToday = new Date();
    overdueToday.setHours(23, 59, 59, 999); // End of today
    const overdueCount = orders.filter(o => {
      const deadline = new Date(o.deadline);
      return deadline < overdueToday && 
        o.status !== 'Complete' && 
        o.status !== 'Completed' &&
        o.status !== 'Delivered' &&
        o.status !== 'Archived';
    }).length;
    const overdueBadge = document.getElementById('overdueBadge');
    updateBadgeWithAnimation(overdueBadge, overdueCount);
    
    // Count today's deadlines
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = orders.filter(o => o.deadline === todayStr).length;
    const todayBadge = document.getElementById('todayBadge');
    updateBadgeWithAnimation(todayBadge, todayCount);
  }

  // Expose updateQuickActionBadges globally
  window.updateQuickActionBadges = updateQuickActionBadges;

  const samples = [
    {
      id: 'SMP-001',
      articleName: 'Premium Dog Food 2kg',
      status: 'At Photographer',
      location: 'Studio A - Downtown',
      assignedTo: 'John Smith',
      transitHistory: 'Warehouse → Studio A (Aug 22)',
      lastUpdate: '2025-08-23'
    },
    {
      id: 'SMP-002',
      articleName: 'Espresso Beans 500g',
      status: 'In Transit to Photo Box',
      location: 'Transit Vehicle #47',
      assignedTo: 'Emily Brown',
      transitHistory: 'Warehouse → Photo Box Station 3',
      lastUpdate: '2025-08-25'
    },
    {
      id: 'SMP-003',
      articleName: 'Wireless Bluetooth Speaker',
      status: 'Created',
      location: 'Warehouse',
      assignedTo: 'Unassigned',
      transitHistory: 'Created in Warehouse',
      lastUpdate: '2025-08-24'
    }
  ];

  const css = `
    #fallback-app { font-family: system-ui, 'Segoe UI', Arial, sans-serif; line-height: 1.5; }
    #fallback-app h1 { margin: 0 0 8px; font-size: 22px; color: #1f2937; font-weight: 600; }
    #fallback-app .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 16px 0; }
    #fallback-app .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
    #fallback-app .stat-card.clickable-tile:hover { background: #e2e8f0; border-color: #3b82f6; transform: translateY(-2px); transition: all 0.2s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    #fallback-app .stat-number { font-size: 24px; font-weight: bold; color: #2563eb; }
    #fallback-app .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
    #fallback-app table { border-collapse: collapse; width: 100%; margin-top: 12px; background: white; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    #fallback-app th, #fallback-app td { border-bottom: 1px solid #e5e7eb; padding: 8px 12px; font-size: 13px; text-align: left; }
    #fallback-app th { background: #f8fafc; font-weight: 600; color: #374151; }
    #fallback-app tbody tr { background: white; color: #374151; }
    #fallback-app tbody tr td { color: #374151 !important; }
    #fallback-app tbody tr:hover { background: #f9fafb; }
    #fallback-app .status { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; display: inline-block; }
    #fallback-app .Complete, #fallback-app .Delivered, #fallback-app .status-complete { background: #d1fae5; color: #065f46; }
    #fallback-app .Pending, #fallback-app .status-pending { background: #fef3c7; color: #92400e; }
    #fallback-app .Draft, #fallback-app .Created, #fallback-app .status-draft { background: #f3f4f6; color: #374151; }
    #fallback-app .NewRequest, #fallback-app .Received, #fallback-app .status-samples { background: #e0f2fe; color: #075985; }
    #fallback-app .InProgress, #fallback-app .AtPhotographer, #fallback-app .status-in-progress { background: #dbeafe; color: #1e40af; }
    #fallback-app .Approved, #fallback-app .status-approved { background: #dcfce7; color: #166534; }
    #fallback-app .SamplesRequested, #fallback-app .InTransittoPhotographer, #fallback-app .InTransittoPhotoBox, #fallback-app .status-review { background: #fef3c7; color: #92400e; }
    #fallback-app .AtPhotoBox { background: #e0e7ff; color: #3730a3; }
    #fallback-app .High, #fallback-app .Urgent { background: #fee2e2; color: #991b1b; }
    #fallback-app .Medium { background: #fef3c7; color: #92400e; }
    #fallback-app .Low { background: #dcfce7; color: #166534; }
    #fallback-app .template-card:hover { border-color: #2563eb; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1); }
    #fallback-app .kanban-items { min-height: 100px; }
    #fallback-app .kanban-item { background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; margin-bottom: 8px; cursor: pointer; font-size: 12px; }
    #fallback-app .kanban-item:hover { border-color: #3b82f6; }
    #fallback-app .progress-bar { width: 100%; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
    #fallback-app .progress-fill { height: 100%; background: #3b82f6; transition: width 0.3s ease; }
    #fallback-app .bulk-mode .bulk-checkbox { display: table-cell !important; }
    #fallback-app .selected-row { background: #fef3c7 !important; }
    #fallback-app .toolbar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; align-items: center; }
    #fallback-app .btn { background: #4b5563; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; transition: background 0.2s; }
    #fallback-app .btn:hover { background: #374151; }
    #fallback-app .btn-primary { background: #2563eb; }
    #fallback-app .btn-primary:hover { background: #1d4ed8; }
    #fallback-app input { flex: 1; min-width: 240px; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; }
    #fallback-app .alert { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px; }
    
    /* Bulk Actions Panel Responsive Styles */
    @media (max-width: 768px) {
      #bulkActionsPanel > div { 
        padding: 12px !important; 
      }
      #bulkActionsPanel > div > div { 
        flex-direction: column !important; 
        align-items: stretch !important; 
        gap: 16px !important; 
      }
      #bulkActionsPanel button { 
        justify-content: center !important; 
        flex: 1 !important; 
        min-width: auto !important; 
      }
      #bulkActionsPanel .selected-count-info { 
        text-align: center !important; 
      }
    }
    @media (max-width: 480px) {
      #bulkActionsPanel button { 
        padding: 12px 8px !important; 
        font-size: 12px !important; 
      }
      #bulkActionsPanel button span:first-child { 
        margin-right: 4px !important; 
      }
    }
    #confetti-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
    @keyframes confetti-fall { 0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
    .confetti { position: fixed; width: 8px; height: 8px; z-index: 9999; pointer-events: none; animation: confetti-fall 3s linear forwards; }
  `;

  if(!document.getElementById('fallback-style')){
    const st = document.createElement('style');
    st.id = 'fallback-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function getStats(ordersList = allOrders) {
    const total = ordersList.length;
    const complete = ordersList.filter(o => o.status === 'Complete' || o.status === 'Delivered').length;
    const pending = ordersList.filter(o => o.status === 'Pending' || o.status === 'Draft').length;
    const inProgress = ordersList.filter(o => o.status === 'In Progress').length;
    const newRequests = ordersList.filter(o => o.status === 'New Request' || o.status === 'Draft').length;
    const totalSamples = samples.length;
    const samplesInTransit = samples.filter(s => s.status.includes('Transit')).length;
    return { total, complete, pending, inProgress, newRequests, totalSamples, samplesInTransit };
  }

  function triggerConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f39c12'];
    const particles = 100;
    
    for (let i = 0; i < particles; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
      
      document.body.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 5000);
    }
  }

  // Global Functions for Placeholder Items (for onclick handlers)
  window.getPlaceholderItems = function() {
    const items = localStorage.getItem('placeholderItems');
    return items ? JSON.parse(items) : [];
  };

  window.savePlaceholderItems = function(items) {
    localStorage.setItem('placeholderItems', JSON.stringify(items));
  };

  window.createOrderFromPlaceholder = function(itemId) {
    const placeholderItems = getPlaceholderItems();
    const item = placeholderItems.find(p => p.id === itemId);
    
    if (!item) {
      alert('Placeholder item not found');
      return;
    }
    
    // Close the modal
    const modal = document.querySelector('div[style*="position:fixed"]');
    if (modal) {
      modal.remove();
    }
    
    // Switch to create order view
    showView('create');
    
    // Pre-fill the form with placeholder item data
    setTimeout(() => {
      const articleInput = document.getElementById('articleNumber');
      const titleInput = document.getElementById('orderTitle');
      const commentsInput = document.getElementById('orderComments');
      const prioritySelect = document.getElementById('orderPriority');
      
      if (articleInput) articleInput.value = item.id;
      if (titleInput) titleInput.value = `Photo Order for ${item.description}`;
      if (commentsInput) commentsInput.value = `Placeholder item order: ${item.description}${item.notes ? '\n\nNotes: ' + item.notes : ''}`;
      if (prioritySelect) prioritySelect.value = item.priority;
      
      // Add placeholder indicator
      if (commentsInput) {
        commentsInput.value += '\n\n⚠️ This order uses a placeholder item. Please update the article number once the item is registered in the system.';
      }
    }, 100);
  };

  window.editPlaceholderItem = function(itemId) {
    // For now, show a simple edit interface - could be expanded to a full edit modal
    const placeholderItems = getPlaceholderItems();
    const item = placeholderItems.find(p => p.id === itemId);
    
    if (!item) {
      alert('Placeholder item not found');
      return;
    }
    
    const newDescription = prompt('Edit description:', item.description);
    if (newDescription !== null && newDescription.trim()) {
      item.description = newDescription.trim();
      savePlaceholderItems(placeholderItems);
      
      // Refresh the modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
        showPlaceholderItemsModal();
      }
    }
  };

  window.deletePlaceholderItem = function(itemId) {
    if (!confirm(`Are you sure you want to delete placeholder item "${itemId}"?`)) {
      return;
    }
    
    const placeholderItems = getPlaceholderItems();
    const updatedItems = placeholderItems.filter(item => item.id !== itemId);
    savePlaceholderItems(placeholderItems);
    
    // Refresh the modal
    const modal = document.querySelector('div[style*="position:fixed"]');
    if (modal) {
      modal.remove();
      window.showPlaceholderItemsModal();
    }
  };

  function render() {
    // Check authentication
    if (!authSystem.isAuthenticated()) {
      showLoginScreen();
      return;
    }

    const currentUser = authSystem.getCurrentUser();
    let orders = authSystem.getFilteredOrders(allOrders); // Create global orders variable for compatibility
    const stats = getStats(orders);
    
    // Function to refresh orders when needed
    function refreshOrders() {
      orders = authSystem.getFilteredOrders(allOrders);
      return orders;
    }
    
    root.innerHTML = `
      <!-- Enhanced Sidebar Layout -->
      <div id="fallback-app" style="min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex;">
        
        <!-- Modern Sidebar -->
        <div class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <h1 class="sidebar-title">📸 Photo Orders</h1>
            <button class="sidebar-toggle" onclick="toggleSidebar()" title="Toggle Sidebar (Ctrl+B)" aria-label="Toggle Sidebar">
              <span id="sidebarToggleIcon">◀</span>
            </button>
          </div>
          
          <nav class="sidebar-nav">
            <!-- Core Operations -->
            <div class="nav-section">
              <div class="nav-section-title">Core Operations</div>
              <div class="nav-item" data-tooltip="Dashboard Overview" onclick="showView('dashboard')">
                <span class="nav-item-icon">🏠</span>
                <span class="nav-item-text">Dashboard</span>
              </div>
              ${authSystem.canCreateOrders() ? `
                <div class="nav-item" data-tooltip="Create New Order" onclick="showNewOrderModal()">
                  <span class="nav-item-icon">➕</span>
                  <span class="nav-item-text">New Order</span>
                </div>
              ` : ''}
              <div class="nav-item" data-tooltip="View All Orders" onclick="showView('orders')">
                <span class="nav-item-icon">📋</span>
                <span class="nav-item-text">Orders</span>
              </div>
              <div class="nav-item" data-tooltip="Scan Article" onclick="showScanArticleRightModal()">
                <span class="nav-item-icon">📷</span>
                <span class="nav-item-text">Scan Article</span>
              </div>
            </div>

            <!-- Views & Analytics -->
            <div class="nav-section">
              <div class="nav-section-title">Views & Analytics</div>
              <div class="nav-item" data-tooltip="Kanban Board" onclick="showView('kanban')">
                <span class="nav-item-icon">📊</span>
                <span class="nav-item-text">Kanban Board</span>
              </div>
              <div class="nav-item" data-tooltip="Calendar View" onclick="showView('calendar')">
                <span class="nav-item-icon">📅</span>
                <span class="nav-item-text">Calendar</span>
              </div>
              <div class="nav-item" data-tooltip="Workflow View" onclick="showView('workflow')">
                <span class="nav-item-icon">🔄</span>
                <span class="nav-item-text">Workflow</span>
              </div>
              ${authSystem.canCreateOrders() ? `
                <div class="nav-item" data-tooltip="Smart Suggestions" onclick="window.showHistoricalSuggestionsModal()">
                  <span class="nav-item-icon">📊</span>
                  <span class="nav-item-text">Smart Analytics</span>
                </div>
              ` : ''}
            </div>

            <!-- Quick Actions -->
            <div class="nav-section">
              <div class="nav-section-title">Quick Actions</div>
              <div class="nav-item nav-item-urgent" data-tooltip="View High & Critical Priority Orders" onclick="filterOrdersByStatus('urgent')">
                <span class="nav-item-icon">🚨</span>
                <span class="nav-item-text">Urgent Orders</span>
                <span class="nav-item-badge" id="urgentBadge">0</span>
              </div>
              <div class="nav-item nav-item-samples" data-tooltip="View Orders with Samples Requested/In Transit/Received" onclick="filterOrdersByStatus('samples')">
                <span class="nav-item-icon">📦</span>
                <span class="nav-item-text">Samples Ready</span>
                <span class="nav-item-badge" id="samplesBadge">0</span>
              </div>
              <div class="nav-item nav-item-overdue" data-tooltip="View Orders Past Their Deadline" onclick="filterOrdersByStatus('overdue')">
                <span class="nav-item-icon">⏰</span>
                <span class="nav-item-text">Overdue Orders</span>
                <span class="nav-item-badge" id="overdueBadge">0</span>
              </div>
              <div class="nav-item nav-item-today" data-tooltip="View Orders Due Today" onclick="filterOrdersByStatus('today')">
                <span class="nav-item-icon">📅</span>
                <span class="nav-item-text">Due Today</span>
                <span class="nav-item-badge" id="todayBadge">0</span>
              </div>
            </div>

            <!-- Data Management -->
            <div class="nav-section">
              <div class="nav-section-title">Data Management</div>
              ${authSystem.canCreateOrders() ? `
                <div class="nav-item" data-tooltip="Import SAP PMR" onclick="showSAPImportModal()">
                  <span class="nav-item-icon">🏢</span>
                  <span class="nav-item-text">SAP Import</span>
                </div>
                <div class="nav-item" data-tooltip="Import Excel/CSV" onclick="window.showExcelImportModal()">
                  <span class="nav-item-icon">📋</span>
                  <span class="nav-item-text">Excel Import</span>
                </div>
              ` : ''}
              <div class="nav-item" data-tooltip="Cloudinary Asset Management" onclick="window.showDAMIntegrationModal()">
                <span class="nav-item-icon">☁️</span>
                <span class="nav-item-text">Cloudinary Assets</span>
              </div>
              <div id="toggleBulkMode" class="nav-item" data-tooltip="Bulk Operations">
                <span class="nav-item-icon">☑️</span>
                <span class="nav-item-text">Bulk Select</span>
              </div>
            </div>

            <!-- Templates & Automation -->
            ${authSystem.canCreateOrders() ? `
              <div class="nav-section">
                <div class="nav-section-title">Automation</div>
                <div class="nav-item" data-tooltip="Quick Templates" onclick="showQuickTemplatesModal()">
                  <span class="nav-item-icon">⚡</span>
                  <span class="nav-item-text">Quick Templates</span>
                </div>
                <div class="nav-item" data-tooltip="Template Rules Engine" onclick="window.showTemplateRulesModal()">
                  <span class="nav-item-icon">🎯</span>
                  <span class="nav-item-text">Template Rules</span>
                </div>
                <div class="nav-item" data-tooltip="Placeholder Items" onclick="window.showPlaceholderItemsModal()">
                  <span class="nav-item-icon">📝</span>
                  <span class="nav-item-text">Placeholder Items</span>
                </div>
              </div>
            ` : ''}

            <!-- System & Support -->
            <div class="nav-section">
              <div class="nav-section-title">System</div>
              <div class="nav-item" data-tooltip="Request Customization" onclick="window.showCustomizationRequestModal()">
                <span class="nav-item-icon">🔧</span>
                <span class="nav-item-text">Customizations</span>
              </div>
              <div class="nav-item" data-tooltip="System Settings" onclick="showSettings()">
                <span class="nav-item-icon">⚙️</span>
                <span class="nav-item-text">Settings</span>
              </div>
              <div class="nav-item" data-tooltip="User Profile" onclick="showProfile()">
                <span class="nav-item-icon">👤</span>
                <span class="nav-item-text">Profile</span>
              </div>
            </div>
          </nav>
        </div>

        <!-- Main Content Area -->
        <div class="main-content">
          <div class="content-header">
            <h1 class="content-title" id="contentTitle">Dashboard Overview</h1>
            <div class="content-actions">
              <button class="btn btn-secondary" onclick="exportToCsv()" style="padding: 8px 16px; font-size: 14px;">📊 Export</button>
              <button class="btn btn-secondary" onclick="refreshData()" style="padding: 8px 16px; font-size: 14px;">🔄 Refresh</button>
              <div style="position: relative; display: flex; align-items: center; gap: 12px;">
                <span style="color: #059669; font-weight: 500; font-size: 14px;">
                  ${currentUser.name} (${currentUser.role})
                </span>
                <button onclick="logout()" class="btn btn-sm" style="background: #ef4444; color: white; padding: 6px 12px; font-size: 12px; border-radius: 6px;">
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          <div class="content-body">
            <!-- Main Content Area -->
            <div id="mainContent">
              <!-- Dashboard View -->
              <div id="dashboardView" style="display: none;">
                <!-- Dashboard Stats Grid -->
                <div id="dashboardStats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 20px;">
                  <!-- Stats cards will be populated here -->
                </div>

                <!-- Recent Orders Section -->
                <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
                  <div style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
                    <h3 style="margin: 0; font-size: 18px; color: #1f2937; font-weight: 600;">📋 Recent Orders</h3>
                  </div>
                  <div id="recentOrdersContainer" style="max-height: 400px; overflow-y: auto;">
                    <!-- Recent orders will be populated here -->
                  </div>
                </div>
              </div>

              <!-- Orders Table - Default View -->
              <div id="ordersView">
                <!-- Filter Tiles Section -->
                <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; padding: 16px;">
                  <h3 style="margin: 0 0 16px; font-size: 16px; color: #1f2937; font-weight: 600;">🔍 Quick Filters</h3>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px;">
                    <!-- Process Flow Order -->
                    <div onclick="filterOrdersByStatus('all')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #6b7280;" 
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                      <div style="font-size: 24px; font-weight: bold; color: #6b7280; margin-bottom: 8px;" id="allOrdersCount">0</div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">📋 All Orders</div>
                    </div>
                    
                    <div onclick="filterOrdersByStatus('draft')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #94a3b8;" 
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                      <div style="font-size: 24px; font-weight: bold; color: #94a3b8; margin-bottom: 8px;" id="draftOrdersCount">0</div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">📝 Draft</div>
                    </div>
                    
                    <div onclick="filterOrdersByStatus('pending')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #f59e0b;" 
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                      <div style="font-size: 24px; font-weight: bold; color: #f59e0b; margin-bottom: 8px;" id="pendingOrdersCount">0</div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">⏳ Pending</div>
                    </div>
                    
                    <div onclick="filterOrdersByStatus('approved')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #06b6d4;" 
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                      <div style="font-size: 24px; font-weight: bold; color: #06b6d4; margin-bottom: 8px;" id="approvedOrdersCount">0</div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">✅ Approved</div>
                    </div>
                    
                    <div onclick="filterOrdersByStatus('samples')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #8b5cf6;" 
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                      <div style="font-size: 24px; font-weight: bold; color: #8b5cf6; margin-bottom: 8px;" id="samplesOrdersCount">0</div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">📦 Samples</div>
                    </div>
                    
                    <div onclick="filterOrdersByStatus('In Progress')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #3b82f6;" 
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                      <div style="font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 8px;" id="inProgressOrdersCount">0</div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">🔄 In Progress</div>
                    </div>
                    
                    <div onclick="filterOrdersByStatus('review')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #10b981;" 
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                      <div style="font-size: 24px; font-weight: bold; color: #10b981; margin-bottom: 8px;" id="reviewOrdersCount">0</div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">🔍 Review</div>
                    </div>
                    
                    <div onclick="filterOrdersByStatus('completed')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #059669;" 
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                      <div style="font-size: 24px; font-weight: bold; color: #059669; margin-bottom: 8px;" id="completedOrdersCount">0</div>
                      <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">🎉 Complete</div>
                    </div>
                  </div>
                </div>

                <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
                  <div style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
                    <input id="searchBox" placeholder="🔍 Search orders by title, number, or photographer..." 
                           style="width: 100%; padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" />
                  </div>
                  
                  <!-- Bulk Actions Panel - positioned within orders view -->
                  <div style="display: none;" id="bulkActionsPanel">
                    <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-top: 1px solid #e5e7eb; padding: 16px; border-bottom: 1px solid #e5e7eb;">
                      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                        <div class="selected-count-info" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                          <div style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 16px; font-size: 13px; font-weight: 600; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
                            <span id="selectedCount">0</span> selected
                          </div>
                          <span style="color: #6b7280; font-size: 14px; font-weight: 500;">Choose an action to apply to selected items</span>
                        </div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                          <button id="bulkUpdateStatus" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3); display: flex; align-items: center; gap: 6px;" 
                                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(16, 185, 129, 0.4)'" 
                                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(16, 185, 129, 0.3)'">
                            <span>📝</span> Update Status
                          </button>
                          <button id="bulkAssign" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3); display: flex; align-items: center; gap: 6px;" 
                                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(139, 92, 246, 0.4)'" 
                                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(139, 92, 246, 0.3)'">
                            <span>👤</span> Assign To
                          </button>
                          <button id="bulkExport" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3); display: flex; align-items: center; gap: 6px;" 
                                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(245, 158, 11, 0.4)'" 
                                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(245, 158, 11, 0.3)'">
                            <span>📊</span> Export
                          </button>
                          <button id="clearSelection" style="background: linear-gradient(135deg, #6b7280, #4b5563); color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(107, 114, 128, 0.3); display: flex; align-items: center; gap: 6px;" 
                                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(107, 114, 128, 0.4)'" 
                                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(107, 114, 128, 0.3)'">
                            <span>✖️</span> Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background: linear-gradient(135deg, #f8fafc, #f1f5f9);">
                        <th style="width: 40px; display: none;" class="bulk-checkbox"><input type="checkbox" id="selectAllOrders"></th>
                        <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Order Number</th>
                        <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Title</th>
                        <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Status</th>
                        <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Method</th>
                        <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Purchase Group</th>
                        <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Event ID</th>
                        <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Photographer</th>
                        <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Priority</th>
                        <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Deadline</th>
                        <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Progress</th>
                        <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb; width: 100px;">Comments</th>
                      </tr>
                    </thead>
                    <tbody id="ordersBody" style="background: white;">
                      <!-- Orders will be populated here -->
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Kanban Board View -->
              <div style="display: none;" id="kanbanView">
                <h3 style="margin: 16px 0 8px; font-size: 18px; color: #1f2937;">📊 Kanban Board</h3>
                <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">Drag and drop orders to update their status</p>
                
                <div id="kanbanBoard" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin: 16px 0; overflow-x: auto;">
                  <!-- Kanban columns will be populated here -->
                </div>
              </div>

              <!-- Calendar View -->
              <div style="display: none;" id="calendarView">
                <h3 style="margin: 16px 0 8px; font-size: 18px; color: #1f2937;">📅 Calendar View</h3>
                <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">View order deadlines and production schedule</p>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <div style="display: flex; gap: 8px;">
                    <button id="calendarWeek" class="btn btn-secondary">Week</button>
                    <button id="calendarMonth" class="btn btn-secondary">Month</button>
                    <button id="calendarYear" class="btn btn-secondary">Year</button>
                  </div>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <h4 id="calendarTitle" style="margin: 0; font-size: 16px; color: #374151;">August 2025</h4>
                    <button id="calendarPrev" class="btn">‹ Prev</button>
                    <button id="calendarNext" class="btn">Next ›</button>
                  </div>
                  <button id="calendarToday" class="btn" style="background: #3b82f6; color: white;">Today</button>
                </div>
                
                <div id="calendarContainer" style="background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                  <!-- Calendar will be populated here -->
                </div>
              </div>

              <!-- Workflow View -->
              <div style="display: none;" id="workflowView">
                <h3 style="margin: 16px 0 8px; font-size: 18px; color: #1f2937;">🔄 Workflow Overview</h3>
                <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">Track order progression through workflow stages</p>
                
                <div id="workflowKanban" style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px;">
                  <div class="kanban-column" 
                       style="min-width: 250px; background: #f8fafc; border-radius: 8px; padding: 12px;"
                       ondrop="handleDrop(event, 'Draft')" 
                       ondragover="handleDragOver(event)">
                    <h4 style="margin: 0 0 12px; font-size: 14px; color: #374151; font-weight: 600;">📝 Draft Orders</h4>
                    <div id="draftOrders" class="kanban-items"></div>
                  </div>
                  <div class="kanban-column" 
                       style="min-width: 250px; background: #fef3c7; border-radius: 8px; padding: 12px;"
                       ondrop="handleDrop(event, 'Samples Requested')" 
                       ondragover="handleDragOver(event)">
                    <h4 style="margin: 0 0 12px; font-size: 14px; color: #92400e; font-weight: 600;">⏳ Samples Requested</h4>
                    <div id="samplesRequestedOrders" class="kanban-items"></div>
                  </div>
                  <div class="kanban-column" 
                       style="min-width: 250px; background: #dbeafe; border-radius: 8px; padding: 12px;"
                       ondrop="handleDrop(event, 'In Progress')" 
                       ondragover="handleDragOver(event)">
                    <h4 style="margin: 0 0 12px; font-size: 14px; color: #1e40af; font-weight: 600;">🎯 In Progress</h4>
                    <div id="inProgressOrders" class="kanban-items"></div>
                  </div>
                  <div class="kanban-column" 
                       style="min-width: 250px; background: #dcfce7; border-radius: 8px; padding: 12px;"
                       ondrop="handleDrop(event, 'Complete')" 
                       ondragover="handleDragOver(event)">
                    <h4 style="margin: 0 0 12px; font-size: 14px; color: #166534; font-weight: 600;">✅ Completed</h4>
                    <div id="completedOrders" class="kanban-items"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        /* Enhanced Sidebar Styles */
        .sidebar {
          width: 280px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 100;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .sidebar.collapsed {
          width: 60px;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
        }

        .sidebar.transitioning {
          pointer-events: none;
        }

        .sidebar.collapsed .nav-item {
          padding: 12px 20px;
          justify-content: center;
          display: flex; /* Ensure nav items are displayed */
          opacity: 1; /* Make sure they're visible */
        }

        .sidebar-header {
          padding: 20px;
          padding-right: 50px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          background: rgba(255, 255, 255, 0.8);
          position: relative;
          height: 80px; /* Fixed height to maintain consistent header size */
          min-height: 80px; /* Ensure minimum height */
          box-sizing: border-box; /* Include padding in height calculation */
        }

        .sidebar-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          transition: opacity 0.2s ease;
        }

        .sidebar.collapsed .sidebar-title {
          opacity: 0;
        }

        .sidebar.collapsed .sidebar-header {
          padding: 20px 15px; /* Reduce right padding when collapsed */
          height: 80px; /* Maintain exact same height */
          min-height: 80px; /* Maintain exact same min-height */
          box-sizing: border-box; /* Include padding in height calculation */
        }

        .sidebar-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #6b7280;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 8px;
          top: 12px;
          width: 32px;
          height: 32px;
          z-index: 10;
        }

        .sidebar.collapsed .sidebar-toggle {
          right: 20px; /* Move button 6px further right to compensate */
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.1);
          transform: translateX(-6px); /* Move the entire button with background 6px left */
        }

        .sidebar-toggle:hover {
          background: rgba(0, 0, 0, 0.1);
          color: #374151;
          transform: scale(1.1);
        }

        .sidebar.collapsed .sidebar-toggle:hover {
          background: rgba(255, 255, 255, 1);
          color: #374151;
          transform: translateX(-6px) scale(1.1); /* Maintain left shift and add scale */
        }

        .sidebar-toggle:active {
          transform: scale(0.95);
        }

        #sidebarToggleIcon {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-block;
          font-size: 14px;
        }
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
        }

        .nav-section {
          margin-bottom: 8px;
        }

        .nav-section-title {
          padding: 12px 20px 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #9ca3af;
          transition: opacity 0.2s ease;
        }

        .sidebar.collapsed .nav-section-title {
          opacity: 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          margin: 2px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          color: #374151;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(99, 102, 241, 0.1);
          color: #4f46e5;
          transform: translateX(2px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .nav-item-icon {
          font-size: 16px;
          margin-right: 12px;
          width: 20px;
          text-align: center;
          transition: margin 0.2s ease;
        }

        .sidebar.collapsed .nav-item-icon {
          margin-right: 0;
          display: block; /* Ensure icons are displayed */
          opacity: 1; /* Make sure icons are visible */
        }

        .nav-item-text {
          font-size: 14px;
          font-weight: 500;
          transition: opacity 0.2s ease;
        }

        .sidebar.collapsed .nav-item-text {
          opacity: 0;
          display: none; /* Completely hide the text */
        }

        /* Modern Notification Badge Styling */
        .nav-item-badge {
          position: absolute;
          top: 8px;
          right: 12px;
          min-width: 18px;
          height: 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: white;
          padding: 0 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.9);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: scale(1);
          backdrop-filter: blur(4px);
          z-index: 10;
        }

        .nav-item-badge:empty {
          display: none;
        }

        /* Badge hover effects when parent nav-item is hovered */
        .nav-item:hover .nav-item-badge {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          border-color: rgba(255, 255, 255, 1);
        }

        /* Badge positioning for collapsed sidebar */
        .sidebar.collapsed .nav-item-badge {
          right: 8px;
          top: 6px;
          min-width: 16px;
          height: 16px;
          font-size: 9px;
          border-width: 1.5px;
        }

        /* Specific badge colors with gradients */
        .nav-item-badge[id="urgentBadge"] {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .nav-item-badge[id="samplesBadge"] {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .nav-item-badge[id="overdueBadge"] {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        .nav-item-badge[id="todayBadge"] {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        /* Animation for badge updates */
        @keyframes badgePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .nav-item-badge.updated {
          animation: badgePulse 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Tooltip for collapsed sidebar */
        .nav-item::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          margin-left: 12px;
          z-index: 1000;
        }

        .sidebar.collapsed .nav-item:hover::after {
          opacity: 1;
        }

        /* Enhanced Quick Action Styling */
        .nav-item-urgent:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #dc2626 !important;
        }

        .nav-item-samples:hover {
          background: rgba(245, 158, 11, 0.1) !important;
          color: #d97706 !important;
        }

        .nav-item-overdue:hover {
          background: rgba(220, 38, 38, 0.1) !important;
          color: #b91c1c !important;
        }

        .nav-item-today:hover {
          background: rgba(59, 130, 246, 0.1) !important;
          color: #2563eb !important;
        }

        /* Main content area */
        .main-content {
          flex: 1;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          margin: 20px;
          margin-left: 20px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .content-header {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          padding: 24px 32px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .content-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .content-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .content-body {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        /* Enhanced Quick Action Buttons */
        .quick-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: -280px;
            z-index: 1000;
          }
          
          .sidebar.open {
            left: 0;
          }
          
          .main-content {
            margin-left: 20px;
          }
        }

        /* View Transition Animations */
        #ordersView, #kanbanView, #calendarView, #samplesView, #createOrderView, #workflowView {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: forwards;
        }

        #ordersView.view-active, #kanbanView.view-active, #calendarView.view-active, 
        #samplesView.view-active, #createOrderView.view-active, #workflowView.view-active {
          opacity: 1;
          transform: translateY(0);
          animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .view-transitioning-out {
          animation: fadeOut 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Smooth scrolling for content changes */
        .main-content {
          scroll-behavior: smooth;
        }

        /* Loading state for smooth transitions */
        .view-loading {
          pointer-events: none;
          filter: blur(1px);
          transition: filter 0.2s ease;
        }
      </style>

      <script>
        // Update content title when switching views
        function updateContentTitle(title) {
          const contentTitle = document.getElementById('contentTitle');
          if (contentTitle) {
            contentTitle.textContent = title;
          }
        }

        // Quick action functions
        function refreshData() {
          location.reload();
        }

        function exportToCsv() {
          document.getElementById('exportCsv')?.click();
        }

        function showSettings() {
          alert('⚙️ Settings Panel\\n\\nFeature coming soon! This will include:\\n\\n• User preferences\\n• System configuration\\n• Display options\\n• Notification settings');
        }

        function showProfile() {
          alert('👤 User Profile\\n\\nFeature coming soon! This will include:\\n\\n• Personal information\\n• Role permissions\\n• Activity history\\n• Account settings');
        }

      </script>

      <!-- Hidden Views (existing structure) -->
            </div>
          </div>  

        <div id="mainContent">
          <!-- Content will be dynamically loaded here -->
          
          <!-- Samples View (moved inside mainContent for proper positioning) -->
          <div style="display: none;" id="samplesView">
            <h3 style="margin: 16px 0 8px; font-size: 18px; color: #1f2937;">📦 Sample Management</h3>
            <table>
              <thead>
                <tr>
                  <th>Sample ID</th>
                  <th>Article Name</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Assigned To</th>
                  <th>Transit History</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody id="samplesBody"></tbody>
            </table>
          </div>
        </div>

        <div style="display: none;" id="createOrderView">
          <h3 style="margin: 16px 0 8px; font-size: 18px; color: #1f2937;">➕ Create New Photo Order</h3>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <form id="createOrderForm" style="display: grid; gap: 12px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <label style="display: block; font-weight: 500; margin-bottom: 4px;">Order Title</label>
                  <input name="title" required style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" 
                         placeholder="e.g., Premium Product Photography Session">
                </div>
                <div>
                  <label style="display: block; font-weight: 500; margin-bottom: 4px;">Content Creation Method</label>
                  <select name="method" required style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                    <option value="">Select method...</option>
                    <option value="Photographer">Photographer</option>
                    <option value="Photo Box">Photo Box</option>
                    <option value="Internal Studio">Internal Studio</option>
                    <option value="External Studio">External Studio</option>
                  </select>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                <div>
                  <label style="display: block; font-weight: 500; margin-bottom: 4px;">Priority</label>
                  <select name="priority" required style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-weight: 500; margin-bottom: 4px;">Deadline</label>
                  <input name="deadline" type="date" required style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                </div>
                <div>
                  <label style="display: block; font-weight: 500; margin-bottom: 4px;">Budget</label>
                  <input name="budget" type="number" min="0" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" placeholder="0">
                </div>
              </div>

              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 4px;">Assign To</label>
                <select name="photographer" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                  <option value="">Select photographer/photo box...</option>
                  <option value="Mike Rodriguez">Mike Rodriguez (Photographer)</option>
                  <option value="Emily Chen">Emily Chen (Photographer)</option>
                  <option value="Alex Turner">Alex Turner (Photo Box)</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 4px;">Buyers & Items</label>
                <div id="buyersContainer" style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; background: #f8fafc;">
                  <div class="buyer-item" style="display: grid; grid-template-columns: 200px 1fr auto; gap: 8px; align-items: center; margin-bottom: 8px;">
                    <input type="text" class="buyer-name" placeholder="Buyer/Department" style="padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
                    <input type="text" class="buyer-items" placeholder="Items for this buyer (comma-separated)" style="padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
                    <button type="button" onclick="removeBuyer(this)" style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; font-size: 12px;">✕</button>
                  </div>
                  <button type="button" id="addBuyerBtn" style="padding: 6px 12px; background: #059669; color: white; border: none; border-radius: 4px; font-size: 12px;">+ Add Buyer</button>
                </div>
              </div>

              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 4px;">Detailed Brief</label>
                <textarea name="brief" required rows="4" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" 
                          placeholder="Provide detailed instructions for the content creation..."></textarea>
              </div>

              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 4px;">Articles</label>
                <div style="display: flex; gap: 8px; align-items: end;">
                  <div style="flex: 1;">
                    <textarea id="articlesTextarea" name="articles" required rows="3" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" 
                              placeholder="Articles with EAN codes will appear here...&#10;Format: Article Name [EAN: 1234567890123]"></textarea>
                  </div>
                  <button type="button" id="scanArticleBtn" style="padding: 8px 12px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; height: 44px; white-space: nowrap;">
                    📷 Scan Article
                  </button>
                </div>
              </div>

              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 4px;">
                  Photo Types Required 
                  <button type="button" id="applyTemplateRulesBtn" style="padding: 2px 6px; background: #6366f1; color: white; border: none; border-radius: 3px; font-size: 10px; margin-left: 8px;">🎯 Apply Rules</button>
                </label>
                <div id="photoTypesContainer" style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; background: #f8fafc;">
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin-bottom: 8px;">
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Product"> Product Shot</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Lifestyle"> Lifestyle</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Detail"> Detail Shots</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="360"> 360° View</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Model"> Model Shots</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Size"> Size Guide</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Package"> Packaging</label>
                    <label style="display: flex; align-items: center; gap: 4px;"><input type="checkbox" name="photoTypes" value="Group"> Group Shot</label>
                  </div>
                  <div id="appliedRulesInfo" style="font-size: 11px; color: #6b7280; margin-top: 8px; display: none;">
                    Applied rules will be shown here...
                  </div>
                </div>
              </div>

              <div>
                <label style="display: block; font-weight: 500; margin-bottom: 4px;">Deliverables (comma-separated)</label>
                <input name="deliverables" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" 
                       placeholder="e.g., Product Photos, Lifestyle Shots, Social Media Assets">
              </div>

              <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;">
                <button type="button" id="cancelCreate" class="btn">Cancel</button>
                <button type="submit" class="btn btn-primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>

        <div style="display: none;" id="templatesView">
          <h3 style="margin: 16px 0 8px; font-size: 18px; color: #1f2937;">⚡ Quick Templates</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 16px;">
            <div class="template-card" data-template="product-hero" style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s;">
              <h4 style="margin: 0 0 8px; color: #1f2937;">📸 Product Hero Shots</h4>
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">High-impact product photography for marketing campaigns</p>
              <div style="font-size: 11px; color: #9ca3af;">Method: Photographer • Priority: High • Duration: 3-5 days</div>
            </div>
            <div class="template-card" data-template="ecommerce-batch" style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s;">
              <h4 style="margin: 0 0 8px; color: #1f2937;">🛒 E-commerce Batch</h4>
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">Automated white background product shots for online store</p>
              <div style="font-size: 11px; color: #9ca3af;">Method: Photo Box • Priority: Medium • Duration: 1-2 days</div>
            </div>
            <div class="template-card" data-template="lifestyle-campaign" style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s;">
              <h4 style="margin: 0 0 8px; color: #1f2937;">🌟 Lifestyle Campaign</h4>
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">Professional lifestyle photography with models and scenarios</p>
              <div style="font-size: 11px; color: #9ca3af;">Method: External Studio • Priority: High • Duration: 5-7 days</div>
            </div>
            <div class="template-card" data-template="detail-macro" style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.2s;">
              <h4 style="margin: 0 0 8px; color: #1f2937;">🔍 Detail & Macro</h4>
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">Close-up detail shots highlighting product features</p>
              <div style="font-size: 11px; color: #9ca3af;">Method: Internal Studio • Priority: Medium • Duration: 2-3 days</div>
            </div>
          </div>
          <div style="text-align: center;">
            <button id="backFromTemplates" class="btn">← Back to Dashboard</button>
          </div>
        </div>

        <table style="display: none;" id="defaultTable">
          <thead>
            <tr>
              <th style="width: 40px;"><input type="checkbox" id="selectAll"></th>
              <th>Order Number</th>
              <th>Title</th>
              <th>Status</th>
              <th>Method</th>
              <th>Purchase Group</th>
              <th>Event ID</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Deadline</th>
              <th>Progress</th>
              <th style="width: 100px;">Comments</th>
            </tr>
          </thead>
          <tbody id="ordersBody"></tbody>
        </table>

        <div id="diag" style="margin-top: 16px; font-size: 12px; color: #6b7280; white-space: pre-wrap; max-height: 200px; overflow-y: auto;"></div>

        </div>
      </div>
    `;

    // Define toggleSidebar function globally after HTML is rendered
    window.toggleSidebar = function() {
      console.log('[Sidebar] Toggle function called');
      const sidebar = document.getElementById('sidebar');
      const toggleIcon = document.getElementById('sidebarToggleIcon');
      const mainContent = document.querySelector('.main-content');
      
      if (!sidebar || !toggleIcon) {
        console.log('[Sidebar] Missing elements - sidebar:', !!sidebar, 'toggleIcon:', !!toggleIcon);
        return;
      }
      
      const isCollapsed = sidebar.classList.contains('collapsed');
      console.log('[Sidebar] Current state - collapsed:', isCollapsed);
      
      // Add transitioning class for extra smooth animation
      sidebar.classList.add('transitioning');
      
      if (isCollapsed) {
        // Expanding sidebar
        sidebar.classList.remove('collapsed');
        toggleIcon.style.transform = 'rotate(0deg)';
        toggleIcon.textContent = '◀';
        
        // Reset main content margin to normal spacing
        if (mainContent) {
          mainContent.style.marginLeft = '20px';
        }
      } else {
        // Collapsing sidebar
        sidebar.classList.add('collapsed');
        toggleIcon.style.transform = 'rotate(180deg)';
        toggleIcon.textContent = '◀'; // Keep same character, just rotate it
        
        // Keep main content in place, just let it expand naturally
        if (mainContent) {
          mainContent.style.marginLeft = '0px'; // No movement, just natural expansion
        }
      }
      
      // Remove transitioning class after animation completes
      setTimeout(() => {
        sidebar.classList.remove('transitioning');
      }, 300);
    };

    const tbody = document.getElementById('ordersBody');
    const samplesBody = document.getElementById('samplesBody');
    const searchBox = document.getElementById('searchBox');
    
    let currentView = 'orders';
    let bulkMode = false;
    let selectedItems = new Set();

    // Calendar state
    let calendarDate = new Date();
    let calendarViewType = 'week';

    const templates = {
      'product-hero': {
        title: 'Product Hero Photography',
        method: 'Photographer',
        priority: 'High',
        brief: 'Create high-impact hero shots for product marketing campaign. Focus on dramatic lighting, clean backgrounds, and compelling product presentation that captures attention and drives sales.',
        articles: 'Product Sample',
        deliverables: 'Hero Product Shots, Marketing Assets, High-Resolution Images',
        budget: 5000,
        category: 'Photography',
        icon: '📸'
      },
      'ecommerce-batch': {
        title: 'E-commerce Product Batch',
        method: 'Photo Box',
        priority: 'Medium',
        brief: 'Automated white background product photography for online store. Consistent lighting, color accuracy, and standardized framing for catalog consistency.',
        articles: 'Product Batch (10-50 items)',
        deliverables: 'E-commerce Photos, Thumbnail Images, Product Catalog',
        budget: 2000,
        category: 'Photography',
        icon: '🛍️'
      },
      'lifestyle-campaign': {
        title: 'Lifestyle Photography Campaign',
        method: 'External Studio',
        priority: 'High',
        brief: 'Professional lifestyle photography featuring products in real-world scenarios with models. Focus on emotional connection and aspirational lifestyle messaging.',
        articles: 'Product Samples, Props, Models',
        deliverables: 'Lifestyle Photography, Social Media Content, Campaign Assets',
        budget: 8000,
        category: 'Photography',
        icon: '🌟'
      },
      'detail-macro': {
        title: 'Detail & Macro Photography',
        method: 'Internal Studio',
        priority: 'Medium',
        brief: 'Close-up detail photography highlighting product features, textures, and craftsmanship. Technical precision with focus on product quality and specifications.',
        articles: 'Product Sample',
        deliverables: 'Macro Detail Shots, Feature Highlights, Technical Documentation',
        budget: 3000,
        category: 'Photography',
        icon: '🔍'
      },
      'social-content': {
        title: 'Social Media Content Package',
        method: 'Photo Box',
        priority: 'Medium',
        brief: 'Create engaging social media content with multiple angles, seasonal themes, and platform-optimized formats. Include stories, posts, and reel-ready content.',
        articles: 'Product Samples, Seasonal Props',
        deliverables: 'Social Media Posts, Stories, Reels, Instagram Content',
        budget: 2500,
        category: 'Social Media',
        icon: '📱'
      },
      'video-product': {
        title: 'Product Video Showcase',
        method: 'External Studio',
        priority: 'High',
        brief: 'Professional product video showcasing features, benefits, and usage scenarios. Include 360° rotation, close-ups, and lifestyle integration.',
        articles: 'Product Sample, Usage Props',
        deliverables: 'Product Video, 360° Video, Usage Demonstrations, Video Thumbnails',
        budget: 6500,
        category: 'Video',
        icon: '🎥'
      },
      'seasonal-campaign': {
        title: 'Seasonal Campaign Photography',
        method: 'Photographer',
        priority: 'Medium',
        brief: 'Seasonal themed photography for holiday marketing campaigns. Incorporate seasonal elements, colors, and themes relevant to current season.',
        articles: 'Product Samples, Seasonal Decorations',
        deliverables: 'Seasonal Photography, Holiday Marketing Assets, Themed Content',
        budget: 4500,
        category: 'Photography',
        icon: '🎄'
      },
      'packaging-shots': {
        title: 'Packaging & Unboxing Photography',
        method: 'Internal Studio',
        priority: 'Low',
        brief: 'Professional packaging photography and unboxing experience documentation. Focus on brand presentation and customer experience journey.',
        articles: 'Packaged Products, Unboxing Materials',
        deliverables: 'Packaging Photography, Unboxing Sequence, Brand Assets',
        budget: 1800,
        category: 'Photography',
        icon: '📦'
      },
      'comparison-grid': {
        title: 'Product Comparison Grid',
        method: 'Photo Box',
        priority: 'Low',
        brief: 'Systematic comparison photography for product variants, sizes, or competing products. Maintain consistent lighting and positioning for fair comparison.',
        articles: 'Product Variants/Competitors',
        deliverables: 'Comparison Grid, Size Charts, Feature Comparisons',
        budget: 1500,
        category: 'Photography',
        icon: '⚖️'
      },
      'influencer-kit': {
        title: 'Influencer Content Kit',
        method: 'Photographer',
        priority: 'Medium',
        brief: 'Content creation for influencer partnerships and brand collaborations. Include lifestyle shots, product styling, and social-ready formats.',
        articles: 'Product Samples, Lifestyle Props',
        deliverables: 'Influencer Photos, Social Content, Brand Guidelines',
        budget: 3500,
        category: 'Social Media',
        icon: '🤳'
      },
      'technical-specs': {
        title: 'Technical Specification Photography',
        method: 'Internal Studio',
        priority: 'Low',
        brief: 'Technical documentation photography for manuals, specifications, and professional documentation. Focus on clarity and instructional value.',
        articles: 'Product Sample, Technical Components',
        deliverables: 'Technical Photos, Instruction Images, Specification Documentation',
        budget: 1200,
        category: 'Documentation',
        icon: '📋'
      },
      'brand-storytelling': {
        title: 'Brand Storytelling Campaign',
        method: 'External Studio',
        priority: 'High',
        brief: 'Comprehensive brand storytelling through visual content. Showcase brand values, heritage, and emotional connection with premium artistic approach.',
        articles: 'Product Range, Brand Elements, Models',
        deliverables: 'Brand Photography, Storytelling Assets, Premium Content',
        budget: 12000,
        category: 'Branding',
        icon: '📖'
      }
    };

    // Update content title when switching views
    function updateContentTitle(title) {
      const contentTitle = document.getElementById('contentTitle');
      if (contentTitle) {
        contentTitle.textContent = title;
      }
    }

    function showView(viewName) {
      
      // Hide all views first
      const views = ['ordersView', 'samplesView', 'createOrderView', 'templatesView', 'workflowView', 'kanbanView', 'calendarView', 'dashboardView'];
      views.forEach(viewId => {
        const element = document.getElementById(viewId);
        if (element) {
          element.style.display = 'none';
          element.classList.remove('view-active');
        }
      });
      
      // Clear any filter info when switching views
      const mainContent = document.getElementById('mainContent');
      const existingFilter = mainContent?.querySelector('.filter-info');
      if (existingFilter) {
        existingFilter.remove();
      }
      
      // Show the target view and update content
      let targetView = null;
      if (viewName === 'dashboard') {
        targetView = document.getElementById('dashboardView');
        updateContentTitle('📊 Dashboard');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
          populateDashboardContent();
        }
      } else if (viewName === 'orders') {
        targetView = document.getElementById('ordersView');
        updateContentTitle('📋 Orders');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
          if (typeof drawOrderRows === 'function') drawOrderRows();
        }
      } else if (viewName === 'samples') {
        targetView = document.getElementById('samplesView');
        updateContentTitle('� Samples');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
          if (typeof drawSampleRows === 'function') drawSampleRows();
        }
      } else if (viewName === 'kanban') {
        targetView = document.getElementById('kanbanView');
        updateContentTitle('📊 Kanban Board');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
          if (typeof drawKanbanBoard === 'function') drawKanbanBoard();
        }
      } else if (viewName === 'calendar') {
        targetView = document.getElementById('calendarView');
        updateContentTitle('📅 Calendar View');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
          if (typeof drawCalendarView === 'function') drawCalendarView();
        }
      } else if (viewName === 'workflow') {
        targetView = document.getElementById('workflowView');
        updateContentTitle('🔄 Workflow');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
          if (typeof drawWorkflowView === 'function') drawWorkflowView();
        }
      } else if (viewName === 'create') {
        targetView = document.getElementById('createOrderView');
        updateContentTitle('➕ Create Order');
        if (targetView) {
          targetView.style.display = 'block';
          targetView.classList.add('view-active');
        }
      }
    }

    // Expose showView globally for onclick handlers
    window.showView = showView;

    // Function to populate dashboard content
    function populateDashboardContent() {
      if (!window.allOrders || !window.authSystem) {
        console.error('Dashboard: Required data not available');
        return;
      }

      const orders = window.authSystem.getFilteredOrders(window.allOrders);
      
      // Calculate stats
      const stats = {
        total: orders.length,
        complete: orders.filter(o => o.status === 'Complete' || o.status === 'Delivered').length,
        pending: orders.filter(o => o.status === 'Pending' || o.status === 'Draft').length,
        inProgress: orders.filter(o => o.status === 'In Progress').length,
        newRequests: orders.filter(o => o.status === 'New Request' || o.status === 'Draft').length
      };

      // Populate stats grid with process flow order
      const statsContainer = document.getElementById('dashboardStats');
      if (statsContainer) {
        statsContainer.innerHTML = `
          <!-- Process Flow Order -->
          <div onclick="filterOrdersByStatus('all')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #6b7280;" 
               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
            <div style="font-size: 24px; font-weight: bold; color: #6b7280; margin-bottom: 8px;">${stats.total}</div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">📋 All Orders</div>
          </div>
          
          <div onclick="filterOrdersByStatus('draft')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #94a3b8;" 
               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
            <div style="font-size: 24px; font-weight: bold; color: #94a3b8; margin-bottom: 8px;">${orders.filter(o => o.status === 'Draft' || o.status === 'New Request').length}</div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">📝 Draft</div>
          </div>
          
          <div onclick="filterOrdersByStatus('pending')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #f59e0b;" 
               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
            <div style="font-size: 24px; font-weight: bold; color: #f59e0b; margin-bottom: 8px;">${orders.filter(o => o.status === 'Pending Approval' || o.status === 'Pending').length}</div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">⏳ Pending</div>
          </div>
          
          <div onclick="filterOrdersByStatus('approved')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #06b6d4;" 
               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
            <div style="font-size: 24px; font-weight: bold; color: #06b6d4; margin-bottom: 8px;">${orders.filter(o => o.status === 'Approved').length}</div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">✅ Approved</div>
          </div>
          
          <div onclick="filterOrdersByStatus('samples')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #8b5cf6;" 
               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
            <div style="font-size: 24px; font-weight: bold; color: #8b5cf6; margin-bottom: 8px;">${orders.filter(o => o.status === 'Samples Requested' || o.status === 'Samples in Transit' || o.status === 'Samples Received').length}</div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">📦 Samples</div>
          </div>
          
          <div onclick="filterOrdersByStatus('In Progress')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #3b82f6;" 
               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
            <div style="font-size: 24px; font-weight: bold; color: #3b82f6; margin-bottom: 8px;">${stats.inProgress}</div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">🔄 In Progress</div>
          </div>
          
          <div onclick="filterOrdersByStatus('review')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #10b981;" 
               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
            <div style="font-size: 24px; font-weight: bold; color: #10b981; margin-bottom: 8px;">${orders.filter(o => o.status === 'Review').length}</div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">🔍 Review</div>
          </div>
          
          <div onclick="filterOrdersByStatus('completed')" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid #059669;" 
               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
            <div style="font-size: 24px; font-weight: bold; color: #059669; margin-bottom: 8px;">${stats.complete}</div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">🎉 Complete</div>
          </div>
        `;
      }

      // Populate recent orders
      const recentOrdersContainer = document.getElementById('recentOrdersContainer');
      if (recentOrdersContainer) {
        const recentOrders = orders.slice(0, 10); // Show latest 10 orders
        recentOrdersContainer.innerHTML = `
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Order #</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Title</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Status</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Priority</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 600; color: #374151; border-bottom: 1px solid #e5e7eb;">Deadline</th>
              </tr>
            </thead>
            <tbody>
              ${recentOrders.map(order => `
                <tr onclick="showOrderDetails('${order.orderNumber}')" style="cursor: pointer; border-bottom: 1px solid #f3f4f6;" onmouseover="this.style.backgroundColor='#f9fafb'" onmouseout="this.style.backgroundColor=''">
                  <td style="padding: 12px 16px; color: #374151;"><strong>${order.orderNumber}</strong></td>
                  <td style="padding: 12px 16px; color: #374151;">${order.title}</td>
                  <td style="padding: 12px 16px;"><span class="status ${order.status.replace(/\s+/g, '')}">${order.status}</span></td>
                  <td style="padding: 12px 16px;"><span class="status ${order.priority}">${order.priority}</span></td>
                  <td style="padding: 12px 16px; color: #374151;">${order.deadline}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
      
      // Update badge counts after populating dashboard
      if (window.updateQuickActionBadges) {
        window.updateQuickActionBadges();
      }
    }

    // Expose functions globally
    window.populateDashboardContent = populateDashboardContent;
    
    // Debug workflow button click
    console.log('Workflow functionality initialized');

    // Close all right-side modals
    function closeAllRightSideModals() {
      // Close create order modal
      const createModal = document.getElementById('leftSideCreateModal');
      if (createModal) {
        createModal.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          createModal.remove();
        }, 300);
      }

      // Close scan article modal
      const scanModal = document.getElementById('scanArticleRightModal');
      if (scanModal) {
        scanModal.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          scanModal.remove();
        }, 300);
      }

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    }

    // Show create order modal on the right side of sidebar
    function showCreateOrderLeftModal() {
      // Check if this modal is already open (toggle behavior)
      const existingModal = document.getElementById('leftSideCreateModal');
      if (existingModal) {
        closeCreateOrderLeftModal();
        return;
      }

      // Close any other open right-side modals
      closeAllRightSideModals();

      // Create right-side modal (positioned after sidebar)
      const modal = document.createElement('div');
      modal.id = 'leftSideCreateModal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 280px;
        width: 450px;
        height: 100vh;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 20px;
      `;

      // Get the create order form content from the existing view
      const existingCreateView = document.getElementById('createOrderView');
      modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
          <h3 style="margin: 0; font-size: 20px; color: #1f2937; font-weight: 600;">➕ Create New Photo Order</h3>
          <button onclick="closeCreateOrderLeftModal()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">×</button>
        </div>
        ${existingCreateView.innerHTML.replace('<h3 style="margin: 16px 0 8px; font-size: 18px; color: #1f2937;">➕ Create New Photo Order</h3>', '')}
      `;

      document.body.appendChild(modal);

      // Animate in
      setTimeout(() => {
        modal.style.transform = 'translateX(0)';
      }, 10);

      // Shift main content to the right to make space for modal
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '450px';
        mainContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }

    // Close the right-side create order modal
    function closeCreateOrderLeftModal() {
      const modal = document.getElementById('leftSideCreateModal');
      if (modal) {
        modal.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          modal.remove();
        }, 300);
      }

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }

      // Return to previous view (orders by default)
      showView('orders');
    }

    // Show scan article modal on the right side of sidebar
    function showScanArticleRightModal() {
      // Check if this modal is already open (toggle behavior)
      const existingModal = document.getElementById('scanArticleRightModal');
      if (existingModal) {
        closeScanArticleRightModal();
        return;
      }

      // Close any other open right-side modals
      closeAllRightSideModals();

      // Create right-side modal (positioned after sidebar)
      const modal = document.createElement('div');
      modal.id = 'scanArticleRightModal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 280px;
        width: 450px;
        height: 100vh;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 20px;
      `;

      modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
          <h3 style="margin: 0; font-size: 20px; color: #1f2937; font-weight: 600;">📷 Scan Article</h3>
          <button onclick="closeScanArticleRightModal()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">×</button>
        </div>
        
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 500; margin-bottom: 4px; color: #374151;">Article Name</label>
            <input id="scannedArticleName" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" 
                   placeholder="🔍 Scan or type article name...">
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 500; margin-bottom: 4px; color: #374151;">EAN Code</label>
            <input id="scannedEAN" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" 
                   placeholder="📊 Scan or type EAN barcode..." pattern="[0-9]{8,13}">
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-weight: 500; margin-bottom: 4px; color: #374151;">Notes</label>
            <textarea id="scanNotes" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; min-height: 80px; resize: vertical;" 
                      placeholder="📝 Additional notes about the scanned article..."></textarea>
          </div>
          
          <div style="display: flex; gap: 12px;">
            <button onclick="closeScanArticleRightModal()" style="flex: 1; padding: 12px 16px; border: 1px solid #d1d5db; background: white; border-radius: 6px; cursor: pointer; font-weight: 500;">Cancel</button>
            <button onclick="processScanFromModal()" style="flex: 1; padding: 12px 16px; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; box-shadow: 0 2px 4px rgba(5, 150, 105, 0.3);">Process Scan</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Add ESC key event listener
      const escKeyHandler = function(event) {
        if (event.key === 'Escape') {
          closeScanArticleRightModal();
        }
      };
      
      // Store the handler on the modal for later removal
      modal._escKeyHandler = escKeyHandler;
      document.addEventListener('keydown', escKeyHandler);

      // Animate in
      setTimeout(() => {
        modal.style.transform = 'translateX(0)';
      }, 10);

      // Shift main content to the right to make space for modal
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '450px';
        mainContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }

      // Focus on the first input
      setTimeout(() => {
        document.getElementById('scannedArticleName')?.focus();
      }, 300);
    }

    // Close the right-side scan article modal
    function closeScanArticleRightModal() {
      const modal = document.getElementById('scanArticleRightModal');
      if (modal) {
        // Remove ESC key event listener
        if (modal._escKeyHandler) {
          document.removeEventListener('keydown', modal._escKeyHandler);
        }
        
        modal.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          modal.remove();
        }, 300);
      }

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    }

    // Process scan from the modal
    function processScanFromModal() {
      const articleName = document.getElementById('scannedArticleName')?.value.trim();
      const eanCode = document.getElementById('scannedEAN')?.value.trim();
      const notes = document.getElementById('scanNotes')?.value.trim();

      if (!articleName && !eanCode) {
        alert('Please enter an article name or EAN code');
        return;
      }

      // Create scan result object
      const scanResult = {
        articleName: articleName || 'Unknown Article',
        eanCode: eanCode || 'N/A',
        notes: notes || '',
        timestamp: new Date().toISOString(),
        scannedBy: 'Current User'
      };

      // For now, just show the result (you can extend this to integrate with orders)
      alert(`Scan processed successfully!\n\nArticle: ${scanResult.articleName}\nEAN: ${scanResult.eanCode}\nTime: ${new Date(scanResult.timestamp).toLocaleString()}`);
      
      closeScanArticleRightModal();
    }

    // Expose functions globally
    window.showScanArticleRightModal = showScanArticleRightModal;
    window.closeScanArticleRightModal = closeScanArticleRightModal;
    window.processScanFromModal = processScanFromModal;
    window.closeAllRightSideModals = closeAllRightSideModals;

    // Expose functions globally
    window.showCreateOrderLeftModal = showCreateOrderLeftModal;
    window.closeCreateOrderLeftModal = closeCreateOrderLeftModal;

    // Show new order modal as large side panel
    function showNewOrderModal() {
      // Check if this modal is already open (toggle behavior)
      const existingModal = document.getElementById('newOrderRightModal');
      if (existingModal) {
        closeNewOrderModal();
        return;
      }

      // Close any other open right-side modals
      closeAllRightSideModals();

      // Create right-side modal (positioned after sidebar) - made larger for form fields
      const modal = document.createElement('div');
      modal.id = 'newOrderRightModal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 280px;
        width: 650px;
        height: 100vh;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 24px;
      `;

      modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #e5e7eb;">
          <h3 style="margin: 0; font-size: 22px; color: #1f2937; font-weight: 600;">➕ Create New Photo Order</h3>
          <button onclick="closeNewOrderModal()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">×</button>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 12px;">
          <form id="newOrderForm" onsubmit="handleNewOrderSubmit(event)">
            <div style="margin-bottom: 20px;">
              <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151; font-size: 14px;">Order Title</label>
              <input name="title" required style="width: 100%; padding: 14px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease;" 
                     placeholder="e.g., Premium Product Photography Session"
                     onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#d1d5db'">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
              <div>
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151; font-size: 14px;">Method</label>
                <select name="method" required style="width: 100%; padding: 14px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease;"
                        onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#d1d5db'">
                  <option value="">Select method...</option>
                  <option value="Photographer">Photographer</option>
                  <option value="Photo Box">Photo Box</option>
                  <option value="Internal Studio">Internal Studio</option>
                  <option value="External Studio">External Studio</option>
                </select>
                </div>
                <div>
                  <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151; font-size: 14px;">Priority</label>
                  <select name="priority" required style="width: 100%; padding: 14px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease;"
                          onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#d1d5db'">
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div>
                  <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151; font-size: 14px;">Deadline</label>
                  <input name="deadline" type="date" required style="width: 100%; padding: 14px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease;"
                         onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#d1d5db'">
                </div>
                <div>
                  <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151; font-size: 14px;">Budget (SEK)</label>
                  <input name="budget" type="number" min="0" style="width: 100%; padding: 14px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease;" placeholder="0"
                         onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#d1d5db'">
                </div>
              </div>

              <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151; font-size: 14px;">Assign To</label>
                <select name="photographer" style="width: 100%; padding: 14px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 16px; transition: border-color 0.2s ease;"
                        onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#d1d5db'">
                <option value="">Select photographer/photo box...</option>
                <option value="Mike Rodriguez">Mike Rodriguez (Photographer)</option>
                <option value="Sarah Johnson">Sarah Johnson (Photographer)</option>
                <option value="Emily Chen">Emily Chen (Photographer)</option>
                <option value="Alex Turner">Alex Turner (Photo Box)</option>
              </select>
              </div>

              <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151; font-size: 14px;">Brief Description</label>
                <textarea name="brief" required rows="3" style="width: 100%; padding: 14px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 16px; resize: vertical; transition: border-color 0.2s ease;" 
                          placeholder="Provide detailed instructions for the content creation..."
                          onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#d1d5db'"></textarea>
              </div>

              <div style="margin-bottom: 24px;">
                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #374151; font-size: 14px;">Articles</label>
                <textarea id="newOrderArticles" name="articles" required rows="2" style="width: 100%; padding: 14px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 16px; resize: vertical; transition: border-color 0.2s ease;" 
                          placeholder="Articles with EAN codes will appear here...&#10;Format: Article Name [EAN: 1234567890123]"
                          onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#d1d5db'"></textarea>
              </div>

            <div style="display: flex; gap: 12px;">
              <button type="button" onclick="closeNewOrderModal()" style="flex: 1; padding: 12px 16px; border: 1px solid #d1d5db; background: white; border-radius: 6px; cursor: pointer; font-weight: 500;">Cancel</button>
              <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button type="button" onclick="closeNewOrderModal()" style="padding: 14px 24px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s ease;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">Cancel</button>
                <button type="submit" style="padding: 14px 24px; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3); transition: all 0.2s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Add ESC key event listener
      const escKeyHandler = function(event) {
        if (event.key === 'Escape') {
          closeNewOrderModal();
        }
      };
      
      // Store the handler on the modal for later removal
      modal._escKeyHandler = escKeyHandler;
      document.addEventListener('keydown', escKeyHandler);

      // Animate in
      setTimeout(() => {
        modal.style.transform = 'translateX(0)';
      }, 10);

      // Shift main content to the right to make space for the larger modal
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '650px';
        mainContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }

      // Focus on the first input
      setTimeout(() => {
        document.querySelector('#newOrderForm input[name="title"]')?.focus();
      }, 300);
    }

    // Close the new order modal
    function closeNewOrderModal() {
      const modal = document.getElementById('newOrderRightModal');
      
      if (modal) {
        // Remove ESC key event listener
        if (modal._escKeyHandler) {
          document.removeEventListener('keydown', modal._escKeyHandler);
        }
        
        // Animate out
        modal.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
          modal.remove();
        }, 300);
      }

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    }

    // Handle new order form submission
    function handleNewOrderSubmit(event) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const currentUser = authSystem.getCurrentUser();

      // Generate order number
      const orderNumber = 'ORD-' + Date.now();

      // Create new order object
      const newOrder = {
        orderNumber: orderNumber,
        title: formData.get('title'),
        method: formData.get('method'),
        priority: formData.get('priority'),
        deadline: formData.get('deadline'),
        budget: formData.get('budget') ? parseFloat(formData.get('budget')) : null,
        photographer: formData.get('photographer') || null,
        brief: formData.get('brief'),
        articles: formData.get('articles').split('\n').filter(line => line.trim()),
        status: 'Draft',
        createdBy: currentUser.name,
        createdDate: new Date().toLocaleDateString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        deliverables: ['Product Photos', 'High-Resolution Images']
      };

      // Add to orders array
      allOrders.push(newOrder);

      // Save to localStorage
      localStorage.setItem('photoOrders', JSON.stringify(allOrders));

      // Show success message
      alert(`✅ Order "${newOrder.title}" created successfully!\n\nOrder Number: ${orderNumber}`);

      // Close modal
      closeNewOrderModal();

      // Refresh the orders view
      if (currentView === 'orders' || currentView === 'dashboard') {
        drawOrderRows();
      }
    }

    // Expose functions globally
    window.showNewOrderModal = showNewOrderModal;
    window.closeNewOrderModal = closeNewOrderModal;
    window.handleNewOrderSubmit = handleNewOrderSubmit;

    // Show orders modal on the right side of sidebar
    function showOrdersModal() {
      // Check if this modal is already open (toggle behavior)
      const existingModal = document.getElementById('ordersRightModal');
      if (existingModal) {
        closeOrdersModal();
        return;
      }

      // Close any other open right-side modals
      closeAllRightSideModals();

      // Create right-side modal (positioned after sidebar)
      const modal = document.createElement('div');
      modal.id = 'ordersRightModal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 280px;
        width: 800px;
        height: 100vh;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 20px;
      `;

      // Get orders data
      const orders = authSystem.getFilteredOrders(allOrders);
      const searchBox = document.getElementById('searchBox');
      const term = searchBox?.value.toLowerCase() || '';
      const filtered = orders.filter(o =>
        !term ||
        o.orderNumber.toLowerCase().includes(term) ||
        o.title.toLowerCase().includes(term) ||
        o.photographer.toLowerCase().includes(term) ||
        o.status.toLowerCase().includes(term)
      );

      modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
          <h3 style="margin: 0; font-size: 20px; color: #1f2937; font-weight: 600;">📋 All Orders (${filtered.length})</h3>
          <button onclick="closeOrdersModal()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">×</button>
        </div>

        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <div style="margin-bottom: 12px;">
            <input type="text" id="modalSearchBox" placeholder="🔍 Search orders..." style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" value="${term}">
          </div>
        </div>

        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; max-height: calc(100vh - 200px); overflow-y: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f1f5f9; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; font-size: 12px;">Order #</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; font-size: 12px;">Title</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; font-size: 12px;">Status</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; font-size: 12px;">Priority</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; font-size: 12px;">Deadline</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151; font-size: 12px;">Progress</th>
              </tr>
            </thead>
            <tbody id="modalOrdersBody">
              ${filtered.map(o => {
                const progress = calculateProgress(o.status);
                const isOverdue = new Date(o.deadline) < new Date() && o.status !== 'Complete' && o.status !== 'Delivered';
                const deadlineStyle = isOverdue ? 'color: #dc2626; font-weight: bold;' : '';
                const commentCount = (o.comments || []).length;

                return `
                <tr onclick="showOrderDetails('${o.orderNumber}'); closeOrdersModal();" style="cursor: pointer; border-bottom: 1px solid #e5e7eb; hover: background: #f9fafb;">
                  <td style="padding: 12px; font-weight: 600; color: #1f2937;">${o.orderNumber}</td>
                  <td style="padding: 12px; color: #374151;">${o.title}</td>
                  <td style="padding: 12px;"><span class="status ${o.status.replace(/\s+/g, '')}" style="font-size: 12px;">${o.status}</span></td>
                  <td style="padding: 12px;"><span class="status ${o.priority}" style="font-size: 12px;">${o.priority}</span></td>
                  <td style="padding: 12px; ${deadlineStyle}">${o.deadline}${isOverdue ? ' ⚠️' : ''}</td>
                  <td style="padding: 12px;">
                    <div class="progress-bar" style="width: 60px; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
                      <div class="progress-fill" style="width: ${progress}%; height: 100%; background: ${progress === 100 ? '#10b981' : '#3b82f6'}; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">${progress}%</div>
                  </td>
                </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          ${filtered.length === 0 ? '<div style="text-align: center; color: #6b7280; padding: 40px; font-style: italic;">No orders found matching your search.</div>' : ''}
        </div>
      `;

      document.body.appendChild(modal);

      // Animate in
      setTimeout(() => {
        modal.style.transform = 'translateX(0)';
      }, 10);

      // Shift main content to the right to make space for modal
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '800px';
        mainContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }

      // Add search functionality
      setTimeout(() => {
        const modalSearchBox = document.getElementById('modalSearchBox');
        if (modalSearchBox) {
          modalSearchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#modalOrdersBody tr');

            rows.forEach(row => {
              const text = row.textContent.toLowerCase();
              row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
          });
        }
      }, 100);
    }

    // Close the orders modal
    function closeOrdersModal() {
      const modal = document.getElementById('ordersRightModal');
      if (modal) {
        modal.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          modal.remove();
        }, 300);
      }

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    }

    // Show dashboard modal on the right side of sidebar
    function showDashboardModal() {
      // Check if this modal is already open (toggle behavior)
      const existingModal = document.getElementById('dashboardRightModal');
      if (existingModal) {
        closeDashboardModal();
        return;
      }

      // Close any other open right-side modals
      closeAllRightSideModals();

      // Create right-side modal (positioned after sidebar)
      const modal = document.createElement('div');
      modal.id = 'dashboardRightModal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 280px;
        width: 700px;
        height: 100vh;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 20px;
      `;

      // Get dashboard data
      const orders = authSystem.getFilteredOrders(allOrders);
      const totalOrders = orders.length;
      const newOrders = orders.filter(o => o.status === 'New Request' || o.status === 'Draft').length;
      const inProgressOrders = orders.filter(o => o.status === 'In Progress').length;
      const completedOrders = orders.filter(o => o.status === 'Complete' || o.status === 'Delivered').length;
      const overdueOrders = orders.filter(o => new Date(o.deadline) < new Date() && o.status !== 'Complete' && o.status !== 'Delivered').length;

      modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
          <h3 style="margin: 0; font-size: 20px; color: #1f2937; font-weight: 600;">📊 Dashboard Overview</h3>
          <button onclick="closeDashboardModal()" style="background: #ef4444; color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">×</button>
        </div>

        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 16px; font-size: 16px; color: #1f2937;">📈 Key Metrics</h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <div style="font-size: 24px; font-weight: bold; color: #1f2937;">${totalOrders}</div>
              <div style="font-size: 12px; color: #6b7280;">Total Orders</div>
            </div>
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <div style="font-size: 24px; font-weight: bold; color: #1f2937;">${newOrders}</div>
              <div style="font-size: 12px; color: #6b7280;">New Orders</div>
            </div>
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
              <div style="font-size: 24px; font-weight: bold; color: #1f2937;">${inProgressOrders}</div>
              <div style="font-size: 12px; color: #6b7280;">In Progress</div>
            </div>
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981;">
              <div style="font-size: 24px; font-weight: bold; color: #1f2937;">${completedOrders}</div>
              <div style="font-size: 12px; color: #6b7280;">Completed</div>
            </div>
          </div>

          ${overdueOrders > 0 ? `
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; margin-top: 16px;">
              <div style="font-size: 14px; color: #dc2626; font-weight: 600;">⚠️ ${overdueOrders} orders are overdue</div>
            </div>
          ` : ''}
        </div>

        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 16px; font-size: 16px; color: #1f2937;">🔥 Recent Activity</h4>
          <div style="max-height: 300px; overflow-y: auto;">
            ${orders.slice(0, 10).map(o => {
              const progress = calculateProgress(o.status);
              const isOverdue = new Date(o.deadline) < new Date() && o.status !== 'Complete' && o.status !== 'Delivered';

              return `
                <div onclick="showOrderDetails('${o.orderNumber}'); closeDashboardModal();" style="background: white; padding: 12px; border-radius: 6px; margin-bottom: 8px; cursor: pointer; border-left: 4px solid ${getStatusColor(o.status)}; hover: background: #f9fafb;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <div style="font-weight: 600; color: #1f2937; font-size: 14px;">${o.orderNumber}</div>
                    <span class="status ${o.status.replace(/\s+/g, '')}" style="font-size: 11px;">${o.status}</span>
                  </div>
                  <div style="color: #6b7280; font-size: 12px; margin-bottom: 4px;">${o.title}</div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 11px; color: #9ca3af;">${o.deadline}</div>
                    <div style="font-size: 11px; color: #6b7280;">${progress}% complete</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="background: #f8fafc; padding: 16px; border-radius: 8px;">
          <h4 style="margin: 0 0 16px; font-size: 16px; color: #1f2937;">⚡ Quick Actions</h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
            <button onclick="showNewOrderModal(); closeDashboardModal();" style="padding: 12px; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; text-align: center;">
              ➕ New Order
            </button>
            <button onclick="showView('orders'); closeDashboardModal();" style="padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; text-align: center;">
              📋 View All Orders
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Animate in
      setTimeout(() => {
        modal.style.transform = 'translateX(0)';
      }, 10);

      // Shift main content to the right to make space for modal
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '700px';
        mainContent.style.transition = 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }

    // Close the dashboard modal
    function closeDashboardModal() {
      const modal = document.getElementById('dashboardRightModal');
      if (modal) {
        modal.style.transform = 'translateX(-100%)';
        setTimeout(() => {
          modal.remove();
        }, 300);
      }

      // Reset main content position
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    }

    // Expose functions globally
    window.showOrdersModal = showOrdersModal;
    window.closeOrdersModal = closeOrdersModal;
    window.showDashboardModal = showDashboardModal;
    window.closeDashboardModal = closeDashboardModal;

    // Show order details function
    function showOrderDetails(orderNumber) {
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      if (!order) {
        alert('Order not found: ' + orderNumber);
        return;
      }
      
      const currentUser = authSystem.getCurrentUser();
      const canManageOrders = authSystem.canManageOrders();
      const canAssignWork = authSystem.canAssignWork();
      
      // Available status options for progression
      const statusOptions = [
        'Draft',
        'New Request', 
        'Samples Requested',
        'In Progress',
        'Approved',
        'Complete',
        'Delivered'
      ];
      
      // Available team members for assignment
      const teamMembers = [
        'Unassigned',
        'Alice Johnson',
        'Bob Smith', 
        'Charlie Brown',
        'Diana Prince',
        'Eva Martinez',
        'Frank Wilson',
        'Grace Lee'
      ];
      
      const modal = document.createElement('div');
      modal.className = 'order-details-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:32px;max-width:700px;width:95%;max-height:85vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h2 style="margin:0;font-size:24px;color:#1f2937;">📋 Order Details</h2>
            <button onclick="this.closest('.order-details-modal').remove()" style="background:none;border:none;font-size:28px;cursor:pointer;color:#6b7280;">×</button>
          </div>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">
            <!-- Left Column - Order Info -->
            <div>
              <div style="margin-bottom:16px;"><strong>Order Number:</strong> ${order.orderNumber}</div>
              <div style="margin-bottom:16px;"><strong>Title:</strong> ${order.title}</div>
              <div style="margin-bottom:16px;"><strong>Created By:</strong> ${order.createdBy}</div>
              <div style="margin-bottom:16px;"><strong>Created Date:</strong> ${order.createdDate}</div>
              <div style="margin-bottom:16px;"><strong>Deadline:</strong> ${order.deadline}</div>
              <div style="margin-bottom:16px;"><strong>Priority:</strong> <span class="status ${order.priority}">${order.priority}</span></div>
              ${order.budget ? `<div style="margin-bottom:16px;"><strong>Budget:</strong> ${order.budget}</div>` : ''}
            </div>
            
            <!-- Right Column - Status & Assignment Management -->
            <div style="background:#f8fafc;padding:16px;border-radius:8px;">
              <h3 style="margin:0 0 16px;font-size:16px;color:#1f2937;">📊 Workflow Management</h3>
              
              <!-- Current Status -->
              <div style="margin-bottom:16px;">
                <strong>Current Status:</strong>
                <div style="margin-top:4px;">
                  <span class="status ${order.status.replace(/\\s+/g, '')}" style="font-size:14px;">${order.status}</span>
                </div>
              </div>
              
              ${canManageOrders ? `
                <!-- Status Change -->
                <div style="margin-bottom:16px;">
                  <strong>Update Status:</strong>
                  <select id="statusSelect_${orderNumber}" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;margin-top:4px;">
                    ${statusOptions.map(status => 
                      `<option value="${status}" ${status === order.status ? 'selected' : ''}>${status}</option>`
                    ).join('')}
                  </select>
                </div>
              ` : ''}
              
              <!-- Current Assignment -->
              <div style="margin-bottom:16px;">
                <strong>Assigned To:</strong>
                <div style="margin-top:4px;color:#6b7280;">
                  ${order.photographer || 'Unassigned'}
                </div>
              </div>
              
              ${canAssignWork ? `
                <!-- Assignment Change -->
                <div style="margin-bottom:16px;">
                  <strong>Reassign To:</strong>
                  <select id="assignSelect_${orderNumber}" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;margin-top:4px;">
                    ${teamMembers.map(member => 
                      `<option value="${member}" ${(member === order.photographer || (member === 'Unassigned' && !order.photographer)) ? 'selected' : ''}>${member}</option>`
                    ).join('')}
                  </select>
                </div>
              ` : ''}
              
              ${(canManageOrders || canAssignWork) ? `
                <button onclick="updateOrderWorkflow('${orderNumber}')" 
                        style="width:100%;background:#2563eb;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:600;margin-top:8px;">
                  💾 Update Workflow
                </button>
              ` : ''}
            </div>
          </div>
          
          <!-- Order Details -->
          <div style="space-y:16px;">
            ${order.brief ? `<div><strong>Brief:</strong><br><div style="margin-top:8px;padding:12px;background:#f8fafc;border-radius:6px;">${order.brief}</div></div>` : ''}
            ${order.articles ? `<div><strong>Articles:</strong><br><div style="margin-top:8px;padding:12px;background:#f8fafc;border-radius:6px;">${order.articles}</div></div>` : ''}
            ${order.deliverables ? `<div><strong>Deliverables:</strong><br><div style="margin-top:8px;padding:12px;background:#f8fafc;border-radius:6px;">${order.deliverables}</div></div>` : ''}
          </div>
          
          <!-- Action Buttons -->
          <div style="margin-top:24px;display:flex;gap:12px;justify-content:flex-end;">
            ${canManageOrders ? `
              <button onclick="showOrderHistory('${orderNumber}')" 
                      style="background:#6b7280;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;">
                📜 View History
              </button>
            ` : ''}
            <button onclick="this.closest('.order-details-modal').remove()" 
                    style="background:#6b7280;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;">
              Close
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }
    
    // Assign to window immediately after definition
    window.showOrderDetails = showOrderDetails;
    
    // Function to update order workflow (status and assignment)
    function updateOrderWorkflow(orderNumber) {
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      if (!order) {
        alert('Order not found!');
        return;
      }
      
      const statusSelect = document.getElementById(`statusSelect_${orderNumber}`);
      const assignSelect = document.getElementById(`assignSelect_${orderNumber}`);
      const currentUser = authSystem.getCurrentUser();
      
      let updated = false;
      let changes = [];
      
      // Update status if changed and user has permission
      if (statusSelect && authSystem.canManageOrders()) {
        const newStatus = statusSelect.value;
        if (newStatus !== order.status) {
          order.status = newStatus;
          changes.push(`Status: ${newStatus}`);
          updated = true;
        }
      }
      
      // Update assignment if changed and user has permission
      if (assignSelect && authSystem.canAssignWork()) {
        const newAssignment = assignSelect.value === 'Unassigned' ? null : assignSelect.value;
        if (newAssignment !== order.photographer) {
          order.photographer = newAssignment;
          changes.push(`Assigned to: ${newAssignment || 'Unassigned'}`);
          updated = true;
        }
      }
      
      if (updated) {
        // Add to order history
        if (!order.history) order.history = [];
        order.history.push({
          timestamp: new Date().toLocaleString(),
          user: currentUser.name,
          action: 'Workflow Update',
          changes: changes,
          details: `Updated: ${changes.join(', ')}`
        });
        
        // Save to localStorage
        localStorage.setItem('photoOrders', JSON.stringify(allOrders));
        
        // Show success message
        alert(`✅ Order ${orderNumber} updated successfully!\n\nChanges made:\n• ${changes.join('\n• ')}`);
        
        // Refresh the views
        drawOrderRows();
        drawWorkflowView();
        
        // Close and reopen the modal to show updated info
        document.querySelector('.order-details-modal')?.remove();
        setTimeout(() => showOrderDetails(orderNumber), 300);
        
      } else {
        alert('ℹ️ No changes detected.');
      }
    }
    
    // Function to show order history
    function showOrderHistory(orderNumber) {
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      if (!order || !order.history) {
        alert('No history available for this order.');
        return;
      }
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:1001';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:600px;width:90%;max-height:70vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h3 style="margin:0;color:#1f2937;">📜 Order History - ${orderNumber}</h3>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                    style="background:none;border:none;font-size:24px;cursor:pointer;color:#6b7280;">×</button>
          </div>
          <div style="space-y:12px;">
            ${order.history.slice().reverse().map(entry => `
              <div style="border-left:4px solid #3b82f6;padding-left:16px;margin-bottom:16px;">
                <div style="font-weight:600;color:#1f2937;margin-bottom:4px;">${entry.action}</div>
                <div style="color:#6b7280;font-size:13px;margin-bottom:4px;">${entry.timestamp} • ${entry.user}</div>
                <div style="color:#374151;font-size:14px;">${entry.details}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }
    
    // Initialize order history for existing orders
    function initializeOrderHistory() {
      allOrders.forEach(order => {
        if (!order.history) {
          order.history = [{
            timestamp: order.createdDate || new Date().toLocaleString(),
            user: order.createdBy || 'System',
            action: 'Order Created',
            changes: ['Order created'],
            details: `Initial order creation with status: ${order.status}`
          }];
        }
      });
      localStorage.setItem('photoOrders', JSON.stringify(allOrders));
    }
    
    // Initialize on load
    initializeOrderHistory();

    // Drag and Drop functionality for workflow kanban
    let draggedOrderNumber = null;
    
    function handleDragStart(event, orderNumber) {
      draggedOrderNumber = orderNumber;
      event.dataTransfer.effectAllowed = 'move';
      event.target.style.opacity = '0.5';
    }
    
    function handleDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      event.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    }
    
    function handleDrop(event, newStatus) {
      event.preventDefault();
      event.currentTarget.style.backgroundColor = '';
      
      if (!draggedOrderNumber) return;
      
      const currentUser = authSystem.getCurrentUser();
      if (!authSystem.canManageOrders()) {
        alert('❌ You do not have permission to change order status.');
        resetDragState();
        return;
      }
      
      const order = allOrders.find(o => o.orderNumber === draggedOrderNumber);
      if (!order) {
        resetDragState();
        return;
      }
      
      if (order.status === newStatus) {
        resetDragState();
        return;
      }
      
      // Update order status
      const oldStatus = order.status;
      order.status = newStatus;
      
      // Add to history
      if (!order.history) order.history = [];
      order.history.push({
        timestamp: new Date().toLocaleString(),
        user: currentUser.name,
        action: 'Status Changed (Drag & Drop)',
        changes: [`Status: ${oldStatus} → ${newStatus}`],
        details: `Status changed from "${oldStatus}" to "${newStatus}" via drag and drop`
      });
      
      // Save changes
      localStorage.setItem('photoOrders', JSON.stringify(allOrders));
      
      // Refresh views
      drawWorkflowView();
      drawOrderRows();
      
      // Show success notification
      showNotification(`✅ Order ${draggedOrderNumber} moved to ${newStatus}`, 'success');
      
      resetDragState();
    }
    
    function resetDragState() {
      if (draggedOrderNumber) {
        const draggedElement = document.querySelector(`[data-order="${draggedOrderNumber}"]`);
        if (draggedElement) {
          draggedElement.style.opacity = '1';
        }
      }
      draggedOrderNumber = null;
      
      // Remove highlight from all columns
      document.querySelectorAll('.kanban-column').forEach(col => {
        col.style.backgroundColor = '';
      });
    }
    
    // Add notification system
    function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 'background: #3b82f6;'}
      `;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
      }, 100);
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
    
    // Expose functions globally
    window.handleDragStart = handleDragStart;
    window.handleDragOver = handleDragOver;
    window.handleDrop = handleDrop;

    // Expose functions globally
    window.updateOrderWorkflow = updateOrderWorkflow;
    window.showOrderHistory = showOrderHistory;

    function drawOrderRows() {
      const tbody = document.getElementById('ordersBody');
      const searchBox = document.getElementById('searchBox');
      
      if (!window.allOrders) {
        return;
      }
      
      if (!window.authSystem) {
        return;
      }
      
      const orders = window.authSystem.getFilteredOrders(window.allOrders);
      const term = searchBox?.value.toLowerCase() || '';
      const filtered = orders.filter(o => 
        !term || 
        o.orderNumber.toLowerCase().includes(term) ||
        o.title.toLowerCase().includes(term) ||
        o.photographer.toLowerCase().includes(term) ||
        o.status.toLowerCase().includes(term)
      );
      
      if (tbody) {
        tbody.innerHTML = filtered.map(o => {
          const progress = window.calculateProgress(o.status);
          const isOverdue = new Date(o.deadline) < new Date() && o.status !== 'Complete' && o.status !== 'Delivered';
          const deadlineStyle = isOverdue ? 'color: #dc2626; font-weight: bold;' : '';
          const commentCount = (o.comments || []).length;
          const unreadComments = window.commentSystem ? window.commentSystem.getUnreadCommentCount(o.orderNumber) : 0;
          
          return `
          <tr onclick="showOrderDetails('${o.orderNumber}')" style="cursor: pointer; color: #374151 !important;" class="${window.selectedItems && window.selectedItems.has(o.orderNumber) ? 'selected-row' : ''}">
            <td class="bulk-checkbox" style="display: none;"><input type="checkbox" class="item-checkbox" data-id="${o.orderNumber}" onclick="event.stopPropagation()"></td>
            <td style="color: #374151 !important;"><strong>${o.orderNumber}</strong></td>
            <td style="color: #374151 !important;">${o.title}</td>
            <td><span class="status ${o.status.replace(/\s+/g, '')}">${o.status}</span></td>
            <td style="color: #374151 !important;">${o.method}</td>
            <td style="color: #374151 !important;">${o.purchaseGroup || 'N/A'}</td>
            <td style="color: #374151 !important;">${o.eventId || 'N/A'}</td>
            <td style="color: #374151 !important;">${o.photographer}</td>
            <td><span class="status ${o.priority}">${o.priority}</span></td>
            <td style="${deadlineStyle}; color: #374151 !important;">${o.deadline}${isOverdue ? ' ⚠️' : ''}</td>
            <td style="color: #374151 !important;">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
              </div>
              <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">${progress}%</div>
            </td>
            <td style="text-align: center; color: #374151 !important;">
              <button onclick="event.stopPropagation(); window.commentSystem && window.commentSystem.showCommentsModal('${o.orderNumber}')" 
                style="background: ${commentCount > 0 ? '#3b82f6' : '#6b7280'}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; position: relative;">
                💬 ${commentCount}
                ${unreadComments > 0 ? `<span style="position: absolute; top: -4px; right: -4px; background: #ef4444; color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: center;">${unreadComments}</span>` : ''}
              </button>
            </td>
          </tr>`;
        }).join('');
      }
      
      if (typeof updateBulkActionsPanel === 'function') {
        updateBulkActionsPanel();
      }
      
      // Update filter tile counts
      if (typeof updateFilterTileCounts === 'function') {
        updateFilterTileCounts();
      }
    }

    // Kanban Board Functions
    function drawKanbanBoard() {
      const currentUser = authSystem.getCurrentUser();
      const orders = authSystem.getFilteredOrders(allOrders);
      const board = document.getElementById('kanbanBoard');
      
      // Add visible debug info
      if (!currentUser) {
        board.innerHTML = '<div style="color: red; padding: 20px;">ERROR: No current user found</div>';
        return;
      }
      
      if (!orders || orders.length === 0) {
        board.innerHTML = '<div style="color: red; padding: 20px;">ERROR: No orders found. Total orders: ' + (allOrders ? allOrders.length : 'undefined') + '</div>';
        return;
      }
      
      const statuses = [
        { name: 'Draft', color: '#6b7280', icon: '📝' },
        { name: 'Pending Approval', color: '#f59e0b', icon: '⏳' },
        { name: 'Approved', color: '#3b82f6', icon: '✅' },
        { name: 'Samples Requested', color: '#8b5cf6', icon: '📦' },
        { name: 'In Progress', color: '#0ea5e9', icon: '🔄' },
        { name: 'Review', color: '#f97316', icon: '👀' },
        { name: 'Complete', color: '#10b981', icon: '🎉' },
        { name: 'Delivered', color: '#059669', icon: '🚚' }
      ];

      board.innerHTML = statuses.map(status => {
        const statusOrders = orders.filter(o => o.status === status.name);
        
        return `
          <div class="kanban-column" data-status="${status.name}" 
               style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; min-height: 400px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid ${status.color};">
              <h4 style="margin: 0; color: #374151; font-size: 14px; font-weight: 600;">
                ${status.icon} ${status.name}
              </h4>
              <span style="background: ${status.color}; color: white; border-radius: 12px; padding: 2px 8px; font-size: 12px; font-weight: 600;">
                ${statusOrders.length}
              </span>
            </div>
            <div class="kanban-items" style="display: flex; flex-direction: column; gap: 12px;">
              ${statusOrders.length === 0 ? 
                `<div style="text-align: center; color: #9ca3af; font-style: italic; padding: 20px;">No orders</div>` :
                statusOrders.map(order => `
                <div class="kanban-card" draggable="true" data-order-id="${order.orderNumber}"
                     style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; cursor: move; transition: all 0.15s;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);"
                     onmouseover="this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'; this.style.transform='translateY(-2px)';"
                     onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'; this.style.transform='translateY(0)';"
                     onclick="showOrderDetails('${order.orderNumber}'); event.stopPropagation();">
                  <div style="font-weight: 600; color: #374151; font-size: 12px; margin-bottom: 4px;">
                    ${order.orderNumber}
                    ${order.uploadedContent && order.uploadedContent.length > 0 ? 
                      `<span style="background: #10b981; color: white; padding: 1px 4px; border-radius: 3px; font-size: 9px; margin-left: 4px;">📁 ${order.uploadedContent.length}</span>` : 
                      ''
                    }
                  </div>
                  <div style="color: #1f2937; font-size: 13px; font-weight: 500; margin-bottom: 8px; line-height: 1.3;">${order.title}</div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="background: ${getPriorityColor(order.priority)}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
                      ${order.priority}
                    </span>
                    <span style="color: #6b7280; font-size: 11px;">${order.deadline}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #6b7280; font-size: 11px;">${order.photographer}</span>
                    <span style="color: #6b7280; font-size: 11px;">${order.method}</span>
                  </div>
                  ${authSystem.canEditOrder(order) ? 
                    '<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #f3f4f6; font-size: 10px; color: #9ca3af;">Drag to update status</div>' : 
                    '<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #f3f4f6; font-size: 10px; color: #9ca3af;">View only</div>'
                  }
                </div>
              `).join('')
              }
            </div>
          </div>
        `;
      }).join('');

      // Add drag and drop functionality
      setupKanbanDragDrop();
    }

    function setupKanbanDragDrop() {
      let draggedElement = null;
      let isDragging = false;

      // Add drag event listeners to cards
      document.querySelectorAll('.kanban-card').forEach(card => {
        card.addEventListener('dragstart', function(e) {
          if (!authSystem.canEditOrder(allOrders.find(o => o.orderNumber === this.dataset.orderId))) {
            e.preventDefault();
            return;
          }
          isDragging = true;
          draggedElement = this;
          this.style.opacity = '0.5';
        });

        card.addEventListener('dragend', function(e) {
          this.style.opacity = '1';
          draggedElement = null;
          // Reset dragging flag after a short delay to allow click events
          setTimeout(() => { isDragging = false; }, 100);
        });

        // Prevent click event when dragging
        card.addEventListener('click', function(e) {
          if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        });
      });

      // Add drop event listeners to columns
      document.querySelectorAll('.kanban-column').forEach(column => {
        column.addEventListener('dragover', function(e) {
          e.preventDefault();
          this.style.background = '#f0f9ff';
        });

        column.addEventListener('dragleave', function(e) {
          this.style.background = '#f8fafc';
        });

        column.addEventListener('drop', function(e) {
          e.preventDefault();
          this.style.background = '#f8fafc';
          
          if (draggedElement) {
            const orderId = draggedElement.dataset.orderId;
            const newStatus = this.dataset.status;
            const order = allOrders.find(o => o.orderNumber === orderId);
            
            if (order && authSystem.canEditOrder(order)) {
              order.status = newStatus;
              order.updatedAt = new Date().toISOString();
              
              // Trigger confetti if order is moved to Complete
              if (newStatus === 'Complete') {
                triggerConfetti();
              }
              
              // Show success message
              showToast(`Order ${orderId} moved to ${newStatus}`, 'success');
              
              // Refresh kanban board
              drawKanbanBoard();
            }
          }
        });
      });
    }

    // Calendar Functions
    function drawCalendarView() {
      updateCalendarTitle();
      
      const container = document.getElementById('calendarContainer');
      const currentUser = authSystem.getCurrentUser();
      const orders = authSystem.getFilteredOrders(allOrders);
      
      if (calendarViewType === 'week') {
        drawWeekView(container, orders);
      } else if (calendarViewType === 'month') {
        drawMonthView(container, orders);
      } else if (calendarViewType === 'year') {
        drawYearView(container, orders);
      }
    }

    function updateCalendarTitle() {
      const title = document.getElementById('calendarTitle');
      if (!title) return;

      if (calendarViewType === 'week') {
        const weekStart = getWeekStart(calendarDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        title.textContent = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
      } else if (calendarViewType === 'month') {
        title.textContent = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      } else if (calendarViewType === 'year') {
        title.textContent = calendarDate.getFullYear().toString();
      }
    }

    function drawWeekView(container, orders) {
      const weekStart = getWeekStart(calendarDate);
      const days = [];
      
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        days.push(day);
      }

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); border-bottom: 1px solid #e5e7eb;">
          ${days.map(day => `
            <div style="padding: 12px 8px; background: #f9fafb; border-right: 1px solid #e5e7eb; text-align: center; font-weight: 600; color: #374151;">
              <div style="font-size: 12px; color: #6b7280;">${day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div style="font-size: 16px; ${isToday(day) ? 'color: #3b82f6; font-weight: 700;' : ''}">${day.getDate()}</div>
            </div>
          `).join('')}
        </div>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); min-height: 400px;">
          ${days.map(day => {
            const dayOrders = getOrdersForDate(orders, day);
            return `
              <div style="border-right: 1px solid #e5e7eb; padding: 8px; background: ${isToday(day) ? '#f0f9ff' : 'white'};">
                ${dayOrders.map(order => `
                  <div style="background: ${getStatusColor(order.status)}; color: white; padding: 4px 6px; border-radius: 4px; margin-bottom: 4px; font-size: 11px; cursor: pointer;"
                       onclick="showOrderDetails('${order.orderNumber}')"
                       title="Order: ${order.title}&#10;Deadline: ${order.deadline}&#10;Status: ${order.status}&#10;Click to view details">
                    ${order.orderNumber}
                    ${order.uploadedContent && order.uploadedContent.length > 0 ? ` 📁${order.uploadedContent.length}` : ''}
                    <div style="font-size: 10px; opacity: 0.9;">${order.title.substring(0, 20)}${order.title.length > 20 ? '...' : ''}</div>
                  </div>
                `).join('')}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    function drawMonthView(container, orders) {
      const year = calendarDate.getFullYear();
      const month = calendarDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = getWeekStart(firstDay);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 41); // 6 weeks

      const weeks = [];
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const week = [];
        for (let i = 0; i < 7; i++) {
          week.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(week);
      }

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); border-bottom: 1px solid #e5e7eb;">
          ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `
            <div style="padding: 12px 8px; background: #f9fafb; border-right: 1px solid #e5e7eb; text-align: center; font-weight: 600; color: #374151; font-size: 14px;">
              ${day}
            </div>
          `).join('')}
        </div>
        ${weeks.map(week => `
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); border-bottom: 1px solid #e5e7eb;">
            ${week.map(day => {
              const dayOrders = getOrdersForDate(orders, day);
              const isCurrentMonth = day.getMonth() === month;
              return `
                <div style="border-right: 1px solid #e5e7eb; padding: 4px; min-height: 80px; background: ${isCurrentMonth ? (isToday(day) ? '#f0f9ff' : 'white') : '#f9fafb'};">
                  <div style="font-size: 12px; font-weight: 600; color: ${isCurrentMonth ? (isToday(day) ? '#3b82f6' : '#374151') : '#9ca3af'}; margin-bottom: 4px;">
                    ${day.getDate()}
                  </div>
                  ${dayOrders.slice(0, 3).map(order => `
                    <div style="background: ${getStatusColor(order.status)}; color: white; padding: 2px 4px; border-radius: 3px; margin-bottom: 2px; font-size: 9px; cursor: pointer; line-height: 1.2;"
                         onclick="showOrderDetails('${order.orderNumber}')"
                         title="Order: ${order.title}&#10;Deadline: ${order.deadline}&#10;Status: ${order.status}&#10;Click to view details">
                      ${order.orderNumber}${order.uploadedContent && order.uploadedContent.length > 0 ? ` 📁${order.uploadedContent.length}` : ''}
                    </div>
                  `).join('')}
                  ${dayOrders.length > 3 ? `<div style="font-size: 8px; color: #6b7280; text-align: center;">+${dayOrders.length - 3} more</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        `).join('')}
      `;
    }

    function drawYearView(container, orders) {
      const year = calendarDate.getFullYear();
      const months = [];
      
      for (let i = 0; i < 12; i++) {
        months.push(new Date(year, i, 1));
      }

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 16px; overflow-x: auto; min-width: 800px;">
          ${months.map(month => {
            const monthOrders = orders.filter(order => {
              const orderDate = new Date(order.deadline);
              return orderDate.getFullYear() === year && orderDate.getMonth() === month.getMonth();
            });
            
            return `
              <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: white; min-width: 180px;">
                <h4 style="margin: 0 0 8px; text-align: center; color: #374151; font-size: 14px; font-weight: 600;">
                  ${month.toLocaleDateString('en-US', { month: 'long' })}
                </h4>
                <div style="text-align: center; margin-bottom: 8px; font-size: 12px; color: #6b7280;">
                  ${monthOrders.length} orders
                </div>
                ${monthOrders.slice(0, 5).map(order => `
                  <div style="background: ${getStatusColor(order.status)}; color: white; padding: 4px 6px; border-radius: 4px; margin-bottom: 4px; font-size: 10px; cursor: pointer;"
                       onclick="showOrderDetails('${order.orderNumber}')"
                       title="Order: ${order.title}&#10;Deadline: ${order.deadline}&#10;Status: ${order.status}&#10;Click to view details">
                    ${order.orderNumber}${order.uploadedContent && order.uploadedContent.length > 0 ? ` 📁${order.uploadedContent.length}` : ''}
                    <div style="font-size: 9px; opacity: 0.9;">${new Date(order.deadline).getDate()}/${new Date(order.deadline).getMonth() + 1}</div>
                  </div>
                `).join('')}
                ${monthOrders.length > 5 ? `<div style="font-size: 9px; color: #6b7280; text-align: center;">+${monthOrders.length - 5} more</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // Helper Functions for Calendar
    function getWeekStart(date) {
      const start = new Date(date);
      const day = start.getDay();
      const diff = start.getDate() - day;
      return new Date(start.setDate(diff));
    }

    function isToday(date) {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }

    function formatDate(date) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function getOrdersForDate(orders, date) {
      return orders.filter(order => {
        const orderDate = new Date(order.deadline);
        return orderDate.toDateString() === date.toDateString();
      });
    }

    function calculateProgress(status) {
      const progressMap = {
        'Draft': 10,
        'Pending Approval': 20,
        'Approved': 30,
        'Samples Requested': 40,
        'In Progress': 70,
        'Review': 85,
        'Complete': 100,
        'Delivered': 100
      };
      return progressMap[status] || 0;
    }

    // Expose calculateProgress globally
    window.calculateProgress = calculateProgress;
    
    // Create global selectedItems set
    window.selectedItems = new Set();

    // Helper function to get order progress (alias for calculateProgress)
    function getOrderProgress(order) {
      return calculateProgress(order.status);
    }

    // Helper functions for Kanban and Calendar
    function getPriorityColor(priority) {
      const priorityColors = {
        'High': '#dc2626',
        'Medium': '#f59e0b', 
        'Low': '#10b981'
      };
      return priorityColors[priority] || '#6b7280';
    }

    function getStatusColor(status) {
      const statusColors = {
        'Draft': '#6b7280',
        'Pending Approval': '#f59e0b',
        'Approved': '#3b82f6',
        'Samples Requested': '#8b5cf6',
        'In Progress': '#0ea5e9',
        'Review': '#f97316',
        'Complete': '#10b981',
        'Delivered': '#059669'
      };
      return statusColors[status] || '#6b7280';
    }

    function drawWorkflowView() {
      const currentUser = authSystem.getCurrentUser();
      const orders = authSystem.getFilteredOrders(allOrders);
      
      const draftOrders = orders.filter(o => o.status === 'Draft');
      const samplesRequestedOrders = orders.filter(o => o.status === 'Samples Requested');
      const inProgressOrders = orders.filter(o => o.status === 'In Progress' || o.status === 'Approved');
      const completedOrders = orders.filter(o => o.status === 'Complete' || o.status === 'Delivered');

      function renderKanbanItems(ordersList, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = ordersList.map(o => `
            <div class="kanban-item" 
                 onclick="showOrderDetails('${o.orderNumber}')"
                 draggable="true"
                 ondragstart="handleDragStart(event, '${o.orderNumber}')"
                 data-order="${o.orderNumber}">
              <div style="font-weight: 600; margin-bottom: 4px;">${o.title}</div>
              <div style="color: #6b7280; margin-bottom: 4px;">${o.orderNumber}</div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="status ${o.priority}" style="font-size: 10px;">${o.priority}</span>
                <span style="font-size: 10px; color: #9ca3af;">${o.deadline}</span>
              </div>
              ${o.photographer ? `<div style="font-size: 10px; color: #3b82f6; margin-top: 4px;">👤 ${o.photographer}</div>` : ''}
            </div>
          `).join('');
        }
      }

      renderKanbanItems(draftOrders, 'draftOrders');
      renderKanbanItems(samplesRequestedOrders, 'samplesRequestedOrders');
      renderKanbanItems(inProgressOrders, 'inProgressOrders');
      renderKanbanItems(completedOrders, 'completedOrders');
    }

    function toggleBulkMode() {
      bulkMode = !bulkMode;
      const table = document.querySelector('#ordersView table, #samplesView table');
      if (table) {
        if (bulkMode) {
          table.classList.add('bulk-mode');
          document.getElementById('bulkActionsPanel').style.display = 'block';
          document.getElementById('toggleBulkMode').textContent = '✖️ Exit Bulk';
          updateBulkActionsPanel();
          
          // Add ESC key listener for bulk mode
          document.addEventListener('keydown', handleBulkModeEscape);
        } else {
          table.classList.remove('bulk-mode');
          document.getElementById('bulkActionsPanel').style.display = 'none';
          document.getElementById('toggleBulkMode').textContent = '☑️ Bulk Select';
          selectedItems.clear();
          drawOrderRows();
          
          // Remove ESC key listener
          document.removeEventListener('keydown', handleBulkModeEscape);
        }
      }
    }

    function handleBulkModeEscape(e) {
      if (e.key === 'Escape' && bulkMode) {
        toggleBulkMode();
      }
    }

    function updateBulkActionsPanel() {
      const selectedCount = document.getElementById('selectedCount');
      if (selectedCount) {
        selectedCount.textContent = selectedItems.size;
      }
      
      // Update all checkboxes to reflect current selection
      document.querySelectorAll('.item-checkbox').forEach(checkbox => {
        const id = checkbox.getAttribute('data-id');
        checkbox.checked = selectedItems.has(id);
        
        // Remove existing event listener to prevent duplicates
        checkbox.removeEventListener('change', handleCheckboxChange);
        checkbox.addEventListener('change', handleCheckboxChange);
      });
      
      // Update select all checkbox
      const selectAllCheckbox = document.getElementById('selectAllOrders');
      if (selectAllCheckbox) {
        const visibleCheckboxes = document.querySelectorAll('#ordersView tbody tr:not([style*="display: none"]) .item-checkbox');
        const checkedCount = Array.from(visibleCheckboxes).filter(cb => cb.checked).length;
        selectAllCheckbox.checked = visibleCheckboxes.length > 0 && checkedCount === visibleCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < visibleCheckboxes.length;
      }
    }

    function handleCheckboxChange(e) {
      const id = e.target.getAttribute('data-id');
      if (e.target.checked) {
        selectedItems.add(id);
      } else {
        selectedItems.delete(id);
      }
      updateBulkActionsPanel();
    }

    function applyTemplate(templateKey) {
      const template = templates[templateKey];
      if (!template) return;

      // Pre-fill the create order form
      showView('create');
      
      setTimeout(() => {
        const form = document.getElementById('createOrderForm');
        if (form) {
          form.title.value = template.title;
          form.method.value = template.method;
          form.priority.value = template.priority;
          form.brief.value = template.brief;
          form.articles.value = template.articles;
          form.deliverables.value = template.deliverables;
          form.budget.value = template.budget;
          
          // Set deadline to 7 days from now
          const deadline = new Date();
          deadline.setDate(deadline.getDate() + 7);
          form.deadline.value = deadline.toISOString().split('T')[0];
        }
      }, 100);
    }

    function showQuickFilter(filterType) {
      const today = new Date().toISOString().split('T')[0];
      
      let filtered = [];
      switch(filterType) {
        case 'urgent':
          filtered = orders.filter(o => o.priority === 'Urgent' || o.priority === 'High');
          break;
        case 'ready-samples':
          filtered = orders.filter(o => o.status === 'Samples Requested' || o.status === 'Ready for Production');
          break;
        case 'overdue':
          filtered = orders.filter(o => new Date(o.deadline) < new Date() && o.status !== 'Complete' && o.status !== 'Delivered');
          break;
        case 'today-deadlines':
          filtered = orders.filter(o => o.deadline === today);
          break;
      }
      
      // Temporarily override the search to show filtered results
      if (tbody) {
        tbody.innerHTML = filtered.map(o => {
          const progress = calculateProgress(o.status);
          const isOverdue = new Date(o.deadline) < new Date() && o.status !== 'Complete' && o.status !== 'Delivered';
          const deadlineStyle = isOverdue ? 'color: #dc2626; font-weight: bold;' : '';
          
          return `
          <tr onclick="showOrderDetails('${o.orderNumber}')" style="cursor: pointer; background: #fef3c7;">
            <td><strong>${o.orderNumber}</strong></td>
            <td>${o.title}</td>
            <td><span class="status ${o.status.replace(/\s+/g, '')}">${o.status}</span></td>
            <td>${o.method}</td>
            <td>${o.photographer}</td>
            <td><span class="status ${o.priority}">${o.priority}</span></td>
            <td style="${deadlineStyle}">${o.deadline}${isOverdue ? ' ⚠️' : ''}</td>
            <td>${o.articles ? o.articles.length : 0}</td>
            <td>${o.budget ? '$' + o.budget.toLocaleString() : 'Not set'}</td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
              </div>
              <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">${progress}%</div>
            </td>
          </tr>
        `;
        }).join('');
        
        if (filtered.length === 0) {
          tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;color:#9ca3af;padding:20px;">No items found for this filter</td></tr>';
        }
      }
      
      // Clear after 5 seconds
      setTimeout(() => {
        if (currentView === 'orders') drawOrderRows();
      }, 5000);
    }

    function drawSampleRows() {
      const samplesBody = document.getElementById('samplesBody');
      const dashboardSamplesBody = document.getElementById('dashboardSamplesBody');
      
      // Only populate samplesBody if we're in samples view
      if (samplesBody && currentView === 'samples') {
        samplesBody.innerHTML = samples.map(s => `
          <tr onclick="showSampleDetails('${s.id}')" style="cursor: pointer;">
            <td><strong>${s.id}</strong></td>
            <td>${s.articleName}</td>
            <td><span class="status ${s.status.replace(/\s+/g, '')}">${s.status}</span></td>
            <td>${s.location}</td>
            <td>${s.assignedTo}</td>
            <td style="font-size: 11px;">${s.transitHistory}</td>
            <td>${s.lastUpdate}</td>
          </tr>
        `).join('');
      }
      
      // Only populate dashboardSamplesBody if we're in dashboard view
      if (dashboardSamplesBody && currentView === 'dashboard') {
        // Get search term from dashboard search box
        const searchBox = document.getElementById('dashboardSampleSearch');
        const term = searchBox?.value.toLowerCase() || '';
        
        // Filter samples based on search term
        const filtered = samples.filter(s => 
          !term || 
          s.id.toLowerCase().includes(term) ||
          s.articleName.toLowerCase().includes(term) ||
          s.location.toLowerCase().includes(term) ||
          s.assignedTo.toLowerCase().includes(term)
        );
        
        dashboardSamplesBody.innerHTML = filtered.map(s => `
          <tr onclick="showSampleDetails('${s.id}')" style="cursor: pointer;">
            <td><strong>${s.id}</strong></td>
            <td>${s.articleName}</td>
            <td><span class="status ${s.status.replace(/\s+/g, '')}">${s.status}</span></td>
            <td>${s.location}</td>
            <td>${s.assignedTo}</td>
            <td style="font-size: 11px;">${s.transitHistory}</td>
            <td>${s.lastUpdate}</td>
          </tr>
        `).join('');
      }
    }

    function drawRows() {
      if (currentView === 'orders') {
        drawOrderRows();
      } else if (currentView === 'samples') {
        drawSampleRows();
      }
    }

    window.showOrderDetails = function(orderNumber) {
      const orders = authSystem.getFilteredOrders(allOrders); // Get filtered orders
      const order = orders.find(o => o.orderNumber === orderNumber);
      if (!order) return;
      
      const currentUser = authSystem.getCurrentUser();
      const comments = order.comments || [];
      
      const modal = document.createElement('div');
      modal.className = 'order-details-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:900px;width:95%;max-height:90vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="margin:0;font-size:22px;color:#1f2937;">${order.title}</h2>
            <button onclick="this.closest('.order-details-modal').remove()" style="background:none;border:none;font-size:28px;cursor:pointer;color:#6b7280;">×</button>
          </div>
          
          <!-- Order Information Grid -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;margin-bottom:24px;">
            <div style="background:#f8fafc;padding:16px;border-radius:8px;">
              <h3 style="margin:0 0 12px;font-size:16px;color:#374151;">📋 Order Details</h3>
              <div style="display:grid;gap:8px;">
                <div><strong>Order Number:</strong> ${order.orderNumber}</div>
                <div><strong>Status:</strong> <span style="background:${getStatusColor(order.status)};color:white;padding:2px 8px;border-radius:4px;font-size:12px;">${order.status}</span></div>
                <div><strong>Method:</strong> ${order.method}</div>
                <div><strong>Priority:</strong> <span style="background:${getPriorityColor(order.priority)};color:white;padding:2px 8px;border-radius:4px;font-size:12px;">${order.priority}</span></div>
                <div><strong>Assigned To:</strong> ${order.photographer}</div>
                <div><strong>Deadline:</strong> ${order.deadline}</div>
                <div><strong>Cost Center:</strong> ${order.costCenter}</div>
                <div><strong>Budget:</strong> ${order.budget ? '$' + order.budget.toLocaleString() : 'Not set'}</div>
                ${order.photoTypes && order.photoTypes.length > 0 ? `<div><strong>Photo Types:</strong><br>${order.photoTypes.map(type => `<span style="display:inline-block;background:#ddd6fe;color:#5b21b6;padding:2px 6px;border-radius:12px;font-size:11px;margin:2px 4px 2px 0;">${type}</span>`).join('')}</div>` : ''}
              </div>
            </div>
            
            ${order.eventId ? `
            <div style="background:#fef3c7;padding:16px;border-radius:8px;">
              <h3 style="margin:0 0 12px;font-size:16px;color:#374151;">🏢 SAP PMR Integration</h3>
              <div style="display:grid;gap:8px;">
                <div><strong>Event ID:</strong> ${order.eventId}</div>
                <div><strong>Purchase Group:</strong> ${order.purchaseGroup} - ${purchaseGroups[order.purchaseGroup] || 'Unknown'}</div>
                <div><strong>Offer ID:</strong> ${order.offerId || 'N/A'}</div>
                <div><strong>Article Number:</strong> ${order.articleNumber || 'N/A'}</div>
                <div><strong>Image Request ID:</strong> ${order.imageRequestId || 'N/A'}</div>
                <div><strong>Photo Status:</strong> <span style="background:#${order.photoStatus === 'Archive' ? '10b981' : order.photoStatus === 'New Shoot - Photo Box' ? '3b82f6' : 'f59e0b'};color:white;padding:2px 8px;border-radius:4px;font-size:12px;">${order.photoStatus || 'Not Set'}</span></div>
                ${order.cloudinaryUrl ? `<div><strong>Cloudinary:</strong> <a href="${order.cloudinaryUrl}" target="_blank" style="color:#3b82f6;">View Image</a></div>` : ''}
              </div>
            </div>
            ` : `
            <div style="background:#f0f9ff;padding:16px;border-radius:8px;">
              <h3 style="margin:0 0 12px;font-size:16px;color:#374151;">📝 Project Brief</h3>
              <div style="background:white;padding:12px;border-radius:6px;line-height:1.5;max-height:200px;overflow-y:auto;">
                ${order.brief}
              </div>
            </div>
            `}
          </div>
          
          ${!order.eventId ? `
          <div style="background:#f0f9ff;padding:16px;border-radius:8px;margin-bottom:24px;">
            <h3 style="margin:0 0 12px;font-size:16px;color:#374151;">📝 Project Brief</h3>
            <div style="background:white;padding:12px;border-radius:6px;line-height:1.5;max-height:200px;overflow-y:auto;">
              ${order.brief}
            </div>
          </div>
          ` : ''}
          
          <!-- Articles, Buyers and Deliverables -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:24px;">
            <div style="background:#f0fdf4;padding:16px;border-radius:8px;">
              <h3 style="margin:0 0 12px;font-size:16px;color:#374151;">📦 Articles (${order.articles ? order.articles.length : 0})</h3>
              <div style="max-height:120px;overflow-y:auto;">
                ${order.articles ? order.articles.map(article => `
                  <div style="background:white;margin:4px 0;padding:8px 12px;border-radius:6px;border-left:4px solid #10b981;">
                    ${article}
                  </div>
                `).join('') : '<div style="color:#6b7280;font-style:italic;">No articles specified</div>'}
              </div>
            </div>
            
            ${order.buyers ? `
            <div style="background:#fef7ff;padding:16px;border-radius:8px;">
              <h3 style="margin:0 0 12px;font-size:16px;color:#374151;">👥 Buyers (${order.buyers.length})</h3>
              <div style="max-height:120px;overflow-y:auto;">
                ${order.buyers.map(buyer => `
                  <div style="background:white;margin:4px 0;padding:8px 12px;border-radius:6px;border-left:4px solid #8b5cf6;">
                    <div style="font-weight:600;font-size:12px;color:#374151;">${buyer.name}</div>
                    <div style="font-size:11px;color:#6b7280;margin-top:2px;">${buyer.items.join(', ')}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}
            
            <div style="background:#fef3f2;padding:16px;border-radius:8px;">
              <h3 style="margin:0 0 12px;font-size:16px;color:#374151;">🎯 Deliverables</h3>
              <div style="max-height:120px;overflow-y:auto;">
                ${order.deliverables ? order.deliverables.map(deliverable => `
                  <div style="background:white;margin:4px 0;padding:8px 12px;border-radius:6px;border-left:4px solid #f59e0b;">
                    ${deliverable}
                  </div>
                `).join('') : '<div style="color:#6b7280;font-style:italic;">No deliverables specified</div>'}
              </div>
            </div>
          </div>
          
          <!-- DAM Assets Section -->
          ${(() => {
            const damAssets = window.getDAMAssets();
            const linkedAssets = damAssets.filter(asset => asset.orderNumber === order.orderNumber);
            return `
              <div style="background:#f0fdf4;padding:16px;border-radius:8px;margin-bottom:20px;">
                <h3 style="margin:0 0 12px;font-size:16px;color:#374151;">🗂️ DAM Assets (${linkedAssets.length})</h3>
                ${linkedAssets.length > 0 ? `
                  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:12px;">
                    ${linkedAssets.map(asset => `
                      <div style="border:1px solid #d1fae5;border-radius:6px;padding:8px;background:white;">
                        <div style="aspect-ratio:16/9;background:#f3f4f6;border-radius:4px;margin-bottom:6px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                          ${asset.type === 'image' && asset.url ? 
                            '<img src="' + asset.url + '" alt="' + asset.filename + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' +
                             '<div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;color:#6b7280;font-size:12px;">🖼️</div>' :
                            '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:12px;">' +
                               (asset.type === 'video' ? '🎬' : '📄') +
                             '</div>'
                          }
                        </div>
                        <div style="font-size:11px;font-weight:500;margin-bottom:2px;">${asset.filename.length > 18 ? asset.filename.substring(0, 15) + '...' : asset.filename}</div>
                        <div style="font-size:9px;color:#6b7280;margin-bottom:4px;">${asset.category} • ${asset.size}</div>
                        <div style="display:flex;gap:2px;">
                          <button onclick="window.viewDAMAsset('${asset.id}')" style="flex:1;padding:3px;background:#10b981;color:white;border:none;border-radius:2px;font-size:8px;cursor:pointer;">View</button>
                          <button onclick="window.downloadDAMAsset('${asset.id}')" style="flex:1;padding:3px;background:#3b82f6;color:white;border:none;border-radius:2px;font-size:8px;cursor:pointer;">Get</button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                ` : `
                  <p style="margin:0 0 12px;font-size:12px;color:#059669;font-style:italic;">No assets linked to this order yet.</p>
                `}
                <button onclick="window.showDAMIntegrationModal()" style="padding:6px 12px;background:#059669;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">
                  📤 ${linkedAssets.length > 0 ? 'Upload More Assets' : 'Upload Assets'}
                </button>
              </div>
            `;
          })()}
          
          <!-- Comments Section -->
          <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-bottom:20px;">
            <h3 style="margin:0 0 16px;font-size:16px;color:#374151;">📁 Uploaded Content</h3>
            
            <!-- Upload Section (for photographers) -->
            ${authSystem.canEditOrder(order) ? `
              <div style="background:white;padding:12px;border-radius:6px;margin-bottom:16px;border:2px dashed #d1d5db;">
                <div style="text-align:center;color:#6b7280;margin-bottom:12px;">
                  <span style="font-size:24px;">📸</span>
                  <div>Upload content for this order</div>
                </div>
                <input type="file" id="contentUpload-${orderNumber}" accept="image/*,video/*,.pdf,.zip,.rar" multiple style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;margin-bottom:8px;">
                <div style="text-align:right;">
                  <button onclick="uploadContent('${orderNumber}')" style="background:#10b981;color:white;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-size:14px;">Upload Files</button>
                </div>
              </div>
            ` : ''}
            
            <!-- Uploaded Files Display -->
            <div id="uploadedContent-${orderNumber}" style="max-height:250px;overflow-y:auto;">
              ${order.uploadedContent && order.uploadedContent.length > 0 ? 
                order.uploadedContent.map((file, index) => `
                  <div style="background:white;padding:12px;border-radius:6px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #10b981;">
                    <div style="display:flex;align-items:center;">
                      <div style="font-size:20px;margin-right:12px;">
                        ${file.type.startsWith('image/') ? '🖼️' : 
                          file.type.startsWith('video/') ? '🎥' : 
                          file.type === 'application/pdf' ? '📄' : '📁'}
                      </div>
                      <div>
                        <div style="font-weight:600;color:#374151;">${file.name}</div>
                        <div style="font-size:12px;color:#6b7280;">
                          ${(file.size / 1024 / 1024).toFixed(2)} MB • 
                          Uploaded by ${file.uploadedBy} • 
                          ${new Date(file.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div>
                      <button onclick="previewContent('${orderNumber}', ${index})" style="background:#3b82f6;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px;margin-right:8px;">Preview</button>
                      <button onclick="downloadContent('${orderNumber}', ${index})" style="background:#6b7280;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px;">Download</button>
                    </div>
                  </div>
                `).join('') :
                '<div style="text-align:center;color:#6b7280;font-style:italic;padding:20px;">No content uploaded yet</div>'
              }
            </div>
          </div>
          
          <!-- Comments Section -->
          <div style="background:#f9fafb;padding:16px;border-radius:8px;">
            <h3 style="margin:0 0 16px;font-size:16px;color:#374151;">💬 Comments (${comments.length})</h3>
            
            <!-- Add Comment Form -->
            <div style="background:white;padding:12px;border-radius:6px;margin-bottom:16px;">
              <textarea id="newComment-${orderNumber}" placeholder="Add a comment..." style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;resize:vertical;min-height:60px;font-family:inherit;"></textarea>
              <div style="margin-top:8px;text-align:right;">
                <button onclick="addComment('${orderNumber}')" style="background:#3b82f6;color:white;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-size:14px;">Add Comment</button>
              </div>
            </div>
            
            <!-- Comments List -->
            <div style="max-height:300px;overflow-y:auto;">
              ${comments.length === 0 ? 
                '<div style="text-align:center;color:#6b7280;font-style:italic;padding:20px;">No comments yet</div>' :
                comments.map(comment => `
                  <div style="background:white;padding:12px;border-radius:6px;margin-bottom:8px;border-left:4px solid #3b82f6;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                      <div style="font-weight:600;color:#374151;">${comment.userName} <span style="font-size:12px;color:#6b7280;">(${comment.userRole})</span></div>
                      <div style="font-size:12px;color:#6b7280;">${new Date(comment.createdAt).toLocaleDateString()} ${new Date(comment.createdAt).toLocaleTimeString()}</div>
                    </div>
                    <div style="color:#1f2937;line-height:1.5;">${comment.message}</div>
                  </div>
                `).join('')
              }
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }

    // Function to add comment from the order details modal
    window.addComment = function(orderNumber) {
      const textarea = document.getElementById(`newComment-${orderNumber}`);
      const message = textarea.value.trim();
      
      if (!message) {
        alert('Please enter a comment message');
        return;
      }
      
      const currentUser = authSystem.getCurrentUser();
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      
      if (!order) return;
      
      // Initialize comments array if it doesn't exist
      if (!order.comments) {
        order.comments = [];
      }
      
      // Create new comment
      const newComment = {
        id: 'c' + Date.now(),
        orderId: orderNumber,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        message: message,
        createdAt: new Date().toISOString(),
        isRead: false,
        readBy: [currentUser.id]
      };
      
      // Add comment to order
      order.comments.push(newComment);
      
      // Clear textarea
      textarea.value = '';
      
      // Show success message
      showToast('Comment added successfully', 'success');
      
      // Close and reopen modal to refresh
      document.querySelector('div[style*="position:fixed"]').remove();
      showOrderDetails(orderNumber);
    }

    // Function to upload content to an order
    window.uploadContent = function(orderNumber) {
      const fileInput = document.getElementById(`contentUpload-${orderNumber}`);
      const files = fileInput.files;
      
      if (!files || files.length === 0) {
        alert('Please select files to upload');
        return;
      }
      
      const currentUser = authSystem.getCurrentUser();
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      
      if (!order) return;
      
      // Initialize uploadedContent array if it doesn't exist
      if (!order.uploadedContent) {
        order.uploadedContent = [];
      }
      
      // Process each file
      Array.from(files).forEach(file => {
        // Create a file reader to convert to base64 for simulation
        const reader = new FileReader();
        reader.onload = function(e) {
          const fileData = {
            id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result, // Base64 data for simulation
            uploadedBy: currentUser.name,
            uploadedAt: new Date().toISOString(),
            uploadedByRole: currentUser.role
          };
          
          order.uploadedContent.push(fileData);
          
          // Show success message
          showToast(`File "${file.name}" uploaded successfully`, 'success');
          
          // Refresh the modal after all files are processed
          if (order.uploadedContent.length === files.length + (order.uploadedContent.length - files.length)) {
            document.querySelector('div[style*="position:fixed"]').remove();
            showOrderDetails(orderNumber);
          }
        };
        reader.readAsDataURL(file);
      });
      
      // Clear file input
      fileInput.value = '';
    }

    // Function to preview uploaded content
    window.previewContent = function(orderNumber, fileIndex) {
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      if (!order || !order.uploadedContent || !order.uploadedContent[fileIndex]) return;
      
      const file = order.uploadedContent[fileIndex];
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:2000';
      
      let content = '';
      
      if (file.type.startsWith('image/')) {
        content = `
          <div style="max-width:90vw;max-height:90vh;text-align:center;">
            <img src="${file.data}" style="max-width:100%;max-height:80vh;object-fit:contain;border-radius:8px;">
            <div style="color:white;margin-top:16px;font-size:18px;">${file.name}</div>
            <div style="color:#d1d5db;margin-top:8px;">
              ${(file.size / 1024 / 1024).toFixed(2)} MB • 
              Uploaded by ${file.uploadedBy} • 
              ${new Date(file.uploadedAt).toLocaleDateString()}
            </div>
          </div>
        `;
      } else if (file.type.startsWith('video/')) {
        content = `
          <div style="max-width:90vw;max-height:90vh;text-align:center;">
            <video controls style="max-width:100%;max-height:80vh;border-radius:8px;">
              <source src="${file.data}" type="${file.type}">
              Your browser does not support the video tag.
            </video>
            <div style="color:white;margin-top:16px;font-size:18px;">${file.name}</div>
            <div style="color:#d1d5db;margin-top:8px;">
              ${(file.size / 1024 / 1024).toFixed(2)} MB • 
              Uploaded by ${file.uploadedBy} • 
              ${new Date(file.uploadedAt).toLocaleDateString()}
            </div>
          </div>
        `;
      } else {
        content = `
          <div style="background:white;padding:40px;border-radius:12px;text-align:center;max-width:500px;">
            <div style="font-size:48px;margin-bottom:16px;">
              ${file.type === 'application/pdf' ? '📄' : '📁'}
            </div>
            <h3 style="margin:0 0 16px;color:#1f2937;">${file.name}</h3>
            <div style="color:#6b7280;margin-bottom:24px;">
              ${(file.size / 1024 / 1024).toFixed(2)} MB • 
              Uploaded by ${file.uploadedBy} • 
              ${new Date(file.uploadedAt).toLocaleDateString()}
            </div>
            <div style="color:#6b7280;margin-bottom:24px;">
              Preview not available for this file type
            </div>
            <button onclick="downloadContent('${orderNumber}', ${fileIndex})" style="background:#3b82f6;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;font-size:16px;">Download File</button>
          </div>
        `;
      }
      
      modal.innerHTML = `
        <div>
          ${content}
          <div style="position:absolute;top:20px;right:20px;">
            <button onclick="this.closest('div[style*=\\"position:fixed\\"]').remove()" style="background:rgba(255,255,255,0.2);color:white;border:none;font-size:28px;cursor:pointer;padding:8px 12px;border-radius:6px;">×</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }

    // Function to download uploaded content
    window.downloadContent = function(orderNumber, fileIndex) {
      const order = allOrders.find(o => o.orderNumber === orderNumber);
      if (!order || !order.uploadedContent || !order.uploadedContent[fileIndex]) return;
      
      const file = order.uploadedContent[fileIndex];
      
      // Create download link
      const link = document.createElement('a');
      link.href = file.data;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast(`Downloading "${file.name}"`, 'info');
    }

    window.showSampleDetails = function(sampleId) {
      const sample = samples.find(s => s.id === sampleId);
      if (!sample) return;
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h2 style="margin:0;font-size:20px;color:#1f2937;">Sample Details</h2>
            <button onclick="this.closest('div[style*=\\"position:fixed\\"]').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#6b7280;">×</button>
          </div>
          
          <div style="display:grid;gap:12px;">
            <div><strong>Sample ID:</strong> ${sample.id}</div>
            <div><strong>Article:</strong> ${sample.articleName}</div>
            <div><strong>Status:</strong> <span class="status ${sample.status.replace(/\\s+/g, '')}">${sample.status}</span></div>
            <div><strong>Location:</strong> ${sample.location}</div>
            <div><strong>Assigned To:</strong> ${sample.assignedTo}</div>
            <div><strong>Last Update:</strong> ${sample.lastUpdate}</div>
          </div>
          
          <div style="margin-top:16px;">
            <strong>Transit History:</strong>
            <div style="margin-top:8px;padding:12px;background:#f8fafc;border-radius:6px;">${sample.transitHistory}</div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }

    // Create Order Modal
    function showCreateOrderModal() {
      const modal = document.createElement('div');
      modal.className = 'create-order-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:32px;max-width:800px;width:95%;max-height:80vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h2 style="margin:0;font-size:24px;color:#1f2937;">📝 Create New Order</h2>
            <button onclick="this.closest('.create-order-modal').remove()" style="background:none;border:none;font-size:28px;cursor:pointer;color:#6b7280;">×</button>
          </div>
          <form id="createOrderForm" onsubmit="handleCreateOrder(event)">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;color:#374151;">Order Title</label>
                <input name="title" required style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;" placeholder="e.g., Summer Collection Photography">
              </div>
              <div>
                <label style="display:block;margin-bottom:8px;font-weight:500;color:#374151;">Priority</label>
                <select name="priority" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                  <option value="Low">Low</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div style="margin-bottom:20px;">
              <label style="display:block;margin-bottom:8px;font-weight:500;color:#374151;">Brief & Instructions</label>
              <textarea name="brief" rows="4" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;" placeholder="Detailed brief..."></textarea>
            </div>
            <div style="display:flex;gap:12px;margin-top:24px;">
              <button type="submit" style="background:#7c3aed;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;font-weight:500;">Create Order</button>
              <button type="button" onclick="this.closest('.create-order-modal').remove()" style="background:#6b7280;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;">Cancel</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }
    
    // Assign to window immediately after definition
    window.showCreateOrderModal = showCreateOrderModal;

    // Scan Article Modal
    function showScanModal() {
      const modal = document.createElement('div');
      modal.className = 'scan-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:32px;max-width:500px;width:95%;max-height:80vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h2 style="margin:0;font-size:24px;color:#1f2937;">📷 Scan Article</h2>
            <button onclick="this.closest('.scan-modal').remove()" style="background:none;border:none;font-size:28px;cursor:pointer;color:#6b7280;">×</button>
          </div>
          <div style="text-align:center;margin-bottom:24px;">
            <div style="background:#f8fafc;border:2px dashed #d1d5db;border-radius:8px;padding:40px;margin-bottom:16px;">
              <div style="font-size:48px;margin-bottom:16px;">📱</div>
              <p style="margin:0;color:#6b7280;">Click to open camera or upload image</p>
            </div>
            <input type="file" accept="image/*" capture="camera" style="display:none;" id="scanInput">
            <button onclick="document.getElementById('scanInput').click()" style="background:#059669;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;font-weight:500;margin-right:12px;">📷 Open Camera</button>
            <button onclick="document.getElementById('scanInput').click()" style="background:#3b82f6;color:white;border:none;padding:12px 24px;border-radius:6px;cursor:pointer;font-weight:500;">📁 Upload Image</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }
    
    // Assign to window immediately after definition
    window.showScanModal = showScanModal;

    // Quick Templates Modal
    function showQuickTemplatesModal() {
      const modal = document.createElement('div');
      modal.className = 'templates-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      
      // Group templates by category
      const templatesByCategory = {};
      Object.entries(templates || {}).forEach(([key, template]) => {
        const category = template.category || 'Other';
        if (!templatesByCategory[category]) {
          templatesByCategory[category] = [];
        }
        templatesByCategory[category].push({ key, ...template });
      });
      
      modal.innerHTML = `
        <div style="background:white;border-radius:16px;padding:32px;max-width:1200px;width:95%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 40px rgba(0,0,0,0.15);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;">
            <div>
              <h2 style="margin:0 0 8px;font-size:28px;color:#1f2937;font-weight:700;">⚡ Quick Templates</h2>
              <p style="margin:0;color:#6b7280;font-size:16px;">Choose from pre-configured project templates to get started quickly</p>
            </div>
            <button onclick="this.closest('.templates-modal').remove()" style="background:none;border:none;font-size:32px;cursor:pointer;color:#6b7280;transition:color 0.2s;" onmouseover="this.style.color='#374151'" onmouseout="this.style.color='#6b7280'">×</button>
          </div>
          
          <!-- Search and Filter Bar -->
          <div style="margin-bottom:32px;">
            <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">
              <input id="templateSearch" type="text" placeholder="🔍 Search templates..." 
                     style="flex:1;min-width:300px;padding:12px 16px;border:2px solid #e5e7eb;border-radius:12px;font-size:14px;transition:border-color 0.2s;"
                     onmouseover="this.style.borderColor='#3b82f6'" onmouseout="this.style.borderColor='#e5e7eb'" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#e5e7eb'" />
              <select id="categoryFilter" style="padding:12px 16px;border:2px solid #e5e7eb;border-radius:12px;font-size:14px;background:white;">
                <option value="">All Categories</option>
                <option value="Photography">📸 Photography</option>
                <option value="Video">🎥 Video</option>
                <option value="Social Media">📱 Social Media</option>
                <option value="Branding">🎨 Branding</option>
                <option value="Documentation">📋 Documentation</option>
              </select>
              <select id="budgetFilter" style="padding:12px 16px;border:2px solid #e5e7eb;border-radius:12px;font-size:14px;background:white;">
                <option value="">All Budgets</option>
                <option value="low">💰 Under 3,000 SEK</option>
                <option value="medium">💰💰 3,000 - 6,000 SEK</option>
                <option value="high">💰💰💰 Over 6,000 SEK</option>
              </select>
            </div>
          </div>
          
          <div id="templatesContainer">
            ${Object.entries(templatesByCategory).map(([category, categoryTemplates]) => `
              <div class="template-category" data-category="${category}" style="margin-bottom:40px;">
                <h3 style="margin:0 0 20px;font-size:20px;color:#374151;font-weight:600;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">
                  ${category === 'Photography' ? '📸' : category === 'Video' ? '🎥' : category === 'Social Media' ? '📱' : category === 'Branding' ? '🎨' : category === 'Documentation' ? '📋' : '🎯'} ${category}
                </h3>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px;">
                  ${categoryTemplates.map(template => `
                    <div class="template-card" data-title="${template.title.toLowerCase()}" data-brief="${template.brief.toLowerCase()}" data-category="${template.category}" data-budget="${template.budget}"
                         style="border:2px solid #e5e7eb;border-radius:12px;padding:20px;cursor:pointer;transition:all 0.3s ease;background:linear-gradient(135deg, #f9fafb, #ffffff);" 
                         onclick="useTemplate('${template.key}')"
                         onmouseover="this.style.borderColor='#3b82f6'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(59,130,246,0.15)'"
                         onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                      <div style="display:flex;align-items:center;margin-bottom:12px;">
                        <span style="font-size:24px;margin-right:12px;">${template.icon}</span>
                        <h4 style="margin:0;font-size:18px;color:#1f2937;font-weight:600;">${template.title}</h4>
                      </div>
                      <p style="margin:0 0 16px;font-size:14px;color:#6b7280;line-height:1.5;">${template.brief}</p>
                      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <span style="background:linear-gradient(135deg, #f3f4f6, #e5e7eb);padding:6px 12px;border-radius:20px;font-size:12px;color:#374151;font-weight:500;">${template.method}</span>
                        <span style="background:linear-gradient(135deg, #10b981, #059669);color:white;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600;">${template.budget.toLocaleString()} SEK</span>
                      </div>
                      <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:12px;color:#9ca3af;">Priority: <strong style="color:${template.priority === 'High' ? '#dc2626' : template.priority === 'Medium' ? '#f59e0b' : '#10b981'}">${template.priority}</strong></span>
                        <span style="background:#3b82f6;color:white;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:600;">Use Template →</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add search and filter functionality
      const searchInput = modal.querySelector('#templateSearch');
      const categoryFilter = modal.querySelector('#categoryFilter');
      const budgetFilter = modal.querySelector('#budgetFilter');
      
      function filterTemplates() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedBudget = budgetFilter.value;
        
        const templateCards = modal.querySelectorAll('.template-card');
        const categories = modal.querySelectorAll('.template-category');
        
        categories.forEach(category => {
          let hasVisibleCards = false;
          const categoryName = category.dataset.category;
          
          // Hide category if not matching filter
          if (selectedCategory && selectedCategory !== categoryName) {
            category.style.display = 'none';
            return;
          }
          
          category.style.display = 'block';
          
          // Filter cards within this category
          const cardsInCategory = category.querySelectorAll('.template-card');
          cardsInCategory.forEach(card => {
            const title = card.dataset.title;
            const brief = card.dataset.brief;
            const budget = parseInt(card.dataset.budget);
            
            let matchesSearch = !searchTerm || title.includes(searchTerm) || brief.includes(searchTerm);
            let matchesBudget = true;
            
            if (selectedBudget === 'low') matchesBudget = budget < 3000;
            else if (selectedBudget === 'medium') matchesBudget = budget >= 3000 && budget <= 6000;
            else if (selectedBudget === 'high') matchesBudget = budget > 6000;
            
            if (matchesSearch && matchesBudget) {
              card.style.display = 'block';
              hasVisibleCards = true;
            } else {
              card.style.display = 'none';
            }
          });
          
          // Hide category if no visible cards
          if (!hasVisibleCards) {
            category.style.display = 'none';
          }
        });
      }
      
      searchInput.addEventListener('input', filterTemplates);
      categoryFilter.addEventListener('change', filterTemplates);
      budgetFilter.addEventListener('change', filterTemplates);
      
      // Close on backdrop click
      modal.addEventListener('click', (e) => { 
        if(e.target === modal) modal.remove(); 
      });
      
      // Close on ESC key
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
    }
    
    // Assign to window immediately after definition
    window.showQuickTemplatesModal = showQuickTemplatesModal;

    // SAP PMR Import Modal
    function showSAPImportModal() {
      const modal = document.createElement('div');
      modal.className = 'sap-import-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:32px;max-width:600px;width:95%;max-height:80vh;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
            <h2 style="margin:0;font-size:24px;color:#1f2937;">🏢 Import SAP PMR Data</h2>
            <button onclick="this.closest('.sap-import-modal').remove()" style="background:none;border:none;font-size:28px;cursor:pointer;color:#6b7280;">×</button>
          </div>
          
          <div style="margin-bottom:24px;">
            <h3 style="margin:0 0 16px;font-size:18px;color:#374151;">Data Format Expected</h3>
            <div style="background:#f8fafc;padding:16px;border-radius:8px;border-left:4px solid #3b82f6;">
              <p style="margin:0 0 12px;font-size:14px;color:#374151;"><strong>JSON Array with following fields:</strong></p>
              <ul style="margin:0;padding-left:20px;font-size:14px;color:#6b7280;">
                <li><strong>eventId</strong>: Event identifier (e.g., "A4025052")</li>
                <li><strong>purchaseGroup</strong>: Purchase group number (100-999)</li>
                <li><strong>offerId</strong>: Offer identifier (e.g., "10763319")</li>
                <li><strong>articleNumber</strong>: Article number</li>
                <li><strong>articleName</strong>: Article name</li>
                <li><strong>imageRequestId</strong>: Image request ID (e.g., "123456")</li>
                <li><strong>photoStatus</strong>: "Archive", "New Shoot - Photographer", or "New Shoot - Photo Box"</li>
                <li><strong>cloudinaryUrl</strong>: (Optional) Existing image URL</li>
              </ul>
            </div>
          </div>
          
          <div style="margin-bottom:24px;">
            <h3 style="margin:0 0 16px;font-size:18px;color:#374151;">Sample Data</h3>
            <div style="background:#f1f5f9;padding:16px;border-radius:8px;font-family:monospace;font-size:12px;max-height:200px;overflow-y:auto;">
[{
  "eventId": "A4025052",
  "purchaseGroup": 100,
  "offerId": "10763319",
  "articleNumber": "ART-DOG-001",
  "articleName": "Premium Dog Food 2kg",
  "imageRequestId": "123456",
  "photoStatus": "New Shoot - Photographer",
  "cloudinaryUrl": null
}]
            </div>
          </div>
          
          <div style="margin-bottom:24px;">
            <label style="display:block;margin-bottom:8px;font-weight:600;color:#374151;">Paste JSON Data:</label>
            <textarea id="sapJsonInput" style="width:100%;height:200px;padding:12px;border:1px solid #d1d5db;border-radius:6px;font-family:monospace;font-size:12px;" placeholder="Paste your SAP PMR JSON data here..."></textarea>
          </div>
          
          <div style="display:flex;gap:12px;justify-content:space-between;">
            <button onclick="simulatePMRRequest()" style="padding:12px 24px;background:#059669;color:white;border:none;border-radius:6px;cursor:pointer;">🎲 Simulate PMR Request</button>
            <div style="display:flex;gap:12px;">
              <button onclick="this.closest('.sap-import-modal').remove()" style="padding:12px 24px;border:1px solid #d1d5db;background:white;color:#374151;border-radius:6px;cursor:pointer;">Cancel</button>
              <button onclick="processSAPImport()" style="padding:12px 24px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;">Import Data</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
    }
    
    // Assign to window immediately after definition
    window.showSAPImportModal = showSAPImportModal;

    // Process SAP Import
    window.processSAPImport = function() {
      const jsonInput = document.getElementById('sapJsonInput').value.trim();
      
      if (!jsonInput) {
        alert('Please enter JSON data to import.');
        return;
      }
      
      const result = importSAPData(jsonInput);
      
      if (result.success) {
        alert(`Successfully imported ${result.imported} orders from SAP PMR!`);
        document.querySelector('.sap-import-modal').remove();
        showView('orders'); // Refresh the orders view
      } else {
        alert(`Import failed: ${result.error}`);
      }
    };

    // Simulate PMR Request
    window.simulatePMRRequest = function() {
      // Sample articles for different purchase groups
      const sampleArticles = {
        100: [ // Groceries
          { name: 'Premium Olive Oil Extra Virgin 500ml', number: 'ART-OIL-' + Math.floor(Math.random() * 1000) },
          { name: 'Organic Quinoa Red 400g', number: 'ART-QUI-' + Math.floor(Math.random() * 1000) },
          { name: 'Artisan Bread Sourdough', number: 'ART-BRD-' + Math.floor(Math.random() * 1000) },
          { name: 'Free Range Eggs Large 12pk', number: 'ART-EGG-' + Math.floor(Math.random() * 1000) }
        ],
        200: [ // Fresh Products
          { name: 'Norwegian Salmon Fillet 400g', number: 'ART-SAL-' + Math.floor(Math.random() * 1000) },
          { name: 'Organic Baby Spinach 150g', number: 'ART-SPI-' + Math.floor(Math.random() * 1000) },
          { name: 'Fresh Strawberries 250g', number: 'ART-STR-' + Math.floor(Math.random() * 1000) },
          { name: 'Greek Feta Cheese 200g', number: 'ART-FET-' + Math.floor(Math.random() * 1000) }
        ],
        300: [ // Electronics
          { name: 'Wireless Gaming Mouse RGB', number: 'ART-MOU-' + Math.floor(Math.random() * 1000) },
          { name: 'USB-C Fast Charger 65W', number: 'ART-CHR-' + Math.floor(Math.random() * 1000) },
          { name: 'Bluetooth Noise Cancelling Headphones', number: 'ART-HEA-' + Math.floor(Math.random() * 1000) },
          { name: 'Smart Watch Fitness Tracker', number: 'ART-WAT-' + Math.floor(Math.random() * 1000) }
        ],
        400: [ // Home & Garden
          { name: 'Solar Pathway Lights Set of 6', number: 'ART-SOL-' + Math.floor(Math.random() * 1000) },
          { name: 'Ceramic Plant Pots Set', number: 'ART-POT-' + Math.floor(Math.random() * 1000) },
          { name: 'Outdoor Cushion Covers 4pk', number: 'ART-CUS-' + Math.floor(Math.random() * 1000) },
          { name: 'Garden Tool Set Professional', number: 'ART-TOO-' + Math.floor(Math.random() * 1000) }
        ]
      };

      // Get current week for event ID
      const now = new Date();
      const weekNum = Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      // Random purchase group (100, 200, 300, 400)
      const purchaseGroups = [100, 200, 300, 400];
      const randomPG = purchaseGroups[Math.floor(Math.random() * purchaseGroups.length)];
      
      // Random number of articles (1-3)
      const numArticles = Math.floor(Math.random() * 3) + 1;
      const articles = [];
      const availableArticles = [...sampleArticles[randomPG]];
      
      for (let i = 0; i < numArticles; i++) {
        if (availableArticles.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableArticles.length);
          articles.push(availableArticles.splice(randomIndex, 1)[0]);
        }
      }

      // Random photo status (only new shoot options)
      const photoStatuses = ['New Shoot - Photographer', 'New Shoot - Photo Box'];
      const randomPhotoStatus = photoStatuses[Math.floor(Math.random() * photoStatuses.length)];
      
      // Create realistic PMR data
      const simulatedData = articles.map(article => ({
        eventId: `A${weekNum.toString().padStart(2, '0')}25${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
        purchaseGroup: randomPG,
        offerId: `1076${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        articleNumber: article.number,
        articleName: article.name,
        imageRequestId: Math.floor(Math.random() * 1000000).toString(),
        photoStatus: randomPhotoStatus,
        cloudinaryUrl: null
      }));

      // Fill the textarea with simulated data
      const textarea = document.getElementById('sapJsonInput');
      textarea.value = JSON.stringify(simulatedData, null, 2);
      
      // Show success message
      const purchaseGroupName = purchaseGroups[randomPG] || 'Unknown';
      alert(`🎲 Generated ${articles.length} ${randomPhotoStatus.toLowerCase()} request(s) for Purchase Group ${randomPG} (${purchaseGroupName})`);
    };

    // Filter orders by status from dashboard tiles and order view tiles
    window.filterOrdersByStatus = function(statusFilter) {
      // Show orders view with filter applied
      showView('orders');
      
      // Apply the filter after a short delay to ensure the view is loaded
      setTimeout(() => {
        if (!window.allOrders) {
          // Create some sample data if allOrders is not available
          window.allOrders = [
            { orderNumber: 'ORD001', title: 'Sample Order 1', status: 'Draft', priority: 'Medium', photographer: 'John Doe', method: 'Digital', deadline: '2025-09-10', purchaseGroup: 'PG1', eventId: 'E001' },
            { orderNumber: 'ORD002', title: 'Sample Order 2', status: 'Pending', priority: 'High', photographer: 'Jane Smith', method: 'Print', deadline: '2025-09-12', purchaseGroup: 'PG2', eventId: 'E002' },
            { orderNumber: 'ORD003', title: 'Sample Order 3', status: 'Approved', priority: 'Medium', photographer: 'Bob Wilson', method: 'Digital', deadline: '2025-09-15', purchaseGroup: 'PG1', eventId: 'E003' },
            { orderNumber: 'ORD004', title: 'Sample Order 4', status: 'In Progress', priority: 'Low', photographer: 'Alice Brown', method: 'Print', deadline: '2025-09-18', purchaseGroup: 'PG3', eventId: 'E004' },
            { orderNumber: 'ORD005', title: 'Sample Order 5', status: 'Complete', priority: 'High', photographer: 'Mike Davis', method: 'Digital', deadline: '2025-09-20', purchaseGroup: 'PG2', eventId: 'E005' }
          ];
        }
        
        if (!window.authSystem) {
          window.authSystem = {
            getFilteredOrders: function(orders) {
              return orders || [];
            }
          };
        }
        
        const ordersList = window.authSystem.getFilteredOrders(window.allOrders);
        let filteredOrders = [];
        let filterTitle = '';
        
        switch(statusFilter) {
          case 'all':
            filteredOrders = ordersList;
            filterTitle = 'All Orders';
            break;
          case 'urgent':
            filteredOrders = ordersList.filter(o => 
              o.priority === 'High' || 
              o.priority === 'Critical' ||
              o.priority === 'Urgent'
            );
            filterTitle = 'Urgent Orders';
            break;
          case 'overdue':
            const overdueToday = new Date();
            overdueToday.setHours(23, 59, 59, 999);
            filteredOrders = ordersList.filter(o => {
              const deadline = new Date(o.deadline);
              return deadline < overdueToday && 
                o.status !== 'Complete' && 
                o.status !== 'Completed' &&
                o.status !== 'Delivered' &&
                o.status !== 'Archived';
            });
            filterTitle = 'Overdue Orders';
            break;
          case 'today':
            const todayStr = new Date().toISOString().split('T')[0];
            filteredOrders = ordersList.filter(o => o.deadline === todayStr);
            filterTitle = "Today's Deadlines";
            break;
          case 'draft':
            filteredOrders = ordersList.filter(o => 
              o.status === 'Draft' || 
              o.status === 'New Request'
            );
            filterTitle = 'Draft Orders';
            break;
          case 'pending':
            filteredOrders = ordersList.filter(o => 
              o.status === 'Pending Approval' || 
              o.status === 'Pending'
            );
            filterTitle = 'Pending Orders';
            break;
          case 'approved':
            filteredOrders = ordersList.filter(o => 
              o.status === 'Approved'
            );
            filterTitle = 'Approved Orders';
            break;
          case 'samples':
            filteredOrders = ordersList.filter(o => 
              o.status === 'Samples Requested' || 
              o.status === 'Samples in Transit' ||
              o.status === 'Samples Received'
            );
            filterTitle = 'Samples Ready';
            break;
          case 'inprogress':
          case 'In Progress':
            filteredOrders = ordersList.filter(o => 
              o.status === 'In Progress' || 
              o.status === 'Photo Session' ||
              o.status === 'Processing'
            );
            filterTitle = 'In Progress Orders';
            break;
          case 'review':
            filteredOrders = ordersList.filter(o => 
              o.status === 'Review'
            );
            filterTitle = 'Orders in Review';
            break;
          case 'completed':
            filteredOrders = ordersList.filter(o => 
              o.status === 'Complete' || 
              o.status === 'Completed' ||
              o.status === 'Delivered' ||
              o.status === 'Archived'
            );
            filterTitle = 'Completed Orders';
            break;
          default:
            filteredOrders = ordersList;
            filterTitle = 'All Orders';
            break;
        }
        
        // Update the orders table with filtered results
        const ordersBody = document.getElementById('ordersBody');
        
        if (ordersBody) {
          // Create a temporary selectedItems for this view
          const selectedItems = new Set();
          
          const tableHTML = filteredOrders.map(o => {
            const commentCount = (o.comments || []).length;
            const unreadComments = window.commentSystem ? window.commentSystem.getUnreadCommentCount(o.orderNumber) : 0;
            
            const deadline = new Date(o.deadline);
            const today = new Date();
            const isOverdue = deadline < today && o.status !== 'Complete' && o.status !== 'Delivered';
            const deadlineStyle = isOverdue ? 'color: #dc2626; font-weight: bold;' : '';
            
            const progress = window.getOrderProgress ? window.getOrderProgress(o) : 50;
            
            return `
            <tr onclick="showOrderDetails && showOrderDetails('${o.orderNumber}')" style="cursor: pointer;" class="${selectedItems.has(o.orderNumber) ? 'selected-row' : ''}">
              <td class="bulk-checkbox" style="display: none;"><input type="checkbox" class="item-checkbox" data-id="${o.orderNumber}" onclick="event.stopPropagation()"></td>
              <td><strong>${o.orderNumber}</strong></td>
              <td>${o.title || 'Untitled'}</td>
              <td><span class="status ${(o.status || '').replace(/\s+/g, '')}">${o.status || 'Unknown'}</span></td>
              <td>${o.method || 'N/A'}</td>
              <td>${o.purchaseGroup ? `${o.purchaseGroup} - ${window.purchaseGroups && window.purchaseGroups[o.purchaseGroup] || 'Unknown'}` : 'N/A'}</td>
              <td>${o.eventId || 'N/A'}</td>
              <td>${o.photographer || 'N/A'}</td>
              <td><span class="status ${o.priority || 'Medium'}">${o.priority || 'Medium'}</span></td>
              <td style="${deadlineStyle}">${o.deadline || 'No deadline'}${isOverdue ? ' ⚠️' : ''}</td>
              <td style="width: 100px;">
                <div style="background: #f3f4f6; border-radius: 4px; height: 6px; overflow: hidden;">
                  <div style="background: ${window.getProgressColor ? window.getProgressColor(progress) : '#3b82f6'}; height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
                </div>
                <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">${progress}%</div>
              </td>
              <td style="text-align: center;">
                ${commentCount > 0 ? `
                  <div style="position: relative; display: inline-block;">
                    <span style="background: #3b82f6; color: white; border-radius: 12px; padding: 2px 8px; font-size: 11px; font-weight: 600;">${commentCount}</span>
                    ${unreadComments > 0 ? `<div style="position: absolute; top: -4px; right: -4px; background: #ef4444; color: white; border-radius: 50%; width: 12px; height: 12px; font-size: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${unreadComments}</div>` : ''}
                  </div>
                ` : '-'}
              </td>
            </tr>
            `;
          }).join('');
          
          ordersBody.innerHTML = tableHTML;
        } else {
          // ordersBody element not found
        }
        
        // Show filter info
        const mainContent = document.getElementById('mainContent');
        const existingFilter = mainContent?.querySelector('.filter-info');
        if (existingFilter) {
          existingFilter.remove();
        }
        
        if (statusFilter !== 'all') {
          const filterInfo = document.createElement('div');
          filterInfo.className = 'filter-info';
          filterInfo.style.cssText = 'background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 1px solid #0ea5e9; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;';
          filterInfo.innerHTML = `
            <div>
              <span style="color: #0284c7; font-weight: 600;">🔍 Filter Applied:</span>
              <span style="color: #1e40af; font-weight: 500; margin-left: 8px;">${filterTitle}</span>
              <span style="color: #6b7280; margin-left: 8px;">(${filteredOrders.length} ${filteredOrders.length === 1 ? 'order' : 'orders'})</span>
            </div>
            <button onclick="filterOrdersByStatus('all')" style="background: #0ea5e9; color: white; border: none; border-radius: 6px; padding: 6px 12px; font-size: 12px; cursor: pointer; font-weight: 500;">
              Clear Filter
            </button>
          `;
          
          const ordersView = document.getElementById('ordersView');
          const filterTiles = ordersView?.querySelector('[style*="Quick Filters"]')?.parentElement;
          if (filterTiles) {
            filterTiles.insertAdjacentElement('afterend', filterInfo);
          } else if (mainContent) {
            mainContent.insertBefore(filterInfo, mainContent.firstChild);
          }
        }
        
        // Update filter tile counts if function exists
        if (typeof window.updateFilterTileCounts === 'function') {
          window.updateFilterTileCounts();
        }
        
      }, 150);
    };

    // Function to update filter tile counts
    window.updateFilterTileCounts = function() {
      const ordersList = authSystem.getFilteredOrders(allOrders);
      
      // Update counts in filter tiles
      const updateCount = (id, count) => {
        const element = document.getElementById(id);
        if (element) {
          element.textContent = count;
        }
      };
      
      updateCount('allOrdersCount', ordersList.length);
      updateCount('draftOrdersCount', ordersList.filter(o => o.status === 'Draft' || o.status === 'New Request').length);
      updateCount('pendingOrdersCount', ordersList.filter(o => o.status === 'Pending Approval' || o.status === 'Pending').length);
      updateCount('approvedOrdersCount', ordersList.filter(o => o.status === 'Approved').length);
      updateCount('samplesOrdersCount', ordersList.filter(o => o.status === 'Samples Requested' || o.status === 'Samples in Transit' || o.status === 'Samples Received').length);
      updateCount('inProgressOrdersCount', ordersList.filter(o => o.status === 'In Progress' || o.status === 'Approved' || o.status === 'Photo Session' || o.status === 'Processing').length);
      updateCount('reviewOrdersCount', ordersList.filter(o => o.status === 'Review').length);
      updateCount('completedOrdersCount', ordersList.filter(o => o.status === 'Complete' || o.status === 'Completed' || o.status === 'Delivered' || o.status === 'Archived').length);
    };

    // Scanner functions
    function showScannerModal() {
      const modal = document.createElement('div');
      modal.id = 'scannerModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:500px;width:90%;">
          <h3 style="margin:0 0 16px;">📷 Scan Article</h3>
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 500; margin-bottom: 4px;">Article Name</label>
            <input id="scannedArticleName" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" 
                   placeholder="Scan or type article name...">
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 500; margin-bottom: 4px;">EAN Code</label>
            <input id="scannedEAN" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;" 
                   placeholder="Scan or type EAN barcode..." pattern="[0-9]{8,13}">
          </div>
          <div style="text-align:right;">
            <button id="cancelScanBtn" style="margin-right:8px;padding:8px 16px;border:1px solid #d1d5db;background:white;border-radius:4px;">Cancel</button>
            <button id="processScanBtn" style="padding:8px 16px;background:#2563eb;color:white;border:none;border-radius:4px;">Process Scan</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add event listeners
      document.getElementById('cancelScanBtn').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('processScanBtn').addEventListener('click', () => {
        processScanResult();
      });
      
      // Focus on article name input
      setTimeout(() => {
        document.getElementById('scannedArticleName').focus();
      }, 100);
    }

    function processScanResult() {
      const articleName = document.getElementById('scannedArticleName').value.trim();
      const eanCode = document.getElementById('scannedEAN').value.trim();
      
      if (!articleName || !eanCode) {
        alert('Please enter both article name and EAN code');
        return;
      }
      
      // Close modal
      const modal = document.getElementById('scannerModal');
      if (modal) {
        modal.remove();
      }
      
      const currentUser = authSystem.getCurrentUser();
      console.log('Current user:', currentUser);
      
      if (authSystem.canCreateOrders()) {
        console.log('User can create orders - calling addArticleToOrder');
        // For users who can create orders: add to order creation form
        addArticleToOrder(articleName, eanCode);
      } else if (currentUser.role === 'Photographer' || currentUser.role === 'Photo Box') {
        console.log('User is photographer/photo box - calling searchOrdersByArticle');
        // For photographers/photo box: search for orders with this article
        searchOrdersByArticle(articleName, eanCode);
      }
    }

    // Make processScanResult globally accessible
    window.processScanResult = processScanResult;

    // Buyer management functions
    function addBuyer() {
      const container = document.getElementById('buyersContainer');
      const buyerDiv = document.createElement('div');
      buyerDiv.className = 'buyer-item';
      buyerDiv.style.cssText = 'display: grid; grid-template-columns: 200px 1fr auto; gap: 8px; align-items: center; margin-bottom: 8px;';
      buyerDiv.innerHTML = `
        <input type="text" class="buyer-name" placeholder="Buyer/Department" style="padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
        <input type="text" class="buyer-items" placeholder="Items for this buyer (comma-separated)" style="padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
        <button type="button" onclick="removeBuyer(this)" style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; font-size: 12px;">✕</button>
      `;
      container.insertBefore(buyerDiv, document.getElementById('addBuyerBtn'));
    }

    function removeBuyer(button) {
      button.parentElement.remove();
    }

    function collectBuyersData() {
      const buyers = [];
      document.querySelectorAll('.buyer-item').forEach(item => {
        const name = item.querySelector('.buyer-name').value.trim();
        const items = item.querySelector('.buyer-items').value.trim();
        if (name && items) {
          buyers.push({
            name: name,
            items: items.split(',').map(i => i.trim()).filter(i => i)
          });
        }
      });
      return buyers;
    }

    // Make functions globally accessible
    window.addBuyer = addBuyer;
    window.removeBuyer = removeBuyer;

    // Excel/CSV Import functionality
    function showExcelImportModal() {
      const modal = document.createElement('div');
      modal.id = 'excelImportModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:800px;width:95%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 20px;">📋 Import Orders from Excel/CSV</h3>
          
          <!-- Required Headers Section -->
          <div id="headersSection" style="margin-bottom: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h4 style="margin: 0 0 12px; color: #1e40af; font-size: 16px;">📋 Required Excel/CSV Headers</h4>
            <div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #cbd5e1; margin-bottom: 12px;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; font-family: monospace; font-size: 12px; font-weight: 600; color: #374151;">
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Title</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Method</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Priority</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Deadline</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Brief</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Articles</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Deliverables</div>
                <div style="padding: 6px; background: #f1f5f9; border-radius: 4px;">Photographer</div>
              </div>
            </div>
            <div style="font-size: 14px; color: #64748b; line-height: 1.5;">
              <strong>Notes:</strong><br>
              • <strong>Method:</strong> Photographer, Photo Box, External Studio, Internal Studio<br>
              • <strong>Priority:</strong> Low, Medium, High, Critical<br>
              • <strong>Deadline:</strong> YYYY-MM-DD format (e.g., 2025-09-15)<br>
              • <strong>Articles & Deliverables:</strong> Separate multiple items with semicolons (;)
            </div>
          </div>
          
          <!-- File Upload Section -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #374151;">Select Excel/CSV File</label>
            <input type="file" id="excelFileInput" accept=".xlsx,.xls,.csv" 
                   style="width: 100%; padding: 12px; border: 2px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; cursor: pointer;">
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Supports .xlsx, .xls, and .csv files</div>
          </div>
          
          <!-- Preview Section -->
          <div id="previewSection" style="display: none; margin-bottom: 20px;">
            <h4 style="margin: 0 0 12px; color: #059669; font-size: 16px;">📊 Data Preview</h4>
            <div id="previewContent" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; max-height: 300px; overflow: auto;"></div>
            <div id="previewStats" style="margin-top: 8px; font-size: 14px; color: #64748b;"></div>
          </div>
          
          <!-- Actions -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div id="validationMessage" style="color: #dc2626; font-size: 14px; font-weight: 500;"></div>
            <div>
              <button id="cancelExcelImport" style="margin-right:12px;padding:10px 20px;border:1px solid #d1d5db;background:white;border-radius:6px;font-weight:500;cursor:pointer;">Cancel</button>
              <button id="processExcelImport" style="padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:6px;font-weight:500;cursor:pointer;" disabled>Import Orders</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add event listeners
      document.getElementById('cancelExcelImport').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('processExcelImport').addEventListener('click', () => {
        processExcelImport();
      });
      
      document.getElementById('excelFileInput').addEventListener('change', (e) => {
        handleFileUpload(e.target.files[0]);
      });
      
      // ESC key to close modal
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
    }

    let currentImportData = null;

    function handleFileUpload(file) {
      if (!file) return;
      
      const validationMessage = document.getElementById('validationMessage');
      const previewSection = document.getElementById('previewSection');
      const processButton = document.getElementById('processExcelImport');
      
      // Reset UI
      validationMessage.textContent = '';
      previewSection.style.display = 'none';
      processButton.disabled = true;
      
      const fileName = file.name.toLowerCase();
      
      if (fileName.endsWith('.csv')) {
        // Handle CSV file
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const csvData = e.target.result;
            const parsedData = parseCSV(csvData);
            showPreview(parsedData);
          } catch (error) {
            validationMessage.textContent = 'Error reading CSV file: ' + error.message;
          }
        };
        reader.readAsText(file);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        // Handle Excel file - basic implementation
        validationMessage.textContent = 'Excel files need to be saved as CSV format first. Please save your Excel file as .csv and upload again.';
        validationMessage.style.color = '#f59e0b';
      } else {
        validationMessage.textContent = 'Please select a .csv, .xlsx, or .xls file.';
      }
    }

    function parseCSV(csvData) {
      const lines = csvData.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('File must contain at least a header row and one data row');
      }
      
      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      // Required headers
      const requiredHeaders = ['Title', 'Method', 'Priority', 'Deadline', 'Brief', 'Articles', 'Deliverables', 'Photographer'];
      const missingHeaders = requiredHeaders.filter(req => !headers.some(h => h.toLowerCase() === req.toLowerCase()));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
      }
      
      // Parse data rows
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = parseCSVLine(line);
        if (values.length > 0) {
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(row);
        }
      }
      
      return { headers, data };
    }

    function parseCSVLine(line) {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      result.push(current.trim());
      return result;
    }

    function showPreview(parsedData) {
      const { headers, data } = parsedData;
      const previewSection = document.getElementById('previewSection');
      const previewContent = document.getElementById('previewContent');
      const previewStats = document.getElementById('previewStats');
      const processButton = document.getElementById('processExcelImport');
      
      // Store data for processing
      currentImportData = parsedData;
      
      // Create preview table
      let tableHTML = `
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #3b82f6; color: white;">
              ${headers.map(h => `<th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.slice(0, 5).map(row => `
              <tr style="background: white;">
                ${headers.map(h => `<td style="padding: 8px; border: 1px solid #e5e7eb;">${row[h] || ''}</td>`).join('')}
              </tr>
            `).join('')}
            ${data.length > 5 ? `
              <tr style="background: #f8fafc;">
                <td colspan="${headers.length}" style="padding: 12px; text-align: center; color: #64748b; font-style: italic;">
                  ... and ${data.length - 5} more rows
                </td>
              </tr>
            ` : ''}
          </tbody>
        </table>
      `;
      
      previewContent.innerHTML = tableHTML;
      previewStats.innerHTML = `
        <strong>${data.length} orders</strong> found in file. 
        <span style="color: #059669;">✓ Headers validated</span>
      `;
      
      // Show preview and enable import button
      previewSection.style.display = 'block';
      processButton.disabled = false;
    }

    function processExcelImport() {
      if (!currentImportData) {
        document.getElementById('validationMessage').textContent = 'Please select and preview a file first.';
        return;
      }
      
      const { data } = currentImportData;
      let importedCount = 0;
      let errors = [];
      
      try {
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          
          // Validate required fields
          if (!row.Title || !row.Title.trim()) {
            errors.push(`Row ${i + 2}: Title is required`);
            continue;
          }
          
          // Generate unique order number
          const orderNumber = `ORD-2025-${String(allOrders.length + importedCount + 1).padStart(3, '0')}`;
          
          // Create new order object
          const newOrder = {
            orderNumber: orderNumber,
            title: row.Title.trim(),
            status: 'Draft',
            method: row.Method || 'Photographer',
            photographer: row.Photographer || 'Unassigned',
            assignedTo: row.Photographer ? authSystem.getUserIdByName(row.Photographer) : null,
            deadline: validateDate(row.Deadline) || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            costCenter: 'CC-IMPORT',
            priority: validatePriority(row.Priority) || 'Medium',
            brief: row.Brief || 'Imported from Excel/CSV',
            articles: row.Articles ? row.Articles.split(';').map(a => a.trim()).filter(a => a) : [],
            budget: null,
            deliverables: row.Deliverables ? row.Deliverables.split(';').map(d => d.trim()).filter(d => d) : [],
            
            // SAP PMR fields (auto-generated)
            eventId: `A${Math.floor(Math.random() * 9000000) + 1000000}`,
            purchaseGroup: authSystem.getCurrentUser().purchaseGroups ? authSystem.getCurrentUser().purchaseGroups[0] : 100,
            offerId: `1076${Math.floor(Math.random() * 9000) + 1000}`,
            articleNumber: `ART-IMP-${String(importedCount + 1).padStart(3, '0')}`,
            articleName: row.Articles ? row.Articles.split(';')[0] : row.Title,
            imageRequestId: String(Math.floor(Math.random() * 900000) + 100000),
            photoStatus: 'New Request',
            cloudinaryUrl: null,
            
            // Creator and assignment fields
            createdBy: authSystem.getCurrentUser().id,
            createdAt: new Date().toISOString(),
            assignedTo: row.Photographer ? authSystem.getUserIdByName(row.Photographer) : null,
            updatedAt: new Date().toISOString(),
            comments: []
          };
          
          // Add to orders array
          allOrders.unshift(newOrder);
          importedCount++;
        }
        
        // Close modal
        document.getElementById('excelImportModal').remove();
        
        // Update global orders and refresh view
        window.allOrders = allOrders;
        if (typeof drawOrderRows === 'function') {
          drawOrderRows();
        }
        if (typeof window.updateQuickActionBadges === 'function') {
          window.updateQuickActionBadges();
        }
        
        // Show success message
        let message = `Successfully imported ${importedCount} orders!`;
        if (errors.length > 0) {
          message += ` (${errors.length} rows had errors and were skipped)`;
          console.warn('Import errors:', errors);
        }
        showToast(message, 'success');
        
      } catch (error) {
        document.getElementById('validationMessage').textContent = 'Error processing data: ' + error.message;
        console.error('Import error:', error);
      }
    }

    // Helper functions for validation
    function validateDate(dateStr) {
      if (!dateStr) return null;
      
      // Try to parse various date formats
      const formats = [
        /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
        /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
        /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
      ];
      
      for (let format of formats) {
        if (format.test(dateStr)) {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
      }
      
      return null;
    }

    function validatePriority(priority) {
      const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
      return validPriorities.find(p => p.toLowerCase() === priority?.toLowerCase()) || null;
    }

    // Expose Excel import function globally
    window.showExcelImportModal = showExcelImportModal;

    function addArticleToOrder(articleName, eanCode) {
      // Open create order view if not already open
      if (currentView !== 'create') {
        showView('create');
      }
      
      // Add article to the articles textarea
      const articlesTextarea = document.getElementById('articlesTextarea');
      const articleEntry = `${articleName} [EAN: ${eanCode}]`;
      
      if (articlesTextarea.value) {
        articlesTextarea.value += '\\n' + articleEntry;
      } else {
        articlesTextarea.value = articleEntry;
      }
      
      // Show success message
      showToast(`Article "${articleName}" added to order`, 'success');
    }

    function searchOrdersByArticle(articleName, eanCode) {
      console.log('searchOrdersByArticle called with:', articleName, eanCode);
      console.log('Total orders to search:', allOrders.length);
      
      const matchingOrders = allOrders.filter(order => {
        if (!order.articles) return false;
        
        return order.articles.some(article => {
          const articleText = typeof article === 'string' ? article : article.name;
          const nameMatch = articleText.toLowerCase().includes(articleName.toLowerCase());
          const eanMatch = articleText.includes(eanCode);
          console.log('Checking article:', articleText, 'Name match:', nameMatch, 'EAN match:', eanMatch);
          return nameMatch || eanMatch;
        });
      });
      
      console.log('Matching orders found:', matchingOrders.length);
      
      if (matchingOrders.length === 0) {
        showToast(`No orders found for article "${articleName}" [EAN: ${eanCode}]`, 'info');
        return;
      }
      
      // Show search results modal
      const modal = document.createElement('div');
      modal.id = 'searchResultsModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:800px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px;">🔍 Orders containing "${articleName}" [EAN: ${eanCode}]</h3>
          <div style="margin-bottom: 16px;" id="searchResultsList">
            ${matchingOrders.map((order, index) => `
              <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-bottom: 8px; cursor: pointer;"
                   data-order-number="${order.orderNumber}" class="search-result-item">
                <div style="font-weight: 600; color: #1f2937;">${order.orderNumber} - ${order.title}</div>
                <div style="color: #6b7280; font-size: 14px;">Status: ${order.status} | Assigned: ${order.photographer}</div>
                <div style="color: #374151; font-size: 12px; margin-top: 4px;">
                  Articles: ${Array.isArray(order.articles) ? order.articles.join(', ') : order.articles || 'None'}
                </div>
              </div>
            `).join('')}
          </div>
          <div style="text-align:right;">
            <button id="closeSearchResults" style="padding:8px 16px;border:1px solid #d1d5db;background:white;border-radius:4px;">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add event listeners for search results
      document.getElementById('closeSearchResults').addEventListener('click', () => {
        modal.remove();
      });
      
      // Add click listeners for each result item
      document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const orderNumber = item.dataset.orderNumber;
          modal.remove();
          showOrderDetails(orderNumber);
        });
      });
      
      showToast(`Found ${matchingOrders.length} order(s) with this article`, 'success');
    }

    // Navigation event handlers (removed redundant bottom button listeners)
    document.getElementById('backFromTemplates')?.addEventListener('click', () => showView('orders'));
    document.getElementById('backFromWorkflow')?.addEventListener('click', () => showView('orders'));
    
    // Calendar navigation handlers
    document.getElementById('calendarPrevious')?.addEventListener('click', () => {
      if (calendarViewType === 'week') {
        calendarDate.setDate(calendarDate.getDate() - 7);
      } else if (calendarViewType === 'month') {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
      } else if (calendarViewType === 'year') {
        calendarDate.setFullYear(calendarDate.getFullYear() - 1);
      }
      drawCalendarView();
    });
    
    document.getElementById('calendarNext')?.addEventListener('click', () => {
      if (calendarViewType === 'week') {
        calendarDate.setDate(calendarDate.getDate() + 7);
      } else if (calendarViewType === 'month') {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
      } else if (calendarViewType === 'year') {
        calendarDate.setFullYear(calendarDate.getFullYear() + 1);
      }
      drawCalendarView();
    });
    
    document.getElementById('calendarToday')?.addEventListener('click', () => {
      calendarDate = new Date();
      drawCalendarView();
    });
    
    // Calendar view type handlers
    document.getElementById('weekView')?.addEventListener('click', () => {
      calendarViewType = 'week';
      drawCalendarView();
    });
    
    document.getElementById('monthView')?.addEventListener('click', () => {
      calendarViewType = 'month';
      drawCalendarView();
    });
    
    document.getElementById('yearView')?.addEventListener('click', () => {
      calendarViewType = 'year';
      drawCalendarView();
    });
    
    // Scanner event handlers
    document.getElementById('scanArticleBtn')?.addEventListener('click', showScannerModal);
    
    // Template selection
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        const templateKey = card.getAttribute('data-template');
        applyTemplate(templateKey);
      });
    });
    
    // Bulk actions
    document.getElementById('toggleBulkMode')?.addEventListener('click', toggleBulkMode);
    document.getElementById('clearSelection')?.addEventListener('click', () => {
      selectedItems.clear();
      drawOrderRows();
    });
    
    document.getElementById('bulkUpdateStatus')?.addEventListener('click', () => {
      if (selectedItems.size === 0) return;
      
      const modal = document.createElement('div');
      modal.id = 'bulkStatusModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:400px;box-shadow:0 10px 25px rgba(0,0,0,0.2);">
          <h3 style="margin:0 0 16px;color:#1f2937;font-size:18px;font-weight:600;">Update Status for ${selectedItems.size} items</h3>
          <select id="newStatus" style="width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;margin-bottom:20px;font-size:14px;background:white;">
            <option value="Draft">Draft</option>
            <option value="Approved">Approved</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
          <div style="display:flex;gap:12px;justify-content:flex-end;">
            <button id="cancelBulkUpdate" style="padding:10px 20px;border:1px solid #d1d5db;background:white;border-radius:6px;color:#6b7280;font-weight:500;cursor:pointer;transition:all 0.2s;">Cancel</button>
            <button id="confirmBulkUpdate" style="padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:6px;font-weight:500;cursor:pointer;transition:all 0.2s;">Update</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add event listeners
      document.getElementById('cancelBulkUpdate').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('confirmBulkUpdate').addEventListener('click', () => {
        updateSelectedStatuses();
        modal.remove();
      });
      
      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Close on ESC key
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
      
      // Clean up event listener when modal is removed
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === modal) {
              document.removeEventListener('keydown', handleEsc);
              observer.disconnect();
            }
          });
        });
      });
      observer.observe(document.body, { childList: true });
    });
    
    window.updateSelectedStatuses = function() {
      const newStatus = document.getElementById('newStatus').value;
      let completedCount = 0;
      
      selectedItems.forEach(orderNumber => {
        const order = allOrders.find(o => o.orderNumber === orderNumber);
        if (order) {
          order.status = newStatus;
          order.updatedAt = new Date().toISOString();
          if (newStatus === 'Complete') {
            completedCount++;
          }
        }
      });
      
      // Trigger confetti if any orders were completed
      if (completedCount > 0) {
        triggerConfetti();
      }
      
      selectedItems.clear();
      drawOrderRows();
      updateBulkActionsPanel();
      
      // Show success
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = 'Status updated successfully!';
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    // Bulk Assign event listener
    document.getElementById('bulkAssign')?.addEventListener('click', () => {
      if (selectedItems.size === 0) return;
      
      const modal = document.createElement('div');
      modal.id = 'bulkAssignModal';
      modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
      modal.innerHTML = `
        <div style="background:white;border-radius:12px;padding:24px;max-width:400px;box-shadow:0 10px 25px rgba(0,0,0,0.2);">
          <h3 style="margin:0 0 16px;color:#1f2937;font-size:18px;font-weight:600;">Assign ${selectedItems.size} items to:</h3>
          <select id="newAssignee" style="width:100%;padding:12px;border:1px solid #d1d5db;border-radius:8px;margin-bottom:20px;font-size:14px;background:white;">
            <option value="">Unassigned</option>
            <option value="photographer1">John Smith</option>
            <option value="photographer2">Sarah Johnson</option>
            <option value="photographer3">Mike Wilson</option>
            <option value="photographer4">Emily Davis</option>
          </select>
          <div style="display:flex;gap:12px;justify-content:flex-end;">
            <button id="cancelBulkAssign" style="padding:10px 20px;border:1px solid #d1d5db;background:white;border-radius:6px;color:#6b7280;font-weight:500;cursor:pointer;transition:all 0.2s;">Cancel</button>
            <button id="confirmBulkAssign" style="padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:6px;font-weight:500;cursor:pointer;transition:all 0.2s;">Assign</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add event listeners
      document.getElementById('cancelBulkAssign').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('confirmBulkAssign').addEventListener('click', () => {
        assignSelectedItems();
        modal.remove();
      });
      
      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Close on ESC key
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
      
      // Clean up event listener when modal is removed
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === modal) {
              document.removeEventListener('keydown', handleEsc);
              observer.disconnect();
            }
          });
        });
      });
      observer.observe(document.body, { childList: true });
    });

    // Bulk Export event listener
    document.getElementById('bulkExport')?.addEventListener('click', () => {
      if (selectedItems.size === 0) {
        alert('Please select items to export');
        return;
      }
      
      const selectedOrders = allOrders.filter(order => selectedItems.has(order.orderNumber));
      
      // Create CSV content
      const headers = ['Order Number', 'Title', 'Status', 'Method', 'Purchase Group', 'Photographer', 'Deadline', 'Cost Center'];
      const csvContent = [
        headers.join(','),
        ...selectedOrders.map(order => [
          order.orderNumber,
          `"${order.title || ''}"`,
          order.status,
          order.method,
          order.purchaseGroup,
          order.photographer || 'Unassigned',
          order.deadline || '',
          order.costCenter || ''
        ].join(','))
      ].join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `selected_orders_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = `${selectedItems.size} orders exported successfully!`;
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    });

    window.assignSelectedItems = function() {
      const newAssignee = document.getElementById('newAssignee').value;
      const assigneeName = newAssignee ? document.getElementById('newAssignee').selectedOptions[0].textContent : 'Unassigned';
      
      selectedItems.forEach(orderNumber => {
        const order = allOrders.find(o => o.orderNumber === orderNumber);
        if (order) {
          order.assignedTo = newAssignee;
          order.photographer = assigneeName;
          order.updatedAt = new Date().toISOString();
        }
      });
      
      selectedItems.clear();
      drawOrderRows();
      updateBulkActionsPanel();
      
      // Show success
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = 'Items assigned successfully!';
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    // Select All checkbox event listener
    document.getElementById('selectAllOrders')?.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const visibleRows = document.querySelectorAll('#ordersView tbody tr:not([style*="display: none"])');
      
      visibleRows.forEach(row => {
        const checkbox = row.querySelector('.item-checkbox');
        if (checkbox) {
          const orderId = checkbox.getAttribute('data-id');
          checkbox.checked = isChecked;
          
          if (isChecked) {
            selectedItems.add(orderId);
          } else {
            selectedItems.delete(orderId);
          }
        }
      });
      
      updateBulkActionsPanel();
    });

    // Create order form handler
    document.getElementById('createOrderForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const buyersData = collectBuyersData();
      
      // Collect selected photo types
      const selectedPhotoTypes = Array.from(document.querySelectorAll('input[name="photoTypes"]:checked')).map(cb => cb.value);
      
      const newOrder = {
        orderNumber: `ORD-2025-${String(allOrders.length + 1).padStart(3, '0')}`,
        title: formData.get('title'),
        status: 'Draft',
        method: formData.get('method'),
        photographer: formData.get('photographer') || 'Unassigned',
        assignedTo: formData.get('photographer') ? authSystem.getUserIdByName(formData.get('photographer')) : null,
        deadline: formData.get('deadline'),
        costCenter: 'CC-NEW',
        priority: formData.get('priority'),
        brief: formData.get('brief'),
        articles: formData.get('articles').split('\\n').map(a => a.trim()).filter(a => a),
        buyers: buyersData.length > 0 ? buyersData : null,
        budget: formData.get('budget') ? Number(formData.get('budget')) : null,
        deliverables: formData.get('deliverables') ? formData.get('deliverables').split(',').map(d => d.trim()).filter(d => d) : [],
        photoTypes: selectedPhotoTypes.length > 0 ? selectedPhotoTypes : ['Product'], // Default to Product if none selected
        createdBy: authSystem.getCurrentUser().id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: []
      };
      
      allOrders.unshift(newOrder);
      showView('orders');
      
      // Show success message
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = 'Order created successfully!';
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    });

    document.getElementById('cancelCreate')?.addEventListener('click', () => showView('orders'));
    
    // Add buyer button event listener
    document.getElementById('addBuyerBtn')?.addEventListener('click', addBuyer);
    
    // Apply template rules button event listener
    document.getElementById('applyTemplateRulesBtn')?.addEventListener('click', () => {
      window.applyTemplateRulesToForm();
    });
    
    // Excel import button event listener
    document.getElementById('excelImportBtn')?.addEventListener('click', showExcelImportModal);
    
    // Placeholder items button event listener
    document.getElementById('placeholderItemsBtn')?.addEventListener('click', window.showPlaceholderItemsModal);
    
    // Template rules button event listener
    document.getElementById('templateRulesBtn')?.addEventListener('click', window.showTemplateRulesModal);
    
    // Historical suggestions button event listener
    document.getElementById('historicalSuggestionsBtn')?.addEventListener('click', window.showHistoricalSuggestionsModal);
    
    // DAM integration button event listener
    document.getElementById('damIntegrationBtn')?.addEventListener('click', window.showDAMIntegrationModal);
    document.getElementById('customizationRequestBtn')?.addEventListener('click', window.showCustomizationRequestModal);

    // Placeholder Items Management System
    window.showPlaceholderItemsModal = function() {
      const placeholderItems = window.getPlaceholderItems();
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = `
        <div style="background:white;padding:24px;border-radius:12px;max-width:800px;width:90%;max-height:90%;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="margin:0;font-size:20px;font-weight:600;">Placeholder Items Management</h2>
            <button id="closePlaceholderModal" style="background:none;border:none;font-size:24px;cursor:pointer;">×</button>
          </div>
          
          <div style="margin-bottom:20px;">
            <p style="color:#6b7280;margin-bottom:16px;">Create placeholder items for products that haven't been registered yet. This allows you to plan photo shoots and create orders in advance.</p>
            
            <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin-bottom:20px;">
              <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">Create New Placeholder Item</h3>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
                <div>
                  <label style="display:block;font-weight:500;margin-bottom:4px;">Placeholder ID</label>
                  <input id="placeholderIdInput" type="text" placeholder="e.g., TEMP-001, PLH-2025-001" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                  <label style="display:block;font-weight:500;margin-bottom:4px;">Category</label>
                  <select id="placeholderCategoryInput" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                    <option value="clothing">Clothing</option>
                    <option value="accessories">Accessories</option>
                    <option value="electronics">Electronics</option>
                    <option value="home-decor">Home Decor</option>
                    <option value="sports">Sports</option>
                    <option value="beauty">Beauty</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div style="margin-bottom:12px;">
                <label style="display:block;font-weight:500;margin-bottom:4px;">Description</label>
                <input id="placeholderDescInput" type="text" placeholder="Brief description of the item" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
                <div>
                  <label style="display:block;font-weight:500;margin-bottom:4px;">Expected Registration Date</label>
                  <input id="placeholderExpectedDateInput" type="date" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                  <label style="display:block;font-weight:500;margin-bottom:4px;">Priority</label>
                  <select id="placeholderPriorityInput" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div style="margin-bottom:12px;">
                <label style="display:block;font-weight:500;margin-bottom:4px;">Notes</label>
                <textarea id="placeholderNotesInput" placeholder="Additional notes, requirements, or specifications" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;min-height:60px;resize:vertical;"></textarea>
              </div>
              <button id="createPlaceholderBtn" style="padding:8px 16px;background:#f59e0b;color:white;border:none;border-radius:4px;cursor:pointer;">Create Placeholder Item</button>
            </div>
          </div>
          
          <div>
            <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">Existing Placeholder Items</h3>
            <div id="placeholderItemsList">
              ${placeholderItems.length === 0 ? 
                '<p style="color:#6b7280;font-style:italic;">No placeholder items created yet.</p>' :
                placeholderItems.map(item => `
                  <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px;background:${item.priority === 'urgent' ? '#fef3c7' : item.priority === 'high' ? '#fecaca' : '#f9fafb'};">
                    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                      <div style="flex:1;">
                        <h4 style="margin:0 0 4px 0;font-size:14px;font-weight:600;">${item.id}</h4>
                        <p style="margin:0 0 4px 0;color:#6b7280;font-size:13px;">${item.description}</p>
                        <div style="display:flex;gap:12px;font-size:12px;color:#6b7280;">
                          <span>📂 ${item.category}</span>
                          <span>⏰ ${item.priority}</span>
                          <span>📅 Expected: ${item.expectedDate || 'Not set'}</span>
                        </div>
                      </div>
                      <div style="display:flex;gap:8px;">
                        <button onclick="createOrderFromPlaceholder('${item.id}')" style="padding:4px 8px;background:#3b82f6;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">Create Order</button>
                        <button onclick="editPlaceholderItem('${item.id}')" style="padding:4px 8px;background:#6b7280;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">Edit</button>
                        <button onclick="deletePlaceholderItem('${item.id}')" style="padding:4px 8px;background:#ef4444;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">Delete</button>
                      </div>
                    </div>
                    ${item.notes ? `<p style="margin:8px 0 0 0;font-size:12px;color:#4b5563;background:#f3f4f6;padding:8px;border-radius:4px;">${item.notes}</p>` : ''}
                  </div>
                `).join('')
              }
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Set default expected date to 30 days from now
      const expectedDateInput = document.getElementById('placeholderExpectedDateInput');
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      expectedDateInput.value = defaultDate.toISOString().split('T')[0];
      
      // Event listeners
      document.getElementById('closePlaceholderModal').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('createPlaceholderBtn').addEventListener('click', () => {
        window.createPlaceholderItem();
        // Refresh the modal content
        modal.remove();
        window.showPlaceholderItemsModal();
      });
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }

    function getPlaceholderItems() {
      const items = localStorage.getItem('placeholderItems');
      return items ? JSON.parse(items) : [];
    }

    function savePlaceholderItems(items) {
      localStorage.setItem('placeholderItems', JSON.stringify(items));
    }

    window.createPlaceholderItem = function() {
      const id = document.getElementById('placeholderIdInput').value.trim();
      const category = document.getElementById('placeholderCategoryInput').value;
      const description = document.getElementById('placeholderDescInput').value.trim();
      const expectedDate = document.getElementById('placeholderExpectedDateInput').value;
      const priority = document.getElementById('placeholderPriorityInput').value;
      const notes = document.getElementById('placeholderNotesInput').value.trim();
      
      if (!id || !description) {
        alert('Please fill in the required fields (ID and Description)');
        return;
      }
      
      const placeholderItems = window.getPlaceholderItems();
      
      // Check if ID already exists
      if (placeholderItems.some(item => item.id === id)) {
        alert('A placeholder item with this ID already exists');
        return;
      }
      
      const newItem = {
        id,
        category,
        description,
        expectedDate,
        priority,
        notes,
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: authSystem.getCurrentUser().username,
        status: 'active'
      };
      
      placeholderItems.push(newItem);
      window.savePlaceholderItems(placeholderItems);
      
      // Clear form
      document.getElementById('placeholderIdInput').value = '';
      document.getElementById('placeholderDescInput').value = '';
      document.getElementById('placeholderNotesInput').value = '';
      
      // Show success message
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = `Placeholder item "${id}" created successfully!`;
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    function deletePlaceholderItem(itemId) {
      if (!confirm(`Are you sure you want to delete placeholder item "${itemId}"?`)) {
        return;
      }
      
      const placeholderItems = getPlaceholderItems();
      const updatedItems = placeholderItems.filter(item => item.id !== itemId);
      savePlaceholderItems(updatedItems);
      
      // Refresh the modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
        showPlaceholderItemsModal();
      }
    }

    function createOrderFromPlaceholder(itemId) {
      const placeholderItems = getPlaceholderItems();
      const item = placeholderItems.find(p => p.id === itemId);
      
      if (!item) {
        alert('Placeholder item not found');
        return;
      }
      
      // Close the modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
      }
      
      // Switch to create order view
      showView('create');
      
      // Pre-fill the form with placeholder item data
      setTimeout(() => {
        const articleInput = document.getElementById('articleNumber');
        const titleInput = document.getElementById('orderTitle');
        const commentsInput = document.getElementById('orderComments');
        const prioritySelect = document.getElementById('orderPriority');
        
        if (articleInput) articleInput.value = item.id;
        if (titleInput) titleInput.value = `Photo Order for ${item.description}`;
        if (commentsInput) commentsInput.value = `Placeholder item order: ${item.description}${item.notes ? '\n\nNotes: ' + item.notes : ''}`;
        if (prioritySelect) prioritySelect.value = item.priority;
        
        // Add placeholder indicator
        if (commentsInput) {
          commentsInput.value += '\n\n⚠️ This order uses a placeholder item. Please update the article number once the item is registered in the system.';
        }
      }, 100);
    }

    function editPlaceholderItem(itemId) {
      // For now, show a simple edit interface - could be expanded to a full edit modal
      const placeholderItems = getPlaceholderItems();
      const item = placeholderItems.find(p => p.id === itemId);
      
      if (!item) {
        alert('Placeholder item not found');
        return;
      }
      
      const newDescription = prompt('Edit description:', item.description);
      if (newDescription !== null && newDescription.trim()) {
        item.description = newDescription.trim();
        savePlaceholderItems(placeholderItems);
        
        // Refresh the modal
        const modal = document.querySelector('div[style*="position:fixed"]');
        if (modal) {
          modal.remove();
          window.showPlaceholderItemsModal();
        }
      }
    }

    // Advanced Template Rules Engine
    window.showTemplateRulesModal = function() {
      const templateRules = window.getTemplateRules();
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = `
        <div style="background:white;padding:24px;border-radius:12px;max-width:900px;width:95%;max-height:90%;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="margin:0;font-size:20px;font-weight:600;">Advanced Template Rules Engine</h2>
            <button id="closeTemplateRulesModal" style="background:none;border:none;font-size:24px;cursor:pointer;">×</button>
          </div>
          
          <div style="margin-bottom:24px;">
            <p style="color:#6b7280;margin-bottom:16px;">Configure intelligent rules that automatically include specific photo types based on item categories, keywords, and business logic. These rules help standardize photo requirements across your organization.</p>
            
            <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin-bottom:20px;">
              <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">Create New Template Rule</h3>
              
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
                <div>
                  <label style="display:block;font-weight:500;margin-bottom:4px;">Rule Name</label>
                  <input id="ruleNameInput" type="text" placeholder="e.g., Electronics Standard Package" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
                <div>
                  <label style="display:block;font-weight:500;margin-bottom:4px;">Priority</label>
                  <select id="rulePriorityInput" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                    <option value="1">High (1)</option>
                    <option value="2" selected>Medium (2)</option>
                    <option value="3">Low (3)</option>
                  </select>
                </div>
              </div>
              
              <div style="margin-bottom:12px;">
                <label style="display:block;font-weight:500;margin-bottom:4px;">Trigger Conditions</label>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
                  <select id="triggerTypeInput" style="padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                    <option value="category">Category Contains</option>
                    <option value="keyword">Article Contains</option>
                    <option value="supplier">Supplier Code</option>
                    <option value="price">Price Range</option>
                  </select>
                  <select id="triggerOperatorInput" style="padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                    <option value="contains">Contains</option>
                    <option value="equals">Equals</option>
                    <option value="starts">Starts With</option>
                    <option value="ends">Ends With</option>
                  </select>
                  <input id="triggerValueInput" type="text" placeholder="Value to match" style="padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                </div>
              </div>
              
              <div style="margin-bottom:12px;">
                <label style="display:block;font-weight:500;margin-bottom:4px;">Photo Types to Include</label>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;">
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Product"> Product Shot</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Lifestyle"> Lifestyle</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Detail"> Detail Shots</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="360"> 360° View</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Model"> Model Shots</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Size"> Size Guide</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Package"> Packaging</label>
                  <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" class="photoTypeCheckbox" value="Group"> Group Shot</label>
                </div>
              </div>
              
              <div style="margin-bottom:12px;">
                <label style="display:block;font-weight:500;margin-bottom:4px;">Additional Requirements</label>
                <textarea id="ruleRequirementsInput" placeholder="Specific photography requirements, styling notes, or technical specifications" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;min-height:60px;resize:vertical;"></textarea>
              </div>
              
              <div style="display:flex;gap:12px;">
                <button id="createTemplateRuleBtn" style="padding:8px 16px;background:#6366f1;color:white;border:none;border-radius:4px;cursor:pointer;">Create Rule</button>
                <button id="testRuleBtn" style="padding:8px 16px;background:#f59e0b;color:white;border:none;border-radius:4px;cursor:pointer;">Test Rule</button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">Active Template Rules</h3>
            <div id="templateRulesList">
              ${templateRules.length === 0 ? 
                '<p style="color:#6b7280;font-style:italic;">No template rules configured yet. Create rules to automatically include photo types based on item characteristics.</p>' :
                templateRules.map(rule => `
                  <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px;background:${rule.active ? '#f0fdf4' : '#fef3c7'};">
                    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                      <div style="flex:1;">
                        <h4 style="margin:0 0 4px 0;font-size:14px;font-weight:600;">${rule.name}</h4>
                        <p style="margin:0 0 4px 0;color:#6b7280;font-size:13px;">
                          When <strong>${rule.triggerType}</strong> ${rule.operator} "<strong>${rule.triggerValue}</strong>"
                        </p>
                        <div style="margin:8px 0;">
                          <span style="font-size:12px;color:#4b5563;font-weight:500;">Includes:</span>
                          ${rule.photoTypes.map(type => `<span style="display:inline-block;background:#ddd6fe;color:#5b21b6;padding:2px 6px;border-radius:12px;font-size:11px;margin:2px 4px 2px 0;">${type}</span>`).join('')}
                        </div>
                        <div style="display:flex;gap:12px;font-size:12px;color:#6b7280;">
                          <span>🎯 Priority: ${rule.priority}</span>
                          <span>📊 Used: ${rule.usageCount || 0} times</span>
                          <span>${rule.active ? '✅ Active' : '⏸️ Paused'}</span>
                        </div>
                      </div>
                      <div style="display:flex;gap:8px;flex-direction:column;">
                        <div style="display:flex;gap:4px;">
                          <button onclick="toggleTemplateRule('${rule.id}')" style="padding:4px 8px;background:${rule.active ? '#f59e0b' : '#10b981'};color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">
                            ${rule.active ? 'Pause' : 'Activate'}
                          </button>
                          <button onclick="editTemplateRule('${rule.id}')" style="padding:4px 8px;background:#6b7280;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">Edit</button>
                        </div>
                        <button onclick="deleteTemplateRule('${rule.id}')" style="padding:4px 8px;background:#ef4444;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;">Delete</button>
                      </div>
                    </div>
                    ${rule.requirements ? `<p style="margin:8px 0 0 0;font-size:12px;color:#4b5563;background:#f3f4f6;padding:8px;border-radius:4px;">${rule.requirements}</p>` : ''}
                  </div>
                `).join('')
              }
            </div>
          </div>
          
          <div style="margin-top:20px;padding:16px;background:#eff6ff;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#1e40af;">Smart Suggestions</h4>
            <p style="margin:0;font-size:12px;color:#1e40af;">
              💡 Consider creating rules for: High-value electronics (360° + Detail shots), Clothing items (Model + Size guide), 
              Home decor (Lifestyle + Group shots), Beauty products (Detail + Model shots)
            </p>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Event listeners
      document.getElementById('closeTemplateRulesModal').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('createTemplateRuleBtn').addEventListener('click', () => {
        window.createTemplateRule();
        modal.remove();
        window.showTemplateRulesModal();
      });
      
      document.getElementById('testRuleBtn').addEventListener('click', () => {
        window.testTemplateRule();
      });
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    };

    window.getTemplateRules = function() {
      const rules = localStorage.getItem('templateRules');
      return rules ? JSON.parse(rules) : [];
    };

    window.saveTemplateRules = function(rules) {
      localStorage.setItem('templateRules', JSON.stringify(rules));
    };

    window.createTemplateRule = function() {
      const name = document.getElementById('ruleNameInput').value.trim();
      const priority = parseInt(document.getElementById('rulePriorityInput').value);
      const triggerType = document.getElementById('triggerTypeInput').value;
      const operator = document.getElementById('triggerOperatorInput').value;
      const triggerValue = document.getElementById('triggerValueInput').value.trim();
      const requirements = document.getElementById('ruleRequirementsInput').value.trim();
      
      const photoTypes = Array.from(document.querySelectorAll('.photoTypeCheckbox:checked')).map(cb => cb.value);
      
      if (!name || !triggerValue || photoTypes.length === 0) {
        alert('Please fill in all required fields: Rule Name, Trigger Value, and select at least one Photo Type');
        return;
      }
      
      const templateRules = window.getTemplateRules();
      
      const newRule = {
        id: 'rule_' + Date.now(),
        name,
        priority,
        triggerType,
        operator,
        triggerValue: triggerValue.toLowerCase(),
        photoTypes,
        requirements,
        active: true,
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: authSystem.getCurrentUser().username,
        usageCount: 0
      };
      
      templateRules.push(newRule);
      // Sort by priority
      templateRules.sort((a, b) => a.priority - b.priority);
      window.saveTemplateRules(templateRules);
      
      // Clear form
      document.getElementById('ruleNameInput').value = '';
      document.getElementById('triggerValueInput').value = '';
      document.getElementById('ruleRequirementsInput').value = '';
      document.querySelectorAll('.photoTypeCheckbox').forEach(cb => cb.checked = false);
      
      // Show success message
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = `Template rule "${name}" created successfully!`;
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    window.testTemplateRule = function() {
      const triggerType = document.getElementById('triggerTypeInput').value;
      const operator = document.getElementById('triggerOperatorInput').value;
      const triggerValue = document.getElementById('triggerValueInput').value.trim().toLowerCase();
      const photoTypes = Array.from(document.querySelectorAll('.photoTypeCheckbox:checked')).map(cb => cb.value);
      
      if (!triggerValue || photoTypes.length === 0) {
        alert('Please enter a trigger value and select photo types to test');
        return;
      }
      
      // Test with sample data
      const testSamples = [
        { category: 'electronics', article: 'PHONE-IPHONE15', supplier: 'APPLE' },
        { category: 'clothing', article: 'SHIRT-COTTON-BLU', supplier: 'FASHION' },
        { category: 'home-decor', article: 'LAMP-TABLE-LED', supplier: 'DECOR' }
      ];
      
      const matches = testSamples.filter(sample => {
        let testValue = '';
        switch(triggerType) {
          case 'category': testValue = sample.category; break;
          case 'keyword': testValue = sample.article; break;
          case 'supplier': testValue = sample.supplier; break;
        }
        
        return window.matchesRule(testValue.toLowerCase(), operator, triggerValue);
      });
      
      alert(`Test Results:\nTrigger: ${triggerType} ${operator} "${triggerValue}"\nMatches: ${matches.length} out of ${testSamples.length} samples\nWould include: ${photoTypes.join(', ')}`);
    };

    window.matchesRule = function(testValue, operator, triggerValue) {
      switch(operator) {
        case 'contains': return testValue.includes(triggerValue);
        case 'equals': return testValue === triggerValue;
        case 'starts': return testValue.startsWith(triggerValue);
        case 'ends': return testValue.endsWith(triggerValue);
        default: return false;
      }
    };

    window.applyTemplateRules = function(articleNumber, category = '') {
      const templateRules = window.getTemplateRules().filter(rule => rule.active);
      const appliedPhotoTypes = new Set();
      const appliedRules = [];
      
      for (const rule of templateRules) {
        let testValue = '';
        switch(rule.triggerType) {
          case 'category': testValue = category.toLowerCase(); break;
          case 'keyword': testValue = articleNumber.toLowerCase(); break;
          case 'supplier': testValue = articleNumber.substring(0, 3).toLowerCase(); break; // Assume first 3 chars are supplier code
        }
        
        if (window.matchesRule(testValue, rule.operator, rule.triggerValue)) {
          rule.photoTypes.forEach(type => appliedPhotoTypes.add(type));
          appliedRules.push(rule);
          
          // Update usage count
          rule.usageCount = (rule.usageCount || 0) + 1;
        }
      }
      
      // Save updated usage counts
      if (appliedRules.length > 0) {
        window.saveTemplateRules(window.getTemplateRules());
      }
      
      return {
        photoTypes: Array.from(appliedPhotoTypes),
        appliedRules: appliedRules
      };
    };

    window.toggleTemplateRule = function(ruleId) {
      const templateRules = window.getTemplateRules();
      const rule = templateRules.find(r => r.id === ruleId);
      
      if (rule) {
        rule.active = !rule.active;
        window.saveTemplateRules(templateRules);
        
        // Refresh the modal
        const modal = document.querySelector('div[style*="position:fixed"]');
        if (modal) {
          modal.remove();
          window.showTemplateRulesModal();
        }
      }
    };

    window.editTemplateRule = function(ruleId) {
      const templateRules = window.getTemplateRules();
      const rule = templateRules.find(r => r.id === ruleId);
      
      if (!rule) {
        alert('Template rule not found');
        return;
      }
      
      const newName = prompt('Edit rule name:', rule.name);
      if (newName !== null && newName.trim()) {
        rule.name = newName.trim();
        window.saveTemplateRules(templateRules);
        
        // Refresh the modal
        const modal = document.querySelector('div[style*="position:fixed"]');
        if (modal) {
          modal.remove();
          window.showTemplateRulesModal();
        }
      }
    };

    window.deleteTemplateRule = function(ruleId) {
      if (!confirm('Are you sure you want to delete this template rule?')) {
        return;
      }
      
      const templateRules = window.getTemplateRules();
      const updatedRules = templateRules.filter(rule => rule.id !== ruleId);
      window.saveTemplateRules(updatedRules);
      
      // Refresh the modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
        window.showTemplateRulesModal();
      }
    };

    // Apply template rules to the order creation form
    window.applyTemplateRulesToForm = function() {
      const articlesTextarea = document.getElementById('articlesTextarea');
      if (!articlesTextarea || !articlesTextarea.value.trim()) {
        alert('Please enter at least one article before applying template rules');
        return;
      }

      // Extract first article for rule matching
      const firstArticle = articlesTextarea.value.trim().split('\n')[0];
      const articleNumber = firstArticle.split('[')[0].trim(); // Remove EAN part if present
      
      // Try to guess category from article number patterns
      let category = '';
      const articleLower = articleNumber.toLowerCase();
      if (articleLower.includes('cloth') || articleLower.includes('shirt') || articleLower.includes('dress')) {
        category = 'clothing';
      } else if (articleLower.includes('elec') || articleLower.includes('phone') || articleLower.includes('laptop')) {
        category = 'electronics';
      } else if (articleLower.includes('home') || articleLower.includes('decor') || articleLower.includes('lamp')) {
        category = 'home-decor';
      }

      const ruleResult = window.applyTemplateRules(articleNumber, category);
      
      if (ruleResult.photoTypes.length === 0) {
        alert('No template rules matched this article. You can create specific rules in the Template Rules manager.');
        return;
      }

      // Apply the photo types to checkboxes
      const photoTypeCheckboxes = document.querySelectorAll('input[name="photoTypes"]');
      photoTypeCheckboxes.forEach(checkbox => {
        if (ruleResult.photoTypes.includes(checkbox.value)) {
          checkbox.checked = true;
        }
      });

      // Show applied rules info
      const appliedRulesInfo = document.getElementById('appliedRulesInfo');
      if (appliedRulesInfo && ruleResult.appliedRules.length > 0) {
        appliedRulesInfo.style.display = 'block';
        appliedRulesInfo.innerHTML = `
          <strong>Applied Rules:</strong> ${ruleResult.appliedRules.map(rule => rule.name).join(', ')}<br>
          <strong>Photo Types:</strong> ${ruleResult.photoTypes.join(', ')}
        `;
      }

      // Show success message
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = `Applied ${ruleResult.appliedRules.length} template rule(s), selected ${ruleResult.photoTypes.length} photo type(s)`;
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    // Historical Data-Based Suggestions System
    window.showHistoricalSuggestionsModal = function() {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = `
        <div style="background:white;padding:24px;border-radius:12px;max-width:1000px;width:95%;max-height:90%;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="margin:0;font-size:20px;font-weight:600;">📊 Historical Data-Based Suggestions</h2>
            <button id="closeHistoricalModal" style="background:none;border:none;font-size:24px;cursor:pointer;">×</button>
          </div>
          
          <div style="margin-bottom:24px;">
            <p style="color:#6b7280;margin-bottom:16px;">Get intelligent suggestions based on analysis of past orders. Enter an article or category to see data-driven recommendations for photo types, photographers, timelines, and requirements.</p>
            
            <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin-bottom:20px;">
              <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">Analyze Similar Orders</h3>
              
              <div style="display:grid;grid-template-columns:1fr auto;gap:12px;margin-bottom:12px;">
                <input id="analysisInput" type="text" placeholder="Enter article number, category, or keywords" style="padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                <button id="analyzeBtn" style="padding:8px 16px;background:#3b82f6;color:white;border:none;border-radius:4px;cursor:pointer;">🔍 Analyze</button>
              </div>
              
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;">
                <button onclick="window.quickAnalysis('electronics')" style="padding:6px 12px;background:#e5e7eb;border:none;border-radius:4px;cursor:pointer;font-size:12px;">📱 Electronics</button>
                <button onclick="window.quickAnalysis('clothing')" style="padding:6px 12px;background:#e5e7eb;border:none;border-radius:4px;cursor:pointer;font-size:12px;">👕 Clothing</button>
                <button onclick="window.quickAnalysis('home-decor')" style="padding:6px 12px;background:#e5e7eb;border:none;border-radius:4px;cursor:pointer;font-size:12px;">🏠 Home Decor</button>
                <button onclick="window.quickAnalysis('beauty')" style="padding:6px 12px;background:#e5e7eb;border:none;border-radius:4px;cursor:pointer;font-size:12px;">💄 Beauty</button>
              </div>
            </div>
          </div>
          
          <div id="analysisResults" style="display:none;">
            <h3 style="margin:0 0 16px 0;font-size:16px;font-weight:600;">Analysis Results</h3>
            <div id="analysisContent"></div>
          </div>
          
          <div>
            <h3 style="margin:0 0 16px 0;font-size:16px;font-weight:600;">Global Analytics Dashboard</h3>
            <div id="globalAnalytics">
              ${window.generateGlobalAnalytics()}
            </div>
          </div>
          
          <div style="margin-top:20px;padding:16px;background:#eff6ff;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#1e40af;">💡 Smart Insights</h4>
            <div id="smartInsights" style="font-size:12px;color:#1e40af;">
              ${window.generateSmartInsights()}
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Event listeners
      document.getElementById('closeHistoricalModal').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('analyzeBtn').addEventListener('click', () => {
        const input = document.getElementById('analysisInput').value.trim();
        if (input) {
          window.performHistoricalAnalysis(input);
        }
      });
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    };

    window.quickAnalysis = function(category) {
      document.getElementById('analysisInput').value = category;
      window.performHistoricalAnalysis(category);
    };

    window.performHistoricalAnalysis = function(searchTerm) {
      const orders = allOrders.filter(order => 
        order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.brief.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.articles && order.articles.some(article => 
          article.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
        (order.photoTypes && order.photoTypes.some(type =>
          type.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      
      if (orders.length === 0) {
        document.getElementById('analysisContent').innerHTML = `
          <div style="padding:16px;background:#fef3c7;border-radius:8px;">
            <p style="margin:0;color:#92400e;">No similar orders found for "${searchTerm}". Try a broader search term or check the global analytics below.</p>
          </div>
        `;
        document.getElementById('analysisResults').style.display = 'block';
        return;
      }
      
      const analysis = window.analyzeOrders(orders, searchTerm);
      
      document.getElementById('analysisContent').innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;">
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#166534;">📈 Volume Analysis</h4>
            <div style="font-size:12px;color:#166534;">
              <div>Found: <strong>${orders.length}</strong> similar orders</div>
              <div>Date range: ${analysis.dateRange}</div>
              <div>Avg completion: <strong>${analysis.avgCompletionTime}</strong> days</div>
            </div>
          </div>
          
          <div style="background:#fef3c7;padding:16px;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#92400e;">📸 Photo Types</h4>
            <div style="font-size:12px;color:#92400e;">
              ${analysis.photoTypes.slice(0, 3).map(pt => `<div>${pt.type}: <strong>${pt.percentage}%</strong></div>`).join('')}
              ${analysis.photoTypes.length > 3 ? `<div>+${analysis.photoTypes.length - 3} more types</div>` : ''}
            </div>
          </div>
          
          <div style="background:#eff6ff;padding:16px;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#1d4ed8;">👥 Top Photographers</h4>
            <div style="font-size:12px;color:#1d4ed8;">
              ${analysis.photographers.slice(0, 3).map(p => `<div>${p.name}: <strong>${p.count}</strong> orders</div>`).join('')}
            </div>
          </div>
          
          <div style="background:#f3e8ff;padding:16px;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#7c3aed;">⚡ Priority Patterns</h4>
            <div style="font-size:12px;color:#7c3aed;">
              ${analysis.priorities.slice(0, 3).map(p => `<div>${p.priority}: <strong>${p.percentage}%</strong></div>`).join('')}
            </div>
          </div>
        </div>
        
        <div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:8px;">
          <h4 style="margin:0 0 12px 0;font-size:14px;font-weight:600;">🎯 Recommendations for Similar Orders</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;">
            <div>
              <strong>Suggested Photo Types:</strong><br>
              ${analysis.recommendedPhotoTypes.map(type => `<span style="display:inline-block;background:#ddd6fe;color:#5b21b6;padding:2px 6px;border-radius:12px;font-size:11px;margin:2px 4px 2px 0;">${type}</span>`).join('')}
            </div>
            <div>
              <strong>Recommended Photographer:</strong><br>
              <span style="background:#dcfce7;color:#166534;padding:4px 8px;border-radius:4px;font-size:12px;">${analysis.bestPhotographer}</span>
            </div>
            <div>
              <strong>Estimated Timeline:</strong><br>
              <span style="background:#fef3c7;color:#92400e;padding:4px 8px;border-radius:4px;font-size:12px;">${analysis.recommendedTimeline} days</span>
            </div>
            <div>
              <strong>Typical Budget Range:</strong><br>
              <span style="background:#eff6ff;color:#1d4ed8;padding:4px 8px;border-radius:4px;font-size:12px;">$${analysis.budgetRange}</span>
            </div>
          </div>
        </div>
        
        <div style="margin-top:16px;">
          <button onclick="window.applyHistoricalSuggestions('${searchTerm}')" style="padding:8px 16px;background:#10b981;color:white;border:none;border-radius:4px;cursor:pointer;">
            ✨ Apply Suggestions to New Order
          </button>
        </div>
      `;
      
      document.getElementById('analysisResults').style.display = 'block';
    };

    window.analyzeOrders = function(orders, searchTerm) {
      // Photo types analysis
      const photoTypesCount = {};
      orders.forEach(order => {
        if (order.photoTypes) {
          order.photoTypes.forEach(type => {
            photoTypesCount[type] = (photoTypesCount[type] || 0) + 1;
          });
        }
      });
      
      const photoTypes = Object.entries(photoTypesCount)
        .map(([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / orders.length) * 100)
        }))
        .sort((a, b) => b.count - a.count);
      
      // Photographers analysis
      const photographersCount = {};
      orders.forEach(order => {
        const photographer = order.photographer || 'Unassigned';
        photographersCount[photographer] = (photographersCount[photographer] || 0) + 1;
      });
      
      const photographers = Object.entries(photographersCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      
      // Priority analysis
      const prioritiesCount = {};
      orders.forEach(order => {
        const priority = order.priority || 'Medium';
        prioritiesCount[priority] = (prioritiesCount[priority] || 0) + 1;
      });
      
      const priorities = Object.entries(prioritiesCount)
        .map(([priority, count]) => ({
          priority,
          count,
          percentage: Math.round((count / orders.length) * 100)
        }))
        .sort((a, b) => b.count - a.count);
      
      // Timeline analysis
      const completedOrders = orders.filter(o => o.status === 'Completed');
      const avgCompletionTime = completedOrders.length > 0 
        ? Math.round(completedOrders.reduce((sum, order) => {
            const created = new Date(order.createdAt || '2025-01-01');
            const deadline = new Date(order.deadline);
            const diffTime = Math.abs(deadline - created);
            return sum + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }, 0) / completedOrders.length)
        : 14;
      
      // Budget analysis
      const ordersWithBudget = orders.filter(o => o.budget && o.budget > 0);
      const avgBudget = ordersWithBudget.length > 0
        ? Math.round(ordersWithBudget.reduce((sum, o) => sum + o.budget, 0) / ordersWithBudget.length)
        : 1000;
      const minBudget = ordersWithBudget.length > 0 ? Math.min(...ordersWithBudget.map(o => o.budget)) : 500;
      const maxBudget = ordersWithBudget.length > 0 ? Math.max(...ordersWithBudget.map(o => o.budget)) : 2000;
      
      return {
        photoTypes,
        photographers,
        priorities,
        avgCompletionTime,
        dateRange: `${orders.length} orders from last 12 months`,
        recommendedPhotoTypes: photoTypes.slice(0, 4).map(pt => pt.type),
        bestPhotographer: photographers[0]?.name || 'Mike Rodriguez',
        recommendedTimeline: Math.max(avgCompletionTime, 7),
        budgetRange: `${minBudget.toLocaleString()} - ${maxBudget.toLocaleString()}`
      };
    };

    window.generateGlobalAnalytics = function() {
      const totalOrders = allOrders.length;
      const completedOrders = allOrders.filter(o => o.status === 'Completed').length;
      const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
      
      // Most popular photo types
      const allPhotoTypes = {};
      allOrders.forEach(order => {
        if (order.photoTypes) {
          order.photoTypes.forEach(type => {
            allPhotoTypes[type] = (allPhotoTypes[type] || 0) + 1;
          });
        }
      });
      
      const topPhotoTypes = Object.entries(allPhotoTypes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
      
      return `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">
          <div style="background:#f0f9ff;padding:16px;border-radius:8px;text-align:center;">
            <div style="font-size:24px;font-weight:bold;color:#1e40af;">${totalOrders}</div>
            <div style="font-size:12px;color:#6b7280;">Total Orders</div>
          </div>
          <div style="background:#f0fdf4;padding:16px;border-radius:8px;text-align:center;">
            <div style="font-size:24px;font-weight:bold;color:#166534;">${completionRate}%</div>
            <div style="font-size:12px;color:#6b7280;">Completion Rate</div>
          </div>
          <div style="background:#fef3c7;padding:16px;border-radius:8px;">
            <div style="font-size:14px;font-weight:600;color:#92400e;margin-bottom:8px;">Top Photo Types</div>
            <div style="font-size:11px;color:#92400e;">
              ${topPhotoTypes.map(([type, count]) => `<div>${type}: ${count}</div>`).join('')}
            </div>
          </div>
        </div>
      `;
    };

    window.generateSmartInsights = function() {
      const insights = [
        "📈 Product shots are requested in 85% of orders - consider making them default",
        "⏰ Electronics orders typically need 2-3 more days than clothing orders",
        "👥 Mike Rodriguez has the highest completion rate for electronics photography",
        "💡 Orders with detailed briefs are completed 30% faster on average",
        "🎯 Template rules reduce order creation time by an average of 60%"
      ];
      
      return insights.join('<br>');
    };

    window.applyHistoricalSuggestions = function(searchTerm) {
      // Close the modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
      }
      
      // Switch to create order view
      showView('create');
      
      // Apply suggestions after a short delay
      setTimeout(() => {
        const orders = allOrders.filter(order => 
          order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.brief.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (orders.length > 0) {
          const analysis = window.analyzeOrders(orders, searchTerm);
          
          // Fill in suggested values
          const titleInput = document.querySelector('input[name="title"]');
          const photographerSelect = document.querySelector('select[name="photographer"]');
          const prioritySelect = document.querySelector('select[name="priority"]');
          const deadlineInput = document.querySelector('input[name="deadline"]');
          
          if (titleInput && !titleInput.value) {
            titleInput.value = `Photo Order for ${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} Products`;
          }
          
          if (photographerSelect) {
            Array.from(photographerSelect.options).forEach(option => {
              if (option.text.includes(analysis.bestPhotographer)) {
                option.selected = true;
              }
            });
          }
          
          if (prioritySelect && analysis.priorities.length > 0) {
            prioritySelect.value = analysis.priorities[0].priority;
          }
          
          if (deadlineInput) {
            const suggestedDate = new Date();
            suggestedDate.setDate(suggestedDate.getDate() + analysis.recommendedTimeline);
            deadlineInput.value = suggestedDate.toISOString().split('T')[0];
          }
          
          // Apply suggested photo types
          analysis.recommendedPhotoTypes.forEach(type => {
            const checkbox = document.querySelector(`input[name="photoTypes"][value="${type}"]`);
            if (checkbox) {
              checkbox.checked = true;
            }
          });
          
          // Show applied suggestions info
          const appliedRulesInfo = document.getElementById('appliedRulesInfo');
          if (appliedRulesInfo) {
            appliedRulesInfo.style.display = 'block';
            appliedRulesInfo.innerHTML = `
              <strong>🤖 Applied Historical Suggestions:</strong><br>
              Based on analysis of ${orders.length} similar orders<br>
              <strong>Photo Types:</strong> ${analysis.recommendedPhotoTypes.join(', ')}<br>
              <strong>Photographer:</strong> ${analysis.bestPhotographer}<br>
              <strong>Timeline:</strong> ${analysis.recommendedTimeline} days
            `;
          }
        }
        
        // Show success message
        const success = document.createElement('div');
        success.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
        success.textContent = `Applied historical suggestions based on ${orders.length} similar orders`;
        document.body.appendChild(success);
        setTimeout(() => success.remove(), 3000);
      }, 100);
    };

    // Active DAM Integration System
    window.showDAMIntegrationModal = function() {
      const damAssets = window.getDAMAssets();
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;';
      modal.innerHTML = `
        <div style="background:white;padding:24px;border-radius:12px;max-width:1200px;width:95%;max-height:90%;overflow-y:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="margin:0;font-size:20px;font-weight:600;">☁️ Cloudinary Asset Management</h2>
            <button id="closeDAMModal" style="background:none;border:none;font-size:24px;cursor:pointer;">×</button>
          </div>
          
          <div style="margin-bottom:24px;">
            <div style="background:#f0f9ff;padding:16px;border-radius:8px;margin-bottom:16px;">
              <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:600;color:#1e40af;">☁️ Cloudinary Connection Status</h3>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="width:12px;height:12px;background:#10b981;border-radius:50%;"></span>
                <span style="font-size:14px;font-weight:500;">Cloudinary: Connected</span>
                <span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:12px;font-size:12px;margin-left:12px;">Active</span>
              </div>
              <div style="margin-top:8px;font-size:12px;color:#64748b;">
                Connected to demo cloud • Upload, manage, and transform your assets
              </div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
              <div style="background:#f3f4f6;padding:16px;border-radius:8px;">
                <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">📤 Upload to Cloudinary</h3>
                <div style="border:2px dashed #d1d5db;border-radius:8px;padding:20px;text-align:center;margin-bottom:12px;">
                  <input type="file" id="damFileInput" multiple accept="image/*,video/*" style="display:none;">
                  <button onclick="document.getElementById('damFileInput').click()" style="padding:8px 16px;background:#3b82f6;color:white;border:none;border-radius:4px;cursor:pointer;">
                    📁 Select Files
                  </button>
                  <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">Support: JPG, PNG, TIFF, MP4, MOV up to 100MB</p>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                  <select id="damOrderSelect" style="padding:6px;border:1px solid #d1d5db;border-radius:4px;font-size:12px;">
                    <option value="">Link to Order...</option>
                    ${allOrders.slice(0, 10).map(order => `<option value="${order.orderNumber}">${order.orderNumber} - ${order.title.substring(0, 30)}...</option>`).join('')}
                  </select>
                  <select id="damCategorySelect" style="padding:6px;border:1px solid #d1d5db;border-radius:4px;font-size:12px;">
                    <option value="product">Product Photography</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="detail">Detail Shots</option>
                    <option value="360">360° Views</option>
                    <option value="model">Model Photography</option>
                    <option value="packaging">Packaging</option>
                  </select>
                </div>
                <input id="damTagsInput" placeholder="Tags (comma-separated)" style="width:100%;padding:6px;border:1px solid #d1d5db;border-radius:4px;font-size:12px;margin-bottom:12px;">
                <button id="uploadToDAMBtn" style="width:100%;padding:8px;background:#10b981;color:white;border:none;border-radius:4px;cursor:pointer;">
                  ⬆️ Upload to Cloudinary
                </button>
              </div>
              
              <div style="background:#f3f4f6;padding:16px;border-radius:8px;">
                <h3 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">🔍 Search Cloudinary Assets</h3>
                <div style="display:grid;gap:8px;margin-bottom:12px;">
                  <input id="damSearchInput" placeholder="Search by filename, tags, or order number" style="padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    <select id="damFilterCategory" style="padding:6px;border:1px solid #d1d5db;border-radius:4px;font-size:12px;">
                      <option value="">All Categories</option>
                      <option value="product">Product Photography</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="detail">Detail Shots</option>
                      <option value="360">360° Views</option>
                      <option value="model">Model Photography</option>
                    </select>
                    <select id="damFilterDate" style="padding:6px;border:1px solid #d1d5db;border-radius:4px;font-size:12px;">
                      <option value="">All Dates</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                    </select>
                  </div>
                </div>
                <button id="searchDAMBtn" style="width:100%;padding:8px;background:#3b82f6;color:white;border:none;border-radius:4px;cursor:pointer;">
                  🔍 Search Cloudinary
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style="margin:0 0 16px 0;font-size:16px;font-weight:600;">📁 Recent Cloudinary Assets</h3>
            <div id="damAssetsGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">
              ${damAssets.length === 0 ? 
                '<p style="grid-column:1/-1;color:#6b7280;font-style:italic;text-align:center;padding:40px;">No assets uploaded yet. Upload your first asset using the form above.</p>' :
                damAssets.map(asset => `
                  <div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px;background:white;">
                    <div style="aspect-ratio:16/9;background:#f3f4f6;border-radius:6px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                      ${asset.type === 'image' ? 
                        `<img src="${asset.url}" alt="${asset.filename}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                         <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;color:#6b7280;">
                           🖼️ Image
                         </div>` :
                        `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#6b7280;">
                           🎬 Video
                         </div>`
                      }
                    </div>
                    <div style="font-size:12px;font-weight:500;margin-bottom:4px;">${asset.filename}</div>
                    <div style="font-size:10px;color:#6b7280;margin-bottom:8px;">
                      ${asset.category} • ${asset.uploadDate}<br>
                      ${asset.orderNumber ? `Order: ${asset.orderNumber}` : 'No order linked'}
                    </div>
                    <div style="display:flex;gap:4px;margin-bottom:8px;">
                      ${asset.tags.slice(0, 3).map(tag => `<span style="background:#e5e7eb;color:#374151;padding:1px 4px;border-radius:2px;font-size:9px;">${tag}</span>`).join('')}
                      ${asset.tags.length > 3 ? `<span style="color:#6b7280;font-size:9px;">+${asset.tags.length - 3}</span>` : ''}
                    </div>
                    <div style="display:flex;gap:4px;">
                      <button onclick="window.viewDAMAsset('${asset.id}')" style="flex:1;padding:4px;background:#3b82f6;color:white;border:none;border-radius:3px;font-size:10px;cursor:pointer;">View</button>
                      <button onclick="window.downloadDAMAsset('${asset.id}')" style="flex:1;padding:4px;background:#10b981;color:white;border:none;border-radius:3px;font-size:10px;cursor:pointer;">Download</button>
                      <button onclick="window.deleteDAMAsset('${asset.id}')" style="padding:4px;background:#ef4444;color:white;border:none;border-radius:3px;font-size:10px;cursor:pointer;">🗑️</button>
                    </div>
                  </div>
                `).join('')
              }
            </div>
          </div>
          
          <div style="margin-top:20px;padding:16px;background:#eff6ff;border-radius:8px;">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#1e40af;">☁️ Cloudinary Features</h4>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;font-size:12px;color:#1e40af;">
              <div>✅ Automatic image optimization</div>
              <div>✅ Order-asset linking</div>
              <div>✅ Multi-format support</div>
              <div>✅ AI-powered tagging</div>
              <div>✅ Real-time transformations</div>
              <div>✅ CDN delivery</div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Event listeners
      document.getElementById('closeDAMModal').addEventListener('click', () => {
        modal.remove();
      });
      
      document.getElementById('uploadToDAMBtn').addEventListener('click', () => {
        window.uploadToDAM();
      });
      
      document.getElementById('searchDAMBtn').addEventListener('click', () => {
        window.searchDAMAssets();
      });
      
      document.getElementById('damFileInput').addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          const fileList = files.map(f => f.name).join(', ');
          const success = document.createElement('div');
          success.style.cssText = 'position:fixed;top:20px;right:20px;background:#3b82f6;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
          success.textContent = `Selected ${files.length} file(s): ${fileList.substring(0, 50)}${fileList.length > 50 ? '...' : ''}`;
          document.body.appendChild(success);
          setTimeout(() => success.remove(), 3000);
        }
      });
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // ESC key to close modal
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
    };

    window.getDAMAssets = function() {
      const assets = localStorage.getItem('damAssets');
      return assets ? JSON.parse(assets) : window.createSampleDAMAssets();
    };

    window.saveDAMAssets = function(assets) {
      localStorage.setItem('damAssets', JSON.stringify(assets));
    };

    window.createSampleDAMAssets = function() {
      const sampleAssets = [
        {
          id: 'dam_001',
          filename: 'product_phone_hero.jpg',
          type: 'image',
          category: 'product',
          orderNumber: 'ORD-2025-001',
          uploadDate: '2025-08-25',
          tags: ['phone', 'electronics', 'hero', 'product'],
          url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
          size: '2.4 MB',
          uploader: 'Mike Rodriguez'
        },
        {
          id: 'dam_002',
          filename: 'lifestyle_home_setup.jpg',
          type: 'image',
          category: 'lifestyle',
          orderNumber: 'ORD-2025-002',
          uploadDate: '2025-08-24',
          tags: ['home', 'lifestyle', 'setup', 'ambient'],
          url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
          size: '3.1 MB',
          uploader: 'Emily Chen'
        },
        {
          id: 'dam_003',
          filename: 'detail_watch_mechanism.jpg',
          type: 'image',
          category: 'detail',
          orderNumber: 'ORD-2025-003',
          uploadDate: '2025-08-23',
          tags: ['watch', 'detail', 'mechanism', 'macro'],
          url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
          size: '1.8 MB',
          uploader: 'Alex Turner'
        },
        {
          id: 'dam_004',
          filename: 'model_fashion_shoot.mp4',
          type: 'video',
          category: 'model',
          orderNumber: 'ORD-2025-004',
          uploadDate: '2025-08-22',
          tags: ['fashion', 'model', 'video', 'commercial'],
          url: null,
          size: '45.2 MB',
          uploader: 'Mike Rodriguez'
        }
      ];
      
      window.saveDAMAssets(sampleAssets);
      return sampleAssets;
    };

    window.uploadToDAM = function() {
      const fileInput = document.getElementById('damFileInput');
      const orderSelect = document.getElementById('damOrderSelect');
      const categorySelect = document.getElementById('damCategorySelect');
      const tagsInput = document.getElementById('damTagsInput');
      
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select files to upload');
        return;
      }
      
      const files = Array.from(fileInput.files);
      const damAssets = window.getDAMAssets();
      
      files.forEach((file, index) => {
        const newAsset = {
          id: 'dam_' + Date.now() + '_' + index,
          filename: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          category: categorySelect.value || 'product',
          orderNumber: orderSelect.value || null,
          uploadDate: new Date().toISOString().split('T')[0],
          tags: tagsInput.value ? tagsInput.value.split(',').map(t => t.trim()).filter(t => t) : [],
          url: URL.createObjectURL(file), // In real implementation, this would be the DAM URL
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          uploader: authSystem.getCurrentUser().username
        };
        
        damAssets.unshift(newAsset);
      });
      
      window.saveDAMAssets(damAssets);
      
      // Clear form
      fileInput.value = '';
      tagsInput.value = '';
      orderSelect.value = '';
      
      // Refresh modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
        window.showDAMIntegrationModal();
      }
      
      // Show success message
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = `Successfully uploaded ${files.length} asset(s) to DAM`;
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    window.searchDAMAssets = function() {
      const searchTerm = document.getElementById('damSearchInput').value.toLowerCase();
      const categoryFilter = document.getElementById('damFilterCategory').value;
      const dateFilter = document.getElementById('damFilterDate').value;
      
      const allAssets = window.getDAMAssets();
      let filteredAssets = allAssets;
      
      if (searchTerm) {
        filteredAssets = filteredAssets.filter(asset =>
          asset.filename.toLowerCase().includes(searchTerm) ||
          asset.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          (asset.orderNumber && asset.orderNumber.toLowerCase().includes(searchTerm))
        );
      }
      
      if (categoryFilter) {
        filteredAssets = filteredAssets.filter(asset => asset.category === categoryFilter);
      }
      
      if (dateFilter) {
        const today = new Date();
        const filterDate = new Date();
        switch(dateFilter) {
          case 'today':
            filterDate.setDate(today.getDate());
            break;
          case 'week':
            filterDate.setDate(today.getDate() - 7);
            break;
          case 'month':
            filterDate.setMonth(today.getMonth() - 1);
            break;
          case 'quarter':
            filterDate.setMonth(today.getMonth() - 3);
            break;
        }
        filteredAssets = filteredAssets.filter(asset => new Date(asset.uploadDate) >= filterDate);
      }
      
      // Update grid
      const grid = document.getElementById('damAssetsGrid');
      if (filteredAssets.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;color:#6b7280;font-style:italic;text-align:center;padding:40px;">No assets found matching your search criteria.</p>';
      } else {
        grid.innerHTML = filteredAssets.map(asset => `
          <div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px;background:white;">
            <div style="aspect-ratio:16/9;background:#f3f4f6;border-radius:6px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
              ${asset.type === 'image' ? 
                `<img src="${asset.url}" alt="${asset.filename}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                 <div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;color:#6b7280;">
                   🖼️ Image
                 </div>` :
                `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#6b7280;">
                   🎬 Video
                 </div>`
              }
            </div>
            <div style="font-size:12px;font-weight:500;margin-bottom:4px;">${asset.filename}</div>
            <div style="font-size:10px;color:#6b7280;margin-bottom:8px;">
              ${asset.category} • ${asset.uploadDate}<br>
              ${asset.orderNumber ? `Order: ${asset.orderNumber}` : 'No order linked'}
            </div>
            <div style="display:flex;gap:4px;margin-bottom:8px;">
              ${asset.tags.slice(0, 3).map(tag => `<span style="background:#e5e7eb;color:#374151;padding:1px 4px;border-radius:2px;font-size:9px;">${tag}</span>`).join('')}
              ${asset.tags.length > 3 ? `<span style="color:#6b7280;font-size:9px;">+${asset.tags.length - 3}</span>` : ''}
            </div>
            <div style="display:flex;gap:4px;">
              <button onclick="window.viewDAMAsset('${asset.id}')" style="flex:1;padding:4px;background:#3b82f6;color:white;border:none;border-radius:3px;font-size:10px;cursor:pointer;">View</button>
              <button onclick="window.downloadDAMAsset('${asset.id}')" style="flex:1;padding:4px;background:#10b981;color:white;border:none;border-radius:3px;font-size:10px;cursor:pointer;">Download</button>
              <button onclick="window.deleteDAMAsset('${asset.id}')" style="padding:4px;background:#ef4444;color:white;border:none;border-radius:3px;font-size:10px;cursor:pointer;">🗑️</button>
            </div>
          </div>
        `).join('');
      }
      
      // Show results info
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#3b82f6;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = `Found ${filteredAssets.length} asset(s) matching your criteria`;
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    window.viewDAMAsset = function(assetId) {
      const damAssets = window.getDAMAssets();
      const asset = damAssets.find(a => a.id === assetId);
      
      if (!asset) {
        alert('Asset not found');
        return;
      }
      
      if (asset.type === 'image' && asset.url) {
        window.open(asset.url, '_blank');
      } else {
        alert(`Viewing ${asset.filename} (${asset.type})\nSize: ${asset.size}\nUploader: ${asset.uploader}\nTags: ${asset.tags.join(', ')}`);
      }
    };

    window.downloadDAMAsset = function(assetId) {
      const damAssets = window.getDAMAssets();
      const asset = damAssets.find(a => a.id === assetId);
      
      if (!asset) {
        alert('Asset not found');
        return;
      }
      
      // In a real implementation, this would trigger actual download
      alert(`Download initiated for ${asset.filename}\nSize: ${asset.size}\nThis would normally download from the DAM system.`);
    };

    window.deleteDAMAsset = function(assetId) {
      if (!confirm('Are you sure you want to delete this asset from the DAM?')) {
        return;
      }
      
      const damAssets = window.getDAMAssets();
      const updatedAssets = damAssets.filter(asset => asset.id !== assetId);
      window.saveDAMAssets(updatedAssets);
      
      // Refresh the modal
      const modal = document.querySelector('div[style*="position:fixed"]');
      if (modal) {
        modal.remove();
        window.showDAMIntegrationModal();
      }
      
      const success = document.createElement('div');
      success.style.cssText = 'position:fixed;top:20px;right:20px;background:#ef4444;color:white;padding:12px 16px;border-radius:6px;z-index:1001;';
      success.textContent = 'Asset deleted from DAM';
      document.body.appendChild(success);
      setTimeout(() => success.remove(), 3000);
    };

    // Customization Request System
    window.getCustomizationRequests = function() {
      return JSON.parse(localStorage.getItem('customizationRequests') || '[]');
    };

    window.saveCustomizationRequests = function(requests) {
      localStorage.setItem('customizationRequests', JSON.stringify(requests));
    };

    // Initialize sample customization requests if none exist
    window.initializeCustomizationRequests = function() {
      const existing = window.getCustomizationRequests();
      if (existing.length === 0) {
        const sampleRequests = [
          {
            id: 'CR-1734567890123',
            type: 'integration',
            priority: 'high',
            title: 'SAP Material Master Integration Enhancement',
            description: 'Enhance the current SAP PMR integration to include real-time material master updates, automated price synchronization, and advanced vendor information pull. Current system only does basic order sync.',
            justification: 'Will reduce manual data entry by 80% and eliminate pricing discrepancies between SAP and photo system. Estimated time savings: 15 hours per week across procurement team.',
            departments: ['procurement', 'it', 'photography'],
            timeline: '3-months',
            notes: 'Need to coordinate with SAP team for API access expansion. Budget approval already obtained.',
            status: 'in-progress',
            submittedDate: '12/15/2024',
            submittedBy: 'Sarah Johnson (Procurement Manager)',
            lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'CR-1734567890124',
            type: 'automation', 
            priority: 'medium',
            title: 'Automated Photography Schedule Optimization',
            description: 'Implement AI-driven scheduling system that automatically optimizes photographer assignments based on location, skill specialization, workload, and item complexity to maximize efficiency.',
            justification: 'Current manual scheduling leads to suboptimal resource allocation. AI optimization could improve photographer utilization by 25% and reduce travel costs by scheduling location-based batches.',
            departments: ['photography', 'operations'],
            timeline: '6-months',
            notes: 'Requires machine learning model training on historical scheduling data. Consider partnership with AI vendor.',
            status: 'submitted',
            submittedDate: '12/18/2024',
            submittedBy: 'Michael Chen (Photography Director)',
            lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'CR-1734567890125',
            type: 'reporting',
            priority: 'high',
            title: 'Executive Dashboard with Advanced Analytics',
            description: 'Create comprehensive executive dashboard showing photo shoot ROI, photographer performance metrics, cost per item trends, seasonal demand patterns, and predictive analytics for resource planning.',
            justification: 'Leadership currently lacks visibility into photo operation efficiency and costs. Advanced analytics will enable data-driven decisions for budget allocation and capacity planning.',
            departments: ['finance', 'operations', 'photography'],
            timeline: '1-month',
            notes: 'High priority for Q1 budget review meetings. Need integration with existing BI tools.',
            status: 'completed',
            submittedDate: '11/28/2024',
            submittedBy: 'Jennifer Walsh (CFO)',
            lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'CR-1734567890126',
            type: 'workflow',
            priority: 'critical',
            title: 'Multi-Language Support for Global Operations',
            description: 'Add comprehensive multi-language support including German, French, Spanish, and Mandarin interfaces, with localized date formats, currency display, and cultural adaptations for global rollout.',
            justification: 'Critical for expansion into European and Asian markets. Current English-only system blocking international adoption. Projected to enable 40% increase in global photo operations.',
            departments: ['it', 'operations', 'marketing'],
            timeline: 'asap',
            notes: 'Blocking factor for Q1 international launch. Translation vendor already contracted.',
            status: 'submitted',
            submittedDate: '12/20/2024', 
            submittedBy: 'Hans Mueller (Global Operations Director)',
            lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        window.saveCustomizationRequests(sampleRequests);
      }
    };

    window.showCustomizationRequestModal = function() {
      // Initialize sample data if needed
      window.initializeCustomizationRequests();
      
      const modal = document.createElement('div');
      modal.id = 'customizationRequestModal';
      modal.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.7);z-index:10000;display:flex;
        align-items:center;justify-content:center;
      `;

      const content = document.createElement('div');
      content.style.cssText = `
        background:white;border-radius:12px;width:90%;max-width:800px;
        max-height:90vh;overflow-y:auto;position:relative;
      `;

      const existingRequests = window.getCustomizationRequests();

      content.innerHTML = `
        <div style="padding:24px;border-bottom:1px solid #e5e7eb;">
          <h2 style="margin:0;font-size:20px;color:#1f2937;display:flex;align-items:center;">
            🔧 Customization Request System
            <button onclick="document.getElementById('customizationRequestModal').remove()" 
                    style="margin-left:auto;background:none;border:none;font-size:24px;cursor:pointer;color:#6b7280;">×</button>
          </h2>
          <p style="margin:8px 0 0;color:#6b7280;font-size:14px;">Submit and track custom feature requests and system modifications</p>
        </div>

        <div style="padding:24px;">
          <!-- Request Statistics -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;margin-bottom:24px;">
            <div style="background:#f0fdf4;padding:16px;border-radius:8px;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#059669;">${existingRequests.length}</div>
              <div style="font-size:12px;color:#059669;">Total Requests</div>
            </div>
            <div style="background:#fef3f2;padding:16px;border-radius:8px;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#dc2626;">${existingRequests.filter(r => r.status === 'submitted').length}</div>
              <div style="font-size:12px;color:#dc2626;">Pending Review</div>
            </div>
            <div style="background:#fffbeb;padding:16px;border-radius:8px;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#d97706;">${existingRequests.filter(r => r.status === 'in-progress').length}</div>
              <div style="font-size:12px;color:#d97706;">In Progress</div>
            </div>
            <div style="background:#f0f9ff;padding:16px;border-radius:8px;text-align:center;">
              <div style="font-size:24px;font-weight:bold;color:#0284c7;">${existingRequests.filter(r => r.status === 'completed').length}</div>
              <div style="font-size:12px;color:#0284c7;">Completed</div>
            </div>
          </div>

          <!-- New Request Form -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:24px;">
            <h3 style="margin:0 0 16px;font-size:16px;color:#1f2937;">Submit New Request</h3>
            
            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#374151;">Request Type *</label>
              <select id="requestType" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                <option value="">Select request type...</option>
                <option value="feature">New Feature</option>
                <option value="enhancement">Enhancement</option>
                <option value="integration">System Integration</option>
                <option value="workflow">Workflow Modification</option>
                <option value="reporting">Custom Reporting</option>
                <option value="ui-ux">UI/UX Changes</option>
                <option value="automation">Process Automation</option>
                <option value="security">Security Enhancement</option>
                <option value="performance">Performance Optimization</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#374151;">Priority Level *</label>
              <select id="requestPriority" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                <option value="">Select priority...</option>
                <option value="critical">🔴 Critical - Business Impact</option>
                <option value="high">🟠 High - Important Enhancement</option>
                <option value="medium">🟡 Medium - Nice to Have</option>
                <option value="low">🟢 Low - Future Consideration</option>
              </select>
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#374151;">Request Title *</label>
              <input type="text" id="requestTitle" placeholder="Brief description of the request" 
                     style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#374151;">Detailed Description *</label>
              <textarea id="requestDescription" rows="4" placeholder="Detailed description of what you need, including current limitations and desired outcomes"
                        style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;resize:vertical;"></textarea>
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#374151;">Business Justification</label>
              <textarea id="requestJustification" rows="3" placeholder="How will this benefit the business? Include efficiency gains, cost savings, or process improvements"
                        style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;resize:vertical;"></textarea>
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#374151;">Affected Department(s)</label>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-top:8px;">
                <label style="display:flex;align-items:center;"><input type="checkbox" value="photography" style="margin-right:8px;">Photography</label>
                <label style="display:flex;align-items:center;"><input type="checkbox" value="procurement" style="margin-right:8px;">Procurement</label>
                <label style="display:flex;align-items:center;"><input type="checkbox" value="marketing" style="margin-right:8px;">Marketing</label>
                <label style="display:flex;align-items:center;"><input type="checkbox" value="it" style="margin-right:8px;">IT</label>
                <label style="display:flex;align-items:center;"><input type="checkbox" value="finance" style="margin-right:8px;">Finance</label>
                <label style="display:flex;align-items:center;"><input type="checkbox" value="operations" style="margin-right:8px;">Operations</label>
              </div>
            </div>

            <div style="margin-bottom:16px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#374151;">Expected Timeline</label>
              <select id="requestTimeline" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;">
                <option value="">Select expected timeline...</option>
                <option value="asap">ASAP - Urgent</option>
                <option value="1-month">Within 1 Month</option>
                <option value="3-months">Within 3 Months</option>
                <option value="6-months">Within 6 Months</option>
                <option value="flexible">Flexible Timeline</option>
              </select>
            </div>

            <div style="margin-bottom:20px;">
              <label style="display:block;margin-bottom:4px;font-weight:500;color:#374151;">Additional Notes</label>
              <textarea id="requestNotes" rows="2" placeholder="Any additional information, constraints, or requirements"
                        style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;resize:vertical;"></textarea>
            </div>

            <button onclick="window.submitCustomizationRequest()" 
                    style="background:#7c3aed;color:white;border:none;border-radius:6px;padding:10px 20px;font-size:14px;cursor:pointer;font-weight:500;">
              📤 Submit Request
            </button>
          </div>

          <!-- Existing Requests -->
          <div>
            <h3 style="margin:0 0 16px;font-size:16px;color:#1f2937;">Request History</h3>
            <div id="customizationRequestsList">
              ${existingRequests.length === 0 ? `
                <div style="text-align:center;padding:40px;color:#6b7280;">
                  <div style="font-size:48px;margin-bottom:16px;">📝</div>
                  <p style="margin:0;font-size:16px;">No customization requests yet</p>
                  <p style="margin:8px 0 0;font-size:14px;">Submit your first request using the form above</p>
                </div>
              ` : existingRequests.map(request => `
                <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px;background:white;">
                  <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">
                    <div>
                      <h4 style="margin:0 0 4px;font-size:14px;color:#1f2937;">${request.title}</h4>
                      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
                        <span style="background:${getRequestTypeColor(request.type)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;">
                          ${getRequestTypeLabel(request.type)}
                        </span>
                        <span style="background:${getPriorityColor(request.priority)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;">
                          ${getPriorityLabel(request.priority)}
                        </span>
                        <span style="background:${getStatusColor(request.status)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;">
                          ${getStatusLabel(request.status)}
                        </span>
                      </div>
                    </div>
                    <div style="text-align:right;font-size:12px;color:#6b7280;">
                      <div>ID: ${request.id}</div>
                      <div>${request.submittedDate}</div>
                    </div>
                  </div>
                  
                  <p style="margin:0 0 12px;font-size:13px;color:#4b5563;">${request.description.length > 150 ? request.description.substring(0, 150) + '...' : request.description}</p>
                  
                  ${request.justification ? `
                    <div style="background:#f9fafb;padding:8px;border-radius:4px;margin-bottom:8px;">
                      <strong style="font-size:11px;color:#374151;">Business Justification:</strong>
                      <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">${request.justification.length > 100 ? request.justification.substring(0, 100) + '...' : request.justification}</p>
                    </div>
                  ` : ''}
                  
                  <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#6b7280;">
                    <div>
                      ${request.departments && request.departments.length > 0 ? 
                        `Departments: ${request.departments.join(', ')}` : 
                        ''
                      }
                      ${request.timeline ? ` • Timeline: ${request.timeline}` : ''}
                    </div>
                    <div style="display:flex;gap:8px;">
                      <button onclick="window.viewCustomizationRequest('${request.id}')" 
                              style="background:#3b82f6;color:white;border:none;border-radius:4px;padding:4px 8px;font-size:11px;cursor:pointer;">
                        View Details
                      </button>
                      ${request.status === 'submitted' ? `
                        <button onclick="window.updateRequestStatus('${request.id}', 'in-progress')" 
                                style="background:#f59e0b;color:white;border:none;border-radius:4px;padding:4px 8px;font-size:11px;cursor:pointer;">
                          Start Work
                        </button>
                      ` : ''}
                      ${request.status === 'in-progress' ? `
                        <button onclick="window.updateRequestStatus('${request.id}', 'completed')" 
                                style="background:#10b981;color:white;border:none;border-radius:4px;padding:4px 8px;font-size:11px;cursor:pointer;">
                          Mark Complete
                        </button>
                      ` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      modal.appendChild(content);
      document.body.appendChild(modal);

      // Helper functions for styling
      function getRequestTypeColor(type) {
        const colors = {
          'feature': '#3b82f6',
          'enhancement': '#10b981',
          'integration': '#f59e0b',
          'workflow': '#8b5cf6',
          'reporting': '#06b6d4',
          'ui-ux': '#ec4899',
          'automation': '#84cc16',
          'security': '#ef4444',
          'performance': '#f97316',
          'other': '#6b7280'
        };
        return colors[type] || '#6b7280';
      }

      function getRequestTypeLabel(type) {
        const labels = {
          'feature': 'New Feature',
          'enhancement': 'Enhancement',
          'integration': 'Integration',
          'workflow': 'Workflow',
          'reporting': 'Reporting',
          'ui-ux': 'UI/UX',
          'automation': 'Automation',
          'security': 'Security',
          'performance': 'Performance',
          'other': 'Other'
        };
        return labels[type] || 'Other';
      }

      function getPriorityColor(priority) {
        const colors = {
          'critical': '#dc2626',
          'high': '#f59e0b',
          'medium': '#eab308',
          'low': '#22c55e'
        };
        return colors[priority] || '#6b7280';
      }

      function getPriorityLabel(priority) {
        const labels = {
          'critical': 'Critical',
          'high': 'High',
          'medium': 'Medium',
          'low': 'Low'
        };
        return labels[priority] || 'Medium';
      }

      function getStatusColor(status) {
        const colors = {
          'submitted': '#ef4444',
          'in-progress': '#f59e0b',
          'completed': '#22c55e',
          'on-hold': '#6b7280',
          'cancelled': '#dc2626'
        };
        return colors[status] || '#6b7280';
      }

      function getStatusLabel(status) {
        const labels = {
          'submitted': 'Submitted',
          'in-progress': 'In Progress',
          'completed': 'Completed',
          'on-hold': 'On Hold',
          'cancelled': 'Cancelled'
        };
        return labels[status] || 'Submitted';
      }
    };

    window.submitCustomizationRequest = function() {
      const type = document.getElementById('requestType').value;
      const priority = document.getElementById('requestPriority').value;
      const title = document.getElementById('requestTitle').value.trim();
      const description = document.getElementById('requestDescription').value.trim();
      const justification = document.getElementById('requestJustification').value.trim();
      const timeline = document.getElementById('requestTimeline').value;
      const notes = document.getElementById('requestNotes').value.trim();

      // Get selected departments
      const departmentCheckboxes = document.querySelectorAll('#customizationRequestModal input[type="checkbox"]:checked');
      const departments = Array.from(departmentCheckboxes).map(cb => cb.value);

      // Validation
      if (!type || !priority || !title || !description) {
        alert('Please fill in all required fields (marked with *)');
        return;
      }

      const newRequest = {
        id: 'CR-' + Date.now(),
        type,
        priority,
        title,
        description,
        justification,
        departments,
        timeline,
        notes,
        status: 'submitted',
        submittedDate: new Date().toLocaleDateString(),
        submittedBy: 'Current User',
        lastUpdated: new Date().toISOString()
      };

      const requests = window.getCustomizationRequests();
      requests.push(newRequest);
      window.saveCustomizationRequests(requests);

      // Clear form
      document.getElementById('requestType').value = '';
      document.getElementById('requestPriority').value = '';
      document.getElementById('requestTitle').value = '';
      document.getElementById('requestDescription').value = '';
      document.getElementById('requestJustification').value = '';
      document.getElementById('requestTimeline').value = '';
      document.getElementById('requestNotes').value = '';
      departmentCheckboxes.forEach(cb => cb.checked = false);

      // Close modal and show success
      document.getElementById('customizationRequestModal').remove();
      
      alert('✅ Customization request submitted successfully!\\n\\nRequest ID: ' + newRequest.id + '\\n\\nYou can track its progress in the Request History section.');
    };

    window.viewCustomizationRequest = function(requestId) {
      const requests = window.getCustomizationRequests();
      const request = requests.find(r => r.id === requestId);
      
      if (!request) {
        alert('Request not found');
        return;
      }

      const modal = document.createElement('div');
      modal.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.7);z-index:10001;display:flex;
        align-items:center;justify-content:center;
      `;

      const content = document.createElement('div');
      content.style.cssText = `
        background:white;border-radius:12px;width:90%;max-width:600px;
        max-height:90vh;overflow-y:auto;position:relative;
      `;

      content.innerHTML = `
        <div style="padding:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="margin:0;font-size:18px;color:#1f2937;">Request Details</h2>
            <button onclick="this.closest('[style*=\"z-index:10001\"]').remove()" 
                    style="background:none;border:none;font-size:24px;cursor:pointer;color:#6b7280;">×</button>
          </div>
          
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:16px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px;">
              <div>
                <strong style="font-size:12px;color:#374151;">Request ID:</strong>
                <div style="font-size:14px;color:#1f2937;">${request.id}</div>
              </div>
              <div>
                <strong style="font-size:12px;color:#374151;">Status:</strong>
                <span style="background:${getStatusColor(request.status)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;margin-left:4px;">
                  ${getStatusLabel(request.status)}
                </span>
              </div>
              <div>
                <strong style="font-size:12px;color:#374151;">Priority:</strong>
                <span style="background:${getPriorityColor(request.priority)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;margin-left:4px;">
                  ${getPriorityLabel(request.priority)}
                </span>
              </div>
              <div>
                <strong style="font-size:12px;color:#374151;">Type:</strong>
                <span style="background:${getRequestTypeColor(request.type)};color:white;padding:2px 8px;border-radius:12px;font-size:11px;margin-left:4px;">
                  ${getRequestTypeLabel(request.type)}
                </span>
              </div>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <strong style="font-size:12px;color:#374151;">Title:</strong>
            <div style="font-size:14px;color:#1f2937;margin-top:4px;">${request.title}</div>
          </div>

          <div style="margin-bottom:16px;">
            <strong style="font-size:12px;color:#374151;">Description:</strong>
            <div style="font-size:14px;color:#1f2937;margin-top:4px;line-height:1.5;">${request.description}</div>
          </div>

          ${request.justification ? `
            <div style="margin-bottom:16px;">
              <strong style="font-size:12px;color:#374151;">Business Justification:</strong>
              <div style="font-size:14px;color:#1f2937;margin-top:4px;line-height:1.5;">${request.justification}</div>
            </div>
          ` : ''}

          ${request.departments && request.departments.length > 0 ? `
            <div style="margin-bottom:16px;">
              <strong style="font-size:12px;color:#374151;">Affected Departments:</strong>
              <div style="margin-top:4px;">
                ${request.departments.map(dept => 
                  `<span style="background:#e5e7eb;color:#374151;padding:2px 8px;border-radius:12px;font-size:11px;margin-right:4px;">${dept}</span>`
                ).join('')}
              </div>
            </div>
          ` : ''}

          ${request.timeline ? `
            <div style="margin-bottom:16px;">
              <strong style="font-size:12px;color:#374151;">Expected Timeline:</strong>
              <div style="font-size:14px;color:#1f2937;margin-top:4px;">${request.timeline}</div>
            </div>
          ` : ''}

          ${request.notes ? `
            <div style="margin-bottom:16px;">
              <strong style="font-size:12px;color:#374151;">Additional Notes:</strong>
              <div style="font-size:14px;color:#1f2937;margin-top:4px;line-height:1.5;">${request.notes}</div>
            </div>
          ` : ''}

          <div style="border-top:1px solid #e5e7eb;padding-top:16px;margin-top:16px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:12px;color:#6b7280;">
              <div>
                <strong>Submitted:</strong> ${request.submittedDate}<br>
                <strong>By:</strong> ${request.submittedBy}
              </div>
              <div>
                <strong>Last Updated:</strong> ${new Date(request.lastUpdated).toLocaleString()}
              </div>
            </div>
          </div>

          <div style="margin-top:20px;display:flex;gap:8px;justify-content:flex-end;">
            ${request.status === 'submitted' ? `
              <button onclick="window.updateRequestStatus('${request.id}', 'in-progress'); this.closest('[style*=\"z-index:10001\"]').remove(); window.showCustomizationRequestModal();" 
                      style="background:#f59e0b;color:white;border:none;border-radius:4px;padding:8px 16px;font-size:12px;cursor:pointer;">
                Start Work
              </button>
            ` : ''}
            ${request.status === 'in-progress' ? `
              <button onclick="window.updateRequestStatus('${request.id}', 'completed'); this.closest('[style*=\"z-index:10001\"]').remove(); window.showCustomizationRequestModal();" 
                      style="background:#10b981;color:white;border:none;border-radius:4px;padding:8px 16px;font-size:12px;cursor:pointer;">
                Mark Complete
              </button>
            ` : ''}
            <button onclick="this.closest('[style*=\"z-index:10001\"]').remove()" 
                    style="background:#6b7280;color:white;border:none;border-radius:4px;padding:8px 16px;font-size:12px;cursor:pointer;">
              Close
            </button>
          </div>
        </div>
      `;

      modal.appendChild(content);
      document.body.appendChild(modal);

      // Helper functions (same as in main modal)
      function getRequestTypeColor(type) {
        const colors = {
          'feature': '#3b82f6', 'enhancement': '#10b981', 'integration': '#f59e0b',
          'workflow': '#8b5cf6', 'reporting': '#06b6d4', 'ui-ux': '#ec4899',
          'automation': '#84cc16', 'security': '#ef4444', 'performance': '#f97316', 'other': '#6b7280'
        };
        return colors[type] || '#6b7280';
      }

      function getRequestTypeLabel(type) {
        const labels = {
          'feature': 'New Feature', 'enhancement': 'Enhancement', 'integration': 'Integration',
          'workflow': 'Workflow', 'reporting': 'Reporting', 'ui-ux': 'UI/UX',
          'automation': 'Automation', 'security': 'Security', 'performance': 'Performance', 'other': 'Other'
        };
        return labels[type] || 'Other';
      }

      function getPriorityColor(priority) {
        const colors = { 'critical': '#dc2626', 'high': '#f59e0b', 'medium': '#eab308', 'low': '#22c55e' };
        return colors[priority] || '#6b7280';
      }

      function getPriorityLabel(priority) {
        const labels = { 'critical': 'Critical', 'high': 'High', 'medium': 'Medium', 'low': 'Low' };
        return labels[priority] || 'Medium';
      }

      function getStatusColor(status) {
        const colors = { 'submitted': '#ef4444', 'in-progress': '#f59e0b', 'completed': '#22c55e', 'on-hold': '#6b7280', 'cancelled': '#dc2626' };
        return colors[status] || '#6b7280';
      }

      function getStatusLabel(status) {
        const labels = { 'submitted': 'Submitted', 'in-progress': 'In Progress', 'completed': 'Completed', 'on-hold': 'On Hold', 'cancelled': 'Cancelled' };
        return labels[status] || 'Submitted';
      }
    };

    window.updateRequestStatus = function(requestId, newStatus) {
      const requests = window.getCustomizationRequests();
      const requestIndex = requests.findIndex(r => r.id === requestId);
      
      if (requestIndex === -1) {
        alert('Request not found');
        return;
      }

      requests[requestIndex].status = newStatus;
      requests[requestIndex].lastUpdated = new Date().toISOString();
      
      window.saveCustomizationRequests(requests);
      
      const statusLabels = {
        'submitted': 'Submitted',
        'in-progress': 'In Progress', 
        'completed': 'Completed',
        'on-hold': 'On Hold',
        'cancelled': 'Cancelled'
      };
      
      alert('✅ Request status updated to: ' + statusLabels[newStatus]);
    };

    // Enhanced Comments and Notifications System
    class CommentSystem {
      constructor() {
        this.notifications = this.loadNotifications();
        this.currentUser = { id: 'user1', name: 'Current User', role: 'Admin' }; // Simplified for fallback
      }

      loadNotifications() {
        const saved = localStorage.getItem('notifications');
        return saved ? JSON.parse(saved) : [];
      }

      saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
      }

      addComment(orderId, message) {
        const comment = {
          id: this.generateId(),
          orderId,
          userId: this.currentUser.id,
          userName: this.currentUser.name,
          userRole: this.currentUser.role,
          message: message.trim(),
          createdAt: new Date().toISOString(),
          isRead: false,
          readBy: [this.currentUser.id]
        };

        // Find order and add comment
        const order = orders.find(o => o.orderNumber === orderId);
        if (!order) throw new Error('Order not found');

        order.comments = order.comments || [];
        order.comments.push(comment);
        order.lastActivity = new Date().toISOString();

        // Send notifications to involved users
        this.sendCommentNotifications(order, comment);

        return comment;
      }

      getComments(orderId) {
        const order = orders.find(o => o.orderNumber === orderId);
        return order?.comments || [];
      }

      getUnreadCommentCount(orderId) {
        const order = orders.find(o => o.orderNumber === orderId);
        if (!order?.comments) return 0;

        return order.comments.filter(comment => 
          !comment.readBy.includes(this.currentUser.id)
        ).length;
      }

      getTotalUnreadComments() {
        let totalUnread = 0;
        orders.forEach(order => {
          if (order.comments) {
            totalUnread += order.comments.filter(comment => 
              !comment.readBy.includes(this.currentUser.id)
            ).length;
          }
        });
        return totalUnread;
      }

      markCommentsAsRead(orderId) {
        const order = orders.find(o => o.orderNumber === orderId);
        if (!order?.comments) return;

        order.comments.forEach(comment => {
          if (!comment.readBy.includes(this.currentUser.id)) {
            comment.readBy.push(this.currentUser.id);
          }
        });
      }

      addNotification(notification) {
        this.notifications.unshift(notification);
        this.saveNotifications();
        this.showToast(`💬 ${notification.title}`, 'info');
      }

      getUnreadNotificationCount() {
        return this.notifications.filter(n => 
          n.userId === this.currentUser.id && !n.isRead
        ).length;
      }

      markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
          this.saveNotifications();
        }
      }

      sendCommentNotifications(order, comment) {
        // Simple notification for demonstration - in real app would notify specific users
        const notification = {
          id: this.generateId(),
          userId: 'photographer1', // Would be dynamic based on order assignment
          type: 'comment',
          title: `New comment on ${order.title}`,
          message: `${this.currentUser.name}: ${comment.message.substring(0, 100)}${comment.message.length > 100 ? '...' : ''}`,
          orderId: order.orderNumber,
          commentId: comment.id,
          isRead: false,
          createdAt: new Date().toISOString()
        };

        this.addNotification(notification);
      }

      showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6'
        };
        
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: ${colors[type]};
          color: white;
          padding: 12px 16px;
          border-radius: 6px;
          z-index: 1001;
          max-width: 300px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
      }

      generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
      }

      // Show comments modal for an order
      showCommentsModal(orderId) {
        const order = orders.find(o => o.orderNumber === orderId);
        if (!order) return;

        // Mark comments as read when opening
        this.markCommentsAsRead(orderId);

        const modal = document.createElement('div');
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        `;

        const comments = this.getComments(orderId);
        
        modal.innerHTML = `
          <div style="background: white; border-radius: 8px; width: 90%; max-width: 600px; max-height: 80%; overflow: hidden; display: flex; flex-direction: column;">
            <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
              <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Comments - ${order.title}</h3>
              <button onclick="this.closest('.modal').remove()" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            
            <div style="flex: 1; overflow-y: auto; padding: 20px; max-height: 400px;">
              <div id="commentsContainer">
                ${comments.length === 0 ? 
                  '<p style="color: #6b7280; text-align: center; margin: 40px 0;">No comments yet. Start the conversation!</p>' :
                  comments.map(comment => `
                    <div style="margin-bottom: 16px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div>
                          <strong style="color: #374151;">${comment.userName}</strong>
                          <span style="color: #6b7280; font-size: 12px; margin-left: 8px;">${comment.userRole}</span>
                        </div>
                        <span style="color: #6b7280; font-size: 12px;">${new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p style="margin: 0; color: #374151; line-height: 1.5;">${comment.message}</p>
                    </div>
                  `).join('')
                }
              </div>
            </div>
            
            <div style="padding: 20px; border-top: 1px solid #e5e7eb;">
              <form id="commentForm" style="display: flex; gap: 12px;">
                <textarea id="commentMessage" placeholder="Add a comment..." 
                  style="flex: 1; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; resize: vertical; min-height: 60px;" required></textarea>
                <button type="submit" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 500;">Send</button>
              </form>
            </div>
          </div>
        `;

        modal.className = 'modal';
        document.body.appendChild(modal);

        // Handle comment form submission
        document.getElementById('commentForm').addEventListener('submit', (e) => {
          e.preventDefault();
          const message = document.getElementById('commentMessage').value.trim();
          if (!message) return;

          try {
            this.addComment(orderId, message);
            
            // Refresh comments display
            document.getElementById('commentMessage').value = '';
            modal.remove();
            this.showCommentsModal(orderId); // Reopen with updated comments
            
          } catch (error) {
            this.showToast('Error adding comment: ' + error.message, 'error');
          }
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.remove();
          }
        });
      }
    }

    // Initialize comment system
    const commentSystem = new CommentSystem();

    // Add comments column to orders table and update the draw function
    window.commentSystem = commentSystem;

    // Logout function
    window.logout = function() {
      authSystem.logout();
      showToast('Logged out successfully', 'info');
      render(); // Show login screen
    };

    // Notification functions
    window.showNotifications = function() {
      const currentUser = commentSystem.currentUser;
      const notifications = commentSystem.getNotifications(currentUser.id);
      const unreadCount = commentSystem.getUnreadNotificationCount(currentUser.id);

      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      modal.innerHTML = `
        <div style="background: white; border-radius: 8px; width: 90%; max-width: 500px; max-height: 80%; overflow: hidden; display: flex; flex-direction: column;">
          <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Notifications (${unreadCount} unread)</h3>
            <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
          </div>
          
          <div style="flex: 1; overflow-y: auto; max-height: 400px;">
            ${notifications.length === 0 ? 
              '<p style="color: #6b7280; text-align: center; margin: 40px 0;">No notifications yet.</p>' :
              notifications.map(notification => `
                <div style="padding: 16px; border-bottom: 1px solid #f3f4f6; ${notification.isRead ? 'opacity: 0.6;' : 'background: #f0f9ff;'}" 
                     onclick="markNotificationRead('${notification.id}')">
                  <div style="display: flex; justify-content: between; align-items: start;">
                    <div style="flex: 1;">
                      <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #374151;">${notification.title}</h4>
                      <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; line-height: 1.4;">${notification.message}</p>
                      <span style="color: #9ca3af; font-size: 11px;">${new Date(notification.createdAt).toLocaleString()}</span>
                    </div>
                    ${!notification.isRead ? '<div style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; margin-left: 8px; margin-top: 4px;"></div>' : ''}
                  </div>
                </div>
              `).join('')
            }
          </div>
          
          ${notifications.length > 0 ? `
            <div style="padding: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
              <button onclick="markAllNotificationsRead()" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                Mark All as Read
              </button>
            </div>
          ` : ''}
        </div>
      `;

      modal.className = 'modal';
      document.body.appendChild(modal);

      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    };

    window.markNotificationRead = function(notificationId) {
      commentSystem.markNotificationAsRead(notificationId);
      updateNotificationBadge();
      // Refresh notifications panel
      document.querySelector('.modal')?.remove();
      showNotifications();
    };

    window.markAllNotificationsRead = function() {
      const currentUser = commentSystem.currentUser;
      const notifications = commentSystem.getNotifications(currentUser.id);
      notifications.forEach(n => {
        if (!n.isRead) {
          commentSystem.markNotificationAsRead(n.id);
        }
      });
      updateNotificationBadge();
      document.querySelector('.modal')?.remove();
    };

    function updateNotificationBadge() {
      const currentUser = commentSystem.currentUser;
      if (!currentUser) return; // Exit if no user is logged in
      
      const unreadCount = commentSystem.getUnreadNotificationCount(currentUser.id);
      const badge = document.getElementById('notificationCount');
      
      // Check if badge element exists before trying to access it
      if (!badge) {
        console.warn('Notification badge element not found. Skipping badge update.');
        return;
      }
      
      if (unreadCount > 0) {
        badge.style.display = 'flex';
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
      } else {
        badge.style.display = 'none';
      }
    }

    // Initialize notification badge
    updateNotificationBadge();

    searchBox?.addEventListener('input', drawRows);

    document.getElementById('exportCsv')?.addEventListener('click', () => {
      if (currentView === 'orders') {
        const orders = authSystem.getFilteredOrders(allOrders); // Get filtered orders
        const header = 'Order Number,Title,Status,Method,Purchase Group,Event ID,Photographer,Priority,Deadline';
        const rows = orders.map(o => [
          o.orderNumber, o.title, o.status, o.method, 
          o.purchaseGroup ? `${o.purchaseGroup} - ${purchaseGroups[o.purchaseGroup] || 'Unknown'}` : 'N/A', 
          o.eventId || 'N/A', o.photographer, o.priority, o.deadline
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\\n');
        
        const blob = new Blob(['\uFEFF' + header + '\\n' + rows], {type: 'text/csv;charset=utf-8'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `photo_orders_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
      } else if (currentView === 'samples') {
        const header = 'Sample ID,Article Name,Status,Location,Assigned To,Transit History,Last Update';
        const rows = samples.map(s => [
          s.id, s.articleName, s.status, s.location, s.assignedTo, s.transitHistory, s.lastUpdate
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\\n');
        
        const blob = new Blob(['\uFEFF' + header + '\\n' + rows], {type: 'text/csv;charset=utf-8'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `photo_samples_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
      }
    });

    // Start with orders view
    showView('orders');

    // Handler functions for modal interactions
    function handleCreateOrder(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const newOrder = {
        orderNumber: 'ORD-' + Date.now(),
        title: formData.get('title'),
        priority: formData.get('priority'),
        brief: formData.get('brief'),
        status: 'New',
        createdBy: currentUser.name,
        createdDate: new Date().toISOString().split('T')[0],
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      };

      allOrders.push(newOrder);
      saveOrders();
      event.target.closest('.create-order-modal').remove();
      showToast('Order created successfully!', 'success');
      render();
    }

    // Assign to window immediately after definition
    window.handleCreateOrder = handleCreateOrder;

    function useTemplate(templateKey) {
      const template = templates[templateKey];
      if (!template) return;
      
      // Close templates modal
      document.querySelector('.templates-modal')?.remove();
      
      // Directly open the create order modal with pre-filled template data
      showNewOrderModal();
      
      // Wait for modal to be rendered, then fill it with template data
      setTimeout(() => {
        const form = document.getElementById('newOrderForm');
        if (form) {
          // Fill form fields with template data
          const titleField = form.querySelector('input[name="title"]');
          const methodField = form.querySelector('select[name="method"]');
          const priorityField = form.querySelector('select[name="priority"]');
          const briefField = form.querySelector('textarea[name="brief"]');
          const articlesField = form.querySelector('textarea[name="articles"]');
          const budgetField = form.querySelector('input[name="budget"]');
          const deadlineField = form.querySelector('input[name="deadline"]');
          
          if (titleField) titleField.value = template.title;
          if (methodField) methodField.value = template.method;
          if (priorityField) priorityField.value = template.priority;
          if (briefField) briefField.value = template.brief;
          if (articlesField) articlesField.value = template.articles;
          if (budgetField) budgetField.value = template.budget;
          
          // Set deadline to 14 days from now
          if (deadlineField) {
            const deadline = new Date();
            deadline.setDate(deadline.getDate() + 14);
            deadlineField.value = deadline.toISOString().split('T')[0];
          }
          
          // Show success message
          showToast(`📝 Template "${template.title}" loaded into create order form!`, 'success');
          
          // Highlight the form briefly
          form.style.background = 'linear-gradient(135deg, #f0f9ff, #e0f2fe)';
          form.style.transform = 'scale(1.01)';
          form.style.transition = 'all 0.3s ease';
          setTimeout(() => {
            form.style.background = '';
            form.style.transform = '';
          }, 2000);
        }
      }, 300);
    }

    // Assign to window immediately after definition
    window.useTemplate = useTemplate;
  }

  // Global functions for window object
  console.log('All global functions have been assigned immediately after their definitions');

  // Smooth entrance
  setTimeout(() => {
    render(); // This will now check authentication first
    
    // Update badges after initial render
    setTimeout(() => {
      if (window.updateQuickActionBadges && window.authSystem && window.authSystem.isAuthenticated()) {
        window.updateQuickActionBadges();
      }
    }, 500);
    
    // Add keyboard shortcut for sidebar toggle (Ctrl/Cmd + B)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
          sidebar.classList.toggle('collapsed');
        }
      }
    });
  }, 300);

  // Hide loading screen if visible
  const loadingScreenElement = document.getElementById('loadingScreen');
  if (loadingScreenElement) {
    loadingScreenElement.style.opacity = '0';
    setTimeout(() => {
      loadingScreenElement.style.display = 'none';
    }, 300);
  }

} catch (error) {
  console.error('[Fallback] Critical initialization error:', error);
  
  // Show error UI to user
  const root = document.getElementById('app');
  if (root) {
    root.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; padding: 48px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); max-width: 500px; width: 100%; text-align: center;">
          <div style="color: #ef4444; font-size: 48px; margin-bottom: 24px;">⚠️</div>
          <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #1f2937;">Application Error</h1>
          <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px;">The photo order management system encountered an error during initialization.</p>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: left;">
            <div style="font-weight: 600; color: #dc2626; margin-bottom: 8px;">Error Details:</div>
            <div style="font-family: monospace; font-size: 12px; color: #7f1d1d; word-break: break-word;">${error.message}</div>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button onclick="location.reload()" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.15s;">
              🔄 Reload Application
            </button>
            <button onclick="window.open('mailto:support@company.com?subject=Photo Order System Error&body=' + encodeURIComponent('Error: ' + error.message + '\\n\\nPlease describe what you were doing when this error occurred...'), '_blank')" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.15s;">
              📧 Report Issue
            </button>
          </div>
          
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 14px; color: #9ca3af;">If this problem persists, please contact your system administrator.</p>
          </div>
        </div>
      </div>
    `;
  }
  
  // Hide loading screen if visible
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
}

})(); // End of IIFE

