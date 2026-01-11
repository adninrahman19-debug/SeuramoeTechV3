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
    { groupName: "Operational Core", items: [
      { label: 'Overview', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
      { label: 'Orders & Transaksi', path: 'orders', icon: <ICONS.Package className="w-5 h-5" /> },
      { label: 'Katalog & Stok', path: 'inventory', icon: <ICONS.Store className="w-5 h-5" /> }
    ]},
    { groupName: "Customer Support", items: [
      { label: 'Service Hub', path: 'tickets', icon: <ICONS.Settings className="w-5 h-5" /> },
      { label: 'Ulasan & Keluhan', path: 'feedback', icon: <ICONS.Users className="w-5 h-5" /> }
    ]},
    { groupName: "Financial & Compliance", items: [
      { label: 'Pembayaran & Kas', path: 'financials', icon: <ICONS.Ticket className="w-5 h-5" /> },
      { label: 'Laporan & Shift', path: 'reports', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
    ]}
  ];

  const getTechnicianNav = (): NavGroup[] => [
    { groupName: "Service Workbench", items: [
      { label: 'Command Desk', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
      { label: 'My Repairs', path: 'tickets', icon: <ICONS.Ticket className="w-5 h-5" /> },
      { label: 'Technical Tools', path: 'tools', icon: <ICONS.Plus className="w-5 h-5" /> },
      { label: 'Spare Parts', path: 'inventory', icon: <ICONS.Settings className="w-5 h-5" /> }
    ]},
    { groupName: "Quality Assurance", items: [
      { label: 'Warranty Inspection', path: 'warranty', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg> },
      { label: 'Service History', path: 'history', icon: <ICONS.Package className="w-5 h-5" /> }
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
      case UserRole.MARKETING: return getNavGroups(); // Not implemented yet
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