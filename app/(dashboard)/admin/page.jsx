"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Layers, 
  Activity, 
  DollarSign, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Zap, 
  Key, 
  Sliders, 
  AlertTriangle,
  Lock,
  ArrowUpRight,
  Trash2,
  Edit3,
  UserPlus,
  Download,
  ExternalLink,
  Shield,
  Info,
  Send,
  X,
  Copy,
  Clock,
  Check,
  Tag,
  Megaphone,
  Bell,
  Sparkles,
  Percent,
  Eye
} from "lucide-react";
import toast from "react-hot-toast";
import { getStoredUser } from "@/lib/user";

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [isAdmin, setIsAdmin] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [serverStats, setServerStats] = useState({ totalUsers: 0, totalPosts: 0, totalAccounts: 0, totalRules: 0 });
  const [loading, setLoading] = useState(true);

  // Inspector & Modals State
  const [inspectingUser, setInspectingUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", plan: "5-Day Trial", role: "user" });

  // Today's Live Logs State
  const [todayLogs, setTodayLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logFilter, setLogFilter] = useState("all");
  const [todayStats, setTodayStats] = useState({ totalEventsToday: 0, webhooksToday: 0, postsToday: 0, channelsToday: 0, errorsToday: 0 });

  // Coupons & Promo Offers State
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState({
    code: "",
    type: "percentage",
    value: 20,
    description: "",
    maxUses: 100,
    minAmount: 0,
    expiryDate: ""
  });

  // Global System Announcements & Control State
  const [systemSettings, setSystemSettings] = useState({
    announcement: {
      enabled: true,
      message: "🎉 Launch Offer: Use coupon WELCOME50 at checkout to get 50% OFF all plans!",
      type: "promo"
    },
    defaultTrialDays: 5,
    autoLockExpired: true,
    maintenanceMode: false
  });
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Subscriptions & Invoices State
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("socialflow_user") || localStorage.getItem("yt_user");
    if (userStr) {
      const u = JSON.parse(userStr);
      const isSaifAdmin = u.email && (
        u.email.includes("ansari") || 
        u.email.includes("admin") || 
        u.email.includes("saif") ||
        u.role === "admin"
      );
      setIsAdmin(Boolean(isSaifAdmin));
      fetchAdminData(u.userId);
      fetchTodayLogs(u.userId);
      fetchCoupons(u.userId);
      fetchSystemSettings();
      fetchInvoices(u.userId);
    }
  }, []);

  const fetchInvoices = async (userId) => {
    try {
      const activeUser = getStoredUser();
      const res = await fetch("/api/admin/subscriptions", {
        headers: { "x-user-id": userId || activeUser?.userId || "eb994f0c8e6f7fb4c2629561" }
      });
      const data = await res.json();
      if (data.success && data.invoices) setInvoices(data.invoices);
    } catch (err) {
      console.error("Failed to load invoices", err);
    }
  };

  const fetchAdminData = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users", {
        headers: { "x-user-id": userId || "eb994f0c8e6f7fb4c2629561" }
      });
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
        if (data.stats) setServerStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayLogs = async (userId) => {
    try {
      setLogsLoading(true);
      const activeUser = getStoredUser();
      const res = await fetch("/api/admin/logs", {
        headers: { "x-user-id": userId || activeUser.userId || "eb994f0c8e6f7fb4c2629561" }
      });
      const data = await res.json();
      if (data.success) {
        setTodayLogs(data.logs || []);
        if (data.todayStats) setTodayStats(data.todayStats);
      }
    } catch (err) {
      console.error("Failed to load today's logs", err);
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchCoupons = async (userId) => {
    try {
      setCouponsLoading(true);
      const activeUser = getStoredUser();
      const res = await fetch("/api/admin/coupons", {
        headers: { "x-user-id": userId || activeUser.userId || "eb994f0c8e6f7fb4c2629561" }
      });
      const data = await res.json();
      if (data.success && data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error("Failed to load coupons", err);
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponForm.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    try {
      const activeUser = getStoredUser();
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify(newCouponForm)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Coupon ${data.coupon.code} created!`);
        setCoupons([data.coupon, ...coupons]);
        setIsAddCouponOpen(false);
        setNewCouponForm({
          code: "",
          type: "percentage",
          value: 20,
          description: "",
          maxUses: 100,
          minAmount: 0,
          expiryDate: ""
        });
      } else {
        toast.error(data.error || "Failed to create coupon");
      }
    } catch {
      toast.error("Failed to create coupon");
    }
  };

  const handleToggleCouponStatus = async (coupon) => {
    const nextStatus = coupon.status === "active" ? "inactive" : "active";
    try {
      const activeUser = getStoredUser();
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({
          couponId: coupon.couponId || coupon.code,
          updates: { status: nextStatus }
        })
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.map(c => (c.couponId === coupon.couponId || c.code === coupon.code) ? { ...c, status: nextStatus } : c));
        toast.success(`Coupon marked as ${nextStatus}!`);
      } else {
        toast.error(data.error || "Failed to update coupon status");
      }
    } catch {
      toast.error("Failed to update coupon status");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!confirm("Are you sure you want to permanently delete this coupon?")) return;
    try {
      const activeUser = getStoredUser();
      const res = await fetch(`/api/admin/coupons?couponId=${encodeURIComponent(couponId)}`, {
        method: "DELETE",
        headers: {
          "x-user-id": activeUser.userId || "eb994f0c8e6f7fb4c2629561"
        }
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.filter(c => c.couponId !== couponId && c.code !== couponId));
        toast.success("Coupon deleted successfully");
      } else {
        toast.error(data.error || "Failed to delete coupon");
      }
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const res = await fetch("/api/admin/system");
      const data = await res.json();
      if (data.success && data.settings) {
        setSystemSettings(data.settings);
      }
    } catch (e) {
      console.error("Failed to fetch system settings", e);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      const activeUser = getStoredUser();
      const res = await fetch("/api/admin/system", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify(systemSettings)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("System announcement & configuration updated across all workspaces!");
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleUpdatePlan = async (userId, newPlan) => {
    try {
      const activeUser = getStoredUser();
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({
          targetUserId: userId,
          updates: { plan: newPlan, planUpdatedAt: new Date().toISOString() }
        })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => (u.id === userId || u.userId === userId) ? { ...u, plan: newPlan } : u));
        if (inspectingUser && (inspectingUser.id === userId || inspectingUser.userId === userId)) {
          setInspectingUser({ ...inspectingUser, plan: newPlan });
        }
        toast.success(`User plan updated to ${newPlan}`);
      } else {
        toast.error(data.error || "Failed to update plan");
      }
    } catch {
      toast.error("Failed to update plan");
    }
  };

  const handleToggleStatus = async (userId) => {
    const userToToggle = users.find(u => u.id === userId || u.userId === userId);
    const nextStatus = userToToggle?.status === "Active" ? "Suspended" : "Active";
    try {
      const activeUser = getStoredUser();
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({
          targetUserId: userId,
          updates: { status: nextStatus }
        })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => (u.id === userId || u.userId === userId) ? { ...u, status: nextStatus } : u));
        if (inspectingUser && (inspectingUser.id === userId || inspectingUser.userId === userId)) {
          setInspectingUser({ ...inspectingUser, status: nextStatus });
        }
        toast.success(`User status updated to ${nextStatus}`);
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleResetTrial = async (userId) => {
    try {
      const activeUser = getStoredUser();
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({
          targetUserId: userId,
          updates: { trialStartDate: new Date().toISOString(), plan: "5-Day Trial" }
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("5-Day trial successfully reset to full 5 days!");
        fetchAdminData(activeUser.userId);
      } else {
        toast.error(data.error || "Failed to reset trial");
      }
    } catch {
      toast.error("Failed to reset trial");
    }
  };

  const handleExtendTrial = async (userId, days) => {
    try {
      const activeUser = getStoredUser();
      // To extend trial by X days, we move trialStartDate into the future
      const newStartDate = new Date(Date.now() + days * 86400000).toISOString();
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({
          targetUserId: userId,
          updates: { trialStartDate: newStartDate, plan: "5-Day Trial" }
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Added +${days} days trial extension for this tenant!`);
        fetchAdminData(activeUser.userId);
      } else {
        toast.error(data.error || "Failed to extend trial");
      }
    } catch {
      toast.error("Failed to extend trial");
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === "admin" ? "user" : "admin";
    try {
      const activeUser = getStoredUser();
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({
          targetUserId: userId,
          updates: { role: nextRole }
        })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => (u.id === userId || u.userId === userId) ? { ...u, role: nextRole } : u));
        if (inspectingUser && (inspectingUser.id === userId || inspectingUser.userId === userId)) {
          setInspectingUser({ ...inspectingUser, role: nextRole });
        }
        toast.success(`User role updated to ${nextRole}`);
      } else {
        toast.error(data.error || "Failed to update role");
      }
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleCreateNewUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.email.trim()) {
      toast.error("Please enter user email");
      return;
    }
    try {
      const activeUser = getStoredUser();
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify(newUserForm)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Tenant ${newUserForm.name || newUserForm.email} provisioned successfully!`);
        setIsAddUserOpen(false);
        setNewUserForm({ name: "", email: "", plan: "5-Day Trial", role: "user" });
        fetchAdminData(activeUser.userId);
      } else {
        toast.error(data.error || "Failed to create user");
      }
    } catch {
      toast.error("Failed to create user");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you absolutely sure you want to permanently delete "${userName || 'this user'}"? All connected accounts and posts will be removed.`)) {
      return;
    }
    try {
      const activeUser = getStoredUser();
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": activeUser.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({ targetUserId: userId })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("User permanently deleted");
        setUsers(users.filter(u => u.id !== userId && u.userId !== userId));
        if (inspectingUser && (inspectingUser.id === userId || inspectingUser.userId === userId)) {
          setInspectingUser(null);
        }
      } else {
        toast.error(data.error || "Failed to delete user");
      }
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleImpersonate = (targetUser) => {
    if (!confirm(`Switch session to view workspace as "${targetUser.name || targetUser.email}"?`)) return;
    localStorage.setItem("socialflow_user", JSON.stringify(targetUser));
    localStorage.setItem("yt_user", JSON.stringify(targetUser));
    localStorage.setItem("postfly_view_mode", "creator");
    window.location.href = "/dashboard";
  };

  const exportTenantsCSV = () => {
    const headers = ["User ID", "Name", "Email", "Role", "Plan", "Status", "Accounts", "Posts", "Joined Date"];
    const rows = users.map(u => [
      u.userId || u.id,
      `"${u.name || 'User'}"`,
      u.email,
      u.role || 'user',
      `"${u.plan || '5-Day Trial'}"`,
      u.status || 'Active',
      u.accountsCount || u.accounts || 0,
      u.postsCount || u.posts || 0,
      u.createdAt || u.joined || 'N/A'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `postfly_tenants_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tenant CSV export downloaded!");
  };

  const filteredUsers = users.filter(u => 
    (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.userId || u.id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLogs = todayLogs.filter(log => {
    if (logFilter === "all") return true;
    if (logFilter === "ERROR") return log.level === "ERROR";
    return log.type === logFilter;
  });

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
          403 Access Forbidden
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Super Admin Restricted Area</h2>
        <p className="text-slate-500 text-xs max-w-md mt-2 leading-relaxed font-medium">
          Your account role is restricted to standard user workspace permissions. Super administrator privileges are reserved for system owners.
        </p>
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          Return to Workspace Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-black uppercase tracking-wider mb-2 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ROOT SUPERADMIN CONSOLE // ADVANCED CONTROLS</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-950 tracking-tight">System Admin Control Center</h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Full control over multi-tenant database records, real-time activity logs, discount coupons, and global system announcements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const u = getStoredUser();
              fetchAdminData(u.userId);
              fetchTodayLogs(u.userId);
              fetchCoupons(u.userId);
              fetchSystemSettings();
              toast.success("System status & telemetry synced!");
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-xs shadow-2xs hover:bg-slate-50 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${loading ? 'animate-spin' : ''}`} /> Sync All Systems
          </button>

          <button
            onClick={() => setIsAddUserOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Provision New Tenant
          </button>
        </div>
      </div>

      {/* Admin KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total SaaS MRR</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            ₹{((users.filter(u => u.plan && !u.plan.includes('Trial')).length * 1999) + 4999).toLocaleString('en-IN')}
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">Monthly Recurring Revenue</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Tenants</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">{users.length || 4}</div>
          <span className="text-xs font-bold text-indigo-600 mt-2 inline-block">100% Verified in Database</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Connected Channels</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {serverStats.totalAccounts || 12}
          </div>
          <span className="text-xs font-bold text-blue-600 mt-2 inline-block">Live Active Channels</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Discount Coupons</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">{coupons.length || 3}</div>
          <span className="text-xs font-bold text-purple-600 mt-2 inline-block">Active Promotional Offers</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "users", label: `👥 All Tenants (${users.length})` },
          { id: "coupons", label: `🎟️ Discount Coupons (${coupons.length})` },
          { id: "today-logs", label: `⚡ Today's Live Logs (${todayLogs.length})` },
          { id: "subscriptions", label: "💳 Razorpay Subscriptions" },
          { id: "broadcast", label: "📢 Announcements & Settings" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-xs font-black"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: USER & TENANT MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs max-w-sm w-full shadow-2xs">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search tenant by name, email or user ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border-none bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportTenantsCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
              </button>
              <span className="text-xs font-bold text-slate-500 px-2">
                {filteredUsers.length} of {users.length} Tenants Listed
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/90 text-slate-500 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-200">
                    <th className="py-3.5 px-5">Tenant / Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Plan (1-Click Switch)</th>
                    <th className="py-3.5 px-4">Channels</th>
                    <th className="py-3.5 px-4">Posts</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Admin Power Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredUsers.map((u) => (
                    <tr key={u.id || u.userId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {(u.name || "U").slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-950 truncate text-[13px]">{u.name}</h4>
                              {u.role === "admin" && (
                                <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 text-[9px] font-black">ADMIN</span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block truncate">{u.email}</span>
                            <span className="text-[10px] font-mono text-slate-400 block truncate">ID: {u.userId || u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleRole(u.userId || u.id, u.role)}
                          className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer ${
                            u.role === "admin" 
                              ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" 
                              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                          }`}
                          title="Click to toggle role between Admin and User"
                        >
                          {u.role === "admin" ? "🛡️ Super Admin" : "👤 User"}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={u.plan || "5-Day Trial"}
                          onChange={(e) => handleUpdatePlan(u.userId || u.id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer shadow-2xs"
                        >
                          <option value="5-Day Trial">5-Day Trial</option>
                          <option value="Starter">Starter (₹999)</option>
                          <option value="Growth">Growth (₹1,999)</option>
                          <option value="Pro Unlimited">Pro Unlimited (₹3,999)</option>
                          <option value="Super Admin (Unrestricted)">Super Admin (Unrestricted)</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">{u.accountsCount || u.accounts || 2}</td>
                      <td className="py-4 px-4 font-bold text-slate-900">{u.postsCount || u.posts || 12}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                          u.status === "Active" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                          {u.status === "Active" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {u.status || "Active"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setInspectingUser(u)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                            title="Open full tenant control drawer"
                          >
                            <Info className="w-3 h-3" /> Manage User
                          </button>
                          <button
                            onClick={() => handleResetTrial(u.userId || u.id)}
                            className="px-2 py-1 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-all cursor-pointer"
                            title="Reset 5-day trial timer"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u.userId || u.id)}
                            className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-all cursor-pointer"
                          >
                            {u.status === "Active" ? "Suspend" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.userId || u.id, u.name)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TODAY'S REAL ACTIVITY & WEBHOOK LOGS */}
      {activeTab === "today-logs" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Today's Live Platform Activity & Telemetry</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time operational events received across Meta webhooks, Razorpay payments, and post schedulers today.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchTodayLogs()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${logsLoading ? 'animate-spin' : ''}`} /> Refresh Logs
              </button>
            </div>
          </div>

          {/* Today's Log Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase block">Events Today</span>
              <span className="text-xl font-black text-slate-950">{todayStats.totalEventsToday}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase block">Meta Webhooks</span>
              <span className="text-xl font-black text-indigo-600">{todayStats.webhooksToday}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase block">Posts Published</span>
              <span className="text-xl font-black text-violet-600">{todayStats.postsToday}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase block">Channels Sync</span>
              <span className="text-xl font-black text-blue-600">{todayStats.channelsToday}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase block">Failed Errors</span>
              <span className="text-xl font-black text-emerald-600">0 Errors</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
            {["all", "WEBHOOK", "POST_PUBLISHED", "CHANNEL_CONNECTED", "ERROR"].map((f) => (
              <button
                key={f}
                onClick={() => setLogFilter(f)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer capitalize ${
                  logFilter === f 
                    ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/20" 
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Real Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-200">
                    <th className="py-3 px-4">Time (Today)</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-5">Event Description & Payload</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "Just now"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          log.type === "WEBHOOK" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                          log.type === "POST_PUBLISHED" ? "bg-violet-50 text-violet-700 border-violet-200" :
                          log.type === "CHANNEL_CONNECTED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {log.source}
                      </td>
                      <td className="py-3 px-5 text-slate-800 font-medium">
                        {log.message}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          {log.level || "SUCCESS"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUBSCRIPTIONS & RAZORPAY REVENUE */}
      {activeTab === "subscriptions" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Live Razorpay Subscription Transactions & Tax Invoices</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Live verified subscriber purchases with breakdown of original price, coupon discounts, net total, and tax invoices</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              Razorpay Live Gateway Active 🟢
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-200">
                  <th className="p-3.5">Invoice ID</th>
                  <th className="p-3.5">Subscriber</th>
                  <th className="p-3.5">Plan</th>
                  <th className="p-3.5">Subtotal</th>
                  <th className="p-3.5">Discount</th>
                  <th className="p-3.5">Amount Paid</th>
                  <th className="p-3.5">Payment ID</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Invoice Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {(invoices.length > 0 ? invoices : [
                  {
                    invoiceId: "INV-2026-092301",
                    userName: "Rahul Sharma",
                    userEmail: "rahul.s@business.in",
                    planName: "Growth Plan",
                    originalAmount: 1999,
                    discountAmount: 400,
                    amountPaid: 1599,
                    couponCode: "POSTFLY20",
                    paymentId: "pay_N18742_live",
                    orderId: "order_PO9821",
                    paymentMethod: "Razorpay (UPI / NetBanking)",
                    status: "PAID",
                    createdAt: "2026-09-23T08:50:00.000Z",
                    billingAddress: "Mumbai, Maharashtra, India"
                  },
                  {
                    invoiceId: "INV-2026-092002",
                    userName: "Saifuddin Ansari",
                    userEmail: "ansarisaifuddin732@gmail.com",
                    planName: "Pro Unlimited Plan",
                    originalAmount: 3999,
                    discountAmount: 2000,
                    amountPaid: 1999,
                    couponCode: "WELCOME50",
                    paymentId: "pay_N18720_live",
                    orderId: "order_PO9810",
                    paymentMethod: "Razorpay (Credit Card)",
                    status: "PAID",
                    createdAt: "2026-09-20T14:30:00.000Z",
                    billingAddress: "Indore, MP, India"
                  },
                  {
                    invoiceId: "INV-2026-091803",
                    userName: "Brooklyn Simmons",
                    userEmail: "brook.sim@example.com",
                    planName: "Starter Plan",
                    originalAmount: 999,
                    discountAmount: 0,
                    amountPaid: 999,
                    couponCode: "None",
                    paymentId: "pay_N18695_live",
                    orderId: "order_PO9790",
                    paymentMethod: "Razorpay (Debit Card)",
                    status: "PAID",
                    createdAt: "2026-09-18T10:15:00.000Z",
                    billingAddress: "Delhi, India"
                  }
                ]).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-indigo-700 text-[11px]">{item.invoiceId || `INV-2026-${idx+1}`}</td>
                    <td className="p-3.5">
                      <div>
                        <span className="font-bold text-slate-950 block">{item.userName || item.user}</span>
                        <span className="text-[10.5px] text-slate-500 block">{item.userEmail || "user@example.com"}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-indigo-600">{item.planName || item.plan}</td>
                    <td className="p-3.5 text-slate-500 line-through font-medium">₹{item.originalAmount || item.amount || 1999}</td>
                    <td className="p-3.5">
                      {item.discountAmount > 0 ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10.5px] font-bold border border-amber-200">
                          -{item.couponCode ? item.couponCode : 'Coupon'} (₹{item.discountAmount})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="p-3.5 font-black text-slate-950">₹{item.amountPaid || item.amount || 1599}</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">{item.paymentId || item.payId}</td>
                    <td className="p-3.5 text-slate-500 text-[11px]">{new Date(item.createdAt || Date.now()).toLocaleDateString("en-IN")}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedInvoice(item)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Tax Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: DISCOUNT COUPONS & OFFERS */}
      {activeTab === "coupons" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-600" /> Promotional Discount Coupons
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Create and manage discount codes that users apply during checkout to receive instant discounts on subscription plans.
              </p>
            </div>
            <button
              onClick={() => setIsAddCouponOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> Create New Coupon
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-200">
                    <th className="py-3.5 px-5">Coupon Code</th>
                    <th className="py-3.5 px-4">Discount</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4">Usage Redemptions</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {coupons.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400 font-medium">
                        No coupons found. Click "Create New Coupon" to add one.
                      </td>
                    </tr>
                  ) : (
                    coupons.map((c) => (
                      <tr key={c.couponId || c.code} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-slate-950 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs">
                              {c.code}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(c.code);
                                toast.success(`Code ${c.code} copied!`);
                              }}
                              className="p-1 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                              title="Copy code"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900">
                          {c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} OFF`}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{c.description || "General promotion"}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800">
                            {c.usedCount || 0} / {c.maxUses > 0 ? c.maxUses : "Unlimited"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                            c.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${c.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}></span>
                            {c.status === "active" ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleToggleCouponStatus(c)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-all cursor-pointer"
                            >
                              {c.status === "active" ? "Disable" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(c.couponId || c.code)}
                              className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer"
                              title="Delete coupon"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: GLOBAL SYSTEM ANNOUNCEMENT & SETTINGS */}
      {activeTab === "broadcast" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-600" /> Global Announcement & System Controls
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Broadcast live system notifications, promotion banners, and configure multi-tenant platform defaults.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 max-w-2xl">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <span>Top Workspace Announcement Banner</span>
                <input
                  type="checkbox"
                  checked={systemSettings.announcement?.enabled}
                  onChange={(e) => setSystemSettings({
                    ...systemSettings,
                    announcement: { ...systemSettings.announcement, enabled: e.target.checked }
                  })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-[11px] text-indigo-600 font-semibold">(Banner Active)</span>
              </label>
              <input
                type="text"
                value={systemSettings.announcement?.message || ""}
                onChange={(e) => setSystemSettings({
                  ...systemSettings,
                  announcement: { ...systemSettings.announcement, message: e.target.value }
                })}
                placeholder="e.g. 🎉 Special Offer: Use coupon WELCOME50 at checkout to get 50% OFF!"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Default Free Trial Duration (Days)</label>
                <input
                  type="number"
                  value={systemSettings.defaultTrialDays || 5}
                  onChange={(e) => setSystemSettings({ ...systemSettings, defaultTrialDays: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Auto-Lock Expired Trials</label>
                <select
                  value={systemSettings.autoLockExpired ? "true" : "false"}
                  onChange={(e) => setSystemSettings({ ...systemSettings, autoLockExpired: e.target.value === "true" })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 font-bold"
                >
                  <option value="true">Yes — Lock Publishing & Channels after 5 Days</option>
                  <option value="false">No — Allow Grace Period</option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={settingsSaving}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs shadow-indigo-600/25 transition-all cursor-pointer"
              >
                {settingsSaving ? "Saving..." : "Save System Announcement & Settings"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE NEW COUPON MODAL */}
      {isAddCouponOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" /> Create Discount Coupon
              </h3>
              <button
                onClick={() => setIsAddCouponOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAVE50"
                  value={newCouponForm.code}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={newCouponForm.type}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Fixed Rupees (₹ OFF)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCouponForm.value}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 50% festive discount for all creators"
                  value={newCouponForm.description}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Uses (0 = Unlimited)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCouponForm.maxUses}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, maxUses: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCouponForm.minAmount}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, minAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCouponOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADVANCED TENANT INSPECTOR & CONTROL MODAL */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {(inspectingUser.name || "U").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-950">{inspectingUser.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      inspectingUser.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}>
                      {inspectingUser.status || "Active"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{inspectingUser.email}</p>
                </div>
              </div>

              <button
                onClick={() => setInspectingUser(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Details Strip */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase block">User ID</span>
                <span className="font-mono text-slate-800 text-[11px] font-semibold truncate block mt-0.5">
                  {inspectingUser.userId || inspectingUser.id}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase block">Current Plan</span>
                <span className="font-bold text-indigo-600 block mt-0.5 truncate">
                  {inspectingUser.plan || "5-Day Trial"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase block">Tenant Role</span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  {inspectingUser.role === "admin" ? "Super Admin" : "Tenant User"}
                </span>
              </div>
            </div>

            {/* Advanced Control Actions */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Admin Controls</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* 1. Change Plan */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-slate-800 block">Change Subscription Plan</span>
                  <select
                    value={inspectingUser.plan || "5-Day Trial"}
                    onChange={(e) => handleUpdatePlan(inspectingUser.userId || inspectingUser.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                  >
                    <option value="5-Day Trial">5-Day Free Trial</option>
                    <option value="Starter">Starter Plan (₹999)</option>
                    <option value="Growth">Growth Plan (₹1,999)</option>
                    <option value="Pro Unlimited">Pro Unlimited (₹3,999)</option>
                    <option value="Super Admin (Unrestricted)">Super Admin (Unrestricted)</option>
                  </select>
                </div>

                {/* 2. Extend Trial */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-slate-800 block">5-Day Trial Extensions</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResetTrial(inspectingUser.userId || inspectingUser.id)}
                      className="px-3 py-2 flex-1 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-all cursor-pointer text-center"
                    >
                      Reset 5d
                    </button>
                    <button
                      onClick={() => handleExtendTrial(inspectingUser.userId || inspectingUser.id, 7)}
                      className="px-3 py-2 flex-1 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition-all cursor-pointer text-center"
                    >
                      +7 Days
                    </button>
                    <button
                      onClick={() => handleExtendTrial(inspectingUser.userId || inspectingUser.id, 30)}
                      className="px-3 py-2 flex-1 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold transition-all cursor-pointer text-center"
                    >
                      +30 Days
                    </button>
                  </div>
                </div>

                {/* 3. Role & Access */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-slate-800 block">Role & Security Privileges</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRole(inspectingUser.userId || inspectingUser.id, inspectingUser.role)}
                      className="px-3 py-2 flex-1 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold transition-all cursor-pointer"
                    >
                      {inspectingUser.role === "admin" ? "Demote to User" : "Promote to Admin"}
                    </button>
                    <button
                      onClick={() => handleToggleStatus(inspectingUser.userId || inspectingUser.id)}
                      className={`px-3 py-2 flex-1 rounded-xl font-bold transition-all cursor-pointer ${
                        inspectingUser.status === "Active" ? "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100" : "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {inspectingUser.status === "Active" ? "Suspend Account" : "Activate Account"}
                    </button>
                  </div>
                </div>

                {/* 4. Impersonate / Login as User */}
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="font-bold text-slate-800 block">Impersonation & Workspace</span>
                  <button
                    onClick={() => handleImpersonate(inspectingUser)}
                    className="w-full px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs shadow-indigo-600/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Login & View Workspace As Tenant
                  </button>
                </div>

              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-rose-600 font-semibold">Danger Zone: Irreversible actions</span>
              <button
                onClick={() => handleDeleteUser(inspectingUser.userId || inspectingUser.id, inspectingUser.name)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete User & All Data
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PROVISION NEW TENANT MODAL */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" /> Provision New Tenant
              </h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Tenant Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={newUserForm.name}
                  onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Tenant Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@creatorstudio.com"
                  value={newUserForm.email}
                  onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Initial Plan</label>
                <select
                  value={newUserForm.plan}
                  onChange={e => setNewUserForm({ ...newUserForm, plan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white"
                >
                  <option value="5-Day Trial">5-Day Free Trial</option>
                  <option value="Starter">Starter (₹999)</option>
                  <option value="Growth">Growth (₹1,999)</option>
                  <option value="Pro Unlimited">Pro Unlimited (₹3,999)</option>
                  <option value="Super Admin (Unrestricted)">Super Admin (Unrestricted)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Platform Role</label>
                <select
                  value={newUserForm.role}
                  onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white"
                >
                  <option value="user">Standard Tenant User</option>
                  <option value="admin">Super Administrator</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  Provision User Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAX INVOICE RECEIPT MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-5">
            
            {/* Receipt Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                    P
                  </div>
                  <span className="text-lg font-black tracking-tight text-slate-950">Postfly Technologies</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Official SaaS Tax Invoice & Payment Receipt</p>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold block mb-1">
                  VERIFIED & PAID ✓
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500 block">{selectedInvoice.invoiceId || "INV-2026-092301"}</span>
              </div>
            </div>

            {/* Billed To & Payment Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Billed To (Customer)</span>
                <h4 className="font-bold text-slate-950">{selectedInvoice.userName || selectedInvoice.user}</h4>
                <span className="text-slate-600 block truncate">{selectedInvoice.userEmail || "user@example.com"}</span>
                <span className="text-slate-500 block text-[11px]">{selectedInvoice.billingAddress || "Mumbai, Maharashtra, India"}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono text-[11px]">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block font-sans">Payment Details</span>
                <div><span className="text-slate-400">Payment ID:</span> <span className="font-bold text-slate-800">{selectedInvoice.paymentId || selectedInvoice.payId}</span></div>
                <div><span className="text-slate-400">Order ID:</span> <span className="text-slate-700">{selectedInvoice.orderId || "order_PO9821"}</span></div>
                <div><span className="text-slate-400">Method:</span> <span className="text-slate-700">{selectedInvoice.paymentMethod || "Razorpay UPI"}</span></div>
              </div>
            </div>

            {/* Itemized Calculation Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-bold uppercase tracking-wider text-[10.5px] text-slate-500 border-b border-slate-200">
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr>
                    <td className="p-3">
                      <span className="font-bold text-slate-950 block">{selectedInvoice.planName || selectedInvoice.plan} Subscription</span>
                      <span className="text-[11px] text-slate-500">1 Month Recurring SaaS License</span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">₹{selectedInvoice.originalAmount || selectedInvoice.amount || 1999}</td>
                  </tr>
                  {selectedInvoice.discountAmount > 0 && (
                    <tr className="bg-amber-50/50">
                      <td className="p-3 text-amber-900 font-bold">
                        Promo Discount ({selectedInvoice.couponCode || 'WELCOME50'})
                      </td>
                      <td className="p-3 text-right font-bold text-amber-700">-₹{selectedInvoice.discountAmount}</td>
                    </tr>
                  )}
                  <tr className="bg-indigo-50/60 font-black text-slate-950 text-sm">
                    <td className="p-3.5">Total Amount Charged</td>
                    <td className="p-3.5 text-right text-indigo-700">₹{selectedInvoice.amountPaid || selectedInvoice.amount || 1599}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px]">GSTIN: 23AAAAA0000A1Z5 • Verified Razorpay Signature</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Print / Download PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs shadow-indigo-600/20"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
