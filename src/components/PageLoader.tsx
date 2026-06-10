import { motion, AnimatePresence } from "framer-motion";

/**
 * PageLoader
 * ----------
 * A full-viewport, luxury loader shown while every image, video, and audio
 * asset is preloaded. Once the parent flips `isLoading` to false, the
 * loader fades out smoothly to reveal the rest of the journey.
 */
export function PageLoader({
  isLoading,
  progress,
  message = "Preparing something special…",
}: {
  isLoading: boolean;
  /** 0..1 — overall preload progress. Optional. */
  progress?: number;
  message?: string;
}) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-midnight text-cream"
        >
          {/* Soft ambient glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, oklch(0.30 0.10 285) 0%, oklch(0.16 0.08 280) 55%, oklch(0.10 0.06 280) 100%)",
            }}
          />

          {/* Twinkling stars */}
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 36 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-champagne/70"
                style={{
                  left: `${(i * 47) % 100}%`,
                  top: `${(i * 31) % 88}%`,
                  width: 1 + (i % 2),
                  height: 1 + (i % 2),
                }}
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{
                  duration: 2.4,
                  delay: (i % 6) * 0.35,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Spinner ring */}
          <div className="relative">
            <motion.div
              className="h-20 w-20 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, oklch(0.88 0.06 10 / 0) 0%, oklch(0.88 0.06 10 / 0) 60%, oklch(0.86 0.09 85 / 0.95) 75%, oklch(0.78 0.16 8) 95%, oklch(0.68 0.20 18) 100%)",
                mask: "radial-gradient(circle, transparent 60%, black 61%)",
                WebkitMask: "radial-gradient(circle, transparent 60%, black 61%)",
              }}
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1.4,
                ease: "linear",
              }}
            />
            {/* Inner pulsing heart */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.18, 1] }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: "easeInOut",
              }}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="oklch(0.68 0.24 18)" aria-hidden>
                <path d="M12 21s-7-4.5-9.5-9.5C1 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6 4 4.5 7.5C19 16.5 12 21 12 21z" />
              </svg>
            </motion.div>
          </div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-7 font-script text-2xl text-cream/85 sm:text-3xl"
            style={{
              textShadow:
                "0 0 20px oklch(0.88 0.06 10 / 0.45), 0 0 40px oklch(0.86 0.09 85 / 0.25)",
            }}
          >
            {message}
          </motion.p>

          {/* Progress bar */}
          <div className="mt-5 h-[3px] w-44 overflow-hidden rounded-full bg-cream/10">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.68 0.20 18) 0%, oklch(0.86 0.09 85) 100%)",
                boxShadow: "0 0 12px oklch(0.78 0.16 8 / 0.55)",
              }}
              initial={{ width: "0%" }}
              animate={{
                width: `${Math.round(Math.max(0, Math.min(1, progress ?? 0)) * 100)}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-3 font-sans text-[10px] tracking-[0.3em] text-cream/40 uppercase"
          >
            {Math.round(Math.max(0, Math.min(1, progress ?? 0)) * 100)}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PageLoader;
