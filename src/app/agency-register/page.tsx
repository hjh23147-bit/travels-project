"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, User, Mail, Phone, CheckCircle2, ArrowRight, ArrowLeft, 
  Loader2, Star, Shield, FileText, Check, AlertCircle 
} from "lucide-react";
import UploadFile from "@/components/UploadFile";

export default function AgencyRegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    agencyName: "",
    ownerName: "",
    email: "",
    phone: "",
    agencyType: "TRAVEL", // TRAVEL, EMPLOYMENT, BOTH
    commercialRegistry: "",
    taxCertificate: "",
    nationalId: "",
    license: "",
    logo: "",
    additionalDocs: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleNextStep = () => {
    if (step === 1) {
      if (!form.agencyName || !form.ownerName || !form.email || !form.phone) {
        setError("يرجى ملء جميع الحقول الأساسية المطلوبة.");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      if (!form.commercialRegistry || !form.taxCertificate || !form.nationalId || !form.license || !form.logo) {
        setError("يرجى رفع جميع الوثائق المطلوبة للتحقق من هوية المكتب.");
        return;
      }
      setError("");
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/agency-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "حدث خطأ أثناء إرسال الطلب");
      }
    } catch {
      setError("تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#020611] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(212,175,55,0.3)]">
          <CheckCircle2 className="w-12 h-12 text-[#020611]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
          تم استلام طلب الانضمام <span className="text-gold-400">بنجاح!</span>
        </h1>
        <p className="text-gray-300 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          شكرًا لاهتمامك بالانضمام إلى شبكة وكلاء &quot;رحلات النور&quot;. سيقوم فريق العمل بمراجعة الوثائق المرفقة والتواصل معكم عبر البريد لتفعيل حساب المكتب.
        </p>
        <Link href="/" className="bg-white hover:bg-gold-400 hover:text-navy-950 text-black px-10 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]">
          العودة للرئيسية
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020611] flex flex-col relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/95 to-navy-950" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      <header className="sticky top-0 z-40 bg-[#020611]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
              <Star className="w-5 h-5 text-[#020611]" fill="currentColor" />
            </div>
            <span className="font-black text-white text-lg font-serif">
              رحلات <span className="text-gold-400">النور</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              سجل مكتبك <span className="text-gold-400">معنا</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
              انضم إلى أكبر منصة لحجوزات الحج والعمرة والخدمات السياحية وإدارة التوظيف والعمالة.
            </p>
          </div>

          {/* Steps Progress Indicator */}
          <div className="flex justify-between items-center mb-8 max-w-md mx-auto px-4">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm transition-all ${
                step >= 1 ? "bg-gold-500 border-gold-500 text-[#020813] shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "border-gray-700 text-gray-500"
              }`}>
                {step > 1 ? <Check className="w-5 h-5" /> : "١"}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold ${step >= 1 ? "text-gold-400" : "text-gray-500"}`}>البيانات الأساسية</span>
            </div>

            <div className={`flex-1 h-[2px] mx-2 ${step >= 2 ? "bg-gold-500" : "bg-gray-800"}`} />

            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm transition-all ${
                step >= 2 ? "bg-gold-500 border-gold-500 text-[#020813] shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "border-gray-700 text-gray-500"
              }`}>
                {step > 2 ? <Check className="w-5 h-5" /> : "٢"}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold ${step >= 2 ? "text-gold-400" : "text-gray-500"}`}>رفع المستندات والوثائق</span>
            </div>

            <div className={`flex-1 h-[2px] mx-2 ${step >= 3 ? "bg-gold-500" : "bg-gray-800"}`} />

            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-bold text-sm transition-all ${
                step === 3 ? "bg-gold-500 border-gold-500 text-[#020813] shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "border-gray-700 text-gray-500"
              }`}>
                ٣
              </div>
              <span className={`text-[10px] sm:text-xs font-bold ${step === 3 ? "text-gold-400" : "text-gray-500"}`}>المراجعة والإرسال</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden p-6 sm:p-10 border-t-gold-400/20">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold text-center flex items-center gap-2 justify-center">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* STEP 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-white uppercase tracking-wider mb-2 block">
                      اسم المكتب / الوكالة <span className="text-gold-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={form.agencyName}
                        onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                        placeholder="الاسم التجاري الرسمي"
                        className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white uppercase tracking-wider mb-2 block">
                      اسم المدير المسؤول <span className="text-gold-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={form.ownerName}
                        onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                        placeholder="الاسم الكامل لمالك المكتب"
                        className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white uppercase tracking-wider mb-2 block">
                      البريد الإلكتروني <span className="text-gold-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        dir="ltr"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="agency@example.com"
                        className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all text-left text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white uppercase tracking-wider mb-2 block">
                      رقم الهاتف / الجوال <span className="text-gold-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+966 5X XXX XXXX"
                        className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all text-left text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Office Type */}
                <div className="border-t border-white/5 pt-6">
                  <label className="text-xs font-bold text-white uppercase tracking-wider mb-3 block">
                    تصنيف نشاط المكتب <span className="text-gold-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: "TRAVEL", label: "مكتب سياحة وحج وعمرة", desc: "باقات الحج والعمرة والزيارات والسياحة" },
                      { value: "EMPLOYMENT", label: "مكتب عمالة وتوظيف خارجي", desc: "تأشيرات العمل والتعاقدات والتفويض الإلكتروني" },
                      { value: "BOTH", label: "مكتب مشترك (سياحة وتوظيف)", desc: "إدارة متكاملة للخدمات السياحية والتوظيفية معاً" }
                    ].map((type) => (
                      <label 
                        key={type.value} 
                        className={`flex flex-col p-4 rounded-2xl border transition-all cursor-pointer text-right ${
                          form.agencyType === type.value 
                            ? "bg-gold-500/10 border-gold-500 text-white" 
                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="radio"
                          name="agencyType"
                          value={type.value}
                          checked={form.agencyType === type.value}
                          onChange={(e) => setForm({ ...form, agencyType: e.target.value })}
                          className="sr-only"
                        />
                        <span className="font-bold text-sm text-white mb-1">{type.label}</span>
                        <span className="text-[10px] text-gray-400 font-light">{type.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-gold-500 hover:bg-gold-400 text-[#020813] font-bold px-10 py-3.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  >
                    التالي: رفع المستندات الرسمية
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Document Upload */}
            {step === 2 && (
              <div className="space-y-6">
                <p className="text-xs text-gray-400 font-bold border-b border-white/5 pb-3">
                  ملاحظة: يرجى رفع ملفات واضحة وبصيغة PDF للمستندات، وصيغة صورة للشعار للتسريع من وتيرة المراجعة.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UploadFile
                    label="السجل التجاري (Commercial Registration) *"
                    accept="document"
                    value={form.commercialRegistry}
                    onChange={(url) => setForm({ ...form, commercialRegistry: url })}
                  />

                  <UploadFile
                    label="الشهادة الضريبية (Tax Certificate) *"
                    accept="document"
                    value={form.taxCertificate}
                    onChange={(url) => setForm({ ...form, taxCertificate: url })}
                  />

                  <UploadFile
                    label="الهوية الوطنية للمالك (National ID) *"
                    accept="all"
                    value={form.nationalId}
                    onChange={(url) => setForm({ ...form, nationalId: url })}
                  />

                  <UploadFile
                    label="ترخيص مزاولة العمل للمكتب (License) *"
                    accept="document"
                    value={form.license}
                    onChange={(url) => setForm({ ...form, license: url })}
                  />

                  <UploadFile
                    label="شعار المكتب / الهوية البصرية (Logo) *"
                    accept="image"
                    value={form.logo}
                    onChange={(url) => setForm({ ...form, logo: url })}
                  />

                  <UploadFile
                    label="وثائق ومستندات إضافية (اختياري)"
                    accept="all"
                    value={form.additionalDocs}
                    onChange={(url) => setForm({ ...form, additionalDocs: url })}
                  />
                </div>

                <div className="flex justify-between border-t border-white/5 pt-6">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-white/10 hover:bg-white/5 text-white font-bold px-8 py-3.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                    السابق
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-gold-500 hover:bg-gold-400 text-[#020813] font-bold px-10 py-3.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  >
                    التالي: مراجعة البيانات
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Submit */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-sm border-b border-white/5 pb-2">بيانات طلب التسجيل</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block mb-1">اسم المكتب / الوكالة</span>
                      <span className="text-white text-sm font-bold">{form.agencyName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block mb-1">المدير المسؤول</span>
                      <span className="text-white text-sm font-bold">{form.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block mb-1">نوع نشاط المكتب</span>
                      <span className="inline-flex px-3 py-1 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded-lg text-xs font-bold">
                        {form.agencyType === "TRAVEL" 
                          ? "سياحة وسفريات" 
                          : form.agencyType === "EMPLOYMENT" 
                          ? "توظيف وعمالة" 
                          : "مكتب مشترك"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block mb-1">البريد الإلكتروني</span>
                      <span className="text-white text-sm font-semibold font-mono" dir="ltr">{form.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block mb-1">رقم الهاتف</span>
                      <span className="text-white text-sm font-semibold font-mono" dir="ltr">{form.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-bold text-sm border-b border-white/5 pb-2">المستندات المرفقة</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: "السجل التجاري الرسمي", url: form.commercialRegistry },
                      { name: "الشهادة الضريبية المعتمدة", url: form.taxCertificate },
                      { name: "الهوية الوطنية للمالك", url: form.nationalId },
                      { name: "ترخيص مزاولة المهنة", url: form.license },
                      { name: "شعار المكتب", url: form.logo },
                      { name: "وثائق إضافية", url: form.additionalDocs, optional: true }
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileText className="w-5 h-5 text-gold-400 flex-shrink-0" />
                          <span className="text-xs text-white font-bold truncate">{doc.name}</span>
                        </div>
                        {doc.url ? (
                          <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> تم الرفع
                          </span>
                        ) : doc.optional ? (
                          <span className="text-[10px] bg-white/5 text-gray-500 px-2 py-1 rounded-md font-bold">فارغ (اختياري)</span>
                        ) : (
                          <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-1 rounded-md font-bold">غير مكتمل</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between border-t border-white/5 pt-6">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-white/10 hover:bg-white/5 text-white font-bold px-8 py-3.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                    السابق
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-gold-400 to-[#AA7C11] hover:from-gold-300 hover:to-gold-500 text-[#020813] font-bold px-12 py-3.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> جاري التقديم...</>
                    ) : (
                      <><CheckCircle2 className="w-5 h-5" /> تأكيد تقديم طلب الانضمام</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs">
            <Shield className="w-4 h-4 text-gold-500" />
            <span>كافة الملفات والبيانات المسجلة تخضع لسرية تامة ومحفوظة وفق معايير أمنية عالية.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
