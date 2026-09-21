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
  PlusCircle
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
        { name: 'Super Admin', href: '/admin', icon: ShieldCheck }
      ]
    }
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen z-40 border-r border-slate-200 bg-white text-slate-900 shadow-sm flex flex-col justify-between transition-all duration-300 ${
      collapsed ? "w-20" : "w-64"
    }`}>
      <div className="flex flex-col h-full min-h-0">
        
        {/* Header & Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <Link href="/" className="flex items-center gap-3 no-underline overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Sparkles className="h-5 w-5" />
            </div>
            {!collapsed && (
              <span className="text-lg font-black tracking-tight text-slate-900">SocialFlow</span>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all hidden md:flex cursor-pointer"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace Card */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-slate-100 shrink-0 bg-slate-50/50">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 shadow-2xs">
              <div className="flex items-center gap-2 truncate">
                <Building className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">{user.name ? `${user.name}'s Studio` : 'Saif Studio'}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 block mb-1.5">
                  {group.title}
                </span>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all no-underline ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-extrabold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold'
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 space-y-2 border-t border-slate-100 bg-slate-50/80 shrink-0">
          {!collapsed && (
            <Link
              href="/billing"
              className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-extrabold text-indigo-700 hover:bg-indigo-100 transition-all no-underline"
            >
              <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-indigo-600" /> Upgrade Plan</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
            </Link>
          )}

          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <Link href="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 no-underline">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-extrabold text-xs text-white shadow-2xs">
                {user.initials}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                  <p className="truncate text-[10px] font-medium text-slate-500">{user.email}</p>
                </div>
              )}
            </Link>

            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </aside>
  );
}
