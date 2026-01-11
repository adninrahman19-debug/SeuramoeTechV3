
import { UserRole, Permission, RoleConfig } from '../types';

class RoleService {
  private static PERMISSIONS_KEY = 'st_permissions_list';
  private static ROLES_CONFIG_KEY = 'st_roles_config';

  private static DEFAULT_PERMISSIONS: Permission[] = [
    { id: 'p_view_system', name: 'View System Overview', description: 'Access global MRR and growth data', category: 'system' },
    { id: 'p_manage_users', name: 'User Management', description: 'Create, edit, and suspend users', category: 'system' },
    { id: 'p_manage_stores', name: 'Store Management', description: 'Verify and control store accounts', category: 'system' },
    { id: 'p_billing_access', name: 'Billing Control', description: 'Modify plans and revenue config', category: 'billing' },
    { id: 'p_store_ops', name: 'Store Operations', description: 'Manage inventory and staff locally', category: 'store' },
    { id: 'p_tech_tools', name: 'Technician Toolkit', description: 'Process repair tickets and diagnostics', category: 'store' },
    { id: 'p_marketing_tools', name: 'Marketing Hub', description: 'Create campaigns and discounts', category: 'store' },
    { id: 'p_customer_profile', name: 'Customer Hub', description: 'View own orders and repairs', category: 'customer' },
  ];

  private static init() {
    if (!localStorage.getItem(this.PERMISSIONS_KEY)) {
      localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(this.DEFAULT_PERMISSIONS));
    }
    if (!localStorage.getItem(this.ROLES_CONFIG_KEY)) {
      const initialRoles: RoleConfig[] = [
        { role: UserRole.SUPER_ADMIN, color: '#6366f1', permissions: ['p_view_system', 'p_manage_users', 'p_manage_stores', 'p_billing_access'] },
        { role: UserRole.STORE_OWNER, color: '#10b981', permissions: ['p_store_ops', 'p_tech_tools', 'p_marketing_tools'] },
        { role: UserRole.TECHNICIAN, color: '#f59e0b', permissions: ['p_tech_tools'] },
        { role: UserRole.CUSTOMER, color: '#94a3b8', permissions: ['p_customer_profile'] },
      ];
      localStorage.setItem(this.ROLES_CONFIG_KEY, JSON.stringify(initialRoles));
    }
  }

  static getPermissions(): Permission[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.PERMISSIONS_KEY) || '[]');
  }

  static getRolesConfig(): RoleConfig[] {
    this.init();
    return JSON.parse(localStorage.getItem(this.ROLES_CONFIG_KEY) || '[]');
  }

  static updateRolePermissions(role: UserRole, permissions: string[]) {
    const configs = this.getRolesConfig();
    const updated = configs.map(c => c.role === role ? { ...c, permissions } : c);
    localStorage.setItem(this.ROLES_CONFIG_KEY, JSON.stringify(updated));
  }
}

export default RoleService;
