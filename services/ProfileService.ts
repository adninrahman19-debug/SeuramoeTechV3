
import AuthService from '../auth/AuthService';
import { Address, PaymentMethod, LoginSession, PrivacySettings } from '../types';

class ProfileService {
  private static ADDRESSES_KEY = 'st_user_addresses_';
  private static PAYMENTS_KEY = 'st_user_payments_';
  private static SESSIONS_KEY = 'st_user_sessions_';
  private static PRIVACY_KEY = 'st_user_privacy_';

  private static getUserId(): string {
    return AuthService.getCurrentUser()?.id || 'guest';
  }

  static getAddresses(): Address[] {
    const data = localStorage.getItem(this.ADDRESSES_KEY + this.getUserId());
    if (!data) {
      const initial: Address[] = [
        { id: 'addr-1', label: 'Rumah', receiverName: 'Ali Akbar', phone: '081233334444', fullAddress: 'Jl. Teuku Umar No. 12, Banda Aceh', isDefault: true },
        { id: 'addr-2', label: 'Kantor', receiverName: 'Ali Akbar (Seuramoe)', phone: '081233334444', fullAddress: 'Gedung IT Center Lt. 3, Banda Aceh', isDefault: false }
      ];
      this.saveAddresses(initial);
      return initial;
    }
    return JSON.parse(data);
  }

  static saveAddresses(addresses: Address[]) {
    localStorage.setItem(this.ADDRESSES_KEY + this.getUserId(), JSON.stringify(addresses));
  }

  static addAddress(address: Omit<Address, 'id'>) {
    const addresses = this.getAddresses();
    const newAddr = { ...address, id: 'addr-' + Date.now() };
    if (newAddr.isDefault) {
      addresses.forEach(a => a.isDefault = false);
    }
    this.saveAddresses([...addresses, newAddr]);
  }

  static deleteAddress(id: string) {
    const addresses = this.getAddresses().filter(a => a.id !== id);
    this.saveAddresses(addresses);
  }

  static getPaymentMethods(): PaymentMethod[] {
    const data = localStorage.getItem(this.PAYMENTS_KEY + this.getUserId());
    if (!data) {
      const initial: PaymentMethod[] = [
        { id: 'pm-1', type: 'CARD', provider: 'Visa', accountNumber: '•••• 8821', expiryDate: '12/26', isDefault: true },
        { id: 'pm-2', type: 'EWALLET', provider: 'SeuramoePay', accountNumber: '0812****4444', isDefault: false }
      ];
      this.savePaymentMethods(initial);
      return initial;
    }
    return JSON.parse(data);
  }

  static savePaymentMethods(methods: PaymentMethod[]) {
    localStorage.setItem(this.PAYMENTS_KEY + this.getUserId(), JSON.stringify(methods));
  }

  static addPaymentMethod(method: Omit<PaymentMethod, 'id'>) {
    const methods = this.getPaymentMethods();
    const newPm = { ...method, id: 'pm-' + Date.now() };
    if (newPm.isDefault) {
      methods.forEach(m => m.isDefault = false);
    }
    this.savePaymentMethods([...methods, newPm]);
  }

  static deletePaymentMethod(id: string) {
    const methods = this.getPaymentMethods().filter(m => m.id !== id);
    this.savePaymentMethods(methods);
  }

  static getLoginSessions(): LoginSession[] {
    const data = localStorage.getItem(this.SESSIONS_KEY + this.getUserId());
    if (!data) {
      const initial: LoginSession[] = [
        { id: 'sess-1', device: 'Chrome / Windows 11', ip: '182.1.22.8', location: 'Banda Aceh, ID', lastActive: 'Aktif Sekarang', isCurrent: true },
        { id: 'sess-2', device: 'Seuramoe Mobile / Android', ip: '110.12.3.44', location: 'Meulaboh, ID', lastActive: '2 jam lalu', isCurrent: false },
        { id: 'sess-3', device: 'Safari / iPhone 15', ip: '114.79.1.5', location: 'Medan, ID', lastActive: 'Kemarin', isCurrent: false }
      ];
      this.saveSessions(initial);
      return initial;
    }
    return JSON.parse(data);
  }

  static saveSessions(sessions: LoginSession[]) {
    localStorage.setItem(this.SESSIONS_KEY + this.getUserId(), JSON.stringify(sessions));
  }

  static logoutAllOtherDevices() {
    const sessions = this.getLoginSessions();
    const current = sessions.filter(s => s.isCurrent);
    this.saveSessions(current);
  }

  static getPrivacySettings(): PrivacySettings {
    const data = localStorage.getItem(this.PRIVACY_KEY + this.getUserId());
    if (!data) {
      const initial: PrivacySettings = {
        profileVisibility: true,
        marketingEmails: true,
        thirdPartySharing: false,
        activityTracking: true,
        regionalDataSync: true
      };
      this.savePrivacySettings(initial);
      return initial;
    }
    return JSON.parse(data);
  }

  static savePrivacySettings(settings: PrivacySettings) {
    localStorage.setItem(this.PRIVACY_KEY + this.getUserId(), JSON.stringify(settings));
  }

  static exportPersonalData() {
    const user = AuthService.getCurrentUser();
    const data = {
      profile: user,
      addresses: this.getAddresses(),
      payments: this.getPaymentMethods(),
      sessions: this.getLoginSessions(),
      privacy: this.getPrivacySettings(),
      exportDate: new Date().toISOString(),
      platform: "SeuramoeTech Sumatra Regional Node"
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seuramoetech-data-${user?.username || 'user'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static requestAccountDeletion(reason: string) {
    console.log("Account deletion requested:", { userId: this.getUserId(), reason, timestamp: new Date().toISOString() });
    alert("Permintaan penghapusan akun telah dikirim ke platform HQ. Tim kepatuhan SeuramoeTech akan meninjau permintaan Anda dalam 7 hari kerja.");
  }
}

export default ProfileService;
