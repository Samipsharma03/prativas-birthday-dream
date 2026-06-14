import { motion, AnimatePresence } from "framer-motion";

/**
 * BackButton
 * ----------
 * Small fixed-position "go back" pill rendered above all sections.
 * - Mobile-first: 44px tap target, safe-area aware.
 * - Auto-hides on the first (intro) step.
 * - Label tells the user where they're going back to.
 */

interface BackButtonProps {
  show: boolean;
  label: string;
  onClick: () => void;
}

export function BackButton({ show, label, onClick }: BackButtonProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="back-btn"
          type="button"
          onClick={onClick}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileTap={{ scale: 0.94 }}
          aria-label={`Go back to ${label}`}
          className="fixed left-4 z-[120] inline-flex h-11 items-center gap-2 rounded-full border border-[#c97b63]/30 bg-white/70 px-4 font-sans text-[11px] tracking-[0.22em] text-[#6b4a3a] uppercase backdrop-blur-md"
          style={{
            top: "calc(env(safe-area-inset-top, 0px) + 14px)",
            boxShadow: "0 6px 18px -8px rgba(150, 90, 60, 0.35)",
          }}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
          <span>{label}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default BackButton;
