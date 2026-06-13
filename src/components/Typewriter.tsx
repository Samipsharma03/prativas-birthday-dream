import { useEffect, useState } from "react";

/**
 * Typewriter
 * ----------
 * Lightweight character-by-character text reveal. Renders the full text
 * invisibly to reserve layout space (no reflow as letters appear), then
 * fades each character in via opacity transition driven by a single
 * interval — cheap on mobile.
 */

interface TypewriterProps {
  text: string;
  /** ms per character */
  speed?: number;
  /** initial delay before typing starts */
  delayMs?: number;
  className?: string;
  /** Called once the full text is revealed */
  onComplete?: () => void;
}

export function Typewriter({
  text,
  speed = 28,
  delayMs = 200,
  className = "",
  onComplete,
}: TypewriterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let i = 0;
    let interval: ReturnType<typeof setInterval> | null = null;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          onComplete?.();
        }
      }, speed);
    }, delayMs);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, delayMs, onComplete]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      {count < text.length && (
        <span
          aria-hidden
          className="ml-0.5 inline-block w-[2px] -mb-0.5 h-[1em] translate-y-[3px] animate-pulse bg-current opacity-70"
        />
      )}
      {/* invisible full text reserves height to avoid layout shift */}
      <span aria-hidden className="invisible block h-0 overflow-hidden">
        {text}
      </span>
    </span>
  );
}

export default Typewriter;
