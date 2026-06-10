import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TREE_GROW_DURATION = 4.2;
const REQUIRED_BLOOM_MS = 4500;
const POST_BLOOM_HOLD_MS = 900;
const FINALE_PAUSE_MS = 1000;
const HEARTS_PER_BURST = 3;
const MAX_HEARTS = 90;

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: "rose" | "crimson" | "gold";
  rot: number;
  drift: number;
  delay: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  ring: number;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;
  driftX: number;
  pulse: number;
  hue: number;
  trail: number;
  kind: "firefly" | "stardust";
}

interface GrowingTreeProps {
  onComplete: () => void;
}

const MILESTONES = [
  { text: "Every beautiful thing starts from a tiny, quiet seed..." },
  { text: "Fed by laughter, shared secrets, and unforgettable days..." },
  { text: "Growing stronger and more radiant with every passing sunset..." },
  { text: "Blossoming into a love that is entirely, beautifully ours." },
];

function getMilestoneIndex(progress: number): number {
  const pct = progress * 100;
  if (pct <= 30) return 0;
  if (pct <= 60) return 1;
  if (pct <= 90) return 2;
  return 3;
}

export function GrowingTree({ onComplete }: GrowingTreeProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [bloomProgress, setBloomProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [subtitleKey, setSubtitleKey] = useState(0);
  const [finalePulse, setFinalePulse] = useState(false);
  const [showVortex, setShowVortex] = useState(false);
  const [showHandHint, setShowHandHint] = useState(true);

  const heartIdRef = useRef(0);
  const rippleIdRef = useRef(0);
  const firstInteractionAtRef = useRef<number | null>(null);
  const completeFiredRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const milestoneRef = useRef(0);

  // -------- Tree growth animation (0 → 100%) ------------------------
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (TREE_GROW_DURATION * 1000));
      setBloomProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const currentSubtitle = MILESTONES[getMilestoneIndex(bloomProgress)].text;
  const progressPct = Math.round(bloomProgress * 100);

  useEffect(() => {
    const next = getMilestoneIndex(bloomProgress);
    if (next !== milestoneRef.current) {
      milestoneRef.current = next;
      setSubtitleKey((k) => k + 1);
    }
  }, [bloomProgress]);

  // -------- Spawn hearts (staggered spring bloom) -----------------
  const bloom = useCallback(
    (xPct: number, yPct: number) => {
      if (showVortex) return;

      if (firstInteractionAtRef.current === null) {
        firstInteractionAtRef.current = performance.now();
        setShowHandHint(false);
      }

      setHearts((prev) => {
        const next = [...prev];
        for (let i = 0; i < HEARTS_PER_BURST; i++) {
          if (next.length >= MAX_HEARTS) break;
          const id = ++heartIdRef.current;
          const rand = Math.random();
          let hue: Heart["hue"] = "crimson";
          if (rand < 0.4) hue = "crimson";
          else if (rand < 0.75) hue = "rose";
          else hue = "gold";

          next.push({
            id,
            x: clamp(xPct + (Math.random() - 0.5) * 6, 2, 98),
            y: clamp(yPct + (Math.random() - 0.5) * 6, 2, 98),
            size: 14 + Math.random() * 24,
            hue,
            rot: (Math.random() - 0.5) * 80,
            drift: (Math.random() - 0.5) * 55,
            delay: i * 0.08,
          });
        }
        return next;
      });
    },
    [showVortex],
  );

  // -------- Multi-ring ripple shockwave ----------------------------
  const addRipple = useCallback((xPct: number, yPct: number) => {
    const base = rippleIdRef.current;
    const batch: Ripple[] = [0, 1, 2].map((ring) => ({
      id: base + ring,
      x: xPct,
      y: yPct,
      ring,
    }));
    rippleIdRef.current += 3;
    setRipples((prev) => [...prev, ...batch]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => !batch.some((b) => b.id === r.id)));
    }, 900);
  }, []);

  const pointerToPct = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsHolding(true);
      const pos = pointerToPct(e.clientX, e.clientY);
      if (!pos) return;
      addRipple(pos.x, pos.y);
      bloom(pos.x, pos.y);
    },
    [bloom, addRipple, pointerToPct],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isHolding || showVortex) return;
      const pos = pointerToPct(e.clientX, e.clientY);
      if (!pos) return;
      if (Math.random() < 0.32) {
        addRipple(pos.x, pos.y);
        bloom(pos.x, pos.y);
      }
    },
    [bloom, addRipple, isHolding, pointerToPct, showVortex],
  );

  const handlePointerUp = useCallback(() => setIsHolding(false), []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const pos = pointerToPct(e.clientX, e.clientY);
      if (!pos) return;
      addRipple(pos.x, pos.y);
      bloom(pos.x, pos.y);
    },
    [bloom, addRipple, pointerToPct],
  );

  // -------- Cinematic finale → vortex → video -----------------------
  useEffect(() => {
    if (completeFiredRef.current) return;
    if (bloomProgress < 1) return;
    if (firstInteractionAtRef.current === null) return;

    const elapsed = performance.now() - firstInteractionAtRef.current;
    const wait = Math.max(0, REQUIRED_BLOOM_MS - elapsed) + POST_BLOOM_HOLD_MS;

    const timers: number[] = [];

    timers.push(
      window.setTimeout(() => {
        if (completeFiredRef.current) return;
        setFinalePulse(true);
        setShowVortex(true);

        timers.push(
          window.setTimeout(() => {
            if (completeFiredRef.current) return;
            completeFiredRef.current = true;
            onComplete();
          }, FINALE_PAUSE_MS),
        );
      }, wait),
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [bloomProgress, onComplete]);

  // -------- Ambient golden fireflies + stardust canvas --------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: 160 }, (_, i) => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: i % 5 === 0 ? 2 + Math.random() * 2.5 : 0.8 + Math.random() * 1.8,
        speed: 0.08 + Math.random() * 0.45,
        alpha: 0.2 + Math.random() * 0.5,
        driftX: (Math.random() - 0.5) * 0.35,
        pulse: Math.random() * 0.02 + 0.004,
        hue: 38 + Math.random() * 28,
        trail: Math.random() * 18 + 8,
        kind: i % 4 === 0 ? "firefly" : "stardust",
      }));
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const now = Date.now();

      for (const p of particles) {
        const flicker = 0.65 + Math.sin(now * p.pulse + p.x) * 0.35;
        const a = p.alpha * flicker;

        if (p.kind === "firefly") {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 6);
          grad.addColorStop(0, `hsla(${p.hue}, 90%, 72%, ${a})`);
          grad.addColorStop(0.4, `hsla(${p.hue}, 85%, 65%, ${a * 0.35})`);
          grad.addColorStop(1, `hsla(${p.hue}, 80%, 60%, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 6, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.moveTo(p.x, p.y + p.trail * 0.15);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${p.hue}, 80%, 75%, ${a * 0.25})`;
        ctx.lineWidth = p.radius * 0.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 88%, 72%, ${a})`;
        ctx.fill();

        p.y -= p.speed;
        p.x += p.driftX + Math.sin(now * 0.001 + p.y * 0.01) * 0.08;
        if (p.y < -20) p.y = window.innerHeight + 20;
        if (p.x < -20) p.x = window.innerWidth + 20;
        if (p.x > window.innerWidth + 20) p.x = -20;
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const branchTips = useMemo(
    () => [
      { x: 35, y: 52 },
      { x: 28, y: 38 },
      { x: 22, y: 26 },
      { x: 65, y: 52 },
      { x: 72, y: 38 },
      { x: 78, y: 26 },
      { x: 50, y: 22 },
      { x: 42, y: 14 },
      { x: 58, y: 14 },
    ],
    [],
  );

  const floatingPetals = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: (i * 41) % 100,
        delay: (i % 6) * 0.7,
        duration: 9 + (i % 5) * 2,
        size: 6 + (i % 4) * 2,
        rot: (i * 37) % 360,
      })),
    [],
  );

  return (
    <motion.div
      ref={containerRef}
      role="presentation"
      className="fixed inset-0 z-50 cursor-pointer overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% 20%, oklch(0.28 0.12 285) 0%, oklch(0.14 0.09 282) 40%, oklch(0.06 0.05 278) 100%)",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={
        showVortex
          ? {
              opacity: [1, 1, 0],
              scale: [1, 1.02, 0.35],
              rotate: [0, 2, -8],
              filter: [
                "brightness(1) saturate(1)",
                "brightness(1.4) saturate(1.3)",
                "brightness(2.2) saturate(1.6)",
              ],
            }
          : { opacity: 1, scale: 1, rotate: 0, filter: "brightness(1) saturate(1)" }
      }
      exit={{
        opacity: 0,
        scale: 0.4,
        rotate: -12,
        filter: "brightness(2.5) saturate(1.8) blur(8px)",
        transition: { duration: 1.1, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={
        showVortex
          ? { duration: 1.1, ease: [0.45, 0, 0.15, 1] }
          : { duration: 1.2, ease: [0.4, 0, 0.2, 1] }
      }
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />

      {/* Aurora veils */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="tree-aurora-layer absolute -left-1/4 top-0 h-[70%] w-[80%] rounded-full opacity-50"
          style={{
            background: "radial-gradient(ellipse, oklch(0.55 0.14 300 / 0.35) 0%, transparent 70%)",
            filter: "blur(48px)",
          }}
        />
        <div
          className="tree-aurora-layer absolute -right-1/4 top-[10%] h-[60%] w-[75%] rounded-full opacity-40"
          style={{
            background: "radial-gradient(ellipse, oklch(0.62 0.12 25 / 0.3) 0%, transparent 68%)",
            filter: "blur(52px)",
            animationDelay: "-6s",
          }}
        />
        <div
          className="tree-aurora-layer absolute left-1/4 top-[30%] h-[50%] w-[60%] rounded-full opacity-35"
          style={{
            background: "radial-gradient(ellipse, oklch(0.75 0.1 85 / 0.22) 0%, transparent 65%)",
            filter: "blur(40px)",
            animationDelay: "-12s",
          }}
        />
      </div>

      <Stars count={80} />

      {/* Moonlight rays */}
      <div
        className="pointer-events-none absolute right-[8%] top-[4%] h-[55%] w-[40%]"
        style={{
          background:
            "conic-gradient(from 200deg at 80% 10%, oklch(0.92 0.05 85 / 0.12) 0deg, transparent 55deg, oklch(0.9 0.04 85 / 0.06) 90deg, transparent 140deg)",
          filter: "blur(24px)",
        }}
        aria-hidden
      />

      {/* Ground glow + roots mist */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, oklch(0.88 0.08 15 / 0.32) 0%, oklch(0.55 0.1 285 / 0.12) 45%, transparent 72%)",
          filter: "blur(36px)",
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, oklch(0 0 0 / 0.22) 100%)",
        }}
        aria-hidden
      />

      {/* Floating cherry petals */}
      {floatingPetals.map((p) => (
        <motion.span
          key={p.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: "-5%",
            width: p.size,
            height: p.size * 0.7,
            background: "oklch(0.86 0.1 8 / 0.55)",
            boxShadow: "0 0 8px oklch(0.88 0.08 10 / 0.4)",
            rotate: p.rot,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, (p.id % 2 === 0 ? 1 : -1) * 40],
            opacity: [0, 0.7, 0.5, 0],
            rotate: [p.rot, p.rot + 180],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          aria-hidden
        />
      ))}

      {/* Enchanted tree SVG */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMax meet"
        className="absolute inset-0 h-full w-full drop-shadow-[0_0_60px_oklch(0.55_0.12_285_/_0.35)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="bark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.58 0.05 55)" />
            <stop offset="50%" stopColor="oklch(0.42 0.04 58)" />
            <stop offset="100%" stopColor="oklch(0.22 0.03 60)" />
          </linearGradient>
          <linearGradient id="barkGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.75 0.08 55 / 0.5)" />
            <stop offset="100%" stopColor="oklch(0.45 0.06 60 / 0)" />
          </linearGradient>
          <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="oklch(0.98 0.05 85 / 0.85)" />
            <stop offset="55%" stopColor="oklch(0.92 0.06 85 / 0.25)" />
            <stop offset="100%" stopColor="oklch(0.96 0.04 85 / 0)" />
          </radialGradient>
          <radialGradient id="canopyGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="oklch(0.82 0.12 8 / 0.55)" />
            <stop offset="100%" stopColor="oklch(0.72 0.1 8 / 0)" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Heartbeat moon */}
        <g className="tree-moon-pulse">
          <circle cx="78" cy="22" r="22" fill="url(#moonGlow)" />
          <circle cx="78" cy="22" r="5.5" fill="oklch(0.98 0.04 85)" />
          <circle
            cx="78"
            cy="22"
            r="30"
            fill="none"
            stroke="oklch(0.96 0.04 85 / 0.2)"
            strokeWidth="0.8"
          />
        </g>

        {/* Tree aura */}
        <motion.ellipse
          cx="50"
          cy="48"
          rx={18 + bloomProgress * 14}
          ry={12 + bloomProgress * 18}
          fill="url(#canopyGlow)"
          animate={{ opacity: [0.25, 0.45 + bloomProgress * 0.3, 0.25] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />

        {/* Roots */}
        {[
          "M 50 100 Q 42 94 36 98",
          "M 50 100 Q 58 94 64 98",
          "M 50 100 Q 46 96 44 99",
          "M 50 100 Q 54 96 56 99",
        ].map((d, i) => (
          <motion.path
            key={`root-${i}`}
            d={d}
            stroke="oklch(0.35 0.03 60 / 0.7)"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: Math.min(1, bloomProgress * 2.5),
              opacity: bloomProgress * 0.8,
            }}
            transition={{ duration: 0.15 }}
          />
        ))}

        {/* Trunk glow layer */}
        <motion.path
          d="M 50 100 Q 49 80 50 62"
          stroke="url(#barkGlow)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: bloomProgress }}
          transition={{ duration: 0.1 }}
          filter="url(#softGlow)"
        />

        {/* Trunk */}
        <motion.path
          d="M 50 100 Q 49 80 50 62"
          stroke="url(#bark)"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: bloomProgress }}
          transition={{ duration: 0.1 }}
        />

        {/* Branches + blossom clusters */}
        {branchTips.map((tip, i) => {
          const start = 0.32 + (i / branchTips.length) * 0.58;
          const local = Math.max(0, Math.min(1, (bloomProgress - start) / 0.22));
          const cpx = midpointX(50, tip.x, tip.y);
          const cpy = midpointY(62, tip.x, tip.y);
          return (
            <g key={i}>
              <motion.path
                d={`M 50 62 Q ${cpx} ${cpy} ${tip.x} ${tip.y}`}
                stroke="url(#barkGlow)"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: local }}
                transition={{ duration: 0.1 }}
                filter="url(#softGlow)"
              />
              <motion.path
                d={`M 50 62 Q ${cpx} ${cpy} ${tip.x} ${tip.y}`}
                stroke="url(#bark)"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: local }}
                transition={{ duration: 0.1 }}
              />
              <motion.circle
                cx={tip.x}
                cy={tip.y}
                r={2.2 + local * 1.8}
                fill="oklch(0.82 0.14 8 / 0.85)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: local,
                  opacity: local * 0.9,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                style={{ transformOrigin: `${tip.x}px ${tip.y}px` }}
              />
              <motion.circle
                cx={tip.x}
                cy={tip.y}
                r={4 + local * 3}
                fill="none"
                stroke="oklch(0.88 0.1 10 / 0.35)"
                strokeWidth="0.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [local, local * 1.3, local],
                  opacity: [0, local * 0.6, 0],
                }}
                transition={{ repeat: Infinity, duration: 2.5 + i * 0.2 }}
              />
            </g>
          );
        })}
      </svg>

      {/* Progress ring */}
      <div className="pointer-events-none absolute bottom-[22%] left-1/2 -translate-x-1/2">
        <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden>
          <circle
            cx="36"
            cy="36"
            r="30"
            fill="none"
            stroke="oklch(0.86 0.09 85 / 0.12)"
            strokeWidth="2"
          />
          <motion.circle
            cx="36"
            cy="36"
            r="30"
            fill="none"
            stroke="oklch(0.86 0.12 85 / 0.55)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 30}
            initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 30 * (1 - bloomProgress),
            }}
            transition={{ duration: 0.15 }}
            transform="rotate(-90 36 36)"
            style={{
              filter: "drop-shadow(0 0 8px oklch(0.86 0.1 85 / 0.5))",
            }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-sans text-[9px] tracking-[0.2em] text-champagne/70">
          {progressPct}%
        </span>
      </div>

      {/* Touch ripples */}
      <AnimatePresence>
        {ripples.map((r) => {
          const delay = r.ring * 0.12;
          const maxScale = r.ring === 0 ? 18 : r.ring === 1 ? 14 : 10;
          return (
            <motion.div
              key={r.id}
              initial={{ scale: 0, opacity: 0.85 }}
              animate={{ scale: maxScale, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, delay, ease: "easeOut" }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${r.x}%`,
                top: `${r.y}%`,
                width: 20,
                height: 20,
                background:
                  "radial-gradient(circle, oklch(0.9 0.12 85 / 0.45) 0%, transparent 68%)",
                border: `1.5px solid oklch(0.92 0.1 85 / ${0.45 - delay})`,
                boxShadow: "0 0 24px oklch(0.88 0.12 85 / 0.35)",
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Magical heart blooms */}
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={
              finalePulse
                ? {
                    opacity: [0.6, 1, 1, 1, 0.4],
                    scale: [0.8, 1.1, 1.45, 1.7, 1.2],
                    y: [0, -12 - h.drift, -28 - h.drift, -48 - h.drift, -70 - h.drift],
                  }
                : {
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.15, 1.05, 1],
                    y: [0, -10 - h.drift, -20 - h.drift, -32 - h.drift],
                  }
            }
            exit={{ opacity: 0, scale: 0, y: -80 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 16,
              delay: h.delay,
              duration: finalePulse ? 1 : 2.6,
            }}
            onAnimationComplete={() => {
              if (!finalePulse) {
                setHearts((prev) => prev.filter((p) => p.id !== h.id));
              }
            }}
            className="pointer-events-none absolute"
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              width: h.size,
              height: h.size,
              transform: `translate(-50%, -50%) rotate(${h.rot}deg)`,
              filter: heartGlow(h.hue, finalePulse),
            }}
          >
            <HeartShape color={h.hue} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Vortex finale overlay */}
      <AnimatePresence>
        {showVortex && (
          <motion.div
            key="vortex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <div
              className="tree-vortex-ring absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, oklch(0.9 0.1 85 / 0.35) 40deg, transparent 80deg, oklch(0.78 0.18 18 / 0.3) 140deg, transparent 200deg, oklch(0.82 0.12 300 / 0.25) 280deg, transparent 360deg)",
                filter: "blur(2px)",
              }}
            />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 2.5, opacity: [0, 0.7, 0] }}
              transition={{ duration: 1, ease: "easeIn" }}
              className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.95 0.08 85 / 0.9) 0%, oklch(0.78 0.15 18 / 0.4) 40%, transparent 70%)",
                boxShadow: "0 0 120px oklch(0.9 0.12 85 / 0.6)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hand hint */}
      <AnimatePresence>
        {showHandHint && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute left-1/2 top-[14%] -translate-x-1/2"
          >
            <div className="flex items-center gap-2.5 rounded-full border border-champagne/30 bg-midnight/60 px-5 py-3 shadow-[0_0_30px_oklch(0.86_0.09_85_/_0.15)] backdrop-blur-md">
              <motion.span
                animate={{ y: [0, 7, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-lg"
              >
                ✨
              </motion.span>
              <span className="font-sans text-[10px] tracking-[0.28em] text-champagne/85 uppercase">
                hold or tap to bloom
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="pointer-events-none absolute inset-x-0 top-[7%] text-center font-display text-2xl tracking-[0.15em] text-champagne/80 sm:text-3xl"
        style={{
          textShadow: "0 0 30px oklch(0.86 0.09 85 / 0.4)",
        }}
      >
        Our Enchanted Tree
      </motion.h2>

      {/* Milestone subtitle cross-fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={subtitleKey}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="pointer-events-none absolute inset-x-0 bottom-10 px-6 text-center sm:bottom-14"
        >
          <p className="mx-auto max-w-lg animate-glow font-script text-2xl leading-snug text-champagne/92 sm:text-3xl">
            {currentSubtitle}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function heartGlow(hue: Heart["hue"], bright: boolean): string {
  const intensity = bright ? 1.4 : 1;
  if (hue === "crimson") return `drop-shadow(0 0 ${14 * intensity}px oklch(0.62 0.26 18 / 0.95))`;
  if (hue === "rose") return `drop-shadow(0 0 ${12 * intensity}px oklch(0.78 0.16 8 / 0.9))`;
  return `drop-shadow(0 0 ${16 * intensity}px oklch(0.88 0.14 85 / 0.95))`;
}

function Stars({ count }: { count: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: (i * 47) % 100,
        top: (i * 31) % 72,
        size: 0.7 + ((i * 13) % 24) / 10,
        delay: (i % 9) * 0.4,
        brightness: 0.35 + (i % 4) * 0.22,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-champagne/90"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            boxShadow: `0 0 ${s.size * 3}px oklch(0.86 0.09 85 / ${s.brightness})`,
          }}
          animate={{
            opacity: [0.15, 0.95, 0.15],
            scale: [0.7, 1.3, 0.7],
          }}
          transition={{
            duration: 2.8 + (s.id % 3),
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function HeartShape({ color }: { color: Heart["hue"] }) {
  let fill = "oklch(0.62 0.26 18)";
  if (color === "rose") fill = "oklch(0.78 0.16 8)";
  if (color === "gold") fill = "oklch(0.88 0.14 85)";

  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden>
      <path
        d="M12 21s-7-4.5-9.5-9.5C1 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6 4 4.5 7.5C19 16.5 12 21 12 21z"
        fill={fill}
      />
    </svg>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function midpointX(trunkX: number, tipX: number, _tipY: number) {
  return (trunkX + tipX) / 2 + (tipX > trunkX ? 6 : -6);
}

function midpointY(trunkY: number, _tipX: number, tipY: number) {
  return (trunkY + tipY) / 2 - 6;
}

export default GrowingTree;
