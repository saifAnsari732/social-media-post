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

  if (!apiKey) {
    throw new Error("Gemini API key is missing. Add it in your Settings page or set GEMINI_API_KEY in .env");
  }

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
Topic: "${topic}"

Nirdesh (Instructions):
1. Title: Aakarshak, high-CTR headline.
2. Description: ${lengthInstruction}
3. Hashtags: Exactly ${hashtagCount || 15} highly relevant, viral, trending hashtags.
4. Output Sirf aur sirf exact JSON format me return karo (koi markdown codeblock formatting mat lagao, purely parseable JSON object):

{
  "title": "Your catchy title here",
  "description": "Your detailed description here",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: prompt,
  });
  
  const raw = response.text.trim();
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return { title: "", description: cleaned, hashtags: [] };
  }
}
