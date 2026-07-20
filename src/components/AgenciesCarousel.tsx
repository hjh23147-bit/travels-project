"use client";

import { useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft, Building2, Phone, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Agency {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  contactPhone: string | null;
  isActive: boolean;
}

interface AgenciesCarouselProps {
  agencies: Agency[];
}

export default function AgenciesCarousel({ agencies }: AgenciesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // We duplicate the agencies array to create a seamless infinite scroll loop
  const displayAgencies = agencies.length > 0 ? [...agencies, ...agencies, ...agencies, ...agencies] : [];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 360;
      const amount = direction === "right" ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || agencies.length === 0) return;

    let animationId: number;
    let isPaused = false;

    const scrollStep = () => {
      if (!isPaused && el) {
        // In RTL, scrollLeft is usually 0 to negative.
        // Subtracting 1 moves it to the left steadily.
        el.scrollLeft -= 1.5; 
        
        // Seamless loop reset:
        // When we've scrolled past one full original set (1/4th of the duplicated array)
        // we reset scrollLeft back to 0. Since the sets are identical, the jump is invisible.
        // We use Math.abs because RTL scrollLeft can be negative
        const singleSetWidth = el.scrollWidth / 4;
        if (Math.abs(el.scrollLeft) >= singleSetWidth) {
          el.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scrollStep);
    };

    // Start animation
    animationId = requestAnimationFrame(scrollStep);

    // Event listeners to pause on interaction
    const pause = () => { isPaused = true; };
    const play = () => { isPaused = false; };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", play);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", play);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", play);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", play);
    };
  }, [agencies]);

  if (!agencies || agencies.length === 0) {
    return (
      <div className="text-center py-12 text-navy-400">
        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50 text-gold-500" />
        <p className="text-lg font-bold">لا توجد مكاتب معرفة حالياً</p>
        <p className="text-sm mt-1">سيتم عرض المكاتب المعتمدة هنا فور إضافتها.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Navigation Buttons - Absolute positioning */}
      <div className="absolute top-1/2 -translate-y-1/2 -right-6 z-20 hidden md:block">
        <button
          onClick={() => scroll("right")}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border border-navy-50 text-navy-900 hover:text-gold-500 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="السابق"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 -left-6 z-20 hidden md:block">
        <button
          onClick={() => scroll("left")}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border border-navy-50 text-navy-900 hover:text-gold-500 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="التالي"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Carousel Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-hidden pb-10 pt-6 relative px-4 sm:px-8 cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayAgencies.map((agency, index) => {
          // Keep the original highlighting logic based on the original index
          const originalIndex = index % agencies.length;
          const isFeatured = originalIndex === 2 || (agencies.length < 3 && originalIndex === 0);

          return (
            <Link
              href={`/agency/${agency.id}`}
              key={`${agency.id}-${index}`}
              className={`relative flex-shrink-0 w-[85vw] sm:w-[380px] bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex items-center p-3 sm:p-4 border group ${
                isFeatured ? "border-gold-400/50 shadow-md" : "border-navy-50 hover:border-gold-300/50"
              }`}
            >
              {/* Featured Badge */}
              {isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-white text-[11px] font-bold px-5 py-1 rounded-full shadow-md z-10 whitespace-nowrap">
                  الأكثر طلباً
                </div>
              )}

              {/* Content (Text on right in RTL) */}
              <div className="flex-1 pl-4 flex flex-col justify-center">
                <h3 className="text-base sm:text-lg font-extrabold text-navy-900 mb-1.5 group-hover:text-gold-600 transition-colors line-clamp-1">
                  {agency.name}
                </h3>
                <p className="text-xs text-navy-500 mb-4 line-clamp-2 leading-relaxed">
                  {agency.description || "خدمات راقية وحجوزات متكاملة لضيوف الرحمن بكفاءة وجودة عالية."}
                </p>
                
                {/* Footer Icon + Text */}
                <div className="flex items-center gap-1.5 text-gold-600 text-[11px] sm:text-xs font-bold">
                  {isFeatured ? (
                    <>
                      <div className="w-4 h-4 rounded-full border border-gold-500 flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-gold-500" />
                      </div>
                      <span>50+ عميل سعيد</span>
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 rounded-full border border-gold-500 flex items-center justify-center">
                        <ArrowLeft className="w-2.5 h-2.5 text-gold-500" />
                      </div>
                      <span>دعم كامل</span>
                    </>
                  )}
                </div>
              </div>

              {/* Image (Left side) */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 relative bg-navy-50">
                <img 
                  src={agency.logo || "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80"}
                  alt={agency.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-navy-900/5 group-hover:bg-transparent transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
