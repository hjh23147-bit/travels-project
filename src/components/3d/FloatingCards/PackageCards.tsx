"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";

interface CardProps {
  angleOffset: number;
  title: string;
  price: string;
  hotel: string;
  days: string;
  badge: string;
  isVIP?: boolean;
}

function FloatingCard({ angleOffset, title, price, hotel, days, badge, isVIP = false }: CardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setSelectedPackage, setIsBookingModalOpen } = useAppStore();

  useFrame(({ clock, size }) => {
    if (meshRef.current) {
      // Scale orbit radius dynamically based on screen width
      const isMobile = size.width < 768;
      const orbitRadius = isMobile ? 3.3 : 4.4;

      // Calculate dynamic angle: static offset + slow rotation based on time (paused if hovered)
      const t = clock.getElapsedTime() * (hovered ? 0.015 : 0.11);
      const angle = angleOffset + t;

      // Position along the circular orbit on the X-Z plane
      meshRef.current.position.x = orbitRadius * Math.sin(angle);
      meshRef.current.position.z = orbitRadius * Math.cos(angle);
      
      // Zero-gravity waving float
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.7 + angleOffset) * 0.12;
    }
  });

  const handleBook = () => {
    setSelectedPackage({ title, price, hotel, days });
    setIsBookingModalOpen(true);
  };

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial transparent opacity={0} />

      <Html
        distanceFactor={6.2}
        center
        occlude
        className="select-none pointer-events-auto"
      >
        <div 
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`relative p-4 md:p-5 rounded-2xl md:rounded-3xl backdrop-blur-2xl shadow-2xl transition-all duration-300 scale-80 sm:scale-90 md:scale-100 ${
            hovered ? "scale-[0.85] sm:scale-[0.95] md:scale-105" : ""
          } ${
            isVIP 
              ? "bg-[#061129]/80 border border-gold-500/30" 
              : "bg-[#040a1b]/75 border border-cyan-500/25"
          }`}
          dir="rtl"
          style={{ 
            width: "270px",
            boxShadow: isVIP ? "0 20px 40px rgba(212,175,55,0.07)" : "0 20px 40px rgba(0,243,255,0.05)"
          }}
        >
          {/* Curved glowing sidebar overlay (curved glass panel aesthetic) */}
          <div className={`absolute inset-y-0 right-0 w-1 rounded-r-3xl bg-gradient-to-b from-transparent via-${isVIP ? "[#d4af37]" : "[#00f3ff]"} to-transparent shadow-[0_0_12px_#${isVIP ? "d4af37" : "00f3ff"}]`} />

          {/* Badge & Rating Header */}
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
              isVIP 
                ? "bg-gold-500/10 text-gold-400 border border-gold-500/25" 
                : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
            }`}>
              {badge}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-[10px] text-gold-400">★</span>
              ))}
            </div>
          </div>

          {/* Isometric SVG Kaaba Vector */}
          <div className="relative h-20 w-full flex items-center justify-center my-3 bg-navy-950/20 rounded-2xl overflow-hidden border border-white/5">
            <svg className="w-14 h-14 opacity-90 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]" viewBox="0 0 100 100">
              <path d="M 30 50 L 50 62 L 70 50 L 50 38 Z" fill="#111827" />
              <path d="M 30 50 L 50 62 L 50 82 L 30 70 Z" fill="#030712" />
              <path d="M 70 50 L 50 62 L 50 82 L 70 70 Z" fill="#1f2937" />
              <path d="M 30 54 L 50 66 L 50 69 L 30 57 Z" fill="#d4af37" />
              <path d="M 70 54 L 50 66 L 50 69 L 70 57 Z" fill="#d4af37" />
            </svg>
            <div className="absolute bottom-1.5 left-1.5 rotate-12">
              <svg className="w-8 h-5 text-cyan-400 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs font-black text-white text-center mb-2.5">{title}</h3>

          {/* Features */}
          <div className="space-y-1.5 border-t border-white/5 pt-2.5 mb-3 text-[11px] font-semibold text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-400">المدينة:</span>
              <span>{hotel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">السفر:</span>
              <span>{days}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">السعر:</span>
              <span className="text-gold-400 font-extrabold">{price} ريال</span>
            </div>
          </div>

          {/* Gold Button */}
          <button
            onClick={handleBook}
            className="w-full py-2 rounded-xl text-xs font-black transition-all bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 shadow-md cursor-pointer"
          >
            احجز الآن
          </button>
        </div>
      </Html>
    </mesh>
  );
}

const packageCarousel = [
  {
    angleOffset: 0,
    title: "باقة عمرة رمضان",
    price: "1,431",
    hotel: "فندق النور",
    days: "5 أيام",
    badge: "باقة التوفير",
    isVIP: false
  },
  {
    angleOffset: (2 * Math.PI) / 3,
    title: "باقة النور الملكية VIP",
    price: "14,500",
    hotel: "فندق التوحيد",
    days: "10 أيام",
    badge: "باقة ملكية",
    isVIP: true
  },
  {
    angleOffset: (4 * Math.PI) / 3,
    title: "باقة الهدى المميزة",
    price: "8,900",
    hotel: "فندق أنوار المدينة",
    days: "7 أيام",
    badge: "باقة ممتازة",
    isVIP: false
  }
];

export default function PackageCards() {
  return (
    <group>
      {packageCarousel.map((pkg, idx) => (
        <FloatingCard
          key={idx}
          angleOffset={pkg.angleOffset}
          title={pkg.title}
          price={pkg.price}
          hotel={pkg.hotel}
          days={pkg.days}
          badge={pkg.badge}
          isVIP={pkg.isVIP}
        />
      ))}
    </group>
  );
}
