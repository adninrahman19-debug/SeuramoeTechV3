
import React, { useState, useEffect } from 'react';
import Logo from '../components/Shared/Logo';
import { ICONS, SUBSCRIPTION_PLANS } from '../constants';

// Add comment: Defined the missing 'testimonials' data to fix the "Cannot find name 'testimonials'" error
const testimonials = [
  {
    name: 'Teuku Abdullah',
    text: 'SeuramoeTech merevolusi cara kami mengelola servis di Aceh Tech Center. Arus kas dan antrean teknisi kini terpantau real-time.',
    avatar: 'owner_acehtech',
    entity: 'Owner, Aceh Tech',
    accent: 'indigo'
  },
  {
    name: 'Budi Santoso',
    text: 'Toolbox teknisinya sangat membantu standarisasi pengerjaan. Dokumentasi sebelum dan sesudah servis jadi jauh lebih rapi.',
    avatar: 'tech_toko1',
    entity: 'Senior Technician',
    accent: 'emerald'
  },
  {
    name: 'Ali Akbar',
    text: 'Pengalaman belanja di marketplace Sumatra sangat lancar. Poin loyalty dan klaim garansi digitalnya bener-bener fitur masa depan.',
    avatar: 'customer001',
    entity: 'Verified Customer',
    accent: 'violet'
  }
];

interface LandingPageProps {
  onEnterAuth: () => void;
  onEnterMarketplace: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterAuth, onEnterMarketplace }) => {
  const [activeRegion, setActiveRegion] = useState('Aceh');
  const [previewTab, setPreviewTab] = useState<'owner' | 'staff' | 'customer'>('owner');

  // Smooth scroll handler to ensure navbar text "jalan" (scrolling works)
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

  const coreValues = [
    {
      title: 'Local Aceh–Sumatra Focus',
      desc: 'Satu-satunya platform yang dirancang khusus menyesuaikan ekosistem retail dan logistik wilayah Aceh & Sumatra Utara.',
      icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      accent: 'indigo'
    },
    {
      title: 'All-In-One Platform',
      desc: 'Kelola penjualan produk, kasir POS, tiket servis teknisi, hingga registrasi garansi dalam satu dashboard terpadu.',
      icon: <ICONS.Dashboard className="w-8 h-8" />,
      accent: 'emerald'
    },
    {
      title: 'Subscription-Based',
      desc: 'Model SaaS fleksibel. Bayar sesuai skala bisnis Anda, mulai dari toko lokal hingga jaringan korporasi multi-cabang.',
      icon: <ICONS.Ticket className="w-8 h-8" />,
      accent: 'violet'
    },
    {
      title: 'Modern UI/UX',
      desc: 'Antarmuka futuristik yang cepat, responsif, dan sangat mudah digunakan oleh staf toko maupun pelanggan.',
      icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>,
      accent: 'rose'
    },
    {
      title: 'Scalable & Secure',
      desc: 'Infrastruktur cloud yang siap berkembang dengan keamanan data terenkripsi standar perbankan regional.',
      icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      accent: 'amber'
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-indigo-500/30">
      {/* 1. Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" />
          
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { name: 'Home', id: 'home' },
              { name: 'Why Us', id: 'solutions' },
              { name: 'Preview', id: 'preview' },
              { name: 'Testimonials', id: 'testimonials' },
              { name: 'Pricing', id: 'pricing' }
            ].map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                onClick={(e) => scrollToSection(e, item.id)}
                className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-all duration-300"
              >
                {item.name}
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
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Ecosystem v2.5 • Sumatra Regional Node</span>
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.95]">SeuramoeTech – <br /><span className="text-indigo-500">Digital Mall</span> <br />for Sumatra</h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">Platform SaaS langganan yang menghubungkan toko laptop, teknisi ahli, dan pelanggan dalam satu ekosistem modern yang aman.</p>
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

      {/* 3. Why SeuramoeTech? Section */}
      <section id="solutions" className="py-32 px-6 relative overflow-hidden bg-slate-950/30">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">The Value Proposition</p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Why Choose <br /><span className="text-indigo-500">SeuramoeTech?</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((val, idx) => (
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
            
            <div className="p-10 rounded-[3rem] bg-indigo-600 flex flex-col justify-center text-white shadow-2xl shadow-indigo-600/30 lg:col-span-1 md:col-span-2">
               <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 leading-none">Ready to upgrade your business node?</h3>
               <p className="text-xs opacity-80 leading-relaxed mb-10">Bergabunglah dengan ratusan pengusaha teknologi di seluruh Sumatra hari ini.</p>
               <button onClick={onEnterAuth} className="w-full py-4 bg-white text-indigo-600 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-xl">Join the Ecosystem</button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dashboard Preview Section */}
      <section id="preview" className="py-32 px-6 relative">
         <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-20">
               <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Inside the Platform</p>
               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Designed for Every <br /><span className="text-indigo-500">Node in the Ecosystem</span></h2>
            </div>

            <div className="flex justify-center mb-12">
               <div className="inline-flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
                  {[
                    { id: 'owner', label: 'Store Owner', icon: <ICONS.Store className="w-4 h-4" /> },
                    { id: 'staff', label: 'Store Staff', icon: <ICONS.Users className="w-4 h-4" /> },
                    { id: 'customer', label: 'Customer Hub', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth={2}/></svg> }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setPreviewTab(tab.id as any)}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${previewTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-white'}`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
               </div>
            </div>

            <div className="glass-panel p-2 rounded-[3.5rem] border-white/5 bg-slate-900/40 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="bg-[#020617] rounded-[3rem] overflow-hidden border border-white/5 min-h-[500px] flex">
                  <div className="w-20 md:w-64 border-r border-white/5 p-6 flex flex-col gap-8 hidden sm:flex">
                     <Logo size="sm" showText={false} />
                     <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className={`h-10 rounded-xl ${i === 1 ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-slate-900/50'}`}></div>
                        ))}
                     </div>
                  </div>
                  <div className="flex-1 p-8 md:p-12 space-y-10">
                     {previewTab === 'owner' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                           <div className="flex justify-between items-end">
                              <div>
                                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Business Intelligence</h4>
                                 <p className="text-xs text-slate-500 font-bold uppercase mt-1">Aceh Tech Center Node</p>
                              </div>
                              <div className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">Active Plan: PRO</div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="p-6 bg-slate-950 border border-white/5 rounded-3xl space-y-2">
                                 <p className="text-[10px] font-black text-slate-600 uppercase">Monthly Revenue</p>
                                 <p className="text-3xl font-black text-white tracking-tighter">Rp 128.4M</p>
                              </div>
                              <div className="p-6 bg-slate-950 border border-white/5 rounded-3xl space-y-2">
                                 <p className="text-[10px] font-black text-slate-600 uppercase">Staff Performance</p>
                                 <p className="text-3xl font-black text-emerald-400 tracking-tighter">94.2%</p>
                              </div>
                              <div className="p-6 bg-slate-950 border border-white/5 rounded-3xl space-y-2">
                                 <p className="text-[10px] font-black text-slate-600 uppercase">Active Units</p>
                                 <p className="text-3xl font-black text-indigo-500 tracking-tighter">42 Tickets</p>
                              </div>
                           </div>
                        </div>
                     )}
                     {previewTab === 'staff' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                           <div className="flex justify-between items-end">
                              <div>
                                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Service Workbench</h4>
                                 <p className="text-xs text-slate-500 font-bold uppercase mt-1">Technician Terminal: Budi S.</p>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Active Task Queue</p>
                              {[
                                { id: 'T-101', unit: 'ROG Zephyrus G14', status: 'In Progress', color: 'indigo' },
                                { id: 'T-102', unit: 'MacBook Air M1', status: 'Diagnosing', color: 'amber' },
                                { id: 'T-103', unit: 'ThinkPad X1 Carbon', status: 'Ready', color: 'emerald' },
                              ].map(task => (
                                <div key={task.id} className="p-5 bg-slate-950 border border-white/5 rounded-2xl flex justify-between items-center group">
                                   <div className="flex items-center gap-4">
                                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center font-mono text-[10px] text-slate-500">#{task.id}</div>
                                      <p className="text-sm font-bold text-white uppercase">{task.unit}</p>
                                   </div>
                                   <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase bg-${task.color}-600/10 text-${task.color}-400 border border-${task.color}-500/20`}>{task.status}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                     )}
                     {previewTab === 'customer' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                           <div className="flex justify-between items-end">
                              <div>
                                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Personal Hub</h4>
                                 <p className="text-xs text-slate-500 font-bold uppercase mt-1">Identity: Ali Akbar</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] font-black text-slate-600 uppercase">Loyalty Points</p>
                                 <p className="text-xl font-black text-emerald-400">1,240 PTS</p>
                              </div>
                           </div>
                           <div className="p-8 bg-indigo-600 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                              <h5 className="text-lg font-black uppercase mb-4">Active Repair Progress</h5>
                              <div className="space-y-4">
                                 <div className="flex justify-between text-[10px] font-black uppercase">
                                    <span>Unit: MacBook Air M2</span>
                                    <span>75% Complete</span>
                                 </div>
                                 <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white w-3/4 shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. Testimonials & Social Proof Section */}
      <section id="testimonials" className="py-32 px-6 bg-slate-950/20 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-indigo-600/5 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-7xl mx-auto space-y-24">
           <div className="text-center space-y-4">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Ecosystem Reputation</p>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Trusted by the Tech <br /><span className="text-indigo-500">Leaders of Sumatra</span></h2>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-y border-white/5">
              {[
                { label: 'Partner Stores', val: '50+' },
                { label: 'Verified Technicians', val: '200+' },
                { label: 'Resolved Tickets', val: '15k+' },
                { label: 'Satisfied Users', val: '98%' },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                   <p className="text-4xl md:text-5xl font-black text-white tracking-tighter group-hover:text-indigo-400 transition-colors mb-2">{stat.val}</p>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <div key={idx} className="glass-panel p-10 rounded-[2.5rem] border-slate-800 hover:border-indigo-500/40 transition-all group flex flex-col shadow-2xl relative">
                   <div className="mb-8">
                      <div className="flex gap-1 text-amber-400 mb-6">
                         {[1, 2, 3, 4, 5].map(s => <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                      </div>
                      <p className="text-lg text-slate-300 leading-relaxed italic group-hover:text-white transition-colors">"{t.text}"</p>
                   </div>
                   <div className="mt-auto flex items-center gap-5 pt-8 border-t border-white/5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shadow-xl">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.avatar}`} alt={t.name} />
                      </div>
                      <div>
                         <h5 className="text-sm font-black text-white uppercase tracking-tight">{t.name}</h5>
                         <p className={`text-[9px] font-black text-${t.accent}-500 uppercase tracking-widest mt-1`}>{t.entity}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
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

      {/* 7. Final Call to Action Section (CTA) */}
      <section id="cta" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel p-16 md:p-24 rounded-[4rem] border-indigo-500/30 bg-gradient-to-br from-indigo-600 to-indigo-900 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.5)] relative overflow-hidden text-center group">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-12">
               <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] drop-shadow-2xl">
                 Ready to grow your <br />
                 <span className="text-indigo-200">laptop business</span> digitally?
               </h2>
               
               <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed font-medium opacity-80">
                 Platform SaaS pertama yang dibangun khusus untuk memberdayakan node retail teknologi di wilayah Aceh & Sumatra.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={onEnterAuth}
                    className="w-full sm:w-auto px-12 py-6 bg-white text-indigo-600 font-black uppercase text-xs tracking-[0.3em] rounded-3xl shadow-2xl hover:scale-[1.05] hover:shadow-white/20 active:scale-[0.98] transition-all"
                  >
                    Start Free Trial
                  </button>
                  <button 
                    onClick={onEnterAuth}
                    className="w-full sm:w-auto px-12 py-6 bg-indigo-500/20 border border-white/30 text-white font-black uppercase text-xs tracking-[0.3em] rounded-3xl backdrop-blur-md hover:bg-indigo-500/40 transition-all"
                  >
                    Register as Store Owner
                  </button>
                  <button 
                    className="w-full sm:w-auto px-12 py-6 text-indigo-200 font-black uppercase text-xs tracking-[0.3em] hover:text-white transition-all flex items-center gap-2 group/contact"
                  >
                    Contact Sales
                    <svg className="w-5 h-5 group-hover/contact:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer Section */}
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
                <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="hover:text-indigo-400">Marketplace</a>
                <a href="#preview" onClick={(e) => scrollToSection(e, 'preview')} className="hover:text-indigo-400">Repair Hub</a>
                <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-indigo-400">SaaS Plans</a>
                <a href="#solutions" onClick={(e) => scrollToSection(e, 'solutions')} className="hover:text-indigo-400">Security Audit</a>
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
