"use client";

import { useState, useEffect } from "react";
import { 
  Tag, 
  Plus, 
  Copy, 
  Trash2, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Search, 
  X, 
  Percent, 
  ShieldCheck,
  TrendingUp,
  Layers
} from "lucide-react";
import toast from "react-hot-toast";
import { getStoredUser } from "@/lib/user";

export default function CouponsPage() {
  const [user, setUser] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState({
    code: "",
    type: "percentage",
    value: 20,
    description: "",
    maxUses: 100,
    minAmount: 0
  });

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);
    loadCoupons(activeUser?.userId);
  }, []);

  const loadCoupons = async (userId) => {
    try {
      setIsLoading(true);
      const effectiveUserId = userId || "eb994f0c8e6f7fb4c2629561";
      const res = await fetch("/api/admin/coupons", {
        headers: { "x-user-id": effectiveUserId }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.coupons) {
          setCoupons(data.coupons);
        }
      }
    } catch (e) {
      console.error("Failed to load coupons", e);
      toast.error("Could not sync coupons");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponForm.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify(newCouponForm)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Coupon ${data.coupon.code} created!`);
        setCoupons([data.coupon, ...coupons]);
        setIsAddCouponOpen(false);
        setNewCouponForm({ code: "", type: "percentage", value: 20, description: "", maxUses: 100, minAmount: 0 });
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
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.userId || "eb994f0c8e6f7fb4c2629561"
        },
        body: JSON.stringify({ couponId: coupon.couponId || coupon.code, updates: { status: nextStatus } })
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.map(c => (c.couponId === coupon.couponId || c.code === coupon.code) ? { ...c, status: nextStatus } : c));
        toast.success(`Coupon marked as ${nextStatus}!`);
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!confirm("Are you sure you want to permanently delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/coupons?couponId=${encodeURIComponent(couponId)}`, {
        method: "DELETE",
        headers: { "x-user-id": user?.userId || "eb994f0c8e6f7fb4c2629561" }
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

  const filteredCoupons = coupons.filter(c => {
    const matchesSearch = 
      (c.code || "").toLowerCase().includes(search.toLowerCase()) || 
      (c.description || "").toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "active") return matchesSearch && c.status === "active";
    if (statusFilter === "disabled") return matchesSearch && c.status !== "active";
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-extrabold tracking-wider mb-2 shadow-2xs">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>PROMOTIONS ENGINE // DISCOUNT CODES</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-950 tracking-tight">
            Discount Coupons & Promo Engine
          </h1>
          <p className="text-xs lg:text-sm text-slate-600 mt-1 font-medium">
            Create percentage or flat discount vouchers that subscribers apply during checkout on the billing portal.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              if (coupons.length === 0) {
                toast.error("No coupons to export");
                return;
              }
              const csv = ["Code,Type,Value,Description,Min Amount,Used Count,Max Uses,Status"].concat(
                coupons.map(c => `"${c.code}","${c.type}",${c.value},"${c.description || ''}",${c.minAmount || 0},${c.usedCount || 0},${c.maxUses || 100},"${c.status}"`)
              ).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "coupons_export.csv"; a.click();
              toast.success("Coupons list exported as CSV!");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              loadCoupons(user?.userId);
              toast.success("Coupons synced!");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => setIsAddCouponOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Coupon</span>
          </button>
        </div>
      </div>

      {/* Coupon Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Codes</span>
          </div>
          <span className="text-2xl font-black text-slate-950">{coupons.length}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Codes</span>
          </div>
          <span className="text-2xl font-black text-emerald-700">{coupons.filter(c => c.status === "active").length}</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Times Redeemed</span>
          </div>
          <span className="text-2xl font-black text-indigo-700">
            {coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)}
          </span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Redemptions Left</span>
          </div>
          <span className="text-2xl font-black text-blue-700">
            {coupons.reduce((sum, c) => sum + Math.max(0, (c.maxUses || 100) - (c.usedCount || 0)), 0)}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search coupon by code or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border-none bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {[
            { id: "all", label: "All Coupons" },
            { id: "active", label: "Active Only" },
            { id: "disabled", label: "Disabled" }
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
            ({filteredCoupons.length} shown)
          </span>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-200">
                <th className="py-3.5 px-5">Promo Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Min Order</th>
                <th className="py-3.5 px-4">Usage Redemptions</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No discount coupons found</p>
                    <p className="text-xs text-slate-400 mt-1">Click "Create New Coupon" to generate promotional discounts for your plans.</p>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((c) => (
                  <tr key={c.couponId || c.code} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs">
                          {c.code}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(c.code);
                            toast.success(`Copied "${c.code}" to clipboard!`);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title="Copy code"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">
                        {c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {c.description || "Promo discount for subscribers"}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {c.minAmount > 0 ? `₹${c.minAmount}` : "Any Plan"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.usedCount || 0} / {c.maxUses || 100}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleCouponStatus(c)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border cursor-pointer transition-all ${
                          c.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                        {c.status === "active" ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c.couponId || c.code)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE COUPON MODAL */}
      {isAddCouponOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" /> Create Promotional Coupon
              </h3>
              <button
                onClick={() => setIsAddCouponOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVE30"
                  required
                  value={newCouponForm.code}
                  onChange={e => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-mono font-bold uppercase focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={newCouponForm.type}
                    onChange={e => setNewCouponForm({ ...newCouponForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Flat Amount (₹ OFF)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {newCouponForm.type === "percentage" ? "Percentage (1-100%)" : "Amount (in ₹)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCouponForm.value}
                    onChange={e => setNewCouponForm({ ...newCouponForm, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Minimum Plan Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCouponForm.minAmount}
                    onChange={e => setNewCouponForm({ ...newCouponForm, minAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    min="1"
                    value={newCouponForm.maxUses}
                    onChange={e => setNewCouponForm({ ...newCouponForm, maxUses: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Special festive 30% discount for all creators"
                  value={newCouponForm.description}
                  onChange={e => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddCouponOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs shadow-indigo-600/20"
                >
                  Save & Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
