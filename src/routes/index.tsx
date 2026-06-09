import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import confetti from "canvas-confetti";
import { ChevronDown, Gift, Mail, Heart, Sparkles, Play } from "lucide-react";

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

// =============================================================
//  REPLACE ALL `src="https://..."` PLACEHOLDERS WITH YOUR OWN
//  LOCAL ASSETS (drop them in /public or src/assets and import).
// =============================================================

const HERO_BG =
  "https://images.unsplash.com/photo-1517637382994-f02da38c6728?auto=format&fit=crop&w=1600&q=80"; // TODO: replace with your dreamy bg image/video

const MEMORIES = [
  { type: "image", src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80", label: "Image 1" },
  { type: "image", src: "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=800&q=80", label: "Image 2" },
  { type: "video", src: "https://images.unsplash.com/photo-1503516459261-40c66117780a?auto=format&fit=crop&w=800&q=80", label: "Video 1" },
  { type: "image", src: "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=800&q=80", label: "Image 3" },
  { type: "image", src: "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=800&q=80", label: "Image 4" },
  { type: "video", src: "https://images.unsplash.com/photo-1499915855317-7d4d9c4f1f5e?auto=format&fit=crop&w=800&q=80", label: "Video 2" },
];

const REASONS = [
  { icon: Gift, color: "from-blush to-champagne", title: "Your incredible smile", body: "It lights up every single room you walk into." },
  { icon: Mail, color: "from-lavender to-blush", title: "Your kind heart", body: "The way you care for everyone around you is pure magic." },
  { icon: Heart, color: "from-champagne to-lavender", title: "Your wild spirit", body: "Always dreaming, always shining, always you." },
  { icon: Sparkles, color: "from-blush to-lavender", title: "The way you laugh", body: "It's the soundtrack of all my favorite memories." },
];

function Index() {
  return (
    <main className="overflow-x-hidden bg-cream text-midnight">
      <Hero />
      <MemoryLane />
      <Reasons />
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
      {/* Parallax background — REPLACE src with your own image OR swap <img> for a <video> loop */}
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <img src={HERO_BG} alt="" className="h-[120%] w-full object-cover" />
        {/* <video src="/your-loop.mp4" autoPlay muted loop playsInline className="h-[120%] w-full object-cover" /> */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-blush/20 to-cream" />
      </motion.div>

      {/* Floating sparkles */}
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

/* ---------- MEMORY LANE ---------- */
function MemoryLane() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const reduce = useReducedMotion();

  return (
    <section ref={ref} className="relative bg-gradient-to-b from-cream via-blush/20 to-lavender/30 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-display text-4xl font-light text-midnight sm:text-6xl"
        >
          Memory <span className="font-script text-blush">Lane</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-4 font-sans text-base text-midnight/70 sm:text-lg"
        >
          A few frozen moments that make the world a little brighter.
        </motion.p>
      </div>

      {/* Staggered parallax masonry — different speeds for depth */}
      <div className="relative mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 px-4 sm:gap-6 sm:px-6 md:grid-cols-3">
        {MEMORIES.map((m, i) => {
          const speed = (i % 3) - 1; // -1, 0, 1
          const range = reduce ? 0 : 60 + Math.abs(speed) * 40;
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const y = useTransform(scrollYProgress, [0, 1], [range * speed, -range * speed]);
          const isTall = i % 3 === 1;
          return (
            <motion.div
              key={i}
              style={{ y }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
              whileHover={{ scale: 1.03, rotate: i % 2 ? 1 : -1 }}
              className={`group relative rounded-sm bg-white p-2 pb-10 shadow-[0_10px_40px_-15px_oklch(0.22_0.08_280/0.4)] sm:p-3 sm:pb-12 ${
                isTall ? "row-span-2" : ""
              }`}
            >
              {/* REPLACE src with your own photo/video poster */}
              <div className={`relative overflow-hidden rounded-sm ${isTall ? "aspect-[3/4]" : "aspect-square"}`}>
                <img
                  src={m.src}
                  alt={m.label}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {m.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-midnight/30">
                    <div className="rounded-full bg-cream/90 p-3 shadow-lg">
                      <Play className="h-5 w-5 fill-midnight text-midnight" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blush/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="absolute bottom-2 left-0 right-0 text-center font-script text-sm text-midnight/70 sm:text-base">
                {m.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- REASONS ---------- */
function Reasons() {
  const [opened, setOpened] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-lavender/30 via-blush/30 to-midnight py-24 sm:py-32">
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
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-4 font-sans text-base text-midnight/70 sm:text-lg"
        >
          Tap a gift to unwrap a little truth about you 💌
        </motion.p>
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
                    <p className="font-display text-lg font-medium text-midnight sm:text-xl">
                      {r.title}
                    </p>
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

/* ---------- VIDEO HIGHLIGHT ---------- */
function VideoHighlight() {
  return (
    <section className="relative overflow-hidden bg-midnight py-24 sm:py-32">
      {/* Twinkling stars */}
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
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-4 font-sans text-base text-cream/70 sm:text-lg"
        >
          Press play. Get cozy. This one's just for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mx-auto mt-12 aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border border-champagne/30 shadow-[0_0_80px_-10px_oklch(0.86_0.09_85/0.4)]"
        >
          {/* REPLACE src below with your montage video file */}
          <video
            src="https://cdn.pixabay.com/video/2022/03/13/110624-687822405_large.mp4"
            poster="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80"
            controls
            playsInline
            className="h-full w-full bg-black object-cover"
          />
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
