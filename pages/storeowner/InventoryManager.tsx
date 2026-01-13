
import React, { useState, useEffect } from 'react';
import InventoryService from '../../services/InventoryService';
import { Product, ProductStatus, StockHistory } from '../../types';
import { ICONS } from '../../constants';
import RightDrawer from '../../components/Shared/RightDrawer';
import AuthService from '../../auth/AuthService';

const InventoryManager: React.FC = () => {
  const [activeView, setActiveView] = useState<'catalog' | 'history'>('catalog');
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');
  
  const [selectedProduct, setSelectedProduct] = useState<Partial<Product> | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStockAdjustOpen, setIsStockAdjustOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);

  const user = AuthService.getCurrentUser();
  const storeId = user?.storeId || 's1';

  useEffect(() => {
    loadData();
    window.addEventListener('inventory-updated', loadData);
    return () => window.removeEventListener('inventory-updated', loadData);
  }, [storeId]);

  const loadData = () => {
    setProducts(InventoryService.getProducts(storeId));
    setHistory(InventoryService.getStockHistory(storeId));
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'ALL' || p.category === filterCat;
    return matchesSearch && matchesCat;
  });

  const handleCreate = () => {
    setSelectedProduct({
      name: '',
      price: 0,
      category: 'Laptops',
      status: ProductStatus.ACTIVE,
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200',
      images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200'],
      description: '',
      isSponsored: false,
      sku: 'SKU-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      barcode: '',
      stock: 0,
      lowStockThreshold: 5,
      storeId: storeId,
      storeName: 'Aceh Tech Center'
    });
    setIsDrawerOpen(true);
  };

  const handleEdit = (p: Product) => {
    setSelectedProduct({ ...p });
    setIsDrawerOpen(true);
  };

  const handleAdjustStock = (p: Product) => {
    setSelectedProduct({ ...p });
    setAdjustAmount(0);
    setIsStockAdjustOpen(true);
  };

  const handleDelete = (p: Product) => {
    if (confirm(`Hapus permanen produk "${p.name}" dari katalog toko?`)) {
      InventoryService.deleteProduct(p.id);
    }
  };

  const handleSave = () => {
    if (selectedProduct && selectedProduct.name && selectedProduct.price) {
      if (selectedProduct.id) {
        InventoryService.updateProduct(selectedProduct.id, selectedProduct);
      } else {
        InventoryService.addProduct(selectedProduct as Product);
      }
      setIsDrawerOpen(false);
    } else {
      alert("Lengkapi field wajib.");
    }
  };

  const commitStockAdjust = () => {
    if (selectedProduct?.id && adjustAmount !== 0) {
      InventoryService.adjustStock(selectedProduct.id, adjustAmount, 'Penyesuaian Manual', user?.fullName || 'Owner');
      setIsStockAdjustOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      {/* Modals & Drawers */}
      {isStockAdjustOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsStockAdjustOpen(false)}></div>
           <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Stock Correction</h3>
              <p className="text-xs text-slate-500 mb-6 font-bold truncate uppercase">{selectedProduct.name}</p>
              <div className="flex items-center justify-center gap-8 py-8 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
                 <button onClick={() => setAdjustAmount(a => a - 1)} className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-rose-600 transition-colors text-xl font-bold">-</button>
                 <div className="text-center">
                    <p className={`text-4xl font-black ${adjustAmount > 0 ? 'text-emerald-500' : adjustAmount < 0 ? 'text-rose-500' : 'text-white'}`}>{adjustAmount > 0 ? '+' : ''}{adjustAmount}</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Qty Shift</p>
                 </div>
                 <button onClick={() => setAdjustAmount(a => a + 1)} className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors text-xl font-bold">+</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <button onClick={() => setIsStockAdjustOpen(false)} className="py-3 bg-slate-800 text-slate-400 font-black rounded-xl text-[10px] uppercase tracking-widest">Batal</button>
                 <button onClick={commitStockAdjust} className="py-3 bg-indigo-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-indigo-500">Update Stok</button>
              </div>
           </div>
        </div>
      )}

      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={selectedProduct?.id ? "Edit Katalog Unit" : "Tambah Katalog Baru"}>
        {selectedProduct && (
          <div className="space-y-6">
            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Unit Teknologi</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={selectedProduct.name} onChange={e => setSelectedProduct({...selectedProduct, name: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SKU Node</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={selectedProduct.sku} onChange={e => setSelectedProduct({...selectedProduct, sku: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategori</label>
                    <select className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none" value={selectedProduct.category} onChange={e => setSelectedProduct({...selectedProduct, category: e.target.value})}>
                      <option>Laptops</option><option>Smartphones</option><option>Accessories</option><option>Spareparts</option>
                    </select>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Harga Jual (Rp)</label>
                    <input type="number" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={selectedProduct.price} onChange={e => setSelectedProduct({...selectedProduct, price: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stok Awal</label>
                    <input type="number" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={selectedProduct.stock} onChange={e => setSelectedProduct({...selectedProduct, stock: parseInt(e.target.value)})} />
                  </div>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deskripsi Marketplace</label>
                  <textarea rows={4} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 text-sm" value={selectedProduct.description} onChange={e => setSelectedProduct({...selectedProduct, description: e.target.value})}></textarea>
               </div>
            </div>
            <button onClick={handleSave} className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs rounded-2xl hover:bg-indigo-500 shadow-xl">Simpan Unit Ke Katalog</button>
          </div>
        )}
      </RightDrawer>

      {/* Main UI */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
           <button onClick={() => setActiveView('catalog')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'catalog' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Katalog Node</button>
           <button onClick={() => setActiveView('history')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Log Inventaris</button>
        </div>
        <button onClick={handleCreate} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl flex items-center gap-2">
           <ICONS.Plus className="w-4 h-4" /> Tambah Unit Baru
        </button>
      </div>

      {activeView === 'catalog' ? (
        <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex items-center gap-4 bg-slate-900/30">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
              <input type="text" placeholder="Cari unit atau SKU..." className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                  <th className="px-6 py-5">Produk Node</th><th className="px-6 py-5">Kategori</th><th className="px-6 py-5 text-center">Stok</th><th className="px-6 py-5">Harga</th><th className="px-6 py-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/20 group transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                         <img src={p.thumbnail} className="w-10 h-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                         <div><p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{p.name}</p><p className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase">{p.sku}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded">{p.category}</span></td>
                    <td className="px-6 py-4 text-center"><span className={`text-lg font-black ${p.stock <= p.lowStockThreshold ? 'text-rose-500 animate-pulse' : 'text-white'}`}>{p.stock}</span></td>
                    <td className="px-6 py-4"><p className="text-sm font-black text-emerald-400">Rp {p.price.toLocaleString()}</p></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleAdjustStock(p)} className="p-2 bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-lg transition-all" title="Update Stok"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 11l5-5m0 0l5 5m-5-5v12" strokeWidth={2}/></svg></button>
                        <button onClick={() => handleEdit(p)} className="p-2 bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-all"><ICONS.Settings className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p)} className="p-2 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-lg transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                       <th className="px-6 py-5">Waktu Event</th><th className="px-6 py-5">Unit Produk</th><th className="px-6 py-5 text-center">Flow</th><th className="px-6 py-5">Alasan Perubahan</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                    {history.map(ev => (
                       <tr key={ev.id} className="hover:bg-slate-800/20 group transition-all font-mono">
                          <td className="px-6 py-4"><p className="text-[10px] text-slate-300">{new Date(ev.timestamp).toLocaleString()}</p></td>
                          <td className="px-6 py-4"><p className="text-xs font-bold text-white font-sans">{ev.productName}</p></td>
                          <td className="px-6 py-4 text-center"><span className={`px-2 py-0.5 rounded text-[10px] font-black ${ev.type === 'IN' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{ev.type === 'IN' ? '+' : '-'}{ev.quantity}</span></td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-sans italic">"{ev.reason}"</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
