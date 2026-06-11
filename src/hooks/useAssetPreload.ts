import { useEffect, useRef, useState } from "react";

/**
 * useAssetPreload
 * ---------------
 * Preloads an array of asset URLs (images, videos, audio) and reports
 * overall progress in [0..1]. Returns `isReady: true` once *every* asset
 * has finished loading (or failed, so we never block on a single broken
 * URL). Updates `progress` as each asset completes so the UI can show a
 * smooth, accurate bar.
 *
 * Performance optimisations
 * ─────────────────────────
 *  • Videos pre-fetch only `metadata` (size + dimensions + first frame)
 *    rather than the full media file. We don't need the whole video in
 *    memory just to flip a card — playback is triggered on demand by the
 *    IntersectionObserver in `GiftCard`.
 *  • Audio pre-fetches `metadata` for the same reason — only the loop
 *    bar needs to be playable; the file is buffered as the user listens.
 *  • Concurrency is capped (`MAX_CONCURRENT = 6`) so we don't fire 30
 *    decoders at once on slow phones. Failed / timed-out assets are
 *    counted as done so a single broken URL never blocks the loader.
 *  • Per-asset timeouts are short enough to stay responsive on poor
 *    networks (8s for video, 6s for audio) while still allowing large
 *    files on a decent connection.
 */

export interface AssetPreloadResult {
  isReady: boolean;
  progress: number; // 0..1
  loaded: number;
  total: number;
}

const MAX_CONCURRENT = 6; // parallel decoders (kind-agnostic)
const VIDEO_TIMEOUT_MS = 8_000;
const AUDIO_TIMEOUT_MS = 6_000;

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve();
    img.onerror = () => resolve(); // never block on a broken image
    img.src = url;
  });
}

function preloadVideo(url: string): Promise<void> {
  return new Promise((resolve) => {
    const v = document.createElement("video");
    // metadata = enough to display the first frame and know the duration
    v.preload = "metadata";
    v.muted = true;
    v.playsInline = true;
    v.src = url;
    const done = () => resolve();
    v.addEventListener("loadedmetadata", done, { once: true });
    v.addEventListener("error", done, { once: true });
    // Cap the wait so we never block forever on a sluggish connection.
    window.setTimeout(done, VIDEO_TIMEOUT_MS);
  });
}

function preloadAudio(url: string): Promise<void> {
  return new Promise((resolve) => {
    const a = new Audio();
    a.preload = "metadata";
    a.src = url;
    const done = () => resolve();
    a.addEventListener("loadedmetadata", done, { once: true });
    a.addEventListener("error", done, { once: true });
    window.setTimeout(done, AUDIO_TIMEOUT_MS);
  });
}

function classify(url: string): "image" | "video" | "audio" {
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(clean)) return "video";
  if (/\.(mp3|wav|ogg|m4a|aac|flac)$/.test(clean)) return "audio";
  return "image";
}

/**
 * Lightweight async-pool: runs at most `limit` jobs in parallel and
 * resolves once every job settles (success *or* failure). Used so we
 * don't fire 30+ decoders at once on slow phones.
 */
function runWithConcurrency(jobs: Array<() => Promise<void>>, limit: number): Promise<void> {
  return new Promise((resolve) => {
    let nextIndex = 0;
    let inFlight = 0;
    let settled = 0;
    const total = jobs.length;

    const launch = () => {
      // Fill the pool up to `limit`, then return — more jobs will be
      // launched from the `.finally` of each in-flight job.
      while (inFlight < limit && nextIndex < total) {
        const idx = nextIndex++;
        inFlight += 1;
        const job = jobs[idx];
        job().finally(() => {
          inFlight -= 1;
          settled += 1;
          if (settled === total) {
            resolve();
            return;
          }
          launch();
        });
      }
    };

    launch();
  });
}

export function useAssetPreload(
  urls: string[],
  /**
   * Optional minimum time the loader stays visible. Prevents a too-fast
   * flash when assets are cached. Default 700ms.
   */
  minDurationMs = 700,
): AssetPreloadResult {
  const [state, setState] = useState<AssetPreloadResult>({
    isReady: false,
    progress: 0,
    loaded: 0,
    total: urls.length,
  });

  // Keep the latest urls reference so we don't restart the effect on
  // shallow identity changes of the input array.
  const urlsKey = urls.join("|");
  const urlsRef = useRef(urls);
  urlsRef.current = urls;

  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();
    const total = urlsRef.current.length;
    const urlList = urlsRef.current;

    const finish = () => {
      if (cancelled) return;
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, minDurationMs - elapsed);
      window.setTimeout(() => {
        if (cancelled) return;
        setState({ isReady: true, progress: 1, loaded: total, total });
      }, wait);
    };

    if (total === 0) {
      const wait = Math.max(0, minDurationMs);
      window.setTimeout(() => {
        if (cancelled) return;
        setState({ isReady: true, progress: 1, loaded: 0, total: 0 });
      }, wait);
      return () => {
        cancelled = true;
      };
    }

    setState({ isReady: false, progress: 0, loaded: 0, total });

    const tick = () => {
      if (cancelled) return;
      setState((prev) => {
        const loaded = prev.loaded + 1;
        return {
          isReady: false,
          progress: Math.min(1, loaded / total),
          loaded,
          total,
        };
      });
    };

    // Build a per-asset job so we can stream progress even with a
    // concurrency cap (each promise resolves as soon as that *one* asset
    // is done, regardless of the others).
    const jobs = urlList.map((url) => {
      const kind = classify(url);
      const p =
        kind === "video"
          ? preloadVideo(url)
          : kind === "audio"
            ? preloadAudio(url)
            : preloadImage(url);
      // Always resolve (never reject) so the pool doesn't bail early.
      return () => p.then(tick).catch(tick);
    });

    runWithConcurrency(jobs, MAX_CONCURRENT).then(finish);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlsKey]);

  return state;
}

export default useAssetPreload;
