"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [user, setUser] = useState("admin");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("demoUser", user);
      window.location.href = "/project";
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-10 rounded-lg shadow-sm border border-slate-200">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Welcome</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <label className="text-sm font-semibold text-slate-700">Select User</label>
        <select 
          className="border border-slate-300 rounded p-3 text-slate-700 focus:outline-none focus:border-blue-500"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        >
          <option value="admin">System Admin</option>
          <option value="dr_amara">Dr. Amara (Project Alpha)</option>
          <option value="dr_sarah">Dr. Sarah (Project Beta)</option>
          <option value="student_musa">Student Musa</option>
          <option value="student_john">Student John</option>
        </select>

        <label className="text-sm font-semibold text-slate-700 mt-2">Vault Password</label>
        <input 
          type="password" 
          required 
          placeholder="Enter secure password"
          className="border border-slate-300 rounded p-3 text-slate-700 focus:outline-none focus:border-blue-500"
        />

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mt-2"
        >
          Authenticate
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
