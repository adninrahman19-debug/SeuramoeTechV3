
import React from 'react';

const RepairsTracker: React.FC = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl border-slate-800 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Current Repairs</h3>
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">1 Active</span>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-bold text-white">Asus ROG Zephyrus G14</h4>
            <p className="text-xs text-slate-500">Ticket #ST-8821 • Status: Repairing</p>
          </div>
          <div className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase rounded">In Progress</div>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full w-[65%]"></div>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-right">Estimated Ready: Tomorrow</p>
      </div>
      <button className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all border border-slate-700">
        View Repair History
      </button>
    </div>
  );
};

export default RepairsTracker;
