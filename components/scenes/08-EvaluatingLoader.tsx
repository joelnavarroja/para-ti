"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SceneTransition } from "../shared/SceneTransition";
import { TensionFX, type TensionPhase } from "../shared/TensionFX";
import { NARRATIVE_TEXTS } from "@/lib/content";

// Presupuesto total idéntico al original (2200ms) para no romper el
// timing del flujo: solo repartimos ese tiempo en idle -> building -> flash
// -> advance, así el "veredicto" se siente construido en vez de instantáneo.
const BUILDING_START_MS = 1400;
const BUILDING_MS = 500;
const FLASH_MS = 300;

export function EvaluatingLoader({ onAdvance }: { onAdvance: () => void }) {
  const t = NARRATIVE_TEXTS.evaluating;
  const [phase, setPhase] = useState<TensionPhase>("idle");

  useEffect(() => {
    const toBuilding = window.setTimeout(
      () => setPhase("building"),
      BUILDING_START_MS
    );
    const toFlash = window.setTimeout(
      () => setPhase("flash"),
      BUILDING_START_MS + BUILDING_MS
    );
    const toAdvance = window.setTimeout(
      onAdvance,
      BUILDING_START_MS + BUILDING_MS + FLASH_MS
    );
    return () => {
      window.clearTimeout(toBuilding);
      window.clearTimeout(toFlash);
      window.clearTimeout(toAdvance);
    };
  }, [onAdvance]);

  return (
    <SceneTransition>
      <TensionFX phase={phase} buildingMs={BUILDING_MS} flashMs={FLASH_MS}>
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 rounded-full border-4 border-amber-400 border-t-transparent"
          />
          <p className="text-lg text-amber-100/80">{t.title}</p>
        </div>
      </TensionFX>
    </SceneTransition>
  );
}
