import React from 'react';
import { Order, OrderItem } from '../../types';
import Logo from './Logo';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 md:p-12 space-y-10">
          {/* Invoice Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
               <Logo size="md" className="mb-4 grayscale invert" />
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Node: Sumatra-North-01</p>
            </div>
            <div className="text-right">
               <h2 className="text-3xl font-black uppercase tracking-tighter italic">Invoice</h2>
               <p className="text-sm font-mono font-bold text-slate-500">#{order.id}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-2 gap-10 border-t border-slate-100 pt-10">
            <div className="space-y-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billed To</p>
               <p className="font-bold text-lg leading-none">{order.customerName}</p>
               <p className="text-xs text-slate-500">{order.address}</p>
               <p className="text-xs font-mono text-indigo-600">{order.customerPhone}</p>
            </div>
            <div className="text-right space-y-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Issued</p>
               <p className="font-bold text-sm">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Payment Method</p>
               <p className="font-bold text-xs uppercase text-indigo-600">{order.paymentMethod}</p>
            </div>
          </div>

          {/* Item Table */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 border-b-2 border-slate-900 pb-2 text-[10px] font-black uppercase tracking-widest">
               <div className="col-span-7">Item Description</div>
               <div className="col-span-2 text-center">Qty</div>
               <div className="col-span-3 text-right">Price</div>
            </div>
            <div className="space-y-3">
              {order.items.map((item: OrderItem) => (
                <div key={item.id} className="grid grid-cols-12 text-sm font-medium">
                  <div className="col-span-7 font-bold">{item.productName}</div>
                  <div className="col-span-2 text-center text-slate-500">{item.quantity}</div>
                  <div className="col-span-3 text-right font-bold italic">Rp {item.priceAtPurchase.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t-2 border-slate-100 pt-6 flex flex-col items-end gap-2">
             <div className="w-full md:w-64 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                   <span>Subtotal</span>
                   <span>Rp {order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500">
                   <span>Platform Fee</span>
                   <span>Free</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                   <span className="text-sm font-black uppercase tracking-widest">Total Paid</span>
                   <span className="text-2xl font-black text-indigo-600">Rp {order.totalAmount.toLocaleString()}</span>
                </div>
             </div>
          </div>

          {/* Footer Info */}
          <div className="pt-10 text-center">
             <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest">
                Thank you for choosing SeuramoeTech. <br/>
                All devices are backed by our Sumatra Regional Warranty node.
             </p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 flex justify-between items-center">
           <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${
              order.paymentStatus === 'SUCCESS' ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-amber-100 border-amber-200 text-amber-700'
           }`}>
              Payment Status: {order.paymentStatus}
           </span>
           <div className="flex gap-3">
              <button onClick={() => window.print()} className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-lg shadow-slate-900/20">Download PDF</button>
              <button onClick={onClose} className="px-6 py-2 bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase rounded-xl">Close</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;