import { useEffect, useRef, useState, useCallback, ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SakuraPetals } from "./SakuraPetals";

/**
 * GalleryStep
 * -----------
 * Step 1 of the journey — "The Memory Lane".
 *
 * Contains:
 *   • A parallax Hero section with twinkling stars.
 *   • A premium Pinterest-style MASONRY GRID that works flawlessly with any number of photos.
 *   • Each card preserves original aspect ratio (no cropping, no distortion).
 *   • Flip-to-read romantic messages with scrollable text (no overflow).
 *   • A luxurious CTA button to proceed.
 */

interface GalleryStepProps {
  onUnlock: () => void;
}

/* ════════════════════════════════════════════════════════════════ */
/*     AUTO-DISCOVERY – unchanged
 *     ════════════════════════════════════════════════════════════════ */

interface MediaItem {
  type: "image" | "video";
  src: string;
  poster?: string;
  message: string;
  wide: boolean; // preserved for metadata
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

const SLOT_META: Record<string, { message?: string; wide?: boolean }> = {
  "01": { wide: true },
  "06": { wide: true },
  "09": { wide: true },
  "10": { message: "You two are the reason I understand what real love looks like. ❤️" },
  "11": { wide: false },
  "15": { wide: true },
  "18": { message: "Happy Anniversary, Mummy & Baba — thank you for everything." },
  "21": { wide: true },
};

const PRATIVA_MESSAGES = [
  "Mummy, Baba — your love story is the first fairytale I ever believed in. ✨",
  "Thank you for the countless sacrifices I only understood as I grew older. 🤍",
  "Every warm meal, every prayer, every late night — I remember them all.",
  "You built a home where love was the loudest language spoken. 🏡",
  "Baba, thank you for working so hard so I could dream so freely.",
  "Mummy, your gentle strength is the softest, safest place I have ever known.",
  "Watching you two together taught me what patience and partnership really mean.",
  "Everything good in me is a small reflection of the two of you. 🌸",
  "Thank you for choosing each other, and for giving me this beautiful family.",
  "Your love is the quiet magic that has held our lives together. 💫",
  "For every scolding wrapped in love, and every hug that fixed everything — thank you.",
  "You are my first heroes, and you always will be.",
  "The way you laugh together still makes our home feel like the safest place on earth.",
  "Baba, your calm has shaped mine. Mummy, your warmth has shaped my heart.",
  "Growing up, I didn't know I was watching the greatest love story of my life.",
  "Thank you for the values, the roots, and the wings. 🕊️",
  "Every good memory I own has your fingerprints on it.",
  "I hope one day I can love someone the way the two of you love each other.",
  "This home, this love, this family — it all began with you two saying yes to each other. 💍",
  "Happy Anniversary to the couple who taught me what forever looks like. ❤️",
  "For every quiet way you carried us — thank you, from the bottom of my heart.",
  "You made ordinary days feel like something worth remembering.",
  "The love between you two is the greatest inheritance I could ever ask for.",
  "Baba, Mummy — I am so proud to be your son. 🙏",
  "May your love keep growing, softer and stronger, with every passing year.",
  "Thank you for being my safe place, my compass, and my greatest blessing. 🌙",
  "Here's to another year of your beautiful, quiet, unshakeable love. 🥂",
  "Every prayer I have is for the two of you to always stay this happy.",
  "Your love is the reason I still believe in good things. ✨",
  "Happy Anniversary, Mummy & Baba — I love you both, more than words can hold. ❤️"
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
/*    GIFT CARD – with scrollable message (no overflow)
 *    ════════════════════════════════════════════════════════════════ */

function GiftCard({ item, index, onHeightMeasured }: { 
  item: MediaItem; 
  index: number;
  onHeightMeasured?: (index: number, height: number) => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReduced = useReducedMotion();
  const isFlippedRef = useRef(false);
  isFlippedRef.current = isFlipped;

  // Report height to masonry after image loads
  useEffect(() => {
    if (!onHeightMeasured) return;
    if (!cardRef.current) return;
    // Use ResizeObserver to get accurate height after content loads
    const resizeObserver = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height;
      if (height) onHeightMeasured(index, height);
    });
    resizeObserver.observe(cardRef.current);
    return () => resizeObserver.disconnect();
  }, [index, onHeightMeasured]);

  // Also report when isLoaded becomes true (image fully loaded)
  useEffect(() => {
    if (isLoaded && cardRef.current && onHeightMeasured) {
      const height = cardRef.current.offsetHeight;
      if (height) onHeightMeasured(index, height);
    }
  }, [isLoaded, index, onHeightMeasured]);

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: Math.min((index % 8) * 0.05, 0.4), ease: [0.25, 0.1, 0.1, 1] }}
      onClick={() => setIsFlipped((f) => !f)}
      style={{ perspective: "1600px" }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
      >
        {/* FRONT */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500 ease-out"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            backgroundColor: "#faf3ea",
          }}
        >
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none z-10" />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50/80 to-stone-100/80 z-0">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-300/60 animate-pulse" />
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute bottom-3 right-3 pointer-events-none z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/60 backdrop-blur-sm px-2 py-0.5 font-sans text-[8px] font-medium tracking-wider text-stone-600/80 shadow-sm">
              tap
            </span>
          </div>
        </div>

        {/* BACK - with scrollable message */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-start gap-2 px-3 py-4 text-center overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "radial-gradient(circle at 30% 20%, #fffaf5, #f7ede3)",
            border: "1px solid rgba(225, 185, 155, 0.4)",
            boxShadow: "inset 0 1px 4px rgba(255,255,245,0.8), 0 8px 20px -8px rgba(0,0,0,0.15)",
          }}
        >
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent flex-shrink-0" />
          <span className="font-sans text-[9px] tracking-[0.25em] text-rose-700/60 uppercase flex-shrink-0">
            a whisper from the heart
          </span>
          <div className="flex-1 w-full overflow-y-auto my-1 scrollbar-thin scrollbar-thumb-rose-300/40 scrollbar-track-transparent">
            <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-700 px-1">
              {item.message}
            </p>
          </div>
          <div className="flex items-center gap-1 text-rose-400/50 text-[10px] flex-shrink-0 mt-1">
            <span>✦</span> <span className="text-[8px] tracking-wide">tap to close</span> <span>✦</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/*    MASONRY GRID – robust, JS-powered, handles any number of items
 *    ════════════════════════════════════════════════════════════════ */

interface MasonryGridProps {
  children: ReactNode[];
  columnCount: number;
  gap: number;
}

function MasonryGrid({ children, columnCount, gap }: MasonryGridProps) {
  const [columnHeights, setColumnHeights] = useState<number[]>(Array(columnCount).fill(0));
  const [itemPositions, setItemPositions] = useState<{ top: number; left: number; width: number }[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeights = useRef<Map<number, number>>(new Map());
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Update column widths on resize
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setContainerWidth(width);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const updateLayout = useCallback(() => {
    if (!containerWidth) return;
    const colWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;
    const newHeights = Array(columnCount).fill(0);
    const newPositions: typeof itemPositions = [];

    children.forEach((_, idx) => {
      const height = itemHeights.current.get(idx) || 0;
      // Find column with smallest height
      let minCol = 0;
      for (let i = 1; i < columnCount; i++) {
        if (newHeights[i] < newHeights[minCol]) minCol = i;
      }
      const left = minCol * (colWidth + gap);
      const top = newHeights[minCol];
      newPositions.push({ top, left, width: colWidth });
      newHeights[minCol] += height + gap;
    });

    setItemPositions(newPositions);
    setColumnHeights(newHeights);
  }, [children, containerWidth, columnCount, gap]);

  // Debounced layout update
  useEffect(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(updateLayout);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [updateLayout]);

  const handleHeightMeasured = useCallback((index: number, height: number) => {
    const oldHeight = itemHeights.current.get(index);
    if (oldHeight !== height) {
      itemHeights.current.set(index, height);
      updateLayout();
    }
  }, [updateLayout]);

  // Wrap children with height measurement
  const measuredChildren = children.map((child, idx) => (
    <div
      key={idx}
      ref={(el) => {
        if (!el) return;
        // Force height measurement after child mounts
        const measure = () => {
          const h = el.offsetHeight;
          if (h) handleHeightMeasured(idx, h);
        };
        measure();
        // Use ResizeObserver for dynamic changes
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
      }}
    >
      {child}
    </div>
  ));

  const containerHeight = Math.max(...columnHeights, 0);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: containerHeight }}>
      {measuredChildren.map((child, idx) => {
        const pos = itemPositions[idx];
        if (!pos) return null;
        return (
          <div
            key={idx}
            className="absolute"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              transition: "all 0.2s ease-out",
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/*    HERO – unchanged
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
/*    MAIN GALLERY STEP – uses robust MasonryGrid
 *    ════════════════════════════════════════════════════════════════ */

export function GalleryStep({ onUnlock }: GalleryStepProps) {
  const [showUnlockHint, setShowUnlockHint] = useState(false);
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => setShowUnlockHint(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Responsive column count
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumnCount(2);
      else if (width < 1024) setColumnCount(3);
      else setColumnCount(4);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
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
        
        <div className="text-center pt-6 pb-10 px-4 relative z-10 max-w-4xl mx-auto">
          <p className="font-sans text-[11px] tracking-[0.4em] text-rose-700/50 uppercase mb-5">
            — Chapter I · A lifetime of love —
          </p>
          <h1 className="text-3xl font-light tracking-[0.18em] text-stone-700 uppercase sm:text-4xl md:text-5xl mb-4">
            Mummy &amp; Baba
          </h1>
          <p className="font-serif text-sm text-stone-600/70 italic max-w-md mx-auto">
            A little gallery of memories — from the son who owes you everything.
          </p>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-rose-400/40 to-transparent mx-auto mt-7" />
        </div>

        <div className="max-w-7xl mx-auto">
          <MasonryGrid columnCount={columnCount} gap={20}>
            {MEDIA.map((item, idx) => (
              <GiftCard key={idx} item={item} index={idx} />
            ))}
          </MasonryGrid>
        </div>

        <div className="relative z-10 text-center mt-16 opacity-60">
          <p className="font-serif text-[11px] tracking-[0.25em] text-stone-500 uppercase">
            ∞ every moment with you is a treasure ∞
          </p>
        </div>
      </section>

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
