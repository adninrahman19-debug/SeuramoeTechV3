
import React, { useState } from 'react';
import StatCard from '../../components/Shared/StatCard';
import { ICONS } from '../../constants';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const salesData = [
  { name: 'Mon', sales: 4200000, repairs: 1200000 },
  { name: 'Tue', sales: 5100000, repairs: 900000 },
  { name: 'Wed', sales: 3200000, repairs: 2500000 },
  { name: 'Thu', sales: 8400000, repairs: 1800000 },
  { name: 'Fri', sales: 6100000, repairs: 2100000 },
  { name: 'Sat', sales: 9200000, repairs: 3500000 },
  { name: 'Sun', sales: 7500000, repairs: 1500000 },
];

const mixData = [
  { name: 'Product Sales', value: 70, color: '#6366f1' },
  { name: 'Service Fees', value: 30, color: '#10b981' },
];

const bestSellers = [
  { name: 'Asus ROG G14', qty: 12, growth: '+15%' },
  { name: 'MacBook Air M2', qty: 9, growth: '+8%' },
  { name: 'Logitech MX 3S', qty: 24, growth: '+40%' },
  { name: 'iPhone 15 Pro', qty: 7, growth: '-2%' },
];

const OwnerOverview: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* 1. Real-Time KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1: Financials & Orders */}
        <StatCard 
          label="Today's Sales" 
          value="Rp 8.42M" 
          trend="+12.5%" 
          icon={<ICONS.Package className="w-6 h-6" />} 
          colorClass="indigo" 
        />
        <StatCard 
          label="Active Orders" 
          value="18" 
          trend="4 Pending" 
          icon={<ICONS.Ticket className="w-6 h-6" />} 
          colorClass="emerald" 
        />
        <StatCard 
          label="Active Products" 
          value="142" 
          icon={<ICONS.Store className="w-6 h-6" />} 
          colorClass="violet" 
        />
        <StatCard 
          label="Low Stock Alerts" 
          value="7 Items" 
          trend="Action Needed" 
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} 
          colorClass="rose" 
        />

        {/* Row 2: Service & Reputation */}
        <StatCard 
          label="Active Service Hub" 
          value="12 Tickets" 
          trend="2 Urgent" 
          icon={<ICONS.Dashboard className="w-6 h-6" />} 
          colorClass="amber" 
        />
        <StatCard 
          label="Store Rating" 
          value="4.9 / 5" 
          trend="98 Reviews" 
          icon={<ICONS.Users className="w-6 h-6" />} 
          colorClass="blue" 
        />
        <StatCard 
          label="Subscription" 
          value="PRO PLAN" 
          trend="Expires in 14d" 
          icon={<ICONS.Plus className="w-6 h-6" />} 
          colorClass="indigo" 
        />
        <StatCard 
          label="Staff Quota" 
          value="8 / 10" 
          trend="2 Seats Left" 
          icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
          colorClass="slate" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Main Sales Chart */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                Store Performance Trend
              </h3>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Revenue Comparison: Sales vs Service</p>
            </div>
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
               {['24h', '7d', '30d'].map(r => (
                 <button 
                  key={r} 
                  onClick={() => setTimeRange(r)}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${timeRange === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
                 >
                   {r}
                 </button>
               ))}
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRepairs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `Rp${v/1000000}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="sales" name="Product Sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="repairs" name="Service Fees" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRepairs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Mix & Quick Actions */}
        <div className="space-y-8">
          {/* Revenue Distribution */}
          <div className="glass-panel p-8 rounded-3xl border-slate-800 flex flex-col items-center">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 self-start">Revenue Mix</h3>
             <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={mixData}
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {mixData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                   </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="w-full space-y-2 mt-4">
                {mixData.map(d => (
                  <div key={d.name} className="flex justify-between items-center text-[10px] font-bold">
                    <div className="flex items-center gap-2 text-slate-500">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                       {d.name}
                    </div>
                    <span className="text-white">{d.value}%</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Quick Command Hub */}
          <div className="glass-panel p-8 rounded-3xl border-slate-800">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Operations Hub</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="w-full p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center gap-4 transition-all shadow-xl shadow-indigo-600/20 group">
                <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform"><ICONS.Plus className="w-5 h-5" /></div>
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-widest">Add Product</p>
                  <p className="text-[9px] opacity-70">Update store inventory</p>
                </div>
              </button>
              
              <button className="w-full p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 rounded-2xl flex items-center gap-4 transition-all group">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><ICONS.Users className="w-5 h-5" /></div>
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-widest">New Staff Account</p>
                  <p className="text-[9px] text-slate-500">Expand your local team</p>
                </div>
              </button>

              <button className="w-full p-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 rounded-2xl flex items-center gap-4 transition-all group">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-widest">Store Reports</p>
                  <p className="text-[9px] text-slate-500">Deep dive analytics export</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Intelligence Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="glass-panel p-8 rounded-3xl border-slate-800">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white tracking-tight">Catalog Intelligence</h3>
              <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">See All Rankings</button>
           </div>
           <div className="space-y-4">
              {bestSellers.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 hover:border-indigo-500/30 transition-all">
                   <div className="flex items-center gap-4">
                      <span className="text-xl font-black text-slate-700">#0{idx+1}</span>
                      <div>
                         <p className="text-sm font-bold text-white">{item.name}</p>
                         <p className="text-[10px] text-slate-500 uppercase font-black">{item.qty} Units Sold This Week</p>
                      </div>
                   </div>
                   <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${item.growth.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                      {item.growth}
                   </span>
                </div>
              ))}
           </div>
        </div>

        {/* Promo Conversion Placeholder */}
        <div className="glass-panel p-8 rounded-3xl border-slate-800">
           <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Active Promo Conversion</h3>
           <div className="space-y-6">
              {[
                { label: 'Ramadan Regional Sale', conv: 42, active: true },
                { label: 'Aceh Tech Weekend', conv: 28, active: true },
                { label: 'Banda Aceh Fair 24', conv: 15, active: false },
              ].map(promo => (
                <div key={promo.label} className="space-y-2">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <span className={`w-1.5 h-1.5 rounded-full ${promo.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></span>
                         <span className="text-xs font-bold text-slate-300">{promo.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-indigo-400">{promo.conv}% CVR</span>
                   </div>
                   <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${promo.conv}%` }}></div>
                   </div>
                </div>
              ))}
              <button className="w-full py-4 mt-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">
                Configure New Campaign
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerOverview;
