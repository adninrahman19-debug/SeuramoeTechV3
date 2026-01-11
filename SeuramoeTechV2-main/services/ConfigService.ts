
import { PlatformConfig, IntegrationConfig } from '../types';

class ConfigService {
  private static PLATFORM_KEY = 'st_platform_config';
  private static INTEGRATIONS_KEY = 'st_integrations_list';

  private static init() {
    if (!localStorage.getItem(this.PLATFORM_KEY)) {
      const defaultConfig: PlatformConfig = {
        branding: {
          name: 'SeuramoeTech',
          tagline: 'Sumatra Tech Retail Ecosystem',
          primaryColor: '#6366f1'
        },
        domains: {
          enableSubdomains: true,
          mainDomain: 'seuramoetech.com',
          reservedSubdomains: ['admin', 'api', 'hq', 'dev']
        },
        features: {
          enableRepairModule: true,
          enableECommerce: true,
          enableWarrantySystem: true,
          enableMultiCurrency: false
        },
        maintenance: {
          isEnabled: false,
          message: 'System is undergoing scheduled regional node updates. Please check back at 04:00 WIB.',
          allowedIps: ['127.0.0.1', '182.1.22.4']
        }
      };
      localStorage.setItem(this.PLATFORM_KEY, JSON.stringify(defaultConfig));
    }

    if (!localStorage.getItem(this.INTEGRATIONS_KEY)) {
      const initialIntegrations: IntegrationConfig[] = [
        { id: 'int-1', provider: 'Midtrans Aceh', category: 'payment', status: 'active', apiKey: 'VT-SERVER-XXXX', webhookUrl: 'https://api.seuramoetech.com/v1/webhooks/midtrans' },
        { id: 'int-2', provider: 'SendGrid Sumatra', category: 'email', status: 'active', apiKey: 'SG.XXXXX' },
        { id: 'int-3', provider: 'Waba Sumatra Bridge', category: 'sms', status: 'active', apiKey: 'WA-KEY-XXXX' },
        { id: 'int-4', provider: 'Google Analytics 4', category: 'analytics', status: 'inactive' }
      ];
      localStorage.setItem(this.INTEGRATIONS_KEY, JSON.stringify(initialIntegrations));
    }
  }

  static getPlatformConfig(): PlatformConfig {
    this.init();
    return JSON.parse(localStorage.getItem(this.PLATFORM_KEY) || '{}');
  }

  static updatePlatformConfig(config: PlatformConfig) {
    localStorage.setItem(this.PLATFORM_KEY, JSON.stringify(config));
  }

  static getIntegrations(): IntegrationConfig[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.INTEGRATIONS_KEY) || '[]');
  }

  static updateIntegration(integration: IntegrationConfig) {
    const ints = this.getIntegrations();
    const updated = ints.map(i => i.id === integration.id ? integration : i);
    localStorage.setItem(this.INTEGRATIONS_KEY, JSON.stringify(updated));
  }
}

export default ConfigService;
