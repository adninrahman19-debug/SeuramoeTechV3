import React, { useState, useEffect } from 'react';
import Logo from '../components/Shared/Logo';
import InventoryService from '../services/InventoryService';
import { Product, ProductStatus } from '../types';
import { ICONS } from '../constants';

interface GuestMarketplaceProps {
  onBackToLanding: () => void;
  onAuthRequired: () => void;
}

const GuestMarketplace: React.FC<GuestMarketplaceProps> = ({ onBackToLanding, onAuthRequired }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Mengambil data dari store utama (s1) sebagai sampel marketplace publik
    const data = InventoryService.getProducts('s1').filter(p => p.status === ProductStatus.ACTIVE);
    setProducts(data);
  }, []);

  const categories = ['All', 'Laptops', 'Smartphones', 'Accessories', 'Spareparts'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300">
      {/* Guest Marketplace Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={onBackToLanding} className="p-2 hover:bg-slate-900 rounded-xl text-slate-500 hover:text-white transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-[10px] font-black text-slate-600 uppercase tracking-widest mr-4">Guest Node Mode</span>
            <button onClick={onAuthRequired} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all">Login / Daftar</button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 space-y-12">
        {/* Marketplace Hero & Search */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Sumatra <span className="text-indigo-500 text-glow">Mall</span></h1>
          <p className="text-slate-400 text-sm font-medium">Temukan teknologi terbaik dari seluruh jaringan toko SeuramoeTech di Aceh & Sumatra Utara.</p>
          
          <div className="relative group mt-10">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl group-hover:bg-indigo-500/30 transition-all"></div>
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-2 shadow-2xl">
              <div className="p-3 text-slate-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg></div>
              <input 
                type="text" 
                placeholder="Cari perangkat atau spesifikasi (contoh: RTX 4060)..."
                className="flex-1 bg-transparent border-none outline-none text-white text-sm py-2"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar pb-4">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(p => (
            <div key={p.id} className="glass-panel rounded-[2.5rem] border-slate-800 hover:border-indigo-500/40 transition-all group flex flex-col overflow-hidden shadow-2xl">
              <div className="aspect-square relative overflow-hidden bg-slate-950">
                <img src={p.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt={p.name} />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur text-white text-[8px] font-black px-2 py-1 rounded border border-white/10 uppercase tracking-widest">Global Node</div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-2">{p.category}</p>
                <h3 className="text-base font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">{p.name}</h3>
                
                <div className="mt-auto pt-6 border-t border-slate-800 flex flex-col gap-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Harga Regional</p>
                      <p className="text-xl font-black text-emerald-400">Rp {p.price.toLocaleString()}</p>
                    </div>
                    <span className="text-[8px] font-black text-slate-600 uppercase">Ready Stock</span>
                  </div>
                  
                  <button 
                    onClick={onAuthRequired}
                    className="w-full py-4 bg-slate-900 border border-slate-800 hover:bg-indigo-600 hover:border-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={3}/></svg>
                    Beli Sekarang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-32 text-center space-y-4">
            <p className="text-slate-600 font-bold uppercase tracking-[0.3em]">No items found in this sector</p>
            <button onClick={() => {setSearch(''); setActiveCategory('All');}} className="text-indigo-400 font-black text-xs uppercase underline">Clear all filters</button>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-white/5 bg-slate-950/50 text-center">
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">SeuramoeTech Sumatra Public Marketplace • Node mode: GUEST_READ_ONLY</p>
      </footer>
    </div>
  );
};

export default GuestMarketplace;