// Pinterest API v5 - Create Pin
// Docs: https://developers.pinterest.com/docs/api/v5/#tag/pins

export async function postToPinterest({ accessToken, title, description, mediaUrl, boardId }) {
  let effectiveBoardId = boardId;

  // If no boardId supplied, resolve the user's primary or first board automatically
  if (!effectiveBoardId) {
    try {
      const boardsRes = await fetch("https://api.pinterest.com/v5/boards", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const boardsData = await boardsRes.json();
      if (boardsData.items && boardsData.items.length > 0) {
        effectiveBoardId = boardsData.items[0].id;
      } else {
        // Auto-create a default board if user has none
        const createBoardRes = await fetch("https://api.pinterest.com/v5/boards", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name: "Postfly Social Pins", privacy: "PUBLIC" })
        });
        const newBoard = await createBoardRes.json();
        if (newBoard.id) effectiveBoardId = newBoard.id;
      }
    } catch (e) {
      console.warn("[Pinterest] Failed to auto-resolve board ID:", e);
    }
  }

  if (!effectiveBoardId) {
    throw new Error("Pinterest requires a Board to publish pins. Please create a board on Pinterest first.");
  }

  const directUrl = mediaUrl || "https://ik.imagekit.io/saifdeveloper/sample_pin.png";

  const payload = {
    title: title || description || "New Pin",
    description: description || "",
    board_id: effectiveBoardId,
    media_source: {
      source_type: "image_url",
      url: directUrl
    }
  };

  const res = await fetch("https://api.pinterest.com/v5/pins", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Pinterest publish failed: ${JSON.stringify(data)}`);

  return { success: true, id: data.id, boardId: effectiveBoardId };
}
