"use client";

import { SceneTransition } from "../shared/SceneTransition";
import { PrimaryButton } from "../shared/PrimaryButton";
import { NARRATIVE_TEXTS } from "@/lib/content";

export function QuizIntro({ onAdvance }: { onAdvance: () => void }) {
  const t = NARRATIVE_TEXTS.quizIntro;
  return (
    <SceneTransition>
      <h1 className="text-3xl font-extrabold text-amber-300">🍀 {t.title}</h1>
      <p className="text-amber-100/80">{t.subtitle}</p>
      <PrimaryButton onClick={onAdvance}>{t.cta}</PrimaryButton>
    </SceneTransition>
  );
}
