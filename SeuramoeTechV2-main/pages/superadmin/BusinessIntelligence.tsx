
import React, { useState, useEffect } from 'react';
import AnalyticsService from '../../services/AnalyticsService';
import { PerformanceRank, StaffMetric } from '../../types';
import { ICONS } from '../../constants';
import StatCard from '../../components/Shared/StatCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, Area, Cell, Legend
} from 'recharts';

const BusinessIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'rankings' | 'staff'>('revenue');
  const [storeRanks, setStoreRanks] = useState<PerformanceRank[]>([]);
  const [staffMetrics, setStaffMetrics] = useState<StaffMetric[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);

  useEffect(() => {
    setStoreRanks(AnalyticsService.getStoreRankings());
    setStaffMetrics(AnalyticsService.getStaffProductivity());
    setForecast(AnalyticsService.getRevenueForecast());
  }, []);

  const handleExport = (format: 'PDF' | 'EXCEL' | 'CSV') => {
    alert(`Generating platform-wide ${format} report... Download will begin shortly.`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white">Business Intelligence HQ</h2>
          <p className="text-sm text-slate-500">Cross-ecosystem performance analysis and forecasting.</p>
        </div>
        <div className="flex gap-2">
           <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
             <button onClick={() => handleExport('PDF')} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors" title="Export PDF"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth={1.5} /></svg></button>
             <button onClick={() => handleExport('EXCEL')} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors" title="Export Excel"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={1.5} /></svg></button>
           </div>
           <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800">
             {(['revenue', 'rankings', 'staff'] as const).map(t => (
               <button
                 key={t}
                 onClick={() => setActiveTab(t)}
                 className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
               >
                 {t}
               </button>
             ))}
           </div>
        </div>
      </div>

      {activeTab === 'revenue' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Projected ARR" value="Rp 1.54B" trend="+12.4%" icon={<ICONS.Package />} colorClass="indigo" />
              <StatCard label="Avg. Order Value" value="Rp 4.2M" icon={<ICONS.Dashboard />} colorClass="emerald" />
              <StatCard label="Customer LTV" value="Rp 18.5M" icon={<ICONS.Users />} colorClass="violet" />
           </div>

           <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-8">Revenue Forecast & Projection</h3>
              <div className="h-[400px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={forecast}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                       <XAxis dataKey="month" stroke="#475569" fontSize={12} axisLine={false} tickLine={false} />
                       <YAxis stroke="#475569" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000000}M`} />
                       <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                       <Legend verticalAlign="top" align="right" height={36}/>
                       <Area type="monotone" dataKey="projected" fill="#6366f1" fillOpacity={0.1} stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" name="Projected Rev" />
                       <Bar dataKey="actual" fill="#10b981" radius={[8, 8, 0, 0]} name="Actual Rev" barSize={60} />
                    </ComposedChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'rankings' && (
        <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
           <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Top Performing Stores</h3>
              <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">See Region Rankings</button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-900/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                       <th className="px-8 py-5">Rank & Store</th>
                       <th className="px-8 py-5">Platform Score</th>
                       <th className="px-8 py-5">Financial Impact</th>
                       <th className="px-8 py-5">Service Health</th>
                       <th className="px-8 py-5 text-right">Trend</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                    {storeRanks.map((rank, idx) => (
                       <tr key={rank.id} className="hover:bg-slate-800/20 transition-all group">
                          <td className="px-8 py-4">
                             <div className="flex items-center gap-6">
                                <span className={`text-2xl font-black ${idx < 3 ? 'text-indigo-400' : 'text-slate-700'}`}>#0{idx+1}</span>
                                <div>
                                   <p className="text-sm font-bold text-white">{rank.name}</p>
                                   <p className="text-[10px] text-slate-500 font-bold uppercase">{rank.location}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-4">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center font-black text-xs text-emerald-400">
                                   {rank.score}
                                </div>
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Global Index</span>
                             </div>
                          </td>
                          <td className="px-8 py-4">
                             <p className="text-sm font-black text-white">Rp {(rank.totalSales/1000000).toFixed(1)}M</p>
                             <p className="text-[9px] text-indigo-500 font-black uppercase">Gross Volume</p>
                          </td>
                          <td className="px-8 py-4">
                             <div className="flex items-center gap-2">
                                <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                   <div className="bg-indigo-500 h-full" style={{width: `${rank.ticketResolutionRate}%`}}></div>
                                </div>
                                <span className="text-[10px] font-black text-white">{rank.ticketResolutionRate}%</span>
                             </div>
                          </td>
                          <td className="px-8 py-4 text-right">
                             {rank.trend === 'up' ? (
                                <svg className="w-5 h-5 text-emerald-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeWidth={2}/></svg>
                             ) : (
                                <svg className="w-5 h-5 text-slate-600 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" strokeWidth={2}/></svg>
                             )}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border-slate-800">
              <h3 className="text-xl font-bold text-white mb-8">Staff Productivity Index</h3>
              <div className="space-y-6">
                 {staffMetrics.map(staff => (
                    <div key={staff.id} className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-indigo-500/30 transition-all group">
                       <div className="flex items-center gap-4">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`} className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800" alt="" />
                          <div>
                             <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{staff.name}</p>
                             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{staff.storeName}</p>
                          </div>
                       </div>
                       <div className="flex gap-12 items-center">
                          <div className="text-center">
                             <p className="text-lg font-black text-white">{staff.ticketsResolved}</p>
                             <p className="text-[9px] text-slate-500 font-bold uppercase">Resolved</p>
                          </div>
                          <div className="text-center">
                             <p className="text-lg font-black text-indigo-400">{staff.avgResolutionTime}</p>
                             <p className="text-[9px] text-slate-500 font-bold uppercase">Avg Time</p>
                          </div>
                          <div className="text-center">
                             <p className="text-lg font-black text-emerald-400">{staff.satisfaction}</p>
                             <p className="text-[9px] text-slate-500 font-bold uppercase">Rating</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <div className="glass-panel p-8 rounded-3xl border-slate-800">
                 <h3 className="text-lg font-bold text-white mb-6">Aggregate Satisfaction</h3>
                 <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="440" strokeDashoffset="44" className="text-indigo-500" />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black text-white">4.6</span>
                          <span className="text-[10px] text-slate-500 font-black uppercase">C-SAT SCORE</span>
                       </div>
                    </div>
                    <div className="mt-8 space-y-3 w-full">
                       <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-500 uppercase">Response Time</span>
                          <span className="text-white">Avg 4.8 Hours</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-500 uppercase">Issue Clarity</span>
                          <span className="text-white">92% Precision</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="glass-panel p-8 rounded-3xl border-slate-800 bg-indigo-600/5">
                 <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">Export Schedule</h3>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                       <span className="text-xs text-white">Weekly PDF Summary</span>
                       <span className="text-[10px] font-black text-emerald-400">MON 08:00</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                       <span className="text-xs text-white">Monthly Excel Audit</span>
                       <span className="text-[10px] font-black text-emerald-400">1st DAY</span>
                    </div>
                 </div>
                 <button className="w-full mt-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-indigo-500 transition-all">Setup Auto-Export</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BusinessIntelligence;
