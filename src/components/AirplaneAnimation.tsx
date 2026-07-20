"use client";

import { useEffect, useState } from "react";
import { Plane } from "lucide-react";
import { motion } from "framer-motion";
import type { TargetAndTransition, Transition } from "framer-motion";

export default function AirplaneAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const planes: {
    id: number;
    color: string;
    size: string;
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    transition: Transition;
  }[] = [
    {
      id: 1,
      color: "text-gold-500/30",
      size: "w-16 h-16",
      initial: { x: "-10vw", y: "80vh", rotate: 45, opacity: 0 },
      animate: { x: "110vw", y: "-20vh", opacity: [0, 1, 1, 0] },
      transition: { duration: 20, ease: "linear" as const, repeat: Infinity, delay: 0 },
    },
    {
      id: 2,
      color: "text-white/20",
      size: "w-10 h-10",
      initial: { x: "110vw", y: "30vh", rotate: -135, opacity: 0 },
      animate: { x: "-20vw", y: "110vh", opacity: [0, 0.8, 0.8, 0] },
      transition: { duration: 25, ease: "linear" as const, repeat: Infinity, delay: 2 },
    },
    {
      id: 3,
      color: "text-gold-300/20",
      size: "w-12 h-12",
      initial: { x: "-10vw", y: "30vh", rotate: 90, opacity: 0 },
      animate: { x: "110vw", y: "30vh", opacity: [0, 0.6, 0.6, 0] },
      transition: { duration: 30, ease: "linear" as const, repeat: Infinity, delay: 5 },
    },
    {
      id: 4,
      color: "text-emerald-400/20",
      size: "w-14 h-14",
      initial: { x: "110vw", y: "70vh", rotate: -90, opacity: 0 },
      animate: { x: "-10vw", y: "70vh", opacity: [0, 0.5, 0.5, 0] },
      transition: { duration: 22, ease: "linear" as const, repeat: Infinity, delay: 8 },
    },
    {
      id: 5,
      color: "text-white/25",
      size: "w-20 h-20",
      initial: { x: "30vw", y: "110vh", rotate: -15, opacity: 0 },
      animate: { x: "60vw", y: "-20vh", opacity: [0, 0.7, 0.7, 0] },
      transition: { duration: 18, ease: "linear" as const, repeat: Infinity, delay: 3 },
    }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      <div className="relative w-full h-full">
        {planes.map((plane) => (
          <motion.div
            key={plane.id}
            className={`absolute ${plane.color}`}
            initial={plane.initial}
            animate={plane.animate}
            transition={plane.transition}
          >
            <Plane className={plane.size} fill="currentColor" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
