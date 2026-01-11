import React, { useState, useEffect } from 'react';
import PromoService from '../../services/PromoService.ts';
import InventoryService from '../../services/InventoryService.ts';
import AuthService from '../../auth/AuthService.ts';
import SecurityService from '../../services/SecurityService.ts';
import { Promo, PromoType, PromoStatus, Coupon, Product, AuditCategory } from '../../types.ts';
import { ICONS } from '../../constants.tsx';
import RightDrawer from '../../components/Shared/RightDrawer.tsx';

const MarketingCampaigns: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const storeId = user?.storeId || 's1';

  const [activeSubTab, setActiveSubTab] = useState<'promos' | 'vouchers' | 'banners'>('promos');
  const [promos, setPromos] = useState<Promo[]>([]);
  const [vouchers, setVouchers] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Drawer & Form States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'promo' | 'voucher' | 'banner'>('promo');
  const [newPromo, setNewPromo] = useState<Partial<Promo>>({
    type: PromoType.PERCENTAGE,
    status: PromoStatus.SCHEDULED,
    currentUsage: 0,
    storeId: storeId
  });
  const [newVoucher, setNewVoucher] = useState<Partial<Coupon>>({
    discountType: 'PERCENT',
    storeId: storeId
  });

  useEffect(() => {
    loadData();
  }, [storeId]);

  const loadData = () => {
    setPromos(PromoService.getPromos(storeId));
    setVouchers(PromoService.getCoupons(storeId));
    setProducts(InventoryService.getProducts(storeId));
  };

  const handleCreatePromo = () => {
    if (newPromo.title && newPromo.value) {
      PromoService.addPromo({
        ...newPromo,
        status: PromoStatus.SCHEDULED 
      } as Promo);

      // Audit Log Injection
      SecurityService.addLog({
        userId: user?.id || 'unknown',
        userName: user?.fullName || 'Staff Marketing',
        action: 'PROMO_CREATION_REQUEST',
        category: AuditCategory.SYSTEM,
        details: `Marketing mengajukan promo baru: ${newPromo.title} (${newPromo.value}%)`,
        ip: '127.0.0.1',
        severity: 'INFO'
      });

      alert("Usulan Promo Berhasil Dibuat! Status: Terjadwal (Menunggu Izin/Verifikasi Owner)");
      setIsDrawerOpen(false);
      loadData();
    }
  };

  const handleCreateVoucher = () => {
    // Audit Log Injection
    SecurityService.addLog({
      userId: user?.id || 'unknown',
      userName: user?.fullName || 'Staff Marketing',
      action: 'VOUCHER_GENERATION',
      category: AuditCategory.SYSTEM,
      details: `Marketing men-generate voucher node regional: ${newVoucher.code}`,
      ip: '127.0.0.1',
      severity: 'INFO'
    });
    
    alert("Voucher baru berhasil didaftarkan ke sistem SeuramoeTech.");
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h3 className="text-2xl font-black text-white tracking-tight uppercase">Campaign Command Center</h3>
           <p className="text-sm text-slate-500 font-medium mt-1">Kelola strategi harga, voucher, dan visual storefront toko.</p>
        </div>
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
           <button onClick={() => setActiveSubTab('promos')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'promos' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Promosi</button>
           <button onClick={() => setActiveSubTab('vouchers')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'vouchers' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Voucher</button>
           <button onClick={() => setActiveSubTab('banners')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'banners' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Banners</button>
        </div>
      </div>

      {activeSubTab === 'promos' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                 Active & Scheduled Promos
              </h4>
              <button 
                onClick={() => { setDrawerMode('promo'); setIsDrawerOpen(true); }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-gap-2"
              >
                <ICONS.Plus className="w-4 h-4" /> Buat Promo Baru
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.map(promo => (
                <div key={promo.id} className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col group">
                   <div className="flex justify-between items-start mb-6">
                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                        promo.status === PromoStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {promo.status}
                      </span>
                      <div className="p-2 bg-slate-900 rounded-xl text-indigo-400"><ICONS.Ticket className="w-5 h-5" /></div>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">{promo.title}</h3>
                   <p className="text-sm font-black text-indigo-400 mb-6">
                      {promo.type === PromoType.PERCENTAGE ? `${promo.value}% OFF` : `Rp ${promo.value.toLocaleString()} OFF`}
                   </p>
                   <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase mb-8">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg>
                      <span>{promo.startDate} s/d {promo.endDate}</span>
                   </div>
                   <div className="mt-auto pt-6 border-t border-slate-800/50 flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-500 uppercase">Usage: {promo.currentUsage} / {promo.usageLimit || '∞'}</span>
                      <button className="text-[9px] font-black text-rose-500 uppercase hover:text-white transition-colors">Hentikan</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeSubTab === 'vouchers' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">E-Voucher Generator</h4>
              <button 
                onClick={() => { setDrawerMode('voucher'); setIsDrawerOpen(true); }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2"
              >
                <ICONS.Plus className="w-4 h-4" /> Generate Voucher
              </button>
           </div>
           
           <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                       <th className="px-6 py-5">Kode Voucher</th>
                       <th className="px-6 py-5">Konfigurasi Diskon</th>
                       <th className="px-6 py-5">Penggunaan</th>
                       <th className="px-6 py-5">Masa Berlaku</th>
                       <th className="px-6 py-5 text-right">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                    {vouchers.map(v => (
                       <tr key={v.id} className="hover:bg-slate-800/20 transition-all group">
                          <td className="px-6 py-4">
                             <div className="bg-indigo-600/10 border border-indigo-500/20 px-3 py-1 rounded-lg w-fit text-sm font-black text-indigo-400 font-mono tracking-widest">
                                {v.code}
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <p className="text-sm font-black text-white">{v.discountValue}{v.discountType === 'PERCENT' ? '%' : ' IDR'}</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Min: Rp {v.minPurchase.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-white">{v.usedCount} / {v.maxUsage}</span>
                                <div className="w-16 h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                   <div className="h-full bg-emerald-500" style={{ width: `${(v.usedCount/v.maxUsage)*100}%` }}></div>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-widest">{v.expiryDate}</td>
                          <td className="px-6 py-4 text-right">
                             <button className="p-2 bg-slate-800 text-slate-500 hover:text-white rounded-lg"><ICONS.Settings className="w-4 h-4" /></button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeSubTab === 'banners' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-6">
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">Highlight Produk & Banners</h4>
              <div className="aspect-[21/9] rounded-3xl bg-slate-950 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center hover:border-indigo-500/50 hover:bg-indigo-600/5 transition-all group cursor-pointer">
                 <div className="p-4 bg-slate-900 rounded-2xl mb-4 group-hover:scale-110 transition-transform"><ICONS.Plus className="w-8 h-8 text-slate-500" /></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white">Upload New Hero Banner</span>
              </div>
              <div className="p-6 glass-panel rounded-3xl border-slate-800 bg-indigo-600/5">
                 <p className="text-xs text-indigo-300 leading-relaxed italic">
                    "Tips: Gunakan visual kontras tinggi untuk menarik perhatian pelanggan di halaman utama marketplace Sumatra."
                 </p>
              </div>
           </div>
           
           <div className="space-y-6">
              <h4 className="text-lg font-bold text-white uppercase tracking-tight">Katalog Produk Unggulan</h4>
              <div className="grid grid-cols-1 gap-3">
                 {products.slice(0, 4).map(p => (
                   <div key={p.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center gap-4">
                         <img src={p.thumbnail} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                         <div>
                            <p className="text-sm font-bold text-white">{p.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Normal: Rp {p.price.toLocaleString()}</p>
                         </div>
                      </div>
                      <button className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${p.isSponsored ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-white'}`}>
                        {p.isSponsored ? 'Highlighted' : 'Highlight Now'}
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Global Campaign Management Drawer */}
      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerMode === 'promo' ? 'Buat Strategi Promo' : 'Generate Voucher Node'}>
         {drawerMode === 'promo' && (
           <div className="space-y-8">
              <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Pemberitahuan</p>
                 <p className="text-xs text-slate-300 leading-relaxed">Promosi yang Anda buat akan masuk ke antrean <span className="font-bold text-white">SCHEDULED</span>. Owner toko harus memberikan konfirmasi final sebelum promo aktif secara LIVE.</p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Judul Kampanye</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Flash Sale Akhir Bulan"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                      value={newPromo.title || ''}
                      onChange={e => setNewPromo({...newPromo, title: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipe Diskon</label>
                       <select 
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white appearance-none"
                          value={newPromo.type}
                          onChange={e => setNewPromo({...newPromo, type: e.target.value as PromoType})}
                       >
                          <option value={PromoType.PERCENTAGE}>Persentase (%)</option>
                          <option value={PromoType.NOMINAL}>Nominal (IDR)</option>
                          <option value={PromoType.FLASH_SALE}>Flash Sale (Khusus)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nilai Diskon</label>
                       <input 
                         type="number" 
                         className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                         value={newPromo.value || ''}
                         onChange={e => setNewPromo({...newPromo, value: parseInt(e.target.value)})}
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mulai</label>
                       <input 
                         type="date" 
                         className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                         onChange={e => setNewPromo({...newPromo, startDate: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selesai</label>
                       <input 
                         type="date" 
                         className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                         onChange={e => setNewPromo({...newPromo, endDate: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Produk</label>
                    <select className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none">
                       <option>-- Semua Produk --</option>
                       {products.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                 </div>
              </div>

              <button 
                onClick={handleCreatePromo}
                className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
              >
                Ajukan Promo (Request Owner)
              </button>
           </div>
         )}

         {drawerMode === 'voucher' && (
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kode Unik Voucher</label>
                 <input 
                   type="text" 
                   placeholder="Misal: MERDEKA10"
                   className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono tracking-[0.2em]" 
                   onChange={e => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})}
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kuota Pakai</label>
                    <input type="number" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" placeholder="100" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Batas Kedaluwarsa</label>
                    <input type="date" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" />
                 </div>
              </div>
              <button 
                onClick={handleCreateVoucher}
                className="w-full py-4 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20"
              >
                Aktifkan Voucher Region
              </button>
           </div>
         )}
      </RightDrawer>
    </div>
  );
};

export default MarketingCampaigns;