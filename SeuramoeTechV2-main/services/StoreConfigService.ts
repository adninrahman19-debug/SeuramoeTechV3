
import { StoreConfig } from '../types';

class StoreConfigService {
  private static CONFIG_KEY_PREFIX = 'st_config_store_';

  private static DEFAULT_CONFIG: StoreConfig = {
    notifications: {
      email: true,
      whatsapp: true,
      inApp: true
    },
    payments: {
      manualTransfer: true,
      paymentGateway: true,
      cod: false
    },
    logistics: {
      couriers: ['JNE', 'J&T']
    },
    financials: {
      taxRate: 11,
      serviceFee: 5000
    },
    hours: {
      monday: { open: '09:00', close: '20:00', isClosed: false },
      tuesday: { open: '09:00', close: '20:00', isClosed: false },
      wednesday: { open: '09:00', close: '20:00', isClosed: false },
      thursday: { open: '09:00', close: '20:00', isClosed: false },
      friday: { open: '09:00', close: '12:00', isClosed: false }, // Break for Friday prayer
      saturday: { open: '10:00', close: '18:00', isClosed: false },
      sunday: { open: '00:00', close: '00:00', isClosed: true }
    },
    socials: {
      instagram: '@aceh_tech',
      facebook: 'Aceh Tech Center',
      whatsapp: '081122334455'
    }
  };

  static getConfig(storeId: string): StoreConfig {
    const key = this.CONFIG_KEY_PREFIX + storeId;
    const existing = localStorage.getItem(key);
    if (!existing) {
      this.saveConfig(storeId, this.DEFAULT_CONFIG);
      return this.DEFAULT_CONFIG;
    }
    return JSON.parse(existing);
  }

  static saveConfig(storeId: string, config: StoreConfig) {
    const key = this.CONFIG_KEY_PREFIX + storeId;
    localStorage.setItem(key, JSON.stringify(config));
  }
}

export default StoreConfigService;
