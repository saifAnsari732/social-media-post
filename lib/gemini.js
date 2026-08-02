import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateContent({ topic, tone = "engaging" }) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Tum ek social media content writer ho. Is video/topic ke liye ek ${tone} title aur description likho:

Topic/Context: "${topic}"

Sirf is exact JSON format me jawab do, aur kuch mat likho:
{
  "title": "...",
  "description": "...",
  "hashtags": ["#tag1", "#tag2", "#tag3"]
}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return { title: "", description: cleaned, hashtags: [] };
  }
}
