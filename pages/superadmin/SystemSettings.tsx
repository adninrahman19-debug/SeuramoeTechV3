
import React from 'react';

const SystemSettings: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="glass-panel p-8 rounded-3xl border-slate-800">
        <h3 className="text-xl font-bold text-white mb-6">Global Platform State</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <div>
              <p className="text-sm font-bold text-white">Maintenance Mode</p>
              <p className="text-xs text-slate-500">Only Super Admins can access the platform when enabled.</p>
            </div>
            <div className="w-12 h-6 bg-slate-800 rounded-full relative cursor-pointer group">
              <div className="absolute left-1 top-1 w-4 h-4 bg-slate-600 rounded-full transition-all group-hover:scale-110"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <div>
              <p className="text-sm font-bold text-white">Automatic Daily Backups</p>
              <p className="text-xs text-slate-500">Backup all store data to Sumatra regional cloud storage.</p>
            </div>
            <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl border-slate-800">
        <h3 className="text-xl font-bold text-white mb-6">API & Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Midtrans Aceh', 'Twilio Sumatra', 'AWS Jakarta', 'Xendit HQ'].map(api => (
            <div key={api} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{api}</span>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded uppercase">Healthy</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-8 py-3 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all">APPLY GLOBAL SETTINGS</button>
      </div>
    </div>
  );
};

export default SystemSettings;
