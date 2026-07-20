import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { promises as fs } from "fs";
import path from "path";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "alnoor-travel-super-secret-key-change-in-production-2025"
);

async function getAuthPayload() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; role: string; agencyId: string | null };
  } catch {
    return null;
  }
}

export async function GET(_req: NextRequest) {
  try {
    const auth = await getAuthPayload();
    if (!auth) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const ads = await prisma.advertisement.findMany({
      where: (auth.role === "SUPER_ADMIN" || auth.role === "ADMIN") ? {} : { agencyId: auth.agencyId! },
      include: { agency: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(ads);
  } catch (error) {
    console.error("Ads GET Error:", error);
    const message = error instanceof Error ? error.message : "حدث خطأ أثناء الجلب";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthPayload();
    if (!auth) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const agencyIdRaw = formData.get("agencyId") as string;
    const image = formData.get("image") as File | null;

    // If AGENCY_ADMIN, force the agencyId to be their own agency
    const agencyIdToUse = (auth.role === "SUPER_ADMIN" || auth.role === "ADMIN") ? agencyIdRaw : auth.agencyId;

    if (!agencyIdToUse) {
       return NextResponse.json({ error: "معرف المكتب مطلوب. الرجاء اختيار المكتب." }, { status: 400 });
    }

    let imageUrl = null;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads/ads");
      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = uniqueSuffix + "-" + image.name.replace(/[^a-zA-Z0-9.-]/g, "");
      const filepath = path.join(uploadDir, filename);

      await fs.writeFile(filepath, buffer);
      imageUrl = `/uploads/ads/${filename}`;
    }

    const ad = await prisma.advertisement.create({
      data: {
        title,
        content: content || null,
        imageUrl,
        agencyId: agencyIdToUse,
        isActive: true,
      },
      include: { agency: { select: { name: true } } }
    });

    return NextResponse.json(ad);
  } catch (error) {
    console.error("Ads API Error:", error);
    const message = error instanceof Error ? error.message : "حدث خطأ أثناء الإنشاء";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
