
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
    setOrders(OrderService.getOrders('s1'));
  };

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  const openDetails = (order: Order) => {
    setSelectedOrder(order);
    setResiInput(order.shippingResi || '');
    setIsDrawerOpen(true);
  };

  const handleUpdateStatus = (status: OrderStatus) => {
    if (!selectedOrder) return;
    
    if (status === OrderStatus.SHIPPED && !resiInput.trim()) {
      alert("Harap masukkan nomor resi sebelum menandai pesanan telah dikirim.");
      return;
    }

    const statusLabel = status.replace('_', ' ');
    if (confirm(`Ubah status Order ${selectedOrder.id} menjadi ${statusLabel}?`)) {
      OrderService.updateOrderStatus(selectedOrder.id, status, resiInput);
      alert(`Status order diperbarui ke ${statusLabel}.`);
      setIsDrawerOpen(false);
      loadData();
    }
  };

  const handleConfirmPayment = (id: string) => {
    if (confirm("Pastikan nominal transfer sesuai. Konfirmasi pembayaran sah untuk order ini? Dana akan masuk ke ledger toko.")) {
      OrderService.updatePaymentStatus(id, PaymentStatus.SUCCESS);
      loadData();
      if (selectedOrder) setSelectedOrder({...selectedOrder, paymentStatus: PaymentStatus.SUCCESS});
      alert("Pembayaran berhasil diverifikasi.");
    }
  };

  const handleApplyRefund = (id: string) => {
    if (confirm("Ajukan permintaan refund untuk pesanan ini ke Owner? Staf tidak dapat mengeksekusi refund secara langsung demi keamanan kas.")) {
      OrderService.updateOrderStatus(id, OrderStatus.REFUND_REQUESTED);
      alert("Permintaan refund diajukan ke Owner.");
      setIsDrawerOpen(false);
      loadData();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Manajemen Pesanan & Transaksi">
        {selectedOrder && (
          <div className="space-y-8">
             <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h3 className="text-xl font-black text-white">{selectedOrder.id}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                   </div>
                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                     selectedOrder.status === OrderStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                   }`}>{selectedOrder.status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2 mt-6">
                   <div className={`w-2 h-2 rounded-full ${selectedOrder.paymentStatus === PaymentStatus.SUCCESS ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                   <p className="text-xs font-bold text-white uppercase tracking-widest">Payment: {selectedOrder.paymentStatus} ({selectedOrder.paymentMethod})</p>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Detail Pelanggan</h4>
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                   <p className="text-sm font-bold text-white">{selectedOrder.customerName}</p>
                   <p className="text-xs text-slate-400 mt-1">{selectedOrder.address}</p>
                </div>
             </div>

             <div className="space-y-6 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest">Operasi Staf</h4>
                {selectedOrder.paymentStatus === PaymentStatus.PENDING && (
                  <button onClick={() => handleConfirmPayment(selectedOrder.id)} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3">Konfirmasi Pembayaran</button>
                )}
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No. Resi Pengiriman</label>
                   <input type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={resiInput} onChange={e => setResiInput(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => handleUpdateStatus(OrderStatus.PROCESSING)} className="py-3 bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl border border-slate-700 hover:bg-slate-700 transition-all">Packing</button>
                   <button onClick={() => handleUpdateStatus(OrderStatus.SHIPPED)} className="py-3 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-indigo-500 shadow-xl transition-all">Kirim</button>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => handleUpdateStatus(OrderStatus.COMPLETED)} className="flex-1 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-emerald-500 transition-all">Selesai</button>
                   <button onClick={() => handleApplyRefund(selectedOrder.id)} className="flex-1 py-3 bg-rose-600/10 text-rose-500 text-[10px] font-black uppercase rounded-xl hover:bg-rose-600 hover:text-white transition-all">Refund</button>
                </div>
             </div>
          </div>
        )}
      </RightDrawer>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit overflow-x-auto max-w-full">
           {(['ALL', ...Object.values(OrderStatus)] as const).map(s => (
             <button key={s} onClick={() => setFilter(s)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>{s.replace('_', ' ')}</button>
           ))}
        </div>
      </div>

      <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                     <th className="px-6 py-5">Ref / Waktu</th>
                     <th className="px-6 py-5">Pelanggan</th>
                     <th className="px-6 py-5">Status Bayar</th>
                     <th className="px-6 py-5">Nilai</th>
                     <th className="px-6 py-5 text-right">Tahap Fulfillment</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-600 italic">Data kosong.</td></tr>
                  ) : filtered.map(order => (
                    <tr key={order.id} className="hover:bg-slate-800/20 group transition-all cursor-pointer" onClick={() => openDetails(order)}>
                       <td className="px-6 py-4">
                          <p className="text-sm font-black text-white font-mono">{order.id}</p>
                          <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                       </td>
                       <td className="px-6 py-4 text-sm font-bold text-white">{order.customerName}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                            order.paymentStatus === PaymentStatus.SUCCESS ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}>{order.paymentStatus}</span>
                       </td>
                       <td className="px-6 py-4 text-sm font-black text-white">Rp {order.totalAmount.toLocaleString()}</td>
                       <td className="px-6 py-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            order.status === OrderStatus.COMPLETED ? 'text-emerald-400 bg-emerald-500/5' : 'text-indigo-400 bg-indigo-500/5'
                          }`}>{order.status.replace('_', ' ')}</span>
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
