
import React, { useState, useEffect } from 'react';
import ReviewService from '../../services/ReviewService';
import SupportService from '../../services/SupportService';
import { Review, CustomerComplaint, SupportStatus } from '../../types';
import { ICONS } from '../../constants';
import StatCard from '../../components/Shared/StatCard';
import RightDrawer from '../../components/Shared/RightDrawer';

const ReviewsComplaints: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'complaints'>('reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [complaints, setComplaints] = useState<CustomerComplaint[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'reply_review' | 'handle_complaint'>('reply_review');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<CustomerComplaint | null>(null);
  
  // Forms
  const [replyText, setReplyText] = useState('');
  const [complaintResponse, setComplaintResponse] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storeId = 's1';
    setReviews(ReviewService.getReviews(storeId));
    setComplaints(SupportService.getComplaints(storeId));
    setStats(ReviewService.getSatisfactionStats(storeId));
  };

  const handleOpenReply = (rev: Review) => {
    setSelectedReview(rev);
    setReplyText(rev.reply || '');
    setDrawerMode('reply_review');
    setIsDrawerOpen(true);
  };

  const handleOpenComplaint = (comp: CustomerComplaint) => {
    setSelectedComplaint(comp);
    setComplaintResponse(comp.response || '');
    setDrawerMode('handle_complaint');
    setIsDrawerOpen(true);
  };

  const saveReply = () => {
    if (selectedReview) {
      ReviewService.reply(selectedReview.id, replyText);
      setIsDrawerOpen(false);
      loadData();
    }
  };

  const resolveComplaint = () => {
    if (selectedComplaint) {
      SupportService.resolveComplaint(selectedComplaint.id, complaintResponse);
      setIsDrawerOpen(false);
      loadData();
    }
  };

  const escalateComplaint = (id: string) => {
    if (confirm("Escalate to platform admin? This will be audited by the SeuramoeTech compliance team.")) {
      SupportService.escalateComplaint(id);
      loadData();
    }
  };

  const toggleVisibility = (id: string) => {
    ReviewService.toggleVisibility(id);
    loadData();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <RightDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title={drawerMode === 'reply_review' ? "Customer Engagement" : "Conflict Resolution"}
      >
        {drawerMode === 'reply_review' && selectedReview && (
          <div className="space-y-6">
             <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-white">{selectedReview.customerName}</span>
                   <span className="text-amber-400 text-xs font-black">{'★'.repeat(selectedReview.rating)}</span>
                </div>
                <p className="text-xs text-slate-400 italic">"{selectedReview.comment}"</p>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Store Reply</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type your response to the customer..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                ></textarea>
             </div>
             <button onClick={saveReply} className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-xs rounded-2xl hover:bg-indigo-500 shadow-xl">Post Response</button>
          </div>
        )}

        {drawerMode === 'handle_complaint' && selectedComplaint && (
          <div className="space-y-6">
             <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                   <h4 className="text-sm font-bold text-white">{selectedComplaint.subject}</h4>
                   <span className="bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded">{selectedComplaint.severity}</span>
                </div>
                <p className="text-xs text-slate-400">"{selectedComplaint.message}"</p>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resolution Notes</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Explain how the issue was resolved..."
                  value={complaintResponse}
                  onChange={e => setComplaintResponse(e.target.value)}
                ></textarea>
             </div>
             <div className="flex gap-2">
                <button onClick={() => escalateComplaint(selectedComplaint.id)} className="flex-1 py-4 bg-slate-800 text-slate-400 font-black uppercase text-[10px] rounded-2xl hover:text-white border border-slate-700">Platform SOS</button>
                <button onClick={resolveComplaint} className="flex-[2] py-4 bg-emerald-600 text-white font-black uppercase text-[10px] rounded-2xl hover:bg-emerald-500 shadow-xl shadow-emerald-600/20">Mark Resolved</button>
             </div>
          </div>
        )}
      </RightDrawer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Avg Satisfaction" value={`${stats?.avg || 0} / 5.0`} icon={<svg fill="none" viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.05 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>} colorClass="amber" />
        <StatCard label="Critical Complaints" value={complaints.filter(c => c.severity === 'CRITICAL' && !c.isResolved).length} icon={<ICONS.Ticket />} colorClass="rose" />
        <StatCard label="Resolution Rate" value={`${complaints.length > 0 ? Math.round((complaints.filter(c => c.isResolved).length / complaints.length) * 100) : 100}%`} icon={<ICONS.Dashboard />} colorClass="emerald" />
      </div>

      <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
         <button onClick={() => setActiveTab('reviews')} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reviews' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Public Reviews</button>
         <button onClick={() => setActiveTab('complaints')} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'complaints' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Formal Complaints</button>
      </div>

      {activeTab === 'reviews' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              {reviews.map(rev => (
                <div key={rev.id} className={`glass-panel p-6 rounded-3xl border-slate-800 flex flex-col gap-6 group hover:border-indigo-500/30 transition-all ${rev.status === 'hidden' ? 'opacity-40 grayscale' : ''}`}>
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.customerName}`} alt="" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-white">{rev.customerName}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">{new Date(rev.createdAt).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                         <div className="text-amber-400 text-xs tracking-tighter">{'★'.repeat(rev.rating)}{'☆'.repeat(5-rev.rating)}</div>
                         {rev.productName && <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{rev.productName}</p>}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <p className="text-xs text-slate-300 leading-relaxed">"{rev.comment}"</p>
                      {rev.reply && (
                        <div className="ml-6 p-4 bg-indigo-600/10 border-l-2 border-indigo-600 rounded-r-2xl">
                           <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Store Owner Reply</p>
                           <p className="text-xs text-slate-400 italic">"{rev.reply}"</p>
                        </div>
                      )}
                   </div>

                   <div className="flex justify-end gap-2 pt-4 border-t border-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toggleVisibility(rev.id)} className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white text-[9px] font-black uppercase rounded-lg border border-slate-700">{rev.status === 'active' ? 'Hide Review' : 'Show Review'}</button>
                      <button onClick={() => handleOpenReply(rev)} className="px-4 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-lg shadow-lg">{rev.reply ? 'Edit Reply' : 'Post Reply'}</button>
                   </div>
                </div>
              ))}
           </div>

           <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border-slate-800">
                 <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">Star Distribution</h4>
                 <div className="space-y-3">
                    {stats?.distribution.map((count: number, i: number) => {
                       const star = 5 - i;
                       const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
                       return (
                          <div key={star} className="flex items-center gap-4 text-[10px] font-bold">
                             <span className="w-12 text-slate-500">{star} Stars</span>
                             <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                <div className="h-full bg-amber-400" style={{ width: `${percent}%` }}></div>
                             </div>
                             <span className="w-8 text-white text-right">{count}</span>
                          </div>
                       )
                    })}
                 </div>
              </div>

              <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl">
                 <p className="text-xs font-bold text-white mb-2 uppercase tracking-tight">Reputation AI Insight</p>
                 <p className="text-[10px] text-slate-400 leading-relaxed">"Customers frequently mention <span className="text-emerald-400">'teknisi sangat ahli'</span>. High sentiment detected in repair services. Response rate is <span className="text-indigo-400">85%</span>."</p>
              </div>
           </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                    <th className="px-6 py-5">Case Info</th>
                    <th className="px-6 py-5">Context</th>
                    <th className="px-6 py-5">SLA / Status</th>
                    <th className="px-6 py-5 text-right">Operations</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                 {complaints.map(c => (
                    <tr key={c.id} className="hover:bg-slate-800/20 transition-all group">
                       <td className="px-6 py-4">
                          <p className="text-sm font-black text-white">{c.subject}</p>
                          <p className="text-[10px] text-slate-600 font-mono">UID: {c.id}</p>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-xs font-bold text-slate-300">By {c.customerName}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-black">{new Date(c.createdAt).toLocaleDateString()}</p>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                             <span className={`px-2 py-0.5 rounded w-fit text-[8px] font-black uppercase ${
                               c.isResolved ? 'bg-emerald-500/10 text-emerald-400' : 
                               c.status === SupportStatus.ESCALATED ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/20' :
                               'bg-amber-500/10 text-amber-500'
                             }`}>{c.isResolved ? 'RESOLVED' : c.status}</span>
                             {!c.isResolved && <p className="text-[8px] text-slate-600 font-black uppercase">Created {Math.round((Date.now() - new Date(c.createdAt).getTime()) / 3600000)}h ago</p>}
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => escalateComplaint(c.id)} className="p-2 bg-slate-800 text-slate-500 hover:text-rose-400 rounded-lg transition-colors" title="Platform Escalation">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth={2}/></svg>
                             </button>
                             <button onClick={() => handleOpenComplaint(c)} className="px-4 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-lg">Handle Case</button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           {complaints.length === 0 && <div className="p-20 text-center text-slate-600 italic">No formal complaints logged for this regional node.</div>}
        </div>
      )}
    </div>
  );
};

export default ReviewsComplaints;
