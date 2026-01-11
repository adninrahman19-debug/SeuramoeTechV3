import React, { useState, useEffect } from 'react';
import PromoService from '../../services/PromoService';
import LoyaltyService, { PointHistory, LoyaltyReward } from '../../services/LoyaltyService';
import { Promo, Coupon, PromoType } from '../../types';
import { ICONS } from '../../constants';

const PromoLoyaltyHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'promos' | 'loyalty'>('promos');
  const [vouchers, setVouchers] = useState<Coupon[]>([]);
  const [flashSales, setFlashSales] = useState<Promo[]>([]);
  const [points, setPoints] = useState(0);
  const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);

  useEffect(() => {
    loadData();
    window.addEventListener('points-updated', loadData);
    return () => window.removeEventListener('points-updated', loadData);
  }, []);

  const loadData = () => {
    setVouchers(PromoService.getCoupons('s1'));
    setFlashSales(PromoService.getPromos('s1').filter(p => p.type === PromoType.FLASH_SALE));
    setPoints(LoyaltyService.getUserPoints());
    setPointHistory(LoyaltyService.getPointsHistory());
    setRewards(LoyaltyService.getAvailableRewards());
  };

  const handleRedeem = (reward: LoyaltyReward) => {
    if (points < reward.pointsRequired) {
      alert("Poin Anda tidak mencukupi untuk menukar reward ini.");
      return;
    }
    if (confirm(`Tukar ${reward.pointsRequired} poin untuk ${reward.title}?`)) {
      LoyaltyService.spendPoints(reward.pointsRequired, `Redeem: ${reward.title}`);
      alert(`Berhasil menukar reward! Kode voucher ${reward.category} telah dikirim ke WhatsApp Anda.`);
    }
  };

  const handleClaimVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Kode voucher ${code} berhasil disalin! Gunakan saat checkout.`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-24">
      {/* Top Header & Tab Switch */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-xl">
           <button onClick={() => setActiveTab('promos')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'promos' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Promo & Voucher</button>
           <button onClick={() => setActiveTab('loyalty')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'loyalty' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Loyalty Reward</button>
        </div>
        <div className="px-6 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Saldo Poin Saya</p>
              <p className="text-xl font-black text-white leading-none">{points.toLocaleString()} <span className="text-[10px] text-indigo-400">PTS</span></p>
           </div>
        </div>
      </div>

      {activeTab === 'promos' ? (
        <div className="space-y-12">
           {/* Flash Sale Section */}
           {flashSales.length > 0 && (
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-8 bg-rose-600 rounded-full"></div>
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Flash Sale Regional</h3>
                   <div className="ml-auto px-4 py-1 bg-rose-600/10 border border-rose-500/20 rounded-full text-[9px] font-black text-rose-500 uppercase animate-pulse">Berakhir dalam 04:22:15</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {flashSales.map(p => (
                      <div key={p.id} className="glass-panel p-8 rounded-[2.5rem] border-slate-800 bg-rose-600/5 hover:border-rose-500/30 transition-all flex justify-between items-center overflow-hidden relative group">
                         <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:rotate-0 transition-transform"><ICONS.Ticket className="w-32 h-32" /></div>
                         <div className="relative z-10 space-y-4">
                            <h4 className="text-xl font-black text-white uppercase">{p.title}</h4>
                            <p className="text-3xl font-black text-rose-500 tracking-tighter">Potongan Rp {p.value.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Berlaku untuk: {p.applicableProducts.length} Kategori Produk</p>
                            <button className="px-8 py-3 bg-rose-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-rose-600/20">Belanja Sekarang</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           {/* Vouchers Section */}
           <div className="space-y-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                 <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                 Voucher Tersedia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {vouchers.map(v => (
                   <div key={v.id} className="glass-panel p-6 rounded-3xl border-slate-800 border-l-4 border-l-indigo-600 flex flex-col justify-between group hover:border-indigo-500/30 transition-all shadow-xl">
                      <div>
                         <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-indigo-400"><ICONS.Ticket className="w-6 h-6" /></div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">S/D {v.expiryDate}</span>
                         </div>
                         <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2 leading-none">{v.discountValue}{v.discountType === 'PERCENT' ? '%' : ' IDR'} OFF</h4>
                         <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic mb-8">"Minimal belanja Rp {v.minPurchase.toLocaleString()} untuk aktivasi voucher node Sumatra."</p>
                      </div>
                      <div className="pt-6 border-t border-slate-800 flex justify-between items-center gap-4">
                         <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm font-black text-indigo-400 tracking-widest">{v.code}</div>
                         <button onClick={() => handleClaimVoucher(v.code)} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all shadow-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Rewards Catalog */}
           <div className="lg:col-span-2 space-y-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                 <div className="w-2 h-8 bg-emerald-600 rounded-full"></div>
                 Point Exchange Marketplace
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {rewards.map(reward => (
                   <div key={reward.id} className="glass-panel rounded-[2.5rem] border-slate-800 overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col shadow-2xl">
                      <div className="aspect-video relative overflow-hidden bg-slate-950">
                         <img src={reward.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt="" />
                         <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-xl">{reward.pointsRequired} PTS</div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3">{reward.category}</span>
                         <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{reward.title}</h4>
                         <p className="text-xs text-slate-500 leading-relaxed mb-8 italic">"{reward.description}"</p>
                         <button 
                           onClick={() => handleRedeem(reward)}
                           disabled={points < reward.pointsRequired}
                           className={`mt-auto w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                             points >= reward.pointsRequired ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                           }`}
                         >
                            {points >= reward.pointsRequired ? 'Tukar Poin Sekarang' : 'Poin Tidak Cukup'}
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Points History Sidebar */}
           <div className="space-y-6">
              <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 shadow-2xl">
                 <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-800 pb-4">Aktivitas Poin Terakhir</h4>
                 <div className="space-y-4">
                    {pointHistory.length === 0 ? (
                      <p className="text-xs text-slate-600 italic text-center py-10">Belum ada riwayat poin.</p>
                    ) : pointHistory.map(log => (
                      <div key={log.id} className="flex justify-between items-center group">
                         <div className="flex items-center gap-4">
                            <div className={`w-1.5 h-1.5 rounded-full ${log.type === 'CREDIT' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                            <div>
                               <p className="text-[11px] font-bold text-white group-hover:text-indigo-400 transition-colors">{log.description}</p>
                               <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">{log.date}</p>
                            </div>
                         </div>
                         <span className={`text-xs font-black font-mono ${log.type === 'CREDIT' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {log.type === 'CREDIT' ? '+' : '-'}{log.amount}
                         </span>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-3 bg-slate-900 border border-slate-800 text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest rounded-xl transition-all">Lihat Seluruh Ledger</button>
              </div>

              <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg></div>
                 <h4 className="text-lg font-black uppercase mb-4 tracking-tighter leading-none">Kejar Level Gold!</h4>
                 <p className="text-xs opacity-80 leading-relaxed mb-10">Dapatkan 760 poin lagi untuk membuka status <strong>Gold Node</strong> dan nikmati gratis ongkir se-Sumatra!</p>
                 <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-8">
                    <div className="bg-white h-full shadow-[0_0_10px_white]" style={{ width: '62%' }}></div>
                 </div>
                 <button className="w-full py-4 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl">Upgrade Sekarang</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PromoLoyaltyHub;