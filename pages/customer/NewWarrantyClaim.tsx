
import React, { useState } from 'react';
import SupportService from '../../services/SupportService';
import AuthService from '../../auth/AuthService';
import { WarrantyRegistration, WarrantyStatus } from '../../types';
import { ICONS } from '../../constants';

interface NewWarrantyClaimProps {
  registration: WarrantyRegistration;
  onSuccess: () => void;
  onCancel: () => void;
}

const NewWarrantyClaim: React.FC<NewWarrantyClaimProps> = ({ registration, onSuccess, onCancel }) => {
  const user = AuthService.getCurrentUser();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return alert("Mohon isi alasan klaim.");
    
    if (confirm(`Ajukan klaim garansi untuk ${registration.productName}? \n\nPastikan Anda telah membaca syarat dan ketentuan. Unit yang rusak akibat kesalahan pengguna tidak ditanggung oleh garansi resmi SeuramoeTech.`)) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        alert("Klaim Garansi Berhasil Diajukan! Tim teknis Node Sumatra-01 akan melakukan verifikasi awal.");
        setIsSubmitting(false);
        onSuccess();
      }, 1000);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-in zoom-in-95 duration-500 pb-20">
      <div className="glass-panel p-8 md:p-10 rounded-[3rem] border-slate-800 shadow-2xl space-y-8">
        <div className="flex justify-between items-start">
           <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Form Pengajuan Klaim</p>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Klaim Node Sumatra</h3>
           </div>
           <button onClick={onCancel} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
           <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-slate-500 uppercase">Unit Perangkat</span>
              <span className="text-white font-black">{registration.productName}</span>
           </div>
           <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-slate-500 uppercase">Serial Number</span>
              <span className="text-indigo-400 font-mono">{registration.serialNumber}</span>
           </div>
           <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-slate-500 uppercase">Masa Garansi</span>
              <span className="text-emerald-400">Aktif s/d {registration.expiryDate}</span>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detail Kerusakan / Masalah</label>
              <textarea 
                rows={5}
                className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-rose-500 transition-all text-sm italic"
                placeholder="Jelaskan secara detail masalah yang dialami perangkat Anda..."
                value={reason}
                onChange={e => setReason(e.target.value)}
              ></textarea>
           </div>

           <div className="p-4 bg-rose-600/5 border border-rose-500/20 rounded-2xl flex items-start gap-3">
              <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                 Klaim garansi hanya berlaku untuk cacat produksi. Kerusakan akibat kelalaian pengguna (terbentur, terkena air, segel rusak) dapat membatalkan garansi secara otomatis.
              </p>
           </div>

           <button 
             type="submit" 
             disabled={isSubmitting}
             className="w-full py-5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black uppercase text-xs tracking-widest rounded-3xl shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-3"
           >
              {isSubmitting ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                 <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Kirim Permintaan Klaim
                 </>
              )}
           </button>
        </form>
      </div>
    </div>
  );
};

export default NewWarrantyClaim;
