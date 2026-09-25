"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SceneTransition } from "../shared/SceneTransition";
import { RouletteWheel } from "../shared/RouletteWheel";
import { NARRATIVE_TEXTS, ROULETTE_ROUND_1_SEGMENTS } from "@/lib/content";
import { playComicHonk } from "@/lib/sound";

const ALMOST_INDEXES = [4, 5];
// Se mantiene por debajo del presupuesto que esperan los tests e2e
// (SPIN_MS 3600 + este valor debe caber con margen dentro de la espera
// fija de 5000ms de tests/e2e/*.spec.ts).
const RESULT_MS = 700;

// Ronda 1 está amañada a propósito (solo puede caer en "Nada"/"Casi...",
// nunca en un premio real): es el gancho cómico antes de la deuda falsa.
// Antes no había ningún texto de resultado tras el giro (solo confeti, que
// además confundía porque parece un festejo de premio real). Ahora se
// muestra explícitamente en qué cayó, con un honk cómico en vez de confeti
// de "victoria", para que quede claro que es una tomadura de pelo y no un
// bug.
export function RouletteRound1({ onAdvance }: { onAdvance: () => void }) {
  const [spins, setSpins] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const t = NARRATIVE_TEXTS.roulette1;
  const winningIndex = ALMOST_INDEXES[spins % ALMOST_INDEXES.length];

  function handleFinish() {
    playComicHonk();
    setResult(ROULETTE_ROUND_1_SEGMENTS[winningIndex]);
    window.setTimeout(() => {
      setResult(null);
      if (spins >= 1) {
        onAdvance();
      } else {
        setSpins((s) => s + 1);
      }
    }, RESULT_MS);
  }

  return (
    <SceneTransition>
      <AnimatePresence>
        {result && (
          <motion.p
            key={result}
            data-testid="roulette1-result"
            className="text-2xl font-extrabold text-red-300"
            initial={{ scale: 0.4, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 14 }}
          >
            Te ha tocado: {result}
          </motion.p>
        )}
      </AnimatePresence>
      <h1 className="text-3xl font-extrabold text-amber-300">{t.title}</h1>
      <p className="text-amber-100/80">{t.subtitle}</p>
      <RouletteWheel
        segments={ROULETTE_ROUND_1_SEGMENTS}
        winningIndex={winningIndex}
        onFinish={handleFinish}
        label={t.spinCta}
      />
    </SceneTransition>
  );
}
