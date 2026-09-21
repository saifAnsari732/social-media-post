import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName, userId } = await req.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET || "qBu6p4BHsfBqdh77UqTPoVP1";

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic || process.env.NODE_ENV === "development") {
      // Payment verified successfully!
      // Here you can update user's plan in DB
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        plan: planName
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json(
      { error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
