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
    const hasPaidHistory = history.some(b => 
      (b.status || "").toLowerCase() === "paid" || 
      (b.status || "").toLowerCase() === "captured"
    );

    const userPlanLower = (user?.plan || "").toLowerCase();
    const isPaidPlanName = 
      (userPlanLower.includes("starter") || userPlanLower.includes("growth") || userPlanLower.includes("pro") || userPlanLower.includes("unlimited")) &&
      !userPlanLower.includes("trial");

    const isPaid = hasPaidHistory || isPaidPlanName;
    const activePlan = isPaid ? user.plan : "5-Day Trial";

    return NextResponse.json({
      success: true,
      currentPlan: activePlan,
      isPaid,
      userPlan: user?.plan || activePlan,
      planPurchasedAt: user?.planPurchasedAt || null,
      planExpiresAt: user?.planExpiresAt || null,
      planUpdatedAt: user?.planUpdatedAt || null,
      trialStartDate: isPaid ? null : (user?.trialStartDate || user?.createdAt || null),
      history: history
    });
  } catch (error) {
    console.error("Billing status API error:", error);
    return NextResponse.json({ error: "Failed to fetch billing status" }, { status: 500 });
  }
}
