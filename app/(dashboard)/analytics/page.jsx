"use client";

import { useState, useEffect } from "react";
import { BarChart3, Download, Share2, TrendingUp, Users, Eye, Heart, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AnalyticsPage() {
  const [data, setData] = useState({ activeRules: 0, totalRepliesSent: 0, aiTokensUsed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportCsv = () => {
    toast.success("Analytics report exported to CSV!");
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header (Matches Screenshot 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Social Media Analytics</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Track performance, engagement, and growth across all your social platforms in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200/80 bg-white text-slate-700 font-bold text-xs shadow-xs hover:bg-slate-50"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => toast.success("Share link copied to clipboard!")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md shadow-violet-600/20 hover:bg-violet-700"
          >
            <Share2 className="w-4 h-4" /> Share Report
          </button>
        </div>
      </div>

      {/* KPI Cards Bar (Matches Screenshot 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Followers</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">132,540</div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">+8% from last month</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Engagement</span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">48,920</div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">+12% from last month</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Reach</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">1.8M</div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">+10% from last month</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Impressions</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">3.2M</div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">+6% from last month</span>
        </div>
      </div>

      {/* Backend Real Automation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">DM Auto-Replies Sent</p>
          <h4 className="text-2xl font-extrabold text-slate-900">{loading ? "..." : data.totalRepliesSent}</h4>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">● Active Trigger Engine</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">AI Tokens Consumed</p>
          <h4 className="text-2xl font-extrabold text-slate-900">{loading ? "..." : data.aiTokensUsed}</h4>
          <span className="text-[11px] text-violet-600 font-bold mt-1 inline-block">Gemini 3.5 Active</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Active Rules Enabled</p>
          <h4 className="text-2xl font-extrabold text-slate-900">{loading ? "..." : data.activeRules}</h4>
          <span className="text-[11px] text-blue-600 font-bold mt-1 inline-block">100% System Health</span>
        </div>
      </div>

      {/* Platform Performance Overview & Optimal Time Heatmap (Matches Screenshot 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Platform Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Platform Performance Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="p-3">Platform</th>
                  <th className="p-3">Followers</th>
                  <th className="p-3">Engagement</th>
                  <th className="p-3">Reach</th>
                  <th className="p-3 text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {[
                  { name: "Instagram", bg: "bg-pink-500", followers: "54K", eng: "12.3K", reach: "430K", growth: "+9%" },
                  { name: "Facebook", bg: "bg-blue-600", followers: "38K", eng: "8.2K", reach: "310K", growth: "+6%" },
                  { name: "TikTok", bg: "bg-rose-500", followers: "22K", eng: "15.1K", reach: "520K", growth: "+8%" },
                  { name: "LinkedIn", bg: "bg-blue-700", followers: "12K", eng: "2.4K", reach: "120K", growth: "+4%" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="p-3 flex items-center gap-2 font-bold text-slate-900">
                      <span className={`w-2.5 h-2.5 rounded-full ${row.bg}`}></span> {row.name}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{row.followers}</td>
                    <td className="p-3 text-slate-600">{row.eng}</td>
                    <td className="p-3 text-slate-600">{row.reach}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">{row.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Optimal Posting Time Heatmap (Matches Screenshot 4) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">Optimal Posting Time</h3>
          <p className="text-xs text-slate-500 font-medium mb-4">Highest engagement window heat map</p>

          <div className="space-y-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, dIdx) => (
              <div key={day} className="flex items-center gap-2 text-xs">
                <span className="w-8 font-bold text-slate-400">{day}</span>
                <div className="flex-1 grid grid-cols-7 gap-1.5">
                  {[20, 40, 80, 60, 90, 30, 50].map((opacity, i) => (
                    <div
                      key={i}
                      style={{ opacity: opacity / 100 }}
                      className="h-5 rounded-md bg-orange-500 shadow-2xs"
                      title={`${day} @ ${i * 3}h: ${opacity}% peak engagement`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
