"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SceneTransition } from "../shared/SceneTransition";
import { RouletteWheel } from "../shared/RouletteWheel";
import { ConfettiBurst } from "../shared/ConfettiBurst";
import { NARRATIVE_TEXTS, ROULETTE_ROUND_2_SEGMENTS } from "@/lib/content";
import { playFanfare, playJackpot } from "@/lib/sound";

const WINNING_INDEX = 2;
// Este es el segundo momento más grande de todo el flujo (justo por
// detrás del reveal final del pack opening): mucha más tensión que la
// ronda 1 (ver `tensionIntensity`) y una curva de easing con una caída
// mucho más lenta/dramática en el último tramo del giro antes de parar
// (no solo más duración, la forma de la curva cambia).
const ROUND2_TENSION_INTENSITY = 2.2;
const ROUND2_SPIN_EASE: [number, number, number, number] = [0.05, 0.9, 0.02, 1];
// Ventana de la "explosión" final tras parar el giro: flash + confeti +
// sonido en capas antes de avanzar de escena.
const LANDING_MS = 2200;

export function RouletteRound2({ onAdvance }: { onAdvance: () => void }) {
  const [landed, setLanded] = useState(false);
  const t = NARRATIVE_TEXTS.roulette2;

  function handleFinish() {
    setLanded(true);
    // Sonido en capas: fanfarria clásica del reveal + el "jackpot" grande
    // (campanas + sparkle) superpuesto, para que suene más grande que el
    // fanfare solo del round 1 / pack opening.
    playFanfare();
    window.setTimeout(() => playJackpot(), 120);
    window.setTimeout(onAdvance, LANDING_MS);
  }

  return (
    <SceneTransition>
      <AnimatePresence>
        {landed && (
          <motion.div
            data-testid="roulette2-flash"
            className="pointer-events-none fixed inset-0 z-40 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
      {landed && <ConfettiBurst variant="realistic" intense />}
      <h1 className="text-3xl font-extrabold text-amber-300">{t.title}</h1>
      <p className="text-amber-100/80">{t.subtitle}</p>
      <RouletteWheel
        segments={ROULETTE_ROUND_2_SEGMENTS}
        winningIndex={WINNING_INDEX}
        onFinish={handleFinish}
        label={t.spinCta}
        tensionIntensity={ROUND2_TENSION_INTENSITY}
        spinEase={ROUND2_SPIN_EASE}
      />
    </SceneTransition>
  );
}
