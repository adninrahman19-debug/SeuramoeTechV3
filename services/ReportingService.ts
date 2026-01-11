import { Order, SupportTicket, StockHistory, Product } from '../types';
import OrderService from './OrderService';
import SupportService from './SupportService';
import InventoryService from './InventoryService';

export interface ReportSummary {
  label: string;
  value: number | string;
  trend: string;
  isPositive: boolean;
}

class ReportingService {
  static getSalesReport(storeId: string, duration: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    return [
      { date: '2024-01', sales: 45000000, orders: 120 },
      { date: '2024-02', sales: 52000000, orders: 145 },
      { date: '2024-03', sales: 48000000, orders: 130 },
      { date: '2024-04', sales: 61000000, orders: 160 },
    ];
  }

  static getStaffDailySummary(storeId: string) {
    // Mock data based on current context
    return {
      salesTotal: 12450000,
      salesCount: 8,
      repairsResolved: 5,
      newTickets: 3,
      cashOnHand: 4250000,
      inventoryChanges: 12,
      activeShiftTime: '06:45:12'
    };
  }

  static getStockAnalytics(storeId: string) {
    const products = InventoryService.getProducts(storeId);
    return products.map(p => ({
      name: p.name,
      stock: p.stock,
      value: p.stock * p.price,
      status: p.stock <= p.lowStockThreshold ? 'Critical' : 'Healthy'
    })).sort((a, b) => a.stock - b.stock);
  }

  static getServiceMetrics(storeId: string) {
    const tickets = SupportService.getTickets(storeId);
    return {
      total: tickets.length,
      resolved: tickets.filter(t => t.status === 'RESOLVED').length,
      revenue: tickets.reduce((acc, t) => acc + (t.actualCost || 0), 0),
      avgTime: '4.2h'
    };
  }

  static generateExport(type: string, format: 'PDF' | 'EXCEL' | 'CSV') {
    const timestamp = new Date().toISOString().split('T')[0];
    return `SeuramoeTech_Report_${type}_${timestamp}.${format.toLowerCase()}`;
  }
}

export default ReportingService;