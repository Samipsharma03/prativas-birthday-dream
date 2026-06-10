import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FinalVideoTheaterWithAsset } from "./FinalVideoTheater";

interface LoveLetterProps {
  onOpenComplete?: () => void;
}

export function LoveLetter({ onOpenComplete }: LoveLetterProps) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [showingVideo, setShowingVideo] = useState(false);

  const handleSealClick = () => {
    if (envelopeOpen) return;

    // Dispatch fade-out event to BackgroundMusic
    window.dispatchEvent(new Event("bg-music-fade-out"));
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
      onOpenComplete?.();
    }, 300);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-midnight">
      {/* Ambient romantic glow behind envelope */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[120%] w-[120%] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.22 18 / 0.4), oklch(0.68 0.24 18 / 0.1), transparent 70%)",
          }}
        />
      </div>

      {/* Subtle floating particles for romantic atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-champagne/20"
            style={{
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {!showingVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: "anticipate" }}
            className="flex min-h-screen items-center justify-center p-4"
          >
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Decorative corner flourishes */}
              <div className="pointer-events-none absolute -left-4 -top-4 h-12 w-12 opacity-60">
                <svg viewBox="0 0 40 40" fill="none" className="h-full w-full text-champagne/40">
                  <path
                    d="M35 5 L5 5 L5 35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="5" cy="5" r="3" fill="currentColor" />
                </svg>
              </div>
              <div className="pointer-events-none absolute -right-4 -top-4 h-12 w-12 opacity-60">
                <svg viewBox="0 0 40 40" fill="none" className="h-full w-full text-champagne/40">
                  <path
                    d="M5 5 L35 5 L35 35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="35" cy="5" r="3" fill="currentColor" />
                </svg>
              </div>
              <div className="pointer-events-none absolute -bottom-4 -left-4 h-12 w-12 opacity-60">
                <svg viewBox="0 0 40 40" fill="none" className="h-full w-full text-champagne/40">
                  <path
                    d="M35 35 L5 35 L5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="5" cy="35" r="3" fill="currentColor" />
                </svg>
              </div>
              <div className="pointer-events-none absolute -bottom-4 -right-4 h-12 w-12 opacity-60">
                <svg viewBox="0 0 40 40" fill="none" className="h-full w-full text-champagne/40">
                  <path
                    d="M5 35 L35 35 L35 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="35" cy="35" r="3" fill="currentColor" />
                </svg>
              </div>

              <div
                className="relative mx-auto h-72 w-80 sm:h-88 sm:w-96"
                style={{ perspective: "1200px" }}
              >
                {/* Envelope Flap - enhanced with inner shimmer and better rotation */}
                <motion.div
                  className="absolute inset-x-0 top-0 origin-bottom"
                  style={{
                    height: "50%",
                    background:
                      "linear-gradient(145deg, oklch(0.74 0.24 18) 0%, oklch(0.68 0.22 18) 30%, oklch(0.72 0.20 18) 100%)",
                    border: "1px solid oklch(0.88 0.18 85 / 0.5)",
                    borderBottom: "none",
                    borderRadius: "16px 16px 0 0",
                    backfaceVisibility: "hidden",
                    boxShadow: "inset 0 2px 4px oklch(0.95 0.12 85 / 0.3), 0 -2px 6px oklch(0 0 0 / 0.2)",
                  }}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: envelopeOpen ? -180 : 0 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.34, 1.2, 0.64, 1],
                  }}
                >
                  {/* Decorative gold trim on flap edge */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />

                  {/* Wax Seal - enhanced with 3D effect and elegance */}
                  {!envelopeOpen && (
                    <motion.button
                      onClick={handleSealClick}
                      whileHover={{ scale: 1.08, filter: "brightness(1.15)" }}
                      whileTap={{ scale: 0.92 }}
                      className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle at 30% 35%, oklch(0.82 0.26 18) 0%, oklch(0.68 0.24 18) 60%, oklch(0.58 0.22 18) 100%)",
                        boxShadow:
                          "0 0 0 3px oklch(0.88 0.18 85 / 0.5), 0 0 0 6px oklch(0.68 0.24 18 / 0.3), 0 8px 20px oklch(0 0 0 / 0.4), inset 0 1px 2px oklch(0.95 0.2 85 / 0.6)",
                        border: "1px solid oklch(0.9 0.15 85 / 0.7)",
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.12, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.5,
                          ease: "easeInOut",
                        }}
                        className="flex h-full w-full items-center justify-center"
                      >
                        {/* Enhanced heart with shine effect */}
                        <div className="relative">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-8 w-8 text-champagne drop-shadow-md"
                            fill="currentColor"
                          >
                            <path d="M12 21s-7-4.5-9.5-9.5C1 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6 4 4.5 7.5C19 16.5 12 21 12 21z" />
                          </svg>
                          <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-champagne/70 blur-[1px]" />
                        </div>
                      </motion.div>
                      <span className="sr-only">Open Love Letter</span>
                    </motion.button>
                  )}
                </motion.div>

                {/* Envelope Body - luxurious design with liner and metallic accents */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-xl"
                  style={{
                    background:
                      "linear-gradient(155deg, oklch(0.97 0.03 85) 0%, oklch(0.93 0.04 85) 50%, oklch(0.89 0.05 85) 100%)",
                    border: "1px solid oklch(0.85 0.15 85 / 0.4)",
                    boxShadow:
                      "0 20px 40px -12px oklch(0 0 0 / 0.5), inset 0 1px 0 oklch(0.98 0.1 85 / 0.8)",
                  }}
                >
                  {/* Envelope liner pattern - vintage diamond texture */}
                  <div
                    className="absolute inset-0 rounded-b-xl opacity-20"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, oklch(0.68 0.2 18 / 0.3) 0px, oklch(0.68 0.2 18 / 0.3) 2px, transparent 2px, transparent 8px)`,
                    }}
                  />

                  {/* Decorative gold bottom accent */}
                  <div className="absolute bottom-2 left-4 right-4 h-px bg-gradient-to-r from-transparent via-champagne/40 to-transparent" />
                  <div className="absolute bottom-3 left-6 right-6 h-px bg-gradient-to-r from-transparent via-champagne/20 to-transparent" />
                </div>

                {/* Inner envelope decorative border (visible when flap opens) */}
                <div
                  className="absolute inset-x-0 top-[48%] h-[52%] rounded-b-xl opacity-60"
                  style={{
                    borderTop: "2px solid oklch(0.78 0.18 18 / 0.3)",
                    borderLeft: "1px solid oklch(0.78 0.18 18 / 0.2)",
                    borderRight: "1px solid oklch(0.78 0.18 18 / 0.2)",
                  }}
                />
              </div>

              {/* Letter Content - enhanced with elegant design and smooth entrance */}
              <AnimatePresence>
                {letterVisible && (
                  <motion.div
                    initial={{ y: 140, opacity: 0, scale: 0.96 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{
                      duration: 0.9,
                      ease: [0.23, 1.1, 0.32, 1],
                      delay: 0.15,
                    }}
                    className="absolute inset-x-0 mx-auto mt-12 w-11/12 max-w-sm sm:mt-16 sm:max-w-md"
                  >
                    <div
                      className="relative rounded-xl p-6 sm:p-8 backdrop-blur-sm"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.99 0.02 85) 0%, oklch(0.96 0.03 85) 100%)",
                        boxShadow:
                          "0 25px 50px -12px oklch(0 0 0 / 0.5), inset 0 1px 0 oklch(0.95 0.05 85 / 0.8)",
                        border: "1px solid oklch(0.88 0.12 85 / 0.6)",
                      }}
                    >
                      {/* Decorative inner border */}
                      <div
                        className="absolute inset-2 rounded-lg pointer-events-none"
                        style={{
                          border: "1px solid oklch(0.78 0.15 85 / 0.3)",
                        }}
                      />

                      <div className="relative space-y-5 text-center">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-champagne/50 to-transparent"
                        />

                        <p
                          className="font-script text-xl leading-relaxed text-midnight sm:text-2xl"
                          style={{
                            textShadow: "0 1px 2px oklch(0 0 0 / 0.06)",
                            fontFamily: "'Cormorant Garamond', serif",
                          }}
                        >
                          Prativa, every memory we've shared has built a foundation for a beautiful
                          future. You are my greatest gift. To wrap up your birthday surprise, I
                          made this final piece just for you...
                        </p>

                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-champagne/50 to-transparent"
                        />

                        <motion.button
                          onClick={handleWatchVideo}
                          whileHover={{
                            scale: 1.04,
                            boxShadow: "0 15px 35px -8px oklch(0.68 0.24 18 / 0.5)",
                          }}
                          whileTap={{ scale: 0.96 }}
                          className="group relative mt-4 inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-3 font-sans text-sm font-medium tracking-wider text-cream uppercase transition-all duration-300"
                          style={{
                            background:
                              "linear-gradient(125deg, oklch(0.68 0.22 18) 0%, oklch(0.75 0.20 18) 50%, oklch(0.82 0.15 85) 100%)",
                            boxShadow: "0 8px 20px -5px oklch(0.68 0.22 18 / 0.4)",
                          }}
                        >
                          <span className="relative z-10">Watch Your Video</span>
                          <motion.div
                            className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent, oklch(0.95 0.15 85 / 0.3), transparent)",
                            }}
                          />
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

      {/* Video Player - elegant slide-in from right */}
      <AnimatePresence>
        {showingVideo && (
          <motion.div
            initial={{ x: "100%", opacity: 0, scale: 0.98 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: "100%", opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.32, 1.2, 0.64, 1] }}
          >
            <FinalVideoTheaterWithAsset onClose={() => setShowingVideo(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default LoveLetter;