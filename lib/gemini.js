import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateContent({ topic, tone = "engaging" }) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

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

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return { title: "", description: cleaned, hashtags: [] };
  }
}
