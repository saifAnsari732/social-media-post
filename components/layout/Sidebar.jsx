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
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Publisher', href: '/publisher', icon: Link2 },
  { name: 'Connected Accounts', href: '/accounts', icon: Link2 },
  { name: 'Automation Rules', href: '/rules', icon: Zap },
  { name: 'Inbox (DMs)', href: '/inbox', icon: MessageCircle },
  { name: 'Comments', href: '/comments', icon: MessageSquareQuote },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Webhook Logs', href: '/webhook-logs', icon: FileTerminal },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [user, setUser] = useState({ name: 'User', email: 'user@example.com', initials: 'U' });

  useEffect(() => {
    const userStr = localStorage.getItem("yt_user");
    if (userStr) {
      const u = JSON.parse(userStr);
      const initials = u.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
      setUser({ ...u, initials });
    }
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 border-r border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#E2E8F0]">
          <Link href="/" className="flex items-center gap-3 group no-underline">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#DB2777] shadow-md group-hover:shadow-lg transition-all">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-[#0F172A]">SocialFlow</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[#7C3AED]">Pro Suite</div>
            </div>
          </Link>
        </div>

        <nav className="space-y-1.5 px-4 py-6 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all no-underline ${
                  isActive
                    ? 'bg-[#F3E8FF] text-[#7C3AED]'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-[#7C3AED]' : 'text-[#94A3B8]'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#E2E8F0] p-4 bg-[#F8FAFC]">
        <Link href="/profile" className="flex items-center gap-3 rounded-xl bg-white p-3 border border-[#E2E8F0] shadow-sm transition hover:shadow-md hover:border-[#CBD5E1] no-underline">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#DB2777] font-bold text-sm text-white shadow-sm">
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#0F172A]">{user.name}</p>
            <p className="truncate text-[11px] font-medium text-[#64748B]">{user.email}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
