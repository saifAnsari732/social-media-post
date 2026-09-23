"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Sparkles, Check, ArrowRight, ShieldAlert, Zap, Globe, Layers } from "lucide-react";
import { getStoredUser, getUserPlanLimits } from "@/lib/user";

export default function TrialPaywallModal() {
  const pathname = usePathname();
  const [isExpired, setIsExpired] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Exclude billing, login, landing, and signup pages from paywall modal
    if (
      pathname.includes("/billing") || 
      pathname.includes("/login") || 
      pathname.includes("/landing") ||
      pathname === "/" ||
      pathname.includes("/signup")
    ) {
      setIsExpired(false);
      return;
    }

    const activeUser = getStoredUser();
    setUser(activeUser);
    const limits = getUserPlanLimits(activeUser);
    setIsExpired(Boolean(limits.isExpired));
  }, [pathname]);

  if (!isExpired) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        
        {/* Top Decorative Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600" />

        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-md shadow-rose-500/10">
          <Lock className="w-8 h-8 stroke-[2.5]" />
        </div>

        {/* Headline & Notice */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>5-Day Free Trial Ended</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Unlock Full Access with a Plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium leading-relaxed">
            Your 5-Day Free Trial period has completed. All features (multi-channel posting, channel connections, AI assistant, and automations) are now locked. Choose a plan to instantly resume.
          </p>
        </div>

        {/* Plan Cards Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          
          {/* Starter */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Starter</h4>
            <div className="text-lg font-black text-slate-950">₹999<span className="text-[10px] text-slate-500 font-normal">/mo</span></div>
            <ul className="text-[11px] text-slate-600 space-y-1 font-medium">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> 3 Social Accounts</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Multi-post publish</li>
            </ul>
          </div>

          {/* Growth (Recommended) */}
          <div className="rounded-2xl border-2 border-indigo-600 bg-indigo-50/50 p-4 space-y-2 relative shadow-xs">
            <span className="absolute -top-2.5 right-3 bg-indigo-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
              Most Popular
            </span>
            <h4 className="font-bold text-indigo-950 text-xs">Growth</h4>
            <div className="text-lg font-black text-slate-950">₹1,999<span className="text-[10px] text-slate-500 font-normal">/mo</span></div>
            <ul className="text-[11px] text-slate-700 space-y-1 font-medium">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> 6 Social Accounts</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-indigo-600" /> Smart AI Assistant</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-indigo-600" /> Unified Inbox</li>
            </ul>
          </div>

          {/* Pro Unlimited */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Pro Unlimited</h4>
            <div className="text-lg font-black text-slate-950">₹3,999<span className="text-[10px] text-slate-500 font-normal">/mo</span></div>
            <ul className="text-[11px] text-slate-600 space-y-1 font-medium">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Unlimited Channels</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Auto-Reply Bot Rules</li>
            </ul>
          </div>
        </div>

        {/* Promo Code Strip */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-center gap-2">
          <span>🎁 Launch Discount: Use coupon</span>
          <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-black tracking-wider uppercase">WELCOME50</span>
          <span>for 50% OFF your first month!</span>
        </div>

        {/* Action Button */}
        <div className="space-y-2.5 pt-2">
          <Link
            href="/billing"
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 no-underline active:scale-[0.99] cursor-pointer"
          >
            <span>Choose Plan & Reactivate Workspace</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <p className="text-[11px] text-slate-400 font-normal">
            Need custom enterprise limits or trial extension? Contact support at support@postfly.in
          </p>
        </div>

      </div>
    </div>
  );
}
