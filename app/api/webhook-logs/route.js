import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch the 50 most recent webhook logs
    const logs = await db.collection("webhook_logs")
      .find({})
      .sort({ receivedAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Webhook Logs Error:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
