
import React, { useState, useEffect } from 'react';
import PromoService from '../../services/PromoService';
import { Promo, PromoType, PromoStatus, Coupon } from '../../types';
import { ICONS } from '../../constants';
import RightDrawer from '../../components/Shared/RightDrawer';

const PromoManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discounts' | 'vouchers'>('discounts');
  const [promos, setPromos] = useState<Promo[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<Promo>>({
    title: '',
    type: PromoType.PERCENTAGE,
    value: 0,
    status: PromoStatus.ACTIVE,
    currentUsage: 0,
    storeId: 's1'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPromos(PromoService.getPromos('s1'));
    setCoupons(PromoService.getCoupons('s1'));
  };

  const handleCreatePromo = () => {
    if (newPromo.title && newPromo.value) {
      if (confirm(`Aktifkan kampanye "${newPromo.title}" secara publik di marketplace?`)) {
        PromoService.addPromo(newPromo as Promo);
        alert("Kampanye promosi diluncurkan!");
        setIsDrawerOpen(false);
        loadData();
      }
    } else {
      alert("Harap lengkapi Judul dan Nilai Promo.");
    }
  };

  const handleTerminate = (name: string) => {
    if (confirm(`Hentikan paksa kampanye "${name}"? Pelanggan tidak akan bisa lagi menggunakan potongan harga ini secara instan.`)) {
      alert(`Kampanye "${name}" telah dinonaktifkan.`);
      loadData();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Buat Strategi Kampanye">
        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Judul Strategi</label>
              <input type="text" placeholder="Misal: Flash Sale Aceh" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={newPromo.title || ''} onChange={e => setNewPromo({...newPromo, title: e.target.value})} />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipe Diskon</label>
                 <select className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white appearance-none" value={newPromo.type} onChange={e => setNewPromo({...newPromo, type: e.target.value as PromoType})}>
                    <option value={PromoType.PERCENTAGE}>Persentase (%)</option>
                    <option value={PromoType.NOMINAL}>Nominal (Rp)</option>
                    <option value={PromoType.FLASH_SALE}>Flash Sale</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nilai</label>
                 <input type="number" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={newPromo.value || ''} onChange={e => setNewPromo({...newPromo, value: parseInt(e.target.value)})} />
              </div>
           </div>
           <button onClick={handleCreatePromo} className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-indigo-500 shadow-xl">Luncurkan Kampanye</button>
        </div>
      </RightDrawer>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
           {(['discounts', 'vouchers'] as const).map(t => (
             <button key={t} onClick={() => setActiveTab(t)} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{t === 'discounts' ? 'Diskon & Promo' : 'Voucher Belanja'}</button>
           ))}
        </div>
        <button onClick={() => setIsDrawerOpen(true)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl flex items-center gap-2">
           <ICONS.Plus className="w-4 h-4" /> Kampanye Baru
        </button>
      </div>

      {activeTab === 'discounts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {promos.map(promo => (
             <div key={promo.id} className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-6">
                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${promo.status === PromoStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400'}`}>{promo.status}</span>
                   <div className="p-2 bg-slate-900 rounded-xl text-indigo-400"><ICONS.Ticket className="w-5 h-5" /></div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{promo.title}</h3>
                <p className="text-sm font-black text-indigo-400">
                   {promo.type === PromoType.PERCENTAGE ? `${promo.value}% OFF` : `Potongan Rp ${promo.value.toLocaleString()}`}
                </p>
                <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[9px] font-black text-slate-600 uppercase">Usage: {promo.currentUsage} / {promo.usageLimit}</span>
                   <button onClick={() => handleTerminate(promo.title)} className="text-[9px] font-black text-rose-500 uppercase hover:text-white transition-colors">Hentikan Paksa</button>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                    <th className="px-6 py-5">Kode Voucher</th>
                    <th className="px-6 py-5">Konfigurasi</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Aksi</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                 {coupons.map(coupon => (
                    <tr key={coupon.id} className="hover:bg-slate-800/20 group transition-all font-mono">
                       <td className="px-6 py-4"><span className="bg-indigo-600/10 border border-indigo-500/20 px-3 py-1 rounded text-indigo-400 font-black">{coupon.code}</span></td>
                       <td className="px-6 py-4 text-xs text-white">Disc: {coupon.discountValue}{coupon.discountType === 'PERCENT' ? '%' : ' IDR'}</td>
                       <td className="px-6 py-4"><span className="text-[9px] text-emerald-400 font-black uppercase">Aktif</span></td>
                       <td className="px-6 py-4 text-right">
                          <button onClick={() => handleTerminate(coupon.code)} className="p-2 text-slate-600 hover:text-rose-500 transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default PromoManager;
