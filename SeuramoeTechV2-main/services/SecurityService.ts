
import { AuditLog, AuditCategory, SecurityPolicy, IpRule, ActiveSession, UserRole } from '../types';

class SecurityService {
  private static LOGS_KEY = 'st_audit_logs';
  private static POLICY_KEY = 'st_security_policy';
  private static IP_RULES_KEY = 'st_ip_rules';
  private static SESSIONS_KEY = 'st_active_sessions';

  private static init() {
    const existingLogs = localStorage.getItem(this.LOGS_KEY);
    if (!existingLogs) {
      const initialLogs: AuditLog[] = [
        {
          id: 'log-1', timestamp: new Date(Date.now() - 3600000).toISOString(),
          userId: 'u1', userName: 'System Overlord', action: 'Modified Global Tax Rate',
          category: AuditCategory.FINANCIAL, details: 'Changed from 10% to 11%',
          ip: '182.1.22.4', severity: 'WARN'
        },
        {
          id: 'log-2', timestamp: new Date(Date.now() - 7200000).toISOString(),
          userId: 'u2', userName: 'Teuku Abdullah', action: 'Bulk Inventory Upload',
          category: AuditCategory.SYSTEM, details: 'Added 45 new SKUs to Aceh Tech',
          ip: '182.1.22.8', severity: 'INFO'
        }
      ];
      localStorage.setItem(this.LOGS_KEY, JSON.stringify(initialLogs));
    }

    const existingSessions = localStorage.getItem(this.SESSIONS_KEY);
    if (!existingSessions) {
      const initialSessions: ActiveSession[] = [
        { id: 'sess-1', userId: 'u2', userName: 'Teuku Abdullah (Owner)', device: 'MacBook Pro / Chrome', ip: '182.1.22.4', location: 'Banda Aceh', lastActive: 'Now' },
        { id: 'sess-2', userId: 'u3', userName: 'Siti Aminah (Admin)', device: 'Windows PC / Edge', ip: '182.1.22.10', location: 'Banda Aceh', lastActive: '12m ago' },
        { id: 'sess-3', userId: 'u4', userName: 'Budi Santoso (Tech)', device: 'Android / Chrome Mobile', ip: '110.12.3.44', location: 'Meulaboh', lastActive: '1h ago' }
      ];
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(initialSessions));
    }

    const existingPolicy = localStorage.getItem(this.POLICY_KEY);
    if (!existingPolicy) {
      const defaultPolicy: SecurityPolicy = {
        mfaRequired: false,
        minPasswordLength: 8,
        sessionTimeoutMinutes: 120,
        maxLoginAttempts: 5,
        ipFilteringEnabled: true
      };
      localStorage.setItem(this.POLICY_KEY, JSON.stringify(defaultPolicy));
    }

    const existingRules = localStorage.getItem(this.IP_RULES_KEY);
    if (!existingRules) {
      const initialRules: IpRule[] = [
        { id: 'rule-1', ip: '182.1.22.*', type: 'WHITELIST', reason: 'Aceh Regional Node', addedBy: 'System', createdAt: new Date().toISOString() }
      ];
      localStorage.setItem(this.IP_RULES_KEY, JSON.stringify(initialRules));
    }
  }

  static getLogs(userId?: string): AuditLog[] {
    this.init();
    const all: AuditLog[] = JSON.parse(localStorage.getItem(this.LOGS_KEY) || '[]');
    if (userId) return all.filter(l => l.userId === userId);
    return all;
  }

  static addLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const logs = this.getLogs();
    const newLog: AuditLog = {
      ...log,
      id: 'log-' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(this.LOGS_KEY, JSON.stringify([newLog, ...logs].slice(0, 1000)));
  }

  static getActiveSessions(storeId?: string): ActiveSession[] {
    this.init();
    // In demo, we just return all, in real app we'd filter by storeId
    return JSON.parse(localStorage.getItem(this.SESSIONS_KEY) || '[]');
  }

  static revokeSession(sessionId: string) {
    const sessions = this.getActiveSessions();
    const updated = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(updated));
    this.addLog({
      userId: 'u2', userName: 'Teuku Abdullah', action: 'Session Revoked',
      category: AuditCategory.SECURITY, details: `Forced logout for session ID: ${sessionId}`,
      ip: '127.0.0.1', severity: 'WARN'
    });
  }

  static getPolicy(): SecurityPolicy {
    this.init();
    return JSON.parse(localStorage.getItem(this.POLICY_KEY) || '{}');
  }

  static updatePolicy(policy: SecurityPolicy) {
    localStorage.setItem(this.POLICY_KEY, JSON.stringify(policy));
  }

  static getIpRules(): IpRule[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.IP_RULES_KEY) || '[]');
  }

  // Add comment: Add missing addIpRule method to resolve SecurityAudit.tsx error
  static addIpRule(rule: Omit<IpRule, 'id' | 'createdAt'>) {
    const rules = this.getIpRules();
    const newRule: IpRule = {
      ...rule,
      id: 'rule-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(this.IP_RULES_KEY, JSON.stringify([newRule, ...rules]));
  }

  // Add comment: Add missing removeIpRule method to resolve SecurityAudit.tsx error
  static removeIpRule(id: string) {
    const rules = this.getIpRules();
    const updated = rules.filter(r => r.id !== id);
    localStorage.setItem(this.IP_RULES_KEY, JSON.stringify(updated));
  }
}

export default SecurityService;
