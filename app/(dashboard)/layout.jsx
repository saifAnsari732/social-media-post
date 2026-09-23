"use client";

import Sidebar from '@/components/layout/Sidebar';
import TopNavbar from '@/components/layout/TopNavbar';
import TrialPaywallModal from '@/components/ui/TrialPaywallModal';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      <Sidebar />
      <div className="pl-[275px] flex min-h-screen flex-col transition-all duration-300">
        <TopNavbar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <TrialPaywallModal />
    </div>
  );
}
