"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { playDrumroll, duckMusic } from "@/lib/sound";

const SHAKE_X = [0, -3, 3, -3, 3, -6, 6, -8, 8, -12, 12, -6, 0];
const SHAKE_ROTATE = [0, -0.5, 0.5, -0.5, 0.5, -1, 1, -1.5, 1.5, -2, 2, -1, 0];
const GLITCH_FILTER = [
  "hue-rotate(0deg) contrast(1)",
  "hue-rotate(25deg) contrast(1.5)",
  "hue-rotate(-25deg) contrast(1.3)",
  "hue-rotate(10deg) contrast(1.4)",
  "hue-rotate(0deg) contrast(1)",
];

export type TensionPhase = "idle" | "building" | "flash";

/**
 * Micro-momento "algo va a pasar" reutilizable: redoble de tambor +
 * shake de pantalla + glitch de color mientras `phase === "building"`,
 * y un flash blanco fullscreen mientras `phase === "flash"`. Extrae el
 * patrón introducido en 15-PackOpening.tsx para poder reutilizarlo en
 * cualquier escena con un reveal (ruleta, loader, countdown, quiz...)
 * sin duplicar la lógica de sonido/animación.
 */
export function TensionFX({
  phase,
  buildingMs = 900,
  flashMs = 300,
  intensity = 1,
  children,
}: {
  phase: TensionPhase;
  buildingMs?: number;
  flashMs?: number;
  /**
   * Multiplicador del shake/glitch (1 = intensidad original). Se usa para
   * hacer que momentos "más grandes" (ej. la ruleta final de la ronda 2)
   * se sientan más intensos que el resto sin duplicar el componente.
   */
  intensity?: number;
  children: ReactNode;
}) {
  useEffect(() => {
    if (phase === "building") {
      duckMusic(buildingMs + 400);
      playDrumroll(buildingMs / 1000);
    }
  }, [phase, buildingMs]);

  const shakeX = SHAKE_X.map((v) => v * intensity);
  const shakeRotate = SHAKE_ROTATE.map((v) => v * intensity);

  return (
    <>
      <motion.div
        animate={
          phase === "building"
            ? { x: shakeX, rotate: shakeRotate, filter: GLITCH_FILTER }
            : { x: 0, rotate: 0, filter: "hue-rotate(0deg) contrast(1)" }
        }
        transition={{ duration: buildingMs / 1000, ease: "easeIn" }}
      >
        {children}
      </motion.div>
      <AnimatePresence>
        {phase === "flash" && (
          <motion.div
            data-testid="tension-flash"
            className="pointer-events-none fixed inset-0 z-50 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: flashMs / 1000 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
