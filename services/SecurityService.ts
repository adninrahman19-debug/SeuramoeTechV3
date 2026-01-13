
import { AuditLog, AuditCategory, SecurityPolicy, IpRule, ActiveSession } from '../types';

class SecurityService {
  private static LOGS_KEY = 'st_audit_logs';
  private static POLICY_KEY = 'st_security_policy';
  private static IP_RULES_KEY = 'st_ip_rules';
  private static SESSIONS_KEY = 'st_active_sessions';
  private static LOCKOUT_KEY = 'st_login_attempts';

  private static init() {
    if (!localStorage.getItem(this.LOGS_KEY)) {
      const initialLogs: AuditLog[] = [
        {
          id: 'log-1', timestamp: new Date(Date.now() - 3600000).toISOString(),
          userId: 'u1', userName: 'System Overlord', action: 'Modified Global Tax Rate',
          category: AuditCategory.FINANCIAL, details: 'Changed from 10% to 11%',
          ip: '182.1.22.4', severity: 'WARN'
        }
      ];
      localStorage.setItem(this.LOGS_KEY, JSON.stringify(initialLogs));
    }

    if (!localStorage.getItem(this.POLICY_KEY)) {
      const defaultPolicy: SecurityPolicy = {
        mfaRequired: false,
        minPasswordLength: 8,
        sessionTimeoutMinutes: 120,
        maxLoginAttempts: 5,
        ipFilteringEnabled: true
      };
      localStorage.setItem(this.POLICY_KEY, JSON.stringify(defaultPolicy));
    }
  }

  // --- Bug Fix: Persisted Lockout Logic ---
  static trackLoginAttempt(username: string): { attempts: number; isLocked: boolean; remaining: number } {
    const data = JSON.parse(localStorage.getItem(this.LOCKOUT_KEY) || '{}');
    const now = Date.now();
    
    if (!data[username]) {
      data[username] = { count: 0, lockUntil: 0 };
    }

    if (data[username].lockUntil > now) {
      return { attempts: data[username].count, isLocked: true, remaining: Math.ceil((data[username].lockUntil - now) / 1000) };
    }

    data[username].count += 1;
    if (data[username].count >= 5) {
      data[username].lockUntil = now + (60 * 1000); // 60 seconds lock
    }

    localStorage.setItem(this.LOCKOUT_KEY, JSON.stringify(data));
    return { 
      attempts: data[username].count, 
      isLocked: data[username].count >= 5, 
      remaining: data[username].count >= 5 ? 60 : 0 
    };
  }

  static resetLoginAttempts(username: string) {
    const data = JSON.parse(localStorage.getItem(this.LOCKOUT_KEY) || '{}');
    delete data[username];
    localStorage.setItem(this.LOCKOUT_KEY, JSON.stringify(data));
  }

  static getLockoutStatus(username: string): { isLocked: boolean; remaining: number } {
    const data = JSON.parse(localStorage.getItem(this.LOCKOUT_KEY) || '{}');
    const now = Date.now();
    if (data[username] && data[username].lockUntil > now) {
      return { isLocked: true, remaining: Math.ceil((data[username].lockUntil - now) / 1000) };
    }
    return { isLocked: false, remaining: 0 };
  }
  // --- End of Fix ---

  static getLogs(userId?: string): AuditLog[] {
    this.init();
    const all: AuditLog[] = JSON.parse(localStorage.getItem(this.LOGS_KEY) || '[]');
    return userId ? all.filter(l => l.userId === userId) : all;
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

  static getActiveSessions(): ActiveSession[] {
    return JSON.parse(localStorage.getItem(this.SESSIONS_KEY) || '[]');
  }

  static revokeSession(sessionId: string) {
    const sessions = this.getActiveSessions();
    const updated = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(updated));
  }

  static getPolicy(): SecurityPolicy {
    this.init();
    return JSON.parse(localStorage.getItem(this.POLICY_KEY) || '{}');
  }

  static updatePolicy(policy: SecurityPolicy) {
    localStorage.setItem(this.POLICY_KEY, JSON.stringify(policy));
  }

  static getIpRules(): IpRule[] {
    return JSON.parse(localStorage.getItem(this.IP_RULES_KEY) || '[]');
  }

  static addIpRule(rule: Omit<IpRule, 'id' | 'createdAt'>) {
    const rules = this.getIpRules();
    const newRule: IpRule = { ...rule, id: 'rule-' + Date.now(), createdAt: new Date().toISOString() };
    localStorage.setItem(this.IP_RULES_KEY, JSON.stringify([newRule, ...rules]));
  }

  static removeIpRule(id: string) {
    const rules = this.getIpRules().filter(r => r.id !== id);
    localStorage.setItem(this.IP_RULES_KEY, JSON.stringify(rules));
  }
}

export default SecurityService;
