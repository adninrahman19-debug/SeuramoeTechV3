
import React, { useState, useEffect } from 'react';
import SupportService from '../../services/SupportService';
import { SupportTicket, SupportStatus, WarrantyRegistration } from '../../types';
import { ICONS } from '../../constants';
import RightDrawer from '../../components/Shared/RightDrawer';

const ServiceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'warranty'>('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [registrations, setRegistrations] = useState<WarrantyRegistration[]>([]);
  const [filter, setFilter] = useState<SupportStatus | 'ALL'>('ALL');
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create_ticket' | 'edit_ticket' | 'register_warranty'>('create_ticket');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Form States
  const [ticketForm, setTicketForm] = useState<Partial<SupportTicket>>({});
  const [warrantyForm, setWarrantyForm] = useState<Partial<WarrantyRegistration>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTickets(SupportService.getTickets('s1'));
    setRegistrations(SupportService.getWarrantyRegistrations('s1'));
  };

  const handleOpenCreateTicket = () => {
    setTicketForm({
      storeId: 's1',
      storeName: 'Aceh Tech Center',
      status: SupportStatus.OPEN,
      priority: 'MEDIUM',
      slaDeadline: new Date(Date.now() + 259200000).toISOString(), // 3 days
    });
    setDrawerMode('create_ticket');
    setIsDrawerOpen(true);
  };

  const handleOpenRegisterWarranty = () => {
    setWarrantyForm({
      storeId: 's1',
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 31536000000).toISOString().split('T')[0], // 1 year
      isActive: true
    });
    setDrawerMode('register_warranty');
    setIsDrawerOpen(true);
  };

  const handleOpenEditTicket = (t: SupportTicket) => {
    setSelectedTicket(t);
    setTicketForm({ ...t });
    setDrawerMode('edit_ticket');
    setIsDrawerOpen(true);
  };

  const saveTicket = () => {
    if (confirm("Simpan perubahan tiket servis ini? Data teknisi dan status akan segera diperbarui.")) {
      if (drawerMode === 'create_ticket') {
        SupportService.createTicket(ticketForm as SupportTicket);
      } else if (selectedTicket) {
        SupportService.updateTicket(selectedTicket.id, ticketForm);
      }
      setIsDrawerOpen(false);
      loadData();
    }
  };

  const saveWarranty = () => {
    if (confirm("Daftarkan unit ke sistem garansi regional? IMEI akan diverifikasi otomatis oleh node Sumatra.")) {
      SupportService.registerWarranty(warrantyForm as WarrantyRegistration);
      setIsDrawerOpen(false);
      loadData();
    }
  };

  const filteredTickets = filter === 'ALL' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <RightDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title={drawerMode === 'create_ticket' ? "New Service Intake" : drawerMode === 'edit_ticket' ? "Update Ticket" : "Warranty Registration"}
      >
        {(drawerMode === 'create_ticket' || drawerMode === 'edit_ticket') && (
          <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer Identity</label>
               <input 
                 type="text" 
                 placeholder="Full Name"
                 className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                 value={ticketForm.customerName || ''}
                 onChange={e => setTicketForm({...ticketForm, customerName: e.target.value})}
               />
               <input 
                 type="text" 
                 placeholder="Phone Number"
                 className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                 value={ticketForm.customerPhone || ''}
                 onChange={e => setTicketForm({...ticketForm, customerPhone: e.target.value})}
               />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hardware Context</label>
               <input 
                 type="text" 
                 placeholder="Device Model (e.g. MacBook Pro M1)"
                 className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                 value={ticketForm.deviceModel || ''}
                 onChange={e => setTicketForm({...ticketForm, deviceModel: e.target.value})}
               />
               <textarea 
                 placeholder="Describe the issue in detail..."
                 rows={3}
                 className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                 value={ticketForm.issueDescription || ''}
                 onChange={e => setTicketForm({...ticketForm, issueDescription: e.target.value})}
               ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status Flow</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none"
                    value={ticketForm.status}
                    onChange={e => setTicketForm({...ticketForm, status: e.target.value as SupportStatus})}
                  >
                     {Object.values(SupportStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Assign Technician</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none"
                    value={ticketForm.technicianName || ''}
                    onChange={e => setTicketForm({...ticketForm, technicianName: e.target.value})}
                  >
                     <option value="">Unassigned</option>
                     <option value="Budi Santoso">Budi Santoso</option>
                     <option value="Agus Pratama">Agus Pratama</option>
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Est. Cost (IDR)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                    value={ticketForm.estimatedCost || 0}
                    onChange={e => setTicketForm({...ticketForm, estimatedCost: parseInt(e.target.value)})}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Priority</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none"
                    value={ticketForm.priority}
                    onChange={e => setTicketForm({...ticketForm, priority: e.target.value as any})}
                  >
                     <option value="LOW">Low</option>
                     <option value="MEDIUM">Medium</option>
                     <option value="HIGH">High</option>
                     <option value="URGENT">Urgent</option>
                  </select>
               </div>
            </div>

            <button 
              onClick={saveTicket}
              className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
            >
              Commit Ticket Changes
            </button>
          </div>
        )}

        {drawerMode === 'register_warranty' && (
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Product & Serial</label>
                <input 
                  type="text" 
                  placeholder="Product Name"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                  value={warrantyForm.productName || ''}
                  onChange={e => setWarrantyForm({...warrantyForm, productName: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="IMEI / Serial Number"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                  value={warrantyForm.serialNumber || ''}
                  onChange={e => setWarrantyForm({...warrantyForm, serialNumber: e.target.value})}
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer</label>
                <input 
                  type="text" 
                  placeholder="Customer Name"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                  value={warrantyForm.customerName || ''}
                  onChange={e => setWarrantyForm({...warrantyForm, customerName: e.target.value})}
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Purchase Date</label>
                   <input 
                     type="date" 
                     className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                     value={warrantyForm.purchaseDate}
                     onChange={e => setWarrantyForm({...warrantyForm, purchaseDate: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expiry Date</label>
                   <input 
                     type="date" 
                     className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                     value={warrantyForm.expiryDate}
                     onChange={e => setWarrantyForm({...warrantyForm, expiryDate: e.target.value})}
                   />
                </div>
             </div>
             <button 
              onClick={saveWarranty}
              className="w-full py-4 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20"
            >
              Register Warranty Node
            </button>
          </div>
        )}
      </RightDrawer>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
           {(['tickets', 'warranty'] as const).map(t => (
             <button
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
             >
               {t}
             </button>
           ))}
        </div>
        <div className="flex gap-2">
           {activeTab === 'tickets' ? (
             <button 
               onClick={handleOpenCreateTicket}
               className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
             >
                <ICONS.Plus className="w-4 h-4" /> New Ticket
             </button>
           ) : (
             <button 
               onClick={handleOpenRegisterWarranty}
               className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2"
             >
                <ICONS.Plus className="w-4 h-4" /> Add Warranty
             </button>
           )}
        </div>
      </div>

      {activeTab === 'tickets' ? (
        <div className="space-y-6">
           <div className="flex flex-wrap gap-2">
              {(['ALL', ...Object.values(SupportStatus)] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase border transition-all ${filter === s ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white'}`}
                >
                  {s}
                </button>
              ))}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map(ticket => (
                <div key={ticket.id} className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col group relative overflow-hidden">
                   <div className="flex justify-between items-start mb-6">
                      <div className="p-2 bg-slate-900 rounded-lg text-indigo-400 font-mono text-xs">#{ticket.id}</div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                         ticket.status === SupportStatus.RESOLVED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                         ticket.status === SupportStatus.ESCALATED ? 'bg-rose-500 text-white border-rose-400 shadow-lg' :
                         ticket.status === SupportStatus.REPAIRING ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                         'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>{ticket.status}</span>
                   </div>

                   <div className="flex-1 space-y-4 mb-8">
                      <div>
                         <h3 className="text-lg font-bold text-white leading-tight">{ticket.deviceModel}</h3>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Client: {ticket.customerName}</p>
                      </div>
                      <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                         <p className="text-xs text-slate-400 italic">"{ticket.issueDescription}"</p>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-indigo-400 uppercase">Est. Cost</span>
                         <span className="text-sm font-black text-white">Rp {ticket.estimatedCost?.toLocaleString() || 0}</span>
                      </div>
                   </div>

                   <div className="space-y-3 pt-6 border-t border-slate-800/50">
                      <div className="flex justify-between items-center text-[10px]">
                         <span className="text-slate-500 font-bold uppercase">Technician</span>
                         <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-slate-800 overflow-hidden">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.technicianName || 'T'}`} alt="" />
                            </div>
                            <span className="text-white font-black">{ticket.technicianName || 'UNASSIGNED'}</span>
                         </div>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                         <span className="text-slate-500 font-bold uppercase">Next Review</span>
                         <span className={`font-black ${new Date(ticket.slaDeadline) < new Date() ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
                            {new Date(ticket.slaDeadline).toLocaleDateString()}
                         </span>
                      </div>
                   </div>

                   <div className="mt-8 grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all">Audit Logs</button>
                      <button onClick={() => handleOpenEditTicket(ticket)} className="py-2.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all">Quick Update</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="space-y-6">
           <div className="relative w-full max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
              <input type="text" placeholder="Search Serial Number, IMEI, or Customer..." className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
           </div>

           <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                          <th className="px-6 py-5">Node Identity</th>
                          <th className="px-6 py-5">Owner Context</th>
                          <th className="px-6 py-5">Serial Hash</th>
                          <th className="px-6 py-5">Lifecycle</th>
                          <th className="px-6 py-5 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                       {registrations.map(reg => (
                          <tr key={reg.id} className="hover:bg-slate-800/20 group transition-all">
                             <td className="px-6 py-4">
                                <p className="text-sm font-black text-white">{reg.productName}</p>
                                <p className="text-[10px] text-slate-600 font-mono">UID: {reg.id}</p>
                             </td>
                             <td className="px-6 py-4">
                                <p className="text-xs font-bold text-white">{reg.customerName}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black">{reg.customerPhone}</p>
                             </td>
                             <td className="px-6 py-4">
                                <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg text-xs font-mono text-indigo-400">{reg.serialNumber}</span>
                             </td>
                             <td className="px-6 py-4">
                                <div className="space-y-1">
                                   <div className="flex items-center gap-2">
                                      <span className={`w-1.5 h-1.5 rounded-full ${new Date(reg.expiryDate) > new Date() ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                      <span className="text-[10px] font-black text-white uppercase">{new Date(reg.expiryDate) > new Date() ? 'VALID' : 'EXPIRED'}</span>
                                   </div>
                                   <p className="text-[9px] text-slate-500 font-bold">Expires: {reg.expiryDate}</p>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button className="p-2.5 bg-slate-800 text-slate-500 hover:text-indigo-400 rounded-xl transition-all">
                                   <ICONS.Settings className="w-5 h-5" />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              {registrations.length === 0 && (
                <div className="p-20 text-center text-slate-600 italic">No warranty nodes registered in this regional storage.</div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default ServiceHub;
