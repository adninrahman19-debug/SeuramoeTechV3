import React, { useState, useEffect } from 'react';
import AuthService from './auth/AuthService';
import { User, UserRole, SubscriptionTier } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import SubscriptionPlan from './pages/SubscriptionPlan';
import Shell from './components/Layout/Shell';
import Logo from './components/Shared/Logo';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(AuthService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('overview');
  const [view, setView] = useState<'landing' | 'auth'>('landing');

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActiveTab('overview'); // Reset tab saat login
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setView('landing');
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
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }
    return (
      <LandingPage 
        onEnterAuth={() => setView('auth')} 
        onEnterMarketplace={() => {
          // Simulasi masuk ke marketplace sebagai tamu (guest)
          // Untuk demo ini, kita arahkan ke login saja karena butuh peran user
          setView('auth');
        }} 
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
            onClick={handleLogout} 
            className="text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors px-4 py-2 hover:bg-slate-900 rounded-xl"
          >
            Keluar
          </button>
        </header>
        <SubscriptionPlan onPlanSelected={handlePlanSelection} />
      </div>
    );
  }

  // Main Dashboard Shell
  return (
    <Shell onLogout={handleLogout} activeTab={activeTab} onNavigate={setActiveTab}>
      <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />
    </Shell>
  );
};

export default App;
