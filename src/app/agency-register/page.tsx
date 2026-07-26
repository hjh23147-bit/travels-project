"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, User, Mail, Phone, CheckCircle, ArrowRight, Loader2, Star, Shield } from "lucide-react";

export default function AgencyRegisterPage() {
  const [form, setForm] = useState({
    agencyName: "",
    ownerName: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(212,175,55,0.3)]">
          <CheckCircle className="w-12 h-12 text-navy-900" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
          تم استلام طلب الانضمام <span className="text-gold-400">بنجاح!</span>
        </h1>
        <p className="text-navy-300 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          شكراً لاهتمامك بالانضمام إلى شبكة وكلاء "رحلات النور". سيقوم فريقنا بمراجعة طلبك والتواصل معك قريباً لتفعيل حساب مكتبك.
        </p>
        <Link href="/" className="btn-gold px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 mx-auto">
          العودة للرئيسية
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/95 to-navy-950" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      <header className="sticky top-0 z-40 bg-navy-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
              <Star className="w-5 h-5 text-navy-900" fill="currentColor" />
            </div>
            <span className="font-black text-white text-lg font-serif">
              رحلات <span className="text-gold-400">النور</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              سجل مكتبك <span className="text-gold-400">معنا</span>
            </h1>
            <p className="text-navy-300 text-sm sm:text-base max-w-lg mx-auto">
              انضم إلى أكبر منصة لحجوزات الحج والعمرة، وابدأ في إدارة باقاتك وطلبات عملائك بسهولة واحترافية.
            </p>
          </div>

          <div className="glass-dark rounded-3xl border border-gold-500/20 shadow-xl overflow-hidden p-6 sm:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-gold-400" /> اسم المكتب / الوكالة <span className="text-gold-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.agencyName}
                  onChange={(e) => setForm({ ...form, agencyName: e.target.value })}
                  placeholder="الاسم الرسمي للمكتب"
                  className="w-full px-5 py-3.5 rounded-xl bg-navy-900/50 border border-navy-700 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gold-400" /> اسم المسؤول <span className="text-gold-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.ownerName}
                  onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  placeholder="اسم الشخص المسؤول للتواصل"
                  className="w-full px-5 py-3.5 rounded-xl bg-navy-900/50 border border-navy-700 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-gold-400" /> البريد الإلكتروني <span className="text-gold-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="agency@example.com"
                    className="w-full px-5 py-3.5 rounded-xl bg-navy-900/50 border border-navy-700 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all text-left"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gold-400" /> رقم الهاتف <span className="text-gold-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+966 5X XXX XXXX"
                    className="w-full px-5 py-3.5 rounded-xl bg-navy-900/50 border border-navy-700 text-white focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none transition-all text-left"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 transition-all"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> جاري الإرسال...</>
                  ) : (
                    <><CheckCircle className="w-5 h-5" /> إرسال طلب الانضمام</>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-navy-400 text-sm">
            <Shield className="w-4 h-4 text-gold-400" />
            <span>بياناتك مشفرة ومحفوظة بأمان.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
