import React from 'react';
import { ICONS } from '../../constants.tsx';
import AuthService from '../../auth/AuthService.ts';

const StaffSecurityPolicy: React.FC = () => {
  const user = AuthService.getCurrentUser();

  const restrictions = [
    { 
      title: 'Manajemen Langganan', 
      desc: 'Hanya Owner yang dapat mengubah paket SaaS (Basic/Pro/Enterprise).', 
      status: 'Restricted',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" strokeWidth={2}/></svg>
    },
    { 
      title: 'Penghapusan Data Kritikal', 
      desc: 'Staf tidak diperbolehkan menghapus data produk atau invoice tanpa persetujuan owner.', 
      status: 'Protected',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
    },
    { 
      title: 'Otoritas Akun Owner', 
      desc: 'Staf Marketing tidak memiliki akses ke pengaturan identitas atau password Owner.', 
      status: 'No Access',
      icon: <ICONS.Users className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h3 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg>
              </div>
              Security & Policy Center
           </h3>
           <p className="text-sm text-slate-500 font-medium mt-1">Transparansi hak akses dan protokol keamanan node regional.</p>
        </div>
        <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Akun Terverifikasi & Patuh</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest ml-2">Matriks Batasan Role: Marketing</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {restrictions.map(res => (
                 <div key={res.title} className="glass-panel p-6 rounded-3xl border-slate-800 bg-slate-900/30 flex flex-col justify-between group hover:border-slate-700 transition-all">
                    <div>
                       <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 mb-6 group-hover:text-indigo-400 transition-colors">
                          {res.icon}
                       </div>
                       <h5 className="text-sm font-bold text-white mb-2">{res.title}</h5>
                       <p className="text-xs text-slate-500 leading-relaxed mb-8">"{res.desc}"</p>
                    </div>
                    <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] w-fit italic">
                       {res.status}
                    </span>
                 </div>
               ))}

               <div className="glass-panel p-6 rounded-3xl border-dashed border-2 border-slate-800 flex flex-col items-center justify-center text-center p-8 opacity-40">
                  <ICONS.Settings className="w-8 h-8 text-slate-700 mb-4" />
                  <p className="text-[10px] font-black text-slate-600 uppercase">Integrasi Sistem Terkunci</p>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 bg-amber-600/5 relative overflow-hidden">
               <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
               <h4 className="text-lg font-black text-white uppercase tracking-tight mb-4 leading-none">Status Audit Trail</h4>
               <p className="text-xs text-slate-400 leading-relaxed mb-8 italic">
                  "Semua aktivitas yang Anda lakukan di dashboard ini dicatat secara otomatis oleh sistem SeuramoeTech untuk keperluan audit keamanan dan akuntabilitas node regional."
               </p>
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold py-2 border-b border-slate-800/50">
                     <span className="text-slate-500 uppercase">IP Address Anda</span>
                     <span className="text-white font-mono">182.1.XX.XX</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold py-2 border-b border-slate-800/50">
                     <span className="text-slate-500 uppercase">Log Terakhir</span>
                     <span className="text-indigo-400">Update Campaign G-1</span>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-950 rounded-[2.5rem] border border-slate-800 shadow-2xl">
               <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 mb-6 border border-slate-800">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth={2}/></svg>
               </div>
               <h4 className="text-lg font-bold text-white mb-2">Request Akses Khusus?</h4>
               <p className="text-xs text-slate-500 leading-relaxed mb-8">Hubungi Owner toko jika Anda membutuhkan izin tambahan untuk kampanye tertentu.</p>
               <button className="w-full py-4 bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-400 hover:text-white rounded-2xl transition-all">Hubungi Admin Regional</button>
            </div>
         </div>
      </div>

      <div className="p-8 glass-panel rounded-[3rem] border-slate-800 relative overflow-hidden">
         <h4 className="text-xl font-bold text-white mb-8">Log Aktivitas Pribadi (24 Jam Terakhir)</h4>
         <div className="space-y-4">
            {[
              { action: 'Modifikasi Konten Produk: ASUS ROG', time: '10 menit lalu', type: 'CONTENT' },
              { action: 'Pembuatan Voucher: MERDEKA79', time: '2 jam lalu', type: 'MARKETING' },
              { action: 'Login Terminal Sumatra-North', time: '4 jam lalu', type: 'SECURITY' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl group hover:border-indigo-500/20 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-slate-800 group-hover:bg-indigo-500 transition-colors"></div>
                    <p className="text-xs font-bold text-white">{log.action}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-black">{log.time}</p>
                    <span className="text-[8px] text-slate-700 font-mono tracking-widest">{log.type}</span>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default StaffSecurityPolicy;