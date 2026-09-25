"use client";

import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ClientReviewsSlider from "@/components/landing/ClientReviewsSlider";
import { PlatformIcon } from "@/components/ui/SocialIcons";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Send, 
  Zap, 
  MessageCircle, 
  BarChart3, 
  CreditCard, 
  ShieldCheck, 
  Layers, 
  Globe, 
  Bot,
  Play,
  ChevronDown,
  CheckCircle2,
  Calendar,
  Users,
  Folder,
  MessageSquare,
  FileText,
  UserCheck,
  Building,
  Briefcase,
  HelpCircle,
  TrendingUp,
  Heart,
  Eye,
  Clock,
  Mail,
  Shield,
  Star,
  Lock,
  ArrowUpRight,
  Minus,
  X
} from "lucide-react";

export default function SaaSLandingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("socialflow_user") || localStorage.getItem("yt_user");
    if (userStr) {
      setIsLoggedIn(true);
    }
  }, []);

  const socialPlatforms = [
    { name: "Instagram", desc: "Share photos, reels, and stories with automated scheduling.", color: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]" },
    { name: "Facebook", desc: "Manage pages, post updates, and automate comment replies.", color: "bg-[#1877F2]" },
    { name: "LinkedIn", desc: "Publish professional posts, articles, and corporate updates.", color: "bg-[#0A66C2]" },
    { name: "YouTube", desc: "Upload shorts and videos with automated metadata optimization.", color: "bg-[#FF0000]" },
    { name: "X / Twitter", desc: "Post tweets, threads, and schedule updates seamlessly.", color: "bg-slate-900" },
    { name: "Threads", desc: "Engage your community with text and media updates.", color: "bg-black" },
    { name: "Pinterest", desc: "Publish pins and manage visual boards for your brand.", color: "bg-[#E60023]" }
  ];

  const featuresList = [
    { icon: <Send className="w-5 h-5 text-indigo-600" />, title: "1. Multi-Platform Publishing", desc: "Publish content across multiple social networks from one composer." },
    { icon: <Calendar className="w-5 h-5 text-indigo-600" />, title: "2. Social Media Calendar", desc: "Plan and organize your content using a visual calendar." },
    { icon: <Sparkles className="w-5 h-5 text-indigo-600" />, title: "3. AI Caption Assistant", desc: "Generate captions, hashtags and content ideas effortlessly." },
    { icon: <Zap className="w-5 h-5 text-indigo-600" />, title: "4. Post Scheduling", desc: "Schedule posts for specific dates, times, and timezones." },
    { icon: <CheckCircle2 className="w-5 h-5 text-indigo-600" />, title: "5. Content Approval", desc: "Review and approve content with team members before publishing." },
    { icon: <BarChart3 className="w-5 h-5 text-indigo-600" />, title: "6. Analytics & Reporting", desc: "Track reach, engagement, followers and content performance." },
    { icon: <Users className="w-5 h-5 text-indigo-600" />, title: "7. Team Collaboration", desc: "Invite team members and manage roles and permissions." },
    { icon: <Folder className="w-5 h-5 text-indigo-600" />, title: "8. Media Library", desc: "Store, organize and reuse images, videos and documents." },
    { icon: <MessageSquare className="w-5 h-5 text-indigo-600" />, title: "9. Social Inbox", desc: "Manage comments and direct messages from supported platforms." },
    { icon: <Bot className="w-5 h-5 text-indigo-600" />, title: "10. Auto Reply Automation", desc: "Create automated responses for comments and messages 24/7." },
    { icon: <Layers className="w-5 h-5 text-indigo-600" />, title: "11. Campaign Management", desc: "Organize content into strategic marketing campaigns." },
    { icon: <Globe className="w-5 h-5 text-indigo-600" />, title: "12. White Label", desc: "Allow agencies to manage clients under their own branding." }
  ];

  const aiFeatures = [
    "AI Caption Generator", "Hashtag Generator", "Content Ideas", "Post Rewriter",
    "Tone Changer", "Shorten Content", "Expand Content", "CTA Generator",
    "Content Repurposing", "Post Suggestions"
  ];

  // ── EXACT 3 USER-SPECIFIED PRICING PLANS ──
  const pricingPlans = [
    {
      id: "starter",
      name: "STARTER",
      tagline: "For solopreneurs & small creators starting out",
      badge: "ENTRY PLAN",
      monthlyPrice: 1999,
      yearlyPrice: 1899,
      accentBg: "bg-slate-50",
      border: "border border-slate-200/90 shadow-2xs hover:shadow-md transition-all",
      btnBg: "bg-slate-900 hover:bg-slate-800 text-white",
      features: [
        "3 Connected Social Accounts",
        "❌ NO AI Support / AI Assistant",
        "50 Scheduled Posts / month",
        "Visual Content Calendar",
        "Multi-Platform Composer",
        "Basic Reach & Engagement Stats",
        "2 GB Cloud Media Library",
        "Standard Email Support"
      ]
    },
    {
      id: "growth",
      name: "GROWTH",
      tagline: "For growing brands, creators & active teams",
      badge: "★ MOST POPULAR",
      popular: true,
      monthlyPrice: 2999,
      yearlyPrice: 2849,
      accentBg: "bg-gradient-to-b from-indigo-50/50 to-white",
      border: "border-2 border-indigo-600 shadow-xl shadow-indigo-600/10 hover:shadow-2xl hover:shadow-indigo-600/15 transition-all relative",
      btnBg: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25",
      features: [
        "6 Connected Social Accounts",
        "✅ Full AI Support & Assistant",
        "500 AI Generator Credits / mo",
        "Unlimited Scheduled Posts",
        "AI Caption & Hashtag Generator",
        "Unified Social Inbox (Comments & DMs)",
        "Advanced Performance Analytics",
        "3 Team Workspaces & Permissions",
        "15 GB Cloud Media Storage",
        "Priority Live Chat Support"
      ]
    },
    {
      id: "pro",
      name: "PRO UNLIMITED",
      tagline: "For power marketers, brands & agencies needing all capabilities",
      badge: "ALL UNLIMITED",
      monthlyPrice: 4999,
      yearlyPrice: 4749,
      accentBg: "bg-slate-50",
      border: "border border-slate-200/90 shadow-2xs hover:border-purple-300 hover:shadow-md transition-all",
      btnBg: "bg-purple-600 hover:bg-purple-700 text-white shadow-xs",
      features: [
        "Unlimited Connected Social Accounts",
        "🎯 Meta Ads Manager & 1-Click Post Booster",
        "✅ Unlimited AI Credits & All AI Tools",
        "Unlimited Scheduled Posts & Queues",
        "Smart Auto-Reply Comment Bot Rules",
        "Full Campaign Management & Tagging",
        "Multi-Client Workspaces & White-Label",
        "Unlimited Team Members & Roles",
        "100 GB Cloud Media Storage",
        "24/7 Dedicated Account Manager"
      ]
    }
  ];

  const comparisonCategories = [
    {
      category: "Publishing & Social Accounts",
      rows: [
        { name: "Connected Social Accounts", starter: "3 Accounts", growth: "6 Accounts", pro: "Unlimited Accounts" },
        { name: "Scheduled Posts / Month", starter: "50 / mo", growth: "Unlimited", pro: "Unlimited" },
        { name: "Visual Content Calendar", starter: "✓", growth: "✓", pro: "✓" },
        { name: "Multi-Channel Post Composer", starter: "✓", growth: "✓", pro: "✓" },
        { name: "Bulk Post Scheduling & Queues", starter: "—", growth: "✓", pro: "✓" },
      ]
    },
    {
      category: "AI & Automation Support",
      rows: [
        { name: "AI Assistant & Content Generation", starter: "— (NO AI)", growth: "✓ Included", pro: "✓ Unlimited AI" },
        { name: "AI Assistant Credits", starter: "0 Credits", growth: "500 / mo", pro: "Unlimited" },
        { name: "AI Caption & Hashtag Generator", starter: "—", growth: "✓", pro: "✓" },
        { name: "Social Inbox (Comments & DMs)", starter: "—", growth: "✓", pro: "✓" },
        { name: "Auto-Reply Comment Bot Rules", starter: "—", growth: "—", pro: "✓" },
      ]
    },
    {
      category: "Analytics & Workspace Features",
      rows: [
        { name: "Performance Analytics & Insights", starter: "Basic", growth: "Advanced", pro: "Advanced + Custom Reports" },
        { name: "Team Workspaces Included", starter: "1 Workspace", growth: "3 Workspaces", pro: "Unlimited Workspaces" },
        { name: "Team Members & Permissions", starter: "1 User", growth: "3 Users", pro: "Unlimited Users" },
        { name: "Media Cloud Storage", starter: "2 GB", growth: "15 GB", pro: "100 GB" },
        { name: "White-Label Branding & API Access", starter: "—", growth: "—", pro: "✓ Full Access" }
      ]
    }
  ];

  const faqs = [
    { q: "Which social platforms are supported by Postfly?", a: "Postfly supports Instagram, Facebook, LinkedIn, YouTube, X / Twitter, Threads, and Pinterest with direct OAuth integration." },
    { q: "Can I schedule posts for future dates and times?", a: "Yes, you can schedule single posts, carousel posts, reels, shorts, and video content for any future date and time across all connected networks." },
    { q: "What is the difference between the ₹1,999, ₹2,999 and ₹4,999 plans?", a: "The Starter plan (₹1,999) includes 3 social accounts with no AI support. The Growth plan (₹2,999) includes 6 accounts with full AI support and 500 credits. The Pro plan (₹4,999) gives you Unlimited accounts, Unlimited AI credits, and multi-workspace features." },
    { q: "Can multiple team members use one account?", a: "Yes! Growth and Pro Unlimited plans include multi-user collaboration with custom permissions, approval workflows, and role assignments." },
    { q: "Does Postfly support marketing agencies and client management?", a: "Yes! Our Pro Unlimited plan offers unlimited client workspaces, white-label PDF analytics reports, custom branding, and client access controls." },
    { q: "How does Razorpay billing work in INR (₹)?", a: "All subscriptions are securely processed via Razorpay in Indian Rupees (INR ₹). We accept UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and Netbanking." },
    { q: "Can I cancel or change my plan anytime?", a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time from your Account Settings with zero hidden cancellation fees." }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput) {
      setSubscribed(true);
      setEmailInput("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center no-underline group">
            <img src="/postflyLOGO.png" alt="Postfly" className="h-10 sm:h-11 w-auto max-w-[190px] object-contain group-hover:scale-105 transition-transform" />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors no-underline">Features</a>
            <a href="#channels" className="hover:text-slate-900 transition-colors no-underline">Social Channels</a>
            <a href="#ai-tools" className="hover:text-slate-900 transition-colors no-underline">AI Tools</a>
            <a href="#reviews" className="hover:text-slate-900 transition-colors no-underline text-emerald-700 font-bold">Client Stories ★</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors no-underline">Pricing</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors no-underline">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all no-underline">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors no-underline px-3 py-2">
                  Sign In
                </Link>
                <Link href="/login" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all no-underline">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── FULL HERO VIDEO DISPLAY WITH BALANCED PADDING ON ALL 4 SIDES ── */}
      <section className="relative w-full p-4 sm:p-6 lg:p-8">
        <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-black">
          <video
            src="/video-hero/hero-video.mp4"
            autoPlay
            muted
            playsInline
            controls
            className="w-full h-auto min-h-[480px] max-h-[88vh] object-cover block rounded-2xl sm:rounded-3xl"
          />
        </div>
      </section>

      {/* ── HIGH-IMPACT LARGE TEXT STATEMENT SECTION ── */}
      <section className="relative py-16 sm:py-24 px-6 max-w-6xl mx-auto text-center">
        
        {/* Top Floating Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-2xs mb-6 hover:bg-indigo-100/70 transition-colors">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
          <span>NEXT-GEN SOCIAL AUTOMATION SUITE</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-semibold">Postfly v2.5</span>
        </div>

        {/* Big Bold Headline */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.08] max-w-5xl mx-auto">
          Publish Once. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Reach Everyone Everywhere.
          </span>
        </h2>

        {/* Large Supporting Subtitle */}
        <p className="mt-6 text-base sm:text-xl lg:text-2xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
          Connect your Instagram, Facebook, YouTube, LinkedIn, X/Twitter, Threads & Pinterest. Schedule unlimited content, generate AI captions, and automate comment replies seamlessly from one unified hub.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-8">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 no-underline transform active:scale-98"
          >
            Start 5-Day Free Trial <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <a
            href="#pricing"
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-2xs transition-all flex items-center justify-center gap-2 no-underline"
          >
            View Pricing (From ₹1,999/mo)
          </a>
        </div>

        {/* 4 Feature Value Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-950">1-Click Publish</h4>
              <p className="text-[11px] text-slate-500 font-normal">7 Channels at once</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-950">Gemini 3.5 AI</h4>
              <p className="text-[11px] text-slate-500 font-normal">Auto-captions & tags</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-950">Auto-Reply Bots</h4>
              <p className="text-[11px] text-slate-500 font-normal">24/7 comment replies</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-950">Meta & YouTube API</h4>
              <p className="text-[11px] text-slate-500 font-normal">100% OAuth compliant</p>
            </div>
          </div>
        </div>

        {/* Supported Channels Pills */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-2">
          {socialPlatforms.map((p) => (
            <span key={p.name} className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs text-xs font-bold text-slate-700 hover:border-indigo-300 transition-all cursor-pointer">
              <PlatformIcon platform={p.name} className="w-4 h-4" />
              {p.name}
            </span>
          ))}
        </div>

      </section>

      {/* ── Realistic Product Preview ── */}
      <section id="preview" className="px-6 py-16 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl shadow-indigo-600/10 p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-mono text-slate-500 ml-2">app.postfly.com / dashboard</span>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active Workspace
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Followers</span>
              <div className="text-xl font-bold text-slate-900 mt-1">128,450</div>
              <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">+18.4%</span>
            </div>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Reach</span>
              <div className="text-xl font-bold text-slate-900 mt-1">1.8M</div>
              <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">+10.2%</span>
            </div>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Engagement Rate</span>
              <div className="text-xl font-bold text-slate-900 mt-1">7.8%</div>
              <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">+1.4%</span>
            </div>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scheduled Posts</span>
              <div className="text-xl font-bold text-slate-900 mt-1">14</div>
              <span className="text-[10px] font-bold text-indigo-600 mt-1 inline-block">Next in 2h</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12 Feature Grid Section ── */}
      <section id="features" className="py-20 px-6 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Powerful Features</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1 mb-3">
              Everything Needed to Manage Social Media
            </h2>
            <p className="text-xs text-slate-500">Designed for creators, marketing teams, brands, and digital agencies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuresList.map((f, i) => (
              <div key={i} className="saas-card p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Channels Section ── */}
      <section id="channels" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Connect All Your Social Channels</h2>
          <p className="text-xs text-slate-500 mt-1">Manage and publish content across 8 major social networks seamlessly.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {socialPlatforms.map((p, i) => (
            <div key={i} className="saas-card p-5 flex flex-col justify-between space-y-4 hover:border-indigo-200 transition-all">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform={p.name} className="w-7 h-7 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      API Verified
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">{p.desc}</p>
              </div>
              <Link href="/login" className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-900 font-bold text-xs text-center no-underline transition-all">
                Connect Channel
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Tools Section ── */}
      <section id="ai-tools" className="py-20 px-6 bg-white border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">AI Productivity</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Create Better Content, Faster</h2>
            <p className="text-xs text-slate-500 mt-1">Professional AI tools integrated directly into your publishing workflow.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
            {aiFeatures.map((tool, i) => (
              <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center font-bold text-xs text-slate-800 flex items-center justify-center gap-1.5 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4-Step Workflow Section ── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Simple 4-Step Content Workflow</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          {[
            { step: "01", title: "Connect Accounts", desc: "Link your official social channels with secure OAuth." },
            { step: "02", title: "Create Content", desc: "Write posts, add media, and optimize with AI." },
            { step: "03", title: "Schedule & Publish", desc: "Pick dates, times, or publish instantly everywhere." },
            { step: "04", title: "Analyze Results", desc: "Track performance, reach, and audience growth." }
          ].map((w, i) => (
            <div key={i} className="saas-card p-6 text-center space-y-2 relative">
              <span className="text-2xl font-black text-indigo-600">{w.step}</span>
              <h4 className="text-sm font-bold text-slate-900">{w.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CLIENT STORIES & TESTIMONIALS SLIDER SECTION ── */}
      <div id="reviews">
        <ClientReviewsSlider />
      </div>

      {/* ── CUSTOMIZED PAID PRICING SECTION (3 PLANS) ── */}
      <section id="pricing" className="py-24 px-6 bg-white border-t border-slate-200/80 relative">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-indigo-600" /> Transparent India SaaS Pricing • Razorpay INR (₹)
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple Paid Pricing Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-normal leading-relaxed">
              Choose the right tier for your accounts and AI automation needs. Upgrade, downgrade, or cancel anytime.
            </p>

            {/* Toggle Switch */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs font-bold shadow-2xs">
                <button
                  onClick={() => setYearly(false)}
                  className={`px-5 py-2 rounded-xl transition-all ${
                    !yearly
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Monthly Billed
                </button>
                <button
                  onClick={() => setYearly(true)}
                  className={`px-5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    yearly
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Annual Billed</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${yearly ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"}`}>
                    SAVE 5% OFF
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Custom Paid Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`${plan.accentBg} ${plan.border} p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-6 relative`}
              >
                {/* Popular Pill Badge */}
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> MOST POPULAR FOR CREATORS
                  </span>
                )}

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{plan.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{plan.tagline}</p>
                    </div>
                    {plan.badge && !plan.popular && (
                      <span className="text-[9px] font-extrabold text-slate-500 bg-slate-200/70 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* Pricing Display */}
                  <div className="py-3 border-y border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">
                        ₹{(yearly ? plan.yearlyPrice : plan.monthlyPrice).toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">/month</span>
                    </div>
                    {yearly && (
                      <p className="text-[11px] font-semibold text-emerald-600 mt-1">
                        Billed annually (₹{(plan.yearlyPrice * 12).toLocaleString("en-IN")}/yr)
                      </p>
                    )}
                  </div>

                  {/* Included / Excluded Features List */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Included Features:</p>
                    <ul className="space-y-2.5 text-xs font-medium">
                      {plan.features.map((feat, idx) => {
                        const isExcluded = feat.startsWith("❌");
                        return (
                          <li key={idx} className="flex items-start gap-2.5">
                            {isExcluded ? (
                              <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            ) : (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            )}
                            <span className={isExcluded ? "text-slate-500 font-bold" : "text-slate-800"}>
                              {feat.replace("❌ ", "").replace("✅ ", "")}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="/login"
                  className={`w-full py-3 rounded-xl font-bold text-xs text-center no-underline transition-all flex items-center justify-center gap-1.5 ${plan.btnBg}`}
                >
                  Start 5-Day Free Trial <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Guarantee & Trust Badges */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-5xl mx-auto">
            <div className="space-y-1">
              <ShieldCheck className="w-6 h-6 text-indigo-600 mx-auto" />
              <h4 className="text-xs font-bold text-slate-900">5-Day Free Trial</h4>
              <p className="text-[11px] text-slate-500">No credit card required to start.</p>
            </div>
            <div className="space-y-1">
              <Zap className="w-6 h-6 text-indigo-600 mx-auto" />
              <h4 className="text-xs font-bold text-slate-900">Instant Activation</h4>
              <p className="text-[11px] text-slate-500">Connect 3 to Unlimited accounts.</p>
            </div>
            <div className="space-y-1">
              <CreditCard className="w-6 h-6 text-indigo-600 mx-auto" />
              <h4 className="text-xs font-bold text-slate-900">Razorpay Secure</h4>
              <p className="text-[11px] text-slate-500">UPI, Cards & Netbanking in ₹.</p>
            </div>
            <div className="space-y-1">
              <CheckCircle2 className="w-6 h-6 text-indigo-600 mx-auto" />
              <h4 className="text-xs font-bold text-slate-900">Cancel Anytime</h4>
              <p className="text-[11px] text-slate-500">No contracts or hidden fees.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── ENHANCED COMPARISON MATRIX TABLE (3 PLANNED COLUMNS) ── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Detailed Matrix</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Compare Plan Features</h2>
          <p className="text-xs text-slate-500 mt-1">Full side-by-side feature comparison of Starter (₹1,999), Growth (₹2,999) and Pro (₹4,999).</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200/80">
                  <th className="p-4 w-2/5">Feature Overview</th>
                  <th className="p-4 text-center">Starter (₹1,999/mo)</th>
                  <th className="p-4 text-center bg-indigo-50/50 text-indigo-950 font-extrabold">Growth (₹2,999/mo) ★</th>
                  <th className="p-4 text-center">Pro Unlimited (₹4,999/mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {comparisonCategories.map((cat, catIdx) => (
                  <Fragment key={`cat-frag-${catIdx}`}>
                    <tr className="bg-slate-100/70 text-slate-900 font-bold">
                      <td colSpan={4} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-indigo-700 bg-indigo-50/50">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.rows.map((r, rIdx) => (
                      <tr key={`row-${catIdx}-${rIdx}`} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{r.name}</td>
                        <td className="p-4 text-center font-semibold text-slate-700">
                          {r.starter === "✓" ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : r.starter === "—" || r.starter === "— (NO AI)" ? <span className="text-rose-500 font-bold">❌ No AI</span> : r.starter}
                        </td>
                        <td className="p-4 text-center font-bold text-indigo-900 bg-indigo-50/20">
                          {r.growth === "✓" || r.growth === "✓ Included" ? <span className="flex items-center justify-center gap-1 text-emerald-600 font-bold"><Check className="w-4 h-4" /> AI Included</span> : r.growth === "—" ? <Minus className="w-4 h-4 text-slate-300 mx-auto" /> : r.growth}
                        </td>
                        <td className="p-4 text-center font-semibold text-slate-700">
                          {r.pro === "✓" || r.pro === "✓ Unlimited AI" ? <span className="flex items-center justify-center gap-1 text-purple-700 font-bold"><Check className="w-4 h-4 text-purple-600" /> Unlimited AI</span> : r.pro === "—" ? <Minus className="w-4 h-4 text-slate-300 mx-auto" /> : r.pro}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="saas-card overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-4 text-left flex items-center justify-between font-bold text-xs text-slate-900 focus:outline-none"
              >
                <span className="pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-indigo-600 shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 font-normal bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA Banner (Clean Light SaaS Theme) ── */}
      <section className="py-20 sm:py-24 px-6 bg-gradient-to-b from-white via-indigo-50/40 to-slate-50 border-t border-slate-200/80 relative text-center overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/90 text-indigo-700 text-xs font-bold shadow-2xs">
            <Layers className="w-4 h-4 text-indigo-600" /> Start Your 5-Day Free Trial Today
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Ready to Supercharge Your Social Media?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
            Join thousands of creators, brands, and digital agencies using Postfly to create, schedule, and scale their content strategy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
            <Link href="/login" className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 no-underline transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer">
              Get Started for Free <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#pricing" className="px-7 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs no-underline transition-all flex items-center justify-center gap-2 cursor-pointer">
              View Pricing Plans
            </a>
          </div>
        </div>
      </section>

      {/* ── ENHANCED ULTRA-MODERN LIGHT FOOTER ── */}
      <footer className="bg-white text-slate-600 text-xs pt-16 pb-12 px-6 border-t border-slate-200/90">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Top Newsletter & Brand Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <img src="/postflyLOGO.png" alt="Postfly" className="h-10 w-auto max-w-[190px] object-contain" />
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ml-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Systems Operational
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed font-normal">
                Subscribe to Postfly Pulse for the latest AI prompt updates, social media growth hacks, and product releases.
              </p>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center gap-2 max-w-md">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all shadow-2xs"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                {subscribed ? "Subscribed! ✓" : "Subscribe"}
              </button>
            </form>
          </div>

          {/* 4 Multi-Column Footer Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
            
            {/* Column 1: Product */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-950 uppercase tracking-wider text-[11px]">Product Capabilities</h5>
              <ul className="space-y-2 font-normal text-slate-600">
                <li><a href="#features" className="hover:text-indigo-600 transition-colors">Multi-Platform Publisher</a></li>
                <li><a href="#features" className="hover:text-indigo-600 transition-colors">Visual Content Calendar</a></li>
                <li><a href="#ai-tools" className="hover:text-indigo-600 transition-colors">AI Caption Generator</a></li>
                <li><a href="#features" className="hover:text-indigo-600 transition-colors">Social Inbox & DMs</a></li>
                <li><a href="#features" className="hover:text-indigo-600 transition-colors">Auto-Reply Comment Bot</a></li>
                <li><a href="#features" className="hover:text-indigo-600 transition-colors">Analytics & Reporting</a></li>
                <li><a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing Plans</a></li>
              </ul>
            </div>

            {/* Column 2: Channels Supported */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-950 uppercase tracking-wider text-[11px]">Supported Platforms</h5>
              <ul className="space-y-2 font-normal text-slate-600">
                <li className="flex items-center gap-2"><PlatformIcon platform="instagram" className="w-3.5 h-3.5" /><a href="#channels" className="hover:text-indigo-600 transition-colors">Instagram Posts & Reels</a></li>
                <li className="flex items-center gap-2"><PlatformIcon platform="facebook" className="w-3.5 h-3.5" /><a href="#channels" className="hover:text-indigo-600 transition-colors">Facebook Pages & Groups</a></li>
                <li className="flex items-center gap-2"><PlatformIcon platform="linkedin" className="w-3.5 h-3.5" /><a href="#channels" className="hover:text-indigo-600 transition-colors">LinkedIn Posts & Articles</a></li>
                <li className="flex items-center gap-2"><PlatformIcon platform="x" className="w-3.5 h-3.5" /><a href="#channels" className="hover:text-indigo-600 transition-colors">Twitter / X Threads</a></li>
                <li className="flex items-center gap-2"><PlatformIcon platform="youtube" className="w-3.5 h-3.5" /><a href="#channels" className="hover:text-indigo-600 transition-colors">YouTube Shorts & Videos</a></li>
                <li className="flex items-center gap-2"><PlatformIcon platform="threads" className="w-3.5 h-3.5" /><a href="#channels" className="hover:text-indigo-600 transition-colors">Threads & Pinterest</a></li>
              </ul>
            </div>

            {/* Column 3: Resources & Docs */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-950 uppercase tracking-wider text-[11px]">Resources & Help</h5>
              <ul className="space-y-2 font-normal text-slate-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center & FAQs</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Social Growth Playbook</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">API Status Page</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Community Forum</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Security & Compliance</a></li>
              </ul>
            </div>

            {/* Column 4: Company & Legal */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-950 uppercase tracking-wider text-[11px]">Company & Legal</h5>
              <ul className="space-y-2 font-normal text-slate-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Postfly</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact Support</a></li>
                <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Refund & Cancellation Policy</a></li>
              </ul>
            </div>

          </div>

          {/* Social Platform Badges Bar */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-2">Connect:</span>
              {["Instagram", "Facebook", "LinkedIn", "YouTube", "Twitter", "Threads", "Pinterest"].map((plat) => (
                <span key={plat} className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-slate-600 hover:text-indigo-600 transition-all cursor-pointer">
                  <PlatformIcon platform={plat} className="w-4 h-4" />
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-2 text-slate-600 font-semibold text-[11px]">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">🇮🇳 INR ₹ (India)</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">🔒 SSL Encrypted</span>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500 text-[11px]">
            <span>© 2026 Postfly Inc. All rights reserved.</span>
            <span>Empowering creators & businesses worldwide with AI social automation.</span>
          </div>

        </div>
      </footer>

      {/* ── FLOATING WHATSAPP SUPPORT BUTTON (9511450914) ── */}
      <a
        href="https://wa.me/919511450914?text=Hi%20Postfly%20Support,%20I%20have%20a%20query%20about%20your%20social%20media%20plans."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-2xl shadow-emerald-500/40 border border-emerald-400/30 transition-all transform hover:scale-105 active:scale-95 no-underline group"
        title="Chat with Live Support on WhatsApp (9511450914)"
      >
        <div className="relative">
          <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-100 leading-none">Live Support</span>
          <span className="text-xs font-black tracking-tight leading-tight">9511450914</span>
        </div>
      </a>

    </div>
  );
}
