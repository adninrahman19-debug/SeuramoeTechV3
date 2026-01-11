
import { Product, ProductStatus, StockHistory } from '../types';

class InventoryService {
  private static STORAGE_KEY = 'st_owner_inventory';
  private static HISTORY_KEY = 'st_stock_history';

  private static init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialProducts: Product[] = [
        {
          id: 'p-101', storeId: 's1', storeName: 'Aceh Tech Center',
          name: 'Asus ROG Zephyrus G14', price: 28500000, promoPrice: 26999000, category: 'Laptops',
          status: ProductStatus.ACTIVE, thumbnail: 'https://images.unsplash.com/photo-1588872657578-7efd3f1514a1?q=80&w=200',
          images: ['https://images.unsplash.com/photo-1588872657578-7efd3f1514a1?q=80&w=200'],
          description: 'High-end gaming laptop with Ryzen 9 and RTX 4070.', isSponsored: true,
          sku: 'LAP-ASUS-ROG-G14', barcode: '880123456789', stock: 5, lowStockThreshold: 3
        },
        {
          id: 'p-102', storeId: 's1', storeName: 'Aceh Tech Center',
          name: 'MacBook Air M2 13"', price: 17200000, category: 'Laptops',
          status: ProductStatus.ACTIVE, thumbnail: 'https://images.unsplash.com/photo-1611186871348-b1ec696e5238?q=80&w=200',
          images: ['https://images.unsplash.com/photo-1611186871348-b1ec696e5238?q=80&w=200'],
          description: 'Apple Silicon powered portability.', isSponsored: false,
          sku: 'LAP-APPLE-MBA-M2', barcode: '880987654321', stock: 2, lowStockThreshold: 5
        },
        {
          id: 'p-103', storeId: 's1', storeName: 'Aceh Tech Center',
          name: 'Logitech G502 Hero', price: 850000, promoPrice: 799000, category: 'Accessories',
          status: ProductStatus.ACTIVE, thumbnail: 'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=200',
          images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=200'],
          description: 'High performance wired gaming mouse.', isSponsored: false,
          sku: 'ACC-LOGI-G502', barcode: '880555666777', stock: 25, lowStockThreshold: 10
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialProducts));
    }
    if (!localStorage.getItem(this.HISTORY_KEY)) {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify([]));
    }
  }

  static getProducts(storeId: string): Product[] {
    this.init();
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    return all.filter((p: Product) => p.storeId === storeId);
  }

  static getStockHistory(storeId: string): StockHistory[] {
    this.init();
    const all = JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
    // In a real app we'd link history entries to products and filter by storeId via the product link
    return all;
  }

  static addProduct(product: Omit<Product, 'id'>) {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const newProduct = { ...product, id: 'p-' + Math.random().toString(36).substr(2, 5) };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...all, newProduct]));
    return newProduct;
  }

  static updateProduct(id: string, updates: Partial<Product>) {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const updated = all.map((p: Product) => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  static adjustStock(productId: string, amount: number, reason: string, user: string) {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const history = JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
    
    const product = all.find((p: Product) => p.id === productId);
    if (!product) return;

    product.stock += amount;
    
    const newEvent: StockHistory = {
      id: 'sth-' + Date.now(),
      productId,
      productName: product.name,
      type: amount > 0 ? 'IN' : 'OUT',
      quantity: Math.abs(amount),
      reason,
      timestamp: new Date().toISOString(),
      user
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify([newEvent, ...history]));
  }

  static deleteProduct(id: string) {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all.filter((p: Product) => p.id !== id)));
  }
}

export default InventoryService;
