import { NextResponse } from "next/server";
import { getAllUsers, getAdminStats, getUserById } from "@/lib/db";

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

    const [users, stats] = await Promise.all([
      getAllUsers(),
      getAdminStats()
    ]);

    return NextResponse.json({ success: true, users, stats });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
