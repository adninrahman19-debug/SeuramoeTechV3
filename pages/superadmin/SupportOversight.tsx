import React, { useState, useEffect } from 'react';
import SupportService from '../../services/SupportService';
import StoreService from '../../services/StoreService';
import { SupportTicket, WarrantyClaim, CustomerComplaint, SupportStatus, WarrantyStatus } from '../../types';
import { ICONS } from '../../constants';
import StatCard from '../../components/Shared/StatCard';

const SupportOversight: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'warranty' | 'complaints'>('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [warranties, setWarranties] = useState<WarrantyClaim[]>([]);
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTickets(SupportService.getTickets());
    setWarranties(SupportService.getWarranties());
    setComplaints(SupportService.getComplaints());
  };

  const handleEscalate = (id: string) => {
    SupportService.escalateTicket(id);
    loadData();
    alert("Ticket has been escalated to platform priority.");
  };

  const handleReassign = (id: string) => {
    const techName = prompt("Enter Name of Superior Technician:");
    if (techName) {
      SupportService.reassignTechnician(id, techName);
      loadData();
    }
  };

  const handlePenalty = (storeId: string) => {
    if (confirm("Issue a formal warning & performance penalty to this store?")) {
      StoreService.addViolation(storeId);
      alert("Penalty issued. Store performance score adjusted.");
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white">Platform Support & Claims</h2>
          <p className="text-sm text-slate-500">Monitor ecosystem health through service quality and warranty compliance.</p>
        </div>
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
           {(['tickets', 'warranty', 'complaints'] as const).map(t => (
             <button
               key={t}
               onClick={() => setActiveTab(t)}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
             >
               {t}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Overdue Tickets" value={tickets.filter(t => new Date(t.slaDeadline) < new Date()).length} trend="+2" icon={<ICONS.Ticket />} colorClass="rose" />
        <StatCard label="Suspicious Claims" value={warranties.filter(w => w.abuseRiskScore > 70).length} icon={<ICONS.Settings />} colorClass="amber" />
        <StatCard label="Critical Complaints" value={complaints.filter(c => c.severity === 'CRITICAL' && !c.isResolved).length} icon={<ICONS.Users />} colorClass="rose" />
        <StatCard label="Avg SLA Score" value="92%" icon={<ICONS.Dashboard />} colorClass="emerald" />
      </div>

      {activeTab === 'tickets' && (
        <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                    <th className="px-6 py-5">Ticket Info</th>
                    <th className="px-6 py-5">Store & Device</th>
                    <th className="px-6 py-5">SLA / Priority</th>
                    <th className="px-6 py-5 text-right">Oversight Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                 {tickets.map(t => (
                    <tr key={t.id} className="hover:bg-slate-800/20 transition-all">
                       <td className="px-6 py-4">
                          <p className="text-sm font-bold text-white">{t.id}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{t.customerName}</p>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-xs font-bold text-white">{t.deviceModel}</p>
                          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{t.storeName}</p>
                       </td>
                       <td className="px-6 py-4">
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                   t.priority === 'URGENT' ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                                }`}>{t.priority}</span>
                                <span className="text-[10px] text-white font-black uppercase">{t.status}</span>
                             </div>
                             <p className={`text-[9px] font-bold ${new Date(t.slaDeadline) < new Date() ? 'text-rose-500' : 'text-slate-500'}`}>
                                Deadline: {new Date(t.slaDeadline).toLocaleString()}
                             </p>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => handleEscalate(t.id)} className="p-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-all" title="Force Escalate">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                             </button>
                             <button onClick={() => handleReassign(t.id)} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all" title="Override Assignment">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'warranty' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {warranties.map(w => (
             <div key={w.id} className={`glass-panel p-6 rounded-3xl border-slate-800 relative overflow-hidden group ${w.abuseRiskScore > 70 ? 'border-rose-500/50' : ''}`}>
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h3 className="text-lg font-bold text-white">Claim #{w.id}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{w.imei}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Abuse Risk</p>
                      <span className={`text-xl font-black ${w.abuseRiskScore > 70 ? 'text-rose-500' : 'text-emerald-400'}`}>{w.abuseRiskScore}%</span>
                   </div>
                </div>
                <div className="space-y-4 mb-8">
                   <div className="p-3 bg-slate-950/50 rounded-2xl border border-slate-800">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Claim Reason</p>
                      <p className="text-xs text-slate-300 italic">"{w.claimReason}"</p>
                   </div>
                   <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500 font-bold uppercase">Store</span>
                      <span className="text-white font-black">{w.storeName}</span>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <button 
                     onClick={() => { SupportService.updateWarrantyStatus(w.id, WarrantyStatus.APPROVED); loadData(); }}
                     className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                   >
                     Approve Claim
                   </button>
                   <button 
                     onClick={() => { SupportService.updateWarrantyStatus(w.id, WarrantyStatus.REJECTED); loadData(); }}
                     className="py-2.5 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-700 hover:border-rose-500"
                   >
                     Reject / Fraud
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="space-y-6">
           {complaints.map(c => (
             <div key={c.id} className="glass-panel p-8 rounded-3xl border-slate-800 flex flex-col md:flex-row items-start md:items-center gap-8 group">
                <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${
                   c.severity === 'CRITICAL' ? 'bg-rose-600/10 text-rose-500 border border-rose-500/20 animate-pulse' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                }`}>
                   <ICONS.Ticket className="w-8 h-8" />
                </div>
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-white">{c.subject}</h4>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-500 text-[9px] font-black rounded uppercase tracking-widest border border-slate-700">{c.severity}</span>
                   </div>
                   <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">"{c.message}"</p>
                   <div className="mt-4 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <span className="text-indigo-400">{c.storeName}</span>
                      <span>•</span>
                      <span>By {c.customerName}</span>
                   </div>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                   {/* Fix: SupportService.resolveComplaint expects 2 arguments (id, response). Added a prompt to collect resolution text. */}
                   <button onClick={() => {
                      const resolution = prompt("Enter resolution message for this complaint:");
                      if (resolution) {
                        SupportService.resolveComplaint(c.id, resolution);
                        loadData();
                      }
                   }} className="px-6 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all">Resolve & Close</button>
                   <button onClick={() => handlePenalty(c.storeId)} className="px-6 py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white transition-all">Store Penalty</button>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default SupportOversight;