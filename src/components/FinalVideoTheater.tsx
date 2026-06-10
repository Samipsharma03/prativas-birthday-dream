import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * FinalVideoTheater
 * -----------------
 * Cinematic full-viewport video player. Background music has already
 * faded out before this mounts. The video plays unmuted immediately.
 */

interface FinalVideoTheaterProps {
  videoSrc: string;
  posterSrc?: string;
  onClose: () => void;
}

const FINAL_VIDEO_GLOB = import.meta.glob("/public/videos/final.*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const resolveFinalAsset = (): { src: string; poster: string | null } | null => {
  const entries = Object.entries(FINAL_VIDEO_GLOB);
  if (entries.length === 0) return null;

  const sorted = entries.sort(([a], [b]) => {
    const ext = (s: string) => s.split(".").pop()?.toLowerCase() ?? "";
    const order = ["mp4", "webm", "mov", "m4v"];
    return order.indexOf(ext(a)) - order.indexOf(ext(b));
  });

  const [videoPath, videoUrl] = sorted[0];
  const base = videoPath.replace(/\.[^.]+$/, "");

  const posterCandidates = [".jpg", ".jpeg", ".png", ".webp"];
  const posterUrl = posterCandidates.map((ext) => `${base}${ext}`).find((p) => FINAL_VIDEO_GLOB[p]);

  return {
    src: videoUrl,
    poster: posterUrl ? (FINAL_VIDEO_GLOB[posterUrl] ?? null) : null,
  };
};

export function FinalVideoTheater({ videoSrc, posterSrc, onClose }: FinalVideoTheaterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay unmuted immediately on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    const result = video.play();
    if (result && typeof result.then === "function") {
      result
        .then(() => {
          setHasStarted(true);
          setIsPlaying(true);
        })
        .catch(() => {});
    } else {
      setHasStarted(true);
      setIsPlaying(true);
    }
  }, []);

  // Wire up play/pause/ended events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  return (
    <motion.div
      key="theater"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: "inset 0 0 200px rgba(0,0,0,0.85)",
        }}
      />

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="relative h-full w-full"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          playsInline
          preload="metadata"
          muted={false}
          className="h-full w-full object-contain"
        />
      </motion.div>

      {!hasStarted && (
        <motion.button
          type="button"
          onClick={() => {
            const video = videoRef.current;
            if (video) {
              video.muted = false;
              video.play().catch(() => {});
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="group absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          aria-label="Tap to play with sound"
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
              className="flex h-20 w-20 items-center justify-center rounded-full border border-cream/30 bg-midnight/55 backdrop-blur-md"
            >
              <svg className="ml-1 h-8 w-8 text-cream/90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>
            <span className="font-sans text-[10px] tracking-[0.35em] text-cream/70 uppercase">
              tap to play with sound
            </span>
          </div>
        </motion.button>
      )}

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={handleRestart}
          aria-label="Restart the video"
          className="group flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 bg-black/35 text-cream/75 backdrop-blur-md transition hover:border-cream/40 hover:text-cream"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v6h6M20 20v-6h-6M20 10A8 8 0 0 0 5.6 7.6M4 14a8 8 0 0 0 14.4 2.4"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close the video and return to the start"
          className="group flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 bg-black/35 text-cream/75 backdrop-blur-md transition hover:border-cream/40 hover:text-cream"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/10 bg-black/30 px-2.5 py-1 font-sans text-[9px] tracking-[0.3em] text-cream/45 uppercase backdrop-blur-sm">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: isPlaying ? "oklch(0.78 0.18 18)" : "oklch(0.70 0.02 80)",
              boxShadow: isPlaying ? "0 0 8px oklch(0.78 0.18 18 / 0.8)" : "none",
            }}
          />
          {isPlaying ? "playing" : "paused"}
        </span>
      </div>
    </motion.div>
  );
}

export function FinalVideoTheaterWithAsset({ onClose }: { onClose: () => void }) {
  const asset = resolveFinalAsset();
  const finalSrc =
    asset?.src ?? "https://cdn.pixabay.com/video/2022/03/13/110624-687822405_large.mp4";
  const finalPoster =
    asset?.poster ??
    "https://images.unsplash.com/photo-1503516459261-40c66117780a?auto=format&fit=crop&w=1200&q=80";

  return <FinalVideoTheater videoSrc={finalSrc} posterSrc={finalPoster} onClose={onClose} />;
}

export default FinalVideoTheater;