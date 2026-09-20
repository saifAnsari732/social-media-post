"use client";

import { useState } from "react";
import { CheckCircle2, Zap, Building2, CreditCard } from "lucide-react";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "Perfect for small businesses just getting started.",
      features: ["Connect up to 2 Social Accounts", "100 AI Generated Captions/mo", "Basic Analytics", "Community Support"],
      buttonText: "Current Plan",
      active: true,
      icon: <Zap className="w-6 h-6 text-[#7C3AED]" />
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For growing businesses and agencies.",
      features: ["Up to 10 Social Accounts", "Unlimited AI Generation", "Advanced Analytics & Reports", "Priority 24/7 Support", "Custom Webhook Integrations"],
      buttonText: "Upgrade to Pro",
      active: false,
      popular: true,
      icon: <CheckCircle2 className="w-6 h-6 text-[#DB2777]" />
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large teams needing advanced control.",
      features: ["Unlimited Social Accounts", "Custom AI Models", "White-label Dashboard", "Dedicated Account Manager"],
      buttonText: "Contact Sales",
      active: false,
      icon: <Building2 className="w-6 h-6 text-[#0F172A]" />
    }
  ];

  function handleUpgrade() {
    setLoading(true);
    setTimeout(() => {
      alert("Payment gateway integration (Stripe/Razorpay) will be implemented here for your SaaS clients!");
      setLoading(false);
    }, 1500);
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight mb-4">Upgrade Your Plan</h1>
        <p className="text-[#64748B] text-lg">Choose the perfect plan for your social media automation needs. Scale your business with powerful AI tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className={`relative flex flex-col bg-white rounded-2xl border ${plan.popular ? 'border-[#7C3AED] shadow-xl ring-1 ring-[#7C3AED]' : 'border-[#E2E8F0] shadow-sm'} p-8 transition-all hover:shadow-lg`}>
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#7C3AED] text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                Most Popular
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                {plan.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0F172A]">{plan.name}</h3>
            </div>
            
            <div className="mb-2">
              <span className="text-4xl font-extrabold text-[#0F172A]">{plan.price}</span>
              <span className="text-[#64748B] font-medium">{plan.period}</span>
            </div>
            
            <p className="text-[#64748B] text-sm mb-6 h-10">{plan.description}</p>
            
            <button 
              onClick={plan.active ? undefined : handleUpgrade}
              disabled={plan.active || loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all mb-8 flex items-center justify-center gap-2 ${
                plan.active 
                  ? 'bg-[#F1F5F9] text-[#64748B] cursor-default' 
                  : plan.popular 
                    ? 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-md hover:shadow-lg'
                    : 'bg-white text-[#0F172A] border-2 border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              {!plan.active && <CreditCard className="w-4 h-4" />}
              {loading && plan.popular ? "Processing..." : plan.buttonText}
            </button>
            
            <div className="space-y-4 flex-1">
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">What's included</p>
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-[#7C3AED]' : 'text-[#94A3B8]'}`} />
                  <span className="text-sm text-[#475569]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-[#0F172A] mb-1">Need a custom white-label solution?</h4>
          <p className="text-[#64748B] text-sm">Deploy this entire platform on your own domain with your branding.</p>
        </div>
        <button className="whitespace-nowrap px-6 py-3 bg-[#0F172A] text-white rounded-xl font-medium text-sm hover:bg-[#1E293B] transition-colors shadow-md">
          Talk to Founder
        </button>
      </div>
    </div>
  );
}
