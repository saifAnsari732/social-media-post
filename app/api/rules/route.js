import { NextResponse } from "next/server";
import { getRules, createRule } from "@/lib/db";

export async function GET(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rules = await getRules(userId);
    return NextResponse.json({ rules });
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
    return NextResponse.json({ rule: newRule }, { status: 201 });
  } catch (error) {
    console.error("Error creating rule:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
