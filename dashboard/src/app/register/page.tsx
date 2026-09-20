"use client";

import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, displayName, password })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to register');
      
      setStatus({ loading: false, error: "", success: "Account successfully provisioned in Nextcloud! You can now log into port 8080." });
      setUsername("");
      setDisplayName("");
      setPassword("");
    } catch (err: any) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
      <h1 className="text-2xl font-bold mb-2 text-slate-800 text-center">Researcher Registration</h1>
      <p className="text-slate-500 text-sm text-center mb-6">Create a new secure vault account</p>
      
      {status.error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm mb-4 border border-red-200">{status.error}</div>}
      {status.success && <div className="bg-green-50 text-green-700 p-3 rounded text-sm mb-4 border border-green-200">{status.success}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
          <input 
            type="text" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="e.g. researcher_ali" 
            required 
            className="w-full border border-slate-300 rounded p-2 text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
          <input 
            type="text" 
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="e.g. Dr. Ali" 
            required 
            className="w-full border border-slate-300 rounded p-2 text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Secure Password</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min 10 characters" 
            required 
            minLength={10}
            className="w-full border border-slate-300 rounded p-2 text-sm" 
          />
        </div>
        <button 
          type="submit" 
          disabled={status.loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 rounded transition-colors"
        >
          {status.loading ? "Provisioning Vault..." : "Register Account"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link href="/" className="text-blue-600 hover:underline">← Back to Login</Link>
      </div>
    </div>
  );
}
