"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import { PlatformIcon } from "@/components/ui/SocialIcons";
import {
  Shield,
  Lock,
  FileText,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Mail,
  Phone,
  Building,
  Clock,
  Globe,
  Sparkles,
  Database,
  Eye,
  Trash2,
  UserCheck,
  RefreshCw,
  Share2,
  HelpCircle,
  Layers
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userStr = typeof window !== "undefined" && (localStorage.getItem("socialflow_user") || localStorage.getItem("yt_user"));
    if (userStr) setIsLoggedIn(true);

    const handleScroll = () => {
      const sections = [
        "overview",
        "info-collected",
        "platform-disclosures",
        "ai-gemini",
        "how-we-use",
        "data-retention",
        "security",
        "cookies",
        "user-rights",
        "grievance-contact"
      ];
      
      const scrollPos = window.scrollY + 200;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "overview", label: "1. Overview & Scope" },
    { id: "info-collected", label: "2. Information We Collect" },
    { id: "platform-disclosures", label: "3. Social Platform APIs (YouTube & Meta)" },
    { id: "ai-gemini", label: "4. AI & Gemini Processing" },
    { id: "how-we-use", label: "5. How We Use Data" },
    { id: "data-retention", label: "6. Retention & Deletion" },
    { id: "security", label: "7. Security Measures" },
    { id: "cookies", label: "8. Cookies & Telemetry" },
    { id: "user-rights", label: "9. Your Legal Rights (GDPR/DPDP)" },
    { id: "grievance-contact", label: "10. Contact & Grievance Officer" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <CustomCursor />
      <ScrollProgressBar />

      {/* ── Top Header ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center no-underline group">
            <img 
              src="/postflyLOGO.png" 
              alt="Postfly Logo" 
              className="h-12 sm:h-14 w-auto max-w-[240px] sm:max-w-[280px] object-contain group-hover:scale-105 transition-transform" 
            />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors no-underline">Home</Link>
            <Link href="/#features" className="hover:text-indigo-600 transition-colors no-underline">Features</Link>
            <Link href="/#pricing" className="hover:text-indigo-600 transition-colors no-underline">Pricing</Link>
            <Link href="/terms" className="hover:text-indigo-600 transition-colors no-underline">Terms of Service</Link>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all no-underline">
                Dashboard →
              </Link>
            ) : (
              <Link href="/login" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all no-underline">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="bg-gradient-to-b from-indigo-900 via-slate-900 to-[#0F172A] text-white py-16 sm:py-20 px-6 relative overflow-hidden">
        {/* Glow accents */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-indigo-400" /> Official Legal Document • Postfly Inc.
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Privacy Policy
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            We take your privacy and social media account security seriously. Read how Postfly collects, protects, uses, and respects your data in accordance with international privacy laws and platform developer guidelines.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Last Updated: September 28, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" /> Compliant with GDPR, DPDP Act 2023 & CCPA
            </span>
          </div>
        </div>
      </section>

      {/* ── Main Legal Content with Sticky Sidebar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Sticky Table of Contents Sidebar */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Table of Contents
                </h3>
                <nav className="space-y-1 text-xs">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block px-3 py-2 rounded-lg font-medium transition-all no-underline ${
                        activeSection === item.id
                          ? "bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600 pl-2.5"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Quick Contact Card */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Privacy Assistance</span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Have questions regarding your personal information or data deletion?
                </p>
                <a 
                  href="mailto:privacy@postfly.com"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 no-underline pt-1"
                >
                  <Mail className="w-3.5 h-3.5" /> privacy@postfly.com
                </a>
              </div>

              {/* Quick Navigation to Terms */}
              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/terms"
                  className="flex items-center justify-between text-xs font-bold text-slate-700 hover:text-indigo-600 p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-colors no-underline"
                >
                  <span>Read Terms of Service</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Legal Body Articles */}
          <main className="lg:col-span-8 space-y-12 text-slate-700 leading-relaxed text-sm">

            {/* Notice Callout */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3.5">
              <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-indigo-950">
                <strong className="font-bold text-indigo-900 block text-sm">Summary of our Privacy Pledge</strong>
                <p className="leading-relaxed text-indigo-900/80">
                  Postfly is built on absolute privacy and security. We only request permissions necessary to publish and analyze content on your connected social channels. <strong>We never sell your personal data, we never view or store your passwords, and you can revoke access or delete your data at any moment.</strong>
                </p>
              </div>
            </div>

            {/* 1. Overview & Scope */}
            <section id="overview" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">01</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Overview & Scope</h2>
              </div>
              <p>
                This Privacy Policy describes how <strong>Postfly Inc.</strong> (&quot;Postfly&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, stores, and protects personal information obtained through our website, web application (<a href="https://postfly.in" className="text-indigo-600 font-medium hover:underline">postfly.in</a>), APIs, and associated services (collectively, the &quot;Service&quot;).
              </p>
              <p>
                By registering for an account, connecting any social media platform (such as YouTube, Instagram, Facebook, LinkedIn, X / Twitter, Threads, or Pinterest), or using our AI tools, you consent to the data practices described in this policy. If you do not agree with any part of this policy, please do not use our Service.
              </p>
              <p>
                This policy complies with applicable global data privacy regulations, including the <strong>European Union General Data Protection Regulation (GDPR)</strong>, the <strong>California Consumer Privacy Act / CPRA</strong>, and the <strong>Digital Personal Data Protection Act (DPDP Act, India 2023)</strong>.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="info-collected" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">02</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Information We Collect</h2>
              </div>
              <p>
                We collect information directly from you when you register, when you connect social media channels, and automatically as you interact with our application:
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" /> A. Account & Contact Information
                  </h4>
                  <p className="text-xs text-slate-600">
                    When creating an account, we collect your full name, email address, password (stored via strong cryptographic one-way salted hash), phone number, workspace name, and billing details.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-indigo-600" /> B. Connected Social Media Accounts & Tokens
                  </h4>
                  <p className="text-xs text-slate-600">
                    When you link social networks via official OAuth 2.0 authorization, we receive encrypted access tokens, refresh tokens, channel/page IDs, profile handles, and avatar URLs. <strong>We never see or store your raw social media passwords.</strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600" /> C. Content, Media & Scheduling Data
                  </h4>
                  <p className="text-xs text-slate-600">
                    Posts, captions, images, video assets, scheduled publication timestamps, hashtags, and social comments fetched through connected APIs to power the Social Inbox and auto-reply bots.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-600" /> D. Payment & Transaction Data
                  </h4>
                  <p className="text-xs text-slate-600">
                    All financial transactions are processed directly by our PCI-DSS Level 1 compliant payment gateway partner, <strong>Razorpay</strong>. Postfly never receives, stores, or processes raw credit/debit card numbers or UPI PINs.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Platform-Specific Disclosures */}
            <section id="platform-disclosures" className="scroll-mt-28 space-y-6 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">03</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Third-Party Social Platform API Disclosures</h2>
              </div>
              
              {/* YouTube Disclosure */}
              <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200 space-y-3">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform="youtube" className="w-6 h-6" />
                  <h3 className="text-base font-bold text-red-950">YouTube API Services & Google User Data</h3>
                </div>
                <p className="text-xs text-red-900/90 leading-relaxed">
                  Postfly uses the official <strong>YouTube API Services</strong> to allow users to upload YouTube Shorts and videos, schedule publishing, and retrieve video engagement metrics.
                </p>
                <ul className="text-xs text-red-900/90 space-y-2 list-disc pl-5">
                  <li>
                    By connecting your YouTube account to Postfly, you agree to be bound by the <strong><a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="underline font-bold">YouTube Terms of Service</a></strong>.
                  </li>
                  <li>
                    Please review the <strong><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline font-bold">Google Privacy Policy</a></strong> to understand how Google processes user data.
                  </li>
                  <li>
                    <strong>Google API Services User Data Policy:</strong> Postfly&apos;s use and transfer of information received from Google APIs to any other app adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="underline font-bold">Google API Services User Data Policy</a>, including the Limited Use requirements.
                  </li>
                  <li>
                    <strong>Revoking Access:</strong> You may revoke Postfly&apos;s access to your YouTube data at any time via the official Google Security Settings page at <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="underline font-bold">https://myaccount.google.com/permissions</a> or by disconnecting YouTube inside your Postfly Accounts dashboard.
                  </li>
                  <li>
                    We do not use YouTube data to serve advertisements, and we do not sell or transfer YouTube user data to external data brokers or ad networks.
                  </li>
                </ul>
              </div>

              {/* Meta Disclosure */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon platform="facebook" className="w-6 h-6" />
                  <PlatformIcon platform="instagram" className="w-6 h-6" />
                  <h3 className="text-base font-bold text-blue-950">Meta Platforms (Facebook & Instagram Graph API)</h3>
                </div>
                <p className="text-xs text-blue-900/90 leading-relaxed">
                  Postfly connects with Facebook Pages, Facebook Groups, and Instagram Professional accounts via official Meta Graph APIs to publish posts/reels, retrieve comments, and support comment-to-DM automated triggers.
                </p>
                <div className="p-3 bg-white/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                  <strong className="font-bold block">User Data Deletion Request (Meta Compliance):</strong>
                  <p>
                    If you wish to remove your Facebook or Instagram activities from Postfly, you can delete your connected accounts from <strong>Account Settings &gt; Connected Channels</strong>. Alternatively, you can request full automated data purge by emailing <a href="mailto:privacy@postfly.com" className="font-bold underline">privacy@postfly.com</a> or using our automated Facebook Data Deletion callback endpoint.
                  </p>
                </div>
              </div>

              {/* X, LinkedIn, Threads, Pinterest */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">X (Twitter), LinkedIn, Threads & Pinterest</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Postfly accesses these platforms strictly via their approved developer APIs. Access tokens are used only to publish tweets, threads, professional articles, pins, and track performance. We honor platform rate-limits, deletion webhooks, and privacy settings at all times.
                </p>
              </div>
            </section>

            {/* 4. AI & Gemini Processing */}
            <section id="ai-gemini" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">04</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">AI Features & Google Gemini Integration</h2>
              </div>
              <p>
                Postfly offers generative AI tools including the <strong>AI Caption Generator</strong>, <strong>Hashtag Assistant</strong>, <strong>Tone Changer</strong>, and <strong>AI Copyright & Safe Harbor Scanner</strong>. These features utilize the <strong>Google Gemini API</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-950 space-y-1">
                  <strong className="font-bold text-purple-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" /> Ephemeral AI Processing
                  </strong>
                  <p>
                    Prompts and post topics you send to our AI assistants are processed in real time and are not retained to train public foundational AI models.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-950 space-y-1">
                  <strong className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-600" /> Copyright & Policy Shield
                  </strong>
                  <p>
                    Our AI scan assists in identifying potential policy flags, but the user remains exclusively responsible for the originality and legal rights of published media.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. How We Use Data */}
            <section id="how-we-use" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">05</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">How We Use Your Data</h2>
              </div>
              <p>
                We use the information we collect for the following specific business and technical purposes:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm list-disc pl-5 text-slate-600">
                <li><strong>Publishing & Scheduling:</strong> To transmit media, text, captions, tags, and thumbnails to your designated social platforms at your selected time.</li>
                <li><strong>Analytics Aggregation:</strong> To generate performance charts, impressions, reach, and engagement reports for your connected channels.</li>
                <li><strong>Social Inbox & Automation:</strong> To display incoming comments/messages and trigger automated replies according to your configured rules.</li>
                <li><strong>Customer Support & Verification:</strong> To troubleshoot sync errors, provide live support, verify workspace permissions, and maintain platform security.</li>
                <li><strong>Billing & Invoicing:</strong> To manage subscription plans, renewal reminders, GST invoicing, and transaction receipts.</li>
                <li><strong>System Integrity:</strong> To prevent fraud, abuse, automated scraping, or illegal activities violating social network developer guidelines.</li>
              </ul>
            </section>

            {/* 6. Retention & Deletion */}
            <section id="data-retention" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">06</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Data Retention & Deletion Policy</h2>
              </div>
              <p>
                We retain your account data and connected tokens only for as long as your Postfly account remains active or as needed to provide you with the Service.
              </p>
              <div className="space-y-3 pt-1 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <Trash2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Disconnecting Channels:</strong>
                    <span className="text-slate-600">When you disconnect a channel (e.g. YouTube or Instagram), all associated OAuth tokens are immediately revoked and permanently deleted from our active database.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <RefreshCw className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Account Deletion:</strong>
                    <span className="text-slate-600">You may request complete account deletion at any time by contacting support. Upon account closure, all personal details, uploaded media assets, and scheduling history are queued for permanent deletion within 30 days.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Security Measures */}
            <section id="security" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">07</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Security & Encryption Architecture</h2>
              </div>
              <p>
                Postfly employs rigorous administrative, technical, and physical safeguards to protect your personal and social data:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1.5">
                  <Lock className="w-5 h-5 text-indigo-600 mx-auto" />
                  <strong className="text-slate-900 block font-bold">TLS 1.3 Encryption</strong>
                  <p className="text-slate-500 text-[11px]">All data in transit is encrypted using modern SSL/TLS 1.3 certificates.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1.5">
                  <Shield className="w-5 h-5 text-emerald-600 mx-auto" />
                  <strong className="text-slate-900 block font-bold">AES-256 Token Storage</strong>
                  <p className="text-slate-500 text-[11px]">OAuth access & refresh tokens are encrypted at rest using industry-standard AES-256.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-1.5">
                  <Building className="w-5 h-5 text-purple-600 mx-auto" />
                  <strong className="text-slate-900 block font-bold">Role-Based Access</strong>
                  <p className="text-slate-500 text-[11px]">Granular workspace member roles protect publishing access and admin rights.</p>
                </div>
              </div>
            </section>

            {/* 8. Cookies & Telemetry */}
            <section id="cookies" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">08</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Cookies & Tracking Technologies</h2>
              </div>
              <p>
                We use cookies and similar browser storage mechanisms solely to keep you signed in securely, remember your UI preferences (such as light mode or dashboard workspace filters), and analyze aggregate performance trends. We do not use intrusive third-party cross-site advertising trackers.
              </p>
            </section>

            {/* 9. Your Legal Rights */}
            <section id="user-rights" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">09</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Your Legal Rights (GDPR, DPDP & CCPA)</h2>
              </div>
              <p>
                Depending on your location, you hold legal rights concerning your personal data:
              </p>
              <div className="space-y-2 text-xs text-slate-600 pl-2">
                <p>• <strong>Right to Access:</strong> You can request a digital copy of all personal data held by Postfly.</p>
                <p>• <strong>Right to Rectification:</strong> You can update or correct inaccuracies in your profile and workspace settings at any time.</p>
                <p>• <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You can request complete erasure of your account and associated social metadata.</p>
                <p>• <strong>Right to Restrict or Object:</strong> You can object to specific processing activities, such as non-essential marketing emails.</p>
                <p>• <strong>Right to Data Portability:</strong> You can export your scheduled post archives and analytics reports in standard formats (CSV, PDF).</p>
              </div>
            </section>

            {/* 10. Contact & Grievance Officer */}
            <section id="grievance-contact" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">10</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Grievance Officer & Contact Information</h2>
              </div>
              <p>
                In accordance with the <strong>Information Technology Act, 2000</strong> and the <strong>Digital Personal Data Protection Act, 2023</strong>, the contact details of the Grievance Officer are provided below:
              </p>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div>
                  <strong className="text-slate-900 text-sm block">Grievance Officer — Postfly Privacy Office</strong>
                  <span className="text-slate-500">Postfly Technologies Inc.</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span><strong>Email:</strong> privacy@postfly.com / support@postfly.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span><strong>WhatsApp Support:</strong> +91 9511450914</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-slate-700 pt-1">
                  <Building className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span><strong>Corporate Address:</strong> Postfly Technologies, Tech Park, Sector 62, Noida, Uttar Pradesh, India - 201309.</span>
                </div>
              </div>
            </section>

          </main>

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-white text-slate-600 text-xs pt-12 pb-10 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/postflyLOGO.png" alt="Postfly" className="h-9 w-auto" />
            <span className="text-slate-400 text-xs">© 2026 Postfly Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/" className="hover:text-indigo-600 transition-colors no-underline">Home</Link>
            <Link href="/terms" className="hover:text-indigo-600 transition-colors no-underline">Terms of Service</Link>
            <Link href="/privacy" className="text-indigo-600 font-bold no-underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp Support Button ── */}
      <a
        href="https://wa.me/919511450914?text=Hi%20Postfly%20Support,%20I%20have%20a%20query%20about%20your%20privacy%20policy."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-2xl shadow-emerald-500/40 border border-emerald-400/30 transition-all transform hover:scale-105 active:scale-95 no-underline group"
        title="Chat with WhatsApp Support"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
        <span className="text-xs font-bold tracking-wide">Live Support</span>
      </a>
    </div>
  );
}
