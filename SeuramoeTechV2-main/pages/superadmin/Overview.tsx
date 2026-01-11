
import React, { useState } from 'react';
import StatCard from '../../components/Shared/StatCard';
import { ICONS } from '../../constants';
import { User, Store } from '../../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';

interface OverviewProps {
  owners: User[];
  stores: Store[];
  pendingApprovals: User[];
  totalMRR: number;
  revenueConfig: any;
  onApprove: (id: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ owners, stores, pendingApprovals, totalMRR, revenueConfig, onApprove }) => {
  const [chartView, setChartView] = useState<'revenue' | 'growth'>('revenue');

  // Mock data for charts
  const performanceData = [
    { name: 'Jan', rev: 45, users: 120 },
    { name: 'Feb', rev: 52, users: 145 },
    { name: 'Mar', rev: 48, users: 160 },
    { name: 'Apr', rev: 61, users: 190 },
    { name: 'May', rev: 75, users: 210 },
    { name: 'Jun', rev: 89, users: 240 },
  ];

  const planDistribution = [
    { name: 'Basic', value: 40, color: '#6366f1' },
    { name: 'Pro', value: 35, color: '#8b5cf6' },
    { name: 'Enterprise', value: 25, color: '#ec4899' },
  ];

  const arrValue = totalMRR * 12;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* 1. Metrics Cards (Real-Time) - 3x3 Grid on Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard label="Total Owners" value={owners.length} trend="+12%" icon={<ICONS.Users />} colorClass="indigo" />
        <StatCard label="Total Stores" value={stores.length} trend="+5" icon={<ICONS.Store />} colorClass="emerald" />
        <StatCard label="Active Subs" value={owners.filter(o => o.isSubscriptionActive).length} trend="+8%" icon={<ICONS.Ticket />} colorClass="violet" />
        <StatCard label="Platform Growth" value="24.5%" trend="+4.2%" icon={<ICONS.Dashboard />} colorClass="rose" />
        
        <StatCard label="MRR (Monthly)" value={`Rp ${(totalMRR/1000000).toFixed(1)}M`} trend="+18%" icon={<ICONS.Package />} colorClass="indigo" />
        <StatCard label="ARR (Annual)" value={`Rp ${(arrValue/1000000000).toFixed(2)}B`} trend="+22%" icon={<ICONS.Package />} colorClass="blue" />
        <StatCard label="Total Products" value="12,450" icon={<ICONS.Package />} colorClass="amber" />
        <StatCard label="Service Tickets" value="1,892" icon={<ICONS.Ticket />} colorClass="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Analytics Charts - Main Panel */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                Platform Intelligence
              </h3>
              <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                <button 
                  onClick={() => setChartView('revenue')}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${chartView === 'revenue' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Revenue
                </button>
                <button 
                  onClick={() => setChartView('growth')}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${chartView === 'growth' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Registrations
                </button>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'revenue' ? (
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="rev" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                ) : (
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: '#1e293b', opacity: 0.4}}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    />
                    <Bar dataKey="users" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Heatmap Placeholder */}
          <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                  Store Activity Heatmap (Aceh–Sumatra)
                </h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Node Status</span>
             </div>
             <div className="grid grid-cols-7 sm:grid-cols-12 gap-2">
                {Array.from({length: 48}).map((_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-md transition-all cursor-help ${
                      i % 7 === 0 ? 'bg-indigo-500/80 shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 
                      i % 5 === 0 ? 'bg-emerald-500/60' : 
                      i % 3 === 0 ? 'bg-slate-800' : 'bg-slate-900/50'
                    }`}
                    title={`Region Node ${i+1}: ${i % 7 === 0 ? 'High Traffic' : 'Stable'}`}
                  ></div>
                ))}
             </div>
             <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-black tracking-tighter">
                   <div className="w-2 h-2 rounded-sm bg-slate-900/50"></div> Idle
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-black tracking-tighter">
                   <div className="w-2 h-2 rounded-sm bg-emerald-500/60"></div> Active
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-black tracking-tighter">
                   <div className="w-2 h-2 rounded-sm bg-indigo-500/80"></div> Peak
                </div>
             </div>
          </div>
        </div>

        {/* 3. Quick Actions & Distribution */}
        <div className="space-y-8">
          <div className="glass-panel p-8 rounded-3xl border-slate-800 flex flex-col items-center">
            <h3 className="text-lg font-bold text-white mb-6 self-start">Subscription Share</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 w-full pt-6 border-t border-slate-800">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Retention Rate</span>
                  <span className="text-xs font-black text-emerald-400">94.2%</span>
               </div>
               <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[94.2%]"></div>
               </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="glass-panel p-8 rounded-3xl border-slate-800">
            <h3 className="text-lg font-bold text-white mb-6">Quick Operations</h3>
            <div className="space-y-3">
              <button className="w-full p-4 bg-slate-900/50 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/50 rounded-2xl text-left flex items-center gap-4 transition-all group">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ICONS.Plus className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Create New Plan</p>
                  <p className="text-[10px] text-slate-500">Add subscription tier</p>
                </div>
              </button>
              
              <button className="w-full p-4 bg-slate-900/50 hover:bg-rose-600/20 border border-slate-800 hover:border-rose-500/50 rounded-2xl text-left flex items-center gap-4 transition-all group">
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg group-hover:bg-rose-600 group-hover:text-white transition-colors">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Global Announcement</p>
                  <p className="text-[10px] text-slate-500">Broadcast to all owners</p>
                </div>
              </button>

              <button className="w-full p-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 rounded-2xl text-left flex items-center gap-4 transition-all group">
                <div className="p-2 bg-slate-800 text-slate-400 rounded-lg group-hover:text-white transition-colors">
                  <ICONS.Settings className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Platform Health</p>
                  <p className="text-[10px] text-slate-500">Check server nodes</p>
                </div>
              </button>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-slate-800">
            <h3 className="text-lg font-bold text-white mb-6">Approval Queue</h3>
            {pendingApprovals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-600">
                <ICONS.Users className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-xs font-bold uppercase tracking-widest">Queue Clear</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map(o => (
                  <div key={o.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-indigo-500/30 transition-all">
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{o.fullName}</p>
                      <p className="text-[10px] text-slate-500 truncate">@{o.username}</p>
                    </div>
                    <button onClick={() => onApprove(o.id)} className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg transition-all shadow-lg shadow-emerald-600/20">APPROVE</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
