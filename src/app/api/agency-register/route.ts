import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.agencyName || !data.ownerName || !data.email || !data.phone) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    const registration = await prisma.agencyRegistration.create({
      data: {
        agencyName: data.agencyName,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
      },
    });

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (error) {
    console.error("Agency registration error:", error);
    return NextResponse.json({ error: "فشل حفظ الطلب" }, { status: 500 });
  }
}
