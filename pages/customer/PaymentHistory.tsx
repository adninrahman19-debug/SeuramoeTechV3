import React, { useState, useEffect } from 'react';
import TransactionService from '../../services/TransactionService';
import AuthService from '../../auth/AuthService';
import { Transaction, PaymentStatus } from '../../types';
import { ICONS } from '../../constants';

const PaymentHistory: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      // Filter transaksi global untuk hanya milik user ini
      const all = TransactionService.getAll();
      setTransactions(all.filter(t => t.userId === user.id));
    }
  }, [user]);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex justify-between items-center px-2">
         <h3 className="text-xl font-black text-white uppercase tracking-tight">Financial Ledger</h3>
         <div className="px-4 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">Secure Ledger v1.0</div>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {transactions.length === 0 ? (
           <div className="py-20 text-center glass-panel rounded-[2rem] border-slate-800 text-slate-600 italic">Belum ada transaksi finansial yang tercatat.</div>
         ) : transactions.map(tx => (
           <div key={tx.id} className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center gap-6 group">
              <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center transition-colors ${
                tx.status === PaymentStatus.SUCCESS ? 'text-emerald-500' : 
                tx.status === PaymentStatus.REFUNDED ? 'text-rose-400' : 'text-amber-500'
              }`}>
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
              </div>
              
              <div className="flex-1 space-y-1">
                 <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-white uppercase font-mono tracking-tighter">{tx.id}</h4>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      tx.status === PaymentStatus.SUCCESS ? 'bg-emerald-500/10 text-emerald-400' :
                      tx.status === PaymentStatus.REFUNDED ? 'bg-rose-500/10 text-rose-400' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>{tx.status}</span>
                 </div>
                 <p className="text-xs text-slate-400 font-medium">{tx.description}</p>
                 <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-600">
                    <span>{new Date(tx.timestamp).toLocaleString('id-ID')}</span>
                    <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                    <span>{tx.paymentMethod}</span>
                 </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end gap-2 justify-between shrink-0">
                 <p className={`text-xl font-black tracking-tighter leading-none ${tx.netAmount < 0 ? 'text-rose-500' : 'text-emerald-400'}`}>
                    {tx.netAmount < 0 ? '-' : ''}Rp {Math.abs(tx.amount).toLocaleString()}
                 </p>
                 <button 
                  onClick={() => alert('Menyiapkan kuitansi digital...')}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-700"
                 >
                   Struk PDF
                 </button>
              </div>
           </div>
         ))}
      </div>

      <div className="p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem]">
         <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20 text-white">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
            </div>
            <div>
               <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-1">Keamanan Transaksi</h4>
               <p className="text-[10px] text-slate-500 leading-relaxed max-w-lg italic">
                  "Semua transaksi di SeuramoeTech dilindungi dengan enkripsi end-to-end melalui gateway Sumatra Regional Node. Hubungi Support jika Anda mendeteksi aktivitas mencurigakan pada mutasi saldo Anda."
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PaymentHistory;