// X (Twitter) API v2 - chunked media upload + tweet create
// Docs: https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/uploading-media/chunked-media-upload

// X (Twitter) API v2 - chunked media upload + tweet create
// Docs: https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/uploading-media/chunked-media-upload

export async function postToTwitter({ accessToken, videoBuffer, mediaUrl, text, isVideo, mimeType, disableComments }) {
  let mediaId = null;

  if (videoBuffer && videoBuffer.length > 0) {
    try {
      const totalBytes = videoBuffer.length;
      const initRes = await fetch("https://upload.twitter.com/1.1/media/upload.json", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          command: "INIT",
          total_bytes: totalBytes.toString(),
          media_type: isVideo ? "video/mp4" : (mimeType || "image/png"),
          media_category: isVideo ? "tweet_video" : "tweet_image"
        })
      });

      if (initRes.ok) {
        const initData = await initRes.json();
        mediaId = initData.media_id_string;

        const form = new FormData();
        form.append("command", "APPEND");
        form.append("media_id", mediaId);
        form.append("segment_index", "0");
        form.append("media", new Blob([videoBuffer]));
        await fetch("https://upload.twitter.com/1.1/media/upload.json", {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form
        });

        await fetch("https://upload.twitter.com/1.1/media/upload.json", {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ command: "FINALIZE", media_id: mediaId })
        });
      } else {
        const errText = await initRes.text();
        console.warn("[Twitter] v1.1 upload INIT returned non-ok, falling back to direct v2 tweet:", errText);
      }
    } catch (uploadErr) {
      console.warn("[Twitter] Media upload error, falling back to v2 tweet:", uploadErr);
    }
  }

  // Create tweet with media (or with mediaUrl link preview fallback)
  let tweetText = text || "";
  if (!mediaId && mediaUrl) {
    tweetText = `${tweetText}\n\n${mediaUrl}`.trim();
  }

  // Twitter has 280 character limit
  if (tweetText.length > 280) {
    tweetText = tweetText.slice(0, 277) + "...";
  }

  const tweetBody = { text: tweetText };
  if (mediaId) {
    tweetBody.media = { media_ids: [mediaId] };
  }
  if (disableComments) {
    tweetBody.reply_settings = "mentionedUsers";
  }

  const tweetRes = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(tweetBody)
  });

  const tweetData = await tweetRes.json();
  if (!tweetRes.ok) throw new Error(`Twitter post failed: ${JSON.stringify(tweetData)}`);
  return { success: true, id: tweetData.data.id };
}
