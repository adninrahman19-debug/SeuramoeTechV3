
import React, { useState, useEffect } from 'react';
import Logo from '../components/Shared/Logo';
import { ICONS, SUBSCRIPTION_PLANS } from '../constants';

const testimonials = [
  {
    name: 'Teuku Abdullah',
    text: 'SeuramoeTech merevolusi cara kami mengelola servis di Aceh Tech Center. Arus kas dan antrean teknisi kini terpantau real-time.',
    avatar: 'owner_acehtech',
    entity: 'Pemilik, Aceh Tech',
    accent: 'indigo'
  },
  {
    name: 'Budi Santoso',
    text: 'Toolbox teknisinya sangat membantu standarisasi pengerjaan. Dokumentasi sebelum dan sesudah servis jadi jauh lebih rapi.',
    avatar: 'tech_toko1',
    entity: 'Teknisi Senior',
    accent: 'emerald'
  },
  {
    name: 'Ali Akbar',
    text: 'Pengalaman belanja di marketplace Sumatra sangat lancar. Poin loyalty dan klaim garansi digitalnya bener-bener fitur masa depan.',
    avatar: 'customer001',
    entity: 'Pelanggan Terverifikasi',
    accent: 'violet'
  }
];

interface LandingPageProps {
  onEnterAuth: () => void;
  onEnterMarketplace: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterAuth, onEnterMarketplace }) => {
  const [activeRegion, setActiveRegion] = useState('Semua');
  const [previewTab, setPreviewTab] = useState<'owner' | 'staff' | 'customer'>('owner');

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const ecosystemFeatures = [
    {
      title: "Untuk Pemilik",
      subtitle: "Komando Strategis",
      accent: "indigo",
      features: [
        { name: "Manajemen multi-toko", icon: <ICONS.Store className="w-5 h-5" /> },
        { name: "Produk, stok & promo", icon: <ICONS.Package className="w-5 h-5" /> },
        { name: "Manajemen staf & peran", icon: <ICONS.Users className="w-5 h-5" /> },
        { name: "Laporan bisnis lengkap", icon: <ICONS.Dashboard className="w-5 h-5" /> },
        { name: "Kontrol langganan SaaS", icon: <ICONS.Ticket className="w-5 h-5" /> }
      ]
    },
    {
      title: "Untuk Staf",
      subtitle: "Pusat Operasional",
      accent: "violet",
      features: [
        { name: "Admin, teknisi, marketing", icon: <ICONS.Users className="w-5 h-5" /> },
        { name: "Dashboard spesifik peran", icon: <ICONS.Dashboard className="w-5 h-5" /> },
        { name: "Pelacakan kinerja harian", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg> }
      ]
    },
    {
      title: "Untuk Pelanggan",
      subtitle: "Pusat Pengalaman",
      accent: "emerald",
      features: [
        { name: "Marketplace teknologi modern", icon: <ICONS.Store className="w-5 h-5" /> },
        { name: "Lacak servis & garansi", icon: <ICONS.Ticket className="w-5 h-5" /> },
        { name: "Pusat ulasan & bantuan", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeWidth={2}/></svg> }
      ]
    }
  ];

  const featuredStores = [
    { name: 'Aceh Tech Center', region: 'Banda Aceh', rating: 4.9, reviews: 128, logo: 'ATC', color: 'indigo' },
    { name: 'Meulaboh Gadget', region: 'Meulaboh', rating: 4.8, reviews: 85, logo: 'MGH', color: 'emerald' },
    { name: 'Lhokseumawe Store', region: 'Lhokseumawe', rating: 4.7, reviews: 64, logo: 'LKS', color: 'violet' },
    { name: 'Medan North Node', region: 'Medan', rating: 4.9, reviews: 210, logo: 'MNN', color: 'rose' },
  ].filter(s => s.region === activeRegion || activeRegion === 'Semua');

  const popularProducts = [
    { name: 'ROG Zephyrus G14', price: 'Rp 28.5Jt', rating: 4.9, img: 'https://images.unsplash.com/photo-1588872657578-7efd3f1514a1?q=80&w=400', tag: 'Sedang Tren' },
    { name: 'MacBook Air M2', price: 'Rp 17.2Jt', rating: 4.8, img: 'https://images.unsplash.com/photo-1611186871348-b1ec696e5238?q=80&w=400', tag: 'Terlaris' },
    { name: 'ThinkPad X1 Carbon', price: 'Rp 24.1Jt', rating: 4.7, img: 'https://images.unsplash.com/photo-1588872657578-7efd3f1514a1?q=80&w=400', tag: 'Rating Tertinggi' },
    { name: 'iPhone 15 Pro', price: 'Rp 20.9Jt', rating: 4.9, img: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&q=80&w=400', tag: 'Populer' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-indigo-500/30">
      <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" />
          <nav className="hidden lg:flex items-center gap-10">
            {[{ name: 'Beranda', id: 'home' }, { name: 'Solusi Kami', id: 'solutions' }, { name: 'Fitur Unggulan', id: 'features' }, { name: 'Marketplace', id: 'marketplace-preview' }, { name: 'Dashboard', id: 'preview' }, { name: 'Harga Paket', id: 'pricing' }].map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={(e) => scrollToSection(e, item.id)} className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-all duration-300">
                {item.name}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={onEnterAuth} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Masuk</button>
            <button onClick={onEnterAuth} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20 transition-all">Daftar Sekarang</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative pt-40 lg:pt-56 pb-32 overflow-hidden px-6 text-center lg:text-left">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full mx-auto lg:mx-0">
               <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Ekosistem v2.5 • Sumatra Regional Node</span>
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.95]">SeuramoeTech – <br /><span className="text-indigo-500">Mall Digital</span> <br />untuk Sumatra</h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">Platform SaaS langganan yang menghubungkan toko laptop, teknisi ahli, dan pelanggan dalam satu ekosistem modern yang aman di seluruh wilayah Aceh dan Sumatra.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <button onClick={onEnterAuth} className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-600/40 transition-all">Uji Coba Gratis (Pemilik)</button>
               <button onClick={onEnterMarketplace} className="px-10 py-5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all">Jelajahi Marketplace</button>
            </div>
          </div>
          <div className="hidden lg:block animate-in fade-in slide-in-from-right-12 duration-1000">
            <div className="glass-panel p-3 rounded-[3rem] border-white/5 bg-slate-900/40 shadow-2xl rotate-[-2deg]">
               <div className="bg-[#020617] rounded-[2.5rem] overflow-hidden border border-white/5 aspect-video flex items-center justify-center">
                  <Logo size="xl" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Utama */}
      <section id="features" className="py-32 px-6 bg-slate-950/20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Arsitektur Terintegrasi</p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Ikhtisar <br /><span className="text-indigo-500">Fitur Utama</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {ecosystemFeatures.map((role, idx) => (
              <div key={idx} className="glass-panel p-8 md:p-10 rounded-[3rem] border-slate-800 hover:border-slate-700 transition-all flex flex-col shadow-2xl group">
                <div className="mb-10">
                  <p className={`text-[10px] font-black text-${role.accent}-500 uppercase tracking-widest mb-1`}>{role.subtitle}</p>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{role.title}</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-4 flex-1">
                  {role.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-5 p-4 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900 transition-all group/feat">
                      <div className={`w-12 h-12 rounded-xl bg-${role.accent}-600/10 border border-${role.accent}-500/20 flex items-center justify-center text-${role.accent}-400 group-hover/feat:bg-${role.accent}-600 group-hover/feat:text-white transition-all`}>
                        {feat.icon}
                      </div>
                      <span className="text-sm font-bold text-slate-300 group-hover/feat:text-white transition-colors uppercase tracking-tight">{feat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section id="marketplace-preview" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl aspect-square bg-indigo-600/5 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
             <div className="space-y-4">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Node Retail Sumatra</p>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Pratinjau <br /><span className="text-indigo-500">Marketplace</span></h2>
             </div>
             <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto no-scrollbar max-w-full">
                {['Semua', 'Banda Aceh', 'Lhokseumawe', 'Meulaboh', 'Medan'].map(region => (
                  <button 
                    key={region}
                    onClick={() => setActiveRegion(region)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeRegion === region ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                  >
                    {region}
                  </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
             <div className="lg:col-span-1 space-y-8">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                   <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Toko Unggulan</h3>
                </div>
                <div className="space-y-4">
                   {featuredStores.length > 0 ? featuredStores.map(store => (
                     <div key={store.name} className="glass-panel p-6 rounded-[2rem] border-slate-800 hover:border-indigo-500/30 transition-all group cursor-pointer shadow-xl">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-${store.color}-500 text-xs shadow-lg group-hover:scale-110 transition-transform`}>
                              {store.logo}
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">{store.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                 <div className="flex text-amber-400 text-[10px]">
                                    {'★'.repeat(5)}
                                 </div>
                                 <span className="text-[9px] text-slate-600 font-black">({store.reviews} ULASAN)</span>
                              </div>
                           </div>
                        </div>
                     </div>
                   )) : (
                     <p className="text-xs text-slate-600 italic px-4">Tidak ada toko di wilayah ini.</p>
                   )}
                </div>
             </div>

             <div className="lg:col-span-3 space-y-8">
                <div className="flex justify-between items-center mb-8">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Produk Terpopuler</h3>
                   </div>
                   <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Aktivitas Global Node Real-time</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {popularProducts.map(p => (
                     <div key={p.name} className="glass-panel rounded-[2.5rem] border-slate-800 hover:border-indigo-500/40 transition-all group overflow-hidden flex flex-col shadow-2xl">
                        <div className="aspect-square relative overflow-hidden bg-slate-950">
                           <img src={p.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt="" />
                           <div className="absolute top-4 left-4 bg-rose-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">{p.tag}</div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                           <div>
                              <h4 className="text-xs font-black text-white uppercase mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">{p.name}</h4>
                              <div className="flex items-center gap-2 mb-4">
                                 <div className="text-amber-400 text-[10px]">{'★'.repeat(5)}</div>
                                 <span className="text-[8px] font-black text-slate-600">5.0</span>
                              </div>
                           </div>
                           <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                              <span className="text-sm font-black text-emerald-400">{p.price}</span>
                              <button onClick={onEnterMarketplace} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={3}/></svg>
                              </button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="glass-panel p-12 rounded-[3.5rem] border-slate-800 bg-indigo-600/5 shadow-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all">
             <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <ICONS.Store className="w-64 h-64" />
             </div>
             <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10 text-center md:text-left">
                <div className="max-w-xl">
                   <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none mb-4">Jelajahi Seluruh <span className="text-indigo-500">Jaringan Sumatra Tech</span></h3>
                   <p className="text-slate-400 text-sm font-medium italic">"Temukan penawaran terbaik dari ratusan vendor terpercaya di seluruh Aceh dan Sumatra Utara dalam satu pintu."</p>
                </div>
                <button 
                  onClick={onEnterMarketplace} 
                  className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-[0.3em] rounded-3xl shadow-2xl shadow-indigo-600/40 transition-all flex items-center gap-4 group/btn"
                >
                   Buka Marketplace Penuh
                   <svg className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={3}/></svg>
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Tantangan & Solusi */}
      <section id="challenges" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Masalah Umum */}
            <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
               <div className="space-y-4">
                 <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Cara Lama</p>
                 <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Tantangan <br /><span className="text-rose-500">Operasional</span></h2>
               </div>
               
               <div className="space-y-4">
                  {[
                    { title: "Manajemen Toko Manual", desc: "Masih menggunakan buku catatan atau spreadsheet yang tidak sinkron.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2}/></svg> },
                    { title: "Stok Tidak Terkontrol", desc: "Sering kehabisan barang populer atau stok berlebih yang membebani kas.", icon: <ICONS.Package className="w-6 h-6" /> },
                    { title: "Servis & Garansi Berantakan", desc: "Sulit melacak progres perbaikan dan masa berlaku garansi pelanggan.", icon: <ICONS.Ticket className="w-6 h-6" /> },
                    { title: "Tidak Ada Laporan Real-time", desc: "Pemilik harus menunggu akhir bulan untuk mengetahui kondisi finansial.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg> },
                    { title: "Sulit Mengelola Staf", desc: "Kurangnya transparansi kinerja antara admin, teknisi, dan marketing.", icon: <ICONS.Users className="w-6 h-6" /> },
                  ].map((prob, i) => (
                    <div key={i} className="flex gap-6 p-6 bg-rose-600/5 border border-rose-500/10 rounded-[2rem] group hover:bg-rose-600/10 transition-all">
                       <div className="w-12 h-12 shrink-0 rounded-2xl bg-rose-950 border border-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                          {prob.icon}
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-white uppercase mb-1">{prob.title}</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"{prob.desc}"</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Solusi SeuramoeTech */}
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000">
               <div className="space-y-4">
                 <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Masa Depan Terintegrasi</p>
                 <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Solusi <br /><span className="text-indigo-500">SeuramoeTech</span></h2>
               </div>

               <div className="space-y-4">
                  {[
                    { title: "Satu Platform Terintegrasi", desc: "Hubungkan inventaris, penjualan, dan servis dalam satu pusat data.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" strokeWidth={2}/></svg> },
                    { title: "Dashboard Modern", icon: <ICONS.Dashboard className="w-6 h-6" />, desc: "Antarmuka intuitif yang dirancang untuk kecepatan operasional tinggi." },
                    { title: "Semua Data Real-time", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>, desc: "Lihat arus kas dan status antrean teknisi secara langsung, di mana saja." },
                    { title: "Akses Berbasis Peran", icon: <ICONS.Users className="w-6 h-6" />, desc: "Keamanan terjamin dengan hak akses spesifik untuk setiap fungsi staf." },
                    { title: "Langganan Fleksibel", icon: <ICONS.Ticket className="w-6 h-6" />, desc: "Pilih paket sesuai skala bisnis Anda, mulai dari toko kecil hingga jaringan mall." },
                  ].map((sol, i) => (
                    <div key={i} className="flex gap-6 p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-[2rem] group hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all shadow-xl shadow-indigo-600/5">
                       <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-950 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-indigo-500/20 shadow-lg">
                          {sol.icon}
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-white uppercase mb-1">{sol.title}</h4>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed italic">"{sol.desc}"</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SeuramoeTech? */}
      <section id="solutions" className="py-32 px-6 relative overflow-hidden bg-slate-950/30">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Proporsi Nilai</p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Mengapa Memilih <br /><span className="text-indigo-500">SeuramoeTech?</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
               { title: 'Fokus Lokal Sumatra', desc: 'Dirancang khusus menyesuaikan ekosistem retail wilayah Aceh & Sumatra Utara.', icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, accent: 'indigo' },
               { title: 'Platform All-In-One', desc: 'Kelola penjualan, teknisi, hingga garansi dalam satu dashboard terpadu.', icon: <ICONS.Dashboard className="w-8 h-8" />, accent: 'emerald' },
               { title: 'Model SaaS Langganan', desc: 'Bayar sesuai skala bisnis Anda, mulai dari toko lokal hingga jaringan korporasi.', icon: <ICONS.Ticket className="w-8 h-8" />, accent: 'violet' }
            ].map((val, idx) => (
              <div key={idx} className="glass-panel p-10 rounded-[3rem] border-slate-800 hover:border-indigo-500/40 transition-all group flex flex-col shadow-2xl relative overflow-hidden">
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${val.accent}-600/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                <div className="flex flex-col h-full relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-${val.accent}-600/10 border border-${val.accent}-500/20 flex items-center justify-center text-${val.accent}-500 mb-8 group-hover:bg-${val.accent}-600 group-hover:text-white transition-all shadow-lg`}>
                    {val.icon}
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-indigo-400 transition-colors">{val.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed italic">"{val.desc}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="preview" className="py-32 px-6 relative">
         <div className="max-w-7xl mx-auto text-center space-y-4 mb-20">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Pratinjau Sistem</p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Kelola Setiap <br /><span className="text-indigo-500">Node Bisnis</span></h2>
            <div className="flex justify-center mt-12">
               <div className="inline-flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
                  {[{ id: 'owner', label: 'Pemilik Toko', icon: <ICONS.Store className="w-4 h-4" /> }, { id: 'staff', label: 'Staf Toko', icon: <ICONS.Users className="w-4 h-4" /> }, { id: 'customer', label: 'Hub Pelanggan', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={2}/></svg> }].map(tab => (
                    <button key={tab.id} onClick={() => setPreviewTab(tab.id as any)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${previewTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-white'}`}>
                      {tab.icon}{tab.label}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Dashboard Preview Frame */}
         <div className="max-w-7xl mx-auto glass-panel p-2 rounded-[3.5rem] border-white/5 bg-slate-900/40 shadow-2xl relative overflow-hidden group">
            <div className="h-12 bg-slate-950/80 border-b border-white/5 flex items-center px-8 gap-2">
               <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></div>
               </div>
               <div className="mx-auto bg-slate-900 border border-white/5 rounded-lg px-10 py-1 text-[8px] font-mono text-slate-600 tracking-tighter">https://dashboard.seuramoetech.id/{previewTab}</div>
            </div>

            <div className="bg-[#020617] rounded-b-[3rem] overflow-hidden border-t border-white/5 min-h-[550px] p-8 md:p-12 relative animate-in fade-in duration-700">
               {/* Previews are translated visually in their respective blocks */}
               <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent flex items-center justify-center pt-20">
                  <button onClick={onEnterAuth} className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-2xl shadow-indigo-600/40 transition-all border border-indigo-500/30">Akses Demo Interaktif Sekarang</button>
               </div>
               
               {/* Simplified mock content for translation view */}
               <div className="text-center py-20">
                  <p className="text-slate-500 font-bold uppercase tracking-widest">Memuat Tampilan Dashboard {previewTab.toUpperCase()}...</p>
               </div>
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-6 bg-slate-950/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-24 text-center">
           <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">Dipercaya oleh Para <br /><span className="text-indigo-500">Pemimpin Teknologi Sumatra</span></h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <div key={idx} className="glass-panel p-10 rounded-[2.5rem] border-slate-800 hover:border-indigo-500/40 transition-all group text-left shadow-2xl relative overflow-hidden">
                   <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${t.accent}-600/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                   <div className="mb-8 flex gap-1 text-amber-400 relative z-10">
                      {[1,2,3,4,5].map(s => <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.196-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                   </div>
                   <p className="text-lg text-slate-300 italic mb-8 relative z-10 leading-relaxed font-medium">"{t.text}"</p>
                   <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shadow-lg">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.avatar}`} alt="" />
                      </div>
                      <div>
                         <h5 className="text-sm font-black text-white uppercase tracking-tight">{t.name}</h5>
                         <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{t.entity}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20 space-y-4">
           <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Solusi Penyekalaan Bisnis</p>
           <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">Pilih Paket <br /><span className="text-indigo-500">Kekuatan Bisnis Anda</span></h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
           {SUBSCRIPTION_PLANS.map((plan) => (
             <div key={plan.tier} className={`glass-panel p-10 rounded-[3rem] flex flex-col border-2 transition-all duration-500 ${plan.name.includes('Bisnis') ? 'border-indigo-600 scale-105 shadow-2xl shadow-indigo-600/30 bg-indigo-600/5' : 'border-slate-800 hover:border-slate-700'}`}>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight leading-none">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8 border-b border-slate-800/50 pb-6">
                   <span className="text-4xl font-black text-white tracking-tighter">Rp {(plan.priceMonthly/1000).toFixed(0)}rb</span>
                   <span className="text-slate-600 font-bold uppercase text-[10px]">/ bln</span>
                </div>
                <ul className="space-y-4 mb-12 flex-1">
                   {plan.features.map((f, i) => (
                     <li key={i} className="flex items-start gap-3 text-sm text-slate-400 font-medium italic group/feat">
                        <svg className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5 group-hover/feat:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
                        {f}
                     </li>
                   ))}
                </ul>
                <button onClick={onEnterAuth} className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl ${plan.name.includes('Bisnis') ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/40' : 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-800'}`}>Mulai Uji Coba Gratis</button>
             </div>
           ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="pt-32 pb-12 px-6 border-t border-white/5 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <Logo size="lg" />
              <p className="text-lg text-slate-500 max-w-sm italic font-medium leading-relaxed">Infrastruktur digital utama yang menghubungkan toko komputer, teknisi ahli, dan pelanggan di seluruh node regional Sumatra.</p>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-800 pb-2 w-fit">Arsitektur Platform</h4>
              <nav className="flex flex-col gap-4 text-sm font-bold text-slate-500">
                <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="hover:text-indigo-400 transition-colors uppercase tracking-tight">Marketplace Node</a>
                <a href="#challenges" onClick={(e) => scrollToSection(e, 'challenges')} className="hover:text-indigo-400 transition-colors uppercase tracking-tight">Masalah & Solusi</a>
                <a href="#preview" onClick={(e) => scrollToSection(e, 'preview')} className="hover:text-indigo-400 transition-colors uppercase tracking-tight">Workbench Teknis</a>
                <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-indigo-400 transition-colors uppercase tracking-tight">Komando SaaS</a>
              </nav>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2024 EKOSISTEM SEURAMOETECH • REGIONAL SUMATRA-01 • DATA AMAN</p>
             <div className="flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors">Protokol Privasi</a>
                <a href="#" className="hover:text-white transition-colors">Syarat Layanan</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
