
import React, { useState, useEffect } from 'react';
import PromoService from '../../services/PromoService';
import InventoryService from '../../services/InventoryService';
import { StoreCampaign, Product } from '../../types';
import { ICONS } from '../../constants';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const MarketingHub: React.FC = () => {
  const [campaigns, setCampaigns] = useState<StoreCampaign[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setCampaigns(PromoService.getCampaigns('s1'));
    setProducts(InventoryService.getProducts('s1'));
  }, []);

  const featured = products.filter(p => p.isSponsored);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Banner Management */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white tracking-tight">Active Storefront Banners</h3>
              <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Optimize Layout</button>
           </div>
           
           <div className="grid grid-cols-1 gap-6">
              {campaigns.map(camp => (
                <div key={camp.id} className="glass-panel p-4 rounded-3xl border-slate-800 group hover:border-indigo-500/30 transition-all">
                   <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-slate-950 mb-6 border border-slate-800 relative shadow-2xl">
                      <img src={camp.bannerUrl} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[2000ms]" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6">
                         <p className="text-xl font-black text-white tracking-tight">{camp.name}</p>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded">Campaign v1</span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Now</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-4 mb-2">
                      <div className="text-center p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                         <p className="text-lg font-black text-white">{camp.ctr}%</p>
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">CTR Performance</p>
                      </div>
                      <div className="text-center p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                         <p className="text-lg font-black text-emerald-400">{camp.conversions}</p>
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Conversions</p>
                      </div>
                      <div className="text-center p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                         <p className="text-lg font-black text-white">Rp {(camp.revenueGenerated/1000000).toFixed(1)}M</p>
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Campaign Rev</p>
                      </div>
                   </div>
                </div>
              ))}
              
              <button className="w-full py-10 border-2 border-dashed border-slate-800 rounded-3xl text-slate-600 text-xs font-bold hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex flex-col items-center gap-3">
                 <div className="p-3 bg-slate-900 rounded-2xl"><ICONS.Plus className="w-6 h-6" /></div>
                 UPLOAD NEW PROMOTIONAL BANNER
              </button>
           </div>
        </div>

        {/* Featured Products Sidebar */}
        <div className="space-y-6">
           <h3 className="text-xl font-bold text-white tracking-tight">Featured Slots</h3>
           <div className="glass-panel p-6 rounded-3xl border-slate-800 bg-indigo-600/5">
              <p className="text-xs text-indigo-300 mb-6 leading-relaxed italic">Featured products appear at the top of your regional marketplace node and receive 4x more traffic.</p>
              
              <div className="space-y-3">
                 {featured.map(p => (
                   <div key={p.id} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <img src={p.thumbnail} className="w-10 h-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                         <p className="text-xs font-bold text-white truncate max-w-[120px]">{p.name}</p>
                      </div>
                      <button className="p-1.5 text-slate-500 hover:text-rose-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                   </div>
                 ))}
                 
                 {Array.from({ length: Math.max(0, 3 - featured.length) }).map((_, i) => (
                    <button key={i} className="w-full py-4 border border-dashed border-slate-800 rounded-2xl text-[9px] font-black text-slate-600 uppercase tracking-widest hover:border-indigo-500/50 hover:text-white transition-all">
                       Empty Feature Slot
                    </button>
                 ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-800">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Slot Utilization</h4>
                 <div className="h-24 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={[{ name: 'Used', val: featured.length }, { name: 'Free', val: 3 - featured.length }]}>
                          <Bar dataKey="val" fill="#6366f1" radius={[4, 4, 0, 0]} />
                          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ display: 'none' }} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           <div className="glass-panel p-6 rounded-3xl border-slate-800">
              <h4 className="text-sm font-bold text-white mb-4">Conversion Intelligence</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase">Store Health</span>
                    <span className="text-emerald-400 font-black">EXCELLENT</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold uppercase">Promo ROI</span>
                    <span className="text-white font-black">340%</span>
                 </div>
                 <button className="w-full py-3 bg-slate-900 border border-slate-800 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all mt-2">Download Global Insight</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingHub;
