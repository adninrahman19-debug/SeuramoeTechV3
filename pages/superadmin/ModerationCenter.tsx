
import React, { useState, useEffect } from 'react';
import ModerationService from '../../services/ModerationService';
import { Product, ProductStatus } from '../../types';
import { ICONS } from '../../constants';

const ModerationCenter: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<ProductStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProducts(ModerationService.getProducts());
  };

  const handleStatus = (id: string, status: ProductStatus) => {
    ModerationService.updateProductStatus(id, status);
    loadData();
    alert(`Product status updated to ${status}`);
  };

  const handlePriceCorrection = (id: string) => {
    const newPrice = prompt("Enter Correct Price (IDR):");
    if (newPrice) {
      ModerationService.forcePriceCorrection(id, parseInt(newPrice));
      loadData();
      alert("Price corrected and product moved to review.");
    }
  };

  const filtered = filter === 'ALL' ? products : products.filter(p => p.status === filter);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Product Oversight</h2>
          <p className="text-sm text-slate-500">Moderate global listings and maintain marketplace integrity.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={loadData} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
           </button>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        {(['ALL', ...Object.values(ProductStatus)] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="glass-panel p-6 rounded-3xl border-slate-800 flex flex-col lg:flex-row items-center gap-6 group hover:border-indigo-500/30 transition-all">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
              <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-white truncate">{product.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                  product.status === ProductStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400' :
                  product.status === ProductStatus.FLAGGED ? 'bg-rose-500/10 text-rose-400 animate-pulse' :
                  'bg-amber-500/10 text-amber-500'
                }`}>
                  {product.status}
                </span>
                {product.isSponsored && <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-indigo-500/20">Sponsored</span>}
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{product.storeName} • {product.category}</p>
              <p className="text-sm font-black text-indigo-400 mt-2">Rp {product.price.toLocaleString()}</p>
            </div>

            <div className="flex gap-2 w-full lg:w-auto">
               <button 
                 onClick={() => handlePriceCorrection(product.id)}
                 className="flex-1 lg:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase rounded-xl transition-all border border-slate-700"
               >
                 Price Correction
               </button>
               <button 
                 onClick={() => handleStatus(product.id, ProductStatus.FLAGGED)}
                 className="flex-1 lg:flex-none px-4 py-2.5 bg-rose-600/10 text-rose-500 border border-rose-600/20 hover:bg-rose-600 hover:text-white text-[10px] font-black uppercase rounded-xl transition-all"
               >
                 Flag Illegal
               </button>
               {product.status !== ProductStatus.ACTIVE && (
                 <button 
                   onClick={() => handleStatus(product.id, ProductStatus.ACTIVE)}
                   className="flex-1 lg:flex-none px-4 py-2.5 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-xl shadow-emerald-600/10"
                 >
                   Restore
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModerationCenter;
