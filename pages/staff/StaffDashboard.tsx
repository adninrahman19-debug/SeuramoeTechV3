
import React, { useState, useEffect } from 'react';
import AuthService from '../../auth/AuthService.ts';
import { UserRole } from '../../types.ts';
import PersonalMetrics from './PersonalMetrics.tsx';
import TaskQueue from './TaskQueue.tsx';
import StaffAdminOverview from './StaffAdminOverview.tsx';
import StaffPayments from './StaffPayments.tsx';
import StaffOrderManager from './StaffOrderManager.tsx';
import StaffInventoryManager from './StaffInventoryManager.tsx'; 
import StaffServiceHub from './StaffServiceHub.tsx'; 
import StaffFeedbackManager from './StaffFeedbackManager.tsx'; 
import StaffOperationalReports from './StaffOperationalReports.tsx'; 
import TechnicianOverview from './TechnicianOverview.tsx';
import TechnicianTicketManager from './TechnicianTicketManager.tsx';
import TechnicianHistory from './TechnicianHistory.tsx';
import TechnicianWarrantyManager from './TechnicianWarrantyManager.tsx';
import TechnicianPerformance from './TechnicianPerformance.tsx';
import TechnicianTools from './TechnicianTools.tsx';
import MarketingOverview from './MarketingOverview.tsx';
import MarketingCampaigns from './MarketingCampaigns.tsx';
import MarketingAnalytics from './MarketingAnalytics.tsx';
import MarketingContent from './MarketingContent.tsx';
import MarketingEngagement from './MarketingEngagement.tsx';
import MarketingReports from './MarketingReports.tsx';
import StaffSecurityPolicy from './StaffSecurityPolicy.tsx';
import NotificationHub from '../../components/Shared/NotificationHub.tsx';
import { ICONS } from '../../constants.tsx';

interface StaffDashboardProps {
  activeTab: string;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ activeTab }) => {
  const user = AuthService.getCurrentUser();
  const [internalTab, setInternalTab] = useState(activeTab || 'overview');
  
  useEffect(() => {
    if (activeTab) {
      setInternalTab(activeTab);
    }
  }, [activeTab]);

  const isStaffAdmin = user?.role === UserRole.STAFF_ADMIN;
  const isTechnician = user?.role === UserRole.TECHNICIAN;
  const isMarketing = user?.role === UserRole.MARKETING;

  const renderContent = () => {
    if (internalTab === 'notifications') return <NotificationHub onNavigate={setInternalTab} />;

    if (isStaffAdmin) {
      switch (internalTab) {
        case 'overview': return <StaffAdminOverview />;
        case 'orders': return <StaffOrderManager />;
        case 'inventory': return <StaffInventoryManager />; 
        case 'financials': return <StaffPayments />;
        case 'tickets': return <StaffServiceHub />;
        case 'feedback': return <StaffFeedbackManager />;
        case 'reports': return <StaffOperationalReports />;
        default: return <StaffAdminOverview />;
      }
    }

    if (isTechnician) {
      switch (internalTab) {
        case 'overview': return <TechnicianOverview />;
        case 'tasks': return <TaskQueue isTechnician={true} />;
        case 'tickets': return <TechnicianTicketManager />;
        case 'inventory': return <StaffInventoryManager />;
        case 'history': return <TechnicianHistory />;
        case 'warranty': return <TechnicianWarrantyManager />;
        case 'performance': return <TechnicianPerformance />;
        case 'tools': return <TechnicianTools />;
        default: return <TechnicianOverview />;
      }
    }

    if (isMarketing) {
      switch (internalTab) {
        case 'overview': return <MarketingOverview />;
        case 'promo': return <MarketingCampaigns />;
        case 'analytics': return <MarketingAnalytics />;
        case 'content': return <MarketingContent />;
        case 'engagement': return <MarketingEngagement />;
        case 'reports': return <MarketingReports />;
        case 'security': return <StaffSecurityPolicy />;
        case 'feedback': return <StaffFeedbackManager />;
        default: return <MarketingOverview />;
      }
    }
    return <div>Halaman sedang dalam pengembangan.</div>;
  };

  const adminTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Order' },
    { id: 'inventory', label: 'Stok' },
    { id: 'financials', label: 'Kas' },
    { id: 'tickets', label: 'Service' },
    { id: 'feedback', label: 'Ulasan' },
    { id: 'reports', label: 'Shift' },
    { id: 'notifications', label: 'Pesan' },
  ];

  const technicianTabs = [
    { id: 'overview', label: 'Workbench' },
    { id: 'tickets', label: 'Service' },
    { id: 'tools', label: 'Tools' },
    { id: 'inventory', label: 'Parts' },
    { id: 'history', label: 'Riwayat' },
    { id: 'notifications', label: 'Pesan' },
  ];

  const marketingTabs = [
    { id: 'overview', label: 'Growth' },
    { id: 'promo', label: 'Promo' },
    { id: 'content', label: 'Konten' },
    { id: 'engagement', label: 'Engage' },
    { id: 'reports', label: 'Reports' },
    { id: 'notifications', label: 'Pesan' },
  ];

  const currentTabs = isStaffAdmin ? adminTabs : isTechnician ? technicianTabs : isMarketing ? marketingTabs : [];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Terminal Ops: {user?.fullName.split(' ')[0]}</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Regional Sumatra Node: <span className="text-indigo-400 font-bold">Sum-N-01</span></p>
        </div>

        {currentTabs.length > 0 && (
          <div className="glass-panel p-1 rounded-2xl flex flex-wrap gap-1 shadow-2xl border-slate-800 overflow-x-auto max-w-full">
            {currentTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setInternalTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${internalTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {renderContent()}
    </div>
  );
};

export default StaffDashboard;
