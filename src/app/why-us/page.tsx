import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import Link from "next/link";
import { Shield, Award, Users, Clock, Star, CheckCircle2, X, HeartHandshake, Eye, Headphones, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لماذا نحن | رحلات النور",
  description: "اكتشف ما يميز رحلات النور عن غيرها: شفافية مطلقة، خبرة طويلة، ومتابعة على مدار الساعة.",
};

export default function WhyUsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Values */}
      <section className="pt-32 pb-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "شفافية مطلقة",
                desc: "لا رسوم مخفية ولا مفاجآت. كل التفاصيل واضحة من البداية: الأسعار، الفنادق، المواصلات، وكل ما تحتاج معرفته قبل الحجز.",
                highlight: "سياسة \"ما تراه هو ما تحصل عليه\"",
              },
              {
                icon: Award,
                title: "خبرة عميقة",
                desc: "أكثر من 15 عاماً من الخبرة في خدمة ضيوف الرحمن. فريقنا يعرف كل التفاصيل الدقيقة التي تجعل رحلتك مثالية.",
                highlight: "خدمنا أكثر من 10,000 حاج ومعتمر",
              },
              {
                icon: Headphones,
                title: "دعم متواصل 24/7",
                desc: "فريق دعم متخصص متواجد على مدار الساعة. من لحظة الحجز حتى عودتك بسلام، نحن معك في كل خطوة.",
                highlight: "متوسط وقت الاستجابة: أقل من 5 دقائق",
              },
              {
                icon: Eye,
                title: "متابعة دقيقة",
                desc: "نتابع كل تفاصيل رحلتك: تأكيد الحجوزات، متابعة التأشيرات، التنسيق مع الفنادق، وترتيب المواصلات.",
                highlight: "تحديثات فورية عبر واتساب",
              },
              {
                icon: HeartHandshake,
                title: "أسعار عادلة",
                desc: "نقدم أفضل قيمة مقابل السعر. باقاتنا مصممة لتوفير أعلى جودة خدمة بأسعار تنافسية تناسب الجميع.",
                highlight: "خطط تقسيط بدون فوائد",
              },
              {
                icon: Users,
                title: "مرشدون متميزون",
                desc: "مرشدون دينيون ومرافقون إداريون مؤهلون وذوو خبرة واسعة في خدمة الحجاج والمعتمرين.",
                highlight: "مرشدون معتمدون من وزارة الحج",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card-luxury rounded-2xl p-8 border border-white/5 hover:border-gold-500/30 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-5 group-hover:bg-gold-500/20 transition-colors border border-gold-500/20">
                  <item.icon className="w-7 h-7 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-navy-300 leading-relaxed mb-4">{item.desc}</p>
                <div className="bg-gold-500/10 rounded-xl px-4 py-2.5 border border-gold-500/20">
                  <p className="text-xs font-bold text-gold-400">✨ {item.highlight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">
              مقارنة مع <span className="text-gradient-gold">المنافسين</span>
            </h2>
            <p className="text-navy-300 text-sm">شاهد الفرق بنفسك</p>
          </div>

          <div className="bg-navy-800/50 rounded-3xl shadow-lg border border-white/5 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-navy-950">
                  <th className="px-6 py-4 text-right text-sm font-bold text-white">الميزة</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gold-400">رحلات النور</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-navy-400">المنافسون</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "شفافية الأسعار", us: true, them: false },
                  { feature: "دعم على مدار الساعة", us: true, them: false },
                  { feature: "مرشد ديني مرافق", us: true, them: false },
                  { feature: "ضمان استرداد المبلغ", us: true, them: false },
                  { feature: "مساعد ذكي فوري", us: true, them: false },
                  { feature: "فنادق مطلة على الحرم", us: true, them: true },
                  { feature: "تقسيط بدون فوائد", us: true, them: false },
                  { feature: "تقييم عملاء 4.9/5", us: true, them: false },
                ].map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-navy-800/20" : "bg-transparent"}>
                    <td className="px-6 py-4 text-sm font-semibold text-white">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.them ? (
                        <CheckCircle2 className="w-5 h-5 text-navy-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 hero-gradient pattern-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "10,000+", label: "عميل سعيد" },
              { value: "15+", label: "سنة خبرة" },
              { value: "4.9/5", label: "تقييم العملاء" },
              { value: "99%", label: "نسبة الرضا" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-gradient-gold mb-2">{stat.value}</div>
                <div className="text-sm text-navy-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            جاهز لتجربة <span className="text-gradient-gold">الفرق</span>؟
          </h2>
          <p className="text-navy-300 mb-8">
            انضم لآلاف العملاء الذين اختاروا رحلات النور واحجز رحلتك الإيمانية الآن
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 btn-gold px-10 py-4 rounded-2xl text-base font-bold shadow-xl"
          >
            احجز رحلتك الآن
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
      <AIChat />
    </main>
  );
}
