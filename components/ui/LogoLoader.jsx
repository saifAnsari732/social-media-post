"use client";

import React from "react";

export default function LogoLoader({ 
  fullScreen = true, 
  title = "Postfly", 
  message = "Loading your workspace...", 
  subtext = "Syncing social channels and database state" 
}) {
  const content = (
    <div className="relative flex flex-col items-center justify-center text-center p-8 max-w-sm w-full mx-auto select-none">
      
      {/* Animated Orbiting Ring & Logo Container */}
      <div className="relative flex items-center justify-center w-36 h-36 mb-6">
        
        {/* Soft Background Radial Glow */}
        <div className="absolute inset-0 bg-indigo-500/15 rounded-full blur-2xl animate-pulse pointer-events-none" />
        
        {/* Outer Orbit Ring with subtle dashed border */}
        <div className="absolute inset-1 rounded-full border-2 border-dashed border-indigo-200/80 animate-orbit-spin" />
        
        {/* Glowing Gradient Ring */}
        <div className="absolute inset-3 rounded-full border border-indigo-500/30 bg-gradient-to-tr from-indigo-50 via-white to-purple-50 shadow-inner" />
        
        {/* Postfly Brand Logo */}
        <div className="relative z-10 w-24 h-24 flex items-center justify-center animate-logo-pulse">
          <img 
            src="/postflyLOGO.png" 
            alt="Postfly Logo" 
            className="w-20 h-20 object-contain drop-shadow-md pointer-events-none" 
          />
        </div>

        {/* Orbiting Satellite Dot */}
        <div className="absolute inset-0 animate-orbit-spin pointer-events-none">
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-600 shadow-sm shadow-indigo-600/50 border-2 border-white" />
        </div>
      </div>

      {/* Brand Title */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-xl font-black tracking-tight text-slate-900">
          Post<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">fly</span>
        </span>
        <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-[10px] font-extrabold uppercase tracking-widest text-indigo-700">
          Live
        </span>
      </div>

      {/* Status Message */}
      <p className="text-sm font-bold text-slate-800 tracking-tight mb-1">
        {message}
      </p>
      <p className="text-xs text-slate-400 font-medium mb-5">
        {subtext}
      </p>

      {/* Sleek Shimmer Progress Bar */}
      <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/60 shadow-inner">
        <div className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 rounded-full animate-progress-shimmer" />
      </div>

      {/* Security Tag */}
      <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/70 text-[11px] font-semibold text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        <span>Enterprise SSL Encrypted</span>
      </div>

    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8FAFC]/90 backdrop-blur-md">
        <div className="bg-white/95 rounded-3xl border border-slate-200/90 shadow-2xl p-4 sm:p-6 backdrop-blur-md">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
