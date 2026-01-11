
import React, { useState, useEffect } from 'react';
import DevToolService from '../../services/DevToolService';
import { ApiKey, WebhookConfig, BackgroundJob, SystemMetric } from '../../types';
import { ICONS } from '../../constants';

const DevTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'api' | 'webhooks' | 'jobs' | 'health'>('api');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [jobs, setJobs] = useState<BackgroundJob[]>([]);
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [errors, setErrors] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setApiKeys(DevToolService.getApiKeys());
    setWebhooks(DevToolService.getWebhooks());
    setJobs(DevToolService.getJobs());
    setMetrics(DevToolService.getSystemMetrics());
    setErrors(DevToolService.getErrorLogs());
  };

  const handleCreateKey = () => {
    const name = prompt("Enter key name (e.g. ERP Integration):");
    if (name) {
      DevToolService.addApiKey(name);
      loadData();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 font-mono text-xs">{'/>'}</div>
            Developer Tools
          </h2>
          <p className="text-sm text-slate-500">Manage API access, infrastructure automation, and technical integrity.</p>
        </div>
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
           {(['api', 'webhooks', 'jobs', 'health'] as const).map(t => (
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

      {activeTab === 'api' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white tracking-tight">API Key Management</h3>
              <button 
                onClick={handleCreateKey}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20"
              >
                + Generate New Key
              </button>
           </div>
           <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                       <th className="px-6 py-5">Key Name</th>
                       <th className="px-6 py-5">Access Prefix</th>
                       <th className="px-6 py-5">Last Used</th>
                       <th className="px-6 py-5">Status</th>
                       <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                    {apiKeys.map(key => (
                       <tr key={key.id} className="hover:bg-slate-800/20 group transition-all font-mono">
                          <td className="px-6 py-4">
                             <p className="text-sm font-bold text-white font-sans">{key.name}</p>
                             <p className="text-[10px] text-slate-500 mt-1">Created: {new Date(key.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <span className="bg-slate-950 px-2 py-1 rounded text-indigo-400 text-xs border border-slate-800">
                                  {key.keyPrefix}••••••••
                                </span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <p className="text-xs text-slate-400">{key.lastUsed || 'Never'}</p>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                               key.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                             }`}>
                               {key.status}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             {key.status === 'active' && (
                               <button 
                                 onClick={() => { if(confirm("Revoke key?")) DevToolService.revokeKey(key.id); loadData(); }}
                                 className="text-[9px] font-black uppercase text-rose-500 hover:text-rose-400 transition-colors"
                               >
                                 Revoke
                               </button>
                             )}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-bold text-white">Event Webhooks</h3>
              {webhooks.map(wh => (
                <div key={wh.id} className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4 hover:border-indigo-500/30 transition-all group">
                   <div className="flex justify-between items-start">
                      <div className="max-w-[70%]">
                         <p className="text-xs font-mono text-emerald-400 truncate mb-1">{wh.url}</p>
                         <p className="text-[10px] text-slate-500 font-black uppercase">Secret: {wh.secret.substr(0, 10)}•••••</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase border ${wh.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                        {wh.status}
                      </span>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {wh.events.map(ev => (
                        <span key={ev} className="px-2 py-1 bg-slate-950 text-slate-400 border border-slate-800 rounded text-[9px] font-mono">{ev}</span>
                      ))}
                   </div>
                   <div className="flex justify-end gap-2 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest px-4 py-2 hover:bg-slate-800 rounded-lg">Test Delivery</button>
                      <button className="text-[9px] font-black text-rose-500 uppercase tracking-widest px-4 py-2 hover:bg-rose-500/10 rounded-lg">Delete</button>
                   </div>
                </div>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 text-[10px] font-black uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-400 transition-all">
                + Connect New Webhook Endpoints
              </button>
           </div>
           <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border-slate-800 bg-indigo-600/5">
                 <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Available Events</h4>
                 <div className="space-y-2">
                    {['ticket.created', 'ticket.assigned', 'ticket.completed', 'inventory.low', 'order.paid', 'subscription.failed'].map(ev => (
                      <div key={ev} className="flex items-center justify-between text-[10px] py-1 border-b border-slate-800 last:border-0">
                         <span className="text-indigo-400 font-mono">{ev}</span>
                         <span className="text-slate-600">v1</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map(job => (
                 <div key={job.id} className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-white">{job.name}</p>
                          <p className="text-[9px] text-slate-500 font-mono">{job.id} • Started {new Date(job.startedAt).toLocaleTimeString()}</p>
                       </div>
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                         job.status === 'running' ? 'bg-blue-500 text-white animate-pulse' :
                         job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                         job.status === 'failed' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-500'
                       }`}>
                         {job.status}
                       </span>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[9px] font-bold text-slate-500">
                          <span>Progress</span>
                          <span className="text-white">{job.progress}%</span>
                       </div>
                       <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            className={`h-full transition-all duration-1000 ${job.status === 'failed' ? 'bg-rose-500' : 'bg-indigo-500'}`}
                            style={{ width: `${job.progress}%` }}
                          ></div>
                       </div>
                    </div>
                    {job.duration && <p className="text-[9px] text-slate-600 font-bold mt-4">Run Time: {job.duration}</p>}
                 </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map(m => (
                 <div key={m.label} className="glass-panel p-6 rounded-3xl border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{m.label}</p>
                       <div className={`w-1.5 h-1.5 rounded-full ${m.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-6">
                       <span className="text-3xl font-black text-white">{m.value}</span>
                       <span className="text-xs font-bold text-slate-600">{m.unit}</span>
                    </div>
                    <div className="flex gap-1 h-8 items-end">
                       {m.history.map((h, i) => (
                         <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-sm transition-all hover:bg-indigo-500/60" style={{ height: `${(h/100)*100}%` }}></div>
                       ))}
                    </div>
                 </div>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border-slate-800">
                 <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                   Technical Error Stream (24h)
                 </h3>
                 <div className="space-y-3">
                    {errors.map(err => (
                       <div key={err.id} className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-rose-500/30 transition-all">
                          <div className="flex items-center gap-4">
                             <span className="text-xs font-mono font-black text-rose-500">HTTP {err.code}</span>
                             <div className="h-6 w-px bg-slate-800 hidden md:block"></div>
                             <div>
                                <p className="text-xs font-bold text-white">{err.path}</p>
                                <p className="text-[10px] text-slate-500 italic mt-0.5">{err.message}</p>
                             </div>
                          </div>
                          <p className="text-[9px] text-slate-600 font-bold uppercase">{err.timestamp}</p>
                       </div>
                    ))}
                 </div>
                 <button className="w-full mt-6 py-3 bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl hover:bg-slate-700 transition-all">
                    Access Sentry / Datadog Mirror
                 </button>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-slate-800 bg-emerald-500/5">
                 <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-6">Database Health</h3>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black text-slate-500">
                          <span>STORAGE USED</span>
                          <span className="text-white">1.2 TB / 5 TB</span>
                       </div>
                       <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-emerald-500 w-[24%]"></div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black text-slate-500">
                          <span>ACTIVE WORKERS</span>
                          <span className="text-white">8 / 12 Nodes</span>
                       </div>
                       <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-indigo-500 w-[66%]"></div>
                       </div>
                    </div>
                    <div className="pt-4 border-t border-slate-800/50">
                       <button className="w-full py-3 bg-slate-800 hover:bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/10">Vacuum & Optimize Tables</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DevTools;
