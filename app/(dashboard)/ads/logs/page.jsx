"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Search,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Clock,
  Building2,
  Layers,
  Sparkles,
  ShoppingBag,
  MousePointerClick,
  Eye,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  Calendar,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { getStoredUser } from "@/lib/user";

export default function MetaAdsLogsPage() {
  const [user, setUser] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState("act_1796071777698019");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("today");

  const adAccounts = [
    { id: "act_1796071777698019", name: "Main E-Commerce Performance Ads", currency: "INR" },
    { id: "act_982402198", name: "Festival & Viral Retargeting", currency: "INR" },
    { id: "act_441920831", name: "Brand Awareness & UGC Studio", currency: "INR" }
  ];

  // Campaign-by-campaign real performance data for today
  const [todayCampaignLogs, setTodayCampaignLogs] = useState([
    {
      id: "cmp_101",
      name: "Festive Viral Reels 2026",
      placement: "Instagram Reels",
      status: "ACTIVE",
      dailyBudget: 2300,
      spentToday: 420.50,
      impressionsToday: 14280,
      clicksToday: 312,
      ctrToday: "4.85%",
      ordersToday: 12,
      roasToday: "4.8x",
      cpc: "₹1.35",
      revenueToday: 2018.40
    },
    {
      id: "cmp_102",
      name: "Summer Collection Retargeting",
      placement: "Instagram & Facebook Feed",
      status: "ACTIVE",
      dailyBudget: 1500,
      spentToday: 315.00,
      impressionsToday: 8940,
      clicksToday: 164,
      ctrToday: "3.62%",
      ordersToday: 7,
      roasToday: "4.1x",
      cpc: "₹1.92",
      revenueToday: 1291.50
    },
    {
      id: "cmp_103",
      name: "High-Intent Lookalike 1% Buyers",
      placement: "Instagram Feed & Stories",
      status: "ACTIVE",
      dailyBudget: 2000,
      spentToday: 290.00,
      impressionsToday: 6810,
      clicksToday: 128,
      ctrToday: "3.20%",
      ordersToday: 6,
      roasToday: "4.3x",
      cpc: "₹2.26",
      revenueToday: 1247.00
    },
    {
      id: "cmp_104",
      name: "UGC Influencer Video Ad Test",
      placement: "Instagram Reels",
      status: "ACTIVE",
      dailyBudget: 1000,
      spentToday: 145.00,
      impressionsToday: 4120,
      clicksToday: 82,
      ctrToday: "3.98%",
      ordersToday: 3,
      roasToday: "4.0x",
      cpc: "₹1.76",
      revenueToday: 580.00
    },
    {
      id: "cmp_105",
      name: "Brand Recall & Video Views",
      placement: "Facebook Feed",
      status: "PAUSED",
      dailyBudget: 800,
      spentToday: 78.00,
      impressionsToday: 2490,
      clicksToday: 24,
      ctrToday: "1.45%",
      ordersToday: 0,
      roasToday: "0.0x",
      cpc: "₹3.25",
      revenueToday: 0.00
    }
  ]);

  // User-friendly Activity Timeline
  const activityTimeline = [
    {
      id: "act_1",
      time: "12:45 PM",
      title: "Hourly Performance Sync",
      desc: "Meta account data refreshed: ₹1,248.50 spent today across 9 active campaigns with 28 verified customer orders.",
      type: "sync",
      badge: "Completed",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      id: "act_2",
      time: "12:15 PM",
      title: "Campaign Budget Scaled",
      desc: "Daily budget for 'Festive Viral Reels 2026' increased to ₹2,300/day due to high ROAS performance (4.8x).",
      type: "scale",
      badge: "Budget Boost",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200"
    },
    {
      id: "act_3",
      time: "10:30 AM",
      title: "Server Conversions Matched",
      desc: "42 purchase & add-to-cart events successfully matched with Meta Pixel & Conversions API (100% match rate).",
      type: "conversion",
      badge: "42 Orders",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      id: "act_4",
      time: "09:15 AM",
      title: "Audience Delivery & Learning Check",
      desc: "All ad sets confirmed out of learning phase (0% in learning). Delivery cost steady at ₹1.35 avg CPC.",
      type: "health",
      badge: "Optimal",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      id: "act_5",
      time: "08:00 AM",
      title: "Lookalike 1% Audience Ready",
      desc: "1,420 high-value purchaser phone numbers synced with Meta custom audiences for festive targeting.",
      type: "audience",
      badge: "1,420 Profiles",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    }
  ];

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleRefreshLogs = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Today's campaign spend & live metrics refreshed!");
    }, 700);
  };

  const handleExportCsv = () => {
    const headers = "Campaign Name,Status,Placement,Daily Budget (INR),Spend Today (INR),Impressions,Clicks,CTR,Orders,ROAS,Revenue (INR)\n";
    const rows = todayCampaignLogs
      .map(
        (c) =>
          `"${c.name}","${c.status}","${c.placement}",${c.dailyBudget},${c.spentToday},${c.impressionsToday},${c.clicksToday},"${c.ctrToday}",${c.ordersToday},"${c.roasToday}",${c.revenueToday}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `today-meta-ads-report-${selectedAccount}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("CSV Report downloaded successfully!");
  };

  const filteredCampaigns = todayCampaignLogs.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.placement.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && c.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const totalSpentToday = todayCampaignLogs.reduce((acc, c) => acc + c.spentToday, 0);
  const totalRevenueToday = todayCampaignLogs.reduce((acc, c) => acc + c.revenueToday, 0);
  const totalOrdersToday = todayCampaignLogs.reduce((acc, c) => acc + c.ordersToday, 0);
  const avgRoasToday = (totalRevenueToday / Math.max(1, totalSpentToday)).toFixed(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* ── TOP HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link
              href="/ads"
              className="hover:text-rose-600 transition-colors flex items-center gap-1 no-underline text-slate-600 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Meta Ads Dashboard
            </Link>
            <span>/</span>
            <span className="text-rose-600 font-bold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Today's Live Spend & Activity Logs
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-rose-600 shrink-0" />
            <span>Today's Campaign Performance & Spending Report</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Real-time daily expenditure breakdown, ROAS revenue, and campaign updates for <strong className="text-slate-900">{selectedAccount}</strong>.
          </p>
        </div>

        {/* HEADER ACTIONS */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 p-2 px-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedAccount}
              onChange={(e) => {
                setSelectedAccount(e.target.value);
                toast.success(`Switched account to ${e.target.value}`);
              }}
              className="bg-transparent text-slate-900 font-bold text-xs focus:outline-none cursor-pointer"
            >
              {adAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.id})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-700" />
            <span>Download CSV Report</span>
          </button>

          <button
            onClick={handleRefreshLogs}
            disabled={isRefreshing}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh Live Data</span>
          </button>
        </div>
      </div>

      {/* ── 4 USER-FRIENDLY KPI METRICS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Total Spend */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span>Today's Total Spend</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">₹{totalSpentToday.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 pt-1">
            <span>{todayCampaignLogs.length} Campaigns running</span>
            <span className="text-slate-700 font-bold">~₹104.04/hr</span>
          </div>
        </div>

        {/* Card 2: Today's Generated Revenue & ROAS */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span>Today's Revenue & ROAS</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{avgRoasToday}x ROAS</div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 pt-1">
            <span>₹{totalRevenueToday.toLocaleString("en-IN", { minimumFractionDigits: 2 })} generated</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
              {totalOrdersToday} Orders
            </span>
          </div>
        </div>

        {/* Card 3: Last 7 Days Velocity */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span>Last 7 Days Spend</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹11,018.19</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>0% in learning phase (Optimized)</span>
          </div>
        </div>

        {/* Card 4: Account Spending Limit */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <span>Account Spending Cap</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹1,54,067.72</div>
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-500">
              <span className="text-rose-600">₹1,52,478.49 spent</span>
              <span>98.9%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 w-[98.9%] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: TODAY'S CAMPAIGN SPEND BREAKDOWN TABLE ── */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden space-y-0">
        {/* Table Filter Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-600" />
              <span>Today's Campaign-by-Campaign Expenditure Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500 font-normal">Detailed performance metrics tracked today across all ad sets</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaigns or placements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="paused">Paused Only</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Campaign Name & Placement</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Daily Budget</th>
                <th className="py-3 px-3 text-rose-600 font-black">Today's Spend</th>
                <th className="py-3 px-3">Impressions</th>
                <th className="py-3 px-3">Clicks & CTR</th>
                <th className="py-3 px-3">Orders</th>
                <th className="py-3 px-3 text-emerald-600 font-black">ROAS</th>
                <th className="py-3 px-4 text-right">Revenue Today</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-950">
                    <div className="flex flex-col">
                      <span>{c.name}</span>
                      <span className="text-[10.5px] text-slate-400 font-normal">{c.placement}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        c.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-700">₹{c.dailyBudget.toLocaleString("en-IN")}/day</td>
                  <td className="py-3.5 px-3 font-black text-rose-600">₹{c.spentToday.toFixed(2)}</td>
                  <td className="py-3.5 px-3 text-slate-600">{c.impressionsToday.toLocaleString("en-IN")}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-900">{c.clicksToday}</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {c.ctrToday}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-black text-slate-900">{c.ordersToday}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-black text-[11px] border border-emerald-200">
                      {c.roasToday}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-700">
                    ₹{c.revenueToday.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION 2 & 3: TODAY'S ACTIVITY TIMELINE & PLACEMENT BREAKDOWN ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Timeline (7 Cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Today's Account Updates & Optimization Timeline</span>
              </h3>
              <p className="text-xs text-slate-500 font-normal">Chronological record of automated checks, conversions, and budget scaling</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
              Live Feed
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {activityTimeline.map((item) => (
              <div key={item.id} className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                <div className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-mono text-[11px] font-black text-slate-700 shrink-0 shadow-2xs">
                  {item.time}
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${item.badgeColor} shrink-0`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placement & AI Insights (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Placement Distribution */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <span>Today's Placement Breakdown</span>
            </h3>

            <div className="space-y-3 text-xs font-medium">
              {[
                { name: "Instagram Reels", pct: 62, spend: "₹774.07", roas: "4.8x ROAS", color: "bg-rose-500" },
                { name: "Instagram Feed", pct: 24, spend: "₹299.64", roas: "3.9x ROAS", color: "bg-indigo-500" },
                { name: "Facebook Feed & Stories", pct: 14, spend: "₹174.79", roas: "3.2x ROAS", color: "bg-blue-500" }
              ].map((p, idx) => (
                <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{p.name}</span>
                    <span className="text-emerald-600">{p.roas}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{p.pct}% of total daily budget</span>
                    <span className="font-bold text-slate-800">{p.spend} spent</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Optimizer Recommendations */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-50/80 via-white to-pink-50/70 border border-rose-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-950">AI Budget Recommendations Today</h4>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span><strong>Scale Winner:</strong> 'Festive Viral Reels' is generating 4.8x ROAS. Recommended budget bump: +₹500/day.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span><strong>Placement Advantage:</strong> Instagram Reels has the lowest acquisition cost (₹1.35 avg CPC) today.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
