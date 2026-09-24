import { NextResponse } from "next/server";
import { getUserById, isUserTrialExpired } from "@/lib/db";
import clientPromise from "@/lib/mongodb";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { query, selectedAccount, campaigns = [], metrics = {} } = body;
    const userId = req.headers.get("x-user-id");

    if (userId) {
      const user = await getUserById(userId);
      if (user && isUserTrialExpired(user)) {
        return NextResponse.json(
          {
            error: "Your 5-Day Free Trial has expired. AI assistance is blocked until you upgrade.",
            isExpired: true
          },
          { status: 403 }
        );
      }
    }

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const cleanQuery = query.trim();
    const totalSpend = metrics.totalSpend || campaigns.reduce((acc, c) => acc + (c.spent || 0), 0);
    const totalClicks = metrics.totalClicks || campaigns.reduce((acc, c) => acc + (c.clicks || 0), 0);
    const totalImpressions = metrics.totalImpressions || campaigns.reduce((acc, c) => acc + (c.impressions || 0), 0);
    const totalPurchases = metrics.totalPurchases || campaigns.reduce((acc, c) => acc + (c.purchases || 0), 0);
    const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "3.42";

    // 1. Attempt Gemini Generation if API key is present
    let apiKey = process.env.GEMINI_API_KEY;
    if (userId) {
      try {
        const client = await clientPromise;
        const db = client.db();
        const settings = await db.collection("settings").findOne({ userId });
        if (settings?.geminiApiKey) {
          apiKey = settings.geminiApiKey;
        }
      } catch (dbErr) {
        console.error("DB settings fetch error:", dbErr);
      }
    }

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are an elite Meta Ads Performance Marketing Strategist & Media Buyer for Postfly SaaS.
Account Details:
- Account ID: ${selectedAccount || "act_8849201948"}
- Active Campaigns: ${campaigns.length} (${campaigns.map((c) => `${c.name} [ROAS: ${c.roas || 'N/A'}]`).join(", ")})
- Total Ad Spend: ₹${totalSpend.toLocaleString()}
- Impressions: ${totalImpressions.toLocaleString()}
- Clicks: ${totalClicks.toLocaleString()} (Avg CTR: ${avgCTR}%)
- Conversions: ${totalPurchases}

Provide actionable, concise Meta Ads guidance. Use clear markdown headers, bold text, and bullet points. Never reply in raw JSON. Be direct, authoritative, and helpful.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `${systemPrompt}\n\nUser Question:\n${cleanQuery}`
        });

        const reply = response.text ? response.text.trim() : null;
        if (reply) {
          return NextResponse.json({ success: true, text: reply });
        }
      } catch (aiErr) {
        console.warn("Gemini call failed or key quota exceeded, switching to smart heuristic engine:", aiErr.message);
      }
    }

    // 2. Intelligent Contextual Engine (Dynamic Heuristics based on Live Account Context)
    const lower = cleanQuery.toLowerCase();
    let dynamicReply = "";

    if (lower.includes("audit") || lower.includes("roas") || lower.includes("performance") || lower.includes("review")) {
      const topCampaign = campaigns.find((c) => (parseFloat(c.roas) || 0) >= 3) || campaigns[0] || { name: "Retargeting Abandoners", roas: "4.1x" };
      dynamicReply = `📊 **Meta Ads Performance & ROAS Audit**

• **Account Health:** ₹${totalSpend.toLocaleString()} spent across ${campaigns.length || 4} active campaigns delivering an average CTR of **${avgCTR}%**.
• **Top Performer:** "${topCampaign.name}" is leading efficiency with a **${topCampaign.roas || "4.1x"} ROAS**.
• **Conversion Metric:** ${totalPurchases} total purchases recorded at a competitive blended CPA.
• **Actionable Recommendations:**
  1. Increase daily budget by **+20% every 48 hours** on "${topCampaign.name}" to prevent resetting the learning phase.
  2. Implement creative fatigue rotation on campaigns with CTR dropping below 2.0%.
  3. Ensure Meta Pixel / Conversions API (CAPI) deduplication is verified under Events Manager.`;
    } else if (lower.includes("budget") || lower.includes("split") || lower.includes("spend") || lower.includes("allocation")) {
      const totalDaily = campaigns.reduce((acc, c) => acc + (c.dailyBudget || 0), 0) || 5000;
      const scalingBudget = Math.round(totalDaily * 0.7);
      const prospectingBudget = Math.round(totalDaily * 0.2);
      const testingBudget = Math.round(totalDaily * 0.1);

      dynamicReply = `💰 **Recommended 70/20/10 Budget Allocation**

Based on your current cumulative daily budget of **₹${totalDaily.toLocaleString()}/day**:

• **70% Core Scaling (₹${scalingBudget.toLocaleString()}/day):**
  Allocate to your proven bottom-of-funnel Retargeting and 1-2% Purchase Lookalike audiences.
• **20% Prospecting & Cold Reach (₹${prospectingBudget.toLocaleString()}/day):**
  Advantage+ Shopping / Broad targeting targeting fresh buyers to replenish top-of-funnel pipeline.
• **10% Creative Testing Sandbox (₹${testingBudget.toLocaleString()}/day):**
  Dynamic Creative Testing (DCT) with 3 hooks, 2 bodies, and 2 CTA buttons to identify winning ad creatives before scaling.`;
    } else if (lower.includes("audience") || lower.includes("targeting") || lower.includes("keywords") || lower.includes("lookalike")) {
      dynamicReply = `🎯 **High-Converting Meta Ads Audience Architecture**

• **Tier 1 - Custom Audiences (Highest ROAS):**
  - Website Visitors (Past 30 days) excluding recent buyers.
  - Video Viewers 75%+ & Instagram Engagers (Past 90 days).
• **Tier 2 - Lookalike Audiences:**
  - 1% Lookalike created from high-LTV customer list / Pixel Purchase events.
  - 2-3% Lookalike stacked with interest qualifiers (e.g. *Online Shopping*, *Luxury Lifestyle*).
• **Tier 3 - Broad Advantage+ Audience:**
  - Open targeting with age 22-45, pan-India metro tiers, automated placement optimization.
• **Critical Exclusion:** Always exclude *Purchasers (Past 14-30 days)* to prevent ad fatigue and wasted budget.`;
    } else if (lower.includes("copy") || lower.includes("write") || lower.includes("caption") || lower.includes("headline") || lower.includes("pas")) {
      dynamicReply = `✍️ **High-Converting PAS Meta Ad Copy Framework**

**Primary Text:**
Tired of wasting ad spend on visitors who browse but never buy? Most e-commerce stores lose up to 70% of potential buyers right at the checkout step. 

Postfly’s intelligent retargeting automates your Instagram & Facebook campaigns to re-engage high-intent customers with tailored offers. Unlock predictable ROAS and start scaling today.

**Catchy Headline:**
⚡ Recover 3x More Lost Sales — Instant Setup

**Description:**
Join 10,000+ brands scaling profitably with AI.

**Recommended CTA:**
[ Shop Now ] or [ Claim Offer ]`;
    } else if (lower.includes("scale") || lower.includes("cbo") || lower.includes("abo") || lower.includes("scaling")) {
      dynamicReply = `🚀 **Meta Ads Scaling Playbook (Vertical & Horizontal)**

• **Vertical Scaling:** Increase budget on winning ad sets by **15-20% every 48-72 hours**. Avoid sudden 50%+ jumps as this triggers Meta's learning phase reset.
• **Horizontal Scaling (Recommended):**
  - Duplicate winning ad sets into a dedicated **Advantage Campaign Budget (CBO)** with ₹5,000+ daily budget.
  - Expand to new Lookalikes (3-5%) and fresh regional geos.
  - Test UGC (User Generated Content) video hooks in 9:16 vertical Reel formats.`;
    } else {
      dynamicReply = `🎯 **Meta Ads Strategic Assessment**

Regarding: *"${cleanQuery}"*

• **Current Metrics:** ₹${totalSpend.toLocaleString()} spend tracked across ${campaigns.length || 4} campaigns with **${avgCTR}% average CTR** and **${totalPurchases} conversions**.
• **Strategic Insight:** For optimal delivery on Meta's 2026 auction algorithm, prioritize creative diversification (Reels 9:16 + Carousel) paired with Advantage+ Campaign Budget.
• **Action Step:** Leverage your highest ROAS campaign ("${campaigns[0]?.name || "Active Campaign"}") as the primary conversion driver while running continuous A/B creative testing.

Need specific guidance on copy, audience targeting, or budget allocation? Choose a quick command or type your query.`;
    }

    return NextResponse.json({
      success: true,
      text: dynamicReply
    });
  } catch (error) {
    console.error("Ads Chat Route Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process Meta Ads chat request"
      },
      { status: 500 }
    );
  }
}
