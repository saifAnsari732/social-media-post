import { NextResponse } from "next/server";
import { getRules, createRule } from "@/lib/db";
import { serverCache } from "@/lib/cache";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(req) {
  try {
    let userId = req.headers.get("x-user-id");
    if (!userId || userId === "undefined" || userId === "null") {
      userId = null;
    }

    const cacheKey = `rules:${userId || 'all'}`;
    const cachedRules = serverCache.get(cacheKey);
    if (cachedRules) {
      return NextResponse.json({ rules: cachedRules, cached: true }, {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
          "X-Cache-Status": "HIT"
        }
      });
    }

    const rules = await getRules(userId);
    serverCache.set(cacheKey, rules, 30, [`user:${userId}`, "rules"]);

    return NextResponse.json({ rules, cached: false }, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Cache-Status": "MISS"
      }
    });
  } catch (error) {
    console.error("Error fetching rules:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    
    const ruleData = {
      ...body,
      user: userId,
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: { totalTriggered: 0, totalRepliesSent: 0, totalFailed: 0 }
    };

    const newRule = await createRule(ruleData);

    // Invalidate cache immediately on new rule
    serverCache.revalidateTag(`user:${userId}`);
    serverCache.revalidateTag("rules");

    return NextResponse.json({ rule: newRule }, { status: 201 });
  } catch (error) {
    console.error("Error creating rule:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
