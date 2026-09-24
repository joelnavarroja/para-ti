"use client";

import { useEffect, useState } from "react";
import { SceneTransition } from "../shared/SceneTransition";
import { PrimaryButton } from "../shared/PrimaryButton";
import { NumberPicker } from "./NumberPicker";
import { TensionFX, type TensionPhase } from "../shared/TensionFX";
import { playChime, duckMusic } from "@/lib/sound";
import type { QuizQuestion } from "@/lib/content";

const BUILDING_MS = 450;
const FLASH_MS = 250;

export function QuizQuestionScene({
  question,
  onAnswered,
}: {
  question: QuizQuestion;
  onAnswered: (answer: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState<TensionPhase>("idle");

  useEffect(() => {
    if (!selected) return;
    setPhase("building");
    const toFlash = window.setTimeout(() => setPhase("flash"), BUILDING_MS);
    const toReveal = window.setTimeout(() => {
      setPhase("idle");
      setRevealed(true);
    }, BUILDING_MS + FLASH_MS);
    return () => {
      window.clearTimeout(toFlash);
      window.clearTimeout(toReveal);
    };
  }, [selected]);

  useEffect(() => {
    if (revealed) {
      duckMusic(700);
      playChime();
    }
  }, [revealed]);

  if (selected && revealed) {
    return (
      <SceneTransition>
        <p className="text-lg text-amber-100/70">{question.question}</p>
        <p
          data-testid="quiz-response"
          className="text-2xl font-bold text-amber-300"
        >
          {question.response}
        </p>
        <PrimaryButton onClick={() => onAnswered(selected)}>
          Siguiente
        </PrimaryButton>
      </SceneTransition>
    );
  }

  return (
    <SceneTransition>
      <TensionFX phase={phase} buildingMs={BUILDING_MS} flashMs={FLASH_MS}>
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl font-extrabold text-amber-300">
            {question.question}
          </h2>
          {question.id === "numero" && question.numberRange ? (
            <NumberPicker
              min={question.numberRange.min}
              max={question.numberRange.max}
              onPick={setSelected}
            />
          ) : (
            <div className="grid w-full max-w-sm grid-cols-2 gap-3">
              {question.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  data-testid="quiz-option"
                  disabled={selected !== null}
                  onClick={() => setSelected(opt)}
                  className="min-h-[52px] rounded-xl border-2 border-amber-400/60 bg-amber-950/40 px-3 py-2 font-semibold text-amber-100 active:scale-95 disabled:opacity-60"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </TensionFX>
    </SceneTransition>
  );
}
