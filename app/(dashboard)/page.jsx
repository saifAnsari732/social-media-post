"use client";

import Link from "next/link";
import { Zap, MessageCircle, ArrowRight } from "lucide-react";

export default function DashboardRoot() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-2xl p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome to AutoReply Pro</h1>
          </div>
          
          <p className="text-white/90 text-lg max-w-xl mb-8 leading-relaxed">
            Your social media automation suite is ready. Set up AI-powered keyword rules, manage incoming messages, and reply to comments automatically 24/7.
          </p>

          <div className="flex gap-4">
            <Link href="/rules/new" className="bg-white text-[#FD1D1D] px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <Zap className="w-5 h-5" /> Create New Rule
            </Link>
            <Link href="/inbox" className="bg-black/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-bold hover:bg-black/30 transition-all border border-white/20 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Open Unified Inbox
            </Link>
          </div>
        </div>
        
        {/* Decorative background circle */}
        <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] hover:border-[#7C3AED]/30 hover:shadow-md transition-all group">
           <h3 className="text-lg font-bold text-[#0F172A] mb-2">Automation Rules</h3>
           <p className="text-[#64748B] text-sm mb-4">View and manage your keyword triggers and AI prompts.</p>
           <Link href="/rules" className="text-[#7C3AED] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
             Manage Rules <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] hover:border-[#7C3AED]/30 hover:shadow-md transition-all group">
           <h3 className="text-lg font-bold text-[#0F172A] mb-2">Social Media Publisher</h3>
           <p className="text-[#64748B] text-sm mb-4">Post videos and content to multiple social media accounts at once.</p>
           <Link href="/publisher" className="text-[#7C3AED] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
             Open Publisher <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      </div>
    </div>
  );
}
