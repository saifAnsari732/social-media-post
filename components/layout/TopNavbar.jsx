"use client";

import { Bell, Search, Plus, Rocket } from 'lucide-react';

export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-xl">
      <div className="flex max-w-xl flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 shadow-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search campaigns, accounts, or replies..."
          className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-600">
          <Rocket className="h-4 w-4" />
          Launch Sprint
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800">
          <Plus className="h-4 w-4" />
          New Post
        </button>
        <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-violet-200 hover:text-violet-600">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
