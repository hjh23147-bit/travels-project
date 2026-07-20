import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك باستعراض المكاتب" }, { status: 403 });
    }

    const agencies = await prisma.agency.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(agencies);
  } catch {
    return NextResponse.json({ error: "فشل جلب المكاتب" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

    const data = await req.json();

    if (data.adminEmail) {
      const existingUser = await prisma.user.findUnique({ where: { email: data.adminEmail } });
      if (existingUser) {
        return NextResponse.json({ error: "البريد الإلكتروني الخاص بمدير المكتب مسجل مسبقاً" }, { status: 400 });
      }
    }

    let subscriptionEndsAt = null;
    if (data.subscriptionType === "MONTHLY") {
      subscriptionEndsAt = new Date();
      subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + 30);
    } else if (data.subscriptionType === "YEARLY") {
      subscriptionEndsAt = new Date();
      subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + 365);
    }

    const agency = await prisma.agency.create({
      data: {
        name: data.name,
        description: data.description,
        contactPhone: data.contactPhone,
        isActive: data.isActive,
        logo: data.logo,
        coverImage: data.coverImage,
        whatsapp: data.whatsapp,
        instagram: data.instagram,
        x_link: data.x_link,
        subscriptionType: data.subscriptionType || "NONE",
        subscriptionEndsAt,
      },
    });

    if (data.adminEmail && data.adminPassword) {
      const passwordHash = await bcrypt.hash(data.adminPassword, 10);
      await prisma.user.create({
        data: {
          name: `مدير - ${data.name}`,
          email: data.adminEmail,
          passwordHash,
          role: "AGENCY_ADMIN",
          agencyId: agency.id,
        }
      });
    }

    return NextResponse.json(agency, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء المكتب" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

    const data = await req.json();
    // Optional logic: if the admin changes the subscription type, we could recalculate the end date.
    // For simplicity, we can let the admin modify the type, and recalculate if it's explicitly changing,
    // or just pass `subscriptionEndsAt` if provided by the frontend.
    // Let's assume the frontend passes `subscriptionType` and if it's changing, it recalculates, or we recalculate here if we don't pass the date from frontend.
    
    if (data.subscriptionType && data.subscriptionType !== "NONE" && !data.subscriptionEndsAt) {
        // If frontend doesn't send the explicit date but sends the type, we might want to preserve the current date or recalculate.
        // It's safer to rely on the frontend sending the recalculated `subscriptionEndsAt` or we recalculate if needed.
        // Let's implement a simple recalculate if we only get the type and not the date, or just save what we receive.
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
        name: data.name,
        description: data.description,
        contactPhone: data.contactPhone,
        isActive: data.isActive,
        logo: data.logo,
        coverImage: data.coverImage,
        whatsapp: data.whatsapp,
        instagram: data.instagram,
        x_link: data.x_link,
    };
    
    if (data.subscriptionType !== undefined) {
      updateData.subscriptionType = data.subscriptionType;
    }
    
    if (data.subscriptionEndsAt !== undefined) {
      updateData.subscriptionEndsAt = data.subscriptionEndsAt ? new Date(data.subscriptionEndsAt) : null;
    }

    const agency = await prisma.agency.update({
      where: { id: data.id },
      data: updateData,
    });
    return NextResponse.json(agency);
  } catch {
    return NextResponse.json({ error: "فشل تحديث المكتب" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

    const { id } = await req.json();
    await prisma.agency.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "فشل حذف المكتب" }, { status: 500 });
  }
}
