import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants.tsx';
import StatCard from '../../components/Shared/StatCard.tsx';
import PromoService from '../../services/PromoService.ts';
import InventoryService from '../../services/InventoryService.ts';
import { Promo, PromoStatus, Product } from '../../types.ts';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const MarketingOverview: React.FC = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [trafficData, setTrafficData] = useState<any[]>([]);

  useEffect(() => {
    // Mock storeId 's1'
    setPromos(PromoService.getPromos('s1'));
    setProducts(InventoryService.getProducts('s1'));
    
    // Mock traffic data for the last 7 days
    setTrafficData([
      { day: 'Mon', visitors: 120, conversion: 3.2 },
      { day: 'Tue', visitors: 150, conversion: 4.1 },
      { day: 'Wed', visitors: 110, conversion: 2.8 },
      { day: 'Thu', visitors: 180, conversion: 5.4 },
      { day: 'Fri', visitors: 210, conversion: 4.9 },
      { day: 'Sat', visitors: 320, conversion: 6.2 },
      { day: 'Sun', visitors: 280, conversion: 5.8 },
    ]);
  }, []);

  const activeCampaigns = promos.filter(p => p.status === PromoStatus.ACTIVE);
  const bestSellers = [...products].sort((a, b) => b.stock - a.stock).slice(0, 4); // Mock sorting by 'popularity' via stock logic for demo

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Kampanye Aktif" 
          value={activeCampaigns.length} 
          trend="+2 New" 
          icon={<ICONS.Ticket className="w-6 h-6" />} 
          colorClass="indigo" 
        />
        <StatCard 
          label="Traffic Toko (Hari Ini)" 
          value="482" 
          trend="+12%" 
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth={2}/></svg>} 
          colorClass="violet" 
        />
        <StatCard 
          label="Avg. Conversion Rate" 
          value="4.8%" 
          trend="Healthy" 
          icon={<ICONS.Dashboard className="w-6 h-6" />} 
          colorClass="emerald" 
        />
        <StatCard 
          label="Total Promo ROI" 
          value="3.4x" 
          trend="+0.4" 
          icon={<ICONS.Plus className="w-6 h-6" />} 
          colorClass="rose" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Traffic Chart */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border-slate-800 shadow-2xl">
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                    Analitik Traffic & Konversi
                 </h3>
                 <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Performa Mingguan Regional Sumatra</p>
              </div>
              <div className="flex items-center gap-4 text-[9px] font-black uppercase text-slate-500">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Visitors</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Conversion %</div>
              </div>
           </div>
           
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={trafficData}>
                    <defs>
                       <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="day" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                       itemStyle={{ color: '#fff', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorTraffic)" name="Pengunjung" />
                    <Area type="monotone" dataKey="conversion" stroke="#10b981" strokeWidth={2} fill="transparent" name="Konversi %" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Best Sellers Sidebar */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 flex flex-col">
           <h3 className="text-lg font-black text-white uppercase tracking-tight mb-8">Produk Terlaris</h3>
           <div className="space-y-4 flex-1">
              {bestSellers.map((product, idx) => (
                <div key={product.id} className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                   <div className="flex items-center gap-4">
                      <span className="text-xl font-black text-slate-800 group-hover:text-indigo-900 transition-colors">0{idx+1}</span>
                      <div className="w-10 h-10 rounded-lg bg-slate-900 overflow-hidden border border-slate-800">
                         <img src={product.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-white truncate max-w-[100px]">{product.name}</p>
                         <p className="text-[9px] text-slate-500 uppercase font-black">{product.category}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-emerald-400">+{Math.floor(Math.random() * 20) + 10}%</p>
                      <p className="text-[8px] text-slate-600 font-bold uppercase">Growth</p>
                   </div>
                </div>
              ))}
           </div>
           <button className="mt-8 w-full py-3 bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest rounded-xl hover:text-white transition-all">Lihat Laporan Katalog</button>
        </div>
      </div>

      {/* Campaigns Overview */}
      <div className="space-y-6">
         <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
            Kampanye Pemasaran Aktif
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCampaigns.length === 0 ? (
               <div className="col-span-full p-12 text-center glass-panel rounded-3xl border-slate-800 text-slate-600 italic">Tidak ada kampanye aktif saat ini.</div>
            ) : activeCampaigns.map(camp => (
               <div key={camp.id} className="glass-panel p-6 rounded-3xl border-slate-800 bg-indigo-600/5 hover:border-indigo-500/40 transition-all group flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                     <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ICONS.Ticket className="w-5 h-5" />
                     </div>
                     <span className="text-[8px] font-black px-2 py-0.5 bg-emerald-500 text-white rounded uppercase tracking-widest shadow-lg shadow-emerald-500/20">LIVE</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{camp.title}</h4>
                  <p className="text-xs text-slate-400 mb-6 flex-1 italic">Strategi diskon terukur untuk meningkatkan GMV toko di wilayah Aceh.</p>
                  
                  <div className="space-y-4 pt-6 border-t border-slate-800/50">
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase">Penggunaan Kuota</span>
                        <span className="text-xs font-black text-white">{camp.currentUsage} / {camp.usageLimit || '∞'}</span>
                     </div>
                     <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div 
                           className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]" 
                           style={{ width: `${(camp.currentUsage / (camp.usageLimit || 100)) * 100}%` }}
                        ></div>
                     </div>
                     <div className="flex justify-between items-center pt-2">
                        <div className="text-center px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 flex-1 mr-2">
                           <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">Conversion</p>
                           <p className="text-sm font-black text-indigo-400">12.4%</p>
                        </div>
                        <div className="text-center px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 flex-1 ml-2">
                           <p className="text-[8px] text-slate-600 font-bold uppercase mb-1">ROI</p>
                           <p className="text-sm font-black text-emerald-400">4.2x</p>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
            
            <button className="glass-panel border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-slate-600 hover:border-indigo-500/50 hover:text-indigo-400 transition-all group min-h-[250px]">
               <div className="p-4 bg-slate-900 rounded-2xl mb-4 group-hover:scale-110 transition-transform"><ICONS.Plus className="w-6 h-6" /></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-center">Buat Kampanye Baru</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default MarketingOverview;