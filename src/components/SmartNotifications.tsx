"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Star, Users, MapPin, BellRing } from "lucide-react";

type NotificationMsg = {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  desc: string;
  time: string;
  color: string;
};

const notifications: NotificationMsg[] = [
  { id: 1, icon: Plane, title: "حجز جديد!", desc: "عميل من صنعاء أتم حجز باقة العمرة البرية للتو.", time: "منذ 3 دقائق", color: "text-gold-400" },
  { id: 2, icon: Users, title: "طلب مرتفع 🔥", desc: "15 شخصاً من عدن يتصفحون باقة الطيران المباشر الآن.", time: "الآن", color: "text-amber-400" },
  { id: 3, icon: MapPin, title: "تأشيرة جاهزة 🛂", desc: "تم استخراج تأشيرة سياحية لعميل من حضرموت خلال 18 ساعة.", time: "منذ 15 دقيقة", color: "text-emerald-400" },
  { id: 4, icon: Star, title: "تقييم جديد ⭐️", desc: "أضاف أبو يمن تقييم 5 نجوم لباقة الحج الفاخرة.", time: "منذ ساعة", color: "text-amber-400" },
  { id: 5, icon: BellRing, title: "تنبيه مقاعد ⚠️", desc: "تبقى 3 مقاعد فقط في رحلة العمرة الأسبوع القادم من تعز.", time: "تحديث مباشر", color: "text-red-400" },
];

export default function SmartNotifications() {
  const [currentNotif, setCurrentNotif] = useState<NotificationMsg | null>(null);

  const showRandomNotification = useCallback(() => {
    const random = notifications[Math.floor(Math.random() * notifications.length)];
    setCurrentNotif(random);

    // Hide after 6 seconds
    setTimeout(() => {
      setCurrentNotif(null);
    }, 6000);
  }, []);

  useEffect(() => {
    // Show first notification after 5 seconds
    const initialTimer = setTimeout(() => {
      showRandomNotification();
    }, 5000);

    // Then cycle every 25 seconds
    const interval = setInterval(() => {
      showRandomNotification();
    }, 25000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [showRandomNotification]);

  return (
    <AnimatePresence>
      {currentNotif && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 max-w-sm w-[calc(100%-3rem)] cursor-pointer"
          onClick={() => setCurrentNotif(null)}
        >
          <div className="bg-navy-900/90 backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-2xl p-4 relative overflow-hidden group hover:border-gold-500/30 transition-colors">
            {/* Glowing orb effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl" />
            
            <div className="flex gap-4 relative z-10">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center border border-white/5">
                  <currentNotif.icon className={`w-5 h-5 ${currentNotif.color}`} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-white">{currentNotif.title}</h4>
                  <span className="text-[10px] text-navy-400">{currentNotif.time}</span>
                </div>
                <p className="text-xs text-navy-200 leading-relaxed">
                  {currentNotif.desc}
                </p>
              </div>
            </div>
            
            {/* Progress bar */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-gold-500/30"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
