import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.agencyName || !data.ownerName || !data.email || !data.phone) {
      return NextResponse.json({ error: "جميع الحقول الأساسية مطلوبة" }, { status: 400 });
    }

    const registration = await prisma.agencyRegistration.create({
      data: {
        agencyName: data.agencyName,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        agencyType: data.agencyType || "TRAVEL",
        commercialRegistry: data.commercialRegistry || null,
        taxCertificate: data.taxCertificate || null,
        nationalId: data.nationalId || null,
        license: data.license || null,
        logo: data.logo || null,
        additionalDocs: data.additionalDocs || null,
        adminNotes: null
      },
    });

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (error) {
    console.error("Agency registration error:", error);
    return NextResponse.json({ error: "فشل حفظ الطلب في قاعدة البيانات" }, { status: 500 });
  }
}
