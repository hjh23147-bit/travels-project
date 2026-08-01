import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import SmartBookingBox from "@/components/SmartBookingBox";
import AgenciesCarousel from "@/components/AgenciesCarousel";
import Home3dWrapper from "@/components/3d/Home3dWrapper";
import prisma from "@/lib/db";
import Link from "next/link";

// ISR: Revalidate every 60 seconds instead of force-dynamic
export const revalidate = 60;
import {
  Shield,
  Star,
  Phone,
  Clock,
  ArrowLeft,
  BadgeCheck,
  HeartHandshake,
  Headset,
  Award,
  Wallet,
  ThumbsUp,
  MapPin,
  Building2,
  ChevronLeft,
  CheckCircle2
} from "lucide-react";

async function getAgencies() {
  return prisma.agency.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      logo: true,
      description: true,
      contactPhone: true,
      whatsapp: true,
      isActive: true,
    },
    take: 20,
  });
}

async function getPackages() {
  return prisma.package.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
    take: 3,
  });
}

async function getSettings() {
  const settingsList = await prisma.settings.findMany();
  const map: Record<string, string> = {};
  settingsList.forEach(s => map[s.key] = s.value);
  return map;
}

export default async function HomePage() {
  const [agencies, packages, settings] = await Promise.all([
    getAgencies(),
    getPackages(),
    getSettings()
  ]);

  const heroTitle1 = settings["hero_title_1"] || "رحلتك الإيمانية تبدأ بثقة وراحة مع";
  const heroTitle2 = settings["hero_title_2"] || "رحلات النور";
  const heroSubtitle = settings["hero_subtitle"] || "منصتك الأولى لحجز برامج الحج والعمرة وتسهيل استخراج التأشيرات، مع الربط المباشر مع أفضل وكالات ومكاتب السفر المعتمدة.";

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden relative" dir="rtl">
      {/* 3D WebGL Canvas Layer */}
      <Home3dWrapper />

      <Navbar />

      {/* DOM UI Overlays - pointer-events-none allows interaction with background WebGL canvas */}
      <div className="relative z-10 pointer-events-none w-full">
        
        {/* ============ HERO SECTION ============ */}
        <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left side: Booking Box */}
              <div className="w-full lg:col-span-5 order-2 lg:order-1 pointer-events-auto">
                <AnimatedSection delay={0.2} direction="left">
                  <SmartBookingBox />
                </AnimatedSection>
              </div>

              {/* Right side: Title & Description */}
              <div className="max-w-2xl text-right lg:col-span-7 order-1 lg:order-2 pointer-events-auto">
                <AnimatedSection direction="right">
                  <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 text-xs sm:text-sm font-bold mb-6">
                    <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
                    الوجهة الرسمية المعتمدة لخدمات ضيوف الرحمن
                  </span>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.25] mb-6">
                    {heroTitle1} <br />
                    <span className="text-gradient-gold">{heroTitle2}</span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 font-light whitespace-pre-line">
                    {heroSubtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-start">
                    <Link
                      href="/hajj-umrah"
                      className="btn-gold px-8 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-transform"
                    >
                      استكشف برامج الحج والعمرة
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <a
                      href="tel:+967781668332"
                      className="btn-outline-white px-8 py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-white/10"
                    >
                      <Headset className="w-4 h-4 text-gold-400" />
                      استشارة مجانية فورية
                    </a>
                  </div>
                </AnimatedSection>
              </div>
              
            </div>
          </div>
        </section>

        {/* ============ WHY CHOOSE US ============ */}
        <section className="py-28 bg-[#040a1b]/40 backdrop-blur-md border-y border-navy-900/40" id="why-us">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <AnimatedSection className="text-center mb-20 pointer-events-auto" direction="down">
              <span className="text-gold-500 text-xs sm:text-sm font-extrabold tracking-widest uppercase bg-gold-500/10 px-3.5 py-1.5 rounded-full border border-gold-500/20">لماذا نحن</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
                تميزنا يصنع <span className="text-gradient-gold">الفارق في تجربتكم</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base font-light">نلتزم بتقديم أرقى الخدمات والحلول المتكاملة لضمان أداء النسك بطمأنينة وراحة كاملة.</p>
            </AnimatedSection>

            <div className="pointer-events-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { icon: Wallet, title: "أسعار تنافسية", desc: "باقات مرنة وعروض حصرية تناسب الميزانيات المختلفة دون المساس بمستويات الجودة والخدمة." },
                { icon: Headset, title: "دعم على مدار الساعة", desc: "فريق دعم فني مؤهل متواجد ٢٤ ساعة لمرافقتكم وحل أي استفسارات أو طوارئ خلال الرحلة." },
                { icon: Award, title: "خبرة طويلة", desc: "أكثر من ١٠ سنوات من الريادة والتميز في تنظيم وتيسير رحلات الحج والعمرة والزيارة." },
                { icon: Shield, title: "حجوزات موثوقة", desc: "عقود مباشرة مع أفضل الفنادق وشركات النقل لضمان حقوق المعتمرين والمسافرين." },
                { icon: HeartHandshake, title: "خدمات متكاملة", desc: "نهتم بكافة تفاصيل رحلتكم الإيمانية، من إصدار التأشيرات حتى الاستقبال والسكن والمزارات." },
                { icon: ThumbsUp, title: "تقييمات ممتازة", desc: "نسجل أعلى نسب رضا في السوق تفوق ٩٨٪ من آلاف المعتمرين الذين تشرفنا بخدمتهم." },
              ].map((feature, i) => (
                <AnimatedSection key={i} delay={i * 0.08}>
                  <div className="bg-[#081126]/60 backdrop-blur-xl border border-navy-800/40 p-8 rounded-2xl h-full flex flex-col items-center text-center group hover:border-gold-500/20 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-navy-900/50 flex items-center justify-center mb-6 group-hover:bg-gold-500/10 group-hover:scale-110 transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-gray-300 group-hover:text-gold-400 transition-colors" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed font-light">{feature.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            
          </div>
        </section>

        {/* ============ PACKAGES SECTION (Dom reference layout) ============ */}
        <section className="py-28 bg-[#020617]/50" id="packages">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <AnimatedSection className="text-center mb-16 pointer-events-auto" direction="down">
              <span className="text-gold-500 text-xs sm:text-sm font-extrabold tracking-widest uppercase bg-gold-500/10 px-3.5 py-1.5 rounded-full border border-gold-500/20">الباقات التفاعلية</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
                تصفح الباقات <span className="text-gradient-gold">حول العالم</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base font-light">
                انظر إلى البطاقات ثلاثية الأبعاد العائمة حول الكرة الأرضية للتفاعل المباشر والحجز، أو تصفح عروضنا الإضافية بالأسفل.
              </p>
            </AnimatedSection>

            {/* List database packages for search engine and SEO */}
            <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, idx) => {
                const features = JSON.parse(pkg.features || "[]") as string[];
                return (
                  <AnimatedSection key={pkg.id} delay={idx * 0.1}>
                    <div className="bg-[#081126]/60 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col h-full border border-navy-800/40 hover:border-gold-500/30 transition-all duration-500 group">
                      {/* Image */}
                      <div className="h-56 w-full relative overflow-hidden">
                        <img 
                          src={pkg.type === "HAJJ" ? "https://images.unsplash.com/photo-1565552645632-d725e8bfc19a?w=800&q=80" : "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80"}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <span className="text-xs font-bold text-navy-950 bg-gold-400 px-3.5 py-1.5 rounded-full shadow-lg">
                            {pkg.type === "HAJJ" ? "🕋 باقة حج" : "🕌 باقة عمرة"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 sm:p-8 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-gold-400 transition-colors">{pkg.title}</h3>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-300 mb-6 font-medium bg-navy-900/60 p-3 rounded-xl border border-navy-800/40">
                          {pkg.duration && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-gold-400" />
                              <span>{pkg.duration}</span>
                            </div>
                          )}
                          {pkg.hotelMakkah && (
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-4 h-4 text-gold-400" />
                              <span className="line-clamp-1">{pkg.hotelMakkah}</span>
                            </div>
                          )}
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                          {features.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300 font-light">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2 leading-relaxed">{f}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex items-center justify-between border-t border-navy-800/40 pt-6 mt-auto">
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1 uppercase">السعر للشخص</p>
                            <div className="flex items-baseline gap-1">
                              <p className="text-2xl sm:text-3xl font-black text-gold-400">
                                {(pkg.price - pkg.discount).toLocaleString("ar-SA")}
                              </p>
                              <span className="text-sm font-bold text-gray-300">ر.س</span>
                            </div>
                          </div>
                          <Link
                            href={`/book?packageId=${pkg.id}&type=${pkg.type}`}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-navy-900 flex items-center justify-center group-hover:bg-gold-500 transition-colors border border-navy-800/60"
                          >
                            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400 group-hover:text-navy-950 transition-colors" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
            
            <AnimatedSection delay={0.2} className="mt-14 text-center pointer-events-auto">
              <Link 
                href="/hajj-umrah" 
                className="inline-flex items-center justify-center gap-2 btn-outline-white px-8 py-4 rounded-xl text-sm font-bold hover:bg-white/10 transition-all group shadow-sm"
              >
                عرض كافة الباقات والبرامج
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>

          </div>
        </section>

        {/* ============ AGENCIES SECTION ============ */}
        <section className="py-28 bg-[#040a1b]/40 backdrop-blur-md border-t border-navy-900/40" id="agencies">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <AnimatedSection className="text-center mb-16 pointer-events-auto" direction="down">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                خدماتنا المميزة
              </h2>
              <p className="text-gray-450 max-w-2xl mx-auto text-base sm:text-lg font-light">نقدم مجموعة متكاملة من الخدمات لتلبية جميع احتياجاتك</p>
            </AnimatedSection>

            <div className="pointer-events-auto">
              <AnimatedSection delay={0.1}>
                <AgenciesCarousel agencies={agencies} />
              </AnimatedSection>
              
              <AnimatedSection delay={0.2} className="mt-12 text-center">
                <Link 
                  href="/agencies" 
                  className="inline-flex items-center justify-center gap-2 btn-outline-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-white/10 transition-all group"
                >
                  تصفح جميع المكاتب المعتمدة
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </AnimatedSection>
            </div>
            
          </div>
        </section>

        {/* ============ STATS BAR ============ */}
        <section className="py-16 bg-[#020617]/80 backdrop-blur-sm relative overflow-hidden border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pointer-events-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: ThumbsUp, value: "98%", label: "نسبة رضا العملاء" },
                { icon: BadgeCheck, value: "+50K", label: "عميل سعيد بالخدمات" },
                { icon: Award, value: "+10", label: "سنوات خبرة وعطاء" },
                { icon: Building2, value: "+100", label: "شريك ووكيل معتمد" }
              ].map((stat, idx) => (
                <AnimatedSection key={idx} delay={idx * 0.05} className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <stat.icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-gold-400 mb-1">{stat.value}</div>
                  <div className="text-gray-300 text-xs sm:text-sm font-semibold">{stat.label}</div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ============ TESTIMONIALS ============ */}
        <section className="py-28 bg-[#040a1b]/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <AnimatedSection className="text-center mb-20 pointer-events-auto" direction="down">
              <span className="text-gold-500 text-xs sm:text-sm font-extrabold tracking-widest uppercase bg-gold-500/10 px-3.5 py-1.5 rounded-full border border-gold-500/20">آراء المعتمرين</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
                ثقة نعتز ونفخر <span className="text-gradient-gold">بها دائماً</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base font-light">تجارب إيمانية واقعية يرويها ضيوف الرحمن الذين تشرفنا بتسهيل وتيسير نسكهم.</p>
            </AnimatedSection>

            <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "أحمد عبدالله بن شجاع",
                  location: "صنعاء",
                  text: "تنظيم متميز للغاية وخدمات راقية جداً في السكن والمواصلات. الفندق كان قريباً جداً من الحرم والتعامل في غاية الاحترام والتقدير.",
                  rating: 5,
                },
                {
                  name: "د. فاطمة محمد الصبري",
                  location: "تعز",
                  text: "أفضل منصة حجز تعاملت معها على الإطلاق. دقة متناهية في المواعيد وسرعة إنجاز التأشيرات وتجاوب دائم طوال فترة الإقامة في مكة والمدينة.",
                  rating: 5,
                },
                {
                  name: "سالم بن ناصر العتيبي",
                  location: "عدن",
                  text: "رحلة عمرة إيمانية مريحة وناجحة تيسر لنا فيها كل شيء. أشكر المكاتب المشتركة على جهودهم الحثيثة في رعاية المعتمرين وتأمين راحتهم.",
                  rating: 5,
                },
              ].map((review, idx) => (
                <AnimatedSection key={review.name} delay={idx * 0.1}>
                  <div className="bg-[#081126]/60 backdrop-blur-xl p-8 rounded-2xl h-full flex flex-col border border-navy-800/40 relative">
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gold-400" fill="currentColor" />
                      ))}
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-8 flex-1 italic text-base font-light">
                      &ldquo;{review.text}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 border-t border-navy-800/40 pt-5 mt-auto">
                      <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{review.name}</h4>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gold-450" />
                          {review.location}
                        </p>
                      </div>
                      <span title="عميل موثق" className="mr-auto flex-shrink-0">
                        <BadgeCheck className="w-5 h-5 text-emerald-400" />
                      </span>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="py-24 bg-[#020617]/90 relative overflow-hidden text-center border-t border-white/5 pointer-events-auto">
          <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" direction="up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
              ابدأ رحلتك المباركة اليوم بكل <span className="text-gradient-gold">يسر وطمأنينة</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              دع لنا عناء التخطيط وإجراءات التأشيرة والسكن، وتفرغ كلياً للعبادة والتقرب إلى الله.
            </p>
            <div className="flex justify-center">
              <Link 
                href="/book" 
                className="btn-gold px-12 py-4.5 rounded-xl text-base font-bold shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                احجز رحلتك الآن
              </Link>
            </div>
          </AnimatedSection>
        </section>

        {/* Footer */}
        <div className="pointer-events-auto">
          <Footer />
        </div>

      </div>
    </main>
  );
}
