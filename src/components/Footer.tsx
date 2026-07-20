import Link from "next/link";
import { Star, Phone, MapPin, Shield, BadgeCheck, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-300 relative overflow-hidden">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-l from-transparent via-gold-500 to-transparent opacity-50" />

      {/* Certifications bar */}
      <div className="bg-navy-950/50 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs text-navy-400">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-gold-500" />
              <span>مرخص من <strong className="text-white">وزارة الأوقاف والإرشاد</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>عضو في <strong className="text-white">اتحاد وكالات السفر اليمنية</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-500" />
              <span>جائزة <strong className="text-white">أفضل مشغل رحلات 2024</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-500" fill="currentColor" />
              <span><strong className="text-white">4.9/5</strong> التقييم العام</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
                <Star className="w-6 h-6 text-navy-900" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-serif">رحلات <span className="text-gold-500">النور</span></h3>
                <p className="text-[10px] text-gold-500/80 tracking-wider font-mono">ALNOOR TRAVELS</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-navy-300 mb-6 font-light">
              منصة رائدة لخدمات الحج والعمرة والتأشيرات. الوجهة الموثوقة لضيوف الرحمن لتجربة روحانية لا تُنسى.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {["SSL آمن", "مرخص", "موثوق"].map((badge) => (
                <span key={badge} className="text-[10px] font-bold text-gold-500 border border-gold-500/30 rounded-full px-3 py-1">
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm tracking-wide">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/hajj-umrah", label: "الحج والعمرة" },
                { href: "/visas", label: "التأشيرات" },
                { href: "/why-us", label: "لماذا نحن" },
                { href: "/book", label: "احجز رحلتك الآن" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-navy-300 hover:text-gold-500 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gold-500/0 group-hover:bg-gold-500 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm tracking-wide">خدماتنا</h4>
            <ul className="space-y-3">
              {[
                "رحلات العمرة الفاخرة",
                "رحلات الحج المتكاملة",
                "التأشيرات الإلكترونية",
                "استقبال وتوديع المطار",
                "المرشد الديني المعتمد",
                "التأمين الطبي الشامل",
              ].map((item) => (
                <li key={item} className="text-sm text-navy-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-sm bg-gold-500/40 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm tracking-wide">تواصل معنا</h4>
            <ul className="space-y-4 mb-6">
              <li>
                <a href="tel:+967781668332" className="flex items-start gap-3 group hover:text-gold-500 transition-colors">
                  <Phone className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-navy-400 mb-0.5">اتصل بنا</p>
                    <span className="text-sm text-white group-hover:text-gold-500 font-mono transition-colors" dir="ltr">+967 78 166 8332</span>
                  </div>
                </a>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-navy-400 mb-0.5">المقر الرئيسي</p>
                  <span className="text-sm text-white">صنعاء، الجمهورية اليمنية</span>
                </div>
              </li>
            </ul>

            {/* CTA Button */}
            <Link href="/book" className="btn-gold w-full py-3 rounded-xl text-sm font-bold text-center block shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              احجز الآن
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-navy-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-navy-500">
              © {new Date().getFullYear()} رحلات النور — الوجهة الأولى لضيوف الرحمن. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-6">
              {[
                { href: "/privacy", label: "سياسة الخصوصية" },
                { href: "/terms", label: "الشروط والأحكام" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-xs text-navy-400 hover:text-gold-500 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
