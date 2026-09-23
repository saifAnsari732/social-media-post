"use client";

import { useState, useEffect } from 'react';
import { Bell, Search, Plus, ShieldCheck, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getStoredUser, getUserPlanLimits } from '@/lib/user';

function TrialCountdownPill({ user }) {
  const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTime = () => {
      const startDateStr = user?.trialStartDate || user?.createdAt || new Date().toISOString();
      const start = new Date(startDateStr).getTime();
      const expiresAt = start + (5 * 24 * 60 * 60 * 1000); // 5-Day Trial Period
      const now = Date.now();
      const diff = expiresAt - now;

      if (isNaN(diff) || diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [user]);

  if (timeLeft.isExpired) {
    return (
      <Link
        href="/billing"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/30 border border-rose-400/40 transition-all no-underline animate-pulse cursor-pointer"
        title="Your 5-Day Trial has expired. Click to upgrade your plan."
      >
        <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
        <span>Trial Expired (Blocked)</span>
        <span className="px-2 py-0.5 rounded-md bg-white text-rose-700 font-extrabold text-[10.5px]">
          Upgrade Plan
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/billing"
      className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-50 via-amber-50/50 to-rose-50 hover:from-rose-100 hover:to-rose-100 text-rose-800 border-2 border-rose-300 shadow-xs transition-all no-underline group cursor-pointer"
      title="Trial Countdown Timer. Click to view subscription plans."
    >
      <span className="relative flex h-3 w-3 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-80"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
      </span>
      <Clock className="w-4 h-4 text-rose-600 group-hover:rotate-12 transition-transform shrink-0" />
      <span className="text-xs text-slate-800 font-bold whitespace-nowrap">
        Trial Expires in:
      </span>
      <span className="font-mono font-black text-sm tracking-wide bg-white px-2.5 py-0.5 rounded-lg border border-rose-300 shadow-2xs inline-flex items-center gap-1">
        <span className="text-rose-700 font-black">{timeLeft.days}d</span>
        <span className="text-slate-400">:</span>
        <span className="text-rose-700 font-black">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span className="text-slate-400">:</span>
        <span className="text-rose-700 font-black">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span className="text-slate-400">:</span>
        <span className="text-red-600 font-black animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </span>
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 to-red-600 group-hover:from-rose-700 group-hover:to-red-700 text-white text-xs font-black shadow-xs transition-all">
        Upgrade <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
      </span>
    </Link>
  );
}

export default function TopNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState({ name: 'Saifuddin', email: 'saif@example.com' });
  const [planLimits, setPlanLimits] = useState({ isPaid: true, isExpired: false });

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);
    setPlanLimits(getUserPlanLimits(activeUser));
  }, [pathname]);

  const getBreadcrumb = () => {
    if (pathname === '/' || pathname === '/dashboard') return isAdminUser ? 'Mission Control & System Operations' : 'Dashboard';
    if (pathname === '/admin') return 'Super Admin Control Center';
    if (pathname === '/publisher') return 'Create & Publish';
    if (pathname === '/posts') return 'Content Library';
    if (pathname === '/calendar') return 'Content Calendar';
    if (pathname === '/accounts') return 'Social Channels Directory';
    if (pathname === '/inbox') return 'Unified Inbox';
    if (pathname === '/comments') return 'Comments Manager';
    if (pathname === '/analytics') return 'Performance Analytics';
    if (pathname === '/media') return 'Media Assets';
    if (pathname === '/templates') return 'Post Templates';
    if (pathname === '/rules') return 'Automation Rules';
    if (pathname === '/webhook-logs') return 'Webhook Activity';
    if (pathname === '/team') return 'Team & Access';
    if (pathname === '/billing') return 'Subscription & Plans';
    if (pathname === '/settings') return 'Workspace Settings';
    return 'Dashboard';
  };

  const isAdminUser = Boolean(
    user.role === 'admin' || 
    (user.email && (user.email.includes("ansari") || user.email.includes("saif") || user.email.includes("admin")))
  );

  const isTrialUser = !isAdminUser && !planLimits.isPaid;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 lg:px-8 backdrop-blur-md transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)] font-sans">
      
      {/* Left Breadcrumb & Status */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-slate-950 tracking-tight shrink-0">
          {getBreadcrumb()}
        </h1>

        {isAdminUser ? (
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/90 text-indigo-950 border border-indigo-200/90 text-[11px] font-bold tracking-wide shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-indigo-700 font-black">ROOT ADMIN</span>
            <span className="text-slate-500 font-semibold">| 99.98% Live</span>
          </div>
        ) : isTrialUser ? (
          <div className="hidden md:block">
            <TrialCountdownPill user={user} />
          </div>
        ) : (
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/90 text-[11px] font-semibold tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Meta API Active
          </div>
        )}
      </div>

      {/* Center Search / Mobile Trial Banner */}
      <div className="flex-1 max-w-md mx-4 hidden md:flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/90 px-3.5 py-2 text-xs text-slate-600 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-2xs">
        <div className="flex items-center gap-2.5 flex-1">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={isAdminUser ? "Search tenants, accounts, transactions..." : "Search posts, channels, or rules..."}
            className="w-full border-none bg-transparent text-xs text-slate-900 font-medium outline-none placeholder:text-slate-400 focus:ring-0"
          />
        </div>
        <kbd className="hidden lg:inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-white border border-slate-200 shadow-2xs">
          ⌘K
        </kbd>
      </div>

      {/* Right Actions & User Profile */}
      <div className="flex items-center gap-3">
        
        {/* Visible Trial Pill for smaller screens if trial user */}
        {isTrialUser && (
          <div className="md:hidden">
            <TrialCountdownPill user={user} />
          </div>
        )}

        {isAdminUser && (
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 text-xs font-bold text-indigo-700 transition-all no-underline shadow-2xs"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Manage Tenants</span>
          </Link>
        )}

        {/* + Create Post Button */}
        <Link
          href="/publisher"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-xs shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all no-underline cursor-pointer active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>New Post</span>
        </Link>

        {/* Notifications */}
        <button 
          className="relative rounded-xl border border-slate-200/90 bg-white p-2 text-slate-600 hover:text-slate-950 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </button>

        {/* User Profile Avatar */}
        <Link 
          href="/profile" 
          className="flex items-center gap-2.5 pl-3 border-l border-slate-200/90 no-underline group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-xs group-hover:ring-2 group-hover:ring-indigo-300 transition-all">
            {user.name ? user.name.slice(0, 2).toUpperCase() : "SA"}
          </div>
          <div className="hidden lg:block text-left">
            <span className="block text-xs font-bold text-slate-900 leading-snug truncate max-w-[120px] group-hover:text-indigo-600 transition-colors">
              {user.name || "Saif Ansari"}
            </span>
            <span className="block text-[10.5px] text-slate-500 font-medium truncate max-w-[120px]">
              {isAdminUser ? "Super Administrator" : (planLimits.planTitle || "5-Day Trial")}
            </span>
          </div>
        </Link>
      </div>

    </header>
  );
}
