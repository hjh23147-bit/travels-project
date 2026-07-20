"use client";

import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>


      {/* Page Content Fade In */}
      <motion.div
        key={`page-${pathname}`}
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
