import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants.tsx';
import StatCard from '../../components/Shared/StatCard.tsx';
import ReportingService from '../../services/ReportingService.ts';
import AuthService from '../../auth/AuthService.ts';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, ComposedChart, Line, Area
} from 'recharts';

const MarketingReports: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'insights' | 'strategy'>('campaigns');

  // Mock Data: Historis Kampanye
  const campaignHistory = [
    { id: 'C-001', name: 'Aceh Tech Weekend', reach: 4500, conversion: 120, roi: '4.5x', status: 'Completed' },
    { id: 'C-002', name: 'Ramadan Regional Sale', reach: 12000, conversion: 480, roi: '6.2x', status: 'Active' },
    { id: 'C-003', name: 'Back to Campus 24', reach: 8200, conversion: 210, roi: '3.8x', status: 'Scheduled' },
  ];

  // Mock Data: Insight Performa Promo (Berdasarkan Kategori)
  const promoInsights = [
    { name: 'Flash Sale (Hourly)', impact: 85, color: '#6366f1' },
    { name: 'Bundle Discount', impact: 62, color: '#8b5cf6' },
    { name: 'Free Shipping Sumatra', impact: 94, color: '#10b981' },
    { name: 'Voucher New Member', impact: 45, color: '#f59e0b' },
  ];

  const handleExportReport = (type: string) => {
    const filename = ReportingService.generateExport(type, 'PDF');
    alert(`Menyiapkan Laporan ${type}...\nFile ${filename} akan segera diunduh.`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      {/* Intelligence Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h3 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs">MI</div>
              Marketing Intelligence Report
           </h3>
           <p className="text-sm text-slate-500 font-medium mt-1">Audit strategis dan pemetaan performa pasar regional.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto max-w-full">
           <button onClick={() => setActiveTab('campaigns')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'campaigns' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Laporan Kampanye</button>
           <button onClick={() => setActiveTab('insights')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'insights' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Insight Promo</button>
           <button onClick={() => setActiveTab('strategy')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'strategy' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Rekomendasi</button>
        </div>
      </div>

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Reach (30h)" value="24.8k" trend="+15%" icon={<ICONS.Users className="w-5 h-5" />} colorClass="indigo" />
              <StatCard label="Avg. Conversion" value="5.2%" trend="Stable" icon={<ICONS.Dashboard className="w-5 h-5" />} colorClass="emerald" />
              <StatCard label="Marketing ROI" value="4.8x" trend="+0.4" icon={<ICONS.Plus className="w-5 h-5" />} colorClass="violet" />
              <StatCard label="Acquisition Cost" value="Rp 12k" trend="-2k" icon={<ICONS.Ticket className="w-5 h-5" />} colorClass="rose" />
           </div>

           <div className="glass-panel rounded-[2.5rem] border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                 <h4 className="text-lg font-bold text-white uppercase tracking-tight">Ecosystem Campaign Ledger</h4>
                 <button onClick={() => handleExportReport('Marketing_Master')} className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2}/></svg>
                    Export Full Audit
                 </button>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-900/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                          <th className="px-8 py-5">Nama Kampanye</th>
                          <th className="px-8 py-5 text-center">Jangkauan</th>
                          <th className="px-8 py-5 text-center">Konversi</th>
                          <th className="px-8 py-5 text-center">ROI</th>
                          <th className="px-8 py-5 text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                       {campaignHistory.map(camp => (
                          <tr key={camp.id} className="hover:bg-slate-800/20 transition-all group">
                             <td className="px-8 py-4">
                                <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{camp.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono mt-1">Ref ID: {camp.id}</p>
                             </td>
                             <td className="px-8 py-4 text-center">
                                <span className="text-xs font-black text-white">{camp.reach.toLocaleString()}</span>
                             </td>
                             <td className="px-8 py-4 text-center text-xs font-bold text-emerald-400">{camp.conversion} Unit</td>
                             <td className="px-8 py-4 text-center">
                                <span className="px-2 py-1 bg-indigo-600/10 text-indigo-400 rounded-lg text-[10px] font-black">{camp.roi}</span>
                             </td>
                             <td className="px-8 py-4 text-right">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                   camp.status === 'Active' ? 'bg-emerald-500 text-white animate-pulse' : 
                                   camp.status === 'Scheduled' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                                }`}>{camp.status}</span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="glass-panel p-10 rounded-[3rem] border-slate-800 shadow-2xl">
              <h4 className="text-lg font-bold text-white mb-10 flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                 Impact Distribution by Promo Type
              </h4>
              <div className="h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={promoInsights} layout="vertical">
                       <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} width={120} />
                       <Tooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                       <Bar dataKey="impact" radius={[0, 8, 8, 0]} barSize={32}>
                          {promoInsights.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="space-y-6">
              <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 bg-indigo-600/5 h-full">
                 <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">Critical Data Insights</h4>
                 <div className="space-y-4">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                       <p className="text-xs font-bold text-white mb-2">Pola Pembelian Regional</p>
                       <p className="text-[10px] text-slate-400 leading-relaxed italic">"Pelanggan di node <span className="text-indigo-400 font-bold">Sumatra-North</span> merespons 3x lebih cepat terhadap diskon ongkir daripada potongan harga nominal di atas Rp 100k."</p>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                       <p className="text-xs font-bold text-white mb-2">Prime Time Aktivitas</p>
                       <p className="text-[10px] text-slate-400 leading-relaxed italic">"Klik tertinggi terjadi pada pukul <span className="text-emerald-400 font-bold">19:00 - 21:00 WIB</span>. Disarankan jadwal broadcast campaign dilakukan 1 jam sebelumnya."</p>
                    </div>
                    <button className="w-full py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all mt-4">Generate AI Deep Insight</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'strategy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             { title: 'Bundling Servis & Aksesoris', target: 'Low Spenders', desc: 'Tawarkan pembersihan laptop gratis setiap pembelian mouse/keyboard di atas Rp 200k.', color: 'indigo' },
             { title: 'Re-engagement Alumni Servis', target: 'Inactive Users', desc: 'Kirim voucher perpanjangan garansi ke database pelanggan yang sudah 6 bulan tidak berkunjung.', color: 'amber' },
             { title: 'Aceh Gaming Fest', target: 'Power Users', desc: 'Deploy kampanye khusus kategori GPU & Monitor untuk node Banda Aceh menyambut turnamen lokal.', color: 'rose' },
           ].map((strat, i) => (
             <div key={i} className="glass-panel p-8 rounded-[2.5rem] border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col group relative overflow-hidden">
                <div className={`absolute top-[-10%] right-[-10%] w-32 h-32 bg-${strat.color}-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                <div className="relative z-10">
                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border border-${strat.color}-500/20 text-${strat.color}-400 mb-6 inline-block`}>{strat.target}</span>
                   <h4 className="text-xl font-black text-white mb-4 leading-tight">{strat.title}</h4>
                   <p className="text-xs text-slate-400 leading-relaxed italic mb-8">"{strat.desc}"</p>
                   <div className="pt-6 border-t border-slate-800/50 flex justify-between items-center mt-auto">
                      <span className="text-[10px] font-bold text-slate-600">Prob. Success: 82%</span>
                      <button className="px-4 py-2 bg-slate-900 border border-slate-800 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all">Deploy Plan</button>
                   </div>
                </div>
             </div>
           ))}
           
           <div className="glass-panel p-8 rounded-[2.5rem] border-dashed border-2 border-slate-800 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-600/5 transition-all">
              <div className="p-4 bg-slate-900 rounded-2xl mb-4 group-hover:scale-110 transition-transform"><ICONS.Plus className="w-8 h-8 text-slate-600" /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white">Ajukan Proposal Strategi Baru</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default MarketingReports;