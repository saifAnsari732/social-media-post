"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Zap, Building2, CreditCard, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("Starter");

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
      priceINR: 0,
      priceUSD: "$0",
      period: "/month",
      description: "Perfect for small businesses & creators just starting out.",
      features: [
        "Connect up to 2 Social Accounts",
        "100 AI Captions & Hashtags/mo",
        "Basic Analytics & History",
        "Standard Webhook Automation"
      ],
      buttonText: "Current Active Plan",
      active: selectedPlan === "Starter",
      icon: <Zap className="w-6 h-6 text-[#7C3AED]" />
    },
    {
      name: "Pro Business",
      priceINR: 1999,
      priceUSD: "₹1,999",
      period: "/month",
      description: "For growing businesses, agencies & active marketers.",
      features: [
        "Connect up to 10 Social Accounts",
        "Unlimited AI Post Generation (Gemini 3.5)",
        "Auto-Reply DMs & Comments Engine",
        "Advanced Analytics & Post History",
        "Priority 24/7 Fast Support"
      ],
      buttonText: "Upgrade with Razorpay",
      active: selectedPlan === "Pro Business",
      popular: true,
      icon: <Sparkles className="w-6 h-6 text-[#DB2777]" />
    },
    {
      name: "Agency / Enterprise",
      priceINR: 4999,
      priceUSD: "₹4,999",
      period: "/month",
      description: "For agencies requiring unlimited power and white-labeling.",
      features: [
        "Unlimited Social Accounts",
        "Dedicated Multi-Tenant Support",
        "Custom Branding & White-Label Dashboard",
        "Dedicated Account Manager",
        "Custom Webhook & API Integrations"
      ],
      buttonText: "Upgrade with Razorpay",
      active: selectedPlan === "Agency / Enterprise",
      icon: <Building2 className="w-6 h-6 text-[#0F172A]" />
    }
  ];

  const handleRazorpayPayment = async (plan) => {
    if (plan.priceINR === 0) return;
    setLoading(true);

    try {
      // 1. Create order on backend
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.priceINR,
          planName: plan.name,
          currency: "INR"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      // 2. Open Razorpay Checkout Modal
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
          
          // Verify signature backend
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
          name: user?.name || "Saif Ansari",
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
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3E8FF] border border-[#E9D5FF] text-[#7C3AED] text-xs font-semibold mb-4">
          <ShieldCheck className="w-4 h-4" /> 100% Secure Razorpay Checkout
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">Choose Your SaaS Subscription Plan</h1>
        <p className="text-[#64748B] text-base">Scale your social media automation across Meta, Instagram, Facebook & YouTube with powerful AI features.</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className={`relative flex flex-col bg-white rounded-3xl border ${plan.popular ? 'border-[#7C3AED] shadow-2xl ring-2 ring-[#7C3AED]/20' : 'border-[#E2E8F0] shadow-sm'} p-8 transition-all hover:shadow-xl`}>
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white text-[11px] font-extrabold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-md">
                MOST POPULAR
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                {plan.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">{plan.name}</h3>
                <span className="text-xs text-[#64748B] font-medium">Billed monthly</span>
              </div>
            </div>
            
            <div className="mb-2">
              <span className="text-4xl font-extrabold text-[#0F172A]">{plan.priceUSD}</span>
              <span className="text-[#64748B] font-medium text-sm">{plan.period}</span>
            </div>
            
            <p className="text-[#64748B] text-xs mb-6 h-10 leading-relaxed">{plan.description}</p>
            
            <button 
              onClick={() => handleRazorpayPayment(plan)}
              disabled={plan.active || loading}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all mb-8 flex items-center justify-center gap-2 ${
                plan.active 
                  ? 'bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] cursor-default' 
                  : plan.popular 
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white hover:opacity-95 shadow-md hover:shadow-lg transform active:scale-98'
                    : 'bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-md'
              }`}
            >
              {!plan.active && <CreditCard className="w-4 h-4" />}
              {loading ? "Preparing Checkout..." : plan.active ? "Current Active Plan ✓" : plan.buttonText}
            </button>
            
            <div className="space-y-3.5 flex-1 border-t border-[#F1F5F9] pt-6">
              <p className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider">Features included:</p>
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-start gap-3">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-[#7C3AED]' : 'text-[#10B981]'}`} />
                  <span className="text-xs font-medium text-[#475569] leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Info */}
      <div className="mt-14 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#7C3AED] bg-white/10 px-3 py-1 rounded-md mb-2">White-Label Enterprise</span>
          <h4 className="text-xl font-bold mb-1">Want to launch your own Social Media SaaS?</h4>
          <p className="text-[#94A3B8] text-sm">Deploy this full multi-tenant platform under your domain with Razorpay payments built-in.</p>
        </div>
        <button 
          onClick={() => alert("Contact support at ansarisaifuddin732@gmail.com for Enterprise White-Labeling.")}
          className="whitespace-nowrap px-6 py-3.5 bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg"
        >
          Contact Developer
        </button>
      </div>
    </div>
  );
}
