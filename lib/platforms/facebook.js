// Facebook Graph API - Page video upload
// Docs: https://developers.facebook.com/docs/video-api/guides/publishing

export async function postToFacebook({ pageId, pageAccessToken, videoBuffer, title, description }) {
  const form = new FormData();
  form.append("access_token", pageAccessToken);
  form.append("title", title);
  form.append("description", description);
  form.append(
    "source",
    new Blob([videoBuffer]),
    "video.mp4"
  );

  const res = await fetch(`https://graph-video.facebook.com/v20.0/${pageId}/videos`, {
    method: "POST",
    body: form
  });

  if (!res.ok) {
    throw new Error(`Facebook post failed: ${await res.text()}`);
  }

  const data = await res.json();
  return { success: true, id: data.id };
}
