
import { Store } from '../types';

class StoreService {
  private static STORES_KEY = 'st_stores_database';

  private static initDB() {
    const existing = localStorage.getItem(this.STORES_KEY);
    if (!existing) {
      const initialStores: Store[] = [
        {
          id: 's1',
          ownerId: 'u2',
          name: 'Aceh Tech Center',
          location: 'Banda Aceh',
          contact: '+62 811 000 111',
          status: 'active',
          productLimit: 500,
          staffLimit: 10,
          createdAt: '2023-01-15T08:00:00Z',
          totalSales: 1250000000,
          violationCount: 0,
          isFeatured: true
        },
        {
          id: 's2',
          ownerId: 'u2',
          name: 'Meulaboh Gadget Hub',
          location: 'Meulaboh',
          contact: '+62 811 222 333',
          status: 'active',
          productLimit: 100,
          staffLimit: 3,
          createdAt: '2023-06-20T10:30:00Z',
          totalSales: 450000000,
          violationCount: 1,
          isFeatured: false
        }
      ];
      localStorage.setItem(this.STORES_KEY, JSON.stringify(initialStores));
    }
  }

  static getAllStores(): Store[] {
    this.initDB();
    return JSON.parse(localStorage.getItem(this.STORES_KEY) || '[]');
  }

  static addStore(store: Omit<Store, 'id' | 'createdAt' | 'violationCount' | 'totalSales'>) {
    const stores = this.getAllStores();
    const newStore: Store = {
      ...store,
      id: 's' + (stores.length + 1),
      createdAt: new Date().toISOString(),
      violationCount: 0,
      totalSales: 0
    };
    const updated = [...stores, newStore];
    localStorage.setItem(this.STORES_KEY, JSON.stringify(updated));
    return newStore;
  }

  static updateStore(id: string, updates: Partial<Store>) {
    const stores = this.getAllStores();
    const updated = stores.map(s => s.id === id ? { ...s, ...updates } : s);
    localStorage.setItem(this.STORES_KEY, JSON.stringify(updated));
  }

  static deleteStore(id: string) {
    const stores = this.getAllStores();
    const filtered = stores.filter(s => s.id !== id);
    localStorage.setItem(this.STORES_KEY, JSON.stringify(filtered));
  }

  static updateStoreStatus(storeId: string, status: 'active' | 'suspended') {
    this.updateStore(storeId, { status });
  }

  static addViolation(storeId: string) {
    const stores = this.getAllStores();
    const updated = stores.map(s => s.id === storeId ? { ...s, violationCount: (s.violationCount || 0) + 1 } : s);
    localStorage.setItem(this.STORES_KEY, JSON.stringify(updated));
  }
}

export default StoreService;
