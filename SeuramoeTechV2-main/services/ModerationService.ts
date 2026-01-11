
import { Product, ProductStatus } from '../types';

class ModerationService {
  private static PRODUCTS_KEY = 'st_global_products';

  private static init() {
    if (!localStorage.getItem(this.PRODUCTS_KEY)) {
      const initialProducts: Product[] = [
        {
          id: 'prd-1',
          storeId: 's1',
          storeName: 'Aceh Tech Center',
          name: 'MacBook Pro M3 Max 16"',
          price: 45000000,
          category: 'Laptops',
          status: ProductStatus.ACTIVE,
          thumbnail: 'https://images.unsplash.com/photo-1517336714481-48c2d81cae51?auto=format&fit=crop&q=80&w=200',
          // Fix: Added missing required properties for Product interface
          images: ['https://images.unsplash.com/photo-1517336714481-48c2d81cae51?auto=format&fit=crop&q=80&w=200'],
          description: 'High performance laptop for pros.',
          isSponsored: true,
          sku: 'MOD-MBP-M3-16',
          barcode: '1234567890123',
          stock: 10,
          lowStockThreshold: 2
        },
        {
          id: 'prd-2',
          storeId: 's1',
          storeName: 'Aceh Tech Center',
          name: 'iPhone 15 Pro Max',
          price: 24999000,
          category: 'Smartphones',
          status: ProductStatus.ACTIVE,
          thumbnail: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&q=80&w=200',
          // Fix: Added missing required properties for Product interface
          images: ['https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&q=80&w=200'],
          description: 'Latest Apple flagship.',
          isSponsored: false,
          sku: 'MOD-IP15-PM',
          barcode: '1234567890124',
          stock: 15,
          lowStockThreshold: 3
        },
        {
          id: 'prd-3',
          storeId: 's2',
          storeName: 'Meulaboh Gadget Hub',
          name: 'Mechanical Keyboard RGB',
          price: 850000,
          category: 'Accessories',
          status: ProductStatus.FLAGGED,
          thumbnail: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=200',
          // Fix: Added missing required properties for Product interface
          images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=200'],
          description: 'Suspiciously cheap high-end keyboard.',
          isSponsored: false,
          sku: 'MOD-KB-RGB',
          barcode: '1234567890125',
          stock: 5,
          lowStockThreshold: 10
        }
      ];
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(initialProducts));
    }
  }

  static getProducts(): Product[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.PRODUCTS_KEY) || '[]');
  }

  static updateProductStatus(id: string, status: ProductStatus) {
    const products = this.getProducts();
    const updated = products.map(p => p.id === id ? { ...p, status } : p);
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(updated));
  }

  static forcePriceCorrection(id: string, newPrice: number) {
    const products = this.getProducts();
    const updated = products.map(p => p.id === id ? { ...p, price: newPrice, status: ProductStatus.UNDER_REVIEW } : p);
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(updated));
  }

  static toggleSponsorship(id: string) {
    const products = this.getProducts();
    const updated = products.map(p => p.id === id ? { ...p, isSponsored: !p.isSponsored } : p);
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(updated));
  }
}

export default ModerationService;
