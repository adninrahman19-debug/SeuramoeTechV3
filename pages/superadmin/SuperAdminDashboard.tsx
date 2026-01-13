
import React, { useState, useEffect } from 'react';
import AuthService from '../../auth/AuthService';
import StoreService from '../../services/StoreService';
import BillingService from '../../services/BillingService';
import { User, UserRole, Store, SubscriptionPlan, RevenueConfig, SubscriptionTier } from '../../types';
import { ICONS } from '../../constants';

// Modular Components
import Overview from './Overview';
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
import NotificationHub from '../../components/Shared/NotificationHub';
import RightDrawer from '../../components/Shared/RightDrawer';

interface SuperAdminDashboardProps {
  activeTab: 'overview' | 'users' | 'roles' | 'plans' | 'stores' | 'transactions' | 'billing' | 'moderation' | 'curation' | 'support' | 'communication' | 'analytics' | 'security' | 'devtools' | 'powers' | 'logs' | 'settings' | 'notifications';
  onTabChange: (tab: any) => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ activeTab, onTabChange }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [revConfig, setRevConfig] = useState<RevenueConfig | null>(null);
  
  // Drawer States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'user_edit' | 'user_add' | 'store_edit' | 'store_add'>('user_edit');
  const [selectedUser, setSelectedUser] = useState<Partial<User>>({});
  const [selectedStore, setSelectedStore] = useState<Partial<Store>>({});

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

  const handleSaveUser = () => {
    if (!selectedUser.fullName || !selectedUser.username || !selectedUser.email) {
      alert("Harap lengkapi semua field wajib.");
      return;
    }
    if (drawerMode === 'user_add') {
      AuthService.register(selectedUser as any);
      alert("Pengguna baru berhasil didaftarkan.");
    } else {
      AuthService.updateUserStatus(selectedUser.id!, selectedUser.status!);
      alert("Profil pengguna diperbarui.");
    }
    setDrawerOpen(false);
    refreshData();
  };

  const handleSaveStore = () => {
    if (!selectedStore.name || !selectedStore.location) {
      alert("Harap lengkapi nama toko dan lokasi.");
      return;
    }
    if (drawerMode === 'store_add') {
      StoreService.addStore(selectedStore as any);
      alert("Node Toko baru berhasil diregistrasi.");
    } else {
      StoreService.updateStore(selectedStore.id!, selectedStore);
      alert("Konfigurasi Node diperbarui.");
    }
    setDrawerOpen(false);
    refreshData();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <RightDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        title={
          drawerMode.includes('user') ? (drawerMode.includes('add') ? 'Tambah Pengguna Baru' : 'Manajemen Akses User') :
          (drawerMode.includes('add') ? 'Registrasi Node Toko' : 'Konfigurasi Toko')
        }
      >
        {drawerMode.includes('user') ? (
          <div className="space-y-6">
            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={selectedUser.fullName || ''} placeholder="Contoh: Teuku Abdullah" onChange={e => setSelectedUser({...selectedUser, fullName: e.target.value})} />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Username</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={selectedUser.username || ''} placeholder="owner_baru" onChange={e => setSelectedUser({...selectedUser, username: e.target.value})} />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={selectedUser.email || ''} placeholder="email@example.com" onChange={e => setSelectedUser({...selectedUser, email: e.target.value})} />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Peran Sistem</label>
                  <select className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white appearance-none" value={selectedUser.role || UserRole.CUSTOMER} onChange={e => setSelectedUser({...selectedUser, role: e.target.value as UserRole})}>
                    {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status Platform</label>
                  <select className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white appearance-none" value={selectedUser.status || 'active'} onChange={e => setSelectedUser({...selectedUser, status: e.target.value as any})}>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
               </div>
            </div>
            <button onClick={handleSaveUser} className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs rounded-2xl hover:bg-indigo-500 transition-all shadow-xl">Simpan Data Pengguna</button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Toko Node</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={selectedStore.name || ''} placeholder="Aceh Jaya Tech" onChange={e => setSelectedStore({...selectedStore, name: e.target.value})} />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lokasi Regional</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={selectedStore.location || ''} placeholder="Calang, Aceh Jaya" onChange={e => setSelectedStore({...selectedStore, location: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Limit Produk</label>
                     <input type="number" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white" value={selectedStore.productLimit || 0} onChange={e => setSelectedStore({...selectedStore, productLimit: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Limit Staf</label>
                     <input type="number" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white" value={selectedStore.staffLimit || 0} onChange={e => setSelectedStore({...selectedStore, staffLimit: parseInt(e.target.value)})} />
                  </div>
               </div>
            </div>
            <button onClick={handleSaveStore} className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs rounded-2xl hover:bg-indigo-500 transition-all shadow-xl">Update Konfigurasi Node</button>
          </div>
        )}
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
          {(['overview', 'users', 'roles', 'plans', 'stores', 'transactions', 'billing', 'moderation', 'curation', 'support', 'communication', 'analytics', 'security', 'devtools', 'powers', 'logs', 'settings', 'notifications'] as const).map(tab => (
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
               tab === 'security' ? 'Keamanan' :
               tab === 'devtools' ? 'Alat Dev' :
               tab === 'powers' ? 'God Mode' :
               tab === 'logs' ? 'Log' :
               tab === 'settings' ? 'HQ' : 
               tab === 'notifications' ? 'Notif Hub' : tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && <Overview owners={owners} stores={stores} pendingApprovals={pendingApprovals} totalMRR={128400000} revenueConfig={revConfig} onApprove={(id) => { if(confirm("Setujui akun Owner ini?")) { AuthService.updateUserStatus(id, 'active'); refreshData(); } }} />}
      {activeTab === 'users' && <UserDirectory users={users} onRefresh={refreshData} onOpenDetails={(u) => { setSelectedUser({...u}); setDrawerMode('user_edit'); setDrawerOpen(true); }} onAddUser={() => { setSelectedUser({role: UserRole.CUSTOMER, status: 'active'}); setDrawerMode('user_add'); setDrawerOpen(true); }} />}
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
      {activeTab === 'notifications' && <NotificationHub onNavigate={onTabChange} />}
      {activeTab === 'stores' && <StoreManagement stores={stores} onToggleStatus={(id, st) => { StoreService.updateStoreStatus(id, st === 'active' ? 'suspended' : 'active'); refreshData(); }} onViolation={(id) => { StoreService.addViolation(id); refreshData(); }} onOpenConfig={(s) => { setSelectedStore({...s}); setDrawerMode('store_edit'); setDrawerOpen(true); }} onAddStore={() => { setSelectedStore({status: 'active', productLimit: 100, staffLimit: 5}); setDrawerMode('store_add'); setDrawerOpen(true); }} />}
      {activeTab === 'billing' && <BillingEngine plans={plans} revConfig={revConfig} onUpdateRevConfig={(c) => { BillingService.updateRevenueConfig(c); refreshData(); }} />}
      {activeTab === 'logs' && <ActivityLogs />}
      {activeTab === 'settings' && <SystemConfig />}
    </div>
  );
};

export default SuperAdminDashboard;
