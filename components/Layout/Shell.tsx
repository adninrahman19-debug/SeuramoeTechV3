import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { ICONS } from '../../constants';
import AuthService from '../../auth/AuthService';
import GlobalSearch from '../Shared/GlobalSearch';
import Logo from '../Shared/Logo';

interface ShellProps {
  children: React.ReactNode;
  onLogout: () => void;
  activeTab: string;
  onNavigate: (path: string) => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

const Shell: React.FC<ShellProps> = ({ children, onLogout, activeTab, onNavigate }) => {
  const user = AuthService.getCurrentUser();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const isImpersonating = AuthService.isImpersonating();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!user) return <>{children}</>;

  const getSuperAdminNav = (): NavGroup[] => [
    { groupName: "Intelligence", items: [{ label: 'Overview', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> }, { label: 'Analytics', path: 'analytics', icon: <ICONS.Dashboard className="w-5 h-5" /> }] },
    { groupName: "Core", items: [{ label: 'Users', path: 'users', icon: <ICONS.Users className="w-5 h-5" /> }, { label: 'Stores', path: 'stores', icon: <ICONS.Store className="w-5 h-5" /> }] }
  ];

  const getStoreOwnerNav = (): NavGroup[] => [
    { groupName: "Monitoring", items: [{ label: 'Overview', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> }, { label: 'Analytics', path: 'reports', icon: <ICONS.Dashboard className="w-5 h-5" /> }] },
    { groupName: "Operational", items: [{ label: 'Inventory', path: 'inventory', icon: <ICONS.Package className="w-5 h-5" /> }, { label: 'Service Hub', path: 'tickets', icon: <ICONS.Ticket className="w-5 h-5" /> }] }
  ];

  const getStaffAdminNav = (): NavGroup[] => [
    { groupName: "Daily Ops", items: [
      { label: 'Overview', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
      { label: 'Orders', path: 'orders', icon: <ICONS.Package className="w-5 h-5" /> },
      { label: 'Inventory', path: 'inventory', icon: <ICONS.Package className="w-5 h-5" /> }
    ]},
    { groupName: "Management", items: [
      { label: 'Invoices', path: 'financials', icon: <ICONS.Ticket className="w-5 h-5" /> },
      { label: 'Customers', path: 'feedback', icon: <ICONS.Users className="w-5 h-5" /> }
    ]}
  ];

  const getTechnicianNav = (): NavGroup[] => [
    { groupName: "Service Workbench", items: [
      { label: 'Command Desk', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
      { label: 'My Repairs', path: 'tasks', icon: <ICONS.Ticket className="w-5 h-5" /> },
      { label: 'Spare Parts', path: 'parts', icon: <ICONS.Settings className="w-5 h-5" /> }
    ]},
    { groupName: "History", items: [
      { label: 'Completed Jobs', path: 'history', icon: <ICONS.Plus className="w-5 h-5" /> }
    ]}
  ];

  const getMarketingNav = (): NavGroup[] => [
    { groupName: "Growth", items: [
      { label: 'Market Overview', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
      { label: 'Promos', path: 'promo', icon: <ICONS.Ticket className="w-5 h-5" /> },
      { label: 'Marketing Banners', path: 'marketing', icon: <ICONS.Plus className="w-5 h-5" /> }
    ]},
    { groupName: "Reputation", items: [
      { label: 'Customer Reviews', path: 'feedback', icon: <ICONS.Users className="w-5 h-5" /> }
    ]}
  ];

  const getNavGroups = (): NavGroup[] => {
    switch (user.role) {
      case UserRole.SUPER_ADMIN: return getSuperAdminNav();
      case UserRole.STORE_OWNER: return getStoreOwnerNav();
      case UserRole.STAFF_ADMIN: return getStaffAdminNav();
      case UserRole.TECHNICIAN: return getTechnicianNav();
      case UserRole.MARKETING: return getMarketingNav();
      default: return [];
    }
  };

  const navGroups = getNavGroups();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex">
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
      
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-950 border-r border-slate-900 transition-all duration-300 flex flex-col sticky top-0 h-screen z-40`}>
        <div className="p-6 flex items-center justify-between">
          <Logo size="sm" showText={isSidebarOpen} />
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-500">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
             </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.groupName} className="space-y-2">
              {isSidebarOpen && <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-2">{group.groupName}</p>}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => onNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      activeTab === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div className="shrink-0">{item.icon}</div>
                    {isSidebarOpen && <span className="text-sm font-bold truncate">{item.label}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-900 space-y-2">
           <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
              <ICONS.Logout className="w-5 h-5" />
              {isSidebarOpen && <span className="text-sm font-bold">Sign Out</span>}
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col">
                <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest">{user.role.replace('_', ' ')}</h4>
                <p className="text-[10px] text-slate-500">Terminal Node: SUM-N-01</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <p className="text-xs font-bold text-white leading-none">{user.fullName}</p>
                <p className="text-[9px] text-slate-500 mt-1 uppercase">Staf Terverifikasi</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shadow-lg">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="avatar" />
             </div>
          </div>
        </header>

        <section className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
           {children}
        </section>
      </main>
    </div>
  );
};

export default Shell;