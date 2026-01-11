
import React, { useState, useEffect } from 'react';
import OrderService from '../../services/OrderService';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { ICONS } from '../../constants';
import RightDrawer from '../../components/Shared/RightDrawer';

const OrderManager: React.FC = () => {
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
    if (selectedOrder) {
      OrderService.updateOrderStatus(selectedOrder.id, status, resiInput);
      setIsDrawerOpen(false);
      loadData();
    }
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <RightDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title="Fulfillment Detail"
      >
        {selectedOrder && (
          <div className="space-y-8">
             <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                <div className="flex justify-between items-start mb-4">
                   <h3 className="text-xl font-black text-white">{selectedOrder.id}</h3>
                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                     selectedOrder.status === OrderStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
                   }`}>{selectedOrder.status}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ordered on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Customer Info</h4>
                <div>
                   <p className="text-sm font-bold text-white">{selectedOrder.customerName}</p>
                   <p className="text-xs text-slate-400 mt-1">{selectedOrder.address}</p>
                   <p className="text-xs text-indigo-400 font-mono mt-2">{selectedOrder.customerPhone}</p>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Cart Contents</h4>
                <div className="space-y-3">
                   {selectedOrder.items.map(item => (
                     <div key={item.id} className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                        <div>
                           <p className="text-xs font-bold text-white">{item.productName}</p>
                           <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-xs font-black text-white">Rp {item.priceAtPurchase.toLocaleString()}</p>
                     </div>
                   ))}
                   <div className="flex justify-between items-center pt-2 px-3">
                      <span className="text-xs font-bold text-slate-500">Total Settlement</span>
                      <span className="text-lg font-black text-emerald-400">Rp {selectedOrder.totalAmount.toLocaleString()}</span>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Fulfillment Action</h4>
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shipping Receipt (Resi)</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="Input JNE/J&T/Sicepat No..."
                        value={resiInput}
                        onChange={e => setResiInput(e.target.value)}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleUpdateStatus(OrderStatus.PROCESSING)} className="py-3 bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl hover:bg-slate-700 transition-all">Process Order</button>
                      <button onClick={() => handleUpdateStatus(OrderStatus.SHIPPED)} className="py-3 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all">Mark Shipped</button>
                   </div>
                   <button onClick={() => handleUpdateStatus(OrderStatus.COMPLETED)} className="w-full py-4 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-emerald-500 transition-all">Complete Fulfillment</button>
                </div>
             </div>

             <div className="pt-8 border-t border-slate-800">
                <button 
                  onClick={printInvoice}
                  className="w-full py-4 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl flex items-center justify-center gap-3 transition-all"
                >
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                   Generate Store Invoice
                </button>
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
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               {s}
             </button>
           ))}
        </div>
        <div className="flex gap-2">
           <button onClick={() => alert('Exporting orders to CSV...')} className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2">
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
                     <th className="px-6 py-5">Order ID</th>
                     <th className="px-6 py-5">Customer Profile</th>
                     <th className="px-6 py-5">Payment Status</th>
                     <th className="px-6 py-5">Total Value</th>
                     <th className="px-6 py-5 text-right">Fulfillment</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                  {filtered.map(order => (
                    <tr key={order.id} className="hover:bg-slate-800/20 group transition-all cursor-pointer" onClick={() => openDetails(order)}>
                       <td className="px-6 py-4">
                          <p className="text-sm font-black text-white font-mono">{order.id}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{order.customerName}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{order.address}</p>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                             order.paymentStatus === PaymentStatus.SUCCESS ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                          }`}>{order.paymentStatus}</span>
                          <p className="text-[8px] text-slate-600 mt-1 font-bold uppercase">{order.paymentMethod}</p>
                       </td>
                       <td className="px-6 py-4 text-sm font-black text-white">
                          Rp {order.totalAmount.toLocaleString()}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                             <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                               order.status === OrderStatus.COMPLETED ? 'text-emerald-400' : 
                               order.status === OrderStatus.PROCESSING ? 'text-indigo-400' : 'text-amber-500'
                             }`}>{order.status}</span>
                             {order.shippingResi && <p className="text-[8px] text-slate-600 font-mono tracking-tighter">Resi: {order.shippingResi}</p>}
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

export default OrderManager;
