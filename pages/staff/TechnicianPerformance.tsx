import React, { useState, useEffect } from 'react';
import AuthService from '../../auth/AuthService.ts';
import StaffService, { StaffPerformance } from '../../services/StaffService.ts';
import ReviewService from '../../services/ReviewService.ts';
import { ICONS } from '../../constants.tsx';
import StatCard from '../../components/Shared/StatCard.tsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

const TechnicianPerformance: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const [metrics, setMetrics] = useState<StaffPerformance | undefined>(undefined);
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const m = StaffService.getStaffMetrics(user.id);
      setMetrics(m);

      // Mock data for performance trend
      setPerformanceHistory([
        { day: 'Mon', completed: 3, time: 4.2 },
        { day: 'Tue', completed: 5, time: 3.8 },
        { day: 'Wed', completed: 2, time: 5.1 },
        { day: 'Thu', completed: 6, time: 3.2 },
        { day: 'Fri', completed: 4, time: 3.5 },
        { day: 'Sat', completed: 7, time: 2.8 },
      ]);

      // Mock specific technician feedback (filter from global reviews)
      const allReviews = ReviewService.getReviews(user.storeId || 's1');
      setRecentReviews(allReviews.slice(0, 3));
    }
  }, []);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h3 className="text-2xl font-black text-white tracking-tight">Rapor Performa Teknisi</h3>
           <p className="text-sm text-slate-500 font-medium mt-1">Analitik produktivitas dan kepuasan pelanggan real-time.</p>
        </div>
        <div className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Periode: Oktober 2024</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tiket Diselesaikan" value={metrics?.tasksCompleted || 0} trend="+12%" icon={<ICONS.Ticket />} colorClass="indigo" />
        <StatCard label="Waktu Rata-rata" value={metrics?.avgResponseTime || '0h'} trend="-15m" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>} colorClass="amber" />
        <StatCard label="Rating Pelanggan" value={`${metrics?.rating || 0} / 5.0`} trend="Excellent" icon={<ICONS.Users />} colorClass="emerald" />
        <StatCard label="Skor Aktivitas" value={`${metrics?.activityScore || 0}%`} icon={<ICONS.Dashboard />} colorClass="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Productivity Chart */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border-slate-800 shadow-2xl">
           <div className="flex justify-between items-center mb-10">
              <h4 className="text-lg font-bold text-white flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                 Tren Penyelesaian Tugas (Harian)
              </h4>
              <div className="flex items-center gap-4 text-[9px] font-black uppercase text-slate-500">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Tiket Selesai</div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Waktu (Jam)</div>
              </div>
           </div>
           
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={performanceHistory}>
                    <defs>
                       <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="day" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} itemStyle={{ color: '#fff', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCompleted)" name="Selesai" />
                    <Line type="monotone" dataKey="time" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Waktu" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Owner's Evaluation Notes */}
        <div className="space-y-6">
           <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 bg-indigo-600/5 h-full flex flex-col">
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">Catatan Evaluasi Owner</h4>
              <div className="space-y-4 flex-1">
                 <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl relative">
                    <div className="absolute -left-1 top-4 w-1 h-8 bg-indigo-500 rounded-full"></div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Evaluasi Mingguan - 20 Okt</p>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                       "Budi menunjukkan peningkatan signifikan dalam menangani unit MacBook. Waktu diagnosa lebih cepat 20% dari bulan lalu. Pertahankan kualitas dokumentasi sebelum/sesudah servis."
                    </p>
                    <p className="text-[9px] text-indigo-500 font-black mt-4 uppercase">— Teuku Abdullah (Owner)</p>
                 </div>
                 <div className="p-5 bg-slate-950/50 border border-slate-800 rounded-2xl opacity-50">
                    <p className="text-[10px] text-slate-600 font-bold uppercase mb-2">Evaluasi Bulanan - Sep</p>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                       "Fokus pada kerapihan kabel internal saat pemasangan kembali unit gaming."
                    </p>
                 </div>
              </div>
              <button className="w-full mt-8 py-3 bg-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-colors">Arsip Evaluasi</button>
           </div>
        </div>
      </div>

      {/* Customer Voice Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800">
            <h4 className="text-lg font-bold text-white mb-8 tracking-tight">Suara Pelanggan (Terbaru)</h4>
            <div className="space-y-4">
               {recentReviews.map(rev => (
                 <div key={rev.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-indigo-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                       <div className="flex items-center gap-3">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.customerName}`} className="w-8 h-8 rounded-lg bg-slate-800" alt="" />
                          <div>
                             <p className="text-xs font-bold text-white">{rev.customerName}</p>
                             <p className="text-[9px] text-indigo-500 font-black uppercase">{rev.productName || 'Servis Unit'}</p>
                          </div>
                       </div>
                       <div className="text-amber-400 text-[10px]">{'★'.repeat(rev.rating)}</div>
                    </div>
                    <p className="text-xs text-slate-400 italic">"{rev.comment}"</p>
                 </div>
               ))}
            </div>
         </div>

         <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 bg-gradient-to-br from-emerald-600/10 to-transparent flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20">
               <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
            </div>
            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Status Bonus Aktif</h4>
            <p className="text-sm text-slate-400 mt-2 max-w-sm">Anda telah memenuhi KPI minimum bulan ini. Anda berhak mendapatkan insentif performa pada payroll mendatang.</p>
            <div className="mt-8 px-6 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Bonus Terverifikasi</div>
         </div>
      </div>
    </div>
  );
};

export default TechnicianPerformance;