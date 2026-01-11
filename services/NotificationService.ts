import AuthService from '../auth/AuthService';

export enum NotificationType {
  ORDER = 'ORDER',
  SERVICE = 'SERVICE',
  PROMO = 'PROMO',
  MESSAGE = 'MESSAGE'
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

    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initial: AppNotification[] = [
        {
          id: 'n-1',
          userId: user.id,
          type: NotificationType.ORDER,
          title: 'Pesanan Dikirim',
          message: 'Unit Logitech G502 Anda sedang dalam perjalanan via J&T Express.',
          isRead: false,
          link: 'orders',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'n-2',
          userId: user.id,
          type: NotificationType.SERVICE,
          title: 'Pembaruan Servis',
          message: 'Teknisi telah mulai mengerjakan MacBook Air Anda. Estimasi selesai: Besok.',
          isRead: true,
          link: 'repairs',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'n-3',
          userId: user.id,
          type: NotificationType.PROMO,
          title: 'Voucher Baru Tersedia!',
          message: 'Gunakan kode ACEHTECH20 untuk diskon 20% servis bulan ini.',
          isRead: false,
          link: 'promo',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
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