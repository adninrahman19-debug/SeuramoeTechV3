
import React, { useState, useEffect } from 'react';
import OrderService from '../../services/OrderService';
import { Transaction, PaymentStatus } from '../../types';
import { ICONS } from '../../constants';
import StatCard from '../../components/Shared/StatCard';

const FinancialsManager: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<PaymentStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTransactions(OrderService.getTransactions('s1'));
  };

  const filtered = filter === 'ALL' ? transactions : transactions.filter(t => t.status === filter);

  const stats = {
    gross: transactions.filter(t => t.status === PaymentStatus.SUCCESS).reduce((acc, curr) => acc + curr.amount, 0),
    net: transactions.filter(t => t.status === PaymentStatus.SUCCESS).reduce((acc, curr) => acc + curr.netAmount, 0),
    pending: transactions.filter(t => t.status === PaymentStatus.PENDING).reduce((acc, curr) => acc + curr.amount, 0),
  };

  const handleRefund = (txId: string, amount: number) => {
    if (confirm(`PERINGATAN: Apakah Anda yakin ingin melakukan refund sebesar Rp ${amount.toLocaleString()}? Saldo akan dikembalikan ke pelanggan dan transaksi ini akan ditandai sebagai REFUNDED.`)) {
      const oid = txId.replace('TX-', '');
      OrderService.processRefund(oid);
      alert("Refund berhasil diproses.");
      loadData();
    }
  };

  const handleWithdraw = () => {
    const available = stats.net;
    if (available <= 0) return alert("Saldo bersih tidak mencukupi untuk penarikan.");
    
    if (confirm(`Konfirmasi penarikan saldo sebesar Rp ${available.toLocaleString()} ke rekening bank terdaftar Anda? Estimasi proses 1x24 jam.`)) {
      alert("Permintaan penarikan telah diajukan ke sistem pusat SeuramoeTech.");
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Omzet Kotor Toko" value={`Rp ${(stats.gross/1000000).toFixed(1)}jt`} icon={<ICONS.Package />} colorClass="indigo" />
        <StatCard label="Saldo Bersih (Siap Tarik)" value={`Rp ${(stats.net/1000000).toFixed(1)}jt`} icon={<ICONS.Dashboard />} colorClass="emerald" />
        <StatCard label="Dalam Penangguhan (Escrow)" value={`Rp ${(stats.pending/1000000).toFixed(1)}jt`} icon={<ICONS.Ticket />} colorClass="amber" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit overflow-x-auto max-w-full">
           {(['ALL', ...Object.values(PaymentStatus)] as const).map(s => (
             <button key={s} onClick={() => setFilter(s)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{s}</button>
           ))}
        </div>
        <button onClick={handleWithdraw} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl transition-all">Tarik Saldo Ke Bank</button>
      </div>

      <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
         <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Buku Besar Transaksi Toko</h3>
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">NODE SUMATRA-01</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-900/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                     <th className="px-6 py-5">Ref ID / Waktu</th>
                     <th className="px-6 py-5">Pelanggan</th>
                     <th className="px-6 py-5">Rincian Finansial</th>
                     <th className="px-6 py-5">Status Pembayaran</th>
                     <th className="px-6 py-5 text-right">Operasi Ledger</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                  {filtered.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/20 transition-all font-mono group">
                       <td className="px-6 py-4">
                          <p className="text-xs font-bold text-white">{tx.id}</p>
                          <p className="text-[9px] text-slate-600 mt-0.5">{new Date(tx.timestamp).toLocaleString()}</p>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-xs font-bold text-slate-300 font-sans">{tx.userName}</p>
                          <p className="text-[9px] text-slate-600 font-sans italic truncate max-w-[150px]">{tx.description}</p>
                       </td>
                       <td className="px-6 py-4">
                          <div className="space-y-1">
                             <p className={`text-sm font-black ${tx.netAmount < 0 ? 'text-rose-400' : 'text-white'}`}>Rp {tx.amount.toLocaleString()}</p>
                             <div className="flex items-center gap-2 text-[8px] font-black uppercase text-slate-500 font-sans">
                                <span>Platform Fee: {tx.platformFee.toLocaleString()}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                             tx.status === PaymentStatus.SUCCESS ? 'bg-emerald-500/10 text-emerald-400' :
                             tx.status === PaymentStatus.REFUNDED ? 'bg-slate-800 text-slate-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>{tx.status}</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          {tx.status === PaymentStatus.SUCCESS && (
                             <button onClick={() => handleRefund(tx.id, tx.amount)} className="px-3 py-1 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-lg text-[8px] font-black uppercase tracking-widest transition-all">Refund</button>
                          )}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default FinancialsManager;
