
export interface StockRecommendation {
  id: string;
  productName: string;
  currentStock: number;
  suggestedOrder: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  reason: string;
}

export interface DemandPrediction {
  date: string;
  predictedSales: number;
  confidence: number;
}

export interface PromoInsight {
  promoName: string;
  roi: number;
  conversionBoost: number;
  recommendation: string;
}

class SmartService {
  static getStockRecommendations(): StockRecommendation[] {
    return [
      { id: '1', productName: 'Asus ROG Zephyrus G14', currentStock: 2, suggestedOrder: 8, priority: 'CRITICAL', reason: 'High velocity detected in Sumatra North region. Stock will deplete in 3 days.' },
      { id: '2', productName: 'Logitech MX Master 3S', currentStock: 5, suggestedOrder: 15, priority: 'HIGH', reason: 'Commonly bundled with high-end laptop sales.' },
      { id: '3', productName: 'RAM DDR4 16GB Kingston', currentStock: 12, suggestedOrder: 20, priority: 'MEDIUM', reason: 'Consistent repair demand for older office laptops.' }
    ];
  }

  static getDemandPredictions(): DemandPrediction[] {
    const base = 5000000;
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        predictedSales: base + (Math.random() * 3000000),
        confidence: 85 + (Math.random() * 10)
      };
    });
  }

  static getPromoInsights(): PromoInsight[] {
    return [
      { promoName: 'Ramadan Regional Sale', roi: 4.2, conversionBoost: 25, recommendation: 'Excellent performance. Scale budget by 20% for final week.' },
      { promoName: 'Bundle: Mouse + Laptop', roi: 2.8, conversionBoost: 12, recommendation: 'Average ROI. Try changing mouse model to G502 for better appeal.' }
    ];
  }

  static getSmartReminders() {
    return [
      { id: 'rem-1', title: 'Restock Alert', message: 'ASUS inventory below safety buffer.', type: 'urgent', action: 'inventory' },
      { id: 'rem-2', title: 'SLA Warning', message: 'Ticket #T-8821 exceeds 48h limit.', type: 'warning', action: 'tickets' },
      { id: 'rem-3', title: 'Staff Review', message: 'Budi Santoso achieved 100% KPI this month.', type: 'success', action: 'staff' },
      { id: 'rem-4', title: 'Billing', message: 'SaaS Pro renewal in 5 days.', type: 'info', action: 'billing' }
    ];
  }
}

export default SmartService;
