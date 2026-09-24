"use client";

import { SceneTransition } from "../shared/SceneTransition";
import { PrimaryButton } from "../shared/PrimaryButton";
import { NARRATIVE_TEXTS } from "@/lib/content";

export function IntroScreen({ onAdvance }: { onAdvance: () => void }) {
  const t = NARRATIVE_TEXTS.intro;
  return (
    <SceneTransition>
      <h1 className="text-4xl font-extrabold text-amber-300">🎉 {t.title} 🎉</h1>
      <p className="text-lg text-amber-100/80">{t.subtitle}</p>
      <PrimaryButton onClick={onAdvance}>Empezar</PrimaryButton>
    </SceneTransition>
  );
}
