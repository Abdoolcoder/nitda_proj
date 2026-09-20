"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "" });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: "" });

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      
      // Success!
      if (typeof window !== "undefined") {
        localStorage.setItem("demoUser", username);
        window.location.href = "/project";
      }
    } catch (err: any) {
      setStatus({ loading: false, error: err.message });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-10 rounded-lg shadow-sm border border-slate-200">
      <h1 className="text-2xl font-bold mb-2 text-slate-800">Secure Vault Access</h1>
      <p className="text-slate-500 text-sm mb-6">Authenticate via Nextcloud SSO</p>

      {status.error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm mb-4 border border-red-200">{status.error}</div>}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
            placeholder="e.g. admin or dr_amara"
            className="w-full border border-slate-300 rounded p-3 text-slate-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Vault Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            placeholder="Enter secure password"
            className="w-full border border-slate-300 rounded p-3 text-slate-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button 
          type="submit" 
          disabled={status.loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 rounded-lg transition-colors mt-2"
        >
          {status.loading ? "Authenticating..." : "Authenticate"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 mb-2">Need a research vault account?</p>
        <a 
          href="/register" 
          className="w-full inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-lg transition-colors"
        >
          Register New Account
        </a>
      </div>
    </div>
  );
}
