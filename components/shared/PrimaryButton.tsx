"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

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
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "tween", duration: 0.12 }}
      className={`min-h-[52px] min-w-[160px] rounded-full bg-gradient-to-br px-8 py-3 text-lg font-bold shadow-lg ${palette}`}
    >
      {children}
    </motion.button>
  );
}
