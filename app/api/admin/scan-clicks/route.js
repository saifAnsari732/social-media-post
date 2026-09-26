import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const client = await clientPromise;
    const db = client.db();

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD

    const clickRecord = {
      userId: body.userId || "anonymous",
      userName: body.userName || "Creator",
      userEmail: body.userEmail || "user@platform.local",
      mediaType: body.isVideo ? "video" : (body.mediaType || "media"),
      fileName: body.fileName || "unknown",
      hasCaption: Boolean(body.hasCaption),
      dateStr,
      timestamp: now.toISOString(),
      createdAt: now
    };

    await db.collection("ai_scan_clicks").insertOne(clickRecord);

    return NextResponse.json({ success: true, logged: true });
  } catch (err) {
    console.error("Error logging AI scan click:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const allClicks = await db.collection("ai_scan_clicks")
      .find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    // Calculate totals
    const todayTotal = allClicks.filter(c => c.dateStr === todayStr).length;
    const allTimeTotal = allClicks.length;

    // Group clicks by user
    const userMap = {};
    for (const c of allClicks) {
      const uid = c.userId || c.userEmail || "anonymous";
      if (!userMap[uid]) {
        userMap[uid] = {
          userId: c.userId || "N/A",
          userName: c.userName || "Creator",
          userEmail: c.userEmail || "user@platform.local",
          todayClicks: 0,
          totalClicks: 0,
          lastScanTime: c.timestamp,
          lastMediaType: c.mediaType || "video"
        };
      }
      userMap[uid].totalClicks++;
      if (c.dateStr === todayStr) {
        userMap[uid].todayClicks++;
      }
      if (!userMap[uid].lastScanTime || new Date(c.timestamp) > new Date(userMap[uid].lastScanTime)) {
        userMap[uid].lastScanTime = c.timestamp;
        userMap[uid].lastMediaType = c.mediaType;
      }
    }

    const userStats = Object.values(userMap).sort((a, b) => b.todayClicks - a.todayClicks || b.totalClicks - a.totalClicks);

    return NextResponse.json({
      success: true,
      todayStr,
      todayTotal,
      allTimeTotal,
      userStats,
      recentClicks: allClicks.slice(0, 20)
    });
  } catch (err) {
    console.error("Error fetching AI scan clicks:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
