import { useEffect, useState } from "react";

/**
 * useAssetPreload
 * ---------------
 * Preloads an array of asset URLs (images, videos, audio) and reports
 * overall progress in [0..1]. Returns `isReady: true` once *every* asset
 * has finished loading (or failed, so we never block on a single broken
 * URL). Updates `progress` as each asset completes so the UI can show a
 * smooth, accurate bar.
 *
 * Videos are preloaded via hidden <video preload="auto"> elements so the
 * browser fetches and decodes enough of the file to play immediately.
 * Audio is preloaded via a hidden <audio preload="auto"> element.
 * Images use the standard `Image()` decoder.
 */

export interface AssetPreloadResult {
  isReady: boolean;
  progress: number; // 0..1
  loaded: number;
  total: number;
}

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // never block on a broken image
    img.src = url;
  });
}

function preloadVideo(url: string): Promise<void> {
  return new Promise((resolve) => {
    const v = document.createElement("video");
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.src = url;
    const done = () => resolve();
    v.addEventListener("canplaythrough", done, { once: true });
    v.addEventListener("loadeddata", done, { once: true });
    v.addEventListener("error", done, { once: true });
    // Some browsers never fire canplaythrough for very large files;
    // cap the wait at 12s so we never block forever.
    window.setTimeout(done, 12_000);
  });
}

function preloadAudio(url: string): Promise<void> {
  return new Promise((resolve) => {
    const a = new Audio();
    a.preload = "auto";
    a.src = url;
    const done = () => resolve();
    a.addEventListener("canplaythrough", done, { once: true });
    a.addEventListener("loadeddata", done, { once: true });
    a.addEventListener("error", done, { once: true });
    window.setTimeout(done, 8_000);
  });
}

function classify(url: string): "image" | "video" | "audio" {
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(clean)) return "video";
  if (/\.(mp3|wav|ogg|m4a|aac|flac)$/.test(clean)) return "audio";
  return "image";
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

  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();
    const total = urls.length;

    if (total === 0) {
      // Nothing to load — just respect the min-duration timer.
      const wait = Math.max(0, minDurationMs);
      window.setTimeout(() => {
        if (cancelled) return;
        setState({ isReady: true, progress: 1, loaded: 0, total: 0 });
      }, wait);
      return () => {
        cancelled = true;
      };
    }

    let loaded = 0;
    setState({ isReady: false, progress: 0, loaded: 0, total });

    const tick = () => {
      if (cancelled) return;
      loaded += 1;
      setState({
        isReady: false,
        progress: loaded / total,
        loaded,
        total,
      });
    };

    const tasks = urls.map((url) => {
      const kind = classify(url);
      const p =
        kind === "video"
          ? preloadVideo(url)
          : kind === "audio"
            ? preloadAudio(url)
            : preloadImage(url);
      return p.then(tick);
    });

    Promise.all(tasks).then(() => {
      if (cancelled) return;
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, minDurationMs - elapsed);
      window.setTimeout(() => {
        if (cancelled) return;
        setState({ isReady: true, progress: 1, loaded: total, total });
      }, wait);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urls.join("|")]);

  return state;
}

export default useAssetPreload;
