
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants';
import { Transaction, PaymentStatus, TransactionType } from '../../types';
import TransactionService from '../../services/TransactionService';
import StatCard from '../../components/Shared/StatCard';

const GlobalTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [report, setReport] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTransactions(TransactionService.getAll());
  };

  const filtered = filter === 'ALL' 
    ? transactions 
    : transactions.filter(t => t.status === filter);

  const stats = {
    gross: transactions.filter(t => t.status === PaymentStatus.SUCCESS).reduce((acc, curr) => acc + curr.amount, 0),
    platform: transactions.filter(t => t.status === PaymentStatus.SUCCESS).reduce((acc, curr) => acc + curr.platformFee, 0),
    disputed: transactions.filter(t => t.status === PaymentStatus.DISPUTED).length,
    failed: transactions.filter(t => t.status === PaymentStatus.FAILED).reduce((acc, curr) => acc + curr.amount, 0)
  };

  const handleApprove = (id: string) => {
    TransactionService.updateStatus(id, PaymentStatus.SUCCESS);
    loadData();
    alert("Transaction manually approved.");
  };

  const handleRefund = (id: string) => {
    if (confirm("Are you sure you want to process a full refund for this transaction?")) {
      TransactionService.processRefund(id);
      loadData();
    }
  };

  const handleDispute = (id: string) => {
    TransactionService.updateStatus(id, PaymentStatus.DISPUTED);
    loadData();
  };

  const handleResolveDispute = (id: string, outcome: boolean) => {
    TransactionService.resolveDispute(id, outcome);
    loadData();
    alert(`Dispute resolved to: ${outcome ? 'SUCCESS' : 'FAILED'}`);
  };

  const generateReport = () => {
    const r = TransactionService.generateReconciliationReport();
    setReport(r);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      {/* Reconciliation Report Modal */}
      {report && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setReport(null)}></div>
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Reconciliation Report</h3>
              <button onClick={() => setReport(null)} className="text-slate-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <pre className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto">
              {report}
            </pre>
            <div className="mt-8 flex gap-3">
              <button onClick={() => { alert('Exporting PDF...'); setReport(null); }} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest">Download PDF</button>
              <button onClick={() => setReport(null)} className="flex-1 py-3 bg-slate-800 text-slate-400 font-bold rounded-xl text-xs uppercase tracking-widest">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white">Global Ledger</h2>
          <p className="text-sm text-slate-500">Monitor and reconcile all payments across the SeuramoeTech ecosystem.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={generateReport}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2}/></svg>
            Generate Report
          </button>
          <button 
            onClick={() => alert('Exporting global financial CSV...')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-700 flex items-center gap-2"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Gross Volume (GTV)" value={`Rp ${(stats.gross/1000000).toFixed(1)}M`} icon={<ICONS.Package />} colorClass="indigo" />
        <StatCard label="Platform Revenue" value={`Rp ${(stats.platform/1000000).toFixed(2)}M`} trend="+12%" icon={<ICONS.Dashboard />} colorClass="emerald" />
        <StatCard label="Failed Payments" value={`Rp ${(stats.failed/1000).toFixed(0)}k`} icon={<ICONS.Ticket />} colorClass="rose" />
        <StatCard label="Active Disputes" value={stats.disputed} icon={<ICONS.Settings />} colorClass="amber" />
      </div>

      <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-6 bg-slate-900/50 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
              {(['ALL', ...Object.values(PaymentStatus)] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  {s}
                </button>
              ))}
           </div>
           <div className="relative w-full md:w-64">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
              <input type="text" placeholder="Search TX ID, Store, User..." className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[10px] text-white outline-none focus:ring-2 focus:ring-indigo-500" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-5">Transaction Reference</th>
                <th className="px-6 py-5">Store & Context</th>
                <th className="px-6 py-5">Financial Details</th>
                <th className="px-6 py-5">Payment Status</th>
                <th className="px-6 py-5 text-right">Super Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-800/20 group transition-all">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-mono font-bold text-white">{tx.id}</span>
                      <span className="text-[9px] text-slate-500 font-medium uppercase tracking-widest">{new Date(tx.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-bold text-white">{tx.storeName || 'PLATFORM INTERNAL'}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Customer: {tx.userName}</p>
                      <p className="text-[10px] text-indigo-400/80 italic truncate max-w-[150px]">{tx.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className={`text-sm font-black ${tx.netAmount < 0 ? 'text-rose-400' : 'text-white'}`}>
                        Rp {tx.amount.toLocaleString()}
                      </p>
                      {tx.platformFee > 0 && (
                        <div className="flex items-center gap-1.5">
                           <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Fee: {tx.platformFee.toLocaleString()}</span>
                           <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{tx.paymentMethod}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter border ${
                      tx.status === PaymentStatus.SUCCESS ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      tx.status === PaymentStatus.PENDING ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      tx.status === PaymentStatus.FAILED ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      tx.status === PaymentStatus.REFUNDED ? 'bg-slate-800 text-slate-400 border-slate-700' :
                      'bg-rose-600 text-white animate-pulse border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       {tx.status === PaymentStatus.PENDING && (
                         <button 
                           onClick={() => handleApprove(tx.id)}
                           className="p-2 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                           title="Manual Approve"
                         >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         </button>
                       )}
                       {tx.status === PaymentStatus.SUCCESS && (
                         <>
                           <button 
                             onClick={() => handleRefund(tx.id)}
                             className="p-2 bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg transition-all"
                             title="Issue Refund"
                           >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>
                           </button>
                           <button 
                             onClick={() => handleDispute(tx.id)}
                             className="p-2 bg-amber-600/10 text-amber-500 hover:bg-amber-600 hover:text-white rounded-lg transition-all"
                             title="Flag Dispute/Chargeback"
                           >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                           </button>
                         </>
                       )}
                       {tx.status === PaymentStatus.DISPUTED && (
                         <div className="flex gap-1">
                            <button onClick={() => handleResolveDispute(tx.id, true)} className="p-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition-all" title="Resolve: Valid Payment">
                               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
                            </button>
                            <button onClick={() => handleResolveDispute(tx.id, false)} className="p-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg transition-all" title="Resolve: Fraud/Invalid">
                               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
                            </button>
                         </div>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-20 text-center text-slate-600 italic">No transactions found for the selected criteria.</div>
        )}
      </div>
    </div>
  );
};

export default GlobalTransactions;
