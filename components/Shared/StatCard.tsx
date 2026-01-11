import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, icon, colorClass = "indigo" }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border-slate-800 hover:border-indigo-500/50 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-${colorClass}-500/10 text-${colorClass}-400 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;