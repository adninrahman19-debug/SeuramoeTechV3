import React, { useState, useEffect } from 'react';
import SmartCustomerService, { SmartInsight, UserPersona } from '../../services/SmartCustomerService';
import { Product } from '../../types';
import { ICONS } from '../../constants';

interface SmartHubProps {
  onNavigate: (path: string) => void;
}

const SmartHub: React.FC<SmartHubProps> = ({ onNavigate }) => {
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [persona, setPersona] = useState<UserPersona[]>([]);

  useEffect(() => {
    setInsights(SmartCustomerService.getSmartInsights());
    setRecommendations(SmartCustomerService.getPersonalizedProducts());
    setPersona(SmartCustomerService.getUserPersona());
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'WARRANTY_ALERT': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>;
      case 'FOLLOW_UP': return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth={2}/></svg>;
      default: return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>;
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-24">
      {/* Smart Identity DNA */}
      <div className="glass-panel p-10 rounded-[3rem] border-slate-800 bg-gradient-to-br from-indigo-600/10 to-transparent flex flex-col lg:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><svg className="w-48 h-48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" strokeWidth={2}/></svg></div>
         
         <div className="flex-1 space-y-6">
            <div>
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Neural Profile Node</p>
               <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-tight">Identity DNA: Tech Power User</h2>
               <p className="text-sm text-slate-400 mt-4 max-w-xl leading-relaxed italic">"Berdasarkan pola interaksi Anda di node Sumatra, sistem mendeteksi minat tinggi pada optimasi hardware dan periferal gaming."</p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
               {persona.map(p => (
                 <div key={p.category} className="px-6 py-3 bg-slate-950 border border-slate-800 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{p.category}</p>
                    <div className="flex items-center gap-3">
                       <span className="text-lg font-black text-white">{p.score}%</span>
                       <span className="text-[9px] text-indigo-400 font-bold uppercase">{p.label}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="w-full lg:w-72 space-y-4">
            <div className="p-6 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-600/20">
               <h4 className="text-lg font-black uppercase mb-1">Smart Tip</h4>
               <p className="text-xs opacity-80 leading-relaxed italic">"Repaste unit Anda setiap 12 bulan untuk mencegah thermal throttling di cuaca Sumatra yang lembap."</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Live AI Insights Feed */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
               <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
               Neural Insights Feed
            </h3>
            
            <div className="space-y-4">
               {insights.length === 0 ? (
                 <div className="py-20 text-center glass-panel rounded-[2rem] border-slate-800 text-slate-600 italic">Sistem sedang menganalisis aktivitas baru Anda...</div>
               ) : insights.map(insight => (
                 <div key={insight.id} className={`glass-panel p-8 rounded-[2.5rem] border-slate-800 flex flex-col md:flex-row items-start md:items-center gap-8 group hover:border-indigo-500/40 transition-all ${insight.priority === 'HIGH' ? 'bg-rose-600/5 ring-1 ring-rose-500/20' : ''}`}>
                    <div className={`p-5 rounded-2xl shrink-0 transition-transform group-hover:scale-110 ${
                      insight.priority === 'HIGH' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 
                      insight.type === 'FOLLOW_UP' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' :
                      'bg-slate-950 border border-slate-800 text-indigo-400'
                    }`}>
                       {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xl font-bold text-white uppercase tracking-tight">{insight.title}</h4>
                          {insight.priority === 'HIGH' && <span className="text-[8px] font-black bg-rose-600 text-white px-2 py-0.5 rounded animate-pulse">ACTION REQUIRED</span>}
                       </div>
                       <p className="text-sm text-slate-400 leading-relaxed pr-6 italic">"{insight.message}"</p>
                    </div>
                    <button 
                      onClick={() => onNavigate(insight.actionPath)}
                      className="px-8 py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg shrink-0"
                    >
                      {insight.actionLabel}
                    </button>
                 </div>
               ))}
            </div>
         </div>

         {/* Personalized Recommendations */}
         <div className="space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
               <div className="w-2 h-8 bg-emerald-600 rounded-full"></div>
               Just For You
            </h3>
            <div className="space-y-4">
               {recommendations.map(p => (
                 <div key={p.id} className="glass-panel p-5 rounded-[2rem] border-slate-800 flex items-center gap-4 group hover:border-emerald-500/30 transition-all cursor-pointer">
                    <div className="w-20 h-20 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                       <img src={p.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">{p.category}</p>
                       <h4 className="text-sm font-bold text-white truncate mb-2">{p.name}</h4>
                       <p className="text-xs font-black text-white">Rp {p.price.toLocaleString()}</p>
                       <button className="mt-3 text-[9px] font-black text-indigo-400 uppercase hover:text-white transition-colors">Lihat Detail</button>
                    </div>
                 </div>
               ))}
               <div className="p-6 bg-emerald-600/5 border border-emerald-500/20 rounded-[2rem] text-center">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase mb-4 tracking-widest">Upgrade Hub</p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 italic">"Berdasarkan siklus rilis hardware, unit Anda diprediksi membutuhkan upgrade komponen pada Q1 2025."</p>
                  <button className="w-full py-3 bg-emerald-600 text-white text-[9px] font-black uppercase rounded-xl shadow-lg">Analisis Kebutuhan Upgrade</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SmartHub;