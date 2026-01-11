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

  // Detail Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [completionDays, setCompletionDays] = useState(1);

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
    setDiagnosis(ticket.issueDescription); // Default to initial report
    setEstimatedCost(ticket.estimatedCost || 0);
    setIsDrawerOpen(true);
  };

  const handleUpdateTicket = (nextStatus: SupportStatus) => {
    if (!selectedTicket) return;

    const updates: Partial<SupportTicket> = {
      status: nextStatus,
      estimatedCost: estimatedCost,
      issueDescription: diagnosis, // Evolving description into diagnosis
      slaDeadline: new Date(Date.now() + (completionDays * 86400000)).toISOString()
    };

    SupportService.updateTicket(selectedTicket.id, updates);
    alert(`Unit #${selectedTicket.id} diperbarui ke status: ${nextStatus}`);
    setIsDrawerOpen(false);
    loadTickets();
  };

  const handlePickTicket = (id: string) => {
    SupportService.updateTicket(id, { 
      technicianName: technicianName, 
      status: SupportStatus.CHECKING 
    });
    alert("Tiket berhasil diambil. Silakan cek tab 'Tugas Saya'.");
    loadTickets();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Tugas Saya" value={myTasks.length} icon={<ICONS.Settings className="w-5 h-5" />} colorClass="indigo" />
        <StatCard label="Menunggu Diagnosa" value={myTasks.filter(t => t.status === SupportStatus.CHECKING).length} icon={<ICONS.Dashboard className="w-5 h-5" />} colorClass="amber" />
        <StatCard label="Antrean Global" value={unassigned.length} icon={<ICONS.Ticket className="w-5 h-5" />} colorClass="slate" />
      </div>

      <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-lg">
        <button 
          onClick={() => setActiveTab('my_tasks')}
          className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'my_tasks' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
        >
          Tugas Saya
        </button>
        <button 
          onClick={() => setActiveTab('unassigned')}
          className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'unassigned' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
        >
          Antrean Toko ({unassigned.length})
        </button>
      </div>

      {activeTab === 'my_tasks' ? (
        <div className="grid grid-cols-1 gap-4">
          {myTasks.length === 0 ? (
            <div className="p-20 text-center glass-panel rounded-[2rem] border-slate-800 text-slate-600 italic">Anda tidak memiliki tugas aktif.</div>
          ) : myTasks.map(t => (
            <div key={t.id} className="glass-panel p-8 rounded-[2.5rem] border-slate-800 flex flex-col lg:flex-row items-start lg:items-center gap-8 group hover:border-indigo-500/30 transition-all">
               <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${
                 t.status === SupportStatus.CHECKING ? 'bg-amber-500/10 text-amber-500' :
                 t.status === SupportStatus.REPAIRING ? 'bg-indigo-500/10 text-indigo-400' :
                 'bg-emerald-500/10 text-emerald-400'
               }`}>
                  <ICONS.Settings className={`w-8 h-8 ${t.status === SupportStatus.REPAIRING ? 'animate-spin-slow' : ''}`} />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="text-[10px] font-mono font-bold text-indigo-400 bg-slate-950 px-2 py-0.5 rounded">#{t.id}</span>
                     <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{t.deviceModel}</h4>
                     <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${t.priority === 'URGENT' ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-500'}`}>{t.priority}</span>
                  </div>
                  <p className="text-sm text-slate-400 italic">"{t.issueDescription}"</p>
                  <div className="mt-4 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
                     <span>Client: {t.customerName}</span>
                     <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                     <span className={new Date(t.slaDeadline) < new Date() ? 'text-rose-500' : 'text-slate-600'}>Deadline: {new Date(t.slaDeadline).toLocaleDateString()}</span>
                  </div>
               </div>
               <div className="flex flex-col gap-2 w-full lg:w-auto">
                  <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-center">
                     <p className="text-[8px] text-slate-500 uppercase font-black">Status Saat Ini</p>
                     <p className="text-[10px] text-indigo-400 font-bold uppercase mt-0.5">{t.status.replace('_', ' ')}</p>
                  </div>
                  <button 
                    onClick={() => handleOpenWorkbench(t)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                  >
                    Diagnosa & Update
                  </button>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {unassigned.map(t => (
             <div key={t.id} className="glass-panel p-6 rounded-[2rem] border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-6">
                   <span className="text-[10px] font-mono text-slate-500">#{t.id}</span>
                   <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-500 text-[8px] font-black rounded uppercase tracking-widest">{t.priority}</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{t.deviceModel}</h4>
                <p className="text-xs text-slate-500 italic mb-8 line-clamp-2">"{t.issueDescription}"</p>
                <button 
                  onClick={() => handlePickTicket(t.id)}
                  className="mt-auto w-full py-4 bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all"
                >
                   Ambil Unit Ini
                </button>
             </div>
           ))}
        </div>
      )}

      {/* Technical Workbench Drawer */}
      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Technical Workbench">
         {selectedTicket && (
           <div className="space-y-8">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Unit Detail</p>
                 <h3 className="text-xl font-bold text-white">{selectedTicket.deviceModel}</h3>
                 <p className="text-xs text-slate-500 mt-2">ID Pelanggan: <span className="text-white">{selectedTicket.customerName}</span></p>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hasil Diagnosa & Catatan Teknis</label>
                 <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Tulis kerusakan spesifik dan part yang perlu diganti..."
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                 ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estimasi Biaya (IDR)</label>
                    <input 
                       type="number" 
                       className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none"
                       value={estimatedCost}
                       onChange={e => setEstimatedCost(parseInt(e.target.value))}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Waktu Pengerjaan (Hari)</label>
                    <select 
                       className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none"
                       value={completionDays}
                       onChange={e => setCompletionDays(parseInt(e.target.value))}
                    >
                       <option value={1}>1 Hari</option>
                       <option value={3}>3 Hari</option>
                       <option value={7}>1 Minggu</option>
                       <option value={14}>2 Minggu</option>
                    </select>
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-800">
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Aksi Perubahan Status</h4>
                 <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => handleUpdateTicket(SupportStatus.CHECKING)}
                      className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-700"
                    >
                      Masih Dalam Pengecekan
                    </button>
                    <button 
                      onClick={() => handleUpdateTicket(SupportStatus.REPAIRING)}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20"
                    >
                      Eksekusi Perbaikan (Repairing)
                    </button>
                    <button 
                      onClick={() => handleUpdateTicket(SupportStatus.RESOLVED)}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-600/20"
                    >
                      Selesai ✓ (Pindah ke Kasir)
                    </button>
                 </div>
              </div>
           </div>
         )}
      </RightDrawer>
    </div>
  );
};

export default TechnicianTicketManager;