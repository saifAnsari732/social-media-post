// Instagram Graph API - Reels publishing
// IMPORTANT: Instagram video ke liye ek publicly accessible video_url chahiye
// (aapko video ko pehle S3 / Cloudinary / apne server par upload karke uska URL dena hoga)
// Docs: https://developers.facebook.com/docs/instagram-api/guides/content-publishing

export async function postToInstagram({ igUserId, accessToken, mediaUrl, caption, isVideo }) {
  // Step 1: Create media container
  const createRes = await fetch(
    `https://graph.facebook.com/v20.0/${igUserId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [isVideo ? "video_url" : "image_url"]: mediaUrl,
        caption,
        ...(isVideo && { media_type: "REELS" }),
        access_token: accessToken
      })
    }
  );
  const createData = await createRes.json();
  if (!createRes.ok) throw new Error(`Instagram container failed: ${JSON.stringify(createData)}`);

  const containerId = createData.id;

  // Step 2: Poll status (video processing time leta hai)
  let status = "IN_PROGRESS";
  let attempts = 0;
  while (status === "IN_PROGRESS" && attempts < 20) {
    await new Promise((r) => setTimeout(r, 5000));
    const statusRes = await fetch(
      `https://graph.facebook.com/v20.0/${containerId}?fields=status_code&access_token=${accessToken}`
    );
    const statusData = await statusRes.json();
    status = statusData.status_code;
    attempts++;
  }

  if (status !== "FINISHED") {
    throw new Error(`Instagram video processing failed or timed out. Status: ${status}`);
  }

  // Step 3: Publish
  const publishRes = await fetch(
    `https://graph.facebook.com/v20.0/${igUserId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: containerId, access_token: accessToken })
    }
  );
  const publishData = await publishRes.json();
  if (!publishRes.ok) throw new Error(`Instagram publish failed: ${JSON.stringify(publishData)}`);

  return { success: true, id: publishData.id };
}
