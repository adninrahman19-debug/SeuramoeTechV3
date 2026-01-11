import React, { useState, useEffect } from 'react';
import SupportService from '../../services/SupportService.ts';
import AuthService from '../../auth/AuthService.ts';
import { WarrantyClaim, WarrantyStatus, WarrantyRegistration } from '../../types.ts';
import { ICONS } from '../../constants.tsx';
import RightDrawer from '../../components/Shared/RightDrawer.tsx';

const TechnicianWarrantyManager: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const storeId = user?.storeId || 's1';
  const technicianName = user?.fullName || '';

  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null);
  const [registration, setRegistration] = useState<WarrantyRegistration | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<WarrantyStatus | 'ALL'>('ALL');

  // Form State
  const [analysis, setAnalysis] = useState('');
  const [isManufacturerFault, setIsManufacturerFault] = useState(true);
  const [isHumanError, setIsHumanError] = useState(false);
  const [recommendation, setRecommendation] = useState('');

  useEffect(() => {
    loadClaims();
  }, [storeId]);

  const loadClaims = () => {
    const all = SupportService.getWarranties();
    setClaims(all);
  };

  const handleOpenInspection = (claim: WarrantyClaim) => {
    setSelectedClaim(claim);
    const reg = SupportService.getRegistrationByImei(claim.imei);
    setRegistration(reg || null);
    
    setAnalysis(claim.technicalAnalysis || '');
    setRecommendation(claim.recommendation || '');
    setIsManufacturerFault(claim.isManufacturerFault ?? true);
    setIsHumanError(claim.isHumanErrorDetected ?? false);
    
    setIsDrawerOpen(true);
  };

  const handleCompleteInspection = (status: WarrantyStatus) => {
    if (!selectedClaim) return;

    const updates: Partial<WarrantyClaim> = {
      status,
      technicalAnalysis: analysis,
      recommendation,
      isManufacturerFault,
      isHumanErrorDetected: isHumanError,
      inspectedAt: new Date().toISOString(),
      inspectedBy: technicianName
    };

    SupportService.updateWarranty(selectedClaim.id, updates);
    alert(`Hasil inspeksi disimpan. Status klaim: ${status}`);
    setIsDrawerOpen(false);
    loadClaims();
  };

  const filteredClaims = filter === 'ALL' ? claims : claims.filter(c => c.status === filter);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div>
           <h3 className="text-2xl font-black text-white tracking-tight uppercase">Warranty Inspection Hub</h3>
           <p className="text-sm text-slate-500 font-medium mt-1">Validasi fisik dan otentikasi unit klaim garansi pelanggan.</p>
        </div>
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-lg overflow-x-auto max-w-full">
           <button onClick={() => setFilter('ALL')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === 'ALL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Semua Klaim</button>
           <button onClick={() => setFilter(WarrantyStatus.PENDING)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === WarrantyStatus.PENDING ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Antrean Baru</button>
           <button onClick={() => setFilter(WarrantyStatus.APPROVED)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === WarrantyStatus.APPROVED ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Disetujui</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredClaims.length === 0 ? (
           <div className="col-span-full py-20 text-center glass-panel rounded-[2.5rem] border-slate-800 text-slate-600 italic">Tidak ada antrean klaim garansi saat ini.</div>
         ) : filteredClaims.map(claim => (
           <div key={claim.id} className="glass-panel p-8 rounded-[2.5rem] border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                 <div className="space-y-1">
                    <p className="text-[10px] text-indigo-400 font-mono font-bold tracking-widest uppercase">Claim ID: {claim.id}</p>
                    <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors truncate max-w-[180px]">{claim.customerName}</h4>
                 </div>
                 <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                   claim.status === WarrantyStatus.PENDING ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' :
                   claim.status === WarrantyStatus.APPROVED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                   'bg-slate-800 text-slate-500 border-slate-700'
                 }`}>{claim.status}</span>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Hardware ID (IMEI/SN)</p>
                    <p className="text-sm font-mono font-bold text-white tracking-tighter">{claim.imei}</p>
                 </div>
                 <p className="text-xs text-slate-400 italic">"Alasan Klaim: {claim.claimReason}"</p>
                 
                 <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                    <span className="text-[10px] font-black text-slate-600 uppercase">Abuse Risk Score</span>
                    <span className={`text-sm font-black ${claim.abuseRiskScore > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>{claim.abuseRiskScore}%</span>
                 </div>
              </div>

              <button 
                onClick={() => handleOpenInspection(claim)}
                className="mt-auto w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth={2}/></svg>
                 Buka Inspeksi Fisik
              </button>
           </div>
         ))}
      </div>

      {/* Inspection Workbench Drawer */}
      <RightDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Audit Teknis Garansi">
         {selectedClaim && (
           <div className="space-y-8 pb-10">
              {/* Device Context */}
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5"><ICONS.Store className="w-16 h-16" /></div>
                 <div className="relative z-10">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">IMEI Node: {selectedClaim.imei}</p>
                    <h3 className="text-xl font-bold text-white mb-4">{registration?.productName || "Product Unrecognized"}</h3>
                    
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-500 uppercase">Status Garansi</span>
                          {registration ? (
                            <span className={new Date(registration.expiryDate) > new Date() ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}>
                               {new Date(registration.expiryDate) > new Date() ? 'ACTIVE' : 'EXPIRED'}
                            </span>
                          ) : (
                            <span className="text-rose-600">UNREGISTERED</span>
                          )}
                       </div>
                       <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-500 uppercase">Masa Berlaku s/d</span>
                          <span className="text-white">{registration?.expiryDate || "-"}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Inspection Form */}
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hasil Analisis Kerusakan</label>
                    <textarea 
                       rows={4}
                       className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500"
                       placeholder="Jelaskan kondisi komponen, indikasi korsleting, atau tanda-tanda kerusakan pabrik..."
                       value={analysis}
                       onChange={e => setAnalysis(e.target.value)}
                    ></textarea>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Validasi Kelayakan Klaim</label>
                    <div className="grid grid-cols-1 gap-2">
                       <button 
                         onClick={() => setIsManufacturerFault(!isManufacturerFault)}
                         className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${isManufacturerFault ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950 border-slate-800'}`}
                       >
                          <div>
                             <p className="text-xs font-bold text-white">Cacat Produksi (Factory Defect)</p>
                             <p className="text-[9px] text-slate-500">Kerusakan murni dari pabrikan, bukan karena penggunaan.</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isManufacturerFault ? 'border-emerald-500 bg-emerald-500' : 'border-slate-800'}`}>
                             {isManufacturerFault && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={4}/></svg>}
                          </div>
                       </button>

                       <button 
                         onClick={() => setIsHumanError(!isHumanError)}
                         className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${isHumanError ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-950 border-slate-800'}`}
                       >
                          <div>
                             <p className="text-xs font-bold text-white">Indikasi Human Error</p>
                             <p className="text-[9px] text-slate-500">Ditemukan tanda benturan, terkena air, atau segel rusak.</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isHumanError ? 'border-rose-500 bg-rose-500' : 'border-slate-800'}`}>
                             {isHumanError && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={4}/></svg>}
                          </div>
                       </button>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rekomendasi Solusi Teknisi</label>
                    <select 
                       className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none appearance-none"
                       value={recommendation}
                       onChange={e => setRecommendation(e.target.value)}
                    >
                       <option value="">-- Pilih Rekomendasi --</option>
                       <option value="REPLACE">Ganti Unit Baru (DOA/Critical)</option>
                       <option value="REPAIR">Perbaiki Komponen Internal</option>
                       <option value="REFUND">Refund Dana (Stok Kosong)</option>
                       <option value="REJECT">Tolak Klaim (Invalid/Abuse)</option>
                    </select>
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Aksi Final Pemeriksaan</h4>
                 <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleCompleteInspection(WarrantyStatus.REJECTED)}
                      className="py-4 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white text-[9px] font-black uppercase tracking-widest rounded-2xl transition-all border border-slate-700 hover:border-rose-500"
                    >
                       Tolak Klaim
                    </button>
                    <button 
                      onClick={() => handleCompleteInspection(WarrantyStatus.APPROVED)}
                      className="py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                       Setujui Klaim
                    </button>
                 </div>
                 <button 
                   onClick={() => handleCompleteInspection(WarrantyStatus.SUSPICIOUS)}
                   className="w-full mt-2 py-3 bg-amber-600/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-600 hover:text-white transition-all"
                 >
                    Flag as Suspicious (Audit Owner)
                 </button>
              </div>
           </div>
         )}
      </RightDrawer>
    </div>
  );
};

export default TechnicianWarrantyManager;