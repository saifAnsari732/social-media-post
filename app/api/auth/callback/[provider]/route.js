import { NextResponse } from "next/server";
import { upsertAccount } from "@/lib/db";

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
    case "instagram": {
      const res = await fetch(
        `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${process.env.META_APP_ID}&redirect_uri=${process.env.META_REDIRECT_URI}&client_secret=${process.env.META_APP_SECRET}&code=${code}`
      );
      return res.json();
    }
    case "twitter": {
      const basicAuth = Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString("base64");
      const res = await fetch("https://api.twitter.com/2/oauth2/token", {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${basicAuth}`
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

export async function GET(req, { params }) {
  const { provider } = params;
  const code = req.nextUrl.searchParams.get("code");
  const stateParam = req.nextUrl.searchParams.get("state");

  // Decode userId from state parameter
  let userId = "anonymous";
  if (stateParam) {
    try {
      const decoded = JSON.parse(Buffer.from(stateParam, "base64url").toString());
      userId = decoded.userId || "anonymous";
    } catch (e) {
      // state might be a plain string from older flow, ignore
    }
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=missing_code", req.url));
  }

  try {
    const tokenData = await exchangeToken(provider, code);

    if (tokenData.error) {
      throw new Error(`Token exchange failed: ${tokenData.error_description || tokenData.error}`);
    }

    if (provider === "youtube" && tokenData.access_token) {
      let accountName = null;
      let providerAccountId = null;
      try {
        const channelRes = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const channelData = await channelRes.json();
        if (channelData.items && channelData.items.length > 0) {
          accountName = channelData.items[0].snippet.title;
          providerAccountId = channelData.items[0].id;
        }
      } catch (err) {
        console.error("Failed to fetch YouTube channel name", err);
      }

      await upsertAccount({
        platform: provider,
        providerAccountId,
        userId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        name: accountName,
        connectedAt: new Date().toISOString(),
        raw: tokenData
      });
    } else if ((provider === "facebook" || provider === "instagram") && tokenData.access_token) {
      try {
        // Fast & Advanced: Fetch Pages AND linked Instagram Accounts in a SINGLE query!
        let pagesRes = await fetch(
          `https://graph.facebook.com/v20.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username,name}&access_token=${tokenData.access_token}`
        );
        let pagesData = await pagesRes.json();
        
        console.log("Facebook accounts query result:", JSON.stringify(pagesData));
        
        if (pagesData.error) {
          throw new Error(`Meta API Error: ${pagesData.error.message} (Code: ${pagesData.error.code})`);
        }

        let pages = pagesData.data || [];

        // Fallback for Meta Granular Scopes (if user selects specific pages, /me/accounts might be empty)
        if (pages.length === 0) {
          const debugRes = await fetch(`https://graph.facebook.com/debug_token?input_token=${tokenData.access_token}&access_token=${tokenData.access_token}`);
          const debugData = await debugRes.json();
          if (debugData.data && debugData.data.granular_scopes) {
             // Look for pages_manage_posts OR pages_show_list
            const pageScopes = debugData.data.granular_scopes.find(s => s.scope === "pages_manage_posts" || s.scope === "pages_show_list");
            if (pageScopes && pageScopes.target_ids && pageScopes.target_ids.length > 0) {
              
              // Parallel fetch for all allowed page IDs to save time
              const fetchPromises = pageScopes.target_ids.map(pageId => 
                fetch(`https://graph.facebook.com/v20.0/${pageId}?fields=id,name,access_token,instagram_business_account{id,username,name}&access_token=${tokenData.access_token}`)
                  .then(r => r.json())
              );
              
              const fetchedPages = await Promise.all(fetchPromises);
              pages = fetchedPages.filter(p => p.access_token);
            }
          }
        }
        
        if (pages.length > 0) {
          const upsertPromises = [];

          for (const page of pages) {
            // 1. If provider is facebook, upsert the Facebook Page
            if (provider === "facebook") {
              upsertPromises.push(upsertAccount({
                platform: "facebook",
                providerAccountId: page.id,
                pageId: page.id,
                userId,
                accessToken: page.access_token,
                refreshToken: null,
                name: page.name,
                connectedAt: new Date().toISOString(),
                raw: { ...tokenData, page }
              }));
            }

            // 2. If provider is instagram OR facebook, ALWAYS upsert the linked Instagram account if present
            if (page.instagram_business_account) {
              const igAcc = page.instagram_business_account;
              upsertPromises.push(upsertAccount({
                platform: "instagram",
                providerAccountId: igAcc.id,
                igUserId: igAcc.id,
                userId,
                accessToken: page.access_token, // Instagram uses the parent Page's access token!
                refreshToken: null,
                name: igAcc.name || igAcc.username || "Instagram Account",
                connectedAt: new Date().toISOString(),
                raw: { ...tokenData, page, instagram: igAcc }
              }));
            }
          }
          
          // Execute all database upserts concurrently for maximum speed
          if (upsertPromises.length > 0) {
            await Promise.all(upsertPromises);
          } else {
             // Edge case: They clicked Instagram but NO pages had an IG account linked
             if (provider === "instagram") {
               throw new Error("No linked Instagram Professional Accounts found on your Facebook Pages.");
             }
          }
        } else {
          // Absolute Fallback if no pages found
          await upsertAccount({
            platform: provider,
            providerAccountId: `no_page_${Date.now()}`,
            userId,
            accessToken: tokenData.access_token,
            refreshToken: null,
            name: `${provider === "facebook" ? "Facebook" : "Instagram"} User (No Pages)`,
            connectedAt: new Date().toISOString(),
            raw: tokenData
          });
        }
      } catch (err) {
        console.error("Failed to fetch Meta accounts", err);
        throw new Error(err.message || "Failed to fetch Meta accounts");
      }
    } else {
      // For twitter, linkedin, tiktok, etc.
      let name = null;
      let providerAccountId = null;
      
      if (provider === "twitter" && tokenData.access_token) {
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
      } else if (provider === "linkedin" && tokenData.access_token) {
        try {
          const userRes = await fetch("https://api.linkedin.com/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
          });
          const userData = await userRes.json();
          if (userData.name) {
            name = userData.name;
            providerAccountId = userData.sub;
          }
        } catch (err) {
          console.error("Failed to fetch LinkedIn user name", err);
        }
      }

      await upsertAccount({
        platform: provider,
        providerAccountId,
        userId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        name,
        connectedAt: new Date().toISOString(),
        raw: tokenData
      });
    }

    return NextResponse.redirect(new URL("/?connected=" + provider, req.url));
  } catch (err) {
    return NextResponse.redirect(new URL("/?error=" + encodeURIComponent(err.message), req.url));
  }
}
