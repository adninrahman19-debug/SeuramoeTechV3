
import React, { useState } from 'react';
import { UserRole, Permission, RoleConfig } from '../../types';
import RoleService from '../../services/RoleService';

const RolePermissions: React.FC = () => {
  const [permissions] = useState<Permission[]>(RoleService.getPermissions());
  const [roleConfigs, setRoleConfigs] = useState<RoleConfig[]>(RoleService.getRolesConfig());
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.SUPER_ADMIN);

  const currentRoleConfig = roleConfigs.find(c => c.role === activeRole);

  const togglePermission = (permId: string) => {
    if (!currentRoleConfig) return;
    
    const newPerms = currentRoleConfig.permissions.includes(permId)
      ? currentRoleConfig.permissions.filter(id => id !== permId)
      : [...currentRoleConfig.permissions, permId];
    
    RoleService.updateRolePermissions(activeRole, newPerms);
    setRoleConfigs(RoleService.getRolesConfig());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-right-4 duration-500">
      <div className="lg:col-span-1 space-y-3">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Platform Roles</h3>
        {roleConfigs.map(config => (
          <button
            key={config.role}
            onClick={() => setActiveRole(config.role)}
            className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between group ${activeRole === config.role ? 'border-indigo-600 bg-indigo-600/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
          >
            <div>
              <p className={`text-sm font-black uppercase tracking-widest ${activeRole === config.role ? 'text-indigo-400' : 'text-slate-400'}`}>{config.role.replace('_', ' ')}</p>
              <p className="text-[10px] text-slate-500 font-bold mt-1">{config.permissions.length} Permissions</p>
            </div>
            <div className={`w-2 h-2 rounded-full transition-all group-hover:scale-150`} style={{ backgroundColor: config.color }}></div>
          </button>
        ))}
        <button className="w-full p-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 text-xs font-bold hover:border-indigo-500/50 hover:text-indigo-500 transition-all flex items-center justify-center gap-2">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
           Create Custom Role
        </button>
      </div>

      <div className="lg:col-span-3">
        <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Permissions: {activeRole.replace('_', ' ')}</h2>
              <p className="text-sm text-slate-500 mt-1">Configure granular access for this specific system role.</p>
            </div>
            <button className="px-6 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Apply Global Changes</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['system', 'billing', 'store', 'customer'].map(category => (
              <div key={category} className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 mb-4">{category} Controls</h4>
                <div className="space-y-3">
                  {permissions.filter(p => p.category === category).map(perm => (
                    <label 
                      key={perm.id} 
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${currentRoleConfig?.permissions.includes(perm.id) ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'}`}
                    >
                      <input 
                        type="checkbox" 
                        className="mt-1 w-4 h-4 accent-indigo-600" 
                        checked={currentRoleConfig?.permissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{perm.name}</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{perm.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4 items-center">
           <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <div>
              <p className="text-xs font-bold text-white uppercase tracking-tight">Subscription Enforcement Active</p>
              <p className="text-[10px] text-slate-400">Beberapa izin mungkin dibatasi berdasarkan paket langganan Owner toko (Standard vs Enterprise).</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissions;
