
import { Promo, Coupon, PromoType, PromoStatus, StoreCampaign } from '../types';

class PromoService {
  private static PROMOS_KEY = 'st_store_promos';
  private static COUPONS_KEY = 'st_store_coupons';
  private static CAMPAIGNS_KEY = 'st_store_campaigns';

  private static init() {
    if (!localStorage.getItem(this.PROMOS_KEY)) {
      const initialPromos: Promo[] = [
        {
          id: 'prm-1', storeId: 's1', title: 'Eid Mubarak Tech Sale',
          type: PromoType.PERCENTAGE, value: 15,
          startDate: '2024-04-01', endDate: '2024-04-15',
          status: PromoStatus.ACTIVE, currentUsage: 45, usageLimit: 200,
          applicableProducts: ['p-101', 'p-102']
        },
        {
          id: 'prm-2', storeId: 's1', title: 'Gajian Flash Sale',
          type: PromoType.FLASH_SALE, value: 500000,
          startDate: '2024-03-25', endDate: '2024-03-26',
          status: PromoStatus.SCHEDULED, currentUsage: 0, usageLimit: 50,
          applicableProducts: ['p-103']
        }
      ];
      localStorage.setItem(this.PROMOS_KEY, JSON.stringify(initialPromos));
    }
    if (!localStorage.getItem(this.COUPONS_KEY)) {
      const initialCoupons: Coupon[] = [
        { id: 'c-1', storeId: 's1', code: 'WELCOME10', discountType: 'PERCENT', discountValue: 10, minPurchase: 500000, maxUsage: 100, usedCount: 12, expiryDate: '2024-12-31' }
      ];
      localStorage.setItem(this.COUPONS_KEY, JSON.stringify(initialCoupons));
    }
    if (!localStorage.getItem(this.CAMPAIGNS_KEY)) {
      const initialCampaigns: StoreCampaign[] = [
        { id: 'sc-1', storeId: 's1', name: 'Summer Laptop Fest', bannerUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600', ctr: 4.2, conversions: 28, revenueGenerated: 145000000, isActive: true }
      ];
      localStorage.setItem(this.CAMPAIGNS_KEY, JSON.stringify(initialCampaigns));
    }
  }

  static getPromos(storeId: string): Promo[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.PROMOS_KEY) || '[]').filter((p: Promo) => p.storeId === storeId);
  }

  static getCoupons(storeId: string): Coupon[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.COUPONS_KEY) || '[]').filter((c: Coupon) => c.storeId === storeId);
  }

  static getCampaigns(storeId: string): StoreCampaign[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.CAMPAIGNS_KEY) || '[]').filter((c: StoreCampaign) => c.storeId === storeId);
  }

  static addPromo(promo: Omit<Promo, 'id'>) {
    const all = JSON.parse(localStorage.getItem(this.PROMOS_KEY) || '[]');
    const newPromo = { ...promo, id: 'prm-' + Date.now() };
    localStorage.setItem(this.PROMOS_KEY, JSON.stringify([newPromo, ...all]));
    return newPromo;
  }
}

export default PromoService;
