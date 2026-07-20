import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const agency = await prisma.agency.findUnique({
      where: { id, isActive: true },
    });
    if (!agency) {
      return NextResponse.json({ error: "المكتب غير موجود" }, { status: 404 });
    }
    return NextResponse.json(agency);
  } catch {
    return NextResponse.json({ error: "فشل جلب تفاصيل المكتب" }, { status: 500 });
  }
}
