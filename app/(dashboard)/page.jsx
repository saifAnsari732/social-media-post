"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, CalendarRange, MessageSquareText, Sparkles, Zap } from "lucide-react";

const overviewCards = [
  { label: 'Connected Channels', value: '12', change: '+3 this week', icon: Sparkles, color: 'from-violet-500 to-fuchsia-500' },
  { label: 'Scheduled Posts', value: '48', change: '+18 today', icon: CalendarRange, color: 'from-cyan-500 to-sky-500' },
  { label: 'AI Replies', value: '1.2k', change: '+64%', icon: MessageSquareText, color: 'from-emerald-500 to-teal-500' },
  { label: 'Engagement Lift', value: '29.4%', change: '+8.2% vs last week', icon: BarChart3, color: 'from-orange-500 to-amber-500' },
];

const shortcuts = [
  { title: 'Create automation rule', text: 'Set up keyword-based replies for DM and comments.', href: '/rules/new', label: 'Create Rule' },
  { title: 'Multi-channel publisher', text: 'Prepare one content package and publish to many channels.', href: '/publisher', label: 'Open Publisher' },
  { title: 'Inbox assistant', text: 'Reply quickly and keep every conversation organized.', href: '/inbox', label: 'View Inbox' },
];

export default function DashboardRoot() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 py-2">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-violet-950 to-fuchsia-900 p-8 text-white shadow-2xl shadow-violet-500/20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-100">
              <Zap className="h-3.5 w-3.5" />
              Social performance command center
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">Your channels, content, and replies — all in one place.</h1>
            <p className="mt-4 max-w-xl text-base text-slate-200 md:text-lg">
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
            {['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'TikTok'].map((channel, index) => (
              <div key={channel} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/20 px-3 py-2">
                <span className="text-sm text-slate-200">{channel}</span>
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.8)]" />
                <span className="text-xs text-emerald-300">Live</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-black tracking-tight text-slate-900">{value}</div>
            <p className="mt-2 text-xs font-medium text-emerald-600">{change}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {shortcuts.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            <Link href={item.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-600">
              {item.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
