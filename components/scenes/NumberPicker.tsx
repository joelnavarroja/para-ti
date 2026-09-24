"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { playTick } from "@/lib/sound";

/**
 * Selector de número gamificado para la pregunta "numero" del quiz.
 * Reemplaza el grid genérico de 4 opciones por un grid grande y
 * scrollable (min..max) con feedback inmediato: micro-animación de
 * tap y un "tick" sonoro sintetizado por cada número pulsado.
 *
 * Mantiene el mismo contrato que el resto del quiz: invoca `onPick`
 * con el valor elegido (string) y deja que el componente padre
 * (QuizQuestionScene) gestione el flujo hacia `onAnswered`, sin tocar
 * la máquina de estados de escenas.
 */
export function NumberPicker({
  min,
  max,
  onPick,
}: {
  min: number;
  max: number;
  onPick: (value: string) => void;
}) {
  const [tapped, setTapped] = useState<number | null>(null);
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  function handlePick(n: number) {
    if (tapped !== null) return;
    setTapped(n);
    playTick();
    // Pequeño delay para que se vea la micro-animación antes de avanzar.
    window.setTimeout(() => onPick(String(n)), 220);
  }

  return (
    <div
      data-testid="number-picker"
      className="grid max-h-[50vh] w-full max-w-md grid-cols-5 gap-2 overflow-y-auto rounded-2xl border-2 border-amber-400/40 bg-amber-950/30 p-3"
    >
      {numbers.map((n) => {
        const isTapped = tapped === n;
        return (
          <motion.button
            key={n}
            type="button"
            data-testid="quiz-option"
            onClick={() => handlePick(n)}
            whileTap={{ scale: 0.85 }}
            animate={
              isTapped
                ? {
                    scale: [1, 1.35, 0.9, 1.15, 1],
                    rotate: [0, -8, 8, -4, 0],
                    backgroundColor: [
                      "rgba(251,191,36,0.15)",
                      "rgba(251,191,36,0.9)",
                      "rgba(251,191,36,0.6)",
                      "rgba(251,191,36,0.4)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-[44px] rounded-lg border border-amber-400/50 bg-amber-950/40 text-sm font-semibold text-amber-100"
          >
            {n}
          </motion.button>
        );
      })}
    </div>
  );
}
