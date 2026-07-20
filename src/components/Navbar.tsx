"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Star, UserCog } from "lucide-react";

// ==========================================
// SECURITY: AdminLink replaces the current page in history instead of pushing.
// This prevents the browser's back button from returning to the public site
// from the admin panel without re-authenticating.
// ==========================================
function AdminLink({ className, children }: { className: string; children: React.ReactNode }) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // replace() removes the current page from history so back button can't return here
    window.location.replace("/admin");
  }, []);

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/hajj-umrah", label: "الحج والعمرة" },
  { href: "/visas", label: "التأشيرات" },
  { href: "/agencies", label: "المكاتب" },
  { href: "/#why-us", label: "لماذا نحن" },
  { href: "/hajj-umrah#packages", label: "العروض" },
  { href: "#footer", label: "تواصل معنا" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);

      if (currentScrollY > 120) {
        setHidden(currentScrollY > lastScrollY);
      } else {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-navy-900/5 text-navy-900"
          : "bg-transparent text-white"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-gold-500/30 transition-all duration-300 ${scrolled ? 'bg-navy-900' : 'bg-white/10 backdrop-blur-sm'}`}>
              <Star className={`w-7 h-7 ${scrolled ? 'text-gold-500' : 'text-gold-400'}`} fill="currentColor" />
            </div>
            <div>
              <p className="text-xl font-bold leading-tight font-serif">
                رحلات <span className={scrolled ? "text-gold-600" : "text-gold-400"}>النور</span>
              </p>
              <p className={`text-[10px] tracking-wider font-sans ${scrolled ? "text-navy-400" : "text-white/70"}`}>
                ALNOOR TRAVELS
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                    isActive
                      ? scrolled ? "text-gold-600 bg-gold-50" : "text-gold-400 bg-white/10"
                      : scrolled ? "text-navy-600 hover:text-gold-600 hover:bg-navy-50" : "text-white/90 hover:text-gold-400 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative group">
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  scrolled ? "text-navy-800 hover:bg-navy-50" : "text-white hover:bg-white/10"
                }`}
              >
                <span>🇸🇦</span>
                <span>العربية</span>
              </button>
              <div className="absolute left-0 mt-1 w-28 bg-white rounded-xl shadow-xl border border-navy-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-right">
                <button type="button" className="w-full text-right px-3 py-1.5 text-xs hover:bg-navy-50 flex items-center justify-between font-extrabold text-gold-600 cursor-pointer">
                  <span>العربية</span>
                  <span>🇸🇦</span>
                </button>
                <button type="button" className="w-full text-right px-3 py-1.5 text-xs hover:bg-navy-50 text-navy-400 flex items-center justify-between cursor-not-allowed" disabled>
                  <span>English</span>
                  <span>🇬🇧</span>
                </button>
                <button type="button" className="w-full text-right px-3 py-1.5 text-xs hover:bg-navy-50 text-navy-400 flex items-center justify-between cursor-not-allowed" disabled>
                  <span>اردو</span>
                  <span>🇵🇰</span>
                </button>
              </div>
            </div>

            <AdminLink
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors cursor-pointer ${scrolled ? "border-navy-200 text-navy-500 hover:bg-navy-50" : "border-white/20 text-white/80 hover:bg-white/10 hover:text-white"}`}
            >
              <UserCog className="w-4 h-4" />
              <span className="text-xs font-bold">الإدارة</span>
            </AdminLink>
            <a
              href="tel:+967781668332"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors ${scrolled ? "border-navy-200 text-navy-700 hover:bg-navy-50" : "border-white/30 text-white hover:bg-white/10"}`}
            >
              <Phone className={`w-3.5 h-3.5 ${scrolled ? "text-gold-600" : "text-gold-400"}`} />
              <span className="text-xs font-semibold font-mono" dir="ltr">+967781668332</span>
            </a>
            <Link
              href="/book"
              className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
            >
              احجز الآن
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-navy-900 hover:bg-navy-50" : "text-white hover:bg-white/10"}`}
            aria-label="القائمة"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-500 overflow-y-auto bg-white text-navy-900 border-t border-navy-100 ${
          isOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-1 shadow-2xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? "text-gold-600 bg-gold-50"
                    : "text-navy-600 hover:text-gold-600 hover:bg-navy-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex gap-2 mt-4 pt-4 border-t border-navy-100">
            <AdminLink
              className="flex-1 text-center bg-navy-50 text-navy-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCog className="w-4 h-4" />
              الإدارة
            </AdminLink>
            <Link
              href="/book"
              onClick={() => setIsOpen(false)}
              className="flex-[2] text-center btn-gold px-4 py-3 rounded-xl text-sm font-bold shadow-md"
            >
              احجز الآن
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
