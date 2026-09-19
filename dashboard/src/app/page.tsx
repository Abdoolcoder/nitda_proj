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
        <label className="text-sm font-semibold text-slate-700">Select Demo User</label>
        <select 
          className="border border-slate-300 rounded p-3 text-slate-700 focus:outline-none focus:border-blue-500"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        >
          <option value="admin">Admin (Full Access)</option>
          <option value="dr_amara">Dr. Amara (Supervising Researcher)</option>
          <option value="researcher_bello">Researcher Bello (Collaborator)</option>
          <option value="student_musa">Student Musa (Departing Student)</option>
        </select>
        <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded transition-colors">
          Enter Dashboard
        </button>
      </form>
    </div>
  );
}
