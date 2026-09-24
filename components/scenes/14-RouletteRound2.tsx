"use client";

import { useState } from "react";
import { SceneTransition } from "../shared/SceneTransition";
import { RouletteWheel } from "../shared/RouletteWheel";
import { ConfettiBurst } from "../shared/ConfettiBurst";
import { NARRATIVE_TEXTS, ROULETTE_ROUND_2_SEGMENTS } from "@/lib/content";

const WINNING_INDEX = 2;

export function RouletteRound2({ onAdvance }: { onAdvance: () => void }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const t = NARRATIVE_TEXTS.roulette2;

  function handleFinish() {
    setShowConfetti(true);
    window.setTimeout(onAdvance, 1400);
  }

  return (
    <SceneTransition>
      {showConfetti && <ConfettiBurst variant="cannon" />}
      <h1 className="text-3xl font-extrabold text-amber-300">{t.title}</h1>
      <p className="text-amber-100/80">{t.subtitle}</p>
      <RouletteWheel
        segments={ROULETTE_ROUND_2_SEGMENTS}
        winningIndex={WINNING_INDEX}
        onFinish={handleFinish}
        label={t.spinCta}
      />
    </SceneTransition>
  );
}
