import { useEffect, useRef } from "react";

/**
 * BackgroundMusic
 * ---------------
 * Persistent, invisible background-music player.
 *
 * - Plays continuously across all steps (intro, gallery, letter).
 * - Fades to silence + PAUSES (does NOT tear down the element) when the
 *   final video begins, eliminating the audio "pop" that comes from
 *   abruptly tearing down a WebAudio source.
 * - Fades back up if the user closes the final video.
 *
 * Events:
 *   • "bg-music-fade-out" — fade volume to 0 and pause (no teardown).
 *   • "bg-music-fade-in"  — resume playback and fade volume back up.
 */

const DEFAULT_VOLUME = 0.22;
const FADE_OUT_MS = 1400;
const FADE_IN_MS = 1200;
const SRC = "/memories/bg-music.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(SRC);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    // Keep the element alive even when "paused" — never null its src so
    // the audio device stays open and resuming is glitch-free.
    audioRef.current = audio;

    const startPlaying = () => {
      if (startedRef.current) return;
      const result = audio.play();
      if (result && typeof result.then === "function") {
        result
          .then(() => {
            startedRef.current = true;
            fadeTo(DEFAULT_VOLUME, 1500);
          })
          .catch(() => {
            startedRef.current = false;
          });
      } else {
        startedRef.current = true;
        fadeTo(DEFAULT_VOLUME, 1500);
      }
    };

    if (audio.readyState >= 2) startPlaying();
    else audio.addEventListener("canplay", startPlaying, { once: true });

    const onFirstInteraction = () => {
      if (!startedRef.current) startPlaying();
    };
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "click",
      "touchstart",
      "touchend",
      "keydown",
      "scroll",
    ];
    // NOT once:true — keep retrying until audio actually starts (mobile
    // sometimes ignores the first gesture if audio isn't decoded yet).
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, onFirstInteraction, true));
    };
    events.forEach((e) =>
      window.addEventListener(e, onFirstInteraction, {
        passive: true,
        capture: true,
      }),
    );
    // Poll: once started, remove the listeners.
    const poll = window.setInterval(() => {
      if (startedRef.current) {
        cleanup();
        window.clearInterval(poll);
      }
    }, 250);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onFirstInteraction, true));
      audio.pause();
      audioRef.current = null;
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
        fadeFrameRef.current = null;
      }
    };
  }, []);

  const fadeTo = (
    toVolume: number,
    durationMs: number,
    onDone?: () => void,
  ) => {
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
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const next = startVolume + (toVolume - startVolume) * eased;
      audio.volume = Math.max(0, Math.min(1, next));
      if (t < 1) {
        fadeFrameRef.current = requestAnimationFrame(step);
      } else {
        fadeFrameRef.current = null;
        audio.volume = toVolume;
        onDone?.();
      }
    };
    fadeFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const handleFadeOut = () => {
      const audio = audioRef.current;
      if (!audio) return;
      // Fade to 0, then PAUSE only (do not null the src). Pausing while
      // the element is silent prevents the speaker pop entirely.
      fadeTo(0, FADE_OUT_MS, () => {
        try {
          audio.pause();
        } catch {
          /* ignore */
        }
      });
    };

    const handleFadeIn = () => {
      const audio = audioRef.current;
      if (!audio) return;
      // Resume softly from silence.
      audio.volume = 0;
      const result = audio.play();
      if (result && typeof result.then === "function") {
        result.then(() => fadeTo(DEFAULT_VOLUME, FADE_IN_MS)).catch(() => {});
      } else {
        fadeTo(DEFAULT_VOLUME, FADE_IN_MS);
      }
    };

    window.addEventListener("bg-music-fade-out", handleFadeOut);
    window.addEventListener("bg-music-fade-in", handleFadeIn);
    return () => {
      window.removeEventListener("bg-music-fade-out", handleFadeOut);
      window.removeEventListener("bg-music-fade-in", handleFadeIn);
    };
  }, []);

  return null;
}

export default BackgroundMusic;
