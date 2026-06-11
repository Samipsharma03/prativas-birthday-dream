import { useEffect, useRef } from "react";

/**
 * BackgroundMusic
 * ---------------
 * A persistent, *invisible* background-music player for the birthday site.
 *
 * Mounted while the `gallery` and `letter` steps are active so the same
 * audio element keeps playing seamlessly across step transitions. A
 * `bg-music-fade-out` event is dispatched only when the final video is
 * about to begin; BackgroundMusic then fades to 0 over 1.5s and tears
 * down the `<audio>` element so there is zero overlap with video audio.
 *
 * Behaviour
 * ─────────
 *   • Music starts automatically the moment the component mounts.
 *   • If the browser blocks the unprompted autoplay, the music starts the
 *     instant the user makes their first interaction anywhere on the page.
 *   • Volume is intentionally soft (DEFAULT_VOLUME) so the music sits gently
 *     behind the gallery.
 *   • No controls are rendered at all — there is nothing for the user to
 *     press, toggle, or adjust.
 */

const DEFAULT_VOLUME = 0.25; // soft — sits behind the content
const FADE_OUT_MS = 3500; // slow fade before final video begins
const SRC = "/memories/bg-music.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  // ───────────────────────────────────────────────────────────────────────
  // Build the audio element + (best-effort) autoplay
  // ───────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio(SRC);
    audio.loop = true;
    audio.volume = 0; // start silent; ramp up once playing is confirmed
    audio.preload = "auto";
    audioRef.current = audio;

    const startPlaying = () => {
      if (startedRef.current) return;
      // Some browsers reject the play() promise synchronously until a user
      // gesture has occurred. The rejection is swallowed silently — we then
      // try again on the first user interaction (see below).
      const result = audio.play();
      if (result && typeof result.then === "function") {
        result
          .then(() => {
            startedRef.current = true;
            fadeTo(DEFAULT_VOLUME, 1500);
          })
          .catch(() => {
            // Autoplay blocked. We'll start on the first user interaction.
            startedRef.current = false;
          });
      } else {
        // Very old browsers without a real promise — assume success.
        startedRef.current = true;
        fadeTo(DEFAULT_VOLUME, 1500);
      }
    };

    // Try to autoplay as soon as the audio is ready.
    const tryAutoplay = () => {
      startPlaying();
    };

    if (audio.readyState >= 2 /* HAVE_CURRENT_DATA */) {
      tryAutoplay();
    } else {
      audio.addEventListener("canplay", tryAutoplay, { once: true });
    }

    // Fallback: any user gesture counts as "permission" to start sound.
    // We listen with capture + once-style handlers so a single interaction
    // is enough; subsequent interactions are no-ops.
    const onFirstInteraction = () => {
      if (startedRef.current) return;
      startPlaying();
    };

    const interactionEvents: (keyof WindowEventMap)[] = [
      "pointerdown",
      "click",
      "touchstart",
      "keydown",
      "scroll",
    ];

    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, onFirstInteraction, {
        once: true,
        passive: true,
        capture: true,
      });
    });

    return () => {
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, onFirstInteraction, true);
      });
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
        fadeFrameRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───────────────────────────────────────────────────────────────────────
  // Smooth rAF-based volume ramp. Re-entrant-safe.
  // ───────────────────────────────────────────────────────────────────────
  const fadeTo = (toVolume: number, durationMs: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }

    const startVolume = audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // easeInOutCubic for a perceptually smooth ramp
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const next = startVolume + (toVolume - startVolume) * eased;
      // Clamp — never let a stray float push the volume above 1
      audio.volume = Math.max(0, Math.min(1, next));

      if (t < 1) {
        fadeFrameRef.current = requestAnimationFrame(step);
      } else {
        fadeFrameRef.current = null;
        audio.volume = toVolume;
      }
    };

    fadeFrameRef.current = requestAnimationFrame(step);
  };

  // ───────────────────────────────────────────────────────────────────────
  // Listen for the fade-out event fired when the user opens the final video.
  // After fading to 0, we completely stop the audio (pause + clear src).
  // ───────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleFadeOut = () => {
      const audio = audioRef.current;
      if (!audio) return;

      // Cancel any in-flight fade.
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
        fadeFrameRef.current = null;
      }

      const startVolume = audio.volume;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / FADE_OUT_MS);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const next = startVolume + (0 - startVolume) * eased;
        audio.volume = Math.max(0, next);

        if (t < 1) {
          fadeFrameRef.current = requestAnimationFrame(step);
        } else {
          fadeFrameRef.current = null;
          audio.volume = 0;
          // Completely stop + release the element so no sound can leak.
          audio.pause();
          audio.removeAttribute("src");
          audio.load();
        }
      };

      fadeFrameRef.current = requestAnimationFrame(step);
    };

    window.addEventListener("bg-music-fade-out", handleFadeOut);
    return () => {
      window.removeEventListener("bg-music-fade-out", handleFadeOut);
    };
  }, []);

  // This component intentionally renders nothing — no controls, no bubble.
  return null;
}

export default BackgroundMusic;
