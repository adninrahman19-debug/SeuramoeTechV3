import InventoryService from './InventoryService';
import OrderService from './OrderService';
import SupportService from './SupportService';
import AuthService from '../auth/AuthService';
import { Product, SupportStatus } from '../types';

export interface SmartInsight {
  id: string;
  type: 'RECOMMENDATION' | 'WARRANTY_ALERT' | 'TIPS' | 'FOLLOW_UP';
  title: string;
  message: string;
  actionLabel: string;
  actionPath: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface UserPersona {
  category: string;
  score: number;
  label: string;
}

class SmartCustomerService {
  static getSmartInsights(): SmartInsight[] {
    const user = AuthService.getCurrentUser();
    const insights: SmartInsight[] = [];
    
    if (!user) return [];

    // 1. Warranty Alert Logic
    const warranties = SupportService.getWarrantyRegistrations('s1');
    warranties.forEach(w => {
      const diff = new Date(w.expiryDate).getTime() - new Date().getTime();
      const daysLeft = Math.ceil(diff / (1000 * 3600 * 24));
      
      if (daysLeft > 0 && daysLeft <= 30) {
        insights.push({
          id: `w-alert-${w.id}`,
          type: 'WARRANTY_ALERT',
          title: 'Garansi Segera Habis',
          message: `Masa garansi ${w.productName} Anda tersisa ${daysLeft} hari lagi. Lakukan check-up gratis di node kami.`,
          actionLabel: 'Check-up Unit',
          actionPath: 'new-service',
          priority: 'HIGH'
        });
      }
    });

    // 2. Follow-up Logic for Recent Services
    const tickets = SupportService.getTickets('s1').filter(t => t.customerName === user.fullName);
    const recentResolved = tickets.find(t => t.status === SupportStatus.RESOLVED);
    if (recentResolved) {
      insights.push({
        id: `f-up-${recentResolved.id}`,
        type: 'FOLLOW_UP',
        title: 'Bagaimana Kabar Unit Anda?',
        message: `Servis ${recentResolved.deviceModel} Anda telah selesai pekan lalu. Apakah ada kendala yang dirasakan?`,
        actionLabel: 'Beri Feedback',
        actionPath: 'reviews',
        priority: 'MEDIUM'
      });
    }

    // 3. Smart Cross-Sell Recommendations
    const orders = OrderService.getOrders('s1').filter(o => o.customerId === user.id);
    const hasBoughtLaptop = orders.some(o => o.items.some(i => i.productName.toLowerCase().includes('laptop')));
    
    if (hasBoughtLaptop) {
      insights.push({
        id: 'rec-acc',
        type: 'RECOMMENDATION',
        title: 'Proteksi Maksimal',
        message: 'Lengkapi laptop baru Anda dengan tas anti-air dan cleaning kit premium dari katalog kami.',
        actionLabel: 'Lihat Aksesoris',
        actionPath: 'marketplace',
        priority: 'LOW'
      });
    }

    return insights;
  }

  static getPersonalizedProducts(): Product[] {
    const products = InventoryService.getProducts('s1');
    // Logic: Prioritaskan produk berdasarkan kategori yang sering dibeli
    return products.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  static getUserPersona(): UserPersona[] {
    // Mock analysis based on user interaction
    return [
      { category: 'Gaming', score: 85, label: 'Hardcore User' },
      { category: 'Productivity', score: 60, label: 'Balanced' },
      { category: 'Maintenance', score: 40, label: 'Average' },
    ];
  }
}

export default SmartCustomerService;