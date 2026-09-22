"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlatformIcon } from "@/components/ui/SocialIcons";
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Mail, 
  Layers, 
  Globe, 
  Lock, 
  Send,
  Zap,
  Users
} from "lucide-react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("yt_user") || localStorage.getItem("socialflow_user");
    if (userStr) {
      router.replace("/");
    }
  }, [router]);

  async function generateUserId(email) {
    const data = new TextEncoder().encode(email.toLowerCase().trim());
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
  }

  async function handleLogin(e) {
    e.preventDefault();
    const n = name.trim(), em = email.trim().toLowerCase();
    if (!n || !em) { setError("Please enter your name and email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setError("Please enter a valid email address."); return; }
    setLoading(true); setError("");
    try {
      const userId = await generateUserId(em);
      
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: n, email: em })
      });
      
      if (!res.ok) throw new Error("Login failed on server");
      
      const userData = { userId, name: n, email: em };
      localStorage.setItem("yt_user", JSON.stringify(userData));
      localStorage.setItem("socialflow_user", JSON.stringify(userData));
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 lg:p-8 font-sans relative overflow-hidden">
      
      {/* Top Navigation Bar with Back Button */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between z-10 py-2">
        <Link 
          href="/landing" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:border-slate-300 font-bold text-xs shadow-2xs transition-all no-underline"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" /> Back to Home
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-500">Official Graph API Gateway</span>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="w-full max-w-5xl mx-auto my-auto bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10">
        
        {/* Left Professional Brand Section */}
        <div className="lg:col-span-6 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">Postfly</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-snug mb-3">
              Manage Every Social Channel From One Workspace
            </h1>
            <p className="text-indigo-200 text-xs leading-relaxed mb-8 font-normal">
              Publish content, schedule posts across 7 major networks, and automate audience engagement with enterprise reliability.
            </p>

            {/* Connected Platform Icons */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs mb-8 space-y-3">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Supported Channels:</span>
              <div className="flex flex-wrap items-center gap-2">
                {["Instagram", "Facebook", "LinkedIn", "YouTube", "Twitter", "Threads", "Pinterest"].map((plat) => (
                  <span key={plat} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    <PlatformIcon platform={plat} className="w-4 h-4" />
                  </span>
                ))}
              </div>
            </div>

            {/* Feature Bullet points */}
            <div className="space-y-3">
              {[
                "Multi-Platform Unified Post Publisher",
                "Automated DM & Comment Response Rules",
                "Official Meta Graph & YouTube API OAuth Compliance"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-indigo-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-300 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Enterprise SSL Security
            </span>
            <span>v2.5 Production</span>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full space-y-6">
            
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Welcome Back 👋</h2>
              <p className="text-xs text-slate-500 font-normal">Enter your details to sign in or create your workspace.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Saifuddin Ansari"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
              >
                {loading ? "Accessing Workspace..." : (
                  <>
                    Continue to Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-center text-slate-400 pt-4 border-t border-slate-100 font-normal">
              🔒 100% Encrypted & Private per workspace.
            </p>

          </div>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-slate-400 font-medium py-2">
        © 2026 SocialFlow Inc. All rights reserved.
      </div>
    </div>
  );
}
