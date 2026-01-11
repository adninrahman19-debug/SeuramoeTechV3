
import React, { useState, useEffect } from 'react';
import CommunicationService from '../../services/CommunicationService';
import StoreService from '../../services/StoreService';
import { Announcement, AnnouncementTarget, NotificationChannel, UserRole, Store } from '../../types';
import { ICONS } from '../../constants';

const CommunicationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'notifications'>('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newAnn, setNewAnn] = useState<Partial<Announcement>>({
    targetType: AnnouncementTarget.GLOBAL,
    priority: 'NORMAL',
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAnnouncements(CommunicationService.getAnnouncements());
    setChannels(CommunicationService.getChannels());
    setStores(StoreService.getAllStores());
  };

  const handleSaveAnnouncement = () => {
    if (!newAnn.title || !newAnn.content) return alert("Please fill title and content.");
    CommunicationService.saveAnnouncement(newAnn as Announcement);
    setIsCreating(false);
    setNewAnn({ targetType: AnnouncementTarget.GLOBAL, priority: 'NORMAL', isActive: true });
    loadData();
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm("Delete this announcement?")) {
      CommunicationService.deleteAnnouncement(id);
      loadData();
    }
  };

  const toggleChannel = (channel: NotificationChannel) => {
    CommunicationService.updateChannel({ ...channel, isEnabled: !channel.isEnabled });
    loadData();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white">Platform Communication</h2>
          <p className="text-sm text-slate-500">Manage global announcements and core notification infrastructure.</p>
        </div>
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
           {(['announcements', 'notifications'] as const).map(t => (
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

      {activeTab === 'announcements' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white tracking-tight">Active Broadcasts</h3>
              <button 
                onClick={() => setIsCreating(true)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
              >
                <ICONS.Plus className="w-4 h-4" /> Create New Announcement
              </button>
           </div>

           {isCreating && (
             <div className="glass-panel p-8 rounded-3xl border-indigo-500/30 bg-indigo-500/5 animate-in slide-in-from-top-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Title</label>
                      <input 
                        type="text" 
                        placeholder="System Update Alert..." 
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newAnn.title || ''}
                        onChange={e => setNewAnn({...newAnn, title: e.target.value})}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Type</label>
                        <select 
                           className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none"
                           value={newAnn.targetType}
                           onChange={e => setNewAnn({...newAnn, targetType: e.target.value as AnnouncementTarget})}
                        >
                           {Object.values(AnnouncementTarget).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority</label>
                        <select 
                           className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none"
                           value={newAnn.priority}
                           onChange={e => setNewAnn({...newAnn, priority: e.target.value as any})}
                        >
                           <option value="NORMAL">Normal</option>
                           <option value="HIGH">High</option>
                           <option value="CRITICAL">Critical</option>
                        </select>
                      </div>
                   </div>
                </div>

                {newAnn.targetType === AnnouncementTarget.ROLE && (
                  <div className="mb-6 space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Target Role</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none"
                      onChange={e => setNewAnn({...newAnn, targetValue: e.target.value})}
                    >
                      {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                )}

                {newAnn.targetType === AnnouncementTarget.STORE && (
                  <div className="mb-6 space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Target Store</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none"
                      onChange={e => setNewAnn({...newAnn, targetValue: e.target.value})}
                    >
                      {stores.map(s => <option key={s.id} value={s.id}>{s.name} ({s.location})</option>)}
                    </select>
                  </div>
                )}

                <div className="space-y-2 mb-8">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Message Content (Markdown supported)</label>
                   <textarea 
                     rows={4} 
                     className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500"
                     value={newAnn.content || ''}
                     onChange={e => setNewAnn({...newAnn, content: e.target.value})}
                   ></textarea>
                </div>

                <div className="flex justify-end gap-3">
                   <button onClick={() => setIsCreating(false)} className="px-6 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                   <button onClick={handleSaveAnnouncement} className="px-8 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20">Publish To Ecosystem</button>
                </div>
             </div>
           )}

           <div className="grid grid-cols-1 gap-4">
              {announcements.map(ann => (
                <div key={ann.id} className="glass-panel p-6 rounded-3xl border-slate-800 flex items-start gap-6 group hover:border-indigo-500/30 transition-all">
                   <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                     ann.priority === 'CRITICAL' ? 'bg-rose-600/10 text-rose-500' : 
                     ann.priority === 'HIGH' ? 'bg-amber-600/10 text-amber-500' : 'bg-indigo-600/10 text-indigo-400'
                   }`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-bold text-white truncate">{ann.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                          ann.targetType === AnnouncementTarget.GLOBAL ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {ann.targetType} {ann.targetValue ? `• ${ann.targetValue}` : ''}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{ann.content}</p>
                      <div className="mt-4 flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
                         <span>Published: {new Date(ann.createdAt).toLocaleString()}</span>
                         <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                         <span className={ann.isActive ? 'text-emerald-500' : 'text-slate-600'}>{ann.isActive ? 'VISIBLE' : 'EXPIRED'}</span>
                      </div>
                   </div>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg"><ICONS.Settings className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteAnnouncement(ann.id)} className="p-2 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-lg transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Notification Channels</h3>
              <div className="grid grid-cols-1 gap-4">
                 {channels.map(channel => (
                   <div key={channel.id} className="glass-panel p-6 rounded-3xl border-slate-800 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${channel.isEnabled ? 'bg-indigo-600/10 text-indigo-400' : 'bg-slate-900 text-slate-600'}`}>
                            {channel.id === 'email' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                            {channel.id === 'whatsapp' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                            {channel.id === 'push' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
                            {channel.id === 'inapp' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-white">{channel.name}</p>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{channel.provider}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                           channel.status === 'operational' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                         }`}>
                           <div className={`w-1 h-1 rounded-full ${channel.status === 'operational' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                           {channel.status}
                         </div>
                         <button 
                           onClick={() => toggleChannel(channel)}
                           className={`w-12 h-6 rounded-full relative transition-all duration-300 ${channel.isEnabled ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'bg-slate-800'}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${channel.isEnabled ? 'right-1' : 'left-1'}`}></div>
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold text-white tracking-tight">API Configuration</h3>
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Sumatra Regional Edge</span>
              </div>
              <div className="glass-panel p-8 rounded-3xl border-slate-800 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between">
                       SMTP HOST <span>SendGrid Verified</span>
                    </label>
                    <input type="text" readOnly value="smtp.sendgrid.net" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-xs font-mono outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       WHATSAPP GATEWAY (TOKEN)
                    </label>
                    <div className="relative">
                      <input type="password" readOnly value="••••••••••••••••••••••••••••" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-xs font-mono outline-none" />
                      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 text-[10px] font-black uppercase hover:text-white transition-colors">Rotate Key</button>
                    </div>
                 </div>
                 <div className="pt-4">
                    <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-2">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg>
                       Test Delivery Engine
                    </button>
                 </div>
              </div>
              <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
                 <p className="text-xs font-bold text-white mb-2">Automated Rules Engine</p>
                 <p className="text-[10px] text-slate-400 leading-relaxed italic">"System automatically triggers WhatsApp alerts when repair status changes to 'READY' and subscription invoices reach 'OVERDUE' status."</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationCenter;
