import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FinalVideoTheaterWithAsset } from "./FinalVideoTheater";
import { FinalMessage } from "./FinalMessage";

interface LoveLetterProps {
  onOpenComplete?: () => void;
}

type Phase = "idle" | "letterOpen" | "video" | "final";

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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#8B0000]">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20" />

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="flex min-h-screen items-center justify-center"
          >
            <div className="relative w-[90%] max-w-[400px] cursor-pointer" onClick={handleEnvelopeClick}>
              {/* Envelope body */}
              <div className="relative h-[260px] w-full rounded-lg bg-amber-100 shadow-2xl">
                {/* Inner shadow */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-amber-900/10 to-transparent" />

                {/* Triangular flap (rotates on click) */}
                <motion.div
                  className="absolute -top-[2px] left-0 h-[50%] w-full origin-top"
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div
                    className="h-full w-full rounded-t-lg bg-gradient-to-b from-amber-50 to-amber-100"
                    style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                  />
                </motion.div>

                {/* Heart button */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 shadow-lg">
                    <span className="text-white">❤️</span>
                  </div>
                </div>

                {/* Decorative text */}
                <div className="absolute bottom-3 left-0 w-full text-center text-xs tracking-wider text-amber-800/50">
                  a letter for you
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "letterOpen" && (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          >
            {/* Letter card */}
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 20 }}
              className="relative w-full max-w-[500px] rounded-xl bg-[#FFFAF0] p-6 shadow-2xl"
            >
              <button
                onClick={() => setPhase("idle")}
                className="absolute right-4 top-3 text-2xl text-rose-700 hover:scale-110"
              >
                ✕
              </button>
              <div className="text-center font-serif text-gray-800">
                <p className="mb-4 text-lg leading-relaxed sm:text-xl">
                  You have this incredibly rare, amazing energy that just makes everything
                  feel a little brighter whenever you&apos;re around. I don&apos;t think you
                  even realize how much your presence is appreciated, Prativa. Happy Birthday!
                </p>
                <p className="mt-6 text-amber-700">✨ With love ✨</p>
              </div>
            </motion.div>

            {/* Watch Video button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleWatchVideo}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 px-8 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-white shadow-lg"
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