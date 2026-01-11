import React, { useState, useEffect } from 'react';
import AuthService from '../../auth/AuthService';
import OrderService from '../../services/OrderService';
import SupportService from '../../services/SupportService';
import PromoService from '../../services/PromoService';
import StoreService from '../../services/StoreService';
import InventoryService from '../../services/InventoryService';
import { ICONS } from '../../constants';
import { SupportStatus, OrderStatus, Product } from '../../types';

const CustomerOverview: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const [activeOrders, setActiveOrders] = useState(0);
  const [activeRepairs, setActiveRepairs] = useState(0);
  const [activeWarranties, setActiveWarranties] = useState(0);
  const [availablePromos, setAvailablePromos] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [nearestStores, setNearestStores] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const orders = OrderService.getOrders('s1').filter(o => o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.CANCELLED);
      setActiveOrders(orders.length);

      const repairs = SupportService.getTickets('s1').filter(t => t.customerName === user.fullName && t.status !== SupportStatus.CLOSED && t.status !== SupportStatus.RESOLVED);
      setActiveRepairs(repairs.length);

      const warranties = SupportService.getWarrantyRegistrations('s1').filter(w => new Date(w.expiryDate) > new Date());
      setActiveWarranties(warranties.length);

      const promos = PromoService.getCoupons('s1');
      setAvailablePromos(promos.length);

      const products = InventoryService.getProducts('s1').slice(0, 4);
      setRecommendedProducts(products);

      const stores = StoreService.getAllStores();
      setNearestStores(stores);
    }
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. Account Summary & Identity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] border-slate-800 bg-gradient-to-br from-indigo-600/5 to-transparent shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><ICONS.Users className="w-32 h-32" /></div>
           <div className="w-24 h-24 rounded-3xl bg-slate-800 border border-slate-700 overflow-hidden shadow-2xl shrink-0">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="avatar" />
           </div>
           <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                 <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">{user.fullName}</h2>
                 <span className="px-3 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded-full border border-emerald-500/20 uppercase tracking-widest">Akun Terverifikasi</span>
              </div>
              <div className="space-y-3 mt-4">
                 <div className="flex items-center gap-3 text-xs text-slate-400">
                    <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>{user.email} • Banda Aceh, Sumatra</span>
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 rounded-lg border border-slate-800">
                       <span className="text-indigo-400">Default Pay:</span>
                       <span className="text-white font-mono">QRIS / BANK ACEH</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 bg-indigo-600 shadow-2xl shadow-indigo-600/20 text-white flex flex-col justify-between">
           <div>
              <h4 className="text-lg font-black tracking-tight uppercase mb-2">Loyalty Member</h4>
              <p className="text-xs opacity-70 leading-relaxed mb-6">Kumpulkan poin dari setiap transaksi servis dan pembelian di SeuramoeTech.</p>
              <div className="flex items-baseline gap-1">
                 <span className="text-4xl font-black">1,240</span>
                 <span className="text-xs font-bold opacity-60 uppercase">Poin</span>
              </div>
           </div>
           <button className="w-full mt-6 py-3 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-lg">Tukar Reward</button>
        </div>
      </div>

      {/* 2. Quick Activity Pulse */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform"><ICONS.Package className="w-5 h-5" /></div>
               <span className="text-2xl font-black text-white">{activeOrders}</span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Order Aktif</p>
         </div>
         <div className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform"><ICONS.Ticket className="w-5 h-5" /></div>
               <span className="text-2xl font-black text-white">{activeRepairs}</span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Servis Berjalan</p>
         </div>
         <div className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg></div>
               <span className="text-2xl font-black text-white">{activeWarranties}</span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unit Garansi</p>
         </div>
         <div className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-rose-600/10 text-rose-500 rounded-2xl group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" strokeWidth={2}/></svg></div>
               <span className="text-2xl font-black text-rose-500">{availablePromos}</span>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Promo Hemat</p>
         </div>
      </div>

      {/* 3. Recommendations & Discovery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Rekomendasi Untuk Anda</h3>
               <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Lihat Semua</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {recommendedProducts.map(p => (
                 <div key={p.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-[2rem] flex items-center gap-4 group hover:border-indigo-500/40 transition-all cursor-pointer shadow-xl">
                    <img src={p.thumbnail} className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                    <div className="flex-1 min-w-0">
                       <p className="text-xs font-bold text-white truncate">{p.name}</p>
                       <p className="text-[10px] font-black text-indigo-400 mt-1">Rp {p.price.toLocaleString()}</p>
                    </div>
                    <button className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={3}/></svg>
                    </button>
                 </div>
               ))}
            </div>
         </div>

         <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Node Terdekat (Aceh)</h3>
               <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Live Node Tracking</span>
            </div>
            <div className="space-y-3">
               {nearestStores.map(store => (
                  <div key={store.id} className="p-5 bg-slate-950 border border-slate-800 rounded-3xl flex justify-between items-center group hover:border-indigo-500/20 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-slate-500">
                           <ICONS.Store className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-white">{store.name}</p>
                           <p className="text-[10px] text-slate-500 uppercase font-black">{store.location}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Buka s/d 20:00</p>
                        <button className="text-[9px] font-black text-slate-600 hover:text-white uppercase mt-1">Hubungi Node</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 4. Special Promo Highlight Banner */}
      <div className="p-10 glass-panel rounded-[3rem] border-slate-800 bg-indigo-600/5 relative overflow-hidden shadow-2xl">
         <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-center md:text-left space-y-2">
               <span className="px-3 py-1 bg-rose-600 text-white text-[9px] font-black uppercase rounded-lg tracking-widest mb-4 inline-block shadow-lg shadow-rose-600/20">Hot Campaign Sumatra</span>
               <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Ramadan Regional Sale</h3>
               <p className="text-sm text-slate-400 max-w-md">Nikmati diskon s/d 15% untuk perakitan PC Gaming dan pembersihan laptop mendalam di seluruh node Sumatra Utara.</p>
            </div>
            <div className="shrink-0 flex flex-col items-center">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Gunakan Kode:</p>
               <div className="px-8 py-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xl font-black text-white tracking-[0.3em] shadow-2xl">ACEHTECH15</div>
               <button className="mt-4 text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">Salin Kode</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CustomerOverview;