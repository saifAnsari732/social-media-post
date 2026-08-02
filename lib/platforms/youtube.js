import { upsertAccount } from "../db";

export async function postToYouTube({ accessToken, refreshToken, accountId, platform, providerAccountId, name, videoBuffer, title, description }) {
  let currentToken = accessToken;

  // Helper to attempt upload
  async function attemptUpload(token) {
    const initRes = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Upload-Content-Type": "video/*",
          "X-Upload-Content-Length": videoBuffer.length.toString()
        },
        body: JSON.stringify({
          snippet: { title, description },
          status: { privacyStatus: "public" }
        })
      }
    );

    if (initRes.status === 401) {
      return { status: 401 }; // Unauthorized, needs refresh
    }

    if (!initRes.ok) {
      throw new Error(`YouTube init failed: ${await initRes.text()}`);
    }

    const uploadUrl = initRes.headers.get("location");
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "video/*" },
      body: videoBuffer
    });

    if (!uploadRes.ok) {
      throw new Error(`YouTube upload failed: ${await uploadRes.text()}`);
    }

    const data = await uploadRes.json();
    return { status: 200, url: `https://youtu.be/${data.id}` };
  }

  let res = await attemptUpload(currentToken);

  // If unauthorized and we have a refresh token, try to refresh!
  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
      })
    });

    const refreshData = await refreshRes.json();
    if (refreshData.access_token) {
      currentToken = refreshData.access_token;
      
      // Save new token to DB
      await upsertAccount({
        _id: accountId,
        platform,
        providerAccountId,
        name,
        accessToken: currentToken,
        refreshToken: refreshToken,
        connectedAt: new Date().toISOString()
      });

      // Retry upload
      res = await attemptUpload(currentToken);
    } else {
      throw new Error("Failed to refresh YouTube token. Please reconnect the account.");
    }
  }

  if (res.status === 401) {
    throw new Error("YouTube token expired. Please reconnect the account.");
  }

  return { success: true, url: res.url };
}
