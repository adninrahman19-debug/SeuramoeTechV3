import React, { useState, useEffect } from 'react';
import SupportService from '../../services/SupportService.ts';
import AuthService from '../../auth/AuthService.ts';
import { ICONS } from '../../constants.tsx';
import { SupportTicket, SupportStatus, WarrantyClaim, WarrantyStatus } from '../../types.ts';
import StatCard from '../../components/Shared/StatCard.tsx';

const TechnicianOverview: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const storeId = user?.storeId || 's1';
  const technicianName = user?.fullName || '';

  const [myTickets, setMyTickets] = useState<SupportTicket[]>([]);
  const [globalQueue, setGlobalQueue] = useState<SupportTicket[]>([]);
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>([]);
  const [deadlinesToday, setDeadlinesToday] = useState<SupportTicket[]>([]);

  useEffect(() => {
    const allTickets = SupportService.getTickets(storeId);
    
    // 1. Tiket saya yang aktif (Repairing / In Progress)
    setMyTickets(allTickets.filter(t => 
      t.technicianName === technicianName && 
      [SupportStatus.REPAIRING, SupportStatus.IN_PROGRESS, SupportStatus.CHECKING].includes(t.status)
    ));

    // 2. Antrean global yang belum ada teknisinya
    setGlobalQueue(allTickets.filter(t => !t.technicianName && t.status === SupportStatus.OPEN));

    // 3. Garansi yang perlu dicek (Mock data matching store)
    setWarrantyClaims(SupportService.getWarranties().filter(w => w.status === WarrantyStatus.PENDING));

    // 4. Deadline hari ini
    const today = new Date().toISOString().split('T')[0];
    setDeadlinesToday(allTickets.filter(t => 
        t.technicianName === technicianName && 
        t.slaDeadline.startsWith(today) &&
        t.status !== SupportStatus.RESOLVED
    ));
  }, [storeId, technicianName]);

  const handleUpdateStatus = (id: string, nextStatus: SupportStatus) => {
    SupportService.updateTicket(id, { status: nextStatus });
    alert(`Status unit diperbarui ke: ${nextStatus}`);
    window.location.reload(); // Refresh to sync
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Tugas Aktif Saya" 
          value={myTickets.length} 
          icon={<ICONS.Settings className="w-5 h-5" />} 
          colorClass="indigo" 
        />
        <StatCard 
          label="Antrean Toko" 
          value={globalQueue.length} 
          trend="Need Assign"
          icon={<ICONS.Ticket className="w-5 h-5" />} 
          colorClass="amber" 
        />
        <StatCard 
          label="Inspeksi Garansi" 
          value={warrantyClaims.length} 
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg>} 
          colorClass="emerald" 
        />
        <StatCard 
          label="Deadline Hari Ini" 
          value={deadlinesToday.length} 
          trend={deadlinesToday.length > 0 ? "Urgent" : "Clear"}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>} 
          colorClass="rose" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Workbench */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                 Workbench: Unit Dalam Pengerjaan
              </h3>
           </div>

           <div className="space-y-4">
              {myTickets.length === 0 ? (
                <div className="p-12 text-center glass-panel rounded-3xl border-slate-800 text-slate-500 italic">Workbench kosong. Ambil tugas baru dari antrean toko.</div>
              ) : myTickets.map(t => (
                <div key={t.id} className="glass-panel p-6 rounded-[2rem] border-slate-800 hover:border-indigo-500/30 transition-all group">
                   <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-mono font-bold text-indigo-400">#{t.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${t.priority === 'URGENT' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{t.priority}</span>
                         </div>
                         <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{t.deviceModel}</h4>
                         <p className="text-xs text-slate-500 mt-1 italic">"{t.issueDescription}"</p>
                         
                         <div className="mt-4 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
                            <span>SLA: {new Date(t.slaDeadline).toLocaleDateString()}</span>
                            <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                            <span className="text-indigo-500">Estimasi: Rp {t.estimatedCost?.toLocaleString()}</span>
                         </div>
                      </div>

                      <div className="flex flex-col gap-2 min-w-[140px]">
                         <button 
                           onClick={() => handleUpdateStatus(t.id, SupportStatus.RESOLVED)}
                           className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                         >
                           Selesai Servis
                         </button>
                         <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-700">Update Progres</button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Sidebar: Claims & Queue */}
        <div className="space-y-8">
           <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 bg-indigo-600/5">
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">Inspeksi Garansi Masuk</h4>
              <div className="space-y-4">
                 {warrantyClaims.length === 0 ? (
                   <p className="text-[10px] text-slate-600 italic">Tidak ada klaim baru.</p>
                 ) : warrantyClaims.map(w => (
                   <div key={w.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-emerald-500/30 transition-all">
                      <p className="text-xs font-bold text-white mb-1">{w.customerName}</p>
                      <p className="text-[10px] text-slate-500 font-mono mb-3">{w.imei}</p>
                      <button className="w-full py-2 bg-slate-900 border border-slate-800 text-[9px] font-black text-emerald-400 uppercase tracking-widest rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">Validasi Unit</button>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Antrean Toko (Unassigned)</h4>
              <div className="space-y-3">
                 {globalQueue.slice(0, 3).map(q => (
                   <div key={q.id} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                      <div>
                         <p className="text-[10px] font-bold text-white truncate max-w-[120px]">{q.deviceModel}</p>
                         <p className="text-[8px] text-slate-600 font-black uppercase tracking-tighter mt-0.5">{q.priority} PRIORITY</p>
                      </div>
                      <button 
                        onClick={() => { SupportService.updateTicket(q.id, { technicianName: technicianName, status: SupportStatus.CHECKING }); alert("Unit diambil. Silakan cek workbench Anda."); window.location.reload(); }}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-[8px] font-black uppercase rounded-lg hover:bg-indigo-500 transition-all"
                      >
                         Ambil
                      </button>
                   </div>
                 ))}
                 <button className="w-full mt-4 text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Lihat Seluruh Antrean ({globalQueue.length})</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianOverview;