"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SceneTransition } from "../shared/SceneTransition";
import { TensionFX, type TensionPhase } from "../shared/TensionFX";
import { NARRATIVE_TEXTS } from "@/lib/content";

// El delay final tras llegar a 0 (700ms original) se reparte en
// building -> flash -> advance, así el "🎉" final llega tras un redoble
// en vez de aparecer plano.
const BUILDING_MS = 400;
const FLASH_MS = 300;

export function FakeCountdown({ onAdvance }: { onAdvance: () => void }) {
  const t = NARRATIVE_TEXTS.fakeCountdown;
  const [count, setCount] = useState(5);
  const [phase, setPhase] = useState<TensionPhase>("idle");

  useEffect(() => {
    if (count === 0) {
      setPhase("building");
      const toFlash = window.setTimeout(() => setPhase("flash"), BUILDING_MS);
      const toAdvance = window.setTimeout(
        onAdvance,
        BUILDING_MS + FLASH_MS
      );
      return () => {
        window.clearTimeout(toFlash);
        window.clearTimeout(toAdvance);
      };
    }
    const timer = window.setTimeout(() => setCount((c) => c - 1), 800);
    return () => window.clearTimeout(timer);
  }, [count, onAdvance]);

  return (
    <SceneTransition>
      <TensionFX phase={phase} buildingMs={BUILDING_MS} flashMs={FLASH_MS}>
        <div className="flex flex-col items-center gap-6">
          <p className="text-lg text-amber-100/80">{t.subtitle}</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              data-testid="countdown-number"
              className="text-7xl font-black text-amber-300"
            >
              {count === 0 ? "🎉" : count}
            </motion.div>
          </AnimatePresence>
          {count === 0 && (
            <p className="text-lg font-bold text-amber-100">{t.title}</p>
          )}
        </div>
      </TensionFX>
    </SceneTransition>
  );
}
