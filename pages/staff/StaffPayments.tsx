
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
    const confirmMsg = success 
      ? `Konfirmasi bahwa dana untuk Order ${orderId} benar-benar sudah masuk ke rekening bank toko?`
      : `Anda akan menolak bukti pembayaran untuk Order ${orderId}. Pelanggan akan diminta mengunggah ulang. Lanjutkan?`;

    if (confirm(confirmMsg)) {
      OrderService.updatePaymentStatus(orderId, success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
      alert(`Pembayaran ${orderId} telah ${success ? 'disetujui' : 'ditolak'}.`);
      loadData();
    }
  };

  const addCashEntry = () => {
    const amount = Number(newEntry.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Masukkan nominal yang valid (angka lebih dari 0).");
      return;
    }
    if (!newEntry.description?.trim()) {
      alert("Harap isi deskripsi/keterangan kas.");
      return;
    }

    const typeLabel = newEntry.type === 'IN' ? 'Pemasukan' : 'Pengeluaran';
    if (confirm(`Catat entri ${typeLabel} sebesar Rp ${amount.toLocaleString()}?`)) {
      const entry: CashEntry = {
        id: Date.now().toString(),
        type: newEntry.type as 'IN' | 'OUT',
        amount: amount,
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

      {activeTab === 'verification' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {pendingOrders.length === 0 ? (
             <div className="col-span-full p-20 text-center glass-panel rounded-3xl border-slate-800 text-slate-500 italic">Antrean verifikasi kosong.</div>
           ) : pendingOrders.map(order => (
             <div key={order.id} className="glass-panel p-8 rounded-[2rem] border-slate-800 flex flex-col group hover:border-indigo-500/30 transition-all shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">{order.paymentMethod}</p>
                      <h4 className="text-3xl font-black text-white tracking-tighter">Rp {order.totalAmount.toLocaleString()}</h4>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] text-slate-500 font-black uppercase mb-1">ID Order</p>
                      <span className="text-xs font-mono font-bold text-white bg-slate-800 px-3 py-1 rounded-full">{order.id}</span>
                   </div>
                </div>
                <div className="flex gap-4 mb-10">
                   <div className="w-24 h-28 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative group/img">
                      <img src="https://images.unsplash.com/photo-1627634777217-c864268db30c?q=80&w=200" className="w-full h-full object-cover opacity-50" alt="proof" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 bg-slate-950/40 transition-all">
                         <span className="text-[8px] font-black text-white uppercase">Lihat Bukti</span>
                      </div>
                   </div>
                   <div className="flex-1 space-y-3">
                      <div className="flex justify-between text-xs p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                         <span className="text-slate-500 uppercase font-bold tracking-widest text-[9px]">Pelanggan</span>
                         <span className="text-white font-black truncate max-w-[100px]">{order.customerName}</span>
                      </div>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => handleVerify(order.id, false)} className="py-4 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-600 hover:text-white transition-all">Tolak</button>
                   <button onClick={() => handleVerify(order.id, true)} className="py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 shadow-xl flex items-center justify-center gap-2 transition-all">Verifikasi Sah</button>
                </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'cash_report' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <div className="glass-panel p-10 rounded-[3rem] border-slate-800 shadow-2xl relative overflow-hidden">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-10 border-b border-slate-800/50 relative z-10">
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Petty Cash Daily Log</h3>
                       <p className="text-[11px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Node: SUM-N-01</p>
                    </div>
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] text-right">
                       <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Saldo Kas</p>
                       <p className="text-4xl font-black text-emerald-400">Rp {cashStats.net.toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="mt-10 space-y-6">
                    <div className="flex justify-between items-center">
                       <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Entri Kas Masuk/Keluar</h4>
                       <button onClick={() => setIsAddingEntry(true)} className="px-4 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-xl hover:bg-indigo-500 transition-all">+ Tambah Entri</button>
                    </div>
                    <div className="space-y-3">
                       {cashEntries.map(entry => (
                          <div key={entry.id} className="flex justify-between items-center p-4 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-indigo-500/20 transition-all">
                             <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${entry.type === 'IN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                   {entry.type === 'IN' ? <ICONS.Plus className="w-4 h-4" /> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 12H4" strokeWidth={3}/></svg>}
                                </div>
                                <div><p className="text-sm font-bold text-white">{entry.description}</p><p className="text-[9px] text-slate-600 font-bold uppercase">{entry.time}</p></div>
                             </div>
                             <p className={`text-sm font-black ${entry.type === 'IN' ? 'text-emerald-400' : 'text-rose-400'}`}>{entry.type === 'IN' ? '+' : '-'} Rp {entry.amount.toLocaleString()}</p>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
           <div className="space-y-6">
              <div className="glass-panel p-8 rounded-3xl border-slate-800 bg-indigo-600 text-white shadow-2xl">
                 <h4 className="text-xl font-black mb-4 tracking-tighter">Settlement Protocol</h4>
                 <p className="text-xs opacity-80 mb-10 leading-relaxed">Tutup register kas setiap akhir shift untuk sinkronisasi otomatis ke dashboard Owner.</p>
                 <button onClick={() => { if(confirm("Konfirmasi tutup shift? Seluruh log kas hari ini akan dikunci dan dikirim ke Owner.")) alert('Settlement Terkirim.'); }} className="w-full py-4 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all">Tutup Kas & Kirim Laporan</button>
              </div>
           </div>
        </div>
      )}

      {isAddingEntry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsAddingEntry(false)}></div>
           <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
              <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">Tambah Catatan Kas</h3>
              <div className="space-y-6">
                 <div className="flex gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                    <button onClick={() => setNewEntry({...newEntry, type: 'IN'})} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${newEntry.type === 'IN' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white'}`}>Uang Masuk</button>
                    <button onClick={() => setNewEntry({...newEntry, type: 'OUT'})} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${newEntry.type === 'OUT' ? 'bg-rose-600 text-white' : 'text-slate-500 hover:text-white'}`}>Uang Keluar</button>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nominal (IDR)</label>
                    <input type="number" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="0" value={newEntry.amount || ''} onChange={e => setNewEntry({...newEntry, amount: e.target.value as any})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Keterangan</label>
                    <textarea rows={3} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Misal: Servis laptop tunai..." value={newEntry.description || ''} onChange={e => setNewEntry({...newEntry, description: e.target.value})}></textarea>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setIsAddingEntry(false)} className="py-4 bg-slate-800 text-slate-400 text-[10px] font-black uppercase rounded-2xl hover:text-white">Batal</button>
                    <button onClick={addCashEntry} className="py-4 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-indigo-500 shadow-xl transition-all">Simpan Entri</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StaffPayments;
