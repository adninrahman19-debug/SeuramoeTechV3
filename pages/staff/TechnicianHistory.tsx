import React, { useState, useEffect } from 'react';
import SupportService from '../../services/SupportService.ts';
import AuthService from '../../auth/AuthService.ts';
import { SupportTicket, SupportStatus } from '../../types.ts';
import { ICONS } from '../../constants.tsx';
import RightDrawer from '../../components/Shared/RightDrawer.tsx';

const TechnicianHistory: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const storeId = user?.storeId || 's1';
  const technicianName = user?.fullName || '';

  const [history, setHistory] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const all = SupportService.getTickets(storeId);
    // Filter unit yang sudah selesai dan pernah dipegang teknisi ini
    setHistory(all.filter(t => 
      t.technicianName === technicianName && 
      [SupportStatus.RESOLVED, SupportStatus.CLOSED].includes(t.status)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [storeId, technicianName]);

  const filteredHistory = history.filter(h => 
    h.deviceModel.toLowerCase().includes(search.toLowerCase()) || 
    h.customerName.toLowerCase().includes(search.toLowerCase()) ||
    h.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDetail = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
           <h3 className="text-2xl font-black text-white tracking-tight">Arsip Pengerjaan Teknisi</h3>
           <p className="text-sm text-slate-500 font-medium mt-1">Log profesional seluruh unit yang telah Anda selesaikan.</p>
        </div>
        <div className="relative w-full md:w-80">
           <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
           <input 
             type="text" 
             placeholder="Cari ID, Unit, atau Pelanggan..." 
             className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] border-slate-800 overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                     <th className="px-8 py-5">Tgl Selesai / ID</th>
                     <th className="px-8 py-5">Unit Perangkat</th>
                     <th className="px-8 py-5">Pelanggan</th>
                     <th className="px-8 py-5">Biaya Akhir</th>
                     <th className="px-8 py-5 text-right">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                  {filteredHistory.length === 0 ? (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-600 italic">Belum ada riwayat pengerjaan yang tersimpan.</td></tr>
                  ) : filteredHistory.map(h => (
                    <tr key={h.id} className="hover:bg-slate-800/20 group transition-all">
                       <td className="px-8 py-4">
                          <p className="text-xs font-bold text-white">{new Date(h.createdAt).toLocaleDateString()}</p>
                          <p className="text-[9px] text-indigo-500 font-mono mt-0.5">#{h.id}</p>
                       </td>
                       <td className="px-8 py-4">
                          <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{h.deviceModel}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                             <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                             <span className="text-[9px] text-slate-500 font-black uppercase">COMPLETED</span>
                          </div>
                       </td>
                       <td className="px-8 py-4">
                          <p className="text-xs font-bold text-slate-300">{h.customerName}</p>
                       </td>
                       <td className="px-8 py-4">
                          <p className="text-sm font-black text-white">Rp {h.actualCost?.toLocaleString() || h.estimatedCost?.toLocaleString() || '0'}</p>
                       </td>
                       <td className="px-8 py-4 text-right">
                          <button 
                            onClick={() => handleOpenDetail(h)}
                            className="px-4 py-2 bg-slate-900 border border-slate-800 text-[9px] font-black text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 rounded-xl transition-all"
                          >
                             Lihat Log Penuh
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Forensic History Detail Drawer */}
      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Detail Forensic Servis">
         {selectedTicket && (
           <div className="space-y-8 pb-10">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{selectedTicket.deviceModel}</h3>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded uppercase border border-emerald-500/20">RESOLVED</span>
                 </div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID Log: {selectedTicket.id}</p>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2">Data Pelanggan</h4>
                 <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <p className="text-sm font-bold text-white">{selectedTicket.customerName}</p>
                    <p className="text-xs text-slate-500 mt-1 italic">Kontak terenkripsi untuk keamanan data.</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2">Dokumentasi Visual</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <p className="text-[8px] text-slate-600 font-black uppercase text-center">Sebelum Servis</p>
                       <div className="aspect-square rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative group">
                          {selectedTicket.beforeImage ? (
                            <img src={selectedTicket.beforeImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-800"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg></div>
                          )}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[8px] text-slate-600 font-black uppercase text-center">Sesudah Servis</p>
                       <div className="aspect-square rounded-2xl bg-slate-950 border border-emerald-500/20 overflow-hidden relative group">
                          {selectedTicket.afterImage ? (
                            <img src={selectedTicket.afterImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-800"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg></div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2">Catatan Teknis & Forensic</h4>
                 <div className="p-5 bg-slate-950 border border-slate-800 rounded-3xl">
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                       {selectedTicket.technicalNotes || "Tidak ada catatan teknis khusus yang ditinggalkan untuk pengerjaan ini."}
                    </p>
                    <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-800/50">
                       <span className="text-[9px] font-black text-slate-600 uppercase">Total Revenue Generated</span>
                       <span className="text-sm font-black text-emerald-400">Rp {selectedTicket.actualCost?.toLocaleString() || selectedTicket.estimatedCost?.toLocaleString()}</span>
                    </div>
                 </div>
              </div>

              <div className="pt-6 grid grid-cols-1 gap-2">
                 <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeWidth={2}/></svg>
                    Cetak Log Perbaikan
                 </button>
                 <button onClick={() => setIsDrawerOpen(false)} className="w-full py-4 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Tutup Detail</button>
              </div>
           </div>
         )}
      </RightDrawer>
    </div>
  );
};

export default TechnicianHistory;