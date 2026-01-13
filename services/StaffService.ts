
import { User, UserRole, AuditCategory } from '../types';
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

    // Perbarui data tambahan (storeId)
    const db = AuthService.getAllUsers();
    const updated = db.map(u => u.id === newUser.id ? { ...u, storeId: data.storeId, status: 'active' as const } : u);
    localStorage.setItem('st_users_database', JSON.stringify(updated));

    SecurityService.addLog({
      userId: ownerId,
      userName: 'Store Owner',
      action: 'STAFF_RECRUITMENT',
      category: AuditCategory.PERMISSION,
      details: `Menambah staf baru: ${data.fullName} (${data.role})`,
      ip: '127.0.0.1',
      severity: 'INFO'
    });

    return newUser;
  }

  // Add comment: Fix missing resetStaffPassword method
  static resetStaffPassword(ownerId: string, staffId: string): string {
    const newPass = Math.random().toString(36).substr(2, 8);
    const db = AuthService.getAllUsers();
    const updated = db.map(u => u.id === staffId ? { ...u, requiresPasswordChange: true } : u);
    localStorage.setItem('st_users_database', JSON.stringify(updated));

    SecurityService.addLog({
      userId: ownerId,
      userName: 'Store Owner',
      action: 'STAFF_PASSWORD_RESET',
      category: AuditCategory.SECURITY,
      details: `Memaksa reset password untuk staf ID: ${staffId}`,
      ip: '127.0.0.1',
      severity: 'WARN'
    });

    return newPass;
  }

  static updateStaffMember(ownerId: string, userId: string, updates: Partial<User>) {
    const db = AuthService.getAllUsers();
    const updated = db.map(u => u.id === userId ? { ...u, ...updates } : u);
    localStorage.setItem('st_users_database', JSON.stringify(updated));
    
    SecurityService.addLog({
      userId: ownerId,
      userName: 'Store Owner',
      action: 'STAFF_UPDATE',
      category: AuditCategory.PERMISSION,
      details: `Memperbarui profil staf ID: ${userId}`,
      ip: '127.0.0.1',
      severity: 'INFO'
    });
  }

  static deleteStaffMember(ownerId: string, userId: string) {
    AuthService.deleteUser(userId);
    SecurityService.addLog({
      userId: ownerId,
      userName: 'Store Owner',
      action: 'STAFF_TERMINATION',
      category: AuditCategory.PERMISSION,
      details: `Menghapus akses staf ID: ${userId}`,
      ip: '127.0.0.1',
      severity: 'WARN'
    });
  }
}

export default StaffService;
