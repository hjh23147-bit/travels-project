/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Megaphone, Plus, Trash2, Loader2, Image as ImageIcon, XCircle, Send, Calendar, Building, Info } from "lucide-react";

interface Ad {
  id: string;
  title: string;
  content: string | null;
  imageUrl: string | null;
  agencyId: string;
  createdAt: string;
  agency: { name: string };
}

interface Agency {
  id: string;
  name: string;
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [agencyId, setAgencyId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  async function fetchData(isSuperAdmin: boolean) {
    try {
      const [adsRes, agenciesRes] = await Promise.all([
        fetch("/api/admin/ads"),
        isSuperAdmin ? fetch("/api/admin/agencies") : Promise.resolve({ json: () => Promise.resolve([]) } as Response)
      ]);
      
      const adsData = await adsRes.json();
      if (Array.isArray(adsData)) {
        setAds(adsData);
      } else {
        setAds([]);
        if (adsData.error === "غير مصرح") {
          window.location.href = "/admin/login";
        }
      }

      if (isSuperAdmin) {
        const agenciesData = await agenciesRes.json();
        if (Array.isArray(agenciesData)) {
          setAgencies(agenciesData);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const role = sessionStorage.getItem("admin_role");
    const isSuper = role === "SUPER_ADMIN" || role === "ADMIN";
    setTimeout(() => {
      setIsAdmin(isSuper);
    }, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData(isSuper);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("agencyId", agencyId);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/admin/ads", {
        method: "POST",
        body: formData,
      });
      const newAd = await res.json();
      if (!res.ok) throw new Error(newAd.error);
      
      setAds([newAd, ...ads]);
      closeForm();
    } catch (e) {
      alert(e instanceof Error ? e.message : "حدث خطأ أثناء الرفع");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان نهائياً؟")) return;
    try {
      await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
      setAds(ads.filter(a => a.id !== id));
    } catch {
      alert("فشل الحذف");
    }
  }

  function closeForm() {
    setShowForm(false);
    setTitle("");
    setContent("");
    setImageFile(null);
    setImagePreview(null);
    setAgencyId("");
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
            <Megaphone className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-900">الإعلانات والمقالات الترويجية</h1>
            <p className="text-sm text-navy-500 font-medium">نشر وإدارة الإعلانات لتظهر للعملاء في واجهة الموقع</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-gold px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          إضافة إعلان جديد
        </button>
      </div>

      {/* Modern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ads.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-navy-100 p-16 text-center shadow-sm">
            <Megaphone className="w-20 h-20 text-navy-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">لا توجد إعلانات منشورة</h3>
            <p className="text-navy-500">قم بنشر أول إعلان لك ليظهر للعملاء والزوار بشكل مباشر.</p>
            <button onClick={() => setShowForm(true)} className="mt-6 text-gold-600 font-bold hover:underline">
              + إنشاء إعلان جديد
            </button>
          </div>
        ) : (
          ads.map(ad => (
            <div key={ad.id} className="bg-white rounded-3xl border border-navy-100 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
              <div className="relative h-56 bg-navy-50 overflow-hidden">
                {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-navy-300">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm font-medium">لا توجد صورة مرفقة</span>
                  </div>
                )}
                
                {/* Overlays */}
                <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-start">
                  {isAdmin ? (
                    <span className="bg-white/90 backdrop-blur-sm text-navy-900 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                      <Building className="w-3 h-3 text-gold-600" /> {ad.agency.name}
                    </span>
                  ) : <div></div>}
                  <button 
                    onClick={() => handleDelete(ad.id)} 
                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-red-500 text-white flex items-center justify-center transition-colors shadow-sm"
                    title="حذف الإعلان"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-navy-900 mb-3 leading-tight">{ad.title}</h3>
                <p className="text-sm text-navy-600 line-clamp-3 mb-4 leading-relaxed flex-1">
                  {ad.content}
                </p>
                <div className="pt-4 border-t border-navy-50 flex items-center gap-2 text-xs font-bold text-navy-400">
                  <Calendar className="w-4 h-4 text-gold-500" />
                  تم النشر في: <span dir="ltr">{new Date(ad.createdAt).toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modern Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-navy-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-navy-100 flex flex-col max-h-[90vh] transform transition-all">
            
            <div className="px-8 py-6 border-b border-navy-100 bg-navy-50/50 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-navy-900">إنشاء إعلان أو مقال جديد</h2>
                  <p className="text-xs text-navy-500 font-medium mt-1">صياغة محتوى ترويجي جذاب ونشره مباشرة</p>
                </div>
              </div>
              <button 
                onClick={closeForm} 
                className="w-10 h-10 flex items-center justify-center rounded-full text-navy-400 hover:text-navy-900 hover:bg-navy-100 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex-1 overflow-y-auto">
              <div className="p-8 space-y-6">
                
                {/* Image Upload Area */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider">الصورة الإعلانية الأساسية</label>
                  <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-navy-200 bg-navy-50 hover:bg-navy-100 transition-colors cursor-pointer flex flex-col items-center justify-center h-48">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
                          <ImageIcon className="w-5 h-5 text-gold-500" />
                        </div>
                        <p className="text-sm font-bold text-navy-700">اضغط لرفع صورة إعلانية جذابة</p>
                        <p className="text-xs text-navy-400 mt-1">يدعم JPG, PNG بجودة عالية</p>
                      </div>
                    )}
                    {imagePreview && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="text-white font-bold text-sm">تغيير الصورة</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">عنوان الإعلان</label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="اكتب عنواناً جذاباً يلفت الانتباه..."
                      className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all"
                    />
                  </div>
                  
                  {isAdmin && (
                    <div>
                      <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">المكتب الناشر للاعلان</label>
                      {agencies.length === 0 ? (
                         <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm font-bold text-red-600">
                           ⚠️ يرجى إضافة مكتب واحد على الأقل في قسم المكاتب لتتمكن من نشر إعلان.
                         </div>
                      ) : (
                        <select
                          required
                          value={agencyId}
                          onChange={(e) => setAgencyId(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all cursor-pointer"
                        >
                          <option value="">-- يرجى اختيار المكتب --</option>
                          {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">محتوى الإعلان وتفاصيله</label>
                    <textarea
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={5}
                      placeholder="اشرح تفاصيل العرض أو الإعلان هنا بشكل واضح..."
                      className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-medium text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none resize-none transition-all leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 bg-blue-50 text-blue-800 rounded-xl text-xs font-medium border border-blue-100">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                  <p>الإعلانات المنشورة ستظهر فوراً في الصفحة المخصصة للمكتب، وتساعد العملاء في متابعة أحدث عروضكم وأخباركم.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-navy-100 bg-white sticky bottom-0 z-10 flex gap-4">
                <button 
                  type="button" 
                  onClick={closeForm} 
                  className="flex-1 py-3.5 rounded-xl border-2 border-navy-100 text-sm font-black text-navy-600 hover:bg-navy-50 hover:text-navy-900 transition-all"
                >
                  إلغاء التعديلات
                </button>
                <button 
                  type="submit" 
                  disabled={saving || !title || !content || (isAdmin && !agencyId)}
                  className="flex-[2] btn-gold py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-gold-500/20 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  اعتماد ونشر الإعلان فوراً
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
