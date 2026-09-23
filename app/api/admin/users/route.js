import { NextResponse } from "next/server";
import { getAllUsers, getAdminStats, getUserById, adminUpdateUser, adminCreateUser, adminDeleteUser, addSystemLog } from "@/lib/db";

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
    const { targetUserId, updates } = body;
    if (!targetUserId || !updates) {
      return NextResponse.json({ error: "targetUserId and updates are required" }, { status: 400 });
    }

    const updatedUser = await adminUpdateUser(targetUserId, updates);
    
    await addSystemLog({
      type: "TENANT_UPDATED",
      level: "INFO",
      source: "Super Admin Command",
      message: `Tenant updated: ${updatedUser?.name || targetUserId} (${Object.keys(updates).join(", ")})`,
      details: { targetUserId, updates }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
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
    const { name, email, plan, role } = body;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const newUser = await adminCreateUser({ name, email, plan, role });

    await addSystemLog({
      type: "TENANT_CREATED",
      level: "SUCCESS",
      source: "Super Admin Command",
      message: `New Tenant registered by Admin: ${name || email} (${email}) - Plan: ${plan || "5-Day Trial"}`,
      details: { userId: newUser.userId, email, plan, role }
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Admin user creation error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
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

    const body = await req.json();
    const { targetUserId } = body;
    if (!targetUserId) {
      return NextResponse.json({ error: "targetUserId is required" }, { status: 400 });
    }

    await adminDeleteUser(targetUserId);

    await addSystemLog({
      type: "TENANT_DELETED",
      level: "WARNING",
      source: "Super Admin Command",
      message: `Tenant account deleted: ${targetUserId}`,
      details: { targetUserId }
    });

    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

