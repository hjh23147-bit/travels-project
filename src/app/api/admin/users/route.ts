import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        agencyId: true,
        agency: { select: { name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "فشل جلب المستخدمين" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

    const data = await req.json();

    if (!data.name || !data.email || !data.password || !data.role) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return NextResponse.json({ error: "البريد الإلكتروني مسجل مسبقاً" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        agencyId: data.role === "AGENCY_ADMIN" ? data.agencyId : null,
      },
      select: { id: true, name: true, email: true, role: true, agencyId: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء المستخدم" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

    const data = await req.json();

    if (!data.id) return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });

    const updateData: Record<string, string | null> = {
      name: data.name,
      email: data.email,
      role: data.role,
      agencyId: data.role === "AGENCY_ADMIN" ? data.agencyId : null,
    };

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: data.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, agencyId: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "فشل تحديث المستخدم" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    if (role !== "SUPER_ADMIN" && role !== "ADMIN") return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

    const { id } = await req.json();

    // Prevent deleting oneself
    const userId = req.headers.get("x-user-id");
    if (userId === id) {
       return NextResponse.json({ error: "لا يمكنك حذف حسابك الحالي" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "فشل حذف المستخدم" }, { status: 500 });
  }
}
