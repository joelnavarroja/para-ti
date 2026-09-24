"use client";

import { motion } from "framer-motion";
import { SceneTransition } from "../shared/SceneTransition";
import { PrimaryButton } from "../shared/PrimaryButton";
import { NARRATIVE_TEXTS } from "@/lib/content";
import { playFanfare } from "@/lib/sound";

export function IntroScreen({ onAdvance }: { onAdvance: () => void }) {
  const t = NARRATIVE_TEXTS.intro;
  return (
    <SceneTransition>
      <h1 className="text-4xl font-extrabold text-amber-300">
        <motion.span
          animate={{ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          🎉
        </motion.span>{" "}
        {t.title}{" "}
        <motion.span
          animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          🎉
        </motion.span>
      </h1>
      <p className="text-lg text-amber-100/80">{t.subtitle}</p>
      <PrimaryButton
        onClick={() => {
          // Sonido de arranque adicional al whoosh de transición de escena,
          // para que el primer click de toda la experiencia se sienta más
          // "evento especial" (además del startBackgroundMusic/playTick que
          // ya dispara PrimaryButton).
          playFanfare();
          onAdvance();
        }}
      >
        Empezar
      </PrimaryButton>
    </SceneTransition>
  );
}
