"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, User, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
      
      localStorage.setItem("yt_user", JSON.stringify({ userId, name: n, email: em }));
      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        
        {/* Left Hero Section */}
        <div className="lg:col-span-6 bg-slate-50/80 p-8 lg:p-12 text-slate-900 flex flex-col justify-between border-r border-slate-200/80">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">SocialFlow</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 leading-snug mb-3">
              Manage Every Social Channel From One Workspace
            </h1>
            <p className="text-slate-500 text-xs leading-relaxed mb-8 font-normal">
              Connect Meta, Instagram, Facebook, YouTube, LinkedIn & X. Publish content and automate replies effortlessly.
            </p>

            {/* Feature List */}
            <div className="space-y-3">
              {[
                "Multi-Platform Unified Publisher",
                "Automated DM & Comment Reply Engine",
                "Meta Graph API & YouTube Official Integration"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/80 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Official Graph API & OAuth Compliant
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Sign in to your account 👋</h2>
              <p className="text-xs text-slate-500 font-normal">Enter your details to access your SaaS workspace.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Saifuddin Ansari"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
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
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 transform active:scale-98"
              >
                {loading ? "Signing in..." : (
                  <>
                    Continue to Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-center text-slate-400 mt-6 pt-4 border-t border-slate-100 font-normal">
              🔒 100% Encrypted & Private per workspace.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
