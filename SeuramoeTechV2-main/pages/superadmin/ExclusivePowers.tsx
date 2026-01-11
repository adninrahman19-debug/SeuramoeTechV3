
import React, { useState, useEffect } from 'react';
import AuthService from '../../auth/AuthService';
import BillingService from '../../services/BillingService';
import TransactionService from '../../services/TransactionService';
import ConfigService from '../../services/ConfigService';
import SecurityService from '../../services/SecurityService';
import { User, UserRole, SubscriptionTier, Transaction, AuditCategory } from '../../types';
import { ICONS } from '../../constants';

const ExclusivePowers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePower, setActivePower] = useState<'impersonate' | 'subscription' | 'finance' | 'system'>('impersonate');

  useEffect(() => {
    setUsers(AuthService.getAllUsers());
    setTransactions(TransactionService.getAll());
  }, []);

  const handleImpersonate = (userId: string) => {
    if (confirm("Confirm system impersonation? This will log you into this user's perspective.")) {
      AuthService.impersonate(userId);
    }
  };

  const handleSubOverride = (userId: string) => {
    const tier = prompt("Enter Tier (BASIC, PRO, ENTERPRISE, CUSTOM):") as SubscriptionTier;
    if (tier && Object.values(SubscriptionTier).includes(tier)) {
      BillingService.forceOverrideSubscription(userId, tier);
      setUsers(AuthService.getAllUsers());
      SecurityService.addLog({
        userId: 'superadmin', userName: 'System Overlord', action: 'Subscription Override',
        category: AuditCategory.FINANCIAL, details: `Manually set user ${userId} to ${tier}`,
        ip: '127.0.0.1', severity: 'CRITICAL'
      });
      alert("Subscription tier successfully overridden.");
    }
  };

  const handleFinancialCorrection = (txId: string) => {
    const newAmount = prompt("Enter Corrected Amount (IDR):");
    if (newAmount) {
      TransactionService.editRecord(txId, { amount: parseInt(newAmount) });
      setTransactions(TransactionService.getAll());
      SecurityService.addLog({
        userId: 'superadmin', userName: 'System Overlord', action: 'Financial Record Edited',
        category: AuditCategory.FINANCIAL, details: `Corrected TX ${txId} amount to ${newAmount}`,
        ip: '127.0.0.1', severity: 'CRITICAL'
      });
      alert("Ledger corrected.");
    }
  };

  const handleEmergencyShutdown = () => {
    const code = prompt("Enter Authorization Code to SHUTDOWN platform (Type 'TERMINATE'):");
    if (code === 'TERMINATE') {
      const config = ConfigService.getPlatformConfig();
      ConfigService.updatePlatformConfig({
        ...config,
        maintenance: { ...config.maintenance, isEnabled: true, message: 'CRITICAL SYSTEM SHUTDOWN INITIATED BY HQ.' }
      });
      alert("Platform has been taken OFFLINE.");
    }
  };

  const handleRawDataExport = () => {
    const data = {
      users: AuthService.getAllUsers(),
      transactions: TransactionService.getAll(),
      audit: SecurityService.getLogs(),
      config: ConfigService.getPlatformConfig()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seuramoetech-full-dump-${Date.now()}.json`;
    a.click();
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-rose-500 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white text-xs">☠</div>
            Super Admin Exclusive Powers
          </h2>
          <p className="text-sm text-slate-500">Unrestricted God Mode controls for platform governance.</p>
        </div>
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
           {(['impersonate', 'subscription', 'finance', 'system'] as const).map(t => (
             <button
               key={t}
               onClick={() => setActivePower(t)}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePower === t ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-slate-500 hover:text-white'}`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl border-rose-500/20 bg-rose-600/5">
        {activePower === 'impersonate' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Ghost Mode: Impersonate any user</h3>
              <input 
                type="text" 
                placeholder="Search user to control..." 
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white w-64 outline-none focus:ring-2 focus:ring-rose-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.filter(u => u.role !== UserRole.SUPER_ADMIN).slice(0, 12).map(u => (
                <div key={u.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-rose-500 transition-all">
                  <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="w-10 h-10 rounded-xl bg-slate-800" alt="" />
                    <div>
                      <p className="text-xs font-bold text-white">{u.fullName}</p>
                      <p className="text-[9px] text-slate-500 uppercase">{u.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleImpersonate(u.id)}
                    className="p-2 bg-rose-600/10 text-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePower === 'subscription' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Manual Subscription Override</h3>
            <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-900 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Store Owner</th>
                        <th className="px-6 py-4">Current Tier</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Force Power</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                     {users.filter(u => u.role === UserRole.STORE_OWNER).map(u => (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition-all">
                           <td className="px-6 py-4">
                              <p className="text-xs font-bold text-white">{u.fullName}</p>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{u.subscriptionTier || 'TRIAL'}</span>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-[10px] text-emerald-400 font-bold uppercase">{u.subscriptionStatus || 'ACTIVE'}</span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button onClick={() => handleSubOverride(u.id)} className="text-[10px] font-black uppercase text-rose-500 hover:text-white px-3 py-1 bg-rose-600/10 rounded-lg border border-rose-500/20 hover:bg-rose-600">OVERRIDE</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activePower === 'finance' && (
          <div className="space-y-6">
             <h3 className="text-lg font-bold text-white">Financial Record Manipulation</h3>
             <div className="grid grid-cols-1 gap-3">
                {transactions.slice(0, 8).map(tx => (
                   <div key={tx.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-amber-500 transition-all">
                      <div className="flex items-center gap-6">
                         <span className="text-xs font-mono text-slate-500">{tx.id}</span>
                         <div>
                            <p className="text-xs font-bold text-white">{tx.userName}</p>
                            <p className="text-[9px] text-slate-500 truncate max-w-[200px]">{tx.description}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <p className="text-sm font-black text-emerald-400">Rp {tx.amount.toLocaleString()}</p>
                         <button 
                           onClick={() => handleFinancialCorrection(tx.id)}
                           className="px-4 py-2 bg-amber-600/10 text-amber-500 text-[10px] font-black uppercase rounded-xl hover:bg-amber-600 hover:text-white transition-all border border-amber-500/20"
                         >
                            Edit Value
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activePower === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-6">
                <h3 className="text-lg font-bold text-white">System Termination Tools</h3>
                <div className="p-6 bg-rose-600 border border-rose-400 rounded-3xl text-white shadow-2xl shadow-rose-600/40">
                   <h4 className="text-2xl font-black mb-2 uppercase tracking-tighter">Emergency RED Button</h4>
                   <p className="text-xs opacity-80 mb-6">Instantly force the entire platform into Maintenance mode. Only you will be able to log in to revert this.</p>
                   <button 
                     onClick={handleEmergencyShutdown}
                     className="w-full py-4 bg-white text-rose-600 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-white/10"
                   >
                      SHUTDOWN PLATFORM NOW
                   </button>
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-lg font-bold text-white">Hidden Data Access</h3>
                <div className="space-y-3">
                   <button 
                     onClick={handleRawDataExport}
                     className="w-full p-6 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between hover:border-indigo-500 transition-all group"
                   >
                      <div className="text-left">
                         <p className="text-sm font-bold text-white">Full Ecosystem Raw Dump</p>
                         <p className="text-[10px] text-slate-500">Export every user, store, and config as JSON</p>
                      </div>
                      <svg className="w-6 h-6 text-slate-700 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   </button>

                   <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl">
                      <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Granular Feature Toggles</h4>
                      <div className="space-y-3">
                         {[
                           { id: 'f-1', label: 'Payment Gateway Auto-Routing', active: true },
                           { id: 'f-2', label: 'Store Owner Self-Registration', active: true },
                           { id: 'f-3', label: 'Sumatra Regional Edge Caching', active: false },
                         ].map(f => (
                           <div key={f.id} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl">
                              <span className="text-[10px] font-bold text-slate-300">{f.label}</span>
                              <div className={`w-8 h-4 rounded-full relative cursor-pointer ${f.active ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                 <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${f.active ? 'right-0.5' : 'left-0.5'}`}></div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex gap-4 items-center animate-pulse">
         <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
         </div>
         <div>
            <p className="text-xs font-black text-white uppercase tracking-widest">UNRESTRICTED ACCESS WARNING</p>
            <p className="text-[10px] text-slate-400">Actions on this page bypass all standard application logic and subscription enforcement. Traceable logs are generated for forensic review.</p>
         </div>
      </div>
    </div>
  );
};

export default ExclusivePowers;
