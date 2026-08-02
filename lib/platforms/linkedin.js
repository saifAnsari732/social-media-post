// LinkedIn Video API (UGC posts)
// Docs: https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/videos-api

export async function postToLinkedIn({ accessToken, personUrn, videoBuffer, title, description }) {
  // Step 1: Register upload
  const registerRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-video"],
        owner: personUrn,
        serviceRelationships: [
          { relationshipType: "OWNER", identifier: "urn:li:userGeneratedContent" }
        ]
      }
    })
  });
  const registerData = await registerRes.json();
  const uploadUrl =
    registerData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]
      .uploadUrl;
  const asset = registerData.value.asset;

  // Step 2: Upload video bytes
  await fetch(uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: videoBuffer
  });

  // Step 3: Create the share/post
  const shareRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify({
      author: personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: description },
          shareMediaCategory: "VIDEO",
          media: [{ status: "READY", description: { text: description }, media: asset, title: { text: title } }]
        }
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
    })
  });

  const shareData = await shareRes.json();
  if (!shareRes.ok) throw new Error(`LinkedIn post failed: ${JSON.stringify(shareData)}`);
  return { success: true, id: shareData.id };
}
