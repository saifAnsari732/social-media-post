"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Zap, Building2, CreditCard, Layers, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("Starter");
  const [billingHistory, setBillingHistory] = useState([]);
  const [yearly, setYearly] = useState(false);

  useEffect(() => {
    // 1. Get user from storage
    const userStr = localStorage.getItem("socialflow_user") || localStorage.getItem("yt_user");
    let currentUser = null;
    if (userStr) {
      try {
        currentUser = JSON.parse(userStr);
        setUser(currentUser);
      } catch (e) {}
    }

    // 2. Fetch current plan and billing history from DB
    const userId = currentUser?.userId || "user_123";
    fetch("/api/billing/status", {
      headers: { "x-user-id": userId }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.currentPlan) setSelectedPlan(data.currentPlan);
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

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 999,
      priceLabel: yearly ? "₹799" : "₹999",
      description: "For solopreneurs & small creators starting out.",
      features: [
        "3 Connected Social Accounts",
        "❌ NO AI Support / AI Assistant",
        "50 Scheduled Posts / month",
        "Visual Content Calendar",
        "Multi-Platform Composer",
        "Basic Reach & Engagement Stats"
      ],
      buttonText: "Upgrade with Razorpay",
      active: selectedPlan === "Starter",
      icon: <Zap className="w-5 h-5 text-indigo-600" />
    },
    {
      name: "Growth",
      monthlyPrice: 1999,
      priceLabel: yearly ? "₹1,599" : "₹1,999",
      description: "For growing brands, creators & active teams.",
      features: [
        "6 Connected Social Accounts",
        "✅ Full AI Support & Assistant",
        "500 AI Generator Credits / mo",
        "Unlimited Scheduled Posts",
        "Unified Social Inbox (Comments & DMs)",
        "Advanced Performance Analytics"
      ],
      buttonText: "Upgrade with Razorpay",
      active: selectedPlan === "Growth",
      popular: true,
      icon: <Layers className="w-5 h-5 text-indigo-600" />
    },
    {
      name: "Pro Unlimited",
      monthlyPrice: 3999,
      priceLabel: yearly ? "₹3,199" : "₹3,999",
      description: "For power marketers, brands & agencies needing everything.",
      features: [
        "Unlimited Connected Social Accounts",
        "✅ Unlimited AI Credits & All AI Tools",
        "Unlimited Scheduled Posts & Queues",
        "Smart Auto-Reply Comment Bot Rules",
        "Multi-Client Workspaces & White-Label",
        "24/7 Dedicated Account Manager"
      ],
      buttonText: "Upgrade with Razorpay",
      active: selectedPlan === "Pro Unlimited",
      icon: <Building2 className="w-5 h-5 text-purple-600" />
    }
  ];

  const handleRazorpayPayment = async (plan) => {
    setLoading(true);

    try {
      const finalPrice = yearly ? plan.monthlyPrice * 12 * 0.8 : plan.monthlyPrice;
      const currentUserId = user?.userId || "user_123";

      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(finalPrice),
          planName: plan.name,
          currency: "INR"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Postfly Pro Suite",
        description: `Subscribe to ${plan.name} Plan`,
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
              userId: currentUserId
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setSelectedPlan(plan.name);

            // Update user in local storage so all pages reflect active plan immediately
            if (user) {
              const updated = { ...user, plan: plan.name };
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

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
        {plans.map((plan, i) => (
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
                <span className="text-4xl font-black text-slate-900">{plan.priceLabel}</span>
                <span className="text-slate-400 font-medium text-xs">/month</span>
              </div>
              
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">{plan.description}</p>
              
              <button 
                onClick={() => handleRazorpayPayment(plan)}
                disabled={plan.active || loading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all mb-8 flex items-center justify-center gap-2 ${
                  plan.active 
                    ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default' 
                    : plan.popular 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                }`}
              >
                {!plan.active && <CreditCard className="w-4 h-4" />}
                {loading ? "Preparing Razorpay..." : plan.active ? "Current Active Plan ✓" : plan.buttonText}
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
        ))}
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
