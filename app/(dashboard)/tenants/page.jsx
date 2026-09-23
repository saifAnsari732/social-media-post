"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Search, 
  Plus, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ShieldCheck, 
  X, 
  ArrowUpRight,
  UserPlus,
  Layers,
  Send
} from "lucide-react";
import toast from "react-hot-toast";
import { getStoredUser } from "@/lib/user";

export default function TenantsPage() {
  const [user, setUser] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [inspectingUser, setInspectingUser] = useState(null);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", plan: "5-Day Trial", role: "user" });

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);
    loadTenants(activeUser?.userId);
  }, []);

  const loadTenants = async (userId) => {
    try {
      setIsLoading(true);
      const effectiveUserId = userId || "eb994f0c8e6f7fb4c2629561";
      const res = await fetch("/api/admin/users", {
        headers: { "x-user-id": effectiveUserId }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.users) {
          const mapped = data.users.map((u, i) => {
            const isAdmin = u.role === "admin" || (u.email && (u.email.includes("saif") || u.email.includes("ansari") || u.email.includes("admin")));
            return {
              id: u.userId || `usr_${i}`,
              userId: u.userId,
              name: u.name || "Tenant",
              email: u.email,
              role: isAdmin ? "admin" : "user",
              plan: isAdmin ? "Super Admin (Unrestricted)" : (u.plan || "5-Day Trial"),
              accounts: u.accountsCount || 0,
              posts: u.postsCount || 0,
              status: u.status || "Active",
              createdAt: u.createdAt
            };
          });
          setTenants(mapped);
        }
      }
    } catch (e) {
      console.error("Failed to load tenants", e);
      toast.error("Could not sync tenants");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.email.trim()) {
      toast.error("Email is required");
      return;
    }
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify(newUserForm)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Tenant ${data.user.name || data.user.email} created!`);
        setIsAddUserOpen(false);
        setNewUserForm({ name: "", email: "", plan: "5-Day Trial", role: "user" });
        loadTenants(user?.userId);
      } else {
        toast.error(data.error || "Failed to create tenant");
      }
    } catch {
      toast.error("Failed to create tenant");
    }
  };

  const handleDeleteUser = async (targetUserId, userName) => {
    if (!confirm(`Are you sure you want to permanently delete tenant "${userName || targetUserId}"?`)) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({ targetUserId, updates: { deleted: true, status: "Deleted" } })
      });
      const data = await res.json();
      if (data.success) {
        setTenants(prev => prev.filter(u => u.id !== targetUserId && u.userId !== targetUserId));
        toast.success("Tenant deleted successfully");
        if (inspectingUser?.userId === targetUserId) setInspectingUser(null);
      } else {
        toast.error(data.error || "Failed to delete tenant");
      }
    } catch {
      toast.error("Failed to delete tenant");
    }
  };

  const handleAdminPlanChange = async (targetUserId, newPlan) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({
          targetUserId,
          updates: { plan: newPlan, planUpdatedAt: new Date().toISOString() }
        })
      });
      const data = await res.json();
      if (data.success) {
        setTenants(prev => prev.map(u => (u.userId === targetUserId || u.id === targetUserId) ? { ...u, plan: newPlan } : u));
        toast.success(`Plan updated to ${newPlan}!`);
      } else {
        toast.error(data.error || "Failed to update plan");
      }
    } catch {
      toast.error("Failed to update plan");
    }
  };

  const handleAdminExtendTrial = async (targetUserId, days = 7) => {
    try {
      const newStartDate = new Date(Date.now() + (days - 5) * 86400000).toISOString();
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({
          targetUserId,
          updates: { trialStartDate: newStartDate, plan: "5-Day Trial" }
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Added +${days} days trial extension!`);
        loadTenants(user?.userId);
      } else {
        toast.error(data.error || "Failed to extend trial");
      }
    } catch {
      toast.error("Failed to extend trial");
    }
  };

  const handleAdminResetTrial = async (targetUserId) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({
          targetUserId,
          updates: { trialStartDate: new Date().toISOString(), plan: "5-Day Trial" }
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("5-Day trial timer reset!");
        loadTenants(user?.userId);
      } else {
        toast.error(data.error || "Failed to reset trial");
      }
    } catch {
      toast.error("Failed to reset trial");
    }
  };

  const handleAdminToggleStatus = async (targetUserId, currentStatus) => {
    const nextStatus = currentStatus === "Suspended" ? "Active" : "Suspended";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({
          targetUserId,
          updates: { status: nextStatus }
        })
      });
      const data = await res.json();
      if (data.success) {
        setTenants(prev => prev.map(u => (u.userId === targetUserId || u.id === targetUserId) ? { ...u, status: nextStatus } : u));
        toast.success(`Tenant status changed to ${nextStatus}!`);
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleImpersonate = (targetUser) => {
    if (!confirm(`Switch session to inspect workspace as "${targetUser.name || targetUser.email}"?`)) return;
    localStorage.setItem("socialflow_user", JSON.stringify(targetUser));
    localStorage.setItem("yt_user", JSON.stringify(targetUser));
    window.location.href = "/accounts";
  };

  const filteredTenants = tenants.filter(u => {
    const matchesSearch = 
      (u.name || "").toLowerCase().includes(search.toLowerCase()) || 
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.id || "").toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "active") return matchesSearch && u.status === "Active";
    if (statusFilter === "suspended") return matchesSearch && u.status === "Suspended";
    if (statusFilter === "trial") return matchesSearch && (u.plan || "").includes("Trial");
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-extrabold tracking-wider mb-2 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>SUPER ADMIN COMMAND // MULTI-TENANT DIRECTORY</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-950 tracking-tight">
            All Tenants & Controls
          </h1>
          <p className="text-xs lg:text-sm text-slate-600 mt-1 font-medium">
            Manage multi-tenant accounts, live plan tiers, trial extensions, and instant workspace impersonation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              const csv = ["Name,Email,Plan,Status,Channels,Posts"].concat(
                tenants.map(u => `"${u.name}","${u.email}","${u.plan}","${u.status}",${u.accounts || 0},${u.posts || 0}`)
              ).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "tenants_export.csv"; a.click();
              toast.success("Tenant list exported as CSV!");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              loadTenants(user?.userId);
              toast.success("Tenants synchronized!");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => setIsAddUserOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Provision New Tenant</span>
          </button>
        </div>
      </div>

      {/* Tenant Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Registered</span>
          </div>
          <span className="text-2xl font-black text-slate-950">{tenants.length}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Tenants</span>
          </div>
          <span className="text-2xl font-black text-emerald-700">{tenants.filter(u => u.status === "Active").length}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <UserX className="w-4 h-4 text-rose-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Suspended</span>
          </div>
          <span className="text-2xl font-black text-rose-700">{tenants.filter(u => u.status === "Suspended").length}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Free Trial Users</span>
          </div>
          <span className="text-2xl font-black text-amber-700">{tenants.filter(u => (u.plan || "").includes("Trial")).length}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search tenant by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border-none bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {[
            { id: "all", label: "All" },
            { id: "active", label: "Active" },
            { id: "trial", label: "On Trial" },
            { id: "suspended", label: "Suspended" }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === f.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="text-slate-400 text-xs font-medium pl-2">
            ({filteredTenants.length} shown)
          </span>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-200">
                <th className="py-3.5 px-5">Tenant / Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Plan Switcher (1-Click)</th>
                <th className="py-3.5 px-4">Channels</th>
                <th className="py-3.5 px-4">Posts</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No tenants found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or click "Provision New Tenant".</p>
                  </td>
                </tr>
              ) : (
                filteredTenants.map((u) => {
                  const isSaif = u.email === "ansarisaifuddin732@gmail.com" || u.role === "admin";
                  return (
                    <tr key={u.id || u.userId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {(u.name || "U").slice(0, 2).toUpperCase()}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-950 truncate">{u.name}</h4>
                            <span className="text-[11px] text-slate-500 truncate block">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                          isSaif
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}>
                          {isSaif ? "🛡️ Super Admin" : "User"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={u.plan || "5-Day Trial"}
                          onChange={(e) => handleAdminPlanChange(u.userId || u.id, e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer shadow-2xs"
                        >
                          <option value="5-Day Trial">5-Day Trial</option>
                          <option value="Starter">Starter (₹999)</option>
                          <option value="Growth">Growth (₹1,999)</option>
                          <option value="Pro Unlimited">Pro Unlimited (₹3,999)</option>
                          <option value="Super Admin (Unrestricted)">Super Admin (Unrestricted)</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                          {u.accounts || 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{u.posts || 0}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                          u.status === "Active" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                          {u.status === "Active" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {u.status || "Active"}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5 flex-wrap justify-end">
                          <button
                            onClick={() => setInspectingUser(u)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                            title="Inspect full tenant drawer"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => handleAdminExtendTrial(u.userId || u.id, 7)}
                            className="px-2 py-1 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10.5px] transition-all cursor-pointer"
                            title="Add 7 days to trial"
                          >
                            +7d Trial
                          </button>
                          <button
                            onClick={() => handleAdminResetTrial(u.userId || u.id)}
                            className="px-2 py-1 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10.5px] transition-all cursor-pointer"
                            title="Reset 5-day trial timer"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => handleAdminToggleStatus(u.userId || u.id, u.status)}
                            className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[10.5px] transition-all cursor-pointer"
                          >
                            {u.status === "Active" ? "Suspend" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleImpersonate(u)}
                            className="px-2 py-1 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[10.5px] transition-all cursor-pointer"
                            title="Inspect user workspace"
                          >
                            Login As
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.userId || u.id, u.name)}
                            className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Tenant"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD NEW TENANT MODAL */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" /> Provision New Tenant Account
              </h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikramaditya Singh"
                  required
                  value={newUserForm.name}
                  onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. vikram@agency.in"
                  required
                  value={newUserForm.email}
                  onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Plan</label>
                  <select
                    value={newUserForm.plan}
                    onChange={e => setNewUserForm({ ...newUserForm, plan: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="5-Day Trial">5-Day Trial</option>
                    <option value="Starter">Starter (₹999)</option>
                    <option value="Growth">Growth (₹1,999)</option>
                    <option value="Pro Unlimited">Pro Unlimited (₹3,999)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">User Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="user">Standard User</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs shadow-indigo-600/20"
                >
                  Create & Activate Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INSPECT TENANT DRAWER */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black flex items-center justify-center text-sm shrink-0">
                  {(inspectingUser.name || "U").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-950">{inspectingUser.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">{inspectingUser.email}</span>
                </div>
              </div>
              <button
                onClick={() => setInspectingUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <span className="text-[10px] uppercase font-bold text-indigo-600 block">Current Plan</span>
                <span className="text-xs font-black text-slate-900 block truncate">{inspectingUser.plan || "5-Day Trial"}</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <span className="text-[10px] uppercase font-bold text-blue-600 block">Channels</span>
                <span className="text-xs font-black text-slate-900 block">{inspectingUser.accounts || 0} Connected</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">Status</span>
                <span className="text-xs font-black text-emerald-700 block">{inspectingUser.status || "Active"}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-800 block">1-Click Plan Upgrade</span>
                <select
                  value={inspectingUser.plan || "5-Day Trial"}
                  onChange={(e) => handleAdminPlanChange(inspectingUser.userId || inspectingUser.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white cursor-pointer"
                >
                  <option value="5-Day Trial">5-Day Trial</option>
                  <option value="Starter">Starter (₹999)</option>
                  <option value="Growth">Growth (₹1,999)</option>
                  <option value="Pro Unlimited">Pro Unlimited (₹3,999)</option>
                  <option value="Super Admin (Unrestricted)">Super Admin (Unrestricted)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleAdminExtendTrial(inspectingUser.userId || inspectingUser.id, 7)}
                  className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-100 cursor-pointer"
                >
                  +7 Days Extension
                </button>
                <button
                  onClick={() => handleAdminResetTrial(inspectingUser.userId || inspectingUser.id)}
                  className="px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold hover:bg-indigo-100 cursor-pointer"
                >
                  Reset Trial Timer
                </button>
              </div>

              <button
                onClick={() => handleImpersonate(inspectingUser)}
                className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Impersonate & Inspect Workspace</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleAdminToggleStatus(inspectingUser.userId || inspectingUser.id, inspectingUser.status)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {inspectingUser.status === "Active" ? "Suspend Account" : "Activate Account"}
              </button>

              <button
                onClick={() => handleDeleteUser(inspectingUser.userId || inspectingUser.id, inspectingUser.name)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                Delete Tenant
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
