
import React, { useState, useEffect } from 'react';
import InventoryService from '../../services/InventoryService';
import { Product, ProductStatus, StockHistory } from '../../types';
import { ICONS } from '../../constants';
import RightDrawer from '../../components/Shared/RightDrawer';
import AuthService from '../../auth/AuthService';

const StaffInventoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'history' | 'critical'>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [search, setSearch] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustReason, setAdjustReason] = useState('Barang Masuk');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const user = AuthService.getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = InventoryService.getProducts('s1');
    setProducts(data);
    setHistory(InventoryService.getStockHistory('s1'));
  };

  const criticalProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  const handleAdjustStock = (p: Product) => {
    setSelectedProduct(p);
    setAdjustAmount(0);
    setIsAdjustOpen(true);
  };

  const commitAdjustment = () => {
    if (selectedProduct && adjustAmount !== 0) {
      const typeText = adjustAmount > 0 ? "TAMBAH" : "KURANGI";
      if (confirm(`Konfirmasi untuk ${typeText} stok "${selectedProduct.name}" sebanyak ${Math.abs(adjustAmount)} unit? Perubahan ini akan dicatat dalam audit trail.`)) {
        InventoryService.adjustStock(selectedProduct.id, adjustAmount, adjustReason, user?.fullName || 'Staff Admin');
        setIsAdjustOpen(false);
        loadData();
        alert("Stok berhasil diperbarui.");
      }
    } else {
      alert("Masukkan nilai perubahan stok yang valid.");
    }
  };

  const handleOpenCreate = () => {
    setFormData({ 
      category: 'Laptops', 
      status: ProductStatus.UNDER_REVIEW, 
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200', 
      images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200'],
      description: '',
      stock: 0, 
      lowStockThreshold: 5, 
      storeId: 's1',
      sku: 'SKU-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      barcode: '',
      price: 0
    });
    setIsFormOpen(true);
  };

  const handleSaveProduct = () => {
    if (formData.name && formData.price && formData.price > 0) {
      if (confirm(`Ajukan produk "${formData.name}" ke Owner untuk disetujui masuk katalog LIVE?`)) {
        InventoryService.addProduct(formData as Product);
        alert("Proposal produk baru berhasil diajukan ke Owner.");
        setIsFormOpen(false);
        loadData();
      }
    } else {
      alert("Nama Produk dan Harga jual wajib diisi dengan benar.");
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
           <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Katalog Stok</button>
           <button onClick={() => setActiveTab('history')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Riwayat Log</button>
           <button onClick={() => setActiveTab('critical')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'critical' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Stok Kritis {criticalProducts.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full animate-bounce border-2 border-slate-950">{criticalProducts.length}</span>}</button>
        </div>
        <button onClick={handleOpenCreate} className="px-6 py-2.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white text-[10px] font-black uppercase rounded-xl transition-all flex items-center gap-2">
           <ICONS.Plus className="w-4 h-4" /> Ajukan Produk Baru
        </button>
      </div>

      <RightDrawer isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} title="Update Level Stok">
         {selectedProduct && (
           <div className="space-y-8">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                 <p className="text-[10px] font-black text-indigo-400 mb-1">{selectedProduct.sku}</p>
                 <h4 className="text-white font-bold">{selectedProduct.name}</h4>
                 <p className="text-xs text-slate-500 mt-2 font-medium">Stok Saat Ini: <span className="text-white">{selectedProduct.stock} Unit</span></p>
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Jumlah Perubahan (+/-)</label>
                 <div className="flex items-center gap-4">
                    <button onClick={() => setAdjustAmount(a => a - 1)} className="w-12 h-12 rounded-xl bg-slate-800 text-white text-xl hover:bg-rose-600 transition-colors">-</button>
                    <input type="number" className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-3 text-center text-xl font-black text-white" value={adjustAmount} onChange={e => setAdjustAmount(parseInt(e.target.value) || 0)} />
                    <button onClick={() => setAdjustAmount(a => a + 1)} className="w-12 h-12 rounded-xl bg-slate-800 text-white text-xl hover:bg-emerald-600 transition-colors">+</button>
                 </div>
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alasan</label>
                 <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm" value={adjustReason} onChange={e => setAdjustReason(e.target.value)}>
                    <option>Barang Masuk (Restock)</option>
                    <option>Penjualan Offline</option>
                    <option>Barang Rusak</option>
                    <option>Koreksi Audit</option>
                 </select>
              </div>
              <button onClick={commitAdjustment} className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-[10px] rounded-2xl hover:bg-indigo-500 shadow-xl transition-all">Konfirmasi Update Stok</button>
           </div>
         )}
      </RightDrawer>

      <RightDrawer isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Ajukan Katalog Baru">
         <div className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Produk</label>
               <input type="text" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Harga Jual (IDR)</label>
               <input type="number" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deskripsi Awal</label>
               <textarea className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
            <button onClick={handleSaveProduct} className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs rounded-2xl hover:bg-indigo-500 shadow-xl transition-all">Kirim Proposal Produk</button>
         </div>
      </RightDrawer>

      {activeTab === 'inventory' && (
        <div className="space-y-6">
           <div className="relative w-full max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
              <input type="text" placeholder="Cari SKU atau Nama Produk..." className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" value={search} onChange={e => setSearch(e.target.value)} />
           </div>
           <div className="glass-panel rounded-[2rem] border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                          <th className="px-6 py-5">Produk & SKU</th>
                          <th className="px-6 py-5">Kategori</th>
                          <th className="px-6 py-5 text-center">Stok</th>
                          <th className="px-6 py-5 text-right">Aksi Cepat</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                       {filteredProducts.map(p => (
                          <tr key={p.id} className="hover:bg-slate-800/20 group transition-all">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                   <img src={p.thumbnail} className="w-10 h-10 rounded-xl object-cover" alt="" />
                                   <div>
                                      <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{p.name}</p>
                                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{p.sku}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.category}</span></td>
                             <td className="px-6 py-4 text-center"><span className={`text-lg font-black ${p.stock <= p.lowStockThreshold ? 'text-rose-500' : 'text-white'}`}>{p.stock}</span></td>
                             <td className="px-6 py-4 text-right">
                                <button onClick={() => handleAdjustStock(p)} className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 text-white text-[9px] font-black uppercase rounded-xl transition-all">Update Stok</button>
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
                        <th className="px-6 py-5 text-center">Qty</th>
                        <th className="px-6 py-5">Oleh</th>
                        <th className="px-6 py-5">Alasan</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                     {history.map(h => (
                        <tr key={h.id} className="hover:bg-slate-800/20 transition-all font-mono">
                           <td className="px-6 py-4 text-[10px] text-slate-400">{new Date(h.timestamp).toLocaleString()}</td>
                           <td className="px-6 py-4 text-xs font-bold text-white">{h.productName}</td>
                           <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${h.type === 'IN' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                 {h.type === 'IN' ? '+' : '-'}{h.quantity}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-[10px] text-indigo-400">{h.user}</td>
                           <td className="px-6 py-4 text-[10px] text-slate-500 italic">"{h.reason}"</td>
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

export default StaffInventoryManager;
