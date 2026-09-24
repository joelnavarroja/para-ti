"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SceneTransition } from "../shared/SceneTransition";
import { PrimaryButton } from "../shared/PrimaryButton";
import { NumberPicker } from "./NumberPicker";
import { TensionFX, type TensionPhase } from "../shared/TensionFX";
import { ConfettiBurst } from "../shared/ConfettiBurst";
import { playChime, playJackpot, playDrumroll, playBigFlourish, duckMusic } from "@/lib/sound";
import type { QuizQuestion } from "@/lib/content";

const BUILDING_MS = 450;
const FLASH_MS = 250;
const IMPACT_MS = 1100;

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
  const [showImpact, setShowImpact] = useState(false);
  const isNumeroQuestion = question.id === "numero";

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
    if (!revealed) return;

    if (isNumeroQuestion) {
      // Payoff "numero": el generico playChime se queda corto para el
      // acierto del número, así que lo capamos con una cola de redoble
      // corta + un flourish grande sintetizado, y disparamos la
      // animación de impacto en pantalla ("¡ACIERTO!" + flash de color).
      duckMusic(1400);
      playChime();
      playDrumroll(0.35);
      window.setTimeout(() => playBigFlourish(), 200);
      setShowImpact(true);
      const toHideImpact = window.setTimeout(() => setShowImpact(false), IMPACT_MS);
      return () => window.clearTimeout(toHideImpact);
    }

    // Easter egg: si el nombre elegido es "Madian", el resultado suena
    // como un premio gordo (jackpot) en vez de la campanada genérica.
    // Punto de disparo elegido deliberadamente aquí (cuando se revela la
    // respuesta a cualquiera de las preguntas de GROUP_NAMES: "guapo",
    // "cadaver", "millonario") porque es el único lugar del flujo donde
    // "Madian" puede quedar seleccionado/resaltado como respuesta del
    // usuario; la ruleta nunca usa GROUP_NAMES, así que no hay otro punto
    // de "victoria" de Madian en toda la experiencia.
    if (selected === "Madian") {
      duckMusic(1600);
      playJackpot();
    } else {
      duckMusic(700);
      playChime();
    }
  }, [revealed, selected, isNumeroQuestion]);

  if (selected && revealed) {
    return (
      <SceneTransition>
        {isNumeroQuestion && <ConfettiBurst variant="realistic" intense />}
        <AnimatePresence>
          {showImpact && (
            <motion.div
              data-testid="quiz-impact-flash"
              className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-amber-400/0"
              initial={{ backgroundColor: "rgba(251,191,36,0)" }}
              animate={{
                backgroundColor: [
                  "rgba(251,191,36,0)",
                  "rgba(251,191,36,0.55)",
                  "rgba(251,191,36,0)",
                ],
              }}
              exit={{ backgroundColor: "rgba(251,191,36,0)" }}
              transition={{ duration: IMPACT_MS / 1000 }}
            >
              <motion.span
                data-testid="quiz-impact-text"
                className="text-6xl font-extrabold text-amber-950 drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]"
                initial={{ scale: 0.2, opacity: 0, rotate: -8 }}
                animate={{
                  scale: [0.2, 1.5, 0.85, 1.15, 1],
                  opacity: [0, 1, 1, 1, 1],
                  rotate: [-8, 4, -2, 0],
                }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                ¡ACIERTO!
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
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
