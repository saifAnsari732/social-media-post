"use client";

import { useState } from "react";
import { FileCode, ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Promotion", "Business", "Marketing", "Announcement", "Festival", "Product", "Quotes"];

  const templates = [
    {
      id: 1,
      name: "Festival Discount Special Offer",
      category: "Festival",
      platform: "Instagram",
      previewText: "🎉 Festive Special Offer! Get up to 50% OFF on all premium products this season. Limited stock available!",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      name: "New Feature SaaS Announcement",
      category: "Announcement",
      platform: "LinkedIn",
      previewText: "🚀 Big News! We are thrilled to launch our new AI Automations feature to help agencies scale 10x faster.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      name: "Product Showcase Reel Caption",
      category: "Product",
      platform: "Facebook",
      previewText: "Meet the future of social automation. Built for high-growth brands and modern marketing teams.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80"
    }
  ];

  const filtered = templates.filter(t => activeCategory === "All" || t.category === activeCategory);

  const handleUseTemplate = (t) => {
    localStorage.setItem("selected_template", JSON.stringify(t));
    toast.success(`Template "${t.name}" loaded into Publisher!`);
    window.location.href = "/publisher";
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="pb-6 border-b border-slate-200/80">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Template Marketplace</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Pre-built high-converting social media post templates for your campaigns.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="h-44 bg-slate-100 relative overflow-hidden">
              <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider bg-violet-600 text-white px-2.5 py-1 rounded-full shadow-sm">
                {t.category}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{t.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{t.previewText}</p>
              </div>

              <button
                onClick={() => handleUseTemplate(t)}
                className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                Use Template <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
