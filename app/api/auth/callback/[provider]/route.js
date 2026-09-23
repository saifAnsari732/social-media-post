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
      const appId = process.env.META_APP_ID || "1401279338528045";
      const redirectUri = process.env.META_REDIRECT_URI || "https://social-media-post-eta.vercel.app/api/auth/callback/facebook";
      const res = await fetch(
        `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${process.env.META_APP_SECRET}&code=${code}`
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
    case "threads": {
      const appId = process.env.META_APP_ID || "1401279338528045";
      const redirectUri = process.env.THREADS_REDIRECT_URI || "https://social-media-post-eta.vercel.app/api/auth/callback/threads";
      const res = await fetch("https://graph.threads.net/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: appId,
          client_secret: process.env.META_APP_SECRET,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          code
        })
      });
      return res.json();
    }
    case "pinterest": {
      const basicAuth = Buffer.from(`${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`).toString("base64");
      const res = await fetch("https://api.pinterest.com/v5/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${basicAuth}`
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
      let followers = 0;
      try {
        const channelRes = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const channelData = await channelRes.json();
        if (channelData.items && channelData.items.length > 0) {
          accountName = channelData.items[0].snippet.title;
          providerAccountId = channelData.items[0].id;
          followers = parseInt(channelData.items[0].statistics?.subscriberCount || 0, 10);
        }
      } catch (err) {
        console.error("Failed to fetch YouTube channel name/stats", err);
      }

      await upsertAccount({
        platform: provider,
        providerAccountId,
        userId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        name: accountName,
        followers: followers,
        followersFormatted: followers > 1000 ? `${(followers / 1000).toFixed(1)}K` : `${followers}`,
        connectedAt: new Date().toISOString(),
        raw: tokenData
      });
    } else if ((provider === "facebook" || provider === "instagram") && tokenData.access_token) {
      try {
        // Fast & Advanced: Fetch ALL Pages AND linked Instagram Accounts with high limit & pagination
        let pagesRes = await fetch(
          `https://graph.facebook.com/v20.0/me/accounts?fields=id,name,fan_count,access_token,instagram_business_account{id,username,name,profile_picture_url,followers_count}&limit=100&access_token=${tokenData.access_token}`
        );
        let pagesData = await pagesRes.json();
        
        console.log("Facebook accounts query result:", JSON.stringify(pagesData));
        
        if (pagesData.error) {
          throw new Error(`Meta API Error: ${pagesData.error.message} (Code: ${pagesData.error.code})`);
        }

        let pages = pagesData.data || [];

        // Paginate if user manages more than 100 pages
        let nextUrl = pagesData.paging?.next;
        let pageCount = 0;
        while (nextUrl && pageCount < 5) {
          try {
            const nextRes = await fetch(nextUrl);
            const nextData = await nextRes.json();
            if (nextData.data && nextData.data.length > 0) {
              pages.push(...nextData.data);
              nextUrl = nextData.paging?.next;
              pageCount++;
            } else {
              break;
            }
          } catch (e) {
            break;
          }
        }

        // Fallback for Meta Granular Scopes
        if (pages.length === 0) {
          const debugRes = await fetch(`https://graph.facebook.com/debug_token?input_token=${tokenData.access_token}&access_token=${tokenData.access_token}`);
          const debugData = await debugRes.json();
          if (debugData.data && debugData.data.granular_scopes) {
            const pageScopes = debugData.data.granular_scopes.find(s => s.scope === "pages_manage_posts" || s.scope === "pages_show_list");
            if (pageScopes && pageScopes.target_ids && pageScopes.target_ids.length > 0) {
              const fetchPromises = pageScopes.target_ids.map(pageId => 
                fetch(`https://graph.facebook.com/v20.0/${pageId}?fields=id,name,fan_count,access_token,instagram_business_account{id,username,name,profile_picture_url,followers_count}&access_token=${tokenData.access_token}`)
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
            // 1. Connect Facebook Page
            const fanCount = page.fan_count || 0;
            upsertPromises.push(upsertAccount({
              platform: "facebook",
              providerAccountId: page.id,
              pageId: page.id,
              userId,
              accessToken: page.access_token,
              refreshToken: null,
              name: page.name,
              followers: fanCount,
              followersFormatted: fanCount > 1000 ? `${(fanCount / 1000).toFixed(1)}K` : `${fanCount}`,
              connectedAt: new Date().toISOString(),
              raw: { ...tokenData, page }
            }));

            if (page.instagram_business_account) {
              const igAcc = page.instagram_business_account;
              const igFollowers = igAcc.followers_count || 0;
              upsertPromises.push(upsertAccount({
                platform: "instagram",
                providerAccountId: igAcc.id,
                igUserId: igAcc.id,
                userId,
                accessToken: page.access_token,
                name: igAcc.name || igAcc.username || "Instagram Account",
                followers: igFollowers,
                followersFormatted: igFollowers > 1000 ? `${(igFollowers / 1000).toFixed(1)}K` : `${igFollowers}`,
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
      } else if (provider === "threads" && tokenData.access_token) {
        try {
          const userRes = await fetch(`https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url&access_token=${tokenData.access_token}`);
          const userData = await userRes.json();
          if (userData.username || userData.id) {
            name = userData.username || "Threads User";
            providerAccountId = userData.id;
          }
        } catch (err) {
          console.error("Failed to fetch Threads user info", err);
        }
      } else if (provider === "pinterest" && tokenData.access_token) {
        try {
          const userRes = await fetch("https://api.pinterest.com/v5/user_account", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
          });
          const userData = await userRes.json();
          if (userData.username) {
            name = userData.username;
            providerAccountId = userData.username;
          }
        } catch (err) {
          console.error("Failed to fetch Pinterest user info", err);
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

    return NextResponse.redirect(new URL("/accounts?connected=" + provider, req.url));
  } catch (err) {
    return NextResponse.redirect(new URL("/accounts?error=" + encodeURIComponent(err.message), req.url));
  }
}
