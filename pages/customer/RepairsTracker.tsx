import React, { useState, useEffect } from 'react';
import SupportService from '../../services/SupportService';
import { SupportTicket, SupportStatus } from '../../types';
import Stepper from '../../components/Shared/Stepper';
import { ICONS } from '../../constants';

const RepairsTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    const data = SupportService.getTickets().filter(t => t.customerName === 'Ali Akbar');
    setTickets(data);
  }, []);

  const activeTickets = tickets.filter(t => t.status !== SupportStatus.CLOSED && t.status !== SupportStatus.RESOLVED);
  const historyTickets = tickets.filter(t => t.status === SupportStatus.CLOSED || t.status === SupportStatus.RESOLVED);

  const getStepIndex = (status: SupportStatus) => {
    switch (status) {
      case SupportStatus.OPEN: return 0;
      case SupportStatus.CHECKING: return 1;
      case SupportStatus.REPAIRING: 
      case SupportStatus.IN_PROGRESS: return 2;
      case SupportStatus.RESOLVED: return 3;
      default: return 0;
    }
  };

  const steps = [
    { label: 'Intake', description: 'Unit diterima' },
    { label: 'Analisis', description: 'Cek kerusakan' },
    { label: 'Pengerjaan', description: 'Proses reparasi' },
    { label: 'Ready', description: 'Unit siap diambil' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-xl">
         <button onClick={() => setActiveTab('active')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Sedang Berjalan ({activeTickets.length})</button>
         <button onClick={() => setActiveTab('history')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Riwayat Servis ({historyTickets.length})</button>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {activeTab === 'active' ? (
           activeTickets.length === 0 ? (
             <div className="p-20 text-center glass-panel rounded-[3rem] border-slate-800 flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 text-slate-700">
                   <ICONS.Ticket className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Tidak Ada Servis Aktif</h3>
                <p className="text-slate-500 text-sm max-w-xs">Unit teknologi Anda dalam kondisi prima.</p>
             </div>
           ) : activeTickets.map(ticket => (
             <div key={ticket.id} className="glass-panel p-8 rounded-[3rem] border-slate-800 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                
                <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                   <div className="space-y-6 flex-1">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <ICONS.Settings className={`w-8 h-8 ${ticket.status === SupportStatus.REPAIRING ? 'animate-spin-slow' : ''}`} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Service Node #{ticket.id}</p>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none group-hover:text-indigo-400 transition-colors">{ticket.deviceModel}</h3>
                         </div>
                      </div>

                      <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-3xl">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Diagnosis Awal</p>
                         <p className="text-sm text-slate-300 italic leading-relaxed">"{ticket.issueDescription}"</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0 border border-slate-700 shadow-lg">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.technicianName || 'Admin'}`} alt="" />
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-slate-500 uppercase mb-0.5">Teknisi Penangan</p>
                               <p className="text-xs font-bold text-white uppercase tracking-tight">{ticket.technicianName || 'Menunggu Penugasan'}</p>
                            </div>
                         </div>
                         <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Estimasi Selesai</p>
                            <p className="text-sm font-bold text-indigo-400">{new Date(ticket.slaDeadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col justify-center items-center p-8 bg-indigo-600/5 rounded-[2.5rem] border border-indigo-500/10 min-w-[320px]">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Repair Progress</h4>
                      <Stepper steps={steps} currentStep={getStepIndex(ticket.status)} />
                      <div className="mt-8 pt-8 border-t border-slate-800/50 w-full text-center">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Biaya Saat Ini</p>
                         <p className="text-2xl font-black text-emerald-400 mt-1">Rp {ticket.estimatedCost?.toLocaleString() || '0'}</p>
                      </div>
                   </div>
                </div>
             </div>
           ))
         ) : (
           historyTickets.length === 0 ? (
             <div className="py-20 text-center text-slate-600 italic">Belum ada riwayat servis yang tercatat.</div>
           ) : historyTickets.map(ticket => (
             <div key={ticket.id} className="glass-panel p-6 rounded-3xl border-slate-800 flex items-center justify-between group hover:border-indigo-500/20 transition-all opacity-70 hover:opacity-100">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400">
                      <ICONS.Ticket className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-white">{ticket.deviceModel}</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Selesai: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-sm font-black text-white">Rp {ticket.actualCost?.toLocaleString() || ticket.estimatedCost?.toLocaleString()}</p>
                   <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1 hover:text-white transition-colors">Lihat Detail Laporan</button>
                </div>
             </div>
           ))
         )}
      </div>
    </div>
  );
};

export default RepairsTracker;