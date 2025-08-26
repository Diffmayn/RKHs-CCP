import { PhotoOrder, Article, Sample, SampleStatus, ContentCreationMethod, OrderStatus, SampleTransit } from '../types/index.js';

export class OrderService {
  private readonly STORAGE_KEY = 'photo_orders';
  private readonly SAMPLES_KEY = 'photo_samples';
  private orders: PhotoOrder[] = [];
  private samples: Sample[] = [];
  private loaded = false;

  async ensureLoaded(): Promise<void> {
    if (this.loaded) return;
    
    try {
      await this.loadFromStorage();
      this.loaded = true;
    } catch (error) {
      console.error('Failed to load orders:', error);
      this.initializeWithSampleData();
      this.loaded = true;
    }
  }

  private async loadFromStorage(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const ordersData = localStorage.getItem(this.STORAGE_KEY);
        const samplesData = localStorage.getItem(this.SAMPLES_KEY);
        
        if (ordersData) {
          this.orders = JSON.parse(ordersData);
        }
        
        if (samplesData) {
          this.samples = JSON.parse(samplesData);
        }
        
        if (!ordersData || !samplesData) {
          this.initializeWithSampleData();
        }
        
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private async saveToStorage(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.orders));
        localStorage.setItem(this.SAMPLES_KEY, JSON.stringify(this.samples));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private initializeWithSampleData(): void {
    const sampleArticles: Article[] = [
      { id: 'art-001', name: 'Premium Dog Food 2kg', description: 'High-protein dry dog food', sku: 'PDF-2KG-001', category: 'Pet Food' },
      { id: 'art-002', name: 'Espresso Beans 500g', description: 'Organic fair-trade coffee beans', sku: 'ESB-500-002', category: 'Beverages' },
      { id: 'art-003', name: 'Wireless Bluetooth Speaker', description: 'Portable waterproof speaker', sku: 'WBS-PORT-003', category: 'Electronics' },
      { id: 'art-004', name: 'Running Shoes Size 42', description: 'Lightweight athletic footwear', sku: 'RS-42-004', category: 'Footwear' },
      { id: 'art-005', name: 'Educational Building Blocks', description: 'Wooden educational toys set', sku: 'EBB-SET-005', category: 'Toys' }
    ];

    const sampleSamples: Sample[] = [
      {
        id: 'smp-001',
        articleId: 'art-001',
        articleName: 'Premium Dog Food 2kg',
        status: 'At Photographer',
        location: 'Studio A - Downtown',
        assignedTo: 'John Smith',
        notes: 'Product received in excellent condition',
        createdAt: '2025-08-20T09:00:00Z',
        updatedAt: '2025-08-23T14:30:00Z',
        transitHistory: [
          {
            id: 'transit-001',
            fromLocation: 'Warehouse',
            toLocation: 'Studio A - Downtown',
            transportMethod: 'Courier',
            sentDate: '2025-08-22T10:00:00Z',
            expectedDate: '2025-08-22T16:00:00Z',
            receivedDate: '2025-08-22T15:45:00Z',
            handledBy: 'John Smith',
            trackingNumber: 'TRK-20250822-001',
            notes: 'Package delivered safely'
          }
        ]
      },
      {
        id: 'smp-002',
        articleId: 'art-002',
        articleName: 'Espresso Beans 500g',
        status: 'In Transit to Photo Box',
        location: 'Transit Vehicle #47',
        assignedTo: 'Emily Brown',
        notes: 'Fragile - handle with care',
        createdAt: '2025-08-21T11:30:00Z',
        updatedAt: '2025-08-25T09:15:00Z',
        transitHistory: [
          {
            id: 'transit-002',
            fromLocation: 'Warehouse',
            toLocation: 'Photo Box Station 3',
            transportMethod: 'Internal Delivery',
            sentDate: '2025-08-25T08:00:00Z',
            expectedDate: '2025-08-25T14:00:00Z',
            handledBy: 'Emily Brown',
            trackingNumber: 'INT-20250825-002',
            notes: 'Priority delivery'
          }
        ]
      }
    ];

    this.orders = [
      {
        id: 'ord-001',
        orderNumber: 'ORD-2025-001',
        title: 'Premium Pet Food Photography Campaign',
        status: 'In Progress',
        contentCreationMethod: 'Photographer',
        assignedTo: 'John Smith',
        briefing: `Create high-impact product photography for premium dog food line. Focus on:
        
        • Hero shots showcasing product packaging
        • Lifestyle images with happy dogs
        • Detail shots highlighting key ingredients
        • Marketing materials for both print and digital use
        
        Style: Clean, bright, appetizing
        Deadline: Critical for Q4 campaign launch`,
        articles: [sampleArticles[0]],
        samples: [sampleSamples[0]],
        deadline: '2025-08-30T17:00:00Z',
        priority: 'High',
        costCenter: 'CC-101',
        budget: 5500,
        deliverables: ['Hero Product Shots', 'Lifestyle Photography', 'Detail Macro Shots', 'Social Media Assets'],
        specialInstructions: 'Please ensure all shots are food-safe and follow pet industry guidelines',
        createdAt: '2025-08-20T09:00:00Z',
        updatedAt: '2025-08-23T14:30:00Z',
        createdBy: 'Sarah Johnson',
        tags: ['pet-food', 'product-launch', 'high-priority']
      },
      {
        id: 'ord-002',
        orderNumber: 'ORD-2025-002',
        title: 'Artisan Coffee Product Line',
        status: 'Samples Requested',
        contentCreationMethod: 'Photo Box',
        assignedTo: 'Emily Brown',
        briefing: `Automated photo box session for coffee product line:
        
        • Consistent product shots for e-commerce
        • 360-degree rotation views
        • Color-accurate representation
        • Batch processing for efficiency
        
        Requirements: White background, standardized lighting`,
        articles: [sampleArticles[1]],
        samples: [sampleSamples[1]],
        deadline: '2025-09-05T12:00:00Z',
        priority: 'Medium',
        costCenter: 'CC-102',
        budget: 2200,
        deliverables: ['E-commerce Product Photos', '360° Product Views', 'Thumbnail Images'],
        specialInstructions: 'Maintain consistent color temperature across all shots',
        createdAt: '2025-08-21T11:30:00Z',
        updatedAt: '2025-08-25T09:15:00Z',
        createdBy: 'Mark Wilson',
        tags: ['e-commerce', 'product-photos', 'automated']
      },
      {
        id: 'ord-003',
        orderNumber: 'ORD-2025-003',
        title: 'Tech Product Studio Session',
        status: 'Draft',
        contentCreationMethod: 'Internal Studio',
        assignedTo: '',
        briefing: `Professional studio photography for new tech product launch:
        
        • High-end product photography
        • Technical detail shots
        • Lifestyle and usage scenarios
        • Video content for social media
        
        Studio Requirements: Controlled lighting, multiple backdrop options`,
        articles: [sampleArticles[2]],
        samples: [],
        deadline: '2025-09-15T16:00:00Z',
        priority: 'Medium',
        costCenter: 'CC-106',
        budget: 8000,
        deliverables: ['Product Photography', 'Lifestyle Shots', 'Technical Details', 'Video Content'],
        specialInstructions: 'Coordinate with product team for technical specifications',
        createdAt: '2025-08-24T14:20:00Z',
        updatedAt: '2025-08-24T14:20:00Z',
        createdBy: 'David Lee',
        tags: ['tech-product', 'studio', 'video-content']
      }
    ];

    this.samples = sampleSamples;
    this.saveToStorage();
  }

  // Order Management
  async getAllOrders(): Promise<PhotoOrder[]> {
    await this.ensureLoaded();
    return [...this.orders];
  }

  async getOrderById(id: string): Promise<PhotoOrder | null> {
    await this.ensureLoaded();
    return this.orders.find(order => order.id === id) || null;
  }

  async createOrder(orderData: Omit<PhotoOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<PhotoOrder> {
    await this.ensureLoaded();
    
    const newOrder: PhotoOrder = {
      ...orderData,
      id: `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: this.generateOrderNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.unshift(newOrder);
    await this.saveToStorage();
    return newOrder;
  }

  async updateOrder(id: string, updates: Partial<PhotoOrder>): Promise<PhotoOrder | null> {
    await this.ensureLoaded();
    
    const index = this.orders.findIndex(order => order.id === id);
    if (index === -1) return null;

    this.orders[index] = {
      ...this.orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.saveToStorage();
    return this.orders[index];
  }

  async deleteOrder(id: string): Promise<boolean> {
    await this.ensureLoaded();
    
    const index = this.orders.findIndex(order => order.id === id);
    if (index === -1) return false;

    this.orders.splice(index, 1);
    await this.saveToStorage();
    return true;
  }

  // Sample Management
  async getAllSamples(): Promise<Sample[]> {
    await this.ensureLoaded();
    return [...this.samples];
  }

  async getSampleById(id: string): Promise<Sample | null> {
    await this.ensureLoaded();
    return this.samples.find(sample => sample.id === id) || null;
  }

  async createSample(sampleData: Omit<Sample, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sample> {
    await this.ensureLoaded();
    
    const newSample: Sample = {
      ...sampleData,
      id: `smp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.samples.unshift(newSample);
    await this.saveToStorage();
    return newSample;
  }

  async updateSampleStatus(id: string, status: SampleStatus, location: string, notes?: string): Promise<Sample | null> {
    await this.ensureLoaded();
    
    const index = this.samples.findIndex(sample => sample.id === id);
    if (index === -1) return null;

    this.samples[index] = {
      ...this.samples[index],
      status,
      location,
      notes: notes || this.samples[index].notes,
      updatedAt: new Date().toISOString()
    };

    await this.saveToStorage();
    return this.samples[index];
  }

  async addSampleTransit(sampleId: string, transit: Omit<SampleTransit, 'id'>): Promise<Sample | null> {
    await this.ensureLoaded();
    
    const index = this.samples.findIndex(sample => sample.id === sampleId);
    if (index === -1) return null;

    const newTransit: SampleTransit = {
      ...transit,
      id: `transit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.samples[index].transitHistory.push(newTransit);
    this.samples[index].updatedAt = new Date().toISOString();

    await this.saveToStorage();
    return this.samples[index];
  }

  // Article Management
  async addArticleToOrder(orderId: string, article: Omit<Article, 'id'>): Promise<PhotoOrder | null> {
    await this.ensureLoaded();
    
    const index = this.orders.findIndex(order => order.id === orderId);
    if (index === -1) return null;

    const newArticle: Article = {
      ...article,
      id: `art-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.orders[index].articles.push(newArticle);
    this.orders[index].updatedAt = new Date().toISOString();

    await this.saveToStorage();
    return this.orders[index];
  }

  async removeArticleFromOrder(orderId: string, articleId: string): Promise<PhotoOrder | null> {
    await this.ensureLoaded();
    
    const index = this.orders.findIndex(order => order.id === orderId);
    if (index === -1) return null;

    this.orders[index].articles = this.orders[index].articles.filter(article => article.id !== articleId);
    this.orders[index].updatedAt = new Date().toISOString();

    await this.saveToStorage();
    return this.orders[index];
  }

  // Utility Methods
  private generateOrderNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const sequence = String(this.orders.length + 1).padStart(3, '0');
    return `ORD-${year}${month}${day}-${sequence}`;
  }

  async getOrderStatistics(): Promise<any> {
    await this.ensureLoaded();
    
    const total = this.orders.length;
    const byStatus = this.orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byMethod = this.orders.reduce((acc, order) => {
      acc[order.contentCreationMethod] = (acc[order.contentCreationMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, byStatus, byMethod };
  }

  async getSampleStatistics(): Promise<any> {
    await this.ensureLoaded();
    
    const total = this.samples.length;
    const byStatus = this.samples.reduce((acc, sample) => {
      acc[sample.status] = (acc[sample.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byLocation = this.samples.reduce((acc, sample) => {
      acc[sample.location] = (acc[sample.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, byStatus, byLocation };
  }

  async exportToCSV(type: 'orders' | 'samples'): Promise<string> {
    await this.ensureLoaded();
    
    if (type === 'orders') {
      const headers = ['Order Number', 'Title', 'Status', 'Method', 'Assigned To', 'Deadline', 'Priority', 'Articles Count'];
      const rows = this.orders.map(order => [
        order.orderNumber,
        order.title,
        order.status,
        order.contentCreationMethod,
        order.assignedTo || '',
        new Date(order.deadline).toLocaleDateString(),
        order.priority,
        order.articles.length.toString()
      ]);
      
      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    } else {
      const headers = ['Sample ID', 'Article Name', 'Status', 'Location', 'Assigned To', 'Created', 'Updated'];
      const rows = this.samples.map(sample => [
        sample.id,
        sample.articleName,
        sample.status,
        sample.location,
        sample.assignedTo || '',
        new Date(sample.createdAt).toLocaleDateString(),
        new Date(sample.updatedAt).toLocaleDateString()
      ]);
      
      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }
  }
}
