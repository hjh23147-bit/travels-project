import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const adminPassword = "225211.10";
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    
    await prisma.user.update({
      where: { email: "wesam.os" },
      data: { passwordHash: passwordHash }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "تم تحديث تشفير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول باستخدام البريد wesam.os وكلمة المرور 225211.10" 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
