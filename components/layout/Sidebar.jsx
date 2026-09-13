"use client";

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

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 border-r border-slate-200/80 bg-slate-950 text-slate-100 shadow-2xl shadow-slate-900/20">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 shadow-lg shadow-violet-500/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight">SocialFlow</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Pro Suite</div>
          </div>
        </Link>
      </div>

      <nav className="space-y-2 px-4 py-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-500/15 to-fuchsia-500/10 text-white ring-1 ring-violet-400/30'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`h-4 w-4 ${isActive ? 'text-violet-300' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold text-sm text-white">
            SA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">Saif Ansari</p>
            <p className="truncate text-xs text-slate-400">saif@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
