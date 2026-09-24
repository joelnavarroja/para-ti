"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SceneTransition } from "../shared/SceneTransition";
import { PrimaryButton } from "../shared/PrimaryButton";
import { NARRATIVE_TEXTS } from "@/lib/content";
import { playComicHonk } from "@/lib/sound";

// Duración del "glitch" cómico de entrada: deliberadamente corto y
// ridículo (flash de color chillón, no blanco) para que se sienta
// absurdo/gracioso, no tenso ni de miedo.
const GLITCH_MS = 450;

export function VirusSteal({ onAdvance }: { onAdvance: () => void }) {
  const t = NARRATIVE_TEXTS.virusSteal;
  const [glitching, setGlitching] = useState(true);

  useEffect(() => {
    playComicHonk();
    const timer = window.setTimeout(() => setGlitching(false), GLITCH_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <SceneTransition>
      <AnimatePresence>
        {glitching && (
          <motion.div
            data-testid="virus-glitch-flash"
            className="pointer-events-none fixed inset-0 z-50 bg-fuchsia-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0, 0.35, 0, 0.2, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: GLITCH_MS / 1000 }}
          />
        )}
      </AnimatePresence>
      <motion.div
        animate={{
          rotate: [0, -8, 8, -8, 0],
          x: glitching ? [0, -12, 12, -16, 16, -6, 6, 0] : 0,
          scale: glitching ? [1, 1.35, 0.8, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.5, repeat: 3 }}
        className="text-6xl"
      >
        🦠
      </motion.div>
      <h1 className="text-3xl font-extrabold text-red-400">{t.title}</h1>
      <p className="text-amber-100/80">{t.subtitle}</p>
      <PrimaryButton variant="red" onClick={onAdvance}>
        {t.cta}
      </PrimaryButton>
    </SceneTransition>
  );
}
