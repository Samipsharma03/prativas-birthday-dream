import { motion } from "framer-motion";

/**
 * BirthdayIntro
 * -------------
 * Page 1 of the journey — a minimal, centered, dark screen that introduces
 * the experience with a sequence of staggered text reveals and a single
 * call-to-action that transitions to the next page (the love letter).
 *
 * Animation timeline (only begins once `active` flips to true, i.e. after
 * the PageLoader has finished its exit animation):
 *   • 0.3s  — <p>   "a little something for" fades + lifts in
 *   • 1.6s  — <h2>  "the girl who effortlessly makes…" fades + lifts in (italic)
 *   • 3.0s  — <h1>  "Happy Birthday, Prativa! ✨" fades + lifts in (pink→rose gradient)
 *   • 4.2s  — "Read My Message 🤍" button fades in
 *
 * When `active` is false (loader is still visible), every text element is
 * held in the hidden "pre-animation" state so that the staggered reveal
 * begins *fresh* the moment the loader finishes, rather than the user
 * seeing a half-finished animation that has been running invisibly behind
 * the loader.
 */

interface BirthdayIntroProps {
  onContinue: () => void;
  /**
   * When `true`, the staggered text-reveal animation runs.
   * When `false`, the section is held in its pre-animation hidden state
   * until the loader finishes so the user sees a clean, deliberate
   * one-at-a-time reveal.
   */
  active?: boolean;
}

const STAGGER = {
  initial: { opacity: 0, y: 14, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function BirthdayIntro({ onContinue, active = true }: BirthdayIntroProps) {
  return (
    <section
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-midnight px-6 text-center"
      aria-label="Birthday introduction"
    >
      {/* Soft ambient glow — keeps the screen feeling alive without distraction */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.88 0.06 10 / 0.10) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />

      {/* A few faint twinkling stars to match the rest of the design language */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-champagne/45 animate-twinkle"
          style={{
            width: `${1 + (i % 2)}px`,
            height: `${1 + (i % 2)}px`,
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 95}%`,
            animationDelay: `${(i % 5) * 0.5}s`,
          }}
        />
      ))}

      {/* Text stack — vertically centered, max-width for legibility on wide screens */}
      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-5 sm:gap-6">
        <motion.p
          {...STAGGER}
          animate={active ? STAGGER.animate : STAGGER.initial}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
          className="font-script text-base text-champagne/80 sm:text-lg"
        >
          a little something for
        </motion.p>

        <motion.h2
          {...STAGGER}
          animate={active ? STAGGER.animate : STAGGER.initial}
          transition={{ delay: 1.6, duration: 1.3, ease: "easeOut" }}
          className="font-display text-xl font-light italic text-cream/85 sm:text-2xl md:text-3xl"
        >
          the girl who effortlessly makes every single day a bit brighter...
        </motion.h2>

        <motion.h1
          {...STAGGER}
          animate={active ? STAGGER.animate : STAGGER.initial}
          transition={{ delay: 3.0, duration: 1.4, ease: "easeOut" }}
          className="mt-1 font-display text-4xl font-light leading-tight tracking-tight sm:text-5xl md:text-6xl"
          style={{
            backgroundImage:
              "linear-gradient(120deg, oklch(0.88 0.06 10) 0%, oklch(0.78 0.16 8) 55%, oklch(0.68 0.20 18) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
          }}
        >
          Happy Birthday, Prativa! ✨
        </motion.h1>

        <motion.button
          type="button"
          onClick={onContinue}
          initial={{ opacity: 0, y: 8 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 4.2, duration: 1.0, ease: "easeOut" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-champagne/25 bg-cream/[0.03] px-6 py-2.5 font-sans text-xs tracking-[0.28em] text-cream/85 uppercase backdrop-blur-sm transition-colors hover:border-champagne/45 hover:bg-cream/[0.06] sm:text-sm"
          style={{
            boxShadow:
              "0 8px 30px -10px oklch(0.88 0.06 10 / 0.35), inset 0 1px 0 oklch(0.98 0.02 80 / 0.06)",
          }}
        >
          <span>Read My Message</span>
          <span aria-hidden>🤍</span>
        </motion.button>
      </div>
    </section>
  );
}

export default BirthdayIntro;
