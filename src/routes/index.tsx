import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
  PanInfo,
} from "framer-motion";
import confetti from "canvas-confetti";
import {
  ChevronDown,
  Gift,
  Mail,
  Heart,
  Sparkles,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Prativa ✨" },
      { name: "description", content: "A magical birthday celebration for Prativa — memories, messages, and a little bit of magic." },
      { property: "og:title", content: "Happy Birthday, Prativa ✨" },
      { property: "og:description", content: "A magical birthday celebration for Prativa." },
    ],
  }),
  component: Index,
});

/* =====================================================================
   📸  MEDIA MANIFEST — paste your URLs here
   Drop your 20–25 photos/videos into these arrays. Everything below
   maps over them automatically. Use any public URL or import from
   /public  ("/my-photo.jpg") or src/assets.
   ===================================================================== */

const HERO_BG =
  "https://images.unsplash.com/photo-1517637382994-f02da38c6728?auto=format&fit=crop&w=1600&q=80";
// Optional: HERO_VIDEO = "/hero-loop.mp4"  — uncomment block in <Hero/> to use

// 🎬 VIDEOS for the cinematic filmstrip (any number)
const VIDEOS: { src: string; poster: string; label?: string }[] = [
  {
    src: "https://cdn.pixabay.com/video/2022/03/13/110624-687822405_large.mp4",
    poster: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    label: "Sunset smiles",
  },
  {
    src: "https://cdn.pixabay.com/video/2020/09/08/49375-457948416_large.mp4",
    poster: "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=800&q=80",
    label: "Golden hour",
  },
  {
    src: "https://cdn.pixabay.com/video/2019/10/14/27725-368903098_large.mp4",
    poster: "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=800&q=80",
    label: "Little adventures",
  },
  {
    src: "https://cdn.pixabay.com/video/2022/03/13/110624-687822405_large.mp4",
    poster: "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=800&q=80",
    label: "Laughing",
  },
];

// 🖼 PHOTOS for the masonry wall (10–15+ recommended)
const PHOTOS: string[] = [
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503516459261-40c66117780a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499915855317-7d4d9c4f1f5e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?auto=format&fit=crop&w=800&q=80",
];

// 🪄 POLAROIDS for the swipeable deck (3–5)
const POLAROIDS: { src: string; caption: string }[] = [
  { src: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&w=800&q=80", caption: "you & the sunshine" },
  { src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80", caption: "best laugh ever" },
  { src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80", caption: "city lights" },
  { src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80", caption: "cozy ☕" },
  { src: "https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?auto=format&fit=crop&w=800&q=80", caption: "wanderer" },
];

// 🎁 Reasons — tap to reveal
const REASONS = [
  { icon: Gift, color: "from-blush to-champagne", title: "Your incredible smile", body: "It lights up every single room you walk into." },
  { icon: Mail, color: "from-lavender to-blush", title: "Your kind heart", body: "The way you care for everyone around you is pure magic." },
  { icon: Heart, color: "from-champagne to-lavender", title: "Your wild spirit", body: "Always dreaming, always shining, always you." },
  { icon: Sparkles, color: "from-blush to-lavender", title: "The way you laugh", body: "It's the soundtrack of all my favorite memories." },
];

/* ===================================================================== */

function Index() {
  return (
    <main className="overflow-x-hidden bg-cream text-midnight">
      <Hero />
      <MomentsFilmstrip />
      <PhotoWall />
      <Reasons />
      <PolaroidDeck />
      <VideoHighlight />
      <Ending />
    </main>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        {/* Swap <img> for a <video> loop if you have one */}
        <img src={HERO_BG} alt="" className="h-[120%] w-full object-cover" loading="eager" />
        {/* <video src="/hero-loop.mp4" autoPlay muted loop playsInline className="h-[120%] w-full object-cover" /> */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-blush/20 to-cream" />
      </motion.div>

      {[...Array(20)].map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-champagne animate-twinkle"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 5) * 0.5}s`,
          }}
        />
      ))}

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="font-script text-2xl text-champagne sm:text-3xl"
        >
          A little something for
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
          className="mt-4 font-display text-5xl font-light leading-tight text-cream animate-glow sm:text-7xl md:text-8xl"
        >
          Happy Birthday,
          <br />
          <span className="font-script text-blush">Prativa</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.2 }}
          className="mt-6 max-w-md font-sans text-base text-cream/90 sm:text-lg"
        >
          Scroll gently — a whole journey of memories awaits you below ✨
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <ChevronDown className="h-8 w-8 text-cream animate-bounce-soft" />
      </motion.div>
    </section>
  );
}

/* ---------- MOMENTS · horizontal video filmstrip ---------- */
function MomentsFilmstrip() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="relative bg-gradient-to-b from-cream to-blush/20 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-display text-4xl font-light text-midnight sm:text-6xl"
        >
          Moments in <span className="font-script text-blush">Motion</span>
        </motion.h2>
        <p className="mt-3 font-sans text-sm text-midnight/70 sm:text-base">
          Swipe through the filmstrip — tap any frame to play.
        </p>
      </div>

      <div className="relative mt-12">
        {/* film perforations top/bottom */}
        <div className="pointer-events-none absolute inset-x-0 top-2 h-3 bg-[repeating-linear-gradient(90deg,oklch(0.22_0.08_280)_0_8px,transparent_8px_24px)] opacity-80" />
        <div className="pointer-events-none absolute inset-x-0 bottom-2 h-3 bg-[repeating-linear-gradient(90deg,oklch(0.22_0.08_280)_0_8px,transparent_8px_24px)] opacity-80" />

        <div className="bg-midnight py-6">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] sm:gap-6 sm:px-10 [&::-webkit-scrollbar]:hidden"
          >
            {VIDEOS.map((v, i) => (
              <FilmCell key={i} v={v} />
            ))}
          </div>
        </div>

        {/* arrows (hidden on touch) */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Previous"
          className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-cream/90 p-2 text-midnight shadow-lg backdrop-blur sm:block"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Next"
          className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-cream/90 p-2 text-midnight shadow-lg backdrop-blur sm:block"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function FilmCell({ v }: { v: (typeof VIDEOS)[number] }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => videoRef.current?.play());
  };

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="relative aspect-[3/4] w-[78vw] max-w-[320px] flex-none snap-center overflow-hidden rounded-xl border border-champagne/30 bg-black shadow-[0_20px_60px_-20px_oklch(0.22_0.08_280/0.6)] sm:w-[280px]"
    >
      {!playing ? (
        <>
          <img
            src={v.poster}
            alt={v.label ?? "video"}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/10 to-transparent" />
          <button
            onClick={play}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/90 shadow-xl ring-1 ring-champagne/40 transition-transform hover:scale-110">
              <Play className="ml-1 h-7 w-7 fill-midnight text-midnight" />
            </span>
          </button>
          {v.label && (
            <p className="absolute bottom-3 left-0 right-0 text-center font-script text-base text-cream">
              {v.label}
            </p>
          )}
        </>
      ) : (
        <video
          ref={videoRef}
          src={v.src}
          poster={v.poster}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      )}
    </motion.div>
  );
}

/* ---------- PHOTO WALL · masonry + lightbox ---------- */
function PhotoWall() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="relative bg-gradient-to-b from-blush/20 via-lavender/20 to-cream py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-display text-4xl font-light text-midnight sm:text-6xl"
        >
          The <span className="font-script text-blush">Photo Wall</span>
        </motion.h2>
        <p className="mt-3 font-sans text-sm text-midnight/70 sm:text-base">
          Tap any photo to expand. Swipe to wander through.
        </p>
      </div>

      {/* CSS columns = true masonry without JS */}
      <div className="mx-auto mt-12 max-w-5xl columns-2 gap-3 px-4 sm:columns-3 sm:gap-4 sm:px-6 md:columns-4">
        {PHOTOS.map((src, i) => (
          <motion.button
            key={i}
            onClick={() => setOpenIdx(i)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: (i % 6) * 0.08, ease: "easeOut" }}
            className="mb-3 block w-full overflow-hidden rounded-lg break-inside-avoid bg-white p-1 shadow-[0_6px_24px_-10px_oklch(0.22_0.08_280/0.4)] transition-transform hover:scale-[1.02] sm:mb-4 sm:p-1.5"
          >
            <img
              src={src}
              alt={`Memory ${i + 1}`}
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-md object-cover"
              style={{ aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "1/1" : "4/5" }}
            />
          </motion.button>
        ))}
      </div>

      <Lightbox
        photos={PHOTOS}
        openIdx={openIdx}
        onClose={() => setOpenIdx(null)}
      />
    </section>
  );
}

function Lightbox({
  photos,
  openIdx,
  onClose,
}: {
  photos: string[];
  openIdx: number | null;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (openIdx !== null) setIdx(openIdx);
  }, [openIdx]);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + photos.length) % photos.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIdx, photos.length, onClose]);

  const next = () => setIdx((i) => (i + 1) % photos.length);
  const prev = () => setIdx((i) => (i - 1 + photos.length) % photos.length);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80) next();
    else if (info.offset.x > 80) prev();
  };

  return (
    <AnimatePresence>
      {openIdx !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/95 backdrop-blur-md"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 rounded-full bg-cream/10 p-2 text-cream backdrop-blur-md transition-colors hover:bg-cream/20"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous"
            className="absolute left-3 z-10 hidden rounded-full bg-cream/10 p-3 text-cream backdrop-blur-md hover:bg-cream/20 sm:block"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next"
            className="absolute right-3 z-10 hidden rounded-full bg-cream/10 p-3 text-cream backdrop-blur-md hover:bg-cream/20 sm:block"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <AnimatePresence mode="wait">
            <motion.img
              key={idx}
              src={photos[idx]}
              alt={`Photo ${idx + 1}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={onDragEnd}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[92vw] cursor-grab rounded-lg object-contain shadow-2xl active:cursor-grabbing"
              draggable={false}
            />
          </AnimatePresence>

          <div className="absolute bottom-6 left-0 right-0 text-center font-sans text-xs text-cream/70">
            {idx + 1} / {photos.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- REASONS ---------- */
function Reasons() {
  const [opened, setOpened] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-blush/30 to-lavender/30 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-display text-4xl font-light text-midnight sm:text-6xl"
        >
          Reasons You're <span className="font-script text-blush">Amazing</span>
        </motion.h2>
        <p className="mt-4 font-sans text-base text-midnight/70 sm:text-lg">
          Tap a gift to unwrap a little truth about you 💌
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-6 px-6 sm:gap-8">
        {REASONS.map((r, i) => {
          const Icon = r.icon;
          const isOpen = opened === i;
          return (
            <motion.button
              key={i}
              onClick={() => setOpened(isOpen ? null : i)}
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -6 }}
              className="relative aspect-square overflow-hidden rounded-3xl"
              style={{ animation: `float 6s ease-in-out ${i * 0.5}s infinite` }}
            >
              <AnimatePresence mode="wait">
                {!isOpen ? (
                  <motion.div
                    key="closed"
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 1.5, rotateY: 90 }}
                    transition={{ duration: 0.5 }}
                    className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${r.color} p-4 shadow-[0_20px_60px_-20px_oklch(0.22_0.08_280/0.6)]`}
                  >
                    <Icon className="h-10 w-10 text-cream sm:h-12 sm:w-12" strokeWidth={1.5} />
                    <span className="mt-3 font-script text-lg text-cream sm:text-xl">Tap me</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                    className="flex h-full w-full flex-col items-center justify-center bg-cream p-4 text-center shadow-inner"
                  >
                    <p className="font-display text-lg font-medium text-midnight sm:text-xl">{r.title}</p>
                    <p className="mt-2 font-sans text-xs text-midnight/70 sm:text-sm">{r.body}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- POLAROID DECK · swipeable cards ---------- */
function PolaroidDeck() {
  const [order, setOrder] = useState(POLAROIDS.map((_, i) => i));
  const reduce = useReducedMotion();

  const swipe = (dir: 1 | -1) => {
    setOrder((prev) => {
      const next = [...prev];
      const top = next.shift();
      if (top !== undefined) next.push(top);
      return next;
    });
    void dir;
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-lavender/30 to-midnight py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-display text-4xl font-light text-cream sm:text-6xl"
        >
          A Few More <span className="font-script text-champagne">Smiles</span>
        </motion.h2>
        <p className="mt-3 font-sans text-sm text-cream/70 sm:text-base">
          Swipe the top polaroid to see the next one.
        </p>
      </div>

      <div className="relative mx-auto mt-14 h-[420px] w-[280px] sm:h-[480px] sm:w-[340px]">
        {order.map((idx, stackPos) => {
          const isTop = stackPos === 0;
          const offset = stackPos * 8;
          const rotate = (idx % 2 === 0 ? -1 : 1) * (stackPos + 1) * 2;
          return (
            <motion.div
              key={idx}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 120 || Math.abs(info.velocity.x) > 500) {
                  swipe(info.offset.x > 0 ? 1 : -1);
                }
              }}
              initial={false}
              animate={{
                y: offset,
                scale: 1 - stackPos * 0.04,
                rotate: reduce ? 0 : rotate,
                zIndex: POLAROIDS.length - stackPos,
              }}
              whileTap={isTop ? { scale: 0.98 } : undefined}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className={`absolute inset-0 select-none rounded-sm bg-white p-3 pb-14 shadow-[0_20px_60px_-15px_oklch(0_0_0/0.5)] ${
                isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
              }`}
              style={{ touchAction: isTop ? "pan-y" : "none" }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-sm bg-midnight/10">
                <img
                  src={POLAROIDS[idx].src}
                  alt={POLAROIDS[idx].caption}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="absolute bottom-3 left-0 right-0 text-center font-script text-xl text-midnight">
                {POLAROIDS[idx].caption}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => swipe(1)}
          className="rounded-full border border-champagne/40 bg-cream/10 px-5 py-2 font-sans text-sm text-cream backdrop-blur-md transition-colors hover:bg-cream/20"
        >
          Next polaroid →
        </button>
      </div>
    </section>
  );
}

/* ---------- VIDEO HIGHLIGHT ---------- */
function VideoHighlight() {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="relative overflow-hidden bg-midnight py-24 sm:py-32">
      {[...Array(40)].map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute h-[2px] w-[2px] rounded-full bg-champagne animate-twinkle"
          style={{
            left: `${(i * 71) % 100}%`,
            top: `${(i * 43) % 100}%`,
            animationDelay: `${(i % 7) * 0.4}s`,
          }}
        />
      ))}

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-display text-4xl font-light text-cream sm:text-6xl"
        >
          A Little <span className="font-script text-champagne">Montage</span>
        </motion.h2>
        <p className="mt-4 font-sans text-base text-cream/70 sm:text-lg">
          Press play. Get cozy. This one's just for you.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mx-auto mt-12 aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border border-champagne/30 shadow-[0_0_80px_-10px_oklch(0.86_0.09_85/0.4)]"
        >
          {!playing ? (
            <button onClick={() => setPlaying(true)} className="group relative block h-full w-full">
              {/* REPLACE poster + the <video> src below with your montage */}
              <img
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80"
                alt="Montage poster"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-midnight/40 transition-colors group-hover:bg-midnight/30">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream/90 shadow-2xl ring-1 ring-champagne/40 transition-transform group-hover:scale-110">
                  <Play className="ml-1 h-9 w-9 fill-midnight text-midnight" />
                </span>
              </div>
            </button>
          ) : (
            <video
              src="https://cdn.pixabay.com/video/2022/03/13/110624-687822405_large.mp4"
              autoPlay
              controls
              playsInline
              preload="metadata"
              className="h-full w-full bg-black object-cover"
            />
          )}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-champagne/20" />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- ENDING ---------- */
function Ending() {
  const fire = () => {
    const burst = (origin: { x: number; y: number }) =>
      confetti({
        particleCount: 80,
        spread: 90,
        startVelocity: 45,
        origin,
        colors: ["#f9c5d1", "#d4b8e8", "#e8c97a", "#fff7e6"],
        scalar: 1.1,
      });
    burst({ x: 0.2, y: 0.7 });
    burst({ x: 0.5, y: 0.6 });
    burst({ x: 0.8, y: 0.7 });
    setTimeout(() => burst({ x: 0.5, y: 0.4 }), 250);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-midnight via-lavender/40 to-blush/40 py-32 sm:py-40">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5 }}
          className="font-display text-3xl font-light leading-snug text-cream sm:text-5xl"
        >
          Wishing you a birthday
          <br />
          as <em className="font-script text-champagne">beautiful</em> as you are.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="mt-6 font-script text-2xl text-blush sm:text-3xl"
        >
          Keep shining, Prativa.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 1 }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={fire}
          className="group mt-12 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-cream/10 px-8 py-4 font-sans text-sm font-medium text-cream backdrop-blur-md transition-all hover:bg-cream/20 sm:text-base"
        >
          <Sparkles className="h-4 w-4 text-champagne transition-transform group-hover:rotate-12" />
          Tap for a little magic
        </motion.button>

        <p className="mt-20 font-script text-base text-cream/60">with love, always 🤍</p>
      </div>
    </section>
  );
}
