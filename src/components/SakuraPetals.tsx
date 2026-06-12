/**
 * SakuraPetals
 * ------------
 * Pure-CSS falling cherry-blossom petals. No images, no JS animation,
 * everything is preloaded with the stylesheet so nothing pops in.
 *
 * Layered fixed/absolute petals drift with slight horizontal sway.
 * Respects `prefers-reduced-motion`.
 */

interface SakuraPetalsProps {
  /** Number of petals to render. Keep low on mobile. */
  count?: number;
  /** Use `fixed` so petals follow the viewport across sections. */
  fixed?: boolean;
  className?: string;
}

export function SakuraPetals({ count = 18, fixed = false, className = "" }: SakuraPetalsProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 1 }}
    >
      {Array.from({ length: count }).map((_, i) => {
        // Deterministic pseudo-random so SSR/CSR match
        const left = (i * 37) % 100;
        const delay = -((i * 1.3) % 12);
        const duration = 9 + ((i * 7) % 9);
        const size = 8 + ((i * 5) % 10);
        const drift = ((i % 2 === 0 ? 1 : -1) * (20 + ((i * 13) % 60))) + "px";
        const spin = (180 + ((i * 47) % 540)) + "deg";
        const opacity = 0.45 + ((i * 11) % 50) / 100;
        return (
          <span
            key={i}
            className="petal"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              ["--drift" as never]: drift,
              ["--spin" as never]: spin,
              ["--petal-opacity" as never]: opacity,
            }}
          />
        );
      })}
    </div>
  );
}

export default SakuraPetals;
