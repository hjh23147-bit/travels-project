"use client";

import { useState, useEffect } from "react";
import { UserPlus, CheckCircle, XCircle, Loader2, Mail, Phone, Clock, User } from "lucide-react";

type AgencyRequest = {
  id: string;
  agencyName: string;
  ownerName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
};

export default function AgencyRequestsPage() {
  const [requests, setRequests] = useState<AgencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
    if (!confirm(action === "APPROVE" ? "هل أنت متأكد من الموافقة وإنشاء حساب لهذا المكتب؟" : "هل أنت متأكد من رفض هذا الطلب؟")) return;
    
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/agency-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-navy-100">
        <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-gold-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-navy-900">طلبات انضمام المكاتب</h1>
          <p className="text-sm text-navy-500 font-medium">مراجعة واعتماد المكاتب والوكالات التي ترغب بالانضمام للمنصة</p>
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
            <p className="text-lg font-bold text-navy-900">لا توجد طلبات انضمام</p>
            <p className="text-sm">لم يقم أي مكتب بتقديم طلب انضمام حتى الآن.</p>
          </div>
        ) : (
          <div className="divide-y divide-navy-50">
            {requests.map((req) => (
              <div key={req.id} className="p-6 hover:bg-navy-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-navy-900">{req.agencyName}</h3>
                    {req.status === "PENDING" && <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">قيد الانتظار</span>}
                    {req.status === "APPROVED" && <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">معتمد</span>}
                    {req.status === "REJECTED" && <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">مرفوض</span>}
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
                    <Clock className="w-3.5 h-3.5" /> تاريخ الطلب: {new Date(req.createdAt).toLocaleString('ar-SA')}
                  </div>
                </div>

                {req.status === "PENDING" && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAction(req.id, "REJECT")}
                      disabled={processingId === req.id}
                      className="px-4 py-2 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> رفض
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "APPROVE")}
                      disabled={processingId === req.id}
                      className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      اعتماد وإنشاء حساب
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
