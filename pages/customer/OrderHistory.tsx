
import React from 'react';
import { ICONS } from '../../constants';

const OrderHistory: React.FC = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl border-slate-800 h-full">
      <h3 className="text-lg font-bold text-white mb-6">Recent Orders</h3>
      <div className="space-y-4">
        {[1].map((i) => (
          <div key={i} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
              <ICONS.Package className="text-slate-500 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white">Logitech MX Master 3S</h4>
              <p className="text-xs text-slate-500">Ordered on Oct 12, 2023</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">Rp 1.4M</p>
              <p className="text-[10px] text-emerald-400 font-bold uppercase">Delivered</p>
            </div>
          </div>
        ))}
        <button className="w-full py-3 text-sm font-semibold text-slate-400 hover:text-white transition-colors">View Full History</button>
      </div>
    </div>
  );
};

export default OrderHistory;
