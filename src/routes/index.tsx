import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

import { BackgroundMusic } from "../components/BackgroundMusic";
import { BackButton } from "../components/BackButton";
import { BirthdayIntro } from "../components/BirthdayIntro";
import { GalleryStep } from "../components/GalleryStep";
import { LoveLetter } from "../components/LoveLetter";
import { PageLoader } from "../components/PageLoader";
import { useAssetPreload } from "../hooks/useAssetPreload";

type Step = "birthdayIntro" | "gallery" | "letter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Prativa ✨" },
      {
        name: "description",
        content: "A magical birthday journey for Prativa — memories and a final video surprise.",
      },
      { property: "og:title", content: "Happy Birthday, Prativa ✨" },
      {
        property: "og:description",
        content: "A magical birthday journey for Prativa.",
      },
      { name: "theme-color", content: "#110f1c" },
    ],
  }),
  component: Index,
});

const GALLERY_IMAGES = import.meta.glob("/public/images/gallery-*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const GALLERY_VIDEOS = import.meta.glob("/videos/gallery-*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const FINAL_VIDEO_GLOB = import.meta.glob("/videos/final.*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function collectAssetUrls(): string[] {
  const urls: string[] = [];
  for (const url of Object.values(GALLERY_IMAGES)) urls.push(url);
  for (const url of Object.values(GALLERY_VIDEOS)) urls.push(url);
  for (const url of Object.values(FINAL_VIDEO_GLOB)) urls.push(url);
  urls.push("/memories/bg-music.mp3");
  return urls;
}

function Index() {
  const [currentStep, setCurrentStep] = useState<Step>("birthdayIntro");
  const goToGallery = useCallback(() => setCurrentStep("gallery"), []);
  const goToLetter = useCallback(() => setCurrentStep("letter"), []);
  const goBack = useCallback(() => {
    setCurrentStep((s) => (s === "letter" ? "gallery" : s === "gallery" ? "birthdayIntro" : s));
  }, []);
  const backLabel =
    currentStep === "letter" ? "Memories" : currentStep === "gallery" ? "Start" : "";
  const preloadUrls = useMemo(() => collectAssetUrls(), []);
  const { isReady: assetsReady, progress } = useAssetPreload(preloadUrls, 900);

  return (
    <>
      <main className="relative min-h-screen overflow-x-hidden bg-midnight text-cream">
        <BackgroundMusic />
        <AnimatePresence mode="wait">
          {currentStep === "birthdayIntro" && (
            <motion.section
              key="birthdayIntro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-x-0 top-0"
            >
              <BirthdayIntro onContinue={goToGallery} active={assetsReady} />
            </motion.section>
          )}
          {currentStep === "gallery" && (
            <motion.section
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-x-0 top-0"
            >
              <GalleryStep onUnlock={goToLetter} />
            </motion.section>
          )}
          {currentStep === "letter" && <LoveLetter key="letter" />}
        </AnimatePresence>
      </main>
      <PageLoader isLoading={!assetsReady} progress={progress} />
    </>
  );
}
