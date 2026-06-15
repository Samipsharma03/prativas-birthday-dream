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
 *
 * Redesigned Gallery: Pinterest-style masonry grid with original aspect ratios,
 * enhanced premium aesthetics, refined hover effects, and elegant spacing.
 */

interface GalleryStepProps {
  onUnlock: () => void;
}

/* ════════════════════════════════════════════════════════════════ */
/*     AUTO-DISCOVERY
 *     The gallery auto-discovers files in /images/ and /videos/.
 *     Drop a `gallery-XX.jpg` (or .png/.webp) into /images/ or a
 *     `gallery-XX.mp4` into /videos/ and it appears automatically.
 *     ════════════════════════════════════════════════════════════════ */

interface MediaItem {
  type: "image" | "video";
  src: string;
  poster?: string;
  message: string;
  wide: boolean; // preserved for metadata but not used in masonry layout
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
  "In a world full of temporary things, you stand as a beautiful, forever constant. ✨",
  "Your laughter is an incredibly comforting melody, bringing absolute joy wherever it echoes. 🤍",
  "It is truly wonderful how one single soul can hold so much profound grace.",
  "Your presence alone, Prativa, makes the entire world feel softer, kinder, and so much warmer.",
  "Every quiet moment showing your gentle heart is a precious treasure that shines incredibly bright.",
  "You have this rare, magical ability to heal the world around you just by existing in it. 🌸",
  "Your gentle nature has a way of turning the loudest, most chaotic storms into calm and peaceful seas.",
  "You deserve to see yourself clearly to fully realize just how incredibly radiant, beautiful, and special you truly are.",
  "You are a beautiful thought at the dawn of the day and a source of profound peace when the night falls.",
  "Your genuine smile carries a profound kind of peace that effortlessly brightens up the entire room.",
  "You are like beautiful poetry brought to life, radiating light and elegance into the world. 📜",
  "No matter where life leads, your incredible grace and pure heart will always remain unforgettable.",
  "Your kindness isn't loud, Prativa, but it echoes deeply in the hearts of everyone lucky enough to know you.",
  "You are an incredible anchor, bringing a deep sense of stability, warmth, and grace wherever you go.",
  "Your wonderful soul deserves the absolute highest admiration, appreciation, and love every single day. 💫",
  "Your presence is like a warm ray of sunshine on a rainy afternoon—perfect, comforting, and absolutely necessary.",
  "The universe spent billions of years creating everything, but you are its absolute masterpiece.",
  "Even on the days when the dark clouds roll in, your light breaks through effortlessly.",
  "You define what love truly is—not just a fleeting feeling, but a beautiful, secure, and entirely safe place. 🏡",
  "Every single detail about you—your quirks, your gentle heart, your strength—is worth celebrating.",
  "You are a rare and extraordinary blessing who makes the world infinitely more beautiful just by being in it.",
  "Your quiet strength is a silent reassurance that everything is going to be okay, no matter how chaotic the world gets.",
  "Your life is a beautiful, unfolding story of grace, kindness, and magic that leaves everyone in absolute awe. 📖",
  "You possess a quiet, fierce strength that is absolutely breathtaking and worthy of admiration every single time.",
  "Your existence is completely vital, bringing a breath of fresh air, pure joy, and meaning to the world. ❤️",
  "You are a true sanctuary, Prativa. Not just a person, but a beautiful, comforting soul where peace resides.",
  "There is a deep warmth in your eyes that can instantly melt away the heaviest burdens of a long, stressful day.",
  "If the world were a blank canvas, you would be the brightest, most breathtaking colors painted across it. 🎨",
  "You have an incredibly rare depth, possessing an innate ability to connect with people and bring comfort without needing a single word.",
  "Your radiant energy turns the ordinary, mundane moments of life into absolute, pure magic.",
  "You are a perfect sanctuary, a brilliant adventure, and a truly sweet reality all wrapped into one magnificent person. 🌌",
  "The profound depth of your heart is a beautiful, endless landscape of kindness and grace.",
  "You are the living proof of the kind of pure, genuine goodness that this world so desperately needs right now.",
  "The day you entered the world made it a significantly brighter, happier, and more beautiful place. 🎂",
  "You are a bright sun when days are dark, a guiding moon when nights are long, and a soul filled with brilliant light. ☀️🌙"
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

/* ════════════════════════════════════════════════════════════════ */
/*    PREMIUM GIFT CARD
 *    Redesigned with elegant hover effects, original aspect ratios,
 *    sophisticated shadows, and refined flip interaction.
 *    ════════════════════════════════════════════════════════════════ */

function GiftCard({ item, index }: { item: MediaItem; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
      className="w-full cursor-pointer group/card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay: (index % 5) * 0.06, ease: [0.25, 0.1, 0.1, 1] }}
      onClick={() => setIsFlipped((f) => !f)}
      style={{ perspective: "1600px" }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.65, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
      >
        {/* FRONT - Premium image/video container */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 ease-out"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            backgroundColor: "#faf3ea",
          }}
        >
          {/* Subtle inner border on hover */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none z-10" />
          
          {/* Loading shimmer effect */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50/80 to-stone-100/80 z-0">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-300/60 animate-pulse" style={{ animationDelay: "0ms" }} />
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-300/60 animate-pulse" style={{ animationDelay: "200ms" }} />
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-300/60 animate-pulse" style={{ animationDelay: "400ms" }} />
              </div>
            </div>
          )}

          {item.type === "image" ? (
            <img
              src={item.src}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              className="block w-full h-auto object-cover transition-transform duration-700 group-hover/card:scale-[1.02]"
              style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.3s ease" }}
              onLoad={() => setIsLoaded(true)}
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
              className="block w-full h-auto object-cover transition-transform duration-700 group-hover/card:scale-[1.02]"
              style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.3s ease" }}
              onLoadedData={() => setIsLoaded(true)}
              onCanPlay={() => setIsLoaded(true)}
            />
          )}

          {/* Elegant gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Minimalist tap indicator */}
          <div className="absolute bottom-3 right-3 pointer-events-none z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/60 backdrop-blur-sm px-2 py-0.5 font-sans text-[8px] font-medium tracking-wider text-stone-600/80 shadow-sm">
              tap
            </span>
          </div>
        </div>

        {/* BACK - Romantic message panel with refined aesthetics */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 px-4 py-5 text-center overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "radial-gradient(circle at 30% 20%, #fffaf5, #f7ede3)",
            border: "1px solid rgba(225, 185, 155, 0.4)",
            boxShadow: "inset 0 1px 4px rgba(255,255,245,0.8), 0 8px 20px -8px rgba(0,0,0,0.15)",
          }}
        >
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent" />
          <span className="font-sans text-[9px] tracking-[0.25em] text-rose-700/60 uppercase">
            a whisper from the heart
          </span>
          <p className="font-serif text-sm leading-relaxed text-stone-700 max-w-[90%] mx-auto my-1 line-clamp-6">
            {item.message}
          </p>
          <div className="flex items-center gap-1 text-rose-400/50 text-[10px]">
            <span>✦</span> <span className="text-[8px] tracking-wide">double-tap to close</span> <span>✦</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/*    HERO - Parallax section with sakura petals
 *    ════════════════════════════════════════════════════════════════ */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[70svh] overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #fdf6ec 0%, #f4dcc4 60%, #ecc9a8 100%)",
          }}
        />
      </motion.div>

      <SakuraPetals count={12} />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex min-h-[70svh] flex-col items-center justify-center px-8 text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
          className="max-w-[240px] font-sans text-xs tracking-wider text-stone-600/70"
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
          className="flex h-8 w-5 items-start justify-center rounded-full border border-rose-300/40 pt-1.5"
        >
          <div className="h-2 w-[3px] rounded-full bg-rose-400/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/*    MAIN GALLERY STEP - Pinterest Style Masonry Grid
 *    ════════════════════════════════════════════════════════════════ */

export function GalleryStep({ onUnlock }: GalleryStepProps) {
  const [showUnlockHint, setShowUnlockHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowUnlockHint(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      <section
        className="relative px-4 pb-36 pt-12"
        style={{
          background: "linear-gradient(180deg, #ecc9a8 0%, #fdf6ec 12%, #fdf6ec 85%, #f3dcc4 100%)",
        }}
      >
        <SakuraPetals count={6} fixed />
        
        {/* Gallery Header */}
        <div className="text-center pt-6 pb-10 px-4 relative z-10 max-w-4xl mx-auto">
          <p className="font-sans text-[11px] tracking-[0.4em] text-rose-700/50 uppercase mb-5">
            — Chapter I · Petals of memory —
          </p>
          <h1 className="text-3xl font-light tracking-[0.18em] text-stone-700 uppercase sm:text-4xl md:text-5xl mb-4">
            The Prativa Collection
          </h1>
          <p className="font-serif text-sm text-stone-600/70 italic max-w-md mx-auto">
            A small gallery dedicated to the girl who carries sunshine wherever she goes.
          </p>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-rose-400/40 to-transparent mx-auto mt-7" />
        </div>

        {/* MASONRY GRID - Pinterest-style columns preserving original aspect ratios */}
        <div className="max-w-7xl mx-auto">
          {/* 
            CSS Multi-Column Layout creates true Pinterest-style waterfall grid.
            Each item keeps its intrinsic height (original aspect ratio).
            Responsive breakpoints: 2 columns (mobile), 3 columns (tablet), 4 columns (desktop).
            Elegant spacing, break-inside to prevent card splitting across columns.
          */}
          <div 
            className="columns-2 sm:columns-3 xl:columns-4 gap-x-5 [&>div]:mb-5"
            style={{ 
              columnGap: "1.25rem",
            }}
          >
            {MEDIA.map((item, index) => (
              <div 
                key={index} 
                className="break-inside-avoid"
                style={{ 
                  breakInside: "avoid",
                  marginBottom: "1.25rem",
                }}
              >
                <GiftCard item={item} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Decorative end note */}
        <div className="relative z-10 text-center mt-16 opacity-60">
          <p className="font-serif text-[11px] tracking-[0.25em] text-stone-500 uppercase">
            ∞ every moment with you is a treasure ∞
          </p>
        </div>
      </section>

      {/* Premium Floating CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: showUnlockHint ? 1 : 0, scale: showUnlockHint ? 1 : 0.92 }}
        transition={{ duration: 0.6, ease: "anticipate" }}
        whileHover={{ scale: 1.04, boxShadow: "0 20px 30px -12px rgba(150, 70, 40, 0.5)" }}
        whileTap={{ scale: 0.96 }}
        onClick={onUnlock}
        className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2 rounded-full px-7 py-3 font-sans text-sm font-medium tracking-wide text-white backdrop-blur-sm"
        style={{
          background: "linear-gradient(115deg, #d48d72, #b16248)",
          boxShadow: "0 12px 28px -12px rgba(120, 60, 35, 0.6)",
          border: "1px solid rgba(255,245,235,0.3)",
        }}
      >
        <span className="flex items-center gap-2">
          <span className="text-base">🌸</span>
          Let's move ahead
          <span className="text-base">✨</span>
        </span>
      </motion.button>
    </>
  );
}

export default GalleryStep;
