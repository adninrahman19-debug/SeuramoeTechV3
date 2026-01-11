
import React, { useState, useEffect } from 'react';
import StoreService from '../../services/StoreService';
import SupportService from '../../services/SupportService';
import AuthService from '../../auth/AuthService';
import Stepper from '../../components/Shared/Stepper';
import { Store, SupportStatus } from '../../types';

interface NewServiceRequestProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewServiceRequest: React.FC<NewServiceRequestProps> = ({ onSuccess, onCancel }) => {
  const user = AuthService.getCurrentUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [stores, setStores] = useState<Store[]>([]);
  
  // Form State
  const [selectedStore, setSelectedStore] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [issue, setIssue] = useState('');
  const [schedule, setSchedule] = useState('');

  useEffect(() => {
    setStores(StoreService.getAllStores());
  }, []);

  const steps = [
    { label: 'Lokasi', description: 'Pilih Node' },
    { label: 'Unit', description: 'Detail Masalah' },
    { label: 'Jadwal', description: 'Waktu Kunjungan' },
  ];

  const handleSubmit = () => {
    const store = stores.find(s => s.id === selectedStore);
    if (confirm(`Konfirmasi pengajuan servis unit ${deviceModel} di ${store?.name}?`)) {
      SupportService.createTicket({
        storeId: selectedStore,
        storeName: store?.name || 'Sumatra Node',
        customerName: user?.fullName || 'Anonymous',
        customerEmail: user?.email,
        deviceModel: deviceModel,
        issueDescription: issue,
        status: SupportStatus.OPEN,
        priority: 'MEDIUM',
        slaDeadline: new Date(Date.now() + 172800000).toISOString(), // Default 48h
      });
      alert("Permintaan servis berhasil diajukan. Silakan bawa unit Anda ke toko sesuai jadwal.");
      onSuccess();
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="glass-panel p-8 rounded-[3rem] border-slate-800 shadow-2xl space-y-10">
        <Stepper steps={steps} currentStep={currentStep} />

        {currentStep === 0 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
             <h3 className="text-xl font-black text-white uppercase tracking-tight">Pilih Node Regional</h3>
             <div className="grid grid-cols-1 gap-3">
                {stores.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => setSelectedStore(s.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                      selectedStore === s.id ? 'bg-indigo-600/10 border-indigo-600' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                       <p className="text-sm font-bold text-white">{s.name}</p>
                       <p className="text-[10px] text-slate-500 uppercase font-black">{s.location}</p>
                    </div>
                    {selectedStore === s.id && <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg></div>}
                  </div>
                ))}
             </div>
             <button 
               disabled={!selectedStore}
               onClick={() => setCurrentStep(1)}
               className="w-full py-4 bg-indigo-600 disabled:opacity-50 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
             >
               Lanjutkan Ke Detail Unit
             </button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
             <h3 className="text-xl font-black text-white uppercase tracking-tight">Identitas Perangkat</h3>
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model Laptop / Gadget</label>
                   <input 
                     type="text" 
                     placeholder="Misal: ROG Zephyrus G14 2022" 
                     className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500"
                     value={deviceModel}
                     onChange={e => setDeviceModel(e.target.value)}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deskripsi Kerusakan</label>
                   <textarea 
                     rows={4} 
                     placeholder="Jelaskan kronologi dan masalah yang dialami..." 
                     className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500"
                     value={issue}
                     onChange={e => setIssue(e.target.value)}
                   ></textarea>
                </div>
                <div className="p-4 bg-indigo-600/5 border border-dashed border-indigo-500/30 rounded-2xl flex flex-col items-center gap-2 cursor-pointer hover:bg-indigo-600/10 transition-all">
                   <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg>
                   <span className="text-[10px] font-black text-slate-500 uppercase">Upload Foto Unit (Opsional)</span>
                </div>
             </div>
             <div className="flex gap-3">
                <button onClick={() => setCurrentStep(0)} className="flex-1 py-4 bg-slate-800 text-slate-400 font-black uppercase text-[10px] rounded-2xl">Kembali</button>
                <button 
                  disabled={!deviceModel || !issue}
                  onClick={() => setCurrentStep(2)}
                  className="flex-[2] py-4 bg-indigo-600 disabled:opacity-50 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl"
                >
                  Pilih Jadwal Drop-off
                </button>
             </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
             <h3 className="text-xl font-black text-white uppercase tracking-tight">Jadwal Kunjungan</h3>
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Waktu Kedatangan</label>
                   <input 
                     type="datetime-local" 
                     className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                     value={schedule}
                     onChange={e => setSchedule(e.target.value)}
                   />
                </div>
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                   <p className="text-[10px] text-amber-500 font-bold leading-relaxed">
                     Sistem akan memprioritaskan antrean Anda sesuai jadwal yang dipilih. Pastikan membawa invoice pembelian jika unit masih dalam masa garansi SeuramoeTech.
                   </p>
                </div>
             </div>
             <div className="flex gap-3">
                <button onClick={() => setCurrentStep(1)} className="flex-1 py-4 bg-slate-800 text-slate-400 font-black uppercase text-[10px] rounded-2xl">Kembali</button>
                <button 
                  disabled={!schedule}
                  onClick={handleSubmit}
                  className="flex-[2] py-4 bg-emerald-600 disabled:opacity-50 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-emerald-600/20"
                >
                  Ajukan Servis Sekarang
                </button>
             </div>
          </div>
        )}
      </div>
      <button onClick={onCancel} className="w-full mt-6 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Batal & Kembali ke Dashboard</button>
    </div>
  );
};

export default NewServiceRequest;
