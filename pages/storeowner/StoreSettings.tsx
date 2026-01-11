import React, { useState, useEffect } from 'react';
import StoreConfigService from '../../services/StoreConfigService';
import AuthService from '../../auth/AuthService';
import { StoreConfig } from '../../types';
import { ICONS } from '../../constants';

const StoreSettings: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'hours'>('profile');
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.storeId) {
      setConfig(StoreConfigService.getConfig(user.storeId));
    }
  }, []);

  const handleSave = () => {
    if (user?.storeId && config) {
      setIsSaving(true);
      setTimeout(() => {
        StoreConfigService.saveConfig(user.storeId!, config);
        setIsSaving(false);
        alert("Konfigurasi toko berhasil diperbarui di regional node Sumatra.");
      }, 800);
    }
  };

  if (!config) return null;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Operational Configurations</h2>
          <p className="text-sm text-slate-500 font-medium">Fine-tune your store's behavior, brand identity, and local node settings.</p>
        </div>
        
        <div className="flex gap-2">
           <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-lg">
             {(['profile', 'hours', 'system'] as const).map(t => (
               <button
                 key={t}
                 onClick={() => setActiveTab(t)}
                 className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
               >
                 {t}
               </button>
             ))}
           </div>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-2"
           >
             {isSaving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3}/></svg>}
             {isSaving ? 'Saving...' : 'Deploy Changes'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'profile' && (
            <div className="glass-panel p-8 rounded-3xl border-slate-800 space-y-8 shadow-2xl">
               <div className="flex items-center gap-6 pb-8 border-b border-slate-800">
                  <div className="relative group">
                     <div className="w-24 h-24 rounded-3xl bg-slate-950 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all cursor-pointer">
                        <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg>
                        <span className="text-[8px] font-black uppercase">Upload Logo</span>
                     </div>
                  </div>
                  <div className="flex-1">
                     <h3 className="text-lg font-bold text-white mb-2">Store Branding Assets</h3>
                     <p className="text-xs text-slate-500 leading-relaxed italic">"Logo Anda akan muncul pada invoice digital, platform marketplace, dan notifikasi WhatsApp ke pelanggan regional."</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Store Legal Name</label>
                     <input type="text" value={user?.username || 'Aceh Tech Center'} readOnly className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-400 font-bold opacity-50 cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Public Storefront Email</label>
                     <input type="email" defaultValue="support@acehtech.com" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Regional Store Location / Address</label>
                  <textarea rows={3} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" defaultValue="Jl. Teuku Nyak Arief No. 12, Syiah Kuala, Banda Aceh, 23111"></textarea>
               </div>

               <div className="pt-8 border-t border-slate-800">
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">Social Connectivity</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500">Instagram</label>
                        <input 
                          type="text" 
                          value={config.socials.instagram} 
                          onChange={e => setConfig(prev => prev ? {...prev, socials: {...prev.socials, instagram: e.target.value}} : null)} 
                          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500">Facebook Page</label>
                        <input 
                          type="text" 
                          value={config.socials.facebook} 
                          onChange={e => setConfig(prev => prev ? {...prev, socials: {...prev.socials, facebook: e.target.value}} : null)} 
                          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500">Official WhatsApp</label>
                        <input 
                          type="text" 
                          value={config.socials.whatsapp} 
                          onChange={e => setConfig(prev => prev ? {...prev, socials: {...prev.socials, whatsapp: e.target.value}} : null)} 
                          className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" 
                        />
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="glass-panel p-8 rounded-3xl border-slate-800 space-y-8 shadow-2xl">
               <div>
                  <h3 className="text-xl font-bold text-white mb-2">Operational Schedule</h3>
                  <p className="text-xs text-slate-500 font-medium">Atur jam buka toko Anda. Pelanggan tidak dapat melakukan pesanan saat toko berstatus TUTUP.</p>
               </div>
               <div className="space-y-3">
                  {(Object.entries(config.hours) as [string, { open: string; close: string; isClosed: boolean }][]).map(([day, hrs]) => (
                    <div key={day} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-2xl group hover:border-indigo-500/30 transition-all">
                       <div className="flex items-center gap-4 w-32">
                          <span className="text-xs font-black uppercase text-white">{day}</span>
                       </div>
                       <div className="flex items-center gap-8 flex-1 justify-center">
                          {!hrs.isClosed ? (
                            <>
                               <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase">Open</span>
                                  <input 
                                    type="time" 
                                    value={hrs.open} 
                                    onChange={e => setConfig(prev => prev ? {...prev, hours: {...prev.hours, [day]: {...hrs, open: e.target.value}}} : null)} 
                                    className="bg-slate-900 border border-slate-800 text-xs text-indigo-400 p-1.5 rounded-lg outline-none" 
                                  />
                               </div>
                               <div className="w-4 h-px bg-slate-800"></div>
                               <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-bold text-slate-500 uppercase">Close</span>
                                  <input 
                                    type="time" 
                                    value={hrs.close} 
                                    onChange={e => setConfig(prev => prev ? {...prev, hours: {...prev.hours, [day]: {...hrs, close: e.target.value}}} : null)} 
                                    className="bg-slate-900 border border-slate-800 text-xs text-rose-400 p-1.5 rounded-lg outline-none" 
                                  />
                               </div>
                            </>
                          ) : (
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">STORE CLOSED FOR OPERATIONS</span>
                          )}
                       </div>
                       <div className="flex justify-end w-32">
                          <button 
                            onClick={() => setConfig(prev => prev ? {...prev, hours: {...prev.hours, [day]: {...hrs, isClosed: !hrs.isClosed}}} : null)}
                            className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${hrs.isClosed ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-white'}`}
                          >
                             {hrs.isClosed ? 'Open This Day' : 'Mark Closed'}
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
               <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                     <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth={2}/></svg>
                     Financial & Payment Rules
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Enabled Gateways</h4>
                        <div className="space-y-3">
                           {[
                             { id: 'manualTransfer', label: 'Manual Bank Transfer (Aceh)', icon: <ICONS.Plus className="w-4 h-4" /> },
                             { id: 'paymentGateway', label: 'Digital Payment Hub (QRIS/E-Wallet)', icon: <ICONS.Ticket className="w-4 h-4" /> },
                             { id: 'cod', label: 'Cash on Delivery (In-Store Pick)', icon: <ICONS.Store className="w-4 h-4" /> },
                           ].map(p => (
                             <label key={p.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer hover:border-indigo-500/30 transition-all group">
                                <div className="flex items-center gap-4">
                                   <div className="p-2 bg-slate-900 rounded-lg text-slate-500 group-hover:text-indigo-400">{p.icon}</div>
                                   <span className="text-xs font-bold text-slate-300">{p.label}</span>
                                </div>
                                <input 
                                  type="checkbox" 
                                  checked={(config.payments as any)[p.id]} 
                                  onChange={e => setConfig(prev => prev ? {...prev, payments: {...prev.payments, [p.id]: e.target.checked}} : null)}
                                  className="w-5 h-5 accent-indigo-600" 
                                />
                             </label>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Tax & Service Levies</h4>
                        <div className="space-y-4">
                           <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                              <div className="flex justify-between items-center mb-4">
                                 <label className="text-xs font-bold text-white">VAT / PPN Rate</label>
                                 <div className="flex items-center gap-2">
                                    <input 
                                      type="number" 
                                      value={config.financials.taxRate} 
                                      onChange={e => setConfig(prev => prev ? {...prev, financials: {...prev.financials, taxRate: parseInt(e.target.value)}} : null)} 
                                      className="w-16 bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-indigo-400 font-black outline-none" 
                                    />
                                    <span className="text-xs font-black text-slate-600">%</span>
                                 </div>
                              </div>
                              <p className="text-[9px] text-slate-500 italic">Diterapkan secara global pada semua katalog produk yang aktif.</p>
                           </div>
                           <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                              <div className="flex justify-between items-center mb-4">
                                 <label className="text-xs font-bold text-white">Base Service Fee</label>
                                 <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-600">RP</span>
                                    <input 
                                      type="number" 
                                      value={config.financials.serviceFee} 
                                      onChange={e => setConfig(prev => prev ? {...prev, financials: {...prev.financials, serviceFee: parseInt(e.target.value)}} : null)} 
                                      className="w-24 bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-emerald-400 font-black outline-none" 
                                    />
                                 </div>
                              </div>
                              <p className="text-[9px] text-slate-500 italic">Biaya admin flat untuk setiap service ticket (pemeriksaan awal).</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                     <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5H7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth={2}/></svg>
                     Ecosystem Connectivity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Logistics Hub</h4>
                        <div className="flex flex-wrap gap-2">
                           {['JNE', 'J&T Express', 'Sicepat', 'POS Indonesia', 'TIKI Aceh', 'Lion Parcel'].map(courier => (
                             <label key={courier} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase cursor-pointer border-2 transition-all ${
                               config.logistics.couriers.includes(courier) ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-900 text-slate-600 hover:border-slate-700'
                             }`}>
                               <input 
                                 type="checkbox" 
                                 className="hidden" 
                                 checked={config.logistics.couriers.includes(courier)} 
                                 onChange={() => {
                                   const newC = config.logistics.couriers.includes(courier) ? config.logistics.couriers.filter(c => c !== courier) : [...config.logistics.couriers, courier];
                                   setConfig(prev => prev ? {...prev, logistics: {...prev.logistics, couriers: newC}} : null);
                                 }}
                               />
                               {courier}
                             </label>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Notification Webhooks</h4>
                        <div className="space-y-3">
                           {Object.entries(config.notifications).map(([ch, active]) => (
                             <div key={ch} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                                <span className="text-xs font-bold text-slate-300 capitalize">{ch} Gateway</span>
                                <button 
                                  onClick={() => setConfig(prev => prev ? {...prev, notifications: {...prev.notifications, [ch]: !active}} : null)}
                                  className={`w-10 h-5 rounded-full relative transition-all ${active ? 'bg-indigo-600' : 'bg-slate-800'}`}
                                >
                                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`}></div>
                                </button>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
           <div className="glass-panel p-8 rounded-3xl border-slate-800">
              <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Store Node Status</h4>
              <div className="flex flex-col items-center py-6">
                 <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-indigo-500 flex items-center justify-center animate-spin-slow">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center animate-pulse">
                       <ICONS.Store className="w-8 h-8 text-white" />
                    </div>
                 </div>
                 <div className="mt-8 text-center">
                    <p className="text-xl font-black text-white">Healthy</p>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Sumatra-North Edge: Operational</p>
                 </div>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">Latency to HQ</span>
                    <span className="text-white">24ms</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">Last Node Sync</span>
                    <span className="text-white">2m ago</span>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-indigo-600 text-white rounded-3xl shadow-2xl shadow-indigo-600/30">
              <h4 className="text-lg font-black mb-4 tracking-tight leading-tight">Butuh Bantuan Teknis Khusus?</h4>
              <p className="text-xs opacity-80 leading-relaxed mb-8">Tim support teknis SeuramoeTech siap membantu Anda melakukan konfigurasi advanced atau integrasi API pihak ketiga untuk toko Anda.</p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Hubungi Regional Admin</button>
           </div>

           <div className="glass-panel p-8 rounded-3xl border-rose-500/20 bg-rose-600/5">
              <h4 className="text-sm font-black text-rose-500 uppercase tracking-widest mb-6">Security Actions</h4>
              <div className="space-y-3">
                 <button className="w-full py-3 bg-slate-900 border border-slate-800 hover:border-rose-500 hover:text-rose-500 text-slate-500 text-[10px] font-black uppercase rounded-xl transition-all">Clear Node Cache</button>
                 <button className="w-full py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase rounded-xl hover:bg-rose-600 hover:text-white transition-all">Disable Store Access</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;