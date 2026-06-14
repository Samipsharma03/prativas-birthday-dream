/**
 * Moon — warm minimal edition
 * Soft ivory body with gentle peach halo. Quiet, not flashy.
 */

interface MoonProps {
  size?: number;
  className?: string;
  phase?: "full" | "crescent";
  glow?: string;
}

export function Moon({
  size = 180,
  className = "",
  phase = "full",
  glow = "rgba(244, 212, 193, 0.55)",
}: MoonProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }} aria-hidden>
      {/* Soft warm halo */}
      <div
        className="absolute inset-0 rounded-full moon-glow"
        style={{
          background: `radial-gradient(circle at 40% 40%, ${glow} 0%, transparent 65%)`,
          filter: "blur(10px)",
        }}
      />
      <svg viewBox="0 0 200 200" className="relative h-full w-full">
        <defs>
          <radialGradient id="moon-body" cx="38%" cy="36%" r="70%">
            <stop offset="0%" stopColor="#fffaf2" />
            <stop offset="55%" stopColor="#f5e3d0" />
            <stop offset="100%" stopColor="#d4b59a" />
          </radialGradient>
          <radialGradient id="moon-shade" cx="78%" cy="80%" r="60%">
            <stop offset="0%" stopColor="rgba(120,80,50,0)" />
            <stop offset="100%" stopColor="rgba(90,55,30,0.35)" />
          </radialGradient>
          <radialGradient id="crater" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(150,110,80,0)" />
            <stop offset="60%" stopColor="rgba(150,110,80,0.20)" />
            <stop offset="100%" stopColor="rgba(110,75,50,0.40)" />
          </radialGradient>
          <mask id="crescent-mask">
            <rect width="200" height="200" fill="white" />
            {phase === "crescent" && <circle cx="130" cy="95" r="80" fill="black" />}
          </mask>
        </defs>

        <g mask="url(#crescent-mask)">
          <circle cx="100" cy="100" r="80" fill="url(#moon-body)" />
          <circle cx="100" cy="100" r="80" fill="url(#moon-shade)" />
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
