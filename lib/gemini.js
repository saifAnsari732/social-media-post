import { GoogleGenAI } from "@google/genai";
import clientPromise from "@/lib/mongodb";

export async function generateContent({ topic, tone = "engaging", length = "long", type = "all", hashtagCount = 15, userId }) {
  let apiKey = process.env.GEMINI_API_KEY;
  
  if (userId) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const settings = await db.collection("settings").findOne({ userId });
      if (settings?.geminiApiKey) {
        apiKey = settings.geminiApiKey;
      }
    } catch (dbErr) {
      console.error("Error fetching settings for API key:", dbErr);
    }
  }

  // Fallback content generator if Gemini API key is missing or fails
  const generateFallback = () => {
    let cleanTopic = topic.trim();
    let genTitle = `How to 10x your reach with ${cleanTopic}`;
    let genDesc = "";
    let genTags = [
      "contentcreator", "socialgrowth", "aiautomation", "viralcontent", 
      "marketingtips", "leadgeneration", "businessgrowth", "instagramtips", 
      "reelsviral", "contentstrategy", "digitalcreator", "onlinebusiness", 
      "branding101", "growthhacks", "audiencebuilding"
    ].slice(0, hashtagCount || 15);

    if (length === "short") {
      genTitle = `Quick Tip: ${cleanTopic}`;
      genDesc = `🚀 **Quick Takeaway on ${cleanTopic}:**\nFocus on clear value, strong hooks in the first 3 seconds, and consistent posting. Drop your thoughts below! 👇`;
    } else if (length === "medium") {
      genTitle = `Mastering ${cleanTopic}: Key Takeaways`;
      genDesc = 
        `🚀 **Excited to share our latest insights on ${cleanTopic}!**\n\n` +
        `Here are 3 key strategies you can apply today:\n` +
        `📌 **1. Hook your audience early:** The first 3 seconds dictate 80% of retention.\n` +
        `💡 **2. Deliver high value:** Break complex ideas into simple bullet points.\n` +
        `⚡ **3. Clear Call to Action:** Prompt viewers to comment or save.\n\n` +
        `💬 What is your biggest challenge with ${cleanTopic}? Let us know below! 👇`;
    } else {
      // Long or Epic
      genTitle = `The Complete Strategic Guide to ${cleanTopic}`;
      genDesc = 
        `🚀 **Excited to share our latest deep-dive insights on ${cleanTopic}!**\n\n` +
        `If you want to explode your social media reach and double your engagement, here is the exact step-by-step framework to implement:\n\n` +
        `📌 **1. Craft Irresistible 3-Second Hooks**\n` +
        `The first 3 seconds of your video or first 2 lines of your caption dictate 80% of your audience retention. Make sure your hook states a massive pain point or clear transformation.\n\n` +
        `💡 **2. Optimize Content for High Engagement & Saves**\n` +
        `Algorithms prioritize posts with high save and share rates. Break complex ideas down into actionable bullet points, infographics, or quick step-by-step frameworks.\n\n` +
        `⚡ **3. Leverage Automated Funnels & Clear Call to Action**\n` +
        `Always close your caption with a direct call to action. Prompt your audience to comment a keyword to instantly receive your free guide or resource.\n\n` +
        `🎯 **Key Action Steps:**\n` +
        `• Consistency > Intensity\n` +
        `• Test 3 new creative variations every week\n` +
        `• Engage directly with early comments in the first hour\n\n` +
        `💬 What is your main goal with ${cleanTopic}? Drop a comment below! 👇`;
    }

    return {
      title: genTitle,
      description: genDesc,
      hashtags: genTags
    };
  };

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. Using smart fallback generation.");
    return generateFallback();
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    let lengthInstruction = "Provide a comprehensive, high-quality, long-form caption with clear formatting, line breaks, bullet points, engaging hooks, and a strong call-to-action (at least 300 to 500+ words).";
    if (length === "short") {
      lengthInstruction = "Keep the description short, punchy, and under 80 words.";
    } else if (length === "medium") {
      lengthInstruction = "Write a well-structured description of around 150 to 250 words with bullet points.";
    } else if (length === "epic") {
      lengthInstruction = "Write an extensive, detailed, in-depth masterpiece guide (600 to 1,000 words) with multiple sections, emojis, key takeaways, deep story context, and an irresistible call to action.";
    }

    const prompt = `Tum ek world-class viral social media strategist aur content creator ho. 
Topic / Context: "${topic}"

Nirdesh (Instructions):
1. Title: Aakarshak, high-CTR headline in English/Hinglish.
2. Description: ${lengthInstruction}
3. Hashtags: Exactly ${hashtagCount || 15} highly relevant, viral, trending hashtags.
4. Output Sirf aur sirf exact JSON format me return karo (koi markdown codeblock formatting mat lagao, purely parseable JSON object):

{
  "title": "Your catchy title here",
  "description": "Your detailed description here",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const raw = response.text.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (parsed && (parsed.title || parsed.description)) {
      return {
        title: parsed.title || `Guide to ${topic}`,
        description: parsed.description || "",
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : []
      };
    }
    return generateFallback();
  } catch (err) {
    console.error("Gemini API call error:", err);
    return generateFallback();
  }
}
