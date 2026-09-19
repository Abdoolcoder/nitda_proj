"use client";

import { useEffect, useState } from "react";

export default function ExternalSharing() {
  const [shares, setShares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/shares')
      .then(res => res.json())
      .then(data => {
        setShares(data.shares || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl pb-12">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">External Sharing Audit Log</h1>
      <p className="text-slate-600 mb-8">
        This panel is an Admin view of all public links created inside Nextcloud. 
        Create and manage external shares directly inside Nextcloud.
      </p>
      
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Active Share Links</h2>
        
        {loading ? (
          <div className="text-slate-500">Scanning Nextcloud for public links...</div>
        ) : shares.length === 0 ? (
          <div className="p-4 bg-slate-50 border border-slate-200 text-center rounded text-sm text-slate-500">
            No active external shares found. Go to Nextcloud, click "Share" on a file, and create a "Share link" to see it here!
          </div>
        ) : (
          <div className="space-y-4">
            {shares.map((share, idx) => {
              const isExpired = share.expiration !== "No Expiration" && new Date(share.expiration) < new Date();
              return (
                <div key={idx} className={`p-4 border rounded ${isExpired ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-semibold ${isExpired ? 'text-slate-700 line-through' : 'text-blue-900'}`}>{share.file}</span>
                    <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${isExpired ? 'bg-slate-200 text-slate-600' : 'bg-blue-200 text-blue-700'}`}>
                      {isExpired ? 'Expired' : 'Active'}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 grid grid-cols-2 gap-2">
                    <div><strong>Created By:</strong> {share.owner}</div>
                    <div><strong>Expiration Date:</strong> {share.expiration !== "No Expiration" ? new Date(share.expiration).toLocaleString() : "None"}</div>
                    <div className="col-span-2 mt-2">
                      <strong>Public Link:</strong> <a href={share.url} target="_blank" className="text-blue-600 hover:underline">{share.url}</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
