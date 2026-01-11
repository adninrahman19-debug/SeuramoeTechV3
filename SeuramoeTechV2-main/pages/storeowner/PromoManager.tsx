
import React, { useState, useEffect } from 'react';
import PromoService from '../../services/PromoService';
import { Promo, PromoType, PromoStatus, Coupon } from '../../types';
import { ICONS } from '../../constants';
import RightDrawer from '../../components/Shared/RightDrawer';

const PromoManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discounts' | 'vouchers'>('discounts');
  const [promos, setPromos] = useState<Promo[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<Promo>>({
    type: PromoType.PERCENTAGE,
    status: PromoStatus.ACTIVE,
    currentUsage: 0,
    storeId: 's1'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPromos(PromoService.getPromos('s1'));
    setCoupons(PromoService.getCoupons('s1'));
  };

  const handleCreatePromo = () => {
    if (newPromo.title && newPromo.value) {
      PromoService.addPromo(newPromo as Promo);
      setIsDrawerOpen(false);
      loadData();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <RightDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title="Create Campaign Strategy"
      >
        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strategy Name</label>
              <input 
                type="text" 
                placeholder="e.g. Flash Weekend"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                value={newPromo.title || ''}
                onChange={e => setNewPromo({...newPromo, title: e.target.value})}
              />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Promo Type</label>
                 <select 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white appearance-none"
                    value={newPromo.type}
                    onChange={e => setNewPromo({...newPromo, type: e.target.value as PromoType})}
                 >
                    <option value={PromoType.PERCENTAGE}>Percentage (%)</option>
                    <option value={PromoType.NOMINAL}>Nominal (IDR)</option>
                    <option value={PromoType.FLASH_SALE}>Flash Sale</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Value</label>
                 <input 
                   type="number" 
                   className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                   value={newPromo.value || ''}
                   onChange={e => setNewPromo({...newPromo, value: parseInt(e.target.value)})}
                 />
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Start Date</label>
                 <input 
                   type="date" 
                   className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                   onChange={e => setNewPromo({...newPromo, startDate: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">End Date</label>
                 <input 
                   type="date" 
                   className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                   onChange={e => setNewPromo({...newPromo, endDate: e.target.value})}
                 />
              </div>
           </div>
           <button 
             onClick={handleCreatePromo}
             className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
           >
             Launch Campaign
           </button>
        </div>
      </RightDrawer>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
           {(['discounts', 'vouchers'] as const).map(t => (
             <button
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
             >
               {t}
             </button>
           ))}
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
        >
           <ICONS.Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      {activeTab === 'discounts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {promos.map(promo => (
             <div key={promo.id} className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-6">
                   <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                     promo.status === PromoStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                     promo.status === PromoStatus.SCHEDULED ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                     'bg-slate-800 text-slate-500 border border-slate-700'
                   }`}>
                     {promo.status}
                   </span>
                   <div className="p-2 bg-slate-900 rounded-xl text-indigo-400"><ICONS.Ticket className="w-5 h-5" /></div>
                </div>

                <div className="flex-1 space-y-2 mb-8">
                   <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{promo.title}</h3>
                   <p className="text-sm font-black text-indigo-400">
                      {promo.type === PromoType.PERCENTAGE ? `${promo.value}% OFF` : 
                       promo.type === PromoType.FLASH_SALE ? `FLASH: Rp ${promo.value.toLocaleString()} OFF` : 
                       `Rp ${promo.value.toLocaleString()} Discount`}
                   </p>
                   <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase mt-4">
                      <span>{promo.startDate}</span>
                      <span>—</span>
                      <span>{promo.endDate}</span>
                   </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-800/50">
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-bold uppercase tracking-widest">Usage Quota</span>
                      <span className="text-white font-black">{promo.currentUsage} / {promo.usageLimit || '∞'}</span>
                   </div>
                   <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(promo.currentUsage / (promo.usageLimit || 100)) * 100}%` }}></div>
                   </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="py-2.5 bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-all">Edit Scope</button>
                   <button className="py-2.5 bg-rose-600/10 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white transition-all">Terminate</button>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                    <th className="px-6 py-5">Voucher Code</th>
                    <th className="px-6 py-5">Discount Config</th>
                    <th className="px-6 py-5">Usage & Limits</th>
                    <th className="px-6 py-5">Expiry</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                 {coupons.map(coupon => (
                    <tr key={coupon.id} className="hover:bg-slate-800/20 group transition-all">
                       <td className="px-6 py-4">
                          <div className="bg-indigo-600/10 border border-indigo-500/20 px-3 py-1 rounded-lg w-fit text-sm font-black text-indigo-400 font-mono">
                             {coupon.code}
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-sm font-black text-white">{coupon.discountValue}{coupon.discountType === 'PERCENT' ? '%' : ' IDR'}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Min. Purchase: Rp {coupon.minPurchase.toLocaleString()}</p>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="text-xs font-bold text-slate-300">{coupon.usedCount} / {coupon.maxUsage}</div>
                             <div className="w-16 bg-slate-950 h-1 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${(coupon.usedCount / coupon.maxUsage) * 100}%` }}></div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-widest">{coupon.expiryDate}</td>
                       <td className="px-6 py-4 text-right">
                          <button className="p-2 bg-slate-800 text-slate-500 hover:text-white rounded-lg"><ICONS.Settings className="w-4 h-4" /></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default PromoManager;
