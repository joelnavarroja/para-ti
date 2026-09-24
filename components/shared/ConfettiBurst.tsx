"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiBurst({
  variant = "burst",
}: {
  variant?: "burst" | "cannon" | "realistic";
}) {
  useEffect(() => {
    if (variant === "cannon") {
      confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 } });
      return;
    }
    if (variant === "realistic") {
      const duration = 2000;
      const end = Date.now() + duration;
      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#fbbf24", "#f43f5e", "#facc15"],
        });
        confetti({
          particleCount: 3,
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
  }, [variant]);

  return null;
}
