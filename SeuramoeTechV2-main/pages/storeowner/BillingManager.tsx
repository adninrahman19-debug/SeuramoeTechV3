
import React, { useState, useEffect } from 'react';
import BillingService from '../../services/BillingService';
import AuthService from '../../auth/AuthService';
import { SubscriptionPlan, Invoice, SubscriptionTier } from '../../types';
import { ICONS } from '../../constants';
import StatCard from '../../components/Shared/StatCard';

const BillingManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'upgrade' | 'history'>('status');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    setPlans(BillingService.getPlans());
    if (user) {
      setInvoices(BillingService.getInvoicesForUser(user.id));
    }
  }, []);

  const currentPlan = plans.find(p => p.tier === user?.subscriptionTier) || plans[0];

  const handleToggleAutoRenew = () => {
    if (user) {
      BillingService.toggleAutoRenew(user.id);
      window.location.reload(); // Refresh to sync UI
    }
  };

  const handleUpgrade = (tier: SubscriptionTier) => {
    if (confirm(`Konfirmasi upgrade ke paket ${tier}? Tagihan akan diproses otomatis.`)) {
      BillingService.upgradePlan(user!.id, tier);
      alert("Upgrade berhasil! Selamat menikmati fitur baru.");
      window.location.reload();
    }
  };

  const downloadInvoice = (id: string) => {
    alert(`Menyiapkan unduhan Invoice ${id}...`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
           <button onClick={() => setActiveTab('status')} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'status' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>Status & Quota</button>
           <button onClick={() => setActiveTab('upgrade')} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'upgrade' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>Upgrade Plan</button>
           <button onClick={() => setActiveTab('history')} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>Billing History</button>
        </div>
        
        <div className="flex items-center gap-4 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Billing Node Sumatra-01: Operational</span>
        </div>
      </div>

      {activeTab === 'status' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="glass-panel p-8 rounded-3xl border-slate-800 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                       <div>
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Current Active Subscription</p>
                          <h2 className="text-4xl font-black text-white tracking-tight">{currentPlan?.name}</h2>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Expires On</p>
                          <p className="text-xl font-black text-white">{user?.subscriptionExpiry || '2024-12-31'}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                          <p className="text-[10px] font-black text-slate-500 uppercase mb-3">Time Remaining</p>
                          <p className="text-2xl font-black text-white">24 Days</p>
                          <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                             <div className="bg-indigo-500 h-full" style={{ width: '75%' }}></div>
                          </div>
                       </div>
                       <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                          <p className="text-[10px] font-black text-slate-500 uppercase mb-3">Auto-Renewal</p>
                          <div className="flex items-center justify-between">
                             <p className={`text-xl font-black ${user?.autoRenew ? 'text-emerald-400' : 'text-slate-500'}`}>{user?.autoRenew ? 'ENABLED' : 'DISABLED'}</p>
                             <button onClick={handleToggleAutoRenew} className={`w-10 h-5 rounded-full relative transition-all ${user?.autoRenew ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${user?.autoRenew ? 'right-1' : 'left-1'}`}></div>
                             </button>
                          </div>
                       </div>
                       <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                          <p className="text-[10px] font-black text-slate-500 uppercase mb-3">Billing Cycle</p>
                          <p className="text-xl font-black text-white">Monthly</p>
                          <p className="text-[10px] text-indigo-400 font-bold mt-2">Next: Rp 1.29M</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-slate-800">
                 <h3 className="text-xl font-bold text-white mb-8">Resource Quota Intelligence</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                             <span className="text-slate-500">Staff Accounts</span>
                             <span className="text-white">8 / {currentPlan?.limits.staff} used</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                             <div className="h-full bg-indigo-500" style={{ width: `${(8/currentPlan?.limits.staff)*100}%` }}></div>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                             <span className="text-slate-500">Inventory Items</span>
                             <span className="text-white">142 / {currentPlan?.limits.products} used</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                             <div className="h-full bg-indigo-500" style={{ width: `${(142/currentPlan?.limits.products)*100}%` }}></div>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                             <span className="text-slate-500">Monthly Service Tickets</span>
                             <span className="text-white">12 / {currentPlan?.limits.tickets} used</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                             <div className="h-full bg-emerald-500" style={{ width: `${(12/currentPlan?.limits.tickets)*100}%` }}></div>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                             <span className="text-slate-500">Regional Store Locations</span>
                             <span className="text-white">2 / {currentPlan?.limits.stores} used</span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                             <div className="h-full bg-indigo-500" style={{ width: `${(2/currentPlan?.limits.stores)*100}%` }}></div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="mt-8 p-4 bg-indigo-600/5 border border-indigo-500/20 rounded-2xl flex items-center gap-4">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-xs text-slate-400">Anda masih memiliki kapasitas yang cukup. Upgrade hanya diperlukan jika ingin menambah staff atau cabang toko baru.</p>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="glass-panel p-8 rounded-3xl border-slate-800 bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30">
                 <h4 className="text-lg font-black mb-4">Enterprise Grade Support</h4>
                 <p className="text-xs opacity-80 leading-relaxed mb-8">Dapatkan akses langsung ke account manager regional Anda untuk konsultasi teknis dan strategi pertumbuhan bisnis.</p>
                 <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Chat Account Manager</button>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-slate-800">
                 <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Payment Methods</h4>
                 <div className="space-y-3">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-indigo-500/50 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-6 bg-slate-800 rounded border border-slate-700 flex items-center justify-center font-bold text-[8px]">VISA</div>
                          <div>
                             <p className="text-xs font-bold text-white">•••• 8821</p>
                             <p className="text-[8px] text-slate-600 font-black uppercase">Primary</p>
                          </div>
                       </div>
                       <ICONS.Settings className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <button className="w-full py-3 border border-dashed border-slate-800 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:border-indigo-500/50 hover:text-white transition-all">+ Add New Method</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'upgrade' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {plans.map(plan => (
             <div key={plan.id} className={`glass-panel p-8 rounded-3xl border-2 flex flex-col transition-all duration-500 ${plan.tier === user?.subscriptionTier ? 'border-indigo-600 ring-4 ring-indigo-600/10' : 'border-slate-800 hover:border-slate-700'}`}>
                {plan.tier === user?.subscriptionTier && (
                  <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-full w-fit mb-4">Current Plan</span>
                )}
                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-500 mb-6">{plan.description}</p>
                
                <div className="mb-10">
                   <p className="text-3xl font-black text-white">Rp {(plan.priceMonthly/1000).toFixed(0)}k <span className="text-sm text-slate-600 font-bold">/ bln</span></p>
                </div>

                <div className="space-y-4 mb-12 flex-1">
                   <div className="flex items-center gap-3 text-xs text-slate-300">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      {plan.limits.stores} Lokasi Cabang
                   </div>
                   <div className="flex items-center gap-3 text-xs text-slate-300">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      {plan.limits.staff} Akun Staf
                   </div>
                   <div className="flex items-center gap-3 text-xs text-slate-300">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      {plan.limits.products === 99999 ? 'Unlimited' : plan.limits.products} Produk
                   </div>
                   <div className="flex items-center gap-3 text-xs text-slate-300">
                      <svg className={`w-4 h-4 ${plan.features.branding ? 'text-emerald-500' : 'text-slate-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={plan.features.branding ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} /></svg>
                      Custom Branding
                   </div>
                </div>

                <button 
                  disabled={plan.tier === user?.subscriptionTier}
                  onClick={() => handleUpgrade(plan.tier)}
                  className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    plan.tier === user?.subscriptionTier ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20'
                  }`}
                >
                  {plan.tier === user?.subscriptionTier ? 'Active' : 'Upgrade Now'}
                </button>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                    <th className="px-6 py-5">Invoice Reference</th>
                    <th className="px-6 py-5">Subscription Period</th>
                    <th className="px-6 py-5">Amount (IDR)</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                 {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-800/20 group transition-all">
                       <td className="px-6 py-4">
                          <p className="text-xs font-mono font-bold text-white group-hover:text-indigo-400 transition-colors">{inv.id}</p>
                          <p className="text-[9px] text-slate-600 uppercase font-black">Platform Fee Node</p>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-xs font-bold text-white">{inv.planName}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{inv.date}</p>
                       </td>
                       <td className="px-6 py-4 text-sm font-black text-white">
                          Rp {inv.amount.toLocaleString()}
                       </td>
                       <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded uppercase border border-emerald-500/20">Success</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button onClick={() => downloadInvoice(inv.id)} className="p-2.5 bg-slate-900 border border-slate-800 text-slate-500 group-hover:text-white rounded-xl transition-all hover:bg-indigo-600 hover:border-indigo-500">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          </button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           {invoices.length === 0 && <div className="p-20 text-center text-slate-600 italic">No billing records found in your regional storage.</div>}
        </div>
      )}
    </div>
  );
};

export default BillingManager;
