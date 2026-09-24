"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getStoredUser, setStoredUser, getUserPlanLimits } from '@/lib/user';
import {
  LayoutDashboard,
  Link2,
  Zap,
  MessageCircle,
  MessageSquareQuote,
  BarChart3,
  FileTerminal,
  Settings,
  Layers,
  LayoutGrid,
  CreditCard,
  Calendar as CalendarIcon,
  Folder,
  FileCode,
  Users,
  ChevronRight,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Building,
  ShieldCheck,
  PlusCircle,
  AlertTriangle,
  Activity,
  DollarSign,
  Key,
  Tag
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState({ name: 'Saif Ansari', email: 'saif@me.com', initials: 'SA' });
  const [collapsed, setCollapsed] = useState(false);
  const [limits, setLimits] = useState({ isExpired: false, planTitle: '5-Day Trial' });
  const [viewMode, setViewMode] = useState("admin");

  useEffect(() => {
    const syncUser = () => {
      const u = getStoredUser();
      const initials = u.name ? u.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "SA";
      setUser({ ...u, initials });
      setLimits(getUserPlanLimits(u));
    };

    syncUser();

    const savedMode = localStorage.getItem("postfly_view_mode");
    if (savedMode) setViewMode(savedMode);

    // Fetch live plan status from DB to ensure local storage isn't stale
    const currentUser = getStoredUser();
    if (currentUser?.userId) {
      fetch("/api/billing/status", { headers: { "x-user-id": currentUser.userId } })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.currentPlan) {
            const updated = { ...currentUser, plan: data.currentPlan, isPaid: Boolean(data.isPaid) };
            setStoredUser(updated);
            const initials = updated.name ? updated.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "SA";
            setUser({ ...updated, initials });
            setLimits(getUserPlanLimits(updated));
          }
        })
        .catch(() => {});
    }

    window.addEventListener("user-updated", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("user-updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("socialflow_user");
    localStorage.removeItem("yt_user");
    window.location.href = "/login";
  };

  const navGroups = [
    {
      title: "Main",
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: "Content Studio",
      items: [
        { name: 'Posts', href: '/posts', icon: LayoutGrid },
        { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
        { name: 'Create Post', href: '/publisher', icon: PlusCircle }
      ]
    },
    {
      title: "Social Channels",
      items: [
        { name: 'Channels', href: '/accounts', icon: Link2 },
        { name: 'Social Inbox', href: '/inbox', icon: MessageCircle },
        { name: 'Comments', href: '/comments', icon: MessageSquareQuote }
      ]
    },
    {
      title: "Performance",
      items: [
        { name: 'Analytics', href: '/analytics', icon: BarChart3 }
      ]
    },
    {
      title: "Management",
      items: [
        { name: 'Automation Rules', href: '/rules', icon: Zap },
        { name: 'Media Library', href: '/media', icon: Folder },
        { name: 'Templates', href: '/templates', icon: FileCode },
        { name: 'Team Members', href: '/team', icon: Users },
        { name: 'Super Admin', href: '/admin', icon: ShieldCheck, adminOnly: true }
      ]
    }
  ];

  const adminNavGroups = [
    {
      title: "Admin Command",
      items: [
        { name: 'Mission Control', href: '/dashboard', icon: LayoutDashboard },
        { name: 'All Tenants & Users', href: '/tenants', icon: Users }
      ]
    },
    {
      title: "Promotions & Revenue",
      items: [
        { name: 'Discount Coupons', href: '/coupons', icon: Tag },
        { name: 'Revenue & MRR', href: '/revenue', icon: DollarSign },
        { name: 'Billing Ledger', href: '/ledger', icon: CreditCard }
      ]
    },
    {
      title: "System & Channels",
      items: [
        { name: 'Connected Channels', href: '/accounts', icon: Link2 },
        { name: 'Platform Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Automation Rules', href: '/rules', icon: Zap }
      ]
    }
  ];

  const isAdminUser = Boolean(
    user.role === 'admin' || 
    (user.email && (user.email.includes("ansari") || user.email.includes("saif") || user.email.includes("admin")))
  );

  const activeNav = isAdminUser ? adminNavGroups : navGroups;

  return (
    <aside className={`fixed left-0 top-0 h-screen z-40 border-r border-slate-200 bg-white text-slate-900 shadow-sm flex flex-col justify-between transition-all duration-250 ease-in-out ${
      collapsed ? "w-[76px]" : "w-[275px]"
    }`}>
      <div className="flex flex-col h-full min-h-0">
        
        {/* Header & Logo */}
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-white">
          <Link href="/dashboard" className="flex items-center gap-3 no-underline overflow-hidden group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200/90 p-1 shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/postflyLOGO.png" alt="Postfly" className="w-full h-full object-contain" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-[17px] font-extrabold tracking-tight text-slate-950 leading-none">Postfly</span>
                <span className={`text-[11px] font-semibold mt-1 uppercase tracking-wider ${isAdminUser ? 'text-indigo-600 font-black' : 'text-slate-500'}`}>
                  {isAdminUser ? "System Console" : "SaaS Platform"}
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all hidden md:flex cursor-pointer"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4 stroke-[2.5]" /> : <ChevronLeft className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </div>

        {/* Workspace & Plan Badge Switcher */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-slate-200/80 shrink-0 bg-slate-50/70 space-y-2">
            {isAdminUser ? (
              <div className="p-3.5 rounded-2xl border border-indigo-200/90 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 text-slate-900 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-black tracking-wide block text-slate-950 truncate">SUPER ADMIN</span>
                      <span className="text-[10.5px] text-emerald-700 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Root Privileges
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-indigo-100 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Full System Access
                  </span>
                  <span className="font-mono text-[10px] text-indigo-600 font-bold">v2.4 Live</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer shadow-2xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <Building className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="truncate text-[13.5px] font-bold text-slate-900">{user.name ? `${user.name}'s Studio` : 'Main Studio'}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-600 shrink-0 stroke-[2.5]" />
                </div>

                {/* Plan Badge Display */}
                <Link href="/billing" className="no-underline block">
                  <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all shadow-xs ${
                    limits.isExpired 
                      ? "bg-rose-950 border-2 border-rose-500 text-rose-200 animate-pulse shadow-rose-950/40" 
                      : "bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-700 text-indigo-200 hover:border-indigo-400"
                  }`}>
                    <span className="flex items-center gap-2 truncate">
                      {limits.isExpired ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                      ) : (
                        <CreditCard className="w-4 h-4 text-indigo-400 shrink-0" />
                      )}
                      <span className="truncate font-black text-[11.5px]">
                        {limits.isExpired ? "TRIAL EXPIRED (LOCKED)" : limits.planTitle}
                      </span>
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ml-1 ${
                      limits.isExpired ? "bg-amber-400 text-slate-950" : "bg-indigo-600 text-white"
                    }`}>
                      {limits.isExpired ? "Buy Plan →" : "Manage"}
                    </span>
                  </div>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 custom-scrollbar">
          {activeNav.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <span className="text-[11.5px] font-extrabold text-slate-500 uppercase tracking-wider px-3 block mb-1.5">
                  {group.title}
                </span>
              )}
              {group.items
                .filter(item => !item.adminOnly || isAdminUser)
                .map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[14px] transition-all no-underline ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600 shadow-2xs'
                          : 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-semibold'
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-indigo-600 stroke-[2.5]' : 'text-slate-700 stroke-[2]'}`} />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-3.5 space-y-2.5 border-t border-slate-200 bg-slate-50/80 shrink-0">
          {!collapsed && (
            isAdminUser ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-900">System Telemetry</span>
                </div>
                <span className="text-[10.5px] font-mono text-emerald-700 font-black">99.98% LIVE</span>
              </div>
            ) : (
              <Link
                href="/billing"
                className={`flex items-center justify-between p-2.5 rounded-xl text-white font-bold text-[13px] shadow-xs transition-all no-underline group ${
                  limits.isExpired ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
                }`}
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 stroke-[2.5]" />
                  <span>{limits.isExpired ? "Purchase Plan Now" : "Upgrade Plan"}</span>
                </span>
                <ChevronRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )
          )}

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-300 shadow-2xs">
            <Link href="/profile" className="flex items-center gap-3 min-w-0 flex-1 no-underline group">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 font-extrabold text-[13px] text-white shadow-2xs">
                {user.initials}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-slate-950 leading-tight group-hover:text-indigo-600 transition-colors">{user.name}</p>
                  <p className="truncate text-[11px] text-slate-600 font-medium">
                    {isAdminUser ? "Super Administrator" : user.email}
                  </p>
                </div>
              )}
            </Link>

            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer ml-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4 stroke-[2.2]" />
              </button>
            )}
          </div>
        </div>

      </div>
    </aside>
  );
}
