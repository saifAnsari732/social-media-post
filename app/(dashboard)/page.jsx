"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, CalendarRange, MessageSquareText, Sparkles, Zap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const shortcuts = [
  { title: 'Create automation rule', text: 'Set up keyword-based replies for DM and comments.', href: '/rules/new', label: 'Create Rule' },
  { title: 'Multi-channel publisher', text: 'Prepare one content package and publish to many channels.', href: '/publisher', label: 'Open Publisher' },
  { title: 'Inbox assistant', text: 'Reply quickly and keep every conversation organized.', href: '/inbox', label: 'View Inbox' },
];

export default function DashboardRoot() {
  const [data, setData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("yt_user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);

    async function fetchData() {
      try {
        const [analyticsRes, accountsRes] = await Promise.all([
          fetch("/api/analytics", { headers: { "x-user-id": user.userId } }),
          fetch("/api/accounts", { headers: { "x-user-id": user.userId } })
        ]);
        
        if (analyticsRes.ok) {
          setData(await analyticsRes.json());
        }
        if (accountsRes.ok) {
          const accData = await accountsRes.json();
          setAccounts(accData.accounts || []);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [router]);

  const overviewCards = [
    { label: 'Connected Channels', value: data?.connectedChannels ?? '-', change: 'Active Accounts', icon: Sparkles, color: 'from-violet-500 to-fuchsia-500' },
    { label: 'Published Posts', value: data?.scheduledPosts ?? '-', change: 'Total Published', icon: CalendarRange, color: 'from-cyan-500 to-sky-500' },
    { label: 'AI Replies', value: data?.totalRepliesSent ?? '-', change: 'Automated interactions', icon: MessageSquareText, color: 'from-emerald-500 to-teal-500' },
    { label: 'Engagement Lift', value: data?.engagementLift ?? '-', change: 'Based on AI replies', icon: BarChart3, color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-2">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#3B0764] p-10 text-white shadow-xl">
        {/* Subtle background decoration */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#7C3AED] opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#DB2777] opacity-20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#D8B4FE]">
              <Zap className="h-3.5 w-3.5" />
              Social performance command center
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl leading-[1.1]">Your channels, content, and replies — all in one place.</h1>
            <p className="mt-5 max-w-xl text-base text-[#CBD5E1] md:text-lg">
              Connect every platform, publish in one click, and automate engagement with AI-powered workflows that feel personal at scale.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/publisher" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-lg transition hover:-translate-y-0.5">
                Launch Publisher
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/rules/new" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Create Auto Reply
              </Link>
            </div>
          </div>

          <div className="grid min-w-[260px] gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-white/50" />
              </div>
            ) : accounts.length > 0 ? (
              accounts.map((acc, index) => (
                <div key={acc._id || index} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/20 px-3 py-2">
                  <span className="text-sm text-slate-200 capitalize">{acc.platform} {acc.name ? `(${acc.name})` : ''}</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]" />
                    <span className="text-xs text-emerald-300">Live</span>
                  </div>
                </div>
              ))
            ) : (
               <div className="text-center p-4">
                 <p className="text-sm text-white/70">No accounts connected yet</p>
                 <Link href="/publisher" className="text-xs text-violet-300 hover:underline mt-1 block">Connect Account</Link>
               </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 transition hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-black tracking-tight text-slate-900">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-slate-300" /> : value}
            </div>
            <p className="mt-2 text-xs font-medium text-slate-400">{change}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {shortcuts.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between">
            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
            <Link href={item.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700">
              {item.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
