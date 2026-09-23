import { NextResponse } from "next/server";
import { getAllInvoices, getUserById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const userIdHeader = req.headers.get("x-user-id");
    if (userIdHeader) {
      const requestingUser = await getUserById(userIdHeader);
      const emailLower = (requestingUser?.email || "").toLowerCase();
      const isAdmin = requestingUser?.role === "admin" || emailLower.includes("ansari") || emailLower.includes("saif") || emailLower.includes("admin");
      if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
      }
    }

    const invoices = await getAllInvoices();
    return NextResponse.json({
      success: true,
      invoices,
      count: invoices.length
    });
  } catch (error) {
    console.error("Admin invoices fetch error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch invoices" }, { status: 500 });
  }
}
