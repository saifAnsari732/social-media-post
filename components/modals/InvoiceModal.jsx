"use client";

import { useState } from "react";
import { X, Printer, Send, CheckCircle2, ShieldCheck, CreditCard, Sparkles, Building, Mail, User, Calendar, Tag } from "lucide-react";
import toast from "react-hot-toast";

export default function InvoiceModal({ invoice, isOpen, onClose }) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  if (!isOpen || !invoice) return null;

  const handleSendEmail = async () => {
    try {
      setIsSendingEmail(true);
      const res = await fetch("/api/admin/send-invoice-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Invoice PDF receipt emailed successfully!");
      } else {
        toast.error(data.error || "Failed to send email receipt");
      }
    } catch (e) {
      console.error("Failed to send invoice email", e);
      toast.error("Could not trigger email delivery");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header Banner with Brand & Status */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                P
              </div>
              <span className="text-xl font-black tracking-tight text-slate-950">Postfly Technologies</span>
            </div>
            <p className="text-xs text-slate-500 font-medium pl-0.5">
              Postfly Social Automation Platform • Official SaaS Tax Invoice
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>VERIFIED & PAID</span>
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 block">
              {invoice.invoiceId || `INV-2026-0001`}
            </span>
          </div>
        </div>

        {/* Welcome Callout Banner inside Modal */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 text-indigo-950 space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wide">
              Subscriber Welcome & Active Workspace
            </h4>
          </div>
          <p className="text-xs text-indigo-900 leading-relaxed font-medium">
            Welcome <strong>{invoice.userName || invoice.user || "Subscriber"}</strong>! Your subscription for <strong>Postfly Social Automation Platform</strong> is verified and active across all connected channels (Facebook Pages, Instagram Business, Threads, YouTube Shorts, Twitter/X, LinkedIn, Pinterest & Meta Ads Manager).
          </p>
        </div>

        {/* Billed To & Payment Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          {/* Billed To Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>BILLED TO (SUBSCRIBER)</span>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-950 text-sm">{invoice.userName || invoice.user || "Subscriber"}</h4>
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{invoice.userEmail || "user@example.com"}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal pt-0.5">
                <strong>User ID:</strong> {invoice.userId || "N/A"}<br />
                {invoice.billingAddress || "Mumbai, Maharashtra, India"}
              </p>
            </div>
          </div>

          {/* Payment Meta Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px] font-sans">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              <span>PAYMENT METADATA</span>
            </div>
            <div className="space-y-1 text-slate-700">
              <div><span className="text-slate-400 font-sans">Platform:</span> <span className="font-sans font-bold text-slate-900">Postfly Automation</span></div>
              <div><span className="text-slate-400 font-sans">Payment ID:</span> <span className="font-bold text-indigo-700">{invoice.paymentId || invoice.payId || "pay_verified"}</span></div>
              <div><span className="text-slate-400 font-sans">Order ID:</span> <span className="text-slate-800">{invoice.orderId || "order_verified"}</span></div>
              <div><span className="text-slate-400 font-sans">Status:</span> <span className="text-emerald-700 font-bold font-sans">PAID</span></div>
              <div><span className="text-slate-400 font-sans">Date:</span> <span className="font-sans">{new Date(invoice.createdAt || Date.now()).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span></div>
            </div>
          </div>

        </div>

        {/* Item Description Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 font-bold uppercase tracking-wider text-[10.5px] text-slate-500 border-b border-slate-200">
                <th className="p-3.5">Item Description & License</th>
                <th className="p-3.5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td className="p-3.5">
                  <span className="font-bold text-slate-950 block text-sm">{invoice.planName || invoice.plan || "Pro Unlimited"} Subscription</span>
                  <span className="text-[11px] text-slate-500">
                    {invoice.billingCycle === "yearly" ? "12 Months Unlimited SaaS License" : "1 Month Recurring SaaS License"}
                  </span>
                </td>
                <td className="p-3.5 text-right font-bold text-slate-900 text-sm">₹{invoice.originalAmount || invoice.amount || 0}</td>
              </tr>

              {invoice.discountAmount > 0 && (
                <tr className="bg-amber-50/60">
                  <td className="p-3.5 text-amber-900 font-bold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-700" />
                    <span>Promo Discount ({invoice.couponCode ? invoice.couponCode.toUpperCase() : 'PROMO'})</span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-amber-800 text-sm">-₹{invoice.discountAmount}</td>
                </tr>
              )}

              <tr className="bg-indigo-50/70 font-black text-slate-950 text-base">
                <td className="p-4 text-indigo-950">Total Amount Charged</td>
                <td className="p-4 text-right text-indigo-700 font-extrabold">₹{invoice.amountPaid !== undefined ? invoice.amountPaid : invoice.amount || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal Actions Footer */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 text-xs">
          <span className="text-slate-400 text-[11px] font-medium text-center sm:text-left">
            Postfly Technologies • Official Tax Invoice Signature
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isSendingEmail ? 'animate-spin' : ''}`} />
              <span>{isSendingEmail ? "Sending..." : "Send Email Receipt"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
