import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const role = req.headers.get("x-user-role");
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "لم يتم العثور على ملف" }, { status: 400 });
    }

    // 1. Strict validation of file types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "صيغة الملف غير مدعومة. يسمح فقط بـ PDF والصور (PNG, JPG, WEBP)" }, { status: 400 });
    }

    // 2. Strict validation of file size (max 5MB)
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueId = crypto.randomUUID();
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${uniqueId}.${ext}`;

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Ignore if directory exists
    }

    try {
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (writeError) {
      console.warn("Local filesystem write failed (probably running on Vercel). Falling back to Base64 data URL:", writeError);
      const base64 = buffer.toString("base64");
      return NextResponse.json({ url: `data:${file.type};base64,${base64}` });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء رفع الملف" }, { status: 500 });
  }
}
