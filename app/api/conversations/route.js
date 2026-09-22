import { NextResponse } from "next/server";
import { getConversations, upsertConversation } from "@/lib/db";
import { serverCache } from "@/lib/cache";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(req) {
  try {
    let userId = req.headers.get("x-user-id");
    if (!userId || userId === "undefined" || userId === "null") {
      userId = null;
    }

    const cacheKey = `convos:${userId || 'all'}`;
    const cached = serverCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ conversations: cached, cached: true }, {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
          "X-Cache-Status": "HIT"
        }
      });
    }

    let conversations = await getConversations(userId);
    
    // Seed dummy data if empty to show the UI working
    if (conversations.length === 0) {
      const mockConv = {
        userId,
        externalId: "mock_12345",
        platform: "instagram",
        participant: { name: "Alex Carter", username: "alex_c" },
        messages: [
          { sender: "user", text: "Hey! Do you have the new running shoes in stock?", timestamp: new Date(Date.now() - 3600000).toISOString() },
          { sender: "agent", text: "Hi Alex! Yes, we just restocked them in all sizes. What size are you looking for?", timestamp: new Date(Date.now() - 3500000).toISOString() },
          { sender: "user", text: "Awesome, I need a size 10.", timestamp: new Date(Date.now() - 3400000).toISOString() }
        ],
        lastMessageAt: new Date(Date.now() - 3400000).toISOString(),
        status: "open"
      };
      await upsertConversation(mockConv);
      
      const mockConv2 = {
        userId,
        externalId: "mock_67890",
        platform: "facebook",
        participant: { name: "Sarah Jenkins", username: "s_jenkins" },
        messages: [
          { sender: "user", text: "Is the 20% discount code still valid?", timestamp: new Date(Date.now() - 86400000).toISOString() }
        ],
        lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
        status: "open"
      };
      await upsertConversation(mockConv2);
      
      conversations = await getConversations(userId);
    }

    serverCache.set(cacheKey, conversations, 20, [`user:${userId}`, "conversations"]);

    return NextResponse.json({ conversations, cached: false }, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Cache-Status": "MISS"
      }
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { conversationId, text, externalId } = body;

    if (!text || (!conversationId && !externalId)) {
      return NextResponse.json({ error: "Text and conversationId are required" }, { status: 400 });
    }

    const newMessage = {
      sender: "agent",
      text,
      timestamp: new Date().toISOString()
    };

    const updated = await upsertConversation({
      externalId,
      userId,
      lastMessageAt: newMessage.timestamp,
      messages: [newMessage]
    });

    serverCache.revalidateTag(`user:${userId}`);
    serverCache.revalidateTag("conversations");

    return NextResponse.json({ success: true, conversation: updated, message: newMessage });
  } catch (error) {
    console.error("Error posting message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
