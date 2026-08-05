import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const userId = req.headers.get("x-user-id") || "saif@example.com";
    const client = await clientPromise;
    const db = client.db();

    const settings = await db.collection("settings").findOne({ userId });
    return NextResponse.json({ settings: settings || {} });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = req.headers.get("x-user-id") || "saif@example.com";
    const updates = await req.json();
    const client = await clientPromise;
    const db = client.db();

    await db.collection("settings").updateOne(
      { userId },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
