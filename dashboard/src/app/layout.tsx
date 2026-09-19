import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = { title: 'Secure Workspace' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex">
        <Sidebar />
        <main className="flex-1 p-12 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
