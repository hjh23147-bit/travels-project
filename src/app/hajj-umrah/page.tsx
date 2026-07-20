import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import prisma from "@/lib/db";
import Link from "next/link";
import { CheckCircle2, Clock, Building2, MapPin, Star, ArrowLeft, BadgeCheck, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "باقات الحج والعمرة | رحلات النور",
  description: "اكتشف باقات الحج والعمرة الفاخرة والاقتصادية من رحلات النور. أسعار تنافسية وخدمات متكاملة مع فنادق قريبة من الحرم.",
};

export const revalidate = 60;

async function getPackages() {
  return prisma.package.findMany({
    where: { isActive: true, type: { in: ["HAJJ", "UMRAH"] } },
    orderBy: { price: "asc" },
    select: {
      id: true, title: true, description: true,
      price: true, discount: true, features: true,
      type: true, imageUrl: true, duration: true,
      hotelMakkah: true, hotelMadinah: true,
    },
  });
}

export default async function HajjUmrahPage() {
  const packages = await getPackages();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Page Header ── */}
      <section className="pt-20 pb-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-extrabold tracking-widest uppercase text-gold-600 bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
                  برامجنا المتميزة
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-navy-900 leading-tight">
                باقات <span className="text-gradient-gold">الحج والعمرة</span>
              </h1>
              <p className="text-navy-500 mt-2 text-sm sm:text-base max-w-xl">
                اختر الباقة المناسبة لك وانطلق في رحلتك الإيمانية بكل راحة وطمأنينة مع فريقنا المتخصص.
              </p>
            </div>
            {/* Quick Contact */}
            <a
              href="tel:+967781668332"
              className="flex items-center gap-2 bg-navy-900 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-navy-800 transition-colors shrink-0 shadow-sm"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              استشارة مجانية
            </a>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { value: `${packages.length}+`, label: "باقة متاحة" },
              { value: "٩٨٪", label: "نسبة رضا العملاء" },
              { value: "١٠+", label: "سنوات خبرة" },
            ].map((stat, i) => (
              <div key={i} className="bg-navy-50 rounded-2xl p-4 text-center border border-navy-100/50">
                <p className="text-2xl font-black text-navy-900">{stat.value}</p>
                <p className="text-xs text-navy-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages List ── */}
      <section className="py-12" id="packages">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {packages.length === 0 ? (
            <div className="text-center py-24 text-navy-400">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-bold">لا توجد باقات متاحة حالياً</p>
              <p className="text-sm mt-1">سيتم إضافة الباقات قريباً</p>
            </div>
          ) : (
            <div className="space-y-6">
              {packages.map((pkg, index) => {
                const features = JSON.parse(pkg.features) as string[];
                const isFeatured = index === 0;
                const finalPrice = pkg.price - pkg.discount;

                return (
                  <div
                    key={pkg.id}
                    className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-xl group ${
                      isFeatured
                        ? "border-gold-300 shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_8px_30px_rgba(212,175,55,0.08)]"
                        : "border-gray-200 shadow-sm hover:border-gold-200"
                    }`}
                  >
                    {/* Featured Badge */}
                    {isFeatured && (
                      <div className="bg-gradient-to-r from-gold-500 to-gold-400 px-6 py-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-navy-900" fill="currentColor" />
                        <span className="text-xs font-black text-navy-900 tracking-wider uppercase">الباقة الأكثر طلباً</span>
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row">
                      {/* Image */}
                      <div className="lg:w-72 xl:w-80 h-56 lg:h-auto relative overflow-hidden shrink-0">
                        <img
                          src={
                            pkg.type === "HAJJ"
                              ? "https://images.unsplash.com/photo-1565552645632-d725e8bfc19a?w=800&q=80"
                              : "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80"
                          }
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 right-4">
                          <span className="text-xs font-bold text-navy-900 bg-gold-400 px-3 py-1.5 rounded-full shadow">
                            {pkg.type === "HAJJ" ? "🕋 باقة حج" : "🕌 باقة عمرة"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col lg:flex-row">
                        {/* Details */}
                        <div className="flex-1 p-6 sm:p-8">
                          <h2 className="text-xl sm:text-2xl font-black text-navy-900 mb-2 group-hover:text-gold-600 transition-colors">
                            {pkg.title}
                          </h2>
                          <p className="text-navy-500 text-sm leading-relaxed mb-5 font-light">
                            {pkg.description}
                          </p>

                          {/* Hotel & Duration Info */}
                          <div className="flex flex-wrap gap-3 mb-6">
                            {pkg.duration && (
                              <div className="flex items-center gap-2 bg-navy-50 text-navy-700 text-xs font-bold px-3 py-2 rounded-xl border border-navy-100">
                                <Clock className="w-3.5 h-3.5 text-gold-500" />
                                {pkg.duration}
                              </div>
                            )}
                            {pkg.hotelMakkah && (
                              <div className="flex items-center gap-2 bg-navy-50 text-navy-700 text-xs font-bold px-3 py-2 rounded-xl border border-navy-100">
                                <Building2 className="w-3.5 h-3.5 text-gold-500" />
                                مكة: {pkg.hotelMakkah}
                              </div>
                            )}
                            {pkg.hotelMadinah && (
                              <div className="flex items-center gap-2 bg-navy-50 text-navy-700 text-xs font-bold px-3 py-2 rounded-xl border border-navy-100">
                                <MapPin className="w-3.5 h-3.5 text-gold-500" />
                                المدينة: {pkg.hotelMadinah}
                              </div>
                            )}
                          </div>

                          {/* Features Grid */}
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-navy-600">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span className="leading-relaxed">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Price & CTA */}
                        <div className={`lg:w-52 xl:w-60 flex flex-col items-center justify-center p-6 sm:p-8 text-center border-t lg:border-t-0 lg:border-r border-gray-100 ${isFeatured ? "bg-gold-50/40" : "bg-gray-50/50"}`}>
                          {pkg.discount > 0 && (
                            <div className="mb-2">
                              <span className="text-sm text-gray-400 line-through">
                                {pkg.price.toLocaleString("ar-SA")}
                              </span>
                              <span className="mr-2 text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                وفّر {pkg.discount.toLocaleString("ar-SA")}
                              </span>
                            </div>
                          )}

                          <div className="text-4xl font-black text-navy-900 leading-none">
                            {finalPrice.toLocaleString("ar-SA")}
                          </div>
                          <span className="text-xs text-navy-400 mt-1 mb-6 font-medium">ريال سعودي / للفرد</span>

                          <Link
                            href={`/book?packageId=${pkg.id}&type=${pkg.type}`}
                            className={`w-full py-3.5 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] ${
                              isFeatured
                                ? "btn-gold shadow-lg shadow-gold-500/20"
                                : "bg-navy-900 text-white hover:bg-navy-800"
                            }`}
                          >
                            احجز الآن
                            <ArrowLeft className="w-4 h-4" />
                          </Link>

                          <div className="flex items-center gap-1.5 mt-3">
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <p className="text-[11px] text-navy-400 font-medium">
                              الدفع عند التأكيد
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      {packages.length > 1 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-extrabold tracking-widest uppercase text-gold-600 bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
                مقارنة شاملة
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-4">
                قارن بين <span className="text-gradient-gold">الباقات</span>
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full bg-white">
                <thead>
                  <tr className="bg-navy-900 text-white">
                    <th className="px-6 py-4 text-right text-sm font-bold rounded-tr-2xl">الميزة</th>
                    {packages.map((pkg, i) => (
                      <th key={pkg.id} className={`px-6 py-4 text-center text-sm font-bold ${i === packages.length - 1 ? "rounded-tl-2xl" : ""}`}>
                        <span className="block text-gold-400 text-xs mb-1">{pkg.type === "HAJJ" ? "🕋" : "🕌"}</span>
                        {pkg.title.split(" - ")[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {["السعر", "المدة", "فندق مكة", "فندق المدينة", "النوع"].map((row, i) => (
                    <tr key={row} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}>
                      <td className="px-6 py-4 text-sm font-bold text-navy-900">{row}</td>
                      {packages.map((pkg) => {
                        let value = "";
                        switch (row) {
                          case "السعر": value = `${(pkg.price - pkg.discount).toLocaleString("ar-SA")} ريال`; break;
                          case "المدة": value = pkg.duration || "—"; break;
                          case "فندق مكة": value = pkg.hotelMakkah || "—"; break;
                          case "فندق المدينة": value = pkg.hotelMadinah || "—"; break;
                          case "النوع": value = pkg.type === "HAJJ" ? "حج" : "عمرة"; break;
                        }
                        return (
                          <td key={pkg.id} className="px-6 py-4 text-sm text-navy-600 text-center font-medium">
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <Footer />
      <AIChat />
    </main>
  );
}
