
import React, { useState, useEffect } from 'react';
import CartService, { CartItem } from '../../services/CartService';
import PromoService from '../../services/PromoService';
import { Coupon } from '../../types';
import { ICONS } from '../../constants';

interface CartProps {
  onProceedToCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ onProceedToCheckout }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Coupon | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCart();
    const handleUpdate = () => loadCart();
    window.addEventListener('cart-updated', handleUpdate);
    return () => window.removeEventListener('cart-updated', handleUpdate);
  }, []);

  const loadCart = () => {
    setItems(CartService.getCart());
  };

  const handleApplyVoucher = () => {
    setError('');
    const coupons = PromoService.getCoupons('s1');
    const found = coupons.find(c => c.code === voucherCode.toUpperCase());
    
    if (found) {
      const { subtotal } = CartService.getTotals();
      if (subtotal >= found.minPurchase) {
        setAppliedVoucher(found);
        alert("Voucher berhasil diterapkan!");
      } else {
        setError(`Min. belanja Rp ${found.minPurchase.toLocaleString()} untuk voucher ini.`);
      }
    } else {
      setError("Kode voucher tidak valid.");
    }
  };

  const handleRemove = (id: string, name: string) => {
    if (confirm(`Hapus "${name}" dari keranjang?`)) {
      CartService.removeFromCart(id);
    }
  };

  const totals = CartService.getTotals();
  const discountAmount = appliedVoucher 
    ? (appliedVoucher.discountType === 'PERCENT' ? (totals.subtotal * appliedVoucher.discountValue / 100) : appliedVoucher.discountValue)
    : 0;
  const finalTotal = totals.subtotal - discountAmount;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
         <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-8 text-slate-700 border border-slate-800">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth={1.5}/></svg>
         </div>
         <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Keranjang Kosong</h3>
         <p className="text-slate-500 text-sm max-w-xs text-center mb-10">Mulai petualangan belanja teknologi Anda sekarang di Sumatra Marketplace.</p>
         <button className="px-10 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 shadow-xl transition-all">Jelajahi Mall</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-4 duration-500 pb-24">
       {/* Left: Item List */}
       <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
             Keranjang Belanja
             <span className="text-[10px] font-bold text-slate-600 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{items.length} ITEM</span>
          </h3>
          
          <div className="space-y-4">
             {items.map(item => (
                <div key={item.id} className="glass-panel p-6 rounded-[2rem] border-slate-800 flex items-center gap-6 group hover:border-indigo-500/30 transition-all shadow-xl">
                   <div className="w-20 h-20 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                      <img src={item.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate mb-1 group-hover:text-indigo-400 transition-colors">{item.name}</h4>
                      <p className="text-xs font-black text-emerald-400">Rp {(item.promoPrice || item.price).toLocaleString()}</p>
                   </div>
                   <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
                      <button onClick={() => CartService.updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-all font-bold">-</button>
                      <span className="text-sm font-black text-white w-6 text-center">{item.quantity}</span>
                      <button onClick={() => CartService.updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-all font-bold">+</button>
                   </div>
                   <button onClick={() => handleRemove(item.id, item.name)} className="p-2 text-slate-600 hover:text-rose-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
                   </button>
                </div>
             ))}
          </div>
       </div>

       {/* Right: Summary & Vouchers */}
       <div className="space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 shadow-2xl">
             <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Punya Kode Promo?</h4>
             <div className="space-y-4">
                <div className="relative">
                   <input 
                     type="text" 
                     placeholder="Masukkan voucher..." 
                     className="w-full pl-4 pr-12 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white font-mono uppercase tracking-[0.2em] outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-[10px] placeholder:font-sans"
                     value={voucherCode}
                     onChange={e => setVoucherCode(e.target.value)}
                   />
                   <button onClick={handleApplyVoucher} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
                   </button>
                </div>
                {error && <p className="text-[10px] text-rose-500 font-bold ml-2">{error}</p>}
                {appliedVoucher && (
                   <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Voucher Aktif</p>
                         <p className="text-xs font-bold text-white mt-1">{appliedVoucher.code}</p>
                      </div>
                      <button onClick={() => setAppliedVoucher(null)} className="text-rose-500 hover:text-rose-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3}/></svg></button>
                   </div>
                )}
             </div>

             <div className="mt-12 space-y-4 pt-8 border-t border-slate-800">
                <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-slate-500 uppercase tracking-widest">Subtotal</span>
                   <span className="text-white">Rp {totals.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-slate-500 uppercase tracking-widest">Diskon</span>
                   <span className="text-rose-500">-Rp {discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-6 text-xl font-black">
                   <span className="text-white uppercase tracking-tighter">Total</span>
                   <span className="text-emerald-400">Rp {finalTotal.toLocaleString()}</span>
                </div>
             </div>

             <button 
               onClick={onProceedToCheckout}
               className="w-full mt-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3"
             >
                Proses Checkout
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={2}/></svg>
             </button>
          </div>
          
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] text-center">
             <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">"Dapatkan proteksi tambahan SeuramoeTech dengan memilih Node Toko di tahap berikutnya."</p>
          </div>
       </div>
    </div>
  );
};

export default Cart;
