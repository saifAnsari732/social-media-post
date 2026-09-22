"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  MessageCircle, 
  MessageSquareQuote, 
  Sparkles, 
  CheckCircle2, 
  Filter,
  Layers,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PlatformIcon } from "@/components/ui/SocialIcons";
import { checkPlanAccess } from "@/lib/user";

export default function RulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const allowed = checkPlanAccess({ action: "automation", router, toast });
    if (!allowed) return;
    const userStr = localStorage.getItem("socialflow_user") || localStorage.getItem("yt_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        fetchRules(u.userId);
        return;
      } catch (e) {}
    }
    fetchRules("eb994f0c8e6f7fb4c2629561");
  }, []);

  async function fetchRules(userId) {
    try {
      setLoading(true);
      const res = await fetch("/api/rules", {
        headers: { "x-user-id": userId || user?.userId }
      });
      const data = await res.json();
      setRules(data.rules || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load automation rules");
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(ruleId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      setRules(rules.map(r => r._id === ruleId ? { ...r, status: newStatus } : r));
      await fetch(`/api/rules/${ruleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      toast.success(`Rule ${newStatus === 'active' ? 'Activated' : 'Paused'}`);
    } catch (err) {
      console.error("Failed to toggle status", err);
      setRules(rules.map(r => r._id === ruleId ? { ...r, status: currentStatus } : r));
      toast.error("Failed to update status");
    }
  }

  async function deleteRule(ruleId, ruleName) {
    if (!confirm(`Are you sure you want to delete "${ruleName}"?`)) return;
    try {
      await fetch(`/api/rules/${ruleId}`, {
        method: "DELETE"
      });
      setRules(rules.filter(r => r._id !== ruleId));
      toast.success("Rule deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete rule");
    }
  }

  const filteredRules = rules.filter(rule => {
    if (activeFilter === "all") return true;
    if (activeFilter === "dm") return rule.type === "dm" || rule.type === "both";
    if (activeFilter === "comment") return rule.type === "comment" || rule.type === "both";
    if (activeFilter === "ai") return Boolean(rule.dmReply?.useAI);
    return true;
  });

  const totalReplies = rules.reduce((acc, r) => acc + (r.stats?.totalRepliesSent || 0), 0);
  const activeCount = rules.filter(r => r.status === "active").length;

  return (
    <div className="space-y-7 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-950 tracking-tight flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-indigo-600" />
            <span>Automation & Auto-Reply Rules</span>
          </h1>
          <p className="text-xs lg:text-sm text-slate-600 mt-1 font-normal">
            Configure keyword-triggered bots & AI copilot auto-responders for incoming DMs and comments.
          </p>
        </div>

        <Link 
          href="/rules/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all no-underline cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> Create Automation Rule
        </Link>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Rules Configured</span>
          <p className="text-2xl font-black text-slate-950">{rules.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live Active Rules</span>
          <p className="text-2xl font-black text-emerald-600 flex items-center gap-2">
            <span>{activeCount}</span>
            <span className="text-xs font-semibold text-slate-400 font-normal">running 24/7</span>
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Automated Replies Sent</span>
          <p className="text-2xl font-black text-indigo-600 flex items-center gap-2">
            <span>{totalReplies}</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/90 p-1 rounded-xl text-xs font-bold text-slate-700 w-fit shadow-2xs">
        {[
          { id: "all", label: "All Automations" },
          { id: "dm", label: "Direct Messages (DM)" },
          { id: "comment", label: "Post Comments" },
          { id: "ai", label: "Gemini AI Driven" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeFilter === tab.id 
                ? "bg-white text-indigo-700 shadow-2xs font-extrabold" 
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rules Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-200/60 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredRules.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-2xs">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-indigo-100">
            <Zap className="w-7 h-7 text-indigo-600" />
          </div>
          <h3 className="text-base font-bold text-slate-950 mb-1">No automation rules matching this filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            Configure rules so your bots can automatically reply when users message you or comment on your reels.
          </p>
          <Link 
            href="/rules/new" 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold no-underline inline-flex items-center gap-1.5 shadow-xs shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Create First Rule
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRules.map(rule => {
            const isActive = rule.status === "active";
            const usesAI = Boolean(rule.dmReply?.useAI);

            return (
              <div 
                key={rule._id} 
                className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between shadow-2xs group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-3.5">
                    <div className="min-w-0 pr-2">
                      <h3 className="font-bold text-slate-950 text-sm truncate">{rule.name}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[10.5px] font-semibold border border-slate-200 capitalize">
                          <PlatformIcon platform={rule.platform} className="w-3.5 h-3.5" />
                          <span>{rule.platform}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600 text-[10.5px] font-medium border border-slate-200">
                          {rule.type === 'dm' ? <MessageCircle className="w-3 h-3 text-indigo-600" /> : <MessageSquareQuote className="w-3 h-3 text-violet-600" />}
                          <span className="capitalize">{rule.type === 'both' ? 'DM & Comment' : rule.type}</span>
                        </span>

                        {usesAI && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                            <Sparkles className="w-3 h-3 text-indigo-600" /> AI Reply
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => deleteRule(rule._id, rule.name)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Trigger Keywords */}
                  <div className="my-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Trigger Keywords
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {rule.trigger?.keywords && rule.trigger.keywords.length > 0 ? (
                        rule.trigger.keywords.map((kw, i) => (
                          <span 
                            key={i} 
                            className="text-[11px] font-semibold bg-white text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100 shadow-2xs"
                          >
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] font-medium text-slate-500 italic">
                          Any message / comment
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reply Preview */}
                  <div className="text-xs text-slate-600 line-clamp-2 italic mb-3 font-normal">
                    "{rule.dmReply?.useAI 
                      ? `AI Prompt: ${rule.dmReply?.systemPrompt || "Auto-generate contextual reply"}` 
                      : (rule.dmReply?.messages?.[0]?.text || "No reply message defined")}"
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Replied</span>
                    <span className="text-xs font-bold text-slate-900">{rule.stats?.totalRepliesSent || 0} times</span>
                  </div>
                  
                  <button 
                    onClick={() => toggleStatus(rule._id, rule.status)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isActive ? (
                      <><Play className="w-3 h-3 fill-emerald-600 text-emerald-600" /> Active</>
                    ) : (
                      <><Pause className="w-3 h-3 fill-slate-500 text-slate-500" /> Paused</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
