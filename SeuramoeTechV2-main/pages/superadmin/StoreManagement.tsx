
import React from 'react';
import { ICONS } from '../../constants';
import { Store } from '../../types';

interface StoreManagementProps {
  stores: Store[];
  onToggleStatus: (id: string, currentStatus: string) => void;
  onViolation: (id: string) => void;
  onOpenConfig: (store: Store) => void;
}

const StoreManagement: React.FC<StoreManagementProps> = ({ stores, onToggleStatus, onViolation, onOpenConfig }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500">
      {stores.map(store => (
        <div key={store.id} className="glass-panel p-8 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all group relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-inner">
              <ICONS.Store className="w-8 h-8" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${store.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]'}`}>
                {store.status}
              </span>
              {store.violationCount && store.violationCount > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-500 text-white rounded-md animate-pulse">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span className="text-[9px] font-black">{store.violationCount} VIOLATIONS</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-white tracking-tight">{store.name}</h3>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {store.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
             <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex flex-col gap-1">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Products</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-lg font-black text-white">{store.productLimit}</p>
                  <span className="text-[10px] text-slate-600">CAP</span>
                </div>
             </div>
             <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex flex-col gap-1">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Staff Seats</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-lg font-black text-white">{store.staffLimit}</p>
                  <span className="text-[10px] text-slate-600">MAX</span>
                </div>
             </div>
          </div>

          <div className="mt-auto space-y-2">
             <button 
               onClick={() => onOpenConfig(store)}
               className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/10 flex items-center justify-center gap-2 group/btn"
             >
                <svg className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Manage Configuration
             </button>
             <div className="flex gap-2">
                <button onClick={() => onToggleStatus(store.id, store.status)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border border-slate-700">
                  {store.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
                <button onClick={() => onViolation(store.id)} className="flex-1 py-2 bg-rose-600/10 text-rose-400 border border-rose-600/20 hover:bg-rose-600 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                  Violation
                </button>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreManagement;
