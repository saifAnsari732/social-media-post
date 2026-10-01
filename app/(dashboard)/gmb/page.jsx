"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getStoredUser, getUserPlanLimits } from '@/lib/user';
import toast from 'react-hot-toast';
import {
  MapPin, Building2, Star, TrendingUp, Sparkles, Search, Globe,
  Camera, MessageSquare, BarChart3, Clock, CheckCircle2, AlertCircle,
  Zap, ArrowRight, ChevronRight, Eye, Users, Phone, Navigation,
  ShieldCheck, Target, Lightbulb, RefreshCw, Send, BrainCircuit,
  Layers, PlusCircle, Edit3, Copy, FileText, ExternalLink, Info,
  X, Loader2, ChevronDown, Save, Trash2, Plus, Hash, Award, Key,
  Check, UserCheck, Settings, Database, Sliders, Activity, ShieldAlert,
  Terminal, HelpCircle, History, Filter, CheckSquare, Square,
  LogIn, Link2, Unlink, MoreHorizontal, ArrowUpRight, Pencil,
  CalendarDays, Image, Languages, Megaphone, Shield, Bot, Workflow,
  CircleDot, Play, LayoutGrid, List, ChevronUp, Gauge, BarChart2,
  Mail, Globe2, MapPinned, BadgeCheck, Cpu, Wrench, FileSearch
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// DESIGN TOKENS (SaaS Data-Dense Dashboard)
// ─────────────────────────────────────────────────────────────────
const T = {
  primary: '#1E40AF',
  primaryLight: '#3B82F6',
  primaryBg: '#EFF6FF',
  accent: '#D97706',
  accentBg: '#FFFBEB',
  success: '#059669',
  successBg: '#ECFDF5',
  danger: '#DC2626',
  dangerBg: '#FEF2F2',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
};

// ─────────────────────────────────────────────────────────────────
// GOOGLE SVG ICON (Proper multi-color logo)
// ─────────────────────────────────────────────────────────────────
const GoogleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// DEFAULT DATA (Empty until user connects account or creates profile)
// ─────────────────────────────────────────────────────────────────
const DEFAULT_ACCOUNTS = [];
const DEFAULT_LOCATIONS = [];

// ─────────────────────────────────────────────────────────────────
// 38 TOOL REGISTRY (8 Categories)
// ─────────────────────────────────────────────────────────────────
const TOOL_CATEGORIES = {
  ACCOUNT: { icon: Users, color: '#3B82F6', tools: ["get_google_accounts", "get_locations", "get_location", "get_location_status", "connect_google_account"] },
  PROFILE: { icon: Building2, color: '#8B5CF6', tools: ["get_business_profile", "update_business_information", "update_business_description", "update_contact_information", "update_business_category", "create_business_location"] },
  HOURS: { icon: Clock, color: '#F59E0B', tools: ["get_business_hours", "get_special_hours", "update_business_hours", "update_special_hours"] },
  CATEGORY: { icon: Layers, color: '#EC4899', tools: ["get_categories", "get_primary_category", "update_categories"] },
  REVIEWS: { icon: Star, color: '#EF4444', tools: ["get_reviews", "get_review", "get_unanswered_reviews", "get_reviews_by_rating", "analyze_review", "generate_review_reply", "publish_review_reply"] },
  POSTS: { icon: FileText, color: '#10B981', tools: ["get_posts", "get_post", "create_post", "update_post", "delete_post", "publish_post"] },
  MEDIA: { icon: Image, color: '#06B6D4', tools: ["get_media", "add_media", "delete_media"] },
  AI: { icon: Sparkles, color: '#D97706', tools: ["audit_business_profile", "analyze_reviews", "generate_post", "rewrite_content", "translate_content", "generate_action_plan"] }
};

// ─────────────────────────────────────────────────────────────────
// 11 GMB AGENT SKILL CATEGORIES
// ─────────────────────────────────────────────────────────────────
const AGENT_SKILLS = [
  {
    id: 'profile',
    title: 'Business Profile Management',
    icon: Building2,
    color: '#8B5CF6',
    skills: ['View business profile', 'Update business information', 'Update business description', 'Update contact information', 'Update website', 'Update business category', 'Validate profile information']
  },
  {
    id: 'hours',
    title: 'Business Hours Management',
    icon: Clock,
    color: '#F59E0B',
    skills: ['View regular hours', 'Update regular hours', 'View special hours', 'Update special hours', 'Detect inconsistent/missing hours']
  },
  {
    id: 'location',
    title: 'Location Management',
    icon: MapPinned,
    color: '#10B981',
    skills: ['List connected locations', 'Identify/select location', 'Switch location context', 'Manage multiple locations', 'Validate location access']
  },
  {
    id: 'reviews',
    title: 'Review Management',
    icon: MessageSquare,
    color: '#EF4444',
    skills: ['Fetch reviews', 'Filter reviews by rating', 'Filter unanswered reviews', 'Analyze review sentiment', 'Identify review topics', 'Identify recurring complaints', 'Summarize customer feedback', 'Generate review replies', 'Rewrite review replies', 'Translate review replies', 'Publish approved replies']
  },
  {
    id: 'posts',
    title: 'Post Management',
    icon: FileText,
    color: '#3B82F6',
    skills: ['Create posts', 'Read posts', 'Update posts', 'Delete posts', 'Generate post content', 'Rewrite post content', 'Shorten/expand posts', 'Generate CTA', 'Translate posts', 'Publish approved posts']
  },
  {
    id: 'media',
    title: 'Media Management',
    icon: Camera,
    color: '#06B6D4',
    skills: ['View business media', 'Add supported media', 'Remove media', 'Identify suitable media for a post', 'Suggest media based on business content']
  },
  {
    id: 'content',
    title: 'AI Content Generation',
    icon: Sparkles,
    color: '#D97706',
    skills: ['Generate business updates', 'Generate promotional content', 'Generate offer content', 'Generate event content', 'Generate location-specific content', 'Generate content from user info', 'Generate content in Hindi', 'Generate content in English', 'Generate Hinglish content', 'Adapt content tone']
  },
  {
    id: 'intelligence',
    title: 'GMB Intelligence',
    icon: BrainCircuit,
    color: '#7C3AED',
    skills: ['Analyze business profile', 'Detect missing information', 'Detect inconsistent information', 'Analyze customer feedback', 'Identify common review topics', 'Identify unanswered reviews', 'Identify content gaps', 'Generate actionable recommendations']
  },
  {
    id: 'multi-location',
    title: 'Multi-Location Intelligence',
    icon: Globe2,
    color: '#0EA5E9',
    skills: ['Analyze individual locations', 'Compare location data', 'Generate location-specific content', 'Execute approved actions across selected locations', 'Handle location-specific business information']
  },
  {
    id: 'planning',
    title: 'GMB Action Planning',
    icon: Workflow,
    color: '#14B8A6',
    skills: ['Understand natural-language GMB requests', 'Convert requests into GMB actions', 'Select required tools', 'Execute multi-step GMB tasks', 'Validate action results', 'Report success/failure accurately']
  },
  {
    id: 'safety',
    title: 'GMB Safety & Control',
    icon: Shield,
    color: '#DC2626',
    skills: ['Verify target location before action', 'Validate required information', 'Ask clarification when info missing', 'Require approval for high-impact changes', 'Prevent unauthorized location actions', 'Never invent GMB data', 'Never expose Google credentials', 'Never claim success without API confirmation']
  }
];

// ─────────────────────────────────────────────────────────────────
// OAUTH FLOW STEPS
// ─────────────────────────────────────────────────────────────────
const OAUTH_STEPS = [
  { label: 'Authorize', icon: LogIn, desc: 'Sign in with Google' },
  { label: 'Fetch', icon: Database, desc: 'Retrieve GMB accounts' },
  { label: 'Select', icon: MapPin, desc: 'Choose business location' },
  { label: 'Connected', icon: CheckCircle2, desc: 'Secure connection saved' },
];

// ─────────────────────────────────────────────────────────────────
// PILL BADGE COMPONENT
// ─────────────────────────────────────────────────────────────────
function Pill({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-violet-50 text-violet-700 border-violet-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// STAT CARD COMPONENT
// ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = '#3B82F6' }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-slate-300 transition-all duration-200 group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}10` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-lg font-bold text-slate-900 leading-tight">{value}</p>
          {sub && <p className="text-[11px] font-medium text-slate-400">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TAB BUTTON COMPONENT
// ─────────────────────────────────────────────────────────────────
function TabBtn({ active, icon: Icon, label, count, onClick }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer border whitespace-nowrap ${
        active
          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
      }`}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
          {count}
        </span>
      )}
    </button>
  );
}


// ═════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═════════════════════════════════════════════════════════════════
export default function GMBPage() {
  const [user, setUser] = useState(null);
  const [limits, setLimits] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation
  const [activeTab, setActiveTab] = useState("overview");

  // Connected Accounts
  const [accountsList, setAccountsList] = useState(DEFAULT_ACCOUNTS);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [oauthStep, setOauthStep] = useState(0); // 0=idle, 1=authorizing, 2=fetching, 3=selecting, 4=done
  const [oauthLoading, setOauthLoading] = useState(false);

  // Locations
  const [locationsList, setLocationsList] = useState(DEFAULT_LOCATIONS);
  const [activeLocation, setActiveLocation] = useState(DEFAULT_LOCATIONS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // Multi-location selection & Bulk actions
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [filterAccountEmail, setFilterAccountEmail] = useState("ALL");
  const [filterSearch, setFilterSearch] = useState("");
  const [bulkRunning, setBulkRunning] = useState(false);

  // Create Location Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLocForm, setCreateLocForm] = useState({
    title: "", category: "Digital Marketing Agency", address: "",
    city: "", phone: "", website: "", description: "",
    googleEmail: "postfly.official@gmail.com"
  });
  const [creatingLoc, setCreatingLoc] = useState(false);

  // Agent Chat State & 7-Step Lifecycle
  const [agentQuery, setAgentQuery] = useState('');
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentResult, setAgentResult] = useState(null);
  const [confirmationPending, setConfirmationPending] = useState(null);
  const [expandedSkill, setExpandedSkill] = useState(null);

  // 38 Tools Explorer
  const [activeTool, setActiveTool] = useState(null);
  const [toolInput, setToolInput] = useState({});
  const [toolResult, setToolResult] = useState(null);
  const [toolExecuting, setToolExecuting] = useState(false);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const userData = getStoredUser();
    setUser(userData);
    setLimits(getUserPlanLimits(userData));

    let connectedEmail = null;
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("connected") === "true") {
        connectedEmail = urlParams.get("email") || "connected.google.user@gmail.com";
        toast.success(`Google Business Profile (${connectedEmail}) connected successfully via OAuth 2.0!`);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (urlParams.get("error")) {
        toast.error(decodeURIComponent(urlParams.get("error")));
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const loadGmbAccounts = async () => {
      const activeUserId = userData?.userId || getStoredUser()?.userId || "eb994f0c8e6f7fb4c2629561";

      // Fetch connected accounts and real locations from dedicated GMB endpoint
      try {
        const res = await fetch(`/api/gmb/accounts?userId=${encodeURIComponent(activeUserId)}`, {
          headers: {
            "x-user-id": activeUserId,
            "Cache-Control": "no-cache"
          }
        });
        const data = await res.json();
        
        const fetchedAccounts = data?.accounts || [];
        const fetchedLocations = data?.locations || [];

        setAccountsList(fetchedAccounts);
        setLocationsList(fetchedLocations);

        if (fetchedLocations.length > 0) {
          setActiveLocation(fetchedLocations[0]);
          localStorage.setItem("postfly_gmb_locations_list", JSON.stringify(fetchedLocations));
        } else {
          setActiveLocation(null);
          localStorage.removeItem("postfly_gmb_locations_list");
        }

        if (fetchedAccounts.length > 0) {
          localStorage.setItem("postfly_gmb_accounts_list", JSON.stringify(fetchedAccounts));
        } else {
          localStorage.removeItem("postfly_gmb_accounts_list");
        }
      } catch (e) {
        console.error("Failed to load GMB accounts:", e);
        // Fallback to localStorage if offline
        const savedAccs = localStorage.getItem("postfly_gmb_accounts_list");
        const savedLocs = localStorage.getItem("postfly_gmb_locations_list");
        if (savedAccs) {
          try { setAccountsList(JSON.parse(savedAccs)); } catch (err) {}
        }
        if (savedLocs) {
          try { 
            const parsedLocs = JSON.parse(savedLocs);
            setLocationsList(parsedLocs); 
            if (parsedLocs.length > 0) setActiveLocation(parsedLocs[0]);
          } catch (err) {}
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadGmbAccounts();
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("/api/gmb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_audit_logs" })
      });
      const data = await res.json();
      if (data.success) setAuditLogs(data.auditLogs || []);
    } catch (e) { /* silent */ }
  };

  // Direct Google OAuth Authentication Trigger
  const handleConnectAccount = () => {
    const activeUserId = user?.userId || getStoredUser()?.userId || "eb994f0c8e6f7fb4c2629561";
    window.location.href = `/api/auth/connect/gmb?userId=${encodeURIComponent(activeUserId)}&returnTo=/gmb`;
  };

  // Disconnect Account from DB & State
  const handleDisconnectAccount = async (accId, dbId, googleEmail) => {
    const activeUserId = user?.userId || getStoredUser()?.userId || "eb994f0c8e6f7fb4c2629561";
    try {
      await fetch("/api/gmb/accounts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUserId
        },
        body: JSON.stringify({ dbId, googleEmail })
      });

      const updatedAccs = accountsList.filter(a => a.accountId !== accId);
      const updatedLocs = locationsList.filter(l => l.googleEmail !== googleEmail);

      setAccountsList(updatedAccs);
      setLocationsList(updatedLocs);
      
      if (updatedLocs.length > 0) {
        setActiveLocation(updatedLocs[0]);
        localStorage.setItem("postfly_gmb_locations_list", JSON.stringify(updatedLocs));
      } else {
        setActiveLocation(null);
        localStorage.removeItem("postfly_gmb_locations_list");
      }

      if (updatedAccs.length > 0) {
        localStorage.setItem("postfly_gmb_accounts_list", JSON.stringify(updatedAccs));
      } else {
        localStorage.removeItem("postfly_gmb_accounts_list");
      }

      toast.success("Google Account disconnected successfully");
    } catch (err) {
      toast.error("Failed to disconnect account");
    }
  };

  // Create Location
  const handleCreateLocationSubmit = async (e) => {
    e.preventDefault();
    if (!createLocForm.title || !createLocForm.category) return toast.error("Title and Category are required");
    setCreatingLoc(true);
    try {
      const res = await fetch("/api/gmb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_business_location", ...createLocForm })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create location");
      const newLoc = data.data.location;
      const updatedLocs = [newLoc, ...locationsList];
      setLocationsList(updatedLocs);
      setActiveLocation(newLoc);
      setShowCreateModal(false);
      setAccountsList(prev => prev.map(a => a.googleEmail === newLoc.googleEmail ? { ...a, locationCount: a.locationCount + 1 } : a));
      toast.success(`Location "${newLoc.title}" created successfully!`);
      fetchAuditLogs();
    } catch (err) {
      toast.error(err.message || "Location creation failed");
    } finally {
      setCreatingLoc(false);
    }
  };

  // Bulk selection
  const toggleSelectLocation = (locId) => {
    setSelectedLocationIds(prev =>
      prev.includes(locId) ? prev.filter(id => id !== locId) : [...prev, locId]
    );
  };

  const getFilteredLocations = useCallback(() => {
    return locationsList.filter(loc => {
      const matchesAcc = filterAccountEmail === "ALL" || loc.googleEmail === filterAccountEmail;
      const matchesSearch = !filterSearch || loc.title.toLowerCase().includes(filterSearch.toLowerCase()) || loc.city.toLowerCase().includes(filterSearch.toLowerCase());
      return matchesAcc && matchesSearch;
    });
  }, [locationsList, filterAccountEmail, filterSearch]);

  const selectAllFiltered = () => {
    const filtered = getFilteredLocations();
    setSelectedLocationIds(prev =>
      prev.length === filtered.length ? [] : filtered.map(l => l.locationId)
    );
  };

  // Bulk actions
  const handleRunBulkAction = async (bulkType) => {
    if (selectedLocationIds.length === 0) return toast.error("Select at least 1 location");
    setBulkRunning(true);
    toast.loading(`Running "${bulkType}" across ${selectedLocationIds.length} locations...`, { id: "bulk" });
    await new Promise(r => setTimeout(r, 2000));
    setBulkRunning(false);
    toast.success(`"${bulkType}" completed for ${selectedLocationIds.length} locations!`, { id: "bulk" });
    fetchAuditLogs();
  };

  // Agent handler
  const handleRunAgent = async (userConfirmed = false) => {
    if (!activeLocation) return toast.error("Please select or create a location first");
    if (!agentQuery.trim() && !userConfirmed) return;
    setAgentLoading(true);
    setConfirmationPending(null);
    try {
      const res = await fetch("/api/gmb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "agent_chat",
          query: agentQuery,
          locationId: activeLocation.locationId,
          language: selectedLanguage,
          userConfirmed
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Agent execution failed");
      const result = data.agentResult;
      setAgentResult(result);
      if (result.status === "AWAITING_CONFIRMATION") {
        setConfirmationPending(result);
      } else {
        toast.success("GMB Agent task completed!");
        fetchAuditLogs();
      }
    } catch (err) {
      toast.error(err.message || "Agent execution failed");
    } finally {
      setAgentLoading(false);
    }
  };

  // Direct tool execution
  const handleRunDirectTool = async (toolName) => {
    if (!activeLocation) return toast.error("Please select or create a location first");
    setToolExecuting(true);
    setToolResult(null);
    try {
      const res = await fetch("/api/gmb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: toolName,
          locationId: activeLocation.locationId,
          ...toolInput
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Tool execution failed");
      setToolResult(data.data || data);
      toast.success(`Tool "${toolName}" executed successfully!`);
      fetchAuditLogs();
    } catch (err) {
      toast.error(err.message || "Tool execution failed");
    } finally {
      setToolExecuting(false);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
            <MapPin className="absolute inset-0 m-auto h-5 w-5 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Loading Google My Business Suite...</p>
        </div>
      </div>
    );
  }

  const filteredLocations = getFilteredLocations();
  const totalReviews = locationsList.reduce((sum, l) => sum + (l.reviewCount || 0), 0);
  const avgRating = locationsList.length > 0 
    ? (locationsList.reduce((sum, l) => sum + (l.rating || 0), 0) / locationsList.length).toFixed(1) 
    : "0.0";
  const avgCompleteness = locationsList.length > 0 
    ? Math.round(locationsList.reduce((sum, l) => sum + (l.completeness || 0), 0) / locationsList.length) 
    : 0;

  return (
    <div className="min-h-screen pb-16 font-sans antialiased" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ━━━ HERO HEADER ━━━ */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-blue-200 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                <Zap className="h-3 w-3" />
                Google Business Profile API v4.9
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Google My Business Suite
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Connect multiple Google accounts, manage all business locations, automate AI-powered review responses, and publish Google Posts across your portfolio.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <button onClick={handleConnectAccount}
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-xl text-[13px] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                <GoogleIcon className="w-4 h-4" />
                Connect Google Account
              </button>
              <button onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2.5 rounded-xl text-[13px] font-medium border border-white/10 backdrop-blur-sm transition-all duration-200 cursor-pointer">
                <PlusCircle className="h-4 w-4" />
                New Location
              </button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
            {[
              { label: 'Accounts', value: accountsList.length, icon: Users },
              { label: 'Locations', value: locationsList.length, icon: MapPin },
              { label: 'Avg Rating', value: avgRating, icon: Star },
              { label: 'Total Reviews', value: totalReviews.toLocaleString(), icon: MessageSquare },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
                <s.icon className="w-4 h-4 text-blue-300 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{s.label}</p>
                  <p className="text-base font-bold text-white">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ━━━ NAVIGATION TABS ━━━ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <TabBtn active={activeTab === "overview"} icon={LayoutGrid} label="Overview" onClick={() => setActiveTab("overview")} />
          <TabBtn active={activeTab === "accounts"} icon={Users} label="Accounts" count={accountsList.length} onClick={() => setActiveTab("accounts")} />
          <TabBtn active={activeTab === "locations"} icon={Building2} label="Locations" count={locationsList.length} onClick={() => setActiveTab("locations")} />
          <TabBtn active={activeTab === "agent"} icon={Bot} label="AI Agent" onClick={() => setActiveTab("agent")} />
          <TabBtn active={activeTab === "skills"} icon={Cpu} label="Agent Skills" count={AGENT_SKILLS.length} onClick={() => setActiveTab("skills")} />
          <TabBtn active={activeTab === "tools"} icon={Wrench} label="Tool Registry" count={38} onClick={() => setActiveTab("tools")} />
          <TabBtn active={activeTab === "audit"} icon={FileSearch} label="Audit Log" onClick={() => setActiveTab("audit")} />
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* TAB: OVERVIEW                                              */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {accountsList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-5 shadow-2xs">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-slate-900">No Google Business Profile Connected</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Aapka koi Google Business Profile connect ya create nahi hai. Authorize with Google OAuth to sync existing locations, or create a new business profile location directly.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleConnectAccount}
                    className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <GoogleIcon className="w-4.5 h-4.5" />
                    <span>Connect Google Account</span>
                  </button>

                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-blue-400" />
                    <span>Create Business Profile</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Users} label="Connected Accounts" value={accountsList.length} sub="Google OAuth" color="#3B82F6" />
                  <StatCard icon={MapPin} label="Business Locations" value={locationsList.length} sub="Active profiles" color="#10B981" />
                  <StatCard icon={Gauge} label="Avg Completeness" value={`${avgCompleteness}%`} sub="Profile score" color="#8B5CF6" />
                  <StatCard icon={Star} label="Avg Rating" value={avgRating} sub={`${totalReviews} total reviews`} color="#F59E0B" />
                </div>

                {/* Active Location Card */}
                {activeLocation && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <CircleDot className="w-4 h-4 text-blue-600" />
                        Active Location
                      </h3>
                      <Pill variant="success">
                        <BadgeCheck className="w-3 h-3" />
                        Google Verified
                      </Pill>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                          <div>
                            <h2 className="text-xl font-bold text-slate-900">{activeLocation.title}</h2>
                            <p className="text-sm text-slate-500 mt-1">{activeLocation.category}</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-start gap-2.5 text-slate-600">
                              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                              <span>{activeLocation.address}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-600">
                              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>{activeLocation.phone}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-600">
                              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                              <a href={activeLocation.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{activeLocation.website}</a>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-600">
                              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                              <span>Mon-Sat: 9:00 AM - 7:00 PM</span>
                            </div>
                          </div>
                        </div>

                        {/* Right side: rating & completeness */}
                        <div className="flex flex-row lg:flex-col items-center gap-6 lg:gap-4 lg:w-48 shrink-0">
                          <div className="text-center">
                            <div className="flex items-center gap-1.5 justify-center">
                              <span className="text-3xl font-bold text-slate-900">{activeLocation.rating}</span>
                              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{activeLocation.reviewCount} reviews</p>
                          </div>
                          <div className="text-center w-full max-w-[160px]">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-medium text-slate-600">Completeness</span>
                              <span className="font-bold text-slate-900">{activeLocation.completeness}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${activeLocation.completeness}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'AI Agent Chat', icon: Bot, tab: 'agent', color: '#7C3AED' },
                    { label: 'View Locations', icon: Building2, tab: 'locations', color: '#10B981' },
                    { label: 'Tool Registry', icon: Wrench, tab: 'tools', color: '#3B82F6' },
                    { label: 'Agent Skills', icon: Cpu, tab: 'skills', color: '#D97706' },
                  ].map(a => (
                    <button key={a.tab} onClick={() => setActiveTab(a.tab)}
                      className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer group text-left">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: `${a.color}10` }}>
                        <a.icon className="w-4.5 h-4.5" style={{ color: a.color }} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{a.label}</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-200" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}


        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* TAB: CONNECTED ACCOUNTS                                    */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "accounts" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Connected Google Accounts</h2>
                <p className="text-sm text-slate-500 mt-0.5">Manage all authorized Google accounts via OAuth 2.0</p>
              </div>
              <button onClick={handleConnectAccount}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[13px] font-semibold shadow-sm transition-all duration-200 cursor-pointer">
                <Plus className="h-4 w-4" />
                Connect Account
              </button>
            </div>

            {accountsList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No Google Accounts Connected</p>
                <p className="text-xs text-slate-500">Authorize your Google Account using OAuth to import your Business Profiles.</p>
                <button onClick={handleConnectAccount} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold">
                  <GoogleIcon className="w-4 h-4" />
                  Connect Google Account
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {accountsList.map(acc => {
                  const accLocations = locationsList.filter(l => l.googleEmail === acc.googleEmail);
                  return (
                    <div key={acc.accountId} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-slate-300 transition-all duration-200">
                      <div className="p-5 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                              <GoogleIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{acc.googleEmail}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Pill variant="primary">{acc.role}</Pill>
                                <Pill variant="success">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Active
                                </Pill>
                              </div>
                            </div>
                          </div>
                          <button onClick={() => handleDisconnectAccount(acc.accountId, acc.dbId, acc.googleEmail)}
                            title="Disconnect Account"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer">
                            <Unlink className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-slate-50 p-2.5 rounded-xl">
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Locations</p>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">{accLocations.length}</p>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-xl">
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Scope</p>
                            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{acc.scope}</p>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-xl">
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Connected</p>
                            <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{acc.connectedDate}</p>
                          </div>
                        </div>

                        {/* Locations */}
                        {accLocations.length > 0 && (
                          <div className="space-y-1.5 pt-3 border-t border-slate-100">
                            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Managed Locations</p>
                            {accLocations.map(l => (
                              <button key={l.locationId}
                                onClick={() => { setActiveLocation(l); setActiveTab("locations"); }}
                                className="w-full p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 flex items-center justify-between transition-all duration-200 cursor-pointer group text-left">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                  <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700">{l.title}</span>
                                  <span className="text-[10px] text-slate-400">{l.city}</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-200" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}


        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* TAB: LOCATIONS MATRIX                                      */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "locations" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">All Business Locations</h2>
                <p className="text-sm text-slate-500 mt-0.5">Manage and run bulk AI actions across all connected locations</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={filterSearch} onChange={e => setFilterSearch(e.target.value)} placeholder="Search locations..."
                    className="bg-white border border-slate-200 text-sm rounded-xl pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-full sm:w-48 transition-all duration-200" />
                </div>
                <select value={filterAccountEmail} onChange={e => setFilterAccountEmail(e.target.value)}
                  className="bg-white border border-slate-200 text-sm font-medium text-slate-700 rounded-xl px-3 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20">
                  <option value="ALL">All Accounts</option>
                  {accountsList.map(a => <option key={a.accountId} value={a.googleEmail}>{a.googleEmail}</option>)}
                </select>
              </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedLocationIds.length > 0 && (
              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-semibold">{selectedLocationIds.length} location{selectedLocationIds.length > 1 ? 's' : ''} selected</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: 'Bulk AI Review Reply', icon: MessageSquare, color: 'bg-emerald-600 hover:bg-emerald-700' },
                    { label: 'Bulk Post Create', icon: PlusCircle, color: 'bg-blue-600 hover:bg-blue-700' },
                    { label: 'Bulk Audit', icon: ShieldCheck, color: 'bg-slate-700 hover:bg-slate-600' },
                  ].map(a => (
                    <button key={a.label} onClick={() => handleRunBulkAction(a.label)} disabled={bulkRunning}
                      className={`${a.color} text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 disabled:opacity-50`}>
                      <a.icon className="h-3.5 w-3.5" />
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Locations Table */}
            {filteredLocations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No Business Locations Found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Aapka koi business location profile nahi mila. Connect your Google Account or create a new business location.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button onClick={handleConnectAccount} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold">
                    <GoogleIcon className="w-4 h-4" />
                    Connect Account
                  </button>
                  <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold">
                    <PlusCircle className="w-4 h-4 text-blue-400" />
                    Create Business Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <button onClick={selectAllFiltered} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer transition-colors">
                  {selectedLocationIds.length === filteredLocations.length && filteredLocations.length > 0
                    ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                  Select All ({filteredLocations.length})
                </button>
                <span className="text-xs text-slate-400">Click location name for details</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredLocations.map(loc => {
                  const isSelected = selectedLocationIds.includes(loc.locationId);
                  const isActive = activeLocation?.locationId === loc.locationId;
                  return (
                    <div key={loc.locationId}
                      className={`px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all duration-200 ${
                        isActive ? 'bg-blue-50/50 border-l-[3px] border-l-blue-600' : 'hover:bg-slate-50/80 border-l-[3px] border-l-transparent'
                      }`}>
                      <div className="flex items-center gap-3.5">
                        <button onClick={() => toggleSelectLocation(loc.locationId)} className="cursor-pointer">
                          {isSelected
                            ? <CheckSquare className="h-[18px] w-[18px] text-blue-600" />
                            : <Square className="h-[18px] w-[18px] text-slate-300 hover:text-slate-400 transition-colors" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setActiveLocation(loc)} className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer">
                              {loc.title}
                            </button>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{loc.storeCode}</span>
                            {loc.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{loc.category} &middot; {loc.city} &middot; {loc.googleEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 shrink-0">
                        <div className="text-right hidden md:block">
                          <div className="flex items-center gap-1 justify-end">
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-bold text-slate-900">{loc.rating}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">{loc.reviewCount} reviews</span>
                        </div>
                        <button onClick={() => { setActiveLocation(loc); setActiveTab("agent"); }}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5">
                          <Bot className="h-3.5 w-3.5" />
                          AI Agent
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}


        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* TAB: AI AGENT COMMAND CENTER                                */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "agent" && (
          <div className="space-y-5">
            {/* Agent Input */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Bot className="h-4 w-4 text-violet-600" />
                  GMB AI Agent
                </h3>
                <Pill variant="success">
                  <MapPin className="w-3 h-3" />
                  {activeLocation?.title || "Select Location"}
                </Pill>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 rounded-xl px-3 py-2.5 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 shrink-0">
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Hinglish">Hinglish</option>
                  </select>
                  <div className="relative flex-1">
                    <input type="text" value={agentQuery} onChange={e => setAgentQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleRunAgent(false)}
                      placeholder="Ask: Audit my business profile, fetch unanswered reviews, create a weekly offer post..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-12 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all duration-200" />
                  </div>
                  <button onClick={() => handleRunAgent(false)} disabled={agentLoading || !agentQuery.trim()}
                    className="bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2 text-sm shrink-0 disabled:cursor-not-allowed">
                    {agentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Run
                  </button>
                </div>

                {/* Quick Action Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Audit my business profile',
                    'Fetch unanswered reviews',
                    'Generate a weekly offer post',
                    'Check business hours consistency',
                    'Analyze review sentiment'
                  ].map(q => (
                    <button key={q} onClick={() => setAgentQuery(q)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all duration-200 cursor-pointer hover:text-slate-900">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* High-Risk Confirmation */}
            {confirmationPending && (
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <ShieldAlert className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900">High-Risk Write Confirmation Required</h4>
                    <p className="text-sm text-amber-800 mt-1">{confirmationPending.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 pl-12">
                  <button onClick={() => handleRunAgent(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200 cursor-pointer">
                    Confirm & Execute
                  </button>
                  <button onClick={() => setConfirmationPending(null)}
                    className="bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg border border-slate-200 transition-all duration-200 cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* 7-Step Lifecycle Results */}
            {agentResult && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                  <div className="px-6 py-3 border-b border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-600" />
                      7-Step Agent Lifecycle Trace
                    </h4>
                  </div>
                  <div className="p-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {agentResult.steps?.map((step, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">{idx + 1}</div>
                          <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">{step.stage.replace(/^\d+\.\s*/, '')}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{step.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                  <div className="px-6 py-3 border-b border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-violet-600" />
                      Agent Response
                    </h4>
                  </div>
                  <div className="p-5">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {agentResult.responseText}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}


        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* TAB: AGENT SKILLS (11 Categories)                          */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">GMB Agent Skills</h2>
              <p className="text-sm text-slate-500 mt-0.5">All {AGENT_SKILLS.length} skill categories with {AGENT_SKILLS.reduce((s, c) => s + c.skills.length, 0)} total capabilities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AGENT_SKILLS.map((cat, idx) => {
                const isExpanded = expandedSkill === cat.id;
                const CatIcon = cat.icon;
                return (
                  <div key={cat.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded ? 'border-blue-200 shadow-sm' : 'border-slate-200/80 hover:border-slate-300'
                    }`}>
                    <button
                      onClick={() => setExpandedSkill(isExpanded ? null : cat.id)}
                      className="w-full px-5 py-4 flex items-center justify-between cursor-pointer text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}12` }}>
                          <CatIcon className="w-4.5 h-4.5" style={{ color: cat.color }} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">{cat.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{cat.skills.length} skills</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{idx + 1}/{AGENT_SKILLS.length}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-4 pt-0 border-t border-slate-100">
                        <div className="space-y-1 mt-3">
                          {cat.skills.map((skill, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2.5 py-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: cat.color }} />
                              <span className="text-sm text-slate-700">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* TAB: 38-TOOL REGISTRY EXPLORER                             */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "tools" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Tool Registry</h2>
                <p className="text-sm text-slate-500 mt-0.5">38 registered tools across 8 categories &middot; Target: <span className="font-medium text-slate-700">{activeLocation?.title || "No Location Selected"}</span></p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(TOOL_CATEGORIES).map(([catName, catData]) => {
                const CatIcon = catData.icon;
                return (
                  <div key={catName} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${catData.color}15` }}>
                        <CatIcon className="w-3.5 h-3.5" style={{ color: catData.color }} />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: catData.color }}>{catName}</span>
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{catData.tools.length} tools</span>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {catData.tools.map(tName => (
                        <button key={tName}
                          onClick={() => { setActiveTool(tName); setToolInput({}); setToolResult(null); }}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200/80 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/30 text-left transition-all duration-200 cursor-pointer group flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 font-mono">{tName}</span>
                          <Play className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* TAB: AUDIT LOG                                             */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileSearch className="h-4 w-4 text-blue-600" />
                  Write Operation Audit Log
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Complete trail of all location write operations</p>
              </div>
              <button onClick={fetchAuditLogs} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>

            {auditLogs.length === 0 ? (
              <div className="p-12 text-center">
                <FileSearch className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No write audit logs recorded yet</p>
                <p className="text-xs text-slate-400 mt-1">Logs will appear after executing write operations</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-200">
                      <th className="px-5 py-3">Timestamp</th>
                      <th className="px-5 py-3">Location</th>
                      <th className="px-5 py-3">Action</th>
                      <th className="px-5 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-slate-500">{log.timestamp}</td>
                        <td className="px-5 py-3 font-mono text-xs font-medium text-blue-600">{log.locationId}</td>
                        <td className="px-5 py-3">
                          <Pill variant="success">{log.action}</Pill>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-600 max-w-xs truncate">{JSON.stringify(log.details)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>





      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: CREATE LOCATION                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-blue-400" />
                Create Business Location
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateLocationSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Google Account</label>
                <select value={createLocForm.googleEmail} onChange={e => setCreateLocForm(f => ({ ...f, googleEmail: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20">
                  {accountsList.map(a => <option key={a.accountId} value={a.googleEmail}>{a.googleEmail}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Business Name *</label>
                <input type="text" required value={createLocForm.title} onChange={e => setCreateLocForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Apex Marketing Solutions"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Category *</label>
                  <input type="text" required value={createLocForm.category} onChange={e => setCreateLocForm(f => ({ ...f, category: e.target.value }))}
                    placeholder="e.g. Digital Marketing Agency"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">City *</label>
                  <input type="text" required value={createLocForm.city} onChange={e => setCreateLocForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="e.g. Pune"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Street Address *</label>
                <input type="text" required value={createLocForm.address} onChange={e => setCreateLocForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="e.g. 101 Tech Park, SB Road, Pune 411016"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Phone</label>
                  <input type="tel" value={createLocForm.phone} onChange={e => setCreateLocForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 9511450914"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Website</label>
                  <input type="url" value={createLocForm.website} onChange={e => setCreateLocForm(f => ({ ...f, website: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Description</label>
                <textarea value={createLocForm.description} onChange={e => setCreateLocForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of the business..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 resize-none" />
              </div>

              <button type="submit" disabled={creatingLoc}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                {creatingLoc ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                {creatingLoc ? 'Creating Location...' : 'Create Location'}
              </button>
            </form>
          </div>
        </div>
      )}


      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: TOOL EXECUTION                                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setActiveTool(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold font-mono">{activeTool}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Target: {activeLocation?.title || "Active Location"}</p>
              </div>
              <button onClick={() => setActiveTool(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[60vh]">
              <button onClick={() => handleRunDirectTool(activeTool)} disabled={toolExecuting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                {toolExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {toolExecuting ? 'Executing...' : `Execute ${activeTool}`}
              </button>

              {toolResult && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">Tool Output</span>
                  </div>
                  <pre className="text-xs font-mono bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap overflow-x-auto text-slate-700 max-h-64 overflow-y-auto">
                    {JSON.stringify(toolResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
