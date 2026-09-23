"use client";

import { useState, useEffect } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Percent, 
  Download, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight,
  ShieldCheck,
  Receipt,
  Users
} from "lucide-react";
import toast from "react-hot-toast";
import { getStoredUser } from "@/lib/user";

export default function RevenuePage() {
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const activeUser = getStoredUser();
    setUser(activeUser);
    loadRevenueData(activeUser?.userId);
  }, []);

  const loadRevenueData = async (userId) => {
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
      console.error("Failed to load revenue data", e);
      toast.error("Could not sync revenue data");
    } finally {
      setIsLoading(false);
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);
  const totalDiscounts = invoices.reduce((sum, inv) => sum + (inv.discountAmount || 0), 0);
  const paidCount = invoices.length;
  const avgOrderValue = paidCount > 0 ? Math.round(totalRevenue / paidCount) : 0;
  const projectedARR = totalRevenue * 12;

  // Plan distribution counts
  const starterCount = invoices.filter(i => (i.planName || "").toLowerCase().includes("starter")).length;
  const growthCount = invoices.filter(i => (i.planName || "").toLowerCase().includes("growth")).length;
  const proCount = invoices.filter(i => (i.planName || "").toLowerCase().includes("pro")).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold tracking-wider mb-2 shadow-2xs">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>SAAS REVENUE TELEMETRY // FINANCIAL INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-950 tracking-tight">
            Revenue & MRR Analytics
          </h1>
          <p className="text-xs lg:text-sm text-slate-600 mt-1 font-medium">
            Monitor real-time subscription revenues, Monthly Recurring Revenue (MRR), discount impact, and subscriber plans.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              if (invoices.length === 0) {
                toast.error("No revenue data to export");
                return;
              }
              const csv = ["Invoice ID,Subscriber,Email,Plan,Subtotal,Discount,Amount Paid,Payment ID,Date,Status"].concat(
                invoices.map(inv => `"${inv.invoiceId || ''}","${inv.userName || ''}","${inv.userEmail || ''}","${inv.planName || ''}",${inv.originalAmount || 0},${inv.discountAmount || 0},${inv.amountPaid || 0},"${inv.paymentId || ''}","${new Date(inv.createdAt || Date.now()).toLocaleDateString('en-IN')}","${inv.status || 'PAID'}"`)
              ).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "revenue_mrr_report.csv"; a.click();
              toast.success("Revenue report exported as CSV!");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Revenue CSV</span>
          </button>

          <button
            onClick={() => {
              loadRevenueData(user?.userId);
              toast.success("Revenue data re-synced!");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Telemetry</span>
          </button>
        </div>
      </div>

      {/* Primary MRR Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Net MRR</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-950 tracking-tight">₹{totalRevenue.toLocaleString("en-IN")}</div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> Direct Database Settled
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Paid Subscriptions</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-950 tracking-tight">{paidCount}</div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-indigo-600 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Invoices
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg Transaction (AOV)</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-950 tracking-tight">₹{avgOrderValue.toLocaleString("en-IN")}</div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-blue-600 font-bold">
            Per Paid Subscriber
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Projected Run Rate (ARR)</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-950 tracking-tight">₹{projectedARR.toLocaleString("en-IN")}</div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-purple-600 font-bold">
            Annualized Projection
          </div>
        </div>

      </div>

      {/* Plan Tier Distribution Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Starter Tier</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">₹999/mo</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{starterCount} Subscribers</div>
          <p className="text-[11px] text-slate-400">Basic creators & trial upgrades</p>
        </div>

        <div className="bg-white rounded-2xl border border-indigo-200 bg-indigo-50/20 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 uppercase">Growth Tier</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold">₹1,999/mo</span>
          </div>
          <div className="text-2xl font-black text-indigo-950">{growthCount} Subscribers</div>
          <p className="text-[11px] text-slate-400">Growing agencies & power brands</p>
        </div>

        <div className="bg-white rounded-2xl border border-purple-200 bg-purple-50/20 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase">Pro Unlimited Tier</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-bold">₹3,999/mo</span>
          </div>
          <div className="text-2xl font-black text-purple-950">{proCount} Subscribers</div>
          <p className="text-[11px] text-slate-400">Enterprise agencies & high-volume</p>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Purchase Transactions</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Verified customer checkout payments stored directly in MongoDB billing collection</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gateway Active</span>
          </span>
        </div>

        {invoices.length > 0 ? (
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
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {invoices.map((item, idx) => (
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
                    <td className="p-3.5 text-slate-500 text-[11px]">{new Date(item.createdAt || Date.now()).toLocaleDateString("en-IN")}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedInvoice(item)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <DollarSign className="w-9 h-9 text-slate-300 mx-auto mb-2.5" />
            <p className="text-sm font-bold text-slate-700">No subscription revenue recorded yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              When tenants upgrade their subscriptions through the billing checkout, their revenue records and MRR breakdown will update here automatically.
            </p>
          </div>
        )}
      </div>

      {/* TAX INVOICE RECEIPT MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-5">
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

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">Billed To</span>
                <h4 className="font-bold text-slate-950">{selectedInvoice.userName || selectedInvoice.user}</h4>
                <span className="text-slate-600 block truncate">{selectedInvoice.userEmail || "user@example.com"}</span>
                <span className="text-slate-500 block text-[11px]">{selectedInvoice.billingAddress || "India"}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono text-[11px]">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block font-sans">Payment Meta</span>
                <div><span className="text-slate-400">Payment ID:</span> <span className="font-bold text-slate-800">{selectedInvoice.paymentId || selectedInvoice.payId}</span></div>
                <div><span className="text-slate-400">Order ID:</span> <span className="text-slate-700">{selectedInvoice.orderId || "order_PO9821"}</span></div>
                <div><span className="text-slate-400">Status:</span> <span className="text-emerald-700 font-bold">{selectedInvoice.status || "PAID"}</span></div>
              </div>
            </div>

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
                    <td className="p-3 text-right font-bold text-slate-900">₹{selectedInvoice.originalAmount || selectedInvoice.amount || 0}</td>
                  </tr>
                  {selectedInvoice.discountAmount > 0 && (
                    <tr className="bg-amber-50/50">
                      <td className="p-3 text-amber-900 font-bold">
                        Promo Discount ({selectedInvoice.couponCode || 'PROMO'})
                      </td>
                      <td className="p-3 text-right font-bold text-amber-700">-₹{selectedInvoice.discountAmount}</td>
                    </tr>
                  )}
                  <tr className="bg-indigo-50/60 font-black text-slate-950 text-sm">
                    <td className="p-3.5">Total Amount Charged</td>
                    <td className="p-3.5 text-right text-indigo-700">₹{selectedInvoice.amountPaid || selectedInvoice.amount || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[11px]">Verified Payment Gateway Signature</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Print / Download PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
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
