"use client";

import { useEffect, useState } from "react";
import { 
  FileCheck, Loader2, Eye, User, Phone, Clipboard, 
  MapPin, Clock, CheckCircle2, AlertCircle, FileText, 
  ExternalLink, Upload, Save, RefreshCw, XCircle, Briefcase 
} from "lucide-react";
import UploadFile from "@/components/UploadFile";

interface JobReservationItem {
  id: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  uploadedDocs: string; // JSON string containing cvUrl, passportPhotoUrl, visaPhotoUrl, clientPassport, visaSelection, notes
  status: string; // PENDING, PROCESSING, COMPLETED, CANCELLED
  jobPackageId: string;
  jobPackage: {
    id: string;
    title: string;
    country: string;
    agency: {
      id: string;
      name: string;
    }
  };
  createdAt: string;
}

export default function AdminJobReservationsPage() {
  const [reservations, setReservations] = useState<JobReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRes, setSelectedRes] = useState<JobReservationItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Parsed fields from JSON
  const [status, setStatus] = useState("PENDING");
  const [notes, setNotes] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [passportPhotoUrl, setPassportPhotoUrl] = useState("");
  const [visaPhotoUrl, setVisaPhotoUrl] = useState("");
  const [clientPassport, setClientPassport] = useState("");
  const [visaSelection, setVisaSelection] = useState("FREE");

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      const res = await fetch("/api/job-reservations");
      const data = await res.json();
      if (Array.isArray(data)) setReservations(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  function openDetails(resItem: JobReservationItem) {
    setSelectedRes(resItem);
    setStatus(resItem.status);
    
    try {
      const parsed = JSON.parse(resItem.uploadedDocs);
      setCvUrl(parsed.cvUrl || "");
      setPassportPhotoUrl(parsed.passportPhotoUrl || "");
      setVisaPhotoUrl(parsed.visaPhotoUrl || "");
      setClientPassport(parsed.clientPassport || "");
      setVisaSelection(parsed.visaSelection || "FREE");
      setNotes(parsed.notes || "");
    } catch {
      setCvUrl("");
      setPassportPhotoUrl("");
      setVisaPhotoUrl("");
      setClientPassport("");
      setVisaSelection("FREE");
      setNotes("");
    }
  }

  // Safely parse details for list display
  const getParsedDocDetails = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch {
      return { clientPassport: "غير متوفر", visaSelection: "FREE" };
    }
  };

  async function handleSaveStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRes) return;

    setUpdatingId(selectedRes.id);
    try {
      const res = await fetch("/api/job-reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedRes.id,
          status,
          notes,
          cvUrl,
          passportPhotoUrl,
          visaPhotoUrl,
          clientPassport,
          visaSelection
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("تم تحديث حالة طلب التوظيف بنجاح");
        setSelectedRes(null);
        fetchReservations();
      } else {
        alert(data.error || "حدث خطأ");
      }
    } catch {
      alert("تعذر الاتصال بالخادم");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredReservations = reservations.filter((resItem) => {
    const matchesStatus = filterStatus === "ALL" || resItem.status === filterStatus;
    const docs = getParsedDocDetails(resItem.uploadedDocs);
    const matchesSearch = 
      resItem.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resItem.applicantPhone.includes(searchQuery) ||
      docs.clientPassport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resItem.jobPackage.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (val: string) => {
    switch (val) {
      case "PENDING":
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">جديد / معلق</span>;
      case "PROCESSING":
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">جاري المعالجة</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">تم إصدار الفيزا / مكتمل</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">ملغي</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-50 text-gray-500">{val}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-navy-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center">
            <FileCheck className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-900">طلبات التوظيف والتعاقدات الخارجية</h1>
            <p className="text-sm text-navy-500 font-medium">متابعة تأشيرات العمل، عقود التوظيف وتفويض العمالة للعملاء</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-navy-400 font-bold block mb-1.5">البحث السريع</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث باسم العميل، رقم الجواز، أو المسمى الوظيفي..."
            className="w-full px-4 py-2.5 rounded-xl bg-navy-50/50 border border-navy-200 text-xs font-bold text-navy-900 focus:border-gold-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-[10px] text-navy-400 font-bold block mb-1.5">تصفية حسب الحالة</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-navy-50/50 border border-navy-200 text-xs font-bold text-navy-800 focus:border-gold-500 outline-none cursor-pointer"
          >
            <option value="ALL">جميع طلبات التوظيف</option>
            <option value="PENDING">جديد / معلق</option>
            <option value="PROCESSING">جاري المعالجة والمتابعة</option>
            <option value="COMPLETED">مكتمل (التأشيرة جاهزة)</option>
            <option value="CANCELLED">ملغي</option>
          </select>
        </div>
      </div>

      {/* List / Table */}
      <div className="bg-white rounded-3xl border border-navy-100 shadow-sm overflow-hidden">
        {filteredReservations.length === 0 ? (
          <div className="p-16 text-center text-navy-400">
            <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-lg font-bold text-navy-900">لا توجد طلبات مطابقة</p>
            <p className="text-sm">لم يتم العثور على أي طلبات توظيف تطابق خيارات التصفية والبحث.</p>
          </div>
        ) : (
          <div className="divide-y divide-navy-50">
            {filteredReservations.map((resItem) => {
              const docs = getParsedDocDetails(resItem.uploadedDocs);
              return (
                <div key={resItem.id} className="p-6 hover:bg-navy-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-navy-900">{resItem.applicantName}</h3>
                      {getStatusBadge(resItem.status)}
                      <span className="px-2 py-0.5 rounded bg-gold-50 text-gold-600 border border-gold-200 text-[10px] font-bold">
                        {docs.visaSelection === "FREE" ? "تأشيرة حرة" : docs.visaSelection === "BUSINESS" ? "تأشيرة عمل تجاري" : "عقد عمل"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-6 text-xs text-navy-600 font-semibold">
                      <div className="flex items-center gap-1.5" dir="ltr">
                        <Phone className="w-4 h-4 text-navy-400" /> {resItem.applicantPhone}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clipboard className="w-4 h-4 text-navy-400" /> جواز: {docs.clientPassport || "غير محدد"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-navy-400" /> الوظيفة: {resItem.jobPackage.title} ({resItem.jobPackage.country})
                      </div>
                    </div>

                    <div className="text-[10px] text-navy-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> تاريخ التقديم: {new Date(resItem.createdAt).toLocaleString("ar-SA")}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => openDetails(resItem)}
                      className="px-5 py-2.5 bg-navy-50 hover:bg-navy-100 border border-navy-150 text-navy-700 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Eye className="w-4 h-4" /> فحص المستندات والتحكم
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details & Actions Modal */}
      {selectedRes && (
        <div className="fixed inset-0 bg-navy-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-navy-100 flex flex-col max-h-[90vh] transform transition-all text-right">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-navy-100 bg-navy-50/50 flex items-center justify-between sticky top-0 z-10">
              <button
                onClick={() => setSelectedRes(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-navy-400 hover:text-navy-900 hover:bg-navy-100 transition-all cursor-pointer font-bold"
              >
                X
              </button>
              <div>
                <h2 className="text-xl font-black text-navy-900">إجراءات ومعالجة طلب: {selectedRes.applicantName}</h2>
                <p className="text-xs text-navy-500 font-medium mt-1">عرض أوراق العميل المرفقة وإصدار التأشيرات</p>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveStatus} className="p-8 overflow-y-auto space-y-6 flex-1">
              
              {/* Applicant Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-navy-50/50 p-6 rounded-2xl border border-navy-100 text-xs font-bold">
                <div>
                  <span className="text-[10px] text-navy-400 block mb-1">اسم العميل المتقدم</span>
                  <span className="text-navy-900 text-sm">{selectedRes.applicantName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-navy-400 block mb-1">رقم الهاتف الجوال</span>
                  <span className="text-navy-900 text-sm font-mono" dir="ltr">{selectedRes.applicantPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-navy-400 block mb-1">رقم جواز السفر</span>
                  <span className="text-navy-900 text-sm font-mono">{clientPassport}</span>
                </div>
                <div>
                  <span className="text-[10px] text-navy-400 block mb-1">الوظيفة المتقدم لها</span>
                  <span className="text-navy-900 text-sm">{selectedRes.jobPackage.title}</span>
                </div>
                <div>
                  <span className="text-[10px] text-navy-400 block mb-1">بلد التوظيف</span>
                  <span className="text-navy-900 text-sm">{selectedRes.jobPackage.country}</span>
                </div>
                <div>
                  <span className="text-[10px] text-navy-400 block mb-1">المكتب المسؤول</span>
                  <span className="text-navy-900 text-sm text-gold-600">{selectedRes.jobPackage.agency.name}</span>
                </div>
              </div>

              {/* Documents & Files Grid */}
              <div className="space-y-3">
                <h3 className="text-navy-900 font-bold text-sm border-b border-navy-100 pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold-500" /> مستندات وأوراق العميل المرفوعة
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CV Document */}
                  <div className="flex items-center justify-between p-4 border border-navy-100 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center text-navy-500 flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-navy-900 truncate">السيرة الذاتية (CV)</p>
                        <p className="text-[9px] text-navy-400">ملف التعريف والخبرات</p>
                      </div>
                    </div>
                    {cvUrl ? (
                      <a
                        href={cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gold-50 hover:bg-gold-100 text-gold-600 border border-gold-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> استعراض
                      </a>
                    ) : (
                      <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded">غير مرفق</span>
                    )}
                  </div>

                  {/* Passport scan */}
                  <div className="flex items-center justify-between p-4 border border-navy-100 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center text-navy-500 flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-navy-900 truncate">نسخة جواز السفر</p>
                        <p className="text-[9px] text-navy-400">صورة ضوئية للجواز</p>
                      </div>
                    </div>
                    {passportPhotoUrl ? (
                      <a
                        href={passportPhotoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gold-50 hover:bg-gold-100 text-gold-600 border border-gold-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> استعراض
                      </a>
                    ) : (
                      <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded">غير مرفق</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Notes editing panel */}
              <div className="border-t border-navy-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">حالة معالجة الطلب *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 outline-none cursor-pointer"
                  >
                    <option value="PENDING">جديد / قيد الانتظار</option>
                    <option value="PROCESSING">جاري معالجة الأوراق والتأشيرة</option>
                    <option value="COMPLETED">مكتمل (تم التوظيف وإصدار الفيزا)</option>
                    <option value="CANCELLED">ملغي</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">ملاحظات وحالة المتابعة (تظهر للعميل)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: تم إرسال الأوراق للقنصلية، بانتظار التفويض..."
                    className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Attachment of issued visa papers (Crucial feature!) */}
              <div className="border-t border-navy-100 pt-6">
                <UploadFile
                  label="إرفاق نسخة التأشيرة الصادرة / التفويض الإلكتروني المكتمل (PDF أو صورة)"
                  accept="all"
                  value={visaPhotoUrl}
                  onChange={(url) => setVisaPhotoUrl(url)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-navy-100">
                <button
                  type="button"
                  onClick={() => setSelectedRes(null)}
                  className="px-5 py-3 rounded-xl text-sm font-bold text-navy-500 hover:text-navy-900 hover:bg-navy-50 transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={updatingId !== null}
                  className="bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-white font-bold px-8 py-3 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-70 transition-all"
                >
                  {updatingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  حفظ وتحديث الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
