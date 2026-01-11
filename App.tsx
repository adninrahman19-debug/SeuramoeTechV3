import React, { useState } from 'react';
import AuthService from './auth/AuthService.ts';
import { User, UserRole, SubscriptionTier } from './types.ts';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import SubscriptionPlan from './pages/SubscriptionPlan.tsx';
import Shell from './components/Layout/Shell.tsx';
import Logo from './components/Shared/Logo.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(AuthService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('overview');

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActiveTab('overview');
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  const handlePlanSelection = (tier: SubscriptionTier) => {
    const updatedUser = AuthService.updateSubscription(tier);
    if (updatedUser) {
      setUser({ ...updatedUser });
    }
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

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

  return (
    <Shell onLogout={handleLogout} activeTab={activeTab} onNavigate={setActiveTab}>
      <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />
    </Shell>
  );
};

export default App;