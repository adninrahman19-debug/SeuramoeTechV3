
import React, { useState, useEffect } from 'react';
import CartService from '../../services/CartService';
import StoreService from '../../services/StoreService';
import AuthService from '../../auth/AuthService';
import Stepper from '../../components/Shared/Stepper';
import { ICONS } from '../../constants';

const Checkout: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('s1');
  const [paymentMethod, setPaymentMethod] = useState<string>('qris');

  useEffect(() => {
    setStores(StoreService.getAllStores());
  }, []);

  const steps = [
    { label: 'Identitas', description: 'Alamat Node' },
    { label: 'Opsi Node', description: 'Ambil/Kirim' },
    { label: 'Payment', description: 'Konfirmasi' },
  ];

  const handlePlaceOrder = () => {
    const store = stores.find(s => s.id === selectedStore);
    if (confirm(`KONFIRMASI PESANAN: \nNode Toko: ${store?.name} \nMetode: ${paymentMethod.toUpperCase()} \nTotal: Rp ${totals.subtotal.toLocaleString()} \n\nLanjutkan pemesanan?`)) {
      alert("Pesanan Berhasil! Menunggu verifikasi pembayaran oleh Node Sumatra-01. Cek WhatsApp Anda untuk detail struk digital.");
      CartService.clearCart();
      window.location.href = '#'; // In real app, route to order success
    }
  };

  const totals = CartService.getTotals();

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-24">
       <div className="glass-panel p-8 rounded-[3rem] border-slate-800 shadow-2xl">
          <Stepper steps={steps} currentStep={currentStep} />
       </div>

       {currentStep === 0 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
             <div className="glass-panel p-10 rounded-[3.5rem] border-slate-800 space-y-8 shadow-2xl">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Data Pengiriman Node</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
                      <input type="text" defaultValue={user?.fullName} className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">WhatsApp Aktif</label>
                      <input type="text" placeholder="0812XXXX" className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alamat Lengkap di Sumatra</label>
                   <textarea rows={4} placeholder="Jalan, No Rumah, Kelurahan, Kecamatan..." className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>
                <div className="pt-4">
                   <button onClick={() => setCurrentStep(1)} className="w-full py-5 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-3xl hover:bg-indigo-500 shadow-xl transition-all">Lanjut ke Opsi Node</button>
                </div>
             </div>
          </div>
       )}

       {currentStep === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
             <div className="glass-panel p-10 rounded-[3.5rem] border-slate-800 space-y-8 shadow-2xl">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight text-center md:text-left">Pilih Node Regional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {stores.map(s => (
                     <div 
                        key={s.id} 
                        onClick={() => setSelectedStore(s.id)}
                        className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col justify-between ${
                           selectedStore === s.id ? 'bg-indigo-600/10 border-indigo-600 ring-4 ring-indigo-600/5' : 'bg-slate-950 border border-slate-800 hover:border-slate-700'
                        }`}
                     >
                        <div className="flex justify-between items-start mb-6">
                           <div className="p-3 bg-slate-900 rounded-2xl text-indigo-400 shadow-lg"><ICONS.Store className="w-6 h-6" /></div>
                           {selectedStore === s.id && <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse"></div>}
                        </div>
                        <div>
                           <h4 className="text-lg font-bold text-white mb-1">{s.name}</h4>
                           <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{s.location}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="p-6 bg-indigo-600/5 border border-indigo-600/10 rounded-3xl flex items-center gap-4">
                   <svg className="w-6 h-6 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
                   <p className="text-[10px] text-slate-400 italic">"Memilih node terdekat membantu pengiriman lebih cepat dan memudahkan klaim garansi fisik jika diperlukan."</p>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setCurrentStep(0)} className="flex-1 py-5 bg-slate-950 border border-slate-800 text-slate-500 font-black uppercase text-xs rounded-3xl">Kembali</button>
                   <button onClick={() => setCurrentStep(2)} className="flex-[2] py-5 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-3xl shadow-xl shadow-indigo-600/20 transition-all">Metode Pembayaran</button>
                </div>
             </div>
          </div>
       )}

       {currentStep === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
             <div className="glass-panel p-10 rounded-[3.5rem] border-slate-800 space-y-10 shadow-2xl">
                <div className="flex justify-between items-start">
                   <h3 className="text-2xl font-black text-white uppercase tracking-tight">Secure Payment</h3>
                   <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Tagihan</p>
                      <p className="text-3xl font-black text-emerald-400">Rp {totals.subtotal.toLocaleString()}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {[
                      { id: 'qris', name: 'QRIS SeuramoePay', icon: '📱', desc: 'Scan instan via e-wallet mana pun.' },
                      { id: 'bank', name: 'Bank Aceh Syariah', icon: '🏦', desc: 'Transfer antar bank wilayah Sumatra.' },
                      { id: 'cod', name: 'COD (In-Node Pick)', icon: '📦', desc: 'Bayar saat ambil di node terpilih.' },
                   ].map(pm => (
                     <label key={pm.id} className={`p-6 rounded-3xl border-2 flex items-center gap-6 cursor-pointer transition-all ${
                        paymentMethod === pm.id ? 'bg-emerald-500/5 border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                     }`}>
                        <input type="radio" name="payment" className="hidden" checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} />
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-inner">{pm.icon}</div>
                        <div className="flex-1">
                           <h5 className="text-sm font-black text-white uppercase tracking-widest">{pm.name}</h5>
                           <p className="text-[10px] text-slate-500 mt-1">{pm.desc}</p>
                        </div>
                        {paymentMethod === pm.id && <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg></div>}
                     </label>
                   ))}
                </div>

                <div className="pt-4 flex gap-4">
                   <button onClick={() => setCurrentStep(1)} className="flex-1 py-5 bg-slate-950 border border-slate-800 text-slate-500 font-black uppercase text-xs rounded-3xl">Kembali</button>
                   <button onClick={handlePlaceOrder} className="flex-[2] py-5 bg-emerald-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-3xl shadow-xl shadow-emerald-600/30 transition-all">Konfirmasi & Bayar</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default Checkout;
