import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام | رحلات النور",
  description: "الشروط والأحكام الخاصة بخدمات رحلات النور للحج والعمرة والتأشيرات.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="hero-gradient pt-32 pb-16 pattern-overlay">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black text-white mb-3">
            الشروط <span className="text-gradient-gold">والأحكام</span>
          </h1>
          <p className="text-navy-300">آخر تحديث: يناير 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-8 text-navy-700 leading-relaxed text-sm">
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">1. الأحكام العامة</h2>
              <p>باستخدامك لمنصة رحلات النور، فإنك توافق على الالتزام بهذه الشروط والأحكام. تحتفظ رحلات النور بحق تعديل هذه الشروط في أي وقت مع إشعارك بذلك.</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">2. الحجز والدفع</h2>
              <ul className="list-disc list-inside space-y-1 mr-4">
                <li>يتم تأكيد الحجز بعد سداد الدفعة الأولى أو كامل المبلغ حسب الباقة المختارة.</li>
                <li>الأسعار المعروضة بالريال السعودي وقابلة للتغيير دون إشعار مسبق قبل تأكيد الحجز.</li>
                <li>تتوفر خطط تقسيط مرنة بدون فوائد (حسب الباقة والموسم).</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">3. سياسة الإلغاء والاسترداد</h2>
              <ul className="list-disc list-inside space-y-1 mr-4">
                <li>الإلغاء قبل 30 يوماً: استرداد كامل المبلغ.</li>
                <li>الإلغاء قبل 15-30 يوماً: خصم 20% رسوم إدارية.</li>
                <li>الإلغاء قبل أقل من 15 يوماً: خصم 50% من المبلغ.</li>
                <li>عدم الحضور: لا يتم الاسترداد.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">4. المسؤولية</h2>
              <p>رحلات النور غير مسؤولة عن أي تأخير أو تغيير ناتج عن قرارات حكومية أو ظروف قاهرة (مثل إلغاء رحلات جوية أو تغييرات في أنظمة التأشيرات). في هذه الحالات، نعمل على إيجاد أفضل البدائل الممكنة.</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">5. التزامات العميل</h2>
              <ul className="list-disc list-inside space-y-1 mr-4">
                <li>تقديم معلومات صحيحة ودقيقة عند الحجز.</li>
                <li>الالتزام بمواعيد السفر والتعليمات المقدمة من فريق رحلات النور.</li>
                <li>الالتزام بأنظمة وقوانين الجمهورية اليمنية خلال فترة الرحلة.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">6. القانون المعمول به</h2>
              <p>تخضع هذه الشروط والأحكام لأنظمة وقوانين الجمهورية اليمنية. أي نزاع ينشأ يتم حله ودياً أو عبر الجهات القضائية المختصة في الجمهورية اليمنية.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
