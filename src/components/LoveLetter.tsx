import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FinalVideoTheaterWithAsset } from "./FinalVideoTheater";

interface LoveLetterProps {
  onOpenComplete?: () => void;
}

export function LoveLetter({ onOpenComplete }: LoveLetterProps) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [showingVideo, setShowingVideo] = useState(false);
  const [bgMusicFaded, setBgMusicFaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);

  // Setup background music that plays while envelope is closed
  useEffect(() => {
    if (envelopeOpen || bgMusicFaded) return;

    const audio = new Audio("/memories/bg-music.mp3");
    audio.loop = true;
    audio.volume = 0.25;
    audio.preload = "auto";
    audioRef.current = audio;

    const startPlaying = () => {
      const result = audio.play();
      if (result && typeof result.then === "function") {
        result.catch(() => {});
      }
    };

    if (audio.readyState >= 2) {
      startPlaying();
    } else {
      audio.addEventListener("canplay", startPlaying, { once: true });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [envelopeOpen, bgMusicFaded]);

  // Fade out and stop background music
  const fadeOutMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setBgMusicFaded(true);
    const startVolume = audio.volume;
    const startTime = performance.now();
    const durationMs = 1500;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      audio.volume = Math.max(0, startVolume + (0 - startVolume) * eased);

      if (t < 1) {
        fadeFrameRef.current = requestAnimationFrame(step);
      } else {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    };

    fadeFrameRef.current = requestAnimationFrame(step);
  };

  const handleSealClick = () => {
    if (envelopeOpen) return;

    fadeOutMusic();
    setEnvelopeOpen(true);

    setTimeout(() => {
      setLetterVisible(true);
    }, 800);
  };

  const handleWatchVideo = () => {
    setEnvelopeOpen(false);
    setLetterVisible(false);
    setTimeout(() => {
      setShowingVideo(true);
    }, 300);
  };

  return (
    <section className="relative min-h-screen bg-midnight">
      <AnimatePresence>
        {!showingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-screen items-center justify-center p-4"
          >
            <div className="relative w-full max-w-sm sm:max-w-md">
              <div className="relative mx-auto h-64 w-80 sm:h-80 sm:w-96" style={{ perspective: "1000px" }}>
                {/* Envelope Flap - flips open on click */}
                <motion.div
                  className="absolute inset-x-0 top-0 origin-bottom"
                  style={{
                    height: "50%",
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.22 18) 0%, oklch(0.68 0.24 18) 100%)",
                    border: "1px solid oklch(0.85 0.15 85 / 0.4)",
                    borderBottom: "none",
                    borderRadius: "12px 12px 0 0",
                    backfaceVisibility: "hidden",
                  }}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: envelopeOpen ? -180 : 0 }}
                  transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {/* Wax Seal - only visible when closed */}
                  {!envelopeOpen && (
                    <motion.button
                      onClick={handleSealClick}
                      whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle, oklch(0.75 0.22 18) 0%, oklch(0.68 0.24 18) 100%)",
                        boxShadow:
                          "0 0 25px oklch(0.72 0.22 18 / 0.9), inset 0 2px 6px oklch(0.9 0.1 85 / 0.5)",
                        border: "2px solid oklch(0.85 0.15 85 / 0.6)",
                      }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="flex h-full w-full items-center justify-center"
                      >
                        <svg viewBox="0 0 24 24" className="h-7 w-7 text-champagne" fill="currentColor">
                          <path d="M12 21s-7-4.5-9.5-9.5C1 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6 4 4.5 7.5C19 16.5 12 21 12 21z" />
                        </svg>
                      </motion.div>
                      <span className="sr-only">Open Love Letter</span>
                    </motion.button>
                  )}
                </motion.div>

                {/* Envelope Body */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-xl"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.96 0.02 85) 0%, oklch(0.92 0.03 85) 100%)",
                    border: "1px solid oklch(0.85 0.15 85 / 0.3)",
                    boxShadow: "0 12px 40px -10px oklch(0 0 0 / 0.5)",
                  }}
                />
              </div>

              {/* Letter Content - slides up from envelope */}
              <AnimatePresence>
                {letterVisible && (
                  <motion.div
                    initial={{ y: 120, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="absolute inset-x-0 mx-auto mt-12 w-11/12 max-w-sm sm:mt-16 sm:max-w-md"
                  >
                    <div
                      className="rounded-xl p-6 sm:p-8"
                      style={{
                        background: "oklch(0.98 0.02 85)",
                        boxShadow: "0 20px 60px -10px oklch(0 0 0 / 0.6), inset 0 1px 0 oklch(0.9 0.05 85 / 0.5)",
                      }}
                    >
                      <div className="space-y-4 text-center">
                        <p
                          className="font-script text-xl leading-relaxed text-midnight sm:text-2xl"
                          style={{
                            textShadow: "0 1px 2px oklch(0 0 0 / 0.08)",
                          }}
                        >
                          Prativa, every memory we've shared has built a foundation for a beautiful
                          future. You are my greatest gift. To wrap up your birthday surprise, I
                          made this final piece just for you...
                        </p>

                        <motion.button
                          onClick={handleWatchVideo}
                          whileHover={{ scale: 1.03, boxShadow: "0 12px 35px -5px oklch(0.72 0.22 18 / 0.5)" }}
                          whileTap={{ scale: 0.97 }}
                          className="mt-6 inline-flex items-center justify-center rounded-full px-8 py-3 font-sans text-sm tracking-widest text-cream uppercase transition-shadow"
                          style={{
                            background:
                              "linear-gradient(120deg, oklch(0.68 0.20 18) 0%, oklch(0.78 0.16 8) 50%, oklch(0.86 0.09 85) 100%)",
                            boxShadow: "0 10px 30px -5px oklch(0.72 0.22 18 / 0.4)",
                          }}
                        >
                          Watch Your Video
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player - slides in from right */}
      <AnimatePresence>
        {showingVideo && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            onAnimationComplete={() => {
              const video = document.querySelector("video");
              if (video instanceof HTMLVideoElement) {
                video.play().catch(() => {});
              }
            }}
          >
            <FinalVideoTheaterWithAsset onClose={() => setShowingVideo(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default LoveLetter;