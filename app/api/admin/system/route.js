import { NextResponse } from "next/server";
import { getSystemSettings, updateSystemSettings, getUserById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const settings = await getSystemSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("System settings GET error:", error);
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
    const updated = await updateSystemSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("System settings POST error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
