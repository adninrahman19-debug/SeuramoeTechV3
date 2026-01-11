
import React, { useState, useEffect } from 'react';
import SupportService from '../../services/SupportService.ts';
import AuthService from '../../auth/AuthService.ts';
import { SupportTicket, SupportStatus } from '../../types.ts';
import { ICONS } from '../../constants.tsx';
import RightDrawer from '../../components/Shared/RightDrawer.tsx';
import StatCard from '../../components/Shared/StatCard.tsx';

const TechnicianTicketManager: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const storeId = user?.storeId || 's1';
  const technicianName = user?.fullName || '';

  const [activeTab, setActiveTab] = useState<'my_tasks' | 'unassigned'>('my_tasks');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [diagnosis, setDiagnosis] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    loadTickets();
  }, [storeId]);

  const loadTickets = () => {
    const all = SupportService.getTickets(storeId);
    setTickets(all);
  };

  const myTasks = tickets.filter(t => t.technicianName === technicianName && t.status !== SupportStatus.CLOSED);
  const unassigned = tickets.filter(t => !t.technicianName && t.status === SupportStatus.OPEN);

  const handleOpenWorkbench = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setDiagnosis(ticket.issueDescription);
    setEstimatedCost(ticket.estimatedCost || 0);
    setIsDrawerOpen(true);
  };

  const handleUpdateTicket = (nextStatus: SupportStatus) => {
    if (!selectedTicket) return;
    const label = nextStatus.replace('_', ' ');
    if (confirm(`Ubah status unit #${selectedTicket.id} menjadi ${label}? Update ini akan terkirim ke dashboard pelanggan secara real-time.`)) {
      SupportService.updateTicket(selectedTicket.id, { 
        status: nextStatus, 
        estimatedCost, 
        issueDescription: diagnosis 
      });
      setIsDrawerOpen(false);
      loadTickets();
      alert(`Unit ${selectedTicket.deviceModel} kini berstatus ${label}.`);
    }
  };

  const handlePickTicket = (id: string, model: string) => {
    if (confirm(`Ambil unit ${model} (Tiket #${id}) untuk Anda kerjakan? Unit akan muncul di Workbench Anda secara eksklusif.`)) {
      SupportService.updateTicket(id, { technicianName: technicianName, status: SupportStatus.CHECKING });
      alert("Unit berhasil diambil. Silakan cek Workbench Anda.");
      loadTickets();
      setActiveTab('my_tasks');
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Tugas Saya" value={myTasks.length} icon={<ICONS.Settings className="w-5 h-5" />} colorClass="indigo" />
        <StatCard label="Menunggu Diagnosa" value={myTasks.filter(t => t.status === SupportStatus.CHECKING).length} icon={<ICONS.Dashboard className="w-5 h-5" />} colorClass="amber" />
        <StatCard label="Antrean Toko" value={unassigned.length} icon={<ICONS.Ticket className="w-5 h-5" />} colorClass="slate" />
      </div>

      <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-lg">
        <button onClick={() => setActiveTab('my_tasks')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'my_tasks' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>Tugas Saya</button>
        <button onClick={() => setActiveTab('unassigned')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'unassigned' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>Antrean Toko ({unassigned.length})</button>
      </div>

      {activeTab === 'my_tasks' ? (
        <div className="grid grid-cols-1 gap-4">
          {myTasks.length === 0 ? (
            <div className="p-20 text-center glass-panel rounded-[2rem] border-slate-800 text-slate-600 italic">Workbench kosong. Ambil unit dari antrean toko.</div>
          ) : myTasks.map(t => (
            <div key={t.id} className="glass-panel p-8 rounded-[2.5rem] border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8 group hover:border-indigo-500/30 transition-all shadow-xl">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-indigo-600/10 text-indigo-400 rounded-2xl border border-indigo-500/20"><ICONS.Settings className="w-6 h-6" /></div>
                  <div>
                    <h4 className="text-xl font-bold text-white uppercase font-mono tracking-tighter">#{t.id} | {t.deviceModel}</h4>
                    <p className="text-xs text-slate-500 mt-1 italic leading-relaxed">"{t.issueDescription}"</p>
                    <div className="flex items-center gap-3 mt-4 text-[9px] font-black uppercase text-slate-600">
                       <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">Status: {t.status}</span>
                       <span className="text-emerald-400">Est. Cost: Rp {t.estimatedCost?.toLocaleString()}</span>
                    </div>
                  </div>
               </div>
               <button onClick={() => handleOpenWorkbench(t)} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth={2.5}/></svg>
                  Diagnosa & Update
               </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {unassigned.length === 0 ? (
             <div className="col-span-full p-20 text-center glass-panel rounded-[2rem] border-slate-800 text-slate-600 italic">Antrean unit masuk sedang kosong.</div>
           ) : unassigned.map(t => (
             <div key={t.id} className="glass-panel p-6 rounded-[2rem] border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col group shadow-xl">
                <div className="flex justify-between items-start mb-6">
                   <span className="text-[10px] font-mono font-bold text-slate-500 tracking-widest uppercase">Node Ticket #{t.id}</span>
                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                      t.priority === 'URGENT' ? 'bg-rose-600 text-white border-rose-500 animate-pulse' : 'bg-slate-800 text-slate-500 border-slate-700'
                   }`}>{t.priority}</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">{t.deviceModel}</h4>
                <p className="text-xs text-slate-500 italic mb-10 line-clamp-3">"{t.issueDescription}"</p>
                <button 
                  onClick={() => handlePickTicket(t.id, t.deviceModel)} 
                  className="mt-auto w-full py-4 bg-slate-900 border border-slate-800 hover:bg-emerald-600 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all"
                >
                   Ambil Unit Ini
                </button>
             </div>
           ))}
        </div>
      )}

      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Technical Workbench">
         {selectedTicket && (
           <div className="space-y-8 pb-10">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><ICONS.Ticket className="w-16 h-16" /></div>
                 <h3 className="text-xl font-bold text-white relative z-10">{selectedTicket.deviceModel}</h3>
                 <p className="text-xs text-slate-500 mt-2 font-medium relative z-10">Pelanggan: <span className="text-indigo-400">{selectedTicket.customerName}</span></p>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Catatan Diagnosa & Eksekusi</label>
                 <textarea rows={6} className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm italic" placeholder="Jelaskan hasil pengecekan atau komponen yang diganti..." value={diagnosis} onChange={e => setDiagnosis(e.target.value)}></textarea>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estimasi Biaya Final (IDR)</label>
                 <input type="number" className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white font-mono text-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={estimatedCost} onChange={e => setEstimatedCost(parseInt(e.target.value) || 0)} />
              </div>
              <div className="pt-8 border-t border-slate-800 flex flex-col gap-2">
                 <button onClick={() => handleUpdateTicket(SupportStatus.CHECKING)} className="py-4 bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-700 transition-all border border-slate-700">Masih Diagnosa</button>
                 <button onClick={() => handleUpdateTicket(SupportStatus.REPAIRING)} className="py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 shadow-xl transition-all">Mulai Perbaikan</button>
                 <button onClick={() => handleUpdateTicket(SupportStatus.RESOLVED)} className="py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 shadow-xl transition-all flex items-center justify-center gap-2">
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                   Tandai Selesai ✓
                 </button>
              </div>
           </div>
         )}
      </RightDrawer>
    </div>
  );
};

export default TechnicianTicketManager;
