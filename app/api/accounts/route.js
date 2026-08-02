import { NextResponse } from "next/server";
import { getAccounts, removeAccount } from "@/lib/db";

export async function GET() {
  const accounts = getAccounts().map((a) => ({
    platform: a.platform,
    name: a.name || null,
    connectedAt: a.connectedAt
  }));
  return NextResponse.json({ accounts });
}

export async function DELETE(req) {
  const { platform } = await req.json();
  removeAccount(platform);
  return NextResponse.json({ success: true });
}
