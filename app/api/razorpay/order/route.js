import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { validateCoupon } from "@/lib/db";

export async function POST(req) {
  try {
    const { amount, planName, currency = "INR", couponCode } = await req.json();

    let finalAmount = Number(amount);

    // If coupon is supplied, verify and apply discount
    let appliedDiscount = 0;
    if (couponCode) {
      const couponValidation = await validateCoupon(couponCode, finalAmount);
      if (couponValidation.valid) {
        finalAmount = couponValidation.finalPrice;
        appliedDiscount = couponValidation.discountAmount;
      }
    }

    if (finalAmount <= 0) {
      finalAmount = 1;
    }

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TNdSmDOKSX2g6I";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "5GO0yjbVCTn58B1FDUocEjyb";

    const instance = new Razorpay({ key_id, key_secret });

    const options = {
      amount: Math.round(finalAmount * 100), // amount in smallest currency unit (paisa)
      currency,
      receipt: `rcpt_${Date.now().toString(36)}`,
      notes: { 
        planName,
        couponCode: couponCode || "NONE",
        appliedDiscount: String(appliedDiscount)
      }
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
