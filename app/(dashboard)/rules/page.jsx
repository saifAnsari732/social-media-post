"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Zap, MessageCircle, MessageSquareQuote, Play, Pause, MoreVertical } from "lucide-react";

export default function RulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  async function fetchRules() {
    try {
      const userStr = localStorage.getItem("yt_user");
      if (!userStr) return;
      const { userId } = JSON.parse(userStr);

      const res = await fetch("/api/rules", {
        headers: { "x-user-id": userId }
      });
      const data = await res.json();
      setRules(data.rules || []);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error("Failed to toggle status", err);
      // Revert on error
      setRules(rules.map(r => r._id === ruleId ? { ...r, status: currentStatus } : r));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#7C3AED]" />
            Automation Rules
          </h1>
          <p className="text-[#64748B] mt-1 text-sm">Set up auto-replies for DMs and Comments.</p>
        </div>
        <Link 
          href="/rules/new"
          className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg shadow-[#7C3AED]/20 hover:shadow-xl hover:shadow-[#7C3AED]/30 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Create Rule
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-xl border border-[#E2E8F0]"></div>)}
        </div>
      ) : rules.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-[#CBD5E1] p-12 text-center">
          <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-[#94A3B8]" />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A] mb-2">No rules yet</h3>
          <p className="text-[#64748B] text-sm max-w-md mx-auto mb-6">Create your first automation rule to start responding to customers instantly, 24/7.</p>
          <Link href="/rules/new" className="bg-[#0F172A] text-white px-5 py-2.5 rounded-lg font-medium text-sm inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create First Rule
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map(rule => (
            <div key={rule._id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-[#7C3AED]/30 hover:shadow-md transition-all group relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-[#0F172A] text-base">{rule.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded capitalize">
                      {rule.platform}
                    </span>
                    <span className="text-xs font-medium bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded flex items-center gap-1">
                      {rule.type === 'dm' ? <MessageCircle className="w-3 h-3" /> : <MessageSquareQuote className="w-3 h-3" />}
                      {rule.type === 'both' ? 'DM & Comment' : rule.type}
                    </span>
                  </div>
                </div>
                <button className="text-[#94A3B8] hover:text-[#0F172A] p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Triggers on</p>
                <div className="flex flex-wrap gap-1.5">
                  {rule.trigger?.keywords?.map((kw, i) => (
                    <span key={i} className="text-[11px] font-medium bg-[#7C3AED]/10 text-[#7C3AED] px-2 py-0.5 rounded-full border border-[#7C3AED]/20">
                      {kw}
                    </span>
                  ))}
                  {(!rule.trigger?.keywords || rule.trigger.keywords.length === 0) && (
                    <span className="text-[11px] font-medium bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded-full">Any Message</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Replied</span>
                  <span className="text-sm font-bold text-[#0F172A]">{rule.stats?.totalRepliesSent || 0}</span>
                </div>
                
                <button 
                  onClick={() => toggleStatus(rule._id, rule.status)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    rule.status === 'active' 
                      ? 'bg-[#16A34A]/10 text-[#16A34A] hover:bg-[#16A34A]/20' 
                      : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {rule.status === 'active' ? (
                    <><Play className="w-3 h-3 fill-current" /> Active</>
                  ) : (
                    <><Pause className="w-3 h-3 fill-current" /> Paused</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
