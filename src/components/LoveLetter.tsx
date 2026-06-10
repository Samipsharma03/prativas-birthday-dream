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

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-4"
      style={{
        background: "linear-gradient(20deg, rgba(0,31,73,1) 0%, rgba(46,30,66,1) 100%)",
      }}
    >
      {/* Ambient backdrop glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(120,80,200,0.15) 0%, transparent 70%)",
        }}
      />

      <AnimatePresence>
        {!showingVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: "anticipate" }}
            className="relative w-full max-w-md"
          >
            {/* Thank you message - appears after envelope flies away */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-center text-lg font-medium text-champagne" style={{ opacity: 0 }}>
                💌 Your surprise is ready!
              </p>
            </div>

            <div
              id="envelope_form"
              className="envelope-form relative overflow-hidden"
              style={{
                background: "linear-gradient(0deg, #c7c2c5 0%, #c7c2c5 55%, rgba(255,255,255,0) 55%)",
              }}
            >
              {/* Envelope flap */}
              <motion.div
                className="env-top absolute top-[45%] z-50 w-full"
                style={{
                  height: "33%",
                  filter: "drop-shadow(0px 6px 3px rgba(50, 50, 0, 0.1))",
                  transformOrigin: "top",
                }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: envelopeOpen ? -180 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut", delay: envelopeOpen ? 0 : 0.2 }}
                onClick={!envelopeOpen ? handleSealClick : undefined}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: "white",
                    clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                  }}
                />
                {/* Decorative wax seal heart on flap */}
                {!envelopeOpen && (
                  <motion.div
                    className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, oklch(0.72 0.22 18) 0%, oklch(0.65 0.24 18) 100%)",
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
                  </motion.div>
                )}
              </motion.div>

              {/* Envelope bottom */}
              <div className="env-bottom-wrap absolute bottom-0 z-20 h-[55%] w-full">
                <div className="env-bottom relative h-full w-full" style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)" }}>
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "white",
                    }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 w-1/2"
                    style={{
                      background: "#f8f6f7",
                      clipPath: "polygon(100% 50%, 0 0, 0 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-y-0 right-0 w-1/2"
                    style={{
                      background: "#f8f6f7",
                      clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
                    }}
                  />
                </div>
              </div>

              {/* Letter content - slides up from envelope */}
              <AnimatePresence>
                {letterVisible && (
                  <motion.div
                    initial={{ top: "100%" }}
                    animate={{ top: "0" }}
                    exit={{ top: "100%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="env-form-wrap absolute inset-x-0 top-0 z-20 h-full px-6 py-8"
                    style={{
                      background: "#1e1938",
                      color: "white",
                    }}
                  >
                    <div className="flex h-full flex-col justify-center space-y-6 text-center">
                      <h3 className="text-2xl font-medium leading-tight text-champagne">
                        Prativa, every memory we've shared has built a foundation for a beautiful
                        future. You are my greatest gift. To wrap up your birthday surprise, I
                        made this final piece just for you...
                      </h3>

                      <motion.button
                        onClick={handleWatchVideo}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center justify-center rounded-full px-8 py-3 font-sans text-sm font-medium tracking-wider text-cream uppercase"
                        style={{
                          background: "linear-gradient(125deg, oklch(0.68 0.22 18) 0%, oklch(0.75 0.20 18) 50%, oklch(0.82 0.15 85) 100%)",
                          boxShadow: "0 8px 20px -5px oklch(0.68 0.22 18 / 0.4)",
                        }}
                      >
                        Watch Your Video
                      </motion.button>
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