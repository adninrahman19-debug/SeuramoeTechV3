
import React, { useState, useEffect } from 'react';
import NotificationService, { AppNotification, NotificationType } from '../../services/NotificationService';
import { ICONS } from '../../constants';

interface NotificationHubProps {
  onNavigate?: (path: any) => void;
}

const NotificationHub: React.FC<NotificationHubProps> = ({ onNavigate }) => {
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
    if (n.link && onNavigate) {
      onNavigate(n.link);
    }
  };

  const handleMarkAllRead = () => {
    if (confirm("Tandai semua pesan sebagai terbaca?")) {
      NotificationService.markAllAsRead();
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus notifikasi ini?")) {
      NotificationService.deleteNotification(id);
    }
  };

  const getStyle = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case NotificationType.SERVICE: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case NotificationType.SYSTEM: return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case NotificationType.SECURITY: return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const filtered = filter === 'ALL' ? notifs : notifs.filter(n => n.type === filter);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit overflow-x-auto no-scrollbar">
           <button onClick={() => setFilter('ALL')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Semua</button>
           <button onClick={() => setFilter(NotificationType.ORDER)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === NotificationType.ORDER ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Order</button>
           <button onClick={() => setFilter(NotificationType.SYSTEM)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === NotificationType.SYSTEM ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Sistem</button>
           <button onClick={() => setFilter(NotificationType.SECURITY)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === NotificationType.SECURITY ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Keamanan</button>
        </div>
        <button onClick={handleMarkAllRead} className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest">Tandai Semua Terbaca</button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl border-slate-800 text-slate-600 italic">Tidak ada notifikasi baru.</div>
        ) : filtered.map(n => (
          <div 
            key={n.id} 
            onClick={() => handleAction(n)}
            className={`glass-panel p-5 rounded-3xl border-slate-800 flex items-center gap-6 cursor-pointer group hover:border-indigo-500/30 ${!n.isRead ? 'bg-indigo-600/5 ring-1 ring-indigo-500/10' : 'opacity-60'}`}
          >
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${getStyle(n.type)}`}>
               {n.type === NotificationType.ORDER && <ICONS.Package className="w-6 h-6" />}
               {n.type === NotificationType.SYSTEM && <ICONS.Dashboard className="w-6 h-6" />}
               {n.type === NotificationType.SECURITY && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth={2}/></svg>}
               {n.type === NotificationType.SERVICE && <ICONS.Ticket className="w-6 h-6" />}
            </div>
            <div className="flex-1">
               <h4 className="text-sm font-bold text-white uppercase tracking-tight">{n.title}</h4>
               <p className="text-xs text-slate-400 mt-1">{n.message}</p>
               <p className="text-[9px] text-slate-600 font-bold uppercase mt-2">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }} className="p-2 text-slate-700 hover:text-rose-500 transition-colors">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationHub;
