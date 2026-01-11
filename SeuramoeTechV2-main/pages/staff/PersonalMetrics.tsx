import React from 'react';
import { UserRole } from '../../types';
import { ICONS } from '../../constants';

interface PersonalMetricsProps {
  role: UserRole;
}

const PersonalMetrics: React.FC<PersonalMetricsProps> = ({ role }) => {
  const isTechnician = role === UserRole.TECHNICIAN;

  return (
    <div className="space-y-4">
      <div className="glass-panel p-6 rounded-3xl border-slate-800 shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            {isTechnician ? <ICONS.Settings className="w-20 h-20" /> : <ICONS.Package className="w-20 h-20" />}
         </div>
         <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Today's Mission Progress</p>
            <div className="flex items-baseline gap-2">
               <span className="text-4xl font-black text-white">3</span>
               <span className="text-lg font-bold text-slate-600">/ 5 Tasks</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full mt-4 overflow-hidden border border-slate-800">
               <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '60%' }}></div>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold mt-2 uppercase tracking-tight">On track for daily bonus</p>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="glass-panel p-5 rounded-3xl border-slate-800">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Rating</p>
            <div className="flex items-center gap-1.5">
               <span className="text-xl font-black text-white">4.9</span>
               <div className="text-amber-400 text-xs">★★★★★</div>
            </div>
         </div>
         <div className="glass-panel p-5 rounded-3xl border-slate-800">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Response Time</p>
            <span className="text-xl font-black text-indigo-400">1.8h</span>
         </div>
      </div>
    </div>
  );
};

export default PersonalMetrics;