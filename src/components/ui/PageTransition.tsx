import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
