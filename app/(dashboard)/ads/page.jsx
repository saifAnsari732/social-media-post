"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredUser, getUserPlanLimits } from "@/lib/user";
import {
  Megaphone,
  Lock,
  BrainCircuit,
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
  SlidersHorizontal,
  PieChart,
  Globe,
  Plus,
  X,
  FileText,
  Filter,
  Search,
  CheckSquare,
  Smartphone,
  Monitor
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/SocialIcons";

export default function MetaAdsPage() {
  const [user, setUser] = useState(null);
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data Mode: 'real' (Default live API mode) | 'demo' (Sample data mode)
  const [dataMode, setDataMode] = useState("demo");

  // Upgrade Modal state for non-Pro Unlimited users trying an action
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [attemptedAction, setAttemptedAction] = useState("");

  // Active Tab: 'campaigns' | 'booster' | 'ai-studio' | 'analytics' | 'settings'
  const [activeTab, setActiveTab] = useState("campaigns");

  // Selected Ad Account
  const [selectedAccount, setSelectedAccount] = useState("act_982402198");

  // Filter Status
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Campaign Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignObjective, setNewCampaignObjective] = useState("CONVERSIONS");
  const [newCampaignBudget, setNewCampaignBudget] = useState(1500);
  const [newCampaignPlatform, setNewCampaignPlatform] = useState("instagram");
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  // Post Booster Modal State
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [boostBudget, setBoostBudget] = useState(500);
  const [boostDuration, setBoostDuration] = useState(7);
  const [boostAudience, setBoostAudience] = useState("Engaged Shoppers in India (Ages 18-45)");
  const [boostLaunching, setBoostLaunching] = useState(false);
  const [boostSuccess, setBoostSuccess] = useState(false);

  // Smart Ad Copy Studio State
  const [productPrompt, setProductPrompt] = useState("");
  const [adTone, setAdTone] = useState("high-converting");
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const [generatedCopies, setGeneratedCopies] = useState(null);

  // Real Campaigns State (Empty by default for real mode)
  const [realCampaigns, setRealCampaigns] = useState([]);

  // Demo Campaigns Data (For sample preview)
  const [demoCampaigns, setCampaigns] = useState([
    {
      id: "cam_01",
      name: "Festive Season Retargeting Campaign",
      platform: "instagram",
      objective: "Conversions",
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
      name: "Product Launch Video Traffic Ads",
      platform: "facebook",
      objective: "Traffic",
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
      name: "Lookalike Audience Lead Generation",
      platform: "instagram",
      objective: "Lead Gen",
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
      name: "Brand Awareness & Reach Campaign",
      platform: "facebook",
      objective: "Awareness",
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

  // Organic Posts for Booster
  const mockOrganicPosts = [
    {
      id: "post_101",
      title: "Summer Collection Drop is LIVE! Grab 30% OFF using code SUMMER30.",
      platform: "instagram",
      publishedAt: "2 hours ago",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
      organicReach: "3,420 users",
      organicLikes: 248,
      organicComments: 34
    },
    {
      id: "post_102",
      title: "Customer Spotlight: How Sarah scaled her store using our strategies.",
      platform: "facebook",
      publishedAt: "Yesterday",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      organicReach: "5,190 users",
      organicLikes: 412,
      organicComments: 58
    },
    {
      id: "post_103",
      title: "Giveaway Alert! Tag 3 friends in the comments to win ₹5,000 voucher.",
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
   * Plan Access Guard:
   * Returns true if user is on Pro Unlimited or Admin.
   * Prompts Upgrade Modal if feature is locked.
   */
  const checkPlanActive = (actionName = "Access Meta Ads Feature") => {
    if (limits?.hasMetaAds) {
      return true;
    }
    setAttemptedAction(actionName);
    setShowUpgradeModal(true);
    return false;
  };

  const currentCampaignsList = dataMode === "demo" ? demoCampaigns : realCampaigns;

  const toggleCampaignStatus = (id) => {
    if (!checkPlanActive("Pause/Resume Meta Campaign")) return;
    if (dataMode === "demo") {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: c.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : c
        )
      );
    } else {
      setRealCampaigns((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: c.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : c
        )
      );
    }
  };

  const handleCreateCampaignSubmit = () => {
    if (!newCampaignName.trim()) return;
    if (!checkPlanActive("Create Meta Campaign")) return;
    setCreatingCampaign(true);
    setTimeout(() => {
      const newCamp = {
        id: `cam_${Date.now()}`,
        name: newCampaignName,
        platform: newCampaignPlatform,
        objective: newCampaignObjective,
        status: "ACTIVE",
        dailyBudget: Number(newCampaignBudget),
        spent: 0,
        impressions: 0,
        clicks: 0,
        ctr: "0.00%",
        purchases: 0,
        roas: "0.0x"
      };
      if (dataMode === "real") {
        setRealCampaigns([newCamp, ...realCampaigns]);
      } else {
        setCampaigns([newCamp, ...demoCampaigns]);
      }
      setCreatingCampaign(false);
      setCreateModalOpen(false);
      setNewCampaignName("");
    }, 1200);
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
    if (!checkPlanActive("Generate Smart Meta Ad Copy")) return;
    setGeneratingCopy(true);
    setTimeout(() => {
      setGeneratedCopies([
        {
          headline: "Exclusive Offer: Transform Your Performance Today",
          primaryText: `Discover ${productPrompt}. Built with premium standards, fast nationwide delivery, and guaranteed satisfaction. Order now for limited-time pricing.`,
          description: "Free Shipping on Orders Above ₹999 | Verified Customer Choice",
          cta: "Shop Now"
        },
        {
          headline: "High Performance Solution for Modern Brands",
          primaryText: `Looking for top-tier ${productPrompt}? Upgrade your workflow with our industry-leading collection designed for maximum efficiency.`,
          description: "Instant Access & Direct Support Included",
          cta: "Learn More"
        }
      ]);
      setGeneratingCopy(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading Meta Ads Manager...</span>
        </div>
      </div>
    );
  }

  const isMetaAdsUnlocked = Boolean(limits?.hasMetaAds);

  const filteredCampaigns = currentCampaignsList.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && c.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Calculate Metrics
  const totalSpend = currentCampaignsList.reduce((acc, curr) => acc + (curr.spent || 0), 0);
  const totalImpressions = currentCampaignsList.reduce((acc, curr) => acc + (curr.impressions || 0), 0);
  const totalClicks = currentCampaignsList.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  const totalPurchases = currentCampaignsList.reduce((acc, curr) => acc + (curr.purchases || 0), 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* 🔒 SINGLE ELEGANT TOP STATUS BAR (No Duplicate Banners) */}
      {!isMetaAdsUnlocked ? (
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase border border-blue-500/30">
                  Preview Mode
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Active Plan: {limits?.planTitle || "Starter / Growth / Trial"}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-normal">
                Meta Ads Manager is locked on your current tier. Upgrade to <span className="text-white font-bold">Pro Unlimited</span> to manage live ad campaigns.
              </p>
            </div>
          </div>

          <button
            onClick={() => checkPlanActive("Upgrade Plan")}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <span>Upgrade to Pro Unlimited (₹4,999/mo)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pro Unlimited Active: Meta Graph API v20.0 and Meta Ads Manager are connected.</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase">
            Active
          </span>
        </div>
      )}

      {/* 1. Header Section, Ad Account & Data Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Meta Graph API v20.0
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-blue-600 shrink-0" /> Meta Ads Command Hub
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-normal">
            Manage Facebook & Instagram ad campaigns, track ROAS, boost organic posts, and generate ad copy.
          </p>
        </div>

        {/* Ad Account & Data Switcher Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Demo vs Real Data Toggle */}
          <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center text-xs font-semibold">
            <button
              onClick={() => setDataMode("real")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dataMode === "real"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Real Data ({realCampaigns.length})
            </button>
            <button
              onClick={() => setDataMode("demo")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dataMode === "demo"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Demo Preview
            </button>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium shadow-2xs">
            <Building2 className="w-4 h-4 text-slate-500 ml-1 shrink-0" />
            <select
              value={selectedAccount}
              onChange={(e) => {
                if (checkPlanActive("Switch Meta Ad Account")) {
                  setSelectedAccount(e.target.value);
                }
              }}
              className="bg-transparent text-slate-900 font-semibold text-xs focus:outline-none cursor-pointer pr-2"
            >
              <option value="act_982402198">Main Ad Account (act_982402198)</option>
              <option value="act_40912830">Brand Retargeting (act_40912830)</option>
              <option value="act_77123901">Agency Client #1 (act_77123901)</option>
            </select>
          </div>

          <button
            onClick={() => {
              if (checkPlanActive("Create Meta Campaign")) {
                setCreateModalOpen(true);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI Summary Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Ad Spend */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Ad Spend</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">₹{totalSpend.toLocaleString("en-IN")}</div>
          <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% performance vs last period
          </div>
        </div>

        {/* Card 2: Total Impressions */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Impressions</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalImpressions.toLocaleString("en-IN")}</div>
          <div className="text-[11px] font-normal text-slate-500">
            Avg CPM: <span className="font-semibold text-slate-800">₹196.20</span>
          </div>
        </div>

        {/* Card 3: Link Clicks & CTR */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Link Clicks & CTR</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {totalClicks.toLocaleString("en-IN")}{" "}
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              5.04% CTR
            </span>
          </div>
          <div className="text-[11px] font-normal text-slate-500">
            Avg CPC: <span className="font-semibold text-slate-800">₹3.89</span>
          </div>
        </div>

        {/* Card 4: Conversions & ROAS */}
        <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-blue-900 text-xs font-semibold">
            <span>Conversions & ROAS</span>
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {totalPurchases} Sales{" "}
            <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
              4.2x ROAS
            </span>
          </div>
          <div className="text-[11px] font-semibold text-blue-900">
            Revenue Generated: <span className="font-extrabold text-emerald-700">₹2,02,650</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "campaigns"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Ad Campaigns ({currentCampaignsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("booster")}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "booster"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500 fill-current" />
          <span>1-Click Post Booster</span>
        </button>

        <button
          onClick={() => setActiveTab("ai-studio")}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "ai-studio"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-blue-400" />
          <span>Smart Ad Copy Studio</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "analytics"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Placement & Device Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "settings"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Ad Account Settings</span>
        </button>
      </div>

      {/* 4. TAB 1: CAMPAIGNS MANAGER TABLE */}
      {activeTab === "campaigns" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              {["all", "active", "paused"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredCampaigns.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dashed border-slate-300 bg-white text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No Meta Ad Campaigns Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {dataMode === "real"
                    ? "Is ad account (act_982402198) me abhi koi live campaigns nhi hain. Start by creating a new campaign or boosting an organic post!"
                    : "No demo campaigns match your filter."}
                </p>
              </div>
              <button
                onClick={() => {
                  if (checkPlanActive("Create Meta Campaign")) {
                    setCreateModalOpen(true);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Meta Campaign</span>
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    {filteredCampaigns.map((cam) => (
                      <tr key={cam.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cam.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                            <span className="truncate max-w-[240px]">{cam.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 capitalize font-semibold text-slate-700">
                            <PlatformIcon platform={cam.platform} className="w-4 h-4" />
                            <span>{cam.platform}</span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-blue-700">{cam.objective}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                              cam.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {cam.status}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-900">₹{cam.dailyBudget.toLocaleString("en-IN")}/day</td>
                        <td className="p-4 font-semibold text-slate-900">₹{cam.spent.toLocaleString("en-IN")}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{cam.clicks.toLocaleString("en-IN")}</div>
                          <div className="text-[10px] font-bold text-emerald-600">{cam.ctr}</div>
                        </td>
                        <td className="p-4 font-bold text-blue-700 text-sm">{cam.roas}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => toggleCampaignStatus(cam.id)}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 ml-auto cursor-pointer ${
                              cam.status === "ACTIVE"
                                ? "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200"
                                : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
                            }`}
                          >
                            {cam.status === "ACTIVE" ? (
                              <>
                                <Pause className="w-3.5 h-3.5" /> Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5" /> Resume
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
          )}
        </div>
      )}

      {/* 5. TAB 2: 1-CLICK POST BOOSTER */}
      {activeTab === "booster" && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-2 shadow-sm border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500 text-white text-[10px] font-bold uppercase">
                Instant Meta Boost
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Boost Organic Instagram & Facebook Posts in 1-Click
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl font-normal">
              Select your top-performing organic posts below, specify target audience and budget, and launch a sponsored campaign directly to Meta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockOrganicPosts.map((post) => (
              <div key={post.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 p-4">
                <div className="space-y-3">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
                    <img src={post.image} alt="Post preview" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5">
                      <PlatformIcon platform={post.platform} className="w-3.5 h-3.5" />
                      <span className="capitalize">{post.platform} Post</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-medium text-slate-400">Published {post.publishedAt}</div>
                    <p className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {post.title}
                    </p>
                  </div>

                  {/* Organic Performance Metrics */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center text-[11px]">
                    <div>
                      <div className="text-slate-400 text-[10px]">Reach</div>
                      <div className="font-bold text-slate-900">{post.organicReach}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Likes</div>
                      <div className="font-bold text-emerald-600">❤️ {post.organicLikes}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Comments</div>
                      <div className="font-bold text-blue-600">💬 {post.organicComments}</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBoostModal(post)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-current" />
                  <span>Boost Post Now</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 3: SMART AD COPY STUDIO (NO SPARKLES) */}
      {activeTab === "ai-studio" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prompt Form */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-5">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-blue-600" /> Smart Ad Copy Generator
              </h2>
              <p className="text-slate-500 text-xs font-normal">
                Generate high-converting Facebook & Instagram ad headlines, body copy, and call-to-action buttons.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Product or Campaign Goal
              </label>
              <textarea
                rows={4}
                value={productPrompt}
                onChange={(e) => setProductPrompt(e.target.value)}
                placeholder="e.g. Organic Herbal Hair Oil with 50% discount. Free shipping nationwide across India."
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs text-slate-900 font-medium placeholder-slate-400 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Copy Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "high-converting", label: "🎯 Direct Conversion & Urgency" },
                  { id: "storytelling", label: "📖 Brand Storytelling & Hook" },
                  { id: "social-proof", label: "⭐ Customer Reviews & Proof" },
                  { id: "professional", label: "💼 Corporate & B2B Lead Gen" }
                ].map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setAdTone(tone.id)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      adTone === tone.id
                        ? "border-blue-600 bg-blue-50 text-blue-900 font-bold"
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
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {generatingCopy ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Ad Copy...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="w-4 h-4" />
                  <span>Generate Meta Ad Copy Variations</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Outputs */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Generated Meta Ad Copies
            </h3>

            {!generatedCopies ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-200 bg-white text-center space-y-3">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-medium text-slate-500">
                  Enter your product details on the left and click generate to view structured ad copies!
                </p>
              </div>
            ) : (
              generatedCopies.map((copy, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-blue-700 uppercase">Variation #{idx + 1}</span>
                    <button
                      onClick={() => alert("Copied to clipboard!")}
                      className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Copy All
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Ad Headline</span>
                    <div className="text-sm font-bold text-slate-900">{copy.headline}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Primary Text</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">{copy.primaryText}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Description</span>
                      <div className="font-medium text-slate-800 truncate">{copy.description}</div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">CTA Button</span>
                      <div className="font-bold text-blue-700">{copy.cta}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 7. TAB 4: PLACEMENT & DEVICE ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Distribution */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" /> Device Impression Share
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Mobile Devices (iOS & Android)</span>
                  <span className="font-bold">84.5% (2,07,700)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: "84.5%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Desktop & Laptops</span>
                  <span className="font-bold">15.5% (38,100)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: "15.5%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Placement Breakdown */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" /> Meta Placement Share
            </h3>
            <div className="space-y-3">
              {[
                { name: "Instagram Reels & Video Feed", share: "45%", color: "bg-purple-600" },
                { name: "Instagram Stories", share: "32%", color: "bg-pink-500" },
                { name: "Facebook Main Feed", share: "18%", color: "bg-blue-600" },
                { name: "Audience Network & Messenger", share: "5%", color: "bg-slate-400" }
              ].map((pl, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{pl.name}</span>
                    <span className="font-bold">{pl.share}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${pl.color} rounded-full`} style={{ width: pl.share }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 5: AD ACCOUNTS & SETTINGS */}
      {activeTab === "settings" && (
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" /> Meta Ad Account & Token Settings
            </h2>
            <p className="text-slate-500 text-xs font-normal">
              Manage your connected Facebook Business Manager, Meta Ad Accounts, and API token permissions.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  f
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Meta Business Manager</div>
                  <div className="text-[11px] text-slate-500">Connected via Meta Graph OAuth v20.0 (Token Valid)</div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Authorized
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-slate-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Default Ad Account ID</div>
                  <div className="font-mono text-xs font-semibold text-slate-700">act_982402198 (Currency: INR ₹)</div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (checkPlanActive("Re-sync Meta Permissions")) {
                    alert("Ad Account permissions re-synced successfully!");
                  }
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-all cursor-pointer"
              >
                Re-sync Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN WIZARD MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Create New Meta Campaign
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase tracking-wider block">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g. Festive Retargeting Campaign 2026"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase tracking-wider block">Objective</label>
                  <select
                    value={newCampaignObjective}
                    onChange={(e) => setNewCampaignObjective(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 font-semibold text-slate-900"
                  >
                    <option value="Conversions">Conversions (Sales)</option>
                    <option value="Traffic">Traffic & Clicks</option>
                    <option value="Lead Gen">Lead Generation</option>
                    <option value="Awareness">Brand Awareness</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase tracking-wider block">Platform</label>
                  <select
                    value={newCampaignPlatform}
                    onChange={(e) => setNewCampaignPlatform(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 font-semibold text-slate-900"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold uppercase tracking-wider block">Daily Budget (₹)</label>
                <input
                  type="number"
                  value={newCampaignBudget}
                  onChange={(e) => setNewCampaignBudget(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-semibold text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={handleCreateCampaignSubmit}
              disabled={creatingCampaign || !newCampaignName.trim()}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {creatingCampaign ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching to Meta Graph API...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Confirm & Dispatch Campaign</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* BOOST POST MODAL */}
      {boostModalOpen && selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-current" /> Boost Organic Post on Meta
              </h3>
              <button
                onClick={() => setBoostModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 font-bold"
              >
                ✕
              </button>
            </div>

            {boostSuccess ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-slate-900">Sponsored Campaign Dispatched!</h4>
                <p className="text-xs text-slate-500">
                  Your post has been successfully dispatched to Meta Graph API.
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <img src={selectedPost.image} alt="Preview" className="w-14 h-14 rounded-lg object-cover" />
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Selected Organic Post</div>
                    <div className="text-xs font-bold text-slate-900 truncate">{selectedPost.title}</div>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-medium">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider block">Target Audience</label>
                    <input
                      type="text"
                      value={boostAudience}
                      onChange={(e) => setBoostAudience(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 font-semibold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold uppercase tracking-wider block">Daily Budget (₹)</label>
                      <input
                        type="number"
                        value={boostBudget}
                        onChange={(e) => setBoostBudget(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-slate-200 font-semibold text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold uppercase tracking-wider block">Duration (Days)</label>
                      <input
                        type="number"
                        value={boostDuration}
                        onChange={(e) => setBoostDuration(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-slate-200 font-semibold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLaunchBoost}
                  disabled={boostLaunching}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {boostLaunching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Campaign to Meta API...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300 fill-current" />
                      <span>Confirm & Boost Sponsored Ad (₹{(boostBudget * boostDuration).toLocaleString("en-IN")})</span>
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
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-bold p-1 rounded-full hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                  PRO UNLIMITED EXCLUSIVE
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Pro Unlimited Plan Required
                </h3>
                <p className="text-xs text-slate-600 font-medium px-2">
                  Aapka current plan (<span className="text-slate-900 font-bold">{limits?.planTitle || "Starter / Growth / Trial"}</span>) Meta Ads Management access nahi karta.
                  {attemptedAction && <span className="block mt-1 text-slate-900 font-bold">"{attemptedAction}" ke liye Pro Unlimited plan activate karna hoga.</span>}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900">Pro Unlimited Plan (₹4,999/mo) Includes:</div>
              <ul className="space-y-1.5 text-xs font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Meta Ads Manager & Campaign Dispatcher</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1-Click Organic Post Boosting Engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ROAS, CPC & CTR Performance Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Social Channels & AI Studio</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <Link
                href="/billing"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 no-underline cursor-pointer active:scale-95"
              >
                <span>Upgrade to Pro Unlimited (₹4,999)</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 font-medium text-xs transition-colors cursor-pointer"
              >
                Continue Browsing Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
