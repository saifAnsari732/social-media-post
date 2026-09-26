import { NextResponse } from "next/server";
import { upsertAccount, upsertAdAccount } from "@/lib/db";
import { serverCache } from "@/lib/cache";

async function exchangeToken(provider, code) {
  switch (provider) {
    case "youtube": {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.YOUTUBE_CLIENT_ID,
          client_secret: process.env.YOUTUBE_CLIENT_SECRET,
          redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
          grant_type: "authorization_code"
        })
      });
      return res.json();
    }
    case "facebook":
    case "instagram":
    case "meta_ads":
    case "facebook_ads": {
      const appId = process.env.META_APP_ID || "1401279338528045";
      const appSecret = process.env.META_APP_SECRET;
      // Both facebook and instagram use the facebook redirect URI
      const redirectUri =
        process.env.META_REDIRECT_URI ||
        "https://social-media-post-eta.vercel.app/api/auth/callback/facebook";

      // Step 1: Get short-lived user access token
      const shortTokenRes = await fetch(
        `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`
      );
      const shortToken = await shortTokenRes.json();
      if (shortToken.error) return shortToken;

      console.log("[Meta] Short-lived token obtained:", shortToken.access_token?.slice(0, 20) + "...");

      // Step 2: Exchange for long-lived user access token (60 days)
      // This is CRITICAL - long-lived tokens return ALL pages, not just test pages
      const longTokenRes = await fetch(
        `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken.access_token}`
      );
      const longToken = await longTokenRes.json();

      if (longToken.error) {
        console.warn("[Meta] Could not get long-lived token, using short-lived:", longToken.error);
        return shortToken; // fallback to short-lived
      }

      console.log("[Meta] Long-lived token obtained successfully, expires in:", longToken.expires_in, "seconds");
      return { ...longToken, short_token: shortToken.access_token };
    }
    case "twitter": {
      const basicAuth = Buffer.from(
        `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
      ).toString("base64");
      const res = await fetch("https://api.twitter.com/2/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`
        },
        body: new URLSearchParams({
          code,
          grant_type: "authorization_code",
          client_id: process.env.TWITTER_CLIENT_ID,
          redirect_uri: process.env.TWITTER_REDIRECT_URI,
          code_verifier: "challenge_challenge_challenge_challenge_challenge"
        })
      });
      return res.json();
    }
    case "linkedin": {
      const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI
        })
      });
      return res.json();
    }
    case "threads": {
      const appId = process.env.THREADS_APP_ID || process.env.NEXT_PUBLIC_THREADS_APP_ID || process.env.META_APP_ID || "1401279338528045";
      const appSecret = process.env.THREADS_APP_SECRET || process.env.META_APP_SECRET;
      const redirectUri =
        process.env.THREADS_REDIRECT_URI ||
        "https://social-media-post-eta.vercel.app/api/auth/callback/threads";

      // Step 1: Exchange code for short-lived token
      const res = await fetch("https://graph.threads.net/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: appId,
          client_secret: appSecret,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          code
        })
      });
      const shortToken = await res.json();
      if (shortToken.error || !shortToken.access_token) return shortToken;

      console.log("[Threads] Short-lived token obtained:", shortToken.access_token?.slice(0, 15) + "...");

      // Step 2: Exchange for long-lived access token (60 days)
      try {
        const longRes = await fetch(
          `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${appSecret}&access_token=${shortToken.access_token}`
        );
        const longToken = await longRes.json();
        console.log("[Threads] Long-lived token response:", JSON.stringify({ expires_in: longToken.expires_in, hasToken: !!longToken.access_token }));
        if (longToken.access_token) {
          return { ...longToken, user_id: shortToken.user_id || longToken.user_id };
        }
      } catch (err) {
        console.warn("[Threads] Failed to exchange long-lived token, using short-lived fallback:", err);
      }

      return shortToken;
    }
    case "pinterest": {
      const basicAuth = Buffer.from(
        `${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`
      ).toString("base64");
      const res = await fetch("https://api.pinterest.com/v5/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.PINTEREST_REDIRECT_URI
        })
      });
      return res.json();
    }
    case "tiktok": {
      const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_key: process.env.TIKTOK_CLIENT_KEY,
          client_secret: process.env.TIKTOK_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: process.env.TIKTOK_REDIRECT_URI
        })
      });
      return res.json();
    }
    default:
      throw new Error("Unknown provider");
  }
}

// ─── Fetch ALL Facebook pages via multiple strategies ────────────────────────
async function fetchAllMetaPages(userAccessToken) {
  const IG_FIELDS =
    "instagram_business_account{id,username,name,profile_picture_url,followers_count,biography,website}";
  const PAGE_FIELDS = `id,name,fan_count,access_token,category,picture,${IG_FIELDS}`;

  let pages = [];

  // ── Strategy 1: /me/accounts (primary) ───────────────────────────────────
  try {
    let url = `https://graph.facebook.com/v20.0/me/accounts?fields=${encodeURIComponent(
      PAGE_FIELDS
    )}&limit=200&access_token=${userAccessToken}`;

    let pageCount = 0;
    while (url && pageCount < 10) {
      const res = await fetch(url);
      const data = await res.json();

      console.log(`[Meta Strategy 1] Page ${pageCount + 1} response:`, JSON.stringify({
        count: data.data?.length ?? "no data key",
        error: data.error || null,
        hasNext: !!data.paging?.next
      }));

      if (data.error) {
        console.warn("[Meta Strategy 1] Error:", data.error);
        break;
      }

      if (data.data && data.data.length > 0) {
        pages.push(...data.data);
      }

      url = data.paging?.next || null;
      pageCount++;
    }

    console.log(`[Meta Strategy 1] Total pages fetched: ${pages.length}`);
  } catch (err) {
    console.error("[Meta Strategy 1] Exception:", err);
  }

  // ── Strategy 2: debug_token granular_scopes fallback ─────────────────────
  if (pages.length === 0) {
    console.log("[Meta Strategy 2] Trying debug_token granular_scopes...");
    try {
      const appId = process.env.META_APP_ID || "1401279338528045";
      const appSecret = process.env.META_APP_SECRET;
      const appToken = `${appId}|${appSecret}`;

      const debugRes = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${userAccessToken}&access_token=${appToken}`
      );
      const debugData = await debugRes.json();

      console.log("[Meta Strategy 2] debug_token:", JSON.stringify({
        scopes: debugData.data?.scopes,
        granular_scopes: debugData.data?.granular_scopes?.map(g => ({
          scope: g.scope,
          count: g.target_ids?.length
        }))
      }));

      if (debugData.data?.granular_scopes) {
        const relevantScope = debugData.data.granular_scopes.find(
          s =>
            s.scope === "pages_show_list" ||
            s.scope === "pages_manage_posts" ||
            s.scope === "pages_manage_metadata" ||
            s.scope === "pages_read_engagement"
        );

        if (relevantScope?.target_ids?.length > 0) {
          console.log(
            `[Meta Strategy 2] Found ${relevantScope.target_ids.length} page IDs from granular_scopes`
          );

          const fetchPromises = relevantScope.target_ids.map(pageId =>
            fetch(
              `https://graph.facebook.com/v20.0/${pageId}?fields=${encodeURIComponent(
                PAGE_FIELDS
              )}&access_token=${userAccessToken}`
            )
              .then(r => r.json())
              .catch(e => {
                console.error(`[Meta Strategy 2] Failed to fetch page ${pageId}:`, e);
                return null;
              })
          );

          const fetched = await Promise.all(fetchPromises);
          const valid = fetched.filter(p => p && p.id && !p.error);
          pages.push(...valid);
          console.log(`[Meta Strategy 2] Fetched ${valid.length} pages via granular_scopes`);
        }
      }
    } catch (err) {
      console.error("[Meta Strategy 2] Exception:", err);
    }
  }

  // ── Strategy 3: Business Manager pages ───────────────────────────────────
  if (pages.length === 0) {
    console.log("[Meta Strategy 3] Trying Business Manager API...");
    try {
      // Get all businesses the user belongs to
      const bizRes = await fetch(
        `https://graph.facebook.com/v20.0/me/businesses?fields=id,name&access_token=${userAccessToken}`
      );
      const bizData = await bizRes.json();

      if (bizData.data && bizData.data.length > 0) {
        for (const biz of bizData.data) {
          const pagesRes = await fetch(
            `https://graph.facebook.com/v20.0/${biz.id}/owned_pages?fields=${encodeURIComponent(
              PAGE_FIELDS
            )}&limit=100&access_token=${userAccessToken}`
          );
          const pagesData = await pagesRes.json();

          if (pagesData.data && pagesData.data.length > 0) {
            pages.push(...pagesData.data);
            console.log(
              `[Meta Strategy 3] Found ${pagesData.data.length} pages in business ${biz.name}`
            );
          }
        }
      }
    } catch (err) {
      console.error("[Meta Strategy 3] Exception:", err);
    }
  }

  // ── Deduplicate by page ID ────────────────────────────────────────────────
  const seen = new Set();
  const uniquePages = pages.filter(p => {
    if (!p.id || seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  console.log(
    `[Meta] Final unique pages: ${uniquePages.length} (from ${pages.length} total fetched)`
  );

  return uniquePages;
}

// ─── Fetch ALL LinkedIn Organization / Company Pages ────────────────────────
async function fetchAllLinkedInOrganizations(accessToken) {
  const organizations = [];
  try {
    console.log("[LinkedIn] Fetching organization ACLs...");
    // 1. Fetch organizational entity ACLs (approved role assignments)
    let aclsUrl = "https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&state=APPROVED";
    let aclsRes = await fetch(aclsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0"
      }
    });
    let aclsData = await aclsRes.json();
    console.log("[LinkedIn] organizationalEntityAcls (state=APPROVED):", JSON.stringify(aclsData));

    let elements = aclsData.elements || [];

    // Fallback: If no elements with state=APPROVED, try without state parameter
    if (!elements || elements.length === 0) {
      console.log("[LinkedIn] Trying ACLs query without state filter...");
      const fallbackRes = await fetch(
        "https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0"
          }
        }
      );
      const fallbackData = await fallbackRes.json();
      console.log("[LinkedIn] organizationalEntityAcls (fallback):", JSON.stringify(fallbackData));
      if (fallbackData.elements && fallbackData.elements.length > 0) {
        elements = fallbackData.elements;
      } else {
        console.log("[LinkedIn] Trying modern organizationAcls endpoint...");
        try {
          const modernRes = await fetch(
            "https://api.linkedin.com/v2/organizationAcls?q=roleAssignee",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0"
              }
            }
          );
          const modernData = await modernRes.json();
          console.log("[LinkedIn] organizationAcls (modern):", JSON.stringify(modernData));
          if (modernData.elements && modernData.elements.length > 0) {
            elements = modernData.elements;
          }
        } catch (e) {
          console.error("[LinkedIn] Modern organizationAcls error:", e);
        }
      }
    }

    if (elements && elements.length > 0) {
      const orgUrnSet = new Set();
      for (const el of elements) {
        const target = el.organizationalTarget || el.organization || "";
        if (target) orgUrnSet.add(target);
      }

      console.log(`[LinkedIn] Found ${orgUrnSet.size} organization targets:`, Array.from(orgUrnSet));

      for (const targetUrn of orgUrnSet) {
        const match = targetUrn.match(/urn:li:(?:organization|organizationBrand):([0-9]+)/);
        const orgId = match ? match[1] : targetUrn.replace(/[^0-9]/g, "");

        if (!orgId) continue;

        try {
          // Fetch organization details (Name, Vanity Name, Logo)
          let orgRes = await fetch(
            `https://api.linkedin.com/v2/organizations/${orgId}?projection=(id,name,localizedName,vanityName,logoV2(original~:playableStreams))`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0"
              }
            }
          );
          let orgData = await orgRes.json();

          if (orgData.error || !orgData.id) {
            console.log(`[LinkedIn] Trying basic organization endpoint for Org ${orgId}...`);
            orgRes = await fetch(`https://api.linkedin.com/v2/organizations/${orgId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Restli-Protocol-Version": "2.0.0"
              }
            });
            orgData = await orgRes.json();
          }

          console.log(`[LinkedIn] Org ${orgId} details:`, JSON.stringify(orgData));

          let orgName =
            orgData.localizedName ||
            orgData.name?.localized?.en_US ||
            (orgData.name && typeof orgData.name === "string" ? orgData.name : null) ||
            orgData.vanityName ||
            `LinkedIn Company Page (${orgId})`;

          let vanity = orgData.vanityName || null;
          let logoUrl = null;

          try {
            const streams = orgData.logoV2?.["original~"]?.elements;
            if (streams && streams.length > 0) {
              logoUrl = streams[0].identifiers?.[0]?.identifier || null;
            }
          } catch (e) {
            // Logo parsing fallback
          }

          organizations.push({
            id: orgId,
            urn: `urn:li:organization:${orgId}`,
            name: orgName,
            vanityName: vanity,
            avatar: logoUrl
          });
        } catch (orgErr) {
          console.error(`[LinkedIn] Error fetching Org ${orgId}:`, orgErr);
          organizations.push({
            id: orgId,
            urn: `urn:li:organization:${orgId}`,
            name: `LinkedIn Page (${orgId})`,
            vanityName: null,
            avatar: null
          });
        }
      }
    }
  } catch (err) {
    console.error("[LinkedIn] Exception in fetchAllLinkedInOrganizations:", err);
  }

  return organizations;
}

export async function GET(req, { params }) {
  const { provider } = params;
  const code = req.nextUrl.searchParams.get("code");
  const stateParam = req.nextUrl.searchParams.get("state");
  const oauthError = req.nextUrl.searchParams.get("error");
  const oauthErrorDesc = req.nextUrl.searchParams.get("error_description");

  // Decode userId and returnTo from state parameter
  let userId = "anonymous";
  let originalProvider = provider; // what the user actually clicked
  let returnTo = null;
  if (stateParam) {
    try {
      const decoded = JSON.parse(Buffer.from(stateParam, "base64url").toString());
      userId = decoded.userId || "anonymous";
      if (decoded.provider) originalProvider = decoded.provider;
      if (decoded.returnTo) returnTo = decoded.returnTo;
    } catch (e) {
      // state might be a plain string from older flow, ignore
    }
  }

  // Handle OAuth denial/error from Meta
  if (oauthError) {
    const msg = oauthErrorDesc || oauthError;
    const dest = returnTo || (originalProvider === "meta_ads" ? "/ads" : "/accounts");
    return NextResponse.redirect(
      new URL(`${dest}?error=` + encodeURIComponent(`OAuth denied: ${msg}`), req.url)
    );
  }

  console.log(
    `[Callback] provider=${provider}, originalProvider=${originalProvider}, userId=${userId}, returnTo=${returnTo}`
  );

  if (!code) {
    const dest = returnTo || (originalProvider === "meta_ads" ? "/ads" : "/accounts");
    return NextResponse.redirect(new URL(`${dest}?error=missing_code`, req.url));
  }

  try {
    const tokenData = await exchangeToken(provider, code);

    if (tokenData.error) {
      throw new Error(
        `Token exchange failed: ${tokenData.error_description || tokenData.error}`
      );
    }

    // ── Meta Ads Manager & Ad Accounts (Dedicated Flow) ──────────────────────
    if (
      (originalProvider === "meta_ads" || originalProvider === "facebook_ads" || returnTo === "/ads") &&
      tokenData.access_token
    ) {
      try {
        console.log("[Meta Ads] Fetching Ad Accounts with Graph API v20.0...");
        const adAccRes = await fetch(
          `https://graph.facebook.com/v20.0/me/adaccounts?fields=id,name,account_id,account_status,currency,amount_spent,balance&limit=50&access_token=${tokenData.access_token}`
        );
        const adAccData = await adAccRes.json();
        console.log("[Meta Ads] Ad accounts response:", JSON.stringify(adAccData));

        let savedCount = 0;
        if (adAccData.data && adAccData.data.length > 0) {
          for (const adAcc of adAccData.data) {
            const formattedId = adAcc.id.startsWith("act_") ? adAcc.id : `act_${adAcc.account_id || adAcc.id}`;
            await upsertAdAccount({
              userId,
              accountId: formattedId,
              name: adAcc.name || `Meta Ad Account (${adAcc.account_id || adAcc.id})`,
              currency: adAcc.currency || "INR",
              status: adAcc.account_status === 1 ? "Active" : "Active",
              spent: adAcc.amount_spent ? Number(adAcc.amount_spent) / 100 : 0,
              accessToken: tokenData.access_token,
              connectedAt: new Date().toISOString()
            });
            savedCount++;
          }
        } else {
          // If profile has no explicit ad accounts returned directly, create connected ad account
          const fallbackId = `act_${Date.now().toString().slice(-8)}`;
          await upsertAdAccount({
            userId,
            accountId: fallbackId,
            name: "Connected Meta Ad Account",
            currency: "INR",
            status: "Active",
            accessToken: tokenData.access_token,
            connectedAt: new Date().toISOString()
          });
          savedCount = 1;
        }

        return NextResponse.redirect(
          new URL(`/ads?connected=meta_ads&count=${savedCount}`, req.url)
        );
      } catch (adErr) {
        console.error("[Meta Ads] Error saving ad accounts:", adErr);
        return NextResponse.redirect(
          new URL("/ads?error=" + encodeURIComponent(adErr.message || "Failed to sync Meta Ad Accounts"), req.url)
        );
      }
    }

    // ── YouTube ─────────────────────────────────────────────────────────────
    if (provider === "youtube" && tokenData.access_token) {
      let accountName = null;
      let providerAccountId = null;
      let followers = 0;
      try {
        const channelRes = await fetch(
          "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
          { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
        );
        const channelData = await channelRes.json();
        if (channelData.items && channelData.items.length > 0) {
          accountName = channelData.items[0].snippet.title;
          providerAccountId = channelData.items[0].id;
          followers = parseInt(channelData.items[0].statistics?.subscriberCount || 0, 10);
        }
      } catch (err) {
        console.error("Failed to fetch YouTube channel info", err);
      }

      await upsertAccount({
        platform: provider,
        providerAccountId,
        userId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        name: accountName,
        followers,
        followersFormatted: followers > 1000 ? `${(followers / 1000).toFixed(1)}K` : `${followers}`,
        connectedAt: new Date().toISOString(),
        raw: tokenData
      });

    // ── Facebook + Instagram (via Meta Graph) ────────────────────────────────
    } else if (
      (provider === "facebook" || provider === "instagram") &&
      tokenData.access_token
    ) {
      try {
        // Get the user's own profile for display name
        const meRes = await fetch(
          `https://graph.facebook.com/v20.0/me?fields=id,name&access_token=${tokenData.access_token}`
        );
        const meData = await meRes.json();
        console.log("[Meta] /me response:", JSON.stringify(meData));

        // Fetch ALL pages using multi-strategy approach
        const pages = await fetchAllMetaPages(tokenData.access_token);

        const upsertPromises = [];
        const savedFBPages = [];
        const savedIGAccounts = [];
        const savedThreadsAccounts = [];

        if (pages.length > 0) {
          for (const page of pages) {
            // ── Save Facebook Page ──
            if (!page.access_token) {
              console.warn(`[Meta] Page "${page.name}" has no page access_token, skipping FB save`);
            } else {
              const fanCount = page.fan_count || 0;
              const fbAccount = {
                platform: "facebook",
                providerAccountId: page.id,
                pageId: page.id,
                userId,
                accessToken: page.access_token,
                refreshToken: null,
                name: page.name,
                category: page.category || null,
                avatar: page.picture?.data?.url || null,
                followers: fanCount,
                followersFormatted:
                  fanCount > 1000000
                    ? `${(fanCount / 1000000).toFixed(1)}M`
                    : fanCount > 1000
                    ? `${(fanCount / 1000).toFixed(1)}K`
                    : `${fanCount}`,
                connectedAt: new Date().toISOString(),
                raw: { expires_in: tokenData.expires_in, token_type: tokenData.token_type, page_id: page.id }
              };
              upsertPromises.push(upsertAccount(fbAccount));
              savedFBPages.push(page.name);
            }

            // ── Save Instagram Business Account & Threads Account (if linked to this page) ──
            if (page.instagram_business_account) {
              const igAcc = page.instagram_business_account;
              const igFollowers = igAcc.followers_count || 0;
              const igAccount = {
                platform: "instagram",
                providerAccountId: igAcc.id,
                igUserId: igAcc.id,
                linkedPageId: page.id,
                linkedPageName: page.name,
                userId,
                accessToken: page.access_token, // Use PAGE token for IG API calls
                name: igAcc.name || igAcc.username || "Instagram Account",
                username: igAcc.username || null,
                avatar: igAcc.profile_picture_url || null,
                biography: igAcc.biography || null,
                website: igAcc.website || null,
                followers: igFollowers,
                followersFormatted:
                  igFollowers > 1000000
                    ? `${(igFollowers / 1000000).toFixed(1)}M`
                    : igFollowers > 1000
                    ? `${(igFollowers / 1000).toFixed(1)}K`
                    : `${igFollowers}`,
                connectedAt: new Date().toISOString(),
                raw: { page_id: page.id }
              };
              upsertPromises.push(upsertAccount(igAccount));
              savedIGAccounts.push(igAcc.username || igAcc.id);
            } else {
              console.log(
                `[Meta] Page "${page.name}" (${page.id}) has no linked Instagram Business Account`
              );
            }
          }

          console.log(
            `[Meta] Saving: ${savedFBPages.length} FB pages [${savedFBPages.join(", ")}], ` +
              `${savedIGAccounts.length} IG accounts [${savedIGAccounts.join(", ")}]`
          );

          if (upsertPromises.length > 0) {
            await Promise.all(upsertPromises);
          } else {
            // Pages exist but none had page tokens (unusual)
            if (originalProvider === "instagram") {
              throw new Error(
                `Your Facebook Pages were found but none have a linked Instagram Professional/Business account. ` +
                  `Please link your Instagram account in Meta Business Suite first.`
              );
            }
          }

        } else {
          // NO pages found at all — likely Dev Mode restriction
          console.warn("[Meta] No pages found via any strategy!");

          // Save the user's personal profile as a fallback so they aren't left with nothing
          const userName = meData.name || "Facebook User";
          await upsertAccount({
            platform: provider,
            providerAccountId: meData.id || `fb_user_${Date.now()}`,
            userId,
            accessToken: tokenData.access_token,
            refreshToken: null,
            name: userName,
            followers: 0,
            followersFormatted: "0",
            connectedAt: new Date().toISOString(),
            raw: { token_type: tokenData.token_type, expires_in: tokenData.expires_in }
          });

          // Throw informative error for Instagram
          if (originalProvider === "instagram") {
            throw new Error(
              `No Facebook Pages found. Instagram Business accounts are connected via your Facebook Pages. ` +
                `During Meta App Review period, only the App Admin can connect all pages. ` +
                `Make sure you are logged in as an admin of your Facebook Pages.`
            );
          }
        }
      } catch (err) {
        console.error("[Meta] Failed to fetch Meta accounts:", err);
        throw new Error(err.message || "Failed to fetch Meta accounts");
      }

    // ── Threads (Full Profile & Handle Sync) ──────────────────────────────────
    } else if (provider === "threads" && tokenData.access_token) {
      let name = "Threads User";
      let username = null;
      let avatar = null;
      let providerAccountId = tokenData.user_id || null;

      try {
        const userRes = await fetch(
          `https://graph.threads.net/v1.0/me?fields=id,username,name,threads_profile_picture_url,threads_biography&access_token=${tokenData.access_token}`
        );
        const userData = await userRes.json();
        console.log("[Threads] /v1.0/me response:", JSON.stringify(userData));
        if (userData.username || userData.id) {
          name = userData.name || userData.username || "Threads User";
          username = userData.username || null;
          providerAccountId = userData.id || providerAccountId;
          avatar = userData.threads_profile_picture_url || null;
        }
      } catch (err) {
        console.error("Failed to fetch Threads user info", err);
      }

      await upsertAccount({
        platform: "threads",
        providerAccountId: providerAccountId || `threads_${Date.now()}`,
        threadsUserId: providerAccountId,
        userId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        name: name,
        username: username ? `@${username.replace(/^@/, "")}` : name,
        avatar: avatar,
        accountType: "Threads Profile",
        connectedAt: new Date().toISOString(),
        raw: tokenData
      });

    // ── Pinterest (User Profile + All Boards Discovery) ───────────────────────
    } else if (provider === "pinterest" && tokenData.access_token) {
      let username = "Pinterest User";
      let businessName = null;
      let profileImage = null;
      let accountType = "Creator";

      try {
        const userRes = await fetch("https://api.pinterest.com/v5/user_account", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userRes.json();
        console.log("[Pinterest] /v5/user_account response:", JSON.stringify(userData));
        if (userData.username) {
          username = userData.username;
          businessName = userData.business_name || null;
          profileImage = userData.profile_image || null;
          accountType = userData.account_type || "Creator";
        }
      } catch (err) {
        console.error("Failed to fetch Pinterest user info", err);
      }

      const upsertPromises = [];
      const savedBoards = [];
      let defaultBoardId = null;

      // Fetch all Boards created by this user
      try {
        const boardsRes = await fetch("https://api.pinterest.com/v5/boards", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const boardsData = await boardsRes.json();
        console.log("[Pinterest] /v5/boards response:", JSON.stringify(boardsData));

        if (boardsData.items && boardsData.items.length > 0) {
          defaultBoardId = boardsData.items[0].id;

          for (const board of boardsData.items) {
            const boardAccount = {
              platform: "pinterest",
              providerAccountId: `board_${board.id}`,
              boardId: board.id,
              boardName: board.name,
              isBoard: true,
              userId,
              accessToken: tokenData.access_token,
              refreshToken: tokenData.refresh_token || null,
              name: `${businessName || username} • ${board.name}`,
              username: `@${username}/${board.name}`,
              avatar: board.media?.image_cover_url || profileImage || null,
              accountType: `Board: ${board.name}`,
              connectedAt: new Date().toISOString(),
              raw: { ...tokenData, boardId: board.id, boardName: board.name }
            };
            upsertPromises.push(upsertAccount(boardAccount));
            savedBoards.push(board.name);
          }
        }
      } catch (boardsErr) {
        console.error("[Pinterest] Error fetching boards:", boardsErr);
      }

      // Also save the primary profile account card (with default board attached)
      const primaryAccount = {
        platform: "pinterest",
        providerAccountId: `pin_${username}`,
        boardId: defaultBoardId,
        isPrimary: true,
        userId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        name: businessName || username || "Pinterest Account",
        username: `@${username}`,
        avatar: profileImage,
        accountType: "Pinterest Account",
        connectedAt: new Date().toISOString(),
        raw: tokenData
      };
      upsertPromises.push(upsertAccount(primaryAccount));

      await Promise.all(upsertPromises);
      console.log(`[Pinterest] Saved primary account + ${savedBoards.length} boards: [${savedBoards.join(", ")}]`);

    // ── Twitter ───────────────────────────────────────────────────────────────
    } else if (provider === "twitter" && tokenData.access_token) {
      let name = null;
      let providerAccountId = null;
      try {
        const userRes = await fetch("https://api.twitter.com/2/users/me", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userRes.json();
        if (userData.data) {
          name = userData.data.name || userData.data.username;
          providerAccountId = userData.data.id;
        }
      } catch (err) {
        console.error("Failed to fetch Twitter user name", err);
      }
      await upsertAccount({
        platform: "twitter",
        providerAccountId,
        userId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        name,
        connectedAt: new Date().toISOString(),
        raw: tokenData
      });

    // ── LinkedIn (Personal Profile + All Company Pages / Organizations) ──────
    } else if (provider === "linkedin" && tokenData.access_token) {
      let personalName = "LinkedIn User";
      let personalSub = null;
      let personalPicture = null;
      let personalEmail = null;

      try {
        const userRes = await fetch("https://api.linkedin.com/v2/userinfo", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userRes.json();
        console.log("[LinkedIn] /v2/userinfo response:", JSON.stringify(userData));
        if (userData.name || userData.sub) {
          personalName =
            userData.name ||
            `${userData.given_name || ""} ${userData.family_name || ""}`.trim() ||
            "LinkedIn User";
          personalSub = userData.sub;
          personalPicture = userData.picture || null;
          personalEmail = userData.email || null;
        }
      } catch (err) {
        console.error("Failed to fetch LinkedIn personal user info", err);
      }

      const upsertPromises = [];
      const savedAccounts = [];

      // 1. Save Personal LinkedIn Profile
      if (personalSub) {
        const personalAccount = {
          platform: "linkedin",
          providerAccountId: personalSub,
          personUrn: `urn:li:person:${personalSub}`,
          authorUrn: `urn:li:person:${personalSub}`,
          isOrganization: false,
          userId,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || null,
          name: personalName,
          username: personalEmail || personalName,
          avatar: personalPicture,
          accountType: "Personal Profile",
          connectedAt: new Date().toISOString(),
          raw: tokenData
        };
        upsertPromises.push(upsertAccount(personalAccount));
        savedAccounts.push(`Personal: ${personalName}`);
      }

      // 2. Fetch and Save ALL LinkedIn Company Pages (Organizations)
      try {
        const organizations = await fetchAllLinkedInOrganizations(tokenData.access_token);
        console.log(`[LinkedIn] Total organizations fetched: ${organizations.length}`);

        for (const org of organizations) {
          const orgAccount = {
            platform: "linkedin",
            providerAccountId: `org_${org.id}`,
            organizationId: org.id,
            isOrganization: true,
            orgUrn: org.urn,
            authorUrn: org.urn,
            personUrn: org.urn,
            userId,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token || null,
            name: org.name,
            username: org.vanityName ? `linkedin.com/company/${org.vanityName}` : org.name,
            avatar: org.avatar || null,
            accountType: "Company Page",
            connectedAt: new Date().toISOString(),
            raw: { ...tokenData, orgId: org.id, isOrganization: true }
          };
          upsertPromises.push(upsertAccount(orgAccount));
          savedAccounts.push(`Company Page: ${org.name} (${org.id})`);
        }
      } catch (orgFetchErr) {
        console.error("[LinkedIn] Error fetching organization pages:", orgFetchErr);
      }

      if (upsertPromises.length > 0) {
        await Promise.all(upsertPromises);
        console.log(`[LinkedIn] Saved ${savedAccounts.length} LinkedIn accounts: [${savedAccounts.join(", ")}]`);
      } else {
        // Fallback if neither personalSub nor orgs found
        await upsertAccount({
          platform: "linkedin",
          providerAccountId: `linkedin_${Date.now()}`,
          userId,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || null,
          name: "LinkedIn Account",
          connectedAt: new Date().toISOString(),
          raw: tokenData
        });
      }

    // ── Generic fallback (TikTok, etc.) ──────────────────────────────────────
    } else if (tokenData.access_token) {
      await upsertAccount({
        platform: provider,
        providerAccountId: `${provider}_${Date.now()}`,
        userId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        name: `${provider} Account`,
        connectedAt: new Date().toISOString(),
        raw: tokenData
      });
    }

    // Invalidate account cache so new channels appear instantly
    try {
      serverCache.delete(`accounts:${userId || 'all'}`);
      serverCache.delete("accounts:all");
      serverCache.invalidateTag("accounts");
      serverCache.invalidateTag(`user:${userId}`);
    } catch (e) {}

    // Use originalProvider in success redirect so the UI shows the right platform toast
    return NextResponse.redirect(
      new URL("/accounts?connected=" + originalProvider, req.url)
    );
  } catch (err) {
    console.error("[Callback] Error:", err);
    const dest = returnTo || (originalProvider === "meta_ads" ? "/ads" : "/accounts");
    return NextResponse.redirect(
      new URL(`${dest}?error=` + encodeURIComponent(err.message), req.url)
    );
  }
}
