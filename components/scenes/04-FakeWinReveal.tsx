"use client";

import { useEffect } from "react";
import { SceneTransition } from "../shared/SceneTransition";
import { PrimaryButton } from "../shared/PrimaryButton";
import { ConfettiBurst } from "../shared/ConfettiBurst";
import { NARRATIVE_TEXTS } from "@/lib/content";
import { playFanfare, playJackpot } from "@/lib/sound";

export function FakeWinReveal({ onAdvance }: { onAdvance: () => void }) {
  const t = NARRATIVE_TEXTS.fakeWin;

  useEffect(() => {
    // Sincronizado con el confeti que dispara ConfettiBurst al montar:
    // fanfarria clásica + jackpot superpuesto para que el "¡¡¡HAS
    // GANADO!!!" suene tan grande como se ve.
    playFanfare();
    window.setTimeout(() => playJackpot(), 120);
  }, []);

  return (
    <SceneTransition>
      <ConfettiBurst variant="realistic" />
      <h1 className="text-4xl font-extrabold text-amber-300">{t.title}</h1>
      <p className="text-xl text-amber-100/90">✈️ Viaje en avión ✈️</p>
      <p className="text-amber-100/80">{t.subtitle}</p>
      <PrimaryButton onClick={onAdvance}>{t.cta}</PrimaryButton>
    </SceneTransition>
  );
}
