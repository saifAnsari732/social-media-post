"use client";

import { useState } from "react";
import { X, CheckCircle2, ArrowRight, HelpCircle, ArrowLeft, ShieldCheck, Sparkles, Check } from "lucide-react";
import { PlatformIcon } from "@/components/ui/SocialIcons";

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    desc: "Connect your Business or Creator account",
  },
  {
    id: "facebook",
    name: "Facebook",
    desc: "Connect your Facebook Page & Groups",
  },
  {
    id: "youtube",
    name: "YouTube",
    desc: "Connect your YouTube Channel & Shorts",
  },
  {
    id: "threads",
    name: "Threads",
    desc: "Connect your Threads account for auto-publishing",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    desc: "Connect your X account and post threads",
  },
  {
    id: "tiktok",
    name: "TikTok",
    desc: "Connect your TikTok creator account",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    desc: "Connect your LinkedIn profile or company page",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    desc: "Connect your Pinterest business account",
  }
];

export default function ConnectModal({ isOpen, onClose, userId, onFinish }) {
  const [step, setStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [accountType, setAccountType] = useState("professional");

  if (!isOpen) return null;

  const handleSelectPlatform = (platform) => {
    setSelectedPlatform(platform);
    setStep(2);
  };

  const handleAuthorize = () => {
    if (!selectedPlatform) return;
    const provider = selectedPlatform.id === "twitter" ? "twitter" : selectedPlatform.id;
    window.location.href = `/api/auth/connect/${provider}?userId=${userId}`;
  };

  const resetModal = () => {
    setStep(1);
    setSelectedPlatform(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)} 
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-950">
                {step === 1 && "Connect New Social Channel"}
                {step === 2 && `Configure ${selectedPlatform?.name} Channel`}
                {step === 3 && `Authorize with ${selectedPlatform?.name}`}
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                {step === 1 && "Select the platform you want to link to your workspace"}
                {step === 2 && "Determine the access features available for your account"}
                {step === 3 && "You will be redirected to official OAuth authentication"}
              </p>
            </div>
          </div>
          <button
            onClick={resetModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: SELECT PLATFORM */}
          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlatform(p)}
                  className="group flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/20 hover:shadow-xs transition-all text-center space-y-2.5 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                    <PlatformIcon platform={p.id} className="w-12 h-12" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.name}</h4>
                    <span className="text-[11px] font-medium text-slate-400">Link Channel</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: CHOOSE ACCOUNT TYPE */}
          {step === 2 && selectedPlatform && (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs">
                  <PlatformIcon platform={selectedPlatform.id} className="w-10 h-10" />
                </div>
                <h4 className="text-base font-bold text-slate-950">Select your {selectedPlatform.name} account type</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Personal Option */}
                <div 
                  onClick={() => setAccountType("personal")}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    accountType === "personal" 
                      ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20 shadow-xs" 
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-bold text-slate-950">Personal Account</h5>
                      {accountType === "personal" && <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />}
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Standard personal profile for simple updates.</p>
                    <ul className="space-y-2 text-xs text-slate-600 mb-4">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Manual notification publishing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Basic profile sync
                      </li>
                    </ul>
                  </div>
                  <button className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50">
                    Connect Personal
                  </button>
                </div>

                {/* Professional Option */}
                <div 
                  onClick={() => setAccountType("professional")}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                    accountType === "professional" 
                      ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20 shadow-xs" 
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <span className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                    Recommended
                  </span>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-bold text-slate-950">Business / Creator</h5>
                      {accountType === "professional" && <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />}
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Unlocks direct automated posting & analytics.</p>
                    <ul className="space-y-2 text-xs text-slate-700 font-medium mb-4">
                      <li className="flex items-center gap-2 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Direct Auto-Publishing
                      </li>
                      <li className="flex items-center gap-2 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Audience reach & follower analytics
                      </li>
                      <li className="flex items-center gap-2 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Comment & DM automation rules
                      </li>
                    </ul>
                  </div>
                  <button className="w-full py-2 px-3 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 shadow-2xs">
                    Connect Business
                  </button>
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleAuthorize}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Authorize with {selectedPlatform.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
