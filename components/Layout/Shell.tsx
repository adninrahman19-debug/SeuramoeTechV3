import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { ICONS } from '../../constants';
import AuthService from '../../auth/AuthService';
import GlobalSearch from '../Shared/GlobalSearch';
import Logo from '../Shared/Logo';
import CartService from '../../services/CartService';
import NotificationService from '../../services/NotificationService';

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
  const [cartCount, setCartCount] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

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
    
    // Sync UI data
    const updateStats = () => {
      setCartCount(CartService.getTotals().itemCount);
      setUnreadNotifs(NotificationService.getUnreadCount());
    };
    
    updateStats();
    window.addEventListener('cart-updated', updateStats);
    window.addEventListener('notifications-updated', updateStats);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('cart-updated', updateStats);
      window.removeEventListener('notifications-updated', updateStats);
    };
  }, []);

  if (!user) return <>{children}</>;

  const isCustomer = user.role === UserRole.CUSTOMER;

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
    { groupName: "Growth Hub", items: [
      { label: 'Market Stats', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
      { label: 'Active Campaigns', path: 'promo', icon: <ICONS.Ticket className="w-5 h-5" /> },
      { label: 'Engagement Hub', path: 'engagement', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth={2}/></svg> },
      { label: 'Creative Content', path: 'content', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg> },
      { label: 'Advanced Analytics', path: 'analytics', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
      { label: 'Marketing Reports', path: 'reports', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2}/></svg> }
    ]},
    { groupName: "Reputation & Compliance", items: [
      { label: 'Customer Reviews', path: 'feedback', icon: <ICONS.Users className="w-5 h-5" /> },
      { label: 'Access Policy', path: 'security', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg> }
    ]}
  ];

  const getCustomerNav = (): NavGroup[] => [
    { groupName: "Ecosystem", items: [
      { label: 'Home Node', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
      { label: 'Neural Hub', path: 'smart', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg> },
      { label: 'Mall', path: 'marketplace', icon: <ICONS.Store className="w-5 h-5" /> },
      { label: 'Promo', path: 'promo', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" strokeWidth={2}/></svg> },
      { label: 'Servis', path: 'repairs', icon: <ICONS.Ticket className="w-5 h-5" /> },
      { label: 'Pesan', path: 'notifications', icon: (
        <div className="relative">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth={2}/></svg>
          {unreadNotifs > 0 && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950"></div>}
        </div>
      ) },
      { label: 'Garansi', path: 'warranty', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg> },
      { label: 'Pesanan', path: 'orders', icon: <ICONS.Package className="w-5 h-5" /> },
      { label: 'Akun', path: 'profile', icon: <ICONS.Users className="w-5 h-5" /> }
    ]}
  ];

  const getNavGroups = (): NavGroup[] => {
    switch (user.role) {
      case UserRole.SUPER_ADMIN: return getSuperAdminNav();
      case UserRole.STORE_OWNER: return getStoreOwnerNav();
      case UserRole.STAFF_ADMIN: return getStaffAdminNav();
      case UserRole.TECHNICIAN: return getTechnicianNav();
      case UserRole.MARKETING: return getMarketingNav();
      case UserRole.CUSTOMER: return getCustomerNav();
      default: return [];
    }
  };

  const navGroups = getNavGroups();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col md:flex-row">
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Sidebar for Desktop / Hidden for Customers on Mobile */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-950 border-r border-slate-900 transition-all duration-300 flex flex-col sticky top-0 h-screen z-40 ${isCustomer ? 'hidden md:flex' : 'flex'}`}>
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${
                      activeTab === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div className="shrink-0">{item.icon}</div>
                    {isSidebarOpen && <span className="text-sm font-bold truncate">{item.label}</span>}
                    {item.path === 'notifications' && !isSidebarOpen && unreadNotifs > 0 && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></div>
                    )}
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

      {isCustomer && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-t border-slate-900 px-6 py-3 flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.4)] overflow-x-auto no-scrollbar">
           <button onClick={() => onNavigate('overview')} className={`flex flex-col items-center gap-1 shrink-0 px-2 ${activeTab === 'overview' ? 'text-indigo-500' : 'text-slate-600'}`}>
              <ICONS.Dashboard className="w-6 h-6" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Home</span>
           </button>
           <button onClick={() => onNavigate('smart')} className={`flex flex-col items-center gap-1 shrink-0 px-2 ${activeTab === 'smart' ? 'text-indigo-500' : 'text-slate-600'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>
              <span className="text-[8px] font-black uppercase tracking-tighter">AI Hub</span>
           </button>
           <button onClick={() => onNavigate('marketplace')} className={`flex flex-col items-center gap-1 shrink-0 px-2 ${activeTab === 'marketplace' ? 'text-indigo-500' : 'text-slate-600'}`}>
              <ICONS.Store className="w-6 h-6" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Mall</span>
           </button>
           <button onClick={() => onNavigate('notifications')} className={`flex flex-col items-center gap-1 shrink-0 px-2 relative ${activeTab === 'notifications' ? 'text-indigo-500' : 'text-slate-600'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth={2}/></svg>
              <span className="text-[8px] font-black uppercase tracking-tighter">Pesan</span>
              {unreadNotifs > 0 && <div className="absolute top-0 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900"></div>}
           </button>
           <button onClick={() => onNavigate('profile')} className={`flex flex-col items-center gap-1 shrink-0 px-2 ${activeTab === 'profile' ? 'text-indigo-500' : 'text-slate-600'}`}>
              <ICONS.Users className="w-6 h-6" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Akun</span>
           </button>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             {isCustomer && <Logo size="sm" className="md:hidden" />}
             <div className="hidden md:flex flex-col">
                <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest">{user.role.replace('_', ' ')}</h4>
                <p className="text-[10px] text-slate-500">Regional Ecosystem: Sumatra</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <button 
                onClick={() => onNavigate('notifications')}
                className="relative p-2 text-slate-500 hover:text-white transition-colors"
             >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth={2}/></svg>
                {unreadNotifs > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-slate-950">{unreadNotifs}</span>}
             </button>
             <div className="hidden sm:flex flex-col items-end">
                <p className="text-xs font-bold text-white leading-none">{user.fullName}</p>
                <p className="text-[9px] text-slate-500 mt-1 uppercase font-black">Verified Member</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shadow-lg group cursor-pointer" onClick={() => isCustomer && onNavigate('profile')}>
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