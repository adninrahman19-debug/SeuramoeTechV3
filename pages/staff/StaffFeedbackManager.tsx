import React, { useState, useEffect } from 'react';
import SupportService from '../../services/SupportService.ts';
import ReviewService from '../../services/ReviewService.ts';
import AuthService from '../../auth/AuthService.ts';
import { CustomerComplaint, Review, SupportStatus } from '../../types.ts';
import { ICONS } from '../../constants.tsx';

const StaffFeedbackManager: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const storeId = user?.storeId || 's1';
  
  const [activeTab, setActiveTab] = useState<'complaints' | 'reviews'>('complaints');
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadData();
  }, [storeId]);

  const loadData = () => {
    setComplaints(SupportService.getComplaints(storeId));
    setReviews(ReviewService.getReviews(storeId));
  };

  const handleEscalate = (id: string) => {
    if (confirm("Eskalasi keluhan ini ke Owner? Tindakan ini akan memberikan notifikasi prioritas tinggi ke dashboard Pemilik Toko.")) {
      SupportService.escalateComplaint(id);
      alert("Keluhan berhasil dieksalasi ke tingkat Owner.");
      loadData();
    }
  };

  const handleRespond = (id: string) => {
    const response = prompt("Masukkan tanggapan awal atau solusi sementara untuk pelanggan:");
    if (response) {
      SupportService.resolveComplaint(id, response);
      alert("Tanggapan berhasil dikirim ke pelanggan.");
      loadData();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
       {/* Brand Header Section */}
       <div className="glass-panel p-10 rounded-[3rem] border-slate-800 bg-indigo-600/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
             <ICONS.Users className="w-40 h-40" />
          </div>
          <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase leading-none">Pusat Resolusi Pelanggan</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-10 max-w-2xl font-medium">
             Kelola suara pelanggan toko <span className="text-indigo-400 font-bold underline">Regional Sumatra</span>. Tanggapi isu ringan secara mandiri untuk menjaga rating toko tetap prima.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
             <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-[2rem] hover:border-indigo-500/30 transition-all">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Review Belum Dibalas</p>
                <p className="text-4xl font-black text-white tracking-tighter">{reviews.filter(r => !r.reply).length}</p>
             </div>
             <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-[2rem] hover:border-amber-500/30 transition-all">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Keluhan Menunggu</p>
                <p className="text-4xl font-black text-amber-500 tracking-tighter">{complaints.filter(c => !c.isResolved).length}</p>
             </div>
             <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-[2rem] hover:border-rose-500/30 transition-all">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Eskalasi ke Owner</p>
                <p className="text-4xl font-black text-rose-500 tracking-tighter">{complaints.filter(c => c.status === SupportStatus.ESCALATED).length}</p>
             </div>
          </div>
       </div>

       {/* Tab Navigation */}
       <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-lg">
          <button onClick={() => setActiveTab('complaints')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'complaints' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Daftar Keluhan</button>
          <button onClick={() => setActiveTab('reviews')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reviews' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Ulasan Publik</button>
       </div>

       {/* Complaints List Section */}
       {activeTab === 'complaints' && (
         <div className="grid grid-cols-1 gap-4">
            {complaints.length === 0 ? (
              <div className="p-20 text-center glass-panel rounded-[2rem] border-slate-800 text-slate-600 italic">Antrean keluhan kosong. Semua pelanggan terlayani dengan baik.</div>
            ) : complaints.map(c => (
              <div key={c.id} className={`glass-panel p-8 rounded-[2.5rem] border-slate-800 flex flex-col lg:flex-row items-start lg:items-center gap-8 group hover:border-indigo-500/30 transition-all ${c.isResolved ? 'opacity-60 grayscale' : ''}`}>
                 <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${
                   c.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse' : 
                   c.status === SupportStatus.ESCALATED ? 'bg-rose-600/20 text-rose-500 border border-rose-500/40' : 'bg-amber-500/10 text-amber-500'
                 }`}>
                    <ICONS.Ticket className="w-8 h-8" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                       <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{c.subject}</h4>
                       <span className={`px-2.5 py-1 text-[8px] font-black rounded-lg uppercase tracking-widest ${
                         c.status === SupportStatus.ESCALATED ? 'bg-rose-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-500'
                       }`}>{c.status === SupportStatus.ESCALATED ? 'Eskalasi Owner' : c.severity}</span>
                       <span className="text-[10px] font-mono text-slate-700">#{c.id}</span>
                    </div>
                    <p className="text-sm text-slate-400 max-w-3xl leading-relaxed italic">"{c.message}"</p>
                    <div className="mt-4 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                       <span className="text-indigo-400">Oleh: {c.customerName}</span>
                       <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                       <span>Masuk: {new Date(c.createdAt).toLocaleDateString()}</span>
                       <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                       <span className={c.isResolved ? 'text-emerald-500' : 'text-amber-500'}>{c.isResolved ? 'SELESAI' : 'MENUNGGU RESPONS'}</span>
                    </div>
                 </div>
                 <div className="flex gap-2 w-full lg:w-auto">
                    {!c.isResolved && (
                      <>
                        <button onClick={() => handleRespond(c.id)} className="flex-1 lg:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-600/20">Beri Tanggapan</button>
                        {c.status !== SupportStatus.ESCALATED && (
                          <button onClick={() => handleEscalate(c.id)} className="flex-1 lg:flex-none px-6 py-3 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-700 hover:border-rose-500 transition-all">Eskalasi ke Owner</button>
                        )}
                      </>
                    )}
                 </div>
              </div>
            ))}
         </div>
       )}

       {/* Reviews Section */}
       {activeTab === 'reviews' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.length === 0 ? (
              <div className="col-span-full p-20 text-center glass-panel rounded-[2rem] border-slate-800 text-slate-600 italic">Belum ada ulasan publik untuk toko Anda.</div>
            ) : reviews.map(rev => (
              <div key={rev.id} className={`glass-panel p-8 rounded-[2.5rem] border-slate-800 flex flex-col group hover:border-indigo-500/30 transition-all ${rev.status === 'hidden' ? 'opacity-30' : ''}`}>
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.customerName}`} className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg" alt="" />
                       <div>
                          <p className="text-sm font-bold text-white">{rev.customerName}</p>
                          <div className="text-amber-400 text-xs mt-1">{'★'.repeat(rev.rating)}{'☆'.repeat(5-rev.rating)}</div>
                       </div>
                    </div>
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                 </div>
                 <p className="text-xs text-slate-400 italic leading-relaxed mb-8">"{rev.comment}"</p>
                 
                 {rev.reply ? (
                   <div className="p-4 bg-indigo-600/10 border-l-2 border-indigo-600 rounded-r-2xl mb-6">
                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Respons Toko (Admin)</p>
                      <p className="text-xs text-slate-300">"{rev.reply}"</p>
                   </div>
                 ) : (
                   <button onClick={() => { const r = prompt('Balas ulasan ini:'); if(r) { ReviewService.reply(rev.id, r); loadData(); } }} className="w-full py-4 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all mb-6">+ Tambahkan Balasan</button>
                 )}

                 <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-800/50">
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">{rev.productName || 'LAYANAN UMUM'}</span>
                    <button onClick={() => { if(confirm("Sembunyikan ulasan ini dari publik?")) { ReviewService.toggleVisibility(rev.id); loadData(); } }} className="text-slate-600 hover:text-rose-500 transition-colors">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" strokeWidth={2}/></svg>
                    </button>
                 </div>
              </div>
            ))}
         </div>
       )}
    </div>
  );
};

export default StaffFeedbackManager;