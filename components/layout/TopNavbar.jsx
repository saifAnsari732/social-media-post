"use client";

import { Bell, Search } from 'lucide-react';

export default function TopNavbar() {
  return (
    <div className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex-1 max-w-xl flex items-center gap-2 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
        <Search className="w-4 h-4 text-[#64748B]" />
        <input 
          type="text" 
          placeholder="Search rules, conversations, or contacts..." 
          className="bg-transparent border-none outline-none w-full text-sm text-[#0F172A] placeholder-[#94A3B8]"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E1306C] rounded-full border border-white"></span>
        </button>
      </div>
    </div>
  );
}
