
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
          violationCount: 0
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
          violationCount: 1
        }
      ];
      localStorage.setItem(this.STORES_KEY, JSON.stringify(initialStores));
    }
  }

  static getAllStores(): Store[] {
    this.initDB();
    return JSON.parse(localStorage.getItem(this.STORES_KEY) || '[]');
  }

  static updateStoreStatus(storeId: string, status: 'active' | 'suspended') {
    const stores = this.getAllStores();
    const updated = stores.map(s => s.id === storeId ? { ...s, status } : s);
    localStorage.setItem(this.STORES_KEY, JSON.stringify(updated));
  }

  static overrideLimits(storeId: string, productLimit: number, staffLimit: number) {
    const stores = this.getAllStores();
    const updated = stores.map(s => s.id === storeId ? { ...s, productLimit, staffLimit } : s);
    localStorage.setItem(this.STORES_KEY, JSON.stringify(updated));
  }

  static changeOwner(storeId: string, newOwnerId: string) {
    const stores = this.getAllStores();
    const updated = stores.map(s => s.id === storeId ? { ...s, ownerId: newOwnerId } : s);
    localStorage.setItem(this.STORES_KEY, JSON.stringify(updated));
  }

  static addViolation(storeId: string) {
    const stores = this.getAllStores();
    const updated = stores.map(s => s.id === storeId ? { ...s, violationCount: (s.violationCount || 0) + 1 } : s);
    localStorage.setItem(this.STORES_KEY, JSON.stringify(updated));
  }

  static resetStoreData(storeId: string) {
    // In demo, we just alert. In production, this would wipe related DB records.
    alert(`Data untuk Toko ${storeId} telah di-reset ke pengaturan pabrik.`);
  }
}

export default StoreService;
