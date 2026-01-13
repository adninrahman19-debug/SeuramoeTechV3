
import React, { useState, useEffect } from 'react';
import AuthService from './auth/AuthService';
import { User, UserRole, SubscriptionTier } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import GuestMarketplace from './pages/GuestMarketplace';
import SubscriptionPlan from './pages/SubscriptionPlan';
import Shell from './components/Layout/Shell';
import Logo from './components/Shared/Logo';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(AuthService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('overview');
  const [view, setView] = useState<'landing' | 'auth' | 'marketplace'>('landing');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActiveTab('overview'); // Reset tab saat login
  };

  const triggerLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    AuthService.logout();
    setUser(null);
    setView('landing');
    setIsLogoutModalOpen(false);
  };

  const handlePlanSelection = (tier: SubscriptionTier) => {
    const updatedUser = AuthService.updateSubscription(tier);
    if (updatedUser) {
      setUser({ ...updatedUser });
    }
  };

  // Jika tidak login
  if (!user) {
    if (view === 'auth') {
      return <Login onLoginSuccess={handleLoginSuccess} onBack={() => setView('landing')} />;
    }
    if (view === 'marketplace') {
      return <GuestMarketplace 
        onBackToLanding={() => setView('landing')} 
        onAuthRequired={() => setView('auth')} 
      />;
    }
    return (
      <LandingPage 
        onEnterAuth={() => setView('auth')} 
        onEnterMarketplace={() => setView('marketplace')} 
      />
    );
  }

  // Jika Store Owner login tapi tidak ada langganan aktif, paksa pilih paket
  if (user.role === UserRole.STORE_OWNER && !user.isSubscriptionActive) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center">
        <header className="w-full py-6 px-12 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md flex justify-between items-center sticky top-0 z-50">
          <Logo size="md" />
          <button 
            onClick={triggerLogout} 
            className="text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors px-4 py-2 hover:bg-slate-900 rounded-xl"
          >
            Keluar
          </button>
        </header>
        <SubscriptionPlan onPlanSelected={handlePlanSelection} />
        {isLogoutModalOpen && (
          <LogoutConfirmationModal 
            onConfirm={handleConfirmLogout} 
            onCancel={() => setIsLogoutModalOpen(false)} 
          />
        )}
      </div>
    );
  }

  // Main Dashboard Shell
  return (
    <>
      <Shell onLogout={triggerLogout} activeTab={activeTab} onNavigate={setActiveTab}>
        <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />
      </Shell>
      {isLogoutModalOpen && (
        <LogoutConfirmationModal 
          onConfirm={handleConfirmLogout} 
          onCancel={() => setIsLogoutModalOpen(false)} 
        />
      )}
    </>
  );
};

// Internal Modal Component for Logout Verification
const LogoutConfirmationModal: React.FC<{onConfirm: () => void, onCancel: () => void}> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onCancel}></div>
    <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
      <div className="w-20 h-20 bg-rose-600/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
        <ICONS.Logout className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-black text-white text-center mb-3 uppercase tracking-tight">Konfirmasi Keluar</h3>
      <p className="text-sm text-slate-400 text-center mb-10 leading-relaxed italic">"Apakah Anda yakin ingin mengakhiri sesi pengerjaan dan keluar dari sistem SeuramoeTech?"</p>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={onCancel} className="py-4 bg-slate-800 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:text-white transition-all border border-slate-700">Batal</button>
        <button onClick={onConfirm} className="py-4 bg-rose-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-rose-500 shadow-xl shadow-rose-600/20 transition-all">Keluar Sesi</button>
      </div>
      <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center mt-8">Node Regional: Sumatra-North-01</p>
    </div>
  </div>
);

export default App;
