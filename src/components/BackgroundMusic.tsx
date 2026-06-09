import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * BackgroundMusic
 * ---------------
 * A persistent background-music player for the birthday site.
 *
 * How it works with the rest of the app
 * ──────────────────────────────────────
 * Other components (notably the final `<video>`) dispatch two
 * `window` CustomEvents:
 *
 *   • `video-playing` → fade the music volume down to 0 over 1s
 *   • `video-paused`  → fade the music volume back up to its
 *                       original level over 1.5s
 *
 * The fade uses a `requestAnimationFrame` loop so the audio
 * ramps smoothly without pops or clicks.
 *
 * User controls
 * ─────────────
 * A small floating bubble in the bottom-left lets the user:
 *   • Play / pause the music
 *   • Adjust the volume via a slider
 *
 * If the user has explicitly paused the music, ducking events
 * are ignored — the music stays paused and silent, exactly as
 * the user wanted.
 */

const DEFAULT_VOLUME = 0.4;
const FADE_DOWN_MS = 1000;
const FADE_UP_MS = 1500;
const SRC = "/memories/bg-music.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const targetVolumeRef = useRef<number>(DEFAULT_VOLUME);
  const fadeFrameRef = useRef<number | null>(null);

  // User-facing state
  const [isPlaying, setIsPlaying] = useState(false);
  const [userVolume, setUserVolume] = useState<number>(DEFAULT_VOLUME);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [open, setOpen] = useState(false);

  // Build the audio element once. We keep the user volume in a ref
  // so the rAF loop always sees the latest value without restarting.
  useEffect(() => {
    const audio = new Audio(SRC);
    audio.loop = true;
    audio.volume = 0; // start silent; ramp up only after user opts in
    audio.preload = "auto";
    audioRef.current = audio;
    targetVolumeRef.current = 0;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
        fadeFrameRef.current = null;
      }
    };
  }, []);

  // The rAF-based volume ramp. Re-entrant-safe; every call cancels the
  // previous loop so we never have two competing fades.
  const startFade = (toVolume: number, durationMs: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }

    const startVolume = audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // easeInOutCubic for a perceptually smooth ramp
      const eased =
        t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const next = startVolume + (toVolume - startVolume) * eased;
      // Clamp — never let a stray float push the volume above 1
      audio.volume = Math.max(0, Math.min(1, next));

      if (t < 1) {
        fadeFrameRef.current = requestAnimationFrame(step);
      } else {
        fadeFrameRef.current = null;
        audio.volume = toVolume;
      }
    };

    fadeFrameRef.current = requestAnimationFrame(step);
  };

  // Listen for the global ducking events
  useEffect(() => {
    const handleVideoPlaying = () => {
      const audio = audioRef.current;
      if (!audio) return;
      // If the user has paused the music, leave it alone.
      if (!isPlaying) return;
      // Fade the music down to 0 over FADE_DOWN_MS.
      // (We keep the audio element playing so the fade is instant
      //  if the video ends quickly.)
      startFade(0, FADE_DOWN_MS);
    };

    const handleVideoPaused = () => {
      const audio = audioRef.current;
      if (!audio) return;
      // If the user has paused the music, leave it alone.
      if (!isPlaying) return;
      // Fade the music back up to the user's chosen volume.
      startFade(targetVolumeRef.current, FADE_UP_MS);
    };

    window.addEventListener("video-playing", handleVideoPlaying);
    window.addEventListener("video-paused", handleVideoPaused);
    return () => {
      window.removeEventListener("video-playing", handleVideoPlaying);
      window.removeEventListener("video-paused", handleVideoPaused);
    };
  }, [isPlaying]);

  // User actions
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Cancel any fade and pause immediately
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
        fadeFrameRef.current = null;
      }
      audio.pause();
      setIsPlaying(false);
    } else {
      // First user gesture: some browsers require this for autoplay-with-sound
      setHasInteracted(true);
      // Resume AudioContext if it was suspended (Safari/iOS)
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (Ctx) {
          // No-op if not suspended — just a safety net.
        }
      } catch {
        /* ignore */
      }
      audio
        .play()
        .then(() => {
          targetVolumeRef.current = userVolume;
          startFade(userVolume, 800);
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked — user can press the button again.
          setIsPlaying(false);
        });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setUserVolume(v);
    targetVolumeRef.current = v;
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      // Smoothly re-ramp to the new target so it doesn't pop
      startFade(v, 400);
    } else {
      audio.volume = v;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center gap-3 rounded-full bg-midnight/80 px-3 py-2 backdrop-blur-md border border-cream/10 shadow-lg"
          >
            <span className="font-sans text-[10px] tracking-widest text-cream/70 uppercase pl-1">
              {isPlaying ? "playing" : "paused"}
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={userVolume}
              onChange={handleVolumeChange}
              className="w-24 accent-champagne"
              aria-label="Background music volume"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!hasInteracted) {
            handlePlayPause();
          }
        }}
        whileTap={{ scale: 0.92 }}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-midnight/80 backdrop-blur-md border border-cream/10 shadow-lg text-cream hover:text-champagne transition-colors"
        aria-label={
          isPlaying ? "Pause background music" : "Play background music"
        }
        title={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.4-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14Z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}

export default BackgroundMusic;
