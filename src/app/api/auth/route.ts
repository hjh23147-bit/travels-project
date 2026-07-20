import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "alnoor-travel-super-secret-key-change-in-production-2025"
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    // Compare with bcrypt (secure)
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    // Issue a signed JWT valid for 8 hours
    const token = await new SignJWT({ 
      userId: user.id, 
      role: user.role, 
      email: user.email,
      agencyId: user.agencyId 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      name: user.name,
      role: user.role,
      agencyId: user.agencyId,
    });

    // Set JWT in HttpOnly cookie (more secure than localStorage)
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: "خطأ في الخادم" }, { status: 500 });
  }
}

export async function DELETE() {
  // Logout endpoint
  const response = NextResponse.json({ success: true });

  // Clear the JWT cookie
  response.cookies.set("admin_token", "", { 
    maxAge: 0, 
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  // === NUCLEAR SECURITY OPTION ===
  // Clear-Site-Data instructs the browser to wipe ALL cached data, cookies,
  // and storage for this site. This makes it IMPOSSIBLE to use the back button
  // or any cached admin page after logout.
  // Note: This is supported by all modern browsers (Chrome, Firefox, Edge).
  response.headers.set("Clear-Site-Data", "\"cache\", \"cookies\", \"storage\"");

  // Also ensure the response itself is not cached
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  response.headers.set("Pragma", "no-cache");

  return response;
}
