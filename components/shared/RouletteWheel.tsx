"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TensionFX, type TensionPhase } from "./TensionFX";

const COLORS = ["#7f1d1d", "#111827"];
const SPIN_MS = 3600;
// La tensión (shake + redoble) ocupa el último tramo del giro, justo
// cuando la ruleta empieza a frenar, para que se sienta como "esto ya casi
// cae" en vez de una vibración plana durante los 3.6s enteros. building +
// flash terminan justo cuando termina el giro (onFinish sigue disparando
// a los mismos SPIN_MS de siempre) para no alargar el timing del flujo.
const BUILDING_MS = 900;
const FLASH_MS = 300;

export function RouletteWheel({
  segments,
  winningIndex,
  onFinish,
  label,
}: {
  segments: string[];
  winningIndex: number;
  onFinish: () => void;
  label: string;
}) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [phase, setPhase] = useState<TensionPhase>("idle");
  const segmentAngle = 360 / segments.length;

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setPhase("idle");
    const targetAngle =
      360 * 6 + (360 - winningIndex * segmentAngle - segmentAngle / 2);
    setRotation((prev) => prev + targetAngle);
    window.setTimeout(
      () => setPhase("building"),
      SPIN_MS - BUILDING_MS - FLASH_MS
    );
    window.setTimeout(() => setPhase("flash"), SPIN_MS - FLASH_MS);
    window.setTimeout(() => {
      setSpinning(false);
      setPhase("idle");
      onFinish();
    }, SPIN_MS);
  }

  const gradient = segments
    .map((_, i) => {
      const color = COLORS[i % COLORS.length];
      const start = (i / segments.length) * 360;
      const end = ((i + 1) / segments.length) * 360;
      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return (
    <TensionFX phase={phase} buildingMs={BUILDING_MS} flashMs={FLASH_MS}>
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-72 w-72" data-testid="roulette-wheel">
          <div className="absolute left-1/2 top-0 z-10 -ml-3 h-6 w-6 -translate-y-1/2 rotate-180 border-x-[12px] border-b-[18px] border-x-transparent border-b-amber-300" />
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 3.5, ease: [0.15, 0.7, 0.25, 1] }}
            className="h-full w-full rounded-full border-8 border-amber-300 shadow-2xl shadow-amber-500/30"
            style={{ background: `conic-gradient(${gradient})` }}
          >
            {segments.map((seg, i) => {
              const angle = (i + 0.5) * segmentAngle;
              return (
                <div
                  key={seg + i}
                  className="absolute left-1/2 top-1/2 w-28 origin-left text-center text-[10px] font-bold text-white"
                  style={{ transform: `rotate(${angle}deg) translateX(10px)` }}
                >
                  {seg}
                </div>
              );
            })}
          </motion.div>
        </div>
        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          data-testid="roulette-spin"
          className="min-h-[52px] min-w-[160px] rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 px-8 py-3 text-lg font-bold text-amber-950 shadow-lg shadow-amber-500/50 disabled:opacity-60"
        >
          {spinning ? "Girando..." : label}
        </button>
      </div>
    </TensionFX>
  );
}
