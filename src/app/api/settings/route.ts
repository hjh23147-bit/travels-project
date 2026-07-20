import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.settings.findMany({
      orderBy: { key: "asc" },
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "فشل جلب الإعدادات" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json();

    const existing = await prisma.settings.findUnique({ where: { key } });

    if (existing) {
      const updated = await prisma.settings.update({
        where: { key },
        data: { value },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.settings.create({
        data: { key, value },
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: "فشل حفظ الإعداد" }, { status: 500 });
  }
}
