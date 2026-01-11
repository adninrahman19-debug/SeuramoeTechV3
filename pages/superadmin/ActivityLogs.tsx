
import React from 'react';

const ActivityLogs: React.FC = () => {
  const logs = [
    { id: '1', user: 'System', action: 'Global revenue config updated', target: 'Billing Engine', time: '2 mins ago', type: 'info' },
    { id: '2', user: 'Teuku Abdullah', action: 'New staff account created', target: 'Aceh Tech Center', time: '1 hour ago', type: 'success' },
    { id: '3', user: 'System', action: 'Subscription plan "Tech Giant" price modified', target: 'Pricing Models', time: '3 hours ago', type: 'warning' },
    { id: '4', user: 'Cut Nyak Dien', action: 'Login from new IP address (182.xx.xx.xx)', target: 'Security', time: '5 hours ago', type: 'info' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">System Activity Logs</h2>
        <button className="px-4 py-2 bg-slate-800 text-xs font-bold text-slate-300 rounded-lg hover:bg-slate-700 transition-all border border-slate-700">Export CSV</button>
      </div>

      <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden">
        <div className="divide-y divide-slate-800">
          {logs.map(log => (
            <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${log.type === 'info' ? 'bg-blue-500' : log.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                <div>
                  <p className="text-sm font-bold text-white">
                    <span className="text-indigo-400">{log.user}</span> {log.action}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{log.target}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium">{log.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
