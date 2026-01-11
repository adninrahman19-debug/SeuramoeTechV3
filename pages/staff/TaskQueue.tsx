import React, { useState } from 'react';
import { SupportStatus, OrderStatus } from '../../types';

interface TaskQueueProps {
  isTechnician: boolean;
}

const TaskQueue: React.FC<TaskQueueProps> = ({ isTechnician }) => {
  // Mock tasks for workflow demonstration
  const [tasks, setTasks] = useState([
    { id: 'T-101', name: 'Asus ROG G14 Screen Replacement', customer: 'Ali Akbar', status: 'CHECKING', priority: 'HIGH' },
    { id: 'T-102', name: 'MacBook Air M1 Logic Board', customer: 'Siti Aminah', status: 'OPEN', priority: 'URGENT' },
    { id: 'T-103', name: 'Lenovo Legion 5 Cleaning', customer: 'Budi', status: 'REPAIRING', priority: 'LOW' }
  ]);

  const updateStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        let next = t.status;
        if (t.status === 'OPEN') next = 'CHECKING';
        else if (t.status === 'CHECKING') next = 'REPAIRING';
        else if (t.status === 'REPAIRING') next = 'RESOLVED';
        return { ...t, status: next };
      }
      return t;
    }));
  };

  return (
    <div className="glass-panel rounded-[2rem] border-slate-800 overflow-hidden shadow-2xl h-full flex flex-col">
      <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Active Task Queue</h3>
          <p className="text-xs text-slate-500 mt-1 uppercase font-black tracking-widest">Live Updates from regional Sumatra-01</p>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
           <button className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg">Pending</button>
           <button className="px-4 py-1.5 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest hover:text-white transition-all">Finished</button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
        {tasks.map((task) => (
          <div key={task.id} className="p-5 bg-slate-950/40 border border-slate-800 hover:border-indigo-500/30 rounded-3xl transition-all group animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                   <div className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono font-bold text-indigo-400">#{task.id}</div>
                   <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                     task.priority === 'URGENT' ? 'bg-rose-500 text-white animate-pulse' : 
                     task.priority === 'HIGH' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'
                   }`}>{task.priority}</span>
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate">{task.name}</h4>
                <div className="flex items-center gap-3 mt-2">
                   <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.customer}`} className="w-4 h-4" alt="" />
                   </div>
                   <p className="text-[11px] text-slate-500 font-medium">Customer: <span className="text-slate-300">{task.customer}</span></p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto">
                 <div className="flex flex-col items-start md:items-end">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Current State</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      task.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      task.status === 'REPAIRING' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                      'bg-slate-900 text-slate-500 border-slate-800'
                    }`}>
                      {task.status}
                    </span>
                 </div>
                 <button 
                   onClick={() => updateStatus(task.id)}
                   disabled={task.status === 'RESOLVED'}
                   className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 whitespace-nowrap"
                 >
                    {task.status === 'OPEN' ? 'Mulai Cek' : task.status === 'CHECKING' ? 'Eksekusi Servis' : task.status === 'REPAIRING' ? 'Selesai' : 'Selesai ✓'}
                 </button>
              </div>
            </div>
            
            <div className="mt-5 pt-5 border-t border-slate-800/50 flex flex-wrap gap-4">
               <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Due in 4h</span>
               </div>
               <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth={2}/></svg>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">View Details</span>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-6 bg-slate-900 border-t border-slate-800 text-center">
         <button className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">See Complete Task History</button>
      </div>
    </div>
  );
};

export default TaskQueue;