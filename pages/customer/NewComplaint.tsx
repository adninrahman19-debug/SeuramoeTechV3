
import React, { useState } from 'react';
import SupportService from '../../services/SupportService';
import AuthService from '../../auth/AuthService';
import { SupportStatus } from '../../types';

interface NewComplaintProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewComplaint: React.FC<NewComplaintProps> = ({ onSuccess, onCancel }) => {
  const user = AuthService.getCurrentUser();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'MINOR' | 'MAJOR' | 'CRITICAL'>('MINOR');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return alert("Mohon lengkapi subjek dan pesan keluhan.");
    
    if (confirm("Kirim keluhan ini ke tim dukungan SeuramoeTech? Kami akan merespons dalam waktu maksimal 24 jam kerja.")) {
      setIsSubmitting(true);
      setTimeout(() => {
        SupportService.createComplaint({
          storeId: 's1',
          storeName: 'Aceh Tech Center',
          customerName: user?.fullName || 'Anonymous',
          subject,
          message,
          severity: category
        });
        setIsSubmitting(false);
        alert("Keluhan Anda telah kami terima dan akan segera ditindaklanjuti. Cek email atau WhatsApp Anda secara berkala.");
        onSuccess();
      }, 1000);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="glass-panel p-8 md:p-10 rounded-[3rem] border-slate-800 shadow-2xl space-y-8">
        <div>
           <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Pusat Resolusi</p>
           <h3 className="text-2xl font-black text-white uppercase tracking-tight">Kirim Keluhan Baru</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subjek Keluhan</label>
              <input 
                type="text" 
                className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-rose-500 transition-all text-sm"
                placeholder="Misal: Keterlambatan Servis atau Barang Cacat"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tingkat Kepentingan</label>
              <div className="grid grid-cols-3 gap-2">
                 {(['MINOR', 'MAJOR', 'CRITICAL'] as const).map(cat => (
                   <button
                     key={cat}
                     type="button"
                     onClick={() => setCategory(cat)}
                     className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                       category === cat 
                         ? (cat === 'CRITICAL' ? 'bg-rose-600 border-rose-500 text-white shadow-lg' : 'bg-indigo-600 border-indigo-500 text-white shadow-lg') 
                         : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detail Pesan</label>
              <textarea 
                rows={5}
                className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-rose-500 transition-all text-sm italic"
                placeholder="Ceritakan kendala yang Anda hadapi secara rinci..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              ></textarea>
           </div>

           <button 
             type="submit" 
             disabled={isSubmitting}
             className="w-full py-5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black uppercase text-xs tracking-widest rounded-3xl shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-3"
           >
              {isSubmitting ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                 <>Kirim Laporan</>
              )}
           </button>
        </form>
      </div>
      <button onClick={onCancel} className="w-full mt-6 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Batalkan & Kembali</button>
    </div>
  );
};

export default NewComplaint;
