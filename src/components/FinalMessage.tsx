import { motion } from "framer-motion";

/**
 * FinalMessage
 * ------------
 * Full-page final message shown after the birthday video ends.
 * Edit the text/headline/subline/signature below to customize the message.
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
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6"
      style={{
        background:
          "linear-gradient(160deg, #0b0820 0%, #1a1238 45%, #2a1a4a 100%)",
      }}
    >
      {/* Ambient backdrop glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(190,130,255,0.18) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(255,180,120,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Subtle floating particles (decorative) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute block h-1 w-1 rounded-full bg-champagne/40"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [-10, -40, -10],
            }}
            transition={{
              duration: 4 + (i % 5),
              delay: i * 0.25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 0.9, 0.32, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-[640px] flex-col items-center text-center"
      >
        {/* Top decorative ornament */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.18 18) 0%, oklch(0.62 0.22 18) 100%)",
            boxShadow: "0 0 35px oklch(0.78 0.18 18 / 0.5)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 text-cream/95"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 21s-7-4.5-9.5-9.5C1 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6 4 4.5 7.5C19 16.5 12 21 12 21z" />
          </svg>
        </motion.div>

        {/* Main headline — EDIT THIS */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
          className="font-serif text-3xl font-medium leading-tight text-champagne sm:text-4xl md:text-5xl"
        >
          {/* ✏️ Replace this headline with your final message */}
          Happy Birthday, Prativa 🎂
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.0, ease: "easeInOut" }}
          className="my-6 h-px w-24 origin-center"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0.78 0.18 18) 50%, transparent 100%)",
          }}
        />

        {/* Sub-message — EDIT THIS */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
          className="max-w-[520px] text-base font-light leading-relaxed text-cream/85 sm:text-lg"
        >
        I wanted to create this entire space just for you, because a standard birthday text could never truly capture how incredible of a person you are.

        There is a unique, rare warmth to your presence. You have this beautiful ability to bring genuine light and happiness into a room just by walking into it. Whether it’s your laughter, your quiet kindness, or just the effortless way you carry yourself, you leave a lasting impression on everyone lucky enough to know you.

        Getting to know you has easily been the absolute highlight of my year. You have a way of turning completely ordinary days into moments I genuinely look forward to, and I am so incredibly grateful to have you in my life.

        On your special day, my only wish is that you are surrounded by the exact same pure joy, care, and love that you unconsciously give to the world every single day. You deserve a year ahead filled with breathtaking adventures, endless smiles, and every single dream your heart is chasing.

        Never forget how truly special, admired, and deeply appreciated you are. Have the most magical birthday!
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
          className="mt-8 font-serif text-lg italic text-champagne/80 sm:text-xl"
        >
          {/* ✏️ Replace this signature */}
          Forever yours, Samip
        </motion.p>

        {/* Optional replay button */}
        {onReplay && (
          <motion.button
            type="button"
            onClick={onReplay}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.8, ease: "easeOut" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="mt-12 inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-6 py-3 font-sans text-xs font-medium tracking-[0.25em] text-cream/80 uppercase backdrop-blur-md transition hover:border-cream/40 hover:text-cream"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v6h6M20 20v-6h-6M20 10A8 8 0 0 0 5.6 7.6M4 14a8 8 0 0 0 14.4 2.4"
              />
            </svg>
            Replay
          </motion.button>
        )}
      </motion.div>
    </motion.section>
  );
}

export default FinalMessage;
