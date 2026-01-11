
import React from 'react';
import { UserRole, User, SubscriptionTier } from './types';

// Menyesuaikan status dan detail demo user ke Bahasa Indonesia
export const DEMO_USERS: User[] = [
  {
    id: 'u1',
    username: 'superadmin',
    fullName: 'System Overlord',
    role: UserRole.SUPER_ADMIN,
    email: 'super@seuramoetech.com',
    status: 'active'
  },
  {
    id: 'u2',
    username: 'owner_acehtech',
    fullName: 'Teuku Abdullah',
    role: UserRole.STORE_OWNER,
    subscriptionTier: SubscriptionTier.PRO,
    isSubscriptionActive: true,
    email: 'owner@acehtech.com',
    storeId: 's1',
    status: 'active'
  },
  {
    id: 'u3',
    username: 'admin_toko1',
    fullName: 'Siti Aminah',
    role: UserRole.STAFF_ADMIN,
    email: 'admin@toko1.com',
    storeId: 's1',
    status: 'active'
  },
  {
    id: 'u4',
    username: 'tech_toko1',
    fullName: 'Budi Santoso',
    role: UserRole.TECHNICIAN,
    email: 'tech@toko1.com',
    storeId: 's1',
    status: 'active'
  },
  {
    id: 'u5',
    username: 'marketing_toko1',
    fullName: 'Cut Nyak Dien',
    role: UserRole.MARKETING,
    email: 'marketing@toko1.com',
    storeId: 's1',
    status: 'active'
  },
  {
    id: 'u6',
    username: 'customer001',
    fullName: 'Ali Akbar',
    role: UserRole.CUSTOMER,
    email: 'ali@visitor.com',
    status: 'active'
  }
];

export const SUBSCRIPTION_PLANS = [
  {
    tier: SubscriptionTier.BASIC,
    name: 'Pemula (Starter)',
    priceMonthly: 499000,
    priceYearly: 4990000,
    description: 'Solusi retail dasar untuk toko laptop tunggal.',
    features: [
      'Manajemen 1 Toko',
      'Katalog Produk Terbatas',
      'Laporan Operasional Dasar',
      'Dukungan Teknis Standar',
      '1 Akun Admin'
    ]
  },
  {
    tier: SubscriptionTier.PRO,
    name: 'Bisnis (Business)',
    priceMonthly: 1299000,
    priceYearly: 12990000,
    description: 'Tingkatkan performa dengan manajemen tim & pemasaran.',
    features: [
      'Kontrol Akses Multi-Staf',
      'Mesin Promo & Diskon',
      'Laporan Analitik Lengkap',
      'Integrasi WhatsApp API',
      'Peringatan Stok Pintar'
    ]
  },
  {
    tier: SubscriptionTier.ENTERPRISE,
    name: 'Korporat (Enterprise)',
    priceMonthly: 2999000,
    priceYearly: 29990000,
    description: 'Skala korporasi tanpa batas dengan dukungan prioritas.',
    features: [
      'Toko & Staf Tanpa Batas',
      'Branding Toko Kustom',
      'Dukungan Node Prioritas 24/7',
      'Pengalaman White-label',
      'Akses API Lanjutan'
    ]
  }
];

export const ICONS = {
  Dashboard: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
    </svg>
  ),
  Store: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.244a1.5 1.5 0 011.06.44l1.19 1.19a3.004 3.004 0 01-.622 4.72m-16.5 0v2.25H21V9.35m0 0v11.65" />
    </svg>
  ),
  Users: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  Package: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  Ticket: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
    </svg>
  ),
  Logout: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  ),
  Settings: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9" />
    </svg>
  ),
  Plus: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
};
