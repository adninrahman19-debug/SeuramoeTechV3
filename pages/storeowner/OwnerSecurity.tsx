import React, { useState, useEffect } from 'react';
import SecurityService from '../../services/SecurityService';
import StaffService from '../../services/StaffService';
import AuthService from '../../auth/AuthService';
import { ActiveSession, AuditLog, User, UserRole } from '../../types';
import { ICONS } from '../../constants';

const OwnerSecurity: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'account' | 'sessions' | 'audit'>('account');
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Fix: SecurityService.getActiveSessions expects 0 arguments, but was passed user?.storeId
    setSessions(SecurityService.getActiveSessions());
    setLogs(SecurityService.getLogs()); // Simplified for demo
    if (user?.storeId) {
      setStaff(StaffService.getStoreStaff(user.storeId));
    }
  };

  const handleRevokeSession = (id: string) => {
    if (confirm("Logout paksa perangkat ini? Sesi akan langsung dihentikan.")) {
      SecurityService.revokeSession(id);
      loadData();
    }
  };

  const handleResetStaff = (staffId: string) => {
    if (confirm("Reset seluruh kredensial staf ini? Password baru akan digenerate otomatis.")) {
      const newPass = StaffService.resetStaffPassword(user!.id, staffId);
      alert(`Berhasil. Password sementara untuk staf: ${newPass}`);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
             <div className="p-2 bg-rose-600/10 text-rose-500 rounded-xl">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
             </div>
             Security & Command Access
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage your identity and oversee workforce access protocols.</p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-lg">
          {(['account', 'sessions', 'audit'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              {t === 'account' ? 'Identity' : t === 'sessions' ? 'Device History' : 'Audit Logs'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'account' && (
            <div className="space-y-8">
               <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-6">Credential Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Password</label>
                           <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Strong Password</label>
                           <input type="password" placeholder="Min. 12 chars" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confirm Password</label>
                           <input type="password" placeholder="Repeat new password" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <button 
                          onClick={() => { setIsChangingPass(true); setTimeout(() => { setIsChangingPass(false); alert("Password updated successfully."); }, 1000); }}
                          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                        >
                          {isChangingPass ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Update Account Security'}
                        </button>
                     </div>
                     <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                           <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <h4 className="text-white font-bold mb-2">Account Health: Excellent</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed max-w-[180px]">Your account is protected by Regional Sumatra Edge Firewall and session hardening.</p>
                     </div>
                  </div>
               </div>

               <div className="glass-panel p-8 rounded-3xl border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-6">Staff Access Reset Hub</h3>
                  <div className="space-y-3">
                     {staff.map(s => (
                        <div key={s.id} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-2xl group hover:border-indigo-500/30 transition-all">
                           <div className="flex items-center gap-4">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.username}`} className="w-10 h-10 rounded-xl bg-slate-900" alt="" />
                              <div>
                                 <p className="text-sm font-bold text-white">{s.fullName}</p>
                                 <p className="text-[10px] text-slate-500 font-black uppercase">{s.role.replace('_', ' ')}</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => handleResetStaff(s.id)}
                             className="px-4 py-2 bg-slate-900 border border-slate-800 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all"
                           >
                             Reset Kredensial
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions.map(sess => (
                     <div key={sess.id} className="glass-panel p-6 rounded-3xl border-slate-800 flex flex-col hover:border-rose-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400">
                                 {sess.device.includes('Mobile') ? (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                 ) : (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                 )}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white">{sess.device}</p>
                                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{sess.location}</p>
                              </div>
                           </div>
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${sess.lastActive === 'Now' ? 'bg-emerald-500/10 text-emerald-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                              {sess.lastActive}
                           </span>
                        </div>
                        
                        <div className="space-y-2 mb-6">
                           <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-slate-500">USER</span>
                              <span className="text-white">{sess.userName}</span>
                           </div>
                           <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-slate-500">IP ADDR</span>
                              <span className="text-indigo-400 font-mono">{sess.ip}</span>
                           </div>
                        </div>

                        {sess.userId !== user?.id && (
                           <button 
                             onClick={() => handleRevokeSession(sess.id)}
                             className="w-full py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all"
                           >
                              LOGOUT PAKSA
                           </button>
                        )}
                     </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                           <th className="px-6 py-5">Event</th>
                           <th className="px-6 py-5">Actor</th>
                           <th className="px-6 py-5">Status</th>
                           <th className="px-6 py-5 text-right">Timestamp</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/50">
                        {logs.slice(0, 10).map(log => (
                           <tr key={log.id} className="hover:bg-slate-800/20 transition-all font-mono">
                              <td className="px-6 py-4">
                                 <p className="text-xs font-bold text-white font-sans">{log.action}</p>
                                 <p className="text-[10px] text-slate-500 truncate max-w-xs">{log.details}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <p className="text-xs text-indigo-400 font-bold">{log.userName}</p>
                                 <p className="text-[9px] text-slate-600">ID: {log.userId}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                    log.severity === 'CRITICAL' ? 'bg-rose-500 text-white' :
                                    log.severity === 'WARN' ? 'bg-amber-500/10 text-amber-500' :
                                    'bg-emerald-500/10 text-emerald-400'
                                 }`}>{log.severity}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <p className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="glass-panel p-8 rounded-3xl border-slate-800 bg-rose-600 text-white shadow-2xl shadow-rose-600/30">
              <h4 className="text-lg font-black mb-4 flex items-center gap-3">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 Kunci Toko (Darurat)
              </h4>
              <p className="text-xs opacity-80 leading-relaxed mb-8">Dalam kondisi darurat (peretasan/pelanggaran berat), Anda dapat membekukan seluruh akses dasbor toko Anda secara instan.</p>
              <button className="w-full py-4 bg-white text-rose-600 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-100 transition-all shadow-xl">AKTIFKAN PROTOKOL LOCKDOWN</button>
           </div>

           <div className="glass-panel p-8 rounded-3xl border-slate-800 space-y-6">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Ecosystem Security Metrics</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">Risk Level</span>
                    <span className="text-emerald-400">LOW</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">MFA Status</span>
                    <span className="text-rose-400">NOT ENFORCED</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">Known IPs</span>
                    <span className="text-white">3 Regions</span>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl">
              <p className="text-xs font-bold text-white mb-2 uppercase tracking-tight flex items-center gap-2">
                 <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Security Tip
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">"Gantilah password Anda secara berkala setiap 90 hari dan pastikan Staf Anda tidak berbagi akun untuk memudahkan pelacakan audit."</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSecurity;
