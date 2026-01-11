
import React from 'react';
import StatCard from '../../components/Shared/StatCard';
import { ICONS } from '../../constants';

interface PerformanceStatsProps {
  isTechnician: boolean;
}

const PerformanceStats: React.FC<PerformanceStatsProps> = ({ isTechnician }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        label={isTechnician ? "Pending Repairs" : "Pending Orders"} 
        value="12" 
        icon={<ICONS.Ticket />} 
        colorClass="amber" 
      />
      <StatCard 
        label="Completed Today" 
        value="5" 
        trend="+2" 
        icon={<ICONS.Dashboard />} 
        colorClass="emerald" 
      />
      <StatCard 
        label="Customer Rating" 
        value="4.9/5" 
        icon={<ICONS.Users />} 
        colorClass="indigo" 
      />
    </div>
  );
};

export default PerformanceStats;
