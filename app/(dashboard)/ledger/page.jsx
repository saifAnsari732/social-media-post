"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Receipt, 
  Search, 
  Download, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Percent, 
  Clock, 
  FileText,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import { getStoredUser } from "@/lib/user";
import InvoiceModal from "@/components/modals/InvoiceModal";

export default function LedgerPage() {
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);
    loadInvoices(activeUser?.userId);
  }, []);

  const loadInvoices = async (userId) => {
    try {
      setIsLoading(true);
      const effectiveUserId = userId || "eb994f0c8e6f7fb4c2629561";
      const res = await fetch("/api/admin/subscriptions", {
        headers: { "x-user-id": effectiveUserId }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.invoices) {
          setInvoices(data.invoices);
        }
      }
    } catch (e) {
      console.error("Failed to load invoices", e);
      toast.error("Could not sync billing ledger");
    } finally {
      setIsLoading(false);
    }
  };

  const totalCollected = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
  const totalSubtotal = invoices.reduce((sum, inv) => sum + (inv.originalAmount || inv.amount || 0), 0);
  const totalDiscounts = invoices.reduce((sum, inv) => sum + (inv.discountAmount || 0), 0);

  const filteredInvoices = invoices.filter(item => {
    const query = search.toLowerCase();
    const matchesSearch = 
      (item.invoiceId || "").toLowerCase().includes(query) ||
      (item.userName || item.user || "").toLowerCase().includes(query) ||
      (item.userEmail || "").toLowerCase().includes(query) ||
      (item.paymentId || item.payId || "").toLowerCase().includes(query);

    if (planFilter === "all") return matchesSearch;
    return matchesSearch && (item.planName || item.plan || "").toLowerCase().includes(planFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-extrabold tracking-wider mb-2 shadow-2xs">
            <Receipt className="w-3.5 h-3.5 text-indigo-600" />
            <span>FINANCIAL AUDIT // BILLING LEDGER & INVOICES</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-950 tracking-tight">
            Billing Ledger & Tax Invoices
          </h1>
          <p className="text-xs lg:text-sm text-slate-600 mt-1 font-medium">
            Search, inspect, and export all customer tax invoices and subscription billing transactions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              if (invoices.length === 0) {
                toast.error("No ledger data to export");
                return;
              }
              const csv = ["Invoice ID,Subscriber,Email,Plan,Subtotal,Discount,Amount Paid,Payment ID,Date,Status"].concat(
                invoices.map(inv => `"${inv.invoiceId || ''}","${inv.userName || ''}","${inv.userEmail || ''}","${inv.planName || ''}",${inv.originalAmount || 0},${inv.discountAmount || 0},${inv.amountPaid || 0},"${inv.paymentId || ''}","${new Date(inv.createdAt || Date.now()).toLocaleDateString('en-IN')}","${inv.status || 'PAID'}"`)
              ).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "billing_ledger_export.csv"; a.click();
              toast.success("Billing ledger exported as CSV!");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Ledger CSV</span>
          </button>

          <button
            onClick={() => {
              loadInvoices(user?.userId);
              toast.success("Ledger synced!");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Ledger Analytics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Invoices</span>
          </div>
          <span className="text-2xl font-black text-slate-950">{invoices.length}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Net Collected</span>
          </div>
          <span className="text-2xl font-black text-emerald-700">₹{totalCollected.toLocaleString("en-IN")}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gross Billed</span>
          </div>
          <span className="text-2xl font-black text-blue-700">₹{totalSubtotal.toLocaleString("en-IN")}</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            <Percent className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Discounts</span>
          </div>
          <span className="text-2xl font-black text-amber-700">₹{totalDiscounts.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by invoice ID, subscriber, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border-none bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {[
            { id: "all", label: "All Plans" },
            { id: "starter", label: "Starter" },
            { id: "growth", label: "Growth" },
            { id: "pro", label: "Pro Unlimited" }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setPlanFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                planFilter === f.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="text-slate-400 text-xs font-medium pl-2">
            ({filteredInvoices.length} records)
          </span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
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
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No invoice records found</p>
                    <p className="text-xs text-slate-400 mt-1">Paid transactions from customer upgrades will be listed here automatically.</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-indigo-700 text-[11px]">{item.invoiceId || `INV-2026-${idx+1}`}</td>
                    <td className="p-3.5">
                      <div>
                        <span className="font-bold text-slate-950 block">{item.userName || item.user}</span>
                        <span className="text-[10.5px] text-slate-500 block">{item.userEmail || "user@example.com"}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-indigo-600">{item.planName || item.plan}</td>
                    <td className="p-3.5 text-slate-500 line-through font-medium">₹{item.originalAmount || item.amount || 0}</td>
                    <td className="p-3.5">
                      {item.discountAmount > 0 ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10.5px] font-bold border border-amber-200">
                          -{item.couponCode ? item.couponCode : 'Coupon'} (₹{item.discountAmount})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="p-3.5 font-black text-slate-950">₹{item.amountPaid || item.amount || 0}</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">{item.paymentId || item.payId || "—"}</td>
                    <td className="p-3.5 text-slate-500 text-[11px]">{new Date(item.createdAt || Date.now()).toLocaleDateString("en-IN")}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedInvoice(item)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TAX INVOICE RECEIPT MODAL */}
      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

    </div>
  );
}
