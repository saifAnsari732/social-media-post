// Instagram Graph API - Reels publishing
// IMPORTANT: Instagram video ke liye ek publicly accessible video_url chahiye
// (aapko video ko pehle S3 / Cloudinary / apne server par upload karke uska URL dena hoga)
// Docs: https://developers.facebook.com/docs/instagram-api/guides/content-publishing

export async function postToInstagram({ 
  igUserId, 
  accessToken, 
  mediaUrl, 
  caption, 
  isVideo, 
  disableComments,
  placement = "reels",
  shareToFeed = true 
}) {
  // Step 1: Create media container
  const mediaPayload = {
    [isVideo ? "video_url" : "image_url"]: mediaUrl,
    caption,
    access_token: accessToken
  };

  if (isVideo) {
    if (placement === "stories") {
      mediaPayload.media_type = "STORIES";
    } else {
      mediaPayload.media_type = "REELS";
      if (shareToFeed !== undefined) {
        mediaPayload.share_to_feed = Boolean(shareToFeed);
      }
    }
  }

  const createRes = await fetch(
    `https://graph.facebook.com/v20.0/${igUserId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mediaPayload)
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

  // Safety buffer: Wait 3 seconds for Meta distribution nodes to replicate container
  await new Promise((r) => setTimeout(r, 3000));

  // Step 3: Publish with automatic retry for transient code 2 errors
  let publishData = null;
  let publishAttempts = 0;
  while (publishAttempts < 4) {
    try {
      const publishRes = await fetch(
        `https://graph.facebook.com/v20.0/${igUserId}/media_publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creation_id: containerId, access_token: accessToken })
        }
      );
      publishData = await publishRes.json();
      if (publishRes.ok && publishData.id) {
        break; // Succeeded!
      }

      // Check if transient error (code 2)
      if (publishData?.error?.is_transient || publishData?.error?.code === 2) {
        console.warn(`[Instagram] Transient code 2 error on attempt ${publishAttempts + 1}, retrying in 4s...`);
        await new Promise((r) => setTimeout(r, 4000));
        publishAttempts++;
        continue;
      }

      // Non-transient error
      throw new Error(`Instagram publish failed: ${JSON.stringify(publishData)}`);
    } catch (err) {
      if (publishAttempts >= 3) throw err;
      await new Promise((r) => setTimeout(r, 4000));
      publishAttempts++;
    }
  }

  if (!publishData || !publishData.id) {
    throw new Error(`Instagram publish failed: ${JSON.stringify(publishData)}`);
  }

  // Step 4: Disable comments if requested
  if (disableComments && publishData.id) {
    try {
      const commentParams = new URLSearchParams({
        comment_enabled: "false",
        access_token: accessToken
      });
      const commentRes = await fetch(`https://graph.facebook.com/v20.0/${publishData.id}?${commentParams.toString()}`, {
        method: "POST"
      });
      const commentData = await commentRes.json();
      if (!commentRes.ok || commentData.error) {
        console.warn(`[Instagram] Failed to disable comments for media ${publishData.id}:`, commentData.error || commentData);
      } else {
        console.log(`[Instagram] Comments disabled successfully for media ${publishData.id}:`, commentData);
      }
    } catch (commentErr) {
      console.warn("[Instagram] Failed to toggle comment_enabled:", commentErr);
    }
  }

  return { success: true, id: publishData.id };
}
