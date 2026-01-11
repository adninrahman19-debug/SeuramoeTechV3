import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants.tsx';
import { Transaction, PaymentStatus } from '../../types.ts';
import TransactionService from '../../services/TransactionService.ts';
import OrderService from '../../services/OrderService.ts';
import StatCard from '../../components/Shared/StatCard.tsx';
import AuthService from '../../auth/AuthService.ts';

interface CashEntry {
  id: string;
  type: 'IN' | 'OUT';
  amount: number;
  description: string;
  time: string;
}

const StaffPayments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification' | 'history' | 'methods' | 'cash_report'>('verification');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  
  const [cashEntries, setCashEntries] = useState<CashEntry[]>([
    { id: '1', type: 'IN', amount: 450000, description: 'Servis Laptop Lenovo (Tunai)', time: '08:45' },
    { id: '2', type: 'OUT', amount: 50000, description: 'Bensin Kurir Antar-Jemput', time: '09:12' },
    { id: '3', type: 'IN', amount: 1200000, description: 'Charger Mac M1 (Tunai)', time: '11:20' },
    { id: '4', type: 'OUT', amount: 120000, description: 'Beli Lakban & Bubble Wrap', time: '10:45' },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allTx = TransactionService.getAll().filter(t => t.storeId === 's1');
    setTransactions(allTx);
    
    setPendingVerifications([
      { id: 'V-8821', orderId: 'ORD-99211', customer: 'Ali Akbar', amount: 1450000, bank: 'Bank Aceh', proof: 'https://images.unsplash.com/photo-1627634777217-c864268db30c?q=80&w=200', date: '10m ago' },
      { id: 'V-8822', orderId: 'ORD-99212', customer: 'CV Berkah', amount: 28500000, bank: 'Mandiri', proof: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=200', date: '1h ago' },
    ]);
  };

  const handleVerify = (id: string, success: boolean) => {
    if (confirm(success ? "Konfirmasi pembayaran ini sah?" : "Tolak pembayaran ini?")) {
      alert(success ? "Pembayaran diverifikasi. Status order diupdate ke PROCESSING." : "Pembayaran ditolak. Pelanggan akan menerima notifikasi.");
      setPendingVerifications(prev => prev.filter(v => v.id !== id));
    }
  };

  const calculateCash = () => {
    const income = cashEntries.filter(e => e.type === 'IN').reduce((acc, e) => acc + e.amount, 0);
    const expense = cashEntries.filter(e => e.type === 'OUT').reduce((acc, e) => acc + e.amount, 0);
    return { income, expense, net: income - expense };
  };

  const cashStats = calculateCash();

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit overflow-x-auto max-w-full shadow-2xl">
           <button onClick={() => setActiveTab('verification')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'verification' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Verifikasi Manual</button>
           <button onClick={() => setActiveTab('history')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Riwayat Transaksi</button>
           <button onClick={() => setActiveTab('methods')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'methods' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Metode Aktif</button>
           <button onClick={() => setActiveTab('cash_report')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'cash_report' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Laporan Kas</button>
        </div>
        
        {activeTab === 'cash_report' && (
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shift: Pagi (08:00 - 16:00)</span>
              <button className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-lg shadow-emerald-600/20">Close Register</button>
           </div>
        )}
      </div>

      {activeTab === 'verification' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {pendingVerifications.length === 0 ? (
             <div className="col-span-full p-20 text-center glass-panel rounded-3xl border-slate-800 text-slate-500 italic">Antrean verifikasi kosong. Semua transfer telah diproses.</div>
           ) : pendingVerifications.map(v => (
             <div key={v.id} className="glass-panel p-8 rounded-[2rem] border-slate-800 flex flex-col group hover:border-indigo-500/30 transition-all shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                   <ICONS.Ticket className="w-24 h-24" />
                </div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">{v.bank} Transfer</p>
                      <h4 className="text-3xl font-black text-white tracking-tighter">Rp {v.amount.toLocaleString()}</h4>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Diterima</p>
                      <span className="text-xs font-bold text-white bg-slate-800 px-3 py-1 rounded-full">{v.date}</span>
                   </div>
                </div>

                <div className="flex gap-4 mb-10 relative z-10">
                   <div className="w-20 h-24 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden cursor-zoom-in group/img relative">
                      <img src={v.proof} className="w-full h-full object-cover opacity-50 group-hover/img:opacity-100 transition-opacity" alt="proof" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-slate-950/40">
                         <span className="text-[8px] font-black text-white uppercase">Zoom</span>
                      </div>
                   </div>
                   <div className="flex-1 space-y-3">
                      <div className="flex justify-between text-xs p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                         <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px]">Pelanggan</span>
                         <span className="text-white font-black">{v.customer}</span>
                      </div>
                      <div className="flex justify-between text-xs p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                         <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px]">ID Order</span>
                         <span className="text-indigo-400 font-mono font-bold">{v.orderId}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 relative z-10">
                   <button onClick={() => handleVerify(v.id, false)} className="py-4 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-xl shadow-rose-600/5">Tolak / Palsu</button>
                   <button onClick={() => handleVerify(v.id, true)} className="py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3}/></svg>
                      Konfirmasi Sah
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Total Volume (Shift)" value={`Rp ${transactions.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}`} icon={<ICONS.Dashboard />} colorClass="indigo" />
              <StatCard label="Manual Transfers" value={transactions.filter(t => t.paymentMethod.includes('Bank')).length} icon={<ICONS.Ticket />} colorClass="emerald" />
              <StatCard label="Refunds Processed" value={transactions.filter(t => t.status === PaymentStatus.REFUNDED).length} icon={<ICONS.Settings />} colorClass="rose" />
           </div>

           <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                          <th className="px-6 py-5">Ref ID & Time</th>
                          <th className="px-6 py-5">Context</th>
                          <th className="px-6 py-5">Metode</th>
                          <th className="px-6 py-5">Nominal</th>
                          <th className="px-6 py-5 text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                       {transactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-slate-800/20 transition-all group cursor-default">
                             <td className="px-6 py-4">
                                <p className="text-xs font-mono font-bold text-white group-hover:text-indigo-400 transition-colors">{tx.id}</p>
                                <p className="text-[9px] text-slate-600 uppercase font-black mt-1">{new Date(tx.timestamp).toLocaleString()}</p>
                             </td>
                             <td className="px-6 py-4">
                                <p className="text-sm font-bold text-white">{tx.userName}</p>
                                <p className="text-[10px] text-slate-500 italic truncate max-w-[150px]">{tx.description}</p>
                             </td>
                             <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-400 text-[9px] font-black rounded uppercase tracking-widest">{tx.paymentMethod}</span>
                             </td>
                             <td className="px-6 py-4">
                                <p className="text-sm font-black text-white">Rp {tx.amount.toLocaleString()}</p>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                   tx.status === PaymentStatus.SUCCESS ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                   tx.status === PaymentStatus.REFUNDED ? 'bg-slate-800 text-slate-500 border border-slate-700' :
                                   'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                }`}>{tx.status}</span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'methods' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { name: 'Bank Aceh Syariah', id: '110-00-12345', status: 'ACTIVE', icon: '🏦', type: 'MANUAL', desc: 'Transfer antar bank wilayah Aceh.' },
             { name: 'Mandiri Transfer', id: '8821-00-9921', status: 'ACTIVE', icon: '💳', type: 'MANUAL', desc: 'Rekening pusat operasional toko.' },
             { name: 'QRIS SeuramoePay', id: 'TERM-001', status: 'ACTIVE', icon: '📱', type: 'GATEWAY', desc: 'Scan barcode via Midtrans integration.' },
             { name: 'Cash on Delivery', id: 'OFFLINE', status: 'ACTIVE', icon: '📦', type: 'OFFLINE', desc: 'Bayar di tempat saat pickup/delivery.' },
             { name: 'BSI Regional', id: '4455-00-1122', status: 'INACTIVE', icon: '🕌', type: 'MANUAL', desc: 'Belum diaktifkan untuk shift ini.' },
           ].map(method => (
             <div key={method.name} className={`glass-panel p-8 rounded-[2rem] border-slate-800 flex flex-col group transition-all ${method.status === 'ACTIVE' ? 'hover:border-indigo-500/30' : 'opacity-40 grayscale'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="text-4xl">{method.icon}</div>
                   <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-widest ${method.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>{method.status}</span>
                </div>
                <div className="flex-1">
                   <h4 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{method.name}</h4>
                   <p className="text-[10px] font-mono text-slate-500 mb-4">{method.id}</p>
                   <p className="text-xs text-slate-400 leading-relaxed italic mb-8">"{method.desc}"</p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{method.type}</span>
                   <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Edit Node</button>
                </div>
             </div>
           ))}
           <button className="h-full min-h-[300px] border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-slate-600 hover:border-indigo-500/50 hover:text-indigo-400 transition-all group">
              <div className="p-4 bg-slate-900 rounded-2xl group-hover:scale-110 transition-transform"><ICONS.Plus className="w-8 h-8" /></div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Tambah Channel Baru</span>
           </button>
        </div>
      )}

      {activeTab === 'cash_report' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="glass-panel p-10 rounded-[3rem] border-slate-800 space-y-10 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                 
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-10 border-b border-slate-800/50 relative z-10">
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Petty Cash Daily Log</h3>
                       <p className="text-[11px] text-slate-500 mt-3 font-bold uppercase tracking-[0.2em]">Node: SUM-N-01 • Operator: {AuthService.getCurrentUser()?.fullName}</p>
                    </div>
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] text-right shadow-inner">
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Register Balance</p>
                       <p className="text-4xl font-black text-emerald-400">Rp {cashStats.net.toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-6">
                       <div className="flex justify-between items-center border-b border-emerald-500/20 pb-4">
                          <h4 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">Penerimaan Tunai</h4>
                          <span className="text-xs font-black text-emerald-400">Rp {cashStats.income.toLocaleString()}</span>
                       </div>
                       <div className="space-y-3">
                          {cashEntries.filter(e => e.type === 'IN').map(inc => (
                            <div key={inc.id} className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800 group hover:border-emerald-500/20 transition-all">
                               <div>
                                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{inc.description}</span>
                                  <p className="text-[9px] text-slate-600 font-bold uppercase mt-0.5">{inc.time}</p>
                               </div>
                               <span className="text-emerald-400 font-black text-sm">+Rp {inc.amount.toLocaleString()}</span>
                            </div>
                          ))}
                          <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-400 transition-all">+ Catat Penjualan Tunai</button>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="flex justify-between items-center border-b border-rose-500/20 pb-4">
                          <h4 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em]">Pengeluaran Operasional</h4>
                          <span className="text-xs font-black text-rose-400">Rp {cashStats.expense.toLocaleString()}</span>
                       </div>
                       <div className="space-y-3">
                          {cashEntries.filter(e => e.type === 'OUT').map(exp => (
                            <div key={exp.id} className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800 group hover:border-rose-500/20 transition-all">
                               <div>
                                  <span className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">{exp.description}</span>
                                  <p className="text-[9px] text-slate-600 font-bold uppercase mt-0.5">{exp.time}</p>
                               </div>
                               <span className="text-rose-400 font-black text-sm">-Rp {exp.amount.toLocaleString()}</span>
                            </div>
                          ))}
                          <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-400 transition-all">+ Catat Pengeluaran Baru</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="glass-panel p-8 rounded-3xl border-slate-800 bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30">
                 <h4 className="text-xl font-black mb-4 tracking-tighter leading-tight">Settlement Protocol</h4>
                 <p className="text-xs opacity-80 leading-relaxed mb-10">Tutup register kas Anda setiap akhir shift. Sistem akan mengirimkan rekapitulasi otomatis ke Owner dan melakukan sinkronisasi dengan buku besar pusat.</p>
                 <button className="w-full py-5 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all shadow-xl">Close & Sync Shift</button>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-slate-800">
                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">Shift Analytics</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-500 uppercase">Cash Flow Health</span>
                       <span className="text-emerald-400 font-black">BALANCED</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-500 uppercase">Avg Sale Value</span>
                       <span className="text-white font-black">Rp 825k</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-500 uppercase">Operational Burn</span>
                       <span className="text-rose-400 font-black">9.2%</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StaffPayments;