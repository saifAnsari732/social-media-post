"use client";

import React, { useState, useRef } from "react";
import { Play, X, Star, CheckCircle2, ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function ClientReviewsSlider() {
  const [activeModal, setActiveModal] = useState(null);
  const sliderRef = useRef(null);

  const testimonials = [
    {
      id: "zeeshan",
      name: "Zeeshan",
      role: "E-commerce Founder",
      company: "Zeeshan Organics",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      quote: "Postfly completely transformed our social selling. Automated comment-to-DM triggers generated ₹3.4L in sales within our first month.",
      videoUrl: "/video-hero/hero-video.mp4",
      rating: 5,
      followers: "128K Followers",
      growth: "+42% Engagement"
    },
    {
      id: "aleks",
      name: "Aleks",
      role: "D2C Brand Owner",
      company: "Golden Harvest Foods",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      quote: "Managing 7 channels from one dashboard saved our marketing team over 25 hours every week. The 1-click scheduling is flawless.",
      videoUrl: "/video-hero/hero-video.mp4",
      rating: 5,
      followers: "85K Followers",
      growth: "3.5x Faster Workflow"
    },
    {
      id: "rajesh",
      name: "Rajesh",
      role: "Retail & Sweets Chain",
      company: "Rajesh Foods & Sweets",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      quote: "Our local festival campaigns went viral across Instagram and Facebook simultaneously. Postfly made scheduling feel effortless.",
      videoUrl: "/video-hero/hero-video.mp4",
      rating: 5,
      followers: "240K Followers",
      growth: "1.2M Monthly Views"
    },
    {
      id: "vikram",
      name: "Vikram",
      role: "Supermarket Franchise",
      company: "Kisan Choice Mart",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
      quote: "The AI caption generator understands Indian festival context and retail promotions like a human copywriter. 10/10 recommend.",
      videoUrl: "/video-hero/hero-video.mp4",
      rating: 5,
      followers: "65K Followers",
      growth: "50+ Weekly Posts"
    },
    {
      id: "siobhan",
      name: "Siobhan",
      role: "Retail Operations Lead",
      company: "Daily Needs Superstore",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      quote: "Automated DM replies give our customers immediate price checks and stock updates even when our physical stores are closed.",
      videoUrl: "/video-hero/hero-video.mp4",
      rating: 5,
      followers: "42K Followers",
      growth: "24/7 Response Rate"
    },
    {
      id: "john",
      name: "Pooja",
      role: "Business Coach & Educator",
      company: "Creator Scale Academy",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
      quote: "Postfly is the backbone of my personal brand. I schedule YouTube Shorts, LinkedIn articles, and Instagram Reels all at once.",
      videoUrl: "/video-hero/hero-video.mp4",
      rating: 5,
      followers: "310K Followers",
      growth: "+180% Community Reach"
    },
    {
      id: "saif",
      name: "Saif",
      role: "Digital Marketing Agency",
      company: "GrowthFlow Media",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      quote: "We handle 18 different client accounts seamlessly. White-label reports and Razorpay INR subscriptions make it the ultimate Indian SaaS.",
      videoUrl: "/video-hero/hero-video.mp4",
      rating: 5,
      followers: "500K+ Network",
      growth: "18 Active Clients"
    },
    {
      id: "jelly",
      name: "Jelly",
      role: "Lifestyle & Fashion Creator",
      company: "StyleWithJelly",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      quote: "The media library and Canva integration are super intuitive. I never miss peak publishing hours thanks to the automated scheduler.",
      videoUrl: "/video-hero/hero-video.mp4",
      rating: 5,
      followers: "195K Followers",
      growth: "98% On-time Schedule"
    },
    {
      id: "ananya",
      name: "Ananya",
      role: "Creative Director",
      company: "Vedic Roots Studio",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
      quote: "Real MongoDB persistence, zero downtime, and instant Meta Graph API sync. It feels years ahead of legacy social media tools.",
      videoUrl: "/video-hero/hero-video.mp4",
      rating: 5,
      followers: "115K Followers",
      growth: "+65% Video Reach"
    }
  ];

  // Duplicate for seamless infinite loop feel
  const duplicatedList = [...testimonials, ...testimonials];

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-[#143E37] py-20 sm:py-28 overflow-hidden select-none">
      
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-900/30 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-4xl mx-auto px-6 text-center space-y-4 relative z-10 mb-12 sm:mb-16">
        
        {/* Subtle pill box */}
        <div className="inline-block px-4 py-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-xs text-white/95 text-xs sm:text-sm font-medium tracking-wide shadow-xs">
          Real stories and testimonials
        </div>

        {/* Huge bold headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase">
          FROM OUR CLIENTS
        </h2>

        <p className="text-emerald-100/75 text-xs sm:text-sm max-w-xl mx-auto font-normal leading-relaxed">
          See how leading brands, e-commerce stores, and digital creators scale their audience using Postfly automation.
        </p>

        {/* Controls for manual scrolling on desktop */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={scrollLeft}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
            title="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-emerald-200/80">Click any card to watch review</span>
          <button
            onClick={scrollRight}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
            title="Scroll Right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Tilted Arc / Diagonal Slider Track ── */}
      <div className="relative w-full py-8 overflow-hidden">
        
        {/* The tilted rotational wrapper (-rotate-2 on mobile, -rotate-3 on desktop) */}
        <div className="w-full transform -rotate-1 sm:-rotate-3 scale-[1.03] transition-transform duration-300">
          
          <div
            ref={sliderRef}
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-6 px-8 scroll-smooth cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {duplicatedList.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                onClick={() => setActiveModal(client)}
                className="flex flex-col items-center shrink-0 group cursor-pointer transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Card Container with dark rounded frame */}
                <div className="relative w-40 sm:w-48 h-60 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 border-2 border-black/50 shadow-2xl shadow-black/40 group-hover:border-emerald-400/80 group-hover:shadow-emerald-500/30 transition-all duration-300">
                  
                  {/* Thumbnail Image */}
                  <img
                    src={client.image}
                    alt={client.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />
                  
                  {/* Brand Tag Top Right */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs border border-white/10 text-[9px] font-bold text-white/90">
                    Postfly
                  </div>

                  {/* Green Circular Play Button at Bottom Left (matching screenshot) */}
                  <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/60 group-hover:bg-emerald-400 group-hover:scale-110 transition-all">
                    <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                  </div>

                  {/* Growth Metric Badge */}
                  <div className="absolute bottom-3 right-3 text-[10px] font-bold text-emerald-300">
                    {client.growth}
                  </div>
                </div>

                {/* Client Name under Card */}
                <span className="mt-2.5 text-xs sm:text-sm font-semibold text-white/90 group-hover:text-emerald-300 transition-colors">
                  {client.name}
                </span>
                <span className="text-[10.5px] text-emerald-100/60 font-medium">
                  {client.company}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ── Interactive Video Testimonial Modal ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Video Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <video
                src={activeModal.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Client Info & Review Content */}
            <div className="p-6 space-y-4 bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeModal.image}
                    alt={activeModal.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-md"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>{activeModal.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </h3>
                    <p className="text-xs text-slate-400">
                      {activeModal.role} • <strong className="text-emerald-400">{activeModal.company}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(activeModal.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed italic relative">
                <Quote className="w-6 h-6 text-emerald-500/30 absolute top-2 right-3 pointer-events-none" />
                "{activeModal.quote}"
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                <span>Verified Subscriber Review</span>
                <span className="text-emerald-400 font-semibold">{activeModal.growth}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
