import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const userId = req.headers.get("x-user-id") || "saif@example.com";
    const client = await clientPromise;
    const db = client.db();

    // 1. Get active rules count
    const activeRules = await db.collection("rules").countDocuments({ 
      user: userId,
      status: "active" 
    });

    // 2. Get total replies sent by summing rule stats
    const rules = await db.collection("rules").find({ user: userId }).toArray();
    let totalRepliesSent = 0;
    rules.forEach(rule => {
      if (rule.stats && rule.stats.totalRepliesSent) {
        totalRepliesSent += rule.stats.totalRepliesSent;
      }
    });

    // 3. Mock AI Tokens based on replies (approx 150 tokens per AI reply)
    // Real implementation would track this in the DB per AI call.
    const aiTokensUsed = totalRepliesSent * 150;

    return NextResponse.json({ 
      activeRules,
      totalRepliesSent,
      aiTokensUsed
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
