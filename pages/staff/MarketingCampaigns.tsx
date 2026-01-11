
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
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'promo' | 'voucher' | 'banner'>('promo');
  const [newPromo, setNewPromo] = useState<Partial<Promo>>({ type: PromoType.PERCENTAGE, status: PromoStatus.SCHEDULED, currentUsage: 0, storeId: storeId });
  const [newVoucher, setNewVoucher] = useState<Partial<Coupon>>({ 
    discountType: 'PERCENT', 
    storeId: storeId,
    minPurchase: 0,
    maxUsage: 100,
    usedCount: 0,
    expiryDate: new Date(Date.now() + 2592000000).toISOString().split('T')[0]
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
    if (newPromo.title && newPromo.value && newPromo.value > 0) {
      if (confirm(`Ajukan strategi promo "${newPromo.title}" ke Owner untuk review? Promo tidak akan aktif sampai disetujui secara resmi.`)) {
        PromoService.addPromo({ ...newPromo, status: PromoStatus.SCHEDULED } as Promo);
        SecurityService.addLog({
          userId: user?.id || 'unknown',
          userName: user?.fullName || 'Staff Marketing',
          action: 'PROMO_CREATION_REQUEST',
          category: AuditCategory.SYSTEM,
          details: `Marketing mengajukan promo baru: ${newPromo.title} (${newPromo.value})`,
          ip: '127.0.0.1',
          severity: 'INFO'
        });
        alert("Proposal promo berhasil diajukan. Menunggu verifikasi Owner.");
        setIsDrawerOpen(false);
        loadData();
      }
    } else {
      alert("Lengkapi Judul dan Nilai Diskon yang valid.");
    }
  };

  const handleCreateVoucher = () => {
    if (!newVoucher.code?.trim() || !newVoucher.discountValue) {
      alert("Harap masukkan kode voucher dan nilai diskon.");
      return;
    }
    if (confirm(`Aktifkan kode voucher ${newVoucher.code.toUpperCase()} sekarang di node regional?`)) {
      // In real app, push to Coupon database
      SecurityService.addLog({
        userId: user?.id || 'unknown',
        userName: user?.fullName || 'Staff Marketing',
        action: 'VOUCHER_GENERATION',
        category: AuditCategory.SYSTEM,
        details: `Marketing men-generate voucher: ${newVoucher.code}`,
        ip: '127.0.0.1',
        severity: 'INFO'
      });
      alert("Voucher berhasil diaktifkan secara publik.");
      setIsDrawerOpen(false);
      loadData();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
           <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Campaign Hub</h3>
           <p className="text-sm text-slate-500 mt-2 font-medium">Kelola strategi promosi dan visual marketplace regional.</p>
        </div>
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
           <button onClick={() => setActiveSubTab('promos')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'promos' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Promosi</button>
           <button onClick={() => setActiveSubTab('vouchers')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'vouchers' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Voucher</button>
        </div>
      </div>

      {activeSubTab === 'promos' && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                 Antrean Promo Toko
              </h4>
              <button onClick={() => { setDrawerMode('promo'); setIsDrawerOpen(true); }} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20">+ Proposalkan Promo</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.length === 0 ? (
                <div className="col-span-full py-12 text-center glass-panel rounded-3xl border-slate-800 text-slate-500 italic">Belum ada kampanye promo.</div>
              ) : promos.map(promo => (
                <div key={promo.id} className="glass-panel p-8 rounded-[2.5rem] border-slate-800 flex flex-col group hover:border-indigo-500/30 transition-all shadow-xl">
                   <div className="flex justify-between mb-8">
                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${
                        promo.status === PromoStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10 shadow-lg' : 'bg-slate-900 text-slate-500 border-slate-700'
                      }`}>{promo.status}</span>
                      <ICONS.Ticket className="w-5 h-5 text-indigo-400" />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">{promo.title}</h3>
                   <p className="text-sm font-black text-indigo-400 mb-8">
                      {promo.type === PromoType.PERCENTAGE ? `${promo.value}% OFF` : `Rp ${promo.value.toLocaleString()} OFF`}
                   </p>
                   <div className="mt-auto pt-6 border-t border-slate-800/50 flex justify-between items-center">
                      <p className="text-[10px] font-bold text-slate-600 uppercase">Usage: {promo.currentUsage} / {promo.usageLimit || '∞'}</p>
                      <button className="text-[9px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Detail Performa</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeSubTab === 'vouchers' && (
         <div className="space-y-6">
            <div className="flex justify-between items-center">
               <h4 className="text-lg font-bold text-white uppercase tracking-tight">Active Voucher Nodes</h4>
               <button onClick={() => { setDrawerMode('voucher'); setIsDrawerOpen(true); }} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl">+ New Voucher</button>
            </div>
            <div className="glass-panel rounded-[2rem] border-slate-800 overflow-hidden shadow-2xl">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                        <th className="px-6 py-5">Voucher Code</th>
                        <th className="px-6 py-5">Discount Config</th>
                        <th className="px-6 py-5 text-center">Usage Count</th>
                        <th className="px-6 py-5 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                     {vouchers.map(v => (
                        <tr key={v.id} className="hover:bg-slate-800/20 group transition-all font-mono">
                           <td className="px-6 py-4"><span className="px-3 py-1 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg font-black tracking-widest">{v.code}</span></td>
                           <td className="px-6 py-4 text-xs text-white">
                              {v.discountValue}{v.discountType === 'PERCENT' ? '%' : ' IDR'} • Min: {v.minPurchase.toLocaleString()}
                           </td>
                           <td className="px-6 py-4 text-center">
                              <p className="text-xs font-bold text-white">{v.usedCount} / {v.maxUsage}</p>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button onClick={() => { if(confirm('Nonaktifkan voucher ini secara permanen?')) alert('Voucher dinonaktifkan.'); }} className="p-2 text-slate-600 hover:text-rose-500 transition-colors">
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerMode === 'promo' ? 'Proposal Strategi Promo' : 'Generate Voucher Node'}>
         {drawerMode === 'promo' ? (
           <div className="space-y-8">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Judul Kampanye</label>
                    <input type="text" className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Misal: Aceh Gaming Weekend" value={newPromo.title || ''} onChange={e => setNewPromo({...newPromo, title: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipe Diskon</label>
                       <select className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none appearance-none" value={newPromo.type} onChange={e => setNewPromo({...newPromo, type: e.target.value as PromoType})}>
                          <option value={PromoType.PERCENTAGE}>Persentase (%)</option>
                          <option value={PromoType.NOMINAL}>Nominal (IDR)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nilai Potongan</label>
                       <input type="number" className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none" value={newPromo.value || ''} onChange={e => setNewPromo({...newPromo, value: parseInt(e.target.value)})} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Produk (SKU)</label>
                    <textarea rows={3} className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-xs" placeholder="Pisahkan dengan koma..."></textarea>
                 </div>
              </div>
              <div className="p-6 bg-amber-600/5 border border-amber-600/20 rounded-3xl">
                 <p className="text-[10px] text-amber-500 font-bold leading-relaxed italic">
                    "Semua proposal promo akan diverifikasi oleh Owner untuk memastikan kesesuaian margin laba toko sebelum diaktifkan secara publik."
                 </p>
              </div>
              <button onClick={handleCreatePromo} className="w-full py-5 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-3xl hover:bg-indigo-500 shadow-2xl transition-all">Kirim Proposal Ke Owner</button>
           </div>
         ) : (
           <div className="space-y-8">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kode Unik Voucher</label>
                    <input type="text" className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono text-lg tracking-widest" placeholder="SALE2024" onChange={e => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Diskon (%)</label>
                       <input type="number" className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none" value={newVoucher.discountValue || ''} onChange={e => setNewVoucher({...newVoucher, discountValue: parseInt(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kuota Pakai</label>
                       <input type="number" className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none" value={newVoucher.maxUsage || 100} onChange={e => setNewVoucher({...newVoucher, maxUsage: parseInt(e.target.value)})} />
                    </div>
                 </div>
              </div>
              <button onClick={handleCreateVoucher} className="w-full py-5 bg-emerald-600 text-white font-black uppercase text-xs tracking-widest rounded-3xl hover:bg-emerald-500 shadow-2xl transition-all">Generate & Aktifkan Voucher</button>
           </div>
         )}
      </RightDrawer>
    </div>
  );
};

export default MarketingCampaigns;
