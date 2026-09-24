"use client";

import { useState } from "react";
import { SceneTransition } from "../shared/SceneTransition";
import { PrimaryButton } from "../shared/PrimaryButton";
import { NARRATIVE_TEXTS } from "@/lib/content";

export function GiftEatenNotification({ onAdvance }: { onAdvance: () => void }) {
  const t = NARRATIVE_TEXTS.giftEatenNotice;
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <SceneTransition>
      {step === 1 ? (
        <>
          <p className="text-2xl font-bold text-amber-300">🔔 {t.step1}</p>
          <PrimaryButton onClick={() => setStep(2)}>Ver</PrimaryButton>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold text-red-400">😱 {t.step2}</p>
          <PrimaryButton onClick={onAdvance}>{t.cta}</PrimaryButton>
        </>
      )}
    </SceneTransition>
  );
}
