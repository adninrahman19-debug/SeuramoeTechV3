
import React, { useState, useEffect, useRef } from 'react';
import AuthService from '../auth/AuthService';
import SecurityService from '../services/SecurityService';
import { User, UserRole, AuditCategory, SubscriptionTier } from '../types';
import Logo from '../components/Shared/Logo';
import Stepper from '../components/Shared/Stepper';
import { SUBSCRIPTION_PLANS } from '../constants';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'otp' | '2fa' | 'reset-confirm' | 'force-password-change'>('login');
  const [regStep, setRegStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Smart Validation States
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [phone, setPhone] = useState('');
  
  // Security Verification
  const [otpInput, setOtpInput] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('');
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Owner Specific
  const [storeName, setStoreName] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(SubscriptionTier.PRO);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Focus Refs
  const loginInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === 'login') {
      loginInputRef.current?.focus();
      // Check for existing lockout on mount
      const status = SecurityService.getLockoutStatus(username);
      if (status.isLocked) setLockoutTimer(status.remaining);
    }
  }, [mode, username]);

  useEffect(() => {
    let interval: any;
    if (lockoutTimer > 0) {
      interval = setInterval(() => setLockoutTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  useEffect(() => {
    if (!password) { setPasswordStrength(0); return; }
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    if (mode !== 'register' || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    const handler = setTimeout(() => {
      setIsUsernameChecking(true);
      const all = AuthService.getAllUsers();
      const exists = all.some(u => u.username.toLowerCase() === username.toLowerCase());
      setUsernameAvailable(!exists);
      setIsUsernameChecking(false);
    }, 600);
    return () => clearTimeout(handler);
  }, [username, mode]);

  const logAudit = (userId: string, userName: string, action: string, severity: 'INFO' | 'WARN' | 'CRITICAL', details: string) => {
    SecurityService.addLog({
      userId, userName, action, category: AuditCategory.AUTH,
      details, ip: '182.1.22.4', severity
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const user = AuthService.login(username, password);
      
      if (user) {
        const ipCheck = AuthService.checkIpRestriction('182.1.22.4', user);
        if (!ipCheck.allowed) {
          setError(ipCheck.reason || 'Akses IP ditolak.');
          setIsLoading(false);
          return;
        }

        SecurityService.resetLoginAttempts(username);

        if (!user.isEmailVerified) {
          const otp = AuthService.sendOTP(user.email);
          setExpectedOtp(otp);
          setPendingUser(user);
          setMode('otp');
          setIsLoading(false);
          return;
        }

        if (user.twoFactorEnabled) {
          const otp = AuthService.sendOTP(user.email);
          setExpectedOtp(otp);
          setPendingUser(user);
          setMode('2fa');
          setIsLoading(false);
          return;
        }

        if (user.requiresPasswordChange) {
          setPendingUser(user);
          setMode('force-password-change');
          setIsLoading(false);
          return;
        }

        AuthService.finalizeLogin(user);
        logAudit(user.id, user.fullName, 'LOGIN_SUCCESS', 'INFO', 'Login berhasil dari terminal.');
        onLoginSuccess(user);
      } else {
        const lockoutStatus = SecurityService.trackLoginAttempt(username);
        if (lockoutStatus.isLocked) {
          setLockoutTimer(lockoutStatus.remaining);
          setError('Terlalu banyak percobaan. Terminal dikunci 60 detik.');
        } else {
          setError(`Username atau sandi salah. Percobaan: ${lockoutStatus.attempts}/5`);
        }
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (otpInput === expectedOtp && pendingUser) {
        const user = AuthService.verifyEmail(pendingUser.id);
        if (user) {
          AuthService.finalizeLogin(user); // Bug Fix: Ensure session is finalized
          onLoginSuccess(user);
        }
      } else {
        setError('Kode OTP tidak valid.');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleForcePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordStrength < 3) return setError('Gunakan sandi yang lebih kuat.');
    if (password !== confirmPassword) return setError('Konfirmasi sandi tidak cocok.');

    setIsLoading(true);
    setTimeout(() => {
      if (pendingUser) {
        AuthService.changePassword(pendingUser.id, password);
        const updatedUser = AuthService.getCurrentUser()!;
        AuthService.finalizeLogin(updatedUser); // Bug Fix: Ensure session is finalized
        logAudit(pendingUser.id, pendingUser.fullName, 'PASSWORD_HARDENING', 'INFO', 'Staf memperbarui sandi pada login pertama.');
        onLoginSuccess(updatedUser);
      }
    }, 1200);
  };

  const executeRegistration = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (role === UserRole.STORE_OWNER && regStep < 3) return;
    
    setIsLoading(true);
    setTimeout(() => {
      try {
        const newUser = AuthService.register({ fullName, username, email, role });
        const otp = AuthService.sendOTP(email);
        setExpectedOtp(otp);
        setPendingUser(newUser);
        setMode('otp');
        setIsLoading(false);
      } catch (err) {
        setError('Gagal memproses pendaftaran node.');
        setIsLoading(false);
      }
    }, 2000);
  };

  const getStrengthLabel = () => {
    const levels = [
      { l: 'Kosong', c: 'bg-slate-800' },
      { l: 'Lemah', c: 'bg-rose-500' },
      { l: 'Sedang', c: 'bg-amber-500' },
      { l: 'Kuat', c: 'bg-indigo-500' },
      { l: 'Sangat Kuat', c: 'bg-emerald-500' }
    ];
    return levels[passwordStrength];
  };

  const ownerRegSteps = [
    { label: 'Identitas', description: 'Akun' },
    { label: 'Node Toko', description: 'Data Toko' },
    { label: 'Langganan', description: 'Paket' },
    { label: 'Finalisasi', description: 'Verifikasi' }
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#020617] text-slate-300 relative overflow-hidden">
      {/* Background Decorative */}
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
              Satu Pintu.
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed font-medium">Masuk ke ekosistem SeuramoeTech untuk akses marketplace, manajemen toko, dan pusat perbaikan gadget se-Sumatra.</p>
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">SeuramoeTech Integrated Security Hub</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10 overflow-y-auto custom-scrollbar">
        <button 
          onClick={onBack}
          className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-white/5 hover:border-white/20 text-slate-400 hover:text-white rounded-xl transition-all group z-20"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Kembali</span>
        </button>

        <div className="w-full max-w-xl space-y-8 py-10">
          <div className="glass-panel p-8 md:p-10 rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            
            {(mode === 'login' || mode === 'register') && (
              <div className="flex gap-1 p-1 bg-slate-950 border border-white/5 rounded-2xl mb-10">
                <button onClick={() => setMode('login')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>Masuk</button>
                <button onClick={() => setMode('register')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'register' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>Daftar</button>
              </div>
            )}

            {mode === 'login' && (
              <>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">ID Node / Email</label>
                      <input 
                        ref={loginInputRef}
                        type="text" 
                        required 
                        autoComplete="username"
                        className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                        placeholder="Input identitas..." 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sandi Rahasia</label>
                        <button type="button" onClick={() => setMode('forgot')} className="text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-widest">Lupa Sandi?</button>
                      </div>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required 
                          autoComplete="current-password"
                          className="w-full pl-5 pr-14 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                          placeholder="••••••••" 
                          value={password} 
                          onChange={e => setPassword(e.target.value)} 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-600 hover:text-indigo-400">
                          {showPassword ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-[10px] text-rose-500 font-bold text-center bg-rose-500/5 py-3 rounded-2xl border border-rose-500/10 animate-in shake">{error}</p>}
                  
                  <button disabled={isLoading || lockoutTimer > 0} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Handshake Node...
                      </>
                    ) : (lockoutTimer > 0 ? `Terkunci (${lockoutTimer}s)` : 'Otentikasi Akun')}
                  </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5"></div>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Akses Login Cepat (Demo)</span>
                    <div className="h-px flex-1 bg-white/5"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <button 
                       onClick={() => { setUsername('superadmin'); setPassword('Super@123'); }}
                       className="col-span-2 flex items-center gap-4 p-4 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl transition-all group hover:bg-indigo-600 hover:border-indigo-600"
                     >
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-white group-hover:text-indigo-600 transition-colors">👑</div>
                        <div className="text-left">
                           <span className="block text-[11px] font-black uppercase text-indigo-400 group-hover:text-white transition-colors">Admin HQ Platform</span>
                           <span className="text-[9px] text-slate-600 group-hover:text-indigo-200 font-mono">@superadmin</span>
                        </div>
                        <svg className="w-4 h-4 ml-auto text-indigo-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={3}/></svg>
                     </button>

                     {[
                       { name: 'Owner Toko', user: 'owner_acehtech', pass: 'Owner@123', color: 'emerald', icon: '🏢' },
                       { name: 'Pelanggan', user: 'customer001', pass: 'Customer@123', color: 'violet', icon: '👤' },
                       { name: 'Staf Admin', user: 'admin_toko1', pass: 'Admin@123', color: 'blue', icon: '🛠️' },
                       { name: 'Teknisi', user: 'tech_toko1', pass: 'Tech@123', color: 'amber', icon: '🔧' },
                     ].map(acc => (
                       <button 
                         key={acc.user} 
                         onClick={() => { setUsername(acc.user); setPassword(acc.pass); }}
                         className="flex items-center gap-3 p-3 bg-slate-950/50 border border-white/5 hover:border-white/20 rounded-xl transition-all group"
                       >
                          <span className="text-sm">{acc.icon}</span>
                          <div className="text-left overflow-hidden">
                             <span className={`block text-[10px] font-black uppercase text-${acc.color}-500 truncate group-hover:text-white transition-colors`}>{acc.name}</span>
                             <span className="text-[8px] text-slate-700 font-mono truncate">@{acc.user}</span>
                          </div>
                       </button>
                     ))}
                  </div>
                </div>
              </>
            )}

            {mode === 'register' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Pilih Peran Identitas</label>
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
                </div>

                {role === UserRole.CUSTOMER ? (
                  <form onSubmit={executeRegistration} className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Username Node</label>
                          <div className="relative">
                            <input type="text" required autoComplete="username" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Pilih ID unik..." value={username} onChange={e => setUsername(e.target.value)} />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                               {isUsernameChecking ? (
                                 <div className="w-4 h-4 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                               ) : usernameAvailable === true ? (
                                 <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                               ) : usernameAvailable === false ? (
                                 <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                               ) : null}
                            </div>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Email Sumatra</label>
                          <input type="email" required autoComplete="email" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="email@jaringan.id" value={email} onChange={e => setEmail(e.target.value)} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Password</label>
                             <input type="password" required autoComplete="new-password" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                             <div className="flex gap-1 mt-2 px-1">
                                {[1, 2, 3, 4].map(idx => (
                                  <div key={idx} className={`h-1 flex-1 rounded-full transition-all ${idx <= passwordStrength ? getStrengthLabel().c : 'bg-slate-800'}`}></div>
                                ))}
                             </div>
                          </div>
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Konfirmasi</label>
                             <input type="password" required autoComplete="new-password" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                          </div>
                       </div>
                    </div>
                    <button disabled={isLoading || usernameAvailable === false} className="w-full py-5 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl transition-all">
                       {isLoading ? 'Membangun Node...' : 'Daftar & Masuk Marketplace'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                    <Stepper steps={ownerRegSteps} currentStep={regStep} />
                    
                    {regStep === 0 && (
                      <div className="space-y-4">
                        <input type="text" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="Nama Lengkap Sesuai KTP" value={fullName} onChange={e => setFullName(e.target.value)} />
                        <div className="relative">
                          <input type="text" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="Username Unik" value={username} onChange={e => setUsername(e.target.value)} />
                          {usernameAvailable === false && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 text-[10px] font-bold">Terpakai</span>}
                        </div>
                        <input type="email" className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white outline-none" placeholder="Email Bisnis Resmi" value={email} onChange={e => setEmail(e.target.value)} />
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
                          <option value="Medan">Medan (North)</option>
                          <option value="Meulaboh">Meulaboh (West)</option>
                        </select>
                      </div>
                    )}

                    {regStep === 2 && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {SUBSCRIPTION_PLANS.slice(0, 2).map(plan => (
                           <div key={plan.tier} onClick={() => setSelectedTier(plan.tier)} className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${selectedTier === plan.tier ? 'border-indigo-600 bg-indigo-600/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                              <h4 className="text-sm font-black text-white uppercase">{plan.name}</h4>
                              <p className="text-lg font-black text-indigo-400 mt-2">Rp {(plan.priceMonthly/1000).toFixed(0)}k/bln</p>
                           </div>
                         ))}
                       </div>
                    )}

                    {regStep === 3 && (
                      <div className="p-8 bg-slate-950 border border-white/5 rounded-[2.5rem] space-y-6 shadow-inner text-center">
                        <h4 className="text-lg font-bold text-white uppercase tracking-tight">Persetujuan Node</h4>
                        <label className="flex items-start gap-4 cursor-pointer group text-left pt-4">
                           <input type="checkbox" checked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)} className="mt-1 w-5 h-5 accent-indigo-600" />
                           <span className="text-[10px] text-slate-400 font-medium group-hover:text-white transition-colors">Saya menyetujui syarat layanan dan kebijakan privasi platform.</span>
                        </label>
                      </div>
                    )}

                    <div className="flex gap-4">
                      {regStep > 0 && <button onClick={() => setRegStep(prev => prev - 1)} className="flex-1 py-4 bg-slate-900 border border-white/5 text-slate-500 font-black uppercase text-[10px] rounded-2xl">Kembali</button>}
                      <button 
                        onClick={regStep === 3 ? executeRegistration : () => setRegStep(prev => prev + 1)} 
                        disabled={isLoading || (regStep === 0 && (usernameAvailable === false || isUsernameChecking))} 
                        className="flex-[2] py-4 bg-indigo-600 text-white font-black uppercase text-[10px] rounded-2xl shadow-xl hover:bg-indigo-500 transition-all"
                      >
                        {isLoading ? 'Processing...' : (regStep === 3 ? 'Aktivasi Node Owner' : 'Langkah Lanjut')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {mode === 'force-password-change' && (
              <form onSubmit={handleForcePasswordChange} className="space-y-8 animate-in zoom-in-95 duration-300">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-600/10 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/20">
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Login Pertama Staf</h3>
                  <p className="text-xs text-slate-500 leading-relaxed italic">"Demi keamanan node regional, Anda wajib memperbarui sandi akses dari Owner sebelum masuk ke dashboard."</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Sandi Baru</label>
                    <input type="password" required className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Ulangi Sandi</label>
                    <input type="password" required className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
                <button disabled={isLoading} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-xl transition-all">
                  {isLoading ? 'Mengamankan Sesi...' : 'Aktifkan Akun & Masuk Dashboard'}
                </button>
              </form>
            )}

            {(mode === 'otp' || mode === '2fa') && (
               <form onSubmit={handleVerifyOTP} className="space-y-8 animate-in zoom-in-95 duration-300">
                  <div className="text-center space-y-3">
                     <h3 className="text-2xl font-black text-white uppercase tracking-tight">{mode === 'otp' ? 'Verifikasi Identitas' : 'Two-Factor Auth'}</h3>
                     <p className="text-xs text-slate-500 italic">"Masukan 6-digit kode keamanan yang telah dikirimkan ke email terdaftar untuk membuka kunci akses."</p>
                  </div>
                  <input 
                    type="text" 
                    maxLength={6} 
                    required 
                    autoFocus
                    className="w-full px-5 py-6 bg-slate-950 border border-indigo-500/30 rounded-3xl text-white text-center text-4xl font-mono tracking-[0.5em] outline-none focus:ring-4 focus:ring-indigo-600/20" 
                    value={otpInput} 
                    onChange={e => setOtpInput(e.target.value)} 
                  />
                  {error && <p className="text-[10px] text-rose-500 font-bold text-center">{error}</p>}
                  <button disabled={isLoading} className="w-full py-5 bg-indigo-600 text-white font-black uppercase text-xs rounded-2xl shadow-xl">
                     {isLoading ? 'Validasi...' : 'Verifikasi & Masuk'}
                  </button>
                  <button type="button" onClick={() => setMode('login')} className="w-full text-[9px] font-black text-slate-600 uppercase hover:text-white transition-colors">Kembali ke Login</button>
               </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
