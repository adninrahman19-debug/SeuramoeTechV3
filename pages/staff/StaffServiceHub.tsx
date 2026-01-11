
import React, { useState, useEffect } from 'react';
import SupportService from '../../services/SupportService.ts';
import StaffService from '../../services/StaffService.ts';
import AuthService from '../../auth/AuthService.ts';
import { SupportTicket, SupportStatus, User, UserRole } from '../../types.ts';
import { ICONS } from '../../constants.tsx';
import RightDrawer from '../../components/Shared/RightDrawer.tsx';
import StatCard from '../../components/Shared/StatCard.tsx';

const StaffServiceHub: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [filter, setFilter] = useState<SupportStatus | 'ALL'>('ALL');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const [formData, setFormData] = useState<Partial<SupportTicket>>({});

  const user = AuthService.getCurrentUser();
  const storeId = user?.storeId || 's1';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTickets(SupportService.getTickets(storeId));
    setTechnicians(StaffService.getStoreStaff(storeId).filter(s => s.role === UserRole.TECHNICIAN));
  };

  const handleOpenCreate = () => {
    setFormData({ storeId, storeName: 'Aceh Tech Center', status: SupportStatus.OPEN, priority: 'MEDIUM', slaDeadline: new Date(Date.now() + 172800000).toISOString() });
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setFormData({ ...ticket });
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (!formData.customerName || !formData.deviceModel || !formData.issueDescription) {
      alert("Harap lengkapi identitas pelanggan dan unit perangkat.");
      return;
    }

    const action = drawerMode === 'create' ? "MEMBUKA TIKET BARU" : "MEMPERBARUI TIKET";
    if (confirm(`Konfirmasi untuk ${action} unit ${formData.deviceModel}?`)) {
      if (drawerMode === 'create') {
        SupportService.createTicket(formData as SupportTicket);
      } else if (selectedTicket) {
        SupportService.updateTicket(selectedTicket.id, formData);
      }
      setIsDrawerOpen(false);
      loadData();
      alert("Data berhasil disimpan ke node regional.");
    }
  };

  const filteredTickets = filter === 'ALL' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Tiket Aktif" value={tickets.filter(t => t.status !== SupportStatus.CLOSED).length} icon={<ICONS.Ticket />} colorClass="indigo" />
        <StatCard label="Butuh Teknisi" value={tickets.filter(t => !t.technicianName).length} icon={<ICONS.Users />} colorClass="amber" />
        <StatCard label="Dalam Perbaikan" value={tickets.filter(t => t.status === SupportStatus.REPAIRING).length} icon={<ICONS.Settings />} colorClass="blue" />
        <StatCard label="Siap Diambil" value={tickets.filter(t => t.status === SupportStatus.RESOLVED).length} icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={2}/></svg>} colorClass="emerald" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit overflow-x-auto max-w-full">
           <button onClick={() => setFilter('ALL')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Semua Tiket</button>
           {Object.values(SupportStatus).slice(0, 5).map(status => (
             <button key={status} onClick={() => setFilter(status)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === status ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{status.replace('_', ' ')}</button>
           ))}
        </div>
        <button onClick={handleOpenCreate} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3">
          <ICONS.Plus className="w-5 h-5" /> Terima Unit Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredTickets.length === 0 ? (
           <div className="col-span-full py-20 text-center glass-panel rounded-[2.5rem] border-slate-800 text-slate-500 italic">Antrean kosong.</div>
         ) : filteredTickets.map(ticket => (
           <div key={ticket.id} className="glass-panel p-8 rounded-[2.5rem] border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                 <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-indigo-400 font-mono text-xs font-bold">#{ticket.id}</div>
                 <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${ticket.status === SupportStatus.RESOLVED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-900 text-slate-500 border-slate-700'}`}>{ticket.status}</span>
              </div>
              <div className="mb-8">
                 <h4 className="text-xl font-black text-white tracking-tight">{ticket.deviceModel}</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Pemilik: {ticket.customerName}</p>
              </div>
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl mb-8 flex-1">
                 <p className="text-xs text-slate-400 leading-relaxed italic line-clamp-3">"{ticket.issueDescription}"</p>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-slate-600">Teknisi PJ</span>
                    <span className={ticket.technicianName ? 'text-white' : 'text-rose-500 animate-pulse'}>{ticket.technicianName || 'BELUM DITUNJUK'}</span>
                 </div>
                 <button onClick={() => handleOpenEdit(ticket)} className="w-full py-4 bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-white group-hover:bg-indigo-600 group-hover:border-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">Kelola Koordinasi</button>
              </div>
           </div>
         ))}
      </div>

      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerMode === 'create' ? 'Input Servis Baru' : 'Koordinasi Tiket'}>
        <div className="space-y-8 pb-10">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b border-slate-800 pb-2">Identitas</h4>
              <input type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" placeholder="Nama Pelanggan" value={formData.customerName || ''} onChange={e => setFormData({...formData, customerName: e.target.value})} />
              <input type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" placeholder="Model Unit" value={formData.deviceModel || ''} onChange={e => setFormData({...formData, deviceModel: e.target.value})} />
              <textarea rows={3} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" placeholder="Keluhan..." value={formData.issueDescription || ''} onChange={e => setFormData({...formData, issueDescription: e.target.value})}></textarea>
           </div>
           <div className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-2">Penugasan</h4>
              <select className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white appearance-none" value={formData.technicianName || ''} onChange={e => setFormData({...formData, technicianName: e.target.value})}>
                 <option value="">-- Belum Ditunjuk --</option>
                 {technicians.map(tech => <option key={tech.id} value={tech.fullName}>{tech.fullName}</option>)}
              </select>
              <select className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white appearance-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as SupportStatus})}>
                 {Object.values(SupportStatus).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
           </div>
           <div className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-2">Estimasi Biaya</h4>
              <input type="number" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-lg" placeholder="0" value={formData.estimatedCost || 0} onChange={e => setFormData({...formData, estimatedCost: parseInt(e.target.value)})} />
           </div>
           <button onClick={handleSave} className="w-full py-5 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-indigo-500 shadow-2xl transition-all">Simpan Tiket</button>
        </div>
      </RightDrawer>
    </div>
  );
};

export default StaffServiceHub;
