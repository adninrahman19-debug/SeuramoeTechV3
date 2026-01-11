
import React from 'react';
import StatCard from '../../components/Shared/StatCard';
import { ICONS } from '../../constants';

const StaffAdminOverview: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Overview Cards (Requirement a) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Order Hari Ini" value="14" trend="+4" icon={<ICONS.Package className="w-5 h-5" />} colorClass="indigo" />
        <StatCard label="Order Pending" value="8" trend="Action Required" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} colorClass="amber" />
        <StatCard label="Stok Menipis" value="5" trend="Alert" icon={<ICONS.Store className="w-5 h-5" />} colorClass="rose" />
        <StatCard label="Pembayaran Tertunda" value="Rp 4.2M" icon={<ICONS.Ticket className="w-5 h-5" />} colorClass="violet" />
        <StatCard label="Service Aktif" value="12" icon={<ICONS.Settings className="w-5 h-5" />} colorClass="emerald" />
        <StatCard label="Keluhan Baru" value="2" icon={<ICONS.Users className="w-5 h-5" />} colorClass="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Focus Tugas (Priority Tasks) */}
         <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <ICONS.Dashboard className="w-32 h-32" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3">
               <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
               Prioritas Operasional Hari Ini
            </h3>
            <div className="space-y-4">
               {[
                 { task: 'Verifikasi Transfer Mandiri (ORD-9921)', priority: 'HIGH', time: '12m ago', icon: <ICONS.Ticket className="w-4 h-4" /> },
                 { task: 'Update Estimasi Biaya Servis (T-8802)', priority: 'MEDIUM', time: '45m ago', icon: <ICONS.Settings className="w-4 h-4" /> },
                 { task: 'Restock RAM DDR4 Kingston 8GB', priority: 'HIGH', time: 'Urgent', icon: <ICONS.Package className="w-4 h-4" /> },
                 { task: 'Tanggapi Ulasan Bintang 1 (Ali Akbar)', priority: 'HIGH', time: '1h ago', icon: <ICONS.Users className="w-4 h-4" /> },
               ].map((t, i) => (
                 <div key={i} className="p-5 bg-slate-950/50 border border-slate-800 rounded-2xl flex justify-between items-center group hover:border-indigo-500/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-lg ${t.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                          {t.icon}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{t.task}</p>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-widest">{t.time}</p>
                       </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest ${t.priority === 'HIGH' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                       {t.priority}
                    </span>
                 </div>
               ))}
            </div>
         </div>

         {/* Internal Communications */}
         <div className="space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 bg-indigo-600/5 relative overflow-hidden h-full flex flex-col justify-center">
               <h3 className="text-2xl font-black text-white mb-4 tracking-tighter">Pengumuman Internal</h3>
               <div className="p-5 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
                  <p className="text-sm text-indigo-200 leading-relaxed italic">
                    "Reminder: Promo <span className="font-black text-white">Aceh Tech Weekend</span> akan aktif besok pagi jam 08:00. Tolong pastikan label printer sudah siap dan stok packing (bubble wrap/lakban) mencukupi."
                  </p>
                  <p className="text-[10px] text-indigo-400 font-bold mt-4 uppercase">— Teuku Abdullah (Owner)</p>
               </div>
               <div className="mt-8 flex gap-3">
                  <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-600/20">Konfirmasi Baca</button>
                  <button className="flex-1 py-3 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-700">Arsip</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StaffAdminOverview;
