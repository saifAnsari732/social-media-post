"use client";

import { useState, useEffect } from "react";
import { Link2, Trash2, Plus, CheckCircle2, RefreshCw, BarChart2, Settings, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import ConnectModal from "@/components/modals/ConnectModal";
import { SocialCardSkeleton } from "@/components/ui/Skeletons";

const SUPPORTED_PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    desc: "Connect your Instagram Business or Creator account",
    color: "from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    badgeBg: "bg-pink-50 text-pink-700 border-pink-200",
    followersDefault: "12.5K",
    icon: (
      <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  {
    id: "facebook",
    name: "Facebook",
    desc: "Connect your Facebook Page",
    color: "from-[#1877F2] to-[#0052CC]",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    followersDefault: "8.4K",
    icon: (
      <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    id: "threads",
    name: "Threads",
    desc: "Connect your Threads account",
    color: "from-[#000000] to-[#111111]",
    badgeBg: "bg-slate-100 text-slate-800 border-slate-200",
    followersDefault: "4.2K",
    icon: <span className="font-mono text-xl font-black text-white">@</span>
  },
  {
    id: "twitter",
    name: "Twitter / X",
    desc: "Connect your X account",
    color: "from-[#000000] to-[#1DA1F2]",
    badgeBg: "bg-slate-100 text-slate-800 border-slate-200",
    followersDefault: "6.9K",
    icon: (
      <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  {
    id: "tiktok",
    name: "TikTok",
    desc: "Connect your TikTok account",
    color: "from-[#000000] to-[#FE2C55]",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
    followersDefault: "18.1K",
    icon: (
      <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.26c.01 2.45-.8 4.88-2.43 6.69-1.63 1.8-3.98 2.85-6.43 2.89-2.45.04-4.88-.84-6.66-2.51-1.78-1.67-2.77-4.04-2.73-6.49.04-2.45.99-4.8 2.73-6.52 1.73-1.71 4.12-2.65 6.57-2.62 1.24.01 2.47.3 3.58.85v4.25c-.71-.43-1.53-.67-2.37-.67-1.39 0-2.72.56-3.7 1.55-.98.99-1.53 2.33-1.51 3.72.02 1.39.59 2.72 1.59 3.69 1 1 2.34 1.53 3.73 1.5 1.39-.03 2.71-.6 3.68-1.6 1-.99 1.54-2.34 1.52-3.73V.02z"/>
      </svg>
    )
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    desc: "Connect your LinkedIn profile or page",
    color: "from-[#0A66C2] to-[#004182]",
    badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
    followersDefault: "3.5K",
    icon: (
      <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
      </svg>
    )
  },
  {
    id: "youtube",
    name: "YouTube",
    desc: "Connect your YouTube Channel",
    color: "from-[#FF0000] to-[#CC0000]",
    badgeBg: "bg-red-50 text-red-700 border-red-200",
    followersDefault: "24.8K",
    icon: (
      <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  {
    id: "pinterest",
    name: "Pinterest",
    desc: "Connect your Pinterest account",
    color: "from-[#E60023] to-[#AD001A]",
    badgeBg: "bg-red-50 text-red-700 border-red-200",
    followersDefault: "9.1K",
    icon: (
      <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/>
      </svg>
    )
  }
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("yt_user");
    if (userStr) {
      const u = JSON.parse(userStr);
      setUser(u);
      fetchAccounts(u.userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAccounts = async (userId) => {
    try {
      const res = await fetch("/api/accounts", {
        headers: { "x-user-id": userId }
      });
      const data = await res.json();
      if (data.accounts) setAccounts(data.accounts);
    } catch (error) {
      toast.error("Failed to load connected accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to disconnect this account? Automation rules linked to it may stop working.")) return;
    try {
      const res = await fetch("/api/accounts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-user-id": user?.userId },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success("Account disconnected successfully");
        setAccounts(accounts.filter(a => a._id !== id));
      }
    } catch (e) {
      toast.error("Failed to disconnect account");
    }
  };

  const getConnectedAccForPlatform = (platformId) => {
    return accounts.filter(a => a.platform?.toLowerCase() === platformId.toLowerCase());
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header (Matches Section 7 & Screenshot 1 of Prompt) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Social Channels</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Connect and manage all your social accounts from one unified workspace.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Connect Channel
        </button>
      </div>

      {/* Channels Grid (Matches Screenshot 1 layout) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SocialCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SUPPORTED_PLATFORMS.map((platform) => {
            const connectedAccs = getConnectedAccForPlatform(platform.id);
            const isConnected = connectedAccs.length > 0;

            if (isConnected) {
              return (
                <div key={platform.id} className="space-y-4">
                  {connectedAccs.map((acc) => (
                    <div 
                      key={acc._id} 
                      className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${platform.color} flex items-center justify-center shadow-md`}>
                            {platform.icon}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate">{acc.name || platform.name}</h4>
                            <span className="text-[11px] font-medium text-slate-400 capitalize">{platform.id} Account</span>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Connected
                        </span>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Followers</span>
                          <span className="font-extrabold text-slate-900">
                            {acc.followersFormatted || (acc.followers !== null && acc.followers !== undefined ? (acc.followers > 1000 ? `${(acc.followers/1000).toFixed(1)}K` : acc.followers) : "0")}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Synced</span>
                          <span className="text-slate-600 font-medium">Just now</span>
                        </div>
                      </div>

                      {/* Action Toolbar */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold">
                        <button 
                          onClick={() => window.location.href = `/publisher?platform=${platform.id}`}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center gap-1.5"
                        >
                          Manage <Settings className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(acc._id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center gap-1.5"
                        >
                          Disconnect <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            {/* Disconnected Card (Matches Postora dashed card style) */}
            return (
              <div 
                key={platform.id} 
                className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 shadow-sm hover:border-indigo-400 hover:bg-slate-50/50 transition-all flex flex-col items-center text-center justify-between space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${platform.color} flex items-center justify-center shadow-md`}>
                  {platform.icon}
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900">{platform.name}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">{platform.desc}</p>
                </div>

                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                  Not Connected
                </span>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-800 font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                >
                  Connect Account
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Multi-Step Connect Modal */}
      <ConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user?.userId}
        onFinish={() => fetchAccounts(user?.userId)}
      />

    </div>
  );
}
