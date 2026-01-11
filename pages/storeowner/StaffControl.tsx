
import React, { useState, useEffect } from 'react';
import StaffService, { StaffPerformance } from '../../services/StaffService';
import { User, UserRole } from '../../types';
import { ICONS } from '../../constants';
import RightDrawer from '../../components/Shared/RightDrawer';
import AuthService from '../../auth/AuthService';
import StatCard from '../../components/Shared/StatCard';

const StaffControl: React.FC = () => {
  const [staff, setStaff] = useState<User[]>([]);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'details' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [form, setForm] = useState<Partial<User>>({});
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (currentUser?.storeId) {
      setStaff(StaffService.getStoreStaff(currentUser.storeId));
    }
  };

  const handleOpenAdd = () => {
    setForm({ 
      role: UserRole.TECHNICIAN, 
      storeId: currentUser?.storeId,
      status: 'active'
    });
    setDrawerMode('add');
    setIsDrawerOpen(true);
  };

  const handleOpenDetails = (member: User) => {
    setSelectedMember(member);
    setDrawerMode('details');
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (drawerMode === 'add') {
      StaffService.addStaffMember(currentUser!.id, form as any);
    } else if (selectedMember) {
      StaffService.updateStaffMember(currentUser!.id, selectedMember.id, form);
    }
    setIsDrawerOpen(false);
    loadData();
  };

  const handleResetPassword = (id: string) => {
    const newPass = StaffService.resetStaffPassword(currentUser!.id, id);
    alert(`Password reset successful. Temporary password: ${newPass}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Terminate this staff member's platform access? This action is logged.")) {
      StaffService.deleteStaffMember(currentUser!.id, id);
      setIsDrawerOpen(false);
      loadData();
    }
  };

  const filteredStaff = staff.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <RightDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title={drawerMode === 'add' ? "Recruit Store Staff" : drawerMode === 'edit' ? "Edit Staff Profile" : "Staff Intelligence Report"}
      >
        {(drawerMode === 'add' || drawerMode === 'edit') && (
          <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Legal Name</label>
               <input 
                 type="text" 
                 placeholder="Full Name"
                 className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                 value={form.fullName || ''}
                 onChange={e => setForm({...form, fullName: e.target.value})}
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Username</label>
                 <input 
                   type="text" 
                   placeholder="tech_aceh_01"
                   className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-indigo-500" 
                   value={form.username || ''}
                   onChange={e => setForm({...form, username: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Role Assignment</label>
                 <select 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none"
                    value={form.role}
                    onChange={e => setForm({...form, role: e.target.value as UserRole})}
                 >
                    <option value={UserRole.STAFF_ADMIN}>Operations Admin</option>
                    <option value={UserRole.TECHNICIAN}>Technical Specialist</option>
                    <option value={UserRole.MARKETING}>Growth/Marketing</option>
                 </select>
              </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Business Email</label>
               <input 
                 type="email" 
                 placeholder="staff@acehtech.com"
                 className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-indigo-500" 
                 value={form.email || ''}
                 onChange={e => setForm({...form, email: e.target.value})}
               />
            </div>

            <div className="pt-4 space-y-4">
               <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest border-b border-slate-800 pb-2">Operational Access</h4>
               <div className="space-y-2">
                  {['View Inventory', 'Process Sales', 'Execute Repairs', 'Manage Customers'].map(p => (
                    <label key={p} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800 cursor-pointer hover:border-indigo-500/30 transition-all">
                       <span className="text-xs text-slate-300 font-bold">{p}</span>
                       <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
                    </label>
                  ))}
               </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
            >
              {drawerMode === 'add' ? 'Commit Recruitment' : 'Update Profile'}
            </button>
          </div>
        )}

        {drawerMode === 'details' && selectedMember && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
             <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-3xl bg-slate-800 border border-slate-700 overflow-hidden mb-4 shadow-2xl">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedMember.username}`} alt="" />
                </div>
                <h3 className="text-xl font-bold text-white">{selectedMember.fullName}</h3>
                <span className={`mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                   selectedMember.role === UserRole.TECHNICIAN ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                   selectedMember.role === UserRole.STAFF_ADMIN ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                   'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                   {selectedMember.role.replace('_', ' ')}
                </span>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Lifetime Productivity</p>
                   <p className="text-xl font-black text-white">{StaffService.getStaffMetrics(selectedMember.id)?.tasksCompleted || 0}</p>
                   <p className="text-[8px] text-slate-600 font-bold uppercase">Tasks Resolved</p>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Satisfaction Rate</p>
                   <p className="text-xl font-black text-emerald-400">{StaffService.getStaffMetrics(selectedMember.id)?.rating || '0.0'}★</p>
                   <p className="text-[8px] text-slate-600 font-bold uppercase">Customer Grade</p>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Account Management</h4>
                <div className="grid grid-cols-1 gap-2">
                   <button 
                    onClick={() => { setForm(selectedMember); setDrawerMode('edit'); }}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase rounded-xl transition-all"
                   >
                     Edit Profile & Permissions
                   </button>
                   <button 
                    onClick={() => handleResetPassword(selectedMember.id)}
                    className="w-full py-3 bg-slate-900 border border-slate-800 text-amber-500 text-[10px] font-black uppercase rounded-xl hover:bg-amber-600 hover:text-white transition-all"
                   >
                     Force Reset Password
                   </button>
                   <button 
                    onClick={() => handleDelete(selectedMember.id)}
                    className="w-full py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                   >
                     Terminate Account
                   </button>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Recent Forensics</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                   {[
                     { ev: 'Inventory Sync', t: '10m ago' },
                     { ev: 'Ticket #8821 Close', t: '1h ago' },
                     { ev: 'Dashboard Login', t: '4h ago' },
                   ].map((l, i) => (
                     <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-slate-400">{l.ev}</span>
                        <span className="text-slate-600 uppercase">{l.t}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </RightDrawer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <StatCard label="Store Workforce" value={staff.length} icon={<ICONS.Users />} colorClass="indigo" />
         <StatCard label="Average Performance" value="92%" icon={<ICONS.Dashboard />} colorClass="emerald" />
         <StatCard label="Security Node" value="Healthy" trend="RBAC ACTIVE" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg>} colorClass="violet" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full md:w-96">
           <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
           <input 
             type="text" 
             placeholder="Search staff by name or role..." 
             className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
        </div>
        <button 
          onClick={handleOpenAdd}
          className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
        >
           <ICONS.Plus className="w-4 h-4" /> Recuit New Staff
        </button>
      </div>

      <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                     <th className="px-6 py-5">Staff Identity</th>
                     <th className="px-6 py-5">Core Role</th>
                     <th className="px-6 py-5">Performance KPI</th>
                     <th className="px-6 py-5">Security Status</th>
                     <th className="px-6 py-5 text-right">Operations</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                  {filteredStaff.map(member => (
                    <tr key={member.id} className="hover:bg-slate-800/20 group transition-all cursor-pointer" onClick={() => handleOpenDetails(member)}>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`} alt="" />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{member.fullName}</p>
                                <p className="text-[10px] text-slate-500 font-mono tracking-tighter">@{member.username}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                             member.role === UserRole.TECHNICIAN ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                             member.role === UserRole.STAFF_ADMIN ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                             'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                             {member.role.replace('_', ' ')}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-12 bg-slate-950 h-1 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full" style={{ width: `${StaffService.getStaffMetrics(member.id)?.activityScore || 0}%` }}></div>
                             </div>
                             <span className="text-[10px] font-black text-white">{StaffService.getStaffMetrics(member.id)?.activityScore || 0}%</span>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                             Authorized
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button className="p-2.5 bg-slate-900 border border-slate-800 text-slate-500 group-hover:text-white rounded-xl transition-all">
                             <ICONS.Settings className="w-4 h-4" />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {filteredStaff.length === 0 && (
           <div className="p-20 text-center text-slate-600 italic">Workforce directory empty for this store node.</div>
         )}
      </div>
    </div>
  );
};

export default StaffControl;
