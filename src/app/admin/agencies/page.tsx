"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, Edit2, Trash2, CheckCircle, XCircle, Search, Save, User, MapPin, Loader2 } from "lucide-react";
import UploadImage from "@/components/UploadImage";

type Agency = {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  contactPhone: string | null;
  isActive: boolean;
  subscriptionType: string;
  subscriptionEndsAt: string | null;
  coverImage: string | null;
  whatsapp: string | null;
  instagram: string | null;
  x_link: string | null;
};

export default function AgenciesAdmin() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    contactPhone: "",
    isActive: true,
    subscriptionType: "NONE",
    subscriptionEndsAt: "",
    adminEmail: "",
    adminPassword: "",
    coverImage: "",
    whatsapp: "",
    instagram: "",
    x_link: "",
  });

  const fetchAgencies = async () => {
    try {
      const res = await fetch("/api/admin/agencies");
      if (res.ok) {
        const data = await res.json();
        setAgencies(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAgencies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingAgency ? "PUT" : "POST";
    const payload = editingAgency ? { ...form, id: editingAgency.id } : form;

    const res = await fetch("/api/admin/agencies", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowModal(false);
      setEditingAgency(null);
      setForm({ name: "", description: "", logo: "", contactPhone: "", isActive: true, subscriptionType: "NONE", subscriptionEndsAt: "", adminEmail: "", adminPassword: "", coverImage: "", whatsapp: "", instagram: "", x_link: "" });
      fetchAgencies();
    } else {
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المكتب بشكل نهائي؟ هذا الإجراء لا يمكن التراجع عنه.")) return;
    const res = await fetch("/api/admin/agencies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchAgencies();
    }
  };

  const openEdit = (agency: Agency) => {
    setEditingAgency(agency);
    setForm({
      name: agency.name,
      description: agency.description || "",
      logo: agency.logo || "",
      contactPhone: agency.contactPhone || "",
      isActive: agency.isActive,
      subscriptionType: agency.subscriptionType || "NONE",
      subscriptionEndsAt: agency.subscriptionEndsAt ? new Date(agency.subscriptionEndsAt).toISOString().split('T')[0] : "",
      adminEmail: "",
      adminPassword: "",
      coverImage: agency.coverImage || "",
      whatsapp: agency.whatsapp || "",
      instagram: agency.instagram || "",
      x_link: agency.x_link || "",
    });
    setShowModal(true);
  };

  const filtered = agencies.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-navy-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-900">إدارة المكاتب وشركاء النجاح</h1>
            <p className="text-sm text-navy-500 font-medium">إضافة، تعديل وحذف المكاتب المعتمدة في المنصة</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingAgency(null);
            setForm({ name: "", description: "", logo: "", contactPhone: "", isActive: true, subscriptionType: "NONE", subscriptionEndsAt: "", adminEmail: "", adminPassword: "", coverImage: "", whatsapp: "", instagram: "", x_link: "" });
            setShowModal(true);
          }}
          className="btn-gold px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          إضافة مكتب جديد
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-navy-100 p-4 shadow-sm relative z-10 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث عن مكتب بالاسم..."
            className="w-full pr-12 pl-4 py-3 rounded-xl bg-navy-50/50 border border-navy-100 text-sm focus:bg-white focus:border-gold-400 focus:ring-4 focus:ring-gold-400/10 outline-none transition-all font-medium text-navy-900 placeholder:text-navy-400"
          />
        </div>
        <div className="bg-navy-50 px-4 py-2 rounded-xl border border-navy-100">
          <span className="text-sm font-bold text-navy-600">إجمالي المكاتب المعتمدة: </span>
          <span className="text-lg font-black text-gold-600 ml-1">{agencies.length}</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-navy-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-navy-50 text-navy-600 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5">معلومات المكتب</th>
                <th className="px-6 py-5">الوصف</th>
                <th className="px-6 py-5">الاشتراك</th>
                <th className="px-6 py-5">هاتف التواصل</th>
                <th className="px-6 py-5">الحالة المباشرة</th>
                <th className="px-6 py-5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-navy-400">
                      <Building2 className="w-16 h-16 mb-4 opacity-20 text-gold-500" />
                      <p className="text-lg font-bold text-navy-900 mb-1">لا توجد مكاتب</p>
                      <p className="text-sm">لم يتم إضافة أي مكتب بعد، أو لا توجد نتائج مطابقة للبحث.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((agency) => (
                  <tr key={agency.id} className="hover:bg-navy-50/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {agency.logo ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={agency.logo} alt={agency.name} className="w-14 h-14 rounded-2xl object-cover bg-white border-2 border-navy-50 shadow-sm group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center border-2 border-navy-100 shadow-sm group-hover:scale-105 transition-transform">
                              <Building2 className="w-6 h-6 text-navy-400" />
                            </div>
                          )}
                          {agency.isActive && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>}
                        </div>
                        <div>
                          <div className="font-bold text-navy-900 text-sm">{agency.name}</div>
                          <div className="text-xs text-navy-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gold-500" />
                            مكتب معتمد
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-navy-600 max-w-[200px] line-clamp-2 leading-relaxed" title={agency.description || ""}>
                        {agency.description || <span className="text-navy-300 italic">لا يوجد وصف</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {agency.subscriptionType === "MONTHLY" ? (
                        <span className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">شهري</span>
                      ) : agency.subscriptionType === "YEARLY" ? (
                        <span className="inline-flex items-center text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100">سنوي</span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">غير محدد</span>
                      )}
                      {agency.subscriptionEndsAt && (
                        <div className="text-[10px] text-navy-500 mt-1.5 font-medium bg-navy-50 px-2 py-1 rounded-md inline-block">
                          ينتهي: {new Date(agency.subscriptionEndsAt).toLocaleDateString('ar-SA')}
                          {new Date(agency.subscriptionEndsAt) < new Date() && (
                            <span className="text-red-600 block font-bold mt-0.5">منتهي!</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-navy-700" dir="ltr">
                      {agency.contactPhone || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {agency.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full shadow-sm">
                          <CheckCircle className="w-4 h-4" /> نشط ويظهر للعملاء
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full shadow-sm">
                          <XCircle className="w-4 h-4" /> متوقف (مخفي)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEdit(agency)} 
                          className="p-2.5 text-navy-400 bg-navy-50 hover:bg-gold-50 hover:text-gold-600 hover:border-gold-200 border border-transparent rounded-xl transition-all"
                          title="تعديل بيانات المكتب"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(agency.id)} 
                          className="p-2.5 text-navy-400 bg-navy-50 hover:bg-red-50 hover:text-red-500 hover:border-red-200 border border-transparent rounded-xl transition-all"
                          title="حذف المكتب"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-navy-100 flex flex-col max-h-[90vh] transform transition-all">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-navy-100 bg-navy-50/50 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-navy-900">
                    {editingAgency ? "تعديل بيانات المكتب" : "إضافة مكتب جديد"}
                  </h2>
                  <p className="text-xs text-navy-500 font-medium mt-1">الرجاء إدخال تفاصيل المكتب وتفعيل حسابه بدقة</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full text-navy-400 hover:text-navy-900 hover:bg-navy-100 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
              
              {/* Section 1: Agency Identity */}
              <div className="space-y-5">
                <h3 className="text-sm font-black text-navy-900 border-b border-navy-100 pb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gold-500" /> الهوية الأساسية للمكتب
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">اسم المكتب (الرسمي)</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="مثال: وكالة الصفوة للسياحة والسفر"
                      className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <UploadImage
                      label="شعار المكتب (يفضل صورة مربعة عالية الدقة)"
                      value={form.logo}
                      onChange={(url) => setForm({ ...form, logo: url })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <UploadImage
                      label="صورة الغلاف (Cover Image) لصفحة المكتب"
                      value={form.coverImage}
                      onChange={(url) => setForm({ ...form, coverImage: url })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">نبذة تفصيلية (الوصف)</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="اكتب وصفاً جذاباً لخدمات ومميزات هذا المكتب..."
                      className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-medium text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">هاتف التواصل للعملاء (اختياري)</label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={form.contactPhone}
                      onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                      placeholder="+966 5X XXX XXXX"
                      className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all text-left"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">رقم الواتساب المباشر (اختياري)</label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="+9665XXXXXXXX"
                      className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">رابط الانستقرام (اختياري)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={form.instagram}
                      onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">رابط منصة X (اختياري)</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={form.x_link}
                      onChange={(e) => setForm({ ...form, x_link: e.target.value })}
                      placeholder="https://x.com/..."
                      className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all text-left"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">نوع الاشتراك (اختياري)</label>
                    <select
                      value={form.subscriptionType}
                      onChange={(e) => setForm({ ...form, subscriptionType: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all"
                    >
                      <option value="NONE">غير محدد / مجاني (مدى الحياة)</option>
                      <option value="MONTHLY">شهري (30 يوم)</option>
                      <option value="YEARLY">سنوي (365 يوم)</option>
                    </select>
                  </div>
                  
                  {editingAgency && form.subscriptionType !== "NONE" && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">تاريخ انتهاء الاشتراك (يمكنك تعديله)</label>
                      <input
                        type="date"
                        value={form.subscriptionEndsAt}
                        onChange={(e) => setForm({ ...form, subscriptionEndsAt: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all text-left"
                      />
                    </div>
                  )}

                </div>
              </div>

              {/* Section 2: Account Generation (Only for new agencies) */}
              {!editingAgency && (
                <div className="space-y-5 bg-gold-50/30 p-5 rounded-2xl border border-gold-200/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 h-full bg-gold-400"></div>
                  <h3 className="text-sm font-black text-navy-900 border-b border-gold-200/50 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-gold-500" /> إنشاء حساب الإدارة الخاص بالمكتب
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-navy-600 mb-2">البريد الإلكتروني للإدارة</label>
                      <input
                        type="email"
                        dir="ltr"
                        required
                        value={form.adminEmail}
                        onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                        placeholder="admin@agency.com"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-navy-200 text-sm font-bold text-navy-900 focus:border-gold-500 outline-none transition-all text-left"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-600 mb-2">كلمة المرور الافتراضية</label>
                      <input
                        type="text"
                        dir="ltr"
                        required
                        value={form.adminPassword}
                        onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-navy-200 text-sm font-bold text-navy-900 focus:border-gold-500 outline-none transition-all text-left"
                      />
                    </div>
                    <div className="md:col-span-2 text-xs text-navy-500 font-medium bg-white p-3 rounded-lg border border-navy-100 flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">⚠️</span>
                      يرجى تزويد المكتب ببيانات الدخول هذه. سيتمكن مدير المكتب من تسجيل الدخول للوحة التحكم وإضافة الباقات الخاصة بمكتبه بشكل مستقل.
                    </div>
                  </div>
                </div>
              )}

              {/* Status Toggle */}
              <div className="pt-2">
                <label className="relative flex items-center gap-4 cursor-pointer bg-navy-50 p-4 rounded-xl border border-navy-100 hover:bg-navy-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-navy-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[18px] after:right-[22px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  <div className="flex-1">
                    <span className="block text-sm font-black text-navy-900">تفعيل ظهور المكتب</span>
                    <span className="block text-xs text-navy-500 font-medium mt-0.5">عند إلغاء التفعيل، سيتم إخفاء المكتب وباقاته من المنصة العامة.</span>
                  </div>
                </label>
              </div>

              {/* Modal Footer actions */}
              <div className="pt-6 border-t border-navy-100 flex gap-4 sticky bottom-0 bg-white z-10 pb-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 py-3.5 rounded-xl border-2 border-navy-100 text-sm font-black text-navy-600 hover:bg-navy-50 hover:text-navy-900 transition-all"
                >
                  إلغاء التعديلات
                </button>
                <button 
                  type="submit" 
                  className="flex-1 btn-gold py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-gold-500/20"
                >
                  <Save className="w-4 h-4" />
                  {editingAgency ? "حفظ وتحديث" : "حفظ واعتماد المكتب"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
