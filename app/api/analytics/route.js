import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // 1. Get connected channels count
    const connectedChannels = await db.collection("accounts").countDocuments({ userId });

    // 2. Get posts count (simulate scheduled/published posts)
    // Assuming posts have userId (we should make sure they do when posting)
    const scheduledPosts = await db.collection("posts").countDocuments({ userId });

    // 3. Get active rules and total replies sent
    const activeRules = await db.collection("rules").countDocuments({ 
      user: userId,
      status: "active" 
    });

    const rules = await db.collection("rules").find({ user: userId }).toArray();
    let totalRepliesSent = 0;
    rules.forEach(rule => {
      if (rule.stats && rule.stats.totalRepliesSent) {
        totalRepliesSent += rule.stats.totalRepliesSent;
      }
    });

    // 4. Calculate some mock "Engagement Lift" for now, or 0 if no replies
    const engagementLift = totalRepliesSent > 0 ? (Math.min(totalRepliesSent * 0.5, 99)).toFixed(1) + "%" : "0%";

    return NextResponse.json({ 
      connectedChannels,
      scheduledPosts,
      activeRules,
      totalRepliesSent,
      engagementLift
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
