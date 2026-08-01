import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "alnoor-travel-super-secret-key-change-in-production-2025"
);

const PROTECTED_PATHS = ["/admin"];
const PROTECTED_API_PATHS = [
  "/api/leads", 
  "/api/packages", 
  "/api/settings", 
  "/api/admin", 
  "/api/upload",
  "/api/jobs",
  "/api/job-reservations"
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedPage = PROTECTED_PATHS.some(
    (p) => pathname.startsWith(p) && !pathname.startsWith("/admin/login")
  );
  const isProtectedApi = PROTECTED_API_PATHS.some((p) => pathname.startsWith(p));

  // Determine if this specific method on the API path is protected
  let isMethodProtected = isProtectedApi;
  if (pathname.startsWith("/api/leads") && req.method === "POST") {
    isMethodProtected = false; // Public can create leads
  }
  if (pathname.startsWith("/api/packages") && req.method === "GET") {
    isMethodProtected = false; // Public can view packages
  }
  if (pathname.startsWith("/api/upload") && req.method === "POST") {
    isMethodProtected = false; // Public can upload files
  }
  if (pathname.startsWith("/api/jobs") && req.method === "GET") {
    isMethodProtected = false; // Public can view jobs
  }
  if (pathname.startsWith("/api/job-reservations") && req.method === "POST") {
    isMethodProtected = false; // Public can apply for jobs/visas
  }

  if (!isProtectedPage && !isMethodProtected) {
    return NextResponse.next();
  }

  // === SECURITY: Prevent ALL browser caching of admin pages ===
  const addNoCacheHeaders = (res: NextResponse) => {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    res.headers.set("Surrogate-Control", "no-store");
    res.headers.set("Vary", "*");
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  };

  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    if (isMethodProtected && !isProtectedPage) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    const loginRedirect = NextResponse.redirect(new URL("/admin/login", req.url));
    loginRedirect.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
    return addNoCacheHeaders(loginRedirect);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string || "ADMIN";
    const isGlobalAdmin = role === "SUPER_ADMIN" || role === "ADMIN";

    // === GRANULAR RBAC ROUTE GUARD ===
    if (!isGlobalAdmin && isProtectedPage) {
      let isAllowed = false;
      if (pathname === "/admin" || pathname === "/admin/login") {
        isAllowed = true;
      } else if (role === "TRAVEL_OFFICE_MANAGER") {
        isAllowed = pathname.startsWith("/admin/packages") || pathname.startsWith("/admin/orders") || pathname.startsWith("/admin/ads");
      } else if (role === "EMPLOYMENT_OFFICE_MANAGER") {
        isAllowed = pathname.startsWith("/admin/jobs") || pathname.startsWith("/admin/job-reservations") || pathname.startsWith("/admin/ads");
      } else if (role === "AGENCY_ADMIN" || role === "EMPLOYEE" || role === "ACCOUNTANT") {
        isAllowed = pathname.startsWith("/admin/packages") || pathname.startsWith("/admin/orders") || pathname.startsWith("/admin/ads") || pathname.startsWith("/admin/jobs") || pathname.startsWith("/admin/job-reservations");
      }

      if (!isAllowed) {
        const errorRedirect = NextResponse.redirect(new URL("/admin", req.url));
        return addNoCacheHeaders(errorRedirect);
      }
    }

    // Pass user info to backend API routes via headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-role", role);
    if (payload.agencyId) {
      requestHeaders.set("x-agency-id", payload.agencyId as string);
    }

    const nextRes = NextResponse.next({
      request: { headers: requestHeaders },
    });
    if (isProtectedPage) addNoCacheHeaders(nextRes);
    return nextRes;
  } catch (error) {
    console.log("JWT Verify Error:", error);
    if (isMethodProtected && !isProtectedPage) {
      return NextResponse.json({ error: "الجلسة منتهية، يرجى إعادة تسجيل الدخول" }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL("/admin/login", req.url));
    response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
    return response;
  }
}

export const config = {
  matcher: [
    "/admin/:path*", 
    "/api/leads/:path*", 
    "/api/packages/:path*", 
    "/api/settings/:path*", 
    "/api/admin/:path*", 
    "/api/upload/:path*",
    "/api/jobs/:path*",
    "/api/job-reservations/:path*"
  ],
};
