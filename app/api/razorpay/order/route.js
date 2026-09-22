import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const { amount, planName, currency = "INR" } = await req.json();

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TNdSmDOKSX2g6I";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "5GO0yjbVCTn58B1FDUocEjyb";

    const instance = new Razorpay({ key_id, key_secret });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paisa)
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: { planName }
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
