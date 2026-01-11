import React, { useState, useEffect } from 'react';
import InventoryService from '../../services/InventoryService';
import CartService from '../../services/CartService';
import { Product, ProductStatus } from '../../types';
import { ICONS } from '../../constants';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState<number>(50000000);
  const [compareList, setCompareList] = useState<Product[]>([]);
  
  // Detail Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const data = InventoryService.getProducts('s1').filter(p => p.status === ProductStatus.ACTIVE);
    setProducts(data);
  }, []);

  const categories = ['All', 'Laptops', 'Smartphones', 'Accessories', 'Spareparts'];
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesPrice = p.price <= priceFilter;
    return matchesSearch && matchesCat && matchesPrice;
  });

  const toggleCompare = (p: Product) => {
    if (compareList.find(item => item.id === p.id)) {
      setCompareList(compareList.filter(item => item.id !== p.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, p]);
    } else {
      alert("Maksimal 3 produk untuk dibandingkan.");
    }
  };

  const handleAddToCart = (p: Product) => {
    CartService.addToCart(p);
    alert(`${p.name} ditambahkan ke keranjang!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* 1. Enhanced Search & Filter Bar */}
      <div className="glass-panel p-6 rounded-[2rem] border-slate-800 shadow-xl flex flex-col md:flex-row gap-6 items-center">
         <div className="relative flex-1 w-full">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
            <input 
              type="text" 
              placeholder="Cari model laptop, spesifikasi (RTX, M2, dll)..."
              className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-48">
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Max Price: Rp {(priceFilter/1000000).toFixed(0)}M</p>
               <input 
                 type="range" 
                 min="500000" 
                 max="50000000" 
                 step="500000"
                 value={priceFilter}
                 onChange={e => setPriceFilter(parseInt(e.target.value))}
                 className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
               />
            </div>
         </div>
      </div>

      {/* 2. Category Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
         {categories.map(cat => (
           <button 
             key={cat}
             onClick={() => setActiveCategory(cat)}
             className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
               activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white hover:bg-slate-800'
             }`}
           >
             {cat}
           </button>
         ))}
      </div>

      {/* 3. Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {filteredProducts.map(p => (
           <div key={p.id} className="glass-panel rounded-[2rem] border-slate-800 hover:border-indigo-500/40 transition-all group flex flex-col overflow-hidden shadow-2xl relative">
              {/* Compare Checkbox Overlay */}
              <button 
                onClick={() => toggleCompare(p)}
                className={`absolute top-4 right-4 z-10 p-2 rounded-xl border transition-all ${
                  compareList.find(i => i.id === p.id) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950/60 backdrop-blur-md border-slate-700 text-slate-400 opacity-0 group-hover:opacity-100'
                }`}
                title="Bandingkan"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth={2}/></svg>
              </button>

              <div className="aspect-[4/3] relative overflow-hidden bg-slate-950 cursor-pointer" onClick={() => setSelectedProduct(p)}>
                 <img src={p.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt="" />
                 {p.promoPrice && (
                    <div className="absolute top-4 left-4 bg-rose-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">Hot Deal</div>
                 )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                 <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">{p.category}</p>
                 <h4 className="text-lg font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => setSelectedProduct(p)}>{p.name}</h4>
                 
                 <div className="mt-auto pt-4 border-t border-slate-800/50">
                    <div className="flex justify-between items-end mb-6">
                       <div>
                          {p.promoPrice ? (
                             <>
                                <p className="text-[10px] text-slate-500 line-through">Rp {p.price.toLocaleString()}</p>
                                <p className="text-xl font-black text-white">Rp {p.promoPrice.toLocaleString()}</p>
                             </>
                          ) : (
                             <p className="text-xl font-black text-white">Rp {p.price.toLocaleString()}</p>
                          )}
                       </div>
                       <p className="text-[10px] font-bold text-slate-600 uppercase">Sisa: {p.stock}</p>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(p)}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
                    >
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={3}/></svg>
                       Add to Cart
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* 4. Comparison Bar (Floating) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-2xl bg-indigo-600 rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-6 animate-in slide-in-from-bottom-10">
           <div className="flex gap-3">
              {compareList.map(item => (
                <div key={item.id} className="relative w-12 h-12 rounded-xl bg-white/20 overflow-hidden border border-white/30">
                   <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
                   <button onClick={() => toggleCompare(item)} className="absolute top-0 right-0 bg-rose-600 text-white rounded-bl-lg p-0.5"><svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3}/></svg></button>
                </div>
              ))}
              {compareList.length < 3 && <div className="w-12 h-12 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center text-white/40 text-xs font-black">+</div>}
           </div>
           <div className="flex items-center gap-4">
              <span className="text-white text-[10px] font-black uppercase tracking-widest hidden sm:block">{compareList.length} Item Terpilih</span>
              <button className="px-6 py-2 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all shadow-lg">Bandingkan Sekarang</button>
           </div>
        </div>
      )}

      {/* 5. Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelectedProduct(null)}></div>
           <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 z-10 p-3 bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all shadow-xl">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
              </button>

              <div className="md:w-1/2 bg-slate-950 p-8 flex items-center justify-center relative">
                 <img src={selectedProduct.thumbnail} className="max-w-full max-h-[400px] object-contain" alt="" />
                 <div className="absolute bottom-8 left-8 flex gap-2">
                    {selectedProduct.images.map((img, i) => (
                      <div key={i} className="w-16 h-16 rounded-xl border border-slate-800 overflow-hidden opacity-50 hover:opacity-100 transition-all cursor-pointer">
                         <img src={img} className="w-full h-full object-cover" alt="" />
                      </div>
                    ))}
                 </div>
              </div>

              <div className="md:w-1/2 p-10 overflow-y-auto custom-scrollbar">
                 <div className="mb-10">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3">Produk Detail • Node Aceh</p>
                    <h2 className="text-3xl font-black text-white tracking-tight leading-tight mb-4">{selectedProduct.name}</h2>
                    <div className="flex items-center gap-6">
                       <p className="text-2xl font-black text-emerald-400">Rp {(selectedProduct.promoPrice || selectedProduct.price).toLocaleString()}</p>
                       <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-slate-700">Stok: {selectedProduct.stock}</span>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-4">
                       <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deskripsi & Spesifikasi</h5>
                       <p className="text-sm text-slate-400 leading-relaxed italic">"{selectedProduct.description}"</p>
                       <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                             <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">SKU Node</p>
                             <p className="text-xs font-mono text-white">{selectedProduct.sku}</p>
                          </div>
                          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                             <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Garansi Regional</p>
                             <p className="text-xs text-white">12 Bulan SeuramoeTech</p>
                          </div>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex gap-4">
                       <button 
                         onClick={() => handleAddToCart(selectedProduct)}
                         className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3"
                       >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth={2}/></svg>
                          Beli Sekarang
                       </button>
                       <button className="p-5 bg-slate-800 text-slate-400 hover:text-white rounded-2xl border border-slate-700 transition-all">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth={2}/></svg>
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;