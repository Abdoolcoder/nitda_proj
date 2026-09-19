"use client";

import { useState } from "react";

export default function ExitProtocol() {
  const [user, setUser] = useState("student_musa");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const executeProtocol = async () => {
    setLoading(true);
    setConfirming(false);
    try {
      const res = await fetch('/api/exit-protocol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user })
      });
      const data = await res.json();
      setReport(data.report);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Exit Protocol</h1>
      
      {!report ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-600 mb-6">Select a user to safely revoke their access and transfer ownership of their files.</p>
          
          <div className="flex gap-4 items-center">
            <select 
              value={user} 
              onChange={e => setUser(e.target.value)}
              className="border border-slate-300 rounded p-2 text-slate-700 w-64"
            >
              <option value="student_musa">Student Musa (Project Alpha)</option>
              <option value="researcher_bello">Researcher Bello (Project Alpha)</option>
              <option value="student_john">Student John (Project Beta)</option>
            </select>
            
            {!confirming ? (
              <button 
                onClick={() => setConfirming(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded transition-colors"
              >
                Initiate Exit Protocol
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-2 rounded">
                <span className="text-sm font-semibold text-red-800">Are you sure? This will revoke all access.</span>
                <button onClick={executeProtocol} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-bold">
                  {loading ? "Executing..." : "Confirm & Execute"}
                </button>
                <button onClick={() => setConfirming(false)} className="text-slate-500 hover:text-slate-700 text-sm underline">Cancel</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
            <span className="text-2xl">✓</span> Exit Protocol Complete
          </h2>
          
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-bold text-emerald-900 mb-2 border-b border-emerald-200 pb-1">Target User</h3>
              <p className="text-emerald-800">{report.user}</p>
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 mb-2 border-b border-emerald-200 pb-1">Actions Taken</h3>
              <ul className="list-disc list-inside text-emerald-800">
                {report.actions_taken.map((action: string) => (
                  <li key={action}>{action.replace(/_/g, ' ')}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 mb-2 border-b border-emerald-200 pb-1">Projects Revoked</h3>
              <ul className="list-disc list-inside text-emerald-800">
                {report.projects.map((p: string) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-emerald-900 mb-2 border-b border-emerald-200 pb-1">External Shares Disabled</h3>
              <ul className="list-disc list-inside text-emerald-800">
                {report.external_shares_found.map((s: string) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
