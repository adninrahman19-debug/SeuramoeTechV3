import React, { useState, useEffect } from 'react';
import ReportingService from '../../services/ReportingService.ts';
import AuthService from '../../auth/AuthService.ts';
import { ICONS } from '../../constants.tsx';
import StatCard from '../../components/Shared/StatCard.tsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';

const StaffOperationalReports: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const storeId = user?.storeId || 's1';
  
  const [summary, setSummary] = useState<any>(null);
  const [hourlyData, setHourlyData] = useState<any[]>([]);

  useEffect(() => {
    setSummary(ReportingService.getStaffDailySummary(storeId));
    setHourlyData([
      { time: '08:00', load: 2 },
      { time: '10:00', load: 5 },
      { time: '12:00', load: 8 },
      { time: '14:00', load: 4 },
      { time: '16:00', load: 6 },
      { time: '18:00', load: 9 },
    ]);
  }, [storeId]);

  const handleExport = (format: 'PDF' | 'CSV') => {
    const filename = ReportingService.generateExport('Daily_Ops', format);
    alert(`Mengekspor data operasional... \nFile: ${filename} sedang diproses oleh Node Sumatra-01.`);
  };

  const handleCloseShift = () => {
    if (confirm("Apakah Anda yakin ingin menutup shift operasional? Sistem akan mengunci catatan kas dan mengirimkan laporan final ke Owner.")) {
       alert("Shift ditutup. Laporan Settlement telah dikirim via WhatsApp API ke Owner.");
    }
  };

  if (!summary) return null;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
       {/* Live Performance Banner */}
       <div className="glass-panel p-10 rounded-[3rem] border-slate-800 bg-gradient-to-br from-indigo-600/10 to-transparent shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
             <ICONS.Dashboard className="w-48 h-48" />
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
             <div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Daily Ops Analytics</h3>
                <p className="text-sm text-slate-400 font-medium">Rekapitulasi aktivitas Terminal: <span className="text-indigo-400">Sum-N-01</span> • Tanggal: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
             </div>
             <div className="flex gap-3 w-full lg:w-auto">
                <button 
                  onClick={() => handleExport('PDF')}
                  className="flex-1 lg:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-2"
                >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth={2}/></svg>
                   PDF Report
                </button>
                <button 
                  onClick={() => handleExport('CSV')}
                  className="flex-1 lg:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-2"
                >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2}/></svg>
                   Export CSV
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 relative z-10">
             <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-3xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Penjualan</p>
                <p className="text-3xl font-black text-white">Rp {summary.salesTotal.toLocaleString()}</p>
                <div className="mt-4 flex items-center gap-2">
                   <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded">{summary.salesCount} Transaksi</span>
                </div>
             </div>
             <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-3xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Servis Selesai</p>
                <p className="text-3xl font-black text-emerald-400">{summary.repairsResolved} Unit</p>
                <div className="mt-4 flex items-center gap-2">
                   <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-black rounded">{summary.newTickets} Antrean Baru</span>
                </div>
             </div>
             <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-3xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Stok Masuk/Keluar</p>
                <p className="text-3xl font-black text-amber-400">{summary.inventoryChanges} Event</p>
                <div className="mt-4 flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase">Aktivitas Gudang Terlog</div>
             </div>
             <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-3xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Waktu Aktif Shift</p>
                <p className="text-3xl font-black text-indigo-400">{summary.activeShiftTime}</p>
                <div className="mt-4 flex items-center gap-2">
                   <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                   <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active Connection</span>
                </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Load Chart */}
          <div className="lg:col-span-2 glass-panel p-8 rounded-[3rem] border-slate-800 shadow-2xl">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                   Traffic Operasional Hari Ini
                </h3>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800">Beban Kerja Real-time</span>
             </div>
             
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={hourlyData}>
                      <defs>
                         <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} itemStyle={{ color: '#fff', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="load" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorLoad)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Shift Settlement Panel */}
          <div className="space-y-6">
             <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 bg-indigo-600 shadow-2xl shadow-indigo-600/20 text-white flex flex-col justify-between min-h-[400px]">
                <div>
                   <h4 className="text-2xl font-black tracking-tighter uppercase mb-4 leading-none">Shift Settlement Protocol</h4>
                   <p className="text-xs opacity-80 leading-relaxed mb-8">
                      Protokol penutupan shift diperlukan untuk sinkronisasi data kas fisik dan inventaris digital. Pastikan semua transaksi hari ini telah diverifikasi.
                   </p>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-bold py-3 border-b border-white/10 uppercase tracking-widest">
                         <span className="opacity-60">Uang Kas di Box</span>
                         <span className="font-black">Rp {summary.cashOnHand.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold py-3 border-b border-white/10 uppercase tracking-widest">
                         <span className="opacity-60">Pending Settlement</span>
                         <span className="font-black text-rose-300">0 Items</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold py-3 uppercase tracking-widest">
                         <span className="opacity-60">Status Sinkronisasi</span>
                         <span className="font-black text-emerald-300">100% READY</span>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handleCloseShift}
                  className="w-full py-5 bg-white text-indigo-600 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all shadow-xl"
                >
                   Tutup Shift & Kirim Laporan
                </button>
             </div>

             <div className="glass-panel p-6 rounded-3xl border-slate-800">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Audit Logs (Today)</h4>
                <div className="space-y-3">
                   {[
                     { event: 'Bulk Inventory Sync', time: '14:22', type: 'system' },
                     { event: 'Settlement TX-9901', time: '15:10', type: 'finance' },
                     { event: 'Manual Stock Adjust', time: '16:45', type: 'admin' },
                   ].map((log, i) => (
                     <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-400 truncate max-w-[120px]">{log.event}</span>
                        <span className="text-slate-600">{log.time}</span>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-4 py-2 text-[9px] font-black text-indigo-400 hover:text-white transition-colors uppercase tracking-widest">Lihat Seluruh Audit Trail</button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default StaffOperationalReports;