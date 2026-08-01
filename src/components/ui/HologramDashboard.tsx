"use client";

import { ThumbsUp, BadgeCheck, Award, Building2 } from "lucide-react";

export default function HologramDashboard() {
  return (
    <div 
      className="w-full max-w-6xl mx-auto px-6 py-5 rounded-3xl border border-[#00f3ff]/20 bg-[#061129]/65 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,243,255,0.08)] grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-white pointer-events-auto"
      dir="rtl"
    >
      {/* 1. LEFT SIDE (Cols 1-3): Holographic Radar */}
      <div className="md:col-span-3 flex items-center gap-4 border-l border-white/5 pl-4">
        {/* Rotating Circular Radar using pure SVG/CSS */}
        <div className="relative w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
          {/* Animated radar sweep */}
          <div className="absolute inset-0 border-t border-cyan-400 origin-center animate-spin" style={{ animationDuration: '4s' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping absolute" style={{ top: '25%', left: '30%' }} />
          <div className="w-1 h-1 rounded-full bg-cyan-400 absolute" style={{ top: '65%', left: '70%' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-gold-400 absolute" style={{ top: '40%', right: '25%' }} />
          {/* Concentric grid rings */}
          <div className="w-10 h-10 rounded-full border border-cyan-500/20 absolute" />
          <div className="w-5 h-5 rounded-full border border-cyan-500/10 absolute" />
        </div>
        
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400 font-extrabold mb-0.5">المستندات والمعلومات</p>
          <p className="text-sm font-black text-white">مركز العمليات الحية</p>
          <p className="text-[9px] text-gray-400 font-semibold mt-0.5">خطوط الطيران النشطة: ٥ اتجاهات</p>
        </div>
      </div>

      {/* 2. MIDDLE LEFT (Cols 4-6): General Counters */}
      <div className="md:col-span-3 flex flex-col justify-center text-center border-l border-white/5 px-4">
        <span className="text-2xl sm:text-3xl font-black text-gold-400 tracking-wider">+50K+</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-1">عميل سعيد بخدماتنا</span>
        <div className="h-0.5 w-12 bg-gold-500/20 mx-auto my-2 rounded-full" />
        <span className="text-xl font-bold text-white">98% نسبة الرضا</span>
      </div>

      {/* 3. MIDDLE RIGHT (Cols 7-9): Circular Progress Ring */}
      <div className="md:col-span-3 flex items-center justify-center gap-4 border-l border-white/5 px-4">
        <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
          <svg className="w-16 h-16 transform -rotate-90">
            {/* Background Circle */}
            <circle cx="32" cy="32" r="28" className="text-navy-950/40" strokeWidth="4" stroke="currentColor" fill="transparent" />
            {/* Foreground circle with 98% progress dash */}
            <circle 
              cx="32" 
              cy="32" 
              r="28" 
              className="text-gold-400" 
              strokeWidth="4" 
              stroke="currentColor" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 * (1 - 0.98)}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xs font-black text-white">98%</span>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider mb-0.5">جودة النسك والراحة</p>
          <p className="text-sm font-black text-white">نسبة الرضا المعتمدة</p>
          <p className="text-[9px] text-gray-400 font-medium mt-0.5">تقييم معتمد من ١٢ مكتب محلي</p>
        </div>
      </div>

      {/* 4. RIGHT SIDE (Cols 10-12): Glowing Line Wave Graph */}
      <div className="md:col-span-3 flex flex-col justify-center">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-xs font-extrabold text-cyan-400">أرقام وحجوزات النسك</span>
          <span className="text-[9px] text-gray-400">نشاط الحجز الأسبوعي</span>
        </div>
        
        {/* Glow neon wave SVG */}
        <div className="w-full h-10 relative">
          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00f3ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid Lines */}
            <line x1="0" y1="28" x2="100" y2="28" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            {/* Area Fill */}
            <path d="M 0 30 Q 15 12 30 18 T 60 8 T 85 14 T 100 6 L 100 30 Z" fill="url(#glowGrad)" />
            {/* Wave Stroke */}
            <path 
              d="M 0 30 Q 15 12 30 18 T 60 8 T 85 14 T 100 6" 
              fill="none" 
              stroke="#00f3ff" 
              strokeWidth="1.5"
              className="drop-shadow-[0_0_4px_rgba(0,243,255,0.8)]"
            />
            {/* Indicator Dot */}
            <circle cx="100" cy="6" r="2.5" fill="#00f3ff" className="animate-ping" />
            <circle cx="100" cy="6" r="1.5" fill="#ffffff" />
          </svg>
        </div>
      </div>
    </div>
  );
}
