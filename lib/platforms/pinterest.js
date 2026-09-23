// Pinterest API v5 - Create Pin
// Docs: https://developers.pinterest.com/docs/api/v5/#tag/pins

export async function postToPinterest({ accessToken, title, description, mediaUrl, boardId }) {
  const payload = {
    title: title || description || "New Pin",
    description: description || "",
    media_source: {
      source_type: "image_url",
      url: mediaUrl
    }
  };

  if (boardId) {
    payload.board_id = boardId;
  }

  const res = await fetch("https://api.pinterest.com/v5/pins", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Pinterest publish failed: ${JSON.stringify(data)}`);

  return { success: true, id: data.id };
}
