import { GoogleGenAI } from "@google/genai";
import clientPromise from "@/lib/mongodb";

export async function generateContent({ topic, tone = "engaging", userId }) {
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

  const prompt = `Tum ek expert social media content creator ho. Niche diye gaye video/image ke topic ke aadhar par ek ${tone} title, description, aur viral keywords (tags) generate karo.
Zaroori Nirdesh (Important Rules):
1. Title aakarshak (catchy) hona chahiye.
2. Description engaging hona chahiye.
3. Hashtags / Tags bilkul is topic, video, ya image ke context se related hone chahiye (at least 5-8 tags).
4. Sirf aur sirf exact JSON format me jawab do, koi aur extra text nahi:

Topic/Context: "${topic}"

{
  "title": "Your catchy title here",
  "description": "Your engaging description here",
  "hashtags": ["keyword1", "keyword2", "keyword3"]
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
