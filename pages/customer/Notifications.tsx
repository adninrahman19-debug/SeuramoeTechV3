
import React from 'react';
import NotificationHub from '../../components/Shared/NotificationHub';

interface NotificationsProps {
  onNavigate: (path: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-24">
      {/* Page Context Info */}
      <div className="glass-panel p-8 rounded-[3rem] border-slate-800 bg-indigo-600/5 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
            <svg className="w-32 h-32 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth={2}/>
            </svg>
         </div>
         <div className="relative z-10">
            <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 leading-none">Pusat Informasi Pelanggan</h4>
            <p className="text-sm text-slate-400 max-w-lg leading-relaxed italic">
               "Terima pembaruan real-time mengenai status pesanan, pengerjaan servis teknisi, hingga penawaran eksklusif dari seluruh jaringan SeuramoeTech Sumatra."
            </p>
         </div>
      </div>

      {/* Main Notification Hub Integration */}
      <div className="max-w-5xl mx-auto">
         <NotificationHub onNavigate={onNavigate} />
      </div>

      {/* Security Disclaimer */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center">
         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            Semua pemberitahuan dienkripsi dan hanya dapat diakses melalui terminal login resmi Anda. <br />
            Data Regional Sumatra • Node Keamanan SUM-N-01
         </p>
      </div>
    </div>
  );
};

export default Notifications;
