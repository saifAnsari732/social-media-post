"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredUser, getUserPlanLimits } from "@/lib/user";
import {
  Megaphone,
  Lock,
  Sparkles,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointerClick,
  ShoppingBag,
  Zap,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Building2,
  ArrowUpRight,
  Target,
  BarChart3,
  Layers,
  X
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/SocialIcons";

export default function MetaAdsPage() {
  const [user, setUser] = useState(null);
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);

  // Upgrade Modal state for non-Pro Unlimited users trying an action
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [attemptedAction, setAttemptedAction] = useState("");

  // Active Tab: 'campaigns' | 'booster' | 'ai-studio' | 'settings'
  const [activeTab, setActiveTab] = useState("campaigns");

  // Selected Ad Account
  const [selectedAccount, setSelectedAccount] = useState("act_982402198");

  // Filter Status
  const [statusFilter, setStatusFilter] = useState("all");

  // Post Booster Modal State
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [boostBudget, setBoostBudget] = useState(500);
  const [boostDuration, setBoostDuration] = useState(7);
  const [boostAudience, setBoostAudience] = useState("Engaged Shoppers in India (Ages 18-45)");
  const [boostLaunching, setBoostLaunching] = useState(false);
  const [boostSuccess, setBoostSuccess] = useState(false);

  // AI Ad Copy Studio State
  const [productPrompt, setProductPrompt] = useState("");
  const [adTone, setAdTone] = useState("high-converting");
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const [generatedCopies, setGeneratedCopies] = useState(null);

  // Mock Campaigns Data
  const [campaigns, setCampaigns] = useState([
    {
      id: "cam_01",
      name: "🔥 Festive Season Sale — 50% OFF Direct Retargeting",
      platform: "instagram",
      objective: "Conversions (Sales)",
      status: "ACTIVE",
      dailyBudget: 2500,
      spent: 17500,
      impressions: 89400,
      clicks: 4320,
      ctr: "4.83%",
      purchases: 210,
      roas: "4.8x"
    },
    {
      id: "cam_02",
      name: "🚀 Product Launch — Reels Video Traffic Campaign",
      platform: "facebook",
      objective: "Traffic & Link Clicks",
      status: "ACTIVE",
      dailyBudget: 1500,
      spent: 10500,
      impressions: 64200,
      clicks: 3890,
      ctr: "6.05%",
      purchases: 95,
      roas: "3.9x"
    },
    {
      id: "cam_03",
      name: "✨ Instagram Lookalike Audience Lead Gen",
      platform: "instagram",
      objective: "Lead Generation",
      status: "PAUSED",
      dailyBudget: 1000,
      spent: 14200,
      impressions: 51000,
      clicks: 2100,
      ctr: "4.11%",
      purchases: 115,
      roas: "3.4x"
    },
    {
      id: "cam_04",
      name: "🎯 Brand Awareness & Reach — Top of Funnel",
      platform: "facebook",
      objective: "Brand Awareness",
      status: "ACTIVE",
      dailyBudget: 800,
      spent: 6050,
      impressions: 41200,
      clicks: 2090,
      ctr: "5.07%",
      purchases: 60,
      roas: "4.1x"
    }
  ]);

  // Mock Organic Posts for Booster
  const mockOrganicPosts = [
    {
      id: "post_101",
      title: "🔥 Summer Collection Drop is LIVE! Grab 30% OFF using code SUMMER30.",
      platform: "instagram",
      publishedAt: "2 hours ago",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
      organicReach: "3,420 users",
      organicLikes: 248,
      organicComments: 34
    },
    {
      id: "post_102",
      title: "✨ Customer Spotlight: How Sarah scaled her online store with our strategies.",
      platform: "facebook",
      publishedAt: "Yesterday",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      organicReach: "5,190 users",
      organicLikes: 412,
      organicComments: 58
    },
    {
      id: "post_103",
      title: "🎁 Giveaway Alert! Tag 3 friends in the comments to win ₹5,000 voucher.",
      platform: "instagram",
      publishedAt: "3 days ago",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
      organicReach: "9,850 users",
      organicLikes: 1120,
      organicComments: 340
    }
  ];

  useEffect(() => {
    const u = getStoredUser();
    setUser(u);
    const l = getUserPlanLimits(u);
    setLimits(l);
    setLoading(false);
  }, []);

  /**
   * Plan Check Guard:
   * Returns true if user is on Pro Unlimited or Admin.
   * If not active, triggers the Upgrade Modal checkout prompt.
   */
  const checkPlanActive = (actionName = "Access Meta Ads Feature") => {
    if (limits?.hasMetaAds) {
      return true;
    }
    setAttemptedAction(actionName);
    setShowUpgradeModal(true);
    return false;
  };

  const toggleCampaignStatus = (id) => {
    if (!checkPlanActive("Pause/Resume Meta Campaign")) return;
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : c
      )
    );
  };

  const handleOpenBoostModal = (post) => {
    if (!checkPlanActive("1-Click Boost Organic Post")) return;
    setSelectedPost(post);
    setBoostModalOpen(true);
  };

  const handleLaunchBoost = () => {
    if (!checkPlanActive("Launch Sponsored Meta Campaign")) return;
    setBoostLaunching(true);
    setTimeout(() => {
      setBoostLaunching(false);
      setBoostSuccess(true);
      setTimeout(() => {
        setBoostSuccess(false);
        setBoostModalOpen(false);
      }, 1800);
    }, 1500);
  };

  const handleGenerateAICopy = () => {
    if (!productPrompt.trim()) return;
    if (!checkPlanActive("Generate AI Meta Ad Copy")) return;
    setGeneratingCopy(true);
    setTimeout(() => {
      setGeneratedCopies([
        {
          headline: "🔥 Flash Sale Alert! Save Big Today Only",
          primaryText: `Transform your results with ${productPrompt}! Premium quality, fast nationwide delivery, and 100% satisfaction guaranteed. Don't miss out on our limited-time offer.`,
          description: "Free Shipping on Orders Above ₹999 | 5-Star Rated Customer Choice",
          cta: "Shop Now"
        },
        {
          headline: "✨ Discover Why 10,000+ Customers Love This!",
          primaryText: `Looking for the best ${productPrompt}? Upgrade your experience with our top-rated collection designed for maximum performance and style. Order yours before stocks run out!`,
          description: "Exclusive Discount Applied at Checkout | Fast Dispatch",
          cta: "Learn More"
        }
      ]);
      setGeneratingCopy(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-indigo-600 font-bold">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading Meta Ads Command Hub...</span>
        </div>
      </div>
    );
  }

  const isMetaAdsUnlocked = Boolean(limits?.hasMetaAds);
  const filteredCampaigns = campaigns.filter((c) => {
    if (statusFilter === "all") return true;
    return c.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* ⚠️ PLAN STATUS BANNER: Shows active status or Upgrade Prompt */}
      {!isMetaAdsUnlocked ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white border-2 border-purple-500/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-amber-300 flex items-center justify-center font-bold shrink-0 shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                  PREVIEW MODE
                </span>
                <span className="text-xs font-bold text-purple-200">
                  Current Plan: {limits?.planTitle || "Starter / Growth / Trial"}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">
                Meta Ads Manager is a <span className="text-purple-300 font-extrabold">Pro Unlimited Exclusive</span> feature. You can preview the dashboard UI below. Upgrade your plan to activate live ad management & post boosting!
              </p>
            </div>
          </div>

          <button
            onClick={() => checkPlanActive("Upgrade Plan")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-current" />
            <span>Upgrade to Pro Unlimited (₹4,999)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pro Unlimited Active: Your Meta Marketing API & Meta Ads Manager are fully unlocked and ready.</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase">
            Active & Verified
          </span>
        </div>
      )}
      
      {/* 1. Header Section & Account Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border flex items-center gap-1 ${
              isMetaAdsUnlocked
                ? "bg-purple-100 text-purple-700 border-purple-200"
                : "bg-amber-100 text-amber-800 border-amber-200"
            }`}>
              {isMetaAdsUnlocked ? <ShieldCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {isMetaAdsUnlocked ? "PRO UNLIMITED ACTIVE" : "FEATURE LOCKED — PREVIEW MODE"}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Meta Graph API v20.0
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-purple-600 shrink-0" /> Meta Ads Command Hub
          </h1>
          <p className="text-slate-600 text-xs md:text-sm font-semibold">
            Manage Facebook & Instagram ad campaigns, track live ROAS, boost organic posts, and generate AI ad copy.
          </p>
        </div>

        {/* Ad Account Selector & Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 p-2 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-bold shadow-2xs">
            <Building2 className="w-4 h-4 text-purple-600 ml-1 shrink-0" />
            <select
              value={selectedAccount}
              onChange={(e) => {
                if (checkPlanActive("Switch Meta Ad Account")) {
                  setSelectedAccount(e.target.value);
                }
              }}
              className="bg-transparent text-slate-900 font-extrabold text-xs focus:outline-none cursor-pointer pr-2"
            >
              <option value="act_982402198">Main E-Commerce Ads (act_982402198)</option>
              <option value="act_40912830">Brand Retargeting Account (act_40912830)</option>
              <option value="act_77123901">Agency Client #1 (act_77123901)</option>
            </select>
          </div>

          <button
            onClick={() => {
              if (checkPlanActive("Open 1-Click Post Booster")) {
                setActiveTab("booster");
              }
            }}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-current" />
            <span>1-Click Boost Post</span>
          </button>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Ad Spend */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2 hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Total Ad Spend</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-950">₹48,250</div>
          <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs last 30 days
          </div>
        </div>

        {/* Card 2: Total Impressions */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2 hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Total Impressions</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-950">245,800</div>
          <div className="text-[11px] font-semibold text-slate-500">
            CPM (Cost per 1k): <span className="font-bold text-slate-900">₹196.20</span>
          </div>
        </div>

        {/* Card 3: Link Clicks & CTR */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2 hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Link Clicks & CTR</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-950">12,400 <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">5.04% CTR</span></div>
          <div className="text-[11px] font-semibold text-slate-500">
            CPC (Cost per Click): <span className="font-bold text-slate-900">₹3.89</span>
          </div>
        </div>

        {/* Card 4: Conversions & ROAS */}
        <div className="p-5 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50/60 to-white shadow-2xs space-y-2 hover:border-purple-400 transition-all">
          <div className="flex items-center justify-between text-purple-950 text-xs font-extrabold uppercase tracking-wide">
            <span>Conversions & ROAS</span>
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-950">480 Sales <span className="text-xs font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">4.2x ROAS</span></div>
          <div className="text-[11px] font-bold text-purple-900">
            Generated Revenue: <span className="font-black text-emerald-700">₹2,02,650</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "campaigns"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Active Ad Campaigns ({campaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("booster")}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "booster"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400 fill-current" />
          <span>1-Click Post Booster</span>
        </button>

        <button
          onClick={() => setActiveTab("ai-studio")}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "ai-studio"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Ad Copy Studio</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "settings"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Ad Account Settings</span>
        </button>
      </div>

      {/* 4. TAB 1: CAMPAIGNS MANAGER TABLE */}
      {activeTab === "campaigns" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status Filter:</span>
              {["all", "active", "paused"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="text-xs font-bold text-slate-500">
              Showing <span className="text-slate-950 font-black">{filteredCampaigns.length}</span> campaigns
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Campaign Name</th>
                    <th className="p-4">Platform</th>
                    <th className="p-4">Objective</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Daily Budget</th>
                    <th className="p-4">Spend</th>
                    <th className="p-4">Clicks (CTR)</th>
                    <th className="p-4">ROAS</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
                  {filteredCampaigns.map((cam) => (
                    <tr key={cam.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-950">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0"></span>
                          <span className="truncate max-w-[260px]">{cam.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 capitalize font-bold text-slate-700">
                          <PlatformIcon platform={cam.platform} className="w-4 h-4" />
                          <span>{cam.platform}</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-indigo-700">{cam.objective}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                            cam.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              cam.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                            }`}
                          ></span>
                          {cam.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">₹{cam.dailyBudget.toLocaleString("en-IN")}/day</td>
                      <td className="p-4 font-bold text-slate-900">₹{cam.spent.toLocaleString("en-IN")}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{cam.clicks.toLocaleString("en-IN")}</div>
                        <div className="text-[10px] font-extrabold text-emerald-600">{cam.ctr}</div>
                      </td>
                      <td className="p-4 font-black text-purple-700 text-sm">{cam.roas}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleCampaignStatus(cam.id)}
                          className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 ml-auto cursor-pointer ${
                            cam.status === "ACTIVE"
                              ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {cam.status === "ACTIVE" ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current" /> Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" /> Resume
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 2: 1-CLICK POST BOOSTER */}
      {activeTab === "booster" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-3xl space-y-2 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                INSTANT META BOOST
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              Boost Organic Instagram & Facebook Posts in 1-Click
            </h2>
            <p className="text-purple-200 text-xs md:text-sm max-w-2xl font-medium">
              Select your top-performing organic posts below, set your target audience and budget, and launch a sponsored Meta campaign directly from Postfly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockOrganicPosts.map((post) => (
              <div key={post.id} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 p-4">
                <div className="space-y-3">
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100">
                    <img src={post.image} alt="Post preview" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
                      <PlatformIcon platform={post.platform} className="w-3.5 h-3.5" />
                      <span className="capitalize">{post.platform} Post</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-slate-500">Published {post.publishedAt}</div>
                    <p className="text-xs font-extrabold text-slate-950 line-clamp-2 leading-snug">
                      {post.title}
                    </p>
                  </div>

                  {/* Organic Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center text-[11px]">
                    <div>
                      <div className="text-slate-400 text-[10px] font-semibold">Reach</div>
                      <div className="font-extrabold text-slate-900">{post.organicReach}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] font-semibold">Likes</div>
                      <div className="font-extrabold text-emerald-600">❤️ {post.organicLikes}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] font-semibold">Comments</div>
                      <div className="font-extrabold text-indigo-600">💬 {post.organicComments}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBoostModal(post)}
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-current" />
                  <span>Boost Post Now</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 3: AI AD COPY STUDIO */}
      {activeTab === "ai-studio" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prompt Form */}
          <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-2xs space-y-5">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" /> Gemini AI Ad Copy Generator
              </h2>
              <p className="text-slate-600 text-xs font-semibold">
                Generate high-converting Facebook & Instagram Ad headlines, primary copy, and call-to-actions.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                Product or Offer Description
              </label>
              <textarea
                rows={4}
                value={productPrompt}
                onChange={(e) => setProductPrompt(e.target.value)}
                placeholder="e.g. Organic Herbal Hair Oil with 50% discount on first purchase. Free shipping across India."
                className="w-full p-3.5 rounded-2xl border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-xs text-slate-900 font-medium placeholder-slate-400 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                Select Ad Copy Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "high-converting", label: "🔥 High Conversion & Urgency" },
                  { id: "storytelling", label: "✨ Storytelling & Brand Hook" },
                  { id: "social-proof", label: "⭐ Customer Reviews & Social Proof" },
                  { id: "professional", label: "💼 Professional & Direct B2B" }
                ].map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setAdTone(tone.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      adTone === tone.id
                        ? "border-purple-600 bg-purple-50 text-purple-900"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateAICopy}
              disabled={generatingCopy || !productPrompt.trim()}
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {generatingCopy ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating AI Ad Copies...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Meta Ad Copy Variations</span>
                </>
              )}
            </button>
          </div>

          {/* AI Outputs */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Generated Meta Ad Copies
            </h3>

            {!generatedCopies ? (
              <div className="p-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-500">
                  Enter your product details on the left and click Generate to view high-converting ad headlines and body text!
                </p>
              </div>
            ) : (
              generatedCopies.map((copy, idx) => (
                <div key={idx} className="p-5 rounded-3xl border border-purple-200 bg-white shadow-2xs space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-black text-purple-700 uppercase tracking-wider">Variation #{idx + 1}</span>
                    <button
                      onClick={() => alert("Copied to clipboard!")}
                      className="text-[11px] font-extrabold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Copy All Text
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Headline</span>
                    <div className="text-sm font-extrabold text-slate-950">{copy.headline}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Text</span>
                    <p className="text-xs font-medium text-slate-700 leading-relaxed">{copy.primaryText}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Description</span>
                      <div className="font-semibold text-slate-900 truncate">{copy.description}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">CTA Button</span>
                      <div className="font-extrabold text-purple-700">{copy.cta}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 7. TAB 4: AD ACCOUNTS & SETTINGS */}
      {activeTab === "settings" && (
        <div className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-2xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-slate-950 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-600" /> Meta Business & Ad Accounts Settings
            </h2>
            <p className="text-slate-600 text-xs font-semibold">
              Manage your connected Facebook Business Manager, Meta Ad Accounts, and API token permissions.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  f
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-950">Meta Main Business Manager</div>
                  <div className="text-[11px] font-medium text-slate-500">Connected via Meta Graph OAuth v20.0 (Token Valid)</div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                Active & Authorized
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-purple-600 shrink-0" />
                <div>
                  <div className="text-xs font-extrabold text-slate-950">Default Ad Account ID</div>
                  <div className="font-mono text-xs font-bold text-slate-700">act_982402198 (Currency: INR ₹)</div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (checkPlanActive("Re-sync Meta Permissions")) {
                    alert("Ad Account permissions re-synced!");
                  }
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
              >
                Re-sync Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOST POST MODAL */}
      {boostModalOpen && selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-current" /> Boost Post on Meta Ads
              </h3>
              <button
                onClick={() => setBoostModalOpen(false)}
                className="text-slate-400 hover:text-slate-950 font-extrabold text-sm"
              >
                ✕
              </button>
            </div>

            {boostSuccess ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-lg font-black text-slate-950">Sponsored Ad Campaign Launched!</h4>
                <p className="text-xs font-semibold text-slate-600">
                  Your post has been successfully dispatched to Meta Ads Manager. It will begin delivering impressions shorty.
                </p>
              </div>
            ) : (
              <>
                {/* Post Preview Strip */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <img src={selectedPost.image} alt="Preview" className="w-14 h-14 rounded-xl object-cover" />
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Selected Post</div>
                    <div className="text-xs font-extrabold text-slate-950 truncate">{selectedPost.title}</div>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-extrabold uppercase tracking-wider block">Target Audience</label>
                    <input
                      type="text"
                      value={boostAudience}
                      onChange={(e) => setBoostAudience(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-extrabold uppercase tracking-wider block">Daily Budget (₹)</label>
                      <input
                        type="number"
                        value={boostBudget}
                        onChange={(e) => setBoostBudget(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-extrabold uppercase tracking-wider block">Duration (Days)</label>
                      <input
                        type="number"
                        value={boostDuration}
                        onChange={(e) => setBoostDuration(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1">
                    <div className="font-extrabold text-xs">Estimated Campaign Reach</div>
                    <div className="text-xs font-medium">
                      Est. <span className="font-black text-purple-950">{(boostBudget * 35).toLocaleString("en-IN")} - {(boostBudget * 90).toLocaleString("en-IN")}</span> Impressions | Total Cost: <span className="font-black text-purple-950">₹{(boostBudget * boostDuration).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLaunchBoost}
                  disabled={boostLaunching}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {boostLaunching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Campaign to Meta API...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300 fill-current" />
                      <span>Confirm & Launch Sponsored Ad (₹{(boostBudget * boostDuration).toLocaleString("en-IN")})</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 🔒 PLAN UPGRADE REQUIRED INTERACTIVE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative border-2 border-purple-200">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 font-bold p-1 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 pt-2">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-purple-600/30">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider border border-purple-200 inline-block">
                  PRO UNLIMITED EXCLUSIVE
                </span>
                <h3 className="text-xl font-black text-slate-950 tracking-tight">
                  Upgrade Plan to Activate Meta Ads
                </h3>
                <p className="text-xs text-slate-600 font-semibold px-2">
                  Aapka current plan (<span className="text-purple-700 font-bold">{limits?.planTitle || "Starter / Growth / Trial"}</span>) Meta Ads Management include nahi karta.
                  {attemptedAction && <span className="block mt-1 text-slate-800 font-extrabold">"{attemptedAction}" ke liye Pro Unlimited plan active hona zaroori hai.</span>}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2 text-xs font-bold text-slate-800">
              <div className="text-[11px] font-black uppercase text-purple-900 tracking-wider">
                What you get with Pro Unlimited (₹4,999/mo):
              </div>
              <ul className="space-y-2 text-[11.5px] text-slate-700 font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Meta Ads Manager (FB & Instagram Ads)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1-Click Post Booster & Reach Calculator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time ROAS, CPC, CTR Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Social Channels & AI Copywriting</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <Link
                href="/billing"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 no-underline cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-current" />
                <span>Upgrade to Pro Unlimited Now (₹4,999)</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Continue Browsing in Preview Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
