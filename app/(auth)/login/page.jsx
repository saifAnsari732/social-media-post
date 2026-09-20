"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, MessageSquare, CheckCircle2 } from "lucide-react";

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
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Hero Section (SaaS Branding) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#7C3AED] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#DB2777]/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#DB2777] shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">SocialFlow</span>
                <span className="block text-[10px] font-bold text-[#A78BFA] uppercase tracking-widest">SaaS Pro Suite</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Automate your Social Media & DMs with AI
            </h1>
            <p className="text-[#C7D2FE] text-sm leading-relaxed mb-8">
              Connect your Meta, Instagram, Facebook & YouTube pages. Publish content and auto-reply to comments & DMs seamlessly.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              {[
                { title: "One-Click Multi-Publishing", desc: "Post to Facebook, Instagram, YouTube & Twitter at once" },
                { title: "Gemini 3.5 AI Copilot", desc: "Instant title, caption & hashtag generation" },
                { title: "Automated DMs & Comments", desc: "Set trigger rules to auto-reply to customers 24/7" }
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-[#A78BFA] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{f.title}</h4>
                    <p className="text-[11px] text-[#C7D2FE]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-[#94A3B8]">
            <ShieldCheck className="w-4 h-4 text-[#A78BFA]" /> Meta Official Graph API Compliant
          </div>
        </div>

        {/* Right Form Section (Super Clean & Easy) */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2">Get Started in Seconds 👋</h2>
              <p className="text-sm text-[#64748B]">Enter your details below to access your SaaS dashboard instantly. No password required.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Saifuddin Ansari"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#94A3B8] font-medium focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#94A3B8] font-medium focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                  required
                />
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs font-medium text-[#DC2626]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 transform active:scale-98"
              >
                {loading ? "Accessing Dashboard..." : (
                  <>
                    Continue to SaaS Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-[#F1F5F9] pt-6">
              <p className="text-xs text-[#94A3B8]">
                🔒 100% Private & Encrypted. Your accounts remain isolated to your session.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
