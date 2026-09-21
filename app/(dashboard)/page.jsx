"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare, 
  Send, 
  Zap, 
  BarChart3, 
  Calendar, 
  ArrowUpRight, 
  Share2, 
  Heart, 
  Sparkles,
  CheckCircle2,
  Clock,
  MoreVertical,
  Filter
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState({ name: "Saifuddin" });
  const [dateRange, setDateRange] = useState("30 Days");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ accounts: 0, posts: 0, rules: 0 });

  useEffect(() => {
    const userStr = localStorage.getItem("yt_user");
    if (userStr) {
      setUser(JSON.parse(userStr));
      loadDashboardData(JSON.parse(userStr).userId);
    } else {
      setLoading(false);
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
      console.error("Failed to load dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  const kpis = [
    {
      title: "Total Reach",
      value: "125,640",
      change: "+18.4%",
      isPositive: true,
      compare: "vs last month",
      icon: <Eye className="w-4 h-4 text-violet-600" />,
      color: "bg-violet-50 border-violet-100"
    },
    {
      title: "Total Engagement",
      value: "48,920",
      change: "+12.8%",
      isPositive: true,
      compare: "vs last month",
      icon: <Heart className="w-4 h-4 text-pink-600" />,
      color: "bg-pink-50 border-pink-100"
    },
    {
      title: "Total Followers",
      value: "18,420",
      change: "+9.6%",
      isPositive: true,
      compare: "vs last month",
      icon: <Users className="w-4 h-4 text-blue-600" />,
      color: "bg-blue-50 border-blue-100"
    },
    {
      title: "Published Posts",
      value: stats.posts ? String(stats.posts) : "128",
      change: "+14.2%",
      isPositive: true,
      compare: "vs last month",
      icon: <Send className="w-4 h-4 text-emerald-600" />,
      color: "bg-emerald-50 border-emerald-100"
    },
    {
      title: "Total Impressions",
      value: "245.8K",
      change: "+21.4%",
      isPositive: true,
      compare: "vs last month",
      icon: <TrendingUp className="w-4 h-4 text-indigo-600" />,
      color: "bg-indigo-50 border-indigo-100"
    },
    {
      title: "Engagement Rate",
      value: "7.8%",
      change: "+1.4%",
      isPositive: true,
      compare: "vs last month",
      icon: <Sparkles className="w-4 h-4 text-amber-600" />,
      color: "bg-amber-50 border-amber-100"
    }
  ];

  const recentPosts = [
    {
      title: "AI Growth Engine Launch - Q3 Strategy Showcase",
      platform: "Instagram",
      platformColor: "bg-pink-500",
      date: "Today, 10:30 AM",
      reach: "14.2K",
      likes: "1,240",
      comments: "184",
      shares: "92",
      rate: "8.4%",
      status: "Published"
    },
    {
      title: "Automated DM Reply Workflow Tutorial for Meta",
      platform: "Facebook",
      platformColor: "bg-blue-600",
      date: "Yesterday, 4:15 PM",
      reach: "9.8K",
      likes: "850",
      comments: "94",
      shares: "41",
      rate: "6.9%",
      status: "Published"
    },
    {
      title: "Top 5 Social Media Marketing Trends for 2026",
      platform: "YouTube",
      platformColor: "bg-red-600",
      date: "Sep 19, 2026",
      reach: "32.5K",
      likes: "3,100",
      comments: "412",
      shares: "204",
      rate: "11.2%",
      status: "Published"
    },
    {
      title: "Multi-Platform Automation SaaS Release Note v2.4",
      platform: "X / Twitter",
      platformColor: "bg-slate-900",
      date: "Sep 18, 2026",
      reach: "6.4K",
      likes: "420",
      comments: "38",
      shares: "88",
      rate: "7.1%",
      status: "Published"
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Good morning, {user.name || "Saifuddin"} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Here's what's happening across your social channels today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200/80 p-1 rounded-xl shadow-sm text-xs font-bold text-slate-600">
            {["Today", "7 Days", "30 Days", "90 Days"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  dateRange === range
                    ? "bg-slate-900 text-white shadow-xs"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Primary Action Button */}
          <Link
            href="/publisher"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-all no-underline shrink-0"
          >
            <Plus className="w-4 h-4" /> Create Post
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (Matches Section 5 of Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <div className={`p-2 rounded-xl border ${kpi.color}`}>
                  {kpi.icon}
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-[11px]">
              <span className={`font-bold ${kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {kpi.change}
              </span>
              <span className="text-slate-400 font-medium">{kpi.compare}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Audience Insights Section (Matches Screenshot 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Audience Growth Trend Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Audience Growth Trend</h3>
              <p className="text-xs text-slate-500 font-medium">Follower acquisition vs lost across channels</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-600"></span> Gained
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-600 font-bold ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Lost
              </span>
            </div>
          </div>

          {/* Styled Bar Chart Graphic */}
          <div className="h-64 flex items-end justify-between gap-4 pt-8 pb-2 px-2 border-b border-slate-100">
            {[
              { month: 'Jan', gained: 40, lost: 10 },
              { month: 'Feb', gained: 55, lost: 12 },
              { month: 'Mar', gained: 85, lost: 15 },
              { month: 'Apr', gained: 65, lost: 8 },
              { month: 'May', gained: 95, lost: 14 },
              { month: 'Jun', gained: 120, lost: 18 }
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full max-w-[36px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full relative">
                  <div 
                    style={{ height: `${d.gained}%` }} 
                    className="w-full bg-gradient-to-t from-violet-600 to-indigo-500 rounded-t-xl transition-all group-hover:brightness-110"
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Sentiment & Optimal Time (Matches Screenshot 4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Audience Sentiment</h3>
            <p className="text-xs text-slate-500 font-medium mb-6">Real-time comment sentiment analysis</p>

            {/* Donut Chart Indicator */}
            <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100 stroke-current" strokeWidth="3.8" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-emerald-500 stroke-current" strokeDasharray="72, 100" strokeWidth="3.8" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-violet-500 stroke-current" strokeDasharray="20, 100" strokeDashoffset="-72" strokeWidth="3.8" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-slate-900">72%</span>
                <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Positive</span>
              </div>
            </div>

            {/* Sentiment Legend */}
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Positive Comments</span>
                <span className="text-slate-900">72%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span> Neutral Inquiries</span>
                <span className="text-slate-900">20%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Negative</span>
                <span className="text-slate-900">8%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Content Performance Table Section (Matches Section 6 of Prompt) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Content Performance Overview</h3>
            <p className="text-xs text-slate-500 font-medium">Recent published posts across all connected channels</p>
          </div>
          <Link
            href="/posts"
            className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 no-underline"
          >
            View All Posts <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">Post Title</th>
                <th className="py-3.5 px-4">Platform</th>
                <th className="py-3.5 px-4">Published</th>
                <th className="py-3.5 px-4">Reach</th>
                <th className="py-3.5 px-4">Likes</th>
                <th className="py-3.5 px-4">Comments</th>
                <th className="py-3.5 px-4">Eng. Rate</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentPosts.map((post, index) => (
                <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 max-w-xs truncate">
                    {post.title}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-800">
                      <span className={`w-2 h-2 rounded-full ${post.platformColor}`}></span> {post.platform}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500">{post.date}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">{post.reach}</td>
                  <td className="py-4 px-4">{post.likes}</td>
                  <td className="py-4 px-4">{post.comments}</td>
                  <td className="py-4 px-4 font-bold text-emerald-600">{post.rate}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> {post.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
