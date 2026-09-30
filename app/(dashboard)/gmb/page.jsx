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
  X, Loader2, ChevronDown, Save, Trash2, Plus, Hash, Award, Key, Check,
  UserCheck, Settings, Database, Sliders, Activity, ShieldAlert, Terminal, HelpCircle, History
} from 'lucide-react';

// Preset Locations
const PRESET_LOCATIONS = [
  {
    locationId: "locations/492018374928174",
    title: "Postfly Digital Agency",
    storeCode: "PF-PUNE-01",
    googleEmail: "postfly.official@gmail.com",
    city: "Pune",
    category: "Digital Marketing Agency",
    address: "102 Landmark Tower, Senapati Bapat Road, Pune, MH 411016",
    rating: 4.8,
    reviews: 142
  },
  {
    locationId: "locations/582910482019482",
    title: "Postfly Media Hub & Tech",
    storeCode: "PF-MUMBAI-02",
    googleEmail: "saif.ansari.tech@gmail.com",
    city: "Mumbai",
    category: "Software Company",
    address: "B-404 Horizon Tech Park, BKC Bandra East, Mumbai, MH 400051",
    rating: 4.9,
    reviews: 98
  }
];

// 38 Tools grouped by category
const TOOL_CATEGORIES = {
  ACCOUNT: ["get_google_accounts", "get_locations", "get_location", "get_location_status"],
  PROFILE: ["get_business_profile", "update_business_information", "update_business_description", "update_contact_information", "update_business_category"],
  HOURS: ["get_business_hours", "get_special_hours", "update_business_hours", "update_special_hours"],
  CATEGORY: ["get_categories", "get_primary_category", "update_categories"],
  REVIEWS: ["get_reviews", "get_review", "get_unanswered_reviews", "get_reviews_by_rating", "analyze_review", "generate_review_reply", "publish_review_reply"],
  POSTS: ["get_posts", "get_post", "create_post", "update_post", "delete_post", "publish_post"],
  MEDIA: ["get_media", "add_media", "delete_media"],
  AI: ["audit_business_profile", "analyze_reviews", "generate_post", "rewrite_content", "translate_content", "generate_action_plan"]
};

export default function GMBPage() {
  const [user, setUser] = useState(null);
  const [limits, setLimits] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Active Location Context
  const [activeLocation, setActiveLocation] = useState(PRESET_LOCATIONS[0]);
  const [locationsList, setLocationsList] = useState(PRESET_LOCATIONS);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // Create Location Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLocForm, setCreateLocForm] = useState({
    title: "",
    category: "Digital Marketing Agency",
    address: "101 Tech Park, SB Road, Pune",
    city: "Pune",
    phone: "+91 9511450914",
    website: "https://postfly.in",
    description: "Official business profile for local services."
  });
  const [creatingLoc, setCreatingLoc] = useState(false);

  // Agent Chat State & 7-Step Visualizer
  const [agentQuery, setAgentQuery] = useState('');
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentResult, setAgentResult] = useState(null);
  const [confirmationPending, setConfirmationPending] = useState(null);

  // Active Tool Execution Modal (For 38 Tools Explorer)
  const [activeTool, setActiveTool] = useState(null);
  const [toolInput, setToolInput] = useState({});
  const [toolResult, setToolResult] = useState(null);
  const [toolExecuting, setToolExecuting] = useState(false);

  // Audit Trail & Logs
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("agent"); // "agent", "tools", "audit"

  useEffect(() => {
    const userData = getStoredUser();
    setUser(userData);
    setLimits(getUserPlanLimits(userData));
    fetchAuditLogs();
    setIsLoading(false);
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
    } catch (e) {}
  };

  // Run Agent through 7-step lifecycle
  const handleRunAgent = async (userConfirmed = false) => {
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
        toast.custom((t) => (
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-amber-500/50 flex items-start gap-3 max-w-md">
            <ShieldAlert className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-sm text-amber-300 uppercase tracking-wide">Confirmation Required (Rule #8)</h4>
              <p className="text-xs text-slate-300 mt-1">{result.message}</p>
            </div>
          </div>
        ), { duration: 6000 });
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

  // Run a direct tool from the 38-tool registry
  const handleRunDirectTool = async (toolName) => {
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
      toast.success(`Tool '${toolName}' executed successfully!`);
  // Create new Business Location (GMB API)
  const handleCreateLocationSubmit = async (e) => {
    e.preventDefault();
    if (!createLocForm.title || !createLocForm.category) {
      toast.error("Business Title and Category are required");
      return;
    }
    setCreatingLoc(true);
    try {
      const res = await fetch("/api/gmb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_business_location",
          ...createLocForm
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create location");
      
      const newLoc = data.data.location;
      setLocationsList(prev => [newLoc, ...prev]);
      setActiveLocation(newLoc);
      setShowCreateModal(false);
      toast.success(`Google Business Location '${newLoc.title}' created & verified!`);
      fetchAuditLogs();
    } catch (err) {
      toast.error(err.message || "Failed to create business location");
    } finally {
      setCreatingLoc(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-t-4 border-emerald-600 animate-spin"></div>
            <MapPin className="absolute inset-0 m-auto h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-slate-500 font-semibold text-sm">Initializing GMB Agent Command Center…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ━━━ 1. AGENT HERO COMMAND BANNER & LOCATION SELECTOR ━━━ */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-8 text-white shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> GMB AI Agent Specification v2.0 • 38 Tools Registered
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <MapPin className="h-8 w-8 text-emerald-400 shrink-0" />
                Google Business Profile Agent
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                Autonomous Gemini AI Agent running the 7-step lifecycle: <strong className="text-emerald-300 font-bold">Understand → Inspect → Decide → Generate → Confirm → Execute → Verify</strong>.
              </p>
            </div>

            {/* Location Context Switcher & Language Select */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="bg-slate-800/90 p-2 rounded-2xl border border-slate-700 space-y-1.5 w-full sm:w-auto">
                <div className="flex items-center justify-between px-2 gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Active Location Context</span>
                  <button onClick={() => setShowCreateModal(true)} className="text-[10px] font-extrabold text-emerald-400 hover:underline uppercase tracking-wider flex items-center gap-0.5 cursor-pointer">
                    <Plus className="h-3 w-3" /> Create GMB
                  </button>
                </div>
                <select value={activeLocation.locationId} onChange={e => {
                  const loc = locationsList.find(l => l.locationId === e.target.value);
                  if (loc) {
                    setActiveLocation(loc);
                    toast.success(`Switched context to ${loc.title}`);
                  }
                }} className="bg-slate-900 text-white font-bold text-xs rounded-xl px-3 py-2 border border-slate-700 outline-none cursor-pointer w-full">
                  {locationsList.map(l => (
                    <option key={l.locationId} value={l.locationId}>
                      📍 {l.title} ({l.city || l.address?.locality || 'City'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Language:</span>
                {["English", "Hinglish", "Hindi"].map(lang => (
                  <button key={lang} onClick={() => setSelectedLanguage(lang)}
                    className={`text-xs font-extrabold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                      selectedLanguage === lang ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ 2. MAIN NAVIGATION TABS ━━━ */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { id: "agent", label: "Agent Command Center", icon: BrainCircuit },
            { id: "tools", label: "38-Tool Registry Explorer", icon: Sliders },
            { id: "audit", label: "Write Audit Trail Logs", icon: History }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                activeTab === tab.id ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ━━━ TAB A: AGENT COMMAND CENTER & 7-STEP LIFECYCLE ━━━ */}
        {activeTab === "agent" && (
          <div className="space-y-6">
            {/* Natural Language Prompt Input */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-indigo-600" /> Ask GMB Agent Anything
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Strict Rule #8 Safety Confirmed
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input type="text" value={agentQuery} onChange={e => setAgentQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRunAgent(false)}
                  placeholder="e.g. Audit my GMB business description, fetch unanswered reviews, or create a weekly offer post..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                <button onClick={() => handleRunAgent(false)} disabled={agentLoading || !agentQuery.trim()}
                  className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-extrabold px-6 py-3.5 rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
                  {agentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Run Lifecycle
                </button>
              </div>

              {/* Sample Preset Commands */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  "Audit my business profile description & NAP consistency",
                  "Fetch all unanswered reviews and draft replies in Hinglish",
                  "Create a weekly promotional post for local SEO boost",
                  "Check business hours and detect missing holiday special hours"
                ].map((sample, idx) => (
                  <button key={idx} onClick={() => setAgentQuery(sample)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer">
                    💡 {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* HIGH-RISK CONFIRMATION PROMPT BOX */}
            {confirmationPending && (
              <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-400 text-slate-900 shadow-md space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-amber-900 text-sm uppercase tracking-wide">High-Risk Write Confirmation Gate (Rule #8)</h4>
                    <p className="text-xs font-bold text-amber-800 mt-1">{confirmationPending.message}</p>
                    <div className="mt-2 bg-white/80 p-3 rounded-xl border border-amber-200 font-mono text-xs text-slate-800">
                      Target Action: <strong>{confirmationPending.pendingAction?.tool}</strong> | Location: <strong>{activeLocation.title}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button onClick={() => handleRunAgent(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs">
                    Confirm & Execute Action
                  </button>
                  <button onClick={() => setConfirmationPending(null)}
                    className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-slate-300 transition-all cursor-pointer">
                    Cancel Operation
                  </button>
                </div>
              </div>
            )}

            {/* 7-STEP LIFECYCLE RESULTS DISPLAY */}
            {agentResult && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-black text-slate-950 text-sm flex items-center gap-2 uppercase tracking-wider">
                      <Activity className="h-4 w-4 text-emerald-600" /> 7-Step Lifecycle Execution Trace
                    </h4>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${
                      agentResult.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>{agentResult.status}</span>
                  </div>

                  {/* Steps Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {agentResult.steps?.map((step, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-1">
                        <span className="text-[10.5px] font-black text-indigo-600 uppercase tracking-wide block">{step.stage}</span>
                        <p className="text-xs text-slate-700 font-semibold">{step.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Response Text */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-3">
                  <h4 className="font-black text-slate-950 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" /> Gemini Agent Response
                  </h4>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                    {agentResult.responseText}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ━━━ TAB B: 38-TOOL REGISTRY EXPLORER ━━━ */}
        {activeTab === "tools" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-indigo-600" /> 38 Registered GMB Tools
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Explore and execute any of the 38 tools directly against {activeLocation.title}.</p>
              </div>

              {Object.entries(TOOL_CATEGORIES).map(([catName, toolList]) => (
                <div key={catName} className="space-y-3 pt-3 border-t border-slate-100">
                  <span className="text-xs font-black uppercase text-indigo-600 tracking-wider block">Category: {catName} ({toolList.length} tools)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {toolList.map(tName => (
                      <button key={tName} onClick={() => { setActiveTool(tName); setToolInput({}); setToolResult(null); }}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-white text-left transition-all cursor-pointer group flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 font-mono">{tName}</span>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ━━━ TAB C: WRITE AUDIT TRAIL LOGS ━━━ */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                  <History className="h-5 w-5 text-indigo-600" /> Write Operation Audit Log
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Audit log tracking every location write operation.</p>
              </div>
              <button onClick={fetchAuditLogs} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh Logs
              </button>
            </div>

            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium bg-slate-50 rounded-2xl border border-slate-200">
                No write audit logs recorded yet. Execute any write action (e.g. updating description, publishing replies, creating posts) to record logs.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-800 font-medium border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase text-[10px] font-black border-b border-slate-200">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Location ID</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                        <td className="p-3 font-mono font-bold text-indigo-600">{log.locationId}</td>
                        <td className="p-3 font-bold text-emerald-700">{log.action}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-700">{JSON.stringify(log.details)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ━━━ DIRECT TOOL EXECUTION MODAL ━━━ */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setActiveTool(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Sliders className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base font-mono">{activeTool}</h3>
                  <p className="text-xs text-slate-300">Target Location: {activeLocation.title}</p>
                </div>
              </div>
              <button onClick={() => setActiveTool(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <button onClick={() => handleRunDirectTool(activeTool)} disabled={toolExecuting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer">
                {toolExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                Execute Tool '{activeTool}'
              </button>

              {toolResult && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <span className="text-xs font-black text-emerald-700 uppercase tracking-wider block">Tool Output Result:</span>
                  <pre className="text-xs font-mono bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-wrap overflow-x-auto text-slate-800">
                    {JSON.stringify(toolResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      {/* ━━━ CREATE NEW GMB LOCATION WIZARD MODAL ━━━ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                  <PlusCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Create Google Business Profile Location</h3>
                  <p className="text-xs text-slate-300 font-medium">Add business name, category, address, phone & hours</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateLocationSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Business Name *</label>
                <input type="text" required value={createLocForm.title} onChange={e => setCreateLocForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Apex Marketing Solutions"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Primary Category *</label>
                  <input type="text" required value={createLocForm.category} onChange={e => setCreateLocForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Digital Marketing Agency"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">City / Locality *</label>
                  <input type="text" required value={createLocForm.city} onChange={e => setCreateLocForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Pune"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Full Street Address *</label>
                <input type="text" required value={createLocForm.address} onChange={e => setCreateLocForm(f => ({ ...f, address: e.target.value }))} placeholder="e.g. 101 Tech Park, SB Road, Pune 411016"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Phone Number</label>
                  <input type="text" value={createLocForm.phone} onChange={e => setCreateLocForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 9511450914"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Website URL</label>
                  <input type="url" value={createLocForm.website} onChange={e => setCreateLocForm(f => ({ ...f, website: e.target.value }))} placeholder="https://postfly.in"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Business Description</label>
                <textarea rows={2} value={createLocForm.description} onChange={e => setCreateLocForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your services..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              </div>

              <button type="submit" disabled={creatingLoc}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs uppercase tracking-wider">
                {creatingLoc ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                {creatingLoc ? 'Creating Location on Google API…' : 'Submit & Create Google Location'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
