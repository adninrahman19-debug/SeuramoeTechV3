
import React, { useState, useEffect } from 'react';
import SmartService, { StockRecommendation, DemandPrediction, PromoInsight } from '../../services/SmartService';
import { ICONS } from '../../constants';
import StatCard from '../../components/Shared/StatCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, ComposedChart, Line
} from 'recharts';

const OwnerIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prediction' | 'inventory' | 'marketing'>('prediction');
  const [recommendations, setRecommendations] = useState<StockRecommendation[]>([]);
  const [predictions, setPredictions] = useState<DemandPrediction[]>([]);
  const [insights, setInsights] = useState<PromoInsight[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    setRecommendations(SmartService.getStockRecommendations());
    setPredictions(SmartService.getDemandPredictions());
    setInsights(SmartService.getPromoInsights());
    setReminders(SmartService.getSmartReminders());
  }, []);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30 animate-pulse">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" /></svg>
           </div>
           <div>
             <h2 className="text-3xl font-black text-white tracking-tight">Neural Intelligence Hub</h2>
             <p className="text-sm text-slate-500 font-medium">Platform Brain: Predictive analytics and autonomous business insights.</p>
           </div>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-lg">
          {(['prediction', 'inventory', 'marketing'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
            >
              {t === 'prediction' ? 'Demand Forecast' : t === 'inventory' ? 'Stock Smart' : 'Marketing ROI'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          
          {activeTab === 'prediction' && (
            <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-2xl relative overflow-hidden">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                     <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                     Next-Gen Sales Projection (7 Days)
                  </h3>
                  <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                     Model Confidence: 94.2%
                  </div>
               </div>
               <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={predictions}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                       <XAxis dataKey="date" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                       <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `Rp${v/1000000}M`} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                         itemStyle={{ color: '#fff', fontSize: '10px' }}
                       />
                       <Area type="monotone" dataKey="predictedSales" fill="#6366f1" fillOpacity={0.1} stroke="#6366f1" strokeWidth={3} name="Predicted Revenue" />
                       <Line type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Confidence Index" yAxisId={1} />
                    </ComposedChart>
                  </ResponsiveContainer>
               </div>
               <div className="mt-8 p-6 bg-slate-950/50 border border-slate-800 rounded-3xl">
                  <p className="text-xs font-bold text-white mb-2 uppercase tracking-tight flex items-center gap-2">
                     <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     System Insight
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">"Berdasarkan tren mingguan di Aceh, diprediksi akan terjadi lonjakan permintaan pada <span className="text-indigo-400 font-black">Sabtu</span> ini sebesar 15% di kategori Gaming. Pastikan teknisi bersiap untuk antrean servis yang lebih tinggi."</p>
               </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatCard label="Stock Health" value="82%" trend="+4%" icon={<ICONS.Package />} colorClass="indigo" />
                  <StatCard label="Dead Stock Potential" value="Rp 12.5M" trend="Warning" icon={<ICONS.Ticket />} colorClass="rose" />
               </div>
               
               <div className="glass-panel p-8 rounded-3xl border-slate-800">
                  <h3 className="text-xl font-bold text-white mb-8">AI-Powered Stock Recommendations</h3>
                  <div className="space-y-4">
                    {recommendations.map(rec => (
                      <div key={rec.id} className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl hover:border-indigo-500/30 transition-all group">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-6">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                                 rec.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' :
                                 rec.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'
                               }`}>
                                 {rec.suggestedOrder}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors">{rec.productName}</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Suggested Reorder Quantity</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <div className="text-right">
                                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Current Stock</p>
                                  <p className="text-xs font-bold text-white">{rec.currentStock} Units</p>
                               </div>
                               <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg">Create PO</button>
                            </div>
                         </div>
                         <div className="mt-6 pt-6 border-t border-slate-800 flex items-start gap-3">
                            <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-[10px] text-slate-400 leading-relaxed italic">"{rec.reason}"</p>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {insights.map(ins => (
                    <div key={ins.promoName} className="glass-panel p-8 rounded-3xl border-slate-800 bg-indigo-600/5 hover:border-indigo-500/40 transition-all flex flex-col justify-between h-full">
                       <div>
                          <div className="flex justify-between items-start mb-6">
                             <h4 className="text-lg font-bold text-white">{ins.promoName}</h4>
                             <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-2xl border border-indigo-500/20"><ICONS.Ticket className="w-5 h-5" /></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-8">
                             <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Marketing ROI</p>
                                <p className="text-xl font-black text-emerald-400">{ins.roi}x</p>
                             </div>
                             <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Conv. Boost</p>
                                <p className="text-xl font-black text-indigo-400">+{ins.conversionBoost}%</p>
                             </div>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3">
                             <svg className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                             <p className="text-[10px] text-slate-300 leading-relaxed font-bold uppercase tracking-tight">{ins.recommendation}</p>
                          </div>
                          <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">Optimize Strategy</button>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="glass-panel p-8 rounded-3xl border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-6">Regional Buying Sentiment (Sumatra)</h3>
                  <div className="h-48 w-full flex items-end gap-3 px-4">
                     {[40, 60, 45, 90, 65, 80, 55].map((h, i) => (
                       <div key={i} className="flex-1 group relative">
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white px-2 py-1 rounded text-[8px] font-black">
                            {h}%
                          </div>
                          <div className="w-full bg-slate-900 border border-slate-800 rounded-t-xl transition-all group-hover:bg-indigo-500/50" style={{ height: `${h}%` }}></div>
                       </div>
                     ))}
                  </div>
                  <div className="flex justify-between mt-4 px-2 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                     <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="glass-panel p-6 rounded-3xl border-slate-800">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center justify-between">
                 Neural Reminders
                 <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              </h4>
              <div className="space-y-3">
                 {reminders.map(rem => (
                   <div key={rem.id} className={`p-4 rounded-2xl border flex items-start gap-3 group cursor-pointer transition-all hover:scale-[1.02] ${
                     rem.type === 'urgent' ? 'bg-rose-600/5 border-rose-500/20 hover:border-rose-500/50' :
                     rem.type === 'warning' ? 'bg-amber-600/5 border-amber-500/20 hover:border-amber-500/50' :
                     rem.type === 'success' ? 'bg-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/50' :
                     'bg-slate-900 border-slate-800 hover:border-indigo-500/50'
                   }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        rem.type === 'urgent' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]' :
                        rem.type === 'warning' ? 'bg-amber-500' :
                        rem.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}></div>
                      <div>
                         <p className="text-[11px] font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{rem.title}</p>
                         <p className="text-[9px] text-slate-500 leading-tight uppercase font-medium">{rem.message}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-3 bg-slate-800 border border-slate-700 hover:text-white text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all">Clear Resolved</button>
           </div>

           <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-3xl shadow-2xl shadow-indigo-600/30">
              <h4 className="text-lg font-black mb-4 tracking-tighter">Upgrade Brain Capacity</h4>
              <p className="text-xs opacity-80 leading-relaxed mb-8">Enterprise Tier membuka fitur <span className="font-black">Auto-Restock</span> dan <span className="font-black">Dynamic Pricing</span> yang menyesuaikan harga dengan kompetitor secara real-time.</p>
              <button className="w-full py-4 bg-white text-indigo-600 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-xl">Explore Plans</button>
           </div>

           <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Regional Alert Node</h4>
              <div className="flex items-center gap-4">
                 <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[88%]"></div>
                 </div>
                 <span className="text-[10px] font-black text-emerald-400">Sum-N-01 OK</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerIntelligence;
