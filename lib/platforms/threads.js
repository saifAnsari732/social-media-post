// Threads Graph API - Text, Image, and Video publishing
// Docs: https://developers.facebook.com/docs/threads

export async function postToThreads({ threadsUserId, accessToken, text, mediaUrl, isVideo }) {
  let mediaType = "TEXT";
  if (mediaUrl) {
    mediaType = isVideo ? "VIDEO" : "IMAGE";
  }

  const payload = {
    media_type: mediaType,
    text: text || "",
    access_token: accessToken
  };

  if (mediaUrl) {
    if (isVideo) {
      payload.video_url = mediaUrl;
    } else {
      payload.image_url = mediaUrl;
    }
  }

  const createRes = await fetch(
    `https://graph.threads.net/v1.0/${threadsUserId || "me"}/threads`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );
  const createData = await createRes.json();
  if (!createRes.ok) throw new Error(`Threads container creation failed: ${JSON.stringify(createData)}`);

  const containerId = createData.id;

  if (mediaUrl) {
    let status = "IN_PROGRESS";
    let attempts = 0;
    while (status === "IN_PROGRESS" && attempts < 15) {
      await new Promise((r) => setTimeout(r, 3000));
      const statusRes = await fetch(
        `https://graph.threads.net/v1.0/${containerId}?fields=status&access_token=${accessToken}`
      );
      const statusData = await statusRes.json();
      status = statusData.status || "FINISHED";
      attempts++;
    }
  }

  const publishRes = await fetch(
    `https://graph.threads.net/v1.0/${threadsUserId || "me"}/threads_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: containerId, access_token: accessToken })
    }
  );
  const publishData = await publishRes.json();
  if (!publishRes.ok) throw new Error(`Threads publish failed: ${JSON.stringify(publishData)}`);

  return { success: true, id: publishData.id };
}
