
import React, { useState, useEffect } from 'react';
import SecurityService from '../../services/SecurityService';
import { AuditLog, AuditCategory, SecurityPolicy, IpRule, ActiveSession } from '../../types';
import { ICONS } from '../../constants';

const SecurityAudit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'controls' | 'sessions'>('audit');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [policy, setPolicy] = useState<SecurityPolicy>(SecurityService.getPolicy());
  const [ipRules, setIpRules] = useState<IpRule[]>([]);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLogs(SecurityService.getLogs());
    setIpRules(SecurityService.getIpRules());
    setSessions(SecurityService.getActiveSessions());
  };

  const handleUpdatePolicy = (updates: Partial<SecurityPolicy>) => {
    const newPolicy = { ...policy, ...updates };
    setPolicy(newPolicy);
    SecurityService.updatePolicy(newPolicy);
  };

  const handleAddIp = () => {
    const ip = prompt("Enter IP or Range (e.g. 1.2.3.*):");
    const reason = prompt("Enter Reason:");
    if (ip && reason) {
      SecurityService.addIpRule({ ip, type: 'BLACKLIST', reason, addedBy: 'Super Admin' });
      loadData();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white">Security & Audit HQ</h2>
          <p className="text-sm text-slate-500">Enterprise-grade platform hardening and activity forensic trails.</p>
        </div>
        <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
           {(['audit', 'controls', 'sessions'] as const).map(t => (
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

      {activeTab === 'audit' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <div className="flex gap-2">
                 <select className="bg-slate-900 border border-slate-800 text-[10px] font-black uppercase text-slate-400 px-4 py-2 rounded-xl outline-none">
                    <option>All Categories</option>
                    {Object.values(AuditCategory).map(c => <option key={c}>{c}</option>)}
                 </select>
                 <button className="px-4 py-2 bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl border border-slate-700">Filter Date Range</button>
              </div>
              <button onClick={() => alert('Streaming real-time logs to console...')} className="px-4 py-2 bg-indigo-600/10 text-indigo-400 text-[10px] font-black uppercase rounded-xl border border-indigo-500/20 animate-pulse">Live Stream</button>
           </div>

           <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                       <th className="px-6 py-5">Event Detail</th>
                       <th className="px-6 py-5">Originator</th>
                       <th className="px-6 py-5">Category</th>
                       <th className="px-6 py-5">Origin IP</th>
                       <th className="px-6 py-5 text-right">Time</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                    {logs.map(log => (
                       <tr key={log.id} className="hover:bg-slate-800/20 transition-all font-mono">
                          <td className="px-6 py-4">
                             <div className="space-y-1">
                                <p className={`text-xs font-bold ${log.severity === 'CRITICAL' ? 'text-rose-500' : log.severity === 'WARN' ? 'text-amber-500' : 'text-white'}`}>
                                   {log.action}
                                </p>
                                <p className="text-[10px] text-slate-500 italic max-w-sm truncate">{log.details}</p>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <p className="text-xs text-indigo-400 font-bold">{log.userName}</p>
                             <p className="text-[9px] text-slate-600">ID: {log.userId}</p>
                          </td>
                          <td className="px-6 py-4">
                             <span className="bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">{log.category}</span>
                          </td>
                          <td className="px-6 py-4">
                             <p className="text-[10px] text-slate-400 font-bold">{log.ip}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <p className="text-[10px] text-slate-500 font-medium">{new Date(log.timestamp).toLocaleTimeString()}</p>
                             <p className="text-[9px] text-slate-600">{new Date(log.timestamp).toLocaleDateString()}</p>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'controls' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-8">
              <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-xl">
                 <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Hardening Policy
                 </h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                       <div>
                          <p className="text-xs font-bold text-white uppercase tracking-widest">Enforce Multi-Factor (MFA)</p>
                          <p className="text-[10px] text-slate-500">Require all Super Admins & Owners to use 2FA.</p>
                       </div>
                       <button 
                        onClick={() => handleUpdatePolicy({ mfaRequired: !policy.mfaRequired })}
                        className={`w-12 h-6 rounded-full relative transition-all ${policy.mfaRequired ? 'bg-indigo-600' : 'bg-slate-800'}`}
                       >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${policy.mfaRequired ? 'right-1' : 'left-1'}`}></div>
                       </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Min Password Len</label>
                          <input 
                            type="number" 
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                            value={policy.minPasswordLength}
                            onChange={e => handleUpdatePolicy({ minPasswordLength: parseInt(e.target.value) })}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Session Timeout (m)</label>
                          <input 
                            type="number" 
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                            value={policy.sessionTimeoutMinutes}
                            onChange={e => handleUpdatePolicy({ sessionTimeoutMinutes: parseInt(e.target.value) })}
                          />
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                       <div>
                          <p className="text-xs font-bold text-white uppercase tracking-widest">IP Filtering Mode</p>
                          <p className="text-[10px] text-slate-500">Enable strict whitelist/blacklist engine.</p>
                       </div>
                       <button 
                        onClick={() => handleUpdatePolicy({ ipFilteringEnabled: !policy.ipFilteringEnabled })}
                        className={`w-12 h-6 rounded-full relative transition-all ${policy.ipFilteringEnabled ? 'bg-indigo-600' : 'bg-slate-800'}`}
                       >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${policy.ipFilteringEnabled ? 'right-1' : 'left-1'}`}></div>
                       </button>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl">
                 <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-4">Emergency Protocol</h4>
                 <button className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shadow-xl shadow-rose-600/20">FORCE LOGOUT ALL SESSIONS</button>
                 <p className="text-[9px] text-rose-400/60 mt-4 italic text-center">Caution: This will instantly invalidate all active JWTs and Cookies across the platform nodes.</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 015.636 5.636" /></svg>
                    Network Guard
                 </h3>
                 <button onClick={handleAddIp} className="px-4 py-2 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 transition-all">Add IP Rule</button>
              </div>
              <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden">
                 <div className="divide-y divide-slate-800">
                    {ipRules.map(rule => (
                       <div key={rule.id} className="p-5 flex items-center justify-between group hover:bg-slate-950/40 transition-all">
                          <div className="flex items-center gap-4">
                             <div className={`w-2 h-2 rounded-full ${rule.type === 'WHITELIST' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                             <div>
                                <p className="text-xs font-mono font-bold text-white">{rule.ip}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black">{rule.reason}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="text-right">
                                <p className="text-[9px] text-slate-600 font-bold uppercase">{rule.addedBy}</p>
                                <p className="text-[8px] text-slate-700">{new Date(rule.createdAt).toLocaleDateString()}</p>
                             </div>
                             <button 
                                onClick={() => { SecurityService.removeIpRule(rule.id); loadData(); }}
                                className="p-2 opacity-0 group-hover:opacity-100 bg-slate-800 text-slate-500 hover:text-rose-500 rounded-lg transition-all"
                             >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map(sess => (
                 <div key={sess.id} className="glass-panel p-6 rounded-3xl border-slate-800 flex flex-col hover:border-indigo-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-4">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sess.userName}`} className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700" alt="" />
                          <div>
                             <p className="text-sm font-bold text-white">{sess.userName}</p>
                             <p className="text-[9px] text-slate-500 uppercase font-black">{sess.location}</p>
                          </div>
                       </div>
                       <button className="px-3 py-1 bg-rose-600/10 text-rose-500 text-[8px] font-black uppercase rounded hover:bg-rose-600 hover:text-white transition-all">REVOKE</button>
                    </div>
                    <div className="space-y-3 pt-6 border-t border-slate-800/50">
                       <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500 font-bold uppercase">Hardware/UA</span>
                          <span className="text-white truncate max-w-[120px]">{sess.device}</span>
                       </div>
                       <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500 font-bold uppercase">Network IP</span>
                          <span className="text-indigo-400 font-mono">{sess.ip}</span>
                       </div>
                       <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500 font-bold uppercase">Pulse</span>
                          <span className="text-emerald-400 font-black">{sess.lastActive}</span>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default SecurityAudit;
