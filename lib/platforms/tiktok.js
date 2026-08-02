// TikTok Content Posting API (direct post)
// Docs: https://developers.tiktok.com/doc/content-posting-api-reference-direct-post

export async function postToTikTok({ accessToken, videoBuffer, title }) {
  // Step 1: Init upload
  const initRes = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      post_info: {
        title,
        privacy_level: "PUBLIC_TO_EVERYONE",
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false
      },
      source_info: {
        source: "FILE_UPLOAD",
        video_size: videoBuffer.length,
        chunk_size: videoBuffer.length,
        total_chunk_count: 1
      }
    })
  });
  const initData = await initRes.json();
  const uploadUrl = initData.data.upload_url;
  const publishId = initData.data.publish_id;

  // Step 2: Upload video bytes
  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "video/mp4",
      "Content-Range": `bytes 0-${videoBuffer.length - 1}/${videoBuffer.length}`
    },
    body: videoBuffer
  });

  return { success: true, publishId };
}
