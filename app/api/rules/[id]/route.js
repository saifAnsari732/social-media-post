import { NextResponse } from "next/server";
import { getRuleById, updateRule, deleteRule } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const rule = await getRuleById(id);
    if (!rule) return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    return NextResponse.json({ rule });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const updates = await req.json();
    const updatedRule = await updateRule(id, updates);
    return NextResponse.json({ rule: updatedRule });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await deleteRule(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
