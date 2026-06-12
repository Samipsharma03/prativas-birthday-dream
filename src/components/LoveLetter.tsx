import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FinalVideoTheaterWithAsset } from "./FinalVideoTheater";
import { FinalMessage } from "./FinalMessage";
import { SakuraPetals } from "./SakuraPetals";

interface LoveLetterProps {
  onOpenComplete?: () => void;
}

type Phase = "idle" | "letterOpen" | "video" | "final";

const LETTER_TEXT =
  "You have this incredibly rare, amazing energy that just makes everything feel a little brighter whenever you're around. I don't think you even realize how much your presence is appreciated, Prativa. Happy Birthday!";

/**
 * Typewriter — reveals text one character at a time.
 * Pure JS, no hover. Mobile-friendly.
 */
function Typewriter({ text, delay = 0, speed = 28 }: { text: string; delay?: number; speed?: number }) {
  const [shown, setShown] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const t0 = setTimeout(() => {
      const id = setInterval(() => {
        setShown((s) => {
          if (s >= text.length) {
            clearInterval(id);
            return s;
          }
          return s + 1;
        });
      }, speed);
    }, delay);
    return () => clearTimeout(t0);
  }, [delay, speed, text.length]);
  return (
    <>
      {text.slice(0, shown)}
      <span className="ml-[1px] inline-block w-[2px] h-[1em] -mb-[2px] bg-rose-700/70 animate-pulse" />
    </>
  );
}

export function LoveLetter({ onOpenComplete }: LoveLetterProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const isOpen = phase === "letterOpen";

  const handleEnvelopeClick = () => {
    if (phase !== "idle") return;
    window.dispatchEvent(new Event("bg-music-fade-out"));
    setPhase("letterOpen");
  };

  const handleWatchVideo = () => {
    setPhase("video");
    setTimeout(() => onOpenComplete?.(), 700);
  };

  const handleVideoEnded = () => setPhase("final");
  const handleVideoClose = () => setPhase("letterOpen");
  const handleReplayFinal = () => {
    setPhase("final");
    setTimeout(() => setPhase("idle"), 800);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, oklch(0.32 0.14 340) 0%, oklch(0.18 0.08 300) 50%, #0f0a1c 100%)",
      }}
    >
      {/* Drifting petals across the whole letter scene */}
      <SakuraPetals count={18} />

      {/* Glowing pink moon */}
      <div
        aria-hidden
        className="moon-glow pointer-events-none absolute left-1/2 top-[20%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "220px",
          height: "220px",
          background:
            "radial-gradient(circle at 40% 40%, #fef0f5 0%, oklch(0.82 0.12 350) 35%, oklch(0.50 0.16 350 / 0) 70%)",
        }}
      />

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex min-h-screen items-center justify-center px-4"
          >
            <div
              className="relative w-[90%] max-w-[400px] cursor-pointer select-none"
              onClick={handleEnvelopeClick}
            >
              {/* Soft glow halo behind envelope */}
              <div
                aria-hidden
                className="absolute -inset-8 rounded-full opacity-70 blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.78 0.14 350 / 0.55) 0%, transparent 70%)",
                }}
              />

              {/* Envelope body */}
              <div
                className="relative h-[260px] w-full rounded-lg shadow-2xl"
                style={{
                  background:
                    "linear-gradient(160deg, #fff5f8 0%, #fce0ea 60%, #f4c6d5 100%)",
                  boxShadow:
                    "0 30px 60px -20px rgba(0,0,0,0.6), 0 0 40px oklch(0.62 0.18 350 / 0.35)",
                }}
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-rose-900/10 to-transparent" />

                {/* Diagonal fold lines */}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 260" preserveAspectRatio="none" aria-hidden>
                  <line x1="0" y1="130" x2="200" y2="260" stroke="oklch(0.65 0.10 350 / 0.25)" strokeWidth="1" />
                  <line x1="400" y1="130" x2="200" y2="260" stroke="oklch(0.65 0.10 350 / 0.25)" strokeWidth="1" />
                </svg>

                {/* Triangular flap (rotates on tap) */}
                <motion.div
                  className="absolute -top-[2px] left-0 h-[50%] w-full origin-top"
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.6, 0, 0.3, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="h-full w-full rounded-t-lg"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background:
                        "linear-gradient(180deg, #fff8fa 0%, #f9d4e0 100%)",
                      boxShadow: "inset 0 -2px 8px rgba(180,80,120,0.15)",
                    }}
                  />
                </motion.div>

                {/* Wax seal — pulsing */}
                <div className="wax-pulse absolute left-1/2 top-1/2 z-10">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 35% 30%, oklch(0.72 0.22 18) 0%, oklch(0.45 0.20 18) 70%, oklch(0.32 0.18 18) 100%)",
                      boxShadow:
                        "inset 0 -3px 6px rgba(0,0,0,0.4), inset 0 3px 6px rgba(255,255,255,0.25), 0 6px 14px rgba(120,20,40,0.5)",
                    }}
                  >
                    <span className="font-display text-xl italic text-rose-100/95" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}>P</span>
                  </div>
                </div>

                {/* Ribbon across the bottom */}
                <div
                  className="ribbon-shimmer absolute bottom-6 left-0 right-0 mx-auto h-[3px] w-[60%]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, oklch(0.72 0.20 350), transparent)",
                  }}
                />

                <div className="absolute bottom-2 left-0 w-full text-center font-script text-xs tracking-wider text-rose-800/60">
                  a letter for you
                </div>
              </div>

              {/* Tap hint */}
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-6 text-center font-sans text-[10px] tracking-[0.3em] text-sakura/85 uppercase"
              >
                tap the seal to open
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
            style={{ background: "rgba(15,10,28,0.65)", backdropFilter: "blur(10px)" }}
          >
            <SakuraPetals count={10} />

            <motion.div
              initial={{ scale: 0.85, y: 60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", damping: 22, stiffness: 180 }}
              className="relative z-10 w-full max-w-[500px] rounded-xl p-7 shadow-2xl"
              style={{
                background:
                  "linear-gradient(180deg, #fffaf5 0%, #fef0f5 100%)",
                boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6), 0 0 60px oklch(0.78 0.14 350 / 0.3)",
              }}
            >
              {/* Decorative top flourish */}
              <div className="mb-4 flex items-center justify-center gap-3">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-rose-400/60" />
                <span className="text-rose-500">🌸</span>
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-rose-400/60" />
              </div>

              <button
                onClick={() => setPhase("idle")}
                className="absolute right-4 top-3 text-2xl text-rose-700"
                aria-label="Close letter"
              >
                ✕
              </button>
              <div className="text-center font-serif text-gray-800">
                <p className="mb-4 text-base leading-relaxed sm:text-lg">
                  {LETTER_TEXT}
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="mt-6 font-script text-xl text-rose-600"
                >
                  ✨ With love ✨
                </motion.p>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 5, duration: 0.6 }}
              onClick={handleWatchVideo}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 mt-8 rounded-full px-8 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-cream"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.20 350), oklch(0.50 0.22 340))",
                boxShadow: "0 12px 30px -8px oklch(0.62 0.20 350 / 0.6)",
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
