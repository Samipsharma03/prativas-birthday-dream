import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SakuraPetals } from "./SakuraPetals";

/**
 * GalleryStep
 * -----------
 * Step 1 of the journey — "The Memory Lane".
 *
 * Contains:
 *   • A parallax Hero section with twinkling stars.
 *   • The 35-card masonry gallery of gifts (auto-discovered from
 *     /images and /videos).
 *   • A luxurious, premium CTA section at the bottom with a glassmorphism
 *     box, a pulsing heart icon and a stylized "Let's move ahead"
 *     button. Clicking it calls `onUnlock` to transition to step 2 while
 *     background music continues uninterrupted.
 */

interface GalleryStepProps {
  onUnlock: () => void;
}

/* ═══════════════════════════════════════════════════════════════════════════
    AUTO-DISCOVERY
    The gallery auto-discovers files in /images/ and /videos/.
    Drop a `gallery-XX.jpg` (or .png/.webp) into /images/ or a
    `gallery-XX.mp4` into /videos/ and it appears automatically.
    ═══════════════════════════════════════════════════════════════════════════ */

interface MediaItem {
  type: "image" | "video";
  src: string;
  poster?: string;
  message: string;
  wide: boolean;
}

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

function extractSlot(path: string): string | null {
  const m = /gallery-(\d+)\./i.exec(path);
  return m ? m[1] : null;
}

const imageBySlot: Record<string, string> = {};
for (const [path, url] of Object.entries(IMAGE_FILES)) {
  const slot = extractSlot(path);
  if (slot) imageBySlot[slot] = url.replace("/public", "");
}

const videoBySlot: Record<string, string> = {};
for (const [path, url] of Object.entries(VIDEO_FILES)) {
  const slot = extractSlot(path);
  if (slot) videoBySlot[slot] = url.replace("/public", "");
}

const ALL_SLOTS = Array.from(
  new Set([...Object.keys(imageBySlot), ...Object.keys(videoBySlot)]),
).sort((a, b) => Number(a) - Number(b));

/* Per-slot customisation. */
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

const PRATIVA_MESSAGES = [
  "In a world full of temporary things, you are my forever constant. ✨",
  "Your laughter is the most comforting melody my heart has ever known. 🤍",
  "Sometimes I look at you and wonder how one single soul can hold so much grace.",
  "You don't just occupy space in my life, Prativa; you make the entire world softer and warmer.",
  "Every quiet memory with you is a treasure I keep locked in the deepest corners of my mind.",
  "You have this rare, magical ability to heal the world around you just by existing in it. 🌸",
  "With you, the loudest storms inside my head turn into the calmest, most peaceful seas.",
  "If I could give you one gift, it would be the ability to see yourself through my eyes.",
  "You are my favorite thought at the dawn of the day and my safest prayer before I sleep.",
  "There is a profound kind of peace that washes over me the moment I see your genuine smile.",
  "You are the beautiful poetry written between the lines of my otherwise ordinary days. 📜",
  "No matter where life takes us, my heart will always know the exact path back to you.",
  "Your kindness isn't loud, Prativa, but it echoes deeply in the hearts of everyone lucky enough to know you.",
  "I didn't know what it truly felt like to be completely anchored until you walked into my world.",
  "Of all the versions of myself I've ever been, the one that loves you is my absolute favorite. 💫",
  "Your presence feels like a warm cup of tea on a rainy afternoon—perfect, comforting, and necessary.",
  "The universe spent billions of years creating everything, but you are its absolute masterpiece.",
  "Even on the days when the dark clouds roll in, your light breaks through effortlessly.",
  "You have taught me that love isn't just a feeling; it's a safe place, and that place is you. 🏡",
  "Every single detail about you—your quirks, your gentle heart, your strength—is worth celebrating.",
  "When I count the blessings that make life beautiful, I count you a thousand times over.",
  "You are the silent reassurance that everything is going to be okay, no matter how chaotic life gets.",
  "A life shared with you is a beautiful story I never, ever want to finish reading. 📖",
  "You possess a quiet, fierce strength that leaves me in absolute awe every single time.",
  "Loving you is as natural as breathing, and just as vital to my existence. 🫁❤️",
  "You are my home, Prativa. Not a place, but a person. A soul I always want to rest next to.",
  "There is a deep warmth in your eyes that can instantly melt away the heaviest burdens of a long day.",
  "If my life were a canvas, you would be the brightest, most breathtaking colors painted on it. 🎨",
  "Thank you for being the only person who understands the words I never manage to say out loud.",
  "You make the ordinary, mundane moments feel like absolute magic, just by sharing them.",
  "You are my sanctuary, my greatest adventure, and my sweetest reality all wrapped into one. 🌌",
  "The depth of your heart is a beautiful mystery I want to spend the rest of my life exploring.",
  "You make me believe in the kind of pure goodness that this world so desperately needs.",
  "Every single heartbeat of mine carries a quiet thank you for the day you entered my life.",
  "You are my sun on the darkest days, my moon when the night is long, and my absolute everything. ☀️🌙",
];

const messageForIndex = (index: number, slot: string): string => {
  const explicit = SLOT_META[slot]?.message;
  if (explicit) return explicit;
  return PRATIVA_MESSAGES[index % PRATIVA_MESSAGES.length];
};

const MEDIA: MediaItem[] = ALL_SLOTS.map((slot, index) => {
  const num = Number(slot);
  const videoUrl = videoBySlot[slot];
  const imageUrl = imageBySlot[slot];

  if (videoUrl) {
    return {
      type: "video",
      src: videoUrl,
      poster: imageUrl,
      message: messageForIndex(index, slot),
      wide: SLOT_META[slot]?.wide ?? num % 5 === 1,
    };
  }

  return {
    type: "image",
    src: imageUrl,
    message: messageForIndex(index, slot),
    wide: SLOT_META[slot]?.wide ?? num % 5 === 1,
  };
});

/* ═══════════════════════════════════════════════════════════════════════════
   GIFT CARD
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

  useEffect(() => {
    if (videoSrc && isVisible && !isFlippedRef.current) {
      videoRef.current?.play().catch(() => {});
    }
  }, [videoSrc, isVisible]);

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
        {/* FRONT */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={
            {
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: "linear-gradient(135deg, oklch(0.28 0.10 320), oklch(0.20 0.08 290))",
              minHeight: "140px",
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
              className="block w-full h-auto object-cover"
              style={{ aspectRatio: "auto" }}
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
              className="block w-full h-auto object-cover"
              style={{ aspectRatio: "3 / 4" }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-midnight/50 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-2 right-2 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-full bg-midnight/65 backdrop-blur-sm px-2 py-0.5 font-sans text-[9px] tracking-widest text-cream/65">
              <svg
                className="w-3 h-3 text-champagne/70"
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
              tap
            </span>
          </div>
        </div>

        {/* BACK */}
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
   HERO
   ═══════════════════════════════════════════════════════════════════════════ */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80"
          alt=""
          loading="eager"
          className="h-[135%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f2a]/70 via-[#2a1438]/40 to-[#0f0a1c]" />
      </motion.div>

      {/* Falling sakura petals across the hero */}
      <SakuraPetals count={14} />


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

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-8 text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1.3, ease: "easeOut" }}
          className="max-w-[200px] font-sans text-xs leading-relaxed text-cream/55"
        >
          scroll through your memories below
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
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

export function GalleryStep({ onUnlock }: GalleryStepProps) {
  const [showUnlockHint, setShowUnlockHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowUnlockHint(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <section className="relative px-4 pb-32 pt-16" style={{ background: "linear-gradient(180deg, #0f0a1c 0%, #1a0f2a 50%, #0f0a1c 100%)" }}>
        {/* Fixed sakura drifting across the whole gallery as you scroll */}
        <SakuraPetals count={12} fixed />
        {/* Premium Gallery Header */}
        <div className="text-center pt-12 pb-6 px-4 relative z-10">
          <p className="font-sans text-[10px] tracking-[0.4em] text-sakura/80 uppercase mb-4">— Chapter I · Petals of memory —</p>
          <h1 className="text-shimmer text-3xl font-extralight tracking-[0.2em] uppercase sm:text-4xl md:text-5xl mb-3">
            The Prativa Collection
          </h1>
          <p className="font-light tracking-wide text-xs sm:text-sm text-white/65 italic max-w-md mx-auto">
            A small gallery dedicated to the girl who carries sunshine wherever she goes.
          </p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-sakura/60 to-transparent mx-auto mt-6" />
        </div>

        {/* 2-column uneven masonry grid (preserved exactly as before) */}
        <div className="relative z-10 mx-auto max-w-4xl columns-2 gap-3 md:columns-3">
          {MEDIA.map((item, index) => (
            <GiftCard key={index} item={item} index={index} />
          ))}
        </div>
      </section>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: showUnlockHint ? 1 : 0, scale: showUnlockHint ? 1 : 0.9 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onUnlock}
        className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2 rounded-full px-6 py-2.5 font-sans text-xs font-medium text-cream"
        style={{
          background: "linear-gradient(135deg, oklch(0.62 0.20 350), oklch(0.50 0.22 340))",
          boxShadow: "0 10px 30px -8px oklch(0.62 0.20 350 / 0.55)",
        }}
      >
        Let's move ahead
      </motion.button>
    </>
  );
}

export default GalleryStep;
