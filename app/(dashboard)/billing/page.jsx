"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Zap, Building2, CreditCard, Layers, ShieldCheck, X, Tag, Check, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import { getStoredUser, getUserPlanLimits } from "@/lib/user";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [billingHistory, setBillingHistory] = useState([]);
  const [yearly, setYearly] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    // 1. Get user from storage
    const currentUser = getStoredUser();
    setUser(currentUser);

    // 2. Fetch current plan and billing history from DB
    const userId = currentUser?.userId || "user_123";
    fetch("/api/billing/status", {
      headers: { "x-user-id": userId }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.isPaid && data.currentPlan && !data.currentPlan.toLowerCase().includes("trial")) {
            setSelectedPlan(data.currentPlan);
            setIsPaid(true);
          } else {
            setSelectedPlan(null);
            setIsPaid(false);
          }
          if (data.history) setBillingHistory(data.history);
        }
      })
      .catch(() => {});

    // 3. Dynamically load Razorpay SDK Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponInput).trim();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, planPrice: 999 })
      });
      const data = await res.json();
      if (data.success && data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponInput(data.coupon.code);
        toast.success(`🎉 Coupon "${data.coupon.code}" applied! ${data.coupon.discountLabel}`);
      } else {
        toast.error(data.error || "Invalid coupon code");
      }
    } catch {
      toast.error("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.success("Coupon removed");
  };

  const limits = getUserPlanLimits(user ? { ...user, plan: isPaid ? selectedPlan : "5-Day Trial" } : null);

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 999,
      priceLabel: yearly ? "₹799" : "₹999",
      description: "For solopreneurs & small creators starting out",
      features: [
        "3 Connected Social Accounts",
        "❌ NO AI Support / AI Assistant",
        "50 Scheduled Posts / month",
        "Visual Content Calendar",
        "Multi-Platform Composer",
        "Basic Reach & Engagement Stats",
        "2 GB Cloud Media Library",
        "Standard Email Support"
      ],
      buttonText: "Upgrade Plan",
      active: Boolean(isPaid && selectedPlan && selectedPlan.toLowerCase().includes("starter")),
      icon: <Zap className="w-5 h-5 text-indigo-600" />
    },
    {
      name: "Growth",
      monthlyPrice: 1999,
      priceLabel: yearly ? "₹1,599" : "₹1,999",
      description: "For growing brands, creators & active teams",
      features: [
        "6 Connected Social Accounts",
        "✅ Full AI Support & Assistant",
        "500 AI Generator Credits / mo",
        "Unlimited Scheduled Posts",
        "AI Caption & Hashtag Generator",
        "Unified Social Inbox (Comments & DMs)",
        "Advanced Performance Analytics",
        "3 Team Workspaces & Permissions",
        "15 GB Cloud Media Storage",
        "Priority Live Chat Support"
      ],
      buttonText: "Upgrade Plan",
      active: Boolean(isPaid && selectedPlan && selectedPlan.toLowerCase().includes("growth")),
      popular: true,
      icon: <Layers className="w-5 h-5 text-indigo-600" />
    },
    {
      name: "Pro Unlimited",
      monthlyPrice: 3999,
      priceLabel: yearly ? "₹3,199" : "₹3,999",
      description: "For power marketers, brands & agencies needing all capabilities",
      features: [
        "Unlimited Connected Social Accounts",
        "✅ Unlimited AI Credits & All AI Tools",
        "Unlimited Scheduled Posts & Queues",
        "Smart Auto-Reply Comment Bot Rules",
        "Full Campaign Management & Tagging",
        "Multi-Client Workspaces & White-Label",
        "Unlimited Team Members & Roles",
        "100 GB Cloud Media Storage",
        "24/7 Dedicated Account Manager"
      ],
      buttonText: "Upgrade Plan",
      active: Boolean(isPaid && selectedPlan && (selectedPlan.toLowerCase().includes("pro") || selectedPlan.toLowerCase().includes("unlimited"))),
      icon: <Building2 className="w-5 h-5 text-purple-600" />
    }
  ];

  const getPlanPricing = (plan) => {
    const base = yearly ? Math.round(plan.monthlyPrice * 0.8) : plan.monthlyPrice;
    if (!appliedCoupon) {
      return {
        original: null,
        current: `₹${base.toLocaleString('en-IN')}`,
        rawAmount: base,
        savings: null
      };
    }
    let discounted = base;
    if (appliedCoupon.type === "percentage") {
      discounted = Math.round(base * (1 - appliedCoupon.value / 100));
    } else {
      discounted = Math.max(0, base - appliedCoupon.value);
    }
    return {
      original: `₹${base.toLocaleString('en-IN')}`,
      current: `₹${discounted.toLocaleString('en-IN')}`,
      rawAmount: discounted,
      savings: base - discounted
    };
  };

  const handleRazorpayPayment = async (plan) => {
    setLoading(true);

    try {
      const pricing = getPlanPricing(plan);
      const finalPrice = yearly ? (pricing.rawAmount * 12) : pricing.rawAmount;
      const currentUserId = user?.userId || "user_123";

      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(finalPrice),
          planName: plan.name,
          currency: "INR",
          couponCode: appliedCoupon ? appliedCoupon.code : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Postfly Pro Suite",
        description: `Subscribe to ${plan.name} Plan${appliedCoupon ? ` (${appliedCoupon.code} applied)` : ''}`,
        image: "https://cdn-icons-png.flaticon.com/512/3670/3670147.png",
        order_id: data.orderId,
        handler: async function (response) {
          toast.success("Payment Received! Verifying transaction...");
          
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planName: plan.name,
              userId: currentUserId,
              couponCode: appliedCoupon ? appliedCoupon.code : undefined
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setSelectedPlan(plan.name);
            setIsPaid(true);

            // Update user in local storage so all pages reflect active plan immediately
            if (user) {
              const updated = { ...user, plan: plan.name, isPaid: true };
              localStorage.setItem("yt_user", JSON.stringify(updated));
              localStorage.setItem("socialflow_user", JSON.stringify(updated));
              setUser(updated);
            }

            // Append transaction to history table
            setBillingHistory(prev => [
              {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                planName: plan.name,
                createdAt: new Date().toISOString(),
                status: "paid"
              },
              ...prev
            ]);

            toast.success(`🎉 Congratulations! You are now subscribed to ${plan.name}!`);
          } else {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: user?.name || "Saifuddin Ansari",
          email: user?.email || "ansarisaifuddin732@gmail.com",
          contact: "9905234866"
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto pb-6 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
          <ShieldCheck className="w-4 h-4" /> 100% Secure Razorpay Payment Gateway (Live Keys Enabled)
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Choose Your Subscription Plan</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Scale your social media automation across Meta, Instagram, Facebook, YouTube, LinkedIn & X.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="mt-6 inline-flex items-center gap-3 p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-bold">
          <button
            onClick={() => setYearly(false)}
            className={`px-4 py-2 rounded-lg transition-all ${!yearly ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"}`}
          >
            Monthly Billed
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-4 py-2 rounded-lg transition-all ${yearly ? "bg-indigo-600 text-white shadow-xs" : "text-slate-500"}`}
          >
            Annual Billed <span className="text-emerald-300 ml-1">(Save 20%)</span>
          </button>
        </div>
      </div>

      {/* Current Plan Status Card */}
      <div className="max-w-5xl mx-auto w-full">
        {isPaid ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-emerald-950 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider">Current Active Plan</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">PAID SUBSCRIPTION</span>
                </div>
                <h3 className="text-base font-black text-emerald-950 mt-0.5">
                  {selectedPlan || user?.plan || "Paid Plan"} Active ✓
                </h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  All features, account limits, and tools for your plan are fully unlocked.
                </p>
              </div>
            </div>
          </div>
        ) : limits.isExpired ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-rose-950 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0">
                <X className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase font-bold text-rose-700 tracking-wider">Access Blocked</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">TRIAL EXPIRED</span>
                </div>
                <h3 className="text-base font-black text-rose-950 mt-0.5">
                  Your 5-Day Free Trial Has Ended
                </h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  You have not purchased a plan yet. Publishing, channel connecting, and AI tools are locked. Upgrade to any plan below to instantly activate.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-950 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase font-bold text-amber-800 tracking-wider">Current Status</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">5-DAY ALL-ACCESS TRIAL</span>
                </div>
                <h3 className="text-base font-black text-amber-950 mt-0.5">
                  Pro Free Trial Active — {limits.trialDaysLeft} Days Remaining
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  You have full unrestricted access to all features (connecting all channels, multi-channel posting, AI assistant, and automations) for {limits.trialDaysLeft} more days before a paid plan is required.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Promo & Discount Coupon Section */}
      <div className="max-w-5xl mx-auto w-full">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/90 border border-indigo-200/90 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900">Have a Discount Coupon?</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                    Save up to 50%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your promo coupon code below to instantly discount any monthly or annual plan.
                </p>
              </div>
            </div>

            {/* Coupon Input or Applied State */}
            <div className="flex items-center gap-2">
              {appliedCoupon ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-2xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>
                    <strong>{appliedCoupon.code}</strong> Applied ({appliedCoupon.discountLabel})
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="ml-2 p-1 rounded-md hover:bg-emerald-200 text-emerald-700 transition-colors cursor-pointer"
                    title="Remove coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleApplyCoupon();
                  }}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME50"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 bg-white w-40 shadow-2xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    {couponLoading ? "Checking..." : "Apply"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Clickable Suggestions */}
          {!appliedCoupon && (
            <div className="mt-3 pt-3 border-t border-indigo-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium text-[11px]">Popular Offers:</span>
              {[
                { code: "WELCOME50", label: "WELCOME50 (50% OFF)" },
                { code: "SAVE500", label: "SAVE500 (₹500 OFF)" },
                { code: "POSTFLY20", label: "POSTFLY20 (20% OFF)" }
              ].map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleApplyCoupon(c.code)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
        {plans.map((plan, i) => {
          const pricing = getPlanPricing(plan);
          return (
            <div key={i} className={`relative flex flex-col justify-between bg-white rounded-2xl border ${plan.popular ? 'border-indigo-600 shadow-xl ring-2 ring-indigo-600/20' : 'border-slate-200/80 shadow-sm'} p-7 transition-all hover:shadow-md`}>
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3.5 rounded-full shadow-sm">
                  MOST POPULAR
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                    <span className="text-[11px] text-slate-400 font-medium">{yearly ? "Billed annually" : "Billed monthly"}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  {pricing.original && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-400 line-through">
                        {pricing.original}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                        {appliedCoupon.discountLabel}
                      </span>
                    </div>
                  )}
                  <span className="text-4xl font-black text-slate-900">{pricing.current}</span>
                  <span className="text-slate-400 font-medium text-xs">/month</span>
                  {yearly && (
                    <span className="block text-[11px] text-slate-500 font-medium mt-1">
                      ₹{(pricing.rawAmount * 12).toLocaleString('en-IN')} billed annually
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">{plan.description}</p>
                
                <button 
                  onClick={() => handleRazorpayPayment(plan)}
                  disabled={plan.active || loading}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all mb-8 flex items-center justify-center gap-2 cursor-pointer ${
                    plan.active 
                      ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default' 
                      : plan.popular 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                  }`}
                >
                  {!plan.active && <CreditCard className="w-4 h-4" />}
                  {loading ? "Processing Upgrade..." : plan.active ? "Current Active Plan ✓" : appliedCoupon ? `Upgrade at ${pricing.current}` : plan.buttonText}
                </button>
              </div>
            
              <div className="space-y-3 border-t border-slate-100 pt-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Features included:</p>
                {plan.features.map((feature, j) => {
                  const isExcluded = feature.startsWith("❌");
                  return (
                    <div key={j} className="flex items-start gap-2.5">
                      {isExcluded ? (
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-indigo-600' : 'text-emerald-600'}`} />
                      )}
                      <span className={`text-xs font-medium ${isExcluded ? 'text-slate-500 font-bold' : 'text-slate-700'}`}>
                        {feature.replace("❌ ", "").replace("✅ ", "")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment & Invoice Transaction History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Invoices & Payment Records</h3>
            <p className="text-xs text-slate-500">Live verified transactions processed securely via Razorpay</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {billingHistory.length} Recorded
          </span>
        </div>

        {billingHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-xs font-medium text-slate-500">No payment transactions recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-100">
                  <th className="p-3">Plan</th>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {billingHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{item.planName}</span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">{item.paymentId || "N/A"}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{item.orderId || "N/A"}</td>
                    <td className="p-3 text-slate-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Today"}
                    </td>
                    <td className="p-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        Paid ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
