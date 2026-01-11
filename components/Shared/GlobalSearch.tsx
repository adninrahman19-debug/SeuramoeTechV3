import React, { useEffect, useState } from 'react';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      const input = document.getElementById('global-search-input');
      input?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-800 flex items-center gap-4">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            id="global-search-input"
            type="text" 
            placeholder="Cari owner, toko, atau menu... (ESC untuk keluar)"
            className="flex-1 bg-transparent border-none outline-none text-white text-lg font-medium placeholder:text-slate-600"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.length === 0 ? (
            <div className="p-4 space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Recent Searches</p>
              <div className="space-y-1">
                {['Financial Reports', 'Aceh Tech Center', 'Subscription Tiers'].map(item => (
                  <button key={item} className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl text-left transition-colors">
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-sm text-slate-300 font-semibold">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500 italic py-10">
              Searching for "{query}"...
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
           <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↵</kbd> Select
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">↑↓</kbd> Navigate
              </div>
           </div>
           <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Seuramoe Command</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;