import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

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
   MEDIA ARRAY — The only section you need to edit.

   For each item:
     type    "image" | "video"
     src     URL to the photo or .mp4 video
     poster  (videos only) thumbnail URL shown before the video plays
     message The secret note revealed when Prativa taps the card
     span    1 = half-width column  |  2 = full-width row
     aspect  "portrait" (3:4)  |  "square" (1:1)  |  "landscape" (16:9)  |  "tall" (2:3)
═══════════════════════════════════════════════════════════════════════════ */

interface MediaItem {
  type: "image" | "video";
  src: string;
  poster?: string;
  message: string;
  span: 1 | 2;
  aspect: "portrait" | "square" | "landscape" | "tall";
}

const MEDIA: MediaItem[] = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80",
    message: "Your smile is the most beautiful thing I have ever seen.",
    span: 2,
    aspect: "landscape",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=600&q=80",
    message: "The way you laugh makes the whole world brighter.",
    span: 1,
    aspect: "portrait",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&w=600&q=80",
    message: "You are stronger than you know, and more loved than you imagine.",
    span: 1,
    aspect: "square",
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2022/03/13/110624-687822405_large.mp4",
    poster:
      "https://images.unsplash.com/photo-1503516459261-40c66117780a?auto=format&fit=crop&w=900&q=80",
    message: "Every moment with you feels like golden hour.",
    span: 2,
    aspect: "landscape",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    message: "You make ordinary moments feel absolutely magical.",
    span: 1,
    aspect: "portrait",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80",
    message: "Your kindness touches everyone you meet, effortlessly.",
    span: 1,
    aspect: "portrait",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
    message: "Here is to all the adventures still ahead of you.",
    span: 1,
    aspect: "tall",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=600&q=80",
    message: "Your dreams are valid. Every single one of them.",
    span: 1,
    aspect: "square",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1517637382994-f02da38c6728?auto=format&fit=crop&w=900&q=80",
    message: "Thank you for being exactly who you are.",
    span: 2,
    aspect: "landscape",
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2020/09/08/49375-457948416_large.mp4",
    poster:
      "https://images.unsplash.com/photo-1499915855317-7d4d9c4f1f5e?auto=format&fit=crop&w=600&q=80",
    message: "The world is a better, brighter place because you are in it.",
    span: 1,
    aspect: "portrait",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=600&q=80",
    message: "You deserve all the happiness in the universe.",
    span: 1,
    aspect: "square",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
    message: "Keep shining, Prativa. You are extraordinary.",
    span: 1,
    aspect: "portrait",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?auto=format&fit=crop&w=600&q=80",
    message: "Your spirit is something this world truly needs.",
    span: 1,
    aspect: "tall",
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2019/10/14/27725-368903098_large.mp4",
    poster:
      "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=900&q=80",
    message: "Your laughter is contagious, and I never want it to stop.",
    span: 2,
    aspect: "landscape",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    message: "Happy Birthday to the most incredible person I know.",
    span: 1,
    aspect: "square",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
    message: "You are the definition of grace and strength, beautifully combined.",
    span: 1,
    aspect: "portrait",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1509626549585-2dcdb7ca7c51?auto=format&fit=crop&w=600&q=80",
    message: "I am so grateful for every single memory we have shared.",
    span: 1,
    aspect: "portrait",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
    message: "May this year bring you everything your heart desires.",
    span: 1,
    aspect: "square",
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2020/08/01/46009-446818826_large.mp4",
    poster:
      "https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&w=900&q=80",
    message: "Here is to you — always, and forever. ✨",
    span: 2,
    aspect: "landscape",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1445991842772-097fea258e7b?auto=format&fit=crop&w=600&q=80",
    message: "Growing alongside you has been my greatest gift.",
    span: 1,
    aspect: "tall",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1503435824048-a799a3a84bf7?auto=format&fit=crop&w=600&q=80",
    message: "This moment, this memory — made just for you.",
    span: 1,
    aspect: "portrait",
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2022/03/13/110624-687822405_large.mp4",
    poster:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    message: "Wishing you endless joy, Prativa. Happy Birthday. 🤍",
    span: 2,
    aspect: "landscape",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MEDIA CARD
   - Front: photo or auto-playing video
   - Back: frosted glass message panel (revealed on tap)
   - Uses Intersection Observer for scroll-synced autoplay and lazy src loading
═══════════════════════════════════════════════════════════════════════════ */

const ASPECT_CLASS: Record<MediaItem["aspect"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-video",
  tall: "aspect-[2/3]",
};

function MediaCard({ item, index }: { item: MediaItem; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReduced = useReducedMotion();

  // Ref keeps the autoplay observer closure from going stale
  const isFlippedRef = useRef(false);
  isFlippedRef.current = isFlipped;

  // 1. Lazy src — populate src only once the card approaches the viewport
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

  // 2. Autoplay — play when ≥50% of the video is visible, pause otherwise
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

  // 3. Start playing once src is set and the card is already in view
  useEffect(() => {
    if (videoSrc && isVisible && !isFlippedRef.current) {
      videoRef.current?.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSrc]);

  // 4. Sync playback with flip state changes
  useEffect(() => {
    if (item.type !== "video") return;
    if (isFlipped) {
      videoRef.current?.pause();
    } else if (isVisible && videoSrc) {
      videoRef.current?.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipped]);

  const spanClass = item.span === 2 ? "col-span-2" : "col-span-1";
  const aspectClass = ASPECT_CLASS[item.aspect];

  return (
    <motion.div
      ref={cardRef}
      className={`${spanClass} ${aspectClass} cursor-pointer`}
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
        className="relative w-full h-full"
        style={
          {
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
          } as React.CSSProperties
        }
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
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
              className="w-full h-full object-cover"
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
              className="w-full h-full object-cover bg-midnight"
            />
          )}

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/50 via-transparent to-transparent pointer-events-none" />

          {/* Tap hint badge */}
          <div className="absolute bottom-2 right-2 pointer-events-none">
            <span className="inline-block rounded-full bg-midnight/65 backdrop-blur-sm px-2 py-0.5 font-sans text-[9px] tracking-widest text-cream/65">
              tap ✦
            </span>
          </div>
        </div>

        {/* ── BACK (message) ── */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2.5 px-4 py-5 text-center"
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
            for you ✦
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
   GALLERY — 2-column masonry grid with all 22 media cards
═══════════════════════════════════════════════════════════════════════════ */

function Gallery() {
  return (
    <section className="bg-midnight px-2.5 pb-16 pt-10 sm:px-4 sm:pt-14">
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
            tap any card to reveal a message 💌
          </p>
        </motion.div>

        {/* The grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {MEDIA.map((item, i) => (
            <MediaCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CLOSING — Glow final message
═══════════════════════════════════════════════════════════════════════════ */

function Closing() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-midnight via-midnight to-blush/10 px-6 py-32 sm:py-44">
      {/* Ambient radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.88 0.06 10 / 0.18) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Stars */}
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-champagne/60 animate-twinkle"
          style={{
            width: "2px",
            height: "2px",
            left: `${(i * 59) % 100}%`,
            top: `${(i * 41) % 100}%`,
            animationDelay: `${(i % 5) * 0.55}s`,
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
          className="mt-2 font-script text-5xl text-blush sm:text-6xl"
          style={{
            textShadow:
              "0 0 28px oklch(0.88 0.06 10 / 0.55), 0 0 56px oklch(0.88 0.06 10 / 0.28)",
          }}
        >
          Prativa.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3, duration: 1.5 }}
          className="mt-10 font-script text-base text-cream/38"
        >
          with all the love in the world ✨
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
      <Hero />
      <Gallery />
      <Closing />
    </main>
  );
}
