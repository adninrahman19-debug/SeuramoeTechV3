
import React, { useState, useEffect } from 'react';
import AuthService from '../../auth/AuthService';
import ProfileService from '../../services/ProfileService';
import { Address, PaymentMethod, LoginSession, PrivacySettings } from '../../types';
import { ICONS } from '../../constants';

const CustomerProfile: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'account' | 'addresses' | 'payments' | 'security' | 'privacy'>('account');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [privacy, setPrivacy] = useState<PrivacySettings | null>(null);

  // Account Form
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '081233334444');

  // Deletion Reason
  const [deleteReason, setDeleteReason] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAddresses(ProfileService.getAddresses());
    setPayments(ProfileService.getPaymentMethods());
    setSessions(ProfileService.getLoginSessions());
    setPrivacy(ProfileService.getPrivacySettings());
  };

  if (!user) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm("Simpan perubahan profil Anda?")) {
      alert("Profil berhasil diperbarui!");
    }
  };

  const handleRemoveAddress = (id: string, label: string) => {
    if (confirm(`Hapus alamat "${label}" dari daftar pengiriman Anda?`)) {
      ProfileService.deleteAddress(id);
      alert("Alamat dihapus.");
      loadData();
    }
  };

  const handleRemovePayment = (id: string, provider: string) => {
    if (confirm(`Hapus metode pembayaran "${provider}"?`)) {
      ProfileService.deletePaymentMethod(id);
      alert("Metode pembayaran dihapus.");
      loadData();
    }
  };

  const handleLogoutAll = () => {
    if (confirm("PERINGATAN KEAMANAN: Keluarkan semua perangkat lain? Anda akan tetap masuk di perangkat ini. Sesi di HP atau laptop lain akan segera berakhir.")) {
      ProfileService.logoutAllOtherDevices();
      loadData();
      alert("Seluruh sesi di perangkat lain telah dihentikan.");
    }
  };

  const handleTogglePrivacy = (key: keyof PrivacySettings) => {
    if (privacy) {
      const updated = { ...privacy, [key]: !privacy[key] };
      setPrivacy(updated);
      ProfileService.savePrivacySettings(updated);
    }
  };

  const handleDownloadData = () => {
    if (confirm("Unduh seluruh data pribadi Anda dalam format JSON? Data ini mencakup riwayat pesanan, alamat, dan preferensi privasi Anda.")) {
      ProfileService.exportPersonalData();
    }
  };

  const handleDeleteRequest = () => {
    if (!deleteReason) return alert("Mohon berikan alasan penghapusan.");
    if (confirm("PERINGATAN AKHIR: Apakah Anda yakin ingin mengajukan penghapusan akun? Seluruh poin loyalty dan riwayat transaksi Anda akan dianonimkan secara permanen.")) {
      ProfileService.requestAccountDeletion(deleteReason);
      setConfirmDelete(false);
      setDeleteReason('');
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-24">
      {/* Profile Header */}
      <div className="glass-panel p-10 rounded-[3rem] border-slate-800 bg-gradient-to-br from-indigo-600/10 to-transparent flex flex-col md:flex-row items-center text-center md:text-left gap-8 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><ICONS.Users className="w-40 h-40" /></div>
         <div className="w-32 h-32 rounded-[2.5rem] bg-slate-800 border-4 border-slate-900 shadow-2xl overflow-hidden relative group shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
               <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth={2}/></svg>
            </div>
         </div>
         <div className="flex-1">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{user.fullName}</h3>
            <p className="text-sm text-slate-500 font-medium mt-2">{user.email} • Verified Node Member</p>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-2">
               <span className="px-4 py-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">Sumatra Node SUM-N-01</span>
               <span className="px-4 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full">Customer ID: {user.id}</span>
            </div>
         </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-xl overflow-x-auto max-w-full no-scrollbar">
         <button onClick={() => setActiveTab('account')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'account' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Informasi Akun</button>
         <button onClick={() => setActiveTab('addresses')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'addresses' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Alamat Saya</button>
         <button onClick={() => setActiveTab('payments')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'payments' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Metode Pembayaran</button>
         <button onClick={() => setActiveTab('security')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'security' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Keamanan</button>
         <button onClick={() => setActiveTab('privacy')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'privacy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Privasi & Data</button>
      </div>

      {activeTab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 space-y-6 shadow-xl h-fit">
              <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-4 flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                 Detail Personal
              </h4>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Terdaftar</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nomor WhatsApp</label>
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                 </div>
                 <button type="submit" className="w-full py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 shadow-xl transition-all">Simpan Perubahan</button>
              </form>
           </div>

           <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 space-y-6 shadow-xl h-fit">
              <h4 className="text-lg font-bold text-white uppercase tracking-tight mb-4 flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                 Ganti Kata Sandi
              </h4>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kata Sandi Saat Ini</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-rose-500 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kata Sandi Baru</label>
                    <input type="password" placeholder="Min. 8 karakter" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-rose-500 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Konfirmasi Kata Sandi Baru</label>
                    <input type="password" placeholder="Ulangi kata sandi baru" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-rose-500 transition-all" />
                 </div>
                 <button className="w-full py-4 bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-600 transition-all">Perbarui Kredensial</button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center px-4">
              <h4 className="text-xl font-black text-white uppercase tracking-tight">Daftar Alamat Pengiriman</h4>
              <button className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">+ Tambah Alamat</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <div key={addr.id} className={`glass-panel p-6 rounded-3xl border-2 transition-all relative group ${addr.isDefault ? 'border-indigo-600 bg-indigo-600/5' : 'border-slate-800 hover:border-slate-700'}`}>
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <span className="text-xs font-black text-white uppercase tracking-widest">{addr.label}</span>
                         {addr.isDefault && <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black rounded uppercase">Default</span>}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 text-slate-500 hover:text-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth={2}/></svg></button>
                         <button onClick={() => handleRemoveAddress(addr.id, addr.label)} className="p-2 text-slate-500 hover:text-rose-500 transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg></button>
                      </div>
                   </div>
                   <p className="text-sm font-bold text-white mb-1">{addr.receiverName}</p>
                   <p className="text-xs text-slate-500 mb-3">{addr.phone}</p>
                   <p className="text-xs text-slate-400 leading-relaxed italic">"{addr.fullAddress}"</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center px-4">
              <h4 className="text-xl font-black text-white uppercase tracking-tight">Metode Pembayaran</h4>
              <button className="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">+ Tambah Metode</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {payments.map(pm => (
                <div key={pm.id} className={`glass-panel p-8 rounded-3xl border-2 transition-all flex flex-col justify-between group ${pm.isDefault ? 'border-indigo-600 bg-indigo-600/5 shadow-indigo-600/10' : 'border-slate-800 hover:border-slate-700'}`}>
                   <div className="flex justify-between items-start mb-10">
                      <div className={`p-4 rounded-2xl border ${pm.isDefault ? 'bg-indigo-600 text-white' : 'bg-slate-900 border-slate-800 text-indigo-400'}`}>
                         {pm.type === 'CARD' ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeWidth={2}/></svg> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth={2}/></svg>}
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{pm.provider}</span>
                   </div>
                   <div>
                      <p className="text-lg font-mono font-bold text-white tracking-widest mb-2">{pm.accountNumber}</p>
                      {pm.expiryDate && <p className="text-[10px] text-slate-500 font-bold uppercase">Exp: {pm.expiryDate}</p>}
                   </div>
                   <div className="mt-8 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white">Atur Default</button>
                      <button onClick={() => handleRemovePayment(pm.id, pm.provider)} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:text-white transition-all">Hapus</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-8">
           <div className="glass-panel p-8 rounded-[3rem] border-slate-800 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5"><svg className="w-32 h-32 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg></div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                 <div>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 leading-none">Keamanan Perangkat</h4>
                    <p className="text-sm text-slate-400 max-w-lg">Keluarkan semua sesi aktif di perangkat lain jika Anda merasa akun Anda sedang dalam ancaman.</p>
                 </div>
                 <button onClick={handleLogoutAll} className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-600/20 transition-all whitespace-nowrap">Logout Semua Device</button>
              </div>
           </div>

           <div className="glass-panel rounded-[2.5rem] border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-800 bg-slate-900/50">
                 <h4 className="text-lg font-black text-white uppercase tracking-tight">Riwayat Login (Forensik)</h4>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-900/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                          <th className="px-8 py-5">Perangkat & Browser</th>
                          <th className="px-8 py-5">Lokasi & IP</th>
                          <th className="px-8 py-5 text-right">Aktivitas Terakhir</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                       {sessions.map(sess => (
                          <tr key={sess.id} className={`hover:bg-slate-800/20 transition-all group ${sess.isCurrent ? 'bg-indigo-600/5' : ''}`}>
                             <td className="px-8 py-4">
                                <div className="flex items-center gap-4">
                                   <div className={`p-2 rounded-lg ${sess.isCurrent ? 'text-indigo-400' : 'text-slate-600'}`}>
                                      {sess.device.includes('Mobile') ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth={2}/></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth={2}/></svg>}
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-white">{sess.device}</p>
                                      {sess.isCurrent && <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Sesi Saat Ini</span>}
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-4">
                                <p className="text-xs font-bold text-slate-300">{sess.location}</p>
                                <p className="text-[10px] text-slate-600 font-mono mt-0.5">{sess.ip}</p>
                             </td>
                             <td className="px-8 py-4 text-right">
                                <p className="text-xs font-bold text-white">{sess.lastActive}</p>
                                {!sess.isCurrent && (
                                   <button onClick={() => { if(confirm('Hentikan sesi di perangkat ini?')) alert('Sesi dihentikan.'); }} className="text-[9px] font-black text-rose-500 uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Keluarkan</button>
                                )}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'privacy' && privacy && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 shadow-xl">
                 <h4 className="text-xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                    Kontrol Privasi Data
                 </h4>
                 <div className="space-y-4">
                    {[
                      { key: 'profileVisibility', label: 'Profil Publik Terlihat', desc: 'Izinkan member Sumatra lain melihat statistik belanja Anda.' },
                      { key: 'marketingEmails', label: 'Email Pemasaran & Promo', desc: 'Dapatkan notifikasi voucher eksklusif via email.' },
                      { key: 'regionalDataSync', label: 'Sinkronisasi Node Regional', desc: 'Bagikan preferensi belanja ke seluruh cabang Sumatra.' },
                      { key: 'activityTracking', label: 'Pelacakan Aktivitas', desc: 'Bantu kami meningkatkan platform melalui log anonim.' }
                    ].map(item => (
                      <div key={item.key} className="p-5 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                         <div className="max-w-[70%]">
                            <p className="text-sm font-bold text-white mb-1">{item.label}</p>
                            <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
                         </div>
                         <button 
                           onClick={() => handleTogglePrivacy(item.key as keyof PrivacySettings)}
                           className={`w-12 h-6 rounded-full relative transition-all duration-300 ${privacy[item.key as keyof PrivacySettings] ? 'bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-slate-800'}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${privacy[item.key as keyof PrivacySettings] ? 'right-1' : 'left-1'}`}></div>
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><svg className="w-32 h-32 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2}/></svg></div>
                 <h4 className="text-xl font-black text-white uppercase tracking-tight mb-4">Ekspor Data Pribadi</h4>
                 <p className="text-sm text-slate-400 mb-8 max-w-lg leading-relaxed">Sesuai dengan kebijakan transparansi SeuramoeTech, Anda berhak mengunduh seluruh informasi yang kami simpan mengenai akun Anda.</p>
                 <button 
                   onClick={handleDownloadData}
                   className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-slate-700 flex items-center gap-3 shadow-xl"
                 >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Data (JSON)
                 </button>
              </div>
           </div>

           <div className="space-y-8">
              <div className="glass-panel p-8 rounded-[2.5rem] border-rose-500/20 bg-rose-600/5 shadow-xl">
                 <h4 className="text-lg font-black text-rose-500 uppercase tracking-tight mb-4">Penghapusan Akun</h4>
                 <p className="text-xs text-slate-400 leading-relaxed mb-10 italic">
                    Penghapusan akun bersifat permanen. Seluruh riwayat poin loyalty, garansi, dan ledger transaksi Anda akan dianonimkan atau dihapus dari node pusat.
                 </p>
                 
                 {!confirmDelete ? (
                   <button 
                     onClick={() => setConfirmDelete(true)}
                     className="w-full py-4 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all"
                   >
                     Ajukan Penghapusan Akun
                   </button>
                 ) : (
                   <div className="space-y-4 animate-in slide-in-from-top-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Alasan Penghapusan</label>
                         <textarea 
                           className="w-full bg-slate-950 border border-rose-500/30 rounded-xl p-4 text-xs text-white outline-none focus:ring-1 focus:ring-rose-500"
                           rows={3}
                           placeholder="Mengapa Anda ingin pergi?"
                           value={deleteReason}
                           onChange={e => setDeleteReason(e.target.value)}
                         />
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 bg-slate-800 text-slate-400 text-[9px] font-black uppercase rounded-xl">Batal</button>
                         <button onClick={handleDeleteRequest} className="flex-1 py-3 bg-rose-600 text-white text-[9px] font-black uppercase rounded-xl shadow-lg">Konfirmasi</button>
                      </div>
                   </div>
                 )}
              </div>

              <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem]">
                 <p className="text-xs font-bold text-white mb-2 uppercase tracking-tight flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg>
                    Data Protection Law
                 </p>
                 <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    "Platform SeuramoeTech mematuhi standar perlindungan data pribadi nasional dan enkripsi tingkat regional Sumatra untuk menjamin keamanan identitas digital Anda."
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
