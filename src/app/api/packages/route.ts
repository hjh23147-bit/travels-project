import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminAgencyId = req.headers.get("x-agency-id");
    let agencyId = req.nextUrl.searchParams.get("agencyId");

    if (role === "AGENCY_ADMIN" && adminAgencyId) {
      agencyId = adminAgencyId;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = role ? {} : { 
      isActive: true,
      agency: {
        isActive: true,
        OR: [
          { subscriptionEndsAt: null },
          { subscriptionEndsAt: { gt: new Date() } }
        ]
      }
    };
    if (agencyId) {
      whereClause.agencyId = agencyId;
    }
    const packages = await prisma.package.findMany({
      where: whereClause,
      include: { agency: { select: { id: true, name: true, logo: true } } },
      orderBy: { price: "asc" },
    });
    const res = NextResponse.json(packages);
    // Cache public responses for 60s, stale-while-revalidate for 120s
    if (!role) {
      res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    }
    return res;
  } catch {
    return NextResponse.json({ error: "فشل جلب الباقات" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminAgencyId = req.headers.get("x-agency-id");
    const data = await req.json();

    let targetAgencyId = data.agencyId || null;
    if (role === "AGENCY_ADMIN" && adminAgencyId) {
      targetAgencyId = adminAgencyId;
    }

    const pkg = await prisma.package.create({
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        discount: parseFloat(data.discount) || 0,
        features: data.features,
        type: data.type,
        isActive: data.isActive ?? true,
        imageUrl: data.imageUrl || null,
        duration: data.duration || null,
        hotelMakkah: data.hotelMakkah || null,
        hotelMadinah: data.hotelMadinah || null,

        agencyId: targetAgencyId,
      },
    });
    return NextResponse.json(pkg, { status: 201 });
  } catch {
    return NextResponse.json({ error: "فشل إنشاء الباقة" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminAgencyId = req.headers.get("x-agency-id");
    const data = await req.json();

    if (role === "AGENCY_ADMIN" && adminAgencyId) {
      const existing = await prisma.package.findUnique({ where: { id: data.id } });
      if (!existing || existing.agencyId !== adminAgencyId) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
      }
    }

    let targetAgencyId = data.agencyId || null;
    if (role === "AGENCY_ADMIN" && adminAgencyId) {
      targetAgencyId = adminAgencyId;
    }

    const pkg = await prisma.package.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        discount: parseFloat(data.discount) || 0,
        features: data.features,
        type: data.type,
        isActive: data.isActive,
        imageUrl: data.imageUrl,
        duration: data.duration,
        hotelMakkah: data.hotelMakkah,
        hotelMadinah: data.hotelMadinah,

        agencyId: targetAgencyId,
      },
    });
    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Package PUT Error:", error);
    return NextResponse.json({ error: "فشل تحديث الباقة" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminAgencyId = req.headers.get("x-agency-id");
    const { id } = await req.json();

    if (role === "AGENCY_ADMIN" && adminAgencyId) {
      const existing = await prisma.package.findUnique({ where: { id } });
      if (!existing || existing.agencyId !== adminAgencyId) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
      }
    }

    await prisma.package.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Package DELETE Error:", error);
    return NextResponse.json({ error: "فشل حذف الباقة" }, { status: 500 });
  }
}
