"use client";

import { useEffect, useState } from "react";
import { Package, Users, FileText, TrendingUp, Loader2, DollarSign, Activity } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface Stats {
  totalLeads: number;
  newLeads: number;
  activePackages: number;
  inquiries: number;
  totalBudget: number;
  completedLeads: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentLeads, setRecentLeads] = useState<Array<any>>([]);
  const [servicesData, setServicesData] = useState<{name: string; value: number; color: string}[]>([]);
  const [monthlyData, setMonthlyData] = useState<{name: string; الطلبات: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [leadsRes, packagesRes] = await Promise.all([
          fetch("/api/leads"),
          fetch("/api/packages"),
        ]);

        const leads = await leadsRes.json();
        const packages = await packagesRes.json();

        if (Array.isArray(leads)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newLeads = leads.filter((l: any) => l.status === "NEW").length;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const completedLeads = leads.filter((l: any) => l.status === "COMPLETED").length;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const totalBudget = leads.reduce((sum: number, l: any) => sum + (l.budget || 0), 0);

          setStats({
            totalLeads: leads.length,
            newLeads,
            completedLeads,
            activePackages: Array.isArray(packages) ? packages.length : 0,
            inquiries: 0,
            totalBudget,
          });

          // Calculate services distribution for PieChart
          const servicesCount: Record<string, number> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          leads.forEach((l: any) => {
            servicesCount[l.serviceType] = (servicesCount[l.serviceType] || 0) + 1;
          });

          setServicesData([
            { name: "حج", value: servicesCount["HAJJ"] || 0, color: "#1dc5d8" },
            { name: "عمرة", value: servicesCount["UMRAH"] || 0, color: "#5275a5" },
            { name: "تأشيرة", value: servicesCount["VISA"] || 0, color: "#34d399" },
            { name: "سفر عام", value: servicesCount["TRAVEL"] || 0, color: "#f59e0b" },
          ].filter(item => item.value > 0));

          // Mock Data for BarChart (Performance over months)
          setMonthlyData([
            { name: "يناير", الطلبات: 12 },
            { name: "فبراير", الطلبات: 19 },
            { name: "مارس", الطلبات: 15 },
            { name: "أبريل", الطلبات: 25 },
            { name: "مايو", الطلبات: 32 },
            { name: "يونيو", الطلبات: leads.length > 0 ? leads.length : 40 },
          ]);

          setRecentLeads(leads.slice(0, 6));
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdminName(sessionStorage.getItem("admin_name") || "مدير النظام");
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    );
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    NEW: { label: "جديد", color: "bg-blue-100 text-blue-700" },
    CONTACTED: { label: "تم التواصل", color: "bg-yellow-100 text-yellow-700" },
    WAITING_PAYMENT: { label: "بانتظار الدفع", color: "bg-orange-100 text-orange-700" },
    COMPLETED: { label: "مكتمل", color: "bg-emerald-100 text-emerald-700" },
    CANCELLED: { label: "ملغي", color: "bg-red-100 text-red-700" },
  };

  const serviceLabels: Record<string, string> = {
    HAJJ: "حج", UMRAH: "عمرة", VISA: "تأشيرة", TRAVEL: "سفر",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-900 border border-navy-700 p-3 rounded-lg shadow-xl text-white text-sm">
          <p className="font-bold">{`${payload[0].name || "الطلبات"} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Personalized Greeting */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 rounded-3xl p-8 sm:p-10 text-white shadow-lg border border-navy-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-3">
              مرحباً بك، <span className="text-gold-400">{adminName}</span> 👋
            </h1>
            <p className="text-navy-200 text-lg font-light max-w-2xl">
              إليك نظرة عامة شاملة على أداء منصة <span className="font-bold text-white">رحلات النور</span> ومؤشرات طلبات العملاء.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gold-400/20 text-gold-400 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-navy-200 font-bold uppercase tracking-wider mb-1">حالة النظام</p>
              <p className="text-sm font-black text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                يعمل بكفاءة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "إجمالي الطلبات", value: stats?.totalLeads || 0, icon: Users, color: "from-navy-700 to-navy-800" },
          { label: "طلبات جديدة", value: stats?.newLeads || 0, icon: TrendingUp, color: "from-gold-500 to-gold-600" },
          { label: "الطلبات المكتملة", value: stats?.completedLeads || 0, icon: Package, color: "from-emerald-600 to-emerald-700" },
          { label: "الميزانية المتوقعة", value: `${(stats?.totalBudget || 0).toLocaleString()} ريال`, icon: DollarSign, color: "from-amber-500 to-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-inner`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-navy-900 tracking-tight">{stat.value}</div>
            <div className="text-sm font-semibold text-navy-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Leads Growth */}
        <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-gold-500" />
            <h3 className="text-lg font-bold text-navy-900">نمو الطلبات الشهرية</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip content={customTooltip} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="الطلبات" fill="#d4af37" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Services Distribution */}
        <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-navy-900 mb-6">توزيع الخدمات المطلوبة</h3>
          {servicesData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={servicesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {servicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={customTooltip} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {servicesData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-navy-700 font-semibold">{item.name}</span>
                    <span className="text-navy-400">({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-navy-400">لا توجد بيانات كافية</div>
          )}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-2xl border border-navy-100 overflow-hidden shadow-sm flex flex-col">
        <div className="px-6 py-5 border-b border-navy-100 flex items-center justify-between bg-navy-50/30">
          <h3 className="text-lg font-bold text-navy-900">أحدث الطلبات الواردة</h3>
        </div>

        <div className="flex-1 overflow-x-auto">
          {recentLeads.length === 0 ? (
            <div className="px-6 py-16 text-center text-navy-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-gold-500" />
              <p className="font-medium">لا توجد طلبات واردة بعد</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-navy-50/50">
                  <th className="text-right px-6 py-3 text-xs font-bold text-navy-500">الاسم</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-navy-500">الخدمة</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-navy-500">الحالة</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-navy-500">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-navy-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-navy-900">{lead.name}</div>
                      <div className="text-xs text-navy-500" dir="ltr">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-navy-600">
                      {serviceLabels[lead.serviceType] || lead.serviceType}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusLabels[lead.status]?.color || "bg-gray-100 text-gray-600"}`}>
                        {statusLabels[lead.status]?.label || lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-500 font-medium">
                      {new Date(lead.createdAt).toLocaleDateString("ar-SA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
