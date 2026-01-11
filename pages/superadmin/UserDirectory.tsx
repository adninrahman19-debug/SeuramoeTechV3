
import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { ICONS } from '../../constants';
import AuthService from '../../auth/AuthService';

interface UserDirectoryProps {
  users: User[];
  onRefresh: () => void;
  onOpenDetails: (user: User) => void;
}

const UserDirectory: React.FC<UserDirectoryProps> = ({ users, onRefresh, onOpenDetails }) => {
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => {
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleStatusChange = (userId: string, status: any) => {
    AuthService.updateUserStatus(userId, status);
    onRefresh();
  };

  const handleVerify = (userId: string) => {
    AuthService.updateUserStatus(userId, 'active');
    // In a real app we'd set isVerified: true
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-sm">
          <ICONS.Dashboard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Cari nama atau username..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['ALL', ...Object.values(UserRole)].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filterRole === role ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-800'}`}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-5">Identity & Security</th>
                <th className="px-6 py-5">Role & Access</th>
                <th className="px-6 py-5">Platform Status</th>
                <th className="px-6 py-5">Last Activity</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/20 group transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => onOpenDetails(u)}>
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt="avatar" />
                        </div>
                        {u.status === 'active' && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>}
                      </div>
                      <div className="overflow-hidden max-w-[150px]">
                        <p className="text-sm font-bold text-white truncate">{u.fullName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                        u.role === UserRole.SUPER_ADMIN ? 'bg-indigo-500/10 text-indigo-400' :
                        u.role === UserRole.STORE_OWNER ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                      {u.subscriptionTier && <p className="text-[9px] text-indigo-500 font-bold uppercase">{u.subscriptionTier} PLAN</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                       <span className={`w-fit px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                         u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                         u.status === 'suspended' ? 'bg-amber-500/10 text-amber-500' :
                         u.status === 'banned' ? 'bg-rose-500/10 text-rose-400' :
                         'bg-slate-800 text-slate-500'
                       }`}>
                         {u.status}
                       </span>
                       {u.role === UserRole.STORE_OWNER && !u.isVerified && (
                         <button onClick={() => handleVerify(u.id)} className="text-[9px] font-bold text-amber-500 underline text-left">Verify Now</button>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-white">{u.lastIp || 'N/A'}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-tighter truncate max-w-[100px]">{u.device || 'Unknown Device'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => onOpenDetails(u)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-all group-hover:bg-slate-700" title="Security & Logs">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                       </button>
                       <div className="relative group/menu">
                          <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all group-hover:bg-slate-700">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                          </button>
                          <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all z-50 p-1">
                             <button onClick={() => handleStatusChange(u.id, u.status === 'active' ? 'suspended' : 'active')} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                               {u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                             </button>
                             <button className="w-full text-left px-3 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">Reset Password</button>
                             <button className="w-full text-left px-3 py-2 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg transition-colors">Force Logout</button>
                             <div className="h-px bg-slate-800 my-1"></div>
                             <button onClick={() => { if(confirm('Delete user?')) AuthService.deleteUser(u.id); onRefresh(); }} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-600 hover:text-rose-500 hover:bg-slate-800 rounded-lg transition-colors">Permanent Delete</button>
                          </div>
                       </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-20 text-center text-slate-600 italic">No users found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default UserDirectory;
