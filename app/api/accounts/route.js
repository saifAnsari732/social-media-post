import { NextResponse } from "next/server";
import { getAccounts, removeAccount } from "@/lib/db";

export async function GET(req) {
  const userId = req.headers.get("x-user-id") || null;
  const dbAccounts = await getAccounts(userId);
  
  const accounts = await Promise.all(dbAccounts.map(async (a) => {
    let followers = a.followers || null;
    let followersFormatted = a.followersFormatted || null;

    // If followers exist on account object, use them; otherwise try fetching live stats or calculating based on account metadata
    if (!followersFormatted && a.followersCount !== undefined) {
      followers = a.followersCount;
      followersFormatted = a.followersCount > 1000 ? `${(a.followersCount / 1000).toFixed(1)}K` : `${a.followersCount}`;
    }

    return {
      _id: a._id,
      platform: a.platform,
      name: a.name || null,
      followers: followers,
      followersFormatted: followersFormatted,
      connectedAt: a.connectedAt
    };
  }));

  return NextResponse.json({ accounts });
}

export async function DELETE(req) {
  const { id } = await req.json();
  const userId = req.headers.get("x-user-id") || null;
  await removeAccount(id, userId);
  return NextResponse.json({ success: true });
}
