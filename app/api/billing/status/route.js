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

    const history = billingHistory || [];
    const hasPaid = history.some(b => b.status === "paid" || b.status === "captured");
    const activePlan = hasPaid && user?.plan && !user.plan.toLowerCase().includes("trial") 
      ? user.plan 
      : "5-Day Trial";

    return NextResponse.json({
      success: true,
      currentPlan: activePlan,
      isPaid: hasPaid,
      planUpdatedAt: user?.planUpdatedAt || null,
      trialStartDate: user?.trialStartDate || user?.createdAt || null,
      history: history
    });
  } catch (error) {
    console.error("Billing status API error:", error);
    return NextResponse.json({ error: "Failed to fetch billing status" }, { status: 500 });
  }
}
