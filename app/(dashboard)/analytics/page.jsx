"use client";
import { BarChart3, Activity } from "lucide-react";
import { useEffect, useState } from "react";
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

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Analytics Dashboard</h1>
          <p className="text-[#64748B] text-sm mt-1">Track automation performance and AI engagement metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
          <p className="text-[#64748B] text-sm font-medium mb-1">Total Replies Sent</p>
          <h4 className="text-3xl font-bold text-[#0F172A]">{loading ? "..." : data.totalRepliesSent}</h4>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
          <p className="text-[#64748B] text-sm font-medium mb-1">Estimated AI Tokens Used</p>
          <h4 className="text-3xl font-bold text-[#0F172A]">{loading ? "..." : data.aiTokensUsed}</h4>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
          <p className="text-[#64748B] text-sm font-medium mb-1">Active Rules</p>
          <h4 className="text-3xl font-bold text-[#0F172A]">{loading ? "..." : data.activeRules}</h4>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
          <Activity className="w-8 h-8 text-[#10B981]" />
        </div>
        <h3 className="text-lg font-bold text-[#0F172A] mb-2">Systems are nominal</h3>
        <p className="text-[#64748B] max-w-sm mx-auto">Your automation rules are active and monitoring your connected accounts.</p>
      </div>
    </div>
  );
}
