"use client";

export default function HologramDashboard() {
  return (
    <div 
      className="w-full max-w-6xl mx-auto px-4 md:px-6 py-3.5 md:py-5 rounded-2xl md:rounded-3xl border border-[#00f3ff]/20 bg-[#061129]/65 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,243,255,0.08)] grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-6 items-center text-white pointer-events-auto"
      dir="rtl"
    >
      {/* 1. LEFT SIDE (Cols 1-3): Holographic Radar - Hidden on mobile for spacing */}
      <div className="hidden md:flex md:col-span-3 items-center gap-4 border-l border-white/5 pl-4">
        <div className="relative w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
          <div className="absolute inset-0 border-t border-cyan-400 origin-center animate-spin" style={{ animationDuration: '4s' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping absolute" style={{ top: '25%', left: '30%' }} />
          <div className="w-1 h-1 rounded-full bg-cyan-400 absolute" style={{ top: '65%', left: '70%' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-gold-400 absolute" style={{ top: '40%', right: '25%' }} />
          <div className="w-10 h-10 rounded-full border border-cyan-500/20 absolute" />
          <div className="w-5 h-5 rounded-full border border-cyan-500/10 absolute" />
        </div>
        
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-cyan-400 font-extrabold mb-0.5">المستندات والمعلومات</p>
          <p className="text-sm font-black text-white">مركز العمليات الحية</p>
          <p className="text-[9px] text-gray-400 font-semibold mt-0.5">خطوط الطيران النشطة: ٥ اتجاهات</p>
        </div>
      </div>

      {/* 2. MIDDLE LEFT (Cols 4-6 on desktop, Col 1 on mobile): General Counters */}
      <div className="col-span-1 md:col-span-3 flex flex-col justify-center text-center md:border-l border-white/5 px-2 md:px-4">
        <span className="text-lg md:text-3xl font-black text-gold-400 tracking-wider">+50K+</span>
        <span className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest font-black mt-0.5 md:mt-1">عميل سعيد</span>
        <div className="hidden md:block h-0.5 w-12 bg-gold-500/20 mx-auto my-2 rounded-full" />
        <span className="text-xs md:text-xl font-bold text-white mt-1">98% نسبة الرضا</span>
      </div>

      {/* 3. MIDDLE RIGHT (Cols 7-9 on desktop, Col 1 on mobile): Circular Progress Ring */}
      <div className="col-span-1 md:col-span-3 flex items-center justify-center gap-2 md:gap-4 px-2 md:px-4">
        <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
          <svg className="w-12 h-12 md:w-16 md:h-16 transform -rotate-90">
            {/* Mobile sizing (r=20) */}
            <circle cx="24" cy="24" r="20" className="text-navy-950/40 md:hidden" strokeWidth="3" stroke="currentColor" fill="transparent" />
            <circle 
              cx="24" 
              cy="24" 
              r="20" 
              className="text-gold-400 md:hidden" 
              strokeWidth="3" 
              stroke="currentColor" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 20}
              strokeDashoffset={2 * Math.PI * 20 * (1 - 0.98)}
              strokeLinecap="round"
            />
            {/* Desktop sizing (r=28) */}
            <circle cx="32" cy="32" r="28" className="hidden md:block text-navy-950/40" strokeWidth="4" stroke="currentColor" fill="transparent" />
            <circle 
              cx="32" 
              cy="32" 
              r="28" 
              className="hidden md:block text-gold-400" 
              strokeWidth="4" 
              stroke="currentColor" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 * (1 - 0.98)}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[9px] md:text-xs font-black text-white">98%</span>
        </div>
        
        <div className="text-right">
          <p className="text-[8px] md:text-[10px] text-cyan-400 font-extrabold uppercase mb-0.5">معدل الجودة</p>
          <p className="text-xs md:text-sm font-black text-white">الرضا المعتمد</p>
        </div>
      </div>

      {/* 4. RIGHT SIDE (Cols 10-12): Glowing Line Wave Graph - Hidden on mobile */}
      <div className="hidden md:flex md:col-span-3 flex-col justify-center">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-xs font-extrabold text-cyan-400">أرقام وحجوزات النسك</span>
          <span className="text-[9px] text-gray-400">نشاط الحجز الأسبوعي</span>
        </div>
        
        <div className="w-full h-10 relative">
          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00f3ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="28" x2="100" y2="28" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            <path d="M 0 30 Q 15 12 30 18 T 60 8 T 85 14 T 100 6 L 100 30 Z" fill="url(#glowGrad)" />
            <path 
              d="M 0 30 Q 15 12 30 18 T 60 8 T 85 14 T 100 6" 
              fill="none" 
              stroke="#00f3ff" 
              strokeWidth="1.5"
              className="drop-shadow-[0_0_4px_rgba(0,243,255,0.8)]"
            />
            <circle cx="100" cy="6" r="2.5" fill="#00f3ff" className="animate-ping" />
            <circle cx="100" cy="6" r="1.5" fill="#ffffff" />
          </svg>
        </div>
      </div>
    </div>
  );
}
