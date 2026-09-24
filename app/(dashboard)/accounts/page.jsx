"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Link2, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  RefreshCw, 
  Settings, 
  ShieldCheck, 
  Send, 
  ExternalLink,
  Users,
  Check, 
  Zap, 
  ArrowRight,
  AlertTriangle,
  AlertCircle,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import ConnectModal from "@/components/modals/ConnectModal";
import { SocialCardSkeleton } from "@/components/ui/Skeletons";
import { PlatformIcon } from "@/components/ui/SocialIcons";
import { getStoredUser, getUserHeaders, checkPlanAccess, getUserPlanLimits } from "@/lib/user";

const SUPPORTED_PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    desc: "Publish Reels, carousels, and stories with automated comments",
    category: "Visual & Short Video"
  },
  {
    id: "facebook",
    name: "Facebook",
    desc: "Post to your Pages, manage discussions, and track engagement",
    category: "Community & Pages"
  },
  {
    id: "youtube",
    name: "YouTube",
    desc: "Auto-publish YouTube Shorts and schedule video releases",
    category: "Video & Shorts"
  },
  {
    id: "threads",
    name: "Threads",
    desc: "Post text threads, engage with followers, and schedule updates",
    category: "Micro-blogging"
  },
  {
    id: "twitter",
    name: "Twitter / X",
    desc: "Publish posts, automate threads, and monitor mentions",
    category: "Micro-blogging"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    desc: "Share professional articles, company updates, and insights",
    category: "Professional Network"
  },
  {
    id: "pinterest",
    name: "Pinterest",
    desc: "Create and publish Idea Pins and visual board collections",
    category: "Visual Discovery"
  }
];

export default function AccountsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">Loading channels...</div>}>
      <AccountsContent />
    </Suspense>
  );
}

function AccountsContent() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const limits = getUserPlanLimits(user);

  useEffect(() => {
    const u = getStoredUser();
    setUser(u);
    fetchAccounts(u.userId);

    const err = searchParams?.get("error");
    const connected = searchParams?.get("connected");

    if (err) {
      const decoded = decodeURIComponent(err);
      setErrorNotice(decoded);
      toast.error("Connection issue — see details below", { duration: 5000 });
    } else if (connected) {
      const platformLabel =
        connected === "facebook"
          ? "Facebook"
          : connected === "instagram"
          ? "Instagram"
          : connected.charAt(0).toUpperCase() + connected.slice(1);
      toast.success(`✅ ${platformLabel} connected! Refreshing channels...`, { duration: 4000 });
      // Auto-refresh after brief delay to show newly saved accounts
      setTimeout(() => fetchAccounts(getStoredUser()?.userId), 1200);
    }
  }, [searchParams]);

  const fetchAccounts = async (targetUserId) => {
    try {
      setIsSyncing(true);
      const activeUser = getStoredUser();
      const userIdToUse = targetUserId || activeUser.userId;

      const res = await fetch("/api/accounts", {
        headers: { "x-user-id": userIdToUse }
      });
      const data = await res.json();
      if (data.accounts) setAccounts(data.accounts);
    } catch (error) {
      toast.error("Failed to load connected accounts");
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  const handleOpenConnectModal = () => {
    const allowed = checkPlanAccess({
      action: "connect_channel",
      currentAccountCount: accounts.length,
      router,
      toast
    });
    if (allowed) {
      setIsModalOpen(true);
    }
  };

  const handleDirectConnect = (platformId) => {
    const allowed = checkPlanAccess({
      action: "connect_channel",
      currentAccountCount: accounts.length,
      router,
      toast
    });
    if (allowed) {
      const provider = platformId === "twitter" ? "twitter" : platformId;
      window.location.href = `/api/auth/connect/${provider}?userId=${user?.userId}`;
    }
  };

  const handleDelete = async (id, accountName) => {
    if (!confirm(`Are you sure you want to disconnect ${accountName || "this account"}?`)) return;
    try {
      const res = await fetch("/api/accounts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-user-id": user?.userId },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success("Channel disconnected successfully");
        setAccounts(accounts.filter(a => a._id !== id));
      }
    } catch (e) {
      toast.error("Failed to disconnect account");
    }
  };

  const getConnectedAccForPlatform = (platformId) => {
    return accounts.filter(a => a.platform?.toLowerCase() === platformId.toLowerCase());
  };

  const totalConnected = accounts.length;

  return (
    <div className="space-y-7 max-w-7xl mx-auto font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-950 tracking-tight">Social Channels</h1>
          <p className="text-xs lg:text-sm text-slate-600 mt-1 font-normal">
            Connect, authorize, and manage your social channels from one unified hub.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchAccounts(user?.userId)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
            title="Sync accounts status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-indigo-600" : "text-slate-500"}`} />
            <span className="hidden sm:inline">Refresh Channels</span>
          </button>

          <button
            onClick={handleOpenConnectModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-xs shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Connect Channel</span>
          </button>
        </div>
      </div>

      {/* Modern High-Contrast Error Alert UI */}
      {errorNotice && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-sm flex items-start justify-between gap-4 text-rose-950 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-200/80 text-rose-700 shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-rose-950">Channel Connection Notice</h3>
                <span className="px-2 py-0.5 rounded-md bg-rose-200 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed font-medium">
                {errorNotice}
              </p>
              {errorNotice.toLowerCase().includes("instagram") && (
                <p className="text-[11px] text-rose-800 bg-white/70 p-2.5 rounded-xl border border-rose-200/80 mt-2 font-normal leading-relaxed">
                  💡 <strong>Instagram tip:</strong> Instagram Business accounts are discovered via your linked Facebook Pages. Go to <strong>business.facebook.com</strong> → Settings → Instagram Accounts to link your Instagram to a Facebook Page first.
                </p>
              )}
              {(errorNotice.toLowerCase().includes("no facebook pages") || errorNotice.toLowerCase().includes("no pages found") || errorNotice.toLowerCase().includes("pages found")) && (
                <p className="text-[11px] text-rose-800 bg-white/70 p-2.5 rounded-xl border border-rose-200/80 mt-2 font-normal leading-relaxed">
                  💡 <strong>Dev Mode tip:</strong> During Meta App Review, the app can only access pages of the App Admin. Make sure you are logged in as <strong>Saifuddin Ansari</strong> (app owner) or added as a Tester in <a href="https://developers.facebook.com/apps/1401279338528045/roles/testers/" target="_blank" className="underline">Meta Developer Portal</a>.
                </p>
              )}
              {(errorNotice.toLowerCase().includes("permission") || errorNotice.toLowerCase().includes("role") || errorNotice.toLowerCase().includes("tester")) && (
                <p className="text-[11px] text-rose-800 bg-white/70 p-2.5 rounded-xl border border-rose-200/80 mt-2 font-normal leading-relaxed">
                  💡 <strong>Access tip:</strong> Ensure this Facebook account is added to <strong>App Roles ➔ Testers</strong> at <a href="https://developers.facebook.com" target="_blank" className="underline">developers.facebook.com</a> before connecting.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setErrorNotice(null)}
            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-900 hover:bg-rose-200/50 transition-colors shrink-0 cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Connected</span>
              <span className="text-lg font-bold text-slate-950">{totalConnected} Active Channels</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
            Live
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">API Sync Health</span>
              <span className="text-lg font-bold text-slate-950">100% Operational</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
            Auto-Sync
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Supported Networks</span>
              <span className="text-lg font-bold text-slate-950">{SUPPORTED_PLATFORMS.length} Platforms</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
            Ready
          </span>
        </div>
      </div>

      {/* Expired Trial Warning Banner */}
      {limits.isExpired && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">5-Day Free Trial Expired — Actions Blocked</h3>
              <p className="text-xs text-rose-700 mt-0.5">
                Your free trial has ended. Connecting new channels, publishing, and auto-sync are restricted until a subscription is activated.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/billing")}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm cursor-pointer"
          >
            Upgrade Plan Now →
          </button>
        </div>
      )}

      {/* Channels Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 7 }).map((_, i) => (
            <SocialCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SUPPORTED_PLATFORMS.map((platform) => {
            const connectedAccs = getConnectedAccForPlatform(platform.id);
            const isConnected = connectedAccs.length > 0;

            if (isConnected) {
              return connectedAccs.map((acc) => (
                <div 
                  key={acc._id} 
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    {/* Top Row: Brand Icon + Status Pill */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-1 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs">
                        <PlatformIcon platform={platform.id} className="w-9 h-9" />
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <Check className="w-3 h-3 stroke-[2.5]" /> Connected
                      </span>
                    </div>

                    {/* Account Name & Info */}
                    <div className="mt-3.5 space-y-1">
                      <h4 className="text-sm font-bold text-slate-950 truncate" title={acc.name || acc.accountName}>
                        {acc.name || acc.accountName || `${platform.name} Channel`}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="font-semibold text-indigo-600 truncate">
                          {acc.handle || (acc.username ? `@${acc.username.replace(/^@/, '')}` : "Connected")}
                        </span>
                        {acc.followersFormatted && (
                          <span className="text-slate-400 text-[11px] shrink-0 font-normal">• {acc.followersFormatted}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Auto-Sync On</span>
                    <button
                      onClick={() => handleDelete(acc._id, acc.accountName)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Disconnect
                    </button>
                  </div>
                </div>
              ));
            }

            {/* Unconnected Card */}
            return (
              <div 
                key={platform.id} 
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-1 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs">
                      <PlatformIcon platform={platform.id} className="w-9 h-9" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      Available
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-3.5">
                    <h4 className="text-sm font-bold text-slate-950">{platform.name}</h4>
                    <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed line-clamp-2">
                      {platform.desc}
                    </p>
                  </div>
                </div>

                {/* Connect Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleDirectConnect(platform.id)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 bg-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect Channel</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <ConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user?.userId}
        onFinish={() => fetchAccounts(user?.userId)}
      />

    </div>
  );
}
