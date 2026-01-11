
import React, { useState } from 'react';
import AuthService from '../auth/AuthService';
import { User, UserRole } from '../types';
import Logo from '../components/Shared/Logo';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);

  const demoAccounts = [
    { name: 'Super Admin', user: 'superadmin', pass: 'Super@123', role: 'Platform Global', color: 'indigo' },
    { name: 'Store Owner', user: 'owner_acehtech', pass: 'Owner@123', role: 'Aceh Tech Center', color: 'emerald' },
    { name: 'Staff Admin', user: 'admin_toko1', pass: 'Admin@123', role: 'Operations', color: 'blue' },
    { name: 'Technician', user: 'tech_toko1', pass: 'Tech@123', role: 'Repair Desk', color: 'amber' },
    { name: 'Marketing', user: 'marketing_toko1', pass: 'Market@123', role: 'Growth Staff', color: 'rose' },
    { name: 'Customer', user: 'customer001', pass: 'Customer@123', role: 'Standard User', color: 'slate' },
  ];

  const handleQuickAccess = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setIsLoading(true);
    
    // Simulate auto-typing/filling delay for better UX
    setTimeout(() => {
      const loggedUser = AuthService.login(user, pass);
      if (loggedUser) {
        onLoginSuccess(loggedUser);
      } else {
        setError('Gagal masuk secara otomatis.');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (isLoginMode) {
        const user = AuthService.login(username, password);
        if (user) {
          onLoginSuccess(user);
        } else {
          setError('Kredensial salah. Gunakan akses cepat di bawah.');
        }
      } else {
        try {
          AuthService.register({ fullName, username, email, role });
          alert('Registrasi berhasil! Silakan login.');
          setIsLoginMode(true);
        } catch (err) {
          setError('Gagal mendaftar.');
        }
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden text-slate-300">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center lg:text-left mb-8">
            <Logo size="lg" className="mb-8 justify-center lg:justify-start" />
            <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Mulai Transformasi Digital Anda</h1>
            <p className="text-slate-400 mt-4 font-medium leading-relaxed">Ekosistem teknologi terintegrasi untuk bisnis modern di Aceh dan Sumatra.</p>
          </div>

          <div className="glass-panel p-1 rounded-2xl flex mb-6">
            <button onClick={() => setIsLoginMode(true)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${isLoginMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Masuk</button>
            <button onClick={() => setIsLoginMode(false)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${!isLoginMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Daftar</button>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-2xl relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLoginMode && (
                <div className="space-y-5 animate-in slide-in-from-top-4 duration-300">
                  <input type="text" placeholder="Nama Lengkap" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white text-sm" />
                  <input type="email" placeholder="Email Bisnis" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white text-sm" />
                  <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white text-sm appearance-none">
                    <option value={UserRole.CUSTOMER}>Pelanggan</option>
                    <option value={UserRole.STORE_OWNER}>Pemilik Toko</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white text-sm transition-all" />
              </div>

              <div className="space-y-1">
                <input type="password" placeholder="Kata Sandi" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white text-sm transition-all" />
              </div>

              {error && <div className="text-rose-400 text-xs font-bold text-center bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{error}</div>}

              <button type="submit" disabled={isLoading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (isLoginMode ? 'Akses Dashboard' : 'Mulai Bisnis Sekarang')}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Quick Access Buttons */}
        <div className="hidden lg:block space-y-8 animate-in slide-in-from-right-12 duration-700">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Eksplorasi Peran Pengguna</h2>
            <p className="text-slate-500 text-sm">Pilih salah satu akun demo untuk memahami alur kerja ekosistem SeuramoeTech.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {demoAccounts.map((acc) => (
              <button
                key={acc.user}
                onClick={() => handleQuickAccess(acc.user, acc.pass)}
                className="group flex items-center gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-left hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:scale-110 transition-transform shadow-lg`}>
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${acc.user}`} alt="avatar" className="w-10 h-10" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-white font-bold text-sm truncate">{acc.name}</h4>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{acc.role}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-indigo-600/10 border border-indigo-500/20">
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Infrastruktur Keamanan</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Platform dilindungi dengan protokol otentikasi ganda dan kontrol akses berbasis peran (RBAC) tingkat lanjut.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Quick Access (Simplified) */}
        <div className="lg:hidden mt-8 text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Akses Cepat Demo</p>
            <div className="flex flex-wrap justify-center gap-2">
                {demoAccounts.slice(0, 3).map(acc => (
                    <button key={acc.user} onClick={() => handleQuickAccess(acc.user, acc.pass)} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-colors">
                        {acc.name}
                    </button>
                ))}
            </div>
        </div>

      </div>

      <footer className="absolute bottom-8 left-0 right-0 text-center">
         <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
            &copy; 2024 SeuramoeTech Platform • Regional Aceh & Sumatra
         </p>
      </footer>
    </div>
  );
};

export default Login;
