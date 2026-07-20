import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | رحلات النور",
  description: "سياسة الخصوصية الخاصة بمنصة رحلات النور لخدمات الحج والعمرة والتأشيرات.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="hero-gradient pt-32 pb-16 pattern-overlay">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black text-white mb-3">
            سياسة <span className="text-gradient-gold">الخصوصية</span>
          </h1>
          <p className="text-navy-300">آخر تحديث: يناير 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-sm">
          <div className="space-y-8 text-navy-700 leading-relaxed text-sm">
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">1. جمع المعلومات</h2>
              <p>نقوم بجمع المعلومات التي تقدمها لنا طوعاً عند استخدام خدماتنا، بما في ذلك:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 mr-4">
                <li>الاسم الكامل ورقم الهاتف والبريد الإلكتروني</li>
                <li>معلومات جواز السفر (عند التقديم على التأشيرات)</li>
                <li>تفاصيل الرحلة والتفضيلات</li>
                <li>معلومات الدفع (تتم معالجتها عبر بوابات دفع آمنة ومعتمدة)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">2. استخدام المعلومات</h2>
              <p>نستخدم معلوماتك الشخصية للأغراض التالية فقط:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 mr-4">
                <li>معالجة طلبات الحجز والتأشيرات</li>
                <li>التواصل معك بخصوص رحلتك وتحديثاتها</li>
                <li>تحسين خدماتنا وتجربة المستخدم</li>
                <li>إرسال عروض وتحديثات (بموافقتك المسبقة)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">3. حماية المعلومات</h2>
              <p>
                نتخذ إجراءات أمنية مشددة لحماية بياناتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفصاح. نستخدم تشفير SSL/TLS لحماية جميع البيانات المنقولة عبر موقعنا.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">4. مشاركة المعلومات</h2>
              <p>
                لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة، باستثناء ما يلي:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 mr-4">
                <li>الجهات الحكومية المختصة (لإصدار التأشيرات والتصاريح)</li>
                <li>مقدمي الخدمات (الفنادق وشركات الطيران) لإتمام حجوزاتكم</li>
                <li>في حال صدور أمر قضائي</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">5. حقوقك</h2>
              <p>يحق لك في أي وقت:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 mr-4">
                <li>طلب الاطلاع على بياناتك الشخصية المحفوظة لدينا</li>
                <li>طلب تصحيح أو حذف بياناتك</li>
                <li>سحب موافقتك على استخدام بياناتك</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-3">6. التواصل معنا</h2>
              <p>
                لأي استفسارات حول سياسة الخصوصية، يمكنكم التواصل معنا عبر البريد الإلكتروني:
                <strong className="text-gold-600"> info@alnoortravel.com</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
