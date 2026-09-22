import { NextResponse } from "next/server";
import { getUserById, getUserBillingHistory } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user, billingHistory] = await Promise.all([
      getUserById(userId),
      getUserBillingHistory(userId)
    ]);

    return NextResponse.json({
      success: true,
      currentPlan: user?.plan || "Starter",
      planUpdatedAt: user?.planUpdatedAt || null,
      history: billingHistory || []
    });
  } catch (error) {
    console.error("Billing status API error:", error);
    return NextResponse.json({ error: "Failed to fetch billing status" }, { status: 500 });
  }
}
