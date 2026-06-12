import { motion } from "framer-motion";
import { SakuraPetals } from "./SakuraPetals";

/**
 * BirthdayIntro — Cherry Blossom Night edition
 *
 * - Layered midnight + plum gradient background
 * - Glowing pink "moon" behind the headline
 * - Falling sakura petals (CSS, preloaded)
 * - Shimmering gradient sweep on Prativa's name
 * - Mobile-first: no hover effects, big tap target
 */

interface BirthdayIntroProps {
  onContinue: () => void;
  active?: boolean;
}

const STAGGER = {
  initial: { opacity: 0, y: 14, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function BirthdayIntro({ onContinue, active = true }: BirthdayIntroProps) {
  return (
    <section
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
      aria-label="Birthday introduction"
      style={{
        background:
          "radial-gradient(ellipse at 50% 35%, oklch(0.30 0.12 320) 0%, oklch(0.18 0.07 290) 45%, #0f0a1c 100%)",
      }}
    >
      {/* Glowing pink "moon" behind the headline */}
      <div
        aria-hidden
        className="moon-glow pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "260px",
          height: "260px",
          background:
            "radial-gradient(circle at 40% 40%, #fef0f5 0%, oklch(0.85 0.10 350) 35%, oklch(0.50 0.16 350 / 0) 70%)",
        }}
      />

      {/* Falling petals */}
      <SakuraPetals count={16} />

      {/* Faint twinkling stars */}
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-white/70 animate-twinkle"
          style={{
            width: `${1 + (i % 2)}px`,
            height: `${1 + (i % 2)}px`,
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 95}%`,
            animationDelay: `${(i % 5) * 0.5}s`,
          }}
        />
      ))}

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-5 sm:gap-6">
        <motion.p
          {...STAGGER}
          animate={active ? STAGGER.animate : STAGGER.initial}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
          className="font-script text-base text-sakura-soft/90 sm:text-lg"
          style={{ textShadow: "0 0 14px oklch(0.78 0.14 350 / 0.5)" }}
        >
          a little something for
        </motion.p>

        <motion.h2
          {...STAGGER}
          animate={active ? STAGGER.animate : STAGGER.initial}
          transition={{ delay: 1.6, duration: 1.3, ease: "easeOut" }}
          className="font-display text-xl font-light italic text-cream/90 sm:text-2xl md:text-3xl"
        >
          the girl who effortlessly makes every single day a bit brighter...
        </motion.h2>

        <motion.h1
          {...STAGGER}
          animate={active ? STAGGER.animate : STAGGER.initial}
          transition={{ delay: 3.0, duration: 1.4, ease: "easeOut" }}
          className="text-shimmer mt-1 font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl md:text-6xl"
        >
          Happy Birthday, Prativa! ✨
        </motion.h1>

        {/* Decorative flourish under headline */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={active ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ delay: 3.8, duration: 1.0, ease: "easeOut" }}
          className="h-px w-40 origin-center"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.78 0.14 350) 50%, transparent)",
          }}
        />

        <motion.button
          type="button"
          onClick={onContinue}
          initial={{ opacity: 0, y: 8 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 4.2, duration: 1.0, ease: "easeOut" }}
          whileTap={{ scale: 0.96 }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-sakura/40 bg-sakura/10 px-7 py-3 font-sans text-xs tracking-[0.28em] text-cream uppercase backdrop-blur-sm sm:text-sm"
          style={{
            boxShadow:
              "0 8px 30px -8px oklch(0.62 0.20 350 / 0.55), inset 0 1px 0 oklch(1 0 0 / 0.08)",
          }}
        >
          <span>Read My Message</span>
          <span aria-hidden>🌸</span>
        </motion.button>
      </div>
    </section>
  );
}

export default BirthdayIntro;
