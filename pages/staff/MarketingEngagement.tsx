import React, { useState } from 'react';
import { ICONS } from '../../constants.tsx';
import StatCard from '../../components/Shared/StatCard.tsx';
import RightDrawer from '../../components/Shared/RightDrawer.tsx';

const MarketingEngagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'followup' | 'broadcast' | 'loyalty'>('followup');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'wa' | 'broadcast_form'>('wa');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Mock Data: Customers needing follow-up
  const followUpQueue = [
    { id: 'c1', name: 'Teuku Faisal', activity: 'Servis MacBook Selesai', date: 'Hari ini', phone: '081266XXXX' },
    { id: 'c2', name: 'Cut Meutia', activity: 'Pembelian Laptop Gaming', date: 'Kemarin', phone: '085277XXXX' },
    { id: 'c3', name: 'Rahmat Hidayat', activity: 'Servis iPhone Selesai', date: '2 hari lalu', phone: '081122XXXX' },
  ];

  // Mock Data: Loyalty Rankings
  const topLoyalists = [
    { name: 'Ali Akbar', tier: 'Platinum', points: 4500, transactions: 12 },
    { name: 'Siti Aminah', tier: 'Gold', points: 2800, transactions: 8 },
    { name: 'Budi Santoso', tier: 'Silver', points: 1200, transactions: 4 },
  ];

  const handleOpenFollowUp = (customer: any) => {
    setSelectedCustomer(customer);
    setDrawerMode('wa');
    setIsDrawerOpen(true);
  };

  const sendFakeWA = () => {
    alert(`WhatsApp Follow-up terkirim ke ${selectedCustomer?.name} via Seuramoe Gateway.`);
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      {/* Header & Sub-navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h3 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-mono">CE</div>
              Customer Engagement Hub
           </h3>
           <p className="text-sm text-slate-500 font-medium mt-1">Bangun loyalitas dan retensi pelanggan melalui komunikasi proaktif.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto max-w-full">
           <button onClick={() => setActiveSubTab('followup')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'followup' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Follow-up</button>
           <button onClick={() => setActiveSubTab('broadcast')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'broadcast' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Broadcast</button>
           <button onClick={() => setActiveSubTab('loyalty')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'loyalty' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Loyalty Program</button>
        </div>
      </div>

      {/* KPI Cards for Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Follow-up Tertunda" value="12 Org" trend="Urgent" icon={<ICONS.Users className="w-5 h-5" />} colorClass="amber" />
        <StatCard label="Broadcast Bulan Ini" value="4 Kali" trend="Normal" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" strokeWidth={2}/></svg>} colorClass="indigo" />
        <StatCard label="Member Aktif" value="482" icon={<ICONS.Dashboard className="w-5 h-5" />} colorClass="emerald" />
        <StatCard label="Engagement Score" value="94%" trend="+2.1%" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth={2}/></svg>} colorClass="rose" />
      </div>

      {activeSubTab === 'followup' && (
        <div className="space-y-6">
           <h4 className="text-lg font-bold text-white flex items-center gap-3">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
              Antrean Follow-up Pelanggan
           </h4>
           <div className="grid grid-cols-1 gap-4">
              {followUpQueue.map(cust => (
                <div key={cust.id} className="glass-panel p-6 rounded-3xl border-slate-800 flex flex-col md:flex-row items-center justify-between group hover:border-violet-500/30 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cust.name}`} className="w-10 h-10" alt="" />
                      </div>
                      <div>
                         <h4 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">{cust.name}</h4>
                         <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{cust.activity} • {cust.date}</p>
                      </div>
                   </div>
                   <div className="flex gap-2 mt-6 md:mt-0 w-full md:w-auto">
                      <button 
                        onClick={() => handleOpenFollowUp(cust)}
                        className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                      >
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412 0 6.556-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.669c1.551.921 3.099 1.407 4.747 1.408 5.467 0 9.914-4.446 9.916-9.913.002-5.467-4.448-9.914-9.915-9.914-5.467 0-9.913 4.446-9.915 9.913-.002 2.155.679 4.148 1.916 5.894l-1.001 3.654 3.752-.984z"/></svg>
                         WhatsApp Thank-you
                      </button>
                      <button className="flex-1 md:flex-none px-6 py-3 bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-700 transition-all">Lewati</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeSubTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="glass-panel p-10 rounded-[3rem] border-slate-800 bg-indigo-600/5 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Smart Broadcast Console</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                Gunakan <span className="text-indigo-400 font-bold underline">Seuramoe Push API</span> untuk mengirimkan pengumuman diskon ke seluruh database pelanggan regional node Aceh secara otomatis.
              </p>
              <button 
                onClick={() => { setDrawerMode('broadcast_form'); setIsDrawerOpen(true); }}
                className="w-full py-5 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-indigo-500 shadow-2xl shadow-indigo-600/20 transition-all"
              >
                 Mulai Broadcast Baru
              </button>
           </div>
           
           <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Riwayat Broadcast Terakhir</h4>
              <div className="space-y-3">
                 {[
                   { title: 'Promo Akhir Tahun', target: 'Semua Pelanggan', reach: '1,240', date: '20 Okt 2024' },
                   { title: 'New Arrival: RTX 50 Series', target: 'Segmen Gamers', reach: '482', date: '15 Okt 2024' },
                   { title: 'Service Maintenance Alert', target: 'Pelanggan Servis Aktif', reach: '12', date: '12 Okt 2024' },
                 ].map((log, i) => (
                   <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center group hover:border-indigo-500/30 transition-all">
                      <div>
                         <p className="text-xs font-bold text-white">{log.title}</p>
                         <p className="text-[9px] text-slate-500 uppercase font-black mt-1">Ke: {log.target}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-black text-emerald-400">{log.reach} Reach</p>
                         <p className="text-[8px] text-slate-600 font-bold mt-1">{log.date}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'loyalty' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 glass-panel rounded-[2.5rem] border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-white uppercase tracking-tight">Ecosystem Top Loyalists</h3>
                 <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Regional Node Sumatra</span>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-900/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                          <th className="px-8 py-5">Nama Pelanggan</th>
                          <th className="px-8 py-5">Membership Tier</th>
                          <th className="px-8 py-5 text-center">Akumulasi Poin</th>
                          <th className="px-8 py-5 text-right">Aksi Reward</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                       {topLoyalists.map(cust => (
                          <tr key={cust.name} className="hover:bg-slate-800/20 transition-all group">
                             <td className="px-8 py-4">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-lg">
                                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cust.name}`} alt="" />
                                   </div>
                                   <p className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">{cust.name}</p>
                                </div>
                             </td>
                             <td className="px-8 py-4">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                                   cust.tier === 'Platinum' ? 'bg-indigo-600 text-white' : 
                                   cust.tier === 'Gold' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                   'bg-slate-800 text-slate-400 border-slate-700'
                                }`}>{cust.tier}</span>
                             </td>
                             <td className="px-8 py-4 text-center">
                                <p className="text-sm font-black text-white">{cust.points.toLocaleString()}</p>
                                <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">Points available</p>
                             </td>
                             <td className="px-8 py-4 text-right">
                                <button className="px-4 py-2 bg-slate-900 border border-slate-800 text-[9px] font-black text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-500 rounded-xl transition-all">Kirim Voucher</button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           <div className="space-y-6">
              <div className="p-8 bg-gradient-to-br from-violet-600 to-violet-800 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                 <h4 className="text-xl font-black mb-4 tracking-tighter uppercase leading-none">Point Exchange Config</h4>
                 <div className="space-y-4 mb-10">
                    <div className="flex justify-between items-center text-[10px] font-bold py-2 border-b border-white/10">
                       <span className="opacity-70">Rasio Poin</span>
                       <span>Rp 10.000 = 1 Poin</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold py-2 border-b border-white/10">
                       <span className="opacity-70">Min. Redeem</span>
                       <span>1.000 Poin</span>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-white text-violet-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-xl">Kelola Struktur Loyalitas</button>
              </div>

              <div className="glass-panel p-6 rounded-3xl border-slate-800">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Loyalty AI Tip</p>
                 <p className="text-xs text-slate-400 italic leading-relaxed">
                    "Pelanggan <span className="text-violet-400 font-bold">Platinum</span> di wilayah Aceh memiliki kecenderungan repeat order 3.5x lebih tinggi jika diberikan layanan antar-jemput servis gratis."
                 </p>
              </div>
           </div>
        </div>
      )}

      {/* Engagement Drawers */}
      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerMode === 'wa' ? 'WhatsApp Follow-up Protocol' : 'Push Broadcast Manager'}>
         {drawerMode === 'wa' && selectedCustomer && (
           <div className="space-y-8">
              <div className="p-6 bg-emerald-600/10 border border-emerald-500/20 rounded-3xl">
                 <p className="text-xs text-slate-300 leading-relaxed italic">
                    "Kirimkan pesan personal kepada <strong>{selectedCustomer.name}</strong> untuk menanyakan kepuasan layanan dan mengajak kembali berkunjung."
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">WhatsApp Message Template</label>
                    <textarea 
                      rows={8}
                      className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm italic"
                      defaultValue={`Halo Kak ${selectedCustomer.name}, terima kasih telah mempercayakan perbaikan unit Anda di SeuramoeTech Aceh. Semoga unitnya awet dan kembali normal! Jika ada keluhan silakan hubungi kami kembali ya kak. Rakan Tech - Sumatra Node 01.`}
                    ></textarea>
                 </div>
              </div>

              <button 
                onClick={sendFakeWA}
                className="w-full py-4 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20"
              >
                 Eksekusi Follow-up WhatsApp
              </button>
           </div>
         )}

         {drawerMode === 'broadcast_form' && (
           <div className="space-y-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Audience</label>
                 <select className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none">
                    <option>Semua Database Pelanggan</option>
                    <option>Segmen High Spender</option>
                    <option>Pemilik Unit Gaming (RTX Only)</option>
                    <option>Pelanggan Servis Pasif (> 6 bulan)</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Broadcast Copy</label>
                 <textarea 
                    rows={6}
                    placeholder="Tulis pesan promosi Anda di sini..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                 ></textarea>
              </div>

              <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Platform Warning</p>
                 <p className="text-xs text-slate-400 leading-relaxed">Broadcast massal hanya dapat dilakukan 1x per minggu untuk menghindari flag spam pada nomor gateway toko.</p>
              </div>

              <button 
                onClick={() => { alert("Broadcast antrean diproses. Perkiraan selesai: 15 menit."); setIsDrawerOpen(false); }}
                className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-indigo-500 shadow-xl"
              >
                 Deploy Push Broadcast
              </button>
           </div>
         )}
      </RightDrawer>
    </div>
  );
};

export default MarketingEngagement;