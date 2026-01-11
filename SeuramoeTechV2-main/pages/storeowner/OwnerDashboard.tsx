
import React from 'react';
import OwnerOverview from './OwnerOverview';
import StaffControl from './StaffControl';
import InventoryManager from './InventoryManager';
import ServiceHub from './ServiceHub';
import PromoManager from './PromoManager';
import MarketingHub from './MarketingHub';
import OrderManager from './OrderManager';
import FinancialsManager from './FinancialsManager';
import ReviewsComplaints from './ReviewsComplaints';
import BillingManager from './BillingManager';
import ReportsAnalytics from './ReportsAnalytics';
import StoreSettings from './StoreSettings';
import OwnerSecurity from './OwnerSecurity';
import OwnerIntelligence from './OwnerIntelligence';
import { ICONS } from '../../constants';
// Add comment: Fix missing user variable by importing AuthService
import AuthService from '../../auth/AuthService';

interface OwnerDashboardProps {
  activeTab: 'overview' | 'staff' | 'inventory' | 'tickets' | 'financials' | 'settings' | 'promo' | 'marketing' | 'orders' | 'feedback' | 'billing' | 'reports' | 'security' | 'smart';
  onTabChange: (tab: any) => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ activeTab, onTabChange }) => {
  // Add comment: Obtain the current user from AuthService
  const user = AuthService.getCurrentUser();

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <ICONS.Store className="w-7 h-7" />
           </div>
           <div>
             <h1 className="text-3xl font-black text-white tracking-tight">Store Command Center</h1>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-0.5">Aceh Tech Center • Operational Core</p>
           </div>
        </div>
        
        <div className="glass-panel p-1 rounded-2xl flex flex-wrap gap-1 shadow-2xl border-slate-800 overflow-x-auto max-w-full">
          {(['overview', 'smart', 'reports', 'billing', 'financials', 'orders', 'inventory', 'tickets', 'feedback', 'promo', 'marketing', 'staff', 'settings', 'security'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white'}`}
            >
              {tab === 'tickets' ? 'Service Hub' : 
               tab === 'financials' ? 'Payments' : 
               tab === 'settings' ? 'Store Settings' : 
               tab === 'promo' ? 'Discounts' : 
               tab === 'marketing' ? 'Growth' : 
               tab === 'orders' ? 'Fulfillment' : 
               tab === 'staff' ? 'Workforce' : 
               tab === 'feedback' ? 'Ulasan' : 
               tab === 'billing' ? 'SaaS Billing' : 
               tab === 'reports' ? 'Analitik' : 
               tab === 'security' ? 'Keamanan' : 
               tab === 'smart' ? '🧠 Smart Hub' : tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && <OwnerOverview />}
      {activeTab === 'reports' && <ReportsAnalytics />}
      {activeTab === 'billing' && <BillingManager />}
      {activeTab === 'staff' && <StaffControl />}
      {activeTab === 'inventory' && <InventoryManager />}
      {activeTab === 'tickets' && <ServiceHub />}
      {activeTab === 'promo' && <PromoManager />}
      {activeTab === 'marketing' && <MarketingHub />}
      {activeTab === 'orders' && <OrderManager />}
      {activeTab === 'financials' && <FinancialsManager />}
      {activeTab === 'feedback' && <ReviewsComplaints />}
      {activeTab === 'settings' && <StoreSettings />}
      {activeTab === 'security' && <OwnerSecurity />}
      {activeTab === 'smart' && <OwnerIntelligence />}
      
      {/* Footer Status for Owner */}
      <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Store Node Sum-North-01: Operational</p>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Subscription Status:</span>
            <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest">{user?.subscriptionTier} PLAN - ACTIVE</span>
         </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
