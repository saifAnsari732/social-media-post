"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Link2,
  Zap,
  MessageCircle,
  MessageSquareQuote,
  BarChart3,
  FileTerminal,
  Settings,
  Sparkles,
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
  HelpCircle
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState({ name: 'User', email: 'user@example.com', initials: 'U' });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("yt_user");
    if (userStr) {
      const u = JSON.parse(userStr);
      const initials = u.name ? u.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "SA";
      setUser({ ...u, initials });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("yt_user");
    window.location.href = "/login";
  };

  const navGroups = [
    {
      title: "Main",
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard }
      ]
    },
    {
      title: "Content",
      items: [
        { name: 'Posts', href: '/posts', icon: LayoutGrid },
        { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
        { name: 'Create Post', href: '/publisher', icon: PlusCircle }
      ]
    },
    {
      title: "Social",
      items: [
        { name: 'Channels', href: '/accounts', icon: Link2 },
        { name: 'Inbox', href: '/inbox', icon: MessageCircle },
        { name: 'Comments', href: '/comments', icon: MessageSquareQuote }
      ]
    },
    {
      title: "Analytics",
      items: [
        { name: 'Overview', href: '/analytics', icon: BarChart3 }
      ]
    },
    {
      title: "Management",
      items: [
        { name: 'Automation Rules', href: '/rules', icon: Zap },
        { name: 'Media Library', href: '/media', icon: Folder },
        { name: 'Templates', href: '/templates', icon: FileCode },
        { name: 'Team', href: '/team', icon: Users },
        { name: 'Admin Center', href: '/admin', icon: ShieldCheck }
      ]
    }
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen z-40 border-r border-[#E5E7EB] bg-white text-[#111827] shadow-xs flex flex-col justify-between transition-all duration-300 ${
      collapsed ? "w-20" : "w-64"
    }`}>
      <div>
        {/* Brand & Collapse Toggle */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <Link href="/" className="flex items-center gap-2.5 group no-underline overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#4F46E5] text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold tracking-tight text-[#111827]">SocialFlow</span>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100 transition-all hidden md:flex"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace Selector */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-[#E5E7EB]">
            <button className="w-full flex items-center justify-between p-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs font-bold text-[#111827] hover:bg-slate-100 transition-all">
              <div className="flex items-center gap-2 truncate">
                <Building className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <span className="truncate">Saif Studio (Workspace)</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            </button>
          </div>
        )}

        {/* Grouped Navigation */}
        <nav className="space-y-4 px-3 py-4 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider px-3 block mb-1">
                  {group.title}
                </span>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all no-underline ${
                      isActive
                        ? 'bg-indigo-50 text-[#4F46E5] border border-indigo-100'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827]'
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#4F46E5]' : 'text-[#94A3B8]'}`} />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 space-y-2 border-t border-[#E5E7EB] bg-[#F8FAFC]">
        {!collapsed && (
          <Link
            href="/billing"
            className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-[#4F46E5] hover:bg-indigo-100/70 transition-all no-underline"
          >
            <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Upgrade Plan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}

        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
          <Link href="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 no-underline">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] font-bold text-xs text-white shadow-xs">
              {user.initials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-[#111827] leading-tight">{user.name}</p>
                <p className="truncate text-[10px] font-medium text-[#64748B]">{user.email}</p>
              </div>
            )}
          </Link>

          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
