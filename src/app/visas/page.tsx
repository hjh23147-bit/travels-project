"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import { useState } from "react";
import Link from "next/link";
import { FileCheck, Globe, Clock, CheckCircle, AlertCircle, Loader2, Phone, BadgeCheck, ArrowLeft } from "lucide-react";

const visaTypes = [
  {
    id: "umrah-visa",
    title: "تأشيرة عمرة إلكترونية",
    price: "750 ريال",
    duration: "خلال 24 ساعة",
    badge: "الأسرع",
    badgeColor: "bg-emerald-500",
    desc: "استخراج تأشيرة العمرة الإلكترونية المعتمدة من وزارة الأوقاف والإرشاد اليمنية.",
    image: "https://images.unsplash.com/photo-1565552645632-d725e8bfc19a?w=800&q=80",
    requirements: [
      "جواز سفر ساري المفعول لمدة لا تقل عن 6 أشهر",
      "صورة شخصية حديثة بخلفية بيضاء",
      "شهادة تطعيم (حسب الدولة)",
    ],
  },
  {
    id: "tourist-visa",
    title: "تأشيرة سياحية متعددة الدخول",
    price: "900 ريال",
    duration: "3-5 أيام عمل",
    badge: "الأوفر",
    badgeColor: "bg-gold-500",
    desc: "تأشيرة صالحة لمدة عام كامل تتيح دخولاً متعدداً للمملكة وأداء العمرة.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    requirements: [
      "جواز سفر ساري المفعول لمدة لا تقل عن 6 أشهر",
      "تأشيرة/إقامة سارية في دول الخليج أو شنغن أو أمريكا (في بعض الحالات)",
      "تأمين طبي سياحي داخل المملكة",
    ],
  },
  {
    id: "hajj-visa",
    title: "تأشيرة حج رسمية",
    price: "ضمن باقة الحج",
    duration: "حسب الموسم",
    badge: "حصري",
    badgeColor: "bg-navy-700",
    desc: "تأشيرة الحج الرسمية المعتمدة من الجهات المختصة، متضمنة في باقات الحج.",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80",
    requirements: [
      "جواز سفر ساري المفعول",
      "صورة شخصية حديثة",
      "شهادة تطعيم الحمى الشوكية",
      "الحجز ضمن إحدى باقات الحج المعتمدة",
    ],
  },
];

export default function VisasPage() {
  const [eligibility, setEligibility] = useState({
    nationality: "",
    hasPassport: "",
    passportExpiry: "",
  });
  const [result, setResult] = useState<null | { eligible: boolean; message: string }>(null);
  const [checking, setChecking] = useState(false);

  const checkEligibility = () => {
    setChecking(true);
    setTimeout(() => {
      const hasValidPassport = eligibility.hasPassport === "yes";
      const expiryDate = new Date(eligibility.passportExpiry);
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      const isValidExpiry = expiryDate > sixMonthsLater;

      if (hasValidPassport && isValidExpiry && eligibility.nationality) {
        setResult({ eligible: true, message: "مبروك! أنت مؤهل للحصول على تأشيرة العمرة أو التأشيرة السياحية. تواصل معنا الآن لبدء الإجراءات." });
      } else if (!hasValidPassport) {
        setResult({ eligible: false, message: "يجب أن يكون لديك جواز سفر ساري المفعول للتقديم على التأشيرة." });
      } else {
        setResult({ eligible: false, message: "يجب أن يكون جواز السفر ساري المفعول لمدة 6 أشهر على الأقل من تاريخ السفر." });
      }
      setChecking(false);
    }, 1500);
  };

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
                  التأشيرات
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-navy-900 leading-tight">
                خدمات <span className="text-gradient-gold">التأشيرات</span>
              </h1>
              <p className="text-navy-500 mt-2 text-sm sm:text-base max-w-xl">
                نقدم لك أسهل وأسرع الطرق لاستخراج تأشيرات العمرة والسياحة والحج بضمان الموثوقية والسرعة في الإنجاز.
              </p>
            </div>
            <a
              href="tel:+967781668332"
              className="flex items-center gap-2 bg-navy-900 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-navy-800 transition-colors shrink-0 shadow-sm"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              استشارة مجانية
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { value: "٢٤ ساعة", label: "أسرع إنجاز تأشيرة" },
              { value: "١٠٠٪", label: "ضمان القبول" },
              { value: "+٥٠٠٠", label: "تأشيرة منجزة" },
            ].map((stat, i) => (
              <div key={i} className="bg-navy-50 rounded-2xl p-4 text-center border border-navy-100/50">
                <p className="text-2xl font-black text-navy-900">{stat.value}</p>
                <p className="text-xs text-navy-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visa Cards ── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {visaTypes.map((visa) => (
              <div
                key={visa.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:border-gold-200 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="h-48 w-full relative overflow-hidden">
                  <img
                    src={visa.image}
                    alt={visa.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className={`text-white text-xs font-black px-3 py-1 rounded-full ${visa.badgeColor}`}>
                      {visa.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-gold-400" />
                    <h3 className="text-base font-bold text-white">{visa.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-navy-500 leading-relaxed mb-5 font-light">{visa.desc}</p>

                  {/* Price & Duration */}
                  <div className="flex items-center gap-4 mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-gold-500" />
                      <span className="font-black text-navy-900">{visa.price}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200" />
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gold-500" />
                      <span className="text-navy-600 font-medium">{visa.duration}</span>
                    </div>
                  </div>

                  {/* Requirements */}
                  <h4 className="text-sm font-bold text-navy-900 mb-3">المتطلبات:</h4>
                  <ul className="space-y-2 mb-6 flex-1">
                    {visa.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-navy-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/book?visaId=${visa.id}&type=VISA`}
                    className="mt-auto btn-gold w-full py-3.5 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2"
                  >
                    قدم طلب الآن
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Eligibility Checker ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold tracking-widest uppercase text-gold-600 bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
              فحص الأهلية
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-4 mb-2">
              تحقق من <span className="text-gradient-gold">أهليتك</span>
            </h2>
            <p className="text-navy-500 text-sm">أجب عن الأسئلة التالية لمعرفة مدى أهليتك للحصول على التأشيرة</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 space-y-5">
            {/* Nationality */}
            <div>
              <label className="block text-sm font-bold text-navy-900 mb-2">جنسيتك</label>
              <select
                value={eligibility.nationality}
                onChange={(e) => setEligibility({ ...eligibility, nationality: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none text-sm text-navy-900"
              >
                <option value="">اختر الجنسية</option>
                {["مصري", "أردني", "عراقي", "كويتي", "إماراتي", "قطري", "بحريني", "عماني", "يمني", "سوري", "لبناني", "فلسطيني", "سوداني", "ليبي", "تونسي", "جزائري", "مغربي", "تركي", "باكستاني", "هندي", "أخرى"].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Has Passport */}
            <div>
              <label className="block text-sm font-bold text-navy-900 mb-2">هل تمتلك جواز سفر ساري المفعول؟</label>
              <div className="flex gap-3">
                {["yes", "no"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setEligibility({ ...eligibility, hasPassport: v })}
                    className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                      eligibility.hasPassport === v
                        ? "border-gold-400 bg-gold-50 text-gold-700"
                        : "border-gray-200 text-navy-500 hover:border-gold-300 bg-gray-50"
                    }`}
                  >
                    {v === "yes" ? "✅ نعم" : "❌ لا"}
                  </button>
                ))}
              </div>
            </div>

            {/* Expiry Date */}
            {eligibility.hasPassport === "yes" && (
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-2">تاريخ انتهاء جواز السفر</label>
                <input
                  type="date"
                  value={eligibility.passportExpiry}
                  onChange={(e) => setEligibility({ ...eligibility, passportExpiry: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none text-sm text-navy-900"
                />
              </div>
            )}

            <button
              onClick={checkEligibility}
              disabled={!eligibility.nationality || !eligibility.hasPassport || checking}
              className="w-full btn-gold py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {checking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                <>
                  <BadgeCheck className="w-4 h-4" />
                  تحقق من أهليتي
                </>
              )}
            </button>

            {result && (
              <div className={`p-4 rounded-2xl flex items-start gap-3 ${result.eligible ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                {result.eligible ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                )}
                <p className={`text-sm font-medium ${result.eligible ? "text-emerald-800" : "text-red-800"}`}>
                  {result.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <AIChat />
    </main>
  );
}
