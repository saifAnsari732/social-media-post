import { NextResponse } from "next/server";
import { registerUser } from "@/lib/db";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required fields." },
        { status: 400 }
      );
    }

    const user = await registerUser({ name, email, password });

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
      user
    }, { status: 201 });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account. Please try again." },
      { status: 400 }
    );
  }
}
