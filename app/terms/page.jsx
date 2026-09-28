"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import { PlatformIcon } from "@/components/ui/SocialIcons";
import {
  FileText,
  Shield,
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
  CreditCard,
  Scale,
  Ban,
  AlertTriangle,
  HelpCircle,
  Layers,
  Lock,
  RefreshCw
} from "lucide-react";

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userStr = typeof window !== "undefined" && (localStorage.getItem("socialflow_user") || localStorage.getItem("yt_user"));
    if (userStr) setIsLoggedIn(true);

    const handleScroll = () => {
      const sections = [
        "acceptance",
        "description",
        "accounts",
        "acceptable-use",
        "third-party-platforms",
        "billing-plans",
        "intellectual-property",
        "ai-disclaimers",
        "warranties-liability",
        "termination",
        "governing-law",
        "contact"
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
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "description", label: "2. Description of Service" },
    { id: "accounts", label: "3. Accounts & Workspaces" },
    { id: "acceptable-use", label: "4. Acceptable Use & Conduct" },
    { id: "third-party-platforms", label: "5. Platform APIs & YouTube Terms" },
    { id: "billing-plans", label: "6. Billing, INR Pricing & Refunds" },
    { id: "intellectual-property", label: "7. Content Ownership & IP" },
    { id: "ai-disclaimers", label: "8. AI Assistant Disclaimers" },
    { id: "warranties-liability", label: "9. Warranty & Liability Caps" },
    { id: "termination", label: "10. Termination & Suspension" },
    { id: "governing-law", label: "11. Governing Law & Jurisdiction" },
    { id: "contact", label: "12. Contact & Support" },
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
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors no-underline">Privacy Policy</Link>
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
      <section className="bg-gradient-to-b from-slate-900 via-[#0F172A] to-indigo-950 text-white py-16 sm:py-20 px-6 relative overflow-hidden">
        {/* Glow accents */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5 text-indigo-400" /> Legally Binding Agreement • Postfly Inc.
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Terms of Service
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before accessing or using Postfly. By subscribing or using our social management platform, you agree to comply with all platform rules and terms outlined herein.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Effective Date: September 28, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" /> Applies to all Postfly SaaS Subscriptions
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
                  Terms Navigation
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
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Legal Inquiries</span>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Questions regarding corporate contracts, invoicing, or compliance?
                </p>
                <a 
                  href="mailto:legal@postfly.com"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 no-underline pt-1"
                >
                  <Mail className="w-3.5 h-3.5" /> legal@postfly.com
                </a>
              </div>

              {/* Quick Navigation to Privacy */}
              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/privacy"
                  className="flex items-center justify-between text-xs font-bold text-slate-700 hover:text-indigo-600 p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-colors no-underline"
                >
                  <span>Read Privacy Policy</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Legal Body Articles */}
          <main className="lg:col-span-8 space-y-12 text-slate-700 leading-relaxed text-sm">

            {/* Notice Callout */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3.5">
              <Scale className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-indigo-950">
                <strong className="font-bold text-indigo-900 block text-sm">Important Notice & Agreement</strong>
                <p className="leading-relaxed text-indigo-900/80">
                  By signing up, linking any social accounts, or clicking &quot;Get Started&quot;, you enter into a legally binding contract with Postfly Inc. <strong>You retain 100% intellectual ownership of all your content, and you agree to follow the community standards of each connected platform.</strong>
                </p>
              </div>
            </div>

            {/* 1. Acceptance of Terms */}
            <section id="acceptance" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">01</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Acceptance of Terms</h2>
              </div>
              <p>
                These Terms of Service (&quot;Terms&quot;, &quot;Agreement&quot;) govern your access to and use of the software, websites, AI tools, APIs, and services operated by <strong>Postfly Inc.</strong> (&quot;Postfly&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
              </p>
              <p>
                By creating an account, browsing our website, connecting social media accounts, or paying for any subscription tier, you agree to be bound by these Terms and our Privacy Policy. If you are entering into this Agreement on behalf of a company, agency, or other legal entity, you represent that you have the legal authority to bind such entity.
              </p>
              <p>
                <strong>Eligibility:</strong> You must be at least 18 years old or the age of majority in your jurisdiction to use Postfly. By using the Service, you represent and warrant that you meet this requirement.
              </p>
            </section>

            {/* 2. Description of Service */}
            <section id="description" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">02</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Description of Service</h2>
              </div>
              <p>
                Postfly provides a cloud-based software-as-a-service (SaaS) platform designed for multi-channel social media management. Key features include:
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm list-disc pl-5 text-slate-600">
                <li>Multi-platform publishing and automated scheduling for Instagram, Facebook, LinkedIn, YouTube, X / Twitter, Threads, and Pinterest.</li>
                <li>Interactive visual content calendar with drag-and-drop rescheduling.</li>
                <li>AI content tools powered by Gemini AI (captions, hashtag generation, tone adjustments, content ideas).</li>
                <li>Unified Social Inbox for centralizing comments, mentions, and direct messages.</li>
                <li>24/7 Auto-Reply automation for comments and direct messages.</li>
                <li>Performance analytics, reach reports, and exportable white-label PDF analytics.</li>
                <li>Agency multi-tenant workspaces, team permission management, and content approval flows.</li>
              </ul>
            </section>

            {/* 3. Accounts & Workspaces */}
            <section id="accounts" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">03</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">User Accounts, Security & Workspaces</h2>
              </div>
              <p>
                To access the Service, you must register for an account with accurate and complete information. You are solely responsible for:
              </p>
              <div className="space-y-3 pt-1 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 font-bold block">Account Confidentiality</strong>
                  <p className="text-slate-600">
                    Maintaining the confidentiality of your login credentials and preventing unauthorized access to your account. Postfly is not liable for any losses caused by compromised passwords.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 font-bold block">Workspace & Team Roles</strong>
                  <p className="text-slate-600">
                    Workspace owners are responsible for actions performed by invited team members, including content approval, publishing, and channel modifications.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 font-bold block">Prompt Breach Notification</strong>
                  <p className="text-slate-600">
                    You must notify Postfly immediately at <a href="mailto:security@postfly.com" className="text-indigo-600 font-bold underline">security@postfly.com</a> if you suspect any unauthorized access or security breach.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Acceptable Use & Conduct */}
            <section id="acceptable-use" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">04</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Acceptable Use Policy & Prohibited Conduct</h2>
              </div>
              <p>
                You agree to use Postfly solely for lawful purposes. You represent and warrant that you will <strong>NOT</strong>:
              </p>
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs text-amber-950">
                <p>• Publish or transmit any spam, malicious code, malware, spyware, phishing links, or deceptive advertising.</p>
                <p>• Post content that violates copyright, trademark, trade secret, or other intellectual property rights of third parties.</p>
                <p>• Publish hate speech, harassment, defamation, explicit violence, child exploitation, or content promoting illegal acts.</p>
                <p>• Use auto-reply bots to spam social media users with unsolicited commercial mass messages or circumvent platform DM quotas.</p>
                <p>• Reverse-engineer, decompile, scrape, or extract source code or underlying AI models from the Postfly platform.</p>
                <p>• Resell or sub-license access to Postfly without an authorized White Label Agency subscription.</p>
              </div>
              <p className="text-xs text-slate-500">
                Violation of this section may lead to immediate suspension or termination of your account without refund.
              </p>
            </section>

            {/* 5. Platform APIs & YouTube Terms */}
            <section id="third-party-platforms" className="scroll-mt-28 space-y-5 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">05</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Third-Party Social Platform APIs & Dependencies</h2>
              </div>
              <p>
                Postfly functions by interfacing with developer APIs provided by external social networks. By using Postfly to publish content, you also agree to comply with the official developer terms and community guidelines of each connected service:
              </p>

              {/* YouTube Specific Box */}
              <div className="p-4 rounded-xl bg-red-50/80 border border-red-200 space-y-2 text-xs text-red-950">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform="youtube" className="w-5 h-5" />
                  <strong className="font-bold text-red-900">YouTube Terms of Service Compliance</strong>
                </div>
                <p className="leading-relaxed">
                  Postfly uses the official YouTube API Services. By connecting your YouTube account, you agree to be bound by the <strong><a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="underline font-bold">YouTube Terms of Service</a></strong> and the <strong><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline font-bold">Google Privacy Policy</a></strong>. You can revoke Postfly&apos;s access at any time via <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="underline font-bold">https://myaccount.google.com/permissions</a>.
                </p>
              </div>

              {/* Meta, LinkedIn, X Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <strong className="font-bold text-slate-900 block">Meta, LinkedIn & X Terms Compliance</strong>
                <p className="leading-relaxed">
                  You agree to adhere to the Meta Platform Terms, Instagram Community Guidelines, LinkedIn User Agreement, and X Developer Terms. Postfly is not responsible for API outages, rate limits, algorithm updates, or account penalties imposed by third-party platforms for user-submitted content.
                </p>
              </div>
            </section>

            {/* 6. Billing, INR Pricing & Refunds */}
            <section id="billing-plans" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">06</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Subscription Plans, Billing & Cancellation</h2>
              </div>
              <p>
                Postfly offers paid subscription tiers billed on a monthly or annual recurring basis. All payments within India are billed in Indian Rupees (INR ₹) via <strong>Razorpay</strong>.
              </p>
              
              <div className="space-y-3 pt-1 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 font-bold block">Pricing Tiers</strong>
                  <p className="text-slate-600">
                    Starter (₹2,999/mo), Growth (₹4,999/mo), and Pro Unlimited (₹7,999/mo). Annual commitments receive a 5% discount. Applicable Goods and Services Tax (GST) is calculated and displayed at checkout.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 font-bold block">Automatic Renewal & Cancellation</strong>
                  <p className="text-slate-600">
                    Subscriptions renew automatically at the end of each billing cycle unless cancelled prior to the renewal date. You can cancel your subscription at any time directly from <strong>Billing Settings</strong> with zero cancellation penalty.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 font-bold block">Refund & Dispute Policy</strong>
                  <p className="text-slate-600">
                    Because Postfly provides immediate cloud server allocations and AI credit access upon payment, subscription fees are generally non-refundable. However, if you experience a verified platform failure within 48 hours of purchase, you may contact support for a prorated refund evaluation.
                  </p>
                </div>
              </div>
            </section>

            {/* 7. Content Ownership & IP */}
            <section id="intellectual-property" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">07</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Intellectual Property & Content Ownership</h2>
              </div>
              <div className="space-y-3 pt-1 text-xs sm:text-sm">
                <p>
                  <strong>Your Content (You Own 100%):</strong> You retain full copyright, ownership, and intellectual property rights over all images, videos, audio, text, captions, and graphics that you upload, compose, or schedule through Postfly. Postfly claims zero ownership of your creative assets.
                </p>
                <p>
                  <strong>Limited License to Postfly:</strong> By using our publishing services, you grant Postfly a worldwide, non-exclusive, royalty-free license solely to host, cache, reformat (e.g. video aspect ratio resizing), and transmit your content to your connected social channels as directed by your schedule.
                </p>
                <p>
                  <strong>Postfly Intellectual Property:</strong> All software, logos, trademarks, website designs, algorithms, codebases, and documentation remain the exclusive property of Postfly Inc. and its licensors.
                </p>
              </div>
            </section>

            {/* 8. AI Disclaimers */}
            <section id="ai-disclaimers" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">08</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">AI Features & Generation Disclaimers</h2>
              </div>
              <p>
                Postfly integrates advanced generative artificial intelligence powered by the <strong>Google Gemini API</strong> for captions, hashtags, tone variations, and content ideas.
              </p>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-950 space-y-2">
                <p>• <strong>Verification Responsibility:</strong> AI generates outputs based on probabilistic patterns. You are solely responsible for reviewing, verifying, and editing all AI-generated captions and claims before publishing them live.</p>
                <p>• <strong>No Legal or Professional Advice:</strong> AI Copyright scans and suggestions provided by Postfly are automated heuristics and do not constitute formal legal counsel or guarantee against third-party copyright claims.</p>
              </div>
            </section>

            {/* 9. Warranty & Liability Caps */}
            <section id="warranties-liability" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">09</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Disclaimer of Warranties & Limitation of Liability</h2>
              </div>
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-2">
                <p>
                  <strong>&quot;AS-IS&quot; Provision:</strong> The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express, implied, or statutory, including warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
                <p>
                  <strong>Liability Cap:</strong> To the maximum extent permitted by applicable law, Postfly Inc., its directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, social media account suspension, lost data, or business interruption.
                </p>
                <p>
                  In no event shall Postfly&apos;s total aggregate liability exceed the total amount paid by you to Postfly in the twelve (12) months preceding the incident giving rise to liability.
                </p>
              </div>
            </section>

            {/* 10. Termination & Suspension */}
            <section id="termination" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">10</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Termination & Suspension</h2>
              </div>
              <p>
                You may terminate your account at any time by cancelling your subscription and requesting account closure.
              </p>
              <p>
                Postfly reserves the right to suspend or terminate your account immediately without prior notice if: (a) you materially breach these Terms; (b) your actions create liability or harm for Postfly, other users, or connected social networks; or (c) required by applicable law or social media API providers.
              </p>
            </section>

            {/* 11. Governing Law & Jurisdiction */}
            <section id="governing-law" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">11</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Governing Law & Dispute Resolution</h2>
              </div>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of <strong>India</strong>, without regard to its conflict of law principles.
              </p>
              <p>
                Any dispute, claim, or controversy arising out of or relating to these Terms or the breach thereof shall be subject to the exclusive jurisdiction of the competent courts located in <strong>New Delhi / Gautam Buddha Nagar (Noida), India</strong>.
              </p>
            </section>

            {/* 12. Contact & Support */}
            <section id="contact" className="scroll-mt-28 space-y-4 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">12</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Contact & Support Information</h2>
              </div>
              <p>
                If you have any questions, concerns, or notices regarding these Terms of Service, please reach out to our team:
              </p>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div>
                  <strong className="text-slate-900 text-sm block">Legal Operations — Postfly Inc.</strong>
                  <span className="text-slate-500">Postfly Technologies Inc.</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span><strong>Legal Email:</strong> legal@postfly.com / support@postfly.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span><strong>WhatsApp Helpline:</strong> +91 9511450914</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-slate-700 pt-1">
                  <Building className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span><strong>Headquarters:</strong> Postfly Technologies, Tech Park, Sector 62, Noida, Uttar Pradesh, India - 201309.</span>
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
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors no-underline">Privacy Policy</Link>
            <Link href="/terms" className="text-indigo-600 font-bold no-underline">Terms of Service</Link>
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp Support Button ── */}
      <a
        href="https://wa.me/919511450914?text=Hi%20Postfly%20Support,%20I%20have%20a%20query%20about%20your%20terms%20of%20service."
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
