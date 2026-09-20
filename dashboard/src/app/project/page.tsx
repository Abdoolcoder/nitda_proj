"use client";

import { useEffect, useState } from "react";

export default function ProjectOverview() {
  const [alphaFiles, setAlphaFiles] = useState<string[]>([]);
  const [betaFiles, setBetaFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    const user = localStorage.getItem("demoUser") || "admin";
    setCurrentUser(user);

    Promise.all([
      fetch('/api/project?user=dr_amara').then(res => res.json()),
      fetch('/api/project?user=dr_sarah').then(res => res.json())
    ]).then(([alphaData, betaData]) => {
      setAlphaFiles(alphaData.files || []);
      setBetaFiles(betaData.files || []);
      setLoading(false);
    });
  }, []);

  const showAlpha = currentUser === "admin" || currentUser === "dr_amara" || currentUser === "student_musa" || currentUser === "researcher_bello";
  const showBeta = currentUser === "admin" || currentUser === "dr_sarah" || currentUser === "student_john";

  return (
    <div className="max-w-4xl pb-12">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Project Overview</h1>
      
      {/* PROJECT ALPHA */}
      {showAlpha && (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-semibold mb-2 text-slate-700">Project Alpha</h2>
        <p className="text-slate-500 mb-8">Active Research Data & Drafts</p>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-slate-900 mb-3 border-b pb-2">Members</h3>
            <ul className="space-y-3">
              <li className="flex justify-between text-sm"><span className="font-semibold text-slate-700">Dr. Amara</span> <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Manage</span></li>
              <li className="flex justify-between text-sm"><span className="font-semibold text-slate-700">Researcher Bello</span> <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Edit</span></li>
              <li className="flex justify-between text-sm">
                <span className="font-semibold text-slate-700">Student Musa</span> 
                <span className="flex items-center gap-2">
                  <span className="text-red-500 text-xs font-semibold">Expires: Sep 19</span>
                  <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Edit</span>
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-900 mb-3 border-b pb-2">Files</h3>
            {loading ? (
               <p className="text-sm text-slate-400">Scanning Nextcloud Vault...</p>
            ) : alphaFiles.length === 0 ? (
               <div className="p-4 bg-slate-50 border border-slate-200 text-center rounded text-sm text-slate-500">
                 No files found. Upload files in Nextcloud to see them here.
               </div>
            ) : (
              <ul className="space-y-3 text-sm text-slate-600">
                {alphaFiles.map(f => <li key={f}>📄 {f}</li>)}
              </ul>
            )}
          </div>
        </div>
      </div>
      )}

      {/* PROJECT BETA */}
      {showBeta && (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-2 text-slate-700">Project Beta</h2>
        <p className="text-slate-500 mb-8">Clinical Trial Analytics</p>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-slate-900 mb-3 border-b pb-2">Members</h3>
            <ul className="space-y-3">
              <li className="flex justify-between text-sm"><span className="font-semibold text-slate-700">Dr. Sarah</span> <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Manage</span></li>
              <li className="flex justify-between text-sm">
                <span className="font-semibold text-slate-700">Student John</span> 
                <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Edit</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-900 mb-3 border-b pb-2">Files</h3>
            {loading ? (
               <p className="text-sm text-slate-400">Scanning Nextcloud Vault...</p>
            ) : betaFiles.length === 0 ? (
               <div className="p-4 bg-slate-50 border border-slate-200 text-center rounded text-sm text-slate-500">
                 No files found. Upload files as Dr. Sarah in Nextcloud to see them here.
               </div>
            ) : (
              <ul className="space-y-3 text-sm text-slate-600">
                {betaFiles.map(f => <li key={f}>📄 {f}</li>)}
              </ul>
            )}
          </div>
        </div>
      </div>
      )}

    </div>
  );
}
