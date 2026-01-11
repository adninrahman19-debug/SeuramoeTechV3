
import React from 'react';
import { UserRole } from '../types';
import AuthService from '../auth/AuthService';
import SuperAdminDashboard from './superadmin/SuperAdminDashboard';
import OwnerDashboard from './storeowner/OwnerDashboard';
import StaffDashboard from './staff/StaffDashboard';
import CustomerDashboard from './customer/CustomerDashboard';

interface DashboardProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab, onTabChange }) => {
  const user = AuthService.getCurrentUser();

  if (!user) return null;

  // Dispatcher logic based on role
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      return <SuperAdminDashboard activeTab={activeTab as any} onTabChange={onTabChange} />;
    
    case UserRole.STORE_OWNER:
      return <OwnerDashboard activeTab={activeTab as any} onTabChange={onTabChange} />;
    
    case UserRole.STAFF_ADMIN:
    case UserRole.TECHNICIAN:
    case UserRole.MARKETING:
      // Staff uses internal tab state now to manage the complex admin hub
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
