
import { Product, ProductStatus, StockHistory } from '../types';

class InventoryService {
  private static STORAGE_KEY = 'st_global_inventory';
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
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialProducts));
    }
    if (!localStorage.getItem(this.HISTORY_KEY)) {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify([]));
    }
  }

  static getAllGlobalProducts(): Product[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  static getProducts(storeId: string): Product[] {
    return this.getAllGlobalProducts().filter((p: Product) => p.storeId === storeId);
  }

  static addProduct(product: Omit<Product, 'id'>) {
    const all = this.getAllGlobalProducts();
    const newProduct = { ...product, id: 'p-' + Math.random().toString(36).substr(2, 7) };
    const updated = [...all, newProduct];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('inventory-updated'));
    return newProduct;
  }

  static updateProduct(id: string, updates: Partial<Product>) {
    const all = this.getAllGlobalProducts();
    const updated = all.map((p: Product) => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('inventory-updated'));
  }

  static deleteProduct(id: string) {
    const all = this.getAllGlobalProducts();
    const updated = all.filter((p: Product) => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('inventory-updated'));
  }

  static getStockHistory(storeId: string): StockHistory[] {
    const all = JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
    // In a real app we'd filter by storeId
    return all;
  }

  static adjustStock(productId: string, amount: number, reason: string, user: string) {
    const all = this.getAllGlobalProducts();
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
    window.dispatchEvent(new Event('inventory-updated'));
  }
}

export default InventoryService;
