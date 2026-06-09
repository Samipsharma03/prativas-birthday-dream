import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { BackgroundMusic } from "../components/BackgroundMusic";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Prativa ✨" },
      {
        name: "description",
        content: "A magical birthday journey for Prativa — memories, messages, and love.",
      },
      { property: "og:title", content: "Happy Birthday, Prativa ✨" },
      { property: "og:description", content: "A magical birthday journey for Prativa." },
      { name: "theme-color", content: "#110f1c" },
    ],
  }),
  component: Index,
});

/* ═══════════════════════════════════════════════════════════════════════════
   AUTO-DISCOVERY

   The gallery auto-discovers files in public/images/ and public/videos/.
   Drop a `gallery-XX.jpg` (or .png/.webp) into public/images/ OR a
   `gallery-XX.mp4` into public/videos/ and it appears in the grid
   automatically — no code edits required.
═══════════════════════════════════════════════════════════════════════════ */

interface MediaItem {
  type: "image" | "video";
  src: string;
  poster?: string;
  message: string;
  wide: boolean;
}

/* ── Auto-discover every gallery file at build time ─────────────────────
   Vite's `import.meta.glob` enumerates actual files in `public/`, so
   dropping a new `gallery-XX.jpg` or `gallery-XX.mp4` into the right
   folder is enough — no code edits required. */
const IMAGE_FILES = import.meta.glob("/public/images/gallery-*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const VIDEO_FILES = import.meta.glob("/public/videos/gallery-*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

/* Auto-discover the final video (`final.mp4`) at build time. */
const FINAL_VIDEO_FILE = import.meta.glob("/public/videos/final.mp4", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const FINAL_VIDEO_SRC: string | null =
  Object.values(FINAL_VIDEO_FILE)[0] ?? null;

function extractSlot(path: string): string | null {
  const m = /gallery-(\d+)\./i.exec(path);
  return m ? m[1] : null;
}

const imageBySlot: Record<string, string> = {};
for (const [path, url] of Object.entries(IMAGE_FILES)) {
  const slot = extractSlot(path);
  if (slot) imageBySlot[slot] = url;
}

const videoBySlot: Record<string, string> = {};
for (const [path, url] of Object.entries(VIDEO_FILES)) {
  const slot = extractSlot(path);
  if (slot) videoBySlot[slot] = url;
}

const ALL_SLOTS = Array.from(
  new Set([...Object.keys(imageBySlot), ...Object.keys(videoBySlot)]),
).sort((a, b) => Number(a) - Number(b));

/* Per-slot customisation: override message / mark as wide. */
const SLOT_META: Record<string, { message?: string; wide?: boolean }> = {
  "01": { wide: true },
  "06": { wide: true },
  "09": { wide: true },
  "10": { message: "You deserve all the happiness in the universe." },
  "11": { wide: false },
  "15": { wide: true },
  "18": { message: "May this year bring you everything your heart desires." },
  "21": { wide: true },
};

const DEFAULT_MESSAGES = [
  "You make the world brighter just by being in it. ✨",
  "A little reminder of how loved you are.",
  "Some moments are worth keeping forever.",
  "You deserve every good thing coming your way.",
  "Thinking of you, always.",
  "You are someone's favourite person, you know.",
  "Another memory, another reason to smile.",
  "This one's just for you, Prativa. 🤍",
];

const slotMessage = (slot: string): string => {
  const explicit = SLOT_META[slot]?.message;
  if (explicit) return explicit;
  return DEFAULT_MESSAGES[Number(slot) % DEFAULT_MESSAGES.length];
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80";
const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1503516459261-40c66117780a?auto=format&fit=crop&w=900&q=80";

const MEDIA: MediaItem[] = ALL_SLOTS.map((slot) => {
  const num = Number(slot);
  const videoUrl = videoBySlot[slot];
  const imageUrl = imageBySlot[slot];

  if (videoUrl) {
    return {
      type: "video",
      src: videoUrl,
      poster: imageUrl ?? FALLBACK_POSTER,
      message: slotMessage(slot),
      wide: SLOT_META[slot]?.wide ?? num % 5 === 1,
    };
  }

  return {
    type: "image",
    src: imageUrl ?? FALLBACK_IMAGE,
    message: slotMessage(slot),
    wide: SLOT_META[slot]?.wide ?? num % 5 === 1,
  };
});

/* End of auto-discovered MEDIA array. */

/* ═══════════════════════════════════════════════════════════════════════════
   GIFT CARD — tap-to-flip with hidden message
   Front: photo or auto-playing video with gift box overlay
   Back: frosted glass message panel
═══════════════════════════════════════════════════════════════════════════ */

function GiftCard({ item, index }: { item: MediaItem; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReduced = useReducedMotion();

  const isFlippedRef = useRef(false);
  isFlippedRef.current = isFlipped;

  // Lazy src — populate src when card approaches viewport
  useEffect(() => {
    if (item.type !== "video") return;
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoSrc(item.src);
          obs.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [item.type, item.src]);

  // Autoplay — play when ≥50% visible, pause otherwise
  useEffect(() => {
    if (item.type !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.intersectionRatio >= 0.5;
        setIsVisible(nowVisible);
        if (nowVisible && !isFlippedRef.current) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, [item.type]);

  // Start playing once src loads and card is in view
  useEffect(() => {
    if (videoSrc && isVisible && !isFlippedRef.current) {
      videoRef.current?.play().catch(() => {});
    }
  }, [videoSrc, isVisible]);

  // Sync playback with flip state
  useEffect(() => {
    if (item.type !== "video") return;
    if (isFlipped) {
      videoRef.current?.pause();
    } else if (isVisible && videoSrc) {
      videoRef.current?.play().catch(() => {});
    }
  }, [isFlipped, item.type, isVisible, videoSrc]);

  return (
    <motion.div
      ref={cardRef}
      className="mb-2 break-inside-avoid cursor-pointer"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-25px" }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.07, ease: "easeOut" }}
      onClick={() => setIsFlipped((f) => !f)}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full"
        style={
          {
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
          } as React.CSSProperties
        }
      >
        {/* ── FRONT ── */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={
            {
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            } as React.CSSProperties
          }
        >
          {item.type === "image" ? (
            <img
              src={item.src}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              className="w-full h-auto object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              src={videoSrc ?? undefined}
              poster={item.poster}
              muted
              loop
              playsInline
              preload="none"
              className="w-full h-auto object-cover bg-midnight"
            />
          )}

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/50 via-transparent to-transparent pointer-events-none" />

          {/* Gift box icon + tap hint */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-1 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-8 h-8 text-champagne/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 9V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3m18 0v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9m18 0h-2M3 9h2m0 0h14M5 9V4m14 5V4"
                />
              </svg>
            </div>
          </div>

          {/* Tap hint badge */}
          <div className="absolute bottom-2 right-2 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-full bg-midnight/65 backdrop-blur-sm px-2 py-0.5 font-sans text-[9px] tracking-widest text-cream/65">
              <svg className="w-3 h-3 text-champagne/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 9V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3m18 0v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9m18 0h-2M3 9h2" />
              </svg>
              tap
            </span>
          </div>
        </div>

        {/* ── BACK (message) ── */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2.5 px-4 py-5 text-center min-h-[120px]"
          style={
            {
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "oklch(0.16 0.09 280 / 0.95)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid oklch(0.86 0.09 85 / 0.20)",
            } as React.CSSProperties
          }
        >
          <span className="font-sans text-[9px] tracking-[0.2em] text-champagne/55 uppercase">
            a gift for you ✦
          </span>
          <p className="font-script text-lg leading-snug text-cream sm:text-xl">{item.message}</p>
          <span className="font-sans text-[8px] text-cream/25 mt-0.5">tap to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO — Parallax background + one-word-at-a-time reveal
═══════════════════════════════════════════════════════════════════════════ */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const words: { text: string; className: string }[] = [
    {
      text: "Happy.",
      className: "font-display font-light text-cream tracking-tight text-5xl sm:text-6xl",
    },
    {
      text: "Birthday.",
      className: "font-display font-light text-cream tracking-tight text-5xl sm:text-6xl",
    },
    { text: "Prativa.", className: "font-script text-blush text-6xl sm:text-7xl" },
  ];

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      {/* Parallax background image */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80"
          alt=""
          loading="eager"
          className="h-[135%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/65 via-midnight/30 to-midnight" />
      </motion.div>

      {/* Twinkling stars */}
      {Array.from({ length: 36 }).map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-champagne/70 animate-twinkle"
          style={{
            width: `${1 + (i % 2)}px`,
            height: `${1 + (i % 2)}px`,
            left: `${(i * 47) % 100}%`,
            top: `${(i * 31) % 88}%`,
            animationDelay: `${(i % 6) * 0.5}s`,
          }}
        />
      ))}

      {/* Hero content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-8 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1.3, ease: "easeOut" }}
          className="mb-6 font-script text-xl text-champagne/80 sm:text-2xl"
        >
          a little something for
        </motion.p>

        <h1 className="flex flex-col items-center gap-1">
          {words.map((w, i) => (
            <motion.span
              key={w.text}
              className={`block leading-tight ${w.className}`}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 1.0 + i * 0.8, duration: 1.1, ease: "easeOut" }}
            >
              {w.text}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.3, duration: 1.5 }}
          className="mt-10 max-w-[200px] font-sans text-xs leading-relaxed text-cream/55"
        >
          scroll through your memories below
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="flex h-8 w-5 items-start justify-center rounded-full border border-cream/25 pt-1.5"
        >
          <div className="h-2 w-[3px] rounded-full bg-cream/45" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GALLERY — CSS columns masonry (true masonry alignment)
═══════════════════════════════════════════════════════════════════════════ */

function Gallery() {
  return (
    <section className="bg-midnight px-2.5 pb-8 pt-10 sm:px-4 sm:pt-14">
      <div className="mx-auto max-w-lg">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-8 text-center"
        >
          <h2 className="font-display text-3xl font-light text-cream sm:text-4xl">
            Your <span className="font-script text-blush">Memories</span>
          </h2>
          <p className="mt-2 font-sans text-[11px] tracking-widest text-cream/35">
            tap any gift to reveal a message 💌
          </p>
        </motion.div>

        {/* Masonry via CSS columns — 2 cols on mobile, items flow naturally */}
        <div className="columns-2 gap-2 sm:gap-2.5">
          {MEDIA.map((item, i) => (
            <GiftCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FINAL VIDEO — Full-width hero-style video at the end
═══════════════════════════════════════════════════════════════════════════ */

function FinalVideo() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Prefer the local `final.mp4` from public/videos/; fall back to a remote URL.
  const finalVideoSrc =
    FINAL_VIDEO_SRC ??
    "https://cdn.pixabay.com/video/2022/03/13/110624-687822405_large.mp4";
  const finalPoster =
    "https://images.unsplash.com/photo-1503516459261-40c66117780a?auto=format&fit=crop&w=1200&q=80";

  // Lazy load video src
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoSrc(finalVideoSrc);
          obs.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [finalVideoSrc]);

  // Autoplay when visible — also notify the global BackgroundMusic so it
  // can "duck" (fade its volume) while the final video is audible.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const dispatchPlaying = () => {
      window.dispatchEvent(new Event("video-playing"));
    };
    const dispatchPaused = () => {
      window.dispatchEvent(new Event("video-paused"));
    };

    video.addEventListener("play", dispatchPlaying);
    video.addEventListener("pause", dispatchPaused);
    video.addEventListener("ended", dispatchPaused);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.3) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(video);

    return () => {
      video.removeEventListener("play", dispatchPlaying);
      video.removeEventListener("pause", dispatchPaused);
      video.removeEventListener("ended", dispatchPaused);
      obs.disconnect();
    };
  }, []);

  // Tap to toggle mute (tap counts as a user gesture, which unblocks sound).
  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    video.muted = nextMuted;
    video.play().catch(() => {});
  };

  return (
    <section ref={sectionRef} className="relative bg-midnight px-2.5 pb-16 sm:px-4">
      <div className="mx-auto max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-6 text-center"
        >
          <p className="font-script text-xl text-champagne/70 sm:text-2xl">
            one last thing...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_oklch(0.88_0.06_10/0.15)]"
        >
          <div
            onClick={handleToggleMute}
            className="relative cursor-pointer"
            role="button"
            aria-label={isMuted ? "Tap to unmute video" : "Tap to mute video"}
          >
            <video
              ref={videoRef}
              src={videoSrc ?? undefined}
              poster={finalPoster}
              muted={isMuted}
              loop
              playsInline
              preload="none"
              className="w-full h-auto object-cover bg-midnight"
            />

            {/* Soft vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-midnight/20 pointer-events-none" />

            {/* Tap-to-unmute hint (only while muted) */}
            {isMuted && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-midnight/65 px-3 py-1.5 font-sans text-[10px] tracking-widest text-cream/85 backdrop-blur-sm"
                >
                  <svg
                    className="w-3.5 h-3.5 text-champagne/80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.586 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                  tap for sound
                </motion.span>
              </div>
            )}

            {/* Tappable "sound on" badge once unmuted */}
            {!isMuted && (
              <div className="absolute bottom-2 right-2 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-midnight/60 px-2.5 py-1 font-sans text-[9px] tracking-widest text-cream/70 backdrop-blur-sm">
                  <svg
                    className="w-3 h-3 text-champagne/80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.586 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.536 8.464a5 5 0 0 1 0 7.072M18.364 5.636a9 9 0 0 1 0 12.728"
                    />
                  </svg>
                  tap to mute
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CLOSING — Glow final message with confetti-like stars
═══════════════════════════════════════════════════════════════════════════ */

function Closing() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-midnight via-midnight to-blush/10 px-6 py-32 sm:py-44">
      {/* Ambient radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.88 0.06 10 / 0.22) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 bottom-1/4 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.86 0.09 85 / 0.15) 0%, transparent 70%)",
          filter: "blur(35px)",
        }}
      />

      {/* Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-champagne/60 animate-twinkle"
          style={{
            width: `${1 + (i % 2)}px`,
            height: `${1 + (i % 2)}px`,
            left: `${(i * 59) % 100}%`,
            top: `${(i * 41) % 100}%`,
            animationDelay: `${(i % 6) * 0.55}s`,
          }}
        />
      ))}

      <div className="relative mx-auto max-w-xs text-center">
        <motion.p
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="font-display text-2xl font-light leading-relaxed text-cream sm:text-3xl"
        >
          Wishing you a{" "}
          <em className="not-italic font-script text-3xl text-champagne animate-glow sm:text-4xl">
            beautiful
          </em>{" "}
          year,
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 1.4, ease: "easeOut" }}
          className="mt-3 font-script text-5xl text-blush sm:text-6xl"
          style={{
            textShadow:
              "0 0 28px oklch(0.88 0.06 10 / 0.55), 0 0 56px oklch(0.88 0.06 10 / 0.28)",
          }}
        >
          Prativa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, duration: 1.2, ease: "easeOut" }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <span className="h-px w-8 bg-champagne/25" />
          <span className="font-sans text-[10px] tracking-[0.25em] text-champagne/40 uppercase">
            with love
          </span>
          <span className="h-px w-8 bg-champagne/25" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.6, duration: 1.8 }}
          className="mt-6 font-display text-base font-light text-cream/50 leading-relaxed"
        >
          May every sunrise bring you hope,
          <br />
          every sunset bring you peace,
          <br />
          and every moment in between
          <br />
          remind you how loved you are.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2.4, duration: 1.5 }}
          className="mt-8 font-script text-sm text-cream/30"
        >
          Happy Birthday, forever and always. ✨
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════════════════════════════════════════ */

function Index() {
  return (
    <main className="overflow-x-hidden bg-midnight text-cream">
      <BackgroundMusic />
      <Hero />
      <Gallery />
      <FinalVideo />
      <Closing />
    </main>
  );
}
