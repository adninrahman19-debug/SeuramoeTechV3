
import React, { useState, useEffect } from 'react';
import { UserRole, User } from '../../types';
import { ICONS } from '../../constants';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  roles: UserRole[];
}

interface QuickAccessHubProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onNavigate: (path: any) => void;
}

const QuickAccessHub: React.FC<QuickAccessHubProps> = ({ isOpen, onClose, user, onNavigate }) => {
  const [query, setQuery] = useState('');

  const actions: QuickAction[] = [
    // Global
    { id: 'notif', label: 'Buka Notifikasi', description: 'Lihat semua pemberitahuan sistem', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth={2}/></svg>, path: 'notifications', roles: Object.values(UserRole) },
    
    // Super Admin
    { id: 'god', label: 'Masuk Mode Dewa', description: 'Akses kontrol sistem tak terbatas', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>, path: 'powers', roles: [UserRole.SUPER_ADMIN] },
    { id: 'audit', label: 'Log Keamanan', description: 'Audit trail aktivitas seluruh platform', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg>, path: 'security', roles: [UserRole.SUPER_ADMIN] },
    
    // Store Owner
    { id: 'add-p', label: 'Tambah Produk Baru', description: 'Update katalog unit toko Anda', icon: <ICONS.Plus className="w-5 h-5" />, path: 'inventory', roles: [UserRole.STORE_OWNER] },
    { id: 'rep-o', label: 'Laporan Keuangan', description: 'Deep dive analitik omzet node', icon: <ICONS.Dashboard className="w-5 h-5" />, path: 'reports', roles: [UserRole.STORE_OWNER] },
    
    // Staff Admin / Technician
    { id: 'new-t', label: 'Input Servis Baru', description: 'Terima unit gadget dari pelanggan', icon: <ICONS.Ticket className="w-5 h-5" />, path: 'tickets', roles: [UserRole.STAFF_ADMIN, UserRole.TECHNICIAN] },
    { id: 'shift', label: 'Laporan Tutup Shift', description: 'Settlement kas harian operasional', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2}/></svg>, path: 'reports', roles: [UserRole.STAFF_ADMIN, UserRole.MARKETING] },

    // Staff Marketing Specific
    { id: 'm-promo', label: 'Buat Promo Baru', description: 'Ajukan strategi diskon ke Owner', icon: <ICONS.Ticket className="w-5 h-5" />, path: 'promo', roles: [UserRole.MARKETING] },
    { id: 'm-content', label: 'Edit Konten Produk', description: 'Optimasi deskripsi & visual katalog', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth={2}/></svg>, path: 'content', roles: [UserRole.MARKETING] },
    { id: 'm-engage', label: 'Follow-up Pelanggan', description: 'Kirim pesan WhatsApp Engagement', icon: <ICONS.Users className="w-5 h-5" />, path: 'engagement', roles: [UserRole.MARKETING] },
    
    // Customer
    { id: 'serv-c', label: 'Ajukan Servis Unit', description: 'Booking teknisi Seuramoe sekarang', icon: <ICONS.Plus className="w-5 h-5" />, path: 'new-service', roles: [UserRole.CUSTOMER] },
    { id: 'mall', label: 'Buka Mall Sumatra', description: 'Cari perangkat teknologi terbaru', icon: <ICONS.Store className="w-5 h-5" />, path: 'marketplace', roles: [UserRole.CUSTOMER] },
    { id: 'poin', label: 'Tukar Poin Loyalty', description: 'Gunakan poin untuk reward eksklusif', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>, path: 'promo', roles: [UserRole.CUSTOMER] },
  ];

  const filtered = actions
    .filter(a => a.roles.includes(user.role))
    .filter(a => a.label.toLowerCase().includes(query.toLowerCase()) || a.description.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden animate-in zoom-in-95 duration-200 relative z-10">
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center gap-4">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            autoFocus
            type="text" 
            placeholder="Ketik perintah atau cari menu cepat..."
            className="flex-1 bg-transparent border-none outline-none text-white text-xl font-bold placeholder:text-slate-600"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-500 font-black">ESC</kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-3">
          {filtered.length === 0 ? (
            <div className="py-20 text-center space-y-2">
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Pencarian tidak ditemukan</p>
               <p className="text-[10px] text-slate-700">Coba kata kunci lain atau hubungi admin node.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {filtered.map(action => (
                <button
                  key={action.id}
                  onClick={() => { onNavigate(action.path); onClose(); }}
                  className="w-full flex items-center gap-5 p-4 hover:bg-indigo-600 group rounded-2xl text-left transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-white group-hover:text-indigo-600 group-hover:scale-110 transition-all shadow-lg">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-white">{action.label}</p>
                    <p className="text-[10px] text-slate-500 font-medium group-hover:text-indigo-100">{action.description}</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-800 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth={3}/></svg>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
           <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                <span className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-400">ENTER</span> Pilih
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                <span className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-400">↑↓</span> Navigasi
              </div>
           </div>
           <p className="text-[9px] font-black text-indigo-500/50 uppercase tracking-[0.3em]">Command Center v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessHub;
