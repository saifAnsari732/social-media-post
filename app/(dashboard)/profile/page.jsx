"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Mail, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("yt_user");
    if (userStr) {
      const parsed = JSON.parse(userStr);
      const initials = parsed.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
      setUser({ ...parsed, initials });
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("yt_user");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (!user) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Your Profile</h1>
        <p className="text-[#64748B] text-base mt-1">Manage your account details and session.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400"></div>
        
        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-xl ring-4 ring-white">
             <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-3xl font-bold text-white">
               {user.initials}
             </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
            <div className="flex items-center gap-2 text-slate-500 mt-1 font-medium">
              <Mail className="h-4 w-4" />
              {user.email}
            </div>
            
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-200">
              <Shield className="h-3.5 w-3.5" /> Active Account
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
             <div>
               <h3 className="font-bold text-slate-900">Session Management</h3>
               <p className="text-sm text-slate-500 mt-1">Sign out of your account on this device.</p>
             </div>
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 rounded-xl bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 focus:ring-2 focus:ring-rose-500/20"
             >
               <LogOut className="h-4 w-4" />
               Log Out
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
