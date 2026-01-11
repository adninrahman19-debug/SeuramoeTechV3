
import { Order, OrderStatus, PaymentStatus, Transaction, TransactionType } from '../types';

class OrderService {
  private static ORDERS_KEY = 'st_store_orders';
  private static STORE_TX_KEY = 'st_store_transactions';

  private static init() {
    if (!localStorage.getItem(this.ORDERS_KEY)) {
      const initialOrders: Order[] = [
        {
          id: 'ORD-5001', storeId: 's1', customerId: 'u6', customerName: 'Ali Akbar',
          customerEmail: 'ali@visitor.com', customerPhone: '+62 812 3333 4444',
          address: 'Jl. Teuku Umar No. 12, Banda Aceh',
          items: [
            { id: 'oi-1', productId: 'p-103', productName: 'Logitech G502 Hero', quantity: 1, priceAtPurchase: 850000 }
          ],
          totalAmount: 850000, status: OrderStatus.PENDING, paymentStatus: PaymentStatus.SUCCESS,
          paymentMethod: 'Midtrans QRIS', createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'ORD-5002', storeId: 's1', customerId: 'u6', customerName: 'Ali Akbar',
          customerEmail: 'ali@visitor.com', customerPhone: '+62 812 3333 4444',
          address: 'Jl. Teuku Nyak Arief, Lamnyong',
          items: [
            { id: 'oi-2', productId: 'p-101', productName: 'Asus ROG Zephyrus G14', quantity: 1, priceAtPurchase: 28500000 }
          ],
          totalAmount: 28500000, status: OrderStatus.PROCESSING, paymentStatus: PaymentStatus.SUCCESS,
          paymentMethod: 'Bank Aceh Transfer', shippingResi: 'ST-00998822',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(initialOrders));
    }
  }

  static getOrders(storeId: string): Order[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]').filter((o: Order) => o.storeId === storeId);
  }

  static updateOrderStatus(orderId: string, status: OrderStatus, resi?: string) {
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
    const updated = orders.map((o: Order) => {
      if (o.id === orderId) {
        return { ...o, status, shippingResi: resi || o.shippingResi };
      }
      return o;
    });
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(updated));
  }

  static updatePaymentStatus(orderId: string, status: PaymentStatus) {
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
    const updated = orders.map((o: Order) => o.id === orderId ? { ...o, paymentStatus: status } : o);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(updated));
  }

  static getTransactions(storeId: string): Transaction[] {
    // In demo, we derive transactions from orders and subscription records
    const orders = this.getOrders(storeId);
    return orders.map(o => ({
      id: `TX-${o.id}`,
      storeId: o.storeId,
      userId: o.customerId,
      userName: o.customerName,
      amount: o.totalAmount,
      platformFee: o.totalAmount * 0.1, // Mock 10%
      netAmount: o.totalAmount * 0.9,
      type: TransactionType.ORDER,
      status: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      timestamp: o.createdAt,
      description: `Payment for Order ${o.id}`
    }));
  }

  static processRefund(orderId: string) {
    this.updatePaymentStatus(orderId, PaymentStatus.REFUNDED);
    this.updateOrderStatus(orderId, OrderStatus.CANCELLED);
  }
}

export default OrderService;
