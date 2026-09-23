import { NextResponse } from "next/server";
import { findUserByEmail, resetPasswordByEmail } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, email, newPassword } = body;

    const cleanEmail = (email || "").toLowerCase().trim();

    if (!cleanEmail) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    if (action === "verify_email") {
      const user = await findUserByEmail(cleanEmail);
      if (!user) {
        return NextResponse.json(
          { 
            exists: false, 
            error: "No account found with this email in our database. Please check your spelling or sign up." 
          }, 
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        exists: true,
        message: "Email verified successfully.",
        user: {
          name: user.name || cleanEmail.split("@")[0],
          email: user.email,
          role: user.role
        }
      });
    }

    if (action === "reset_password") {
      if (!newPassword || newPassword.length < 4) {
        return NextResponse.json(
          { error: "Password must be at least 4 characters long." },
          { status: 400 }
        );
      }

      const result = await resetPasswordByEmail({ email: cleanEmail, newPassword });
      return NextResponse.json({
        success: true,
        message: "Password updated successfully! You can now log in with your new password."
      });
    }

    return NextResponse.json({ error: "Invalid action specified." }, { status: 400 });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process password reset request." },
      { status: 500 }
    );
  }
}
