
import { User, UserRole, AuditLog, AuditCategory } from '../types';
import AuthService from '../auth/AuthService';
import SecurityService from './SecurityService';

export interface StaffPerformance {
  userId: string;
  tasksCompleted: number;
  avgResponseTime: string;
  rating: number;
  activityScore: number;
}

class StaffService {
  private static PERFORMANCE_KEY = 'st_staff_performance';

  private static initPerformance() {
    if (!localStorage.getItem(this.PERFORMANCE_KEY)) {
      const initial: StaffPerformance[] = [
        { userId: 'u3', tasksCompleted: 156, avgResponseTime: '2.4h', rating: 4.9, activityScore: 95 },
        { userId: 'u4', tasksCompleted: 89, avgResponseTime: '4.1h', rating: 4.7, activityScore: 88 },
        { userId: 'u5', tasksCompleted: 42, avgResponseTime: '1.5h', rating: 4.8, activityScore: 92 },
      ];
      localStorage.setItem(this.PERFORMANCE_KEY, JSON.stringify(initial));
    }
  }

  static getStoreStaff(storeId: string): User[] {
    const allUsers = AuthService.getAllUsers();
    return allUsers.filter(u => u.storeId === storeId && 
      [UserRole.STAFF_ADMIN, UserRole.TECHNICIAN, UserRole.MARKETING].includes(u.role));
  }

  static getStaffMetrics(userId: string): StaffPerformance | undefined {
    this.initPerformance();
    const metrics: StaffPerformance[] = JSON.parse(localStorage.getItem(this.PERFORMANCE_KEY) || '[]');
    return metrics.find(m => m.userId === userId);
  }

  static addStaffMember(ownerId: string, data: Omit<User, 'id' | 'status' | 'createdAt'>) {
    const newUser = AuthService.register({
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      role: data.role
    });

    // Update storeId which register doesn't handle in basic form
    const db = AuthService.getAllUsers();
    const updated = db.map(u => u.id === newUser.id ? { ...u, storeId: data.storeId, status: 'active' as const } : u);
    localStorage.setItem('st_users_database', JSON.stringify(updated));

    SecurityService.addLog({
      userId: ownerId,
      userName: 'Store Owner',
      action: 'Staff Recruitment',
      category: AuditCategory.PERMISSION,
      details: `Created new ${data.role} account: ${data.username}`,
      ip: '127.0.0.1',
      severity: 'INFO'
    });

    return newUser;
  }

  static updateStaffMember(ownerId: string, userId: string, updates: Partial<User>) {
    const db = AuthService.getAllUsers();
    const updated = db.map(u => u.id === userId ? { ...u, ...updates } : u);
    localStorage.setItem('st_users_database', JSON.stringify(updated));
    
    SecurityService.addLog({
      userId: ownerId,
      userName: 'Store Owner',
      action: 'Staff Profile Updated',
      category: AuditCategory.PERMISSION,
      details: `Modified access/profile for UID: ${userId}`,
      ip: '127.0.0.1',
      severity: 'INFO'
    });
  }

  static deleteStaffMember(ownerId: string, userId: string) {
    AuthService.deleteUser(userId);
    SecurityService.addLog({
      userId: ownerId,
      userName: 'Store Owner',
      action: 'Staff Termination',
      category: AuditCategory.PERMISSION,
      details: `Removed staff account UID: ${userId}`,
      ip: '127.0.0.1',
      severity: 'WARN'
    });
  }

  static resetStaffPassword(ownerId: string, userId: string) {
    // In demo, we just log the action. In real app, we'd update credential DB.
    SecurityService.addLog({
      userId: ownerId,
      userName: 'Store Owner',
      action: 'Staff Password Reset',
      category: AuditCategory.SECURITY,
      details: `Forced credential reset for staff UID: ${userId}`,
      ip: '127.0.0.1',
      severity: 'WARN'
    });
    return "NewP@ss2024!";
  }
}

export default StaffService;
