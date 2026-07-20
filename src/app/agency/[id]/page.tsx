import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/db";
import Link from "next/link";
import { Phone, CheckCircle2, Clock, Megaphone, Star, Award, Shield, MapPin, BadgeCheck, ArrowLeft, MessageCircle, Share2, Package } from "lucide-react";
import { notFound } from "next/navigation";
import AnimatedSection from "@/components/AnimatedSection";

// ISR: revalidate every 30 seconds
export const revalidate = 30;

export default async function AgencyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agency = await prisma.agency.findUnique({
    where: { id, isActive: true },
    include: {
      packages: { where: { isActive: true }, orderBy: { price: "asc" } },
      ads: { where: { isActive: true }, orderBy: { createdAt: "desc" } }
    },
  });

  if (!agency) return notFound();

  const typeLabels: Record<string, { label: string; icon: string; color: string; badgeText: string; gradient: string }> = {
    HAJJ:  { label: "باقة حج",      icon: "🕋", color: "bg-amber-50 text-amber-700 border-amber-200",  badgeText: "🕋 باقة حج",     gradient: "from-amber-500 to-orange-500" },
    UMRAH: { label: "باقة عمرة",    icon: "🕌", color: "bg-gold-50 text-gold-700 border-gold-200",    badgeText: "🕌 باقة عمرة",  gradient: "from-gold-500 to-yellow-500" },
    TRIP:  { label: "رحلة سياحية", icon: "✈️", color: "bg-purple-50 text-purple-700 border-purple-200",badgeText: "✈️ رحلة سياحية",gradient: "from-purple-500 to-indigo-500" },
  };

  const hasContact = agency.contactPhone || agency.whatsapp || agency.instagram || agency.x_link;

  return (
    <main className="min-h-screen bg-[#f0f4f8] flex flex-col relative overflow-hidden">
      <Navbar />

      {/* ─── HERO / COVER IMAGE ─── */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={agency.coverImage || "https://images.unsplash.com/photo-1565552645632-d725e8bfc19a?w=1600&q=80"}
          alt={`غلاف ${agency.name}`}
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 40%" }}
        />
        {/* Dark layered overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/60 to-navy-800/20" />
        {/* Gold shimmer line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-60" />
      </div>

      {/* ─── PROFILE CARD (Overlapping Hero) ─── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full -mt-24 sm:-mt-32">
        <AnimatedSection direction="up">
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden">
            
            {/* Inner top section */}
            <div className="p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-end gap-6 border-b border-navy-100">
              
              {/* Logo */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0 -mt-20 sm:-mt-24 relative z-10">
                {agency.logo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl font-black text-gold-400">{agency.name.charAt(0)}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-right">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3 py-1.5 rounded-full">
                    <BadgeCheck className="w-4 h-4" /> مكتب موثق رسمياً
                  </span>
                  {agency.subscriptionType === "YEARLY" && (
                    <span className="inline-flex items-center gap-1.5 bg-gold-50 text-gold-700 border border-gold-200 text-xs font-black px-3 py-1.5 rounded-full">
                      ⭐ شريك مميز سنوي
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight mb-2">{agency.name}</h1>
                <p className="text-gold-600 font-bold text-sm flex items-center gap-1.5 justify-center sm:justify-start">
                  <MapPin className="w-4 h-4" /> وكالة سفر وسياحة
                </p>
              </div>

              {/* Share & Phone CTA */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  title="مشاركة الصفحة"
                  className="w-12 h-12 rounded-2xl bg-navy-50 hover:bg-navy-100 text-navy-500 hover:text-navy-900 border border-navy-100 flex items-center justify-center transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {agency.contactPhone && (
                  <a
                    href={`tel:+${agency.contactPhone}`}
                    className="btn-gold px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-gold-500/20 flex items-center gap-2 hover:scale-105 transition-transform"
                    dir="ltr"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{agency.contactPhone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Stats + Description Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-navy-100 rtl:lg:divide-x-reverse">
              {/* Description */}
              <div className="lg:col-span-2 p-8 sm:p-10">
                <p className="text-navy-600 text-base sm:text-lg leading-loose font-light">
                  {agency.description || "وكالة سفر وسياحة رائدة في تقديم خدمات الحج والعمرة بأعلى المعايير واحترافية تامة لضمان راحة وطمأنينة ضيوف الرحمن. نحرص على تقديم أفضل الخدمات وأرقى الباقات لعملائنا الكرام."}
                </p>

                {/* Social Links */}
                {hasContact && (
                  <div className="flex flex-wrap gap-3 mt-6">
                    {agency.whatsapp && (
                      <a
                        href={`https://wa.me/${agency.whatsapp.replace(/\+/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-500 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        واتساب
                      </a>
                    )}
                    {agency.instagram && (
                      <a
                        href={agency.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-pink-50 hover:bg-pink-500 text-pink-700 hover:text-white border border-pink-200 hover:border-pink-500 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        انستقرام
                      </a>
                    )}
                    {agency.x_link && (
                      <a
                        href={agency.x_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-navy-50 hover:bg-navy-900 text-navy-700 hover:text-white border border-navy-200 hover:border-navy-900 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        منصة X
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Stats Column */}
              <div className="p-8 sm:p-10 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-navy-50 rounded-2xl border border-navy-100">
                  <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-navy-900">{agency.packages.length}</p>
                    <p className="text-xs text-navy-500 font-bold">باقة سياحية متاحة</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-navy-900">موثوق ✓</p>
                    <p className="text-xs text-emerald-600 font-bold">ترخيص رسمي سعودي</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gold-50 rounded-2xl border border-gold-100">
                  <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-navy-900">خدمة VIP</p>
                    <p className="text-xs text-navy-500 font-bold">رعاية واهتمام تام</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* ─── PACKAGES SECTION ─── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16" direction="down">
            <span className="inline-flex items-center gap-2 text-gold-600 text-xs sm:text-sm font-extrabold tracking-widest uppercase bg-gold-50 px-5 py-2 rounded-full border border-gold-200 mb-5">
              <Package className="w-4 h-4" />
              الباقات والعروض
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">
              اختر الباقة المثالية لرحلتك
            </h2>
            <p className="text-navy-500 text-base max-w-2xl mx-auto font-light">
              نقدم لك مجموعة متنوعة من الباقات المصممة بعناية لتلبية احتياجاتك بكل طمأنينة وسهولة
            </p>
          </AnimatedSection>

          {agency.packages.length === 0 ? (
            <AnimatedSection>
              <div className="text-center py-24 bg-white/80 rounded-3xl border border-navy-100 shadow-sm max-w-2xl mx-auto">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-navy-500 text-lg font-medium">لم يتم إضافة أي باقات بعد لهذا المكتب.</p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agency.packages.map((pkg, index) => {
                const features = JSON.parse(pkg.features || "[]") as string[];
                const isPopular = index === 0;
                const typeInfo = typeLabels[pkg.type] || typeLabels.TRIP;
                const finalPrice = pkg.price - pkg.discount;

                return (
                  <AnimatedSection key={pkg.id} delay={index * 0.1}>
                    <div className={`relative rounded-[2rem] overflow-hidden flex flex-col h-full bg-white border transition-all duration-500 group ${
                      isPopular
                        ? "border-gold-300 shadow-xl shadow-gold-500/10 ring-2 ring-gold-400/30"
                        : "border-navy-100/50 hover:border-gold-300 card-luxury hover:shadow-xl"
                    }`}>

                      {/* Popular Badge */}
                      {isPopular && (
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />
                      )}

                      {/* Package Image */}
                      <div className="h-56 w-full relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pkg.imageUrl || (pkg.type === "HAJJ" ? "https://images.unsplash.com/photo-1565552645632-d725e8bfc19a?w=800&q=80" : "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80")}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/30 to-transparent" />

                        {/* Type Badge */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg bg-gradient-to-r ${typeInfo.gradient} text-white`}>
                            {typeInfo.badgeText}
                          </span>
                        </div>

                        {isPopular && (
                          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white text-navy-900 text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                            <Star className="w-3 h-3 text-gold-500" fill="currentColor" />
                            الأكثر طلباً
                          </div>
                        )}

                        {/* Price Overlay */}
                        <div className="absolute bottom-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                            <p className="text-[10px] text-navy-400 font-bold uppercase tracking-wider">السعر / شخص</p>
                            <div className="flex items-baseline gap-1">
                              <p className="text-2xl font-black text-navy-900">{finalPrice.toLocaleString("ar-SA")}</p>
                              <span className="text-sm font-bold text-navy-500">ر.س</span>
                            </div>
                            {pkg.discount > 0 && (
                              <p className="text-xs text-emerald-600 font-bold mt-0.5">وفّر {pkg.discount.toLocaleString("ar-SA")} ر.س</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 sm:p-8 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-navy-900 line-clamp-1 group-hover:text-gold-600 transition-colors mb-3">{pkg.title}</h3>

                        <p className="text-navy-500 text-sm leading-relaxed mb-5 line-clamp-2 font-light">
                          {pkg.description}
                        </p>

                        {pkg.duration && (
                          <div className="flex items-center gap-2 text-xs text-navy-600 font-bold mb-5 bg-navy-50 p-3 rounded-xl border border-navy-100">
                            <Clock className="w-4 h-4 text-gold-500 flex-shrink-0" />
                            <span>المدة: {pkg.duration}</span>
                          </div>
                        )}

                        {(pkg.hotelMakkah || pkg.hotelMadinah) && (
                          <div className="flex flex-col gap-2 mb-5 p-3 bg-gold-50/50 border border-gold-100 rounded-xl text-xs font-medium text-navy-600">
                            {pkg.hotelMakkah && <span>🕋 مكة: {pkg.hotelMakkah}</span>}
                            {pkg.hotelMadinah && <span>🕌 المدينة: {pkg.hotelMadinah}</span>}
                          </div>
                        )}

                        <ul className="space-y-2.5 mb-6 flex-1">
                          {features.slice(0, 4).map((f, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-navy-600 font-light">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2 leading-relaxed">{f}</span>
                            </li>
                          ))}
                          {features.length > 4 && (
                            <li className="text-xs text-gold-600 font-bold pr-6">+{features.length - 4} مزايا إضافية...</li>
                          )}
                        </ul>

                        <Link
                          href={`/book?type=${pkg.type}&packageId=${pkg.id}&agencyId=${agency.id}`}
                          className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all mt-auto ${
                            isPopular
                              ? "btn-gold shadow-lg shadow-gold-500/20 hover:scale-[1.02]"
                              : "bg-navy-900 hover:bg-gold-500 text-white hover:scale-[1.02] shadow-lg"
                          }`}
                        >
                          احجز هذه الباقة الآن
                          <ArrowLeft className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── ADS SECTION ─── */}
      {agency.ads.length > 0 && (
        <section className="py-20 px-4 sm:px-6 bg-white border-t border-navy-50 relative overflow-hidden">
          {/* Subtle bg decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
          <div className="max-w-6xl mx-auto relative z-10">
            <AnimatedSection className="text-center mb-16" direction="down">
              <span className="inline-flex items-center gap-2 text-navy-600 text-xs sm:text-sm font-extrabold tracking-widest uppercase bg-navy-50 px-5 py-2 rounded-full border border-navy-100 mb-5">
                <Megaphone className="w-4 h-4" />
                إعلانات وأخبار
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">
                آخر أخبار وعروض المكتب
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {agency.ads.map((ad, index) => (
                <AnimatedSection
                  key={ad.id}
                  delay={index * 0.1}
                  className={`group bg-white rounded-[2rem] overflow-hidden border border-navy-100 hover:border-gold-300 transition-all duration-500 hover:shadow-xl ${
                    index === 0 && agency.ads.length > 1 ? "lg:col-span-2" : ""
                  }`}
                >
                  <div className={`flex flex-col ${index === 0 && agency.ads.length > 1 ? "sm:flex-row" : ""}`}>
                    {ad.imageUrl && (
                      <div className={`overflow-hidden bg-navy-50 ${index === 0 && agency.ads.length > 1 ? "sm:w-2/5 h-64 sm:h-auto" : "h-52"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-xs font-bold text-navy-500 bg-navy-50 px-3 py-1 rounded-full border border-navy-100">
                          {new Date(ad.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-navy-900 mb-4 leading-snug group-hover:text-gold-600 transition-colors">{ad.title}</h3>
                      <p className="text-navy-500 text-sm leading-loose flex-1 font-light">{ad.content}</p>
                      <div className="mt-6 pt-5 border-t border-navy-50">
                        <span className="text-xs text-gold-600 font-bold">{agency.name}</span>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── STICKY BOTTOM BAR (Mobile Only) ─── */}
      {agency.contactPhone && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 backdrop-blur-xl border-t border-navy-100 shadow-2xl p-4">
          <div className="flex gap-3 max-w-lg mx-auto">
            {agency.whatsapp && (
              <a
                href={`https://wa.me/${agency.whatsapp.replace(/\+/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-500 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform"
              >
                <MessageCircle className="w-5 h-5" />
                واتساب
              </a>
            )}
            <a
              href={`tel:+${agency.contactPhone}`}
              className="flex-1 btn-gold py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 hover:scale-[1.02] transition-transform"
            >
              <Phone className="w-5 h-5" />
              اتصل الآن
            </a>
          </div>
        </div>
      )}

      {/* Spacing for sticky bar on mobile */}
      {agency.contactPhone && <div className="h-24 lg:hidden" />}

      <Footer />
    </main>
  );
}
