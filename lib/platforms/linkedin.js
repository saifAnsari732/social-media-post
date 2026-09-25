// LinkedIn Video API (UGC posts)
// Docs: https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/videos-api

export async function postToLinkedIn({ accessToken, personUrn, authorUrn, videoBuffer, title, description, isVideo }) {
  const author = authorUrn || personUrn;
  const postText = title && description ? `${title}\n\n${description}` : (description || title || "");

  if (videoBuffer) {
    const recipe = isVideo ? "urn:li:digitalmediaRecipe:feedshare-video" : "urn:li:digitalmediaRecipe:feedshare-image";
    const mediaCategory = isVideo ? "VIDEO" : "IMAGE";

    // Step 1: Register upload
    const registerRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: [recipe],
          owner: author,
          serviceRelationships: [
            { relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" }
          ]
        }
      })
    });
    if (!registerRes.ok) {
      const errorText = await registerRes.text();
      throw new Error(`LinkedIn registerUpload failed: ${errorText}`);
    }
    const registerData = await registerRes.json();
    const uploadUrl =
      registerData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]
        .uploadUrl;
    const asset = registerData.value.asset;

    // Step 2: Upload media bytes
    await fetch(uploadUrl, {
      method: "PUT",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: videoBuffer
    });

    // Step 3: Create the share/post with media
    const shareRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
      },
      body: JSON.stringify({
        author: author,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: postText },
            shareMediaCategory: mediaCategory,
            media: [{ status: "READY", description: { text: postText }, media: asset, title: { text: title || "" } }]
          }
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
      })
    });

    const shareData = await shareRes.json();
    if (!shareRes.ok) throw new Error(`LinkedIn post failed: ${JSON.stringify(shareData)}`);
    return { success: true, id: shareData.id };
  } else {
    // Text-only post
    const shareRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
      },
      body: JSON.stringify({
        author: author,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: postText },
            shareMediaCategory: "NONE"
          }
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
      })
    });

    const shareData = await shareRes.json();
    if (!shareRes.ok) throw new Error(`LinkedIn text post failed: ${JSON.stringify(shareData)}`);
    return { success: true, id: shareData.id };
  }
}
