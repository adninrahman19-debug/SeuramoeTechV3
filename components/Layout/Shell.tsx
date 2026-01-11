
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
  const isImpersonating = AuthService.isImpersonating();

  const handleStopImpersonation = () => {
    if (confirm("Hentikan mode penyamaran dan kembali ke akun Super Admin Anda?")) {
      AuthService.stopImpersonating();
    }
  };

  const getSuperAdminNav = (): NavGroup[] => [
    { 
      groupName: "Kecerdasan Bisnis", 
      items: [
        { label: 'Ringkasan', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
        { label: 'Analitik Bisnis', path: 'analytics', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> }
      ] 
    },
    { 
      groupName: "Tata Kelola", 
      items: [
        { label: 'Direktori Pengguna', path: 'users', icon: <ICONS.Users className="w-5 h-5" /> },
        { label: 'Peran & Akses (RBAC)', path: 'roles', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth={2}/></svg> },
        { label: 'Node Toko Sumatra', path: 'stores', icon: <ICONS.Store className="w-5 h-5" /> }
      ] 
    },
    { 
      groupName: "Keuangan Global", 
      items: [
        { label: 'Ledger Global', path: 'transactions', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg> },
        { label: 'Mesin Penagihan', path: 'billing', icon: <ICONS.Ticket className="w-5 h-5" /> },
        { label: 'Paket Langganan', path: 'plans', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeWidth={2}/></svg> }
      ] 
    },
    { 
      groupName: "Kontrol Sistem", 
      items: [
        { label: 'Pusat Moderasi', path: 'moderation', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg> },
        { label: 'Kurasi Global', path: 'curation', icon: <ICONS.Package className="w-5 h-5" /> },
        { label: 'Pengawasan Support', path: 'support', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth={2}/></svg> },
        { label: 'Pusat Komunikasi', path: 'communication', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth={2}/></svg> }
      ] 
    },
    {
      groupName: "Infrastruktur",
      items: [
        { label: 'Audit Keamanan', path: 'security', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={2}/></svg> },
        { label: 'Alat Pengembang', path: 'devtools', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeWidth={2}/></svg> },
        { label: 'Mode Dewa (God)', path: 'powers', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg> },
        { label: 'Log Sistem', path: 'logs', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2}/></svg> },
        { label: 'Pengaturan Global', path: 'settings', icon: <ICONS.Settings className="w-5 h-5" /> }
      ]
    }
  ];

  const getStoreOwnerNav = (): NavGroup[] => [
    { 
      groupName: "Pusat Komando", 
      items: [
        { label: 'Ikhtisar', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
        { label: 'Pusat Pintar (AI)', path: 'smart', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" strokeWidth={2}/></svg> },
        { label: 'Laporan & Analitik', path: 'reports', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> }
      ] 
    },
    {
      groupName: "Tenaga Kerja",
      items: [
        { label: 'Kelola Staf', path: 'staff', icon: <ICONS.Users className="w-5 h-5" /> }
      ]
    },
    { 
      groupName: "Penjualan & Stok", 
      items: [
        { label: 'Pesanan (Fulfillment)', path: 'orders', icon: <ICONS.Package className="w-5 h-5" /> },
        { label: 'Master Inventaris', path: 'inventory', icon: <ICONS.Store className="w-5 h-5" /> },
        { label: 'Pusat Pembayaran', path: 'financials', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg> }
      ] 
    },
    { 
      groupName: "Pelanggan & Pertumbuhan", 
      items: [
        { label: 'Pusat Servis', path: 'tickets', icon: <ICONS.Ticket className="w-5 h-5" /> },
        { label: 'Pemasaran & Promo', path: 'promo', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" strokeWidth={2}/></svg> },
        { label: 'Branding Toko', path: 'marketing', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg> },
        { label: 'Ulasan & Bantuan', path: 'feedback', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeWidth={2}/></svg> }
      ] 
    },
    {
      groupName: "Pengaturan Bisnis",
      items: [
        { label: 'Tagihan SaaS', path: 'billing', icon: <ICONS.Ticket className="w-5 h-5" /> },
        { label: 'Pengaturan Toko', path: 'settings', icon: <ICONS.Settings className="w-5 h-5" /> },
        { label: 'Node Keamanan', path: 'security', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg> }
      ]
    }
  ];

  const getStaffAdminNav = (): NavGroup[] => [
    { 
      groupName: "Operasional Harian", 
      items: [
        { label: 'Ikhtisar', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
        { label: 'Pesanan (Fulfillment)', path: 'orders', icon: <ICONS.Package className="w-5 h-5" /> },
        { label: 'Katalog & Stok', path: 'inventory', icon: <ICONS.Store className="w-5 h-5" /> }
      ] 
    },
    { 
      groupName: "Keuangan & Laporan", 
      items: [
        { label: 'Kas & Pembayaran', path: 'financials', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg> },
        { label: 'Laporan Operasional', path: 'reports', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2}/></svg> }
      ] 
    },
    { 
      groupName: "Meja Layanan", 
      items: [
        { label: 'Pusat Servis', path: 'tickets', icon: <ICONS.Ticket className="w-5 h-5" /> },
        { label: 'Ulasan & CS', path: 'feedback', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeWidth={2}/></svg> }
      ] 
    }
  ];

  const getTechnicianNav = (): NavGroup[] => [
    { 
      groupName: "Bengkel Kerja", 
      items: [
        { label: 'Meja Kerja', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
        { label: 'Perbaikan Saya', path: 'tickets', icon: <ICONS.Settings className="w-5 h-5" /> },
        { label: 'Alat Bantu Teknis', path: 'tools', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
        { label: 'Suku Cadang', path: 'inventory', icon: <ICONS.Package className="w-5 h-5" /> }
      ] 
    },
    { 
      groupName: "Rekaman Data", 
      items: [
        { label: 'Inspeksi Garansi', path: 'warranty', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg> },
        { label: 'Riwayat Servis', path: 'history', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg> },
        { label: 'Performa Saya', path: 'performance', icon: <ICONS.Dashboard className="w-5 h-5" /> }
      ] 
    }
  ];

  const getMarketingNav = (): NavGroup[] => [
    { 
      groupName: "Pertumbuhan", 
      items: [
        { label: 'Statistik Pertumbuhan', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
        { label: 'Promo & Kampanye', path: 'promo', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" strokeWidth={2}/></svg> },
        { label: 'Pusat Engagement', path: 'engagement', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth={2}/></svg> }
      ] 
    },
    { 
      groupName: "Kreatif", 
      items: [
        { label: 'Studio Konten', path: 'content', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg> }
      ] 
    },
    { 
      groupName: "Kecerdasan", 
      items: [
        { label: 'Analitik Pasar', path: 'analytics', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
        { label: 'Laporan Pertumbuhan', path: 'reports', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2}/></svg> }
      ] 
    },
    { 
      groupName: "Kepatuhan", 
      items: [
        { label: 'Kebijakan Akses', path: 'security', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg> },
        { label: 'Suara Pelanggan', path: 'feedback', icon: <ICONS.Users className="w-5 h-5" /> }
      ] 
    }
  ];

  const getCustomerNav = (): NavGroup[] => [
    { 
      groupName: "Ekosistem", 
      items: [
        { label: 'Beranda Node', path: 'overview', icon: <ICONS.Dashboard className="w-5 h-5" /> },
        { label: 'Hub Pintar (AI)', path: 'smart', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg> },
        { label: 'Mall Sumatra', path: 'marketplace', icon: <ICONS.Store className="w-5 h-5" /> },
        { label: 'Promosi', path: 'promo', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" strokeWidth={2}/></svg> }
      ] 
    },
    { 
      groupName: "Layanan & Support", 
      items: [
        { label: 'Pelacakan Servis', path: 'repairs', icon: <ICONS.Ticket className="w-5 h-5" /> },
        { label: 'Pusat Garansi', path: 'warranty', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg> },
        { label: 'Ulasan & Bantuan', path: 'help', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg> }
      ] 
    },
    { 
      groupName: "Aset Pribadi", 
      items: [
        { label: 'Ledger Pesanan', path: 'orders', icon: <ICONS.Package className="w-5 h-5" /> },
        { label: 'Riwayat Pembayaran', path: 'payments', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg> },
        { label: 'Profil Identitas', path: 'profile', icon: <ICONS.Users className="w-5 h-5" /> }
      ] 
    }
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
      
      {/* Sidebar Navigation */}
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
              {isSidebarOpen && <span className="text-sm font-bold">Keluar Sesi</span>}
           </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav for Customers */}
      {isCustomer && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-t border-slate-900 px-6 py-3 flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.4)] overflow-x-auto no-scrollbar">
           <button onClick={() => onNavigate('overview')} className={`flex flex-col items-center gap-1 shrink-0 px-2 ${activeTab === 'overview' ? 'text-indigo-500' : 'text-slate-600'}`}>
              <ICONS.Dashboard className="w-6 h-6" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Beranda</span>
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {isImpersonating && (
          <div className="bg-amber-600/95 backdrop-blur-md px-6 py-2 flex items-center justify-between shadow-xl relative z-50">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Sistem dalam Mode Penyamaran (Impersonation) • Akun: {user.fullName}</p>
            </div>
            <button 
              onClick={handleStopImpersonation}
              className="px-4 py-1.5 bg-white text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-100 transition-all shadow-md"
            >
              Hentikan Penyamaran
            </button>
          </div>
        )}
        <header className="h-16 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             {isCustomer && <Logo size="sm" className="md:hidden" />}
             <div className="hidden md:flex flex-col">
                <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest">{user.role.replace('_', ' ')}</h4>
                <p className="text-[10px] text-slate-500">Ekosistem Regional: Sumatra</p>
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
                <p className="text-[9px] text-slate-500 mt-1 uppercase font-black">Anggota Terverifikasi</p>
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
