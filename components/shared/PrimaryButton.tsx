"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { playTick } from "@/lib/sound";

export function PrimaryButton({
  children,
  onClick,
  variant = "gold",
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "gold" | "red";
}) {
  const palette =
    variant === "gold"
      ? "from-amber-400 via-yellow-300 to-amber-500 text-amber-950 shadow-amber-500/50"
      : "from-red-500 via-rose-500 to-red-600 text-white shadow-red-500/50";

  return (
    <motion.button
      type="button"
      onClick={() => {
        playTick();
        onClick();
      }}
      whileTap={{
        scale: [1, 0.88, 1.05, 0.94],
        rotate: [0, -3, 3, 0],
        transition: { duration: 0.28, ease: "easeOut" },
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 30px 8px rgba(251,191,36,0.6)",
      }}
      initial={{ scale: 1 }}
      transition={{ type: "tween", duration: 0.12 }}
      className={`min-h-[52px] min-w-[160px] rounded-full bg-gradient-to-br px-8 py-3 text-lg font-bold shadow-lg ${palette}`}
    >
      {children}
    </motion.button>
  );
}
