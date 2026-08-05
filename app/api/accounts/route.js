import { NextResponse } from "next/server";
import { getAccounts, removeAccount } from "@/lib/db";

export async function GET(req) {
  const userId = req.headers.get("x-user-id") || null;
  const dbAccounts = await getAccounts(userId);
  const accounts = dbAccounts.map((a) => ({
    _id: a._id,
    platform: a.platform,
    name: a.name || null,
    connectedAt: a.connectedAt
  }));
  return NextResponse.json({ accounts });
}

export async function DELETE(req) {
  const { id } = await req.json();
  const userId = req.headers.get("x-user-id") || null;
  await removeAccount(id, userId);
  return NextResponse.json({ success: true });
}
