"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SaaSLandingPage from "./landing/page";
import { LayoutDashboard, ArrowRight } from "lucide-react";

export default function RootHomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("yt_user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="relative">
      {/* Top Session Bar if logged in */}
      {user && (
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white py-2.5 px-4 text-center text-xs font-bold flex items-center justify-center gap-3 shadow-md relative z-50">
          <span>Welcome back, <strong>{user.name}</strong>! You are currently logged in.</span>
          <Link
            href="/publisher"
            className="px-3 py-1 rounded-lg bg-white text-[#0F172A] hover:bg-white/90 font-extrabold flex items-center gap-1 no-underline transition-all shadow-sm"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Go to Dashboard <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Render Public SaaS Landing Page */}
      <SaaSLandingPage />
    </div>
  );
}
