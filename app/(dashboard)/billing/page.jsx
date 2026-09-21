"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Zap, Building2, CreditCard, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("Starter");
  const [yearly, setYearly] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("yt_user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Dynamically load Razorpay SDK Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const plans = [
    {
      name: "Starter",
      monthlyPrice: 0,
      priceLabel: "₹0",
      description: "Perfect for small businesses & creators just starting out.",
      features: [
        "Connect up to 2 Social Channels",
        "100 AI Captions & Hashtags/mo",
        "Basic Analytics & Post History",
        "Standard Webhook Automation"
      ],
      buttonText: "Current Active Plan",
      active: selectedPlan === "Starter",
      icon: <Zap className="w-5 h-5 text-violet-600" />
    },
    {
      name: "Pro Business",
      monthlyPrice: 1999,
      priceLabel: yearly ? "₹1,659" : "₹1,999",
      description: "For growing businesses, agencies & active marketers.",
      features: [
        "Connect up to 10 Social Channels",
        "Unlimited AI Post Generation (Gemini 3.5)",
        "Auto-Reply DMs & Comments Engine",
        "Advanced Analytics & CSV Export",
        "Priority 24/7 Fast Support"
      ],
      buttonText: "Upgrade with Razorpay",
      active: selectedPlan === "Pro Business",
      popular: true,
      icon: <Sparkles className="w-5 h-5 text-pink-600" />
    },
    {
      name: "Agency / Enterprise",
      monthlyPrice: 4999,
      priceLabel: yearly ? "₹4,149" : "₹4,999",
      description: "For agencies requiring unlimited power and white-labeling.",
      features: [
        "Unlimited Social Accounts",
        "Dedicated Multi-Tenant Workspaces",
        "Custom Branding & White-Label Dashboard",
        "Dedicated Account Manager",
        "Custom Webhook & API Integrations"
      ],
      buttonText: "Upgrade with Razorpay",
      active: selectedPlan === "Agency / Enterprise",
      icon: <Building2 className="w-5 h-5 text-slate-900" />
    }
  ];

  const handleRazorpayPayment = async (plan) => {
    if (plan.monthlyPrice === 0) return;
    setLoading(true);

    try {
      const finalPrice = yearly ? plan.monthlyPrice * 10 : plan.monthlyPrice;

      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalPrice,
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
        name: "SocialFlow Pro Suite",
        description: `Upgrade to ${plan.name} Plan`,
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
              userId: user?.userId
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setSelectedPlan(plan.name);
            toast.success(`🎉 Congratulations! You are now subscribed to ${plan.name}!`);
          } else {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: user?.name || "Saifuddin Ansari",
          email: user?.email || "user@example.com",
          contact: "9905234866"
        },
        theme: {
          color: "#7C3AED"
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold mb-3">
          <ShieldCheck className="w-4 h-4" /> 100% Secure Razorpay Payment Gateway
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Choose Your Subscription Plan</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Scale your social media automation across Meta, Instagram, Facebook & YouTube with powerful AI tools.
        </p>

        {/* Monthly / Yearly Toggle (Matches Section 17 of Prompt) */}
        <div className="mt-6 inline-flex items-center gap-3 p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-bold">
          <button
            onClick={() => setYearly(false)}
            className={`px-4 py-2 rounded-lg transition-all ${!yearly ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"}`}
          >
            Monthly Billed
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-4 py-2 rounded-lg transition-all ${yearly ? "bg-slate-900 text-white shadow-xs" : "text-slate-500"}`}
          >
            Yearly Billed <span className="text-emerald-500 ml-1">(2 Months Free)</span>
          </button>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, i) => (
          <div key={i} className={`relative flex flex-col justify-between bg-white rounded-2xl border ${plan.popular ? 'border-violet-600 shadow-xl ring-2 ring-violet-600/20' : 'border-slate-200/80 shadow-sm'} p-8 transition-all hover:shadow-md`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3.5 rounded-full shadow-sm">
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
                      ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-600/20'
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                }`}
              >
                {!plan.active && <CreditCard className="w-4 h-4" />}
                {loading ? "Preparing Razorpay..." : plan.active ? "Current Active Plan ✓" : plan.buttonText}
              </button>
            </div>
            
            <div className="space-y-3 border-t border-slate-100 pt-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Features included:</p>
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-start gap-2.5">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-violet-600' : 'text-emerald-600'}`} />
                  <span className="text-xs font-medium text-slate-700 leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
