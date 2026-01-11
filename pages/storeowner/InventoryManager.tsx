
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
  
  // Edit State
  const [selectedProduct, setSelectedProduct] = useState<Partial<Product> | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStockAdjustOpen, setIsStockAdjustOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);

  const user = AuthService.getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProducts(InventoryService.getProducts('s1'));
    setHistory(InventoryService.getStockHistory('s1'));
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase()) ||
                          p.barcode.includes(search);
    const matchesCat = filterCat === 'ALL' || p.category === filterCat;
    return matchesSearch && matchesCat;
  });

  const handleCreate = () => {
    setSelectedProduct({
      name: '',
      price: 0,
      promoPrice: undefined,
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
      storeId: 's1',
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

  const commitStockAdjust = () => {
    if (selectedProduct?.id && adjustAmount !== 0) {
      InventoryService.adjustStock(
        selectedProduct.id, 
        adjustAmount, 
        'Manual Inventory Correction', 
        user?.fullName || 'Owner'
      );
      setIsStockAdjustOpen(false);
      loadData();
    }
  };

  const handleSave = () => {
    if (selectedProduct) {
      if (selectedProduct.id) {
        InventoryService.updateProduct(selectedProduct.id, selectedProduct);
      } else {
        InventoryService.addProduct(selectedProduct as Product);
      }
      setIsDrawerOpen(false);
      loadData();
    }
  };

  const toggleStatus = (id: string, current: ProductStatus) => {
    const nextStatus = current === ProductStatus.ACTIVE ? ProductStatus.INACTIVE : ProductStatus.ACTIVE;
    InventoryService.updateProduct(id, { status: nextStatus });
    loadData();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      {/* Stock Adjust Modal */}
      {isStockAdjustOpen && selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsStockAdjustOpen(false)}></div>
           <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
              <h3 className="text-xl font-bold text-white mb-2">Update Inventory</h3>
              <p className="text-xs text-slate-500 mb-6 uppercase font-bold tracking-widest">{selectedProduct.name}</p>
              
              <div className="flex items-center justify-center gap-8 py-8 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
                 <button onClick={() => setAdjustAmount(a => a - 1)} className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-rose-600 transition-colors text-xl font-bold">-</button>
                 <div className="text-center">
                    <p className={`text-4xl font-black ${adjustAmount > 0 ? 'text-emerald-500' : adjustAmount < 0 ? 'text-rose-500' : 'text-white'}`}>
                      {adjustAmount > 0 ? '+' : ''}{adjustAmount}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Adjust Quantity</p>
                 </div>
                 <button onClick={() => setAdjustAmount(a => a + 1)} className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors text-xl font-bold">+</button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <button onClick={() => setIsStockAdjustOpen(false)} className="py-3 bg-slate-800 text-slate-400 font-black rounded-xl text-[10px] uppercase tracking-widest">Cancel</button>
                 <button onClick={commitStockAdjust} className="py-3 bg-indigo-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-indigo-500 shadow-xl shadow-indigo-600/20">Sync Stock</button>
              </div>
           </div>
        </div>
      )}

      {/* Main Editor Drawer */}
      <RightDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title={selectedProduct?.id ? "Edit Master Catalog" : "Add New Product"}
      >
        {selectedProduct && (
          <div className="space-y-8">
            <div className="aspect-video rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 relative group">
               <img src={selectedProduct.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="" />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-lg">Change Cover</button>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Product Display Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={selectedProduct.name}
                    onChange={e => setSelectedProduct({...selectedProduct, name: e.target.value})}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Internal SKU</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-indigo-500" 
                      value={selectedProduct.sku}
                      onChange={e => setSelectedProduct({...selectedProduct, sku: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EAN / Barcode</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-indigo-500" 
                      value={selectedProduct.barcode}
                      placeholder="Scanned value..."
                      onChange={e => setSelectedProduct({...selectedProduct, barcode: e.target.value})}
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Price (IDR)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                      value={selectedProduct.price}
                      onChange={e => setSelectedProduct({...selectedProduct, price: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Promo Price (Optional)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none border-rose-500/20" 
                      value={selectedProduct.promoPrice || ''}
                      placeholder="Flash sale price..."
                      onChange={e => setSelectedProduct({...selectedProduct, promoPrice: e.target.value ? parseInt(e.target.value) : undefined})}
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Initial Stock</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" 
                      value={selectedProduct.stock}
                      onChange={e => setSelectedProduct({...selectedProduct, stock: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Low Alert Threshold</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none border-amber-500/20" 
                      value={selectedProduct.lowStockThreshold}
                      onChange={e => setSelectedProduct({...selectedProduct, lowStockThreshold: parseInt(e.target.value)})}
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detailed Specifications</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none custom-scrollbar" 
                    value={selectedProduct.description}
                    placeholder="Enter detailed technical specs..."
                    onChange={e => setSelectedProduct({...selectedProduct, description: e.target.value})}
                  ></textarea>
               </div>
            </div>

            <div className="flex gap-2 pt-6">
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white"
              >
                Discard Changes
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] py-4 bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20"
              >
                Apply to Master Catalog
              </button>
            </div>
          </div>
        )}
      </RightDrawer>

      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div className="space-y-4 w-full lg:w-auto">
           <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
              <button 
                onClick={() => setActiveView('catalog')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'catalog' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
              >
                Master Catalog
              </button>
              <button 
                onClick={() => setActiveView('history')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
              >
                Stock History
              </button>
           </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end w-full lg:w-auto">
           <button 
            onClick={() => alert('Simulating Inventory Export...')}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
           >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2}/></svg>
              Export CSV
           </button>
           <button 
            onClick={() => alert('Simulating Bulk Import...')}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
           >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth={2}/></svg>
              Bulk Import
           </button>
           <button 
             onClick={handleCreate}
             className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
           >
             <ICONS.Plus className="w-4 h-4" /> New SKU
           </button>
        </div>
      </div>

      {activeView === 'catalog' ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
              <input 
                type="text" 
                placeholder="Search catalog by name, SKU or brand..." 
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <select 
                className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none min-w-[150px]"
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
              >
                  <option value="ALL">All Categories</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Smartphones">Smartphones</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Spareparts">Spareparts</option>
              </select>
            </div>
          </div>

          <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                        <th className="px-6 py-5">Product Master</th>
                        <th className="px-6 py-5">Status</th>
                        <th className="px-6 py-5 text-center">In Stock</th>
                        <th className="px-6 py-5">Pricing</th>
                        <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filtered.map(p => (
                        <tr key={p.id} className="hover:bg-slate-800/20 group transition-all">
                          <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <img src={p.thumbnail} className="w-14 h-14 rounded-2xl object-cover bg-slate-950 border border-slate-800" alt="" />
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{p.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <p className="text-[9px] text-slate-500 font-mono tracking-tighter">SKU: {p.sku}</p>
                                      <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                                      <p className="text-[9px] text-slate-500 font-black uppercase">{p.category}</p>
                                    </div>
                                </div>
                              </div>
                          </td>
                          <td className="px-6 py-5">
                             <button 
                              onClick={() => toggleStatus(p.id, p.status)}
                              className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${
                                p.status === ProductStatus.ACTIVE ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700'
                              }`}
                             >
                               {p.status === ProductStatus.ACTIVE ? 'ACTIVE' : 'OFF-SHELF'}
                             </button>
                          </td>
                          <td className="px-6 py-5 text-center">
                              <div className="flex flex-col items-center">
                                 <div className={`text-lg font-black ${p.stock <= p.lowStockThreshold ? 'text-rose-500' : 'text-white'}`}>
                                    {p.stock}
                                 </div>
                                 {p.stock <= p.lowStockThreshold && (
                                   <span className="text-[8px] font-black text-rose-400 uppercase animate-pulse">Critical Level</span>
                                 )}
                              </div>
                          </td>
                          <td className="px-6 py-5">
                              <div className="space-y-0.5">
                                 {p.promoPrice ? (
                                   <>
                                     <p className="text-xs text-slate-500 line-through">Rp {p.price.toLocaleString()}</p>
                                     <p className="text-sm font-black text-rose-500">Rp {p.promoPrice.toLocaleString()}</p>
                                   </>
                                 ) : (
                                   <p className="text-sm font-black text-white">Rp {p.price.toLocaleString()}</p>
                                 )}
                              </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleAdjustStock(p)}
                                  className="p-2.5 bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-xl transition-all"
                                  title="Adjust Stock Level"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 11l5-5m0 0l5 5m-5-5v12" strokeWidth={2}/></svg>
                                </button>
                                <button 
                                  onClick={() => handleEdit(p)}
                                  className="p-2.5 bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-xl transition-all"
                                >
                                  <ICONS.Settings className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => { if(confirm('Permanently delete product?')) InventoryService.deleteProduct(p.id); loadData(); }}
                                  className="p-2.5 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="p-20 text-center text-slate-600 italic">Catalog node is empty or search filters yielded zero matches.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
           <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                          <th className="px-6 py-5">Event Timeline</th>
                          <th className="px-6 py-5">Affected Product</th>
                          <th className="px-6 py-5 text-center">Flow</th>
                          <th className="px-6 py-5">Audit Context</th>
                          <th className="px-6 py-5 text-right">User Agent</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                       {history.length === 0 ? (
                         <tr><td colSpan={5} className="p-20 text-center text-slate-600 italic">No inventory movement recorded in this ledger period.</td></tr>
                       ) : history.map(ev => (
                         <tr key={ev.id} className="hover:bg-slate-800/20 group transition-all font-mono">
                            <td className="px-6 py-4">
                               <p className="text-xs text-slate-300 font-bold">{new Date(ev.timestamp).toLocaleTimeString()}</p>
                               <p className="text-[9px] text-slate-600 mt-1">{new Date(ev.timestamp).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-4">
                               <p className="text-sm font-black text-white font-sans">{ev.productName}</p>
                               <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">ID: {ev.productId}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <span className={`px-2 py-1 rounded text-[10px] font-black ${
                                 ev.type === 'IN' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                               }`}>
                                 {ev.type === 'IN' ? '+' : '-'}{ev.quantity}
                               </span>
                            </td>
                            <td className="px-6 py-4">
                               <p className="text-xs text-slate-400 font-sans italic">"{ev.reason}"</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <p className="text-xs font-bold text-white font-sans">{ev.user}</p>
                               <p className="text-[10px] text-slate-600 uppercase font-black">Authorized Role</p>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
