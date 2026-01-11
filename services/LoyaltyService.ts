import AuthService from '../auth/AuthService';

export interface PointHistory {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  date: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsRequired: number;
  description: string;
  image: string;
  category: 'SERVICE' | 'VOUCHER' | 'MERCH';
}

class LoyaltyService {
  private static HISTORY_KEY = 'st_loyalty_history';
  private static USER_POINTS_KEY = 'st_user_points_';

  private static init() {
    if (!localStorage.getItem(this.HISTORY_KEY)) {
      const initialHistory: PointHistory[] = [
        { id: 'h1', type: 'CREDIT', amount: 500, description: 'Bonus Registrasi Akun', date: '2023-12-01' },
        { id: 'h2', type: 'CREDIT', amount: 740, description: 'Point Transaksi ORD-5001', date: '2024-01-15' },
      ];
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(initialHistory));
    }
  }

  static getPointsHistory(): PointHistory[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
  }

  static getUserPoints(): number {
    const user = AuthService.getCurrentUser();
    if (!user) return 0;
    const points = localStorage.getItem(this.USER_POINTS_KEY + user.id);
    return points ? parseInt(points) : 1240; // Default mock for Ali Akbar
  }

  static addPoints(amount: number, description: string) {
    const user = AuthService.getCurrentUser();
    if (!user) return;
    
    const currentPoints = this.getUserPoints();
    const newPoints = currentPoints + amount;
    localStorage.setItem(this.USER_POINTS_KEY + user.id, newPoints.toString());
    
    const history = this.getPointsHistory();
    const newEntry: PointHistory = {
      id: 'h-' + Date.now(),
      type: 'CREDIT',
      amount,
      description,
      date: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify([newEntry, ...history]));
    window.dispatchEvent(new Event('points-updated'));
  }

  static spendPoints(amount: number, description: string): boolean {
    const user = AuthService.getCurrentUser();
    if (!user) return false;
    
    const currentPoints = this.getUserPoints();
    if (currentPoints < amount) return false;

    const newPoints = currentPoints - amount;
    localStorage.setItem(this.USER_POINTS_KEY + user.id, newPoints.toString());
    
    const history = this.getPointsHistory();
    const newEntry: PointHistory = {
      id: 'h-' + Date.now(),
      type: 'DEBIT',
      amount,
      description,
      date: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify([newEntry, ...history]));
    window.dispatchEvent(new Event('points-updated'));
    return true;
  }

  static getAvailableRewards(): LoyaltyReward[] {
    return [
      { id: 'r1', title: 'Gratis Pembersihan Unit', pointsRequired: 500, category: 'SERVICE', description: 'Deep cleaning heatsink & fan laptop.', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=200' },
      { id: 'r2', title: 'Voucher Belanja 50rb', pointsRequired: 1000, category: 'VOUCHER', description: 'Potongan langsung untuk produk aksesoris.', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=200' },
      { id: 'r3', title: 'T-Shirt Seuramoe Exclusive', pointsRequired: 2500, category: 'MERCH', description: 'Kaos premium komunitas tech Sumatra.', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=200' },
      { id: 'r4', title: 'Prioritas Antrean Servis', pointsRequired: 300, category: 'SERVICE', description: 'Skip antrean pengerjaan teknisi.', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=200' },
    ];
  }
}

export default LoyaltyService;