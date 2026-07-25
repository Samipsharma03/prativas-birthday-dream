import { motion } from "framer-motion";

/**
 * FinalMessage — minimalist cute edition
 *
 * Soft pastel card on a dreamy cream backdrop. Tiny moon (selenophile),
 * a single heart, gentle typography. No particle noise.
 * Edit text below to customize.
 */

interface FinalMessageProps {
  onReplay?: () => void;
}

export function FinalMessage({ onReplay }: FinalMessageProps) {
  return (
    <motion.section
      key="final-message"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.1, ease: "easeInOut" }}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-5 py-12"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #fdf6ec 0%, #f4dcc4 50%, #ecc9a8 100%)",
      }}
    >
      {/* Soft warm glow at top */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #fff 0%, rgba(244,212,193,0.7) 50%, transparent 80%)",
        }}
      />

      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 0.9, 0.32, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-[440px] flex-col items-center rounded-3xl border border-white/70 bg-white/75 px-7 py-10 text-center backdrop-blur-md"
        style={{
          boxShadow:
            "0 24px 60px -28px rgba(150, 90, 60, 0.35), 0 0 0 1px rgba(201,123,99,0.08) inset",
        }}
      >
        {/* Tiny moon */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-full text-2xl"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #fff 0%, #fbe7d0 70%, #e8c19a 100%)",
            boxShadow: "0 6px 22px -6px rgba(180, 120, 80, 0.45)",
          }}
        >
          🌙
        </motion.div>

        <motion.h1
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
          className="font-display text-3xl font-light leading-tight text-[#4a2f22] sm:text-4xl"
        >
          happy anniversary,
          <br />
          <span className="font-script text-4xl italic text-[#a55b46] sm:text-5xl">
            Mummy &amp; Baba
          </span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.9, ease: "easeInOut" }}
          className="my-5 h-px w-16 origin-center"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #c97b63 50%, transparent 100%)",
          }}
        />

        <motion.p
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.05, ease: "easeOut" }}
          className="text-[15px] font-light leading-relaxed text-[#5a3d2e]/85 sm:text-base"
        >
          thank you — for every sacrifice quietly made, every prayer whispered
          for me, every late night, every warm meal, and every lesson wrapped in
          love. everything I am, and everything I hope to be, began with the two
          of you. here&apos;s to many more years of your beautiful love story.
        </motion.p>

        <motion.p
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.3, ease: "easeOut" }}
          className="mt-7 flex items-center gap-2 font-script text-lg text-[#a55b46]"
        >
          <span aria-hidden>♡</span>
          with all my love, your son
          <span aria-hidden>♡</span>
        </motion.p>

        {onReplay && (
          <motion.button
            type="button"
            onClick={onReplay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.55, ease: "easeOut" }}
            whileTap={{ scale: 0.96 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#c97b63]/40 bg-white/60 px-5 py-2.5 font-sans text-[11px] tracking-[0.25em] text-[#6b4a3a] uppercase backdrop-blur"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M20 10A8 8 0 0 0 5.6 7.6M4 14a8 8 0 0 0 14.4 2.4" />
            </svg>
            from the top
          </motion.button>
        )}
      </motion.div>
    </motion.section>
  );
}

export default FinalMessage;
