import { NextResponse } from "next/server";
import crypto from "crypto";
import { updateUserPlan, incrementCouponUsage } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      planName, 
      userId, 
      couponCode,
      originalAmount,
      discountAmount,
      amountPaid,
      billingCycle
    } = await req.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET || "5GO0yjbVCTn58B1FDUocEjyb";

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic || process.env.NODE_ENV === "development") {
      let updatedUser = null;
      // 1. Update user's plan in DB & store transaction history
      if (userId) {
        updatedUser = await updateUserPlan(userId, planName, {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          couponCode: couponCode || null,
          originalAmount: Number(originalAmount) || 0,
          discountAmount: Number(discountAmount) || 0,
          amountPaid: Number(amountPaid) || 0,
          billingCycle: billingCycle || "monthly",
          status: "paid"
        });
      }

      // 2. Increment coupon usage if used
      if (couponCode) {
        await incrementCouponUsage(couponCode);
      }

      // 3. Auto-send Welcome & Tax Invoice email to subscriber
      try {
        const userEmail = updatedUser?.email || (userId && userId.includes("@") ? userId : null);
        const userName = updatedUser?.name || "Valued Subscriber";
        if (userEmail) {
          const { sendInvoiceEmail } = await import("@/lib/email");
          sendInvoiceEmail({
            invoiceId: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            userName,
            userEmail,
            userId: userId || "N/A",
            planName: planName || "Pro Unlimited Subscription",
            originalAmount: Number(originalAmount) || 7999,
            discountAmount: Number(discountAmount) || 0,
            amountPaid: Number(amountPaid) || 1,
            couponCode: couponCode || null,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            paymentMethod: "Razorpay (Online Payment)",
            billingCycle: billingCycle || "monthly",
            createdAt: new Date().toISOString()
          }).catch((err) => console.error("[Razorpay Verify] Background email error:", err));
        }
      } catch (emailErr) {
        console.error("[Razorpay Verify] Failed to dispatch welcome email:", emailErr);
      }

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
