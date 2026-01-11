
import React from 'react';
import { ICONS } from '../../constants';
import { Store } from '../../types';
import StoreService from '../../services/StoreService';

interface StoreManagementProps {
  stores: Store[];
  onToggleStatus: (id: string, currentStatus: string) => void;
  onViolation: (id: string) => void;
  onOpenConfig: (store: Store) => void;
  onAddStore: () => void;
}

const StoreManagement: React.FC<StoreManagementProps> = ({ stores, onToggleStatus, onViolation, onOpenConfig, onAddStore }) => {
  
  const handleDeleteStore = (id: string, name: string) => {
    if (confirm(`PERINGATAN KRITIS: Hapus Node Toko "${name}" selamanya? Seluruh katalog produk dan data operasional lokal akan ikut terhapus secara permanen.`)) {
      StoreService.deleteStore(id);
      window.location.reload();
    }
  };

  const handleToggle = (id: string, status: string, name: string) => {
    const action = status === 'active' ? 'MENONAKTIFKAN' : 'MENGAKTIFKAN';
    if (confirm(`Konfirmasi untuk ${action} operasional Toko "${name}"?`)) {
      onToggleStatus(id, status);
    }
  };

  const handleAddViolation = (id: string, name: string) => {
    if (confirm(`Catat pelanggaran operasional untuk Toko "${name}"? Skor performa toko akan menurun secara otomatis.`)) {
      onViolation(id);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-xl font-black text-white uppercase tracking-widest">Store Node Matrix</h2>
         <button 
           onClick={onAddStore}
           className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
         >
           <ICONS.Plus className="w-4 h-4" /> Tambah Store Node
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span className="text-[9px] font-black">{store.violationCount} PELANGGARAN</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">{store.name}</h3>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1 uppercase">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {store.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
               <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Limit Produk</p>
                  <p className="text-lg font-black text-white">{store.productLimit}</p>
               </div>
               <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Limit Staf</p>
                  <p className="text-lg font-black text-white">{store.staffLimit}</p>
               </div>
            </div>

            <div className="mt-auto space-y-2">
               <button 
                 onClick={() => onOpenConfig(store)}
                 className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl"
               >
                  Manajemen Node
               </button>
               <div className="flex gap-2">
                  <button onClick={() => handleToggle(store.id, store.status, store.name)} className={`flex-1 py-2 text-white text-[9px] font-black uppercase rounded-lg border transition-all ${store.status === 'active' ? 'bg-slate-800 hover:bg-rose-600 border-slate-700 hover:border-rose-500' : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500'}`}>
                    {store.status === 'active' ? 'Suspen' : 'Aktifkan'}
                  </button>
                  <button onClick={() => handleAddViolation(store.id, store.name)} className="p-2 bg-amber-600/10 text-amber-500 hover:bg-amber-600 hover:text-white rounded-lg transition-all" title="Tambah Pelanggaran">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </button>
                  <button onClick={() => handleDeleteStore(store.id, store.name)} className="p-2 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-lg transition-all" title="Hapus Node">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreManagement;
