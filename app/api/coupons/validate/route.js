import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { code, planPrice } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, error: "Please provide a coupon code" }, { status: 400 });
    }

    const result = await validateCoupon(code, planPrice);

    if (!result.valid) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      valid: true,
      coupon: {
        code: result.code,
        type: result.type,
        value: result.value,
        discountAmount: result.discountAmount,
        finalPrice: result.finalPrice,
        discountLabel: result.discountLabel,
        description: result.description
      }
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ success: false, error: "Failed to validate coupon" }, { status: 500 });
  }
}
