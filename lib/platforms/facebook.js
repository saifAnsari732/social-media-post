// Facebook Graph API - Page video/photo/feed publishing
// Docs: https://developers.facebook.com/docs/video-api/guides/publishing

export async function postToFacebook({ pageId, pageAccessToken, videoBuffer, mediaUrl, title, description, isVideo, placement = "reels_video" }) {
  if (!pageId) {
    throw new Error("Facebook Page ID is missing");
  }
  if (!pageAccessToken) {
    throw new Error("Facebook Page Access Token is missing");
  }

  const postText = title && description ? `${title}\n\n${description}` : (title || description || "");

  // Strategy 1: If mediaUrl is an HTTPS ImageKit URL, try file_url / url directly
  if (mediaUrl && (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://"))) {
    try {
      const form = new FormData();
      form.append("access_token", pageAccessToken);
      if (isVideo) {
        if (title) form.append("title", title);
        if (description || postText) form.append("description", description || postText);
        form.append("file_url", mediaUrl);
      } else {
        form.append("url", mediaUrl);
        form.append("caption", postText);
        form.append("message", postText);
      }

      const endpoint = isVideo ? "videos" : "photos";
      const url = isVideo 
        ? `https://graph-video.facebook.com/v20.0/${pageId}/${endpoint}`
        : `https://graph.facebook.com/v20.0/${pageId}/${endpoint}`;

      const res = await fetch(url, {
        method: "POST",
        body: form
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, id: data.id };
      }

      const errText = await res.text();
      console.warn(`[Facebook] file_url upload returned error, checking buffer fallback:`, errText);
      if (!videoBuffer || videoBuffer.length === 0) {
        throw new Error(`Facebook post failed: ${errText}`);
      }
    } catch (cdnErr) {
      if (!videoBuffer || videoBuffer.length === 0) {
        throw cdnErr;
      }
      console.warn(`[Facebook] CDN URL upload error, trying binary buffer fallback:`, cdnErr);
    }
  }

  // Strategy 2: If binary buffer exists, upload directly via source Blob
  if (videoBuffer && videoBuffer.length > 0) {
    const form = new FormData();
    form.append("access_token", pageAccessToken);
    if (isVideo) {
      if (title) form.append("title", title);
      if (description || postText) form.append("description", description || postText);
      form.append("source", new Blob([videoBuffer]), "video.mp4");
    } else {
      form.append("caption", postText);
      form.append("message", postText);
      form.append("source", new Blob([videoBuffer]), "image.png");
    }

    const endpoint = isVideo ? "videos" : "photos";
    const url = isVideo 
      ? `https://graph-video.facebook.com/v20.0/${pageId}/${endpoint}`
      : `https://graph.facebook.com/v20.0/${pageId}/${endpoint}`;

    const res = await fetch(url, {
      method: "POST",
      body: form
    });

    if (!res.ok) {
      throw new Error(`Facebook buffer post failed: ${await res.text()}`);
    }

    const data = await res.json();
    return { success: true, id: data.id };
  }

  // Strategy 3: Text-only status feed post
  const feedRes = await fetch(`https://graph.facebook.com/v20.0/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: postText,
      access_token: pageAccessToken
    })
  });

  if (!feedRes.ok) {
    throw new Error(`Facebook text post failed: ${await feedRes.text()}`);
  }

  const feedData = await feedRes.json();
  return { success: true, id: feedData.id };
}
