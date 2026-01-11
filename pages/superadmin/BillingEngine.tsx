
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { SubscriptionPlan, RevenueConfig, Invoice, SubscriptionStatus } from '../../types';
import BillingService from '../../services/BillingService';
import AuthService from '../../auth/AuthService';

interface BillingEngineProps {
  plans: SubscriptionPlan[];
  revConfig: RevenueConfig | null;
  onUpdateRevConfig: (config: RevenueConfig) => void;
}

const BillingEngine: React.FC<BillingEngineProps> = ({ plans, revConfig, onUpdateRevConfig }) => {
  const [invoices] = useState<Invoice[]>(BillingService.getInvoices());
  const [activeTab, setActiveTab] = useState<'revenue' | 'lifecycle' | 'invoices'>('revenue');

  const handleStatusChange = (userId: string, status: SubscriptionStatus) => {
    AuthService.updateUserStatus(userId, status === SubscriptionStatus.ACTIVE ? 'active' : 'suspended');
    alert(`Status langganan pengguna diubah menjadi: ${status}`);
  };

  const handleGenerateMockInvoice = () => {
    const randomPlan = plans[Math.floor(Math.random() * plans.length)];
    BillingService.generateInvoice('u2', randomPlan);
    alert("Simulated invoice generated for Teuku Abdullah!");
    window.location.reload();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        {(['revenue', 'lifecycle', 'invoices'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-xl">
               <h3 className="text-xl font-bold text-white mb-8">Financial & Split Configuration</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Commission (%)</label>
                        <span className="text-2xl font-black text-indigo-400">{revConfig?.platformCommission}%</span>
                     </div>
                     <input 
                       type="range" 
                       className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                       value={revConfig?.platformCommission} 
                       onChange={e => revConfig && onUpdateRevConfig({...revConfig, platformCommission: parseInt(e.target.value)})} 
                     />
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Referral Split (%)</label>
                        <span className="text-2xl font-black text-emerald-400">{revConfig?.revenueSplit?.referral || 0}%</span>
                     </div>
                     <input 
                       type="range" 
                       className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                       value={revConfig?.revenueSplit?.referral || 0} 
                       onChange={e => revConfig && onUpdateRevConfig({...revConfig, revenueSplit: {...revConfig.revenueSplit, referral: parseInt(e.target.value)}})} 
                     />
                  </div>
               </div>
               <div className="mt-10 p-6 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                     <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl"><ICONS.Ticket className="w-5 h-5" /></div>
                     <div>
                        <p className="text-xs font-bold text-white">VAT/PPN Rule Engine</p>
                        <p className="text-[10px] text-slate-500">Global tax rate applied to all generated invoices.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <input 
                        type="number" 
                        className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white font-black w-24 outline-none focus:ring-2 focus:ring-indigo-500" 
                        value={revConfig?.taxRate} 
                        onChange={e => revConfig && onUpdateRevConfig({...revConfig, taxRate: parseInt(e.target.value)})} 
                     />
                     <span className="text-xs font-black text-slate-500">%</span>
                  </div>
               </div>
               <button className="mt-8 px-8 py-3 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all">Apply Financial Changes</button>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-slate-800">
               <h3 className="text-lg font-bold text-white mb-6">Payment Gateway Mapping</h3>
               <div className="space-y-4">
                  {[
                    { name: 'Midtrans Aceh', region: 'North Sumatra', status: 'active', lag: '24ms' },
                    { name: 'Xendit Sumatra', region: 'West Sumatra', status: 'active', lag: '42ms' },
                    { name: 'Direct Bank Aceh', region: 'Lokal', status: 'paused', lag: '-' },
                  ].map(gw => (
                    <div key={gw.name} className="flex items-center justify-between p-5 bg-slate-900 border border-slate-800 rounded-2xl group hover:border-indigo-500/30 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${gw.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-700'}`}></div>
                          <div>
                             <p className="text-sm font-bold text-white">{gw.name}</p>
                             <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{gw.region}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-white">{gw.lag}</p>
                          <p className="text-[9px] text-indigo-500 font-black uppercase">Latency</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="glass-panel p-8 rounded-3xl border-slate-800 bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Net Platform MRR</p>
                <h4 className="text-4xl font-black mb-1">Rp 128.4M</h4>
                <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                   <div className="flex justify-between text-[10px]">
                      <span className="opacity-60">Platform Share ({(100 - (revConfig?.revenueSplit?.referral || 0))}%)</span>
                      <span className="font-bold">Rp 115.6M</span>
                   </div>
                   <div className="flex justify-between text-[10px]">
                      <span className="opacity-60">Referral/Partner Share ({revConfig?.revenueSplit?.referral || 0}%)</span>
                      <span className="font-bold text-emerald-300">Rp {((revConfig?.revenueSplit?.referral || 0) / 100 * 128.4).toFixed(1)}M</span>
                   </div>
                </div>
                <button className="mt-8 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                   Export Financial Audit
                </button>
             </div>

             <div className="glass-panel p-8 rounded-3xl border-slate-800">
                <h3 className="text-lg font-bold text-white mb-6">Tax Compliance</h3>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-black uppercase">Next Filing Date</span>
                      <span className="text-xs text-white font-bold">15 Nov 2023</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-black uppercase">Accumulated Tax</span>
                      <span className="text-xs text-rose-400 font-bold">Rp 14.12M</span>
                   </div>
                   <button className="w-full mt-2 py-2.5 bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl hover:bg-slate-700 transition-all">View Tax Logs</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'lifecycle' && (
        <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
           <div className="p-6 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Subscription Lifecycle Control</h3>
              <div className="flex gap-2">
                 <input type="text" placeholder="Filter by Owner..." className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-1.5 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                       <th className="px-6 py-5">Owner Identity</th>
                       <th className="px-6 py-5">Current Lifecycle</th>
                       <th className="px-6 py-5">Tier & Billing</th>
                       <th className="px-6 py-5 text-right">Lifecycle Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                    {AuthService.getAllUsers().filter(u => u.role === 'STORE_OWNER').map(owner => (
                       <tr key={owner.id} className="hover:bg-slate-800/20 group transition-all">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-4">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${owner.username}`} className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700" alt="" />
                                <div>
                                   <p className="text-sm font-bold text-white">{owner.fullName}</p>
                                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{owner.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                                owner.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                             }`}>
                                {owner.status}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="space-y-1">
                                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">{owner.subscriptionTier || 'NONE'}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase">Auto-renew: {owner.autoRenew ? 'ON' : 'OFF'}</p>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleStatusChange(owner.id, SubscriptionStatus.ACTIVE)}
                                  className="p-2 bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-lg" 
                                  title="Resume/Activate"
                                >
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </button>
                                <button 
                                  onClick={() => handleStatusChange(owner.id, SubscriptionStatus.PAUSED)}
                                  className="p-2 bg-slate-800 text-slate-400 hover:text-amber-400 rounded-lg" 
                                  title="Pause Subscription"
                                >
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </button>
                                <button 
                                  className="p-2 bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg" 
                                  title="Force Cancel"
                                >
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <div>
                 <h3 className="text-xl font-bold text-white">Financial Invoices</h3>
                 <p className="text-sm text-slate-500">System generated billing documents for all owners.</p>
              </div>
              <button 
                onClick={handleGenerateMockInvoice}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-600/20"
              >
                Simulate Invoice Gen
              </button>
           </div>

           <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                          <th className="px-6 py-5">Invoice ID</th>
                          <th className="px-6 py-5">Owner Name</th>
                          <th className="px-6 py-5">Amount (IDR)</th>
                          <th className="px-6 py-5">Billing Date</th>
                          <th className="px-6 py-5">Status</th>
                          <th className="px-6 py-5 text-right">Operations</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                       {invoices.map(inv => (
                          <tr key={inv.id} className="hover:bg-slate-800/20 group transition-all">
                             <td className="px-6 py-4 text-xs font-mono font-bold text-white">{inv.id}</td>
                             <td className="px-6 py-4">
                                <p className="text-sm font-bold text-white">{inv.userName}</p>
                                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{inv.planName}</p>
                             </td>
                             <td className="px-6 py-4 text-sm font-black text-indigo-400">Rp {inv.amount.toLocaleString()}</td>
                             <td className="px-6 py-4 text-xs font-medium text-slate-400">{inv.date}</td>
                             <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                }`}>
                                   {inv.status}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2} /></svg>
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BillingEngine;
