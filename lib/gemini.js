import { GoogleGenAI } from "@google/genai";
import clientPromise from "@/lib/mongodb";

function enhanceTopicConcept(rawTopic, length, hashtagCount) {
  const clean = (rawTopic || "Social Media Strategy").trim();
  const lower = clean.toLowerCase();

  let genTitle = "";
  let genDesc = "";
  const genTags = [
    "contentcreator", "socialgrowth", "aiautomation", "viralcontent", 
    "marketingtips", "leadgeneration", "businessgrowth", "instagramtips", 
    "reelsviral", "contentstrategy", "digitalcreator", "onlinebusiness", 
    "branding101", "growthhacks", "audiencebuilding"
  ].slice(0, hashtagCount || 15);

  if (lower.includes("promosinal") || lower.includes("promo") || lower.includes("product") || lower.includes("application") || lower.includes("app") || lower.includes("video")) {
    genTitle = "Transform Your Brand Reach with Next-Generation Social Automation";
    if (length === "short") {
      genDesc = 
        `Discover how our advanced publishing platform streamlines multi-channel distribution and automates content workflows.\n\n` +
        `Key Takeaways:\n` +
        `• Automated multi-channel post scheduling\n` +
        `• Real-time channel preview rendering\n` +
        `• High-converting AI caption and hashtag engine`;
    } else {
      genDesc = 
        `Elevate your brand presence with a modern social media management application built for digital creators and growth teams.\n\n` +
        `Core Strategic Features:\n` +
        `• Multi-Channel Automation: Draft, schedule, and publish content across Instagram, Facebook, YouTube, LinkedIn, and Twitter simultaneously.\n` +
        `• AI-Powered Content Engine: Instantly generate optimized headlines, structured captions, and targeted viral hashtags.\n` +
        `• High-Speed Media CDN: Upload and stream image and video assets seamlessly via integrated ImageKit hosting.\n` +
        `• Performance Intelligence: Track engagement metrics and optimize publishing schedules for maximum reach.\n\n` +
        `Implement these tools today to scale your online presence efficiently. Share your feedback in the comments below.`;
    }
  } else if (lower.includes("sale") || lower.includes("discount") || lower.includes("offer")) {
    genTitle = "Exclusive Limited-Time Promotional Launch and Creator Special";
    genDesc = 
      `Supercharge your marketing ROI with our latest promotional campaign designed for ambitious brands.\n\n` +
      `Special Highlights:\n` +
      `• Special tier pricing for creator and enterprise plans\n` +
      `• Unlimited AI caption generation and scheduling capabilities\n` +
      `• Direct ROAS tracking and ad performance dashboards\n\n` +
      `Claim your special access now before the offer window closes.`;
  } else {
    const formattedTopic = clean.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    genTitle = `Mastering ${formattedTopic}: Comprehensive Growth Framework`;
    genDesc = 
      `Building a strong digital presence with ${formattedTopic} requires a structured approach to content, engagement, and audience retention.\n\n` +
      `Key Strategic Pillars:\n` +
      `• Hook Audience Retention: Capture viewer attention in the first 3 seconds with compelling headlines and value offers.\n` +
      `• Structured Content Delivery: Format your captions with clear bullet points, actionable advice, and strong calls to action.\n` +
      `• Multi-Channel Consistency: Distribute high-resolution media across all active social platforms systematically.\n\n` +
      `Apply these steps to build lasting brand authority. What is your primary objective with ${formattedTopic}? Join the discussion below.`;
  }

  return {
    title: genTitle,
    description: genDesc,
    hashtags: genTags
  };
}

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
    console.warn("GEMINI_API_KEY is missing. Using smart enhanced concept generator.");
    return enhanceTopicConcept(topic, length, hashtagCount);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    let lengthInstruction = "Provide a comprehensive, high-quality, long-form caption with clear formatting, line breaks, bullet points, engaging hooks, and a strong call-to-action (at least 250 to 400 words).";
    if (length === "short") {
      lengthInstruction = "Keep the description short, punchy, bullet-pointed, and under 80 words.";
    } else if (length === "medium") {
      lengthInstruction = "Write a well-structured description of around 150 to 200 words with clear bullet points.";
    } else if (length === "epic") {
      lengthInstruction = "Write an extensive, detailed, in-depth masterpiece guide (500 to 800 words) with clear bullet-pointed sections, key takeaways, and an irresistible call to action.";
    }

    const prompt = `You are an elite, world-class social media copywriter and brand growth strategist.
User Input Context: "${topic}"

STRICT REQUIREMENTS:
1. TITLE: Create an expanded, highly engaging, professional high-CTR headline in English. Do NOT copy raw user input or prepend phrases like "Quick Tip:". Turn the raw user idea into a polished headline.
2. DESCRIPTION: Write a structured, high-converting caption (${lengthInstruction}). Include clear bullet points (using bullet character '•' or '1., 2., 3.'). 
3. NO EMOJIS OR ICONS: DO NOT INCLUDE ANY EMOJIS, ICONS, OR SYMBOLS IN THE OUTPUT TEXT AT ALL. Keep text 100% clean and professional.
4. HASHTAGS: Exactly ${hashtagCount || 15} relevant, viral hashtags without the '#' symbol in array.
5. Return ONLY exact JSON format:

{
  "title": "Enhanced catchy title without emojis",
  "description": "Enhanced structured caption with bullet points and NO emojis",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const raw = response.text.trim();
    const cleaned = raw.replace(/```json|```/g, "").replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();
    const parsed = JSON.parse(cleaned);

    if (parsed && (parsed.title || parsed.description)) {
      // Remove any leftover emojis from output string
      const cleanTitle = (parsed.title || "").replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();
      const cleanDesc = (parsed.description || "").replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();
      
      return {
        title: cleanTitle || enhanceTopicConcept(topic, length, hashtagCount).title,
        description: cleanDesc || enhanceTopicConcept(topic, length, hashtagCount).description,
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : enhanceTopicConcept(topic, length, hashtagCount).hashtags
      };
    }
    return enhanceTopicConcept(topic, length, hashtagCount);
  } catch (err) {
    console.error("Gemini API call error:", err);
    return enhanceTopicConcept(topic, length, hashtagCount);
  }
}
