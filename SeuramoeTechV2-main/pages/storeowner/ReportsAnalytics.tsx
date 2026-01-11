
import React, { useState, useEffect } from 'react';
import ReportingService from '../../services/ReportingService';
import { ICONS } from '../../constants';
import StatCard from '../../components/Shared/StatCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend 
} from 'recharts';

const ReportsAnalytics: React.FC = () => {
  const [reportType, setReportType] = useState<'sales' | 'inventory' | 'service' | 'finance'>('sales');
  const [duration, setDuration] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // In real app, fetch based on storeId from AuthService
    setData({
      sales: [
        { name: 'W1', value: 12500000 },
        { name: 'W2', value: 18400000 },
        { name: 'W3', value: 15200000 },
        { name: 'W4', value: 21000000 },
      ],
      categories: [
        { name: 'Laptops', value: 45, color: '#6366f1' },
        { name: 'Parts', value: 25, color: '#10b981' },
        { name: 'Accessories', value: 20, color: '#f59e0b' },
        { name: 'Service', value: 10, color: '#ec4899' },
      ]
    });
  }, [reportType, duration]);

  const handleExport = (format: 'PDF' | 'EXCEL' | 'CSV') => {
    const fileName = ReportingService.generateExport(reportType, format);
    alert(`Generating ${format} report: ${fileName}\nData extraction in progress for regional node Sumatra-North-01.`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      {/* Header & Global Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Business Intelligence Hub</h2>
          <p className="text-sm text-slate-500">Comprehensive audit and performance analytics for your store node.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
             {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(d => (
               <button 
                 key={d}
                 onClick={() => setDuration(d)}
                 className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${duration === d ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
               >
                 {d}
               </button>
             ))}
           </div>
           
           <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
             <button onClick={() => handleExport('PDF')} className="p-2 text-slate-500 hover:text-white transition-colors" title="Export PDF"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth={2}/></svg></button>
             <button onClick={() => handleExport('EXCEL')} className="p-2 text-slate-500 hover:text-white transition-colors" title="Export Excel"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2}/></svg></button>
             <button onClick={() => handleExport('CSV')} className="p-2 text-slate-500 hover:text-white transition-colors" title="Export CSV"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2}/></svg></button>
           </div>
        </div>
      </div>

      {/* KPI Overlays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Net Revenue" value="Rp 142.5M" trend="+12%" icon={<ICONS.Dashboard />} colorClass="indigo" />
        <StatCard label="Sales Conversion" value="4.8%" trend="+0.5%" icon={<ICONS.Plus />} colorClass="emerald" />
        <StatCard label="Avg. Order Value" value="Rp 2.4M" icon={<ICONS.Package />} colorClass="violet" />
        <StatCard label="Service Retention" value="94%" trend="+2%" icon={<ICONS.Ticket />} colorClass="amber" />
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
         {(['sales', 'inventory', 'service', 'finance'] as const).map(type => (
           <button 
            key={type}
            onClick={() => setReportType(type)}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportType === type ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
           >
             {type === 'sales' ? 'Laporan Penjualan' : type === 'inventory' ? 'Analitik Stok' : type === 'service' ? 'Performa Service' : 'Arus Keuangan'}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Primary Visualization */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border-slate-800 shadow-2xl">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                 Revenue Trend - {duration.toUpperCase()}
              </h3>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">Node: Sum-N-01</span>
           </div>
           
           <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data?.sales || []}>
                    <defs>
                       <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `Rp${v/1000000}M`} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                       itemStyle={{ color: '#fff', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Secondary Data & Insights */}
        <div className="space-y-8">
           <div className="glass-panel p-8 rounded-3xl border-slate-800 flex flex-col items-center">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 self-start">Revenue Mix</h3>
              <div className="h-[220px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={data?.categories || []}
                          innerRadius={65}
                          outerRadius={85}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {data?.categories.map((entry: any, index: number) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                       <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl">
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                 <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>
                 AI Growth Insight
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                "Kategori <span className="text-indigo-400 font-bold">Spareparts</span> meningkat 24% minggu ini di region Banda Aceh. Stok RAM DDR4 menipis, disarankan restock sebelum promo gajian dimulai."
              </p>
           </div>

           <div className="glass-panel p-6 rounded-3xl border-slate-800">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Regional Benchmarking</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400 uppercase">vs Sumatra Avg</span>
                    <span className="text-emerald-400">+14.2%</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400 uppercase">Market Share Aceh</span>
                    <span className="text-white">8.5%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Detailed Ledger Section */}
      <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
         <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Laporan Audit Transaksi</h3>
            <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Lihat Semua Data</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-900/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                     <th className="px-8 py-5">Identitas Produk/Service</th>
                     <th className="px-8 py-5">Volume</th>
                     <th className="px-8 py-5">Gross Revenue</th>
                     <th className="px-8 py-5">Platform Fee</th>
                     <th className="px-8 py-5 text-right">Net Profit</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                  {[
                    { name: 'Asus ROG G14 Sync', vol: 12, gross: 324000000, fee: 3240000, net: 320760000 },
                    { name: 'Keyboard Service L3', vol: 45, gross: 11250000, fee: 1125000, net: 10125000 },
                    { name: 'Logitech G-Series Desk', vol: 28, gross: 24500000, fee: 2450000, net: 22050000 },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/20 transition-all group cursor-default">
                       <td className="px-8 py-4">
                          <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{row.name}</p>
                       </td>
                       <td className="px-8 py-4 text-xs font-bold text-slate-400">{row.vol} Units</td>
                       <td className="px-8 py-4 text-xs font-bold text-white">Rp {row.gross.toLocaleString()}</td>
                       <td className="px-8 py-4 text-xs font-bold text-rose-400">-Rp {row.fee.toLocaleString()}</td>
                       <td className="px-8 py-4 text-right">
                          <p className="text-sm font-black text-emerald-400">Rp {row.net.toLocaleString()}</p>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
