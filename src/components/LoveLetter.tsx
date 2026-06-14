import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FinalVideoTheaterWithAsset } from "./FinalVideoTheater";
import { FinalMessage } from "./FinalMessage";
import { SakuraPetals } from "./SakuraPetals";
import { Moon } from "./Moon";
import { Typewriter } from "./Typewriter";

interface LoveLetterProps {
  onOpenComplete?: () => void;
}

type Phase = "idle" | "letterOpen" | "video" | "final";

// ✏️ Edit her letter here
const LETTER_TEXT =
  "You have this incredibly rare, amazing energy that just makes everything feel a little brighter whenever you're around. I don't think you even realize how much your presence is appreciated, Prativa. Happy Birthday!";

export function LoveLetter({ onOpenComplete }: LoveLetterProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const isOpen = phase === "letterOpen";

  // Opening the envelope does NOT touch the music — it keeps playing softly.
  const handleEnvelopeClick = () => {
    if (phase !== "idle") return;
    setPhase("letterOpen");
  };

  // The ONLY moment we silence the music: when the final video begins.
  const handleWatchVideo = () => {
    window.dispatchEvent(new Event("bg-music-fade-out"));
    setPhase("video");
    setTimeout(() => onOpenComplete?.(), 700);
  };

  // Bring the music back as soon as the video ends / is closed.
  const handleVideoEnded = () => {
    window.dispatchEvent(new Event("bg-music-fade-in"));
    setPhase("final");
  };
  const handleVideoClose = () => {
    window.dispatchEvent(new Event("bg-music-fade-in"));
    setPhase("letterOpen");
  };
  const handleReplayFinal = () => {
    setPhase("final");
    setTimeout(() => setPhase("idle"), 800);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 20%, #fdf6ec 0%, #f4dcc4 55%, #ecc9a8 100%)",
      }}
    >
      <SakuraPetals count={8} />

      {/* The selenophile's moon */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-[7%] -translate-x-1/2 z-0"
      >
        <Moon size={120} />
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-5"
          >
            <div
              className="relative w-[88%] max-w-[360px] cursor-pointer select-none"
              onClick={handleEnvelopeClick}
            >
              {/* Soft glow halo */}
              <div
                aria-hidden
                className="absolute -inset-6 rounded-3xl opacity-60 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.82 0.10 350 / 0.55) 0%, transparent 70%)",
                }}
              />

              {/* Cute minimal envelope */}
              <div
                className="relative h-[220px] w-full rounded-2xl"
                style={{
                  background: "linear-gradient(160deg, #fff8fb 0%, #fde6ee 100%)",
                  boxShadow:
                    "0 24px 60px -22px rgba(0,0,0,0.55), 0 0 0 1px oklch(0.85 0.05 350 / 0.5) inset",
                }}
              >
                {/* Triangular flap */}
                <motion.div
                  className="absolute -top-[1px] left-0 h-[55%] w-full origin-top"
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.6, 0, 0.3, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="h-full w-full rounded-t-2xl"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background: "linear-gradient(180deg, #fff8fb 0%, #f7cfde 100%)",
                    }}
                  />
                </motion.div>

                {/* Tiny heart seal (cute, minimal) */}
                <div className="wax-pulse absolute left-1/2 top-1/2 z-10">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full text-lg"
                    style={{
                      background:
                        "radial-gradient(circle at 35% 30%, #ffd5e0 0%, #f49bbc 70%, #e07399 100%)",
                      boxShadow:
                        "inset 0 -2px 4px rgba(0,0,0,0.18), 0 4px 10px rgba(180,40,80,0.35)",
                    }}
                  >
                    <span style={{ color: "white" }}>♡</span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-0 w-full text-center font-script text-xs tracking-wide text-rose-700/60">
                  for Prativa
                </div>
              </div>

              {/* Tap hint */}
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-6 text-center font-sans text-[10px] tracking-[0.3em] text-[#a87358] uppercase"
              >
                tap to open
              </motion.p>
            </div>
          </motion.div>
        )}

        {phase === "letterOpen" && (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4"
            style={{ background: "rgba(15,10,28,0.6)", backdropFilter: "blur(10px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", damping: 22, stiffness: 180 }}
              className="relative z-10 w-full max-w-[460px] rounded-2xl p-7 sm:p-8"
              style={{
                background: "linear-gradient(180deg, #fffaf5 0%, #fdeef3 100%)",
                boxShadow:
                  "0 30px 80px -20px rgba(0,0,0,0.55), 0 0 0 1px oklch(0.85 0.05 350 / 0.5) inset",
              }}
            >
              {/* Minimal flourish */}
              <div className="mb-4 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-rose-300" />
                <span className="text-rose-400 text-sm">♡</span>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-rose-300" />
              </div>

              <button
                onClick={() => setPhase("idle")}
                className="absolute right-3 top-3 text-xl text-rose-700/70"
                aria-label="Close letter"
              >
                ✕
              </button>

              <div className="text-center font-serif text-rose-950/85">
                <Typewriter
                  text={LETTER_TEXT}
                  speed={26}
                  delayMs={250}
                  className="block text-[15px] leading-relaxed sm:text-base"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (LETTER_TEXT.length * 0.026) + 0.4, duration: 0.8 }}
                  className="mt-6 font-script text-xl text-rose-500"
                >
                  ♡ with love ♡
                </motion.p>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (LETTER_TEXT.length * 0.026) + 0.9, duration: 0.6 }}
              onClick={handleWatchVideo}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 mt-7 rounded-full px-7 py-3 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-white"
              style={{
                background: "linear-gradient(135deg, #f49bbc, #e07399)",
                boxShadow: "0 10px 28px -8px oklch(0.62 0.20 350 / 0.55)",
              }}
            >
              Watch Your Video
            </motion.button>
          </motion.div>
        )}

        {phase === "video" && (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <FinalVideoTheaterWithAsset onClose={handleVideoClose} onEnded={handleVideoEnded} />
          </motion.div>
        )}

        {phase === "final" && <FinalMessage key="final" onReplay={handleReplayFinal} />}
      </AnimatePresence>
    </div>
  );
}

export default LoveLetter;
