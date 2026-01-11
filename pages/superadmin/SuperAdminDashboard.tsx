
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

  const handleTransferOwnership = (storeId: string) => {
    const newOwnerId = prompt("Enter New Owner ID:");
    if (newOwnerId) {
      StoreService.changeOwner(storeId, newOwnerId);
      refreshData();
      setDrawerOpen(false);
    }
  };

  const handleLimitOverride = (storeId: string) => {
    const pLimit = parseInt(prompt("New Product Limit:", "1000") || "0");
    const sLimit = parseInt(prompt("New Staff Seats:", "20") || "0");
    if (pLimit && sLimit) {
      StoreService.overrideLimits(storeId, pLimit, sLimit);
      refreshData();
      setDrawerOpen(false);
    }
  };

  const handleDataReset = (storeId: string) => {
    if (confirm("WARNING: This will wipe all inventory, staff, and sales records for this store. Proceed?")) {
      StoreService.resetStoreData(storeId);
      refreshData();
      setDrawerOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <RightDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        title={drawerMode === 'user' ? 'Security & Access Profile' : 'Store Advanced Configuration'}
      >
        {drawerMode === 'user' && selectedUser && (
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-3xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shadow-2xl">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`} alt="avatar" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white tracking-tight">{selectedUser.fullName}</h3>
                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1">ID: {selectedUser.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Auth Status</p>
                  <div className="flex items-center gap-2">
                     <div className={`w-1.5 h-1.5 rounded-full ${selectedUser.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                     <p className="text-sm font-bold text-white capitalize">{selectedUser.status}</p>
                  </div>
               </div>
               <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Verification</p>
                  <p className={`text-sm font-bold ${selectedUser.isVerified ? 'text-emerald-400' : 'text-amber-500'}`}>{selectedUser.isVerified ? 'VERIFIED' : 'PENDING'}</p>
               </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Active Session Tracking</h4>
              <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-4">
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Last Access IP</span>
                    <span className="text-white font-mono">{selectedUser.lastIp || '182.1.22.XX'}</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Device Hash</span>
                    <span className="text-white truncate max-w-[150px]">{selectedUser.device || 'Windows NT 10.0; Chrome'}</span>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">
               <button onClick={() => handleImpersonate(selectedUser.id)} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase text-xs tracking-widest">
                  Impersonate Dashboard
               </button>
               <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest">Reset Pass</button>
                  <button className="flex-1 py-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all">Ban User</button>
               </div>
            </div>
          </div>
        )}

        {drawerMode === 'store' && selectedStore && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
             <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl text-center">
                <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <ICONS.Store className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-black text-white">{selectedStore.name}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Store ID: {selectedStore.id}</p>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Administrative Overrides</h4>
                <div className="grid grid-cols-1 gap-2">
                   <button 
                     onClick={() => handleTransferOwnership(selectedStore.id)}
                     className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-indigo-500 transition-all group"
                   >
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">Transfer Ownership</p>
                        <p className="text-[9px] text-slate-500">Assign this store to a different account</p>
                      </div>
                      <svg className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                   </button>

                   <button 
                     onClick={() => handleLimitOverride(selectedStore.id)}
                     className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-indigo-500 transition-all group"
                   >
                      <div className="text-left">
                        <p className="text-xs font-bold text-white">Manual Limit Bypass</p>
                        <p className="text-[9px] text-slate-500">Override subscription tier limits</p>
                      </div>
                      <svg className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   </button>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black text-rose-500/60 uppercase tracking-[0.2em]">Danger Zone</h4>
                <div className="p-4 bg-rose-600/5 border border-rose-500/20 rounded-2xl">
                   <p className="text-[10px] text-rose-400 font-bold mb-3 italic">Actions below are permanent and cannot be undone.</p>
                   <button 
                     onClick={() => handleDataReset(selectedStore.id)}
                     className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-rose-600/10"
                   >
                      Nuke & Reset Store Data
                   </button>
                </div>
             </div>
          </div>
        )}
      </RightDrawer>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Platform Command Center</p>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">System HQ</h1>
        </div>

        <div className="glass-panel p-1 rounded-2xl flex flex-wrap gap-1 shadow-2xl border-slate-800">
          {(['overview', 'users', 'roles', 'plans', 'stores', 'transactions', 'billing', 'moderation', 'curation', 'support', 'communication', 'analytics', 'security', 'devtools', 'powers', 'logs', 'settings'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
            >
              {tab === 'settings' ? 'God Mode' : tab === 'devtools' ? 'DevTools' : tab === 'powers' ? 'God Powers' : tab.replace('_', ' ')}
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

      {activeTab === 'users' && (
        <UserDirectory 
          users={users} 
          onRefresh={refreshData} 
          onOpenDetails={openUserDetails}
        />
      )}

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
      
      {activeTab === 'stores' && (
        <StoreManagement 
          stores={stores}
          onToggleStatus={(id, cur) => {
            const newStatus = cur === 'active' ? 'suspended' : 'active';
            StoreService.updateStoreStatus(id, newStatus);
            refreshData();
          }}
          onViolation={(sid) => {
            StoreService.addViolation(sid);
            refreshData();
          }}
          onOpenConfig={openStoreConfig}
        />
      )}

      {activeTab === 'billing' && (
        <BillingEngine 
          plans={plans}
          revConfig={revConfig}
          onUpdateRevConfig={(config) => {
            setRevConfig(config);
            BillingService.updateRevenueConfig(config);
          }}
        />
      )}

      {activeTab === 'logs' && <ActivityLogs />}
      {activeTab === 'settings' && <SystemConfig />}
    </div>
  );
};

export default SuperAdminDashboard;
