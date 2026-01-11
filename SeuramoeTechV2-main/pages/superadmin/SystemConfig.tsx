
import React, { useState, useEffect } from 'react';
import ConfigService from '../../services/ConfigService';
import { PlatformConfig, IntegrationConfig } from '../../types';
import { ICONS } from '../../constants';

const SystemConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'core' | 'features' | 'integrations' | 'maintenance'>('core');
  const [config, setConfig] = useState<PlatformConfig>(ConfigService.getPlatformConfig());
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(ConfigService.getIntegrations());

  const handleUpdateConfig = (updates: any) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    ConfigService.updatePlatformConfig(newConfig);
  };

  const handleUpdateIntegration = (int: IntegrationConfig) => {
    ConfigService.updateIntegration(int);
    setIntegrations(ConfigService.getIntegrations());
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs">Ω</div>
            System God Mode
          </h2>
          <p className="text-sm text-slate-500">Root-level platform architecture and feature governing.</p>
        </div>
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
           {(['core', 'features', 'integrations', 'maintenance'] as const).map(t => (
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

      {activeTab === 'core' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="glass-panel p-8 rounded-3xl border-slate-800 space-y-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                 <ICONS.Settings className="w-5 h-5 text-indigo-500" />
                 Platform Identity
              </h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                      value={config.branding.name}
                      onChange={e => handleUpdateConfig({ branding: { ...config.branding, name: e.target.value } })}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Tagline</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                      value={config.branding.tagline}
                      onChange={e => handleUpdateConfig({ branding: { ...config.branding, tagline: e.target.value } })}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Brand Color</label>
                    <div className="flex gap-4">
                       <input 
                         type="color" 
                         className="w-12 h-12 bg-transparent border-0 cursor-pointer" 
                         value={config.branding.primaryColor}
                         onChange={e => handleUpdateConfig({ branding: { ...config.branding, primaryColor: e.target.value } })}
                       />
                       <input 
                         type="text" 
                         className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm" 
                         value={config.branding.primaryColor}
                         readOnly
                       />
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-panel p-8 rounded-3xl border-slate-800 space-y-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                 <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                 Domain Architecture
              </h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <div>
                       <p className="text-sm font-bold text-white">Automated Subdomains</p>
                       <p className="text-[10px] text-slate-500">Enable `store.seuramoetech.com` wildcard routing.</p>
                    </div>
                    <button 
                      onClick={() => handleUpdateConfig({ domains: { ...config.domains, enableSubdomains: !config.domains.enableSubdomains } })}
                      className={`w-12 h-6 rounded-full relative transition-all ${config.domains.enableSubdomains ? 'bg-indigo-600' : 'bg-slate-800'}`}
                    >
                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.domains.enableSubdomains ? 'right-1' : 'left-1'}`}></div>
                    </button>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Main Ecosystem Domain</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                      value={config.domains.mainDomain}
                      onChange={e => handleUpdateConfig({ domains: { ...config.domains, mainDomain: e.target.value } })}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reserved Keys</label>
                    <div className="flex flex-wrap gap-2">
                       {config.domains.reservedSubdomains.map(sub => (
                         <span key={sub} className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-[10px] font-bold border border-slate-700">{sub}</span>
                       ))}
                       <button className="px-3 py-1 border border-dashed border-slate-700 text-slate-600 rounded-lg text-[10px] font-bold hover:text-indigo-400 hover:border-indigo-400 transition-all">+</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-xl">
           <h3 className="text-xl font-bold text-white mb-8">Platform Kill Switches</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'enableRepairModule', label: 'Service & Repair Hub', desc: 'Core ticket and technician management workflow.' },
                { id: 'enableECommerce', label: 'E-Commerce Engine', desc: 'Direct product sales and marketplace listing.' },
                { id: 'enableWarrantySystem', label: 'Digital Warranty Guard', desc: 'IMEI-based warranty and abuse protection.' },
                { id: 'enableMultiCurrency', label: 'Multi-Currency Support', desc: 'Support for USD/MYR alongside IDR.' },
              ].map(f => (
                <div key={f.id} className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                   <div className="max-w-[70%]">
                      <p className="text-sm font-bold text-white mb-1">{f.label}</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{f.desc}</p>
                   </div>
                   <button 
                      onClick={() => handleUpdateConfig({ features: { ...config.features, [f.id]: !(config.features as any)[f.id] } })}
                      className={`w-14 h-7 rounded-full relative transition-all duration-300 ${ (config.features as any)[f.id] ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'bg-slate-800'}`}
                   >
                      <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all ${ (config.features as any)[f.id] ? 'right-1.5' : 'left-1.5'}`}></div>
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {integrations.map(int => (
             <div key={int.id} className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400">
                         {int.category === 'payment' && <ICONS.Ticket className="w-6 h-6" />}
                         {int.category === 'email' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                         {int.category === 'sms' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
                         {int.category === 'analytics' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-white">{int.provider}</h4>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{int.category}</span>
                      </div>
                   </div>
                   <button 
                    onClick={() => handleUpdateIntegration({ ...int, status: int.status === 'active' ? 'inactive' : 'active' })}
                    className={`px-3 py-1 rounded text-[8px] font-black uppercase transition-all ${int.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}
                   >
                     {int.status}
                   </button>
                </div>
                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-500 uppercase">Provider API Key</label>
                      <input type="password" value={int.apiKey || ''} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" readOnly />
                   </div>
                   {int.webhookUrl && (
                      <div className="space-y-1">
                         <label className="text-[8px] font-black text-slate-500 uppercase">Webhook Endpoint</label>
                         <input type="text" value={int.webhookUrl} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-[9px] text-slate-400 font-mono" readOnly />
                      </div>
                   )}
                </div>
                <div className="mt-6 flex justify-end">
                   <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Configure Params</button>
                </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="max-w-3xl space-y-8">
           <div className="p-8 bg-rose-600/5 border border-rose-500/20 rounded-3xl">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600/10 text-rose-500 flex items-center justify-center animate-pulse">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-white tracking-tight text-rose-500">Global Maintenance Mode</h3>
                       <p className="text-sm text-slate-500">Disable all store frontend and dashboard access for non-admins.</p>
                    </div>
                 </div>
                 <button 
                    onClick={() => handleUpdateConfig({ maintenance: { ...config.maintenance, isEnabled: !config.maintenance.isEnabled } })}
                    className={`w-16 h-8 rounded-full relative transition-all duration-500 ${config.maintenance.isEnabled ? 'bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.4)]' : 'bg-slate-800'}`}
                 >
                    <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all ${config.maintenance.isEnabled ? 'right-2' : 'left-2'}`}></div>
                 </button>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Public Notice Message</label>
                    <textarea 
                      rows={3} 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-rose-500"
                      value={config.maintenance.message}
                      onChange={e => handleUpdateConfig({ maintenance: { ...config.maintenance, message: e.target.value } })}
                    ></textarea>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bypass IP Whitelist</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                       {config.maintenance.allowedIps.map(ip => (
                         <span key={ip} className="px-3 py-1 bg-slate-900 text-emerald-400 rounded-lg text-[10px] font-mono font-bold border border-slate-800">{ip}</span>
                       ))}
                    </div>
                    <button className="px-6 py-2 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-all border border-slate-700">Add bypass IP</button>
                 </div>
              </div>
           </div>

           <div className="glass-panel p-8 rounded-3xl border-slate-800">
              <h4 className="text-sm font-bold text-white mb-4">Emergency Data Export</h4>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">In case of platform failure or node migration, generate a full ecosystem snapshot (JSON). This process will heavily strain the Sumatra regional servers.</p>
              <button className="w-full py-4 bg-slate-800 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-slate-700">Snapshot Full Ecosystem</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default SystemConfig;
