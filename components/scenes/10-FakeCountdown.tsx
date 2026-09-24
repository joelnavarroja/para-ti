"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SceneTransition } from "../shared/SceneTransition";
import { NARRATIVE_TEXTS } from "@/lib/content";

export function FakeCountdown({ onAdvance }: { onAdvance: () => void }) {
  const t = NARRATIVE_TEXTS.fakeCountdown;
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count === 0) {
      const timer = window.setTimeout(onAdvance, 700);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setCount((c) => c - 1), 800);
    return () => window.clearTimeout(timer);
  }, [count, onAdvance]);

  return (
    <SceneTransition>
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
    </SceneTransition>
  );
}
