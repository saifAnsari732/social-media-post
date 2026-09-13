import { NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { topic, tone } = await req.json();
    const userId = req.headers.get("x-user-id");
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
