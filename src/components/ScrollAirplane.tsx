"use client";

import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

export default function ScrollAirplane() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage (0 to 100)
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const maxScroll = documentHeight - windowHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      
      setScrollProgress(progress);

      // Determine direction
      if (scrollTop > lastScrollY) {
        setScrollDirection("down");
      } else if (scrollTop < lastScrollY) {
        setScrollDirection("up");
      }
      
      setLastScrollY(scrollTop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div 
      className="fixed right-4 sm:right-8 z-40 w-10 h-[calc(100vh-8rem)] top-16 pointer-events-none hidden md:block"
    >
      {/* Scroll track (Optional, for visual guide) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-navy-800/30 rounded-full" />
      
      {/* The Airplane Indicator */}
      <button
        onClick={scrollToTop}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-auto transition-all duration-300 group focus:outline-none"
        style={{ 
          top: `${scrollProgress}%`,
          transform: `translate(-50%, -50%) rotate(${scrollDirection === "down" ? "90deg" : "-90deg"})`
        }}
        aria-label="العودة للأعلى"
      >
        <div className="relative">
          {/* Plane Glow */}
          <div className="absolute inset-0 bg-gold-400 blur-md opacity-50 group-hover:opacity-100 rounded-full transition-opacity" />
          
          <Plane className="w-8 h-8 text-gold-400 relative z-10 transition-transform group-hover:scale-110 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" fill="currentColor" />
          
          {/* Cloud/Trail effect when moving */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-1 bg-gradient-to-l from-gold-400 to-transparent blur-[1px] opacity-70" />
        </div>
      </button>
    </div>
  );
}
