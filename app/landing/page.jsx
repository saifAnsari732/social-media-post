"use client";

import { useState } from "react";
import Link from "next/link";
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
  Clock
} from "lucide-react";

export default function LightSaaSLandingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const socialPlatforms = [
    { name: "Instagram", desc: "Share photos, reels, and stories with automated scheduling.", color: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]" },
    { name: "Facebook", desc: "Manage pages, post updates, and automate comment replies.", color: "bg-[#1877F2]" },
    { name: "TikTok", desc: "Schedule short-form video content for peak engagement.", color: "bg-black" },
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

  const comparisonRows = [
    { name: "Social Accounts", starter: "5", growth: "15", pro: "30", agency: "Unlimited" },
    { name: "Scheduled Posts", starter: "100 / mo", growth: "Unlimited", pro: "Unlimited", agency: "Unlimited" },
    { name: "AI Credits", starter: "200 / mo", growth: "Unlimited", pro: "Unlimited", agency: "Unlimited" },
    { name: "Analytics & Reports", starter: "Basic", growth: "Advanced", pro: "Advanced", agency: "Custom Export" },
    { name: "Social Inbox", starter: "—", growth: "✓", pro: "✓", agency: "✓" },
    { name: "Automation Rules", starter: "—", growth: "—", pro: "✓", agency: "✓ Advanced" },
    { name: "Team Members", starter: "1", growth: "3", pro: "10", agency: "Unlimited" },
    { name: "Approval Workflow", starter: "—", growth: "✓", pro: "✓", agency: "✓" },
    { name: "Media Storage", starter: "2 GB", growth: "10 GB", pro: "50 GB", agency: "200 GB" },
    { name: "White Label Branding", starter: "—", growth: "—", pro: "—", agency: "✓" },
    { name: "API Access", starter: "—", growth: "—", pro: "—", agency: "✓ Full" }
  ];

  const faqs = [
    { q: "Which social platforms are supported?", a: "SocialFlow supports Instagram, Facebook, TikTok, LinkedIn, YouTube, X / Twitter, Threads, and Pinterest." },
    { q: "Can I schedule posts for future dates?", a: "Yes, you can schedule posts for any date and time across multiple platforms simultaneously." },
    { q: "Can multiple team members use one account?", a: "Yes, our Growth, Pro, and Agency plans support multi-user collaboration with custom roles and permissions." },
    { q: "Does SocialFlow support agencies?", a: "Yes! Our Agency plan offers multi-workspace management, white-label branding, and client permissions." },
    { q: "How does Razorpay billing work?", a: "All transactions are securely processed via Razorpay in INR. You can pay via UPI, Credit/Debit Cards, or Netbanking." },
    { q: "Can I cancel my subscription at any time?", a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time from your account settings." }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">SocialFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors no-underline">Features</a>
            <a href="#channels" className="hover:text-slate-900 transition-colors no-underline">Social Channels</a>
            <a href="#ai-tools" className="hover:text-slate-900 transition-colors no-underline">AI Tools</a>
            <a href="#analytics" className="hover:text-slate-900 transition-colors no-underline">Analytics</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors no-underline">Pricing</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors no-underline">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors no-underline px-3 py-2">
              Sign In
            </Link>
            <Link href="/login" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all no-underline">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section (LIGHT MODE ONLY) ── */}
      <section className="py-16 sm:py-24 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
          <ShieldCheck className="w-4 h-4" /> Professional Social Media Management SaaS
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.2] mb-6">
          Manage Every Social Channel <br />
          <span className="text-indigo-600">From One Workspace</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Create, schedule, publish, analyze and automate your social media from one powerful platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 no-underline"
          >
            Start Creating <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#preview"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 no-underline"
          >
            View Demo
          </a>
        </div>

        {/* Trusted Channels Bar */}
        <div className="pt-8 border-t border-slate-200/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-5">Supported Social Channels</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-700">
            {socialPlatforms.map((p) => (
              <span key={p.name} className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className={`w-2 h-2 rounded-full ${p.color}`}></span>
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Realistic Product Preview (Light SaaS Dashboard Mockup) ── */}
      <section id="preview" className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-5 sm:p-6 space-y-6">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-mono text-slate-500 ml-2">app.socialflow.com / dashboard</span>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✓ Active Workspace
            </span>
          </div>

          {/* Product Dashboard Grid Mockup */}
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
            <div key={i} className="saas-card p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${p.color}`}></span>
                  <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">{p.desc}</p>
              </div>
              <Link href="/login" className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold text-xs text-center no-underline transition-colors">
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
              <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center font-bold text-xs text-slate-800 flex items-center justify-center gap-1.5">
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
            <div key={i} className="saas-card p-6 text-center space-y-2">
              <span className="text-2xl font-black text-indigo-600">{w.step}</span>
              <h4 className="text-sm font-bold text-slate-900">{w.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PAID PRICING SECTION (NO FREE PLAN) ── */}
      <section id="pricing" className="py-20 px-6 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Simple Paid Plans</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 mb-2">India SaaS Pricing</h2>
            <p className="text-xs text-slate-500">All plans include full platform features. Upgrade or downgrade anytime.</p>

            {/* Toggle */}
            <div className="mt-5 inline-flex items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-bold">
              <button onClick={() => setYearly(false)} className={`px-4 py-1.5 rounded-lg transition-all ${!yearly ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"}`}>
                Monthly Billed
              </button>
              <button onClick={() => setYearly(true)} className={`px-4 py-1.5 rounded-lg transition-all ${yearly ? "bg-slate-900 text-white shadow-xs" : "text-slate-500"}`}>
                Yearly Billed <span className="text-emerald-500 ml-1">(Save 20%)</span>
              </button>
            </div>
          </div>

          {/* 4 Paid Plans Grid (NO ₹0 PLAN) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-stretch">
            
            {/* STARTER ₹999 */}
            <div className="saas-card p-6 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">STARTER</h3>
                <p className="text-xs text-slate-500 mt-0.5">For creators & small businesses.</p>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-bold text-slate-900">{yearly ? "₹799" : "₹999"}</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 5 Social Accounts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 100 Scheduled Posts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Basic Analytics</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> AI Caption Generator</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Media Library</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Content Calendar</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Email Support</li>
                </ul>
              </div>
              <Link href="/login" className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-900 text-center no-underline transition-colors">
                Get Started
              </Link>
            </div>

            {/* GROWTH ₹1,999 (MOST POPULAR) */}
            <div className="bg-white p-6 rounded-2xl border-2 border-indigo-600 shadow-md flex flex-col justify-between space-y-6 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full">
                MOST POPULAR
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">GROWTH</h3>
                <p className="text-xs text-slate-500 mt-0.5">For growing businesses.</p>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-bold text-slate-900">{yearly ? "₹1,599" : "₹1,999"}</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 15 Social Accounts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited Scheduled Posts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Advanced Analytics</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> AI Content Assistant</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Social Inbox</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Team Collaboration</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Approval Workflow</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Priority Support</li>
                </ul>
              </div>
              <Link href="/login" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-xs text-white text-center no-underline shadow-xs transition-colors">
                Get Started
              </Link>
            </div>

            {/* PRO ₹3,999 */}
            <div className="saas-card p-6 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">PRO</h3>
                <p className="text-xs text-slate-500 mt-0.5">For brands & pro teams.</p>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-bold text-slate-900">{yearly ? "₹3,199" : "₹3,999"}</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> 30 Social Accounts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited Publishing</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Advanced Analytics</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> AI Content Suite</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Automation Rules</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Campaign Management</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Team Roles & Permissions</li>
                </ul>
              </div>
              <Link href="/login" className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-900 text-center no-underline transition-colors">
                Get Started
              </Link>
            </div>

            {/* AGENCY ₹7,999 */}
            <div className="saas-card p-6 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">AGENCY</h3>
                <p className="text-xs text-slate-500 mt-0.5">For multi-client agencies.</p>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-bold text-slate-900">{yearly ? "₹6,399" : "₹7,999"}</span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited Social Accounts</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Multi-Workspace</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Client Management</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> White Label Branding</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Custom Reports</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> API Access</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Dedicated Support</li>
                </ul>
              </div>
              <Link href="/login" className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-900 text-center no-underline transition-colors">
                Get Started
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-xl font-bold text-slate-900">Compare Plans</h3>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200/80">
                <th className="p-4">Feature</th>
                <th className="p-4">Starter</th>
                <th className="p-4">Growth</th>
                <th className="p-4">Pro</th>
                <th className="p-4">Agency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {comparisonRows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">{r.name}</td>
                  <td className="p-4">{r.starter}</td>
                  <td className="p-4">{r.growth}</td>
                  <td className="p-4">{r.pro}</td>
                  <td className="p-4">{r.agency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="py-20 px-6 max-w-3xl mx-auto border-t border-slate-200/80">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-10">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="saas-card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-4 text-left flex items-center justify-between font-bold text-xs text-slate-900 focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="p-4 pt-0 text-xs text-slate-500 leading-relaxed border-t border-slate-100 font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-6 bg-white border-t border-slate-200/80 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Everything You Need to Manage Social Media</h2>
          <p className="text-xs text-slate-500">Create, schedule, publish and analyze your social presence from one powerful workspace.</p>
          <div className="flex justify-center gap-3">
            <Link href="/login" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs no-underline transition-colors">
              Get Started
            </Link>
            <a href="#pricing" className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs no-underline transition-colors">
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 bg-[#F8FAFC] border-t border-slate-200/80 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-3">Product</h5>
            <ul className="space-y-2 font-normal">
              <li><a href="#features" className="hover:text-slate-900">Features</a></li>
              <li><a href="#analytics" className="hover:text-slate-900">Analytics</a></li>
              <li><a href="#ai-tools" className="hover:text-slate-900">AI Tools</a></li>
              <li><a href="#pricing" className="hover:text-slate-900">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-3">Resources</h5>
            <ul className="space-y-2 font-normal">
              <li><a href="#" className="hover:text-slate-900">Help Center</a></li>
              <li><a href="#" className="hover:text-slate-900">Documentation</a></li>
              <li><a href="#" className="hover:text-slate-900">Guides</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-3">Company</h5>
            <ul className="space-y-2 font-normal">
              <li><a href="#" className="hover:text-slate-900">About Us</a></li>
              <li><a href="#" className="hover:text-slate-900">Contact</a></li>
              <li><a href="#" className="hover:text-slate-900">Careers</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-3">Legal</h5>
            <ul className="space-y-2 font-normal">
              <li><Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© 2026 SocialFlow Inc. All rights reserved.</span>
          <span>Commercial Light Mode SaaS Edition</span>
        </div>
      </footer>

    </div>
  );
}
