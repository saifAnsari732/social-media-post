"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LogOut, 
  User, 
  Mail, 
  ShieldCheck, 
  Building, 
  Calendar, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  KeyRound, 
  CreditCard,
  ArrowRight,
  Sparkles,
  Edit3
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { PlatformIcon } from "@/components/ui/SocialIcons";

import { getStoredUser } from "@/lib/user";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [connectedCount, setConnectedCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const activeUser = getStoredUser();
    const initials = activeUser.name ? activeUser.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "SA";
    setUser({ ...activeUser, initials });

    // Load account count
    fetch("/api/accounts", { headers: { "x-user-id": activeUser.userId } })
      .then(res => res.json())
      .then(data => {
        if (data.accounts) setConnectedCount(data.accounts.length);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("socialflow_user");
    localStorage.removeItem("yt_user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-7 py-2 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-950 tracking-tight">Account Profile</h1>
          <p className="text-xs lg:text-sm text-slate-600 mt-1 font-normal">
            Manage your personal profile, credentials, and active sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-all shadow-2xs no-underline"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {/* Cover Banner */}
        <div className="h-28 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
          <div className="absolute right-4 top-4">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
              Pro Workspace Member
            </span>
          </div>
        </div>

        {/* Profile Info Header Bar (Clean layout with proper spacing and NO overlap) */}
        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-slate-100">
            {/* Avatar & Details */}
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-2xl font-extrabold text-white shadow-md ring-4 ring-indigo-50">
                {user.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-950">{user.name || "Saif Ansari"}</h2>
                  <span className="p-0.5 rounded-full bg-indigo-50 text-indigo-600" title="Verified Creator">
                    <CheckCircle2 className="w-4 h-4 fill-indigo-600 text-white" />
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 mt-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{user.email || "saif@me.com"}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Account
              </span>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Workspace Role
              </span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-slate-900 capitalize">{user.role || "Administrator"}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Subscription Plan
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-900">{user.plan || "Starter"}</span>
                </div>
                <Link href="/billing" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 no-underline">
                  Change
                </Link>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Active Studio
              </span>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-slate-900 truncate">{user.name ? `${user.name}'s Studio` : 'Main Studio'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Connected Channels
              </span>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-slate-900">{connectedCount} Channels Linked</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Connected Accounts Quick Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-950">Linked Social Accounts</h3>
            <p className="text-xs text-slate-500 mt-0.5">Channels configured for AI publishing and monitoring</p>
          </div>
          <Link 
            href="/accounts" 
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 no-underline"
          >
            Manage Channels <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          {["instagram", "facebook", "youtube"].map((platform) => (
            <div key={platform} className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
              <PlatformIcon platform={platform} className="w-5 h-5" />
              <span className="capitalize">{platform} Connected</span>
            </div>
          ))}
        </div>
      </div>

      {/* Session & Security Management */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-950">Security & Active Sessions</h3>
          <p className="text-xs text-slate-500 mt-0.5">Control where your account is currently signed in</p>
        </div>

        {/* Current Device Session Item */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-200">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
              <Laptop className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-950">Current Browser Session</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  This Device
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Windows PC • Chrome Browser • Active Now</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </div>

    </div>
  );
}
