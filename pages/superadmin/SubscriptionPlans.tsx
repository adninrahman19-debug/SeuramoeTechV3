
import React, { useState } from 'react';
import { SubscriptionPlan, SubscriptionTier } from '../../types';
import BillingService from '../../services/BillingService';
import { ICONS } from '../../constants';

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(BillingService.getPlans());
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<SubscriptionPlan> | null>(null);

  const handleEdit = (plan: SubscriptionPlan) => {
    setCurrentPlan(plan);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentPlan({
      name: '',
      tier: SubscriptionTier.BASIC,
      priceMonthly: 0,
      priceYearly: 0,
      limits: { stores: 1, staff: 1, products: 10, tickets: 10 },
      features: { branding: false, advancedAnalytics: false, reportingDepth: 'daily' },
      description: ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (currentPlan) {
      BillingService.savePlan(currentPlan as SubscriptionPlan);
      setPlans(BillingService.getPlans());
      setIsEditing(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this plan? Existing users won't be affected but new signups will be blocked.")) {
      BillingService.deletePlan(id);
      setPlans(BillingService.getPlans());
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white">Subscription Tiers</h2>
          <p className="text-sm text-slate-500">Define price points and feature limits for the platform.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
        >
          <ICONS.Plus className="w-4 h-4" /> Create New Tier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="glass-panel p-8 rounded-3xl border-slate-800 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                   <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                   <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded">{plan.tier}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleEdit(plan)} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg"><ICONS.Settings className="w-4 h-4" /></button>
                   <button onClick={() => handleDelete(plan.id)} className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
             </div>

             <div className="mb-8">
                <div className="flex items-baseline gap-1">
                   <span className="text-3xl font-black text-white">Rp {(plan.priceMonthly/1000).toFixed(0)}k</span>
                   <span className="text-slate-500 text-xs font-bold uppercase">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">{plan.description}</p>
             </div>

             <div className="space-y-4 pt-6 border-t border-slate-800/50">
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500 font-bold uppercase">Store Capacity</span>
                   <span className="text-white font-black">{plan.limits.stores} Locations</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500 font-bold uppercase">Staff Quota</span>
                   <span className="text-white font-black">{plan.limits.staff} Accounts</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500 font-bold uppercase">Inventory Cap</span>
                   <span className="text-white font-black">{plan.limits.products} Products</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500 font-bold uppercase">Service Desk</span>
                   <span className="text-white font-black">{plan.limits.tickets} / month</span>
                </div>
             </div>

             <div className="mt-8 grid grid-cols-2 gap-2">
                <div className={`p-3 rounded-2xl border ${plan.features.branding ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-slate-800 bg-slate-900/50'}`}>
                   <p className="text-[9px] font-black uppercase text-slate-500">Branding</p>
                   <p className={`text-[10px] font-bold mt-1 ${plan.features.branding ? 'text-indigo-400' : 'text-slate-600'}`}>{plan.features.branding ? 'ENABLED' : 'LOCKED'}</p>
                </div>
                <div className={`p-3 rounded-2xl border border-slate-800 bg-slate-900/50`}>
                   <p className="text-[9px] font-black uppercase text-slate-500">Reports</p>
                   <p className="text-[10px] font-bold text-white mt-1 uppercase">{plan.features.reportingDepth}</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      {isEditing && currentPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
           <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-white">Tier Configuration Manager</h3>
                 <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Name</label>
                       <input 
                         type="text" 
                         className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                         value={currentPlan.name} 
                         onChange={e => setCurrentPlan({...currentPlan, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Tier</label>
                       <select 
                         className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                         value={currentPlan.tier}
                         onChange={e => setCurrentPlan({...currentPlan, tier: e.target.value as SubscriptionTier})}
                       >
                          {Object.values(SubscriptionTier).map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly Price (IDR)</label>
                       <input 
                         type="number" 
                         className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white outline-none" 
                         value={currentPlan.priceMonthly} 
                         onChange={e => setCurrentPlan({...currentPlan, priceMonthly: parseInt(e.target.value)})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Yearly Price (IDR)</label>
                       <input 
                         type="number" 
                         className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white outline-none" 
                         value={currentPlan.priceYearly} 
                         onChange={e => setCurrentPlan({...currentPlan, priceYearly: parseInt(e.target.value)})}
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest border-b border-slate-800 pb-2">Usage Limits</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {Object.keys(currentPlan.limits!).map(key => (
                         <div key={key} className="space-y-1">
                            <label className="text-[8px] font-black text-slate-500 uppercase">{key}</label>
                            <input 
                              type="number" 
                              className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-lg text-white text-xs" 
                              value={(currentPlan.limits as any)[key]} 
                              onChange={e => setCurrentPlan({...currentPlan, limits: {...currentPlan.limits!, [key]: parseInt(e.target.value)}})}
                            />
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest border-b border-slate-800 pb-2">Feature Matrix</h4>
                    <div className="flex flex-wrap gap-4">
                       <label className="flex items-center gap-3 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-indigo-600" 
                            checked={currentPlan.features?.branding} 
                            onChange={e => setCurrentPlan({...currentPlan, features: {...currentPlan.features!, branding: e.target.checked}})}
                          />
                          <span className="text-xs font-bold text-white">White-label Branding</span>
                       </label>
                       <label className="flex items-center gap-3 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-indigo-600" 
                            checked={currentPlan.features?.advancedAnalytics} 
                            onChange={e => setCurrentPlan({...currentPlan, features: {...currentPlan.features!, advancedAnalytics: e.target.checked}})}
                          />
                          <span className="text-xs font-bold text-white">Advanced Analytics</span>
                       </label>
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
                 <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Discard Changes</button>
                 <button onClick={handleSave} className="px-8 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Commit Tier</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
