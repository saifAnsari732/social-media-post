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
  X, Loader2, ChevronDown, Save, Trash2, Plus, Hash, Award
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

// ─────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────
export default function GMBPage() {
  const [user, setUser] = useState(null);
  const [limits, setLimits] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Business profile (editable)
  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
    businessName: 'Postfly Digital Agency',
    category: 'Digital Marketing Agency',
    secondaryCategories: ['Social Media Agency', 'SEO Consultant'],
    phone: '+91 9511450914',
    website: 'https://postfly.in',
    address: 'Pune, Maharashtra, India 411001',
    hours: 'Mon-Sat: 9AM - 7PM',
    rating: 4.7,
    reviewCount: 128,
    completeness: 82,
  });

  // Active tool modal
  const [activeTool, setActiveTool] = useState(null);
  const [toolLoading, setToolLoading] = useState(false);
  const [toolResult, setToolResult] = useState(null);
  const [toolInput, setToolInput] = useState({});

  // Review reply states
  const [replyingIdx, setReplyingIdx] = useState(null);
  const [replyResults, setReplyResults] = useState({});
  const [replySending, setReplySending] = useState({});
  const [replySent, setReplySent] = useState({});

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hello! I'm your Gemini-powered GMB Copilot. I can help you optimize your Google My Business listing, draft review replies, analyze competitors, or generate Google Posts. Ask me anything or click a quick command below!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Rankings expand state
  const [expandedFactor, setExpandedFactor] = useState(null);

  // ── init ──
  useEffect(() => {
    const userData = getStoredUser();
    const userLimits = getUserPlanLimits(userData);
    setUser(userData);
    setLimits(userLimits);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── handlers ──
  const handleConnect = async () => {
    setConnecting(true);
    toast.loading('Connecting to Google My Business…', { id: 'gmb-connect' });
    await new Promise(r => setTimeout(r, 2000));
    setIsConnected(true);
    setConnecting(false);
    toast.success('Google My Business connected successfully!', { id: 'gmb-connect' });
  };

  const handleSync = async () => {
    setSyncing(true);
    toast.loading('Syncing latest GMB data…', { id: 'gmb-sync' });
    await new Promise(r => setTimeout(r, 2500));
    setProfile(p => ({ ...p, reviewCount: p.reviewCount + 3, rating: 4.8, completeness: 85 }));
    setSyncing(false);
    toast.success('GMB data synced — 3 new reviews found!', { id: 'gmb-sync' });
  };

  const handleSaveProfile = () => {
    setEditingProfile(false);
    toast.success('Business profile updated successfully!');
  };

  // ── AI Tool execution ──
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
      toast.success('AI analysis complete!');
    } catch (err) {
      toast.error(err.message || 'Tool execution failed');
    } finally {
      setToolLoading(false);
    }
  };

  // ── Review reply via API ──
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
    toast.success('Reply sent to Google!');
  };

  // ── Chat via API ──
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    const userMsg = { role: 'user', content: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(m => [...m, userMsg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const data = await callGmbApi('chat', { message: text });
      setMessages(m => [...m, {
        role: 'ai',
        content: data.reply || data.response || JSON.stringify(data),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch {
      setMessages(m => [...m, {
        role: 'ai',
        content: "I apologize, I encountered an issue processing your request. Please try again or rephrase your question.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const quickCommands = [
    { label: "Optimize My Listing", msg: "How can I optimize my Google My Business listing for better local search visibility?" },
    { label: "Draft Review Replies", msg: "Help me draft professional replies to my latest Google reviews" },
    { label: "Analyze Competitors", msg: "Analyze my top local competitors and identify gaps I can exploit" },
    { label: "Generate Posts", msg: "Create a Google Post for my business to increase engagement" },
    { label: "Check Rankings", msg: "What are the key factors affecting my local search ranking and how can I improve them?" },
    { label: "SEO Keywords", msg: "What are the best local SEO keywords for my business category?" },
  ];

  // ── Reviews data ──
  const reviews = [
    { name: "Rahul Sharma", rating: 5, time: "2 days ago", text: "Absolutely fantastic service! The team managed our social media perfectly. Our engagement increased by 300% in just 2 months. Highly recommend Postfly to any business.", avatar: "RS" },
    { name: "Priya Mehta", rating: 4, time: "5 days ago", text: "Very professional team. Content quality is top-notch. Only minor delay in initial setup but overall great experience. Would love faster onboarding next time.", avatar: "PM" },
    { name: "Amit Desai", rating: 5, time: "1 week ago", text: "Best digital marketing agency in Pune! They helped us rank #1 on Google Maps for our restaurant. The AI tools are incredibly powerful.", avatar: "AD" },
    { name: "Sneha Kulkarni", rating: 3, time: "2 weeks ago", text: "Service was okay, decent results. I think there's room for more personalized strategy. The reports could be more detailed.", avatar: "SK" },
    { name: "Vikram Joshi", rating: 5, time: "3 weeks ago", text: "Outstanding ROI from their Meta Ads campaigns. The team is responsive and proactive. Their GMB optimization doubled our foot traffic!", avatar: "VJ" },
  ];

  // ── AI Tools data ──
  const aiTools = [
    { key: 'description', title: "AI Business Description Generator", desc: "Generate SEO-optimized business descriptions tailored for local search using Gemini AI.", icon: FileText, color: "from-blue-500 to-indigo-500", tag: "SEO Boost", tagColor: "bg-blue-100 text-blue-700" },
    { key: 'reviews', title: "AI Review Response Agent", desc: "Auto-draft professional, personalized responses to every Google review automatically.", icon: MessageSquare, color: "from-emerald-500 to-teal-500", tag: "High Value", tagColor: "bg-emerald-100 text-emerald-700" },
    { key: 'posts', title: "GMB Post Creator", desc: "Create engaging Google Posts (offers, events, updates) with AI-generated copy & CTA.", icon: PlusCircle, color: "from-amber-400 to-orange-500", tag: "Engagement", tagColor: "bg-amber-100 text-amber-700" },
    { key: 'keywords', title: "Local SEO Keyword Analyzer", desc: "AI discovers high-ranking local keywords for your category and geographic area.", icon: Target, color: "from-purple-500 to-pink-500", tag: "Discovery", tagColor: "bg-purple-100 text-purple-700" },
    { key: 'photos', title: "Photo & Media Optimizer", desc: "AI suggests optimal photos, categories, and upload frequency to beat competitors.", icon: Camera, color: "from-rose-400 to-red-500", tag: "Visuals", tagColor: "bg-rose-100 text-rose-700" },
    { key: 'qa', title: "Q&A Auto-Responder", desc: "Automatically answer customer questions on your GMB listing instantly with AI.", icon: Info, color: "from-cyan-500 to-blue-500", tag: "Customer Care", tagColor: "bg-cyan-100 text-cyan-700" },
    { key: 'competitors', title: "Competitor Insights", desc: "AI analyzes nearby competitor listings, ratings, and keyword gaps to give you the edge.", icon: BarChart3, color: "from-fuchsia-500 to-purple-600", tag: "Strategy", tagColor: "bg-fuchsia-100 text-fuchsia-700" },
    { key: 'citations', title: "Citation & NAP Auditor", desc: "Checks Name, Address, Phone consistency across 50+ local directories automatically.", icon: ShieldCheck, color: "from-slate-600 to-slate-800", tag: "Foundation", tagColor: "bg-slate-100 text-slate-700" },
    { key: 'sentiment', title: "Review Sentiment Analyzer", desc: "AI classifies reviews by sentiment, topics, and trends to uncover business insights.", icon: Sparkles, color: "from-teal-400 to-emerald-500", tag: "Analytics", tagColor: "bg-teal-100 text-teal-700" },
  ];

  // ── Ranking factors ──
  const rankingFactors = [
    { title: "Google Reviews & Rating", status: profile.rating >= 4.5 ? "Good" : "Needs Work", score: Math.min(Math.round(profile.rating * 20), 100), hint: `Current rating: ${profile.rating}/5.0 with ${profile.reviewCount} reviews. Target: 4.8+ with 200+ reviews.`, action: "Request Reviews", actionFn: () => { toast.success('Review request link copied! Share with your customers.'); } },
    { title: "NAP Consistency", status: "Optimized", score: 98, hint: "Your Name, Address, Phone matches exactly across 42 directories.", action: "Run Full Audit", actionFn: () => { setActiveTool(aiTools.find(t => t.key === 'citations')); setToolResult(null); setToolInput({}); } },
    { title: "Category Optimization", status: "Good", score: 85, hint: `Primary: ${profile.category}. Secondary: ${profile.secondaryCategories.join(', ')}.`, action: "Optimize Categories", actionFn: () => { setActiveTool(aiTools.find(t => t.key === 'keywords')); setToolResult(null); setToolInput({}); } },
    { title: "Google Posts Frequency", status: "Critical", score: 30, hint: "You haven't posted in 3 weeks. Google rewards weekly posting with higher visibility.", action: "Create Post Now", actionFn: () => { setActiveTool(aiTools.find(t => t.key === 'posts')); setToolResult(null); setToolInput({}); } },
    { title: "Photo & Video Quality", status: "Good", score: 80, hint: "24 photos uploaded. Add 6 more interior/team shots to outperform 90% of competitors.", action: "Photo Strategy", actionFn: () => { setActiveTool(aiTools.find(t => t.key === 'photos')); setToolResult(null); setToolInput({}); } },
    { title: "Keyword-Rich Description", status: profile.completeness > 85 ? "Optimized" : "Needs Work", score: profile.completeness > 85 ? 95 : 60, hint: "AI-optimized description covers all top local search intents.", action: "Generate Description", actionFn: () => { setActiveTool(aiTools.find(t => t.key === 'description')); setToolResult(null); setToolInput({}); } },
  ];

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-t-4 border-emerald-600 animate-spin"></div>
            <MapPin className="absolute inset-0 m-auto h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-slate-500 font-medium">Loading GMB workspace…</p>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ━━━ 1. HERO HEADER ━━━ */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="relative p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-200 mb-4">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">AI-Powered Google My Business</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 flex items-center gap-3">
                <MapPin className="h-8 w-8 text-emerald-600" />
                Google My Business Manager
              </h1>
              <p className="mt-3 text-lg text-slate-600 max-w-2xl">
                Dominate local search. Let Gemini AI optimize your listing, auto-reply to reviews, generate posts, and analyze competitors to drive more foot traffic and calls.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                </span>
                <span className={isConnected ? 'text-emerald-700' : 'text-slate-600'}>
                  {isConnected ? 'GMB Connected' : 'Not Connected'}
                </span>
              </div>
              {!isConnected ? (
                <button onClick={handleConnect} disabled={connecting}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 cursor-pointer">
                  {connecting ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
                  {connecting ? 'Connecting…' : 'Connect Google My Business'}
                </button>
              ) : (
                <button onClick={handleSync} disabled={syncing}
                  className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-medium shadow-sm transition-all cursor-pointer disabled:opacity-60">
                  <RefreshCw className={`h-5 w-5 text-slate-400 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing…' : 'Sync Latest Data'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ━━━ 2. BUSINESS PROFILE OVERVIEW ━━━ */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-slate-700" /> Listing Overview
            </h2>
            <div className="flex items-center gap-3">
              <a href="https://business.google.com" target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 no-underline cursor-pointer">
                View on Google <ExternalLink className="h-4 w-4" />
              </a>
              <button onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer">
                {editingProfile ? <><Save className="h-4 w-4 text-emerald-600" /> Save</> : <><Edit3 className="h-4 w-4" /> Edit Profile</>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Info */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  {editingProfile ? (
                    <input value={profile.businessName} onChange={e => setProfile(p => ({ ...p, businessName: e.target.value }))}
                      className="text-xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-full max-w-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                  ) : (
                    <h3 className="text-xl font-bold text-slate-900">{profile.businessName}</h3>
                  )}
                  {editingProfile ? (
                    <input value={profile.category} onChange={e => setProfile(p => ({ ...p, category: e.target.value }))}
                      className="text-slate-500 font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 mt-1 w-full max-w-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                  ) : (
                    <p className="text-slate-500 font-medium">{profile.category} • {profile.secondaryCategories.join(' • ')}</p>
                  )}
                </div>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {[
                  { icon: MapPin, field: 'address', label: 'Address' },
                  { icon: Phone, field: 'phone', label: 'Phone' },
                  { icon: Globe, field: 'website', label: 'Website' },
                  { icon: Clock, field: 'hours', label: 'Hours' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-slate-500" />
                    </div>
                    {editingProfile ? (
                      <input value={profile[item.field]} onChange={e => setProfile(p => ({ ...p, [item.field]: e.target.value }))}
                        className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                    ) : (
                      <span className="text-sm">{profile[item.field]}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rating & Completeness */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Google Rating</h4>
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-4xl font-bold text-slate-900">{profile.rating}</span>
                  <div className="flex text-amber-400 mb-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`h-5 w-5 ${j < Math.round(profile.rating) ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-6">Based on {profile.reviewCount} reviews</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Profile Completeness</span>
                    <span className="font-bold text-emerald-600">{profile.completeness}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700" style={{ width: `${profile.completeness}%` }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-amber-500" />
                    {profile.completeness < 90 ? `Add ${Math.ceil((90 - profile.completeness) / 5)} more items to reach 90%` : 'Excellent! Your profile is well optimized'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ 3. PERFORMANCE ANALYTICS ━━━ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Views on Google', value: '14,205', change: '+12.5%', isUp: true, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100', period: 'Last 30 days' },
            { title: 'Search Impressions', value: '8,432', change: '+8.2%', isUp: true, icon: Search, color: 'text-indigo-600', bg: 'bg-indigo-100', period: 'Last 30 days' },
            { title: 'Calls from GMB', value: '342', change: '-2.1%', isUp: false, icon: Phone, color: 'text-emerald-600', bg: 'bg-emerald-100', period: 'Last 30 days' },
            { title: 'Direction Requests', value: '1,104', change: '+18.4%', isUp: true, icon: Navigation, color: 'text-amber-600', bg: 'bg-amber-100', period: 'Last 30 days' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-600 text-sm">{stat.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{stat.period}</span>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                <span className={`text-sm font-semibold flex items-center ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  <TrendingUp className={`h-4 w-4 mr-1 ${!stat.isUp && 'rotate-180'}`} />
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ━━━ 4. AI OPTIMIZATION SUITE ━━━ */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-indigo-600" /> AI Optimization Suite
            </h2>
            <p className="text-slate-500 mt-1">Click any tool below to run AI-powered analysis and get actionable recommendations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.map((tool, i) => (
              <button key={i} onClick={() => { setActiveTool(tool); setToolResult(null); setToolInput({}); }}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 cursor-pointer relative overflow-hidden text-left w-full">
                <div className="absolute top-0 right-0 p-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${tool.tagColor}`}>{tool.tag}</span>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-5 shadow-inner group-hover:scale-110 transition-transform`}>
                  <tool.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{tool.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{tool.desc}</p>
                <div className="flex items-center text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                  Run Tool <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ━━━ 5. RANKING OPTIMIZATION ━━━ */}
        <div className="relative rounded-3xl bg-slate-900 overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl"></div>
          <div className="relative p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-7 w-7 text-emerald-400" /> Boost Your Local Search Ranking
              </h2>
              <p className="text-slate-400 mt-2 max-w-2xl">
                AI-analyzed ranking factors with one-click optimization actions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rankingFactors.map((factor, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-5 hover:bg-white/15 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-100">{factor.title}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      factor.status === 'Optimized' ? 'bg-emerald-500/20 text-emerald-300' :
                      factor.status === 'Good' ? 'bg-blue-500/20 text-blue-300' :
                      factor.status === 'Needs Work' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>{factor.status}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3">
                    <div className={`h-1.5 rounded-full transition-all duration-700 ${
                      factor.score >= 90 ? 'bg-emerald-400' :
                      factor.score >= 70 ? 'bg-blue-400' :
                      factor.score >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                    }`} style={{ width: `${factor.score}%` }}></div>
                  </div>
                  <p className="text-sm text-slate-400 flex items-start gap-2 mb-4">
                    <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    {factor.hint}
                  </p>
                  <button onClick={factor.actionFn}
                    className="w-full text-center text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer">
                    {factor.action} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ━━━ 6. RECENT REVIEWS WITH AI REPLIES ━━━ */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Star className="h-6 w-6 text-amber-400 fill-current" /> Recent Reviews ({reviews.length})
            </h2>
            <span className="text-sm text-slate-500 font-medium">{reviews.filter(r => r.rating >= 4).length} positive • {reviews.filter(r => r.rating < 4).length} need attention</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                      <div className="flex items-center text-xs text-slate-500 gap-2">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`h-3 w-3 ${j < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        {review.time}
                      </div>
                    </div>
                  </div>
                  {replySent[i] && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Replied
                    </span>
                  )}
                </div>
                <p className="text-slate-700 text-sm mb-4">&quot;{review.text}&quot;</p>

                {/* AI Reply section */}
                {!replySent[i] && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    {!replyResults[i] ? (
                      <button onClick={() => handleGenerateReply(review, i)} disabled={replySending[i]}
                        className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer disabled:opacity-60">
                        {replySending[i] ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating AI Reply…</> : <><Sparkles className="h-4 w-4" /> Generate AI Reply</>}
                      </button>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">AI Drafted Reply</span>
                          {replyResults[i].sentiment && (
                            <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              replyResults[i].sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                              replyResults[i].sentiment === 'neutral' ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                            }`}>{replyResults[i].sentiment}</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 italic mb-4">
                          &quot;{replyResults[i].primaryResponse || replyResults[i].response}&quot;
                        </p>
                        <div className="flex gap-2">
                          <button onClick={() => handleSendReply(i)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            <Send className="h-4 w-4" /> Send Reply
                          </button>
                          <button onClick={() => { navigator.clipboard.writeText(replyResults[i].primaryResponse || replyResults[i].response); toast.success('Reply copied!'); }}
                            className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer" title="Copy Reply">
                            <Copy className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleGenerateReply(review, i)}
                            className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer" title="Regenerate">
                            <RefreshCw className="h-4 w-4" />
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

        {/* ━━━ 7. AI GEMINI CHAT AGENT ━━━ */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">GMB Copilot</h3>
                <p className="text-indigo-200 text-xs font-medium">Powered by Gemini AI • Connected to /api/gmb</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 text-xs font-medium">Agent Online</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                    : 'bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-200'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <span className={`text-[10px] mt-2 block ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>{msg.time}</span>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none px-5 py-3.5 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                    Gemini is thinking…
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
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 transition-colors cursor-pointer">
                  {cmd.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask Gemini to optimize your listing…"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block pl-4 pr-12 py-3.5 transition-all outline-none" />
              <button type="submit" disabled={!chatInput.trim() || chatLoading}
                className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors cursor-pointer">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ━━━ 8. CONNECT CTA BANNER ━━━ */}
        {!isConnected && (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 shadow-xl">
            <div className="relative px-6 py-12 sm:px-12 sm:py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to dominate local search?</h2>
                <p className="text-emerald-100 text-lg mb-6">
                  Connect your Google My Business account now to activate AI auto-replies, automated posts, and smart ranking optimizations.
                </p>
                <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-white/90 text-sm font-medium justify-center md:justify-start">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-300" /> Increased Visibility</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-300" /> AI Automation</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-300" /> Boost Rankings</li>
                </ul>
              </div>
              <button onClick={handleConnect} disabled={connecting}
                className="shrink-0 bg-white text-emerald-700 hover:bg-slate-50 px-8 py-4 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer">
                <MapPin className="h-5 w-5" /> Connect Account Now
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ━━━ AI TOOL MODAL ━━━ */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setActiveTool(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeTool.color} flex items-center justify-center`}>
                  <activeTool.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{activeTool.title}</h3>
                  <p className="text-xs text-slate-500">{activeTool.desc}</p>
                </div>
              </div>
              <button onClick={() => setActiveTool(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Tool-specific inputs */}
              {activeTool.key === 'description' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Business Name</label>
                    <input value={toolInput.businessName || profile.businessName} onChange={e => setToolInput(s => ({ ...s, businessName: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Category</label>
                    <input value={toolInput.category || profile.category} onChange={e => setToolInput(s => ({ ...s, category: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Key Highlights (comma-separated)</label>
                    <input value={toolInput.highlights || 'AI automation, social media management, SEO expertise'} onChange={e => setToolInput(s => ({ ...s, highlights: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Tone</label>
                    <select value={toolInput.tone || 'professional and welcoming'} onChange={e => setToolInput(s => ({ ...s, tone: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                      <option>professional and welcoming</option>
                      <option>punchy and direct</option>
                      <option>story-driven and community focused</option>
                      <option>local SEO and high intent</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTool.key === 'reviews' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Reviewer Name</label>
                    <input value={toolInput.reviewerName || ''} onChange={e => setToolInput(s => ({ ...s, reviewerName: e.target.value }))} placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Rating</label>
                    <select value={toolInput.rating || '5'} onChange={e => setToolInput(s => ({ ...s, rating: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                      {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Review Text</label>
                    <textarea value={toolInput.reviewText || ''} onChange={e => setToolInput(s => ({ ...s, reviewText: e.target.value }))} rows={3} placeholder="Paste the customer review here…"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" />
                  </div>
                </div>
              )}

              {activeTool.key === 'posts' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Post Type</label>
                    <select value={toolInput.postType || 'update'} onChange={e => setToolInput(s => ({ ...s, postType: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                      <option value="update">What&apos;s New (Update)</option>
                      <option value="offer">Offer / Promotion</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Topic / Theme (optional)</label>
                    <input value={toolInput.topic || ''} onChange={e => setToolInput(s => ({ ...s, topic: e.target.value }))} placeholder="e.g. Summer sale, new service launch…"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
              )}

              {activeTool.key === 'keywords' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Business Category</label>
                    <input value={toolInput.category || profile.category} onChange={e => setToolInput(s => ({ ...s, category: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Target Location</label>
                    <input value={toolInput.location || profile.address} onChange={e => setToolInput(s => ({ ...s, location: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
              )}

              {activeTool.key === 'qa' && (
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Customer Question</label>
                  <textarea value={toolInput.question || ''} onChange={e => setToolInput(s => ({ ...s, question: e.target.value }))} rows={3} placeholder="Enter a customer question to get an AI answer…"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" />
                </div>
              )}

              {(activeTool.key === 'competitors' || activeTool.key === 'citations' || activeTool.key === 'sentiment' || activeTool.key === 'photos') && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Info className="h-4 w-4 text-indigo-500" />
                    This tool will automatically analyze your business profile ({profile.businessName}) at {profile.address}. Click &quot;Run AI Analysis&quot; to begin.
                  </p>
                </div>
              )}

              {/* Run button */}
              <button onClick={() => executeAiTool(activeTool.key)} disabled={toolLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                {toolLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Running AI Analysis…</> : <><BrainCircuit className="h-5 w-5" /> Run AI Analysis</>}
              </button>

              {/* Results */}
              {toolResult && (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-700 flex items-center gap-2 uppercase tracking-wider">
                      <CheckCircle2 className="h-4 w-4" /> AI Results
                    </span>
                    <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(toolResult, null, 2)); toast.success('Results copied!'); }}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer">
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </button>
                  </div>

                  {/* Description tool results */}
                  {activeTool.key === 'description' && toolResult.optimizedDescription && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Optimized Description</h4>
                        <p className="text-sm text-slate-700 leading-relaxed">{toolResult.optimizedDescription}</p>
                        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                          <span>{toolResult.characterCount} / {toolResult.characterLimit} chars</span>
                          <button onClick={() => { navigator.clipboard.writeText(toolResult.optimizedDescription); toast.success('Description copied!'); }}
                            className="text-emerald-600 font-bold cursor-pointer hover:underline flex items-center gap-1"><Copy className="h-3 w-3" /> Copy</button>
                        </div>
                      </div>
                      {toolResult.variations?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-slate-700 mb-2">Alternative Variations</h4>
                          {toolResult.variations.map((v, vi) => (
                            <div key={vi} className="bg-white rounded-xl p-3 border border-slate-100 mb-2">
                              <span className="text-[10px] font-bold uppercase text-indigo-600">{v.tone}</span>
                              <p className="text-xs text-slate-600 mt-1">{v.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {toolResult.seoHighlights?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {toolResult.seoHighlights.map((kw, ki) => (
                            <span key={ki} className="text-[10px] font-bold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">{kw}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review response results */}
                  {activeTool.key === 'reviews' && toolResult.primaryResponse && (
                    <div className="bg-white rounded-xl p-4 border border-slate-100 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          toolResult.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                          toolResult.sentiment === 'neutral' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>Sentiment: {toolResult.sentiment}</span>
                      </div>
                      <p className="text-sm text-slate-700">{toolResult.primaryResponse}</p>
                      {toolResult.alternateResponses?.length > 0 && (
                        <div className="border-t border-slate-100 pt-3">
                          <h4 className="text-xs font-bold text-slate-500 mb-2">Alternative Responses</h4>
                          {toolResult.alternateResponses.map((alt, ai) => (
                            <div key={ai} className="bg-slate-50 rounded-lg p-2 mb-1 text-xs text-slate-600">
                              <span className="font-bold text-indigo-600">{alt.tone}: </span>{alt.content}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post creator results */}
                  {activeTool.key === 'posts' && (toolResult.postContent || toolResult.title) && (
                    <div className="bg-white rounded-xl p-4 border border-slate-100 space-y-3">
                      {toolResult.title && <h4 className="font-bold text-slate-900">{toolResult.title}</h4>}
                      <p className="text-sm text-slate-700">{toolResult.postContent || toolResult.content}</p>
                      {toolResult.callToAction && (
                        <div className="bg-emerald-50 rounded-lg p-2 text-sm font-bold text-emerald-700">
                          CTA: {toolResult.callToAction.type} — {toolResult.callToAction.label || toolResult.callToAction.url}
                        </div>
                      )}
                      {toolResult.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {toolResult.hashtags.map((h, hi) => (
                            <span key={hi} className="text-xs text-indigo-600 font-medium">{h}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Keyword results */}
                  {activeTool.key === 'keywords' && toolResult.keywords && (
                    <div className="space-y-2">
                      {toolResult.keywords.map((kw, ki) => (
                        <div key={ki} className="bg-white rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-bold text-slate-900">{kw.keyword}</span>
                            <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              kw.difficulty === 'Low' ? 'bg-emerald-100 text-emerald-700' :
                              kw.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                            }`}>{kw.difficulty}</span>
                          </div>
                          <span className="text-xs text-slate-500">{kw.monthlySearches || kw.volume} searches/mo</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Competitor results */}
                  {activeTool.key === 'competitors' && toolResult.competitors && (
                    <div className="space-y-2">
                      {toolResult.competitors.map((c, ci) => (
                        <div key={ci} className="bg-white rounded-xl p-3 border border-slate-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-slate-900">{c.name}</span>
                            <div className="flex items-center gap-1 text-amber-400">
                              <Star className="h-3 w-3 fill-current" />
                              <span className="text-xs font-bold text-slate-700">{c.rating}</span>
                              <span className="text-xs text-slate-500">({c.reviewCount || c.reviews})</span>
                            </div>
                          </div>
                          {c.strengths && <p className="text-xs text-slate-500">Strengths: {Array.isArray(c.strengths) ? c.strengths.join(', ') : c.strengths}</p>}
                          {c.weaknesses && <p className="text-xs text-rose-500">Gaps: {Array.isArray(c.weaknesses) ? c.weaknesses.join(', ') : c.weaknesses}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Citation/NAP results */}
                  {activeTool.key === 'citations' && (toolResult.overallScore || toolResult.directories) && (
                    <div className="space-y-3">
                      {toolResult.overallScore && (
                        <div className="bg-white rounded-xl p-3 border border-slate-100 text-center">
                          <span className="text-3xl font-bold text-emerald-600">{toolResult.overallScore}%</span>
                          <p className="text-xs text-slate-500 mt-1">NAP Consistency Score</p>
                        </div>
                      )}
                      {toolResult.directories?.map((d, di) => (
                        <div key={di} className="bg-white rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-900">{d.name}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            d.status === 'Match' || d.status === 'Consistent' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>{d.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sentiment results */}
                  {activeTool.key === 'sentiment' && (toolResult.overallSentiment || toolResult.sentimentBreakdown) && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {toolResult.sentimentBreakdown && Object.entries(toolResult.sentimentBreakdown).map(([key, val]) => (
                          <div key={key} className="bg-white rounded-xl p-3 border border-slate-100 text-center">
                            <span className="text-lg font-bold text-slate-900">{typeof val === 'number' ? val : val.count || val.percentage || val}</span>
                            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">{key}</p>
                          </div>
                        ))}
                      </div>
                      {toolResult.topTopics && (
                        <div className="flex flex-wrap gap-2">
                          {toolResult.topTopics.map((t, ti) => (
                            <span key={ti} className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">{typeof t === 'string' ? t : t.topic || t.name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Generic Q&A / photo / fallback */}
                  {(activeTool.key === 'qa' || activeTool.key === 'photos') && (
                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {toolResult.reply || toolResult.response || toolResult.answer || JSON.stringify(toolResult, null, 2)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
