"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [user, setUser] = useState("admin");
  const pathname = usePathname();

  useEffect(() => {
    setUser(localStorage.getItem("demoUser") || "admin");
  }, []);

  // Hide the sidebar completely on login and register pages
  if (pathname === "/" || pathname === "/register") {
    return null;
  }

  const isAdmin = user === "admin";

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm">
      <div className="font-bold text-lg mb-8 text-blue-900 tracking-tight leading-tight">
        {isAdmin ? "Security Admin Dashboard" : "Project Dashboard"}
      </div>
      
      <div className="mb-6 pb-4 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Logged in as</span>
        <span className="text-sm font-semibold text-slate-800">{user.replace('_', ' ')}</span>
      </div>

      <nav className="flex flex-col gap-4 text-sm font-medium">
        <Link href="/" className="text-slate-400 hover:text-blue-600 transition-colors text-xs">← Switch User</Link>
        <Link href="/project" className="text-slate-600 hover:text-blue-600 transition-colors">Project Overview</Link>
        
        {isAdmin && (
          <>
            <Link href="/activity" className="text-slate-600 hover:text-blue-600 transition-colors">Activity & Alerts</Link>
            <Link href="/exit" className="text-slate-600 hover:text-blue-600 transition-colors">Exit Protocol</Link>
            <Link href="/share" className="text-slate-600 hover:text-blue-600 transition-colors">External Sharing</Link>
          </>
        )}
      </nav>
    </aside>
  );
}
