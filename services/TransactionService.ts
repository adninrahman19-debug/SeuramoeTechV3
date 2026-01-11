
import { Transaction, TransactionType, PaymentStatus } from '../types';

class TransactionService {
  private static TX_KEY = 'st_transactions_ledger';

  private static init() {
    if (!localStorage.getItem(this.TX_KEY)) {
      const initialTx: Transaction[] = [
        {
          id: 'TX-9901',
          storeId: 's1',
          storeName: 'Aceh Tech Center',
          userId: 'u6',
          userName: 'Ali Akbar',
          amount: 1450000,
          platformFee: 145000,
          netAmount: 1305000,
          type: TransactionType.ORDER,
          status: PaymentStatus.SUCCESS,
          paymentMethod: 'Midtrans QRIS',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          description: 'Logitech MX Master 3S Purchase'
        },
        {
          id: 'TX-9902',
          storeId: 's2',
          storeName: 'Meulaboh Gadget Hub',
          userId: 'u2',
          userName: 'Teuku Abdullah',
          amount: 1299000,
          platformFee: 129900,
          netAmount: 1169100,
          type: TransactionType.SUBSCRIPTION,
          status: PaymentStatus.SUCCESS,
          paymentMethod: 'Bank Transfer (Aceh)',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          description: 'Sumatra Expansion Plan Renewal'
        },
        {
          id: 'TX-9903',
          storeId: 's1',
          storeName: 'Aceh Tech Center',
          userId: 'u6',
          userName: 'Ali Akbar',
          amount: 450000,
          platformFee: 0,
          netAmount: -450000,
          type: TransactionType.REFUND,
          status: PaymentStatus.REFUNDED,
          paymentMethod: 'Manual Reverse',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          description: 'Keyboard Return Refund'
        }
      ];
      localStorage.setItem(this.TX_KEY, JSON.stringify(initialTx));
    }
  }

  static getAll(): Transaction[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.TX_KEY) || '[]');
  }

  static updateStatus(id: string, status: PaymentStatus) {
    const txs = this.getAll();
    const updated = txs.map(t => t.id === id ? { ...t, status } : t);
    localStorage.setItem(this.TX_KEY, JSON.stringify(updated));
  }

  static editRecord(id: string, updates: Partial<Transaction>) {
    const txs = this.getAll();
    const updated = txs.map(t => {
      if (t.id === id) {
        const newTx = { ...t, ...updates };
        // Recalculate net if amount or platformFee changed
        if (updates.amount !== undefined || updates.platformFee !== undefined) {
          newTx.netAmount = (newTx.amount || 0) - (newTx.platformFee || 0);
        }
        return newTx;
      }
      return t;
    });
    localStorage.setItem(this.TX_KEY, JSON.stringify(updated));
  }

  static processRefund(id: string) {
    const txs = this.getAll();
    const target = txs.find(t => t.id === id);
    if (!target) return;

    const refundTx: Transaction = {
      id: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      storeId: target.storeId,
      storeName: target.storeName,
      userId: target.userId,
      userName: target.userName,
      amount: target.amount,
      platformFee: 0,
      netAmount: -target.amount,
      type: TransactionType.REFUND,
      status: PaymentStatus.REFUNDED,
      paymentMethod: 'System Internal',
      timestamp: new Date().toISOString(),
      description: `Refund for ${target.id}`
    };

    const updated = [refundTx, ...txs.map(t => t.id === id ? { ...t, status: PaymentStatus.REFUNDED } : t)];
    localStorage.setItem(this.TX_KEY, JSON.stringify(updated));
  }

  static resolveDispute(id: string, resolveToSuccess: boolean) {
    this.updateStatus(id, resolveToSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
  }

  static generateReconciliationReport(): string {
    const txs = this.getAll();
    const success = txs.filter(t => t.status === PaymentStatus.SUCCESS);
    const totalGTV = success.reduce((acc, t) => acc + t.amount, 0);
    const totalFees = success.reduce((acc, t) => acc + t.platformFee, 0);
    const totalRefunds = txs.filter(t => t.status === PaymentStatus.REFUNDED).reduce((acc, t) => acc + t.amount, 0);

    return `
RECONCILIATION REPORT - SEURAMOETECH
Period: ${new Date().toLocaleDateString()}
------------------------------------------
Gross Transaction Volume (GTV): Rp ${totalGTV.toLocaleString()}
Total Platform Commissions: Rp ${totalFees.toLocaleString()}
Total Processed Refunds: Rp ${totalRefunds.toLocaleString()}
Net Settlement Amount: Rp ${(totalFees - totalRefunds).toLocaleString()}
Disputed Transactions Count: ${txs.filter(t => t.status === PaymentStatus.DISPUTED).length}
------------------------------------------
Status: BALANCED
    `.trim();
  }
}

export default TransactionService;
