import React from 'react';
import Logo from '../components/Shared/Logo';
import { ICONS, SUBSCRIPTION_PLANS } from '../constants';

interface LandingPageProps {
  onEnterAuth: () => void;
  onEnterMarketplace: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterAuth, onEnterMarketplace }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-indigo-500/30">
      {/* 1. Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#020617]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" />
          
          <nav className="hidden lg:flex items-center gap-10">
            {['Home', 'Features', 'Subscription', 'Marketplace', 'Pricing', 'About'].map((item) => (
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
            <button 
              onClick={onEnterAuth}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
            >
              Login
            </button>
            <button 
              onClick={onEnterAuth}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (ABOVE THE FOLD) */}
      <section id="home" className="relative pt-40 lg:pt-56 pb-32 overflow-hidden px-6">
        {/* Decorative Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute top-1/4 -right-1/4 w-1/2 aspect-square bg-blue-600/5 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          
          {/* Left Column: Messaging & CTAs */}
          <div className="space-y-10 text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
               <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Gateway v2.5 Online</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.95]">
                SeuramoeTech – <br />
                <span className="text-indigo-500">The Digital Gateway</span> <br />
                for Laptop Stores
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Sell, manage, service, and grow your laptop business with a modern, subscription-based platform designed for Aceh & Sumatra.
              </p>
            </div>

            {/* CTA Clusters */}
            <div className="space-y-6 pt-4">
              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                 <button 
                   onClick={onEnterAuth}
                   className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-600/40 transition-all flex items-center justify-center gap-3"
                 >
                    Start Free Trial (Owner)
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                 </button>
                 <a 
                   href="#pricing"
                   className="w-full sm:w-auto px-10 py-5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all text-center"
                 >
                    View Subscription Plans
                 </a>
              </div>
              
              {/* Secondary CTAs */}
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                 <button 
                   onClick={onEnterMarketplace}
                   className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-2"
                 >
                   <ICONS.Store className="w-4 h-4" />
                   Browse Marketplace
                 </button>
                 <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                 <button 
                   onClick={onEnterAuth}
                   className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2"
                 >
                   <ICONS.Logout className="w-4 h-4" />
                   Existing Partner Login
                 </button>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Mockup Visual */}
          <div className="relative group animate-in fade-in slide-in-from-right-12 duration-1000 delay-200">
            {/* Main Dashboard Mockup */}
            <div className="glass-panel p-3 rounded-[3rem] border-white/5 bg-slate-900/40 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rotate-[-2deg] group-hover:rotate-0 transition-transform duration-1000">
               <div className="bg-[#020617] rounded-[2.5rem] overflow-hidden border border-white/5 aspect-video flex">
                  {/* Mock Sidebar */}
                  <div className="w-16 border-r border-white/5 p-4 flex flex-col gap-6">
                     <div className="w-8 h-8 rounded-lg bg-indigo-600/20"></div>
                     <div className="space-y-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
                        <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
                        <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
                     </div>
                  </div>
                  {/* Mock Content */}
                  <div className="flex-1 p-8 space-y-6">
                     <div className="flex justify-between">
                        <div className="h-6 w-32 bg-slate-800 rounded-full"></div>
                        <div className="h-6 w-20 bg-indigo-600/30 rounded-full"></div>
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                        <div className="h-24 bg-slate-900 border border-white/5 rounded-2xl"></div>
                        <div className="h-24 bg-slate-900 border border-white/5 rounded-2xl"></div>
                        <div className="h-24 bg-slate-900 border border-white/5 rounded-2xl"></div>
                     </div>
                     <div className="h-32 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl relative overflow-hidden">
                        <div className="absolute inset-0 flex items-end px-4 pb-2 gap-1">
                           {[40, 70, 45, 90, 65, 80].map((h, i) => (
                             <div key={i} className="flex-1 bg-indigo-500/30 rounded-t-sm" style={{ height: `${h}%` }}></div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -top-10 -right-10 glass-panel p-6 rounded-3xl border-white/10 shadow-2xl animate-bounce-slow">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Stores</p>
               <p className="text-2xl font-black text-white leading-none">240+</p>
            </div>

            <div className="absolute -bottom-10 -left-10 glass-panel p-6 rounded-3xl border-emerald-500/20 bg-emerald-500/5 shadow-2xl animate-float">
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Live Transactions</p>
               <p className="text-2xl font-black text-white leading-none">Rp 1.5B+</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Features Grid */}
      <section id="features" className="py-32 px-6 bg-slate-950/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4">Core Infrastructure</p>
             <h2 className="text-4xl font-black text-white uppercase tracking-tight">Built for Regional Scale</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: <ICONS.Ticket className="w-8 h-8" />, title: 'Smart Repair Hub', desc: 'Advanced ticket management with real-time tracking and automated WhatsApp notifications.' },
               { icon: <ICONS.Store className="w-8 h-8" />, title: 'E-Marketplace', desc: 'Deploy your digital storefront in minutes. Integrated with local Sumatra logistics.' },
               { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>, title: 'Neural Analytics', desc: 'Stock depletion predictions and regional buying sentiment analysis using AI.' },
               { icon: <ICONS.Users className="w-8 h-8" />, title: 'Workforce Control', desc: 'Manage technicians and staff with precise Role-Based Access Control (RBAC).' },
               { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg>, title: 'Regional Warranty', desc: 'Digitize warranty cards with IMEI verification to prevent fraud and track lifecycle.' },
               { icon: <ICONS.Package className="w-8 h-8" />, title: 'Financial Ledger', desc: 'Automated cash flow reporting and local bank reconciliation (Bank Aceh Sync).' }
             ].map((f, i) => (
               <div key={i} className="glass-panel p-10 rounded-[2.5rem] border-slate-800 hover:border-indigo-500/40 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed italic">"{f.desc}"</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. Marketplace Showcase */}
      <section id="marketplace" className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
           <div className="lg:w-1/2 space-y-8">
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Global Sumatra <br /> Marketplace</h2>
              <p className="text-lg text-slate-400 italic">"The premier hub where computer store owners meet tech enthusiasts across the region."</p>
              <div className="space-y-4">
                 {[
                   'Unified Regional Catalog',
                   'Secure Escrow System',
                   'Verified Technician Inspection',
                   'Local Installment Plans'
                 ].map(item => (
                   <div key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-sm font-bold text-slate-300">{item}</span>
                   </div>
                 ))}
              </div>
              <button 
                onClick={onEnterMarketplace}
                className="px-10 py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20"
              >
                Explore The Mall
              </button>
           </div>
           <div className="lg:w-1/2">
              <div className="glass-panel p-4 rounded-[3rem] border-slate-800 rotate-2 hover:rotate-0 transition-transform duration-1000 shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200" className="rounded-[2rem] grayscale hover:grayscale-0 transition-all duration-700" alt="Tech Hub" />
              </div>
           </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-indigo-600/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-4xl font-black text-white uppercase tracking-tight">Scale Your Node</h2>
             <p className="text-slate-500 mt-4 font-medium uppercase text-[10px] tracking-widest">Choose a tier that fits your store's operational volume.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div 
                key={plan.tier} 
                className={`glass-panel p-10 rounded-[3rem] flex flex-col border-2 transition-all duration-500 ${plan.tier === 'PRO' ? 'border-indigo-600 scale-105 shadow-2xl shadow-indigo-600/20 bg-indigo-600/5' : 'border-slate-800 hover:border-slate-700'}`}
              >
                {plan.tier === 'PRO' && (
                  <span className="bg-indigo-600 text-white text-[9px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full self-start mb-6 shadow-lg">Most Popular</span>
                )}
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{plan.name}</h3>
                <div className="mb-10">
                  <span className="text-4xl font-black text-white">Rp {(plan.priceMonthly/1000).toFixed(0)}k</span>
                  <span className="text-slate-500 ml-2 font-bold uppercase text-[10px]">/month</span>
                </div>
                
                <ul className="space-y-4 mb-12 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-400 font-medium italic">
                      <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onEnterAuth}
                  className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all ${plan.tier === 'PRO' ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/30' : 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-800'}`}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer Section */}
      <footer id="about" className="pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <Logo size="lg" />
              <p className="text-lg text-slate-500 max-w-sm italic">
                The premier digital infrastructure connecting computer stores, expert technicians, and customers across Sumatra.
              </p>
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
