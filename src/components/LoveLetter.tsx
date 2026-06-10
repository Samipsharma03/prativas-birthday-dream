import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FinalVideoTheaterWithAsset } from "./FinalVideoTheater";
import { FinalMessage } from "./FinalMessage";

interface LoveLetterProps {
  onOpenComplete?: () => void;
}

export function LoveLetter({ onOpenComplete }: LoveLetterProps) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [showingVideo, setShowingVideo] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  const handleSealClick = () => {
    if (envelopeOpen) return;

    // Dispatch fade-out event to BackgroundMusic
    window.dispatchEvent(new Event("bg-music-fade-out"));
    setEnvelopeOpen(true);

    setTimeout(() => {
      setLetterVisible(true);
    }, 500);
  };

  const handleWatchVideo = () => {
    setEnvelopeOpen(false);
    setLetterVisible(false);
    setTimeout(() => {
      setShowingVideo(true);
      onOpenComplete?.();
    }, 300);
  };

  const handleVideoEnded = () => {
    setShowingVideo(false);
    setShowFinalMessage(true);
  };

  const handleVideoClose = () => {
    setShowingVideo(false);
  };

  const handleReplayFinal = () => {
    setShowFinalMessage(false);
    // Wait for the exit animation, then re-open the envelope
    setTimeout(() => {
      setEnvelopeOpen(false);
      setLetterVisible(false);
      setShowingVideo(false);
      setShowFinalMessage(false);
    }, 600);
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: "linear-gradient(20deg, rgba(0,31,73,1) 0%, rgba(46,30,66,1) 100%)",
      }}
    >
      <AnimatePresence mode="wait">
        {/* ENVELOPE STAGE */}
        {!showingVideo && !showFinalMessage && (
          <motion.div
            key="envelope-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative flex min-h-screen items-center justify-center p-4"
          >
            {/* Ambient backdrop glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(120,80,200,0.15) 0%, transparent 70%)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, ease: "anticipate" }}
              className="relative w-full max-w-[340px]"
            >
              {/* Thank you message - appears after envelope flies away */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <p
                  className="text-center text-base font-medium text-champagne"
                  style={{ opacity: 0 }}
                >
                  💌 Your surprise is ready!
                </p>
              </div>

              {/* Envelope Container - single cream rectangle, strict bounds for mobile */}
              <div
                id="envelope_form"
                className="envelope-form relative w-full overflow-hidden rounded-2xl"
                style={{
                  aspectRatio: "1 / 0.7",
                  background: "#f4e8d8",
                  boxShadow:
                    "0 20px 60px -10px rgba(0,0,0,0.5), 0 8px 20px -5px rgba(0,0,0,0.3)",
                }}
              >
                {/* LAYER 1 (z-10) - Envelope Body Background (single uniform cream rectangle) */}
                <div
                  className="env-back absolute inset-0 z-10"
                  style={{
                    background: "#f4e8d8",
                  }}
                />

                {/* LAYER 2 (z-20) - Message / Letter Card - EMERGES from inside the envelope. */}
                <AnimatePresence>
                  {letterVisible && (
                    <motion.div
                      initial={{ y: "100%", scale: 0.94, opacity: 0.6 }}
                      animate={{ y: "0%", scale: 1, opacity: 1 }}
                      exit={{ y: "100%", scale: 0.96, opacity: 0 }}
                      transition={{
                        duration: 0.7,
                        ease: [0.22, 0.9, 0.32, 1],
                      }}
                      className="env-letter absolute inset-x-0 bottom-0 z-20 flex items-center justify-center p-3 sm:p-4"
                      style={{ height: "100%" }}
                    >
                      <div
                        className="env-letter-card mx-auto flex w-[92%] flex-col items-center justify-center gap-3 rounded-xl p-4 text-center sm:gap-4 sm:p-5"
                        style={{
                          background: "#1e1938",
                          color: "white",
                          boxShadow:
                            "0 10px 30px -5px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <h3 className="text-sm font-medium leading-snug text-champagne sm:text-base">
                          You have this incredibly rare, amazing energy that 
                          just makes everything feel a 
                          little brighter whenever you're around. 
                          I don't think you even realize how much your 
                          presence is appreciated, Prativa. Happy Birthday!
                        </h3>

                        <motion.button
                          onClick={handleWatchVideo}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="inline-flex items-center justify-center rounded-full px-6 py-2.5 font-sans text-xs font-medium tracking-wider text-cream uppercase sm:text-sm"
                          style={{
                            background:
                              "linear-gradient(125deg, oklch(0.68 0.22 18) 0%, oklch(0.75 0.20 18) 50%, oklch(0.82 0.15 85) 100%)",
                            boxShadow:
                              "0 8px 20px -5px oklch(0.68 0.22 18 / 0.4)",
                          }}
                        >
                          Watch Your Video
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* LAYER 3 (z-30) - Front V-pocket drawn as SUBTLE STROKES (fold lines) */}
                <svg
                  className="env-front-pocket pointer-events-none absolute inset-0 z-30 h-full w-full"
                  viewBox="0 0 100 70"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <line
                    x1="0"
                    y1="70"
                    x2="50"
                    y2="35"
                    stroke="rgba(120, 90, 50, 0.18)"
                    strokeWidth="0.6"
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    x1="100"
                    y1="70"
                    x2="50"
                    y2="35"
                    stroke="rgba(120, 90, 50, 0.18)"
                    strokeWidth="0.6"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* LAYER 4 (z-40) - Top opening flap */}
                <motion.div
                  className="env-top absolute top-0 w-full"
                  style={{
                    zIndex: envelopeOpen ? 0 : 40,
                    height: "50%",
                    transformOrigin: "top center",
                  }}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: envelopeOpen ? -180 : 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                    delay: envelopeOpen ? 0 : 0.2,
                  }}
                  onClick={!envelopeOpen ? handleSealClick : undefined}
                >
                  <div
                    className="env-top-inner h-full w-full"
                    style={{
                      background: "#f4e8d8",
                      clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                      backfaceVisibility: "hidden",
                      filter: "drop-shadow(0px 4px 6px rgba(120, 90, 50, 0.15))",
                    }}
                  />
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden
                    style={{ zIndex: 1 }}
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="50"
                      y2="100"
                      stroke="rgba(120, 90, 50, 0.18)"
                      strokeWidth="0.8"
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1="100"
                      y1="0"
                      x2="50"
                      y2="100"
                      stroke="rgba(120, 90, 50, 0.18)"
                      strokeWidth="0.8"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </motion.div>

                {/* Decorative wax seal heart */}
                {!envelopeOpen && (
                  <motion.button
                    type="button"
                    aria-label="Open envelope"
                    className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, oklch(0.72 0.22 18) 0%, oklch(0.65 0.24 18) 100%)",
                      boxShadow: "0 0 15px oklch(0.72 0.22 18 / 0.6)",
                      border: "1px solid oklch(0.88 0.18 85 / 0.5)",
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    onClick={handleSealClick}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-full w-full p-2 text-champagne/90"
                      fill="currentColor"
                    >
                      <path d="M12 21s-7-4.5-9.5-9.5C1 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6 4 4.5 7.5C19 16.5 12 21 12 21z" />
                    </svg>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* VIDEO STAGE */}
        {showingVideo && (
          <motion.div
            key="video-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <FinalVideoTheaterWithAsset
              onClose={handleVideoClose}
              onEnded={handleVideoEnded}
            />
          </motion.div>
        )}

        {/* FINAL MESSAGE STAGE - shown automatically when the video ends */}
        {showFinalMessage && (
          <FinalMessage key="final-message-stage" onReplay={handleReplayFinal} />
        )}
      </AnimatePresence>
    </section>
  );
}

export default LoveLetter;
