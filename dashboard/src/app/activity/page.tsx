"use client";

import { useEffect, useState } from "react";

export default function ActivityAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [rawActivity, setRawActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leak-alerts')
      .then(res => res.json())
      .then(data => {
        setAlerts(data.alerts || []);
        setRawActivity(data.raw_activity || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Activity & Alerts</h1>
      
      {loading ? (
        <div className="text-slate-500">Scanning activity logs...</div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, idx) => (
            <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h3 className="font-bold text-red-900 text-lg">{alert.user}</h3>
                </div>
                <span className="text-xs text-red-400 font-mono">{alert.timestamp.replace('T', ' ').replace('Z', '')}</span>
              </div>
              <div className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-2">
                Rule Triggered: {alert.rule_triggered.replace(/_/g, ' ')}
              </div>
              <p className="text-red-800 bg-red-100 p-3 rounded text-sm">{alert.evidence}</p>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="bg-white p-8 rounded border border-slate-200 text-slate-500 text-center">
              No recent security alerts.
            </div>
          )}
        </div>
      )}

      {/* Raw Activity Log Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-slate-800 border-b pb-2">Live Nextcloud Activity Log</h2>
        {loading ? (
          <div className="text-slate-500 text-sm">Loading activity stream...</div>
        ) : !rawActivity || rawActivity.length === 0 ? (
          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-slate-500 text-sm">
            No recent activity found in Nextcloud. Create or edit files to see them here!
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden text-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                  <th className="py-3 px-4 font-semibold">Details</th>
                  <th className="py-3 px-4 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rawActivity.map((act: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-700">{act.user}</td>
                    <td className="py-3 px-4 text-slate-600">{act.type.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-4 text-slate-500">{act.subject}</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-mono text-xs">
                      {new Date(act.datetime).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
