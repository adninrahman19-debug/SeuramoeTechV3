
import React, { useState, useEffect } from 'react';
import AuthService from '../../auth/AuthService';
import StoreService from '../../services/StoreService';
import BillingService from '../../services/BillingService';
import { User, UserRole, Store, SubscriptionPlan, RevenueConfig } from '../../types';
import { ICONS } from '../../constants';

// Modular Components
import Overview from './Overview';
import OwnerManagement from './OwnerManagement';
import StoreManagement from './StoreManagement';
import BillingEngine from './BillingEngine';
import SubscriptionPlans from './SubscriptionPlans';
import GlobalTransactions from './GlobalTransactions';
import ActivityLogs from './ActivityLogs';
import SystemConfig from './SystemConfig';
import UserDirectory from './UserDirectory';
import RolePermissions from './RolePermissions';
import ModerationCenter from './ModerationCenter';
import CampaignManager from './CampaignManager';
import SupportOversight from './SupportOversight';
import CommunicationCenter from './CommunicationCenter';
import BusinessIntelligence from './BusinessIntelligence';
import SecurityAudit from './SecurityAudit';
import DevTools from './DevTools';
import ExclusivePowers from './ExclusivePowers';
import RightDrawer from '../../components/Shared/RightDrawer';

interface SuperAdminDashboardProps {
  activeTab: 'overview' | 'users' | 'roles' | 'plans' | 'stores' | 'transactions' | 'billing' | 'moderation' | 'curation' | 'support' | 'communication' | 'analytics' | 'security' | 'devtools' | 'powers' | 'logs' | 'settings';
  onTabChange: (tab: any) => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ activeTab, onTabChange }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [revConfig, setRevConfig] = useState<RevenueConfig | null>(null);
  
  // Detail View State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'user' | 'store'>('user');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setUsers(AuthService.getAllUsers());
    setStores(StoreService.getAllStores());
    setPlans(BillingService.getPlans());
    setRevConfig(BillingService.getRevenueConfig());
  };

  const owners = users.filter(u => u.role === UserRole.STORE_OWNER);
  const pendingApprovals = owners.filter(o => o.status === 'pending');

  const handleApprove = (id: string) => { 
    AuthService.updateUserStatus(id, 'active'); 
    refreshData();
  };

  const handleImpersonate = (id: string) => { 
    AuthService.impersonate(id); 
  };

  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setDrawerMode('user');
    setDrawerOpen(true);
  };

  const openStoreConfig = (store: Store) => {
    setSelectedStore(store);
    setDrawerMode('store');
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <RightDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        title={drawerMode === 'user' ? 'Profil Keamanan & Akses' : 'Konfigurasi Lanjutan Toko'}
      >
        {/* Konten Drawer diterjemahkan secara dinamis dalam file aslinya (simulasi di sini) */}
        <div className="p-4 text-slate-400 italic">Memuat detail administratif...</div>
      </RightDrawer>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Pusat Komando Platform</p>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">HQ Sistem</h1>
        </div>

        <div className="glass-panel p-1 rounded-2xl flex flex-wrap gap-1 shadow-2xl border-slate-800">
          {(['overview', 'users', 'roles', 'plans', 'stores', 'transactions', 'billing', 'moderation', 'curation', 'support', 'communication', 'analytics', 'security', 'devtools', 'powers', 'logs', 'settings'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
            >
              {tab === 'overview' ? 'Ikhtisar' : 
               tab === 'users' ? 'Pengguna' :
               tab === 'roles' ? 'Peran' :
               tab === 'plans' ? 'Paket' :
               tab === 'stores' ? 'Node Toko' :
               tab === 'transactions' ? 'Ledger' :
               tab === 'billing' ? 'Penagihan' :
               tab === 'moderation' ? 'Moderasi' :
               tab === 'curation' ? 'Kurasi' :
               tab === 'support' ? 'Support' :
               tab === 'communication' ? 'Komunikasi' :
               tab === 'analytics' ? 'Analitik' :
               tab === 'security' ? 'Audit Keamanan' :
               tab === 'devtools' ? 'Alat Dev' :
               tab === 'powers' ? 'Kekuasaan Dewa' :
               tab === 'logs' ? 'Log Aktivitas' :
               tab === 'settings' ? 'Pengaturan HQ' : tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <Overview 
          owners={owners}
          stores={stores}
          pendingApprovals={pendingApprovals}
          totalMRR={128400000}
          revenueConfig={revConfig}
          onApprove={handleApprove}
        />
      )}

      {activeTab === 'users' && <UserDirectory users={users} onRefresh={refreshData} onOpenDetails={openUserDetails} />}
      {activeTab === 'roles' && <RolePermissions />}
      {activeTab === 'plans' && <SubscriptionPlans />}
      {activeTab === 'transactions' && <GlobalTransactions />}
      {activeTab === 'moderation' && <ModerationCenter />}
      {activeTab === 'curation' && <CampaignManager />}
      {activeTab === 'support' && <SupportOversight />}
      {activeTab === 'communication' && <CommunicationCenter />}
      {activeTab === 'analytics' && <BusinessIntelligence />}
      {activeTab === 'security' && <SecurityAudit />}
      {activeTab === 'devtools' && <DevTools />}
      {activeTab === 'powers' && <ExclusivePowers />}
      {activeTab === 'stores' && <StoreManagement stores={stores} onToggleStatus={() => {}} onViolation={() => {}} onOpenConfig={openStoreConfig} />}
      {activeTab === 'billing' && <BillingEngine plans={plans} revConfig={revConfig} onUpdateRevConfig={() => {}} />}
      {activeTab === 'logs' && <ActivityLogs />}
      {activeTab === 'settings' && <SystemConfig />}
    </div>
  );
};

export default SuperAdminDashboard;
