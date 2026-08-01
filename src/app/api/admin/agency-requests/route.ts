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

    const data = await req.json();
    const { id, action, notes } = data; // action: "APPROVE", "REJECT", "REQUEST_DOCS"
    const registration = await prisma.agencyRegistration.findUnique({ where: { id } });

    if (!registration) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    if (action === "REJECT") {
      await prisma.agencyRegistration.update({
        where: { id },
        data: { 
          status: "REJECTED",
          adminNotes: notes || null
        },
      });
      return NextResponse.json({ success: true, message: "تم رفض الطلب بنجاح" });
    }

    if (action === "REQUEST_DOCS") {
      await prisma.agencyRegistration.update({
        where: { id },
        data: { 
          status: "MORE_DOCUMENTS_REQUESTED",
          adminNotes: notes || "يرجى مراجعة وتوفير وثائق إضافية"
        },
      });
      return NextResponse.json({ success: true, message: "تم إرسال طلب استكمال الوثائق" });
    }

    if (action === "APPROVE") {
      // 1. Check if email already registered to prevent duplicates
      const existingUser = await prisma.user.findUnique({ where: { email: registration.email } });
      if (existingUser) {
        return NextResponse.json({ error: "البريد الإلكتروني لمدير المكتب مسجل بالفعل كمستخدم في النظام" }, { status: 400 });
      }

      // 2. Mark registration as approved
      await prisma.agencyRegistration.update({
        where: { id },
        data: { 
          status: "APPROVED",
          adminNotes: notes || null
        },
      });

      // 3. Create the Agency with the correct type
      const newAgency = await prisma.agency.create({
        data: {
          name: registration.agencyName,
          contactPhone: registration.phone,
          logo: registration.logo || null,
          type: registration.agencyType || "TRAVEL",
          isActive: true,
          subscriptionType: "NONE",
        },
      });

      // 4. Create Manager User account with correct RBAC role
      const managerRole = registration.agencyType === "EMPLOYMENT"
        ? "EMPLOYMENT_OFFICE_MANAGER"
        : "TRAVEL_OFFICE_MANAGER";

      // Default password: phone number (first 8 digits)
      const defaultPassword = registration.phone.trim().replace(/[^0-9]/g, "").substring(0, 8) || "Alnoor123";
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      await prisma.user.create({
        data: {
          name: registration.ownerName,
          email: registration.email,
          passwordHash,
          role: managerRole,
          agencyId: newAgency.id,
        },
      });

      return NextResponse.json({ 
        success: true, 
        message: `تمت الموافقة وإنشاء حساب المكتب بنجاح. نوع المكتب: ${
          registration.agencyType === "TRAVEL" ? "سفريات وحج" : registration.agencyType === "EMPLOYMENT" ? "مكتب توظيف" : "مكتب مشترك"
        }. كلمة المرور الافتراضية للمدير: ${defaultPassword}` 
      });
    }

    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
  } catch (error) {
    console.error("Agency request action error:", error);
    return NextResponse.json({ error: "فشل تنفيذ الإجراء المطلوب" }, { status: 500 });
  }
}
