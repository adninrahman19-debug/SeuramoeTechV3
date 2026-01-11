import React from 'react';
import { UserRole } from '../types.ts';
import AuthService from '../auth/AuthService.ts';
import SuperAdminDashboard from './superadmin/SuperAdminDashboard.tsx';
import OwnerDashboard from './storeowner/OwnerDashboard.tsx';
import StaffDashboard from './staff/StaffDashboard.tsx';
import CustomerDashboard from './customer/CustomerDashboard.tsx';

interface DashboardProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab, onTabChange }) => {
  const user = AuthService.getCurrentUser();

  if (!user) return null;

  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      return <SuperAdminDashboard activeTab={activeTab as any} onTabChange={onTabChange} />;
    
    case UserRole.STORE_OWNER:
      return <OwnerDashboard activeTab={activeTab as any} onTabChange={onTabChange} />;
    
    case UserRole.STAFF_ADMIN:
    case UserRole.TECHNICIAN:
    case UserRole.MARKETING:
      return <StaffDashboard activeTab={activeTab as any} />;
    
    case UserRole.CUSTOMER:
      return <CustomerDashboard activeTab={activeTab as any} />;
    
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500">Invalid user role. Please contact support.</p>
        </div>
      );
  }
};

export default Dashboard;