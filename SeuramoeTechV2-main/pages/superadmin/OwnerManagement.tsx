
import React from 'react';
import { User } from '../../types';
import AuthService from '../../auth/AuthService';

interface OwnerManagementProps {
  owners: User[];
  onImpersonate: (id: string) => void;
  onLock: (id: string, currentStatus: string) => void;
  onRefresh: () => void;
}

const OwnerManagement: React.FC<OwnerManagementProps> = ({ owners, onImpersonate, onLock, onRefresh }) => {
  const handleApprove = (id: string) => {
    AuthService.updateUserStatus(id, 'active');
    onRefresh();
  };

  const handleAssignManager = (id: string) => {
    const name = prompt("Enter Account Manager Name:");
    if (name) {
      AuthService.assignAccountManager(id, name);
      onRefresh();
    }
  };

  return (
    <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl animate-in slide-in-from-right-4 duration-500">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Store Owner Directory</h3>
        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{owners.length} Active Owners</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
              <th className="px-6 py-5">Identity</th>
              <th className="px-6 py-5">Performance</th>
              <th className="px-6 py-5">Management</th>
              <th className="px-6 py-5 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {owners.map(user => (
              <tr key={user.id} className="hover:bg-slate-800/20 group transition-all">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shadow-lg">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="avatar" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{user.fullName}</p>
                        {user.status === 'pending' && <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black rounded uppercase border border-amber-500/20">Awaiting Approval</span>}
                      </div>
                      <p className="text-[10px] text-slate-500">@{user.username} • {user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center w-24">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Health</span>
                      <span className={`text-[10px] font-black ${user.performanceScore && user.performanceScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {user.performanceScore || 0}%
                      </span>
                    </div>
                    <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${user.performanceScore && user.performanceScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${user.performanceScore || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-white font-bold">{user.accountManager || 'None Assigned'}</p>
                    <button 
                      onClick={() => handleAssignManager(user.id)}
                      className="text-[9px] text-indigo-400 font-black uppercase tracking-widest hover:text-white transition-colors text-left"
                    >
                      {user.accountManager ? 'Change Manager' : 'Assign Manager'}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                     {user.status === 'pending' ? (
                       <button onClick={() => handleApprove(user.id)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg transition-all shadow-lg shadow-emerald-600/20">APPROVE</button>
                     ) : (
                       <>
                         <button onClick={() => onImpersonate(user.id)} className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-indigo-600/10" title="Impersonate Dashboard">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                         </button>
                         <button onClick={() => onLock(user.id, user.status)} className={`p-2 rounded-lg transition-all ${user.status === 'suspended' ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400'}`} title={user.status === 'active' ? 'Suspend Account' : 'Unsuspend Account'}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                         </button>
                       </>
                     )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerManagement;
