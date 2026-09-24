"use client";

import { SceneTransition } from "../shared/SceneTransition";
import { PrimaryButton } from "../shared/PrimaryButton";
import { NARRATIVE_TEXTS } from "@/lib/content";

export function EvaluationResult({ onAdvance }: { onAdvance: () => void }) {
  const t = NARRATIVE_TEXTS.evaluationResult;
  return (
    <SceneTransition>
      <h1 className="text-2xl font-extrabold text-red-400">{t.title}</h1>
      <p className="text-lg text-amber-100/80">{t.subtitle}</p>
      <PrimaryButton onClick={onAdvance}>{t.cta}</PrimaryButton>
    </SceneTransition>
  );
}
