import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants.tsx';
import InventoryService from '../../services/InventoryService.ts';
import StoreConfigService from '../../services/StoreConfigService.ts';
import AuthService from '../../auth/AuthService.ts';
import { Product, StoreConfig } from '../../types.ts';
import RightDrawer from '../../components/Shared/RightDrawer.tsx';

const MarketingContent: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const storeId = user?.storeId || 's1';
  
  const [activeSubTab, setActiveSubTab] = useState<'description' | 'copy' | 'visual' | 'brand'>('description');
  const [products, setProducts] = useState<Product[]>([]);
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setProducts(InventoryService.getProducts(storeId));
    setStoreConfig(StoreConfigService.getConfig(storeId));
  }, [storeId]);

  const handleEditDescription = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const generateAiCopy = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      alert("AI SeuramoeTech: Deskripsi produk telah dioptimasi dengan keyword 'Laptop Murah Aceh' dan 'Garansi Resmi Sumatra'.");
    }, 1500);
  };

  const copywritingTemplates = [
    { title: 'Promo Akhir Bulan (WA)', content: 'Halo rakan Tech! Promo gajian hadir lagi di Aceh Tech Center. Diskon s/d 20% untuk semua laptop gaming. Cek sekarang!' },
    { title: 'New Arrival (Instagram)', content: 'Ready Stock! Unit terbaru sudah mendarat di node Sumatra-01. Spek gahar, harga ramah kantong. Klik link di bio!' },
    { title: 'Service Flash Sale', content: 'Laptop lemot? Bawa ke SeuramoeTech! Cuma hari ini, instal ulang + cleaning cuma 50rb. Jangan sampai kehabisan!' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h3 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs">CS</div>
              Creative & Content Studio
           </h3>
           <p className="text-sm text-slate-500 font-medium mt-1">Bangun identitas brand dan narasi produk yang kuat untuk pasar Sumatra.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto max-w-full">
           <button onClick={() => setActiveSubTab('description')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'description' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Deskripsi Produk</button>
           <button onClick={() => setActiveSubTab('copy')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'copy' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Copywriting</button>
           <button onClick={() => setActiveSubTab('visual')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Visual Banner</button>
           <button onClick={() => setActiveSubTab('brand')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'brand' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Brand Identity</button>
        </div>
      </div>

      {activeSubTab === 'description' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {products.map(p => (
             <div key={p.id} className="glass-panel p-6 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col group">
                <div className="aspect-square rounded-2xl bg-slate-950 mb-6 overflow-hidden border border-slate-800 relative">
                   <img src={p.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                   <div className="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 backdrop-blur text-[8px] font-black text-slate-400 rounded">
                      SKU: {p.sku}
                   </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{p.name}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3 mb-6 italic">"{p.description || 'Belum ada deskripsi pemasaran.'}"</p>
                <button 
                  onClick={() => handleEditDescription(p)}
                  className="mt-auto w-full py-3 bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest rounded-xl group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all"
                >
                  Edit Deskripsi
                </button>
             </div>
           ))}
        </div>
      )}

      {activeSubTab === 'copy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-6">
              <h4 className="text-lg font-bold text-white flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                 Copywriting Templates
              </h4>
              <div className="space-y-4">
                 {copywritingTemplates.map((tmp, i) => (
                   <div key={i} className="glass-panel p-6 rounded-3xl border-slate-800 group hover:border-emerald-500/30 transition-all relative">
                      <button className="absolute top-6 right-6 p-2 bg-slate-900 rounded-lg text-slate-500 hover:text-white" onClick={() => { navigator.clipboard.writeText(tmp.content); alert("Template disalin!"); }}>
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" strokeWidth={2}/></svg>
                      </button>
                      <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">{tmp.title}</p>
                      <p className="text-sm text-slate-400 leading-relaxed pr-8 italic">"{tmp.content}"</p>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="glass-panel p-8 rounded-[2.5rem] border-slate-800 bg-indigo-600/5 h-fit">
              <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-tight">Draft Copy Baru</h4>
              <div className="space-y-4">
                 <textarea 
                   rows={6} 
                   placeholder="Tulis draf copywriting Anda di sini..."
                   className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm italic"
                 ></textarea>
                 <button className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all">Simpan ke Katalog Draf</button>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'visual' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                 <h4 className="text-lg font-bold text-white">Proposed Visual Banners</h4>
                 <div className="aspect-[21/9] rounded-3xl bg-slate-950 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center hover:border-indigo-500/50 hover:bg-indigo-600/5 transition-all group cursor-pointer">
                    <div className="p-4 bg-slate-900 rounded-2xl mb-4 group-hover:scale-110 transition-transform"><ICONS.Plus className="w-8 h-8 text-slate-500" /></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white">Ajukan Visual Banner Baru</span>
                 </div>
                 <div className="p-6 glass-panel rounded-3xl border-slate-800">
                    <p className="text-xs text-slate-500 leading-relaxed">
                       Setiap visual yang diajukan akan melalui verifikasi owner sebelum dipublikasikan ke node regional SeuramoeTech.
                    </p>
                 </div>
              </div>
              
              <div className="space-y-6 text-center lg:text-left">
                 <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest">Dimensi Standar</h4>
                 <div className="space-y-3">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                       <p className="text-xs font-bold text-white">Hero Slider</p>
                       <p className="text-[10px] text-slate-600 font-mono">1920 x 720 px</p>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                       <p className="text-xs font-bold text-white">Grid Square</p>
                       <p className="text-[10px] text-slate-600 font-mono">1080 x 1080 px</p>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                       <p className="text-xs font-bold text-white">Mobile Banner</p>
                       <p className="text-[10px] text-slate-600 font-mono">800 x 400 px</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'brand' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 glass-panel p-10 rounded-[3rem] border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                 <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17l.354-.354" strokeWidth={2}/></svg>
                 Style Guide: {user?.username.split('_')[1].toUpperCase()}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Palet Warna Toko</p>
                    <div className="flex gap-4">
                       <div className="space-y-2">
                          <div className="w-16 h-16 rounded-2xl bg-indigo-600 shadow-xl border border-white/10"></div>
                          <p className="text-[10px] text-center font-mono text-slate-500">#6366F1</p>
                       </div>
                       <div className="space-y-2">
                          <div className="w-16 h-16 rounded-2xl bg-slate-950 shadow-xl border border-slate-800"></div>
                          <p className="text-[10px] text-center font-mono text-slate-500">#020617</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Tipografi & Slogan</p>
                    <div className="space-y-3">
                       <h5 className="text-lg font-black text-white tracking-tight leading-none italic">"Your Local Sumatra Tech Node."</h5>
                       <p className="text-xs text-slate-500">Font: Inter / Outfit (Modern Minimalist)</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl text-white shadow-2xl">
                 <h4 className="text-xl font-black mb-4 tracking-tighter uppercase">Brand Audit</h4>
                 <p className="text-xs opacity-80 leading-relaxed mb-8 italic">
                    "Pastikan semua konten visual menggunakan palet warna toko dan logo beresolusi tinggi agar kepercayaan pelanggan tetap terjaga."
                 </p>
                 <button className="w-full py-4 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all">Download Brand Asset Pack</button>
              </div>
           </div>
        </div>
      )}

      {/* Editor Drawer */}
      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Optimasi Konten Produk">
         {selectedProduct && (
           <div className="space-y-8">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                 <h4 className="text-sm font-bold text-white mb-1">{selectedProduct.name}</h4>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{selectedProduct.category}</p>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Marketing Description</label>
                    <button 
                      onClick={generateAiCopy}
                      disabled={aiLoading}
                      className="flex items-center gap-1.5 text-[9px] font-black text-indigo-400 hover:text-white transition-colors"
                    >
                       {aiLoading ? <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div> : <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>}
                       AI Rewrite
                    </button>
                 </div>
                 <textarea 
                   rows={10}
                   className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm italic leading-relaxed"
                   defaultValue={selectedProduct.description}
                 ></textarea>
                 <p className="text-[8px] text-slate-600 italic">Gunakan kalimat persuasif untuk meningkatkan Conversion Rate (CVR) toko.</p>
              </div>

              <button 
                onClick={() => { setIsDrawerOpen(false); alert("Konten diperbarui secara lokal. Menunggu sinkronisasi node."); }}
                className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-indigo-500 shadow-xl"
              >
                 Deploy Konten Baru
              </button>
           </div>
         )}
      </RightDrawer>
    </div>
  );
};

export default MarketingContent;