// X (Twitter) API v2 - chunked media upload + tweet create
// Docs: https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/uploading-media/chunked-media-upload

export async function postToTwitter({ accessToken, videoBuffer, text, isVideo, mimeType }) {
  const totalBytes = videoBuffer.length;

  // INIT
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
  if (!initRes.ok) {
    const errorText = await initRes.text();
    throw new Error(`Twitter INIT failed: ${errorText}`);
  }
  const initData = await initRes.json();
  const mediaId = initData.media_id_string;

  // APPEND (single chunk for simplicity; split into <5MB chunks for large files)
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

  // FINALIZE
  await fetch("https://upload.twitter.com/1.1/media/upload.json", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ command: "FINALIZE", media_id: mediaId })
  });

  // Create tweet with media
  const tweetRes = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ text, media: { media_ids: [mediaId] } })
  });

  const tweetData = await tweetRes.json();
  if (!tweetRes.ok) throw new Error(`Twitter post failed: ${JSON.stringify(tweetData)}`);
  return { success: true, id: tweetData.data.id };
}
