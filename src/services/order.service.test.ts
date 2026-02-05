/**
 * Sample unit test for order service
 * Location: src/services/__tests__/order.service.test.ts
 */

import {
  normalizeArticles,
  createNormalizedArticle,
  formatArticlesAsPlainText,
  OrderStore,
} from '../order.service';
import type { PhotoOrder } from '../../types';

describe('Order Service', () => {
  describe('normalizeArticles', () => {
    it('should handle empty input', () => {
      expect(normalizeArticles(null)).toEqual([]);
      expect(normalizeArticles(undefined)).toEqual([]);
      expect(normalizeArticles([])).toEqual([]);
    });

    it('should normalize single article object', () => {
      const input = {
        name: 'Test Product',
        ean: '1234567890123',
        articleNumber: 'ART-001',
        quantity: 5,
      };
      
      const result = normalizeArticles(input);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test Product');
      expect(result[0].ean).toBe('1234567890123');
      expect(result[0].articleNumber).toBe('ART-001');
      expect(result[0].quantity).toBe(5);
    });

    it('should normalize array of articles', () => {
      const input = [
        { name: 'Product 1', ean: '111' },
        { name: 'Product 2', ean: '222' },
      ];
      
      const result = normalizeArticles(input);
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Product 1');
      expect(result[1].name).toBe('Product 2');
    });

    it('should parse string format', () => {
      const input = 'Product Name [EAN: 1234567890123] [Article: ART-001]';
      
      const result = normalizeArticles(input);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Product Name');
      expect(result[0].ean).toBe('1234567890123');
      expect(result[0].articleNumber).toBe('ART-001');
    });
  });

  describe('formatArticlesAsPlainText', () => {
    it('should format articles as comma-separated list', () => {
      const articles = [
        { name: 'Product 1', articleNumber: 'ART-001' },
        { name: 'Product 2', articleNumber: 'ART-002' },
      ];
      
      const result = formatArticlesAsPlainText(articles);
      
      expect(result).toContain('Product 1');
      expect(result).toContain('Product 2');
    });

    it('should return empty string for no articles', () => {
      expect(formatArticlesAsPlainText([])).toBe('');
      expect(formatArticlesAsPlainText(null)).toBe('');
    });
  });

  describe('OrderStore', () => {
    let store: OrderStore;
    const mockOrder: PhotoOrder = {
      orderNumber: 'ORD-001',
      title: 'Test Order',
      status: 'pending',
      articles: [],
      createdAt: new Date().toISOString(),
    };

    beforeEach(() => {
      store = new OrderStore();
    });

    it('should initialize empty', () => {
      expect(store.getAll()).toEqual([]);
    });

    it('should add new order', () => {
      const result = store.upsert(mockOrder);
      expect(result).toBe(true);
      expect(store.getAll()).toHaveLength(1);
      expect(store.getAll()[0].orderNumber).toBe('ORD-001');
    });

    it('should update existing order', () => {
      store.upsert(mockOrder);
      store.upsert({ ...mockOrder, title: 'Updated Title' });
      
      expect(store.getAll()).toHaveLength(1);
      expect(store.getAll()[0].title).toBe('Updated Title');
    });

    it('should reject order without orderNumber', () => {
      const invalidOrder = { title: 'No Order Number' } as PhotoOrder;
      const result = store.upsert(invalidOrder);
      
      expect(result).toBe(false);
      expect(store.getAll()).toHaveLength(0);
    });

    it('should find order by number', () => {
      store.upsert(mockOrder);
      const found = store.findByOrderNumber('ORD-001');
      
      expect(found).not.toBeNull();
      expect(found?.title).toBe('Test Order');
    });

    it('should return null for non-existent order', () => {
      const found = store.findByOrderNumber('NON-EXISTENT');
      expect(found).toBeNull();
    });

    it('should remove order', () => {
      store.upsert(mockOrder);
      const removed = store.remove('ORD-001');
      
      expect(removed).toBe(true);
      expect(store.getAll()).toHaveLength(0);
    });

    it('should return false when removing non-existent order', () => {
      const removed = store.remove('NON-EXISTENT');
      expect(removed).toBe(false);
    });

    it('should notify listeners on changes', () => {
      const listener = jest.fn();
      store.subscribe(listener);
      
      store.upsert(mockOrder);
      
      expect(listener).toHaveBeenCalledWith([mockOrder]);
    });

    it('should unsubscribe listeners', () => {
      const listener = jest.fn();
      const unsubscribe = store.subscribe(listener);
      
      unsubscribe();
      store.upsert(mockOrder);
      
      expect(listener).not.toHaveBeenCalled();
    });

    it('should patch order', () => {
      store.upsert(mockOrder);
      const patched = store.patch('ORD-001', { status: 'completed' });
      
      expect(patched).not.toBeNull();
      expect(patched?.status).toBe('completed');
    });

    it('should return null when patching non-existent order', () => {
      const patched = store.patch('NON-EXISTENT', { status: 'completed' });
      expect(patched).toBeNull();
    });
  });
});
