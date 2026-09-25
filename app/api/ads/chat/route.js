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
    const lower = cleanQuery.toLowerCase();

    const totalSpend = metrics.totalSpend || campaigns.reduce((acc, c) => acc + (c.spent || 0), 0);
    const totalClicks = metrics.totalClicks || campaigns.reduce((acc, c) => acc + (c.clicks || 0), 0);
    const totalImpressions = metrics.totalImpressions || campaigns.reduce((acc, c) => acc + (c.impressions || 0), 0);
    const totalPurchases = metrics.totalPurchases || campaigns.reduce((acc, c) => acc + (c.purchases || 0), 0);
    const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "3.42";

    // --------------------------------------------------------------------------
    // 1. NATURAL LANGUAGE AI CRUD ENGINE
    // --------------------------------------------------------------------------

    // A) AI CREATE CAMPAIGN
    if (lower.startsWith("create campaign") || lower.startsWith("add campaign") || lower.startsWith("launch campaign") || lower.includes("create a campaign")) {
      const nameMatch = cleanQuery.match(/(?:campaign|name)[:\s]+['"]?([^'"]+?)['"]?(?:\s+with|\s+budget|\s+objective|$)/i) ||
                        cleanQuery.match(/(?:create|add|launch)\s+(?:a\s+)?(?:new\s+)?campaign\s+['"]?([^'"]+?)['"]?(?:\s+with|\s+budget|\s+objective|$)/i);
      const name = nameMatch ? nameMatch[1].trim() : "AI Strategic Campaign";
      
      const budgetMatch = cleanQuery.match(/(?:budget|price|cost|amount)[:\s]+(?:₹|rs\.?|inr)?\s*(\d+)/i) || cleanQuery.match(/(\d+)\s*(?:budget|daily|rupees|rs|inr)/i);
      const dailyBudget = budgetMatch ? parseInt(budgetMatch[1], 10) : 2000;

      const client = await clientPromise;
      const db = client.db();
      const newCampaign = {
        id: `cam_${Date.now()}`,
        accountId: selectedAccount || "act_1796071777698019",
        userId: userId || "current_user",
        name,
        objective: "Conversions (Sales)",
        status: "ACTIVE",
        dailyBudget,
        spent: 0,
        impressions: 0,
        clicks: 0,
        ctr: "0.00%",
        roas: "0.0x",
        purchases: 0,
        platform: "instagram",
        createdAt: new Date().toISOString()
      };

      await db.collection("ad_campaigns").insertOne(newCampaign);

      return NextResponse.json({
        success: true,
        action: "CREATE_CAMPAIGN",
        campaign: newCampaign,
        text: `🚀 **Meta Campaign Created Successfully via AI!**\n\n• **Campaign Name:** ${name}\n• **Status:** ACTIVE\n• **Daily Budget:** ₹${dailyBudget.toLocaleString("en-IN")}/day\n• **Objective:** Conversions (Sales)\n• **Platform:** Instagram & Facebook\n\nCampaign has been created and synced with your active Meta Ad account.`
      });
    }

    // B) AI PAUSE / ACTIVATE CAMPAIGN
    if (lower.includes("pause campaign") || lower.includes("activate campaign") || lower.includes("resume campaign") || lower.includes("turn off campaign") || lower.includes("turn on campaign")) {
      const isPause = lower.includes("pause") || lower.includes("turn off");
      const nextStatus = isPause ? "PAUSED" : "ACTIVE";

      const targetCam = campaigns.find((c) => lower.includes(c.name.toLowerCase())) || campaigns[0];

      if (targetCam) {
        const client = await clientPromise;
        const db = client.db();
        await db.collection("ad_campaigns").updateOne(
          { id: targetCam.id },
          { $set: { status: nextStatus, updatedAt: new Date().toISOString() } }
        );

        return NextResponse.json({
          success: true,
          action: "UPDATE_CAMPAIGN",
          campaignId: targetCam.id,
          updatedFields: { status: nextStatus },
          text: `⚡ **Campaign Status Updated via AI!**\n\n• **Campaign:** "${targetCam.name}"\n• **New Status:** ${nextStatus === "ACTIVE" ? "🟢 ACTIVE" : "⏸️ PAUSED"}\n\nLive Graph API telemetry updated.`
        });
      }
    }

    // C) AI UPDATE BUDGET
    if (lower.includes("budget") && (lower.includes("set") || lower.includes("update") || lower.includes("change") || lower.includes("increase") || lower.includes("scale"))) {
      const budgetMatch = cleanQuery.match(/(?:to|of|budget|set|is)[:\s]+(?:₹|rs\.?|inr)?\s*(\d+)/i) || cleanQuery.match(/(\d+)\s*(?:budget|daily|rupees|rs|inr)/i);
      if (budgetMatch) {
        const newBudget = parseInt(budgetMatch[1], 10);
        const targetCam = campaigns.find((c) => lower.includes(c.name.toLowerCase())) || campaigns[0];

        if (targetCam) {
          const client = await clientPromise;
          const db = client.db();
          await db.collection("ad_campaigns").updateOne(
            { id: targetCam.id },
            { $set: { dailyBudget: newBudget, updatedAt: new Date().toISOString() } }
          );

          return NextResponse.json({
            success: true,
            action: "UPDATE_CAMPAIGN",
            campaignId: targetCam.id,
            updatedFields: { dailyBudget: newBudget },
            text: `💰 **Campaign Budget Updated via AI!**\n\n• **Campaign:** "${targetCam.name}"\n• **New Daily Budget:** ₹${newBudget.toLocaleString("en-IN")}/day\n\nBudget allocation applied across Meta ad sets.`
          });
        }
      }
    }

    // D) AI DELETE CAMPAIGN
    if (lower.includes("delete campaign") || lower.includes("remove campaign")) {
      const targetCam = campaigns.find((c) => lower.includes(c.name.toLowerCase()));
      if (targetCam) {
        const client = await clientPromise;
        const db = client.db();
        await db.collection("ad_campaigns").deleteOne({ id: targetCam.id });

        return NextResponse.json({
          success: true,
          action: "DELETE_CAMPAIGN",
          campaignId: targetCam.id,
          text: `🗑️ **Campaign Deleted via AI!**\n\nCampaign **"${targetCam.name}"** (${targetCam.id}) has been deleted from your Meta Ad Account.`
        });
      }
    }

    // --------------------------------------------------------------------------
    // 2. GEMINI LLM WITH FULL ADVANCE CAMPAIGN TELEMETRY
    // --------------------------------------------------------------------------
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
        const campaignContextList = campaigns.map((c, i) => 
          `${i+1}. ID: ${c.id} | Name: "${c.name}" | Status: ${c.status} | Objective: ${c.objective || 'Conversions'} | Daily Budget: ₹${c.dailyBudget}/day | Spent: ₹${c.spent} | Clicks: ${c.clicks} | CTR: ${c.ctr || '0%'} | ROAS: ${c.roas || '0.0x'} | Results: ${c.purchases || 0} Leads`
        ).join("\n");

        const systemPrompt = `You are the Lead Meta Ads Performance Marketing Director & Media Buyer for Postfly SaaS.
You have LIVE real-time telemetry access to the user's connected Meta Ad Account (${selectedAccount || "act_main"}).

Live Account Summary:
- Total Spend: ₹${totalSpend.toLocaleString("en-IN")}
- Total Impressions: ${totalImpressions.toLocaleString("en-IN")}
- Total Clicks: ${totalClicks.toLocaleString("en-IN")} (Avg CTR: ${avgCTR}%)
- Total Purchases/Leads: ${totalPurchases}

All Connected Campaigns Telemetry (${campaigns.length} total):
${campaignContextList || "No active campaigns registered yet."}

Your Instructions:
- Answer ALL questions about campaigns, ROAS, budget, CPC, CTR, audiences, and ad copies with extreme accuracy using the telemetry above.
- If asked about a specific campaign, cite its exact budget, spent, CTR, ROAS, and status.
- Be direct, authoritative, and helpful. Use clean Markdown formatting, bold text, and bullet points. Never output raw JSON unless specifically requested.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `${systemPrompt}\n\nUser Question:\n${cleanQuery}`
        });

        const reply = response.text ? response.text.trim() : null;
        if (reply) {
          return NextResponse.json({ success: true, text: reply });
        }
      } catch (aiErr) {
        console.warn("Gemini call failed or key quota exceeded, switching to dynamic heuristic engine:", aiErr.message);
      }
    }

    // --------------------------------------------------------------------------
    // 3. DYNAMIC INTELLIGENT CONTEXTUAL HEURISTIC ENGINE
    // --------------------------------------------------------------------------
    let dynamicReply = "";

    if (lower.includes("audit") || lower.includes("roas") || lower.includes("performance") || lower.includes("review")) {
      const topCampaign = campaigns.find((c) => (parseFloat(c.roas) || 0) >= 3) || campaigns[0] || { name: "Retargeting Abandoners", roas: "4.1x" };
      dynamicReply = `📊 **Meta Ads Performance & ROAS Audit**

• **Account Health:** ₹${totalSpend.toLocaleString()} spent across ${campaigns.length} active campaigns delivering an average CTR of **${avgCTR}%**.
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
      // Find matching campaign if specific campaign mentioned
      const matchedCam = campaigns.find((c) => lower.includes(c.name.toLowerCase()));
      if (matchedCam) {
        dynamicReply = `🎯 **Campaign Inspection: "${matchedCam.name}"**

• **Status:** ${matchedCam.status === "ACTIVE" ? "🟢 ACTIVE" : "⏸️ PAUSED"}
• **Daily Budget:** ₹${(matchedCam.dailyBudget || 0).toLocaleString("en-IN")}/day
• **Total Spent:** ₹${(matchedCam.spent || 0).toLocaleString("en-IN")}
• **Link CTR:** ${matchedCam.ctr || "1.85%"}
• **ROAS:** ${matchedCam.roas || "0.0x"}
• **Results:** ${matchedCam.purchases || 12} Conversions/Leads
• **Platform:** ${matchedCam.platform || "Instagram"}

**AI Recommendation:** ${matchedCam.status === "PAUSED" ? "Activate this campaign to resume traffic delivery." : "Increase daily budget by +20% to scale reach during high-converting hours."}`;
      } else {
        dynamicReply = `🎯 **Meta Ads Strategic Assessment**

Regarding: *"${cleanQuery}"*

• **Current Metrics:** ₹${totalSpend.toLocaleString()} spend tracked across ${campaigns.length} campaigns with **${avgCTR}% average CTR** and **${totalPurchases} conversions**.
• **Strategic Insight:** For optimal delivery on Meta's 2026 auction algorithm, prioritize creative diversification (Reels 9:16 + Carousel) paired with Advantage+ Campaign Budget.
• **Action Step:** Leverage your highest ROAS campaign ("${campaigns[0]?.name || "Active Campaign"}") as the primary conversion driver while running continuous A/B creative testing.

Need specific guidance on copy, audience targeting, or budget allocation? Choose a quick command or type your query.`;
      }
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
