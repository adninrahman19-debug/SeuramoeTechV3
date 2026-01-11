
import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { ICONS } from '../../constants';
import AuthService from '../../auth/AuthService';

interface UserDirectoryProps {
  users: User[];
  onRefresh: () => void;
  onOpenDetails: (user: User) => void;
  onAddUser: () => void;
}

const UserDirectory: React.FC<UserDirectoryProps> = ({ users, onRefresh, onOpenDetails, onAddUser }) => {
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => {
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleStatusToggle = (user: User) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    const actionText = nextStatus === 'active' ? 'mengaktifkan kembali' : 'menonaktifkan (suspend)';
    
    if (confirm(`Apakah Anda yakin ingin ${actionText} akun ${user.fullName}?`)) {
      AuthService.updateUserStatus(user.id, nextStatus);
      onRefresh();
    }
  };

  const handleApprove = (user: User) => {
    if (confirm(`Setujui registrasi Owner untuk ${user.fullName}?`)) {
      AuthService.updateUserStatus(user.id, 'active');
      onRefresh();
    }
  };

  const handleDelete = (user: User) => {
    if (confirm(`PERINGATAN: Hapus akun ${user.fullName} secara permanen? Data yang terkait mungkin akan hilang.`)) {
      AuthService.deleteUser(user.id);
      onRefresh();
    }
  };

  const handleImpersonate = (user: User) => {
    if (confirm(`Masuk ke dashboard sebagai ${user.fullName}? Sesi Anda saat ini akan disimpan.`)) {
      AuthService.impersonate(user.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
          <input 
            type="text" 
            placeholder="Cari nama atau username..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onAddUser}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
          >
            <ICONS.Plus className="w-4 h-4" /> Tambah Pengguna
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {['ALL', ...Object.values(UserRole)].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${filterRole === role ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-900 text-slate-500 hover:text-slate-300 border-slate-800'}`}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
      </div>

      <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-5">Identitas & Keamanan</th>
                <th className="px-6 py-5">Peran & Akses</th>
                <th className="px-6 py-5">Status Platform</th>
                <th className="px-6 py-5">Terakhir Aktif</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/20 group transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => onOpenDetails(u)}>
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt="avatar" />
                      </div>
                      <div className="overflow-hidden max-w-[150px]">
                        <p className="text-sm font-bold text-white truncate">{u.fullName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                      u.role === UserRole.SUPER_ADMIN ? 'bg-indigo-500/10 text-indigo-400' :
                      u.role === UserRole.STORE_OWNER ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                      u.status === 'suspended' ? 'bg-rose-500/10 text-rose-500' :
                      u.status === 'pending' ? 'bg-amber-500/10 text-amber-500 animate-pulse' :
                      'bg-slate-800 text-slate-500'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[10px] font-bold text-white">{u.lastIp || '127.0.0.1'}</p>
                    <p className="text-[9px] text-slate-500 uppercase">{u.device || 'Web UI'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       {u.status === 'pending' && (
                         <button onClick={() => handleApprove(u)} className="p-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition-all" title="Setujui Akun">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         </button>
                       )}
                       {u.role !== UserRole.SUPER_ADMIN && (
                         <button onClick={() => handleImpersonate(u)} className="p-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-all" title="Impersonate Dashboard">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                         </button>
                       )}
                       <button onClick={() => onOpenDetails(u)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-all group-hover:bg-slate-700" title="Edit Profil">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                       </button>
                       <button onClick={() => handleStatusToggle(u)} className={`p-2 rounded-lg transition-all ${u.status === 'suspended' ? 'bg-amber-600/20 text-amber-500 hover:bg-amber-600 hover:text-white' : 'bg-slate-800 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400'}`} title={u.status === 'active' ? 'Suspend Akun' : 'Aktifkan Akun'}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                       </button>
                       <button onClick={() => handleDelete(u)} className="p-2 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-lg transition-all" title="Hapus Permanen">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDirectory;
