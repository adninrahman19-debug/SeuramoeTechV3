import React, { useState, useEffect } from 'react';
import SupportService from '../../services/SupportService';
import AuthService from '../../auth/AuthService';
import { CustomerComplaint, SupportStatus } from '../../types';
import { ICONS } from '../../constants';
import NewComplaint from './NewComplaint';

const ComplaintsAndHelp: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'my_complaints' | 'faq' | 'guides'>('my_complaints');
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = () => {
    const all = SupportService.getComplaints();
    setComplaints(all.filter(c => c.customerName === user?.fullName));
  };

  const faqs = [
    { q: "Berapa lama masa garansi SeuramoeTech?", a: "Standar garansi kami adalah 12 bulan untuk unit laptop baru dan 3 bulan untuk perbaikan sparepart, kecuali dinyatakan lain pada invoice." },
    { q: "Apakah bisa melakukan perbaikan di hari yang sama?", a: "Tergantung tingkat kerusakan. Untuk pembersihan (cleaning) dan instalasi software bisa ditunggu (1-2 jam). Perbaikan hardware memerlukan diagnosa 1-3 hari kerja." },
    { q: "Bagaimana cara klaim garansi jika saya di luar Banda Aceh?", a: "Anda dapat mengirimkan unit melalui kurir mitra (JNE/J&T) ke Node terdekat. Pastikan Anda sudah meregistrasi klaim melalui dashboard ini terlebih dahulu." },
    { q: "Metode pembayaran apa saja yang diterima?", a: "Kami menerima QRIS, Transfer Bank (Bank Aceh/BSI/Mandiri), dan pembayaran tunai langsung di toko." }
  ];

  if (isAdding) {
    return <NewComplaint onSuccess={() => { setIsAdding(false); loadComplaints(); }} onCancel={() => setIsAdding(false)} />;
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-24">
      {/* Tab Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-xl">
           <button onClick={() => setActiveTab('my_complaints')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'my_complaints' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>Tiket Keluhan ({complaints.length})</button>
           <button onClick={() => setActiveTab('faq')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'faq' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>Tanya Jawab (FAQ)</button>
           <button onClick={() => setActiveTab('guides')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'guides' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>Panduan</button>
        </div>
        
        {activeTab === 'my_complaints' && (
          <button 
            onClick={() => setIsAdding(true)}
            className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-600/20 transition-all flex items-center gap-3"
          >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4" /></svg>
             Buat Keluhan
          </button>
        )}
      </div>

      {activeTab === 'my_complaints' && (
        <div className="space-y-6">
           {complaints.length === 0 ? (
             <div className="py-24 text-center glass-panel rounded-[3rem] border-slate-800 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 border border-slate-800"><ICONS.Ticket className="w-8 h-8" /></div>
                <h4 className="text-xl font-bold text-white uppercase">Tidak Ada Keluhan Aktif</h4>
                <p className="text-slate-500 text-sm max-w-xs">Terima kasih telah mempercayai SeuramoeTech. Kami berkomitmen memberikan layanan terbaik.</p>
             </div>
           ) : complaints.map(c => (
             <div key={c.id} className={`glass-panel p-8 rounded-[3rem] border-slate-800 hover:border-indigo-500/20 transition-all overflow-hidden relative group ${c.isResolved ? 'opacity-60' : ''}`}>
                <div className="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
                   <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                           c.severity === 'CRITICAL' ? 'bg-rose-600/10 text-rose-500' : 'bg-indigo-600/10 text-indigo-400'
                         }`}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tiket Keluhan #{c.id}</p>
                            <h4 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{c.subject}</h4>
                         </div>
                      </div>
                      <p className="text-sm text-slate-400 italic leading-relaxed">"{c.message}"</p>
                      
                      {c.response && (
                        <div className="p-5 bg-indigo-600/5 border-l-2 border-indigo-600 rounded-r-2xl mt-4">
                           <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Tanggapan Toko</p>
                           <p className="text-xs text-slate-300 italic">"{c.response}"</p>
                        </div>
                      )}
                   </div>

                   <div className="flex flex-col justify-center items-center p-8 bg-slate-950/50 rounded-[2rem] border border-slate-800 min-w-[250px]">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 border ${
                        c.isResolved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        c.status === SupportStatus.ESCALATED ? 'bg-rose-500 text-white border-rose-400' :
                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                         {c.isResolved ? 'SELESAI' : (c.status === SupportStatus.ESCALATED ? 'DALAM PENINJAUAN OWNER' : 'MENUNGGU RESPONS')}
                      </span>
                      <p className="text-[9px] text-slate-600 font-bold uppercase">Diajukan Pada</p>
                      <p className="text-xs font-black text-white mt-1">{new Date(c.createdAt).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="col-span-full mb-4">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Pusat Informasi Sumatra</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium italic">Temukan jawaban cepat untuk kendala umum Anda.</p>
           </div>
           {faqs.map((faq, i) => (
             <div key={i} className="glass-panel p-8 rounded-[2.5rem] border-slate-800 hover:border-indigo-500/30 transition-all cursor-pointer group" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex justify-between items-center gap-4">
                   <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight leading-tight">{faq.q}</h4>
                   <svg className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={3}/></svg>
                </div>
                {openFaq === i && (
                  <div className="mt-6 pt-6 border-t border-slate-800/50 animate-in slide-in-from-top-2 duration-300">
                     <p className="text-sm text-slate-400 leading-relaxed italic">{faq.a}</p>
                  </div>
                )}
             </div>
           ))}
        </div>
      )}

      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: 'Panduan Checkout', icon: <ICONS.Package />, desc: 'Cara belanja aman di Sumatra Marketplace.' },
             { title: 'Protokol Servis', icon: <ICONS.Ticket />, desc: 'Langkah pengiriman unit dan tracking pengerjaan.' },
             { title: 'Aturan Garansi', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg>, desc: 'Syarat dan ketentuan garansi regional node.' }
           ].map((guide, i) => (
             <div key={i} className="glass-panel p-8 rounded-[3rem] border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform shadow-xl">{guide.icon}</div>
                <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">{guide.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-8">{guide.desc}</p>
                <button className="mt-auto px-6 py-2 bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest rounded-xl transition-all">Baca Selengkapnya</button>
             </div>
           ))}
        </div>
      )}

      {/* Support Chat Overlay (Simulated) */}
      <div className="p-8 glass-panel rounded-[3rem] border-slate-800 bg-indigo-600/5 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><svg className="w-32 h-32 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeWidth={2}/></svg></div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-xl text-center md:text-left">
               <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 leading-none text-indigo-400">Hubungi Live Support</h4>
               <p className="text-sm text-slate-400 italic">"Tim kami siaga dari pukul 09:00 - 20:00 WIB untuk membantu kendala transaksi atau teknis unit Anda secara langsung."</p>
            </div>
            <button className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-3 animate-pulse">
               Mulai Chat Sekarang
            </button>
         </div>
      </div>
    </div>
  );
};

export default ComplaintsAndHelp;