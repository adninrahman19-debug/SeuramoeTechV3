import { Order, OrderStatus, PaymentStatus, Transaction, TransactionType } from '../types.ts';

class OrderService {
  private static ORDERS_KEY = 'st_store_orders';

  private static init() {
    if (!localStorage.getItem(this.ORDERS_KEY)) {
      const initialOrders: Order[] = [
        {
          id: 'ORD-99211', storeId: 's1', customerId: 'u6', customerName: 'Ali Akbar',
          customerEmail: 'ali@visitor.com', customerPhone: '+62 812 3333 4444',
          address: 'Jl. Teuku Umar No. 12, Banda Aceh',
          items: [{ id: 'oi-1', productId: 'p-103', productName: 'Logitech G502 Hero', quantity: 1, priceAtPurchase: 850000 }],
          totalAmount: 850000, status: OrderStatus.PENDING, paymentStatus: PaymentStatus.PENDING,
          paymentMethod: 'Bank Aceh Transfer', createdAt: new Date().toISOString()
        },
        {
          id: 'ORD-5001', storeId: 's1', customerId: 'u6', customerName: 'Ali Akbar',
          customerEmail: 'ali@visitor.com', customerPhone: '+62 812 3333 4444',
          address: 'Jl. Teuku Umar No. 12, Banda Aceh',
          items: [{ id: 'oi-1', productId: 'p-103', productName: 'Logitech G502 Hero', quantity: 1, priceAtPurchase: 850000 }],
          totalAmount: 850000, status: OrderStatus.PENDING, paymentStatus: PaymentStatus.SUCCESS,
          paymentMethod: 'Midtrans QRIS', createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(initialOrders));
    }
  }

  static getOrders(storeId: string): Order[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]').filter((o: Order) => o.storeId === storeId);
  }

  static getPendingManualPayments(storeId: string): Order[] {
    return this.getOrders(storeId).filter(o => 
      o.paymentStatus === PaymentStatus.PENDING && 
      o.paymentMethod.includes('Bank')
    );
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
    const updated = orders.map((o: Order) => {
      if (o.id === orderId) {
        // Jika pembayaran sukses, otomatis pindah ke PROCESSING
        const nextStatus = status === PaymentStatus.SUCCESS ? OrderStatus.PROCESSING : o.status;
        return { ...o, paymentStatus: status, status: nextStatus };
      }
      return o;
    });
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(updated));
  }

  static getTransactions(storeId: string): Transaction[] {
    const orders = this.getOrders(storeId);
    return orders.map(o => ({
      id: `TX-${o.id}`,
      storeId: o.storeId,
      userId: o.customerId,
      userName: o.customerName,
      amount: o.totalAmount,
      platformFee: o.totalAmount * 0.1,
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