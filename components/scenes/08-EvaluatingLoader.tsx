"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { SceneTransition } from "../shared/SceneTransition";
import { NARRATIVE_TEXTS } from "@/lib/content";

export function EvaluatingLoader({ onAdvance }: { onAdvance: () => void }) {
  const t = NARRATIVE_TEXTS.evaluating;

  useEffect(() => {
    const timer = window.setTimeout(onAdvance, 2200);
    return () => window.clearTimeout(timer);
  }, [onAdvance]);

  return (
    <SceneTransition>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-12 w-12 rounded-full border-4 border-amber-400 border-t-transparent"
      />
      <p className="text-lg text-amber-100/80">{t.title}</p>
    </SceneTransition>
  );
}
