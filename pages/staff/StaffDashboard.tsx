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
import { ICONS } from '../../constants.tsx';

interface StaffDashboardProps {
  activeTab: string;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ activeTab }) => {
  const user = AuthService.getCurrentUser();
  // State internal tetap dipertahankan agar tab di dalam dashboard tetap bisa diklik manual
  const [internalTab, setInternalTab] = useState(activeTab || 'overview');
  
  // CRITICAL FIX: Sinkronkan internalTab jika prop activeTab berubah (diklik dari sidebar)
  useEffect(() => {
    if (activeTab) {
      setInternalTab(activeTab);
    }
  }, [activeTab]);

  const isStaffAdmin = user?.role === UserRole.STAFF_ADMIN;
  const isTechnician = user?.role === UserRole.TECHNICIAN;
  const isMarketing = user?.role === UserRole.MARKETING;

  // Render Logic based on internal routing
  const renderContent = () => {
    // 1. Logic for Staff Admin
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

    // 2. Logic for Technician
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

    // 3. Logic for Marketing
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

    // 4. Default Case
    return <div>Halaman sedang dalam pengembangan.</div>;
  };

  const adminTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Order & Transaksi' },
    { id: 'inventory', label: 'Produk & Stok' },
    { id: 'financials', label: 'Pembayaran & Kas' },
    { id: 'tickets', label: 'Service Hub' },
    { id: 'feedback', label: 'Ulasan & CS' },
    { id: 'reports', label: 'Laporan & Shift' },
  ];

  const technicianTabs = [
    { id: 'overview', label: 'Workbench' },
    { id: 'tickets', label: 'Service Hub' },
    { id: 'tools', label: 'Technical Tools' },
    { id: 'inventory', label: 'Cek Spareparts' },
    { id: 'warranty', label: 'Inspeksi Garansi' },
    { id: 'history', label: 'Riwayat Servis' },
    { id: 'performance', label: 'Performa Saya' },
  ];

  const marketingTabs = [
    { id: 'overview', label: 'Growth Stats' },
    { id: 'promo', label: 'Promo & Campaign' },
    { id: 'content', label: 'Konten & Branding' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'analytics', label: 'Market Analytics' },
    { id: 'reports', label: 'Marketing Reports' },
    { id: 'security', label: 'Kebijakan Akses' },
    { id: 'feedback', label: 'Customer Reviews' },
  ];

  const currentTabs = isStaffAdmin ? adminTabs : isTechnician ? technicianTabs : isMarketing ? marketingTabs : [];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Terminal Ops: {user?.fullName.split(' ')[0]}</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Regional Sumatra Node: <span className="text-indigo-400 font-bold">Sum-N-01 (Verified)</span></p>
        </div>

        {currentTabs.length > 0 && (
          <div className="glass-panel p-1 rounded-2xl flex flex-wrap gap-1 shadow-2xl border-slate-800 overflow-x-auto max-w-full">
            {currentTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setInternalTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${internalTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {renderContent()}

      {/* Operational Reports Shortcut for Admin Only */}
      {isStaffAdmin && internalTab !== 'reports' && (
        <div className="p-8 bg-gradient-to-br from-indigo-600/10 to-indigo-800/5 border border-indigo-500/20 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                 <h4 className="text-xl font-black text-white tracking-tight">Laporan Operasional Shift</h4>
                 <p className="text-sm text-slate-400">Hasilkan ringkasan aktivitas harian, arus kas, dan produktivitas teknisi hari ini.</p>
              </div>
           </div>
           <button onClick={() => setInternalTab('reports')} className="px-8 py-4 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-white/5">Buka Modul Laporan</button>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;