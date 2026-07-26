import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const requests = await prisma.agencyRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب الطلبات" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const { id, action } = await req.json(); // action: "APPROVE" or "REJECT"
    const registration = await prisma.agencyRegistration.findUnique({ where: { id } });

    if (!registration) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    if (action === "REJECT") {
      await prisma.agencyRegistration.update({
        where: { id },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ success: true, message: "تم رفض الطلب" });
    }

    if (action === "APPROVE") {
      // 1. Mark as approved
      await prisma.agencyRegistration.update({
        where: { id },
        data: { status: "APPROVED" },
      });

      // 2. Create the Agency
      const newAgency = await prisma.agency.create({
        data: {
          name: registration.agencyName,
          contactPhone: registration.phone,
          isActive: true,
          subscriptionType: "NONE",
        },
      });

      // 3. Create a User for this agency
      // Default password: phone number or random
      const defaultPassword = registration.phone.substring(0, 8);
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      await prisma.user.create({
        data: {
          name: registration.ownerName,
          email: registration.email,
          passwordHash,
          role: "AGENCY_ADMIN",
          agencyId: newAgency.id,
        },
      });

      return NextResponse.json({ 
        success: true, 
        message: `تم الموافقة وإنشاء المكتب. كلمة المرور الافتراضية: ${defaultPassword}` 
      });
    }

    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
  } catch (error) {
    console.error("Agency request action error:", error);
    return NextResponse.json({ error: "فشل تنفيذ الإجراء" }, { status: 500 });
  }
}
