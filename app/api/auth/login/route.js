import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/db";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const user = await authenticateUser({ email, password, name });

    return NextResponse.json({
      success: true,
      message: "Login successful!",
      user
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: error.message || "Invalid credentials. Please try again." },
      { status: 401 }
    );
  }
}
