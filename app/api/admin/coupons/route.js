import { NextResponse } from "next/server";
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, getUserById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await getUserById(userId);
    const isAdmin = currentUser?.role === "admin" || 
      (currentUser?.email && (
        currentUser.email.includes("ansari") || 
        currentUser.email.includes("saif") || 
        currentUser.email.includes("admin")
      ));

    if (!isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin Privileges Required" }, { status: 403 });
    }

    const coupons = await getAllCoupons();
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error("Admin coupons GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await getUserById(userId);
    const isAdmin = currentUser?.role === "admin" || 
      (currentUser?.email && (
        currentUser.email.includes("ansari") || 
        currentUser.email.includes("saif") || 
        currentUser.email.includes("admin")
      ));

    if (!isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin Privileges Required" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }
    if (!body.value || Number(body.value) <= 0) {
      return NextResponse.json({ error: "Valid discount value is required" }, { status: 400 });
    }

    const newCoupon = await createCoupon(body);
    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error("Admin coupon creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create coupon" }, { status: 400 });
  }
}

export async function PATCH(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await getUserById(userId);
    const isAdmin = currentUser?.role === "admin" || 
      (currentUser?.email && (
        currentUser.email.includes("ansari") || 
        currentUser.email.includes("saif") || 
        currentUser.email.includes("admin")
      ));

    if (!isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin Privileges Required" }, { status: 403 });
    }

    const body = await req.json();
    const { couponId, updates } = body;
    if (!couponId || !updates) {
      return NextResponse.json({ error: "couponId and updates are required" }, { status: 400 });
    }

    const updatedCoupon = await updateCoupon(couponId, updates);
    return NextResponse.json({ success: true, coupon: updatedCoupon });
  } catch (error) {
    console.error("Admin coupon update error:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await getUserById(userId);
    const isAdmin = currentUser?.role === "admin" || 
      (currentUser?.email && (
        currentUser.email.includes("ansari") || 
        currentUser.email.includes("saif") || 
        currentUser.email.includes("admin")
      ));

    if (!isAdmin) {
      return NextResponse.json({ error: "Access Denied: Admin Privileges Required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const couponId = searchParams.get("couponId");
    if (!couponId) {
      return NextResponse.json({ error: "couponId is required" }, { status: 400 });
    }

    await deleteCoupon(couponId);
    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Admin coupon delete error:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
