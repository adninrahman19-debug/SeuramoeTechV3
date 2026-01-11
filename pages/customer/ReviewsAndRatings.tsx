import React, { useState, useEffect } from 'react';
import ReviewService from '../../services/ReviewService';
import AuthService from '../../auth/AuthService';
import { Review } from '../../types';
import { ICONS } from '../../constants';

const ReviewsAndRatings: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'my_reviews' | 'all_feedback'>('my_reviews');
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  
  // UI State
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(5);
  
  // New Review Form
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    loadReviews();
    window.addEventListener('reviews-updated', loadReviews);
    return () => window.removeEventListener('reviews-updated', loadReviews);
  }, []);

  const loadReviews = () => {
    const all = ReviewService.getAllReviews();
    setAllReviews(all.filter(r => r.status === 'active'));
    setMyReviews(all.filter(r => r.customerName === user?.fullName));
  };

  const handleAddReview = () => {
    if (!newComment) return alert("Komentar tidak boleh kosong.");
    ReviewService.addReview({
      storeId: 's1',
      customerName: user?.fullName || 'User',
      rating: newRating,
      comment: newComment,
      productName: 'Layanan Servis & Pembelian'
    });
    setNewComment('');
    setNewRating(5);
    setShowForm(false);
  };

  const handleStartEdit = (r: Review) => {
    setIsEditing(r.id);
    setEditComment(r.comment);
    setEditRating(r.rating);
  };

  const handleUpdate = (id: string) => {
    ReviewService.updateReview(id, editComment, editRating);
    setIsEditing(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus ulasan ini secara permanen?")) {
      ReviewService.deleteReview(id);
    }
  };

  const renderStars = (rating: number, onSelect?: (r: number) => void) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onSelect?.(star)}
          disabled={!onSelect}
          className={`transition-all ${star <= rating ? 'text-amber-400 scale-110' : 'text-slate-800'} ${onSelect ? 'hover:scale-125' : ''}`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
      {/* Header & New Review Trigger */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-xl">
           <button onClick={() => setActiveTab('my_reviews')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'my_reviews' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Ulasan Saya ({myReviews.length})</button>
           <button onClick={() => setActiveTab('all_feedback')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'all_feedback' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Feed Komunitas</button>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-3"
        >
           <ICONS.Plus className="w-5 h-5" /> Tulis Review Baru
        </button>
      </div>

      {/* New Review Form Overlay */}
      {showForm && (
        <div className="glass-panel p-8 rounded-[2.5rem] border-emerald-500/30 bg-emerald-600/5 animate-in zoom-in-95 duration-300">
           <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6">Bagikan Pengalaman Anda</h3>
           <div className="space-y-6">
              <div className="space-y-2">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Penilaian Anda</p>
                 {renderStars(newRating, setNewRating)}
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Komentar & Masukan</label>
                 <textarea 
                   rows={4} 
                   className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm italic"
                   placeholder="Bagaimana kualitas produk dan layanan kami?"
                   value={newComment}
                   onChange={e => setNewComment(e.target.value)}
                 ></textarea>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setShowForm(false)} className="px-8 py-3 bg-slate-900 border border-slate-800 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:text-white transition-all">Batal</button>
                 <button onClick={handleAddReview} className="px-10 py-3 bg-emerald-600 text-white font-black uppercase text-[10px] rounded-xl shadow-lg">Publikasikan Review</button>
              </div>
           </div>
        </div>
      )}

      {/* Content Section */}
      <div className="grid grid-cols-1 gap-6">
        {activeTab === 'my_reviews' ? (
           myReviews.length === 0 ? (
             <div className="py-24 text-center glass-panel rounded-[3rem] border-slate-800">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
                   <ICONS.Users className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight">Belum Ada Riwayat Ulasan</h4>
                <p className="text-slate-500 text-sm mt-2">Ulasan Anda membantu kami meningkatkan standar ekosistem SeuramoeTech.</p>
             </div>
           ) : myReviews.map(rev => (
             <div key={rev.id} className="glass-panel p-8 rounded-[2.5rem] border-slate-800 hover:border-indigo-500/20 transition-all flex flex-col md:flex-row gap-8 relative group">
                <div className="flex-1">
                   <div className="flex items-center gap-4 mb-4">
                      {renderStars(isEditing === rev.id ? editRating : rev.rating, isEditing === rev.id ? setEditRating : undefined)}
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString('id-ID')}</span>
                   </div>
                   
                   {isEditing === rev.id ? (
                     <div className="space-y-4">
                        <textarea 
                          rows={3} 
                          className="w-full px-4 py-3 bg-slate-950 border border-indigo-500/50 rounded-xl text-white text-sm italic outline-none"
                          value={editComment}
                          onChange={e => setEditComment(e.target.value)}
                        />
                        <div className="flex gap-2">
                           <button onClick={() => handleUpdate(rev.id)} className="px-6 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-lg">Simpan Perubahan</button>
                           <button onClick={() => setIsEditing(null)} className="px-6 py-2 bg-slate-800 text-slate-400 text-[9px] font-black uppercase rounded-lg">Batal</button>
                        </div>
                     </div>
                   ) : (
                     <>
                        <p className="text-sm text-slate-300 leading-relaxed italic mb-4">"{rev.comment}"</p>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Produk: {rev.productName || 'Layanan Umum'}</p>
                     </>
                   )}

                   {rev.reply && !isEditing && (
                     <div className="mt-6 p-5 bg-indigo-600/5 border-l-2 border-indigo-500 rounded-r-2xl">
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Respons Node Sumatra-01</p>
                        <p className="text-xs text-slate-400 italic">"{rev.reply}"</p>
                     </div>
                   )}
                </div>

                <div className="flex flex-row md:flex-col gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => handleStartEdit(rev)}
                     className="p-3 bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-xl border border-slate-700 transition-all"
                     title="Edit Review"
                   >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                   </button>
                   <button 
                     onClick={() => handleDelete(rev.id)}
                     className="p-3 bg-slate-800 text-slate-400 hover:text-rose-500 rounded-xl border border-slate-700 transition-all"
                     title="Hapus Review"
                   >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </div>
             </div>
           ))
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allReviews.map(rev => (
                <div key={rev.id} className="glass-panel p-8 rounded-[3rem] border-slate-800 flex flex-col group hover:border-indigo-500/20 transition-all relative overflow-hidden">
                   <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.customerName}`} alt="" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-white">{rev.customerName}</p>
                            <div className="mt-1">{renderStars(rev.rating)}</div>
                         </div>
                      </div>
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                   </div>
                   <p className="text-sm text-slate-400 italic leading-relaxed mb-6 flex-1 pr-6">"{rev.comment}"</p>
                   {rev.reply && (
                     <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Official Response</p>
                        <p className="text-xs text-slate-500">"{rev.reply}"</p>
                     </div>
                   )}
                </div>
              ))}
           </div>
        )}
      </div>

      {/* Trust & Transparency Panel */}
      <div className="p-10 glass-panel rounded-[3rem] border-slate-800 bg-indigo-600/5 shadow-2xl relative overflow-hidden text-center md:text-left">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><ICONS.Ticket className="w-32 h-32" /></div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-xl">
               <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 leading-none">Audit Transparansi Seuramoe</h4>
               <p className="text-sm text-slate-400 leading-relaxed italic">
                 Setiap ulasan di sistem ini berasal dari pelanggan yang terverifikasi di node regional kami. Kami berkomitmen untuk mendengarkan setiap suara demi kemajuan infrastruktur teknologi di Sumatra.
               </p>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-center">
                  <p className="text-3xl font-black text-white">4.9</p>
                  <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Ecosystem Rating</p>
               </div>
               <div className="w-px h-12 bg-slate-800"></div>
               <div className="text-center">
                  <p className="text-3xl font-black text-emerald-400">100%</p>
                  <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Verified Orders</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ReviewsAndRatings;