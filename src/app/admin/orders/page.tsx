"use client";

import { useEffect, useState } from "react";
import { Search, Filter, ChevronDown, Loader2, MessageSquare, Save, Users, Calendar, MapPin, DollarSign, Activity } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  country: string;
  serviceType: string;
  travelersCount: number;
  travelDate: string;
  budget: number;
  status: string;
  notes: string | null;
  createdAt: string;
  agency?: { id: string; name: string } | null;
}

const statusOptions = [
  { value: "NEW", label: "جديد", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "CONTACTED", label: "تم التواصل", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "WAITING_PAYMENT", label: "بانتظار الدفع", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "COMPLETED", label: "مكتمل", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "CANCELLED", label: "ملغي", color: "bg-red-100 text-red-700 border-red-200" },
];

const serviceLabels: Record<string, { label: string; icon: string }> = {
  HAJJ: { label: "حج", icon: "🕋" },
  UMRAH: { label: "عمرة", icon: "🕌" },
  VISA: { label: "تأشيرة", icon: "📄" },
  TRAVEL: { label: "سفر وسياحة", icon: "✈️" },
};

export default function AdminOrdersPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [adminRole, setAdminRole] = useState("ADMIN");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdminRole(sessionStorage.getItem("admin_role") || "ADMIN");
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (Array.isArray(data)) setLeads(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function updateLead(id: string, status: string, leadNotes?: string) {
    setSaving(true);
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, notes: leadNotes }),
      });
      await fetchLeads();
      if (selectedLead?.id === id) {
        setSelectedLead((prev) => prev ? { ...prev, status, notes: leadNotes !== undefined ? leadNotes : prev.notes } : null);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search);
    const matchesStatus = !filterStatus || l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
          <div className="w-12 h-12 rounded-2xl bg-navy-50 border border-navy-100 flex items-center justify-center">
            <Activity className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-900">إدارة الطلبات</h1>
            <p className="text-sm text-navy-500 font-medium">متابعة العملاء وحالة الحجوزات</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-navy-50/50 p-2 rounded-2xl border border-navy-50">
          <div className="px-4 py-2 text-center border-l border-navy-100">
            <span className="block text-xl font-black text-navy-900">{filtered.length}</span>
            <span className="block text-[10px] uppercase tracking-wider text-navy-500 font-bold">إجمالي الطلبات</span>
          </div>
          <div className="px-4 py-2 text-center">
            <span className="block text-xl font-black text-gold-600">{filtered.filter(l => l.status === "NEW").length}</span>
            <span className="block text-[10px] uppercase tracking-wider text-navy-500 font-bold">جديد</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl border border-navy-100 p-4 shadow-sm flex flex-col sm:flex-row gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث برقم الهاتف أو اسم العميل..."
            className="w-full pr-12 pl-4 py-3 rounded-xl bg-navy-50/50 border border-navy-100 text-sm focus:bg-white focus:border-gold-400 focus:ring-4 focus:ring-gold-400/10 outline-none transition-all font-medium text-navy-900 placeholder:text-navy-400"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pr-11 pl-10 py-3 rounded-xl bg-navy-50/50 border border-navy-100 text-sm focus:bg-white focus:border-gold-400 focus:ring-4 focus:ring-gold-400/10 outline-none appearance-none font-bold text-navy-700 transition-all cursor-pointer"
          >
            <option value="">جميع الحالات</option>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-navy-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-navy-50/50 border-b border-navy-100">
                  <th className="px-6 py-4 text-xs font-bold text-navy-500 uppercase tracking-wider">العميل</th>
                  <th className="px-6 py-4 text-xs font-bold text-navy-500 uppercase tracking-wider">الخدمة</th>
                  {(adminRole === "SUPER_ADMIN" || adminRole === "ADMIN") && <th className="px-6 py-4 text-xs font-bold text-navy-500 uppercase tracking-wider">المكتب</th>}
                  <th className="px-6 py-4 text-xs font-bold text-navy-500 uppercase tracking-wider">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={(adminRole === "SUPER_ADMIN" || adminRole === "ADMIN") ? 4 : 3} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-navy-400">
                        <Users className="w-16 h-16 mb-4 opacity-20 text-gold-500" />
                        <p className="text-lg font-bold text-navy-900 mb-1">لا توجد طلبات</p>
                        <p className="text-sm">لم يتم العثور على أي طلبات تطابق معايير البحث.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setNotes(lead.notes || "");
                      }}
                      className={`group transition-all cursor-pointer ${
                        selectedLead?.id === lead.id 
                          ? "bg-gold-50/40" 
                          : "hover:bg-navy-50/30"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-navy-900 group-hover:text-gold-600 transition-colors mb-0.5">{lead.name}</span>
                          <span className="text-xs text-navy-500 font-medium" dir="ltr">{lead.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{serviceLabels[lead.serviceType]?.icon}</span>
                          <span className="text-sm font-bold text-navy-700">{serviceLabels[lead.serviceType]?.label || lead.serviceType}</span>
                        </div>
                      </td>
                      {(adminRole === "SUPER_ADMIN" || adminRole === "ADMIN") && (
                        <td className="px-6 py-4 text-sm font-semibold text-navy-600">
                          {lead.agency ? (
                            <span className="inline-flex items-center gap-1.5 bg-navy-50 border border-navy-100 px-2.5 py-1 rounded-lg text-xs">
                              {lead.agency.name}
                            </span>
                          ) : (
                            <span className="text-navy-300">-</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLead(lead.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer outline-none appearance-none pr-8 transition-colors ${
                              statusOptions.find((s) => s.value === lead.status)?.color || "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {statusOptions.map((s) => (
                              <option key={s.value} value={s.value} className="bg-white text-navy-900">{s.label}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Detail Sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          {selectedLead ? (
            <div className="bg-white rounded-3xl border border-navy-100 shadow-xl overflow-hidden flex flex-col">
              <div className="p-6 bg-gradient-to-br from-navy-900 to-navy-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
                <div className="relative z-10 flex flex-col gap-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-gold-500 text-navy-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      رقم الطلب #{selectedLead.id.substring(0, 6)}
                    </span>
                    <span className="text-2xl">{serviceLabels[selectedLead.serviceType]?.icon}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white leading-tight">{selectedLead.name}</h3>
                  <div className="flex items-center gap-2 text-navy-300 text-sm font-medium" dir="ltr">
                    <span>{selectedLead.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 bg-white">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-navy-50 p-3 rounded-2xl border border-navy-100">
                      <div className="flex items-center gap-2 text-navy-500 mb-1">
                        <MapPin className="w-4 h-4 text-gold-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">الوجهة/الدولة</span>
                      </div>
                      <p className="text-sm font-bold text-navy-900">{selectedLead.country}</p>
                    </div>
                    <div className="bg-navy-50 p-3 rounded-2xl border border-navy-100">
                      <div className="flex items-center gap-2 text-navy-500 mb-1">
                        <Calendar className="w-4 h-4 text-gold-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">التاريخ وتاريخ الطلب</span>
                      </div>
                      <p className="text-sm font-bold text-navy-900">{new Date(selectedLead.travelDate).toLocaleDateString("ar-SA")}</p>
                    </div>
                    <div className="bg-navy-50 p-3 rounded-2xl border border-navy-100">
                      <div className="flex items-center gap-2 text-navy-500 mb-1">
                        <Users className="w-4 h-4 text-gold-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">الأشخاص</span>
                      </div>
                      <p className="text-sm font-bold text-navy-900">{selectedLead.travelersCount} شخص</p>
                    </div>
                    <div className="bg-navy-50 p-3 rounded-2xl border border-navy-100">
                      <div className="flex items-center gap-2 text-navy-500 mb-1">
                        <DollarSign className="w-4 h-4 text-gold-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">الميزانية</span>
                      </div>
                      <p className="text-sm font-bold text-navy-900">{selectedLead.budget.toLocaleString("ar-SA")} ر.س</p>
                    </div>
                  </div>

                  {(adminRole === "SUPER_ADMIN" || adminRole === "ADMIN") && selectedLead.agency && (
                    <div className="pt-2">
                      <p className="text-xs font-bold text-navy-500 mb-1 uppercase tracking-wider">المكتب الموجه له</p>
                      <p className="text-sm font-bold text-navy-900 bg-gold-50 border border-gold-200 px-3 py-2 rounded-xl inline-block">
                        {selectedLead.agency.name}
                      </p>
                    </div>
                  )}

                  {/* Notes Section */}
                  <div className="pt-6 border-t border-navy-100">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-gold-500" />
                      <label className="text-sm font-black text-navy-900">ملاحظات المتابعة الداخلية</label>
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="أضف ملاحظات عن حالة العميل هنا..."
                      rows={4}
                      className="w-full p-4 rounded-2xl bg-white border border-navy-200 text-sm focus:border-gold-400 focus:ring-4 focus:ring-gold-400/10 outline-none resize-none font-medium text-navy-900 transition-all placeholder:text-navy-300"
                    />
                    <button
                      onClick={() => updateLead(selectedLead.id, selectedLead.status, notes)}
                      disabled={saving}
                      className="mt-3 w-full btn-gold py-3.5 rounded-xl text-sm font-black flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      حفظ التغييرات
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-navy-100 shadow-sm flex flex-col items-center justify-center p-12 h-full min-h-[400px] text-center">
              <div className="w-20 h-20 rounded-full bg-navy-50 flex items-center justify-center mb-6 border border-navy-100">
                <MessageSquare className="w-8 h-8 text-navy-300" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">اختر طلباً من القائمة</h3>
              <p className="text-sm text-navy-500 leading-relaxed">
                اضغط على أي طلب من الجدول لعرض التفاصيل الكاملة وتسجيل ملاحظات المتابعة وتحديث حالة الطلب.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
