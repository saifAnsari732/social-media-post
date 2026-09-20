"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Send, 
  Zap, 
  MessageCircle, 
  BarChart3, 
  CreditCard, 
  ArrowUpRight, 
  Link2, 
  CheckCircle2,
  Clock,
  LayoutGrid
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState({ name: "User" });
  const [stats, setStats] = useState({ accounts: 0, rules: 0, posts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("yt_user");
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser(u);
      loadDashboardData(u.userId);
    }
  }, []);

  const loadDashboardData = async (userId) => {
    try {
      const [accRes, postRes, ruleRes] = await Promise.all([
        fetch("/api/accounts", { headers: { "x-user-id": userId } }),
        fetch("/api/post", { headers: { "x-user-id": userId } }),
        fetch("/api/rules", { headers: { "x-user-id": userId } })
      ]);

      const accData = await accRes.json();
      const postData = await postRes.json();
      const ruleData = await ruleRes.json();

      setStats({
        accounts: accData.accounts?.length || 0,
        posts: postData.posts?.length || 0,
        rules: Array.isArray(ruleData) ? ruleData.length : 0
      });
    } catch (e) {
      console.error("Failed to load stats", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#7C3AED] p-8 md:p-10 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DB2777]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#A78BFA] text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#DB2777]" /> AI-Powered SaaS Automation Suite
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-[#C7D2FE] text-sm md:text-base leading-relaxed mb-8">
            Manage your Meta, Instagram, Facebook, and YouTube channels. Auto-publish content with Gemini AI and trigger automated DMs.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/publisher"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all flex items-center gap-2 no-underline"
            >
              <Send className="w-4 h-4" /> Create New Post
            </Link>
            <Link
              href="/accounts"
              className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold text-sm hover:bg-white/20 transition-all flex items-center gap-2 no-underline"
            >
              <Link2 className="w-4 h-4" /> Connect Social Accounts
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Connected Channels</p>
            <h3 className="text-3xl font-extrabold text-[#0F172A]">{loading ? "..." : stats.accounts}</h3>
            <p className="text-[11px] text-[#10B981] font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Meta & YouTube Sync
            </p>
          </div>
          <div className="p-4 bg-[#F3E8FF] rounded-2xl border border-[#E9D5FF]">
            <Link2 className="w-6 h-6 text-[#7C3AED]" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Published Content</p>
            <h3 className="text-3xl font-extrabold text-[#0F172A]">{loading ? "..." : stats.posts}</h3>
            <p className="text-[11px] text-[#7C3AED] font-medium mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> AI Generated & Uploaded
            </p>
          </div>
          <div className="p-4 bg-[#FCE7F3] rounded-2xl border border-[#FBCFE8]">
            <LayoutGrid className="w-6 h-6 text-[#DB2777]" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Automation Rules</p>
            <h3 className="text-3xl font-extrabold text-[#0F172A]">{loading ? "..." : stats.rules}</h3>
            <p className="text-[11px] text-[#6366F1] font-medium mt-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Active DM & Comment Bots
            </p>
          </div>
          <div className="p-4 bg-[#E0E7FF] rounded-2xl border border-[#C7D2FE]">
            <Zap className="w-6 h-6 text-[#4F46E5]" />
          </div>
        </div>
      </div>

      {/* Quick Action Modules */}
      <div>
        <h3 className="text-lg font-bold text-[#0F172A] mb-4">SaaS Management & Copilot</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Link href="/publisher" className="group bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#7C3AED] transition-all no-underline flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#F3E8FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Send className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A] mb-1">AI Publisher</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">Generate captions with Gemini 3.5 & publish to multi-platforms instantly.</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-[#7C3AED] group-hover:translate-x-1 transition-transform">
              Open Publisher <ArrowUpRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link href="/rules" className="group bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#DB2777] transition-all no-underline flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#FCE7F3] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-[#DB2777]" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A] mb-1">Automation Rules</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">Configure auto-replies for DMs & comments based on keyword triggers.</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-[#DB2777] group-hover:translate-x-1 transition-transform">
              Configure Rules <ArrowUpRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link href="/webhook-logs" className="group bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#4F46E5] transition-all no-underline flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#E0E7FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A] mb-1">Webhook Simulator</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">Simulate Meta webhook events locally to test your DM automation rules.</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-[#4F46E5] group-hover:translate-x-1 transition-transform">
              Test Webhooks <ArrowUpRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link href="/billing" className="group bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#10B981] transition-all no-underline flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5 text-[#10B981]" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A] mb-1">Razorpay Billing</h4>
              <p className="text-xs text-[#64748B] leading-relaxed">Upgrade your plan & manage your SaaS subscription seamlessly.</p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-[#10B981] group-hover:translate-x-1 transition-transform">
              Manage Subscription <ArrowUpRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
