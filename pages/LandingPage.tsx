import React, { useState } from 'react';
import Logo from '../components/Shared/Logo';
import { ICONS, SUBSCRIPTION_PLANS } from '../constants';

interface LandingPageProps {
  onEnterAuth: () => void;
  onEnterMarketplace: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterAuth, onEnterMarketplace }) => {
  const [activeRegion, setActiveRegion] = useState('Aceh');

  const steps = [
    { id: '01', title: 'Owner Registers', desc: 'Daftarkan identitas bisnis Anda ke dalam database SeuramoeTech secara instan.', icon: <ICONS.Users className="w-6 h-6" />, color: 'indigo' },
    { id: '02', title: 'Choose Subscription', desc: 'Pilih paket Power Tier (Starter, Business, atau Enterprise) sesuai skala toko Anda.', icon: <ICONS.Plus className="w-6 h-6" />, color: 'violet' },
    { id: '03', title: 'Setup Store Node', desc: 'Konfigurasi lokasi, jam operasional, dan branding toko di regional Sumatra.', icon: <ICONS.Store className="w-6 h-6" />, color: 'emerald' },
    { id: '04', title: 'Add Staff & Products', desc: 'Rekrut teknisi, admin, dan upload katalog produk ke marketplace global.', icon: <ICONS.Package className="w-6 h-6" />, color: 'amber' },
    { id: '05', title: 'Start Selling & Servicing', desc: 'Kelola transaksi, tiket servis, dan pantau pertumbuhan bisnis via dashboard modern.', icon: <ICONS.Dashboard className="w-6 h-6" />, color: 'rose' }
  ];

  const previewProducts = [
    { name: 'Asus ROG Zephyrus G14', price: '28.5M', img: 'https://images.unsplash.com/photo-1588872657578-7efd3f1514a1?q=80&w=400', store: 'Aceh Tech Center', rating: 4.9 },
    { name: 'MacBook Air M2 13"', price: '17.2M', img: 'https://images.unsplash.com/photo-1611186871348-b1ec696e5238?q=80&w=400', store: 'Meulaboh Gadget', rating: 4.8 },
    { name: 'Logitech G502 Hero', price: '850k', img: 'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=400', store: 'Sigli Digital', rating: 5.0 },
    { name: 'RTX 4070 Ti Master', price: '12.4M', img: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400', store: 'Aceh Tech Center', rating: 4.7 }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-indigo-500/30">
      {/* 1. Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#020617]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" />
          
          <nav className="hidden lg:flex items-center gap-10">
            {['Home', 'Solutions', 'Marketplace', 'Process', 'Pricing'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={onEnterAuth} className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Login</button>
            <button onClick={onEnterAuth} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20 transition-all">Register</button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="home" className="relative pt-40 lg:pt-56 pb-32 overflow-hidden px-6 text-center lg:text-left">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full mx-auto lg:mx-0">
               <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Sumatra Tech Gateway v2.5</span>
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.95]">SeuramoeTech – <br /><span className="text-indigo-500">Digital Mall</span> <br />for Sumatra</h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">Platform SaaS langganan yang menghubungkan toko laptop, teknisi ahli, dan pelanggan dalam satu ekosistem modern.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <button onClick={onEnterAuth} className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-600/40 transition-all">Start Free Trial (Owner)</button>
               <button onClick={onEnterMarketplace} className="px-10 py-5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all">Explore Mall</button>
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

      {/* 3. Marketplace Preview Section (NEW) */}
      <section id="marketplace" className="py-32 px-6 bg-slate-950/30 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -z-10"></div>
        
        <div className="max-w-7xl mx-auto space-y-24">
           {/* Section Header with Region Filter */}
           <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="space-y-4 max-w-2xl text-center md:text-left">
                 <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">The Regional Mall</p>
                 <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Experience The <br /><span className="text-indigo-500">Sumatra Ecosystem</span></h2>
              </div>
              <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
                 {['Aceh', 'Medan', 'Padang', 'Palembang'].map(region => (
                   <button 
                     key={region} 
                     onClick={() => setActiveRegion(region)}
                     className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeRegion === region ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
                   >
                     {region}
                   </button>
                 ))}
              </div>
           </div>

           {/* Featured Stores Ribbon */}
           <div className="space-y-8">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest ml-4">Featured Node Stores</h4>
              <div className="flex flex-wrap gap-4">
                 {[
                   { name: 'Aceh Tech Center', loc: 'Banda Aceh', rating: '5.0' },
                   { name: 'Sigli Digital Hub', loc: 'Sigli', rating: '4.9' },
                   { name: 'Meulaboh Gadget', loc: 'Meulaboh', rating: '4.8' },
                   { name: 'Lhokseumawe Store', loc: 'Lhokseumawe', rating: '4.9' }
                 ].map((store, i) => (
                   <div key={i} className="px-8 py-6 glass-panel rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all cursor-default group flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-all shadow-lg">
                         <ICONS.Store className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-white uppercase tracking-tight">{store.name}</p>
                         <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{store.loc}</span>
                            <span className="text-[9px] text-amber-400 font-black">★ {store.rating}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Popular Products Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {previewProducts.map((p, i) => (
                <div key={i} className="glass-panel rounded-[2.5rem] border-slate-800 hover:border-indigo-500/40 transition-all group overflow-hidden flex flex-col shadow-2xl">
                   <div className="aspect-square relative bg-slate-950 overflow-hidden">
                      <img src={p.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" alt={p.name} />
                      <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">Hot Item</div>
                   </div>
                   <div className="p-6 space-y-4 flex-1 flex flex-col">
                      <div className="space-y-1">
                         <h5 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">{p.name}</h5>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{p.store}</p>
                      </div>
                      <div className="flex justify-between items-end mt-auto pt-4 border-t border-slate-800/50">
                         <div>
                            <p className="text-[8px] font-black text-slate-600 uppercase mb-0.5">Price Node</p>
                            <p className="text-xl font-black text-white tracking-tighter">Rp {p.price}</p>
                         </div>
                         <div className="text-right">
                            <div className="text-amber-400 text-[10px] font-black mb-1">★★★★★</div>
                            <p className="text-[8px] text-slate-600 font-bold uppercase">98 Reviews</p>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           {/* Review Snippets */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { user: 'Teuku Ryan', text: 'Servis di node Aceh Tech Center sangat transparan. Tracking lewat dashboard sangat membantu!', region: 'Banda Aceh' },
                { user: 'Cut Meutia', text: 'Beli laptop di marketplace ini tenang karena ada verifikasi teknisi dari SeuramoeTech.', region: 'Lhokseumawe' },
                { user: 'Budi Santoso', text: 'Alat bantu diagnostik teknisi di platform ini sangat membantu pekerjaan saya sehari-hari.', region: 'Medan Node' }
              ].map((rev, i) => (
                <div key={i} className="p-8 glass-panel rounded-[2rem] border-slate-800 bg-indigo-600/5 relative">
                   <div className="absolute top-4 right-8 text-4xl text-indigo-500/20 font-serif">“</div>
                   <p className="text-xs text-slate-400 leading-relaxed italic mb-6">"{rev.text}"</p>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shadow-lg">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.user}`} alt="user" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-white uppercase tracking-widest">{rev.user}</p>
                         <p className="text-[8px] text-indigo-400 font-bold uppercase">{rev.region}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           {/* CTA Section */}
           <div className="flex flex-col items-center gap-6 pt-12">
              <p className="text-sm text-slate-500 font-medium max-w-lg text-center leading-relaxed">
                 Ribuan produk teknologi dari berbagai node regional Sumatra menanti Anda. <br />
                 <span className="text-white font-bold italic">Beli aman, servis terpercaya, garansi terpusat.</span>
              </p>
              <button 
                onClick={onEnterMarketplace}
                className="px-16 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-[0.3em] rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-4"
              >
                 Explore Full Marketplace
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
           </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="process" className="py-32 px-6 relative">
         <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-24">
               <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">The Onboarding Flow</p>
               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Your Blueprint <br /><span className="text-indigo-500">for Modern Retail</span></h2>
            </div>
            <div className="relative space-y-12">
               <div className="absolute left-[2.25rem] top-12 bottom-12 w-0.5 bg-slate-800 hidden md:block"></div>
               {steps.map((step, idx) => (
                  <div key={step.id} className={`flex flex-col md:flex-row gap-8 relative z-10 animate-in slide-in-from-bottom-12 duration-1000`} style={{ animationDelay: `${idx * 150}ms` }}>
                     <div className="flex md:flex-col items-center gap-6">
                        <div className={`w-18 h-18 md:w-20 md:h-20 rounded-[2rem] bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-${step.color}-400 shadow-2xl transition-all group-hover:scale-110 shrink-0`}>
                           {step.icon}
                        </div>
                        <div className="md:hidden h-px flex-1 bg-slate-800"></div>
                     </div>
                     <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border-slate-800 flex-1 hover:border-indigo-500/30 transition-all group">
                        <div className="flex items-center gap-4 mb-4">
                           <span className={`text-4xl font-black text-${step.color}-500/20 tabular-nums`}>{step.id}</span>
                           <h4 className="text-2xl font-black text-white uppercase tracking-tight">{step.title}</h4>
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">{step.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. Subscription & Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-[#020617] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Scaling Solutions</p>
             <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">Choose Your <br /><span className="text-indigo-500">Business Power Tier</span></h2>
             <p className="text-slate-500 max-w-2xl mx-auto font-medium">Paket langganan fleksibel yang dirancang untuk mendukung pertumbuhan toko komputer dari skala lokal hingga regional Sumatra.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div key={plan.tier} className={`glass-panel p-10 rounded-[3rem] flex flex-col border-2 transition-all duration-500 relative group ${plan.name === 'Business' ? 'border-indigo-600 scale-105 shadow-2xl shadow-indigo-600/30 bg-indigo-600/5' : 'border-slate-800 hover:border-slate-700'}`}>
                {plan.name === 'Business' && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black tracking-widest px-6 py-2 rounded-full shadow-xl">Most Popular Choice</div>
                )}
                <div className="mb-10">
                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{plan.name}</h3>
                  <p className="text-xs text-slate-500 font-medium italic mb-6">"{plan.description}"</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white tracking-tighter">Rp {(plan.priceMonthly/1000).toFixed(0)}k</span>
                    <span className="text-slate-600 font-bold uppercase text-[10px]">/ month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-12 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-400 font-medium italic group-hover:text-slate-200 transition-colors">
                      <div className="mt-1 w-4 h-4 rounded-full bg-indigo-600/20 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={onEnterAuth} className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl ${plan.name === 'Business' ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/40' : 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-800'}`}>Start Free Trial</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer Section */}
      <footer id="about" className="pt-32 pb-12 px-6 border-t border-white/5 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <Logo size="lg" />
              <p className="text-lg text-slate-500 max-w-sm italic">The premier digital infrastructure connecting computer stores, expert technicians, and customers across Sumatra.</p>
              <div className="flex gap-4">
                 {['twitter', 'instagram', 'facebook', 'linkedin'].map(soc => (
                   <div key={soc} className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:border-indigo-500/50 cursor-pointer transition-all">
                      <span className="capitalize text-[10px] font-black">{soc[0]}</span>
                   </div>
                 ))}
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Platform</h4>
              <nav className="flex flex-col gap-4 text-sm font-medium text-slate-500">
                <a href="#" className="hover:text-indigo-400">Marketplace</a>
                <a href="#" className="hover:text-indigo-400">Repair Hub</a>
                <a href="#" className="hover:text-indigo-400">SaaS Plans</a>
                <a href="#" className="hover:text-indigo-400">Security Audit</a>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Regional</h4>
              <nav className="flex flex-col gap-4 text-sm font-medium text-slate-500">
                <a href="#" className="hover:text-indigo-400">Aceh Node</a>
                <a href="#" className="hover:text-indigo-400">Sumatra Expansion</a>
                <a href="#" className="hover:text-indigo-400">Technician Network</a>
                <a href="#" className="hover:text-indigo-400">Store Partner</a>
              </nav>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2024 SEURAMOETECH ECOSYSTEM • REGIONAL SUMATRA-01</p>
             <div className="flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
                <a href="#" className="hover:text-white">SLA Agreement</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;