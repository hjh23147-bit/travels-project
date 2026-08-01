"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import UploadFile from "@/components/UploadFile";
import { 
  Briefcase, MapPin, DollarSign, Clock, FileText, CheckCircle2, 
  ArrowLeft, Search, Loader2, Send, X, ShieldCheck, AlertCircle 
} from "lucide-react";

interface JobPackageItem {
  id: string;
  title: string;
  description: string;
  requiredDocs: string;
  price: number;
  country: string;
  duration: string;
  status: string;
  agencyId: string;
  agency?: {
    id: string;
    name: string;
    logo: string | null;
  };
  createdAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [selectedJob, setSelectedJob] = useState<JobPackageItem | null>(null);
  
  // Application form states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientPassport, setClientPassport] = useState("");
  const [visaSelection, setVisaSelection] = useState("FREE"); // FREE, BUSINESS, CONTRACT
  const [cvUrl, setCvUrl] = useState("");
  const [passportPhotoUrl, setPassportPhotoUrl] = useState("");
  const [notes, setNotes] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (Array.isArray(data)) setJobs(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  const countries = Array.from(new Set(jobs.map((j) => j.country)));

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredDocs.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry = selectedCountry === "ALL" || job.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!clientName || !clientPhone || !clientPassport || !cvUrl || !passportPhotoUrl) {
      setError("يرجى ملء جميع الحقول ورفع السيرة الذاتية وصورة الجواز للتقديم.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/job-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientPhone,
          clientPassport,
          visaSelection,
          cvUrl,
          passportPhotoUrl,
          notes,
          jobId: selectedJob.id
        })
      });

      if (res.ok) {
        setSuccess(true);
        // reset form
        setClientName("");
        setClientPhone("");
        setClientPassport("");
        setCvUrl("");
        setPassportPhotoUrl("");
        setNotes("");
      } else {
        const data = await res.json();
        setError(data.error || "حدث خطأ أثناء تقديم الطلب");
      }
    } catch {
      setError("تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white" dir="rtl">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 bg-navy-950 text-white overflow-hidden text-center">
        <div className="absolute inset-0 z-0 bg-navy-950">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80" 
            alt="Business Center" 
            className="w-full h-full object-cover scale-105 opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 to-navy-950" />
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 py-1 px-4 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 text-xs font-bold">
            التوظيف والتعاقدات الخارجية الموثوقة
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            ابدأ مسيرتك المهنية بأفضل <span className="text-gradient-gold">فرص العمل الدولية</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            بالتعاون مع أفضل مكاتب التوظيف والعمالة المعتمدة، نسهل لك الحصول على تأشيرات العمل وعقود التوظيف وتفويض العمالة بكل أمان وموثوقية.
          </p>
        </div>
      </section>

      {/* Filter and Job List Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Panel */}
        <div className="bg-white rounded-3xl border border-navy-150 p-6 shadow-sm mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث بالكلمة المفتاحية (مثال: محاسب، طبيب، مهندس)..."
              className="w-full pr-12 pl-4 py-3 rounded-2xl bg-navy-50/40 border border-navy-100 text-sm font-semibold text-navy-900 focus:border-gold-500 outline-none transition-all"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full md:w-56 px-4 py-3 rounded-2xl bg-navy-50/40 border border-navy-100 text-sm font-semibold text-navy-800 focus:border-gold-500 outline-none cursor-pointer"
            >
              <option value="ALL">جميع دول العمل</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <div className="flex justify-center p-16">
            <Loader2 className="w-10 h-10 animate-spin text-gold-500" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-navy-50/30 rounded-3xl border border-dashed border-navy-200">
            <Briefcase className="w-12 h-12 mx-auto text-navy-300 mb-3" />
            <h3 className="text-lg font-bold text-navy-900">لا توجد وظائف معلنة حالياً</h3>
            <p className="text-sm text-navy-500 font-light mt-1">يرجى تغيير خيارات البحث أو تصفح الصفحة لاحقاً للمستجدات.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm hover:shadow-md hover:border-gold-500/30 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {job.agency?.logo ? (
                      <img 
                        src={job.agency.logo} 
                        alt={job.agency.name} 
                        className="w-10 h-10 rounded-xl border border-navy-100 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center border border-navy-100 flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-navy-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] text-gold-600 font-bold block">مكتب معتمد</span>
                      <p className="text-xs text-navy-500 font-bold truncate">{job.agency?.name}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-navy-900 group-hover:text-gold-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-navy-50/50 p-3 rounded-xl font-bold">
                    <div className="flex items-center gap-1.5 text-navy-700">
                      <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      <span className="truncate">{job.country}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-navy-700">
                      <DollarSign className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      <span className="truncate">{job.price.toLocaleString("ar-YE")} ريال</span>
                    </div>
                  </div>

                  <p className="text-xs text-navy-500 leading-relaxed line-clamp-3 font-light">
                    {job.description}
                  </p>
                </div>

                <div className="border-t border-navy-50 pt-4 mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-navy-400">نُشرت: {new Date(job.createdAt).toLocaleDateString("ar-SA")}</span>
                  
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1 cursor-pointer"
                  >
                    تفاصيل والتقديم
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Details Modal */}
      {selectedJob && !showApplyModal && (
        <div className="fixed inset-0 bg-navy-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-navy-100 flex flex-col max-h-[90vh] text-right">
            <div className="px-8 py-6 border-b border-navy-100 bg-navy-50/50 flex items-center justify-between">
              <button
                onClick={() => setSelectedJob(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-navy-400 hover:text-navy-900 hover:bg-navy-100 transition-all cursor-pointer font-bold"
              >
                X
              </button>
              <h2 className="text-xl font-black text-navy-900">تفاصيل فرصة العمل</h2>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 flex-1">
              <div>
                <h3 className="text-2xl font-black text-navy-900">{selectedJob.title}</h3>
                <p className="text-xs text-navy-500 font-bold mt-1">الجهة المعلنة: {selectedJob.agency?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-navy-50/50 p-4 rounded-2xl border border-navy-100 text-sm font-bold text-navy-800">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-500" />
                  <span>دولة العمل: {selectedJob.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gold-500" />
                  <span>الراتب المتوقع: {selectedJob.price.toLocaleString("ar-YE")} ريال</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-gold-500 rounded-sm"></span>
                  الشروط والمتطلبات
                </h4>
                <p className="text-xs text-navy-600 leading-relaxed whitespace-pre-line font-medium p-4 bg-navy-50 rounded-xl">
                  {selectedJob.requiredDocs}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-gold-500 rounded-sm"></span>
                  تفاصيل الوظيفة والبدلات الموفرة
                </h4>
                <p className="text-xs text-navy-600 leading-relaxed whitespace-pre-line font-medium p-4 bg-navy-50 rounded-xl">
                  {selectedJob.description}
                </p>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-navy-100 bg-navy-50/30 flex justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-navy-500 hover:bg-navy-100 text-sm cursor-pointer"
              >
                إغلاق
              </button>
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn-gold px-8 py-3 rounded-xl font-bold text-sm cursor-pointer flex items-center gap-2 shadow-lg"
              >
                التقديم الآن وإرفاق الأوراق
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {selectedJob && showApplyModal && (
        <div className="fixed inset-0 bg-navy-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-navy-100 flex flex-col max-h-[90vh] text-right">
            <div className="px-8 py-6 border-b border-navy-100 bg-navy-50/50 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setSuccess(false);
                  setError("");
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full text-navy-400 hover:text-navy-900 hover:bg-navy-100 transition-all cursor-pointer font-bold"
              >
                X
              </button>
              <div>
                <h2 className="text-lg font-black text-navy-900">استمارة التقديم على الوظيفة</h2>
                <p className="text-xs text-navy-500 mt-0.5">تقديم لطلب تأشيرة وعقد عمل: {selectedJob.title}</p>
              </div>
            </div>

            {success ? (
              <div className="p-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-navy-900">تم إرسال طلب التقديم بنجاح!</h3>
                <p className="text-sm text-navy-500 font-medium max-w-sm mx-auto leading-relaxed">
                  شكراً لثقتكم بنا. لقد تم إرسال سيرتك الذاتية وصورة الجواز لمكتب التوظيف المختص بمراجعة العرض، وسنتصل بك قريباً لاستكمال إجراءات التأشيرة والتفويض.
                </p>
                <button
                  onClick={() => {
                    setShowApplyModal(false);
                    setSelectedJob(null);
                    setSuccess(false);
                  }}
                  className="bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-white font-bold px-8 py-3 rounded-xl text-sm cursor-pointer shadow-md transition-all"
                >
                  العودة لقائمة الوظائف
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="flex-1 overflow-y-auto p-8 space-y-5">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-xs font-bold text-center flex items-center gap-1.5 justify-center">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">الاسم الثلاثي المتقدم *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="الاسم مطابق لجواز السفر"
                      className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">رقم الهاتف (الواتساب) *</label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+966 5X XXX XXXX"
                      className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 outline-none transition-all text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">رقم جواز السفر الحالي *</label>
                    <input
                      type="text"
                      required
                      value={clientPassport}
                      onChange={(e) => setClientPassport(e.target.value)}
                      placeholder="رقم جواز السفر النشط"
                      className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">خيار التأشيرة المفضل *</label>
                    <select
                      value={visaSelection}
                      onChange={(e) => setVisaSelection(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 outline-none cursor-pointer"
                    >
                      <option value="FREE">تأشيرة حرة (نقل كفالة)</option>
                      <option value="BUSINESS">تأشيرة عمل تجاري</option>
                      <option value="CONTRACT">عقد عمل حكومي / مؤسساتي</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <UploadFile
                    label="رفع السيرة الذاتية المحدثة (PDF فقط) *"
                    accept="document"
                    value={cvUrl}
                    onChange={(url) => setCvUrl(url)}
                  />

                  <UploadFile
                    label="رفع صورة ضوئية لجواز السفر (صورة أو PDF) *"
                    accept="all"
                    value={passportPhotoUrl}
                    onChange={(url) => setPassportPhotoUrl(url)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">ملاحظات إضافية للمكتب</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="اكتب أي ملاحظات أو تفاصيل عن خبراتك أو تفضيلاتك في السفر..."
                    className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-navy-50 rounded-xl border border-navy-100 text-xs text-navy-500 font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>جميع البيانات والملفات المرفقة تخضع للتشفير والأمان التام.</span>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-navy-100">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-5 py-3 rounded-xl text-sm font-bold text-navy-500 hover:text-navy-900 hover:bg-navy-50 transition-all cursor-pointer"
                  >
                    السابق
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-white font-bold px-10 py-3 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-70 transition-all"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    إرسال طلب التقديم
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
