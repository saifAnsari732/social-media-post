import { NextResponse } from "next/server";
import { getAccounts, removeAccount } from "@/lib/db";
import { serverCache } from "@/lib/cache";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(req) {
  let userId = req.headers.get("x-user-id") || null;
  if (userId === "undefined" || userId === "null" || !userId.trim()) {
    userId = null;
  }
  const cacheKey = `accounts:${userId || 'all'}`;

  // Check advanced server cache (TTL: 30 seconds, tagged with user)
  const cachedAccounts = serverCache.get(cacheKey);
  if (cachedAccounts) {
    return NextResponse.json({ accounts: cachedAccounts, cached: true }, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Cache-Status": "HIT"
      }
    });
  }

  const dbAccounts = await getAccounts(userId);
  
  const accounts = await Promise.all(dbAccounts.map(async (a) => {
    let followers = a.followers || null;
    let followersFormatted = a.followersFormatted || null;

    if (!followersFormatted && a.followersCount !== undefined) {
      followers = a.followersCount;
      followersFormatted = a.followersCount > 1000 ? `${(a.followersCount / 1000).toFixed(1)}K` : `${a.followersCount}`;
    }

    // Determine rich channel name & handle
    const channelName = 
      a.accountName || 
      a.name || 
      a.username || 
      a.raw?.name || 
      a.raw?.page?.name || 
      a.raw?.snippet?.title || 
      (a.platform === "instagram" ? "Mr chini shorts" : a.platform === "facebook" ? "Newcretae" : a.platform === "youtube" ? "US_shorts24" : `${a.platform} Channel`);

    const rawHandle = 
      a.handle || 
      a.username || 
      (channelName ? channelName.toLowerCase().replace(/\s+/g, '') : a.platform);

    const formattedHandle = rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`;

    return {
      _id: a._id,
      platform: a.platform,
      name: channelName,
      accountName: channelName,
      username: rawHandle.replace(/^@/, ''),
      handle: formattedHandle,
      followers: followers,
      followersFormatted: followersFormatted,
      connectedAt: a.connectedAt
    };
  }));

  // Store in cache
  serverCache.set(cacheKey, accounts, 30, [`user:${userId}`, "accounts"]);

  return NextResponse.json({ accounts, cached: false }, {
    headers: {
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      "X-Cache-Status": "MISS"
    }
  });
}

export async function DELETE(req) {
  const { id } = await req.json();
  const userId = req.headers.get("x-user-id") || null;
  await removeAccount(id, userId);

  // Invalidate cache immediately on account removal
  serverCache.revalidateTag(`user:${userId}`);
  serverCache.revalidateTag("accounts");

  return NextResponse.json({ success: true });
}
