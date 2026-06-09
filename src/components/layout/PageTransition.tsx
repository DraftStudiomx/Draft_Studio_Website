"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const variants = {
  hidden: { opacity: 0, y: 12 },
  enter:  { opacity: 1, y: 0 },
  exit:   { opacity: 0, y: -8 },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname        = usePathname();
  const reduceMotion    = useReducedMotion();

  /* When user prefers reduced motion, skip transition entirely */
  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
