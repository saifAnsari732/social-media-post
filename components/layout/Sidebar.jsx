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
  Settings 
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
    <div className="w-64 bg-white border-r border-[#E2E8F0] h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center shadow-md">
             <Zap className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-[#0F172A] tracking-tight">AutoReply Pro</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-[#7C3AED]/10 text-[#7C3AED]' 
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-[#7C3AED]' : 'text-[#64748B]'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#0F172A] truncate">Saif Ansari</p>
            <p className="text-xs text-[#64748B] truncate">saif@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
