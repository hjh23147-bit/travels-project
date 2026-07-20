import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendTelegramNotification, sendEmailNotification } from "@/lib/notifications";

// Simple in-memory rate limiter (per IP, per minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }

  if (record.count >= limit) {
    return false; // blocked
  }

  record.count++;
  return true; // allowed
}

export async function GET(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminAgencyId = req.headers.get("x-agency-id");

    const whereClause: Record<string, unknown> = {};
    if (role === "AGENCY_ADMIN" && adminAgencyId) {
      whereClause.agencyId = adminAgencyId;
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      include: { package: true, agency: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(leads);
  } catch {
    return NextResponse.json({ error: "فشل جلب الطلبات" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Rate limiting: 5 submissions per minute per IP
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json(
      { error: "تم تجاوز الحد الأقصى للطلبات. يرجى الانتظار دقيقة." },
      { status: 429 }
    );
  }

  try {
    const data = await req.json();

    // ✅ Server-side validation
    const errors: string[] = [];

    if (!data.name || String(data.name).trim().length < 2) {
      errors.push("الاسم مطلوب ويجب أن يكون حرفين على الأقل");
    }
    if (!data.phone || data.phone.length < 6) {
      errors.push("رقم الهاتف غير صحيح أو قصير جداً");
    }
    if (!data.country || String(data.country).trim().length < 2) {
      errors.push("الدولة مطلوبة");
    }
    if (!["HAJJ", "UMRAH", "VISA", "TRAVEL"].includes(data.serviceType)) {
      errors.push("نوع الخدمة غير صحيح");
    }
    if (!data.travelDate || isNaN(new Date(data.travelDate).getTime())) {
      errors.push("تاريخ السفر غير صحيح");
    }
    const travelersCount = parseInt(data.travelersCount);
    if (isNaN(travelersCount) || travelersCount < 1 || travelersCount > 100) {
      errors.push("عدد المسافرين يجب أن يكون بين 1 و 100");
    }

    if (errors.length > 0) {
      console.error("Booking validation failed:", errors, "Data:", data);
      return NextResponse.json({ error: errors.join(" | "), errors }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name: String(data.name).trim(),
        phone: String(data.phone).trim(),
        country: String(data.country).trim(),
        serviceType: data.serviceType,
        travelersCount,
        travelDate: new Date(data.travelDate),
        budget: parseFloat(data.budget) || 0,
        packageId: data.packageId || null,
        agencyId: data.agencyId || null,
        notes: data.notes ? String(data.notes).substring(0, 500) : null,
      },
    });

    // Fetch agency name if agencyId is provided
    let agencyName;
    if (lead.agencyId) {
      const agency = await prisma.agency.findUnique({ where: { id: lead.agencyId } });
      if (agency) agencyName = agency.name;
    }

    // Send notifications asynchronously
    sendTelegramNotification(lead);
    sendEmailNotification(lead, agencyName);

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json({ error: "فشل إنشاء الطلب" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminAgencyId = req.headers.get("x-agency-id");
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "معرّف الطلب مطلوب" }, { status: 400 });
    }

    if (role === "AGENCY_ADMIN" && adminAgencyId) {
      const existing = await prisma.lead.findUnique({ where: { id: data.id } });
      if (!existing || existing.agencyId !== adminAgencyId) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
      }
    }

    const lead = await prisma.lead.update({
      where: { id: data.id },
      data: {
        status: data.status,
        notes: data.notes,
      },
    });
    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "فشل تحديث الطلب" }, { status: 500 });
  }
}
