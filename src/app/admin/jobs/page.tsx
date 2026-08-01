"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, XCircle, Loader2, Save, Briefcase, MapPin, DollarSign, CheckCircle } from "lucide-react";

interface JobPackageItem {
  id: string;
  title: string;
  description: string;
  requiredDocs: string;
  price: number;
  country: string;
  duration: string;
  status: string; // ACTIVE, INACTIVE
  agencyId: string;
  agency?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

const emptyJob = {
  title: "", description: "", requiredDocs: "", price: 0, country: "", duration: "سنة واحدة", status: "ACTIVE", agencyId: "",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobPackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JobPackageItem | null>(null);
  const [form, setForm] = useState(emptyJob);
  const [saving, setSaving] = useState(false);
  const [adminRole, setAdminRole] = useState("");
  const [agencies, setAgencies] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const role = sessionStorage.getItem("admin_role") || "ADMIN";
    setAdminRole(role);
    fetchJobs();
    if (role === "SUPER_ADMIN" || role === "ADMIN") fetchAgencies();
  }, []);

  async function fetchAgencies() {
    try {
      const res = await fetch("/api/admin/agencies");
      const data = await res.json();
      if (Array.isArray(data)) {
        setAgencies(data);
      }
    } catch {}
  }

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

  function openForm(job?: JobPackageItem) {
    if (job) {
      setEditing(job);
      setForm({
        title: job.title,
        description: job.description,
        requiredDocs: job.requiredDocs,
        price: job.price,
        country: job.country,
        duration: job.duration,
        status: job.status,
        agencyId: job.agencyId
      });
    } else {
      setEditing(null);
      const userAgencyId = sessionStorage.getItem("admin_agency_id") || "";
      setForm({ ...emptyJob, agencyId: userAgencyId });
    }
    setShowForm(true);
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const body = { 
        ...form, 
        isActive: form.status === "ACTIVE" 
      };

      if (editing) {
        const res = await fetch("/api/jobs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, id: editing.id }),
        });
        if (!res.ok) {
          const errData = await res.json();
          alert(`فشل التحديث: ${errData.error}`);
          return;
        }
      } else {
        const res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const errData = await res.json();
          alert(`فشل الإضافة: ${errData.error}`);
          return;
        }
      }

      await fetchJobs();
      setShowForm(false);
    } catch {
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف فرصة العمل هذه نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.")) return;
    try {
      const res = await fetch("/api/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(`فشل الحذف: ${errData.error}`);
        return;
      }
      await fetchJobs();
    } catch {
      alert("فشل حذف فرصة العمل");
    }
  }

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
            <Briefcase className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-900">إدارة فرص العمل والتوظيف</h1>
            <p className="text-sm text-navy-500 font-medium">إضافة وتعديل عروض العمل والتعاقدات الخارجية المتاحة</p>
          </div>
        </div>
        
        <button
          onClick={() => openForm()}
          className="bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> إضافة عرض عمل جديد
        </button>
      </div>

      {/* Grid of Jobs */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-navy-100 p-16 text-center text-navy-400 shadow-sm">
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-25" />
          <p className="text-lg font-bold text-navy-900">لا توجد عروض عمل مسجلة</p>
          <p className="text-sm">ابدأ بإضافة أول عرض عمل لتظهر للمستخدمين والعملاء.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${job.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
                    {job.status === "ACTIVE" ? "نشط ومتاح" : "غير نشط"}
                  </span>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openForm(job)}
                      className="p-2 text-navy-600 hover:text-gold-600 hover:bg-navy-50 rounded-lg transition-colors cursor-pointer"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors line-clamp-1">{job.title}</h3>
                  {job.agency && (
                    <p className="text-xs text-navy-400 font-bold mt-1">الجهة: {job.agency.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-navy-50/55 p-3.5 rounded-xl font-bold">
                  <div className="flex items-center gap-1.5 text-navy-700">
                    <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    <span className="truncate">{job.country}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-navy-700">
                    <DollarSign className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    <span className="truncate">{job.price.toLocaleString("ar-YE")} ريال</span>
                  </div>
                </div>

                <p className="text-xs text-navy-500 leading-relaxed font-light line-clamp-3">{job.description}</p>
              </div>

              <div className="border-t border-navy-50 pt-4 mt-6 flex items-center justify-between">
                <span className="text-[10px] text-navy-400">تاريخ النشر: {new Date(job.createdAt).toLocaleDateString("ar-SA")}</span>
                <span className="text-xs font-bold text-gold-600 group-hover:underline cursor-pointer" onClick={() => openForm(job)}>
                  تفاصيل أكثر &larr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-navy-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-navy-100 flex flex-col max-h-[90vh] transform transition-all text-right">
            <div className="px-8 py-6 border-b border-navy-100 bg-navy-50/50 flex items-center justify-between">
              <button
                onClick={() => setShowForm(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-navy-400 hover:text-navy-900 hover:bg-navy-100 transition-all cursor-pointer font-bold"
              >
                X
              </button>
              <h2 className="text-xl font-black text-navy-900">{editing ? "تعديل عرض العمل" : "إضافة عرض عمل جديد"}</h2>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-5">
              <div>
                <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">مسمى الوظيفة / عرض العمل *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="مثال: مهندس برمجيات، محاسب مالي، إلخ"
                  className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">دولة العمل *</label>
                  <input
                    type="text"
                    required
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="مثال: المملكة العربية السعودية، قطر"
                    className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">الراتب / الحزمة المالية (رقمي) *</label>
                  <input
                    type="number"
                    required
                    value={form.price || ""}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    placeholder="مثال: 5000"
                    className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">مدة العقد / التأشيرة *</label>
                  <input
                    type="text"
                    required
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="مثال: سنتين، سنة واحدة"
                    className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all"
                  />
                </div>
              </div>

              {(adminRole === "SUPER_ADMIN" || adminRole === "ADMIN") && (
                <div>
                  <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">المكتب المالك للعرض *</label>
                  <select
                    required
                    value={form.agencyId || ""}
                    onChange={(e) => setForm({ ...form, agencyId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all cursor-pointer"
                  >
                    <option value="">اختر مكتب التوظيف المالك للمنتج...</option>
                    {agencies.map((agency) => (
                      <option key={agency.id} value={agency.id}>{agency.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">متطلبات وشروط التقديم *</label>
                <textarea
                  required
                  rows={4}
                  value={form.requiredDocs}
                  onChange={(e) => setForm({ ...form, requiredDocs: e.target.value })}
                  placeholder="اكتب كل شرط في سطر جديد... (خبرة، مؤهل، لغات، إلخ)"
                  className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-2 block">الوصف الوظيفي والخدمات والبدلات *</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="وصف تفصيلي للعمل، ساعات الدوام، السكن والمواصلات والبدلات المؤمنة..."
                  className="w-full px-4 py-3 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-semibold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.status === "ACTIVE"}
                  onChange={(e) => setForm({ ...form, status: e.target.checked ? "ACTIVE" : "INACTIVE" })}
                  className="w-4 h-4 text-gold-500 border-navy-300 rounded focus:ring-gold-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-navy-900 cursor-pointer select-none">
                  تفعيل العرض للعامة (يظهر في دليل فرص العمل بالموقع)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-navy-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-3 rounded-xl text-sm font-bold text-navy-500 hover:text-navy-900 hover:bg-navy-50 transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-navy-900 hover:bg-gold-500 hover:text-navy-950 text-white font-bold px-8 py-3 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-70 transition-all"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  حفظ تفاصيل العرض
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
