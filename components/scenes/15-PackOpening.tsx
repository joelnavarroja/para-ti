"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SceneTransition } from "../shared/SceneTransition";
import { ConfettiBurst } from "../shared/ConfettiBurst";
import { NARRATIVE_TEXTS } from "@/lib/content";
import { playDrumroll, playRip, playFanfare, duckMusic } from "@/lib/sound";

type Phase = "idle" | "tension" | "tear" | "flash" | "reveal";

// Duración total de la secuencia dramática (>= 4-5s) estilo apertura de
// sobre de cartas: tensión creciente -> rasgado -> flash -> reveal.
const TENSION_MS = 3200;
const TEAR_MS = 900;
const FLASH_MS = 350;

export function PackOpening() {
  const [phase, setPhase] = useState<Phase>("idle");
  const t = NARRATIVE_TEXTS.packOpening;

  useEffect(() => {
    if (phase !== "tension") return;
    duckMusic(TENSION_MS + TEAR_MS + FLASH_MS + 800);
    playDrumroll(TENSION_MS / 1000);
    const toTear = window.setTimeout(() => setPhase("tear"), TENSION_MS);
    return () => window.clearTimeout(toTear);
  }, [phase]);

  useEffect(() => {
    if (phase !== "tear") return;
    playRip();
    const toFlash = window.setTimeout(() => setPhase("flash"), TEAR_MS);
    return () => window.clearTimeout(toFlash);
  }, [phase]);

  useEffect(() => {
    if (phase !== "flash") return;
    const toReveal = window.setTimeout(() => setPhase("reveal"), FLASH_MS);
    return () => window.clearTimeout(toReveal);
  }, [phase]);

  useEffect(() => {
    if (phase !== "reveal") return;
    playFanfare();
    duckMusic(1300);
  }, [phase]);

  const isOpening = phase !== "idle" && phase !== "reveal";

  return (
    <SceneTransition>
      <h1 className="text-2xl font-extrabold text-amber-300">{t.title}</h1>
      <p className="text-amber-100/80">{t.subtitle}</p>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <div key="pack" className="relative flex h-64 w-44 items-center justify-center">
            {/*
              El glow pulsante se hacía antes animando `boxShadow` en bucle
              infinito: boxShadow no es una propiedad "compositable" (el
              navegador tiene que repintar en cada frame), así que un pulso
              infinito de eso es caro de forma gratuita mientras el usuario
              solo está mirando el sobre cerrado. Lo sustituimos por una capa
              de aura aparte que solo anima `opacity`/`scale` (compositor).
            */}
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-2xl bg-amber-400 blur-xl"
              style={{ willChange: "opacity, transform" }}
              animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.96, 1.08, 0.96] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex h-64 w-44 items-center justify-center rounded-2xl border-4 border-amber-300 bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 shadow-xl shadow-amber-500/40">
              <button
                type="button"
                onClick={() => setPhase("tension")}
                data-testid="pack-button"
                className="text-5xl"
              >
                🎁
              </button>
            </div>
          </div>
        )}

        {isOpening && (
          <motion.div
            key="opening"
            data-testid="pack-opening"
            initial={{ scale: 1, rotate: 0 }}
            animate={
              phase === "tension"
                ? {
                    // Vibración/shake creciente: la amplitud del temblor
                    // aumenta a medida que se acerca el rasgado.
                    x: [0, -2, 2, -2, 2, -4, 4, -6, 6, -10, 10, 0],
                    rotate: [0, -1, 1, -1, 1, -2, 2, -3, 3, -5, 5, 0],
                    boxShadow: [
                      "0 0 20px 4px rgba(251,191,36,0.4)",
                      "0 0 60px 16px rgba(251,191,36,0.9)",
                      "0 0 20px 4px rgba(251,191,36,0.4)",
                      "0 0 90px 24px rgba(255,255,255,0.9)",
                    ],
                  }
                : phase === "tear"
                  ? {
                      scaleX: [1, 1.4, 1.8],
                      scaleY: [1, 1.1, 0.6],
                      rotate: [0, 6, -4],
                      opacity: [1, 1, 0],
                    }
                  : {
                      scale: [1, 3],
                      opacity: [1, 1],
                    }
            }
            transition={{
              duration:
                phase === "tension"
                  ? TENSION_MS / 1000
                  : phase === "tear"
                    ? TEAR_MS / 1000
                    : FLASH_MS / 1000,
              ease: phase === "tension" ? "easeIn" : "easeOut",
            }}
            className="relative flex h-64 w-44 items-center justify-center rounded-2xl border-4 border-amber-300 bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600"
          >
            <span className="text-5xl">🎁</span>
            {phase === "flash" && (
              <motion.div
                className="fixed inset-0 z-50 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1] }}
                transition={{ duration: FLASH_MS / 1000 }}
              />
            )}
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ scale: 0.3, rotateY: -90, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "backOut" }}
            className="flex flex-col items-center gap-4"
          >
            <ConfettiBurst variant="realistic" intense />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/regalo-final.jpg"
              alt="Tu regalo"
              data-testid="final-gift-image"
              className="w-72 rounded-2xl border-4 border-amber-300 shadow-2xl shadow-amber-500/50"
            />
            <p className="text-xl font-bold text-amber-200">🎉 Feliz cumpleaños 🎉</p>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneTransition>
  );
}
