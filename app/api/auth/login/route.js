import { NextResponse } from "next/server";
import { upsertUser } from "@/lib/db";

export async function POST(req) {
  try {
    const { name, email, userId } = await req.json();

    if (!name || !email || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = {
      userId,
      name,
      email: email.toLowerCase().trim(),
      lastLoginAt: new Date().toISOString()
    };

    const savedUser = await upsertUser(user);

    return NextResponse.json({ success: true, user: savedUser });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
