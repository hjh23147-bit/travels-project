"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

interface SmartTooltipProps {
  children: React.ReactNode;
  content: string;
  title?: string;
}

export default function SmartTooltip({ children, content, title }: SmartTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-flex items-center gap-1 cursor-help group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span className="border-b border-dashed border-gold-500/50 group-hover:border-gold-400 group-hover:text-gold-400 transition-colors">
        {children}
      </span>
      <Info className="w-3.5 h-3.5 text-gold-500/50 group-hover:text-gold-400 transition-colors" />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-1/2 translate-x-1/2 mb-3 w-64 z-50 pointer-events-none"
          >
            <div className="bg-navy-900 border border-gold-500/30 shadow-2xl rounded-xl p-4 relative">
              {/* Arrow pointing down */}
              <div className="absolute -bottom-2 right-1/2 translate-x-1/2 w-4 h-4 bg-navy-900 border-b border-l border-gold-500/30 rotate-[-45deg]" />
              
              {title && <h5 className="text-gold-400 font-bold text-xs mb-1.5">{title}</h5>}
              <p className="text-xs text-navy-100 leading-relaxed font-light relative z-10">
                {content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
