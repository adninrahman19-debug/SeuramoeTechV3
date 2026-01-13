
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

    const allNotifs: AppNotification[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    
    // Bug Fix: Check if this specific user has ANY notifications
    const userHasNotifs = allNotifs.some(n => n.userId === user.id);
    
    if (!userHasNotifs) {
      const initial: AppNotification[] = [];
      
      // Default welcome
      initial.push({
        id: `welcome-${user.id}`,
        userId: user.id,
        type: NotificationType.SYSTEM,
        title: 'Selamat Datang di SeuramoeTech',
        message: `Halo ${user.fullName}, terminal Anda telah terhubung ke Node Regional Sumatra.`,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // Role specific mocks for new users
      if (user.role === 'SUPER_ADMIN') {
        initial.push({
          id: `sa-1-${user.id}`, userId: user.id, type: NotificationType.SECURITY,
          title: 'Audit Node Aktif', message: 'Sistem keamanan mendeteksi login administratif baru.',
          isRead: false, link: 'security', createdAt: new Date().toISOString()
        });
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...allNotifs, ...initial]));
      window.dispatchEvent(new Event('notifications-updated'));
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
