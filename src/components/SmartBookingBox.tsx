"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, Users, ShieldCheck, HeartHandshake, BadgePercent, Compass } from "lucide-react";

type BookingTab = "HAJJ" | "UMRAH" | "VISA" | "HOTEL";

export default function SmartBookingBox() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingTab>("UMRAH");
  const [guests, setGuests] = useState("1");
  const [date, setDate] = useState("");
  const [program, setProgram] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    query.append("type", activeTab);
    if (guests) query.append("guests", guests);
    if (date) query.append("date", date);
    if (program) query.append("program", program);
    
    router.push(`/book?${query.toString()}`);
  };

  const getProgramLabel = () => {
    switch (activeTab) {
      case "HAJJ": return "فئة الحج المطلوبة";
      case "UMRAH": return "نوع برنامج العمرة";
      case "VISA": return "نوع التأشيرة";
      case "HOTEL": return "تصنيف الفندق";
    }
  };

  const getProgramOptions = () => {
    switch (activeTab) {
      case "HAJJ":
        return [
          { value: "VIP", label: "حج فاخر VIP - خيام (أ)" },
          { value: "STANDARD", label: "حج اقتصادي - خيام (ب)" },
        ];
      case "UMRAH":
        return [
          { value: "ROYAL", label: "باقة النور الملكية (طيران)" },
          { value: "ECONOMY", label: "باقة النور الاقتصادية (براً)" },
        ];
      case "VISA":
        return [
          { value: "UMRAH_VISA", label: "تأشيرة عمرة إلكترونية" },
          { value: "TOURIST_VISA", label: "تأشيرة سياحية متعددة" },
        ];
      case "HOTEL":
        return [
          { value: "5_STAR", label: "فنادق 5 نجوم مطلة على الحرم" },
          { value: "4_STAR", label: "فنادق 4 نجوم قريبة" },
          { value: "3_STAR", label: "فنادق 3 نجوم اقتصادية" },
        ];
    }
  };

  return (
    <div className="glass-dark rounded-3xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto w-full relative z-20 border border-white/10 animate-fade-in-up">
      {/* Top Tabs */}
      <div className="flex border-b border-white/10 pb-4 mb-6 gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
        {(["UMRAH", "HAJJ", "VISA", "HOTEL"] as BookingTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const labels: Record<BookingTab, string> = {
            UMRAH: "عمرة",
            HAJJ: "حج",
            VISA: "تأشيرات",
            HOTEL: "فنادق",
          };
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setProgram("");
              }}
              className={`px-6 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-gold-500 text-white shadow-lg shadow-gold-500/20"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Input 1: Program/Option Selection */}
          <div className="relative">
            <label className="block text-xs font-bold text-gold-400 mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              {getProgramLabel()}
            </label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all appearance-none cursor-pointer text-sm"
            >
              <option value="" className="text-navy-900">الكل / اختر برنامجاً...</option>
              {getProgramOptions().map((opt) => (
                <option key={opt.value} value={opt.value} className="text-navy-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Input 2: Number of Travelers */}
          <div className="relative">
            <label className="block text-xs font-bold text-gold-400 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              عدد الأشخاص
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all appearance-none cursor-pointer text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, "9+"].map((num) => (
                <option key={num} value={num.toString()} className="text-navy-900">
                  {num} {typeof num === "number" ? (num > 2 && num < 11 ? "أشخاص" : "شخص") : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Input 3: Date */}
          <div className="relative">
            <label className="block text-xs font-bold text-gold-400 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              تاريخ السفر المتوقع
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-sm block"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        {/* Submit Button & Trust Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 pt-6">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-white/60 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gold-500" />
              <span>حجوزات آمنة 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-gold-500" />
              <span>دعم على مدار الساعة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BadgePercent className="w-4 h-4 text-gold-500" />
              <span>ضمان أفضل الأسعار</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full sm:w-auto btn-gold px-10 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 cursor-pointer h-[50px]"
          >
            <Search className="w-5 h-5" />
            <span>ابحث الآن</span>
          </button>
        </div>
      </form>
    </div>
  );
}
