import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants.tsx';
import StatCard from '../../components/Shared/StatCard.tsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, ComposedChart, Area
} from 'recharts';

const MarketingAnalytics: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState('All Regions');

  // Mock Data: Performa Promo
  const promoPerformance = [
    { name: 'Flash Sale Aceh', clicks: 1200, conv: 85, roi: 4.2 },
    { name: 'Weekend Tech', clicks: 850, conv: 42, roi: 2.8 },
    { name: 'Student Promo', clicks: 2100, conv: 120, roi: 5.1 },
    { name: 'Banda Fair 24', clicks: 450, conv: 12, roi: 1.5 },
  ];

  // Mock Data: Klik vs Konversi Trend
  const funnelData = [
    { date: '01/10', clicks: 400, conversions: 24 },
    { date: '02/10', clicks: 520, conversions: 38 },
    { date: '03/10', clicks: 480, conversions: 30 },
    { date: '04/10', clicks: 700, conversions: 55 },
    { date: '05/10', clicks: 950, conversions: 82 },
    { date: '06/10', clicks: 1100, conversions: 94 },
    { date: '07/10', clicks: 880, conversions: 70 },
  ];

  // Mock Data: Segmentasi
  const segmentationData = [
    { name: 'Power Users (Gamers)', value: 35, color: '#6366f1' },
    { name: 'Corporate/Office', value: 25, color: '#8b5cf6' },
    { name: 'Students', value: 30, color: '#ec4899' },
    { name: 'Casual/Home', value: 10, color: '#f59e0b' },
  ];

  // Mock Data: Produk Potensial (High Interest, Low Sales)
  const potentialProducts = [
    { id: 'p-1', name: 'RTX 4090 Global Edition', views: 4200, sales: 5, score: 92, reason: 'Trafik sangat tinggi, harga mungkin terlalu kompetitif' },
    { id: 'p-2', name: 'Mechanical Keyboard Sum-01', views: 2800, sales: 12, score: 85, reason: 'CTR tinggi dari iklan regional, butuh promo bundle' },
    { id: 'p-3', name: 'Laptop Slim Ace-Pro', views: 1500, sales: 2, score: 78, reason: 'Dilirik segmen pelajar, stok mulai menipis' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      {/* Analytics Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h3 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-mono">An</div>
              Marketing Intelligence
           </h3>
           <p className="text-sm text-slate-500 font-medium mt-1">Data-driven insights untuk optimasi konversi regional.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-xl">
           <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">7 Hari Terakhir</button>
           <button className="px-6 py-2 text-slate-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">30 Hari</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 1. Funnel Trend: Klik & Konversi */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border-slate-800 shadow-2xl">
           <div className="flex justify-between items-center mb-10">
              <h4 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                 Click to Conversion Funnel
              </h4>
              <div className="flex items-center gap-4 text-[9px] font-black uppercase text-slate-500">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Klik Iklan</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Transaksi</div>
              </div>
           </div>
           
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={funnelData}>
                    <defs>
                       <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                       itemStyle={{ color: '#fff', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="clicks" fill="url(#colorClicks)" stroke="#6366f1" strokeWidth={3} name="Klik" />
                    <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981' }} name="Konversi" />
                 </ComposedChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* 2. Customer Segmentation */}
        <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 flex flex-col items-center">
           <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10 self-start">Segmentasi Pelanggan</h4>
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={segmentationData}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {segmentationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="w-full space-y-3 mt-6">
              {segmentationData.map(d => (
                <div key={d.name} className="flex justify-between items-center text-[10px] font-bold">
                   <div className="flex items-center gap-2 text-slate-500">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                      {d.name}
                   </div>
                   <span className="text-white">{d.value}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* 3. Promo Performance Leaderboard */}
      <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 shadow-2xl">
         <div className="flex justify-between items-center mb-10">
            <h4 className="text-xl font-bold text-white uppercase tracking-tight">Performa Kampanye Aktif</h4>
            <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Export Analitik Promo</button>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {promoPerformance.map(promo => (
              <div key={promo.name} className="p-6 bg-slate-950 border border-slate-800 rounded-3xl group hover:border-indigo-500/30 transition-all">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">{promo.name}</p>
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-2xl font-black text-white">{promo.roi}x</p>
                          <p className="text-[8px] text-indigo-400 font-bold uppercase">Estimated ROI</p>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-bold text-emerald-400">{((promo.conv/promo.clicks)*100).toFixed(1)}%</p>
                          <p className="text-[8px] text-slate-600 font-bold uppercase">CVR</p>
                       </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]" style={{ width: `${(promo.clicks/2100)*100}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">{promo.clicks.toLocaleString()} total clicks generated.</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* 4. Potential Products Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800">
            <div className="flex justify-between items-center mb-8">
               <h4 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                  Radar Produk Potensial
               </h4>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Berdasarkan Minat (Views)</span>
            </div>
            <div className="space-y-4">
               {potentialProducts.map(p => (
                 <div key={p.id} className="p-5 bg-slate-950/50 border border-slate-800 rounded-3xl flex items-center justify-between group hover:border-rose-500/30 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center font-black text-rose-500 text-sm border border-slate-800 shadow-lg">
                          {p.score}%
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">{p.name}</p>
                          <p className="text-[10px] text-slate-500 mt-1 italic">"{p.reason}"</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-white">{p.views.toLocaleString()}</p>
                       <p className="text-[8px] text-slate-600 font-bold uppercase">Views</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="glass-panel p-10 rounded-[2.5rem] border-slate-800 bg-indigo-600/5 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Rekomendasi Strategi</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-8 italic">
               "Tingginya minat pada kategori <span className="text-indigo-400 font-bold underline">Power Users</span> di regional Aceh menunjukkan peluang besar untuk kampanye 'Custom Rig Build'. Gunakan radar produk potensial untuk menentukan item yang dipush dalam Flash Sale mendatang."
            </p>
            <div className="flex gap-3">
               <button className="flex-1 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all">Deploy Strategi Pelajar</button>
               <button className="flex-1 py-4 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-700 hover:text-white transition-all">Analisis Lebih Dalam</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MarketingAnalytics;