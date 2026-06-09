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
   MEDIA ARRAY

   type    "image" | "video"
   src     URL to the photo or .mp4
   poster  (videos) thumbnail before play
   message Secret note revealed on tap
   wide    true = full-width card, false = half-width
═══════════════════════════════════════════════════════════════════════════ */

interface MediaItem {
  type: "image" | "video";
  src: string;
  poster?: string;
  message: string;
  wide: boolean;
}

const MEDIA: MediaItem[] = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80",
    message: "Your smile is the most beautiful thing I have ever seen.",
    wide: true,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=600&q=80",
    message: "The way you laugh makes the whole world brighter.",
    wide: false,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&w=600&q=80",
    message: "You are stronger than you know, and more loved than you imagine.",
    wide: false,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    message: "You make ordinary moments feel absolutely magical.",
    wide: false,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80",
    message: "Your kindness touches everyone you meet, effortlessly.",
    wide: false,
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2022/03/13/110624-687822405_large.mp4",
    poster:
      "https://images.unsplash.com/photo-1503516459261-40c66117780a?auto=format&fit=crop&w=900&q=80",
    message: "Every moment with you feels like golden hour.",
    wide: true,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
    message: "Here is to all the adventures still ahead of you.",
    wide: false,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=600&q=80",
    message: "Your dreams are valid. Every single one of them.",
    wide: false,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1517637382994-f02da38c6728?auto=format&fit=crop&w=900&q=80",
    message: "Thank you for being exactly who you are.",
    wide: true,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=600&q=80",
    message: "You deserve all the happiness in the universe.",
    wide: false,
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2020/09/08/49375-457948416_large.mp4",
    poster:
      "https://images.unsplash.com/photo-1499915855317-7d4d9c4f1f5e?auto=format&fit=crop&w=600&q=80",
    message: "The world is a better, brighter place because you are in it.",
    wide: false,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
    message: "Keep shining, Prativa. You are extraordinary.",
    wide: false,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?auto=format&fit=crop&w=600&q=80",
    message: "Your spirit is something this world truly needs.",
    wide: false,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
    message: "Happy Birthday to the most incredible person I know.",
    wide: false,
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2019/10/14/27725-368903098_large.mp4",
    poster:
      "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=900&q=80",
    message: "Your laughter is contagious, and I never want it to stop.",
    wide: true,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
    message: "You are the definition of grace and strength, beautifully combined.",
    wide: false,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1509626549585-2dcdb7ca7c51?auto=format&fit=crop&w=600&q=80",
    message: "I am so grateful for every single memory we have shared.",
    wide: false,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
    message: "May this year bring you everything your heart desires.",
    wide: false,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1445991842772-097fea258e7b?auto=format&fit=crop&w=600&q=80",
    message: "Growing alongside you has been my greatest gift.",
    wide: false,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1503435824048-a799a3a84bf7?auto=format&fit=crop&w=600&q=80",
    message: "This moment, this memory — made just for you.",
    wide: false,
  },
  {
    type: "video",
    src: "https://cdn.pixabay.com/video/2020/08/01/46009-446818826_large.mp4",
    poster:
      "https://images.unsplash.com/photo-1492288991661-058aa541ff43?auto=format&fit=crop&w=900&q=80",
    message: "Here is to you — always, and forever. ✨",
    wide: true,
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    message: "Wishing you endless joy, Prativa. Happy Birthday. 🤍",
    wide: false,
  },
];

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const finalVideoSrc =
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
  }, []);

  // Autoplay when visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
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
    return () => obs.disconnect();
  }, []);

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
          <video
            ref={videoRef}
            src={videoSrc ?? undefined}
            poster={finalPoster}
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-auto object-cover bg-midnight"
          />

          {/* Soft vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-midnight/20 pointer-events-none" />
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
      <Hero />
      <Gallery />
      <FinalVideo />
      <Closing />
    </main>
  );
}
