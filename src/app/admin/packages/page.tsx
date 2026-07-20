"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, XCircle, Loader2, Save, Package as PackageIcon, Tag, MapPin, Calendar, CheckCircle, Percent } from "lucide-react";
import UploadImage from "@/components/UploadImage";

interface PackageItem {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  features: string;
  type: string;
  isActive: boolean;
  duration: string | null;
  hotelMakkah: string | null;
  hotelMadinah: string | null;
  agencyId: string | null;
  imageUrl: string | null;
}

const emptyPkg: Omit<PackageItem, "id"> = {
  title: "", description: "", price: 0, discount: 0, features: "[]",
  type: "UMRAH", isActive: true, duration: "", hotelMakkah: "", hotelMadinah: "", agencyId: null, imageUrl: "",
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PackageItem | null>(null);
  const [form, setForm] = useState(emptyPkg);
  const [featuresText, setFeaturesText] = useState("");
  const [saving, setSaving] = useState(false);
  const [adminRole, setAdminRole] = useState("");
  const [agencies, setAgencies] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const role = sessionStorage.getItem("admin_role") || "ADMIN";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdminRole(role);
    fetchPackages();
    if (role === "SUPER_ADMIN" || role === "ADMIN") fetchAgencies();
  }, []);

  async function fetchAgencies() {
    try {
      const res = await fetch("/api/admin/agencies");
      const data = await res.json();
      if (Array.isArray(data)) setAgencies(data);
    } catch {}
  }

  async function fetchPackages() {
    try {
      const res = await fetch("/api/packages");
      const data = await res.json();
      if (Array.isArray(data)) setPackages(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  function openForm(pkg?: PackageItem) {
    if (pkg) {
      setEditing(pkg);
      setForm(pkg);
      try {
        const features = JSON.parse(pkg.features);
        setFeaturesText(Array.isArray(features) ? features.join("\n") : pkg.features);
      } catch {
        setFeaturesText(pkg.features);
      }
    } else {
      setEditing(null);
      setForm(emptyPkg);
      setFeaturesText("");
    }
    setShowForm(true);
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const featuresArray = featuresText.split("\n").filter((f) => f.trim());
      const body = { ...form, features: JSON.stringify(featuresArray) };

      if (editing) {
        const res = await fetch("/api/packages", {
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
        const res = await fetch("/api/packages", {
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

      await fetchPackages();
      setShowForm(false);
    } catch {
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه الباقة نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.")) return;
    try {
      const res = await fetch("/api/packages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(`فشل الحذف: ${errData.error}`);
        return;
      }
      await fetchPackages();
    } catch {
      alert("فشل حذف الباقة");
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-navy-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center">
            <PackageIcon className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-900">إدارة الباقات السياحية والحج والعمرة</h1>
            <p className="text-sm text-navy-500 font-medium">إنشاء وإدارة عروض الباقات المتاحة للعملاء</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-navy-50 px-4 py-2 rounded-xl border border-navy-100 hidden sm:block">
            <span className="text-sm font-bold text-navy-600">الباقات الحالية: </span>
            <span className="text-lg font-black text-gold-600 ml-1">{packages.length}</span>
          </div>
          <button
            onClick={() => openForm()}
            className="btn-gold px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
            إضافة باقة جديدة
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl border border-navy-100 p-16 text-center shadow-sm">
            <PackageIcon className="w-20 h-20 text-navy-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">لا توجد باقات حالياً</h3>
            <p className="text-navy-500">قم بإضافة أول باقة لتبدأ بعرض خدماتك للعملاء.</p>
            <button onClick={() => openForm()} className="mt-6 text-gold-600 font-bold hover:underline">
              + أضف باقة الآن
            </button>
          </div>
        )}

        {packages.map((pkg) => {
          let features: string[] = [];
          try { features = JSON.parse(pkg.features); } catch { features = []; }

          return (
            <div key={pkg.id} className="bg-white rounded-3xl border border-navy-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
              <div className="relative h-48 bg-navy-50 overflow-hidden">
                {pkg.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-navy-300">
                    <PackageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm font-medium">لا توجد صورة للباقة</span>
                  </div>
                )}
                
                {/* Image Overlays */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md ${pkg.isActive ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"}`}>
                    {pkg.isActive ? "ظاهرة للعملاء" : "مخفية (غير نشطة)"}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-black text-navy-900 bg-gold-400 px-3 py-1.5 rounded-full shadow-lg">
                    {pkg.type === "HAJJ" ? "حج" : pkg.type === "UMRAH" ? "عمرة" : "رحلة سياحية"}
                  </span>
                </div>
                {pkg.discount > 0 && (
                  <div className="absolute bottom-4 right-4 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                    <Percent className="w-3 h-3" /> خصم حصري
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-navy-900 mb-2 line-clamp-2 leading-tight">{pkg.title}</h3>
                <p className="text-sm text-navy-500 mb-4 line-clamp-2 leading-relaxed flex-1">{pkg.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-5 border-t border-navy-50 pt-4">
                  {pkg.duration && (
                    <div className="flex items-center gap-2 text-navy-600 text-xs font-medium">
                      <Calendar className="w-4 h-4 text-gold-500" />
                      {pkg.duration}
                    </div>
                  )}
                  {features.length > 0 && (
                    <div className="flex items-center gap-2 text-navy-600 text-xs font-medium">
                      <CheckCircle className="w-4 h-4 text-gold-500" />
                      {features.length} مزايا فريدة
                    </div>
                  )}
                  {(pkg.hotelMakkah || pkg.hotelMadinah) && (
                    <div className="col-span-2 flex items-start gap-2 text-navy-600 text-xs font-medium">
                      <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1 truncate">{pkg.hotelMakkah} {pkg.hotelMakkah && pkg.hotelMadinah && "-"} {pkg.hotelMadinah}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <div className="text-[10px] text-navy-400 font-bold uppercase tracking-wider mb-1">سعر الباقة</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-gold-600">{(pkg.price - pkg.discount).toLocaleString("ar-SA")}</span>
                      <span className="text-sm font-bold text-navy-500">ر.س</span>
                    </div>
                    {pkg.discount > 0 && (
                      <div className="text-xs text-red-400 font-bold line-through mt-0.5">
                        {pkg.price.toLocaleString("ar-SA")} ر.س
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => openForm(pkg)} className="w-10 h-10 flex items-center justify-center text-navy-400 hover:text-gold-600 bg-navy-50 hover:bg-gold-50 rounded-xl transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(pkg.id)} className="w-10 h-10 flex items-center justify-center text-navy-400 hover:text-red-500 bg-navy-50 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-navy-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-navy-100 flex flex-col max-h-[90vh] transform transition-all">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-navy-100 bg-navy-50/50 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
                  <PackageIcon className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-navy-900">
                    {editing ? "تعديل بيانات الباقة" : "إضافة باقة جديدة وتفاصيلها"}
                  </h2>
                  <p className="text-xs text-navy-500 font-medium mt-1">الرجاء إدخال تفاصيل وعروض الباقة لتظهر بأفضل صورة للعملاء</p>
                </div>
              </div>
              <button 
                onClick={() => setShowForm(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full text-navy-400 hover:text-navy-900 hover:bg-navy-100 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
              <div className="p-8 space-y-8">
                
                {/* Section 1: Basic Info */}
                <div className="space-y-5">
                  <h3 className="text-sm font-black text-navy-900 border-b border-navy-100 pb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gold-500" /> المعلومات الأساسية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">اسم الباقة وعنوانها</label>
                      <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="مثال: باقة عمرة رمضان الماسية 10 أيام"
                        className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">وصف تسويقي جذاب للباقة</label>
                      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                        placeholder="اكتب تفاصيل الرحلة وما يميزها لجذب العملاء..."
                        className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-medium text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none resize-none transition-all" />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">تصنيف الباقة</label>
                      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none cursor-pointer transition-all">
                        <option value="UMRAH">عمرة</option>
                        <option value="HAJJ">حج</option>
                        <option value="TRAVEL">رحلة سياحية</option>
                      </select>
                    </div>

                    {(adminRole === "SUPER_ADMIN" || adminRole === "ADMIN") && (
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">المكتب التابع له الباقة (للمشرفين فقط)</label>
                        <select value={form.agencyId || ""} onChange={(e) => setForm({ ...form, agencyId: e.target.value || null })}
                          className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none cursor-pointer transition-all">
                          <option value="">-- الإدارة الرئيسية (لا يتبع لمكتب محدد) --</option>
                          {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">مدة الرحلة</label>
                      <input type="text" value={form.duration || ""} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        placeholder="مثال: 10 أيام و 9 ليالي"
                        className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Pricing */}
                <div className="space-y-5 bg-navy-50/30 p-6 rounded-2xl border border-navy-100">
                  <h3 className="text-sm font-black text-navy-900 border-b border-navy-100 pb-2 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-gold-500" /> التسعير والخصومات
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">السعر الأساسي (ريال)</label>
                      <input type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        placeholder="5000"
                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-navy-200 text-sm font-bold text-navy-900 focus:border-gold-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">مبلغ الخصم (إن وجد)</label>
                      <input type="number" min="0" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                        placeholder="500"
                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-navy-200 text-sm font-bold text-navy-900 focus:border-gold-500 outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                      <span>السعر النهائي للعميل بعد الخصم:</span>
                      <span className="text-lg font-black">{Math.max(0, form.price - form.discount).toLocaleString("ar-SA")} ريال</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Accommodation */}
                <div className="space-y-5">
                  <h3 className="text-sm font-black text-navy-900 border-b border-navy-100 pb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold-500" /> السكن والفنادق (اختياري)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">فندق مكة المكرمة</label>
                      <input type="text" value={form.hotelMakkah || ""} onChange={(e) => setForm({ ...form, hotelMakkah: e.target.value })}
                        placeholder="مثال: فندق سويس أوتيل المقام (5 نجوم)"
                        className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">فندق المدينة المنورة</label>
                      <input type="text" value={form.hotelMadinah || ""} onChange={(e) => setForm({ ...form, hotelMadinah: e.target.value })}
                        placeholder="مثال: فندق بولمان زمزم المدينة (5 نجوم)"
                        className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                {/* Section 4: Features & Image */}
                <div className="space-y-5">
                  <h3 className="text-sm font-black text-navy-900 border-b border-navy-100 pb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-500" /> المزايا وصورة العرض
                  </h3>
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">مميزات الباقة (أدخل كل ميزة في سطر جديد)</label>
                      <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={5}
                        placeholder="تذاكر طيران ذهاب وعودة&#10;استقبال وتوديع في المطار&#10;وجبة إفطار يومية&#10;مزارات سياحية مع مرشد"
                        className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-medium text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none resize-none transition-all leading-relaxed" />
                    </div>
                    
                    <div>
                      <UploadImage
                        label="صورة الغلاف للباقة (إلزامية لجذب الانتباه)"
                        value={form.imageUrl}
                        onChange={(url) => setForm({ ...form, imageUrl: url })}
                      />
                    </div>

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
                          <span className="block text-sm font-black text-navy-900">تفعيل ونشر الباقة</span>
                          <span className="block text-xs text-navy-500 font-medium mt-0.5">عند الإلغاء سيتم إخفاء الباقة ولن يتمكن العملاء من حجزها.</span>
                        </div>
                      </label>
                    </div>

                  </div>
                </div>

              </div>
              
              {/* Modal Footer */}
              <div className="p-6 border-t border-navy-100 bg-white sticky bottom-0 z-20 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="flex-1 py-4 rounded-xl border-2 border-navy-100 text-sm font-black text-navy-600 hover:bg-navy-50 hover:text-navy-900 transition-all"
                >
                  إلغاء التعديلات
                </button>
                <button 
                  type="submit" 
                  disabled={saving || !form.title || !form.price}
                  className="flex-[2] btn-gold py-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-gold-500/20 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editing ? "حفظ وتحديث بيانات الباقة" : "اعتماد ونشر الباقة"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
