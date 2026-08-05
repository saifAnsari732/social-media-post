import { getAccountById, updateRule } from "../db";
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function sendReply(rule, recipientId, originalMessage, platform) {
  try {
    const account = await getAccountById(rule.account);
    if (!account) throw new Error("Account not found");

    let personalizedMessage = "Hello!";
    
    if (rule.dmReply?.useAI && rule.dmReply?.systemPrompt) {
      // AI GENERATED REPLY
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `System Instructions: ${rule.dmReply.systemPrompt}\n\nUser Message: "${originalMessage}"\n\nGenerate a reply:`,
        });
        personalizedMessage = response.text || "Hello!";
      } catch (aiError) {
        console.error("Gemini AI Error:", aiError);
        personalizedMessage = "Hello, I am having trouble thinking right now, but we received your message!";
      }
    } else {
      // STATIC TEMPLATE REPLY
      const messageTemplate = rule.dmReply?.messages?.[0]?.text || "Hello!";
      personalizedMessage = messageTemplate.replace("{{first_name}}", "there");
    }

    let success = false;

    if (platform === 'instagram') {
      // Instagram Graph API send message
      const res = await fetch(`https://graph.facebook.com/v20.0/${account.igUserId}/messages?access_token=${account.accessToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: personalizedMessage }
        })
      });
      const data = await res.json();
      if (data.message_id) success = true;
      else console.error("IG Send Error:", data);
    } else if (platform === 'facebook') {
      // Facebook Graph API send message
      const res = await fetch(`https://graph.facebook.com/v20.0/${account.pageId}/messages?access_token=${account.accessToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: personalizedMessage },
          messaging_type: "RESPONSE"
        })
      });
      const data = await res.json();
      if (data.message_id) success = true;
      else console.error("FB Send Error:", data);
    }

    // Update rule stats
    if (success) {
      await updateRule(rule._id.toString(), {
        "stats.totalTriggered": (rule.stats?.totalTriggered || 0) + 1,
        "stats.totalRepliesSent": (rule.stats?.totalRepliesSent || 0) + 1,
        "stats.lastTriggeredAt": new Date().toISOString()
      });
    } else {
      await updateRule(rule._id.toString(), {
        "stats.totalTriggered": (rule.stats?.totalTriggered || 0) + 1,
        "stats.totalFailed": (rule.stats?.totalFailed || 0) + 1,
      });
    }

    return success;
  } catch (error) {
    console.error("Error sending reply:", error);
    return false;
  }
}
