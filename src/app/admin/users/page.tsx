"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, XCircle, Loader2, Save, Users, ShieldAlert, ShieldCheck, Mail, Lock, Building, User, Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  agencyId: string | null;
  agency?: { name: string } | null;
  createdAt: string;
}

const emptyUser = {
  name: "",
  email: "",
  password: "",
  role: "AGENCY_ADMIN",
  agencyId: "",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [agencies, setAgencies] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(emptyUser);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    superAdmins: users.filter(u => u.role === "SUPER_ADMIN" || u.role === "ADMIN").length,
    agencyAdmins: users.filter(u => u.role === "AGENCY_ADMIN").length
  };

  useEffect(() => {
    fetchUsers();
    fetchAgencies();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
      else if (data.error === "غير مصرح") {
        window.location.href = "/admin";
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function fetchAgencies() {
    try {
      const res = await fetch("/api/admin/agencies");
      const data = await res.json();
      if (Array.isArray(data)) setAgencies(data);
    } catch {}
  }

  function openForm(user?: User) {
    if (user) {
      setEditing(user);
      setForm({
        name: user.name,
        email: user.email,
        password: "", // Only update if typed
        role: user.role,
        agencyId: user.agencyId || "",
      });
    } else {
      setEditing(null);
      setForm(emptyUser);
    }
    setShowForm(true);
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form };
      if (!body.password && editing) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (body as any).password;
      }

      const res = await fetch("/api/admin/users", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { ...body, id: editing.id } : body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await fetchUsers();
      setShowForm(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الحساب بشكل نهائي؟ سيفقد المستخدم صلاحية الدخول للوحة التحكم.")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      await fetchUsers();
    } catch (e) {
      alert(e instanceof Error ? e.message : "فشل حذف المستخدم");
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-navy-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-900">إدارة المدراء والصلاحيات</h1>
            <p className="text-sm text-navy-500 font-medium">التحكم في حسابات فريق العمل ومدراء المكاتب</p>
          </div>
        </div>
        <button
          onClick={() => openForm()}
          className="btn-gold px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          إضافة مدير جديد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-navy-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-navy-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-navy-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-navy-500">إجمالي الحسابات</p>
            <p className="text-2xl font-black text-navy-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-navy-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-navy-500">مشرفين عامين</p>
            <p className="text-2xl font-black text-navy-900">{stats.superAdmins}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-navy-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold-50 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-navy-500">مدراء مكاتب</p>
            <p className="text-2xl font-black text-navy-900">{stats.agencyAdmins}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
        <input 
          type="text" 
          placeholder="ابحث بالاسم أو البريد الإلكتروني..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-12 pl-4 py-3.5 rounded-2xl bg-white border border-navy-100 text-sm font-bold text-navy-900 focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-navy-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-navy-50 text-navy-600 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5">الاسم والبريد</th>
                <th className="px-6 py-5">الصلاحية الممنوحة</th>
                <th className="px-6 py-5">المكتب التابع له</th>
                <th className="px-6 py-5">تاريخ الانضمام</th>
                <th className="px-6 py-5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-navy-400">
                      <ShieldCheck className="w-16 h-16 mb-4 opacity-20 text-gold-500" />
                      <p className="text-lg font-bold text-navy-900 mb-1">لا يوجد حسابات مطابقة</p>
                      <p className="text-sm">لم يتم العثور على أي مدير بهذا الاسم أو البريد.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-navy-50/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center text-navy-600 font-black text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-navy-900 text-sm">{user.name}</div>
                          <div className="text-xs text-navy-500 font-medium" dir="ltr">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(user.role === "SUPER_ADMIN" || user.role === "ADMIN") ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full shadow-sm">
                          <ShieldAlert className="w-3.5 h-3.5" /> مشرف عام
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 bg-gold-50 border border-gold-200 px-3 py-1.5 rounded-full shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5" /> مدير مكتب
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-navy-600">
                      {(user.role === "SUPER_ADMIN" || user.role === "ADMIN") ? (
                        <span className="text-navy-300">- صلاحيات شاملة -</span>
                      ) : (
                        user.agency ? (
                          <span className="inline-flex items-center gap-1.5 bg-navy-50 border border-navy-100 px-2.5 py-1 rounded-lg text-xs">
                            <Building className="w-3 h-3 text-navy-400" /> {user.agency.name}
                          </span>
                        ) : (
                          <span className="text-red-400 text-xs bg-red-50 px-2 py-1 rounded-md">غير محدد (خطأ)</span>
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy-500">
                      {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openForm(user)} 
                          className="p-2.5 text-navy-400 bg-navy-50 hover:bg-gold-50 hover:text-gold-600 hover:border-gold-200 border border-transparent rounded-xl transition-all"
                          title="تعديل الحساب"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="p-2.5 text-navy-400 bg-navy-50 hover:bg-red-50 hover:text-red-500 hover:border-red-200 border border-transparent rounded-xl transition-all"
                          title="حذف الحساب"
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
      {showForm && (
        <div className="fixed inset-0 bg-navy-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-navy-100 flex flex-col max-h-[90vh] transform transition-all">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-navy-100 bg-navy-50/50 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-navy-900">
                    {editing ? "تعديل بيانات المدير" : "إضافة حساب مدير جديد"}
                  </h2>
                  <p className="text-xs text-navy-500 font-medium mt-1">تحديد الهوية والصلاحيات للمستخدم</p>
                </div>
              </div>
              <button 
                onClick={() => setShowForm(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full text-navy-400 hover:text-navy-900 hover:bg-navy-100 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6 overflow-y-auto">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                    <input 
                      type="text" 
                      required
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="أدخل الاسم..."
                      className="w-full pr-11 pl-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">البريد الإلكتروني (لتسجيل الدخول)</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                    <input 
                      type="email" 
                      required
                      value={form.email} 
                      onChange={(e) => setForm({ ...form, email: e.target.value })} 
                      dir="ltr"
                      placeholder="admin@example.com"
                      className="w-full pr-11 pl-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all text-left" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2 flex justify-between">
                    <span>كلمة المرور</span>
                    {editing && <span className="text-navy-400 font-medium">(اتركها فارغة إذا لم ترد التغيير)</span>}
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                    <input 
                      type="password" 
                      required={!editing}
                      value={form.password} 
                      onChange={(e) => setForm({ ...form, password: e.target.value })} 
                      dir="ltr"
                      placeholder="••••••••"
                      className="w-full pr-11 pl-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all text-left" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-navy-100 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">مستوى الصلاحية</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${form.role === "AGENCY_ADMIN" ? "border-gold-500 bg-gold-50" : "border-navy-100 bg-white hover:border-navy-200"}`}>
                      <input type="radio" name="role" value="AGENCY_ADMIN" checked={form.role === "AGENCY_ADMIN"} onChange={() => setForm({ ...form, role: "AGENCY_ADMIN", agencyId: "" })} className="sr-only" />
                      <div className="text-center">
                        <ShieldCheck className={`w-5 h-5 mx-auto mb-1 ${form.role === "AGENCY_ADMIN" ? "text-gold-600" : "text-navy-400"}`} />
                        <span className={`text-xs font-bold ${form.role === "AGENCY_ADMIN" ? "text-gold-700" : "text-navy-600"}`}>مدير مكتب</span>
                      </div>
                    </label>
                    <label className={`relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${(form.role === "SUPER_ADMIN" || form.role === "ADMIN") ? "border-purple-500 bg-purple-50" : "border-navy-100 bg-white hover:border-navy-200"}`}>
                      <input type="radio" name="role" value="SUPER_ADMIN" checked={form.role === "SUPER_ADMIN" || form.role === "ADMIN"} onChange={() => setForm({ ...form, role: "SUPER_ADMIN", agencyId: "" })} className="sr-only" />
                      <div className="text-center">
                        <ShieldAlert className={`w-5 h-5 mx-auto mb-1 ${(form.role === "SUPER_ADMIN" || form.role === "ADMIN") ? "text-purple-600" : "text-navy-400"}`} />
                        <span className={`text-xs font-bold ${(form.role === "SUPER_ADMIN" || form.role === "ADMIN") ? "text-purple-700" : "text-navy-600"}`}>مشرف عام</span>
                      </div>
                    </label>
                  </div>
                </div>

                {form.role === "AGENCY_ADMIN" && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-xs font-bold text-navy-600 uppercase tracking-wider mb-2">تحديد المكتب التابع له</label>
                    <select 
                      value={form.agencyId} 
                      onChange={(e) => setForm({ ...form, agencyId: e.target.value })}
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-navy-50/50 border border-navy-200 text-sm font-bold text-navy-900 focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 outline-none transition-all cursor-pointer"
                    >
                      <option value="">-- يرجى اختيار المكتب --</option>
                      {agencies.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-6 flex gap-4 sticky bottom-0 bg-white z-10">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="flex-1 py-3.5 rounded-xl border-2 border-navy-100 text-sm font-black text-navy-600 hover:bg-navy-50 hover:text-navy-900 transition-all"
                >
                  إلغاء التعديلات
                </button>
                <button 
                  type="submit" 
                  disabled={saving || !form.name || !form.email || (!editing && !form.password) || (form.role === "AGENCY_ADMIN" && !form.agencyId)}
                  className="flex-1 btn-gold py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editing ? "حفظ وتحديث البيانات" : "اعتماد وإنشاء الحساب"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
