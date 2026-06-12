/**
 * Moon
 * ----
 * A detailed crescent/full moon SVG with craters and a soft pink-gold halo.
 * Designed for Prativa, the selenophile 🌙
 */

interface MoonProps {
  size?: number;
  className?: string;
  /** "full" or "crescent" */
  phase?: "full" | "crescent";
  /** Glow color (any CSS color). Defaults to soft pink. */
  glow?: string;
}

export function Moon({ size = 180, className = "", phase = "full", glow = "oklch(0.85 0.10 350)" }: MoonProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }} aria-hidden>
      {/* Outer halo */}
      <div
        className="absolute inset-0 rounded-full moon-glow"
        style={{
          background: `radial-gradient(circle at 40% 40%, ${glow} 0%, transparent 65%)`,
          filter: "blur(8px)",
        }}
      />
      <svg viewBox="0 0 200 200" className="relative h-full w-full">
        <defs>
          <radialGradient id="moon-body" cx="38%" cy="36%" r="70%">
            <stop offset="0%" stopColor="#fff5f9" />
            <stop offset="55%" stopColor="#f8dfe9" />
            <stop offset="100%" stopColor="#c89aae" />
          </radialGradient>
          <radialGradient id="moon-shade" cx="78%" cy="80%" r="60%">
            <stop offset="0%" stopColor="rgba(60,20,50,0)" />
            <stop offset="100%" stopColor="rgba(40,10,40,0.55)" />
          </radialGradient>
          <radialGradient id="crater" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(120,70,100,0.0)" />
            <stop offset="60%" stopColor="rgba(120,70,100,0.25)" />
            <stop offset="100%" stopColor="rgba(80,40,70,0.55)" />
          </radialGradient>
          <mask id="crescent-mask">
            <rect width="200" height="200" fill="white" />
            {phase === "crescent" && (
              <circle cx="130" cy="95" r="80" fill="black" />
            )}
          </mask>
        </defs>

        <g mask="url(#crescent-mask)">
          <circle cx="100" cy="100" r="80" fill="url(#moon-body)" />
          <circle cx="100" cy="100" r="80" fill="url(#moon-shade)" />
          {/* Craters */}
          <circle cx="78" cy="78" r="10" fill="url(#crater)" />
          <circle cx="120" cy="70" r="6" fill="url(#crater)" />
          <circle cx="70" cy="120" r="8" fill="url(#crater)" />
          <circle cx="130" cy="130" r="12" fill="url(#crater)" />
          <circle cx="105" cy="100" r="4" fill="url(#crater)" />
          <circle cx="92" cy="145" r="5" fill="url(#crater)" />
          <circle cx="148" cy="105" r="4" fill="url(#crater)" />
        </g>
      </svg>
    </div>
  );
}

export default Moon;
