
import { PerformanceRank, StaffMetric, Store } from '../types';
import StoreService from './StoreService';

class AnalyticsService {
  static getStoreRankings(): PerformanceRank[] {
    const stores = StoreService.getAllStores();
    // Explicitly defining the return type of map as PerformanceRank to satisfy the literal union type for 'trend'
    return stores.map((s): PerformanceRank => ({
      id: s.id,
      name: s.name,
      location: s.location,
      score: Math.floor(Math.random() * 20) + 80, // Mock 80-100
      totalSales: s.totalSales || 0,
      ticketResolutionRate: Math.floor(Math.random() * 15) + 85,
      trend: Math.random() > 0.5 ? 'up' : 'stable'
    })).sort((a, b) => b.totalSales - a.totalSales);
  }

  static getStaffProductivity(): StaffMetric[] {
    return [
      { id: 'st-1', name: 'Budi Santoso', storeName: 'Aceh Tech Center', ticketsResolved: 142, avgResolutionTime: '3.8h', satisfaction: 4.8 },
      { id: 'st-2', name: 'Agus Pratama', storeName: 'Meulaboh Gadget Hub', ticketsResolved: 98, avgResolutionTime: '5.2h', satisfaction: 4.5 },
      { id: 'st-3', name: 'Siti Aminah', storeName: 'Aceh Tech Center', ticketsResolved: 115, avgResolutionTime: '4.1h', satisfaction: 4.9 },
      { id: 'st-4', name: 'Rahmat Hidayat', storeName: 'Sigli Digital', ticketsResolved: 67, avgResolutionTime: '6.4h', satisfaction: 4.2 },
    ].sort((a, b) => b.ticketsResolved - a.ticketsResolved);
  }

  static getRevenueForecast() {
    return [
      { month: 'Jul', actual: 112000000, projected: 115000000 },
      { month: 'Aug', actual: 128400000, projected: 120000000 },
      { month: 'Sep', actual: null, projected: 142000000 },
      { month: 'Oct', actual: null, projected: 155000000 },
    ];
  }
}

export default AnalyticsService;
