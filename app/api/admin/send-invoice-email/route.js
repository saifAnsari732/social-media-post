import { NextResponse } from "next/server";
import { sendInvoiceEmail } from "@/lib/email";
import { getUserById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      invoiceId,
      userName,
      userEmail,
      userId,
      planName,
      originalAmount,
      discountAmount,
      amountPaid,
      couponCode,
      paymentId,
      orderId,
      paymentMethod,
      billingCycle,
      billingAddress,
      createdAt,
      planExpiresAt
    } = body;

    let targetEmail = userEmail;
    let targetName = userName;

    if (!targetEmail && userId) {
      const u = await getUserById(userId);
      if (u) {
        targetEmail = u.email;
        targetName = u.name || targetName;
      }
    }

    if (!targetEmail) {
      return NextResponse.json(
        { success: false, error: "Subscriber email address is required to send invoice" },
        { status: 400 }
      );
    }

    const result = await sendInvoiceEmail({
      invoiceId: invoiceId || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: targetName || "Valued Customer",
      userEmail: targetEmail,
      userId: userId || "N/A",
      planName: planName || "Pro Unlimited Subscription",
      originalAmount: Number(originalAmount) || 4999,
      discountAmount: Number(discountAmount) || 0,
      amountPaid: Number(amountPaid) || 1,
      couponCode: couponCode || null,
      paymentId: paymentId || "pay_verified",
      orderId: orderId || "order_verified",
      paymentMethod: paymentMethod || "Razorpay (Online Payment)",
      billingCycle: billingCycle || "monthly",
      billingAddress: billingAddress || "India",
      createdAt: createdAt || new Date().toISOString(),
      planExpiresAt: planExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Tax Invoice ${invoiceId || ''} emailed successfully to ${targetEmail}`
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to deliver email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Send invoice email API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process email delivery" },
      { status: 500 }
    );
  }
}
