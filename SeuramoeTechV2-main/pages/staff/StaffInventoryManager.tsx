
import React, { useState, useEffect } from 'react';
import InventoryService from '../../services/InventoryService';
import { Product, ProductStatus, StockHistory, UserRole } from '../../types';
import { ICONS } from '../../constants';
import RightDrawer from '../../components/Shared/RightDrawer';
import AuthService from '../../auth/AuthService';

const StaffInventoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'history' | 'critical'>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [search, setSearch] = useState('');
  
  // States for Stock Adjustment
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustReason, setAdjustReason] = useState('Barang Masuk');

  // States for Product Form (Izin Owner)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const user = AuthService.getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Mock storeId 's1'
    const data = InventoryService.getProducts('s1');
    setProducts(data);
    setHistory(InventoryService.getStockHistory('s1'));
  };

  const criticalProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdjustStock = (p: Product) => {
    setSelectedProduct(p);
    setAdjustAmount(0);
    setIsAdjustOpen(true);
  };

  const commitAdjustment = () => {
    if (selectedProduct && adjustAmount !== 0) {
      InventoryService.adjustStock(
        selectedProduct.id,
        adjustAmount,
        adjustReason,
        user?.fullName || 'Staff Admin'
      );
      setIsAdjustOpen(false);
      loadData();
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      category: 'Laptops',
      status: ProductStatus.UNDER_REVIEW, // Need owner approval
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200',
      stock: 0,
      lowStockThreshold: 5,
      storeId: 's1'
    });
    setIsFormOpen(true);
  };

  const handleSaveProduct = () => {
    if (formData.name) {
      InventoryService.addProduct(formData as Product);
      alert("Produk telah diajukan. Status: UNDER REVIEW (Menunggu Izin Owner)");
      setIsFormOpen(false);
      loadData();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      {/* 1. Header & Quick Alerts */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
           <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Katalog Stok</button>
           <button onClick={() => setActiveTab('history')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Riwayat Log</button>
           <button onClick={() => setActiveTab('critical')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'critical' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>
              Stok Kritis
              {criticalProducts.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full animate-bounce border-2 border-slate-950">{criticalProducts.length}</span>}
           </button>
        </div>

        <div className="flex gap-2">
           <button onClick={handleOpenCreate} className="px-6 py-2.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2">
              <ICONS.Plus className="w-4 h-4" /> Tambah Produk (Izin Owner)
           </button>
        </div>
      </div>

      {/* 2. Modals */}
      <RightDrawer isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} title="Update Level Stok">
         {selectedProduct && (
           <div className="space-y-8">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{selectedProduct.sku}</p>
                 <h4 className="text-white font-bold">{selectedProduct.name}</h4>
                 <p className="text-xs text-slate-500 mt-2 font-medium">Stok Saat Ini: <span className="text-white">{selectedProduct.stock} Unit</span></p>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Jumlah Penyesuaian</label>
                 <div className="flex items-center gap-4">
                    <button onClick={() => setAdjustAmount(a => a - 1)} className="w-12 h-12 rounded-xl bg-slate-800 text-white text-xl font-bold hover:bg-rose-600">-</button>
                    <input 
                      type="number" 
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-3 text-center text-xl font-black text-white outline-none"
                      value={adjustAmount}
                      onChange={e => setAdjustAmount(parseInt(e.target.value) || 0)}
                    />
                    <button onClick={() => setAdjustAmount(a => a + 1)} className="w-12 h-12 rounded-xl bg-slate-800 text-white text-xl font-bold hover:bg-emerald-600">+</button>
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alasan Perubahan</label>
                 <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm outline-none appearance-none"
                    value={adjustReason}
                    onChange={e => setAdjustReason(e.target.value)}
                 >
                    <option>Barang Masuk (Restock)</option>
                    <option>Penjualan Offline</option>
                    <option>Barang Rusak/Cacat</option>
                    <option>Retur Pelanggan</option>
                    <option>Koreksi Audit Stok</option>
                 </select>
              </div>

              <button 
                onClick={commitAdjustment}
                className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20"
              >
                 Konfirmasi Update Stok
              </button>
           </div>
         )}
      </RightDrawer>

      {/* 3. Tables/Views */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
           <div className="relative w-full max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
              <input 
                type="text" 
                placeholder="Cari SKU atau Nama Produk..." 
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>

           <div className="glass-panel rounded-[2rem] border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                          <th className="px-6 py-5">Produk & SKU</th>
                          <th className="px-6 py-5">Kategori</th>
                          <th className="px-6 py-5">Status</th>
                          <th className="px-6 py-5 text-center">Stok</th>
                          <th className="px-6 py-5 text-right">Aksi Cepat</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                       {filteredProducts.map(p => (
                          <tr key={p.id} className="hover:bg-slate-800/20 group transition-all">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                   <img src={p.thumbnail} className="w-10 h-10 rounded-xl bg-slate-900 object-cover" alt="" />
                                   <div>
                                      <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{p.name}</p>
                                      <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">{p.sku}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.category}</span>
                             </td>
                             <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                   p.status === ProductStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                   p.status === ProductStatus.UNDER_REVIEW ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse' :
                                   'bg-slate-800 text-slate-500 border-slate-700'
                                }`}>{p.status.replace('_', ' ')}</span>
                             </td>
                             <td className="px-6 py-4 text-center">
                                <span className={`text-lg font-black ${p.stock <= p.lowStockThreshold ? 'text-rose-500' : 'text-white'}`}>{p.stock}</span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                   <button 
                                     onClick={() => handleAdjustStock(p)}
                                     className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 text-white text-[9px] font-black uppercase rounded-xl transition-all"
                                   >Update Stok</button>
                                   <button className="p-2 text-slate-500 hover:text-white transition-colors"><ICONS.Settings className="w-4 h-4" /></button>
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass-panel rounded-[2rem] border-slate-800 overflow-hidden shadow-2xl">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                       <th className="px-6 py-5">Waktu</th>
                       <th className="px-6 py-5">Produk</th>
                       <th className="px-6 py-5 text-center">Perubahan</th>
                       <th className="px-6 py-5">Alasan & Petugas</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                    {history.map(h => (
                       <tr key={h.id} className="hover:bg-slate-800/10 transition-all font-mono">
                          <td className="px-6 py-4">
                             <p className="text-[10px] text-slate-300 font-bold">{new Date(h.timestamp).toLocaleTimeString()}</p>
                             <p className="text-[8px] text-slate-600 mt-0.5">{new Date(h.timestamp).toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-4">
                             <p className="text-xs font-bold text-white font-sans">{h.productName}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                             <span className={`px-2 py-1 rounded text-[10px] font-black ${h.type === 'IN' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {h.type === 'IN' ? '+' : '-'}{h.quantity}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                             <p className="text-xs text-slate-400 font-sans italic">"{h.reason}"</p>
                             <p className="text-[9px] text-indigo-400 uppercase font-black mt-1 font-sans">Oleh: {h.user}</p>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'critical' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {criticalProducts.length === 0 ? (
             <div className="col-span-full p-20 glass-panel rounded-[2rem] border-slate-800 text-center">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-white font-bold uppercase tracking-widest">Stok Aman</h3>
                <p className="text-slate-500 text-xs mt-2">Tidak ada produk yang berada di bawah batas minimum.</p>
             </div>
           ) : criticalProducts.map(p => (
             <div key={p.id} className="glass-panel p-6 rounded-3xl border-rose-500/30 bg-rose-600/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                   <ICONS.Package className="w-20 h-20 text-rose-500" />
                </div>
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">STOK KRITIS</p>
                         <h4 className="text-lg font-bold text-white tracking-tight leading-tight">{p.name}</h4>
                      </div>
                      <span className="text-3xl font-black text-rose-500">{p.stock}</span>
                   </div>
                   <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
                      <div className="flex justify-between text-[10px] font-bold uppercase mb-2 text-slate-500">
                         <span>Batas Minimum</span>
                         <span>{p.lowStockThreshold} Units</span>
                      </div>
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                         <div className="h-full bg-rose-500" style={{ width: `${(p.stock / p.lowStockThreshold) * 100}%` }}></div>
                      </div>
                   </div>
                   <button 
                     onClick={() => handleAdjustStock(p)}
                     className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-600/20"
                   >
                     Segera Restock
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default StaffInventoryManager;
