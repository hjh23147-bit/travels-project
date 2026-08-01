import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminAgencyId = req.headers.get("x-agency-id");

    const whereClause: Record<string, any> = {};
    if (role !== "SUPER_ADMIN" && role !== "ADMIN" && adminAgencyId) {
      whereClause.agencyId = adminAgencyId;
    }

    const reservations = await prisma.jobReservation.findMany({
      where: whereClause,
      include: { 
        jobPackage: { 
          include: { 
            agency: { select: { id: true, name: true } } 
          } 
        } 
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Job Reservations GET error:", error);
    return NextResponse.json({ error: "فشل جلب طلبات التوظيف" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.clientName || !data.clientPhone || !data.clientPassport || !data.jobId || !data.visaSelection) {
      return NextResponse.json({ error: "جميع الحقول الأساسية مطلوبة" }, { status: 400 });
    }

    const job = await prisma.jobPackage.findUnique({
      where: { id: data.jobId }
    });

    if (!job) {
      return NextResponse.json({ error: "عرض العمل المطلوب غير موجود" }, { status: 404 });
    }

    // Serialize custom fields into the database's uploadedDocs JSON string
    const uploadedDocsJson = JSON.stringify({
      cvUrl: data.cvUrl || "",
      passportPhotoUrl: data.passportPhotoUrl || "",
      visaPhotoUrl: data.visaPhotoUrl || "",
      clientPassport: data.clientPassport,
      visaSelection: data.visaSelection,
      notes: data.notes || ""
    });

    const reservation = await prisma.jobReservation.create({
      data: {
        applicantName: data.clientName,
        applicantPhone: data.clientPhone,
        applicantEmail: data.clientEmail || `${data.clientPassport}@alnoor.com`,
        uploadedDocs: uploadedDocsJson,
        status: "PENDING",
        jobPackageId: data.jobId,
        agencyId: job.agencyId,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Job Reservation POST error:", error);
    return NextResponse.json({ error: "فشل تقديم طلب التوظيف" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const adminAgencyId = req.headers.get("x-agency-id");
    const data = await req.json();

    if (!data.id) {
      return NextResponse.json({ error: "معرف الطلب مطلوب" }, { status: 400 });
    }

    // Fetch existing reservation
    const existing = await prisma.jobReservation.findUnique({
      where: { id: data.id }
    });

    if (!existing) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    // Auth & Tenant check
    if (role !== "SUPER_ADMIN" && role !== "ADMIN" && adminAgencyId) {
      if (existing.agencyId !== adminAgencyId) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
      }
    }

    // Update the serialized uploadedDocs JSON string
    let uploadedDocsJson = existing.uploadedDocs;
    try {
      const parsed = JSON.parse(existing.uploadedDocs);
      parsed.cvUrl = data.cvUrl !== undefined ? data.cvUrl : parsed.cvUrl;
      parsed.passportPhotoUrl = data.passportPhotoUrl !== undefined ? data.passportPhotoUrl : parsed.passportPhotoUrl;
      parsed.visaPhotoUrl = data.visaPhotoUrl !== undefined ? data.visaPhotoUrl : parsed.visaPhotoUrl;
      parsed.clientPassport = data.clientPassport !== undefined ? data.clientPassport : parsed.clientPassport;
      parsed.visaSelection = data.visaSelection !== undefined ? data.visaSelection : parsed.visaSelection;
      parsed.notes = data.notes !== undefined ? data.notes : parsed.notes;
      uploadedDocsJson = JSON.stringify(parsed);
    } catch {
      // Fallback if parsing failed
      uploadedDocsJson = JSON.stringify({
        cvUrl: data.cvUrl || "",
        passportPhotoUrl: data.passportPhotoUrl || "",
        visaPhotoUrl: data.visaPhotoUrl || "",
        clientPassport: data.clientPassport || "",
        visaSelection: data.visaSelection || "FREE",
        notes: data.notes || ""
      });
    }

    const updated = await prisma.jobReservation.update({
      where: { id: data.id },
      data: {
        status: data.status,
        uploadedDocs: uploadedDocsJson,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Job Reservation PATCH error:", error);
    return NextResponse.json({ error: "فشل تحديث حالة الطلب" }, { status: 500 });
  }
}
