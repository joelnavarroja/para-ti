"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiBurst({
  variant = "burst",
  intense = false,
}: {
  variant?: "burst" | "cannon" | "realistic";
  intense?: boolean;
}) {
  useEffect(() => {
    if (variant === "cannon") {
      confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 } });
      return;
    }
    if (variant === "realistic") {
      // En modo "intense" (usado en el reveal final del pack opening) el
      // confeti dura más y lanza muchas más partículas por frame para un
      // efecto mucho más dramático.
      const duration = intense ? 3500 : 2000;
      const particlesPerBurst = intense ? 8 : 3;
      const end = Date.now() + duration;
      if (intense) {
        confetti({
          particleCount: 200,
          spread: 160,
          startVelocity: 55,
          origin: { y: 0.5 },
          colors: ["#fbbf24", "#f43f5e", "#facc15", "#ffffff"],
        });
      }
      (function frame() {
        confetti({
          particleCount: particlesPerBurst,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#fbbf24", "#f43f5e", "#facc15"],
        });
        confetti({
          particleCount: particlesPerBurst,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#fbbf24", "#f43f5e", "#facc15"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
      return;
    }
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
  }, [variant, intense]);

  return null;
}
