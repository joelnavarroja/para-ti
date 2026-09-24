"use client";

import { useState } from "react";
import { SceneTransition } from "../shared/SceneTransition";
import { RouletteWheel } from "../shared/RouletteWheel";
import { ConfettiBurst } from "../shared/ConfettiBurst";
import { NARRATIVE_TEXTS, ROULETTE_ROUND_1_SEGMENTS } from "@/lib/content";

const ALMOST_INDEXES = [4, 5];

export function RouletteRound1({ onAdvance }: { onAdvance: () => void }) {
  const [spins, setSpins] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const t = NARRATIVE_TEXTS.roulette1;
  const winningIndex = ALMOST_INDEXES[spins % ALMOST_INDEXES.length];

  function handleFinish() {
    setShowConfetti(true);
    window.setTimeout(() => {
      setShowConfetti(false);
      if (spins >= 1) {
        onAdvance();
      } else {
        setSpins((s) => s + 1);
      }
    }, 900);
  }

  return (
    <SceneTransition>
      {showConfetti && <ConfettiBurst variant="burst" />}
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
