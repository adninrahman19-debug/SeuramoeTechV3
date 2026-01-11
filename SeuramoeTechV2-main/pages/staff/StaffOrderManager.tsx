
import React, { useState, useEffect } from 'react';
import OrderService from '../../services/OrderService';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { ICONS } from '../../constants';
import RightDrawer from '../../components/Shared/RightDrawer';

const StaffOrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [resiInput, setResiInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Mocking store ID s1
    setOrders(OrderService.getOrders('s1'));
  };

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  const openDetails = (order: Order) => {
    setSelectedOrder(order);
    setResiInput(order.shippingResi || '');
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = (status: OrderStatus) => {
    if (selectedOrder) {
      OrderService.updateOrderStatus(selectedOrder.id, status, resiInput);
      setIsDrawerOpen(false);
      loadData();
    }
  };

  const handleConfirmPayment = (id: string) => {
    if (confirm("Konfirmasi bahwa pembayaran telah diterima di rekening toko?")) {
      OrderService.updatePaymentStatus(id, PaymentStatus.SUCCESS);
      loadData();
      if (selectedOrder) setSelectedOrder({...selectedOrder, paymentStatus: PaymentStatus.SUCCESS});
    }
  };

  const handleApplyRefund = (id: string) => {
    if (confirm("Ajukan permintaan refund untuk pesanan ini ke Owner?")) {
      OrderService.updateOrderStatus(id, OrderStatus.REFUND_REQUESTED);
      alert("Permintaan refund telah dikirim ke dashboard Owner untuk persetujuan.");
      setIsDrawerOpen(false);
      loadData();
    }
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <RightDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title="Manajemen Pesanan & Transaksi"
      >
        {selectedOrder && (
          <div className="space-y-8">
             <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h3 className="text-xl font-black text-white">{selectedOrder.id}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                   </div>
                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                     selectedOrder.status === OrderStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                     selectedOrder.status === OrderStatus.REFUND_REQUESTED ? 'bg-rose-500 text-white border-rose-400' :
                     'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                   }`}>{selectedOrder.status}</span>
                </div>
                
                <div className="flex items-center gap-2 mt-6">
                   <div className={`w-2 h-2 rounded-full ${selectedOrder.paymentStatus === PaymentStatus.SUCCESS ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                   <p className="text-xs font-bold text-white uppercase tracking-widest">
                      Payment: {selectedOrder.paymentStatus} ({selectedOrder.paymentMethod})
                   </p>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Detail Pelanggan</h4>
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                   <p className="text-sm font-bold text-white">{selectedOrder.customerName}</p>
                   <p className="text-xs text-slate-400 mt-1">{selectedOrder.address}</p>
                   <p className="text-xs text-indigo-400 font-mono mt-3">{selectedOrder.customerPhone}</p>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Daftar Produk</h4>
                <div className="space-y-2">
                   {selectedOrder.items.map(item => (
                     <div key={item.id} className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                        <div>
                           <p className="text-xs font-bold text-white">{item.productName}</p>
                           <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-xs font-black text-white">Rp {item.priceAtPurchase.toLocaleString()}</p>
                     </div>
                   ))}
                   <div className="flex justify-between items-center pt-4 px-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Bayar</span>
                      <span className="text-xl font-black text-emerald-400">Rp {selectedOrder.totalAmount.toLocaleString()}</span>
                   </div>
                </div>
             </div>

             <div className="space-y-6 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest">Operasi Staf</h4>
                
                {selectedOrder.paymentStatus === PaymentStatus.PENDING && (
                  <button 
                    onClick={() => handleConfirmPayment(selectedOrder.id)}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3"
                  >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     Konfirmasi Pembayaran Sah
                  </button>
                )}

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Input Nomor Resi Pengiriman</label>
                   <input 
                     type="text" 
                     className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                     placeholder="Contoh: JNE882100XXX"
                     value={resiInput}
                     onChange={e => setResiInput(e.target.value)}
                   />
                </div>

                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => handleUpdateStatus(OrderStatus.PROCESSING)} className="py-3 bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl hover:bg-slate-700 transition-all border border-slate-700">Proses Packing</button>
                   <button onClick={() => handleUpdateStatus(OrderStatus.SHIPPED)} className="py-3 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all">Input Resi & Kirim</button>
                </div>

                <div className="flex gap-2">
                   <button 
                     onClick={printInvoice}
                     className="flex-1 py-3 bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-black uppercase rounded-xl hover:text-white transition-all flex items-center justify-center gap-2"
                   >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Cetak Invoice
                   </button>
                   <button 
                     onClick={() => handleApplyRefund(selectedOrder.id)}
                     className="flex-1 py-3 bg-rose-600/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase rounded-xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"
                   >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>
                      Ajukan Refund
                   </button>
                </div>
             </div>
          </div>
        )}
      </RightDrawer>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit overflow-x-auto max-w-full">
           {(['ALL', ...Object.values(OrderStatus)] as const).map(s => (
             <button
               key={s}
               onClick={() => setFilter(s)}
               className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
             >
               {s.replace('_', ' ')}
             </button>
           ))}
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => alert('Fitur Export Data sedang dioptimasi...')} className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2}/></svg>
              Export
           </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                     <th className="px-6 py-5">Order Reference</th>
                     <th className="px-6 py-5">Pelanggan</th>
                     <th className="px-6 py-5">Status Bayar</th>
                     <th className="px-6 py-5">Nilai Transaksi</th>
                     <th className="px-6 py-5 text-right">Tahap Fulfillment</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-600 italic">Tidak ada pesanan ditemukan untuk filter ini.</td></tr>
                  ) : filtered.map(order => (
                    <tr key={order.id} className="hover:bg-slate-800/20 group transition-all cursor-pointer" onClick={() => openDetails(order)}>
                       <td className="px-6 py-4">
                          <p className="text-sm font-black text-white font-mono group-hover:text-indigo-400 transition-colors">{order.id}</p>
                          <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-sm font-bold text-white">{order.customerName}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter truncate max-w-[120px]">{order.customerPhone}</p>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                             <span className={`px-2 py-0.5 rounded-md w-fit text-[8px] font-black uppercase border ${
                               order.paymentStatus === PaymentStatus.SUCCESS ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                               order.paymentStatus === PaymentStatus.PENDING ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' :
                               'bg-slate-800 text-slate-500 border-slate-700'
                             }`}>{order.paymentStatus}</span>
                             <p className="text-[8px] text-slate-600 font-bold uppercase">{order.paymentMethod}</p>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-sm font-black text-white">
                          Rp {order.totalAmount.toLocaleString()}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                               order.status === OrderStatus.COMPLETED ? 'text-emerald-400 bg-emerald-500/5' : 
                               order.status === OrderStatus.REFUND_REQUESTED ? 'text-rose-500 bg-rose-500/5 animate-pulse' :
                               'text-indigo-400 bg-indigo-500/5'
                             }`}>{order.status.replace('_', ' ')}</span>
                             {order.shippingResi && <p className="text-[9px] text-slate-600 font-mono tracking-tighter">Resi: {order.shippingResi}</p>}
                          </div>
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

export default StaffOrderManager;
