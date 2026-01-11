import React, { useState, useEffect } from 'react';
import NotificationService, { AppNotification, NotificationType } from '../../services/NotificationService';
import { ICONS } from '../../constants';

interface NotificationsProps {
  onNavigate: (path: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ onNavigate }) => {
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<'ALL' | NotificationType>('ALL');

  useEffect(() => {
    loadNotifications();
    window.addEventListener('notifications-updated', loadNotifications);
    return () => window.removeEventListener('notifications-updated', loadNotifications);
  }, []);

  const loadNotifications = () => {
    setNotifs(NotificationService.getNotifications());
  };

  const handleAction = (n: AppNotification) => {
    NotificationService.markAsRead(n.id);
    if (n.link) {
      onNavigate(n.link);
    }
  };

  const getTypeStyle = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case NotificationType.SERVICE: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case NotificationType.PROMO: return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case NotificationType.MESSAGE: return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER: return <ICONS.Package className="w-5 h-5" />;
      case NotificationType.SERVICE: return <ICONS.Ticket className="w-5 h-5" />;
      case NotificationType.PROMO: return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" strokeWidth={2}/></svg>;
      case NotificationType.MESSAGE: return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth={2}/></svg>;
      default: return <ICONS.Dashboard className="w-5 h-5" />;
    }
  };

  const filteredNotifs = filter === 'ALL' ? notifs : notifs.filter(n => n.type === filter);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-24">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-xl overflow-x-auto max-w-full">
           <button onClick={() => setFilter('ALL')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === 'ALL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Semua</button>
           <button onClick={() => setFilter(NotificationType.ORDER)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === NotificationType.ORDER ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Pesanan</button>
           <button onClick={() => setFilter(NotificationType.SERVICE)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === NotificationType.SERVICE ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Servis</button>
           <button onClick={() => setFilter(NotificationType.PROMO)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === NotificationType.PROMO ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Promo</button>
        </div>
        
        <button 
          onClick={() => NotificationService.markAllAsRead()}
          className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
        >
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
           Tandai Semua Terbaca
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
         {filteredNotifs.length === 0 ? (
           <div className="py-24 text-center glass-panel rounded-[3rem] border-slate-800 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 mb-6"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth={2}/></svg></div>
              <h4 className="text-xl font-bold text-white uppercase tracking-tight">Kotak Masuk Kosong</h4>
              <p className="text-slate-500 text-sm mt-2 italic">Belum ada pembaruan aktivitas untuk Anda.</p>
           </div>
         ) : filteredNotifs.map(n => (
           <div 
             key={n.id} 
             onClick={() => handleAction(n)}
             className={`glass-panel p-6 rounded-[2rem] border-slate-800 transition-all flex flex-col md:flex-row items-start md:items-center gap-6 cursor-pointer group hover:border-indigo-500/30 ${!n.isRead ? 'bg-indigo-600/5 ring-1 ring-indigo-500/20' : 'opacity-60'}`}
           >
              <div className={`p-4 rounded-2xl border shrink-0 transition-transform group-hover:scale-110 ${getTypeStyle(n.type)}`}>
                 {getTypeIcon(n.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-start mb-1">
                    <h4 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{n.title}</h4>
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{new Date(n.createdAt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                 </div>
                 <p className="text-sm text-slate-400 leading-relaxed italic">{n.message}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                 {!n.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>}
                 <button 
                   onClick={(e) => { e.stopPropagation(); NotificationService.deleteNotification(n.id); }}
                   className="p-2 text-slate-700 hover:text-rose-500 transition-colors"
                 >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
                 </button>
              </div>
           </div>
         ))}
      </div>

      {/* Info Card */}
      <div className="p-8 glass-panel rounded-[3rem] border-slate-800 bg-indigo-600/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><svg className="w-32 h-32 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg></div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
               <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2 leading-none">Smart Alerts Sumatra</h4>
               <p className="text-sm text-slate-400 max-w-lg">Sistem notifikasi kami terintegrasi langsung dengan logistik regional dan status teknisi di lapangan untuk data paling akurat.</p>
            </div>
            <button className="px-8 py-3 bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest rounded-2xl transition-all">Konfigurasi Email</button>
         </div>
      </div>
    </div>
  );
};

export default Notifications;