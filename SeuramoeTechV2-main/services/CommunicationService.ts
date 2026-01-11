
import { Announcement, AnnouncementTarget, NotificationChannel } from '../types';

class CommunicationService {
  private static ANNOUNCEMENTS_KEY = 'st_announcements';
  private static NOTIFICATIONS_KEY = 'st_notification_configs';

  private static init() {
    if (!localStorage.getItem(this.ANNOUNCEMENTS_KEY)) {
      const initialAnnouncements: Announcement[] = [
        {
          id: 'ann-1',
          title: 'System Maintenance - regional Aceh Node',
          content: 'We will be performing maintenance on the Sumatra regional servers this Sunday at 02:00 AM WIB.',
          targetType: AnnouncementTarget.GLOBAL,
          priority: 'HIGH',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ann-2',
          title: 'New Feature: WhatsApp Integration',
          content: 'Store Owners can now send automatic repair updates via WhatsApp to customers.',
          targetType: AnnouncementTarget.ROLE,
          targetValue: 'STORE_OWNER',
          priority: 'NORMAL',
          isActive: true,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      localStorage.setItem(this.ANNOUNCEMENTS_KEY, JSON.stringify(initialAnnouncements));
    }

    if (!localStorage.getItem(this.NOTIFICATIONS_KEY)) {
      const initialChannels: NotificationChannel[] = [
        { id: 'email', name: 'Email Gateway (SMTP)', isEnabled: true, provider: 'SendGrid Platform', status: 'operational' },
        { id: 'whatsapp', name: 'WhatsApp Business API', isEnabled: true, provider: 'Waba Sumatra Bridge', status: 'operational' },
        { id: 'push', name: 'Web Push Notifications', isEnabled: false, provider: 'Firebase Cloud Messaging', status: 'offline' },
        { id: 'inapp', name: 'In-App Notifications', isEnabled: true, provider: 'Seuramoe Internal', status: 'operational' },
      ];
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(initialChannels));
    }
  }

  static getAnnouncements(): Announcement[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.ANNOUNCEMENTS_KEY) || '[]');
  }

  static saveAnnouncement(ann: Announcement) {
    const anns = this.getAnnouncements();
    const idx = anns.findIndex(a => a.id === ann.id);
    if (idx !== -1) {
      anns[idx] = ann;
    } else {
      anns.unshift({ ...ann, id: 'ann-' + Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() });
    }
    localStorage.setItem(this.ANNOUNCEMENTS_KEY, JSON.stringify(anns));
  }

  static deleteAnnouncement(id: string) {
    const anns = this.getAnnouncements();
    localStorage.setItem(this.ANNOUNCEMENTS_KEY, JSON.stringify(anns.filter(a => a.id !== id)));
  }

  static getChannels(): NotificationChannel[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.NOTIFICATIONS_KEY) || '[]');
  }

  static updateChannel(channel: NotificationChannel) {
    const channels = this.getChannels();
    const updated = channels.map(c => c.id === channel.id ? channel : c);
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(updated));
  }
}

export default CommunicationService;
