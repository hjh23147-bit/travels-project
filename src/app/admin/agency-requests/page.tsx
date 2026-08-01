"use client";

import { useState, useEffect } from "react";
import { 
  UserPlus, CheckCircle, XCircle, Loader2, Mail, Phone, 
  Clock, User, FileText, ExternalLink, HelpCircle, Eye, AlertCircle, Building2
} from "lucide-react";

type AgencyRequest = {
  id: string;
  agencyName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: string;
  agencyType: string;
  commercialRegistry: string | null;
  taxCertificate: string | null;
  nationalId: string | null;
  license: string | null;
  logo: string | null;
  additionalDocs: string | null;
  adminNotes: string | null;
  createdAt: string;
};

export default function AgencyRequestsPage() {
  const [requests, setRequests] = useState<AgencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<AgencyRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/agency-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: "APPROVE" | "REJECT" | "REQUEST_DOCS") => {
    let confirmationMsg = "";
    if (action === "APPROVE") confirmationMsg = "هل أنت متأكد من الموافقة وتفعيل هذا المكتب وإنشاء حساب لمديره؟";
    else if (action === "REJECT") confirmationMsg = "هل أنت متأكد من رفض هذا الطلب؟";
    else if (action === "REQUEST_DOCS") confirmationMsg = "هل أنت متأكد من طلب وثائق إضافية وتحديث حالة الطلب؟";

    if (!confirm(confirmationMsg)) return;

    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/agency-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, notes: adminNotes }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setSelectedRequest(null);
        setAdminNotes("");
        fetchRequests();
      } else {
        alert(data.error || "حدث خطأ");
      }
    } catch (error) {
      alert("تعذر الاتصال بالخادم");
    } finally {
      setProcessingId(null);
    }
  };

  const getOfficeTypeLabel = (type: string) => {
    switch (type) {
      case "TRAVEL": return "سفريات وحج وعمرة";
      case "EMPLOYMENT": return "توظيف وعمالة خارجية";
      case "BOTH": return "سفريات وتوظيف مشترك";
      default: return "سفريات وحج وعمرة";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-navy-100">
        <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-gold-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-navy-900">طلبات انضمام الوكالات والمكاتب</h1>
          <p className="text-sm text-navy-500 font-medium">مراجعة وتوثيق المستندات الرسمية للمكاتب، اعتماد الحسابات، أو طلب تعديلات</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-navy-100 overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
          </div>
        ) : requests.length === 0 ? (
          <div className="p-16 text-center text-navy-400">
            <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-lg font-bold text-navy-900">لا توجد طلبات انضمام حالية</p>
            <p className="text-sm">لم يقم أي مكتب بتقديم طلب انضمام للشبكة حالياً.</p>
          </div>
        ) : (
          <div className="divide-y divide-navy-50">
            {requests.map((req) => (
              <div key={req.id} className="p-6 hover:bg-navy-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-navy-900">{req.agencyName}</h3>
                    
                    {/* Office Type Tag */}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-navy-50 text-navy-600 border border-navy-100">
                      {getOfficeTypeLabel(req.agencyType)}
                    </span>

                    {/* Status Badge */}
                    {req.status === "PENDING" && <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">قيد المراجعة</span>}
                    {req.status === "APPROVED" && <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">معتمد</span>}
                    {req.status === "REJECTED" && <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">مرفوض</span>}
                    {req.status === "MORE_DOCUMENTS_REQUESTED" && <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200">بانتظار وثائق إضافية</span>}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-navy-600">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-navy-400" /> {req.ownerName}
                    </div>
                    <div className="flex items-center gap-1.5" dir="ltr">
                      <Phone className="w-4 h-4 text-navy-400" /> {req.phone}
                    </div>
                    <div className="flex items-center gap-1.5" dir="ltr">
                      <Mail className="w-4 h-4 text-navy-400" /> {req.email}
                    </div>
                  </div>
                  
                  <div className="text-xs text-navy-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> تاريخ التقديم: {new Date(req.createdAt).toLocaleString('ar-SA')}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setAdminNotes(req.adminNotes || "");
                    }}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-navy-700 bg-navy-50 hover:bg-navy-100 transition-colors flex items-center gap-2 border border-navy-100 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" /> عرض وفحص الوثائق
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-navy-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-navy-100 flex flex-col max-h-[90vh] transform transition-all text-right">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-navy-100 bg-navy-50/50 flex items-center justify-between sticky top-0 z-10">
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setAdminNotes("");
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full text-navy-400 hover:text-navy-900 hover:bg-navy-100 transition-all cursor-pointer font-bold"
              >
                X
              </button>
              <div>
                <h2 className="text-xl font-black text-navy-900">فحص وتوثيق مكتب: {selectedRequest.agencyName}</h2>
                <p className="text-xs text-navy-500 font-medium mt-1">تأكد من مطابقة الوثائق الرسمية للمعلومات المدخلة</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto space-y-6 flex-1">
              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-navy-50/50 p-6 rounded-2xl border border-navy-100">
                <div>
                  <span className="text-[10px] text-navy-400 font-bold block mb-1">اسم الوكالة التجاري</span>
                  <span className="text-navy-900 text-sm font-bold">{selectedRequest.agencyName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-navy-400 font-bold block mb-1">المدير المسؤول</span>
                  <span className="text-navy-900 text-sm font-bold">{selectedRequest.ownerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-navy-400 font-bold block mb-1">البريد الإلكتروني للوكالة</span>
                  <span className="text-navy-900 text-sm font-semibold font-mono" dir="ltr">{selectedRequest.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-navy-400 font-bold block mb-1">رقم هاتف التواصل</span>
                  <span className="text-navy-900 text-sm font-semibold font-mono" dir="ltr">{selectedRequest.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-navy-400 font-bold block mb-1">نوع نشاط المكتب المقترح</span>
                  <span className="inline-flex px-3 py-1 bg-gold-500/10 border border-gold-500/20 text-gold-600 rounded-lg text-xs font-bold mt-1">
                    {getOfficeTypeLabel(selectedRequest.agencyType)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-navy-400 font-bold block mb-1">حالة الطلب الحالية</span>
                  <span className="inline-flex px-3 py-1 bg-amber-50 border border-amber-200 text-amber-600 rounded-lg text-xs font-bold mt-1">
                    {selectedRequest.status === "PENDING" && "قيد المراجعة"}
                    {selectedRequest.status === "APPROVED" && "معتمد ونشط"}
                    {selectedRequest.status === "REJECTED" && "مرفوض"}
                    {selectedRequest.status === "MORE_DOCUMENTS_REQUESTED" && "بانتظار استكمال الوثائق"}
                  </span>
                </div>
              </div>

              {/* Uploaded Documents Grid */}
              <div className="space-y-3">
                <h3 className="text-navy-900 font-bold text-sm border-b border-navy-100 pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold-500" /> الوثائق والمستندات المرفقة
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "السجل التجاري للوكالة", url: selectedRequest.commercialRegistry },
                    { name: "البطاقة / الشهادة الضريبية", url: selectedRequest.taxCertificate },
                    { name: "الهوية الوطنية للمالك", url: selectedRequest.nationalId },
                    { name: "ترخيص مزاولة المهنة المعتمد", url: selectedRequest.license },
                    { name: "شعار الوكالة الرسمي", url: selectedRequest.logo },
                    { name: "وثائق إضافية / عقود", url: selectedRequest.additionalDocs, optional: true }
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-navy-100 bg-white rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center text-navy-500 border border-navy-100 flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-navy-900 truncate">{doc.name}</p>
                          <p className="text-[9px] text-navy-400">ملف مرفق للتحقق</p>
                        </div>
                      </div>

                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gold-50 hover:bg-gold-100 text-gold-600 border border-gold-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> استعراض
                        </a>
                      ) : doc.optional ? (
                        <span className="text-[10px] text-navy-400 font-bold bg-navy-50 px-2 py-1 rounded-md">لم يرفع (اختياري)</span>
                      ) : (
                        <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded-md border border-red-100 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> غير مرفق
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Notes Section */}
              {selectedRequest.status === "PENDING" || selectedRequest.status === "MORE_DOCUMENTS_REQUESTED" ? (
                <div className="space-y-2 pt-4 border-t border-navy-100">
                  <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-2">
                    ملاحظات المراجعة والتدقيق (تظهر للمكتب في حال الرفض أو طلب التعديل)
                  </label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="اكتب ملاحظاتك هنا... (مثال: السجل التجاري منتهي الصلاحية، يرجى إعادة رفع الترخيص الجديد)"
                    className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all resize-none"
                  />
                </div>
              ) : selectedRequest.adminNotes ? (
                <div className="p-4 bg-navy-50 rounded-2xl border border-navy-100 text-right">
                  <span className="text-[10px] text-navy-400 font-bold block mb-1">ملاحظات الإدارة المسجلة</span>
                  <p className="text-sm font-bold text-navy-800">{selectedRequest.adminNotes}</p>
                </div>
              ) : null}
            </div>

            {/* Modal Footer (Action Panel) */}
            {(selectedRequest.status === "PENDING" || selectedRequest.status === "MORE_DOCUMENTS_REQUESTED") && (
              <div className="px-8 py-6 border-t border-navy-100 bg-navy-50/50 flex flex-wrap gap-4 items-center justify-between sticky bottom-0 z-10">
                <div className="flex gap-3">
                  {/* Reject Button */}
                  <button
                    onClick={() => handleAction(selectedRequest.id, "REJECT")}
                    disabled={processingId === selectedRequest.id}
                    className="px-5 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer border border-red-200"
                  >
                    <XCircle className="w-4 h-4" /> رفض نهائي
                  </button>

                  {/* Request Documents Button */}
                  <button
                    onClick={() => handleAction(selectedRequest.id, "REQUEST_DOCS")}
                    disabled={processingId === selectedRequest.id}
                    className="px-5 py-3 rounded-xl text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors flex items-center gap-1.5 cursor-pointer border border-orange-200"
                  >
                    <AlertCircle className="w-4 h-4" /> طلب استكمال الوثائق
                  </button>
                </div>

                {/* Approve Button */}
                <button
                  onClick={() => handleAction(selectedRequest.id, "APPROVE")}
                  disabled={processingId === selectedRequest.id}
                  className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-colors flex items-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(16,185,129,0.2)] disabled:opacity-75"
                >
                  {processingId === selectedRequest.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  الموافقة واعتماد حساب المكتب
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
