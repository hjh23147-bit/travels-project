import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAuthPayload();
    if (!auth) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const ad = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!ad) {
      return NextResponse.json({ error: "الإعلان غير موجود" }, { status: 404 });
    }

    // Check permissions
    if (auth.role !== "SUPER_ADMIN" && auth.role !== "ADMIN" && ad.agencyId !== auth.agencyId) {
      return NextResponse.json({ error: "غير مصرح لك بحذف هذا الإعلان" }, { status: 403 });
    }

    await prisma.advertisement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء الحذف" }, { status: 500 });
  }
}
