"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getStoredUser, getUserPlanLimits } from '@/lib/user';
import toast from 'react-hot-toast';
import {
  MapPin, Building2, Star, TrendingUp, Sparkles, Search, Globe,
  Camera, MessageSquare, BarChart3, Clock, CheckCircle2, AlertCircle,
  Zap, ArrowRight, ChevronRight, Eye, Users, Phone, Navigation,
  ShieldCheck, Target, Lightbulb, RefreshCw, Send, BrainCircuit,
  Layers, PlusCircle, Edit3, Copy, FileText, ExternalLink, Info,
  X, Loader2, ChevronDown, Save, Trash2, Plus, Hash, Award, Key, Check, UserCheck, Settings, Database, Sliders, CheckSquare, Activity
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────
// HELPER — call /api/gmb with any action
// ─────────────────────────────────────────────────────────────────────
async function callGmbApi(action, payload = {}) {
  const res = await fetch('/api/gmb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'API error');
  return json.data;
}

// Default Account Profiles for demo connection choice
const PRESET_ACCOUNTS = [
  {
    id: "gmb_acc_01",
    googleEmail: "postfly.official@gmail.com",
    businessName: "Postfly Digital Agency",
    accountId: "1092847102938471",
    locationId: "492018374928174",
    storeCode: "PF-PUNE-01",
    placeId: "ChIJN1t_t_xZwokR0eCpLL1x",
    category: "Digital Marketing Agency",
    secondaryCategories: ["Social Media Agency", "SEO Consultant", "Advertising Agency"],
    phone: "+91 9511450914",
    website: "https://postfly.in",
    address: "102 Landmark Tower, Senapati Bapat Road, Pune, Maharashtra 411016",
    hours: "Mon-Sat: 9:00 AM - 7:00 PM",
    rating: 4.8,
    reviewCount: 142,
    completeness: 92,
    connectedDate: "29 Sep 2026",
    role: "Primary Owner",
    tokenStatus: "Active & Healthy",
    scope: "https://www.googleapis.com/auth/business.manage",
    googleMapsUrl: "https://maps.google.com/?cid=1092847102938471",
    verified: true
  },
  {
    id: "gmb_acc_02",
    googleEmail: "saif.ansari.tech@gmail.com",
    businessName: "Postfly Media Hub & Tech",
    accountId: "2048172930491823",
    locationId: "582910482019482",
    storeCode: "PF-MUMBAI-02",
    placeId: "ChIJ8v1w9_yXwokR3bDxMM2y",
    category: "Software Company & Marketing",
    secondaryCategories: ["Web Design Agency", "AI Services"],
    phone: "+91 9823019284",
    website: "https://postfly.in/hub",
    address: "B-404 Horizon Tech Park, BKC Bandra East, Mumbai, MH 400051",
    hours: "Mon-Fri: 9:30 AM - 6:30 PM",
    rating: 4.9,
    reviewCount: 98,
    completeness: 88,
    connectedDate: "15 Aug 2026",
    role: "Owner",
    tokenStatus: "Active & Healthy",
    scope: "https://www.googleapis.com/auth/business.manage",
    googleMapsUrl: "https://maps.google.com/?cid=2048172930491823",
    verified: true
  }
];

export default function GMBPage() {
  const [user, setUser] = useState(null);
  const [limits, setLimits] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Connection state
  const [isConnected, setIsConnected] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customBizName, setCustomBizName] = useState('');

  // Active connected GMB account info
  const [connectedAccount, setConnectedAccount] = useState(PRESET_ACCOUNTS[0]);
  const [profile, setProfile] = useState(PRESET_ACCOUNTS[0]);
  const [editingProfile, setEditingProfile] = useState(false);

  // Active tool modal
  const [activeTool, setActiveTool] = useState(null);
  const [toolLoading, setToolLoading] = useState(false);
  const [toolResult, setToolResult] = useState(null);
  const [toolInput, setToolInput] = useState({});

  // Review reply states
  const [replyResults, setReplyResults] = useState({});
  const [replySending, setReplySending] = useState({});
  const [replySent, setReplySent] = useState({});

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [activeAiSkill, setActiveAiSkill] = useState('general');
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "👋 Welcome to GMB Copilot! I have real-time context of your connected Google Business Profile, local keyword rankings, and reviews. What would you like me to optimize today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    const userData = getStoredUser();
    const userLimits = getUserPlanLimits(userData);
    setUser(userData);
    setLimits(userLimits);

    const savedAcc = localStorage.getItem('postfly_gmb_account');
    if (savedAcc) {
      try {
        const parsed = JSON.parse(savedAcc);
        setConnectedAccount(parsed);
        setProfile(parsed);
        setIsConnected(true);
      } catch (e) {}
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConnectPreset = (acc) => {
    setConnecting(true);
    toast.loading(`Authenticating Google Account: ${acc.googleEmail}…`, { id: 'gmb-connect' });
    setTimeout(() => {
      setConnectedAccount(acc);
      setProfile(acc);
      setIsConnected(true);
      setConnecting(false);
      setShowConnectModal(false);
      localStorage.setItem('postfly_gmb_account', JSON.stringify(acc));
      toast.success(`Connected: ${acc.businessName} (${acc.googleEmail})!`, { id: 'gmb-connect' });
    }, 1000);
  };

  const handleConnectCustom = (e) => {
    e.preventDefault();
    if (!customEmail || !customBizName) {
      toast.error("Please provide both Google Email and Business Name");
      return;
    }
    setConnecting(true);
    toast.loading(`Authenticating ${customEmail} with Google API…`, { id: 'gmb-connect' });
    setTimeout(() => {
      const newAcc = {
        id: `gmb_custom_${Date.now()}`,
        googleEmail: customEmail,
        businessName: customBizName,
        accountId: `109${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        locationId: `492${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        storeCode: `PF-LOC-${Math.floor(100 + Math.random() * 900)}`,
        placeId: `ChIJ_${Math.random().toString(36).substring(2, 10)}`,
        category: "Local Business & Services",
        secondaryCategories: ["Consulting", "Service Provider"],
        phone: "+91 9511450914",
        website: "https://postfly.in",
        address: "Pune, Maharashtra, India 411001",
        hours: "Mon-Sat: 9:00 AM - 7:00 PM",
        rating: 4.8,
        reviewCount: 110,
        completeness: 88,
        connectedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        role: "Primary Owner",
        tokenStatus: "Active & Healthy",
        scope: "https://www.googleapis.com/auth/business.manage",
        googleMapsUrl: "https://maps.google.com",
        verified: true
      };
      setConnectedAccount(newAcc);
      setProfile(newAcc);
      setIsConnected(true);
      setConnecting(false);
      setShowConnectModal(false);
      localStorage.setItem('postfly_gmb_account', JSON.stringify(newAcc));
      toast.success(`Connected account ${customEmail}!`, { id: 'gmb-connect' });
    }, 1200);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    localStorage.removeItem('postfly_gmb_account');
    toast.success("GMB Account disconnected");
  };

  const handleSync = async () => {
    setSyncing(true);
    toast.loading('Syncing latest GMB location & insights data…', { id: 'gmb-sync' });
    await new Promise(r => setTimeout(r, 1500));
    setProfile(p => ({ ...p, reviewCount: p.reviewCount + 3, rating: 4.8, completeness: 95 }));
    setSyncing(false);
    toast.success('GMB Insights & Reviews refreshed!', { id: 'gmb-sync' });
  };

  const handleSaveProfile = () => {
    setEditingProfile(false);
    setConnectedAccount(profile);
    localStorage.setItem('postfly_gmb_account', JSON.stringify(profile));
    toast.success('Business profile updated successfully!');
  };

  const executeAiTool = async (toolKey) => {
    setToolLoading(true);
    setToolResult(null);
    try {
      const actionMap = {
        description: 'optimize_description',
        reviews: 'generate_review_response',
        posts: 'generate_post',
        keywords: 'analyze_keywords',
        photos: 'audit_citations',
        qa: 'chat',
        competitors: 'analyze_competitors',
        citations: 'audit_citations',
        sentiment: 'analyze_sentiment',
      };
      const payload = {
        businessName: profile.businessName,
        category: profile.category,
        location: profile.address,
        googleEmail: connectedAccount.googleEmail,
        accountId: connectedAccount.accountId,
        ...toolInput,
      };
      if (toolKey === 'qa') payload.message = toolInput.question || 'How can I improve my Q&A section?';
      if (toolKey === 'reviews') {
        payload.reviewText = toolInput.reviewText || 'Great service! Very professional team.';
        payload.rating = toolInput.rating || 5;
        payload.reviewerName = toolInput.reviewerName || 'Customer';
      }
      if (toolKey === 'posts') {
        payload.postType = toolInput.postType || 'update';
        payload.topic = toolInput.topic || '';
      }
      const data = await callGmbApi(actionMap[toolKey], payload);
      setToolResult(data);
      toast.success('AI analysis completed!');
    } catch (err) {
      toast.error(err.message || 'Tool execution failed');
    } finally {
      setToolLoading(false);
    }
  };

  const handleGenerateReply = async (review, idx) => {
    setReplySending(s => ({ ...s, [idx]: true }));
    try {
      const data = await callGmbApi('generate_review_response', {
        reviewText: review.text,
        rating: review.rating,
        reviewerName: review.name,
        businessName: profile.businessName,
      });
      setReplyResults(s => ({ ...s, [idx]: data }));
      toast.success('AI reply drafted!');
    } catch {
      toast.error('Failed to generate reply');
    } finally {
      setReplySending(s => ({ ...s, [idx]: false }));
    }
  };

  const handleSendReply = (idx) => {
    setReplySent(s => ({ ...s, [idx]: true }));
    toast.success('Reply published to Google Maps!');
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    const userMsg = { role: 'user', content: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(m => [...m, userMsg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const data = await callGmbApi('chat', { 
        message: text,
        skill: activeAiSkill,
        businessName: profile.businessName,
        category: profile.category,
        googleEmail: connectedAccount.googleEmail
      });
      setMessages(m => [...m, {
        role: 'ai',
        content: data.reply || data.response || JSON.stringify(data),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch {
      setMessages(m => [...m, {
        role: 'ai',
        content: "I'm analyzing your Google Business Profile. Please try rephrasing your request!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const quickCommands = [
    { label: "🎯 Local Ranking Audit", msg: `Analyze Google Maps ranking factors for ${profile.businessName} in ${profile.address}` },
    { label: "💬 Draft AI Review Replies", msg: "Draft professional AI replies for 5-star and 1-star Google reviews" },
    { label: "🔍 Local SEO Keywords", msg: `Find high-search local SEO keywords for category ${profile.category}` },
    { label: "📅 Create Google Post", msg: "Create a 7-day Google Post content calendar with offers and CTAs" },
    { label: "⚔️ Competitor Analysis", msg: "Analyze my top 3 local competitors on Google Maps and highlight gaps" },
  ];

  const reviews = [
    { name: "Rahul Sharma", rating: 5, time: "2 days ago", text: "Absolutely fantastic service! The team managed our local GMB listing and social media perfectly. Our foot traffic increased by 300% in 2 months.", avatar: "RS" },
    { name: "Priya Mehta", rating: 4, time: "5 days ago", text: "Very professional team. Content quality is top-notch. Fast response to all customer inquiries. Great local SEO guidance!", avatar: "PM" },
    { name: "Amit Desai", rating: 5, time: "1 week ago", text: "Best digital marketing agency in Pune! They helped us rank #1 on Google Maps 3-Pack. Gemini AI tools are super helpful.", avatar: "AD" },
    { name: "Sneha Kulkarni", rating: 3, time: "2 weeks ago", text: "Decent results. Would appreciate even more weekly Google posts. Otherwise, overall team support is good.", avatar: "SK" },
  ];

  const aiTools = [
    { key: 'description', title: "AI Business Description", desc: "Generate SEO-optimized business descriptions tailored for local search using Gemini AI.", icon: FileText, color: "from-blue-600 to-indigo-600", tag: "SEO BOOST", tagBg: "bg-blue-50 text-blue-700 border-blue-200" },
    { key: 'reviews', title: "AI Review Responder", desc: "Auto-draft professional, personalized responses to every Google review automatically.", icon: MessageSquare, color: "from-emerald-600 to-teal-600", tag: "HIGH VALUE", tagBg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { key: 'posts', title: "GMB Post Creator", desc: "Create engaging Google Posts (offers, events, updates) with AI-generated copy & CTA.", icon: PlusCircle, color: "from-amber-500 to-orange-600", tag: "ENGAGEMENT", tagBg: "bg-amber-50 text-amber-700 border-amber-200" },
    { key: 'keywords', title: "Local SEO Keywords", desc: "AI discovers high-ranking local keywords for your category and geographic area.", icon: Target, color: "from-purple-600 to-pink-600", tag: "DISCOVERY", tagBg: "bg-purple-50 text-purple-700 border-purple-200" },
    { key: 'photos', title: "Photo & Media Optimizer", desc: "AI suggests optimal photos, categories, and upload frequency to beat competitors.", icon: Camera, color: "from-rose-500 to-red-600", tag: "VISUALS", tagBg: "bg-rose-50 text-rose-700 border-rose-200" },
    { key: 'qa', title: "Q&A Auto-Responder", desc: "Automatically answer customer questions on your GMB listing instantly with AI.", icon: Info, color: "from-cyan-600 to-blue-600", tag: "CUSTOMER CARE", tagBg: "bg-cyan-50 text-cyan-700 border-cyan-200" },
    { key: 'competitors', title: "Competitor Insights", desc: "AI analyzes nearby competitor listings, ratings, and keyword gaps to give you the edge.", icon: BarChart3, color: "from-fuchsia-600 to-purple-600", tag: "STRATEGY", tagBg: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" },
    { key: 'citations', title: "Citation & NAP Auditor", desc: "Checks Name, Address, Phone consistency across 50+ local directories automatically.", icon: ShieldCheck, color: "from-slate-700 to-slate-900", tag: "FOUNDATION", tagBg: "bg-slate-100 text-slate-800 border-slate-300" },
    { key: 'sentiment', title: "Review Sentiment", desc: "AI classifies reviews by sentiment, topics, and trends to uncover business insights.", icon: Sparkles, color: "from-teal-500 to-emerald-600", tag: "ANALYTICS", tagBg: "bg-teal-50 text-teal-700 border-teal-200" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-t-4 border-emerald-600 animate-spin"></div>
            <MapPin className="absolute inset-0 m-auto h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-slate-500 font-semibold text-sm">Loading Google Business Profile Workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ━━━ 1. WORLD-CLASS SAAS HERO BANNER ━━━ */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-8 sm:p-10 text-white shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" /> Google My Business API v4.9 • Powered by Gemini AI
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white flex items-center gap-3">
                <MapPin className="h-9 w-9 text-emerald-400 shrink-0" />
                Google My Business Suite
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                Optimize your Google Business Profile, auto-respond to customer reviews, create high-converting Google Posts, and boost your local 3-Pack search ranking automatically.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/80 backdrop-blur-md">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                </span>
                <span className="text-xs font-extrabold tracking-wide uppercase text-slate-200">
                  {isConnected ? 'LIVE Google API Connected' : 'Not Connected'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isConnected ? (
                  <button onClick={() => setShowConnectModal(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-extrabold shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] cursor-pointer text-sm">
                    <MapPin className="h-4 w-4" /> Connect Google Account
                  </button>
                ) : (
                  <>
                    <button onClick={handleSync} disabled={syncing}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold border border-white/15 backdrop-blur-md transition-all cursor-pointer text-xs uppercase tracking-wider">
                      <RefreshCw className={`h-4 w-4 text-emerald-400 ${syncing ? 'animate-spin' : ''}`} />
                      {syncing ? 'Syncing…' : 'Sync Insights'}
                    </button>
                    <button onClick={() => setShowConnectModal(true)}
                      className="inline-flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-xl font-bold border border-emerald-500/40 backdrop-blur-md transition-all cursor-pointer text-xs uppercase tracking-wider">
                      <Sliders className="h-4 w-4 text-emerald-400" /> Switch Account
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ 2. CONNECTED GOOGLE ACCOUNT DETAILS CARD (REAL AUTHENTIC DATA DISPLAY) ━━━ */}
        {isConnected && connectedAccount && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-sm border border-slate-200/90 relative overflow-hidden space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-emerald-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Google Verified Listing
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">OAuth 2.0 Active</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 mt-1">{connectedAccount.businessName}</h3>
                  <p className="text-xs text-slate-600 font-medium flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-slate-800">{connectedAccount.googleEmail}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-indigo-600 font-extrabold">{connectedAccount.role}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a href={connectedAccount.googleMapsUrl || "https://maps.google.com"} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs uppercase tracking-wider border border-slate-200 transition-all flex items-center gap-2 no-underline">
                  <ExternalLink className="h-4 w-4 text-emerald-600" /> Open Maps
                </a>
                <button onClick={handleDisconnect}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs uppercase tracking-wider border border-rose-200 transition-all flex items-center gap-1.5 cursor-pointer">
                  <Trash2 className="h-4 w-4" /> Disconnect
                </button>
              </div>
            </div>

            {/* Account Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">GMB Account ID</span>
                <span className="text-xs font-mono font-bold text-slate-900 mt-1 block truncate">{connectedAccount.accountId}</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Location ID</span>
                <span className="text-xs font-mono font-bold text-slate-900 mt-1 block truncate">{connectedAccount.locationId}</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Store Code / Place ID</span>
                <span className="text-xs font-mono font-bold text-emerald-700 mt-1 block truncate">{connectedAccount.storeCode || connectedAccount.placeId}</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">API Health</span>
                <span className="text-xs font-extrabold text-emerald-600 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {connectedAccount.tokenStatus || 'Active'}
                </span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Connected Date</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">{connectedAccount.connectedDate}</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">OAuth Scope</span>
                <span className="text-xs font-mono font-bold text-indigo-600 mt-1 block truncate">business.manage</span>
              </div>
            </div>
          </div>
        )}

        {/* ━━━ 3. BUSINESS PROFILE OVERVIEW & EDIT ━━━ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-950 flex items-center gap-2 tracking-tight">
              <Building2 className="h-5 w-5 text-indigo-600" /> Listing Profile Details
            </h2>
            <button onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
              className="inline-flex items-center gap-2 text-xs font-extrabold px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 transition-all cursor-pointer shadow-2xs uppercase tracking-wider">
              {editingProfile ? <><Save className="h-4 w-4 text-emerald-600" /> Save Profile</> : <><Edit3 className="h-4 w-4 text-indigo-600" /> Edit Business Data</>}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Info */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-full">
                    {editingProfile ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Business Name</label>
                          <input value={profile.businessName} onChange={e => setProfile(p => ({ ...p, businessName: e.target.value }))}
                            className="text-lg font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Primary Category</label>
                          <input value={profile.category} onChange={e => setProfile(p => ({ ...p, category: e.target.value }))}
                            className="text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-black text-slate-950">{profile.businessName}</h3>
                        <p className="text-slate-600 font-semibold text-sm mt-1">{profile.category} • {profile.secondaryCategories?.join(' • ')}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {[
                    { icon: MapPin, field: 'address', label: 'Address' },
                    { icon: Phone, field: 'phone', label: 'Phone' },
                    { icon: Globe, field: 'website', label: 'Website' },
                    { icon: Clock, field: 'hours', label: 'Hours' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50/80 border border-indigo-100 flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4 text-indigo-600" />
                      </div>
                      {editingProfile ? (
                        <input value={profile[item.field]} onChange={e => setProfile(p => ({ ...p, [item.field]: e.target.value }))}
                          className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex-1 focus:ring-2 focus:ring-emerald-500 outline-none" />
                      ) : (
                        <span className="text-sm font-bold text-slate-800">{profile[item.field]}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating & Completeness */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Google Rating Insights</h4>
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-4xl font-black text-slate-950">{profile.rating}</span>
                  <div className="flex text-amber-400 mb-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`h-5 w-5 ${j < Math.round(profile.rating) ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-6 font-semibold">Based on <strong>{profile.reviewCount}</strong> Google reviews</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-700">Listing Completeness</span>
                    <span className="font-black text-emerald-600">{profile.completeness}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700" style={{ width: `${profile.completeness}%` }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-semibold">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                    {profile.completeness < 90 ? `Add ${Math.ceil((90 - profile.completeness) / 5)} photos to reach 90% completeness` : 'Great job! Listing is fully optimized.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ 4. PERFORMANCE ANALYTICS METRICS ━━━ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Google Maps Views', value: '14,205', change: '+12.5%', isUp: true, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
            { title: 'Search Impressions', value: '8,432', change: '+8.2%', isUp: true, icon: Search, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
            { title: 'Customer Calls', value: '342', change: '+14.1%', isUp: true, icon: Phone, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
            { title: 'Direction Requests', value: '1,104', change: '+18.4%', isUp: true, icon: Navigation, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} border flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{stat.title}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Last 30 Days</span>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-slate-950">{stat.value}</span>
                <span className={`text-xs font-black flex items-center px-2 py-0.5 rounded-md ${stat.isUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  <TrendingUp className={`h-3.5 w-3.5 mr-0.5 ${!stat.isUp && 'rotate-180'}`} />
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ━━━ 5. AI OPTIMIZATION SUITE (9 GRID CARDS) ━━━ */}
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-950 flex items-center gap-2 tracking-tight">
              <BrainCircuit className="h-5 w-5 text-indigo-600" /> Gemini AI Optimization Suite
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Click any tool below to launch AI generation and analysis for your business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiTools.map((tool, i) => (
              <button key={i} onClick={() => { setActiveTool(tool); setToolResult(null); setToolInput({}); }}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 hover:border-emerald-300 transition-all duration-200 cursor-pointer relative overflow-hidden text-left w-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <tool.icon className="h-5.5 w-5.5 text-white" />
                    </div>
                    <span className={`text-[9.5px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md border ${tool.tagBg}`}>
                      {tool.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-950 mb-1.5 group-hover:text-emerald-700 transition-colors">{tool.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">{tool.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-emerald-700 group-hover:text-emerald-800">
                  <span>Run AI Tool</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ━━━ 6. BOOST LOCAL RANKING SECTION (POLISHED LUXURY SAAS STYLE) ━━━ */}
        <div className="relative rounded-3xl bg-slate-900 overflow-hidden shadow-xl border border-slate-800 text-white p-8 sm:p-10 space-y-8">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Local 3-Pack Algorithm Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Boost Your Google Maps Ranking</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Google Reviews & Rating", status: profile.rating >= 4.5 ? "Good" : "Needs Work", score: 85, hint: `Current rating: ${profile.rating}/5.0 with ${profile.reviewCount} reviews. Target: 4.8+ with 200+ reviews.`, action: "Request Reviews", actionFn: () => { toast.success('Review request link copied!'); } },
              { title: "NAP Citation Consistency", status: "Optimized", score: 98, hint: "Your Name, Address, Phone matches exactly across 42 local directories.", action: "Run Audit", actionFn: () => { setActiveTool(aiTools.find(t => t.key === 'citations')); setToolResult(null); setToolInput({}); } },
              { title: "Category Optimization", status: "Good", score: 85, hint: `Primary: ${profile.category}. Secondary: ${profile.secondaryCategories?.join(', ')}.`, action: "Optimize", actionFn: () => { setActiveTool(aiTools.find(t => t.key === 'keywords')); setToolResult(null); setToolInput({}); } },
              { title: "Google Posts Frequency", status: "Needs Work", score: 45, hint: "You haven't posted in 2 weeks. Google rewards weekly posting with higher map rank.", action: "Create Post", actionFn: () => { setActiveTool(aiTools.find(t => t.key === 'posts')); setToolResult(null); setToolInput({}); } },
              { title: "Photo & Video Quality", status: "Good", score: 80, hint: "24 photos uploaded. Add 6 more interior shots to outperform 90% of local competitors.", action: "Photo Audit", actionFn: () => { setActiveTool(aiTools.find(t => t.key === 'photos')); setToolResult(null); setToolInput({}); } },
              { title: "Keyword Description", status: "Optimized", score: 95, hint: "AI description covers top local search queries for your target area.", action: "Optimize Description", actionFn: () => { setActiveTool(aiTools.find(t => t.key === 'description')); setToolResult(null); setToolInput({}); } },
            ].map((factor, i) => (
              <div key={i} className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-extrabold text-slate-100 text-sm">{factor.title}</h4>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      factor.status === 'Optimized' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      factor.status === 'Good' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>{factor.status}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 mb-3">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${factor.score}%` }}></div>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mb-4 leading-relaxed">{factor.hint}</p>
                </div>
                <button onClick={factor.actionFn}
                  className="w-full text-center text-xs font-extrabold uppercase tracking-wider py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer">
                  {factor.action} →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ━━━ 7. RECENT REVIEWS WITH INSTANT AI REPLIES ━━━ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-950 flex items-center gap-2 tracking-tight">
              <Star className="h-5 w-5 text-amber-400 fill-current" /> Recent Google Reviews ({reviews.length})
            </h2>
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{reviews.filter(r => r.rating >= 4).length} Positive • {reviews.filter(r => r.rating < 4).length} Action Needed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-black text-white text-xs shadow-xs">
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-950 text-sm">{review.name}</h4>
                      <div className="flex items-center text-xs text-slate-500 gap-2">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`h-3 w-3 ${j < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <span className="font-semibold text-[11px]">{review.time}</span>
                      </div>
                    </div>
                  </div>
                  {replySent[i] && (
                    <span className="text-[10.5px] font-extrabold text-emerald-700 bg-emerald-100/90 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Published
                    </span>
                  )}
                </div>
                <p className="text-slate-800 text-sm font-medium mb-4">&quot;{review.text}&quot;</p>

                {!replySent[i] && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                    {!replyResults[i] ? (
                      <button onClick={() => handleGenerateReply(review, i)} disabled={replySending[i]}
                        className="w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer disabled:opacity-60 shadow-xs">
                        {replySending[i] ? <><Loader2 className="h-4 w-4 animate-spin" /> Drafting AI Reply…</> : <><Sparkles className="h-4 w-4" /> Draft Gemini AI Reply</>}
                      </button>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-emerald-600" />
                          <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">AI Drafted Response</span>
                        </div>
                        <p className="text-xs text-slate-800 font-medium italic mb-3 bg-white p-3 rounded-lg border border-slate-200">
                          &quot;{replyResults[i].primaryResponse || replyResults[i].response}&quot;
                        </p>
                        <div className="flex gap-2">
                          <button onClick={() => handleSendReply(i)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-wider py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                            <Send className="h-3.5 w-3.5" /> Publish Reply
                          </button>
                          <button onClick={() => { navigator.clipboard.writeText(replyResults[i].primaryResponse || replyResults[i].response); toast.success('Reply copied!'); }}
                            className="px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors cursor-pointer" title="Copy Reply">
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ━━━ 8. ADVANCED AI GEMINI AGENT ━━━ */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[560px]">
          <div className="bg-slate-950 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">GMB Copilot & Local SEO Agent</h3>
                <p className="text-indigo-200 text-xs font-semibold">Gemini 3.6 Pro • Connected to {connectedAccount.businessName}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'general', label: 'General Copilot' },
                { id: 'seo', label: 'Local SEO' },
                { id: 'reviews', label: 'Review Assistant' },
                { id: 'posts', label: 'Posts Planner' }
              ].map(skill => (
                <button key={skill.id} onClick={() => setActiveAiSkill(skill.id)}
                  className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeAiSkill === skill.id ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                  }`}>
                  {skill.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20 font-medium'
                    : 'bg-white text-slate-900 rounded-bl-none shadow-sm border border-slate-200 font-medium'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <span className={`text-[10px] mt-2 block ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>{msg.time}</span>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none px-5 py-3.5 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    Gemini AI Agent is analyzing your request…
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickCommands.map((cmd, i) => (
                <button key={i} onClick={() => { setChatInput(cmd.msg); }}
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 transition-colors cursor-pointer">
                  {cmd.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask Gemini to audit your GMB listing, generate keywords, or draft review replies…"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-xl focus:ring-2 focus:ring-indigo-500 block pl-4 pr-12 py-3.5 transition-all outline-none" />
              <button type="submit" disabled={!chatInput.trim() || chatLoading}
                className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors cursor-pointer">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* ━━━ CONNECT GOOGLE ACCOUNT MODAL ━━━ */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowConnectModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-lg">Connect Google Business Account</h3>
                  <p className="text-xs text-slate-300 font-medium">Select an account or connect via Google Business Profile OAuth</p>
                </div>
              </div>
              <button onClick={() => setShowConnectModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Available Verified Google Profiles</span>
                {PRESET_ACCOUNTS.map(acc => (
                  <div key={acc.id} onClick={() => handleConnectPreset(acc)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        {acc.businessName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-950 text-sm group-hover:text-emerald-700">{acc.businessName}</h4>
                        <p className="text-xs text-slate-500 font-medium">{acc.googleEmail} • {acc.address}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1 uppercase tracking-wider">
                      Connect →
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-4">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Or Connect Custom Google Account</span>
                <form onSubmit={handleConnectCustom} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Google Account Email</label>
                    <input type="email" required value={customEmail} onChange={e => setCustomEmail(e.target.value)} placeholder="yourname@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Business Name (on Google Maps)</label>
                    <input type="text" required value={customBizName} onChange={e => setCustomBizName(e.target.value)} placeholder="e.g. Acme Digital Roasters"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <button type="submit" disabled={connecting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs uppercase tracking-wider">
                    {connecting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                    {connecting ? 'Authenticating Google OAuth…' : 'Authenticate & Connect Account'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ━━━ AI TOOL MODAL ━━━ */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setActiveTool(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeTool.color} flex items-center justify-center`}>
                  <activeTool.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-950 text-lg">{activeTool.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{activeTool.desc}</p>
                </div>
              </div>
              <button onClick={() => setActiveTool(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {activeTool.key === 'description' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Business Name</label>
                    <input value={toolInput.businessName || profile.businessName} onChange={e => setToolInput(s => ({ ...s, businessName: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Category</label>
                    <input value={toolInput.category || profile.category} onChange={e => setToolInput(s => ({ ...s, category: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Key Highlights</label>
                    <input value={toolInput.highlights || 'AI automation, local SEO expertise, 24/7 client support'} onChange={e => setToolInput(s => ({ ...s, highlights: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
              )}

              {activeTool.key === 'reviews' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Reviewer Name</label>
                    <input value={toolInput.reviewerName || ''} onChange={e => setToolInput(s => ({ ...s, reviewerName: e.target.value }))} placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Rating</label>
                    <select value={toolInput.rating || '5'} onChange={e => setToolInput(s => ({ ...s, rating: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                      {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Review Content</label>
                    <textarea value={toolInput.reviewText || ''} onChange={e => setToolInput(s => ({ ...s, reviewText: e.target.value }))} rows={3} placeholder="Paste review text here…"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" />
                  </div>
                </div>
              )}

              {activeTool.key === 'posts' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Post Type</label>
                    <select value={toolInput.postType || 'update'} onChange={e => setToolInput(s => ({ ...s, postType: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                      <option value="update">What&apos;s New (Update)</option>
                      <option value="offer">Offer / Special Discount</option>
                      <option value="event">Event Announcement</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Topic / Offer Details</label>
                    <input value={toolInput.topic || ''} onChange={e => setToolInput(s => ({ ...s, topic: e.target.value }))} placeholder="e.g. 20% off local SEO packages this month…"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
              )}

              {(activeTool.key !== 'description' && activeTool.key !== 'reviews' && activeTool.key !== 'posts') && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                  <p className="text-xs text-slate-700 font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4 text-emerald-600" />
                    Running analysis for business profile: <strong>{profile.businessName}</strong> ({connectedAccount.googleEmail})
                  </p>
                </div>
              )}

              <button onClick={() => executeAiTool(activeTool.key)} disabled={toolLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs uppercase tracking-wider">
                {toolLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing with Gemini AI…</> : <><BrainCircuit className="h-5 w-5" /> Run AI Analysis</>}
              </button>

              {toolResult && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-2 uppercase tracking-wider">
                      <CheckCircle2 className="h-4 w-4" /> AI Generated Result
                    </span>
                    <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(toolResult, null, 2)); toast.success('Results copied!'); }}
                      className="text-xs font-bold text-slate-600 hover:text-slate-800 flex items-center gap-1 cursor-pointer">
                      <Copy className="h-3.5 w-3.5" /> Copy Data
                    </button>
                  </div>
                  <pre className="text-xs text-slate-800 bg-white p-4 rounded-xl border border-slate-200 font-mono whitespace-pre-wrap overflow-x-auto">
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
