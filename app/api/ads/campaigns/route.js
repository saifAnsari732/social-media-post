import { NextResponse } from "next/server";
import { getDb, getAdAccounts, getAdCampaigns, upsertAdCampaign, removeAdCampaign } from "@/lib/db";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");
    let userId = req.headers.get("x-user-id") || searchParams.get("userId") || null;
    if (userId === "undefined" || userId === "null" || !userId?.trim()) {
      userId = null;
    }

    if (!accountId) {
      return NextResponse.json({ success: true, campaigns: [] });
    }

    const cleanAccountId = accountId.trim();
    const formattedAccountId = cleanAccountId.startsWith("act_") ? cleanAccountId : `act_${cleanAccountId}`;

    let liveMetaCampaigns = [];
    let accessToken = null;

    // 1. Check if we have an access token for this ad account in DB
    try {
      const dbAccounts = await getAdAccounts(userId);
      const matchedAccount = dbAccounts.find(
        (a) => a.accountId === formattedAccountId || a.id === formattedAccountId || a.accountId === cleanAccountId
      );
      if (matchedAccount?.accessToken) {
        accessToken = matchedAccount.accessToken;
      }
    } catch (dbErr) {
      console.error("[Ads Campaigns GET] DB account lookup error:", dbErr);
    }

    // 2. Fetch live campaigns from Meta Graph API if access token exists
    if (accessToken) {
      try {
        const metaRes = await fetch(
          `https://graph.facebook.com/v20.0/${formattedAccountId}/campaigns?fields=id,name,objective,status,daily_budget,lifetime_budget,created_time,insights{spend,impressions,clicks,ctr,purchase_roas,actions}&limit=50&access_token=${accessToken}`
        );
        const metaData = await metaRes.json();
        if (metaData.data && Array.isArray(metaData.data)) {
          liveMetaCampaigns = metaData.data.map((c) => {
            const insights = c.insights?.data?.[0] || {};
            const actions = insights.actions || [];
            const purchaseObj = actions.find((a) => a.action_type === "purchase" || a.action_type === "omni_purchase");
            const purchases = purchaseObj ? Number(purchaseObj.value) : 0;
            const roasArr = insights.purchase_roas || [];
            const roasVal = roasArr[0]?.value ? Number(roasArr[0].value).toFixed(1) : "0.0";

            return {
              id: c.id,
              name: c.name,
              platform: "instagram",
              objective: c.objective || "Conversions (Sales)",
              status: c.status || "ACTIVE",
              dailyBudget: c.daily_budget ? Number(c.daily_budget) / 100 : c.lifetime_budget ? Number(c.lifetime_budget) / 100 : 0,
              spent: insights.spend ? Number(insights.spend) : 0,
              impressions: insights.impressions ? Number(insights.impressions) : 0,
              clicks: insights.clicks ? Number(insights.clicks) : 0,
              ctr: insights.ctr ? `${Number(insights.ctr).toFixed(2)}%` : "0.00%",
              purchases,
              roas: `${roasVal}x`,
              isMetaLive: true
            };
          });
        }
      } catch (metaErr) {
        console.warn("[Ads Campaigns GET] Meta Graph API fetch failed:", metaErr);
      }
    }

    // 3. Fetch user-created / persistent campaigns from MongoDB
    const dbCampaigns = await getAdCampaigns(formattedAccountId, userId);

    // Merge Meta Live + DB campaigns deduplicating by ID
    const seenIds = new Set();
    const mergedCampaigns = [];

    for (const c of [...liveMetaCampaigns, ...dbCampaigns]) {
      const id = c.id || c._id;
      if (id && !seenIds.has(id)) {
        seenIds.add(id);
        mergedCampaigns.push({
          ...c,
          id
        });
      }
    }

    return NextResponse.json({
      success: true,
      accountId: formattedAccountId,
      campaigns: mergedCampaigns,
      isReal: true
    });
  } catch (err) {
    console.error("[Ads Campaigns GET] Error:", err);
    return NextResponse.json({ success: false, error: err.message, campaigns: [] }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    let userId = req.headers.get("x-user-id") || null;
    const body = await req.json();
    const { accountId, name, objective, dailyBudget, platform = "instagram" } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Campaign name is required" }, { status: 400 });
    }

    const cleanAccountId = (accountId || "act_primary").trim();
    const formattedAccountId = cleanAccountId.startsWith("act_") ? cleanAccountId : `act_${cleanAccountId}`;
    const newId = `cam_${Date.now()}`;

    const newCampaign = {
      id: newId,
      accountId: formattedAccountId,
      adAccountId: formattedAccountId,
      name: name.trim(),
      platform: platform || "instagram",
      objective: objective || "Conversions (Sales)",
      status: "ACTIVE",
      dailyBudget: Number(dailyBudget) || 1500,
      spent: 0,
      impressions: 0,
      clicks: 0,
      ctr: "0.00%",
      purchases: 0,
      roas: "0.0x",
      userId: userId || "guest",
      createdAt: new Date().toISOString()
    };

    await upsertAdCampaign(newCampaign);

    return NextResponse.json({
      success: true,
      campaign: newCampaign,
      message: `Campaign "${newCampaign.name}" created successfully!`
    });
  } catch (err) {
    console.error("[Ads Campaigns POST] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    let userId = req.headers.get("x-user-id") || null;
    const body = await req.json();
    const targetId = body.id || body.campaignId;
    const { status, dailyBudget, name, objective, platform } = body;

    if (!targetId) {
      return NextResponse.json({ success: false, error: "Campaign ID is required" }, { status: 400 });
    }

    const existingList = await getAdCampaigns(null, userId);
    const existing = existingList.find((c) => c.id === targetId || c._id === targetId);

    const updated = {
      ...(existing || { id: targetId }),
      id: targetId,
      userId: userId || "guest"
    };

    if (status) updated.status = status;
    if (dailyBudget !== undefined) updated.dailyBudget = Number(dailyBudget);
    if (name) updated.name = name.trim();
    if (objective) updated.objective = objective.trim();
    if (platform) updated.platform = platform;

    await upsertAdCampaign(updated);

    return NextResponse.json({
      success: true,
      campaign: updated
    });
  } catch (err) {
    console.error("[Ads Campaigns PUT] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    let userId = req.headers.get("x-user-id") || null;
    const body = await req.json();
    const targetId = body.id || body.campaignId;

    if (!targetId) {
      return NextResponse.json({ success: false, error: "Campaign ID is required" }, { status: 400 });
    }

    await removeAdCampaign(targetId, userId);

    return NextResponse.json({
      success: true,
      message: "Campaign deleted successfully."
    });
  } catch (err) {
    console.error("[Ads Campaigns DELETE] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
