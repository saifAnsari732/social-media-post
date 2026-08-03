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
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        name: accountName,
        connectedAt: new Date().toISOString(),
        raw: tokenData
      });
    } else if ((provider === "facebook" || provider === "instagram") && tokenData.access_token) {
      try {
        let pagesRes = await fetch(`https://graph.facebook.com/v20.0/me/accounts?access_token=${tokenData.access_token}`);
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
            const pageScopes = debugData.data.granular_scopes.find(s => s.scope === "pages_manage_posts");
            if (pageScopes && pageScopes.target_ids && pageScopes.target_ids.length > 0) {
              // Fetch each page directly
              for (const pageId of pageScopes.target_ids) {
                const pRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}?fields=access_token,name,instagram_business_account&access_token=${tokenData.access_token}`);
                const pData = await pRes.json();
                if (pData.access_token) {
                  pages.push(pData);
                }
              }
            }
          }
        }
        
        if (pages.length > 0) {
          for (const page of pages) {
            // Upsert Facebook Page if logging in via Facebook
            if (provider === "facebook") {
              await upsertAccount({
                platform: "facebook",
                providerAccountId: page.id,
                pageId: page.id,
                accessToken: page.access_token, // Save the Page Access Token
                refreshToken: null,
                name: page.name,
                connectedAt: new Date().toISOString(),
                raw: { ...tokenData, page }
              });
            }

            // Always attempt to discover linked Instagram Business Accounts
            try {
              let igAcc = null;
              // If we already fetched it via granular fallback
              if (page.instagram_business_account) {
                const igDetailsRes = await fetch(`https://graph.facebook.com/v20.0/${page.instagram_business_account.id}?fields=id,username,name&access_token=${page.access_token}`);
                igAcc = await igDetailsRes.json();
              } else {
                // Original method
                const igRes = await fetch(
                  `https://graph.facebook.com/v20.0/${page.id}?fields=instagram_business_account{id,username,name}&access_token=${page.access_token}`
                );
                const igData = await igRes.json();
                igAcc = igData.instagram_business_account;
              }

              if (igAcc) {
                await upsertAccount({
                  platform: "instagram",
                  providerAccountId: igAcc.id,
                  igUserId: igAcc.id,
                  accessToken: page.access_token, // Instagram uses the Page Access Token to publish
                  refreshToken: null,
                  name: igAcc.name || igAcc.username || "Instagram Account",
                  connectedAt: new Date().toISOString(),
                  raw: { ...tokenData, page, instagram: igAcc }
                });
              }
            } catch (igErr) {
              console.error("Failed to discover Instagram account for page:", page.id, igErr);
            }
          }
        } else {
          // Fallback if no pages found
          await upsertAccount({
            platform: provider,
            providerAccountId: `no_page_${Date.now()}`,
            accessToken: tokenData.access_token,
            refreshToken: null,
            name: `${provider === "facebook" ? "Facebook" : "Instagram"} User (No Pages)`,
            connectedAt: new Date().toISOString(),
            raw: tokenData
          });
        }
      } catch (err) {
        console.error("Failed to fetch Meta accounts", err);
        throw new Error("Failed to fetch Meta accounts");
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
