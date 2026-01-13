
import AuthService from '../auth/AuthService';

export enum NotificationType {
  ORDER = 'ORDER',
  SERVICE = 'SERVICE',
  PROMO = 'PROMO',
  MESSAGE = 'MESSAGE',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY'
}

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

class NotificationService {
  private static STORAGE_KEY = 'st_user_notifications';

  private static init() {
    const user = AuthService.getCurrentUser();
    if (!user) return;

    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      const initial: AppNotification[] = [];
      
      // Default welcome for all
      initial.push({
        id: 'n-welcome',
        userId: user.id,
        type: NotificationType.SYSTEM,
        title: 'Selamat Datang di SeuramoeTech',
        message: `Halo ${user.fullName}, akun Anda telah terverifikasi di Node Regional Sumatra.`,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // Role specific mocks
      if (user.role === 'SUPER_ADMIN') {
        initial.push({
          id: 'n-sa-1',
          userId: user.id,
          type: NotificationType.SECURITY,
          title: 'Audit Keamanan Mingguan',
          message: 'Laporan audit keamanan Node Sumatra-North-01 siap untuk ditinjau.',
          isRead: false,
          link: 'security',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        });
      }

      if (user.role === 'STORE_OWNER') {
        initial.push({
          id: 'n-so-1',
          userId: user.id,
          type: NotificationType.ORDER,
          title: 'Order Baru Masuk',
          message: 'Pesanan ORD-99211 menunggu verifikasi pembayaran manual.',
          isRead: false,
          link: 'orders',
          createdAt: new Date(Date.now() - 1800000).toISOString()
        });
      }

      // Customer specific mocks
      if (user.role === 'CUSTOMER') {
        initial.push({
          id: 'n-cust-1',
          userId: user.id,
          type: NotificationType.SERVICE,
          title: 'Unit Servis Siap Diambil!',
          message: 'Perbaikan MacBook Air M1 Anda di Node Aceh Tech telah selesai. Silakan cek detail biaya.',
          isRead: false,
          link: 'repairs',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        });
        initial.push({
          id: 'n-cust-2',
          userId: user.id,
          type: NotificationType.PROMO,
          title: 'Voucher Loyalty Aktif',
          message: 'Selamat! Anda mendapatkan voucher potongan 10% untuk kategori aksesoris.',
          isRead: false,
          link: 'promo',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        });
        initial.push({
          id: 'n-cust-3',
          userId: user.id,
          type: NotificationType.SECURITY,
          title: 'Login Perangkat Baru',
          message: 'Akun Anda baru saja diakses melalui Chrome di Medan, ID. Jika ini bukan Anda, segera amankan akun.',
          isRead: true,
          link: 'profile',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        });
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    }
  }

  static getNotifications(): AppNotification[] {
    this.init();
    const user = AuthService.getCurrentUser();
    if (!user) return [];
    const all: AppNotification[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    return all.filter(n => n.userId === user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.isRead).length;
  }

  static markAsRead(id: string) {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const updated = all.map((n: AppNotification) => n.id === id ? { ...n, isRead: true } : n);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('notifications-updated'));
  }

  static markAllAsRead() {
    const user = AuthService.getCurrentUser();
    if (!user) return;
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const updated = all.map((n: AppNotification) => n.userId === user.id ? { ...n, isRead: true } : n);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('notifications-updated'));
  }

  static addNotification(notif: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>) {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const newNotif: AppNotification = {
      ...notif,
      id: 'n-' + Date.now(),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([newNotif, ...all]));
    window.dispatchEvent(new Event('notifications-updated'));
  }

  static deleteNotification(id: string) {
    const all = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    const filtered = all.filter((n: AppNotification) => n.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('notifications-updated'));
  }
}

export default NotificationService;
