"use client";

import { useState, useEffect } from 'react';
import { Bell, Search, Plus, Sparkles, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState({ name: 'Saifuddin', email: 'saif@example.com' });

  useEffect(() => {
    const userStr = localStorage.getItem("yt_user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const getBreadcrumb = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/publisher') return 'Publish Post';
    if (pathname === '/posts') return 'Content Posts';
    if (pathname === '/calendar') return 'Content Calendar';
    if (pathname === '/accounts') return 'Social Channels';
    if (pathname === '/inbox') return 'Inbox & Messages';
    if (pathname === '/comments') return 'Comments';
    if (pathname === '/analytics') return 'Analytics';
    if (pathname === '/media') return 'Media Library';
    if (pathname === '/templates') return 'Templates';
    if (pathname === '/rules') return 'Automation Rules';
    if (pathname === '/webhook-logs') return 'Webhook Logs';
    if (pathname === '/team') return 'Team & Members';
    if (pathname === '/billing') return 'Billing & Upgrade';
    if (pathname === '/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md">
      
      {/* Breadcrumb / Page Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
          {getBreadcrumb()}
        </h2>
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3 h-3" /> Meta API Sync
        </span>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex max-w-md flex-1 items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2 shadow-inner focus-within:border-violet-500 focus-within:bg-white transition-all mx-6">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search channels, posts, or automation rules... (⌘K)"
          className="w-full border-none bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Right Actions & User Profile */}
      <div className="flex items-center gap-3">
        
        {/* + Create Post Button */}
        <Link
          href="/publisher"
          className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-all no-underline"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Post</span>
        </Link>

        {/* Notifications */}
        <button 
          className="relative rounded-xl border border-slate-200/80 bg-white p-2 text-slate-600 hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* User Profile Avatar */}
        <Link 
          href="/profile" 
          className="flex items-center gap-2.5 pl-2 border-l border-slate-200/80 no-underline"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
            {user.name ? user.name.slice(0, 2).toUpperCase() : "SA"}
          </div>
          <div className="hidden lg:block text-left">
            <span className="block text-xs font-bold text-slate-900 leading-tight truncate max-w-[100px]">
              {user.name || "Saifuddin"}
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">Pro Admin</span>
          </div>
        </Link>
      </div>

    </header>
  );
}
