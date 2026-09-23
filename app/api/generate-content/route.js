import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { getUserById, isUserTrialExpired } from "@/lib/db";

export async function POST(req) {
  try {
    const { topic, tone } = await req.json();
    const userId = req.headers.get("x-user-id");

    if (userId) {
      const user = await getUserById(userId);
      if (user && isUserTrialExpired(user)) {
        return NextResponse.json(
          { error: "Your 5-Day Free Trial has expired. AI generation is blocked until you upgrade to a plan.", isExpired: true },
          { status: 403 }
        );
      }
    }
    if (!topic) {
      return NextResponse.json({ error: "topic required" }, { status: 400 });
    }
    const content = await generateContent({ topic, tone, userId });
    return NextResponse.json(content);
  } catch (err) {
    console.error("Gemini Generation Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
