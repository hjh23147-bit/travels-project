"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag } from "lucide-react";

export default function SmartGreeter() {
  const [showExitIntent, setShowExitIntent] = useState(false);

  useEffect(() => {
    // Exit intent detection (only once per session)
    const handleMouseLeave = (e: MouseEvent) => {
      const hasSeenExitIntent = sessionStorage.getItem("hasSeenExitIntent");
      
      // Trigger only if mouse leaves from the top (going to tabs/URL bar) and hasn't been seen yet
      if (e.clientY <= 0 && !hasSeenExitIntent) {
        setShowExitIntent(true);
        sessionStorage.setItem("hasSeenExitIntent", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <>
      {/* 2. Exit Intent Modal */}
      <AnimatePresence>
        {showExitIntent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitIntent(false)}
              className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-navy-900 border border-gold-500/30 shadow-[0_0_100px_rgba(212,175,55,0.2)] rounded-3xl p-8 max-w-md w-full relative z-10 text-center overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/20 rounded-full blur-3xl" />
              
              <button 
                onClick={() => setShowExitIntent(false)}
                className="absolute top-4 left-4 text-navy-400 hover:text-white bg-navy-800 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 rotate-12">
                <Tag className="w-8 h-8 text-navy-900 -rotate-12" />
              </div>

              <h2 className="text-2xl font-black text-white mb-3">لحظة من فضلك! 🎁</h2>
              <p className="text-navy-200 text-sm mb-6 leading-relaxed">
                هل أنت متردد في اتخاذ القرار؟ نعلم أن التخطيط لرحلة يحتاج لعناية. 
                احصل على <strong className="text-amber-400">استشارة مجانية بالكامل</strong> مع خبير رحلات النور لتفصيل باقة تناسب ميزانيتك، ولا تدفع شيئاً الآن!
              </p>

              <div className="flex flex-col gap-3">
                <a href="tel:+967781668332" className="btn-gold w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2">
                  <Phone className="w-5 h-5" />
                  احجز استشارتك المجانية الآن
                </a>
                <button 
                  onClick={() => setShowExitIntent(false)}
                  className="text-navy-400 hover:text-white text-sm py-2"
                >
                  لا شكراً، ربما لاحقاً
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Phone icon for the exit intent
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Phone(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
