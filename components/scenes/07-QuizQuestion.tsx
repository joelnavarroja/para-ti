"use client";

import { useEffect, useState } from "react";
import { SceneTransition } from "../shared/SceneTransition";
import { PrimaryButton } from "../shared/PrimaryButton";
import { NumberPicker } from "./NumberPicker";
import { playChime } from "@/lib/sound";
import type { QuizQuestion } from "@/lib/content";

export function QuizQuestionScene({
  question,
  onAnswered,
}: {
  question: QuizQuestion;
  onAnswered: (answer: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (selected) {
      playChime();
    }
  }, [selected]);

  if (selected) {
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
              onClick={() => setSelected(opt)}
              className="min-h-[52px] rounded-xl border-2 border-amber-400/60 bg-amber-950/40 px-3 py-2 font-semibold text-amber-100 active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </SceneTransition>
  );
}
