"use client";

import { motion } from "framer-motion";
import { SceneTransition } from "../shared/SceneTransition";
import { PrimaryButton } from "../shared/PrimaryButton";
import { NARRATIVE_TEXTS } from "@/lib/content";

export function VirusSteal({ onAdvance }: { onAdvance: () => void }) {
  const t = NARRATIVE_TEXTS.virusSteal;
  return (
    <SceneTransition>
      <motion.div
        animate={{ rotate: [0, -8, 8, -8, 0] }}
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
