import React, { useState, useEffect } from 'react';
import SupportService from '../../services/SupportService.ts';
import AuthService from '../../auth/AuthService.ts';
import { SupportTicket, SupportStatus } from '../../types.ts';
import { ICONS } from '../../constants.tsx';

const TechnicianTools: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const storeId = user?.storeId || 's1';
  const technicianName = user?.fullName || '';

  const [activeSubTab, setActiveSubTab] = useState<'checklist' | 'templates' | 'docs'>('checklist');
  const [activeTickets, setActiveTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState('');

  // Templates Data
  const reportTemplates = [
    { 
      id: 'temp-1', 
      title: 'Diagnosa Motherboard', 
      text: 'UNIT DATA: [Unit]\nSTATUS: Short pada jalur [Jalur]\nEKSEKUSI: Penggantian Kapasitor & Re-soldering IC Power\nHASIL: Tegangan kembali stabil 19V. Unit lulus stress test 2 jam.' 
    },
    { 
      id: 'temp-2', 
      title: 'Pembersihan Thermal', 
      text: 'KONDISI AWAL: Fan bising, suhu idle 70C\nPROSES: Repaste (Arctic MX-4) & Deep Cleaning Heatsink\nHASIL: Suhu idle turun ke 42C. Fan silent.' 
    },
    { 
      id: 'temp-3', 
      title: 'Ganti Layar/LCD', 
      text: 'UNIT: [Unit]\nKERUSAKAN: Screen flickering / Dead pixel\nPART: LCD LED Slim 30 Pin\nHASIL: Visual jernih. Kontrol brightness normal.' 
    }
  ];

  // Checklist State
  const [checklists, setChecklists] = useState([
    { id: 1, task: 'Grounding ESD (Anti Statik) Terpasang', done: false, category: 'Prep' },
    { id: 2, task: 'Backup Data Pelanggan (Jika memungkinkan)', done: false, category: 'Prep' },
    { id: 3, task: 'Dokumentasi Kondisi Fisik Awal (Foto)', done: false, category: 'Prep' },
    { id: 4, task: 'Pengecekan Tegangan Input (Charger)', done: false, category: 'Main' },
    { id: 5, task: 'Inspeksi Visual Korosi / Cairan', done: false, category: 'Main' },
    { id: 6, task: 'Stress Test & Uji Performa Akhir', done: false, category: 'Post' },
    { id: 7, task: 'Pembersihan Eksternal Unit', done: false, category: 'Post' },
  ]);

  useEffect(() => {
    const all = SupportService.getTickets(storeId);
    setActiveTickets(all.filter(t => t.technicianName === technicianName && t.status !== SupportStatus.CLOSED));
  }, [storeId, technicianName]);

  const toggleCheck = (id: number) => {
    setChecklists(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Template laporan berhasil disalin ke clipboard!");
  };

  const handleFakeUpload = (type: 'before' | 'after') => {
    if (!selectedTicketId) return alert("Pilih unit tiket terlebih dahulu!");
    alert(`Simulasi: Foto ${type} berhasil diunggah untuk Tiket #${selectedTicketId}. Data disimpan ke node regional.`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h3 className="text-2xl font-black text-white tracking-tight uppercase">Technical Toolbox</h3>
           <p className="text-sm text-slate-500 font-medium mt-1">Alat bantu standarisasi pengerjaan dan dokumentasi teknis.</p>
        </div>
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
           <button onClick={() => setActiveSubTab('checklist')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'checklist' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Checklist</button>
           <button onClick={() => setActiveSubTab('templates')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'templates' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Template</button>
           <button onClick={() => setActiveSubTab('docs')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'docs' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Dokumentasi</button>
        </div>
      </div>

      {activeSubTab === 'checklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border-slate-800 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                 <h4 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                    Standard Repair Protocol
                 </h4>
                 <button onClick={() => setChecklists(prev => prev.map(c => ({...c, done: false})))} className="text-[10px] font-black text-slate-600 hover:text-rose-500 uppercase tracking-widest transition-colors">Reset Checklist</button>
              </div>

              <div className="space-y-3">
                 {['Prep', 'Main', 'Post'].map(cat => (
                   <div key={cat} className="space-y-2">
                      <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-2 mt-6 mb-2">{cat} Phase</p>
                      {checklists.filter(c => c.category === cat).map(item => (
                         <div 
                           key={item.id} 
                           onClick={() => toggleCheck(item.id)}
                           className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all group ${item.done ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                         >
                            <span className={`text-xs font-bold ${item.done ? 'text-emerald-400 line-through' : 'text-slate-300'}`}>{item.task}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${item.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-800 group-hover:border-indigo-500'}`}>
                               {item.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={4}/></svg>}
                            </div>
                         </div>
                      ))}
                   </div>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 bg-indigo-600/5">
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Progress Auditor</h4>
                 <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-6">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                          <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364" strokeDashoffset={364 - (checklists.filter(c => c.done).length / checklists.length) * 364} className="text-indigo-500 transition-all duration-1000" />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white">
                          {Math.round((checklists.filter(c => c.done).length / checklists.length) * 100)}%
                       </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold text-center leading-relaxed">Pastikan semua tahapan selesai untuk menjaga standar kualitas SeuramoeTech.</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {reportTemplates.map(temp => (
             <div key={temp.id} className="glass-panel p-8 rounded-[2.5rem] border-slate-800 flex flex-col group hover:border-indigo-500/30 transition-all h-full">
                <div className="flex justify-between items-start mb-6">
                   <h4 className="text-lg font-black text-white">{temp.title}</h4>
                   <button 
                     onClick={() => copyToClipboard(temp.text)}
                     className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
                   >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" strokeWidth={2}/></svg>
                   </button>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex-1">
                   <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap leading-relaxed italic">
                      {temp.text}
                   </pre>
                </div>
                <button 
                  onClick={() => alert("Fitur Insert Langsung sedang dikembangkan.")}
                  className="mt-6 w-full py-3 bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-500 uppercase rounded-xl hover:text-white hover:bg-slate-800 transition-all"
                >
                  Gunakan Pada Tiket Aktif
                </button>
             </div>
           ))}
        </div>
      )}

      {activeSubTab === 'docs' && (
        <div className="max-w-4xl mx-auto space-y-8">
           <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 shadow-2xl">
              <h4 className="text-lg font-bold text-white mb-8">Pilih Unit & Unggah Dokumentasi</h4>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pilih Unit Tiket Aktif</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none"
                      value={selectedTicketId}
                      onChange={e => setSelectedTicketId(e.target.value)}
                    >
                       <option value="">-- Pilih Unit --</option>
                       {activeTickets.map(t => (
                         <option key={t.id} value={t.id}>[{t.id}] {t.deviceModel} - {t.customerName}</option>
                       ))}
                    </select>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <p className="text-[9px] font-black text-indigo-400 uppercase text-center">Foto Sebelum (Kondisi Awal)</p>
                       <div 
                         onClick={() => handleFakeUpload('before')}
                         className="aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-600/5 transition-all group"
                       >
                          <svg className="w-10 h-10 text-slate-700 group-hover:text-indigo-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg>
                          <span className="text-[10px] font-bold text-slate-600 group-hover:text-white uppercase tracking-widest">Klik Untuk Upload</span>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[9px] font-black text-emerald-400 uppercase text-center">Foto Sesudah (Selesai Pengerjaan)</p>
                       <div 
                         onClick={() => handleFakeUpload('after')}
                         className="aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-600/5 transition-all group"
                       >
                          <svg className="w-10 h-10 text-slate-700 group-hover:text-emerald-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg>
                          <span className="text-[10px] font-bold text-slate-600 group-hover:text-white uppercase tracking-widest">Klik Untuk Upload</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-amber-600/10 border border-amber-500/20 rounded-3xl flex items-center gap-4">
              <svg className="w-6 h-6 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth={2}/></svg>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                 "PENTING: Dokumentasi foto bersifat wajib untuk klaim garansi di kemudian hari. Pastikan serial number unit terlihat jelas dalam foto dokumentasi."
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianTools;