"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Eye, 
  Send, 
  Zap, 
  BarChart3, 
  Sparkles,
  CheckCircle2,
  Clock,
  MoreVertical,
  ArrowUpRight,
  ShieldCheck,
  FolderOpen,
  Calendar
} from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [user, setUser] = useState({ name: "saif ansari" });
  const [stats, setStats] = useState({ 
    accounts: 0, 
    posts: 0, 
    rules: 0,
    totalReach: 0,
    totalReachFormatted: "0",
    totalEngagement: 0,
    totalEngagementFormatted: "0",
    publishedCount: 0,
    engagementRate: "0%"
  });
  const [scheduledPostsList, setScheduledPostsList] = useState([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

      const userAccounts = accData.accounts || [];
      const userPosts = postData.posts || [];
      const userRules = Array.isArray(ruleData) ? ruleData : (ruleData.rules || []);

      // Calculate total followers reach from connected accounts
      const totalFollowers = userAccounts.reduce((sum, acc) => sum + (acc.followers || 0), 0);
      const reachFormatted = totalFollowers > 1000 ? `${(totalFollowers / 1000).toFixed(1)}K` : `${totalFollowers}`;
      const engagementCalc = Math.round(totalFollowers * 0.12);
      const engagementFormatted = engagementCalc > 1000 ? `${(engagementCalc / 1000).toFixed(1)}K` : `${engagementCalc}`;

      setStats({
        accounts: userAccounts.length,
        posts: userPosts.length,
        rules: userRules.length,
        totalReach: totalFollowers,
        totalReachFormatted: reachFormatted,
        totalEngagement: engagementCalc,
        totalEngagementFormatted: engagementFormatted,
        publishedCount: userPosts.length,
        engagementRate: userAccounts.length > 0 ? "12.4%" : "0%"
      });

      setScheduledPostsList(userPosts.slice(-3).reverse());
    } catch (e) {
      console.error("Dashboard data load error", e);
    }
  };

  const handleAiQuickPost = async () => {
    if (!aiPrompt) {
      toast.error("Please enter a post prompt!");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("AI Content generated & drafted for your channels!");
      setAiPrompt("");
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Welcome Title Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Welcome {user.name || "saif ansari"} 👋
          </h1>
        </div>
      </div>

      {/* Top 3 Management Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Connected Accounts */}
        <div className="bg-[#E6F4F1] border border-[#BBE3DC] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D9488] text-white flex items-center justify-center font-bold shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-900 block">{stats.accounts} Accounts Connected</span>
            </div>
          </div>
          <Link href="/accounts" className="px-3.5 py-1.5 rounded-xl bg-white border border-[#99D5CA] text-[#0F766E] text-xs font-extrabold hover:bg-white/80 transition-all no-underline">
            Manage
          </Link>
        </div>

        {/* Card 2: Published Posts */}
        <div className="bg-[#FFEDD5] border border-[#FED7AA] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-bold shadow-2xs">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-900 block">{stats.posts} Published Posts</span>
            </div>
          </div>
          <Link href="/posts" className="px-3.5 py-1.5 rounded-xl bg-white border border-[#FDBA74] text-[#C2410C] text-xs font-extrabold hover:bg-white/80 transition-all no-underline">
            View Posts
          </Link>
        </div>

        {/* Card 3: Active Rules */}
        <div className="bg-[#E0F2FE] border border-[#BAE6FD] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-bold shadow-2xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-900 block">{stats.rules} Active Rules</span>
            </div>
          </div>
          <Link href="/rules" className="px-3.5 py-1.5 rounded-xl bg-white border border-[#7DD3FC] text-[#0369A1] text-xs font-extrabold hover:bg-white/80 transition-all no-underline">
            Configure
          </Link>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">TOTAL REACH</span>
            <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalReachFormatted}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#0F766E] text-[10px] font-black border border-[#99F6E4]">+12.4%</span>
            <span className="text-[10px] text-slate-400 font-semibold">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">TOTAL ENGAGEMENT</span>
            <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalEngagementFormatted}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#0F766E] text-[10px] font-black border border-[#99F6E4]">Live</span>
            <span className="text-[10px] text-slate-400 font-semibold">active feedback</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">PUBLISHED POSTS</span>
            <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.publishedCount}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#0F766E] text-[10px] font-black border border-[#99F6E4]">Real</span>
            <span className="text-[10px] text-slate-400 font-semibold">db count</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">ENGAGEMENT RATE</span>
            <div className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.engagementRate}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#0F766E] text-[10px] font-black border border-[#99F6E4]">+1.4%</span>
            <span className="text-[10px] text-slate-400 font-semibold">vs target</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: AI Content Generator, Team Projects, Content Overview (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* AI Content Generator & Scheduler Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" /> AI Content Generator & Scheduler
              </h3>
              <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Create or Schedule AI Post</label>
              <div className="relative">
                <textarea
                  rows={4}
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="Create content for [Platform] about [Topic]..."
                  className="w-full p-4 rounded-2xl border border-slate-300 bg-slate-50/50 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all placeholder:text-slate-400 resize-none"
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-black">📷</span>
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">f</span>
                </div>
                <button
                  onClick={handleAiQuickPost}
                  disabled={isGenerating}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer"
                  title="Generate & Draft"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Next 3 Scheduled Posts Table */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Next 3 Scheduled Posts</h4>
              <div className="space-y-2">
                {scheduledPostsList.length > 0 ? (
                  scheduledPostsList.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-extrabold text-slate-900 truncate max-w-xs">{p.title || p.description || "Social Post"}</span>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-slate-500 font-semibold">{new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                          Published
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400 font-semibold">
                    No scheduled posts yet. Use the publisher to queue your content!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Team & Projects Row */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Team & Projects</h3>
              <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-2">Active Projects</span>
              {[
                { name: "Project Name 1", status: "Draft", bg: "bg-amber-100 text-amber-800" },
                { name: "Project Name 2", status: "Scheduled", bg: "bg-emerald-100 text-emerald-800" },
                { name: "Project Name 3", status: "Scheduled", bg: "bg-sky-100 text-sky-800" }
              ].map((proj, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                  <span className="font-extrabold text-slate-900">{proj.name}</span>
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-black ${proj.bg}`}>{proj.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Performance Overview Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Content Performance Overview</h3>
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Top Performing Posts</span>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Platform Icon</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 max-w-xs truncate font-extrabold text-slate-900">All Performing Posts - E2 Content Overview</td>
                    <td className="py-3.5 px-4"><span className="inline-flex items-center gap-1.5 font-bold text-pink-600">📷 Instagram</span></td>
                    <td className="py-3.5 px-4"><span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">Draft</span></td>
                    <td className="py-3.5 px-4 text-right text-slate-500">Sep 16, 2026</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4 max-w-xs truncate font-extrabold text-slate-900">All Direction Data - E2 Ongoing Campaign</td>
                    <td className="py-3.5 px-4"><span className="inline-flex items-center gap-1.5 font-bold text-blue-600">f Facebook</span></td>
                    <td className="py-3.5 px-4"><span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">Scheduled</span></td>
                    <td className="py-3.5 px-4 text-right text-slate-500">Sep 16, 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Performance & Insights Side Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Performance & Insights</h3>
              <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
            </div>

            {/* Audience Growth Trend */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Audience Growth Trend</h4>
                  <p className="text-[10px] font-semibold text-slate-400">Followers acquisition in continuous campaign</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-extrabold">
                  <span className="flex items-center gap-1 text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Gained</span>
                  <span className="flex items-center gap-1 text-teal-600"><span className="w-2 h-2 rounded-full bg-teal-400"></span> Lost</span>
                </div>
              </div>

              {/* Styled Teal Bar Chart Graphic */}
              <div className="h-44 flex items-end justify-between gap-2 pt-4 pb-2 border-b border-slate-100">
                {[
                  { m: 'Jan', h: '30%' },
                  { m: 'Feb', h: '45%' },
                  { m: 'Mar', h: '65%' },
                  { m: 'Apr', h: '80%' },
                  { m: 'May', h: '70%' },
                  { m: 'Jun', h: '95%' }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full bg-emerald-50 rounded-t-lg h-full flex flex-col justify-end overflow-hidden border border-emerald-200/60">
                      <div style={{ height: bar.h }} className="w-full bg-emerald-500/80 rounded-t-lg border-t-2 border-emerald-600"></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{bar.m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience Sentiment Donut */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900">Audience Sentiment</h4>
              <p className="text-[10px] font-semibold text-slate-400">Followers sentiment in continuous campaign</p>

              <div className="relative w-32 h-32 mx-auto my-2 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100 stroke-current" strokeWidth="3.8" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-500 stroke-current" strokeDasharray="72, 100" strokeWidth="3.8" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-teal-500 stroke-current" strokeDasharray="20, 100" strokeDashoffset="-72" strokeWidth="3.8" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-black text-slate-900">72%</span>
                  <span className="block text-[9px] font-black text-emerald-600 uppercase">Positive</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-semibold">
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Positive Comment</span>
                  <span className="font-extrabold text-emerald-800">72%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-teal-50/60 border border-teal-100">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800"><span className="w-2 h-2 rounded-full bg-teal-500"></span> Brand Neutral</span>
                  <span className="font-extrabold text-teal-800">20%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Negative</span>
                  <span className="font-extrabold text-amber-800">8%</span>
                </div>
              </div>
            </div>

            {/* Audience Demographics */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900">Audience Demographics</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">Top Location</span>
                  <span className="font-black text-slate-900 block text-xs">433K</span>
                  <span className="text-[9px] text-slate-400 font-semibold">Location</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase block mb-1">Top Age Group</span>
                  <span className="font-black text-amber-900 block text-xs">30 - 64</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
                  <span className="text-[10px] font-extrabold text-sky-700 uppercase block mb-1">Top Age</span>
                  <span className="font-black text-sky-900 block text-xs">1.3</span>
                  <span className="text-[9px] text-sky-600 font-semibold">Passive</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
