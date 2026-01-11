
import React, { useState, useEffect } from 'react';
import StaffService from '../../services/StaffService';
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
      fullName: '',
      username: '',
      email: '',
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
    if (!form.fullName || !form.username || !form.email) {
      alert("Harap lengkapi semua data wajib.");
      return;
    }

    if (drawerMode === 'add') {
      if (confirm(`Daftarkan ${form.fullName} sebagai staf toko?`)) {
        StaffService.addStaffMember(currentUser!.id, form as any);
        alert("Akun staf baru berhasil dibuat.");
        setIsDrawerOpen(false);
        loadData();
      }
    } else if (selectedMember) {
      if (confirm(`Simpan perubahan profil untuk ${selectedMember.fullName}?`)) {
        StaffService.updateStaffMember(currentUser!.id, selectedMember.id, form);
        alert("Informasi staf berhasil diperbarui.");
        setIsDrawerOpen(false);
        loadData();
      }
    }
  };

  const handleResetPassword = (id: string, name: string) => {
    if (confirm(`Paksa reset kata sandi untuk ${name}? Sesi aktif mereka akan berakhir.`)) {
      const newPass = StaffService.resetStaffPassword(currentUser!.id, id);
      alert(`Berhasil. Password sementara baru: ${newPass}`);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`PERINGATAN KRITIS: Hentikan akses platform untuk ${name} secara permanen? Akun akan dihapus dari node lokal toko.`)) {
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
        title={drawerMode === 'add' ? "Rekrut Staf Toko" : drawerMode === 'edit' ? "Edit Profil Staf" : "Laporan Intelijen Staf"}
      >
        {(drawerMode === 'add' || drawerMode === 'edit') && (
          <div className="space-y-6">
            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Lengkap Staf</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={form.fullName || ''} onChange={e => setForm({...form, fullName: e.target.value})} />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Username Akses</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={form.username || ''} onChange={e => setForm({...form, username: e.target.value})} />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Peran / Role</label>
                  <select className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none" value={form.role} onChange={e => setForm({...form, role: e.target.value as UserRole})}>
                    <option value={UserRole.STAFF_ADMIN}>Admin Operasional</option>
                    <option value={UserRole.TECHNICIAN}>Teknisi Spesialis</option>
                    <option value={UserRole.MARKETING}>Staf Marketing</option>
                  </select>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Bisnis</label>
                  <input type="email" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} />
               </div>
            </div>
            <button onClick={handleSave} className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs rounded-2xl hover:bg-indigo-500 shadow-xl">Simpan Akun Staf</button>
          </div>
        )}

        {drawerMode === 'details' && selectedMember && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
             <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 overflow-hidden mb-4">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedMember.username}`} alt="" />
                </div>
                <h3 className="text-xl font-bold text-white">{selectedMember.fullName}</h3>
                <span className="text-[10px] text-indigo-400 font-black uppercase mt-1">{selectedMember.role.replace('_', ' ')}</span>
             </div>
             <div className="space-y-4 pt-8 border-t border-slate-800">
                <button onClick={() => { setForm({...selectedMember}); setDrawerMode('edit'); }} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase rounded-xl">Ubah Profil Staf</button>
                <button onClick={() => handleResetPassword(selectedMember.id, selectedMember.fullName)} className="w-full py-3 bg-slate-900 border border-slate-800 text-amber-500 text-[10px] font-black uppercase rounded-xl">Paksa Reset Password</button>
                <button onClick={() => handleDelete(selectedMember.id, selectedMember.fullName)} className="w-full py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase rounded-xl">Hapus Dari Node Toko</button>
             </div>
          </div>
        )}
      </RightDrawer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <StatCard label="Tenaga Kerja Aktif" value={staff.length} icon={<ICONS.Users />} colorClass="indigo" />
         <StatCard label="Skor Performa Rata-rata" value="92%" icon={<ICONS.Dashboard />} colorClass="emerald" />
         <StatCard label="Izin Akses" value="Terverifikasi" trend="RBAC AKTIF" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg>} colorClass="violet" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full md:w-96">
           <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
           <input type="text" placeholder="Cari nama staf..." className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={handleOpenAdd} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl flex items-center gap-2">
           <ICONS.Plus className="w-4 h-4" /> Rekrut Staf Baru
        </button>
      </div>

      <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                     <th className="px-6 py-5">Identitas Staf</th>
                     <th className="px-6 py-5">Role Utama</th>
                     <th className="px-6 py-5">Status Node</th>
                     <th className="px-6 py-5 text-right">Aksi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                  {filteredStaff.map(member => (
                    <tr key={member.id} className="hover:bg-slate-800/20 group transition-all cursor-pointer" onClick={() => handleOpenDetails(member)}>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`} className="w-10 h-10 rounded-xl bg-slate-900" alt="" />
                             <div>
                                <p className="text-sm font-bold text-white">{member.fullName}</p>
                                <p className="text-[10px] text-slate-500 font-mono">@{member.username}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                             member.role === UserRole.TECHNICIAN ? 'bg-amber-500/10 text-amber-500' :
                             member.role === UserRole.STAFF_ADMIN ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-500'
                          }`}>{member.role.replace('_', ' ')}</span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                             Aktif
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button className="p-2.5 bg-slate-900 border border-slate-800 text-slate-500 group-hover:text-white rounded-xl transition-all"><ICONS.Settings className="w-4 h-4" /></button>
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

export default StaffControl;
