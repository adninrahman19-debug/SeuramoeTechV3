import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants.tsx';
import { Transaction, PaymentStatus, Order, OrderStatus } from '../../types.ts';
import TransactionService from '../../services/TransactionService.ts';
import OrderService from '../../services/OrderService.ts';
import AuthService from '../../auth/AuthService.ts';
import StatCard from '../../components/Shared/StatCard.tsx';

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
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  
  // Cash Report States
  const [cashEntries, setCashEntries] = useState<CashEntry[]>(() => {
    const saved = localStorage.getItem('st_daily_cash_log');
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'IN', amount: 450000, description: 'Servis Laptop Lenovo (Tunai)', time: '08:45' },
      { id: '2', type: 'OUT', amount: 50000, description: 'Bensin Kurir Antar-Jemput', time: '09:12' },
    ];
  });

  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<CashEntry>>({ type: 'IN' });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('st_daily_cash_log', JSON.stringify(cashEntries));
  }, [cashEntries]);

  const loadData = () => {
    const user = AuthService.getCurrentUser();
    const storeId = user?.storeId || 's1';
    
    setTransactions(TransactionService.getAll().filter(t => t.storeId === storeId));
    setPendingOrders(OrderService.getPendingManualPayments(storeId));
  };

  const handleVerify = (orderId: string, success: boolean) => {
    if (confirm(success ? "Konfirmasi bahwa dana telah masuk ke rekening Toko?" : "Tolak pembayaran ini? Pelanggan akan diminta upload ulang.")) {
      OrderService.updatePaymentStatus(orderId, success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
      alert(success ? "Pembayaran diverifikasi! Pesanan otomatis beralih ke tahap PROSES." : "Pembayaran ditolak.");
      loadData();
    }
  };

  const addCashEntry = () => {
    if (newEntry.amount && newEntry.description) {
      const entry: CashEntry = {
        id: Date.now().toString(),
        type: newEntry.type as 'IN' | 'OUT',
        amount: Number(newEntry.amount),
        description: newEntry.description,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCashEntries([entry, ...cashEntries]);
      setIsAddingEntry(false);
      setNewEntry({ type: 'IN' });
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
      {/* Navigation & Stats Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit overflow-x-auto max-w-full shadow-2xl">
           <button onClick={() => setActiveTab('verification')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'verification' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Verifikasi Manual</button>
           <button onClick={() => setActiveTab('history')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Riwayat Transaksi</button>
           <button onClick={() => setActiveTab('methods')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'methods' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Metode Pembayaran</button>
           <button onClick={() => setActiveTab('cash_report')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'cash_report' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Laporan Kas</button>
        </div>
        
        <div className="flex items-center gap-4 px-6 py-2.5 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Payment Node Sumatra-North: Operational</span>
        </div>
      </div>

      {/* Verifikasi Pembayaran Manual */}
      {activeTab === 'verification' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {pendingOrders.length === 0 ? (
             <div className="col-span-full p-20 text-center glass-panel rounded-3xl border-slate-800 text-slate-500 italic">Antrean verifikasi kosong. Semua transfer telah diproses.</div>
           ) : pendingOrders.map(order => (
             <div key={order.id} className="glass-panel p-8 rounded-[2rem] border-slate-800 flex flex-col group hover:border-indigo-500/30 transition-all shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12">
                   <ICONS.Ticket className="w-24 h-24" />
                </div>
                
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">{order.paymentMethod}</p>
                      <h4 className="text-3xl font-black text-white tracking-tighter">Rp {order.totalAmount.toLocaleString()}</h4>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">ID Order</p>
                      <span className="text-xs font-mono font-bold text-white bg-slate-800 px-3 py-1 rounded-full">{order.id}</span>
                   </div>
                </div>

                <div className="flex gap-4 mb-10 relative z-10">
                   <div className="w-24 h-28 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden cursor-zoom-in relative group/img">
                      <img src="https://images.unsplash.com/photo-1627634777217-c864268db30c?q=80&w=200" className="w-full h-full object-cover opacity-50 group-hover/img:opacity-100 transition-opacity" alt="proof" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 bg-slate-950/40 transition-all">
                         <span className="text-[8px] font-black text-white uppercase">Lihat Bukti</span>
                      </div>
                   </div>
                   <div className="flex-1 space-y-3">
                      <div className="flex justify-between text-xs p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                         <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px]">Pelanggan</span>
                         <span className="text-white font-black truncate max-w-[100px]">{order.customerName}</span>
                      </div>
                      <div className="flex justify-between text-xs p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                         <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px]">Waktu</span>
                         <span className="text-white font-bold">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 relative z-10">
                   <button onClick={() => handleVerify(order.id, false)} className="py-4 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-600 hover:text-white transition-all">Tolak / Palsu</button>
                   <button onClick={() => handleVerify(order.id, true)} className="py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3}/></svg>
                      Verifikasi Sah
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Riwayat Transaksi */}
      {activeTab === 'history' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Total Omzet (Shift Ini)" value={`Rp ${transactions.filter(t => t.status === PaymentStatus.SUCCESS).reduce((acc, t) => acc + t.amount, 0).toLocaleString()}`} icon={<ICONS.Dashboard />} colorClass="indigo" />
              <StatCard label="Refund Diproses" value={transactions.filter(t => t.status === PaymentStatus.REFUNDED).length} icon={<ICONS.Settings />} colorClass="rose" />
              <StatCard label="Pending Clearing" value={transactions.filter(t => t.status === PaymentStatus.PENDING).length} icon={<ICONS.Ticket />} colorClass="amber" />
           </div>

           <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                          <th className="px-6 py-5">Ref ID / Waktu</th>
                          <th className="px-6 py-5">Pelanggan</th>
                          <th className="px-6 py-5">Metode</th>
                          <th className="px-6 py-5">Nominal</th>
                          <th className="px-6 py-5 text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                       {transactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-slate-800/20 transition-all group">
                             <td className="px-6 py-4">
                                <p className="text-xs font-mono font-bold text-white group-hover:text-indigo-400 transition-colors">{tx.id}</p>
                                <p className="text-[9px] text-slate-600 uppercase font-black mt-1">{new Date(tx.timestamp).toLocaleString()}</p>
                             </td>
                             <td className="px-6 py-4 text-sm font-bold text-white">{tx.userName}</td>
                             <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-400 text-[9px] font-black rounded uppercase">{tx.paymentMethod}</span>
                             </td>
                             <td className="px-6 py-4 text-sm font-black text-white">Rp {tx.amount.toLocaleString()}</td>
                             <td className="px-6 py-4 text-right">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                                   tx.status === PaymentStatus.SUCCESS ? 'bg-emerald-500/10 text-emerald-400' :
                                   tx.status === PaymentStatus.REFUNDED ? 'bg-slate-800 text-slate-500' :
                                   'bg-amber-500/10 text-amber-500'
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

      {/* Metode Pembayaran Aktif */}
      {activeTab === 'methods' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { name: 'Bank Aceh Syariah', id: '110-00-12345', status: 'ACTIVE', icon: '🏦', desc: 'Rekening utama wilayah Aceh.' },
             { name: 'Mandiri Transfer', id: '8821-00-9921', status: 'ACTIVE', icon: '💳', desc: 'Rekening operasional pusat.' },
             { name: 'QRIS SeuramoePay', id: 'GATEWAY-01', status: 'ACTIVE', icon: '📱', desc: 'Scan barcode via Midtrans.' },
             { name: 'Cash on Delivery', id: 'OFFLINE', status: 'ACTIVE', icon: '📦', desc: 'Bayar tunai di kasir/kurir.' },
             { name: 'BSI Regional', id: '4455-00-1122', status: 'INACTIVE', icon: '🕌', desc: 'Belum diaktifkan untuk shift ini.' },
           ].map(method => (
             <div key={method.name} className={`glass-panel p-8 rounded-[2rem] border-slate-800 flex flex-col group transition-all ${method.status === 'ACTIVE' ? 'hover:border-indigo-500/30' : 'opacity-40 grayscale'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="text-4xl">{method.icon}</div>
                   <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase ${method.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>{method.status}</span>
                </div>
                <div className="flex-1">
                   <h4 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{method.name}</h4>
                   <p className="text-[10px] font-mono text-slate-500 mb-4">{method.id}</p>
                   <p className="text-xs text-slate-400 leading-relaxed italic mb-8">"{method.desc}"</p>
                </div>
                <div className="pt-6 border-t border-slate-800/50 flex justify-between items-center">
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Local Method</span>
                   <button className="text-[10px] font-black text-indigo-400 uppercase hover:text-white transition-colors">Edit Parameter</button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Laporan Kas Harian */}
      {activeTab === 'cash_report' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="glass-panel p-10 rounded-[3rem] border-slate-800 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                 
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-10 border-b border-slate-800/50 relative z-10">
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Petty Cash Daily Log</h3>
                       <p className="text-[11px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Node: SUM-N-01 • Operator: {AuthService.getCurrentUser()?.fullName}</p>
                    </div>
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] text-right">
                       <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Saldo Kas Saat Ini</p>
                       <p className="text-4xl font-black text-emerald-400">Rp {cashStats.net.toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="mt-10 space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                       <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Entri Kas Masuk/Keluar</h4>
                       <button 
                         onClick={() => setIsAddingEntry(true)}
                         className="px-4 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                       >
                         + Tambah Entri
                       </button>
                    </div>

                    <div className="space-y-3">
                       {cashEntries.map(entry => (
                          <div key={entry.id} className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-indigo-500/20 transition-all">
                             <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${entry.type === 'IN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                   {entry.type === 'IN' ? <ICONS.Plus className="w-4 h-4" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 12H4" strokeWidth={3}/></svg>}
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-white">{entry.description}</p>
                                   <p className="text-[9px] text-slate-600 uppercase font-bold">{entry.time}</p>
                                </div>
                             </div>
                             <p className={`text-sm font-black ${entry.type === 'IN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {entry.type === 'IN' ? '+' : '-'} Rp {entry.amount.toLocaleString()}
                             </p>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="glass-panel p-8 rounded-3xl border-slate-800 bg-indigo-600 text-white shadow-2xl">
                 <h4 className="text-xl font-black mb-4 tracking-tighter">Settlement Protocol</h4>
                 <p className="text-xs opacity-80 leading-relaxed mb-10">Tutup register kas setiap akhir shift untuk sinkronisasi otomatis ke dashboard Owner.</p>
                 <button onClick={() => alert('Clearing Shift... Laporan dikirim.')} className="w-full py-4 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all">Tutup Kas & Kirim Laporan</button>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-slate-800">
                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">Shift Totals</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                       <span className="text-slate-500 uppercase">Pemasukan Tunai</span>
                       <span className="text-emerald-400 font-black">Rp {cashStats.income.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-bold">
                       <span className="text-slate-500 uppercase">Pengeluaran Kecil</span>
                       <span className="text-rose-400 font-black">Rp {cashStats.expense.toLocaleString()}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[11px] font-bold">
                       <span className="text-white uppercase">Net Cash in Box</span>
                       <span className="text-white font-black">Rp {cashStats.net.toLocaleString()}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Modal Tambah Entri Kas */}
      {isAddingEntry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsAddingEntry(false)}></div>
           <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
              <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">Tambah Catatan Kas</h3>
              
              <div className="space-y-6">
                 <div className="flex gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                    <button onClick={() => setNewEntry({...newEntry, type: 'IN'})} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${newEntry.type === 'IN' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Uang Masuk</button>
                    <button onClick={() => setNewEntry({...newEntry, type: 'OUT'})} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${newEntry.type === 'OUT' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Uang Keluar</button>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nominal (IDR)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 font-bold" 
                      placeholder="0"
                      onChange={e => setNewEntry({...newEntry, amount: Number(e.target.value)})}
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Keterangan / Deskripsi</label>
                    <textarea 
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                      placeholder="Misal: Pemasukan servis tunai atau pengeluaran ATK..."
                      onChange={e => setNewEntry({...newEntry, description: e.target.value})}
                    ></textarea>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setIsAddingEntry(false)} className="py-4 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:text-white">Batal</button>
                    <button onClick={addCashEntry} className="py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all">Simpan Entri</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StaffPayments;