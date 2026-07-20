"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Phone, Globe, Briefcase, Users,
  Calendar, CheckCircle, Loader2,
  Star, ArrowLeft, ArrowRight, Shield, Clock, HeartHandshake,
  AlertCircle, Building2
} from "lucide-react";

/* ─── Constants ─── */
const steps = [
  { label: "المعلومات الشخصية", desc: "بيانات التواصل الأساسية", icon: User },
  { label: "تفاصيل الرحلة", desc: "حدد الخدمة والميزانية", icon: Briefcase },
  { label: "مراجعة وإرسال", desc: "تأكيد البيانات", icon: CheckCircle },
];

const countries = [
  "الجمهورية اليمنية", "مصر", "الأردن", "العراق", "الكويت", "الإمارات",
  "قطر", "البحرين", "عمان", "سوريا", "لبنان", "فلسطين", "ليبيا", "تونس",
  "الجزائر", "المغرب", "السودان", "الصومال", "تركيا", "ماليزيا",
  "إندونيسيا", "باكستان", "الهند", "أخرى",
];

const services = [
  { value: "UMRAH", emoji: "🕌", label: "عمرة", sub: "باقات إيمانية شاملة" },
  { value: "HAJJ", emoji: "🕋", label: "حج", sub: "خدمات كبار الشخصيات" },
  { value: "VISA", emoji: "📄", label: "تأشيرة", sub: "إصدار سريع ومضمون" },
  { value: "TRAVEL", emoji: "✈️", label: "خدمات سفر", sub: "حجوزات واستقبال" },
];

export default function BookPage() {  
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "",
    serviceType: "",
    travelersCount: "1",
    travelDate: "",
    agencyId: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [agencyPhone, setAgencyPhone] = useState("967781668332"); // fallback to platform default
  const [agencies, setAgencies] = useState<{id: string, name: string, contactPhone: string}[]>([]);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field when user types
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  useEffect(() => {
    // 1. Try to load saved form data from local storage
    const savedData = localStorage.getItem("booking_form_data");
    let initialForm = { ...form };
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        initialForm = { ...initialForm, ...parsed };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(initialForm);
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }

    // 2. Override service type and agency if present in URL
    const searchParams = new URLSearchParams(window.location.search);
    const t = searchParams.get("type");
    const aId = searchParams.get("agencyId");
    
    if (t) {
      setForm((prev) => ({ ...prev, serviceType: t }));
    }
    if (aId) {
      setForm((prev) => ({ ...prev, agencyId: aId }));
      fetch(`/api/agencies/${aId}`)
        .then(res => res.json())
        .then(data => {
          if (data.contactPhone) setAgencyPhone(data.contactPhone);
        })
        .catch(console.error);
    }

    // Fetch public agencies
    fetch("/api/agencies")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAgencies([
            { id: "MAIN", name: "الإدارة الرئيسية - رحلات النور", contactPhone: "967781668332" },
            ...data
          ]);
        }
      })
      .catch(console.error);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save form data to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("booking_form_data", JSON.stringify(form));
  }, [form]);

  // Strict Validation before advancing steps
  const handleNextStep = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (step === 0) {
      if (!form.name || form.name.length < 3) {
        newErrors.name = "يرجى إدخال الاسم الكامل بشكل صحيح";
        isValid = false;
      }
      if (!form.phone || form.phone.length < 6) {
        newErrors.phone = "يرجى إدخال رقم هاتف صحيح للتواصل";
        isValid = false;
      }
      if (!form.country) {
        newErrors.country = "يرجى اختيار الدولة";
        isValid = false;
      }
    } else if (step === 1) {
      if (!form.serviceType) {
        newErrors.serviceType = "يرجى اختيار نوع الخدمة";
        isValid = false;
      }
      if (!form.travelDate) {
        newErrors.travelDate = "يرجى تحديد تاريخ السفر المتوقع";
        isValid = false;
      }
      if (!form.travelersCount || parseInt(form.travelersCount) < 1) {
        newErrors.travelersCount = "عدد الأشخاص يجب أن يكون 1 على الأقل";
        isValid = false;
      }
      if (!form.agencyId) {
        newErrors.agencyId = "يرجى اختيار المكتب المفضل للحجز";
        isValid = false;
      }
    }

    if (isValid) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = { ...form, agencyId: form.agencyId === "MAIN" ? null : form.agencyId };
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsSuccess(true);
        // Build WhatsApp Message for the Project Manager
        const serviceName = services.find(s => s.value === form.serviceType)?.label || form.serviceType;
        const text = `مرحباً، لدي طلب حجز جديد عبر الموقع 🌟\n\n👤 الاسم: ${form.name}\n📞 الهاتف: ${form.phone}\n🌍 الدولة: ${form.country}\n🕋 الخدمة المطلوبة: ${serviceName}\n👥 عدد الأشخاص: ${form.travelersCount}\n📅 تاريخ السفر: ${form.travelDate}\n\nأرجو التواصل معي لتأكيد الحجز.`;
        const encodedText = encodeURIComponent(text);
        const selectedAgency = agencies.find(a => a.id === form.agencyId);
        const phone = selectedAgency?.contactPhone || "967781668332";
        setAgencyPhone(phone); // Update for success screen
        const waUrl = `https://wa.me/${phone}?text=${encodedText}`;
        
        // Clear local storage on success
        localStorage.removeItem("booking_form_data");
        
        // Redirect immediately to WhatsApp
        window.open(waUrl, "_blank");
      }
      else {
        const errorData = await res.json();
        alert(`فشل الإرسال: ${errorData.error || "يرجى التحقق من صحة البيانات والمحاولة مجدداً."}`);
      }
    } catch {
      alert("تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Success Screen ── */
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(212,175,55,0.3)]">
          <CheckCircle className="w-12 h-12 text-navy-900" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
          تم استلام طلبك <span className="text-gradient-gold">بنجاح!</span>
        </h1>
        <p className="text-navy-300 text-lg mb-10 max-w-md leading-relaxed">
          شكراً لثقتك بنا يا {form.name.split(" ")[0]}. سيتم تحويلك مباشرة للواتساب لإرسال تفاصيل طلبك للمكتب المختص لتأكيد الحجز.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/" className="btn-gold px-8 py-3.5 rounded-xl font-bold">
            العودة للرئيسية
          </Link>
          <a href={`https://wa.me/${agencyPhone}`} target="_blank" rel="noreferrer" className="px-8 py-3.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
            مراسلة المكتب مباشرة
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col relative overflow-hidden">
      
      {/* Background Image & Pattern Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=1600&q=90" 
          alt="مكة المكرمة" 
          className="w-full h-full object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/95 to-navy-950" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-40 bg-navy-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg">
              <Star className="w-5 h-5 text-navy-900" fill="currentColor" />
            </div>
            <span className="font-black text-white text-lg font-serif">
              رحلات <span className="text-gradient-gold">النور</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <a href="tel:+967781668332" className="hidden sm:flex items-center gap-2 text-sm font-medium text-navy-300 hover:text-gold-400 transition-colors">
              <Phone className="w-4 h-4" />
              967781668332+
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 min-h-[calc(100vh-72px)] relative z-10">
        <div className="w-full max-w-2xl">
          
          {/* Header Texts */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gold-500/20 blur-3xl rounded-full" />
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight relative z-10">
              احجز رحلتك <span className="text-gradient-gold">الآن</span>
            </h1>
            <p className="text-gold-100 text-sm sm:text-base max-w-lg mx-auto relative z-10 font-medium">
              خطوات بسيطة تفصلك عن تجربة سفر فاخرة لا تُنسى
            </p>
          </div>

          {/* ── Step Indicators (Progress) ── */}
          <div className="mb-10 relative">
            {/* Connecting Line */}
            <div className="absolute top-6 left-8 right-8 h-1 bg-navy-800 rounded-full -z-10">
              <div 
                className="h-full bg-gradient-to-l from-gold-400 to-gold-600 rounded-full transition-all duration-500"
                style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between relative z-10">
              {steps.map((s, i) => {
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <div key={i} className="flex flex-col items-center bg-navy-950 px-2 sm:px-3 relative">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative z-10
                      ${isActive ? 'bg-gradient-to-br from-gold-400 to-gold-600 border-gold-300 text-navy-900 shadow-[0_0_30px_rgba(212,175,55,0.4)] sm:scale-110' 
                      : isDone ? 'bg-gold-500/20 border-gold-500 text-gold-400' 
                      : 'bg-navy-900 border-navy-700 text-navy-500'}`}
                    >
                      {isDone ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : <s.icon className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </div>
                    <div className="mt-4 text-center hidden sm:block">
                      <p className={`text-sm font-bold transition-colors ${isActive ? 'text-gold-400' : isDone ? 'text-white' : 'text-navy-500'}`}>{s.label}</p>
                      <p className="text-xs text-navy-400 mt-1">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Form Card ── */}
          <div className="glass-dark rounded-3xl border border-gold-500/30 shadow-[0_20px_50px_rgba(212,175,55,0.05)] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Card Header */}
            <div className="px-6 sm:px-10 py-6 border-b border-gold-500/20 bg-gradient-to-r from-navy-900/50 via-navy-800/50 to-navy-900/50 relative z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                {(() => { const Icon = steps[step].icon; return <Icon className="w-6 h-6 text-gold-400 drop-shadow-md" />; })()}
                {steps[step].label}
              </h2>
            </div>

            {/* Card Body */}
            <div className="p-6 sm:p-10">
              
              {/* STEP 0: Personal Info */}
              {step === 0 && (
                <div className="flex flex-col gap-7 relative z-10">
                  {/* Name Field */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-gold-400" /> الاسم الكامل <span className="text-gold-500">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="الاسم الرباعي كما في الجواز"
                        className={`w-full px-6 min-h-[64px] rounded-xl border bg-navy-950/50 backdrop-blur-sm text-white text-lg font-bold outline-none transition-all placeholder:text-navy-400 placeholder:font-medium
                          ${errors.name ? 'border-red-500/50 focus:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gold-500/30 focus:border-gold-400 focus:bg-navy-900 focus:ring-1 focus:ring-gold-400 hover:border-gold-500/50 shadow-inner'}`}
                      />
                    </div>
                    {errors.name && <p className="flex items-center gap-1.5 text-red-400 text-sm mt-1"><AlertCircle className="w-4 h-4" /> {errors.name}</p>}
                  </div>

                  {/* Phone Field */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-bold text-white flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gold-400" /> رقم الهاتف (واتساب) <span className="text-gold-500">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+967 7XX XXX XXX"
                        dir="ltr"
                        className={`w-full px-6 min-h-[64px] rounded-xl border bg-navy-950/50 backdrop-blur-sm text-white text-right text-lg font-bold outline-none transition-all placeholder:text-navy-400 placeholder:font-medium
                          ${errors.phone ? 'border-red-500/50 focus:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gold-500/30 focus:border-gold-400 focus:bg-navy-900 focus:ring-1 focus:ring-gold-400 hover:border-gold-500/50 shadow-inner'}`}
                      />
                    </div>
                    {errors.phone && <p className="flex items-center gap-1.5 text-red-400 text-sm mt-1"><AlertCircle className="w-4 h-4" /> {errors.phone}</p>}
                  </div>

                  {/* Country Field */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gold-400" /> الدولة <span className="text-gold-500">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        value={form.country}
                        onChange={(e) => update("country", e.target.value)}
                        className={`w-full px-6 min-h-[64px] rounded-xl border bg-navy-950/50 backdrop-blur-sm text-white text-lg font-bold outline-none appearance-none transition-all
                          ${errors.country ? 'border-red-500/50 focus:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gold-500/30 focus:border-gold-400 focus:bg-navy-900 focus:ring-1 focus:ring-gold-400 hover:border-gold-500/50 shadow-inner'}`}
                      >
                        <option value="" disabled className="text-navy-400">اختر بلد الإقامة...</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {errors.country && <p className="flex items-center gap-1.5 text-red-400 text-sm mt-1"><AlertCircle className="w-4 h-4" /> {errors.country}</p>}
                  </div>
                </div>
              )}

              {/* STEP 1: Trip Details */}
              {step === 1 && (
                <div className="flex flex-col gap-7 relative z-10">
                  {/* Service Selection */}
                  <div className="flex flex-col gap-2.5">
                    <label className="text-sm font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gold-400" /> نوع الخدمة المطلوبة <span className="text-gold-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {services.map(s => (
                        <button
                          key={s.value}
                          onClick={() => update("serviceType", s.value)}
                          className={`p-5 rounded-2xl border-2 text-right flex items-center gap-4 transition-all min-h-[90px]
                            ${form.serviceType === s.value 
                              ? 'border-gold-400 bg-gradient-to-r from-gold-500/20 to-gold-500/5 shadow-[0_0_20px_rgba(212,175,55,0.15)] scale-[1.02]' 
                              : 'border-gold-500/20 bg-navy-950/50 hover:border-gold-400/50 hover:bg-navy-900/50'}`}
                        >
                          <span className="text-4xl leading-none flex-none drop-shadow-md">{s.emoji}</span>
                          <div className="flex-1">
                            <p className="font-bold text-white text-lg leading-tight mb-1.5">{s.label}</p>
                            <p className="text-sm text-gold-100/70 leading-snug">{s.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.serviceType && <p className="flex items-center gap-1.5 text-red-400 text-sm mt-1"><AlertCircle className="w-4 h-4" /> {errors.serviceType}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Date */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-sm font-bold text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold-400" /> تاريخ السفر المتوقع <span className="text-gold-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={form.travelDate}
                        onChange={(e) => update("travelDate", e.target.value)}
                        className={`w-full px-6 min-h-[64px] rounded-xl border bg-navy-950/50 backdrop-blur-sm text-white text-lg font-bold outline-none transition-all
                          ${errors.travelDate ? 'border-red-500/50 focus:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gold-500/30 focus:border-gold-400 focus:bg-navy-900 focus:ring-1 focus:ring-gold-400 hover:border-gold-500/50 shadow-inner'}`}
                      />
                      {errors.travelDate && <p className="flex items-center gap-1.5 text-red-400 text-sm mt-1"><AlertCircle className="w-4 h-4" /> {errors.travelDate}</p>}
                    </div>

                    {/* Travelers Count */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-sm font-bold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-gold-400" /> عدد الأشخاص <span className="text-gold-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={form.travelersCount}
                        onChange={(e) => update("travelersCount", e.target.value)}
                        className={`w-full px-6 min-h-[64px] rounded-xl border bg-navy-950/50 backdrop-blur-sm text-white text-lg font-bold outline-none transition-all
                          ${errors.travelersCount ? 'border-red-500/50 focus:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gold-500/30 focus:border-gold-400 focus:bg-navy-900 focus:ring-1 focus:ring-gold-400 hover:border-gold-500/50 shadow-inner'}`}
                      />
                      {errors.travelersCount && <p className="flex items-center gap-1.5 text-red-400 text-sm mt-1"><AlertCircle className="w-4 h-4" /> {errors.travelersCount}</p>}
                    </div>

                    {/* Agency Selection */}
                    <div className="flex flex-col gap-2.5 sm:col-span-2">
                      <label className="text-sm font-bold text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gold-400" /> اختيار المكتب <span className="text-gold-500">*</span>
                      </label>
                      <select
                        value={form.agencyId}
                        onChange={(e) => update("agencyId", e.target.value)}
                        className={`w-full px-6 min-h-[64px] rounded-xl border bg-navy-950/50 backdrop-blur-sm text-white text-lg font-bold outline-none appearance-none transition-all
                          ${errors.agencyId ? 'border-red-500/50 focus:border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gold-500/30 focus:border-gold-400 focus:bg-navy-900 focus:ring-1 focus:ring-gold-400 hover:border-gold-500/50 shadow-inner'}`}
                      >
                        <option value="" disabled className="text-navy-400">اختر المكتب الذي تفضله للحجز...</option>
                        {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                      {errors.agencyId && <p className="flex items-center gap-1.5 text-red-400 text-sm mt-1"><AlertCircle className="w-4 h-4" /> {errors.agencyId}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Review */}
              {step === 2 && (
                <div className="flex flex-col gap-8">
                  <div className="bg-navy-950 rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
                    
                    <div className="p-6 sm:p-8 flex flex-col gap-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider">المعلومات الشخصية</h3>
                        <button onClick={() => setStep(0)} className="text-xs font-bold text-navy-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg">تعديل</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-semibold text-navy-500">الاسم الكامل</p>
                          <p className="text-base font-bold text-white break-words">{form.name}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-semibold text-navy-500">رقم الهاتف</p>
                          <p className="text-base font-bold text-white break-words" dir="ltr">{form.phone}</p>
                        </div>
                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <p className="text-xs font-semibold text-navy-500">الدولة</p>
                          <p className="text-base font-bold text-white break-words">{form.country}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex flex-col gap-6 bg-white/[0.02]">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider">تفاصيل الرحلة</h3>
                        <button onClick={() => setStep(1)} className="text-xs font-bold text-navy-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg">تعديل</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-semibold text-navy-500">الخدمة</p>
                          <p className="text-base font-bold text-white break-words">{services.find(s => s.value === form.serviceType)?.label}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-semibold text-navy-500">تاريخ السفر</p>
                          <p className="text-base font-bold text-white break-words">{form.travelDate}</p>
                        </div>
                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <p className="text-xs font-semibold text-navy-500">العدد</p>
                          <p className="text-base font-bold text-white break-words">{form.travelersCount} مسافر</p>
                        </div>
                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <p className="text-xs font-semibold text-navy-500">المكتب المختار</p>
                          <p className="text-base font-bold text-white break-words">
                            {form.agencyId ? agencies.find(a => a.id === form.agencyId)?.name : "غير محدد"}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                  
                  <p className="text-center text-sm font-medium text-navy-400 leading-relaxed max-w-md mx-auto">
                    بالضغط على تأكيد، أنت توافق على <Link href="/terms" className="text-gold-400 hover:underline">الشروط والأحكام</Link> و <Link href="/privacy" className="text-gold-400 hover:underline">الخصوصية</Link>.
                  </p>
                </div>
              )}

            </div>

            {/* Card Footer Actions */}
            <div className="px-6 sm:px-10 py-6 border-t border-white/5 bg-navy-950 flex items-center justify-between gap-4">
              {step > 0 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3.5 rounded-xl border border-white/10 text-navy-300 hover:text-white hover:bg-white/5 text-sm font-bold transition-all flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  رجوع
                </button>
              ) : (
                <div /> // Placeholder to push Next button to right
              )}

              {step < 2 ? (
                <button
                  onClick={handleNextStep}
                  className="btn-gold px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 ml-auto shadow-[0_5px_20px_rgba(212,175,55,0.2)]"
                >
                  الخطوة التالية
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-gold px-10 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 ml-auto shadow-[0_5px_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> جاري الإرسال...</>
                  ) : (
                    <><CheckCircle className="w-4 h-4" /> تأكيد وإرسال</>
                  )}
                </button>
              )}
            </div>
            
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2 text-navy-400 text-sm">
              <Shield className="w-4 h-4 text-gold-400" />
              <span>بيانات مشفرة وآمنة</span>
            </div>
            <div className="flex items-center gap-2 text-navy-400 text-sm">
              <Clock className="w-4 h-4 text-gold-400" />
              <span>رد سريع خلال 15 دقيقة</span>
            </div>
            <div className="flex items-center gap-2 text-navy-400 text-sm">
              <HeartHandshake className="w-4 h-4 text-gold-400" />
              <span>أسعار واضحة بلا رسوم خفية</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
