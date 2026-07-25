import { motion } from "framer-motion";
import { SakuraPetals } from "./SakuraPetals";
import { Moon } from "./Moon";

/**
 * BirthdayIntro — Warm Minimal edition
 * Soft ivory backdrop, gentle peach petals, quiet typography.
 */

interface BirthdayIntroProps {
  onContinue: () => void;
  active?: boolean;
}

const STAGGER = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function BirthdayIntro({ onContinue, active = true }: BirthdayIntroProps) {
  return (
    <section
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-start gap-6 overflow-hidden px-6 pt-[10svh] pb-12 text-center"
      aria-label="Birthday introduction"
      style={{
        background:
          "radial-gradient(ellipse at 50% 25%, #fdf5ec 0%, #f7e6d4 55%, #efd6bf 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative z-10 shrink-0"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Moon size={160} />
        </motion.div>
      </motion.div>

      <SakuraPetals count={10} />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-5 sm:gap-6">
        <motion.p
          {...STAGGER}
          animate={active ? STAGGER.animate : STAGGER.initial}
          transition={{ delay: 0.3, duration: 1.1, ease: "easeOut" }}
          className="font-script text-base text-[#a87358] sm:text-lg"
        >
          a heartfelt tribute for
        </motion.p>

        <motion.h2
          {...STAGGER}
          animate={active ? STAGGER.animate : STAGGER.initial}
          transition={{ delay: 1.4, duration: 1.2, ease: "easeOut" }}
          className="font-display text-xl font-light italic text-[#5a3d2e]/85 sm:text-2xl md:text-3xl"
        >
          the two souls whose love became the home I grew up in...
        </motion.h2>

        <motion.h1
          {...STAGGER}
          animate={active ? STAGGER.animate : STAGGER.initial}
          transition={{ delay: 2.6, duration: 1.3, ease: "easeOut" }}
          className="text-shimmer mt-1 font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl md:text-6xl"
        >
          Happy Anniversary, Mummy & Baba
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={active ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ delay: 3.3, duration: 0.9, ease: "easeOut" }}
          className="h-px w-32 origin-center"
          style={{
            background:
              "linear-gradient(90deg, transparent, #c97b63 50%, transparent)",
          }}
        />

        <motion.button
          type="button"
          onClick={onContinue}
          initial={{ opacity: 0, y: 8 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 3.8, duration: 0.9, ease: "easeOut" }}
          whileTap={{ scale: 0.96 }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#c97b63]/30 bg-white/50 px-7 py-3 font-sans text-xs tracking-[0.28em] text-[#6b4a3a] uppercase backdrop-blur-sm sm:text-sm"
          style={{
            boxShadow:
              "0 6px 22px -10px rgba(150, 90, 60, 0.35), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <span>Read My Letter</span>
        </motion.button>
      </div>
    </section>
  );
}

export default BirthdayIntro;
