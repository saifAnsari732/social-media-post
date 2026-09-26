// Platform Delete API Handler
// Allows PostFly to remotely delete published posts, videos, reels, and tweets
// from Facebook, Instagram, YouTube, X (Twitter), LinkedIn, Pinterest, and Threads.

import { upsertAccount } from "../db";

export async function deletePostFromPlatform({ platform, account, platformPostId }) {
  if (!platformPostId) {
    throw new Error("Missing platform post ID. Cannot identify content on the remote channel.");
  }
  if (!account) {
    throw new Error("Account details missing. Cannot authenticate with platform.");
  }

  const cleanPlatform = (platform || account.platform || "").toLowerCase().trim();

  // 1. Facebook Page Post / Photo / Reel
  if (cleanPlatform === "facebook") {
    const pageAccessToken = account.accessToken;
    if (!pageAccessToken) throw new Error("Missing Facebook Page Access Token");

    const res = await fetch(`https://graph.facebook.com/v20.0/${platformPostId}?access_token=${pageAccessToken}`, {
      method: "DELETE"
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || (data.success !== true && !data.id)) {
      throw new Error(data?.error?.message || "Failed to delete Facebook post from page");
    }
    return { success: true, platform: "facebook", id: platformPostId };
  }

  // 2. Instagram Media / Reel / Photo
  if (cleanPlatform === "instagram") {
    const accessToken = account.accessToken;
    if (!accessToken) throw new Error("Missing Instagram Access Token");

    const res = await fetch(`https://graph.facebook.com/v20.0/${platformPostId}?access_token=${accessToken}`, {
      method: "DELETE"
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || (data.success !== true && !data.id)) {
      throw new Error(data?.error?.message || "Failed to delete Instagram media");
    }
    return { success: true, platform: "instagram", id: platformPostId };
  }

  // 3. YouTube Video / Short
  if (cleanPlatform === "youtube") {
    let videoId = platformPostId;
    if (videoId.includes("youtu.be/")) {
      videoId = videoId.split("youtu.be/")[1]?.split("?")[0]?.split("/")[0] || videoId;
    } else if (videoId.includes("youtube.com/watch?v=")) {
      videoId = videoId.split("watch?v=")[1]?.split("&")[0] || videoId;
    }

    let currentToken = account.accessToken;
    if (!currentToken) throw new Error("Missing YouTube Access Token");

    let res = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${currentToken}` }
    });

    // Refresh token if expired
    if (res.status === 401 && account.refreshToken) {
      try {
        const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.YOUTUBE_CLIENT_ID,
            client_secret: process.env.YOUTUBE_CLIENT_SECRET,
            refresh_token: account.refreshToken,
            grant_type: "refresh_token"
          })
        });
        const refreshData = await refreshRes.json();
        if (refreshData.access_token) {
          currentToken = refreshData.access_token;
          await upsertAccount({
            ...account,
            accessToken: currentToken,
            connectedAt: new Date().toISOString()
          });

          res = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${currentToken}` }
          });
        }
      } catch (refreshErr) {
        console.warn("[YouTube] Token refresh during delete failed:", refreshErr);
      }
    }

    if (!res.ok && res.status !== 204 && res.status !== 200) {
      const errText = await res.text().catch(() => "");
      throw new Error(`YouTube delete failed: ${errText || res.statusText}`);
    }
    return { success: true, platform: "youtube", id: videoId };
  }

  // 4. Twitter / X Tweet
  if (cleanPlatform === "twitter" || cleanPlatform === "x") {
    const accessToken = account.accessToken;
    if (!accessToken) throw new Error("Missing Twitter/X Access Token");

    const res = await fetch(`https://api.twitter.com/2/tweets/${platformPostId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || (data.data && data.data.deleted === false)) {
      throw new Error(data?.detail || data?.title || "Failed to delete tweet on Twitter/X");
    }
    return { success: true, platform: "twitter", id: platformPostId };
  }

  // 5. LinkedIn Post (UGC or REST API)
  if (cleanPlatform === "linkedin") {
    const accessToken = account.accessToken;
    if (!accessToken) throw new Error("Missing LinkedIn Access Token");

    const encodedUrn = encodeURIComponent(platformPostId);
    let res = await fetch(`https://api.linkedin.com/v2/ugcPosts/${encodedUrn}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0"
      }
    });

    if (!res.ok && res.status !== 204 && res.status !== 200) {
      // Try modern REST endpoint
      res = await fetch(`https://api.linkedin.com/rest/posts/${encodedUrn}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202304"
        }
      });
    }

    if (!res.ok && res.status !== 204 && res.status !== 200) {
      const errText = await res.text().catch(() => "");
      throw new Error(`LinkedIn delete failed: ${errText || res.statusText}`);
    }
    return { success: true, platform: "linkedin", id: platformPostId };
  }

  // 6. Pinterest Pin
  if (cleanPlatform === "pinterest") {
    const accessToken = account.accessToken;
    if (!accessToken) throw new Error("Missing Pinterest Access Token");

    const res = await fetch(`https://api.pinterest.com/v5/pins/${platformPostId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok && res.status !== 204 && res.status !== 200) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.message || "Failed to delete Pin on Pinterest");
    }
    return { success: true, platform: "pinterest", id: platformPostId };
  }

  // 7. Threads Post
  if (cleanPlatform === "threads") {
    const accessToken = account.accessToken;
    if (!accessToken) throw new Error("Missing Threads Access Token");

    const res = await fetch(`https://graph.threads.net/v1.0/${platformPostId}?access_token=${accessToken}`, {
      method: "DELETE"
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || (data.success !== true && !data.id)) {
      throw new Error(data?.error?.message || "Failed to delete post on Threads");
    }
    return { success: true, platform: "threads", id: platformPostId };
  }

  // 8. TikTok (Notice)
  if (cleanPlatform === "tiktok") {
    throw new Error("TikTok Content Posting API does not support automated video deletion via API. Please delete the video directly within the TikTok app.");
  }

  throw new Error(`Remote delete not supported for platform: ${cleanPlatform}`);
}
