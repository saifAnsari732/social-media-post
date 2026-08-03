// Facebook Graph API - Page video upload
// Docs: https://developers.facebook.com/docs/video-api/guides/publishing

export async function postToFacebook({ pageId, pageAccessToken, videoBuffer, title, description, isVideo }) {
  const form = new FormData();
  form.append("access_token", pageAccessToken);
  form.append(isVideo ? "title" : "message", isVideo ? title : `${title}\n\n${description}`);
  if (isVideo) form.append("description", description);
  form.append(
    "source",
    new Blob([videoBuffer]),
    isVideo ? "video.mp4" : "image.png"
  );

  const endpoint = isVideo ? "videos" : "photos";
  const url = isVideo 
    ? `https://graph-video.facebook.com/v20.0/${pageId}/${endpoint}`
    : `https://graph.facebook.com/v20.0/${pageId}/${endpoint}`;

  const res = await fetch(url, {
    method: "POST",
    body: form
  });

  if (!res.ok) {
    throw new Error(`Facebook post failed: ${await res.text()}`);
  }

  const data = await res.json();
  return { success: true, id: data.id };
}
