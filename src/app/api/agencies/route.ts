import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const agencies = await prisma.agency.findMany({
      where: {
        isActive: true,
        OR: [
          { subscriptionEndsAt: null },
          { subscriptionEndsAt: { gt: new Date() } }
        ]
      },
      select: {
        id: true,
        name: true,
        contactPhone: true,
        logo: true,
        whatsapp: true,
      },
      orderBy: { createdAt: "desc" },
    });
    const res = NextResponse.json(agencies);
    res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return res;
  } catch {
    return NextResponse.json({ error: "فشل جلب المكاتب" }, { status: 500 });
  }
}
