import React, { useState, useEffect } from 'react';
import OrderService from '../../services/OrderService';
import { Order, OrderStatus } from '../../types';
import { ICONS } from '../../constants';
import InvoiceModal from '../../components/Shared/InvoiceModal';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  useEffect(() => {
    // User 'u6' (Ali Akbar) demo
    setOrders(OrderService.getOrders('s1'));
  }, []);

  const handleViewInvoice = (order: Order) => {
    setSelectedOrder(order);
    setIsInvoiceOpen(true);
  };

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsTrackingOpen(true);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex justify-between items-center px-2">
         <h3 className="text-lg font-black text-white uppercase tracking-tight">Purchase Timeline</h3>
         <button className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors tracking-widest">Filter: All Time</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {orders.map(order => (
           <div key={order.id} className="glass-panel p-6 rounded-[2.5rem] border-slate-800 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center gap-6 group">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0">
                 <ICONS.Package className="w-10 h-10" />
              </div>
              
              <div className="flex-1 space-y-2">
                 <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-sm font-black text-white uppercase font-mono tracking-tighter">ORD-{order.id.split('-').pop()}</h4>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      order.status === OrderStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      order.status === OrderStatus.SHIPPED ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]' :
                      'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>{order.status}</span>
                 </div>
                 <p className="text-xs text-slate-400 font-bold">
                    {order.items.length} Item: {order.items[0].productName} {order.items.length > 1 ? `+${order.items.length - 1} lainnya` : ''}
                 </p>
                 <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
                    <span className="flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" strokeWidth={2}/></svg>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                    <span className="flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeWidth={2}/></svg>{order.paymentMethod}</span>
                 </div>
              </div>

              <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-6">
                 <div className="text-left lg:text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-0.5 tracking-widest">Net Value</p>
                    <p className="text-xl font-black text-white tracking-tighter">Rp {order.totalAmount.toLocaleString()}</p>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewInvoice(order)}
                      className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all"
                      title="View Invoice"
                    >
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2}/></svg>
                    </button>
                    <button 
                      onClick={() => handleTrackOrder(order)}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-indigo-600/20"
                    >
                      Track Package
                    </button>
                 </div>
              </div>
           </div>
         ))}
         
         {orders.length === 0 && (
           <div className="py-24 text-center glass-panel rounded-[3rem] border-slate-800 flex flex-col items-center gap-6">
              <div className="p-5 bg-slate-900 rounded-full text-slate-700 border border-slate-800">
                <ICONS.Package className="w-12 h-12" />
              </div>
              <div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight">Ledger Kosong</h4>
                <p className="text-slate-500 text-xs mt-1">Anda belum melakukan transaksi belanja di Sumatra Node.</p>
              </div>
           </div>
         )}
      </div>

      {/* Invoice Modal Integration */}
      {selectedOrder && (
        <InvoiceModal 
          isOpen={isInvoiceOpen} 
          onClose={() => setIsInvoiceOpen(false)} 
          order={selectedOrder} 
        />
      )}

      {/* Tracking Modal (Quick Overlay) */}
      {isTrackingOpen && selectedOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsTrackingOpen(false)}></div>
           <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Live Tracking Node</p>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Package Trace #{selectedOrder.id.split('-').pop()}</h3>
                 </div>
                 <button onClick={() => setIsTrackingOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3}/></svg>
                 </button>
              </div>

              <div className="space-y-8 relative">
                 {/* Connection Line */}
                 <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-800"></div>

                 {[
                   { label: 'Pesanan Diterima', time: '10:15 WIB', detail: 'Sistem Aceh Tech mencatat pesanan Anda.', done: true },
                   { label: 'Proses Packing', time: '11:45 WIB', detail: 'Staf Node sedang menyiapkan unit perangkat.', done: selectedOrder.status !== OrderStatus.PENDING },
                   { label: 'Pengiriman Kurir', time: 'Pending', detail: selectedOrder.shippingResi ? `Paket dikirim dengan resi: ${selectedOrder.shippingResi}` : 'Menunggu pickup kurir JNE/J&T.', done: selectedOrder.status === OrderStatus.SHIPPED || selectedOrder.status === OrderStatus.COMPLETED },
                   { label: 'Sampai Tujuan', time: 'Estimated: 2 Hari', detail: 'Unit teknologi sampai di tangan Anda.', done: selectedOrder.status === OrderStatus.COMPLETED },
                 ].map((step, i) => (
                    <div key={i} className={`relative flex gap-6 transition-all ${step.done ? 'opacity-100' : 'opacity-30'}`}>
                       <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center z-10 border-2 ${
                         step.done ? 'bg-indigo-600 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border-slate-800'
                       }`}>
                          {step.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={4}/></svg>}
                       </div>
                       <div>
                          <div className="flex justify-between items-center gap-4">
                             <h5 className="text-sm font-bold text-white uppercase tracking-tight">{step.label}</h5>
                             <span className="text-[9px] font-mono font-bold text-indigo-400">{step.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-medium italic">"{step.detail}"</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-800 flex gap-4">
                 <button className="flex-1 py-4 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-700 transition-all">Hubungi Node Kurir</button>
                 <button onClick={() => setIsTrackingOpen(false)} className="flex-1 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg">Tutup Pelacakan</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;