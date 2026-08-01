import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminAgencyId = req.headers.get("x-agency-id");
    let agencyId = req.nextUrl.searchParams.get("agencyId");

    if (role !== "SUPER_ADMIN" && role !== "ADMIN" && adminAgencyId) {
      agencyId = adminAgencyId;
    }

    const whereClause: Record<string, any> = {};
    if (!role) {
      whereClause.status = "ACTIVE";
    }
    if (agencyId) {
      whereClause.agencyId = agencyId;
    }

    const jobs = await prisma.jobPackage.findMany({
      where: whereClause,
      include: { agency: { select: { id: true, name: true, logo: true } } },
      orderBy: { createdAt: "desc" },
    });

    const res = NextResponse.json(jobs);
    if (!role) {
      res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    }
    return res;
  } catch (error) {
    console.error("Jobs GET error:", error);
    return NextResponse.json({ error: "فشل جلب وظائف التعاقد" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminAgencyId = req.headers.get("x-agency-id");
    const data = await req.json();

    let targetAgencyId = data.agencyId || null;
    if (role !== "SUPER_ADMIN" && role !== "ADMIN" && adminAgencyId) {
      targetAgencyId = adminAgencyId;
    }

    if (!targetAgencyId) {
      return NextResponse.json({ error: "معرف المكتب مطلوب" }, { status: 400 });
    }

    const job = await prisma.jobPackage.create({
      data: {
        title: data.title,
        description: data.description,
        requiredDocs: data.requirements || "",
        price: parseFloat(data.price) || 0,
        country: data.country,
        duration: data.duration || "سنة واحدة",
        status: data.isActive ? "ACTIVE" : "INACTIVE",
        agencyId: targetAgencyId,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Job POST error:", error);
    return NextResponse.json({ error: "فشل إنشاء فرصة العمل" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminAgencyId = req.headers.get("x-agency-id");
    const data = await req.json();

    if (role !== "SUPER_ADMIN" && role !== "ADMIN" && adminAgencyId) {
      const existing = await prisma.jobPackage.findUnique({ where: { id: data.id } });
      if (!existing || existing.agencyId !== adminAgencyId) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
      }
    }

    let targetAgencyId = data.agencyId || null;
    if (role !== "SUPER_ADMIN" && role !== "ADMIN" && adminAgencyId) {
      targetAgencyId = adminAgencyId;
    }

    const job = await prisma.jobPackage.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        requiredDocs: data.requirements || "",
        price: parseFloat(data.price) || 0,
        country: data.country,
        duration: data.duration || "سنة واحدة",
        status: data.isActive ? "ACTIVE" : "INACTIVE",
        agencyId: targetAgencyId,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Job PUT error:", error);
    return NextResponse.json({ error: "فشل تحديث فرصة العمل" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminAgencyId = req.headers.get("x-agency-id");
    const { id } = await req.json();

    if (role !== "SUPER_ADMIN" && role !== "ADMIN" && adminAgencyId) {
      const existing = await prisma.jobPackage.findUnique({ where: { id } });
      if (!existing || existing.agencyId !== adminAgencyId) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
      }
    }

    await prisma.jobPackage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Job DELETE error:", error);
    return NextResponse.json({ error: "فشل حذف فرصة العمل" }, { status: 500 });
  }
}
