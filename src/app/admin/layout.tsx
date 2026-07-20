"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Star, LayoutDashboard, Package, Users, FileText, LogOut, Menu, X, Building2, Globe, Megaphone } from "lucide-react";

// All sidebar links with role restrictions
// allowedRoles: if set, only these roles can see the link. If not set, all roles can see it.
const sidebarLinks = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, adminOnly: true },
  { href: "/admin/agencies", label: "إدارة المكاتب", icon: Building2, adminOnly: true },
  { href: "/admin/packages", label: "إدارة الباقات", icon: Package, adminOnly: true },
  { href: "/admin/orders", label: "إدارة الطلبات", icon: Users, adminOnly: true },
  { href: "/admin/ads", label: "الإعلانات والمقالات", icon: Megaphone, adminOnly: false },
  { href: "/admin/users", label: "إدارة المدراء", icon: Users, adminOnly: true },
  { href: "/admin/content", label: "إدارة المحتوى", icon: FileText, adminOnly: true },
];

// AGENCY_ADMIN can only see ads and return to site
const isAllowedForRole = (link: { adminOnly: boolean }, role: string) => {
  if (role === "AGENCY_ADMIN") return !link.adminOnly;
  return true; // ADMIN and SUPER_ADMIN see everything
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      return;
    }

    const name = sessionStorage.getItem("admin_name");
    const role = sessionStorage.getItem("admin_role");
    
    if (!role) {
      // Use replace() so the admin page is REMOVED from browser history
      window.location.replace("/admin/login");
      return;
    }

    // AGENCY_ADMIN: block access to all admin pages except /admin/ads
    if (role === "AGENCY_ADMIN" && !pathname.startsWith("/admin/ads") && pathname !== "/admin/login") {
      window.location.replace("/admin/ads");
      return;
    }
    
    setAdminName(name || "المدير");
    setAdminRole(role);
    setIsAuthenticated(true);
    setMounted(true);
  }, [pathname, router]);

  // === SECURITY: Lock History to block back-button bypass ===
  useEffect(() => {
    if (pathname === "/admin/login") return;

    // Push a duplicate state so pressing back stays on the same page
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      const role = sessionStorage.getItem("admin_role");
      if (!role) {
        // No session — force to login, replacing history so they can't come back
        window.location.replace("/admin/login");
      } else {
        // Re-lock: push state again to trap the back button
        window.history.pushState(null, "", window.location.href);
      }
    };

    // pageshow fires when page is loaded from bfcache (back-forward cache)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // Page was loaded from bfcache — force re-auth check
        const role = sessionStorage.getItem("admin_role");
        if (!role) {
          window.location.replace("/admin/login");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [pathname]);

  // Always show login page immediately — no auth check needed
  if (pathname === "/admin/login") return <>{children}</>;

  // For all other admin pages: wait for mount + auth check
  if (!mounted) return null;
  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
    sessionStorage.removeItem("admin_name");
    sessionStorage.removeItem("admin_role");
    sessionStorage.removeItem("admin_agency_id");
    // replace() removes admin pages from browser history stack
    window.location.replace("/admin/login");
  };

  // Force logout and redirect to site (clears all session data + cookie)
  const handleReturnToSite = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
    sessionStorage.removeItem("admin_name");
    sessionStorage.removeItem("admin_role");
    sessionStorage.removeItem("admin_agency_id");
    // replace() removes admin pages from history so back button won't return here
    window.location.replace("/");
  };

  return (
    <div className="min-h-screen bg-navy-50 text-black flex" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-72 bg-navy-900 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-navy-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <Star className="w-6 h-6 text-navy-900" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                رحلات <span className="text-gold-400">النور</span>
              </h1>
              <p className="text-[10px] text-navy-500">لوحة التحكم</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden mr-auto text-navy-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {sidebarLinks
              .filter((link) => isAllowedForRole(link, adminRole))
              .map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                      : "text-navy-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}

            {/* Divider + Return to Site (always visible, triggers full logout) */}
            <div className="border-t border-navy-800 pt-2 mt-2">
              <button
                onClick={handleReturnToSite}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-navy-400 hover:text-white hover:bg-white/5"
              >
                <Globe className="w-5 h-5" />
                العودة للموقع
              </button>
            </div>
          </nav>

          {/* User */}
          <div className="px-4 py-4 border-t border-navy-800">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <span className="text-navy-900 text-sm font-bold">{adminName?.[0] || "م"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{adminName}</p>
                <p className="text-xs text-navy-500">
                  {adminRole === "AGENCY_ADMIN" ? "مدير مكتب" : adminRole === "SUPER_ADMIN" ? "مدير شامل" : "مدير نظام"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-navy-500 hover:text-red-400 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-navy-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-navy-600 hover:text-navy-900"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h2 className="text-lg font-bold text-navy-900 hidden lg:block">
            {sidebarLinks.find((l) => l.href === pathname)?.label || "لوحة التحكم"}
          </h2>

          <div className="flex items-center gap-3">
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
