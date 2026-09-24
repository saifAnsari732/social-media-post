import { NextResponse } from "next/server";
import { getAdAccounts, upsertAdAccount, removeAdAccount } from "@/lib/db";

export const dynamic = "force-dynamic";

const DEFAULT_ACCOUNTS = [
  { accountId: "act_982402198", name: "Main E-Commerce Ads", status: "Active", currency: "INR", isDefault: true },
  { accountId: "act_40912830", name: "Brand Retargeting Account", status: "Active", currency: "INR", isDefault: true },
  { accountId: "act_77123901", name: "Agency Client Account #1", status: "Active", currency: "INR", isDefault: true }
];

export async function GET(req) {
  try {
    let userId = req.headers.get("x-user-id") || req.nextUrl.searchParams.get("userId") || null;
    if (userId === "undefined" || userId === "null" || !userId?.trim()) {
      userId = null;
    }

    const dbAccounts = await getAdAccounts(userId);

    // Merge default accounts with saved DB accounts if none exists
    let accounts = dbAccounts && dbAccounts.length > 0 ? dbAccounts : [];

    if (accounts.length === 0) {
      // Seed default accounts for new session
      accounts = DEFAULT_ACCOUNTS.map((acc) => ({
        ...acc,
        id: acc.accountId,
        userId: userId || "guest"
      }));
    } else {
      accounts = accounts.map((acc) => ({
        ...acc,
        id: acc.accountId || acc.id
      }));
    }

    return NextResponse.json({ success: true, accounts });
  } catch (err) {
    console.error("[Ads Accounts GET] Error:", err);
    return NextResponse.json({ success: false, error: err.message, accounts: DEFAULT_ACCOUNTS.map(a => ({ ...a, id: a.accountId })) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    let userId = req.headers.get("x-user-id") || null;
    if (userId === "undefined" || userId === "null" || !userId?.trim()) {
      userId = null;
    }

    const body = await req.json();
    const { accountId, name, currency = "INR", accessToken = null } = body;

    if (!accountId || typeof accountId !== "string" || !accountId.trim()) {
      return NextResponse.json({ success: false, error: "Ad Account ID is required" }, { status: 400 });
    }

    const cleanId = accountId.trim();
    const formattedId = cleanId.startsWith("act_") ? cleanId : `act_${cleanId}`;
    const cleanName = (name && name.trim()) ? name.trim() : `Meta Ad Account (${formattedId})`;

    const newAdAccount = {
      accountId: formattedId,
      name: cleanName,
      currency: currency || "INR",
      status: "Active",
      accessToken: accessToken || null,
      userId: userId || "guest",
      connectedAt: new Date().toISOString()
    };

    await upsertAdAccount(newAdAccount);

    return NextResponse.json({
      success: true,
      account: { ...newAdAccount, id: formattedId },
      message: `Meta Ad Account "${cleanName}" (${formattedId}) connected successfully!`
    });
  } catch (err) {
    console.error("[Ads Accounts POST] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    let userId = req.headers.get("x-user-id") || null;
    const body = await req.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json({ success: false, error: "accountId is required" }, { status: 400 });
    }

    await removeAdAccount(accountId, userId);
    return NextResponse.json({ success: true, message: "Ad Account disconnected successfully." });
  } catch (err) {
    console.error("[Ads Accounts DELETE] Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
