
import React, { useState, useEffect } from 'react';
import AuthService from '../auth/AuthService';
import SecurityService from '../services/SecurityService';
import StoreService from '../services/StoreService';
import { User, UserRole, AuditCategory, SubscriptionTier, SubscriptionStatus } from '../types';
import Logo from '../components/Shared/Logo';
import Stepper from '../components/Shared/Stepper';
import { SUBSCRIPTION_PLANS } from '../constants';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'otp' | 'force-password-change'>('login');
  const [regStep, setRegStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Advanced UI States
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [otpTimer, setOtpTimer] = useState(0);

  // Form Fields - Common
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [phone, setPhone] = useState('');
  
  // Temp User for Password Change
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Form Fields - Store (Owner)
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [businessType, setBusinessType] = useState('Retail Laptop');

  // Form Fields - Subscription (Owner)
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(SubscriptionTier.PRO);
  const [isTrial, setIsTrial] = useState(true);

  // Form Fields - Verification (Owner)
  const [verificationCode, setVerificationCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Handle Rate Limiting
  useEffect(() => {
    let interval: any;
    if (lockoutTimer > 0) {
      interval = setInterval(() => setLockoutTimer(prev => prev - 1), 1000);
    } else if (lockoutTimer === 0 && attempts >= 5) {
      setAttempts(0); 
    }
    return () => clearInterval(interval);
  }, [lockoutTimer, attempts]);

  // Handle OTP Resend Timer
  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const detectDevice = () => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return "Android Mobile Node";
    if (/iPhone|iPad|iPod/i.test(ua)) return "iOS Mobile Node";
    return "Desktop Web Terminal";
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const user = AuthService.login(username, password);
      
      if (user) {
        // Cek apakah ini login pertama staf yang wajib ganti password
        if (user.requiresPasswordChange) {
          setPendingUser(user);
          setMode('force-password-change');
          setIsLoading(false);
          return;
        }

        SecurityService.addLog({
          userId: user.id, userName: user.fullName, action: 'AUTH_LOGIN_SUCCESS',
          category: AuditCategory.AUTH, details: `Login via password. Device: ${detectDevice()}`,
          ip: '182.1.22.' + Math.floor(Math.random() * 255), severity: 'INFO'
        });
        onLoginSuccess(user);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 5) {
          setLockoutTimer(30);
          setError('Keamanan dipicu. Terminal dikunci selama 30 detik.');
        } else {
          setError(`Kredensial salah. Sisa percobaan: ${5 - newAttempts}`);
        }
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleForcePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Konfirmasi password tidak cocok.');
    }
    if (password.length < 8) {
      return setError('Gunakan minimal 8 karakter untuk keamanan node.');
    }

    setIsLoading(true);
    setTimeout(() => {
      if (pendingUser) {
        AuthService.changePassword(pendingUser.id, password);
        SecurityService.addLog({
          userId: pendingUser.id, userName: pendingUser.fullName, action: 'STAFF_INITIAL_HARDENING',
          category: AuditCategory.SECURITY, details: `Staf melakukan penggantian sandi wajib pada login pertama. Node: ${detectDevice()}`,
          ip: '127.0.0.1', severity: 'INFO'
        });
        
        const finalUser = AuthService.getCurrentUser();
        if (finalUser) onLoginSuccess(finalUser);
      }
    }, 1200);
  };

  const executeCustomerRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      return setError('Lengkapi seluruh data pendaftaran.');
    }
    if (password !== confirmPassword) {
      return setError('Konfirmasi password tidak cocok.');
    }
    if (password.length < 8) {
      return setError('Password minimal 8 karakter untuk keamanan node.');
    }

    setIsLoading(true);
    setTimeout(() => {
      try {
        const newUser = AuthService.register({
          fullName: username,
          username,
          email,
          role: UserRole.CUSTOMER
        });

        SecurityService.addLog({
          userId: newUser.id, userName: newUser.fullName, action: 'CUSTOMER_AUTO_REGISTER',
          category: AuditCategory.SYSTEM, details: `Pelanggan baru terdaftar dan login otomatis via ${detectDevice()}`,
          ip: '127.0.0.1', severity: 'INFO'
        });

        onLoginSuccess(newUser);
      } catch (err) {
        setError('Username atau Email sudah terdaftar di sistem.');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleOwnerStepNext = () => {
    setError('');
    if (regStep === 0) {
      if (!fullName || !username || !email || !password || !phone) return setError('Harap lengkapi informasi akun.');
      if (password !== confirmPassword) return setError('Konfirmasi password tidak cocok.');
    }
    if (regStep === 1) {
      if (!storeName || !storeAddress || !storeLocation) return setError('Harap lengkapi data operasional toko.');
    }
    setRegStep(prev => prev + 1);
  };

  const executeOwnerRegistration = () => {
    if (!agreedToTerms) return setError('Anda harus menyetujui Syarat & Ketentuan SeuramoeTech.');

    setIsLoading(true);
    setTimeout(() => {
      try {
        const newUser = AuthService.register({ fullName, username, email, role: UserRole.STORE_OWNER });
        
        const newStore = StoreService.addStore({
          ownerId: newUser.id,
          name: storeName,
          location: storeLocation,
          contact: phone,
          status: 'active',
          productLimit: selectedTier === SubscriptionTier.BASIC ? 100 : 500,
          staffLimit: selectedTier === SubscriptionTier.BASIC ? 3 : 10,
        });

        const dbUsers = AuthService.getAllUsers();
        const updatedUsers = dbUsers.map(u => {
          if (u.id === newUser.id) {
            return {
              ...u,
              storeId: newStore.id,
              subscriptionTier: selectedTier,
              isSubscriptionActive: true,
              subscriptionStatus: SubscriptionStatus.ACTIVE,
              subscriptionExpiry: new Date(Date.now() + 2592000000).toISOString().split('T')[0],
              phone
            };
          }
          return u;
        });
        localStorage.setItem('st_users_database', JSON.stringify(updatedUsers));
        
        const finalUser = updatedUsers.find(u => u.id === newUser.id);
        if (finalUser) onLoginSuccess(finalUser);
      } catch (err) {
        setError('Gagal memproses pendaftaran Owner.');
        setIsLoading(false);
      }
    }, 2000);
  };

  const ownerRegSteps = [
    { label: 'Akun', description: 'Kredensial' },
    { label: 'Toko', description: 'Operasional' },
    { label: 'Paket', description: 'Subscription' },
    { label: 'Audit', description: 'Verifikasi' }
  ];

  const demoAccounts = [
    { name: 'Super Admin', user: 'superadmin', pass: 'Super@123', icon: '👑' },
    { name: 'Owner Toko', user: 'owner_acehtech', pass: 'Owner@123', icon: '🏢' },
    { name: 'Pelanggan', user: 'customer001', pass: 'Customer@123', icon: '👤' },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#020617] text-slate-300 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 p-20 flex-col justify-between relative z-10 border-r border-white/5">
        <Logo size="lg" />
        <div className="space-y-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-4">Node Regional Sumatra v2.5</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9] uppercase">
              Gateway <br /> 
              <span className="text-indigo-500 italic underline decoration-indigo-500/30">Otentikasi</span> <br /> 
              Node Terpadu.
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed font-medium">Masuk ke ekosistem SeuramoeTech untuk akses marketplace, manajemen toko, dan pusat perbaikan gadget se-Sumatra.</p>
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">SeuramoeTech Integrated Security Hub</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-xl space-y-8 py-10">
          <div className="glass-panel p-8 md:p-10 rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            {/* TABS */}
            {(mode === 'login' || (mode === 'register' && role === UserRole.CUSTOMER)) && (
              <div className="flex gap-1 p-1 bg-slate-950 border border-white/5 rounded-2xl mb-10">
                <button onClick={() => { setMode('login'); setError(''); }} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Masuk</button>
                <button onClick={() => { setMode('register'); setRole(UserRole.CUSTOMER); setRegStep(0); setError(''); }} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'register' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Daftar</button>
              </div>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">ID Node / Email</label>
                    <input type="text" required className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Input identitas..." value={username} onChange={e => setUsername(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kata Sandi</label>
                      <button type="button" onClick={() => setMode('forgot')} className="text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-widest">Lupa Sandi?</button>
                    </div>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} required className="w-full pl-5 pr-14 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-600 hover:text-indigo-400">
                        {showPassword ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                      </button>
                    </div>
                  </div>
                </div>
                {error && <p className="text-[10px] text-rose-500 font-bold text-center bg-rose-500/5 py-3 rounded-2xl border border-rose-500/10">{error}</p>}
                <button disabled={isLoading || lockoutTimer > 0} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-xl transition-all">
                  {isLoading ? 'Hashing Kredensial...' : (lockoutTimer > 0 ? `Terkunci (${lockoutTimer}s)` : 'Otentikasi Akun')}
                </button>
              </form>
            )}

            {mode === 'force-password-change' && (
              <form onSubmit={handleForcePasswordChange} className="space-y-8 animate-in zoom-in-95 duration-300">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-600/10 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/20">
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Login Pertama Staf</h3>
                  <p className="text-xs text-slate-500 leading-relaxed italic">"Demi keamanan node regional, Anda wajib memperbarui sandi akses yang diberikan oleh Owner sebelum masuk ke dashboard."</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sandi Baru</label>
                    <input type="password" required className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ulangi Sandi Baru</label>
                    <input type="password" required className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                </div>

                {error && <p className="text-[10px] text-rose-500 font-bold text-center bg-rose-500/5 py-3 rounded-xl border border-rose-500/10">{error}</p>}

                <button disabled={isLoading} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-xl transition-all">
                  {isLoading ? 'Mengamankan Node...' : 'Aktifkan Akun & Masuk Dashboard'}
                </button>
              </form>
            )}

            {mode === 'register' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Pilih Peran Node</label>
                  <div className="flex gap-2">
                    <button onClick={() => { setRole(UserRole.CUSTOMER); setRegStep(0); }} className={`flex-1 py-4 border-2 rounded-2xl transition-all flex flex-col items-center gap-2 ${role === UserRole.CUSTOMER ? 'border-indigo-600 bg-indigo-600/10' : 'border-slate-800 bg-slate-950'}`}>
                      <span className="text-xl">🛍️</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${role === UserRole.CUSTOMER ? 'text-indigo-400' : 'text-slate-600'}`}>Pelanggan</span>
                    </button>
                    <button onClick={() => { setRole(UserRole.STORE_OWNER); setRegStep(0); }} className={`flex-1 py-4 border-2 rounded-2xl transition-all flex flex-col items-center gap-2 ${role === UserRole.STORE_OWNER ? 'border-indigo-600 bg-indigo-600/10' : 'border-slate-800 bg-slate-950'}`}>
                      <span className="text-xl">🏪</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${role === UserRole.STORE_OWNER ? 'text-indigo-400' : 'text-slate-600'}`}>Pemilik Toko</span>
                    </button>
                  </div>
                  <p className="text-[8px] text-slate-600 italic px-2">🔒 Staff tidak diperkenankan mendaftar mandiri. Akun staff dibuat oleh Owner melalui dashboard.</p>
                </div>

                {role === UserRole.CUSTOMER ? (
                  <form onSubmit={executeCustomerRegistration} className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Username</label>
                          <input type="text" required className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="ID Node Pelanggan..." value={username} onChange={e => setUsername(e.target.value)} />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Email Sumatra</label>
                          <input type="email" required className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="email@jaringan.id" value={email} onChange={e => setEmail(e.target.value)} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Password</label>
                             <input type="password" required className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Konfirmasi</label>
                             <input type="password" required className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                          </div>
                       </div>
                    </div>
                    {error && <p className="text-[10px] text-rose-500 font-bold text-center">{error}</p>}
                    <button disabled={isLoading} className="w-full py-5 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl transition-all">
                       {isLoading ? 'Membangun Node Pelanggan...' : 'Daftar & Masuk Marketplace'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                    <Stepper steps={ownerRegSteps} currentStep={regStep} />
                    
                    {regStep === 0 && (
                      <div className="space-y-4">
                        <input type="text" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="Nama Lengkap" value={fullName} onChange={e => setFullName(e.target.value)} />
                        <input type="text" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                        <input type="email" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="Email Bisnis" value={email} onChange={e => setEmail(e.target.value)} />
                        <input type="text" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="No. HP (WhatsApp)" value={phone} onChange={e => setPhone(e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="password" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="Sandi" value={password} onChange={e => setPassword(e.target.value)} />
                          <input type="password" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="Konfirmasi" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        </div>
                      </div>
                    )}

                    {regStep === 1 && (
                      <div className="space-y-4">
                        <input type="text" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="Nama Toko" value={storeName} onChange={e => setStoreName(e.target.value)} />
                        <select className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" value={storeLocation} onChange={e => setStoreLocation(e.target.value)}>
                          <option value="">Pilih Regional Sumatra...</option>
                          <option value="Banda Aceh">Banda Aceh (Central)</option>
                          <option value="Meulaboh">Meulaboh (West)</option>
                          <option value="Medan">Medan (North)</option>
                        </select>
                        <textarea rows={3} className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="Alamat Lengkap Toko" value={storeAddress} onChange={e => setStoreAddress(e.target.value)} />
                      </div>
                    )}

                    {regStep === 2 && (
                       <div className="grid grid-cols-2 gap-4">
                         {SUBSCRIPTION_PLANS.slice(0, 2).map(plan => (
                           <div key={plan.tier} onClick={() => setSelectedTier(plan.tier)} className={`p-5 rounded-[2rem] border-2 cursor-pointer transition-all ${selectedTier === plan.tier ? 'border-indigo-600 bg-indigo-600/5' : 'border-slate-800 bg-slate-950'}`}>
                              <h4 className="text-sm font-black text-white uppercase">{plan.name}</h4>
                              <p className="text-xs text-indigo-400 font-bold mt-2">Rp {(plan.priceMonthly/1000).toFixed(0)}k/bln</p>
                           </div>
                         ))}
                       </div>
                    )}

                    {regStep === 3 && (
                      <div className="p-6 bg-slate-950 border border-white/5 rounded-[2rem] space-y-6">
                        <p className="text-xs text-slate-400 italic text-center">"Kode audit telah dikirim ke {email}. Silakan centang persetujuan node."</p>
                        <label className="flex items-start gap-4 cursor-pointer">
                           <input type="checkbox" checked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)} className="mt-1 w-5 h-5 accent-indigo-600" />
                           <span className="text-[10px] text-slate-500 font-medium">Saya menyetujui Pakta Integritas SeuramoeTech Regional Sumatra.</span>
                        </label>
                      </div>
                    )}

                    {error && <p className="text-[10px] text-rose-500 font-bold text-center">{error}</p>}

                    <div className="flex gap-4">
                      {regStep > 0 && <button onClick={() => setRegStep(prev => prev - 1)} className="flex-1 py-4 bg-slate-900 border border-white/5 text-slate-500 font-black uppercase text-[10px] rounded-2xl">Kembali</button>}
                      <button onClick={regStep === 3 ? executeOwnerRegistration : handleOwnerStepNext} disabled={isLoading} className="flex-[2] py-4 bg-indigo-600 text-white font-black uppercase text-[10px] rounded-2xl shadow-xl">
                        {isLoading ? 'Processing...' : (regStep === 3 ? 'Aktivasi Node Owner' : 'Langkah Lanjut')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Access Demo */}
          <div className="space-y-6 pt-6 animate-in fade-in duration-1000">
             <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5"></div>
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Audit Mode (Demo)</span>
                <div className="h-px flex-1 bg-white/5"></div>
             </div>
             <div className="flex flex-wrap justify-center gap-2">
                {demoAccounts.map(acc => (
                  <button key={acc.user} onClick={() => { setUsername(acc.user); setPassword(acc.pass); setMode('login'); }} className="px-4 py-2.5 bg-slate-950 border border-white/5 hover:border-indigo-500/50 rounded-xl text-[9px] font-bold text-slate-600 hover:text-indigo-400 transition-all flex items-center gap-2">
                    <span className="opacity-40">{acc.icon}</span> {acc.name}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
