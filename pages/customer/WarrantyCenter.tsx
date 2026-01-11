import React, { useState, useEffect } from 'react';
import SupportService from '../../services/SupportService';
import AuthService from '../../auth/AuthService';
import { WarrantyRegistration, WarrantyClaim, WarrantyStatus } from '../../types';
import { ICONS } from '../../constants';
import Stepper from '../../components/Shared/Stepper';
import NewWarrantyClaim from './NewWarrantyClaim';

const WarrantyCenter: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'my_warranties' | 'claims'>('my_warranties');
  const [registrations, setRegistrations] = useState<WarrantyRegistration[]>([]);
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [selectedReg, setSelectedReg] = useState<WarrantyRegistration | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // In demo, we use storeId 's1' and user Ali Akbar
    setRegistrations(SupportService.getWarrantyRegistrations('s1'));
    setClaims(SupportService.getWarranties().filter(c => c.customerName === 'Ali Akbar'));
  };

  const getRemainingDays = (expiry: string) => {
    const diff = new Date(expiry).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const claimSteps = [
    { label: 'Submit', description: 'Klaim terkirim' },
    { label: 'Audit', description: 'Cek teknis' },
    { label: 'Decision', description: 'Hasil inspeksi' },
    { label: 'Resolved', description: 'Unit dikirim' },
  ];

  const getClaimStepIndex = (status: WarrantyStatus) => {
    switch(status) {
      case WarrantyStatus.PENDING: return 0;
      case WarrantyStatus.IN_REPAIR: return 1;
      case WarrantyStatus.APPROVED: return 2;
      case WarrantyStatus.REPLACED: return 3;
      default: return 0;
    }
  };

  if (selectedReg) {
    return (
      <NewWarrantyClaim 
        registration={selectedReg} 
        onSuccess={() => { setSelectedReg(null); loadData(); setActiveTab('claims'); }}
        onCancel={() => setSelectedReg(null)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-24">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-xl">
           <button onClick={() => setActiveTab('my_warranties')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'my_warranties' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>Garansi Aktif ({registrations.length})</button>
           <button onClick={() => setActiveTab('claims')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'claims' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>Riwayat Klaim ({claims.length})</button>
        </div>
        <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Global Support Coverage: ACTIVE</p>
        </div>
      </div>

      {activeTab === 'my_warranties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {registrations.length === 0 ? (
             <div className="col-span-full py-24 text-center glass-panel rounded-[3rem] border-slate-800 text-slate-600 italic">Anda tidak memiliki produk terdaftar dalam garansi Sumatra.</div>
           ) : registrations.map(reg => {
             const daysLeft = getRemainingDays(reg.expiryDate);
             const isExpired = daysLeft <= 0;
             
             return (
               <div key={reg.id} className="glass-panel p-8 rounded-[3rem] border-slate-800 flex flex-col group hover:border-indigo-500/30 transition-all shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:rotate-0 transition-transform"><ICONS.Package className="w-32 h-32" /></div>
                  
                  <div className="flex justify-between items-start mb-10 relative z-10">
                     <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-indigo-400 shadow-inner"><ICONS.Store className="w-6 h-6" /></div>
                     <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                       isExpired ? 'bg-rose-500 text-white border-rose-400' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                     }`}>
                        {isExpired ? 'EXPIRED' : 'ACTIVE'}
                     </span>
                  </div>

                  <div className="mb-8 relative z-10">
                     <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors leading-none">{reg.productName}</h4>
                     <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest mt-2">{reg.serialNumber}</p>
                  </div>

                  <div className="space-y-6 flex-1 relative z-10">
                     <div className="p-5 bg-slate-950 border border-slate-800 rounded-3xl">
                        <div className="flex justify-between text-[10px] font-black uppercase mb-3">
                           <span className="text-slate-500 tracking-widest">Sisa Garansi</span>
                           <span className={isExpired ? 'text-rose-500' : 'text-emerald-400'}>{isExpired ? '0' : daysLeft} Hari</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                           <div 
                             className={`h-full transition-all duration-1000 ${isExpired ? 'bg-rose-500' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} 
                             style={{ width: `${isExpired ? 100 : Math.min(100, (daysLeft/365)*100)}%` }}
                           ></div>
                        </div>
                        <p className="text-[8px] text-slate-600 font-bold uppercase mt-4">Berakhir: {new Date(reg.expiryDate).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</p>
                     </div>
                  </div>

                  <div className="pt-8 relative z-10">
                     {!isExpired ? (
                        <button 
                          onClick={() => setSelectedReg(reg)}
                          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                        >
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           Ajukan Klaim
                        </button>
                     ) : (
                        <button className="w-full py-4 bg-slate-900 border border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl cursor-not-allowed">Masa Berlaku Habis</button>
                     )}
                  </div>
               </div>
             );
           })}
        </div>
      )}

      {activeTab === 'claims' && (
        <div className="space-y-6">
           {claims.length === 0 ? (
              <div className="py-24 text-center glass-panel rounded-[3rem] border-slate-800 text-slate-600 italic">Tidak ada riwayat klaim yang tercatat.</div>
           ) : claims.map(claim => (
              <div key={claim.id} className="glass-panel p-8 rounded-[3rem] border-slate-800 shadow-2xl group hover:border-indigo-500/20 transition-all overflow-hidden relative">
                 <div className="flex flex-col lg:flex-row justify-between gap-10">
                    <div className="flex-1 space-y-6">
                       <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${
                             claim.status === WarrantyStatus.PENDING ? 'bg-amber-600 shadow-amber-600/20' : 
                             claim.status === WarrantyStatus.REJECTED ? 'bg-rose-600 shadow-rose-600/20' : 'bg-indigo-600 shadow-indigo-600/20'
                          }`}>
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Tiket Klaim #{claim.id}</p>
                             <h4 className="text-xl font-black text-white uppercase tracking-tight">{claim.imei}</h4>
                          </div>
                       </div>

                       <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-3xl">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Alasan Pelanggan</p>
                          <p className="text-sm text-slate-400 italic leading-relaxed">"{claim.claimReason}"</p>
                       </div>

                       {claim.inspectionNotes && (
                         <div className="p-5 bg-indigo-600/5 border border-indigo-500/10 rounded-3xl border-l-4 border-l-indigo-600">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Catatan Audit Teknisi</p>
                            <p className="text-xs text-slate-300 leading-relaxed italic">"{claim.inspectionNotes}"</p>
                         </div>
                       )}

                       <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
                          <span>Node Sumatra: {claim.storeName}</span>
                          <div className="w-1.5 h-1.5 bg-slate-800 rounded-full mt-1.5"></div>
                          <span>Tgl Pengajuan: {new Date(claim.createdAt).toLocaleDateString()}</span>
                       </div>
                    </div>

                    <div className="flex flex-col justify-center items-center p-10 bg-slate-950/50 rounded-[2.5rem] border border-slate-800 min-w-[300px]">
                       <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-10 text-center">Lifecycle Klaim</h5>
                       <div className="w-full max-w-xs">
                          <Stepper steps={claimSteps} currentStep={getClaimStepIndex(claim.status)} activeColor={claim.status === WarrantyStatus.REJECTED ? 'rose' : 'indigo'} />
                       </div>
                       <div className={`mt-8 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          claim.status === WarrantyStatus.APPROVED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          claim.status === WarrantyStatus.REJECTED ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-indigo-600/10 text-indigo-400 border-indigo-500/20'
                       }`}>
                          Keputusan: {claim.status.replace('_', ' ')}
                       </div>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}

      {/* Info Panel */}
      <div className="p-8 glass-panel rounded-[3rem] border-slate-800 bg-indigo-600/5 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><ICONS.Ticket className="w-32 h-32" /></div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
               <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2 leading-none">Punya Pertanyaan Teknis?</h4>
               <p className="text-sm text-slate-400 max-w-lg">Konsultasikan kendala unit Anda sebelum mengajukan klaim untuk mempercepat proses verifikasi di Node kami.</p>
            </div>
            <button className="px-8 py-4 bg-slate-900 border border-slate-800 hover:text-indigo-400 transition-all text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl">Hubungi Teknisi Regional</button>
         </div>
      </div>
    </div>
  );
};

export default WarrantyCenter;