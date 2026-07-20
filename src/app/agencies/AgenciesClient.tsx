"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, MapPin, BadgeCheck, ArrowLeft, Building2, Search, Phone, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AgenciesClient({ initialAgencies }: { initialAgencies: any[] }) {
  const [search, setSearch] = useState("");

  const filteredAgencies = initialAgencies.filter((agency) =>
    agency.name.toLowerCase().includes(search.toLowerCase()) || 
    (agency.description && agency.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto">
        
        {/* Search Bar */}
        <AnimatedSection direction="down" className="mb-12">
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-gold-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative flex items-center bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-2 transition-all duration-300 focus-within:ring-4 focus-within:ring-gold-500/20 focus-within:border-gold-300">
              <Search className="w-6 h-6 text-navy-400 ml-3 mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن مكتب بالاسم أو الوصف..."
                className="w-full bg-transparent border-none outline-none text-navy-900 placeholder:text-navy-300 font-bold text-lg h-12"
              />
            </div>
          </div>
        </AnimatedSection>

        {filteredAgencies.length === 0 ? (
          <AnimatedSection>
            <div className="text-center py-24 bg-white/50 backdrop-blur-sm shadow-xl rounded-3xl border border-navy-100 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-navy-300" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-3">لا توجد مكاتب مطابقة</h3>
              <p className="text-navy-500">جرب البحث بكلمات أخرى.</p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgencies.map((agency, idx) => (
              <AnimatedSection key={agency.id} delay={idx * 0.1}>
                <div className="card-luxury bg-white/80 backdrop-blur-lg rounded-[2rem] overflow-hidden border border-white/60 flex flex-col group relative hover:shadow-[0_20px_40px_rgba(11,30,45,0.08)] hover:border-gold-300 transition-all duration-500 h-full">
                  
                  {/* Banner Image */}
                  <div className="h-40 bg-navy-900 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={agency.coverImage || "https://images.unsplash.com/photo-1565552645632-d725e8bfc19a?w=800&q=80"} 
                      alt="Banner" 
                      className="w-full h-full object-cover opacity-40 group-hover:scale-110 group-hover:opacity-50 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/40 to-transparent" />
                    
                    {/* Verified Badge Top */}
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                      <BadgeCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">شريك موثوق</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-8 pt-0 flex-1 flex flex-col relative">
                    
                    {/* Agency Logo Overlapping Banner */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white shadow-2xl border-4 border-white flex items-center justify-center overflow-hidden -mt-12 sm:-mt-14 relative z-10 mb-5 group-hover:-translate-y-2 transition-transform duration-500">
                      {agency.logo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-12 h-12 text-gold-500" />
                      )}
                    </div>

                    {/* Header Info */}
                    <div className="mb-4 text-center">
                      <h3 className="text-xl sm:text-2xl font-black text-navy-900 group-hover:text-gold-600 transition-colors line-clamp-1 mb-1.5">
                        {agency.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gold-600 font-bold flex items-center justify-center gap-1.5">
                        <MapPin className="w-4 h-4" /> وكالة سفر وسياحة معتمدة
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-navy-500 leading-relaxed mb-8 line-clamp-3 font-light flex-1 text-center">
                      {agency.description || "وكالة سفر وسياحة رائدة تقدم برامج وخدمات متكاملة لضيوف الرحمن بأعلى مستويات الجودة والموثوقية."}
                    </p>

                    {/* Stats Box */}
                    <div className="grid grid-cols-2 gap-2 mb-6 bg-navy-50/50 p-4 rounded-2xl border border-navy-100/50">
                      <div className="text-center border-l border-navy-100">
                        <p className="text-2xl font-black text-navy-900 group-hover:text-gold-600 transition-colors">
                          {agency._count.packages}
                        </p>
                        <p className="text-[11px] sm:text-xs text-navy-500 font-bold mt-1">باقة نشطة</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-navy-900 group-hover:text-gold-600 transition-colors">
                          +{agency._count.leads + 50}
                        </p>
                        <p className="text-[11px] sm:text-xs text-navy-500 font-bold mt-1">عميل سعيد</p>
                      </div>
                    </div>

                    {/* Quick Contacts (Optional) */}
                    <div className="flex gap-2 mb-6">
                      {agency.whatsapp && (
                        <a 
                          href={`https://wa.me/${agency.whatsapp.replace(/\+/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-100 transition-colors py-2.5 rounded-xl flex items-center justify-center shadow-sm"
                          title="تواصل عبر واتساب"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </a>
                      )}
                      {agency.contactPhone && (
                        <a 
                          href={`tel:+${agency.contactPhone}`} 
                          className="flex-1 bg-navy-50 hover:bg-navy-900 text-navy-600 hover:text-white border border-navy-100 transition-colors py-2.5 rounded-xl flex items-center justify-center shadow-sm"
                          title="اتصال هاتفي"
                        >
                          <Phone className="w-5 h-5" />
                        </a>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link 
                      href={`/agency/${agency.id}`} 
                      className="btn-gold w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-sm hover:scale-[1.02] transition-all shadow-lg shadow-gold-500/20 mt-auto"
                    >
                      زيارة صفحة المكتب
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                    
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
