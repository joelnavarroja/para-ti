"use client";

import { SceneTransition } from "../shared/SceneTransition";
import { PrimaryButton } from "../shared/PrimaryButton";
import { CounterBadge } from "../shared/CounterBadge";
import { NARRATIVE_TEXTS, FAKE_PAYMENT } from "@/lib/content";

export function DebtReveal({
  debt,
  onPay,
}: {
  debt: number;
  onPay: (newDebt: number) => void;
}) {
  const t = NARRATIVE_TEXTS.debtReveal;
  return (
    <SceneTransition>
      <h1 className="text-3xl font-extrabold text-red-400">😬 {t.title}</h1>
      <CounterBadge amount={debt || FAKE_PAYMENT.initialDebt} />
      <p className="text-amber-100/80">{t.subtitle}</p>
      <PrimaryButton
        variant="red"
        onClick={() =>
          onPay((debt || FAKE_PAYMENT.initialDebt) + FAKE_PAYMENT.retryFee)
        }
      >
        {t.cta}
      </PrimaryButton>
    </SceneTransition>
  );
}
