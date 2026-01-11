
import React, { useState, useEffect } from 'react';
import CampaignService from '../../services/CampaignService';
import StoreService from '../../services/StoreService';
import { GlobalCampaign, Banner, Store } from '../../types';
import { ICONS } from '../../constants';

const CampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<GlobalCampaign[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCampaigns(CampaignService.getCampaigns());
    setBanners(CampaignService.getBanners());
    setStores(StoreService.getAllStores());
  };

  const handleToggleBanner = (id: string) => {
    CampaignService.toggleBanner(id);
    loadData();
  };

  const toggleFeaturedStore = (id: string) => {
    const s = stores.find(st => st.id === id);
    if (s) {
      StoreService.updateStoreStatus(id, s.status); // Just refresh logic in demo
      alert(`Featured status toggled for ${s.name}`);
    }
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Campaigns */}
        <div className="space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-white">Global Campaigns</h3>
              <button className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20">
                <ICONS.Plus className="w-5 h-5" />
              </button>
           </div>
           {campaigns.map(cmp => (
             <div key={cmp.id} className="glass-panel p-6 rounded-3xl border-slate-800 bg-indigo-600/5 hover:border-indigo-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                   <h4 className="text-lg font-bold text-white">{cmp.title}</h4>
                   <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded">Active</span>
                </div>
                <div className="flex items-center gap-6 mb-6">
                   <div className="text-center">
                      <p className="text-3xl font-black text-indigo-400">{cmp.discountRate}%</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Global Disc</p>
                   </div>
                   <div className="h-10 w-px bg-slate-800"></div>
                   <div>
                      <p className="text-xs text-slate-300 font-bold">{cmp.startDate} to {cmp.endDate}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Duration</p>
                   </div>
                </div>
                <button className="w-full py-3 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">Edit Campaign Params</button>
             </div>
           ))}
        </div>

        {/* Banner Placement */}
        <div className="space-y-6">
           <h3 className="text-xl font-black text-white">Banner Placements</h3>
           {banners.map(bnr => (
             <div key={bnr.id} className="glass-panel p-4 rounded-3xl border-slate-800 overflow-hidden group">
                <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800 relative">
                   <img src={bnr.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-all duration-700" alt="" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                   <div className="absolute bottom-4 left-4">
                      <p className="text-xs font-black text-white uppercase tracking-widest">{bnr.title}</p>
                      <p className="text-[9px] text-slate-400">Position: {bnr.position}</p>
                   </div>
                </div>
                <div className="flex justify-between items-center">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Home Reveal Banner</p>
                   <button 
                     onClick={() => handleToggleBanner(bnr.id)}
                     className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${bnr.isActive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'}`}
                   >
                     {bnr.isActive ? 'VISIBLE' : 'HIDDEN'}
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Featured Stores & Sponsored Products */}
      <div className="glass-panel p-8 rounded-3xl border-slate-800">
         <h3 className="text-xl font-black text-white mb-8">Ecosystem Curation</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest border-b border-slate-800 pb-2">Featured Stores</h4>
               <div className="space-y-2">
                  {stores.map(store => (
                    <div key={store.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                       <div>
                          <p className="text-sm font-bold text-white">{store.name}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">{store.location}</p>
                       </div>
                       <button 
                        onClick={() => toggleFeaturedStore(store.id)}
                        className="p-2 bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
                       >
                          <svg className={`w-5 h-5 ${store.isFeatured ? 'fill-indigo-500 text-indigo-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.05 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                       </button>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="space-y-4">
               <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest border-b border-slate-800 pb-2">Category Curation</h4>
               <div className="grid grid-cols-2 gap-3">
                  {['Laptops', 'Gaming', 'Mobile', 'Parts'].map(cat => (
                    <div key={cat} className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-between">
                       <span className="text-xs font-bold text-white">{cat}</span>
                       <div className="w-8 h-4 bg-indigo-600 rounded-full relative">
                          <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full py-4 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-700 transition-all border border-slate-700">Add Global Category</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CampaignManager;
