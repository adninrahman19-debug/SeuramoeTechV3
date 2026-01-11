
import { ApiKey, WebhookConfig, BackgroundJob, SystemMetric } from '../types';

class DevToolService {
  private static KEYS_KEY = 'st_api_keys';
  private static WEBHOOKS_KEY = 'st_webhooks';

  private static init() {
    if (!localStorage.getItem(this.KEYS_KEY)) {
      const initialKeys: ApiKey[] = [
        { id: 'key-1', name: 'Mobile App Gateway', keyPrefix: 'st_live_abc123', status: 'active', createdAt: new Date().toISOString(), lastUsed: '2 mins ago' },
        { id: 'key-2', name: 'Inventory Sync Bot', keyPrefix: 'st_live_xyz789', status: 'active', createdAt: new Date(Date.now() - 86400000).toISOString(), lastUsed: '1 hour ago' }
      ];
      localStorage.setItem(this.KEYS_KEY, JSON.stringify(initialKeys));
    }
    if (!localStorage.getItem(this.WEBHOOKS_KEY)) {
      const initialWebhooks: WebhookConfig[] = [
        { id: 'wh-1', url: 'https://erp.acehtech.com/webhooks/repairs', events: ['ticket.completed', 'ticket.created'], status: 'active', secret: 'whsec_aceh123' }
      ];
      localStorage.setItem(this.WEBHOOKS_KEY, JSON.stringify(initialWebhooks));
    }
  }

  static getApiKeys(): ApiKey[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.KEYS_KEY) || '[]');
  }

  static addApiKey(name: string): ApiKey {
    const keys = this.getApiKeys();
    const newKey: ApiKey = {
      id: 'key-' + Math.random().toString(36).substr(2, 9),
      name,
      keyPrefix: 'st_live_' + Math.random().toString(36).substr(2, 6),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(this.KEYS_KEY, JSON.stringify([...keys, newKey]));
    return newKey;
  }

  static revokeKey(id: string) {
    const keys = this.getApiKeys();
    const updated = keys.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k);
    localStorage.setItem(this.KEYS_KEY, JSON.stringify(updated));
  }

  static getWebhooks(): WebhookConfig[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.WEBHOOKS_KEY) || '[]');
  }

  static addWebhook(webhook: Omit<WebhookConfig, 'id' | 'secret'>): WebhookConfig {
    const hooks = this.getWebhooks();
    const newHook: WebhookConfig = {
      ...webhook,
      id: 'wh-' + Date.now(),
      secret: 'whsec_' + Math.random().toString(36).substr(2, 12)
    };
    localStorage.setItem(this.WEBHOOKS_KEY, JSON.stringify([...hooks, newHook]));
    return newHook;
  }

  static getJobs(): BackgroundJob[] {
    return [
      { id: 'job-1', name: 'Mass Email Broadcast (Sumatra Region)', status: 'running', progress: 45, startedAt: new Date().toISOString() },
      { id: 'job-2', name: 'Database Index Rebuild', status: 'queued', progress: 0, startedAt: new Date().toISOString() },
      { id: 'job-3', name: 'Global Sales Report Gen (Q3)', status: 'completed', progress: 100, startedAt: new Date(Date.now() - 3600000).toISOString(), duration: '12m 4s' },
      { id: 'job-4', name: 'Cloud Storage Sync', status: 'failed', progress: 22, startedAt: new Date(Date.now() - 7200000).toISOString() }
    ];
  }

  static getSystemMetrics(): SystemMetric[] {
    return [
      { label: 'DB Connections', value: 84, unit: '%', status: 'healthy', history: [40, 50, 45, 80, 84] },
      { label: 'Avg API Latency', value: 124, unit: 'ms', status: 'healthy', history: [110, 130, 115, 124] },
      { label: 'CPU Usage (Node-Sumatra)', value: 92, unit: '%', status: 'warning', history: [30, 45, 60, 85, 92] },
      { label: 'Disk IOPS', value: 4500, unit: 'iops', status: 'healthy', history: [4000, 4200, 4500] }
    ];
  }

  static getErrorLogs() {
    return [
      { id: 'err-1', code: '500', path: '/api/v1/billing/checkout', message: 'Midtrans checksum mismatch', timestamp: '5 mins ago', severity: 'high' },
      { id: 'err-2', code: '404', path: '/uploads/store_logo_99.png', message: 'File not found on S3 Sumatra', timestamp: '12 mins ago', severity: 'low' },
      { id: 'err-3', code: '403', path: '/api/v1/admin/purge-cache', message: 'Invalid developer token', timestamp: '1 hour ago', severity: 'med' }
    ];
  }
}

export default DevToolService;
