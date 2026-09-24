"use client";

import React, { useState, useRef } from "react";
import { 
  Star, 
  CheckCircle2, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  HeartHandshake,
  MessageSquareQuote,
  Award
} from "lucide-react";

export default function ClientReviewsSlider() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isPaused, setIsPaused] = useState(false);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  const reviews = [
    {
      id: "zeeshan",
      name: "Zeeshan Ansari",
      role: "E-Commerce Founder",
      company: "Zeeshan Organics",
      category: "ecommerce",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      quote: "Postfly completely transformed our social selling. Automated comment-to-DM triggers generated ₹3.4L in sales within our first month alone.",
      rating: 5,
      impact: "+₹3.4L Sales in 30 Days",
      channels: "Instagram + Facebook",
      plan: "Growth Plan",
      verified: true
    },
    {
      id: "aleks",
      name: "Aleksandar M.",
      role: "Head of Marketing",
      company: "Golden Harvest Foods",
      category: "brands",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      quote: "Managing 7 channels from one unified dashboard saved our marketing team 25+ hours every week. The 1-click multi-post scheduling is flawless.",
      rating: 5,
      impact: "Saved 25+ Hrs/Week",
      channels: "7 Channels Synced",
      plan: "Pro Enterprise",
      verified: true
    },
    {
      id: "rajesh",
      name: "Rajesh Sharma",
      role: "Managing Director",
      company: "Rajesh Foods & Sweets",
      category: "retail",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
      quote: "Our festival campaigns went viral across Instagram, Facebook, and YouTube Shorts simultaneously. Postfly made scheduling effortless.",
      rating: 5,
      impact: "1.2M Organic Views",
      channels: "Instagram + YouTube",
      plan: "Growth Plan",
      verified: true
    },
    {
      id: "vikram",
      name: "Vikramaditya Rao",
      role: "Franchise Owner",
      company: "Kisan Choice Mart",
      category: "retail",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
      quote: "The AI caption generator understands Indian retail promotions and local festival context like an expert human copywriter. 10/10 recommend.",
      rating: 5,
      impact: "50+ Weekly Posts",
      channels: "AI Copy + Meta",
      plan: "Pro Plan",
      verified: true
    },
    {
      id: "siobhan",
      name: "Siobhan Kelly",
      role: "Operations Lead",
      company: "Daily Needs Superstore",
      category: "retail",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      quote: "The automated DM replies give our shoppers immediate price checks and stock updates even when our physical stores are closed at night.",
      rating: 5,
      impact: "24/7 Response Rate",
      channels: "Social Inbox + DMs",
      plan: "Growth Plan",
      verified: true
    },
    {
      id: "pooja",
      name: "Pooja Aggarwal",
      role: "Creator & Educator",
      company: "Creator Scale Academy",
      category: "creators",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      quote: "Postfly is the backbone of my personal brand. I schedule YouTube Shorts, LinkedIn articles, and Instagram Reels all in one go.",
      rating: 5,
      impact: "+180% Community Reach",
      channels: "LinkedIn + YouTube + Reels",
      plan: "Pro Plan",
      verified: true
    },
    {
      id: "saif",
      name: "Saifuddin Ansari",
      role: "Agency Founder",
      company: "GrowthFlow Media",
      category: "agencies",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      quote: "We manage 18 client accounts with zero confusion. Granular client permissions and INR Razorpay billing make it the best SaaS platform.",
      rating: 5,
      impact: "18 Client Accounts",
      channels: "Agency Multi-Tenant",
      plan: "Enterprise Pro",
      verified: true
    },
    {
      id: "jelly",
      name: "Jelly Verma",
      role: "Lifestyle Creator",
      company: "StyleWithJelly",
      category: "creators",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      quote: "The visual calendar and media library are super intuitive. I never miss peak publishing hours thanks to the automated scheduler.",
      rating: 5,
      impact: "99.2% On-Time Posts",
      channels: "Visual Calendar + Insta",
      plan: "Starter Pro",
      verified: true
    },
    {
      id: "ananya",
      name: "Ananya Deshmukh",
      role: "Creative Director",
      company: "Vedic Roots Studio",
      category: "brands",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      quote: "Multi-image carousels and direct Reels publishing without compression artifacts. It feels years ahead of legacy social media tools.",
      rating: 5,
      impact: "+65% Video Reach",
      channels: "Reels + Threads + Meta",
      plan: "Growth Plan",
      verified: true
    },
    {
      id: "rohan",
      name: "Rohan Mehta",
      role: "Growth Lead",
      company: "TechPulse Media",
      category: "agencies",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
      quote: "Connecting YouTube, Twitter, and LinkedIn took under 60 seconds. The live analytics and unified social inbox keep our entire team aligned.",
      rating: 5,
      impact: "3.8x Follower Growth",
      channels: "Twitter + YouTube + LinkedIn",
      plan: "Pro Enterprise",
      verified: true
    }
  ];

  const categories = [
    { id: "all", label: "All Reviews" },
    { id: "ecommerce", label: "E-Commerce & D2C" },
    { id: "agencies", label: "Agencies & Teams" },
    { id: "creators", label: "Creators & Influencers" },
    { id: "retail", label: "Retail & Franchises" }
  ];

  const filteredReviews = selectedCategory === "all" 
    ? reviews 
    : reviews.filter(r => r.category === selectedCategory);

  // Split into 2 rows for dual smooth marquee sliding
  const halfLength = Math.ceil(filteredReviews.length / 2);
  const row1List = filteredReviews.slice(0, halfLength);
  const row2List = filteredReviews.slice(halfLength);

  // Multiply lists for continuous infinite glide
  const infiniteRow1 = [...row1List, ...row1List, ...row1List, ...row1List];
  const infiniteRow2 = [...row2List, ...row2List, ...row2List, ...row2List];

  const handleManualScroll = (direction) => {
    const scrollAmount = direction === "left" ? -400 : 400;
    if (row1Ref.current) {
      row1Ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
    if (row2Ref.current) {
      row2Ref.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-slate-950 py-24 sm:py-32 overflow-hidden select-none border-y border-slate-800/80">
      
      {/* Dynamic Background Lighting Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Modern Grid Pattern Accent */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-12 sm:mb-16">
          
          {/* Rating Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg text-xs font-semibold text-slate-200">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-white">4.9 / 5.0</span>
            <span className="text-slate-500">•</span>
            <span className="text-indigo-300 font-medium">2,400+ Verified Client Reviews</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Loved by Growing <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">Brands & Creators</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            See how founders, agencies, and social media managers automate publishing, engage audiences, and scale organic reach with Postfly.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400 scale-105"
                    : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Controls Bar (Pause / Scroll Arrow Navigation) */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => handleManualScroll("left")}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
              title="Previous Reviews"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 font-medium px-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Hover over cards to pause floating slide
            </span>
            <button
              onClick={() => handleManualScroll("right")}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
              title="Next Reviews"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* ── DIAGONAL SLANTED MARQUEE SLIDER CONTAINER ("TIRCHAA" Top-Right to Bottom-Left) ── */}
      <div 
        className="relative w-full py-6 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* Left & Right Edge Vignette Fades */}
        <div className="absolute top-0 bottom-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-30 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent z-30 pointer-events-none" />

        {/* Slanted Rotated Wrapper: Tilted at -4deg / -5deg for top-right to bottom-left motion */}
        <div className="transform -rotate-2 sm:-rotate-3 lg:-rotate-4 scale-105 sm:scale-110 space-y-6 sm:space-y-8 my-6 transition-transform duration-500">
          
          {/* ── ROW 1: Gliding Top-Right to Bottom-Left ── */}
          <div 
            ref={row1Ref}
            className="flex overflow-x-hidden"
          >
            <div 
              className="animate-marquee-smooth flex items-stretch gap-6 px-3"
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
            >
              {infiniteRow1.map((item, idx) => (
                <ReviewCard key={`r1-${item.id}-${idx}`} review={item} />
              ))}
            </div>
          </div>

          {/* ── ROW 2: Counter-Gliding Stream ── */}
          <div 
            ref={row2Ref}
            className="flex overflow-x-hidden"
          >
            <div 
              className="animate-marquee-reverse flex items-stretch gap-6 px-3"
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
            >
              {infiniteRow2.map((item, idx) => (
                <ReviewCard key={`r2-${item.id}-${idx}`} review={item} />
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Trust Stats Footer Strip */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 pt-10 border-t border-slate-800/80 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="space-y-1 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <h4 className="text-2xl sm:text-3xl font-black text-white">99.4%</h4>
            <p className="text-xs text-slate-400 font-medium">Customer Satisfaction</p>
          </div>
          <div className="space-y-1 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <h4 className="text-2xl sm:text-3xl font-black text-indigo-400">10M+</h4>
            <p className="text-xs text-slate-400 font-medium">Posts Auto-Published</p>
          </div>
          <div className="space-y-1 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <h4 className="text-2xl sm:text-3xl font-black text-emerald-400">25+ Hrs</h4>
            <p className="text-xs text-slate-400 font-medium">Saved Per Team Weekly</p>
          </div>
          <div className="space-y-1 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
            <h4 className="text-2xl sm:text-3xl font-black text-amber-400">4.9 ★</h4>
            <p className="text-xs text-slate-400 font-medium">Average Client Rating</p>
          </div>
        </div>
      </div>

    </section>
  );
}

// ── Single Review Card Component ──
function ReviewCard({ review }) {
  return (
    <div className="w-[340px] sm:w-[390px] shrink-0 p-6 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-800/90 hover:border-indigo-500/70 shadow-xl hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between space-y-4 group">
      
      {/* Card Header: Rating Stars + Impact Pill */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-amber-400">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400" />
          ))}
        </div>

        {/* Impact / Growth Metric Pill */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-[11px] font-bold text-emerald-300 shadow-sm">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          {review.impact}
        </span>
      </div>

      {/* Quote Body */}
      <div className="relative py-1">
        <Quote className="w-6 h-6 text-indigo-500/25 absolute -top-2 -left-1 pointer-events-none group-hover:text-indigo-400/40 transition-colors" />
        <p className="text-xs sm:text-[13px] text-slate-200 font-normal leading-relaxed pl-3 group-hover:text-white transition-colors">
          "{review.quote}"
        </p>
      </div>

      {/* Card Footer: User Avatar, Name, Role & Social Channels Tag */}
      <div className="pt-4 border-t border-slate-800/90 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img 
              src={review.avatar} 
              alt={review.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-400 transition-all"
              loading="lazy"
            />
            {review.verified && (
              <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center ring-2 ring-slate-900" title="Verified Client">
                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-slate-950" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
              {review.name}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              {review.role} • <span className="text-slate-300 font-medium">{review.company}</span>
            </p>
          </div>
        </div>

        {/* Channels Tag */}
        <span className="shrink-0 text-[10px] font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-1 rounded-md">
          {review.channels}
        </span>
      </div>

    </div>
  );
}
