"use client";

import { Html } from "@react-three/drei";
import { Star, Shield, ShieldCheck, Heart } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

interface CardProps {
  position: [number, number, number];
  title: string;
  price: string;
  stars: number;
  features: string[];
  badge: string;
  isVIP?: boolean;
}

function FloatingCard({ position, title, price, stars, features, badge, isVIP = false }: CardProps) {
  const { setSelectedPackage, setIsBookingModalOpen } = useAppStore();

  const handleBook = () => {
    setSelectedPackage({ title, price, features });
    setIsBookingModalOpen(true);
  };

  return (
    <mesh position={position}>
      {/* 1. Transparent 3D anchor mesh */}
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial transparent opacity={0} />

      {/* 2. Floating Drei HTML Node with Raycast Occlusion */}
      <Html
        distanceFactor={6}
        center
        occlude
        className="select-none pointer-events-auto"
      >
        <div 
          className={`w-72 p-5 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all duration-500 hover:-translate-y-2 text-right ${
            isVIP 
              ? "bg-[#0b1329]/85 border-gold-500/40 hover:border-gold-500 shadow-gold-500/5" 
              : "bg-white/90 border-navy-100 hover:border-navy-300"
          }`}
          dir="rtl"
          style={{ width: "290px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
              isVIP 
                ? "bg-gold-500/10 text-gold-400 border border-gold-500/20" 
                : "bg-navy-50 text-navy-600 border border-navy-100"
            }`}>
              {badge}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: stars }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              ))}
            </div>
          </div>

          {/* Title & Price */}
          <div className="space-y-1 mb-4">
            <h3 className={`text-base font-black ${isVIP ? "text-white" : "text-navy-900"}`}>{title}</h3>
            <p className={`text-xs ${isVIP ? "text-gray-400" : "text-navy-500"}`}>رحلة إيمانية متكاملة وشاملة</p>
          </div>

          <div className="flex items-baseline gap-1 mb-4">
            <span className={`text-2xl font-black ${isVIP ? "text-gold-400" : "text-navy-900"}`}>{price}</span>
            <span className={`text-[10px] ${isVIP ? "text-gray-400" : "text-navy-400"}`}>ريال سعودي / فرد</span>
          </div>

          {/* Features */}
          <ul className="space-y-2 mb-5 text-xs font-semibold">
            {features.map((feature, i) => (
              <li key={i} className={`flex items-center gap-2 ${isVIP ? "text-gray-300" : "text-navy-700"}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="truncate">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Booking CTA Button */}
          <button
            onClick={handleBook}
            className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              isVIP 
                ? "bg-gold-500 hover:bg-gold-600 text-navy-950" 
                : "bg-navy-900 hover:bg-gold-500 text-white hover:text-navy-950"
            }`}
          >
            احجز الآن
          </button>
        </div>
      </Html>
    </mesh>
  );
}

const packages = [
  {
    position: [-4.2, 1.2, 0.5] as [number, number, number],
    title: "باقة النور الملكية VIP",
    price: "14,500",
    stars: 5,
    features: [
      "فندق 5 نجوم صف أول على الحرم",
      "طيران مباشر ودرجة أولى VIP",
      "تنقلات خاصة عبر سيارات حديثة",
      "إرشاد ديني ومرافق خاص"
    ],
    badge: "الأكثر طلباً",
    isVIP: true
  },
  {
    position: [4.2, -0.6, 0.5] as [number, number, number],
    title: "باقة الهدى المميزة",
    price: "8,900",
    stars: 4,
    features: [
      "فندق 4 نجوم قريب من الحرمين",
      "تأشيرة وتأمين طبي شامل",
      "باصات نقل حديثة ومكيفة",
      "وجبات إفطار وبوفيه مجاني"
    ],
    badge: "باقة النخبة",
    isVIP: false
  },
  {
    position: [-0.2, -3.4, 1.2] as [number, number, number],
    title: "باقة التيسير الاقتصادية",
    price: "4,900",
    stars: 3,
    features: [
      "فنادق سكنية اقتصادية مريحة",
      "إصدار التأشيرة وحجز المواعيد",
      "مواصلات جماعية مجهزة",
      "دعم ميداني متواصل 24/7"
    ],
    badge: "باقة توفير",
    isVIP: false
  }
];

export default function PackageCards() {
  return (
    <group>
      {packages.map((pkg, idx) => (
        <FloatingCard
          key={idx}
          position={pkg.position}
          title={pkg.title}
          price={pkg.price}
          stars={pkg.stars}
          features={pkg.features}
          badge={pkg.badge}
          isVIP={pkg.isVIP}
        />
      ))}
    </group>
  );
}
