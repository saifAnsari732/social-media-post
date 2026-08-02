// YouTube Data API v3 - resumable video upload
// Docs: https://developers.google.com/youtube/v3/guides/uploading_a_video

export async function postToYouTube({ accessToken, videoBuffer, title, description }) {
  // Step 1: Initiate resumable upload session
  const initRes = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Upload-Content-Type": "video/*",
        "X-Upload-Content-Length": videoBuffer.length.toString()
      },
      body: JSON.stringify({
        snippet: { title, description },
        status: { privacyStatus: "public" }
      })
    }
  );

  if (!initRes.ok) {
    throw new Error(`YouTube init failed: ${await initRes.text()}`);
  }

  const uploadUrl = initRes.headers.get("location");

  // Step 2: Upload actual video bytes to the returned session URL
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "video/*" },
    body: videoBuffer
  });

  if (!uploadRes.ok) {
    throw new Error(`YouTube upload failed: ${await uploadRes.text()}`);
  }

  const data = await uploadRes.json();
  return { success: true, url: `https://youtu.be/${data.id}` };
}
